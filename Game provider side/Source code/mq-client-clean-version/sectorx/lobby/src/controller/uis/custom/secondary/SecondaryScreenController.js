import GUSLobbySecondaryScreenController from '../../../../../../../common/PIXI/src/dgphoenix/gunified/controller/uis/custom/secondary/GUSLobbySecondaryScreenController';
import SecondaryScreenView from '../../../../view/uis/custom/secondary/SecondaryScreenView';
import SettingsScreenController from './settings/SettingsScreenController';
import PaytableScreenController from './paytable/PaytableScreenController';
import EditProfileScreenController from './edit_profile/EditProfileScreenController';

class SecondaryScreenController extends GUSLobbySecondaryScreenController
{
	//INIT...
	constructor(...args)
	{
		super(...args);
	}

	__provideSecondaryScreenViewInstance()
	{
		return new SecondaryScreenView(this._fViewParentContainer_sprt);
	}

	__provideSettingsScreenControllerInstance()
	{
		return new SettingsScreenController();
	}

	__providePaytableScreenControllerInstance()
	{
		return new PaytableScreenController();
	}

	__provideEditProfileScreenControllerInstance()
	{
		return new EditProfileScreenController();
	}
	//...INIT
}

export default SecondaryScreenController