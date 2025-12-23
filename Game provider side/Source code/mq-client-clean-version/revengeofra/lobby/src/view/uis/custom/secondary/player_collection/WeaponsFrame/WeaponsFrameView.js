import { WEAPONS } from '../../../../../../../../shared/src/CommonConstants';
import WeaponsFrameItem from './WeaponsFrameItem';
import I18 from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
import { APP } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import PlayerCustomCollectionScreenView from '../PlayerCustomCollectionScreenView';

const ITEM_DISTANCE_COLUMNS = 117+17;
const ITEM_DISTANCE_ROWS = 73+13;

const ORDERED_WEAPONS = {
	ARTILLERYSTRIKE:	WEAPONS.ARTILLERYSTRIKE,
	INSTAKILL:			WEAPONS.INSTAKILL,
	CRYOGUN:			WEAPONS.CRYOGUN,
	MINELAUNCHER:		WEAPONS.MINELAUNCHER,
	FLAMETHROWER:		WEAPONS.FLAMETHROWER
};

class WeaponsFrameView extends PlayerCustomCollectionScreenView
{
	updateWeaponsInfo(aWeapons_arr)
	{
		this._updateWeaponsInfo(aWeapons_arr);
	}

	updateWeaponsInfoFromGame(aWeapons_arr, aStake_num)
	{
		this._updateWeaponsInfoFromGame(aWeapons_arr, aStake_num);
	}

	get weaponsByStake()
	{
		return this._fWeaponsByStake_arr;
	}

	constructor()
	{
		super();

		this._fWeaponsByStake_arr = null;

		this._fWeaponItems_arr = null;

		this._initWeaponsFrameView();
	}

	_initWeaponsFrameView()
	{
		this._addCaption();

		this._fWeaponsByStake_arr = [];
		this._fWeaponItems_arr = [];

		let lRow_num = 0;
		let lColumn_num = 0;
		for (let id in ORDERED_WEAPONS)
		{
			if (lColumn_num >= 4)
			{
				lColumn_num = 0;
				++lRow_num;
			}

			this._addWeapon(ORDERED_WEAPONS[id], lColumn_num, lRow_num);

			++lColumn_num;
		}
	}

	get _waitScreenPosition()
	{
		return new PIXI.Point(-173, -30);
	}

	_addCaption()
	{
		let lCaption_ta = this.addChild(I18.generateNewCTranslatableAsset("TAPlayerCollectionScreenWeaponsNoteCaption"));
		lCaption_ta.position.set(-327, -180);
	}

	_addWeapon(aWeaponId_num, aColumn_num, aRow_num)
	{
		let lMaxWidth_num = ITEM_DISTANCE_COLUMNS*4;
		let lMaxHeight_num = ITEM_DISTANCE_ROWS*3;

		let lWeapon_wfi = this.addChild(new WeaponsFrameItem(aWeaponId_num));
		lWeapon_wfi.position.set(aColumn_num * ITEM_DISTANCE_COLUMNS - lMaxWidth_num/2, aRow_num * ITEM_DISTANCE_ROWS - lMaxHeight_num/2);

		this._fWeaponItems_arr.push(lWeapon_wfi);
	}

	_updateWeaponsInfoFromGame(aWeapons_arr)
	{
		let lFormattedStakeWeapons_arr = [];

		for (let key in aWeapons_arr)
		{
			if (key != -1)
			{
				lFormattedStakeWeapons_arr.push({id: key, shots: aWeapons_arr[key]});
			}
		}

		let lCurrentPlayerStake_num = APP.playerController.info.currentStake;
		this._updateWeaponsInfoByStake(lFormattedStakeWeapons_arr, lCurrentPlayerStake_num);

		this._updateWeaponsView();
	}

	_updateWeaponsInfo(aWeapons_arr)
	{
		for (let stake in aWeapons_arr)
		{
			if (!APP.lobbyStateController.info.lobbyScreenVisible && +stake == APP.playerController.info.currentStake)
			{
				// We already have actual list of weapons from game.
				continue;
			}
			this._updateWeaponsInfoByStake(aWeapons_arr[stake], Math.round(stake));
		}

		this._updateWeaponsView();
	}

	_updateWeaponsInfoByStake(aStakeWeapons_arr, aStake_num)
	{
		this._fWeaponsByStake_arr[aStake_num] = aStakeWeapons_arr;
	}

	_changeStake(aStake_num)
	{
		super._changeStake(aStake_num);

		this._updateWeaponsView();
	}

	_updateWeaponsView()
	{
		this._clearWeaponsView();

		let lCurrentWeapons_arr = this._fWeaponsByStake_arr[this._fCurrentStake_num];
		if (!lCurrentWeapons_arr) return;

		for (let i = 0; i < lCurrentWeapons_arr.length; ++i)
		{
			let lId_num = lCurrentWeapons_arr[i].id;
			let lAmmo_num = lCurrentWeapons_arr[i].shots || 0;

			let lWeapon_wfi = this._getItemById(lId_num);
			lWeapon_wfi.ammoAmount = lAmmo_num;
		}
	}

	_getItemById(id)
	{
		return this._fWeaponItems_arr.filter((item)=>{return item.id == id})[0];
	}

	_clearWeaponsView()
	{
		for (let i = 0; i < this._fWeaponItems_arr.length; ++i)
		{
			this._fWeaponItems_arr[i].ammoAmount = 0;
		}
	}

	destroy()
	{
		super.destroy();

		this._fWeaponsByStake_arr = undefined;

		this._fWeaponItems_arr = undefined;
	}
}

export default WeaponsFrameView;