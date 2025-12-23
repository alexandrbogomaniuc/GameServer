import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import * as Easing from '../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { FRAME_RATE } from '../../../../shared/src/CommonConstants';
import Sequence from '../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { Utils } from '../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import Sprite from '../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';

const WIN_BLAST_PARAM =[
	{
		delay: 0,
		position: {x: 0, y: 0},
		rotation: 0,
		scale: {x: 0, y: 0},
		second_scale: 0.682,
		second_rotation: 0.05759586531581287, //Utils.gradToRad(3.3);
		third_scale: 1.172,
		third_alpha: 0.81,
		third_rotation: 0.11693705988362009, //Utils.gradToRad(6.7);
		finish_scale: 1.978,
		finish_rotation: 0.2565634000431664 //Utils.gradToRad(14.7);
	},
	{
		delay: 3,
		position: {x: 5, y: 1.25}, //x: 10 / 2, y: 2.5 / 2
		rotation: 2.722713633111154, //Utils.gradToRad(156);
		scale: {x: 0, y: 0},
		second_scale: 0.31,
		second_rotation: 2.722713633111154, //Utils.gradToRad(156);
		third_scale: 1.18,
		third_alpha: 0.81,
		third_rotation: 2.722713633111154, //Utils.gradToRad(156);
		finish_scale: 2.358,
		finish_rotation: 2.722713633111154 //Utils.gradToRad(156);
	},
	{
		delay: 7,
		position: {x: -10, y: -3.5}, //x: -20 / 2, y: -7 / 2
		rotation: 1.3788101090755203, //Utils.gradToRad(79);
		scale: {x: 0, y: 0},
		second_scale: 0.358,
		second_rotation: 1.3788101090755203, //Utils.gradToRad(79);
		third_scale: 0.846,
		third_alpha: 0.81,
		third_rotation: 1.3788101090755203, //Utils.gradToRad(79);
		finish_scale: 1.958,
		finish_rotation: 1.3788101090755203 //Utils.gradToRad(79);
	},
];

const WIN_FLARE_PARAM =[
	{
		delay: 1,
		duration: 7,
		position: {x: -25.6, y: 7.8625}, //x: -204.8 / 8, y: 62.9 / 8
		rotation: 0.8028514559173915, //Utils.gradToRad(46)
		scale: {x: 1.13, y: 1.13},
		finish_position: {x: -32.1125, y: 8.175}, //x: -256.9 / 8, y: 65.4 / 8
		finish_rotation: -0.3665191429188092 //Utils.gradToRad(-21)
	},
	{
		delay: 7,
		duration: 7,
		position: {x: 21.9875, y: 5.5375}, //x: 175.9 / 8, y: 44.3 / 8
		rotation: 0.8028514559173915, //Utils.gradToRad(46)
		scale: {x: 1.13, y: 1.13},
		finish_position: {x: 30.0375, y: 7.0875}, //x: 240.3 / 8, y: 56.7 / 8
		finish_rotation: 1.499237827463129  //Utils.gradToRad(85.9)
	},
	{
		delay: 10,
		duration: 7,
		position: {x: 8.5, y: -21.625}, //x: 68 / 8, y: -173 / 8
		rotation: 0.8028514559173915, //Utils.gradToRad(46)
		scale: {x: 0.87, y: 0.87},
		finish_position: {x: 10.05, y: -31.5}, //x: 80.4 / 8, y: -252 / 8
		finish_rotation: -0.3665191429188092 //Utils.gradToRad(-21)
	},
	{
		delay: 16,
		duration: 7,
		position: {x: -9.325, y: -21.275}, //x: -74.6 / 8, y: -170.2 / 8
		rotation: 0.8028514559173915, //Utils.gradToRad(46)
		scale: {x: 0.81, y: 0.81},
		finish_position: {x: -13.05, y: -24.6875}, //x: -104.4 / 8, y: -197.5 / 8
		finish_rotation: -0.6702064327658225 //Utils.gradToRad(-38.4)
	},
];

const LIGHTNING_BOOM_PARAM = [
	{
		delay: 1,
		duration: 2,
		asset_type: "1",
		rotation: 0
	},
	{
		delay: 5,
		duration: 2,
		asset_type: "2",
		rotation: 0
	},
	{
		delay: 7,
		duration: 2,
		asset_type: "1",
		rotation: 0.09773843811168245 //Utils.gradToRad(5.6)
	},
	{
		delay: 10,
		duration: 2,
		asset_type: "1",
		rotation: 0
	},
	{
		delay: 13,
		duration: 2,
		asset_type: "3",
		rotation: 0
	},
	{
		delay: 16,
		duration: 2,
		asset_type: "2",
		rotation: 0.09773843811168245 //Utils.gradToRad(5.6)
	},
	{
		delay: 19,
		duration: 3,
		asset_type: "1",
		rotation: 0.09773843811168245 //Utils.gradToRad(5.6)
	},
]

class MissEffectLevel4ExplosionAnimation extends Sprite
{
	static get EVENT_ON_ANIMATION_ENDED()				{return "onAnimationEnded";}

	i_startAnimation()
	{
		this._startAnimation();
	}

	constructor()
	{
		super();

		this._fWinBlastTier_spr_arr = [];
		this._fBlastContainer_spr = null;
		this._fBlast_spr = null;
		this._fWinFlare_spr_arr = [];

		this._fContainerLights1_spr = null;
		this._fContainerLights2_spr = null;

		this._fLightParticle1_spr = null;
		this._fLightParticle2_spr = null;
		this._fLight31_spr = null;
		this._fLight32_spr = null;

		this._fLightningBoom_spr_arr = [];

		this._fCircleBlast_spr = null;

		this._fAnimationCount_num = null;
	}

	_startAnimation()
	{
		this._startWinBlastTier();
		this._startBlast();
		this._startWinFlare();
		this._startLightsAnimation();
		this._startLightningBoom();
		this._startCircleBlast();
	}

	_startWinBlastTier()
	{		
		for (let i = 0; i < WIN_BLAST_PARAM.length; i++)
		{
			let param = WIN_BLAST_PARAM[i];
			let lWinBlastTier_spr = this._fWinBlastTier_spr_arr[i] = this.addChild(APP.library.getSpriteFromAtlas('enemy_impact/turret_4/win_blast_tier'));
			lWinBlastTier_spr.position.set(param.position.x, param.position.y);
			lWinBlastTier_spr.alpha = 0;
			lWinBlastTier_spr.scale.set(param.scale.x, param.scale.y);
			lWinBlastTier_spr.rotation = param.rotation;

			let l_seq = [
				{tweens: [], duration: 2 * FRAME_RATE},
				{tweens: [{prop: 'alpha', to: 1}], duration: 0 * FRAME_RATE},
				{tweens: [
							{prop: 'scale.x', to: param.second_scale},
							{prop: 'scale.y', to: param.second_scale},
							{prop: 'rotation', to: param.second_rotation}
						], duration: 5 * FRAME_RATE},
				{tweens: [
							{prop: 'scale.x', to: param.third_scale},
							{prop: 'scale.y', to: param.third_scale},
							{prop: 'alpha', to: param.third_alpha},
							{prop: 'rotation', to: param.third_rotation}
						], duration: 5 * FRAME_RATE},
				{tweens: [
							{prop: 'scale.x', to: param.finish_scale},
							{prop: 'scale.y', to: param.finish_scale},
							{prop: 'alpha', to: 0},
							{prop: 'rotation', to: param.finish_rotation}
						], duration: 12 * FRAME_RATE,
					onfinish: ()=>{
						lWinBlastTier_spr && lWinBlastTier_spr.destroy();
						this._fAnimationCount_num--;
						this._onAnimationCompletedSuspicison();
				}}
			];

			this._fAnimationCount_num++;
			Sequence.start(lWinBlastTier_spr, l_seq);
		}
	}

	_startBlast()
	{
		let lBlastContainer_spr = this._fBlastContainer_spr = this.addChild(new Sprite());
		lBlastContainer_spr.position.set(0, 0);
		lBlastContainer_spr.alpha = 1;
		lBlastContainer_spr.scale.set(0.263, 0.263);

		let lBlast_spr = this._fBlast_spr = this._fBlastContainer_spr.addChild(APP.library.getSpriteFromAtlas('enemy_impact/turret_4/blast'));
		lBlast_spr.alpha = 0;
		lBlast_spr.position.set(-1, -6);
		lBlast_spr.blendMode = PIXI.BLEND_MODES.ADD;

		let lContainer_seq = [
			{tweens: [], duration: 2 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 1.323}, {prop: 'scale.y', to: 1.323}, {prop: 'rotation', to: 14.678219009272311}], // Utils.gradToRad(841)
			ease: Easing.quadratic.easeOut, duration: 19 * FRAME_RATE,
				onfinish: ()=>{
					lBlastContainer_spr && lBlastContainer_spr.destroy();
					this._fAnimationCount_num--;
					this._onAnimationCompletedSuspicison();
			}}
		];

		this._fAnimationCount_num++;
		Sequence.start(lBlastContainer_spr, lContainer_seq);

		let lBlast2_seq = [
			{tweens: [], duration: 2 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0.85}], duration: 0 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0.24}], duration: 3 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0}], duration: 16 * FRAME_RATE,
			onfinish: ()=>{
					lBlast_spr && lBlast_spr.destroy();
					this._fAnimationCount_num--;
					this._onAnimationCompletedSuspicison();
			}}
		];

		this._fAnimationCount_num++;
		Sequence.start(lBlast_spr, lBlast2_seq);
	}

	_startWinFlare()
	{
		for (let i = 0; i < WIN_FLARE_PARAM.length; i++)
		{
			let param = WIN_FLARE_PARAM[i];
			let lWinFlare_spr = this._fWinFlare_spr_arr[i] = this.addChild(APP.library.getSpriteFromAtlas('enemy_impact/turret_4/win_flare'));
			lWinFlare_spr.position.set(param.position.x, param.position.y);
			lWinFlare_spr.alpha = 0;
			lWinFlare_spr.scale.set(param.scale.x, param.scale.y);
			lWinFlare_spr.rotation = param.rotation;
			lWinFlare_spr.blendMode = PIXI.BLEND_MODES.ADD;

			let l_seq = [
				{tweens: [], duration: param.delay * FRAME_RATE},
				{tweens: [{prop: 'alpha', to: 1}], duration: 0 * FRAME_RATE},
				{tweens: [
					{prop: 'x', to: param.finish_position.x},
					{prop: 'y', to: param.finish_position.y}, 
					{prop: 'rotation', to: param.finish_rotation}, 
					{prop: 'alpha', to: 0}
				], 
				duration: param.duration * FRAME_RATE,
					onfinish: ()=>{
						lWinFlare_spr && lWinFlare_spr.destroy();
						this._fAnimationCount_num--;
						this._onAnimationCompletedSuspicison();
				}}
			];

			this._fAnimationCount_num++;
			Sequence.start(lWinFlare_spr, l_seq);
		}
	}

	_startLightsAnimation()
	{
		this._fContainerLights1_spr = this.addChild(new Sprite());
		this._fContainerLights2_spr = this.addChild(new Sprite());

		this._startLightParticle();
		this._startLight4();
	}
	

	_startLightParticle()
	{
		let lLight1_spr = this._fLightParticle1_spr = this._fContainerLights1_spr.addChild(APP.library.getSpriteFromAtlas('enemy_impact/turret_4/light_particle'));
		lLight1_spr.position.set(-2, -18);
		lLight1_spr.alpha = 0;
		lLight1_spr.scale.set(10.43, 10.43);
		lLight1_spr.blendMode = PIXI.BLEND_MODES.ADD;

		let l1_seq = [
			{tweens: [], duration: 1 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}], duration: 0 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0}], duration: 13 * FRAME_RATE,
				onfinish: ()=>{
					lLight1_spr && lLight1_spr.destroy();
					this._fAnimationCount_num--;
					this._onAnimationCompletedSuspicison();
			}}
		];
	
		this._fAnimationCount_num++;
		Sequence.start(lLight1_spr, l1_seq);

		let lLight2_spr = this._fLightParticle2_spr = this._fContainerLights2_spr.addChild(APP.library.getSpriteFromAtlas('enemy_impact/turret_4/light_particle'));
		lLight2_spr.position.set(-2, -18);
		lLight2_spr.alpha = 0;
		lLight2_spr.scale.set(10.95, 10.95);
		lLight2_spr.blendMode = PIXI.BLEND_MODES.ADD;

		let l2_seq = [
			{tweens: [], duration: 7 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}], duration: 0 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0}], duration: 14 * FRAME_RATE,
				onfinish: ()=>{
					lLight2_spr && lLight2_spr.destroy();
					this._fAnimationCount_num--;
					this._onAnimationCompletedSuspicison();
			}}
		];
	
		this._fAnimationCount_num++;
		Sequence.start(lLight2_spr, l2_seq);
	}

	_startLight4()
	{
		let lLight31_spr = this._fLight31_spr = this._fContainerLights1_spr.addChild(APP.library.getSpriteFromAtlas('enemy_impact/turret_4/light_4'));
		lLight31_spr.position.set(-2, 2);
		lLight31_spr.alpha = 0;
		lLight31_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lLight31_spr.scale.set(0.16, 0.16);

		let l1_seq = [
			{tweens: [], duration: 1 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}], duration: 0 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 2.92}, {prop: 'scale.y', to: 2.92}], duration: 1 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 0}, {prop: 'scale.y', to: 0}], duration: 7 * FRAME_RATE,
				onfinish: ()=>{
					lLight31_spr && lLight31_spr.destroy();
					this._fAnimationCount_num--;
					this._onAnimationCompletedSuspicison();
			}}
		];

		this._fAnimationCount_num++;
		Sequence.start(lLight31_spr, l1_seq);

		let lLight32_spr = this._fLight32_spr = this._fContainerLights2_spr.addChild(APP.library.getSpriteFromAtlas('enemy_impact/turret_4/light_4'));
		lLight32_spr.position.set(-2, 2);
		lLight32_spr.alpha = 0;
		lLight32_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lLight32_spr.scale.set(0.16, 0.16);
		lLight32_spr.rotation = 2.5446900494077327; //Utils.gradToRad(145.8);

		let l2_seq = [
			{tweens: [], duration: 6 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}], duration: 0 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 1.88}, {prop: 'scale.y', to: 1.88}], duration: 1 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 0}, {prop: 'scale.y', to: 0}], duration: 7 * FRAME_RATE,
				onfinish: ()=>{
					lLight32_spr && lLight32_spr.destroy();
					this._fAnimationCount_num--;
					this._onAnimationCompletedSuspicison();
			}}
		]

		this._fAnimationCount_num++;
		Sequence.start(lLight32_spr, l2_seq);
	}

	_startLightningBoom()
	{
		for (let i = 0; i < LIGHTNING_BOOM_PARAM.length; i++)
		{
			let param = LIGHTNING_BOOM_PARAM[i];
			let lLightningBoom_spr = this._fLightningBoom_spr_arr[i] = this.addChild(APP.library.getSpriteFromAtlas('enemy_impact/lightning_boom/lightning_boom'+param.asset_type));
			lLightningBoom_spr.position.set(7, -1);
			lLightningBoom_spr.alpha = 0;
			lLightningBoom_spr.scale.set(0.45, 0.45);
			lLightningBoom_spr.blendMode = PIXI.BLEND_MODES.ADD;
			lLightningBoom_spr.rotation = param.rotation;

			let l_seq = [
				{tweens: [], duration: 2 * FRAME_RATE},
				{tweens: [], duration: param.delay * FRAME_RATE},
				{tweens: [{prop: 'alpha', to: 1}], duration: 0 * FRAME_RATE},
				{tweens: [], duration: param.duration * FRAME_RATE,
					onfinish: ()=>{
						lLightningBoom_spr && lLightningBoom_spr.destroy();
						this._fAnimationCount_num--;
						this._onAnimationCompletedSuspicison();
				}}
			];

			this._fAnimationCount_num++;
			Sequence.start(lLightningBoom_spr, l_seq);
		}
	}

	_startCircleBlast()
	{
		let lCircleBlast_spr = this._fCircleBlast_spr = this.addChild(APP.library.getSpriteFromAtlas('enemy_impact/turret_4/circle_blast'));
		lCircleBlast_spr.position.set(-8, 16);
		lCircleBlast_spr.alpha = 0;
		lCircleBlast_spr.scale.set(0.204, 0.204);
		lCircleBlast_spr.blendMode = PIXI.BLEND_MODES.ADD;

		let l_seq = [
			{tweens: [], duration: 1 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0.42}], duration: 0 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 1.68}, {prop: 'scale.y', to: 1.68}], duration: 2 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 2.436}, {prop: 'scale.y', to: 2.436}, {prop: 'alpha', to: 0}], duration: 8 * FRAME_RATE,
				onfinish: ()=>{
					lCircleBlast_spr && lCircleBlast_spr.destroy();
					this._fAnimationCount_num--;
					this._onAnimationCompletedSuspicison();
			}}
		];

		this._fAnimationCount_num++;
		Sequence.start(lCircleBlast_spr, l_seq);
	}

	_onAnimationCompletedSuspicison()
	{
		if (this._fAnimationCount_num == 0)
		{
			this.emit(MissEffectLevel4ExplosionAnimation.EVENT_ON_ANIMATION_ENDED);
		}
	}

	destroy()
	{
		super.destroy();
		
		for (let i = 0; i < this._fWinBlastTier_spr_arr.length; i++)
		{
			this._fWinBlastTier_spr_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fWinBlastTier_spr_arr[i]));
			this._fWinBlastTier_spr_arr[i] && this._fWinBlastTier_spr_arr[i].destroy();
			this._fWinBlastTier_spr_arr[i] = null;
		}
		this._fWinBlastTier_spr_arr = [];

		this._fBlast_spr && Sequence.destroy(Sequence.findByTarget(this._fBlast_spr));
		this._fBlast_spr && this._fBlast_spr.destroy();
		this._fBlast_spr = null;

		this._fBlastContainer_spr && Sequence.destroy(Sequence.findByTarget(this._fBlastContainer_spr));
		this._fBlastContainer_spr && this._fBlastContainer_spr.destroy();
		this._fBlastContainer_spr = null;

		for (let i = 0; i < this._fWinFlare_spr_arr.length; i++)
		{
			this._fWinFlare_spr_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fWinFlare_spr_arr[i]));
			this._fWinFlare_spr_arr[i] && this._fWinFlare_spr_arr[i].destroy();
			this._fWinFlare_spr_arr[i] = null;
		}
		this._fWinFlare_spr_arr = [];

		this._fLightParticle1_spr && Sequence.destroy(Sequence.findByTarget(this._fLightParticle1_spr));
		this._fLightParticle1_spr && this._fLightParticle1_spr.destroy();
		this._fLightParticle1_spr = null;

		this._fLightParticle2_spr && Sequence.destroy(Sequence.findByTarget(this._fLightParticle2_spr));
		this._fLightParticle2_spr && this._fLightParticle2_spr.destroy();
		this._fLightParticle2_spr = null;

		this._fLight31_spr && Sequence.destroy(Sequence.findByTarget(this._fLight31_spr));
		this._fLight31_spr && this._fLight31_spr.destroy();
		this._fLight31_spr = null;

		this._fLight32_spr && Sequence.destroy(Sequence.findByTarget(this._fLight32_spr));
		this._fLight32_spr && this._fLight32_spr.destroy();
		this._fLight32_spr = null;

		for (let i = 0; i < this._fLightningBoom_spr_arr.length; i++)
		{
			this._fLightningBoom_spr_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fLightningBoom_spr_arr[i]));
			this._fLightningBoom_spr_arr[i] && this._fLightningBoom_spr_arr[i].destroy();
			this._fLightningBoom_spr_arr[i] = null;
		}
		this._fLightningBoom_spr_arr = [];

		this._fCircleBlast_spr && Sequence.destroy(Sequence.findByTarget(this._fCircleBlast_spr));
		this._fCircleBlast_spr && this._fCircleBlast_spr.destroy();
		this._fCircleBlast_spr = null;
	}
}

export default MissEffectLevel4ExplosionAnimation;