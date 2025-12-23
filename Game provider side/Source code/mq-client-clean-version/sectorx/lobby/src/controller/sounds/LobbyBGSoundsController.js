import { BACKGROUND_SOUNDS_FADING_TIME } from '../../../../shared/src/CommonConstants';
import GUSLobbyBGSoundsController from '../../../../../common/PIXI/src/dgphoenix/gunified/controller/sounds/GUSLobbyBGSoundsController';

const LOBBY_DEFAULT_BACKGROUND_SOUND_NAME = "mq_mus_lobby_bg";

class LobbyBGSoundsController extends GUSLobbyBGSoundsController
{
	constructor()
	{
		super();
	}

	get __defaultBackgroundSoundName()
	{
		return LOBBY_DEFAULT_BACKGROUND_SOUND_NAME;
	}

	get __bgSoundsFadingTime()
	{
		return BACKGROUND_SOUNDS_FADING_TIME;
	}
}

export default LobbyBGSoundsController;