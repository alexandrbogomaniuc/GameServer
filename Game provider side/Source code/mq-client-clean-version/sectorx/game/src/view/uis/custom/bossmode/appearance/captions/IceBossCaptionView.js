import Sequence from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { FRAME_RATE } from '../../../../../../../../shared/src/CommonConstants';
import { APP } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import BossModeCaptionView from './BossModeCaptionView';
import I18 from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
import Timer from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import { generate_flare_textures } from '../IceBossAppearanceView';
import { generate_explosion_textures } from '../../death/IceBossDeathFxAnimation';
import { Sprite } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';

class IceBossCaptionView extends BossModeCaptionView
{
	//INIT...
	constructor()
	{
		super();
		this._fSmokeTimers_t_arr = null;
		this._fFlare_spr = null;
	}
	//...INIT

	/**
	 * @override
	 * @protected
	 */
	__playAnimation()
	{
		super.__playAnimation();
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startIntroSmokesAnimation();
		}
	}

	/**
	 * @override
	 * @protected
	 * @returns {CTranslatableAsset} Ice boss caption image.
	 */
	__getTranslatableImageCaptionAsset()
	{
		return I18.generateNewCTranslatableAsset("TABossModeIceBossLabel");
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
			this._fBacgroundRays_spr = this.__fCaptionContainer_sprt.addChild(new Sprite());
			this._fBacgroundRays_spr.textures = generate_flare_textures();
			this._fBacgroundRays_spr.scale.set(12, -3);
			this._fBacgroundRays_spr.anchor.set(0.5, 1);
			this._fBacgroundRays_spr.position.set(0, 30);
			this._fBacgroundRays_spr.alpha = 0.36;
			this._fBacgroundRays_spr.blendMode = PIXI.BLEND_MODES.ADD;
			this._fBacgroundRays_spr.play();
		}

		super.__startCaptionAnimation();
	}

	/**
	 * @override
	 * @protected
	 */
	__onCaptionDisappearanceStarted()
	{
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startFinalExplosion();
		}
	}

	/**
	 * @override
	 * @protected
	 */
	__onCaptionBecameVisible()
	{
		super.__onCaptionBecameVisible();
		const SMOKES_INFO = [
			{
				position: {x: 190, y: 45},
				startScale: 1.5,
				endScale: 5.5,
				delay: 1*FRAME_RATE,
			},
			{
				position: {x: -170, y: -20},
				startScale: 3,
				endScale: 10.5,
				delay: 4*FRAME_RATE,
			},
		];

		for (let lInfo_obj of SMOKES_INFO)
		{
			this._startSmokeAnimation(lInfo_obj.position, lInfo_obj.startScale, lInfo_obj.endScale, lInfo_obj.delay, this.__fBackgroundContainer_sprt);
		}
	}

	/**
	 * Generates smoke animation
	 * @private
	 * @param {Object} aPosition_obj Position.
	 * @param {Number} aStartScale_num Initial scale value.
	 * @param {Number} aEndScale_num Final scale value.
	 * @param {Number} aDelay_num Animation delay.
	 * @param {Sprite} aContainer_spr Container.
	 */
	_startSmokeAnimation(aPosition_obj, aStartScale_num, aEndScale_num, aDelay_num, aContainer_spr)
	{
		if (!this._fSmokeTimers_t_arr)
		{
			this._fSmokeTimers_t_arr = [];
		}

		let l_spr = aContainer_spr.addChild(APP.library.getSprite("enemies/ice_boss/appearance_small_smoke"));
		l_spr.position = aPosition_obj;
		l_spr.scale.set(aStartScale_num);
		l_spr.hide();

		let l_t = new Timer(()=>{
			l_spr.show();
			l_spr.scaleTo(aEndScale_num, 18*FRAME_RATE, null, this.__decreaseAnimationsCount.bind(this));
			l_spr.fadeTo(0, 10*FRAME_RATE, null, this.__decreaseAnimationsCount.bind(this), null, null, 8*FRAME_RATE);
			this.__fAnimationsCount_num += 2;
		}, aDelay_num);
		this._fSmokeTimers_t_arr.push(l_t)
	}

	/**
	 * @private
	 */
	_startIntroSmokesAnimation()
	{
		const INTRO_SMOKES_INFO = [
			{
				position: {x: 30, y: -15},
				startScale: 1.5,
				endScale: 5.5,
				delay: 2*FRAME_RATE,
				container: this.__fBackgroundContainer_sprt
			},
			{
				position: {x: -30, y: -10},
				startScale: 1.5,
				endScale: 5.5,
				delay: 0*FRAME_RATE,
				container: this.__fBackgroundContainer_sprt
			},
			{
				position: {x: 0, y: -30},
				startScale: 1.5,
				endScale: 5.5,
				delay: 1*FRAME_RATE,
				container: this.__fBackgroundContainer_sprt
			},
			{
				position: {x: -70, y: 100},
				startScale: 1.5,
				endScale: 5.5,
				delay: 0*FRAME_RATE,
				container: this
			},
			{
				position: {x: -35, y: 60},
				startScale: 1.5,
				endScale: 5.5,
				delay: 0*FRAME_RATE,
				container: this
			},
			{
				position: {x: -103, y: 30},
				startScale: 1.5,
				endScale: 5.5,
				delay: 1*FRAME_RATE,
				container: this
			},
			{
				position: {x: 10, y: 10},
				startScale: 3,
				endScale: 10.5,
				delay: 1*FRAME_RATE,
				container: this
			},
		];

		for (let lInfo_obj of INTRO_SMOKES_INFO)
		{
			this._startSmokeAnimation(lInfo_obj.position, lInfo_obj.startScale, lInfo_obj.endScale, lInfo_obj.delay, lInfo_obj.container);
		}
	}

	/**
	 * Starts smokes, flare and explosion animations.
	 * @private
	 */
	_startFinalExplosion()
	{
		this._fFlare_spr = this.addChild(APP.library.getSprite("enemies/ice_boss/blue_add_flare"));
		this._fFlare_spr.alpha = 0;
		this._fFlare_spr.position.set(0, 25);
		this._fFlare_spr.blendMode = PIXI.BLEND_MODES.ADD;
		
		let lFlareAnimationSeq_obj_arr = [
			{tweens: [{prop: "scale.x", to: 3}, {prop: "scale.y", to: 3}, {prop: "alpha", to: 0.55}], duration: 5*FRAME_RATE},
			{tweens: [{prop: "scale.x", to: 0}, {prop: "scale.y", to: 0}, {prop: "alpha", to: 0}], duration: 10*FRAME_RATE, onfinish: this.__decreaseAnimationsCount.bind(this)},
		];
		Sequence.start(this._fFlare_spr, lFlareAnimationSeq_obj_arr);
		this.__fAnimationsCount_num++;

		let lExplosion_spr = this.addChild(new Sprite());
		let lExplosionTextures_arr = generate_explosion_textures();
		lExplosion_spr.textures = lExplosionTextures_arr.slice(4);
		lExplosion_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lExplosion_spr.animationSpeed = 0.5;
		lExplosion_spr.position.set(0, 25);
		lExplosion_spr.scale.set(2);
		lExplosion_spr.on('animationend', ()=>{
			lExplosion_spr.destroy();
			this.__decreaseAnimationsCount();
		});
		lExplosion_spr.play();
		this.__fAnimationsCount_num++;

		const SMOKES_INFO = [
			{
				position: {x: 50, y: 100},
				startScale: 1.5,
				endScale: 5.5,
				delay: 1*FRAME_RATE,
			},
			{
				position: {x: -70, y: 100},
				startScale: 1.5,
				endScale: 5.5,
				delay: 4*FRAME_RATE,
			},
			{
				position: {x: -40, y: 50},
				startScale: 3,
				endScale: 10.5,
				delay: 4*FRAME_RATE,
			},
		];

		for (let lInfo_obj of SMOKES_INFO)
		{
			this._startSmokeAnimation(lInfo_obj.position, lInfo_obj.startScale, lInfo_obj.endScale, lInfo_obj.delay, this.__fBackgroundContainer_sprt);
		}
	}

	destroy()
	{
		if (Array.isArray(this._fSmokeTimers_t_arr))
		{
			for (let l_t of this._fSmokeTimers_t_arr)
			{
				l_t.destructor();
			}
		}
		this._fSmokeTimers_t_arr = null;
		
		this._fFlare_spr && Sequence.destroy(Sequence.findByTarget(this._fFlare_spr));
		this._fFlare_spr && this._fFlare_spr.destroy();
		this._fFlare_spr = null;

		this._fBacgroundRays_spr && this._fBacgroundRays_spr.destroy();
		this._fBacgroundRays_spr = null;

		super.destroy();
	}
}

export default IceBossCaptionView;