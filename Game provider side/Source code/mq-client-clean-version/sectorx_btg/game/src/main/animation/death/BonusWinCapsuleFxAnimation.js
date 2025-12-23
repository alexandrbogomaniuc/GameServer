import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import AtlasSprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import AtlasConfig from '../../../config/AtlasConfig';
import { FRAME_RATE } from '../../../../../shared/src/CommonConstants';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import * as Easing from '../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { Utils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import I18 from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18'
import DeathFxAnimation from './DeathFxAnimation'

let l_particle_spr = null;
function _generatePatricle()
{
	if (!l_particle_spr)
	{
		l_particle_spr = AtlasSprite.getFrames(APP.library.getAsset("common/fire_circle"), AtlasConfig.TopFlareEnergy, "");
	}
	return l_particle_spr;
}

let _particlesTexturesFlare = null;
function _generateParticlesTexturesFlare()
{
	if (!_particlesTexturesFlare)
	{
		_particlesTexturesFlare = AtlasSprite.getFrames(APP.library.getAsset("common/particles"), AtlasConfig.Particles, "");
	}
	
	return _particlesTexturesFlare;
}

class BonusWinCapsuleFxAnimation extends DeathFxAnimation
{
	constructor()
	{
		super();
		this._fTripplePuff_sprt = null;
		this._fParticle_sprt = null;
		this._fFlare_spr = null;
		this._fSmallFlare_spr = null;
		this._fGlow_spr = null;
		this._fCircle_spr = null;
		this._fLight_spr = null;
		this._bonusCaptionContainer_sprt = null;
		this._fIsAnimationProgress_bl = false;
		this._fIsAnimationProgressCount_num = null;

	}
	_playAnimation()
	{
		// here we dont need the intro
		this._startGlowAnimation();
		this._fIsAnimationProgress_bl = true;
		this._fIsAnimationProgressCount_num = 0;
		let lTimer_seq = 
		[
			{ tweens: [], duration: 3*FRAME_RATE, onfinish: ()=>{
				this._startFlaresAnimation();
			} },
			{ tweens: [], duration: 1*FRAME_RATE, onfinish: ()=>{
				this._startCaptionAnimation();
			} },
			{ tweens: [], duration: 1*FRAME_RATE, onfinish: ()=>{
				this._playTripplePuff();
				this._startLightAnimation();
			} },
			{ tweens: [], duration: 2*FRAME_RATE, onfinish: ()=>{
				this._startCircleAnimation();
			} },
			{ tweens: [], duration: 2*FRAME_RATE, onfinish: ()=>{
				this._startSmallFlaresAnimation();
			} },
			{ tweens: [], duration: 4*FRAME_RATE, onfinish: ()=>{
				if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
				{
					this._startParticle({x: 0, y: 0}, Math.PI)
					this._startParticle({x: 0, y: 0}, -Math.PI)
				}
				this._fIsAnimationProgressCount_num--;
				this._completeAnimationSuspicision();
			} },
		];

		this._fIsAnimationProgressCount_num++;
		Sequence.start(this, lTimer_seq);
	}

	_playTripplePuff()
	{
		this._fTripplePuff_sprt = this.addChild(new Sprite());
		this._fTripplePuff_sprt.textures = _generatePatricle();
		this._fTripplePuff_sprt.blendMode = PIXI.BLEND_MODES.ADD;
		this._fTripplePuff_sprt.scale.set(2.56);
		this._fTripplePuff_sprt.anchor.set(0.5, 0.5);
		this._fTripplePuff_sprt.on('animationend', () => {
			this._fIsAnimationProgressCount_num--;
			this._completeAnimationSuspicision();
			this._fTripplePuff_sprt && this._fTripplePuff_sprt.destroy();
			this._fTripplePuff_sprt = null;
		});
		this._fIsAnimationProgressCount_num++;
		this._fTripplePuff_sprt.play();
		this._fTripplePuff_sprt.scaleTo(3.75, 24 * FRAME_RATE, Easing.sine.easeOut)
	}

	_startParticle(aPos_obj, aRot_num)
	{
		let lParticle_sprt = this._fParticle_sprt = this.addChild(new Sprite());
		lParticle_sprt.textures = _generateParticlesTexturesFlare();
		lParticle_sprt.blendMode = PIXI.BLEND_MODES.ADD;
		lParticle_sprt.scale.set(4);
		lParticle_sprt.rotation = aRot_num;
		lParticle_sprt.position.set(aPos_obj.x, aPos_obj.y);
		lParticle_sprt.animationSpeed = 0.5;
		lParticle_sprt.on('animationend', () => {
			this._fIsAnimationProgressCount_num--;
			this._completeAnimationSuspicision();
			lParticle_sprt && lParticle_sprt.destroy();
			lParticle_sprt = null;
		});
		this._fIsAnimationProgressCount_num++;
		lParticle_sprt.play();
	}

	_startFlaresAnimation()
	{
		this._fFlare_spr = this.addChild(APP.library.getSprite("common/misty_flare"));
		this._fFlare_spr.blendMode = PIXI.BLEND_MODES.ADD;
		this._fFlare_spr.anchor.set(0.5, 0.5);
		this._fFlare_spr.scale.set(0.58);

		let lFlareAnimation_seq = [
			{ tweens: [{prop: "scale.x", to: 3.51}, {prop: "scale.y", to: 3.51}], duration: 3*FRAME_RATE },
			{ tweens: [{prop: "scale.x", to: 1}, {prop: "scale.y", to: 1}], duration: 10*FRAME_RATE,
				onfinish: ()=>{
					this._fIsAnimationProgressCount_num--;
					this._completeAnimationSuspicision();
					this._fFlare_spr && this._fFlare_spr.destroy();
					this._fFlare_spr = null;
				}
		},
		];

		this._fIsAnimationProgressCount_num++;
		Sequence.start(this._fFlare_spr, lFlareAnimation_seq);
	}

	_startSmallFlaresAnimation()
	{
		this._fSmallFlare_spr = this.addChild(APP.library.getSprite("death/bonus_capsula_death/small_flare"));
		this._fSmallFlare_spr.blendMode = PIXI.BLEND_MODES.ADD;
		this._fSmallFlare_spr.anchor.set(0.5, 0.5);
		this._fSmallFlare_spr.scale.set(-0.6);
		this._fSmallFlare_spr.rotation = 0.05235987755982988; //Utils.gradToRad(3)

		let lFlareAnimation_seq = [
			{ tweens: [{prop: "scale.x", to: 0.47}, {prop: "scale.y", to: 0.47}], duration: 3*FRAME_RATE },
			{ tweens: [{prop: "scale.x", to: 0}, {prop: "scale.y", to: 0}], duration: 15*FRAME_RATE ,
				onfinish: ()=>{
					this._fIsAnimationProgressCount_num--;
					this._completeAnimationSuspicision();
					this._fSmallFlare_spr && this._fSmallFlare_spr.destroy();
					this._fSmallFlare_spr = null;
				}},
		];
		this._fIsAnimationProgressCount_num++;
		Sequence.start(this._fSmallFlare_spr, lFlareAnimation_seq);

		let lFlareAnimationRotation_seq = [
			{ tweens: [{prop: "rotation", to: 0.5585053606381855}], duration: 15*FRAME_RATE, //Utils.gradToRad(32)
			onfinish: ()=>{
				this._fIsAnimationProgressCount_num--;
				this._completeAnimationSuspicision();
			}}
		];
		this._fIsAnimationProgressCount_num++;
		Sequence.start(this._fSmallFlare_spr, lFlareAnimationRotation_seq);
	}

	_startGlowAnimation()
	{
		this._fGlow_spr = this.addChild(APP.library.getSprite("death/bonus_capsula_death/glow"));
		this._fGlow_spr.blendMode = PIXI.BLEND_MODES.ADD;
		this._fGlow_spr.anchor.set(0.5, 0.5);
		this._fGlow_spr.scale.set(2.24, 1.5); //1.12*2, 0.75*2
		this._fGlow_spr.alpha = 0;

		let lGlowAnimation_seq = [
			{ tweens: [{prop: "alpha", to: 0.2}], duration: 7*FRAME_RATE },
			{ tweens: [], duration: 21*FRAME_RATE },
			{ tweens: [{prop: "alpha", to: 0}], duration: 23*FRAME_RATE ,
				onfinish: ()=>{
					this._fIsAnimationProgressCount_num--;
					this._completeAnimationSuspicision();
					this._fGlow_spr && this._fGlow_spr.destroy();
					this._fGlow_spr = null;
				}},
		];

		this._fIsAnimationProgressCount_num++;
		Sequence.start(this._fGlow_spr, lGlowAnimation_seq);
	}

	_startCircleAnimation()
	{
		this._fCircle_spr = this.addChild(APP.library.getSprite("death/bonus_capsula_death/circle"));
		this._fCircle_spr.blendMode = PIXI.BLEND_MODES.ADD;
		this._fCircle_spr.anchor.set(0.5, 0.5);
		this._fCircle_spr.scale.set(0);

		let lCircleScaleAnimation_seq = [
			{ tweens: [{prop: "scale.x", to: 0.5}, {prop: "scale.y", to: 0.5}], duration: 2*FRAME_RATE },
			{ tweens: [{prop: "scale.x", to: 7.2}, {prop: "scale.y", to: 7.2}], duration: 19*FRAME_RATE ,
				onfinish: ()=>{
					this._fIsAnimationProgressCount_num--;
					this._completeAnimationSuspicision();
					this._fCircle_spr && this._fCircle_spr.destroy();
					this._fCircle_spr = null;
				}},
		];

		this._fIsAnimationProgressCount_num++;
		Sequence.start(this._fCircle_spr, lCircleScaleAnimation_seq);

		let lCircleAlphaAnimation_seq = [
			{ tweens: [], duration: 2*FRAME_RATE },
			{ tweens: [{prop: "alpha", to: 0.8}], duration: 3*FRAME_RATE },
			{ tweens: [{prop: "alpha", to: 0}], duration: 8*FRAME_RATE,
				onfinish: ()=>{
					this._fIsAnimationProgressCount_num--;
					this._completeAnimationSuspicision();
				}}
		];

		this._fIsAnimationProgressCount_num++;
		Sequence.start(this._fCircle_spr, lCircleAlphaAnimation_seq);
	}

	_startLightAnimation()
	{
		this._fLight_spr = this.addChild(APP.library.getSprite("common/light_particle"));
		this._fLight_spr.blendMode = PIXI.BLEND_MODES.ADD;
		this._fLight_spr.anchor.set(0.5, 0.5);
		this._fLight_spr.scale.set(24.97);
		this._fLight_spr.alpha = 0;

		let lLightAnimation_seq = [
			{ tweens: [{prop: "alpha", to: 1}], duration: 10*FRAME_RATE },
			{ tweens: [{prop: "alpha", to: 0}], duration: 41*FRAME_RATE ,
				onfinish: ()=>{
					this._fIsAnimationProgressCount_num--;
					this._completeAnimationSuspicision();
					this._fLight_spr && this._fLight_spr.destroy();
					this._fLight_spr = null;
				}},
		];

		this._fIsAnimationProgressCount_num++;
		Sequence.start(this._fLight_spr, lLightAnimation_seq);
	}

	get _captionAsset()
	{
		return "TABonusCaption"
	}

	get _captionGlowAsset()
	{
		return "TABonusGlowCaption"
	}

	_startCaptionAnimation()
	{
		this._bonusCaptionContainer_sprt = this.addChild(new Sprite);
		this._bonusCaptionContainer_sprt.anchor.set(0.5,0.5)
		this._bonusCaptionContainer_sprt.scale.set(0);

		this._fCaptionAsset_spr = this._bonusCaptionContainer_sprt.addChild(I18.generateNewCTranslatableAsset(this._captionAsset));
		this._fCaptionAsset_spr.anchor.set(0.5,0.5)
		this._fCaptionGlowAsset_spr = this._bonusCaptionContainer_sprt.addChild(I18.generateNewCTranslatableAsset(this._captionGlowAsset));
		this._fCaptionGlowAsset_spr.anchor.set(0.5,0.5)

		let lScaleAnimation_seq = [
			{ tweens: [{prop: "scale.x", to: 0.76}, {prop: "scale.y", to: 0.76}], duration: 3*FRAME_RATE },
			{ tweens: [{prop: "scale.x", to: 0.98}, {prop: "scale.y", to: 0.98}], duration: 7*FRAME_RATE },
			{ tweens: [{prop: "scale.x", to: 0.64}, {prop: "scale.y", to: 0.64}], duration: 6*FRAME_RATE },
			{ tweens: [{prop: "scale.x", to: 0.69}, {prop: "scale.y", to: 0.69}], duration: 7*FRAME_RATE },
			{ tweens: [], duration: 29*FRAME_RATE },
			{ tweens: [{prop: "scale.x", to: 0.81}, {prop: "scale.y", to: 0.81}], duration: 7*FRAME_RATE },
			{ tweens: [{prop: "scale.x", to: 0}, {prop: "scale.y", to: 0}], duration: 3*FRAME_RATE ,
				onfinish: ()=>{
					this._fIsAnimationProgressCount_num--;
					this._completeAnimationSuspicision();
					this._bonusCaptionContainer_sprt && this._bonusCaptionContainer_sprt.destroy();
					this._bonusCaptionContainer_sprt = null;
				}},
		];
		this._fIsAnimationProgressCount_num++;
		Sequence.start(this._bonusCaptionContainer_sprt, lScaleAnimation_seq);

		let lGlowAnimation_seq = [
			{ tweens: [{prop: "alpha", to: 0.7}], duration: 9*FRAME_RATE },
			{ tweens: [{prop: "alpha", to: 0}], duration: 8*FRAME_RATE },
			{ tweens: [], duration: 38*FRAME_RATE },
			{ tweens: [{prop: "alpha", to: 1}], duration: 6*FRAME_RATE,
			onfinish: ()=>{
				this._fIsAnimationProgressCount_num--;
				this._completeAnimationSuspicision();
				this._fCaptionGlowAsset_spr && this._fCaptionGlowAsset_spr.destroy();
				this._fCaptionGlowAsset_spr = null;
			}}
		];
		this._fIsAnimationProgressCount_num++;
		Sequence.start(this._fCaptionGlowAsset_spr, lGlowAnimation_seq);
	}

	get isAnimationProgress()
	{
		return this._fIsAnimationProgress_bl;
	}

	set isAnimationProgress(aValue)
	{
		this._fIsAnimationProgress_bl = aValue;
	}

	
	_completeAnimationSuspicision()
	{
		if (this._fIsAnimationProgressCount_num <= 0)
		{
			this._fIsAnimationProgress_bl = false;
			this.emit(BonusWinCapsuleFxAnimation.EVENT_ANIMATION_COMPLETED);
		}
	}

	destroy()
	{
		this._fTripplePuff_sprt && this._fTripplePuff_sprt.destroy();
		this._fTripplePuff_sprt = null;
		
		this._fParticle_sprt && this._fParticle_sprt.destroy();
		this._fParticle_sprt = null;

		
		this._fFlare_spr && Sequence.destroy(Sequence.findByTarget(this._fFlare_spr));
		this._fFlare_spr && this._fFlare_spr.destroy();
		this._fFlare_spr = null;

		this._fSmallFlare_spr && Sequence.destroy(Sequence.findByTarget(this._fSmallFlare_spr));
		this._fSmallFlare_spr && this._fSmallFlare_spr.destroy();
		this._fSmallFlare_spr = null;

		this._fGlow_spr && Sequence.destroy(Sequence.findByTarget(this._fGlow_spr));
		this._fGlow_spr && this._fGlow_spr.destroy();
		this._fGlow_spr = null;
		
		this._fCircle_spr && Sequence.destroy(Sequence.findByTarget(this._fCircle_spr));
		this._fCircle_spr && this._fCircle_spr.destroy();
		this._fCircle_spr = null;
		
		this._fLight_spr && Sequence.destroy(Sequence.findByTarget(this._fLight_spr));
		this._fLight_spr && this._fLight_spr.destroy();
		this._fLight_spr = null;

		this._bonusCaptionContainer_sprt && Sequence.destroy(Sequence.findByTarget(this._bonusCaptionContainer_sprt));
		this._bonusCaptionContainer_sprt && this._bonusCaptionContainer_sprt.destroy();
		this._bonusCaptionContainer_sprt = null;

		this._fIsAnimationProgressCount_num = null;

		super.destroy();
	}
}

export default BonusWinCapsuleFxAnimation;