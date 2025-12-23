import DialogView from '../DialogView';
import I18 from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';

class BonusDialogView extends DialogView
{
	constructor()
	{
		super();
	}

	setMessage(messageId, aOptValue_num = undefined, aOptValue_str = undefined, aOptSubString_str = undefined, aOptCurrencySymbol_str = "")
	{
		this._setMessage(messageId, aOptValue_num, aOptValue_str, aOptSubString_str, aOptCurrencySymbol_str);
	}

	_setMessage(messageId, aOptValue_num = undefined, aOptValue_str = undefined, aOptSubString_str = undefined, aOptCurrencySymbol_str = "")
	{
		this._messageContainer.destroyChildren();

		let msg = I18.generateNewCTranslatableAsset(messageId);
		let msgText = msg.text;

		if (aOptValue_num !== undefined && !isNaN(aOptValue_num) && aOptSubString_str !== undefined)
		{
			let lSubStringsCount_num = (msgText.split(aOptSubString_str).length - 1);

			while (lSubStringsCount_num-- > 0)
			{
				msgText = I18.prepareNumberPoweredMessage(msgText, aOptSubString_str, aOptValue_num);
			}
		}

		if (aOptValue_str !== undefined || aOptValue_num !== undefined)
		{
			let lValue_str = aOptValue_str ? aOptValue_str : aOptValue_num;
			msgText = msgText.replace("/VALUE/", lValue_str);
		}

		let lCurrencySymbol_str = aOptCurrencySymbol_str;
		msgText = msgText.replace("/CURRENCY_SYMBOL/", "\u200E"+lCurrencySymbol_str+"\u200E");

		msg.text = msgText;
		this._messageContainer.addChild(msg);
	}
}

export default BonusDialogView;