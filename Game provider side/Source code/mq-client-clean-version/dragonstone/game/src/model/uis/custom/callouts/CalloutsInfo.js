import SimpleUIInfo from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/uis/SimpleUIInfo';
import CalloutInfo from './CalloutInfo';
import OgreCalloutInfo from './custom/OgreCalloutInfo';
import DarkKnightCalloutInfo from './custom/DarkKnightCalloutInfo';
import CerberusCalloutInfo from './custom/CerberusCalloutInfo';
import CollectFragmentsInfo from './custom/CollectFragmentsInfo';
import TimesRunningOutInfo from './custom/TimesRunningOutInfo';


let calloutIdCounter = 0;

let CALLOUT_ID_ORGE									= calloutIdCounter++; //0
let CALLOUT_ID_DARK_KNIGHT							= calloutIdCounter++; //1
let CALLOUT_ID_CERBERUS								= calloutIdCounter++; //2
let CALLOUT_ID_COLLECT_FRAGMENTS					= calloutIdCounter++; //3
let CALLOUT_ID_TIMES_RUNNING_OUT					= calloutIdCounter++; //4

let CALLOUTS_AMOUNT = calloutIdCounter;

class CalloutsInfo extends SimpleUIInfo
{
	static get CALLOUT_ID_ORGE() 					{ return CALLOUT_ID_ORGE;}
	static get CALLOUT_ID_DARK_KNIGHT() 			{ return CALLOUT_ID_DARK_KNIGHT;}
	static get CALLOUT_ID_CERBERUS() 				{ return CALLOUT_ID_CERBERUS;}
	static get CALLOUT_ID_COLLECT_FRAGMENTS() 		{ return CALLOUT_ID_COLLECT_FRAGMENTS;}
	static get CALLOUT_ID_TIMES_RUNNING_OUT() 		{ return CALLOUT_ID_TIMES_RUNNING_OUT;}

	constructor()
	{
		super();

		this._calloutsInfos = null;
		this._calloutIdForPresentation = undefined;

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

	get calloutIdForPresentation ()
	{
		return this._calloutIdForPresentation;
	}

	set calloutIdForPresentation (calloutId)
	{
		this._calloutIdForPresentation = calloutId;
	}

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

	get hasActiveCallout ()
	{
		var calloutsAmount = this.calloutsCount;
		for (var i = 0; i < calloutsAmount; i++)
		{
			if (this._getCalloutInfo(i).isActive)
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
			case CalloutsInfo.CALLOUT_ID_ORGE:
				calloutInfo = new OgreCalloutInfo(calloutId, 0);
				break;
			case CalloutsInfo.CALLOUT_ID_DARK_KNIGHT:
				calloutInfo = new DarkKnightCalloutInfo(calloutId, 0);
				break;
			case CalloutsInfo.CALLOUT_ID_CERBERUS:
				calloutInfo = new CerberusCalloutInfo(calloutId, 0);
				break;
			case CalloutsInfo.CALLOUT_ID_COLLECT_FRAGMENTS:
				calloutInfo = new CollectFragmentsInfo(calloutId, 1);
				break;
			case CalloutsInfo.CALLOUT_ID_TIMES_RUNNING_OUT:
				calloutInfo = new TimesRunningOutInfo(calloutId, 1);
				break;
			default:
				throw new Error (`Unsupported callout id: ${calloutId}`);
		}
		return calloutInfo;
	}
}

export default CalloutsInfo