import SimpleController from '../../../../../common/PIXI/src/dgphoenix/unified/controller/base/SimpleController';
import GameOptimizationInfo from '../../model/custom/GameOptimizationInfo';
import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import GameFieldController from '../../controller/uis/game_field/GameFieldController'
import GameScreen from '../../main/GameScreen';
import AwardingController from '../uis/awarding/AwardingController';

class GameOptimizationController extends SimpleController {

	constructor()
	{
		super(new GameOptimizationInfo());
	}

	__init()
	{
		super.__init();

		this._gameScreen = APP.currentWindow;
		this._gameScreen.on(GameScreen.EVENT_ON_ROOM_PAUSED, this._onRoomPaused, this);
		this._gameScreen.once(GameScreen.EVENT_ON_READY, this._onGameScreenReady, this);	
		this._gameScreen.on(GameScreen.EVENT_ON_ROOM_FIELD_CLEARED, this._onRoomFieldCleared, this);
		this._gameScreen.on(GameScreen.EVENT_ON_BULLET_FLY_TIME, this._onBulletFlyTime, this);
	}

	_onGameScreenReady()
	{
		this._gameScreen.gameFieldController.on(GameFieldController.EVENT_ON_BULLET_TARGET_TIME, this._onBulletTargetTime, this);

		let awardingController = APP.currentWindow.awardingController;
		awardingController.on(AwardingController.EVENT_ON_AWARD_ANIMATION_STARTED, this._onAwardAnimationStarted, this);
		awardingController.on(AwardingController.EVENT_ON_AWARD_ANIMATION_INTERRUPTED, this._onAwardAnimationInterrupted, this);
		awardingController.on(AwardingController.EVENT_ON_AWARD_ANIMATION_COMPLETED, this._onAwardAnimationCompleted, this);
		awardingController.on(AwardingController.EVENT_ON_ALL_ANIMATIONS_COMPLETED, this._onAwardAllAnimationsCompleted, this);
	}

	_onRoomPaused()
	{
		this._clearAll();
	}

	_onRoomFieldCleared()
	{
		this._clearAll();
	}

	_clearAll()
	{
		this.info.i_clearAll();
	}

	//bullets...
	_onBulletFlyTime()
	{
		this.info.i_increaseCurrentShotsAmount();
	}

	_onBulletTargetTime()
	{
		this.info.i_decreaseCurrentShotsAmount();
	}
	//...bullets

	//awards...
	_onAwardAnimationStarted()
	{
		this.info.i_increaseCurrentAwardsAmount();
	}

	_onAwardAnimationInterrupted()
	{
		this.info.i_decreaseCurrentAwardsAmount();
	}

	_onAwardAnimationCompleted()
	{
		this.info.i_decreaseCurrentAwardsAmount();
	}

	_onAwardAllAnimationsCompleted()
	{
		this.info.i_resetCurrentAwardsAmount();
	}
	//...awards
}

export default GameOptimizationController;