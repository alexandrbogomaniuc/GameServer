import GUSLobbySecondaryScreenView from '../../../../../../../common/PIXI/src/dgphoenix/gunified/view/uis/secondary/GUSLobbySecondaryScreenView';
import SettingsScreenView from './settings/SettingsScreenView';
import EditProfileScreenView from './edit_profile/EditProfileScreenView';

class SecondaryScreenView extends GUSLobbySecondaryScreenView
{
	//INIT...
	constructor(aParentContainer_sprt)
	{
		super(aParentContainer_sprt);
	}
	//...INIT

	__provideSettingsScreenViewInstance()
	{
		return new SettingsScreenView();
	}

	__provideEditProfileScreenViewInstance()
	{
		return new EditProfileScreenView();
	}
}

export default SecondaryScreenView;