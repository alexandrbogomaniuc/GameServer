import SimpleUIView from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/SimpleUIView';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Timer from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';

import TooltipView from './TooltipView'
import GameField from '../../../../main/GameField';
import I18 from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
import { WEAPONS } from '../../../../../../shared/src/CommonConstants';
import { SEATS_POSITION_IDS } from './../../../../main/GameField';

class GameTooltipsView extends SimpleUIView
{
	static get EVENT_ON_TIP_SHOWN()				{ return TooltipView.EVENT_ON_TIP_SHOWN; }
	static get EVENT_ON_TIP_HIDED()				{ return TooltipView.EVENT_ON_TIP_HIDED; }
	static get EVENT_ON_TIPS_ENDED()			{ return "onTipsEnded"; }

	static get ID_AUTO_FIRE()					{ return 0; }
	static get ID_RIGHT_CLICK()					{ return 1; }
	static get ID_BET_LEVEL()					{ return 2; }
	static get ID_SPEC_WEAPONS_MASSIVE_DAMAGE()	{ return 3; }
	static get ID_TO_SWITCH_TO_BASE_WEAPON()	{ return 4; }
	

	static get DEFAULT_TIP_DURATION()			{ return TooltipView.DEFAULT_TIP_DURATION; } //milliseconds

	static get TIMEOUTS()
	{
		return [10, 10, 10, 10, 10];
	}

	startTooltips()
	{
		this._startTooltips();
	}

	resumeTooltips()
	{
		this._resumeTooltips();
	}

	pauseTooltips()
	{
		this._pauseTooltips();
	}

	stopTooltips()
	{
		this._stopTooltips();
	}

	get isPaused()
	{
		return this._fPaused_bln;
	}

	//INIT...
	constructor()
	{
		super();

		this._fTips_arr = [];
		this._fCurrentTooltipId_num = null;
		this._fNextTooltipTimer_tmr = null;
		this._fPaused_bln = false;
		this._fTipTimer_t = null;
		this._fIsWeaponsChanged_bl = false;

		this._init();

		APP.gameScreen.gameField.on(GameField.EVENT_ON_WEAPON_UPDATED, this._onWeaponUpdated, this);
	}

	_init()
	{
		if (APP.isMobile)
		{
			this._addTooltip({x: -180, y: -60},	"TATipsAutofireMobile",					"tips/left_click",			GameTooltipsView.ID_AUTO_FIRE);
			this._addTooltip({x: 258, y: -55},	APP.playerController.info.isDisableAutofiring ? "TATipsRightClickAutofireMobileDisableAutofire" : "TATipsRightClickAutofireMobile",		"TargetCrosshair_RED",	GameTooltipsView.ID_RIGHT_CLICK);
			this._addTooltip({x: 0, y: 135},	"TATipsBetLevel",					null,						GameTooltipsView.ID_BET_LEVEL);
			this._addTooltip({x: -290, y: 0},	"TATipsSpecialWeaponNewPlayer",			null,						GameTooltipsView.ID_SPEC_WEAPONS_MASSIVE_DAMAGE);
			this._addTooltip({x: 250, y: 204},	"TATipsSwitchToBaseWeapon",				"player_spot/turret_icon",	GameTooltipsView.ID_TO_SWITCH_TO_BASE_WEAPON);
		}
		else
		{
			this._addTooltip({x: -180, y: -60},	"TATipsAutofire",						"tips/left_click",			GameTooltipsView.ID_AUTO_FIRE);
			this._addTooltip({x: 203, y: -68},	APP.playerController.info.isDisableAutofiring ? "TATipsRightClickAutofireDisableAutofire" : "TATipsRightClickAutofire",				"TargetCrosshair_RED",		GameTooltipsView.ID_RIGHT_CLICK);
			this._addTooltip({x: 0, y: 155},	"TATipsBetLevel",						null,						GameTooltipsView.ID_BET_LEVEL);
			this._addTooltip({x: -290, y: 0},	"TATipsSpecialWeaponNewPlayer",			null,						GameTooltipsView.ID_SPEC_WEAPONS_MASSIVE_DAMAGE);
			this._addTooltip({x: 250, y: 225},	"TATipsSwitchToBaseWeapon",				"player_spot/turret_icon",	GameTooltipsView.ID_TO_SWITCH_TO_BASE_WEAPON);
		}
	}

	_addTooltip(aPos_obj, aTAsset_str, aTipAsset_str, aId_num, aOptTipDurationMs_num = GameTooltipsView.DEFAULT_TIP_DURATION)
	{
		let lTranslatableAssetPositionDescriptor_obj = I18.getTranslatableAssetDescriptor(aTAsset_str + "Position");
		let lX_num = aPos_obj.x;
		let lY_num = aPos_obj.y;

		if(lTranslatableAssetPositionDescriptor_obj)
		{
			let lPosition_obj = lTranslatableAssetPositionDescriptor_obj.areaInnerContentDescriptor._areaDescriptor;

			lX_num = lPosition_obj.x;
			lY_num = lPosition_obj.y;
		}

		let lTooltip_tv = new TooltipView(aTAsset_str, aId_num, aTipAsset_str, aOptTipDurationMs_num);
		lTooltip_tv.position.set(lX_num, lY_num);
		lTooltip_tv.visible = false;

		this.addChild(lTooltip_tv);

		this._fTips_arr.push(lTooltip_tv);

		lTooltip_tv.on(TooltipView.EVENT_ON_TIP_SHOWN, this._onTooltipShown, this);
		lTooltip_tv.on(TooltipView.EVENT_ON_TIP_HIDED, this._onTooltipHided, this);
	}
	//...INIT

	_onWeaponUpdated(aEvent_obj)
	{
		if(aEvent_obj.weaponId == WEAPONS.DEFAULT) return;

		this._fIsWeaponsChanged_bl = true;

		if (this._fCurrentTooltipId_num == GameTooltipsView.ID_TO_SWITCH_TO_BASE_WEAPON)
		{
			if (this._fTips_arr[this._fCurrentTooltipId_num] && !this._fTips_arr[this._fCurrentTooltipId_num].visible)
			{
				this._fTipTimer_t && this._fTipTimer_t.destructor();
				this._fTipTimer_t = new Timer(this._startTip.bind(this), GameTooltipsView.TIMEOUTS[this._fCurrentTooltipId_num]);
			}
		}
	}

	_startTooltips()
	{
		if (this._fTips_arr && this._fTips_arr.length > 0)
		{
			this._fCurrentTooltipId_num = APP.playerController.info.isDisableAutofiring ? 1 : 0;

			this._fTipTimer_t && this._fTipTimer_t.destructor();
			this._fTipTimer_t = new Timer(this._startTip.bind(this), GameTooltipsView.TIMEOUTS[this._fCurrentTooltipId_num]);
		}
	}

	_resumeTooltips()
	{
		this._fPaused_bln = false;

		if (this._fTips_arr && this._fTips_arr.length > 0)
		{
			this._fCurrentTooltipId_num = this._fCurrentTooltipId_num || (APP.playerController.info.isDisableAutofiring ? 1 : 0);

			if (this._fCurrentTooltipId_num == GameTooltipsView.ID_TO_SWITCH_TO_BASE_WEAPON)
			{
				if (!this._fIsWeaponsChanged_bl) return;
			}

			this._fTipTimer_t && this._fTipTimer_t.destructor();
			this._fTipTimer_t = new Timer(this._startTip.bind(this), GameTooltipsView.TIMEOUTS[this._fCurrentTooltipId_num]);
		}
	}

	_pauseTooltips()
	{
		this._fTipTimer_t && this._fTipTimer_t.destructor();
		this._fTipTimer_t = null;

		this._fPaused_bln = true;

		if (this._fTips_arr && this._fTips_arr[this._fCurrentTooltipId_num])
		{
			this._fTips_arr[this._fCurrentTooltipId_num].hideTip();
		}
	}

	_stopTooltips()
	{
		this._fTipTimer_t && this._fTipTimer_t.destructor();
		this._fTipTimer_t = null;

		this._fPaused_bln = false;

		if (this._fTips_arr && this._fTips_arr.length > 0 && this._fCurrentTooltipId_num !== null)
		{
			let lCurrentId_num = this._fCurrentTooltipId_num;
			this._fCurrentTooltipId_num = null;

			this._fTips_arr[lCurrentId_num].hideTip();
		}
	}

	_startTip()
	{
		if (this._fCurrentTooltipId_num !== null && this._fTips_arr && this._fTips_arr[this._fCurrentTooltipId_num])
		{
			let lTooltip_tv = this._fTips_arr[this._fCurrentTooltipId_num];
			let lPos_obj;

			if (this._fCurrentTooltipId_num == GameTooltipsView.ID_TO_SWITCH_TO_BASE_WEAPON)
			{
				lPos_obj = this._getBaseWeaponTipPosition();
			}
			else if (this._fCurrentTooltipId_num == GameTooltipsView.ID_BET_LEVEL)
			{
				lPos_obj = this._getBetTipPosition();
			}

			if (lPos_obj)
			{
				lTooltip_tv.position.set(lPos_obj.x, lPos_obj.y);
			}
			
			lTooltip_tv.showTip();
		}
	}

	_onTooltipShown(aEvent_obj)
	{
		let lTipId_num = aEvent_obj.id;
		this.emit(GameTooltipsView.EVENT_ON_TIP_SHOWN, {id: lTipId_num});
	}

	_onTooltipHided(aEvent_obj)
	{
		let lTipId_num = aEvent_obj.id;

		this.emit(GameTooltipsView.EVENT_ON_TIP_HIDED, {id: lTipId_num});

		this._tryNextTooltip();
	}

	_tryNextTooltip()
	{
		if (this._fPaused_bln) return;

		if (this._fCurrentTooltipId_num !== null)
		{
			++this._fCurrentTooltipId_num;
		}

		if (this._fCurrentTooltipId_num == GameTooltipsView.ID_AUTO_FIRE && APP.playerController.info.isDisableAutofiring)
		{
			this._tryNextTooltip();
			return;
		}

		if (this._fCurrentTooltipId_num == GameTooltipsView.ID_TO_SWITCH_TO_BASE_WEAPON)
		{
			if (!this._fIsWeaponsChanged_bl) return;
		}

		let lIsFrb_bln = APP.currentWindow.gameFrbController.info.frbMode;

		if (lIsFrb_bln && (this._fCurrentTooltipId_num == GameTooltipsView.ID_SPEC_WEAPONS_MASSIVE_DAMAGE || this._fCurrentTooltipId_num == GameTooltipsView.ID_BET_LEVEL))
		{
			this._tryNextTooltip();
			return;
		}

		if (this._fTips_arr[this._fCurrentTooltipId_num])
		{
			this._fTipTimer_t && this._fTipTimer_t.destructor();
			this._fTipTimer_t = new Timer(this._startTip.bind(this), GameTooltipsView.TIMEOUTS[this._fCurrentTooltipId_num]);
		}
		else
		{
			this._fCurrentTooltipId_num = null;
			this.emit(GameTooltipsView.EVENT_ON_TIPS_ENDED, {ignoreGlobalEnding: lIsFrb_bln});
		}
	}

	_getBetTipPosition()
	{
		let lPos_obj = APP.isMobile ? {x: 0, y: 135} : {x: 0, y: 155};
		let lPlayerPosId_num = SEATS_POSITION_IDS[APP.gameScreen.gameField ? (APP.gameScreen.gameField.seatId || 0) : 0];

		let lTA_str = APP.isMobile ? "TATipsBetLevelMobilePositionPlayer" : "TATipsBetLevelPositionPlayer";
		let lTranslatableAssetPositionDescriptor_obj = I18.getTranslatableAssetDescriptor(lTA_str + lPlayerPosId_num);
	
		if(lTranslatableAssetPositionDescriptor_obj)
		{
			let lPosition_obj = lTranslatableAssetPositionDescriptor_obj.areaInnerContentDescriptor._areaDescriptor;

			lPos_obj.x = lPosition_obj.x;
			lPos_obj.y = lPosition_obj.y;

			console.error(lPos_obj);
		}
		else
		{
			switch (lPlayerPosId_num)
			{
				case 5: lPos_obj = APP.isMobile ? {x: 349.5, y: -125} : {x: 349.5, y: -145}; break;
				case 4: lPos_obj = APP.isMobile ? {x: 0, y: -125} : {x: 0, y: -145}; break;
				case 3: lPos_obj = APP.isMobile ? {x: -349.5, y: -125} : {x: -349.5, y: -145}; break;
				case 2: lPos_obj = APP.isMobile ? {x: 349.5, y: 135} : {x: 349.5, y: 155}; break;
				case 1: lPos_obj = APP.isMobile ? {x: 0, y: 135} : {x: 0, y: 155}; break;
				case 0: lPos_obj = APP.isMobile ? {x: -349.5, y: 135} : {x: -349.5, y: 155}; break;
			}
		}

		return lPos_obj;
	}

	_getBaseWeaponTipPosition()
	{
		let lPos_obj = APP.isMobile ? {x: 250, y: 204} : {x: 250, y: 225};
		let lPlayerPosId_num = SEATS_POSITION_IDS[APP.gameScreen.gameField ? (APP.gameScreen.gameField.seatId || 0) : 0];
	
		let lTA_str = APP.isMobile ? "TATipsSwitchToBaseWeaponMobilePosition" : "TATipsSwitchToBaseWeaponPosition";
		let lTranslatableAssetPositionDescriptor_obj = I18.getTranslatableAssetDescriptor(lTA_str + lPlayerPosId_num);
	
		if(lTranslatableAssetPositionDescriptor_obj)
		{
			let lPosition_obj = lTranslatableAssetPositionDescriptor_obj.areaInnerContentDescriptor._areaDescriptor;

			lPos_obj.x = lPosition_obj.x;
			lPos_obj.y = lPosition_obj.y;
		}
		else
		{	
			switch (lPlayerPosId_num)
			{
				case 5: lPos_obj = APP.isMobile ? {x: 349.5, y: -125} : {x: 349.5, y: -145}; break;
				case 4: lPos_obj = APP.isMobile ? {x: 250, y: -194} : {x: 250, y: -215}; break;
				case 3: lPos_obj = APP.isMobile ? {x: -82, y: -194} : {x: -82, y: -215}; break;
				case 2: lPos_obj = APP.isMobile ? {x: 349.5, y: 135} : {x: 349.5, y: 155}; break;
				case 1: lPos_obj = APP.isMobile ? {x: 250, y: 204} : {x: 250, y: 225}; break;
				case 0: lPos_obj = APP.isMobile ? {x: -82, y: 204} : {x: -82, y: 225}; break;
			}
		}
		return lPos_obj;
	}

	destroy()
	{
		APP.gameScreen.gameField.off(GameField.EVENT_ON_WEAPON_UPDATED, this._onWeaponUpdated, this);

		this._fTipTimer_t && this._fTipTimer_t.destructor();

		super.destroy();

		this._fTips_arr = null;
		this._fCurrentTooltipId_num = null;
		this._fNextTooltipTimer_tmr = null;
		this._fPaused_bln = null;
		this._fTipTimer_t = null;
		this._fIsWeaponsChanged_bl = null;
	}
}

export default GameTooltipsView;