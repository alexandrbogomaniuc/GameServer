
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import AtlasSprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import AtlasConfig from '../../../../config/AtlasConfig';
import { FRAME_RATE } from '../../../../../../shared/src/CommonConstants';
import Sequence from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { Utils } from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import Timer from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import * as Easing from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';

let _fire_textures = null;
function _generateFireTextures()
{
	if (_fire_textures) return

	_fire_textures = AtlasSprite.getFrames([APP.library.getAsset("boss_mode/fire/hole/fire")], [AtlasConfig.FireBossHoleFire], "");
}

const FIRE_CONFIG = [
	{
		position: { x: -53, y: -12 },
		startFarame: 9,
		angle: 0,
		scale: 2 //1*2
	},
	{
		position: { x: -97, y: -27 },
		startFarame: 0,
		angle: -0.22689280275926285, //Utils.gradToRad(13)
		scale: 3.2 //1.6 * 2
	},
	{
		position: { x: 80, y: 28 },
		startFarame: 0,
		angle: 0.03490658503988659, //Utils.gradToRad(2)
		scale: 2.8 //1.4 * 2 
	}
]

class HoleAnimation extends Sprite
{
	static get EVENT_ON_ANIMATION_FINISH() { return "onAnimationFinish"; }

	startAnimation()
	{
		this._startAnimation();
	}

	interrupt()
	{
		this._interrupt();
	}

	constructor()
	{
		super();

		_generateFireTextures();

		this._fMainContainer_spr = null;
		this._fGlow_spr = null;
		this._fFinishAnimation_tmr = null;
	}

	_startAnimation()
	{
		this._fMainContainer_spr = this.addChild(new Sprite());

		this._addBack();
		this._addGlow();
		this._addFire();
		this._addMask();

		this._fFinishAnimation_tmr = new Timer(() =>
		{
			this._fFinishAnimation_tmr && this._fFinishAnimation_tmr.destructor();
			this._startFinishAnimation();
		}, 25 * FRAME_RATE, true);
	}

	_startFinishAnimation()
	{
		let lSequenceScale_arr = [
			{ tweens: [{ prop: "scale.x", to: 0.3 }, { prop: "scale.y", to: 0.3 }], duration: 39 * FRAME_RATE, ease: Easing.quadratic.easeInOut},
		];
		Sequence.start(this._fMainContainer_spr, lSequenceScale_arr);

		let lAlphaSeq_arr = [
			{ tweens: [], duration: 25 * FRAME_RATE },
			{ tweens: [{ prop: "alpha", to: 0 }], duration: 15 * FRAME_RATE, onfinish: () => {
				Sequence.destroy(Sequence.findByTarget(this._fMainContainer_spr));
				this.emit(HoleAnimation.EVENT_ON_ANIMATION_FINISH);
			}},
		];
		Sequence.start(this._fMainContainer_spr, lAlphaSeq_arr);
	}

	_addBack()
	{
		this._fMainContainer_spr.addChild(APP.library.getSpriteFromAtlas("boss_mode/fire/back"));
	}

	_addGlow()
	{
		this._fGlow_spr = this._fMainContainer_spr.addChild(APP.library.getSpriteFromAtlas("boss_mode/fire/glow"));
		this._fGlow_spr.position.set(0, 30);
		this._fGlow_spr.blendMode = PIXI.BLEND_MODES.ADD;
		this._fGlow_spr.alpha = 0.89;
		this._fGlow_spr.scale.set(2);

		let lAlphaSeq_arr = [
			{ tweens: [{ prop: "alpha", to: 0.91 }], duration: 2 * FRAME_RATE },
			{ tweens: [{ prop: "alpha", to: 0.91 }], duration: 1 * FRAME_RATE },
			{ tweens: [{ prop: "alpha", to: 0.87 }], duration: 4 * FRAME_RATE },
			{ tweens: [{ prop: "alpha", to: 0.87 }], duration: 1 * FRAME_RATE },
			{ tweens: [{ prop: "alpha", to: 1 }], duration: 6 * FRAME_RATE },
			{ tweens: [{ prop: "alpha", to: 1 }], duration: 6 * FRAME_RATE },
			{ tweens: [{ prop: "alpha", to: 0.86 }], duration: 7 * FRAME_RATE },
			{ tweens: [{ prop: "alpha", to: 0.86 }], duration: 1 * FRAME_RATE },
			{ tweens: [{ prop: "alpha", to: 0.93 }], duration: 4 * FRAME_RATE }
		];
		Sequence.start(this._fGlow_spr, lAlphaSeq_arr);
	}

	_addFire()
	{
		FIRE_CONFIG.forEach(conf =>
		{
			const lFire_spr = this._fMainContainer_spr.addChild(new Sprite());
			lFire_spr.position = conf.position;
			lFire_spr.textures = _fire_textures;
			lFire_spr.scale.set(conf.scale);
			lFire_spr.rotation = conf.angle;
			lFire_spr.animationSpeed = 0.5; //30 / 60
			lFire_spr.gotoAndPlay(conf.startFarame);
		})
	}

	_addMask()
	{
		const lMask_spr = this._fMainContainer_spr.addChild(APP.library.getSpriteFromAtlas("boss_mode/fire/mask"))
		this._fMainContainer_spr.mask = lMask_spr;
	}

	_interrupt()
	{
		this._fFinishAnimation_tmr && this._fFinishAnimation_tmr.destructor();

		Sequence.destroy(Sequence.findByTarget(this._fMainContainer_spr));
		this._fMainContainer_spr = null;

		this._fGlow_spr && Sequence.destroy(Sequence.findByTarget(this._fGlow_spr));
		this._fGlow_spr = null;
	}

	destroy()
	{
		super.destroy();

		this._interrupt();

		this._fMainContainer_spr = null;
		this._fGlow_spr = null;
		this._fFinishAnimation_tmr = null;
	}
}

export default HoleAnimation;