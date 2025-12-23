import EventDispatcher from '../../../../../common/PIXI/src/dgphoenix/unified/controller/events/EventDispatcher';
import Enemy from './Enemy';
import WizardEnemy from './WizardEnemy';
import TrajectoryUtils from '../../main/TrajectoryUtils';
import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Timer from '../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import CalloutsController from '../../controller/uis/custom/callouts/CalloutsController';

class WizardTeleportManager extends EventDispatcher
{
	invalidate()
	{
		this._invalidate();
	}

	constructor(aEnemy_enm)
	{
		super();

		this._fEnemy_enm = aEnemy_enm;
		this._fEnemy_enm.on(Enemy.EVENT_ON_ENEMY_START_DYING, this._onEnemyStartDying, this);
		this._fEnemy_enm.on(Enemy.EVENT_ON_ENEMY_FREEZE, this._onEnemyFreeze, this);
		this._fEnemy_enm.on(Enemy.EVENT_ON_ENEMY_UNFREEZE, this._onEnemyUnFreeze, this);
		this._fEnemy_enm.on(Enemy.EVENT_ON_ENEMY_IS_HIDDEN, this._onDeathPileAnimationStart, this);
		this._fEnemy_enm.on(WizardEnemy.EVENT_ON_TRAJECTORY_UPDATED, this._updateTrajectoryPointsIds, this);

		this._fDyingInProgress_bln = false;

		this._fIsWizardInvulnerable_bln = true;
		this._fWaitState_bln = false;
		this._fIsTeleportingInProgress_bl = false;
		this._fTeleportPoints_pt_arr = null;
		this._fTeleportDurations_obj = {
			teleportOut: 0,
			outside: 0,
			teleportIn: 0
		};

		this._fDisappearanceInProgress_bl = false;

		this._fWaitTimerShouldBeCorrected_bl = false;

		if (aEnemy_enm && aEnemy_enm.trajectory && aEnemy_enm.trajectory.points && aEnemy_enm.trajectory.points.length > 0 && aEnemy_enm.trajectory.points[0].invulnerable)
		{
			this._setImmortal();
		}

		this._fWaitTimer_tmr = null;


		this._hideEnemy();

		this._setStartState();
	}

	_setStartState()
	{
		let points = this._fEnemy_enm.trajectory.points;

		let pi = TrajectoryUtils.getPrevTrajectoryPointIndex(this._fEnemy_enm.trajectory, APP.gameScreen.currentTime);
		if (pi !== null && !isNaN(pi))
		{
			let startId = 5;

			for (let i = 0; i < 6; ++i)
			{
				let p = points[pi + i];
				if (p && p.invulnerable && points[pi + i + 1] && !points[pi + i + 1].invulnerable)
				{
					startId = i;
				}
			}

			for (let j = startId - 1, k = 5; j >= 0; --j)
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
			case 0: // Teleport In
				// Nothing to do
				break;

			case 1: // wait
				if (this._fEnemy_enm.isLasthand)
				{
					this._showEnemy();
					this._setMortal();
				}

				if (points[pi + 3])
				{
					let teleportOutDur = points[pi + 3].time - points[pi + 2].time;
					this._fTeleportDurations_obj.teleportOut = teleportOutDur;

					let waitDur = points[pi + 2].time - APP.gameScreen.currentTime/*points[pi].time*/;
					this._fTeleportDurations_obj.wait = waitDur;

					this._wait();
				}
				break;

			case 3: // teleport out
				//nothing to do
				break;

			case 4:
			case 5: // wait outside
				//nothing to do
				break;
		}
	}

	_updateTrajectoryPointsIds(event)
	{
		let points = this._fEnemy_enm.trajectory.points;

		let pi = TrajectoryUtils.getPrevTrajectoryPointIndex(this._fEnemy_enm.trajectory, APP.gameScreen.currentTime);
		if (pi !== null && !isNaN(pi))
		{
			let startId = 5;

			for (let i = 0; i < 6; ++i)
			{
				let p = points[pi + i];
				if (p && p.invulnerable && points[pi + i + 1] && !points[pi + i + 1].invulnerable)
				{
					startId = i;
				}
			}

			for (let j = startId - 1, k = 5; j >= 0; --j)
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
			let lLastTrajectoryPointTime = this._fEnemy_enm.trajectory.points[lPointsAmount - 1].time;
			let lLastTrajectoryPointRestTime = Math.max(0, lLastTrajectoryPointTime - APP.gameScreen.currentTime);

			if (this._fWaitState_bln && this._fWaitTimer_tmr)
			{
				let waitRestDuration = this._fWaitTimer_tmr.timeout;
				let teleportOutDuration = this._fTeleportDurations_obj.teleportOut;
				if (lLastTrajectoryPointRestTime < (waitRestDuration + teleportOutDuration))
				{
					this._resetWaitTimer();

					if (lLastTrajectoryPointRestTime > teleportOutDuration)
					{
						this._fTeleportDurations_obj.wait = lLastTrajectoryPointRestTime - teleportOutDuration;
						this._wait();
					}
					else
					{
						this._startEnemyTeleportOut();
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

		if (!points[4])
		{
			this._hideEnemy();
			this._setImmortal();
			this._fEnemy_enm.destroy();
			this._fEnemy_enm = null;
			return;
		}

		if (!points[0] || !points[1])
		{
			return this._correctTeleportInterruptedByFreeze();
		}

		let lTeleportInDuration_num = points[1].time - points[0].time;

		let lWaitDuration_num = 0;
		let lTeleportOutDuration_num = 0;

		lWaitDuration_num = (points[3].time || 0) - (points[1].time || 0);
		lTeleportOutDuration_num = (points[4].time || 0) - (APP.gameScreen.currentTime || 0);

		this._fTeleportDurations_obj.teleportOut = lTeleportOutDuration_num;
		this._fTeleportDurations_obj.wait = lWaitDuration_num;
		this._fTeleportDurations_obj.teleportIn = lTeleportInDuration_num;

		this._fEnemy_enm.appearancePositionUpdated = true;

		this._startEnemyTeleportIn();
	}

	/**
	 * The method will be called when the player returns to the tab where the wizard teleported, but the process was interrupted by a freeze.
	 */
	_correctTeleportInterruptedByFreeze()
	{
		const points = this._fTeleportPoints_pt_arr;

		let lFirstDefinedPoint;
		for (let point of points)
		{
			if (point)
			{
				lFirstDefinedPoint = point;
				break;
			}
		}

		this._fWaitTimerShouldBeCorrected_bl = true;
		this._fEnemy_enm.appearancePositionUpdated = true;
		
		this._fTeleportDurations_obj.teleportIn = 0;
		this._fTeleportDurations_obj.teleportOut = lFirstDefinedPoint - APP.gameScreen.currentTime;
		this._fTeleportDurations_obj.wait = lFirstDefinedPoint.time - 0;

		this._startEnemyTeleportIn();
	}

	_startEnemyTeleportOut()
	{
		this._resetWaitTimer();
		this._fWaitState_bln = false;
		this._fWaitTimerShouldBeCorrected_bl = false;

		this._setImmortal();
		this._fIsTeleportingInProgress_bl = true;
		this._fEnemy_enm.on(WizardEnemy.EVENT_ON_ENEMY_TELEPORT_OUT_COMPLETED, this._onEnemyTeleportTeleportOutCompleted, this);
		this._fEnemy_enm.startTeleportOutAnimation();
	}

	_onEnemyTeleportTeleportOutCompleted()
	{
		this._hideEnemy();
		this._fEnemy_enm.off(WizardEnemy.EVENT_ON_ENEMY_TELEPORT_OUT_COMPLETED, this._onEnemyTeleportTeleportOutCompleted, this);
		this._onTeleportCompleted();
	}

	_wait()
	{
		if (this._fTeleportDurations_obj.wait > 0)
		{
			this._fWaitState_bln = true;
			this._fWaitTimer_tmr = new Timer(() => this._startEnemyTeleportOut(), this._fTeleportDurations_obj.wait);
		}
		else
		{
			this._startEnemyTeleportOut();
		}
	}

	_resetWaitTimer()
	{
		this._fWaitTimer_tmr && this._fWaitTimer_tmr.destructor();
		this._fWaitTimer_tmr = null;
		this._fWaitState_bln = false;
	}

	_startEnemyTeleportIn()
	{
		this._setImmortal();
		if (!this._fTeleportPoints_pt_arr[3])
		{
			this._hideEnemy();
			return;
		}

		let targetPosition = this._fTeleportPoints_pt_arr[3];

		this._fEnemy_enm.on(WizardEnemy.EVENT_ON_ENEMY_TELEPORT_IN_COMPLETED, this._onEnemyTeleportTeleportInCompleted, this);
		if (this._fWaitTimerShouldBeCorrected_bl)
		{
			this._fEnemy_enm.immediatelyTeleportWizardWithoutAnimation(targetPosition);
		}
		else
		{
			this._fEnemy_enm.startTeleportInAnimation(targetPosition);
		}
	}

	_onEnemyTeleportTeleportInCompleted()
	{
		this._fIsWizardInvulnerable_bln = false;
		this._fEnemy_enm.invulnerable = false;
		this._fIsTeleportingInProgress_bl = false;

		this._fEnemy_enm.off(WizardEnemy.EVENT_ON_ENEMY_TELEPORT_IN_COMPLETED, this._onEnemyTeleportTeleportInCompleted, this);
		this._wait();
	}

	_onTeleportCompleted()
	{
		this._fIsTeleportingInProgress_bl = false;
		this._fEnemy_enm.appearancePositionUpdated = false;
		this._hideEnemy();
		this._setImmortal();
	}

	_resetTeleport()
	{
		this._resetWaitTimer();
		this._fEnemy_enm.resetTeleportAnimation();

		this._fIsWizardInvulnerable_bln = false;
		this._fEnemy_enm.invulnerable = false;
		this._fEnemy_enm.appearancePositionUpdated = false;

		this._fTeleportPoints_pt_arr = null;
		this._fIsTeleportingInProgress_bl = false;

		this._fTeleportDurations_obj.teleportOut = 0;
		this._fTeleportDurations_obj.wait = 0;
		this._fTeleportDurations_obj.teleportIn = 0;

		this._fEnemy_enm.off(WizardEnemy.EVENT_ON_ENEMY_TELEPORT_OUT_COMPLETED, this._onEnemyTeleportTeleportOutCompleted, this);
		this._fEnemy_enm.off(WizardEnemy.EVENT_ON_ENEMY_TELEPORT_IN_COMPLETED, this._onEnemyTeleportTeleportInCompleted, this);
	}

	_onDeathPileAnimationStart()
	{
		this._fEnemy_enm.resetWizardView();
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
		let teleportInProgress = this._fEnemy_enm.teleportInProgress;
		if (lPrevTrajectoryPoint_obj && lNextPoint && this._fIsWizardInvulnerable_bln && !lNextPoint.invulnerable && !teleportInProgress)
		{
			//set teleport points...
			let lIdDiff = lPrevTrajectoryPoint_obj.id;
			const lPoint0_pt = lTrajectory_obj.points[lPrevTrajectoryPointIndex_int - lIdDiff];
			const lPoint1_pt = lTrajectory_obj.points[lPrevTrajectoryPointIndex_int + 1 - lIdDiff];
			const lPoint2_pt = lTrajectory_obj.points[lPrevTrajectoryPointIndex_int + 2 - lIdDiff];
			const lPoint3_pt = lTrajectory_obj.points[lPrevTrajectoryPointIndex_int + 3 - lIdDiff];
			const lPoint4_pt = lTrajectory_obj.points[lPrevTrajectoryPointIndex_int + 4 - lIdDiff];
			const lPoint5_pt = lTrajectory_obj.points[lPrevTrajectoryPointIndex_int + 5 - lIdDiff];
			this._fTeleportPoints_pt_arr = [lPoint0_pt, lPoint1_pt, lPoint2_pt, lPoint3_pt, lPoint4_pt, lPoint5_pt];
			//...set teleport points

			return true;
		}

		return false;
	}
	//...TELEPORT

	_hideEnemy()
	{
		this._fEnemy_enm.container.visible = false;

		this._fEnemy_enm.idleAnimations && this._fEnemy_enm.idleAnimations.forEach((spr) => {spr.visible = false;});
	}

	_showEnemy()
	{
		this._fEnemy_enm.container.visible = true;
	}

	_setMortal()
	{
		this._fIsWizardInvulnerable_bln = false;
		this._fEnemy_enm.invulnerable = false;
	}

	_setImmortal()
	{
		this._fIsWizardInvulnerable_bln = true;
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

	_onEnemyFreeze()
	{
		if (this._fIsTeleportingInProgress_bl && this._fIsWizardInvulnerable_bln)
		{
			this._setMortal();
		}
		this._fWaitTimer_tmr && this._fWaitTimer_tmr.pause();
	}

	_onEnemyUnFreeze()
	{
		if (this._fIsTeleportingInProgress_bl && !this._fIsWizardInvulnerable_bln)
		{
			this._setImmortal();
		}

		if (!this._fWaitTimerShouldBeCorrected_bl)
		{
			this._fWaitTimer_tmr && this._fWaitTimer_tmr.resume();
		}
		else
		{
			this._fWaitTimer_tmr && this._fWaitTimer_tmr.finish();
		}
	}

	destroy()
	{
		this._resetTeleport();

		if (this._fEnemy_enm)
		{
			this._fEnemy_enm.off(Enemy.EVENT_ON_ENEMY_START_DYING, this._onEnemyStartDying, this);
			this._fEnemy_enm.off(Enemy.EVENT_ON_ENEMY_FREEZE, this._onEnemyFreeze, this);
			this._fEnemy_enm.off(Enemy.EVENT_ON_ENEMY_UNFREEZE, this._onEnemyUnFreeze, this);
		}

		super.destructor();

		this._fDyingInProgress_bln = null;
		this._fWaitState_bln = null;
	}
}

export default WizardTeleportManager;