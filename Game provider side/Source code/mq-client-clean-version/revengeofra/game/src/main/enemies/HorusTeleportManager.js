import EventDispatcher from '../../../../../common/PIXI/src/dgphoenix/unified/controller/events/EventDispatcher';
import Enemy from './Enemy';
import HorusEnemy from './HorusEnemy';
import TrajectoryUtils from '../../main/TrajectoryUtils';
import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Timer from '../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import TeleportOrbFxAnimation from '../../view/uis/enemies/horus/TeleportOrbFxAnimation';

class HorusTeleportManager extends EventDispatcher
{
	i_invalidate()
	{
		this._invalidate();
	}

	constructor(aEnemy_enm)
	{
		super();

		this._fEnemy_enm = aEnemy_enm;

		this._fEnemy_enm.on(Enemy.EVENT_ON_ENEMY_START_DYING, this._onEnemyStartDying, this);
		this._fEnemy_enm.on(HorusEnemy.EVENT_ON_TRAJECTORY_UPDATED, this._onTrajectoryUpdated, this);
		this._fEnemy_enm.on(Enemy.EVENT_ON_ENEMY_FREEZE, this._onEnemyFreeze, this);
		this._fEnemy_enm.on(Enemy.EVENT_ON_ENEMY_UNFREEZE, this._onEnemyUnFreeze, this);

		this._fDyingInProgress_bln = false;

		this._fWaitState_bln = false;
		this._fIsTeleportingInProgress_bl = false;
		this._fTeleportPoints_pt_arr = null;
		this._fTeleportDurations_obj = {
			flyOut: 0,
			outside: 0,
			flyIn: 0
		}

		this._fDisappearanceShadowSeq = null;
		this._fDisappearanceInProgress_bl = false;

		this._fUpperTeleportOrbFx_tofa = null;
		this._fWaitTimer_tmr = null;

		if (this._fEnemy_enm.isFrozen)
		{
			this._showEnemy();
		}
		else
		{
			this._hideEnemy();
		}

		this._setStartState();
	}

	_setStartState()
	{
		let points = this._fEnemy_enm.trajectory.points;
		let isFrozen = this._fEnemy_enm.isFrozen;

		let pi = TrajectoryUtils.getPrevTrajectoryPointIndex(this._fEnemy_enm.trajectory, APP.gameScreen.currentTime);
		if (pi !== null && !isNaN(pi))
		{
			if (isFrozen && points[pi])
			{
				points[pi].frozen = true;
				points[pi].id = -1;
				pi++;
			}


			let startId = 5;

			for (let i = 0; i < 6; ++i)
			{
				let p = points[pi + i];
				if (p && p.invulnerable && points[pi + i+1] && !points[pi + i+1].invulnerable)
				{
					startId = i;
				}
			}

			for (let j = startId-1, k = 5; j >= 0; --j)
			{
				if (points[pi + j])
				{
					points[pi + j].id = k--;
				}
			}

			for (let j = startId, k = 0; j < points.length; ++j)
			{
				if (points[pi + j])
				{
					points[pi + j].id = k % 6;
				}
				++k;
				if (k >= 6)
				{
					k = 0;
				}
			}
		}

		switch (points[pi].id)
		{
			case 0: // Fly In
				// Nothing to do
			break;

			case 1: // wait
				if (this._fEnemy_enm.isLasthand || this._fEnemy_enm.isFrozen)
				{
					this._showEnemy();
				}

				if (points[pi + 3])
				{
					let flyOutDur = points[pi + 3].time - points[pi + 2].time;
					this._fTeleportDurations_obj.flyOut = flyOutDur;

					let waitDur = points[pi + 2].time - APP.gameScreen.currentTime/*points[pi].time*/;
					this._fTeleportDurations_obj.wait = waitDur;

					this._wait();
				}
			break;

			case 3: // fly out
				//nothing to do
			break;

			case 4:
			case 5: // wait outside
				//nothing to do
			break;
		}
	}

	//TELEPORT...
	_invalidate()
	{
		if (!this._fIsTeleportingInProgress_bl && this._isTeleportRequired())
		{
			if (this._fWaitState_bln)
			{
				return;
			}
			this._startTeleport();
		}
		else if (this._fEnemy_enm.trajectory.points.length < 5)
		{
			let lPointsAmount = this._fEnemy_enm.trajectory.points.length;
			let lLastTrajectoryPointTime = this._fEnemy_enm.trajectory.points[lPointsAmount-1].time;
			let lLastTrajectoryPointRestTime = Math.max(0, lLastTrajectoryPointTime - APP.gameScreen.currentTime);

			if (this._fWaitState_bln && this._fWaitTimer_tmr)
			{
				let waitRestDuration = this._fWaitTimer_tmr.timeout;
				let teleportOutDuration = this._fTeleportDurations_obj.flyOut;
				if (lLastTrajectoryPointRestTime < (waitRestDuration+teleportOutDuration))
				{
					this._resetWaitTimer();

					if (lLastTrajectoryPointRestTime > teleportOutDuration)
					{
						this._fTeleportDurations_obj.wait = lLastTrajectoryPointRestTime - teleportOutDuration;
						this._wait();
					}
					else
					{
						this._startEnemyFlyOut();
					}
				}
			}
		}
	}

	_startTeleport()
	{
		if (!this._fEnemy_enm)
		{
			return;
		}

		this._fIsTeleportingInProgress_bl = true;

		const points = this._fTeleportPoints_pt_arr;

		if (!points[0] || !points[1])
		{
			this._hideEnemy();
			this._fEnemy_enm.destroy();
			this._fEnemy_enm = null;
			return;
		}

		let lFlyInDuration_num = points[1].time - points[0].time;
		let lWaitDuration_num = 0;
		let lFlyOutDuration_num = 0;

		if (!points[4])
		{
			this._hideEnemy();
			this._fEnemy_enm.destroy();
			this._fEnemy_enm = null;
			return;
		}
		else
		{
			lWaitDuration_num = (points[3].time || 0) - (points[1].time || 0);
			lFlyOutDuration_num = (points[4].time || 0) - (points[3].time || 0);
		}

		this._fTeleportDurations_obj.flyOut = lFlyOutDuration_num;
		this._fTeleportDurations_obj.wait = lWaitDuration_num;
		this._fTeleportDurations_obj.flyIn = lFlyInDuration_num;

		this._showEnemy();
		this._fEnemy_enm.appearancePositionUpdated = true;
		this._startEnemyFlyIn();
	}

	_startEnemyFlyOut()
	{
		this._resetWaitTimer();
		this._fWaitState_bln = false;

		this._setInvulnerable();
		this._fIsTeleportingInProgress_bl = true;
		this._fEnemy_enm.on(HorusEnemy.EVENT_ON_ENEMY_FLY_OUT_COMPLETED, this._onEnemyTeleportFlyOutCompleted, this);
		this._fEnemy_enm.i_startFlyOutAnimation(this._fTeleportDurations_obj.flyOut);
	}

	_onEnemyTeleportFlyOutCompleted()
	{
		this._hideEnemy();
		this._fEnemy_enm.off(HorusEnemy.EVENT_ON_ENEMY_FLY_OUT_COMPLETED, this._onEnemyTeleportFlyOutCompleted, this);
		this._onTeleportCompleted();
	}

	_wait()
	{
		if (this._fTeleportDurations_obj.wait > 0)
		{
			this._fWaitState_bln = true;
			this._fWaitTimer_tmr = new Timer(() => this._startEnemyFlyOut(), this._fTeleportDurations_obj.wait);
		}
		else
		{
			this._startEnemyFlyOut();
		}
	}

	_resetWaitTimer()
	{
		this._fWaitTimer_tmr && this._fWaitTimer_tmr.destructor();
		this._fWaitTimer_tmr = null;
		this._fWaitState_bln = false;
	}

	_startEnemyFlyIn()
	{
		this._setInvulnerable();
		this._fEnemy_enm.isFireDenied = false;
		if (this._fTeleportDurations_obj.flyIn > 0)
		{
			let targetPosition = this._fTeleportPoints_pt_arr[3];
			let startPosition = new PIXI.Point(targetPosition.x, -300);
			let duration = this._fTeleportDurations_obj.flyIn;

			//rotate horus to the next point
			let angleHorus = 0;

			let pp = this._fTeleportPoints_pt_arr[3];
			let np = this._fTeleportPoints_pt_arr[4];
			if (np && pp)
			{
				angleHorus = Math.atan2(np.y - pp.y, np.x - pp.x);
			}
			else
			{
				this._hideEnemy();
				return;
			}

			this._fEnemy_enm.on(HorusEnemy.EVENT_ON_ENEMY_FLY_IN_COMPLETED, this._onEnemyTeleportFlyInCompleted, this);
			this._fEnemy_enm.i_startFlyInAnimation(duration, startPosition, targetPosition, angleHorus);

			this._showUpperTeleportFx(new PIXI.Point(targetPosition.x, -100), duration);
		}
		else
		{
			this._onEnemyTeleportFlyInCompleted();
		}
	}

	get _teleportFXContainer()
	{
		return APP.currentWindow.gameField.teleportFXContainer;
	}

	_showUpperTeleportFx(aPosition_pt, aDuration_num)
	{
		if (!APP.profilingController.info.isVfxDynamicProfileValueMediumOrGreater) return;

		this._fUpperTeleportOrbFx_tofa = new TeleportOrbFxAnimation();

		this._teleportFXContainer.container.addChild(this._fUpperTeleportOrbFx_tofa);
		this._fUpperTeleportOrbFx_tofa.zIndex = this._teleportFXContainer.zIndex;
		this._fUpperTeleportOrbFx_tofa.position.set(aPosition_pt.x, aPosition_pt.y);
		this._fUpperTeleportOrbFx_tofa.on(TeleportOrbFxAnimation.EVENT_ON_ANIMATION_COMPLETED, this._onUpperTeleportOrbFxAnimationCompleted, this);
		this._fUpperTeleportOrbFx_tofa.i_startAnimation(aDuration_num);

	}

	_onUpperTeleportOrbFxAnimationCompleted()
	{
		this._destroyUpperTeleportFx();
	}

	_destroyUpperTeleportFx()
	{
		if (this._fUpperTeleportOrbFx_tofa)
		{
			this._fUpperTeleportOrbFx_tofa.off(TeleportOrbFxAnimation.EVENT_ON_ANIMATION_COMPLETED, this._destroyUpperTeleportFx, this);
			this._fUpperTeleportOrbFx_tofa.destroy();
			this._fUpperTeleportOrbFx_tofa =  null;
		}
	}

	_onEnemyTeleportFlyInCompleted()
	{
		this._fEnemy_enm.invulnerable = false;
		this._fIsTeleportingInProgress_bl = false;
		this._fEnemy_enm.off(HorusEnemy.EVENT_ON_ENEMY_FLY_IN_COMPLETED, this._onEnemyTeleportFlyInCompleted, this);
		this._wait();
	}

	_onTeleportCompleted()
	{
		this._fIsTeleportingInProgress_bl = false;
		this._fEnemy_enm.appearancePositionUpdated = false;
		this._hideEnemy();
	}

	_resetTeleport()
	{
		this._resetWaitTimer();
		this._fEnemy_enm.i_resetTeleportAnimation();

		this._fEnemy_enm.invulnerable = false;
		this._fEnemy_enm.appearancePositionUpdated = false;

		this._fTeleportPoints_pt_arr = null;
		this._fIsTeleportingInProgress_bl = false;

		this._fTeleportDurations_obj.flyOut = 0;
		this._fTeleportDurations_obj.wait = 0;
		this._fTeleportDurations_obj.flyIn = 0;

		this._destroyUpperTeleportFx();

		this._fEnemy_enm.off(HorusEnemy.EVENT_ON_ENEMY_FLY_OUT_COMPLETED, this._onEnemyTeleportFlyOutCompleted, this);
		this._fEnemy_enm.off(HorusEnemy.EVENT_ON_ENEMY_FLY_IN_COMPLETED, this._onEnemyTeleportFlyInCompleted, this);
	}

	_isTeleportRequired()
	{
		if (this._fDyingInProgress_bln)
		{
			return;
		}

		let lTrajectory_obj = this._fEnemy_enm.trajectory;
		const lPrevTrajectoryPointIndex_int = TrajectoryUtils.getPrevTrajectoryPointIndex(lTrajectory_obj, APP.gameScreen.currentTime);
		const lPrevTrajectoryPoint_obj = (lPrevTrajectoryPointIndex_int !== null && !isNaN(lPrevTrajectoryPointIndex_int)) ? lTrajectory_obj.points[lPrevTrajectoryPointIndex_int] : null;
		const lNextPoint = lTrajectory_obj.points[lPrevTrajectoryPointIndex_int + 1];
		let lFlyInProgress_bln = this._fEnemy_enm.flyOutInProgress || this._fEnemy_enm.flyInInProgress;
		if (lPrevTrajectoryPoint_obj && lNextPoint && lPrevTrajectoryPoint_obj.invulnerable && !lNextPoint.invulnerable && !lFlyInProgress_bln)
		{
			//set teleport points...
			const lPoint0_pt = lPrevTrajectoryPoint_obj;
			const lPoint1_pt = lTrajectory_obj.points[lPrevTrajectoryPointIndex_int + 1];
			const lPoint2_pt = lTrajectory_obj.points[lPrevTrajectoryPointIndex_int + 2];
			const lPoint3_pt = lTrajectory_obj.points[lPrevTrajectoryPointIndex_int + 3];
			const lPoint4_pt = lTrajectory_obj.points[lPrevTrajectoryPointIndex_int + 4]; // for angle
			const lPoint5_pt = lTrajectory_obj.points[lPrevTrajectoryPointIndex_int + 5]; // for angle
			this._fTeleportPoints_pt_arr = [lPoint0_pt, lPoint1_pt, lPoint2_pt, lPoint3_pt, lPoint4_pt, lPoint5_pt];
			//...set teleport points
			return true;
		}

		return false;
	}
	//...TELEPORT

	_hideEnemy()
	{
		this._setInvulnerable();
		this._fEnemy_enm.container.visible = false;
		this._fEnemy_enm.enemyIndicatorsController.hideHPBar();
	}

	_showEnemy()
	{
		this._fEnemy_enm.invulnerable = false;
		this._fEnemy_enm.container.visible = true;

		if (!this._deathInProgress && this._fEnemy_enm.enemyIndicatorsController.visibility)
		{
			this._fEnemy_enm.enemyIndicatorsController.showHpBar();
		}
	}

	_setInvulnerable()
	{
		this._fEnemy_enm.invulnerable = true;
		APP.currentWindow.gameField.checkIfAutoTargetSwitchNeeded();
	}

	_onEnemyStartDying()
	{
		this._fDyingInProgress_bln = true;
		if (this._fIsTeleportingInProgress_bl)
		{
			this._resetTeleport();
		}
	}

	_onTrajectoryUpdated()
	{
	}

	_onEnemyFreeze()
	{
		this._fWaitTimer_tmr && this._fWaitTimer_tmr.pause();
	}

	_onEnemyUnFreeze()
	{
		this._fWaitTimer_tmr && this._fWaitTimer_tmr.resume();
	}

	destroy()
	{
		this._resetTeleport();

		this._destroyUpperTeleportFx();

		this._fEnemy_enm.off(Enemy.EVENT_ON_ENEMY_START_DYING, this._onEnemyStartDying, this);
		this._fEnemy_enm.off(HorusEnemy.EVENT_ON_TRAJECTORY_UPDATED, this._onTrajectoryUpdated, this);

		this._fEnemy_enm.off(Enemy.EVENT_ON_ENEMY_FREEZE, this._onEnemyFreeze, this);
		this._fEnemy_enm.off(Enemy.EVENT_ON_ENEMY_UNFREEZE, this._onEnemyUnFreeze, this);

		this._fDisappearanceShadowSeq && this._fDisappearanceShadowSeq.destructor();
		this._fDisappearanceShadowSeq = null;

		this._fDyingInProgress_bln = null;

		this._fWaitState_bln = null;

		super.destructor();
	}
}

export default HorusTeleportManager;