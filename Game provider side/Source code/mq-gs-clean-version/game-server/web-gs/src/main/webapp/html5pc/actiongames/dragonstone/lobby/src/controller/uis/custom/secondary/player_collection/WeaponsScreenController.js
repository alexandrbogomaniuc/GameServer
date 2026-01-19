import PlayerCustomCollectionScreenController from './PlayerCustomCollectionScreenController';
import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import LobbyWebSocketInteractionController from '../../../../interaction/server/LobbyWebSocketInteractionController';
import WeaponsScreenInfo from '../../../../../model/uis/custom/secondary/player_collection/WeaponsScreenInfo';
import {GAME_MESSAGES} from '../../../../../../../../common/PIXI/src/dgphoenix/gunified/controller/external/GUSLobbyExternalCommunicator';
import PlayerInfo from '../../../../../../../../common/PIXI/src/dgphoenix/unified/model/custom/PlayerInfo';


class WeaponsScreenController extends PlayerCustomCollectionScreenController
{
	static get EVENT_SCREEN_ACTIVATED()					{ return "onPlayerCustomCollectionScreenActivated"; }
	static get EVENT_SCREEN_DEACTIVATED()				{ return "onPlayerCustomCollectionScreenDeactivated"; }
	
	static get EVENT_ON_WEAPONS_REQUIRED()				{ return "onWeaponsRequired"; }
	static get EVENT_ON_WEAPONS_UPDATED()				{ return "EVENT_ON_WEAPONS_UPDATED"; }
	
	get weaponsByStake()
	{
		let lView_wssv = this.view;

		if (lView_wssv)
		{
			return lView_wssv.weaponsByStake;
		}

		return null;
	}

	isAnySpecialWeaponExistForStake(aStake_num)
	{
		let weapons = this.weaponsByStake;
		if (!weapons || !weapons.length)
		{
			return false;
		}

		let stakeWeapons = weapons[aStake_num];
		if (!stakeWeapons || !stakeWeapons.length)
		{
			return false;
		}

		for (let i = 0; i < stakeWeapons.length; i++)
		{

			let lId_num = stakeWeapons[i].id;
			let lAmmo_num = stakeWeapons[i].shots || 0;
			if (lAmmo_num > 0)
			{
				return true;
			}
		}

		return false;
	}

	get isAnySpecialWeaponExist()
	{
		let lIsSWExist_bl = false;
		
		let lStakes_arr = APP.playerController.info.stakes;
		for (let i=0; i<lStakes_arr.length; i++)
		{
			let lStake_num = lStakes_arr[i];
			if (this.isAnySpecialWeaponExistForStake(lStake_num))
			{
				lIsSWExist_bl = true;
			}
		}

		return lIsSWExist_bl;
	}

	constructor(aOptParentController_usc)
	{
		super(new WeaponsScreenInfo(), undefined, aOptParentController_usc);
	}

	//INIT...
	__init()
	{
		super.__init();
	}

	__initControlLevel()
	{
		super.__initControlLevel();

		let webSocketController = APP.webSocketInteractionController;
		webSocketController.on(LobbyWebSocketInteractionController.EVENT_ON_SERVER_WEAPONS_MESSAGE, this._onWeaponsMessage, this);
	}

	__initViewLevel()
	{
		super.__initViewLevel();

		let lView_qssv = this.view;		
	}
	//...INIT

	_onGameExternalMessageReceived(event)
	{
		let msgType = event.type;
		switch (msgType)
		{
			case GAME_MESSAGES.WEAPONS_UPDATED:
				this._updateWeaponsInfoFromGame(event.data.weapons);
				break;
		}

		super._onGameExternalMessageReceived(event);
	}

	_onLobbyScreenShown(event)
	{
		// no actions required
	}

	_updateWeaponsInfoFromGame(aWeapons_arr)
	{
		let lView_qssv = this.view;
		if (lView_qssv)
		{
			lView_qssv.updateWeaponsInfoFromGame(aWeapons_arr);

			this._onWeaponsUpdated();
		}
	}

	_updateScreenData()
	{
		super._updateScreenData();
	}

	_updateCollectionView()
	{
	}

	_requestData()
	{
		super._requestData();
		
		this.emit(WeaponsScreenController.EVENT_ON_WEAPONS_REQUIRED);
	}

	_onWeaponsMessage(event)
	{
		let lWeapons_arr = event.messageData.weapons;
		let lView_qssv = this.view;

		if (lView_qssv)
		{
			lView_qssv.updateWeaponsInfo(lWeapons_arr);

			this._onWeaponsUpdated();
		}

		super._onDataResponded();
	}

	_onWeaponsUpdated()
	{
		this.emit(WeaponsScreenController.EVENT_ON_WEAPONS_UPDATED);
	}

	destroy()
	{
		super.destroy();
	}
	
}

export default WeaponsScreenController