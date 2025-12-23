import GUSLobbyWebSocketInteractionInfo, { SERVER_MESSAGES, CLIENT_MESSAGES, GAME_CLIENT_MESSAGES } from '../../../../../../common/PIXI/src/dgphoenix/gunified/model/interaction/server/GUSLobbyWebSocketInteractionInfo';

class LobbyWebSocketInteractionInfo extends GUSLobbyWebSocketInteractionInfo
{
	constructor()
	{
		super();
	}
}

export { SERVER_MESSAGES, CLIENT_MESSAGES, GAME_CLIENT_MESSAGES };
export default LobbyWebSocketInteractionInfo;