import SimpleUIInfo from '../../../../../../common/PIXI/src/dgphoenix/unified/model/uis/SimpleUIInfo';
import MAPS_ASSETS from '../../../config/maps_assets.json';

const TOTAL_MAPS_COUNT = 3;
const MAP_SCALE = 1.026;
const MAP_ID_DIF = 600;

const MAPS_WALKING_ZONES = {
	"1": [
			0, 	 	390,
			145,	315,
			100,	270,
			100,	65,
			225,	0,
			359,	0,
			359,	122,
			326,	150,
			400,	196,
			510,	138,
			572,	166,
			670,	121,
			670,	0,
			820,	0,
			830,	32,
			853,	60,
			845,	182,
			900,	210,
			900,	317,
			960,	345,
			960,	540,
			0,		540
	],
	"2": [
			0,		245,
			130,	225,
			270,	140,
			434,	156,
			545,	52,
			646,	0,
			960,	0,
			960,	342,
			680,	540,
			0,		540
	],
	"3": [
			0,		287,
			80,		290,
			58,		250,
			45,		230,
			20,		208,
			50,		205,
			118,	194,
			136,	178,
			140,	90,
			188,	112,
			290,	105,
			462,	0,
			960,	0,
			923,	95,
			878,	140,
			960,	185,
			960,	540,
			0,		540
	]
};

const MAPS_COLLISION_RESTRICTED_ZONES = {
	"1" : [
		new PIXI.Rectangle(0, 0, 90, 310),
		new PIXI.Rectangle(90, 0, 20, 42),
		new PIXI.Rectangle(90, 42, 15, 10),
		new PIXI.Rectangle(90, 52, 9, 80),
		new PIXI.Rectangle(110, 0, 20, 32),
		new PIXI.Rectangle(130, 0, 25, 20),
		new PIXI.Rectangle(360, 0, 306, 114),
		new PIXI.Rectangle(360, 114, 100, 15),
		new PIXI.Rectangle(360, 129, 80, 15),
		new PIXI.Rectangle(360, 144, 30, 15),
		new PIXI.Rectangle(825, 0, 13, 22),
		new PIXI.Rectangle(838, 0, 122, 35),
		new PIXI.Rectangle(860, 35, 100, 145),
		new PIXI.Rectangle(880, 180, 30, 12),
		new PIXI.Rectangle(895, 192, 15, 12),
		new PIXI.Rectangle(910, 180, 50, 138)
	],
	"2" : [
		new PIXI.Rectangle(860, 435, 100, 105),
		new PIXI.Rectangle(875, 420, 85, 15),
		new PIXI.Rectangle(890, 405, 70, 15),
		new PIXI.Rectangle(910, 390, 50, 15),
		new PIXI.Rectangle(925, 375, 35, 15),
		new PIXI.Rectangle(940, 360, 20, 15),
		new PIXI.Rectangle(845, 450, 15, 90),
		new PIXI.Rectangle(825, 460, 20, 80),
		new PIXI.Rectangle(735, 525, 95, 15),
		new PIXI.Rectangle(750, 507, 80, 18),
		new PIXI.Rectangle(765, 487, 65, 20)
	],
	"3" : [
		new PIXI.Rectangle(930, 80, 30, 70),
		new PIXI.Rectangle(0, 0, 127, 170),
		new PIXI.Rectangle(0, 215, 30, 70),
		new PIXI.Rectangle(127, 0, 12, 37),
		new PIXI.Rectangle(139, 0, 15, 23)
	],
	"common" : [
		new PIXI.Rectangle(-20, -20, 20, 580),
		new PIXI.Rectangle(960, -20, 20, 580),
		new PIXI.Rectangle(0, -20, 960, 36),
		new PIXI.Rectangle(0, 540, 960, 20)
	]
}

class MapsInfo extends SimpleUIInfo {

	constructor()
	{
		super();

		this._fMapId_int = undefined;
		this._fNextMapId_int = undefined;
		this._fAdditionalRestrictionZoneActivated_bl = false;
	}

	/*returns Array*/
	static getMapAssets(aMapId_int)
	{
		return MAPS_ASSETS[aMapId_int];
	}

	set mapId(aValue_int)
	{
		//TEMP solution...
		/*
		if (aValue_int > MAP_ID_DIF)
		{
			aValue_int -= MAP_ID_DIF;
		}

		if (isNaN(aValue_int) || aValue_int < 1 || aValue_int > TOTAL_MAPS_COUNT)
		{
			throw new Error(`MapId ${aValue_int} is out of range. The value in range [1, ${TOTAL_MAPS_COUNT}] is expected.`);
		}
		this._fMapId_int = aValue_int;
		*/
		//...TEMP solution

		//TEMP SOLUTION...
		let lArg_str = aValue_int + "";
		let lMultiplier_int = Math.pow(10, (lArg_str.length - 1));
		let lOffset_int = Math.trunc(aValue_int / lMultiplier_int) * lMultiplier_int;
		let lMapId_int = aValue_int - lOffset_int;

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
		/*
		//TEMP solution...
		if (aValue_int > MAP_ID_DIF)
		{
			aValue_int -= MAP_ID_DIF;
		}

		//...TEMP solution
		*/

		//TEMP SOLUTION...
		let lArg_str = aValue_int + "";
		let lMultiplier_int = Math.pow(10, (lArg_str.length - 1));
		let lOffset_int = Math.trunc(aValue_int / lMultiplier_int) * lMultiplier_int;
		let lMapId_int = aValue_int - lOffset_int;

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

	get currentMapCollisionRestrictedRects()
	{
		let lRestrictedRects = MAPS_COLLISION_RESTRICTED_ZONES["common"];

		let lSpecificRestrictedRects = MAPS_COLLISION_RESTRICTED_ZONES[this.mapId] || null;
		if (!!lSpecificRestrictedRects)
		{
			lRestrictedRects = lRestrictedRects.concat(lSpecificRestrictedRects);
		}		
		
		return lRestrictedRects; //array of rects;
	}

	destroy()
	{
		this._fMapId_int = undefined;
		this._fNextMapId_int = undefined;

		super.destroy();
	}

}

export default MapsInfo;
export { MAPS_ASSETS }