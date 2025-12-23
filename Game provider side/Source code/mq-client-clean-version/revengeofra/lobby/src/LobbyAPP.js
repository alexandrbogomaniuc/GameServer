import Application from '../../../common/PIXI/src/dgphoenix/unified/controller/main/Application';
import LobbyScreen from './main/LobbyScreen';
import LobbyLayout from './layout/LobbyLayout';
import {DOM_LAYERS} from './layout/LobbyLayout';
import GameLauncher from './main/GameLauncher';
import LobbyExternalCommunicator from './external/LobbyExternalCommunicator';
import {GAME_MESSAGES, LOBBY_MESSAGES} from '../../../common/PIXI/src/dgphoenix/gunified/controller/external/GUSLobbyExternalCommunicator';
import LobbySoundsController from './controller/sounds/LobbySoundsController';
import SoundsBackgoundLoadingController from './controller/sounds/SoundsBackgoundLoadingController';
import SoundSettingsController from './controller/sounds/SoundSettingsController';
import Sprite from '../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import BrowserSupportController from '../../../common/PIXI/src/dgphoenix/unified/controller/preloading/BrowserSupportController';
import CustomerspecController from '../../../common/PIXI/src/dgphoenix/unified/controller/preloading/CustomerspecController';
import SecondaryScreenController from './controller/uis/custom/secondary/SecondaryScreenController';
import PaytableScreenController from './controller/uis/custom/secondary/paytable/PaytableScreenController';
import LobbyStateController from './controller/state/LobbyStateController';
import LobbyPlayerController from './controller/custom/LobbyPlayerController';
import DialogsController from './controller/uis/custom/dialogs/DialogsController';
import DialogController from './controller/uis/custom/dialogs/DialogController';
import LobbyWebSocketInteractionController from './controller/interaction/server/LobbyWebSocketInteractionController';
import PseudoGameWebSocketInteractionController from './controller/interaction/server/PseudoGameWebSocketInteractionController';
import LobbyJSEnvironmentInteractionController from './controller/interaction/js/LobbyJSEnvironmentInteractionController';
import RedirectionController from './controller/interaction/browser/redirection/RedirectionController';
import CommonPanelController from './controller/uis/custom/commonpanel/CommonPanelController';
import LobbyTooltipsController from './controller/uis/custom/tooltips/LobbyTooltipsController';
import VueApplicationController from './vue/VueApplicationController';
import KeyboardControlProxy from '../../../common/PIXI/src/dgphoenix/unified/controller/interaction/keyboard/KeyboardControlProxy';
import LobbyProfilingController from './controller/profiling/LobbyProfilingController';
import LobbyDebuggingController from './controller/debug/LobbyDebuggingController';
import LobbyErrorHandlingController from './controller/error/LobbyErrorHandlingController';
import LobbyBonusController from './controller/uis/custom/bonus/LobbyBonusController';
import SubloadingController from './controller/subloading/SubloadingController';
import FRBController from './controller/custom/frb/FRBController';
import TournamentModeController from './controller/custom/tournament/TournamentModeController';

/**
 * @augments Application
 */
class LobbyApp extends Application
{
	static get EVENT_ON_LOBBY_STARTED() 					{return "onLobbyStarted";}
	static get EVENT_ON_SOUND_SETTINGS_CHANGED() 			{return "onSoundSettingsChanged";}
	static get EVENT_ON_PLAYER_INFO_UPDATED() 				{return "onPlayerInfoUpdated";}
	static get EVENT_ON_LOBBY_ASSETS_LOADING_ERROR() 		{return "onLobbyAssetsLoadingError";}
	static get EVENT_ON_LOBBY_RESTART_REQUIRED() 			{return "onLobbyRestartRequird"; }
	static get EVENT_ON_LOBBY_REFRESH_BALANCE_REQUIRED() 	{return "EVENT_ON_LOBBY_REFRESH_BALANCE_REQUIRED";}
	static get EVENT_ON_LOBBY_SCREEN_SHOWED()				{return "EVENT_ON_LOBBY_SCREEN_SHOWED";}
	static get EVENT_ON_LOBBY_UI_HIDDED() 					{return "EVENT_ON_LOBBY_UI_HIDDED";}
	static get EVENT_ON_LOBBY_UI_SHOWN() 					{return "EVENT_ON_LOBBY_UI_SHOWN";}
	static get EVENT_ON_SOME_BONUS_STATE_CHANGED() 			{return "EVENT_ON_SOME_BONUS_STATE_CHANGED";}
	static get EVENT_ON_ROOM_CLOSED() 						{return "onRoomClosed";}

	static get EVENT_ON_PROFILE_BUTTON_CLICKED()			{return CommonPanelController.EVENT_EDIT_PROFILE_BUTTON_CLICKED;}
	static get EVENT_ON_SETTINGS_BUTTON_CLICKED()			{return CommonPanelController.EVENT_SETTINGS_BUTTON_CLICKED;}
	static get EVENT_ON_INFO_BUTTON_CLICKED() 				{return CommonPanelController.EVENT_INFO_BUTTON_CLICKED;}
	static get EVENT_LOBBY_ROOM_WEAPONS_INDICATOR_CLICK() 	{return LobbyScreen.EVENT_LOBBY_ROOM_WEAPONS_INDICATOR_CLICK};

	constructor(...args)
	{
		super(...args);

		this._fIsMobilePlatform_bl = undefined;

		this._fLobbyScreen_sprt = null;
		this._fLobbyWaitScreen_sprt = null;

		this._fLobbyContainer_sprt = new Sprite();
		this._fSecondaryContainer_sprt = new Sprite();
		
		this.appParamsInfo.backgroundLoadingAllowed && (this._fSubloadingController_sc = new SubloadingController());
		this._fSecondaryScreenController_ssc = new SecondaryScreenController();
		this._fSoundSettingsController_ssc = new SoundSettingsController();
		this._fSoundsController_lsc = new LobbySoundsController();

		this._fBrowserSupportController_bsc = new BrowserSupportController();
		this._fCustomerspecController_cc = new CustomerspecController();
		this._fLobbyStateController_lsc = new LobbyStateController();
		this._fLobbyPlayerController_lpc = new LobbyPlayerController();

		this._pseudoGameWebSocketInteractionController = null;
		this.externalCommunicator = new LobbyExternalCommunicator();
		this._lobbyAppStarted = false;

		this._fBuyInFuncName_str = undefined;

		this._fPauseTimeout_int = undefined;

		this._fSoundsBgLoadingController_ssblc = null;
		this.soundsLoadingInitiated = false;

		this._fLobbyDebuggingController_ldc = null;
		this._fLobbyErrorHandlingController_lehc = null;

		this._fIsRestartLobbyRequired_bl = false;

		this._initVueApplicationController();
		this._initDialogsController();
		this._initErrorHandlingController();
		this._initTournamentModeController();
		this._initJSEnvironmentInteractionController();
		this._initRedirectionController();
		this._initLobbyBonusController();
		this._initFRBController();
		this._initCommonPanelController();
		this._initTooltipsController();
		this._initLobbyDebuggingController();
	}

	_addStages()
	{
		super._addStages();

		this.dialogsStage = this.addStage(DOM_LAYERS.DIALOGS, undefined, PIXI.RENDERER_TYPE.CANVAS);
		
		this.commonPanelStages = [];
		let layersParams_obj_arr = CommonPanelController.getCommonPanelLayers(this.isMobile);
		for (var i = 0; i < layersParams_obj_arr.length; i++)
		{
			let layerId_int = layersParams_obj_arr[i].id;
			this.commonPanelStages[layerId_int] = this.addStage(DOM_LAYERS.COMMON_PANEL + "_" + layerId_int, layersParams_obj_arr[i], PIXI.RENDERER_TYPE.CANVAS);
		}

		let margin = this.config.margin;
		let preloaderWidth_num = this.config.size.width + (margin.left || 0) + (margin.right || 0);
		let preloaderHeight_num = this.config.size.height  + (margin.top || 0) + (margin.bottom || 0);
		if (this.isMobile)
		{
			this.fullscreenNoteStage = this.addStage(DOM_LAYERS.FULLSCREEN_NOTIFICATION, {width:preloaderWidth_num, height:preloaderHeight_num}, PIXI.RENDERER_TYPE.CANVAS);
		}
	}

	get applicationFolderURL()
	{
		let appFolderURL = this.appParamsInfo.lobbyPath;
		if (!appFolderURL)
		{
			appFolderURL = super.applicationFolderURL;
		}
		return appFolderURL;
	}

	//override
	get _unnecessaryPreloaderAssets()
	{
		return ['preloader/back', 'preloader/mummy', 'preloader/smoke', 'preloader/sparks', 
				'preloader/burst', 'preloader/orange_flare', 'preloader/eye_glow', 'preloader/tips_base', 
				'preloader/loading_bar/back', 'preloader/loading_bar/fill',
				'TATipScreen0', 'TATipScreen1', 'TATipScreen2', 'TATipScreen3'];
	}

	get playerController()
	{
		return this._fLobbyPlayerController_lpc;
	}

	get subloadingController()
	{
		return this._fSubloadingController_sc;
	}

	get secondaryScreenController()
	{
		return this._fSecondaryScreenController_ssc;
	}

	get soundSettingsController()
	{
		return this._fSoundSettingsController_ssc;
	}

	get soundsController()
	{
		return this._fSoundsController_lsc;
	}

	get browserSupportController()
	{
		return this._fBrowserSupportController_bsc;
	}

	get customerspecController()
	{
		return this._fCustomerspecController_cc;
	}

	get lobbyStateController()
	{
		return this._fLobbyStateController_lsc;
	}

	get domLayoutClass()
	{
		return LobbyLayout;
	}

	get dialogsController()
	{
		return this._fDialogsController_dsc;
	}

	get commonPanelController()
	{
		return this._fCommonPanelController_cpc;
	}

	get jsEnvironmentInteractionController()
	{
		return this._jsEnvironmentInteractionController;
	}

	get redirectionController()
	{
		return this._redirectionController;
	}

	get lobbyBonusController()
	{
		return this._fLobbyBonusController_lbc;
	}

	get vueApplicationController()
	{
		return this._fVueApplicationController_vac;
	}

	get tournamentModeController()
	{
		return this._fTournamentModeController_tmc;
	}

	get isMobile()
	{
		if (this._fIsMobilePlatform_bl === undefined)
		{
			let lPlatformParams_obj = window["getPlatformInfo"] ? window["getPlatformInfo"].apply(window) || {} : {};
			if (
					lPlatformParams_obj["mobile"]
					|| (
							(
								lPlatformParams_obj["name"] === "Safari"
								|| navigator.platform === 'MacIntel'
							)
							&& navigator.maxTouchPoints > 0
						)
				)
			{
				this._fIsMobilePlatform_bl = lPlatformParams_obj["mobile"];
			}
			else
			{
				this._fIsMobilePlatform_bl = false;
			}
		}
		return this._fIsMobilePlatform_bl;
	}

	//@override
	get isErrorHandlingMode()
	{
		//DEBUG...
		//return !this.isDebugMode;
		//...DEBUG
		return this.appParamsInfo.errorHandlingAllowed;
	}

	get buyInFuncName()
	{
		return this._fBuyInFuncName_str;
	}

	get buyInFuncDefined()
	{
		return this._fBuyInFuncName_str !== undefined;
	}

	get tooltipsController()
	{
		return this._tooltipsController;
	}

	initSoundsBackgroundLoading()
	{
		this.soundsBgLoadingController.init();
	}

	get soundsBgLoadingController()
	{
		let lSoundsBgLoadingController_ssblc = this._fSoundsBgLoadingController_ssblc;
		if (!lSoundsBgLoadingController_ssblc)
		{
			lSoundsBgLoadingController_ssblc = new SoundsBackgoundLoadingController();
		}

		return lSoundsBgLoadingController_ssblc;
	}

	get FRBController()
	{
		return this._fFRBController_frbc;
	}

	run()
	{
		super.run();

		this.initWebSocket();
		this._startHandlingServerMessages();

		this._fSecondaryScreenController_ssc.init(this._fSecondaryContainer_sprt);
		this._fSecondaryScreenController_ssc.on(SecondaryScreenController.EVENT_SCREEN_DEACTIVATED, this.onSecondaryScreenDeactivated, this);
		this._fSecondaryScreenController_ssc.on(SecondaryScreenController.EVENT_SCREEN_ACTIVATED, this.onSecondaryScreenActivated, this);

		this._fSecondaryScreenController_ssc.initView();

		if (this.isMobile)
		{
			let lPaytableScreenController_psc = this._fSecondaryScreenController_ssc.paytableScreenController;
			lPaytableScreenController_psc.on(PaytableScreenController.EVENT_ON_SCREEN_SHOW, this._onMobilePaytableActivated, this);
			lPaytableScreenController_psc.on(PaytableScreenController.EVENT_ON_SCREEN_HIDE, this._onMobilePaytableDeactivated, this);
		}

		this._fCommonPanelController_cpc.init();
		this._fCommonPanelController_cpc.initView(this.commonPanelStages);

		this.stage.view.addChild(this._fLobbyContainer_sprt);
		this.stage.view.addChild(this._fSecondaryContainer_sprt);

		this._fSecondaryContainer_sprt.visible = false;

		this._jsEnvironmentInteractionController.init();
		this._redirectionController.init();

		this.parsePageParams();
		this.startLobby();

		this.vueApplicationController.on(VueApplicationController.EVENT_TIME_TO_SHOW_VUE_LAYER, this._onTimeToShowVueLayer, this);
		this.vueApplicationController.on(VueApplicationController.EVENT_TIME_TO_HIDE_VUE_LAYER, this._onTimeToHideVueLayer, this);

		this._lobbyAppStarted = true;
		this.emit(LobbyApp.EVENT_ON_LOBBY_STARTED);

		this.on("contextmenu", this._onContextMenu, this);
	}

	_onWebglContextLost(event)
	{
		super._onWebglContextLost(event);

		this.externalCommunicator.sendExternalMessage(LOBBY_MESSAGES.WEBGL_CONTEXT_LOST);
	}

	_onContextMenu(event)
	{
		this.externalCommunicator.sendExternalMessage(LOBBY_MESSAGES.CONTEXT_MENU);
	}

	parsePageParams()
	{
		if (this.appParamsInfo.buyInFuncName)
		{
			this._fBuyInFuncName_str = this.appParamsInfo.buyInFuncName;
		}
	}

	restartLobby()
	{
		this._restartLobby();
	}

	get lobbyAppStarted()
	{
		return this._lobbyAppStarted;
	}

	get isKeepSWModeActive()
	{
		// Сохранение оружия полностью отключено на сервере для Revenge of Ra. Даже если в templates MQ_WEAPONS_SAVING_ALLOWED приходит true, на сервер сохранение работать не будет.
		let lIsKeepSW_bl = false; // this.appParamsInfo.weaponsSavingAllowed;

		let lBonusInfo_bi = this.lobbyBonusController.info;
		if (lBonusInfo_bi.isActivated)
		{
			lIsKeepSW_bl = lBonusInfo_bi.keepBonusSW;
		}

		let lFrbInfo_fi = this.FRBController.info;
		if (lFrbInfo_fi.isActivated)
		{
			lIsKeepSW_bl = lFrbInfo_fi.keepBonusSW;
		}

		let lTournamentModeinfo_tmi = this.tournamentModeController.info;
		if (lTournamentModeinfo_tmi.isTournamentMode)
		{
			lIsKeepSW_bl = lTournamentModeinfo_tmi.isKeepSWMode;
		}

		return lIsKeepSW_bl;
	}

	_onSomeBonusStateChanged()
	{
		this.lobbyScreen.onSomeBonusStateChanged();
		this.emit(LobbyApp.EVENT_ON_SOME_BONUS_STATE_CHANGED);
	}

	_onSomeBonusStateChanged()
	{
		this.lobbyScreen.onSomeBonusStateChanged();
		this.emit(LobbyApp.EVENT_ON_SOME_BONUS_STATE_CHANGED);
	}

	_generateWebSocketInteractionInstance()
	{
		return new LobbyWebSocketInteractionController();
	}

	get pseudoGamewebSocketInteractionController()
	{
		return this._pseudoGameWebSocketInteractionController || (this._pseudoGameWebSocketInteractionController = new PseudoGameWebSocketInteractionController());
	}

	_startHandlingServerMessages()
	{
		let wsInteractionController = this.webSocketInteractionController;
		wsInteractionController.on(LobbyWebSocketInteractionController.EVENT_ON_SERVER_ERROR_MESSAGE, this._onServerErrorMessage, this);
	}

	_onServerErrorMessage(event)
	{
		this.externalCommunicator.sendExternalMessage(LOBBY_MESSAGES.SERVER_ERROR_MESSAGE_RECIEVED, {errorType: event.errorType, errorCode: event.messageData.code});
	}

	onApplicationReady()
	{
		this._fBrowserSupportController_bsc.init();
		this._fBrowserSupportController_bsc.on(BrowserSupportController.i_EVENT_BROWSER_SUPPORT_CONFIRMED, () => {this.emit("browserConfirmed")});

		this._fCustomerspecController_cc.init();

		this._fSoundSettingsController_ssc.init();
		this._fSoundSettingsController_ssc.on(SoundSettingsController.EVENT_ON_SOUND_VOLUME_CHANGED, this.onSoundVolumeChanged, this);

		let soundSettingsInfo = this._fSoundSettingsController_ssc.i_getInfo();
		this._fSoundsController_lsc.init(this.config.audio.stereo, soundSettingsInfo.soundsLoadingAvailable,
																	soundSettingsInfo.soundsMuted,
																	soundSettingsInfo.i_getFxSoundsVolume(),
																	soundSettingsInfo.i_getBgSoundsVolume());

		this._fLobbyPlayerController_lpc.init();
		this._fLobbyPlayerController_lpc.on(LobbyPlayerController.EVENT_ON_PLAYER_INFO_UPDATED, this.playerInfoUpdated, this);

		this._fLobbyStateController_lsc.init();
		this._fLobbyStateController_lsc.on(LobbyStateController.EVENT_ON_LOBBY_VISIBILITY_CHANGED, this.onLobbyScreenVisibilityChanged, this);
		this._fLobbyStateController_lsc.on(LobbyStateController.EVENT_ON_SECONDARY_SCREEN_STATE_CHANGE, this.onSecondaryScreenStateChange, this);

		this._fDialogsController_dsc.init();

		let nemDialogController = this._fDialogsController_dsc.gameNEMDialogController;
		nemDialogController.on(DialogController.EVENT_ON_DLG_CUSTOM_BTN_CLICKED, this._onNEMDialogCustomButtonClicked, this);
		nemDialogController.on(DialogController.EVENT_REQUEST_CONFIRMED, this._onGameNEMDialogRequestConfirmed, this);

		let forceSitOutDialogController = this._fDialogsController_dsc.forceSitOutDialogController;
		forceSitOutDialogController.on(DialogController.EVENT_REQUEST_CONFIRMED, this._onForceSitOutDialogControllerDialogRequestConfirmed, this);

		let midRoundCompensateSWExitDialogController = this._fDialogsController_dsc.midRoundCompensateSWExitDialogController;
		midRoundCompensateSWExitDialogController.on(DialogController.EVENT_REQUEST_CONFIRMED, this._onMidRoundCompensateSWExitDialogRequestConfirmed, this);

		let midRoundExitDialogController = this._fDialogsController_dsc.midRoundExitDialogController;
		midRoundExitDialogController.on(DialogController.EVENT_REQUEST_CONFIRMED, this._onMidRoundExitDialogRequestConfirmed, this);

		this.keyboardControlProxy.on(KeyboardControlProxy.i_EVENT_BUTTON_CLICKED, this._onKeyboardButtonClicked, this);

		let gameBuyAmmoFailedDialogController = this._fDialogsController_dsc.gameBuyAmmoFailedDialogController;
		gameBuyAmmoFailedDialogController.on(DialogController.EVENT_REQUEST_CONFIRMED, this._onBuyAmmoFailedDialogRequestConfirmed, this);
		gameBuyAmmoFailedDialogController.on(DialogController.EVENT_ON_DLG_CUSTOM_BTN_CLICKED, this._onBuyAmmoFailedDialogExitBtnClicked, this);

		let gameRebuyDialogController = this._fDialogsController_dsc.gameRebuyDialogController;
		gameRebuyDialogController.on(DialogController.EVENT_REQUEST_CONFIRMED, this._onGameRebuyDialogRequestConfirmed, this);
		gameRebuyDialogController.on(DialogController.EVENT_DIALOG_PRESENTED, this._onGameRebuyDialogPresented, this);		

		let gameNEMForRoomDialogController = this._fDialogsController_dsc.gameNEMForRoomDialogController;
		gameNEMForRoomDialogController.on(DialogController.EVENT_REQUEST_CONFIRMED, this._onGameNEMForRoomDialogRequestConfirmed, this);

		super.onApplicationReady();
	}

	playPreloaderSounds()
	{
		let l_ussc = this.soundsController.play("mq_mus_lobby_bg");
		this.soundsController.setFadeMultiplier("mq_mus_lobby_bg", 0);

		if (this.soundsController.info.soundsMuted)
		{
			this.on(LobbyApp.EVENT_ON_SOUND_SETTINGS_CHANGED, this._onSoundSettingsChanged, this);
		}
		else
		{
			this.soundsController.setVolumeSmoothly("mq_mus_lobby_bg", 1, 5000, null);
		}
	}

	_onSoundSettingsChanged(event)
	{
		if (!event.muted)
		{
			this.off(LobbyApp.EVENT_ON_SOUND_SETTINGS_CHANGED, this._onSoundSettingsChanged, this);

			this.soundsController.setVolumeSmoothly("mq_mus_lobby_bg", 1, 5000, null);
		}
	}

	resize(width, height)
	{
		super.resize(width, height);
		this.dialogsStage.resize(width, height);
	}

	onLoaderUIReady()
	{
		super.onLoaderUIReady();
		this._fDialogsController_dsc.initView(this.dialogsStage.view);
	}

	startLobby()
	{
		this.lobbyScreen.visible = false;
		this.webSocketInteractionController.on(LobbyWebSocketInteractionController.EVENT_ON_SERVER_ENTER_LOBBY_MESSAGE, this._onServerEnterLobbyMessage, this);

		this.initGameCommunicator();
		this.initGameLauncher();
	}

	_onServerEnterLobbyMessage(event)
	{
		if (this.isPreloaderActive)
		{
			this._switchPreloaderToLobbyScreen();
		}
		this.externalCommunicator.sendExternalMessage(LOBBY_MESSAGES.ENTER_LOBBY_MESSAGE_RECEIVED);
	}

	_switchPreloaderToLobbyScreen()
	{
		this.lobbyScreen.visible = true;
		this.layout.hidePreloader();
		this.layout.showCommonPanel();

		this.removePreloader();

		this.emit(LobbyApp.EVENT_ON_LOBBY_SCREEN_SHOWED);
	}

	handleAssetsLoadingError(errorKey, errorMessage)
	{
		this.emit(LobbyApp.EVENT_ON_LOBBY_ASSETS_LOADING_ERROR, {key:errorKey, message:errorMessage});

		this.preLoader.stopSpinnerUpdate();
		this.layout.hidePrePreloader();

		let lLobbyScreen_sprt = this._fLobbyScreen_sprt;
		if (lLobbyScreen_sprt)
		{
			lLobbyScreen_sprt.clearInfo();
			lLobbyScreen_sprt.hideLobby();
		}

		this.externalCommunicator.sendExternalMessage(LOBBY_MESSAGES.LOBBY_LOADING_ERROR);
	}

	//TOURNAMENT...
	_initTournamentModeController()
	{
		this._fTournamentModeController_tmc = new TournamentModeController();
		this._fTournamentModeController_tmc.i_init();
	}
	//...TOURNAMENT

	//WAIT SCREEN...
	get lobbyWaitScreen()
	{
		return this._fLobbyWaitScreen_sprt || (this._fLobbyWaitScreen_sprt = this._initLobbyWaitScreen());
	}

	_initLobbyWaitScreen()
	{
		return this._fLobbyContainer_sprt.addChild(new Sprite());
	}
	//...WAIT SCREEN

	//LOBBY SCREEN...
	get lobbyScreen ()
	{
		return this._fLobbyScreen_sprt || (this._fLobbyScreen_sprt = this._initLobbyScreen());
	}

	_initLobbyScreen()
	{
		let l_sprt = new LobbyScreen();
		l_sprt.init();
		l_sprt.on(LobbyScreen.EVENT_ON_LOBBY_SETTINGS_CLICKED, this.onLobbyScreenSettingsClicked, this);
		l_sprt.on(LobbyScreen.EVENT_ON_LOBBY_INFO_CLICKED, this.onLobbyScreenInfoClicked, this);
		l_sprt.on(LobbyScreen.EVENT_ON_LOBBY_PROFILE_CLICKED, this.onLobbyScreenProfileClicked, this);
		l_sprt.on(LobbyScreen.EVENT_ON_LOBBY_BACK_TO_GAME, this.onBackToGame, this);
		l_sprt.on(LobbyScreen.EVENT_ON_PSEUDO_GAME_URL_READY, this.onPseudoGameUrlReady, this);
		l_sprt.on(LobbyScreen.EVENT_LOBBY_ROOM_WEAPONS_INDICATOR_CLICK, this.onLobbyScreenWeaponsIndicatorClicked, this);

		this._fLobbyContainer_sprt.addChild(l_sprt);
		return l_sprt;
	}

	//TOOLTIPS...
	get _tooltipsController()
	{
		return this._fTooltipsController_ltc || (this._fTooltipsController_ltc = this._initTooltipsController());
	}

	_initTooltipsController()
	{
		let l_ltc = new LobbyTooltipsController();
		this._fTooltipsController_ltc = l_ltc;

		l_ltc.i_init();

		return l_ltc;
	}
	//...TOOLTIPS

	//DEBUG...
	get lobbyDebuggingController()
	{
		return this._fLobbyDebuggingController_ldc || (this._fLobbyDebuggingController_ldc = this._initLobbyDebuggingController());
	}

	_initLobbyDebuggingController()
	{
		let l_ldc = new LobbyDebuggingController();
		this._fLobbyDebuggingController_ldc = l_ldc;

		l_ldc.i_init();

		return l_ldc;
	}
	//...DEBUG

	//ERROR HANDLING...
	get errorHandlingController()
	{
		return this._fLobbyErrorHandlingController_lehc || (this._fLobbyErrorHandlingController_lehc = this._initErrorHandlingController());
	}

	_initErrorHandlingController()
	{
		let l_lehc = new LobbyErrorHandlingController();
		this._fLobbyErrorHandlingController_lehc = l_lehc;

		l_lehc.i_init();

		return l_lehc;
	}
	//...ERROR HANDLING

	_initDialogsController()
	{
		let dialogsController = this._fDialogsController_dsc = new DialogsController();
		dialogsController.on(DialogsController.EVENT_DIALOG_ACTIVATED, this._onDialogActivated, this);
		dialogsController.on(DialogsController.EVENT_DIALOG_DEACTIVATED, this._onDialogDeactivated, this);
	}

	_initCommonPanelController()
	{
		this._fCommonPanelController_cpc = new CommonPanelController();
		this._fCommonPanelController_cpc.on(CommonPanelController.EVENT_TIME_SYNC_REQUEST, this._onCommonPanelTimeSync, this);
		this._fCommonPanelController_cpc.on(CommonPanelController.EVENT_REFRESH_BALANCE_REQUEST, this._onCommonPanelRefreshBalance, this);

		this._fCommonPanelController_cpc.on(CommonPanelController.EVENT_EDIT_PROFILE_BUTTON_CLICKED, this._onCommonPanelEditProfileClicked, this);
		this._fCommonPanelController_cpc.on(CommonPanelController.EVENT_SETTINGS_BUTTON_CLICKED, this._onCommonPanelSettingsClicked, this);
		this._fCommonPanelController_cpc.on(CommonPanelController.EVENT_BACK_TO_LOBBY_BUTTON_CLICKED, this._onCommonPanelBackToLobbyClicked, this);
		this._fCommonPanelController_cpc.on(CommonPanelController.EVENT_FIRE_SETTINGS_BUTTON_CLICKED, this._onCommonPanelFireSettingsClicked, this);
		this._fCommonPanelController_cpc.on(CommonPanelController.EVENT_INFO_BUTTON_CLICKED, this._onCommonPanelInfoClicked, this);

		this._fCommonPanelController_cpc.on(CommonPanelController.EVENT_GROUP_BUTTONS_CHANGED, this._onCommonPanelGroupButtonsChanged, this);
	}

	_initFRBController()
	{
		this._fFRBController_frbc = new FRBController();
		this._fFRBController_frbc.i_init();

		this._fFRBController_frbc.on(FRBController.EVENT_FRB_RESTART_REQUIRED, this._onFRBRestartRequired, this);
		this._fFRBController_frbc.on(FRBController.EVENT_ON_FRB_STATE_CHANGED, this._onFRBStateChanged, this);
	}

	_onFRBStateChanged()
	{
		this._onSomeBonusStateChanged();
	}

	_initVueApplicationController()
	{
		this._fVueApplicationController_vac = new VueApplicationController();
		this._fVueApplicationController_vac.i_init();
	}

	_onCommonPanelTimeSync(event)
	{
		this.lobbyScreen.onGetLobbyTimeRequired();
	}

	_onCommonPanelRefreshBalance(event)
	{
		if (!this.lobbyScreen.visible)
		{
			this.externalCommunicator.sendExternalMessage(LOBBY_MESSAGES.GAME_REFRESH_BALANCE_REQUIRED);
		}
		else
		{
			this.emit(LobbyApp.EVENT_ON_LOBBY_REFRESH_BALANCE_REQUIRED);
		}

	}

	//BONUS...
	_initLobbyBonusController()
	{
		this._fLobbyBonusController_lbc = new LobbyBonusController();
		this._fLobbyBonusController_lbc.i_init();

		this._fLobbyBonusController_lbc.on(LobbyBonusController.EVENT_BONUS_RESTART_REQUIRED, this._onBonusRestartRequired, this);
		this._fLobbyBonusController_lbc.on(LobbyBonusController.EVENT_ON_BONUS_STATE_CHANGED, this._onBonusStateChanged, this);
	}

	_onBonusStateChanged()
	{
		this._onSomeBonusStateChanged();
	}

	_onBonusRestartRequired(event)
	{
		if (!this.lobbyScreen.visible) // we are in the room
		{
			let lIsRoomRestartRequired_bl = this._fLobbyBonusController_lbc.info.isRoomRestartRequired;
			this.externalCommunicator.sendExternalMessage(LOBBY_MESSAGES.BONUS_RESTART_REQUIRED, {restartRoom: lIsRoomRestartRequired_bl});
			if (lIsRoomRestartRequired_bl)
			{
				this._fIsRestartLobbyRequired_bl = true; // will restart after room is closed
			}
		}
		else
		{
			this._restartLobby();
		}
	}
	//...BONUS

	_onFRBRestartRequired(event)
	{
		if (!this.lobbyScreen.visible) // we are in the room
		{
			let lIsRoomRestartRequired_bl = this._fFRBController_frbc.info.isRoomRestartRequired;
			this.externalCommunicator.sendExternalMessage(LOBBY_MESSAGES.FRB_RESTART_REQUIRED, {restartRoom: lIsRoomRestartRequired_bl});
			if (lIsRoomRestartRequired_bl)
			{
				this._fIsRestartLobbyRequired_bl = event.noLobbyRestart ? false : true; // will restart after room is closed
			}
		}
		else
		{
			this._restartLobby();
		}
	}

	_tryToRestartLobbyIfNeeded()
	{
		if (this._fIsRestartLobbyRequired_bl)
		{
			this._restartLobby();
		}
	}

	_restartLobby()
	{
		this._fIsRestartLobbyRequired_bl = false;

		this.lobbyScreen.clearInfo();
		this.lobbyScreen.hideLobby();
		this.emit(LobbyApp.EVENT_ON_LOBBY_RESTART_REQUIRED);
	}

	_onNEMDialogCustomButtonClicked(event)
	{
		if (!this.lobbyScreen.visible)
		{
			this.externalCommunicator.sendExternalMessage(LOBBY_MESSAGES.GAME_REFRESH_BALANCE_REQUIRED);
		}
		else
		{
			this.emit(LobbyApp.EVENT_ON_LOBBY_REFRESH_BALANCE_REQUIRED);
		}
	}

	_onGameNEMDialogRequestConfirmed(event)
	{
		let nemDialogController = this._fDialogsController_dsc.gameNEMDialogController;
		let nemDialogInfo = nemDialogController.info;
		
		if (nemDialogInfo.isBonusMode && nemDialogInfo.isBonusModeNEMForRoom)
		{
			this.externalCommunicator.sendExternalMessage(LOBBY_MESSAGES.GAME_NEM_FOR_ROOM_REQUEST_CONFIRMED);
		}
	}

	_onMidRoundCompensateSWExitDialogRequestConfirmed(event)
	{
		if (!this.lobbyScreen.resitOutInProcess && !this.FRBController.info.isActivated)
		{
			this.externalCommunicator.sendExternalMessage(LOBBY_MESSAGES.MID_ROUND_COMPENSATE_SW_EXIT_CONFIRMED);
		}
	}

	_onForceSitOutDialogControllerDialogRequestConfirmed(event)
	{
		if (!this.lobbyScreen.resitOutInProcess)
		{
			this.externalCommunicator.sendExternalMessage(LOBBY_MESSAGES.FORCE_SIT_OUT_EXIT_CONFIRMED);
			this._fIsRestartLobbyRequired_bl = true;
		}
	}

	_onMidRoundExitDialogRequestConfirmed(event)
	{
		this.externalCommunicator.sendExternalMessage(LOBBY_MESSAGES.MID_ROUND_EXIT_CONFIRMED);
	}

	_onBuyAmmoFailedDialogRequestConfirmed(event)
	{
		let gameBuyAmmoFailedDialogInfo = this._fDialogsController_dsc.gameBuyAmmoFailedDialogController.info;

		this.externalCommunicator.sendExternalMessage(LOBBY_MESSAGES.BUY_AMMO_FAILED_RETRY_CONFIRMED, {type: gameBuyAmmoFailedDialogInfo.retryType});
	}

	_onBuyAmmoFailedDialogExitBtnClicked(event)
	{
		this.externalCommunicator.sendExternalMessage(LOBBY_MESSAGES.BUY_AMMO_FAILED_EXIT_ROOM_REQUESTED);
	}

	_onGameRebuyDialogRequestConfirmed(event)
	{
		let lTournamentModeinfo_tmi = this.tournamentModeController.info;	

		if (
				lTournamentModeinfo_tmi.isTournamentMode
				&& lTournamentModeinfo_tmi.rebuyAllowed
				&& !lTournamentModeinfo_tmi.isRebuyLimitExceeded
			)
		{
			this.externalCommunicator.sendExternalMessage(LOBBY_MESSAGES.TOURNAMENT_REBUY_CONFIRMED);
		}
	}

	_onGameRebuyDialogPresented(event)
	{
		let lTournamentModeinfo_tmi = this.tournamentModeController.info;		
		let lGameRebuyDialogController_grdc = this._fDialogsController_dsc.gameRebuyDialogController;
		
		if (
				lTournamentModeinfo_tmi.isTournamentMode
				&& !lGameRebuyDialogController_grdc.keepDlg
				&& (lTournamentModeinfo_tmi.isRebuyLimitExceeded || !lTournamentModeinfo_tmi.rebuyAllowed)
			)
		{
			this.externalCommunicator.sendExternalMessage(LOBBY_MESSAGES.TOURNAMENT_COMEPLETED_WITH_NO_REBUYS);
		}		
	}

	_onGameNEMForRoomDialogRequestConfirmed(event)
	{
		this.externalCommunicator.sendExternalMessage(LOBBY_MESSAGES.GAME_NEM_FOR_ROOM_REQUEST_CONFIRMED);
	}

	_onDialogActivated(event)
	{
		this.layout.showDialogsScreen();
		this.dialogsStage.render();
		this.setTickerPaused(false, "focus");

		this._fLobbyScreen_sprt && this._fLobbyScreen_sprt.showBlur();

		this.externalCommunicator.sendExternalMessage(LOBBY_MESSAGES.DIALOG_ACTIVATED, {dialogId: event.dialogId});
	}

	_onDialogDeactivated(event)
	{
		let dialogsController = this._fDialogsController_dsc;
		if (!dialogsController.info.hasActiveDialog)
		{
			this.dialogsStage.render();
			this.layout.hideDialogsScreen();
			this._fLobbyScreen_sprt && this._fLobbyScreen_sprt.hideBlur();
		}
		this._fLobbyScreen_sprt && this._fLobbyScreen_sprt.hideBlur();
		this.externalCommunicator.sendExternalMessage(LOBBY_MESSAGES.DIALOG_DEACTIVATED, {dialogId: event.dialogId});
	}

	_onKeyboardButtonClicked(event)
	{
		this.externalCommunicator.sendExternalMessage(GAME_MESSAGES.KEYBOARD_BUTTON_CLICKED, {code: event.code});
	}

	_initJSEnvironmentInteractionController()
	{
		this._jsEnvironmentInteractionController = new LobbyJSEnvironmentInteractionController();
	}

	_initRedirectionController()
	{
		this._redirectionController = new RedirectionController();
	}

	clearPauseTimeout()
	{
		clearTimeout(this._fPauseTimeout_int);
		this._fPauseTimeout_int = undefined;
	}

	onBackToGame(event)
	{
		this.clearPauseTimeout();
		this._fPauseTimeout_int = setTimeout(this.pause.bind(this), 100);
		if (event)
		{
			let lParams_obj = {};
			lParams_obj.startGameUrl = event.startGameUrl ? event.startGameUrl : undefined;
			this.externalCommunicator.sendExternalMessage(LOBBY_MESSAGES.BACK_TO_GAME, lParams_obj);
		}
		else
		{
			this.externalCommunicator.sendExternalMessage(LOBBY_MESSAGES.BACK_TO_GAME);
		}
		this.dispatchSoundSettingsMessages();

		this.layout.showGamesScreen(300);
	}

	onPseudoGameUrlReady(event)
	{
		this.pseudoGamewebSocketInteractionController.setParams(event.pseudoGameParams);
	}
	//...LOBBY SCREEN

	//GAME COMMUNICATOR...
	initGameCommunicator()
	{
		if (!this.externalCommunicator)
		{
			this.externalCommunicator = new LobbyExternalCommunicator();
		}

		this.externalCommunicator.subscribeMessagesReceive();

		this.externalCommunicator.on(LobbyExternalCommunicator.GAME_MESSAGE_RECEIVED, this.onGameMessageReceived, this);
	}

	onGameMessageReceived(event)
	{
		let msgType = event.type;

		switch (msgType)
		{
			case GAME_MESSAGES.PLAYER_INFO_UPDATED:
				this.emit(LobbyApp.EVENT_ON_PLAYER_INFO_UPDATED, event.data);
				break;
			case GAME_MESSAGES.CONTEXT_MENU:
				this.emit("gamecontextmenu");
				break;
			case GAME_MESSAGES.ROOM_CLOSED:
				this.emit(LobbyApp.EVENT_ON_LOBBY_REFRESH_BALANCE_REQUIRED);
				this.emit(LobbyApp.EVENT_ON_ROOM_CLOSED);
				this._tryToRestartLobbyIfNeeded();
				break;
		}
	}
	//...GAME COMMUNICATOR

	//GAME LAUNCHER...
	get gameLauncher()
	{
		return this._gameLauncher;
	}

	initGameLauncher()
	{
		this._gameLauncher = new GameLauncher(this._fLobbyContainer_sprt, this.stage.view);
		this._gameLauncher.on(GameLauncher.EVENT_ON_GAME_ADDED, this.onGameLayerAdded.bind(this));
	}

	onGameLayerAdded(event)
	{
		this.externalCommunicator.addTargetWindow(event.gameFrame.contentWindow);
	}
	//...GAME LAUNCHER

	onLobbyScreenVisibilityChanged(data)
	{
		this.lobbyScreen.onScreenVisibleChange(data.visible);
	}

	onSecondaryScreenStateChange(data)
	{
		this.lobbyScreen.onSecondaryScreenStateChange(data.state);
	}

	playerInfoUpdated(event)
	{
		this.externalCommunicator.sendExternalMessage(LOBBY_MESSAGES.PLAYER_INFO_UPDATED, {data: event.data});
	}

	pause()
	{
		let hasActiveDialog = this.dialogsController.info.hasActiveDialog;

		this._fSecondaryContainer_sprt.visible = false;
		this.hideLobbyScreenUI();
		this.forceRendering(); //force rendering application before pause
		let pauseFocusTicker = !hasActiveDialog;
		this.setTickerPaused(pauseFocusTicker , "focus");
	}

	resume()
	{
		this.clearPauseTimeout();

		this.setTickerPaused(false, "focus");
		this.showLobbyScreenUI();
	}

	getTickerPauseExceptions()
	{
		return ["focus"];
	}

	getSoundsPauseExceptions()
	{
		return ["focus"];
	}

	hideLobbyScreenUI()
	{
		this.lobbyScreen.visible = false;
		this.lobbyScreen.hideLobby();
		this.layout.showGamesLayer();

		this.emit(LobbyApp.EVENT_ON_LOBBY_UI_HIDDED);
	}

	showLobbyScreenUI()
	{
		this.lobbyScreen.visible = true;
		this.lobbyScreen.showLobby();
		this.layout.hideGamesLayer();

		this.emit(LobbyApp.EVENT_ON_LOBBY_UI_SHOWN);
	}

	hideLobbyScreen()
	{
		if (this._fSecondaryContainer_sprt.visible)
		{
			this._fSecondaryContainer_sprt.visible = false;
			this.setTickerPaused(true, "focus");
		}
	}

	_onMobilePaytableActivated(event)
	{
		this._hideGamesLayer();
		this.layout.hideAppScreensLayer();
	}

	_onMobilePaytableDeactivated(event)
	{
		this._showGamesLayerSuspicion();
		this.layout.showAppScreensLayer();
	}

	_showGamesLayerSuspicion()
	{
		if (!this.lobbyScreen.visible)
		{
			this.layout.showGamesLayer();
		}
	}

	_hideGamesLayer()
	{
		this.layout.hideGamesLayer();
	}

	onSecondaryScreenActivated(event)
	{
		this.externalCommunicator.sendExternalMessage(LOBBY_MESSAGES.SECONDARY_SCREEN_ACTIVATED);
	}

	onSecondaryScreenDeactivated(event)
	{
		if (!this.lobbyScreen.visible)
		{
			this.onBackToGame();
		}
		this.externalCommunicator.sendExternalMessage(LOBBY_MESSAGES.SECONDARY_SCREEN_DEACTIVATED);
	}

	onLobbyScreenSettingsClicked(event)
	{
		this._fSecondaryContainer_sprt.visible = true;
		this.emit(LobbyApp.EVENT_ON_SETTINGS_BUTTON_CLICKED);
	}

	onLobbyScreenWeaponsIndicatorClicked(event)
	{
		this._fSecondaryContainer_sprt.visible = true;
		this.emit(LobbyApp.EVENT_LOBBY_ROOM_WEAPONS_INDICATOR_CLICK, {stake:event.stake});
	}

	onLobbyScreenInfoClicked(event)
	{
		this._fSecondaryContainer_sprt.visible = true;
		this.emit(LobbyApp.EVENT_ON_INFO_BUTTON_CLICKED);
	}

	onLobbyScreenProfileClicked(event)
	{
		this._fSecondaryContainer_sprt.visible = true;
		this.emit(LobbyApp.EVENT_ON_PROFILE_BUTTON_CLICKED);
	}

	onSoundVolumeChanged(event)
	{
		this.dispatchSoundSettingsMessages();
	}

	_onCommonPanelInfoClicked()
	{
		this._validateScreenState();

		this._fSecondaryContainer_sprt.visible = true;
		this.emit(LobbyApp.EVENT_ON_INFO_BUTTON_CLICKED);
	}

	_onCommonPanelEditProfileClicked()
	{
		this._validateScreenState();

		this._fSecondaryContainer_sprt.visible = true;
		this.emit(LobbyApp.EVENT_ON_PROFILE_BUTTON_CLICKED);
	}

	_onCommonPanelSettingsClicked()
	{
		this._validateScreenState();

		this._fSecondaryContainer_sprt.visible = true;
		this.emit(LobbyApp.EVENT_ON_SETTINGS_BUTTON_CLICKED);
	}

	_onCommonPanelBackToLobbyClicked()
	{
		this.externalCommunicator.sendExternalMessage(LOBBY_MESSAGES.BACK_TO_LOBBY);

		this._fSecondaryContainer_sprt.visible = false;
	}

	_onCommonPanelFireSettingsClicked()
	{
		this.externalCommunicator.sendExternalMessage(LOBBY_MESSAGES.FIRE_SETTINGS_CLICKED);
	}

	_onCommonPanelGroupButtonsChanged(aEvent_obj)
	{
		if (aEvent_obj.visible)
		{
			this.layout.showMobileCommonGroupButtonsLayer();
		}
		else
		{
			this.layout.hideMobileCommonGroupButtonsLayer();
		}
	}

	_onTimeToShowVueLayer(event)
	{
		this.layout.showVueLayer();
	}

	_onTimeToHideVueLayer(event)
	{
		this.layout.hideVueLayer();
	}

	_validateScreenState()
	{
		if (!this.lobbyStateController.info.lobbyScreenVisible)
		{
			this.setTickerPaused(false, "focus");
			this._fSecondaryContainer_sprt.visible = true;
			this.layout.coverGamesScreenByLobby();
		}
	}

	dispatchSoundSettingsMessages()
	{
		let lSoundSettingsInfo_ssi = this._fSoundSettingsController_ssc.i_getInfo();
		let lSoundSettings_obj = {
									"fxVolume": 	lSoundSettingsInfo_ssi.i_getFxSoundsVolume(),
									"musicVolume": 	lSoundSettingsInfo_ssi.i_getBgSoundsVolume(),
									"muted":		lSoundSettingsInfo_ssi.soundsMuted
								};

		this.externalCommunicator.sendExternalMessage(LOBBY_MESSAGES.SOUND_SETTINGS_CHANGED, lSoundSettings_obj);
		this.emit(LobbyApp.EVENT_ON_SOUND_SETTINGS_CHANGED, lSoundSettings_obj);
	}

	dispatchInitialMessages()
	{
		this.externalCommunicator.sendExternalMessage(LOBBY_MESSAGES.PROFILES_VALUES_INITIALIZATION, this.profilingController.info.profiles);

		let lGameSettings_obj = {
			"weaponsSavingAllowed" : this.appParamsInfo.weaponsSavingAllowed
		}
		this.externalCommunicator.sendExternalMessage(LOBBY_MESSAGES.GAME_SETTINGS_INITIALIZATION, lGameSettings_obj);
		this.externalCommunicator.sendExternalMessage(LOBBY_MESSAGES.WEBGL_STATE_INFO, window.isWebGLSupported );

		let lSoundSettingsInfo_ssi = this._fSoundSettingsController_ssc.i_getInfo();
		let lSoundSettings_obj = {
									"fxVolume": 	lSoundSettingsInfo_ssi.i_getFxSoundsVolume(),
									"musicVolume": 	lSoundSettingsInfo_ssi.i_getBgSoundsVolume(),
									"loadingAvailable": lSoundSettingsInfo_ssi.soundsLoadingAvailable,
									"lobbySoundsLoadingOccurred": this.soundsLoadingInitiated
								};
		this.externalCommunicator.sendExternalMessage(LOBBY_MESSAGES.SOUND_SETTINGS_CHANGED, lSoundSettings_obj);
		this.externalCommunicator.sendExternalMessage(LOBBY_MESSAGES.PLAYER_INFO_UPDATED, {data: this._fLobbyPlayerController_lpc.info.playerInfo});
		
		this.externalCommunicator.sendExternalMessage(LOBBY_MESSAGES.TOURNAMENT_STATE_CHANGED, {tournamentState: this.tournamentModeController.info.tournamentState});
	}

	//override
	_initProfilingController()
	{
		return new LobbyProfilingController();
	}

	tick(e)
	{
		let activeLayers = this.layout.activeLayersNames;

		if (this.tickerAllowed && !this.tickerPausedState["focus"])
		{
			super.tick(e);

			if (activeLayers.indexOf(DOM_LAYERS.DIALOGS) >= 0)
			{
				this.dialogsStage.tick(this.delta);
			}
		}

		if (activeLayers.indexOf(DOM_LAYERS.COMMON_PANEL) >= 0)
		{
			for (var i = 0; i < this.commonPanelStages.length; i++)
			{
				this.commonPanelStages[i] && this.commonPanelStages[i].tick(this.delta);
			}
		}

		if (this.fullscreenNoteStage && activeLayers.indexOf(DOM_LAYERS.FULLSCREEN_NOTIFICATION) >= 0)
		{
			this.fullscreenNoteStage.tick(this.delta);
		}
	}
}

export default LobbyApp;