import Sprite from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { APP } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../../../../shared/src/CommonConstants';
import { Sequence } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import { Utils } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';

const PARTICLE_PARAM =[
	{
		delay: 8,
		position: {x: 106, y: -50},
		scale: {x: 10.02, y: 10.02}	
	},
	{
		delay: 24,
		position: {x: -12, y: 90},
		scale: {x: 10.02, y: 10.02}
	},
	{
		delay: 46,
		position: {x: -1, y: -111},	
		scale: {x: 10.02, y: 10.02}
	},
	{
		delay: 59,
		position: {x: -106, y: -24},
		scale: {x: 10.02, y: 10.02}
	},
	{
		delay: 61,
		position: {x: 104, y: -90},
		scale: {x: 12.89, y: 12.89}
	},
	{
		delay: 74,
		position: {x: 88, y: 59},
		scale: {x: 12.89, y: 12.89}
	},
	{
		delay: 80,
		position: {x: -19, y: -106},
		scale: {x: 12.89, y: 12.89}
	}
];

class LightningBossSmokeLightParticleAnimation extends Sprite
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
		this._fAnimationWiggleCount_num = null;

		this._fContainerParticle_spr_arr = [];
		this._fIsNeedContainerWiggle_bl_arr = [];
		this._fParticle_spr_arr = [];
	}

	_startAnimation()
	{
		this._fAnimationCount_num = 0;
		
		
		for (let i = 0; i < PARTICLE_PARAM.length; i++)
		{
			this._fAnimationCount_num++;
			this._startParticle(i);
		}

	}	

	_startParticle(aIndex)
	{
		let param = PARTICLE_PARAM[aIndex];
		let lContainer_spr = this._fContainerParticle_spr_arr[aIndex] = this.addChild(new Sprite());
		let lParticle_spr = this._fParticle_spr_arr[aIndex] = this._fContainerParticle_spr_arr[aIndex].addChild(APP.library.getSprite('common/light_particle'));
		
		lContainer_spr.alpha = 0.8;
		lParticle_spr.alpha = 0;
		lParticle_spr.position = param.position;
		lParticle_spr.scale = param.scale;

		this._fIsNeedContainerWiggle_bl_arr[aIndex] = true;

		
		let lSmoke_seq = [
			{tweens: [], duration: param.delay * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}], duration: 6 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0}], duration: 11 * FRAME_RATE,
					onfinish: ()=>{
						this._fIsNeedContainerWiggle_bl_arr[aIndex] = false;
						lParticle_spr && lParticle_spr.destroy();
						lParticle_spr = null;
						this._fAnimationCount_num--;
						this._onParticleAnimationCompletedSuspicison();
			}}
		]

		Sequence.start(lParticle_spr, lSmoke_seq);


		this._fAnimationWiggleCount_num++;
		this._fStartContainerWiggle(aIndex);

	}

	_fStartContainerWiggle(aIndex)
	{
		let l_seq = [
				{tweens: [{prop: 'alpha', to: Utils.getRandomWiggledValue(0.8, 0.2)}], duration: 1 * FRAME_RATE,
					onfinish: ()=>{
						if (this._fIsNeedContainerWiggle_bl_arr[aIndex])
						{
							this._fStartContainerWiggle(aIndex);
						}
						else
						{
							this._fAnimationWiggleCount_num--;
							this._onParticleAnimationCompletedSuspicison();
						}
				}}
			]
	
		Sequence.start(this._fContainerParticle_spr_arr[aIndex], l_seq);
	}

	_onParticleAnimationCompletedSuspicison()
	{
		if (this._fAnimationCount_num == 0 && this._fAnimationWiggleCount_num == 0)
		{
			this.emit(LightningBossSmokeLightParticleAnimation.EVENT_ON_ANIMATION_ENDED);
		}
	}


	destroy()
	{
		super.destroy();

		this._fIsNeedContainerWiggle_bl_arr = [];

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

		this._fAnimationCount_num = null;
		this._fAnimationWiggleCount_num = null;
	}
}

export default LightningBossSmokeLightParticleAnimation;