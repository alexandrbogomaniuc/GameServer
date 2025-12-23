import WinPayout from './WinPayout';
import { APP } from '../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import AtlasConfig from '../config/AtlasConfig';


class SilverWinPayout extends WinPayout {

	//override
	_getLetterSpacing()
	{
		return 0;
	}

	//override
	_getValueOffsetY()
	{
		return 3;
	}

	//override
	_getAssetName()
	{
		return "awards/silver_numbers";
	}

	//override
	_getAssetAtlas()
	{
		return AtlasConfig.SilverNumbers;
	}

	//SIGN SYMBOL...
	//override
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
			this._fDecimicalValue_bt.position.set(this._fValue_bt.position.x + lValueBounds_pt.width, lValueBounds_pt.y - this._fDecimicalValue_bt.getBounds().y - this._fDecimicalValue_bt.y);
			this._fDecimicalValue_bt.visible = true;
		}
		else
		{
			this._fDecimicalValue_bt.visible = false;
			super._writeValue.call(this, aValue_num);
		}
	}

	//override
	_getSignSymbolTextFormat(aText_str)
	{
		let lFontFamily_str = "fnt_nm_arial_currency";
		if (aText_str !== undefined && APP.fonts.isGlyphsSupported("fnt_nm_amerika", aText_str))
		{
			lFontFamily_str = "fnt_nm_amerika";
		}

		let format = {
			fontFamily: lFontFamily_str,
			fontSize: 24 * this._fFontScale_num,
			align: "center",
			fill: [0xffffff, 0xfdfdfd, 0xb5b5b5, 0x949494],
			fillGradientType: PIXI.TEXT_GRADIENT.LINEAR_VERTICAL,
			fillGradientStops: [0.04, 0.43, 0.6, 0.96],
			stroke: 0x5b5b5b,
			strokeThickness: 2,
			dropShadow: true,
			dropShadowColor: 0x242323,
			dropShadowAngle: 0.78,
			dropShadowDistance: 2,
			dropShadowBlur: 2
		};
		return format;
	}
	//...SIGN SYMBOL
}

export default SilverWinPayout;