import Sprite from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import * as Easing from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { APP } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../../../../shared/src/CommonConstants';
import { Sequence } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import { Utils } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';

const SMOKE_PARAM =[
	{
		delay: 9, //#17
		position: {x: 22.45, y: 46.05},
		rotation: 0,
		scale: {x: 1.19, y: 1.19},
		anim: {x: 34.8, y: -153.8, scale: 1.506, angle: -36 },
		duration: 66,
		asset: "pink"
	},
	{
		delay: 4, //#16
		position: {x: -42.65, y: -51.65},
		rotation: -0.6283185307179586, //Utils.gradToRad(-36)
		scale: {x: 1.506, y: 1.506},
		anim: {x: -138.45, y: -225.6, scale: 1.506, angle: -2.3736477827122884 }, //Utils.gradToRad(-136)
		duration: 76,
		asset: "pink"
	},
	{
		delay: 6, //#15
		position: {x: 13.45, y: 129.1},
		rotation: 0,
		scale: {x: 1.74, y: 1.74},
		anim: {x: 116.8, y: -254.9, scale: 2.056, angle: -0.6283185307179586 }, //Utils.gradToRad(-36)
		duration: 66,
		asset: "pink"
	},
	{
		delay: 5, //#14
		position: {x: -55.35, y: 26.15},
		rotation: 0,
		scale: {x: 1.94, y: 1.94},
		anim: {x: -434.3, y: -77.25, scale: 2.256, angle: 1.9198621771937625 }, //Utils.gradToRad(110)
		duration: 66,
		asset: "pink"
	},
	{
		delay: 7, //#13
		position: {x: 56.75, y: -1.95},
		rotation: -0.6283185307179586, //Utils.gradToRad(-36)
		scale: {x: 2.02, y: 2.02},
		anim: {x: -135.4, y: 204.05, scale: 2.336, angle: -2.3736477827122884 }, //Utils.gradToRad(-136)
		duration: 78,
		asset: "pink"
	},
	{
		delay: 3,  //#12
		position: {x: 130.7, y: 57.5},
		rotation: 0,
		scale: {x: 2.15, y: 2.15},
		anim: {x: 479.15, y: -36.85, scale: 2.466, angle: -129 }, //Utils.gradToRad(-129)
		duration: 66,
		asset: "pink"
	},
	{
		delay: 7,  //#11
		position: {x: -45.35, y: 26.15},
		rotation: 0,
		scale: {x: 1.18, y: 1.18},
		anim: {x: -382.3, y: 51.75, scale: 1.496, angle: 1.9198621771937625 }, //Utils.gradToRad(110)
		duration: 66,
		asset: "purple"
	},
	{
		delay: 5,  //#10
		position: {x: 56.75, y: -1.95},
		rotation: -0.6283185307179586, //Utils.gradToRad(-36)
		scale: {x: 1.63, y: 1.63},
		anim: {x: 253.55, y: 146.05, scale: 1.946, angle: -2.3736477827122884 }, //Utils.gradToRad(-136)
		duration: 76,
		asset: "purple"
	},
	{
		delay: 3, //#9
		position: {x: 130.7, y: 57.5},
		rotation: 0,
		scale: {x: 1.13, y: 1.13},
		anim: {x: 409.15, y: -95.85, scale: 1.446, angle: -2.251474735072685 }, //Utils.gradToRad(-129)
		duration: 66,
		asset: "purple"
	}	
];

const PARTICLE_PARAM = [
	{
		delay: 21,
		position: {x: 19.75, y: -110.95}, //#8
		rotation: 0.07504915783575616, //Utils.gradToRad(4.3)
		scale: {x: 0.228, y: 0.228},
		anim: {x: 416.8, y: -215.8, scale: 0.6, angle: 1.0821041362364843} //Utils.gradToRad(62)
	},
	{
		delay: 21,
		position: {x: -27, y: -114.75}, //#7
		rotation: 1.5132004614790837, //Utils.gradToRad(86.7)
		scale: {x: 0.128, y: 0.128},
		anim: {x: -330, y: -232.65, scale: 0.5, angle: 2.600540585471551} //Utils.gradToRad(149)
	},	
	{
		delay: 37,
		position: {x: -103.95, y: -58.6}, //#6
		rotation: 2.0420352248333655, //Utils.gradToRad(117)
		scale: {x: 0.358, y: 0.358},
		anim: {x: -316.2, y: 90.8, scale: 0.73, angle: 2.9670597283903604} //Utils.gradToRad(170)
	},
	{
		delay: 37,
		position: {x: 3.6, y: -94.6}, //#5
		rotation: 2.007128639793479, //Utils.gradToRad(115)
		scale: {x: 0.508, y: 0.508},
		anim: {x: 309.35, y: 131.5, scale: 0.88, angle: 2.4609142453120043} //Utils.gradToRad(141)
	},	
]

const LIGHT_PARTICLE_PARAM = [
	{
		delay: 21,
		position: {x: 32.85, y: -108.25}, //#4
		rotation: 0.047123889803846894, //Utils.gradToRad(2.7)
		scale: {x: 0.458, y: 0.458},
		anim: {x: 443.3, y: -210.3, scale: 0.83, angle: 0.6632251157578452}, //Utils.gradToRad(38)
		alpha_duration: 60,
		wiggle: 0.3
	},
	{
		delay: 21,
		position: {x: -42.05, y: -119.95}, //#3
		rotation: 1.478293876439197, //Utils.gradToRad(84.7)
		scale: {x: 1.068, y: 1.068},
		anim: {x: -419, y: -252.65, scale: 0.83, angle: 0.6632251157578452}, //Utils.gradToRad(38)
		alpha_duration: 38,
		wiggle: 0.45
	},
	{
		delay: 37,
		position: {x: -38.6, y: -44.65}, //#2
		rotation: 1.94255145746968853, //Utils.gradToRad(111.3)
		scale: {x: 1.298, y: 1.298},
		anim: {x: -369.7, y: 167.8, scale: 1.44, angle: 2.0943951023931953}, //Utils.gradToRad(120)
		alpha_duration: 31,
		wiggle: 0.3
	},
	{
		delay: 37,
		position: {x: 94, y: -70.65}, //#1
		rotation: 1.9425514574696885, //Utils.gradToRad(111.3)
		scale: {x: 1.008, y: 1.008},
		anim: {x: 344.35, y: 194, scale: 1.38, angle: 1.5533430342749535}, //Utils.gradToRad(89)
		alpha_duration: 44,
		wiggle: 0.45
	},
]

class LightningBossExplosionAnimation extends Sprite
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

		this._fContainerParticle_spr_arr = [];
		this._fParticle_spr_arr = [];

		this._fWiggleContainerLightParticle_spr_arr = [];
		this._fContainerLightParticle_spr_arr = [];
		this._fLightParticle_spr_arr = [];
		this._fIsNeedWiggleLightParticle_arr = [];
	}

	_startAnimation()
	{
		this._fAnimationCount_num = 0;
		
		for (let i = 0; i < SMOKE_PARAM.length; i++)
		{
			this._fAnimationCount_num++;
			this._startSmokeOnce(i);
		}

		for (let i = 0; i < PARTICLE_PARAM.length; i++)
		{
			this._fAnimationCount_num++;
			this._startParticleOnce(i);
		}

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			for (let i = 0; i < LIGHT_PARTICLE_PARAM.length; i++)
			{
				this._fAnimationCount_num++;
				this._startLightParticleOnce(i);
			}
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
		lSmoke_spr.position = param.position;
		
		let lSmoke_seq = [
			{tweens: [], duration: param.delay * FRAME_RATE},
			{tweens: [
						{prop: 'x', to: param.anim.x},
						{prop: 'y', to: param.anim.y},
						{prop: 'scale.x', to: param.anim.scale},
						{prop: 'scale.y', to: param.anim.scale},
						{prop: 'rotation', to: param.anim.angle},

					 ], ease: Easing.quadratic.easeOut, duration: 74 * FRAME_RATE,
					onfinish: ()=>{
						lSmoke_spr && lSmoke_spr.destroy();
						lSmoke_spr = null;
			}}
		]

		Sequence.start(lSmoke_spr, lSmoke_seq);	

		let lContainer_seq = [
			{tweens: [], duration: param.delay * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0.73}], duration: 8 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0}], duration: 66 * FRAME_RATE,
					onfinish: ()=>{
						this._fContainerSmoke_spr_arr[aIndex] && this._fContainerSmoke_spr_arr[aIndex].destroy();
						this._fContainerSmoke_spr_arr[aIndex] = null;
						this._fAnimationCount_num--;
						this._onAnimationCompletedSuspicison();
			}}
		];

		Sequence.start(lContainer_spr, lContainer_seq);
	}

	_startParticleOnce(aIndex)
	{
		let param = PARTICLE_PARAM[aIndex];
		let lContainer_spr = this._fContainerParticle_spr_arr[aIndex] = this.addChild(new Sprite());
		let lParticle_spr = this._fParticle_spr_arr[aIndex] = this._fContainerParticle_spr_arr[aIndex].addChild(APP.library.getSprite('boss_mode/common/particles_yellow'));
	
		lContainer_spr.alpha = 1;
		lParticle_spr.scale = param.scale;
		lParticle_spr.rotation = param.rotation;
		lParticle_spr.position = param.position;
		
		let lSmoke_seq = [
			{tweens: [
						{prop: 'x', to: param.anim.x},
						{prop: 'y', to: param.anim.y},
						{prop: 'scale.x', to: param.anim.scale},
						{prop: 'scale.y', to: param.anim.scale},
						{prop: 'rotation', to: param.anim.angle},

					 ], ease: Easing.quadratic.easeOut, duration: 81 * FRAME_RATE,
					onfinish: ()=>{
						lParticle_spr && lParticle_spr.destroy();
						lParticle_spr = null;
			}}
		]

		Sequence.start(lParticle_spr, lSmoke_seq);

		let lContainer_seq = [
			{tweens: [], duration: param.delay * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0}], duration: (81 - param.delay) * FRAME_RATE,
					onfinish: ()=>{
						this._fContainerParticle_spr_arr[aIndex] && this._fContainerParticle_spr_arr[aIndex].destroy();
						this._fContainerParticle_spr_arr[aIndex] = null;
						this._fAnimationCount_num--;
						this._onAnimationCompletedSuspicison();
			}}
		];

		Sequence.start(lContainer_spr, lContainer_seq);
	}

	_startLightParticleOnce(aIndex)
	{
		let param = LIGHT_PARTICLE_PARAM[aIndex];
		let lWiggleContainer_spr = this._fWiggleContainerLightParticle_spr_arr[aIndex] = this.addChild(new Sprite());
		let lContainer_spr = this._fContainerLightParticle_spr_arr[aIndex] = this._fWiggleContainerLightParticle_spr_arr[aIndex].addChild(new Sprite());
		let lLightParticle_spr = this._fLightParticle_spr_arr[aIndex] = this._fContainerLightParticle_spr_arr[aIndex].addChild(APP.library.getSprite('common/light_particle'));
	
		lContainer_spr.alpha = 1;
		lLightParticle_spr.scale = param.scale;
		lLightParticle_spr.rotation = param.rotation;
		lLightParticle_spr.position = param.position;
		
		let lSmoke_seq = [
			{tweens: [
						{prop: 'x', to: param.anim.x},
						{prop: 'y', to: param.anim.y},
						{prop: 'scale.x', to: param.anim.scale},
						{prop: 'scale.y', to: param.anim.scale},
						{prop: 'rotation', to: param.anim.angle},

					 ], ease: Easing.quadratic.easeOut, duration: 81 * FRAME_RATE,
					onfinish: ()=>{
						lLightParticle_spr && lLightParticle_spr.destroy();
						lLightParticle_spr = null;
			}}
		]

		Sequence.start(lLightParticle_spr, lSmoke_seq);	


		let lContainer_seq = [
			{tweens: [], duration: param.delay * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0}], duration: (param.alpha_duration) * FRAME_RATE},
			{tweens: [], duration: (81 - param.delay - param.alpha_duration) * FRAME_RATE,
					onfinish: ()=>{
						this._fContainerLightParticle_spr_arr[aIndex] && this._fContainerLightParticle_spr_arr[aIndex].destroy();
						this._fContainerLightParticle_spr_arr[aIndex] = null;
						this._fIsNeedWiggleLightParticle_arr[aIndex] = false;
						this._fAnimationCount_num--;
						this._onAnimationCompletedSuspicison();
			}}
		];

		Sequence.start(lContainer_spr, lContainer_seq);

		lWiggleContainer_spr.alpha = 1;
		this._fIsNeedWiggleLightParticle_arr[aIndex] = true;
		this._fAnimationCount_num++;
		this._startLightParticleWiggle(aIndex);
	}

	_startLightParticleWiggle(aIndex)
	{
		let lWiggleValue = LIGHT_PARTICLE_PARAM[aIndex].wiggle;
		let l_seq = [
			{tweens: [
					{prop: 'alpha', to: Utils.getRandomWiggledValue((1 - lWiggleValue), lWiggleValue)},
					], duration: 1 * FRAME_RATE,
			onfinish: ()=>{
				if (this._fIsNeedWiggleLightParticle_arr[aIndex])
				{
					this._startLightParticleWiggle(aIndex);
				}
				else
				{
					this._fWiggleContainerLightParticle_spr_arr[aIndex] && this._fWiggleContainerLightParticle_spr_arr[aIndex].destroy();
					this._fWiggleContainerLightParticle_spr_arr[aIndex] = null;
					this._fAnimationCount_num--;
					this._onAnimationCompletedSuspicison();	
				}
			}} 
		];

		Sequence.start(this._fWiggleContainerLightParticle_spr_arr[aIndex], l_seq);
	}


	_onAnimationCompletedSuspicison()
	{
		if (this._fAnimationCount_num == 0)
		{
			this.emit(LightningBossExplosionAnimation.EVENT_ON_ANIMATION_ENDED);
		}
	}


	destroy()
	{
		super.destroy();

		this._fIsNeedWiggleLightParticle_arr = [];

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


		for (let i = 0; i < this._fParticle_spr_arr.length; i++)
		{
			if (!this._fParticle_spr_arr)
			{
				break;
			}

			this._fParticle_spr_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fParticle_spr_arr[i]));
			this._fParticle_spr_arr[i] && this._fParticle_spr_arr[i].destroy();
			this._fParticle_spr_arr[i] = null;
		}

		this._fParticle_spr_arr = [];


		for (let i = 0; i < this._fContainerParticle_spr_arr.length; i++)
		{
			if (!this._fContainerParticle_spr_arr)
			{
				continue;
			}

			this._fContainerParticle_spr_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fContainerParticle_spr_arr[i]));
			this._fContainerParticle_spr_arr[i] && this._fContainerParticle_spr_arr[i].destroy();
			this._fContainerParticle_spr_arr[i] = null;
		}

		this._fContainerParticle_spr_arr = [];

		for (let i = 0; i < this._fLightParticle_spr_arr.length; i++)
		{
			if (!this._fLightParticle_spr_arr)
			{
				break;
			}

			this._fLightParticle_spr_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fLightParticle_spr_arr[i]));
			this._fParticle_spr_arr[i] && this._fLightParticle_spr_arr[i].destroy();
			this._fLightParticle_spr_arr[i] = null;
		}

		this._fParticle_spr_arr = [];


		for (let i = 0; i < this._fContainerLightParticle_spr_arr.length; i++)
		{
			if (!this._fContainerLightParticle_spr_arr)
			{
				continue;
			}

			this._fContainerLightParticle_spr_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fContainerLightParticle_spr_arr[i]));
			this._fContainerLightParticle_spr_arr[i] && this._fContainerLightParticle_spr_arr[i].destroy();
			this._fContainerLightParticle_spr_arr[i] = null;
		}

		this._fContainerLightParticle_spr_arr = [];

		for (let i = 0; i < this._fWiggleContainerLightParticle_spr_arr.length; i++)
		{
			if (!this._fWiggleContainerLightParticle_spr_arr)
			{
				continue;
			}

			this._fWiggleContainerLightParticle_spr_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fWiggleContainerLightParticle_spr_arr[i]));
			this._fWiggleContainerLightParticle_spr_arr[i] && this._fWiggleContainerLightParticle_spr_arr[i].destroy();
			this._fWiggleContainerLightParticle_spr_arr[i] = null;
		}

		this._fWiggleContainerLightParticle_spr_arr = [];

		this._fAnimationCount_num = null;
	}
}

export default LightningBossExplosionAnimation;