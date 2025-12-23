import SimpleUIView from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/SimpleUIView';
import { FRAME_RATE } from '../../../../../../shared/src/CommonConstants';
import Sequence from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { Sprite } from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import { Utils } from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';

const GRADUS = Math.PI / 180;
const START_GRADUS = 36 * GRADUS;

class TransitionRoundEndFXLightView extends SimpleUIView
{
	static get EVENT_ON_INTRO_COMPLETED() { return "EVENT_ON_INTRO_COMPLETED"; }
	static get EVENT_ON_OUTRO_COMPLETED() { return "EVENT_ON_OUTRO_COMPLETED"; }

	constructor()
	{
		super();

		this._fLight8Container_spr = null;
		this._fLight8_spr = null;
		this._fIsLight8IntroPlaying_bl = null;
		this._fIsLight8OutroPlaying_bl = null;
		this._fLight8ContainetWiggleAndRotationPlaying_bl = null;

		this._fLightParticle_spr = null;
		this._fIsLightParticleIntroPlaying_bl = null;
		this._fIsLightParticleOutroPlaying_bl = null;

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._initLightParticle();
			this._initLight8();
		}
	}

	startIntro()
	{
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startLight8Intro();
			this._startLightParticleIntro();
			this._startLight8ContainerIntro();
		}
		else
		{
			this._completeIntroAnimationSuspicision();
		}
	}

	startLoop()
	{
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startLight8Loop();
			this._startLightParticleLoop();
			this._startLight8ContainerLoop();
		}
	}

	startOutro()
	{
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startLight8Outro();
			this._startLightParticleOutro();
		}
		else
		{
			this._completeOutroAnimationSuspicion();
		}
	}

	get light8()
	{
		return this._fLight8_spr || (this._fLight8_spr = this._initLight8());
	}

	_initLight8()
	{
		this._fLight8Container_spr = this.addChild(new Sprite());
		let lLight8_spr = this._fLight8_spr = this._fLight8Container_spr.addChild(APP.library.getSpriteFromAtlas("common/light8"));
		lLight8_spr.alpha = 0;
		return lLight8_spr;
	}

	_startLight8Intro()
	{
		this._fIsLight8IntroPlaying_bl = true;

		let lLight8_spr = this.light8;
		lLight8_spr.alpha = 0;
		lLight8_spr.scale.set(2.138, 2.138);

		let l_seq = [
			{tweens: [], duration: 6 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 3.49},{prop: 'scale.y', to: 3.49}, {prop: 'alpha', to: 0.81}], duration: 13 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 3.431},{prop: 'scale.y', to: 3.431}, {prop: 'alpha', to: 1}], duration: 3 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 2.757},{prop: 'scale.y', to: 2.757}, {prop: 'alpha', to: 0.3}], duration: 34 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 2.5},{prop: 'scale.y', to: 2.5}], duration: 13 * FRAME_RATE,
			onfinish: () => {
				this._fIsLight8IntroPlaying_bl = false;
				this._completeIntroAnimationSuspicision();
		}}];

		Sequence.start(lLight8_spr, l_seq);
	}

	_startLight8Loop()
	{
		let lLight8_spr = this.light8;
		lLight8_spr.alpha = 0.3;
		lLight8_spr.scale.set(2.5, 2.5);
	}

	_startLight8Outro()
	{
		this._fIsLight8OutroPlaying_bl = true;
		let lLight8_spr = this.light8;

		let l_seq = [
			{tweens: [ {prop: 'alpha', to: 0}], duration: 45 * FRAME_RATE,
			onfinish: () => {
				this._fIsLight8OutroPlaying_bl = false;
				this._completeOutroAnimationSuspicion();
		}}];

		Sequence.start(lLight8_spr, l_seq);
	}

	_startLight8ContainerIntro()
	{
		if (!this._fLight8ContainetWiggleAndRotationPlaying_bl)
		{
			this._fLight8Container_spr.rotation = START_GRADUS;
			this._fLight8ContainetWiggleAndRotationPlaying_bl = true;
			this._startLight8ContainerIntroWiggleAndRotation();
		}
	}

	_startLight8ContainerLoop()
	{
		if (!this._fLight8ContainetWiggleAndRotationPlaying_bl)
		{
			this._fLight8Container_spr.rotation = START_GRADUS;
			this._fLight8ContainetWiggleAndRotationPlaying_bl = true;
			this._startLight8ContainerIntroWiggleAndRotation();
		}
	}

	_startLight8ContainerIntroWiggleAndRotation()
	{
		let l_seq = [
			{tweens: [{prop: 'rotation', to: (this._fLight8Container_spr.rotation + GRADUS)},  {prop: 'alpha', to: Utils.getRandomWiggledValue(0.9, 0.1)}], duration: 2 * FRAME_RATE,
			onfinish: () => {
				this._startLight8ContainerIntroWiggleAndRotation();
		}}];

		Sequence.start(this._fLight8Container_spr, l_seq);
	}

	_interruptLight8ContainerIntroWiggleAndRotation()
	{
		this._fLight8ContainetWiggleAndRotationPlaying_bl = false;
		Sequence.destroy(Sequence.findByTarget(this._fLight8Container_spr));
	}

	get lightParticle()
	{
		return this._fLightParticle_spr || (this._fLightParticle_spr = this._initLightParticle());
	}

	_initLightParticle()
	{
		let lLightParticle_spr = this._fLightParticle_spr = this.addChild(APP.library.getSpriteFromAtlas("common/light_particle"));
		lLightParticle_spr.alpha = 0;
		lLightParticle_spr.scale.set(18.88, 18.88);
		this.addChild(lLightParticle_spr);
		return lLightParticle_spr;
	}

	_startLightParticleIntro()
	{
		this._fIsLightParticleIntroPlaying_bl = true;

		let lLightParticle_spr = this.lightParticle;
		lLightParticle_spr.alpha = 0;

		let l_seq = [
			{tweens: [], duration: (4 + 6) * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0.46}], duration: 31 * FRAME_RATE,
			onfinish: () => {
				this._fIsLightParticleIntroPlaying_bl = false;
				this._completeIntroAnimationSuspicision();
		}}];

		Sequence.start(lLightParticle_spr, l_seq);
	}

	_startLightParticleLoop()
	{
		let lLightParticle_spr = this.lightParticle;
		lLightParticle_spr.alpha = 0.46;
	}

	_startLightParticleOutro()
	{
		this._fIsLightParticleOutroPlaying_bl = true;

		let lLightParticle_spr = this.lightParticle;

		let l_seq = [
			{tweens: [], duration: 5 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0}], duration: 30 * FRAME_RATE,
			onfinish: () => {
				this._fIsLightParticleOutroPlaying_bl = false;
				this._completeOutroAnimationSuspicion();
		}}];

		Sequence.start(lLightParticle_spr, l_seq);
	}

	_completeIntroAnimationSuspicision()
	{
		if (!this._fIsLight8IntroPlaying_bl && !this._fIsLightParticleIntroPlaying_bl)
		{
			this.emit(TransitionRoundEndFXLightView.EVENT_ON_INTRO_COMPLETED);
		}
	}

	_completeOutroAnimationSuspicion()
	{
		if (!this._fIsLightParticleOutroPlaying_bl && !this._fIsLight8OutroPlaying_bl)
		{
			this.emit(TransitionRoundEndFXLightView.EVENT_ON_OUTRO_COMPLETED);
			this._interruptLight8ContainerIntroWiggleAndRotation();
		}
	}

	interrupt()
	{
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._fLightParticle_spr && Sequence.destroy(Sequence.findByTarget(this._fLightParticle_spr));
			
			this._fLightParticle_spr.alpha = 0;

			this._fLight8_spr && Sequence.destroy(Sequence.findByTarget(this._fLight8_spr));
			this._fLight8_spr.alpha = 0;

			this._fLight8Container_spr && Sequence.destroy(Sequence.findByTarget(this._fLight8Container_spr));
			this._fLight8Container_spr.rotation = START_GRADUS;	

			this._fIsLight8IntroPlaying_bl = null;
			this._fIsLight8OutroPlaying_bl = null;

			this._fIsLightParticleIntroPlaying_bl = null;
			this._fIsLightParticleOutroPlaying_bl = null;

			this._interruptLight8ContainerIntroWiggleAndRotation();
		}
	}

	destroy()
	{
		this._fLightParticle_spr && Sequence.destroy(Sequence.findByTarget(this._fLightParticle_spr));
		this._fLightParticle_spr = null;

		this._fLight8_spr && Sequence.destroy(Sequence.findByTarget(this._fLight8_spr));
		this._fLight8_spr = null;

		this._fLight8Container_spr && Sequence.destroy(Sequence.findByTarget(this._fLight8Container_spr));
		this._fLight8Container_spr = null;

		this._fIsLight8IntroPlaying_bl = null;
		this._fIsLight8OutroPlaying_bl = null;

		this._fIsLightParticleIntroPlaying_bl = null;
		this._fIsLightParticleOutroPlaying_bl = null;

		super.destroy();
	}
}

export default TransitionRoundEndFXLightView