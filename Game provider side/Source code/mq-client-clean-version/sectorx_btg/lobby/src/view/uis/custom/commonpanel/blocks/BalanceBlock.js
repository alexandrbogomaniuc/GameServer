import GUSLobbyCPanelBalanceBlock from '../../../../../../../../common/PIXI/src/dgphoenix/gunified/view/uis/commonpanel/blocks/GUSLobbyCPanelBalanceBlock';

class BalanceBlock extends GUSLobbyCPanelBalanceBlock
{
	constructor(aIndicatorsUpdateTime_num)
	{
		super(aIndicatorsUpdateTime_num);
	}

	get __balanceCaptionTAssetName()
	{
		return "TACommonPanelBalanceLabel";
	}

	get __iconAssetName()
	{
		return "common_balance_icon";
	}
}

export default BalanceBlock