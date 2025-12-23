import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import SimpleUIController from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/uis/base/SimpleUIController';

import RoundResultScreenView from '../../../view/uis/roundresult/RoundResultScreenView';
import GameStateController from '../../state/GameStateController';
import GameScreen from '../../../main/GameScreen';
import GamePlayerController from '../../custom/GamePlayerController';
import Timer from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import GameFRBController from './../custom/frb/GameFRBController';
import GameBonusController from '../../../controller/uis/custom/bonus/GameBonusController';
import {ROUND_STATE} from '../../../model/state/GameStateInfo';

class RoundResultScreenController extends SimpleUIController
{
	static get EVENT_ON_ROUND_RESULT_SCREEN_ACTIVATED() { return "onRoundResultScreenActivated"; }
	static get EVENT_ON_ROUND_RESULT_SCREEN_ACTIVATION_START() { return "onRoundResultScreenActivationStart"; }	

	static get EVENT_ON_ROUND_RESULT_SCREEN_DEACTIVATED() { return "onRoundResultScreenDeactivated"; }
	static get EVENT_ON_ROUND_RESULT_SCREEN_SKIPPED() { return "onRoundResultScreenActivationSkipped"; }

	static get EVENT_ON_BACK_TO_LOBBY_ROUND_RESULT_BUTTON_CLICKED() { return RoundResultScreenView.EVENT_ON_BACK_TO_LOBBY_ROUND_RESULT_BUTTON_CLICKED; }
	static get EVENT_ON_NEXT_ROUND_CLICKED() { return RoundResultScreenView.EVENT_ON_NEXT_ROUND_CLICKED; }

	static get ON_COINS_ANIMATION_STARTED() { return RoundResultScreenView.ON_COINS_ANIMATION_STARTED; }
	static get ON_COINS_ANIMATION_COMPLETED() { return RoundResultScreenView.ON_COINS_ANIMATION_COMPLETED; }

	hideTransparentBack()
	{
		this.view.hideTransparentBack();
	}

	showTransparentBack()
	{
		this.view.showTransparentBack();
	}

	showScreen(aSkipAnimation_bl = false)
	{
		this._showScreen(aSkipAnimation_bl);
	}

	hideScreen()
	{
		this._hideScreen();
	}

	onRoundResultResponse(aData_obj)
	{
		this._onRoundResultResponse(aData_obj);
	}

	resetScreenAppearing()
	{
		this._resetScreenAppearing();
	}

	tryToActivateScreen(aForced_bln)
	{
		this._tryToActivateScreen(aForced_bln);
	}

	get isActive()
	{
		let l_rrsv = this.view;

		if (l_rrsv)
		{
			return l_rrsv.visible;
		}

		return false;
	}

	__init()
	{
		super.__init();

		this._fActivationTimer_t = null;
		this._fAwaitingGameUnpause_bl = false;

		this._fActivationDisplayTimerIsOver_bl = null;
		this._fActivationDisplayTimer_t = null;
		this._fNewRoundStarted_bl = null;
	}

	__initControlLevel()
	{
		super.__initControlLevel();

		this._fGameScreen_gs = APP.currentWindow;
		this._fPlayerInfo_gpi = APP.playerController.info;

		this._fGameStateController_gsc = this._fGameScreen_gs.gameStateController;
		this._fGameStateInfo_gsi = this._fGameStateController_gsc.i_getInfo();

		this._fGameBonusController_gbc = this._fGameScreen_gs.gameBonusController;
		this._fGameBonusInfo_gbi = this._fGameBonusController_gbc.i_getInfo();

		APP.currentWindow.gameFrbController.on(GameFRBController.EVENT_ON_FRB_MODE_CHANGED, this._onFRBModeChanged, this);

		this._fGameScreen_gs.on(GameScreen.EVENT_ON_NEW_ROUND_STATE, this._onNewRoundState, this, true);
		this._fGameScreen_gs.on(GameScreen.EVENT_ON_WAITING_NEW_ROUND, this._onWaitingNewRound, this, true);

	}

	__initViewLevel()
	{
		super.__initViewLevel();

		let l_rrsv = this.view;
		l_rrsv.visible = false;

		l_rrsv.position.set(0, 14);

		l_rrsv.on(RoundResultScreenView.EVENT_ON_NEXT_ROUND_CLICKED, this._onNextRoundButtonClicked, this);
		l_rrsv.on(RoundResultScreenView.EVENT_ON_BACK_TO_LOBBY_ROUND_RESULT_BUTTON_CLICKED, this._onBackToLobbyButtonClicked, this);

		l_rrsv.on(RoundResultScreenView.ON_COINS_ANIMATION_STARTED, this.emit, this);
		l_rrsv.on(RoundResultScreenView.ON_COINS_ANIMATION_COMPLETED, this.emit, this);
	}
	//...INIT

	_onFRBModeChanged(e)
	{
		if (this.view)
		{
			this.view.validateCaptions();
		}
	}

	_onRoundResultResponse(aData_obj)
	{
		this.info.playerNickname = this._fPlayerInfo_gpi.nickname;
		this.info.pendingFinalPlayerStats = null;

		this.info.totalDamage = aData_obj.totalDamage || 0;

		this.info.totalKillsCount = aData_obj.enemiesKilledCount || 0;
		this.info.totalFreeShotsCount = aData_obj.freeShotsWon || 0;
		let bulletsFired = aData_obj.bulletsFired || 0;

		this.info.bulletsFiredCount = bulletsFired;

		this.info.playerAvatarData = this._fPlayerInfo_gpi.avatar;
		this.info.listData = this._sortSeatsByDamage(aData_obj.seats);

		this.info.moneyWheelWinsCount = aData_obj.moneyWheelCompleted || 0;
		this.info.moneyWheelPayouts = aData_obj.moneyWheelPayouts || 0;

		this.info.roundId = aData_obj.roundId;
		this.info.roundResultResponseRecieved = true;

		this.info.weaponsSurplus = 0;
		if (aData_obj.weaponSurplus && aData_obj.weaponSurplus.length > 0)
		{
			let lPayout_num = 0;

			for (let i = 0; i < aData_obj.weaponSurplus.length; ++i)
			{
				lPayout_num += aData_obj.weaponSurplus[i].winBonus;
			}

			this.info.weaponsSurplus = lPayout_num;
		}

		this._tryToActivateScreen();
	}

	_resetScreenAppearing()
	{
		let prevStateResponseRecieved = this.info.roundResultResponseRecieved;
		this.info.roundResultResponseRecieved = false;
		this.info.resetRoundId();

		this._fGameStateController_gsc.off(GameStateController.EVENT_ON_GAME_ROUND_STATE_CHANGED, this._tryToActivateScreen, this, true);
		this._fGameScreen_gs.off(GameScreen.EVENT_ON_ROUND_ID_UPDATED, this._onRoundIdChanged, this, true);

		if (!!prevStateResponseRecieved)
		{
			this.emit(RoundResultScreenController.EVENT_ON_ROUND_RESULT_SCREEN_SKIPPED);
		}
	}

	_sortSeatsByDamage(aSeats_arr)
	{
		var len = aSeats_arr.length;

		for (var i = 0; i < len; i++)
		{
			for (var j = 0; j < len - i - 1; j++)
			{
				if (aSeats_arr[j].totalDamage < aSeats_arr[j + 1].totalDamage)
				{
					var lTmp_obj = aSeats_arr[j];
					aSeats_arr[j] = aSeats_arr[j + 1];
					aSeats_arr[j + 1] = lTmp_obj;
				}
			}
		}
		return aSeats_arr;
	}

	_tryToActivateScreen(aForced_bln = false)
	{
		if (this._fGameScreen_gs.isPaused)
		{
			if (!this._fAwaitingGameUnpause_bl)
			{
				this._fAwaitingGameUnpause_bl = true;
				this._fGameScreen_gs.once(GameScreen.EVENT_ON_ROOM_UNPAUSED, this._onRoomUnpaused, this);
			}
			return;
		}

		this._fGameStateController_gsc.off(GameStateController.EVENT_ON_GAME_ROUND_STATE_CHANGED, this._tryToActivateScreen, this, true);
		this._fGameScreen_gs.off(GameScreen.EVENT_ON_ROUND_ID_UPDATED, this._onRoundIdChanged, this, true);

		let lGameRoundId_num = APP.currentWindow.room ? APP.currentWindow.room.roundId : null;
		if (
				!this._fGameStateInfo_gsi.isGameInProgress
				|| aForced_bln
				|| (lGameRoundId_num !== this.info.roundId)
			)
		{
			this._showScreen();
		}
		else
		{
			this._fGameScreen_gs.once(GameScreen.EVENT_ON_ROUND_ID_UPDATED, this._onRoundIdChanged, this, true);
			this._fGameStateController_gsc.once(GameStateController.EVENT_ON_GAME_ROUND_STATE_CHANGED, this._tryToActivateScreen, this);
		}
	}

	_onRoundIdChanged(event)
	{
		if (this.info.roundResultResponseRecieved)
		{
			this._tryToActivateScreen();
		}
	}

	_onRoomUnpaused(aEvent_obj)
	{
		if (this._fAwaitingGameUnpause_bl)
		{
			this._fAwaitingGameUnpause_bl = false;
			this._showScreen(true);
		}
	}

	_onNextRoundButtonClicked(aData_obj)
	{
		this.emit(RoundResultScreenController.EVENT_ON_NEXT_ROUND_CLICKED);
		this._hideScreen();
	}

	_onBackToLobbyButtonClicked()
	{
		this.emit(RoundResultScreenController.EVENT_ON_BACK_TO_LOBBY_ROUND_RESULT_BUTTON_CLICKED);
	}

	_showScreen(aSkipAnimation_bl = false)
	{
		this.emit(RoundResultScreenController.EVENT_ON_ROUND_RESULT_SCREEN_ACTIVATION_START);

		if (!APP.currentWindow.isKeepSWModeActive)
		{
			if (!APP.currentWindow.gameFrbController.info.frbMode)
			{
				APP.gameScreen.gameField.resetPlayerWin();
			}

			// https://jira.dgphoenix.com/browse/MQPRT-375
			this._fActivationTimer_t && this._fActivationTimer_t.destructor();
			this._fActivationTimer_t = new Timer(()=>this._showScreenImmediately(aSkipAnimation_bl), 120);
		}
		else
		{
			this._showScreenImmediately(aSkipAnimation_bl);
		}
	}

	_showScreenImmediately(aSkipAnimation_bl)
	{
		this._fActivationTimer_t && this._fActivationTimer_t.destructor();
		this._fActivationTimer_t = null;

		this.info.roundResultResponseRecieved = false;
		this.info.resetRoundId();

		this._fGameStateController_gsc.off(GameStateController.EVENT_ON_GAME_ROUND_STATE_CHANGED, this._tryToActivateScreen, this, true);
		this._fGameScreen_gs.off(GameScreen.EVENT_ON_ROUND_ID_UPDATED, this._onRoundIdChanged, this, true);

		this._fActivationDisplayTimerIsOver_bl = false;
		this._fActivationDisplayTimer_t = new Timer(()=>this._timeDisplayIsOver(aSkipAnimation_bl), 3000);

		let l_rrsv = this.view;
		if (l_rrsv)
		{
			if (this._fNewRoundStarted_bl && !this._fActivationDisplayTimerIsOver_bl)
			{
				l_rrsv.showNextButton();
			}
			else
			{
				l_rrsv.showWaitingCaption();
			}

			l_rrsv.show(aSkipAnimation_bl);
			this.emit(RoundResultScreenController.EVENT_ON_ROUND_RESULT_SCREEN_ACTIVATED);
		}
	}

	_timeDisplayIsOver()
	{
		this._fActivationDisplayTimerIsOver_bl = true;
		this._fActivationDisplayTimer_t && this._fActivationDisplayTimer_t.destructor();
		this._fActivationDisplayTimer_t = null;

		if (this._fNewRoundStarted_bl)
		{
			this._hideScreen();
		}
	}
	
	_onNewRoundState(data)
	{
		let lRoundState_bl =  data.state == ROUND_STATE.QUALIFY ? false : data.state;
		this._fNewRoundStarted_bl = lRoundState_bl;

		if (lRoundState_bl)
		{
			if (this._fActivationDisplayTimerIsOver_bl)
			{
				this._hideScreen();
	
				this._fActivationDisplayTimerIsOver_bl = false;
	
				this._fActivationDisplayTimer_t && this._fActivationDisplayTimer_t.destructor();
				this._fActivationDisplayTimer_t = null;
			}
			else 
			{
				this.view.showNextButton();
			}

		}

	}

	_onWaitingNewRound()
	{
		this.view.showWaitingCaption();
	}

	_hideScreen()
	{
		this._fActivationTimer_t && this._fActivationTimer_t.destructor();
		this._fActivationTimer_t = null;

		this._fActivationDisplayTimerIsOver_bl = false;

		let l_rrsv = this.view;
		if (l_rrsv && l_rrsv.visible)
		{
			l_rrsv.stopAllAnimation();
			l_rrsv.visible = false;
			this.emit(RoundResultScreenController.EVENT_ON_ROUND_RESULT_SCREEN_DEACTIVATED);
		}
	}

	destroy()
	{
		this._fActivationTimer_t && this._fActivationTimer_t.destructor();
		this._fActivationTimer_t = null;

		if (this._fGameStateController_gsc)
		{
			this._fGameStateController_gsc.off(GameStateController.EVENT_ON_GAME_ROUND_STATE_CHANGED, this._tryToActivateScreen, this, true);
		}
		this._fGameStateController_gsc = null;
		this._fGameStateInfo_gsi = null;

		this._fGameBonusController_gbc = null;
		this._fGameBonusInfo_gbi = null;

		APP.currentWindow.gameFrbController.off(GameFRBController.EVENT_ON_FRB_MODE_CHANGED, this._onFRBModeChanged, this);

		if (this._fGameScreen_gs)
		{
			this._fGameScreen_gs.off(GameScreen.EVENT_ON_ROOM_UNPAUSED, this._onRoomUnpaused, this);
			this._fGameScreen_gs.off(GameScreen.EVENT_ON_ROUND_ID_UPDATED, this._onRoundIdChanged, this, true);
		}
		this._fGameScreen_gs = null;
		this._fPlayerInfo_gpi = null;

		this._fAwaitingGameUnpause_bl = false;

		this._fActivationDisplayTimerIsOver_bl = null;
		this._fActivationDisplayTimer_t = null;
		this._fNewRoundStarted_bl = null;

		super.destroy();
	}
}

export default RoundResultScreenController;
