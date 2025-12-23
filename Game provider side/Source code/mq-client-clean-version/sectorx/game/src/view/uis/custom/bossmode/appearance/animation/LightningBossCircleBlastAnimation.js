import Sprite from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import * as Easing from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { APP } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../../../../shared/src/CommonConstants';
import { Sequence } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';

const CIRCLE_APPERANCE_PARAM =[
	{
		delay: 104,
		alpha: 0.48,
		position: {x: -8, y: -18},
		scale: {x: 0.312, y: 0.1872}, // x: 0.156 * 2, y: 0.156 * 0.6 * 2
		asset: "lightning/circle_blast_compressed"
	},
	{
		delay: 104,
		alpha: 0.6,
		position: {x: -8, y: -18},
		scale: {x: 0.312, y: 0.1872}, //x: 0.156 * 2, y: 0.156 * 0.6  * 2
		asset: "common/circle_blast"
	},
	{
		delay: 104,
		alpha: 0.6,
		position: {x: -8, y: -18},
		scale: {x: 0.312, y: 0.1872}, //x: 0.156 * 2, y: 0.156 * 0.6  * 2
		asset: "common/circle_blast"
	},
];

const CIRCLE_DISAPPERANCE_PARAM =[
	{
		delay: 4,
		alpha: 0.6,
		position: {x: -8, y: -18},
		scale: {x: 0.312, y: 0.1872}, //x: 0.156 * 2, y: 0.156 * 0.6  * 2
		asset: "common/circle_blast"
	},
	{
		delay: 4,
		alpha: 0.48,
		position: {x: -8, y: -18},
		scale: {x: 0.312, y: 0.1872}, //: 0.156 * 2, y: 0.156 * 0.6  * 2
		asset: "common/circle_blast"
	}
];

class LightningBossCircleBlastAnimation extends Sprite
{
	static get EVENT_ON_ANIMATION_ENDED()				{return "onAnimationEnded";}

	i_startAppearanceAnimation()
	{
		this._startAnimation(CIRCLE_APPERANCE_PARAM);
	}

	i_startDisappearanceAnimation()
	{
		this._startAnimation(CIRCLE_DISAPPERANCE_PARAM);
	}

	constructor()
	{
		super();
		
		this._fAnimationCount_num = null;

		this._fContainerParticle_spr_arr = [];
		this._fCircle_spr_arr = [];
	}

	_startAnimation(aParam_arr)
	{
		if (!APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._onCircleAnimationCompletedSuspicison();
			return;
		}

		this._fAnimationCount_num = 0;
		
		for (let i = 0; i < aParam_arr.length; i++)
		{
			this._fAnimationCount_num++;
			this._startCircleBlast(i, aParam_arr[i]);
		}

	}

	_startCircleBlast(aIndex, aParam)
	{
		let lCircle_spr = this._fCircle_spr_arr[aIndex] = this.addChild(APP.library.getSprite('boss_mode/'+aParam.asset));

		lCircle_spr.alpha = 0;
		lCircle_spr.position = aParam.position;
		lCircle_spr.scale = aParam.scale;
		lCircle_spr.blendMode = PIXI.BLEND_MODES.SCREEN;
		
		let lSmoke_seq = [
			{tweens: [], duration: aParam.delay * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: aParam.alpha}], duration: 0 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 2.236}, {prop: 'scale.y', to: 1.3416}], duration: 4 * FRAME_RATE}, //{prop: 'scale.x', to: 1.118 * 2}, {prop: 'scale.y', to: 1.118 * 0.6 * 2}
			{tweens: [{prop: 'scale.x', to: 8.248}, {prop: 'scale.y', to: 4.9488}, {prop: 'alpha', to: 0}], duration: 8 * FRAME_RATE, //{prop: 'scale.x', to: 4.124 * 2}, {prop: 'scale.y', to: 4.124 * 0.6 * 2}, {prop: 'alpha', to: 0}
					onfinish: ()=>{
						lCircle_spr && lCircle_spr.destroy();
						lCircle_spr = null;
						this._fAnimationCount_num--;
						this._onCircleAnimationCompletedSuspicison();
			}}
		]

		Sequence.start(lCircle_spr, lSmoke_seq);
	}

	_onCircleAnimationCompletedSuspicison()
	{
		if (this._fAnimationCount_num == 0)
		{
			this.emit(LightningBossCircleBlastAnimation.EVENT_ON_ANIMATION_ENDED);
		}
	}

	destroy()
	{
		super.destroy();

		for (let i = 0; i < this._fCircle_spr_arr.length; i++)
		{
			if (!this._fCircle_spr_arr)
			{
				break;
			}

			this._fCircle_spr_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fCircle_spr_arr[i]));
			this._fCircle_spr_arr[i] && this._fCircle_spr_arr[i].destroy();
			this._fCircle_spr_arr[i] = null;
		}

		this._fCircle_spr_arr = [];	

		this._fAnimationCount_num = null;
	}
}

export default LightningBossCircleBlastAnimation;