import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import * as Easing from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../../shared/src/CommonConstants';
import { Sequence } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import { Utils } from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';

const BURST_COUNT_INTRO = 3;

const BURST_INTRO_PARAM =[
	{
		delay: 3,
		rotation: 5.009094953223726, //Utils.gradToRad(287)
		point_1: {scale: 0.71, alpha: 0.5, duration: 0},
		point_2: {scale: 1.11, alpha: 0.25, duration: 3},
		point_3: {scale: 1.11, alpha: 0.25, duration: 3}
	},
	{
		delay: 7,
		rotation: 3.141592653589793, //Utils.gradToRad(180)
		point_1: {scale: 0.95, alpha: 0.83, duration: 0},
		point_2: {scale: 1.35, alpha: 0.54, duration: 3},
		point_3: {scale: 1.35, alpha: 0.35, duration: 3}
	},
	{
		delay: 10,  
		rotation: 0.7853981633974483, //Utils.gradToRad(45)
		point_1: {scale: 1.25, alpha: 1, duration: 0},
		point_2: {scale: 1.65, alpha: 0.5, duration: 3},
		point_3: {scale: 1.65, alpha: 0.15, duration: 3}
	}
];

const BURST_COUNT_IDLE = 3;

const BURST_IDLE_PARAM =[
	{
		delay: 7,
		rotation: 0.7853981633974483, //Utils.gradToRad(45)
		point_1: {scale: 0.6, alpha: 0.5, duration: 0},
		point_2: {scale: 1, alpha: 0.25, duration: 3},
		point_3: {scale: 1, alpha: 0.25, duration: 3}
	},
	{
		delay: 20,
		rotation: 5.009094953223726, //Utils.gradToRad(287)
		point_1: {scale: 0.71, alpha: 0.5, duration: 0},
		point_2: {scale: 1.11, alpha: 0.25, duration: 3},
		point_3: {scale: 1.11, alpha: 0.25, duration: 3}
	},
	{
		delay: 24,  
		rotation: 3.141592653589793, //Utils.gradToRad(180)
		point_1: {scale: 0.95, alpha: 0.83, duration: 0},
		point_2: {scale: 1.35, alpha: 0.54, duration: 3},
		point_3: {scale: 1.35, alpha: 0.35, duration: 3}
	}
];

const BURST_COUNT_OUTRO= 2;

const BURST_OUTRO_PARAM =[
	{
		delay: 5,
		rotation: 5.009094953223726, //Utils.gradToRad(287)
		point_1: {scale: 0.71, alpha: 0.71, duration: 0},
		point_2: {scale: 1.11, alpha: 0.25, duration: 3},
		point_3: {scale: 1.11, alpha: 0.25, duration: 3}
	},
	{
		delay: 9,
		rotation: 3.141592653589793, //Utils.gradToRad(180)
		point_1: {scale: 0.95, alpha: 0.83, duration: 0},
		point_2: {scale: 1.35, alpha: 0.54, duration: 3},
		point_3: {scale: 1.35, alpha: 0.35, duration: 3}
	}
]

class LightningCapsuleLightningBurstAnimation extends Sprite
{
	static get EVENT_ON_INTRO_ANIMATION_ENDED()				{return "onIntroAnimationEnded";}
	static get EVENT_ON_OUTRO_ANIMATION_ENDED()				{return "onOutroAnimationEnded";}

	i_startIntroAnimation()
	{
		this._startIntroAnimation();
	}

	i_startOutroAnimation()
	{
		this._startOutroAnimation();
	}

	constructor()
	{
		super();

		this._fIntroLightningBurst_arr = [];
		this._fIsIntroAnimating_bl = null;
		this._fIntroAnimationCount_num = null;

		this._fIdleLightningBurst_arr = [];
		this._fIsIdleAnimating_bl = null;
		this._fIdleAnimationCount_num = null;

		this._fOutroLightningBurst_arr = [];
		this._fIsOutroAnimating_bl = null;
		this._fOutroAnimationCount_num = null;
		this._fIsNeedNextIdleAnimating_bl = null;
	}

	_startIntroAnimation()
	{
		this._fIsIntroAnimating_bl = true;
		this._fIntroAnimationCount_num = 0;
		for (let i = 0; i < BURST_COUNT_INTRO; i++)
		{
			this._startIntroLightningBurst(i);
		}
	}

	_startIntroLightningBurst(aIndex)
	{
		let lLightningBurst_spr = this._fIntroLightningBurst_arr[aIndex] = this.addChild(APP.library.getSprite('enemies/lightning_capsule/death/lightning_burst'));
		let param = BURST_INTRO_PARAM[aIndex];

		lLightningBurst_spr.position.y = -48;
		lLightningBurst_spr.position.x = 10;
		lLightningBurst_spr.rotation = Utils.gradToRad(param.rotation);
		

		if (param.delay == 0)
		{
			lLightningBurst_spr.scale.set(param.point_1.scale);
			lLightningBurst_spr.alpha = param.point_1.alpha;
		}
		else
		{
			lLightningBurst_spr.scale.set(0);
			lLightningBurst_spr.alpha = 0;
		}

		lLightningBurst_spr.blendMode = PIXI.BLEND_MODES.ADD;
	
		let l_seq = [
			{tweens: [], duration: param.delay * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: param.point_1.scale}, {prop: 'scale.y', to: param.point_1.scale}, {prop: 'alpha', to: param.point_1.alpha}], duration: param.point_1.duration * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: param.point_2.scale}, {prop: 'scale.y', to: param.point_2.scale}, {prop: 'alpha', to: param.point_2.alpha}], duration: param.point_2.duration * FRAME_RATE}, 
			{tweens: [{prop: 'scale.x', to: param.point_3.scale}, {prop: 'scale.y', to: param.point_3.scale}, {prop: 'alpha', to: param.point_3.alpha}], duration: param.point_3.duration * FRAME_RATE,  ease: Easing.quadratic.easeIn, 
				onfinish: ()=>{
				this._onIntroAnimationEnded(aIndex);
			}}
		]

		this._fIntroAnimationCount_num++;
		Sequence.start(lLightningBurst_spr, l_seq);
	}

	_onIntroAnimationEnded(aIndex)
	{
		this._fIntroLightningBurst_arr[aIndex] && this._fIntroLightningBurst_arr[aIndex].destroy();

		this._fIntroAnimationCount_num--;

		if (this._fIntroAnimationCount_num == 0)
		{
			for (let i = 0; i < BURST_COUNT_INTRO; i++)
			{
				if (!this._fIntroLightningBurst_arr)
				{
					break;
				}

				this._fIntroLightningBurst_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fIntroLightningBurst_arr[i]));
				this._fIntroLightningBurst_arr[i] && this._fIntroLightningBurst_arr[i].destroy();
				this._fIntroLightningBurst_arr[i] = null;
			}

			if (this._fIsIntroAnimating_bl)
			{
				this._fIsIntroAnimating_bl = false;
				this._fIsNeedNextIdleAnimating_bl = true;
				this._startIdleAnimation();
				this.emit(LightningCapsuleLightningBurstAnimation.EVENT_ON_INTRO_ANIMATION_ENDED);
			};
		}
	}

	_startIdleAnimation()
	{
		this._fIsIdleAnimating_bl = true;
		this._fIdleAnimationCount_num = 0;

		for (let i = 0; i < BURST_COUNT_IDLE; i++)
		{
			this._startIdleLightningBurst(i);
		}
	}

	_startIdleLightningBurst(aIndex)
	{
		let lLightningBurst_spr = this._fIdleLightningBurst_arr[aIndex] = this.addChild(APP.library.getSprite('enemies/lightning_capsule/death/lightning_burst'));
		let param = BURST_IDLE_PARAM[aIndex];

		lLightningBurst_spr.position.y = -48;
		lLightningBurst_spr.position.x = 10;
		lLightningBurst_spr.rotation = Utils.gradToRad(param.rotation);
		

		if (param.delay == 0)
		{
			lLightningBurst_spr.scale.set(param.point_1.scale);
			lLightningBurst_spr.alpha = param.point_1.alpha;
		}
		else
		{
			lLightningBurst_spr.scale.set(0);
			lLightningBurst_spr.alpha = 0;
		}

		lLightningBurst_spr.blendMode = PIXI.BLEND_MODES.ADD;
	
		let l_seq = [
			{tweens: [], duration: param.delay * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: param.point_1.scale}, {prop: 'scale.y', to: param.point_1.scale}, {prop: 'alpha', to: param.point_1.alpha}], duration: param.point_1.duration * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: param.point_2.scale}, {prop: 'scale.y', to: param.point_2.scale}, {prop: 'alpha', to: param.point_2.alpha}], duration: param.point_2.duration * FRAME_RATE}, 
			{tweens: [{prop: 'scale.x', to: param.point_3.scale}, {prop: 'scale.y', to: param.point_3.scale}, {prop: 'alpha', to: param.point_3.alpha}], duration: param.point_3.duration * FRAME_RATE,  ease: Easing.quadratic.easeIn, 
				onfinish: ()=>{
				this._onIdleAnimationEnded(aIndex);
			}}
		]

		this._fIdleAnimationCount_num++;
		Sequence.start(lLightningBurst_spr, l_seq);
	}

	_destroyIdleAnimation()
	{
		for (let i = 0; i < BURST_COUNT_IDLE; i++)
			{
				if (!this._fIdleLightningBurst_arr)
				{
					break;
				}

				this._fIdleLightningBurst_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fIdleLightningBurst_arr[i]));
				this._fIdleLightningBurst_arr[i] && this._fIdleLightningBurst_arr[i].destroy();
				this._fIdleLightningBurst_arr[i] = null;
			}
	}

	_onIdleAnimationEnded(aIndex)
	{
		this._fIdleLightningBurst_arr[aIndex] && this._fIdleLightningBurst_arr[aIndex].destroy();

		this._fIdleAnimationCount_num--;

		if (this._fIdleAnimationCount_num == 0)
		{
			this._destroyIdleAnimation();
			
			if (this._fIsNeedNextIdleAnimating_bl)
			{
				this._startIdleAnimation();
			}
			else
			{
				this._fIsIdleAnimating_bl = false;
			}
		}
	}

	_startOutroAnimation()
	{
		this._fIsNeedNextIdleAnimating_bl = false;
		this._fIsOutroAnimating_bl = true;
		this._fOutroAnimationCount_num = 0;

		for (let i = 0; i < BURST_COUNT_OUTRO; i++)
		{
			this._startOutroLightningBurst(i);
		}
	}

	_startOutroLightningBurst(aIndex)
	{
		let lLightningBurst_spr = this._fOutroLightningBurst_arr[aIndex] = this.addChild(APP.library.getSprite('enemies/lightning_capsule/death/lightning_burst'));
		let param = BURST_OUTRO_PARAM[aIndex];

		lLightningBurst_spr.position.y = -48;
		lLightningBurst_spr.position.x = 10;
		lLightningBurst_spr.rotation = Utils.gradToRad(param.rotation);
		

		if (param.delay == 0)
		{
			lLightningBurst_spr.scale.set(param.point_1.scale);
			lLightningBurst_spr.alpha = param.point_1.alpha;
		}
		else
		{
			lLightningBurst_spr.scale.set(0);
			lLightningBurst_spr.alpha = 0;
		}

		lLightningBurst_spr.blendMode = PIXI.BLEND_MODES.ADD;
	
		let l_seq = [
			{tweens: [], duration: param.delay * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: param.point_1.scale}, {prop: 'scale.y', to: param.point_1.scale}, {prop: 'alpha', to: param.point_1.alpha}], duration: param.point_1.duration * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: param.point_2.scale}, {prop: 'scale.y', to: param.point_2.scale}, {prop: 'alpha', to: param.point_2.alpha}], duration: param.point_2.duration * FRAME_RATE}, 
			{tweens: [{prop: 'scale.x', to: param.point_3.scale}, {prop: 'scale.y', to: param.point_3.scale}, {prop: 'alpha', to: param.point_3.alpha}], duration: param.point_3.duration * FRAME_RATE,  ease: Easing.quadratic.easeIn, 
				onfinish: ()=>{
				this._onOutroAnimationEnded(aIndex);
			}}
		]

		this._fOutroAnimationCount_num++;
		Sequence.start(lLightningBurst_spr, l_seq);
	}

	_onOutroAnimationEnded(aIndex)
	{
		this._fOutroLightningBurst_arr[aIndex] && this._fOutroLightningBurst_arr[aIndex].destroy();

		this._fOutroAnimationCount_num--;

		if (this._fOutroAnimationCount_num == 0)
		{
			for (let i = 0; i < BURST_COUNT_OUTRO; i++)
			{
				if (!this._fOutroLightningBurst_arr)
				{
					break;
				}

				this._fOutroLightningBurst_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fOutroLightningBurst_arr[i]));
				this._fOutroLightningBurst_arr[i] && this._fOutroLightningBurst_arr[i].destroy();
				this._fOutroLightningBurst_arr[i] = null;
			}
			
			this._fIsOutroAnimating_bl = false;
			
			this.emit(LightningCapsuleLightningBurstAnimation.EVENT_ON_OUTRO_ANIMATION_ENDED);
		}
	}

	destroy()
	{
		super.destroy();

		for (let i = 0; i < BURST_COUNT_INTRO; i++)
		{
			if (!this._fIntroLightningBurst_arr)
			{
				break;
			}

			this._fIntroLightningBurst_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fIntroLightningBurst_arr[i]));
			this._fIntroLightningBurst_arr[i] && this._fIntroLightningBurst_arr[i].destroy();
			this._fIntroLightningBurst_arr[i] = null;
		}

		for (let i = 0; i < BURST_COUNT_IDLE; i++)
		{
			if (!this._fIdleLightningBurst_arr)
			{
				break;
			}

			this._fIdleLightningBurst_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fIdleLightningBurst_arr[i]));
			this._fIdleLightningBurst_arr[i] && this._fIdleLightningBurst_arr[i].destroy();
			this._fIdleLightningBurst_arr[i] = null;
		}

		for (let i = 0; i < BURST_COUNT_OUTRO; i++)
		{
			if (!this._fIdleLightningBurst_arr)
			{
				break;
			}

			this._fOutroLightningBurst_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fOutroLightningBurst_arr[i]));
			this._fOutroLightningBurst_arr[i] && this._fOutroLightningBurst_arr[i].destroy();
			this._fOutroLightningBurst_arr[i] = null;
		}

		this._fIntroLightningBurst_arr = null;
		this._fIdleLightningBurst_arr = null;
		this._fOutroLightningBurst_arr = null;
	}
}

export default LightningCapsuleLightningBurstAnimation;