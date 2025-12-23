import * as createjs from '../../../common/PIXI/src/dgphoenix/unified/lib/soundjs-2017.10.12.corrected';
import UFullScreen from '../../../common/PIXI/src/dgphoenix/unified/view/layout/UFullScreen';
import CustomerspecController from '../../../common/PIXI/src/dgphoenix/unified/controller/preloading/CustomerspecController';

import XMLLoader from '../../../common/PIXI/src/dgphoenix/unified/controller/interaction/resources/loaders/XMLLoader';
import Queue from '../../../common/PIXI/src/dgphoenix/unified/controller/interaction/resources/loaders/Queue';
import ExternalAPI from '../../../common/PIXI/src/dgphoenix/unified/controller/main/ExternalAPI';
import I18 from '../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';

import LobbyAPP from './LobbyAPP';

import PACKAGE from '../package.json';
import VERSION from '../version.json';
import CONFIG from './config/config.json';
import ASSETS from './config/assets.json';
import PAYTABLE_ASSETS from './config/paytable_assets.json';
import PRELOADER_ASSETS from './config/preloader_assets.json';
import {TRANSLATIONS_TYPES, APP_TYPES} from '../../../common/PIXI/src/dgphoenix/unified/controller/interaction/resources/loaders/TranslationsQueue';
import LoaderUI from './view/uis/custom/preloader/GameLoaderUI';
import CommonAssetsController from '../../../common/PIXI/src/dgphoenix/unified/controller/preloading/CommonAssetsController';

//----------------------------------------------------------------------------------------------------------------------
export default function (API = ExternalAPI, apiConfig = {}) {

	let external = new API(apiConfig);

	external.init(function (external) {

		let preloaderQueue = null;
		let loaderUI = null;

		/*window.getPlatformInfo = function (){return {
			name: "Chrome for Android",version: "68.0",minVersion: "41.0",supported: true,
			mobile: true,soundEnabled: true,ua: navigator.userAgent,
			os: {name: "Android",version: "6.0",minVersion: "5.0"}}
		}*/

		var lPlatformInfo_obj = window.getPlatformInfo ? window.getPlatformInfo() : {};
		let lIsMobile_bln = lPlatformInfo_obj.mobile;
		let lIsFullScreenSupported_bl = false;

		if(lIsMobile_bln)
		{
			CONFIG.scales = [1];
			CONFIG.audio.stereo = false;
			CONFIG.margin.bottom = 0;
		}

		let APP = new LobbyAPP(CONFIG, external, PACKAGE, VERSION);

		document.oncontextmenu = function(e) {APP.emit("contextmenu"); return false; }
		document.ondragstart = function() { return false }; // Prevent Internet Explorer’s Default Image Dragging Action

		APP.once('ready', applicationReady);
		APP.init(document.body);

		if (lPlatformInfo_obj.os && lPlatformInfo_obj.os.name == "Mac OS" && lPlatformInfo_obj.name == "Safari")
		{
			window.onoffline = function() {
				APP.handleOffline();
			};
			window.ononline = function() {
				APP.handleOnline();
			};
		}

		function applicationReady()
		{
			APP.customerspecController.once(CustomerspecController.EVENT_CUSTOMERSPEC_LOADED, onCustomerspecLoaded);
			APP.customerspecController.once(CustomerspecController.EVENT_CUSTOMERSPEC_LOAD_ERROR, onCustomerspecLoadError);

			APP.customerspecController.load();
		}

		function onCustomerspecLoaded()
		{
			onCustomerspecDescriptorReady();
		}

		function onCustomerspecLoadError()
		{
			onCustomerspecDescriptorReady();
		}

		function onCustomerspecDescriptorReady()
		{
			I18.init();

			loadScript(APP.applicationFolderURL + 'common_ue.js', APP.version, onCommonUeScriptLoaded.bind(this));
			
			hideFullscreenNote();
		}

		function hideFullscreenNote()
		{
			APP.layout.hideFullscreenNotificationScreen();
			APP.checkAudioContext();
		}

		function showFullscreenNote()
		{
			APP.layout.showFullscreenNotificationScreen();
		}

		function loadPreloaderAssets()
		{
			let loader = new Queue();

			let translationsQueue = I18.createLoaderQueue();
			translationsQueue.addTranslationDescriptor(TRANSLATIONS_TYPES.PRELOADER, APP_TYPES.COMMON);
			translationsQueue.addTranslationDescriptor(TRANSLATIONS_TYPES.PRELOADER, APP_TYPES.LOBBY);

			translationsQueue.once('complete', () => 
				{
					loader.add
					(
						I18.createAssetsLoaderQueue(translationsQueue)
					)
				});

			loader.add
				(
					translationsQueue,
					APP.library.createLoaderQueue(PRELOADER_ASSETS.images),
					APP.library.createLoaderQueue(APP.commonAssetsController.info.preloaderAssets.images, true)
				);

			loader.once('error', onPreloaderAssetsLoadingError);
			loader.once('complete', onPreloaderAssetsLoaded);
			loader.load();

			preloaderQueue = loader;
		}

		function onPreloaderAssetsLoadingError(e)
		{
			APP.handleAssetsLoadingError(e.key, e.message);
		}

		function onPreloaderAssetsLoaded()
		{
			tryToActivateLobbyPreloader();
		}

		function tryToActivateLobbyPreloader()
		{
			if (!preloaderQueue || !preloaderQueue.complete)
			{
				return;
			}

			if (!APP.browserSupportController.info.confirmed)
			{
				APP.once("browserConfirmed", tryToActivateLobbyPreloader);
				return;
			}

			if (lIsMobile_bln)
			{
				let fullscreen = new UFullScreen();
				lIsFullScreenSupported_bl = fullscreen.isFullScreenSupported;

				if (lIsFullScreenSupported_bl)
				{
					fullscreen.on(UFullScreen.EVENT_HIDE_NOTE, hideFullscreenNote.bind(this));
					fullscreen.on(UFullScreen.EVENT_SHOW_NOTE, showFullscreenNote.bind(this));

					fullscreen.tryToEnable(APP.fullscreenNoteStage.view, APP.fullscreenNoteStage.layout);
				}
			}

			APP.showPreloader();
			loadLobbyAssets(lIsFullScreenSupported_bl);
		}

		function loadScript(src, version, onLoadHandler)
		{
			var lScript_e = document.createElement('script');
			lScript_e.type = 'text/javascript';
			lScript_e.src = src + (version ? '?version=' + version : '');
			lScript_e.async = false;
			if (onLoadHandler)
			{
				lScript_e.onload = onLoadHandler;
			}
			document.head.appendChild(lScript_e);
		}

		function onCommonUeScriptLoaded(e)
		{
			//DEBUG...
			// let time = (new Date()).getTime();
			//...DEBUG
			common_ue.startProfiling((aProfiles_obj) => {
				//DEBUG...
				//console.log("time taken for gathering profiles: " + ((new Date()).getTime() - time) + "ms");
				//...DEBUG
				if (APP.isDebugMode)
				{
					APP.logger.i_pushDebug(`Lobby Main. Profiles: ${JSON.stringify(aProfiles_obj)}.`);
					console.log("PROFILES = ", aProfiles_obj);
				}
				APP.i_onProfilesReady(aProfiles_obj);

				APP.commonAssetsController.once(CommonAssetsController.EVENT_ON_READY, onCommonAssetsControllerReady)
				APP.commonAssetsController.prepareForAssetsLoading();
			});
		}

		function onCommonAssetsControllerReady(e)
		{
			loadPreloaderAssets();
		}

		function loadLobbyAssets(aIsFullScreenSupported_bl)
		{
			loaderUI = APP.loaderUI;
			loaderUI.createLayout(aIsFullScreenSupported_bl);
			loaderUI.once('complete', preloadComplete);
			let loader = loaderUI.loader;

			if (lIsMobile_bln && APP.soundSettingsController.info.soundsMuted)
			{
				//don't load sounds for mobile devices before sounds on
				APP.initSoundsBackgroundLoading();
			}
			else
			{
				APP.soundsLoadingInitiated = true;
				let preloaderSoundsQueue = APP.soundsController.createLoaderQueue(PRELOADER_ASSETS.sounds);
				preloaderSoundsQueue.once('error', onPreloaderSoundsAssetsLoadingError);
				preloaderSoundsQueue.once('complete', onPreloaderSoundsAssetsLoaded);

				loader.add
				(
					preloaderSoundsQueue,
					APP.soundsController.createLoaderQueue(ASSETS.sounds)
				)
			}

			let translationsQueue = I18.createLoaderQueue();
			translationsQueue.addTranslationDescriptor(TRANSLATIONS_TYPES.APP, APP_TYPES.COMMON);
			translationsQueue.addTranslationDescriptor(TRANSLATIONS_TYPES.APP, APP_TYPES.LOBBY, false);

			if (!APP.appParamsInfo.backgroundLoadingAllowed)
			{
				translationsQueue.addTranslationDescriptor(TRANSLATIONS_TYPES.PAYTABLE, APP_TYPES.LOBBY, false);
			}

			translationsQueue.once('complete', () => {
				loader.add
				(
					I18.createAssetsLoaderQueue(translationsQueue)
				)
			});

			loader.add
			(
				translationsQueue,
				APP.library.createLoaderQueue(APP.commonAssetsController.info.assets.images, true),
				APP.library.createLoaderQueue(ASSETS.images),
				APP.fonts.createLoaderQueue(ASSETS.fonts)
			);

			if (!APP.appParamsInfo.backgroundLoadingAllowed)
			{
				loader.add
				(
					APP.library.createLoaderQueue(PAYTABLE_ASSETS.images)
				);
			}

			loader.once('error', onLobbyAssetsLoadingError);
			loader.load();
		}

		function onPreloaderSoundsAssetsLoadingError(e)
		{
			loaderUI && loaderUI.loader.stopLoading();
			APP.handleAssetsLoadingError(e.key, e.message);
		}

		function onPreloaderSoundsAssetsLoaded(e)
		{
			APP.playPreloaderSounds();
		}

		function onLobbyAssetsLoadingError(e)
		{
			loaderUI.loader.stopLoading();
			APP.handleAssetsLoadingError(e.key, e.message);
		}

		function preloadComplete(e)
		{
			if (
					APP.browserSupportController.info.isAudioContextSuspended
					&& (!lIsMobile_bln || !lIsFullScreenSupported_bl)// no need to use "tap to start" for mobile devices, because currently we turn sounds on on;y by user interaction for mobile devices
					//(NOTE: we still need "tap to start" inside the game, because sound button won't unlock audion context in the game if game and lobby are in different domains)
				)
			{
				loaderUI.showClickToStart();
				loaderUI.once(LoaderUI.EVENT_ON_CLICK_TO_START_CLICKED, onPreloaderClickToStart);
			}
			else
			{
				APP.run();
			}
		}

		function onPreloaderClickToStart()
		{
			APP.browserSupportController.unlockContext();

			APP.run();
		}

	});

}
