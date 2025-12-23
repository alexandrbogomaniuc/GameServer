import SimpleController from "../../../../../../common/PIXI/src/dgphoenix/unified/controller/base/SimpleController";
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { WEAPONS } from '../../../../../shared/src/CommonConstants';
import GameFieldController from '../../../controller/uis/game_field/GameFieldController';
import BattlegroundMainPlayerSpot from '../../../main/playerSpots/battleground/BattlegroundMainPlayerSpot';
import MainPlayerSpot from '../../../main/playerSpots/MainPlayerSpot';
import GameFieldPlayersContainer from '../../../main/gameField/GameFieldPlayersContainer';
import PlayerSpot from '../../../main/playerSpots/PlayerSpot';
import {Z_INDEXES} from '../../../controller/uis/game_field/GameFieldController';
import { ROUND_STATE } from '../../../model/state/GameStateInfo';

class PlayerSpotsController extends SimpleController
{
	static get EVENT_ON_BET_MULTIPLIER_CHANGED() { return MainPlayerSpot.EVENT_ON_BET_MULTIPLIER_CHANGED; }
	static get EVENT_ON_BET_UPDATE_REQUIRED() { return MainPlayerSpot.EVENT_ON_BET_UPDATE_REQUIRED; }
	static get EVENT_ON_MASTER_SEAT_ADDED() { return "onMasterSeatAdded"; }

	static get EVENT_ON_AUTOFIRE_BUTTON_ENABLED() 			{return BattlegroundMainPlayerSpot.EVENT_ON_AUTOFIRE_BUTTON_ENABLED; }
	static get EVENT_ON_AUTOFIRE_BUTTON_DISABLED() 			{return BattlegroundMainPlayerSpot.EVENT_ON_AUTOFIRE_BUTTON_DISABLED; }

	addMasterPlayerSpot(player)
	{
		this._addMasterPlayerSpot(player);
	}

	drawAllPlayers(players, masterSeatId = -1, aRedrawMasterPlayerScore_bl = false)
	{
		this._drawAllPlayers(players, masterSeatId, aRedrawMasterPlayerScore_bl);
	}

	resetPlayersSpotValues()
	{
		this._resetPlayersSpotValues();
	}

	removeCoPlayers()
	{
		this._removeCoPlayers();
	}

	removeMasterPlayerSpot(clearMasterPlayerInfo)
	{
		this._removeMasterPlayerSpot(clearMasterPlayerInfo)
	}

	onBetLevelChangeConfirmed(aEvent_obj)
	{
		this._onBetLevelChangeConfirmed(aEvent_obj);
	}

	clearSpot()
	{
		this._clearSpot();
	}

	constructor()
	{
		super();
	}

	__initControlLevel()
	{
		super.__initControlLevel();
	}

	__initModelLevel()
	{
		super.__initModelLevel();
	}

	_addMasterPlayerSpot(player)
	{
		let lGameField_gf = APP.gameScreen.gameFieldController;
		this.removeMasterPlayerSpot();

		lGameField_gf.seatId = player.seatId;
		lGameField_gf.nickname = player.nickname;
		lGameField_gf.currentScore = player.currentScore;

		if (!lGameField_gf._isFrbMode && !APP.isBattlegroundGame)
		{
			APP.gameScreen.balanceController.resetPlayerWin();
		}
		else if (APP.isBattlegroundGame)
		{
			lGameField_gf.currentWin = APP.gameScreen.player.lastReceivedBattlegroundScore_int;
		}

		let id = player.seatId;
		let seat = lGameField_gf.getSeat(id);
		if (seat) seat.destroy();

		let lSitPositionIds_arr = APP.currentWindow.gameFieldController.sitPositionIds;
		let lPlayerPosition_int = lSitPositionIds_arr[id];
		lGameField_gf.playerPosition = this._getSpotPosition(lPlayerPosition_int, true);

		player.master = true;
		player.positionId = lPlayerPosition_int;

		
		let lMainPlayerSpot_s;
		if (APP.isBattlegroundGame)
		{
			lMainPlayerSpot_s = new BattlegroundMainPlayerSpot(player, lGameField_gf.playerPosition, true);
			lMainPlayerSpot_s.on(BattlegroundMainPlayerSpot.EVENT_ON_AUTOFIRE_BUTTON_ENABLED, this.emit, this);
			lMainPlayerSpot_s.on(BattlegroundMainPlayerSpot.EVENT_ON_AUTOFIRE_BUTTON_DISABLED, this.emit, this);
		}
		else
		{
			lMainPlayerSpot_s = new MainPlayerSpot(player, lGameField_gf.playerPosition, true);
		}

		lGameField_gf.spot = lGameField_gf.mainSpotContainerInfo.container.addChild(lMainPlayerSpot_s);

		lGameField_gf.spot.position.set(lGameField_gf.playerPosition.x, lGameField_gf.playerPosition.y);
		lGameField_gf.spot.zIndex = lGameField_gf.mainSpotContainerInfo.zIndexMainSpot;

		lGameField_gf.spot.on(MainPlayerSpot.EVENT_ON_BET_MULTIPLIER_CHANGED, this.emit, this);
		lGameField_gf.spot.on(MainPlayerSpot.EVENT_ON_BET_UPDATE_REQUIRED, this.emit, this);
		lGameField_gf.spot.on(MainPlayerSpot.EVENT_ON_CHANGE_WEAPON_TO_DEFAULT_REQUIRED, this._onPlayerChangeWeaponToDefaultRequired, this);
		lGameField_gf.spot.on(MainPlayerSpot.EVENT_ON_ROTATE_GUN_TO_ZERO, this._onPlayerSpotRotateToZeroWeaponRequired, this);
		lGameField_gf.spot.on(MainPlayerSpot.EVENT_RELOAD_REQUIRED, this._onReloadRequired, this);

		lGameField_gf.changeWeapon(WEAPONS.DEFAULT);
		lGameField_gf.redrawAmmoText();

		lGameField_gf.validateCursor();

		this.emit(PlayerSpotsController.EVENT_ON_MASTER_SEAT_ADDED, { seatId: this.seatId });
	}

	_onBetLevelChangeConfirmed(aEvent_obj)
	{
		let lSeatId_int = aEvent_obj.seatId;
		let lNewBetLevel_int = aEvent_obj.betLevel;
		let l_pi = APP.playerController.info;
		let lGameField_gf = APP.gameScreen.gameFieldController;

		if (lGameField_gf.spot && lGameField_gf.spot.player.seatId === lSeatId_int)
		{
			lGameField_gf.spot.onBetChangeConfirmed(lNewBetLevel_int);
		}
		else if (l_pi.seatId === lSeatId_int && APP.currentWindow.gameStateController.info.isPlayerSitIn)
		{
			let lBetId_num = l_pi.possibleBetLevels.indexOf(lNewBetLevel_int) > -1 ? l_pi.possibleBetLevels.indexOf(lNewBetLevel_int) : 0;
			this.emit(PlayerSpotsController.EVENT_ON_BET_MULTIPLIER_CHANGED, { id: lBetId_num, multiplier: lNewBetLevel_int });
		}
		else
		{
			let lPlayerInfo_obj = lGameField_gf.getPlayerBySeatId(lSeatId_int)
			let lSpot_ps = lGameField_gf.getSeat(lSeatId_int);

			if (lPlayerInfo_obj)
			{
				lPlayerInfo_obj.betLevel = lNewBetLevel_int;
			}
			
			let lMult_int = l_pi.getTurretSkinId(lNewBetLevel_int); // from 1 to 5 usually
			
			if (!APP.isBattlegroundGame)
			{
				lSpot_ps && lSpot_ps.changeWeapon(lSpot_ps.currentWeaponId, lMult_int);
			}
		}
	}

	_getSpotPosition(positionId, isMasterSpot_bl)
	{
		let lPlayersPositions_obj = APP.currentWindow.gameFieldController.playersPositions;
		let positions = APP.isMobile ? lPlayersPositions_obj["MOBILE"] : lPlayersPositions_obj["DESKTOP"]
		let spotPosDescr = positions[positionId];

		let spotPos = {
			x: spotPosDescr.x + (isMasterSpot_bl ? spotPosDescr.masterOffset.x : 11),
			y: spotPosDescr.y + (isMasterSpot_bl ? spotPosDescr.masterOffset.y : 4),
			direct: spotPosDescr.direct,
		}

		return spotPos;
	}

	_onPlayerChangeWeaponToDefaultRequired()
	{
		APP.gameScreen.gameFieldController.tryToChangeWeapon(WEAPONS.DEFAULT);
	}

	_onPlayerSpotRotateToZeroWeaponRequired()
	{
		APP.gameScreen.fireController.i_rotateGun(APP.config.size.width / 2, APP.config.size.height / 2);
	}

	_onReloadRequired()
	{
		APP.gameScreen.balanceController.tryToBuyAmmo();
	}

	_drawAllPlayers(players, masterSeatId, aRedrawMasterPlayerScore_bl)
	{
		let lGameField_gf = APP.gameScreen.gameFieldController;
		if (APP.currentWindow.isPaused)
		{
			return;
		}

		this._removeCoPlayers();
		this._initPlayersContainerIfRequired();

		let lPlayerPos_int = -1;
		for (let i = 0; i < players.length; i++)
		{
			if (masterSeatId >= 0 && players[i].seatId == masterSeatId)
			{
				if (aRedrawMasterPlayerScore_bl)
				{
					this._redrawPlayerScore(players[i]);
				}
				continue;
			}
			else if (lGameField_gf.seatId >= 0 && players[i].seatId == lGameField_gf.seatId)
			{
				continue;
			}

			let lSitPositionIds_arr = APP.currentWindow.gameFieldController.sitPositionIds;
			lPlayerPos_int = lSitPositionIds_arr[players[i].seatId];

			let spot = this._drawCoPlayer(players[i], lPlayerPos_int);
			spot.currentScore = players[i].currentScore;

			lGameField_gf.players.push(players[i]);
		}

		let lGameStateInfo_gsi = APP.currentWindow.gameStateController.info;
		if (lGameField_gf.roundResultActive
			&& lGameStateInfo_gsi
			&& lGameStateInfo_gsi.gameState != ROUND_STATE.PLAY
		)
		{
			this._resetPlayersSpotValues();
		}

		APP.gameScreen.gameFieldController.showKingsOfTheHill([]);
	}

	_resetPlayersSpotValues()
	{
		if (!APP.currentWindow.gameFrbController.info.frbMode && !APP.isBattlegroundGame)
		{
			APP.gameScreen.balanceController.resetPlayerWin();
		}
	}

	_drawCoPlayer(player, aId_int)
	{
		let pos = this._getSpotPosition(aId_int, false);
		player.master = false;
		player.positionId = aId_int;
		let playerContainer = player.spot = APP.gameScreen.gameFieldController.playersContainer.addChild(new PlayerSpot(player, pos));
		playerContainer.position.set(pos.x, pos.y);

		return playerContainer;
	}

	_redrawPlayerScore(player)
	{
		if (!APP.gameScreen.gameFieldController.spot)
		{
			let playerInfo = APP.currentWindow.player;
			if (!playerInfo)
			{
				throw new Error("Cannot redraw master player spot - no player info.");
			}
			this._addMasterPlayerSpot(playerInfo, player.weapon.id);
		}
	}

	_removeCoPlayers()
	{
		let lGameField_gf = APP.gameScreen.gameFieldController;
		while (lGameField_gf.players && lGameField_gf.players.length)
		{
			delete lGameField_gf.players.pop();
		}
		lGameField_gf.players = [];

		if (lGameField_gf.playersContainer)
		{
			lGameField_gf.playersContainer.destroyChildren();
		}
	}

	_initPlayersContainerIfRequired()
	{
		let lGameField_gf = APP.gameScreen.gameFieldController;
		if (lGameField_gf.playersContainer)
		{
			return;
		}

		lGameField_gf.playersContainer = lGameField_gf.screenField.addChild(new GameFieldPlayersContainer);
		lGameField_gf.playersContainer.zIndex = Z_INDEXES.PLAYERS_CONTAINER;
	}

	_removeMasterPlayerSpot(clearMasterPlayerInfo = true)
	{
		let lGameField_gf = APP.gameScreen.gameFieldController;
		lGameField_gf.spot && lGameField_gf.spot.destroy();
		lGameField_gf.spot = null;

		if (clearMasterPlayerInfo)
		{
			lGameField_gf.seatId = -1;
			lGameField_gf.playerPosition = null;
		}
	}

	_clearSpot()
	{
		APP.gameScreen.gameFieldController.spot.off(MainPlayerSpot.EVENT_RELOAD_REQUIRED, this._onReloadRequired, this);
		APP.gameScreen.gameFieldController.spot.off(MainPlayerSpot.EVENT_ON_ROTATE_GUN_TO_ZERO, this._onPlayerSpotRotateToZeroWeaponRequired, this);
	}

	destroy()
	{
		super.destroy();
	}
}

export default PlayerSpotsController;