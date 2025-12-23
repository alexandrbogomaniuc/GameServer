import SimpleUIView from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/SimpleUIView';
import { FRAME_RATE } from '../../../../../shared/src/CommonConstants';
import TransitionRoundEndFXLightView from './transition_round_end/TransitionRoundEndFXLightView';
import TransitionRoundEndFXLightPurpleView from './transition_round_end/TransitionRoundEndFXLightPurpleView';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import TransitionRoundEndSmokeView from './transition_round_end/TransitionRoundEndSmokeView';
import TransitionRoundEndLoadingView from './transition_round_end/TransitionRoundEndLoadingView';

class TransitionRoundEndView extends SimpleUIView
{
	static get EVENT_ON_TRANSITION_INTRO_COMPLETED() { return "EVENT_ON_TRANSITION_INTRO_COMPLETED"; }
	static get EVENT_ON_TRANSITION_OUTRO_COMPLETED() { return "EVENT_ON_TRANSITION_OUTRO_COMPLETED"; }

	constructor()
	{
		super();

		this._fRoundEndLightParticlesPurple_trefxlpv = null;
		this._fFog_trefxl = null;
		this._fRoundEndFXLight_trefxlv = null;
		this._fRoundEndLoading_trelv = null;
		this._fSolidColor_spr = null;
		this._fFlash_spr = null;
		
		this._fIsIntroSolidColorPlaying_bl = null;
		this._fIsIntroRoundEndLightParticlePurplePlaying_bl = null;
		this._fIsIntroFogPlaying_bl = null;
		this._fIsIntroRoundEndFXLightPlaying_bl = null;
		this._fIsIntroRoundEndLoadingPlaying_bl = null;
		this._fIsIntroFlashPlaying_bl = null;
		
		this._fIsOutroSolidColorPlaying_bl = null;
		this._fIsOutroRoundEndLightParticlePurplePlaying_bl = null;
		this._fIsOutroFogPlaying_bl = null;
		this._fIsOutroRoundEndFXLightPlaying_bl = null;
		this._fIsOutroRoundEndLoadingPlaying_bl = null;
		this._fIsOutroFlashPlaying_bl = null;

		this._initView();

		//DEBUG...
		/*let l_html = window.document.createElement('div');

		l_html.id = "ID1";
		l_html.style.color = "white";
		l_html.style.position = "absolute";
		l_html.style.left = "0px";
		l_html.style.top = "0px";
		l_html.style.margin = "10px";
		l_html.style.width = "100px";
		l_html.style.height = "100px";
		l_html.style["background-color"] = "#7e5ad1";
		l_html.style["z-index"] = "999";

		l_html.style["text-align"] = "center";
		l_html.style["vertical-align"] = "middle";
		l_html.style["line-height"] = "100px";
		l_html.style["font-family"] = "calibri";
		l_html.style["font-weight"] = "bold";
		l_html.style["font-size"] = "80px";
		l_html.style["border-radius"] = "20px";
		l_html.style["cursor"] = "pointer";
		l_html.style["opacity"] = "1";

		l_html.innerText = "T";

		l_html.addEventListener("click", this.setInvalidState.bind(this));
		document.body.appendChild(l_html);

		l_html = window.document.createElement('div');
		l_html.id = "ID3";
		l_html.style.color = "white";
		l_html.style.position = "absolute";
		l_html.style.left = "110px";
		l_html.style.top = "0px";
		l_html.style.margin = "10px";
		l_html.style.width = "100px";
		l_html.style.height = "100px";
		l_html.style["background-color"] = "#7e5ad1";
		l_html.style["z-index"] = "999";

		l_html.style["text-align"] = "center";
		l_html.style["vertical-align"] = "middle";
		l_html.style["line-height"] = "100px";
		l_html.style["font-family"] = "calibri";
		l_html.style["font-weight"] = "bold";
		l_html.style["font-size"] = "80px";
		l_html.style["border-radius"] = "20px";
		l_html.style["cursor"] = "pointer";
		l_html.style["opacity"] = "1";

		l_html.innerText = "I";
		l_html.addEventListener("click", this.setIntroState.bind(this)); 
		document.body.appendChild(l_html);

		l_html = window.document.createElement('div');
		l_html.id = "ID3";
		l_html.style.color = "white";
		l_html.style.position = "absolute";
		l_html.style.left = "220px";
		l_html.style.top = "0px";
		l_html.style.margin = "10px";
		l_html.style.width = "100px";
		l_html.style.height = "100px";
		l_html.style["background-color"] = "#7e5ad1";
		l_html.style["z-index"] = "999";

		l_html.style["text-align"] = "center";
		l_html.style["vertical-align"] = "middle";
		l_html.style["line-height"] = "100px";
		l_html.style["font-family"] = "calibri";
		l_html.style["font-weight"] = "bold";
		l_html.style["font-size"] = "80px";
		l_html.style["border-radius"] = "20px";
		l_html.style["cursor"] = "pointer";
		l_html.style["opacity"] = "1";

		l_html.innerText = "L";
		l_html.addEventListener("click", this.setLoopState.bind(this));
		document.body.appendChild(l_html);


		l_html = window.document.createElement('div');
		l_html.id = "ID4";
		l_html.style.color = "white";
		l_html.style.position = "absolute";
		l_html.style.left = "330px";
		l_html.style.top = "0px";
		l_html.style.margin = "10px";
		l_html.style.width = "100px";
		l_html.style.height = "100px";
		l_html.style["background-color"] = "#7e5ad1";
		l_html.style["z-index"] = "999";

		l_html.style["text-align"] = "center";
		l_html.style["vertical-align"] = "middle";
		l_html.style["line-height"] = "100px";
		l_html.style["font-family"] = "calibri";
		l_html.style["font-weight"] = "bold";
		l_html.style["font-size"] = "80px";
		l_html.style["border-radius"] = "20px";
		l_html.style["cursor"] = "pointer";
		l_html.style["opacity"] = "1";

		l_html.innerText = "O";
		l_html.addEventListener("click", this.setOutroState.bind(this));
		document.body.appendChild(l_html);*/
		//...DEBUG
	}

	initOnScreen(containerInfo)
	{
		containerInfo.container.addChild(this);
		this.zIndex = containerInfo.zIndex;
	}

	_initView()
	{
		this._initSolidColor();

		this._fRoundEndLightParticlesPurple_trefxlpv = this.addChild(new TransitionRoundEndFXLightPurpleView());
		this._fRoundEndLightParticlesPurple_trefxlpv.on(TransitionRoundEndFXLightPurpleView.EVENT_ON_INTRO_COMPLETED, this._onRoundEndLightParticlesPurpleIntroAnimation, this);
		this._fRoundEndLightParticlesPurple_trefxlpv.on(TransitionRoundEndFXLightPurpleView.EVENT_ON_OUTRO_COMPLETED, this._onRoundEndLightParticlesPurpleOutroAnimation, this);

		this._fFog_trefxl = this.addChild(new TransitionRoundEndSmokeView());
		this._fFog_trefxl.on(TransitionRoundEndSmokeView.EVENT_ON_INTRO_COMPLETED, this._onRoundEndSmokeIntroAnimation, this);
		this._fFog_trefxl.on(TransitionRoundEndSmokeView.EVENT_ON_OUTRO_COMPLETED, this._onRoundEndSmokeOutroAnimation, this);

		this._fRoundEndFXLight_trefxlv = this.addChild(new TransitionRoundEndFXLightView());
		this._fRoundEndFXLight_trefxlv.on(TransitionRoundEndFXLightView.EVENT_ON_INTRO_COMPLETED, this._onRoundFXLightIntroAnimation, this);
		this._fRoundEndFXLight_trefxlv.on(TransitionRoundEndFXLightView.EVENT_ON_OUTRO_COMPLETED, this._onRoundFXLightOutroAnimation, this);

		this._fRoundEndLoading_trelv = this.addChild(new TransitionRoundEndLoadingView());
		this._fRoundEndLoading_trelv.on(TransitionRoundEndLoadingView.EVENT_ON_INTRO_COMPLETED, this._onRoundEndLoadingIntroAnimation, this);
		this._fRoundEndLoading_trelv.on(TransitionRoundEndLoadingView.EVENT_ON_OUTRO_COMPLETED, this._onRoundEndLoadingOutroAnimation, this);

		this._initFlash();
	}


	setInvalidState()
	{
		this.interrupt();
	}

	//INTRO STATE...
	setIntroState()
	{
		this._fIsIntroSolidColorPlaying_bl = true;
		this._fIsIntroRoundEndLightParticlePurplePlaying_bl = true;
		this._fIsIntroFogPlaying_bl = true;
		this._fIsIntroRoundEndFXLightPlaying_bl = true;
		this._fIsIntroRoundEndLoadingPlaying_bl = true;
		this._fIsIntroFlashPlaying_bl = true;

		this._startSolidColorIntro();
		this._fRoundEndLightParticlesPurple_trefxlpv.startIntro();
		this._fFog_trefxl.startIntro();
		this._fRoundEndFXLight_trefxlv.startIntro();
		this._fRoundEndLoading_trelv.startIntro();
		this._startFlashAnimationIntro();
	}

	_onRoundEndLightParticlesPurpleIntroAnimation()
	{
		this._fIsIntroRoundEndLightParticlePurplePlaying_bl = false;
		this._completeIntroAnimationSuspicision();
	}

	_onRoundEndSmokeIntroAnimation()
	{
		this._fIsIntroFogPlaying_bl = false;
		this._completeIntroAnimationSuspicision();
	}

	_onRoundFXLightIntroAnimation()
	{
		this._fIsIntroRoundEndFXLightPlaying_bl = false;
		this._completeIntroAnimationSuspicision();
	}

	_onRoundEndLoadingIntroAnimation()
	{
		this._fIsIntroRoundEndLoadingPlaying_bl = false;
		this._completeIntroAnimationSuspicision();
	}

	_completeIntroAnimationSuspicision()
	{
		if (
			!this._fIsIntroSolidColorPlaying_bl
			&& !this._fIsIntroRoundEndLightParticlePurplePlaying_bl
			&& !this._fIsIntroFogPlaying_bl
			&& !this._fIsIntroRoundEndFXLightPlaying_bl
			&& !this._fIsIntroRoundEndLoadingPlaying_bl
			&& !this._fIsIntroFlashPlaying_bl
			)
		{
			this.emit(TransitionRoundEndView.EVENT_ON_TRANSITION_INTRO_COMPLETED);
		}
	}
	//...INTRO STATE

	//LOOP STATE...
	setLoopState()
	{
		this._fRoundEndFXLight_trefxlv.startLoop();
		this._fRoundEndLightParticlesPurple_trefxlpv.startLoop();
		this._startSolidColorLoop();
		this._fFog_trefxl.startLoop();
		this._fRoundEndLoading_trelv.startLoop();
	}
	//...LOOP STATE

	//OUTRO STATE...
	setOutroState()
	{
		this._fIsOutroSolidColorPlaying_bl = true;
		this._fIsOutroRoundEndLightParticlePurplePlaying_bl = true;
		this._fIsOutroFogPlaying_bl = true;
		this._fIsOutroRoundEndFXLightPlaying_bl = true;
		this._fIsOutroRoundEndLoadingPlaying_bl = true;
		this._fIsOutroFlashPlaying_bl = true;

		this._startSolidColorOutro();
		this._fRoundEndLightParticlesPurple_trefxlpv.startOutro();
		this._fFog_trefxl.startOutro();
		this._fRoundEndFXLight_trefxlv.startOutro();
		this._fRoundEndLoading_trelv.startOutro();
		this._startFlashAnimationOutro();
	}

	_onRoundEndLightParticlesPurpleOutroAnimation()
	{
		this._fIsOutroRoundEndLightParticlePurplePlaying_bl = false;
		this._completeOutroAnimationSuspicision();
	}

	_onRoundEndSmokeOutroAnimation()
	{
		this._fIsOutroFogPlaying_bl = false;
		this._completeOutroAnimationSuspicision();
	}

	_onRoundFXLightOutroAnimation()
	{
		this._fIsOutroRoundEndFXLightPlaying_bl = false;
		this._completeOutroAnimationSuspicision();
	}

	_onRoundEndLoadingOutroAnimation()
	{
		this._fIsOutroRoundEndLoadingPlaying_bl = false;
		this._completeOutroAnimationSuspicision();
	}

	_completeOutroAnimationSuspicision()
	{
		if (
			!this._fIsOutroSolidColorPlaying_bl
			&& !this._fIsOutroRoundEndLightParticlePurplePlaying_bl
			&& !this._fIsOutroFogPlaying_bl
			&& !this._fIsOutroRoundEndFXLightPlaying_bl
			&& !this._fIsOutroRoundEndLoadingPlaying_bl
			&& !this._fIsOutroFlashPlaying_bl
			)
		{
			this.emit(TransitionRoundEndView.EVENT_ON_TRANSITION_OUTRO_COMPLETED);
		}
	}
	//...OUTRO STATE

	//SOLID COLOR...
	_startSolidColorIntro()
	{
		this._fIsIntroSolidColorPlaying_bl = true;
		let lSolidColor_spr = this.solidColor;
		lSolidColor_spr.alpha = 0;

		let l_seq = [
			{tweens: [], duration: 24 * FRAME_RATE},
			{tweens: [ {prop: 'alpha', to: 1}], duration: 11 * FRAME_RATE,
			onfinish: () => {
				this._fIsIntroSolidColorPlaying_bl = false;
				this._completeIntroAnimationSuspicision();
		}}];

		Sequence.start(lSolidColor_spr, l_seq);
	}

	_startSolidColorLoop()
	{
		let lSolidColor_spr = this.solidColor;
		lSolidColor_spr.alpha = 1;
	}
	
	_startSolidColorOutro()
	{
		this._fIsOutroSolidColorPlaying_bl = true;
		let lSolidColor_spr = this.solidColor;

		let l_seq = [
			{tweens: [], duration: 13 * FRAME_RATE},
			{tweens: [ {prop: 'alpha', to: 0}], duration: 9 * FRAME_RATE,
			onfinish: () => {
				this._fIsOutroSolidColorPlaying_bl = false;
				this._completeOutroAnimationSuspicision();
		}}];

		Sequence.start(lSolidColor_spr, l_seq);
	}

	get solidColor()
	{
		return this._fSolidColor_spr || (this._fSolidColor_spr = this._initSolidColor());
	}

	_initSolidColor()
	{
		let l_g = new PIXI.Graphics();
		l_g.beginFill(0X361450, 1);
		l_g.drawRect(-480, -270, 960, 540);
		l_g.endFill();
		l_g.alpha = 0;
		this._fSolidColor_spr = l_g;
		this.addChild(l_g);
		return l_g;
	}
	//...SOLID COLOR

	//FLASH ...
	_startFlashAnimationIntro()
	{
		this._startFlashAnimation();
	}

	_startFlashAnimationOutro()
	{
		this._startFlashAnimation(true);
	}

	_startFlashAnimation(aOutro_bl = null)
	{
		if (!aOutro_bl)
		{
			this._fIsIntroFlashPlaying_bl = true;
		}
		else
		{
			this._fIsOutroFlashPlaying_bl = true;
		}
		
		let lFlash_spr = this.flash;
		lFlash_spr.alpha = 0;

		let lDelay_num = aOutro_bl ? 10 : 2;
		let lAlphaFirst_num = aOutro_bl ? 0.03 : 0.12;
		let lAlphaSecond_num = aOutro_bl ? 0.05 : 0.1;

		let l_seq = [
			{tweens: [], duration: lDelay_num * FRAME_RATE},
			{tweens: [ {prop: 'alpha', to: 0.09}], duration: 4 * FRAME_RATE},
			{tweens: [ {prop: 'alpha', to: 0}], duration: 3 * FRAME_RATE},
			{tweens: [], duration: 7 * FRAME_RATE},
			{tweens: [ {prop: 'alpha', to: lAlphaFirst_num}], duration: 4 * FRAME_RATE},
			{tweens: [ {prop: 'alpha', to: 0}], duration: 3 * FRAME_RATE},
			{tweens: [], duration: 2 * FRAME_RATE},
			{tweens: [ {prop: 'alpha', to: lAlphaSecond_num}], duration: 4 * FRAME_RATE},
			{tweens: [ {prop: 'alpha', to: 0}], duration: 5 * FRAME_RATE,
			onfinish: () => {
				if (!aOutro_bl)
				{
					this._fIsIntroFlashPlaying_bl = false;
					this._completeIntroAnimationSuspicision();
				}
				else
				{
					this._fIsOutroFlashPlaying_bl = false;
					this._completeOutroAnimationSuspicision();
				}
				
		}}];

		Sequence.start(lFlash_spr, l_seq);
	}

	get flash()
	{
		return this._fFlash_spr || (this._fFlash_spr = this._initFlash());
	}

	_initFlash()
	{
		let l_g = new PIXI.Graphics();
		l_g.beginFill(0Xffffff, 1);
		l_g.drawRect(-480, -270, 960, 540);
		l_g.endFill();
		l_g.alpha = 0;
		l_g.blendMode = PIXI.BLEND_MODES.ADD;
		this._fFlash_spr = l_g;
		this.addChild(l_g);
		return l_g;
	}
	//...FLASH


	interrupt()
	{
		this._fRoundEndLightParticlesPurple_trefxlpv && this._fRoundEndLightParticlesPurple_trefxlpv.interrupt();
		this._fFog_trefxl && this._fFog_trefxl.interrupt();
		this._fRoundEndFXLight_trefxlv && this._fRoundEndFXLight_trefxlv.interrupt();
		this._fRoundEndLoading_trelv && this._fRoundEndLoading_trelv.interrupt();
		this._fSolidColor_spr && Sequence.destroy(Sequence.findByTarget(this._fSolidColor_spr));
		this._fSolidColor_spr.alpha = 0;
		this._fFlash_spr && Sequence.destroy(Sequence.findByTarget(this._fFlash_spr));
		this._fFlash_spr.alpha = 0;
		
		this._fIsIntroSolidColorPlaying_bl = null;
		this._fIsIntroRoundEndLightParticlePurplePlaying_bl = null;
		this._fIsIntroFogPlaying_bl = null;
		this._fIsIntroRoundEndFXLightPlaying_bl = null;
		this._fIsIntroRoundEndLoadingPlaying_bl = null;
		this._fIsIntroFlashPlaying_bl = null;
		
		this._fIsOutroSolidColorPlaying_bl = null;
		this._fIsOutroRoundEndLightParticlePurplePlaying_bl = null;
		this._fIsOutroFogPlaying_bl = null;
		this._fIsOutroRoundEndFXLightPlaying_bl = null;
		this._fIsOutroRoundEndLoadingPlaying_bl = null;
		this._fIsOutroFlashPlaying_bl = null;
	}

	destroy()
	{
		this._fRoundEndLightParticlesPurple_trefxlpv && this._fRoundEndLightParticlesPurple_trefxlpv.destroy();
		this._fRoundEndLightParticlesPurple_trefxlpv = null;

		this._fFog_trefxl && this._fRoundEndLightParticlesPurple_trefxlpv.destroy();
		this._fFog_trefxl = null;

		this._fRoundEndFXLight_trefxlv && this._fRoundEndLightParticlesPurple_trefxlpv.destroy();
		this._fRoundEndFXLight_trefxlv = null;

		this._fRoundEndLoading_trelv && this._fRoundEndLightParticlesPurple_trefxlpv.destroy();
		this._fRoundEndLoading_trelv = null;

		this._fSolidColor_spr && Sequence.destroy(Sequence.findByTarget(this._fSolidColor_spr));
		this._fSolidColor_spr = null;

		this._fFlash_spr && Sequence.destroy(Sequence.findByTarget(this._fFlash_spr));
		this._fFlash_spr = null;
		
		this._fIsIntroSolidColorPlaying_bl = null;
		this._fIsIntroRoundEndLightParticlePurplePlaying_bl = null;
		this._fIsIntroFogPlaying_bl = null;
		this._fIsIntroRoundEndFXLightPlaying_bl = null;
		this._fIsIntroRoundEndLoadingPlaying_bl = null;
		this._fIsIntroFlashPlaying_bl = null;
		
		this._fIsOutroSolidColorPlaying_bl = null;
		this._fIsOutroRoundEndLightParticlePurplePlaying_bl = null;
		this._fIsOutroFogPlaying_bl = null;
		this._fIsOutroRoundEndFXLightPlaying_bl = null;
		this._fIsOutroRoundEndLoadingPlaying_bl = null;
		this._fIsOutroFlashPlaying_bl = null;

		super.destroy();
	}
}

export default TransitionRoundEndView;