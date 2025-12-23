import Sequence from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { FRAME_RATE } from '../../../../../../../../shared/src/CommonConstants';
import { APP } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import BossModeCaptionView from './BossModeCaptionView';
import I18 from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
import { AtlasSprite, Sprite } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import AtlasConfig from '../../../../../../config/AtlasConfig';
import { Utils } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import Timer from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';

let stones_animation_textures = null;
function generate_stones_animation_textures()
{
	if (!stones_animation_textures)
	{
		stones_animation_textures = AtlasSprite.getFrames([APP.library.getAsset("boss_mode/caption/stones_explosion")], [AtlasConfig.EarthBossCaptionStonesExplosion], "");
	}
	return stones_animation_textures;
}


class EarthBossCaptionView extends BossModeCaptionView
{
	//INIT...
	constructor()
	{
		super();

		this._fStonesAnimationsTimers_t_arr = null;
		this._fStonesAnimations_arr = null;
		this._fLightParticle_spr = null;
		this._fMistyLight_spr = null;
		this._fParticlesYellow_spr = null;
		this._fLightCircle_spr = null;
		this._fBacgroundGlow_spr = null;
	}
	//...INIT

	/**
	 * @override
	 * @protected
	 */
	__playAnimation()
	{
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startMiniExplosion();
			this._startStonesExplosion({x: -160, y: -10}, -0.5113814708343386, 6*FRAME_RATE); //Utils.gradToRad(-29.3)
			this._startStonesExplosion({x: 170, y: 22}, 0.41015237421866746, 8*FRAME_RATE); //Utils.gradToRad(23.5)
		}
		else
		{
			this.__startCaptionAnimation();
		}
	}

	/**
	 * @override
	 * @protected
	 * @returns {CTranslatableAsset} Earth boss caption image.
	 */
	__getTranslatableImageCaptionAsset()
	{
		return I18.generateNewCTranslatableAsset("TABossModeEarthBossLabel");
	}

	/**
	 * @override
	 * @protected
	 * @returns {CTranslatableAsset} Earth boss caption image to add.
	 */
	__getTranslatableAddCaptionAsset()
	{
		return I18.generateNewCTranslatableAsset("TABossModeEarthBossAddLabel");
	}

	/**
	 * @override
	 * @protected
	 */
	__onCaptionAnimationCompleted()
	{
		super.__onCaptionAnimationCompleted();
	}

	/**
	 * @override
	 * @protected
	 */
	__startCaptionAnimation()
	{
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._fBacgroundGlow_spr = this.__fCaptionContainer_sprt.addChild(APP.library.getSpriteFromAtlas("common/light_particle"));
			this._fBacgroundGlow_spr.scale.set(44, 16);
			this._fBacgroundGlow_spr.position.set(0, 30);
			this._fBacgroundGlow_spr.blendMode = PIXI.BLEND_MODES.ADD;
			this._fBacgroundGlow_spr.fadeTo(0, 32*FRAME_RATE, null, this.__decreaseAnimationsCount.bind(this), null, null, 14*FRAME_RATE);
			this.__fAnimationsCount_num++;
		}

		super.__startCaptionAnimation();
	}

	/**
	 * @override
	 * @protected
	 */
	__startCaptionFiltersAnimations()
	{
		if (!this.__fCaption_sprt)
		{
			return;
		}

		this.__fCaptionAdd_sprt = this.__fCaptionContainer_sprt.addChild(this.__getTranslatableAddCaptionAsset());
		this.__fCaptionAdd_sprt.hide();

		let lAlphaSeq_obj_arr = [
			{tweens: [], duration: 0, onfinish: this.__fCaptionAdd_sprt.show.bind(this.__fCaptionAdd_sprt)},
			{tweens: [{prop: "alpha", to: 0.62}], duration: 5*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0}], duration: 6*FRAME_RATE, onfinish: this.__decreaseAnimationsCount.bind(this)}
		];
		Sequence.start(this.__fCaptionAdd_sprt, lAlphaSeq_obj_arr, 2*FRAME_RATE);
		this.__fAnimationsCount_num++;
	}

	/**
	 * @override
	 * @protected
	 */
	__onCaptionDisappearanceStarted()
	{
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startMiniExplosion(true);
		}
	}

	/**
	 * @override
	 * @protected
	 */
	__onCaptionBecameVisible()
	{
		super.__onCaptionBecameVisible();
		this._startBackgroundSmokesAnimation();
	}

	/**
	 * Starts mini explosion in the center of the caption.
	 * @private
	 * @param {Boolean} aOptIsFinal_bl Does it explode at the end of the animation 
	 */
	_startMiniExplosion(aOptIsFinal_bl=false)
	{
		this._startStonesExplosion({x: 0, y: 30}, 0, 10*FRAME_RATE);
		this._startOrangeSmokes();

		this._fLightParticle_spr = this.addChild(APP.library.getSpriteFromAtlas("common/light_particle"));
		this._fLightParticle_spr.blendMode = PIXI.BLEND_MODES.ADD;
		this._fLightParticle_spr.scaleTo(0, 16*FRAME_RATE, null, this.__decreaseAnimationsCount.bind(this), null, null, 4*FRAME_RATE);
		this.__fAnimationsCount_num++;

		// LIGHT_5...
		this._fMistyLight_spr = this.addChild(APP.library.getSpriteFromAtlas("common/misty_flare"));
		this._fMistyLight_spr.blendMode = PIXI.BLEND_MODES.ADD;

		let lMistyLightScale_seq = [
			{tweens: [{prop: "scale.x", to: 1.67}, {prop: "scale.y", to: 1.67}], duration: 2*FRAME_RATE, onfinish: !aOptIsFinal_bl && this.__startCaptionAnimation.bind(this)},
			{tweens: [{prop: "scale.x", to: 0}, {prop: "scale.y", to: 0}], duration: 7*FRAME_RATE, onfinish: this.__decreaseAnimationsCount.bind(this)},
		];

		Sequence.start(this._fMistyLight_spr, lMistyLightScale_seq);
		this.__fAnimationsCount_num++;
		// ...LIGHT_5

		// PARTICLES...
		this._fParticlesYellow_spr = this.addChild(APP.library.getSprite("boss_mode/common/particles_yellow"));
		this._fParticlesYellow_spr.blendMode = PIXI.BLEND_MODES.ADD;
		this._fParticlesYellow_spr.scale.set(0.51);

		this._fParticlesYellow_spr.fadeTo(0, 25*FRAME_RATE, null, this.__decreaseAnimationsCount.bind(this), null, null, 9*FRAME_RATE);
		this._fParticlesYellow_spr.scaleTo(1.17, 33*FRAME_RATE, null, this.__decreaseAnimationsCount.bind(this), null, null, 9*FRAME_RATE);
		this._fParticlesYellow_spr.rotateTo(0.36302848441482055, 33*FRAME_RATE, null, this.__decreaseAnimationsCount.bind(this), null, null, 1*FRAME_RATE); // Utils.gradToRad(20.8)
		this.__fAnimationsCount_num += 3;
		// ...PARTICLES

		// LIGHT CIRCLE...
		this._fLightCircle_spr = this.addChild(APP.library.getSprite("boss_mode/common/light_circle_1"));
		this._fLightCircle_spr.blendMode = PIXI.BLEND_MODES.ADD;
		this._fLightCircle_spr.scale.set(0.86); //0.43*2
		this._fLightCircle_spr.alpha = 0.87;

		this._fLightCircle_spr.scaleTo(1.38, 7*FRAME_RATE, null, this.__decreaseAnimationsCount.bind(this));
		this._fLightCircle_spr.fadeTo(0, 5*FRAME_RATE, null, this.__decreaseAnimationsCount.bind(this), null, null, 2*FRAME_RATE);
		this.__fAnimationsCount_num += 2;
		// ...LIGHT CIRCLE
	}

	/**
	 * Starts background smokes animation. Screen mode.
	 * @private
	 */
	_startBackgroundSmokesAnimation()
	{
		if (!this._fBackgroundSmokes_spr_arr)
		{
			this._fBackgroundSmokes_spr_arr = [];
		}

		const SMOKES_POSITIONS = [
			{x: -125, y: 0},
			{x: 0, y: 0},
			{x: 125, y: 0}
		];

		for (let lPosition_obj of SMOKES_POSITIONS)
		{
			let l_spr = this.__fBackgroundContainer_sprt.addChild(APP.library.getSpriteFromAtlas("boss_mode/earth/caption_background_smoke_screen"));
			l_spr.scale.set(2);
			l_spr.position = lPosition_obj;
			l_spr.rotation = 2.6179938779914944; //Utils.gradToRad(150);
			l_spr.blendMode = PIXI.BLEND_MODES.SCREEN;
			l_spr.rotateTo(3.106686068549907, 24*FRAME_RATE, null, this.__decreaseAnimationsCount.bind(this)); // Utils.gradToRad(178)
			l_spr.fadeTo(0, 24*FRAME_RATE, null, this.__decreaseAnimationsCount.bind(this));
			this.__fAnimationsCount_num += 2;
		}
	}

	/**
	 * Starts orange smokes animation in center.
	 * @private
	 */
	_startOrangeSmokes()
	{
		if (!this._fOrangeSmokes_spr_arr)
		{
			this._fOrangeSmokes_spr_arr = [];
		}

		let lAlphaSeq_obj_arr = [
			{tweens: [{prop: "alpha", to: 0.49}], duration: 9*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0}], duration: 15*FRAME_RATE, onfinish: this.__decreaseAnimationsCount.bind(this)}
		];

		let lFirstSmoke_spr = this.addChild(APP.library.getSpriteFromAtlas("boss_mode/earth/smoke_orange"));
		lFirstSmoke_spr.alpha = 0;
		lFirstSmoke_spr.scale.set(0.31);
		lFirstSmoke_spr.scaleTo(0.68, 24*FRAME_RATE, null, this.__decreaseAnimationsCount.bind(this), null, null, 1*FRAME_RATE);
		lFirstSmoke_spr.moveBy(43, -44, 24*FRAME_RATE, null, this.__decreaseAnimationsCount.bind(this), null, null, 1*FRAME_RATE);
		lFirstSmoke_spr.rotateTo(-0.8377580409572781, 24*FRAME_RATE, null, this.__decreaseAnimationsCount.bind(this), null, null, 1*FRAME_RATE);  // Utils.gradToRad(-48)
		Sequence.start(lFirstSmoke_spr, lAlphaSeq_obj_arr, 1*FRAME_RATE);
		this._fOrangeSmokes_spr_arr.push(lFirstSmoke_spr);
		this.__fAnimationsCount_num += 4;

		let lSecondSmoke_spr = this.addChild(APP.library.getSpriteFromAtlas("boss_mode/earth/smoke_6"));
		lSecondSmoke_spr.alpha = 0;
		lSecondSmoke_spr.scale.set(1.03);
		lSecondSmoke_spr.scaleTo(1.57, 24*FRAME_RATE, null, this.__decreaseAnimationsCount.bind(this), null, null, 4*FRAME_RATE);
		lSecondSmoke_spr.moveBy(-59, 11, 24*FRAME_RATE, null, this.__decreaseAnimationsCount.bind(this), null, null, 4*FRAME_RATE);
		lSecondSmoke_spr.rotateTo(-0.8377580409572781, 24*FRAME_RATE, null, this.__decreaseAnimationsCount.bind(this), null, null, 4*FRAME_RATE); // Utils.gradToRad(-48)
		Sequence.start(lSecondSmoke_spr, lAlphaSeq_obj_arr, 4*FRAME_RATE);
		this._fOrangeSmokes_spr_arr.push(lSecondSmoke_spr);
		this.__fAnimationsCount_num += 4;

		let lThirdSmoke_spr = this.addChild(APP.library.getSpriteFromAtlas("boss_mode/earth/smoke_orange"));
		lThirdSmoke_spr.alpha = 0;
		lThirdSmoke_spr.scale.set(0.22);
		lThirdSmoke_spr.scaleTo(0.76, 24*FRAME_RATE, null, this.__decreaseAnimationsCount.bind(this), null, null, 2*FRAME_RATE);
		lThirdSmoke_spr.moveBy(17, 25, 24*FRAME_RATE, null, this.__decreaseAnimationsCount.bind(this), null, null, 2*FRAME_RATE);
		lThirdSmoke_spr.rotateTo(-0.8377580409572781, 24*FRAME_RATE, null, this.__decreaseAnimationsCount.bind(this), null, null, 2*FRAME_RATE);  // Utils.gradToRad(-48)
		Sequence.start(lThirdSmoke_spr, lAlphaSeq_obj_arr, 2*FRAME_RATE);
		this._fOrangeSmokes_spr_arr.push(lThirdSmoke_spr);
		this.__fAnimationsCount_num += 4;
	}

	/**
	 * Starts stone explosion animation.
	 * @private
	 * @param {Object} aPosition_obj Position
	 * @param {Number} aOptRotation_num Rotation in degrees
	 * @param {Number} aOptDelay_num Delay in FRAME_RATE
	 */
	_startStonesExplosion(aPosition_obj, aOptRotation_num=0, aOptDelay_num=0)
	{
		if (!this._fStonesAnimationsTimers_t_arr)
		{
			this._fStonesAnimationsTimers_t_arr = []; 
		}

		if (!this._fStonesAnimations_arr)
		{
			this._fStonesAnimations_arr = []; 
		}

		let l_spr = this.addChild(new Sprite());
		l_spr.textures = generate_stones_animation_textures();
		l_spr.scale.set(6);
		l_spr.animationSpeed = 0.5;
		l_spr.rotation = aOptRotation_num;
		l_spr.position = aPosition_obj;
		l_spr.on('animationend', ()=>{
			this._fStonesAnimations_arr.splice(this._fStonesAnimations_arr.indexOf(l_spr), 1);
			l_spr.destroy();
		})
		this._fStonesAnimations_arr.push(l_spr);
		l_spr.hide();
		this._fStonesAnimationsTimers_t_arr.push(new Timer(()=>{
			l_spr.show();
			l_spr.play();
		}, aOptDelay_num));
	}

	destroy()
	{
		if (this.__fCaption_sprt && Array.isArray(this.__fCaption_sprt.filters))
		{
			for (let l_f of this.__fCaption_sprt.filters)
			{
				Sequence.destroy(Sequence.findByTarget(l_f));
				l_f = null;
			}

			this.__fCaption_sprt.filters = null;
		}

		if (Array.isArray(this._fStonesAnimationsTimers_t_arr))
		{
			for (let l_t of this._fStonesAnimationsTimers_t_arr)
			{
				l_t && l_t.destructor();
			}
		}
		this._fStonesAnimationsTimers_t_arr = null;

		if (Array.isArray(this._fStonesAnimations_arr))
		{
			for (let l_spr of this._fStonesAnimations_arr)
			{
				l_spr && l_spr.destroy();
			}
		}
		this._fStonesAnimations_arr = null;

		if (Array.isArray(this._fOrangeSmokes_spr_arr))
		{
			for (let l_spr of this._fOrangeSmokes_spr_arr)
			{
				l_spr && Sequence.destroy(Sequence.findByTarget(l_spr));
				l_spr && l_spr.destroy();
			}
		}
		this._fOrangeSmokes_spr_arr = null;

		if (Array.isArray(this._fBackgroundSmokes_spr_arr))
		{
			for (let l_spr of this._fBackgroundSmokes_spr_arr)
			{
				l_spr.destroy();
			}
		}
		this._fBackgroundSmokes_spr_arr = null;

		this._fLightParticle_spr && this._fLightParticle_spr.destroy();
		this._fLightParticle_spr = null;

		this._fMistyLight_spr && Sequence.destroy(Sequence.findByTarget(this._fMistyLight_spr));
		this._fMistyLight_spr && this._fMistyLight_spr.destroy();
		this._fMistyLight_spr = null;

		this._fParticlesYellow_spr && this._fParticlesYellow_spr.destroy();
		this._fParticlesYellow_spr = null;

		this._fLightCircle_spr && this._fLightCircle_spr.destroy();
		this._fLightCircle_spr = null;

		this._fBacgroundGlow_spr && this._fBacgroundGlow_spr.destroy();
		this._fBacgroundGlow_spr = null;

		super.destroy();
	}
}

export default EarthBossCaptionView;