import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sprite from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { Utils } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import ElectricityEffects from '../ElectricityEffects';

class ElectricityBodyFrontArcView extends Sprite
{
	//INIT...
	constructor()
	{
		super();

		this._initView();
	}

	_initView()
	{
		ElectricityEffects.getTextures();

		this.addChild(this._generateOverlayView());
		this.addChild(this._generateArcView(0.5, 0.5, 0x5f9cdc));
		this.addChild(this._generateArcView());
	}

	_generateOverlayView()
	{
		let arcOverlayView = new Sprite();
		arcOverlayView.textures = ElectricityEffects["arc_overlay"];
		arcOverlayView.alpha = 0.8; // no need to scale due to Boss spineView scale is 0.5.
		arcOverlayView.blendMode = PIXI.BLEND_MODES.SCREEN;
		return arcOverlayView;
	}

	_generateArcView(aX_num=0, aY_num=0, aTint_num=0xffffff)
	{
		let arcView = new Sprite();
		arcView.textures = ElectricityEffects["arc_4"];
		arcView.blendMode = PIXI.BLEND_MODES.ADD;
		arcView.x = aX_num;
		arcView.y = aY_num;
		arcView.tint = aTint_num;
		return arcView;
	}
	//...INIT

	destroy()
	{
		super.destroy();
	}
}

export default ElectricityBodyFrontArcView;