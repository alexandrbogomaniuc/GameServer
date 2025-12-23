import GUSLobbySubloadingController from '../../../../../common/PIXI/src/dgphoenix/gunified/controller/subloading/GUSLobbySubloadingController';
import SubloadingInfo from '../../model/subloading/SubloadingInfo';
import SubloadingView from '../../view/subloading/SubloadingView';
import PAYTABLE_ASSETS from '../../config/paytable_assets.json';
import PROFILE_ASSETS from '../../config/profile_assets.json';

class SubloadingController extends GUSLobbySubloadingController
{
	constructor()
	{
		super(new SubloadingInfo(), new SubloadingView());
	}

	get __paytableImageAssets()
	{
		return PAYTABLE_ASSETS.images;
	}

	get __profileImageAssets()
	{
		// must be overridden
		return PROFILE_ASSETS.images;
	}

	destroy()
	{
		super.destroy();
	}
}

export default SubloadingController;