import JSEnvironmentInteractionController from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/interaction/js/JSEnvironmentInteractionController';
import {APP} from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import LobbyScreen from '../../../main/LobbyScreen'
import DialogController from '../../uis/custom/dialogs/DialogController';

class LobbyJSEnvironmentInteractionController extends JSEnvironmentInteractionController
{
	static get EVENT_WAITING_FOR_REDIRECTION() {return "onWaitingForRedirection"};

	constructor()
	{
		super();

		this._nemDialogController = null;
	}

	__initControlLevel()
	{
		super.__initControlLevel();

		let lobbyScreen = APP.lobbyScreen;
		lobbyScreen.on(LobbyScreen.EVENT_ON_LOBBY_CASHIER_CLICKED, this._onLobbyCashierBtnClicked, this);

		let dialogsController = APP.dialogsController;
		let nemDialogController = this._nemDialogController = dialogsController.gameNEMDialogController;
		nemDialogController.on(DialogController.EVENT_REQUEST_CONFIRMED, this._onNEMDialogConfirmed, this);

		dialogsController.lobbyNEMDialogController.on(DialogController.EVENT_REQUEST_CONFIRMED, this._onLobbyNEMDialogConfirmed, this);

		dialogsController.criticalErrorDialogController.on(DialogController.EVENT_ON_DLG_CUSTOM_BTN_CLICKED, this._onCriticalErrorDialogConfirmed, this);
		dialogsController.gameCriticalErrorDialogController.on(DialogController.EVENT_ON_DLG_CUSTOM_BTN_CLICKED, this._onCriticalErrorDialogConfirmed, this);
		dialogsController.lobbyRebuyDialogController.on(DialogController.EVENT_REQUEST_CONFIRMED, this._onRebuyDialogRequestConfirmed, this);
		dialogsController.gameRebuyDialogController.on(DialogController.EVENT_REQUEST_CONFIRMED, this._onRebuyDialogRequestConfirmed, this);
	}

	_onLobbyCashierBtnClicked(event)
	{
		// this.emit(LobbyJSEnvironmentInteractionController.EVENT_WAITING_FOR_REDIRECTION);

		if (APP.buyInFuncDefined)
		{
			this.callWindowMethod(APP.buyInFuncName);
		}
	}

	_onLobbyNEMDialogConfirmed(event)
	{
		if (!APP.buyInFuncDefined)
		{
			return;
		}

		this.callWindowMethod(APP.buyInFuncName);
	}

	_onNEMDialogConfirmed(event)
	{
		if (this._nemDialogController.info.isFRBMode)
		{
			return;
		}

		if (
				this._nemDialogController.info.isFreeMoneyMode
				|| !APP.buyInFuncDefined
				|| APP.lobbyBonusController.info.isActivated
			)
		{
			return;
		}

		// this.emit(LobbyJSEnvironmentInteractionController.EVENT_WAITING_FOR_REDIRECTION);

		this.callWindowMethod(APP.buyInFuncName);
	}

	_onCriticalErrorDialogConfirmed(event)
	{
		if (APP.appParamsInfo.closeErrorFuncNameDefined)
		{
			this.callWindowMethod(APP.appParamsInfo.closeErrorFuncName);
		}
	}

	_onRebuyDialogRequestConfirmed(event)
	{
		let lTournamentModeinfo_tmi = APP.tournamentModeController.info;		
		let lAppParams = APP.appParamsInfo;

		if (
				lTournamentModeinfo_tmi.isTournamentMode
				&& (!lTournamentModeinfo_tmi.rebuyAllowed || lTournamentModeinfo_tmi.isRebuyLimitExceeded)
				&& lAppParams.homeFuncNameDefined
			)
		{
			let lHomeFuncName_str = lAppParams.homeFuncName;
			if (lHomeFuncName_str)
			{
				this.callWindowMethod(lHomeFuncName_str);
			}
		}
	}

}

export default LobbyJSEnvironmentInteractionController