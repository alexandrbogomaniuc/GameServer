import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import I18 from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
import TextField from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/TextField';

class RoundResultPlayersListView extends Sprite
{
	update(aData_obj)
	{
		this._update(aData_obj);
	}

	constructor()
	{
		super();

		this._fRows_arr = null;
		this._fNicknames_arr = null;
		this._fDamage_arr = null;

		this._fPlayerRowId_num = null;

		this._init();
	}

	_init()
	{
		this._fRowsBacks_arr = [];
		this._fNicknames_arr = [];
		this._fDamage_arr = [];

		let lAlpha_num = 1;
		for (let i = 0; i < 6; ++i)
		{
			this._addRow(39.5 * i, i, lAlpha_num);

			lAlpha_num -= 0.1;
		}
	}

	_addRow(aPositionY_num, aId_num, aAlpha_num)
	{
		let lRow_sprt = this.addChild(new Sprite());
		lRow_sprt.position.set(0, aPositionY_num);

		let lBack_grphc = lRow_sprt.addChild(new PIXI.Graphics());
		lBack_grphc.beginFill(0x292929, aAlpha_num).drawRoundedRect(-150, -15, 300, 30, 2.5);
		this._fRowsBacks_arr.push(lBack_grphc);

		let lGold_sprt = lRow_sprt.addChild(APP.library.getSpriteFromAtlas('round_result/players_list/gold/coins_' + (aId_num > 4 ?  4 :  aId_num)));
		lGold_sprt.position.set(-90.5, 0);

		let lPositionText_tf = lRow_sprt.addChild(new TextField(this._positionStyle));
		lPositionText_tf.anchor.set(0.5, 0.5);
		lPositionText_tf.position.set(-134.5, -1);
		lPositionText_tf.text = (aId_num + 1);

		let lNicknameText_tf = lRow_sprt.addChild(new TextField(this._nicknameStyle));
		lNicknameText_tf.maxWidth = 120;
		lNicknameText_tf.anchor.set(0, 0.5);
		lNicknameText_tf.position.set(-52, 0);
		lNicknameText_tf.text = "-";

		this._fNicknames_arr.push(lNicknameText_tf);

		let lDamageText_cta = lRow_sprt.addChild(new TextField(this._damageStyle));
		lDamageText_cta.anchor.set(0, 0.5);
		lDamageText_cta.position.set(88, 0);
		lDamageText_cta.maxWidth = 60;
		lDamageText_cta.text = "-";

		this._fDamage_arr.push(lDamageText_cta);
	}

	_update(aData_obj)
	{
		let lPayerId_num = null;

		for (let i = 0; i < this._fNicknames_arr.length; ++i)
		{
			this._updateNicknameText(this._fNicknames_arr[i], (aData_obj[i] ? aData_obj[i].nickname : "-"));

			this._fDamage_arr[i].text = aData_obj[i] ? Math.floor(aData_obj[i].totalDamage || 0) : "-";
			this._fDamage_arr[i].maxWidth = 60;

			if (aData_obj[i] && APP.playerController.info.nickname == aData_obj[i].nickname)
			{
				lPayerId_num = i;
			}
		}

		if (this._fPlayerRowId_num !== lPayerId_num)
		{
			if (this._fPlayerRowId_num !== null)
			{
				this._resetRow()
			}

			this._setMainPlayerRow(lPayerId_num);	
		}
	}

	_updateNicknameText(nickname_tf, value)
	{
		let fontName = "sans-serif";
		if (APP.fonts.isGlyphsSupported(this._nicknameStyle.fontFamily, value))
		{
			fontName = this._nicknameStyle.fontFamily;
		}
		
		let txtStyle = nickname_tf.getStyle() || {};
		txtStyle.fontFamily = fontName;
		nickname_tf.textFormat = txtStyle;
		
		nickname_tf.text = value;
	}

	_resetRow()
	{
		let lOldPlayerRowBack_grphc = this._fRowsBacks_arr[this._fPlayerRowId_num];
		lOldPlayerRowBack_grphc.clear();
		lOldPlayerRowBack_grphc.beginFill(0x292929, 0.8).drawRoundedRect(-150, -15, 300, 30, 2.5);

		let lOldPlayerRowNickname_tf = this._fNicknames_arr[this._fPlayerRowId_num];
		lOldPlayerRowNickname_tf.textFormat = this._nicknameStyle;

		let lOldPlayerRowDamage_cta = this._fDamage_arr[this._fPlayerRowId_num];
		lOldPlayerRowDamage_cta.textFormat = this._damageStyleFill;
	}

	_setMainPlayerRow(lPayerId_num)
	{ 
		this._fPlayerRowId_num = lPayerId_num;
		let lPlayerRowBack_grphc = this._fRowsBacks_arr[this._fPlayerRowId_num];
		lPlayerRowBack_grphc.clear();
		lPlayerRowBack_grphc.beginFill(0xfccc32, 1).drawRoundedRect(-150, -15, 300, 30, 2.5);

		let lPlayerRowNickname_tf = this._fNicknames_arr[this._fPlayerRowId_num];
		lPlayerRowNickname_tf.textFormat = this._mainPlayerNicknameStyle;

		let lPlayerRowDamage_cta = this._fDamage_arr[this._fPlayerRowId_num];
		lPlayerRowDamage_cta.textFormat = this._damageMainStyleFill;
	}

	get _damageStyle()
	{
		let lStyle_obj = {
			fontFamily: "fnt_nm_barlow_semibold",
			fontSize: 12,
			align: "center",
			fill: 0xfccc32
		};

		return lStyle_obj;
	}

	get _positionStyle()
	{
		let lStyle_obj = {
			fontFamily: "fnt_nm_barlow_semibold",
			fontSize: 12,
			align: "center",
			fill: 0xffffff,
			dropShadow: true,
			dropShadowColor: 0x000000,
			dropShadowAngle: Math.PI/2,
			dropShadowDistance: 1,
			dropShadowAlpha: 0.5
		};

		return lStyle_obj;
	}

	get _nicknameStyle()
	{
		let lStyle_obj = {
			fontFamily: "fnt_nm_barlow_semibold",
			fontSize: 12,
			align: "left",
			fill: 0xffffff,
			dropShadow: true,
			dropShadowColor: 0x000000,
			dropShadowAngle: Math.PI/2,
			dropShadowDistance: 1,
			dropShadowAlpha: 0.5
		};

		return lStyle_obj;
	}

	get _mainPlayerNicknameStyle()
	{
		let lStyle_obj = {
			fontFamily: "fnt_nm_barlow_semibold",
			fontSize: 12,
			align: "left",
			fill: 0x000000,
			dropShadow: true,
			dropShadowColor: 0xffffff,
			dropShadowAngle: Math.PI/2,
			dropShadowDistance: 1,
			dropShadowAlpha: 0.5
		};

		return lStyle_obj;
	}

	get _damageStyleFill()
	{
		let lStyle_obj = {
			fill: 0xfccc32
		};

		return lStyle_obj;
	}

	get _damageMainStyleFill()
	{
		let lStyle_obj = {
			align: "center",
			fill: 0xffffff,
			dropShadow: true,
			dropShadowColor: 0x000000,
			dropShadowAngle: Math.PI/2,
			dropShadowDistance: 1,
			dropShadowAlpha: 0.5
		};

		return lStyle_obj;
	}

	destroy()
	{
		super.destroy();

		this._fRows_arr = null;
		this._fPlayerRowId_num = null;
	}
}

export default RoundResultPlayersListView;