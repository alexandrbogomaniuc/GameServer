import SimpleUIController from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/uis/base/SimpleUIController';
import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import LobbyWebSocketInteractionController from '../../../../interaction/server/LobbyWebSocketInteractionController';
import LobbyScreen from '../../../../../main/LobbyScreen';
import LobbyExternalCommunicator from '../../../../../external/LobbyExternalCommunicator';
import PlayerController from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/custom/PlayerController';
import LobbyAPP from '../../../../../LobbyAPP';
import PlayerCollectionScreenController from './PlayerCollectionScreenController';
import {GAME_MESSAGES} from '../../../../../../../../common/PIXI/src/dgphoenix/gunified/controller/external/GUSLobbyExternalCommunicator';
import PlayerInfo from '../../../../../../../../common/PIXI/src/dgphoenix/unified/model/custom/PlayerInfo';

class PlayerCustomCollectionScreenController extends SimpleUIController
{
	static get EVENT_SCREEN_ACTIVATED()					{ return "onPlayerCustomCollectionScreenActivated"; }
	static get EVENT_SCREEN_DEACTIVATED()				{ return "onPlayerCustomCollectionScreenDeactivated"; }

	constructor(aOptInfo_usuii, aOptCollectionId_int, aOptParentController_usc)
	{
		super(aOptInfo_usuii || new PlayerCustomCollectionScreenInfo(aOptCollectionId_int), undefined, aOptParentController_usc);

		this._requestDataFromTheServerRequired = true;
	}

	//INIT...
	__init()
	{
		super.__init();
	}

	__initControlLevel()
	{
		super.__initControlLevel();

		let webSocketController = APP.webSocketInteractionController;
		webSocketController.on(LobbyWebSocketInteractionController.EVENT_ON_SERVER_ERROR_MESSAGE, this._onServerErrorMessage, this);
		webSocketController.on(LobbyWebSocketInteractionController.EVENT_ON_SERVER_CONNECTION_OPENED, this._onLobbyServerConnectionOpened, this);
		webSocketController.on(LobbyWebSocketInteractionController.EVENT_ON_SERVER_CONNECTION_CLOSED, this._onLobbyServerConnectionClosed, this);
		webSocketController.on(LobbyWebSocketInteractionController.EVENT_ON_SERVER_ENTER_LOBBY_MESSAGE, this._onServerEnterLobbyMessage, this);

		APP.lobbyScreen.on(LobbyScreen.EVENT_ON_LOBBY_SHOW, this._onLobbyScreenShown, this);

		APP.externalCommunicator.on(LobbyExternalCommunicator.GAME_MESSAGE_RECEIVED, this._onGameExternalMessageReceived, this);
		APP.playerController.on(PlayerController.EVENT_ON_PLAYER_INFO_UPDATED, this._onPlayerInfoUpdated, this);
		APP.on(LobbyAPP.EVENT_ON_PLAYER_INFO_UPDATED, this._onPlayerInfoUpdated, this);

		this.parentController.on(PlayerCollectionScreenController.EVENT_ON_FRAME_SWITCHED, 			this._onCollectionTypeChanged, this);
		this.parentController.on(PlayerCollectionScreenController.EVENT_ON_SELECTED_STAKE_CHANGED,	this._onCollectionStakeChanged, this);
	}

	__initViewLevel()
	{
		super.__initViewLevel();

		let lView_qssv = this.view;

		this._hideSceeen();
	}
	//...INIT

	_onGameExternalMessageReceived(event)
	{
		let msgType = event.type;
		switch (msgType)
		{
			case GAME_MESSAGES.SERVER_ERROR_MESSAGE_RECIEVED:
				if (event.data.errorType === LobbyWebSocketInteractionController.ERROR_CODES.SERVER_SHUTDOWN)
				{
					this._requestDataFromTheServerRequired = true;
				}
				break;
			case GAME_MESSAGES.SERVER_CONNECTION_CLOSED:
				if (!event.data.wasClean)
				{
					this._requestDataFromTheServerRequired = true;
				}
				break;
			case GAME_MESSAGES.SERVER_CONNECTION_OPENED:
				this._requestDataFromTheServerRequired = true;
				
				let lView_qssv = this.view;
				if (lView_qssv && lView_qssv.visible)
				{
					this._updateScreenData();
				}
				break;
		}
	}

	_updateWeaponsInfoFromGame(aWeapons_arr)
	{
		let lView_qssv = this.view;
		if (lView_qssv)
		{
			lView_qssv.updateWeaponsInfoFromGame(aWeapons_arr);
		}
	}

	_onPlayerInfoUpdated(aEvent_obj)
	{
	}

	_onCollectionStakeChanged(aEvent_obj)
	{
		let stake = aEvent_obj.stake;
		let lView_qssv = this.view;
		if (lView_qssv)
		{
			lView_qssv.changeStake(stake);
		}
	}

	_onCollectionTypeChanged(event)
	{
		let collectionId = event.id;
		if (collectionId === this.info.collectionId)
		{
			this._showScreen();
		}
		else
		{
			this._hideSceeen();
		}
	}

	_showScreen()
	{
		let lView_qssv = this.view;

		this._requestDataFromTheServerRequired = true;
		this._updateScreenData();
		
		lView_qssv.show();

		this.emit(PlayerCustomCollectionScreenController.EVENT_SCREEN_ACTIVATED);
	}

	_updateScreenData()
	{
		let lView_qssv = this.view;

		if (this._requestDataFromTheServerRequired)
		{
			lView_qssv.showWaitScreen();
			this._requestData();
		}
		else
		{
			this._updateCollectionView();
		}
	}

	_updateCollectionView()
	{
		// override in subclasses
	}

	_hideSceeen()
	{
		let lView_qssv = this.view;
		if (lView_qssv)
		{
			lView_qssv.hide();

			this.emit(PlayerCustomCollectionScreenController.EVENT_SCREEN_DEACTIVATED);
		}
	}

	_requestData()
	{
		this._requestDataFromTheServerRequired = false;
	}

	_onDataResponded()
	{
		let lView_qssv = this.view;

		lView_qssv.hideWaitScreen();

		if (lView_qssv.visible)
		{
			this._updateCollectionView();
		}
	}

	_onServerErrorMessage(event)
	{
		switch (event.messageData.code) 
		{
			case LobbyWebSocketInteractionController.ERROR_CODES.SERVER_SHUTDOWN:
				this._requestDataFromTheServerRequired = true;
				break;
		}
	}

	_onLobbyServerConnectionOpened(event)
	{
		this._requestDataFromTheServerRequired = true;
	}

	_onLobbyServerConnectionClosed(event)
	{
		if (event.wasClean)
		{
			return;
		}

		this._requestDataFromTheServerRequired = true;
	}

	_onServerEnterLobbyMessage(event)
	{
		let lView_qssv = this.view;
		if (lView_qssv && lView_qssv.visible)
		{
			this._updateScreenData();
		}
	}

	_onLobbyScreenShown(event)
	{
		let lView_qssv = this.view;
		if (lView_qssv && lView_qssv.visible)
		{
			this._updateScreenData();
		}
		else
		{
			this._requestData();
		}
	}

	destroy()
	{
		this._requestDataFromTheServerRequired = undefined;		

		super.destroy();
	}
	
}

export default PlayerCustomCollectionScreenController