import WebSocketInteractionController from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/interaction/server/WebSocketInteractionController';
import {GameWebSocketInteractionInfo, SERVER_MESSAGES, CLIENT_MESSAGES} from '../../../model/interaction/server/GameWebSocketInteractionInfo';
import {DEBUG_WEB_SOCKET_URL} from '../../../config/Constants';
import {WEAPONS} from '../../../../../shared/src/CommonConstants';
import {APP} from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import GameScreen from '../../../main/GameScreen'
import Game from '../../../Game'
import I18 from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
import GameExternalCommunicator from '../../../external/GameExternalCommunicator';
import {LOBBY_MESSAGES, GAME_MESSAGES} from '../../../external/GameExternalCommunicator';
import GameStateController from '../../state/GameStateController';
import { ROUND_STATE } from '../../../model/state/GameStateInfo';
import TournamentModeController from '../../custom/tournament/TournamentModeController';

class GameWebSocketInteractionController extends WebSocketInteractionController
{
	static get EVENT_ON_SERVER_MESSAGE()							{ return WebSocketInteractionController.EVENT_ON_SERVER_MESSAGE };
	static get EVENT_ON_SERVER_CONNECTION_CLOSED()					{ return WebSocketInteractionController.EVENT_ON_SERVER_CONNECTION_CLOSED };
	static get EVENT_ON_SERVER_CONNECTION_OPENED()					{ return WebSocketInteractionController.EVENT_ON_SERVER_CONNECTION_OPENED };
	static get EVENT_ON_SERVER_ERROR_MESSAGE()						{ return WebSocketInteractionController.EVENT_ON_SERVER_ERROR_MESSAGE };
	static get EVENT_ON_SERVER_OK_MESSAGE()							{ return WebSocketInteractionController.EVENT_ON_SERVER_OK_MESSAGE };

	static get EVENT_ON_SERVER_GET_ROOM_INFO_RESPONSE_MESSAGE()		{ return "EVENT_ON_SERVER_GET_ROOM_INFO_RESPONSE_MESSAGE" };
	static get EVENT_ON_SERVER_FULL_GAME_INFO_MESSAGE()				{ return "EVENT_ON_SERVER_FULL_GAME_INFO_MESSAGE" };
	static get EVENT_ON_SERVER_SIT_IN_RESPONSE_MESSAGE()			{ return "EVENT_ON_SERVER_SIT_IN_RESPONSE_MESSAGE" };
	static get EVENT_ON_SERVER_SIT_OUT_RESPONSE_MESSAGE()			{ return "EVENT_ON_SERVER_SIT_OUT_RESPONSE_MESSAGE" };
	static get EVENT_ON_SERVER_NEW_ENEMY_MESSAGE()					{ return "EVENT_ON_SERVER_NEW_ENEMY_MESSAGE" };
	static get EVENT_ON_SERVER_NEW_ENEMIES_MESSAGE()				{ return "EVENT_ON_SERVER_NEW_ENEMIES_MESSAGE"};
	static get EVENT_ON_SERVER_MISS_MESSAGE()						{ return "EVENT_ON_SERVER_MISS_MESSAGE" };
	static get EVENT_ON_SERVER_HIT_MESSAGE()						{ return "EVENT_ON_SERVER_HIT_MESSAGE" };
	static get EVENT_ON_SERVER_NEW_TREASURE_MESSAGE()				{ return "EVENT_ON_SERVER_NEW_TREASURE_MESSAGE" };
	static get EVENT_ON_SERVER_LEVEL_UP_MESSAGE()					{ return "EVENT_ON_SERVER_LEVEL_UP_MESSAGE" };
	static get EVENT_ON_SERVER_CLIENTS_INFO_MESSAGE()				{ return "EVENT_ON_SERVER_CLIENTS_INFO_MESSAGE" };
	static get EVENT_ON_SERVER_ROUND_RESULT_MESSAGE()				{ return "EVENT_ON_SERVER_ROUND_RESULT_MESSAGE" };
	static get EVENT_ON_SERVER_GAME_STATE_CHANGED_MESSAGE()			{ return "EVENT_ON_SERVER_GAME_STATE_CHANGED_MESSAGE" };
	static get EVENT_ON_SERVER_BUY_IN_RESPONSE_MESSAGE()			{ return "EVENT_ON_SERVER_BUY_IN_RESPONSE_MESSAGE" };
	static get EVENT_ON_SERVER_RE_BUY_RESPONSE_MESSAGE()			{ return "EVENT_ON_SERVER_RE_BUY_RESPONSE_MESSAGE" };	
	static get EVENT_ON_SERVER_ENEMY_DESTROYED_MESSAGE()			{ return "EVENT_ON_SERVER_ENEMY_DESTROYED_MESSAGE" };
	static get EVENT_ON_SERVER_CHANGE_MAP_MESSAGE()					{ return "EVENT_ON_SERVER_CHANGE_MAP_MESSAGE" };
	static get EVENT_ON_SERVER_WEAPONS_MESSAGE()					{ return "EVENT_ON_SERVER_WEAPONS_MESSAGE" };
	static get EVENT_ON_SERVER_WEAPON_SWITCHED_MESSAGE()			{ return "EVENT_ON_SERVER_WEAPON_SWITCHED_MESSAGE" };
	static get EVENT_ON_SERVER_BALANCE_UPDATED_MESSAGE()			{ return "EVENT_ON_SERVER_BALANCE_UPDATED_MESSAGE" };
	static get EVENT_ON_SERVER_UPDATE_TRAJECTORIES_MESSAGE()		{ return "EVENT_ON_SERVER_UPDATE_TRAJECTORIES_MESSAGE"};
	static get EVENT_ON_SERVER_ROUND_FINISH_SOON()					{ return "EVENT_ON_SERVER_ROUND_FINISH_SOON"};
	static get EVENT_ON_SERVER_MINE_PLACE_MESSAGE()					{ return "EVENT_ON_SERVER_MINE_PLACE_MESSAGE" };
	static get EVENT_ON_CONNECTION_RECOVERY_STARTED()				{ return "EVENT_ON_CONNECTION_RECOVERY_STARTED" };
	static get EVENT_ON_SERVER_BET_LEVEL_CHANGED()					{ return "EVENT_ON_SERVER_BET_LEVEL_CHANGED" };
	static get EVENT_ON_SERVER_BONUS_STATUS_CHANGED_MESSAGE() 		{ return "EVENT_ON_SERVER_BONUS_STATUS_CHANGED_MESSAGE" };
	static get EVENT_ON_SERVER_FRB_ENDED_MESSAGE()					{ return "EVENT_ON_SERVER_FRB_ENDED_MESSAGE" };
	static get EVENT_ON_SERVER_TOURNAMENT_STATE_CHANGED() 			{ return "EVENT_ON_SERVER_TOURNAMENT_STATE_CHANGED" };
	static get EVENT_ON_SERVER_BULLET_RESPONSE() 					{ return "EVENT_ON_SERVER_BULLET_RESPONSE" };
	static get EVENT_ON_SERVER_BULLET_CLEAR_RESPONSE() 				{ return "EVENT_ON_SERVER_BULLET_CLEAR_RESPONSE" };

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

	get hasUnrespondedShots()
	{
		return this._hasUnRespondedRequest(CLIENT_MESSAGES.SHOT);
	}

	get hasDelayedShots()
	{
		return super._hasDelayedRequests(CLIENT_MESSAGES.SHOT);
	}

	get hasDelayedRicochetShots()
	{
		let lHasDelayedShots_bl = this.hasDelayedShots;

		if (!lHasDelayedShots_bl)
		{
			return false;
		}

		let lDelayedShotRequests = this._delayedShotRequests;
		if (!lDelayedShotRequests || !lDelayedShotRequests.length)
		{
			return false;
		}

		for (let i=0; i<lDelayedShotRequests.length; i++)
		{
			let lCurDelayedShotRequest = lDelayedShotRequests[i];

			if (lCurDelayedShotRequest.bulletId !== undefined)
			{
				return true;
			}			
		}

		return false;
	}

	get _delayedShotRequests()
	{
		if (!this._delayedRequests)
		{
			return null;
		}

		let lRequests = [];

		for (let i=0; i<this._delayedRequests.length; i++)
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
		return this._hasUnRespondedRequest(CLIENT_MESSAGES.SIT_OUT);
	}

	get isCloseRoomRequestInProgress()
	{
		return this._hasUnRespondedRequest(CLIENT_MESSAGES.CLOSE_ROOM);
	}

	get isRebuyRequestInProgress()
	{
		return this._hasUnRespondedRequest(CLIENT_MESSAGES.RE_BUY);
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
		gameScreen.on(GameScreen.EVENT_ON_SHOT_RESPONSE_PARSED, this._onShotResponseParsed, this);

		if (gameScreen.isReady)
		{
			gameScreen.gameStateController.on(GameStateController.EVENT_ON_GAME_STATE_CHANGED, this._onGameStateChanged, this);
			gameScreen.on(GameScreen.EVENT_ON_TIME_TO_OPEN_REAL_ROOM_AFTER_BONUS, this._onTimeToOpenRealRoomAfterBonus, this);
		}
		else
		{
			gameScreen.once(GameScreen.EVENT_ON_READY, () => {
																gameScreen.gameStateController.on(GameStateController.EVENT_ON_GAME_STATE_CHANGED, this._onGameStateChanged, this);
																gameScreen.on(GameScreen.EVENT_ON_TIME_TO_OPEN_REAL_ROOM_AFTER_BONUS, this._onTimeToOpenRealRoomAfterBonus, this);
															}, this);
		}


		let externalCommunicator = APP.externalCommunicator;
		externalCommunicator.on(GameExternalCommunicator.LOBBY_MESSAGE_RECEIVED, this._onLobbyMessageReceived, this);

		APP.on(Game.EVENT_ON_ASSETS_LOADING_ERROR, this._onAssetsLoadingError, this);
		APP.on(Game.EVENT_ON_WEBGL_CONTEXT_LOST, this._onWebglContextLost, this);
		APP.on(Game.EVENT_ON_BONUS_CANCEL_ROOM_RELOAD, this._onBonusCancelRoomReaload, this);

		APP.on('onTickerResumed', (e) => this._onTickerResumed(e));

		// DEBUG...
		// window.addEventListener(
		//    "keydown", this.keyDownHandler.bind(this), false
		//  );
		// ...DEBUG
	}


	_onShotResponseParsed(aRequestData)
	{
		if (aRequestData.class == CLIENT_MESSAGES.SHOT && aRequestData.rid >= 0)
			{
				let requestData = this._requests_shot_list[aRequestData.rid];
				if (!!requestData)
				{
					delete this._requests_shot_list[aRequestData.rid];
				}
			}
	}

	//DEBUG...
	// keyDownHandler(keyCode)
	// {
	// 	if (keyCode.keyCode == 16)
	// 	{
	// 		if (this._webSocket && this._webSocket.readyState === WebSocket.OPEN)
	// 		{
	// 			//close connection...
	// 			this._closeConnectionIfPossible();
	// 			this.emit(WebSocketInteractionController.EVENT_ON_SERVER_CONNECTION_CLOSED, {wasClean: false});

	// 			setTimeout(this._establishConnection.bind(this), 3000);
	// 			//...close connection

	// 			//network error...
	// 			// this._processServerMessage({"code":2,"msg":"Server shutdown","date":1538637759398,"rid":-1,"class":"Error"});
	// 			// setTimeout(this._closeConnectionIfPossible.bind(this), 2000);
	// 			//...network error

	// 			//error code...
	// 			// this._processServerMessage({"code": 1008,"msg": "ROOM_NOT_FOUND","date": 1496748898812,"class": "Error","rid": 1});
	// 			//...error code
	// 		}
	// 	}

	// 	// if (keyCode.keyCode == 32)
	// 	// {
	// 	// 	let msgBoss = {"newEnemy":{"id":182,"typeId":21,"speed":3.200000047683716,"awardedPrizes":"","awardedSum":0.0,"energy":2500.0,"fullEnergy":2500.0,"skin":3,"trajectory":{"speed":3.200000047683716,"points":[{"invulnerable":true,"x":480.0,"y":343.125,"time":1598847163854},{"x":480.0,"y":343.125,"time":1598847166854},{"x":480.0,"y":343.125,"time":1598847171354},{"x":740.0,"y":489.375,"time":1598847179479},{"x":820.0,"y":444.375,"time":1598847181979},{"x":400.0,"y":208.125,"time":1598847195103},{"x":280.0,"y":275.625,"time":1598847198853},{"x":700.0,"y":511.875,"time":1598847211977},{"x":890.0,"y":405.0,"time":1598847217914},{"x":540.0,"y":208.125,"time":1598847228851},{"x":100.0,"y":455.625,"time":1598847242600},{"x":200.0,"y":511.875,"time":1598847245725},{"x":790.0,"y":180.0,"time":1598847264162},{"x":870.0,"y":225.0,"time":1598847266662},{"x":430.0,"y":472.5,"time":1598847280411},{"x":290.0,"y":393.75,"time":1598847284786},{"x":690.0,"y":168.75,"time":1598847297285},{"x":870.0,"y":270.0,"time":1598847302910},{"x":460.0,"y":500.625,"time":1598847315722},{"x":260.0,"y":388.125,"time":1598847321972},{"x":650.0,"y":168.75,"time":1598847334159},{"x":870.0,"y":292.5,"time":1598847341034},{"x":510.0,"y":495.0,"time":1598847352283},{"x":270.0,"y":360.0,"time":1598847359783},{"x":540.0,"y":208.125,"time":1598847368220},{"x":910.0,"y":416.25,"time":1598847379782},{"x":800.0,"y":478.125,"time":1598847383219},{"x":300.0,"y":196.875,"time":1598847398843},{"x":210.0,"y":247.5,"time":1598847401655},{"x":620.0,"y":478.125,"time":1598847414467},{"x":890.0,"y":326.25,"time":1598847422904},{"x":670.0,"y":202.5,"time":1598847429779},{"x":150.0,"y":495.0,"time":1598847446028},{"x":60.0,"y":444.375,"time":1598847448840},{"x":520.0,"y":185.625,"time":1598847463214},{"x":840.0,"y":365.625,"time":1598847473213},{"x":610.0,"y":495.0,"time":1598847480400},{"x":360.0,"y":354.375,"time":1598847488212},{"x":640.0,"y":196.875,"time":1598847496961},{"x":870.0,"y":326.25,"time":1598847504148},{"x":570.0,"y":495.0,"time":1598847513522},{"x":350.0,"y":371.25,"time":1598847520397},{"x":650.0,"y":202.5,"time":1598847529771},{"x":910.0,"y":348.75,"time":1598847537896},{"x":680.0,"y":478.125,"time":1598847545083},{"x":260.0,"y":241.875,"time":1598847558207},{"x":330.0,"y":202.5,"time":1598847560394},{"x":750.0,"y":438.75,"time":1598847573518},{"x":890.0,"y":360.0,"time":1598847577893},{"x":560.0,"y":174.375,"time":1598847588205},{"x":80.0,"y":444.375,"time":1598847603204},{"x":220.0,"y":523.125,"time":1598847607579},{"x":750.0,"y":225.0,"time":1598847624141},{"x":830.0,"y":270.0,"time":1598847626641},{"x":390.0,"y":517.5,"time":1598847640390},{"x":190.0,"y":405.0,"time":1598847646640},{"x":530.0,"y":213.75,"time":1598847657264},{"x":850.0,"y":393.75,"time":1598847667263},{"x":640.0,"y":511.875,"time":1598847673825},{"x":320.0,"y":331.875,"time":1598847683824},{"x":560.0,"y":196.875,"time":1598847691324},{"x":900.0,"y":388.125,"time":1598847701948},{"x":730.0,"y":483.75,"time":1598847707260},{"x":310.0,"y":247.5,"time":1598847720384},{"x":380.0,"y":208.125,"time":1598847722571},{"x":860.0,"y":478.125,"time":1598847737570},{"x":770.0,"y":528.75,"time":1598847740382},{"x":300.0,"y":264.375,"time":1598847755069},{"x":420.0,"y":196.875,"time":1598847758819},{"x":890.0,"y":461.25,"time":1598847773506},{"x":790.0,"y":517.5,"time":1598847776631},{"x":340.0,"y":264.375,"time":1598847790693},{"x":100.0,"y":399.375,"time":1598847798193},{"x":240.0,"y":478.125,"time":1598847802568},{"x":780.0,"y":174.375,"time":1598847819442}]},"parentEnemyId":-1,"members":[],"swarmId":0,"swarmType":0},"date":1598847161855,"rid":-1,"class":"NewEnemy"};

	// 	// 	const startTime = msgBoss.newEnemy.trajectory.points[0].time;
	// 	// 	const currentTime =  (new Date()).getTime();

	// 	// 	for (let point of msgBoss.newEnemy.trajectory.points)
	// 	// 	{
	// 	// 		point.time = currentTime + point.time - startTime;
	// 	// 	}
	// 	// 	msgBoss.date = currentTime;

	// 	// 	this._processServerMessage(msgBoss);
	// 	// }
	// 	// else if (keyCode.keyCode == 65)
	// 	// {
	// 	// 	let msgBossHit = {"seatId":0,"damage":2480.0,"win":20.0,"awardedWeaponId":-1,"usedSpecialWeapon":-1,"remainingSWShots":0,"score":1.0,"enemy":{"id":182,"typeId":21,"speed":3.200000047683716,"awardedPrizes":"","awardedSum":0.0,"energy":20,"fullEnergy":2500.0,"skin":1,"parentEnemyId":-1,"members":[],"swarmId":0,"swarmType":0},"hit":true,"awardedWeaponShots":0,"killed":false,"lastResult":true,"multiplierPay":0,"killBonusPay":0.0,"currentWin":25.0,"hvEnemyId":-1,"x":649.5831,"y":151.7215,"mineId":"","newFreeShots":0,"newFreeShotsSeatId":0,"hitResultBySeats":{"0":[{"id":0,"value":"20.0"}]},"instanceKill":false,"chMult":1,"awardedWeapons":[],"needExplode":false,"isExplode":false,"gems":[],"enemyId":182,"shotEnemyId":182,"enemiesInstantKilled":{},"date":1598847224885,"rid":181,"class":"Hit"}

	// 	// 	msgBossHit.date = (new Date()).getTime();
	// 	// 	this._processServerMessage(msgBossHit);
	// 	// }
	// }
	//...DEBUG

	_handleServerMessage(messageData, requestData)
	{
		super._handleServerMessage(messageData, requestData);

		let msgClass = messageData.class;
		switch(msgClass)
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

	_onBonusCancelRoomReaload()
	{
		this._fIsReopenSocketRequired_bl = false;
	}

	onRoomClosed()
	{
		this._closeConnectionIfPossible();
		if (APP.currentWindow.gameBonusController.info.isRoomRestartRequired)
		{
			//wait for EnterLobby completion, then - establish new connection
			this._fIsReopenSocketRequired_bl = true;
		}
	}

	_processServerMessage(messageData)
	{
		let msgClass = messageData.class;

		//DEBUG...
		// if (!window.hasEnterLobby && msgClass == "GetRoomInfoResponse")
		// {
		// 	window.hasEnterLobby = true;
		// 	messageData.cashBonusInfo = {
		// 		id: 345345,
		// 		amountToRelease: 0,
		// 		balance: 10000,
		// 		amount: 10000,
		// 		status: "ACTIVE"
		// 	}
		// 	if (messageData.balance)
		// 	{
		// 		messageData.balance = 10000;
		// 	}
		// }
		// if (msgClass == "SitOutResponse" && APP.currentWindow.gameBonusController.info.isActivated)
		// {
		// 	messageData.rid = -1;
		// 	messageData.nextRoomId = "70011";
		// }
		/*if (msgClass == "RoundResult")
		{
			messageData.hasNextFrb = true;
		}*/
		//...DEBUG

		switch(msgClass)
		{
			case SERVER_MESSAGES.HIT:
				messageData.id = this._hitDataUniqId++;
				break;
		}

		//DEBUG...
		// if (msgClass == "Hit" || msgClass == "Miss") return;
		//..DEBUG

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

		super._sendRequest(requestClass, requestData);
	}

	_onConnectionOpened()
	{
		console.log("Game -> _onConnectionOpened");
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
		console.log("Game -> _onConnectionClosed");
		super._onConnectionClosed(event);
	}

	_activateReconnectTimeout()
	{
		console.log("Game -> _activateReconnectTimeout");
		super._activateReconnectTimeout();
	}

	get recoveringConnectionInProgress ()
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
		this.emit(GameWebSocketInteractionController.EVENT_ON_CONNECTION_RECOVERY_STARTED, {roomId: lRoomId_num});
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
		switch(messageData.class)
		{
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
			case SERVER_MESSAGES.NEW_TREASURE:
				eventType = GameWebSocketInteractionController.EVENT_ON_SERVER_NEW_TREASURE_MESSAGE;
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
			case SERVER_MESSAGES.MINE_PLACE:
				eventType = GameWebSocketInteractionController.EVENT_ON_SERVER_MINE_PLACE_MESSAGE;
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
			default:
				eventType = super._specifyEventMessageType(messageData);
				break;
		}

		return eventType;
	}

	_isServerMessageReceivingAvailable(messageClass)
	{
		let unaffectedResponses = [	SERVER_MESSAGES.FULL_GAME_INFO,
									SERVER_MESSAGES.SIT_OUT_RESPONSE,
									SERVER_MESSAGES.WEAPONS,
									SERVER_MESSAGES.ERROR,
									SERVER_MESSAGES.OK,
									SERVER_MESSAGES.FRB_ENDED,
									SERVER_MESSAGES.TOURNAMENT_STATE_CHANGED];

		if (this._gameScreen.isPaused || this._gameScreen.restoreAfterLagsInProgress)
		{
			unaffectedResponses.push(SERVER_MESSAGES.BUY_IN_RESPONSE);
			unaffectedResponses.push(SERVER_MESSAGES.RE_BUY_RESPONSE);
			unaffectedResponses.push(SERVER_MESSAGES.ROUND_RESULT);
			unaffectedResponses.push(SERVER_MESSAGES.GET_ROOM_INFO_RESPONSE);
			unaffectedResponses.push(SERVER_MESSAGES.SIT_IN_RESPONSE);

			unaffectedResponses.push(SERVER_MESSAGES.BALANCE_UPDATED);
			unaffectedResponses.push(SERVER_MESSAGES.HIT);
			unaffectedResponses.push(SERVER_MESSAGES.MISS);
		}

		return (!this._gameScreen.isPaused && !this._gameScreen.restoreAfterUnseasonableRequestInProgress && !this._gameScreen.restoreAfterLagsInProgress) || Boolean(~unaffectedResponses.indexOf(messageClass));
	}

	_handleFatalError(errorCode, requestData)
	{
		this._onBulletClear();

		super._handleFatalError(errorCode, requestData);
	}

	_handleGeneralError(errorCode, requestData)
	{
		let supported_codes = WebSocketInteractionController.ERROR_CODES;
		switch(errorCode)
		{
			case supported_codes.ROOM_NOT_FOUND:
			case supported_codes.ROOM_NOT_OPEN:
			case supported_codes.ROOM_MOVED:
				this._stopServerMesagesHandling();
				this._closeConnectionIfPossible();
				break;
		}

		super._handleGeneralError(errorCode, requestData);
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

			APP.gameScreen.gameField && APP.gameScreen.gameField.roundResultScreenController.tryToActivateScreen(true);
			APP.gameScreen.tryToProceedPostponedSitOut(true);
			return;
		}

		this._fCheckLobbyConnection_bln = true;
		APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.CHECK_LOBBY_CONNECTION);
	}

	_sendOpenRoomRequest()
	{
		this._sendRequest(CLIENT_MESSAGES.OPEN_ROOM, {sid: APP.urlBasedParams.SID, serverId: APP.urlBasedParams.serverId, roomId: APP.urlBasedParams.roomId, lang: I18.currentLocale});
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
			this._sendRequest(CLIENT_MESSAGES.CLOSE_ROOM, {roomId: event.roomId});
		}
	}

	_onSitInRequired(event)
	{
		this._sendRequest(CLIENT_MESSAGES.SIT_IN, {stake:event.stake});
	}

	_onSitOutRequired(event)
	{
		if (!this.isSitoutRequestInProgress)
		{
			this._sendRequest(CLIENT_MESSAGES.SIT_OUT, {});
		}
	}

	_onShotTriggered(event)
	{
		if (event.weaponId == WEAPONS.MINELAUNCHER)
		{
			this._onPlaceMineTriggered(event);
		}
		else
		{
			let sendData = {enemyId:event.enemyId, weaponId:event.weaponId, x: event.x, y: event.y, isPaidSpecialShot: event.isPaidSWShot};
			if (event.bulletId)
			{
				sendData.bulletId = event.bulletId;
			}
			this._sendRequest(CLIENT_MESSAGES.SHOT, sendData);
		}

		//DEBUG...
		// let msgWrongWeapon = {"code":1015,"msg":"Wrong weapon","date":1599034648281,"rid":40,"class":"Error"};
		// msgWrongWeapon.rid = this._requestUniqId;
		// setTimeout(() => this._processServerMessage(msgWrongWeapon), 1000);
		//...DEBUG
	}

	_onBullet(event)
	{
		this._sendRequest(CLIENT_MESSAGES.BULLET, {bulletTime: event.bulletTime, bulletAngle: event.bulletAngle, 
			bulletId: event.bulletId, startPointX: event.startPointX, startPointY: event.startPointY, endPointX: event.endPointX, endPointY: event.endPointY});
	}

	_onBulletClear()
	{
		this._removeSpecificDelayedRequests(CLIENT_MESSAGES.BULLET);

		this._removeDelayedRicochetShots();

		this._sendRequest(CLIENT_MESSAGES.BULLET_CLEAR, {});
	}

	_removeDelayedRicochetShots()
	{
		let lDelayedRequests = this._delayedRequests;

		if (!lDelayedRequests || !lDelayedRequests.length)
		{
			return;
		}

		for (let i=0; i<lDelayedRequests.length; i++)
		{
			let lCurDelayedRequest = lDelayedRequests[i];
			if (lCurDelayedRequest.class == CLIENT_MESSAGES.SHOT && lCurDelayedRequest.data.bulletId !== undefined)
			{
				lCurDelayedRequest.timer && lCurDelayedRequest.timer.destructor();
				lDelayedRequests.splice(i, 1);
				i--;
			}
		}
	}

	_onPlaceMineTriggered(event)
	{
		this._sendRequest(CLIENT_MESSAGES.MINE_COORDINATES, {x: event.x, y: event.y, isPaidSpecialShot: event.isPaidSWShot});
	}

	_onBuyInRequired(event)
	{
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
		this._sendRequest(CLIENT_MESSAGES.CHANGE_STAKE, {stake: event.stake});
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

		let requestData = {weaponId: event.weaponId};
		this._sendRequest(CLIENT_MESSAGES.SWITCH_WEAPON, requestData);
	}

	_onGameStateChanged(event)
	{
		let lNewState_str = event.value;

		if (
				APP.currentWindow.isPaused
				&& lNewState_str == ROUND_STATE.QUALIFY
				&& !APP.currentWindow.isKeepSWModeActive
			)
		{
			this._removeDelayedSwitchWeaponRequests(true);
		}
	}

	_removeDelayedSwitchWeaponRequests(aKeepDelayedDefaultWeapon_bl)
	{
		if (this._delayedRequests && this._delayedRequests.length)
		{
			for (let i=0; i<this._delayedRequests.length; i++)
			{
				let curDelayedRequestInfo = this._delayedRequests[i];
				if (curDelayedRequestInfo.class === CLIENT_MESSAGES.SWITCH_WEAPON)
				{
					let curDelayedWeaponId = curDelayedRequestInfo.data.weaponId;
					if (curDelayedWeaponId == WEAPONS.DEFAULT && aKeepDelayedDefaultWeapon_bl)
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
	}

	_onRoundResultScreenOpened(event)
	{
		// this._sendRequest(CLIENT_MESSAGES.REFRESH_BALANCE, {});
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
		this._sendRequest(CLIENT_MESSAGES.BET_LEVEL, {betLevel: event.multiplier});
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

				let msg = {};
				//add ammo params for debug...
				let playerInfo = APP.playerController.info;
				msg.clientAmmo = APP.currentWindow.weaponsController.info.ammo;

				let lPendingAmmo_num = playerInfo.pendingAmmo;
				let lRealAmmo_num = APP.currentWindow.weaponsController.info.realAmmo;
				msg.clientPendingAmmo = Number(lPendingAmmo_num.toFixed(2));
				
				let lResAmmo_num = lRealAmmo_num+lPendingAmmo_num;
				if (APP.currentWindow.gameFrbController.info.frbMode)
				{
					msg.clientPendingAmmo = 0;
					lResAmmo_num = APP.currentWindow.weaponsController.info.realAmmo;
				}

				lResAmmo_num = Number(lResAmmo_num.toFixed(2));
				msg.clientResultAmmo = Math.floor(lResAmmo_num);
				//...add ammo params for debug
				this._sendRequest(CLIENT_MESSAGES.REFRESH_BALANCE, msg);
				break;
			case LOBBY_MESSAGES.LOBBY_CONNECTION_STATE:
				this._fLobbyConnectionState_bln = event.data.state;

				if (this._fLobbyConnectionState_bln)
				{
					if (this._fCheckLobbyConnection_bln)
					{
						this._fCheckLobbyConnection_bln = false;
						this._sendOpenRoomRequest();
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
		switch(errorCode)
		{
			case supported_codes.ROOM_NOT_FOUND:
				this._recoverAfterServerShutdownRequired = false;
				this._reconnectingAfterGameUrlUpdatedRequired = false;
				break;
		}
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
}

export default GameWebSocketInteractionController