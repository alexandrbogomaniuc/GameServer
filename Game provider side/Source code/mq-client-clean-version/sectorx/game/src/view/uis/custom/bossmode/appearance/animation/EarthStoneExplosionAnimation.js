import { FRAME_RATE } from '../../../../../../../../shared/src/CommonConstants';
import { Utils } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import { AtlasSprite, Sprite } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import Timer from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import { APP } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import AtlasConfig from '../../../../../../config/AtlasConfig';

let _stone_explosion0_textures = null;
function _generateStoneExplosion0Textures()
{
	if (_stone_explosion0_textures) return;
	_stone_explosion0_textures = AtlasSprite.getFrames(APP.library.getAsset("boss_mode/earth/stone_explosion_0"), AtlasConfig.Stone0Explosion, "");
}

let _stone_explosion1_textures = null;
function _generateStoneExplosion1Textures()
{
	if (_stone_explosion1_textures) return;
	_stone_explosion1_textures = AtlasSprite.getFrames(APP.library.getAsset("boss_mode/earth/stone_explosion_1"), AtlasConfig.Stone1Explosion, "");
}

const EXPLOSION_PARAM_1 =[
	{
		delay: 110,
		position: {x: 17.4, y: -41.05},
		rotation: 0.5131268000863328, //Utils.gradToRad(29.4)
		scale: {x: 1.949, y: 1.949}
	},
	{
		delay: 105,
		position: {x: 17.4, y: -41.05},
		rotation: -0.14835298641951802, //Utils.gradToRad(-8.5)
		scale: {x: 2.589, y: 2.589}
	}
];

const EXPLOSION_PARAM_2 =[
	{
		delay: 31,
		position: {x: 0.2, y: -78.75},
		rotation: 0,
		scale: {x: 1, y: 1}
	},
	{
		delay: 49,
		position: {x: 22.35, y: -73.95},
		rotation: 0.19373154697137057, //Utils.gradToRad(11.1)
		scale: {x: 0.86, y: 0.86}
	},
	{
		delay: 52,
		position: {x: -25.25, y: -89.15},
		rotation: -0.03490658503988659, //Utils.gradToRad(-2)
		scale: {x: 1.22, y: 1.22}
	},
	{
		delay: 64,
		position: {x: -6, y: -106.35},
		rotation: 0,
		scale: {x: 1, y: 1}
	},
	{
		delay: 81,
		position: {x: 22.35, y: -73.95},
		rotation: 0.19373154697137057, //Utils.gradToRad(11.1)
		scale: {x: 0.86, y: 0.86}
	},
	{
		delay: 89,
		position: {x: -25.25, y: -89.15},
		rotation: -0.03490658503988659, //Utils.gradToRad(-2)
		scale: {x: 1.22, y: 1.22}
	}
];

class EarthStoneExplosionAnimation extends Sprite
{
	static get EVENT_ON_ANIMATION_ENDED()				{return "onAnimationEnded";}

	i_startAnimation(aTypeAnimation)
	{
		this._startAnimation(aTypeAnimation);
	}

	constructor()
	{
		super();

		_generateStoneExplosion0Textures();
		_generateStoneExplosion1Textures();
		
		this._fAnimationCount_num = null;

		this._fStartTimer_tmr_arr = [];
		this._fStoneExplosion_arr = [];
	}

	_startAnimation(aTypeAnimation)
	{
		this._fAnimationCount_num = 0;
		
		let constParam = this._getStoneParam(aTypeAnimation);

		for (let i = 0; i < constParam.length; i++)
		{
			this._startStoneExplosion(i, aTypeAnimation);
		}
	}

	_getStoneParam(aTypeAnimation)
	{
		let constParam = [];

		switch(aTypeAnimation)
		{
			case 1: constParam = EXPLOSION_PARAM_1; break;
			case 2: constParam = EXPLOSION_PARAM_2; break;
			default: break;
		}

		return constParam;
	}

	_getStoneTextures(aTypeAnimation)
	{
		let constParam = null;

		switch(aTypeAnimation)
		{
			case 1: constParam = _stone_explosion0_textures; break;
			case 2: constParam = _stone_explosion1_textures; break;
			default: break;
		}

		return constParam;
	}

	_startStoneExplosion(aIndex, aTypeAnimation)
	{
		let param = this._getStoneParam(aTypeAnimation)[aIndex];

		let lStoneExplosion_spr = this._fStoneExplosion_arr[aIndex] = this.addChild(new Sprite());
		lStoneExplosion_spr.textures = this._getStoneTextures(aTypeAnimation);
		lStoneExplosion_spr.animationSpeed = 0.5; //30 / 60;
		lStoneExplosion_spr.position.x = param.position.x;
		lStoneExplosion_spr.position.y = param.position.y;	
		lStoneExplosion_spr.alpha = 0;
		lStoneExplosion_spr.scale = param.scale;
		lStoneExplosion_spr.rotation = param.rotation;

		lStoneExplosion_spr.on('animationend', ()=>{
			lStoneExplosion_spr.stop();
			lStoneExplosion_spr && lStoneExplosion_spr.destroy();
			lStoneExplosion_spr = null;
			this._fAnimationCount_num--;
			this._onAnimationCompletedSuspicison();
		});

		this._fAnimationCount_num++;
		let lStartTimer = this._fStartTimer_tmr_arr[aIndex] = new Timer(()=>{
				lStartTimer && lStartTimer.destructor();
				lStoneExplosion_spr.alpha = 1;
				lStoneExplosion_spr.play();
		}, param.delay * FRAME_RATE, true);
	}

	_onAnimationCompletedSuspicison()
	{
		if (this._fAnimationCount_num == 0)
		{
			this.emit(EarthStoneExplosionAnimation.EVENT_ON_ANIMATION_ENDED);
		}
	}


	destroy()
	{
		super.destroy();

		for (let i = 0; i < this._fStartTimer_tmr_arr.length; i++)
		{
			this._fStartTimer_tmr_arr[i] && this._fStartTimer_tmr_arr[i].destructor();
		}
		this._fStartTimer_tmr_arr = [];

		for (let i = 0; i < this._fStoneExplosion_arr.length; i++)
		{
			if (!this._fStoneExplosion_arr[i])
			{
				continue;
			}

			this._fStoneExplosion_arr[i] && this._fStoneExplosion_arr[i].destroy();
			this._fStoneExplosion_arr[i] = null;
		}

		this._fStoneExplosion_arr = [];
		
		this._fAnimationCount_num = null;
	}
}

export default EarthStoneExplosionAnimation;