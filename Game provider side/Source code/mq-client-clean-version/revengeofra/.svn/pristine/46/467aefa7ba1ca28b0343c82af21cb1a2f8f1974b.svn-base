import SimpleUIView from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/SimpleUIView';
import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import I18 from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
import Button from '../../../../../ui/LobbyButton';
import StakesMenu from './menu/StakesMenu';
import PlayerCollectionScreenPlayerView from './PlayerCollectionScreenPlayerView';
import WeaponsFrameView from './WeaponsFrame/WeaponsFrameView';
import PlayerCollectionScreenInfo from '../../../../../model/uis/custom/secondary/player_collection/PlayerCollectionScreenInfo';

class PlayerCollectionScreenView extends SimpleUIView
{
	static get EVENT_ON_CLOSE_BTN_CLICKED()					{ return "onCloseBtnClicked"; }
	static get EVENT_ON_FRAME_SWITCHED()					{ return "onFrameSwitched"; }
	static get EVENT_ON_SELECTED_STAKE_CHANGED()			{ return "EVENT_ON_SELECTED_STAKE_CHANGED"; }

	get weaponsScreenView()
	{
		return this._weaponsScreenView;
	}

	configureWeaponsScreenMode(aStake_num)
	{
		this.setStake(aStake_num);
		this._switchToWeapons();
	}

	setStake(aStake_num)
	{
		this._setStake(aStake_num);
	}

	updateStakes(aStakes_arr)
	{
		this._updateStakes(aStakes_arr);
	}

	show()
	{
		if (this._fMenu_qm)
		{
			this._fMenu_qm.onShow();
		}

		this._enableScroll();
		super.show();

		this._switchToWeapons();
	}

	hide()
	{
		this._disableScroll();
		super.hide();
	}

	updateCurrency(aCurrency_str)
	{
		this._updateCurrency(aCurrency_str);
	}

	updatePlayerData(aPlayerInfo_obj)
	{
		this._updatePlayerData(aPlayerInfo_obj);
	}

	onSomeBonusStateChanged()
	{
		this._onSomeBonusStateChanged();
	}

	constructor()
	{
		super();

		this._fWeaponsCaption_ta = null;
		this._fWeaponsIcon_sprt = null;

		this._fWeaponsScreenView_wssv = null;

		this._fPlayerView_qspv = null;
		this._fMenu_qm = null;
	}

	__init()
	{
		this._initPlayerCollectionScreenView();

		super.__init();

		if (APP.isMobile)
		{
			this.scale.set(1.2);
		}
	}

	_onSomeBonusStateChanged()
	{
		if (!this._fQuestsCaption_ta) return;

		if (!APP.isKeepSWModeActive)
		{
			this._switchToQuests();
		}
		else
		{
			this._switchToWeapons();
		}

		this._fSwitchButton_qssbv.visible = !!APP.isKeepSWModeActive;
		this._fMenu_qm.position.set(-286, APP.isKeepSWModeActive ? 30 : -5);
		this._fQuestsScreenView_qssv.position.set(-7, APP.isKeepSWModeActive ? 30 : 56);
	}

	_initPlayerCollectionScreenView()
	{
		this._initBackground();
		this._initCloseButton();

		this._initPlayerView();

		this._initMenu();
	}

	_initBackground()
	{
		this.addChild(APP.library.getSprite("quests/back"));

		this._fWeaponsCaption_ta = this.addChild(I18.generateNewCTranslatableAsset("TAPlayerCollectionScreenWeaponsCaption"));
		this._fWeaponsCaption_ta.position.set(-322, -173);
		this._fWeaponsCaption_ta.visible = false;

		this._fWeaponsIcon_sprt = this.addChild(APP.library.getSprite("quests/icon_gun"));
		this._fWeaponsIcon_sprt.position.set(-351, -171);
		this._fWeaponsIcon_sprt.visible = false;
	}

	_initCloseButton()
	{
		let lClose_btn = this.addChild(new Button("dialogs/exit_btn", null, true, undefined, undefined, Button.BUTTON_TYPE_CANCEL));
		lClose_btn.position.set(359, -172);
		lClose_btn.on("pointerclick", ()=>this.emit(PlayerCollectionScreenView.EVENT_ON_CLOSE_BTN_CLICKED), this);
	}

	_updateWeaponsInfoFromGame(aWeapons_arr)
	{
		let lPreparedWeapons_arr = [];

		for (let key in aWeapons_arr)
		{
			if (key != -1)
			{
				lPreparedWeapons_arr.push({id: key, shots: aWeapons_arr[key]});
			}
		}

		let lCurrentStake_num = APP.playerController.info.currentStake;
		this._fWeaponsScreenView_wssv.updateWeaponsInfoFromGame(lPreparedWeapons_arr, lCurrentStake_num);
	}

	_onWeaponsSelected()
	{
	}

	_switchToWeapons()
	{
		let selectedScreenId = PlayerCollectionScreenInfo.SCREENS.WEAPONS;

		this._updateCaption(selectedScreenId);

		this.emit(PlayerCollectionScreenView.EVENT_ON_FRAME_SWITCHED, {id: selectedScreenId});
	}

	_updateCaption(selectedScreenId)
	{
		this._fWeaponsCaption_ta.visible = selectedScreenId === PlayerCollectionScreenInfo.SCREENS.WEAPONS;
		this._fWeaponsIcon_sprt.visible = selectedScreenId === PlayerCollectionScreenInfo.SCREENS.WEAPONS;
	}

	_initPlayerView()
	{
		this._fPlayerView_qspv = this.addChild(new PlayerCollectionScreenPlayerView());
		this._fPlayerView_qspv.position.set(-345, -122);
	}

	_updateCurrency(aCurrency_str)
	{
		if (!this._fMenu_qm) return;

		this._fMenu_qm.updateCurrency(aCurrency_str);
	}

	_updatePlayerData(aPlayerInfo_obj)
	{
		if (!this._fPlayerView_qspv) return;

		this._fPlayerView_qspv.updateNickName(aPlayerInfo_obj.nickname);
	}

	_initMenu()
	{
		this._fMenu_qm = this.addChild(new StakesMenu());
		let lYOffset_num = -5;
		this._fMenu_qm.position.set(-286, lYOffset_num);

		this._fMenu_qm.on(StakesMenu.EVENT_ON_SELECTED_ITEM_CHANGED, this._onMenuSelectedItemChanged, this);

		let lStakes_arr = APP.playerController.info.stakes;
		if (!lStakes_arr) lStakes_arr = [];
		this._updateStakes(lStakes_arr);
	}

	_updateStakes(aStakes_arr)
	{
		this._fMenu_qm.updateStakes(aStakes_arr);

		this._setStake(aStakes_arr[0]);
	}

	_onMenuSelectedItemChanged(aEvent_obj)
	{
		this._changeStake(aEvent_obj.stake);
	}

	_changeStake(aStake_num)
	{
		this.emit(PlayerCollectionScreenView.EVENT_ON_SELECTED_STAKE_CHANGED, {stake: aStake_num});
	}

	_setStake(aStake_num)
	{
		this._fMenu_qm.setStake(aStake_num);
	}

	_enableScroll()
	{
		this._fMenu_qm && this._fMenu_qm.enableScroll();
	}

	_disableScroll()
	{
		this._fMenu_qm && this._fMenu_qm.disableScroll();
	}

	get _weaponsScreenView()
	{
		return this._fWeaponsScreenView_wssv || (this._fWeaponsScreenView_wssv = this._initWeaponsScreenView());
	}

	_initWeaponsScreenView()
	{
		let lWeaponsScreen_wssv = this.addChild(new WeaponsFrameView());
		lWeaponsScreen_wssv.position.set(166, 60);

		return lWeaponsScreen_wssv;
	}

	destroy()
	{
		if (this._fMenu_qm)
		{
			this._fMenu_qm.off(StakesMenu.EVENT_ON_SELECTED_ITEM_CHANGED, this._onMenuSelectedItemChanged, this);
		}

		this._fWeaponsScreenView_wssv && this._fWeaponsScreenView_wssv.destroy();
		this._fWeaponsScreenView_wssv = null;

		super.destroy();

		this._fWeaponsCaption_ta = undefined;
		this._fWeaponsIcon_sprt = undefined;

		this._fPlayerView_qspv = undefined;
		this._fMenu_qm = undefined;
	}
}

export default PlayerCollectionScreenView;