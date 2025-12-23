import GUSLobbyCommonPanelController from '../../../../../../../common/PIXI/src/dgphoenix/gunified/controller/uis/custom/commonpanel/GUSLobbyCommonPanelController';
import CommonPanelView from '../../../../view/uis/custom/commonpanel/CommonPanelView';
import CommonPanelInfo from '../../../../model/uis/custom/commonpanel/CommonPanelInfo';
import LobbySoundButtonController from '../secondary/LobbySoundButtonController';
import LobbyWeaponsPanelController from '../../../custom/LobbyWeaponsPanelController';

class CommonPanelController extends GUSLobbyCommonPanelController
{
	//INIT...
	constructor()
	{
		super(new CommonPanelInfo(), new CommonPanelView());
	}

	__provideSoundButtonController()
	{
		return new LobbySoundButtonController();
	}

	__provideLobbyWeaponsPanelControllerInstance()
	{
		return new LobbyWeaponsPanelController();
	}
}

export default CommonPanelController