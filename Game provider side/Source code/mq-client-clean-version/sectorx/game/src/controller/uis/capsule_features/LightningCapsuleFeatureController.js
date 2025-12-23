import SimpleUIController from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/uis/base/SimpleUIController';
import LightningCapsuleFeatureInfo from '../../../model/uis/capsule_features/LightningCapsuleFeatureInfo';
import LightningCapsuleFeatureView from '../../../view/uis/capsule_features/LightningCapsuleFeatureView';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import GameFieldController from '../../../controller/uis/game_field/GameFieldController';
import GameWebSocketInteractionController from '../../interaction/server/GameWebSocketInteractionController';
import GameScreen from '../../../main/GameScreen';

class LightningCapsuleFeatureController extends SimpleUIController
{
	static get EVENT_ON_STOP_AFFECTED_ENEMIES()			{return "onStopAffectedEnemies";}
	static get EVENT_ON_TARGET_HIT()					{ return LightningCapsuleFeatureView.EVENT_ON_TARGET_HIT; }
	static get EVENT_ON_HIT_ANIMATION_COMPLETED()		{ return LightningCapsuleFeatureView.EVENT_ON_HIT_ANIMATION_COMPLETED; }
	static get EVENT_ON_LIGHTNING_SFX()					{ return LightningCapsuleFeatureView.EVENT_ON_LIGHTNING_SFX; }
	static get EVENT_ON_ALL_ANIMATIONS_COMPLETED()		{ return LightningCapsuleFeatureView.EVENT_ON_ALL_ANIMATIONS_COMPLETED; }

	startAnimation(aStartPostion_obj, aCapsuleEnemyId_num)
	{
		// APP.gameScreen.enemiesController.on(EnemiesController.EVENT_ON_TRAJECTORIES_UPDATED, this._onEnemiesTrajectoriesUpdated, this);
		this._startAnimation(aStartPostion_obj, aCapsuleEnemyId_num);
	}

	get isAnimationPlaying()
	{
		return this.view.isAnimationPlaying;
	}

	constructor()
	{
		super(new LightningCapsuleFeatureInfo(), new LightningCapsuleFeatureView());
	}

	__initControlLevel()
	{
		super.__initControlLevel();
		APP.gameScreen.on(GameScreen.EVENT_ON_GAME_FIELD_SCREEN_CREATED, this._onGameFieldScreenCreated, this);
	}

	_onGameFieldScreenCreated()
	{
		APP.webSocketInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_UPDATE_TRAJECTORIES_MESSAGE, this._onEnemiesTrajectoriesUpdated, this);
		APP.gameScreen.gameFieldController.on(GameFieldController.EVENT_ON_CLEAR_ROOM_STARTED, this._onRoomClear, this);
	}

	__initViewLevel()
	{
		super.__initViewLevel();

		this.view.on(LightningCapsuleFeatureView.EVENT_ON_TARGET_HIT, this.emit, this);
		this.view.on(LightningCapsuleFeatureView.EVENT_ON_HIT_ANIMATION_COMPLETED, this._continueWalkBoss, this);
		this.view.on(LightningCapsuleFeatureView.EVENT_ON_LIGHTNING_SFX, this.emit, this);
		this.view.on(LightningCapsuleFeatureView.EVENT_ON_ALL_ANIMATIONS_COMPLETED, this.emit, this);
	}

	_onEnemiesTrajectoriesUpdated(aEvent_obj)
	{
		this._fDelayedAffectedEnemiesTrajectories_obj = aEvent_obj.messageData.trajectories;
	}

	get bulletCapsuleFeatureContainerInfo()
	{
		return APP.gameScreen.gameFieldController.bulletCapsuleFeatureContainerInfo;
	}

	_startAnimation(aStartPostion_obj, aCapsuleEnemyId_num)
	{
		this._stopAffectedEnemies(aCapsuleEnemyId_num);
		this.view.addToContainerIfRequired(this.bulletCapsuleFeatureContainerInfo);
		this.view.startAnimation(aStartPostion_obj, aCapsuleEnemyId_num);
	}

	_stopAffectedEnemies(aCapsuleEnemyId_num)
	{
		if(!this._fBossEnemy_obj_arr)
		{
			this._fBossEnemy_obj_arr = [];
			this._fDelayedAffectedEnemiesTrajectories_obj_arr = [];
		}

		let lHits_obj_arr = APP.gameScreen.gameFieldController.delayedLightningExplosionHits[aCapsuleEnemyId_num];
		if (lHits_obj_arr)
		{
			this.emit(LightningCapsuleFeatureController.EVENT_ON_STOP_AFFECTED_ENEMIES, {delayedLightningExplosionHits: lHits_obj_arr, stopWalking: true});
			lHits_obj_arr.forEach(element => {
				if(element.enemy.typeId === 100)
				{
					this._fBossEnemy_obj_arr.push(element);
					this._fDelayedAffectedEnemiesTrajectories_obj_arr.push(this._fDelayedAffectedEnemiesTrajectories_obj)
				}
			});
		}
	}

	_continueWalkBoss(e)
	{
		this.emit(LightningCapsuleFeatureController.EVENT_ON_HIT_ANIMATION_COMPLETED, { capsuleId: e.capsuleId , delayedLightningExplosionHits: this._fBossEnemy_obj_arr, affectedEnemies: this._fDelayedAffectedEnemiesTrajectories_obj_arr});
	}

	_onRoomClear()
	{
		this.view.interrupt();
	}

	destroy()
	{
		super.destroy();
	}
}

export default LightningCapsuleFeatureController;