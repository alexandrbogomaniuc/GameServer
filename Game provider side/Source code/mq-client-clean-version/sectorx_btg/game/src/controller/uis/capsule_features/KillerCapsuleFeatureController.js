import SimpleUIController from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/uis/base/SimpleUIController';
import KillerCapsuleFeatureView from '../../../view/uis/capsule_features/KillerCapsuleFeatureView';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import KillerCapsuleFeatureInfo from '../../../model/uis/capsule_features/KillerCapsuleFeatureInfo';
import GameFieldController from '../../../controller/uis/game_field/GameFieldController';

class KillerCapsuleFeatureController extends SimpleUIController
{
	static get EVENT_ON_ENEMY_START_LASER_NET_SMOKE_ANIMATION()		{ return 'onEnemyStartLaserNetSmokeAnimation'; }
	static get EVENT_ON_SHOW_DELAYED_AWARD() 						{ return 'onShowDelayedAward'; }
	static get EVENT_ON_STOP_AFFECTED_ENEMIES()						{ return "onStopAffectedEnemies"; }
	static get EVENT_ON_TARGET_HIT()								{ return KillerCapsuleFeatureView.EVENT_ON_TARGET_HIT; }

	static get EVENT_ON_CARD_DISAPPEARED() 							{ return KillerCapsuleFeatureView.EVENT_ON_CARD_DISAPPEARED; }

	static get EVENT_ON_INSTAKILL_BEAM_SFX()						{ return KillerCapsuleFeatureView.EVENT_ON_INSTAKILL_BEAM_SFX; }

	startAnimation(aStartPostion_obj)
	{
		this._startAnimation(aStartPostion_obj);
	}

	get killerCapsuleFeatureContainerInfo()
	{
		return APP.gameScreen.gameFieldController.killerCapsuleFeatureContainerInfo;
	}

	constructor()
	{
		super(new KillerCapsuleFeatureInfo());
		this._fViewCapsuleFeature_kcfv_arr = [];
	}

	__initControlLevel()
	{
		super.__initControlLevel();

		APP.gameScreen.gameFieldController.on(GameFieldController.EVENT_ON_CLEAR_ROOM_STARTED, this._onRoomClear, this);
	}

	__initViewLevel()
	{
		super.__initViewLevel();
	}

	_startAnimation(aStartPostion_obj)
	{
		let lView_kcfv = new KillerCapsuleFeatureView();
		lView_kcfv.on(KillerCapsuleFeatureView.EVENT_ON_TARGET_HIT, this.emit, this);
		lView_kcfv.on(KillerCapsuleFeatureView.EVENT_ON_CARD_LANDED, this._onCardLanded, this);
		lView_kcfv.on(KillerCapsuleFeatureView.EVENT_ON_CARD_READY_TO_KILL, this._stopAffectedEnemies, this);
		lView_kcfv.on(KillerCapsuleFeatureView.EVENT_ON_INSTAKILL_BEAM_SFX, this.emit, this);
		lView_kcfv.once(KillerCapsuleFeatureView.EVENT_ON_DESTROYING, this._onRemovingView, this);

		lView_kcfv.addToContainerIfRequired(this.killerCapsuleFeatureContainerInfo);
		lView_kcfv.startAnimation(aStartPostion_obj);

		this._fViewCapsuleFeature_kcfv_arr.push(lView_kcfv);
	}

	_onCardLanded(aEvent_obj)
	{
		this._shakeTheGround();

		let lView_kcfv = aEvent_obj.target;

		if (aEvent_obj.isInit)
		{
			let lTargets_obj_arr = APP.currentWindow.gameFieldController.delayedKillerExplosionHits;
			if (Array.isArray(lTargets_obj_arr) && lTargets_obj_arr.length)
			{
				this.info.affectedEnemiesInfo = lTargets_obj_arr;
				lView_kcfv.setInfoAffectedEnemiesInfo(lTargets_obj_arr);
				lView_kcfv.i_setFinalEnemyType(lTargets_obj_arr[0].enemy.typeId);
			}
			else
			{
				lView_kcfv.interrupt();
			}
		}
		else
		{
			lView_kcfv.i_fireEnemies();
		}
	}

	_shakeTheGround()
	{
		APP.gameScreen.gameFieldController.shakeTheGround("capsule");
	}

	_stopAffectedEnemies()
	{
		this.emit(KillerCapsuleFeatureController.EVENT_ON_STOP_AFFECTED_ENEMIES, {delayedExplosionHits: APP.gameScreen.gameFieldController.delayedKillerExplosionHits, stopWalking: true});
	}

	_onRoomClear()
	{
		let lViewCapsuleFeature_kcfv_arr = this._fViewCapsuleFeature_kcfv_arr.slice();
		lViewCapsuleFeature_kcfv_arr.forEach(element => {
			element.interrupt();
		});
	}

	_onRemovingView(event)
	{
		let lIndex_int = this._fViewCapsuleFeature_kcfv_arr.indexOf(event.target);
		if (~lIndex_int)
		{
			this._fViewCapsuleFeature_kcfv_arr.splice(lIndex_int, 1);
		}
	}

	destroy()
	{
		APP.gameScreen.gameFieldController.off(GameFieldController.EVENT_ON_CLEAR_ROOM_STARTED, this._onRoomClear, this);

		super.destroy();
	}
}

export default KillerCapsuleFeatureController;