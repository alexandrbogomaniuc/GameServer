import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import * as Easing from '../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../shared/src/CommonConstants';
import { Utils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import AtlasConfig from './../../../config/AtlasConfig';
import { AtlasSprite } from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';

let _bullet_textures = null;
function _generateBulletTextures()
{
	if (_bullet_textures) return

	_bullet_textures = AtlasSprite.getFrames(
		[
			APP.library.getAsset("enemies/bullet_capsule/bullet")
		],
		[
			AtlasConfig.BulletCapsuleBullet
		],
		"");
}

class BigBullet extends Sprite
{
	startHitAnimation()
	{
		this._startHitAnimation();
	}

	constructor()
	{
		super();

		_generateBulletTextures();

		this._fBullet_spr = null;
		this._fBulletGlow_spr  = null;

		this._init();
	}

	_init()
	{
		this._initBullet();
	}

	_initBullet()
	{
		this._fBullet_spr = this.addChild(new Sprite());
		this._fBullet_spr.textures = _bullet_textures;
		this._fBullet_spr.scale.set(2);
		this._fBullet_spr.pivot.set(66, -24);
		this._fBullet_spr.animationSpeed = 0.5; //30 / 60;
		this._fBullet_spr.play();
		this._fBullet_spr.rotation = 1.5707963267948966; //Utils.gradToRad(90);

		this._fBulletGlow_spr = this._fBullet_spr.addChild(APP.library.getSprite("enemies/bullet_capsule/bullet_glow"));
		this._fBulletGlow_spr.position.set(66, -26);
		const lAlphaSeq_arr = [
			{ tweens: [{ prop: "alpha", to: 0 }], duration: 11 * FRAME_RATE }
		];
		Sequence.start(this._fBulletGlow_spr, lAlphaSeq_arr);
	}

	_startHitAnimation()
	{
		if (this._fBullet_spr)
		{
			Sequence.destroy(Sequence.findByTarget(this._fBullet_spr));
			const lScaleSeq_arr = [
				{ tweens: [{ prop: 'scale.x', to: 1 }, { prop: 'scale.y', to: 1 }], duration: 2 * FRAME_RATE },
				{
					tweens: [{ prop: 'scale.x', to: 2 }, { prop: 'scale.y', to: 2 }], duration: 2 * FRAME_RATE, onfinish: () =>
					{
						this._fBullet_spr && Sequence.destroy(Sequence.findByTarget(this._fBullet_spr));
					}
				}
			];
			Sequence.start(this._fBullet_spr, lScaleSeq_arr);
		}
	}

	destroy()
	{
		this._fBullet_spr && Sequence.destroy(Sequence.findByTarget(this._fBullet_spr));
		this._fBullet_spr = null;

		this._fBulletGlow_spr && Sequence.destroy(Sequence.findByTarget(this._fBulletGlow_spr));
		this._fBulletGlow_spr = null;

		super.destroy();
	}
}

export default BigBullet;