import GUSLobbySubloadingInfo, { SUBLOADING_ASSETS_TYPES } from '../../../../../common/PIXI/src/dgphoenix/gunified/model/subloading/GUSubloadingInfo';

class SubloadingInfo extends GUSLobbySubloadingInfo
{
	constructor()
	{
		super();
	}

	__fillSubloadingAssetTypes()
	{
		SUBLOADING_ASSETS_TYPES.paytable = "paytable";
		SUBLOADING_ASSETS_TYPES.profile = "profile";
	}
}

export default SubloadingInfo;