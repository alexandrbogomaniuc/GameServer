import GUSLobbyScreen from '../../../../common/PIXI/src/dgphoenix/gunified/view/main/GUSLobbyScreen';
import LobbyView from './LobbyView';
import EditProfileScreenController  from '../controller/uis/custom/secondary/edit_profile/EditProfileScreenController';
import { APP } from '../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';


class LobbyScreen extends GUSLobbyScreen
{
	static get EVENT_ON_NICKNAME_CHECK_REQUIRED()					{return EditProfileScreenController.EVENT_ON_NICKNAME_CHECK_REQUIRED;}
	static get EVENT_ON_NICKNAME_CHANGE_REQUIRED()					{return EditProfileScreenController.EVENT_ON_NICKNAME_CHANGE_REQUIRED;}
	static get EVENT_ON_AVATAR_CHANGE_REQUIRED()					{return EditProfileScreenController.EVENT_ON_AVATAR_CHANGE_REQUIRED;}
	
	constructor()
	{
		super();
	}

	get __backgroundAssetName()
	{
		return 'lobby/back';
	}

	__provideLobbyViewInstance()
	{
		let l_sprt = new LobbyView(this._fPlayer_obj);
		l_sprt.position.set(0, 11);

		return l_sprt;
	}

	_addProfileListeners()
	{
		super._addProfileListeners();
		this._removeProfileListeners();

		let l_epsc = APP.secondaryScreenController.editProfileScreenController;

		l_epsc.on(EditProfileScreenController.EVENT_ON_AVATAR_CHANGE_REQUIRED, this._onProfileSettingUpdate, this);
		l_epsc.on(EditProfileScreenController.EVENT_ON_NICKNAME_CHANGE_REQUIRED, this._onNickNameApplyAttempt, this);
		l_epsc.on(EditProfileScreenController.EVENT_ON_NICKNAME_CHECK_REQUIRED, this._onCheckNicknameRequired, this);
	}

	_removeProfileListeners()
	{
		super._removeProfileListeners();
		let l_epsc = APP.secondaryScreenController.editProfileScreenController;

		l_epsc.off(EditProfileScreenController.EVENT_ON_AVATAR_CHANGE_REQUIRED, this._onProfileSettingUpdate, this);
		l_epsc.off(EditProfileScreenController.EVENT_ON_NICKNAME_CHANGE_REQUIRED, this._onNickNameApplyAttempt, this);
		l_epsc.off(EditProfileScreenController.EVENT_ON_NICKNAME_CHECK_REQUIRED, this._onCheckNicknameRequired, this);
	}

	enterLobbyResponse(data)
	{
		super.enterLobbyResponse(data);
		this._addProfileListeners();
	}

	_onLobbyServerConnectionClosed(event)
	{
		super._onLobbyServerConnectionClosed(event);
		this._removeProfileListeners()
	}

	_onProfileSettingUpdate(data)
	{
		console.log("on profile settings updated")
		let settings = data.settings;
		this.emit(LobbyScreen.EVENT_ON_AVATAR_CHANGE_REQUIRED, {borderStyle: settings.border, hero: settings.hero, background: settings.back});
	}

}

export default LobbyScreen;