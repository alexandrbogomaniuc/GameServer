import Capsule from "./Capsule";
import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../shared/src/CommonConstants';
import { Sequence } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import LightningCapsuleElectricityRingAnimation from '../animation/death/lightning_capsule/LightningCapsuleElectricityRingAnimation';
import LightningCapsuleLightningBurstAnimation from '../animation/death/lightning_capsule/LightningCapsuleLightningBurstAnimation';
import * as Easing from '../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import Sprite from '../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import Timer from '../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import LightningCapsuleLightningIconDeathAnimation from '../animation/death/lightning_capsule/LightningCapsuleLightningIconDeathAnimation';
import LightningCapsuleLightningExplodeAnimation from '../animation/death/lightning_capsule/LightningCapsuleLightningExplodeAnimation';
import AtlasSprite from '../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import AtlasConfig from '../../config/AtlasConfig';
import { Utils } from '../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import OpticalFlareCyan from '../animation/optical_flare_cyan/OpticalFlareCyan';
import LightningCapsuleExtraEletricityAnimation from '../animation/death/lightning_capsule/LightningCapsuleExtraEletricityAnimation';
import LightningCapsuleFeatureController from '../../controller/uis/capsule_features/LightningCapsuleFeatureController';
import Enemy from "./Enemy";

export let _lightning_orb_textures = null;
export function _generateLightningOrbTextures()
{
	if (_lightning_orb_textures) return;

	_lightning_orb_textures = AtlasSprite.getFrames([APP.library.getAsset("enemies/lightning_capsule/death/lightning_orb/lightning_orb_0"), APP.library.getAsset("enemies/lightning_capsule/death/lightning_orb/lightning_orb_1")], [AtlasConfig.LightningOrb1, AtlasConfig.LightningOrb2], "");
}

class LightningCapsule extends Capsule
{
	static get EVENT_ON_NEED_OPTICAL_FLARE_CYAN()				{return "onNeedOpticalFlareCyan";}

	constructor(params)
	{
		super(params);

		_generateLightningOrbTextures();
		
		this._fFXLightningBurstContainer_spr = this.addChild(new Sprite());
		this._fFXIconContainer_spr = this.addChild(new Sprite());

		this._fLightningOrbContainer_spr = this.addChild(new Sprite());
		this._fLightningOrbContainer_spr.alpha = 0;

		this._fFXBlueGlowContainer_spr = this.addChild(new Sprite());

		this._fMiddleTopontainer_spr = this.addChild(new Sprite());	

		this._fFXTopContainer_spr = this.addChild(new Sprite());

		this._fOpticalFlareCyan_ofc = null;
		this._fIsOutroOpticalFlareCyanAnimating_bl = null;
		
		this._fLightningBlueGlowOnce_spr = null;
		this._fIsIntroLightningBlueGlowOnceAnimating_bl = null;
		
		this._fLightningBlueGlow_spr = null;
		this._fIsIntroLightningBlueGlowAnimating_bl = null;
		this._fLightningBlueGlowWiggle_s = null;
		this._fIsOutroLightningBlueGlowAnimating_bl = null;
		
		this._fElectricityRingAnimation_lcera = null;
		this._fIsOutroElectricityRingAnimating_bl = null;
		
		this._fLightningBurstAnimation_lclba = null;
		this._fIsIntroLightningBurstAnimating_bl = null;
		this._fIsOutroLightningBurstAnimating_bl = null;
		
		this._fLighthingGlowIndigo_spr = null;
		this._fIsIntroLighthingGlowIndigoAnimating_bl = null;
		this._fLighthingGlowIndigoWiggle_s = null;
		this._fIsOutroLighthingGlowIndigoAnimating_bl = null;
		
		this._fCapsuleIconStartTimer_t = null;
		this._fCapsuleLightningIconDeathAnimation_clida = null;
		this._fIsCapsuleLightningIconDeathAnimating_bl = null;
		
		this._fCapsuleStartTimer_t = null;
		this._fCapsuleLightning_spr = null;
		
		this._fCapsuleLightningExplodeTimer_t = null;
		this._fCapsuleLightningExplodeAnimation_clea = null;
		this._fIsLightningExplodeOutroAnimating_bl = null;
		
		this._fLightningOrbAnimation_spr = null;
		this._fLightningOrbWiggle_s = null;
		this._fIsOutroLightningOrbAnimating_bl = null;
		
		this._fExtraEletricityStartTimer_t = null;
		this._fExtraEletricityAnimation_lceea = null;
		this._fIsOutroExtraElectricityAnimating_bl = null;

		this._fIsNeedSimpleDeathAnimation_bl = null;
		this._fIsOutroDeathAnimationStarted_bl = null;
	}

	getSpineSpeed()
	{
		let lSpeed_num = 0.5;
		return lSpeed_num
	}

	_playDeathFxAnimation(aIsInstantKill_bl)
	{
		if (this.isDisappearingStarted)
		{
			return;
		}

		if (this.deathReason != 1 && !aIsInstantKill_bl)
		{
			this._fIsNeedSimpleDeathAnimation_bl = false;
			this._startDisappearingAnimation();
		}
		else
		{
			this._fIsNeedSimpleDeathAnimation_bl = true;
			super._playDeathFxAnimation(aIsInstantKill_bl);
		}
	}

	__tryToFinishDeathFxAnimation()
	{
		if (
			this._fIsNeedSimpleDeathAnimation_bl
			&& (!this.__fBonusWin_bwcfa || !this.__fBonusWin_bwcfa.isAnimationProgress)
		)
		{
			this.emit(Enemy.EVENT_ON_DEATH_COIN_AWARD);
			this.onDeathFxAnimationCompleted();
		}
	}

	_startDisappearingAnimation()
	{
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startLightningBlueGlowOnceAnimation();
			this._startLightningBlueGlowLoopAnimation();
			this._startOpticalFlareCyan();
			this._startElectricityRingIntroAnimation();
			this._startLightningBurstIntroAnimation();
			this._startExtraEletricityAnimation();
			this._startLighthingGlowIndigoAnimation();
		}

		this._startCapsuleIconAnimation();
		this._startCapsuleLightning();
		this._startLightningExplode();
		this._startLightningOrb();
	}

	_onEnemyHitAnimationCompleted(e)
	{
		if (e.capsuleId != this.id)
		{
			return;
		}

		APP.gameScreen.lightningCapsuleFeatureController.off(LightningCapsuleFeatureController.EVENT_ON_HIT_ANIMATION_COMPLETED, this._onEnemyHitAnimationCompleted, this);

		this._startOutroAnimation();
	}

	_startOutroAnimation()
	{
		this._fIsOutroDeathAnimationStarted_bl = true;

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startLighthingGlowIndigoOutroAnimation();
			this._startLightningBlueGlowOutroAnimation();
			this._startOutroOpticalFlareCyan();
			this._startElectricityRingOutroAnimation();
			this._startLightningBurstOutroAnimation();
			this._startExtraElectricityOutroAnimation();
		}
		
		this._startLightningOrbOutroAnimation();
		this._startOutroLightningExplode();
	}

	_startOpticalFlareCyan()
	{
		this._fOpticalFlareCyan_ofc = new OpticalFlareCyan();
		this._fOpticalFlareCyan_ofc.i_startAnimation();
	}

	_startOutroOpticalFlareCyan()
	{
		if (!this._fOpticalFlareCyan_ofc)
		{
			return;
		}

		this._fIsOutroOpticalFlareCyanAnimating_bl = true;
		this._fOpticalFlareCyan_ofc.once(LightningCapsuleElectricityRingAnimation.EVENT_ON_OUTRO_ANIMATION_ENDED, this._onOutroOpticalFlareCyanAnimationCompleted, this);
		this._fOpticalFlareCyan_ofc.i_startOutroAnimation();
	}

	_onOutroOpticalFlareCyanAnimationCompleted()
	{
		this._fIsOutroOpticalFlareCyanAnimating_bl = false;
		this._onDeathFxOutroAnimationCompletedSuspision();
	}

	_startLightningBlueGlowOnceAnimation()
	{
		let lLightningBlueGlowOnce_spr = this._fLightningBlueGlowOnce_spr = this._fFXBlueGlowContainer_spr.addChild(APP.library.getSprite('enemies/lightning_capsule/death/capsule_lightning_blue_glow'));
		lLightningBlueGlowOnce_spr.aplha = 0;
		lLightningBlueGlowOnce_spr.position.y = -56;
		lLightningBlueGlowOnce_spr.scale.set(0.6);

		let l_seq = [
			{tweens: [], duration: 4*FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0.35}], duration: 0*FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 2.59}, {prop: 'scale.y', to: 2.59}, {prop: 'alpha', to: 0.35}], duration: 2*FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 6}, {prop: 'scale.y', to: 6}, {prop: 'alpha', to: 0.35}], duration: 5*FRAME_RATE},
			{tweens: [], duration: 1*FRAME_RATE,
				onfinish: ()=>{
				this._fLightningBlueGlowOnce_spr && this._fLightningBlueGlowOnce_spr.destroy();
				this._fIsIntroLightningBlueGlowOnceAnimating_bl = false;
				this._onDeathFxIntroAnimationCompletedSuspision();
			}}
		]
		this._fIsIntroLightningBlueGlowOnceAnimating_bl = true;
		Sequence.start(lLightningBlueGlowOnce_spr, l_seq);
	}

	_startLightningBlueGlowLoopAnimation()
	{
		let lLightningBlueGlow_spr = this._fLightningBlueGlow_spr = this._fFXBlueGlowContainer_spr.addChild(APP.library.getSprite('enemies/lightning_capsule/death/capsule_lightning_blue_glow'));
		lLightningBlueGlow_spr.aplha = 0;
		lLightningBlueGlow_spr.position.y = -56;

		let l_seq = [
			{tweens: [], duration: 12*FRAME_RATE}, 
			{tweens: [{prop: 'scale.x', to: 2.04}, {prop: 'scale.y', to: 2.04}, {prop: 'alpha', to: 0.65}], duration: 0*FRAME_RATE}, 
			{tweens: [{prop: 'scale.x', to: 12}, {prop: 'scale.y', to: 12}, {prop: 'alpha', to: 0.7}], duration: 4*FRAME_RATE,
			onfinish: ()=>{
				this._fIsIntroLightningBlueGlowAnimating_bl = false;
				this._onDeathFxIntroAnimationCompletedSuspision();
			}},
			{tweens: [ {prop: 'alpha', to: 0.78}], duration: 4*FRAME_RATE,
				onfinish: ()=>{
				this._startLightningBlueGlowWiggleAnimation();
			}}
		]
		this._fIsIntroLightningBlueGlowAnimating_bl = true;
		Sequence.start(lLightningBlueGlow_spr, l_seq);
	}

	_startLightningBlueGlowWiggleAnimation() 
	{
		let l_seq = [
			{tweens: [
					{prop: 'alpha', to: Utils.getRandomWiggledValue(0.78, 0.12)} 
					],
					duration: 6 * FRAME_RATE,
				onfinish: ()=>{
					this._fLightningBlueGlowWiggle_s && this._fLightningBlueGlowWiggle_s.destructor();
					this._startLightningBlueGlowWiggleAnimation();
			}}
		]

		this._fLightningBlueGlowWiggle_s = Sequence.start(this._fLightningBlueGlow_spr, l_seq);
	}

	_startLightningBlueGlowOutroAnimation()
	{
		if (!this._fLightningBlueGlow_spr)
		{
			return;
		}

		this._fLightningBlueGlowWiggle_s && this._fLightningBlueGlowWiggle_s.destructor();

		let lLightningBlueGlow_spr = this._fLightningBlueGlow_spr;

		let l_seq = [
			{tweens: [], duration: 3*FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 1}, {prop: 'scale.y', to: 1}, {prop: 'alpha', to: 0.05}], duration: 5*FRAME_RATE,
				onfinish: ()=>{
					lLightningBlueGlow_spr && lLightningBlueGlow_spr.destroy();
					this._fIsOutroLightningBlueGlowAnimating_bl = false;
					this._onDeathFxOutroAnimationCompletedSuspision();
			}}
		]

		this._fIsOutroLightningBlueGlowAnimating_bl = true;
		Sequence.start(lLightningBlueGlow_spr, l_seq);
	}

	_startElectricityRingIntroAnimation()
	{
		this._fElectricityRingAnimation_lcera = this._fMiddleTopontainer_spr.addChild(new LightningCapsuleElectricityRingAnimation());
		this._fElectricityRingAnimation_lcera.zIndex = 20;
		this._fElectricityRingAnimation_lcera.position.set(-14, -56);
		this._fElectricityRingAnimation_lcera.i_startIntroAnimation();
	}

	_startElectricityRingOutroAnimation()
	{
		if (!this._fElectricityRingAnimation_lcera)
		{
			return;
		}

		this._fIsOutroElectricityRingAnimating_bl = true;
		this._fElectricityRingAnimation_lcera.once(LightningCapsuleElectricityRingAnimation.EVENT_ON_OUTRO_ANIMATION_ENDED, this._onOutroElectricityRingAnimationCompleted, this);
		this._fElectricityRingAnimation_lcera.i_startOutroAnimation();
	}

	_onOutroElectricityRingAnimationCompleted()
	{
		this._fElectricityRingAnimation_lcera && this._fElectricityRingAnimation_lcera.destroy();
		this._fIsOutroElectricityRingAnimating_bl = false;
		this._onDeathFxOutroAnimationCompletedSuspision();
	}

	_startLightningBurstIntroAnimation()
	{
		this._fLightningBurstAnimation_lclba = this._fFXLightningBurstContainer_spr.addChild(new LightningCapsuleLightningBurstAnimation());
		this._fLightningBurstAnimation_lclba.zIndex = 20;
		this._fLightningBurstAnimation_lclba.position.set(-6, -52);
		this._fLightningBurstAnimation_lclba.once(LightningCapsuleLightningBurstAnimation.EVENT_ON_INTRO_ANIMATION_ENDED, this._onIntroLightningBurstAnimationCompleted, this);
		this._fIsIntroLightningBurstAnimating_bl = true;
		this._fLightningBurstAnimation_lclba.i_startIntroAnimation();
	}

	_startLightningBurstOutroAnimation()
	{
		if (!this._fLightningBurstAnimation_lclba)
		{
			return;
		}

		this._fIsOutroLightningBurstAnimating_bl = true;
		this._fLightningBurstAnimation_lclba.once(LightningCapsuleLightningBurstAnimation.EVENT_ON_OUTRO_ANIMATION_ENDED, this._onOutroLightningBurstAnimationCompleted, this);
		this._fLightningBurstAnimation_lclba.i_startOutroAnimation();
	}

	_onOutroLightningBurstAnimationCompleted()
	{
		this._fIsOutroLightningBurstAnimating_bl = false;
		this._onDeathFxOutroAnimationCompletedSuspision();
	}


	_startLighthingGlowIndigoAnimation()
	{
		let lLighthingGlowIndigo_spr = this._fLighthingGlowIndigo_spr= this._fBottomContainer_sprt.addChild(APP.library.getSprite('enemies/lightning_capsule/death/lightning_glow_indigo'));

		lLighthingGlowIndigo_spr.aplha = 0;
		lLighthingGlowIndigo_spr.scale.set(2.38, 2.38); //1.19*2
		lLighthingGlowIndigo_spr.position.x = 6;
		lLighthingGlowIndigo_spr.position.y = -92;

		let l_seq = [
			{tweens: [], duration: 6*FRAME_RATE}, 
			{tweens: [{prop: 'alpha', to: 0.9}], duration: 0*FRAME_RATE},  //6:13 1,36   78
			{tweens: [], duration: 4*FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 6.48}, {prop: 'scale.y', to: 6.48}], duration: 6*FRAME_RATE, //3.24*2
			onfinish: ()=>{
				this._fIsIntroLighthingGlowIndigoAnimating_bl = false;
				this._onDeathFxIntroAnimationCompletedSuspision();
			}},
			{tweens: [{prop: 'scale.x', to: 2.72}, {prop: 'scale.y', to: 2.72}], duration: 78*FRAME_RATE} //1.36*2
		]
		this._fIsIntroLighthingGlowIndigoAnimating_bl = true;
		Sequence.start(lLighthingGlowIndigo_spr, l_seq);

		this.startLighthingGlowIndigoWiggleAnimation()
	}

	startLighthingGlowIndigoWiggleAnimation()
	{
		let l_seq = [
			{tweens: [
					{prop: 'scale.x', to: Utils.getRandomWiggledValue(1, 0.1)}, 
					{prop: 'scale.y', to: Utils.getRandomWiggledValue(1, 0.1)},
					{prop: 'alpha', to: Utils.getRandomWiggledValue(0.87, 0.13)}],
					duration: 6 * FRAME_RATE,
			onfinish: ()=>{
				this._fBottomContainer_sprt && Sequence.destroy(Sequence.findByTarget(this._fBottomContainer_sprt));
				this.startLighthingGlowIndigoWiggleAnimation();
			}} 
		];

		this._fLighthingGlowIndigoWiggle_s = Sequence.start(this._fBottomContainer_sprt, l_seq);
	}

	_startLighthingGlowIndigoOutroAnimation()
	{
		this._fLighthingGlowIndigoWiggle_s && this._fLighthingGlowIndigoWiggle_s.destructor();

		if (!this._fLighthingGlowIndigo_spr)
		{
			return;
		}

		let l_seq = [
			{tweens: [], duration: 5*FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 8.88}, {prop: 'scale.y', to: 8.88}], duration: 8*FRAME_RATE, //4.44*2
			onfinish: ()=>{
				this._fLighthingGlowIndigo_spr && Sequence.destroy(Sequence.findByTarget(this._fLighthingGlowIndigo_spr));
				this._fLighthingGlowIndigo_spr && this._fLighthingGlowIndigo_spr.destroy();
				this._fIsOutroLighthingGlowIndigoAnimating_bl = false;
				this._onDeathFxOutroAnimationCompletedSuspision();
			}}
		]

		this._fIsOutroLighthingGlowIndigoAnimating_bl = true;
		Sequence.start(this._fLighthingGlowIndigo_spr, l_seq);
	}

	_startCapsuleIconAnimation()
	{
		this._fCapsuleIconStartTimer_t = new Timer(()=>{

			this._fCapsuleLightningIconDeathAnimation_clida = this._fFXIconContainer_spr.addChild(new LightningCapsuleLightningIconDeathAnimation());
			this._fCapsuleLightningIconDeathAnimation_clida.once(LightningCapsuleLightningIconDeathAnimation.EVENT_ON_ANIMATION_ENDED, this._onCapsuleLightningIconDeathAnimationCompleted, this);
			this._fIsCapsuleLightningIconDeathAnimating_bl = true;
			this._fCapsuleLightningIconDeathAnimation_clida.i_startAnimation();

			this._fCapsuleIconStartTimer_t && this._fCapsuleIconStartTimer_t.destructor();

		}, 3*FRAME_RATE, true);	
	}

	_startCapsuleLightning()
	{
		this._fCapsuleStartTimer_t = new Timer(()=>{

				let lCapsuleLightning_spr = this._fCapsuleLightning_spr = this._fMiddleTopontainer_spr.addChild(APP.library.getSprite('enemies/lightning_capsule/death/capsule_lightning'));
				lCapsuleLightning_spr.blendMode = PIXI.BLEND_MODES.ADD;
				lCapsuleLightning_spr.position.y = -74;
				lCapsuleLightning_spr.scale.set(0.24, 0.265); //0.48/2, 0.53/2
				lCapsuleLightning_spr.alpha = 1;

				let l_seq = [
					{tweens: [{prop: 'scale.x', to: 0.92}, {prop: 'scale.y', to: 1.03}, {prop: 'alpha', to: 1}], duration: 5*FRAME_RATE}, //1.84/2   2.06/2
					{tweens: [{prop: 'scale.x', to: 1.175}, {prop: 'scale.y', to: 1.315}, {prop: 'alpha', to: 0.1}], duration: 8*FRAME_RATE,	//2.35/2   2.63/2	
						onfinish: ()=>{
						this._fCapsuleLightning_spr && this._fCapsuleLightning_spr.destroy();
					}}
				]
				Sequence.start(lCapsuleLightning_spr, l_seq);

				this._fCapsuleStartTimer_t && this._fCapsuleStartTimer_t.destructor();

		}, 6*FRAME_RATE, true);
	}

	_startLightningExplode()
	{
		this._fCapsuleLightningExplodeTimer_t = new Timer(()=>{

			this._fCapsuleLightningExplodeAnimation_clea = this._fFXTopContainer_spr.addChild(new LightningCapsuleLightningExplodeAnimation());
			this._fCapsuleLightningExplodeAnimation_clea.i_startIntroAnimation();

			this._fCapsuleLightningExplodeTimer_t && this._fCapsuleLightningExplodeTimer_t.destructor();

		}, 10*FRAME_RATE, true);
	}

	_startOutroLightningExplode()
	{
		if (!this._fCapsuleLightningExplodeAnimation_clea)
		{
			return;
		}

		this._fIsLightningExplodeOutroAnimating_bl = true;
		this._fCapsuleLightningExplodeAnimation_clea.once(LightningCapsuleLightningExplodeAnimation.EVENT_ON_OUTRO_ANIMATION_ENDED, this._onLightningCapsuleLightningExplodeOutroAnimationCompleted, this);
		this._fCapsuleLightningExplodeAnimation_clea.i_startOutroAnimation();
	}

	_onLightningCapsuleLightningExplodeOutroAnimationCompleted()
	{
		this._fIsLightningExplodeOutroAnimating_bl = false;
		this._onDeathFxOutroAnimationCompletedSuspision();
	}

	_getLightningOrbSprite()
	{
		return this._fLightningOrbAnimation_spr || (this._fLightningOrbAnimation_spr = this._initLightningOrbSprite());
	}

	_initLightningOrbSprite()
	{
		let anim = this._fLightningOrbAnimation_spr = this._fLightningOrbContainer_spr.addChild(new Sprite());
		anim.textures = _lightning_orb_textures;
		anim.animationSpeed = 0.2; //12/60
		anim.position.y = -60;
		anim.position.x = 3;
		anim.scale.set(1, 1);

		return anim;
	}

	_startLightningOrb()
	{
		let anim = this._getLightningOrbSprite();
		anim.zIndex = APP.gameScreen.gameFieldController.lightningCapsuleOrbContainer.zIndex;
		anim.play();

		let l_seq = [
			{tweens: [], duration: 8 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 0.94}, {prop: 'scale.y', to: 1.32}, {prop: 'alpha', to: 1}], duration: 3 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 2.212}, {prop: 'scale.y', to: 2.25}], ease: Easing.quadratic.easeInOut, duration: 4 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 1.8}, {prop: 'scale.y', to: 1.8}], ease: Easing.quadratic.easeInOut, duration: 5 * FRAME_RATE,
			onfinish: ()=>{
				this._onLightningOrbIntroAnimationCompleted();
			}}
		];

		Sequence.start(this._fLightningOrbContainer_spr, l_seq);
	}

	_onLightningOrbIntroAnimationCompleted()
	{
		this._startLightningOrbWiggleAnimation();
	}

	_startLightningOrbWiggleAnimation()
	{
		let l_seq = [
			{tweens: [
					{prop: 'scale.x', to: Utils.getRandomWiggledValue(1.82, 0.05)},
					{prop: 'scale.y', to: Utils.getRandomWiggledValue(1.89, 0.09)},
					], duration: 7 * FRAME_RATE,
			onfinish: ()=>{
				this._fLightningOrbWiggle_s && this._fLightningOrbWiggle_s.destructor();
				this._startLightningOrbWiggleAnimation();	
			}} 
		];

		this._fLightningOrbWiggle_s = Sequence.start(this._fLightningOrbContainer_spr, l_seq);
	}

	_startLightningOrbOutroAnimation()
	{
		this._fIsOutroLightningOrbAnimating_bl = true;
		this._fLightningOrbWiggle_s && this._fLightningOrbWiggle_s.destructor();
		let lLightningOrb_spr = this._getLightningOrbSprite();

		let l_seq = [
			{tweens: [{prop: 'scale.x', to: 0.82}, {prop: 'scale.y', to: 0.85}], duration: 3 * FRAME_RATE,
			onfinish: ()=>{
				this._fIsOutroLightningOrbAnimating_bl = false;
				lLightningOrb_spr && lLightningOrb_spr.destroy();
				this._onDeathFxOutroAnimationCompletedSuspision();
			}}
		];

		Sequence.start(this._fLightningOrbContainer_spr, l_seq);
	}

	_startExtraEletricityAnimation()
	{
		this._fExtraEletricityStartTimer_t = new Timer(()=>{

			this._fExtraEletricityAnimation_lceea = this._fFXTopContainer_spr.addChild(new LightningCapsuleExtraEletricityAnimation());
		
			this._fExtraEletricityAnimation_lceea.i_startIntroAnimation();
			this._fExtraEletricityAnimation_lceea.position.x = 40;
			this._fExtraEletricityAnimation_lceea.position.y = 100;

			this._fExtraEletricityStartTimer_t && this._fExtraEletricityStartTimer_t.destructor();

		}, 10*FRAME_RATE, true);
	}

	_startExtraElectricityOutroAnimation()
	{
		if (!this._fExtraEletricityAnimation_lceea)
		{
			return;
		}

		this._fIsOutroExtraElectricityAnimating_bl = true;
		this._fExtraEletricityAnimation_lceea.once(LightningCapsuleExtraEletricityAnimation.EVENT_ON_ANIMATION_ENDED, this._onLightningCapsuleExtraEletricityOutroAnimationCompleted, this);
		this._fExtraEletricityAnimation_lceea.i_startOutroAnimation();
	}

	_onLightningCapsuleExtraEletricityOutroAnimationCompleted()
	{
		this._fExtraEletricityAnimation_lceea && this._fExtraEletricityAnimation_lceea.destroy();
		this._fIsOutroExtraElectricityAnimating_bl = false;
		this._onDeathFxOutroAnimationCompletedSuspision();
	}	

	_onCapsuleLightningIconDeathAnimationCompleted()
	{
		this.spineView.alpha = 0;
		this._fIsCapsuleLightningIconDeathAnimating_bl = false;
		this._onDeathFxIntroAnimationCompletedSuspision();
	}

	_onIntroLightningBurstAnimationCompleted()
	{
		this._fIsIntroLightningBurstAnimating_bl = false;
		this._onDeathFxIntroAnimationCompletedSuspision();
	}

	_onDeathFxIntroAnimationCompletedSuspision()
	{
		if (!this._fIsIntroLightningBlueGlowOnceAnimating_bl
			&& !this._fIsIntroLightningBlueGlowAnimating_bl
			&& !this._fIsIntroLightningBurstAnimating_bl
			&& !this._fIsIntroLighthingGlowIndigoAnimating_bl
			&& !this._fIsCapsuleLightningIconDeathAnimating_bl
			)
		{
			APP.gameScreen.lightningCapsuleFeatureController.on(LightningCapsuleFeatureController.EVENT_ON_HIT_ANIMATION_COMPLETED, this._onEnemyHitAnimationCompleted, this);
			APP.gameScreen.lightningCapsuleFeatureController.startAnimation(this.position, this.id);
		}
	}

	__onBonusAnimationCompleted()
	{
		this.__fBonusWin_bwcfa && this.__fBonusWin_bwcfa.destroy();

		if (this._fIsOutroDeathAnimationStarted_bl)
		{
			this._onDeathFxOutroAnimationCompletedSuspision();
		}
	}

	_onDeathFxOutroAnimationCompletedSuspision()
	{
		if (!this._fIsOutroLightningOrbAnimating_bl
			&& !this._fIsOutroLighthingGlowIndigoAnimating_bl
			&& !this._fIsOutroExtraElectricityAnimating_bl
			&& !this._fIsOutroLightningBlueGlowAnimating_bl
			&& !this._fIsOutroLightningBurstAnimating_bl
			&& !this._fIsOutroElectricityRingAnimating_bl
			&& !this._fIsOutroOpticalFlareCyanAnimating_bl
			&& !this._fIsLightningExplodeOutroAnimating_bl
			&& !(this.__fBonusWin_bwcfa && this.__fBonusWin_bwcfa.isAnimationProgress)
		)
		{
			this.emit(Enemy.EVENT_ON_DEATH_COIN_AWARD);
			this.onDeathFxAnimationCompleted();
		}
	}

	get __maxCrosshairDeviationOnEnemyX() //maximum deviation in X position of the cursor on the body of the enemy
	{
		return 52;
	}

	get __maxCrosshairDeviationOnEnemyY() //maximum deviation in Y position of the cursor on the body of the enemy
	{
		return 65;
	}

	destroy(purely)
	{
		super.destroy(purely);
		
		this._fCapsuleIconStartTimer_t && this._fCapsuleIconStartTimer_t.destructor();
		this._fCapsuleIconStartTimer_t = null;

		this._fCapsuleStartTimer_t && this._fCapsuleStartTimer_t.destructor();
		this._fCapsuleStartTimer_t = null;

		this._fCapsuleLightningExplodeTimer_t && this._fCapsuleLightningExplodeTimer_t.destructor();
		this._fCapsuleLightningExplodeTimer_t = null;

		this.fExtraEletricityStartTimer_t && this.fExtraEletricityStartTimer_t.destructor();
		this.fExtraEletricityStartTimer_t = null;
		
		this._fOpticalFlareCyan_ofc && this._fOpticalFlareCyan_ofc.destroy();
		this._fIsOutroOpticalFlareCyanAnimating_bl = null;

		this._fLightningBlueGlowOnce_spr && Sequence.destroy(Sequence.findByTarget(this._fLightningBlueGlowOnce_spr));
		this._fLightningBlueGlowOnce_spr && this._fLightningBlueGlowOnce_spr.destroy();
		this._fLightningBlueGlowOnce_spr = null;
		this._fIsIntroLightningBlueGlowOnceAnimating_bl = null;

		this._fLightningBlueGlow_spr && Sequence.destroy(Sequence.findByTarget(this._fLightningBlueGlow_spr));
		this._fLightningBlueGlow_spr && this._fLightningBlueGlow_spr.destroy();
		this._fLightningBlueGlow_spr = null;
		this._fIsIntroLightningBlueGlowAnimating_bl = null;
		this._fLightningBlueGlowWiggle_s && this._fLightningBlueGlowWiggle_s.destructor();
		this._fIsOutroLightningBlueGlowAnimating_bl = null;

		this._fElectricityRingAnimation_lcera && this._fElectricityRingAnimation_lcera.destroy();
		this._fElectricityRingAnimation_lcera = null;
		this._fIsOutroElectricityRingAnimating_bl = null;

		this._fLightningBurstAnimation_lclba && this._fLightningBurstAnimation_lclba.destroy();
		this._fLightningBurstAnimation_lclba = null;
		this._fIsIntroLightningBurstAnimating_bl = null;
		this._fIsOutroLightningBurstAnimating_bl = null;
		
		this._fLighthingGlowIndigo_spr && Sequence.destroy(Sequence.findByTarget(this._fLighthingGlowIndigo_spr));
		this._fLighthingGlowIndigo_spr && this._fLighthingGlowIndigo_spr.destroy();
		this._fLighthingGlowIndigo_spr = null;
		this._fIsIntroLighthingGlowIndigoAnimating_bl = null;
		this._fLighthingGlowIndigoWiggle_s && this._fLighthingGlowIndigoWiggle_s.destructor();
		this._fLighthingGlowIndigoWiggle_s = null;
		this._fIsOutroLighthingGlowIndigoAnimating_bl = null;

		this._fCapsuleLightningIconDeathAnimation_clida && this._fCapsuleLightningIconDeathAnimation_clida.destroy();
		this._fCapsuleLightningIconDeathAnimation_clida = null;
		this._fIsCapsuleLightningIconDeathAnimating_bl = null;

		this._fCapsuleLightning_spr && Sequence.destroy(Sequence.findByTarget(this._fCapsuleLightning_spr));
		this._fCapsuleLightning_spr && this._fCapsuleLightning_spr.destroy();
		this._fCapsuleLightning_spr = null;

		this._fCapsuleLightningExplodeAnimation_clea && this._fCapsuleLightningExplodeAnimation_clea.destroy();
		this._fCapsuleLightningExplodeAnimation_clea = null;
		this._fIsLightningExplodeOutroAnimating_bl = null;

		this._fLightningOrbWiggle_s && this._fLightningOrbWiggle_s.destructor();
		this._fLightningOrbWiggle_s = null;
		this._fLightningOrbAnimation_spr && this._fLightningOrbAnimation_spr.destroy();
		this._fLightningOrbAnimation_spr = null;
		this._fLightningOrbContainer_spr && Sequence.destroy(Sequence.findByTarget(this._fLightningOrbContainer_spr));
		this._fLightningOrbContainer_spr = null;
		this._fIsOutroLightningOrbAnimating_bl = null;

		this._fExtraEletricityAnimation_lceea && this._fExtraEletricityAnimation_lceea.destroy();
		this._fExtraEletricityAnimation_lceea = null;
		this._fIsOutroExtraElectricityAnimating_bl = null;

		this._fBottomContainer_sprt && Sequence.destroy(Sequence.findByTarget(this._fBottomContainer_sprt));
	}

}

export default LightningCapsule;