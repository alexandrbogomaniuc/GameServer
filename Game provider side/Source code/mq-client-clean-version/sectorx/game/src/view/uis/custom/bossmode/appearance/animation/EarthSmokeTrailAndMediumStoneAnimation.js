import Sprite from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { FRAME_RATE } from '../../../../../../../../shared/src/CommonConstants';
import { Sequence } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import { Utils } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import EarthMediumStoneRock from '../../animation/EarthMediumStoneRock';

const ANIMATION_STONE_TYPE = 1;
const STONE_TYPE_0 = 0;
const STONE_TYPE_1 = 1;
const STONE_TYPE_2 = 2;
const ANIMATION_SMOKE_TYPE = 2;

const ANIMATION_PARAM =[
	{
		delay: 65,
		position: {x: 0, y: 0},
		rotation: 0,
		scale: {x: -0.993, y: 0.993},
		animationType: ANIMATION_STONE_TYPE,
		stoneType: STONE_TYPE_0, 
		speed: 1
	},
	{
		delay: 88,
		position: {x: 0, y: 0},
		rotation: 0,
		scale: {x: 0.993, y: 0.993},
		animationType: ANIMATION_STONE_TYPE,
		stoneType: STONE_TYPE_1, 
		speed: 1
	},
	{
		delay: 70,
		position: {x: 0, y: 0},
		rotation: -0.25132741228718347, //Utils.gradToRad(-14.4)
		scale: {x: -0.753, y: 0.753},
		animationType: ANIMATION_STONE_TYPE,
		stoneType: STONE_TYPE_2, 
		speed: 1
	},
	{
		delay: 135,
		position: {x: 0, y: -115.5},
		rotation: 0,
		scale: {x: 0.993, y: 0.993},
		animationType: ANIMATION_SMOKE_TYPE,
		speed: 1
	},
	{
		delay: 133,
		position: {x: 0, y: -169.15},
		rotation: 0,
		scale: {x: -0.993, y: 0.993},
		animationType: ANIMATION_SMOKE_TYPE,
		speed: 1
	},
	{
		delay: 134,
		position: {x: 0, y: -23.9},
		rotation: -0.25132741228718347,  //Utils.gradToRad(-14.4)
		scale: {x: -0.753, y: 0.753},
		animationType: ANIMATION_SMOKE_TYPE,
		speed: 1
	},
	{
		delay: 138,
		position: {x: 0, y: -48.85},
		rotation: 0,
		scale: {x: 0.993, y: 0.993},
		animationType: ANIMATION_SMOKE_TYPE,
		speed: 1
	},
	{
		delay: 136,
		position: {x: 0, y: 5.6},
		rotation: 0.36826447217080355,  //Utils.gradToRad(21.1)
		scale: {x: 0.993, y: 0.993},
		animationType: ANIMATION_STONE_TYPE,
		stoneType: STONE_TYPE_1, 
		speed: 1
	},
	{
		delay: 140,
		position: {x: 0, y: -123.25},
		rotation: 0.36826447217080355,  //Utils.gradToRad(21.1)
		scale: {x: -0.733, y: 0.733},
		animationType: ANIMATION_STONE_TYPE,
		stoneType: STONE_TYPE_0, 
		speed: 1
	},
	{
		delay: 140,
		position: {x: 0, y: -137.75},
		rotation: -0.21293016874330817,  //Utils.gradToRad(-12.2)
		scale: {x: 0.933, y: 0.933},
		animationType: ANIMATION_STONE_TYPE,
		stoneType: STONE_TYPE_1, 
		speed: 1
	},
];


class EarthSmokeTrailAndMediumStoneAnimation extends Sprite
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

		this._fStone_essr_arr = [];
	}

	_startAnimation()
	{
		this._fAnimationCount_num = 0;
		
		for (let i = 0; i < ANIMATION_PARAM.length; i++)
		{
			this._startStone(i);
		}
	}

	_startStone(aIndex)
	{
		let param =  ANIMATION_PARAM[aIndex];
		let lStone_essr = this._fStone_essr_arr[aIndex] = this.addChild(new EarthMediumStoneRock());
	
		lStone_essr.alpha = 0;
		lStone_essr.position = param.position;
		lStone_essr.scale = param.scale;
		lStone_essr.rotation = param.rotation;

		let l_seq = [
			{tweens: [], duration: param.delay * FRAME_RATE},
			{tweens: [{prop: "alpha", to: 1}], duration: 0 * FRAME_RATE,
					onfinish: ()=>{
						lStone_essr.on(EarthMediumStoneRock.EVENT_ON_ANIMATION_ENDED, this._onEarthSmokeTrailAndMediumStoneAnimationCompleted, this);

						if (param.animationType == ANIMATION_STONE_TYPE)
						{
							lStone_essr.startStoneAnimation(param.stoneType, param.speed);
						}
						else if (param.animationType == ANIMATION_SMOKE_TYPE)
						{
							lStone_essr.startSmokeTrailAnimation(param.speed);
						}						
			}}
		];

		this._fAnimationCount_num++;
		Sequence.start(lStone_essr, l_seq);
	}

	_onEarthSmokeTrailAndMediumStoneAnimationCompleted()
	{
		this._fAnimationCount_num--;
		this._onAnimationCompletedSuspicison();
	}

	_onAnimationCompletedSuspicison()
	{
		if (this._fAnimationCount_num == 0)
		{
			this.emit(EarthSmokeTrailAndMediumStoneAnimation.EVENT_ON_ANIMATION_ENDED);
		}
	}

	destroy()
	{
		super.destroy();

		for (let i = 0; i < this._fStone_essr_arr.length; i++)
		{
			this._fStone_essr_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fStone_essr_arr[i]));
			this._fStone_essr_arr[i] && this._fStone_essr_arr[i].destroy();
			this._fStone_essr_arr[i] = null;
		}

		this._fStone_essr_arr = [];
		
		this._fAnimationCount_num = null;
	}
}

export default EarthSmokeTrailAndMediumStoneAnimation;