import GUIndicatorView from '../../../../../../../common/PIXI/src/dgphoenix/gunified/view/ui/GUIndicatorView';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import NumberValueFormat from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/custom/values/NumberValueFormat';
import TextField from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/TextField';
import I18 from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';

class RoundResultPayoutsIndicatorView extends GUIndicatorView
{
	//INIT...
	_initIndicatorView()
	{
		this._fCurrencySymbol_tf = null;
		this._fValueContainer_sprt.position.set(0, 0);
		this._fQuestsWinValueAsset_ta = this._fValueContainer_sprt.addChild(I18.generateNewCTranslatableAsset("TARoundResultPlusMoneyCaption"));

		super._initIndicatorView();

		this._onValueChanged();
	}
	//...INIT

	//VALUE...
	_initValueView()
	{
		super._initValueView();
		this._fValueView_tf.anchor.set(0.5, 0.5);

		this._initCurrencySymbolViewIfRequired();
	}

	_getValueTextFormat()
	{
		let format = {
			fontFamily: "fnt_nm_barlow_semibold",
			fontSize: 20,
			align: "center",
			fill: 0xfda70a
		};
		return format;
	}

	_getValueMaxWidth()
	{
		return undefined;
	}
	
	_formatValue(aValue_num)
	{
		return NumberValueFormat.formatMoney(aValue_num);
	}

	_onValueChanged()
	{
		let lTotalWidth_num = 0;

		if (this._fCurrencySymbol_tf)
		{
			let lPlusWidth_num = this._fQuestsWinValueAsset_ta.assetContent.textBounds.width;
			let lCurrencyWidth_num = this._fCurrencySymbol_tf.textBounds.width;
			let lValueWidth_num = this._fValueView_tf.textBounds.width;

			this._fQuestsWinValueAsset_ta.position.set(lPlusWidth_num/2, 0);
			this._fCurrencySymbol_tf.position.set(lCurrencyWidth_num/2 + lPlusWidth_num, 0);
			this._fValueView_tf.position.set(lValueWidth_num/2 + lCurrencyWidth_num + lPlusWidth_num, 0);

			this._fValueContainer_sprt.position.set(-(lValueWidth_num + lCurrencyWidth_num + lPlusWidth_num)/2, 0.5);

			lTotalWidth_num = lValueWidth_num + lCurrencyWidth_num + lPlusWidth_num;
		}
		else
		{
			let lPlusWidth_num = this._fQuestsWinValueAsset_ta.assetContent.textBounds.width;
			let lValueWidth_num = this._fValueView_tf.textBounds.width;

			this._fQuestsWinValueAsset_ta.position.set(lPlusWidth_num/2, 0);
			this._fValueView_tf.position.set(lValueWidth_num/2 + lPlusWidth_num, 0);

			this._fValueContainer_sprt.position.set(-(lValueWidth_num + lPlusWidth_num)/2, 0);

			lTotalWidth_num = lValueWidth_num + lPlusWidth_num;
		}

		if (lTotalWidth_num > 94)
		{
			let lOldX_num = this._fValueContainer_sprt.position.x;
			let lScale_num = 94/lTotalWidth_num;
			this._fValueContainer_sprt.scale.x = lScale_num;
			this._fValueContainer_sprt.position.x = lOldX_num*lScale_num;
		}
	}
	//...VALUE

	//CURRENCY SYMBOL...
	_initCurrencySymbolViewIfRequired()
	{
		if (!APP.playerController.info.currencySymbol)
		{
			return;
		}

		let lIsFontIncludesCurrencySymbol_bl = APP.fonts.isGlyphsSupported("fnt_nm_barlow_semibold", APP.playerController.info.currencySymbol);
		let l_tf = new TextField(lIsFontIncludesCurrencySymbol_bl ? this._getValueTextFormat() : this._getCurrencySymbolTextFormat());

		l_tf.anchor.set(0.5, 0.5);
		l_tf.text = APP.playerController.info.currencySymbol;
		this._fCurrencySymbol_tf = this._fValueContainer_sprt.addChild(l_tf);
		this._fValueContainer_sprt.position.y = 0.5;

		return l_tf;
	}

	_getCurrencySymbolTextFormat()
	{
		let format = {
			fontFamily: "fnt_nm_arial_currency",
			fontSize: 12,
			align: "center",
			fill: 0Xf6921e
		};
		return format;
	}
	//...CURRENCY SYMBOL

	destroy()
	{
		super.destroy();

		this._fQuestsWinValueAsset_ta = null;
		this._fCurrencySymbol_tf = null;
		this._fValueContainer_sprt = null;
	}
}

export default RoundResultPayoutsIndicatorView;