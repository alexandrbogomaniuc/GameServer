import SimpleUIController from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/uis/base/SimpleUIController';
import FireSettingsInfo from '../../../model/uis/fire_settings/FireSettingsInfo';
import FireSettingsView from '../../../view/uis/fire_settings/FireSettingsView';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import GameExternalCommunicator from '../../../external/GameExternalCommunicator';
import {LOBBY_MESSAGES, GAME_MESSAGES} from '../../../external/GameExternalCommunicator';
import Game from '../../../Game';

class FireSettingsController extends SimpleUIController
{
	static get EVENT_ON_FIRE_SETTINGS_CHANGED()		{ return FireSettingsView.EVENT_ON_FIRE_SETTINGS_CHANGED; }
	static get EVENT_SCREEN_ACTIVATED()				{ return "onSettingsScreenActivated"; }
	static get EVENT_SCREEN_DEACTIVATED()			{ return "onSettingsScreenDeactivated"; }

	hideScreen()
	{
		this._hideScreen();
	}

	constructor()
	{
		super(new FireSettingsInfo());
	}

	__init()
	{
		super.__init();
	}

	__initControlLevel()
	{
		super.__initControlLevel();

		APP.externalCommunicator.on(GameExternalCommunicator.LOBBY_MESSAGE_RECEIVED, this._onLobbyExternalMessageReceived, this);
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

		l_fsv.visible = false;
		l_fsv.deactivate();
		APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.FIRE_SETTINGS_STATE_CHANGED, {isActive: false});
		this.emit(FireSettingsController.EVENT_SCREEN_DEACTIVATED);
	}

	destroy()
	{
		super.destroy();
	}
}

export default FireSettingsController;