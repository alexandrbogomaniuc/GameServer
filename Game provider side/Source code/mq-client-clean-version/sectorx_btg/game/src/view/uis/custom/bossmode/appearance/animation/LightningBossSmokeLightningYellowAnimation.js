import Sprite from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { APP } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../../../../shared/src/CommonConstants';
import { Sequence } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import { Utils } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';

const LIGHTNING_PARAM =[
	{
		position: {x: 0, y: 0},
		rotation: 0,
		scale: {x: 1, y: 1},
		asset: "1"
	},
	{
		position: {x: 5.7, y: -14.7},
		rotation: 0,
		scale: {x: 1, y: 1},
		asset: "2"
	},
	{
		position: {x: 19.3 - 10, y: -9.3},
		rotation: -0.12915436464758037, //Utils.gradToRad(-7.4)
		scale: {x: 1, y: 1},
		asset: "4"
	},
	{
		position: {x: -4.5, y: -3},
		rotation: 1.7558012275062955, //Utils.gradToRad(100.6)
		scale: {x: -1, y: 1},
		asset: "1"
	},
	{
		position: {x: 1.4, y: -18.8},
		rotation: 0,
		scale: {x: 1, y: 1},
		asset: "4"
	},
	{
		position: {x: 4, y: -19.3},
		rotation: 0,
		scale: {x: 1, y: 1},
		asset: "2"
	}
];

const PARTICLE_PARAM =[
	{
		delay: 0,
		position: {x: -51.05, y: 47.6},	
		scale: {x: 1.87, y: 1.87}
	},
	{
		delay: 1,
		position: {x: -68.6, y: 44.45},	
		scale: {x: 1.87, y: 1.87}
	},
	{
		delay: 3,
		position: {x: -6.25, y: 55},
		scale: {x: 1.87, y: 1.87}
	},
	{
		delay: 6,
		position: {x: -48.7, y: 41.2},
		scale: {x: 1.87, y: 1.87}
	},
	{
		delay: 7,
		position: {x: -22.4, y: 43.15},
		scale: {x: 1.87, y: 1.87}
	},
	{
		delay: 9,
		position: {x: -64.45, y: 42.45},
		scale: {x: 1.87, y: 1.87}
	}
];

class LightningBossSmokeLightningYellowAnimation extends Sprite
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

		this._fLightningContainer_spr = this.addChild(new Sprite());
		this._fLightParticleContainer_spr = this.addChild(new Sprite());
		this._fLightning_arr = [];
		this._fParticle_spr_arr = [];
	}

	_startAnimation()
	{
		this._fAnimationCount_num = 0;
		
		this._startLightning();
		this._startParticle();
	}

	_startLightning()
	{
		for (let i = 0; i < LIGHTNING_PARAM.length; i++)
		{
			this._startLightningOnce(i);
		}
	}

	_startLightningOnce(aIndex)
	{
		let param = LIGHTNING_PARAM[aIndex];
		let lLightning_spr = this._fLightning_arr[aIndex] = this._fLightningContainer_spr.addChild(APP.library.getSpriteFromAtlas('boss_mode/lightning/lightning_'+param.asset));
	
		lLightning_spr.alpha = 0;
		lLightning_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lLightning_spr.position = param.position;
		lLightning_spr.scale = param.scale;
		lLightning_spr.rotation = Utils.gradToRad(param.rotation);


		let l_seq = [
			{tweens: [], duration: 2 * aIndex * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}], duration: 0 * FRAME_RATE},
			{tweens: [], duration: 2 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0}], duration: 0 * FRAME_RATE,
					onfinish: ()=>{
						lLightning_spr && lLightning_spr.destroy();
						this._fAnimationCount_num--;
						this._onAnimationCompletedSuspicison();
			}}
		];

		this._fAnimationCount_num++;
		Sequence.start(lLightning_spr, l_seq);
	}

	_startParticle()
	{
		for (let i = 0; i < PARTICLE_PARAM.length; i++)
		{
			this._startParticleOnce(i);
		}
	}

	_startParticleOnce(aIndex)
	{
		let param = PARTICLE_PARAM[aIndex];	
		let lParticle_spr = this._fParticle_spr_arr[aIndex] = this._fLightParticleContainer_spr.addChild(APP.library.getSprite('common/light_particle'));
		
		lParticle_spr.alpha = 0;
		lParticle_spr.position.x = param.position.x;
		lParticle_spr.position.y = param.position.y;
		
		lParticle_spr.scale = param.scale;
		
		let lSmoke_seq = [
			{tweens: [], duration: param.delay * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0.6}], duration: 0 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: param.scale.x}, {prop: 'scale.y', to: param.scale.y}], duration: 1 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 0}, {prop: 'scale.y', to: 0}], duration: 8 * FRAME_RATE,
					onfinish: ()=>{
						lParticle_spr && lParticle_spr.destroy();
						lParticle_spr = null;
						this._fAnimationCount_num--;
						this._onAnimationCompletedSuspicison();
			}}
		];

		this._fAnimationCount_num++;
		Sequence.start(lParticle_spr, lSmoke_seq);
	}

	_onAnimationCompletedSuspicison()
	{
		if (this._fAnimationCount_num == 0)
		{
			this.emit(LightningBossSmokeLightningYellowAnimation.EVENT_ON_ANIMATION_ENDED);
		}
	}


	destroy()
	{
		super.destroy();

		for (let i = 0; i < LIGHTNING_PARAM.length; i++)
		{
			if (!this._fLightning_arr)
			{
				break;
			}

			this._fLightning_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fLightning_arr[i]));
			this._fLightning_arr[i] && this._fLightning_arr[i].destroy();
			this._fLightning_arr[i] = null;
		}

		this._fLightning_arr = [];

		for (let i = 0; i < PARTICLE_PARAM.length; i++)
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
		
		this._fAnimationCount_num = null;
	}
}

export default LightningBossSmokeLightningYellowAnimation;