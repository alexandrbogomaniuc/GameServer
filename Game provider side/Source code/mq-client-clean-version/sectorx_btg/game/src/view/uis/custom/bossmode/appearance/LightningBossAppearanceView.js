import { ENEMIES, FRAME_RATE } from '../../../../../../../shared/src/CommonConstants';
import Timer from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import Sequence from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import * as Easing from '../../../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import AppearanceView from './AppearanceView';
import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { Utils } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import { AtlasSprite, Sprite } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import AtlasConfig from '../../../../../config/AtlasConfig';
import LightningBossLightningMommiesAnimation from './animation/LightningBossLightningMommiesAnimation';
import LightningBossSmokeMainAnimation from './animation/LightningBossSmokeMainAnimation';
import LightningBossCircleBlastAnimation from './animation/LightningBossCircleBlastAnimation';
import LightningBossPurplePinkSmokeAnimation from './animation/LightningBossPurplePinkSmokeAnimation';
import LightningBossOpticalFlareYellowAnimation from './animation/LightningBossOpticalFlareYellowAnimation';
import LightningBossGradientOrangeAnimation from './animation/LightningBossGradientOrangeAnimation';


const APPEARING_LIGHTNING_PARAM =[
	{
		delay: 137,
		duration: 22,
		position: {x: 20.35, y: -30.64},
		scale: {x: 1.562, y: 1.562}
	},
	{
		delay: 168,
		duration: 22,
		position: {x: 19.35, y: -71.65},
		scale: {x: 1.562, y: 1.562}
	},
];

const LIGHTNING_MOMMIES_TIMER_PARAM = [
	{delay: 3},
	{delay: 28},
	{delay: 70},
	{delay: 100}
];

const LIGHTNING_RING_TIMER_PARAM = [
	{delay: 106},
	{delay: 115},
	{delay: 129}
];

let lightning_textures = null;
export function generateLightningTextures()
{
	if (!lightning_textures)
	{
		lightning_textures = AtlasSprite.getFrames(
			[
				APP.library.getAsset("boss_mode/lightning/lightning_0"),
				APP.library.getAsset("boss_mode/lightning/lightning_1")
			],
			[
				AtlasConfig.LightningBossLightning1,
				AtlasConfig.LightningBossLightning2
			],
			"");
	}
	return lightning_textures;
}

let _lightning_ring_textures = null;
function _generateLightningRingTextures()
{
	if (_lightning_ring_textures) return

	_lightning_ring_textures = AtlasSprite.getFrames(
		[
			APP.library.getAsset("boss_mode/lightning/main_smoke/lightning_ring")
		],
		[
			AtlasConfig.LightningBossLightningRing
		],
		"");
}


class LightningBossAppearanceView extends AppearanceView
{
	static get EVENT_SHAKE_THE_GROUND_REQUIRED() 			{ return AppearanceView.EVENT_SHAKE_THE_GROUND_REQUIRED; }
	static get EVENT_APPEARING_PRESENTATION_STARTED()		{ return AppearanceView.EVENT_APPEARING_PRESENTATION_STARTED; }

	constructor(aViewContainerInfo_obj)
	{
		super();

		generateLightningTextures();
		_generateLightningRingTextures();

		this._fViewContainerInfo_obj = aViewContainerInfo_obj;

		this._fIntroAnimationCount_num = 0;

		this._fBottomFXContainer = this._fViewContainerInfo_obj.container.addChild(new Sprite());
		this._fBottomFXContainer.zIndex = this._fViewContainerInfo_obj.bottomZIndex;
		this._fBottomFXContainer.position.set(480, 270); //960 / 2, 540 / 2)
		this._fTopFXContainer = this._fViewContainerInfo_obj.container.addChild(new Sprite());
		this._fTopFXContainer.zIndex = this._fViewContainerInfo_obj.zIndex;
		this._fTopFXContainer.position.set(480, 270); //960 / 2, 540 / 2)
		
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._fSmokeSpinContainer_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
			this._fBottomFXContainer.addChild(this._fSmokeSpinContainer_spr);

			this._fCircleBlastContainer_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
			this._fBottomFXContainer.addChild(this._fCircleBlastContainer_spr);

			this._fMommiesContainer_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
			this._fTopFXContainer.addChild(this._fMommiesContainer_spr);

			this._fLightningRingContainer_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
			this._fTopFXContainer.addChild(this._fLightningRingContainer_spr);

			this._fLightCircle2Container_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
			this._fTopFXContainer.addChild(this._fLightCircle2Container_spr);

			this._fLight5Container_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
			this._fTopFXContainer.addChild(this._fLight5Container_spr);

			this._fFxLight2Container_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
			this._fTopFXContainer.addChild(this._fFxLight2Container_spr);

			this._fLightCircleSimpleContainer_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
			this._fTopFXContainer.addChild(this._fLightCircleSimpleContainer_spr);

			this._fLightCircle22Container_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
			this._fTopFXContainer.addChild(this._fLightCircle22Container_spr);

			this._fLightningRing2Container_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
			this._fTopFXContainer.addChild(this._fLightningRing2Container_spr);

			this._fOpticalFlareContainer_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
			this._fTopFXContainer.addChild(this._fOpticalFlareContainer_spr);

			this._fGradientOrangeContainer_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
			this._fTopFXContainer.addChild(this._fGradientOrangeContainer_spr);
		}

		this._fParticlesYellowContainer_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
		this._fTopFXContainer.addChild(this._fParticlesYellowContainer_spr);

		this._fLightning2Container_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
		this._fTopFXContainer.addChild(this._fLightning2Container_spr);

		this._fSmokeMainContainer_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
		this._fTopFXContainer.addChild(this._fSmokeMainContainer_spr);
			
		this._fTimer_t = null;
		this._fLightningBossCircleBlastAnimation_lbcba = null;
		this._fStartSmokeSpin_tmr = null;
		this._fLightningBossSmokeSpinAnimation_lbssa = null;

		this._fStartMommiesTimer_tmr_arr = [];
		this._fLightningBossLightningMommiesAnimation_lblma_arr = [];

		this._fLightningBossSmokeMainAnimation_lbsma = null;

		this._fStartLightningRingTimer_tmr = null;
		this._fLightningRing_spr = null;

		this._fStartLightning2_tmr_arr = [];
		this._fLightning2_spr_arr = [];
		this._fCompleteLightning2_tmr_arr = [];

		this._fLightCircle2_spr = null;
		this._fParticlesYellow_spr = null;

		this._fLight5_spr = null;
		this._fFxLight2_spr = null;
		this._fCircleSimple_spr = null;
		this._fLightCircle22_spr = null;
		
		this._fStartRing2_tmr_arr = [];
		this._fLightningRing2_spr_arr = [];

		this._fLightningBossOpticalFlareYellowAnimation_lbofya = null;
		this._fLightningBossGradientOrangeAnimation_lbgoa = null;
	}

	//INIT...
	get _captionPosition()
	{
		return { x:0, y:-4 };
	}

	get _bossType()
	{
		return ENEMIES.LightningBoss;
	}
	//...INIT

	//ANIMATION..
	get _appearingCulminationTime()
	{
		return 43 * FRAME_RATE;
	}

	_playAppearingAnimation()
	{
		super._playAppearingAnimation();

		this._fIntroAnimationCount_num = 0;

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startCircleBlastAnimation();
			this._startLightningSmokeSpinAnimation();
			this._startLightningMommiesAnimation();
			this._startLightningRingAnimation();
		}

		this._startLightningSmokeMainAnimation();
		this._startLightning2();

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startLightCircle2();
		}

		this._startParticlesYellow();

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startLight5();
			this._startFxLight2();
			this._startLightCircleSimple();
			this._startLightCircle22();
			this._startLightningRing2Animation();
			this._startOpticalFlareYellowAnimation();
			this._startGradientOrangeAnimation();
		}

		this.emit(LightningBossAppearanceView.EVENT_APPEARING_PRESENTATION_STARTED);
		this.emit(LightningBossAppearanceView.EVENT_SHAKE_THE_GROUND_REQUIRED);
	}

	_startCircleBlastAnimation()
	{
		this._fLightningBossCircleBlastAnimation_lbcba = this._fCircleBlastContainer_spr.addChild(new LightningBossCircleBlastAnimation());
		this._fLightningBossCircleBlastAnimation_lbcba.once(LightningBossCircleBlastAnimation.EVENT_ON_ANIMATION_ENDED, this._onCircleBlastAnimationCompleted, this);
		this._fIntroAnimationCount_num++;	
		this._fLightningBossCircleBlastAnimation_lbcba.i_startAppearanceAnimation();
	}

	_onCircleBlastAnimationCompleted()
	{
		this._fIntroAnimationCount_num--;
		this._appearingAnimationCompletedSuspicison();
	}

	_startLightningSmokeSpinAnimation()
	{
		this._fIntroAnimationCount_num++;
		let lTimer = this._fStartSmokeSpin_tmr = new Timer(()=>{
			lTimer && lTimer.destructor();
			this._fLightningBossSmokeSpinAnimation_lbssa = this._fSmokeSpinContainer_spr.addChild(new LightningBossPurplePinkSmokeAnimation());
			this._fLightningBossSmokeSpinAnimation_lbssa.once(LightningBossPurplePinkSmokeAnimation.EVENT_ON_ANIMATION_ENDED, this._onSmokeSpinAnimationCompleted, this);
			this._fLightningBossSmokeSpinAnimation_lbssa.position.set(-23, -110); 
			this._fLightningBossSmokeSpinAnimation_lbssa.i_startAnimation();
	}, 87 * FRAME_RATE, true);	
	}

	_onSmokeSpinAnimationCompleted()
	{
		this._fIntroAnimationCount_num--;
		this._appearingAnimationCompletedSuspicison();
	}
	

	_startLightningMommiesAnimation()
	{		
		for (let i = 0; i < LIGHTNING_MOMMIES_TIMER_PARAM.length; i++)
		{
			this._fIntroAnimationCount_num++;
			let param = LIGHTNING_MOMMIES_TIMER_PARAM[i];

			let lTimer = this._fStartMommiesTimer_tmr_arr[i] = new Timer(()=>{	
				lTimer && lTimer.destructor();
	
				this._fLightningBossLightningMommiesAnimation_lblma_arr[i] = this._fMommiesContainer_spr.addChild(new LightningBossLightningMommiesAnimation());
				this._fLightningBossLightningMommiesAnimation_lblma_arr[i].once(LightningBossLightningMommiesAnimation.EVENT_ON_ANIMATION_ENDED, this._onLightningMommiesAnimationCompleted, this);
				this._fLightningBossLightningMommiesAnimation_lblma_arr[i].position.set(-160, -270);
				this._fLightningBossLightningMommiesAnimation_lblma_arr[i].i_startAnimation();	
			
			}, param.delay * FRAME_RATE, true);	
		}
	}

	
	_onLightningMommiesAnimationCompleted()
	{
		this._fIntroAnimationCount_num--;
		this._appearingAnimationCompletedSuspicison();
	}

	_startLightningSmokeMainAnimation()
	{
		this._fLightningBossSmokeMainAnimation_lbsma = this._fSmokeMainContainer_spr.addChild(new LightningBossSmokeMainAnimation());
		this._fLightningBossSmokeMainAnimation_lbsma.once(LightningBossSmokeMainAnimation.EVENT_ON_ANIMATION_ENDED, this._onAppearingLightningBossSmokeMainAnimationCompleted, this);
		this._fIntroAnimationCount_num++;
		this._fLightningBossSmokeMainAnimation_lbsma.i_startAppearingAnimation();
	}

	_onAppearingLightningBossSmokeMainAnimationCompleted()
	{
		this._fIntroAnimationCount_num--;
		this._appearingAnimationCompletedSuspicison();
	}

	_startLightningRingAnimation()
	{
		this._fIntroAnimationCount_num++

		let lTimer = this._fStartLightningRingTimer_tmr = new Timer(()=>{
			lTimer && lTimer.destructor();

			let lLightningRing_spr = this._fLightningRing_spr = this._fLightningRingContainer_spr.addChild(new Sprite());

			lLightningRing_spr.textures = _lightning_ring_textures;
			lLightningRing_spr.animationSpeed = 0.5; //30 / 60;
			lLightningRing_spr.blendMode = PIXI.BLEND_MODES.ADD;
			lLightningRing_spr.position.x = 1.7; 
			lLightningRing_spr.position.y = 5.85; 
			lLightningRing_spr.scale.set(2.144, 2.144);
			lLightningRing_spr.rotation = 2.4033183799961915; //Utils.gradToRad(137.7);

			lLightningRing_spr.on('animationend', () => {
				lLightningRing_spr && lLightningRing_spr.destroy();
				lLightningRing_spr = null;
				this._fIntroAnimationCount_num--;
				this._appearingAnimationCompletedSuspicison();
			});
			
			lLightningRing_spr.play();
		}, 5 * FRAME_RATE, true);
	}

	_startLightning2()
	{
		this._startLightning2Once(0);
		this._startLightning2Once(1);
	}

	_startLightning2Once(aIndex)
	{
		this._fIntroAnimationCount_num++;

		let param = APPEARING_LIGHTNING_PARAM[aIndex];
		let lTimer = this._fStartLightning2_tmr_arr[aIndex] = new Timer(()=>{
			this._fAnimationCount_num++;

			lTimer && lTimer.destructor();

			let lLightning2_spr = this._fLightning2_spr_arr[aIndex] = this._fLightning2Container_spr.addChild(new Sprite());

			lLightning2_spr.textures = lightning_textures;
			lLightning2_spr.animationSpeed = 0.5; //30 / 60;
			lLightning2_spr.blendMode = PIXI.BLEND_MODES.ADD;
		
			lLightning2_spr.position.x = param.position.x;
			lLightning2_spr.position.y = param.position.y;
			
			lLightning2_spr.scale.set(param.scale.x, param.scale.y);
			lLightning2_spr.loop = true;

			let lCompleteTimer = this._fCompleteLightning2_tmr_arr[aIndex] = new Timer(()=>{
				lCompleteTimer && lCompleteTimer.destructor();

				lLightning2_spr.stop();
				lLightning2_spr && lLightning2_spr.destroy();
				this._fIntroAnimationCount_num--;
				lLightning2_spr = null;

				this._fAnimationCount_num--;
				this._appearingAnimationCompletedSuspicison();
			}, param.duration * FRAME_RATE, true);

			lLightning2_spr.play();
		}, param.delay * FRAME_RATE, true);	
	}

	_startLightCircle2()
	{
		let lLightCircle2_spr = this._fLightCircle2_spr = this._fLightCircle2Container_spr.addChild(APP.library.getSprite('boss_mode/common/light_circle_2'));
		lLightCircle2_spr.position.set(-16.25, 11.2); 
		lLightCircle2_spr.alpha = 0;
		lLightCircle2_spr.scale.set(3.3, 3.3); //1.65*2, 1.65*2
		lLightCircle2_spr.blendMode = PIXI.BLEND_MODES.ADD;

		let l_seq = [
			{tweens: [], duration: 107 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 2.46}, {prop: 'scale.y', to: 2.46}, {prop: 'alpha', to: 0.99}], duration: 3 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 5.14}, {prop: 'scale.y', to: 5.14}, {prop: 'alpha', to: 0}], duration: 13 * FRAME_RATE,
				onfinish: ()=>{
					this._fAnimationCount_num--; 
					lLightCircle2_spr && lLightCircle2_spr.destroy();
					this._appearingAnimationCompletedSuspicison();
			}}
		]

		this._fAnimationCount_num++;
		Sequence.start(lLightCircle2_spr, l_seq);
	}

	_startParticlesYellow()
	{
		let lParticlesYellow_spr = this._fParticlesYellow_spr = this._fParticlesYellowContainer_spr.addChild(APP.library.getSprite('boss_mode/common/particles_yellow'));
		lParticlesYellow_spr.position.set(-0.5, -42.2);
		lParticlesYellow_spr.alpha = 0;
		lParticlesYellow_spr.scale.set(2.161, 2.161);
		lParticlesYellow_spr.blendMode = PIXI.BLEND_MODES.ADD;

		let l_seq = [
			{tweens: [], duration: 112 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}], duration: 0 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 17.68}, {prop: 'scale.y', to: 17.68}, {prop: 'alpha', to: 0.99}], duration: 12 * FRAME_RATE,
				onfinish: ()=>{
					this._fAnimationCount_num--; 
					lParticlesYellow_spr && lParticlesYellow_spr.destroy();
					this._appearingAnimationCompletedSuspicison();
			}}
		]

		this._fAnimationCount_num++;
		Sequence.start(lParticlesYellow_spr, l_seq);
	}

	_startLight5()
	{
		let lLight5_spr = this._fLight5_spr = this._fLight5Container_spr.addChild(APP.library.getSprite('common/misty_flare'));
		lLight5_spr.position.set(-14.85, -127);
		lLight5_spr.alpha = 0;
		lLight5_spr.scale.set(0.19, 0.19);
		lLight5_spr.blendMode = PIXI.BLEND_MODES.ADD;

		let l_seq = [
			{tweens: [], duration: 106 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0.6}], duration: 0 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 8.545}, {prop: 'scale.y', to: 8.545}], duration: 3 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 8.042}, {prop: 'scale.y', to: 8.042}], duration: 9 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 0.187}, {prop: 'scale.y', to: 0.187}, {prop: 'alpha', to: 0}], duration: 46 * FRAME_RATE,
				onfinish: ()=>{
					this._fAnimationCount_num--;
					lLight5_spr && lLight5_spr.destroy();
					this._appearingAnimationCompletedSuspicison();
			}}
		]

		this._fAnimationCount_num++;
		Sequence.start(lLight5_spr, l_seq);
	}

	_startFxLight2()
	{
		let lFxLight2_spr = this._fFxLight2_spr = this._fFxLight2Container_spr.addChild(APP.library.getSprite('boss_mode/common/fx_light_2'));
		lFxLight2_spr.position.set(-264.3, -88.1);
		lFxLight2_spr.alpha = 0;
		lFxLight2_spr.scale.set(4.72, 4.72);
		lFxLight2_spr.blendMode = PIXI.BLEND_MODES.ADD;

		let l_seq = [
			{tweens: [], duration: 107 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0.49}], ease: Easing.quadratic.easeOut, duration: 2 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0}], ease: Easing.quadratic.easeIn, duration: 19 * FRAME_RATE,
				onfinish: ()=>{
					this._fAnimationCount_num--;
					lFxLight2_spr && lFxLight2_spr.destroy();
					this._appearingAnimationCompletedSuspicison();
			}}
		]

		this._fAnimationCount_num++;
		Sequence.start(lFxLight2_spr, l_seq);
	}

	_startLightCircleSimple()
	{
		let lCircle1_spr = this._fCircleSimple_spr = this._fLightCircleSimpleContainer_spr.addChild(APP.library.getSprite('boss_mode/common/light_circle_1'));
		lCircle1_spr.position.set(-20.6, -106.4);
		lCircle1_spr.alpha = 0;
		lCircle1_spr.scale.set(0.84, 0.84); //0.42*2, 0.42*2
		lCircle1_spr.blendMode = PIXI.BLEND_MODES.ADD;

		let l_seq = [
			{tweens: [], duration: 106 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0.6}], duration: 0 * FRAME_RATE},
			{tweens: [], duration: 1 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 1.42}, {prop: 'scale.y', to: 1.42}], ease: Easing.quadratic.easeOut, duration: 1 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 5.835}, {prop: 'scale.y', to: 5.835}, {prop: 'alpha', to: 0}], ease: Easing.quadratic.easeIn, duration: 5 * FRAME_RATE,
				onfinish: ()=>{
					this._fAnimationCount_num--;
					lCircle1_spr && lCircle1_spr.destroy();
					this._appearingAnimationCompletedSuspicison();
			}}
		];

		this._fAnimationCount_num++;
		Sequence.start(lCircle1_spr, l_seq);
	}

	_startLightCircle22()
	{
		let lLightCircle22_spr = this._fLightCircle22_spr = this._fLightCircle22Container_spr.addChild(APP.library.getSprite('boss_mode/common/light_circle_2'));
		lLightCircle22_spr.position.set(-20.6, -106.4);
		lLightCircle22_spr.alpha = 0;
		lLightCircle22_spr.scale.set(0.84, 0.84); //0.42*2, 0.42*2
		lLightCircle22_spr.blendMode = PIXI.BLEND_MODES.ADD;

		let l_seq = [
			{tweens: [], duration: 107 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}], duration: 0 * FRAME_RATE},
			{tweens: [], duration: 1 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 1.152}, {prop: 'scale.y', to: 1.152}], duration: 1 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 5.837}, {prop: 'scale.y', to: 5.837}, {prop: 'alpha', to: 0}], duration: 7 * FRAME_RATE,
				onfinish: ()=>{
					this._fAnimationCount_num--; 
					lLightCircle22_spr && lLightCircle22_spr.destroy();
					this._appearingAnimationCompletedSuspicison();
			}}
		]

		this._fAnimationCount_num++;
		Sequence.start(lLightCircle22_spr, l_seq);
	}

	_startLightningRing2Animation()
	{
		for (let i = 0; i < LIGHTNING_RING_TIMER_PARAM.length; i++)
		{
			this._fIntroAnimationCount_num++;
			let param = LIGHTNING_RING_TIMER_PARAM[i];

			let lTimer = this._fStartRing2_tmr_arr[i] = new Timer(()=>{	
				lTimer && lTimer.destructor();

				let lLightningRing_spr = this._fLightningRing2_spr_arr[i] = this._fLightningRing2Container_spr.addChild(new Sprite());
	
				lLightningRing_spr.textures = _lightning_ring_textures;
				lLightningRing_spr.animationSpeed = 0.5; //30 / 60;
				lLightningRing_spr.blendMode = PIXI.BLEND_MODES.ADD;
				lLightningRing_spr.position.x = 1.7; 
				lLightningRing_spr.position.y = 5.85; 
				lLightningRing_spr.scale.set(2.144, 2.144);
				lLightningRing_spr.rotation = 2.4033183799961915; //Utils.gradToRad(137.7);
	
				lLightningRing_spr.on('animationend', () => {
					lLightningRing_spr && lLightningRing_spr.destroy();
					lLightningRing_spr = null;
					this._fIntroAnimationCount_num--;
					this._appearingAnimationCompletedSuspicison();
				});
				
				lLightningRing_spr.play();
			
			}, param.delay * FRAME_RATE, true);	
		}
	}

	_startOpticalFlareYellowAnimation()
	{
		this._fLightningBossOpticalFlareYellowAnimation_lbofya = this._fOpticalFlareContainer_spr.addChild(new LightningBossOpticalFlareYellowAnimation());
		this._fLightningBossOpticalFlareYellowAnimation_lbofya.once(LightningBossOpticalFlareYellowAnimation.EVENT_ON_ANIMATION_ENDED, this._onIntroLightningBossOpticalFlareYellowAnimationCompleted, this);
		this._fIntroAnimationCount_num++;
		this._fLightningBossOpticalFlareYellowAnimation_lbofya.i_startAppearingAnimation();
	}

	_onIntroLightningBossOpticalFlareYellowAnimationCompleted()
	{
		this._fIntroAnimationCount_num--;
		this._appearingAnimationCompletedSuspicison();
	}

	_startGradientOrangeAnimation()
	{
		this._fLightningBossGradientOrangeAnimation_lbgoa = this._fGradientOrangeContainer_spr.addChild(new LightningBossGradientOrangeAnimation());
		this._fLightningBossGradientOrangeAnimation_lbgoa.once(LightningBossGradientOrangeAnimation.EVENT_ON_ANIMATION_ENDED, this._onIntroLightningBossGradientOrangeAnimationCompleted, this);
		this._fIntroAnimationCount_num++;
		this._fLightningBossGradientOrangeAnimation_lbgoa.i_startAnimation();
	}

	_onIntroLightningBossGradientOrangeAnimationCompleted()
	{
		this._fIntroAnimationCount_num--;
		this._appearingAnimationCompletedSuspicison();
	}
	

	_appearingAnimationCompletedSuspicison()
	{
		if (this._fIntroAnimationCount_num == 0)
		{
			this._onAppearingCompleted();
			this.destroyAnimation();
		}
	}	

	_onAppearingCulminated()
	{
		super._onAppearingCulminated();
	}
	//...ANIMATION

	destroyAnimation()
	{
		this._fTimer_t && this._fTimer_t.destructor();
		this._fStartSmokeSpin_tmr  && this._fStartSmokeSpin_tmr.destructor();
		this._fStartLightningRingTimer_tmr  && this._fStartLightningRingTimer_tmr.destructor();

		for (let i = 0; i < this._fStartMommiesTimer_tmr_arr.length; i++)
		{
			this._fStartMommiesTimer_tmr_arr[i] && this._fStartMommiesTimer_tmr_arr[i].destructor();
		}
		this._fStartMommiesTimer_tmr_arr = [];

		for (let i = 0; i < this._fStartLightning2_tmr_arr.length; i++)
		{
			this._fStartLightning2_tmr_arr[i] && this._fStartLightning2_tmr_arr[i].destructor();
		}
		this._fStartLightning2_tmr_arr = [];

		for (let i = 0; i < this._fCompleteLightning2_tmr_arr.length; i++)
		{
			this._fCompleteLightning2_tmr_arr[i] && this._fCompleteLightning2_tmr_arr[i].destructor();
		}
		this._fCompleteLightning2_tmr_arr = [];

		for (let i = 0; i < this._fStartRing2_tmr_arr.length; i++)
		{
			this._fStartRing2_tmr_arr[i] && this._fStartRing2_tmr_arr[i].destructor();
		}
		this._fStartRing2_tmr_arr = [];

		this._fLightningBossCircleBlastAnimation_lbcba && this._fLightningBossCircleBlastAnimation_lbcba.destroy();		
		this._fLightningBossSmokeSpinAnimation_lbssa && this._fLightningBossSmokeSpinAnimation_lbssa.destroy();

		for (let i = 0; i < this._fLightningBossLightningMommiesAnimation_lblma_arr.length; i++)
		{
			this._fLightningBossLightningMommiesAnimation_lblma_arr[i] && this._fLightningBossLightningMommiesAnimation_lblma_arr[i].destroy();
		}
		this._fLightningBossLightningMommiesAnimation_lblma_arr = [];

		this._fLightningBossSmokeMainAnimation_lbsma && this._fLightningBossSmokeMainAnimation_lbsma.destroy();	

		this._fLightningRing_spr && this._fLightningRing_spr.destroy();	

		for (let i = 0; i < this._fLightning2_spr_arr.length; i++)
		{
			this._fLightning2_spr_arr[i] && this._fLightning2_spr_arr[i].destroy();
		}
		this._fLightning2_spr_arr = [];

		this._fLightCircle2_spr && Sequence.destroy(Sequence.findByTarget(this._fLightCircle2_spr));
		this._fLightCircle2_spr = null;

		this._fParticlesYellow_spr && Sequence.destroy(Sequence.findByTarget(this._fParticlesYellow_spr));
		this._fParticlesYellow_spr = null;

		this._fLight5_spr && Sequence.destroy(Sequence.findByTarget(this._fLight5_spr));
		this._fLight5_spr = null;

		this._fFxLight2_spr && Sequence.destroy(Sequence.findByTarget(this._fFxLight2_spr));
		this._fFxLight2_spr = null;

		this._fCircleSimple_spr && Sequence.destroy(Sequence.findByTarget(this._fCircleSimple_spr));
		this._fCircleSimple_spr = null;

		this._fLightCircle22_spr && Sequence.destroy(Sequence.findByTarget(this._fLightCircle22_spr));
		this._fLightCircle22_spr = null;

		this._fTopFXContainer && this._fTopFXContainer.destroy();
		this._fBottomFXContainer && this._fBottomFXContainer.destroy();

		this._fTopFXContainer = null;
		this._fBottomFXContainer = null;

		for (let i = 0; i < this._fLightningRing2_spr_arr.length; i++)
		{
			this._fLightningRing2_spr_arr[i] && this._fLightningRing2_spr_arr[i].destroy();
		}
		this._fLightningRing2_spr_arr = [];

		this._fLightningBossOpticalFlareYellowAnimation_lbofya && this._fLightningBossOpticalFlareYellowAnimation_lbofya.destroy();	
		this._fLightningBossGradientOrangeAnimation_lbgoa && this._fLightningBossGradientOrangeAnimation_lbgoa.destroy();	
	}


	destroy()
	{
		super.destroy();
		this.destroyAnimation();
	}
}

export default LightningBossAppearanceView;