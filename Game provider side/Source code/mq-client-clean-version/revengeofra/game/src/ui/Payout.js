import { APP } from '../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sprite from '../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import AtlasSprite from '../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import BitmapText from '../../../../common/PIXI/src/dgphoenix/unified/view/base/display/BitmapText';
import NumberValueFormat from '../../../../common/PIXI/src/dgphoenix/unified/view/custom/values/NumberValueFormat';
import TextField from '../../../../common/PIXI/src/dgphoenix/unified/view/base/display/TextField';

class Payout extends Sprite
{
	set value(aValue_num)
	{
		this._setValue(aValue_num);
	}

	get value()
	{
		return this._fValue_num;
	}

	get fontScale()
	{
		return this._fFontScale_num;
	}

	constructor(aOptIsFormatted_bl = true, aOptSignView_sprt = null, aOptSignBaseView_sprt = null, aOptFontScale_num = 1)
	{
		super();

		this._fContainer_sprt = null;
		this._fSignContainer_sprt = null;
		this._fValue_bt = null;

		this._fValue_num = undefined;
		this._fTextures_tx_map = AtlasSprite.getMapFrames([APP.library.getAsset(this._getAssetName())], [this._getAssetAtlas()], "");

		this._fIsFormatted_bl = aOptIsFormatted_bl;
		this._fFontScale_num = aOptFontScale_num;
		this._fOptSignView_sprt = aOptSignView_sprt;
		this._fOptSignBaseView_sprt = aOptSignBaseView_sprt;

		this._init();
	}

	_init()
	{
		this._fContainer_sprt = this.addChild(new Sprite());
		this._fSignContainer_sprt = this._fContainer_sprt.addChild(new Sprite());

		this._fValue_bt = this._createValueTextField();
		
		this._fValue_num = undefined;
		this._initSignSymbolView();
	}

	_clear()
	{
		if (this._fValue_bt)
		{
			this._fValue_bt.destroy();
			this._fValue_bt = null;
		}

		if (this._fSignContainer_sprt)
		{
			if (this._fOptSignBaseView_sprt)
			{
				this._fSignContainer_sprt.removeChild(this._fOptSignBaseView_sprt);
				this._fOptSignBaseView_sprt.anchor.set(0.5, 0.5);
				this._fOptSignBaseView_sprt.position.set(0, 0);
			}

			if (this._fOptSignView_sprt)
			{
				this._fSignContainer_sprt.removeChild(this._fOptSignView_sprt);
				this._fOptSignView_sprt.anchor.set(0.5, 0.5);
				this._fOptSignView_sprt.position.set(0, 0);
			}

			this._fSignContainer_sprt.destroy();
			this._fSignContainer_sprt = null;
		}

		if (this._fContainer_sprt)
		{
			this._fContainer_sprt.destroy();
			this._fContainer_sprt = null;
		}

		this._fValue_num = undefined;
	}

	_getLetterSpacing()
	{
		return 0;
	}

	_getValueOffsetY()
	{
		return 0;
	}

	_getAssetName()
	{
		throw new Error(`Method should be overriden`);
	}

	_getAssetAtlas()
	{
		throw new Error(`Method should be overriden`);
	}

	_formatValue(aValue_num)
	{
		return this._fIsFormatted_bl ? NumberValueFormat.formatMoney(aValue_num) : aValue_num.toString();
	}

	_setValue(aValue_num)
	{
		this._fValue_num = aValue_num;
		this._writeValue(aValue_num);
		this._alignValue();
	}

	_writeValue(aValue_num)
	{
		this._fValue_bt.write(this._formatValue(aValue_num));
		this._fValue_bt.position.set(this._getSignWidth(), this._getValueOffsetY());
	}

	_alignValue()
	{
		this._fContainer_sprt.position.x = -this._fContainer_sprt.getBounds().width/2;
	}

	//VALUE TEXTFIELD...
	_createValueTextField()
	{
		return this._fContainer_sprt.addChild(new BitmapText(this._fTextures_tx_map, "", this._getLetterSpacing()));
	}
	//...VALUE TEXTFIELD

	//SIGN SYMBOL...
	_initSignSymbolView()
	{
		let lCurrencySymbol_str = APP.playerController.info.currencySymbol;
		let lSignView_sprt;
		if (this._fOptSignView_sprt)
		{
			this._fOptSignView_sprt.anchor.set(0, 0.5);
			lSignView_sprt = this._fSignContainer_sprt.addChild(this._fOptSignView_sprt);
		}
		else if (lCurrencySymbol_str !== undefined)
		{
			lSignView_sprt = new TextField(this._getSignSymbolTextFormat(lCurrencySymbol_str));
			lSignView_sprt.anchor.set(0, 0.5);
			lSignView_sprt.text = lCurrencySymbol_str;
			
			this._fSignContainer_sprt.addChild(lSignView_sprt);
		}

		if (this._fOptSignBaseView_sprt)
		{
			this._fOptSignBaseView_sprt.anchor.set(0, 0.5);
			this._fSignContainer_sprt.addChildAt(this._fOptSignBaseView_sprt, 0);

			if (lSignView_sprt)
			{
				let lWidthDifference_num = this._fOptSignBaseView_sprt.getBounds().width - lSignView_sprt.getBounds().width;
				if (lWidthDifference_num > 0)
				{
					lSignView_sprt.position.x = lWidthDifference_num / 2;
				}
				else
				{
					this._fOptSignBaseView_sprt.position.x = - lWidthDifference_num / 2;
				}
			}
		}
		return lSignView_sprt;
	}

	_getSignSymbolTextFormat()
	{
		let format = {
			fontFamily: "fnt_nm_arial_currency",
			fontSize: 30 * this._fFontScale_num,
			align: "center",
			fill: 0x000000,
		};
		return format;
	}

	_getSignWidth()
	{
		if (this._fSignContainer_sprt)
		{
			return this._fSignContainer_sprt.getBounds().width;
		}
		return 0;
	}
	//...SIGN SYMBOL

	destroy()
	{
		this._fTextures_tx_map = null;

		this._fValue_bt && this._fValue_bt.destroy();
		this._fValue_bt = null;

		this._fSignContainer_sprt && this._fSignContainer_sprt.destroy();
		this._fSignContainer_sprt = null;

		this._fContainer_sprt && this._fContainer_sprt.destroy();
		this._fContainer_sprt = null;

		this._fIsFormatted_bl = false;
		this._fValue_num = undefined;

		super.destroy();
	}
}

export default Payout;