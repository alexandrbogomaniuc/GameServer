import GUSLobbySoundsController from '../../../../../common/PIXI/src/dgphoenix/gunified/controller/sounds/GUSLobbySoundsController';
import LobbySoundsInfo from '../../model/sounds/LobbySoundsInfo';
import ASSETS from '../../config/assets.json';
import PRELOADER_ASSETS from '../../config/preloader_assets.json';
import LobbyBGSoundsController from './LobbyBGSoundsController';

class LobbySoundsController extends GUSLobbySoundsController
{
	constructor()
	{
		super(new LobbySoundsInfo());

		this._initGSoundsController();
	}

	_initGSoundsController()
	{
	}

	__provideLobbyBGSoundsControllerInstance()
	{
		return new LobbyBGSoundsController();
	}

	get __acceptBtnClickSoundName()
	{
		return "mq_gui_button_generic_ui";
	}

	get __cancelBtnClickSoundName()
	{
		return "mq_gui_button_generic_ui";
	}

	get __commonBtnClickSoundName()
	{
		return "mq_gui_button_generic_ui";
	}

	get __launchGameSoundName()
	{
		return "mq_gui_launch";
	}

	get __preloaderMusicSoundName()
	{
		return "mq_mus_lobby_bg";
	}

	get __preloaderSoundsAssets()
	{
		return PRELOADER_ASSETS.sounds;
	}

	get __lobbySoundsAssets()
	{
		return ASSETS.sounds;
	}
}

export default LobbySoundsController;