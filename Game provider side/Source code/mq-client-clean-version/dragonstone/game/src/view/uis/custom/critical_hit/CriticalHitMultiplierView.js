import SimpleUIView from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/SimpleUIView';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import AtlasSprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import BitmapText from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/BitmapText';
import AtlasConfig from './../../../../config/AtlasConfig';

class CriticalHitMultiplierView extends SimpleUIView
{
	set value(aValue_num)
	{
		this._setValue(aValue_num);
	}

	get value()
	{
		return this._fValue_str;
	}

	constructor()
	{
		super();

		this._fContainer_sprt = this.addChild(new Sprite());

		let lAssetName_str = this._getAssetName();
		let lAsset_sprt = APP.library.getAsset(lAssetName_str);
		let lAtlas_obj = this._getAssetAtlas();
		this._fTextures_tx_map = AtlasSprite.getMapFrames([lAsset_sprt], [lAtlas_obj], "");

		this._fValue_bt = this._createValueTextField();
		this._fValue_str = undefined;
	}

	_getLetterSpacing()
	{
		return -2;
	}

	_getValueOffsetY()
	{
		return 0;
	}

	_getAssetName()
	{
		return "critical_hit/critical_numbers";
	}

	_getAssetAtlas()
	{
		return AtlasConfig.CriticalNumbers;
	}

	_setValue(aValue_num)
	{
		this._fValue_str = "" + aValue_num;
		this._writeValue();
		this._alignValue();
	}

	_writeValue()
	{
		this._fValue_bt.write(this._fValue_str);
		this._fValue_bt.position.set(0, this._getValueOffsetY());
	}

	_alignValue()
	{
		this._fContainer_sprt.position.x = -this._fContainer_sprt.getBounds().width/2;
	}

	_createValueTextField()
	{
		return this._fContainer_sprt.addChild(new BitmapText(this._fTextures_tx_map, "", this._getLetterSpacing()));
	}

	destroy()
	{
		super.destroy();

		this._fContainer_sprt = null;
		this._fTextures_tx_map = null;
		this._fValue_bt = null;
		this._fValue_str = null;
	}
}

export default CriticalHitMultiplierView