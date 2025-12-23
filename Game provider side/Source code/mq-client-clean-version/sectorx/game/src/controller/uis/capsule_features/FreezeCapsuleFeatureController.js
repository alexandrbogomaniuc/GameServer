import SimpleUIController from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/uis/base/SimpleUIController';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import GameScreen from '../../../main/GameScreen';
import FreezeCapsuleFeatureInfo from '../../../model/uis/capsule_features/FreezeCapsuleFeatureInfo';
import FreezeCapsuleFeatureView from '../../../view/uis/capsule_features/FreezeCapsuleFeatureView';
import EnemiesController from '../enemies/EnemiesController';
import GameFieldController from '../../../controller/uis/game_field/GameFieldController';
import { ENEMY_TYPES } from '../../../../../shared/src/CommonConstants';
import Timer from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';

class FreezeCapsuleFeatureController extends SimpleUIController
{
	static get EVENT_ON_START_ACTIVATING_FEATURE()				{ return "onStartActivatingFreezeFeature"; }
	static get EVENT_ON_DEACTIVATE_FEATURE()					{ return "onDeactivatingFreezeFeature"; }
	static get CHANGE_FIELD_FREEZE_STATE()						{ return FreezeCapsuleFeatureView.CHANGE_FIELD_FREEZE_STATE; }
	static get EVENT_ON_FREEZE_AFFECTED_ENEMIES()				{ return "onFreezeAffectedEnemiesFromFreezeCapsule"; }
	static get EVENT_ON_UNFREEZE_AFFECTED_ENEMIES()				{ return "onUnreezeAffectedEnemiesFromFreezeCapsule"; }

	startAnimation(aStartPostion_obj)
	{
		this._startAnimation(aStartPostion_obj);
	}

	i_isEnemyFrozen(aId_num)
	{
		return Object.prototype.hasOwnProperty.call(this.info.affectedEnemies, aId_num);
	}

	i_updateFreezeTimes(aEvent_obj)
	{
		this._onRoomInfoUpdated(aEvent_obj);
	}

	get isFreezingInProgress()
	{
		return !!this._fFreezingTimer_t;
	}

	get freezeCapsuleFeatureContainerInfo()
	{
		return APP.gameScreen.gameFieldController.freezeCapsuleFeatureContainerInfo;
	}

	constructor()
	{
		super(new FreezeCapsuleFeatureInfo(), new FreezeCapsuleFeatureView());
		this.view.addToContainerIfRequired(this.freezeCapsuleFeatureContainerInfo);

		this._fDelayedAffectedEnemiesTrajectories_obj = null;
		this._fFreezingTimer_t = null;
	}

	__initControlLevel()
	{
		super.__initControlLevel();

		APP.gameScreen.enemiesController.on(EnemiesController.EVENT_ON_TRAJECTORIES_UPDATED, this._onEnemiesTrajectoriesUpdated, this);
		APP.gameScreen.gameFieldController.on(GameFieldController.EVENT_ON_CLEAR_ROOM_STARTED, this._onRoomClear, this);
		APP.gameScreen.gameFieldController.on(GameFieldController.EVENT_ON_BOSS_DESTROYING, this._onBossDestroying, this);
		APP.gameScreen.gameFieldController.on(GameFieldController.EVENT_ON_NEW_BOSS_CREATED, this._onBossStateUpdate.bind(this, true), this);
		APP.gameScreen.gameFieldController.on(GameFieldController.EVENT_ON_BOSS_HP_BAR_DESTROYING, this._onBossStateUpdate.bind(this, false), this);
		APP.gameScreen.on(GameScreen.EVENT_ON_ROOM_INFO_UPDATED, this._onRoomInfoUpdated, this);
		APP.gameScreen.on(GameScreen.EVENT_ON_HIT_RESPONCE, this._onHitResponse, this);
	}

	__initViewLevel()
	{
		super.__initViewLevel();
		this.view.on(FreezeCapsuleFeatureView.CHANGE_FIELD_FREEZE_STATE, this._changeFieldFreezeState, this);
		this.view.on(FreezeCapsuleFeatureView.EVENT_ON_TIMER_APPEARED, this._onViewTimerAppeared, this);
	}

	_onEnemiesTrajectoriesUpdated(aEvent_obj)
	{
		this._destroyFreezeTimer();

		this._fDelayedAffectedEnemiesTrajectories_obj = aEvent_obj.trajectories;

		let lFreezeTimeMs_int = aEvent_obj.freezeTime;
		this.info.freezeTime = lFreezeTimeMs_int;

		if (this.info.active)
		{
			this._startFreezeTimer();
		}
	}

	_onHitResponse(aEventData_obj)
	{
		if (aEventData_obj.data.enemy && aEventData_obj.data.enemy.typeId === ENEMY_TYPES.FREEZE_CAPSULE)
		{
			this.info.isQuestForMainPlayer = aEventData_obj.data.rid > -1;
			this.emit(FreezeCapsuleFeatureController.EVENT_ON_START_ACTIVATING_FEATURE);
		}
	}

	_startAnimation(aStartPostion_obj)
	{
		this.view.addToContainerIfRequired(this.freezeCapsuleFeatureContainerInfo);

		if (!this.info.active)
		{
			this.view.i_showFreezing(aStartPostion_obj);
		}

		this._startFreezeTimer();
	}

	_shakeTheGround()
	{
		APP.gameScreen.gameFieldController.shakeTheGround("capsule");
	}

	_changeFieldFreezeState(aEvent_obj)
	{
		this.emit(FreezeCapsuleFeatureController.CHANGE_FIELD_FREEZE_STATE, aEvent_obj);

		if (aEvent_obj.frozen)
		{
			if (this._fDelayedAffectedEnemiesTrajectories_obj)
			{
				this.info.affectedEnemies = this._fDelayedAffectedEnemiesTrajectories_obj;
				this._fDelayedAffectedEnemiesTrajectories_obj = null;
			}

			this.emit(FreezeCapsuleFeatureController.EVENT_ON_FREEZE_AFFECTED_ENEMIES, {affectedEnemies: this.info.affectedEnemies, stopWalking: true});
		}
		else
		{
			this.emit(FreezeCapsuleFeatureController.EVENT_ON_UNFREEZE_AFFECTED_ENEMIES, {affectedEnemies: this.info.affectedEnemies});
			this.info.affectedEnemies = null;
		}
	}

	_onViewTimerAppeared()
	{
		this.info.activatedTime = APP.currentWindow.currentTime;
	}

	_startFreezeTimer()
	{
		if (!this.info.freezeTime)
		{
			return;
		}

		if (this._fFreezingTimer_t)
		{
			this._fFreezingTimer_t.reset(this.info.freezeTime);
		}
		else
		{
			this._fFreezingTimer_t = new Timer(this._deactivateFreezing.bind(this), this.info.freezeTime);
			this._fFreezingTimer_t.on("tick", this._tickTimer, this);
		}
	}

	_tickTimer(aEvent_obj)
	{
		if (!this.info.activatedTime)
		{
			this.view.i_setTimerProgress(1);
		}
		else
		{
			const totalEnemies = APP.gameScreen.gameFieldController.enemies;
			let aliveEnemies = 0;
			for(let i=0; i<totalEnemies.length; i++){
				const enemy = totalEnemies[i];
				if(enemy.isTargetable()){
					aliveEnemies++;
				}
			}
			if(aliveEnemies > 0)
			{
				let lRelativeTime_num = this.info.freezeTime/this.info.fullFreezeTime;
				let lDiffTime_num = this.info.correctionTime*lRelativeTime_num;// correction for appearance animation
				this.view.i_setTimerProgress(lRelativeTime_num + lDiffTime_num/this.info.fullFreezeTime); 
			}else{
				this._deactivateFreezing();
			}
		}
		this.info.freezeTime = aEvent_obj.left;
	}

	

	_deactivateFreezing()
	{
		this._destroyFreezeTimer();
		this.info.i_resetTimes();
		this.view.i_startDisappearAnimation();
		this.emit(FreezeCapsuleFeatureController.EVENT_ON_DEACTIVATE_FEATURE);
	}

	_onRoomClear()
	{
		if (this._fDelayedAffectedEnemiesTrajectories_obj)
		{
			this.info.affectedEnemies = this._fDelayedAffectedEnemiesTrajectories_obj;
			this._fDelayedAffectedEnemiesTrajectories_obj = null;
		}

		this.view.interrupt();
	}

	_onRoomInfoUpdated(aEvent_obj)
	{
		let lFreezeTimeMs_int = aEvent_obj.freezeTime ? Math.max(...Object.values(aEvent_obj.freezeTime), 0) : 0;

		if (!lFreezeTimeMs_int && aEvent_obj.freezeTime !== undefined)
		{
			if (this._fFreezingTimer_t && this._fFreezingTimer_t.timeout > 0 && this.info.affectedEnemies)
			{
				this._changeFieldFreezeState({frozen: false});
			}

			this._destroyFreezeTimer();
			this.info.i_resetTimes();
			this.info.affectedEnemies = null;
			this.view.interrupt();
		}
		else if (lFreezeTimeMs_int > 0)
		{
			if (Array.isArray(aEvent_obj.roomEnemies))
			{
				let lAffectedEnemies_obj = new Object();
				for (let lEnemy_obj of aEvent_obj.roomEnemies)
				{
					if (aEvent_obj.freezeTime[lEnemy_obj.id])
					{
						let lTrajectory_obj = lEnemy_obj.trajectory;
						for (let l_p of lTrajectory_obj.points)
						{
							l_p.time += lFreezeTimeMs_int + this.info.correctionTime;
						}

						lAffectedEnemies_obj[lEnemy_obj.id] = lTrajectory_obj;
					}
				}
				this.info.affectedEnemies = lAffectedEnemies_obj;
			}

			this.info.freezeTime = lFreezeTimeMs_int + this.info.correctionTime; //TODO: make this correction on server
			this.info.activatedTime = APP.currentWindow.currentTime;
			this.view.addToContainerIfRequired(this.freezeCapsuleFeatureContainerInfo);
			this.view.i_showFreezing(null, true, aEvent_obj.subround == "BOSS");
			this._startFreezeTimer();
		}
	}

	_onBossStateUpdate(aDoesBossExist_bl)
	{
		if (!aDoesBossExist_bl)
		{
			this.view.isBossDeathAnimationInProgress = false;
		}

		if (!APP.isMobile && this.info.active || this.info.activatedTime)
		{
			this.view.i_updateTimerForBossHPBar(aDoesBossExist_bl);
		}
	}

	_onBossDestroying(e)
	{
		this.view.isBossDeathAnimationInProgress = true;
	}
	
	_destroyFreezeTimer()
	{
		this._fFreezingTimer_t && this._fFreezingTimer_t.off("tick", this._tickTimer, this);
		this._fFreezingTimer_t && this._fFreezingTimer_t.destructor();
		this._fFreezingTimer_t = null;
	}

	destroy()
	{
		this._destroyFreezeTimer();
		APP.gameScreen.enemiesController.off(EnemiesController.EVENT_ON_TRAJECTORIES_UPDATED, this._onEnemiesTrajectoriesUpdated, this);
		APP.gameScreen.gameFieldController.off(GameFieldController.EVENT_ON_CLEAR_ROOM_STARTED, this._onRoomClear, this);
		APP.gameScreen.gameFieldController.off(GameFieldController.EVENT_ON_NEW_BOSS_CREATED, this._onBossStateUpdate.bind(this, true), this);
		APP.gameScreen.gameFieldController.off(GameFieldController.EVENT_ON_BOSS_HP_BAR_DESTROYING, this._onBossStateUpdate.bind(this, false), this);
		APP.gameScreen.off(GameScreen.EVENT_ON_ROOM_INFO_UPDATED, this._onRoomInfoUpdated, this);
		
		this.view.off(FreezeCapsuleFeatureView.CHANGE_FIELD_FREEZE_STATE, this._changeFieldFreezeState, this);
		this.view.off(FreezeCapsuleFeatureView.EVENT_ON_TIMER_APPEARED, this._onViewTimerAppeared, this);

		this._fDelayedAffectedEnemiesTrajectories_obj = null;
		this._fFreezingTimer_t = null;
		super.destroy();
	}
}

export default FreezeCapsuleFeatureController;