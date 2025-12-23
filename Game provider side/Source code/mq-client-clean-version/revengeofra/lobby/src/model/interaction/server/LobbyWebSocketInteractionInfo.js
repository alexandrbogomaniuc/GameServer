import {WebSocketInteractionInfo, SERVER_MESSAGES, GAME_CLIENT_MESSAGES} from '../../../../../../common/PIXI/src/dgphoenix/unified/model/interaction/server/WebSocketInteractionInfo';

SERVER_MESSAGES.ENTER_LOBBY_RESPONSE = "EnterLobbyResponse";
SERVER_MESSAGES.GET_START_GAME_URL_RESPONSE = "GetStartGameUrlResponse";
SERVER_MESSAGES.BALANCE_UPDATED = "BalanceUpdated";
SERVER_MESSAGES.LOBBY_TIME_UPDATED = "LobbyTimeUpdated";
SERVER_MESSAGES.STATS = "Stats";
SERVER_MESSAGES.WEAPONS_RESPONSE = "PlayerWeaponsResponse";
SERVER_MESSAGES.BONUS_STATUS_CHANGED = "BonusStatusChanged";
SERVER_MESSAGES.TOURNAMENT_STATE_CHANGED = "TournamentStateChanged";
SERVER_MESSAGES.RE_BUY_RESPONSE = 'ReBuyResponse';

const CLIENT_MESSAGES =
{
	ENTER:								"EnterLobby",
	GET_START_GAME_URL:					"GetStartGameUrl",
	CLOSE_ROOM:							"CloseRoom",
	CHECK_NICKNAME_AVAILABILITY:		"CheckNicknameAvailability",
	CHANGE_NICKNAME:					"ChangeNickname",
	CHANGE_AVATAR:						"ChangeAvatar",
	REFRESH_BALANCE:					"RefreshBalance",
	GET_LOBBY_TIME:						"GetLobbyTime",
	CLOSE_ROUND_RESULT_NOTIFICATION:	"CloseRoundResultNotification",
	CHANGE_TOOL_TIPS:					"ChangeToolTips",
	CHANGE_PICKS_UP_SW:					"ChangePicksUpSW",
	CHANGE_FIRE_SETTINGS:				"ChangeFireSettings",
	GET_WEAPONS: 						"GetWeapons",
	RE_BUY: 							"ReBuy",
	BUY_IN: 							"BuyIn"
}

class LobbyWebSocketInteractionInfo extends WebSocketInteractionInfo
{
	constructor()
	{
		super();
	}
}

export { LobbyWebSocketInteractionInfo, SERVER_MESSAGES, CLIENT_MESSAGES, GAME_CLIENT_MESSAGES };