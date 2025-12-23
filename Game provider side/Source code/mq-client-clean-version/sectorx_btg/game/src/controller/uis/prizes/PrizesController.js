import SimpleController from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/base/SimpleController';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import GameScreen from '../../../main/GameScreen';
import GameFieldController from '../../../controller/uis/game_field/GameFieldController';
import { Utils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import ShotResponsesController from '../../../controller/custom/ShotResponsesController';
import { WEAPONS, ENEMY_TYPES } from '../../../../../shared/src/CommonConstants';

export const HIT_RESULT_SINGLE_CASH_ID 		= 0;
export const HIT_RESULT_SPECIAL_WEAPON_ID 	= 2;
export const HIT_RESULT_ADDITIONAL_CASH_ID	= 3; // in Pirates it is Final Win for Boss
export const HIT_RESULT_MONEY_WHEEL_WIN_ID 	= 4;
export const HIT_RESULT_BOMB_WIN_ID 		= 5;

const HALF_PI = Math.PI / 2;

class PrizesController extends SimpleController {

	static get i_EVENT_ON_TIME_TO_SHOW_CASH_PRIZES() 				{ return 'i_EVENT_ON_TIME_TO_SHOW_CASH_PRIZES';}
	static get i_EVENT_ON_TIME_TO_SHOW_MASTER_SCORE_PRIZE() 		{ return 'i_EVENT_ON_TIME_TO_SHOW_MASTER_SCORE_PRIZE';}
	static get i_EVENT_ON_TIME_TO_SHOW_SPECIAL_WEAPON_PRIZE() 		{ return 'EVENT_ON_TIME_TO_SHOW_SPECIAL_WEAPON_PRIZE';}
	static get i_EVENT_ON_TIME_TO_SHOW_MONEY_WHEEL_PRIZE() 			{ return 'EVENT_ON_TIME_TO_SHOW_MONEY_WHEEL_PRIZE';}
	static get i_EVENT_ON_TIME_TO_SHOW_BOMB_PRIZE() 				{ return 'i_EVENT_ON_TIME_TO_SHOW_BOMB_PRIZE';}

	static isAnyCashAwardAnimationRequired(aHitData_obj)
	{
		if (!!aHitData_obj.hitResultBySeats && !Utils.isEmptyObject(aHitData_obj.hitResultBySeats))
		{
			for (let lSeatId_int in aHitData_obj.hitResultBySeats)
			{
				let lPrizesForSeat_obj_arr = aHitData_obj.hitResultBySeats[lSeatId_int];
				let lWinCash_num = 0;

				for (let lPrize_obj of lPrizesForSeat_obj_arr)
				{
					switch (lPrize_obj.id)
					{
						case HIT_RESULT_SINGLE_CASH_ID:
						case HIT_RESULT_ADDITIONAL_CASH_ID:
						case HIT_RESULT_MONEY_WHEEL_WIN_ID:
							lWinCash_num += +lPrize_obj.value;
							if (lWinCash_num > 0) return true;
							break;
					}
				}
			}
		}
		return false;
	}

	static isAnySpecialWeaponAwardAnimationRequired(aHitData_obj)
	{
		if (!!aHitData_obj.hitResultBySeats && !Utils.isEmptyObject(aHitData_obj.hitResultBySeats))
		{
			for (let lSeatId_int in aHitData_obj.hitResultBySeats)
			{
				let lPrizesForSeat_obj_arr = aHitData_obj.hitResultBySeats[lSeatId_int];
				for (let lPrize_obj of lPrizesForSeat_obj_arr)
				{
					if (lPrize_obj.id === HIT_RESULT_SPECIAL_WEAPON_ID)
					{
						return true;
					}
				}
			}
		}
		return false;
	}

	constructor()
	{
		super();
		this._fPendingHitDataBySeats_obj = {};
	}

	__initControlLevel()
	{
		super.__initControlLevel();

		this._gameScreen = APP.gameScreen;
		this._gameScreen.once(GameScreen.EVENT_ON_READY, this._onGameScreenReady, this);
		this._gameScreen.on(GameScreen.EVENT_ON_PLAYER_REMOVED, this._onPlayerSitOut, this);
		this._gameScreen.on(GameScreen.EVENT_ON_ROOM_FIELD_CLEARED, this._onRoomFieldCleared, this);

		let shotResponsesController = this._gameScreen.shotResponsesController;
		shotResponsesController.on(ShotResponsesController.EVENT_ON_SERVER_SHOT_RESPONSE, this._onServerShotResponse, this);
	}

	_onGameScreenReady()
	{
		this._gameField = this._gameScreen.gameFieldController;
		this._gameField.on(GameFieldController.EVENT_TIME_TO_SHOW_PRIZES, this._onTimeToShowPrizes, this);
	}

	_onRoomFieldCleared()
	{
		//clear pending hit data
		this._fPendingHitDataBySeats_obj = {};
	}

	_onPlayerSitOut(event)
	{
		let lSeatId_int = event.seatId;
		delete this._fPendingHitDataBySeats_obj[lSeatId_int];
	}

	_onServerShotResponse(event)
	{
		let lShotResponseInfo_sri = event.info;
		if (lShotResponseInfo_sri.isHit)
		{
			this._onServerHitMessage({messageData: lShotResponseInfo_sri.data});
		}
	}

	_onServerHitMessage(event)
	{
		let hitData = event.messageData;
		let id = hitData.id;
		for (let lSeatId_str in hitData.hitResultBySeats)
		{
			let lSeatId_int = +lSeatId_str;
			if (lSeatId_int == APP.playerController.info.seatId) continue; //for co-players only
			if (!this._fPendingHitDataBySeats_obj[lSeatId_int])
			{
				this._fPendingHitDataBySeats_obj[lSeatId_int] = {};
			}
			this._fPendingHitDataBySeats_obj[lSeatId_int][id] = hitData; //assuming [id] is unique and can be used as a unique identifier for hitData
		}
	}

	_onTimeToShowPrizes(event)
	{
		let prizesData 				= event.prizesData;
		let hitData 				= prizesData.hitData;
		let startPosition 			= prizesData.prizePosition;
		let isBoss 					= prizesData.isBoss;

		let lCashWins_obj_arr = [];
		let lMasterTotalCashWins_num = 0;
		let lMoneyWheelValue_num = 0;

		let cashCounter = 0;
		let angles = [180, -60, 120, 60, -120];

		if (hitData.awardedWeapons && !!hitData.awardedWeapons.length)
		{
			for (var i = 0; i < hitData.awardedWeapons.length; i++)
			{
				hitData.hitResultBySeats[hitData.seatId].push({id: HIT_RESULT_SPECIAL_WEAPON_ID, value: hitData.awardedWeapons[i].id});
			}
		}

		if (hitData.enemy && hitData.enemy.typeId === ENEMY_TYPES.GOLD_CAPSULE)
		{
			// if already exists (TODO to server to remove)
			let prizes = hitData.hitResultBySeats[hitData.seatId];
			let lIsMoneyWheelPrizeAlreadyExist_bl = false;
			for (let i=0; i<prizes.length; i++)
			{
				let prize = prizes[i];
				if (prize.id === HIT_RESULT_MONEY_WHEEL_WIN_ID)
				{
					lIsMoneyWheelPrizeAlreadyExist_bl = true;
					break;
				}
			}

			if (!lIsMoneyWheelPrizeAlreadyExist_bl)
			{
				if (!hitData.hitResultBySeats[hitData.seatId])
				{
					hitData.hitResultBySeats[hitData.seatId] = [];
				}
				hitData.hitResultBySeats[hitData.seatId].push({id: HIT_RESULT_MONEY_WHEEL_WIN_ID, value: hitData.moneyWheelWin});
			}
		}

		if (hitData.enemyId === ENEMY_TYPES.FREEZE_CAPSULE)
		{
			if (!hitData.hitResultBySeats)
			{
				hitData.hitResultBySeats = [];
			}
			if (!hitData.hitResultBySeats[hitData.seatId])
			{
				hitData.hitResultBySeats[hitData.seatId] = [{id: HIT_RESULT_ADDITIONAL_CASH_ID, value: hitData.winAmount}];
			}
		}

		for (let lSeatId_int in hitData.hitResultBySeats)
		{
			let lPrizesForSeat_obj_arr = hitData.hitResultBySeats[lSeatId_int];
			let lIsMasterSeat_bl = (+lSeatId_int === APP.playerController.info.seatId)

			if (!lIsMasterSeat_bl && !hitData.ignorePending)
			{
				//check if player already sit out
				if (!this._fPendingHitDataBySeats_obj[lSeatId_int] || !this._fPendingHitDataBySeats_obj[lSeatId_int][hitData.id])
				{
					if (hitData.enemyId !== ENEMY_TYPES.FREEZE_CAPSULE)
					{
						//console.log("[Y] player " + lSeatId_int + " already sit out ");
						continue;
					}
				}
			}

			if (this._fPendingHitDataBySeats_obj[lSeatId_int])
			{
				// can be deleted as it's going to be proceed for animation; meanwhile appropriate animation controllers are listening for Player sit out themselves
				delete this._fPendingHitDataBySeats_obj[lSeatId_int][hitData.id];
			}

			for (let lPrize_obj of lPrizesForSeat_obj_arr)
			{
				switch (lPrize_obj.id)
				{
					case HIT_RESULT_SINGLE_CASH_ID:
					case HIT_RESULT_ADDITIONAL_CASH_ID:
						let lWinCash_num = +lPrize_obj.value;
						if (hitData.isKilledBossHit && hitData.killed && APP.isBattlegroundGame)
						{
							lWinCash_num -= hitData.killBonusPay;
						}

						if (lWinCash_num > 0)
						{
							let awardStartPosition = new PIXI.Point(startPosition.x, startPosition.y);

							let angle = lIsMasterSeat_bl || hitData.enemy.typeId === ENEMY_TYPES.FREEZE_CAPSULE ? 0 : angles[cashCounter++ % angles.length];
							awardStartPosition.x -= Math.cos(-Utils.gradToRad(angle) + HALF_PI)*50;
							awardStartPosition.y -= Math.sin(-Utils.gradToRad(angle) + HALF_PI)*50;

							let lHitDataClone_obj = Object.assign({}, hitData);
							let lCashWinParams_obj = {
								seatId: +lSeatId_int,
								winCash: lWinCash_num,
								hitData: lHitDataClone_obj,
								awardStartPosition: awardStartPosition,
								isBoss: isBoss,
								isBossMasterFinalWin: (isBoss && hitData.killed)
							};
							if (lIsMasterSeat_bl)
							{
								if (lMasterTotalCashWins_num > 0)
								{
									// to avoid multiple score award animations for a sigle hitData, due to one hitData can contain several cash wins for master player
									lHitDataClone_obj.score = 0;
								}
								lMasterTotalCashWins_num += lWinCash_num;

								lCashWins_obj_arr.unshift(lCashWinParams_obj)
							}
							else
							{
								lHitDataClone_obj.score = 0;

								lCashWinParams_obj.startOffset = {x: 0, y: -50};
								lCashWins_obj_arr.push(lCashWinParams_obj);
							}
						}
						break;
					case HIT_RESULT_SPECIAL_WEAPON_ID:
						break;
					case HIT_RESULT_MONEY_WHEEL_WIN_ID:
						if (lIsMasterSeat_bl)
						{
							lMoneyWheelValue_num = +lPrize_obj.value;
						}
						else
						{
							if (lCashWins_obj_arr && lCashWins_obj_arr.length)
							{
								lCashWins_obj_arr[0].winCash += +lPrize_obj.value;
							}
							else
							{
								let awardStartPosition = new PIXI.Point(startPosition.x, startPosition.y);
								let angle = lIsMasterSeat_bl ? 0 : angles[cashCounter++ % angles.length];
								awardStartPosition.x -= Math.cos(-Utils.gradToRad(angle) + HALF_PI)*50;
								awardStartPosition.y -= Math.sin(-Utils.gradToRad(angle) + HALF_PI)*50;
								let lHitDataClone_obj = Object.assign({}, hitData);
								let lCashWinParams_obj = {
															seatId: +lSeatId_int,
															winCash: +lPrize_obj.value,
															hitData: lHitDataClone_obj,
															awardStartPosition: awardStartPosition,
															isBoss: isBoss,
															isBossMasterFinalWin: false
								};
								lCashWinParams_obj.startOffset = {x: 0, y: -50};
								lCashWins_obj_arr.push(lCashWinParams_obj);
							}
						}
						break;
				}
			}
		}

		if (lCashWins_obj_arr.length > 0)
		{
			if (hitData.enemy && hitData.enemy.typeId === ENEMY_TYPES.GOLD_CAPSULE && APP.playerController.info.seatId === hitData.seatId)
			{
				this.emit(PrizesController.i_EVENT_ON_TIME_TO_SHOW_MONEY_WHEEL_PRIZE, {hitData: hitData});
			}
			else
			{
				this.emit(PrizesController.i_EVENT_ON_TIME_TO_SHOW_CASH_PRIZES, {data: lCashWins_obj_arr});
			}
		}
		if(hitData.chMult > 0 && hitData.enemy.typeId === ENEMY_TYPES.BOMB_CAPSULE)
		{
			this.emit(PrizesController.i_EVENT_ON_TIME_TO_SHOW_BOMB_PRIZE, {hitData: hitData});
		}
	}
}

export default PrizesController;