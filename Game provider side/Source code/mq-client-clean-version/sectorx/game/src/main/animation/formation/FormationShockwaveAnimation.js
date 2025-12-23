import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../shared/src/CommonConstants';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import * as Easing from '../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { Utils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { SHIELD_DESTROY_ANIMATION_SPEED } from '../../enemies/Money';

const ANIMATION_SPEED = SHIELD_DESTROY_ANIMATION_SPEED;

class FormationShockwaveAnimation extends Sprite
{
	static get EVENT_ON_ANIMATION_ENDED()				{return "onIntroAnimationEnded";}

	constructor()
	{
		super();
		this._fLightParticlePurple_spr = null;
		this._fLightParticleBlue_spr = null;
		this._fArcGlow1_spr = null;
		this._fArcGlow2_spr = null;
		this._fFireSmoke1_spr = null;
		this._fFireSmoke2_spr = null;
		this._fParticlesBlue1_spr = null;
		this._fParticlesBlue2_spr = null;
		this._fParticlesBlue3_spr = null;
	}

	i_startAnimation()
	{
		this._playAnimation();
	}

	_playAnimation()
	{
		this._fIsAnimationProgressCount_num = 0;

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startLightParticlePurpleAnimation();
			this._startLightParticleBlueAnimation();
		}
		
		this._startArcGlowAnimation();

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startFireSmokeAnimation();
		}

		this._startParticlesBlueAnimation();
	}

	_startLightParticlePurpleAnimation()
	{
		this._fIsAnimationProgressCount_num++;
		let lLightParticlePurple_spr = this._fLightParticlePurple_spr = this.addChild(APP.library.getSpriteFromAtlas("common/light_particle_purple"));
		lLightParticlePurple_spr.aplha = 0;
		lLightParticlePurple_spr.scale.set(4.335, 4.335);
		lLightParticlePurple_spr.position.set(0.5, 2);

		let l_seq = [
			{tweens: [{prop: 'alpha', to: 0.8}], duration: 1 * FRAME_RATE / ANIMATION_SPEED},
			{tweens: [{prop: 'alpha', to: 0}], duration: 9 * FRAME_RATE / ANIMATION_SPEED,
			onfinish: () => {
				lLightParticlePurple_spr && lLightParticlePurple_spr.destroy();
				this._fIsAnimationProgressCount_num--;
				this._completeAnimationSuspicision();
		}}];
		Sequence.start(lLightParticlePurple_spr, l_seq);
	}

	_startLightParticleBlueAnimation()
	{
		this._fIsAnimationProgressCount_num++;
		let lLightParticleBlue_spr = this._fLightParticleBlue_spr = this.addChild(APP.library.getSprite("enemies/money/hit/light_particle_blue"));
		lLightParticleBlue_spr.aplha = 0;
		lLightParticleBlue_spr.scale.set(3.804, 1.82);
		lLightParticleBlue_spr.position.set(1, -8.5);

		let l_seq = [
			{tweens: [{prop: 'alpha', to: 0.51}], duration: 1 * FRAME_RATE / ANIMATION_SPEED},
			{tweens: [{prop: 'alpha', to: 0}], duration: 9 * FRAME_RATE / ANIMATION_SPEED,
			onfinish: () => {
				lLightParticleBlue_spr && lLightParticleBlue_spr.destroy();
				this._fIsAnimationProgressCount_num--;
				this._completeAnimationSuspicision();
		}}];
		Sequence.start(lLightParticleBlue_spr, l_seq);
	}

	_startArcGlowAnimation()
	{
		let lArcGlow1_spr = this._fArcGlow1_spr = this.addChild(APP.library.getSprite("enemies/money/shockwave/arc_glow"));
		let lArcGlow2_spr = this._fArcGlow2_spr = this.addChild(APP.library.getSprite("enemies/money/shockwave/arc_glow"));

		lArcGlow1_spr.aplha = 0;
		lArcGlow1_spr.scale.set(0.67, 0.67);
		lArcGlow1_spr.position.set(1, 11.5);

		let l_seq = [
			{tweens: [{prop: 'alpha', to: 0.8}], duration: 3 * FRAME_RATE / ANIMATION_SPEED},
			{tweens: [{prop: 'alpha', to: 0}], duration: 7 * FRAME_RATE / ANIMATION_SPEED,
			onfinish: () => {
				lArcGlow1_spr && lArcGlow1_spr.destroy();
				this._fIsAnimationProgressCount_num--;
				this._completeAnimationSuspicision();
		}}];
		this._fIsAnimationProgressCount_num++;
		Sequence.start(lArcGlow1_spr, l_seq);

		lArcGlow2_spr.aplha = 0;
		lArcGlow2_spr.scale.set(0.67, 0.67);
		lArcGlow2_spr.position.set(1, 21.15);

		l_seq = [
			{tweens: [{prop: 'alpha', to: 0.7}], duration: 1 * FRAME_RATE / ANIMATION_SPEED},
			{tweens: [{prop: 'alpha', to: 0}], duration: 9 * FRAME_RATE / ANIMATION_SPEED,
			onfinish: () => {
				lArcGlow2_spr && lArcGlow2_spr.destroy();
				this._fIsAnimationProgressCount_num--;
				this._completeAnimationSuspicision();
		}}];
		this._fIsAnimationProgressCount_num++;
		Sequence.start(lArcGlow2_spr, l_seq);
	}

	_startFireSmokeAnimation()
	{
		this._startFireSmokeAnimation1();
		this._startFireSmokeAnimation2();
	}

	_startFireSmokeAnimation1()
	{
		let lFireSmoke1_spr = this._fFireSmoke1_spr = this.addChild(APP.library.getSprite("enemies/money/shockwave/fire_smoke"));
		lFireSmoke1_spr.aplha = 0;
		lFireSmoke1_spr.position.set(0, 11);
		lFireSmoke1_spr.scale.set(0.464, 0.464); //0.116 * 4, 0.116 * 4
		lFireSmoke1_spr.rotation = 1.759291886010284; //Utils.gradToRad(100.8);

		let l_seq = [
			{tweens: [], duration: 3 * FRAME_RATE / ANIMATION_SPEED},
			{tweens: [
						{prop: 'y', to: 109.5}, 
						{prop: 'scale.x', to: 0.744}, //0.186 * 4
						{prop: 'scale.y', to: 0.744}, //0.186 * 4
						{prop: 'rotation', to: 1.5760323145508794} // Utils.gradToRad(90.3)
					], ease: Easing.quadratic.easeIn, duration: 43 * FRAME_RATE / ANIMATION_SPEED,
			onfinish: () => {
				lFireSmoke1_spr && lFireSmoke1_spr.destroy();
				this._fIsAnimationProgressCount_num--;
				this._completeAnimationSuspicision();
		}}];
		this._fIsAnimationProgressCount_num++;
		Sequence.start(lFireSmoke1_spr, l_seq);

		l_seq = [
			{tweens: [], duration: 3 * FRAME_RATE / ANIMATION_SPEED},
			{tweens: [{prop: 'alpha', to: 1}], duration: 2 * FRAME_RATE / ANIMATION_SPEED},
			{tweens: [{prop: 'alpha', to: 0}], ease: Easing.quadratic.easeIn, duration: 28 * FRAME_RATE / ANIMATION_SPEED,
			onfinish: () => {
				this._fIsAnimationProgressCount_num--;
				this._completeAnimationSuspicision();
		}}];
		this._fIsAnimationProgressCount_num++;
		Sequence.start(lFireSmoke1_spr, l_seq);
	}

	_startFireSmokeAnimation2()
	{
		let lFireSmoke2_spr = this._fFireSmoke2_spr = this.addChild(APP.library.getSprite("enemies/money/shockwave/fire_smoke"));
		lFireSmoke2_spr.aplha = 0;
		lFireSmoke2_spr.position.set(0, 11);
		lFireSmoke2_spr.scale.set(0.704, 0.704); //0.176 * 4, 0.176 * 4
		lFireSmoke2_spr.rotation = 4.359832471481836; //Utils.gradToRad(249.8);

		let l_seq = [
			{tweens: [], duration: 0 * FRAME_RATE / ANIMATION_SPEED},
			{tweens: [
						{prop: 'y', to: 109.5}, 
						{prop: 'scale.x', to: 0.984}, //0.246 * 4
						{prop: 'scale.y', to: 0.984}, //0.246 * 4
						{prop: 'rotation', to: 4.176572900022431} //Utils.gradToRad(239.3)
					], ease: Easing.quadratic.easeIn, duration: 40 * FRAME_RATE / ANIMATION_SPEED,
			onfinish: () => {
				lFireSmoke2_spr && lFireSmoke2_spr.destroy();
				this._fIsAnimationProgressCount_num--;
				this._completeAnimationSuspicision();
		}}];
		this._fIsAnimationProgressCount_num++;
		Sequence.start(lFireSmoke2_spr, l_seq);

		l_seq = [
			{tweens: [], duration: 0 * FRAME_RATE / ANIMATION_SPEED},
			{tweens: [{prop: 'alpha', to: 0.44}], duration: 2 * FRAME_RATE / ANIMATION_SPEED},
			{tweens: [{prop: 'alpha', to: 0}], ease: Easing.quadratic.easeIn, duration: 25 * FRAME_RATE / ANIMATION_SPEED,
			onfinish: () => {
				this._fIsAnimationProgressCount_num--;
				this._completeAnimationSuspicision();
		}}];
		this._fIsAnimationProgressCount_num++;
		Sequence.start(lFireSmoke2_spr, l_seq);
	}

	_startParticlesBlueAnimation()
	{
		this._startParticlesBlueAnimation1();
		this._startParticlesBlueAnimation2();
		this._startParticlesBlueAnimation3();
	}

	_startParticlesBlueAnimation1()
	{
		let lParticlesBlue1_spr = this._fParticlesBlue1_spr = this.addChild(APP.library.getSprite("enemies/money/shockwave/particles_blue"));
		lParticlesBlue1_spr.aplha = 0;
		lParticlesBlue1_spr.position.set(-6.5, 9.5);
		lParticlesBlue1_spr.scale.set(0.392, 0.392); //0.196 * 2, 0.196 * 2
		lParticlesBlue1_spr.rotation = 1.064650843716541; //Utils.gradToRad(61);

		let l_seq = [
			{tweens: [
						{prop: 'y', to: 109}, 
						{prop: 'scale.x', to: 0.832}, //0.416 * 2
						{prop: 'scale.y', to: 0.832}, //0.416 * 2
						{prop: 'rotation', to: 2.076941809873252} // Utils.gradToRad(119)
					], ease: Easing.quadratic.easeIn, duration: 34 * FRAME_RATE / ANIMATION_SPEED,
			onfinish: () => {
				this._fIsAnimationProgressCount_num--;
				this._completeAnimationSuspicision();
		}}];
		this._fIsAnimationProgressCount_num++;
		Sequence.start(lParticlesBlue1_spr, l_seq);

		l_seq = [
			{tweens: [{prop: 'x', to: -5}], duration: 3 * FRAME_RATE / ANIMATION_SPEED},
			{tweens: [{prop: 'x', to: -6.75}], duration: 31 * FRAME_RATE / ANIMATION_SPEED,
			onfinish: () => {
				Sequence.destroy(Sequence.findByTarget(this.lParticlesBlue1_spr));
				lParticlesBlue1_spr && lParticlesBlue1_spr.destroy();
				this._fIsAnimationProgressCount_num--;
				this._completeAnimationSuspicision();
		}}];
		this._fIsAnimationProgressCount_num++;
		Sequence.start(lParticlesBlue1_spr, l_seq);

		l_seq = [
			{tweens: [{prop: 'alpha', to: 1}], duration: 2 * FRAME_RATE / ANIMATION_SPEED},
			{tweens: [{prop: 'alpha', to: 0}], ease: Easing.quadratic.easeIn, duration: 22 * FRAME_RATE / ANIMATION_SPEED,
			onfinish: () => {
				this._fIsAnimationProgressCount_num--;
				this._completeAnimationSuspicision();
		}}];
		this._fIsAnimationProgressCount_num++;
		Sequence.start(lParticlesBlue1_spr, l_seq);
	}

	_startParticlesBlueAnimation2()
	{
		let lParticlesBlue2_spr = this._fParticlesBlue2_spr = this.addChild(APP.library.getSprite("enemies/money/shockwave/particles_blue"));
		lParticlesBlue2_spr.aplha = 0;
		lParticlesBlue2_spr.position.set(-6.5, 9.5);
		lParticlesBlue2_spr.scale.set(0.652, 0.652); //0.326 * 2, 0.326 * 2
		lParticlesBlue2_spr.rotation = 3.2637657012293966; //Utils.gradToRad(187);

		let l_seq = [
			{tweens: [
						{prop: 'y', to: 129.5}, 
						{prop: 'scale.x', to: 1.092}, //0.546 * 2
						{prop: 'scale.y', to: 1.092}, //0.546 * 2
						{prop: 'rotation', to: 2.4085543677521746} // Utils.gradToRad(138)
					], ease: Easing.quadratic.easeIn, duration: 27 * FRAME_RATE / ANIMATION_SPEED,
			onfinish: () => {
				this._fIsAnimationProgressCount_num--;
				this._completeAnimationSuspicision();
		}}];
		this._fIsAnimationProgressCount_num++;
		Sequence.start(lParticlesBlue2_spr, l_seq);

		l_seq = [
			{tweens: [{prop: 'x', to: -12.15}], duration: 3 * FRAME_RATE / ANIMATION_SPEED},
			{tweens: [{prop: 'x', to: 19.5}], duration: 24 * FRAME_RATE / ANIMATION_SPEED,
			onfinish: () => {
				Sequence.destroy(Sequence.findByTarget(this.lParticlesBlue2_spr));
				lParticlesBlue2_spr && lParticlesBlue2_spr.destroy();
				this._fIsAnimationProgressCount_num--;
				this._completeAnimationSuspicision();
		}}];
		this._fIsAnimationProgressCount_num++;
		Sequence.start(lParticlesBlue2_spr, l_seq);

		l_seq = [
			{tweens: [{prop: 'alpha', to: 1}], duration: 2 * FRAME_RATE / ANIMATION_SPEED},
			{tweens: [{prop: 'alpha', to: 0}], ease: Easing.quadratic.easeIn, duration: 15 * FRAME_RATE / ANIMATION_SPEED,
			onfinish: () => {
				this._fIsAnimationProgressCount_num--;
				this._completeAnimationSuspicision();
		}}];
		this._fIsAnimationProgressCount_num++;
		Sequence.start(lParticlesBlue2_spr, l_seq);
	}

	_startParticlesBlueAnimation3()
	{
		let lParticlesBlue3_spr = this._fParticlesBlue3_spr = this.addChild(APP.library.getSprite("enemies/money/shockwave/particles_blue"));
		lParticlesBlue3_spr.aplha = 0;
		lParticlesBlue3_spr.position.set(6.5, -5);
		lParticlesBlue3_spr.scale.set(0.392, 0.392); //0.196 * 2, 0.196 * 2
		lParticlesBlue3_spr.rotation = 3.193952531149623; //Utils.gradToRad(183);

		let l_seq = [
			{tweens: [], duration: 2 * FRAME_RATE / ANIMATION_SPEED},
			{tweens: [
						{prop: 'y', to: 98}, 
						{prop: 'scale.x', to: 0.832}, //0.416 * 2
						{prop: 'scale.y', to: 0.832}, //0.416 * 2
						{prop: 'rotation', to: 4.2062434973063345} // Utils.gradToRad(241)
					], ease: Easing.quadratic.easeIn, duration: 23 * FRAME_RATE / ANIMATION_SPEED,
			onfinish: () => {
				this._fIsAnimationProgressCount_num--;
				this._completeAnimationSuspicision();
		}}];
		this._fIsAnimationProgressCount_num++;
		Sequence.start(lParticlesBlue3_spr, l_seq);

		l_seq = [
			{tweens: [], duration: 2 * FRAME_RATE / ANIMATION_SPEED},
			{tweens: [{prop: 'x', to: -1.55}], duration: 9 * FRAME_RATE / ANIMATION_SPEED},
			{tweens: [{prop: 'x', to: 0.5}], duration: 14 * FRAME_RATE / ANIMATION_SPEED,
			onfinish: () => {
				Sequence.destroy(Sequence.findByTarget(this.lParticlesBlue3_spr));
				lParticlesBlue3_spr && lParticlesBlue3_spr.destroy();
				this._fIsAnimationProgressCount_num--;
				this._completeAnimationSuspicision();
		}}];
		this._fIsAnimationProgressCount_num++;
		Sequence.start(lParticlesBlue3_spr, l_seq);

		l_seq = [
			{tweens: [], duration: 2 * FRAME_RATE / ANIMATION_SPEED},
			{tweens: [{prop: 'alpha', to: 1}], duration: 2 * FRAME_RATE / ANIMATION_SPEED},
			{tweens: [{prop: 'alpha', to: 0}], ease: Easing.quadratic.easeIn, duration: 11 * FRAME_RATE / ANIMATION_SPEED,
			onfinish: () => {
				this._fIsAnimationProgressCount_num--;
				this._completeAnimationSuspicision();
		}}];
		this._fIsAnimationProgressCount_num++;
		Sequence.start(lParticlesBlue3_spr, l_seq);
	}
	
	_completeAnimationSuspicision()
	{
		if (this._fIsAnimationProgressCount_num <= 0)
		{
			this.emit(FormationShockwaveAnimation.EVENT_ON_ANIMATION_ENDED);
		}
	}

	destroy()
	{
		this._fLightParticlePurple_spr && Sequence.destroy(Sequence.findByTarget(this._fLightParticlePurple_spr));
		this._fLightParticlePurple_spr && this._fLightParticlePurple_spr.destroy();
		this._fLightParticlePurple_spr = null;

		this._fLightParticleBlue_spr && Sequence.destroy(Sequence.findByTarget(this._fLightParticleBlue_spr));
		this._fLightParticleBlue_spr && this._fLightParticleBlue_spr.destroy();
		this._fLightParticleBlue_spr = null;

		this._fArcGlow1_spr && Sequence.destroy(Sequence.findByTarget(this._fArcGlow1_spr));
		this._fArcGlow1_spr && this._fArcGlow1_spr.destroy();
		this._fArcGlow1_spr = null;
		
		this._fArcGlow2_spr && Sequence.destroy(Sequence.findByTarget(this._fArcGlow2_spr));
		this._fArcGlow2_spr && this._fArcGlow2_spr.destroy();
		this._fArcGlow2_spr = null;
		
		this._fFireSmoke1_spr && Sequence.destroy(Sequence.findByTarget(this._fFireSmoke1_spr));
		this._fFireSmoke1_spr && this._fFireSmoke1_spr.destroy();
		this._fFireSmoke1_spr = null;

		this._fFireSmoke2_spr && Sequence.destroy(Sequence.findByTarget(this._fFireSmoke2_spr));
		this._fFireSmoke2_spr && this._fFireSmoke2_spr.destroy();
		this._fFireSmoke2_spr = null;

		this._fParticlesBlue1_spr && Sequence.destroy(Sequence.findByTarget(this._fParticlesBlue1_spr));
		this._fParticlesBlue1_spr && this._fParticlesBlue1_spr.destroy();
		this._fParticlesBlue1_spr = null;

		this._fParticlesBlue2_spr && Sequence.destroy(Sequence.findByTarget(this._fParticlesBlue2_spr));
		this._fParticlesBlue2_spr && this._fParticlesBlue2_spr.destroy();
		this._fParticlesBlue2_spr = null;

		this._fParticlesBlue3_spr && Sequence.destroy(Sequence.findByTarget(this._fParticlesBlue3_spr));
		this._fParticlesBlue3_spr && this._fParticlesBlue3_spr.destroy();
		this._fParticlesBlue3_spr = null;

		this._fIsAnimationProgressCount_num = null;

		super.destroy();
	}
}

export default FormationShockwaveAnimation;