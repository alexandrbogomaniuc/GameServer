import SpineEnemy from './SpineEnemy';
import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { Tween } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';


class JumpingEnemy extends SpineEnemy
{
	/**
	 * @returns {Number} From 0 to 1;
	 * @description 0 - The jump is started or over; 1 - The jump is culminated, it's height is maxiaml.
	 */
	get jumpHeightProgress()
	{
		let lMiddleOfJump_num = (this._finishJumpSpineAnimationTime + this._startJumpSpineAnimationTime)/2;

		if (this.jumpProgress < lMiddleOfJump_num)
		{
			return this.jumpProgress/lMiddleOfJump_num;
		}
		else
		{
			return (1 - this.jumpProgress)/(1 - lMiddleOfJump_num);
		}
	}

	/**
	 * @returns {Number} From 0 to 1;
	 * @description 0 - The jump is started; 1 - The jump is over.
	 */
	get jumpProgress()
	{
		return this._fJumpProgress_num;
	}

	constructor(params)
	{
		super(params);

		this._fJumpProgress_num = 0;
		this._fLasetJumpOffset_num = 0;
		this._fCurrentOffset_num = 0;
		this._fRemoveJumpOffsetTween_t = null;
		this._fEnemiesController_ec = APP.gameScreen.enemiesController;
	}

	/**
	 * @override
	 */
	changeShadowPosition()
	{
		if (!this.spineView || !this.shadow)
		{
			return;
		}

		let lPreviousScale_obj = this.shadow.scale;
		lPreviousScale_obj.x -= 0.3*lPreviousScale_obj.x*this.jumpHeightProgress;
		lPreviousScale_obj.y -= 0.3*lPreviousScale_obj.y*this.jumpHeightProgress;

		this.shadow.scale.set(lPreviousScale_obj.x, lPreviousScale_obj.y);

	}

	/**
	 * @override
	 * @param {Boolean} aIsAnimated_bl 
	 */
	__freeze(aIsAnimated_bl=true)
	{
		super.__freeze(aIsAnimated_bl);
		if (this._fRemoveJumpOffsetTween_t && this._fRemoveJumpOffsetTween_t.playing)
		{
			this._fRemoveJumpOffsetTween_t.pause();
		}
	}

	/**
	 * @override
	 * @param {Boolean} aIsAnimated_bl 
	 * @param {Boolean} aIsDeathAnimation_bl 
	 */
	__unfreeze(aIsAnimated_bl=true, aIsDeathAnimation_bl=false)
	{
		super.__unfreeze(aIsAnimated_bl, aIsDeathAnimation_bl);
		if (this._fRemoveJumpOffsetTween_t && !this._fRemoveJumpOffsetTween_t.playing)
		{
			this._fRemoveJumpOffsetTween_t.unpause();
		}
	}

	//override
	get _isSpineFrameSyncRequired()
	{
		return false;
	}

	//override
	_calculateAnimationLoop()
	{
		let animationLoop = true;

		return animationLoop;
	}

	//override
	_calculateAnimationName()
	{
		let animationName = this.getWalkAnimationName();
		return animationName;
	}

	// override
	_calculateSpineSpriteNameSuffix()
	{
		return '';
	}

	get _startJumpSpineAnimationTime()
	{
		return 0;
	}

	get _finishJumpSpineAnimationTime()
	{
		return 0;
	}

	_updateJumpingOffset()
	{
		if (this._fEnemiesController_ec && this.spineView && this.spineView.view && this.spineView.view.state && this.spineView.view.state.tracks && this.spineView.view.state.tracks[0])
		{
			const lAnimationTiming_num = this.spineView.view.state.tracks[0].animationLast;
			const lTimeScale_num = this.spineView.view.state.timeScale;

			if (lAnimationTiming_num < this._startJumpSpineAnimationTime && lAnimationTiming_num >= 0)
			{
				this._fCurrentOffset_num = this._fLasetJumpOffset_num - (lAnimationTiming_num * 1000 / lTimeScale_num);

				if (this.angle != 0)
				{
					this._fEnemiesController_ec.setEnemyRotationSupport(this.id, false);
				}
				this._fJumpProgress_num = 0;
			}
			else if (lAnimationTiming_num >= this._startJumpSpineAnimationTime && lAnimationTiming_num < this._finishJumpSpineAnimationTime)
			{
				this._fEnemiesController_ec.setEnemyRotationSupport(this.id, true);
				if (!this._fRemoveJumpOffsetTween_t)
				{
					Tween.destroy(Tween.findByTarget(this));
					const lJumpTimeInterval_num = this._finishJumpSpineAnimationTime - this._startJumpSpineAnimationTime;
					this._fRemoveJumpOffsetTween_t = new Tween(this, "_fCurrentOffset_num", this._fCurrentOffset_num, 0, lJumpTimeInterval_num * 1000 / lTimeScale_num);
					this._fRemoveJumpOffsetTween_t.once(Tween.EVENT_ON_FINISHED, () => {this._fRemoveJumpOffsetTween_t.destructor(); this._fRemoveJumpOffsetTween_t = null;});
					this._fRemoveJumpOffsetTween_t.play();
				}
				this._fJumpProgress_num = this._fRemoveJumpOffsetTween_t.progress;
			}
			else if (lAnimationTiming_num >= this._finishJumpSpineAnimationTime)
			{
				this._fEnemiesController_ec.setEnemyRotationSupport(this.id, false);
				this._fCurrentOffset_num = - (lAnimationTiming_num - this._finishJumpSpineAnimationTime) * 1000 / lTimeScale_num;
				this._fLasetJumpOffset_num = this._fCurrentOffset_num;
				this._fJumpProgress_num = 0;
			}

			this._fEnemiesController_ec.setEnemyTimeOffset(this.id, this._fCurrentOffset_num);
		}
	}

	tick(delta)
	{
		super.tick(delta);

		this._updateJumpingOffset();
	}

	destroy(purely)
	{
		Tween.destroy(Tween.findByTarget(this));

		super.destroy(purely);

		if(this._fRemoveJumpOffsetTween_t)
		{
			this._fRemoveJumpOffsetTween_t.destructor();
			this._fRemoveJumpOffsetTween_t = null;
		}
	}
}

export default JumpingEnemy;