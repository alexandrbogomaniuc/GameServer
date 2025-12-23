import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import AtlasSprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import AtlasConfig from '../../../config/AtlasConfig';
import { FRAME_RATE } from '../../../../../shared/src/CommonConstants';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { Utils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import * as Easing from '../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';

let _particlesSpreadTextures = null;

class CompletedQuestBackEffects extends Sprite
{
	constructor()
	{
		super();

		this._addEffects();
	}

	_addEffects()
	{
		// bottom orange flare...
		let lBottomOrangeFlare_sprt = this.addChild(APP.library.getSprite("common/orange_flare"));
		lBottomOrangeFlare_sprt.blendMode = PIXI.BLEND_MODES.ADD;
		lBottomOrangeFlare_sprt.visible = false;
		lBottomOrangeFlare_sprt.scale.set(0, 0);
		
		let lFlareSeq_arr = [
			{tweens: [{prop: 'scale.x', to: 1.1}, {prop: 'scale.y', to: 0.4}], duration: 2*FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 0.7}, {prop: 'scale.y', to: 0.5}], duration: 2*FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 0},	{prop: 'scale.y', to: 0}],	duration: 3*FRAME_RATE}
		];

		Sequence.start(lBottomOrangeFlare_sprt, lFlareSeq_arr);
		// ...bottom orange flare

	}

	destroy()
	{
		if (this.children && this.children.length)
		{
			for (let i=0; i<this.children.length; i++)
			{
				let chld = this.children[i];
				Sequence.destroy(Sequence.findByTarget(chld));
			}			
		}

		super.destroy();
	}

}

export default CompletedQuestBackEffects;