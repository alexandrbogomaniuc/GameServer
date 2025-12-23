import SimpleUIController from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/uis/base/SimpleUIController';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import PrizesController from '../prizes/PrizesController';
import GameFieldController from '../../../controller/uis/game_field/GameFieldController';
import GameScreen from '../../../main/GameScreen';
import BombView from '../../../view/uis/quests/BombView';

class BombController extends SimpleUIController
{
	static get EVENT_ON_BOMB_WIN_REGISTER()				{ return "onWheelWinRegister";}
	static get EVENT_ON_BOMB_WIN_REQUIRED()				{ return "onWheelWinRequired";}
	static get EVENT_ON_BOMB_OCCURED()					{ return "onMoneyWheelOccured";}
	static get EVENT_ON_ALL_ANIMATIONS_COMPLETED()		{ return "onAllAnimationsCompleted";}
	static get EVENT_ON_SHOW_DELAYED_AWARD()			{ return "onShowDelayedAward";}
	static get SHOW_MULT_WIN_AWARD()					{ return "SHOW_MULT_WIN_AWARD";}

	static get EVENT_ON_BOMB_SFX()						{ return BombView.EVENT_ON_BOMB_SFX; }

	get isAnimInProgress()
	{
		return ((this.view ? this.view.isAnimInProgress : false) || !!this.info.currentHitData);
	}

	constructor(aOptInfo_usuii, aOptView_uo)
	{
		super(aOptInfo_usuii, aOptView_uo);

		this._gameScreen = null;
	}
	
	__initControlLevel()
	{
		super.__initControlLevel();

		this._gameScreen = APP.currentWindow;

		this._gameScreen.prizesController.on(PrizesController.i_EVENT_ON_TIME_TO_SHOW_BOMB_PRIZE, this._onTimeToStartAward, this);
		this._gameScreen.on(GameScreen.EVENT_ON_HIT_AWARD_EXPECTED, this._onHitAwardExpected, this);

		this._gameField = this._gameScreen.gameFieldController;
		
		if (this._gameField.isGameplayStarted())
		{
			this._startListenRoundFieldMessages();
		}
		
		this._gameScreen.on(GameScreen.EVENT_ON_ROOM_PAUSED, this._onRoomPaused, this);
		this._gameScreen.gameFieldController.on(GameFieldController.DELAY_BOMB_ARRAY_COMPLETE, this._hitDataArray, this);
	}

	_hitDataArray(event)
	{
		if(!event) return;
		this.info.queueHitDataArray.push(event.dataArray);
	}

	__initViewLevel()
	{
		super.__initViewLevel();

		let lView = this.view;

		lView.on(BombView.EVENT_ON_WIN_ANIMATION_STARTED, this.emit, this);
		lView.on(BombView.EVENT_ON_WIN_ANIMATION_COMPLETED, this._winAnimationCompleted, this);
		lView.on(BombView.START_DELAY_AWARD, this._startDelayAward, this);
		lView.on(BombView.SHOW_MULT_WIN_AWARD, this._showMultWin, this);
		lView.on(BombView.EVENT_ON_BOMB_SFX, this.emit, this);

		lView.resetView();
	}

	_showMultWin()
	{
		this.emit(BombController.SHOW_MULT_WIN_AWARD);
	}

	_startDelayAward()
	{
		this.emit(BombController.EVENT_ON_SHOW_DELAYED_AWARD, {chMult: this.info.multiplayerWin});
	}

	get _screenCenterPoint()
	{
		return {x: APP.config.size.width/2, y: APP.config.size.height/2}
	}

	_startAnimation(event)
	{
		this.view.startAnimation();

		this.emit(BombController.EVENT_ON_BOMB_OCCURED);
	}

	interruptAnimations()
	{
		this._interrupt();
	}

	_onHitAwardExpected(event)
	{
		if (event.hitData.seatId !== event.masterSeatId) return;
	
		if (event.hitData.enemy.typeId != 51) return;
	
		let lHitData_obj = event.hitData;

		this.emit(BombController.EVENT_ON_BOMB_WIN_REGISTER, {hitData: lHitData_obj});
	}
	
	_onGameFieldScreenCreated(event)
	{
		this._startListenRoundFieldMessages();
	}

	_startListenRoundFieldMessages()
	{
		this._gameField.on(GameFieldController.EVENT_ON_ROOM_FIELD_CLEARED, this._onRoomFieldCleared, this);
	}

	_onRoomPaused(event)
	{
		this._interrupt();
	}

	_onRoomFieldCleared(event)
	{
		this._interrupt();
	}

	_interrupt()
	{
		this.view && this.view.resetView();
		this.info && this.info.clear();
	}

	_tryStartAnotherAnimation()
	{
		if(this.info.queueHitDataArray.length > 0) 
		{
			this.info.hitDataArray = this.info.queueHitDataArray.shift()
			this._startAnimation();
		}
	}

	_winAnimationCompleted()
	{
		this.info.resetCurrentHitData();

		this.emit(BombController.EVENT_ON_ALL_ANIMATIONS_COMPLETED);
		
		this._tryStartAnotherAnimation();
	}

	_onTimeToStartAward(event)
	{
		if(this.view && this.view.isAnimInProgress) return;
		
		let lHitData_obj = event.hitData;
		this.info.multiplayerWin = lHitData_obj.chMult;
		
		this._tryStartAnotherAnimation();
	}

	destroy()
	{
		if (this._gameScreen)
		{
			this._gameScreen.off(GameScreen.EVENT_ON_HIT_AWARD_EXPECTED, this._onHitAwardExpected, this);

			if (this._gameScreen.prizesController)
			{
				this._gameScreen.prizesController.off(PrizesController.i_EVENT_ON_TIME_TO_SHOW_BOMB_PRIZE, this._onTimeToStartAward, this);
			}
		}


		super.destroy();

		this._gameScreen = null;
	}
}

export default BombController;