import SpineEnemy from '../SpineEnemy';
import { DIRECTION, SPINE_SCALE } from '../Enemy';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import AtlasConfig from '../../../config/AtlasConfig';
import { AtlasSprite } from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import SmokeEffect from './SmokeEffect';
import { FRAME_RATE, ENEMIES } from '../../../../../shared/src/CommonConstants';
import { Utils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';

const SMOKES_DESCRIPTORS =
	[
		{animationProgressMoment_num: 0.66, alpha: 0.7, x: 0, y: -7, scaleX: 1.2, scaleY: 1.3, rotation: 0.9, zIndex: -1},
		{animationProgressMoment_num: 0.33, alpha: 0.7, x: -4, y: -6, scaleX: 1.3, scaleY: 1.4, rotation: 1, zIndex: -1},
		{animationProgressMoment_num: 0, alpha: 0.7, x: -10, y: 0, scaleX: 1.3, scaleY: 1.6, rotation: 0.9, zIndex: -1},
		{animationProgressMoment_num: 0, alpha: 0.8, x: -2, y: 5, scaleX: 1.2, scaleY: 1.2, rotation: 0.8, zIndex: 3},
		{animationProgressMoment_num: 0.33, alpha: 0.9, x: -2, y: 5, scaleX: 1.2, scaleY: 1.2, rotation: 0.8, zIndex: 3},
		{animationProgressMoment_num: 0.66, alpha: 0.8, x: -2, y: 5, scaleX: 1.2, scaleY: 1.2, rotation: 0.8, zIndex: 3},
	];

const SMOKES_COUNT = SMOKES_DESCRIPTORS.length;

const SPINE_ANIMATION_FINAL_POINT = 2.6498166136779764;
const SPINE_ANIMATION_FRAME_TIME_OFFSET = 0.05;

let Embers = {
	textures: {
		narrowEmbers: null,
		wideEmbers: null,
		red_glow: null,
		green_glow: null
	}
};

Embers.setTexture = function (name, imageNames, configs, path) {
	if(!Embers.textures[name]){
		Embers.textures[name] = [];

		if(!Array.isArray(imageNames)) imageNames = [imageNames];
		if(!Array.isArray(configs)) configs = [configs];

		let assets = [];
		imageNames.forEach(function(item){assets.push(APP.library.getAsset(item))});

		Embers.textures[name] = AtlasSprite.getFrames(assets, configs, path);
		Embers.textures[name].sort(function(a, b){if(a._atlasName > b._atlasName) return 1; else return -1});
	}
};

Embers.generateEmbersTextures = function()
{
	Embers.setTexture('narrowEmbers', 'enemies/imp/imp_effects', AtlasConfig.ImpEffects, 'narrow_embers');
	Embers.setTexture('wideEmbers', 'enemies/imp/imp_effects', AtlasConfig.ImpEffects, 'wide_embers');
	Embers.setTexture('green_glow', 'enemies/imp/imp_effects', AtlasConfig.ImpEffects, 'green_glow');
	Embers.setTexture('red_glow', 'enemies/imp/imp_effects', AtlasConfig.ImpEffects, 'red_glow');
};

const JUMP_DISTANCES = [10, 6, -7, 0, -7, 16, -14, 3, -6, 10, 7, 16, -7, 5, -7, 11, -3];
const JUMP_SPEED = 1*FRAME_RATE;

const BASE_OFFSET_DISTANCE = 30;
const BASE_OFFSET_DURATION = 70*FRAME_RATE;

class ImpEnemy extends SpineEnemy
{
	static get EMBERS_ANIMATION_SPEED() { return 0.3 }

	constructor(params)
	{
		super(params);

		this._fFirstJumpIndex_int = (this.id%3 * 4) % JUMP_DISTANCES.length;
		let lOffsetDurationPercentCoef_num = this.id%2 == 0 ? 1 : -1;
		this._fOffsetDuration_num = ~~(BASE_OFFSET_DURATION * (100 + lOffsetDurationPercentCoef_num*this.id%3*5)/100);
		
		this._fRecoveryJumpDistance_num = 0;
		this._fRecoveryProgress_num = 1;
		this._fRecoveryPositionOffsetX_num = 0;
		this._fRecoveryPositionOffsetY_num = 0;

		this._fSmokesEffects_se_arr = [];
		this._fSmokeProgress_num = 0;
		this._fIsEffectsAnimationPaused_bl = false;

		this._initFX();
	}

	__generatePreciseCollisionBodyPartsNames()
	{
		return [
			"tail"
			];
	}

	__onBeforeNewTrajectoryApplied(aTrajectory_obj)
	{
		this._fRecoveryJumpDistance_num = this.getJumpCurrentY();
		this._fRecoveryPositionOffsetX_num = this.getPositionOffsetX();
		this._fRecoveryPositionOffsetY_num = this.getPositionOffsetY();
		this._fRecoveryProgress_num = 0;
	}

	getJumpProgress()
	{
		if (!!this.nextTurnPoint)
		{
			let lCurrentTime_num = APP.gameScreen.currentTime;
			let lTimeFinish_num = this.nextTurnPoint.time;
			
			let lProgress_num = 0;
			let lJumpIndex = this._fFirstJumpIndex_int;
			if (lCurrentTime_num <= lTimeFinish_num)
			{
				let lTimeRest_num = lTimeFinish_num - lCurrentTime_num;
				if (this.prevTurnPoint && (
										Utils.isEqualPoints(this.prevTurnPoint, this.nextTurnPoint)
										|| (this.prevTurnPoint.originalPoint && Utils.isEqualPoints(this.prevTurnPoint.originalPoint, this.nextTurnPoint))
										)
				)
				{
					let nnp = this.nextNextTurnPoint || this.nextTurnPoint;
					lTimeRest_num = nnp.time - this.nextTurnPoint.time;
				}

				let nnp = this.nextNextTurnPoint || this.nextTurnPoint;
				let lJumpsDuration_num = 0;
				let lCurJumpSpentDuration_num = 0;
				let i=this._fFirstJumpIndex_int;
				while (true)
				{
					let lCurJumpDuration = JUMP_SPEED*Math.abs(JUMP_DISTANCES[i]);
					if (lJumpsDuration_num + lCurJumpDuration >= lTimeRest_num)
					{
						lJumpIndex = i;
						lCurJumpSpentDuration_num = lCurJumpDuration - (lTimeRest_num - lJumpsDuration_num);
						lProgress_num = lCurJumpSpentDuration_num / lCurJumpDuration;
						break;
					}

					lJumpsDuration_num += lCurJumpDuration;

					i++;
					if (i >= JUMP_DISTANCES.length)
					{
						i=0;
					}
				}
			}

			return {timeProgress: lProgress_num, jumpIndex: lJumpIndex};
		}

		return null;
	}
	
	//override
	get isFreezeGroundAvailable()
	{
		return false;
	}

	//override
	upateCurrentNearbyTrajectoryPoints(prevTurnPoint, nextTurnPoint)
	{
		super.upateCurrentNearbyTrajectoryPoints(prevTurnPoint, nextTurnPoint);

		this.nextNextTurnPoint = this.findNextNextTrajectoryPoint() || this.nextTurnPoint;
	}

	findNextNextTrajectoryPoint()
	{
		if (!this.nextTurnPoint)
		{
			return null;
		}

		let npt = this.nextTurnPoint.time;
		let lMinTimeDelta = Number.MAX_VALUE;
		let trajectoryPoints = this.trajectory.points;
		let nnp = null;
		for (let point of trajectoryPoints)
		{
			if (point.time > npt)
			{
				let d = Math.abs(npt - point.time);
				if (d < lMinTimeDelta)
				{
					lMinTimeDelta = d;
					nnp = point;
				}
			}
		}

		return nnp;
	}

	getJumpCurrentY()
	{
		let lJumpProgress_obj = this.getJumpProgress();
		if (!lJumpProgress_obj)
		{
			return 0;
		}


		let lJumpHeight_num = JUMP_DISTANCES[lJumpProgress_obj.jumpIndex];
		let lJumpTimeProgress_num = lJumpProgress_obj.timeProgress;
		let lYOffsetProgress_num = 0;
		
		if (lJumpTimeProgress_num <= 0.5) // up state
		{
			lYOffsetProgress_num = lJumpTimeProgress_num * 2;
		}
		else if (lJumpTimeProgress_num > 0.5 && lJumpTimeProgress_num <= 1) // down state
		{
			lYOffsetProgress_num = (1-lJumpTimeProgress_num)*2;
		}
		
		let lResultY_num = lYOffsetProgress_num * lJumpHeight_num;

		return this._fRecoveryJumpDistance_num * (1 - this._fRecoveryProgress_num) + lResultY_num * this._fRecoveryProgress_num;
	}

	getPositionOffsetX()
	{
		let lOffsetTimeProgress_num = this.getOffsetTimeProgress();
		let lOffsetDistanceProgress_num = Math.sin(lOffsetTimeProgress_num * Math.PI);

		let lOffset_num = lOffsetDistanceProgress_num * BASE_OFFSET_DISTANCE;
		let lResultX_num = Math.cos(this._getVisualAngle()+Math.PI/2) * lOffset_num;

		return this._fRecoveryPositionOffsetX_num * (1 - this._fRecoveryProgress_num) + lResultX_num * this._fRecoveryProgress_num;
	}

	getPositionOffsetY()
	{
		let lOffsetTimeProgress_num = this.getOffsetTimeProgress();
		let lOffsetDistanceProgress_num = Math.sin(lOffsetTimeProgress_num * Math.PI);

		let lOffset_num = lOffsetDistanceProgress_num * BASE_OFFSET_DISTANCE;

		let lResultY_num = Math.sin(this._getVisualAngle()+Math.PI/2) * lOffset_num;

		return this._fRecoveryPositionOffsetY_num * (1 - this._fRecoveryProgress_num) + lResultY_num * this._fRecoveryProgress_num;
	}

	getOffsetTimeProgress()
	{
		if (!!this.nextTurnPoint)
		{
			let lCurrentTime_num = APP.gameScreen.currentTime;
			let lTimeFinish_num = this.nextTurnPoint.time;
			
			let lProgress_num = 0;
			if (lCurrentTime_num <= lTimeFinish_num)
			{
				let lTimeRest_num = lTimeFinish_num - lCurrentTime_num;
				if (this.prevTurnPoint && (
										Utils.isEqualPoints(this.prevTurnPoint, this.nextTurnPoint)
										|| (this.prevTurnPoint.originalPoint && Utils.isEqualPoints(this.prevTurnPoint.originalPoint, this.nextTurnPoint))
										)
				)
				{
					let nnp = this.nextNextTurnPoint || this.nextTurnPoint;
					lTimeRest_num = nnp.time - this.nextTurnPoint.time;
				}

				let lOffsetDuration_num = this._fOffsetDuration_num;
				lProgress_num = (lOffsetDuration_num-lTimeRest_num%lOffsetDuration_num) / lOffsetDuration_num;
			}

			return lProgress_num;
		}

		return 0;
	}

	_getVisualAngle()
	{
		if (this.nextTurnPoint && this.prevTurnPoint)
		{
			let lPoint1_pt = this.prevTurnPoint;
			let lPoint2_pt = this.nextTurnPoint;

			if (
					Utils.isEqualPoints(this.prevTurnPoint, this.nextTurnPoint)
					|| (this.prevTurnPoint.originalPoint && Utils.isEqualPoints(this.prevTurnPoint.originalPoint, this.nextTurnPoint))
				)
			{
				lPoint2_pt = this.nextNextTurnPoint || this.nextTurnPoint;
			}

			return Math.atan2(lPoint2_pt.y - lPoint1_pt.y, lPoint2_pt.x - lPoint1_pt.x);
		}

		return 0;
	}

	_hideEnemyEffectsBeforeDeath()
	{
		for( let i = 0; i < SMOKES_COUNT; i++ )
		{
			this._fSmokesEffects_se_arr[i] && this._fSmokesEffects_se_arr[i].stopAnimation();
		}

		if(this._fNarrowEmbers)
		{
			this._fNarrowEmbers.visible = false;
			this._fNarrowEmbers.stop();
		}

		if(this._fWideEmbers)
		{
			this._fWideEmbers.visible = false;
			this._fWideEmbers.stop();
		}

		if(this._fGlow_spr)
		{
			this._fGlow_spr.visible = false;
		}
	}

	_playDeathFxAnimation(aIsInstantKill_bl)
	{
		this._hideEnemyEffectsBeforeDeath();
		super._playDeathFxAnimation(aIsInstantKill_bl);
	}

	_getGlowDescriptor()
	{
		switch (this.direction)
		{
			case DIRECTION.LEFT_DOWN: 	this._fGlow_spr.position.set(3, 7);		break;
			case DIRECTION.LEFT_UP: 	this._fGlow_spr.position.set(-6, -4);	break;
			case DIRECTION.RIGHT_DOWN: 	this._fGlow_spr.position.set(12, 7);	break;
			case DIRECTION.RIGHT_UP: 	this._fGlow_spr.position.set(11, -2);	break;
		}
	}

	//override
	_createView(aShowAppearanceEffect_bl)
	{
		super._createView(aShowAppearanceEffect_bl);
	}

	_initFX()
	{

		//SMOKES...
		for( let i = 0; i < SMOKES_COUNT; i++ )
		{
			let lDescriptor_obj = SMOKES_DESCRIPTORS[i];

			this._fSmokesEffects_se_arr[i] = this.addChild(
				new SmokeEffect(lDescriptor_obj)
			);
		}
		//...SMOKES

		if(APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			//EMBERS...
			Embers.generateEmbersTextures();

			let lNarrowEmber_spr = this._fNarrowEmbers = this.addChild(new Sprite());
			lNarrowEmber_spr.textures = Embers.textures.narrowEmbers;
			lNarrowEmber_spr.blendMode = PIXI.BLEND_MODES.ADD;
			lNarrowEmber_spr.alpha = 1;
			lNarrowEmber_spr.scale.set(0.7*2);
			lNarrowEmber_spr.position.set(0, -30);
			lNarrowEmber_spr.loop = true;
			lNarrowEmber_spr.animationSpeed = ImpEnemy.EMBERS_ANIMATION_SPEED;

			let lWideEmber_spr = this._fWideEmbers = this.addChild(new Sprite());
			lWideEmber_spr.textures = Embers.textures.wideEmbers;
			lWideEmber_spr.blendMode = PIXI.BLEND_MODES.ADD;
			lWideEmber_spr.alpha = 1;
			lWideEmber_spr.scale.set(0.7*2);
			lWideEmber_spr.position.set(10, -30);
			lWideEmber_spr.loop = true;
			lWideEmber_spr.animationSpeed = ImpEnemy.EMBERS_ANIMATION_SPEED;	
			//...EMBERS

			//GLOW...
			let lGlow_spr = this.addChild(new Sprite());
			lGlow_spr.textures = this.name == ENEMIES.RedImp ? Embers.textures.red_glow : Embers.textures.green_glow;
			lGlow_spr.blendMode = PIXI.BLEND_MODES.ADD;
			lGlow_spr.scale.set(1.1*2);
			lGlow_spr.alpha = 1;
			lGlow_spr.position.set(3, 7);

			this._fGlow_spr = lGlow_spr;
			//...GLOW
		}
	}

	//override
	tick()
	{
		super.tick();

		let lProgress_num = this._fSmokeProgress_num;

		if(lProgress_num > SPINE_ANIMATION_FINAL_POINT)
		{
			this._fSmokeProgress_num = lProgress_num % SPINE_ANIMATION_FINAL_POINT;
		}
		else
		{
			lProgress_num += SPINE_ANIMATION_FRAME_TIME_OFFSET;
			this._fSmokeProgress_num = lProgress_num;
		}

		let lAnimationProgress_num = lProgress_num / SPINE_ANIMATION_FINAL_POINT;

		//SMOKES...
		for( let i = 0; i < SMOKES_COUNT; i++ )
		{
			let lDescriptor_obj = SMOKES_DESCRIPTORS[i];
			let lSmokeEffect_se = this._fSmokesEffects_se_arr[i];
			let lAnimationProgressMoment_num = lDescriptor_obj.animationProgressMoment_num;
			if(
				!this.isFrozen &&
				!lSmokeEffect_se.isPlaying() &&
				lAnimationProgress_num > lAnimationProgressMoment_num - SPINE_ANIMATION_FRAME_TIME_OFFSET &&
				lAnimationProgress_num < lAnimationProgressMoment_num + SPINE_ANIMATION_FRAME_TIME_OFFSET
				)
			{
				lSmokeEffect_se.zIndex = lDescriptor_obj.zIndex;
				lSmokeEffect_se.play();
			}
		}
		//...SMOKES

		if(APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{

			this._fNarrowEmbers.zIndex = 0;
			this._fWideEmbers.zIndex = 0;
			this._fNarrowEmbers.play();
			this._fWideEmbers.play();

			this._getGlowDescriptor();
			this._fGlow_spr.zIndex = 4;
		}

		if(
			!this.isFrozen &&
			!this.isStayState &&
			this._fRecoveryProgress_num < 1
			)
		{
			this._fRecoveryProgress_num += 0.01;

			if(this._fRecoveryProgress_num > 1)
			{
				this._fRecoveryProgress_num = 1;
			}
		}


		//EFFECTS TRANSPARENCY VALIDATION WHEN FROZEN|UNFROZEN...
		let lIsJustFrozen_bl = false;
		let lIsJustUnfrozen_bl = false;

		if(this.isFrozen)
		{
			lIsJustFrozen_bl = !this._fIsEffectsAnimationPaused_bl;
			lIsJustUnfrozen_bl = false;
			this._fIsEffectsAnimationPaused_bl = true;
		}
		else
		{
			lIsJustFrozen_bl = false;
			lIsJustUnfrozen_bl = this._fIsEffectsAnimationPaused_bl;
			this._fIsEffectsAnimationPaused_bl = false;
		}

		this._fIsEffectsAnimationPaused_bl = this.isFrozen;

		let lEffectsAlphaMultiplier_num = 1;
		let lIsUnfreezingOrNotFreezed_bl = true;

		if(this.isFrozen)
		{
			let lPoints_p_arr = this.trajectory.points;
			let lCurrentTime_num = APP.gameScreen.currentTime;
			let lFreezeMomentTime_num = lPoints_p_arr[0].time;

			let lFreezeProgress_num = (lFreezeMomentTime_num - lCurrentTime_num) / 3000;

			if(lFreezeProgress_num > 1)
			{
				lFreezeProgress_num = 1;
			}
			else if(lFreezeProgress_num < 0)
			{
				lFreezeProgress_num = 0;
			}

			lFreezeProgress_num = 1 - lFreezeProgress_num;

			let lAlphaIntroOutroProgressDuration_num = 0.16;
			let lOutroProgressBorder_num = 1 - lAlphaIntroOutroProgressDuration_num;

			//FREEZE INTRO...
			if(lFreezeProgress_num < lAlphaIntroOutroProgressDuration_num)
			{
				lIsUnfreezingOrNotFreezed_bl = false;
				lEffectsAlphaMultiplier_num = 1 - lFreezeProgress_num / lAlphaIntroOutroProgressDuration_num;
			}
			//...FREEZE INTRO
			else
			//FREEZE OUTRO...
			if(lFreezeProgress_num > lOutroProgressBorder_num)
			{
				lIsUnfreezingOrNotFreezed_bl = true;
				lEffectsAlphaMultiplier_num = (lFreezeProgress_num - lOutroProgressBorder_num) / lAlphaIntroOutroProgressDuration_num;
			}
			//...FREEZE OUTRO
			else
			//ABSOLUTE FREEZE...
			{
				lIsUnfreezingOrNotFreezed_bl = false;
				lEffectsAlphaMultiplier_num = 0;
			}
			//...FREEZE ABSOLUTE
		}

		//SMOKES...
		for( let i = 0; i < SMOKES_COUNT; i++ )
		{
			let lSmokeEffect_se = this._fSmokesEffects_se_arr[i];

			if(lSmokeEffect_se)
			{
				if(lIsUnfreezingOrNotFreezed_bl)
				{
					lSmokeEffect_se.alpha =  lEffectsAlphaMultiplier_num;
				}
				else
				{
					lSmokeEffect_se.alpha *=  lEffectsAlphaMultiplier_num;
				}
			}
			
		}
		//...SMOKES

		//GLOW...
		if(this._fGlow_spr)
		{
			if(lIsUnfreezingOrNotFreezed_bl)
			{
				this._fGlow_spr.alpha = lEffectsAlphaMultiplier_num;
			}
			else
			{
				this._fGlow_spr.alpha *= lEffectsAlphaMultiplier_num;
			}
		}
		//...GLOW

		//NARROW EMBERS...
		if(this._fNarrowEmbers)
		{
			if(lIsUnfreezingOrNotFreezed_bl)
			{
				this._fNarrowEmbers.alpha = lEffectsAlphaMultiplier_num;
			}
			else
			{
				this._fNarrowEmbers.alpha *= lEffectsAlphaMultiplier_num;
			}
		}
		//...NARROW EMBERS

		//WIDE EMBERS...
		if(this._fWideEmbers)
		{
			if(lIsUnfreezingOrNotFreezed_bl)
			{
				this._fWideEmbers.alpha = lEffectsAlphaMultiplier_num;
			}
			else
			{
				this._fWideEmbers.alpha *= lEffectsAlphaMultiplier_num;
			}
		}
		//...WIDE EMBERS


		//NARROW EMBERS...
		if(this._fNarrowEmbers)
		{
			if(lIsJustFrozen_bl)
			{
				this._fNarrowEmbers.animationSpeed = 0;
			}
			else if(lIsJustUnfrozen_bl)
			{
				this._fNarrowEmbers.animationSpeed = 0.3;
			}
		}
		//...NARROW EMBERS

		//...EFFECTS TRANSPARENCY VALIDATION WHEN FROZEN|UNFROZEN

	}

	//override
	_getOffset()
	{
		let offset = super._getOffset();
		let lYOffset_num = this.getJumpCurrentY();

		offset.y += lYOffset_num;

		return offset;
	}

	//override
	getSpineSpeed()
	{
		if (this.isTurnState)
		{
			return 2;
		}

		let lBaseSpeed_num = 0.025;
		switch (this.direction)
		{
			case DIRECTION.RIGHT_UP: 	lBaseSpeed_num = 0.025;	break;
			case DIRECTION.LEFT_UP:		lBaseSpeed_num = 0.021;	break;
			case DIRECTION.LEFT_DOWN:	lBaseSpeed_num = 0.025;	break;
			case DIRECTION.RIGHT_DOWN:	lBaseSpeed_num = 0.023;	break;
			
		}
		let lSpineSpeed_num = (this.currentTrajectorySpeed*lBaseSpeed_num/(SPINE_SCALE*this.getScaleCoefficient())).toFixed(2);

		if (this.isImpactState)
		{
			lSpineSpeed_num *= 1.8;
		}
		return lSpineSpeed_num;
	}

	//override
	_getHitRectHeight()
	{
		return 115;
	}

	//override
	_getHitRectWidth()
	{
		return 90;
	}

	//override
	changeShadowPosition()
	{
		let x = 4.5, y = 0, scale = 1.5, alpha = 0.7;

		this.shadow.position.set(x, y);
		this.shadow.scale.set(scale);
		this.shadow.alpha = alpha;
	}

	//override
	getLocalCenterOffset()
	{
		let pos = {x: 0, y: -42};
		return pos;
	}

	destroy()
	{
		//SMOKES...
		for( let i = 0; i < this._fSmokesEffects_se_arr.length; i++ )
		{
			this._fSmokesEffects_se_arr[i] && this._fSmokesEffects_se_arr[i].destroy(); 
		}
		this._fSmokesEffects_se_arr = [];
		//...SMOKES

		this._fNarrowEmbers = null;
		this._fWideEmbers = null;

		this._fGlow_sp = null;

		this._fSmokeProgress_num = undefined;

		this._fRecoveryProgress_num = undefined;
		this._fRecoveryJumpDistance_num = undefined;
		this._fRecoveryPositionOffsetX_num = undefined;
		this._fRecoveryPositionOffsetY_num = undefined;
		this._fFirstJumpIndex_int = undefined;
		this._fOffsetDuration_num = undefined;
		this.nextNextTurnPoint = null;
		
		super.destroy();
	}
}

export default ImpEnemy;