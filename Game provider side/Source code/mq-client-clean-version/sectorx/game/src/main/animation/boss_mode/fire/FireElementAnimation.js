
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import AtlasSprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import AtlasConfig from '../../../../config/AtlasConfig';
import { FRAME_RATE } from '../../../../../../shared/src/CommonConstants';
import Sequence from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { Utils } from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';

let _fire_element_textures = null;
function _generateFireElementTextures()
{
	if (_fire_element_textures) return

	_fire_element_textures = AtlasSprite.getFrames(
		[
			APP.library.getAsset("boss_mode/fire/fire_element/fire_element_1"),
			APP.library.getAsset("boss_mode/fire/fire_element/fire_element_2")
		],
		[
			AtlasConfig.FireElement1,
			AtlasConfig.FireElement2
		],
		"");
}

class FireElementAnimation extends Sprite
{
	static get EVENT_ON_ANIMATION_FINISH() { return "onAnimationFinish"; }

	startAnimation()
	{
		this._startAnimation();
	}

	stopAnimation()
	{
		this._stopAnimation();
	}

	interrupt()
	{
		this._interrupt();
	}

	constructor()
	{
		super();

		_generateFireElementTextures();

		this._fFireElementFirst_spr = null;
		this._fFireElementLeft_spr = null;
		this._fFireElementRight_spr = null;
		this._fFireElementBig_spr = null;
	}

	_startAnimation()
	{
		this.alpha = 1;

		if (!this._fFireElementFirst_spr)
		{
			this._fFireElementFirst_spr = this._startFireElementAnimation({ x: 1, y: 1 });
		}
		let lTimingSeq_arr = [
			{
				tweens: [], duration: 1 * FRAME_RATE, onfinish: () =>
				{
					if (!this._fFireElementLeft_spr)
					{
						this._fFireElementLeft_spr = this._startFireElementAnimation({ x: -1, y: 1 });
					}
				}
			},
			{
				tweens: [], duration: 10 * FRAME_RATE, onfinish: () =>
				{
					if (!this._fFireElementRight_spr)
					{
						this._fFireElementRight_spr = this._startFireElementAnimation({ x: 1, y: 1 });
					}
				}
			},
			{
				tweens: [], duration: 24 * FRAME_RATE, onfinish: () =>
				{
					if (!this._fFireElementBig_spr)
					{
						this._startFireElementAnimation({ x: 1.2, y: 1.2 });
					}
				}
			},
		];
		Sequence.start(this, lTimingSeq_arr);
	}

	_startFireElementAnimation(aScale_obj)
	{
		const lFireElement_spr = this.addChild(new Sprite());
		lFireElement_spr.scale.set(2 * aScale_obj.x, 2 * aScale_obj.y);
		lFireElement_spr.textures = _fire_element_textures;
		lFireElement_spr.animationSpeed = 0.5; //30 / 60
		lFireElement_spr.play();
		return lFireElement_spr;
	}

	_stopAnimation()
	{
		let lAlphaSeq_arr = [
			{
				tweens: [{ prop: "alpha", to: 0 }], duration: 6 * FRAME_RATE, onfinish: () =>
				{
					this._interrupt();
					this.emit(FireElementAnimation.EVENT_ON_ANIMATION_FINISH);
				}
			}
		];
		Sequence.start(this, lAlphaSeq_arr);
	}

	_interrupt()
	{
		Sequence.destroy(Sequence.findByTarget(this));
	}

	destroy()
	{
		super.destroy();

		this._fFireElementFirst_spr && this._fFireElementFirst_spr.destroy();
		this._fFireElementFirst_spr = null;

		this._fFireElementLeft_spr && this._fFireElementLeft_spr.destroy();
		this._fFireElementLeft_spr = null;

		this._fFireElementRight_spr && this._fFireElementRight_spr.destroy();
		this._fFireElementRight_spr = null;

		this._fFireElementBig_spr && this._fFireElementBig_spr.destroy();
		this._fFireElementBig_spr = null;

		this._interrupt();
	}
}

export default FireElementAnimation;