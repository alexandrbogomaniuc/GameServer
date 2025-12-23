import SimpleUIController from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/uis/base/SimpleUIController';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import BattlegroundGameInfo from '../../../model/uis/battleground/BattlegroundGameInfo';
import {GAME_MESSAGES, LOBBY_MESSAGES} from '../../../controller/external/GameExternalCommunicator';
import GameExternalCommunicator from '../../../controller/external/GameExternalCommunicator';
import GameWebSocketInteractionController from '../../interaction/server/GameWebSocketInteractionController';
import GameScreen from '../../../main/GameScreen';
import GameStateController from '../../state/GameStateController';
import { GameStateInfo, SUBROUND_STATE, ROUND_STATE } from '../../../model/state/GameStateInfo';
import FireSettingsController from '../fire_settings/FireSettingsController';

class BattlegroundGameController extends SimpleUIController
{
	static get EVENT_BATTLEGROUND_WAITING_TIME_IS_OUT()	 						{ return 'EVENT_BATTLEGROUND_WAITING_TIME_IS_OUT'; }
	static get EVENT_BATTLEGROUND_COUNT_DOWN_REQUIRED()							{ return 'EVENT_BATTLEGROUND_COUNT_DOWN_REQUIRED'; }
	static get EVENT_BATTLEGROUND_COUNT_DOWN_HIDE_REQUIRED()					{ return 'EVENT_BATTLEGROUND_COUNT_DOWN_HIDE_REQUIRED'; }

	constructor()
	{
		super (new BattlegroundGameInfo());
	}

	__init()
	{
		super.__init();
	}

	__initControlLevel()
	{
		super.__initControlLevel();

		APP.externalCommunicator.on(GameExternalCommunicator.LOBBY_MESSAGE_RECEIVED, this._onLobbyExternalMessageReceived, this);
		APP.currentWindow.on(GameScreen.EVENT_ON_BATTLEGROUND_CONFIRM_NEXT_ROUND_UPDATED, this._onBattlegroundConfirmNextRoundUpdated, this);	
		APP.currentWindow.on(GameScreen.EVENT_ON_SERVER_MESSAGE_GAME_STATE_CHANGED, this._onServerMessage, this);		

		APP.currentWindow.on(GameScreen.EVENT_BATTLEGROUND_TIME_TO_START_UPDATED, this._onBattlegroundTimeToStartUpdated, this, true);

		let wsInteractionController = APP.webSocketInteractionController;
		wsInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_CANCEL_BATTLEGROUND_ROUND, this._onCancelBattlegroundRound, this);

		APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.NEED_UPDATE_BATTLEGROUND_MODE_INFO_ON_GAME_LEVEL);	

		APP.currentWindow.fireSettingsController.on(FireSettingsController.EVENT_ON_COUNT_DOWN_HIDE, this._onCountDownPanelHide, this);
		APP.currentWindow.fireSettingsController.on(FireSettingsController.EVENT_ON_COUNT_DOWN_REOPENED, this._onCountDownPanelRequired, this);
	}

	_onServerMessage(aEvent_obj)
	{
		switch (aEvent_obj.state)
		{
			case ROUND_STATE.PLAY:
				this.info.isPlayerClickedConfirmWasResetOnQualifyState = false;
				break;
			case ROUND_STATE.QUALIFY:
				if (!this.info.isPlayerClickedConfirmWasResetOnQualifyState)
				{
					this.info.isPlayerClickedConfirmPlayForNextBattlegroundRound = false;
					this.info.isPlayerClickedConfirmWasResetOnQualifyState = true;
				}
			default:
				break;
		}
	}

	_onBattlegroundConfirmNextRoundUpdated(e)
	{
		this.info.isPlayerClickedConfirmPlayForNextBattlegroundRound = e.confirm;
	}

	_onLobbyExternalMessageReceived(event)
	{
		let msgType = event.type;
		let l_bgi = this.info;

		switch (msgType)
		{
			case LOBBY_MESSAGES.BATTLEGROUND_PLAY_AGAIN_BUTTON_CLICKED:
				this.info.isPlayerClickedConfirmPlayForNextBattlegroundRound = true;
				//l_bgi.setTimeToStart(undefined);
				break;
			case LOBBY_MESSAGES.UPDATE_BATTLEGROUND_MODE:
				if (!this.info.isNotFirstBattlegroundRoundAfterLoading)
				{
					this.info.isNotFirstBattlegroundRoundAfterLoading = true;
					this.info.isPlayerClickedConfirmPlayForNextBattlegroundRound = !event.data.isConfirmBuyinDialogExpectedOnLastHand;
				}
				break;
			case LOBBY_MESSAGES.BATTLEGROUND_CONTINUE_WAITING:
				//l_bgi.setTimeToStart(undefined);
				break;
		}
	}

	_onBattlegroundTimeToStartUpdated(event)
	{
		this.info.setTimeToStart(event.timeToStart);
	}

	getFormattedTimeToStart(aOptIsHHRequired_bl)
	{
		let lMillisCount_int = this.info.getTimeToStartInMillis();

		if(lMillisCount_int <= 0)
		{
			this.emit(BattlegroundGameController.EVENT_BATTLEGROUND_WAITING_TIME_IS_OUT);
			return aOptIsHHRequired_bl ? "--:--:--" : "--:--"
		}

		return this.info.getFormattedTimeToStart(aOptIsHHRequired_bl);
	}

	_onCancelBattlegroundRound()
	{
		this.info.isPlayerClickedConfirmPlayForNextBattlegroundRound = false;
	}

	_onCountDownPanelRequired()
	{
		this.emit(BattlegroundGameController.EVENT_BATTLEGROUND_COUNT_DOWN_REQUIRED);
	}

	_onCountDownPanelHide(data)
	{
		this.emit(BattlegroundGameController.EVENT_BATTLEGROUND_COUNT_DOWN_HIDE_REQUIRED, data);
	}

	destroy()
	{
		super.destroy();
	}
}

export default BattlegroundGameController;