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
		second_scale: 0.2728, //0.341*0.8
		second_rotation: 0.05759586531581287, //Utils.gradToRad(3.3);
		second_alpha: 0.688, //0.86*0.8
		third_scale: 0.4688, //0.586*0.8
		third_alpha: 0.4, //0.5*0.8
		third_rotation: 0.11693705988362009, //Utils.gradToRad(6.7);
		finish_scale: 0.7912, //0.989*0.8
		finish_rotation: 0.2565634000431664 //Utils.gradToRad(14.7);
	},
	{
		delay: 3,
		position: {x: 4.9375, y: 1.375}, //x: 39.5 / 8, y: 11 / 8
		rotation:2.722713633111154, //Utils.gradToRad(156);
		scale: {x: 0.768, y: 0.768}, //x: 0.96*0.8, y: 0.96*0.8
		second_scale: 1.0256, //1.282*0.8
		second_rotation: 2.722713633111154, //Utils.gradToRad(156);
		second_alpha: 0.768, //0.96*0.8
		third_scale: 1.6144, //2.018*0.8
		third_alpha: 0.56, //0.7*0.8
		third_rotation: 2.722713633111154, //Utils.gradToRad(156);
		finish_scale: 2.7272, //3.409*0.8
		finish_rotation: 2.722713633111154 //Utils.gradToRad(156);
	},
	{
		delay: 7,
		position: {x: -9.8125, y: -3.5}, //x: -78.5 / 8, y: -28 / 8
		rotation: 1.3788101090755203, //Utils.gradToRad(79)
		scale: {x: 0.688, y: 0.688}, //x: 0.86*0.8, y: 0.86*0.8
		second_scale: 0.8848, //1.106*0.8
		second_rotation: 1.3788101090755203, //Utils.gradToRad(79)
		second_alpha: 0.728, //0.91*0.8
		third_scale: 1.3336, //1.667*0.8
		third_alpha: 0.6888, //0.861*0.8
		third_rotation: 1.3788101090755203, //Utils.gradToRad(79)
		finish_scale: 2.1832, //2.729*0.8
		finish_rotation: 1.3788101090755203 //Utils.gradToRad(79)
	},
];

const WIN_FLARE_PARAM =[
	{
		delay: 1,
		duration: 7,
		position: {x: -25.6, y: 7.8625}, //x: -204.8 / 8, y: 62.9 / 8
		rotation: 0.8028514559173915, //Utils.gradToRad(46)
		scale: {x: 0.87, y: 0.87},
		finish_position: {x: -39.6125, y: 9.175}, //x: -316.9 / 8, y: 73.4 / 8
		finish_rotation: -0.3665191429188092 //Utils.gradToRad(-21)
	},
	{
		delay: 4,
		duration: 7,
		position: {x: -27.85, y: -8.6375}, //x: -222.8 / 8, y: -69.1 / 8
		rotation: 0.8028514559173915, //Utils.gradToRad(46)
		scale: {x: 0.87, y: 0.87},
		finish_position: {x: -41.3625, y: -12.575}, //x: -330.9 / 8, y: -100.6 / 8
		finish_rotation: -0.3665191429188092 //Utils.gradToRad(-21)
	},
	{ 
		delay: 7,
		duration: 7,
		position: {x: 21.9875, y: 5.5375}, //x: 175.9 / 8, y: 44.3 / 8
		rotation:0.8028514559173915, //Utils.gradToRad(46)
		scale: {x: 1.13, y: 1.13},
		finish_position: {x: 35.7875, y: 9.8375}, //x: 286.3 / 8, y: 78.7 / 8
		finish_rotation: 1.499237827463129  //Utils.gradToRad(85.9)
	},
	{
		delay: 8,
		duration: 7,
		position: {x: 20.9875, y: -6.4625}, //x: 167.9 / 8, y: -51.7 / 8
		rotation: 0.8028514559173915, //Utils.gradToRad(46)
		scale: {x: 1.13, y: 1.13},
		finish_position: {x: 35.7875, y: -8.9125}, //x: 286.3 / 8, y: -71.3 / 8
		finish_rotation: 1.499237827463129  //Utils.gradToRad(85.9)
	},
	{
		delay: 10,
		duration: 7,
		position: {x: 8.5, y: -21.5875}, //68 / 8, y: -172.7 / 8
		rotation: 0.8028514559173915, //Utils.gradToRad(46)
		scale: {x: 0.87, y: 0.87},
		finish_position: {x: 14.05, y: -37}, //112.4 / 8, y: -296 / 8
		finish_rotation: -0.3665191429188092 //Utils.gradToRad(-21)
	},
	{
		delay: 16,
		duration: 7,
		position: {x: -9.325, y: -21.275}, //-74.6 / 8, y: -170.2 / 8
		rotation: 0.8028514559173915, //Utils.gradToRad(46)
		scale: {x: 0.81, y: 0.81},
		finish_position: {x: -24.55, y: -29.1875}, //-196.4 / 8, y: -233.5 / 8
		finish_rotation: -0.6702064327658225 //Utils.gradToRad(-38.4)
	},
];

const LIGHTNING_PARAM = [
	{
		delay: 1,
		duration: 2,
		position: {x: 6.9, y: -14.2125}, //55.2 / 8, y: -113.7 / 8
		asset_type: "1",
		rotation: 0
	},
	{
		delay: 3,
		duration: 2,
		position: {x: -17.825, y: 11.9875}, //-142.6 / 8, y: 95.9 / 8
		asset_type: "2",
		rotation: 0
	},
	{
		delay: 5,
		duration: 2,
		position: {x: 1.725, y: 11.9}, //13.8 / 8, y: 95.2 / 8
		asset_type: "3",
		rotation: 0.09773843811168245 //Utils.gradToRad(5.6)
	},
	{
		delay: 10,
		duration: 2,
		position: {x: -17.7125, y: -5.9375}, //-141.7 / 8, y: -47.5 / 8
		asset_type: "1",
		rotation: -1.43116998663535 //Utils.gradToRad(-82
	},
	{
		delay: 12,
		duration: 2,
		position: {x: 12.3125, y: 9.3125}, //98.5 / 8, y: 74.5 / 8
		asset_type: "2",
		rotation: 0
	},
	{
		delay: 14,
		duration: 2,
		position: {x: -0.8875, y: -7.8625}, //-7.1 / 8, y: -62.9 / 8
		asset_type: "3",
		rotation: 2.621484536495483 //Utils.gradToRad(150.2 
	},
	{
		delay: 16,
		duration: 3,
		position: {x: -8.125, y: 9.875}, //-65 / 8, y: 79 / 8
		asset_type: "1",
		rotation: 0.19198621771937624 //Utils.gradToRad(11
	},
];


const PARTICLES_YELLOW_PARAM = [
	{
		delay: 1,
		position: {x: -1, y: -1}, //x: -8 / 8, y: -8 / 8
		scale: 0.45,
		rotation: 0,
		second_duration: 12,
		second_position: {x: 23.5, y: -15.4375}, //x: 188 / 8, y: -123.5 / 8
		second_scale: 0.918,
		second_rotation: 0.4974188368183839, //Utils.gradToRad(28.5,
		third_duration: 15,
		third_position: {x: 32.5, y: -20.75}, //x: 260 / 8, y: -166 / 8
		third_scale: 1.09,
		third_rotation: 0.6806784082777885 //Utils.gradToRad(39
	},
	{
		delay: 1,
		position: {x: -1, y: -1}, //x: -8 / 8, y: -8 / 8
		scale: 0.45,
		rotation: 0,
		second_duration: 12,
		second_position: {x: -28.2375, y: 10.5125}, //x: -225.9 / 8, y: 84.1 / 8
		second_scale: 0.823,
		second_rotation: -0.4729842272904633, //Utils.gradToRad(-27.1,
		third_duration: 15,
		third_position: {x: -38.25, y: 14.74}, //x: -306 / 8, y: 118 / 8
		third_scale: 0.96,
		third_rotation: -0.6457718232379019 //Utils.gradToRad(-37
	},
	{
		delay: 2,
		position: {x: -15.6125, y: -11.95}, //x: -124.9 / 8, y: -95.6 / 8
		scale: 0.48,
		rotation: 0.038397243543875255, //Utils.gradToRad(-2.2,
		second_duration: 8,
		second_position: {x: -29.925, y: -24.5375}, //x: -239.4 / 8, y: -196.3 / 8
		second_scale: 0.802,
		second_rotation: -0.445058959258554, //Utils.gradToRad(-25.5,
		third_duration: 14,
		third_position: {x: -37, y: -30.75}, //x: -296 / 8, y: -246 / 8
		third_scale: 0.96,
		third_rotation: -0.6457718232379019 //Utils.gradToRad(-37
	},
	{
		delay: 1,
		position: {x: 1.5, y: 6.25}, //x: 12 / 8, y: 50 / 8
		scale: 0.45,
		rotation: -0.5934119456780721, //Utils.gradToRad(-34,
		second_duration: 9,
		second_position: {x: 8.3875, y: 14.35}, //x: 67.1 / 8, y: 114.8 / 8
		second_scale: 0.739,
		second_rotation: -1.3508848410436112, //Utils.gradToRad(-77.4,
		third_duration: 14,
		third_position: {x: 11.5, y: 18}, //x: 92 / 8, y: 144 / 8
		third_scale: 0.87,
		third_rotation: -1.6929693744344996 //Utils.gradToRad(-97
	},
]

class MissEffectLevel5ExplosionAnimation extends Sprite
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
		this._fLight51_spr = null;
		this._fLight52_spr = null;

		this._fLightning_spr_arr = [];
		this._fParticlesYellow_spr_arr = [];
		this._fCircleBlast_spr = null;

		this._fAnimationCount_num = null;
	}

	_startAnimation()
	{
		this._startWinBlastTier();
		this._startBlast();
		this._startWinFlare();
		this._startLightsAnimation();
		this._startLightning();
		this._startParticlesYellow();
		this._startCircleBlast();
	}

	_startWinBlastTier()
	{		
		for (let i = 0; i < WIN_BLAST_PARAM.length; i++)
		{
			let param = WIN_BLAST_PARAM[i];
			let lWinBlastTier_spr = this._fWinBlastTier_spr_arr[i] = this.addChild(APP.library.getSpriteFromAtlas('enemy_impact/turret_5/win_blast_tier'));
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
							{prop: 'rotation', to: param.second_rotation},
							{prop: 'alpha', to: param.second_alpha},
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

		let lBlast_spr = this._fBlast_spr = this._fBlastContainer_spr.addChild(APP.library.getSpriteFromAtlas('enemy_impact/turret_5/blast'));
		lBlast_spr.alpha = 0;
		lBlast_spr.position.set(-1, -6);
		lBlast_spr.blendMode = PIXI.BLEND_MODES.ADD;

		let lContainer_seq = [
			{tweens: [], duration: 2 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 2.523}, {prop: 'scale.y', to: 2.523}, {prop: 'rotation', to: 14.678219009272311}], // Utils.gradToRad(841)
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
			let lWinFlare_spr = this._fWinFlare_spr_arr[i] = this.addChild(APP.library.getSpriteFromAtlas('enemy_impact/turret_5/win_flare'));
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
		this._startLight5();
	}
	

	_startLightParticle()
	{
		let lLight1_spr = this._fLightParticle1_spr = this._fContainerLights1_spr.addChild(APP.library.getSpriteFromAtlas('enemy_impact/turret_5/light_particle'));
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

		let lLight2_spr = this._fLightParticle2_spr = this._fContainerLights2_spr.addChild(APP.library.getSpriteFromAtlas('enemy_impact/turret_5/light_particle'));
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

	_startLight5()
	{
		let lLight51_spr = this._fLight51_spr = this._fContainerLights1_spr.addChild(APP.library.getSpriteFromAtlas('enemy_impact/turret_5/light_5'));
		lLight51_spr.position.set(-2, 2);
		lLight51_spr.alpha = 0;
		lLight51_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lLight51_spr.scale.set(0.16, 0.16);

		let l1_seq = [
			{tweens: [], duration: 1 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}], duration: 0 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 3.51}, {prop: 'scale.y', to: 3.51}], duration: 1 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 0}, {prop: 'scale.y', to: 0}], duration: 7 * FRAME_RATE,
				onfinish: ()=>{
					lLight51_spr && lLight51_spr.destroy();
					this._fAnimationCount_num--;
					this._onAnimationCompletedSuspicison();
			}}
		];

		this._fAnimationCount_num++;
		Sequence.start(lLight51_spr, l1_seq);

		let lLight52_spr = this._fLight52_spr = this._fContainerLights2_spr.addChild(APP.library.getSpriteFromAtlas('enemy_impact/turret_5/light_5'));
		lLight52_spr.position.set(-2, 2);
		lLight52_spr.alpha = 0;
		lLight52_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lLight52_spr.scale.set(0.16, 0.16);
		lLight52_spr.rotation = 2.5446900494077327; //Utils.gradToRad(145.8);

		let l2_seq = [
			{tweens: [], duration: 6 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}], duration: 0 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 2.88}, {prop: 'scale.y', to: 2.88}], duration: 1 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 0}, {prop: 'scale.y', to: 0}], duration: 7 * FRAME_RATE,
				onfinish: ()=>{
					lLight52_spr && lLight52_spr.destroy();
					this._fAnimationCount_num--;
					this._onAnimationCompletedSuspicison();
			}}
		]

		this._fAnimationCount_num++;
		Sequence.start(lLight52_spr, l2_seq);
	}

	_startLightning()
	{
		for (let i = 0; i < LIGHTNING_PARAM.length; i++)
		{
			let param = LIGHTNING_PARAM[i];
			let lLightning_spr = this._fLightning_spr_arr[i] = this.addChild(APP.library.getSpriteFromAtlas('enemy_impact/turret_5/lightning_'+param.asset_type));
			lLightning_spr.position.set(param.position.x, param.position.y);
			lLightning_spr.alpha = 0;
			lLightning_spr.scale.set(0.225, 0.225);
			lLightning_spr.blendMode = PIXI.BLEND_MODES.ADD;
			lLightning_spr.rotation = param.rotation;

			let l_seq = [
				{tweens: [], duration: param.delay * FRAME_RATE},
				{tweens: [{prop: 'alpha', to: 1}], duration: 0 * FRAME_RATE},
				{tweens: [], duration: param.duration * FRAME_RATE,
					onfinish: ()=>{
						lLightning_spr && lLightning_spr.destroy();
						this._fAnimationCount_num--;
						this._onAnimationCompletedSuspicison();
				}}
			];

			this._fAnimationCount_num++;
			Sequence.start(lLightning_spr, l_seq);
		}
	}

	_startParticlesYellow()
	{
		for (let i = 0; i < PARTICLES_YELLOW_PARAM.length; i++)
		{
			let param = PARTICLES_YELLOW_PARAM[i];
			let lParticlesYellow_spr = this._fParticlesYellow_spr_arr[i] = this.addChild(APP.library.getSpriteFromAtlas('enemy_impact/turret_5/particles_yellow'));
			lParticlesYellow_spr.position.set(param.position.x, param.position.y);
			lParticlesYellow_spr.alpha = 0;
			lParticlesYellow_spr.scale.set(param.scale, param.scale);
			lParticlesYellow_spr.blendMode = PIXI.BLEND_MODES.ADD;
			lParticlesYellow_spr.rotation = param.rotation;

			let l_seq = [
				{tweens: [], duration: param.delay * FRAME_RATE},
				{tweens: [{prop: 'alpha', to: 1}], duration: 0 * FRAME_RATE},
				{tweens: [
					{prop: 'x', to: param.second_position.x},
					{prop: 'y', to: param.second_position.y}, 
					{prop: 'rotation', to: param.second_rotation}, 
					{prop: 'scale.x', to: param.second_scale}, 
					{prop: 'scale.y', to: param.second_scale}
				], duration: param.second_duration * FRAME_RATE},
				{tweens: [
					{prop: 'x', to: param.third_position.x},
					{prop: 'y', to: param.third_position.y}, 
					{prop: 'rotation', to: param.third_rotation}, 
					{prop: 'scale.x', to: param.third_scale}, 
					{prop: 'scale.y', to: param.third_scale}
				], duration: param.third_duration * FRAME_RATE,
					onfinish: ()=>{
						lParticlesYellow_spr && lParticlesYellow_spr.destroy();
						this._fAnimationCount_num--;
						this._onAnimationCompletedSuspicison();
				}}
			];

			this._fAnimationCount_num++;
			Sequence.start(lParticlesYellow_spr, l_seq);
		}
	}

	_startCircleBlast()
	{
		let lCircleBlast_spr = this._fCircleBlast_spr = this.addChild(APP.library.getSpriteFromAtlas('enemy_impact/turret_5/circle_blast'));
		lCircleBlast_spr.position.set(-8, 16);
		lCircleBlast_spr.alpha = 0;
		lCircleBlast_spr.scale.set(0.102, 0.102);
		lCircleBlast_spr.blendMode = PIXI.BLEND_MODES.ADD;

		let l_seq = [
			{tweens: [], duration: 1 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0.42}], duration: 0 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 0.859}, {prop: 'scale.y', to: 0.859}], duration: 2 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 1.388}, {prop: 'scale.y', to: 1.388}, {prop: 'alpha', to: 0}], duration: 8 * FRAME_RATE,
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
			this.emit(MissEffectLevel5ExplosionAnimation.EVENT_ON_ANIMATION_ENDED);
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

		this._fLight51_spr && Sequence.destroy(Sequence.findByTarget(this._fLight51_spr));
		this._fLight51_spr && this._fLight51_spr.destroy();
		this._fLight51_spr = null;

		this._fLight52_spr && Sequence.destroy(Sequence.findByTarget(this._fLight52_spr));
		this._fLight52_spr && this._fLight52_spr.destroy();
		this._fLight52_spr = null;

		for (let i = 0; i < this._fLightning_spr_arr.length; i++)
		{
			this._fLightning_spr_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fLightning_spr_arr[i]));
			this._fLightning_spr_arr[i] && this._fLightning_spr_arr[i].destroy();
			this._fLightning_spr_arr[i] = null;
		}
		this._fLightning_spr_arr = [];

		for (let i = 0; i < this._fParticlesYellow_spr_arr.length; i++)
		{
			this._fParticlesYellow_spr_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fParticlesYellow_spr_arr[i]));
			this._fParticlesYellow_spr_arr[i] && this._fParticlesYellow_spr_arr[i].destroy();
			this._fParticlesYellow_spr_arr[i] = null;
		}
		this._fParticlesYellow_spr_arr = [];

		this._fCircleBlast_spr && Sequence.destroy(Sequence.findByTarget(this._fCircleBlast_spr));
		this._fCircleBlast_spr && this._fCircleBlast_spr.destroy();
		this._fCircleBlast_spr = null;
	}
}

export default MissEffectLevel5ExplosionAnimation;