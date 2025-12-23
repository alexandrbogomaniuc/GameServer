import SimpleUIView from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/SimpleUIView';
import { FRAME_RATE } from '../../../../../../shared/src/CommonConstants';
import Sequence from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { Sprite } from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import { Utils } from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import TransitionRoundEndSmokeLoopAnimation from './TransitionRoundEndSmokeLoopAnimation';

class TransitionRoundEndSmokeView extends SimpleUIView
{
	static get EVENT_ON_INTRO_COMPLETED() { return "EVENT_ON_INTRO_COMPLETED"; }
	static get EVENT_ON_OUTRO_COMPLETED() { return "EVENT_ON_OUTRO_COMPLETED"; }

	constructor()
	{
		super();

		this._fFirstFogLoop_tresla = null;
		this._fSecondFogLoop_tresla = null;
		this._fThirdFogLoop_tresla = null;
		this._fStartThirdFogTimer_t = null;
		this._fFourthFogLoop_tresla = null;
		this._fIsNeedPlaying_bl = null;
		this._fFogContainerIntroAnimationPlaying_bl = null;
		this._fFogContainerOutroAnimationPlaying_bl = null;

		this._initFog();
	}

	startIntro()
	{
		this._fIsNeedPlaying_bl = true;

		this._startContainerIntro();
		this._startFirstFog();
		this._startSecondFog(true);
		this._startThirdFog(true)
		this._startFourthFog();
	}

	startLoop()
	{
		this._fIsNeedPlaying_bl = true;
		this._fFogContainer_spr.alpha = 1;
		this._fFogContainer_spr.scale.set(1,1);

		this._startFirstFog();
		this._startSecondFog(true);
		this._startThirdFog(true);
		this._startFourthFog();
	}

	startOutro()
	{
		this._fIsNeedPlaying_bl = false;
		this._startContainerOutro();
	}

	_initFog()
	{
		this._fFogContainer_spr = this.addChild(new Sprite());
		this._fFogContainer_spr.alpha = 0;

		this._fFirstFogLoop_tresla = this._fFogContainer_spr.addChild(new TransitionRoundEndSmokeLoopAnimation());
		this._fFirstFogLoop_tresla.on(TransitionRoundEndSmokeLoopAnimation.EVENT_ON_ANIMATION_COMPLETED, this.onFirstFogAnimationCompleted, this);

		this._fSecondFogLoop_tresla = this._fFogContainer_spr.addChild(new TransitionRoundEndSmokeLoopAnimation());
		this._fSecondFogLoop_tresla.on(TransitionRoundEndSmokeLoopAnimation.EVENT_ON_ANIMATION_COMPLETED, this.onSecondFogAnimationCompleted, this);
		this._fSecondFogLoop_tresla.rotation = Utils.gradToRad(-180);

		this._fThirdFogLoop_tresla = this._fFogContainer_spr.addChild(new TransitionRoundEndSmokeLoopAnimation());
		this._fThirdFogLoop_tresla.on(TransitionRoundEndSmokeLoopAnimation.EVENT_ON_ANIMATION_COMPLETED, this.onThirdFogAnimationCompleted, this);

		this._fFourthFogLoop_tresla = this._fFogContainer_spr.addChild(new TransitionRoundEndSmokeLoopAnimation());
		this._fFourthFogLoop_tresla.on(TransitionRoundEndSmokeLoopAnimation.EVENT_ON_ANIMATION_COMPLETED, this.onFourthFogAnimationCompleted, this);
		this._fFourthFogLoop_tresla.rotation = Utils.gradToRad(-180);
	}
	
	_startContainerIntro()
	{
		this._fFogContainer_spr.alpha = 0;
		this._fFogContainer_spr.scale.set(2.22, 2.22);
		this._fFogContainerIntroAnimationPlaying_bl = true;

		let l_seq = [
			{tweens: [], duration: 2 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0.41}], duration: 11 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 1.288}, {prop: 'scale.y', to: 1.288}, {prop: 'alpha', to: 1}], duration: 14 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 1}, {prop: 'scale.y', to: 1}], duration: 23 * FRAME_RATE,
			onfinish: () => {
				this._fFogContainerIntroAnimationPlaying_bl = false;
				this._completeIntroAnimationSuspicision();
		}}];

		Sequence.start(this._fFogContainer_spr, l_seq);
	}

	_startContainerOutro()
	{
		this._fFogContainerOutroAnimationPlaying_bl = true;

		let l_seq = [
			{tweens: [{prop: 'scale.x', to: 1.089}, {prop: 'scale.y', to: 1.089}], duration: 13 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 2.22}, {prop: 'scale.y', to: 2.22}, {prop: 'alpha', to: 0.11}], duration: 27 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0}], duration: 7 * FRAME_RATE,
			onfinish: () => {
				this._fFogContainerOutroAnimationPlaying_bl = false;
				this._completeOutroAnimationSuspicision();
		}}];

		Sequence.start(this._fFogContainer_spr, l_seq);
	}

	onFirstFogAnimationCompleted()
	{
		if (this._fIsNeedPlaying_bl)
		{
			this._fFirstFogLoop_tresla.startAnimation();
		}
	}

	onSecondFogAnimationCompleted()
	{
		if (this._fIsNeedPlaying_bl)
		{
			this._fSecondFogLoop_tresla.startAnimation();
		}
	}

	onThirdFogAnimationCompleted()
	{
		if (this._fIsNeedPlaying_bl)
		{
			this._fThirdFogLoop_tresla.startAnimation();
		}	
	}

	onFourthFogAnimationCompleted()
	{
		if (this._fIsNeedPlaying_bl)
		{
			this._fFourthFogLoop_tresla.startAnimation();
		}	
	}

	_startFirstFog(aSkipIntro_bl)
	{
		this._fFirstFogLoop_tresla.startAnimation(aSkipIntro_bl);
	}

	_startSecondFog(aSkipIntro_bl)
	{
		this._fSecondFogLoop_tresla.startAnimation(aSkipIntro_bl);
	}

	_startThirdFog(aSkipIntro_bl)
	{
		this._fThirdFogLoop_tresla.startAnimation(aSkipIntro_bl);
	}

	_startFourthFog(aSkipIntro_bl)
	{
		this._fFourthFogLoop_tresla.startAnimation(aSkipIntro_bl);
	}

	_completeIntroAnimationSuspicision()
	{
		if (!this._fFogContainerIntroAnimationPlaying_bl)
		{
			this.emit(TransitionRoundEndSmokeView.EVENT_ON_INTRO_COMPLETED);
		}
	}

	_completeOutroAnimationSuspicision()
	{
		if (!this._fFogContainerOutroAnimationPlaying_bl)
		{
			this.interrupt();
			this.emit(TransitionRoundEndSmokeView.EVENT_ON_OUTRO_COMPLETED);
		}
	}

	interrupt()
	{
		this._fFogContainerIntroAnimationPlaying_bl = null;
		this._fFogContainerOutroAnimationPlaying_bl = null;
		this._fIsNeedPlaying_bl = null;

		this._fFirstFogLoop_tresla && this._fFirstFogLoop_tresla.interrupt();
		this._fFirstFogLoop_tresla && this._fSecondFogLoop_tresla.interrupt();
		this._fThirdFogLoop_tresla && this._fThirdFogLoop_tresla.interrupt();
		this._fFourthFogLoop_tresla && this._fFourthFogLoop_tresla.interrupt();

		this._fFogContainer_spr && Sequence.destroy(Sequence.findByTarget(this._fFogContainer_spr));
		this._fFogContainer_spr.alpha = 0;
	}

	destroy()
	{
		this._fFogContainerIntroAnimationPlaying_bl = null;
		this._fFogContainerOutroAnimationPlaying_bl = null;
		this._fIsNeedPlaying_bl = null;

		this._fFirstFogLoop_tresla && this._fFirstFogLoop_tresla.destroy();
		this._fFirstFogLoop_tresla = null;

		this._fSecondFogLoop_tresla && this._fSecondFogLoop_tresla.destroy();
		this._fSecondFogLoop_tresla = null;
	
		this._fThirdFogLoop_tresla && this._fThirdFogLoop_tresla.destroy();
		this._fThirdFogLoop_tresla = null;

		this._fFourthFogLoop_tresla && this._fFourthFogLoop_tresla.destroy();
		this._fFourthFogLoop_tresla = null;

		this._fFogContainer_spr && Sequence.destroy(Sequence.findByTarget(this._fFogContainer_spr));
		this._fFogContainer_spr = null;

		super.destroy();
	}
}

export default TransitionRoundEndSmokeView