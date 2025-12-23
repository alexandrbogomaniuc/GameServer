import Sprite from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { APP } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../../../../shared/src/CommonConstants';
import { Sequence } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import { Utils } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import EarthSmallStoneRock from '../../animation/EarthSmallStoneRock';
import EarthSmallStoneRock11Animation from '../../animation/EarthSmallStoneRock11Animation';

const STONE_PARAM_FIRST =[
	{
		delay: 49,
		position: {x: 124.15, y: -23.75}, //{x: 248.3 / 2, y: -47.5 / 2}
		rotation: 0,
		scale: {x: -1.1, y: 1.1},
		animationType: 9,
		alphaDuration: 57,
		speed: 1
	},
	{
		delay: 22,
		position: {x: 302.35, y: -23.75}, //{x: 604.7 / 2, y: -47.5 / 2}
		rotation: 0,
		scale: {x: -1.1, y: 1.1},
		animationType: 9,
		alphaDuration: 84,
		speed: 1
	},
	{
		delay: 51,
		position: {x: 70.85, y: 30.4}, //{x: 141.7 / 2, y: 60.8 / 2}
		rotation: 0.5934119456780721, //Utils.gradToRad(34)
		scale: {x: -1.1, y: 1.1},
		animationType: 9,
		alphaDuration: 55,
		speed: 1
	},
	{
		delay: 38,
		position: {x: 3.85, y: 4.4}, //{x: 7.7 / 2, y: 8.8 / 2}
		rotation: 0.0017453292519943296, //Utils.gradToRad(0.1)
		scale: {x: -1.1, y: 1.1},
		animationType: 9,
		alphaDuration: 68,
		speed: 1
	},
	{
		delay: 39,
		position: {x: 35, y: 8}, //{x: 70 / 2, y: 16 / 2}
		rotation: 0,
		scale: {x: 1, y: 1},
		animationType: 6,
		alphaDuration: 67,
		speed: 1
	},
	{
		delay: 47,
		position: {x: -15, y: -48}, //{x: -30 / 2, y: -96 / 2}
		rotation: 0,
		scale: {x: -1, y: 1},
		animationType: 6,
		alphaDuration: 67,
		speed: 1
	},
	{
		delay: 24,
		position: {x: 155.85, y: 61.4}, //{x: 311.7 / 2, y: 122.8 / 2}
		rotation: 0.5934119456780721, //Utils.gradToRad(34)
		scale: {x: -1.1, y: 1.1},
		animationType: 9,
		alphaDuration: 82,
		speed: 1
	},
	{
		delay: 53,
		position: {x: -188.7, y: -12.85}, //{x: -377.4 / 2, y: -25.7 / 2}
		rotation: 3.560471674068432, //Utils.gradToRad(204)
		scale: {x: -1.1, y: 1.1},
		animationType: 9,
		alphaDuration: 53,
		speed: 1
	},
	{
		delay: 26,
		position: {x: -188.7, y: -12.85}, //{x: -377.4 / 2, y: -25.7 / 2}
		rotation: 3.560471674068432, //Utils.gradToRad(204)
		scale: {x: -1.1, y: 1.1},
		animationType: 9,
		alphaDuration: 82,
		speed: 1
	},
	{
		delay: 69,
		position: {x: 124.15, y: -43.55}, //{x: 248.3 / 2, y: -87.1 / 2}
		rotation: 0,
		scale: {x: -1.1, y: 1.1},
		animationType: 9,
		alphaDuration: 39,
		speed: 1
	},
	{
		delay: 42,
		position: {x: 124.15, y: -43.55}, //{x: 248.3 / 2, y: -87.1 / 2}
		rotation: 0,
		scale: {x: -1.1, y: 1.1},
		animationType: 9,
		alphaDuration: 66,
		speed: 1
	},
	{
		delay: 71,
		position: {x: 155.85, y: 41.6}, //{x: 311.7 / 2, y: 83.2 / 2}
		rotation: 0.5934119456780721, //Utils.gradToRad(34)
		scale: {x: -1.1, y: 1.1},
		animationType: 9,
		alphaDuration: 37,
		speed: 1
	},
	{
		delay: 44,
		position: {x: 155.85, y: 41.6}, //{x: 311.7 / 2, y: 83.2 / 2}
		rotation: 0.5934119456780721, //Utils.gradToRad(34)
		scale: {x: -1.1, y: 1.1},
		animationType: 9,
		alphaDuration: 64,
		speed: 1
	},
	{
		delay: 73,
		position: {x: -188.7, y: -32.7}, //{x: -377.4 / 2, y: -65.4 / 2}
		rotation: 3.560471674068432, //Utils.gradToRad(204)
		scale: {x: -1.1, y: 1.1},
		animationType: 9,
		alphaDuration: 35,
		speed: 1
	},
	{
		delay: 46,
		position: {x: -188.7, y: -32.2}, //{x: -377.4 / 2, y: -64.4 / 2}
		rotation: 3.560471674068432, //Utils.gradToRad(204)
		scale: {x: -1.1, y: 1.1},
		animationType: 9,
		alphaDuration: 62,
		speed: 1
	},
	{
		delay: 49,
		position: {x: 13.4, y: -30.6}, //{x: 26.8 / 2, y: -61.2 / 2}
		rotation: 0,
		scale: {x: -0.995, y: 0.995},
		animationType: 11
	},
	{
		delay: 53,
		position: {x: 7.45, y: 36.75}, //{x: 14.9 / 2, y: 73.5 / 2}
		rotation: 0.4886921905584123, //Utils.gradToRad(28)
		scale: {x: -0.995, y: 0.995},
		animationType: 11
	},
	{
		delay: 53,
		position: {x: -111.3, y: 18.9}, //{x: -222.6 / 2, y: 37.8 / 2}
		rotation: 5.6374134839416845, //Utils.gradToRad(323)
		scale: {x: -0.995, y: 0.995},
		animationType: 11
	},
	{
		delay: 47,
		position: {x: -114.4, y: -6.95}, //{x: -228.8 / 2, y: -13.9 / 2}
		rotation: 0,
		scale: {x: 1, y: 1},
		animationType: 5,
		alphaDuration: 55,
		speed: 1
	},
	{
		delay: 20,
		position: {x: -173.85, y: -6.95}, //{x: -347.7 / 2, y: -13.9 / 2}
		rotation: 0,
		scale: {x: 1, y: 1},
		animationType: 5,
		alphaDuration: 55,
		speed: 1
	},
	{
		delay: 49,
		position: {x: -65.69, y: 85.15}, //{x: -131.9 / 2, y: 170.3 / 2}
		rotation: 5.515240436302081, //Utils.gradToRad(316)
		scale: {x: 1, y: 1},
		animationType: 5,
		alphaDuration: 55,
		speed: 1
	},
	{
		delay: 22,
		position: {x: -65.95, y: 85.15}, //{x: -131.9 / 2, y: 170.3 / 2}
		rotation: 5.515240436302081, //Utils.gradToRad(316)
		scale: {x: 1, y: 1},
		animationType: 5,
		alphaDuration: 55,
		speed: 1
	},
	{
		delay: 67,
		position: {x: -114.45, y: -26.75}, //{x: -228.9 / 2, y: -53.5 / 2}
		rotation: 0,
		scale: {x: 1, y: 1},
		animationType: 5,
		alphaDuration: 55,
		speed: 1
	},
	{
		delay: 40,
		position: {x: -114.45, y: -26.75}, //{x: -228.9 / 2, y: -53.5 / 2}
		rotation: 0,
		scale: {x: 1, y: 1},
		animationType: 5,
		alphaDuration: 55,
		speed: 1
	},
	{
		delay: 69,
		position: {x: -65.95, y: 65.35}, //{x: -131.9 / 2, y: 130.7 / 2}
		rotation: 5.515240436302081, //Utils.gradToRad(316)
		scale: {x: 1, y: 1},
		animationType: 5,
		alphaDuration: 55,
		speed: 1
	},
	{
		delay: 42,
		position: {x: -65.95, y: 65.35}, //{x: -131.9 / 2, y: 130.7 / 2}
		rotation: 5.515240436302081, //Utils.gradToRad(316)
		scale: {x: 1, y: 1},
		animationType: 5,
		alphaDuration: 55,
		speed: 1
	},
	{
		delay: 47,
		position: {x: 20.55, y: -16.85}, //{x: 41.1 / 2, y: -33.7 / 2}
		rotation: 6.2482787221397, //Utils.gradToRad(358)
		scale: {x: -0.995, y: 0.995},
		animationType: 11
	},
];

const STONE_PARAM_TWO = [
	{
		delay: 66,
		position: {x: 40.55, y: -59.85}, //{x: 81.1 / 2, y: -119.7 / 2}
		rotation: 0,
		scale: {x: 0.785, y: 0.785},
		animationType: 11
	},
	{
		delay: 76,
		position: {x: 159.55, y: -81.85}, //{x: 319.1 / 2, y: -163.7 / 2}
		rotation: 0,
		scale: {x: -0.785, y: 0.785},
		animationType: 11
	},
];

const STONE_PARAM_THREE = [
	{
		delay: 108,
		position: {x: 150.75, y: 32.25}, //{x: 301.5 / 2, y: 64.5 / 2}
		rotation: 0.33510321638291124, //Utils.gradToRad(19.2)
		scale: {x: 1, y: 1},
		animationType: 5,
		alphaDuration: 53,
		speed: 1
	},
	{
		delay: 105,
		position: {x: 80.7, y: 56.95}, //{x: 161.4 / 2, y: 113.9 / 2}
		rotation: 0.33510321638291124, //Utils.gradToRad(19.2)
		scale: {x: 0.755, y: 0.755},
		animationType: 5,
		alphaDuration: 53,
		speed: 1
	},
	{
		delay: 108,
		position: {x: -95.65, y: -14.15}, //{x: -191.3 / 2, y: -28.3 / 2}
		rotation: 0.33510321638291124, //Utils.gradToRad(19.2)
		scale: {x: -0.755, y: 0.755},
		animationType: 5,
		alphaDuration: 53,
		speed: 1
	},
	{
		delay: 112,
		position: {x: -161.5, y: 46.65}, //{x: -323 / 2, y: 93.3 / 2}
		rotation: -0.2617993877991494, //Utils.gradToRad(-15)
		scale: {x: -0.98, y: 0.98},
		animationType: 5,
		alphaDuration: 53,
		speed: 1
	},
	{
		delay: 114,
		position: {x: -63.6, y: 20.9}, //{x: -127.2 / 2, y: 41.8 / 2}
		rotation: -0.022689280275926284, //Utils.gradToRad(-1.3)
		scale: {x: -0.69, y: 0.69},
		animationType: 5,
		alphaDuration: 53,
		speed: 1
	},
];

const STONE_PARAM_FOUR = [
	{
		delay: 101,
		position: {x: 115.75, y: -14.35}, //{x: 231.5 / 2, y: -28.7 / 2}
		rotation: -0.15707963267948966, //Utils.gradToRad(-9)
		scale: {x: -0.845, y: 0.845},
		animationType: 14,
		alphaDuration: null,
		speed: 1
	},
	{
		delay: 101,
		position: {x: 75.3, y: 113.95}, //{x: 150.6 / 2, y: 227.9 / 2}
		rotation: 0.7853981633974483, //Utils.gradToRad(45)
		scale: {x: -0.845, y: 0.845},
		animationType: 13,
		alphaDuration: null,
		speed: 1
	},
	{
		delay: 101,
		position: {x: 56.35, y: 74.3}, //{x: 112.7 / 2, y: 148.6 / 2}
		rotation: 0.08726646259971647, //Utils.gradToRad(5)
		scale: {x: -0.845, y: 0.845},
		animationType: 12,
		alphaDuration: null,
		speed: 1
	},
	{
		delay: 101,
		position: {x: 105, y: 83.8}, //{x: 210 / 2, y: 167.6 / 2}
		rotation: 0.2617993877991494, //Utils.gradToRad(15)
		scale: {x: -0.845, y: 0.845},
		animationType: 13,
		alphaDuration: null,
		speed: 1
	},
];

class EarthSmallStoneRockAnimation extends Sprite
{
	static get EVENT_ON_ANIMATION_ENDED()				{return "onAnimationEnded";}

	i_startAnimation(aTypeAnimation)
	{
		this._startAnimation(aTypeAnimation);
	}

	constructor()
	{
		super();
		
		this._fAnimationCount_num = null;

		this._fStone_essr_arr = [];
	}

	_startAnimation(aTypeAnimation)
	{
		if (!APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			return;
		}

		this._fAnimationCount_num = 0;
		
		this._startSmallStone(aTypeAnimation);
	}

	_startSmallStone(aTypeAnimation)
	{
		let constParam = this._getStoneParam(aTypeAnimation);
		
		
		for (let i = 0; i < constParam.length; i++)
		{
			if (constParam[i].animationType == 11)
			{
				this._startStone11(i, aTypeAnimation);
			}
			else
			{
				this._startStone(i, aTypeAnimation);
			}
		}
	}

	_getStoneParam(aTypeAnimation)
	{
		let constParam = [];

		switch(aTypeAnimation)
		{
			case 1: constParam = STONE_PARAM_FIRST; break;
			case 2: constParam = STONE_PARAM_TWO; break;
			case 3: constParam = STONE_PARAM_THREE; break;
			case 4: constParam = STONE_PARAM_FOUR; break;
			default: break;
		}

		return constParam;
	}

	_startStone(aIndex, aTypeAnimation)
	{
		let param =  this._getStoneParam(aTypeAnimation)[aIndex];
		let lStone_essr = this._fStone_essr_arr[aIndex] = this.addChild(new EarthSmallStoneRock());
	
		lStone_essr.alpha = 0;
		lStone_essr.position = param.position;
		lStone_essr.scale = param.scale;
		lStone_essr.rotation = param.rotation;

		let l_seq = [
			{tweens: [], duration: param.delay * FRAME_RATE},
			{tweens: [{prop: "alpha", to: 1}], duration: 0 * FRAME_RATE,
					onfinish: ()=>{
						lStone_essr.on(EarthSmallStoneRock.EVENT_ON_ANIMATION_ENDED, this._onEarthSmallStoneRockAnimationCompleted, this);
						lStone_essr.startAnimation(param.animationType, param.speed, param.alphaDuration);
						this._onAnimationCompletedSuspicison();
			}}
		];

		this._fAnimationCount_num++;
		Sequence.start(lStone_essr, l_seq);
	}

	_onEarthSmallStoneRockAnimationCompleted()
	{
		this._fAnimationCount_num--;
		this._onAnimationCompletedSuspicison();
	}

	_startStone11(aIndex, aTypeAnimation)
	{
		let param = this._getStoneParam(aTypeAnimation)[aIndex];
		this._fEarthSmallStoneRock11Animation_essra = this._fStone_essr_arr[aIndex] = this.addChild(new EarthSmallStoneRock11Animation());
		this._fEarthSmallStoneRock11Animation_essra.once(EarthSmallStoneRock11Animation.EVENT_ON_ANIMATION_ENDED, this._onEarthSmallStoneRock11AnimationCompleted, this);
		this._fEarthSmallStoneRock11Animation_essra.position = param.position;
		this._fEarthSmallStoneRock11Animation_essra.scale = param.scale;
		this._fEarthSmallStoneRock11Animation_essra.rotation = param.rotation;
		this._fAnimationCount_num++;
		this._fEarthSmallStoneRock11Animation_essra.i_startAnimation(param.delay);
	}

	_onEarthSmallStoneRock11AnimationCompleted()
	{
		this._fAnimationCount_num--;
		this._onAnimationCompletedSuspicison();
	}

	_onAnimationCompletedSuspicison()
	{
		if (this._fAnimationCount_num == 0)
		{
			this.emit(EarthSmallStoneRockAnimation.EVENT_ON_ANIMATION_ENDED);
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

export default EarthSmallStoneRockAnimation;