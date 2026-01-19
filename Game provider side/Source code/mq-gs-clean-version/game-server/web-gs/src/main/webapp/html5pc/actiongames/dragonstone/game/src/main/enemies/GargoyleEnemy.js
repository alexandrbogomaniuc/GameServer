import SpineEnemy from './SpineEnemy';
import { DIRECTION } from './Enemy';
import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import GargoyleTeleportManager from './GargoyleTeleportManager';
import { Sequence } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import * as Easing from '../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { FRAME_RATE } from '../../../../shared/src/CommonConstants';
import { Utils } from '../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import Timer from '../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';

const SPINE_ANIMATION_FINAL_POINT = 1.329981599999999;
const WING_BOTTOM_SPINE_TIME_INTERVALS = {start:0.7, end:0.8};

class GargoyleEnemy extends SpineEnemy
{
	static get EVENT_ON_ENEMY_FLY_OUT_COMPLETED() 		{ return "EVENT_ON_ENEMY_FLY_OUT_COMPLETED"; }
	static get EVENT_ON_ENEMY_FLY_MOVEMENT_COMPLETED() 	{ return "EVENT_ON_ENEMY_FLY_MOVEMENT_COMPLETED"; }
	static get EVENT_ON_ENEMY_FLY_IN_COMPLETED() 	{ return "EVENT_ON_ENEMY_FLY_IN_COMPLETED"; }
	static get EVENT_ON_TRAJECTORY_UPDATED() 		{ return "EVENT_ON_TRAJECTORY_UPDATED";}
	
	i_startFlyOutAnimation(duration) 
	{
		this._startFlyOutAnimation(duration);
	}

	i_startFlyInAnimation(duration, startPosition, targetPosition, angle) 
	{
		this._startFlyInAnimation(duration, startPosition, targetPosition, angle);
	}

	i_resetTeleportAnimation()
	{
		this._resetTeleportAnimation();
	}

	i_startFlyMovementAnimation(duration)
	{
		this._startFlyMovementAnimation(duration);
	}

	i_setFlyAngle(angle)
	{
		this._setFlyAngle(angle);
	}

	get flyOutInProgress()
	{
		return this._fFlyOutInProgress_bl;
	}

	get flyInInProgress()
	{
		return this._fFlyInInProgress_bl;
	}

	constructor(params)
	{
		super(params);
		this._fIsFlightSoundRequiredOnTime_bl = false;
		this._fIsFlightSoundRequired_bl = false;
		
		if(APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{

			let lFx_spr = this.container.addChildAt(APP.library.getSprite("enemies/gargoyle/glow"), 0);
			lFx_spr.blendMode = PIXI.BLEND_MODES.ADD;
			lFx_spr.scale.set(1.18 * 2);
			lFx_spr.position.set(-10, -45);

			this._fBottomFx_spr = lFx_spr;
		}
	}

	//override
	__generatePreciseCollisionBodyPartsNames()
	{
		return [
			"wing",
			"tail",
			];
	}

	_invalidateStates()
	{
		this._fGargoyleTeleportManager_htm = new GargoyleTeleportManager(this);
		this._fFlyOutInProgress_bl = false;
		this._fFlyInInProgress_bl = false;
		this._fIsFlightSoundRequired_bl = false;
		this._fTeleportShadowSeq = null;
		this._fTeleportResetPosition_pt = null;

		super._invalidateStates();
	}

	//override
	hideEnemyEffectsBeforeDeathIfRequired()
	{
		if(this._fBottomFx_spr)
		{
			this._fBottomFx_spr.alpha = 0;
		}
	}

	//override
	_createView(aShowAppearanceEffect_bl)
	{
		super._createView(aShowAppearanceEffect_bl);
	}


	//override
	getSpineSpeed()
	{
		let lSpineSpeed_num = 1;

		if (this.isImpactState)
		{
			lSpineSpeed_num *= 1.3;
		}

		return lSpineSpeed_num;
	}

	//override
	_calcSpineViewStartTime()
	{
		return 0;
	}

	get _isSpineFrameSyncRequired()
	{
		return false;
	}

	//override
	get isFreezeGroundAvailable()
	{
		return false;
	}
	//override
	get isFastTurnEnemy()
	{
		return true;
	}

	//override
	_getHitRectHeight()
	{
		return 150;
	}

	//override
	_getHitRectWidth()
	{
		return 100;
	}

	//override
	changeShadowPosition()
	{
		let x = 15, y = 150, scale = 2, alpha = 0.7;

		this.shadow.position.set(x, y);
		this.shadow.scale.set(scale);
		this.shadow.alpha = alpha;
	}

	//override
	getLocalCenterOffset()
	{
		let pos = {x: 0, y: -50};
		return pos;
	}

	//override
	showBombBounce(angle, dist, mapZonePoints)
	{
		return;
	}

	//override
	get _isImpactAllowed()
	{
		return super._isImpactAllowed
				&& !this._fFly_seq;
	}

	//override
	_correctResumedWalkTimeDelta(delta)
	{
		return 0;
	}

	//override
	get _isPauseWalkingOnImpactAllowed()
	{
		return false;
	}

	//override
	_freeze(aIsAnimated_bl = true)
	{
		this._fTeleportShadowSeq && this._fTeleportShadowSeq.pause();
		this._fFly_seq && this._fFly_seq.pause();
		this._fBottomWingStateTimer_t && this._fBottomWingStateTimer_t.pause();
		this._fMovementSeq && this._fMovementSeq.pause();

		super._freeze(aIsAnimated_bl);

		this._fFreezeBaseContainer_sprt.rotation = this.spineView.rotation;
	}

	//override
	_unfreeze(aIsAnimated_bl = true)
	{
		this._fTeleportShadowSeq && this._fTeleportShadowSeq.resume();
		this._fFly_seq && this._fFly_seq.resume();
		this._fBottomWingStateTimer_t && this._fBottomWingStateTimer_t.resume();
		this._fMovementSeq && this._fMovementSeq.resume();

		super._unfreeze(aIsAnimated_bl);
	}

	//override
	_addFreezeCover()
	{
		super._addFreezeCover();

		this._fFreezeCover_sprt.scale.set(1.2);

		this._fFreezeCover2_sprt = this._generateFreezeCoverSprite();
		this._fFreezeCover2_sprt.position.x -= 120;
		this._fFreezeCover2_sprt.position.y += 50;
		this._fFreezeCover2_sprt.scale.set(1.2);
		this._fFreezeBaseContainer_sprt.addChild(this._fFreezeCover2_sprt);
		this._fFreezeCover2_sprt.zIndex = this._fFreezeMask_sprt.zIndex+1;
		this._fFreezeCover2_sprt.maskSprite = this._fFreezeMask_sprt;
		this._fFreezeCover2_sprt.pluginName = 'batchMasked';

		this._fFreezeCover3_sprt = this._generateFreezeCoverSprite();
		this._fFreezeCover3_sprt.position.x += 120;
		this._fFreezeCover3_sprt.position.y += 50;
		this._fFreezeCover3_sprt.scale.set(1.2);
		this._fFreezeBaseContainer_sprt.addChild(this._fFreezeCover3_sprt);
		this._fFreezeCover3_sprt.zIndex = this._fFreezeMask_sprt.zIndex+1;
		this._fFreezeCover3_sprt.maskSprite = this._fFreezeMask_sprt;
		this._fFreezeCover3_sprt.pluginName = 'batchMasked';

		this._fFreezeCover4_sprt = this._generateFreezeCoverSprite();
		this._fFreezeCover4_sprt.position.x -= 120;
		this._fFreezeCover4_sprt.position.y -= 140;
		this._fFreezeCover4_sprt.scale.set(1.2);
		this._fFreezeBaseContainer_sprt.addChild(this._fFreezeCover4_sprt);
		this._fFreezeCover4_sprt.zIndex = this._fFreezeMask_sprt.zIndex+1;
		this._fFreezeCover4_sprt.maskSprite = this._fFreezeMask_sprt;
		this._fFreezeCover4_sprt.pluginName = 'batchMasked';

		this._fFreezeCover5_sprt = this._generateFreezeCoverSprite();
		this._fFreezeCover5_sprt.position.x += 120;
		this._fFreezeCover5_sprt.position.y -= 140;
		this._fFreezeCover5_sprt.scale.set(1.2);
		this._fFreezeBaseContainer_sprt.addChild(this._fFreezeCover5_sprt);
		this._fFreezeCover5_sprt.zIndex = this._fFreezeMask_sprt.zIndex+1;
		this._fFreezeCover5_sprt.maskSprite = this._fFreezeMask_sprt;
		this._fFreezeCover5_sprt.pluginName = 'batchMasked';
	}

	_generateFreezeCoverSprite()
	{
		let lFreezeCover_sprt = new PIXI.heaven.Sprite(APP.library.getSpriteFromAtlas('weapons/Cryogun/Freeze').textures[0]);

		lFreezeCover_sprt.anchor.set(0.5, 0.5);
		let centerPos = this.getLocalCenterOffset();
		lFreezeCover_sprt.position.set(centerPos.x, centerPos.y);
		let lFreezeBounds_obj = lFreezeCover_sprt.getBounds();
		let lFreezeCoverScaleY_num =  (this._getApproximateHeight()) / lFreezeBounds_obj.height;
		let lFreezeCoverScaleX_num = (this._getApproximateWidth()) / lFreezeBounds_obj.width;
		let lMaxScale_num = Math.max(lFreezeCoverScaleX_num, lFreezeCoverScaleY_num);
		lFreezeCover_sprt.scale.set(lMaxScale_num, lMaxScale_num);

		return lFreezeCover_sprt;
	}

	_destroyFrozenSprites()
	{
		this._fFreezeCover2_sprt && this._fFreezeCover2_sprt.destroy();
		this._fFreezeCover2_sprt = null;

		this._fFreezeCover3_sprt && this._fFreezeCover3_sprt.destroy();
		this._fFreezeCover3_sprt = null;

		this._fFreezeCover4_sprt && this._fFreezeCover4_sprt.destroy();
		this._fFreezeCover4_sprt = null;

		this._fFreezeCover5_sprt && this._fFreezeCover5_sprt.destroy();
		this._fFreezeCover5_sprt = null;

		super._destroyFrozenSprites();
	}

	updateTrajectory(aTrajectory_obj)
	{
		super.updateTrajectory(aTrajectory_obj);

		this.emit(GargoyleEnemy.EVENT_ON_TRAJECTORY_UPDATED);
	}

	tick()
	{
		super.tick();

		//EFFECTS TRANSPARENCY VALIDATION WHEN FROZEN|UNFROZEN...
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

		if(lIsUnfreezingOrNotFreezed_bl)
		{
			if(this._fBottomFx_spr) this._fBottomFx_spr.alpha = lEffectsAlphaMultiplier_num;
		}
		else
		{
			if(this._fBottomFx_spr) this._fBottomFx_spr.alpha *= lEffectsAlphaMultiplier_num;
		}
		//...EFFECTS TRANSPARENCY VALIDATION WHEN FROZEN|UNFROZEN



		this._fGargoyleTeleportManager_htm.i_invalidate();

		if(!this.isWalkState)
		{
			return;
		}

		//CALLING FLIGHT SOUND FROM HERE IF REQUIRED...
		let lFrameTime_num = this.curAnimationFrameTime;

		if(
			lFrameTime_num > 0 &&
			lFrameTime_num < SPINE_ANIMATION_FINAL_POINT * 0.05 &&
			this._fIsFlightSoundRequired_bl
		)
		{
			if(this._fIsFlightSoundRequiredOnTime_bl)
			{
				this._gameField.onSomeGargoyleFlapWings();

				this._fIsFlightSoundRequiredOnTime_bl = false;
			}
		}
		else
		{
			this._fIsFlightSoundRequiredOnTime_bl = true;
		}
		//...CALLING FLIGHT SOUND FROM HERE IF REQUIRED

	}

	//TELEPORT...	
	_setFlyAngle(angle)
	{
		this.angle = this._flyInAngle = angle;
	}


	//override
	__getDeathAnimationPointX()
	{
		return this.position.x - 480;
	}

	//override
	__getDeathAnimationPointY()
	{
		return this.position.y - 270 + 150;
	}

	//override
	__getDeathAnimationContainer()
	{
		return this._gameField.getBackgroundContainer();
	}

	//FLY OUT...
	_startFlyOutAnimation(duration)
	{
		if (!this || this._fFlyOutInProgress_bl || !this.position || this._fIsDeathActivated_bl)
		{
			return;
		}

		Sequence.destroy(Sequence.findByTarget(this));

		this._fTeleportResetPosition_pt = new PIXI.Point(this.position.x, this.position.y);

		this._fFlyOutInProgress_bl = true;

		this._fIsFlightSoundRequired_bl = false;

		let flyOutSeq = [{
							tweens:[{ prop: "y", to: -300 }],
							duration: duration,
							ease: Easing.cubic.easeIn,
							onfinish: () => { this._onFlyOutCompleted() }
						}];

		let shadowSeq = [{
			tweens:
			[
				{prop: "alpha", to: 0},
				{prop: "y", to: this.shadow.position.y + this.position.y + 300}
			],
			ease: Easing.cubic.easeIn,
			duration: duration
		}]

		this._fFly_seq = Sequence.start(this, flyOutSeq);
		this._fTeleportShadowSeq = Sequence.start(this.shadow, shadowSeq);
	}

	_onFlyOutCompleted() {
		this._fFly_seq = null;
		this._fFlyOutInProgress_bl = false;
		this.emit(GargoyleEnemy.EVENT_ON_ENEMY_FLY_OUT_COMPLETED);
	}
	//...FLY OUT

	//FLY IN...
	_startFlyInAnimation(duration, startPosition, targetPosition, angle)
	{
		if (!this || this._fFlyInInProgress_bl || !this.position || this._fIsDeathActivated_bl)
		{
			return;
		}

		Sequence.destroy(Sequence.findByTarget(this));

		this.angle = this._flyInAngle = angle;
		
		this._fTeleportResetPosition_pt = new PIXI.Point(targetPosition.x, targetPosition.y);

		this._fFlyInInProgress_bl = true;

		this._fIsFlightSoundRequired_bl = true;

		this.position.set(startPosition.x, startPosition.y);

		let flyInSeq = [{
							tweens:[
								{ prop: "x", to: targetPosition.x },
								{ prop: "y", to: targetPosition.y }
							],
							duration: duration,
							ease: Easing.cubic.easeInOut,
							onfinish: () => { this._onFlyInCompleted() }
						}];

		this.changeShadowPosition(); //reset shadow position
		this.shadow.alpha = 0;
		let shadowSeq = [{
			tweens:
			[
				{prop: "alpha", to: 0.7},
				{prop: "position.y", to: this.shadow.position.y }
			],
			ease: Easing.cubic.easeInOut,
			duration: duration
		}];

		let delta = targetPosition.y - startPosition.y;
		this.shadow.position.y += delta;

		this._fFly_seq = Sequence.start(this, flyInSeq);
		this._fTeleportShadowSeq = Sequence.start(this.shadow, shadowSeq);
	}

	_onFlyInCompleted() {
		this._fFly_seq = null;
		this._fFlyInInProgress_bl = false;
		this.emit(GargoyleEnemy.EVENT_ON_ENEMY_FLY_IN_COMPLETED);
	}
	//...FLY IN

	_resetTeleportAnimation()
	{
		if (!this._fTeleportResetPosition_pt)
		{
			this._fTeleportResetPosition_pt = this.position;
		}

		let seqRestorePosition = [
			{
				tweens: [
					{prop: "y", to: this._fTeleportResetPosition_pt.y},
				],
				duration: 200
			}
		];

		this._fFlyOutInProgress_bl = false;
		this._fFlyInInProgress_bl = false;
		this._fIsFlightSoundRequired_bl = false;
		Sequence.destroy(Sequence.findByTarget(this));
		this._fTeleportShadowSeq && this._fTeleportShadowSeq.destructor();

		this._fMovementSeq && this._fMovementSeq.destructor();
		this._fMovementSeq = null;

		this._fBottomWingStateTimer_t && this._fBottomWingStateTimer_t.destructor();
		this._fBottomWingStateTimer_t = null;

		Sequence.start(this, seqRestorePosition);
	}

	_startFlyMovementAnimation(duration)
	{
		let lRotationDuration = 350;
		let lRestFlyDuration = duration - lRotationDuration*2;
		let lRotationSeq;

		if (lRestFlyDuration < 0)
		{
			lRestFlyDuration = duration;

			lRotationSeq = [
								{
									tweens: [],
									duration: lRestFlyDuration,
									onfinish: () => { this._onFlyMovementAnimationCompleted() }
								}
							];
		}
		else
		{
			let lGrad = 0;

			switch (this.direction)
			{
				case DIRECTION.LEFT_DOWN: lGrad = -17; break;
				case DIRECTION.LEFT_UP: lGrad = -10; break;
				case DIRECTION.RIGHT_DOWN: lGrad = 17; break;
				case DIRECTION.RIGHT_UP: lGrad = 10; break;
			}

			let animTrack = this.curAnimationTrack;
			let animTime = animTrack.animationLast;
			let animDuration = animTrack.animationEnd;
			let lSpineTimeScale = this.spineView.view.state.timeScale;

			let lTimeTillBottomWingState = 0;
			if (animTime < WING_BOTTOM_SPINE_TIME_INTERVALS.start)
			{
				lTimeTillBottomWingState = ~~((WING_BOTTOM_SPINE_TIME_INTERVALS.start-animTime)/lSpineTimeScale*1000);
			}
			else if (animTime > WING_BOTTOM_SPINE_TIME_INTERVALS.end)
			{
				lTimeTillBottomWingState = ~~((animDuration-animTime+WING_BOTTOM_SPINE_TIME_INTERVALS.start)/lSpineTimeScale*1000);
			}

			if (!this.isWalkState || (animTrack.mixDuration > 0 && animTrack.mixTime > 0 && animTrack.mixTime < animTrack.mixDuration))
			{
				lTimeTillBottomWingState = duration*2; // to avoid _fBottomWingStateTimer_t
			}

			if (lTimeTillBottomWingState == 0)
			{
				this._stopSpinePlaying();
			}
			else if (lTimeTillBottomWingState < (duration - lRotationDuration))
			{
				this._fBottomWingStateTimer_t = new Timer(()=>{
													this._stopSpinePlaying();
													this._fBottomWingStateTimer_t.destructor();
													this._fBottomWingStateTimer_t = null;
												}, lTimeTillBottomWingState);
			}

			lRotationSeq = [
								{
									tweens: [ {prop: "rotation", to: Utils.gradToRad(lGrad)}],
									ease: Easing.cubic.easeOut,
									duration: lRotationDuration
								},
								{
									tweens: [],
									duration: lRestFlyDuration,
									onfinish: () => { this._startSpinePlaying(); }
								},
								{
									tweens: [ {prop: "rotation", to: Utils.gradToRad(0)}],
									ease: Easing.cubic.easeOut,
									duration: lRotationDuration,
									onfinish: () => { this._onFlyMovementAnimationCompleted(); }
								}
							];
						}

		this._fMovementSeq = Sequence.start(this.spineView, lRotationSeq);
	}

	changeView()
	{
		if (this._flyInAngle !== undefined)
		{
			this.angle = this._flyInAngle;
		}
		
		super.changeView();
	}

	_onFlyMovementAnimationCompleted()
	{
		this._fMovementSeq.destructor();
		this._fMovementSeq = null;

		this.emit(GargoyleEnemy.EVENT_ON_ENEMY_FLY_MOVEMENT_COMPLETED);
	}
	//...TELEPORT

	setDeathFramesAnimation(aIsInstantKill_bl = false, aPlayerWin_obj = null)
	{
		super.setDeathFramesAnimation(aIsInstantKill_bl, aPlayerWin_obj);
	}

	changeZindex()
	{
		if (this._fTeleportResetPosition_pt && (this._fFlyInInProgress_bl || this._fFlyOutInProgress_bl)) {

			this.zIndex = this._fTeleportResetPosition_pt.y + this.footPoint.y + 30;
			return;
		}
		super.changeZindex();
	}

	destroy()
	{
		this._flyInAngle = undefined;

		this._fGargoyleTeleportManager_htm && this._fGargoyleTeleportManager_htm.destroy();
		this._fGargoyleTeleportManager_htm = null;

		this._fFly_seq = null;

		this._fFlyOutInProgress_bl = false;
		this._fFlyInInProgress_bl = false;
		this._fIsFlightSoundRequired_bl = false;
		Sequence.destroy(Sequence.findByTarget(this));
		this._fTeleportShadowSeq && this._fTeleportShadowSeq.destructor();
		this._fTeleportResetPosition_pt = null;

		this.appearancePositionUpdated = false;

		this._fBottomFx_spr = false;

		this._fBottomWingStateTimer_t && this._fBottomWingStateTimer_t.destructor();
		this._fBottomWingStateTimer_t = null;

		this._fMovementSeq && this._fMovementSeq.destructor();
		this._fMovementSeq = null;

		super.destroy();
	}
}

export default GargoyleEnemy;