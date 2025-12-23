import Sprite from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import Timer from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../../../shared/src/CommonConstants';
import AtlasConfig from '../../../../../config/AtlasConfig';
import { AtlasSprite } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';

import FireBossDeathDustAnimation from './animation/fire/FireBossDeathDustAnimation';
import FireBossDeathRaysAnimation from './animation/fire/FireBossDeathRaysAnimation';
import FireBossDeathSmallExploasionsAnimation from './animation/fire/FireBossDeathSmallExploasionsAnimation';
import BossDeathFxAnimation from './BossDeathFxAnimation';

let _big_exploasion_textures = null;
function _generateBigExploasionTextures()
{
	if (_big_exploasion_textures) return

	_big_exploasion_textures = AtlasSprite.getFrames(
		[
			APP.library.getAsset("boss_mode/fire/big_explosion/big_explosion_1"),
			APP.library.getAsset("boss_mode/fire/big_explosion/big_explosion_2"),
		],
		[
			AtlasConfig.FireBossDeathBigExplosion1,
			AtlasConfig.FireBossDeathBigExplosion2,
		],
		"");
}

class FireBossDeathFxAnimation extends BossDeathFxAnimation
{
	i_startAnimation(aZombieView_e)
	{
		this._startAnimation(aZombieView_e);
	}

	get bossDissappearingBottomFXContainerInfo()
	{
		return APP.gameScreen.gameFieldController.bossDissappearingBottomFXContainerInfo;
	}

	constructor()
	{
		super();

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			_generateBigExploasionTextures();
		}

		this._fDeathDustContainer_spr = this.bossDissappearingBottomFXContainerInfo.container.addChild(new Sprite());
		this._fDeathDustContainer_spr.zIndex = this.bossDissappearingBottomFXContainerInfo.zIndex;

		this._fDeathRaysContainer_spr = this.addChild(new Sprite());
		this._fDeathRaysContainer_spr.zIndex = 1000;
		this._fDeathExploasionsContainer_spr = this.addChild(new Sprite());
		this._fDeathExploasionsContainer_spr.zIndex = 1001;
		this._fBigExploasinContainer_spr = this.addChild(new Sprite());
		this._fBigExploasinContainer_spr.zIndex = 1002;
	}

	get _defeatedCaptionTime()
	{
		return 73 * FRAME_RATE;
	}

	_startAnimation(aZombieView_e)
	{
		super._startAnimation(aZombieView_e);

		let offsetPosition = this.globalToLocal(this._fDeathDustContainer_spr.getGlobalPosition().x, this._fDeathDustContainer_spr.getGlobalPosition().y);
		this._fDeathDustContainer_spr.x = -offsetPosition.x;
		this._fDeathDustContainer_spr.y = -offsetPosition.y - 100;

		this._startFireRays();
		this._startExploasions();

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._fStartDeathDustTimer_tmr = new Timer(() =>
			{
				this._fStartDeathDustTimer_tmr && this._fStartDeathDustTimer_tmr.destructor();
				this._fStartDeathDustTimer_tmr = null;
				this._startDeathDust();

			}, 55 * FRAME_RATE);

			this._fStartBigExploasionTimer_tmr = new Timer(() =>
			{
				this._fStartBigExploasionTimer_tmr && this._fStartBigExploasionTimer_tmr.destructor();
				this._fStartBigExploasionTimer_tmr = null;
				this._startBigExploasion();

			}, 56 * FRAME_RATE);
		}	
	}

	_startBigExploasion()
	{
		this._fBigExploasinAnimation_spr = this._fBigExploasinContainer_spr.addChild(new Sprite());
		this._fBigExploasinAnimation_spr.scale.set(3);
		this._fBigExploasinAnimation_spr.textures = _big_exploasion_textures;
		this._fBigExploasinAnimation_spr.blendMode = PIXI.BLEND_MODES.ADD;
		this._fBigExploasinAnimation_spr.animationSpeed = 0.5; //30 / 60;
		this._fBigExploasinAnimation_spr.play();
		this._fBigExploasinAnimation_spr.on('animationend', () =>
		{
			this._fBigExploasinAnimation_spr.destroy();
			this._fBigExploasinContainer_spr && this._fBigExploasinContainer_spr.destroy();
			this._fBigExploasinAnimation_spr = null;
			this._animationCompletedSuspicison();
		});

	}

	_startFireRays()
	{
		this._fFireRaysAnimation_fbdra = this._fDeathRaysContainer_spr.addChild(new FireBossDeathRaysAnimation());
		this._fFireRaysAnimation_fbdra.once(FireBossDeathRaysAnimation.EVENT_ON_ANIMATION_FINISH, this._onFireRaysAnimationCompleted, this);
		this._fFireRaysAnimation_fbdra.startAnimation();
	}

	_onFireRaysAnimationCompleted()
	{
		this._fFireRaysAnimation_fbdra && this._fFireRaysAnimation_fbdra.destroy();
		this._fDeathRaysContainer_spr && this._fDeathRaysContainer_spr.destroy();
		this._fFireRaysAnimation_fbdra = null;
		this._animationCompletedSuspicison();
	}

	_startExploasions()
	{
		this._fExploasionsAnimation_fbdsea = this._fDeathExploasionsContainer_spr.addChild(new FireBossDeathSmallExploasionsAnimation());
		this._fExploasionsAnimation_fbdsea.once(FireBossDeathSmallExploasionsAnimation.EVENT_ON_ANIMATION_FINISH, this._onDeathExploasionAnimationCompleted, this);
		this._fExploasionsAnimation_fbdsea.startAnimation();
	}

	_onDeathExploasionAnimationCompleted()
	{
		this._fExploasionsAnimation_fbdsea && this._fExploasionsAnimation_fbdsea.destroy();
		this._fDeathExploasionsContainer_spr && this._fDeathExploasionsContainer_spr.destroy();
		this._fExploasionsAnimation_fbdsea = null;
		this.__onTimeToExplodeCoin();
		this._animationCompletedSuspicison();
	}

	_startDeathDust()
	{
		this._fDustAnimation_fbda = this._fDeathDustContainer_spr.addChild(new FireBossDeathDustAnimation());
		this._fDustAnimation_fbda.once(FireBossDeathDustAnimation.EVENT_ON_ANIMATION_FINISH, this._onDustAnimationCompleted, this);
		this._fDustAnimation_fbda.startAnimation();
	}

	_onDustAnimationCompleted()
	{
		this._fDustAnimation_fbda && this._fDustAnimation_fbda.destroy();
		this._fDeathDustContainer_spr && this._fDeathDustContainer_spr.destroy();
		this._fDustAnimation_fbda = null;
		this._animationCompletedSuspicison();
	}

	_animationCompletedSuspicison()
	{
		if (!this._fFireRaysAnimation_fbdra &&
			!this._fExploasionsAnimation_fbdsea &&
			!this._fDustAnimation_fbda &&
			!this._fBigExploasinAnimation_spr)
		{
			this.__onBossDeathAnimationCompleted();
		}
	}

	_destroyAnimation()
	{
		this._fFireRaysAnimation_fbdra && this._fFireRaysAnimation_fbdra.destroy();
		this._fFireRaysAnimation_fbdra = null;

		this._fExploasionsAnimation_fbdsea && this._fExploasionsAnimation_fbdsea.destroy();
		this._fExploasionsAnimation_fbdsea = null;

		this._fDustAnimation_fbda && this._fDustAnimation_fbda.destroy();
		this._fDustAnimation_fbda = null;

		this._fBigExploasinAnimation_spr && this._fBigExploasinAnimation_spr.destroy();
		this._fBigExploasinAnimation_spr = null;
	}

	destroy()
	{
		this._fStartDeathDustTimer_tmr && this._fStartDeathDustTimer_tmr.destructor();
		this._fStartDeathDustTimer_tmr = null;
		this._fStartBigExploasionTimer_tmr && this._fStartBigExploasionTimer_tmr.destructor();
		this._fStartBigExploasionTimer_tmr = null;

		this._destroyAnimation();
		super.destroy();
	}
}

export default FireBossDeathFxAnimation;