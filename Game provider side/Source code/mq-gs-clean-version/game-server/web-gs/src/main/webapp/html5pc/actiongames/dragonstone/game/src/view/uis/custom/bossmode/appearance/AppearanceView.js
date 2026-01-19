import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../../../shared/src/CommonConstants';
import Sprite from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import Timer from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import Sequence from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import SmokeFxView from './SmokeFxView';
import ScreenFiresAnimation from '../disappearance/ScreenFiresAnimation';
import BossAppearanceFlameAnimation from './BossAppearanceFlameAnimation';
import { DRAGON_CAPTION_TYPES } from './BossModeCaptionView';

export const TIMERS_TO_NEXT_ANIM = [
	18*FRAME_RATE,
	27*FRAME_RATE,
	10*FRAME_RATE,
	8*FRAME_RATE,
	5*FRAME_RATE,
	95*FRAME_RATE,
	2*FRAME_RATE,
	10*FRAME_RATE
]

export const DRAGON_APPEAR_INVULNERABLE_TIME = 29*FRAME_RATE;

const DRAGON_SHADOW_DURATION = 64*FRAME_RATE;

class AppearanceView extends Sprite
{
	static get EVENT_APPEARING_PRESENTATION_STARTED()		{return "onBossModeAppearingPresentationStarted";}
	static get EVENT_APPEARING_PRESENTATION_COMPLETED()		{return "onBossModeAppearingPresentationCompleted";}
	static get EVENT_ON_TIME_TO_START_CAPTION_ANIMATION() 	{return "onTimeToStartCaptionAnimation";}
	static get EVENT_ON_TIME_TO_SCALE_MAP()					{return "onTimeToScaleMap";}
	static get EVENT_ON_TIME_TO_BLUR_MAP()					{return "onTimeToBlurMap";}
	static get EVENT_ON_TIME_TO_START_BOSS_IDLE_ANIMATION()	{return "onTimeToStartBossIdleAnimation";}
	static get EVENT_ON_DRAGON_APPEAR_TIME()				{return "EVENT_ON_DRAGON_APPEAR_TIME";}	

	startAppearing(aZombieView_e, aAppearingAccelerateTime_num=0)
	{
		this._startAppearing(aZombieView_e, aAppearingAccelerateTime_num);
	}

	interruptAnimation()
	{
		this._destroyAnimation();
	}

	startMapBlurAnimation(aZombieView_e)
	{
		this._startSmokeAnimation();
		this._fBossZombie_e = aZombieView_e;
		this._startMapBlurAnimation();
	}

	startCaptionAnimation(aZombieView_e)
	{
		this._startSmokeAnimation();
		this._fBossZombie_e = aZombieView_e;
		this._startCaptionAnimation();
	}

	startDragonFireAnimation(aZombieView_e)
	{
		this._startSmokeAnimation();
		this._fBossZombie_e = aZombieView_e;
		this._startDragonFireAnimation();
	}

	startFireOnTopAnimation(aZombieView_e)
	{
		this._startSmokeAnimation();
		this._fBossZombie_e = aZombieView_e;
		this._startFireOnTopAnimation();
	}

	startDragonShadowAnimation(aZombieView_e, aRestShadowTime=undefined)
	{
		this._startSmokeAnimation();
		this._fBossZombie_e = aZombieView_e;
		this._startDragonShadowAnimation(aRestShadowTime);
	}

	startIdleAnimation(aZombieView_e)
	{
		this._startSmokeAnimation();
		this._fBossZombie_e = aZombieView_e;
		this._startIdleAnimation();
	}

	startSecondSmoke(aZombieView_e)
	{
		this.emit(AppearanceView.EVENT_ON_TIME_TO_START_BOSS_IDLE_ANIMATION);
		this._fBossZombie_e = aZombieView_e;
		this._startSecondSmoke();
	}
	
	startDragonAppearAnimation(aZombieView_e)
	{
		this.emit(AppearanceView.EVENT_ON_TIME_TO_START_BOSS_IDLE_ANIMATION);
		this._fBossZombie_e = aZombieView_e;
		this._startDragonAppearAnimation();
	}

	constructor(aContainersInfo)
	{
		super();

		this._fContainersInfo = aContainersInfo;
		this._fBossZombie_e = null;
		this._smokeFx = null;
		this._topSmokeFx = null;
		this._fTimer_t = null;
		this._smoke1 = null;
		this._smoke2 = null;
		this._screenFiresAnimation = null;
		this._screenFiresFlashAnimation = null;
		this._fAppearingAccelerateTime_num = 0;

		this.startAppearing.bind(this);
		this.interruptAnimation.bind(this);
		this.startMapBlurAnimation.bind(this);
		this.startCaptionAnimation.bind(this);
		this.startDragonFireAnimation.bind(this);
		this.startFireOnTopAnimation.bind(this);
		this.startDragonShadowAnimation.bind(this);
		this.startIdleAnimation.bind(this);
		this.startSecondSmoke.bind(this);
		this.startDragonAppearAnimation.bind(this);
		this._startAppearing.bind(this);
		this._startAppearSmokeAnimation.bind(this);
		this._startSmokeAnimation.bind(this);
		this._startTopSmokeAnimation.bind(this);
		this._startMapBlurAnimation.bind(this);
		this._startCaptionAnimation.bind(this);
		this._startDragonFireAnimation.bind(this);
		this._startFireOnTopAnimation.bind(this);
		this._startDragonShadowAnimation.bind(this);
		this._startIdleAnimation.bind(this);
		this._startSecondSmoke.bind(this);
		this._generateSmoke.bind(this);
		this._startDragonAppearAnimation.bind(this);
		this._onSmokeAnimationEnded.bind(this);
		this._onTopSmokeAnimationEnded.bind(this);
		this._tryToCompleteAppearing.bind(this);
		this._onAppearingCompleted.bind(this);
		this._destroyAnimation.bind(this);
		this._startScreenFiresAnimation.bind(this);
		this._onScreenFiresAnimationEnded.bind(this);
		this._startFiresFlashAnimation.bind(this);
		this._onFiresFlashAnimationEnded.bind(this);
		this.destroy.bind(this);
	}

	_startAppearing(aZombieView_e, aAppearingAccelerateTime_num=0)
	{
		this._fBossZombie_e = aZombieView_e;
		this._fAppearingAccelerateTime_num = aAppearingAccelerateTime_num;

		this._startAppearSmokeAnimation();

		this.emit(AppearanceView.EVENT_APPEARING_PRESENTATION_STARTED);
	}

	_startAppearSmokeAnimation()
	{
		this._startSmokeAnimation();

		if(APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startTopSmokeAnimation();
		}

		this._fTimer_t && this._fTimer_t.destructor();
		this._fTimer_t = new Timer(()=>{
			this._startMapBlurAnimation();
		}, TIMERS_TO_NEXT_ANIM[0]);
	}

	_startSmokeAnimation()
	{
		this._smokeFx = this.addChild(new SmokeFxView());
		this._smokeFx.once(SmokeFxView.EVENT_ON_ANIMATION_ENDED, this._onSmokeAnimationEnded, this);
		this._smokeFx.startAnimation();
	}

	_startTopSmokeAnimation()
	{
		let lFireContainer = this._fContainersInfo.fireContainer;
		this._topSmokeFx = lFireContainer.addChild(new SmokeFxView());
		this._topSmokeFx.zIndex = this._fContainersInfo.flamesZIndex;
		this._topSmokeFx.once(SmokeFxView.EVENT_ON_ANIMATION_ENDED, this._onTopSmokeAnimationEnded, this);
		this._topSmokeFx.startAnimation();
	}

	_startMapBlurAnimation()
	{
		this.emit(AppearanceView.EVENT_ON_TIME_TO_BLUR_MAP);

		this._fTimer_t && this._fTimer_t.destructor();
		this._fTimer_t = new Timer(()=>{
			this._startCaptionAnimation();
		}, TIMERS_TO_NEXT_ANIM[1]);
	}

	_startCaptionAnimation()
	{
		this.emit(AppearanceView.EVENT_ON_TIME_TO_START_CAPTION_ANIMATION, {bossCaptionType: DRAGON_CAPTION_TYPES.SUMMONED_DRAGON});

		this._fTimer_t && this._fTimer_t.destructor();
		this._fTimer_t = new Timer(()=>{
			this._startDragonFireAnimation();
		}, TIMERS_TO_NEXT_ANIM[2]);
	}

	_startDragonFireAnimation()
	{
		this._startFiresFlashAnimation();

		this._fTimer_t && this._fTimer_t.destructor();
		this._fTimer_t = new Timer(()=>{
			this._startFireOnTopAnimation();
		}, TIMERS_TO_NEXT_ANIM[3]);
	}

	_startFireOnTopAnimation()
	{
		if(APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startScreenFiresAnimation();
		}

		this._fTimer_t && this._fTimer_t.destructor();
		this._fTimer_t = new Timer(()=>{
			this._startDragonShadowAnimation();
		}, TIMERS_TO_NEXT_ANIM[4]);
	}

	_startDragonShadowAnimation(aRestShadowTime=undefined)
	{
		let lTimeToIdle_num = TIMERS_TO_NEXT_ANIM[5];
		let lRestShadowTime = aRestShadowTime;
		if (this._fAppearingAccelerateTime_num > 0)
		{
			let lReduceTime = Math.min(this._fAppearingAccelerateTime_num, DRAGON_SHADOW_DURATION);
			this._fAppearingAccelerateTime_num -= lReduceTime;
			lRestShadowTime = lTimeToIdle_num - lReduceTime;
		}
		if (lRestShadowTime !== undefined && lRestShadowTime < TIMERS_TO_NEXT_ANIM[5])
		{
			lTimeToIdle_num = lRestShadowTime;
		}

		let lRestDragonShadowDuration = lTimeToIdle_num - (TIMERS_TO_NEXT_ANIM[5]-DRAGON_SHADOW_DURATION);
		if (lRestDragonShadowDuration > 0)
		{
			this._fBossZombie_e.onBossShadowTime(DRAGON_SHADOW_DURATION, lRestDragonShadowDuration);
		}

		this._fTimer_t && this._fTimer_t.destructor();
		this._fTimer_t = new Timer(()=>{
			this._startIdleAnimation();
		}, lTimeToIdle_num);
	}

	_startIdleAnimation()
	{
		this.emit(AppearanceView.EVENT_ON_TIME_TO_START_BOSS_IDLE_ANIMATION);

		this._fTimer_t && this._fTimer_t.destructor();
		this._fTimer_t = new Timer(()=>{
			this._startSecondSmoke();
		}, TIMERS_TO_NEXT_ANIM[6]);
	}

	_startSecondSmoke()
	{
		if(APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._smoke1 = this._generateSmoke({x: 960, y: 540}, {x: 2.24, y: 2.24});
			this._smoke1.rotation = 1.995;
			let seqAlph = [
				{tweens: [{prop: "alpha", to: 0.7}],	duration: 15*FRAME_RATE},
				{tweens: [{prop: "alpha", to: 0}],		duration: 118*FRAME_RATE, onfinish: ()=>{
					this._smoke1 && this._smoke1.destroy();
					this._smoke1 = null;
					this._tryToCompleteAppearing();
				}}
			];
			let seqPos = [
				{tweens: [{prop: "position.x", to: 0}, {prop: "position.y", to: 540}], duration: 132*FRAME_RATE}
			];
			Sequence.start(this._smoke1, seqAlph);
			Sequence.start(this._smoke1, seqPos);

			this._smoke2 = this._generateSmoke({x: 480, y: 270}, {x: 1.68, y: 1.68});
			let seqAlph2 = [
				{tweens: [{prop: "alpha", to: 1}],	duration: 12*FRAME_RATE},
				{tweens: [{prop: "alpha", to: 0}],	duration: 23*FRAME_RATE, onfinish: ()=>{
					this._smoke2 && this._smoke2.destroy();
					this._smoke2 = null;
					this._tryToCompleteAppearing();
				}}
			];
			let seqScale2 = [
				{tweens: [{prop: "scale.x", to: 2.81}, {prop: "scale.y", to: 2.81}],	duration: 34*FRAME_RATE}
			];
			let seqPos2 = [
				{tweens: [],															duration: 9*FRAME_RATE},
				{tweens: [{prop: "position.x", to: 960}, {prop: "position.y", to: 0}],	duration: 9*FRAME_RATE}
			];
			Sequence.start(this._smoke2, seqAlph2);
			Sequence.start(this._smoke2, seqScale2);
			Sequence.start(this._smoke2, seqPos2);
		}

		let lTimeToDragonAppear = TIMERS_TO_NEXT_ANIM[7];
		if (this._fAppearingAccelerateTime_num > 0)
		{
			lTimeToDragonAppear -= Math.min(this._fAppearingAccelerateTime_num, lTimeToDragonAppear);
			this._fAppearingAccelerateTime_num = 0;
		}

		if (lTimeToDragonAppear > 0)
		{
			this._fTimer_t && this._fTimer_t.destructor();
			this._fTimer_t = new Timer(()=>{
				this._startDragonAppearAnimation();
			}, lTimeToDragonAppear);
		}
		else
		{
			this._startDragonAppearAnimation();
		}
	}

	_generateSmoke(position, scale)
	{
		let smoke = this.addChild(APP.library.getSpriteFromAtlas("boss_mode/bm_boss_mode/smoke_fx"));
		smoke.blendMode = PIXI.BLEND_MODES.SCREEN;
		smoke.position.set(position.x, position.y);
		smoke.scale.set(scale.x, scale.y);
		smoke.alpha = 0;

		return smoke;
	}

	_startDragonAppearAnimation()
	{
		this._fTimer_t && this._fTimer_t.destructor();
		this._fTimer_t = null;

		this._fBossZombie_e.onBossAppearanceTime();
		this.emit(AppearanceView.EVENT_ON_TIME_TO_SCALE_MAP);
		this.emit(AppearanceView.EVENT_ON_DRAGON_APPEAR_TIME);

		this._tryToCompleteAppearing();
	}

	_onSmokeAnimationEnded()
	{
		this._smokeFx.destroy();
		this._smokeFx = null;

		this._tryToCompleteAppearing();
	}

	_onTopSmokeAnimationEnded()
	{
		this._topSmokeFx.destroy();
		this._topSmokeFx = null;

		this._tryToCompleteAppearing();
	}

	_tryToCompleteAppearing()
	{
		if (!this._smokeFx && !this._fTimer_t && !this._smoke1 && !this._smoke2 && !this._screenFiresAnimation && !this._topSmokeFx)
		{
			this._onAppearingCompleted();
		}
	}

	_onAppearingCompleted()
	{
		this.emit(AppearanceView.EVENT_APPEARING_PRESENTATION_COMPLETED);

		this._destroyAnimation();
	}

	_destroyAnimation()
	{
		this._fTimer_t && this._fTimer_t.destructor();
		this._fTimer_t = null;

		if (this._smokeFx)
		{
			this._smokeFx.off(SmokeFxView.EVENT_ON_ANIMATION_ENDED, this._onSmokeAnimationEnded, this, true);
			this._smokeFx.destroy();
		}

		if (this._topSmokeFx)
		{
			this._topSmokeFx.off(SmokeFxView.EVENT_ON_ANIMATION_ENDED, this._onSmokeAnimationEnded, this, true);
			this._topSmokeFx.destroy();
		}

		if (this._smoke1)
		{
			Sequence.destroy(Sequence.findByTarget(this._smoke1));
			this._smoke1.destroy();
		}

		if (this._smoke2)
		{
			Sequence.destroy(Sequence.findByTarget(this._smoke2));
			this._smoke2.destroy();
		}

		if (this._screenFiresAnimation)
		{
			this._screenFiresAnimation.off(ScreenFiresAnimation.EVENT_ON_SCREEN_FIRES_ANIMATION_ENDED, this._onScreenFiresAnimationEnded, this, true);
			this._screenFiresAnimation.destroy();
		}

		if (this._screenFiresFlashAnimation)
		{
			this._screenFiresFlashAnimation.off(BossAppearanceFlameAnimation.EVENT_ON_ANIMATION_ENDED, this._onFiresFlashAnimationEnded, this, true);
			this._screenFiresFlashAnimation.destroy();
		}

		this._fBossZombie_e = null;
		this._smokeFx = null;
		this._topSmokeFx = null;
		this._smoke1 = null;
		this._smoke2 = null;
		this._screenFiresAnimation = null;
		this._screenFiresFlashAnimation = null;
		this._fAppearingAccelerateTime_num = 0;
	}

	//SCREEN FIRE...
	_startScreenFiresAnimation(aDurationExTime = 0)
	{
		let lFireContainer = this._fContainersInfo.fireContainer;
		this._screenFiresAnimation = lFireContainer.addChild(new ScreenFiresAnimation());
		this._screenFiresAnimation.zIndex = this._fContainersInfo.flamesZIndex;

		let animTime = this._screenFiresAnimation.animTime;
		if (aDurationExTime > 0)
		{
			animTime -= aDurationExTime;
			this._screenFiresAnimation.animTime = animTime;
		}

		if (animTime > 0)
		{
			this._screenFiresAnimation.once(ScreenFiresAnimation.EVENT_ON_SCREEN_FIRES_ANIMATION_ENDED, this._onScreenFiresAnimationEnded, this);
			this._screenFiresAnimation.startAnimation();
		}
	}

	_onScreenFiresAnimationEnded()
	{
		if (this._screenFiresAnimation)
		{
			this._screenFiresAnimation.off(ScreenFiresAnimation.EVENT_ON_SCREEN_FIRES_ANIMATION_ENDED, this._onScreenFiresAnimationEnded, this, true);
			this._screenFiresAnimation.destroy();
			this._screenFiresAnimation = null;
		}

		this._tryToCompleteAppearing();
	}

	_startFiresFlashAnimation(aDurationExTime = 0)
	{
		let lFireContainer = this._fContainersInfo.fireContainer;
		this._screenFiresFlashAnimation = lFireContainer.addChild(new BossAppearanceFlameAnimation());
		this._screenFiresFlashAnimation.zIndex = this._fContainersInfo.flamesZIndex;

		this._screenFiresFlashAnimation.once(BossAppearanceFlameAnimation.EVENT_ON_ANIMATION_ENDED, this._onFiresFlashAnimationEnded, this);
		this._screenFiresFlashAnimation.startAnimation(aDurationExTime);
	}

	_onFiresFlashAnimationEnded()
	{
		if (this._screenFiresFlashAnimation)
		{
			this._screenFiresFlashAnimation.off(BossAppearanceFlameAnimation.EVENT_ON_ANIMATION_ENDED, this._onFiresFlashAnimationEnded, this, true);
			this._screenFiresFlashAnimation.destroy();
			this._screenFiresFlashAnimation = null;
		}

		this._tryToCompleteAppearing();
	}
	//...SCREEN FIRE

	destroy()
	{
		this._destroyAnimation();

		this._fContainersInfo = null;

		super.destroy();
	}
}

export default AppearanceView;