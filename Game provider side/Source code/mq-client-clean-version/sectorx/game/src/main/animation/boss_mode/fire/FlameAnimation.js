
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import AtlasSprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import AtlasConfig from '../../../../config/AtlasConfig';

let flame_textures = null;
export function generateFlameTextures()
{
	if (!flame_textures)
	{

		flame_textures = AtlasSprite.getFrames(
			[
				APP.library.getAsset("boss_mode/common/flame_explosion_1"),
				APP.library.getAsset("boss_mode/common/flame_explosion_2")
			],
			[
				AtlasConfig.Flame1,
				AtlasConfig.Flame2
			],
			"");
	}

	return flame_textures;
}

class FlameAnimation extends Sprite
{
	static get EVENT_ON_ANIMATION_FINISH() { return "onAnimationFinish"; }

	startAnimation()
	{
		this._startAnimation();
	}

	constructor()
	{
		super();

		generateFlameTextures();
	}

	_startAnimation()
	{
		const lFlame_spr = this.addChild(new Sprite());
		lFlame_spr.scale.set(2);
		lFlame_spr.textures = flame_textures;
		lFlame_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lFlame_spr.animationSpeed = 0.5; //30 / 60
		lFlame_spr.play();
		lFlame_spr.on('animationend', () =>
		{
			lFlame_spr.destroy();
			this.emit(FlameAnimation.EVENT_ON_ANIMATION_FINISH);
		});
	}

	destroy()
	{
		super.destroy();
	}
}

export default FlameAnimation;