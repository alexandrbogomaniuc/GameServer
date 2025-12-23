import GUSLobbyCPanelTimeBlock from '../../../../../../../../common/PIXI/src/dgphoenix/gunified/view/uis/commonpanel/blocks/GUSLobbyCPanelTimeBlock';

class TimeBlock extends GUSLobbyCPanelTimeBlock
{
	constructor(aTimeFromServer_num, aTimerFrequency_num)
	{
		super(aTimeFromServer_num, aTimerFrequency_num);
	}

	get __iconAssetName()
	{
		return "common_time_icon";
	}
}

export default TimeBlock