
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import AtlasSprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import AtlasConfig from '../../../../config/AtlasConfig';
import { FRAME_RATE } from '../../../../../../shared/src/CommonConstants';
import Timer from "../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer";
import { Utils } from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';

let appearing_smoke_textures = null;
export function generateAppearingSmokeTextures()
{
	if (!appearing_smoke_textures)
	{
		appearing_smoke_textures = AtlasSprite.getFrames(APP.library.getAsset("boss_mode/fire/appearing_smoke/smoke"), AtlasConfig.FireBossAppearingSmoke, "");
	}
	return appearing_smoke_textures;
}

const SMOKE_COUNT = 6;

const SMOKE_PARAM = [
	{x: -113.5, y: 165, delay: 0, rotation: -0.9250245035569946, scale_x: -2.422, scale_y: 3.448}, //x: -227/2, y: 330/2,  rotation: -53, scale_x: -1.211*2, scale_y: 1.724*2
	{x: -204,   y: 150.5, delay: 0, rotation:   0, scale_x: -1.888, scale_y: 2.508}, //x: -408/2, y: 301/2,  scale_x: -0.944*2, scale_y: 1.254*2
	{x: -204,   y: 150.5, delay: 0, rotation:   0, scale_x: -1.888, scale_y: 2.508}, //x: -408/2, y: 301/2   scale_x: -0.944*2, scale_y: 1.254*2
	{x:  248.5, y: 111.5, delay: 7, rotation: -0.9250245035569946, scale_x: -2.422, scale_y: 3.448}, //x:  497/2, y: 223/2,  rotation: -53, scale_x: -1.211*2, scale_y: 1.724*2
	{x:  240,   y: 125, delay: 7, rotation:   0, scale_x: -1.888, scale_y: 2.708}, //x:  480/2, y: 250/2,  scale_x: -0.944*2, scale_y: 1.354*2
	{x:  240,   y: 125, delay: 7, rotation:   0, scale_x: -1.888, scale_y: 2.708} //x:  480/2, y: 250/2,   scale_x: -0.944*2, scale_y: 1.354*2
]

class AppearingSmokeAnimation extends Sprite
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

		generateAppearingSmokeTextures();

		this._fSmokeCount_num = 0;
		this._fStartTimer_t_arr = [];
		this._fSmokeAnimation_arr = [];
	}

	_startAnimation()
	{
		this._fSmokeCount_num = 0;
		for (let i = 0; i < SMOKE_PARAM.length; i++)
		{
			this._fStartTimer_t_arr[i] = new Timer(() =>
			{
				this._fSmokeAnimation_arr[i] = this._startSmokeAnimation(SMOKE_PARAM[i]);
			}, SMOKE_PARAM[i].delay * FRAME_RATE);
		}
	}

	_startSmokeAnimation(aParam)
	{
		const lSmoke_spr = this.addChild(new Sprite());
		lSmoke_spr.position.set(aParam.x, aParam.y);
		lSmoke_spr.scale.set(aParam.scale_x, aParam.scale_y);
		lSmoke_spr.rotation = aParam.rotation;
		lSmoke_spr.textures = appearing_smoke_textures;
		lSmoke_spr.animationSpeed = 0.5; //30 / 60
		lSmoke_spr.play();
		lSmoke_spr.on('animationend', () =>
		{
			lSmoke_spr.destroy();
			this._checkAnimationFinish();
		});

		return lSmoke_spr;
	}

	_checkAnimationFinish()
	{
		this._fSmokeCount_num++;
		if (this._fSmokeCount_num == SMOKE_COUNT)
		{
			this.emit(AppearingSmokeAnimation.EVENT_ON_ANIMATION_FINISH);
		}
	}

	_interrupt()
	{
		this._fSmokeCount_num = 0;
		for (let i = 0; i < SMOKE_PARAM.length; i++)
		{
			this._fStartTimer_t_arr[i] && this._fStartTimer_t_arr[i].destructor();
			this._fSmokeAnimation_arr[i] && this._fSmokeAnimation_arr[i].destroy();
		}
		this._fStartTimer_t_arr = [];
		this._fSmokeAnimation_arr = [];
	}

	destroy()
	{
		super.destroy();

		this._interrupt();
		this._fSmokeCount_num = null;
	}
}

export default AppearingSmokeAnimation;