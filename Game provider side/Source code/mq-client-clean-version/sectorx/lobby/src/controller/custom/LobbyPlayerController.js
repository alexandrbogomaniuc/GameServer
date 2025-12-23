import GUSLobbyPlayerController from '../../../../../common/PIXI/src/dgphoenix/gunified/controller/custom/GUSLobbyPlayerController';
import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import PlayerInfo from '../../../../../common/PIXI/src/dgphoenix/unified/model/custom/PlayerInfo';
import SettingsScreenController from '../../controller/uis/custom/secondary/settings/SettingsScreenController';

class LobbyPlayerController extends GUSLobbyPlayerController
{
	//INIT...
	__initControlLevel()
	{
		super.__initControlLevel();
	}

	__initModelLevel()
	{
		super.__initModelLevel();
	}
	//...INIT

	__parseCustomEnterLobbyResponseParams(aEnterLobbyResponseData_obj, aTargetUpdatedData_obj)
	{
		aTargetUpdatedData_obj[PlayerInfo.KEY_POSSIBLE_BET_LEVELS] = { value: aEnterLobbyResponseData_obj.paytable.possibleBetLevels };

		if (aEnterLobbyResponseData_obj.alreadySitInStake && +aEnterLobbyResponseData_obj.alreadySitInStake > 0)
		{
			aTargetUpdatedData_obj[PlayerInfo.KEY_ENTERING_ROOM_STAKE] = { value: +aEnterLobbyResponseData_obj.alreadySitInStake, time: aEnterLobbyResponseData_obj.date };
		}

		if (aEnterLobbyResponseData_obj.paytable && aEnterLobbyResponseData_obj.paytable.weaponPaidMultiplier)
		{
			aTargetUpdatedData_obj[PlayerInfo.KEY_WEAPON_COST_MULTIPLIERS] = { value: aEnterLobbyResponseData_obj.paytable.weaponPaidMultiplier };
		}
	}

	destroy()
	{
		APP.secondaryScreenController.settingsScreenController.off(SettingsScreenController.EVENT_ON_SETTINGS_HEALTH_BAR_STATE_CHANGED, this._onSettingsHealthBarChanged, this);		

		super.destroy();
	}
}

export default LobbyPlayerController;