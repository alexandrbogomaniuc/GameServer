import WebSocketInteractionController from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/interaction/server/WebSocketInteractionController';
import { GameWebSocketInteractionInfo, SERVER_MESSAGES, CLIENT_MESSAGES } from '../../../model/interaction/server/GameWebSocketInteractionInfo';
import { DEBUG_WEB_SOCKET_URL } from '../../../config/Constants';
import { WEAPONS } from '../../../../../shared/src/CommonConstants';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import GameScreen from '../../../main/GameScreen'
import Game from '../../../Game'
import I18 from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
import GameExternalCommunicator from '../../../controller/external/GameExternalCommunicator';
import { LOBBY_MESSAGES, GAME_MESSAGES } from '../../../controller/external/GameExternalCommunicator';
import GameStateController from '../../state/GameStateController';
import { ROUND_STATE } from '../../../model/state/GameStateInfo';
import TournamentModeController from '../../custom/tournament/TournamentModeController';
import { ERROR_CODE_TYPES } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/interaction/server/WebSocketInteractionInfo';
import GamePendingOperationController from '../../gameplay/GamePendingOperationController';
import InfoPanelController from '../../uis/info_panel/InfoPanelController';


class GameWebSocketInteractionController extends WebSocketInteractionController
{
	static get EVENT_ON_SERVER_MESSAGE() { return WebSocketInteractionController.EVENT_ON_SERVER_MESSAGE };
	static get EVENT_ON_SERVER_CONNECTION_CLOSED() { return WebSocketInteractionController.EVENT_ON_SERVER_CONNECTION_CLOSED };
	static get EVENT_ON_SERVER_CONNECTION_OPENED() { return WebSocketInteractionController.EVENT_ON_SERVER_CONNECTION_OPENED };
	static get EVENT_ON_SERVER_ERROR_MESSAGE() { return WebSocketInteractionController.EVENT_ON_SERVER_ERROR_MESSAGE };
	static get EVENT_ON_SERVER_OK_MESSAGE() { return WebSocketInteractionController.EVENT_ON_SERVER_OK_MESSAGE };

	static get EVENT_ON_SERVER_GET_ROOM_INFO_RESPONSE_MESSAGE() { return "EVENT_ON_SERVER_GET_ROOM_INFO_RESPONSE_MESSAGE" };
	static get EVENT_ON_SERVER_FULL_GAME_INFO_MESSAGE() { return "EVENT_ON_SERVER_FULL_GAME_INFO_MESSAGE" };
	static get EVENT_ON_SERVER_SIT_IN_RESPONSE_MESSAGE() { return "EVENT_ON_SERVER_SIT_IN_RESPONSE_MESSAGE" };
	static get EVENT_ON_SERVER_SIT_OUT_RESPONSE_MESSAGE() { return "EVENT_ON_SERVER_SIT_OUT_RESPONSE_MESSAGE" };
	static get EVENT_ON_SERVER_NEW_ENEMY_MESSAGE() { return "EVENT_ON_SERVER_NEW_ENEMY_MESSAGE" };
	static get EVENT_ON_SERVER_NEW_ENEMIES_MESSAGE() { return "EVENT_ON_SERVER_NEW_ENEMIES_MESSAGE" };
	static get EVENT_ON_SERVER_MISS_MESSAGE() { return "EVENT_ON_SERVER_MISS_MESSAGE" };
	static get EVENT_ON_SERVER_HIT_MESSAGE() { return "EVENT_ON_SERVER_HIT_MESSAGE" };
	static get EVENT_ON_SERVER_LEVEL_UP_MESSAGE() { return "EVENT_ON_SERVER_LEVEL_UP_MESSAGE" };
	static get EVENT_ON_SERVER_CLIENTS_INFO_MESSAGE() { return "EVENT_ON_SERVER_CLIENTS_INFO_MESSAGE" };
	static get EVENT_ON_SERVER_ROUND_RESULT_MESSAGE() { return "EVENT_ON_SERVER_ROUND_RESULT_MESSAGE" };
	static get EVENT_ON_SERVER_GAME_STATE_CHANGED_MESSAGE() { return "EVENT_ON_SERVER_GAME_STATE_CHANGED_MESSAGE" };
	static get EVENT_ON_SERVER_BUY_IN_RESPONSE_MESSAGE() { return "EVENT_ON_SERVER_BUY_IN_RESPONSE_MESSAGE" };
	static get EVENT_ON_SERVER_RE_BUY_RESPONSE_MESSAGE() { return "EVENT_ON_SERVER_RE_BUY_RESPONSE_MESSAGE" };
	static get EVENT_ON_SERVER_ENEMY_DESTROYED_MESSAGE() { return "EVENT_ON_SERVER_ENEMY_DESTROYED_MESSAGE" };
	static get EVENT_ON_SERVER_CHANGE_MAP_MESSAGE() { return "EVENT_ON_SERVER_CHANGE_MAP_MESSAGE" };
	static get EVENT_ON_SERVER_WEAPONS_MESSAGE() { return "EVENT_ON_SERVER_WEAPONS_MESSAGE" };
	static get EVENT_ON_SERVER_WEAPON_SWITCHED_MESSAGE() { return "EVENT_ON_SERVER_WEAPON_SWITCHED_MESSAGE" };
	static get EVENT_ON_SERVER_BALANCE_UPDATED_MESSAGE() { return "EVENT_ON_SERVER_BALANCE_UPDATED_MESSAGE" };
	static get EVENT_ON_SERVER_UPDATE_TRAJECTORIES_MESSAGE() { return "EVENT_ON_SERVER_UPDATE_TRAJECTORIES_MESSAGE" };
	static get EVENT_ON_SERVER_ROUND_FINISH_SOON() { return "EVENT_ON_SERVER_ROUND_FINISH_SOON" };
	static get EVENT_ON_CONNECTION_RECOVERY_STARTED() { return "EVENT_ON_CONNECTION_RECOVERY_STARTED" };
	static get EVENT_ON_SERVER_BET_LEVEL_CHANGED() { return "EVENT_ON_SERVER_BET_LEVEL_CHANGED" };
	static get EVENT_ON_SERVER_BONUS_STATUS_CHANGED_MESSAGE() { return "EVENT_ON_SERVER_BONUS_STATUS_CHANGED_MESSAGE" };
	static get EVENT_ON_SERVER_FRB_ENDED_MESSAGE() { return "EVENT_ON_SERVER_FRB_ENDED_MESSAGE" };
	static get EVENT_ON_SERVER_TOURNAMENT_STATE_CHANGED() { return "EVENT_ON_SERVER_TOURNAMENT_STATE_CHANGED" };
	static get EVENT_ON_SERVER_BULLET_RESPONSE() { return "EVENT_ON_SERVER_BULLET_RESPONSE" };
	static get EVENT_ON_SERVER_BULLET_CLEAR_RESPONSE() { return "EVENT_ON_SERVER_BULLET_CLEAR_RESPONSE" };
	static get EVENT_ON_SERVER_CANCEL_BATTLEGROUND_ROUND() { return "EVENT_ON_SERVER_CANCEL_BATTLEGROUND_ROUND" };
	static get EVENT_BATTLEGROUND_SCORE_BOARD() { return "EVENT_BATTLEGROUND_SCORE_BOARD" };
	static get EVENT_ON_DELAYED_SHOT_REMOVED() { return "EVENT_ON_DELAYED_SHOT_REMOVED" };

	static get EVENT_ON_REQUEST_WEAPON_UPDATE_SENDED() { return "EVENT_ON_REQUEST_WEAPON_UPDATE_SENDED" };

	static get EVENT_ON_QUEST_WIN_PAYOUT() 							{ return "EVENT_ON_QUEST_WIN_PAYOUT"; }

	static get EVENT_ON_CONNECTION_READY_TO_ROOM_OPEN()			 	{ return "EVENT_ON_CONNECTION_READY_TO_ROOM_OPEN" };
	static get EVENT_ON_RESTORE_AFTER_OFFLINE_FINISHED()			{return "EVENT_ON_RESTORE_AFTER_OFFLINE_FINISHED";}
	static get EVENT_ON_SERVER_LATENCY_REQUEST() 					{ return "EVENT_ON_SERVER_LATENCY_REQUEST" };


	constructor()
	{
		super(new GameWebSocketInteractionInfo());

		this._gameScreen = null;
		this._reconnectingAfterGameUrlUpdatedRequired = false;
		this._fLobbyConnectionState_bln = true;
		this._fLastWeapon_int = null;
		this._hitDataUniqId = 0;
		this._fTournamentModeInfo_tmi = null;
		this._requests_shot_list = [];

		this._fOpenRoomSent_bln = false;

		this._fRestoreAfterOffline_bl = false;
		this._oldWebSocket = null;
	}

	isStubsModeAvailable()
	{
		return APP.isDebugMode;
	}

	get _currentStubsTime()
	{
		return APP.gameScreen.currentTime;
	}

	get lastUniqRequestId()
	{
		return this._requestUniqId;
	}

	get _debugWebSocketUrl()
	{
		return this._webSocketUrl;
		return DEBUG_WEB_SOCKET_URL;
	}

	get _webSocketUrl()
	{
		return APP.urlBasedParams.WEB_SOCKET_URL;
	}

	get hasUnrespondedShots()
	{
		return this._hasUnRespondedRequest(CLIENT_MESSAGES.SHOT);
	}

	get hasDelayedShots()
	{
		return super._hasDelayedRequests(CLIENT_MESSAGES.SHOT);
	}

	get delayedRicochetShotsAmount()
	{
		let lHasDelayedShots_bl = this.hasDelayedShots;

		if (!lHasDelayedShots_bl)
		{
			return 0;
		}

		let lDelayedShotRequests = this._delayedShotRequests;
		if (!lDelayedShotRequests || !lDelayedShotRequests.length)
		{
			return 0;
		}

		let lAmount = 0;
		for (let i = 0; i < lDelayedShotRequests.length; i++)
		{
			let lCurDelayedShotRequest = lDelayedShotRequests[i];

			if (lCurDelayedShotRequest.data.bulletId !== undefined)
			{
				lAmount += 1;
			}
		}

		return lAmount;
	}

	get delayedNonRicochetShotsAmount()
	{
		let lHasDelayedShots_bl = this.hasDelayedShots;

		if (!lHasDelayedShots_bl)
		{
			return 0;
		}

		let lDelayedShotRequests = this._delayedShotRequests;
		if (!lDelayedShotRequests || !lDelayedShotRequests.length)
		{
			return 0;
		}

		let lAmount = 0;
		for (let i = 0; i < lDelayedShotRequests.length; i++)
		{
			let lCurDelayedShotRequest = lDelayedShotRequests[i];

			if (lCurDelayedShotRequest.data.bulletId === undefined)
			{
				lAmount += 1;
			}
		}

		return lAmount;
	}

	get _delayedShotRequests()
	{
		if (!this._delayedRequests)
		{
			return null;
		}

		let lRequests = [];

		for (let i = 0; i < this._delayedRequests.length; i++)
		{
			let curDelayedRequestInfo = this._delayedRequests[i];
			if (curDelayedRequestInfo.class == CLIENT_MESSAGES.SHOT)
			{
				lRequests.push(curDelayedRequestInfo);
			}
		}

		return lRequests;
	}

	get isSitoutRequestInProgress()
	{
		return this._hasUnRespondedRequest(CLIENT_MESSAGES.SIT_OUT) || this._hasDelayedRequests(CLIENT_MESSAGES.SIT_OUT);
	}

	get isCloseRoomRequestInProgress()
	{
		return this._hasUnRespondedRequest(CLIENT_MESSAGES.CLOSE_ROOM);
	}

	get isRebuyRequestInProgress()
	{
		return this._hasUnRespondedRequest(CLIENT_MESSAGES.RE_BUY);
	}

	get isBuyInRequestInProgress()
	{
		return this._hasUnRespondedRequest(CLIENT_MESSAGES.BUY_IN);
	}

	get isShotRequestParseInProgress()
	{
		for (let id in this._requests_shot_list)
		{
			if (this._requests_shot_list[id])
			{
				return true;
			}
		}

		return false;
	}

	clearShotResponseParsed()
	{
		this._requests_shot_list = [];
	}

	__initControlLevel()
	{
		let tournamentModeController = APP.tournamentModeController;
		this._fTournamentModeInfo_tmi = tournamentModeController.info;
		tournamentModeController.on(TournamentModeController.EVENT_ON_TOURNAMENT_CLIENT_STATE_CHANGED, this._onTournamentModeClientStateChanged, this);

		super.__initControlLevel();

		let gameScreen = this._gameScreen = APP.gameScreen;
		gameScreen.on(GameScreen.EVENT_ON_GAME_SOCKET_URL_UPDATED, this._onGameSocketUrlUpdated, this);
		gameScreen.on(GameScreen.EVENT_ON_FULL_GAME_INFO_REQUIRED, this._onFullGameInfoRequired, this);
		gameScreen.on(GameScreen.EVENT_ON_CLOSE_ROOM_REQUIRED, this._onCloseRoomRequired, this);
		gameScreen.on(GameScreen.EVENT_BATTLEGROUND_CONFIRM_BUY_IN_REQUIRED, this._onBattlegroundConfirmBuyInRequired, this);
		gameScreen.on(GameScreen.EVENT_ON_SIT_IN_REQUIRED, this._onSitInRequired, this);
		gameScreen.on(GameScreen.EVENT_ON_SIT_OUT_REQUIRED, this._onSitOutRequired, this);
		gameScreen.on(GameScreen.EVENT_ON_SHOT_TRIGGERED, this._onShotTriggered, this);
		gameScreen.on(GameScreen.EVENT_ON_BUY_IN_REQUIRED, this._onBuyInRequired, this);
		gameScreen.on(GameScreen.EVENT_ON_RE_BUY_REQUIRED, this._onReBuyRequired, this);
		gameScreen.on(GameScreen.EVENT_ON_CHANGE_STAKE_REQUIRED, this._onChangeStakeRequired, this);
		gameScreen.on(GameScreen.EVENT_ON_WEAPON_UPDATED, this._onWeaponUpdated, this);
		gameScreen.on(GameScreen.EVENT_ON_ROUND_RESULT_SCREEN_DEACTIVATED, this._onRoundResultScreenClosed, this);
		gameScreen.on(GameScreen.EVENT_ON_ROUND_RESULT_SCREEN_ACTIVATED, this._onRoundResultScreenOpened, this);
		gameScreen.on(GameScreen.EVENT_ON_BACK_TO_LOBBY_BUTTON_CLICKED, this._onGameBackToLobbyInitiated, this);
		gameScreen.on(GameScreen.EVENT_ON_BET_MULTIPLIER_UPDATE_REQUIRED, this._onBetLevelChangeRequired, this);
		gameScreen.on(GameScreen.EVENT_ON_BULLET, this._onBullet, this);
		gameScreen.on(GameScreen.EVENT_ON_BULLET_CLEAR, this._onBulletClear, this);
		gameScreen.on(GameScreen.EVENT_BATTLEGROUND_REQUEST_TIME_TO_START, this._onBattlegroundTimeTostartRequest, this);
		gameScreen.on(GameScreen.EVENT_ON_WEAPON_PAID_MULTIPLIER_UPDATE_REQUIRED, this._onWeaponPaidMultiplierUpdateRequired, this);
		gameScreen.on(GameScreen.EVENT_ON_SHOT_RESPONSE_PARSED, this._onShotResponseParsed, this);
		gameScreen.on(GameScreen.EVENT_ON_NO_EMPTY_SEATS, this._onNoPlaceToSeatHandler, this);
		gameScreen.infoPanelController.on(InfoPanelController.LATENCY_REQUEST, this._onLatencyRequested, this);


		if (gameScreen.isReady)
		{
			gameScreen.gameStateController.on(GameStateController.EVENT_ON_GAME_STATE_CHANGED, this._onGameStateChanged, this);
			gameScreen.on(GameScreen.EVENT_ON_TIME_TO_OPEN_REAL_ROOM_AFTER_BONUS, this._onTimeToOpenRealRoomAfterBonus, this);
		}
		else
		{
			gameScreen.once(GameScreen.EVENT_ON_READY, () =>
			{
				gameScreen.gameStateController.on(GameStateController.EVENT_ON_GAME_STATE_CHANGED, this._onGameStateChanged, this);
				gameScreen.on(GameScreen.EVENT_ON_TIME_TO_OPEN_REAL_ROOM_AFTER_BONUS, this._onTimeToOpenRealRoomAfterBonus, this);
			}, this);
		}


		let externalCommunicator = APP.externalCommunicator;
		externalCommunicator.on(GameExternalCommunicator.LOBBY_MESSAGE_RECEIVED, this._onLobbyMessageReceived, this);

		APP.on(Game.EVENT_ON_ASSETS_LOADING_ERROR, this._onAssetsLoadingError, this);
		APP.on(Game.EVENT_ON_WEBGL_CONTEXT_LOST, this._onWebglContextLost, this);
		APP.on(Game.EVENT_ON_BONUS_CANCEL_ROOM_RELOAD, this._onBonusCancelRoomReaload, this);
		APP.on(Game.EVENT_ON_OFFLINE, this._onOffline, this)
		APP.on(Game.EVENT_ON_ONLINE_RESTORED, this._onOnlineRestored, this);

		APP.on('onTickerResumed', (e) => this._onTickerResumed(e));

		let l_poc = this._fPendingOperationController_poc = APP.pendingOperationController;
		l_poc.on(GamePendingOperationController.EVENT_ON_PENDING_OPERATION_STARTTED, this._onPendingOperationStarted, this);
		l_poc.on(GamePendingOperationController.EVENT_ON_REFRESH_PENDING_OPERATION_STATUS_REQUIRED, this._onRefreshPendingOperationStatusRequired, this);
		l_poc.on(GamePendingOperationController.EVENT_ON_PENDING_OPERATION_STATUS_TRACKING_TURNED_OFF, this._onPendingOperationStatusTrackingTurnedOff, this);		

		// DEBUG...
		/*window.addEventListener(
			"keydown", this.keyDownHandler.bind(this), false
		);*/
		// ...DEBUG
	}

	_onLatencyRequested(event){
		
		const requestBody = {
			serverTs: event.serverTs,
			serverAckTs: event.serverAckTs,
			clientTs: event.clientTs,
			clientAckTs: event.clientAckTs,
			step: event.step
		}
		this._sendRequest(CLIENT_MESSAGES.SEND_LATENCY, requestBody);
	}

	_onShotResponseParsed(aRequestData)
	{
		if (aRequestData.class == CLIENT_MESSAGES.SHOT && aRequestData.rid >= 0)
		{
			let requestData = this._requests_shot_list[aRequestData.rid];
			if (requestData)
			{
				delete this._requests_shot_list[aRequestData.rid];
			}
		}
	}

	//DEBUG...
	/*keyDownHandler(keyCode)
	{
		if (keyCode.keyCode == 97)
		{
			let msg = {
				"newEnemy": {
					"test": true,
					"id": 12958,
					"typeId": 20,
					"speed": 6.832650184631348,
					"awardedPrizes": "",
					"awardedSum": 0.0,
					"energy": 1.0,
					"fullEnergy": 1.0,
					"skin": 1,
					"trajectory": {
						"speed": 6.832650184631348,
						"points": [],
						"maxSize": 300
					},
					"parentEnemyId": -1,
					"members": [],
					"swarmId": 0,
					"swarmType": 0
				},
				"date": 1648617539422,
				"rid": 9,
				"class": "NewEnemy"
			}

			for (let i = 0; i < Math.floor(Math.random() * 10) + 1; i++)
			{
				msg.newEnemy.trajectory.points.push({
					"x": Math.floor(Math.random() * 960),
					"y": Math.floor(Math.random() * 540),
					"time": i * 1000
				});
			}

			let startTime = msg.newEnemy.trajectory.points[0].time;
			let currentTime = (new Date()).getTime();

			for (let point of msg.newEnemy.trajectory.points)
			{
				point.time = currentTime + point.time - startTime;
			}
			msg.date = currentTime;

			this._processServerMessage(msg);
		}	
	}*/
	//...DEBUG

	_handleServerMessage(messageData, requestData)
	{
		super._handleServerMessage(messageData, requestData);

		let msgClass = messageData.class;
		switch (msgClass)
		{
			case SERVER_MESSAGES.OK:
				let requestClass = undefined;
				if (requestData && requestData.rid >= 0)
				{
					requestClass = requestData.class;
					if (requestClass === CLIENT_MESSAGES.CLOSE_ROOM)
					{
						this.onRoomClosed();
					}
				}
				break;
		}
	}

	_specifyErrorCodeSeverity(messageData, requestData)
	{
		let errorCode = messageData.code;
		let errorCodeSeverity;

		if (
				errorCode == WebSocketInteractionController.ERROR_CODES.BAD_REQUEST
				&& (!!requestData && requestData.class === CLIENT_MESSAGES.SHOT && requestData.bulletId !== undefined)
			)
		{
			// BAD_REQUEST for ricochet shots is not considered as fatal error due to https://jira.dgphoenix.com/browse/DRAG-986
			errorCodeSeverity = ERROR_CODE_TYPES.ERROR;
		}
		else if (
					errorCode == WebSocketInteractionController.ERROR_CODES.FOUND_PENDING_OPERATION
					&& this._fPendingOperationController_poc.info.isPendingOperationHandlingSupported
				)
		{
			errorCodeSeverity = ERROR_CODE_TYPES.ERROR;
		}
		else
		{
			errorCodeSeverity = super._specifyErrorCodeSeverity(messageData, requestData);
		}

		return errorCodeSeverity;
	}

	_onBonusCancelRoomReaload()
	{
		this._fIsReopenSocketRequired_bl = false;
	}

	_onOffline()
	{
		if (!APP.isBattlegroundGame && !this._oldWebSocket)
		{
			this._clearRequestList();
			this._clearSocketHandlers();
			this._clearDelayedRequests();
			this._oldWebSocket = this._webSocket;
			this._oldWebSocket.onclose = function ()
			{
				this._oldWebSocket = null;
			}
			this._webSocket = null;
		}
		else
		{
			this._closeConnectionIfPossible();
		}
		this.emit(WebSocketInteractionController.EVENT_ON_SERVER_CONNECTION_CLOSED, {wasClean: false});
	}

	_onOnlineRestored()
	{
		this._fRestoreAfterOffline_bl = true;
		this._startRecoveringSocketConnection();
	}

	onRoomClosed()
	{
		this._closeConnectionIfPossible();
		this._oldWebSocket && this._oldWebSocket.close();
		if (APP.currentWindow.gameBonusController.info.isRoomRestartRequired)
		{
			//wait for EnterLobby completion, then - establish new connection
			this._fIsReopenSocketRequired_bl = true;
		}
		this._fOpenRoomSent_bln = false;
	}

	_processServerMessage(messageData)
	{
		let msgClass = messageData.class;

		switch (msgClass)
		{
			case SERVER_MESSAGES.HIT:
				messageData.id = this._hitDataUniqId++;
				break;
			case SERVER_MESSAGES.GET_ROOM_INFO_RESPONSE:
				if (this._fRestoreAfterOffline_bl)
				{
					this._fRestoreAfterOffline_bl = false;
					this.emit(GameWebSocketInteractionController.EVENT_ON_RESTORE_AFTER_OFFLINE_FINISHED);
				}
				break;
		}


		messageData = this.info.validator.validateUnusedFields(messageData);

		super._processServerMessage(messageData);
	}

	__performActionWithRequestOnGameLevel(aRequestData)
	{
		if (aRequestData.class == CLIENT_MESSAGES.SHOT)
		{
			this._requests_shot_list[aRequestData.rid] = aRequestData;
		}
	}

	_sendRequest(requestClass, requestData)
	{
		if (this._fTournamentModeInfo_tmi.isTournamentOnServerCompletedState)
		{
			return;
		}

		if (
				!this._fOpenRoomSent_bln
				&& requestClass !== CLIENT_MESSAGES.OPEN_ROOM
				&& requestClass !== CLIENT_MESSAGES.CHECK_PENDING_OPERATION_STATUS
			)
		{
			if (requestClass === CLIENT_MESSAGES.SIT_IN)
			{
				APP.gameScreen.clearPendingRequestSitin();
			}

			return;
		}

		super._sendRequest(requestClass, requestData);
	}

	_onConnectionOpened()
	{
		console.log("Game -> _onConnectionOpened");
		this._fPendingOperationController_poc.off(GamePendingOperationController.EVENT_ON_PENDING_OPERATION_COMPLETED, this._onPendingOperationCompletedForOpenRoom, this, true);

		if (this._fTournamentModeInfo_tmi.isTournamentOnClientCompletedState)
		{
			this._stopReconnecting();
			this._blockAfterCriticalError();
			this._stopServerMesagesHandling();
			this._closeConnectionIfPossible();
		}

		super._onConnectionOpened();

		let gameScreen = this._gameScreen;

		if (gameScreen.isReady)
		{
			this._trySendOpenRoomRequest();
		}
		else
		{
			gameScreen.on(GameScreen.EVENT_ON_READY, this._onGameScreenReady, this);
		}
	}

	_onConnectionClosed(event)
	{
		this._fOpenRoomSent_bln = false;
		this._fPendingOperationController_poc.off(GamePendingOperationController.EVENT_ON_PENDING_OPERATION_COMPLETED, this._onPendingOperationCompletedForOpenRoom, this, true);

		console.log("Game -> _onConnectionClosed");
		super._onConnectionClosed(event);
	}

	_activateReconnectTimeout()
	{
		console.log("Game -> _activateReconnectTimeout");
		super._activateReconnectTimeout();
	}

	get recoveringConnectionInProgress()
	{
		return this._reconnectingAfterGameUrlUpdatedRequired
			|| super.recoveringConnectionInProgress;
	}

	_startRecoveringSocketConnection()
	{
		if (this._fTournamentModeInfo_tmi.isTournamentOnServerCompletedState)
		{
			return;
		}

		if (APP.currentWindow && APP.currentWindow.gameFrbController && APP.currentWindow.gameFrbController.info.isFrbEndedAndConnectionLost)
		{
			// Do not request new start game url
			this._startReconnectingOnConnectionLost();
			return;
		}

		// reconnect to new start game url, requested when server connection lost
		this._reconnectingAfterGameUrlUpdatedRequired = true;

		let lRoomId_num = window.GET ? window.GET.roomId : -1;
		this.emit(GameWebSocketInteractionController.EVENT_ON_CONNECTION_RECOVERY_STARTED, { roomId: lRoomId_num });
	}

	_startReconnectingOnConnectionLost()
	{
		if (this._fTournamentModeInfo_tmi.isTournamentOnServerCompletedState)
		{
			return;
		}

		super._startReconnectingOnConnectionLost();
	}

	_establishConnection()
	{
		this._fIsReopenSocketRequired_bl = false;

		if (this._fTournamentModeInfo_tmi.isTournamentOnServerCompletedState)
		{
			this._closeConnectionIfPossible();
			return;
		}

		super._establishConnection();

	}

	_stopRecoveringSocketConnectionIfRequired()
	{
		if (this._reconnectingAfterGameUrlUpdatedRequired)
		{
			this._stopRecoveringSocketConnection();
		}
	}

	_stopRecoveringSocketConnection()
	{
		this._reconnectingAfterGameUrlUpdatedRequired = false;

		this._stopReconnecting();
	}

	_onGameScreenReady(event)
	{
		this._trySendOpenRoomRequest();
	}

	_onTimeToOpenRealRoomAfterBonus()
	{
		this._trySendOpenRoomRequest();
	}

	_specifyEventMessageType(messageData)
	{
		let eventType;
		switch (messageData.class)
		{
			case SERVER_MESSAGES.CANCEL_BATTLEGROUND_ROUND:
				eventType = GameWebSocketInteractionController.EVENT_ON_SERVER_CANCEL_BATTLEGROUND_ROUND;
				break;
			case SERVER_MESSAGES.GET_ROOM_INFO_RESPONSE:
				eventType = GameWebSocketInteractionController.EVENT_ON_SERVER_GET_ROOM_INFO_RESPONSE_MESSAGE;
				break;
			case SERVER_MESSAGES.FULL_GAME_INFO:
				eventType = GameWebSocketInteractionController.EVENT_ON_SERVER_FULL_GAME_INFO_MESSAGE;
				break;
			case SERVER_MESSAGES.SIT_IN_RESPONSE:
				eventType = GameWebSocketInteractionController.EVENT_ON_SERVER_SIT_IN_RESPONSE_MESSAGE;
				break;
			case SERVER_MESSAGES.SIT_OUT_RESPONSE:
				eventType = GameWebSocketInteractionController.EVENT_ON_SERVER_SIT_OUT_RESPONSE_MESSAGE;
				break;
			case SERVER_MESSAGES.NEW_ENEMY:
				eventType = GameWebSocketInteractionController.EVENT_ON_SERVER_NEW_ENEMY_MESSAGE;
				break;
			case SERVER_MESSAGES.NEW_ENEMIES:
				eventType = GameWebSocketInteractionController.EVENT_ON_SERVER_NEW_ENEMIES_MESSAGE;
				break;
			case SERVER_MESSAGES.MISS:
				eventType = GameWebSocketInteractionController.EVENT_ON_SERVER_MISS_MESSAGE;
				break;
			case SERVER_MESSAGES.HIT:
				eventType = GameWebSocketInteractionController.EVENT_ON_SERVER_HIT_MESSAGE;
				break;
			case SERVER_MESSAGES.CLIENTS_INFO:
				eventType = GameWebSocketInteractionController.EVENT_ON_SERVER_CLIENTS_INFO_MESSAGE;
				break;
			case SERVER_MESSAGES.ROUND_RESULT:
				eventType = GameWebSocketInteractionController.EVENT_ON_SERVER_ROUND_RESULT_MESSAGE;
				break;
			case SERVER_MESSAGES.GAME_STATE_CHANGED:
				eventType = GameWebSocketInteractionController.EVENT_ON_SERVER_GAME_STATE_CHANGED_MESSAGE;
				break;
			case SERVER_MESSAGES.BUY_IN_RESPONSE:
				eventType = GameWebSocketInteractionController.EVENT_ON_SERVER_BUY_IN_RESPONSE_MESSAGE;
				break;
			case SERVER_MESSAGES.RE_BUY_RESPONSE:
				eventType = GameWebSocketInteractionController.EVENT_ON_SERVER_RE_BUY_RESPONSE_MESSAGE;
				break;
			case SERVER_MESSAGES.ENEMY_DESTROYED:
				eventType = GameWebSocketInteractionController.EVENT_ON_SERVER_ENEMY_DESTROYED_MESSAGE;
				break;
			case SERVER_MESSAGES.CHANGE_MAP:
				eventType = GameWebSocketInteractionController.EVENT_ON_SERVER_CHANGE_MAP_MESSAGE;
				break;
			case SERVER_MESSAGES.WEAPONS:
				eventType = GameWebSocketInteractionController.EVENT_ON_SERVER_WEAPONS_MESSAGE;
				break;
			case SERVER_MESSAGES.WEAPON_SWITCHED:
				eventType = GameWebSocketInteractionController.EVENT_ON_SERVER_WEAPON_SWITCHED_MESSAGE;
				break;
			case SERVER_MESSAGES.BALANCE_UPDATED:
				eventType = GameWebSocketInteractionController.EVENT_ON_SERVER_BALANCE_UPDATED_MESSAGE;
				break;
			case SERVER_MESSAGES.UPDATE_TRAJECTORIES:
				eventType = GameWebSocketInteractionController.EVENT_ON_SERVER_UPDATE_TRAJECTORIES_MESSAGE;
				break;
			case SERVER_MESSAGES.ROUND_FINISH_SOON:
				eventType = GameWebSocketInteractionController.EVENT_ON_SERVER_ROUND_FINISH_SOON;
				break;
			case SERVER_MESSAGES.BET_LEVEL_RESPONSE:
				eventType = GameWebSocketInteractionController.EVENT_ON_SERVER_BET_LEVEL_CHANGED;
				break;
			case SERVER_MESSAGES.BONUS_STATUS_CHANGED:
				eventType = GameWebSocketInteractionController.EVENT_ON_SERVER_BONUS_STATUS_CHANGED_MESSAGE;
				break;
			case SERVER_MESSAGES.FRB_ENDED:
				eventType = GameWebSocketInteractionController.EVENT_ON_SERVER_FRB_ENDED_MESSAGE;
				break;
			case SERVER_MESSAGES.TOURNAMENT_STATE_CHANGED:
				eventType = GameWebSocketInteractionController.EVENT_ON_SERVER_TOURNAMENT_STATE_CHANGED;
				break;
			case SERVER_MESSAGES.BULLET_RESPONSE:
				eventType = GameWebSocketInteractionController.EVENT_ON_SERVER_BULLET_RESPONSE;
				break;
			case SERVER_MESSAGES.BULLET_CLEAR_RESPONSE:
				eventType = GameWebSocketInteractionController.EVENT_ON_SERVER_BULLET_CLEAR_RESPONSE;
				break;
			case SERVER_MESSAGES.BATTLEGROUND_SCORE_BOARD:
				eventType = GameWebSocketInteractionController.EVENT_BATTLEGROUND_SCORE_BOARD;
				break;
			case SERVER_MESSAGES.SEAT_WIN_FOR_QUEST:
				eventType = GameWebSocketInteractionController.EVENT_ON_QUEST_WIN_PAYOUT;
				break;
			case SERVER_MESSAGES.LATENCY:
				eventType = GameWebSocketInteractionController.EVENT_ON_SERVER_LATENCY_REQUEST;
			default:
				eventType = super._specifyEventMessageType(messageData);
				break;
		}

		return eventType;
	}

	_isServerMessageReceivingAvailable(messageClass)
	{
		let unaffectedResponses = [SERVER_MESSAGES.FULL_GAME_INFO,
		SERVER_MESSAGES.SIT_OUT_RESPONSE,
		SERVER_MESSAGES.WEAPONS,
		SERVER_MESSAGES.ERROR,
		SERVER_MESSAGES.OK,
		SERVER_MESSAGES.FRB_ENDED,
		SERVER_MESSAGES.TOURNAMENT_STATE_CHANGED,
		SERVER_MESSAGES.LATENCY];

		if (this._gameScreen.isPaused || this._gameScreen.restoreAfterLagsInProgress)
		{
			unaffectedResponses.push(SERVER_MESSAGES.BUY_IN_RESPONSE);
			unaffectedResponses.push(SERVER_MESSAGES.RE_BUY_RESPONSE);
			unaffectedResponses.push(SERVER_MESSAGES.ROUND_RESULT);
			unaffectedResponses.push(SERVER_MESSAGES.GET_ROOM_INFO_RESPONSE);
			unaffectedResponses.push(SERVER_MESSAGES.SIT_IN_RESPONSE);
			unaffectedResponses.push(SERVER_MESSAGES.WEAPON_SWITCHED);
			unaffectedResponses.push(SERVER_MESSAGES.BET_LEVEL_RESPONSE);

			unaffectedResponses.push(SERVER_MESSAGES.BALANCE_UPDATED);
			unaffectedResponses.push(SERVER_MESSAGES.HIT);
			unaffectedResponses.push(SERVER_MESSAGES.MISS);
			unaffectedResponses.push(SERVER_MESSAGES.SEAT_WIN_FOR_QUEST);
			unaffectedResponses.push(SERVER_MESSAGES.CANCEL_BATTLEGROUND_ROUND);
			unaffectedResponses.push(SERVER_MESSAGES.BATTLEGROUND_SCORE_BOARD);
			unaffectedResponses.push(SERVER_MESSAGES.GAME_STATE_CHANGED);
		}

		return (!this._gameScreen.isPaused && !this._gameScreen.restoreAfterUnseasonableRequestInProgress && !this._gameScreen.restoreAfterLagsInProgress) || Boolean(~unaffectedResponses.indexOf(messageClass));
	}

	_handleFatalError(errorCode, requestData)
	{
		this._onBulletClear();

		super._handleFatalError(errorCode, requestData);
	}

	_onBattlegroundTimeTostartRequest()
	{
		this._sendRequest(CLIENT_MESSAGES.GET_FULL_GAME_INFO, {});
	}

	_onWeaponPaidMultiplierUpdateRequired(event)
	{
		this._sendRequest(CLIENT_MESSAGES.WEAPON_PAID_MULTIPLIER_UPDATE_REQUIRED, { roomId: event.roomId });
	}

	_handleGeneralError(errorCode, requestData)
	{
		let supported_codes = WebSocketInteractionController.ERROR_CODES;
		switch (errorCode)
		{
			case supported_codes.ROOM_NOT_FOUND:
			case supported_codes.ROOM_NOT_OPEN:
			case supported_codes.ROOM_MOVED:
			case supported_codes.TOO_MANY_OBSERVERS:
			case supported_codes.TOO_MANY_PLAYER:
				this._stopServerMesagesHandling();
				this._closeConnectionIfPossible();
				break;
			case supported_codes.BUYIN_NOT_ALLOWED_AT_CURRENT_GAME_STATE:
				if (APP.isBattlegroundGame)
				{
					this._stopServerMesagesHandling();
					this._closeConnectionIfPossible();
				}
				break;
		}

		super._handleGeneralError(errorCode, requestData);
	}

	_onNoPlaceToSeatHandler(event)
	{
		this._stopServerMesagesHandling();
		this._closeConnectionIfPossible();
	}

	_trySendOpenRoomRequest()
	{
		//DEBUG error code...
		//setTimeout(this._processServerMessage.bind(this, {"code": 1012,"msg": "ROOM_NOT_OPEN","date": 1496748898812,"class": "Error","rid": 1}), 10);
		//...DEBUG error code

		if (APP.currentWindow && APP.currentWindow.gameFrbController && APP.currentWindow.gameFrbController.info.isFrbEndedAndConnectionLost)
		{
			APP.currentWindow.gameFrbController.info.isFrbEndedAndConnectionLost = false;
			this._fOpenRoomNotSent_bln = true;

			APP.gameScreen.gameFieldController && APP.gameScreen.gameFieldController.roundResultScreenController.tryToActivateScreen(true);
			APP.gameScreen.tryToProceedPostponedSitOut(true);
			APP.gameScreen.clearPendingRequestSitin();
			return;
		}

		this._fCheckLobbyConnection_bln = true;
		APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.CHECK_LOBBY_CONNECTION);
	}

	_sendOpenRoomRequest()
	{
		let lRoomId_num = APP.urlBasedParams.roomId;
		let lServerId_num = APP.urlBasedParams.serverId;

		this._fOpenRoomSent_bln = true;
		this._sendRequest(CLIENT_MESSAGES.OPEN_ROOM, { sid: APP.urlBasedParams.SID, serverId: lServerId_num, roomId: lRoomId_num, lang: I18.currentLocale });
	}

	_closeConnectionIfPossible()
	{
		super._closeConnectionIfPossible();
		this._fOpenRoomSent_bln = false;
	}

	_onGameSocketUrlUpdated(event)
	{
		let socketUrl = event.socketUrl;
		if (socketUrl === undefined)
		{
			return;
		}

		this.info.socketUrl = socketUrl;

		if (this._isConnectionOpened)
		{
			this._recoverAfterServerShutdownRequired = false;
			this._closeConnectionIfPossible();
			this._establishConnection();
		}
		else if (this._isConnectionClosed || this._isConnectionClosing)
		{
			if (this._reconnectingAfterGameUrlUpdatedRequired)
			{
				this._reconnectingAfterGameUrlUpdatedRequired = false;
				this._startReconnectingOnConnectionLost();
			}
			else if (!this._reconnectInProgress)
			{
				this._establishConnection();
			}
		}
	}

	_onFullGameInfoRequired(event)
	{
		if (this._isConnectionOpened)
		{
			this._sendRequest(CLIENT_MESSAGES.GET_FULL_GAME_INFO, {});
		}
		else if (this._isConnectionClosed)
		{
			if (this.recoveringConnectionInProgress || this._blockedAfterCriticalError)
			{
				// no actions required
			}
			else
			{
				this._establishConnection();
			}
		}
	}

	clearOpenRoomSent()
	{
		APP.currentWindow.gameFrbController.info.isFrbEndedAndConnectionLost = false;
		this._fOpenRoomNotSent_bln = false;
	}

	_onCloseRoomRequired(event)
	{
		if (!this.isCloseRoomRequestInProgress)
		{
			if (this._fOpenRoomNotSent_bln)
			{
				this._fOpenRoomNotSent_bln = false;
				this.onRoomClosed();
				APP.gameScreen.onRoomClosed();
				APP.currentWindow.gameFrbController.onRoomClosed();
				return;
			}
			this._sendRequest(CLIENT_MESSAGES.CLOSE_ROOM, { roomId: event.roomId });
		}
	}

	_onBattlegroundConfirmBuyInRequired()
	{
		this._sendRequest(CLIENT_MESSAGES.CONFIRM_BATTLEGROUND_BUY_IN, {});
	}

	_onSitInRequired(event)
	{
		this._sendRequest(CLIENT_MESSAGES.SIT_IN, { stake: event.stake });
	}

	_onSitOutRequired(event)
	{
		if (!this.isSitoutRequestInProgress)
		{
			this._sendRequest(CLIENT_MESSAGES.SIT_OUT, {});
			APP.logger.i_pushDebug(`GWSIC. SitOut required. ${event}`);
		}
	}

	_onShotTriggered(event)
	{

		let sendData = { enemyId: event.enemyId, weaponId: event.weaponId, x: event.x, y: event.y, weaponPrice: event.weaponPrice };
		if (event.bulletId)
		{
			sendData.bulletId = event.bulletId;
			sendData.excludeParams = sendData.excludeParams || {};
			sendData.excludeParams.betLevel = APP.playerController.info.betLevel;
		}

		this._sendRequest(CLIENT_MESSAGES.SHOT, sendData);


		//DEBUG...
		// let msgWrongWeapon = {"code":1015,"msg":"Wrong weapon","date":1599034648281,"rid":40,"class":"Error"};
		// msgWrongWeapon.rid = this._requestUniqId;
		// setTimeout(() => this._processServerMessage(msgWrongWeapon), 1000);
		//...DEBUG
	}

	_onBullet(event)
	{
		this._sendRequest(CLIENT_MESSAGES.BULLET, {
			bulletTime: event.bulletTime, bulletAngle: event.bulletAngle,
			bulletId: event.bulletId, weaponId: event.weaponId,
			startPointX: event.startPointX, startPointY: event.startPointY, endPointX: event.endPointX, endPointY: event.endPointY
		});
	}

	_onBulletClear(aEvent_e)
	{
		this._removeSpecificDelayedRequests(CLIENT_MESSAGES.BULLET);

		this._removeDelayedShots();

		if (!aEvent_e || !!aEvent_e.clearBulletsOnServer)
		{
			this._sendRequest(CLIENT_MESSAGES.BULLET_CLEAR, {});
		}
	}

	_removeDelayedShots()
	{
		let lDelayedRequests = this._delayedRequests;

		if (!lDelayedRequests || !lDelayedRequests.length)
		{
			return;
		}

		for (let i = 0; i < lDelayedRequests.length; i++)
		{
			let lCurDelayedRequest = lDelayedRequests[i];
			let lRequestData_obj = lCurDelayedRequest.data;
			let lBulletId = lRequestData_obj.bulletId;
			let lWeaponId = lRequestData_obj.weaponId;
			let lBetLevel = lRequestData_obj.excludeParams ? lRequestData_obj.excludeParams.betLevel : lRequestData_obj.betLevel;

			if (lCurDelayedRequest.class == CLIENT_MESSAGES.SHOT)
			{
				lCurDelayedRequest.timer && lCurDelayedRequest.timer.destructor();
				lDelayedRequests.splice(i, 1);
				i--;

				this.emit(GameWebSocketInteractionController.EVENT_ON_DELAYED_SHOT_REMOVED, { weaponId: lWeaponId, betLevel: lBetLevel })
			}
		}
	}

	_onBuyInRequired(event)
	{
		if (this.isBuyInRequestInProgress)
		{
			return;
		}

		this._sendRequest(CLIENT_MESSAGES.BUY_IN, {});
	}

	_onReBuyRequired(event)
	{
		if (this.isRebuyRequestInProgress)
		{
			return;
		}

		this._sendRequest(CLIENT_MESSAGES.RE_BUY, {});
	}

	_onChangeStakeRequired(event)
	{
		this._sendRequest(CLIENT_MESSAGES.CHANGE_STAKE, { stake: event.stake });
	}

	_onWeaponUpdated(event)
	{
		if (
			APP.currentWindow.gameFrbController.info.frbEnded
			|| !APP.currentWindow.gameStateController.info.isPlayerSitIn
		)
		{
			return;
		}

		this._removeDelayedSwitchWeaponRequests(false);

		let requestData = { weaponId: event.weaponId };
		this._sendRequest(CLIENT_MESSAGES.SWITCH_WEAPON, requestData);
		this.emit(GameWebSocketInteractionController.EVENT_ON_REQUEST_WEAPON_UPDATE_SENDED, { weaponId: event.weaponId });
	}

	_onGameStateChanged(event)
	{
		let lNewState_str = event.value;

		if (
			APP.currentWindow.isPaused
			&& lNewState_str == ROUND_STATE.QUALIFY
		)
		{
			this._removeDelayedSwitchWeaponRequests(true);
		}
	}

	_removeDelayedSwitchWeaponRequests(aKeepDelayedDefaultWeapon_bl)
	{
		if (this._delayedRequests && this._delayedRequests.length)
		{
			for (let i = 0; i < this._delayedRequests.length; i++)
			{
				let curDelayedRequestInfo = this._delayedRequests[i];
				if (curDelayedRequestInfo.class === CLIENT_MESSAGES.SWITCH_WEAPON)
				{
					if (aKeepDelayedDefaultWeapon_bl)
					{
						continue;
					}
					curDelayedRequestInfo.timer && curDelayedRequestInfo.timer.destructor();

					this._delayedRequests.splice(i, 1);
					i--;
				}
			}
		}
	}

	_onRoundResultScreenClosed(event)
	{
		if (!APP.currentWindow.gameStateController.info.isPlayerSitIn || APP.currentWindow.gameFrbController.info.frbEnded)
		{
			return;
		}

		this._sendRequest(CLIENT_MESSAGES.CLOSE_ROUND_RESULTS, {});
		this._onRefreshBalance();
	}

	_onRoundResultScreenOpened(event)
	{
	}

	_onGameBackToLobbyInitiated(event)
	{
		this._stopRecoveringSocketConnectionIfRequired();
		this._closeConnectionIfPossible();
	}

	_onAssetsLoadingError(event)
	{
		this._blockAfterCriticalError();
		this._stopServerMesagesHandling();
		this._closeConnectionIfPossible();
	}

	_onWebglContextLost(event)
	{
		this._onBulletClear();
		this._blockAfterCriticalError();
		this._stopServerMesagesHandling();
		this._closeConnectionIfPossible();
	}

	_onBetLevelChangeRequired(event)
	{
		this._sendRequest(CLIENT_MESSAGES.BET_LEVEL, { betLevel: event.multiplier });
	}

	_onTournamentModeClientStateChanged(event)
	{
		let lTournamentModeInfo_tmi = this._fTournamentModeInfo_tmi;
		if (lTournamentModeInfo_tmi.isTournamentOnClientCompletedState)
		{
			this._stopRecoveringSocketConnection();
			this._blockAfterCriticalError();
			this._stopServerMesagesHandling();
			this._closeConnectionIfPossible();
		}
	}

	_onLobbyMessageReceived(event)
	{
		let msgType = event.type;

		switch (msgType)
		{
			case LOBBY_MESSAGES.SERVER_ERROR_MESSAGE_RECIEVED:
				if (GameWebSocketInteractionController.isFatalError(event.data.errorType))
				{
					this._onBulletClear();
					this._blockAfterCriticalError();
					this._stopServerMesagesHandling();
					this._closeConnectionIfPossible();
				}
				else if (GameWebSocketInteractionController.isGeneralError(event.data.errorType))
				{
					this._handleLobbyGeneralError(event.data.errorCode);
				}
				break;
			case LOBBY_MESSAGES.GAME_REFRESH_BALANCE_REQUIRED:
				if (this._gameScreen.roundFinishSoon) return;

				this._onRefreshBalance();
				break;
			case LOBBY_MESSAGES.LOBBY_CONNECTION_STATE:
				this._fLobbyConnectionState_bln = event.data.state;

				if (this._fLobbyConnectionState_bln)
				{
					if (this._fCheckLobbyConnection_bln)
					{
						this._fCheckLobbyConnection_bln = false;
						this.emit(GameWebSocketInteractionController.EVENT_ON_CONNECTION_READY_TO_ROOM_OPEN);

						if (!this._fPendingOperationController_poc.info.isPendingOperationProgressStatusDefined || this._fPendingOperationController_poc.info.isPendingOperationInProgress)
						{
							this._fPendingOperationController_poc.once(GamePendingOperationController.EVENT_ON_PENDING_OPERATION_COMPLETED, this._onPendingOperationCompletedForOpenRoom, this);
						}
						else
						{
							this._sendOpenRoomRequest();
						}
					}
				}
				else
				{
					if (this._reconnectInProgress)
					{
						this._deactivateReconnectTimeout();

						if (this._isConnectionClosed || this._isConnectionClosing)
						{
							this._reconnectingAfterGameUrlUpdatedRequired = false;
							this._startReconnectingOnConnectionLost();
						}
					}
				}
				break;
			case LOBBY_MESSAGES.LOBBY_LOADING_ERROR:
			case LOBBY_MESSAGES.WEBGL_CONTEXT_LOST:
				this._onBulletClear();
				this._blockAfterCriticalError();
				this._stopServerMesagesHandling();
				this._closeConnectionIfPossible();
				break;
			case LOBBY_MESSAGES.ENTER_LOBBY_MESSAGE_RECEIVED:
				if (this._fIsReopenSocketRequired_bl)
				{
					this._establishConnection();
				}
				break;
		}
	}

	_handleLobbyGeneralError(errorCode)
	{
		let supported_codes = GameWebSocketInteractionController.ERROR_CODES;
		switch (errorCode)
		{
			case supported_codes.ROOM_NOT_FOUND:
				this._recoverAfterServerShutdownRequired = false;
				this._reconnectingAfterGameUrlUpdatedRequired = false;
				break;
		}
	}

	_onRefreshBalance()
	{
		let msg = {};
		//add ammo params for debug...
		let playerInfo = APP.playerController.info;
		msg.clientAmmo = APP.currentWindow.weaponsController.info.ammo;

		let lPendingAmmo_num = playerInfo.pendingAmmo;
		let lRealAmmo_num = APP.currentWindow.weaponsController.info.realAmmo;
		msg.clientPendingAmmo = Number(lPendingAmmo_num.toFixed(2));
		
		let lResAmmo_num = lRealAmmo_num+lPendingAmmo_num;
		if (APP.currentWindow.gameFrbController.info.frbMode || APP.isBattlegroundGame)
		{
			msg.clientPendingAmmo = 0;
			lResAmmo_num = APP.currentWindow.weaponsController.info.realAmmo;
		}

		lResAmmo_num = Number(lResAmmo_num.toFixed(2));
		msg.clientResultAmmo = Math.floor(lResAmmo_num);
		//...add ammo params for debug
		this._sendRequest(CLIENT_MESSAGES.REFRESH_BALANCE, msg);
	}

	_onTickerResumed(event)
	{
		this._forceDelayedRequests();
	}

	destroy()
	{
		let gameScreen = this._gameScreen = APP.gameScreen;
		if (gameScreen)
		{
			gameScreen.off(GameScreen.EVENT_ON_GAME_SOCKET_URL_UPDATED, this._onGameSocketUrlUpdated, this);
			gameScreen.off(GameScreen.EVENT_ON_FULL_GAME_INFO_REQUIRED, this._onFullGameInfoRequired, this);
			gameScreen.off(GameScreen.EVENT_ON_CLOSE_ROOM_REQUIRED, this._onCloseRoomRequired, this);
			gameScreen.off(GameScreen.EVENT_BATTLEGROUND_CONFIRM_BUY_IN_REQUIRED, this._onBattlegroundConfirmBuyInRequired, this);
			gameScreen.off(GameScreen.EVENT_ON_SIT_IN_REQUIRED, this._onSitInRequired, this);
			gameScreen.off(GameScreen.EVENT_ON_SIT_OUT_REQUIRED, this._onSitOutRequired, this);
			gameScreen.off(GameScreen.EVENT_ON_SHOT_TRIGGERED, this._onShotTriggered, this);
			gameScreen.off(GameScreen.EVENT_ON_BUY_IN_REQUIRED, this._onBuyInRequired, this);
			gameScreen.off(GameScreen.EVENT_ON_RE_BUY_REQUIRED, this._onReBuyRequired, this);
			gameScreen.off(GameScreen.EVENT_ON_CHANGE_STAKE_REQUIRED, this._onChangeStakeRequired, this);
			gameScreen.off(GameScreen.EVENT_ON_WEAPON_UPDATED, this._onWeaponUpdated, this);
			gameScreen.off(GameScreen.EVENT_ON_ROUND_RESULT_SCREEN_DEACTIVATED, this._onRoundResultScreenClosed, this);
			gameScreen.off(GameScreen.EVENT_ON_ROUND_RESULT_SCREEN_ACTIVATED, this._onRoundResultScreenOpened, this);
			gameScreen.off(GameScreen.EVENT_ON_READY, this._onGameScreenReady, this);
			gameScreen.off(GameScreen.EVENT_ON_TIME_TO_OPEN_REAL_ROOM_AFTER_BONUS, this._onTimeToOpenRealRoomAfterBonus, this);
		}

		this._fLastWeapon_int = null;


		let externalCommunicator = APP.externalCommunicator;
		if (externalCommunicator)
		{
			externalCommunicator.off(GameExternalCommunicator.LOBBY_MESSAGE_RECEIVED, this._onLobbyMessageReceived, this);
		}

		super.destroy();
	}

	//PENDING_OPERATION...
	_onPendingOperationStarted(event)
	{
		this._removeSpecificDelayedRequests(CLIENT_MESSAGES.BUY_IN);
		this._removeSpecificDelayedRequests(CLIENT_MESSAGES.RE_BUY);
		this._removeSpecificDelayedRequests(CLIENT_MESSAGES.SIT_IN);
		this._removeSpecificDelayedRequests(CLIENT_MESSAGES.CONFIRM_BATTLEGROUND_BUY_IN);
	}

	_onPendingOperationCompletedForOpenRoom(event)
	{
		this._sendOpenRoomRequest();	
	}

	_onRefreshPendingOperationStatusRequired(event)
	{
		let lParams_obj = {};
		lParams_obj.sid = APP.urlBasedParams.SID;
		
		this._sendRequest(CLIENT_MESSAGES.CHECK_PENDING_OPERATION_STATUS, lParams_obj);
	}

	_onPendingOperationStatusTrackingTurnedOff(event)
	{
		this._removeSpecificDelayedRequests(CLIENT_MESSAGES.CHECK_PENDING_OPERATION_STATUS);
	}
	//...PENDING_OPERATION
}

export default GameWebSocketInteractionController