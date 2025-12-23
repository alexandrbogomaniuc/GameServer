import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { AtlasSprite } from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/index';
import AtlasConfig from '../../../config/AtlasConfig';
import Timer from "../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer";
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../shared/src/CommonConstants';
import SpecterExplosionRings from './SpecterExplosionRings';
import LightningSpecterDisappearAnimation, {_final_splash_textures, _final_lightning_textures, _generateFinalSplashTextures, } from './LightningSpecterDisappearAnimation';

let _final_big_lightning_textures = null;
function _generateBigLightningTextures()
{
	if (_final_big_lightning_textures) return;

	_final_big_lightning_textures = AtlasSprite.getFrames([APP.library.getAsset("enemies/specter/lightning/big_lightning")], [AtlasConfig.LightningSpecterBigLightning], "");
}

class LightningSpecterKillAnimation extends LightningSpecterDisappearAnimation
{
	static get EVENT_ON_ANIMATION_ENDED()				{return "onAnimationEnded";}
	static get EVENT_ON_SPECTER_HIDE_REQUIRED()			{return "onSpecterHideRequired";}

	constructor()
	{
		super();
		_generateBigLightningTextures();

		// let debugBack = this.addChild(new PIXI.Graphics());
		// debugBack.beginFill(0x000000).drawRect(-960, -540, 960*2, 540*2).endFill();
		// let debugCent = debugBack.addChild(new PIXI.Graphics());
		// debugCent.beginFill(0xff0000).drawRect(-2, -2, 1, 1).endFill();

		this._fTimers_t_arr = [];
		this._fExterlLightningsSprite_arr = [];
	}

	_startAnimation()
	{
		APP.soundsController.play("mq_dragonstone_lightning_specter_death");
		this._hideSpecterRequired();
		this._startFinalSplash();
		this._startFinalLightning();
	}

	_startFinalSplash()
	{
		let l_spr = this.addChild(new Sprite());
		l_spr.textures = _final_splash_textures;
		l_spr.position.set(10, -46);
		l_spr.scale.set(5);
		l_spr.animationSpeed = 0.24;

		++this._animationsCounter;
		l_spr.once("animationend", ()=>{
			--this._animationsCounter;
			l_spr && l_spr.destroy();
			this._tryToCompleteAnimation();
		});
		l_spr.play();
	}

	_hideSpecterRequired()
	{
		this.emit(LightningSpecterDisappearAnimation.EVENT_ON_SPECTER_HIDE_REQUIRED);
	}

	_startFinalLightning()
	{
		let lExplosionRings_ser = this.addChild(new SpecterExplosionRings(SpecterExplosionRings.LIGHTNING_SPECTER_RINGS));
		lExplosionRings_ser.startAnimation(2*FRAME_RATE);

		let l_spr = this.addChild(new Sprite());
		l_spr.textures = _final_lightning_textures;
		l_spr.blendMode = PIXI.BLEND_MODES.SCREEN;
		l_spr.animationSpeed = 0.3;
		l_spr.scale.set(2);

		++this._animationsCounter;
		l_spr.once("animationend", ()=>{
			l_spr.destroy();
			--this._animationsCounter;
			this._tryToCompleteAnimation();
		});

		l_spr.play();

		this._startInternalLightnings();
		this._startExternalLightnings();

		APP.gameScreen.gameField.shakeTheGround("bossExplosion");
	}
	
	_startInternalLightnings()
	{
		const INTERNAL_LIGHTNINGS_ROTATIONS = [3, 4, 1.5, 5.5];
		const INTERNAL_LIGHTNINGS_DELAYS = [2*FRAME_RATE, 4*FRAME_RATE, 6*FRAME_RATE, 8*FRAME_RATE];

		for (let i = 0; i < 4; i++)
		{
			let l_spr = this.addChild(new Sprite());
			l_spr.textures = _final_big_lightning_textures;
			l_spr.blendMode = PIXI.BLEND_MODES.SCREEN;
			l_spr.rotation = INTERNAL_LIGHTNINGS_ROTATIONS[i];
			l_spr.anchor.set(0.1, 0.5);
			l_spr.scale.set(2);
			l_spr.animationSpeed = 0.5;

			++this._animationsCounter;
			l_spr.once("animationend", ()=>{
				l_spr.destroy();
				--this._animationsCounter;
				this._tryToCompleteAnimation();
			});
			this._fTimers_t_arr.push(new Timer(()=>l_spr.play(), INTERNAL_LIGHTNINGS_DELAYS[i]));
		}
	}

	_startExternalLightnings()
	{
		const EXTERNAL_LIGHTNINGS_ROTATIONS = [3.7, 2.3, 5.3];
		const EXTERNAL_LIGHTNINGS_DELAYS = [2*FRAME_RATE, 4*FRAME_RATE, 8*FRAME_RATE];
		const EXTERNAL_LIGHTNINGS_POSITIONS = [	{x: APP.config.size.width/2+150, 	y: APP.config.size.height/2+150},
												{x: APP.config.size.width/2+50,		y:-APP.config.size.height/2-50},
												{x:-APP.config.size.width/3-50, 	y: APP.config.size.height/2+250}
											];

		for (let i = 0; i < 3; i++)
		{
			let l_spr = APP.gameScreen.gameField.addChild(new Sprite());
			l_spr.textures = _final_big_lightning_textures;
			l_spr.blendMode = PIXI.BLEND_MODES.SCREEN;
			l_spr.rotation = EXTERNAL_LIGHTNINGS_ROTATIONS[i];
			l_spr.position.set(EXTERNAL_LIGHTNINGS_POSITIONS[i].x, EXTERNAL_LIGHTNINGS_POSITIONS[i].y);
			l_spr.anchor.set(0.1, 0.5);
			l_spr.scale.set(2);
			l_spr.animationSpeed = 0.5;

			++this._animationsCounter;
			l_spr.once("animationend", ()=>{
				l_spr.destroy();
				--this._animationsCounter;
				this._tryToCompleteAnimation();
			});
			this._fTimers_t_arr.push(new Timer(()=>l_spr.play(), EXTERNAL_LIGHTNINGS_DELAYS[i]));
			this._fExterlLightningsSprite_arr[i] = l_spr;
		}
	}

	_tryToCompleteAnimation()
	{
		if (this._animationsCounter <= 0)
		{
			this._onAnimationEnded();
		}
	}

	destroy()
	{
		super.destroy();
		Timer.destroy(this._fTimers_t_arr);

		for (let i = 0; i < 3; i++)
		{
			this._fExterlLightningsSprite_arr[i] && this._fExterlLightningsSprite_arr[i].destroy();
		}

		this._fExterlLightningsSprite_arr = null;
		this._animationsCounter = null;
	}
}

export default LightningSpecterKillAnimation;