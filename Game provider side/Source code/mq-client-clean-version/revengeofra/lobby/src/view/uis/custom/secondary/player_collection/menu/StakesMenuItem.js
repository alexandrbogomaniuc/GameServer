import PointerSprite from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/view/ui/PointerSprite';
import TextField from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/TextField';
import { APP } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';

class StakesMenuItem extends PointerSprite
{
	static get EVENT_ON_ITEM_SELECTED()	{ return "onItemSelected"; }

	setSelected()
	{
		this._setSelected();
	}

	setDeselected()
	{
		this._setDeselected();
	}

	updateCurrency(aCurrency_str)
	{
		this._updateCurrency(aCurrency_str);
	}

	get stake()
	{
		return this._fStake_num;
	}

	get borders()
	{
		return this._fSpecificHitArea_obj;
	}

	constructor(aBounds_rect, aStake_num)
	{
		super(undefined, true);

		this._fStake_num = aStake_num;
		this._fSelected_bln = false;

		this._fBackDeselected_gr = null;
		this._fBackSelected_gr = null;
		this._fCaption_tf = null;

		this.setHitArea(aBounds_rect);
		this._initView();
	}

	_initView()
	{
		let lArea_obj = this._fSpecificHitArea_obj;

		this._fBackDeselected_gr = this.addChild(new PIXI.Graphics());
		this._fBackDeselected_gr.beginFill(0x252525).drawRoundedRect(lArea_obj.x, lArea_obj.y, lArea_obj.width, lArea_obj.height, 4).endFill();

		this._fBackSelected_gr = this.addChild(new PIXI.Graphics());
		this._fBackSelected_gr.beginFill(0xf6921e).drawRoundedRect(lArea_obj.x, lArea_obj.y, lArea_obj.width, lArea_obj.height, 4).endFill();
		this._fBackSelected_gr.visible = false;

		this._fCaption_tf = this.addChild(new TextField(this._deselectedStyle));
		this._fCaption_tf.anchor.set(0.5, 0.5);
		let lCurrencySymbol_str = APP.playerController.info.currencySymbol;
		let lText_str = (this._fStake_num/100).toFixed(2);
		if (lCurrencySymbol_str !== undefined) lText_str = "\u200E" + lCurrencySymbol_str + "\u200E" + lText_str;
		this._fCaption_tf.text = lText_str;
		this._fCaption_tf.maxWidth = 136;

		this.setEnabled();
	}

	_updateCurrency(aCurrency_str)
	{
		let lText_str = aCurrency_str + (this._fStake_num/100).toFixed(2);
		this._fCaption_tf.text = lText_str;
	}

	get _selectedStyle()
	{
		return {
			fontFamily: "fnt_nm_barlow",
			align: "center",
			fontSize: 11.5,
			fill: 0x000000
		}
	}

	get _deselectedStyle()
	{
		return {
			fontFamily: "fnt_nm_barlow",
			align: "center",
			fontSize: 11.5,
			fill: 0xffffff
		}
	}

	_setSelected()
	{
		if (this._fSelected_bln) return;

		this._fSelected_bln = true;

		this._fBackDeselected_gr.visible = false;
		this._fBackSelected_gr.visible = true;

		this._fCaption_tf.textFormat = this._selectedStyle;

		this.setDisabled();

		this.emit(StakesMenuItem.EVENT_ON_ITEM_SELECTED);
	}

	_setDeselected()
	{
		if (!this._fSelected_bln) return;

		this._fSelected_bln = false;

		this._fBackDeselected_gr.visible = true;
		this._fBackSelected_gr.visible = false;

		this._fCaption_tf.textFormat = this._deselectedStyle;

		this.setEnabled();
	}

	destroy()
	{
		super.destroy();

		this._fStake_num = undefined;
		this._fSelected_bln = undefined;

		this._fBackDeselected_gr = undefined;
		this._fBackSelected_gr = undefined;
		this._fCaption_tf = undefined;
	}
}

export default StakesMenuItem