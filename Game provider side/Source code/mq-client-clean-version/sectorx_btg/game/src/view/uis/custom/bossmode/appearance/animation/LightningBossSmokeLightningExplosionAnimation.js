import Sprite from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import * as Easing from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { APP } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../../../../shared/src/CommonConstants';
import { Sequence } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import { Utils } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';

const LIGHTNING_PARAM =[
	{
		position: {x: 0, y: 0},
		rotation: 0,
		scale: {x: 1, y: 1},
		asset: "5"
	},
	{
		position: {x: 5.7, y: - 14.7},
		rotation: 0,
		scale: {x: 1, y: 1},
		asset: "6"
	},
	{
		position: {x: 19.3, y: - 5.7},
		rotation: -0.12915436464758037, //Utils.gradToRad(-7.4)
		scale: {x: 1, y: 1},
		asset: "7"
	},
	{
		position: {x: -4.5, y: 4},
		rotation: 1.7558012275062955, //Utils.gradToRad(100.6)
		scale: {x: -1, y: 1},
		asset: "5"
	},
	{
		position: {x: 1.1, y: - 18.2},
		rotation: 0,
		scale: {x: 1, y: 1},
		asset: "7"
	},
	{
		position: {x: 4, y: -19.3},
		rotation: 0,
		scale: {x: 1, y: 1},
		asset: "6"
	}
];

const PARTICLE_PARAM =[
	{
		delay: 0,
		position: {x: -18.7, y: 8.6},
		scale: {x: 3.71, y: 3.71}

	},
	{
		delay: 3,
		position: {x: 56.1, y: -23.8},
		scale: {x: 4.01, y: 4.01}
	},
	{
		delay: 7,
		position: {x: -62.9, y: - 2.3},
		scale: {x: 3.87, y: 3.87}
	}
]

class LightningBossSmokeLightningExplosionAnimation extends Sprite
{
	static get EVENT_ON_ANIMATION_ENDED()				{return "onAnimationEnded";}

	i_startAnimation()
	{
		this._startAnimation();
	}

	constructor()
	{
		super();
		
		this._fAnimationCount_num = null;

		this._fShortLightnings_arr = [];
		this._fLightning5_spr = null;
		this._fParticles_arr = [];
	}

	_startAnimation()
	{
		this._fAnimationCount_num = 0;
		
		this._startShortLightnings();
		this._startLightning5();
		this._startLightParticles();
	}

	_startShortLightnings()
	{		
		for (let i = 0; i < LIGHTNING_PARAM.length; i++)
		{
			this._fAnimationCount_num++;
			this._startShortLightningsOnce(i);
		}
	}

	_startShortLightningsOnce(aIndex)
	{
		let param = LIGHTNING_PARAM[aIndex];
		let lLightning_spr = this._fShortLightnings_arr[aIndex] = this.addChild(APP.library.getSpriteFromAtlas('boss_mode/lightning/lightning_'+param.asset));
	
		lLightning_spr.alpha = 0;
		lLightning_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lLightning_spr.position = param.position;
		lLightning_spr.scale = param.scale;
		lLightning_spr.rotation = param.rotation;


		let l_seq = [
			{tweens: [], duration: 2 * aIndex * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}], duration: 0 * FRAME_RATE},
			{tweens: [], duration: 2 * FRAME_RATE,
					onfinish: ()=>{
						lLightning_spr && lLightning_spr.destroy();
						this._fAnimationCount_num--;
						this._onAnimationCompletedSuspicison();
			}}
		]

		Sequence.start(lLightning_spr, l_seq);
	}

	_startLightning5()
	{
		let lLightning_spr = this._fLightning5_spr = this.addChild(APP.library.getSpriteFromAtlas('boss_mode/lightning/lightning_5'));
	
		lLightning_spr.alpha = 0;
		lLightning_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lLightning_spr.position.set(-17.6, 9);
		lLightning_spr.scale.set(-1, 1);
		lLightning_spr.rotation = -0.6649704450098396; //Utils.gradToRad(-38.1);


		let l_seq = [
			{tweens: [], duration: 12 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}], duration: 0 * FRAME_RATE},
			{tweens: [], duration: 1 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0.18}], duration: 6 * FRAME_RATE,
					onfinish: ()=>{
						lLightning_spr && lLightning_spr.destroy();
						this._fAnimationCount_num--;
						this._onAnimationCompletedSuspicison();
			}}
		];

		this._fAnimationCount_num++;
		Sequence.start(lLightning_spr, l_seq);
	}

	_startLightParticles()
	{		
		for (let i = 0; i < PARTICLE_PARAM.length; i++)
		{
			this._fAnimationCount_num++;
			this._startLightParticleOnce(i);
		}
	}

	_startLightParticleOnce(aIndex)
	{
		let param = PARTICLE_PARAM[aIndex];
		let lParticle_spr = this._fParticles_arr[aIndex] = this.addChild(APP.library.getSprite('common/light_particle'));
	
		lParticle_spr.alpha = 0.6;
		lParticle_spr.position = param.position;
		lParticle_spr.scale.set(0, 0);

		let l_seq = [
			{tweens: [], duration: param.delay * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: param.scale.x}, {prop: 'scale.y', to: param.scale.y}], duration: 1 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 0}, {prop: 'scale.y', to: 0}], duration: 8 * FRAME_RATE,
					onfinish: ()=>{
						lParticle_spr && lParticle_spr.destroy();
						this._fAnimationCount_num--;
						this._onAnimationCompletedSuspicison();
			}}
		]

		Sequence.start(lParticle_spr, l_seq);
	}

	_onAnimationCompletedSuspicison()
	{
		if (this._fAnimationCount_num == 0)
		{
			this.emit(LightningBossSmokeLightningExplosionAnimation.EVENT_ON_ANIMATION_ENDED);
		}
	}

	destroy()
	{
		super.destroy();

		this._fAnimationCount_num = null;

		for (let i = 0; i < LIGHTNING_PARAM.length; i++)
		{
			if (!this._fShortLightnings_arr)
			{
				break;
			}

			this._fShortLightnings_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fShortLightnings_arr[i]));
			this._fShortLightnings_arr[i] && this._fShortLightnings_arr[i].destroy();
			this._fShortLightnings_arr[i] = null;
		}

		this._fShortLightnings_arr = [];


		this._fLightning5_spr && Sequence.destroy(Sequence.findByTarget(this._fLightning5_spr));
		this._fLightning5_spr && this._fLightning5_spr.destroy();
		this._fLightning5_spr = null;

		for (let i = 0; i < PARTICLE_PARAM.length; i++)
		{
			if (!this._fParticles_arr)
			{
				break;
			}

			this._fParticles_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fParticles_arr[i]));
			this._fParticles_arr[i] && this._fParticles_arr[i].destroy();
			this._fParticles_arr[i] = null;
		}

		this._fParticles_arr = [];

	
	}
}

export default LightningBossSmokeLightningExplosionAnimation;