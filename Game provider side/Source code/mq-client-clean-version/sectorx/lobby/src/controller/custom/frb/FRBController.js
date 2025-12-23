import GUSLobbyFRBController from '../../../../../../common/PIXI/src/dgphoenix/gunified/controller/custom/frb/GUSLobbyFRBController';
import FRBInfo from '../../../model/custom/frb/FRBInfo';

class FRBController extends GUSLobbyFRBController
{
	constructor(aOptInfo)
	{
		super(aOptInfo || new FRBInfo());
	}

	__init()
	{
		super.__init();
	}
}

export default FRBController