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

	_formatMoneyValue(aValue_num)
	{

		let preFormat = super._formatMoneyValue(aValue_num);
		if(preFormat.indexOf(".00 ")>-1){
			preFormat = preFormat.replace(".00", "");
		}
		return preFormat;
	}


}

export default WinBlock