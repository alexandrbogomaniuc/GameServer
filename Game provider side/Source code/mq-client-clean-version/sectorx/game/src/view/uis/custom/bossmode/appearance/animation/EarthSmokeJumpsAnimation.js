import Sprite from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { FRAME_RATE } from '../../../../../../../../shared/src/CommonConstants';
import { Sequence } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import { Utils } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import EarthSmallStoneRock from '../../animation/EarthSmallStoneRock';

const SMOKE_PARAM =[
	{
		delay: 37,
		position: {x: -15, y: 11.8},
		scale: {x: 0.753, y: 0.753},
		container: 1,
	},
	{
		delay: 27,
		position: {x: 0.3, y: -0.45},
		scale: {x: 0.993, y: 0.993},
		container: 1,
	},
	{
		delay: 54,
		position: {x: 0.2, y: -34.9},
		scale: {x: -0.993, y: 0.993},
		container: 1,
	},
	{
		delay: 64,
		position: {x: 0.3, y: -38},
		scale: {x: 0.993, y: 0.993},
		container: 1,
	},
	{
		delay: 69,
		position: {x: -14.95, y: -25.75},
		scale: {x: 0.753, y: 0.753},
		container: 2,
	},

];

class EarthSmokeJumpsAnimation extends Sprite
{
	static get EVENT_ON_ANIMATION_ENDED()				{return "onAnimationEnded";}

	i_startAnimation()
	{
		this._startAnimation();
	}

	constructor(aFirstContainer, aSecondContainer)
	{
		super();

		this._fFirstContainer_spr = aFirstContainer;
		this._fSecondContainer_spr = aSecondContainer;
		
		this._fAnimationCount_num = null;

		this._fSmoke_essr_arr = [];
	}

	_startAnimation()
	{
		this._fAnimationCount_num = 0;
		
		this._startSmallStone();
	}

	_startSmallStone()
	{
		for (let i = 0; i < SMOKE_PARAM.length; i++)
		{
			this._startSmoke(i);
		}
	}

	_startSmoke(aIndex)
	{
		let param = SMOKE_PARAM[aIndex];
		let lSmoke_essr = null;

		if (param.container == 1)
		{
			lSmoke_essr = this._fSmoke_essr_arr[aIndex] = this._fFirstContainer_spr.addChild(new EarthSmallStoneRock());
		}
		else if (param.container == 2)
		{
			lSmoke_essr = this._fSmoke_essr_arr[aIndex] = this._fSecondContainer_spr.addChild(new EarthSmallStoneRock());
		}
		else
		{
			APP.logger.i_pushWarning(`EarthSmokeJumpsAnimation. Param container is incorrect!`)
			console.error("Param container is incorrect!");
		}
	
		lSmoke_essr.alpha = 0;
		lSmoke_essr.position = param.position;
		lSmoke_essr.scale = param.scale;

		let l_seq = [
			{tweens: [], duration: param.delay * FRAME_RATE},
			{tweens: [{prop: "alpha", to: 1}], duration: 0 * FRAME_RATE,
					onfinish: ()=>{
						lSmoke_essr.on(EarthSmallStoneRock.EVENT_ON_ANIMATION_ENDED, this._onEarthSmokeJumpsAnimationCompleted, this);
						lSmoke_essr.startAnimation(0, 1);						
			}}
		];

		this._fAnimationCount_num++;
		Sequence.start(lSmoke_essr, l_seq);
	}

	_onEarthSmokeJumpsAnimationCompleted()
	{
		this._fAnimationCount_num--;
		this._onAnimationCompletedSuspicison();
	}

	_onAnimationCompletedSuspicison()
	{
		if (this._fAnimationCount_num == 0)
		{
			this.emit(EarthSmokeJumpsAnimation.EVENT_ON_ANIMATION_ENDED);
		}
	}


	destroy()
	{
		super.destroy();

		for (let i = 0; i < SMOKE_PARAM.length; i++)
		{
			if (!this._fSmoke_essr_arr)
			{
				break;
			}

			this._fSmoke_essr_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fSmoke_essr_arr[i]));
			this._fSmoke_essr_arr[i] && this._fSmoke_essr_arr[i].destroy();
			this._fSmoke_essr_arr[i] = null;
		}

		this._fSmoke_essr_arr = [];
		
		this._fAnimationCount_num = null;
	}
}

export default EarthSmokeJumpsAnimation;