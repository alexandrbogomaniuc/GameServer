import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import * as Easing from '../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { FRAME_RATE } from '../../../../shared/src/CommonConstants';
import Sequence from '../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { Utils } from '../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import Sprite from '../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';

const WIN_FLARE_PARAM =[
	{
		delay: 1,
		duration: 7,
		position: {x: -13.575, y: 4.8125}, //x: -108.6 / 8, y: 38.5 / 8
		rotation: 0.8028514559173915, //Utils.gradToRad(46);
		scale: {x: 0.7, y: 0.7},
		finish_position: {x: -18.825, y: 5.0625}, //x: -150.6 / 8, y: 40.5 / 8
		finish_rotation: -0.3665191429188092 //Utils.gradToRad(-21);
	},
	{
		delay: 7,
		duration: 7,
		position: {x: 13.3, y: 2.3125}, //x: 106.4 / 8, y: 18.5 / 8
		rotation: 0.8028514559173915, //Utils.gradToRad(46);
		scale: {x: 0.91, y: 0.91},
		finish_position: {x: 19.925, y: 3.5625}, //x: 159.4 / 8, y: 28.5 / 8
		finish_rotation: 1.499237827463129 //Utils.gradToRad(85.9);
	},
	{
		delay: 16,
		duration: 7,
		position: {x: -7.45, y: -7.3125}, //x: -59.6 / 8, y: -58.5 / 8
		rotation: 0.8028514559173915, //Utils.gradToRad(46);
		scale: {x: 0.65, y: 0.65},
		finish_position: {x: -10.45, y: -10.0625}, //x: -83.6 / 8, y: -80.5 / 8
		finish_rotation: -0.6702064327658225 //Utils.gradToRad(-38.4);
	},
	{
		delay: 13,
		duration: 3,
		position: {x: -7.575, y: -7.3125}, //x: -60.6 / 8, y: -58.5 / 8
		rotation: 0,
		scale: {x: 0.75, y: 0.75},
		finish_position: {x: -7.575, y: -7.3125}, //x: -60.6 / 8, y: -58.5 / 8
		finish_rotation: 0
	},
];

class MissEffectLevel1ExplosionAnimation extends Sprite
{
	static get EVENT_ON_ANIMATION_ENDED()				{return "onAnimationEnded";}

	i_startAnimation()
	{
		this._startAnimation();
	}

	constructor()
	{
		super();

		this._fWinBlastTier_spr = null;
		this._fBlastContainer_spr = null;
		this._fBlast1_spr = null;
		this._fBlast2_spr = null;
		this._fWinFlare_spr_arr = [];

		this._fLightParticle1_spr = null;
		this._fLightParticle2_spr = null;
		this._fLight51_spr = null;
		this._fLight52_spr = null;
		this._fCircleBlast_spr = null;

		this._fAnimationCount_num = null;
	}

	_startAnimation()
	{
		this._startWinBlastTier();
		this._startBlast();
		this._startWinFlare();
		this._startLightParticle();
		this._startLight5();
		this._startCircleBlast();
	}

	_startWinBlastTier()
	{		
		let lWinBlastTier_spr = this._fWinBlastTier_spr = this.addChild(APP.library.getSpriteFromAtlas('enemy_impact/turret_1/win_blast_tier'));
		lWinBlastTier_spr.position.set(0, 0);
		lWinBlastTier_spr.alpha = 0;
		lWinBlastTier_spr.scale.set(0.026, 0.026);
		lWinBlastTier_spr.rotation = 0.022689280275926284; //Utils.gradToRad(1.3);

		let l_seq = [
			{tweens: [], duration: 2 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}], duration: 0 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 0.96}, {prop: 'scale.y', to: 0.96}, {prop: 'alpha', to: 0.02}, {prop: 'rotation', to: 0.23212879051524585}], duration: 18 * FRAME_RATE}, // Utils.gradToRad(13.3)
			{tweens: [{prop: 'scale.x', to: 0.86}, {prop: 'scale.y', to: 0.86}, {prop: 'alpha', to: 0}, {prop: 'rotation', to: 0.2565634000431664}], duration: 2 * FRAME_RATE, // Utils.gradToRad(14.7)
				onfinish: ()=>{
					lWinBlastTier_spr && lWinBlastTier_spr.destroy();
					this._fAnimationCount_num--;
					this._onAnimationCompletedSuspicison();
			}}
		];

		this._fAnimationCount_num++;
		Sequence.start(lWinBlastTier_spr, l_seq);
	}

	_startBlast()
	{
		let lBlastContainer_spr = this._fBlastContainer_spr = this.addChild(new Sprite());
		lBlastContainer_spr.position.set(0, 0);
		lBlastContainer_spr.alpha = 1;
		lBlastContainer_spr.scale.set(0.263, 0.263);

		let lBlast1_spr = this._fBlast1_spr = this._fBlastContainer_spr.addChild(APP.library.getSpriteFromAtlas('enemy_impact/turret_1/blast'));
		let lBlast2_spr = this._fBlast2_spr = this._fBlastContainer_spr.addChild(APP.library.getSpriteFromAtlas('enemy_impact/turret_1/blast'));
		lBlast1_spr.alpha = 0;
		lBlast1_spr.position.set(0, -6);
		lBlast2_spr.alpha = 0;
		lBlast2_spr.position.set(0, -6);
		lBlast2_spr.blendMode = PIXI.BLEND_MODES.ADD;

		let lContainer_seq = [
			{tweens: [], duration: 2 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 1.243}, {prop: 'scale.y', to: 1.243}, {prop: 'rotation', to: 14.678219009272311}], // Utils.gradToRad(841)
			ease: Easing.quadratic.easeOut, duration: 19 * FRAME_RATE,
				onfinish: ()=>{
					lBlastContainer_spr && lBlastContainer_spr.destroy();
					this._fAnimationCount_num--;
					this._onAnimationCompletedSuspicison();
			}}
		];

		this._fAnimationCount_num++;
		Sequence.start(lBlastContainer_spr, lContainer_seq);

		let lBlast1_seq = [
			{tweens: [], duration: 2 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0.85}], duration: 0 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0.30}], duration: 3 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0}], duration: 16 * FRAME_RATE,
			onfinish: ()=>{
					lBlast1_spr && lBlast1_spr.destroy();
					this._fAnimationCount_num--;
					this._onAnimationCompletedSuspicison();
			}}
		];

		this._fAnimationCount_num++;
		Sequence.start(lBlast1_spr, lBlast1_seq);

		let lBlast2_seq = [
			{tweens: [], duration: 2 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0.85}], duration: 0 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0.15}], duration: 3 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0}], duration: 16 * FRAME_RATE,
			onfinish: ()=>{
					lBlast2_spr && lBlast2_spr.destroy();
					this._fAnimationCount_num--;
					this._onAnimationCompletedSuspicison();
			}}
		];

		this._fAnimationCount_num++;
		Sequence.start(lBlast2_spr, lBlast2_seq);
	}

	_startWinFlare()
	{
		for (let i = 0; i < WIN_FLARE_PARAM.length; i++)
		{
			let param = WIN_FLARE_PARAM[i];
			let lWinFlare_spr = this._fWinFlare_spr_arr[i] = this.addChild(APP.library.getSpriteFromAtlas('enemy_impact/turret_1/win_flare'));
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

	_startLightParticle()
	{
		let lLight1_spr = this._fLightParticle1_spr = this.addChild(APP.library.getSpriteFromAtlas('enemy_impact/turret_1/light_particle'));
		lLight1_spr.position.set(-2, -18);
		lLight1_spr.alpha = 0;
		lLight1_spr.scale.set(1.465, 1.465);
		lLight1_spr.blendMode = PIXI.BLEND_MODES.ADD;

		let l1_seq = [
			{tweens: [], duration: 1 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}], duration: 0 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0}], duration: 10 * FRAME_RATE,
				onfinish: ()=>{
					lLight1_spr && lLight1_spr.destroy();
					this._fAnimationCount_num--;
					this._onAnimationCompletedSuspicison();
			}}
		];

		this._fAnimationCount_num++;
		Sequence.start(lLight1_spr, l1_seq);

		let lLight2_spr = this._fLightParticle2_spr = this.addChild(APP.library.getSpriteFromAtlas('enemy_impact/turret_1/light_particle'));
		lLight2_spr.position.set(-2, -18);
		lLight2_spr.alpha = 0;
		lLight2_spr.scale.set(1.04, 1.04);

		let l2_seq = [
			{tweens: [], duration: 7 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}], duration: 0 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0}], duration: 10 * FRAME_RATE,
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
		if (!APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			return;
		}

		let lLight51_spr = this._fLight51_spr = this.addChild(APP.library.getSprite('common/misty_flare'));
		lLight51_spr.position.set(-2, 2);
		lLight51_spr.alpha = 0;
		lLight51_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lLight51_spr.scale.set(0.04, 0.04);

		let l1_seq = [
			{tweens: [], duration: 1 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}], duration: 0 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 0.4}, {prop: 'scale.y', to: 0.4}], duration: 1 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 0}, {prop: 'scale.y', to: 0}], duration: 7 * FRAME_RATE,
				onfinish: ()=>{
					lLight51_spr && lLight51_spr.destroy();
					this._fAnimationCount_num--;
					this._onAnimationCompletedSuspicison();
			}}
		];

		this._fAnimationCount_num++;
		Sequence.start(lLight51_spr, l1_seq);

		let lLight52_spr = this._fLight52_spr = this.addChild(APP.library.getSprite('common/misty_flare'));
		lLight52_spr.position.set(-2, 2);
		lLight52_spr.alpha = 0;
		lLight52_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lLight52_spr.scale.set(0.04, 0.04);
		lLight52_spr.rotation = 2.5446900494077327; //Utils.gradToRad(145.8);

		let l2_seq = [
			{tweens: [], duration: 1 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}], duration: 0 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to:  0.2075}, {prop: 'scale.y', to:  0.2075}], duration: 1 * FRAME_RATE},
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

	_startCircleBlast()
	{
		let lCircleBlast_spr = this._fCircleBlast_spr = this.addChild(APP.library.getSpriteFromAtlas('enemy_impact/turret_1/circle_blast'));
		lCircleBlast_spr.position.set(-8, -16);
		lCircleBlast_spr.alpha = 0;
		lCircleBlast_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lCircleBlast_spr.scale.set(0.204, 0.204);

		let l_seq = [
			{tweens: [], duration: 1 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0.2}], duration: 0 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 1.146}, {prop: 'scale.y', to: 1.146}], duration: 2 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 1.416}, {prop: 'scale.y', to: 1.416}, {prop: 'alpha', to: 0}], duration: 4 * FRAME_RATE,
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
			this.emit(MissEffectLevel1ExplosionAnimation.EVENT_ON_ANIMATION_ENDED);
		}
	}

	destroy()
	{
		super.destroy();

		this._fWinBlastTier_spr && Sequence.destroy(Sequence.findByTarget(this._fWinBlastTier_spr));
		this._fWinBlastTier_spr && this._fWinBlastTier_spr.destroy();
		this._fWinBlastTier_spr = null;

		this._fBlast1_spr && Sequence.destroy(Sequence.findByTarget(this._fBlast1_spr));
		this._fBlast1_spr && this._fBlast1_spr.destroy();
		this._fBlast1_spr = null;

		this._fBlast2_spr && Sequence.destroy(Sequence.findByTarget(this._fBlast2_spr));
		this._fBlast2_spr && this._fBlast2_spr.destroy();
		this._fBlast2_spr = null;

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

		this._fCircleBlast_spr && Sequence.destroy(Sequence.findByTarget(this._fCircleBlast_spr));
		this._fCircleBlast_spr && this._fCircleBlast_spr.destroy();
		this._fCircleBlast_spr = null;
	}
}

export default MissEffectLevel1ExplosionAnimation;