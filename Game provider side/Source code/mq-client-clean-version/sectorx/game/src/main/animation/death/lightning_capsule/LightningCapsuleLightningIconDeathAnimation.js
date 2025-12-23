import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import AtlasSprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import AtlasConfig from '../../../../config/AtlasConfig';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../../shared/src/CommonConstants';
import { Sequence } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import { Utils } from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';

export let _electricity_ring_textures = null;
export function _generateElectricityRingTextures()
{
	if (_electricity_ring_textures) return;

	_electricity_ring_textures = AtlasSprite.getFrames(
		[
			APP.library.getAsset("enemies/lightning_capsule/death/electricity_ring/electricity_ring_0"),
			APP.library.getAsset("enemies/lightning_capsule/death/electricity_ring/electricity_ring_1"),
		], 
		[
			AtlasConfig.LightningCapsuleElectricityRing1,
			AtlasConfig.LightningCapsuleElectricityRing2
		],
		"");
}

class LightningCapsuleLightningIconDeathAnimation extends Sprite
{
	static get EVENT_ON_ANIMATION_ENDED()				{return "onAnimationEnded";}

	i_startAnimation()
	{
		this._startAnimation();
	}

	constructor()
	{
		super();

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			_generateElectricityRingTextures();
		}

		this._fMainContainer_spr = this.addChild(new Sprite());
		this._fMainContainer_spr.scale.set(0.41, 0.41);
		this._fMainContainer_spr.position.y = -100;
		this._fMainContainer_spr.position.x = 3;
		this._fFXContainer_spr = this._fMainContainer_spr.addChild(new Sprite());
		this._fSecondFXContainer_spr = this._fFXContainer_spr.addChild(new Sprite());
		this._fContainerWiggle_s = null;

		this._fBulb_spr = null;
		this._fOutside_spr = null;

		this._fDarken_spr = null;
		this._fDrakenWiggle_s = null;

		this._fIsFXContainerAnimating_bl = null;

		this._fElectricityRingAnimation = null;
	}

	_startAnimation()
	{
		this._startFXMainContainerAnimation();

		this._startFXContainerAnimation();
		
		this._fBulb_spr= this._fSecondFXContainer_spr.addChild(APP.library.getSprite('enemies/lightning_capsule/death/capsule_lightning_icon_bulb'));

		this._startDarkenAnimation();
		this._startLightningAnimation();

		this._fOutside_spr= this._fSecondFXContainer_spr.addChild(APP.library.getSprite('enemies/lightning_capsule/death/capsule_lightning_icon_outside'));

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startElectricityRingAnimation();
			this._startGlowIndigoAnimation();
		}
	}

	_startFXMainContainerAnimation()
	{
		let l_seq = [
			{tweens: [], duration: 5*FRAME_RATE}, 
			{tweens: [{prop: 'alpha', to: 0}], duration: 5 * FRAME_RATE,
			onfinish: ()=>{
				this._fIsMainContainerAnimating_bl = false;
				this._onMainFXContainerAnimationCompleted();
				this._startSecondFXContainerLoopAnimation();
			}}
		];

		this._fIsMainContainerAnimating_bl = true;
		Sequence.start(this._fMainContainer_spr, l_seq);
	}

	_startFXContainerAnimation()
	{
		let l_seq = [
			{tweens: [{prop: 'scale.x', to: 1.025}, {prop: 'scale.y', to: 1.44}], duration: 2 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 1.288}, {prop: 'scale.y', to: 1.31}], duration: 2 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 1.394}, {prop: 'scale.y', to: 1.67}], duration: 5 * FRAME_RATE,
			onfinish: ()=>{
				this._startSecondFXContainerLoopAnimation();
			}}
		];

		this._fIsFXContainerAnimating_bl = true;
		Sequence.start(this._fFXContainer_spr, l_seq);
	}

	_startSecondFXContainerLoopAnimation()
	{
		let l_seq = [
			{tweens: [
					{prop: 'scale.x', to: Utils.getRandomWiggledValue(0.975, 0.075)}, 
					{prop: 'scale.y', to: Utils.getRandomWiggledValue(1.015, 0.055)}],
					duration: 8 * FRAME_RATE,
				onfinish: ()=>{
					this._fContainerWiggle_s && this._fContainerWiggle_s.destructor();
					this._startSecondFXContainerLoopAnimation();
			}}
		]

		this._fContainerWiggle_s = Sequence.start(this._fSecondFXContainer_spr, l_seq);
	}

	_startDarkenAnimation()
	{
		let lDarken_spr = this._fDarken_spr= this._fSecondFXContainer_spr.addChild(APP.library.getSprite('enemies/lightning_capsule/death/capsule_lightning_icon_darken'));
		lDarken_spr.position.x = -9;

		this._startDarkenLoopAnimation();
	}

	_startDarkenLoopAnimation()
	{
		let l_seq = [
			{tweens: [{prop: 'alpha', to:Utils.getRandomWiggledValue(0.7, 0.3)}], duration: 7 * FRAME_RATE,
			onfinish: ()=>{
				this._fDrakenWiggle_s && this._fDrakenWiggle_s.destructor();
				this._startDarkenLoopAnimation();
			}} 
		];

		this._fDrakenWiggle_s = Sequence.start(this._fDarken_spr, l_seq);
	}

	_startLightningAnimation()
	{
		this._fCapsuleLightning_spr = this._fSecondFXContainer_spr.addChild(APP.library.getSprite('enemies/lightning_capsule/death/capsule_lightning'));
		this._fCapsuleLightning_spr.blendMode = PIXI.BLEND_MODES.ADD;
		this._fCapsuleLightning_spr. alpha = 1;
		let l_seq = [
			{tweens: [], duration: 9 * FRAME_RATE,
			onfinish: ()=>{
				this._fCapsuleLightning_spr. alpha = 0;
			}} 
		];

		Sequence.start(this._fCapsuleLightning_spr, l_seq);
	}


	_startElectricityRingAnimation()
	{
		let anim = this._fElectricityRingAnimation = this._fSecondFXContainer_spr.addChild(new Sprite());
		anim.textures = _electricity_ring_textures;
		anim.blendMode = PIXI.BLEND_MODES.ADD;
		anim.animationSpeed = 0.2; //12/60
		anim.scale.set(2.22, 2.22);
		anim.position.x = -8;
		
		anim.loop = true;
		anim.play();
	}

	_startGlowIndigoAnimation()
	{
		this._fLighthingGlowIndigo_spr= this._fSecondFXContainer_spr.addChild(APP.library.getSprite('enemies/lightning_capsule/death/lightning_glow_indigo'));
		this._fLighthingGlowIndigo_spr.scale.set(1.2, 1.4);
		this._fLighthingGlowIndigo_spr.alpha = 0.5;
		this._startGlowIndigoLoopAnimation();
	}

	_startGlowIndigoLoopAnimation()
	{
		let l_seq = [
			{tweens: [
					{prop: 'scale.x', to: Utils.getRandomWiggledValue(0.6, 0.08)},
				 	{prop: 'scale.y', to: Utils.getRandomWiggledValue(0.7, 0.08)}, 
					{prop: 'alpha', to: Utils.getRandomWiggledValue(0.5, 0.1)}], 
					duration: 8 * FRAME_RATE,
			onfinish: ()=>{
				this._startGlowIndigoLoopAnimation();
			}} 
		];

		Sequence.start(this._fLighthingGlowIndigo_spr, l_seq);
	}


	_onMainFXContainerAnimationCompleted()
	{
		if (!this._fIsMainContainerAnimating_bl)
		{
			this.emit(LightningCapsuleLightningIconDeathAnimation.EVENT_ON_ANIMATION_ENDED);
		}
	}

	destroyAnimation()
	{
		this._fMainContainer_spr && Sequence.destroy(Sequence.findByTarget(this._fMainContainer_spr));
		this._fMainContainer_spr = null;

		this._fFXContainer_spr && Sequence.destroy(Sequence.findByTarget(this._fFXContainer_spr));
		this._fFXContainer_spr = null;

		this._fContainerWiggle_s && this._fContainerWiggle_s.destructor();

		this._fSecondFXContainer_spr && Sequence.destroy(Sequence.findByTarget(this._fSecondFXContainer_spr));
		this._fSecondFXContainer_spr = null;

		this._fDrakenWiggle_s && this._fDrakenWiggle_s.destructor();

		this._fDarken_spr && Sequence.destroy(Sequence.findByTarget(this._fDarken_spr));
		this._fDarken_spr = null;

		this._fElectricityRingAnimation && this._fElectricityRingAnimation.destroy();
		this._fElectricityRingAnimation = null;

		this._fLighthingGlowIndigo_spr && Sequence.destroy(Sequence.findByTarget(this._fLighthingGlowIndigo_spr));
		this._fLighthingGlowIndigo_spr = null;

		this._fCapsuleLightning_spr && Sequence.destroy(Sequence.findByTarget(this._fCapsuleLightning_spr));
		this._fCapsuleLightning_spr = null;

		this._fIsFXContainerAnimating_bl = null;
	}


	destroy()
	{
		this.destroyAnimation();

		super.destroy();
	}
}

export default LightningCapsuleLightningIconDeathAnimation;