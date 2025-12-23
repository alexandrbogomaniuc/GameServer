import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sprite from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { Utils } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import ElectricityEffects from '../ElectricityEffects';

class ElectricityBodyFrontLightenArcView extends Sprite
{
	//INIT...
	constructor(arcType)
	{
		super();

		this._initView(arcType);
	}

	_initView(arcType)
	{
		ElectricityEffects.getTextures();

		this.addChild(this._generateOverlayView(0.5, 0x2324e8, PIXI.BLEND_MODES.SCREEN));
		this.addChild(this._generateOverlayView(0.6));
		this.addChild(this._generateArcView(arcType, 0.9, PIXI.BLEND_MODES.ADD));
	}

	_generateOverlayView(aAlpha_num=1, aTint_num=0xffffff, aBlendMode_num=PIXI.BLEND_MODES.ADD)
	{
		let arcOverlayView = new Sprite();
		arcOverlayView.textures = ElectricityEffects["arc_lighten_overlay"];
		arcOverlayView.blendMode = aBlendMode_num;
		arcOverlayView.tint = aTint_num;
		arcOverlayView.y = -3;
		arcOverlayView.alpha = aAlpha_num;
		return arcOverlayView;
	}

	_generateArcView(arcType, aAlpha_num=1, aBlendMode_num=PIXI.BLEND_MODES.ADD)
	{
		let arcView = new Sprite();
		arcView.textures = ElectricityEffects["arc_"+this._getArcAssetIndex(arcType)];
		arcView.blendMode = aBlendMode_num;
		arcView.alpha = aAlpha_num;
		return arcView;
	}

	_getArcAssetIndex(arcType)
	{
		if (arcType == 1)
		{
			return 6;
		}

		return 4;
	}
	//...INIT

	destroy()
	{
		super.destroy();
	}
}

export default ElectricityBodyFrontLightenArcView;