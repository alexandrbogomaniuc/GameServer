import { APP } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../../../../shared/src/CommonConstants';
import { Utils } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import Timer from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import { AtlasSprite, Sprite } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import AtlasConfig from '../../../../../../config/AtlasConfig';

const LIGHTNING_PARAM =[
	{
		delay: 41,
		position: {x: -21.25, y: 65.85},
		rotation: 1.2234758056480248, //Utils.gradToRad(70.1)
		scale: {x: 2.694, y: 2.694}
	},
	{
		delay: 54,
		position: {x: -5.25, y: -62.15},
		rotation: 0.003490658503988659, //Utils.gradToRad(0.2)
		scale: {x: 2.694, y: 2.694}
	},
	{
		delay: 76,
		position: {x: -5.25, y: -62.15},
		rotation: 0.9930923443847735, //Utils.gradToRad(56.9)
		scale: {x: 2.694, y: 2.694}
	},
	{
		delay: 82,
		position: {x: 89.75, y: 41.85},
		rotation: 1.7435839227423353, //Utils.gradToRad(99.9)
		scale: {x: 2.294, y: 2.294}
	},
	{
		delay: 94,
		position: {x: -39.25, y: -67.15},
		rotation: 1.7435839227423353, //Utils.gradToRad(99.9)
		scale: {x: 1.734, y: 1.734}
	},
	{
		delay: 98,
		position: {x: 66.75, y: -64.15},
		rotation: -0.1605702911834783, //Utils.gradToRad(-9.2)
		scale: {x: 2.294, y: 2.294}
	}
];

let _lightning_ring_textures = null;
function _generateLightningPinkTextures()
{
	if (_lightning_ring_textures) return

	_lightning_ring_textures = AtlasSprite.getFrames(
		[
			APP.library.getAsset("boss_mode/lightning/main_smoke/lightning_ring")
		],
		[
			AtlasConfig.LightningBossLightningRing
		],
		"");
}

class LightningBossSmokeLightningsPinkAnimation extends Sprite
{
	static get EVENT_ON_ANIMATION_ENDED()				{return "onAnimationEnded";}

	i_startAnimation()
	{
		this._startAnimation();
	}

	constructor()
	{
		super();

		_generateLightningPinkTextures();
		
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
			this._fAnimationCount_num++;

			let lTimer = this._fStartTimer_arr[i] = new Timer(()=>{
				lTimer && lTimer.destructor();
				this._startLightningsOnce(i);
			}, LIGHTNING_PARAM[i].delay * FRAME_RATE, true);
		}
	}

	_startLightningsOnce(aIndex)
	{
		let param = LIGHTNING_PARAM[aIndex];
		let lLightning_spr = this._fLightnings_arr[aIndex] = this.addChild(new Sprite());

		lLightning_spr.textures = _lightning_ring_textures;
		lLightning_spr.animationSpeed = 0.5; // 30 / 60;
		lLightning_spr.blendMode = PIXI.BLEND_MODES.ADD;
	
		lLightning_spr.position.x = param.position.x; 
		lLightning_spr.position.y = param.position.y; 
		
		lLightning_spr.scale = param.scale;
		lLightning_spr.rotation =param.rotation;

		lLightning_spr.on('animationend', () => {
			lLightning_spr && lLightning_spr.destroy();
			lLightning_spr = null;
			this._fAnimationCount_num--;
			this._onAnimationCompletedSuspicison();
		});
		
		
		lLightning_spr.play();
	}
	
	_onAnimationCompletedSuspicison()
	{
		if (this._fAnimationCount_num == 0)
		{
			this._interruptAnimation();
			this.emit(LightningBossSmokeLightningsPinkAnimation.EVENT_ON_ANIMATION_ENDED);
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

export default LightningBossSmokeLightningsPinkAnimation;