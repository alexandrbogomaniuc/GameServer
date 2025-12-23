import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../../../shared/src/CommonConstants';
import Sprite from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import AtlasConfig from './../../../../../config/AtlasConfig';
import { AtlasSprite } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import { Utils } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import Timer from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';

let _fireFlashTextures = null;
function _initFireFlashTextures()
{
	if (_fireFlashTextures) return;
	_fireFlashTextures = AtlasSprite.getFrames(APP.library.getAsset("boss_mode/boss_fire_flash"), AtlasConfig.BossFireFlash, "");
}

const FIRES_DELAYS = [
	0*FRAME_RATE,
	7*FRAME_RATE,
	7*FRAME_RATE,
	7*FRAME_RATE,
	7*FRAME_RATE,
	7*FRAME_RATE,
	7*FRAME_RATE,
	7*FRAME_RATE
];

class FiresFlashAnimation extends Sprite
{
	static get EVENT_ON_FIRES_FLASH_ANIMATION_ENDED()			{return "onFiresFlashAnimationEnded";}

	static get TYPES() {
		return {
			NORMAL: 1,
			SIDES: 2
		}
	}

	startAnimation(disappearExTime)
	{
		this._startAnimation(disappearExTime);
	}

	constructor(aType_num=FiresFlashAnimation.TYPES.NORMAL)
	{
		super();

		_initFireFlashTextures();

		this._fType_num = aType_num;

		this._fTimer_t = null;
		this._firesCounter = 0;
	}

	_startAnimation(disappearExTime)
	{
		let i = 0;
		if (disappearExTime)
		{
			while (disappearExTime > 0 && i < FIRES_DELAYS.length)
			{
				disappearExTime -= FIRES_DELAYS[i];
				++i;
			}
		}

		if (i < FIRES_DELAYS.length)
		{
			this._startNextFiresIteration(i);
		}
		else
		{
			this._tryToFinishAnimation();
		}
	}

	_startNextFiresIteration(id)
	{
		this._fTimer_t && this._fTimer_t.destructor();
		this._fTimer_t = null;
		if (id >= FIRES_DELAYS.length) return;

		this._startNextFires();

		this._fTimer_t = new Timer(()=>{
			this._startNextFiresIteration(id+1);
		}, FIRES_DELAYS[id]);
	}

	_startNextFires()
	{
		switch (this._fType_num)
		{
			case FiresFlashAnimation.TYPES.NORMAL:
				this._generateFire({x: 140-50, y: 270}, 1);
				this._generateFire({x: 480+30, y: 270}, -1);
				this._generateFire({x: 820+50, y: 270}, -1);
				break;

			case FiresFlashAnimation.TYPES.SIDES:
				this._generateFire({x: 0-50, y: 270}, 1);
				this._generateFire({x: 960+50, y: 270}, -1);
				break;
		}
	}

	_generateFire(pos, scaleY = 1)
	{
		let fire = this.addChild(new Sprite());
		fire.textures = _fireFlashTextures;
		fire.rotation = Utils.gradToRad(-90);
		fire.blendMode = PIXI.BLEND_MODES.SCREEN;
		fire.animationSpeed = 0.25;
		fire.position.set(pos.x, pos.y);
		fire.scale.set(18);
		fire.scale.y *= scaleY;
		++this._firesCounter;
		fire.once('animationend', () => {
			fire && fire.destroy();
			--this._firesCounter;
			this._tryToFinishAnimation();
		});
		fire.play();
	}

	_tryToFinishAnimation()
	{
		if (!this._fTimer_t && this._firesCounter <= 0)
		{
			this._onAnimationEnded();
		}
	}

	_onAnimationEnded()
	{
		this.emit(FiresFlashAnimation.EVENT_ON_FIRES_FLASH_ANIMATION_ENDED);
	}

	destroy()
	{
		this._fType_num = undefined;

		this._fTimer_t && this._fTimer_t.destructor();
		this._fTimer_t = null;

		super.destroy();

		this._firesCounter = null;
	}
}

export default FiresFlashAnimation;