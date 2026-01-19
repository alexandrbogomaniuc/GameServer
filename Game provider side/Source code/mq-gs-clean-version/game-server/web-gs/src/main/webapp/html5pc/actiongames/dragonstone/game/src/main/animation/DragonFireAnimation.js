import Sprite from '../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { AtlasSprite } from '../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import { Utils } from '../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import Timer from '../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import { FRAME_RATE } from '../../../../shared/src/CommonConstants';
import AtlasConfig from './../../config/AtlasConfig';
import CommonEffectsManager from './../CommonEffectsManager';

let _fireFlashTextures = null;
function _initFireFlashTextures()
{
	if (_fireFlashTextures) return;
	_fireFlashTextures = AtlasSprite.getFrames(APP.library.getAsset("boss_mode/boss_fire_flash"), AtlasConfig.BossFireFlash, "");
}

const FIRE_ITERATION = [
	{delay: 3*FRAME_RATE,	isSmoke: false,	pos: {x: 0, y: 0},		scale: {x: 8, y: 2}, angle: 0},
	{delay: 0*FRAME_RATE,	isSmoke: false,	pos: {x: 80, y: 0},		scale: {x: 8, y: 2.1}, angle: 0},
	{delay: 0.5*FRAME_RATE,	isSmoke: false,	pos: {x: 10, y: 2},		scale: {x: 8.1, y: 1.8}, angle: 0},
	{delay: 0*FRAME_RATE,	isSmoke: false,	pos: {x: 90, y: 2},		scale: {x: 8, y: 2}, angle: 0},

	{delay: 0*FRAME_RATE,	isSmoke: false,	pos: {x: 150, y: 0},	scale: {x: 7, y: 2}, angle: -8},
	{delay: 0*FRAME_RATE,	isSmoke: false,	pos: {x: 150, y: 2},	scale: {x: 7, y: 1.8}, angle: 8},
	{delay: 0*FRAME_RATE,	isSmoke: false,	pos: {x: 155, y: -2},	scale: {x: 6.9, y: 2}, angle: -5},
	{delay: 0*FRAME_RATE,	isSmoke: false,	pos: {x: 155, y: 4},	scale: {x: 7, y: 2}, angle: 5},
	{delay: 0*FRAME_RATE,	isSmoke: false,	pos: {x: 160, y: -3},	scale: {x: 7, y: 1.9}, angle: -2},
	{delay: 0*FRAME_RATE,	isSmoke: false,	pos: {x: 160, y: 1},	scale: {x: 7, y: 2}, angle: 2},

	{delay: 1*FRAME_RATE,	isSmoke: false,	pos: {x: 20, y: -2},	scale: {x: 8, y: 2}, angle: 0},
	{delay: 0*FRAME_RATE,	isSmoke: false,	pos: {x: 100, y: -2},	scale: {x: 7.9, y: 1.8}, angle: 0},
	{delay: 1.5*FRAME_RATE,	isSmoke: false,	pos: {x: 30, y: 4},		scale: {x: 8, y: 2}, angle: 0},
	{delay: 0*FRAME_RATE,	isSmoke: false,	pos: {x: 110, y: 4},	scale: {x: 8, y: 2}, angle: 0},

	{delay: 0*FRAME_RATE,	isSmoke: false,	pos: {x: 150, y: 0},	scale: {x: 7, y: 2}, angle: -8},
	{delay: 0*FRAME_RATE,	isSmoke: false,	pos: {x: 150, y: 2},	scale: {x: 7, y: 2}, angle: 8},
	{delay: 0*FRAME_RATE,	isSmoke: false,	pos: {x: 155, y: -2},	scale: {x: 7, y: 1.8}, angle: -5},
	{delay: 0*FRAME_RATE,	isSmoke: false,	pos: {x: 155, y: 4},	scale: {x: 7, y: 2}, angle: 5},
	{delay: 0*FRAME_RATE,	isSmoke: false,	pos: {x: 160, y: -3},	scale: {x: 7, y: 2.1}, angle: -2},
	{delay: 0*FRAME_RATE,	isSmoke: false,	pos: {x: 160, y: 1},	scale: {x: 7, y: 2}, angle: 2},

	{delay: 1*FRAME_RATE,	isSmoke: false,	pos: {x: 40, y: -3},	scale: {x: 8, y: 2}, angle: 0},
	{delay: 0*FRAME_RATE,	isSmoke: false,	pos: {x: 120, y: -3},	scale: {x: 8, y: 1.8}, angle: 0},
	{delay: 1.5*FRAME_RATE,	isSmoke: false,	pos: {x: 50, y: 1},		scale: {x: 8, y: 2}, angle: 0},
	{delay: 0*FRAME_RATE,	isSmoke: false,	pos: {x: 130, y: 1},	scale: {x: 8, y: 2}, angle: 0},

	{delay: 0*FRAME_RATE,	isSmoke: false,	pos: {x: 150, y: 0},	scale: {x: 7.1, y: 2.1}, angle: -8},
	{delay: 0*FRAME_RATE,	isSmoke: false,	pos: {x: 150, y: 2},	scale: {x: 6.9, y: 1.9}, angle: 8},
	{delay: 0*FRAME_RATE,	isSmoke: false,	pos: {x: 155, y: -2},	scale: {x: 6.8, y: 2}, angle: -5},
	{delay: 0*FRAME_RATE,	isSmoke: false,	pos: {x: 155, y: 4},	scale: {x: 7.1, y: 1.8}, angle: 5},
	{delay: 0*FRAME_RATE,	isSmoke: false,	pos: {x: 160, y: -3},	scale: {x: 7, y: 2}, angle: -2},
	{delay: 0*FRAME_RATE,	isSmoke: false,	pos: {x: 160, y: 1},	scale: {x: 7, y: 2}, angle: 2},
];

const SMOKES_ITERATION = [
	{delay: 1.5*FRAME_RATE,	isSmoke: true,	pos: {x: 80, y: 0},		scale: {x: 2, y: 4.5}, angle: 0},
	{delay: 0*FRAME_RATE,	isSmoke: true,	pos: {x: 210, y: 1},	scale: {x: 2, y: 5}, angle: 0},
	{delay: 0*FRAME_RATE,	isSmoke: true,	pos: {x: 160, y: 0},	scale: {x: 2, y: 5.2}, angle: 0},
	{delay: 0.5*FRAME_RATE,	isSmoke: true,	pos: {x: 90, y: 2},		scale: {x: 2.1, y: 5}, angle: 0},
	{delay: 0*FRAME_RATE,	isSmoke: true,	pos: {x: 170, y: 2},	scale: {x: 2, y: 5}, angle: 0},
	{delay: 1*FRAME_RATE,	isSmoke: true,	pos: {x: 100, y: -2},	scale: {x: 2, y: 5}, angle: 0},
	{delay: 0*FRAME_RATE,	isSmoke: true,	pos: {x: 190, y: 4},	scale: {x: 2, y: 5}, angle: 0},
	{delay: 1*FRAME_RATE,	isSmoke: true,	pos: {x: 120, y: -3},	scale: {x: 2, y: 5}, angle: 0},
	{delay: 1.5*FRAME_RATE,	isSmoke: true,	pos: {x: 130, y: 1},	scale: {x: 2, y: 5.5}, angle: 0},
	{delay: 0*FRAME_RATE,	isSmoke: true,	pos: {x: 210, y: 1},	scale: {x: 2, y: 5}, angle: 0},
];

var FIRES_CONFIG = [];
function _prepareConfig()
{
	for (let i = 0; i < 8; ++i)
	{
		FIRES_CONFIG = FIRES_CONFIG.concat(Object.assign([], FIRE_ITERATION));
	}

	FIRES_CONFIG = FIRES_CONFIG.concat(Object.assign([], SMOKES_ITERATION));
	FIRES_CONFIG = FIRES_CONFIG.concat(Object.assign([], SMOKES_ITERATION));
}

class DragonFireAnimation extends Sprite
{
	static get EVENT_ON_ANIMATION_FINISHED()			{return "onDragonFireAnimationFinished";}

	constructor()
	{
		super();

		_prepareConfig()
		_initFireFlashTextures();

		this._fTimer_t = null;
		this._container = this.addChild(new Sprite());
		this._container.rotation = Utils.gradToRad(125);
		this._container.position.set(260, -320);
		this._animsCounter = 0;

		this._startAnimation();
	}

	_startAnimation()
	{
		this._startNextFiresIteration(0);
	}

	_startNextFiresIteration(id)
	{
		this._fTimer_t && this._fTimer_t.destructor();
		this._fTimer_t = null;
		if (id >= FIRES_CONFIG.length) return;

		if (FIRES_CONFIG[id].isSmoke)
		{
			this._generateSmoke(FIRES_CONFIG[id].pos, FIRES_CONFIG[id].scale, FIRES_CONFIG[id].angle);
		}
		else
		{
			this._generateFire(FIRES_CONFIG[id].pos, FIRES_CONFIG[id].scale, FIRES_CONFIG[id].angle);
		}

		if (!FIRES_CONFIG[id].delay)
		{
			this._startNextFiresIteration(id+1);
		}
		else
		{
			this._fTimer_t = new Timer(()=>{
				this._startNextFiresIteration(id+1);
			}, FIRES_CONFIG[id].delay);
		}
	}

	_generateFire(pos, scale, angle)
	{
		let fire = this._container.addChild(new Sprite());
		fire.anchor.set(0, 0.5)
		fire.textures = _fireFlashTextures;
		fire.blendMode = PIXI.BLEND_MODES.ADD;
		fire.animationSpeed = 0.5;
		fire.position.set(pos.x, pos.y);
		fire.scale.set(scale.x, scale.y);
		fire.rotation = Utils.gradToRad(angle);
		++this._animsCounter;
		fire.once('animationend', () => {
			fire && fire.destroy();
			--this._animsCounter;
			this._tryToFinishAnimation();
		});
		fire.play();
	}

	_generateSmoke(pos, scale, angle)
	{
		let smoke = this._container.addChild(new Sprite());
		smoke.textures = CommonEffectsManager.getDieSmokeUnmultTextures();
		smoke.blendMode = PIXI.BLEND_MODES.SCREEN;
		smoke.animationSpeed = 0.5;
		smoke.anchor.set(0.57, 0.81);
		smoke.scale.set(scale.x, scale.y);
		smoke.position.set(pos.x, pos.y);
		smoke.rotation = Utils.gradToRad(angle+90);
		smoke.alpha = 0.5;
		++this._animsCounter;
		smoke.once('animationend', () => {
			smoke && smoke.destroy();
			--this._animsCounter;
			this._tryToFinishAnimation();
		})
		smoke.play();
	}

	_tryToFinishAnimation()
	{
		if (!this._fTimer_t && this._animsCounter <= 0)
		{
			this._onAnimationFinished();
		}
	}

	_onAnimationFinished()
	{
		this.emit(DragonFireAnimation.EVENT_ON_ANIMATION_FINISHED);
	}

	destroy()
	{
		this._fTimer_t && this._fTimer_t.destructor();
		this._fTimer_t = null;

		super.destroy();

		this._animsCounter = null;
		this._container = null;
	}
}
export default DragonFireAnimation;