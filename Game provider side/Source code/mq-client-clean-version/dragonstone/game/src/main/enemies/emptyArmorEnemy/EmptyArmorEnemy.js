import SpineEnemy from '../SpineEnemy';
import {STATE_IMPACT, DIRECTION } from '../Enemy';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import PuffEffect from './PuffEffect';
import GreenSmokeEffect from './GreenSmokeEffect';

const PUFFS_DESCRIPTORS_RIGHT_DOWN =
	[
		{animationProgressMoment_num: 0.075, x: 14 * 1.115, y: -2 * 1.115 , scale: 0.6 * 1.115},
		{animationProgressMoment_num: 0.525, x: 8 * 1.115, y: 3 * 1.115 , scale: 0.6 * 1.115}
	];

const PUFFS_DESCRIPTORS_RIGHT_UP =
	[
		{animationProgressMoment_num: 0.075, x: 17 * 1.115, y: -12 * 1.115 , scale: 0.6 * 1.115},
		{animationProgressMoment_num: 0.525, x: 4 * 1.115, y: -24 * 1.115 , scale: 0.6 * 1.115}
	];

const PUFFS_DESCRIPTORS_LEFT_DOWN =
	[
		{animationProgressMoment_num: 0.075, x: -2 * 1.115, y: 2 * 1.115 , scale: 0.6 * 1.115},
		{animationProgressMoment_num: 0.525, x: -12 * 1.115, y: -2 * 1.115 , scale: 0.6 * 1.115}
	];

const PUFFS_DESCRIPTORS_LEFT_UP =
	[
		{animationProgressMoment_num: 0.075, x: -16 * 1.115, y: -12 * 1.115, scale: 0.6 * 1.115},
		{animationProgressMoment_num: 0.525, x: -16 * 1.115, y: -26 * 1.115, scale: 0.6 * 1.115}
	];

const PUFFS_COUNT = PUFFS_DESCRIPTORS_RIGHT_DOWN.length;


const SMOKES_DESCRIPTORS_RIGHT_DOWN =
	[
		{animationProgressMoment_num: 0.25, x: 16 * 1.115, y: -36 * 1.115, scale: 1.6 * 1.115, zIndex: 0, deltaMultiplier: 0.5}, //BACKGROUND
		{animationProgressMoment_num: 0.75, x: 16 * 1.115, y: -36 * 1.115, scale: 1.6 * 1.115, zIndex: 0, deltaMultiplier: 0.5}, //BACKGROUND
		{animationProgressMoment_num: 0.075, x: 20 * 1.115, y: -72 * 1.115, scale: 0.6 * 1.115, zIndex: 3}, //HEAD
		{animationProgressMoment_num: 0.475, x: 20 * 1.115, y: -72 * 1.115, scale: 0.6 * 1.115, zIndex: 3}, //HEAD
		{animationProgressMoment_num: 0.07, x: 16 * 1.115, y: -4 * 1.115 , scale: 0.8 * 1.115, zIndex: 3},//LEG
		{animationProgressMoment_num: 0.525, x: 10 * 1.115, y: 0 * 1.115 , scale: 0.8 * 1.115, zIndex: 3},//LEG
	];

const SMOKES_DESCRIPTORS_RIGHT_UP =
	[
		{animationProgressMoment_num: 0.25, x: 8 * 1.115, y: -36 * 1.115, scale: 1.6 * 1.115, zIndex: 3, deltaMultiplier: 0.5}, //BACKGROUND
		{animationProgressMoment_num: 0.75, x: 8 * 1.115, y: -36 * 1.115, scale: 1.6 * 1.115, zIndex: 3, deltaMultiplier: 0.5}, //BACKGROUND
		{animationProgressMoment_num: 0.075, x: 8 * 1.115, y: -76 * 1.115, scale: 0.6 * 1.115, zIndex: 0}, //HEAD
		{animationProgressMoment_num: 0.475, x: 8 * 1.115, y: -76 * 1.115, scale: 0.6 * 1.115, zIndex: 0}, //HEAD
		{animationProgressMoment_num: 0.07, x: 12 * 1.115, y: -4 * 1.115 , scale: 0.8 * 1.115, zIndex: 0},//LEG
		{animationProgressMoment_num: 0.525, x: 4 * 1.115, y: -8 * 1.115 , scale: 0.8 * 1.115, zIndex: 0},//LEG
	];

const SMOKES_DESCRIPTORS_LEFT_DOWN =
	[
		{animationProgressMoment_num: 0.25, x: 4 * 1.115, y: -36 * 1.115, scale: 1.6, zIndex: 0, deltaMultiplier: 0.5}, //BACKGROUND
		{animationProgressMoment_num: 0.75, x: 4 * 1.115, y: -36 * 1.115, scale: 1.6, zIndex: 0, deltaMultiplier: 0.5}, //BACKGROUND
		{animationProgressMoment_num: 0.075, x: -12 * 1.115, y: -72 * 1.115, scale:  0.6, zIndex: 3}, //HEAD
		{animationProgressMoment_num: 0.475, x: -12 * 1.115, y: -72 * 1.115, scale:  0.6, zIndex: 3}, //HEAD
		{animationProgressMoment_num: 0.07, x: 0 * 1.115, y: 8 * 1.115 , scale: 0.8, zIndex: 3},//LEG
		{animationProgressMoment_num: 0.525, x:-12 * 1.115, y: 0 * 1.115 , scale:  0.8, zIndex: 3},//LEG
	];

const SMOKES_DESCRIPTORS_LEFT_UP =
	[
		{animationProgressMoment_num: 0.25, x: 8 * 1.115, y: -56 * 1.115, scale: 1.6 * 1.115, zIndex: 3, deltaMultiplier: 0.5}, //BACKGROUND
		{animationProgressMoment_num: 0.75, x: 8 * 1.115, y: -56 * 1.115, scale: 1.6 * 1.115, zIndex: 3, deltaMultiplier: 0.5}, //BACKGROUND
		{animationProgressMoment_num: 0.075, x: 0 * 1.115, y: -76 * 1.115, scale: 0.6 * 1.115, zIndex: 0}, //HEAD
		{animationProgressMoment_num: 0.475, x: 0 * 1.115, y: -76 * 1.115, scale: 0.6 * 1.115, zIndex: 0}, //HEAD
		{animationProgressMoment_num: 0.07, x: -8 * 1.115, y: -4 * 1.115, scale: 0.8 * 1.115, zIndex: 0},//LEG
		{animationProgressMoment_num: 0.525, x: 8 * 1.115, y: -16 * 1.115, scale: 0.8 * 1.115, zIndex: 0},//LEG
	];

const SMOKES_COUNT = SMOKES_DESCRIPTORS_RIGHT_DOWN.length;

const SPINE_ANIMATION_FINAL_POINT = 1.3306811055313137;
const SPINE_ANIMATION_FRAME_TIME_OFFSET = 0.05;


class EmptyArmorEnemy extends SpineEnemy
{
	constructor(params)
	{
		super(params);

		this._fIsGreenGlowSoundRequired_bl = true;

		this._fGreenSmokesEffects_se_arr = [];
		this._fGreenPuffEffects_pe_arr = [];
		this._fIsPuffEffectRequired_bl = APP.profilingController.info.isVfxProfileValueMediumOrGreater;

		if (!this._fIsPuffEffectRequired_bl)
		{
			return;
		}

		//PUFFS...
		for( let i = 0; i < PUFFS_COUNT; i++ )
		{
			let lPuffEffect_pe = this.addChild(new PuffEffect());
			this._fGreenPuffEffects_pe_arr[i] = lPuffEffect_pe;
		}
		//...PUFFS


		//SMOKES...
		for( let i = 0; i < SMOKES_COUNT; i++ )
		{
			let lDescriptor_obj = this._getSmokesDescriptor()[i];

			this._fGreenSmokesEffects_se_arr[i] = this.addChild(
				new GreenSmokeEffect(lDescriptor_obj.deltaMultiplier)
			);
		}
		//...SMOKES

	}

	//override
	__generatePreciseCollisionBodyPartsNames()
	{
		return [
			"sword"
			];
	}

	//override
	hideEnemyEffectsBeforeDeathIfRequired()
	{
		if(this._fIsPuffEffectRequired_bl)
		{
			for( let i = 0; i < PUFFS_COUNT; i++ )
			{
				this._fGreenPuffEffects_pe_arr[i].stopAnimation();
			}

			for( let i = 0; i < SMOKES_COUNT; i++ )
			{
				this._fGreenSmokesEffects_se_arr[i].stopAnimation();
			}
		}

	}


	_getPuffsDescriptor()
	{
		switch (this.direction)
		{
			case DIRECTION.LEFT_DOWN: 	return PUFFS_DESCRIPTORS_LEFT_DOWN;
			case DIRECTION.LEFT_UP: 	return PUFFS_DESCRIPTORS_LEFT_UP;
			case DIRECTION.RIGHT_DOWN: 	return PUFFS_DESCRIPTORS_RIGHT_DOWN;
			case DIRECTION.RIGHT_UP: 	return PUFFS_DESCRIPTORS_RIGHT_UP;
		}
	}

	_getSmokesDescriptor()
	{
		switch (this.direction)
		{
			case DIRECTION.LEFT_DOWN: 	return SMOKES_DESCRIPTORS_LEFT_DOWN;
			case DIRECTION.LEFT_UP: 	return SMOKES_DESCRIPTORS_LEFT_UP;
			case DIRECTION.RIGHT_DOWN: 	return SMOKES_DESCRIPTORS_RIGHT_DOWN;
			case DIRECTION.RIGHT_UP: 	return SMOKES_DESCRIPTORS_RIGHT_UP;
		}
	}

	//override
	_getHitRectHeight()
	{
		return 105 * 1.115;
	}

	//override
	_getHitRectWidth()
	{
		return 52 * 1.115;
	}

	//override
	changeShadowPosition()
	{
		let x = 0, y = 0, scale = 1, alpha = 1;

		switch (this.direction)
		{
			case DIRECTION.LEFT_UP: y = -10 * 1.115; break;
		}

		this.shadow.position.set(x, y);
		this.shadow.scale.set(scale);
		this.shadow.alpha = alpha;
	}
	
	//override
	getLocalCenterOffset()
	{
		let pos = {x: 0, y: -38 * 1.115};
		return pos;
	}

	get _animationFinalPoint()
	{
		switch (this.direction)
		{
			case DIRECTION.LEFT_DOWN:
			case DIRECTION.LEFT_UP:
			case DIRECTION.RIGHT_DOWN:
			case DIRECTION.RIGHT_UP:
			default:
				return SPINE_ANIMATION_FINAL_POINT;
		}

	}

	//override
	tick()
	{
		super.tick();

		let lProgress_num = 0;

		if(!this._fIsPuffEffectRequired_bl)
		{
			return;
		}

		//CALLING EFFECTS ON TIME...
		let lCurrentAnimationFrameTime_num = this.curAnimationFrameTime;
		if(
			lCurrentAnimationFrameTime_num === undefined ||
			lCurrentAnimationFrameTime_num < 0
			)
		{
			lCurrentAnimationFrameTime_num = 0;
		}

		let lAnimationProgress_num = lCurrentAnimationFrameTime_num / this._animationFinalPoint;

		//PUFFS...
		for( let i = 0; i < PUFFS_COUNT; i++ )
		{
			
			let lDescriptor_obj = this._getPuffsDescriptor()[i];
			let lPuffEffect_pe = this._fGreenPuffEffects_pe_arr[i];
			let lAnimationProgressMoment_num = lDescriptor_obj.animationProgressMoment_num;
			

			if(
				!this.isFrozen &&
				!lPuffEffect_pe.isPlaying() &&
				lAnimationProgress_num > lAnimationProgressMoment_num - SPINE_ANIMATION_FRAME_TIME_OFFSET &&
				lAnimationProgress_num < lAnimationProgressMoment_num + SPINE_ANIMATION_FRAME_TIME_OFFSET
				)
			{
				lPuffEffect_pe.position.set(lDescriptor_obj.x, lDescriptor_obj.y);
				lPuffEffect_pe.scale.set(lDescriptor_obj.scale);
				lPuffEffect_pe.zIndex = 100;
				lPuffEffect_pe.play();
			}
		}
		//...PUFFS

		//SMOKES...
		if(!this.isFrozen)
		{
			for( let i = 0; i < SMOKES_COUNT; i++ )
			{
				let lDescriptor_obj = this._getSmokesDescriptor()[i];
				let lSmokeEffect_se = this._fGreenSmokesEffects_se_arr[i];
				let lAnimationProgressMoment_num = lDescriptor_obj.animationProgressMoment_num;

				if(
					!lSmokeEffect_se.isPlaying() &&
					lAnimationProgress_num > lAnimationProgressMoment_num - SPINE_ANIMATION_FRAME_TIME_OFFSET &&
					lAnimationProgress_num < lAnimationProgressMoment_num + SPINE_ANIMATION_FRAME_TIME_OFFSET
					)
				{
					lSmokeEffect_se.position.set(lDescriptor_obj.x, lDescriptor_obj.y);
					lSmokeEffect_se.scale.set(lDescriptor_obj.scale);
					lSmokeEffect_se.zIndex = lDescriptor_obj.zIndex;
					lSmokeEffect_se.play();
				}

				lSmokeEffect_se.update();
			}
		}
		//...SMOKES


		//...CALLING EFFECTS ON TIME


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
			let l_se = this._fGreenSmokesEffects_se_arr[i];

			if(l_se)
			{
				l_se.alpha *=  lEffectsAlphaMultiplier_num;
			}
		}
		//...SMOKES

		//PUFFS...
		for( let i = 0; i < PUFFS_COUNT; i++ )
		{
			let l_se = this._fGreenSmokesEffects_se_arr[i];

			if(l_se)
			{
				if(lIsUnfreezingOrNotFreezed_bl)
				{
					l_se.alpha =  lEffectsAlphaMultiplier_num;
				}
				else
				{
					l_se.alpha *=  lEffectsAlphaMultiplier_num;
				}
			}
		}
		//...PUFFS
		//...EFFECTS TRANSPARENCY VALIDATION WHEN FROZEN|UNFROZEN

	}


	getSpineSpeed()
	{
		if(this.state === STATE_IMPACT)
		{
			this.currentTrajectorySpeed * 0.35;
		}

		let lCoeff = 0.2;
		switch (this.direction)
		{
			case DIRECTION.LEFT_DOWN:	lCoeff = 0.21;	break;
			case DIRECTION.RIGHT_DOWN:	lCoeff = 0.185;	break;
			
			case DIRECTION.RIGHT_UP:	lCoeff = 0.18;	break;
			case DIRECTION.LEFT_UP:		lCoeff = 0.19;	break;
		}

		return this.currentTrajectorySpeed * lCoeff;
	}


	destroy()
	{
		this._fIsPuffEffectRequired_bl =  null;

		//PUFFS...
		for( let i = 0; i < this._fGreenPuffEffects_pe_arr.length; i++ )
		{
			this._fGreenPuffEffects_pe_arr[i] && this._fGreenPuffEffects_pe_arr[i].destroy();
		}
		this._fGreenPuffEffects_pe_arr = [];
		//...PUFFS


		//SMOKES...
		for( let i = 0; i < this._fGreenSmokesEffects_se_arr.length; i++ )
		{
			this._fGreenSmokesEffects_se_arr[i] && this._fGreenSmokesEffects_se_arr[i].destroy(); 
		}
		this._fGreenSmokesEffects_se_arr = [];
		//...SMOKES
		

		super.destroy();
	}
}

export default EmptyArmorEnemy;