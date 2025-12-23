import GUSLobbyBulletRangeCostIndicatorView from '../../../../../../../common/PIXI/src/dgphoenix/gunified/view/uis/lobby_room_buttons/GUSLobbyBulletRangeCostIndicatorView';
import TextField from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/TextField';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';

const STAKE_MAX_WIDTHS = [112, 120, 118, 160, 166];

const WHITE_TEXT_FORMAT = {
	fontFamily: "fnt_nm_social_gothic_bold",
	fontSize: 18,
	fill: 0xffffff,
	lineHeight: 22,
	padding: 18
};

const SILVER_TEXT_FORMAT = {
	fontFamily: "fnt_nm_social_gothic_bold",
	fontSize: 25,
	dropShadow: true,
	dropShadowAlpha: 1,
	dropShadowAngle: Math.PI/2,
	dropShadowColor: 0x3399f7,
	dropShadowDistance: 3,
	fill: [0x555555, 0xffffff, 0xc4c4c4, 0x656565, 0xe2e2e2, 0xc5c5c5, 0xefefef, 0xd2d2d2],
	fillGradientStops: [0, 0.07, 0.18, 0.2, 0.4, 0.6, 0.8, 1],
	fillGradientType: PIXI.TEXT_GRADIENT.LINEAR_VERTICAL,
	stroke: 0xffffff,
	strokeThickness: 1,	
	lineHeight: 30,
	padding: 18
};

const GOLD_TEXT_FORMAT = {
	fontFamily: "fnt_nm_social_gothic_bold",
	fontSize: 27,
	dropShadow: true,
	dropShadowAlpha: 1,
	dropShadowAngle: Math.PI/2,
	dropShadowColor: 0x953b0f,
	dropShadowDistance: 3,
	fill: [0xffe83c, 0xffffff, 0xdcbb00, 0xce8c1c, 0xffe994, 0xffcc01, 0xffe994, 0xffffca],
	fillGradientStops: [0, 0.07, 0.18, 0.2, 0.4, 0.6, 0.8, 1],
	fillGradientType: PIXI.TEXT_GRADIENT.LINEAR_VERTICAL,
	stroke: 0xfffd09,
	strokeThickness: 1,
	lineHeight: 31,
	padding: 18
};

class LobbyBulletRangeCostIndicatorView extends GUSLobbyBulletRangeCostIndicatorView
{
	updateSkin(aSkinId_num)
	{
		this._fSkinId_num = aSkinId_num;
		//SKIN VALIDATION...
		switch (aSkinId_num) {
			case 0:
			case 1:
			case 2:
				this._fBulletCostIndicatorView_tf.textFormat = WHITE_TEXT_FORMAT;
				break;
			case 3:
				this._fBulletCostIndicatorView_tf.textFormat = SILVER_TEXT_FORMAT;
				break;
			case 4:
				this._fBulletCostIndicatorView_tf.textFormat = GOLD_TEXT_FORMAT;
				break;
			default:
				lSkinId_int = RoomButtom.SKIN_ID_GOLD;
				break;
		}
		//...SKIN VALIDATION
	}

	updateStake(aStake_num)
	{
		this._updateStake(aStake_num);
	}

	constructor()
	{
		super();

		this._fSkinId_num = 0;
	}

	_initIndicatorView()
	{
		this._fTextContainer_sprt = this.addChild(new Sprite);
		this._fBulletCostIndicatorView_tf = this._fTextContainer_sprt.addChild(new TextField());
		this._fBulletCostIndicatorView_tf.anchor.set(0.5, 0.5);
	}

	_updateStake(aStake_num)
	{
		let lMaxBetLevel_num = APP.playerController.info.possibleBetLevels ? Math.max(...APP.playerController.info.possibleBetLevels): 1;
		let lStripDecimal_bl = APP.currencyInfo.i_getCurrencyId() === "MQC";
		
		this._fBulletCostIndicatorView_tf.text = APP.currencyInfo.i_formatInterval(aStake_num, aStake_num*lMaxBetLevel_num, true, true, 2, 10000, lStripDecimal_bl);

		this._fTextContainer_sprt.scale.x = 1;
		
		let lWidth_num = this._fTextContainer_sprt.getBounds().width;
		let lMaxWidth_num = STAKE_MAX_WIDTHS[this._fSkinId_num];

		if (lWidth_num > lMaxWidth_num)
		{
			this._fTextContainer_sprt.scale.x = lMaxWidth_num / lWidth_num;
		}
	}
}

export default LobbyBulletRangeCostIndicatorView