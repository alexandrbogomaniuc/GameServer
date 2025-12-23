import PlayerController from '../../../../../common/PIXI/src/dgphoenix/unified/controller/custom/PlayerController';
import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Game from '../../Game';
import PlayerInfo from '../../../../../common/PIXI/src/dgphoenix/unified/model/custom/PlayerInfo';
import GameScreen from '../../main/GameScreen';
import GameWebSocketInteractionController from '../interaction/server/GameWebSocketInteractionController';
import { SERVER_MESSAGES } from '../../model/interaction/server/GameWebSocketInteractionInfo';
import RoundResultScreenController from '../uis/roundresult/RoundResultScreenController';
import FireSettingsController from '../../controller/uis/fire_settings/FireSettingsController';
import GameField from './../../main/GameField';
import WeaponsController from '../../controller/uis/weapons/WeaponsController';

class GamePlayerController extends PlayerController
{
	static get EVENT_ON_PLAYER_INFO_UPDATED() 			{return PlayerController.EVENT_ON_PLAYER_INFO_UPDATED;}
	static get EVENT_ON_PLAYER_WEAPON_UPDATED() 		{return "onPlayerWeaponIdUpdated";}
	static get EVENT_ON_TOOLTIPS_UPDATED()				{return "onTooltipsUpdated";}
	static get EVENT_ON_WEAPON_SURPLUS_UPDATED()		{return "onWEaponSurplusUpdated";}

	static get EVENT_ON_QUALIFY_WIN_SYNC_BY_SERVER_STARTING()	{return "EVENT_ON_QUALIFY_WIN_SYNC_BY_SERVER_STARTING";}

	//INIT...
	__initControlLevel()
	{
		super.__initControlLevel();

		this._fAlreadySitIn_bln = false;

		APP.on(Game.EVENT_ON_PLAYER_INFO_UPDATED, this._onPlayerInfoUpdated, this);
		APP.webSocketInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_MESSAGE, this._onServerMessage, this);

		APP.on("onGameStarted", this._onGameStarted, this);
	}
	//...INIT

	_onGameStarted(event)
	{
		APP.currentWindow.on(GameScreen.EVENT_ON_WEAPON_UPDATED, this._onPlayerSpotWeaponUpdated, this);
		APP.currentWindow.on(GameScreen.EVENT_ON_WIN_TO_AMMO_TRANSFERED, this._onWinToAmmoTransfered, this);
		APP.currentWindow.on(GameScreen.EVENT_ON_ROUND_RESULT_SCREEN_ACTIVATED, this._onRoundResultScreenActivated, this);
		APP.currentWindow.on(GameScreen.EVENT_ON_ROUND_RESULT_SCREEN_DEACTIVATED, this._onRoundResultScreenDeactivated, this);
		APP.currentWindow.on(GameScreen.EVENT_ON_GAME_FIELD_CLEARED, this._onGameFieldCleared, this);
		APP.currentWindow.on(GameScreen.EVENT_ON_BET_MULTIPLIER_UPDATED, this._onBetMultiplierUpdated, this);
		APP.currentWindow.on(GameScreen.EVENT_ON_FRB_ENDED_COMPLETED, this._onFRBEndedCompleted, this);

		let roundResultScreenController = APP.gameScreen.gameField.roundResultScreenController;
		roundResultScreenController.on(RoundResultScreenController.EVENT_ON_ROUND_RESULT_SCREEN_SKIPPED, this._onRoundResultScreenActivationSkipped, this);

		let lFireSettingsController_fsc = APP.currentWindow.fireSettingsController;
		lFireSettingsController_fsc.on(FireSettingsController.EVENT_ON_FIRE_SETTINGS_CHANGED, this._onFireSettingsChanged, this);

		APP.currentWindow.gameField.on(GameField.EVENT_ON_WEAPON_TO_UNPRESENTED_TRANSFER_REQUIRED, this._onWeaponToUnpresentedRequired, this);
		APP.currentWindow.gameField.on(GameField.EVENT_ON_TIME_TO_CONVERT_BALANCE_TO_AMMO, this._onTimeToConvertBalanceToAmmo, this);
		APP.currentWindow.gameField.on(GameField.EVENT_ON_RICOCHET_BULLETS_UPDATED, this._onRicochetBulletsUpdated, this);

		let lWeaponsController_wsc = this._fWeaponsController_wsc = APP.currentWindow.weaponsController;
		lWeaponsController_wsc.on(WeaponsController.EVENT_ON_QUALIFY_WIN_TRANSFERRED_TO_REAL_AMMO, this._onQualifyWinTransferredToRealAmmo, this);
		lWeaponsController_wsc.on(WeaponsController.EVENT_ON_REAL_AMMO_VALUE_UPDATED, this._onRealAmmoValueUpdated, this);
	}

	_onRicochetBulletsUpdated(aEvent_obj)
	{
		let currentBullets = aEvent_obj.currentBullets;
		let lUpdatedData_obj = {};
		lUpdatedData_obj[PlayerInfo.KEY_RICOCHET_BULLETS] = {value: currentBullets};
		this.info.setPlayerInfo(PlayerInfo.KEY_RICOCHET_BULLETS, lUpdatedData_obj[PlayerInfo.KEY_RICOCHET_BULLETS]);

		this.emit(GamePlayerController.EVENT_ON_PLAYER_INFO_UPDATED, {data: lUpdatedData_obj});
	}

	_onFRBEndedCompleted()
	{
		if (APP.currentWindow.gameFrbController.info.frbEnded)
		{
			let lUpdatedData_obj = {};
			lUpdatedData_obj[PlayerInfo.KEY_QUALIFY_WIN] = {value: 0, time: Date.now()};

			this.info.setPlayerInfo(PlayerInfo.KEY_QUALIFY_WIN, lUpdatedData_obj[PlayerInfo.KEY_QUALIFY_WIN]);
			this.emit(GamePlayerController.EVENT_ON_PLAYER_INFO_UPDATED, {data: lUpdatedData_obj});
		}
	}

	_onBetMultiplierUpdated(aEvent_obj)
	{
		let lUpdatedData_obj = {};
		lUpdatedData_obj[PlayerInfo.KEY_BET_LEVEL] = {value: aEvent_obj.multiplier};
		this.info.setPlayerInfo(PlayerInfo.KEY_BET_LEVEL, lUpdatedData_obj[PlayerInfo.KEY_BET_LEVEL]);

		this.emit(GamePlayerController.EVENT_ON_PLAYER_INFO_UPDATED, {data: lUpdatedData_obj});
	}

	_onFireSettingsChanged()
	{
		let lFireSettingsInfo_fsi = APP.currentWindow.fireSettingsController.info;

		let lUpdatedData_obj = {};
		lUpdatedData_obj[PlayerInfo.KEY_FIRE_SETTINGS_LOCK_ON_TARGET] = {value:lFireSettingsInfo_fsi.lockOnTarget};
		lUpdatedData_obj[PlayerInfo.KEY_FIRE_SETTINGS_TARGET_PRIORITY] = {value:lFireSettingsInfo_fsi.targetPriority - 1};
		lUpdatedData_obj[PlayerInfo.KEY_FIRE_SETTINGS_AUTO_FIRE] = {value:lFireSettingsInfo_fsi.autoFire};
		lUpdatedData_obj[PlayerInfo.KEY_FIRE_SETTINGS_FIRE_SPEED] = {value:lFireSettingsInfo_fsi.fireSpeed - 1};

		this.info.setPlayerInfo(PlayerInfo.KEY_FIRE_SETTINGS_LOCK_ON_TARGET, lUpdatedData_obj[PlayerInfo.KEY_FIRE_SETTINGS_LOCK_ON_TARGET]);
		this.info.setPlayerInfo(PlayerInfo.KEY_FIRE_SETTINGS_TARGET_PRIORITY, lUpdatedData_obj[PlayerInfo.KEY_FIRE_SETTINGS_TARGET_PRIORITY]);
		this.info.setPlayerInfo(PlayerInfo.KEY_FIRE_SETTINGS_AUTO_FIRE, lUpdatedData_obj[PlayerInfo.KEY_FIRE_SETTINGS_AUTO_FIRE]);
		this.info.setPlayerInfo(PlayerInfo.KEY_FIRE_SETTINGS_FIRE_SPEED, lUpdatedData_obj[PlayerInfo.KEY_FIRE_SETTINGS_FIRE_SPEED]);

		this.emit(GamePlayerController.EVENT_ON_PLAYER_INFO_UPDATED, {data:lUpdatedData_obj});
	}

	_onPlayerSpotWeaponUpdated(event)
	{
		this._updatePlayerWeapon({value: event.weaponId});
	}

	_onWinToAmmoTransfered(event)
	{
		let lTransferedWin_num = event.winAmount;
		if (lTransferedWin_num === undefined)
		{
			console.log(`Invalid value for win transfer.`);
		}
		else if (lTransferedWin_num > this.info.qualifyWin)
		{
			console.error(`Invalid qualify win amount to transfer presented win: ${this.info.qualifyWin}<${lTransferedWin_num}`);
			lTransferedWin_num = this.info.qualifyWin;
		}

		let lResultState_bl = this.roundResultActivationInProgress || this.roundResultActive;

		let lUpdatedData_obj = {};
		let lUpdatedQualifyWin_num = this.info.qualifyWin - (lResultState_bl ? 0 : lTransferedWin_num);
		lUpdatedData_obj[PlayerInfo.KEY_QUALIFY_WIN] = {value: lUpdatedQualifyWin_num, complex: true};
		lUpdatedData_obj[PlayerInfo.KEY_UNPRESENTED_WIN] = {value: this.info.unpresentedWin > lTransferedWin_num ? this.info.unpresentedWin - lTransferedWin_num : 0, complex: true};

		this.info.setPlayerInfo(PlayerInfo.KEY_QUALIFY_WIN, lUpdatedData_obj[PlayerInfo.KEY_QUALIFY_WIN]);
		this.info.setPlayerInfo(PlayerInfo.KEY_UNPRESENTED_WIN, lUpdatedData_obj[PlayerInfo.KEY_UNPRESENTED_WIN]);

		this.emit(GamePlayerController.EVENT_ON_PLAYER_INFO_UPDATED, {data: lUpdatedData_obj});
	}

	_onTimeToConvertBalanceToAmmo(event)
	{
		let lUpdatedData_obj = {};
		let lPrevBalance = this.info.balance;
		let lAmmoAmount_num = event.ammoAmount;
		let lAmmoCost_num = lAmmoAmount_num * this.info.currentStake;
		let lNewBalance = lPrevBalance - lAmmoCost_num;
		lUpdatedData_obj[PlayerInfo.KEY_BALANCE] = {value: lNewBalance};

		this.info.setPlayerInfo(PlayerInfo.KEY_BALANCE, lUpdatedData_obj[PlayerInfo.KEY_BALANCE]);

		this.emit(GamePlayerController.EVENT_ON_PLAYER_INFO_UPDATED, {data: lUpdatedData_obj});
	}

	_onWeaponToUnpresentedRequired(aEvent_obj)
	{
		let lUpdatedData_obj = {};
		lUpdatedData_obj[PlayerInfo.KEY_UNPRESENTED_WIN] = {value: this.info.unpresentedWin + aEvent_obj.winValue, complex: true};
		this.info.setPlayerInfo(PlayerInfo.KEY_UNPRESENTED_WIN, lUpdatedData_obj[PlayerInfo.KEY_UNPRESENTED_WIN]);
	}

	_onQualifyWinTransferredToRealAmmo()
	{
		let lUpdatedData_obj = {};
		lUpdatedData_obj[PlayerInfo.KEY_QUALIFY_WIN] = {value: 0, complex: true};
		this.info.setPlayerInfo(PlayerInfo.KEY_QUALIFY_WIN, lUpdatedData_obj[PlayerInfo.KEY_QUALIFY_WIN]);
		this.emit(GamePlayerController.EVENT_ON_PLAYER_INFO_UPDATED, {data:lUpdatedData_obj});
	}

	_onRealAmmoValueUpdated(event)
	{
		let lUpdatedData_obj = {};

		let lRealAmmo_num = this._fWeaponsController_wsc.info.realAmmo;
		lUpdatedData_obj[PlayerInfo.KEY_REAL_AMMO] = {value: lRealAmmo_num, complex: true};
		this.info.setPlayerInfo(PlayerInfo.KEY_REAL_AMMO, lUpdatedData_obj[PlayerInfo.KEY_REAL_AMMO]);

		this.emit(GamePlayerController.EVENT_ON_PLAYER_INFO_UPDATED, {data:lUpdatedData_obj});
	}

	get roundResultActivationInProgress()
	{
		if (!APP.gameScreen.gameField) return false;
		return APP.gameScreen.gameField.roundResultScreenController.info.roundResultResponseRecieved;
	}

	get roundResultActive()
	{
		if (!APP.gameScreen.gameField) return false;
		return APP.gameScreen.gameField.roundResultScreenController.isActive;
	}

	get _playerSeatId()
	{
		return APP.currentWindow ? APP.currentWindow.player.seatId : -1;
	}

	get _isGameInProgress()
	{
		return APP.currentWindow ? APP.currentWindow.gameStateController.info.isGameInProgress : false;
	}

	get _roundResultActivated()
	{
		return APP.currentWindow ? APP.currentWindow.gameField.roundResultActive : false;
	}

	get _roundResultActivating()
	{
		return APP.currentWindow ? APP.currentWindow.gameField.roundResultActivationInProgress : false;
	}

	_onPlayerInfoUpdated(event)
	{
		let data = event.data;
		let time = event.time;

		if (data.balance != undefined)
		{
			if (APP.isWebSocketInteractionInitiated && APP.webSocketInteractionController.isSitoutRequestInProgress)
				{
					delete event.data.balance;
				}
		}

		if (Object.keys(data).length)
		{
			for (let key in data)
			{
				this.info.setPlayerInfo(key, data[key]);

				if (key == PlayerInfo.KEY_TOOL_TIP_ENABLED)
				{
					this._onTooltipsEnabledUpdated(data[key].value);
				}
			}
		}
	}

	_onTooltipsEnabledUpdated(aVal_bln)
	{
		this.emit(GamePlayerController.EVENT_ON_TOOLTIPS_UPDATED, {value: aVal_bln});
	}

	_updatePlayerWeapon(aData_obj)
	{
		if (!aData_obj || aData_obj.value == undefined || aData_obj.value === this.info.weaponId)
		{
			return;
		}

		this.info.setPlayerInfo(PlayerInfo.KEY_WEAPON_ID, aData_obj);
		this.emit(GamePlayerController.EVENT_ON_PLAYER_WEAPON_UPDATED);
	}

	_onRoundResultScreenActivated(event)
	{
		let lUpdatedData_obj = {};
		lUpdatedData_obj[PlayerInfo.KEY_UNPRESENTED_WIN] = {value: 0};

		this.info.setPlayerInfo(PlayerInfo.KEY_UNPRESENTED_WIN, lUpdatedData_obj[PlayerInfo.KEY_UNPRESENTED_WIN]);
		this.emit(GamePlayerController.EVENT_ON_PLAYER_INFO_UPDATED, {data: lUpdatedData_obj});
	}

	_onRoundResultScreenDeactivated()
	{
		let lUpdatedData_obj = {};
		lUpdatedData_obj[PlayerInfo.KEY_QUALIFY_WIN] = {value: 0};

		this.info.setPlayerInfo(PlayerInfo.KEY_QUALIFY_WIN, lUpdatedData_obj[PlayerInfo.KEY_QUALIFY_WIN]);
		this.emit(GamePlayerController.EVENT_ON_PLAYER_INFO_UPDATED, {data: lUpdatedData_obj});
	}

	_onRoundResultScreenActivationSkipped(event)
	{
		let lUpdatedData_obj = {};
		lUpdatedData_obj[PlayerInfo.KEY_UNPRESENTED_WIN] = {value: 0};
		this.info.setPlayerInfo(PlayerInfo.KEY_UNPRESENTED_WIN, lUpdatedData_obj[PlayerInfo.KEY_UNPRESENTED_WIN]);

		lUpdatedData_obj[PlayerInfo.KEY_QUALIFY_WIN] = {value: 0};
		this.info.setPlayerInfo(PlayerInfo.KEY_QUALIFY_WIN, lUpdatedData_obj[PlayerInfo.KEY_QUALIFY_WIN]);

		this.emit(GamePlayerController.EVENT_ON_PLAYER_INFO_UPDATED, {data: lUpdatedData_obj});
	}

	_onGameFieldCleared(event)
	{
		if (this.roundResultActivationInProgress)
		{
			let lUpdatedData_obj = {};
			lUpdatedData_obj[PlayerInfo.KEY_UNPRESENTED_WIN] = {value: 0};
			this.info.setPlayerInfo(PlayerInfo.KEY_UNPRESENTED_WIN, lUpdatedData_obj[PlayerInfo.KEY_UNPRESENTED_WIN]);

			lUpdatedData_obj[PlayerInfo.KEY_QUALIFY_WIN] = {value: 0};
			this.info.setPlayerInfo(PlayerInfo.KEY_QUALIFY_WIN, lUpdatedData_obj[PlayerInfo.KEY_QUALIFY_WIN]);

			this.emit(GamePlayerController.EVENT_ON_PLAYER_INFO_UPDATED, {data: lUpdatedData_obj});
		}
	}

	_onServerMessage(event)
	{
		let data = event.messageData;
		let lUpdatedData_obj = {};

		switch(data.class)
		{
			case SERVER_MESSAGES.GET_ROOM_INFO_RESPONSE:
				if (data.playerStake && data.playerStake !== -1)
				{
					lUpdatedData_obj[PlayerInfo.KEY_STAKE] = {value: data.playerStake, time: data.date};
				}
				else if (data.stake && data.stake !== -1)
				{
					lUpdatedData_obj[PlayerInfo.KEY_STAKE] = {value: data.stake, time: data.date};
				}
				else
				{
					lUpdatedData_obj[PlayerInfo.KEY_STAKE] = {value: -1, time: data.date};
					throw new Error("Wrong stake error:", -1);
				}

				lUpdatedData_obj[PlayerInfo.KEY_BET_LEVEL] = {value: data.betLevel};
				lUpdatedData_obj[PlayerInfo.KEY_QUALIFY_WIN] = {value: data.alreadySitInWin, time: data.date};
				lUpdatedData_obj[PlayerInfo.KEY_UNPRESENTED_WIN] = {value: 0, time: data.date, complex: true};

				this._fAlreadySitIn_bln = Boolean(data.alreadySitInNumber != -1);
			break;

			case SERVER_MESSAGES.FULL_GAME_INFO:
				if (!this._isFRBMode)
				{
					lUpdatedData_obj[PlayerInfo.KEY_UNPRESENTED_WIN] = {value: 0, time: data.date, complex: true};
				}
			break;

			case SERVER_MESSAGES.BUY_IN_RESPONSE:
			case SERVER_MESSAGES.RE_BUY_RESPONSE:
				lUpdatedData_obj[PlayerInfo.KEY_BALANCE] = {value: data.balance, time: data.date};
			break;

			case SERVER_MESSAGES.SIT_IN_RESPONSE:
				if (data.rid !== -1)
				{
					lUpdatedData_obj[PlayerInfo.KEY_WEAPON_ID] ={value:  data.specialWeaponId, time: data.date};
					lUpdatedData_obj[PlayerInfo.KEY_BALANCE] = {value: data.balance, time: data.date};
					lUpdatedData_obj[PlayerInfo.KEY_REFRESH_BALANCE] = {value: data.showRefreshBalanceButton || false, time: data.date};
					lUpdatedData_obj[PlayerInfo.KEY_WEAPONS] = {value: data.weapons, time: data.date};

					if (!this._fAlreadySitIn_bln)
					{
						lUpdatedData_obj[PlayerInfo.KEY_QUALIFY_WIN] = {value: 0, time: data.date};
					}

					this._fAlreadySitIn_bln = false;
				}
			break;

			case SERVER_MESSAGES.MISS:
			case SERVER_MESSAGES.HIT:
				if (APP.currentWindow.player && this._playerSeatId >= 0)
				{
					if (!isNaN(data.win) || !isNaN(data.moneyWheelWin))
					{
						let killBonusPay = 0;
						let moneyWheelWin = 0;
						if(data.seatId == APP.currentWindow.player.seatId)
						{
							if (data.killBonusPay && data.killBonusPay > 0)
							{
								killBonusPay = data.killBonusPay;
							}
							if (data.moneyWheelWin && data.moneyWheelWin > 0)
							{
								moneyWheelWin = data.moneyWheelWin;
							}
						}

						lUpdatedData_obj[PlayerInfo.KEY_QUALIFY_WIN] = {value: this.info.qualifyWin + killBonusPay + data.win + moneyWheelWin, time: data.date, complex: true};
						lUpdatedData_obj[PlayerInfo.KEY_UNPRESENTED_WIN] = {value: this.info.unpresentedWin + killBonusPay + data.win + moneyWheelWin, time: data.date, complex: true};
					}
				}
			break;

			case SERVER_MESSAGES.ROUND_RESULT:
				lUpdatedData_obj[PlayerInfo.KEY_BALANCE] = {value: data.balance, time: data.date};

				let lAmmoCost_num = 0;
				if (data.unusedBulletsMoney)
				{
					lAmmoCost_num = data.unusedBulletsMoney;
				}

				let lWinAmount_int = Math.floor(data.winAmount) || 0;

				let lUnpresentedWin_num = this.info.unpresentedWin;

				if (!this._isFRBMode)
				{
					lWinAmount_int += lAmmoCost_num;
					if (data.winRebuyAmount && lWinAmount_int >= data.winRebuyAmount)
					{
						lWinAmount_int -= data.winRebuyAmount;
					}

					if (data.weaponSurplus)
					{
						let lWeaponSurplusSum_num = 0;

						for (let weapon of data.weaponSurplus)
						{
							lWeaponSurplusSum_num += weapon.winBonus;
						}

						if (lWeaponSurplusSum_num)
						{
							lUnpresentedWin_num += lWeaponSurplusSum_num;
						}
					}
				}
				else
				{
					lWinAmount_int = this.info.qualifyWin;
				}

				lUpdatedData_obj[PlayerInfo.KEY_QUALIFY_WIN] = {value: lWinAmount_int, time: data.date};

				lUpdatedData_obj[PlayerInfo.KEY_UNPRESENTED_WIN] = {value: lUnpresentedWin_num, time: data.date};
			break;

			case SERVER_MESSAGES.BALANCE_UPDATED:
				lUpdatedData_obj[PlayerInfo.KEY_BALANCE] = {value: data.balance, time: data.date};
			break;

			case SERVER_MESSAGES.WEAPONS:
				if (data.ammoAmount > 0)
				{
					if (this._isBonusMode || APP.tournamentModeController.info.isTournamentMode)
					{
						let lCurBalance_num = this.info.balance;
						let lAmmoCost_num = data.ammoAmount*this.info.currentStake;
						let lNewBalance_num = lCurBalance_num - lAmmoCost_num;
						if (lNewBalance_num >= 0)
						{
							lUpdatedData_obj[PlayerInfo.KEY_BALANCE] = {value: lNewBalance_num, time: data.date};
						}						
					}
				}
				// [Y]TODO ignore so far, check later; currently server sends wrong list
				//console.log('[Y] %c SERVER_MESSAGES.WEAPONS >> ', 'background: #222; color: #bada55', data.weapons);
				// lUpdatedData_obj[PlayerInfo.KEY_WEAPONS] = {value: data.weapons, time: data.date};
			break;

		}

		if (Object.keys(lUpdatedData_obj).length)
		{
			for (let lKey_str in lUpdatedData_obj)
			{
				if (lKey_str === PlayerInfo.KEY_WEAPON_ID)
				{
					this._updatePlayerWeapon(lUpdatedData_obj[lKey_str]);
				}
				else
				{
					this.info.setPlayerInfo(lKey_str, lUpdatedData_obj[lKey_str]);
				}
			}

			this.emit(GamePlayerController.EVENT_ON_PLAYER_INFO_UPDATED, {data: lUpdatedData_obj, class: data.class});
		}
	}

	get _isFRBMode()
	{
		return APP.currentWindow.gameFrbController.info.frbMode;
	}

	get _isBonusMode()
	{
		return APP.currentWindow.gameBonusController.info.isActivated;
	}

	destroy()
	{
		APP.off(Game.EVENT_ON_PLAYER_INFO_UPDATED, this._onPlayerInfoUpdated, this);
		APP.webSocketInteractionController.off(GameWebSocketInteractionController.EVENT_ON_SERVER_MESSAGE, this._onServerMessage, this);

		APP.off("onGameStarted", this._onGameStarted, this);

		APP.currentWindow.off(GameScreen.EVENT_ON_WEAPON_UPDATED, this._onPlayerSpotWeaponUpdated, this);
		APP.currentWindow.off(GameScreen.EVENT_ON_FRB_ENDED_COMPLETED, this._onFRBEndedCompleted, this);

		super.destroy()

		this._fAlreadySitIn_bln = undefined;
	}
}

export default GamePlayerController;