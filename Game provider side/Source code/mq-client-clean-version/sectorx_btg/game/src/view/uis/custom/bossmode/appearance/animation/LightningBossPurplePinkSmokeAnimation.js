import Sprite from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import * as Easing from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { APP } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../../../../shared/src/CommonConstants';
import { Sequence } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import { Utils } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';

const SMOKE_PARAM =[
	{
		delay: 0,
		position: {x: -127, y: 61}, 
		rotation: 0.41887902047863906, //Utils.gradToRad(24)
		alpha: 0,
		scale: {x: 1.13, y: 1.13},
		smoke_anim: {
			one: {x: -147.45, angle: 0.6073745796940266, time: 3}, //Utils.gradToRad(34.8)
			two: {x: 124.35, angle: 3.8083084278516264, time: 51}, //Utils.gradToRad(218.2)
			three: {x: 113, angle: 3.9968039870670142, time: 4} //Utils.gradToRad(229)
		},
		container_anim: {
			one: {y: 86.05, scale: 2.068, alpha: 0.9, time: 30},
			two: {y: 63, scale: 1.13, alpha: 0, time: 28}
		},
		asset: "pink"
	},
	{
		delay: 1,
		position: {x: -64, y: 1},
		rotation: 0,
		alpha: 0,
		scale: {x: 0.67, y: 0.67},
		smoke_anim: {
			one: {x: -84.15, angle: 0.1832595714594046, time: 6}, //Utils.gradToRad(10.5)
			two: {x: 86.65, angle: 1.3543754995475996, time: 32}, //Utils.gradToRad(77.6)
			three: {x: 70.05, angle: 1.5009831567151233, time: 5} //Utils.gradToRad(86)
		},
		container_anim: {
			one: {y: 34.05, scale: 1.18, alpha: 0.7, time: 22},
			two: {y: 1, scale: 0.67, alpha: 0, time: 21}
		},
		asset: "purple"
	},
	{
		delay: 7,
		position: {x: -64, y: 1},
		rotation: 0,
		alpha: 0,
		scale: {x: 0.67, y: 0.67},
		smoke_anim: {
			one: {x: -85.9, angle: 0.1832595714594046, time: 6}, //Utils.gradToRad(10.5)
			two: {x: 76.65, angle: 1.3543754995475996, time: 31}, //Utils.gradToRad(77.6)
			three: {x: 65, angle: 1.5009831567151233, time: 6} //Utils.gradToRad(86)
		},
		container_anim: {
			one: {y: 34, scale: 1.18, alpha: 0.9, time: 22},
			two: {y: 1, scale: 0.67, alpha: 0, time: 21}
		},
		asset: "orange"
	},
	{
		delay: 12,
		position: {x: -117, y: 53},
		rotation: 1.9547687622336491, //Utils.gradToRad(112)
		alpha: 0,
		scale: {x: 1.13, y: 1.13},
		smoke_anim: {
			one: {x: -135.5, angle: 2.3806290997202657, time: 5}, //Utils.gradToRad(136.4)
			two: {x: 121.7, angle: 5.51873109480607, time: 50}, //Utils.gradToRad(316.2)
			three: {x: 109, angle: 5.707226654021458, time: 4} //Utils.gradToRad(327)
		},
		container_anim: {
			one: {y: 107.9, scale: 1.64, alpha: 0.9, time: 30},
			two: {y: 59, scale: 1.13, alpha: 0, time: 29}
		},
		asset: "pink"
	},
	{
		delay: 14,
		position: {x: -59, y: 0},
		rotation: -1.1868238913561442, //Utils.gradToRad(-68)
		alpha: 0.23,
		scale: {x: 0.67, y: 0.67},
		smoke_anim: {
			one: {x: -82, angle: -1.0035643198967394, time: 6}, //Utils.gradToRad(-57.5)
			two: {x: 73.8, angle: 0.16755160819145562, time: 31}, //Utils.gradToRad(9.6)
			three: {x: 56, angle: 0.3141592653589793, time: 6} //Utils.gradToRad(18)
		},
		container_anim: {
			one: {y: 34, scale: 1.18, alpha: 0.9, time: 22},
			two: {y: -4, scale: 0.67, alpha: 0, time: 21}
		},
		asset: "purple"
	},
	{
		delay: 28,
		position: {x: -64, y: 0},
		rotation: 0.41887902047863906, //Utils.gradToRad(24)
		alpha: 0.23,
		scale: {x: 0.67, y: 0.67},
		smoke_anim: {
			one: {x: -85.9, angle: 0.6021385919380436, time: 6}, //Utils.gradToRad(34.5)
			two: {x: 77.45, angle: 1.7732545200262386, time: 32}, //Utils.gradToRad(101.6)
			three: {x: 61, angle: 1.9198621771937625, time: 5} //Utils.gradToRad(110)
		},
		container_anim: {
			one: {y: 34, scale: 1.18, alpha: 0.9, time: 22},
			two: {y: -1, scale: 0.67, alpha: 0, time: 21}
		},
		asset: "purple"
	},
	{
		delay: 33,
		position: {x: -64, y: 0},
		rotation: 0.41887902047863906, //Utils.gradToRad(24)
		alpha: 0.23,
		scale: {x: 0.67, y: 0.67},
		smoke_anim: {
			one: {x: -85.9, angle: 0.6021385919380436, time: 6}, //Utils.gradToRad(34.5)
			two: {x: 77.45, angle: 1.7732545200262386, time: 32}, //Utils.gradToRad(101.6)
			three: {x: 61, angle: 1.9198621771937625, time: 5} //Utils.gradToRad(110)
		},
		container_anim: {
			one: {y: 34, scale: 1.18, alpha: 0.9, time: 22},
			two: {y: -1, scale: 0.67, alpha: 0, time: 21}
		},
		asset: "yellow"
	},
	{
		delay: 34,
		position: {x: -120, y: 61},
		rotation: 0.41887902047863906, //Utils.gradToRad(24)
		alpha: 0.23,
		scale: {x: 1.13, y: 1.13},
		smoke_anim: {
			one: {x: -140, angle: 0.6702064327658225, time: 5}, //Utils.gradToRad(38.4)
			two: {x: 133.5, angle: 3.8083084278516264, time: 50}, //Utils.gradToRad(218.2)
			three: {x: 120, angle: 3.9968039870670142, time: 4} //Utils.gradToRad(229)
		},
		container_anim: {
			one: {y: 108.85, scale: 1.98, alpha: 0.9, time: 30},
			two: {y: 62, scale: 1.13, alpha: 0, time: 29}
		},
		asset: "pink"
	},
	{
		delay: 50,
		position: {x: -64, y: 11},
		rotation: 0,
		alpha: 0.23,
		scale: {x: 0.67, y: 0.67},
		smoke_anim: {
			one: {x: -85.9, angle: 0.1832595714594046, time: 6}, //Utils.gradToRad(10.5)
			two: {x: 76.65, angle: 1.3543754995475996, time: 32}, //Utils.gradToRad(77.6)
			three: {x: 60, angle: 1.5009831567151233, time: 5} //Utils.gradToRad(86)
		},
		container_anim: {
			one: {y: 44.1, scale: 1.18, alpha: 0.9, time: 22},
			two: {y: 1, scale: 0.67, alpha: 0, time: 21}
		},
		asset: "purple"
	},
	{
		delay: 57,
		position: {x: -132, y: 61},
		rotation: 0.41887902047863906, //Utils.gradToRad(24)
		alpha: 0.23,
		scale: {x: 1.13, y: 1.13},
		smoke_anim: {
			one: {x: -147.5, angle: 0.6073745796940266, time: 4}, //Utils.gradToRad(34.8)
			two: {x: 124.35, angle: 3.8083084278516264, time: 51}, //Utils.gradToRad(218.2)
			three: {x: 113, angle: 3.9968039870670142, time: 3} //Utils.gradToRad(229)
		},
		container_anim: {
			one: {y: 86.05, scale: 2.07, alpha: 0.9, time: 30},
			two: {y: 53, scale: 1.13, alpha: 0, time: 28}
		},
		asset: "pink"
	},
	{
		delay: 62,
		position: {x: -64, y: 1},
		rotation: 0,
		alpha: 0.23,
		scale: {x: 0.67, y: 0.67},
		smoke_anim: {
			one: {x: -89.4, angle: 0.1832595714594046, time: 6}, //Utils.gradToRad(10.5)
			two: {x: 76.65, angle: 1.3543754995475996, time: 32}, //Utils.gradToRad(77.6)
			three: {x: 60, angle: 1.5009831567151233, time: 5} //Utils.gradToRad(86)
		},
		container_anim: {
			one: {y: 34.1, scale: 1.18, alpha: 0.9, time: 22},
			two: {y: 1, scale: 0.67, alpha: 0, time: 21}
		},
		asset: "orange"
	}
];

class LightningBossPurplePinkSmokeAnimation extends Sprite
{
	static get EVENT_ON_ANIMATION_ENDED()				{return "onIntroAnimationEnded";}

	i_startAnimation()
	{
		this._startAnimation();
	}

	constructor()
	{
		super();
		
		this._fAnimationCount_num = null;

		this._fContainerSmoke_spr_arr = [];
		this._fSmoke_spr_arr = [];
	}

	_startAnimation()
	{
		this._fAnimationCount_num = 0;
		
		for (let i = 0; i < SMOKE_PARAM.length; i++)
		{
			this._fAnimationCount_num++;
			this._startSmokeOnce(i);
		}
	}

	_startSmokeOnce(aIndex)
	{
		let param = SMOKE_PARAM[aIndex];
		let lContainer_spr = this._fContainerSmoke_spr_arr[aIndex] = this.addChild(new Sprite());
		let lSmoke_spr = this._fSmoke_spr_arr[aIndex] = this._fContainerSmoke_spr_arr[aIndex].addChild(APP.library.getSprite('boss_mode/lightning/main_smoke/smoke_'+param.asset));
	
		lContainer_spr.alpha = 0;
		lContainer_spr.scale = param.scale;
		lContainer_spr.position.y = param.position.y;

		lSmoke_spr.scale.set(1, 1);
		lSmoke_spr.rotation = param.rotation;
		lSmoke_spr.position.x = param.position.x;

		let lSmoke_seq = [
			{tweens: [], duration: param.delay * FRAME_RATE},
			{tweens: [
				{prop: 'x', to: param.smoke_anim.one.x}, 
				{prop: 'rotation', to: param.smoke_anim.one.angle}
			], ease: Easing.quadratic.easeOut, duration: param.smoke_anim.one.time * FRAME_RATE},
			{tweens: [
				{prop: 'x', to: param.smoke_anim.two.x}, 
				{prop: 'rotation', to: param.smoke_anim.two.angle}
			], ease: Easing.quadratic.easeIn, duration: param.smoke_anim.two.time * FRAME_RATE,
					onfinish: ()=>{
						lSmoke_spr && lSmoke_spr.destroy();
						lSmoke_spr = null;
			}}
		]

		Sequence.start(lSmoke_spr, lSmoke_seq);

		let lContainer_seq = [
			{tweens: [], duration: param.delay * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: param.alpha}], duration: 0 * FRAME_RATE},
			{tweens: [
						{prop: 'scale.x', to: param.container_anim.one.scale}, 
						{prop: 'scale.y', to: param.container_anim.one.scale}, 
						{prop: 'y', to: param.container_anim.one.y}, 
						{prop: 'alpha', to: param.container_anim.one.alpha}
					], duration: param.container_anim.one.time * FRAME_RATE},
			{tweens: [
						{prop: 'scale.x', to: param.container_anim.two.scale},
						{prop: 'scale.y', to: param.container_anim.two.scale},
						{prop: 'y', to: param.container_anim.two.y}, 
						{prop: 'alpha', to: param.container_anim.two.alpha}
					], duration: param.container_anim.two.time * FRAME_RATE,
					onfinish: ()=>{
						this._fContainerSmoke_spr_arr[aIndex] && this._fContainerSmoke_spr_arr[aIndex].destroy();
						this._fContainerSmoke_spr_arr[aIndex] = null;
						this._fAnimationCount_num--;
						this._onAnimationCompletedSuspicison();	
			}}
		];

		Sequence.start(lContainer_spr, lContainer_seq);

	}

	_onAnimationCompletedSuspicison()
	{
		if (this._fAnimationCount_num == 0)
		{
			this.emit(LightningBossPurplePinkSmokeAnimation.EVENT_ON_ANIMATION_ENDED);
		}
	}


	destroy()
	{
		super.destroy();

		for (let i = 0; i < this._fSmoke_spr_arr.length; i++)
		{
			if (!this._fSmoke_spr_arr)
			{
				break;
			}

			this._fSmoke_spr_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fSmoke_spr_arr[i]));
			this._fSmoke_spr_arr[i] && this._fSmoke_spr_arr[i].destroy();
			this._fSmoke_spr_arr[i] = null;
		}

		this._fSmoke_spr_arr = [];


		for (let i = 0; i < this._fContainerSmoke_spr_arr.length; i++)
		{
			if (!this._fContainerSmoke_spr_arr)
			{
				continue;
			}

			this._fContainerSmoke_spr_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fContainerSmoke_spr_arr[i]));
			this._fContainerSmoke_spr_arr[i] && this._fContainerSmoke_spr_arr[i].destroy();
			this._fContainerSmoke_spr_arr[i] = null;
		}

		this._fContainerSmoke_spr_arr = [];

		this._fAnimationCount_num = null;
	}
}

export default LightningBossPurplePinkSmokeAnimation;