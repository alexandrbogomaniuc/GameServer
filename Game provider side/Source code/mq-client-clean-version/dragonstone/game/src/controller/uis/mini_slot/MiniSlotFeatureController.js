import SimpleUIController from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/uis/base/SimpleUIController';
import PlayerInfo from '../../../../../../common/PIXI/src/dgphoenix/unified/model/custom/PlayerInfo';
import GameField from '../../../main/GameField';
import GameScreen from '../../../main/GameScreen';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import PrizesController from '../prizes/PrizesController';
import GamePlayerController from '../../../controller/custom/GamePlayerController';

import MiniSlotFeatureView from '../../../view/uis/mini_slot/MiniSlotFeatureView';

import MiniSlotController from './MiniSlotController';
import MiniSlotInfo from '../../../model/uis/mini_slot/MiniSlotInfo';
import MiniSlotView from '../../../view/uis/mini_slot/MiniSlotView';

import BigWinsController from '../../../controller/uis/awarding/big_win/BigWinsController';

class MiniSlotFeatureController extends SimpleUIController
{
	static get EVENT_ON_MINI_SLOT_OCCURED()						{ return "onSlotOccured"; }
	static get EVENT_ON_MINI_SLOT_WIN_REQUIRED()				{ return "onSlotWinRequired"; }
	static get EVENT_ON_MINI_SLOT_SPIN_STARTED() 				{ return "EVENT_ON_MINI_SLOT_SPIN_STARTED"; }
	static get EVENT_ON_MINI_SLOT_OUTRO() 						{ return "EVENT_ON_MINI_SLOT_OUTRO"; }
	static get EVENT_ON_WIN_ANIMATION_STARTED() 				{ return "EVENT_ON_WIN_ANIMATION_STARTED"; }
	static get EVENT_ON_WIN_ANIMATION_COMPLETED()				{ return "EVENT_ON_WIN_ANIMATION_COMPLETED"; }
	static get EVENT_ON_ALL_ANIMATIONS_COMPLETED()				{ return "EVENT_ON_ALL_ANIMATIONS_COMPLETED"; }

	get isAnimInProgress()
	{
		return ((this.view ? this.view.isAnimInProgress : false) || this.info.currentSlotData );
	}

	interruptAnimations()
	{
		this._interrupt();
	}

	constructor(aOptInfo_usuii, aOptView_uo)
	{
		super(aOptInfo_usuii, aOptView_uo);

		this._fMiniSlotController_msc = null;
		this._fMiniSlotView_msv = null;
	}

	__initControlLevel()
	{
		super.__initControlLevel();

		const lGameScreen_gs = APP.currentWindow;
		const lGameField_gs = lGameScreen_gs.gameField;
		
		if (lGameField_gs.isGameplayStarted())
		{
			this._startListenRoundFieldMessages();
		}
		else
		{
			lGameScreen_gs.on(GameScreen.EVENT_ON_GAME_FIELD_SCREEN_CREATED, this._onGameFieldScreenCreated, this);
		}
		lGameScreen_gs.on(GameScreen.EVENT_ON_ROOM_PAUSED, this._onRoomPaused, this);

		APP.currentWindow.prizesController.on(PrizesController.i_EVENT_ON_TIME_TO_SHOW_MINI_SLOT_PRIZE, this._onTimeToStartAward, this);
		APP.playerController.on(GamePlayerController.EVENT_ON_PLAYER_INFO_UPDATED, this._onPlayerInfoUpdated, this);

		this._miniSlotController.i_init();
	}

	_onPlayerInfoUpdated(aEvent_obj)
	{
		let lData_obj = aEvent_obj.data;

		if (lData_obj[PlayerInfo.KEY_REELS])
		{
			const lValue_obj = lData_obj[PlayerInfo.KEY_REELS].value;
			this._miniSlotController.setDefaultReelsContent(lValue_obj);
		}
	}

	__initViewLevel()
	{
		super.__initViewLevel();

		this.view.setSlotView(this._miniSlotView);

		this.view.on(MiniSlotFeatureView.EVENT_ON_SLOT_APPEARING_FINISH, this._onSlotAppearingFinish, this);
		this.view.on(MiniSlotFeatureView.EVENT_ON_SLOT_DISAPPEARING_FINISH, this._onSlotDisappearingFinish, this);

		this._miniSlotView.on(MiniSlotController.EVENT_ON_SPIN_FINISH, this._onSpinFinish, this);
	}

	_getSlotWins(aSlotInfo_obj)
	{
		let lResult_num = 0;
		aSlotInfo_obj.forEach((element) => {lResult_num += element.win} );

		return lResult_num
	}

	_onSpinFinish(event, aIsSkipWin_bl = false)
	{
		if (this.info.currentSpinWin > 0 && !aIsSkipWin_bl)
		{
			this._startWinAnimation();
			return;
		}

		this.info.currentSpinNumber++;
		this._miniSlotController.info.currentSpinNumber = this.info.currentSpinNumber;

		if (this.info.currentSpinNumber != this.info.currentSlotData.length)
		{
			this._startSpin();
		}
		else
		{
			this._finishAnimation()
		}
	}

	_startWinAnimation()
	{
		APP.gameScreen.gameField.shakeTheGround();
		this.view.showWinSmoke();
		this._miniSlotController.showWinAnimation();
		this._requireWinAnimation();
		this.emit(MiniSlotFeatureView.EVENT_ON_WIN_ANIMATION_STARTED);
		APP.currentWindow.bigWinsController.once(BigWinsController.EVENT_ON_COIN_LANDED, this._onBigWinsAnimationsCompleted, this);
		APP.currentWindow.bigWinsController.once(BigWinsController.EVENT_ON_ANIMATION_INTERRUPTED, this._onBigWinAnimationInterrupted, this);
	}

	_onBigWinsAnimationsCompleted()
	{
		APP.currentWindow.bigWinsController.off(BigWinsController.EVENT_ON_ANIMATION_INTERRUPTED, this._onBigWinAnimationInterrupted, this, true);

		this.emit(MiniSlotFeatureController.EVENT_ON_WIN_ANIMATION_COMPLETED);
		this._onSpinFinish(null, true);
	}

	_onBigWinAnimationInterrupted()
	{
		APP.currentWindow.bigWinsController.off(BigWinsController.EVENT_ON_COIN_LANDED, this._onBigWinsAnimationsCompleted, this, true);

		this.emit(MiniSlotFeatureController.EVENT_ON_WIN_ANIMATION_COMPLETED);
		this._onSpinFinish(null, true);
	}

	_requireWinAnimation()
	{
		let lHitData_obj = this.info.currentHitData;
		if (lHitData_obj)
		{
			this.emit(MiniSlotFeatureController.EVENT_ON_MINI_SLOT_WIN_REQUIRED, {data: null, isBigWin: true, rid: lHitData_obj.rid});
		}
	}

	_onSlotAppearingFinish()
	{
		this._startSpin();
	}

	_startSpin()
	{
		this.view.showSpinSmoke();
		this.emit(MiniSlotFeatureController.EVENT_ON_MINI_SLOT_SPIN_STARTED);

		this._miniSlotController.startSpin(this.info.currentReelsPosition);
	}

	_onSlotDisappearingFinish()
	{
		this.info.resetCurrentSlotData();
		this.info.resetCurrentHitData();
		this.info.resetCurrentSpinNumber();

		this._tryStartAnotherAnimation(true);
	}

	// MINI SLOT...
	get _miniSlotController()
	{
		return this._fMiniSlotController_msc || (this._fMiniSlotController_msc = this._initMiniSlotController());
	}

	_initMiniSlotController()
	{
		const l_msc = new MiniSlotController(new MiniSlotInfo(APP.playerController.info.reels), this._miniSlotView);

		return l_msc;
	}

	get _miniSlotView()
	{
		return this._fMiniSlotView_msv || (this._fMiniSlotView_msv = this._initMiniSlotView());
	}

	_initMiniSlotView()
	{
		const l_msv = new MiniSlotView();

		return l_msv;
	}
	// ...MINI SLOT

	_onTimeToStartAward(event)
	{
		this._addNewMiniSlotFeatureDateToQueue(event.hitData);
		this._tryStartAnotherAnimation();
	}

	_addNewMiniSlotFeatureDateToQueue(aData_obj)
	{
		const lMessageData_obj = aData_obj;
		this.info.miniSlotFeatures.push(lMessageData_obj.slot);
		this.info.hitDates.push(lMessageData_obj);
	}

	_tryStartAnotherAnimation(aIsEnded = false)
	{
		if (this.info.miniSlotFeatures && this.info.miniSlotFeatures.length && !this.isAnimInProgress)
		{
			this._startAnimation();
		}
		else if (aIsEnded)
		{
			this.emit(MiniSlotFeatureController.EVENT_ON_ALL_ANIMATIONS_COMPLETED);
		}
	}

	_startAnimation()
	{
		const lSlotData_obj = this.info.miniSlotFeatures.shift();
		this.info.currentSlotData = lSlotData_obj;
		const lHitData_obj = this.info.hitDates.shift();
		this.info.currentHitData = lHitData_obj;
		this.info.currentSpinNumber = 0;
		this._miniSlotController.info.currentSpinNumber = this.info.currentSpinNumber;

		APP.gameScreen.gameField.shakeTheGround();
		this.view.startAnimation();

		this.emit(MiniSlotFeatureController.EVENT_ON_MINI_SLOT_OCCURED);
	}

	_finishAnimation()
	{
		APP.gameScreen.gameField.shakeTheGround();
		this.view.finishAnimation();

		this.emit(MiniSlotFeatureController.EVENT_ON_MINI_SLOT_OUTRO);
	}

	_onGameFieldScreenCreated()
	{
		this._startListenRoundFieldMessages();
	}

	_startListenRoundFieldMessages()
	{
		const lGameScreen_gs = APP.currentWindow;
		const lGameField_gs = lGameScreen_gs.gameField;

		lGameField_gs.on(GameField.EVENT_ON_ROOM_FIELD_CLEARED, this._onRoomFieldCleared, this);
	}

	_onRoomFieldCleared()
	{
		this._interrupt();
	}

	_onRoomPaused()
	{
		this._interrupt();
	}

	_interrupt()
	{
		APP.currentWindow.bigWinsController.off(BigWinsController.EVENT_ON_COIN_LANDED, this._onBigWinsAnimationsCompleted, this, true);
		APP.currentWindow.bigWinsController.off(BigWinsController.EVENT_ON_ANIMATION_INTERRUPTED, this._onBigWinAnimationInterrupted, this, true);

		this.view && this.view.resetView();
		this.info && this.info.clear();
		this._miniSlotController.info.clear();

		this.emit(MiniSlotFeatureController.EVENT_ON_ALL_ANIMATIONS_COMPLETED);
	}

	destroy()
	{
		super.destroy();

		this._fMiniSlotController_msc = null;
		this._fMiniSlotView_msv = null;
	}
}

export default MiniSlotFeatureController;
