import SimpleUIController from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/uis/base/SimpleUIController';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import PrizesController from '../prizes/PrizesController';
import GameFieldController from '../../../controller/uis/game_field/GameFieldController';
import GameScreen from '../../../main/GameScreen';
import MoneyWheelView from '../../../view/uis/quests/MoneyWheelView';
import WinTierUtil from '../../../main/WinTierUtil';
import { BIG_WIN_PAYOUT_RATIOS } from '../../../model/uis/awarding/big_win/BigWinInfo';

class MoneyWheelController extends SimpleUIController
{
	static get EVENT_ON_MONEY_WHEEL_WIN_REGISTER()				{ return "onWheelWinRegister";}
	static get EVENT_ON_MONEY_WHEEL_WIN_REQUIRED()				{ return "onWheelWinRequired";}
	static get EVENT_ON_MONEY_WHEEL_OCCURED()					{ return "onMoneyWheelOccured";}
	static get EVENT_ON_ALL_ANIMATIONS_COMPLETED()				{ return "onAllAnimationsCompleted";}
	static get EVENT_ON_MONEY_WHEEL_INTERRUPTED()				{ return "onWheelInterrupted";}

	static get EVENT_ON_WHEEL_POPUP_SFX()						{return MoneyWheelView.EVENT_ON_WHEEL_POPUP_SFX;}
	static get EVENT_ON_WHEEL_HIGHLIGHT_SFX()					{return MoneyWheelView.EVENT_ON_WHEEL_HIGHLIGHT_SFX;}
	static get EVENT_ON_WHEEL_TENSION_SFX()						{return MoneyWheelView.EVENT_ON_WHEEL_TENSION_SFX;}
	static get EVENT_ON_WHEEL_WIN_SFX()							{return MoneyWheelView.EVENT_ON_WHEEL_WIN_SFX;}

	get isAnimInProgress()
	{
		return ((this.view ? this.view.isAnimInProgress : false) || !!this.info.currentHitData);
	}

	get isPayoutPresentationInProgress()
	{
		return APP.currentWindow.awardingController.view.isAnyMoneyWheelPayoutPresentationInProgress;
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

		this._gameScreen.prizesController.on(PrizesController.i_EVENT_ON_TIME_TO_SHOW_MONEY_WHEEL_PRIZE, this._onTimeToStartAward, this);

		this._gameScreen.on(GameScreen.EVENT_ON_HIT_AWARD_EXPECTED, this._onHitAwardExpected, this);

		this._gameField = this._gameScreen.gameFieldController;
		
		if (this._gameField.isGameplayStarted())
		{
			this._startListenRoundFieldMessages();
		}
		
		// this._gameScreen.on(GameScreen.EVENT_ON_GAME_FIELD_SCREEN_CREATED, this._onGameFieldScreenCreated, this);
		this._gameScreen.on(GameScreen.EVENT_ON_ROOM_PAUSED, this._onRoomPaused, this);
	}

	__initViewLevel()
	{
		super.__initViewLevel();

		let lView = this.view;

		
		lView.on(MoneyWheelView.EVENT_ON_WIN_VALUE_ANIMATION_COMPLETED, this._onWinValueAnimationCompleted, this);
		lView.on(MoneyWheelView.EVENT_ON_WHEEL_MOVE_STARTED, this.emit, this);
		// lView.on(MoneyWheelView.EVENT_ON_WHEEL_MOVED, this._onWheelMovedToStatePosition, this);
		lView.on(MoneyWheelView.EVENT_ON_WIN_ANIMATION_STARTED, this.emit, this);
		lView.on(MoneyWheelView.EVENT_ON_WIN_ANIMATION_COMPLETED, this._winAnimationCompleted, this);

		lView.on(MoneyWheelView.EVENT_ON_WHEEL_POPUP_SFX, this._emitViewEventAndShakeTheGround, this);
		lView.on(MoneyWheelView.EVENT_ON_WHEEL_HIGHLIGHT_SFX, this._emitViewEventAndShakeTheGround, this);
		lView.on(MoneyWheelView.EVENT_ON_WHEEL_TENSION_SFX, this.emit, this);
		lView.on(MoneyWheelView.EVENT_ON_WHEEL_WIN_SFX, this.emit, this);

		lView.data = APP.playerController.info.moneyWheelPayouts;

		lView.resetView();
	}

	_startAnimation()
	{
		let lHitData_obj = this.info.hitDataArray.shift();
		this.info.currentHitData = lHitData_obj;
		this.view.startAnimation(lHitData_obj.win, lHitData_obj.betLevel, APP.gameScreen.roundFinishSoon);

		this.emit(MoneyWheelController.EVENT_ON_MONEY_WHEEL_OCCURED);
	}

	_emitViewEventAndShakeTheGround(aEvent_obj)
	{
		this.emit(aEvent_obj);
		this._gameField.shakeTheGround();
	}

	interruptAnimations()
	{
		this._interrupt();
	}

	_onHitAwardExpected(event)
	{
		if (event.hitData.enemy.typeId != 51 || event.hitData.skipAwardedWin) return;
	
		let lHitData_obj = event.hitData;

		this.emit(MoneyWheelController.EVENT_ON_MONEY_WHEEL_WIN_REGISTER, {hitData: lHitData_obj});
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
		let lHitData_obj = this.info.currentHitData;
		if (lHitData_obj)
		{
			this.emit(MoneyWheelController.EVENT_ON_MONEY_WHEEL_INTERRUPTED, {MoneyWheelWin: lHitData_obj.win, isBigWin: lHitData_obj.skipAwardedWin, rid: lHitData_obj.awardId});
		}
		let lHitDataArray_arr = this.info.hitDataArray;
		for (let i = 0; i < lHitDataArray_arr.length; i++)
		{
			this.emit(MoneyWheelController.EVENT_ON_MONEY_WHEEL_INTERRUPTED, {MoneyWheelWin: lHitDataArray_arr[i].win, isBigWin: lHitDataArray_arr[i].skipAwardedWin, rid: lHitDataArray_arr[i].awardId});
		}

		this.view && this.view.resetView();
		this.info && this.info.clear();
	}

	_onWinValueAnimationCompleted()
	{
		let lAwardingController_ac = APP.currentWindow.awardingController;
		let lContainer_sprt = lAwardingController_ac.awardingContainerInfo.container;
		let lSpot = APP.gameScreen.gameFieldController.spot;
		let lHitData_obj = this.info.currentHitData;
		if (lAwardingController_ac && lSpot && lContainer_sprt && lHitData_obj)
		{
			let lCurrentStake_num = APP.playerController.info.currentStake;
			let lFinalPos_obj = lSpot.spotVisualCenterPoint;

			let pendingAwardInfo = lAwardingController_ac.getPendingAwardInfo(this.info.awardId);
			
			let lRatio_num  = lHitData_obj.win / (APP.playerController.info.currentStake * lHitData_obj.betLevel)
			let isBigWin = lRatio_num > BIG_WIN_PAYOUT_RATIOS.BIG;
			if (isBigWin)
			{
				this.emit(MoneyWheelController.EVENT_ON_MONEY_WHEEL_WIN_REQUIRED, {data: null, isBigWin: isBigWin, rid: lHitData_obj.rid});
				return;
			}

			let lData_obj = { 
				moneyValue: lHitData_obj.win,
				currentStake: lCurrentStake_num,
				rid: lHitData_obj.rid,
				isBigWin: false,
				params: {
					isMoneyWheelWin: true,
					start: {x: APP.config.size.width/2, y: APP.config.size.height/2},
					startOffset: {x: 0, y: 0},
					winPoint: lFinalPos_obj,
					specifiedWinSoundTier: WinTierUtil.WIN_TIERS.TIER_BIG,
					isQualifyWinDevalued: (pendingAwardInfo.isQualifyWinDevalued || false),
					awardId: this.info.awardId, // added as unique id to remove award info from the queue (AwardingController._awardsInfo_arr)
					seatId: APP.playerController.info.seatId,
					payoutsArr: this.info.payoutsArr
				}
			};

			this.emit(MoneyWheelController.EVENT_ON_MONEY_WHEEL_WIN_REQUIRED, lData_obj);
		}
	}
	
	_tryStartAnotherAnimation()
	{
		if (this.info.hitDataArray && this.info.hitDataArray.length && !this.isAnimInProgress)
		{
			this._startAnimation();
		}
	}

	_winAnimationCompleted()
	{
		this.info.resetCurrentHitData();

		if (!this.info.hitDataArray || (this.info.hitDataArray && !this.info.hitDataArray.length))
		{
			this.emit(MoneyWheelController.EVENT_ON_ALL_ANIMATIONS_COMPLETED);
		}

		this._tryStartAnotherAnimation();
	}

	_onTimeToStartAward(event)
	{
		let lHitData_obj = event.hitData;
		this._addNewMoneyWheelDateToQueue(lHitData_obj);
		
		this._tryStartAnotherAnimation();
	}

	_addNewMoneyWheelDateToQueue(aHitData_obj)
	{
		let lCurrentHitData = this.info.currentHitData;

		let lWheelsData_arr = this.info.hitDataArray;
		if (!lWheelsData_arr || !lWheelsData_arr.length)
		{
			lWheelsData_arr.push(aHitData_obj);
			return;
		}

		for (let i=lWheelsData_arr.length-1; i>=0; i--)
		{
			if (lWheelsData_arr[i].rid == aHitData_obj.rid)
			{
				lWheelsData_arr.splice(i+1, 0, aHitData_obj);
				return;
			}
		}

		if (!!lCurrentHitData && lCurrentHitData.rid == aHitData_obj.rid)
		{
			lWheelsData_arr.unshift(aHitData_obj);
			return;
		}

		lWheelsData_arr.push(aHitData_obj);
	}

	destroy()
	{
		if (this._gameScreen)
		{
			this._gameScreen.off(GameScreen.EVENT_ON_HIT_AWARD_EXPECTED, this._onHitAwardExpected, this);

			if (this._gameScreen.prizesController)
			{
				this._gameScreen.prizesController.off(PrizesController.i_EVENT_ON_TIME_TO_SHOW_MONEY_WHEEL_PRIZE, this._onTimeToStartAward, this);
			}
		}

		if (this.view)
		{
			this.view.off(MoneyWheelView.EVENT_ON_WIN_VALUE_ANIMATION_COMPLETED, this._onWinValueAnimationCompleted, this);
		}

		super.destroy();

		this._gameScreen = null;
	}
}

export default MoneyWheelController;