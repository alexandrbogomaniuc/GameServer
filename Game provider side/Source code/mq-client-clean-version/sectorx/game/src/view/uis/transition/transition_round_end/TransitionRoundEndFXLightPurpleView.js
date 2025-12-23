import SimpleUIView from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/SimpleUIView';
import { FRAME_RATE } from '../../../../../../shared/src/CommonConstants';
import Sequence from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';

class TransitionRoundEndFXLightPurpleView extends SimpleUIView
{
	static get EVENT_ON_INTRO_COMPLETED() { return "EVENT_ON_INTRO_COMPLETED"; }
	static get EVENT_ON_OUTRO_COMPLETED() { return "EVENT_ON_OUTRO_COMPLETED"; }

	constructor()
	{
		super();

		this._fLightParticlePurple_spr = null;
		this._fIsLightParticlePurpleIntroPlaying_bl = null;
		this._fIsLightParticlePurpleOutroPlaying_bl = null;

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._initLightParticlePurple();
		}
	}

	startIntro()
	{
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startLightParticlePurpleIntro();
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
			this._startLightParticlePurpleLoop();
		}
	}

	startOutro()
	{
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startLightParticlePurpleOutro();
		}
		else
		{
			this._completeOutroAnimationSuspicision();
		}
	}

	get lightParticlePurple()
	{
		return this._fLightParticlePurple_spr || (this._fLightParticlePurple_spr = this._initLightParticlePurple());
	}

	_initLightParticlePurple()
	{
		let lLightParticle_spr = this._fLightParticlePurple_spr = this.addChild(APP.library.getSpriteFromAtlas("common/light_particle_purple"));
		lLightParticle_spr.alpha = 0;
		lLightParticle_spr.scale.set(16.22, 16.22);
		this.addChild(lLightParticle_spr);
		return lLightParticle_spr;
	}

	_startLightParticlePurpleIntro()
	{
		this._fIsLightParticlePurpleIntroPlaying_bl = true;

		let lLightParticle_spr = this.lightParticlePurple;
		lLightParticle_spr.alpha = 0;

		let l_seq = [
			{tweens: [], duration: 13 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}], duration: 21 * FRAME_RATE,
			onfinish: () => {
				this._fIsLightParticlePurpleIntroPlaying_bl = false;
				this._completeIntroAnimationSuspicision();
		}}];

		Sequence.start(lLightParticle_spr, l_seq);
	}

	_startLightParticlePurpleLoop()
	{
		this.lightParticlePurple.alpha = 1;
	}

	_completeIntroAnimationSuspicision()
	{
		if (!this._fIsLightParticlePurpleIntroPlaying_bl)
		{
			this.emit(TransitionRoundEndFXLightPurpleView.EVENT_ON_INTRO_COMPLETED);
		}
	}

	_startLightParticlePurpleOutro()
	{
		this._fIsLightParticlePurpleOutroPlaying_bl = true;

		let lLightParticle_spr = this.lightParticlePurple;

		let l_seq = [
			{tweens: [], duration: 14 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0}], duration: 21 * FRAME_RATE,
			onfinish: () => {
				this._fIsLightParticlePurpleOutroPlaying_bl = false;
				this._completeOutroAnimationSuspicision();
		}}];

		Sequence.start(lLightParticle_spr, l_seq);
	}

	_completeOutroAnimationSuspicision()
	{
		if (!this._fIsLightParticlePurpleOutroPlaying_bl)
		{
			this.emit(TransitionRoundEndFXLightPurpleView.EVENT_ON_OUTRO_COMPLETED);
		}
	}

	interrupt()
	{
		this._fLightParticlePurple_spr && Sequence.destroy(Sequence.findByTarget(this._fLightParticlePurple_spr));

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._fLightParticlePurple_spr.alpha = 0;
		}

		this._fIsLightParticlePurpleIntroPlaying_bl = null;
		this._fIsLightParticlePurpleOutroPlaying_bl = null;
	}

	destroy()
	{
		this._fLightParticlePurple_spr && Sequence.destroy(Sequence.findByTarget(this._fLightParticlePurple_spr));
		this._fLightParticlePurple_spr = null;

		this._fIsLightParticlePurpleIntroPlaying_bl = null;
		this._fIsLightParticlePurpleOutroPlaying_bl = null;

		super.destroy();
	}
}

export default TransitionRoundEndFXLightPurpleView