import EventDispatcher from '../../../../../common/PIXI/src/dgphoenix/unified/controller/events/EventDispatcher';
import Enemy from './Enemy';
import GargoyleEnemy from './GargoyleEnemy';
import TrajectoryUtils from '../../main/TrajectoryUtils';
import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Timer from '../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import GameScreen from '../GameScreen';

class GargoyleTeleportManager extends EventDispatcher
{
	i_invalidate()
	{
		this._invalidate();
	}

	constructor(aEnemy_enm)
	{
		super();

		this._fEnemy_enm = aEnemy_enm;

		window.enm = this._fEnemy_enm;

		this._fEnemy_enm.on(Enemy.EVENT_ON_ENEMY_START_DYING, this._onEnemyStartDying, this);
		this._fEnemy_enm.on(GargoyleEnemy.EVENT_ON_TRAJECTORY_UPDATED, this._onTrajectoryUpdated, this);
		this._fEnemy_enm.on(Enemy.EVENT_ON_ENEMY_FREEZE, this._onEnemyFreeze, this);
		this._fEnemy_enm.on(Enemy.EVENT_ON_ENEMY_UNFREEZE, this._onEnemyUnFreeze, this);

		this._fDyingInProgress_bln = false;

		this._fWaitState_bln = false;
		this._fMovementState_bln = false;

		this._fIsTeleportingInProgress_bl = false;
		this._fTeleportPoints_pt_arr = null;
		this._fTeleportDurations_obj = {
			flyOut: 0,
			waitOut: 0,
			flyMovement: 0,
			waitIn: 0,
			flyIn: 0
		}

		this._fDisappearanceShadowSeq = null;
		this._fDisappearanceInProgress_bl = false;

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


			let startId = 7;

			for (let i = 0; i < 8; ++i)
			{
				let p = points[pi + i];
				if (p && p.invulnerable && points[pi + i+1] && !points[pi + i+1].invulnerable)
				{
					startId = i;
				}
			}

			for (let j = startId-1, k = 7; j >= 0; --j)
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
					points[pi + j].id = k % 8;
				}
				++k;
				if (k >= 8)
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

			case 1: // waitIn
				if (this._fEnemy_enm.isLasthand || this._fEnemy_enm.isFrozen)
				{
					this._showEnemy();
				}

				if (points[pi + 5])
				{
					let lEnemyAngle = GameScreen.normalizeAngle(Math.atan2(points[pi + 2].y - points[pi + 1].y, points[pi + 2].x - points[pi + 1].x));
					this._fEnemy_enm.i_setFlyAngle(lEnemyAngle);
					
					let waitInDur = points[pi + 1].time - APP.gameScreen.currentTime;
					this._fTeleportDurations_obj.waitIn = waitInDur;

					let flyMovementDur = points[pi + 2].time - points[pi + 1].time;
					this._fTeleportDurations_obj.flyMovement = flyMovementDur;

					let waitOutDur = points[pi + 3].time - points[pi + 2].time;
					this._fTeleportDurations_obj.waitOut = waitOutDur;

					let flyOutDur = points[pi + 5].time - points[pi + 4].time;
					this._fTeleportDurations_obj.flyOut = flyOutDur;

					this._waitIn();
				}
			break;

			case 2: // fly movement
				if (this._fEnemy_enm.isLasthand || this._fEnemy_enm.isFrozen)
				{
					this._showEnemy();
				}

				if (points[pi + 4])
				{
					let lEnemyAngle = GameScreen.normalizeAngle(Math.atan2(points[pi + 1].y - points[pi].y, points[pi + 1].x - points[pi].x));
					this._fEnemy_enm.i_setFlyAngle(lEnemyAngle);
					
					let flyMovementDur = points[pi + 1].time - APP.gameScreen.currentTime;
					this._fTeleportDurations_obj.flyMovement = flyMovementDur;

					let waitOutDur = points[pi + 2].time - points[pi + 1].time;
					this._fTeleportDurations_obj.waitOut = waitOutDur;

					let flyOutDur = points[pi + 4].time - points[pi + 3].time;
					this._fTeleportDurations_obj.flyOut = flyOutDur;

					this._startMovement();
				}
			break;

			case 3: // waitOut
				if (this._fEnemy_enm.isLasthand || this._fEnemy_enm.isFrozen)
				{
					this._showEnemy();
				}

				if (points[pi + 3])
				{
					let waitOutDur = points[pi + 1].time - APP.gameScreen.currentTime;
					this._fTeleportDurations_obj.waitOut = waitOutDur;

					let flyOutDur = points[pi + 3].time - points[pi + 2].time;
					this._fTeleportDurations_obj.flyOut = flyOutDur;

					this._waitOut();
				}
			break;

			case 5: // fly out
				//nothing to do
			break;

			case 6:
			case 7: // wait outside
				//nothing to do
			break;
		}
	}

	//TELEPORT...
	_invalidate()
	{
		if (!this._fIsTeleportingInProgress_bl && this._isTeleportRequired())
		{
			if (this._fWaitState_bln || this._fMovementState_bln)
			{
				return;
			}
			this._startTeleport();
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

		let lFlyInDuration_num = points[1].time - Math.max(points[0].time, APP.gameScreen.currentTime);
		let lWaitInDuration_num = 0;
		let lFlyMovementDuration_num = 0;
		let lWaitOutDuration_num = 0;
		let lFlyOutDuration_num = 0;
		
		if (!points[6])
		{
			this._hideEnemy();
			this._fEnemy_enm.destroy();
			this._fEnemy_enm = null;
			return;
		}
		else
		{
			lWaitInDuration_num = (points[2].time || 0) - (points[1].time || 0);
			lFlyMovementDuration_num = (points[3].time || 0) - (points[2].time || 0);
			lWaitOutDuration_num = (points[5].time || 0) - (points[3].time || 0);
			lFlyOutDuration_num = (points[6].time || 0) - (points[5].time || 0);
		}

		this._fTeleportDurations_obj.flyOut = lFlyOutDuration_num;
		this._fTeleportDurations_obj.waitOut = lWaitOutDuration_num;
		this._fTeleportDurations_obj.flyMovement = lFlyMovementDuration_num;
		this._fTeleportDurations_obj.waitIn = lWaitInDuration_num;
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

		this._fEnemy_enm.on(GargoyleEnemy.EVENT_ON_ENEMY_FLY_OUT_COMPLETED, this._onEnemyTeleportFlyOutCompleted, this);
		this._fEnemy_enm.i_startFlyOutAnimation(this._fTeleportDurations_obj.flyOut);
	}

	_onEnemyTeleportFlyOutCompleted()
	{
		this._hideEnemy();
		this._fEnemy_enm.off(GargoyleEnemy.EVENT_ON_ENEMY_FLY_OUT_COMPLETED, this._onEnemyTeleportFlyOutCompleted, this);
		this._onTeleportCompleted();
	}

	_waitOut()
	{
		if (this._fTeleportDurations_obj.waitOut > 0)
		{
			this._fWaitState_bln = true;
			this._fWaitTimer_tmr = new Timer(() => this._startEnemyFlyOut(), this._fTeleportDurations_obj.waitOut);
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
			let targetPosition = this._fTeleportPoints_pt_arr[2];
			let startPosition = new PIXI.Point(targetPosition.x, -300);
			let duration = this._fTeleportDurations_obj.flyIn;

			//rotate enemy to the next point
			let angle = 0;

			let pp = this._fTeleportPoints_pt_arr[2];
			let np = this._fTeleportPoints_pt_arr[3];
			if (np && pp)
			{
				angle = GameScreen.normalizeAngle(Math.atan2(np.y - pp.y, np.x - pp.x));
			}
			else
			{
				this._hideEnemy();
				return;
			}

			this._fEnemy_enm.on(GargoyleEnemy.EVENT_ON_ENEMY_FLY_IN_COMPLETED, this._onEnemyTeleportFlyInCompleted, this);
			this._fEnemy_enm.i_startFlyInAnimation(duration, startPosition, targetPosition, angle);
		}
		else
		{
			this._onEnemyTeleportFlyInCompleted();
		}
	}

	_onEnemyTeleportFlyInCompleted()
	{
		this._fEnemy_enm.invulnerable = false;
		this._fIsTeleportingInProgress_bl = false;
		this._fEnemy_enm.off(GargoyleEnemy.EVENT_ON_ENEMY_FLY_IN_COMPLETED, this._onEnemyTeleportFlyInCompleted, this);
		
		this._waitIn();
	}

	_waitIn()
	{
		if (this._fTeleportDurations_obj.waitIn > 0)
		{
			this._fWaitState_bln = true;
			this._fWaitTimer_tmr = new Timer(() => this._startMovement(), this._fTeleportDurations_obj.waitIn);
		}
		else
		{
			this._startMovement();
		}
	}

	_startMovement()
	{
		this._resetWaitTimer();
		this._fWaitState_bln = false;
		this._fMovementState_bln = true;

		if (this._fTeleportDurations_obj.flyMovement > 0)
		{
			this._fEnemy_enm.appearancePositionUpdated = false;
			this._fEnemy_enm.on(GargoyleEnemy.EVENT_ON_ENEMY_FLY_MOVEMENT_COMPLETED, this._onEnemyFlyMovementCompleted, this);
			
			this._fEnemy_enm.i_startFlyMovementAnimation(this._fTeleportDurations_obj.flyMovement);
		}
		else
		{
			this._onEnemyFlyMovementCompleted();
		}
	}

	_onEnemyFlyMovementCompleted()
	{
		this._fMovementState_bln = false;
		
		this._fEnemy_enm.off(GargoyleEnemy.EVENT_ON_ENEMY_FLY_MOVEMENT_COMPLETED, this._onEnemyFlyMovementCompleted, this);
		
		this._fEnemy_enm.appearancePositionUpdated = true;
		
		this._waitOut();
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
		this._fMovementState_bln = false;

		this._fTeleportDurations_obj.flyOut = 0;
		this._fTeleportDurations_obj.waitOut = 0;
		this._fTeleportDurations_obj.flyMovement = 0;
		this._fTeleportDurations_obj.waitIn = 0;
		this._fTeleportDurations_obj.flyIn = 0;

		this._fEnemy_enm.off(GargoyleEnemy.EVENT_ON_ENEMY_FLY_OUT_COMPLETED, this._onEnemyTeleportFlyOutCompleted, this);
		this._fEnemy_enm.off(GargoyleEnemy.EVENT_ON_ENEMY_FLY_IN_COMPLETED, this._onEnemyTeleportFlyInCompleted, this);
		this._fEnemy_enm.off(GargoyleEnemy.EVENT_ON_ENEMY_FLY_MOVEMENT_COMPLETED, this._onEnemyFlyMovementCompleted, this);
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
			const lPoint4_pt = lTrajectory_obj.points[lPrevTrajectoryPointIndex_int + 4];
			const lPoint5_pt = lTrajectory_obj.points[lPrevTrajectoryPointIndex_int + 5];
			const lPoint6_pt = lTrajectory_obj.points[lPrevTrajectoryPointIndex_int + 6];
			const lPoint7_pt = lTrajectory_obj.points[lPrevTrajectoryPointIndex_int + 7];
			this._fTeleportPoints_pt_arr = [lPoint0_pt, lPoint1_pt, lPoint2_pt, lPoint3_pt, lPoint4_pt, lPoint5_pt, lPoint6_pt, lPoint7_pt];
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
	}

	_showEnemy()
	{
		this._fEnemy_enm.invulnerable = false;
		this._fEnemy_enm.container.visible = true;
	}

	_setInvulnerable()
	{
		this._fEnemy_enm.invulnerable = true;
		APP.currentWindow.gameField.checkIfAutoTargetSwitchNeeded();
	}

	_onEnemyStartDying()
	{
		this._fDyingInProgress_bln = true;
		if (this._fIsTeleportingInProgress_bl || this._fWaitState_bln || this._fMovementState_bln)
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

		this._fEnemy_enm.off(Enemy.EVENT_ON_ENEMY_START_DYING, this._onEnemyStartDying, this);
		this._fEnemy_enm.off(GargoyleEnemy.EVENT_ON_TRAJECTORY_UPDATED, this._onTrajectoryUpdated, this);

		this._fEnemy_enm.off(Enemy.EVENT_ON_ENEMY_FREEZE, this._onEnemyFreeze, this);
		this._fEnemy_enm.off(Enemy.EVENT_ON_ENEMY_UNFREEZE, this._onEnemyUnFreeze, this);

		this._fDisappearanceShadowSeq && this._fDisappearanceShadowSeq.destructor();
		this._fDisappearanceShadowSeq = null;

		this._fDyingInProgress_bln = null;

		this._fWaitState_bln = null;
		this._fMovementState_bln = null;

		super.destructor();
	}
}

export default GargoyleTeleportManager;