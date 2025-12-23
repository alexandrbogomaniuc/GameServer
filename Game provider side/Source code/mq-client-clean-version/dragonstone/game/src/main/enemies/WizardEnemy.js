import SpineEnemy from './SpineEnemy';
import { STATE_WALK, STATE_IMPACT, STATE_TURN, STATE_STAY, DIRECTION, TURN_DIRECTION } from './Enemy';
import WizardTeleportManager from './WizardTeleportManager';
import WizardTeleportFx from '../../view/uis/enemies/wizard/WizardTeleportFx';
import { Sequence } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import Timer from '../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import { FRAME_RATE } from '../../../../shared/src/CommonConstants';
import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Enemy from './Enemy';
import { WIZARDS_EXTRA_SCALE } from '../../config/Constants';
import TrajectoryUtils from '../../main/TrajectoryUtils';
import { Utils } from '../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';

const STATE_IDLE = "idle";
export const STATE_CAST_TELEPORT = "castTeleportSpell";

class WizardEnemy extends SpineEnemy
{
	static get EVENT_ON_ENEMY_TELEPORT_OUT_COMPLETED() 	{ return "EVENT_ON_ENEMY_TELEPORT_OUT_COMPLETED"; }
	static get EVENT_ON_ENEMY_TELEPORT_IN_COMPLETED() 	{ return "EVENT_ON_ENEMY_TELEPORT_IN_COMPLETED"; }
	static get EVENT_ON_ENEMY_RESET_TARGET_REQUIRED() 	{ return Enemy.EVENT_ON_ENEMY_RESET_TARGET_REQUIRED; }
	static get EVENT_ON_TRAJECTORY_UPDATED()			{ return "EVENT_ON_TRAJECTORY_UPDATED"; }

	startTeleportOutAnimation()
	{
		this._startTeleportOutAnimation();
	}

	startTeleportInAnimation(targetPosition)
	{
		this._startTeleportInAnimation(targetPosition);
	}

	resetTeleportAnimation()
	{
		this._resetTeleportAnimation();
	}

	resetWizardView()
	{
		this._resetWizardView();
	}

	immediatelyTeleportWizardWithoutAnimation(targetPosition)
	{
		if (!this._isTeleportPossible) return;

		this._fTeleportOutInProgress_bl = false;
		this.position.set(targetPosition.x, targetPosition.y);

		this._fIsWizardVisible_bl = true;
		this.container.visible = true;
		this.emit(WizardEnemy.EVENT_ON_ENEMY_TELEPORT_IN_COMPLETED);
	}

	updateTrajectory(aTrajectory_obj)
	{
		super.updateTrajectory(aTrajectory_obj)

		this.emit(WizardEnemy.EVENT_ON_TRAJECTORY_UPDATED);
	}

	get teleportInProgress()
	{
		return this._fTeleportInProgress_bl;
	}

	get isTeleportOutInProgress()
	{
		return this._fTeleportOutInProgress_bl;
	}

	get isEnemyLockedForTarget()
	{
		return !this._fIsWizardVisible_bl;
	}

	get idleAnimations()
	{
		return null;
	}

	constructor(params)
	{
		super(params);

		this._fTeleportInProgress_bl = null;
		this._fTeleportOutInProgress_bl = null;
		this._fIsWizardVisible_bl = null;
		this._fDisappearTimer_t = null;
		this._fEnemySeq_seq_arr = [];
		this._fWasDissappearingInterruptedByFreeze_bl = null;
	}

	//override
	_calcSpineViewStartTime()
	{
		return 0;
	}

	//override
	get _isImpactAllowed()
	{
		return super._isImpactAllowed
				&& this.state !== STATE_CAST_TELEPORT
	}
	
	//override
	get isFreezeGroundAvailable()
	{
		return false;
	}

	//override
	_pauseWalking()
	{
	}

	//override
	_resumeWalking()
	{
	}

	_setCastTeleportSpell()
	{
		this.changeTextures(STATE_CAST_TELEPORT);
	}

	//override
	get _customSpineTransitionsDescr()
	{
		return [
			{from: "<PREFIX>idle", to: "<PREFIX>castSpell", duration: 0.2},
			{from: "<PREFIX>castSpell", to: "<PREFIX>idle", duration: 0.2},
			{from: "<PREFIX>walk", to: "<PREFIX>hit", duration: 0.1},
			{from: "<PREFIX>hit", to: "<PREFIX>walk", duration: 0.1},
			{from: "<PREFIX>idle", to: "<PREFIX>hit", duration: 0.1},
			{from: "<PREFIX>hit", to: "<PREFIX>idle", duration: 0.1}
		];
	}

	//override
	_calculateAnimationLoop(stateType)
	{
		if (stateType === STATE_CAST_TELEPORT)
		{
			return false;
		}

		return super._calculateAnimationLoop(stateType);
	}

	//override
	getSpineSpeed()
	{
		let lSpeed_num = 1;
		switch (this.state)
		{
			case STATE_CAST_TELEPORT:
				lSpeed_num = 1.2;
				break;
			case STATE_IDLE:
			case STATE_STAY:
			case STATE_WALK:
			case STATE_IMPACT:
			case STATE_TURN:
				lSpeed_num = 0.8;
				break;
		}

		return lSpeed_num;
	}

	//override
	_calculateAnimationName(stateType)
	{
		let animationName = '';

		switch (stateType)
		{
			case STATE_CAST_TELEPORT:
				animationName = this.getCastSpellAnimationName();
				break;
			case STATE_IDLE:
			case STATE_STAY:
			case STATE_WALK:
			case STATE_TURN:
				animationName = this.getIdleAnimationName();
				break;
			case STATE_IMPACT:
				animationName = this.getImpactAnimationName();
				break;
		}

		return animationName;
	}

	_invalidateStates()
	{
		this._fTeleportManager_tm = new WizardTeleportManager(this);
		this._fTeleportInProgress_bl = false;
		this._fIsWizardVisible_bl = false;
		this._fTeleportOutInProgress_bl = false;
		
		super._invalidateStates();

		this._fTeleportFx_wtfx = this.addChild(this._getWizardTeleportFx());
		this._fTeleportFx_wtfx.scale.set(WIZARDS_EXTRA_SCALE, WIZARDS_EXTRA_SCALE);
		this._fTeleportFx_wtfx.position.set(-80*WIZARDS_EXTRA_SCALE, -40*WIZARDS_EXTRA_SCALE);
		this._fTeleportFx_wtfx.on(WizardTeleportFx.EVENT_ON_APPEAR_REQUIRED, this._onWizardAppearRequired, this);
		this._fTeleportFx_wtfx.on(WizardTeleportFx.EVENT_ON_DISAPPEAR_REQUIRED, this._onWizardDisappearRequired, this);
		this._fTeleportFx_wtfx.on(WizardTeleportFx.EVENT_ON_TELEPORTED_IN, this._onTeleportedIn, this);
		this._fTeleportFx_wtfx.on(WizardTeleportFx.EVENT_ON_TELEPORTED_OUT, this._onTeleportedOut, this);
	}

	_getWizardTeleportFx()
	{
		//override
	}

	getIdleAnimationName()
	{
		return this._calcIdleAnimationName(this.direction);
	}

	getCastSpellAnimationName()
	{
		return this.direction.substr(3) + '_castSpell';
	}

	_calcIdleAnimationName(aDirection_str, aBaseWalkAnimationName_str = "idle")
	{
		switch (aDirection_str)
		{
			case DIRECTION.LEFT_UP:
				return '270_' + aBaseWalkAnimationName_str;
			case DIRECTION.LEFT_DOWN:
				return '0_' + aBaseWalkAnimationName_str;
			case DIRECTION.RIGHT_UP:
				return '180_' + aBaseWalkAnimationName_str;
			case DIRECTION.RIGHT_DOWN:
				return '90_' + aBaseWalkAnimationName_str;
		}
		throw new Error (aDirection_str + " is not supported direction for idle.");
	}

	//override
	_getHitRectHeight()
	{
		return 160*WIZARDS_EXTRA_SCALE;
	}

	//override
	_getHitRectWidth()
	{
		return 70*WIZARDS_EXTRA_SCALE;
	}

	//override
	_isRotationOnChangeViewRequired()
	{
		return false;
	}

	//override
	changeShadowPosition()
	{
		let x = 0, y = 0, scale = 1*WIZARDS_EXTRA_SCALE, alpha = 0.9;

		this.shadow.position.set(x, y);
		this.shadow.scale.set(scale);
		this.shadow.alpha = alpha;
	}

	//override
	getLocalCenterOffset()
	{
		let pos = {x: 0, y: 0};
		switch (this.direction)
		{
			case DIRECTION.LEFT_DOWN:	pos = {x: 0,	y: -65*WIZARDS_EXTRA_SCALE};	break;
			case DIRECTION.LEFT_UP:		pos = {x: 0,	y: -65*WIZARDS_EXTRA_SCALE};	break;
			case DIRECTION.RIGHT_DOWN:	pos = {x: 0,	y: -65*WIZARDS_EXTRA_SCALE};	break;
			case DIRECTION.RIGHT_UP:	pos = {x: 0,	y: -65*WIZARDS_EXTRA_SCALE};	break;
		}
		return pos;
	}

	get _isTeleportPossible()
	{
		return this.position && !this._fTeleportInProgress_bl && !this._fIsDeathActivated_bl;
	}

	//TELEPORT IN...
	_startTeleportInAnimation(targetPosition)
	{
		if (!this._isTeleportPossible) return;

		this._fTeleportInProgress_bl = true;
		this._fTeleportOutInProgress_bl = false;
		this.position.set(targetPosition.x, targetPosition.y);

		this._setCastTeleportSpell();

		this._startAppear();
	}

	_startAppear()
	{
		this._fTeleportFx_wtfx && this._fTeleportFx_wtfx.startAppear(this.direction);
		this._fIsWizardVisible_bl = true;
		APP.profilingController.info.isVfxProfileValueMediumOrGreater && APP.gameScreen.gameField.startTeleportAnimation(this, this.position, this.getScaleCoefficient());

		if(!APP.currentWindow.gameStateController.info.isBossSubround)
		{
			APP.soundsController.play('mq_enemies_wizard_teleport_end');
		}
	}

	_onWizardAppearRequired()
	{
		if ((this._fIsDeathActivated_bl || !this.container || !this.spineView))
		{
			return;
		}

		Sequence.destroy(Sequence.findByTarget(this.container));

		this.container.visible = true;

		this._fIsFireDenied_bl = false;
		this.container.scale.set(0, 0);
		let lScale_seq = [
			{tweens: [{prop: 'scale.x', to: 1}, {prop: 'scale.y', to: 1}],		duration: 7 * FRAME_RATE, onfinish: () => {
				this._setInvulnerableViewValue(false);
			}}
		];

		this._fEnemySeq_seq_arr.push(Sequence.start(this.container, lScale_seq).once(Sequence.EVENT_ON_SEQUENCE_PLAYING_COMPLETED, this._onWizardSequenceCompleted, this));

		this._addFilters(2);
		let lBlure_seq = [
			{tweens: [{prop: 'blur', to: 0}],		duration: 7 * FRAME_RATE, onfinish: ()=>{this._removeFilters()} }
		];
		this._fEnemySeq_seq_arr.push(Sequence.start(this.container.filters[0], lBlure_seq).once(Sequence.EVENT_ON_SEQUENCE_PLAYING_COMPLETED, this._onWizardSequenceCompleted, this));
	}

	_addFilters(aBlure_num)
	{
		if (this.isDeathInProgress)
		{
			this._removeFilters();
			return;
		}

		let blurFilter = new PIXI.filters.BlurFilter();
		blurFilter.blur = aBlure_num;
		blurFilter.resolution = 2;
		this._whiteFilter.resolution = 2;

		this.container.filters = [blurFilter];
		this.spineView.filters = [this._whiteFilter];
	}

	_removeFilters()
	{
		this.container && (this.container.filters = []);
		this.spineView && (this.spineView.filters = []);
	}

	get _whiteVertexShader()
	{
		return `
		attribute vec2 aVertexPosition;
		attribute vec2 aTextureCoord;
		uniform mat3 projectionMatrix;
		varying vec2 vTextureCoord;

		void main(void)
		{
			gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
			vTextureCoord = aTextureCoord;
		}`;
	}

	get _whiteFragmentShader()
	{
		return `
			varying vec2 vTextureCoord;
			uniform sampler2D uSampler;

			void main(void)
			{
			vec4 c = texture2D(uSampler, vTextureCoord);

			if (c.a < 0.7)
			{
			return;
			}

			vec4 result;
			result.r = 1.0;
			result.g = 1.0;
			result.b = 1.0;
			result.a = c.a;
			gl_FragColor = result;
			}`;
	}

	get _whiteFilter()
	{
		if (!this._fWhiteFilter)
		{
			this._fWhiteFilter = new PIXI.Filter(this._whiteVertexShader, this._whiteFragmentShader);
		}

		return this._fWhiteFilter;
	}

	_onTeleportedIn()
	{
		if (this._deathInProgress) // possible with quick death at the end of the round (death reason: 1)
		{
			return;
		}
		this.changeTextures(STATE_IDLE);
		this._fTeleportInProgress_bl = false;

		if (this.isFrozen)
		{
			this._pauseAnimation();
		}

		this.emit(WizardEnemy.EVENT_ON_ENEMY_TELEPORT_IN_COMPLETED);
	}
	//...TELEPORT IN

	//TELEPORT OUT...
	_startTeleportOutAnimation()
	{
		if (!this._isTeleportPossible) return;

		this._fTeleportInProgress_bl = true;
		this._fTeleportOutInProgress_bl = true;

		this._setCastTeleportSpell();

		this._fDisappearTimer_t = new Timer(()=>{
			this._startDisappear();
			this._fDisappearTimer_t = null;
		}, 13 * FRAME_RATE);
	}

	_startDisappear()
	{
		this._fTeleportFx_wtfx && this._fTeleportFx_wtfx.startDisappear(this.direction);
		APP.profilingController.info.isVfxProfileValueMediumOrGreater && APP.gameScreen.gameField.startTeleportAnimation(this, this.position, this.getScaleCoefficient());

		if(!APP.currentWindow.gameStateController.info.isBossSubround)
		{
			APP.soundsController.play('mq_enemies_wizard_teleport_start');
		}
	}

	_onWizardDisappearRequired()
	{
		if (this._fIsDeathActivated_bl || !this.container || !this.spineView)
		{
			return;
		}

		Sequence.destroy(Sequence.findByTarget(this.container));

		this._fIsWizardVisible_bl = false;
		this._fIsFireDenied_bl = true;
		this.container.scale.set(1, 1);
		let lScale_seq = [
			{tweens: [{prop: 'scale.x', to: 0}, {prop: 'scale.y', to: 0}],		duration: 7 * FRAME_RATE, onfinish: () => {
				this._setInvulnerableViewValue(true);
			}}
		];

		this._fEnemySeq_seq_arr.push(Sequence.start(this.container, lScale_seq).once(Sequence.EVENT_ON_SEQUENCE_PLAYING_COMPLETED, this._onWizardSequenceCompleted, this));

		this._addFilters(0);
		let lBlure_seq = [
			{tweens: [{prop: 'blur', to: 2}],		duration: 7 * FRAME_RATE, onfinish: ()=>{this._removeFilters()} }
		];
		this._fEnemySeq_seq_arr.push(Sequence.start(this.container.filters[0], lBlure_seq).once(Sequence.EVENT_ON_SEQUENCE_PLAYING_COMPLETED, this._onWizardSequenceCompleted, this));
	}

	_onWizardSequenceCompleted(event)
	{
		let seq = event.target;
		let lId_num = this._fEnemySeq_seq_arr.indexOf(seq);
		if (~lId_num)
		{
			this._fEnemySeq_seq_arr.splice(lId_num, 1);
		}
		seq && seq.destructor();
	}

	_onTeleportedOut()
	{
		this._fTeleportInProgress_bl = false;
		this.emit(WizardEnemy.EVENT_ON_ENEMY_TELEPORT_OUT_COMPLETED);
	}
	//...TELEPORT OUT

	_resetTeleportAnimation()
	{
		this._fTeleportInProgress_bl = false;

		Sequence.destroy(Sequence.findByTarget(this));
	}

	_resetWizardView()
	{
		this._fIsWizardVisible_bl = true;
		this.container.scale.set(1, 1);
	}

	//override
	_freeze(aIsAnimated_bl = true)
	{
		super._freeze(aIsAnimated_bl);
		this._pauseAnimation();

		if (this._fTeleportOutInProgress_bl && !this._fIsWizardVisible_bl && this._fIsFireDenied_bl)
		{
			this._fIsWizardVisible_bl = true;
			this._fIsFireDenied_bl = false;
			this._fWasDissappearingInterruptedByFreeze_bl = true;
		}

		if (this._fEnemySeq_seq_arr && this._fEnemySeq_seq_arr.length)
		{
			this._destroyEnemySequences();
			this._destroyFrozenSprites();
			this._removeFilters();
			
			let lScale_seq = [
				{tweens: [{prop: 'scale.x', to: 1}, {prop: 'scale.y', to: 1}],		duration: 3 * FRAME_RATE, onfinish: () => {
					this._setInvulnerableViewValue(false);
					if (APP.isPixiHeavenLibrarySupported && this._fIsFrozen_bl)
					{
						this._destroyFrozenSprites();
						this._removeFilters();
						this._addFreezeEffect(aIsAnimated_bl);
					}
					}
				}
			];
			
			this._fEnemySeq_seq_arr.push(Sequence.start(this.container, lScale_seq).once(Sequence.EVENT_ON_SEQUENCE_PLAYING_COMPLETED, this._onWizardSequenceCompleted, this));
		}
	}

	//override
	static getDirection(angle)
	{
		let direction = DIRECTION.RIGHT_DOWN;
		if (angle > Math.PI * 2) angle -= Math.PI * 2;
		if (angle < 0) angle = 2 * Math.PI - angle;

		if (angle > 0) direction = DIRECTION.RIGHT_DOWN;
		if (angle > Math.PI / 2) direction = DIRECTION.LEFT_DOWN;

		return direction;
	}

	//override
	_calculateDirection(aOptAngle_num = undefined)
	{
		let lAngle_num = aOptAngle_num !== undefined ? aOptAngle_num : this.angle;

		return WizardEnemy.getDirection(lAngle_num);
	}

	//override
	getTurnAnimationName()
	{
		let lDirectionsAngles_int_arr = [0, 90]; //CCW
		let lFinalAngle_num = Number(this.direction.substr(3));
		let lFinalAngleIndex_int = lDirectionsAngles_int_arr.indexOf(lFinalAngle_num);

		let j = this.turnDirection == TURN_DIRECTION.CCW ? -1 : 1;
		let lPreviousAngleIndex_int = (lFinalAngleIndex_int + j) % lDirectionsAngles_int_arr.length;
		if (lPreviousAngleIndex_int < 0)
		{
			lPreviousAngleIndex_int = lDirectionsAngles_int_arr.length + lPreviousAngleIndex_int;
		}
		let lPreviousAngle_num = lDirectionsAngles_int_arr[lPreviousAngleIndex_int];

		return (lPreviousAngle_num + "_to_" + lFinalAngle_num + this.turnPostfix); //i.e. 270_to_180_turn
	}

	//override
	setDeath(aIsInstantKill_bl = false, aPlayerWin_obj = null)
	{
		super.setDeath(aIsInstantKill_bl, aPlayerWin_obj);

		this._removeFilters();

		APP.gameScreen.gameField.removeTeleportFilter(this.id);
	}

	//override
	_getPossibleDirections()
	{
		return [0, 90];
	}

	//override
	_unfreeze(aIsAnimated_bl = true)
	{
		super._unfreeze(aIsAnimated_bl);

		this._resumeAnimation();
		this._destroyEnemySequences();

		if (this._fTeleportOutInProgress_bl && this._fIsWizardVisible_bl && this._fWasDissappearingInterruptedByFreeze_bl)
		{
			this._fIsWizardVisible_bl = false;
			this._fIsFireDenied_bl = true;
			this._fWasDissappearingInterruptedByFreeze_bl = false;
		}

		if (this._fTeleportFx_wtfx && this._fTeleportFx_wtfx.isDisappearing)
		{
			this._addFilters(2);

			let lScale_seq = [
				{tweens: [],														duration: 1 * FRAME_RATE},
				{tweens: [{prop: 'scale.x', to: 0}, {prop: 'scale.y', to: 0}],		duration: 2 * FRAME_RATE, onfinish: () => {
					this._setInvulnerableViewValue(true);
					this._removeFilters();
				}}
			];
			
			this._fEnemySeq_seq_arr.push(Sequence.start(this.container, lScale_seq).once(Sequence.EVENT_ON_SEQUENCE_PLAYING_COMPLETED, this._onWizardSequenceCompleted, this));
		}
	}

	_pauseAnimation()
	{
		APP.gameScreen.gameField.pauseTeleportAnimation();

		this._fTeleportFx_wtfx && this._fTeleportFx_wtfx.pauseAnimation();
		this._fDisappearTimer_t  && this._fDisappearTimer_t.pause();
		this._fEnemySeq_seq_arr && this._fEnemySeq_seq_arr.length && this._fEnemySeq_seq_arr.forEach((seq) => { if (!seq) { debugger }; seq.pause();});
	}

	_resumeAnimation()
	{
		APP.gameScreen.gameField.resumeTeleportAnimation();

		this._fTeleportFx_wtfx && this._fTeleportFx_wtfx.resumeAnimation();
		this._fDisappearTimer_t  && this._fDisappearTimer_t.resume();
		this._fEnemySeq_seq_arr && this._fEnemySeq_seq_arr.length && this._fEnemySeq_seq_arr.forEach((seq) => { if (!seq) { debugger }; seq.resume();});
	}

	//override
	_onPointerRightClick(e)
	{
		if (this.isEnemyLockedForTarget)
		{
			e.stopPropagation();
			this.emit(WizardEnemy.EVENT_ON_ENEMY_RESET_TARGET_REQUIRED);
		}
		else
		{
			super._onPointerRightClick(e);
		}
	}

	_setInvulnerableViewValue(aValue_bl)
	{
		const lEnemies_obj_arr = APP.gameScreen.getEnemies();

		lEnemies_obj_arr.forEach(aEnemy_obj => {
			if(aEnemy_obj.id == this.id)
			{
				aEnemy_obj.invulnerableView = aValue_bl;
			}
		})
	}

	//override
	tick()
	{
		super.tick();

		this._fTeleportManager_tm && this._fTeleportManager_tm.invalidate();


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
			if(this._fTeleportFx_wtfx) this._fTeleportFx_wtfx.alpha = lEffectsAlphaMultiplier_num;
		}
		else
		{
			if(this._fTeleportFx_wtfx) this._fTeleportFx_wtfx.alpha *= lEffectsAlphaMultiplier_num;
		}
		//...EFFECTS TRANSPARENCY VALIDATION WHEN FROZEN|UNFROZEN
	}

	dabugLogWizardTrajectory()
	{
		const lCurrentPoint_obj = TrajectoryUtils.getPrevTrajectoryPoint(this.trajectory, APP.gameScreen.currentTime);

		if(!Utils.isEqualTrajectoryPoints(lCurrentPoint_obj, this.testpoint))
		{
			this.testpoint = lCurrentPoint_obj;
			// console.log("lCurrentPoint_obj", lCurrentPoint_obj);
			// console.log("id", this.id);
			// console.log(" ---------------------");
		}
	}

	_destroyEnemySequences()
	{
		if(this._fEnemySeq_seq_arr && this._fEnemySeq_seq_arr.length)
		{
			for (let i in this._fEnemySeq_seq_arr)
			{
				this._fEnemySeq_seq_arr[i] && this._fEnemySeq_seq_arr[i].destructor();
				this._fEnemySeq_seq_arr[i] = null;
			}
		}

		this._fEnemySeq_seq_arr = [];
	}

	destroy(purely)
	{
		this.container && Sequence.destroy(Sequence.findByTarget(this.container));

		this._fTeleportManager_tm && this._fTeleportManager_tm.destroy();
		this._fDisappearTimer_t && this._fDisappearTimer_t.destructor();

		if (this._fTeleportFx_wtfx)
		{
			this._fTeleportFx_wtfx.off(WizardTeleportFx.EVENT_ON_APPEAR_REQUIRED, this._onWizardAppearRequired, this);
			this._fTeleportFx_wtfx.off(WizardTeleportFx.EVENT_ON_DISAPPEAR_REQUIRED, this._onWizardDisappearRequired, this);
			this._fTeleportFx_wtfx.off(WizardTeleportFx.EVENT_ON_TELEPORTED_IN, this._onTeleportedIn, this);
			this._fTeleportFx_wtfx.off(WizardTeleportFx.EVENT_ON_TELEPORTED_OUT, this._onTeleportedOut, this);

			this._fTeleportFx_wtfx.destroy();
		}

		this._destroyEnemySequences();

		super.destroy(purely);

		this._fTeleportInProgress_bl = null;
		this._fTeleportOutInProgress_bl = null;
		this._fIsWizardVisible_bl = null;
		this._fTeleportFx_wtfx = null;
		this._fDisappearTimer_t = null;
		this._fEnemySeq_seq_arr = null;
	}
}

export default WizardEnemy;