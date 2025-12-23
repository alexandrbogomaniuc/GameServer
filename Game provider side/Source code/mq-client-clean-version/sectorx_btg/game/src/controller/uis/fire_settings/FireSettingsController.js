import SimpleUIController from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/uis/base/SimpleUIController';
import FireSettingsInfo from '../../../model/uis/fire_settings/FireSettingsInfo';
import FireSettingsView from '../../../view/uis/fire_settings/FireSettingsView';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import GameWebSocketInteractionController from '../../interaction/server/GameWebSocketInteractionController';
import GameExternalCommunicator from '../../../controller/external/GameExternalCommunicator';
import {LOBBY_MESSAGES, GAME_MESSAGES} from '../../../controller/external/GameExternalCommunicator';
import Game from '../../../Game';
import FireController from '../fire/FireController';
import GameScreen from '../../../main/GameScreen';

class FireSettingsController extends SimpleUIController
{
	static get EVENT_ON_FIRE_SETTINGS_CHANGED()		{ return FireSettingsView.EVENT_ON_FIRE_SETTINGS_CHANGED; }
	static get EVENT_SCREEN_ACTIVATED()				{ return "onSettingsScreenActivated"; }
	static get EVENT_SCREEN_DEACTIVATED()			{ return "onSettingsScreenDeactivated"; }

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

		this._fSettingsBeforeAutofireClicked_obj = null;
	}

	__init()
	{
		super.__init();
	}

	__initControlLevel()
	{
		super.__initControlLevel();

		APP.externalCommunicator.on(GameExternalCommunicator.LOBBY_MESSAGE_RECEIVED, this._onLobbyExternalMessageReceived, this);

		APP.gameScreen.fireController.on(FireController.EVENT_ON_AUTOFIRE_BUTTON_ENABLED, this._onAutoFireButtonEnabled, this);
		APP.gameScreen.fireController.on(FireController.EVENT_ON_AUTOFIRE_BUTTON_DISABLED, this._onAutoFireButtonDisabled, this);
		APP.gameScreen.on(GameScreen.EVENT_ON_ROOM_PAUSED, this._onRoomPaused, this);
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

	_onAutoFireButtonEnabled()
	{
		this._fSettingsBeforeAutofireClicked_obj = {
			autoFire: this.info.autoFire,
			lockOnTarget: this.info.lockOnTarget
		};

		this.info.autoFire = true;
		this.info.lockOnTarget = true;
		this.emit(FireSettingsController.EVENT_ON_FIRE_SETTINGS_CHANGED);
		this.view && this.view.update();
	}

	_onAutoFireButtonDisabled()
	{
		this._restoreStatesIfNeeded();
		this.view && this.view.update();
	}

	_onRoomPaused()
	{
		this._onAutoFireButtonDisabled();
	}

	_restoreStatesIfNeeded()
	{
		if (this._fSettingsBeforeAutofireClicked_obj)
		{
			this.info.autoFire = this._fSettingsBeforeAutofireClicked_obj.autoFire;
			this.info.lockOnTarget = this._fSettingsBeforeAutofireClicked_obj.lockOnTarget;
			this.emit(FireSettingsController.EVENT_ON_FIRE_SETTINGS_CHANGED);
		}
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

		l_fsv.visible = true && APP.isAutoFireMode;
		l_fsv.activate();
		APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.FIRE_SETTINGS_STATE_CHANGED, {isActive: true});
		this.emit(FireSettingsController.EVENT_SCREEN_ACTIVATED);
	}

	_hideScreen()
	{
		let l_fsv = this.view;
		if (!l_fsv) return;
		if(l_fsv.visible == false) return;

		l_fsv.visible = false;
		l_fsv.deactivate();
		APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.FIRE_SETTINGS_STATE_CHANGED, {isActive: false});
		this.emit(FireSettingsController.EVENT_SCREEN_DEACTIVATED);
	}

	destroy()
	{
		this._restoreStatesIfNeeded();
		this._fSettingsBeforeAutofireClicked_obj = null;

		APP.externalCommunicator.off(GameExternalCommunicator.LOBBY_MESSAGE_RECEIVED, this._onLobbyExternalMessageReceived, this);

		APP.gameScreen.fireController.off(FireController.EVENT_ON_AUTOFIRE_BUTTON_ENABLED, this._onAutoFireButtonEnabled, this);
		APP.gameScreen.fireController.off(FireController.EVENT_ON_AUTOFIRE_BUTTON_DISABLED, this._onAutoFireButtonDisabled, this);

		super.destroy();
	}
}

export default FireSettingsController;