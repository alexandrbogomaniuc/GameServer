import Sprite from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { APP } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../../../../shared/src/CommonConstants';
import { Sequence } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import { Utils } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';

const SMOKE_PARAM =[
	{
		delay: 1,
		position: {x: 0, y: 0},
		rotation: 0,
		scale: {x: 1.09, y: 1.09},
		container_anim: {x: 78, y: -26, scale: 1.65, angle: 1.0821041362364843 }, //Utils.gradToRad(62)
		asset: "orange"
	},
	{
		delay: 5+1,
		position: {x: 0, y: 0},
		rotation: 0.5061454830783556, //Utils.gradToRad(29)
		scale: {x: 0.8, y: 0.8},
		container_anim: {x: 78, y: -26, scale: 1.36, angle: 1.5882496193148399 }, //Utils.gradToRad(91)
		asset: "yellow"
	},
	{
		delay: 17+1,
		position: {x: 0, y: 0},
		rotation: 0.5410520681182421, //Utils.gradToRad(31)
		scale: {x: 0.81, y: 0.81},
		container_anim: {x: -110, y: -22, scale: 1.37, angle: 1.6231562043547263}, //Utils.gradToRad(93)
		asset: "orange"
	},
	{
		delay: 35+1,
		position: {x: 0, y: 0},
		rotation: 0,
		scale: {x: 0.98, y: 0.98},
		container_anim: {x: -12, y: -88, scale: 1.54, angle: 1.0821041362364843}, //Utils.gradToRad(62)
		asset: "orange"
	},
	{
		delay: 40+1,
		position: {x: 0, y: 0},
		rotation: 0.8726646259971648, //Utils.gradToRad(50)
		scale: {x: 0.59, y: 0.59},
		container_anim: {x: -12, y: -88, scale: 1.15, angle: 1.9547687622336491}, //Utils.gradToRad(112)
		asset: "yellow"
	},
	{
		delay: 52+1,
		position: {x: 0, y: 0},
		rotation: 0.5410520681182421, //Utils.gradToRad(31)
		scale: {x: 0.83, y: 0.83},
		container_anim: {x: 38, y: 58, scale: 1.39, angle: 1.6231562043547263}, //Utils.gradToRad(93)
		asset: "orange"
	}
];

class LightningBossYellowOrangeSmokeAnimation extends Sprite
{
	static get EVENT_ON_ANIMATION_ENDED()				{return "onIntroAnimationEnded";}
	static get EVENT_ON_OUTRO_ANIMATION_ENDED()				{return "onOutroAnimationEnded";}

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
		lSmoke_spr.scale = param.scale;
		lSmoke_spr.rotation = param.rotation;

		
		let lSmoke_seq = [
			{tweens: [], duration: param.delay * FRAME_RATE},
			{tweens: [
						{prop: 'x', to: param.container_anim.x},
						{prop: 'y', to: param.container_anim.y},
						{prop: 'scale.x', to: param.container_anim.scale},
						{prop: 'scale.y', to: param.container_anim.scale},
						{prop: 'rotation', to: param.container_anim.angle},

					 ], duration: 52 * FRAME_RATE,
					onfinish: ()=>{
						lSmoke_spr && lSmoke_spr.destroy();
						lSmoke_spr = null;
			}}
		]

		Sequence.start(lSmoke_spr, lSmoke_seq);	


		let lContainer_seq = [
			{tweens: [], duration: param.delay * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0.55}], duration: 12 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0}], duration: 40 * FRAME_RATE,
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
			this.emit(LightningBossYellowOrangeSmokeAnimation.EVENT_ON_ANIMATION_ENDED);
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

export default LightningBossYellowOrangeSmokeAnimation;