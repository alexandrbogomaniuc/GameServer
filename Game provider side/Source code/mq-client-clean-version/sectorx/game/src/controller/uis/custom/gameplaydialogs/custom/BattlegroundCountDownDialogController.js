import GameplayDialogController from '../GameplayDialogController';
import GameplayDialogsController from '../GameplayDialogsController';
import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import GameWebSocketInteractionController from '../../../../interaction/server/GameWebSocketInteractionController';
import GameExternalCommunicator from '../../../../../controller/external/GameExternalCommunicator';
import PlayerInfo from '../../../../../../../../common/PIXI/src/dgphoenix/unified/model/custom/PlayerInfo';
import BattlegroundGameController from '../../../battleground/BattlegroundGameController';
import { GAME_MESSAGES, LOBBY_MESSAGES } from '../../../../../../../../common/PIXI/src/dgphoenix/gunified/controller/external/GUSGameExternalCommunicator';
import BattlegroundFinalCountingController from '../../../final_counting/BattlegroundFinalCountingController';
import GameScreen from '../../../../../main/GameScreen';
import { ROUND_STATE } from '../../../../../model/state/GameStateInfo';

const REQUEST_TIMEOUT = 730;

class BattlegroundCountDownDialogController extends GameplayDialogController
{
	static get EVENT_DIALOG_PRESENTED () { return GameplayDialogController.EVENT_DIALOG_PRESENTED };
	static get EVENT_COUNT_DOWN_DIALOG_ACTIVATED () { return "EVENT_COUNT_DOWN_DIALOG_ACTIVATED" };
	static get EVENT_COUNT_DOWN_DIALOG_DEACTIVATED () { return "EVENT_COUNT_DOWN_DIALOG_DEACTIVATED" };
	static get EVENT_PRESENTED_DIALOG_UPDATED () { return GameplayDialogController.EVENT_PRESENTED_DIALOG_UPDATED };
	static get EVENT_BATTLEGROUND_COUNTDOWN_CANCEL_CLICKED() { return "EVENT_BATTLEGROUND_COUNTDOWN_CANCEL_CLICKED" };

	constructor(aOptInfo_usuii, parentController)
	{
		super(aOptInfo_usuii, undefined, parentController);

		this._fTournamentModeInfo_tni = null;
		this._fInterval = null;

		this._fCancelTime = null;
		this._fIsUpdateCancelTimeResponse = null;

		this._fIsSecondaryScreenActivate = null;
		this._fIsFireSettingsMobileActivate = null;

		this._initBattlegroundCountDownDialogController();
	}

	_initBattlegroundCountDownDialogController()
	{
	}

	__init ()
	{
		super.__init();
	}

	__getExternalViewForSelfInitialization()
	{
		return this.__getViewLevelSelfInitializationViewProvider().battlegroundCountDownDialogView;
	}

	__initModelLevel ()
	{
		super.__initModelLevel();

		this._fTournamentModeInfo_tni = APP.tournamentModeController.info;
	}

	__initControlLevel ()
	{
		if (!APP.isBattlegroundGame)
		{
			return;
		}

		super.__initControlLevel();

		let webSocketInteractionController = APP.webSocketInteractionController;
		webSocketInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_ERROR_MESSAGE, this._onServerErrorMessage, this);
		webSocketInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_CANCEL_BATTLEGROUND_ROUND, this._onCancelBattlegroundRound, this);

		let externalCommunicator = APP.externalCommunicator;
		externalCommunicator.on(GameExternalCommunicator.LOBBY_MESSAGE_RECEIVED, this._onLobbyMessageReceived, this);

		APP.gameScreen.battlegroundGameController.on(BattlegroundGameController.EVENT_BATTLEGROUND_WAITING_TIME_IS_OUT, this._onTimeIsOut, this);
		APP.gameScreen.battlegroundGameController.on(BattlegroundGameController.EVENT_BATTLEGROUND_COUNT_DOWN_REQUIRED, this._onCountDownPanelReopened, this);
		APP.gameScreen.battlegroundGameController.on(BattlegroundGameController.EVENT_BATTLEGROUND_COUNT_DOWN_HIDE_REQUIRED, this._onCountDownPanelHide, this);

		APP.gameScreen.on(GameScreen.EVENT_BATTLEGROUND_TIME_TO_START_UPDATED, this._onTimeToStartUpdated, this);
		APP.gameScreen.on(GameScreen.EVENT_ON_SIT_IN_COUNT_DOWN_REQUIRED, this._onTimeToStartUpdated, this);
		APP.gameScreen.on(GameScreen.EVENT_ON_BATTLEGROUND_ROUND_CANCELED, this._onCancelBattlegroundRound, this);


		APP.gameScreen.gameFieldController.battlegroundFinalCountingController.on(GameScreen.EVENT_ON_BATTLEGROUND_FINAL_COUNTING_STARTED, this._onFinalCounting, this);

		//GAME_MESSAGES.GAME_STARTED
		// DEBUG...
		//window.addEventListener("keydown", this.keyDownHandler.bind(this), false);
		// ...DEBUG
	}

	//DEBUG...
	/*keyDownHandler(keyCode)
	{
		if (keyCode.keyCode == 69) //e
		{
			this.__activateDialog();
		}
	}*/
	//...DEBUG

	_onLobbyMessageReceived(event)
	{
		switch (event.type)
		{
			case LOBBY_MESSAGES.BATTLEGROUND_RE_BUY_CONFIRMED:
				this._fIsUpdateCancelTimeResponse = true;

				this._fIsSecondaryScreenActivate = false;
				this._fIsFireSettingsMobileActivate = false;
				
				this.__activateDialog();
			break;
			case LOBBY_MESSAGES.BACK_TO_LOBBY:
				this.__deactivateDialog();
			break;
			case LOBBY_MESSAGES.BATTLEGROUND_COUNTDOWN_HIDE:
				this._fIsSecondaryScreenActivate = true;
				this.__deactivateDialog();
			break;
			case LOBBY_MESSAGES.BATTLEGROUND_COUNTDOWN_SHOW:
				this._fIsSecondaryScreenActivate = false;
				this.__activateDialog();
			break;
		}
	}

	__onDialogCancelButtonClicked(event)
	{
		let lBattleGroundGameInfo_bgi = APP.gameScreen.battlegroundGameController.info;
		let delta = this._fCancelTime - lBattleGroundGameInfo_bgi.getTimeToStartInMillis();

		if(delta >= REQUEST_TIMEOUT)
		{
			if(APP.gameScreen.battlegroundGameController.info.getTimeToStartInMillis() > 1500)
			{
				super.__onDialogCancelButtonClicked(event);

				this.__deactivateDialog();

				APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.BATTLEGROUND_BUY_IN_REOPENING_REQUIRED);
				this.emit(BattlegroundCountDownDialogController.EVENT_BATTLEGROUND_COUNTDOWN_CANCEL_CLICKED);
			}
		}
	}

	_onTimeToStartUpdated(event)
	{
		if(
			!event.isPlayerClickedConfirmPlayForNextBattlegroundRound
			|| event.isRoundResultDisplayInProgress
			|| !event.timeToStart //Zero, null or undefined
			|| event.timeToStart === 9223372036854775807//unset long java type, taken as undefined
		)
		{
			return;
		}

		this.__activateDialog();
	}

	_onCancelBattlegroundRound()
	{
		this._fIsSecondaryScreenActivate = false;
		this._fIsFireSettingsMobileActivate = false;
		
		this.__deactivateDialog(true);
	}

	//VALIDATION...
	__validateModelLevel ()
	{
		super.__validateModelLevel();
	}
	__validateViewLevel ()
	{
		let info = this.info;
		let view = this.__fView_uo;

		//buttons configuration...
		view.setCancelMode();
		//...buttons configuration

		super.__validateViewLevel();
	}
	//...VALIDATION

	__deactivateDialog(aIsCancelBattlegroundRoundReasonForDeactivateDialog)
	{
		super.__deactivateDialog();

		clearInterval(this._fInterval);
		this._fCancelTime = null;

		APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.BATTLEGROUND_COUNTDOWN_DEACTIVATED);
		this.emit(BattlegroundCountDownDialogController.EVENT_COUNT_DOWN_DIALOG_DEACTIVATED, {isCancelBattlegroundRoundReasonForDeactivateDialog: aIsCancelBattlegroundRoundReasonForDeactivateDialog});
	}

	__activateDialog()
	{
		super.__activateDialog();

		let lBattleGroundGameInfo_bgi = APP.gameScreen.battlegroundGameController.info;

		clearInterval(this._fInterval);

		if (!this._fCancelTime 
			|| (lBattleGroundGameInfo_bgi.getTimeToStartInMillis() > this._fCancelTime) 
			|| this._fIsUpdateCancelTimeResponse)
		{
			this._fCancelTime = lBattleGroundGameInfo_bgi.getTimeToStartInMillis();
		}

		this.view.updateTimeIndicator(lBattleGroundGameInfo_bgi.getFormattedTimeToStart(true));
		this._fInterval = setInterval(this._tick.bind(this), 100);

		APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.BATTLEGROUND_COUNTDOWN_ACTIVATED);
		this.emit(BattlegroundCountDownDialogController.EVENT_COUNT_DOWN_DIALOG_ACTIVATED);

		if(this._fIsSecondaryScreenActivate || this._fIsFireSettingsMobileActivate)
		{
			this.__deactivateDialog();
		}
	}

	_tick()
	{
		let lBattleGroundGameInfo_bgi = APP.gameScreen.battlegroundGameController.info;
		let delta = this._fCancelTime - lBattleGroundGameInfo_bgi.getTimeToStartInMillis();

		if (lBattleGroundGameInfo_bgi.getTimeToStartInMillis() <= 1500 
			|| (delta < REQUEST_TIMEOUT && this._fIsUpdateCancelTimeResponse))
		{
			this.view._deactivateCancelButton();
		}
		else
		{
			this.view._activateCancelButton();
			this._fIsUpdateCancelTimeResponse = false;
		}

		this.view.updateTimeIndicator(APP.gameScreen.battlegroundGameController.getFormattedTimeToStart(true));
	}

	_onSitInRequired(event)
	{
		let lBattlegroundInfo_bgi = APP.gameScreen.battlegroundGameController.info;

		if(
			event.data &&
			event.data.isBattlegroundCountDownRequired
			)
		{
			this._fIsSecondaryScreenActivate = false;
			this._fIsFireSettingsMobileActivate = false;

			this.__activateDialog();
		}
	}

	_onRebuyDialogExitButtonClicked()
	{
		this.__deactivateDialog();
	}

	_onCountDownPanelReopened()
	{
		if(APP.isMobile) this._fIsFireSettingsMobileActivate = false;
		this.__activateDialog();
	}

	_onCountDownPanelHide()
	{
		if(APP.isMobile) this._fIsFireSettingsMobileActivate = true;
		this.__deactivateDialog();
	}

	_onTimeIsOut()
	{
		let roundState = APP.currentWindow.gameStateController.info.gameState;
		if (roundState != ROUND_STATE.QUALIFY)
		{
			this.__deactivateDialog();
		}
	}

	_onFinalCounting()
	{
		this.__deactivateDialog();
	}

	_onServerErrorMessage(event)
	{
		let serverData = event.messageData;
		
		switch (serverData.code) 
		{
			case GameWebSocketInteractionController.ERROR_CODES.INSUFFICIENT_FUNDS:
			case GameWebSocketInteractionController.ERROR_CODES.NOT_ENOUGH_MONEY:
				this.__deactivateDialog();
				APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.BATTLEGROUND_BUY_IN_REOPENING_REQUIRED);
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

export default BattlegroundCountDownDialogController