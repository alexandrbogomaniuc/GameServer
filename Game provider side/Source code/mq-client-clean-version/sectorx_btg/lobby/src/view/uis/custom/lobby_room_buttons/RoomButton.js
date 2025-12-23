import GUSLobbyRoomButton from '../../../../../../../common/PIXI/src/dgphoenix/gunified/view/uis/lobby_room_buttons/GUSLobbyRoomButton';
import { DropShadowFilter } from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Filters';
import CompositeHitArea from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/CompositeHitArea';
import TextField from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/TextField';
import LobbyBulletRangeCostIndicatorView from './LobbyBulletRangeCostIndicatorView';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';

const STAKE_POS = 
[
	{x: 11, y: 66},
	{x: -4, y: 77},
	{x: 5, y: 85},
	{x: 15, y: 100},
	{x: 29, y: 85}
];

const NOT_ENOUGH_MONEY_CAPTIONS_POSITIONS = [
	{x: 13, y: 86},
	{x: 0, y: 98},
	{x: 6, y: 106},
	{x: 14, y: 128},
	{x: 29, y: 115}
];


const BUTTONS_CIRCLE_AREAS = [
	new PIXI.Circle(10, -6, 72),
	new PIXI.Circle(-4, -4, 76),
	new PIXI.Circle(3, 8, 79),
	new PIXI.Circle(12, 0, 105),
	new PIXI.Circle(28, -25, 104)
];

const BUTTONS_RECTANGLE_AREAS = [
	new PIXI.Rectangle( -55, 45, 130, 35),
	new PIXI.Rectangle( -72, 55, 138, 37),
	new PIXI.Rectangle( -63, 60, 137, 40),
	new PIXI.Rectangle( -75, 75, 180, 45),
	new PIXI.Rectangle( -65, 45, 188, 65),
];

class RoomButtom extends GUSLobbyRoomButton
{
	static get INIT_X()							{return 96;}
	static get VISIBLE_OFFSET_X()				{return 165;}
	static get INVISIBLE_OFFSET_X()				{return 340;}
	static get VISIBLE_AMOUNT()					{return 5;}

	static get SKIN_ID_IRON()	{ return 0 }
	static get SKIN_ID_BRONZE()	{ return 1 }
	static get SKIN_ID_LEAD()	{ return 2 }
	static get SKIN_ID_SILVER()	{ return 3 }
	static get SKIN_ID_GOLD()	{ return 4 }

	
	constructor(aPersonalPosition_int)
	{
		super(aPersonalPosition_int);
	}

	_initButton(aSkinId_int)
	{
		let l_btn = super._initButton(aSkinId_int);

		if (
				(aSkinId_int == 0 || aSkinId_int == 3) &&
				APP.profilingController.info.isVfxProfileValueMediumOrGreater
			)
		{
			this._fCardsContainer_s.filters = [new DropShadowFilter({color: 0x000000, rotation: 90, distance: 17, blur: 1, alpha: 0.41, resolution: 2})]
		}

		this.hitArea = new CompositeHitArea();
		this.hitArea.add(BUTTONS_CIRCLE_AREAS[aSkinId_int]);
		this.hitArea.add(BUTTONS_RECTANGLE_AREAS[aSkinId_int]);

		return l_btn;
	}

	get __cardTextureNamePrefix()
	{
		return "lobby/button_incons/lobby_room_level_";
	}

	get __notEnoughMoneyCaptureAssetId()
	{
		return 'TALobbyRoomBtnNotEnoughMoneyCapture';
	}

	_addNotEnoughMoneyCapture(aCurrentSkin_num)
	{
		super._addNotEnoughMoneyCapture(aCurrentSkin_num);

		if (this._fNotEnoughMoneyCapture_cta)
		{
			if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
			{
				this._fNotEnoughMoneyCapture_cta.filters = [new DropShadowFilter({distance: 0, rotation: 90, alpha: 1, blur: 1, resolution: 2})];
			}
			this._fNotEnoughMoneyCapture_cta.visible = false;
		}
	}

	__getNotEnoughMoneyCapturePosition(aCurrentSkin_num)
	{
		let lPos_p = NOT_ENOUGH_MONEY_CAPTIONS_POSITIONS[aCurrentSkin_num];

		return new PIXI.Point(lPos_p.x, lPos_p.y);
	}

	__provideLobbyBulletRangeCostIndicatorInstance()
	{
		return new LobbyBulletRangeCostIndicatorView();
	}

	_updateStakeView(aCurrentSkin_num)
	{
		this._stakeIndicator.updateSkin(aCurrentSkin_num);

		super._updateStakeView(aCurrentSkin_num);
	}

	_updatePosition(aIndex_int, aSkipAnimation_bl = false, aIsReverseGrow_bl = true)
	{
	}

	__calculatePositionOffsetX(aIndex_int, aIsReverseGrow_bl)
	{
		let lX_num = super.__calculatePositionOffsetX(aIndex_int, aIsReverseGrow_bl);

		//Offset for gold icon
		if (!aIsReverseGrow_bl && lIndexOffset_int != 0)
		{
			lX_num += 10;
		}
		else if (aIsReverseGrow_bl && lIndexOffset_int === 4)
		{
			lX_num += 20;
		}
	}

	__getInternalSkinId(aCurrentSkin_num)
	{
		var lSkinId_int = null;

		//SKIN VALIDATION...
		switch (aCurrentSkin_num) {
			case 0:
				lSkinId_int = RoomButtom.SKIN_ID_IRON;
				break;
			case 1:
				lSkinId_int = RoomButtom.SKIN_ID_BRONZE;
				break;
			case 2:
				lSkinId_int = RoomButtom.SKIN_ID_LEAD;
				break;
			case 3:
				lSkinId_int = RoomButtom.SKIN_ID_SILVER;
				break;
			case 4:
				lSkinId_int = RoomButtom.SKIN_ID_GOLD;
				break;
			default:
				lSkinId_int = RoomButtom.SKIN_ID_GOLD;
				break;
		}

		return lSkinId_int;
	}

	__getStakeIndicatorPosition(aCurrentSkin_num)
	{
		var lStakeBasePos_obj = STAKE_POS[aCurrentSkin_num];
		
		let lPositionY_num = lStakeBasePos_obj.y + (aCurrentSkin_num == 4 ? -1 : 0)

		if(APP.isMobile)
		{
			lPositionY_num -= 1;
		}
		
		return new PIXI.Point(lStakeBasePos_obj.x, lPositionY_num);
	}

	destroy()
	{
		super.destroy();
	}
}

export default RoomButtom;