import init from './main.js';

import { default as ExternalAPI } from './external/GameExternalAPI';

//----------------------------------------------------------------------------------------------------------------------
function environmentReady() {
	window.removeEventListener('load', environmentReady);

	// Get configuration from URL parameters or parent template
	let config = {};

	// FIRST: Try window.gameConfig (set by template.jsp before scripts load - works cross-origin)
	if (window.gameConfig && Object.keys(window.gameConfig).length > 0) {
		config = window.gameConfig;
		console.log('[GAME] Retrieved config from window.gameConfig:', config);

		// FIX: Prioritize local dev URL parameters over server config
		// If we are developing locally, the URL params (localhost) are correct, but server config (games.local) is wrong.
		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.get('WEB_SOCKET_URL')) {
			config.websocket = urlParams.get('WEB_SOCKET_URL');
			console.log('[GAME] Override WebSocket from URL for Local Dev:', config.websocket);
		}
		if (urlParams.get('MODE')) {
			config.mode = urlParams.get('MODE');
		}
		if (urlParams.get('mode')) {
			config.mode = urlParams.get('mode');
		}
	}
	// SECOND: Try window.getParams() if available (same origin)
	else if (typeof window.getParams === 'function') {
		try {
			config = window.getParams();
			console.log('[GAME] Retrieved config from getParams():', config);
		} catch (e) {
			console.warn('[GAME] Error calling getParams():', e.message);
		}
	}
	// THIRD: Try parent window (handle cross-origin)
	else if (!config || Object.keys(config).length === 0) {
		try {
			if (window.parent && window.parent !== window) {
				try {
					if (typeof window.parent.getParams === 'function') {
						config = window.parent.getParams();
						console.log('[GAME] Retrieved config from parent.getParams():', config);
					}
				} catch (e) { console.warn('[GAME] Access to parent.getParams blocked:', e.message); }
			}
		} catch (e) {
			console.warn('[GAME] Cannot access parent.getParams() due to cross-origin restriction');
		}
	}

	// LAST RESORT: Parse from URL parameters (fallback for cross-origin)
	if (!config || Object.keys(config).length === 0) {
		console.warn('[GAME] Parsing config from URL parameters...');
		const urlParams = new URLSearchParams(window.location.search);

		// Extract helper functions if available (with cross-origin safety)
		// Extract helper functions if available (with cross-origin safety)
		var getLobbyPath, getGamePath, getCustomerspecDescriptorStoragePathURL;
		try {
			getLobbyPath = window.getLobbyPath;
			if (!getLobbyPath && window.parent && window.parent !== window) {
				try { getLobbyPath = window.parent.getLobbyPath; } catch (e) { }
			}

			getGamePath = window.getGamePath;
			if (!getGamePath && window.parent && window.parent !== window) {
				try { getGamePath = window.parent.getGamePath; } catch (e) { }
			}

			getCustomerspecDescriptorStoragePathURL = window.getCustomerspecDescriptorStoragePathURL;
			if (!getCustomerspecDescriptorStoragePathURL && window.parent && window.parent !== window) {
				try { getCustomerspecDescriptorStoragePathURL = window.parent.getCustomerspecDescriptorStoragePathURL; } catch (e) { }
			}
		} catch (e) {
			console.warn('[GAME] Cannot access parent helper functions due to cross-origin restriction');
		}

		config = {
			// Core parameters from URL
			'bankId': urlParams.get('bankId') || '',
			'sessionId': urlParams.get('SID') || '',
			'gameId': urlParams.get('gameId') || '',
			'lang': urlParams.get('lang') || 'en',
			'mode': urlParams.get('MODE') || urlParams.get('mode') || 'real',
			'websocket': urlParams.get('WEB_SOCKET_URL') || '',
			'serverId': urlParams.get('serverId') || '',

			// Optional flags
			'MQ_TIMER_FREQ': '15',
			'MQ_CLIENT_ERROR_HANDLING': urlParams.get('ERROR_HANDLING') === 'true',
			'DISABLE_MQ_BACKGROUND_LOADING': 'false',
			'DISABLE_MQ_AUTOFIRING': 'false',

			// Paths
			'commonPathForActionGames': window.location.origin + '/html5pc/actiongames/common/',

			// Helper functions
			'getLobbyPath': getLobbyPath,
			'getGamePath': getGamePath,
			'getCustomerspecDescriptorStoragePathURL': getCustomerspecDescriptorStoragePathURL
		};
		console.log('[GAME] Parsed config from URL:', config);
	}

	// FIX: Expose config globally so ContentPathURLsProvider works
	window.gameConfig = config;

	init(ExternalAPI, config);
}

//----------------------------------------------------------------------------------------------------------------------
if (!!window["gameEnvReady"]) {
	environmentReady();
}
else {
	window.addEventListener('load', environmentReady);
}