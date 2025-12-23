import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../shared/src/CommonConstants';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { SHIELD_DESTROY_ANIMATION_SPEED } from '../../enemies/Money';

const ANIMATION_SPEED = SHIELD_DESTROY_ANIMATION_SPEED;

class FormationHighlightAnimation extends Sprite
{
	static get EVENT_ON_ANIMATION_ENDED()				{return "onIntroAnimationEnded";}

	constructor()
	{
		super();
		this._fLightCircle4_spr = null;
		this._fLightCircle5_spr = null;
		this._fLightCirclePurple_spr = null;
		this._fLightParticlePurple_spr = null;
		this._fLightParticleBlue_spr = null;
	}

	i_startAnimation()
	{
		this._playAnimation();
	}

	_playAnimation()
	{
		this._fIsAnimationProgressCount_num = 0;

		this._playLightCircle4();
		this._playLightCircle5();
		this._playLightCirclePurple();

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._playLightParticlePurple();
			this._playLightParticleBlue();
		}
	}

	_playLightCircle4()
	{
		let lLightCircle4_spr = this._fLightCircle4_spr = this.addChild(APP.library.getSprite("enemies/money/hit/light_circle_4"));

		lLightCircle4_spr.aplha = 0.54;
		lLightCircle4_spr.scale.set(1, 1);
		lLightCircle4_spr.blendMode = PIXI.BLEND_MODES.ADD;

		let lLightCircle4_seq = [
			{tweens: [{prop: 'scale.x', to: 1.559}, {prop: 'scale.y', to: 1.559}], duration: 1 * FRAME_RATE / ANIMATION_SPEED},
			{tweens: [{prop: 'scale.x', to: 2.765}, {prop: 'scale.y', to: 2.765}, {prop: 'alpha', to: 0.67}], duration: 2 * FRAME_RATE / ANIMATION_SPEED},
			{tweens: [{prop: 'scale.x', to: 3.72}, {prop: 'scale.y', to: 3.72}, {prop: 'alpha', to: 0.02}], duration: 6 * FRAME_RATE / ANIMATION_SPEED},
			{tweens: [{prop: 'alpha', to: 0}], duration: 1 * FRAME_RATE / ANIMATION_SPEED,
				onfinish: () => {
					lLightCircle4_spr && lLightCircle4_spr.destroy();
					this._fIsAnimationProgressCount_num--;
					this._completeAnimationSuspicision();
		}}];
		this._fIsAnimationProgressCount_num++;
		Sequence.start(lLightCircle4_spr, lLightCircle4_seq);
	}

	_playLightCircle5()
	{
		let lLightCircle5_spr = this._fLightCircle5_spr = this.addChild(APP.library.getSprite("enemies/money/hit/light_circle_5"));
		lLightCircle5_spr.aplha = 0.13;
		lLightCircle5_spr.scale.set(1, 1);
		lLightCircle5_spr.blendMode = PIXI.BLEND_MODES.ADD;

		let lLightCircle5_seq = [
			{tweens: [ {prop: 'scale.x', to: 1.563}, {prop: 'scale.y', to: 1.563}, {prop: 'alpha', to: 0.54}], duration: 1 * FRAME_RATE / ANIMATION_SPEED},
			{tweens: [ {prop: 'scale.x', to: 2.779}, {prop: 'scale.y', to: 2.779}, {prop: 'alpha', to: 0.37}], duration: 2 * FRAME_RATE / ANIMATION_SPEED},
			{tweens: [ {prop: 'scale.x', to: 3.741}, {prop: 'scale.y', to: 3.741}, {prop: 'alpha', to: 0}], duration: 6 * FRAME_RATE / ANIMATION_SPEED,
				onfinish: () => {
					lLightCircle5_spr && lLightCircle5_spr.destroy();
					this._fIsAnimationProgressCount_num--;
					this._completeAnimationSuspicision();
		}}];
		this._fIsAnimationProgressCount_num++;
		Sequence.start(lLightCircle5_spr, lLightCircle5_seq);
	}

	_playLightCirclePurple()
	{
		let lLightCirclePurple_spr = this._fLightCirclePurple_spr = this.addChild(APP.library.getSprite("enemies/money/hit/light_circle_purple"));
		lLightCirclePurple_spr.aplha = 0.2;
		lLightCirclePurple_spr.scale.set(0.65, 0.65);
		lLightCirclePurple_spr.blendMode = PIXI.BLEND_MODES.ADD;

		let lLightCirclePurple_seq = [
			{tweens: [ {prop: 'scale.x', to: 1.234}, {prop: 'scale.y', to: 1.234}, {prop: 'alpha', to: 0.35}], duration: 3 * FRAME_RATE / ANIMATION_SPEED},
			{tweens: [ {prop: 'scale.x', to: 1.544}, {prop: 'scale.y', to: 1.544}, {prop: 'alpha', to: 0}], duration: 5 * FRAME_RATE / ANIMATION_SPEED,
			onfinish: () => {
				lLightCirclePurple_spr && lLightCirclePurple_spr.destroy();
				this._fIsAnimationProgressCount_num--;
				this._completeAnimationSuspicision();
		}}];
		this._fIsAnimationProgressCount_num++;
		Sequence.start(lLightCirclePurple_spr, lLightCirclePurple_seq);
	}

	_playLightParticlePurple()
	{
		let lLightParticlePurple_spr = this._fLightParticlePurple_spr = this.addChild(APP.library.getSpriteFromAtlas("common/light_particle_purple"));
		lLightParticlePurple_spr.aplha = 0.64;
		lLightParticlePurple_spr.scale.set(10.12, 10.12);
		lLightParticlePurple_spr.blendMode = PIXI.BLEND_MODES.ADD;

		let lLightParticlePurple_seq = [
			{tweens: [{prop: 'alpha', to: 0}], duration: 8 * FRAME_RATE / ANIMATION_SPEED,
			onfinish: () => {
				lLightParticlePurple_spr && lLightParticlePurple_spr.destroy();
				this._fIsAnimationProgressCount_num--;
				this._completeAnimationSuspicision();
		}}];
		this._fIsAnimationProgressCount_num++;
		Sequence.start(lLightParticlePurple_spr, lLightParticlePurple_seq);
	}

	_playLightParticleBlue()
	{
		let lLightParticleBlue_spr = this._fLightParticleBlue_spr = this.addChild(APP.library.getSprite("enemies/money/hit/light_particle_blue"));
		lLightParticleBlue_spr.aplha = 0.45;
		lLightParticleBlue_spr.scale.set(3.82, 3.82);
		lLightParticleBlue_spr.blendMode = PIXI.BLEND_MODES.ADD;

		let lLightParticleBlue_seq = [
			{tweens: [{prop: 'alpha', to: 0}], duration: 8 * FRAME_RATE / ANIMATION_SPEED,
			onfinish: () => {
				lLightParticleBlue_spr && lLightParticleBlue_spr.destroy();
				this._fIsAnimationProgressCount_num--;
				this._completeAnimationSuspicision();
		}}];
		this._fIsAnimationProgressCount_num++;
		Sequence.start(lLightParticleBlue_spr, lLightParticleBlue_seq);
	}

	_completeAnimationSuspicision()
	{
		if (this._fIsAnimationProgressCount_num <= 0)
		{
			this.emit(FormationHighlightAnimation.EVENT_ON_ANIMATION_ENDED);
		}
	}

	destroy()
	{
		this._fLightCircle4_spr && Sequence.destroy(Sequence.findByTarget(this._fLightCircle4_spr));
		this._fLightCircle4_spr && this._fLightCircle4_spr.destroy();
		this._fLightCircle4_spr = null;

		this._fLightCircle5_spr && Sequence.destroy(Sequence.findByTarget(this._fLightCircle5_spr));
		this._fLightCircle5_spr && this._fLightCircle5_spr.destroy();
		this._fLightCircle5_spr = null;

		this._fLightCirclePurple_spr && Sequence.destroy(Sequence.findByTarget(this._fLightCirclePurple_spr));
		this._fLightCirclePurple_spr && this._fLightCirclePurple_spr.destroy();
		this._fLightCirclePurple_spr = null;
		
		this._fLightParticlePurple_spr && Sequence.destroy(Sequence.findByTarget(this._fLightParticlePurple_spr));
		this._fLightParticlePurple_spr && this._fLightParticlePurple_spr.destroy();
		this._fLightParticlePurple_spr = null;
		
		this._fLightParticleBlue_spr && Sequence.destroy(Sequence.findByTarget(this._fLightParticleBlue_spr));
		this._fLightParticleBlue_spr && this._fLightParticleBlue_spr.destroy();
		this._fLightParticleBlue_spr = null;

		this._fIsAnimationProgressCount_num = null;

		super.destroy();
	}
}

export default FormationHighlightAnimation;