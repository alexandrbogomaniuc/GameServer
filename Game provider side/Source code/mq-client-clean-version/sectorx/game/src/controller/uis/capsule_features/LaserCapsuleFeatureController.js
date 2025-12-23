import SimpleUIController from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/uis/base/SimpleUIController';
import LaserCapsuleFeatureInfo from '../../../model/uis/capsule_features/LaserCapsuleFeatureInfo';
import LaserCapsuleFeatureView from '../../../view/uis/capsule_features/LaserCapsuleFeatureView';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import {FRAME_RATE } from '../../../../../shared/src/CommonConstants';
import GameFieldController from '../../../controller/uis/game_field/GameFieldController';
import Timer from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';

const ENEMIE_SMOKE_COUNT = 4

class LaserCapsuleFeatureController extends SimpleUIController
{
	static get EVENT_ON_ENEMY_START_LASER_NET_SMOKE_ANIMATION()		{ return 'onEnemyStartLaserNetSmokeAnimation'; }
	static get EVENT_ON_SHOW_DELAYED_AWARD() 						{ return 'onShowDelayedAward'; }
	static get EVEN_ON_LASERNET_SFX()								{ return LaserCapsuleFeatureView.EVENT_ON_LASERNET_SFX; }
	static get EVENT_ON_ALL_ANIMATIONS_COMPLETED()					{ return LaserCapsuleFeatureView.EVENT_ON_ALL_ANIMATIONS_COMPLETED; }

	startAnimation(aStartPostion_obj, aCapsuleId_num)
	{
		this._startAnimation(aStartPostion_obj, aCapsuleId_num);
	}

	startFieldAnimation(aCapsuleId_num)
	{
		this._startFieldAnimation(aCapsuleId_num);
	}

	get isAnimationPlaying()
	{
		return this.view.isAnimationPlaying;
	}

	get laserCapsuleFeatureContainerInfo()
	{
		return APP.gameScreen.gameFieldController.laserCapsuleFeatureContainerInfo;
	}

	constructor()
	{
		super(new LaserCapsuleFeatureInfo(), new LaserCapsuleFeatureView());
		this._fSmokeCount_num = 0;
	}

	__initControlLevel()
	{
		super.__initControlLevel();

		APP.gameScreen.gameFieldController.on(GameFieldController.EVENT_ON_CLEAR_ROOM_STARTED, this._onRoomClear, this);
	}

	__initViewLevel()
	{
		super.__initViewLevel();

		this.view.on(LaserCapsuleFeatureView.EVENT_ON_LASERNET_SFX, this.emit, this);
		this.view.on(LaserCapsuleFeatureView.EVENT_ON_ALL_ANIMATIONS_COMPLETED, this.emit, this);
	}

	_startAnimation(aStartPostion_obj, aCapsuleId_num)
	{
		this.view.addToContainerIfRequired(this.laserCapsuleFeatureContainerInfo);
		this.view.startAnimation(aStartPostion_obj, aCapsuleId_num);

		this._startEnemiesSmokeAnimation();
	}

	_startEnemiesSmokeAnimation()
	{
		if (this._fSmokeCount_num == ENEMIE_SMOKE_COUNT)
		{
			this.emit(LaserCapsuleFeatureController.EVENT_ON_SHOW_DELAYED_AWARD);
			this._fSmokeCount_num = 0;
			return;
		}

		this._fSmokeCount_num += 1;
		this._fSmokeTimer_t = new Timer(() => this._startEnemiesSmokeAnimation(), 16 * FRAME_RATE);

		let lDelayedLaserExploasionHits_obj_arr = APP.gameScreen.gameFieldController.delayedLaserExploasionHits;
		if (lDelayedLaserExploasionHits_obj_arr)
		{
			for (let obj of lDelayedLaserExploasionHits_obj_arr)
			{
				this.emit(LaserCapsuleFeatureController.EVENT_ON_ENEMY_START_LASER_NET_SMOKE_ANIMATION, { enemyId: obj.enemy.id });
			}
		}
	}

	_onRoomClear()
	{
		if (this._fSmokeTimer_t)
		{
			this._fSmokeTimer_t.destructor();
			this._fSmokeTimer_t = null;
		}

		this._fSmokeCount_num = 0;

		this.view.clear();
	}

	_startFieldAnimation(aCapsuleId_num)
	{
		this.view.startFieldAnimation(aCapsuleId_num);
	}

	destroy()
	{
		if (this._fSmokeTimer_t)
		{
			this._fSmokeTimer_t.destructor();
			this._fSmokeTimer_t = null;
		}

		this._fSmokeCount_num = 0;

		super.destroy();
	}
}

export default LaserCapsuleFeatureController;