import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import AtlasSprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import AtlasConfig from '../../../config/AtlasConfig';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../shared/src/CommonConstants';
import ProfilingInfo from '../../../../../../common/PIXI/src/dgphoenix/unified/model/profiling/ProfilingInfo';
import * as Easing from '../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import BulletsExploasionAnimation from "./BulletsExploasionAnimation"

let _blue_smoke_textures = null;
function _generateBlueSmokeTextures()
{
	if (_blue_smoke_textures) return

	_blue_smoke_textures = AtlasSprite.getFrames([APP.library.getAsset("enemies/bullet_capsule/blue_smoke_1"), APP.library.getAsset("enemies/bullet_capsule/blue_smoke_2")], [AtlasConfig.BulletCapsuleBlueSmoke1, AtlasConfig.BulletCapsuleBlueSmoke2], "");
}

let _puff_textures = null;
function _generatePuffTextures()
{
	if (_puff_textures) return

	_puff_textures = AtlasSprite.getFrames(APP.library.getAsset("enemies/bullet_capsule/puff_1"), AtlasConfig.BulletCapsulePuff1, "");
}

let _exploasion_textures = null;
function _generateExploasionTextures()
{
	if (_exploasion_textures) return

	_exploasion_textures = AtlasSprite.getFrames(
		[
			APP.library.getAsset("enemies/bullet_capsule/exploasion_1"),
			APP.library.getAsset("enemies/bullet_capsule/exploasion_2"),
			APP.library.getAsset("enemies/bullet_capsule/exploasion_3"),
		],
		[
			AtlasConfig.BulletCapsuleExploasion1,
			AtlasConfig.BulletCapsuleExploasion2,
			AtlasConfig.BulletCapsuleExploasion3,
		], "");
}

class BulletCapsuleDeathAnimation extends Sprite
{
	static get EVENT_ON_ANIMATION_END() { return "eventOnAnimationEnd"; }

	startAnimation(aPosition_obj)
	{
		this._startAnimation(aPosition_obj);
	}

	get bulletCapsuleExploasionAnimationInfo()
	{
		return APP.gameScreen.gameFieldController.bulletCapsuleExploasionAnimationInfo;
	}

	constructor()
	{
		super();

		_generateBlueSmokeTextures();
		_generatePuffTextures();
		_generateExploasionTextures();

		this._fMainContainer_spr = this.bulletCapsuleExploasionAnimationInfo.container.addChild(new Sprite());
		this._fMainContainer_spr.zIndex = this.bulletCapsuleExploasionAnimationInfo.zIndex;
		this._fBulletsExploasionAnimation_bea = this._fMainContainer_spr.addChild(new BulletsExploasionAnimation());
		this._fBulletsExploasionAnimation_bea.visible = false;
		this._fBlueSmoke_spr = this._fMainContainer_spr.addChild(new Sprite());
		this._fPuff_spr = this._fMainContainer_spr.addChild(new Sprite());
		this._fOrb_spr = this._fMainContainer_spr.addChild(APP.library.getSpriteFromAtlas("common/orange_orb"));
		this._fOrb_spr.visible = false;
		this._fExploasion_spr = this._fMainContainer_spr.addChild(new Sprite());
	}

	_startAnimation(aPosition_obj = { x: 0, y: 0 })
	{
		const lOffsetX = 20;
		const lOffsetY = -40;
		this._fMainContainer_spr.position.set(aPosition_obj.x + lOffsetX, aPosition_obj.y + lOffsetY);

		this._startBulletsExploasionAnimation();

		const lAnimSeq_arr = [
			{
				tweens: [], duration: 1 * FRAME_RATE, onfinish: () =>
				{
					this._startPuffSmokeAnimation();
				}
			},
			{
				tweens: [], duration: 1 * FRAME_RATE, onfinish: () =>
				{
					this._startBlueSmokeAnimation();
				}
			},
			{
				tweens: [], duration: 3 * FRAME_RATE, onfinish: () =>
				{
					this._startOrbAnimation();
				}
			},
			{
				tweens: [], duration: 1 * FRAME_RATE, onfinish: () =>
				{
					this._startExploasionAnimation();
				}
			},
			{
				tweens: [], duration: 2 * FRAME_RATE, onfinish: () =>
				{
					this._startFieldCoverAnimation();
				}
			}
		];
		Sequence.start(this, lAnimSeq_arr);
	}

	_startExploasionAnimation()
	{
		_generateExploasionTextures();

		this._fExploasion_spr.textures = _exploasion_textures;
		this._fExploasion_spr.blendMode = PIXI.BLEND_MODES.ADD;
		this._fExploasion_spr.scale.set(2);
		this._fExploasion_spr.animationSpeed = 0.5; //30 / 60;
		this._fExploasion_spr.once('animationend', () =>
		{
			this._fExploasion_spr.destroy();
			this._fExploasion_spr = null;
			this._tryToFinishAnimation();
		});
		this._fExploasion_spr.play();
	}

	_startOrbAnimation()
	{
		this._fOrb_spr.visible = true;
		this._fOrb_spr.blendMode = PIXI.BLEND_MODES.ADD;
		this._fOrb_spr.alpha = 0.9;
		this._fOrb_spr.scale.set(1.6);

		const lAlphaSeq_arr = [
			{ tweens: [], duration: 2 * FRAME_RATE },
			{ tweens: [{ prop: "alpha", to: 0 }], duration: 13 * FRAME_RATE }
		];
		Sequence.start(this._fOrb_spr, lAlphaSeq_arr);

		const lScaleSeq_arr = [
			{
				tweens: [{ prop: 'scale.x', to: 12 }, { prop: 'scale.y', to: 12 }], duration: 18 * FRAME_RATE, ease: Easing.cubic.easeInOut, onfinish: () =>
				{
					this._fOrb_spr && Sequence.destroy(Sequence.findByTarget(this._fOrb_spr));
					this._fOrb_spr = null;
					this._tryToFinishAnimation();
				}
			},
		];
		Sequence.start(this._fOrb_spr, lScaleSeq_arr);
	}

	_startPuffSmokeAnimation()
	{
		_generatePuffTextures();

		this._fPuff_spr.textures = _puff_textures;
		this._fPuff_spr.blendMode = PIXI.BLEND_MODES.ADD;
		this._fPuff_spr.scale.set(5);
		this._fPuff_spr.animationSpeed = 0.5; //30 / 60;
		this._fPuff_spr.once('animationend', () =>
		{
			this._fPuff_spr.destroy();
			this._fPuff_spr = null;
			this._tryToFinishAnimation();
		});
		this._fPuff_spr.play();
	}

	_startBlueSmokeAnimation()
	{
		_generateBlueSmokeTextures();

		this._fBlueSmoke_spr.textures = _blue_smoke_textures;
		this._fBlueSmoke_spr.blendMode = PIXI.BLEND_MODES.SCREEN;
		this._fBlueSmoke_spr.scale.set(2);
		this._fBlueSmoke_spr.animationSpeed = 0.5; //30 / 60;
		this._fBlueSmoke_spr.once('animationend', () =>
		{
			this._fBlueSmoke_spr.destroy();
			this._fBlueSmoke_spr = null;
			this._tryToFinishAnimation();
		});
		this._fBlueSmoke_spr.play();
	}

	_startFieldCoverAnimation()
	{
		APP.gameScreen.bulletCapsuleFeatureController.startFieldAnimation();
	}

	_startBulletsExploasionAnimation()
	{
		this._fBulletsExploasionAnimation_bea.visible = true;
		this._fBulletsExploasionAnimation_bea.on(BulletsExploasionAnimation.EVENT_ON_ANIMATION_END, this._onBulletsExploasionFinishAnimation, this);
		this._fBulletsExploasionAnimation_bea.startAnimation();
	}

	_onBulletsExploasionFinishAnimation()
	{
		this._fBulletsExploasionAnimation_bea && this._fBulletsExploasionAnimation_bea.off(BulletsExploasionAnimation.EVENT_ON_ANIMATION_END, this._tryToFinishAnimation, this);
		this._fBulletsExploasionAnimation_bea = null;

		this._tryToFinishAnimation();
	}

	_tryToFinishAnimation()
	{
		if (!this._fBulletsExploasionAnimation_bea && 
			!this._fPuff_spr &&
			!this._fBlueSmoke_spr &&
			!this._fOrb_spr &&
			!this._fExploasion_spr)
		{
			this.emit(BulletCapsuleDeathAnimation.EVENT_ON_ANIMATION_END);
		}
	}

	destroy()
	{
		Sequence.destroy(Sequence.findByTarget(this));

		this._fBulletsExploasionAnimation_bea && this._fBulletsExploasionAnimation_bea.off(BulletsExploasionAnimation.EVENT_ON_ANIMATION_END, this._tryToFinishAnimation, this);

		this._fOrb_spr && Sequence.destroy(Sequence.findByTarget(this._fOrb_spr));
		this._fOrb_spr = null;

		super.destroy();

		this._fMainContainer_spr = null;
		this._fBulletsExploasionAnimation_bea = null;
		this._fBlueSmoke_spr = null;
		this._fPuff_spr = null;
		this._fExploasion_spr = null;
	}
}

export default BulletCapsuleDeathAnimation;