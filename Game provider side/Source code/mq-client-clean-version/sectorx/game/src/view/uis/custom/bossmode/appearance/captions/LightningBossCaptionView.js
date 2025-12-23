import { APP } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import BossModeCaptionView from './BossModeCaptionView';
import I18 from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
import { FRAME_RATE } from '../../../../../../../../shared/src/CommonConstants';
import { Sequence } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import { Sprite } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import { generateLightningTextures } from '../LightningBossAppearanceView';
import Timer from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import { Utils } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import { generateLightningRingTextures } from '../animation/LightningBossSmokeMainAnimation';
import LightningBossMiniExplosionAnimation from '../../death/animation/LightningBossMiniExplosionAnimation';

class LightningBossCaptionView extends BossModeCaptionView
{
	//INIT...
	constructor()
	{
		super();
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
			this._startElectricEffectsAnimations();
		}
	}

	/**
	 * @override
	 * @protected
	 * @returns {CTranslatableAsset} Lightning boss caption image.
	 */
	__getTranslatableImageCaptionAsset()
	{
		return I18.generateNewCTranslatableAsset("TABossModeLightningBossLabel");
	}
	
	/**
	 * @override
	 * @protected
	 * @returns {CTranslatableAsset} Earth boss caption image to add.
	 */
	__getTranslatableAddCaptionAsset()
	{
		return I18.generateNewCTranslatableAsset("TABossModeLightningBossAddLabel");
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
			this._fBacgroundGlow_spr = this.__fCaptionContainer_sprt.addChild(APP.library.getSpriteFromAtlas("boss_mode/lightning/red_glow"));
			this._fBacgroundGlow_spr.scale.set(7, 2); //3.5*2, 2
			this._fBacgroundGlow_spr.blendMode = PIXI.BLEND_MODES.ADD;

			this._fBacgroundTextAddCaption_spr = this.__fCaptionContainer_sprt.addChild(this.__getTranslatableAddCaptionAsset());
			this._fBacgroundTextAddCaption_spr.blendMode = PIXI.BLEND_MODES.ADD;
		}

		super.__startCaptionAnimation();
	}

	/**
	 * @override
	 * @protected
	 */
	__onCaptionBecameVisible()
	{
		super.__onCaptionBecameVisible();
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startIntroExplosion();
		}
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
	__startCaptionFiltersAnimations()
	{
		if (!this.__fCaption_sprt)
		{
			return;
		}

		this.__fCaptionAdd_sprt = this.__fCaptionContainer_sprt.addChild(this.__getTranslatableAddCaptionAsset());
		this.__fCaptionAdd_sprt.fadeTo(0, 11*FRAME_RATE, null, this.__decreaseAnimationsCount.bind(this), null, null, 6*FRAME_RATE);
		this.__fAnimationsCount_num++;
	}

	/**
	 * Starts electricity around the caption.
	 * @private
	 */
	_startElectricEffectsAnimations()
	{
		if (!this._fLightningsTimers_t_arr)
		{
			this._fLightningsTimers_t_arr = [];
		}

		const REPEAT_DELAY = 27*FRAME_RATE;

		// LIGHTNINGS...
		const LIGHTNINGS_INFO = [
			{
				position: {x: -200, y: 0},
				delay: 6*FRAME_RATE,
				rotation: 0
			},
			{
				position: {x: 200, y: -10},
				delay: 15*FRAME_RATE,
				rotation: -2.7576202181510405 //Utils.gradToRad(-158)
			}
		];

		for (let lInfo_obj of LIGHTNINGS_INFO)
		{
			let lLightning_spr = this.addChild(new Sprite());
			lLightning_spr.textures = generateLightningTextures();
			lLightning_spr.alpha = 0.7;
			lLightning_spr.position = lInfo_obj.position;
			lLightning_spr.rotation = lInfo_obj.rotation;
			lLightning_spr.animationSpeed = 0.17;
			lLightning_spr.blendMode = PIXI.BLEND_MODES.ADD;
			lLightning_spr.hide();
			lLightning_spr.on('animationend', ()=>{
				lLightning_spr.hide();
				lLightning_spr.stop();
				this.__decreaseAnimationsCount();
			});

			let l_t = new Timer(()=>{
				lLightning_spr.show();
				lLightning_spr.play();
				this.__fAnimationsCount_num++;
			}, lInfo_obj.delay);
			
			let l2_t = new Timer(()=>{
				lLightning_spr.show();
				lLightning_spr.play();
				this.__fAnimationsCount_num++;
			}, lInfo_obj.delay + REPEAT_DELAY);

			this._fLightningsTimers_t_arr.push(l_t);
			this._fLightningsTimers_t_arr.push(l2_t);
		}
		
		let lBigLightning_spr = this.addChild(new Sprite());
		lBigLightning_spr.textures = generateLightningTextures();
		lBigLightning_spr.alpha = 0.9;
		lBigLightning_spr.animationSpeed = 0.25;
		lBigLightning_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lBigLightning_spr.scale.set(2.2, 1.3);
		lBigLightning_spr.position.set(25, 0);
		lBigLightning_spr.hide();
		lBigLightning_spr.on('animationend', ()=>{
			lBigLightning_spr.destroy();
			this.__decreaseAnimationsCount();
		});

		let l_t = new Timer(()=>{
			lBigLightning_spr.show();
			lBigLightning_spr.play();
			this.__fAnimationsCount_num++;
		}, 3*FRAME_RATE);

		this._fLightningsTimers_t_arr.push(l_t);
		// ...LIGHTNINGS

		// RINGS...
		let lRings_spr = this.__fBackgroundContainer_sprt.addChild(new Sprite());
		lRings_spr.textures = generateLightningRingTextures();
		lRings_spr.animationSpeed = 0.3;
		lRings_spr.position.set(-190, -10);
		lRings_spr.scale.set(1.2);
		lRings_spr.alpha = 0.7;
		lRings_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lRings_spr.hide();
		lRings_spr.play();

		l_t = new Timer(()=>{
			lRings_spr.show();
			lRings_spr.moveTo(190, 10, 14*FRAME_RATE, null, ()=>{
				lRings_spr.hide();
				lRings_spr.position.set(-190, -10);
				this.__decreaseAnimationsCount();
			});
			this.__fAnimationsCount_num++;
		}, 6*FRAME_RATE);
		
		let l2_t = new Timer(()=>{
			lRings_spr.show();
			lRings_spr.moveTo(210, 10, 14*FRAME_RATE, null, ()=>{
				lRings_spr.hide();
				this.__decreaseAnimationsCount();
			});
			this.__fAnimationsCount_num++;
		}, 6*FRAME_RATE + REPEAT_DELAY);

		this._fLightningsTimers_t_arr.push(l_t);
		this._fLightningsTimers_t_arr.push(l2_t);
		// ...RINGS
	}

	/**
	 * Starts smokes and particles animations.
	 * @private
	 */
	_startIntroExplosion()
	{
		if (!this._fSmokes_spr_arr)
		{
			this._fSmokes_spr_arr = [];
		}

		// SMOKES...
		const SMOKES_ALPHA_SEQ = [
			{tweens: [{prop: "alpha", to: 0.73}], duration: 8*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0}], duration: 65*FRAME_RATE, onfinish: this.__decreaseAnimationsCount.bind(this)}
		];

		const PINK_SMOKES_INFO = [
			{
				startScale: 1.19,
				finalScale: 1.5,
				startPosition: {x: -10, y: -30},
				finalPosition: {x: 20, y: -95},
				delay: 9*FRAME_RATE,
				startRotation: 0,
				finalRotation: 0.6283185307179586, //Utils.gradToRad(36)
			},
			{
				startScale: 1.19,
				finalScale: 1.5,
				startPosition: {x: -20, y: -30},
				finalPosition: {x: -110, y: -100},
				delay: 4*FRAME_RATE,
				startRotation: 0.6283185307179586, //Utils.gradToRad(36)
				finalRotation: 2.3736477827122884, //Utils.gradToRad(136)
			},
			{
				startScale: 1.74,
				finalScale: 2.05,
				startPosition: {x: -10, y: -70},
				finalPosition: {x: 50, y: -140},
				delay: 6*FRAME_RATE,
				startRotation: 0,
				finalRotation: 0.6283185307179586, //Utils.gradToRad(36)
			},
			{
				startScale: 1.94,
				finalScale: 2.25,
				startPosition: {x: -20, y: 30},
				finalPosition: {x: -290, y: -70},
				delay: 5*FRAME_RATE,
				startRotation: 0,
				finalRotation: -1.9198621771937625, //Utils.gradToRad(-110)
			},
			{
				startScale: 2.02,
				finalScale: 2.33,
				startPosition: {x: 20, y: 0},
				finalPosition: {x: -140, y: 145},
				delay: 7*FRAME_RATE,
				startRotation: 0.6283185307179586, //Utils.gradToRad(36)
				finalRotation: 2.3736477827122884, //Utils.gradToRad(136)
			},
			{
				startScale: 2.15,
				finalScale: 2.46,
				startPosition: {x: 40, y: 20},
				finalPosition: {x: 280, y: -55},
				delay: 3*FRAME_RATE,
				startRotation: 0,
				finalRotation: 2.251474735072685, //Utils.gradToRad(129)
			},
		];

		for (let lInfo_obj of PINK_SMOKES_INFO)
		{
			let l_spr = this.__fBackgroundContainer_sprt.addChild(APP.library.getSpriteFromAtlas("boss_mode/lightning/smoke_pink"));
			l_spr.position = lInfo_obj.startPosition;
			l_spr.alpha = 0.1;
			l_spr.rotation = lInfo_obj.startRotation;
			l_spr.scale.set(lInfo_obj.startScale);
			l_spr.moveTo(lInfo_obj.finalPosition.x, lInfo_obj.finalPosition.y, 73*FRAME_RATE, null, this.__decreaseAnimationsCount.bind(this), null, null, lInfo_obj.delay);
			l_spr.rotateTo(lInfo_obj.finalRotation, 73*FRAME_RATE, null, this.__decreaseAnimationsCount.bind(this), null, null, lInfo_obj.delay);
			l_spr.scaleTo(lInfo_obj.finalScale, 73*FRAME_RATE, null, this.__decreaseAnimationsCount.bind(this), null, null, lInfo_obj.delay);
			Sequence.start(l_spr, SMOKES_ALPHA_SEQ, lInfo_obj.delay);
			this._fSmokes_spr_arr.push(l_spr);
			this.__fAnimationsCount_num += 4;
		}
		
		const PURPLE_SMOKES_INFO = [
			{
				startScale: 1.18,
				finalScale: 1.49,
				startPosition: {x: -30, y: 10},
				finalPosition: {x: -300, y: 45},
				delay: 7*FRAME_RATE,
				startRotation: 0,
				finalRotation: -1.9198621771937625, //Utils.gradToRad(-110)
			},
			{
				startScale: 1.63,
				finalScale: 1.94,
				startPosition: {x: 10, y: 0},
				finalPosition: {x: 120, y: 125},
				delay: 5*FRAME_RATE,
				startRotation: 36,
				finalRotation: 2.3736477827122884, //Utils.gradToRad(136)
			},
			{
				startScale: 1.13,
				finalScale: 1.9,
				startPosition: {x: 20, y: 20},
				finalPosition: {x: 300, y: -95},
				delay: 3*FRAME_RATE,
				startRotation: 0,
				finalRotation: 2.251474735072685, //Utils.gradToRad(129)
			},
		];

		for (let lInfo_obj of PURPLE_SMOKES_INFO)
		{
			let l_spr = this.__fBackgroundContainer_sprt.addChild(APP.library.getSpriteFromAtlas("boss_mode/lightning/smoke_purple"));
			l_spr.position = lInfo_obj.startPosition;
			l_spr.alpha = 0.1;
			l_spr.rotation = lInfo_obj.startRotation;
			l_spr.scale.set(lInfo_obj.startScale);
			l_spr.moveTo(lInfo_obj.finalPosition.x, lInfo_obj.finalPosition.y, 73*FRAME_RATE, null, this.__decreaseAnimationsCount.bind(this), null, null, lInfo_obj.delay);
			l_spr.rotateTo(lInfo_obj.finalRotation, 73*FRAME_RATE, null, this.__decreaseAnimationsCount.bind(this), null, null, lInfo_obj.delay);
			l_spr.scaleTo(lInfo_obj.finalScale, 73*FRAME_RATE, null, this.__decreaseAnimationsCount.bind(this), null, null, lInfo_obj.delay);
			Sequence.start(l_spr, SMOKES_ALPHA_SEQ, lInfo_obj.delay);
			this._fSmokes_spr_arr.push(l_spr);
			this.__fAnimationsCount_num += 4;
		}
		// ...SMOKES
		// PARTICLES...
		const MULTIPLE_PARTICLES_POSITIONS = [
			{
				startPosition: {x: 20, y: -40},
				finalPosition: {x: 230, y: -65},
			},
			{
				startPosition: {x: -40, y: -40},
				finalPosition: {x: -270, y: -70},
			},
			{
				startPosition: {x: -80, y: 40},
				finalPosition: {x: -250, y: 150},
			},
			{
				startPosition: {x: 5, y: -75},
				finalPosition: {x: 270, y: 155},
			},
		];

		for (let lPositions_obj of MULTIPLE_PARTICLES_POSITIONS)
		{
			let l_spr = this.__fBackgroundContainer_sprt.addChild(APP.library.getSprite("boss_mode/common/particles_yellow"));
			l_spr.position = lPositions_obj.startPosition;
			l_spr.blendMode = PIXI.BLEND_MODES.ADD;
			l_spr.scale.set(0.4)
			l_spr.moveTo(lPositions_obj.finalPosition.x, lPositions_obj.finalPosition.y, 80*FRAME_RATE, null, this.__decreaseAnimationsCount.bind(this));
			l_spr.fadeTo(0, 43*FRAME_RATE, null, this.__decreaseAnimationsCount.bind(this), null, null, 37*FRAME_RATE);
			this.__fAnimationsCount_num += 2;
		}

		const SINGLE_PARTICLES_POSITIONS = [
			{
				startPosition: {x: 20, y: -40},
				finalPosition: {x: 230, y: -65},
			},
			{
				startPosition: {x: -40, y: -40},
				finalPosition: {x: -300, y: -90},
			},
			{
				startPosition: {x: -60, y: 40},
				finalPosition: {x: -280, y: 180},
			},
			{
				startPosition: {x: 5, y: 15},
				finalPosition: {x: 270, y: 155},
			},
		];

		for (let lPositions_obj of SINGLE_PARTICLES_POSITIONS)
		{
			let l_spr = this.__fBackgroundContainer_sprt.addChild(APP.library.getSpriteFromAtlas("common/light_particle"));
			l_spr.position = lPositions_obj.startPosition;
			l_spr.blendMode = PIXI.BLEND_MODES.ADD;
			l_spr.moveTo(lPositions_obj.finalPosition.x, lPositions_obj.finalPosition.y, 80*FRAME_RATE, null, this.__decreaseAnimationsCount.bind(this));
			l_spr.fadeTo(0, 43*FRAME_RATE, null, this.__decreaseAnimationsCount.bind(this), null, null, 37*FRAME_RATE);
			this.__fAnimationsCount_num += 2;
		}
		// ...PARTICLES
	}

	/**
	 * @private
	 */
	_startFinalExplosion()
	{
		this._fMiniExplosionAnimation_spr = this.addChild(new LightningBossMiniExplosionAnimation());
		this._fMiniExplosionAnimation_spr.on(LightningBossMiniExplosionAnimation.EVENT_ON_ANIMATION_ENDED, this.__decreaseAnimationsCount, this);
		this._fMiniExplosionAnimation_spr.i_startAnimation();
		this.__fAnimationsCount_num++;
	}

	destroy()
	{
		if (Array.isArray(this._fLightningsTimers_t_arr))
		{
			for (let l_t of this._fLightningsTimers_t_arr)
			{
				l_t.destructor();
			}
		}
		this._fLightningsTimers_t_arr = null;

		if (Array.isArray(this._fSmokes_spr_arr))
		{
			for (let l_spr of this._fSmokes_spr_arr)
			{
				l_spr.destroy();
			}
		}
		this._fSmokes_spr_arr = null;

		if (this._fMiniExplosionAnimation_spr)
		{
			this._fMiniExplosionAnimation_spr.off(LightningBossMiniExplosionAnimation.EVENT_ON_ANIMATION_ENDED, this.__decreaseAnimationsCount, this)
			this._fMiniExplosionAnimation_spr.destroy();
		}
		this._fMiniExplosionAnimation_spr = null;

		this._fBacgroundGlow_spr && this._fBacgroundGlow_spr.destroy();
		this._fBacgroundGlow_spr = null;

		this._fBacgroundTextAddCaption_spr && this._fBacgroundTextAddCaption_spr.destroy();
		this._fBacgroundTextAddCaption_spr = null;

		super.destroy();
	}
}

export default LightningBossCaptionView;