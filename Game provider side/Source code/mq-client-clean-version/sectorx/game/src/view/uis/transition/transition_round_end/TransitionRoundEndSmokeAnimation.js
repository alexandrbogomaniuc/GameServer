import SimpleUIView from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/SimpleUIView';
import { FRAME_RATE } from '../../../../../../shared/src/CommonConstants';
import Sequence from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { Sprite } from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';

const FOG_PARAM = [
	{
		delay: 1,
		start: {scale: 1.74, rotation: -3.131120678077827}, //rotation: -179.4
		two: {duration: 67, scale: 1.346, rotation: -3.3964107243809654, alpha: 1}, //rotation: -194.6
		three: {duration: 82, scale: 0.864, rotation: -3.722787294503905, alpha: 1}, //rotation: -213.3
		four: {duration: 99, scale: 0.34, rotation: -4.073598474154765, alpha: 0} //rotation: -233.4
	},
	{
		delay: 1,
		start: {scale: 1.74, rotation: -0.9320058205649718}, //rotation: -53.4
		two: {duration: 67, scale: 1.325, rotation: -1.213003830136059, alpha: 1}, //rotation: -69.5
		three: {duration: 56, scale: 0.978, rotation: -1.4451326206513049, alpha: 1}, //rotation: -82.8
		four: {duration: 103, scale: 0.34, rotation: -1.8744836166419099, alpha: 0} //rotation: -107.4
	},
	{
		delay: 25,
		start: {scale: 1.74, rotation: -1.8221237390820801}, //rotation: -104.4
		two: {duration: 53, scale: 1.373, rotation: -2.1380283336930535, alpha: 1}, //rotation: -122.5
		three: {duration: 46, scale: 1.054, rotation: -2.4137903555081577, alpha: 1}, //rotation: -138.3
		four: {duration: 103, scale: 0.34, rotation: -3.0264009229581674, alpha: 0} //rotation: -173.4
	},
	{
		delay: 34,
		start: {scale: 1.98, rotation: -2.3108159296404924}, //rotation: -132.4
		two: {duration: 53, scale: 1.55, rotation: -2.626720524251466, alpha: 1}, //rotation: -150.5
		three: {duration: 46, scale: 1.176, rotation: -2.90248254606657, alpha: 1}, //rotation: -166.3
		four: {duration: 103, scale: 0.34, rotation: -3.5150931135165795, alpha: 0} //rotation: -201.4
	},
	{
		delay: 48,
		start: {scale: 1.98, rotation: -2.7995081201989045}, //rotation: -160.4
		two: {duration: 99, scale: 1.018, rotation: -3.502875808752619, alpha: 1}, //rotation: -200.7
		three: {duration: 1, scale: 1.011, rotation: -3.509857125760597, alpha: 1}, //rotation: -201.1
		four: {duration: 91, scale: 0.347, rotation: -4.153883619746504, alpha: 0} //rotation: -238
	}
];

const FOG_PARAM_SKIP_INTRO = [
	{
		start: {scale: 1.04, rotation: -3.6023595761162963}, //rotation: -206.4
		two: {duration: 30, scale: 0.864, rotation: -3.722787294503905, alpha: 1}, //rotation: -213.3
		three: {duration: 99, scale: 0.34, rotation: -4.073598474154765, alpha: 0} //rotation: -233.4
	},
	{
		start: {scale: 1.003, rotation: -1.4294246573833558}, //rotation: -81.9
		two: {duration: 4, scale: 0.978, rotation: -1.4451326206513049, alpha: 1}, //rotation: -82.8
		three: {duration: 103, scale: 0.34, rotation: -1.8744836166419099, alpha: 0} //rotation: -107.4
	},
	{
		start: {scale: 1.082, rotation: -2.3893557459802373}, //rotation: -136.9
		two: {duration: 4, scale: 1.054, rotation: -2.4137903555081577, alpha: 1}, //rotation: -138.3
		three: {duration: 103, scale: 0.34, rotation: -3.0264009229581674, alpha: 0} //rotation: -173.4
	},
	{
		start: {scale: 1.282, rotation: -2.8239427297268254}, //rotation: -161.8
		two: {duration: 13, scale: 1.176, rotation: -2.90248254606657, alpha: 1}, //rotation: -166.3
		three: {duration: 103, scale: 0.34, rotation: -3.5150931135165795, alpha: 0} //rotation: -201.4
	},
	{
		start: {scale: 1.215, rotation: -3.3108895910332428}, //rotation: -189.7
		two: {duration: 27, scale: 1.018, rotation: -3.502875808752619, alpha: 1}, //rotation: -200.7
		three: {duration: 91, scale: 0.347, rotation: -4.153883619746504, alpha: 0} //rotation: -238
	}
];

class TransitionRoundEndSmokeAnimation extends SimpleUIView
{
	static get EVENT_ON_ANIMATION_COMPLETED() { return "EVENT_ON_ANIMATION_COMPLETED"; }

	constructor(aId_num)
	{
		super();

		this._fId_num = aId_num;
		this._fFog_spr_arr = [];
		this._fFogContainer_spr_arr = [];
		this._fMainContainerAnimationPlaying_bl = null;

		this._fMainContainer_spr = this.addChild(new Sprite());

		for (let i = 0; i < FOG_PARAM.length; i++)
		{
			this._initFog(i);
		}
	}

	startIntro(aSkipIntro_bl)
	{
		if (aSkipIntro_bl)
		{
			this._startFogAnimationSkipIntro();
			this._startContainerAnimationSkipIntro();
		}
		else
		{
			this._startFogAnimation();
			this._startContainerAnimation();
		}
	}

	getfog(aIndex_num)
	{
		return this._fFogContainer_spr_arr[aIndex_num] || (this._fFogContainer_spr_arr[aIndex_num] = this._initFog(aIndex_num));
	}

	_initFog(aIndex_num)
	{
		let lFogContainer_spr = this._fFogContainer_spr_arr[aIndex_num] = this.addChild(new Sprite());
		let lFog_spr = this._fFog_spr_arr[aIndex_num] = lFogContainer_spr.addChild(APP.library.getSprite("transition/round_end_fog"));
		lFog_spr.position.set(-166.1, 6.25);  //-682.2/2 + 175, -293.5/2 + 153

		lFogContainer_spr.alpha = 0;
		return lFogContainer_spr;
	}

	_startFogAnimation()
	{
		for (let i = 0; i < FOG_PARAM.length; i++)
		{
			let lFog_spr = this.getfog(i);
			let lParam_obj = FOG_PARAM[i];
			lFog_spr.isPlaying = true;

			lFog_spr.alpha = 0;
			lFog_spr.scale.set(lParam_obj.start.scale, lParam_obj.start.scale);
			lFog_spr.rotation = lParam_obj.start.rotation;
			
			let l_seq = [
				{tweens: [], duration: lParam_obj.delay * FRAME_RATE},
				{tweens: [
					{prop: 'rotation', to: lParam_obj.two.rotation},
					{prop: 'alpha', to: lParam_obj.two.alpha},
					{prop: 'scale.x', to: lParam_obj.two.scale},
					{prop: 'scale.y', to: lParam_obj.two.scale}
				], duration: lParam_obj.two.duration * FRAME_RATE},
				{tweens: [
					{prop: 'rotation', to: lParam_obj.three.rotation}, 
					{prop: 'alpha', to: lParam_obj.three.alpha},
					{prop: 'scale.x', to: lParam_obj.three.scale},
					{prop: 'scale.y', to: lParam_obj.three.scale}
				], duration: lParam_obj.three.duration * FRAME_RATE},
				{tweens: [
					{prop: 'rotation', to: lParam_obj.four.rotation}, 
					{prop: 'alpha', to: lParam_obj.four.alpha},
					{prop: 'scale.x', to: lParam_obj.four.scale},
					{prop: 'scale.y', to: lParam_obj.four.scale}
				], duration: lParam_obj.four.duration * FRAME_RATE,
				onfinish: () => {
					lFog_spr.isPlaying = false;
					this._completeIntroAnimationSuspicision();
			}}];
	
			Sequence.start(lFog_spr, l_seq);
		}
	}

	_startFogAnimationSkipIntro()
	{
		for (let i = 0; i < FOG_PARAM_SKIP_INTRO.length; i++)
		{
			let lFog_spr = this.getfog(i);
			let lParam_obj = FOG_PARAM_SKIP_INTRO[i];
			lFog_spr.isPlaying = true;

			lFog_spr.alpha = 0;
			lFog_spr.scale.set(lParam_obj.start.scale, lParam_obj.start.scale);
			lFog_spr.rotation = lParam_obj.start.rotation;
			
			let l_seq = [
				{tweens: [], duration: lParam_obj.delay * FRAME_RATE},
				{tweens: [
					{prop: 'rotation', to: lParam_obj.two.rotation},
					{prop: 'alpha', to: lParam_obj.two.alpha},
					{prop: 'scale.x', to: lParam_obj.two.scale},
					{prop: 'scale.y', to: lParam_obj.two.scale}
				], duration: lParam_obj.two.duration * FRAME_RATE},
				{tweens: [
					{prop: 'rotation', to: lParam_obj.three.rotation}, 
					{prop: 'alpha', to: lParam_obj.three.alpha},
					{prop: 'scale.x', to: lParam_obj.three.scale},
					{prop: 'scale.y', to: lParam_obj.three.scale}
				], duration: lParam_obj.three.duration * FRAME_RATE,
				onfinish: () => {
					lFog_spr.isPlaying = false;
					this._completeIntroAnimationSuspicision();
			}}];
	
			Sequence.start(lFog_spr, l_seq);
		}
	}

	_startContainerAnimation()
	{
		this._fMainContainer_spr.rotation = 0;
		this._fMainContainerAnimationPlaying_bl = true;

		let l_seq = [
			{tweens: [{prop: 'rotation', to: -0.49567350756638956}], duration: 239 * FRAME_RATE, //Utils.gradToRad(-28.4)
			onfinish: () => {
				this._fMainContainerAnimationPlaying_bl = false;
				this._completeIntroAnimationSuspicision();
		}}];

		Sequence.start(this._fMainContainer_spr, l_seq);
	}

	_startContainerAnimationSkipIntro()
	{
		this._fMainContainer_spr.rotation = -0.24958208303518914; //Utils.gradToRad(-14.3)
		this._fMainContainerAnimationPlaying_bl = true;

		let l_seq = [
			{tweens: [{prop: 'rotation', to: -0.49567350756638956}], duration: 119 * FRAME_RATE, //Utils.gradToRad(-28.4)
			onfinish: () => {
				this._fMainContainerAnimationPlaying_bl = false;
				this._completeIntroAnimationSuspicision();
		}}];

		Sequence.start(this._fMainContainer_spr, l_seq);
	}

	_completeIntroAnimationSuspicision()
	{
		for (let i = 0; i < FOG_PARAM.length; i++)
		{
			if (this.getfog(i).isPlaying)
			{
				return;
			}
		}

		if (this._fMainContainerAnimationPlaying_bl)
		{
			return;
		}

		this.emit(TransitionRoundEndSmokeAnimation.EVENT_ON_ANIMATION_COMPLETED, {fog_id: this._fId_num});
	}

	interrupt()
	{
		for (let i = 0; i < this._fFogContainer_spr_arr.length; i++)
		{
			Sequence.destroy(Sequence.findByTarget(this._fFogContainer_spr_arr[i]));
			this._fFogContainer_spr_arr[i].alpha = 0;
		}

		Sequence.destroy(Sequence.findByTarget(this._fMainContainer_spr));
	}

	destroy()
	{
		this.interrupt();

		for (let i = 0; i < this._fFog_spr_arr.length; i++)
		{
			this._fFog_spr_arr[i] && this._fFog_spr_arr[i].destroy();
		}

		this._fFog_spr_arr = null;

		for (let i = 0; i < this._fFogContainer_spr_arr.length; i++)
		{
			Sequence.destroy(Sequence.findByTarget(this._fFogContainer_spr_arr[i]));
			this._fFogContainer_spr_arr[i] && this._fFogContainer_spr_arr[i].destroy();
		}

		this._fFogContainer_spr_arr= null;

		Sequence.destroy(Sequence.findByTarget(this._fMainContainer_spr));
		this._fMainContainer_spr && this._fMainContainer_spr.destroy();
		this._fMainContainer_spr = null;

		super.destroy();
	}
}

export default TransitionRoundEndSmokeAnimation