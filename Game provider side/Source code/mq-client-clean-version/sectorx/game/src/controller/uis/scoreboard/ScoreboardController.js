import SimpleUIController from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/uis/base/SimpleUIController';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import GameScreen from '../../../main/GameScreen';
import { ROUND_STATE } from '../../../model/state/GameStateInfo';
import ScoreboardInfo from '../../../model/uis/scoreboard/ScoreboardInfo';
import ScoreboardView from '../../../view/uis/scoreboard/ScoreboardView';
import GameWebSocketInteractionController from '../../interaction/server/GameWebSocketInteractionController';
import GameStateController from '../../state/GameStateController';
import AwardingController from '../awarding/AwardingController';
import BigWinsController from '../awarding/big_win/BigWinsController';
import BossModeController from '../custom/bossmode/BossModeController';
import BattlegroundFinalCountingController from '../final_counting/BattlegroundFinalCountingController';
import RoundResultScreenController from '../roundresult/RoundResultScreenController';

class ScoreboardController extends SimpleUIController
{
	static get EVENT_ON_SCORE_BOARD_TIME_IS_OVER() 				{ return "EVENT_ON_SCORE_BOARD_TIME_IS_OVER";}
	static get EVENT_ON_SCORE_BOARD_START_HIDE_ON_ROUND_RESULT() 	{ return "EVENT_ON_SCORE_BOARD_START_HIDE_ON_ROUND_RESULT";}	

	constructor()
	{
		super(new ScoreboardInfo(), new ScoreboardView());

		this._fBattlegroundFinalCountingController_bfcc = null;
		this._fBattlegroundFinalCountingInfo_bfci = null;
		//DEBUG...
		//this._startShow();
		//...DEBUG
	}

	get _isBossSubround()
	{
		return APP.gameScreen.gameStateController.info.isBossSubround;
	}

	__initControlLevel()
	{
		super.__initControlLevel();

		APP.webSocketInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_FULL_GAME_INFO_MESSAGE, this._onServerGetRoomInfoResponseMessage, this);
		APP.webSocketInteractionController.on(GameWebSocketInteractionController.EVENT_BATTLEGROUND_SCORE_BOARD, this._onScoreboardUpdated, this);
		
		APP.currentWindow.bossModeController.on(BossModeController.EVENT_APPEARING_STARTED, this._onBossRoundStarted, this);

		APP.gameScreen.on(GameScreen.EVENT_ON_ROOM_FIELD_CLEARED, this._onGameFieldCleared, this);
		APP.gameScreen.awardingController.on(AwardingController.EVENT_ON_PAYOUT_IS_VISIBLE, this._onTimeToShowAward, this);
		// APP.gameScreen.bigWinsController.on(BigWinsController.EVENT_BIG_WIN_PRESETNTATION_STARTED, this._onTimeToShowAward, this);
		APP.gameScreen.bigWinsController.on(BigWinsController.EVENT_ON_PENDING_BIG_WINS_SKIPPED, this._onTimeToShowAward, this);

		this._fGameStateController_gsc = APP.currentWindow.gameStateController;
		this._fGameStateInfo_gsi = this._fGameStateController_gsc.info;
		this._fGameStateController_gsc.on(GameStateController.EVENT_ON_GAME_STATE_CHANGED, this._onGameRoundStateChanged, this);
		this._fGameStateController_gsc.on(GameStateController.EVENT_ON_PLAYER_SEAT_STATE_CHANGED, this._onPlayerSeatStateChanged, this);
	
		this._fBattlegroundFinalCountingController_bfcc = APP.gameScreen.gameFieldController.battlegroundFinalCountingController;
		this._fBattlegroundFinalCountingInfo_bfci = this._fBattlegroundFinalCountingController_bfcc.info;
		this._fBattlegroundFinalCountingController_bfcc.on(BattlegroundFinalCountingController.EVENT_ON_BATTLEGROUND_FINAL_COUNTING_COMPLETED, this._needScoreboardTimeUpdated, this);
	
		this._fRoundResultScreenController_rrsc = APP.gameScreen.gameFieldController.roundResultScreenController;
		this._fRoundResultScreenController_rrsc.on(RoundResultScreenController.EVENT_ON_ROUND_RESULT_SCREEN_ACTIVATED, this._onRoundResultScreenActivated, this);
	}

	__initViewLevel()
	{
		super.__initViewLevel();

		this.view.on(ScoreboardView.EVENT_ON_TIME_IS_OVER, this._onTimerIsOver, this);

		this._invalidateView();
	}

	_onTimerIsOver()
	{
		this.emit(ScoreboardController.EVENT_ON_SCORE_BOARD_TIME_IS_OVER);
	}

	_onGameFieldCleared()
	{
		this.view && this.view.i_interruptAnimations();

		if (this.info.isUpdateLockedOnBattlegroundRoundResultExpected)
		{
			return;
		}
		this.view && this.view.i_resetScoreboard();
	}

	_onBigWinAwardSkipped(aEvent_obj)
	{
		let lAddScoreData_obj = {
			seatId: APP.currentWindow.player.seatId,
			value: aEvent_obj.skippedPendingBigWinsValue,
			isBoss: aEvent_obj.isBoss
		};

		this._onTimeToShowAward(lAddScoreData_obj);
	}

	_onTimeToShowAward(aEvent_obj)
	{
		let lScoreData_obj = {
			seatId: aEvent_obj.seatId,
			win: aEvent_obj.value || aEvent_obj.money || aEvent_obj.score
		};

		if (aEvent_obj.isBoss)
		{
			this.view && this.view.i_addBossRoundScore(lScoreData_obj);
		}
		else
		{	
			this.view && this.view.i_addScore(lScoreData_obj);
		}
	}

	_needScoreboardTimeUpdated()
	{
		if (this.info.roundEndTime)
		{
			this.view && this.view.i_setTimerLock(false);
			this.view && this.view.i_updateTimer(this.info.roundEndTime);
		}
	}

	_onScoreboardUpdated(aData_obj)
	{
		if (!this.info.isUpdateLockedOnBattlegroundRoundResultExpected)
		{

			this.info && this.info.i_updateScoresData(aData_obj.messageData.scoreBySeatId, aData_obj.messageData.scoreBossBySeatId);

			this.view && this.view.i_updatePlayersBetsInfo(aData_obj.messageData.scoreBySeatId);

			if (APP.isBattlegroundGame && !this._fBattlegroundFinalCountingInfo_bfci.isFinalCountingStarted)
			{
				this.view && this.view.i_updateTimer(aData_obj.messageData.endTime);
			}
			else
			{
				this.view && this.view.i_setTimerLock(true);
			}
		}

		this.info.roundEndTime = aData_obj.messageData.endTime;

		if (aData_obj.messageData.endTime - APP.gameScreen.currentTime <= 0)
		{
			if (!this.info.isRoundTimeIsOver)
			{
				this.info.isRoundTimeIsOver = true;
			}
		}
		else if (this.info.isRoundTimeIsOver)
		{
			this.info.isRoundTimeIsOver = false;
		}
	}

	_onServerGetRoomInfoResponseMessage(aData_obj)
	{
		if (this.info.isUpdateLockedOnBattlegroundRoundResultExpected
			|| aData_obj.messageData.state == ROUND_STATE.QUALIFY)
		{
			return;
		}
		
		let lSeatsData_obj_arr = aData_obj.messageData.seats.slice();

		this.view && this.view.i_updatePlayersInfo(lSeatsData_obj_arr);

		this.info && this.info.i_updateSeatsData(lSeatsData_obj_arr);
		this._invalidateView();
	}

	_onBossRoundStarted(aEvent_obj, aOptSkipAnimation_bl)
	{
		this._fIsScoreBoardBossRoundPanelAnimating_bl = !aOptSkipAnimation_bl;
		this.view.i_showBossRoundPanel(aOptSkipAnimation_bl);
		APP.currentWindow.bossModeController.once(BossModeController.EVENT_ON_BOSS_WIN_MULTIPLIER_LANDED, this._onTimeToCalculateBossRoundWins, this);
		APP.currentWindow.bossModeController.once(BossModeController.EVENT_DISAPPEARING_PRESENTATION_COMPLETED, this._onTimeToCalculateBossRoundWins, this);
	}

	_onTimeToCalculateBossRoundWins()
	{
		APP.currentWindow.bossModeController.off(BossModeController.EVENT_ON_BOSS_WIN_MULTIPLIER_LANDED, this._onTimeToCalculateBossRoundWins, this, true);
		APP.currentWindow.bossModeController.off(BossModeController.EVENT_DISAPPEARING_PRESENTATION_COMPLETED, this._onTimeToCalculateBossRoundWins, this, true);

		this.view.i_calculateBossRoundWins();
	}

	_onGameRoundStateChanged()
	{
		this._invalidateView();
	}

	_onPlayerSeatStateChanged(aEvent_obj)
	{
		if (!aEvent_obj.value) //sit out
		{
			this.info.isBattlegroundRoundResultExpected = false;
			this._resetAndHideScoreBoard();
		}
		
		this._invalidateView();
	}

	_invalidateView()
	{
		let lView_sv = this.view;
		const lIsPlayerSitIn_bl = this._fGameStateInfo_gsi.isPlayerSitIn;

		switch (this._fGameStateInfo_gsi.gameState)
		{
			case ROUND_STATE.PLAY:
				lView_sv.visible = lIsPlayerSitIn_bl;

				if (this.info.isUpdateLockedOnBattlegroundRoundResultExpected)
				{
					this.info.isUpdateLockedOnBattlegroundRoundResultExpected = false;
				}

				if (lIsPlayerSitIn_bl && this._isBossSubround && !APP.gameScreen.isPaused)
				{
					this._onBossRoundStarted(null, true);
				}
				else
				{
					lView_sv.i_hideBossRoundPanel();
				}
				
				this.info.seatsData && lView_sv.i_updatePlayersInfo(this.info.seatsData);
				
				if (this.info.currentScores && this.info.currentBossRoundScores)
				{
					lView_sv.i_updateAllScores(this.info.currentScores, this.info.currentBossRoundScores);
				}
				let lPrizePerPerson_num = (APP.gameScreen.player.battlegroundBuyInCost_num || 0) * APP.gameScreen.player.battlegroundPotTaxMultiplier_num;
				lPrizePerPerson_num && this.view && this.view.i_updatePrizePoolValue(lPrizePerPerson_num);

				break;
			case ROUND_STATE.QUALIFY:
				if (APP.gameScreen.isPaused && this.info.currentScores && this.info.currentBossRoundScores)
				{
					lView_sv.i_updateAllScores(this.info.currentScores, this.info.currentBossRoundScores);
				}

				this.info.isUpdateLockedOnBattlegroundRoundResultExpected = true;
				break;
			case ROUND_STATE.WAIT:
				if (this.info.isUpdateLockedOnBattlegroundRoundResultExpected)
				{
					break;
				}
				this._resetAndHideScoreBoard();
				break;
			default:
				break;
		}
	}

	_onRoundResultScreenActivated()
	{
		if (this.info.isUpdateLockedOnBattlegroundRoundResultExpected && !APP.gameScreen.isPaused)
		{
			this.info.isUpdateLockedOnBattlegroundRoundResultExpected = false;
			this.emit(ScoreboardController.EVENT_ON_SCORE_BOARD_START_HIDE_ON_ROUND_RESULT);
			this._resetAndHideScoreBoard();
		}
	}
	

	_resetAndHideScoreBoard()
	{
		let lView_sv = this.view;
		lView_sv.visible = false;
		lView_sv.i_hideBossRoundPanel();
		lView_sv.i_resetScoreboard();
	}

	//DEBUG...
	/*
	_income()
	{
		if (Math.random() > 0.5)
		{
			let lucky = Math.floor(Math.random() * 6);
			let prize = 100000 + Math.floor(Math.random()*200000);
			let lData_obj = {seatId: lucky, win: prize};
			
			if (this._isBossSubround)
			{
				this.view.i_addBossRoundScore(lData_obj);
			}
			else
			{
				this.view.i_addScore(lData_obj);
			}
		}
	}

	_startShow()
	{
		new Timer(
			()=>{
				this._income();
			}
		, 30*FRAME_RATE, true);
	}
	//*/
	//...DEBUG

	destroy()
	{
		APP.currentWindow.bossModeController.off(BossModeController.EVENT_APPEARING_PRESENTATION_STARTED, this._onBossRoundStarted, this);
		
		APP.webSocketInteractionController.off(GameWebSocketInteractionController.EVENT_ON_SERVER_FULL_GAME_INFO_MESSAGE, this._onServerGetRoomInfoResponseMessage, this);
		APP.webSocketInteractionController.off(GameWebSocketInteractionController.EVENT_ON_SERVER_SCOREBOARD_UPDATED, this._onScoreboardUpdated, this);

		APP.currentWindow.bossModeController.off(BossModeController.EVENT_APPEARING_PRESENTATION_STARTED, this._onBossRoundStarted, this);
		APP.currentWindow.bossModeController.off(BossModeController.EVENT_DISAPPEARING_PRESENTATION_COMPLETED, this._onTimeToCalculateBossRoundWins, this, true);
		
		APP.gameScreen.off(GameScreen.EVENT_ON_ROOM_FIELD_CLEARED, this._onGameFieldCleared, this);
		APP.gameScreen.awardingController.off(AwardingController.EVENT_ON_PAYOUT_IS_VISIBLE, this._onTimeToShowAward, this);
		// APP.gameScreen.bigWinsController.off(BigWinsController.EVENT_BIG_WIN_PRESETNTATION_STARTED, this._onTimeToShowAward, this);
		APP.gameScreen.bigWinsController.off(BigWinsController.EVENT_ON_PENDING_BIG_WINS_SKIPPED, this._onBigWinAwardSkipped, this);

		this._fGameStateController_gsc.off(GameStateController.EVENT_ON_GAME_STATE_CHANGED, this._onGameRoundStateChanged, this);
		this._fGameStateController_gsc.off(GameStateController.EVENT_ON_PLAYER_SEAT_STATE_CHANGED, this._onPlayerSeatStateChanged, this);		

		this._fRoundResultScreenController_rrsc.off(RoundResultScreenController.EVENT_ON_ROUND_RESULT_SCREEN_ACTIVATED, this._onRoundResultScreenActivated, this);
		this._fRoundResultScreenController_rrsc = null;

		this._fGameStateController_gsc = null;
		this._fGameStateInfo_gsi = null;

		this._fBattlegroundFinalCountingController_bfcc = null;
		this._fBattlegroundFinalCountingInfo_bfci = null;

		super.destroy();
	}
}

export default ScoreboardController;