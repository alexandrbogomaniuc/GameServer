import CalloutInfo from "../CalloutInfo";

class CapsulesCalloutInfo extends CalloutInfo
{
	
	constructor(calloutId, priority)
	{
		super(calloutId, priority);

		this._fCapsulesIds_obj_arr = [];
	}

	i_checkCapsuleInQueue(aCapsuleId_str)
	{
		return this._fCapsulesIds_obj_arr && this._fCapsulesIds_obj_arr.some(e => e.capsuleName == aCapsuleId_str);
	}

	i_clearQueue()
	{
		this._fCapsulesIds_obj_arr = [];
	}

	i_addCapsule(aCapsuleInfo_obj)
	{
		return this._fCapsulesIds_obj_arr.push(aCapsuleInfo_obj);
	}

	i_getNextCapsuleInfo()
	{
		return this._fCapsulesIds_obj_arr.shift();
	}

	get queueLength()
	{
		return this._fCapsulesIds_obj_arr.length;
	}

	get soundName()
	{
		return "capsules_notification_banner";
	}

	destroy()
	{
		this._fCapsulesIds_obj_arr = null;
		super.destroy();
	}
}

export default CapsulesCalloutInfo;