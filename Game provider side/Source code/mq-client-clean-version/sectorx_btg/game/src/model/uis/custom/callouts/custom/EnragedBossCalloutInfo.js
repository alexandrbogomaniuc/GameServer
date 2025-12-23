import CalloutInfo from "../CalloutInfo";

class EnragedBossCalloutInfo extends CalloutInfo
{
	
	constructor(calloutId, priority)
	{
		super(calloutId, priority);
	}

	get soundName()
	{
		return "capsules_notification_banner";
	}
}

export default EnragedBossCalloutInfo;