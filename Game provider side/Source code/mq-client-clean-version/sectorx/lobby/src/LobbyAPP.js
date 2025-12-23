import GUSLobbyApplication from '../../../common/PIXI/src/dgphoenix/gunified/controller/main/GUSLobbyApplication';
import LobbyScreen from './main/LobbyScreen';
import LobbyExternalCommunicator from './controller/external/LobbyExternalCommunicator';
import LobbySoundsController from './controller/sounds/LobbySoundsController';
import SoundsBackgoundLoadingController from './controller/sounds/SoundsBackgoundLoadingController';
import SoundSettingsController from './controller/sounds/SoundSettingsController';
import SecondaryScreenController from './controller/uis/custom/secondary/SecondaryScreenController';
import LobbyStateController from './controller/state/LobbyStateController';
import LobbyPlayerController from './controller/custom/LobbyPlayerController';
import DialogsController from './controller/uis/custom/dialogs/DialogsController';
import LobbyWebSocketInteractionController from './controller/interaction/server/LobbyWebSocketInteractionController';
import PseudoGameWebSocketInteractionController from './controller/interaction/server/PseudoGameWebSocketInteractionController';
import LobbyJSEnvironmentInteractionController from './controller/interaction/js/LobbyJSEnvironmentInteractionController';
import RedirectionController from './controller/interaction/browser/redirection/RedirectionController';
import CommonPanelController from './controller/uis/custom/commonpanel/CommonPanelController';
import VueApplicationController from './vue/VueApplicationController';
import LobbyDebuggingController from './controller/debug/LobbyDebuggingController';
import LobbyErrorHandlingController from './controller/error/LobbyErrorHandlingController';
import LobbyBonusController from './controller/uis/custom/bonus/LobbyBonusController';
import SubloadingController from './controller/subloading/SubloadingController';
import FRBController from './controller/custom/frb/FRBController';
import TournamentModeController from './controller/custom/tournament/TournamentModeController';
import GUSLobbyTutorialController from '../../../common/PIXI/src/dgphoenix/gunified/controller/uis/custom/tutorial/GUSLobbyTutorialController';
import TutorialView from './view/uis/custom/tutorial/TutorialView';
import CustomCurrencyInfo from './model/currency/CustomCurrencyInfo';
import { APP } from '../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import GUSLobbyExternalCommunicator from '../../../common/PIXI/src/dgphoenix/gunified/controller/external/GUSLobbyExternalCommunicator';
import { GAME_MESSAGES } from '../../../common/PIXI/src/dgphoenix/gunified/controller/external/GUSLobbyExternalCommunicator';

/**
 * @augments Application
 */
class LobbyApp extends GUSLobbyApplication
{
	static get EVENT_ON_OFFLINE()								{return GUSLobbyApplication.EVENT_ON_OFFLINE;}
	static get EVENT_ON_ONLINE_RESTORED()						{return GUSLobbyApplication.EVENT_ON_ONLINE_RESTORED;}

	constructor(...args)
	{
		super(...args);

		this._fPauseTimeout_int = undefined;
		this._fIsRestartLobbyRequired_bl = false;
		this._gameState = null; 
		APP.externalCommunicator.on(GUSLobbyExternalCommunicator.GAME_MESSAGE_RECEIVED, this._onGameMessageReceived, this);

	}

	_onGameMessageReceived(aEvent_obj)
	{

		if (aEvent_obj.type == GAME_MESSAGES.ON_GAME_STATE_CHANGED)
		{
			this._gameState = aEvent_obj.data.value;
		}
	}


	get gameState()
	{
		return this._gameState;
	}

	//SUBLOADING...
	__provideSubloadingControllerInstance()
	{
		return new SubloadingController();
	}
	//...SUBLOADING

	//SECONDARY SCREEN...
	__provideSecondaryScreenControllerInstance()
	{
		return new SecondaryScreenController();
	}
	//...SECONDARY SCREEN

	//SOUND SETTINGS...
	__provideSoundSettingsControllerInstance()
	{
		return new SoundSettingsController();
	}
	//...SOUND SETTINGS

	//SOUNDS...
	__provideSoundsControllerInstance()
	{
		return new LobbySoundsController();
	}
	//...SOUNDS

	//LOBBY STATE...
	__provideLobbyStateControllerInstance()
	{
		return new LobbyStateController();
	}
	//...LOBBY STATE

	//LOBBY PLAYER...
	__provideLobbyPlayerControllerInstance()
	{
		return new LobbyPlayerController();
	}
	//...LOBBY PLAYER

	//WEB SOCKET...
	__providePseudoGameWebSocketInteractionControllerInstance()
	{
		return new PseudoGameWebSocketInteractionController();
	}
	//...WEB SOCKET

	//EXTERNAL COMMUNICATOR...
	__provideExternalCommunicatorInstance()
	{
		return new LobbyExternalCommunicator();
	}
	//...EXTERNAL COMMUNICATOR

	//SOUNDS BACKGROUND LOADING...
	__provideSoundsBackgoundLoadingControllerInstance()
	{
		return new SoundsBackgoundLoadingController();
	}
	//...SOUNDS BACKGROUND LOADING

	//DEBUG...
	__provideLobbyDebuggingControllerInstance()
	{
		return new LobbyDebuggingController();
	}
	//...DEBUG

	__provideLobbyErrorHandlingControllerInstance()
	{
		return new LobbyErrorHandlingController();
	}
	//...ERROR HANDLING

	//VUE...
	__provideVueApplicationControllerInstance()
	{
		return new VueApplicationController();
	}
	//...VUE

	//DIALOGS...
	__provideDialogsControllerInstance()
	{
		return new DialogsController();
	}
	//...DIALOGS

	//TOURNAMENT...
	__provideTournamentModeControllerInstance()
	{
		return new TournamentModeController();
	}
	//...TOURNAMENT

	//JS ENVIRONMENT...
	__provideJSEnvironmentInteractionControllerInstance()
	{
		return new LobbyJSEnvironmentInteractionController();
	}
	//...JS ENVIRONMENT

	//REDIRECTION...
	__provideRedirectionControllerInstance()
	{
		return new RedirectionController();
	}
	//...REDIRECTION

	//BONUS...
	__provideLobbyBonusControllerInstance()
	{
		return new LobbyBonusController();
	}
	//...BONUS

	//FRB...
	__provideLobbyFRBControllerInstance()
	{
		return new FRBController();
	}
	//...FRB

	//COMMON_PANEL...
	__provideCommonPanelControllerInstance()
	{
		return new CommonPanelController();
	}
	//...COMMON_PANEL

	//TUTORIAL...
	__provideLobbyTutorialControllerInstance()
	{
		return new GUSLobbyTutorialController(null, new TutorialView());
	}

	get isTutorialSupported()
	{
		return true;
	}

	get goToHomeParams()
	{
		return {sid:APP.urlBasedParams.SID, privateRoomID:APP.appParamsInfo.privateRoomId};
	}
	//...TUTORIAL

	//LOBBY SCREEN...
	__provideLobbyScreenInstance()
	{
		return new LobbyScreen();
	}
	//...LOBBY SCREEN

	//override
	get _unnecessaryPreloaderAssets()
	{
		return ['preloader/back', 'preloader/tips_base', 
				'preloader/loading_bar/back', 'preloader/loading_bar/fill', 'preloader/loading_bar/empty',
				'preloader/teasers/teaser_0', 'preloader/teasers/teaser_1',
				'preloader/play_now_button_base_enabled', 'preloader/play_now_button_base_disabled', 'preloader/play_now_button_base_selected'];
	}

	_generateWebSocketInteractionInstance()
	{
		return new LobbyWebSocketInteractionController();
	}

	__generateCurrencyInfo()
	{
		return new CustomCurrencyInfo();
	}

	get __preloaderBgMusicAssetName()
	{
		return "mq_mus_lobby_bg";
	}

	_switchPreloaderToLobbyScreen()
	{
		super._switchPreloaderToLobbyScreen();
		this.lobbyScreen.visible = false;
	}

}

export default LobbyApp;