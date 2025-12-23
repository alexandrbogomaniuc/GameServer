import SpineEnemy from './SpineEnemy';
import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { STATE_DEATH, STATE_TURN, DIRECTION, STATE_WALK, STATE_STAY } from './Enemy';
import { ENEMIES } from '../../../../shared/src/CommonConstants';
import Enemy from './Enemy';
import { Sprite } from '../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';

const HEALTH_STATE_NORMAL 	= 0;
const HEALTH_STATE_WEAK 	= 1;

export const WEAK_SUFFIX	= ' (w)';
export const WEAK_HEALTH_THRESHOLD = 0.15;

const WEAK_ANIMATION_IDEAL_DURATION = 1500;

export const STATE_CALL 	= 'call';

const CALL_ANIMATION_LENGTH = {
	ANUBIS: 1665,
	OSIRIS: 1328,
	RA: 2025
}

const TURN_ANIMATION_LENGTH = {
	ANUBIS: 161,
	OSIRIS: 168,
	RA: 165
}

const BOSS_SCALE = 1.25;
const STEP_SPEED_CORRECTION = 1 - (BOSS_SCALE - 1);

const ANUBIS_SPEED =
[
	// Normal
	{
		// Right Up
		'dir180': [
			{ time: 0,		speed: 0.21* STEP_SPEED_CORRECTION},
			{ time: 0.29,	speed: 0.15 * STEP_SPEED_CORRECTION },
			{ time: 0.905,	speed: 0.175 * STEP_SPEED_CORRECTION },
			{ time: 1.2,	speed: 0.15 * STEP_SPEED_CORRECTION }
		],
		// Right Down
		'dir90': [
			{ time: 0,		speed: 0.18 * STEP_SPEED_CORRECTION },
			{ time: 0.096,	speed: 0.36 * STEP_SPEED_CORRECTION },
			{ time: 0.24,	speed: 0.14 * STEP_SPEED_CORRECTION },
			{ time: 0.906,	speed: 0.179 * STEP_SPEED_CORRECTION },
			{ time: 1.2,	speed: 0.145 * STEP_SPEED_CORRECTION },
			{ time: 1.89,	speed: 0.173 * STEP_SPEED_CORRECTION }
		],
		// Left Up
		'dir270': [
			{ time: 0,		speed: 0.18 * STEP_SPEED_CORRECTION },
			{ time: 0.096,	speed: 0.33 * STEP_SPEED_CORRECTION },
			{ time: 0.242,	speed: 0.14 * STEP_SPEED_CORRECTION },
			{ time: 0.94,	speed: 0.196 * STEP_SPEED_CORRECTION },
			{ time: 1.21,	speed: 0.145 * STEP_SPEED_CORRECTION },
			{ time: 1.89,	speed: 0.173 * STEP_SPEED_CORRECTION }
		],
		// Left Down
		'dir0': [
			{ time: 0,		speed: 0.17 * STEP_SPEED_CORRECTION },
			{ time: 0.017,	speed: 0.38 * STEP_SPEED_CORRECTION },
			{ time: 0.2405,	speed: 0.14 * STEP_SPEED_CORRECTION },
			{ time: 0.974,	speed: 0.22 * STEP_SPEED_CORRECTION },
			{ time: 1.18,	speed: 0.145 * STEP_SPEED_CORRECTION }
		],

		// Turn
		'turn': {
			speed: 0.2
		}
	},

	// Weak
	{
		// Right Up
		'dir180': [
			{ time: 0,		speed: 0.57 * STEP_SPEED_CORRECTION },
			{ time: 0.49,	speed: 0.18 * STEP_SPEED_CORRECTION },
			{ time: 1.458,	speed: 0.5 * STEP_SPEED_CORRECTION },
			{ time: 1.88,	speed: 0.25 * STEP_SPEED_CORRECTION },
			{ time: 3.322,	speed: 0.57 * STEP_SPEED_CORRECTION }
		],
		// Right Down
		'dir90': [
			{ time: 0,		speed: 0.74 * STEP_SPEED_CORRECTION },
			{ time: 0.455,	speed: 0.18 * STEP_SPEED_CORRECTION },
			{ time: 1.453,	speed: 0.53 * STEP_SPEED_CORRECTION },
			{ time: 1.88,	speed: 0.25 * STEP_SPEED_CORRECTION },
			{ time: 3.322,	speed: 0.74 * STEP_SPEED_CORRECTION }
		],
		// Left Up
		'dir270': [
			{ time: 0,		speed: 0.62 * STEP_SPEED_CORRECTION },
			{ time: 0.442,	speed: 0.18 * STEP_SPEED_CORRECTION },
			{ time: 1.461,	speed: 0.5 * STEP_SPEED_CORRECTION },
			{ time: 1.88,	speed: 0.25 * STEP_SPEED_CORRECTION },
			{ time: 3.31,	speed: 0.62 * STEP_SPEED_CORRECTION }
		],
		// Left Down
		'dir0': [
			{ time: 0,		speed: 0.76 * STEP_SPEED_CORRECTION },
			{ time: 0.455,	speed: 0.18 * STEP_SPEED_CORRECTION },
			{ time: 1.453,	speed: 0.54 * STEP_SPEED_CORRECTION },
			{ time: 1.888,	speed: 0.25 * STEP_SPEED_CORRECTION },
			{ time: 3.322,	speed: 0.76 * STEP_SPEED_CORRECTION }
		],

		// Turn
		'turn': {
			speed: 0.2
		}
	}
]

const OSIRIS_SPEED =
[
	// Normal
	{
		// Right Up
		'dir180': [ // 1.998 Total
			{ time: 0,		speed: 0.32 * STEP_SPEED_CORRECTION },
			{ time: 0.01,	speed: 0.44 * STEP_SPEED_CORRECTION },
			{ time: 0.17,	speed: 0.1 * STEP_SPEED_CORRECTION },
			{ time: 0.96,	speed: 0.32 * STEP_SPEED_CORRECTION },
			{ time: 1.179,	speed: 0.107 * STEP_SPEED_CORRECTION },
			{ time: 1.99,	speed: 0.32 * STEP_SPEED_CORRECTION }
		],
		// Right Down
		'dir90': [
			{ time: 0,		speed: 0.34 * STEP_SPEED_CORRECTION },
			{ time: 0.15,	speed: 0.6 * STEP_SPEED_CORRECTION },
			{ time: 0.173,	speed: 0.103 * STEP_SPEED_CORRECTION },
			{ time: 0.96,	speed: 0.34 * STEP_SPEED_CORRECTION },
			{ time: 1.14,	speed: 0.4 * STEP_SPEED_CORRECTION },
			{ time: 1.13,	speed: 0.112 * STEP_SPEED_CORRECTION },
			{ time: 1.99,	speed: 0.34 * STEP_SPEED_CORRECTION }
		],
		// Left Up
		'dir270': [
			{ time: 0,		speed: 0.32 * STEP_SPEED_CORRECTION },
			{ time: 0.01,	speed: 0.42 * STEP_SPEED_CORRECTION },
			{ time: 0.17,	speed: 0.1 * STEP_SPEED_CORRECTION },
			{ time: 0.96,	speed: 0.32 * STEP_SPEED_CORRECTION },
			{ time: 1.08,	speed: 0.44 * STEP_SPEED_CORRECTION },
			{ time: 1.169,	speed: 0.107 * STEP_SPEED_CORRECTION },
			{ time: 1.99,	speed: 0.32 * STEP_SPEED_CORRECTION }
		],
		// Left Down
		'dir0': [
			{ time: 0,		speed: 0.34 * STEP_SPEED_CORRECTION },
			{ time: 0.15,	speed: 0.42 * STEP_SPEED_CORRECTION },
			{ time: 0.178,	speed: 0.103 * STEP_SPEED_CORRECTION },
			{ time: 0.96,	speed: 0.34 * STEP_SPEED_CORRECTION },
			{ time: 1.14,	speed: 0.32 * STEP_SPEED_CORRECTION },
			{ time: 1.14,	speed: 0.112 * STEP_SPEED_CORRECTION },
			{ time: 2.1,	speed: 0.34 * STEP_SPEED_CORRECTION }
		],

		// Turn
		'turn': {
			speed: 0.112
		}
	},

	// Weak
	{
		// Right Up
		'dir180': [ // 3.66 Total
			{ time: 0,		speed: 0.48 * STEP_SPEED_CORRECTION },
			{ time: 0.205,	speed: 0.52 * STEP_SPEED_CORRECTION },
			{ time: 0.3,	speed: 0.182 * STEP_SPEED_CORRECTION },
			{ time: 1.74,	speed: 0.32 * STEP_SPEED_CORRECTION },
			{ time: 1.8,	speed: 0.62 * STEP_SPEED_CORRECTION },
			{ time: 2.1,	speed: 0.196 * STEP_SPEED_CORRECTION },
			{ time: 3.6,	speed: 0.48 * STEP_SPEED_CORRECTION }
		],
		// Right Down
		'dir90': [
			{ time: 0,		speed: 0.48 * STEP_SPEED_CORRECTION },
			{ time: 0.106,	speed: 0.62 * STEP_SPEED_CORRECTION },
			{ time: 0.344,	speed: 0.184 * STEP_SPEED_CORRECTION },
			{ time: 1.734,	speed: 0.312 * STEP_SPEED_CORRECTION },
			{ time: 1.8,	speed: 0.62 * STEP_SPEED_CORRECTION },
			{ time: 2.103,	speed: 0.206 * STEP_SPEED_CORRECTION },
			{ time: 3.6,	speed: 0.48 * STEP_SPEED_CORRECTION }
		],
		// Left Up
		'dir270': [
			{ time: 0,		speed: 0.48 * STEP_SPEED_CORRECTION },
			{ time: 0.222,	speed: 0.52 * STEP_SPEED_CORRECTION },
			{ time: 0.3,	speed: 0.185 * STEP_SPEED_CORRECTION },
			{ time: 1.74,	speed: 0.32 * STEP_SPEED_CORRECTION },
			{ time: 1.8,	speed: 0.62 * STEP_SPEED_CORRECTION },
			{ time: 2.1,	speed: 0.205 * STEP_SPEED_CORRECTION },
			{ time: 3.6,	speed: 0.48 * STEP_SPEED_CORRECTION }
		],
		// Left Down
		'dir0': [
			{ time: 0,		speed: 0.66 * STEP_SPEED_CORRECTION },
			{ time: 0.106,	speed: 0.84 * STEP_SPEED_CORRECTION },
			{ time: 0.61,	speed: 0.154 * STEP_SPEED_CORRECTION },
			{ time: 1.634,	speed: 0.312 * STEP_SPEED_CORRECTION },
			{ time: 1.8,	speed: 0.64 * STEP_SPEED_CORRECTION },
			{ time: 2.123,	speed: 0.174 * STEP_SPEED_CORRECTION },
			{ time: 2.613,	speed: 0.172 * STEP_SPEED_CORRECTION },
			{ time: 3.6,	speed: 0.66 * STEP_SPEED_CORRECTION }
		],

		// Turn
		'turn': {
			speed: 0.48
		}
	}
];

const THOTH_SPEED =
[
	// Normal
	{
		// Right Up
		'dir180': [ // 2.66 Total 0.116 - stand
			{ time: 0,		speed: 0.28 * STEP_SPEED_CORRECTION },
			{ time: 0.1,	speed: 0.37 * STEP_SPEED_CORRECTION },
			{ time: 0.42,	speed: 0.099 * STEP_SPEED_CORRECTION },
			{ time: 1.26,	speed: 0.2 * STEP_SPEED_CORRECTION },
			{ time: 1.31,	speed: 0.42 * STEP_SPEED_CORRECTION },
			{ time: 1.84,	speed: 0.098 * STEP_SPEED_CORRECTION },
			{ time: 2.63,	speed: 0.26 * STEP_SPEED_CORRECTION }
		],
		// Right Down
		'dir90': [
			{ time: 0,		speed: 0.25 * STEP_SPEED_CORRECTION },
			{ time: 0.05,	speed: 0.3 * STEP_SPEED_CORRECTION },
			{ time: 0.158,	speed: 0.54 * STEP_SPEED_CORRECTION },
			{ time: 0.42,	speed: 0.109 * STEP_SPEED_CORRECTION },
			{ time: 1.3,	speed: 0.42 * STEP_SPEED_CORRECTION },
			{ time: 1.31,	speed: 0.52 * STEP_SPEED_CORRECTION },
			{ time: 1.8,	speed: 0.093 * STEP_SPEED_CORRECTION },
			{ time: 2.66,	speed: 0.25 * STEP_SPEED_CORRECTION }
		],
		// Left Up
		'dir270': [
			{ time: 0,		speed: 0.29 * STEP_SPEED_CORRECTION },
			{ time: 0.03,	speed: 0.31 * STEP_SPEED_CORRECTION },
			{ time: 0.42,	speed: 0.12 * STEP_SPEED_CORRECTION },
			{ time: 1.29,	speed: 0.24 * STEP_SPEED_CORRECTION },
			{ time: 1.37,	speed: 0.57 * STEP_SPEED_CORRECTION },
			{ time: 1.82,	speed: 0.14 * STEP_SPEED_CORRECTION },
			{ time: 2.63,	speed: 0.27 * STEP_SPEED_CORRECTION }
		],
		// Left Down
		'dir0': [
			{ time: 0,		speed: 0.25 * STEP_SPEED_CORRECTION },
			{ time: 0.05,	speed: 0.3 * STEP_SPEED_CORRECTION },
			{ time: 0.11,	speed: 0.54 * STEP_SPEED_CORRECTION },
			{ time: 0.53,	speed: 0.098 * STEP_SPEED_CORRECTION },
			{ time: 1.3,	speed: 0.42 * STEP_SPEED_CORRECTION },
			{ time: 1.31,	speed: 0.42 * STEP_SPEED_CORRECTION },
			{ time: 1.8,	speed: 0.0948 * STEP_SPEED_CORRECTION },
			{ time: 2.66,	speed: 0.25 * STEP_SPEED_CORRECTION }
		],

		// Turn
		'turn': {
			speed: 0.25
		}
	},

	// Weak
	{
		// Right Up
		'dir180': [ // 2.16 Total 0.23 -stand
			{ time: 0,		speed: 0.184 * STEP_SPEED_CORRECTION },
			{ time: 0.636,	speed: 0.41 * STEP_SPEED_CORRECTION },
			{ time: 1,		speed: 0.44 * STEP_SPEED_CORRECTION },
			{ time: 1.54,	speed: 0.184 * STEP_SPEED_CORRECTION }
		],
		// Right Down
		'dir90': [
			{ time: 0,		speed: 0.2 * STEP_SPEED_CORRECTION },
			{ time: 0.2,	speed: 0.254 * STEP_SPEED_CORRECTION },
			{ time: 0.636,	speed: 0.41 * STEP_SPEED_CORRECTION },
			{ time: 1,		speed: 0.44 * STEP_SPEED_CORRECTION },
			{ time: 1.54,	speed: 0.184 * STEP_SPEED_CORRECTION },
			{ time: 1.94,	speed: 0.2 * STEP_SPEED_CORRECTION }
		],
		// Left Up
		'dir270': [
			{ time: 0,		speed: 0.26 * STEP_SPEED_CORRECTION },
			{ time: 0.08,	speed: 0.28 * STEP_SPEED_CORRECTION },
			{ time: 0.636,	speed: 0.41 * STEP_SPEED_CORRECTION },
			{ time: 1,		speed: 0.44 * STEP_SPEED_CORRECTION },
			{ time: 1.54,	speed: 0.26 * STEP_SPEED_CORRECTION }
		],
		// Left Down
		'dir0': [
			{ time: 0,		speed: 0.322 * STEP_SPEED_CORRECTION },
			{ time: 0.636,	speed: 0.41 * STEP_SPEED_CORRECTION },
			{ time: 1,		speed: 0.44 * STEP_SPEED_CORRECTION },
			{ time: 1.54,	speed: 0.19 * STEP_SPEED_CORRECTION }
		],

		// Turn
		'turn': {
			speed: 0.2
		}
	}
];

class BossEnemy extends SpineEnemy
{

	constructor(params)
	{
		super(params);

		this._fWeakTransitionInProgress_bl = false;
		this._fIsWeakTurningNeeded_bl = false; //faster turning for call-animation

		if (this._fHealthState_int === undefined)
		{
			this._fHealthState_int = HEALTH_STATE_NORMAL;
		}

		this._fPauseTimeMarker_num = undefined;
		this._fFreezingMarker_num = undefined;

		//DEBUG...
		// this._fKeyDownHandler_func = this._keyDownHandler.bind(this);
		// window.addEventListener("keydown", this._fKeyDownHandler_func, false);
		//...DEBUG
	}

	_updateAppearSpineViewIfRequired()
	{
		if (
				APP.currentWindow.gameStateController.info.subroundLasthand
				|| !!this._fAppearSpineViewAlreadyApplied_bl
			)
		{
			return;
		}

		this._updateAppearSpineView();
	}

	_updateAppearSpineView()
	{
		let lOffset_num = 0;

		switch (this.name)
		{
			case ENEMIES.Anubis:
				lOffset_num = 1.84;
			break;
			case ENEMIES.Osiris:
				lOffset_num = 1.6;
			break;
			case ENEMIES.Thoth:
				lOffset_num = 3.32;
			break;
		}

		this.spineView.updatePosition(lOffset_num);
		this._fWalkStartOffset_num = lOffset_num;
		this._fAppearSpineViewAlreadyApplied_bl = true; //no need to add _fAppearSpineViewAlreadyApplied_bl to constructor, because _invalidateStates triggers in superclass constructor
	}

	_updateSpeed()
	{
		this.spineSpeed = this.getSpineSpeed();
		this.spineView.view.state.timeScale = this.spineSpeed;

		if (this.spineView.playing)
		{
			this.spineView.updatePosition();
		}
	}

	//override
	getSpineSpeed()
	{
		if (this.state === STATE_CALL)
		{
			let animationLast = this._getCurrentCallAnimationLength();
			let lTurnDurationBeforeCall_ms_num = this._fIsWeakTurningNeeded_bl ? this._getCurrentTurnAnimationLength() : 0;
			let lCallSpineSpeed_num = animationLast/(WEAK_ANIMATION_IDEAL_DURATION - lTurnDurationBeforeCall_ms_num*2);
			return lCallSpineSpeed_num;
		}

		if (this.state === STATE_TURN && this._fWeakTransitionInProgress_bl)
		{
			return 1;
		}

		let lSpeed_num = 0.2;

		if (this._fSpecificSpineSpeed_num !== undefined)
		{
			lSpeed_num = this._fSpecificSpineSpeed_num;
		}

		return lSpeed_num * this.speed;
	}

	_getCurrentCallAnimationLength()
	{
		switch (this.name)
		{
			case ENEMIES.Anubis:
				return CALL_ANIMATION_LENGTH.ANUBIS;
				break;
			case ENEMIES.Osiris:
				return CALL_ANIMATION_LENGTH.OSIRIS;
				break;
			case ENEMIES.Thoth:
				return CALL_ANIMATION_LENGTH.RA;
				break;
		}
		throw new Error(`No Call state found for boss with the name ${this.name}`);
	}

	_getCurrentTurnAnimationLength()
	{
		switch (this.name)
		{
			case ENEMIES.Anubis:
				return TURN_ANIMATION_LENGTH.ANUBIS;
				break;
			case ENEMIES.Osiris:
				return TURN_ANIMATION_LENGTH.OSIRIS;
				break;
			case ENEMIES.Thoth:
				return TURN_ANIMATION_LENGTH.RA;
				break;
		}
		throw new Error(`No Turn state found for boss with the name ${this.name}`);
	}

	_invalidateStates()
	{
		this._invalidateHealthState(true);
		this._updateAppearSpineViewIfRequired();

		super._invalidateStates();
	}

	set energy(aValue_num)
	{
		if (this.energy != aValue_num && !isNaN(aValue_num))
		{
			super.energy = aValue_num;
			if (!this.isHealthStateWeak)
			{
				this._invalidateHealthState();
			}
		}
	}

	get energy()
	{
		return super.energy;
	}

	get isHealthStateWeak()
	{
		return this.healthState == HEALTH_STATE_WEAK;
	}

	set healthState(aHealthState_int)
	{
		this._fHealthState_int = aHealthState_int;
	}

	get healthState()
	{
		return this._fHealthState_int;
	}

	_initElectricity()
	{
		APP.profilingController.info.isVfxProfileValueMediumOrGreater && super._initElectricity();
	}

	_invalidateHealthState(aImmediately_bl = false)
	{
		let totalBossHP = this.fullEnergy;
		let healthPercent = this.energy / totalBossHP;
		if (healthPercent <= WEAK_HEALTH_THRESHOLD && !this.isHealthStateWeak && !this.isFrozen && !this._fWeakTransitionInProgress_bl)
		{
			this._startWeakState(aImmediately_bl);
		}
	}

	_startWeakState(aImmediately_bl = false)
	{
		this.healthState = HEALTH_STATE_WEAK;
		if (!aImmediately_bl)
		{
			//stop and play CALL animation
			if (this.spineView && this.spineView.view && this.spineView.view.state)
			{
				this.spineView.removeAllListeners();
			}
			if (!this._isImmidiateCallAllowed)
			{
				//wait for TURN complete
				this.stateListener = {complete: (e) =>{
					this.spineView && this.spineView.stop();
					this._setCall();
				}};
				this.spineView.view.state.addListener(this.stateListener);
			}
			else
			{
				this._setCall();
			}
		}
		else
		{
			this.changeTextures(this.state);
		}
	}

	get _isImmidiateCallAllowed()
	{
		return this.state != STATE_TURN;
	}

	_getCallAnimationName()
	{
		switch (this.direction)
		{
			case DIRECTION.LEFT_UP:		return '270_midlife';
			case DIRECTION.LEFT_DOWN:	return '0_midlife';
			case DIRECTION.RIGHT_UP:	return '180_midlife';
			case DIRECTION.RIGHT_DOWN:	return '90_midlife';
		}
		throw new Error (this.direction + " is not supported direction.");
	}

	showBossAppearance(aSequence_arr, aInitialParams_obj)
	{
		super.showBossAppearance(aSequence_arr, aInitialParams_obj);

		this.setStay();
	}

	//override
	_freeze(aIsAnimated_bl = true)
	{
		if (!this._fIsFrozen_bl && !isNaN(this._fPauseTimeMarker_num))
		{
			this._fFreezingMarker_num = (new Date()).getTime();
		}
		super._freeze(aIsAnimated_bl);
	}

	//override
	_unfreeze(aIsAnimated_bl = true)
	{
		let lFreezingDelta_num = 0;
		if (!isNaN(this._fFreezingMarker_num))
		{
			lFreezingDelta_num = (new Date()).getTime() - this._fFreezingMarker_num;
			this._fFreezingMarker_num = undefined;

			if (!isNaN(this._fPauseTimeMarker_num)) //freezing in the middle of call animation
			{
				this._fPauseTimeMarker_num = this._fPauseTimeMarker_num + lFreezingDelta_num;
				let lDelta_num = (new Date()).getTime() - this._fPauseTimeMarker_num;
				let pt = {x: this.x, y: this.y};
				pt.y += this.getCurrentFootPointPosition().y;
				pt.x += this.getCurrentFootPointPosition().x;
				this.emit(Enemy.EVENT_ON_ENEMY_ADD_TRAJECTORY_POINT, {enemyId: this.id, x: pt.x, y: pt.y, timeOffset: -lDelta_num});
				this._fPauseTimeMarker_num = (new Date()).getTime();
			}
		}

		super._unfreeze(aIsAnimated_bl);
		this._invalidateHealthState();
	}

	//override
	_addFreezeCover()
	{
		let lMaskPos_pt = this._fFreezeMask_sprt.position;

		let lFreezeCover_sprt = new Sprite();

		for (let i = 0; i < 2; ++i)
		{
			for (let j = 0; j < 2; ++j)
			{
				let lFreezing_sprt = new PIXI.heaven.Sprite(APP.library.getSprite('weapons/Cryogun/Freeze').textures[0]);
				lFreezing_sprt.anchor.set(0.2, 0.2);
				lFreezing_sprt.zIndex = this._fFreezeMask_sprt.zIndex+1;
				lFreezing_sprt.maskSprite = this._fFreezeMask_sprt;
				lFreezing_sprt.pluginName = 'batchMasked';
				//this._fFreezeMask_sprt.renderable = false;
				lFreezeCover_sprt.addChild(lFreezing_sprt);
				lFreezing_sprt.position.set(120 * i, 120 * j);
			}
		}

		lFreezeCover_sprt.position.set(lMaskPos_pt.x, lMaskPos_pt.y);

		let lFreezeBounds_obj = lFreezeCover_sprt.getBounds();
		let lFreezeCoverScaleY_num =  (this._getApproximateHeight()) / lFreezeBounds_obj.height;
		let lFreezeCoverScaleX_num = (this._getApproximateWidth()) / lFreezeBounds_obj.width;
		let lMaxScale_num = Math.max(lFreezeCoverScaleX_num, lFreezeCoverScaleY_num);
		lFreezeCover_sprt.scale.set(lMaxScale_num, lMaxScale_num);

		this._fFreezeBaseContainer_sprt.addChild(lFreezeCover_sprt);
		this._fFreezeCover_sprt = lFreezeCover_sprt;
		this._fFreezeMask_sprt.alpha = 0.24;
	}

	_pauseBossWalking()
	{
		if (!isNaN(this._fPauseTimeMarker_num)) return; // already paused

		this._fPauseTimeMarker_num = (new Date()).getTime();

		let pt = {x: this.x, y: this.y};
		pt.y += this.getCurrentFootPointPosition().y;
		pt.x += this.getCurrentFootPointPosition().x;

		this.emit(Enemy.EVENT_ON_ENEMY_PAUSE_WALKING, {enemyId: this.id});
	}

	_resumeBossWalking()
	{
		let delta = 0;
		if (!isNaN(this._fPauseTimeMarker_num))
		{
			delta = (new Date()).getTime() - this._fPauseTimeMarker_num;
			this._fPauseTimeMarker_num = undefined;
		}

		let pt = {x: this.x, y: this.y};
		pt.y += this.getCurrentFootPointPosition().y;
		pt.x += this.getCurrentFootPointPosition().x;
		this.emit(Enemy.EVENT_ON_ENEMY_ADD_TRAJECTORY_POINT, {enemyId: this.id, x: pt.x, y: pt.y, timeOffset: -delta});

		this.emit(Enemy.EVENT_ON_ENEMY_RESUME_WALKING, {enemyId: this.id, timeOffset: delta});
	}

	_setCall()
	{
		if (!this._fWeakTransitionInProgress_bl)
		{
			this._pauseBossWalking();
			this._fWeakTransitionInProgress_bl = true;
			this._fCallMarker_num = (new Date()).getTime();
		}

		if (this.spineView.view && this.spineView.view.state)
		{
			this.spineView.removeAllListeners();
		}

		this.changeTextures(STATE_CALL);
		this._triggerCallSound();
		this.stateListener = {complete: (e) =>{
			this.spineView && this.spineView.stop();
			this._onWeakTransitionCompleted();
		}};
		this.spineView.view.state.timeScale = this.getSpineSpeed();
		this.spineView.view.state.addListener(this.stateListener);
	}

	_triggerCallSound()
	{
		switch (this.name)
		{
			case ENEMIES.Anubis:
			case ENEMIES.Osiris:
			case ENEMIES.Thoth:
			break;
		}
	}

	_onWeakTransitionCompleted()
	{
		let callDuration = (new Date()).getTime() - this._fCallMarker_num;

		this._fWeakTransitionInProgress_bl = false;
		this._fIsWeakTurningNeeded_bl = false;
		this.setWalk();
		this._resumeBossWalking();

		this.spineSpeed = this.getSpineSpeed();
		this.spineView.view.state.timeScale = this.spineSpeed;
	}

	//override
	getStepTimers()
	{
		let timers = [];

		if (this.state == STATE_WALK)
		{
			switch (this.name)
			{
				case ENEMIES.Anubis:
					if (this.isHealthStateWeak)	timers = [{time: 0.03}, {time: 1.58}];
					else						timers = [{time: 0.05}, {time: 1.1}];
				break;

				case ENEMIES.Osiris:
					if (this.isHealthStateWeak)	timers = [{time: 0.03}, {time: 1.9}];
					else						timers = [{time: 0.01}, {time: 0.96}];
				break;

				case ENEMIES.Thoth:
					if (this.isHealthStateWeak)	timers = [{time: 0.1}, {time: 1.4}];
					else						timers = [{time: 0.1}, {time: 1.45}];
				break;
			}
		}

		this._stepsAmount = timers.length;

		return timers;
	}

	//override
	_calculateAnimationName(stateType)
	{
		if (stateType === STATE_CALL)
		{
			return this._getCallAnimationName();
		}

		let lAnimationName_str = super._calculateAnimationName(stateType);
		if (this.isHealthStateWeak)
		{
			lAnimationName_str += WEAK_SUFFIX;
		}
		return lAnimationName_str;
	}

	//override
	_calculateAnimationLoop(stateType)
	{
		let animationLoop = true;

		switch(stateType)
		{
			case STATE_DEATH:
			case STATE_TURN:
			case STATE_CALL:
			{
				animationLoop = false;
				break;
			}
		}

		return animationLoop;
	}

	//override
	changeSpineView(type, noChangeFrame)
	{
		super.changeSpineView(type, noChangeFrame);

		this.changeShadowPosition();

		if (isNaN(this._fWalkStartOffset_num) && this._fWalkStartOffset_num > 0)
		{
			this.spineView.updatePosition(this._fWalkStartOffset_num);
			this._fWalkStartOffset_num = undefined;
		}
	}

	//override
	changeShadowPosition()
	{
		var x = 0, y = 0, scale = 1.7;
		switch (this.name)
		{
			case ENEMIES.Anubis:
				switch(this.direction)
				{
					case DIRECTION.LEFT_DOWN:
						x = 5;
						y = -15;
						break;
					case DIRECTION.LEFT_UP:
						x = 0;
						y = -2;
						break;
					case DIRECTION.RIGHT_DOWN:
						x = 10;
						y = -15;
						break;
					case DIRECTION.RIGHT_UP:
						x = 4;
						y = -6;
						break;
				}
				break;
			case ENEMIES.Osiris:
				switch (this.direction)
				{
					case DIRECTION.LEFT_UP:
						y = -10;
						x = -15;
						break;
					case DIRECTION.RIGHT_UP:
						y = -10;
						x = 17;
						break;
					case DIRECTION.LEFT_DOWN:
						x = 6;
						y = 5;
						break;
					case DIRECTION.RIGHT_DOWN:
						x = 0;
						y = 5;
						break;
				}
				break;
			case ENEMIES.Thoth:
				switch(this.direction)
				{
					case DIRECTION.LEFT_DOWN:
						x = 10;
						y = 0;
						break;
					case DIRECTION.LEFT_UP:
						x = -15;
						y = -10;
						break;
					case DIRECTION.RIGHT_DOWN:
						x = -4;
						y = -1;
						break;
					case DIRECTION.RIGHT_UP:
						x = 15;
						y = -6;
						break;
				}
				break;
		}
		this.shadow.position.set(x, y);
		this.shadow.scale.set(scale);
	}

	//override
	_restoreStateBeforeFreeze()
	{
		if (this._fWeakTransitionInProgress_bl)
		{
			this._onWeakTransitionCompleted();
		}
		else
		{
			this.setWalk();
		}
	}

	//override
	updateSpineAnimation()
	{
		super.updateSpineAnimation();

		if (this.spineView && this.spineView.alpha != 0 && this.spineView.view && this.spineView.view.state && this.spineView.view.state.tracks[0])
		{
			let lAnimTime_num = this.spineView.view.state.tracks[0].animationLast;
			this._bossSpeedHandler(lAnimTime_num)
		}
	}

	/**
	 * Boss speed management
	 */
	_bossSpeedHandler(aAnimTime_num)
	{
		let lSpeedSetting_arr = {};
		let lSpineSpeed_num = 0.2;

		let lWeaknessState_num = this.isHealthStateWeak ? 1 : 0;

		let lDirection_num = this.direction || DIRECTION.LEFT_DOWN;

		if (this.state == STATE_WALK)
		{
			lSpeedSetting_arr = this._getSpeed(this.name, lWeaknessState_num, lDirection_num);

			for (let i = 0; i < lSpeedSetting_arr.length; ++i)
			{
				let lTime_num = lSpeedSetting_arr[i].time;
				let lSpeed_num = lSpeedSetting_arr[i].speed;

				if (lTime_num < aAnimTime_num)
				{
					lSpineSpeed_num = lSpeed_num;
				}
			}
		}
		else
		{
			lDirection_num = 'turn';

			lSpeedSetting_arr = this._getSpeed(this.name, lWeaknessState_num, lDirection_num);

			lSpineSpeed_num = lSpeedSetting_arr.speed;
		}

		if (this._fSpecificSpineSpeed_num !== lSpineSpeed_num)
		{
			this._fSpecificSpineSpeed_num = lSpineSpeed_num;
			this._updateSpeed();
		}
	}

	_getSpeed(aName_str, aWeak_bln, aDir_str)
	{
		let lSpeedSetting_arr = [];

		switch (aName_str)
		{
			case ENEMIES.Anubis:
				lSpeedSetting_arr = ANUBIS_SPEED[aWeak_bln][aDir_str];
				break;
			case ENEMIES.Osiris:
				lSpeedSetting_arr = OSIRIS_SPEED[aWeak_bln][aDir_str];
			break;
			case ENEMIES.Thoth:
				lSpeedSetting_arr = THOTH_SPEED[aWeak_bln][aDir_str];
			break;
		}

		return lSpeedSetting_arr;
	}

	//override
	destroy()
	{
		this._fWalkStartOffset_num = undefined;
		this._fWeakTransitionInProgress_bl = false;
		this._fIsWeakTurningNeeded_bl = false;
		this._fPauseTimeMarker_num = undefined;
		this._fAppearSpineViewAlreadyApplied_bl = undefined;
		this._fFreezingMarker_num = undefined;
		//DEBUG...
		//window.removeEventListener("keydown", this._fKeyDownHandler_func, false);
		//...DEBUG
		super.destroy();
	}
}

export default BossEnemy;