import Sprite from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import * as Easing from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { APP } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../../../../shared/src/CommonConstants';
import { Sequence } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import { Utils } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import Timer from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';

import LightningBossSmokeLightningYellowAnimation from './LightningBossSmokeLightningYellowAnimation';

const LIGHTNING_PARAM =[
	{
		delay: 26,
		position: {x: -200.2, y: 15.85},
		rotation: 0.14835298641951802, //Utils.gradToRad(8.5)
		scale: {x: 1.36, y: 1.36}
	},
	{
		delay: 51,
		position: {x: 207.8, y: -58.15},
		rotation: -0.5846852994181003,//Utils.gradToRad(-33.5)
		scale: {x: -1.87, y: 1.87}
	},
	{
		delay: 71,
		position: {x: 168.3, y: 103.85},
		rotation: -1.3229595730117016, //Utils.gradToRad(-75.8)
		scale: {x: 1.36, y: 1.36}
	},
	{
		delay: 87,
		position: {x: 207.8, y: -58.15},
		rotation: -0.5846852994181003, //Utils.gradToRad(-33.5)
		scale: {x: -1.87, y: 1.87}
	},
	{
		delay: 93,
		position: {x: 167.8, y: 103.85},
		rotation: -1.3229595730117016, //Utils.gradToRad(-75.8)
		scale: {x: 1.36, y: 1.36}
	},
	{
		delay: 99,
		position: {x: -161.2, y: 25.85},
		rotation: 1.642354826126664, //Utils.gradToRad(94.1)
		scale: {x: -1.69, y: 1.69}
	}
];

class LightningBossSmokeLightningsYellowAnimation extends Sprite
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
		let lLightning_spr = this._fLightnings_arr[aIndex] = this.addChild(new LightningBossSmokeLightningYellowAnimation());
	
		lLightning_spr.position.x = param.position.x;
		lLightning_spr.position.y = param.position.y;
		
		lLightning_spr.scale = param.scale;
		lLightning_spr.rotation = param.rotation;
		
		lLightning_spr.once(LightningBossSmokeLightningYellowAnimation.EVENT_ON_ANIMATION_ENDED, this._onLightYellowAnimationCompleted, this);
		this._fAnimationCount_num++;
		lLightning_spr.i_startAnimation();
	}

	_onLightYellowAnimationCompleted()
	{
		this._fAnimationCount_num--;
		this._onAnimationCompletedSuspicison();
	}
	
	_onAnimationCompletedSuspicison()
	{
		if (this._fAnimationCount_num == 0)
		{
			this._interruptAnimation();
			this.emit(LightningBossSmokeLightningsYellowAnimation.EVENT_ON_ANIMATION_ENDED);
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

export default LightningBossSmokeLightningsYellowAnimation;