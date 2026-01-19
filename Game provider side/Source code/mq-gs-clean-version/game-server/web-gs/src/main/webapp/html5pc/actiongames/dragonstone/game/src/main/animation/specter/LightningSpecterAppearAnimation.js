import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { AtlasSprite } from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/index';
import AtlasConfig from '../../../config/AtlasConfig';
import Timer from "../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer";
import { Utils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../shared/src/CommonConstants';

let _lightning_splash_textures = null;
function _generateLightningSplashTextures()
{
	if (_lightning_splash_textures) return;

	_lightning_splash_textures = AtlasSprite.getFrames([APP.library.getAsset("enemies/specter/lightning/lightning_splash")], [AtlasConfig.LightningSpecterSplash], "");
}

let _smoke_textures = null;
function _generateSmokeTextures()
{
	if (_smoke_textures) return;

	_smoke_textures = AtlasSprite.getFrames([APP.library.getAsset("enemies/specter/fire/smoke")], [AtlasConfig.FireSpecterSmoke], "");
}

let _lightning_explode_textures = null;
function _generateLightningExplodeTextures()
{
	if (_lightning_explode_textures) return;

	_lightning_explode_textures = AtlasSprite.getFrames([APP.library.getAsset("enemies/specter/lightning/intro_lightning")], [AtlasConfig.SpecterIntroLightning], "");
}

const SPLASHES_CONFIG = [
	{x: 0, y: 0, scaleX: 1.8, scaleY: 1.8, delay: 6*FRAME_RATE},
	{x: -20, y: 20, scaleX: 1.8, scaleY: 1.8, delay: 7*FRAME_RATE},
	{x: 10, y: 10, scaleX: 1.8, scaleY: 1.8, delay: 7*FRAME_RATE},
	{x: -15, y: -15, scaleX: 2.5, scaleY: 2.5, delay: 28*FRAME_RATE},
	{x: 0, y: 0, scaleX: 3.2, scaleY: 3.2, delay: 11*FRAME_RATE}
];

const SMOKES_CONFIG = [
	{x: 105, y: -85, scaleX: 2, scaleY: 2, delay: 0*FRAME_RATE},
	{x: -20, y: 20, scaleX: 0.3, scaleY: 0.3, delay: 5*FRAME_RATE},
	{x: 17+15, y: 0-12, scaleX: 0.3, scaleY: 0.3, delay: 0*FRAME_RATE},
	{x: -10+15, y: -7-12, scaleX: 0.3, scaleY: 0.3, delay: 0*FRAME_RATE},
	{x: 0+15, y: -10-12, scaleX: 0.3, scaleY: 0.3, delay: 0*FRAME_RATE},
	{x: 10+15, y: -7-12, scaleX: 0.3, scaleY: 0.3, delay: 0*FRAME_RATE},
	{x: -10+15, y: 7-12, scaleX: 0.3, scaleY: 0.3, delay: 0*FRAME_RATE},
	{x: 0+15, y: 10-12, scaleX: 0.3, scaleY: 0.3, delay: 0*FRAME_RATE},
	{x: 10+15, y: 7-12, scaleX: 0.3, scaleY: 0.3, delay: 0*FRAME_RATE}
];

class LightningSpecterAppearAnimation extends Sprite
{
	static get EVENT_ON_ANIMATION_ENDED()				{return "onAnimationEnded";}
	static get EVENT_ON_SPECTER_APPEAR_REQUIRED()		{return "onSpecterAppearRequired";}

	startAnimation()
	{
		this._startAnimation();
	}

	constructor()
	{
		super();

		_generateLightningSplashTextures();
		_generateSmokeTextures();
		_generateLightningExplodeTextures();

		// let debugBack = this.addChild(new PIXI.Graphics());
		// debugBack.beginFill(0x000000).drawRect(-960, -540, 960*2, 540*2).endFill();
		// let debugCent = debugBack.addChild(new PIXI.Graphics());
		// debugCent.beginFill(0xff0000).drawRect(-2, -2, 1, 1).endFill();

		this._splashTimer = null;
		this._smokeTimer = null;
		this._explodeTimer = null;
		this._glow = null;
		this._animationsCounter = 0;
	}

	_startAnimation()
	{
		this._startGroundGlow();

		this._smokeTimer = new Timer(()=>this._startNextSmokeAnim(SMOKES_CONFIG[0], 1), SMOKES_CONFIG[0].delay);
		this._splashTimer = new Timer(()=>this._startNextSplashAnim(SPLASHES_CONFIG[0], 1), SPLASHES_CONFIG[0].delay);

		let lExplosionDelay_num = SPLASHES_CONFIG.reduce((accumulated, current) => accumulated + current.delay, 0) + 6*FRAME_RATE;
		this._explodeTimer = new Timer(()=>this._startExplosion(), lExplosionDelay_num);
	}

	_startGroundGlow()
	{
		this._glow = this.addChild(APP.library.getSprite("enemies/specter/lightning/ground_glow"));
		this._glow.blendMode = PIXI.BLEND_MODES.SCREEN;
		this._glow.position.set(0, 0);
		this._glow.scale.set(2);
		this._glow.alpha = 0;

		let seq = [
			{tweens: [{prop: "alpha", to: 1}],	duration: 27*FRAME_RATE},
			{tweens: [],						duration: 2*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0}],	duration: 11*FRAME_RATE, onfinish: ()=>{
				this._glow && this._glow.destroy();
				this._glow = null;

				this._tryToCompleteAnimation();
			}}
		];
		Sequence.start(this._glow, seq);
	}

	_startNextSmokeAnim(conf, nextId)
	{
		this._smokeTimer && this._smokeTimer.destructor();
		this._smokeTimer = null;

		let smoke = this.addChild(new Sprite());
		smoke.textures = _smoke_textures.slice(0, 50);
		smoke.blendMode = PIXI.BLEND_MODES.SCREEN;
		smoke.position.set(conf.x, conf.y);
		smoke.scale.set(conf.scaleX, conf.scaleY);
		smoke.animationSpeed = Utils.random(0.45, 0.55, true);

		++this._animationsCounter;
		smoke.once("animationend", ()=>{
			--this._animationsCounter;
			smoke && smoke.destroy();
			this._tryToCompleteAnimation();
		});
		smoke.play();

		if (!SMOKES_CONFIG[nextId])
		{
			this._tryToCompleteAnimation();
			return;
		}

		if (SMOKES_CONFIG[nextId].delay)
		{
			this._smokeTimer = new Timer(()=>this._startNextSmokeAnim(SMOKES_CONFIG[nextId], nextId+1), SMOKES_CONFIG[nextId].delay);
		}
		else
		{
			this._startNextSmokeAnim(SMOKES_CONFIG[nextId], nextId+1);
		}
	}

	_startNextSplashAnim(conf, nextId)
	{
		this._splashTimer && this._splashTimer.destructor();
		this._splashTimer = null;

		let splash = this.addChild(new Sprite());
		splash.textures = _lightning_splash_textures;
		splash.blendMode = PIXI.BLEND_MODES.SCREEN;
		splash.position.set(conf.x, conf.y);
		splash.scale.set(conf.scaleX, conf.scaleY);
		splash.anchor.set(0.54, 0.37);

		++this._animationsCounter;
		splash.on("changeframe", ()=>{
			if (splash.currentFrame >= 4)
			{
				splash.animationSpeed = 0.2;
				splash.off("changeframe");
			}
		});
		splash.once("animationend", ()=>{
			--this._animationsCounter;
			splash && splash.destroy();
			this._tryToCompleteAnimation();
		});
		splash.play();

		if (!SPLASHES_CONFIG[nextId])
		{
			this._tryToCompleteAnimation();
			return;
		}

		if (SPLASHES_CONFIG[nextId].delay)
		{
			this._splashTimer = new Timer(()=>this._startNextSplashAnim(SPLASHES_CONFIG[nextId], nextId+1), SPLASHES_CONFIG[nextId].delay);
		}
		else
		{
			this._startNextSplashAnim(SPLASHES_CONFIG[nextId], nextId+1);
		}
	}

	_startExplosion()
	{
		this._explodeTimer && this._explodeTimer.destructor();
		this._explodeTimer = null;
		APP.soundsController.play("mq_dragonstone_lightning_specter_spawn")

		let explodeAnim = this.addChild(new Sprite());
		explodeAnim.textures = _lightning_explode_textures;
		explodeAnim.blendMode = PIXI.BLEND_MODES.SCREEN;
		explodeAnim.scale.set(3.5);
		explodeAnim.anchor.set(0.5, 0.8);
		explodeAnim.animationSpeed = 0.5;

		++this._animationsCounter;
		explodeAnim.on("changeframe", ()=>{
			if (explodeAnim.currentFrame >= 3)
			{
				this.emit(LightningSpecterAppearAnimation.EVENT_ON_SPECTER_APPEAR_REQUIRED);
				explodeAnim.off("changeframe");
			}
		});
		explodeAnim.once("animationend", ()=>{
			--this._animationsCounter;
			explodeAnim && explodeAnim.destroy();
			explodeAnim = null;
			this._tryToCompleteAnimation();
		});
		explodeAnim.play();
	}

	_tryToCompleteAnimation()
	{
		if (!this._animationsCounter && !this._splashTimer && !this._smokeTimer && !this._explodeTimer && !this._glow)
		{
			this._onAnimationEnded();
		}
	}

	_onAnimationEnded()
	{
		this.emit(LightningSpecterAppearAnimation.EVENT_ON_ANIMATION_ENDED);
	}

	destroy()
	{
		this._splashTimer && this._splashTimer.destructor();
		this._splashTimer = null;

		this._smokeTimer && this._smokeTimer.destructor();
		this._smokeTimer = null;

		this._explodeTimer && this._explodeTimer.destructor();
		this._explodeTimer = null;

		if (this._glow)
		{
			Sequence.destroy(Sequence.findByTarget(this._glow));
			this._glow.destroy();
			this._glow = null;
		}

		super.destroy();

		this._animationsCounter = null;
	}
}

export default LightningSpecterAppearAnimation;