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
import RoundResultScreenController from '../roundresult/RoundResultScreenController';
import GameFieldController from '../game_field/GameFieldController';
import CafPrivateRoundCountDownDialogController from '../custom/gameplaydialogs/custom/CafPrivateRoundCountDownDialogController';

class ScoreboardController extends SimpleUIController
{
	static get EVENT_ON_SCORE_BOARD_START_HIDE_ON_ROUND_RESULT() 	{ return "EVENT_ON_SCORE_BOARD_START_HIDE_ON_ROUND_RESULT";}	
	static get EVENT_ON_SCORE_BOARD_SCORES_UPDATED()				{ return "EVENT_ON_SCORE_BOARD_SCORES_UPDATED";}
	static get EVENT_ON_BOSS_ROUND_MODE_HIDDEN()					{ return ScoreboardView.EVENT_ON_BOSS_ROUND_MODE_HIDDEN;}

	constructor()
	{
		super(new ScoreboardInfo(), new ScoreboardView());

		this._fIsCapsuleExplodedBossBigWinShouldBeAwaited_bl = false;

		//DEBUG...
		//this._startShow();
		//...DEBUG
	}

	get _isBossSubround()
	{
		return APP.gameScreen.gameStateController.info.isBossSubround || APP.gameScreen.gameFieldController.isBossEnemyExist;
	}

	get isAnimationsPlaying()
	{
		return this.view.isAnimationsPlaying;
	}

	resetAndHideScoreBoard()
	{
		this._resetAndHideScoreBoard();
	}

	__initControlLevel()
	{
		super.__initControlLevel();

		APP.webSocketInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_FULL_GAME_INFO_MESSAGE, this._onServerFullGameInfoResponseMessage, this);
		APP.webSocketInteractionController.on(GameWebSocketInteractionController.EVENT_BATTLEGROUND_SCORE_BOARD, this._onScoreboardUpdated, this);
		APP.webSocketInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_SIT_OUT_RESPONSE_MESSAGE, this._onServerSitOutResponseMessage, this);
		
		APP.currentWindow.bossModeController.on(BossModeController.EVENT_APPEARING_STARTED, this._onBossRoundStarted, this);
		APP.currentWindow.bossModeController.on(BossModeController.EVENT_DISAPPEARING_PRESENTATION_STARTED, this._onBossKilled, this);

		APP.gameScreen.on(GameScreen.EVENT_ON_ROOM_FIELD_CLEARED, this._onGameFieldCleared, this);
		APP.gameScreen.awardingController.on(AwardingController.EVENT_ON_PAYOUT_IS_VISIBLE, this._onTimeToShowAward, this);
		APP.gameScreen.bigWinsController.on(BigWinsController.EVENT_BIG_WIN_PRESETNTATION_STARTED, this._onTimeToShowAward, this);
		APP.gameScreen.bigWinsController.on(BigWinsController.EVENT_ON_PENDING_BIG_WINS_SKIPPED, this._onBigWinAwardSkipped, this);

		APP.gameScreen.gameFieldController.on(GameFieldController.EVENT_ON_NEED_TO_COUNT_WIN_FOR_LOST_ENEMY, this._onNeedToCountForLostEnemy, this);
		APP.gameScreen.gameFieldController.on(GameFieldController.EVENT_ON_BOSS_IMMEDIATELY_DEATH, this._onBossImmediatelyDeath, this);

		this._fGameStateController_gsc = APP.currentWindow.gameStateController;
		this._fGameStateInfo_gsi = this._fGameStateController_gsc.info;
		this._fGameStateController_gsc.on(GameStateController.EVENT_ON_GAME_STATE_CHANGED, this._onGameRoundStateChanged, this);
		this._fGameStateController_gsc.on(GameStateController.EVENT_ON_PLAYER_SEAT_STATE_CHANGED, this._onPlayerSeatStateChanged, this);
		this._fGameStateController_gsc.on(GameStateController.EVENT_ON_SUBROUND_STATE_CHANGED, this._onGameSubRoundStateChanged, this);
	
		this._fRoundResultScreenController_rrsc = APP.gameScreen.gameFieldController.roundResultScreenController;
		this._fRoundResultScreenController_rrsc.on(RoundResultScreenController.EVENT_ON_ROUND_RESULT_SCREEN_ACTIVATED, this._onRoundResultScreenActivated, this);

		APP.gameScreen.on(GameScreen.EVENT_ON_BOSS_DESTROYED, this._onBossDestroyed, this);
		APP.gameScreen.on(GameScreen.EVENT_ON_NEW_BOSS_CREATED, this._onNewBossCreated, this);
		APP.gameScreen.gameplayDialogsController.gameCafPrivateRoundCountDownDialogController.on(CafPrivateRoundCountDownDialogController.EVENT_ON_SCREEN_ACTIVATED, this._observerModeActivated, this);

	}

	_observerModeActivated(event)
	{
		this._isObserver = true;
	}

	__initViewLevel()
	{
		super.__initViewLevel();

		this.view.on(ScoreboardView.EVENT_ON_BOSS_TITLE_HIDDEN, this._onBossTitleHidden, this);
		this.view.on(ScoreboardView.EVENT_ON_SCORE_BOARD_SCORES_UPDATED, this.emit, this);
		this.view.on(ScoreboardView.EVENT_ON_BOSS_ROUND_MODE_HIDDEN, this.emit, this);
		this.view.on(ScoreboardView.EVENT_ON_YOU_WIN_MULTIPLIER_LANDED, this._onYouWinMultiplierLanded, this);

		this._invalidateView();
	}

	_onGameFieldCleared(aEvent_e)
	{
		this.view && this.view.i_interruptAnimations();

		if (this.info.isUpdateLockedOnBattlegroundRoundResultExpected)
		{
			return;
		}

		if (!aEvent_e.keepPlayersOnScreen)
		{
			this.info.resetRoundTime();
		}

		this.view && this.view.i_resetScoreboard();

		this.info.isBossKillMultiplierExpected = false;
	}

	_onBigWinAwardSkipped(aEvent_obj)
	{
		let lAddScoreData_obj = {
			seatId: APP.currentWindow.player.seatId,
			value: aEvent_obj.skippedPendingBigWinsValue,
			isBoss: aEvent_obj.isBoss,
			bossValue: aEvent_obj.bossValue
		};

		this._onTimeToShowAward(lAddScoreData_obj);
	}

	_onNeedToCountForLostEnemy(aEvent_obj)
	{
		// TODO: rewrite the method so that it doesn't duplicate _onTimeToShowAward method
		if(aEvent_obj.skipAward)
		{
			this._onBossImmediatelyDeath();
			return;
		}
		
		let lScoreData_obj = {
			seatId: aEvent_obj.seatId,
			win: aEvent_obj.value || aEvent_obj.money || aEvent_obj.score
		};

		if (aEvent_obj.isBoss)
		{
			if(aEvent_obj.bossValue)
			{
				this.view && this.view.i_addScore({seatId: aEvent_obj.seatId, win: (lScoreData_obj.win - aEvent_obj.bossValue)});
				lScoreData_obj.win = aEvent_obj.bossValue;
			}
			this.view && this.view.i_addBossRoundScoreForLostBoss(lScoreData_obj);

			this._onBossImmediatelyDeath();
		}
		else
		{	
			this.view && this.view.i_addScore(lScoreData_obj);
		}
	}

	_onBossImmediatelyDeath()
	{
		const gameFieldController = APP.gameScreen.gameFieldController;
		let lIsBossIsInDelayedLaserCapsule_obj = gameFieldController.checkIfBossIsInDelayedLaserCapsuleEnemies();
		let lIsBossInLightning_obj = gameFieldController.checkIfBossIsInDelayedLightningCapsuleEnemies();

		if (
			this._isBossSubround
			|| lIsBossIsInDelayedLaserCapsule_obj
			|| lIsBossInLightning_obj)
		{
			if (!!lIsBossIsInDelayedLaserCapsule_obj)
			{
				APP.gameScreen.gameFieldController.once(GameFieldController.EVENT_ON_DELAYED_LASER_CAPSULES_AWARDS_ARE_COLLECTED, this._onBossWinCountingSuspicion, this);
				return;
			}

			if (!!lIsBossInLightning_obj)
			{
				APP.gameScreen.gameFieldController.once(GameFieldController.EVENT_ON_LIGHTNING_CAPSULE_DELAYED_AWARDS_COLLECTED, this._onBossWinCountingSuspicion, this);
				return;
			}
		}

		this._onBossWinCountingSuspicion();
	}

	_onBossWinCountingSuspicion()
	{
		APP.gameScreen.gameFieldController.off(GameFieldController.EVENT_ON_DELAYED_LASER_CAPSULES_AWARDS_ARE_COLLECTED, this._onBossWinCountingSuspicion, this);
		APP.gameScreen.gameFieldController.off(GameFieldController.EVENT_ON_LIGHTNING_CAPSULE_DELAYED_AWARDS_COLLECTED, this._onBossWinCountingSuspicion, this);

		if (APP.gameScreen.bigWinsController.isAnyLightningOrLaserCapsuleBigWinAwaited)
		{
			this._fIsCapsuleExplodedBossBigWinShouldBeAwaited_bl = true;
			APP.gameScreen.bigWinsController.once(BigWinsController.EVENT_ON_BIG_WIN_AWARD_COUNTED, this._tryToCountBossRoundWin, this);
			return;
		}

		this._tryToCountBossRoundWin();
	}

	_tryToCountBossRoundWin()
	{
		this._fIsCapsuleExplodedBossBigWinShouldBeAwaited_bl = false;

		if (!this.view.isItemsBossCounting)
		{
			this.view.i_calculateBossRoundWins();
		}
		else
		{
			this.view.once(ScoreboardView.EVENT_ON_ALL_BOSS_SCORES_UPDATED, this._tryToCountBossRoundWin, this);
		}
	}

	_onTimeToShowAward(aEvent_obj)
	{
		if(aEvent_obj.skipAward)
		{
			return;
		}
		
		let lScoreData_obj = {
			seatId: aEvent_obj.seatId,
			win: aEvent_obj.value || aEvent_obj.money || aEvent_obj.score
		};

		if (aEvent_obj.isBoss)
		{
			if (aEvent_obj.bossValue)
			{
				this.view && this.view.i_addScore({seatId: aEvent_obj.seatId, win: (lScoreData_obj.win - aEvent_obj.bossValue)});
				lScoreData_obj.win = aEvent_obj.bossValue;
			}
			this.view && this.view.i_addBossRoundScore(lScoreData_obj);
		}
		else
		{	
			this.view && this.view.i_addScore(lScoreData_obj);
		}
	}

	_onScoreboardUpdated(aData_obj)
	{
		let l_si = this.info;

		if (l_si.isNeededToUpdateForNewBoss && this._isBossSubround)
		{	
			l_si && l_si.i_updateScoresData(aData_obj.messageData.scoreBySeatId, aData_obj.messageData.scoreBossBySeatId);
			return;
		}

		l_si.roundStartTime = aData_obj.messageData.startTime;
		l_si.roundEndTime = aData_obj.messageData.endTime;

		APP.updateRoundTime(l_si.roundStartTime,l_si.roundEndTime);
		
		if (!l_si.isUpdateLockedOnBattlegroundRoundResultExpected)
		{
			l_si.i_updateScoresData(aData_obj.messageData.scoreBySeatId, aData_obj.messageData.scoreBossBySeatId);

			this.view && this.view.i_updatePlayersBetsInfo(aData_obj.messageData.scoreBySeatId);
			//
			this._isObserver && this.view && this._invalidateView();
		}
	}

	_onServerFullGameInfoResponseMessage(aData_obj)
	{
		if (this.info.isUpdateLockedOnBattlegroundRoundResultExpected
			|| aData_obj.messageData.state == ROUND_STATE.QUALIFY)
		{
			return;
		}
		
		let lSeatsData_obj_arr = aData_obj.messageData.seats.slice();
		this.info && this.info.i_updateSeatsData(lSeatsData_obj_arr);

		this.view && this.view.i_updatePlayersInfo(lSeatsData_obj_arr);

		this._invalidateView();
	}

	_onServerSitOutResponseMessage(event)
	{
		let data = event.messageData;
		if(data.rid == -1)
		{
			let lSeats = this.info.seatsData;

			if (!lSeats)
			{
				return;
			}

			for (let i = 0; i < lSeats.length; i++)
			{
				if(lSeats[i].id == data.id)
				{
					lSeats.splice(i, 1);
				}
			}
		}
	}

	_onBossRoundStarted(aEvent_obj, aOptSkipAnimation_bl)
	{
		APP.currentWindow.bossModeController.off(BossModeController.EVENT_ON_TIME_TO_PRESENT_MULTIPLIER, this._onTimeToPresentMultiplier, this, true);
		this._fIsScoreBoardBossRoundPanelAnimating_bl = !aOptSkipAnimation_bl;
		this.view.i_showBossRoundPanel(aOptSkipAnimation_bl);
		APP.currentWindow.bossModeController.once(BossModeController.EVENT_ON_TIME_TO_PRESENT_MULTIPLIER, this._onTimeToPresentMultiplier, this, true);

		this.info.isBossKillMultiplierExpected = false;
	}

	_onYouWinMultiplierLanded()
	{
		this.view.i_calculateBossRoundWins();
	}

	_onTimeToPresentMultiplier(e)
	{
		APP.currentWindow.bossModeController.off(BossModeController.EVENT_ON_TIME_TO_PRESENT_MULTIPLIER, this._onTimeToPresentMultiplier, this, true);

		this.view.i_timeToPresentMultiplier(e.winSeatId, e.isCoPlayerWin);
	}

	_onBossKilled()
	{
		this.info.isNeededToUpdateForNewBoss = true;
	}

	_onGameRoundStateChanged()
	{
		this._invalidateView();
	}

	_onGameSubRoundStateChanged()
	{
		if (
			!this._isBossSubround
			&& !this.view.isItemsBossCounting 
			&& !this.view.isMultiplierAnimating 
			&& !this.info.isBossKillMultiplierExpected
			&& !APP.gameScreen.gameFieldController.checkIfBossIsInDelayedLaserCapsuleEnemies()
			&& !APP.gameScreen.gameFieldController.checkIfBossIsInDelayedLightningCapsuleEnemies()
			&& !this._fIsCapsuleExplodedBossBigWinShouldBeAwaited_bl)
		{
			this.view.i_calculateBossRoundWins();
		}
	}

	_onPlayerSeatStateChanged(aEvent_obj)
	{
		if (!aEvent_obj.value) //sit out
		{
			this._resetAndHideScoreBoard();
		}
		
		this._invalidateView();
	}

	_invalidateView()
	{
		let lView_sv = this.view;

		switch (this._fGameStateInfo_gsi.gameState)
		{
			case ROUND_STATE.PLAY:
				lView_sv.visible = true;
				if (this.info.isUpdateLockedOnBattlegroundRoundResultExpected)
				{
					this.info.isUpdateLockedOnBattlegroundRoundResultExpected = false;
				}

				if (this._isBossSubround && !APP.gameScreen.isPaused)
				{
					this.info.isNeededToUpdateForNewBoss = false;
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
				this._isObserver = false;
				if (APP.gameScreen.isPaused && this.info.currentScores && this.info.currentBossRoundScores)
				{
					lView_sv.i_updateAllScores(this.info.currentScores, this.info.currentBossRoundScores);
				}

				this.info.isUpdateLockedOnBattlegroundRoundResultExpected = true;
				break;
			case ROUND_STATE.WAIT:
				this._isObserver = false;
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
	
	_onBossTitleHidden(aEvent_obj)
	{
		if (!this._isBossSubround)
		{
			this.view && this.view.i_hideAdditionalCells(aEvent_obj.force);
		}
		else
		{
			if (this.info.isNeededToUpdateForNewBoss)
			{
				this.view.i_updateAllScores(this.info.currentScores, this.info.currentBossRoundScores);
				this.info.isNeededToUpdateForNewBoss = false;
				this.view.i_showBossRoundPanel(null, false);
			}
			else
			{
				this._onBossRoundStarted(null, true);
			}
		}

		this.view.i_needSortItems(false);
	}

	_resetAndHideScoreBoard()
	{
		let lView_sv = this.view;
		lView_sv.visible = false;
		lView_sv.i_hideBossRoundPanel();
		lView_sv.i_resetScoreboard();
		this.info.isNeededToUpdateForNewBoss = false;

		this.info.resetRoundTime();
	}
	
	_onBossDestroyed()
	{
		this.info.isBossKillMultiplierExpected = true;
	}

	_onNewBossCreated()
	{
		this.info.isBossKillMultiplierExpected = false;
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
		
		APP.webSocketInteractionController.off(GameWebSocketInteractionController.EVENT_ON_SERVER_FULL_GAME_INFO_MESSAGE, this._onServerFullGameInfoResponseMessage, this);
		APP.webSocketInteractionController.off(GameWebSocketInteractionController.EVENT_ON_SERVER_SCOREBOARD_UPDATED, this._onScoreboardUpdated, this);

		APP.currentWindow.bossModeController.off(BossModeController.EVENT_ON_TIME_TO_PRESENT_MULTIPLIER, this._onTimeToPresentMultiplier, this, true);
		
		APP.gameScreen.off(GameScreen.EVENT_ON_ROOM_FIELD_CLEARED, this._onGameFieldCleared, this);
		APP.gameScreen.awardingController.off(AwardingController.EVENT_ON_PAYOUT_IS_VISIBLE, this._onTimeToShowAward, this);
		APP.gameScreen.bigWinsController.off(BigWinsController.EVENT_BIG_WIN_PRESETNTATION_STARTED, this._onTimeToShowAward, this);
		APP.gameScreen.bigWinsController.off(BigWinsController.EVENT_ON_PENDING_BIG_WINS_SKIPPED, this._onBigWinAwardSkipped, this);

		APP.gameScreen.gameFieldController.off(GameFieldController.EVENT_ON_DELAYED_LASER_CAPSULES_AWARDS_ARE_COLLECTED, this._onBossWinCountingSuspicion, this);
		APP.gameScreen.gameFieldController.off(GameFieldController.EVENT_ON_LIGHTNING_CAPSULE_DELAYED_AWARDS_COLLECTED, this._onBossWinCountingSuspicion, this);
		APP.gameScreen.bigWinsController.off(BigWinsController.EVENT_ON_BIG_WIN_AWARD_COUNTED, this._tryToCountBossRoundWin, this);
		this.view && this.view.off(ScoreboardView.EVENT_ON_ALL_BOSS_SCORES_UPDATED, this._tryToCountBossRoundWin, this);

		this._fGameStateController_gsc.off(GameStateController.EVENT_ON_GAME_STATE_CHANGED, this._onGameRoundStateChanged, this);
		this._fGameStateController_gsc.off(GameStateController.EVENT_ON_PLAYER_SEAT_STATE_CHANGED, this._onPlayerSeatStateChanged, this);		

		this._fRoundResultScreenController_rrsc.off(RoundResultScreenController.EVENT_ON_ROUND_RESULT_SCREEN_ACTIVATED, this._onRoundResultScreenActivated, this);
		this._fRoundResultScreenController_rrsc = null;

		this._fGameStateController_gsc = null;
		this._fGameStateInfo_gsi = null;

		this._fIsCapsuleExplodedBossBigWinShouldBeAwaited_bl = null;

		super.destroy();
	}
}

export default ScoreboardController;