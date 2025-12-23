import SimpleUIInfo from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/uis/SimpleUIInfo';
import DialogInfo from './DialogInfo';
import NetworkErrorDialogInfo from './custom/NetworkErrorDialogInfo';
import GameNetworkErrorDialogInfo from './custom/game/GameNetworkErrorDialogInfo';
import CriticalErrorDialogInfo from './custom/CriticalErrorDialogInfo';
import GameCriticalErrorDialogInfo from './custom/game/GameCriticalErrorDialogInfo';
import ReconnectDialogInfo from './custom/ReconnectDialogInfo';
import GameReconnectDialogInfo from './custom/game/GameReconnectDialogInfo';
import GameRoomReopenDialogInfo from './custom/game/GameRoomReopenDialogInfo';
import RoomNotFoundDialogInfo from './custom/RoomNotFoundDialogInfo';
import GameNEMDialogInfo from './custom/game/GameNEMDialogInfo';
import RedirectionDialogInfo from './custom/RedirectionDialogInfo';
import GameBuyAmmoFailedDialogInfo from './custom/game/GameBuyAmmoFailedDialogInfo';
import ReturnToGameDialogInfo from './custom/ReturnToGameDialogInfo';
import GameForceSitOutDialogInfo from './custom/game/GameForceSitOutDialogInfo';
import GameMidCompensateSWDialogInfo from './custom/game/GameMidCompensateSWDialogInfo';
import GamePicksUpSpecialWeaponsFirstTimeDialogInfo from './custom/game/GamePicksUpSpecialWeaponsFirstTimeDialogInfo';
import GameMidRoundExitDialogInfo from './custom/game/GameMidRoundExitDialogInfo';
import RuntimeErrorDialogInfo from './custom/RuntimeErrorDialogInfo';
import BonusDialogInfo from './custom/BonusDialogInfo';
import FRBDialogInfo from './custom/FRBDialogInfo';
import TournamentStateDialogInfo from './custom/TournamentStateDialogInfo';
import GameRebuyDialogInfo from './custom/game/GameRebuyDialogInfo';
import GameNEMForRoomDialogInfo from './custom/game/GameNEMForRoomDialogInfo';
import LobbyRebuyDialogInfo from './custom/LobbyRebuyDialogInfo';
import LobbyNEMDialogInfo from './custom/LobbyNEMDialogInfo';
import LobbyRebuyFailedDialogInfo from './custom/LobbyRebuyFailedDialogInfo';
import GameRoundResultReturnedSWDialogInfo from './custom/game/GameRoundResultReturnedSWDialogInfo';
import GameSWPurchaseLimitExceededDialogInfo from './custom/game/GameSWPurchaseLimitExceededDialogInfo';
import LobbyInsufficientFundsDialogInfo from './custom/LobbyInsufficientFundsDialogInfo';

let dialogIdCounter = 0;

let DIALOG_ID_NETWORK_ERROR 						= dialogIdCounter++; //0
let DIALOG_ID_GAME_NETWORK_ERROR 					= dialogIdCounter++; //1
let DIALOG_ID_CRITICAL_ERROR 						= dialogIdCounter++; //2
let DIALOG_ID_GAME_CRITICAL_ERROR 					= dialogIdCounter++; //3
let DIALOG_ID_RECONNECT 							= dialogIdCounter++; //4
let DIALOG_ID_GAME_RECONNECT 						= dialogIdCounter++; //5
let DIALOG_ID_GAME_ROOM_REOPEN 						= dialogIdCounter++; //6
let DIALOG_ID_ROOM_NOT_FOUND 						= dialogIdCounter++; //7
let DIALOG_ID_GAME_NEM 								= dialogIdCounter++; //8 	//not enough money
let DIALOG_ID_REDIRECTION 							= dialogIdCounter++; //9
let DIALOG_ID_RETURN_TO_GAME 						= dialogIdCounter++; //10
let DIALOG_ID_FORCE_SIT_OUT							= dialogIdCounter++; //11
let DIALOG_ID_MID_ROUND_COMPENSATE_SW 				= dialogIdCounter++; //12
let DIALOG_ID_PICKS_UP_SPECIAL_WEAPONS_FIRST_TIME 	= dialogIdCounter++; //13
let DIALOG_ID_MID_ROUND_EXIT 						= dialogIdCounter++; //14
let DIALOG_ID_GAME_BUY_AMMO_FAILED	 				= dialogIdCounter++; //15
let DIALOG_ID_WEBGL_CONTEXT_LOST					= dialogIdCounter++; //16
let DIALOG_ID_RUNTIME_ERROR 						= dialogIdCounter++; //17
let DIALOG_ID_BONUS 								= dialogIdCounter++; //19
let DIALOG_ID_FRB									= dialogIdCounter++; //21
let DIALOG_ID_TOURNAMENT_STATE						= dialogIdCounter++; //22
let DIALOG_ID_GAME_REBUY							= dialogIdCounter++; //23
let DIALOG_ID_GAME_NEM_FOR_ROOM						= dialogIdCounter++; //23
let DIALOG_ID_LOBBY_REBUY							= dialogIdCounter++; //24
let DIALOG_ID_LOBBY_NEM								= dialogIdCounter++; //25
let DIALOG_ID_LOBBY_REBUY_FAILED					= dialogIdCounter++; //26
let DIALOG_ID_RR_RETURNED_SW						= dialogIdCounter++; //27
let DIALOG_ID_GAME_SW_PURCHASE_LIMIT_EXCEEDED		= dialogIdCounter++; //28
let DIALOG_ID_INSUFFICIENT_FUNDS					= dialogIdCounter++; //29

let DIALOGS_AMOUNT = dialogIdCounter;

class DialogsInfo extends SimpleUIInfo
{
	static get DIALOG_ID_NETWORK_ERROR() 							{ return DIALOG_ID_NETWORK_ERROR;}
	static get DIALOG_ID_GAME_NETWORK_ERROR() 						{ return DIALOG_ID_GAME_NETWORK_ERROR;}
	static get DIALOG_ID_CRITICAL_ERROR() 							{ return DIALOG_ID_CRITICAL_ERROR;}
	static get DIALOG_ID_GAME_CRITICAL_ERROR() 						{ return DIALOG_ID_GAME_CRITICAL_ERROR;}
	static get DIALOG_ID_RECONNECT() 								{ return DIALOG_ID_RECONNECT;}
	static get DIALOG_ID_GAME_RECONNECT() 							{ return DIALOG_ID_GAME_RECONNECT;}
	static get DIALOG_ID_GAME_ROOM_REOPEN() 						{ return DIALOG_ID_GAME_ROOM_REOPEN;}
	static get DIALOG_ID_ROOM_NOT_FOUND() 							{ return DIALOG_ID_ROOM_NOT_FOUND;}
	static get DIALOG_ID_GAME_NEM() 								{ return DIALOG_ID_GAME_NEM;}
	static get DIALOG_ID_REDIRECTION() 								{ return DIALOG_ID_REDIRECTION;}
	static get DIALOG_ID_RETURN_TO_GAME() 							{ return DIALOG_ID_RETURN_TO_GAME;}
	static get DIALOG_ID_FORCE_SIT_OUT() 							{ return DIALOG_ID_FORCE_SIT_OUT;}
	static get DIALOG_ID_MID_ROUND_COMPENSATE_SW() 					{ return DIALOG_ID_MID_ROUND_COMPENSATE_SW;}
	static get DIALOG_ID_PICKS_UP_SPECIAL_WEAPONS_FIRST_TIME() 		{ return DIALOG_ID_PICKS_UP_SPECIAL_WEAPONS_FIRST_TIME;}
	static get DIALOG_ID_MID_ROUND_EXIT() 							{ return DIALOG_ID_MID_ROUND_EXIT;}
	static get DIALOG_ID_GAME_BUY_AMMO_FAILED() 					{ return DIALOG_ID_GAME_BUY_AMMO_FAILED;}
	static get DIALOG_ID_WEBGL_CONTEXT_LOST() 						{ return DIALOG_ID_WEBGL_CONTEXT_LOST;}
	static get DIALOG_ID_RUNTIME_ERROR() 							{ return DIALOG_ID_RUNTIME_ERROR;}
	static get DIALOG_ID_BONUS() 								 	{ return DIALOG_ID_BONUS;}
	static get DIALOG_ID_FRB()										{ return DIALOG_ID_FRB;}
	static get DIALOG_ID_TOURNAMENT_STATE() 						{ return DIALOG_ID_TOURNAMENT_STATE;}
	static get DIALOG_ID_GAME_REBUY() 								{ return DIALOG_ID_GAME_REBUY;}	
	static get DIALOG_ID_GAME_NEM_FOR_ROOM() 						{ return DIALOG_ID_GAME_NEM_FOR_ROOM;}	
	static get DIALOG_ID_LOBBY_REBUY() 								{ return DIALOG_ID_LOBBY_REBUY;}
	static get DIALOG_ID_LOBBY_NEM() 								{ return DIALOG_ID_LOBBY_NEM;}
	static get DIALOG_ID_LOBBY_REBUY_FAILED() 						{ return DIALOG_ID_LOBBY_REBUY_FAILED;}
	static get DIALOG_ID_RR_RETURNED_SW() 							{ return DIALOG_ID_RR_RETURNED_SW;}	
	static get DIALOG_ID_GAME_SW_PURCHASE_LIMIT_EXCEEDED() 			{ return DIALOG_ID_GAME_SW_PURCHASE_LIMIT_EXCEEDED; }
	static get DIALOG_ID_INSUFFICIENT_FUNDS() 						{ return DIALOG_ID_INSUFFICIENT_FUNDS; }

	static get CRITICAL_DIALOGS_IDS() 								{ return [
																			DialogsInfo.DIALOG_ID_NETWORK_ERROR,
																			DialogsInfo.DIALOG_ID_GAME_NETWORK_ERROR,
																			DialogsInfo.DIALOG_ID_CRITICAL_ERROR,
																			DialogsInfo.DIALOG_ID_GAME_CRITICAL_ERROR,
																			DialogsInfo.DIALOG_ID_WEBGL_CONTEXT_LOST,
																			DialogsInfo.DIALOG_ID_RUNTIME_ERROR,
																			DialogsInfo.DIALOG_ID_TOURNAMENT_STATE
																		];
																	}

	constructor()
	{
		super();

		this._dialogsInfos = null;
		this._dialogIdForPresentation = undefined;

		this._initDialogsInfo();
	}

	destroy()
	{
		this._dialogsInfos = null;

		super.destroy();
	}

	getDialogInfo (dialogId)
	{
		return this._getDialogInfo(dialogId);
	}

	get dialogsCount ()
	{
		return DIALOGS_AMOUNT;
	}

	get dialogIdForPresentation ()
	{
		return this._dialogIdForPresentation;
	}

	set dialogIdForPresentation (dialogId)
	{
		this._dialogIdForPresentation = dialogId;
	}

	get hasActiveDialog ()
	{
		var dialogsAmount = this.dialogsCount;
		for (var i = 0; i < dialogsAmount; i++)
		{
			if (this._getDialogInfo(i).isActive)
			{
				return true;
			}
		}
		return false;
	}

	get hasActiveCriticalDialog ()
	{
		var dialogsAmount = this.dialogsCount;
		for (var i = 0; i < dialogsAmount; i++)
		{
			if (this._getDialogInfo(i).isActive)
			{
				const dialogId = this._getDialogInfo(i).dialogId;
				if (~DialogsInfo.CRITICAL_DIALOGS_IDS.indexOf(dialogId))
				{
					return true;
				}
				return false;
			}
		}
		return false;
	}

	_initDialogsInfo()
	{
		this._dialogsInfos = [];
	}

	_getDialogInfo (dialogId)
	{
		return this._dialogsInfos[dialogId] || this._initDialogInfo(dialogId);
	}

	_initDialogInfo (dialogId)
	{
		var dialogInfo = this.__generateDialogInfo(dialogId);

		this._dialogsInfos[dialogId] = dialogInfo;

		return dialogInfo;
	}

	__generateDialogInfo (dialogId)
	{
		var dialogInfo = null;
		switch (dialogId)
		{
			case DIALOG_ID_NETWORK_ERROR:
				dialogInfo = new NetworkErrorDialogInfo(dialogId, 1);
				break;
			case DIALOG_ID_GAME_NETWORK_ERROR:
				dialogInfo = new GameNetworkErrorDialogInfo(dialogId, 1);
				break;
			case DIALOG_ID_CRITICAL_ERROR:
				dialogInfo = new CriticalErrorDialogInfo(dialogId, 1);
				break;
			case DIALOG_ID_GAME_CRITICAL_ERROR:
				dialogInfo = new GameCriticalErrorDialogInfo(dialogId, 1);
				break;
			case DIALOG_ID_RECONNECT:
				dialogInfo = new ReconnectDialogInfo(dialogId, 0.9);
				break;
			case DIALOG_ID_GAME_RECONNECT:
				dialogInfo = new GameReconnectDialogInfo(dialogId, 0.8);
				break;
			case DIALOG_ID_GAME_ROOM_REOPEN:
				dialogInfo = new GameRoomReopenDialogInfo(dialogId, 0.1);
				break;
			case DIALOG_ID_ROOM_NOT_FOUND:
				dialogInfo = new RoomNotFoundDialogInfo(dialogId, 0.1);
				break;
			case DIALOG_ID_GAME_NEM:
				dialogInfo = new GameNEMDialogInfo(dialogId, 0);
				break;
			case DIALOG_ID_REDIRECTION:
				dialogInfo = new RedirectionDialogInfo(dialogId, 4);
				break;
			case DIALOG_ID_GAME_BUY_AMMO_FAILED:
				dialogInfo = new GameBuyAmmoFailedDialogInfo(dialogId, 0);
				break;
			case DIALOG_ID_RETURN_TO_GAME:
				dialogInfo = new ReturnToGameDialogInfo(dialogId, 0);
				break;
			case DIALOG_ID_FORCE_SIT_OUT:
				dialogInfo = new GameForceSitOutDialogInfo(dialogId, 0.15);
				break;
			case DIALOG_ID_MID_ROUND_COMPENSATE_SW:
				dialogInfo = new GameMidCompensateSWDialogInfo(dialogId, 0.15);
				break;
			case DIALOG_ID_PICKS_UP_SPECIAL_WEAPONS_FIRST_TIME:
				dialogInfo = new GamePicksUpSpecialWeaponsFirstTimeDialogInfo(dialogId, 0);
				break;
			case DIALOG_ID_MID_ROUND_EXIT:
				dialogInfo = new GameMidRoundExitDialogInfo(dialogId, 0);
				break;
			case DIALOG_ID_WEBGL_CONTEXT_LOST:
				dialogInfo = new DialogInfo(dialogId, 5); // the highest priority
				break;
			case DIALOG_ID_RUNTIME_ERROR:
				dialogInfo = new RuntimeErrorDialogInfo(dialogId, 6); //the highest priority
				break;
			case DIALOG_ID_BONUS:
				dialogInfo = new BonusDialogInfo(dialogId, 0.1);
				break;
			case DIALOG_ID_FRB:
				dialogInfo = new FRBDialogInfo(dialogId, 0.1);
				break;
			case DIALOG_ID_TOURNAMENT_STATE:
				dialogInfo = new TournamentStateDialogInfo(dialogId, 1); // the same priority as for critical error dialogs
				break;
			case DIALOG_ID_GAME_REBUY:
				dialogInfo = new GameRebuyDialogInfo(dialogId, 0); // the same priority as for NEM dlg
				break;
			case DIALOG_ID_LOBBY_REBUY:
				dialogInfo = new LobbyRebuyDialogInfo(dialogId, 0.01); // priority higher than for GAME_REBUY dlg
				break;
			case DIALOG_ID_GAME_NEM_FOR_ROOM:
				dialogInfo = new GameNEMForRoomDialogInfo(dialogId, 0); // the same priority as for REBUY dlg
				break;
			case DIALOG_ID_LOBBY_NEM:
				dialogInfo = new LobbyNEMDialogInfo(dialogId, 0.01); // priority higher than for GAME_REBUY dlg
				break;
			case DIALOG_ID_LOBBY_REBUY_FAILED:
				dialogInfo = new LobbyRebuyFailedDialogInfo(dialogId, 0.01);
				break;
			case DIALOG_ID_RR_RETURNED_SW:
				dialogInfo = new GameRoundResultReturnedSWDialogInfo(dialogId, 0.15);
				break;
			case DIALOG_ID_GAME_SW_PURCHASE_LIMIT_EXCEEDED:
				dialogInfo = new GameSWPurchaseLimitExceededDialogInfo(dialogId, 0); // the same priority as for NEM dlg
				break;
			case DIALOG_ID_INSUFFICIENT_FUNDS:
				dialogInfo = new LobbyInsufficientFundsDialogInfo(dialogId, -1);
				break;
			default:
				throw new Error (`Unsupported dialog id: ${dialogId}`);
		}
		return dialogInfo;
	}
}

export default DialogsInfo