import SpineEnemy from './SpineEnemy';
import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { STATE_DEATH, STATE_TURN, DIRECTION, STATE_WALK } from './Enemy';
import Enemy from './Enemy';
import { Sprite } from '../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';

class BossEnemy extends SpineEnemy
{
	static get EVENT_ON_BOSS_ENEMY_APPEARANCE_TIME()					{ return "EVENT_ON_BOSS_ENEMY_APPEARANCE_TIME"; }

	get isBoss()
	{
		return true;
	}

	constructor(params)
	{
		super(params);

		this._fPauseTimeMarker_num = undefined;
		this._fFreezingMarker_num = undefined;
	}

	_updateAppearSpineViewIfRequired()
	{
		if (APP.currentWindow.gameStateController.info.subroundLasthand || !!this._fAppearSpineViewAlreadyApplied_bl)
		{
			return;
		}

		this._updateAppearSpineView();
	}

	_updateAppearSpineView()
	{
		let lOffset_num = 0;

		this.spineView.updatePosition(lOffset_num);
		this._fWalkStartOffset_num = lOffset_num;
		this._fAppearSpineViewAlreadyApplied_bl = true;
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
		let lSpeed_num = 0.2;

		if (this._fSpecificSpineSpeed_num !== undefined)
		{
			lSpeed_num = this._fSpecificSpineSpeed_num;
		}

		return lSpeed_num * this.currentTrajectorySpeed;
	}

	_getCurrentTurnAnimationLength()
	{
		throw new Error(`No Turn state found for boss with the name ${this.name}`);
	}

	_invalidateStates()
	{
		this._updateAppearSpineViewIfRequired();

		super._invalidateStates();
	}

	set energy(aValue_num)
	{
		if (this.energy != aValue_num && !isNaN(aValue_num))
		{
			super.energy = aValue_num;
		}
	}

	get energy()
	{
		return super.energy;
	}

	onBossAppearanceTime()
	{
		this.setStay();

		this.emit(BossEnemy.EVENT_ON_BOSS_ENEMY_APPEARANCE_TIME);
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

			if (!isNaN(this._fPauseTimeMarker_num))
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
				let lFreezing_sprt = new PIXI.heaven.Sprite(APP.library.getSpriteFromAtlas('weapons/Cryogun/Freeze').textures[0]);
				lFreezing_sprt.anchor.set(0.2, 0.2);
				lFreezing_sprt.zIndex = this._fFreezeMask_sprt.zIndex+1;
				lFreezing_sprt.maskSprite = this._fFreezeMask_sprt;
				lFreezing_sprt.pluginName = 'batchMasked';
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
		this._fFreezeMask_sprt.alpha = 0.28;
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

	//override
	getStepTimers()
	{
		let timers = [];

		this._stepsAmount = timers.length;

		return timers;
	}

	//override
	_calculateAnimationName(stateType)
	{
		let lAnimationName_str = super._calculateAnimationName(stateType);
		return lAnimationName_str;
	}

	//override
	_calculateAnimationLoop(stateType)
	{
		let animationLoop = true;

		switch(stateType)
		{
			case STATE_TURN:
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
		if(!this.shadow) return;
		this.shadow.position.set(x, y);
		this.shadow.scale.set(scale);
	}

	//override
	_restoreStateBeforeFreeze()
	{
		this.setWalk();
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

		let lDirection_num = this.direction || DIRECTION.LEFT_DOWN;

		if (this.state == STATE_WALK)
		{
			lSpeedSetting_arr = this._getSpeed(this.name, lDirection_num);

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

			lSpeedSetting_arr = this._getSpeed(this.name, lDirection_num);

			lSpineSpeed_num = lSpeedSetting_arr.speed;
		}

		if (this._fSpecificSpineSpeed_num !== lSpineSpeed_num)
		{
			this._fSpecificSpineSpeed_num = lSpineSpeed_num;
			this._updateSpeed();
		}
	}

	_getSpeed(aName_str, aDir_str)
	{
		let lSpeedSetting_arr = [];

		return lSpeedSetting_arr;
	}

	//override
	destroy()
	{
		this._fWalkStartOffset_num = undefined;
		this._fPauseTimeMarker_num = undefined;
		this._fAppearSpineViewAlreadyApplied_bl = undefined;
		this._fFreezingMarker_num = undefined;
		super.destroy();
	}
}

export default BossEnemy;