import SimpleUIInfo from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/uis/SimpleUIInfo';
import TimesRunningOutInfo from './custom/TimesRunningOutInfo';
import CapsulesCalloutInfo from './custom/CapsulesCalloutInfo';
import EnragedBossCalloutInfo from './custom/EnragedBossCalloutInfo';


let calloutIdCounter = 0;

let CALLOUT_ID_TIMES_RUNNING_OUT					= calloutIdCounter++; //0
let CALLOUT_ID_CAPSULE_APPEARANCE					= calloutIdCounter++; //1
let CALLOUT_ID_BOSS_IS_ENRAGED						= calloutIdCounter++; //2

let CALLOUTS_AMOUNT = calloutIdCounter;

class CalloutsInfo extends SimpleUIInfo
{
	static get CALLOUT_ID_TIMES_RUNNING_OUT() 		{ return CALLOUT_ID_TIMES_RUNNING_OUT;}
	static get CALLOUT_ID_CAPSULE_APPEARANCE() 		{ return CALLOUT_ID_CAPSULE_APPEARANCE;}
	static get CALLOUT_ID_BOSS_IS_ENRAGED() 		{ return CALLOUT_ID_BOSS_IS_ENRAGED;}

	constructor()
	{
		super();

		this._calloutsInfos = null;
		this._fCalloutsIdsForPresentation_arr = [];

		this._initCalloutsInfo();
	}

	destroy()
	{
		this._calloutsInfos = null; 

		super.destroy();
	}

	getCalloutInfo (calloutId)
	{
		return this._getCalloutInfo(calloutId);
	}

	get calloutsCount ()
	{
		return CALLOUTS_AMOUNT;
	}

	// ACTIVE CALLOUTS ARR...
	get calloutIdsForPresentation ()
	{
		return this._fCalloutsIdsForPresentation_arr;
	}

	set calloutIdsForPresentation (aIds_arr)
	{
		this._fCalloutsIdsForPresentation_arr = aIds_arr;
	}
	//...ACTIVE CALLOUTS ARR

	hasActiveCalloutWithId(aCalloutId_int)
	{
		var calloutsAmount = this.calloutsCount;
		for (var i = 0; i < calloutsAmount; i++)
		{
			if (
				this._getCalloutInfo(i).isActive &&
				aCalloutId_int === this._getCalloutInfo(i).calloutId
			)
			{
				return true;
			}
		}
		return false;
	}

	_initCalloutsInfo()
	{
		this._calloutsInfos = [];
	}

	_getCalloutInfo (calloutId)
	{
		return this._calloutsInfos[calloutId] || this._initCalloutInfo(calloutId);
	}

	_initCalloutInfo (calloutId)
	{
		var calloutInfo = this.__generateCalloutInfo(calloutId);

		this._calloutsInfos[calloutId] = calloutInfo;

		return calloutInfo;
	}

	__generateCalloutInfo (calloutId)
	{
		var calloutInfo = null;
		switch (calloutId)
		{
			case CalloutsInfo.CALLOUT_ID_TIMES_RUNNING_OUT:
				calloutInfo = new TimesRunningOutInfo(calloutId, 0);
				break;
			case CalloutsInfo.CALLOUT_ID_BOSS_IS_ENRAGED:
				calloutInfo = new EnragedBossCalloutInfo(calloutId, 1);
				break;
			case CalloutsInfo.CALLOUT_ID_CAPSULE_APPEARANCE:
				calloutInfo = new CapsulesCalloutInfo(calloutId, 2);
				break;
			default:
				throw new Error (`Unsupported callout id: ${calloutId}`);
		}
		return calloutInfo;
	}
}

export default CalloutsInfo