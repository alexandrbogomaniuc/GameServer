import SimpleUIController from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/uis/base/SimpleUIController';
import BulletCapsuleFeatureInfo from '../../../model/uis/capsule_features/BulletCapsuleFeatureInfo';
import BulletCapsuleFeatureView from '../../../view/uis/capsule_features/BulletCapsuleFeatureView';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import GameFieldController from '../../../controller/uis/game_field/GameFieldController';

class BulletCapsuleFeatureController extends SimpleUIController
{
	static get EVENT_ON_STOP_AFFECTED_ENEMIES()			{return "onStopAffectedEnemies";}
	static get EVENT_ON_TARGET_HIT()					{ return BulletCapsuleFeatureView.EVENT_ON_TARGET_HIT; }
	static get EVENT_ON_BIG_BULLET_FLY_SFX()	{ return BulletCapsuleFeatureView.EVENT_ON_BIG_BULLET_FLY_SFX; }

	startFieldAnimation()
	{
		this._startFieldAnimation();
	}

	startAnimation(aStartPostion_obj, aBulletCapsuleId_num)
	{
		this._startAnimation(aStartPostion_obj, aBulletCapsuleId_num);
	}

	constructor()
	{
		super(new BulletCapsuleFeatureInfo(), new BulletCapsuleFeatureView());
	}

	_startFieldAnimation()
	{
		this.view.startFieldAnimation();
	}

	__initControlLevel()
	{
		super.__initControlLevel();

		APP.gameScreen.gameFieldController.on(GameFieldController.EVENT_ON_CLEAR_ROOM_STARTED, this._onRoomClear, this);
	}

	__initViewLevel()
	{
		super.__initViewLevel();

		this.view.on(BulletCapsuleFeatureView.EVENT_ON_TARGET_HIT, this.emit, this);
		this.view.on(BulletCapsuleFeatureView.EVENT_ON_BIG_BULLET_FLY_SFX, this.emit, this);
	}

	get bulletCapsuleFeatureContainerInfo()
	{
		return APP.gameScreen.gameFieldController.bulletCapsuleFeatureContainerInfo;
	}

	_startAnimation(aStartPostion_obj, aBulletCapsuleId_num)
	{
		this._stopAffectedEnemies(aBulletCapsuleId_num);
		this.view.addToContainerIfRequired(this.bulletCapsuleFeatureContainerInfo);
		this.view.startAnimation(aStartPostion_obj, APP.gameScreen.gameFieldController.delayedBulletExploasionHits[aBulletCapsuleId_num]);
	}

	_stopAffectedEnemies(aBulletCapsuleId_num)
	{
		let lHits_obj_arr = APP.gameScreen.gameFieldController.delayedBulletExploasionHits[aBulletCapsuleId_num];
		lHits_obj_arr && lHits_obj_arr.length > 0 && this.emit(BulletCapsuleFeatureController.EVENT_ON_STOP_AFFECTED_ENEMIES, {delayedExplosionHits: lHits_obj_arr});
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

export default BulletCapsuleFeatureController;