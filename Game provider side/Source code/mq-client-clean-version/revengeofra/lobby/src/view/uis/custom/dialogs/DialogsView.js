import SimpleUIView from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/SimpleUIView';
import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import DialogsInfo from '../../../../model/uis/custom/dialogs/DialogsInfo';
import DialogView from './DialogView';
import RedirectionDialogView from './custom/RedirectionDialogView';
import NEMDialogView from './custom/game/NEMDialogView';
import CriticalErrorDialogView from './custom/CriticalErrorDialogView';
import ReturnToGameDialogView from './custom/ReturnToGameDialogView';
import LobbySoundButtonView from '../secondary/LobbySoundButtonView';
import GameForceSitOutDialogView from './custom/game/GameForceSitOutDialogView';
import GameMidCompensateSWView from './custom/game/GameMidCompensateSWView';
import GamePicksUpSpecialWeaponsFirstTimeDialogView from './custom/game/GamePicksUpSpecialWeaponsFirstTimeDialogView';
import GameMidRoundExitDialogView from './custom/game/GameMidRoundExitDialogView';
import RuntimeErrorDialogView from './custom/RuntimeErrorDialogView';
import BonusDialogView from './custom/BonusDialogView';
import FRBDialogView from './custom/FRBDialogView';
import GameRebuyDialogView from './custom/game/GameRebuyDialogView';
import GameRoundResultReturnedSWDialogView from './custom/game/GameRoundResultReturnedSWDialogView';
import LobbyInsufficientFundsDialogView from './custom/LobbyInsufficientFundsDialogView';

class DialogsView extends SimpleUIView
{
	get soundButtonView()
	{
		return this._soundButtonView;
	}

	constructor()
	{
		super();

		this.dialogsViews = null;

		this._initDialogsView();
	}

	destroy()
	{
		this.dialogsViews = null;

		super.destroy();
	}

	get networkErrorDialogView ()
	{
		return this._networkErrorDialogView;
	}

	get gameNetworkErrorDialogView ()
	{
		return this._gameNetworkErrorDialogView;
	}

	get criticalErrorDialogView ()
	{
		return this._criticalErrorDialogView;
	}

	get gameCriticalErrorDialogView ()
	{
		return this._gameCriticalErrorDialogView;
	}

	get reconnectDialogView ()
	{
		return this._reconnectDialogView;
	}

	get gameReconnectDialogView ()
	{
		return this._gameReconnectDialogView;
	}

	get gameRoomReopenDialogView ()
	{
		return this._gameRoomReopenDialogView;
	}

	get roomNotFoundDialogView ()
	{
		return this._roomNotFoundDialogView;
	}

	get gameNEMDialogView ()
	{
		return this._gameNEMDialogView;
	}

	get redirectionDialogView ()
	{
		return this._redirectionDialogView;
	}

	get gameBuyAmmoFailedDialogView ()
	{
		return this._gameBuyAmmoFailedDialogView;
	}

	get gameForceSitOutDialogView()
	{
		return this._gameForceSitOutDialogView;
	}

	get returnToGameDialogView()
	{
		return this._returnToGameDialogView;
	}

	get roundResultReturnedSWDialogView()
	{
		return this._roundResultReturnedSWDialogView;
	}

	get midCompensateSWDialogView()
	{
		return this._midCompensateSWDialogView;
	}

	get picksUpSpecialWeaponsFirstTimeDialogView()
	{
		return this._picksUpSpecialWeaponsFirstTimeDialogView;
	}

	get midRoundExitDialogView()
	{
		return this._midRoundExitDialogView;
	}

	get webglContextLostDialogView ()
	{
		return this._webglContextLostDialogView;
	}

	get bonusDialogView()
	{
		return this._bonusDialogView;
	}

	get FRBDialogView ()
	{
		return this._FRBDialogView;
	}

	get tournamentStateDialogView ()
	{
		return this._tournamentStateDialogView;
	}

	get gameRebuyDialogView ()
	{
		return this._gameRebuyDialogView;
	}

	get gameNEMForRoomDialogView()
	{
		return this._gameNEMForRoomDialogView;
	}

	get lobbyRebuyDialogView ()
	{
		return this._lobbyRebuyDialogView;
	}

	get lobbyNEMDialogView ()
	{
		return this._lobbyNEMDialogView;
	}

	get lobbyRebuyFailedDialogView ()
	{
		return this._lobbyRebuyFailedDialogView;
	}

	get gameSWPurchaseLimitExceededDialogView()
	{
		return this._gameSWPurchaseLimitExceededDialogView;
	}

	get insufficientFundsDialogView()
	{
		return this._insufficientFundsDialogView;
	}

	getDialogView (dialogId)
	{
		return this.__getDialogView(dialogId);
	}

	_initDialogsView()
	{
		this.dialogsViews = [];
	}

	__getDialogView (dialogId)
	{
		return this.dialogsViews[dialogId] || this._initDialogView(dialogId);
	}

	_initDialogView (dialogId)
	{
		var dialogView = this.__generateDialogView(dialogId);

		this.dialogsViews[dialogId] = dialogView;
		this.addChild(dialogView);

		return dialogView;
	}

	__generateDialogView (dialogId)
	{
		var dialogView;
		switch (dialogId)
		{
			case DialogsInfo.DIALOG_ID_NETWORK_ERROR:
			case DialogsInfo.DIALOG_ID_GAME_NETWORK_ERROR:
			case DialogsInfo.DIALOG_ID_RECONNECT:
			case DialogsInfo.DIALOG_ID_GAME_RECONNECT:
			case DialogsInfo.DIALOG_ID_GAME_ROOM_REOPEN:
			case DialogsInfo.DIALOG_ID_ROOM_NOT_FOUND:
			case DialogsInfo.DIALOG_ID_GAME_BUY_AMMO_FAILED:
			case DialogsInfo.DIALOG_ID_WEBGL_CONTEXT_LOST:
			case DialogsInfo.DIALOG_ID_TOURNAMENT_STATE:
			case DialogsInfo.DIALOG_ID_TOURNAMENT_STATE:
			case DialogsInfo.DIALOG_ID_GAME_NEM_FOR_ROOM:
			case DialogsInfo.DIALOG_ID_LOBBY_REBUY_FAILED:
			case DialogsInfo.DIALOG_ID_GAME_SW_PURCHASE_LIMIT_EXCEEDED:
				dialogView = new DialogView();
				break;
			case DialogsInfo.DIALOG_ID_CRITICAL_ERROR:
			case DialogsInfo.DIALOG_ID_GAME_CRITICAL_ERROR:
				dialogView = new CriticalErrorDialogView();
				break;
			case DialogsInfo.DIALOG_ID_REDIRECTION:
				dialogView = new RedirectionDialogView();
				break;
			case DialogsInfo.DIALOG_ID_GAME_NEM:
			case DialogsInfo.DIALOG_ID_LOBBY_NEM:
				dialogView = new NEMDialogView();
				break;
			case DialogsInfo.DIALOG_ID_RETURN_TO_GAME:
				dialogView = new ReturnToGameDialogView();
				break;
			case DialogsInfo.DIALOG_ID_FORCE_SIT_OUT:
				dialogView = new GameForceSitOutDialogView();
				break;
			case DialogsInfo.DIALOG_ID_MID_ROUND_COMPENSATE_SW:
				dialogView = new GameMidCompensateSWView();
				break;
			case DialogsInfo.DIALOG_ID_PICKS_UP_SPECIAL_WEAPONS_FIRST_TIME:
				dialogView = new GamePicksUpSpecialWeaponsFirstTimeDialogView();
				break;
			case DialogsInfo.DIALOG_ID_MID_ROUND_EXIT:
				dialogView = new GameMidRoundExitDialogView();
				break;
			case DialogsInfo.DIALOG_ID_RUNTIME_ERROR:
				dialogView = new RuntimeErrorDialogView();
				break;
			case DialogsInfo.DIALOG_ID_BONUS:
				dialogView = new BonusDialogView();
				break;
			case DialogsInfo.DIALOG_ID_FRB:
				dialogView = new FRBDialogView();
				break;
			case DialogsInfo.DIALOG_ID_GAME_REBUY:
			case DialogsInfo.DIALOG_ID_LOBBY_REBUY:
				dialogView = new GameRebuyDialogView();
				break;
			case DialogsInfo.DIALOG_ID_RR_RETURNED_SW:
				dialogView = new GameRoundResultReturnedSWDialogView();
				break;
			case DialogsInfo.DIALOG_ID_INSUFFICIENT_FUNDS:
				dialogView = new LobbyInsufficientFundsDialogView();
				break;
			default:
				throw new Error (`Unsupported dialog id: ${dialogId}`);
		}
		return dialogView;
	}

	//SOUND_BUTTON...
	get _soundButtonView()
	{
		return this._fSoundButtonView_sbv || (this._fSoundButtonView_sbv = this._initSoundButtonView());
	}

	_initSoundButtonView()
	{
		let l_sbv = new LobbySoundButtonView(false, 1);

		return l_sbv;
	}
	//...SOUND_BUTTON

	get _networkErrorDialogView()
	{
		return this.__getDialogView(DialogsInfo.DIALOG_ID_NETWORK_ERROR);
	}

	get _gameNetworkErrorDialogView()
	{
		return this.__getDialogView(DialogsInfo.DIALOG_ID_GAME_NETWORK_ERROR);
	}

	get _criticalErrorDialogView()
	{
		return this.__getDialogView(DialogsInfo.DIALOG_ID_CRITICAL_ERROR);
	}

	get _gameCriticalErrorDialogView()
	{
		return this.__getDialogView(DialogsInfo.DIALOG_ID_GAME_CRITICAL_ERROR);
	}

	get _reconnectDialogView()
	{
		return this.__getDialogView(DialogsInfo.DIALOG_ID_RECONNECT);
	}

	get _gameReconnectDialogView()
	{
		return this.__getDialogView(DialogsInfo.DIALOG_ID_GAME_RECONNECT);
	}

	get _gameRoomReopenDialogView()
	{
		return this.__getDialogView(DialogsInfo.DIALOG_ID_GAME_ROOM_REOPEN);
	}

	get _roomNotFoundDialogView()
	{
		return this.__getDialogView(DialogsInfo.DIALOG_ID_ROOM_NOT_FOUND);
	}

	get _gameNEMDialogView()
	{
		return this.__getDialogView(DialogsInfo.DIALOG_ID_GAME_NEM);
	}

	get _redirectionDialogView()
	{
		return this.__getDialogView(DialogsInfo.DIALOG_ID_REDIRECTION);
	}

	get _gameBuyAmmoFailedDialogView()
	{
		return this.__getDialogView(DialogsInfo.DIALOG_ID_GAME_BUY_AMMO_FAILED);
	}

	get _gameForceSitOutDialogView()
	{
		return this.__getDialogView(DialogsInfo.DIALOG_ID_FORCE_SIT_OUT);
	}

	get _returnToGameDialogView()
	{
		return this.__getDialogView(DialogsInfo.DIALOG_ID_RETURN_TO_GAME);
	}

	get _roundResultReturnedSWDialogView()
	{
		return this.__getDialogView(DialogsInfo.DIALOG_ID_RR_RETURNED_SW);
	}

	get _midCompensateSWDialogView()
	{
		return this.__getDialogView(DialogsInfo.DIALOG_ID_MID_ROUND_COMPENSATE_SW);
	}

	get _picksUpSpecialWeaponsFirstTimeDialogView()
	{
		return this.__getDialogView(DialogsInfo.DIALOG_ID_PICKS_UP_SPECIAL_WEAPONS_FIRST_TIME);
	}

	get _midRoundExitDialogView()
	{
		return this.__getDialogView(DialogsInfo.DIALOG_ID_MID_ROUND_EXIT);
	}

	get _webglContextLostDialogView()
	{
		return this.__getDialogView(DialogsInfo.DIALOG_ID_WEBGL_CONTEXT_LOST);
	}

	get runtimeErrorDialogView()
	{
		return this.__getDialogView(DialogsInfo.DIALOG_ID_RUNTIME_ERROR);
	}

	get bonusDialogView()
	{
		return this.__getDialogView(DialogsInfo.DIALOG_ID_BONUS);
	}

	get _FRBDialogView()
	{
		return this.__getDialogView(DialogsInfo.DIALOG_ID_FRB);
	}

	get _tournamentStateDialogView()
	{
		return this.__getDialogView(DialogsInfo.DIALOG_ID_TOURNAMENT_STATE);
	}

	get _gameRebuyDialogView()
	{
		return this.__getDialogView(DialogsInfo.DIALOG_ID_GAME_REBUY);
	}
	
	get _lobbyRebuyDialogView()
	{
		return this.__getDialogView(DialogsInfo.DIALOG_ID_LOBBY_REBUY);
	}

	get _gameNEMForRoomDialogView()
	{
		return this.__getDialogView(DialogsInfo.DIALOG_ID_GAME_NEM_FOR_ROOM);
	}

	get _lobbyNEMDialogView()
	{
		return this.__getDialogView(DialogsInfo.DIALOG_ID_LOBBY_NEM);
	}

	get _lobbyRebuyFailedDialogView()
	{
		return this.__getDialogView(DialogsInfo.DIALOG_ID_LOBBY_REBUY_FAILED);
	}

	get _gameSWPurchaseLimitExceededDialogView()
	{
		return this.__getDialogView(DialogsInfo.DIALOG_ID_GAME_SW_PURCHASE_LIMIT_EXCEEDED);
	}

	get _insufficientFundsDialogView()
	{
		return this.__getDialogView(DialogsInfo.DIALOG_ID_INSUFFICIENT_FUNDS);
	}
}

export default DialogsView;