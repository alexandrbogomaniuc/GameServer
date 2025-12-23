import SimpleUIController from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/uis/base/SimpleUIController';
import GameScreen from '../../../main/GameScreen';
import AwardingInfo from '../../../model/uis/awarding/AwardingInfo';
import AwardingView from '../../../view/uis/awarding/AwardingView';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import GamePlayerController from '../../custom/GamePlayerController';
import PrizesController from '../prizes/PrizesController';
import GameFieldController from '../../../controller/uis/game_field/GameFieldController'
import MoneyWheelController from '../quests/MoneyWheelController';
import { ENEMY_TYPES } from '../../../../../shared/src/CommonConstants';
import BossModeController from '../custom/bossmode/BossModeController';

const MONEY_WHEEL_AWARD_ID_PREFIX = "mv_";
const CAPSULES_ENEMY_TYPES = [
	ENEMY_TYPES.BOMB_CAPSULE,
	ENEMY_TYPES.BULLET_CAPSULE,
	ENEMY_TYPES.FREEZE_CAPSULE,
	ENEMY_TYPES.GOLD_CAPSULE,
	ENEMY_TYPES.KILLER_CAPSULE,
	ENEMY_TYPES.LASER_CAPSULE,
	ENEMY_TYPES.LIGHTNING_CAPSULE
];

class AwardingController extends SimpleUIController
{
	static get EVENT_ON_AWARD_COUNTED()					{ return AwardingView.EVENT_ON_AWARD_COUNTED; }
	static get EVENT_ON_AWARD_ANIMATION_STARTED()		{ return AwardingView.EVENT_ON_AWARD_ANIMATION_STARTED; }
	static get EVENT_ON_AWARD_ANIMATION_INTERRUPTED()	{ return AwardingView.EVENT_ON_AWARD_ANIMATION_INTERRUPTED; }
	static get EVENT_ON_AWARD_ANIMATION_COMPLETED()		{ return AwardingView.EVENT_ON_AWARD_ANIMATION_COMPLETED; }
	static get EVENT_ON_ALL_ANIMATIONS_COMPLETED()		{ return AwardingView.EVENT_ON_ALL_ANIMATIONS_COMPLETED; }
	static get EVENT_ON_COIN_LANDED()					{ return AwardingView.EVENT_ON_COIN_LANDED; }
	static get EVENT_ON_PENDING_AWARDS_DEVALUED()		{ return "EVENT_ON_PENDING_AWARDS_DEVALUED"; }
	static get EVENT_ON_PENDING_AWARDS_SKIPPED()		{ return "EVENT_ON_PENDING_AWARDS_SKIPPED"; }

	static get EVENT_ON_PAYOUT_IS_VISIBLE()				{ return AwardingView.EVENT_ON_PAYOUT_IS_VISIBLE; }

	get awardingContainerInfo()
	{
		return this._gameScreen.gameFieldController.awardingContainerInfo;
	}

	get freezeAwardingContainerInfo()
	{
		return this._gameScreen.gameFieldController.freezeAwardingContainerInfo;
	}

	get moneyWheelAwardingContainerInfo()
	{
		return this._gameScreen.gameFieldController.moneyWheelAwardingContainerInfo;
	}

	get isAnyAwardingInProgress()
	{
		return this.view && this.view.isAnyAwardingInProgress  ||  (this._pendingAwardsAmount_num > 0) || !!this._fDealyedParams_obj;
	}

	get hasUncountedAwards()
	{
		return this.view && this.view.hasUncountedAwards  ||  (this._pendingAwardsAmount_num > 0) || !!this._fDealyedParams_obj;
	}

	get isAnyMoneyWheelAwardExpected()
	{
		if (!this._awardsInfo_arr || !this._awardsInfo_arr.length)
		{
			return false;
		}

		for (let i=0; i<this._awardsInfo_arr.length; i++)
		{
			let curAwardInfo = this._awardsInfo_arr[i];
			if (!curAwardInfo.isQualifyWinDevalued)
			{
				if (curAwardInfo.awardId.indexOf(MONEY_WHEEL_AWARD_ID_PREFIX) >= 0)
				{
					return true;
				}
			}
		}

		return false;
	}
	
	getAwardByRid(aRid_num, aEnemyId_num)
	{
		return this.view ? this.view.getAwardByRid(aRid_num, aEnemyId_num) : null;
	}

	getPendingAwardInfo(awardId)
	{
		return this._getAwardInfo(awardId);
	}

	removeAllAwardings()
	{
		this._removeAllAwardings();
	}

	constructor()
	{
		super(new AwardingInfo(), new AwardingView());

		this._gameScreen = null;
		this._pendingAwardsAmount_num = 0; // we need this counter together with _awardsInfo_arr, because _pendingAwardsAmount_num counts money awards seperatly, but _awardsInfo_arr includes info got fron the server
		this._awardsInfo_arr = [];
		this._fPendingAwardAfterDeathEnemy_arr = [];

		this._fDealyedParams_obj = null;
	}

	__initControlLevel()
	{
		super.__initControlLevel();

		this._gameScreen = APP.gameScreen;

		this._gameScreen.once(GameScreen.EVENT_ON_READY, this._onGameScreenReady, this);
		this._gameScreen.on(GameScreen.EVENT_ON_HIT_AWARD_EXPECTED, this._onHitAwardExpected, this);
		this._gameScreen.on(GameScreen.EVENT_ON_CLOSE_ROOM, this._onCloseRoom, this);
		this._gameScreen.on(GameScreen.EVENT_ON_GAME_FIELD_CLEARED, this._onGameFieldCleared, this);
		this._gameScreen.on(GameScreen.EVENT_ON_PLAYER_REMOVED, this._onPlayerSitOut, this);
		this._gameScreen.on(GameScreen.EVENT_ON_ROOM_PAUSED, this._onPause, this);

		APP.playerController.on(GamePlayerController.EVENT_ON_QUALIFY_WIN_SYNC_BY_SERVER_STARTING, this._onQualifyWinStartSyncWithServerValue, this);

		this._gameScreen.bossModeController.on(BossModeController.EVENT_ON_TIME_TO_PRESENT_MULTIPLIER, this._onBossModeTimeToShowDefeatedCaption, this);
		this._gameScreen.bossModeController.on(BossModeController.EVENT_ON_PLAYER_WIN_CAPTION_FINISHED, this._onPlayerWinCaptionAnimationFinished, this);
	}

	__initViewLevel()
	{
		super.__initViewLevel();

		this.view.on(AwardingView.EVENT_ON_AWARD_COUNTED, this.emit, this);
		this.view.on(AwardingView.EVENT_ON_AWARD_ANIMATION_STARTED, this.emit, this);
		this.view.on(AwardingView.EVENT_ON_AWARD_ANIMATION_INTERRUPTED, this.emit, this);
		this.view.on(AwardingView.EVENT_ON_AWARD_ANIMATION_COMPLETED, this.emit, this);
		this.view.on(AwardingView.EVENT_ON_ALL_ANIMATIONS_COMPLETED, this._onAllAnimationsCompleted, this);
		this.view.on(AwardingView.EVENT_ON_COIN_LANDED, this.emit, this);

		this.view.on(AwardingView.EVENT_ON_PAYOUT_IS_VISIBLE, this.emit, this);
	}

	_onAllAnimationsCompleted()
	{
		if (this.isAnyAwardingInProgress)
		{
			// possible when some awards are still not generated
			return;
		}

		this.emit(AwardingController.EVENT_ON_ALL_ANIMATIONS_COMPLETED);
	}

	_onPause()
	{
		// Cancel awards waiting for death animations
		this._gameScreen.off(GameScreen.EVENT_ON_DEATH_COIN_AWARD);
	}

	_onGameScreenReady()
	{
		this._gameField = this._gameScreen.gameFieldController;

		this._fPrizesController_psc = this._gameScreen.prizesController;
		this._fPrizesController_psc.on(PrizesController.i_EVENT_ON_TIME_TO_SHOW_CASH_PRIZES, this._onTimeToShowCashPrizes, this);

		this._gameField.once(GameFieldController.EVENT_ON_GAME_FIELD_SCREEN_CREATED, this._onGameFieldScreenCreated, this);
	}

	_onGameFieldScreenCreated()
	{
		this._fMoneyWheelController_fmwc = APP.currentWindow.gameFieldController.moneyWheelController;
		this._fMoneyWheelController_fmwc.on(MoneyWheelController.EVENT_ON_MONEY_WHEEL_WIN_REGISTER, this._onMoneyWheelAwardRegister, this);
		this._fMoneyWheelController_fmwc.on(MoneyWheelController.EVENT_ON_MONEY_WHEEL_WIN_REQUIRED, this._onTimeToShowMoneyWheelAward, this);
		this._fMoneyWheelController_fmwc.on(MoneyWheelController.EVENT_ON_MONEY_WHEEL_INTERRUPTED, this._onMoneyWheelInterrupted, this);
	}

	_onMoneyWheelAwardRegister(event)
	{
		let hitData = event.hitData;
		let awardedWin = event.awardedWin;

		let hitEnemyIdSuff = "";
		if (hitData.enemyId !== undefined)
		{
			hitEnemyIdSuff = hitData.enemyId;
		}

		let awardData = {};
		awardData.awardedWin = awardedWin;
		awardData.awardId = MONEY_WHEEL_AWARD_ID_PREFIX + hitData.rid + hitEnemyIdSuff;

		if (awardData.awardedWin > 0)
		{
			awardData.awardId += "" + awardData.awardedWin;
		}

		hitData.awardId = awardData.awardId;

		awardData.isQualifyWinDevalued = false;

		this._awardsInfo_arr.push(awardData);

		this._pendingAwardsAmount_num++;
	}

	_onTimeToShowMoneyWheelAward(aEvent_obj)
	{
		if (aEvent_obj.isBigWin) return;

		let lMoneyWheelWinValue_num = aEvent_obj.moneyValue;

		if (this._gameScreen.bossModeController.isPlayerWinAnimationInProgress)
		{
			if (lMoneyWheelWinValue_num > 0)
			{
				this._pendingAwardsAmount_num--;
			}

			var lParams_obj = aEvent_obj.params;
			if (lParams_obj)
			{
				let lAwardInfo_obj = this._getAwardInfo(lParams_obj.awardId);
				if (lAwardInfo_obj)
				{

					lParams_obj.rid = lAwardInfo_obj.rid;
					this._removeAwardInfo(lParams_obj.awardId);
				}
			}

			this.emit(AwardingController.EVENT_ON_PENDING_AWARDS_SKIPPED, {skippedPendingAwardsWin: lMoneyWheelWinValue_num, isValueDisplayRequired:true});
		}
		else
		{
			this._showAwarding(lMoneyWheelWinValue_num, aEvent_obj.currentStake, aEvent_obj.params);
		}
	}

	_onBossModeTimeToShowDefeatedCaption()
	{
		if (this.view.isAnyMoneyWheelPayoutPresentationInProgress || this.view.isFreezeAwardInProgress)
		{
			this.view.removeMoneyWheelOrFreezeAwards();
		}
		this.view.isFreezeAwardCanBePresented = false;
	}

	_onPlayerWinCaptionAnimationFinished()
	{
		this.view.isFreezeAwardCanBePresented = true;
	}

	_onMoneyWheelInterrupted(event)
	{
		if (event.isBigWin) return;

		if (event.MoneyWheelWin > 0)
		{
			this._pendingAwardsAmount_num--;
			this.emit(AwardingController.EVENT_ON_PENDING_AWARDS_SKIPPED, {skippedPendingAwardsWin: event.MoneyWheelWin});
		}

		let lAwardId_int = event.awardId;

		if (lAwardId_int)
		{
			if (this._getAwardInfo(lAwardId_int))
			{
				this._removeAwardInfo(lAwardId_int);
			}
		}
	}
	
	_onPlayerSitOut(e)
	{
		let lSeatId_int = e.seatId;
		this.view.destroyCoinsAwardsByDestinationSeatId(lSeatId_int);
	}

	_onTimeToShowCashPrizes(event)
	{
		let lAwardings_obj_arr = event.data;

		let lTotalWinsCountForThisGroup_int = lAwardings_obj_arr.length;
		for (let lAwardingParams_obj of lAwardings_obj_arr)
		{
			if (lAwardingParams_obj.hitData.skipAwardedWin
				// If award is bonus for capsule, always show to other players
				&& !(lAwardingParams_obj.hitData.killBonusPay == lAwardingParams_obj.winCash
						&& APP.playerController.info.seatId != lAwardingParams_obj.seatId
				)
			)
			{
				continue;
			}

			this._prepareAwardingForSeat(
				lAwardingParams_obj.seatId,
				lAwardingParams_obj.winCash,
				lAwardingParams_obj.hitData,
				lAwardingParams_obj.awardStartPosition,
				lAwardingParams_obj.startOffset,
				lAwardingParams_obj.isBoss,
				lAwardingParams_obj.isBossMasterFinalWin,
				lTotalWinsCountForThisGroup_int
			);
		}
	}

	_prepareAwardingForSeat(aSeatId_int, aWinValue_num, aHitData_obj, aStartPosition_pt, aStartOffset_pt, aIsBoss_bl, aIsBossMasterFinalWin_bl, aTotalWinsCountForThisGroup_int)
	{
		let lSeatId_int 		= aSeatId_int; //target seatId for win
		let lWinValue_num 		= aWinValue_num;

		let hitData 			= aHitData_obj;
		let lStartPosition_pt	= aStartPosition_pt;

		let spot 				= this._gameField.getSeat(lSeatId_int, true);

		let lWinPoint_pt = null;
		if (spot)
		{
			if (APP.isBattlegroundGame && aHitData_obj.rid > 0)
			{
				lWinPoint_pt = spot.scoreFieldPosition;
				lWinPoint_pt = spot.localToGlobal(lWinPoint_pt.x, lWinPoint_pt.y);
			}
			else
			{
				lWinPoint_pt = spot.spotVisualCenterPoint;
			}
		}

		let lCurrentStake_num = APP.playerController.info.currentStake;
		let lAwardedWin_num = lWinValue_num;

		let lEnemyId_num = hitData.enemyId;
		if (!hitData.enemyId && hitData.enemy && hitData.enemy.id)
		{
			lEnemyId_num = hitData.enemy.id;
		}

		this._showAwarding(
			lAwardedWin_num,
			lCurrentStake_num,
			{
				start: lStartPosition_pt,
				winPoint: lWinPoint_pt,
				isQualifyWinDevalued: (hitData.isQualifyWinDevalued || false),
				awardId: hitData.awardId, // added as unique id to remove award info from the queue (AwardingController._awardsInfo_arr)
				seatId: lSeatId_int,
				startOffset: aStartOffset_pt,
				isBoss: aIsBoss_bl,
				isBossMasterFinalWin: aIsBossMasterFinalWin_bl,
				totalWinsCount: aTotalWinsCountForThisGroup_int,
				rid: hitData.rid,
				chMult: hitData.chMult,
				enemyId: lEnemyId_num,
				killed: hitData.killed,
				isFullGameInfoUpdateExpected: hitData.fullGameInfoUpdateExpected,
				enemyTypeId: hitData.enemy && hitData.enemy.typeId
			}
		);
	}

	_showAwarding(aMoneyValue_num, aCurrentStake_num, aParams_obj)
	{
		if (aMoneyValue_num > 0)
		{
			this._pendingAwardsAmount_num--;
		}

		if (aParams_obj)
		{
			let lAwardInfo_obj = this._getAwardInfo(aParams_obj.awardId);
			if (lAwardInfo_obj)
			{

				aParams_obj.rid = lAwardInfo_obj.rid;
				this._removeAwardInfo(aParams_obj.awardId);
			}
		}

		if (aParams_obj && aParams_obj.isBossMasterFinalWin)
		{
			// boss final win
			this._fDealyedParams_obj = {
				moneyValue: aMoneyValue_num,
				currentStake: aCurrentStake_num,
				params: aParams_obj,
				coinExplosion: false
			}

			this._fPendingAwardAfterDeathEnemy_arr.push({awardId: aParams_obj.awardId, win: aMoneyValue_num});
			this._gameScreen.once(GameScreen.EVENT_ON_TIME_TO_EXPLODE_COINS,  e=>this._onTimeToExplodeCoins(aParams_obj.awardId, Object.assign({}, e)), this);
		}
		else if (aParams_obj && aParams_obj.killed && !~CAPSULES_ENEMY_TYPES.indexOf(aParams_obj.enemyTypeId))
		{
			this._fPendingAwardAfterDeathEnemy_arr.push({awardId: aParams_obj.awardId, win: aMoneyValue_num});
			this._gameScreen.once(GameScreen.EVENT_ON_DEATH_COIN_AWARD, e=>this._showSingleAwardAfterDeathEnemy(aMoneyValue_num, aCurrentStake_num, Object.assign(aParams_obj, e)), this);
		}
		else
		{
			if (aParams_obj && aParams_obj.rid === -1 && aParams_obj.enemyTypeId === ENEMY_TYPES.FREEZE_CAPSULE) //final freeze win
			{
				aParams_obj.isFreezeWin = true;
			}

			this._showSingleAward(aMoneyValue_num, aCurrentStake_num, aParams_obj);
		}
	}

	_showSingleAwardAfterDeathEnemy(aMoneyValue_num, aCurrentStake_num, aParams_obj, aStartShift_obj = null, aDelay_num = 0)
	{
		this._removePendingAwardAfterDeathEnemy(aParams_obj.awardId);

		this._showSingleAward(aMoneyValue_num, aCurrentStake_num, aParams_obj, aStartShift_obj = null, aDelay_num = 0)
	}

	_removePendingAwardAfterDeathEnemy(aAwardId)
	{
		for (let i = 0; i < this._fPendingAwardAfterDeathEnemy_arr.length; i++)
		{
			let curAwardInfo = this._fPendingAwardAfterDeathEnemy_arr[i];
			if (curAwardInfo.awardId === aAwardId)
			{
				this._fPendingAwardAfterDeathEnemy_arr.splice(i, 1);
				break;
			}
		}
	}

	_showSingleAward(aMoneyValue_num, aCurrentStake_num, aParams_obj, aStartShift_obj = null, aDelay_num = 0)
	{
		let lContainer_spr;

		if (aParams_obj.isFreezeWin)
		{
			lContainer_spr = this.freezeAwardingContainerInfo;
		}
		else if (aParams_obj.isMoneyWheelWin)
		{
			lContainer_spr = this.moneyWheelAwardingContainerInfo;
		}
		else 
		{
			lContainer_spr = this.awardingContainerInfo;
		}
		
		this.view.addToContainerIfRequired(lContainer_spr);
		this.view.showAwarding(aMoneyValue_num, aCurrentStake_num, aParams_obj, aStartShift_obj, aDelay_num);
	}

	_onTimeToExplodeCoins(aAwardId)
	{
		this._removePendingAwardAfterDeathEnemy(aAwardId);

		if (!this.view || !this._fDealyedParams_obj) return;

		this._fDealyedParams_obj.params.coinExplosion = this._fDealyedParams_obj.coinExplosion;
		this._showSingleAward(this._fDealyedParams_obj.moneyValue, this._fDealyedParams_obj.currentStake, this._fDealyedParams_obj.params);

		this._fDealyedParams_obj = null;
	}

	_onQualifyWinStartSyncWithServerValue()
	{
		this._removeAllAwardings();
		this._devaluePendingAwards();
	}

	_devaluePendingAwards()
	{
		let devaluedPendingAwardsWin = 0;
		for (let i=0; i<this._awardsInfo_arr.length; i++)
		{
			let pendingAward = this._awardsInfo_arr[i];
			if (pendingAward.awardedWin > 0)
			{
				pendingAward.isQualifyWinDevalued = true;
				devaluedPendingAwardsWin += pendingAward.awardedWin;

				if (pendingAward.killBonusPay)
				{
					if (pendingAward.killed && pendingAward.isKilledBossHit)
					{
						// killBonusPay for boss death will be presented in boss you win
					}
					else
					{
						devaluedPendingAwardsWin += pendingAward.killBonusPay;
					}
				}
			}
		}

		if (devaluedPendingAwardsWin > 0)
		{
			this.emit(AwardingController.EVENT_ON_PENDING_AWARDS_DEVALUED , {devaluedPendingAwardsWin: devaluedPendingAwardsWin});
		}
	}

	_onHitAwardExpected(event)
	{
		if (event.hitData.seatId !== event.masterSeatId) return;

		this._addNewPendingHitAward(event.hitData);
	}

	_addNewPendingHitAward(hitData)
	{
		if (hitData.awardedWin > 0 && hitData.skipAwardedWin)
		{
			return;
		}

		if (hitData.enemy.typeId == 51) return;

		let hitEnemyIdSuff = "";
		if (hitData.enemyId !== undefined)
		{
			hitEnemyIdSuff = hitData.enemyId;
		}

		hitData.awardId = "" + hitData.rid + hitEnemyIdSuff;
		if (hitData.awardedWin > 0 && !hitData.skipAwardedWin)
		{
			hitData.awardId += "" + hitData.awardedWin;
		}

		let lPendingAwardDefined_bl = false;

		if (hitData.awardedWin > 0 && !hitData.skipAwardedWin)
		{
			hitData.isQualifyWinDevalued = false;

			this._pendingAwardsAmount_num++;
			lPendingAwardDefined_bl = true;
		}

		if (lPendingAwardDefined_bl)
		{
			this._awardsInfo_arr.push(hitData);
		}
	}

	_onCloseRoom()
	{
		this._removeAllAwardings();

		this._clearAwardsinfo();
	}

	_onGameFieldCleared()
	{
		this._gameScreen.off(GameScreen.EVENT_ON_DEATH_COIN_AWARD);
		
		this._removeAllAwardings();

		this._clearAwardsinfo();
	}

	_removeAllAwardings()
	{
		this._fDealyedParams_obj = null;
		this._pendingAwardsAmount_num = 0;
		this.view && this.view.removeAllAwarding();
	}

	_removeAwardInfo(awardId)
	{
		for (let i=0; i<this._awardsInfo_arr.length; i++)
		{
			let curAwardInfo = this._awardsInfo_arr[i];
			if (curAwardInfo.awardId === awardId)
			{
				this._awardsInfo_arr.splice(i, 1);
				break;
			}
		}
	}

	_getAwardInfo(awardId)
	{
		for (let i=0; i<this._awardsInfo_arr.length; i++)
		{
			let curAwardInfo = this._awardsInfo_arr[i];
			if (curAwardInfo.awardId === awardId)
			{
				return curAwardInfo;
			}
		}

		return null;
	}

	_clearAwardsinfo()
	{
		let skippedPendingAwardsWin = 0;

		for (let i=0; i<this._awardsInfo_arr.length; i++)
		{
			let curAwardInfo = this._awardsInfo_arr[i];
			if (!curAwardInfo.isQualifyWinDevalued)
			{
				skippedPendingAwardsWin += curAwardInfo.awardedWin;

				if (curAwardInfo.killBonusPay)
				{
					if (pendingAward.killed && pendingAward.isKilledBossHit)
					{
						// killBonusPay for boss death will be presented in boss you win
					}
					else
					{
						skippedPendingAwardsWin += curAwardInfo.killBonusPay;
					}
				}
			}
		}

		for (let i=0; i<this._fPendingAwardAfterDeathEnemy_arr.length; i++)
		{
			skippedPendingAwardsWin += this._fPendingAwardAfterDeathEnemy_arr[i].win;
		}

		this._awardsInfo_arr = [];
		this._fPendingAwardAfterDeathEnemy_arr = [];

		if (skippedPendingAwardsWin > 0)
		{
			this.emit(AwardingController.EVENT_ON_PENDING_AWARDS_SKIPPED, {skippedPendingAwardsWin: skippedPendingAwardsWin});
		}
	}

	destroy()
	{
		this._gameScreen.off(GameScreen.EVENT_ON_HIT_AWARD_EXPECTED, this._onHitAwardExpected, this);
		this._gameScreen.off(GameScreen.EVENT_ON_CLOSE_ROOM, this._onCloseRoom, this);
		this._gameScreen.off(GameScreen.EVENT_ON_GAME_FIELD_CLEARED, this._onGameFieldCleared, this);
		this._gameScreen = null;

		this._awardsInfo_arr = null;

		this._fDealyedParams_obj = null;
		this._fPendingAwardAfterDeathEnemy_arr = null;

		if (this._fMoneyWheelController_fmwc)
		{
			this._fMoneyWheelController_fmwc.off(MoneyWheelController.EVENT_ON_MONEY_WHEEL_WIN_REGISTER, this._onMoneyWheelAwardRegister, this);
			this._fMoneyWheelController_fmwc.off(MoneyWheelController.EVENT_ON_MONEY_WHEEL_WIN_REQUIRED, this._onTimeToShowMoneyWheelAward, this);
		}

		super.destroy();
	}

}

export default AwardingController
