
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import AtlasSprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import AtlasConfig from '../../../../config/AtlasConfig';
import { FRAME_RATE } from '../../../../../../shared/src/CommonConstants';
import { Sequence } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';

const ANIMATIOS_COUNT = 3;

let top_explosion_textures = null;
export function generateTopExplosionTextures()
{
	if (!top_explosion_textures)
	{
		top_explosion_textures = AtlasSprite.getFrames([APP.library.getAsset("boss_mode/common/tall_fire_explosion")], [AtlasConfig.TallFireExplosion], "");
	}
	return top_explosion_textures;
}

let _top_flame_textures = null;
function _generateTopFlameTextures()
{
	if (_top_flame_textures) return

	_top_flame_textures = AtlasSprite.getFrames(
		[
			APP.library.getAsset("boss_mode/fire/top_fire/top_flame")
		],
		[
			AtlasConfig.TopFlame
		],
		"");
}

let _top_smoke_textures = null;
function _generateTopSmokeTextures()
{
	if (_top_smoke_textures) return

	_top_smoke_textures = AtlasSprite.getFrames(
		[
			APP.library.getAsset("boss_mode/fire/top_fire/top_smoke")
		],
		[
			AtlasConfig.TopSmoke
		],
		"");
}

class AppearingTopFireAnimation extends Sprite
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

		this._fAnimatiosCount_num = 0;

		generateTopExplosionTextures();
		_generateTopFlameTextures();
		_generateTopSmokeTextures();
	}

	_startAnimation()
	{
		this._startFlame();
		let lTimingSeq_arr = [
			{
				tweens: [], duration: 28 * FRAME_RATE, onfinish: () =>
				{
					this._startSmoke();
					this._startTopExplosion();
					this._checkAnimationFinish();
				}
			},
		];
		Sequence.start(this, lTimingSeq_arr);
	}

	_startFlame()
	{
		const lFlame_spr = this.addChild(new Sprite());
		lFlame_spr.position.set(0, 0);
		lFlame_spr.scale.set(2);
		lFlame_spr.textures = _top_flame_textures;
		lFlame_spr.animationSpeed = 0.5; //30 / 60
		lFlame_spr.play();
		lFlame_spr.on('animationend', () =>
		{
			lFlame_spr.destroy();
			this._checkAnimationFinish();
		});
	}

	_startSmoke()
	{
		const lSmoke_spr = this.addChild(new Sprite());
		lSmoke_spr.position.set(0, -28.95); //0, -193.9 / 2 + 68
		lSmoke_spr.scale.set(2.373, 2);
		lSmoke_spr.textures = _top_smoke_textures;
		lSmoke_spr.animationSpeed = 0.5; //30 / 60
		lSmoke_spr.play();
		lSmoke_spr.on('animationend', () =>
		{
			lSmoke_spr.destroy();
			this._checkAnimationFinish();
		});
	}

	_startTopExplosion()
	{
		const lExloasion_spr = this.addChild(new Sprite());
		lExloasion_spr.position.set(0, -66.95); //0, -193.9 / 2 + 30
		lExloasion_spr.scale.set(4.158, 3.505);
		lExloasion_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lExloasion_spr.textures = top_explosion_textures;
		lExloasion_spr.animationSpeed = 0.5; //30 / 60
		lExloasion_spr.gotoAndPlay(7);
		lExloasion_spr.on('animationend', () =>
		{
			lExloasion_spr.destroy();
			this._checkAnimationFinish();
		});
	}

	_checkAnimationFinish()
	{
		this._fAnimatiosCount_num++;
		if (this._fAnimatiosCount_num == ANIMATIOS_COUNT)
		{
			this.emit(AppearingTopFireAnimation.EVENT_ON_ANIMATION_FINISH);
		}
	}

	_interrupt()
	{
		this._fAnimatiosCount_num = 0;

		Sequence.destroy(Sequence.findByTarget(this));
	}

	destroy()
	{
		super.destroy();

		this._interrupt();

		this._fAnimatiosCount_num = null;
	}
}

export default AppearingTopFireAnimation;