
import { AtlasSprite, Sprite } from '../../../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import AtlasConfig from '../../../../../../../config/AtlasConfig';
import { APP } from '../../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';

let _dust_textures = null;
function _generateDustTextures()
{
	if (_dust_textures) return

	_dust_textures = AtlasSprite.getFrames(
		[
			APP.library.getAsset("boss_mode/fire/top_dust/top_dust")
		],
		[
			AtlasConfig.TopDust,
		],
		"");
}

const DUST_COUNT = 2;

class FireBossDeathDustAnimation extends Sprite
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

		_generateDustTextures();

		this._fDustContainer_spr = null;
		this._fDustCount_num = 0;
	}

	_startAnimation()
	{
		this._startDusts();
	}

	_startDusts()
	{
		this._fDustContainer_spr = this.addChild(new Sprite());

		this._startDust({ x: -150, y: 130 }, { x: -9.6, y: 12.74 });
		this._startDust({ x: 150, y: -130 }, { x: -9.6, y: 12.74 });
	}

	_startDust(aPosition_obj, aScale_obj)
	{
		const lDust_spr = this._fDustContainer_spr.addChild(new Sprite());
		lDust_spr.position = aPosition_obj;
		lDust_spr.scale.set(aScale_obj.x, aScale_obj.y);
		lDust_spr.textures = _dust_textures;
		lDust_spr.animationSpeed = 0.5; //30 / 60;
		lDust_spr.play();
		lDust_spr.on('animationend', () =>
		{
			lDust_spr.destroy();
			this._checkAnimationFinish();
		});
	}

	_checkAnimationFinish()
	{
		this._fDustCount_num++;
		if (this._fDustCount_num == DUST_COUNT)
		{
			this.emit(FireBossDeathDustAnimation.EVENT_ON_ANIMATION_FINISH);
		}
	}

	_interrupt()
	{
		this._fDustCount_num = 0;
	}

	destroy()
	{
		super.destroy();

		this._interrupt();

		this._fDustContainer_spr = null;
		this._fDustCount_num = null;
	}
}

export default FireBossDeathDustAnimation;