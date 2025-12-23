import { ENEMIES, FRAME_RATE } from '../../../../../../../shared/src/CommonConstants';
import Timer from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import AppearanceView from './AppearanceView';
import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { Sprite } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';

import HoleAnimation from '../../../../../main/animation/boss_mode/fire/HoleAnimation';
import FireStreakAnimation from '../../../../../main/animation/boss_mode/fire/FireStreakAnimation';
import CharredAnimation from '../../../../../main/animation/boss_mode/fire/CharredAnimation';
import AppearingSmokeAnimation from '../../../../../main/animation/boss_mode/fire/AppearingSmokeAnimation';
import FlameAnimation from '../../../../../main/animation/boss_mode/fire/FlameAnimation';
import AppearingTopFireAnimation from '../../../../../main/animation/boss_mode/fire/AppearingTopFireAnimation';
import AppearingDustAnimation from '../../../../../main/animation/boss_mode/fire/AppearingDustAnimation';
import AppearingTopFlareAnimation from '../../../../../main/animation/boss_mode/fire/AppearingTopFlareAnimation';
import FireCircleOrangeRedAnimation from '../../../../../main/animation/boss_mode/fire/FireCircleOrangeRedAnimation';

class FireBossAppearanceView extends AppearanceView
{
	static get EVENT_APPEARING_PRESENTATION_STARTED() { return AppearanceView.EVENT_APPEARING_PRESENTATION_STARTED; }
	static get EVENT_SHAKE_THE_GROUND_REQUIRED() { return AppearanceView.EVENT_SHAKE_THE_GROUND_REQUIRED; }

	constructor(aViewContainerInfo_obj)
	{
		super();

		this._fViewContainerInfo_obj = aViewContainerInfo_obj;

		this._fBottomFXContainer = null;
		this._fTopFXContainer = null;

		this._fHoleContainer_spr = null;
		this._fStartHoleAnimation_tmr = null;
		this._fFireBossHoleAnimation_ha = null;
		this._fFireStreakContainer_spr = null;
		this._fStartFireStreakAnimation_tmr = null;
		this._fCharredContainer_spr = null;
		this._fStartCharredAnimation_tmr = null;
		this._fFireBossCharredAnimation_ca = null;
		this._fAppearingSmokeContainer_spr = null;
		this._fAppearingCircleOrangeRedContainer_spr = null;
		this._fFireBossAppearingSmokeAnimation_asa = null;
		this._fFlameContainer_spr = null;
		this._fStartFlameAnimation_tmr = null;
		this._fFireBossFlameAnimation_fa = null;
		this._fTopFireContainer_spr = null;
		this._fStartTopFireAnimation_tmr = null;
		this._fFireBossTopFireAnimation_atfa = null;
		this._fTopDustContainer_spr = null;
		this._fStartTopDustAnimation_tmr = null;
		this._fFireBossTopDustAnimation_ada = null;
		this._fTopFlareContainer_spr = null;
		this._fStartTopFlareAnimation_tmr = null;

		this._init();
	}

	_init()
	{
		this._fBottomFXContainer = this._fViewContainerInfo_obj.container.addChild(new Sprite());
		this._fBottomFXContainer.zIndex = this._fViewContainerInfo_obj.bottomZIndex;
		this._fTopFXContainer = this._fViewContainerInfo_obj.container.addChild(new Sprite());
		this._fTopFXContainer.zIndex = this._fViewContainerInfo_obj.zIndex;

		this._fHoleContainer_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
		this._fHoleContainer_spr.position.set(480, 270); //960 / 2, 540 / 2)
		this._fBottomFXContainer.addChild(this._fHoleContainer_spr);

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._fFireStreakContainer_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
			this._fFireStreakContainer_spr.position.set(480, 270); //960 / 2, 540 / 2)
			this._fBottomFXContainer.addChild(this._fFireStreakContainer_spr);

			this._fCharredContainer_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
			this._fCharredContainer_spr.position.set(480, 270); //960 / 2, 540 / 2)
			this._fBottomFXContainer.addChild(this._fCharredContainer_spr);

			this._fAppearingSmokeContainer_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
			this._fAppearingSmokeContainer_spr.position.set(480, 270); //960 / 2, 540 / 2)
			this._fBottomFXContainer.addChild(this._fAppearingSmokeContainer_spr);

			this._fAppearingCircleOrangeRedContainer_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
			this._fAppearingCircleOrangeRedContainer_spr.position.set(480, 270); //960 / 2, 540 / 2)
			this._fBottomFXContainer.addChild(this._fAppearingCircleOrangeRedContainer_spr);

			this._fTopFireContainer_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
			this._fTopFireContainer_spr.position.set(480, 270); //960 / 2, 540 / 2)
			this._fTopFXContainer.addChild(this._fTopFireContainer_spr);

			this._fTopDustContainer_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
			this._fTopDustContainer_spr.position.set(480, 270); //960 / 2, 540 / 2)
			this._fTopFXContainer.addChild(this._fTopDustContainer_spr);
		}

		this._fFlameContainer_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
		this._fFlameContainer_spr.position.set(480, 270); //960 / 2, 540 / 2)
		this._fBottomFXContainer.addChild(this._fFlameContainer_spr);

		this._fTopFlareContainer_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
		this._fTopFlareContainer_spr.position.set(480, 270); //960 / 2, 540 / 2)
		this._fTopFXContainer.addChild(this._fTopFlareContainer_spr);
	}

	_playAppearingAnimation()
	{
		super._playAppearingAnimation();

		this._startHoleAnimation();
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startFireSrtreakAnimation();
			this._startCharredAnimation();
			this._startAppearingSmokeAnimation();
			this._startAppearingCircleOrangeRedAnimation();
		}
		this._startFlameAnimation();
		
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startTopFireAnimation();
			this._startTopDustAnimation();
		}
		this._startTopFlareAnimation();

		this.emit(FireBossAppearanceView.EVENT_APPEARING_PRESENTATION_STARTED);
		this.emit(FireBossAppearanceView.EVENT_SHAKE_THE_GROUND_REQUIRED);
	}

	_startHoleAnimation()
	{
		this._fStartHoleAnimation_tmr = new Timer(() =>
		{
			this._fStartHoleAnimation_tmr && this._fStartHoleAnimation_tmr.destructor();
			this._fFireBossHoleAnimation_ha = this._fHoleContainer_spr.addChild(new HoleAnimation());
			this._fFireBossHoleAnimation_ha.once(HoleAnimation.EVENT_ON_ANIMATION_FINISH, this._onHoleAnimationCompleted, this);
			this._fFireBossHoleAnimation_ha.position.set(0, 38);
			this._fFireBossHoleAnimation_ha.startAnimation();
		}, 37 * FRAME_RATE);
	}

	_startFireSrtreakAnimation()
	{
		this._fStartFireStreakAnimation_tmr = new Timer(() =>
		{
			this._fStartFireStreakAnimation_tmr && this._fStartFireStreakAnimation_tmr.destructor();
			this._fFireBossFireStreakAnimation_fsa = this._fFireStreakContainer_spr.addChild(new FireStreakAnimation());
			this._fFireBossFireStreakAnimation_fsa.once(FireStreakAnimation.EVENT_ON_ANIMATION_FINISH, this._onFireStreakAnimationCompleted, this);
			this._fFireBossFireStreakAnimation_fsa.position.set(0, 0);
			this._fFireBossFireStreakAnimation_fsa.startAnimation();
		}, 20 * FRAME_RATE);
	}

	_startCharredAnimation()
	{
		this._fStartCharredAnimation_tmr = new Timer(() =>
		{
			this._fStartCharredAnimation_tmr && this._fStartCharredAnimation_tmr.destructor();
			this._fFireBossCharredAnimation_ca = this._fCharredContainer_spr.addChild(new CharredAnimation());
			this._fFireBossCharredAnimation_ca.once(CharredAnimation.EVENT_ON_ANIMATION_FINISH, this._onCharredAnimationCompleted, this);
			this._fFireBossCharredAnimation_ca.position.set(0, 40);
			this._fFireBossCharredAnimation_ca.startAnimation();
		}, 4 * FRAME_RATE);
	}

	_startAppearingSmokeAnimation()
	{
		this._fStartAppearingSmokeAnimation_tmr = new Timer(() =>
		{
			this._fStartAppearingSmokeAnimation_tmr && this._fStartAppearingSmokeAnimation_tmr.destructor();
			this._fFireBossAppearingSmokeAnimation_asa = this._fAppearingSmokeContainer_spr.addChild(new AppearingSmokeAnimation());
			this._fFireBossAppearingSmokeAnimation_asa.once(AppearingSmokeAnimation.EVENT_ON_ANIMATION_FINISH, this._onAppearingSmokeAnimationCompleted, this);
			this._fFireBossAppearingSmokeAnimation_asa.position.set(0, -40);
			this._fFireBossAppearingSmokeAnimation_asa.startAnimation();
		}, 17 * FRAME_RATE);
	}

	_startAppearingCircleOrangeRedAnimation()
	{
		this._fStartAppearingCircleOrangeRedAnimation_tmr = new Timer(() =>
		{
			this._fStartAppearingCircleOrangeRedAnimation_tmr && this._fStartAppearingCircleOrangeRedAnimation_tmr.destructor();
			this._fFireBossAppearingCircleOrangeRedAnimation_fcora = this._fAppearingCircleOrangeRedContainer_spr.addChild(new FireCircleOrangeRedAnimation());
			this._fFireBossAppearingCircleOrangeRedAnimation_fcora.once(FireCircleOrangeRedAnimation.EVENT_ON_ANIMATION_FINISH, this._onAppearingCircleOrangeRedAnimationCompleted, this);
			this._fFireBossAppearingCircleOrangeRedAnimation_fcora.position.set(0, 40);
			this._fFireBossAppearingCircleOrangeRedAnimation_fcora.startAnimation();
		}, 26 * FRAME_RATE);
	}

	_startFlameAnimation()
	{
		this._fStartFlameAnimation_tmr = new Timer(() =>
		{
			this._fStartFlameAnimation_tmr && this._fStartFlameAnimation_tmr.destructor();
			this._fFireBossFlameAnimation_fa = this._fFlameContainer_spr.addChild(new FlameAnimation());
			this._fFireBossFlameAnimation_fa.once(FlameAnimation.EVENT_ON_ANIMATION_FINISH, this._onFlameAnimationCompleted, this);
			this._fFireBossFlameAnimation_fa.position.set(-8, -40);
			this._fFireBossFlameAnimation_fa.startAnimation();
		}, 2 * FRAME_RATE);
	}

	_startTopFireAnimation()
	{
		this._fStartTopFireAnimation_tmr = new Timer(() =>
		{
			this._fStartTopFireAnimation_tmr && this._fStartTopFireAnimation_tmr.destructor();
			this._fFireBossTopFireAnimation_atfa = this._fTopFireContainer_spr.addChild(new AppearingTopFireAnimation());
			this._fFireBossTopFireAnimation_atfa.once(AppearingTopFireAnimation.EVENT_ON_ANIMATION_FINISH, this._onTopFireCompleted, this);
			this._fFireBossTopFireAnimation_atfa.position.set(-15, -43);
			this._fFireBossTopFireAnimation_atfa.startAnimation();
		}, 10 * FRAME_RATE);
	}

	_startTopDustAnimation()
	{
		this._fStartTopDustAnimation_tmr = new Timer(() =>
		{
			this._fStartTopDustAnimation_tmr && this._fStartTopDustAnimation_tmr.destructor();
			this._fFireBossTopDustAnimation_ada = this._fTopDustContainer_spr.addChild(new AppearingDustAnimation());
			this._fFireBossTopDustAnimation_ada.once(AppearingDustAnimation.EVENT_ON_ANIMATION_FINISH, this._onTopDustCompleted, this);
			this._fFireBossTopDustAnimation_ada.position.set(-76, -72);
			this._fFireBossTopDustAnimation_ada.startAnimation();
		}, 0 * FRAME_RATE);
	}

	_startTopFlareAnimation()
	{
		this._fStartTopFlareAnimation_tmr = new Timer(() =>
		{
			this._fStartTopFlareAnimation_tmr && this._fStartTopFlareAnimation_tmr.destructor();
			this._fFireBossTopFlareAnimation_atfa = this._fTopFlareContainer_spr.addChild(new AppearingTopFlareAnimation());
			this._fFireBossTopFlareAnimation_atfa.once(AppearingTopFlareAnimation.EVENT_ON_ANIMATION_FINISH, this._onTopFlareCompleted, this);
			this._fFireBossTopFlareAnimation_atfa.position.set(0, 0);
			this._fFireBossTopFlareAnimation_atfa.startAnimation();
		}, 22 * FRAME_RATE);
	}

	_onTopFlareCompleted()
	{
		this._fFireBossTopFlareAnimation_atfa && this._fFireBossTopFlareAnimation_atfa.destroy();
		this._fFireBossTopFlareAnimation_atfa = null;
		this._checkAnimationFinish();
	}

	_onTopDustCompleted()
	{
		this._fFireBossTopDustAnimation_ada && this._fFireBossTopDustAnimation_ada.destroy();
		this._fFireBossTopDustAnimation_ada = null;
		this._checkAnimationFinish();
	}

	_onTopFireCompleted()
	{
		this._fFireBossTopFireAnimation_atfa && this._fFireBossTopFireAnimation_atfa.destroy();
		this._fFireBossTopFireAnimation_atfa = null;
		this._checkAnimationFinish();
	}

	_onFlameAnimationCompleted()
	{
		this._fFireBossFlameAnimation_fa && this._fFireBossFlameAnimation_fa.destroy();
		this._fFireBossFlameAnimation_fa = null;
		this._checkAnimationFinish();
	}

	_onAppearingSmokeAnimationCompleted()
	{
		this._fFireBossAppearingSmokeAnimation_asa && this._fFireBossAppearingSmokeAnimation_asa.destroy();
		this._fFireBossAppearingSmokeAnimation_asa = null;
		this._checkAnimationFinish();
	}

	_onAppearingCircleOrangeRedAnimationCompleted()
	{
		this._fFireBossAppearingCircleOrangeRedAnimation_fcora && this._fFireBossAppearingCircleOrangeRedAnimation_fcora.destroy();
		this._fFireBossAppearingCircleOrangeRedAnimation_fcora = null;
		this._checkAnimationFinish();
	}

	_onCharredAnimationCompleted()
	{
		this._fFireBossCharredAnimation_ca && this._fFireBossCharredAnimation_ca.destroy();
		this._fFireBossCharredAnimation_ca = null;
		this._checkAnimationFinish();
	}

	_onFireStreakAnimationCompleted()
	{
		this._fFireBossFireStreakAnimation_ha && this._fFireBossFireStreakAnimation_ha.destroy();
		this._fFireBossFireStreakAnimation_ha = null;
		this._checkAnimationFinish();
	}

	_onHoleAnimationCompleted()
	{
		this._fFireBossHoleAnimation_ha && this._fFireBossHoleAnimation_ha.destroy();
		this._fFireBossHoleAnimation_ha = null;
		this._checkAnimationFinish();
	}

	_checkAnimationFinish()
	{
		if (!this._fFireBossHoleAnimation_ha &&
			!this._fFireBossFireStreakAnimation_ha &&
			!this._fFireBossCharredAnimation_ca &&
			!this._fFireBossAppearingSmokeAnimation_asa &&
			!this._fFireBossAppearingCircleOrangeRedAnimation_fcora &&
			!this._fFireBossFlameAnimation_fa &&
			!this._fFireBossTopFireAnimation_atfa &&
			!this._fFireBossTopDustAnimation_ada &&
			!this._fFireBossTopFlareAnimation_atfa)
		{
			this._onAppearingCompleted();
		}
	}

	get _captionPosition()
	{
		return { x: 0, y: -4 };
	}

	get _bossType()
	{
		return ENEMIES.FireBoss;
	}

	destroy()
	{
		this._fStartFireStreakAnimation_tmr && this._fStartFireStreakAnimation_tmr.destructor();
		this._fStartFireStreakAnimation_tmr = null;
		this._fStartHoleAnimation_tmr && this._fStartHoleAnimation_tmr.destructor();
		this._fStartHoleAnimation_tmr = null;
		this._fStartCharredAnimation_tmr && this._fStartCharredAnimation_tmr.destructor();
		this._fStartCharredAnimation_tmr = null;
		this._fStartAppearingSmokeAnimation_tmr && this._fStartAppearingSmokeAnimation_tmr.destructor();
		this._fStartAppearingSmokeAnimation_tmr = null;
		this._fStartAppearingCircleOrangeRedAnimation_tmr && this._fStartAppearingCircleOrangeRedAnimation_tmr.destructor();
		this._fStartAppearingCircleOrangeRedAnimation_tmr = null;
		this._fStartFlameAnimation_tmr && this._fStartFlameAnimation_tmr.destructor();
		this._fStartFlameAnimation_tmr = null;
		this._fStartTopFireAnimation_tmr && this._fStartTopFireAnimation_tmr.destructor();
		this._fStartTopFireAnimation_tmr = null;
		this._fStartTopDustAnimation_tmr && this._fStartTopDustAnimation_tmr.destructor();
		this._fStartTopDustAnimation_tmr = null;
		this._fStartTopFlareAnimation_tmr && this._fStartTopFlareAnimation_tmr.destructor();
		this._fStartTopFlareAnimation_tmr = null;

		super.destroy();

		this._fViewContainerInfo_obj = null;

		this._fHoleContainer_spr = null;
		this._fFireBossHoleAnimation_ha && this._fFireBossHoleAnimation_ha.destroy();
		this._fFireBossHoleAnimation_ha = null;

		this._fFireStreakContainer_spr = null;
		this._fFireBossFireStreakAnimation_fsa && this._fFireBossFireStreakAnimation_fsa.destroy();
		this._fFireBossFireStreakAnimation_fsa = null;

		this._fCharredContainer_spr = null;
		this._fFireBossCharredAnimation_ca && this._fFireBossCharredAnimation_ca.destroy();
		this._fFireBossCharredAnimation_ca = null;

		this._fAppearingSmokeContainer_spr = null;
		this._fFireBossAppearingSmokeAnimation_asa && this._fFireBossAppearingSmokeAnimation_asa.destroy();
		this._fFireBossAppearingSmokeAnimation_asa = null;

		this._fAppearingCircleOrangeRedContainer_spr = null;
		this._fFireBossAppearingCircleOrangeRedAnimation_fcora && this._fFireBossAppearingCircleOrangeRedAnimation_fcora.destroy();
		this._fFireBossAppearingCircleOrangeRedAnimation_fcora = null;	

		this._fFlameContainer_spr = null;
		this._fFireBossFlameAnimation_fa && this._fFireBossFlameAnimation_fa.destroy();
		this._fFireBossFlameAnimation_fa = null;

		this._fTopFireContainer_spr = null;
		this._fFireBossTopFireAnimation_atfa && this._fFireBossTopFireAnimation_atfa.destroy();
		this._fFireBossTopFireAnimation_atfa = null;

		this._fTopDustContainer_spr = null;
		this._fFireBossTopDustAnimation_ada && this._fFireBossTopDustAnimation_ada.destroy();
		this._fFireBossTopDustAnimation_ada = null;

		this._fTopFlareContainer_spr = null;
		this._fFireBossTopFlareAnimation_atfa && this._fFireBossTopFlareAnimation_atfa.destroy();
		this._fFireBossTopFlareAnimation_atfa = null;

		this._fTopFXContainer && this._fTopFXContainer.destroy();
		this._fBottomFXContainer && this._fBottomFXContainer.destroy();

		this._fTopFXContainer = null;
		this._fBottomFXContainer = null;
	}
}

export default FireBossAppearanceView;