import {WebSocketInteractionInfo, SERVER_MESSAGES, GAME_CLIENT_MESSAGES} from '../../../../../../common/PIXI/src/dgphoenix/unified/model/interaction/server/WebSocketInteractionInfo';

SERVER_MESSAGES.GET_ROOM_INFO_RESPONSE = 'GetRoomInfoResponse';
SERVER_MESSAGES.FULL_GAME_INFO = 'FullGameInfo';
SERVER_MESSAGES.SIT_IN_RESPONSE = 'SitInResponse';
SERVER_MESSAGES.SIT_OUT_RESPONSE = 'SitOutResponse';
SERVER_MESSAGES.NEW_ENEMY = 'NewEnemy';
SERVER_MESSAGES.NEW_ENEMIES = 'NewEnemies';
SERVER_MESSAGES.MISS = 'Miss';
SERVER_MESSAGES.HIT = 'Hit';
SERVER_MESSAGES.NEW_TREASURE = 'NewTreasure';
SERVER_MESSAGES.CLIENTS_INFO = 'ClientsInfo';
SERVER_MESSAGES.ROUND_RESULT = 'RoundResult';
SERVER_MESSAGES.GAME_STATE_CHANGED = 'GameStateChanged';
SERVER_MESSAGES.BUY_IN_RESPONSE = 'BuyInResponse';
SERVER_MESSAGES.RE_BUY_RESPONSE = 'ReBuyResponse';
SERVER_MESSAGES.ENEMY_DESTROYED = 'EnemyDestroyed';
SERVER_MESSAGES.CHANGE_MAP = 'ChangeMap';
SERVER_MESSAGES.WEAPONS = 'Weapons';
SERVER_MESSAGES.BALANCE_UPDATED = "BalanceUpdated";
SERVER_MESSAGES.WEAPON_SWITCHED = "WeaponSwitched";
SERVER_MESSAGES.UPDATE_TRAJECTORIES = "UpdateTrajectories";
SERVER_MESSAGES.ROUND_FINISH_SOON = "RoundFinishSoon";
SERVER_MESSAGES.MINE_PLACE = "MinePlace";
SERVER_MESSAGES.BET_LEVEL_RESPONSE = "BetLevelResponse"
SERVER_MESSAGES.BONUS_STATUS_CHANGED = "BonusStatusChanged";
SERVER_MESSAGES.FRB_ENDED = "FRBEnded";
SERVER_MESSAGES.TOURNAMENT_STATE_CHANGED = "TournamentStateChanged";
SERVER_MESSAGES.BULLET_RESPONSE = "BulletResponse";
SERVER_MESSAGES.BULLET_CLEAR_RESPONSE = "BulletClearResponse";

const CLIENT_MESSAGES = GAME_CLIENT_MESSAGES;

class GameWebSocketInteractionInfo extends WebSocketInteractionInfo
{
	constructor()
	{
		super();
	}

	//overriden
	getRequestTimeLimit(aRequest_str)
	{
		switch (aRequest_str)
		{
			case GAME_CLIENT_MESSAGES.BULLET:
			case GAME_CLIENT_MESSAGES.SHOT:
			case GAME_CLIENT_MESSAGES.MINE_COORDINATES:
				return 150;
		}
		return super.getRequestTimeLimit(aRequest_str);
	}
}

export { GameWebSocketInteractionInfo, SERVER_MESSAGES, CLIENT_MESSAGES };