import SimpleUIInfo from '../../../../../../common/PIXI/src/dgphoenix/unified/model/uis/SimpleUIInfo';
import MAPS_ASSETS from '../../../config/maps_assets.json';

const TOTAL_MAPS_COUNT = 6;
const MAP_SCALE = 1.026;
const MAP_ID_DIF = 500;

const MAPS_WALKING_ZONES = {
	"4" : [
		34, 154,
		122, 203,
		184, 203,
		255, 172,
		247, 0,
		569, 0,
		532, 121,
		574, 149,
		673, 95,
		719, 143,
		685, 189,
		736, 228,
		837, 172,
		871, 201,
		830, 264,
		885, 305,
		960, 275,
		960, 540,
		836, 540,
		750, 463,
		652, 485,
		663, 540,
		0, 540,
		0, 270,
		62, 233
	],
	"5" : [
		0, 540,
		960, 540,
		960, 524,
		837, 498,
		837, 425,
		899, 358,
		960, 369,
		950, 315,
		659, 170,
		670, 0,
		662, 0,
		438, 114,
		343, 75,
		214, 173,
		28, 96,
		79, 227,
		0, 273
	],
	"6" : [
		0, 540,
		960, 540,
		960, 0,
		960, 20,
		726, 166,
		546, 72,
		547, 0,
		489, 0,
		292, 116,
		207, 82,
		226, 300,
		0, 427
	],
};

const MAPS_COLLISION_RESTRICTED_ZONES = {
	"4" : [
		new PIXI.Rectangle(0, 150, 6, 90),
		new PIXI.Rectangle(6, 172, 6, 65),
		new PIXI.Rectangle(200, 0, 15, 130),
		new PIXI.Rectangle(215, 60, 12, 70),
		new PIXI.Rectangle(592, 0, 68, 90),
		new PIXI.Rectangle(577, 45, 15, 75),
		new PIXI.Rectangle(590, 88, 30, 18),
		new PIXI.Rectangle(565, 88, 15, 18),
		new PIXI.Rectangle(738, 0, 80, 166),
		new PIXI.Rectangle(866, 0, 94, 128),
		new PIXI.Rectangle(690, 505, 90, 35),
		new PIXI.Rectangle(780, 520, 20, 20)
	],
	"5" : [
		new PIXI.Rectangle(0, 0, 7, 220),
		new PIXI.Rectangle(7, 115, 8, 105),
		new PIXI.Rectangle(711, 52, 10, 67),
		new PIXI.Rectangle(720, 0, 240, 120)
	],
	"6" : [
		new PIXI.Rectangle(0, 0, 190, 285),
		new PIXI.Rectangle(190, 200, 10, 80),
		new PIXI.Rectangle(953, 0, 7, 540),
		new PIXI.Rectangle(948, 0, 5, 142),
		new PIXI.Rectangle(945, 0, 3, 50),
		new PIXI.Rectangle(948, 160, 5, 10),
		new PIXI.Rectangle(943, 330, 10, 20),
		new PIXI.Rectangle(930, 442, 23, 100),
		new PIXI.Rectangle(937, 438, 16, 4),
		new PIXI.Rectangle(925, 448, 8, 80),
		new PIXI.Rectangle(917, 453, 8, 40),
		new PIXI.Rectangle(909, 458, 8, 30),
		new PIXI.Rectangle(888, 525, 50, 5)
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
		if (aValue_int > MAP_ID_DIF)
		{
			aValue_int -= MAP_ID_DIF;
		}

		//...TEMP solution
		if (isNaN(aValue_int) || aValue_int < 1 || aValue_int > TOTAL_MAPS_COUNT)
		{
			throw new Error(`MapId ${aValue_int} is out of range. The value in range [1, ${TOTAL_MAPS_COUNT}] is expected.`);
		}
		this._fMapId_int = aValue_int;
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
		//TEMP solution...
		if (aValue_int > MAP_ID_DIF)
		{
			aValue_int -= MAP_ID_DIF;
		}

		//...TEMP solution
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