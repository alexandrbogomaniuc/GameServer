import SimpleUIController from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/uis/base/SimpleUIController';
import FireSettingsInfo from '../../../model/uis/fire_settings/FireSettingsInfo';
import FireSettingsView from '../../../view/uis/fire_settings/FireSettingsView';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import GameWebSocketInteractionController from '../../interaction/server/GameWebSocketInteractionController';
import GameExternalCommunicator from '../../../controller/external/GameExternalCommunicator';
import {LOBBY_MESSAGES, GAME_MESSAGES} from '../../../controller/external/GameExternalCommunicator';
import Game from '../../../Game';
import BattlegroundGameController from '../battleground/BattlegroundGameController';

class FireSettingsController extends SimpleUIController
{
	static get EVENT_ON_FIRE_SETTINGS_CHANGED()		{ return FireSettingsView.EVENT_ON_FIRE_SETTINGS_CHANGED; }
	static get EVENT_SCREEN_ACTIVATED()				{ return "onSettingsScreenActivated"; }
	static get EVENT_SCREEN_DEACTIVATED()			{ return "onSettingsScreenDeactivated"; }
	static get EVENT_ON_COUNT_DOWN_REOPENED()		{return "onCountDownReopened"};
	static get EVENT_ON_COUNT_DOWN_HIDE()			{return "onCountDownHire"};

	hideScreen()
	{
		this._hideScreen();
	}

	initViewContainer(aViewContainerInfo)
	{
		this._fViewContainer = aViewContainerInfo.container;

		this._fViewContainer.addChild(this.view);
		this.view.zIndex = aViewContainerInfo.zIndex;
	}

	constructor()
	{
		super(new FireSettingsInfo(), new FireSettingsView());
	}

	__init()
	{
		super.__init();
	}

	__initControlLevel()
	{
		super.__initControlLevel();

		APP.externalCommunicator.on(GameExternalCommunicator.LOBBY_MESSAGE_RECEIVED, this._onLobbyExternalMessageReceived, this);
	
		let wsInteractionController = APP.webSocketInteractionController;
		wsInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_CANCEL_BATTLEGROUND_ROUND, this._onCancelBattlegroundRound, this);
	}

	__initViewLevel()
	{
		super.__initViewLevel();

		let l_fsv = this.view;
		this._hideScreen();

		l_fsv.on(FireSettingsView.EVENT_ON_DEACTIVATE, this._onDeactivateScreen, this);
		l_fsv.on(FireSettingsView.EVENT_ON_FIRE_SETTINGS_CHANGED, this.emit, this);

		l_fsv.update();
	}

	_onDeactivateScreen()
	{
		this._hideScreen();
	}

	_onLobbyExternalMessageReceived(aEvent_obj)
	{
		switch (aEvent_obj.type)
		{
			case LOBBY_MESSAGES.FIRE_SETTINGS_CLICKED:
				this._onLobbyFireSettingsClicked();
			break;
		}
	}

	_onLobbyFireSettingsClicked()
	{
		let l_fsv = this.view;
		if (!l_fsv) return;

		if (l_fsv.visible)
		{
			this._hideScreen();
		}
		else
		{
			this._showScreen();
		}
	}

	_showScreen()
	{
		let l_fsv = this.view;
		if (!l_fsv) return;

		if(APP.isBattlegroundGame && APP.isMobile )
		{
			let lBattleGroundGameInfo_bgi = APP.gameScreen.battlegroundGameController.info;

			if(APP.gameScreen.battlegroundGameController.info.getTimeToStartInMillis() > 0)
			{
				clearInterval(this.interval);

				this.view.updateTimeIndicator(lBattleGroundGameInfo_bgi.getFormattedTimeToStart(false));
				this.interval = setInterval(this._tick.bind(this), 100);
				this.emit(FireSettingsController.EVENT_ON_COUNT_DOWN_HIDE);
			}
			else
			{
				this.view.updateTimeIndicator(lBattleGroundGameInfo_bgi.getFormattedTimeToStart(false));
			}
		}

		l_fsv.visible = true;
		l_fsv.activate();
		APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.FIRE_SETTINGS_STATE_CHANGED, {isActive: true});
		this.emit(FireSettingsController.EVENT_SCREEN_ACTIVATED);
	}

	_hideScreen()
	{
		let l_fsv = this.view;
		if (!l_fsv) return;
		if(l_fsv.visible == false) return;

		if(APP.isBattlegroundGame && APP.isMobile && APP.gameScreen.battlegroundGameController.info.getTimeToStartInMillis() > 0 && !APP.gameScreen.isRoundResultDisplayInProgress())
		{
			this.emit(FireSettingsController.EVENT_ON_COUNT_DOWN_REOPENED);
		}

		l_fsv.visible = false;
		l_fsv.deactivate();
		APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.FIRE_SETTINGS_STATE_CHANGED, {isActive: false});
		this.emit(FireSettingsController.EVENT_SCREEN_DEACTIVATED);
	}

	_tick()
	{
		if (APP.gameScreen.battlegroundGameController.info.getTimeToStartInMillis() > 0)
		{
			this.view.updateTimeIndicator(APP.gameScreen.battlegroundGameController.getFormattedTimeToStart(false));
		}
		else
		{
			clearInterval(this.interval);

			this._hideScreen();
		}
	}

	_onCancelBattlegroundRound()
	{
		this._onDeactivateScreen();
	}

	destroy()
	{
		super.destroy();
	}
}

export default FireSettingsController;