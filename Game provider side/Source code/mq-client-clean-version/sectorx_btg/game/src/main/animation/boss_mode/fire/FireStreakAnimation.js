
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import AtlasSprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import AtlasConfig from '../../../../config/AtlasConfig';
import { FRAME_RATE } from '../../../../../../shared/src/CommonConstants';
import Sequence from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { Utils } from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';

const STREAK_COUNT = 5;

let _fire_streak_textures = null;
function _generateStreakTextures()
{
	if (_fire_streak_textures) return

	_fire_streak_textures = AtlasSprite.getFrames(
		[
			APP.library.getAsset("boss_mode/fire/fire_streak/fire_streak"),
		],
		[
			AtlasConfig.FireBossFireStreak,
		],
		"");
}

class FireStreakAnimation extends Sprite
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

		_generateStreakTextures();

		this._fStreakCount_num = 0;
	}

	_startAnimation()
	{
		this._startStreakAnimation({ x: 0, y: 0 }, 0.41887902047863906); //Utils.gradToRad(24)
		this._startStreakAnimation({ x: 0, y: 0 }, 1.0821041362364843); //Utils.gradToRad(62)
		let lTimingSeq_arr = [
			{
				tweens: [], duration: 1 * FRAME_RATE, onfinish: () =>
				{
					this._startStreakAnimation({ x: 0, y: 0 }, 2.705260340591211); //Utils.gradToRad(155)
					this._startStreakAnimation({ x: 0, y: 0 }, 4.34586983746588); //Utils.gradToRad(249)
				}
			},
			{
				tweens: [], duration: 1 * FRAME_RATE, onfinish: () =>
				{
					this._startStreakAnimation({ x: 0, y: 0 }, 5.707226654021458); //Utils.gradToRad(327)
				}
			},
		];
		Sequence.start(this, lTimingSeq_arr);
	}

	_startStreakAnimation(aPosition_obj, aAngle_num)
	{
		const lStreak_spr = this.addChild(new Sprite());
		lStreak_spr.position = aPosition_obj;
		lStreak_spr.scale.set(2);
		lStreak_spr.textures = _fire_streak_textures;
		lStreak_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lStreak_spr.rotation = aAngle_num;
		lStreak_spr.animationSpeed = 0.5; //30 / 60
		lStreak_spr.play();
		lStreak_spr.on('animationend', () =>
		{
			lStreak_spr.destroy();
			this._checkAnimationFinish();
		});
	}

	_checkAnimationFinish()
	{
		this._fStreakCount_num++;
		if (this._fStreakCount_num == STREAK_COUNT)
		{
			this.emit(FireStreakAnimation.EVENT_ON_ANIMATION_FINISH);
		}
	}

	_interrupt()
	{
		Sequence.destroy(Sequence.findByTarget(this));

		this._fStreakCount_num = 0;
	}

	destroy()
	{
		super.destroy();

		this._interrupt();

		this._fStreakCount_num = null;
	}
}

export default FireStreakAnimation;