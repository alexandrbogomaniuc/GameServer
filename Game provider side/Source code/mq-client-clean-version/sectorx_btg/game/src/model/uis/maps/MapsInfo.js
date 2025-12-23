import SimpleUIInfo from '../../../../../../common/PIXI/src/dgphoenix/unified/model/uis/SimpleUIInfo';
import MAPS_ASSETS from '../../../config/maps_assets.json';

const TOTAL_MAPS_COUNT = 4;
const MAPS_WALKING_ZONES =
{
	"1": [
		0, 0,
		0, 540,
		960, 540,
		960, 0
	],
	"2": [
		0, 0,
		0, 540,
		960, 540,
		960, 0
	],
	"3": [
		0, 0,
		0, 540,
		960, 540,
		960, 0
	],
	"4": [
		0, 0,
		0, 540,
		960, 540,
		960, 0
	]
};

class MapsInfo extends SimpleUIInfo
{
	constructor()
	{
		super();

		this._fMapId_int = undefined;
		this._fNextMapId_int = undefined;
		this._fAdditionalRestrictionZoneActivated_bl = false;
		this._fIsFrozen_bl = null;
	}

	set isFrozen(aValue_bl)
	{
		this._fIsFrozen_bl = Boolean(aValue_bl);
	}

	get isFrozen()
	{
		return Boolean(this._fIsFrozen_bl);
	}

	/*returns Array*/
	static getMapAssets(aMapId_int)
	{
		return MAPS_ASSETS[aMapId_int];
	}

	indexCalc(aValue_int)
	{
		let lArg_str = aValue_int + "";
		let lMultiplier_int = Math.pow(10, (lArg_str.length - 1));
		let lOffset_int = Math.trunc(aValue_int / lMultiplier_int) * lMultiplier_int;
		let lMapId_int = aValue_int - lOffset_int;
		
		return lMapId_int;
	}

	set mapId(aValue_int)
	{
		//TEMP SOLUTION...
		let lMapId_int = this.indexCalc(aValue_int);

		if(lMapId_int >= 100)
		{
			lMapId_int = this.indexCalc(lMapId_int);
		}

		if (isNaN(lMapId_int) || lMapId_int < 1 || lMapId_int > TOTAL_MAPS_COUNT)
		{
			throw new Error(`MapId ${lMapId_int} is out of range. The value in range [1, ${TOTAL_MAPS_COUNT}] is expected.`);
		}

		this._fMapId_int = lMapId_int;
		//...TEMP SOLUTION
	}

	get totalMapsCount()
	{
		return TOTAL_MAPS_COUNT;
	}

	get mapId()
	{
		return this._fMapId_int;
	}

	set nextMapId(aValue_int)
	{
		//TEMP SOLUTION...
		let lMapId_int = this.indexCalc(aValue_int);

		if(lMapId_int >= 100)
		{
			lMapId_int = this.indexCalc(lMapId_int);
		}

		if (isNaN(lMapId_int) || lMapId_int < 1 || lMapId_int > TOTAL_MAPS_COUNT)
		{
			throw new Error(`MapId ${lMapId_int} is out of range. The value in range [1, ${TOTAL_MAPS_COUNT}] is expected.`);
		}

		aValue_int = lMapId_int;
		//...TEMP SOLUTION

		if (isNaN(aValue_int) || aValue_int < 1 || aValue_int > TOTAL_MAPS_COUNT)
		{
			throw new Error(`NextMapId ${aValue_int} is out of range. The value in range [1, ${TOTAL_MAPS_COUNT}] is expected.`);
		}

		this._fNextMapId_int = aValue_int;
	}

	get nextMapId()
	{
		return this._fNextMapId_int;
	}

	get currentMapWalkingZone()
	{
		return MAPS_WALKING_ZONES[this.mapId]; //array of points
	}

	destroy()
	{
		this._fMapId_int = undefined;
		this._fNextMapId_int = undefined;
		this._fIsFrozen_bl = null;

		super.destroy();
	}
}

export default MapsInfo;
export { MAPS_ASSETS }