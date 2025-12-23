import SimpleUIView from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/SimpleUIView';
import { Sprite } from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import TransitionRoundEndSmokeAnimation from './TransitionRoundEndSmokeAnimation';

const FOG_LOOP_PARAM = [
	{x: 112, y: 18, alpha: 0.6, scale: 1.67},
	{x: 112, y: 18, alpha: 0.6, scale: 1.67},
	{x: 0, y: 0, alpha: 1, scale: 1},
	{x: 0, y: 0, alpha: 1, scale: 1}
];

class TransitionRoundEndSmokeLoopAnimation extends SimpleUIView
{
	static get EVENT_ON_ANIMATION_COMPLETED() { return "EVENT_ON_ANIMATION_COMPLETED"; }

	constructor()
	{
		super();

		this._fFogLoop_spr_arr = [];
		this._fMainContainer_spr = this.addChild(new Sprite());
		this._fIsAnimationPlaying_bl = null;

		for (let i = 0; i < FOG_LOOP_PARAM.length; i++)
		{
			this._initFog(i);
		}
	}

	startAnimation(aSkipIntro_bl)
	{
		this._startFogAnimation(aSkipIntro_bl);
	}

	getfog(aIndex_num)
	{
		return this._fFogLoop_spr_arr[aIndex_num] || (this._fFogLoop_spr_arr[aIndex_num] = this._initFog(aIndex_num));
	}

	_initFog(aIndex_num)
	{
		let lFog_spr = this._fMainContainer_spr.addChild(new TransitionRoundEndSmokeAnimation(aIndex_num));
		let param = FOG_LOOP_PARAM[aIndex_num];
		lFog_spr.position.set(param.x, param.y);
		lFog_spr.scale.set(param.scale, param.scale);
		lFog_spr.alpha = param.alpha;
		lFog_spr.on(TransitionRoundEndSmokeAnimation.EVENT_ON_ANIMATION_COMPLETED, this._onSmokeAnimationCompleted, this);
		return lFog_spr;
	}

	_startFogAnimation(aSkipIntro_bl)
	{
		if (this._fIsAnimationPlaying_bl)
		{
			return;
		}

		this._fIsAnimationPlaying_bl = true;

		for (let i = 0; i < FOG_LOOP_PARAM.length; i++)
		{
			let lFog_tresa = this.getfog(i);
			lFog_tresa.isPlaying = true;
			lFog_tresa.startIntro(aSkipIntro_bl);
		}
	}

	_onSmokeAnimationCompleted(e)
	{
		if (!isNaN(e.fog_id))
		{
			this.getfog(e.fog_id).isPlaying = false;
		}
		
		this._completeIntroAnimationSuspicision();
	}
	
	_completeIntroAnimationSuspicision()
	{
		for (let i = 0; i < FOG_LOOP_PARAM.length; i++)
		{
			if (this.getfog(i).isPlaying)
			{
				return;
			}
		}

		this._fIsAnimationPlaying_bl = false;
		this.emit(TransitionRoundEndSmokeLoopAnimation.EVENT_ON_ANIMATION_COMPLETED);
	}

	interrupt()
	{
		for (let i = 0; i < this._fFogLoop_spr_arr.length; i++)
		{
			this._fFogLoop_spr_arr[i] && this._fFogLoop_spr_arr[i].interrupt();
			this._fFogLoop_spr_arr[i].isPlaying = false;
		}

		this._fIsAnimationPlaying_bl = false;
	}

	destroy()
	{
		for (let i = 0; i < this._fFogLoop_spr_arr.length; i++)
		{
			this._fFogLoop_spr_arr[i] && this._fFogLoop_spr_arr[i].destroy();
		}

		this._fFogLoop_spr_arr = null;
		this._fMainContainer_spr = null;

		super.destroy();
	}
}

export default TransitionRoundEndSmokeLoopAnimation