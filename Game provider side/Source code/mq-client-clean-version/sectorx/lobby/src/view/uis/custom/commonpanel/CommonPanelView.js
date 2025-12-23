import GUSLobbyCommonPanelView from '../../../../../../../common/PIXI/src/dgphoenix/gunified/view/uis/commonpanel/GUSLobbyCommonPanelView';
import TimeBlock from './blocks/TimeBlock';
import BalanceBlock from './blocks/BalanceBlock';
import WinBlock from './blocks/WinBlock';
import InfoBlock from './blocks/InfoBlock';
import GroupMenuButton from './buttons/GroupMenuButton';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';

class CommonPanelView extends GUSLobbyCommonPanelView
{
	//INIT...
	constructor()
	{
		super();
	}

	__provideTimeBlockInstance()
	{
		return new TimeBlock(this.uiInfo.timeFromServer, this.uiInfo.timerFrequency);
	}

	__provideBalanceBlockInstance()
	{
		return new BalanceBlock(this.uiInfo.gameIndicatorsUpdateTime);
	}

	__provideWinBlockInstance()
	{
		return new WinBlock(this.uiInfo.gameIndicatorsUpdateTime);
	}

	__provideInfoBlockInstance()
	{
		return new InfoBlock();
	}

	get __homeBtnAssetName()
	{
		return "common_btn_home";
	}

	get __historyBtnAssetName()
	{
		return "common_btn_history";
	}

	get __fireSettingsBtnAssetName()
	{
		return "common_btn_fire_settings";
	}

	get __infoBtnAssetName()
	{
		return "common_btn_info";
	}

	get __settingsBtnAssetName()
	{
		return "common_btn_settings";
	}

	get __backToLobbyBtnAssetName()
	{
		return "common_btn_back";
	}

	get __groupBtnAssetName()
	{
		return "common_btn_group";
	}

	get __groupMenuCaptionTAssetName()
	{
		return "TACommonPanelMenuLabel";
	}

	__provideGroupMenuBtnInstance()
	{
		return new GroupMenuButton(this.__groupBtnAssetName, this.__groupMenuCaptionTAssetName, true);
	}

	_updateUI(){
		super._updateUI();
		this._fLobbyCaption_cta.visible = false;
		this._fFireSettingsButton_btn.visible = this.uiInfo.gameUIVisible && APP.isAutoFireMode;
	}
}

export default CommonPanelView;