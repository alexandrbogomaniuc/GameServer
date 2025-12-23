import GUSLobbyWebSocketInteractionController from '../../../../../../common/PIXI/src/dgphoenix/gunified/controller/interaction/server/GUSLobbyWebSocketInteractionController';
import LobbyWebSocketInteractionInfo from '../../../model/interaction/server/LobbyWebSocketInteractionInfo';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import {CLIENT_MESSAGES} from '../../../../../../common/PIXI/src/dgphoenix/gunified/model/interaction/server/GUSLobbyWebSocketInteractionInfo';
import LobbyScreen from '../../../main/LobbyScreen';
class LobbyWebSocketInteractionController extends GUSLobbyWebSocketInteractionController
{
	constructor(aOptInfo)
	{
		super(aOptInfo || new LobbyWebSocketInteractionInfo());
	}

	__initControlLevel()
	{
		super.__initControlLevel();
		let lobbyScreen = APP.lobbyScreen;
		lobbyScreen.on(LobbyScreen.EVENT_ON_AVATAR_CHANGE_REQUIRED, this._onChangeAvatarRequired, this);
	}
	
	_onChangeAvatarRequired(event)
	{
		this._sendRequest(CLIENT_MESSAGES.CHANGE_AVATAR, {borderStyle: event.borderStyle, hero: event.hero, background: event.background});
	}
}

export default LobbyWebSocketInteractionController