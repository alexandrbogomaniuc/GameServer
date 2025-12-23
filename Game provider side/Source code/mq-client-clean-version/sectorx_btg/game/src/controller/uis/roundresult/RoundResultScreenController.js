import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import SimpleUIController from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/uis/base/SimpleUIController';

import RoundResultScreenView from '../../../view/uis/roundresult/RoundResultScreenView';
import GameStateController from '../../state/GameStateController';
import GameScreen from '../../../main/GameScreen';
import GamePlayerController from '../../custom/GamePlayerController';
import Timer from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import GameFRBController from './../custom/frb/GameFRBController';
import GameBonusController from '../../../controller/uis/custom/bonus/GameBonusController';
import GameWebSocketInteractionController from '../../interaction/server/GameWebSocketInteractionController';
import GameExternalCommunicator, {GAME_MESSAGES, LOBBY_MESSAGES} from '../../external/GameExternalCommunicator';
import {ROUND_STATE} from '../../../model/state/GameStateInfo';
import TransitionViewController from '../transition/TransitionViewController';
import BattlegroundResultScreenView from '../../../view/uis/roundresult/battleground/BattlegroundResultScreenView';
import { DIALOG_ID_NO_WEAPONS_FIRED } from '../../../../../shared/src/CommonConstants';
import CafPrivateRoundCountDownDialogController from '../custom/gameplaydialogs/custom/CafPrivateRoundCountDownDialogController';

class RoundResultScreenController extends SimpleUIController
{
	static get EVENT_ON_ROUND_RESULT_SCREEN_ACTIVATED() { return "onRoundResultScreenActivated"; }
	static get EVENT_ON_ROUND_RESULT_SCREEN_ACTIVATION_START() { return "onRoundResultScreenActivationStart"; }	
	
	static get EVENT_ON_FAILED_TO_SHOW_ROUND_RESULT_SCREEN_DUE_TO_WEAPONS_NO_FIRED_IS_ACTIVE() { return "onFailedToShowRRDueToWeaponsNoFiredIsActive"; }

	static get EVENT_ON_ROUND_RESULT_SCREEN_DEACTIVATED() { return "onRoundResultScreenDeactivated"; }
	static get EVENT_ON_ROUND_RESULT_SCREEN_SKIPPED() { return "onRoundResultScreenActivationSkipped"; }

	static get EVENT_ON_BACK_TO_LOBBY_ROUND_RESULT_BUTTON_CLICKED() { return RoundResultScreenView.EVENT_ON_BACK_TO_LOBBY_ROUND_RESULT_BUTTON_CLICKED; }
	static get EVENT_ON_NEXT_ROUND_CLICKED() { return RoundResultScreenView.EVENT_ON_NEXT_ROUND_CLICKED; }

	static get ON_COINS_ANIMATION_STARTED() { return RoundResultScreenView.ON_COINS_ANIMATION_STARTED; }
	static get ON_COINS_ANIMATION_COMPLETED() { return RoundResultScreenView.ON_COINS_ANIMATION_COMPLETED; }

	static get EVENT_ON_BATTLEGROUND_NEXT_ROUND_CLICKED() { return "EVENT_ON_BATTLEGROUND_NEXT_ROUND_CLICKED"; }
	static get EVENT_ON_NEED_TRANSITION_BEFORE_ROUND_RESULT_SCREEN_ACTIVATED() { return "EVENT_ON_NEED_TRANSITION_BEFORE_ROUND_RESULT_SCREEN_ACTIVATED"; }

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

	checkActivateScreenAfterConnectionOpen()
	{
		if (this.info.roundResultResponseRecieved)
		{
			this._tryToActivateScreen();
		}
		else if (this._fIsNeedShowScreenAfterTransitionIntro_bl)
		{
			this._showScreen(true);
		}
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

	get isActiveOrActivationInProgress()
	{
		return this.info.isScreenActive
				|| this.info.roundResultResponseRecieved
				|| !!this._fActivationTimer_t
				|| !!this._fIsNeedShowScreenAfterTransitionIntro_bl;
	}

	__init()
	{
		super.__init();

		this._fActivationTimer_t = null;
		this._fAwaitingGameUnpause_bl = false;

		this._fActivationDisplayTimerIsOver_bl = null;
		this._fActivationDisplayTimer_t = null;
		this._fIsRoundInProgress_bl = null;
		this._fIsNeedFullGameInfoUpdateOnGameState_bl = null;

		this._fTimeInterval = null;

		this._fIsTimeToStartUpdateExpeted_bl = null;

		this._fIsNeedShowScreenAfterTransitionIntro_bl = null;
		this._fIsNeedSkipScreenAfterTransitionIntro_bl = null;
		this._fIsRoundResultOnAwaitingGameUnpause_bl = null;

		//document.addEventListener("keydown", this._showDebugScreen.bind(this));
	}

	_showDebugScreen(aSkipAnimation_bl = true, aRoundResultOnAwaitingGameUnpause = false)
	{
		this._fActivationTimer_t && this._fActivationTimer_t.destructor();
		this._fActivationTimer_t = null;

		this.info.roundResultResponseRecieved = false;
		this.info.resetRoundId();

		this._fGameStateController_gsc.off(GameStateController.EVENT_ON_GAME_ROUND_STATE_CHANGED, this._tryToActivateScreen, this, true);
		this._fGameScreen_gs.off(GameScreen.EVENT_ON_ROUND_ID_UPDATED, this._onRoundIdChanged, this, true);

		this._fActivationDisplayTimerIsOver_bl = false;
		let lActivationDisplayTimerDuration_num = this.info.isActiveScreenMode ? 3000 : 1;
		this._fActivationDisplayTimer_t = new Timer(()=>this._timeDisplayIsOver(aSkipAnimation_bl), lActivationDisplayTimerDuration_num);

		let l_rrsv = this.view;

		l_rrsv.showNextButton();
		l_rrsv.show(aSkipAnimation_bl);
		
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
		this._fGameScreen_gs.on(GameScreen.EVENT_ON_ROOM_UNPAUSED, this._onRoomUnpaused, this);
		this._fGameScreen_gs.on(GameScreen.EVENT_ON_ROOM_PAUSED, this._onRoomPaused, this);
		this._fGameScreen_gs.on(GameScreen.EVENT_ON_BATTLEGROUND_ROUND_CANCELED, this._onCancelBattlegroundRound, this);

		this._fTransitionViewController_tvc = this._fGameScreen_gs.transitionViewController;

		this._fGameScreen_gs.on(GameScreen.EVENT_ON_SERVER_MESSAGE_GAME_STATE_CHANGED, this._onServerMessage, this);
		
	}

	__initViewLevel()
	{
		super.__initViewLevel();

		let l_rrsv = this.view;
		l_rrsv.visible = false;

		l_rrsv.on(RoundResultScreenView.EVENT_ON_NEXT_ROUND_CLICKED, this._onNextRoundButtonClicked, this);
		l_rrsv.on(RoundResultScreenView.EVENT_ON_BACK_TO_LOBBY_ROUND_RESULT_BUTTON_CLICKED, this._onBackToLobbyButtonClicked, this);

		l_rrsv.on(RoundResultScreenView.ON_COINS_ANIMATION_STARTED, this.emit, this);
		l_rrsv.on(RoundResultScreenView.ON_COINS_ANIMATION_COMPLETED, this.emit, this);
	
		APP.externalCommunicator.on(GameExternalCommunicator.LOBBY_MESSAGE_RECEIVED, this._onLobbyExternalMessageReceived, this);
		APP.gameScreen.gameplayDialogsController.gameCafPrivateRoundCountDownDialogController.on(CafPrivateRoundCountDownDialogController.EVENT_ON_SCREEN_ACTIVATED, this._roundStateChanged, this);
	}
	//...INIT
	_roundStateChanged(event) {
        if (this.view.visible) {
            this._hideScreen();
        }
    }

	_onFRBModeChanged(e)
	{
	}

	_onLobbyExternalMessageReceived(event)
	{
		let msgType = event.type;
		switch (msgType)
		{
			case LOBBY_MESSAGES.BATTLEGROUND_PLAY_AGAIN_CONFIRMED:
				this.emit(RoundResultScreenController.EVENT_ON_NEXT_ROUND_CLICKED);
				this._hideScreen();
				this._resetScreenAppearing();
				break;

		}
	}

	_onRoundResultResponse(aData_obj)
	{
		//DEBUG...
		/*
		aData_obj.battlegroundRoundResult =
		[
 			{
 				"id": 0,
 				"score": 30000,
 				"rank": 0,
 				"pot": 3960
 			},
 			{
 				"id": 1,
 				"score": 20000,
 				"rank": 1,
 				"pot": 3960
 			},
 			{
 				"id": 2,
 				"score": 10000,
 				"rank": 3,
 				"pot": 3960
 			},
		];
		*/
		//...DEBUG

		//APPENDING BATTLEGROUND INFO TO CORRESPONDENT SEATS...
		let lBattlegroundInfo_obj_arr = aData_obj.battlegroundRoundResult;
		let lBattlegroundPlayerInfo_obj = null;

		if(lBattlegroundInfo_obj_arr)
		{
			let lWinnersCount = 0;
			for( let i = 0; i < lBattlegroundInfo_obj_arr.length; i++ )
			{
				let l_obj = lBattlegroundInfo_obj_arr[i];
				let lSeatId_int = l_obj.id;

				if ( (l_obj.pot > 0)&&(l_obj.score > 0) )
				{
					lWinnersCount += 1;
				}

				for( let j = 0; j < lBattlegroundInfo_obj_arr.length; j++ )
				{
					if(aData_obj.seats[j].id === lSeatId_int)
					{
						aData_obj.seats[j].battlegroundInfo = l_obj;

						if(aData_obj.seats[j].nickname === this._fPlayerInfo_gpi.nickname)
						{
							lBattlegroundPlayerInfo_obj = l_obj;
						}

						break;
					}
				}
			}
			this.info.winnersCount = lWinnersCount;
		}
		//...APPENDING BATTLEGROUND INFO TO CORRESPONDENT SEATS

		this.info.playerNickname = this._fPlayerInfo_gpi.nickname;
		this.info.pendingFinalPlayerStats = null;

		this.info.totalDamage = (lBattlegroundPlayerInfo_obj ? lBattlegroundPlayerInfo_obj.score : aData_obj.totalDamage) || 0;		
		this.info.totalKillsCount = aData_obj.enemiesKilledCount || 0;
		this.info.totalFreeShotsCount = aData_obj.freeShotsWon || 0;
		let bulletsFired = aData_obj.bulletsFired || 0;
		let playerWonValue = aData_obj.realWinAmount || 0;

		this.info.bulletsFiredCount = bulletsFired;
		this.info.playerWonValue = playerWonValue;
		this.info.playerAvatarData = this._fPlayerInfo_gpi.avatar;

		if (lBattlegroundPlayerInfo_obj && aData_obj.battlegroundRoundResult)
		{
			let lIsPlayerWon_bl = lBattlegroundPlayerInfo_obj && lBattlegroundPlayerInfo_obj.pot ? (lBattlegroundPlayerInfo_obj.pot > 0)&&(lBattlegroundPlayerInfo_obj.score > 0) : false;
			let lTotalPrize_num = lBattlegroundPlayerInfo_obj.pot ? lBattlegroundPlayerInfo_obj.pot : 0;
			this.info.isPlayerWon = lIsPlayerWon_bl;
			this.info.playerTotalPrize = lTotalPrize_num / 100;
			this.info.winnerNickname = "";

			if (!lIsPlayerWon_bl)
			{
				let lWinnerNickname_str = null;
				let lWinnerSeatId_num = parseInt(aData_obj.battlegroundRoundResult[0].id);

				for (let i = 0;  i < aData_obj.seats.length; i++)
				{
					if (parseInt(aData_obj.seats[i].id) == lWinnerSeatId_num)
					{
						lWinnerNickname_str = aData_obj.seats[i].nickname;
						break;
					}
				}
				this.info.winnerNickname = lWinnerNickname_str;
			}
		}
		else
		{
			this.info.isPlayerWon = false;
			this.info.playerTotalPrize = 0;
			this.info.winnerNickname = "";
		}

		let lListData_arr = undefined;

		lListData_arr = this._sortSeatsByBattlegroundRank(aData_obj.seats);
		
		this.info.listData = lListData_arr;

		this.info.questsCompletedCount = aData_obj.questsCompletedCount || 0;
		this.info.questsPayouts = aData_obj.questsPayouts || 0;

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
		this._fIsNeedShowScreenAfterTransitionIntro_bl = false;
		this.info.resetRoundId();

		this._fGameStateController_gsc.off(GameStateController.EVENT_ON_GAME_ROUND_STATE_CHANGED, this._tryToActivateScreen, this, true);
		this._fGameScreen_gs.off(GameScreen.EVENT_ON_ROUND_ID_UPDATED, this._onRoundIdChanged, this, true);

		if (!!prevStateResponseRecieved)
		{
			this.emit(RoundResultScreenController.EVENT_ON_ROUND_RESULT_SCREEN_SKIPPED);
		}
	}

	_sortSeatsByBattlegroundRank(aSeats_arr)
	{
		for( var i = 0; i < aSeats_arr.length; i++ )
		{
			if(aSeats_arr[i].battlegroundInfo === undefined)
			{
				aSeats_arr.splice(i, 1);
				i--;
				APP.logger.i_pushError(`RoundResultScreenController. Player id without battlegroundInfo: ${i}!`);
			}
		}
		
		var len = aSeats_arr.length;

		for (var i = 0; i < len; i++)
		{
			for (var j = 0; j < len - i - 1; j++)
			{
				if (aSeats_arr[j].battlegroundInfo.rank > aSeats_arr[j + 1].battlegroundInfo.rank)
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
			this._fAwaitingGameUnpause_bl = true;
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

	_tick()
	{
	}

	_onRoundIdChanged(event)
	{
		if (this.info.roundResultResponseRecieved)
		{
			this._tryToActivateScreen();
		}
	}

	_onRoomPaused(aEvent_obj)
	{
		if (this._fIsNeedShowScreenAfterTransitionIntro_bl)
		{
			this._fAwaitingGameUnpause_bl = true;
		}
	}

	_onRoomUnpaused(aEvent_obj)
	{
		if (
				!this.info.isBattlegroundRoundCancelled	
			&&
				(this._fGameStateInfo_gsi.gameState != ROUND_STATE.PLAY) 
			&&
				(this._fAwaitingGameUnpause_bl || this.info.roundResultResponseRecieved)
		)
		{
			this._fAwaitingGameUnpause_bl = false;
			this._showScreen(true, true);
		}
	}

	_onCancelBattlegroundRound()
	{
		this.info.isBattlegroundRoundCancelled = true;
		
		if(this._fGameStateInfo_gsi.gameState != ROUND_STATE.WAIT)
		{
			this._hideScreen();
			this._resetScreenAppearing();
		}
	}

	_onServerMessage(aEvent_obj)
	{
		switch (aEvent_obj.state)
		{
			case ROUND_STATE.PLAY:
				this.info.isBattlegroundRoundCancelled = false;
				break;
			default:
				break;
		}
	}

	_onNextRoundButtonClicked(aData_obj)
	{
		this.emit(RoundResultScreenController.EVENT_ON_BATTLEGROUND_NEXT_ROUND_CLICKED);
		return;
	}

	_onBackToLobbyButtonClicked()
	{
		this._hideScreen();
		APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.BATTLEGROUND_BACK_TO_MQB_LOBBY);
	}

	_showScreen(aSkipAnimation_bl = false, aRoundResultOnAwaitingGameUnpause = false)
	{
		if (APP.isDialogActive(DIALOG_ID_NO_WEAPONS_FIRED))
		{
			this.emit(RoundResultScreenController.EVENT_ON_FAILED_TO_SHOW_ROUND_RESULT_SCREEN_DUE_TO_WEAPONS_NO_FIRED_IS_ACTIVE);
			this._hideScreen();
			return;
		}

		this.emit(RoundResultScreenController.EVENT_ON_ROUND_RESULT_SCREEN_ACTIVATION_START);
		
		

		setTimeout(()=>{
			const bossSequenceActive = APP.currentWindow.bossModeController.bossSequenceCompleted;
			if (APP.isBattlegroundGame &&( APP.gameScreen.isScoreboardAnimationsPlaying || bossSequenceActive))
				{
					// https://jira.dgphoenix.com/browse/MQPRT-375
					this._fActivationTimer_t && this._fActivationTimer_t.destructor();
					const delayTime = bossSequenceActive ? 7000 : 120; 
					this._fActivationTimer_t = new Timer(()=>this._showScreenImmediately(aSkipAnimation_bl, aRoundResultOnAwaitingGameUnpause), delayTime);
				}
				else
				{
					this._showScreenImmediately(aSkipAnimation_bl, aRoundResultOnAwaitingGameUnpause);
				}
		}, 600);
		
	}

	_showScreenImmediately(aSkipAnimation_bl, aRoundResultOnAwaitingGameUnpause = false)
	{
		this._fActivationTimer_t && this._fActivationTimer_t.destructor();
		this._fActivationTimer_t = null;

		this.info.roundResultResponseRecieved = false;
		this.info.resetRoundId();

		this._fGameStateController_gsc.off(GameStateController.EVENT_ON_GAME_ROUND_STATE_CHANGED, this._tryToActivateScreen, this, true);
		this._fGameScreen_gs.off(GameScreen.EVENT_ON_ROUND_ID_UPDATED, this._onRoundIdChanged, this, true);

		this._fActivationDisplayTimerIsOver_bl = false;
		let lActivationDisplayTimerDuration_num = this.info.isActiveScreenMode ? 3000 : 1;
		this._fActivationDisplayTimer_t = new Timer(()=>this._timeDisplayIsOver(aSkipAnimation_bl), lActivationDisplayTimerDuration_num);

		let l_rrsv = this.view;
		if (l_rrsv)
		{
			if (this._fIsRoundInProgress_bl && !this._fActivationDisplayTimerIsOver_bl)
			{
				l_rrsv.showNextButton();
			}
			else
			{
				l_rrsv.showWaitingCaption();
			}

			this._fIsNeedShowScreenAfterTransitionIntro_bl = true;
			this._fIsNeedSkipScreenAfterTransitionIntro_bl = aSkipAnimation_bl;
			this._fIsRoundResultOnAwaitingGameUnpause_bl = aRoundResultOnAwaitingGameUnpause;
			
			if (!this.info.isScreenActive)
			{
				this._fTransitionViewController_tvc.once(TransitionViewController.EVENT_ON_TRANSITION_INTRO_COMPLETED, this._onTransitionIntroCompleted, this);
				this.emit(RoundResultScreenController.EVENT_ON_NEED_TRANSITION_BEFORE_ROUND_RESULT_SCREEN_ACTIVATED);
			}
			else
			{
				this._showScreenAfterTransitionIntro(true);
			}
		}
	}

	_onTransitionIntroCompleted()
	{
		if (this._fIsNeedShowScreenAfterTransitionIntro_bl)
		{
			this._showScreenAfterTransitionIntro();
		}
	}

	_showScreenAfterTransitionIntro(aSkipTransitionIntro_bl = false)
	{
		if (APP.isDialogActive(DIALOG_ID_NO_WEAPONS_FIRED))
		{
			this._hideScreen();
			this._resetScreenAppearing();
			this.emit(RoundResultScreenController.EVENT_ON_FAILED_TO_SHOW_ROUND_RESULT_SCREEN_DUE_TO_WEAPONS_NO_FIRED_IS_ACTIVE);
			return;
		}

		if (this._fIsNeedShowScreenAfterTransitionIntro_bl || aSkipTransitionIntro_bl)
		{
			this._fIsNeedShowScreenAfterTransitionIntro_bl = false;
			this.info.isScreenActive = true;
			let l_rrsv = this.view;
			if (l_rrsv)
			{
				l_rrsv.show(this._fIsNeedSkipScreenAfterTransitionIntro_bl);
				l_rrsv.startPanelAnimation(this._fIsNeedSkipScreenAfterTransitionIntro_bl);
				this.emit(RoundResultScreenController.EVENT_ON_ROUND_RESULT_SCREEN_ACTIVATED, {roundResultOnAwaitingGameUnpause: this._fIsRoundResultOnAwaitingGameUnpause_bl, needStartSummary: !this.info.isPlayerWon, isSkipIntro_bl: aSkipTransitionIntro_bl});
				l_rrsv.once(BattlegroundResultScreenView.ON_MAIN_PANEL_ANIMATION_COMPLETE, this._onMainPanelAnimationCompleted, this)
			}
		}
	}

	_onMainPanelAnimationCompleted()
	{
		let lParams_obj = {
			roundResultOnAwaitingGameUnpause: this._fIsRoundResultOnAwaitingGameUnpause_bl,
			needStartSummary: true
		};

		this.emit(RoundResultScreenController.EVENT_ON_ROUND_RESULT_SCREEN_ACTIVATED, lParams_obj);
	}

	_timeDisplayIsOver()
	{
		this._fActivationDisplayTimerIsOver_bl = true;
		this._fActivationDisplayTimer_t && this._fActivationDisplayTimer_t.destructor();
		this._fActivationDisplayTimer_t = null;

		if (this._fIsRoundInProgress_bl)
		{
			if (APP.isBattlegroundGame
				&& !APP.gameScreen.battlegroundGameController.info.isPlayerClickedConfirmPlayForNextBattlegroundRound)
			{
				return;
			}

			this._hideScreen();
		}
	}

	_onNewRoundState(data)
	{
		if (APP.isBattlegroundGame
			&& !APP.gameScreen.battlegroundGameController.info.isPlayerClickedConfirmPlayForNextBattlegroundRound)
		{
			return;
		}

		let lIsRoundInProgress_bl =  data.state;
		this._fIsRoundInProgress_bl = lIsRoundInProgress_bl;

		if (lIsRoundInProgress_bl)
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
		
		this.info.isScreenActive = false;
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
			this._fGameScreen_gs.off(GameScreen.EVENT_ON_ROOM_PAUSED, this._onRoomPaused, this);
			this._fGameScreen_gs.off(GameScreen.EVENT_ON_ROUND_ID_UPDATED, this._onRoundIdChanged, this, true);
		}
		this._fGameScreen_gs = null;
		this._fPlayerInfo_gpi = null;

		this._fAwaitingGameUnpause_bl = false;

		this._fActivationDisplayTimerIsOver_bl = null;
		this._fActivationDisplayTimer_t = null;
		this._fIsRoundInProgress_bl = null;
		this._fIsNeedFullGameInfoUpdateOnGameState_bl = null;

		this._fIsNeedShowScreenAfterTransitionIntro_bl = null;
		this._fIsNeedSkipScreenAfterTransitionIntro_bl = null;
		this._fIsRoundResultOnAwaitingGameUnpause_bl = null;
		this._fTransitionViewController_tvc = null;

		super.destroy();
	}
	
}

export default RoundResultScreenController;
