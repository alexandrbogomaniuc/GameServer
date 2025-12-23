import GUSLobbyBonusController from '../../../../../../../common/PIXI/src/dgphoenix/gunified/controller/uis/custom/bonus/GUSLobbyBonusController';
import LobbyBonusInfo from '../../../../model/custom/bonus/LobbyBonusInfo';

class LobbyBonusController extends GUSLobbyBonusController
{
	constructor(aOptInfo)
	{
		super(aOptInfo || new LobbyBonusInfo());
	}
}

export default LobbyBonusController