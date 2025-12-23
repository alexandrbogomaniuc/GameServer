import AtlasConfig from '../config/AtlasConfig';
import Payout from './Payout';
import TextField from '../../../../common/PIXI/src/dgphoenix/unified/view/base/display/TextField';
import { APP } from '../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';


class WinPayout extends Payout
{
	constructor(aOptIsFormatted_bl = true, aOptSignView_sprt, aOptSignBaseView_sprt, aOptFontScale_num)
	{
		super(aOptIsFormatted_bl, aOptSignView_sprt, aOptSignBaseView_sprt, aOptFontScale_num);
	}

	_init()
	{
		super._init();

		this._fValue_bt.scale.set(this._fFontScale_num);

		this._fDecimicalValue_bt = this._createValueTextField();
		this._fDecimicalValue_bt.scale.set(0.63*this._fFontScale_num);
	}

	_clear()
	{
		if (this._fDecimicalValue_bt)
		{
			this._fDecimicalValue_bt.destroy();
			this._fDecimicalValue_bt = null;
		}

		super._clear();
	}

	_setValue(aValue_num)
	{
		if (this._fValue_num === aValue_num) return;

		this._clear();
		this._init();

		super._setValue(aValue_num);
	}

	_getLetterSpacing()
	{
		return -12;
	}

	_getValueOffsetY()
	{
		return 3;
	}

	_getAssetName()
	{
		return "awards/gold_numbers";
	}

	_getAssetAtlas()
	{
		return AtlasConfig.GoldNumbers;
	}

	_writeValue(aValue_num)
	{
		let lFormattedValue_str = this._formatValue(aValue_num);
		let lDelimIndex_int = lFormattedValue_str.indexOf('.');
		if (~lDelimIndex_int)
		{
			this._fValue_bt.write(lFormattedValue_str.substring(0, lDelimIndex_int));
			this._fValue_bt.position.set(this._getSignWidth(), this._getValueOffsetY());

			let lValueBounds_pt = this._fValue_bt.getBounds();
			let lDemicals_str = lFormattedValue_str.substring(lDelimIndex_int).substr(0, 3);
			this._fDecimicalValue_bt.write(lDemicals_str);
			this._fDecimicalValue_bt.position.set(this._fValue_bt.position.x + lValueBounds_pt.width - 4, lValueBounds_pt.y - this._fDecimicalValue_bt.getBounds().y - this._fDecimicalValue_bt.y + 3);
			this._fDecimicalValue_bt.visible = true;
		}
		else
		{
			this._fDecimicalValue_bt.visible = false;
			super._writeValue.call(this, aValue_num);
		}
	}

	_initSignSymbolView()
	{
		if (!this._fOptSignView_sprt && !this._fOptSignBaseView_sprt) return;

		let lCurrencySymbol_str = APP.playerController.info.currencySymbol;
		let lSignViewBack_tf = this._fSignContainer_sprt.addChild(new TextField(this._getSignBackSymbolTextFormat(lCurrencySymbol_str)));
		lSignViewBack_tf.anchor.set(0, 0.5);
		lSignViewBack_tf.position.y = 0.7;
		lSignViewBack_tf.text = lCurrencySymbol_str;
		this._fSignContainer_sprt.position.y = 4.5;

		super._initSignSymbolView();
	}

	//SIGN SYMBOL...
	_getSignBackSymbolTextFormat(aText_str)
	{
		let lFontFamily_str = "fnt_nm_arial_currency";
		if (aText_str !== undefined && APP.fonts.isGlyphsSupported("fnt_nm_amerika", aText_str))
		{
			lFontFamily_str = "fnt_nm_amerika";
		}

		let format = {
			fontFamily: lFontFamily_str,
			fontSize: 33 * this._fFontScale_num,
			align: "center",
			fill: 0xff8921,
			dropShadow: true,
			dropShadowColor: 0x402713,
			dropShadowAngle: 0.78,
			dropShadowDistance: 1.5,
			dropShadowBlur: 4
		};
		return format;
	}

	_getSignSymbolTextFormat(aText_str)
	{
		let lFontFamily_str = "fnt_nm_arial_currency";
		if (aText_str !== undefined && APP.fonts.isGlyphsSupported("fnt_nm_amerika", aText_str))
		{
			lFontFamily_str = "fnt_nm_amerika";
		}

		let format = {
			fontFamily: lFontFamily_str,
			fontSize: 31 * this._fFontScale_num,
			align: "center",
			fill: [0xffee70, 0xfffcd4, 0xfffff5],
			fillGradientType: PIXI.TEXT_GRADIENT.LINEAR_VERTICAL,
			fillGradientStops: [0.04, 0.43, 0.96],
			dropShadow: true,
			dropShadowColor: 0xc3500a,
			dropShadowAngle: 0.78,
			dropShadowDistance: 0.7,
			dropShadowBlur: 6
		};
		return format;
	}
	//...SIGN SYMBOL

	destroy()
	{
		this._fDecimicalValue_bt && this._fDecimicalValue_bt.destroy();
		this._fDecimicalValue_bt = null;

		super.destroy();
	}
}

export default WinPayout;