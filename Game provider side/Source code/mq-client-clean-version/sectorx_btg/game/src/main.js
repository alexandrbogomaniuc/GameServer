import * as createjs from '../../../common/PIXI/src/dgphoenix/unified/lib/soundjs-2017.10.12.corrected';
window.PIXI = PIXI;
require('pixi-spine');
require('pixi-heaven');
require('./pixi-particles');
import Queue from '../../../common/PIXI/src/dgphoenix/unified/controller/interaction/resources/loaders/Queue';
import ExternalAPI from '../../../common/PIXI/src/dgphoenix/unified/controller/main/ExternalAPI';
import I18 from '../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';

import Game from './Game';
import SPINE_LIST from './config/SpineList';

import PACKAGE from '../package.json';
import VERSION from '../version.json';
import CONFIG from './config/config.json';
import ASSETS from './config/assets.json';
import PRELOADER_ASSETS from './config/preloader_assets.json';
import { APP_TYPES, TRANSLATIONS_TYPES} from '../../../common/PIXI/src/dgphoenix/unified/controller/interaction/resources/loaders/TranslationsQueue';

import {ImageLoader} from '../../../common/PIXI/src/dgphoenix/unified/controller/interaction/resources/loaders';

import MobileValidator from './MobileValidator';
import GameProfilingController from './controller/profiling/GameProfilingController';
import CommonAssetsController from '../../../common/PIXI/src/dgphoenix/unified/controller/preloading/CommonAssetsController';

//----------------------------------------------------------------------------------------------------------------------
export default function (API = ExternalAPI, apiConfig = {}) {

	let external = new API(apiConfig);

	external.init(function (external) {
		let loaderUI = null;
		let preloaderAssetsLoader = null;
		let tournamentModeInfo = null;

		var mobileValidator = new MobileValidator();
		let isMobile = mobileValidator.mobile() || mobileValidator.tablet();
		let isSoundEnabled = navigator.userAgent.indexOf('MSIE') < 0 && navigator.userAgent.indexOf('Trident') < 0;

		window.getPlatformInfo = window.getPlatformInfo || function() {
				return {
							mobile: isMobile,  //for mobile validation in TextField
							soundEnabled: isSoundEnabled
						}
			};

		/*window.getPlatformInfo = function (){return {
			name: "Chrome for Android",version: "68.0",minVersion: "41.0",supported: true,
			mobile: true,soundEnabled: true,ua: navigator.userAgent,
			os: {name: "Android",version: "6.0",minVersion: "5.0"}}
		}; isMobile = true; mobileValidator.mobile = function() {return true};*/

		if(isMobile)
		{
			CONFIG.scales = [1];
			CONFIG.audio.stereo = false;
			CONFIG.margin.bottom = 0;
		}

		let APP = new Game(CONFIG, external, PACKAGE, VERSION);
		document.oncontextmenu = function(e) { APP.emit("contextmenu"); return false; }
		document.ondragstart = function() { return false }; // Prevent Internet Explorer’s Default Image Dragging Action
		APP.once('ready', onApplicationReady);
		APP.init(document.body);
		APP.mobileValidator = mobileValidator;
		
		var lPlatformInfo_obj = window.getPlatformInfo();
		if (
			lPlatformInfo_obj.os
			&& (lPlatformInfo_obj.os.name == "Mac OS" || lPlatformInfo_obj.os.name == 'iOS')
			&& lPlatformInfo_obj.name == "Safari"
			)
		{
			window.onoffline = function() {
				APP.handleOffline();
			};
			window.ononline = function() {
				APP.handleOnline();
			};
		}

		function onApplicationReady()
		{
			I18.init();

			APP.on("EVENT_ON_BONUS_LOADING_CANCEL", stopLoading);

			tournamentModeInfo = APP.tournamentModeController.info;
			APP.tournamentModeController.on("EVENT_ON_TOURNAMENT_CLIENT_STATE_CHANGED", onTournamentStateChanged);

			APP.commonAssetsController.once(CommonAssetsController.EVENT_ON_READY, onCommonAssetsControllerReady)
			APP.commonAssetsController.prepareForAssetsLoading();
		}

		function onCommonAssetsControllerReady(e)
		{
			if (APP.profilingController.info.isProfilesDefined)
			{
				loadPreloaderAssets();
			}
			else
			{
				APP.profilingController.once(GameProfilingController.EVENT_ON_PROFILES_READY, _onGameProfilesReady);
			}
		}

		function _onGameProfilesReady(e)
		{
			loadPreloaderAssets();
		}

		function loadPreloaderAssets()
		{
			if (tournamentModeInfo.isTournamentOnClientCompletedState)
			{
				return;
			}

			let loader = preloaderAssetsLoader = new Queue();
			let translationsQueue = I18.createLoaderQueue();
			translationsQueue.addTranslationDescriptor(TRANSLATIONS_TYPES.PRELOADER, APP_TYPES.COMMON);
			translationsQueue.addTranslationDescriptor(TRANSLATIONS_TYPES.PRELOADER, APP_TYPES.GAME);
			
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
					APP.library.createLoaderQueue(APP.commonAssetsController.info.roomPreloaderAssets.images, true)
				);

			loader.once('error', onPreloaderAssetsLoadingError);
			loader.once('complete', onPreloaderAssetsLoaded);
			loader.load();
		}

		function onPreloaderAssetsLoadingError(e)
		{
			APP.handleAssetsLoadingError(e.key, e.message);
		}

		function onPreloaderAssetsLoaded()
		{
			APP.showPreloader();
			loadGameAssets();
		}

		function loadGameAssets()
		{
			if (tournamentModeInfo.isTournamentOnClientCompletedState)
			{
				return;
			}

			loaderUI = APP.loaderUI;
			APP.emit("createLoaderUI");
			
			loaderUI.createLayout();
			loaderUI.once('complete', preloadComplete);

			let loader = loaderUI.loader;

			if (!APP.soundsController.info.lobbySoundsLoadingOccurred)
			{
				//don't load sounds for mobile devices before sounds on
				APP.initSoundsBackgroundLoading();
			}
			else
			{
				loader.add(APP.soundsController.createLoaderQueue(ASSETS.sounds));
			}

			let translationsQueue = I18.createLoaderQueue
			(
				{
					type: TRANSLATIONS_TYPES.APP
				}
			);

			translationsQueue.once('complete', () => {
				loader.add
				(
					I18.createAssetsLoaderQueue(translationsQueue)
				)
			});

			loader.add
			(
				translationsQueue,
				APP.library.createLoaderQueue(ASSETS.images),
				APP.spineLibrary.createLoaderQueue(SPINE_LIST),
				APP.fonts.createLoaderQueue(ASSETS.fonts)
			);

			loader.once('error', onGameAssetsLoadingError);
			loader.load();
		}

		function onGameAssetsLoadingError(e)
		{
			loaderUI && loaderUI.loader.stopLoading();
			APP.handleAssetsLoadingError(e.key, e.message);
		}

		function preloadComplete(e)
		{
			APP.onPreloadComplete();
		}

		function stopLoading()
		{
			preloaderAssetsLoader && preloaderAssetsLoader.stopLoading();
			loaderUI && loaderUI.loader && loaderUI.loader.stopLoading();
		}

		function onTournamentStateChanged(e)
		{
			if (tournamentModeInfo.isTournamentOnClientCompletedState)
			{
				preloaderAssetsLoader && preloaderAssetsLoader.stopLoading();
				loaderUI && loaderUI.loader && loaderUI.loader.stopLoading();
			}
		}
	});

}
