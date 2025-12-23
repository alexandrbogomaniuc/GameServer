import GUSLobbyCPanelWinBlock from '../../../../../../../../common/PIXI/src/dgphoenix/gunified/view/uis/commonpanel/blocks/GUSLobbyCPanelWinBlock';

class WinBlock extends GUSLobbyCPanelWinBlock
{
	constructor(aIndicatorsUpdateTime_num)
	{
		super(aIndicatorsUpdateTime_num);
	}

	get __iconAssetName()
	{
		return "common_win_icon";
	}
}

export default WinBlock