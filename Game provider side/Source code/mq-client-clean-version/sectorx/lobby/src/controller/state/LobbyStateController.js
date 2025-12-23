import GUSLobbyStateController from '../../../../../common/PIXI/src/dgphoenix/gunified/controller/state/GUSLobbyStateController';
import LobbyStateInfo from '../../model/state/LobbyStateInfo';

class LobbyStateController extends GUSLobbyStateController
{
	constructor(aOptInfo_ussi)
	{
		super(aOptInfo_ussi || new LobbyStateInfo());
	}
}

export default LobbyStateController;