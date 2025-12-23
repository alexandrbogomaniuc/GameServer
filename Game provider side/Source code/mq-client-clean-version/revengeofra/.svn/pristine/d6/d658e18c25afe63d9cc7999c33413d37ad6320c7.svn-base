import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import BitmapText from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/BitmapText';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import AtlasSprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import AtlasConfig from '../../../config/AtlasConfig';
import I18 from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';

class HPDamageValue extends Sprite
{
	constructor(aValue_num)
	{
		super();

		this.fValueContainer_sprt = this.addChild(new Sprite);
		this._fValue_bt = null;

		this._initValue(aValue_num);
	}

	_initValue(aValue_num)
	{
		let lCaption_ta = this.fValueContainer_sprt.addChild(I18.generateNewCTranslatableAsset("TAEnemyHPCaption"));

		let value = this._fValue_bt = this.fValueContainer_sprt.addChild(new BitmapText(this._glyphsTextures, this._getGlyphs(), "", this._getLetterSpacing()));
		value.write(this._formatValue(aValue_num));

		let lValuePosAsset_ta = I18.getTranslatableAssetDescriptor("TAEnemyHPValuePosition");
		let lValuePos_obj = lValuePosAsset_ta.areaInnerContentDescriptor.areaDescriptor;

		value.y = lValuePos_obj.y;
		value.x = lValuePos_obj.x;
		if (lValuePos_obj.x < 0)
		{
			value.x -= value.getBounds().width;
		}
	}

	get _glyphsTextures()
	{
		return AtlasSprite.getFrames([APP.library.getAsset("enemies/hp_damage/hp_damage_numbers")], [AtlasConfig.HPDamageNumbers], "");
	}

	_getGlyphs()
	{
		return "0123456789-";
	}

	_getLetterSpacing()
	{
		return -8;
	}

	_formatValue(aValue_num)
	{
		return '-' + aValue_num.toString();
	}

	destroy()
	{
		this.fValueContainer_sprt = null;
		this._fValue_bt = null;

		super.destroy();
	}
}

export default HPDamageValue