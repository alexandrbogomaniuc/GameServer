import DialogController from '../DialogController';
import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import LobbyWebSocketInteractionController from '../../../../interaction/server/LobbyWebSocketInteractionController';
import LobbyPlayerController from '../../../../custom/LobbyPlayerController';
import PlayerInfo from '../../../../../../../../common/PIXI/src/dgphoenix/unified/model/custom/PlayerInfo';
import {CLIENT_MESSAGES} from '../../../../../model/interaction/server/LobbyWebSocketInteractionInfo';
import LobbyStateController from '../../../../state/LobbyStateController';
import LobbyScreen from '../../../../../main/LobbyScreen';
import LobbyExternalCommunicator from '../../../../../external/LobbyExternalCommunicator';
import { GAME_MESSAGES, LOBBY_MESSAGES } from '../../../../../../../../common/PIXI/src/dgphoenix/gunified/controller/external/GUSLobbyExternalCommunicator';

class LobbyInsufficientFundsDialogController extends DialogController
{
	static get EVENT_DIALOG_PRESENTED () { return DialogController.EVENT_DIALOG_PRESENTED };
	static get EVENT_PRESENTED_DIALOG_UPDATED () { return DialogController.EVENT_PRESENTED_DIALOG_UPDATED };

	constructor(aOptInfo_usuii, parentController)
	{
		super(aOptInfo_usuii, undefined, parentController);
	
		this._initLobbyInsufficientFundsDialogController();
	}

	_initLobbyInsufficientFundsDialogController()
	{
	}

	__init ()
	{
		super.__init();
	}

	__getExternalViewForSelfInitialization()
	{
		return this.__getViewLevelSelfInitializationViewProvider().insufficientFundsDialogView;
	}

	__initModelLevel ()
	{
		super.__initModelLevel();
	}

	__initControlLevel ()
	{
		super.__initControlLevel();

		let webSocketInteractionController = APP.webSocketInteractionController;
		webSocketInteractionController.once(LobbyWebSocketInteractionController.EVENT_ON_SERVER_ENTER_LOBBY_MESSAGE, this._onServerEnterLobbyMessage, this);

		let externalCommunicator = APP.externalCommunicator;
		externalCommunicator.on(LobbyExternalCommunicator.GAME_MESSAGE_RECEIVED, this._onGameMessageReceived, this);

		// DEBUG...
		//window.addEventListener("keydown", this.keyDownHandler.bind(this), false);
		// ...DEBUG
	}

	//DEBUG...
	/* keyDownHandler(keyCode)
	 {
	 	this.__activateDialog();
	 }*/
	//...DEBUG

	_onServerEnterLobbyMessage(event)
	{
		this._startHandleEnvironmentMessages();
	}

	_onGameMessageReceived(event)
	{
		switch (event.type)
		{
			case GAME_MESSAGES.SERVER_ERROR_MESSAGE_RECIEVED:
						if (event.data.errorCode == LobbyWebSocketInteractionController.ERROR_CODES.INSUFFICIENT_FUNDS)
						{
							this.info.setOkMode();
							this.__activateDialog();
						}					
						break;

		}
	}

	//VALIDATION...
	__validateModelLevel ()
	{
		super.__validateModelLevel();
	}

	__validateViewLevel ()
	{
		var info = this.info;
		var view = this.__fView_uo;

		//buttons configuration...
		view.setOkMode();
		//...buttons configuration

		//message configuration...
		view.setMessage("TADialogMessageErrorInsufficientFunds");
		//...message configuration

		super.__validateViewLevel();
	}
	//...VALIDATION

	__deactivateDialog()
	{
		super.__deactivateDialog();
	}

	__onDialogOkButtonClicked(event)
	{
		super.__onDialogOkButtonClicked(event);

		this.__deactivateDialog();
	}

	__onDialogCustomButtonClicked(event)
	{
		super.__onDialogCustomButtonClicked(event);

		this.__deactivateDialog();
	}

	_startHandleEnvironmentMessages()
	{	
		let webSocketInteractionController = APP.webSocketInteractionController;
		webSocketInteractionController.on(LobbyWebSocketInteractionController.EVENT_ON_SERVER_ERROR_MESSAGE, this._onServerErrorMessage, this);
		webSocketInteractionController.on(LobbyWebSocketInteractionController.EVENT_ON_SERVER_CONNECTION_OPENED, this._onLobbyServerConnectionOpened, this);
		webSocketInteractionController.on(LobbyWebSocketInteractionController.EVENT_ON_SERVER_CONNECTION_CLOSED, this._onLobbyServerConnectionClosed, this);

		let lLobbyStateController_lsc = APP.lobbyStateController;
		lLobbyStateController_lsc.on(LobbyStateController.EVENT_ON_LOBBY_VISIBILITY_CHANGED, this._onLobbyVisibilityChanged, this);
	}

	_onServerErrorMessage(event)
	{
		console.log("_onServerErrorMessage");
		console.log(event.messageData);
		
		let serverData = event.messageData;
		switch (serverData.code) 
		{
			case LobbyWebSocketInteractionController.ERROR_CODES.INSUFFICIENT_FUNDS:
					this.info.setOkMode();
					this.__activateDialog();
				break;
		}
	}

	_onLobbyVisibilityChanged(event)
	{
		if (event.visible)
		{
		}
		else
		{
			this.__deactivateDialog();
		}
	}

	_onLobbyServerConnectionOpened(event)
	{
		this.__deactivateDialog();
	}

	_onLobbyServerConnectionClosed(event)
	{
		this.__deactivateDialog();
	}
}

export default LobbyInsufficientFundsDialogController