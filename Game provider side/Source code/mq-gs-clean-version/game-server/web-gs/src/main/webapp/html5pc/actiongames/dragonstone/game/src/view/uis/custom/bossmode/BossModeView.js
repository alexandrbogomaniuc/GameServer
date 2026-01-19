import SimpleUIView from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/SimpleUIView';
import BossModeDyingFxView from './death/BossModeDyingFxView';
import AppearanceView from './appearance/AppearanceView';
import BossModeCaptionView from './appearance/BossModeCaptionView';
import IdleView from './idle/IdleView';
import DisappearanceView from './disappearance/DisappearanceView';
import BossModeRedScreenAnimation from './BossModeRedScreenAnimation';
import { DRAGON_CAPTION_TYPES } from './appearance/BossModeCaptionView';
import Timer from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import BossModeWinAnimation from './death/BossModeWinAnimation';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';

const Z_INDEXES = {
	APPEAR: 0,
	IDLE: 1,
	DISAPPEAR: 2,
}

class BossModeView extends SimpleUIView {
	static get EVENT_APPEARING_PRESENTATION_STARTED() { return AppearanceView.EVENT_APPEARING_PRESENTATION_STARTED; }
	static get EVENT_APPEARING_PRESENTATION_COMPLETED() { return AppearanceView.EVENT_APPEARING_PRESENTATION_COMPLETED; }
	static get EVENT_ON_TIME_TO_SCALE_MAP() { return AppearanceView.EVENT_ON_TIME_TO_SCALE_MAP; }
	static get EVENT_ON_TIME_TO_BLUR_MAP() { return AppearanceView.EVENT_ON_TIME_TO_BLUR_MAP; }
	static get EVENT_ON_FADED_BACK_HIDE_REQUIRED() { return DisappearanceView.EVENT_ON_FADED_BACK_HIDE_REQUIRED; }
	static get EVENT_ON_GROUND_BURN_REQUIRED() { return DisappearanceView.EVENT_ON_GROUND_BURN_REQUIRED; }
	static get EVENT_DISAPPEARING_PRESENTATION_STARTED() { return "onDisappearingPresentationStarted"; }
	static get EVENT_DISAPPEARING_PRESENTATION_COMPLETED() { return "onDisappearingPresentationCompleted"; }
	static get EVENT_ON_CAPTION_ANIMATION_STARTED() { return "onCaptionAnimationStarted"; }
	static get EVENT_ON_IDLE_ANIMATION_STARTING() { return "onIdleAnimationStarting"; }
	static get EVENT_ON_IDLE_FADE_BACK_ANIMATION_COMPLETED() { return IdleView.EVENT_ON_IDLE_FADE_BACK_ANIMATION_COMPLETED; }
	static get EVENT_ON_FIRE_FLASH_ANIMATION_COMPLETED() { return DisappearanceView.EVENT_ON_FIRE_FLASH_ANIMATION_COMPLETED; }
	static get EVENT_ON_YOU_WIN_PRESENTATION_TIME() { return "EVENT_ON_YOU_WIN_PRESENTATION_TIME"; }
	static get EVENT_ON_BOSS_WIN_AWARD_COUNTED() { return BossModeWinAnimation.EVENT_ON_BOSS_WIN_AWARD_COUNTED; }
	static get EVENT_ON_BOSS_WIN_AWARD_PRESENTATION_COMPLETED() { return BossModeWinAnimation.EVENT_ON_BOSS_WIN_AWARD_PRESENTATION_COMPLETED; }
	static get EVENT_ON_COIN_LANDED() { return BossModeWinAnimation.EVENT_ON_COIN_LANDED; }
	static get EVENT_ON_BOSS_WIN_MULTIPLIER_LANDED() { return BossModeWinAnimation.EVENT_ON_BOSS_WIN_MULTIPLIER_LANDED; }
	static get EVENT_ON_WIN_PRESENTATION_INTERRUPTED() { return "EVENT_ON_WIN_PRESENTATION_INTERRUPTED"; }
	static get COIN_SPLASH_STARTED() { return "COIN_SPLASH_STARTED" }
	static get EVENT_ON_DEATH_DISAPPEARING_STARTED() { return "EVENT_ON_DEATH_DISAPPEARING_STARTED"; }
	static get EVENT_ON_END_SOUND() { return BossModeCaptionView.EVENT_ON_END_SOUND; }

	addToContainerIfRequired(aViewContainerInfo_obj) {
		this._addToContainerIfRequired(aViewContainerInfo_obj);
	}

	get isHourglassTimeOccurred() {
		return this._fIsHourglassTimeOccurred_bl;
	}

	get isDeathAnimationInProgress() {
		return !!this._fDyingView_bmdfv;
	}

	startAppearing(aZombieView_e, aAppearingAccelerateTime_num = 0) {
		this._startAppearing(aZombieView_e, aAppearingAccelerateTime_num);
	}

	startMapBlurAnimationOnLastHand(aZombieView_e) {
		this._startMapBlurAnimation(aZombieView_e);
	}

	startCaptionAnimationOnLastHand(aZombieView_e) {
		this._startCaptionAnimation(aZombieView_e);
	}

	startDragonFireAnimationOnLastHand(aZombieView_e) {
		this._startDragonFireAnimation(aZombieView_e);
	}

	startFireOnTopAnimationOnLastHand(aZombieView_e) {
		this._startFireOnTopAnimation(aZombieView_e);
	}

	startDragonShadowAnimationOnLastHand(aZombieView_e, aRestShadowTime = undefined) {
		this._startDragonShadowAnimation(aZombieView_e, aRestShadowTime);
	}

	startIdleAnimationOnLastHand(aZombieView_e) {
		this._startIdleAnimation(aZombieView_e);
	}

	startSecondSmokeOnLastHand(aZombieView_e) {
		this._fIsHourglassTimeOccurred_bl = true;

		this._startSecondSmoke(aZombieView_e);
	}

	startDragonAppearAnimationOnLastHand(aZombieView_e) {
		this._startDragonAppearAnimation(aZombieView_e);
	}

	startDisappearing(disappearExTime) {
		this._startDisappearing(disappearExTime);
	}

	startDying(aZombieView_e, aTargetSeatId_num) {
		this._startDying(aTargetSeatId_num);
		setTimeout(()=>{
			this._destroyAnimations(false);
		},12000);
	}

	startYouWinAnimation(aWinValue_num, aIsMasterWin_bl, aSeatId_int) {
		this._startYouWinAnimation(aWinValue_num, aIsMasterWin_bl, aSeatId_int);
	}

	interruptAnimation() {
		this._interruptWinAnimation();

		this._fAppearanceView_av && this._fAppearanceView_av.interruptAnimation();
		this._destroyAnimations();

		this._fTargetSeatId_num = undefined;
	}

	onTimeToExplodeCoins(aIsCoPlayerWin_bln) {
		this._onTimeToExplodeCoins(aIsCoPlayerWin_bln);
	}

	startIdle(skipIntro = false) {
		this._startIdle(skipIntro);
	}

	onStopIdleRequired() {
		this._onFadedBackHideRequired();
		this._onStopIdleRequired();
	}

	startRedScreenAnimation(aCurProgress_num) {
		this._startRedScreenAnimation(aCurProgress_num);
	}

	get isIdleInProgress() {
		return this._fIdleView_iv ? this._fIdleView_iv.isAnimating : false;
	}

	get isDisappearanceInProgress() {
		return this._fDisappearanceView_dv ? this._fDisappearanceView_dv.isAnimating : false;
	}

	get isWinPresentationInProgress() {
		return this._fWinAnimation_bmwa ? this._fWinAnimation_bmwa.isWinPresentationInProgress : false;
	}

	get isKeepPlayingCaptionInProgress() {
		return this._fCaptionView_bmcv && this._fCaptionView_bmcv.captionType == DRAGON_CAPTION_TYPES.KEEP_PLAYING;
	}

	forceCaptionDisappearing() {
		if (this._fCaptionView_bmcv) {
			this._fCaptionView_bmcv.forceDisappear();
		}
	}

	//INIT...
	constructor() {
		super();

		this._fViewContainerInfo_obj = null;
		this._fCaptionView_bmcv = null;
		this._fAppearanceView_av = null;
		this._fIdleView_iv = null;
		this._fDisappearanceView_dv = null;
		this._fIsHourglassTimeOccurred_bl = false;
		this._redScreen = null;
		this._fWinAnimation_bmwa = null;
		this._isBossSequenceInProgress = false;
		this._bossExtentionTime = 120;
	}
	//...INIT

	//APPEARING PRESENTATION...
	_startAppearing(aZombieView_e, aAppearingAccelerateTime_num = 0) {
		APP.criticalAnimationInProgress = true; 
		this._interruptWinAnimation();
		this._destroyAnimations(true);
		this._initAppearing();
		this._fAppearanceView_av.startAppearing(aZombieView_e, aAppearingAccelerateTime_num);
		setTimeout(()=>{
			APP.criticalAnimationInProgress = false; 
		},22000)
		
	}

	_startMapBlurAnimation(aZombieView_e) {
		this._initAppearing();
		this._fAppearanceView_av.startMapBlurAnimation(aZombieView_e);
	}

	_startCaptionAnimation(aZombieView_e) {
		this._initAppearing();
		this._fAppearanceView_av.startCaptionAnimation(aZombieView_e);
	}

	_startDragonFireAnimation(aZombieView_e) {
		this._initAppearing();
		this._fAppearanceView_av.startDragonFireAnimation(aZombieView_e);
	}

	_startFireOnTopAnimation(aZombieView_e) {
		this._initAppearing();
		this._fAppearanceView_av.startFireOnTopAnimation(aZombieView_e);
	}

	_startDragonShadowAnimation(aZombieView_e, aRestShadowTime = undefined) {
		this._initAppearing();
		this._fAppearanceView_av.startDragonShadowAnimation(aZombieView_e, aRestShadowTime);
	}

	_startIdleAnimation(aZombieView_e) {
		this._initAppearing();
		this._fAppearanceView_av.startIdleAnimation(aZombieView_e);
	}

	_startSecondSmoke(aZombieView_e) {
		this._initAppearing();
		this._fAppearanceView_av.startSecondSmoke(aZombieView_e);
	}

	_startDragonAppearAnimation(aZombieView_e) {
		this._initAppearing();
		this._fAppearanceView_av.startDragonAppearAnimation(aZombieView_e);
	}

	_initAppearing() {
		this._fAppearanceView_av && this._fAppearanceView_av.destroy();
		this._fAppearanceView_av = this.addChild(new AppearanceView(this._fViewContainerInfo_obj));
		this._fAppearanceView_av.zIndex = Z_INDEXES.APPEAR;

		this._fAppearanceView_av.on(AppearanceView.EVENT_APPEARING_PRESENTATION_STARTED, this.emit, this);
		this._fAppearanceView_av.on(AppearanceView.EVENT_APPEARING_PRESENTATION_COMPLETED, this._onAppearingCompleted, this);
		this._fAppearanceView_av.once(AppearanceView.EVENT_ON_TIME_TO_START_CAPTION_ANIMATION, this._onTimeToStartCaptionAnimation, this);
		this._fAppearanceView_av.once(AppearanceView.EVENT_ON_TIME_TO_SCALE_MAP, this.emit, this);
		this._fAppearanceView_av.once(AppearanceView.EVENT_ON_TIME_TO_START_BOSS_IDLE_ANIMATION, this._onTimeToStartIdleAnimation, this);
		this._fAppearanceView_av.once(AppearanceView.EVENT_ON_DRAGON_APPEAR_TIME, this._onDragonAppearTime, this);

		this._fIsHourglassTimeOccurred_bl = false;
	}

	_onAppearingCompleted() {
		this.emit(BossModeView.EVENT_APPEARING_PRESENTATION_COMPLETED);

		this._destroyAppearance();
	}
	//...APPEARING PRESENTATION

	//CAPTION...
	_onTimeToStartCaptionAnimation(event) {
		this._fCaptionView_bmcv && this._fCaptionView_bmcv.destroy();
		this._fCaptionView_bmcv = new BossModeCaptionView(event.bossCaptionType);

		let lViewContainer_sprt = this._fViewContainerInfo_obj.captionContainer;
		lViewContainer_sprt.addChild(this._fCaptionView_bmcv);

		this._fCaptionView_bmcv.once(BossModeCaptionView.EVENT_ON_ANIMATION_STARTED, this._onCaptionAnimationStarted, this);
		this._fCaptionView_bmcv.once(BossModeCaptionView.EVENT_ON_DISAPPEAR_STARTED, this._onCaptionDisappearStarted, this);
		this._fCaptionView_bmcv.once(BossModeCaptionView.EVENT_ON_ANIMATION_ENDED, this._onCaptionAnimationEnded, this);
		this._fCaptionView_bmcv.on(BossModeCaptionView.EVENT_ON_END_SOUND, this.emit, this)

		this._fCaptionView_bmcv.zIndex = this._fViewContainerInfo_obj.captionZIndex;
		this._fCaptionView_bmcv.position.set(this.position.x + APP.config.size.width / 2, this.position.y + APP.config.size.height / 2);
		this._fCaptionView_bmcv.playAnimation();
	}

	_onDragonAppearTime(event) {
		if (this._fCaptionView_bmcv) {
			this._fCaptionView_bmcv.forceDisappear();
		}
	}

	_onCaptionAnimationStarted() {
		this.emit(BossModeView.EVENT_ON_CAPTION_ANIMATION_STARTED);
	}

	_onCaptionDisappearStarted() {
		if (this._fCaptionView_bmcv.captionType == DRAGON_CAPTION_TYPES.DRAGON_DEFEATED) {
			this._onDoubleWinsCaptionTime();
		}
	}

	_onCaptionAnimationEnded() {
		if (this._fCaptionView_bmcv.captionType == DRAGON_CAPTION_TYPES.DRAGON_DEFEATED) {
			this._redScreen && this._redScreen.completeBossDieAnimation();

			if (!APP.isBattlegroundGame) {
				setTimeout(()=>{
					this._onTimeToStartYouWinAnimation();
				}, 3500);
			}
		}

		this._destroyCaption();
	}
	//...CAPTION

	//IDLE PRESENTATION...
	_onTimeToStartIdleAnimation() {
		this._startIdle(false);

		this.emit(BossModeView.EVENT_ON_IDLE_ANIMATION_STARTING);
	}

	_startIdle(skipIntro = false) {
		this._fIdleView_iv && this._fIdleView_iv.destroy();

		this._fIdleView_iv = this.addChild(new IdleView());
		this._fIdleView_iv.scale.set(1.026);
		this._fIdleView_iv.position.x -= 10;
		this._fIdleView_iv.position.y -= 10;
		this._fIdleView_iv.zIndex = Z_INDEXES.IDLE;
		this._fIdleView_iv.on(IdleView.EVENT_ON_IDLE_ANIMATION_FINISHED, this._onIdleCompleted, this);
		this._fIdleView_iv.on(IdleView.EVENT_ON_IDLE_FADE_BACK_ANIMATION_COMPLETED, this._onIdleFadeBackAnimationCompleted, this);

		this._fIdleView_iv.startIdle(skipIntro);

		this._fIsHourglassTimeOccurred_bl = true;
	}

	_onIdleCompleted() {
		this._destroyIdle();
	}

	_onIdleFadeBackAnimationCompleted() {
		this.emit(BossModeView.EVENT_ON_IDLE_FADE_BACK_ANIMATION_COMPLETED);
	}
	//...IDLE ANIMATION

	//DISAPPEARING PRESENTATION...
	_startDisappearing(disappearExTime) {
		this._fDisappearanceView_dv && this._fDisappearanceView_dv.destroy();
		this._fDisappearanceView_dv = this.addChild(new DisappearanceView());
		this._fDisappearanceView_dv.zIndex = Z_INDEXES.DISAPPEAR;
		this._fDisappearanceView_dv.on(DisappearanceView.EVENT_ON_FADED_BACK_HIDE_REQUIRED, this._onFadedBackHideRequired, this);
		this._fDisappearanceView_dv.on(DisappearanceView.EVENT_ON_STOP_IDLE_SMOKE_REQUIRED, this._onDisappearanceStopIdleRequired, this);
		this._fDisappearanceView_dv.on(DisappearanceView.EVENT_ON_GROUND_BURN_REQUIRED, this.emit, this);
		this._fDisappearanceView_dv.on(DisappearanceView.EVENT_ON_DISAPPEAR_COMPLETED, this._onDisappearingCompleted, this);
		this._fDisappearanceView_dv.on(DisappearanceView.EVENT_ON_FIRE_FLASH_ANIMATION_COMPLETED, this.emit, this);
		this._fDisappearanceView_dv.once(DisappearanceView.EVENT_ON_TIME_TO_START_CAPTION_ANIMATION, this._onTimeToStartCaptionAnimation, this);

		this._fDisappearanceView_dv.startDisappearing(disappearExTime);

		this.emit(BossModeView.EVENT_DISAPPEARING_PRESENTATION_STARTED);

		this._fIsHourglassTimeOccurred_bl = false;
	}

	_onFadedBackHideRequired() {
		if (this._fIdleView_iv) {
			this._fIdleView_iv.hideFadedBack();
		}

		this.emit(BossModeView.EVENT_ON_FADED_BACK_HIDE_REQUIRED);
	}

	_onDisappearanceStopIdleRequired() {
		if (!this._fDyingView_bmdfv) {
			this._onStopIdleRequired();
		}
	}

	_onStopIdleRequired() {
		if (this._fIdleView_iv) {
			this._fIdleView_iv.animateIdleEnding();
		}
	}

	_onDisappearingCompleted() {
		this.emit(BossModeView.EVENT_DISAPPEARING_PRESENTATION_COMPLETED);

		this._fIsHourglassTimeOccurred_bl = false;

		this._destroyDisappearance();

		if (!this._fAppearanceView_av && !this._fWinAnimation_bmwa && !this.isDeathAnimationInProgress) //possible to have _fWinAnimation_bmwa if boss enemy is already disappeared/destroyed till the moment when bullet reaches target position (so win presentation starts without Dragon death animation)
		{
			if (this._fCaptionView_bmcv) {
				this._fCaptionView_bmcv.once(BossModeCaptionView.EVENT_ON_ANIMATION_ENDED, this._onDisappearCaptionAnimationEnded, this);
			}
			else {
				this._destroyAnimations();
			}
		}
	}

	_onDisappearCaptionAnimationEnded(event) {
		if (!this._fDisappearanceView_dv && !this._fWinAnimation_bmwa) {
			this._destroyAnimations();
		}
	}
	//...DISAPPEARING PRESENTATION

	//DEATH ANIMATION...
	_onTimeToExplodeCoins(aIsCoPlayerWin_bln) {
		if (!this._fDyingView_bmdfv) {
			this._fDyingView_bmdfv = this._createBossModeDyingFxView();
		}

		this._fDyingView_bmdfv.startCoinsExplodeAnimation(aIsCoPlayerWin_bln);
		this._onTimeToStartCaptionAnimation({ bossCaptionType: DRAGON_CAPTION_TYPES.DRAGON_DEFEATED });

		if (this._redScreen) {
			this._redScreen.zIndex = this._topContainerInfo.dieRedScreenZIndex;
			this._redScreen.startBossDieAnimation();
		}
	}

	_startDying(aTargetSeatId_num) {
		this._isBossSequenceInProgress = true;
		this._bossExtentionTime = 13000;
		this._fTargetSeatId_num = aTargetSeatId_num;
		this._destroyDisappearance();
		this._bossDyingIncomplete = true;
		this._bossDyingStartTIme = Date.now(); 

		if (!this._fDyingView_bmdfv) {
			this._fDyingView_bmdfv = this._createBossModeDyingFxView();
			this._fDyingView_bmdfv.startScreenSmokeAnimation();
		}
	}

	_createBossModeDyingFxView() {
		let lDyingView_bmdfv = this._topContainerInfo.container.addChild(new BossModeDyingFxView());
		lDyingView_bmdfv.zIndex = this._topContainerInfo.zIndex;
		lDyingView_bmdfv.once(BossModeDyingFxView.EVENT_ANIMATION_COMPLETED, this._onDyingAnimationCompleted, this);
		lDyingView_bmdfv.once(BossModeDyingFxView.EVENT_ON_STOP_IDLE_RQUIRED, this._onDyingStopIdleRequired, this);
		lDyingView_bmdfv.once(BossModeDyingFxView.EVENT_ON_TIME_TO_START_CAPTION_ANIMATION, this._onTimeToStartCaptionAnimation, this);

		lDyingView_bmdfv.position.set(APP.config.size.width / 2, APP.config.size.height / 2);

		return lDyingView_bmdfv;
	}

	_onDyingOutroAnimationTime() {
		this._fDyingView_bmdfv && this._fDyingView_bmdfv.startOutroAnimation();

		this._onDyingStopIdleRequired();

		this.emit(BossModeView.EVENT_ON_DEATH_DISAPPEARING_STARTED);
	}

	_onDyingStopIdleRequired() {
		this._onFadedBackHideRequired();
		this._onStopIdleRequired();
	}

	_onDyingAnimationCompleted() {
		this.emit(BossModeView.EVENT_DISAPPEARING_PRESENTATION_COMPLETED);
		this._destroyDying();

		if (this._fCaptionView_bmcv) {
			this._fCaptionView_bmcv.once(BossModeCaptionView.EVENT_ON_ANIMATION_ENDED, this._onDyingCaptionAnimationEnded, this);
		}
		else {
			this._destroyAnimations();
		}
	}

	_onDyingCaptionAnimationEnded(event) {
		this._destroyAnimations();
	}
	//...DEATH ANIMATION

	get _topContainerInfo() {
		return this._fTopContainer ? this._fTopContainer : { container: this, zIndex: 1, dieRedScreenZIndex: 2 };
	}

	setTopContainer(aViewContainerInfo_obj) {
		this._fTopContainer = aViewContainerInfo_obj;
	}

	_addToContainerIfRequired(aViewContainerInfo_obj) {
		if (this.parent) {
			let lViewZIndex_num = aViewContainerInfo_obj.zIndex;
			this.zIndex = lViewZIndex_num;
			this._fViewContainerInfo_obj = aViewContainerInfo_obj;

			return;
		}

		this._fViewContainerInfo_obj = aViewContainerInfo_obj;

		let lViewContainer_sprt = aViewContainerInfo_obj.container;
		let lViewZIndex_num = aViewContainerInfo_obj.zIndex;

		lViewContainer_sprt.addChild(this);

		this.position.set(-lViewContainer_sprt.position.x, -lViewContainer_sprt.position.y);
		this.zIndex = lViewZIndex_num;
	}

	_destroyCaption() {
		if (this._fCaptionView_bmcv) {
			this._fCaptionView_bmcv.off(BossModeCaptionView.EVENT_ON_ANIMATION_STARTED, this._onCaptionAnimationStarted, this, true);
			this._fCaptionView_bmcv.off(BossModeCaptionView.EVENT_ON_DISAPPEAR_STARTED, this._onCaptionDisappearStarted, this, true);
			this._fCaptionView_bmcv.off(BossModeCaptionView.EVENT_ON_ANIMATION_ENDED, this._onCaptionAnimationEnded, this, true);
			this._fCaptionView_bmcv.off(BossModeCaptionView.EVENT_ON_ANIMATION_ENDED, this._onDisappearCaptionAnimationEnded, this, true);
			this._fCaptionView_bmcv.off(BossModeCaptionView.EVENT_ON_ANIMATION_ENDED, this._onDyingCaptionAnimationEnded, this, true);
			this._fCaptionView_bmcv.destroy();
		}

		this._fCaptionView_bmcv = null;
	}


	get isBossSequenceInProgress()
	{
		return this._isBossSequenceInProgress;
	}

	get bossExtentionTime()
	{
		return this._bossExtentionTime;
	}

	_destroyAppearance() {
		if (this._fAppearanceView_av) {
			this._fAppearanceView_av.off(AppearanceView.EVENT_APPEARING_PRESENTATION_STARTED, this.emit, this);
			this._fAppearanceView_av.off(AppearanceView.EVENT_APPEARING_PRESENTATION_COMPLETED, this._onAppearingCompleted, this);
			this._fAppearanceView_av.off(AppearanceView.EVENT_ON_TIME_TO_START_CAPTION_ANIMATION, this._onTimeToStartCaptionAnimation, this);
			this._fAppearanceView_av.off(AppearanceView.EVENT_ON_TIME_TO_SCALE_MAP, this.emit, this);
			this._fAppearanceView_av.off(AppearanceView.EVENT_ON_TIME_TO_START_BOSS_IDLE_ANIMATION, this._onTimeToStartIdleAnimation, this);
			this._fAppearanceView_av.off(AppearanceView.EVENT_ON_DRAGON_APPEAR_TIME, this._onDragonAppearTime, this, true);

			this._fAppearanceView_av.destroy();
		}

		this._fAppearanceView_av = null;

		this._fIsHourglassTimeOccurred_bl = false;
	}

	_destroyDisappearance() {
		if (this._fDisappearanceView_dv) {
			this._fDisappearanceView_dv.off(DisappearanceView.EVENT_ON_FADED_BACK_HIDE_REQUIRED, this._onFadedBackHideRequired, this);
			this._fDisappearanceView_dv.off(DisappearanceView.EVENT_ON_STOP_IDLE_SMOKE_REQUIRED, this._onDisappearanceStopIdleRequired, this);
			this._fDisappearanceView_dv.off(DisappearanceView.EVENT_ON_DISAPPEAR_COMPLETED, this._onDisappearingCompleted, this);
			this._fDisappearanceView_dv.off(DisappearanceView.EVENT_ON_GROUND_BURN_REQUIRED, this.emit, this);
			this._fDisappearanceView_dv.off(DisappearanceView.EVENT_ON_DISAPPEAR_COMPLETED, this.emit, this);
			this._fDisappearanceView_dv.off(DisappearanceView.EVENT_ON_FIRE_FLASH_ANIMATION_COMPLETED, this.emit, this);
			this._fDisappearanceView_dv.off(DisappearanceView.EVENT_ON_TIME_TO_START_CAPTION_ANIMATION, this._onTimeToStartCaptionAnimation, this, true);
			this._fDisappearanceView_dv.destroy();
		}

		this._fDisappearanceView_dv = null;
		this._fIsHourglassTimeOccurred_bl = false;
	}

	_destroyIdle() {
		if (this._fIdleView_iv) {
			this._fIdleView_iv.off(IdleView.EVENT_ON_IDLE_ANIMATION_FINISHED, this._onIdleCompleted, this);
			this._fIdleView_iv.off(IdleView.EVENT_ON_IDLE_FADE_BACK_ANIMATION_COMPLETED, this._onIdleFadeBackAnimationCompleted, this);
			this._fIdleView_iv.destroy();
		}

		this._fIdleView_iv = null;
	}

	_destroyDying() {
		if (this._fDyingView_bmdfv) {
			this._fDyingView_bmdfv.off(BossModeDyingFxView.EVENT_ANIMATION_COMPLETED, this._onDyingAnimationCompleted, this, true);
			this._fDyingView_bmdfv.off(BossModeDyingFxView.EVENT_ON_STOP_IDLE_RQUIRED, this._onDyingStopIdleRequired, this, true);
			this._fDyingView_bmdfv.off(BossModeDyingFxView.EVENT_ON_TIME_TO_START_CAPTION_ANIMATION, this._onTimeToStartCaptionAnimation, this, true);
			this._fDyingView_bmdfv.destroy();
		}

		this._fDyingView_bmdfv = null;
	}

	_destroyAnimations(aKeepOnScreen_bl = false) {
		this._destroyCaption();
		this._destroyDoubleWinsCaption();
		this._destroyAppearance();
		this._destroyDisappearance();
		this._destroyIdle();
		this._destroyDying();
		this._destroyWinAnimation();

		this._redScreen && this._redScreen.destroy();
		this._redScreen = null;

		if (!aKeepOnScreen_bl) {
			this.parent && this.parent.removeChild(this);
		}

		setTimeout(()=>{
			this._isBossSequenceInProgress = false;
			this._bossExtentionTime = 0;
		},1000);
	}

	_startRedScreenAnimation(aCurSpeedProgress_num = 0) {
		if (this._redScreen) {
			this._redScreen.updateAnimation(aCurSpeedProgress_num);
			return;
		}

		this._redScreen = this._fViewContainerInfo_obj.redScreeContainer.addChild(new BossModeRedScreenAnimation());
		this._redScreen.zIndex = this._fViewContainerInfo_obj.redScreenZIndex;
		this._redScreen.startAnimation(aCurSpeedProgress_num);
	}

	//YOU WIN...
	_onTimeToStartYouWinAnimation() {
		this._bossExtentionTime = 6000;
		this.emit(BossModeView.EVENT_ON_YOU_WIN_PRESENTATION_TIME);
	}

	_startYouWinAnimation(aWinValue_num, aIsMasterWin_bl, aSeatId_int) {
		let lYouWinAnim = this._fWinAnimation_bmwa = this._topContainerInfo.container.addChild(new BossModeWinAnimation(aWinValue_num, aIsMasterWin_bl, aSeatId_int));
		lYouWinAnim.position.set(APP.config.size.width / 2, APP.config.size.height / 2);
		lYouWinAnim.zIndex = this._topContainerInfo.youWinZIndex;

		lYouWinAnim.once(BossModeWinAnimation.EVENT_ON_BOSS_WIN_AWARD_COUNTED, this.emit, this);
		lYouWinAnim.on(BossModeWinAnimation.EVENT_ON_COIN_LANDED, this.emit, this);
		lYouWinAnim.on(BossModeWinAnimation.EVENT_ON_BOSS_WIN_PAYOUT_APPEARED, this._onWinPayoutAppeared, this);
		lYouWinAnim.once(BossModeWinAnimation.EVENT_ON_BOSS_WIN_MULTIPLIER_LANDED, this.emit, this);
		lYouWinAnim.once(BossModeWinAnimation.EVENT_ON_BOSS_WIN_AWARD_PRESENTATION_COMPLETED, this.emit, this);
		this.emit(BossModeView.COIN_SPLASH_STARTED, { isMasterWin: aIsMasterWin_bl });
		lYouWinAnim.startWinAnimation();
	}

	_onWinPayoutAppeared() {
		this._onDyingOutroAnimationTime();
	}

	_interruptWinAnimation() {
		let lWinAnimation_bmwa = this._fWinAnimation_bmwa;
		if (lWinAnimation_bmwa) {
			let lUncountedWin = lWinAnimation_bmwa.uncountedWin;
			let lNotLandedWin = lWinAnimation_bmwa.notLandedWin;

			if (lWinAnimation_bmwa.isMasterWin && (lUncountedWin > 0 || lNotLandedWin > 0)) {
				this.emit(BossModeView.EVENT_ON_WIN_PRESENTATION_INTERRUPTED, { uncountedWin: lUncountedWin, notLandedWin: lNotLandedWin });
			}

			lWinAnimation_bmwa.destroy();
		}

		this._fWinAnimation_bmwa = null;
	}

	_destroyWinAnimation() {
		let lWinAnimation_bmwa = this._fWinAnimation_bmwa;
		if (lWinAnimation_bmwa) {
			lWinAnimation_bmwa.destroy();
		}

		this._fWinAnimation_bmwa = null;
	}
	//...YOU WIN

	//DOUBLE WINS CAPTION...
	_onDoubleWinsCaptionTime() {
		let lPlayerNick_str = "undefined player";
		if (this._fTargetSeatId_num !== undefined) {
			let lSeat_ps = APP.gameScreen.gameField.getSeat(this._fTargetSeatId_num, true);

			if (lSeat_ps) {
				lPlayerNick_str = lSeat_ps.nickname;
			}
			else {
				APP.logger.i_pushError(`BossModeView. No player with seatId: ${this._fTargetSeatId_num}!`);
			}
		}

		let l_bmcv = this._fDoubleWinsCaptionView_bmcv = new BossModeCaptionView(DRAGON_CAPTION_TYPES.WINS_DOUBLED, lPlayerNick_str);
		l_bmcv.scale.set(1.2);
		l_bmcv.y = 80;

		let lViewContainer_sprt = this._fViewContainerInfo_obj.captionContainer;
		lViewContainer_sprt.addChild(l_bmcv);

		l_bmcv.once(BossModeCaptionView.EVENT_ON_ANIMATION_STARTED, this._onCaptionAnimationStarted, this);
		l_bmcv.once(BossModeCaptionView.EVENT_ON_DISAPPEAR_STARTED, this._onDoubleWinsCaptionDisappearStarted, this);
		l_bmcv.once(BossModeCaptionView.EVENT_ON_ANIMATION_ENDED, this._onDoubleWinsCaptionAnimationEnded, this);
		l_bmcv.on(BossModeCaptionView.EVENT_ON_END_SOUND, this.emit, this)

		l_bmcv.zIndex = this._fViewContainerInfo_obj.captionZIndex;
		l_bmcv.position.set(this.position.x + APP.config.size.width / 2, this.position.y + APP.config.size.height / 2);
		l_bmcv.playAnimation();
	}

	_onDoubleWinsCaptionDisappearStarted() {
		this._onTimeToStartYouWinAnimation();
	}

	set targetSeatId(aVal_num) //need to get correct nickname, when this._fTargetSeatId_num === undefined
	{
		this._fTargetSeatId_num = aVal_num;
	}

	get targetSeatId() {
		return this._fTargetSeatId_num;
	}

	_onDoubleWinsCaptionAnimationEnded() {
		this._destroyDoubleWinsCaption();
	}

	_destroyDoubleWinsCaption() {
		let l_bmcv = this._fDoubleWinsCaptionView_bmcv;
		if (l_bmcv) {
			l_bmcv.off(BossModeCaptionView.EVENT_ON_ANIMATION_STARTED, this._onCaptionAnimationStarted, this, true);
			l_bmcv.off(BossModeCaptionView.EVENT_ON_DISAPPEAR_STARTED, this._onDoubleWinsCaptionDisappearStarted, this, true);
			l_bmcv.off(BossModeCaptionView.EVENT_ON_ANIMATION_ENDED, this._onDoubleWinsCaptionAnimationEnded, this, true);
			l_bmcv.off(BossModeCaptionView.EVENT_ON_END_SOUND, this.emit, this);
			l_bmcv.destroy();
		}

		this._fDoubleWinsCaptionView_bmcv = null;
	}
	//...DOUBLE WINS CAPTION

	destroy() {
		this._fWinAnimation_bmwa && this._fWinAnimation_bmwa.destroy();
		this._fWinAnimation_bmwa = null;

		this._destroyAnimations();

		super.destroy();

		this._fViewContainerInfo_obj = null;
		this._fTargetSeatId_num = undefined;
	}
}

export default BossModeView;