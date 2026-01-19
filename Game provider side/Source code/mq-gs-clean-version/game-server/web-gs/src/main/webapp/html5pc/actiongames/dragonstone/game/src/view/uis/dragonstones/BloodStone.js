import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import StoneFragmentsView from './StoneFragmentsView';
import * as Easing from '../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { FRAME_RATE } from '../../../../../shared/src/CommonConstants';
import { Sequence } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import { Utils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import { AtlasSprite } from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/index';
import AtlasConfig from '../../../config/AtlasConfig';
import I18 from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
import DragonstonesAssets from './DragonstonesAssets';
import StoneHandFragmentsView from './StoneHandFragmentsView';

class BloodStone extends Sprite
{
	static get EVENT_ON_STONE_LANDING_ANIMATION_COMPLETED()		{return 'EVENT_ON_STONE_LANDING_ANIMATION_COMPLETED';}
	static get EVENT_ON_STONE_FLY_OUT_STARTED()					{return StoneFragmentsView.EVENT_ON_STONE_EYE_FLY_OUT_STARTED;}
	static get EVENT_ON_STONE_SCREEN_COVERED()					{return StoneFragmentsView.EVENT_ON_SCREEN_COVERED;}

	startFragmentLandingAnimation(aLandedFragmentId_num, aIsLastStoneFragment_bl = false)
	{
		this._stoneFragmentsView.addFragment(aLandedFragmentId_num);
		this._handFragmentsView.addFragment(aLandedFragmentId_num, aIsLastStoneFragment_bl);

		this._startFragmentLandingAnimation(aLandedFragmentId_num, aIsLastStoneFragment_bl);
	}

	updateFragments(aFragmentsAmount_num)
	{
		this._stoneFragmentsView.updateFragments(aFragmentsAmount_num);
		this._handFragmentsView.updateFragments(aFragmentsAmount_num);
	}

	interruptAnimation()
	{
		this._interruptAnimation();
	}

	get isAnimationInProgress()
	{
		return !!this._fIsAnimationInProgress_bl;
	}

	get isStoneFlyOutStarted()
	{
		return this._stoneFragmentsView.isFlyOutStarted;
	}

	get isScreenCovered()
	{
		return this._stoneFragmentsView.isScreenCovered;
	}

	getHandFragmentGlobalPosition(aFragmentId_num)
	{
		return this._handFragmentsView.getFragmentGlobalPosition(aFragmentId_num);
	}

	constructor()
	{
		super();

		BloodStone.initParticlesTexture();

		this._contentContainer = null;
		this._shakeContainer = null;
		this._stoneFragmentsView = null;
		this._handFragmentsView = null;
		this._bigFlare = null;
		this._orangeFlare = null;
		this._ticksCounter = 0;
		this._stoneHandGlow = null;
		this._fParticlesContainer = null;
		this._fIsAnimationInProgress_bl = false;
		this._sweep = null;
		this._stoneHand = null;
		this._fIsLastStoneFragment_bl = false;
		this._caption = null;

		DragonstonesAssets.initTextures();

		this._initView();
	}

	_initView()
	{
		let lContentCont_sprt = this._contentContainer = this.addChild(new Sprite);

		if (this._profilingInfo.isVfxProfileValueLowerOrGreater)
		{
			let lBigFlare = this._bigFlare = lContentCont_sprt.addChild(new Sprite);
			lBigFlare.textures = DragonstonesAssets['big_flare'];
			lBigFlare.scale.set(2);
			lBigFlare.blendMode = PIXI.BLEND_MODES.ADD;
			lBigFlare.y = 7;
			lBigFlare.visible = false;
		}

		let l_FragmentsFlyOutContainer_sprt = lContentCont_sprt.addChild(new Sprite);
		let lShakeCont_sprt = this._shakeContainer = lContentCont_sprt.addChild(new Sprite);

		let l_sfsv = this._stoneFragmentsView = lShakeCont_sprt.addChild(new StoneFragmentsView(l_FragmentsFlyOutContainer_sprt));
		l_sfsv.scale.set(-1.1, 1.1);
		l_FragmentsFlyOutContainer_sprt.scale.set(l_sfsv.scale.x, l_sfsv.scale.y);
		l_sfsv.on(StoneFragmentsView.EVENT_ON_STONE_EYE_FLY_OUT_STARTED, this._onStoneEyeFlyOutStarted, this);
		l_sfsv.on(StoneFragmentsView.EVENT_ON_SCREEN_COVERED, this._onScreenCovered, this);
		l_sfsv.on(StoneFragmentsView.EVENT_ON_LAST_FRAME_COLLECT_ANIMATIONS_COMPLETED, this._onLastFrameCollectAnimationCompleted, this);

		let lStoneHand = this._stoneHand = lShakeCont_sprt.addChild(new Sprite)
		lStoneHand.textures = DragonstonesAssets['stone_hand'];
		lStoneHand.scale.set(0.9)
		lStoneHand.anchor.set(0.52, 0.12);
		
		let lCaption = this._caption = lShakeCont_sprt.addChild(I18.generateNewCTranslatableAsset("TAFragmentsPanelCaption"));
		lCaption.y = 242;

		let lStoneHandGlow = this._stoneHandGlow = lShakeCont_sprt.addChild(new Sprite)
		lStoneHandGlow.textures = DragonstonesAssets['stone_hand_glow'];
		lStoneHandGlow.anchor.set(0.505, 0.20);
		lStoneHandGlow.scale.set(2*0.9);
		lStoneHandGlow.blendMode = PIXI.BLEND_MODES.ADD;
		lStoneHandGlow.alpha = 1;
		lStoneHandGlow.visible = false;

		let l_hfsv = this._handFragmentsView = lShakeCont_sprt.addChild(new StoneHandFragmentsView);
		l_hfsv.x = -1;
		l_hfsv.y = 220;
		
		let lOrangeFlare = this._orangeFlare = lContentCont_sprt.addChild(new Sprite);
		lOrangeFlare.textures = DragonstonesAssets['orange_flare'];
		lOrangeFlare.scale.set(2*0.9);
		lOrangeFlare.blendMode = PIXI.BLEND_MODES.ADD;
		lOrangeFlare.y = 45;
		lOrangeFlare.visible = false;

		this._fParticlesContainer = this._contentContainer.addChild(new Sprite);

		this._fIsAnimationInProgress_bl = false;
		this._fIsLastStoneFragment_bl = false;
	}

	_onStoneEyeFlyOutStarted(event)
	{
		this._interruptBigFlareAnimation();

		this.emit(BloodStone.EVENT_ON_STONE_FLY_OUT_STARTED);
	}

	_onScreenCovered(event)
	{
		this._interruptShake();

		this._sweep && this._sweep.destroy();
		this._sweep = null;

		this._interruptBigFlareAnimation();
		this._interruptOrangeFlareAnimation();

		this._ticksCounter = 0;
		
		this._handFragmentsView.interruptAnimation();
		this._handFragmentsView.visible = false;

		this._stoneHand.visible = false;
		this._caption.visible = false;

		let lStoneHandGlow = this._stoneHandGlow;
		if (lStoneHandGlow)
		{
			Sequence.destroy(Sequence.findByTarget(lStoneHandGlow));
			lStoneHandGlow.alpha = 1;
			lStoneHandGlow.visible = false;
		}

		this._fParticlesContainer.destroyChildren();

		this.emit(BloodStone.EVENT_ON_STONE_SCREEN_COVERED);
	}

	_onLastFrameCollectAnimationCompleted(event)
	{
		this._tryToCompleteLandingAnimation();
	}

	get _profilingInfo()
	{
		return APP.profilingController.info;
	}

	_addParticles(aX_num, aY_num, aRotationGrad_num, aStartFrame_int, aScaleMult_num=1)
	{
		let lParticles_sprt = Sprite.createMultiframesSprite(BloodStone.particles_texture, aStartFrame_int);
		lParticles_sprt.scale.set(-1.8*aScaleMult_num, 1.8*aScaleMult_num);
		lParticles_sprt.blendMode = PIXI.BLEND_MODES.ADD;
		lParticles_sprt.frameRate = 30/60;
		lParticles_sprt.x = aX_num;
		lParticles_sprt.y = aY_num;
		lParticles_sprt.rotation = Utils.gradToRad(aRotationGrad_num);
		lParticles_sprt.play();
		lParticles_sprt.once('animationend', () =>{
			lParticles_sprt.destroy();

			this._tryToCompleteLandingAnimation();
		});
		
		this._fParticlesContainer.addChild(lParticles_sprt);
	}

	_startFragmentLandingAnimation(aLandedFragmentId_num, aIsLastStoneFragment_bl)
	{
		this._fIsAnimationInProgress_bl = true;
		this._fIsLastStoneFragment_bl = aIsLastStoneFragment_bl;

		this._stoneFragmentsView.startFragmentLandingAnimation(aIsLastStoneFragment_bl);
		this._handFragmentsView.startFragmentLandingAnimation(aLandedFragmentId_num, aIsLastStoneFragment_bl);

		let lStoneHandGlow = this._stoneHandGlow;
		if (lStoneHandGlow)
		{
			Sequence.destroy(Sequence.findByTarget(lStoneHandGlow));

			lStoneHandGlow.alpha = 1;
			lStoneHandGlow.visible = true;
			let lTargetAlpha_num = aIsLastStoneFragment_bl ? 0.8 : 0;
			let lHandGlowSeq = [
									{tweens: [],	duration: 4*FRAME_RATE},
									{tweens: [{prop: 'alpha', to: lTargetAlpha_num}],	duration: 11*FRAME_RATE, onfinish: ()=>{ this._onHandGlowAnimationCompleted(); }}
								]

			Sequence.start(lStoneHandGlow, lHandGlowSeq);
		}

		let lBigFlare = this._bigFlare;
		if (lBigFlare && !lBigFlare.visible)
		{
			lBigFlare.visible = true;
			lBigFlare.alpha = 1;
			this._startBigFlareRotationCycle();
		}

		if (!aIsLastStoneFragment_bl)
		{
			this._startOrangeFlareAnimation(aLandedFragmentId_num);
		}

		if (this._profilingInfo.isVfxProfileValueMediumOrGreater)
		{
			if (!this._fParticlesContainer.children || !this._fParticlesContainer.children.length)
			{
				this._addParticles(0, 0, 0, -4, 0.8);
				this._addParticles(0-1, 0-40, -124, -4-2*2, 0.8);
				this._addParticles(0-20, 0-115, 0, -4-3*2);
				this._addParticles(0+3, 0-100, 0, -4-1*2);
				this._addParticles(0+11, 0-77, -26, -4-4*2);
				this._addParticles(0-21, 0-75, -26, -4-2*2);

				this._fParticlesContainer.y = 220;
			}
		}
		
		APP.off('tick', this._onTick, this);
		APP.on('tick', this._onTick, this);
	}

	_onHandGlowAnimationCompleted()
	{
		if (this._fIsLastStoneFragment_bl)
		{
			if (this._profilingInfo.isVfxProfileValueMediumOrGreater)
			{
				this._aminateLightSweep();
			}
			return;
		}

		let lStoneHandGlow = this._stoneHandGlow;
		lStoneHandGlow.alpha = 1;
		lStoneHandGlow.visible = false;

		this._interruptShake();
		
		if (this._profilingInfo.isVfxProfileValueMediumOrGreater)
		{
			this._aminateLightSweep();
		}
		else
		{
			this._tryToCompleteLandingAnimation();
		}
	}

	_aminateLightSweep()
	{
		let lShakeCont_sprt = this._shakeContainer;
		let lStoneHand = this._stoneHand;

		let lSweep_sprt;
		if (this._profilingInfo.isVfxProfileValueMediumOrGreater)
		{
			lSweep_sprt = this._sweep = lShakeCont_sprt.addChild(APP.library.getSprite("critical_hit/light_sweep"));
			lSweep_sprt.x = 10;
			lSweep_sprt.y = 250;
			lSweep_sprt.rotation = Utils.gradToRad(30);

			let lStoneHandMask = this._handMask = lShakeCont_sprt.addChild(new Sprite);
			lStoneHandMask.textures = DragonstonesAssets['stone_hand'];
			lStoneHandMask.scale.set(lStoneHand.scale.x, lStoneHand.scale.y);
			lStoneHandMask.anchor.set(0.52, 0.12);
			let lHandBounds = lStoneHand.getBounds();
			lStoneHandMask.position.set(lStoneHand.x, lStoneHand.y);
			lSweep_sprt.mask = lStoneHandMask;
		}
		else
		{
			lSweep_sprt = this._sweep = lShakeCont_sprt.addChild(new Sprite);
		}

		lSweep_sprt.moveTo(-20, -70, 30*FRAME_RATE, undefined, () => { this._onLightSweepAnimationCompleted(); } );
	}

	_onLightSweepAnimationCompleted()
	{
		this._handMask && this._handMask.destroy();
		this._handMask = null;
		
		this._sweep && this._sweep.destroy()
		this._sweep = null;

		if (this._fIsLastStoneFragment_bl)
		{
			return;
		}

		let lBigFlare = this._bigFlare;
		if (lBigFlare)
		{
			lBigFlare.fadeTo(0, 7*FRAME_RATE, undefined, () => { this._onBigFlareDisappeared(); } )
		}
		else
		{
			this._tryToCompleteLandingAnimation();
		}
	}

	_startBigFlareRotationCycle()
	{
		let lBigFlare = this._bigFlare;
		let lSeq = [
				{tweens: [{prop: 'rotation', to: Utils.gradToRad(-360)}],	duration: 720*FRAME_RATE, onfinish: ()=>{ this._onBigFlareRotationCycleCompleted(); }}
			]
		Sequence.start(lBigFlare, lSeq);
	}

	_onBigFlareRotationCycleCompleted()
	{
		let lBigFlare = this._bigFlare;
		
		Sequence.destroy(Sequence.findByTarget(lBigFlare));

		lBigFlare.rotation = 0;

		this._startBigFlareRotationCycle();
	}

	_onBigFlareDisappeared()
	{
		this._interruptBigFlareAnimation();

		this._tryToCompleteLandingAnimation();
	}

	_interruptBigFlareAnimation()
	{
		let lBigFlare = this._bigFlare;

		if (lBigFlare)
		{
			Sequence.destroy(Sequence.findByTarget(lBigFlare));
			lBigFlare.rotation = 0;
			lBigFlare.visible = false;

			lBigFlare.removeTweens();
			lBigFlare.alpha = 1;
		}
	}

	_startOrangeFlareAnimation(aLandedFragmentId_num)
	{
		this._interruptOrangeFlareAnimation();

		let lOrangeFlare = this._orangeFlare;
		lOrangeFlare.visible = true;

		lOrangeFlare.y = this._orangeFlare.parent.globalToLocal(this._handFragmentsView.getFragmentGlobalPosition(aLandedFragmentId_num)).y;

		let lScaleSeq = [
				{tweens: [{prop: 'scale.x', to: 2}, {prop: 'scale.y', to: 2}],	duration: 8*FRAME_RATE},
				{tweens: [{prop: 'scale.x', to: 0}, {prop: 'scale.y', to: 0}],	duration: 6*FRAME_RATE}
			]
		Sequence.start(lOrangeFlare, lScaleSeq);

		let lAlphaSeq = [
				{tweens: [{prop: 'alpha', to: 0}],	duration: 14*FRAME_RATE, onfinish: ()=>{ this._onOrangeFlareAnimationCompleted(); }}
			]
		Sequence.start(lOrangeFlare, lAlphaSeq);
	}

	_interruptOrangeFlareAnimation()
	{
		let lOrangeFlare = this._orangeFlare;
		Sequence.destroy(Sequence.findByTarget(lOrangeFlare));


		lOrangeFlare.scale.set(2*0.9);
		lOrangeFlare.alpha = 1;
		lOrangeFlare.visible = false;
	}

	_onOrangeFlareAnimationCompleted()
	{
		let lOrangeFlare = this._orangeFlare;
		Sequence.destroy(Sequence.findByTarget(lOrangeFlare));
		
		lOrangeFlare.scale.set(2*0.9);
		lOrangeFlare.alpha = 1;
		lOrangeFlare.visible = false;
	}

	_tryToCompleteLandingAnimation()
	{
		if (
				(!this._fParticlesContainer.children || !this._fParticlesContainer.children.length)
				&& (!this._stoneHandGlow || !this._stoneHandGlow.visible)
				&& !this._sweep
			)
		{
			this._onFragmentLandingAnimationCompleted();
		}
	}

	_onFragmentLandingAnimationCompleted()
	{
		this._interruptAnimation();

		this._fIsAnimationInProgress_bl = false;

		this.emit(BloodStone.EVENT_ON_STONE_LANDING_ANIMATION_COMPLETED);
	}

	_interruptShake()
	{
		APP.off('tick', this._onTick, this);

		let lShakeCont_sprt = this._shakeContainer;
		lShakeCont_sprt.x = lShakeCont_sprt.y = 0;
	}

	_interruptAnimation()
	{
		this._interruptShake();

		this._sweep && this._sweep.destroy();
		this._sweep = null;

		this._interruptBigFlareAnimation();
		this._interruptOrangeFlareAnimation();

		this._ticksCounter = 0;

		this._stoneFragmentsView.interruptAnimation();
		this._handFragmentsView.interruptAnimation();

		let lStoneHandGlow = this._stoneHandGlow;
		if (lStoneHandGlow)
		{
			Sequence.destroy(Sequence.findByTarget(lStoneHandGlow));
			lStoneHandGlow.alpha = 1;
			lStoneHandGlow.visible = false;
		}

		this._fParticlesContainer.destroyChildren();

		this._fIsAnimationInProgress_bl = false;
		this._shakeContainer.visible = true;

		this._fIsLastStoneFragment_bl = false;

		this._handFragmentsView.visible = true;
		this._stoneHand.visible = true;
		this._caption.visible = true;
	}

	_onTick()
	{
		this._ticksCounter++;

		if (this._ticksCounter%2 == 0)
		{
			return;
		}

		if (this._profilingInfo.isVfxProfileValueMediumOrGreater)
		{
			let lShakeCont_sprt = this._shakeContainer;

			lShakeCont_sprt.x = Utils.getRandomWiggledValue(0, 2);
			lShakeCont_sprt.y = Utils.getRandomWiggledValue(0, 2);
		}
	}

	destroy()
	{
		this._stoneHandGlow && Sequence.destroy(Sequence.findByTarget(this._stoneHandGlow));

		this._interruptBigFlareAnimation();

		APP.off('tick', this._onTick, this);

		this._contentContainer = null;
		this._shakeContainer = null;
		this._stoneFragmentsView.off(StoneFragmentsView.EVENT_ON_STONE_EYE_FLY_OUT_STARTED, this._onStoneEyeFlyOutStarted, this)
		this._stoneFragmentsView = null;
		this._bigFlare = null;
		this._ticksCounter = undefined;
		this._stoneHandGlow = null;
		this._fParticlesContainer = null;
		this._fIsAnimationInProgress_bl = null;
		this._fIsLastStoneFragment_bl = null;

		this._sweep && this._sweep.destroy();
		this._sweep = null;

		this._stoneHand = null;
		this._caption = null;

		super.destroy();
	}
}

BloodStone.particles_texture = null;

BloodStone.initParticlesTexture = function ()
{
	if(!BloodStone.particles_texture)
	{
		BloodStone.particles_texture = AtlasSprite.getFrames([APP.library.getAsset("dragonstones/particles_spread")], [AtlasConfig.DragonstoneParticlesSpread], "");
		BloodStone.particles_texture.sort(function(a, b){if(a._atlasName > b._atlasName) return 1; else return -1});
	}
};

export default BloodStone