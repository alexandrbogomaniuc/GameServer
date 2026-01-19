import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { AtlasSprite } from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/index';
import AtlasConfig from '../../../config/AtlasConfig';
import * as Easing from '../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import Timer from "../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer";
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../shared/src/CommonConstants';

export let _final_splash_textures = null;
export function _generateFinalSplashTextures()
{
	if (_final_splash_textures) return;

	_final_splash_textures = AtlasSprite.getFrames([APP.library.getAsset("enemies/specter/png_assets-0"), APP.library.getAsset("enemies/specter/png_assets-1")], [AtlasConfig.SpecterPngAssets0, AtlasConfig.SpecterPngAssets1], "final_splash");
}

export let _final_lightning_textures = null;
export function _generateFinalLightningTextures()
{
	if (_final_lightning_textures) return;

	_final_lightning_textures = AtlasSprite.getFrames([APP.library.getAsset("enemies/specter/lightning/final_lightning_explosion")], [AtlasConfig.SpecterFinalLightningExplosion], "");
}

class LightningSpecterDisappearAnimation extends Sprite
{
	static get EVENT_ON_ANIMATION_ENDED()				{return "onAnimationEnded";}
	static get EVENT_ON_SPECTER_HIDE_REQUIRED()			{return "onSpecterHideRequired";}

	i_startAnimation()
	{
		this._startAnimation();
	}

	constructor()
	{
		super();

		_generateFinalSplashTextures();
		_generateFinalLightningTextures();

		// let debugBack = this.addChild(new PIXI.Graphics());
		// debugBack.beginFill(0x000000).drawRect(-960, -540, 960*2, 540*2).endFill();
		// let debugCent = debugBack.addChild(new PIXI.Graphics());
		// debugCent.beginFill(0xff0000).drawRect(-2, -2, 1, 1).endFill();

		this._animationsCounter = 0;
	}

	_startAnimation()
	{
		this._startFinalSplash();
		this._timer = new Timer(()=>this._hideSpecterRequired(), 2*FRAME_RATE);
	}

	_startFinalSplash()
	{
		let anim = this.addChild(new Sprite());
		anim.textures = _final_splash_textures;
		anim.blendMode = PIXI.BLEND_MODES.ADD;
		anim.position.set(0, -46);
		anim.scale.set(2);
		anim.animationSpeed = 24/60;

		++this._animationsCounter;
		anim.on("changeframe", ()=>{
			if (anim && anim.currentFrame >= 10)
			{
				anim.animationSpeed = 0.25;
				anim.off("changeframe");
			}
		});
		anim.once("animationend", ()=>{
			--this._animationsCounter;
			anim && anim.destroy();
			this._tryToCompleteAnimation();
		});
		anim.play();
	}

	_hideSpecterRequired()
	{
		this._destroyTimer();

		this.emit(LightningSpecterDisappearAnimation.EVENT_ON_SPECTER_HIDE_REQUIRED);

		this._timer = new Timer(()=>this._startFinalLightning(), 4*FRAME_RATE);
	}

	_startFinalLightning()
	{
		this._destroyTimer();

		let anim = this.addChild(new Sprite());
		anim.textures = _final_lightning_textures;
		anim.blendMode = PIXI.BLEND_MODES.ADD;
		anim.scale.set(2);
		anim.position.set(-16, -10);
		anim.animationSpeed = 24/60;

		++this._animationsCounter;
		anim.once("animationend", ()=>{
			anim.gotoAndStop(4);
			anim.fadeTo(0, 14*FRAME_RATE, Easing.quadratic.easeIn, ()=>{
				--this._animationsCounter;
				anim && anim.destroy();
				this._tryToCompleteAnimation();
			});
		});
		anim.play();

		APP.gameScreen.gameField.shakeTheGround("bossExplosion");
	}

	_tryToCompleteAnimation()
	{
		if (this._animationsCounter <= 0 && !this._timer)
		{
			this._onAnimationEnded();
		}
	}

	_destroyTimer()
	{
		this._timer && this._timer.destructor();
		this._timer = null;
	}

	_onAnimationEnded()
	{
		this.emit(LightningSpecterDisappearAnimation.EVENT_ON_ANIMATION_ENDED);
	}

	destroy()
	{
		this._destroyTimer();

		super.destroy();

		this._animationsCounter = null;
	}
}

export default LightningSpecterDisappearAnimation;