
import { AtlasSprite, Sprite } from '../../../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import AtlasConfig from '../../../../../../../config/AtlasConfig';
import * as Easing from '../../../../../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { APP } from '../../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../../../../../shared/src/CommonConstants';
import { Sequence } from '../../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import { Utils } from '../../../../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import Timer from '../../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';

const EXPLOSIONS_INFO = [
	{
		position: {x: 8, y: -22},
		delay: 0,
		explosionDelay: 5*FRAME_RATE
	},
	{
		position: {x: 0, y: 0},
		delay: 6*FRAME_RATE,
		explosionDelay: 3*FRAME_RATE
	},
	{
		position: {x: 26, y: -22},
		delay: 13*FRAME_RATE,
		explosionDelay: 4*FRAME_RATE
	},
	{
		position: {x: 0, y: 0},
		delay: 17*FRAME_RATE,
		explosionDelay: 3*FRAME_RATE
	},
	{
		position: {x: 50, y: -12},
		delay: 21*FRAME_RATE,
		explosionDelay: 3.5*FRAME_RATE
	},
	{
		position: {x: -30, y: -35},
		delay: 25*FRAME_RATE,
		explosionDelay: 3*FRAME_RATE
	},
];

let explosion_textures;
export function generate_explosion_textures()
{
	if (!explosion_textures)
	{
		explosion_textures = AtlasSprite.getFrames([APP.library.getAsset("enemies/ice_boss/death/death_explosion")], [AtlasConfig.IceBossFireExplosion], "");
	}
	return explosion_textures;
}


class FireBossDeathSmallExploasionsAnimation extends Sprite
{
	static get EVENT_ON_ANIMATION_FINISH() { return "onAnimationFinish"; }

	startAnimation()
	{
		this._startAnimation();
	}

	interrupt()
	{
		this._interrupt();
	}

	constructor()
	{
		super();

		this._fExplosionsTimers_t_arr = null;
	}

	_startAnimation()
	{
		this._startExploasions();
	}

	_startExploasions()
	{
		if (!this._fExplosionsTimers_t_arr)
		{
			this._fExplosionsTimers_t_arr = [];
		}

		for (let lInfo_obj of EXPLOSIONS_INFO)
		{
			let lIsLast_bl = EXPLOSIONS_INFO.indexOf(lInfo_obj) == EXPLOSIONS_INFO.length - 1;

			let lExplosion_spr = this.addChild(new Sprite());
			lExplosion_spr.textures = generate_explosion_textures();
			lExplosion_spr.position = lInfo_obj.position;
			lExplosion_spr.scale.set(2.3);
			lExplosion_spr.hide();
			lExplosion_spr.on('animationend', ()=>{
				lExplosion_spr.destroy();
			});

			this._fExplosionsTimers_t_arr.push(new Timer(()=>{
				lExplosion_spr.show();
				lExplosion_spr.play();

				if (lIsLast_bl)
				{
					this._startIndependentExplosions();
				}
			}, lInfo_obj.delay + lInfo_obj.explosionDelay));

		}
	}

	_startIndependentExplosions()
	{
		for (let i = 0; i < 4; i++)
		{
			let lExplosion_spr = this.addChild(new Sprite());
			lExplosion_spr.textures = generate_explosion_textures();
			lExplosion_spr.position.set(Utils.getRandomWiggledValue(-30, 60), Utils.getRandomWiggledValue(-40, 80));
			lExplosion_spr.scale.set(2.5+Utils.getRandomWiggledValue(-0.2, 0.4));
			lExplosion_spr.on('animationend', ()=>{
				this._tryEndAnimation()
				lExplosion_spr.destroy();
			});
			lExplosion_spr.hide();

			let lDelay_num = 6*FRAME_RATE + i*FRAME_RATE*Utils.getRandomWiggledValue(2, 1);
			this._fExplosionsTimers_t_arr.push(new Timer(()=>{
				lExplosion_spr.show();
				lExplosion_spr.play();
			}, lDelay_num));
		}
	}

	_tryEndAnimation()
	{
		for (let i = 0; i < this._fExplosionsTimers_t_arr.length; i++) {
			if(this._fExplosionsTimers_t_arr[i].isInProgress()) 
			{
				return;
			}
		}
		this.emit(FireBossDeathSmallExploasionsAnimation.EVENT_ON_ANIMATION_FINISH);
	}
	
	_interrupt()
	{

	}

	destroy()
	{
		if (this._fExplosionsTimers_t_arr && Array.isArray(this._fExplosionsTimers_t_arr))
		{
			for (let l_t of this._fExplosionsTimers_t_arr)
			{
				l_t && !l_t.destroy && l_t.destructor();
			}
		}
		this._fExplosionsTimers_t_arr = null;

		super.destroy();
	}
}

export default FireBossDeathSmallExploasionsAnimation;