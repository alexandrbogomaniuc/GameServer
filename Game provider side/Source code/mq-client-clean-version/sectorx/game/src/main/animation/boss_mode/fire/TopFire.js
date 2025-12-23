
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import AtlasSprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import AtlasConfig from '../../../../config/AtlasConfig';
import { FRAME_RATE } from '../../../../../../shared/src/CommonConstants';
import Sequence from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { Utils } from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';

let _fire_textures = null;
function _generateFireTextures()
{
	if (_fire_textures) return

	_fire_textures = AtlasSprite.getFrames(
		[
			APP.library.getAsset("boss_mode/fire/top_boss_fire/top_boss_fire"),
		],
		[
			AtlasConfig.TopFireBossFire,
		],
		"");
}

class TopFire extends Sprite
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

	constructor()
	{
		super();

		_generateFireTextures();

		this._fFire_spr = null;
	}

	_startAnimation()
	{
		this.alpha = 0;
		let lAlphaSeq_arr = [
			{
				tweens: [{ prop: "alpha", to: 0.85 }], duration: 6 * FRAME_RATE
			}
		];
		Sequence.start(this, lAlphaSeq_arr);

		if (this._fFire_spr)
		{
			return;
		}

		const lFire_spr = this.addChild(new Sprite());
		lFire_spr.scale.set(2);
		lFire_spr.textures = _fire_textures;
		lFire_spr.animationSpeed = 0.5; //30 / 60
		lFire_spr.play();

		this._fFire_spr = lFire_spr;
	}

	_stopAnimation()
	{
		let lAlphaSeq_arr = [
			{
				tweens: [{ prop: "alpha", to: 0 }], duration: 6 * FRAME_RATE, onfinish: () =>
				{
					this._interrupt();
					this.emit(TopFire.EVENT_ON_ANIMATION_FINISH);
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

		this._fFire_spr && this._fFire_spr.destroy();
		this._fFire_spr = null;
	}
}

export default TopFire;