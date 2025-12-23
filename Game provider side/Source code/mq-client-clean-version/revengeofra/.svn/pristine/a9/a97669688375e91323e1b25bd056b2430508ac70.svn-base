import SimpleUIController from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/uis/base/SimpleUIController';
import GameScreen from '../../../main/GameScreen';
import AwardingInfo from '../../../model/uis/awarding/AwardingInfo';
import AwardingView from '../../../view/uis/awarding/AwardingView';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import GamePlayerController from '../../custom/GamePlayerController';
import { FRAME_RATE, WEAPONS } from './../../../../../shared/src/CommonConstants';
import PrizesController from '../prizes/PrizesController';
import MassDeathManager from '../../../main/MassDeathManager';
import MoneyWheelController from './../quests/wheel/MoneyWheelController';
import GameField from './../../../main/GameField';

const MONEY_WHEEL_AWARD_ID_PREFIX = "mv_";

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

	get awardingContainerInfo()
	{
		return this._gameScreen.gameField.awardingContainerInfo;
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

		this._gameScreen.massDeathManager.on(MassDeathManager.EVENT_ON_EXPLOSION_HIT_AWARD_EXPECTED, this._onMassDeathExplosionHitAwardExpected, this);

		APP.playerController.on(GamePlayerController.EVENT_ON_QUALIFY_WIN_SYNC_BY_SERVER_STARTING, this._onQualifyWinStartSyncWithServerValue, this);
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
	}

	_onAllAnimationsCompleted(event)
	{
		if (this.isAnyAwardingInProgress)
		{
			// possible when some awards are still not generated
			return;
		}

		this.emit(AwardingController.EVENT_ON_ALL_ANIMATIONS_COMPLETED);
	}

	_onGameScreenReady(event)
	{
		this._gameField = this._gameScreen.gameField;

		this._fPrizesController_psc = this._gameScreen.prizesController;
		this._fPrizesController_psc.on(PrizesController.i_EVENT_ON_TIME_TO_SHOW_CASH_PRIZES, this._onTimeToShowCashPrizes, this);

		APP.currentWindow.gameField.once(GameField.EVENT_ON_GAME_FIELD_SCREEN_CREATED, this._onGameFieldScreenCreated, this);
	}

	_onGameFieldScreenCreated()
	{
		let moneyWheelController = APP.currentWindow.gameField.moneyWheelController;
		moneyWheelController.on(MoneyWheelController.EVENT_ON_MONEY_WHEEL_WIN_REGISTER, this._onMoneyWheelAwardRegister, this);
		moneyWheelController.on(MoneyWheelController.EVENT_ON_MONEY_WHEEL_WIN_REQUIRED, this._onTimeToShowMoneyWheelAward, this);
	}

	_onPlayerSitOut(e)
	{
		let lSeatId_int = e.seatId;
		this.view.destroyCoinsAwardsByDestinationSeatId(lSeatId_int);
	}

	_onTimeToShowCashPrizes(event)
	{
		let lAwardings_obj_arr = event.data;

		let lStartDelay_int = 0;
		let lTotalWinsCountForThisGroup_int = lAwardings_obj_arr.length;
		for (let lAwardingParams_obj of lAwardings_obj_arr)
		{
			if (lAwardingParams_obj.hitData.skipAwardedWin)
			{
				continue;
			}

			this._prepareAwardingForSeat(lAwardingParams_obj.seatId,
										 lAwardingParams_obj.winCash,
										 lAwardingParams_obj.hitData,
										 lAwardingParams_obj.awardStartPosition,
										 lAwardingParams_obj.startOffset,
										 lAwardingParams_obj.isBoss,
										 lAwardingParams_obj.isBossMasterFinalWin,
										 lTotalWinsCountForThisGroup_int,
										 lStartDelay_int);
			lStartDelay_int += 10*FRAME_RATE;
		}
	}

	_prepareAwardingForSeat(aSeatId_int, aWinValue_num, aHitData_obj, aStartPosition_pt, aStartOffset_pt, aIsBoss_bl, aIsBossMasterFinalWin_bl, aTotalWinsCountForThisGroup_int, aOptStartDelay_num = 0)
	{
		let lSeatId_int 		= aSeatId_int; //target seatId for win
		let lWinValue_num 		= aWinValue_num;

		let hitData 			= aHitData_obj;
		let lStartPosition_pt	= aStartPosition_pt;

		let spot 				= this._gameField.getSeat(lSeatId_int, true);

		let lWinPoint_pt = spot ? spot.spotVisualCenterPoint : null;
		let lIsMasterSeat_bl = (+lSeatId_int === APP.playerController.info.seatId)
		//* We would like for a players coins to fly towards their player pad
		// if (lIsMasterSeat_bl)
		// {
		// 	lWinPoint_pt = WIN_FIELD_DESTINATION_POSITION;// win field position
		// }

		let lCurrentStake_num = APP.playerController.info.currentStake;
		let lAwardedWin_num = lWinValue_num;

		if (!lIsMasterSeat_bl) hitData.enemiesInstantKilled = {};

		let lMassExplosiveWin_bln = false;
		if (
				this._isMassDamageWeapon(hitData.usedSpecialWeapon)
				|| (hitData.enemiesInstantKilled && lIsMasterSeat_bl)
			)
		{
			if (lIsMasterSeat_bl)
			{
				lMassExplosiveWin_bln = true;
			}
		}

		let isBombEnemy = hitData.enemiesInstantKilled ? Object.keys(hitData.enemiesInstantKilled).length > 0 : false;

		if (hitData.instanceKill || hitData.killBonusPay > 0)
		{
			hitData.chMult = 0;
		}

		let lEnemyId_num = hitData.enemyId;
		if (!hitData.enemyId && hitData.enemy && hitData.enemy.id)
		{
			lEnemyId_num = hitData.enemy.id;
		}

		let lFollowEnemy_bln = true;

		if (hitData.instanceKill || hitData.killBonusPay > 0 || hitData.chMult > 1 || this._isMassDamageWeapon(hitData.usedSpecialWeapon))
		{
			lFollowEnemy_bln = false;
		}

		if (lFollowEnemy_bln || hitData.killBonusPay > 0 || hitData.chMult > 1)
		{
			lMassExplosiveWin_bln = false;
		}

		this._showAwarding(
							lAwardedWin_num,
							lCurrentStake_num,
							{
								start: lStartPosition_pt,
								winPoint: lWinPoint_pt,
								xpPoint:null,
								isQualifyWinDevalued: (hitData.isQualifyWinDevalued || false),
								awardId: hitData.awardId, // added as unique id to remove award info from the queue (AwardingController._awardsInfo_arr)
								seatId: lSeatId_int,
								startDelay: aOptStartDelay_num,
								startOffset: aStartOffset_pt,
								isBoss: aIsBoss_bl,
								isBossMasterFinalWin: aIsBossMasterFinalWin_bl,
								totalWinsCount: aTotalWinsCountForThisGroup_int,
								massExplosiveWin: lMassExplosiveWin_bln,
								rid: hitData.rid,
								mineId: hitData.mineId,
								enemiesInstantKilled: hitData.enemiesInstantKilled,
								isBombEnemy: isBombEnemy,
								killedByBomb: hitData.killedByBomb,
								chMult: hitData.chMult,
								killBonusPay: hitData.killBonusPay,
								enemyId: lEnemyId_num,
								followEnemy: lFollowEnemy_bln,
								killed: hitData.killed,
							}
						);
	}

	_isMassDamageWeapon(aUsedSpecialWeapon_num)
	{
		return (
			aUsedSpecialWeapon_num === WEAPONS.MINELAUNCHER
		 || aUsedSpecialWeapon_num === WEAPONS.ARTILLERYSTRIKE
		 || aUsedSpecialWeapon_num === WEAPONS.FLAMETHROWER
		 || aUsedSpecialWeapon_num === WEAPONS.CRYOGUN)
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
				aParams_obj.mineId = lAwardInfo_obj.mineId;
				this._removeAwardInfo(aParams_obj.awardId);
			}
		}

		if (aParams_obj && !!aParams_obj.isBossMasterFinalWin)
		{
			// boss final win
			this._fDealyedParams_obj = {
											moneyValue: aMoneyValue_num,
											currentStake: aCurrentStake_num,
											params: aParams_obj,
											coinExplosion: true
										}
			this._gameScreen.once(GameScreen.EVENT_ON_TIME_TO_EXPLODE_COINS, this._onTimeToExplodeCoins, this);
		}
		else
		{
			this._showSingleAward(aMoneyValue_num, aCurrentStake_num, aParams_obj);
		}
	}

	_showSingleAward(aMoneyValue_num, aCurrentStake_num, aParams_obj, aStartShift_obj = null, aDelay_num = 0)
	{
		this.view.addToContainerIfRequired(this.awardingContainerInfo);
		this.view.showAwarding(aMoneyValue_num, aCurrentStake_num, aParams_obj, aStartShift_obj, aDelay_num);
	}

	_onTimeToExplodeCoins()
	{
		if (!this.view || !this._fDealyedParams_obj) return;

		this._fDealyedParams_obj.params.coinExplosion = this._fDealyedParams_obj.coinExplosion;
		this._showSingleAward(this._fDealyedParams_obj.moneyValue, this._fDealyedParams_obj.currentStake, this._fDealyedParams_obj.params);

		this._fDealyedParams_obj = null;
	}

	_onQualifyWinStartSyncWithServerValue(event)
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
					devaluedPendingAwardsWin += pendingAward.killBonusPay;
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

		this._addNewPendingHitAward(event.hitData, event.masterSeatId);
	}

	_onMassDeathExplosionHitAwardExpected(event)
	{
		if (!this._gameScreen.gameField || event.explodeHitData.seatId !== this._gameScreen.gameField.seatId) return;

		this._addNewPendingHitAward(event.explodeHitData);
	}

	_addNewPendingHitAward(hitData, masterSeatId)
	{
		if (hitData.awardedWin > 0 && hitData.skipAwardedWin)
		{
			return;
		}

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
		if (hitData.mineId && hitData.mineId.length > 0)
		{
			hitData.awardId += "" + hitData.mineId;
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
		if (hitData.mineId && hitData.mineId.length > 0)
		{
			awardData.awardId += "" + hitData.mineId;
		}

		hitData.awardId = awardData.awardId;

		awardData.isQualifyWinDevalued = false;

		this._awardsInfo_arr.push(awardData);

		this._pendingAwardsAmount_num++;
	}

	_onTimeToShowMoneyWheelAward(event)
	{
		if (event.isBigWin) return;

		this._showAwarding(...event.data);
	}

	_onCloseRoom(event)
	{
		this._removeAllAwardings();

		this._clearAwardsinfo();
	}

	_onGameFieldCleared(event)
	{
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
					skippedPendingAwardsWin += curAwardInfo.killBonusPay;
				}
			}
		}
		this._awardsInfo_arr = [];

		if (skippedPendingAwardsWin > 0)
		{
			this.emit(AwardingController.EVENT_ON_PENDING_AWARDS_SKIPPED, {skippedPendingAwardsWin: skippedPendingAwardsWin});
		}
	}

	destroy()
	{
		this._gameScreen.off(GameScreen.EVENT_ON_CLOSE_ROOM, this._onCloseRoom, this);
		this._gameScreen.off(GameScreen.EVENT_ON_GAME_FIELD_CLEARED, this._onGameFieldCleared, this);
		this._gameScreen = null;

		this._awardsInfo_arr = null;

		this._fDealyedParams_obj = null;

		super.destroy();
	}

}

export default AwardingController
