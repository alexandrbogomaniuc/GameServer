import SimpleController from '../../../../../common/PIXI/src/dgphoenix/unified/controller/base/SimpleController';
import ShotResponsesInfo from '../../model/custom/ShotResponsesInfo';
import ShotResponseInfo from '../../model/custom/shot/ShotResponseInfo';
import GameWebSocketInteractionController from '../../controller/interaction/server/GameWebSocketInteractionController';
import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { ENEMY_TYPES, WEAPONS } from '../../../../shared/src/CommonConstants';
import { HIT_RESULT_SINGLE_CASH_ID, HIT_RESULT_SPECIAL_WEAPON_ID, HIT_RESULT_ADDITIONAL_CASH_ID } from '../uis/prizes/PrizesController';
import AwardingController from '../uis/awarding/AwardingController';
import BossModeController from '../uis/custom/bossmode/BossModeController';
import { LOBBY_MESSAGES, GAME_MESSAGES } from '../../controller/external/GameExternalCommunicator';
import BigWinsController from '../uis/awarding/big_win/BigWinsController';
import GameScreen from '../../main/GameScreen';
import Timer from "../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer";
import GameFRBController from '../../controller/uis/custom/frb/GameFRBController';
import MoneyWheelController from '../uis/quests/MoneyWheelController';
import { ROUND_STATE } from '../../model/state/GameStateInfo';
import GamePendingOperationController from '../gameplay/GamePendingOperationController';

class BalanceController extends SimpleController
{
	static get EVENT_ON_WEAPON_SHOTS_UPDATED() { return 'EVENT_ON_WEAPON_SHOTS_UPDATED'; }
	static get EVENT_ON_WIN_TO_AMMO_TRANSFERED() { return "EVENT_ON_WIN_TO_AMMO_TRANSFERED"; }
	static get EVENT_ON_BUY_AMMO_REQUIRED() { return "onBuyAmmoRequired"; }
	static get EVENT_ON_SERVER_BALANCE_UPDATED() { return "onServerBalanceUpdated"; }

	tryToBuyAmmo()
	{
		this._tryToBuyAmmo();
	}

	tryToBuyAmmoFromRoundResult(aIgnoreRoundResultState_bln = false)
	{
		this._tryToBuyAmmoFromRoundResult(aIgnoreRoundResultState_bln);
	}

	resetPlayerWin()
	{
		this._resetPlayerWin();
	}

	updatePlayerBalance()
	{
		this._updatePlayerBalance();
	}

	updatePlayerWin(aValue_num = 0, aOptDuration_num = 0)
	{
		this._updatePlayerWin(aValue_num, aOptDuration_num);
	}

	calcBalanceValue()
	{
		return this._calcBalanceValue();
	}

	clearAmmo()
	{
		this._clearAmmo();
	}

	updateAmmo(ammoAmount = 0)
	{
		this._updateAmmo(ammoAmount);
	}

	constructor()
	{
		super();

		this._fGameStateController_gsc = APP.currentWindow.gameStateController;
		this._fGameStateInfo_gsi = this._fGameStateController_gsc.info;

		this._fWeaponsController_wsc = APP.currentWindow.weaponsController;
		this._fWeaponsInfo_wsi = this._fWeaponsController_wsc.i_getInfo();

		let tournamentModeController = APP.tournamentModeController;
		this._fTournamentModeInfo_tmi = tournamentModeController.info;

		this._fCurrentWinTimeout_t = null;
		this.currentWin = 0;
	}

	get _isFrbMode()
	{
		return APP.currentWindow.gameFrbController.info.frbMode;
	}

	get _isBonusMode()
	{
		return APP.currentWindow.gameBonusController.info.isActivated;
	}

	__initControlLevel()
	{
		super.__initControlLevel();

		APP.gameScreen.on(GameScreen.EVENT_ON_GAME_FIELD_SCREEN_CREATED, this._onGameFieldScreenCreated, this);
		APP.gameScreen.on(GameScreen.EVENT_ON_HIT_RESPONCE, this._onHitResponce, this);

		APP.currentWindow.awardingController.on(AwardingController.EVENT_ON_PENDING_AWARDS_SKIPPED, this._onPendingAwardsSkipped, this);
		APP.currentWindow.awardingController.on(AwardingController.EVENT_ON_PENDING_AWARDS_DEVALUED, this._onPendingAwardsDevalued, this);

		APP.currentWindow.bigWinsController.on(BigWinsController.EVENT_ON_BIG_WIN_AWARD_COUNTED, this._onBigWinAwardCounted, this);
		APP.currentWindow.bigWinsController.on(BigWinsController.EVENT_ON_PENDING_BIG_WINS_SKIPPED, this._onPendingBigWinsSkipped, this);
		APP.currentWindow.bigWinsController.on(BigWinsController.EVENT_ON_ANIMATION_INTERRUPTED, this._onBigWinAnimationInterrupted, this);

		APP.currentWindow.awardingController.on(AwardingController.EVENT_ON_AWARD_COUNTED, this._onAwardCounted, this);
		APP.currentWindow.awardingController.on(AwardingController.EVENT_ON_AWARD_ANIMATION_INTERRUPTED, this._onAwardAnimationInterrupted, this);

		APP.webSocketInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_BALANCE_UPDATED_MESSAGE, this._onServerBalanceUpdatedMessage, this);
		APP.webSocketInteractionController.on(GameWebSocketInteractionController.EVENT_ON_QUEST_WIN_PAYOUT, this._onSeatWinForQuest, this);

		APP.currentWindow.gameFrbController.on(GameFRBController.EVENT_ON_FRB_MODE_CHANGED, this._onFRBModeChanged, this);

		APP.pendingOperationController.on(GamePendingOperationController.EVENT_ON_PENDING_OPERATION_COMPLETED, this._onPendingOperationCompleted, this);
	}

	_onGameFieldScreenCreated()
	{
		APP.currentWindow.gameFieldController.moneyWheelController.on(MoneyWheelController.EVENT_ON_MONEY_WHEEL_INTERRUPTED, this._onMoneyWheelInterrupted, this);
	}

	_transferWinToAmmo(aWinAmount_num)
	{
		if (this._isFrbMode) return;

		const lPlayerInfo_pi = APP.playerController.info;
		if (lPlayerInfo_pi.qualifyWin >= aWinAmount_num)
		{
			if (APP.currentWindow.player.sitIn && !APP.isBattlegroundGame)
			{
				const lDefaultAmmo_num = APP.currentWindow.weaponsController.i_getInfo().realAmmo;
				const lAddDefaultAmmo_num = aWinAmount_num / lPlayerInfo_pi.currentStake;
				const lNewDefaultAmmo_num = lDefaultAmmo_num + lAddDefaultAmmo_num;

				this.emit(BalanceController.EVENT_ON_WEAPON_SHOTS_UPDATED, { weaponId: WEAPONS.DEFAULT, shots: lNewDefaultAmmo_num });
				APP.currentWindow.gameFieldController.redrawAmmoText();
			}

			this.emit(BalanceController.EVENT_ON_WIN_TO_AMMO_TRANSFERED, { winAmount: aWinAmount_num });
		}
	}

	_onPendingAwardsSkipped(aEvent_obj)
	{
		const lSkippedPendingAwardsWin_num = aEvent_obj.skippedPendingAwardsWin;
		if (lSkippedPendingAwardsWin_num > 0)
		{
			this._transferWinToAmmo(lSkippedPendingAwardsWin_num);

			if (aEvent_obj.isValueDisplayRequired)
			{
				this._updatePlayerWin(lSkippedPendingAwardsWin_num);
			}
		}
	}

	_onPendingAwardsDevalued(aEvent_obj)
	{
		const lDevaluedPendingAwardsWin_num = aEvent_obj.devaluedPendingAwardsWin;
		if (lDevaluedPendingAwardsWin_num > 0)
		{
			this._transferWinToAmmo(lDevaluedPendingAwardsWin_num);
		}
	}

	_sendBalanceUpdatedMessage(aSpecificBalance_num)
	{
		const lKeepNotEnoughMoneyDialog_bln = false;
		if (aSpecificBalance_num)
		{
			APP.gameScreen.gameFieldController.redrawAmmoText();
			this.emit(BalanceController.EVENT_ON_SERVER_BALANCE_UPDATED);
		}

		APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.SERVER_BALANCE_UPDATED_MESSAGE_RECIEVED, { keepDialog: lKeepNotEnoughMoneyDialog_bln, specBalance: aSpecificBalance_num });
	}

	_onPendingBigWinsSkipped(aEvent_obj)
	{
		let aSkippedPendingBigWinsValue_num = aEvent_obj.skippedPendingBigWinsValue;
		if (aSkippedPendingBigWinsValue_num > 0)
		{
			this._transferWinToAmmo(aSkippedPendingBigWinsValue_num);
			this._updatePlayerWin(aSkippedPendingBigWinsValue_num);
		}
	}

	_onBigWinAnimationInterrupted(aEvent_obj)
	{
		if (aEvent_obj.uncountedWin)
		{
			this._transferWinToAmmo(aEvent_obj.uncountedWin);
		}

		if (aEvent_obj.notLandedWin)
		{
			this._updatePlayerWin(aEvent_obj.notLandedWin);
		}
	}

	_onBigWinAwardCounted(aEvent_obj)
	{
		if (aEvent_obj.money)
		{
			this._transferWinToAmmo(aEvent_obj.money);
			this._sendBalanceUpdatedMessage(this._calcBalanceValue());
		}
	}

	_onAwardCounted(aEvent_obj)
	{
		if (aEvent_obj.money)
		{
			if (!aEvent_obj.isQualifyWinDevalued && aEvent_obj.isMasterSeat)
			{
				this._transferWinToAmmo(aEvent_obj.money);
				if (aEvent_obj.rid === -1 && !aEvent_obj.isFreezeWin)
				{
					this._handleAwardFromCoPlayer();
				}
				else
				{
					this._sendBalanceUpdatedMessage(this._calcBalanceValue());
				}
			}
		}
		else if (aEvent_obj.score)
		{
			APP.gameScreen.gameFieldController.updatePlayerScore(aEvent_obj.score, true);
		}
	}

	_onAwardAnimationInterrupted(aEvent_obj)
	{
		if (aEvent_obj.money)
		{
			if (!aEvent_obj.isQualifyWinDevalued && aEvent_obj.isMasterSeat)
			{
				this._transferWinToAmmo(aEvent_obj.money);
				if (aEvent_obj.rid === -1)
				{
					this._handleAwardFromCoPlayer();
				}
			}

			this._updatePlayerWin(aEvent_obj.uncountedWin);
		}
		else if (aEvent_obj.score)
		{
			APP.gameScreen.gameFieldController.updatePlayerScore(aEvent_obj.score);
		}
	}

	_handleAwardFromCoPlayer()
	{
		this._sendBalanceUpdatedMessage(this._calcBalanceValue());
	}

	_tryToBuyAmmoFromRoundResult(aIgnoreRoundResultState_bln = false)
	{
		let lRoundResultActive_bln = APP.gameScreen.gameFieldController.isRoundResultActive && !aIgnoreRoundResultState_bln;
		if (APP.currentWindow.weaponsController.i_getInfo().ammo == 0 && APP.gameScreen.gameFieldController.isRoundResultBuyAmmoRequest && !lRoundResultActive_bln)
		{
			this._tryToBuyAmmo();
		}
	}

	_tryToBuyAmmo()
	{
		const lIsGameOnPause_bl = APP.currentWindow.isPaused;
		const lIsFrbMode_bl = APP.currentWindow.gameFrbController.info.frbMode;
		const lIsBonusMode_bl = APP.currentWindow.gameBonusController.info.isActivated;
		const lIsTournamentMode_bl = APP.tournamentModeController.info.isTournamentMode;
		
		if (
				lIsGameOnPause_bl || lIsFrbMode_bl || lIsBonusMode_bl || lIsTournamentMode_bl
				|| APP.pendingOperationController.info.isPendingOperationStatusCheckInProgress
				|| APP.gameScreen.buyAmmoRetryingController.info.isRetryDialogActive
				|| APP.gameScreen.isForcedSitOutInProgress
			)
		{
			return;
		}

		if (
			this._fGameStateInfo_gsi.gameState == "PLAY" 
			&& 
			(
				!APP.isBattlegroundGame	|| APP.gameScreen.battlegroundGameController.info.isPlayerClickedConfirmPlayForNextBattlegroundRound
			)
		)
		{
			APP.gameScreen.gameFieldController.isRoundResultBuyAmmoRequest = false;
			this.emit(BalanceController.EVENT_ON_BUY_AMMO_REQUIRED);
		}
	}

	_onHitResponce(aEvent_obj)
	{
		const lData_obj = aEvent_obj.data;
		if (APP.gameScreen.isPaused)
		{
			let lWin_num = lData_obj.awardedWin;

			if (lWin_num > 0)
			{
				this._transferWinToAmmo(lWin_num);
				this._updatePlayerWin(lWin_num);
			}

			if (lData_obj.killBonusPay > 0)
			{
				lWin_num = lData_obj.killBonusPay;

				this._transferWinToAmmo(lWin_num);
				this._updatePlayerWin(lWin_num);
			}

			return;
		}

		if (!APP.gameScreen.isPaused && !APP.gameScreen.gameFieldController.getSeat(lData_obj.seatId, true))
		{
			let lWin_num = lData_obj.awardedWin;
			if (lWin_num > 0)
			{
				this._transferWinToAmmo(lWin_num);
				this._updatePlayerWin(lWin_num);
			}
		}
	}

	_onSeatWinForQuest(aEvent_obj)
	{
		let lData_obj = aEvent_obj.messageData;
		let lWin_num = lData_obj.winAmount;

		let l_gfc = APP.gameScreen.gameFieldController;
		if (
				l_gfc.seatId == lData_obj.seatId
				&& (APP.gameScreen.isPaused || !l_gfc.getSeat(lData_obj.seatId, true))
			)
		{
			if (lWin_num > 0)
			{
				this._transferWinToAmmo(lWin_num);
				this._updatePlayerWin(lWin_num);
			}
		}
	}

	_onServerBalanceUpdatedMessage()
	{
		let lBalance_num;
		if (APP.gameScreen.gameFieldController && APP.gameScreen.gameStateController.info.isPlayerSitIn)
		{
			lBalance_num = this._calcBalanceValue();
		}

		this._sendBalanceUpdatedMessage(lBalance_num);
	}

	_updatePlayerWin(aValue_num = 0, aOptDuration_num = 0)
	{
		if (!this._isFrbMode && !APP.isBattlegroundGame)
		{
			if (APP.currentWindow.gameFieldController.roundResultActive)
			{
				return;
			}

			this._fCurrentWinTimeout_t && this._fCurrentWinTimeout_t.destructor();
			this._fCurrentWinTimeout_t = new Timer(this._resetPlayerWin.bind(this), 3000);
		}

		if (this.currentWin === undefined)
		{
			this.currentWin = 0;
		}
		this.currentWin += aValue_num;

		//JIRA... https://jira.dgphoenix.com/browse/MQAMZN-164
		let lBalance_num = this._calcBalanceValue();
		if (lBalance_num < this.currentWin && !this._isFrbMode && !APP.isBattlegroundGame)
		{
			this._resetPlayerWin();
		}
		else
		{
			APP.gameScreen.gameFieldController.updateCommonPanelIndicators({ balance: this._calcBalanceValue(), win: this.currentWin }, aOptDuration_num);
		}
		//...JIRA
	}

	_resetPlayerWin()
	{
		this._fCurrentWinTimeout_t && this._fCurrentWinTimeout_t.destructor();
		this._fCurrentWinTimeout_t = null;

		this.currentWin = 0;
		APP.gameScreen.gameFieldController.updateCommonPanelIndicators({ win: this.currentWin });
	}

	_updatePlayerBalance()
	{
		let lBalance_num = this._calcBalanceValue();
		APP.gameScreen.gameFieldController.updateCommonPanelIndicators({ balance: lBalance_num });

		//JIRA... https://jira.dgphoenix.com/browse/MQAMZN-164
		if (lBalance_num < this.currentWin && !this._isFrbMode && !APP.isBattlegroundGame)
		{
			this._resetPlayerWin();
		}
		//...JIRA
	}

	_onFRBModeChanged(aEvent_obj)
	{
		let lIsFRBMode_bln = aEvent_obj.value;
		if (lIsFRBMode_bln && APP.gameScreen.room)
		{
			this._resetPlayerWin();
			this._updatePlayerWin(APP.gameScreen.room.alreadySitInWin);
		}
	}

	_onMoneyWheelInterrupted(aEvent_obj)
	{
		if (aEvent_obj.isBigWin) 
		{
			return;
		}

		let lMoneyWheelWin_num = aEvent_obj.MoneyWheelWin;
		if (lMoneyWheelWin_num)
		{
			this._updatePlayerWin(lMoneyWheelWin_num);
		}
	}

	_calcBalanceValue()
	{
		let lPlayerInfo_pi = APP.playerController.info;
		let lResultState_bl = APP.gameScreen.gameFieldController.isRoundResultActive;
		let lBalance_num = lPlayerInfo_pi.balance;

		if (APP.pendingOperationController.info.isPendingOperationStatusCheckInProgress)
		{
			return lBalance_num;
		}

		if (!this._isFrbMode && !APP.currentWindow.gameFrbController.info.continousNextModeFrb)
		{
			if (
				APP.gameScreen.gameFieldController.isConnectionHasBeenRecentlyClosed
				&& (
					this._fGameStateInfo_gsi.gameState == ROUND_STATE.WAIT
					|| this._fGameStateInfo_gsi.gameState == ROUND_STATE.QUALIFY
				)
			)
			{
				if (APP.currentWindow.weaponsController.i_getInfo().currentWeaponId !== WEAPONS.DEFAULT)
				{
					APP.gameScreen.gameFieldController.changeWeapon(WEAPONS.DEFAULT);
				}
			}
			else if (
				(!APP.gameScreen.gameFieldController.isExternalBalanceUpdated || !lResultState_bl) &&
				!APP.gameScreen.gameFieldController.isWinLimitExceeded &&
				!APP.gameScreen.gameFieldController.isRoundResultOnLasthandWaitState
			)
			{
				let lRicochetBulletsAmnt_int = APP.gameScreen.gameFieldController.ricochetController.info.activeMasterBulletsAmount;
				let lRicochetBulletsCost_num = lRicochetBulletsAmnt_int * lPlayerInfo_pi.currentStake * lPlayerInfo_pi.betLevel;
				let lAmmoCost_num = !lResultState_bl ? this._fWeaponsInfo_wsi.realAmmo * lPlayerInfo_pi.currentStake : -lRicochetBulletsCost_num;
				let lAdditional_num = lPlayerInfo_pi.qualifyWin - lPlayerInfo_pi.unpresentedWin + lAmmoCost_num;
				if (APP.gameScreen.gameFieldController.isConnectionHasBeenRecentlyClosed && !lResultState_bl)
				{
					lAdditional_num = lAmmoCost_num;
				}
				lBalance_num += lAdditional_num;
			}
			else if (APP.gameScreen.gameFieldController.isExternalBalanceUpdated && !APP.gameScreen.gameFieldController.isRoundResultActive)
			{
				let lRicochetBulletsAmnt_int = APP.gameScreen.gameFieldController.ricochetController.info.activeMasterBulletsAmount;
				let lRicochetBulletsCost_num = lRicochetBulletsAmnt_int * lPlayerInfo_pi.currentStake * lPlayerInfo_pi.betLevel;
				lBalance_num -= lPlayerInfo_pi.unpresentedWin + lRicochetBulletsCost_num;

				if (lBalance_num < 0)
				{
					// possible when cash bonus win limit exceeded
					lBalance_num = 0;
				}
			}
			else if (
				(this._isBonusMode || this._fTournamentModeInfo_tmi.isTournamentMode)
				&& APP.gameScreen.gameFieldController.isExternalBalanceUpdated && APP.gameScreen.gameFieldController.isRoundResultActive
				&& this._fGameStateInfo_gsi.gameState == ROUND_STATE.PLAY
			)
			{
				let lAmmoCost_num = this._fWeaponsInfo_wsi.realAmmo * lPlayerInfo_pi.currentStake;
				lBalance_num += lAmmoCost_num;
			}
		}
		else
		{
			// calculations for frb mode
			// notes:
			// 1. total frb win amount should be added to balance value only at the end of frb (when frb end notification appears)
			// 2. external balance that we get from the server after "FRBEnded" message will already contain frb win, so we must deduct win till frb end notification appearing
			// 3. frb end notification can be delayed after "FRBEnded" message due to awaiting for win animation (coins flying)

			let lBalanceAdd_num = 0;
			if (APP.currentWindow.gameFrbController.info.frbEnded && APP.currentWindow.gameFrbController.info.isFrbCompleted)
			{
				if (!APP.gameScreen.gameFieldController.isRoundResultActive)
				{
					// "FRBEnded" already occured but notification still not presented
					lBalanceAdd_num = APP.gameScreen.gameFieldController.isExternalBalanceUpdated ? -lPlayerInfo_pi.qualifyWin : 0;
				}
				else
				{
					// frb end notification already presented
					lBalanceAdd_num = APP.gameScreen.gameFieldController.isExternalBalanceUpdated ? 0 : lPlayerInfo_pi.qualifyWin;
				}
			}
			lBalance_num += lBalanceAdd_num;
		}

		return lBalance_num;
	}

	_clearAmmo()
	{
		console.log("BalanceProblem  clear ammo ")
		if (this._isFrbMode) return;
		APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.ON_GAME_STATE_CHANGED, { value: "CLEAR_BULLETS" });
		this.emit(BalanceController.EVENT_ON_WEAPON_SHOTS_UPDATED, {weaponId: WEAPONS.DEFAULT, shots: 0});
	}

	_updateAmmo(ammoAmount)
	{
		let lDefaultAmmo_num = APP.currentWindow.weaponsController.i_getInfo().realAmmo;
		let lNewDefaultAmmo_int = lDefaultAmmo_num + ammoAmount;
		this.emit(BalanceController.EVENT_ON_WEAPON_SHOTS_UPDATED, {weaponId: WEAPONS.DEFAULT, shots: lNewDefaultAmmo_int, updateAfterBuyIn: true});
		APP.gameScreen.gameFieldController && APP.gameScreen.gameFieldController.redrawAmmoText();
	}

	//PENDING_OPERATION...
	_onPendingOperationCompleted(event)
	{
		const lPlayerInfo_pi = APP.playerController.info;
		if (lPlayerInfo_pi.isMasterServerSeatIdDefined)
		{
			this._tryToBuyAmmoFromRoundResult();
		}
	}
	//...PENDING_OPERATION

	destroy()
	{
		this._fCurrentWinTimeout_t && this._fCurrentWinTimeout_t.destructor();
		this._fCurrentWinTimeout_t = null;

		super.destroy();

		APP.currentWindow.awardingController.off(AwardingController.EVENT_ON_PENDING_AWARDS_SKIPPED, this._onPendingAwardsSkipped, this);
		APP.currentWindow.awardingController.off(AwardingController.EVENT_ON_PENDING_AWARDS_DEVALUED, this._onPendingAwardsDevalued, this);

		APP.currentWindow.bigWinsController.off(BigWinsController.EVENT_ON_PENDING_BIG_WINS_SKIPPED, this._onPendingBigWinsSkipped, this);
		APP.currentWindow.bigWinsController.off(BigWinsController.EVENT_ON_ANIMATION_INTERRUPTED, this._onBigWinAnimationInterrupted, this);

		APP.currentWindow.awardingController.off(AwardingController.EVENT_ON_AWARD_COUNTED, this._onAwardCounted, this);
		APP.currentWindow.awardingController.off(AwardingController.EVENT_ON_AWARD_ANIMATION_INTERRUPTED, this._onAwardAnimationInterrupted, this);

		APP.gameScreen.off(GameScreen.EVENT_ON_HIT_RESPONCE, this._onHitResponce, this);

		APP.webSocketInteractionController.off(GameWebSocketInteractionController.EVENT_ON_SERVER_BALANCE_UPDATED_MESSAGE, this._onServerBalanceUpdatedMessage, this);
		APP.webSocketInteractionController.off(GameWebSocketInteractionController.EVENT_ON_QUEST_WIN_PAYOUT, this._onSeatWinForQuest, this);

		APP.currentWindow.gameFrbController.off(GameFRBController.EVENT_ON_FRB_MODE_CHANGED, this._onFRBModeChanged, this);

		APP.currentWindow.gameFieldController.moneyWheelController.off(MoneyWheelController.EVENT_ON_MONEY_WHEEL_INTERRUPTED, this._onMoneyWheelInterrupted, this);
	}
}

export default BalanceController