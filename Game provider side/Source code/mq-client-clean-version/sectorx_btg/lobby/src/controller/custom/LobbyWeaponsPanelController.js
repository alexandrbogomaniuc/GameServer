import GUSLobbyWeaponsPanelController from '../../../../../common/PIXI/src/dgphoenix/gunified/controller/custom/GUSLobbyWeaponsPanelController';
import LobbyWeaponsPanelInfo from '../../model/custom/LobbyWeaponsPanelInfo';

class LobbyWeaponsPanelController extends GUSLobbyWeaponsPanelController
{
	constructor(aOptInfo)
	{
		super(aOptInfo || new LobbyWeaponsPanelInfo());
	}
}

export default LobbyWeaponsPanelController;