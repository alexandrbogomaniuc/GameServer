import Sprite from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { FRAME_RATE } from '../../../../../../../../shared/src/CommonConstants';
import { Sequence } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import { Utils } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import Timer from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import LightningBossSmokeLightningExplosionAnimation from './LightningBossSmokeLightningExplosionAnimation';

const LIGHTNING_PARAM =[
	{
		delay: 9,
		position: {x: -31.8, y: -39.25},
		rotation: -0.9651670763528643, //Utils.gradToRad(-55.3)
		scale: {x: 1.43, y: 1.43}
	},
	{
		delay: 29,
		position: {x: -124.8, y: 2.75},
		rotation: -0.9651670763528643, //Utils.gradToRad(-55.3)
		scale: {x: 1.85, y: 1.85}
	},
	{
		delay: 42,
		position: {x: -168.8, y: -57.25},
		rotation: -0.9651670763528643, //Utils.gradToRad(-55.3)
		scale: {x: 1.85, y: 1.85}
	},
	{
		delay: 50,
		position: {x: 72.2, y: 93.75},
		rotation: -0.9651670763528643, //Utils.gradToRad(-55.3)
		scale: {x: 1.85, y: 1.85}
	},
	{
		delay: 68,
		position: {x: -73.8, y: -51.25},
		rotation: 0.5410520681182421, //Utils.gradToRad(31)
		scale: {x: 1.85, y: 1.85}
	},
	{
		delay: 75,
		position: {x: 74.2, y: -40.25},
		rotation: 0.8290313946973066, //Utils.gradToRad(47.5)
		scale: {x: 1.85, y: 1.85}
	},
	{
		delay: 79,
		position: {x: 99.2, y: -56.25},
		rotation: -0.9651670763528643, //Utils.gradToRad(-55.3)
		scale: {x: 1.85, y: 1.85}
	},
	{
		delay: 92,
		position: {x: 133.2, y: -41.25},
		rotation: -0.9651670763528643, //Utils.gradToRad(-55.3)
		scale: {x: 1.85, y: 1.85}
	},
	{
		delay: 100,
		position: {x: 72.2, y: 93.75},
		rotation: -0.9651670763528643, //Utils.gradToRad(-55.3)
		scale: {x: 1.85, y: 1.85}
	},
	{
		delay: 103,
		position: {x: -73.8, y: -51.25},
		rotation: 0.5410520681182421, //Utils.gradToRad(31)
		scale: {x: 1.85, y: 1.85}
	},
	{
		delay: 110,
		position: {x: 74.2, y: -40.25},
		rotation: 0.8290313946973066, //Utils.gradToRad(47.5)
		scale: {x: 1.85, y: 1.85}
	}
];

class LightningBossSmokeLightningsExplosionAnimation extends Sprite
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

		this._fLightnings_arr = [];
		this._fStartTimer_arr = [];
	}

	_startAnimation()
	{
		this._fAnimationCount_num = 0;
		
		this._startLightnings();
	}

	_startLightnings()
	{		
		for (let i = 0; i < LIGHTNING_PARAM.length; i++)
		{			
			let lTimer = this._fStartTimer_arr[i] = new Timer(()=>{
				lTimer && lTimer.destructor();
				this._startLightningsOnce(i);
			}, LIGHTNING_PARAM[i].delay * FRAME_RATE, true);
		}
	}

	_startLightningsOnce(aIndex)
	{
		let param = LIGHTNING_PARAM[aIndex];
		let lLightning_spr = this._fLightnings_arr[aIndex] = this.addChild(new LightningBossSmokeLightningExplosionAnimation());
	
		lLightning_spr.position.x = param.position.x;
		lLightning_spr.position.y = param.position.y;
		
		lLightning_spr.scale = param.scale;
		lLightning_spr.rotation = param.rotation;

		lLightning_spr.i_startAnimation();
		this._fAnimationCount_num++;
		lLightning_spr.once(LightningBossSmokeLightningExplosionAnimation.EVENT_ON_ANIMATION_ENDED, this._onLightExplosionAnimationCompleted, this);
	}

	_onLightExplosionAnimationCompleted()
	{
		this._fAnimationCount_num--;
		this._onAnimationCompletedSuspicison();
	}

	
	_onAnimationCompletedSuspicison()
	{
		if (this._fAnimationCount_num == 0)
		{
			this._interruptAnimation();
			this.emit(LightningBossSmokeLightningsExplosionAnimation.EVENT_ON_ANIMATION_ENDED);
		}
	}

	_interruptAnimation()
	{
		this._fAnimationCount_num = null;

		for (let i = 0; i < this._fStartTimer_arr.length; i++)
		{
			this._fStartTimer_arr[i] && this._fStartTimer_arr[i].destructor();
			this._fStartTimer_arr[i] = null;
		}

		this._fStartTimer_arr = [];

		for (let i = 0; i < LIGHTNING_PARAM.length; i++)
		{
			if (!this._fLightnings_arr)
			{
				break;
			}

			this._fLightnings_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fLightnings_arr[i]));
			this._fLightnings_arr[i] && this._fLightnings_arr[i].destroy();
			this._fLightnings_arr[i] = null;
		}

		this._fLightnings_arr = [];
	}


	destroy()
	{
		super.destroy();

		this._interruptAnimation();
	}
}

export default LightningBossSmokeLightningsExplosionAnimation;