import GUSLobbyCPanelBalanceBlock from '../../../../../../../../common/PIXI/src/dgphoenix/gunified/view/uis/commonpanel/blocks/GUSLobbyCPanelBalanceBlock';
import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { LOBBY_MESSAGES } from '../../../../../controller/external/LobbyExternalCommunicator';
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

	_setBalance(aValue_num)
	{
		let  difference = 0;
		if(APP.gameState != "PLAY" && this._fBalanceValue_num != null && this._fBalanceValue_num != aValue_num)
		{
			difference = aValue_num - this._fBalanceValue_num;
			if(difference < 0) difference = difference * -1; 
			console.log(" BalanceProblem: lobby updating the balance difference " + difference);
			APP.externalCommunicator.sendExternalMessage(LOBBY_MESSAGES.END_OF_GAME_REFUND, {refund:difference});
		}

		super._setBalance(aValue_num);


	}
}

export default BalanceBlock