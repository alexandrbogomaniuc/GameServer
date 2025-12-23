import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sprite from '../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import I18 from '../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
import Button from '../../ui/LobbyButton';
import * as Easing from '../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import LobbyBulletRangeCostIndicatorView from '../../view/uis/custom/indicators/LobbyBulletRangeCostIndicatorView';
import RoomIndicatorButton from './RoomIndicatorButton';
import Timer from '../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import Sequence from '../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import LobbyAPP from './../../LobbyAPP';

class RoomButtom extends Sprite
{
	static get EVENT_LOBBY_ROOM_STAKE_SELECTED()					{return "onLobbyRoomStakeSelected";}
	
	static get EVENT_LOBBY_ROOM_WEAPONS_INDICATOR_CLICK()			{return "onRoomWeaponsIndicatorClick"};

	static get INIT_X()							{return 96;}
	static get VISIBLE_OFFSET_X()				{return 170;}
	static get INVISIBLE_OFFSET_X()				{return 240;}
	static get VISIBLE_AMOUNT()					{return 5;}

	updateStake(aStake_num)
	{
		this._updateStake(aStake_num);
	}

	updateIndicators(aWeaponsValue_num)
	{
		this._updateIndicators(aWeaponsValue_num);
	}

	updateWeaponsIndicator(aWeaponsValue_num)
	{
		this._updateWeaponsIndicator(aWeaponsValue_num);
	}

	disableRoomBtn()
	{
		if (!this._fButton_b.enabled) return;
		// see https://jira.dgphoenix.com/browse/MQPRT-12
		// 'interactive' value is invalidating after any listeners removing, and can be set to 'true' on the higher level (see Sprite.js, removeListener function)
		// so we must avoid situations where removing listeners (off) happens after 'interactive' was set to 'false' by ourselves

		if (this._fBulletCostIndicatorView_bciv && !window.isWebGLSupported)
		{
			this._fBulletCostIndicatorView_bciv.position.set(80, 163);
		}

		this._disableButtonInteraction();
		this._disableRoomBtn();

		this._fBulletCostIndicatorView_bciv && (this._fBulletCostIndicatorView_bciv.visible = false);
	}

	enableRoomBtn()
	{
		if (this._fButton_b.enabled) {
			return;	
		}

		if (this._fBulletCostIndicatorView_bciv) 
		{
			if (!window.isWebGLSupported)
			{
				this._fBulletCostIndicatorView_bciv.position.set(0, 83);
			}

			this._fBulletCostIndicatorView_bciv.visible = true;
		}

		this._enableRoomBtn();
		this._enableButtonInteraction();
	}

	get enabled()
	{
		return this._fButton_b.enabled;
	}

	updateOverState(lobbyScreenVisible_bl)
	{
		if (lobbyScreenVisible_bl)
		{
			this._tryToShowGlow();
		}
		else
		{
			this._hideGlow();
		}
	}

	get stake()
	{
		return this._fButtonStake_num;
	}

	updatePosition(aIndex_int, aSkipAnimation_bl)
	{
		this._updatePosition(aIndex_int, aSkipAnimation_bl);
	}

	constructor(aButtonTexture, aPersonalPosition_int)
	{
		super();

		this._fButtonTexture_str = aButtonTexture;
		this._fButtonStake_num = null;
		this._fBulletCostIndicatorView_bciv = null;
		this._fButton_b = null;
		this._fStateIndicator_lbci = null;
		this._fNotEnoughMoneyCapture_cta = null;
		this._fPosition_int = aPersonalPosition_int;

		this._fWeaponsIndicator_b = null;

		this._addBack();
		let lHolderHeightBeforAddIndicator_num = this._fButton_b.holder.getBounds().height;

		this._initStateIndicator();
		this._addNotEnoughMoneyCapture();
		this._addRoomIndicators();

		let lHolderHeightAfterAddIndicator_num = this._fButton_b.holder.getBounds().height;
		this._fDisaibledViewCorrection_num = lHolderHeightAfterAddIndicator_num - lHolderHeightBeforAddIndicator_num;

		this._enableButtonInteraction();

		APP.on(LobbyAPP.EVENT_ON_SOME_BONUS_STATE_CHANGED, this._onSomeBonusStateChanged, this);
	}

	_onSomeBonusStateChanged()
	{
		if (this._fWeaponsIndicator_b)
		{
			this._fWeaponsIndicator_b.visible = !!APP.isKeepSWModeActive;
		}
	}

	_addBack()
	{
		let shadow = this.addChild(APP.library.getSprite("lobby/button_incons/shadow"));
		shadow.position.set(0, 15);

		this._fButton_b = this.addChild(new Button(this._fButtonTexture_str, null, true));
		this._fButton_b.on("pointerclick", this._onRoomBtnClicked, this);
		this._fButton_b.on("pointerdown", this._onRoomBtnDown, this);

		this._fGlow_spr = this._fButton_b.holder.addChild(APP.library.getSprite("lobby/button_incons/glow"));
		this._fGlow_spr.visible = false;
	}

	_addNotEnoughMoneyCapture()
	{
		this._fNotEnoughMoneyCapture_cta = this.addChild(I18.generateNewCTranslatableAsset('TALobbyRoomBtnNotEnoughMoneyCapture'));
		this._fNotEnoughMoneyCapture_cta.position.set(0, 115);
		this._fNotEnoughMoneyCapture_cta.visible = false;
	}

	_addRoomIndicators()
	{
		this._fWeaponsIndicator_b = this.addChild(new RoomIndicatorButton("common_btn_fire_settings"));
		this._fWeaponsIndicator_b.on("pointerdown", this._onRoomInsicatorBtnDown, this);
		this._fWeaponsIndicator_b.on("pointerclick", this._onRoomWeaponsIndicatorClick, this);
		this._fWeaponsIndicator_b.on("mouseover", this._onWeaponsIndicatorMouseover, this);
		this._fWeaponsIndicator_b.on("mouseout", this._onWeaponsIndicatorMouseout, this);
		APP.isMobile && this._fWeaponsIndicator_b.setHitArea(new PIXI.Rectangle(-22 * 1.5, -9 * 2, 44 * 1.5, 18 * 2));
		this._fWeaponsIndicator_b.position.set(52, -61);

		if (!APP.isKeepSWModeActive)
		{
			this._fWeaponsIndicator_b.visible = false;
		}
	}

	_onRoomWeaponsIndicatorClick()
	{
		this.emit(RoomButtom.EVENT_LOBBY_ROOM_WEAPONS_INDICATOR_CLICK, {value: this.stake})
	}

	_onWeaponsIndicatorMouseover()
	{
		this._fWeaponsIndicator_b.setSelectedView(true);
	}

	_onWeaponsIndicatorMouseout()
	{
		this._fWeaponsIndicator_b.setBaseView(true);
	}

	_disableRoomBtn()
	{
		this._hideGlow();
		this._fButton_b && (this._fButton_b.enabled = false);
		this._fNotEnoughMoneyCapture_cta && (this._fNotEnoughMoneyCapture_cta.visible = true);
	}

	_enableRoomBtn()
	{
		if (this._fButton_b)
		{
			this._fButton_b.enabled = true;

			this._tryToShowGlow();
		}
		this._fNotEnoughMoneyCapture_cta && (this._fNotEnoughMoneyCapture_cta.visible = false);
	}

	_tryToShowGlow()
	{
		if (!this._fButton_b)
		{
			return;
		}

		let lLocalMouse_obj = this._fButton_b.toLocal(APP.stage.renderer.plugins.interaction.mouse.global);
		let lIsHit_bln = this._fButton_b.hitArea.contains(lLocalMouse_obj.x, lLocalMouse_obj.y);

		if (lIsHit_bln && this._fButton_b.enabled)
		{
			this._showGlow();
		}
	}

	_showGlow()
	{
		this._fGlow_spr.visible = true;

		this._fWeaponsIndicator_b.setSelectedView();
	}

	_hideGlow()
	{
		this._fGlow_spr.visible = false;

		this._fWeaponsIndicator_b.setBaseView();
	}

	_onRoomBtnClicked()
	{
		this.emit(RoomButtom.EVENT_LOBBY_ROOM_STAKE_SELECTED, {value: this.stake})
	}

	_onRoomBtnDown()
	{
		this._fWeaponsIndicator_b.scale.set(0.95);
		this._fWeaponsIndicator_b.position.x = 52 - 3;
		this._fWeaponsIndicator_b.position.y = -61 + 3;

		this._addDocumentEventListeners();
	}

	pointerupHandler()
	{
		this._fButton_b.handleUp();
		
		this._fWeaponsIndicator_b.handleUp();

		this._fWeaponsIndicator_b.scale.set(1);
		this._fWeaponsIndicator_b.position.x = 52;
		this._fWeaponsIndicator_b.position.y = -61;

		this._removeEventListeners();
	}

	_onRoomInsicatorBtnDown()
	{
		this._addDocumentEventListeners();
	}

	_addDocumentEventListeners()
	{
		if(!!window.PointerEvent)
		{
			document.addEventListener("pointerup", this.pointerupHandler.bind(this));
		}
		else
		{
			document.addEventListener("mouseup", this.pointerupHandler.bind(this));
			document.addEventListener("touchend", this.pointerupHandler.bind(this));
		}
	}

	_removeEventListeners()
	{
		if(!!window.PointerEvent)
		{
			document.removeEventListener("pointerup", this.pointerupHandler.bind(this));
		}
		else
		{
			document.removeEventListener("mouseup", this.pointerupHandler.bind(this));
			document.removeEventListener("touchend", this.pointerupHandler.bind(this));
		}
	}

	_initStateIndicator()
	{
		this._fBulletCostIndicatorView_bciv = this._fButton_b.holder.addChild(new LobbyBulletRangeCostIndicatorView());
		this._fBulletCostIndicatorView_bciv.position.set(0, 83);

		return this._fBulletCostIndicatorView_bciv;
	}

	get _fStateIndicator()
	{
		return this._fBulletCostIndicatorView_bciv || (this._fBulletCostIndicatorView_bciv = this._initStateIndicator());
	}

	_updateStake(aStake)
	{
		this._fButtonStake_num = aStake;

		this._fStateIndicator.updateStake(this._fButtonStake_num);
	}

	_updateIndicators(aWeaponsValue_num)
	{
		this._fWeaponsIndicator_b && this._fWeaponsIndicator_b.update(aWeaponsValue_num);
	}

	_updateWeaponsIndicator(aWeaponsValue_num)
	{
		this._fWeaponsIndicator_b && this._fWeaponsIndicator_b.update(aWeaponsValue_num);
	}

	_updatePosition(aIndex_int, aSkipAnimation_bl = false)
	{
		let lX_num = RoomButtom.INIT_X;
		let lIndexOffset_int = this._fPosition_int - aIndex_int;

		if (lIndexOffset_int < 0)
		{
			lX_num -= RoomButtom.INVISIBLE_OFFSET_X * (lIndexOffset_int < -1 ? 2 : 1);
		}
		else if (lIndexOffset_int < RoomButtom.VISIBLE_AMOUNT)
		{
			lX_num += lIndexOffset_int * RoomButtom.VISIBLE_OFFSET_X;
		}
		else
		{
			lX_num += (RoomButtom.VISIBLE_AMOUNT - 1) * RoomButtom.VISIBLE_OFFSET_X + RoomButtom.INVISIBLE_OFFSET_X * (lIndexOffset_int > RoomButtom.VISIBLE_AMOUNT ? 2 : 1);
		}

		this.removeTweens();
		if (aSkipAnimation_bl) this.position.set(lX_num, 0);
		else this.moveTo(lX_num, 0, 300, Easing.sine.easeInOut);
	}

	_disableButtonInteraction()
	{
		this._fButton_b.off("mouseover", this._showGlow, this);
		this._fButton_b.off("mouseout", this._hideGlow, this);
	}

	_enableButtonInteraction()
	{
		this._fButton_b.on("mouseover", this._showGlow, this);
		this._fButton_b.on("mouseout", this._hideGlow, this);
	}

	destroy()
	{
		APP.off(LobbyAPP.EVENT_ON_SOME_BONUS_STATE_CHANGED, this._onSomeBonusStateChanged, this);

		this._fButtonTexture_str = null;
		this._fButtonStake_num = null;
		this._fBulletCostIndicatorView_bciv = null;
		this._fButton_b = null;
		this._fStateIndicator_lbci = null;
		this._fDisaibledViewCorrection_num = null;
		this._fWeaponsIndicator_b = null;

		this._disableButtonInteraction();

		super.destroy();
	}
}

export default RoomButtom;