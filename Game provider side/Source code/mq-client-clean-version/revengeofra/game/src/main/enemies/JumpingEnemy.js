import SpineEnemy from './SpineEnemy';
import { STATE_WALK } from './Enemy';
import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { Utils } from '../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';

const JUMP_MIN_Y_POSITION = 280;
const JUMP_MIN_ANIMATION_LENGTH = 1200; // frames

const SPAWN_POINT = {x: 960, y: 0}

const JUMP_TIMES_1 = [5000, 3000, 2000];
const JUMP_TIMES_2 = [6000, 5000, 1000];

class JumpingEnemy extends SpineEnemy
{
	get isJumping()
	{
		return this._fIsJumping_bl;
	}

	get colliderYShift()
	{
		if (!this.spineView || !this.spineView.view) return 0;

		let lBounds_obj = this.spineView.view.getLocalBounds();
		let lY_num = lBounds_obj.y * this.spineView.scale.y + this.spineViewPos.y;
		let lH_num = lBounds_obj.height * this.spineView.scale.y;

		return lY_num + lH_num - 10;
	}

	constructor(params)
	{
		super(params);

		this._fIsJumping_bl = false;
		this._fJumpsTimers_arr = [];
		this._fJumpsCount_num = 0;
	}

	_invalidateStates()
	{
		this._onAppearingSuspicion();
		super._invalidateStates();
	}

	//APPEARANCE...
	_onAppearingSuspicion()
	{
		if (
				Utils.isEqualPoints(this.trajectory.points[0], this.trajectory.points[1]) && (this.trajectory.points[0].time < this.trajectory.points[1].time)
				&&  !this._fCryogunsController_cgs.i_isEnemyFrozen(this.id)
			)
		{
			//appearance jumping is needed
			this._startAppearing();
		}
	}

	_resetAppearing()
	{
		this._fIsAppearing_bl = false;
		this._fAppearanceDuration_num = undefined;
		this._fAppearanceStartTime_num = undefined;
		this._fAppearingPercent_num = undefined;
		this._fFreezePostponedFunction_func = null;
		this._resetJumping();
	}

	_startAppearing()
	{
		this._fIsAppearing_bl = true;
		this._fAppearingPercent_num = 0;
		this._fFreezePostponedFunction_func = null;
		this._updateAppearanceTrajectory();
	}

	_updateAppearanceTrajectory()
	{
		let lSpawnPoint_pt = {x: SPAWN_POINT.x, y: SPAWN_POINT.y, time: this.trajectory.points[0].time}
		this.trajectory.points.unshift(lSpawnPoint_pt);
		//[spawnPoint, landingPoint, startWalkingPoint, ...]

		let lPrevPoint_pt = this.trajectory.points[0];
		let lNextPoint_pt = this.trajectory.points[2];
		this._fAppearanceDuration_num = lNextPoint_pt.time - lPrevPoint_pt.time;
		this.trajectory.points[1].time = this._fAppearanceDuration_num/3 + this.trajectory.points[0].time
		this._fAppearanceStartTime_num = lPrevPoint_pt.time;
		this.initialDirection = null;

		this.position.set(lSpawnPoint_pt.x, lSpawnPoint_pt.y);
		this.appearancePositionUpdated = true; //position was updated but GameScreen already thinks it is previous - we need to notify it
	}

	_updateAppearanceAnimation()
	{
		if (!this.spineView || !this.spineView.view || !this.spineView.view.state || !this.spineView.view.state.tracks || !this.spineView.view.state.tracks[0]) return;
		if (!this.parent) return;

		this.appearancePositionUpdated = false;

		this.spineView.stop();
		let lAnimationTiming_num = this.spineView.view.state.tracks[0].animationLast;

		let lCurrentTimeDiff_num = APP.currentWindow.currentTime - this._fAppearanceStartTime_num;
		let lPer_num = Math.min(1, lCurrentTimeDiff_num/this._fAppearanceDuration_num);
		let lAnimationCoef_num = lPer_num * 0.5 + 0.5;
		this._fAppearingPercent_num = lPer_num; // current percent of appearing completion

		let lIsInvalidated_bl = this._invalidatePostponed();

		if (lPer_num >= 1)
		{
			this._resetAppearing();
			return;
		}

		if (lIsInvalidated_bl)
		{
			return;
		}

		this.spineView.updatePosition(lAnimationTiming_num > 0 ? -lAnimationTiming_num : 0);
		this.spineView.updatePosition(lAnimationCoef_num * 0.6 /*0.6 is a default coef, magic, but it works for this particular spine animation, found by accident*/);
	}

	_invalidatePostponed()
	{
		return this._freezeSuspicion();
	}
	//...APPEARANCE

	_resetJumping()
	{
		this._fIsJumping_bl = false;
		this.changeView();
	}

	//override
	changeSpineView(type, noChangeFrame)
	{
		if (this._fIsAppearing_bl && this.spineView)
		{
			return;
		}
		super.changeSpineView(type, noChangeFrame);
	}

	//override
	_calcWalkAnimationName(aDirection_str)
	{
		let lWalkingAnimationName_str = this._fIsJumping_bl ? "jump" : "walk";
		return super._calcWalkAnimationName(aDirection_str, lWalkingAnimationName_str);
	}

	//override
	getSpineSpeed()
	{
		if (this._fIsAppearing_bl)
			return 1;
		if (this._fIsJumping_bl)
			return this.jumpingSpineSpeed;
		return super.getSpineSpeed();
	}

	get jumpingSpineSpeed()
	{
		return 0.11 * this.speed;
	}

	_calculateJumps()
	{
		this._fJumpsCount_num = 0;
		let currentTime = APP.gameScreen.accurateCurrentTime;
		let walkTime = this.nextTurnPoint.time - currentTime;
		this._fJumpsTimers_arr = this.nextTurnPoint.time % 2 ? JUMP_TIMES_1 : JUMP_TIMES_2;
		for (let i = 0; i < this._fJumpsTimers_arr.length; ++i)
		{
			if (walkTime > this._fJumpsTimers_arr[i]) ++this._fJumpsCount_num;
		}
	}

	//override
	changeTextures(type, noChangeFrame)
	{
		this.spineView && this.spineView.view && (this.spineView.view.state.onChange = null);

		if (type === STATE_WALK)
		{
			// jump if possible
			this._fIsJumping_bl = this.isJumpPossible
		}

		if (this.state === STATE_WALK && type != STATE_WALK && this._fIsAppearing_bl)
		{
			//reset appearing
			this._resetAppearing();
		}

		super.changeTextures(type, noChangeFrame);

		if (type === STATE_WALK)
		{
			if (!this._fIsAppearing_bl)
			{
				this.spineView.view.state.onComplete = ((e) => {
					this.changeTextures(type, noChangeFrame)}
				);
			}
		}
	}

	get _customSpineTransitionsDescr()
	{
		return [
					{from: "<PREFIX>walk", to: "<PREFIX>jump", duration: 0.2}
				];
	}

	//override
	endTurn(aInitial_bl = false)
	{
		this._calculateJumps();

		super.endTurn(aInitial_bl);
	}

	get isJumpPossible()
	{
		let currentTime = APP.gameScreen.accurateCurrentTime;
		let lMinJumpAnimationDuration_num = JUMP_MIN_ANIMATION_LENGTH / this.jumpingSpineSpeed; //= ms
		let lTimeTillNextTurn_num = this.nextTurnPoint ? this.nextTurnPoint.time - currentTime : 0;
		let isJumpTime = false;

		if (this._fJumpsTimers_arr)
		{
			let totalJumps = this._fJumpsTimers_arr.length;
			for (let i = 0; i < totalJumps; ++i)
			{
				if (this._fJumpsCount_num == totalJumps-i && lTimeTillNextTurn_num > this._fJumpsTimers_arr[i])
				{
					isJumpTime = true;
					--this._fJumpsCount_num;
					break;
				}
			}
		}

		return this._fIsAppearing_bl || (
				isJumpTime
				&& this.getGlobalPosition().y > JUMP_MIN_Y_POSITION
				&& lTimeTillNextTurn_num > lMinJumpAnimationDuration_num
			);
	}

	//override
	getLocalCenterOffset()
	{
		if (!this._fIsJumping_bl)
		{
			return super.getLocalCenterOffset();
		}

		let lAnimationTiming_num = Math.max(0, this.spineView.view.state.tracks[0].animationLast * 1000);
		let lAnimationLength_num = this._fIsAppearing_bl ? JUMP_MIN_ANIMATION_LENGTH * 0.5 : JUMP_MIN_ANIMATION_LENGTH;
		let lPercent_num = lAnimationTiming_num/ lAnimationLength_num;

		if (lPercent_num < 0.2 || lPercent_num > 0.7) return super.getLocalCenterOffset();
		lPercent_num = Math.min(1, Math.max(0, lPercent_num - 0.2) * 100/50);
		let lCoef_num = (lPercent_num > 0.5 ? (1 - lPercent_num) : lPercent_num) * 2;

		let pos = super.getLocalCenterOffset();
		pos.y -= 200 * lCoef_num;
		return pos;
	}

	tick(delta)
	{
		super.tick(delta);
		this._updateHVEffectsPositions(delta);

		if (this._fIsAppearing_bl && !this.isFrozen)
		{
			this._updateAppearanceAnimation();
		}
	}

	_updateHVEffectsPositions(delta)
	{
		if (!this.hvEffects)
		{
			return;
		}

		this.hvEffects.updatePositions();
		let pos = new PIXI.Point(this.hvTopContainer.x, this.hvTopContainer.y);

		if(this._fIsFrozen_bl)
		{
			delta = 0;
		}

		if (this._fIsJumping_bl)
		{
			let lAnimationTiming_num = Math.max(0, this.spineView.view.state.tracks[0].animationLast * 1000) + delta;
			let lPercent_num = lAnimationTiming_num / JUMP_MIN_ANIMATION_LENGTH;

			if (lPercent_num >= 0.2 && lPercent_num <= 0.65)
			{
				let lCoef_num = 0;
				if (lPercent_num <= 0.4)
				{
					lCoef_num = (0.2-(0.4-lPercent_num))/0.2;
				}
				else if (lPercent_num <= 0.53)
				{
					lCoef_num = 1;
				}
				else
				{
					lCoef_num = (0.65-lPercent_num)/0.1;
				}

				pos.y -= 160 * lCoef_num;

				this.hvTopContainer.position.set(pos.x, pos.y);
				this.hvBottomContainer.position.set(pos.x, pos.y);
			}
		}
	}

	get _isHvIdleFireEffectsRequired()
	{
		return true;
	}

	//override
	updateTrajectory(aTrajectory_obj)
	{
		if (this._fIsAppearing_bl)
		{
			//check if [0] and [1] points are equal
			if (Utils.isEqualPoints(aTrajectory_obj.points[0], aTrajectory_obj.points[1]))
			{
				//it means this is freezing while appearing in progress - we need to update points so that the flying animation wouldn't break
				aTrajectory_obj.points.shift();
				aTrajectory_obj.points.shift();
				aTrajectory_obj.points.unshift(this.trajectory.points[0], this.trajectory.points[1], this.trajectory.points[2]);
			}
		}
		this.trajectory = aTrajectory_obj;
		this.speed = aTrajectory_obj.speed || this.speed;
		if (this._fIsJumping_bl)
		{
			if (!this.isFrozen && !this._fIsAppearing_bl)
			{
				//speed up current jumping animation
				this.spineView.view.state.timeScale *= 4;
			}
			if (!this._fIsAppearing_bl)
			{
				//wait for jumping animation completion
				this.spineView.view.state.onComplete = ((e) => {
					this._resetJumping();
				});
			}
		}
		else
		{
			this.changeView();
		}
	}

	//override
	_freeze(aIsAnimated_bl = true)
	{
		if (this._fAppearingPercent_num < 0.5)
		{
			this._fFreezePostponedFunction_func = super._freeze.bind(this, aIsAnimated_bl);
			return;
		}
		this._fStartFreezeTime_num = (new Date()).getTime();
		super._freeze(aIsAnimated_bl);
	}

	_freezeSuspicion()
	{
		if (this._fFreezePostponedFunction_func && this._fAppearingPercent_num >= 0.5)
		{
			this._fFreezePostponedFunction_func();
			this._fFreezePostponedFunction_func = null;
			return true;
		}
		return false;
	}

	destroy(purely = false)
	{
		super.destroy(purely);

		this._fIsJumping_bl = null;
		this._fJumpsTimers_arr = null;
		this._fJumpsCount_num = null;
	}
}

export default JumpingEnemy;