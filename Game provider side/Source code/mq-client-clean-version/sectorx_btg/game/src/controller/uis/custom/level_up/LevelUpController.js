import SimpleController from "../../../../../../../common/PIXI/src/dgphoenix/unified/controller/base/SimpleController";
import GameFieldController from "../../game_field/GameFieldController";
import { WEAPONS } from "../../../../../../shared/src/CommonConstants";
import { APP } from "../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals";
import ShotResponsesController from "../../../custom/ShotResponsesController";

class LevelUpController extends SimpleController
{
    static get EVENT_ON_TIME_TO_HANDLE_AWARDED_WEAPON() 					{return 'EVENT_ON_TIME_TO_HANDLE_AWARDED_WEAPON';}
    static get EVENT_ON_WEAPON_AWARDED()									{return 'EVENT_ON_WEAPON_AWARDED';}

	get pendingMasterSWAwards()
	{
		return this._fMasterSWAwardsQueue_obj_arr;
	}

	get isPendingMasterSWAwardsExist()
	{
		return this._fMasterSWAwardsQueue_obj_arr && !!this._fMasterSWAwardsQueue_obj_arr.length;
	}

	awardPostponedWeapons()
	{
		if (this._fMasterSWAwardsQueue_obj_arr)
		{
			//implement postponed weapons awarding
			while (this._fMasterSWAwardsQueue_obj_arr.length)
			{
				let lAward_obj = this._fMasterSWAwardsQueue_obj_arr.shift();
				this.addWeapon({id: lAward_obj.id, shots: lAward_obj.shots, nextBetLevel: lAward_obj.nextBetLevel}, {x: 0, y: 0}, 0);
			}
		}
	}

    constructor()
    {
        super();

        this._gameScreen = null;
        this._fMasterSWAwardsQueue_obj_arr = null;
    }

    __initControlLevel()
	{
		super.__initControlLevel();

		this._gameScreen = APP.gameScreen;

        APP.currentWindow.gameFieldController.on(GameFieldController.EVENT_ON_SHOW_ENEMY_HIT, this._onShowEnemyHit, this);
		APP.currentWindow.shotResponsesController.on(ShotResponsesController.EVENT_ON_SERVER_SHOT_RESPONSE, this._onShotResponse, this);
	}

	_onShotResponse(data)
	{
		let lShotResponseInfo_sri = data.info;
		if (lShotResponseInfo_sri.isHit) {
			this._onServerHitMessage({messageData: lShotResponseInfo_sri.data, requestData: lShotResponseInfo_sri.requestData});
		}
	}

	_onServerHitMessage(event)
	{
		var data = event.messageData;

		if (!this.room)
		{
			return;
		}

		if (!data.lastResult)
		{
			return;
		}

		if (!this.isPaused)
		{
			let lAwardedWeapons_arr = [];
			if (data.awardedWeapons && data.awardedWeapons.length)
			{
				for (let i = 0; i < data.awardedWeapons.length; ++i)
				{
					let lWeapon_obj = {id: data.awardedWeapons[i].id, shots: data.awardedWeapons[i].shots};
					lAwardedWeapons_arr.push(lWeapon_obj);
				}
			}
			else if (data.awardedWeaponId != WEAPONS.DEFAULT)
			{
				let lWeapon_obj = {id: data.awardedWeaponId, shots: data.awardedWeaponShots};
				lAwardedWeapons_arr.push(lWeapon_obj);
			}

			if (lAwardedWeapons_arr.length)
			{
				if (!this._fMasterSWAwardsQueue_obj_arr || !this._fMasterSWAwardsQueue_obj_arr.length)
				{
					this._fMasterSWAwardsQueue_obj_arr = lAwardedWeapons_arr;
				}
			}
		}
	}

    _onShowEnemyHit(params)
    {
        let lSeatId = APP.playerController.info.seatId;
        if (params.data.awardedWeapons && !!params.data.awardedWeapons.length)
		{
			let lMasterSWAwards_obj_arr = params.data.awardedWeapons;

			if(params.data.seatId === lSeatId)
			{
				this._awardMultipleMasterSW(lMasterSWAwards_obj_arr, params);
			}
		}
		else
		{
			if (params.data.awardedWeaponId != WEAPONS.DEFAULT)
			{
				let weapon = {id: params.data.awardedWeaponId, shots: params.data.awardedWeaponShots, nextBetLevel:params.data.nextBetLevel};
				let enemyLife = (params.enemyView) ? params.enemyView.life : 0;
				this.addWeapon(weapon, params.position, enemyLife);

				this._fMasterSWAwardsQueue_obj_arr = null;
			}
		}
    }

    _awardMultipleMasterSW(aMasterSWAwards_obj_arr, aParams_obj)
	{
		if(aMasterSWAwards_obj_arr && aMasterSWAwards_obj_arr.length)
		{
			let weaponsFlyPositions = [];

			switch (aMasterSWAwards_obj_arr.length)
			{
				case 1:
					weaponsFlyPositions = [
						{x: 0, y: -100}
					];
					break;
				case 2:
					weaponsFlyPositions = [
						{x:  90, y: -45},
						{x: -90, y: -45}
					];
					break;
				case 3:
					weaponsFlyPositions = [
						{x:  90, y:   45},
						{x: -90, y:   45},
						{x:   0, y: -100}
					];
					break;
			}

			for (let i = 0; i < aMasterSWAwards_obj_arr.length; i++)
			{
				let lMasterSWAward_obj = aMasterSWAwards_obj_arr[i];
				let weapon = {id: lMasterSWAward_obj.id, shots: lMasterSWAward_obj.shots, nextBetLevel: aParams_obj.data.nextBetLevel};
				let enemyLife = (aParams_obj.enemyView) ? aParams_obj.enemyView.life : 0;

				this.addWeapon(weapon, aParams_obj.position, enemyLife, true, weaponsFlyPositions[i]);
			}

			this._fMasterSWAwardsQueue_obj_arr = null;
		}
	}

	addWeapon(weapon, pos, enemyLife, optMultipleWeapons, optFinalPosition)
	{
		if (!this.isPaused)
		{
			this.emit(LevelUpController.EVENT_ON_WEAPON_AWARDED, {weapon: weapon});
			this._gameScreen.gameFieldController.showAddWeapon(weapon, pos, enemyLife, optMultipleWeapons, optFinalPosition);
		}
		else
		{
			this.emit(LevelUpController.EVENT_ON_TIME_TO_HANDLE_AWARDED_WEAPON, {weapon: weapon});
		}
	}
} 
export default LevelUpController