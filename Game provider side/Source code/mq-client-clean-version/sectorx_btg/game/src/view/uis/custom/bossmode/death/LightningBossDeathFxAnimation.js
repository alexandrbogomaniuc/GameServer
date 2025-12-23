import Sprite from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import Sequence from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import Timer from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE} from '../../../../../../../shared/src/CommonConstants';
import { Utils } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import * as Easing from '../../../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';

import BossDeathFxAnimation from './BossDeathFxAnimation';
import LightningBossCircleBlastAnimation from '../appearance/animation/LightningBossCircleBlastAnimation';
import LightningBossLightningMommiesAnimation from '../appearance/animation/LightningBossLightningMommiesAnimation';
import LightningBossMiniExplosionAnimation from './animation/LightningBossMiniExplosionAnimation';
import LightningBossExplosionAnimation from './animation/LightningBossExplosionAnimation';
import LightningBossOpticalFlareYellowAnimation from '../appearance/animation/LightningBossOpticalFlareYellowAnimation';
import LightningBossSmokeMainAnimation from '../appearance/animation/LightningBossSmokeMainAnimation';
import LightningBossGodDefeatedAnimation from './animation/LightningBossGodDefeatedAnimation';

	const LIGHTNING_MOMMIES_TIMER_PARAM = [
		{delay: 0, x: 22, y: -308},
		{delay: 21, x: -249.3, y: -537.4},
		{delay: 28, x: 654.3, y: -195.3},
		{delay: 36, x: -473.4, y: -153.3},
		{delay: 46, x: 240.7, y: -375.2},
		{delay: 57, x: 517.1, y: -459.5},
		{delay: 60, x: -379.9, y: -639.8},
		{delay: 67, x: -379.9, y: -639.8},
		{delay: 71, x: 244.3, y: -435}
	];

	const MINI_EXPLOSION_TIMER_PARAM = [
		{delay: 0, x: -78, y: -174, scale: 1},
		{delay: 7, x: 200, y: -30, scale: 1},
		{delay: 20, x: 66, y: -86, scale: 1},
		{delay: 29, x: 254, y: -194, scale: 1},
		{delay: 35, x: 248, y: 74, scale: 1},
		{delay: 41, x: 48, y: -134, scale: 1},
		{delay: 51, x: -166, y: 172, scale: 1},
		{delay: 53, x: 210, y: 64, scale: 1.24},
		{delay: 58, x: -208, y: -210, scale: 1},
		{delay: 64, x: 302, y: -40, scale: 1},
		{delay: 67, x: 10, y: 18, scale: 1.38},
		{delay: 76, x: -360, y: -110, scale: 1},
		{delay: 82, x: 376, y: 158, scale: 1},
		{delay: 84, x: 258, y: -286, scale: 0.78},
		{delay: 88, x: -286, y: 228, scale: 0.78},
	];

class LightningBossDeathFxAnimation extends BossDeathFxAnimation
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

		this._fDarkContainer_spr = this.bossDissappearingBottomFXContainerInfo.container.addChild(new Sprite());
		this._fDarkContainer_spr.zIndex = this.bossDissappearingBottomFXContainerInfo.zIndex;
		
		this._fCircleBlastContainer_spr = this.bossDissappearingBottomFXContainerInfo.container.addChild(new Sprite());
		this._fCircleBlastContainer_spr.zIndex = this.bossDissappearingBottomFXContainerInfo.zIndex;

		this._fBossDefeatedContainer_spr = this.bossDissappearingBottomFXContainerInfo.container.addChild(new Sprite());
		this._fBossDefeatedContainer_spr.zIndex = this.bossDissappearingBottomFXContainerInfo.zIndex;

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._fSmokeMainContainer_spr = this.addChild(new Sprite());
			this._fMommiesContainer_spr = this.addChild(new Sprite());
		}

		this._fMiniExplosionContainer_spr = this.addChild(new Sprite());
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._fLight51Container_spr = this.addChild(new Sprite());
			this._fExplosionContainer_spr = this.addChild(new Sprite());
			this._fLight52Container_spr = this.addChild(new Sprite());
			this._fLight2Container_spr = this.addChild(new Sprite());
			this._fLightCircle1Container_spr = this.addChild(new Sprite());
			this._fLightCircle2Container_spr = this.addChild(new Sprite());
			this._fMiniExplosionSingleContainer_spr = this.addChild(new Sprite());
			this._fOpticalFlareContainer_spr = this.addChild(new Sprite());
		}

		this._fLightningBossCircleBlastAnimation_lbcba = null;
		this._fDark_spr = null; 
		this._fLightningBossSmokeMainAnimation_lbsma = null;

		this._fStartMommiesTimer_tmr_arr = [];
		this._fLightningBossLightningMommiesAnimation_lblma_arr = [];

		this._fStartMiniExplosionTimer_tmr_arr = [];
		this._fLightningBossMiniExplosionAnimation_lbmea_arr = [];

		this._fIsNeedLight51ContainerWiggle_bl = null;
		this._fLight51_spr = null; 
		this._fStartExplosion_tmr = null;
		this._fLightningBossExplosionAnimation_lbea = null;
		this._fLight52_spr = null;
		this._fLight2_spr = null;
		this._fLightCircle1_spr = null;
		this._fLightCircle2_spr = null;

		this._fStartMiniExplosionSingleTimer_tmr = null;
		this._fLightningBossMiniExplosionSingleAnimation_lbmesa = null;

		this._fLightningBossOpticalFlareYellowAnimation_lbofya = null;

		this._fStartAnimationExplodeCoinTimer_tmr = null;
	}

	get _defeatedCaptionTime()
	{
		return 113 * FRAME_RATE;
	}

	_startAnimation(aZombieView_e)
	{
		super._startAnimation(aZombieView_e);

		let offsetPosition = this.globalToLocal(this._fCircleBlastContainer_spr.getGlobalPosition().x, this._fCircleBlastContainer_spr.getGlobalPosition().y);
		this._fCircleBlastContainer_spr.x = -offsetPosition.x - 40;
		this._fCircleBlastContainer_spr.y = -offsetPosition.y - 40;

		offsetPosition = this.globalToLocal(this._fBossDefeatedContainer_spr.getGlobalPosition().x, this._fBossDefeatedContainer_spr.getGlobalPosition().y);
		this._fBossDefeatedContainer_spr.x = -offsetPosition.x - 40;
		this._fBossDefeatedContainer_spr.y = -offsetPosition.y + 40;

		this._fAnimationCount_num = 0;

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startCircleBlastAnimation();
			this._startGodDefeatedAnimation();
			this._startDarkAnimation();
			this._startSmokeMainAnimation();
			this._startLightningMommiesAnimation();
		}

		this._startMiniExplosionAnimation();

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startLight51Animation();
			this._startExplosionAnimation();
			this._startLight52Animation();
			this._startLight2Animation();
			this._startLightCircle1Animation();
			this._startLightCircle2Animation();
			this._startMiniExplosionSingleAnimation();
			this._startOpticalFlareYellowAnimation();
		}

		this._startExplodeCoinTimer();
	}

	_startCircleBlastAnimation()
	{
		this._fLightningBossCircleBlastAnimation_lbcba = this._fCircleBlastContainer_spr.addChild(new LightningBossCircleBlastAnimation());
		this._fLightningBossCircleBlastAnimation_lbcba.once(LightningBossCircleBlastAnimation.EVENT_ON_ANIMATION_ENDED, this._onCircleBlastAnimationCompleted, this);
		this._fAnimationCount_num++;
		this._fLightningBossCircleBlastAnimation_lbcba.i_startDisappearanceAnimation();
	}

	_onCircleBlastAnimationCompleted()
	{
		this._fAnimationCount_num--;
		this._animationCompletedSuspicison();
	}

	_startGodDefeatedAnimation()
	{
		this._fLightningBossGodDefeatedAnimation_lbgda = this._fBossDefeatedContainer_spr.addChild(new LightningBossGodDefeatedAnimation());
		this._fLightningBossGodDefeatedAnimation_lbgda.once(LightningBossGodDefeatedAnimation.EVENT_ON_ANIMATION_ENDED, this._onGodDefeatedAnimationCompleted, this);
		this._fAnimationCount_num++;
		this._fLightningBossGodDefeatedAnimation_lbgda.i_startAnimation();
	}

	_onGodDefeatedAnimationCompleted()
	{
		this._fAnimationCount_num--;
		this._animationCompletedSuspicison();
	}

	_startDarkAnimation()
	{
		let lDark_spr = this._fDark_spr = this._fDarkContainer_spr.addChild(new PIXI.Graphics());
		lDark_spr.alpha = 0;
		lDark_spr.beginFill(0x000000).drawRect(-960, -540, 1920, 1080).endFill();

		let l_seq = [
			{tweens: [], duration: 25 * FRAME_RATE},
			{tweens: [ {prop: 'alpha', to: 0.4}], duration: 50 * FRAME_RATE},
			{tweens: [], duration: 28 * FRAME_RATE},
			{tweens: [ {prop: 'alpha', to: 0.02}], duration: 19 * FRAME_RATE},
			{tweens: [], duration: 77 * FRAME_RATE,
				onfinish: ()=>{
					this._fAnimationCount_num--;
					lDark_spr && lDark_spr.destroy();
					this._animationCompletedSuspicison();
			}}
		];

		this._fAnimationCount_num++;
		Sequence.start(lDark_spr, l_seq);
	}

	_startSmokeMainAnimation()
	{
		this._fLightningBossSmokeMainAnimation_lbsma = this._fSmokeMainContainer_spr.addChild(new LightningBossSmokeMainAnimation());
		this._fLightningBossSmokeMainAnimation_lbsma.alpha = 0;
		this._fLightningBossSmokeMainAnimation_lbsma.i_startDisappearingAnimation();

		let l_seq = [
			{tweens: [], duration: 52 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}], duration: 36 * FRAME_RATE},
			{tweens: [], duration: 15 * FRAME_RATE,
				onfinish: ()=>{
					this._fAnimationCount_num--; 
					this._fLightningBossSmokeMainAnimation_lbsma && this._fLightningBossSmokeMainAnimation_lbsma.destroy();
					this._animationCompletedSuspicison();
			}}
		]

		this._fAnimationCount_num++;
		Sequence.start(this._fLightningBossSmokeMainAnimation_lbsma, l_seq);
	}

	_startLightningMommiesAnimation()
	{		
		for (let i = 0; i < LIGHTNING_MOMMIES_TIMER_PARAM.length; i++)
		{
			this._fAnimationCount_num++;
			let param = LIGHTNING_MOMMIES_TIMER_PARAM[i];

			let lTimer = this._fStartMommiesTimer_tmr_arr[i] = new Timer(()=>{
				lTimer && lTimer.destructor();
	
				this._fLightningBossLightningMommiesAnimation_lblma_arr[i] = this._fMommiesContainer_spr.addChild(new LightningBossLightningMommiesAnimation());
				this._fLightningBossLightningMommiesAnimation_lblma_arr[i].once(LightningBossLightningMommiesAnimation.EVENT_ON_ANIMATION_ENDED, this._onLightningMommiesAnimationCompleted, this);
				this._fLightningBossLightningMommiesAnimation_lblma_arr[i].position.set(param.x / 2 - 160, param.y / 2 - 140);
				this._fLightningBossLightningMommiesAnimation_lblma_arr[i].i_startAnimation();	
			
			}, param.delay * FRAME_RATE, true);	
		}
	}

	_onLightningMommiesAnimationCompleted()
	{
		this._fAnimationCount_num--;
		this._animationCompletedSuspicison();
	}

	_startMiniExplosionAnimation()
	{
		for (let i = 0; i < MINI_EXPLOSION_TIMER_PARAM.length; i++)
		{
			this._fAnimationCount_num++;
			let param = MINI_EXPLOSION_TIMER_PARAM[i];

			let lTimer = this._fStartMiniExplosionTimer_tmr_arr[i] = new Timer(()=>{
				lTimer && lTimer.destructor();
	
				this._fLightningBossMiniExplosionAnimation_lbmea_arr[i] = this._fMiniExplosionContainer_spr.addChild(new LightningBossMiniExplosionAnimation());
				this._fLightningBossMiniExplosionAnimation_lbmea_arr[i].position.set(param.x / 2, param.y / 2);
				this._fLightningBossMiniExplosionAnimation_lbmea_arr[i].scale.set(param.scale, param.scale);
				this._fLightningBossMiniExplosionAnimation_lbmea_arr[i].once(LightningBossMiniExplosionAnimation.EVENT_ON_ANIMATION_ENDED, this._onMiniExplosionAnimtaionCompleted, this);
				this._fLightningBossMiniExplosionAnimation_lbmea_arr[i].i_startAnimation();	
			
			}, param.delay * FRAME_RATE, true);	
		}
	}

	_onMiniExplosionAnimtaionCompleted()
	{
		this._fAnimationCount_num--;
		this._animationCompletedSuspicison();
	}

	_startLight51Animation()
	{
		let lLight51_spr = this._fLight51_spr = this._fLight51Container_spr.addChild(APP.library.getSprite('common/misty_flare'));
		lLight51_spr.position.set(-15.95, 5.65);
		lLight51_spr.alpha = 0;
		lLight51_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lLight51_spr.scale.set(1.629, 1.629);
		lLight51_spr.rotation = 4.34586983746588; //Utils.gradToRad(249);

		this._fLight51Container_spr.alpha = 0;


		let l_seq = [
			{tweens: [], duration: 47 * FRAME_RATE},
			{tweens: [{prop: 'rotation', to:  5.218534463463045}, {prop: 'alpha', to: 0.8}], duration: 50 * FRAME_RATE, //Utils.gradToRad(299)
				onfinish: ()=>{
					this._fIsNeedLight51ContainerWiggle_bl = false;
					this._fAnimationCount_num--; 
					lLight51_spr && lLight51_spr.destroy();
					this._animationCompletedSuspicison();
			}}
		]

		this._fAnimationCount_num++;
		Sequence.start(lLight51_spr, l_seq);

		this._fIsNeedLight51ContainerWiggle_bl = true;
		this._fAnimationCount_num++;
		this._startLight51Wiggle();
	}

	_startLight51Wiggle()
	{
		let l_seq = [
			{tweens: [{prop: 'alpha', to: Utils.getRandomWiggledValue(0.85, 0.15)}], duration: 2 * FRAME_RATE,
				onfinish: ()=>{
					if (this._fIsNeedLight51ContainerWiggle_bl)
					{
						this._startLight51Wiggle();
					}
					else
					{
						this._fAnimationCount_num--;
						this._animationCompletedSuspicison();
					}
			}}
		]

		Sequence.start(this._fLight51Container_spr, l_seq);
	}

	_startExplosionAnimation()
	{
		this._fAnimationCount_num++;
		let lTimer = this._fStartExplosion_tmr = new Timer(()=>{
				lTimer && lTimer.destructor();
				this._fLightningBossExplosionAnimation_lbea = this._fExplosionContainer_spr.addChild(new LightningBossExplosionAnimation());
				this._fLightningBossExplosionAnimation_lbea.once(LightningBossExplosionAnimation.EVENT_ON_ANIMATION_ENDED, this._onExplosionAnimationCompleted, this);
				this._fLightningBossExplosionAnimation_lbea.i_startAnimation();
		}, 89 * FRAME_RATE, true);
	}

	_onExplosionAnimationCompleted()
	{
		this._fAnimationCount_num--;
		this._animationCompletedSuspicison();
	}

	_startLight52Animation()
	{
		let lLight52_spr = this._fLight52_spr = this._fLight52Container_spr.addChild(APP.library.getSprite('common/misty_flare'));
		lLight52_spr.position.set(-20.4, -56.45);
		lLight52_spr.alpha = 0;
		lLight52_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lLight52_spr.scale.set(0.19, 0.19);

		let l_seq = [
			{tweens: [], duration: 91 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0.6}], duration: 0 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 8.492}, {prop: 'scale.y', to: 8.492}], duration: 2 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 8.042}, {prop: 'scale.y', to: 8.042}], duration: 10 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 0.187}, {prop: 'scale.y', to: 0.187}, {prop: 'alpha', to: 0}], duration: 46 * FRAME_RATE,
				onfinish: ()=>{
					this._fAnimationCount_num--; 
					lLight52_spr && lLight52_spr.destroy();
					this._animationCompletedSuspicison();
			}}
		]

		this._fAnimationCount_num++;
		Sequence.start(lLight52_spr, l_seq);
	}

	_startLight2Animation()
	{
		let lLight2_spr = this._fLight2_spr = this._fLight2Container_spr.addChild(APP.library.getSprite('boss_mode/common/fx_light_2'));
		lLight2_spr.position.set(-269.8, -17.55);
		lLight2_spr.alpha = 0;
		lLight2_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lLight2_spr.scale.set(4.72, 4.72);

		let l_seq = [
			{tweens: [], duration: 92 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0.49}], ease: Easing.quadratic.easeOut, duration: 2 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0}], ease: Easing.quadratic.easeIn, duration: 19 * FRAME_RATE,	
				onfinish: ()=>{
					this._fAnimationCount_num--; 
					lLight2_spr && lLight2_spr.destroy();
					this._animationCompletedSuspicison();
			}}
		]

		this._fAnimationCount_num++;
		Sequence.start(lLight2_spr, l_seq);
	}

	_startLightCircle1Animation()
	{
		let lLightCircle1_spr = this._fLightCircle1_spr = this._fLightCircle1Container_spr.addChild(APP.library.getSprite('boss_mode/common/light_circle_1'));
		lLightCircle1_spr.position.set(-26.15, -35.85);
		lLightCircle1_spr.alpha = 0;
		lLightCircle1_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lLightCircle1_spr.scale.set(0.84, 0.84); //0.42*2, 0.42*2

		let l_seq = [
			{tweens: [], duration: 91 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0.6}], duration: 0 * FRAME_RATE},
			{tweens: [], duration: 1 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 1.42}, {prop: 'scale.y', to: 1.42}], duration: 1 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 5.835}, {prop: 'scale.y', to: 5.835}, {prop: 'alpha', to: 0}], duration: 5 * FRAME_RATE,
				onfinish: ()=>{
					this._fAnimationCount_num--; 
					lLightCircle1_spr && lLightCircle1_spr.destroy();
					this._animationCompletedSuspicison();
			}}
		]

		this._fAnimationCount_num++;
		Sequence.start(lLightCircle1_spr, l_seq);
	}

	_startLightCircle2Animation()
	{
		let lLightCircle2_spr = this._fLightCircle2_spr = this._fLightCircle2Container_spr.addChild(APP.library.getSprite('boss_mode/common/light_circle_2'));
		lLightCircle2_spr.position.set(-26.15, -35.85);
		lLightCircle2_spr.alpha = 0;
		lLightCircle2_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lLightCircle2_spr.scale.set(0.84, 0.84); //0.42*2, 0.42*2

		let l_seq = [
			{tweens: [], duration: 92 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}], duration: 0 * FRAME_RATE},
			{tweens: [], duration: 1 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 1.152}, {prop: 'scale.y', to: 1.152}], duration: 1 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 5.837}, {prop: 'scale.y', to: 5.837}, {prop: 'alpha', to: 0}], duration: 7 * FRAME_RATE,
				onfinish: ()=>{
					this._fAnimationCount_num--; 
					lLightCircle2_spr && lLightCircle2_spr.destroy();
					this._animationCompletedSuspicison();
			}}
		]

		this._fAnimationCount_num++;
		Sequence.start(lLightCircle2_spr, l_seq);
	}

	_startMiniExplosionSingleAnimation()
	{
		this._fAnimationCount_num++;

		let lTimer = this._fStartMiniExplosionSingleTimer_tmr = new Timer(()=>{	
			lTimer && lTimer.destructor();
	
			this._fLightningBossMiniExplosionSingleAnimation_lbmesa = this._fMiniExplosionSingleContainer_spr.addChild(new LightningBossMiniExplosionAnimation());
			this._fLightningBossMiniExplosionSingleAnimation_lbmesa.position.set(-9.8, -24.15);
			this._fLightningBossMiniExplosionSingleAnimation_lbmesa.scale.set(1.9, 1.9);
			this._fLightningBossMiniExplosionSingleAnimation_lbmesa.once(LightningBossMiniExplosionAnimation.EVENT_ON_ANIMATION_ENDED, this._onMiniExplosionSingleAnimationCompleted, this);
			this._fLightningBossMiniExplosionSingleAnimation_lbmesa.i_startAnimation();	
			
		}, 103 * FRAME_RATE, true);	
	}

	_onMiniExplosionSingleAnimationCompleted()
	{
		this._fAnimationCount_num--;
		this._animationCompletedSuspicison();
	}

	_startOpticalFlareYellowAnimation()
	{
		this._fAnimationCount_num++;
		this._fLightningBossOpticalFlareYellowAnimation_lbofya = this._fOpticalFlareContainer_spr.addChild(new LightningBossOpticalFlareYellowAnimation());
		this._fLightningBossOpticalFlareYellowAnimation_lbofya.once(LightningBossOpticalFlareYellowAnimation.EVENT_ON_ANIMATION_ENDED, this._onLightningBossOpticalFlareYellowAnimationCompleted, this);
		this._fLightningBossOpticalFlareYellowAnimation_lbofya.i_startDisappearingAnimation();	
	}

	_onLightningBossOpticalFlareYellowAnimationCompleted()
	{
		this._fAnimationCount_num--;
		this._animationCompletedSuspicison();
	}

	_animationCompletedSuspicison()
	{
		if (this._fAnimationCount_num == 0)
		{
			this.__onBossDeathAnimationCompleted();
		}
	}

	_startExplodeCoinTimer()
	{
		let lTimer = this._fStartAnimationExplodeCoinTimer_tmr = new Timer(()=>{
			lTimer && lTimer.destructor();

			this.__onTimeToExplodeCoin();
		}, 101 * FRAME_RATE, true);	
	}

	destroyAnimation()
	{
		for (let i = 0; i < this._fStartMommiesTimer_tmr_arr.length; i++)
		{
			this._fStartMommiesTimer_tmr_arr[i] && this._fStartMommiesTimer_tmr_arr[i].destructor();
		}
		this._fStartMommiesTimer_tmr_arr = [];

		for (let i = 0; i < this._fStartMiniExplosionTimer_tmr_arr.length; i++)
		{
			this._fStartMiniExplosionTimer_tmr_arr[i] && this._fStartMiniExplosionTimer_tmr_arr[i].destructor();
		}
		this._fStartMiniExplosionTimer_tmr_arr = [];

		this._fStartExplosion_tmr && this._fStartExplosion_tmr.destructor();
		this._fStartExplosion_tmr = null;
		this._fStartMiniExplosionSingleTimer_tmr && this._fStartMiniExplosionSingleTimer_tmr.destructor();
		this._fStartMiniExplosionSingleTimer_tmr = null;

		this._fStartAnimationExplodeCoinTimer_tmr && this._fStartAnimationExplodeCoinTimer_tmr.destructor();
		this._fStartAnimationExplodeCoinTimer_tmr = null;

		this._fLightningBossCircleBlastAnimation_lbcba && this._fLightningBossCircleBlastAnimation_lbcba.destroy();
		this._fLightningBossCircleBlastAnimation_lbcba = null;

		this._fCircleBlastContainer_spr && this._fCircleBlastContainer_spr.destroy();
		this._fCircleBlastContainer_spr = null;

		Sequence.destroy(Sequence.findByTarget(this._fDark_spr));
		this._fDark_spr = null;

		this._fDarkContainer_spr && this._fDarkContainer_spr.destroy();
		this._fDarkContainer_spr = null;

		Sequence.destroy(Sequence.findByTarget(this._fLightningBossSmokeMainAnimation_lbsma));
		this._fLightningBossSmokeMainAnimation_lbsma && this._fLightningBossSmokeMainAnimation_lbsma.destroy();
		this._fLightningBossSmokeMainAnimation_lbsma = null;

		for (let i = 0; i < this._fLightningBossLightningMommiesAnimation_lblma_arr.length; i++)
		{
			this._fLightningBossLightningMommiesAnimation_lblma_arr[i] && this._fLightningBossLightningMommiesAnimation_lblma_arr[i].destroy();
		}
		this._fLightningBossLightningMommiesAnimation_lblma_arr = [];

		for (let i = 0; i < this._fLightningBossMiniExplosionAnimation_lbmea_arr.length; i++)
		{
			this._fLightningBossMiniExplosionAnimation_lbmea_arr[i] && this._fLightningBossMiniExplosionAnimation_lbmea_arr[i].destroy();
		}
		this._fLightningBossMiniExplosionAnimation_lbmea_arr = [];

		this._fIsNeedLight51ContainerWiggle_bl = null;

		Sequence.destroy(Sequence.findByTarget(this._fLight51_spr));
		this._fLight51_spr && this._fLight51_spr.destroy();
		this._fLight51_spr = null;

		Sequence.destroy(Sequence.findByTarget(this._fLight51Container_spr));
		this._fLight51Container_spr && this._fLight51Container_spr.destroy();
		this._fLight51Container_spr = null;

		this._fLightningBossExplosionAnimation_lbea && this._fLightningBossExplosionAnimation_lbea.destroy();
		this._fLightningBossExplosionAnimation_lbea = null;

		Sequence.destroy(Sequence.findByTarget(this._fLight52_spr));
		this._fLight52_spr && this._fLight52_spr.destroy();
		this._fLight52_spr = null;

		Sequence.destroy(Sequence.findByTarget(this._fLight2_spr));
		this._fLight2_spr && this._fLight2_spr.destroy();
		this._fLight2_spr = null;

		Sequence.destroy(Sequence.findByTarget(this._fLightCircle1_spr));
		this._fLightCircle1_spr && this._fLightCircle1_spr.destroy();
		this._fLightCircle1_spr = null;

		Sequence.destroy(Sequence.findByTarget(this._fLightCircle2_spr));
		this._fLightCircle2_spr && this._fLightCircle2_spr.destroy();
		this._fLightCircle2_spr = null;

		this._fLightningBossMiniExplosionSingleAnimation_lbmesa && this._fLightningBossMiniExplosionSingleAnimation_lbmesa.destroy();
		this._fLightningBossMiniExplosionSingleAnimation_lbmesa = null;

		this._fLightningBossOpticalFlareYellowAnimation_lbofya && this._fLightningBossOpticalFlareYellowAnimation_lbofya.destroy();
		this._fLightningBossOpticalFlareYellowAnimation_lbofya = null;

		this._fLightningBossGodDefeatedAnimation_lbgda && this._fLightningBossGodDefeatedAnimation_lbgda.destroy();
		this._fLightningBossGodDefeatedAnimation_lbgda = null;		

		this._fBossDefeatedContainer_spr && this._fBossDefeatedContainer_spr.destroy();
		this._fBossDefeatedContainer_spr = null;
		
	}

	destroy()
	{
		this.destroyAnimation();
		super.destroy();
	}
}

export default LightningBossDeathFxAnimation;