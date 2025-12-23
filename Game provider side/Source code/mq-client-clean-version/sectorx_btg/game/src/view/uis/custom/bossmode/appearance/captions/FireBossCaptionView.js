import { APP } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import BossModeCaptionView from './BossModeCaptionView';
import I18 from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
import { FRAME_RATE } from '../../../../../../../../shared/src/CommonConstants';
import { Sequence } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import { generateFlameTextures } from '../../../../../../main/animation/boss_mode/fire/FlameAnimation';
import { Sprite } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import { generateEnergyTextures } from '../../../../../../main/animation/boss_mode/fire/AppearingTopFlareAnimation';
import { generateAppearingSmokeTextures } from '../../../../../../main/animation/boss_mode/fire/AppearingSmokeAnimation';


class FireBossCaptionView extends BossModeCaptionView
{
	//INIT...
	constructor()
	{
		super();
		this._fBacgroundGlow_spr = null;
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
			this._startFlameAnimation();
			this._startSmokesAnimations();
		}
	}

	/**
	 * @override
	 * @protected
	 * @returns {CTranslatableAsset} Fire boss caption image.
	 */
	__getTranslatableImageCaptionAsset()
	{
		return I18.generateNewCTranslatableAsset("TABossModeFireBossLabel");
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
			this._fBacgroundGlow_spr = this.__fCaptionContainer_sprt.addChild(APP.library.getSpriteFromAtlas("boss_mode/fire/glow"));
			this._fBacgroundGlow_spr.scale.set(4, 1.4);
			this._fBacgroundGlow_spr.position.set(20, -20);
			this._fBacgroundGlow_spr.blendMode = PIXI.BLEND_MODES.ADD;

			let lAlphaSeq_obj_arr = [
				{tweens: [{prop: "alpha", to: 0.7}], duration: 6*FRAME_RATE},
				{tweens: [{prop: "alpha", to: 1}], duration: 5*FRAME_RATE},
				{tweens: [], duration: 4*FRAME_RATE},
				{tweens: [{prop: "alpha", to: 0.66}], duration: 4*FRAME_RATE},
				{tweens: [], duration: 3*FRAME_RATE},
				{tweens: [{prop: "alpha", to: 0.3}], duration: 6*FRAME_RATE},
				{tweens: [{prop: "alpha", to: 1}], duration: 17*FRAME_RATE},
				{tweens: [], duration: 4*FRAME_RATE},
				{tweens: [{prop: "alpha", to: 0.3}], duration: 6*FRAME_RATE},
				{tweens: [{prop: "alpha", to: 1}], duration: 17*FRAME_RATE},
				{tweens: [{prop: "alpha", to: 0.66}], duration: 4*FRAME_RATE},
				{tweens: [], duration: 3*FRAME_RATE},
				{tweens: [{prop: "alpha", to: 0}], duration: 6*FRAME_RATE, onfinish: this.__decreaseAnimationsCount.bind(this)},
			];
			Sequence.start(this._fBacgroundGlow_spr, lAlphaSeq_obj_arr);
			this.__fAnimationsCount_num++;
		}

		super.__startCaptionAnimation();
	}

	/**
	 * @override
	 * @protected
	 */
	__onCaptionDisappearanceStarted()
	{
		this._startFinalFlaresAnimations();
	}

	/**
	 * @private
	 */
	_startFlameAnimation()
	{
		let lFlame_spr = this.addChild(new Sprite());
		let lFlameTextures_t_arr = generateFlameTextures();
		lFlame_spr.textures = lFlameTextures_t_arr.slice(9);
		lFlame_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lFlame_spr.animationSpeed = 0.5;
		lFlame_spr.scale.set(1.6);
		lFlame_spr.position.set(10, 15);
		lFlame_spr.on('animationend', ()=>{
			lFlame_spr.destroy();
			this.__decreaseAnimationsCount();
		});
		lFlame_spr.play();
		this.__fAnimationsCount_num++;
	}

	/**
	 * @private
	 */
	_startSmokesAnimations()
	{
		const SMOKES_POSITIONS = [
			{x: -40, y: -20},
			{x: 210, y: 0},
			{x: 180, y: 20},
			{x: 80, y: 10},
			{x: -110, y: 0}
		];

		for (let lPosition_obj of SMOKES_POSITIONS)
		{
			let lSmoke_spr = this.__fBackgroundContainer_sprt.addChild(new Sprite());
			lSmoke_spr.textures = generateAppearingSmokeTextures();
			lSmoke_spr.animationSpeed = 0.5;
			lSmoke_spr.scale.set(2.5);
			lSmoke_spr.anchor.set(0.7, 0.6);
			lSmoke_spr.position = lPosition_obj;
			lSmoke_spr.on('animationend', ()=>{
				lSmoke_spr.destroy();
				this.__decreaseAnimationsCount();
			});
			lSmoke_spr.play();
			this.__fAnimationsCount_num++;
		}
	}

	/**
	 * @private
	 */
	_startFinalFlaresAnimations()
	{
		let lFlare_spr = this.__fBackgroundContainer_sprt.addChild(APP.library.getSpriteFromAtlas("boss_mode/fire/glow"));
		lFlare_spr.scale.set(2, 1.4);
		lFlare_spr.position.set(20, -20);
		lFlare_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lFlare_spr.fadeTo(0, 15*FRAME_RATE, null, this.__decreaseAnimationsCount.bind(this));
		this.__fAnimationsCount_num++;

		let lEnergyFlame_spr = this.addChild(new Sprite());
		lEnergyFlame_spr.textures = generateEnergyTextures();
		lEnergyFlame_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lEnergyFlame_spr.animationSpeed = 0.5;
		lEnergyFlame_spr.scale.set(1.6);
		lEnergyFlame_spr.on('animationend', ()=>{
			lEnergyFlame_spr.destroy();
			this.__decreaseAnimationsCount();
		});
		lEnergyFlame_spr.play();
		this.__fAnimationsCount_num++;
	}

	destroy()
	{
		this._fBacgroundGlow_spr && Sequence.destroy(Sequence.findByTarget(this._fBacgroundGlow_spr));
		this._fBacgroundGlow_spr && this._fBacgroundGlow_spr.destroy();
		this._fBacgroundGlow_spr = null;

		super.destroy();
	}
}

export default FireBossCaptionView;