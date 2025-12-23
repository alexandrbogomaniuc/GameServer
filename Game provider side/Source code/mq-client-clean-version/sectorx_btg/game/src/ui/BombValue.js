import Payout from './Payout';
import AtlasConfig from '../config/AtlasConfig';

class BombValue extends Payout {

	i_updateValue(aValue_int)
	{
		this._updateValue(aValue_int);
	}

	constructor(aOptFontScale_num = 1)
	{
		super(aOptFontScale_num);
	}

	_init()
	{
		super._init();

		this._fValue_bt.scale.set(this._fFontScale_num);
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
		return "bomb/bomb_value";
	}

	_getAssetAtlas()
	{
		return AtlasConfig.BombValue;
	}
	
	_setValue(aValue_num)
	{
		this._fValue_num = aValue_num;
		this._writeValue(aValue_num);
	}

	_updateValue(aValue_int)
	{
		this.value = aValue_int;
	}

	_formatValue(aValue_num)
	{
		return "X" + String(aValue_num);
	}
}

export default BombValue;