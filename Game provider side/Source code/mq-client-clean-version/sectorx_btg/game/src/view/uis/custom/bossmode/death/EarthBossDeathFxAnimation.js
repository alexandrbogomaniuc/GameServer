import { Sprite } from "../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display";
import { FRAME_RATE } from '../../../../../../../shared/src/CommonConstants';
import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sequence from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import * as Easing from '../../../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { Utils } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import AtlasConfig from '../../../../../config/AtlasConfig';
import { AtlasSprite } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import EarthMediumStoneRock from '../animation/EarthMediumStoneRock';
import EarthSmallStoneRock from '../animation/EarthSmallStoneRock';
import * as easing from '../../../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import BossDeathFxAnimation from './BossDeathFxAnimation';

function _crateStoneExplosion0Textures()
{
	return AtlasSprite.getFrames(APP.library.getAsset("boss_mode/earth/stone_explosion_0"), AtlasConfig.Stone0Explosion, "");
}

function _crateFlameExplosionTextures()
{
	return AtlasSprite.getFrames(
	 [APP.library.getAsset("boss_mode/common/flame_explosion_1"), APP.library.getAsset("boss_mode/common/flame_explosion_2")],
	 [AtlasConfig.Flame1,	AtlasConfig.Flame2], "");
}

class EarthBossDeathFxAnimation extends BossDeathFxAnimation
{
	constructor()
	{
		super();
		this._fSmoke_sprt_arr = [];
		this._fLight_sprt_arr = [];
		this._fEarthSmallStone_emsr_arr = [];
		this._fDarkBackground_g = null;
		this._fOpticalFlare_spr = null;

		this._fBottomContainer_spr = this.bossDissappearingBottomFXContainerInfo.container.addChild(new Sprite());

		this._fUpperContiner_spr = this.bossDissappearingUpperFXContainerInfo.container.addChild(new Sprite());		
		this._fUpperContiner_spr.position.set(APP.config.size.width/2, APP.config.size.height/2);

		this._fLightParticle_spr = null;
		this._fFlame_spr_arr = [];
		this._fParticles_arr = [];

		this._fLightParticleAnimation_spr_arr = [];
		this._fLightAnimation_spr_arr = [];
		this._fLightParticleYellowAnimation_spr_arr = [];
		this._fLightCircleAnimation_spr_arr = [];

		this._fLight1_spr = null;
		this._fLightCircle1_spr = null;
		this._fLight2_spr = null;
		this._fLightCircle2_spr = null;
		this._fLight3_spr = null;
		this._fLightCircle3_spr = null;
		this._fLight4_spr = null;

		this._fSmokeTrailAnimation_emsr_arr = [];

		this._fLightParticleYellow_sprt_arr = [];
		this._fExplosionAnimationSmoke_spr_arr = [];
		this._fMediumStoneAnimation_emsr_arr = [];
		this._fSmallStoneAnimation_emsr_arr = [];
		this._fSmoke6_spr_arr = [];
		this._fOrangeSmoke_spr_arr = [];
		this._fParticles_spr_arr = [];
		this._fLight_spr_arr = [];
		this._fLightCircle_sprt  = null;
		this._fSecondLightCircle_sprt = null;
		this._fFinalLight_sprt = null;
		this._fFinalLight2_sprt = null;
		this._fFinalLightCircle1_sprt = null;
		this._fFinalLightCircle2_sprt = null;
		this._fFinalLight3_sprt = null;
		this._fFinalLightCircle3_sprt = null;
		this._fFinalLightparticle_sprt = null;
	}

	i_startAnimation(aZombieView_e)
	{
		this._startAnimation(aZombieView_e);
	}

	get bossDissappearingBottomFXContainerInfo()
	{
		return APP.gameScreen.gameFieldController.bossDissappearingBottomFXContainerInfo;
	}

	get bossDissappearingUpperFXContainerInfo()
	{
		return APP.gameScreen.gameFieldController.bossDissappearingUpperFXContainerInfo;
	}

	get _defeatedCaptionTime()
	{
		return 98 * FRAME_RATE;
	}

	_startAnimation(aZombieView_e)
	{
		super._startAnimation(aZombieView_e);

		let lOffsetPosition_obj = this.globalToLocal(this._fBottomContainer_spr.getGlobalPosition().x, this._fBottomContainer_spr.getGlobalPosition().y);
		this._fBottomContainer_spr.zIndex = lOffsetPosition_obj.y - 100; //because spine will be moved
		this._fBottomContainer_spr.x = -lOffsetPosition_obj.x;
		this._fBottomContainer_spr.y = -lOffsetPosition_obj.y;

		this._fUpperContiner_spr.zIndex = lOffsetPosition_obj.y; //because spine will be moved
		
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startBackgroundAnimation();
			this._startOpticalFlareAnimation();
		}

		this._startMiniExplosiosion();
		this._startStoneExplosionAnimation();

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startExplosionAnimation();
		}

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startLightCircleAnimation();
		}

		this._startSmokeTrailAnimation();
		this._startMediumStoneAnimation();

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startSmallStoneAnimation();
		}
	}

	_startBackgroundAnimation()
	{
		this._fLightParticle_spr = APP.gameScreen.gameFieldController.screenField.addChild(APP.library.getSprite("common/light_particle"));
		this._fLightParticle_spr.blendMode = PIXI.BLEND_MODES.ADD;
		this._fLightParticle_spr.alpha = 0;
		this._fLightParticle_spr.scale.set(10);
		this._fLightParticle_spr.position.set(0, -120);
		let l_seq = [
			{tweens: [{prop: "alpha", to: 1}], duration: 35*FRAME_RATE},
			{tweens: [], duration: 36*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0}], duration: 10*FRAME_RATE, onfinish: this._fLightParticle_spr.destroy.bind(this._fLightParticle_spr)},
		];
		Sequence.start(this._fLightParticle_spr, l_seq, 9*FRAME_RATE);
	}

	_startOpticalFlareAnimation()
	{
		//DARK BACKGRPUND...
		let lAPPSize_obj = APP.config.size;
		this._fDarkBackground_g = this._fUpperContiner_spr.addChild(new PIXI.Graphics());
		this._fDarkBackground_g.beginFill().drawRect(-lAPPSize_obj.width/2-50, -lAPPSize_obj.height/2-50, lAPPSize_obj.width+100, lAPPSize_obj.height+100).endFill();
		this._fDarkBackground_g.alpha = 0;
		this._fDarkBackground_g.zIndex = -100;
		let lBgAlphaSequence_arr = [
			{tweens: [{prop: "alpha", to: 0.3}], duration: 50*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.4}], duration: 28*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0}], duration: 13*FRAME_RATE},
		];
		Sequence.start(this._fDarkBackground_g, lBgAlphaSequence_arr);
		//...DARK BACKGRPUND

		this._fOpticalFlare_spr = this._fUpperContiner_spr.addChild(APP.library.getSprite("boss_mode/common/optical_flare_yellow"));
		this._fOpticalFlare_spr.blendMode = PIXI.BLEND_MODES.ADD;
		this._fOpticalFlare_spr.zIndex = this.bossDissappearingUpperFXContainerInfo.zIndex;
		this._fOpticalFlare_spr.alpha = 0.49;
		this._fOpticalFlare_spr.scale.set(2.1, -2.1);
		let l_seq = [
			{tweens: [{prop: "alpha", to: 0.78}], duration: 3*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.57}], duration: 2*FRAME_RATE},
			{tweens: [], duration: 1*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.75}], duration: 2*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.59}], duration: 3*FRAME_RATE},
			{tweens: [], duration: 1*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.63}], duration: 1*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.48}], duration: 2*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.76}], duration: 3*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.69}], duration: 2*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.71}], duration: 1*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.67}], duration: 1*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.81}], duration: 3*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.53}], duration: 4*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.75}], duration: 3*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.68}], duration: 2*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.71}], duration: 1*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.69}], duration: 1*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.90}], duration: 2*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.63}], duration: 3*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.67}], duration: 1*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.65}], duration: 1*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.77}], duration: 3*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.57}], duration: 3*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.87}], duration: 3*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.57}], duration: 4*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.82}], duration: 3*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.78}], duration: 1*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.90}], duration: 2*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.79}], duration: 3*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.94}], duration: 6*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.78}], duration: 3*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.94}], duration: 4*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.69}], duration: 3*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.84}], duration: 5*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.59}], duration: 3*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.69}], duration: 2*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.34}], duration: 5*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.62}], duration: 4*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.18}], duration: 8*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.36}], duration: 3*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.07}], duration: 3*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.16}], duration: 2*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.11}], duration: 1*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.12}], duration: 1*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.00}], duration: 2*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.05}], duration: 2*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.00}], duration: 1*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.17}], duration: 1*FRAME_RATE},
			{tweens: [], duration: 1*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.00}], duration: 1*FRAME_RATE, onfinish: this._fOpticalFlare_spr.destroy.bind(this._fOpticalFlare_spr)}
		];
		Sequence.start(this._fOpticalFlare_spr, l_seq);
	}

	_startMiniExplosiosion()
	{
		let lTimer_seq = [
			{tweens: [],duration: 2 * FRAME_RATE, onfinish: ()=> {
				let lMiniExplosion_sprt = this.addChild(this._startMiniExplosionAnimation());
				lMiniExplosion_sprt.position.set(97.5, -52); //150*0.65, -80*0.65
				lMiniExplosion_sprt.scale.set(0.65);
				lMiniExplosion_sprt.blendMode = PIXI.BLEND_MODES.ADD;
				this._moveSpineOnDeathMiniExplosion({x: 200, y: -30});
			}},
			{tweens: [],duration: 12 * FRAME_RATE, onfinish: ()=> {
				let lMiniExplosion_sprt = this.addChild(this._startMiniExplosionAnimation());
				lMiniExplosion_sprt.position.set(6.5, -88.4); //10*0.65, -136*0.65
				lMiniExplosion_sprt.scale.set(0.65);
				lMiniExplosion_sprt.blendMode = PIXI.BLEND_MODES.ADD;
				this._moveSpineOnDeathMiniExplosion({x: 60, y: -86});
			}},
			{tweens: [],duration: 5 * FRAME_RATE, onfinish: ()=> {
				let lMiniExplosion_sprt = this.addChild(this._startMiniExplosionAnimation());
				lMiniExplosion_sprt.position.set(-124.15, -116.36); //-191*0.65, -179*0.65
				lMiniExplosion_sprt.scale.set(0.65);
				lMiniExplosion_sprt.blendMode = PIXI.BLEND_MODES.ADD;
				this._moveSpineOnDeathMiniExplosion({x: -141, y: -129});
			}},
			{tweens: [],duration: 4 * FRAME_RATE, onfinish: ()=> {
				let lMiniExplosion_sprt = this.addChild(this._startMiniExplosionAnimation());
				lMiniExplosion_sprt.position.set(132.6, -158.6); //204*0.65, -244*0.65
				lMiniExplosion_sprt.scale.set(0.65);
				lMiniExplosion_sprt.blendMode = PIXI.BLEND_MODES.ADD;
				this._moveSpineOnDeathMiniExplosion({x: 254, y: -194});
			}},
			{tweens: [],duration: 6 * FRAME_RATE, onfinish: ()=> {
				let lMiniExplosion_sprt = this.addChild(this._startMiniExplosionAnimation());
				lMiniExplosion_sprt.position.set(128.7, 15.6); //198*0.65, 24*0.65
				lMiniExplosion_sprt.scale.set(0.65);
				lMiniExplosion_sprt.blendMode = PIXI.BLEND_MODES.ADD;
				this._moveSpineOnDeathMiniExplosion({x: 248, y: 74});
			}},
			{tweens: [],duration: 6 * FRAME_RATE, onfinish: ()=> {
				let lMiniExplosion_sprt = this.addChild(this._startMiniExplosionAnimation());
				lMiniExplosion_sprt.position.set(-1.3, -119.6); //-2*0.65, -184*0.65
				lMiniExplosion_sprt.scale.set(0.65);
				lMiniExplosion_sprt.blendMode = PIXI.BLEND_MODES.ADD;
				this._moveSpineOnDeathMiniExplosion({x: 48, y: -134});
			}},
			{tweens: [],duration: 10 * FRAME_RATE, onfinish: ()=> {
				let lMiniExplosion_sprt = this.addChild(this._startMiniExplosionAnimation());
				lMiniExplosion_sprt.position.set(141.9, -147.95); //258*0.55, -269*0.55
				lMiniExplosion_sprt.scale.set(0.55);
				lMiniExplosion_sprt.blendMode = PIXI.BLEND_MODES.ADD;
				this._moveSpineOnDeathMiniExplosion({x: 308, y: -219});
			}},
			{tweens: [],duration: 2 * FRAME_RATE, onfinish: ()=> {
				let lMiniExplosion_sprt = this.addChild(this._startMiniExplosionAnimation());
				lMiniExplosion_sprt.position.set(64.48, 5.642); //160*0.62, 14*0.62
				lMiniExplosion_sprt.scale.set(0.62);
				lMiniExplosion_sprt.blendMode = PIXI.BLEND_MODES.ADD;
				this._moveSpineOnDeathMiniExplosion({x: 210, y: 64});
			}},
			{tweens: [],duration: 5 * FRAME_RATE, onfinish: ()=> {
				let lMiniExplosion_sprt = this.addChild(this._startMiniExplosionAnimation());
				lMiniExplosion_sprt.position.set(-56.43, -19.8); //-171*0.6, -60*0.6
				lMiniExplosion_sprt.scale.set(0.6);
				lMiniExplosion_sprt.blendMode = PIXI.BLEND_MODES.ADD;
				this._moveSpineOnDeathMiniExplosion({x: -121, y: -10});
			}},
			{tweens: [],duration: 6 * FRAME_RATE, onfinish: ()=> {
				let lMiniExplosion_sprt = this.addChild(this._startMiniExplosionAnimation());
				lMiniExplosion_sprt.position.set(252, -90);
				lMiniExplosion_sprt.blendMode = PIXI.BLEND_MODES.ADD;
				this._moveSpineOnDeathMiniExplosion({x: 302, y: -40});
			}},
			{tweens: [],duration: 3 * FRAME_RATE, onfinish: ()=> {
				let lMiniExplosion_sprt = this.addChild(this._startMiniExplosionAnimation());
				lMiniExplosion_sprt.position.set(-12.896, -10.3168); //-40*0.8, -32*0.8
				lMiniExplosion_sprt.scale.set(0.8);
				lMiniExplosion_sprt.blendMode = PIXI.BLEND_MODES.ADD;
				this._moveSpineOnDeathMiniExplosion({x: 10, y: 18});
			}},
			{tweens: [],duration: 9 * FRAME_RATE, onfinish: ()=> {
				let lMiniExplosion_sprt = this.addChild(this._startMiniExplosionAnimation());
				lMiniExplosion_sprt.position.set(-183.3, -137.15); //-282*0.65, -211*0.65
				lMiniExplosion_sprt.scale.set(0.65);
				lMiniExplosion_sprt.blendMode = PIXI.BLEND_MODES.ADD;
				this._moveSpineOnDeathMiniExplosion({x: -232, y: -161});
			}},
			{tweens: [],duration: 6 * FRAME_RATE, onfinish: ()=> {
				let lMiniExplosion_sprt = this.addChild(this._startMiniExplosionAnimation());
				lMiniExplosion_sprt.position.set(24.75, -8.8); //45*0.55, -16*0.55
				lMiniExplosion_sprt.scale.set(0.55);
				lMiniExplosion_sprt.blendMode = PIXI.BLEND_MODES.ADD;
				this._moveSpineOnDeathMiniExplosion({x: 95, y: 34});
			}},
			{tweens: [],duration: 2 * FRAME_RATE, onfinish: ()=> {
				let lMiniExplosion_sprt = this.addChild(this._startMiniExplosionAnimation());
				lMiniExplosion_sprt.position.set(18.5328, -55.7766); //104*0.54, -313*0.54
				lMiniExplosion_sprt.scale.set(0.54);
				lMiniExplosion_sprt.blendMode = PIXI.BLEND_MODES.ADD;
				this._moveSpineOnDeathMiniExplosion({x: 154, y: -263});
			}},
			{tweens: [],duration: 4 * FRAME_RATE, onfinish: ()=> {
				let lMiniExplosion_sprt = this.addChild(this._startMiniExplosionAnimation());
				lMiniExplosion_sprt.position.set(-52.3908, 13.1868); //-294*0.54, 74*0.54
				lMiniExplosion_sprt.scale.set(0.54);
				lMiniExplosion_sprt.blendMode = PIXI.BLEND_MODES.ADD;
				this._moveSpineOnDeathMiniExplosion({x: -244, y: 124});

				if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
				{
					this._startFinalExplosion();
				}

				this.__onTimeToExplodeCoin();
			}},
		];
		
		Sequence.start(this, lTimer_seq);
	}

	_moveSpineOnDeathMiniExplosion(aPosition_obj)
	{
		this._fBossZombie_e && this._fBossZombie_e.moveSpineOnDeathMiniExplosion(aPosition_obj);
	}

	_startStoneExplosionAnimation()
	{
		let lContainer_sprt = this.addChild(new Sprite());
		
		this._startAnyMovAnimation(_crateStoneExplosion0Textures(), {x:-47,y:-206}, 0, 1, PIXI.BLEND_MODES.NORMAL, 14, lContainer_sprt);
		this._startAnyMovAnimation(_crateStoneExplosion0Textures(), {x:14,y:-194}, 0, 1, PIXI.BLEND_MODES.NORMAL, 32, lContainer_sprt);
		this._startAnyMovAnimation(_crateStoneExplosion0Textures(), {x:-143,y:-189}, 0, 1, PIXI.BLEND_MODES.NORMAL, 72, lContainer_sprt);

		lContainer_sprt.position.set(-50, -50);
	}

	_createSmoke(aName_srt, aScale, aAlpha)
	{
		let lSmoke = APP.library.getSprite(aName_srt);
		lSmoke.anchor.set(0.5, 0.5);
		lSmoke.scale.set(aScale);
		lSmoke.alpha = aAlpha;

		this._fSmoke_sprt_arr.push(lSmoke);
		return lSmoke;
	}

	_createLight(aName_srt, aScale = 1, aAlpha = 1)
	{
		let lLight = APP.library.getSprite(aName_srt);
		lLight.anchor.set(0.5, 0.5);
		lLight.scale.set(aScale);
		lLight.alpha = aAlpha;

		this._fLight_sprt_arr.push(lLight);
		return lLight;
	}

	_startExplosionAnimation()
	{
		let lContainer_sprt = this.addChild(new Sprite());
		//SMOKE...
		let lTimerSmoke_seq = [
			{tweens: [],duration: 3 * FRAME_RATE, onfinish: () => {
				let lSmoke = lContainer_sprt.addChild(this._createSmoke("boss_mode/earth/smoke_6", 2.15, 0.1));
				lSmoke.position.set(196, 332);
				lSmoke.rotation = 0; //Utils.gradToRad(0);
				this._fExplosionAnimationSmoke_spr_arr.push(lSmoke);

				let lSequanse_obj = this._createSmokeSpinSequanse({x:893, y:143}, -2.251474735072685, 2.46); //Utils.gradToRad(-129)
				Sequence.start(lSmoke, lSequanse_obj.position)
				Sequence.start(lSmoke, lSequanse_obj.scale)
				Sequence.start(lSmoke, lSequanse_obj.rotation)
				Sequence.start(lSmoke, lSequanse_obj.alpha)
			}},
			{tweens: [],duration: 1 * FRAME_RATE, onfinish: () => {
				let lSmoke = lContainer_sprt.addChild(this._createSmoke("boss_mode/earth/smoke_6", 1.19, 0.1));
				lSmoke.position.set(-151, 113);
				lSmoke.rotation = -0.6283185307179586; //Utils.gradToRad(-36);
				this._fExplosionAnimationSmoke_spr_arr.push(lSmoke);

				let lSequanse_obj = this._createSmokeSpinSequanse({x:-342, y:-235}, -2.3736477827122884, 1.50); //Utils.gradToRad(-136)
				Sequence.start(lSmoke, lSequanse_obj.position)
				Sequence.start(lSmoke, lSequanse_obj.scale)
				Sequence.start(lSmoke, lSequanse_obj.rotation)
				Sequence.start(lSmoke, lSequanse_obj.alpha)
			}},
			{tweens: [],duration: 1 * FRAME_RATE, onfinish: () => {
				let lSmoke = lContainer_sprt.addChild(this._createSmoke("boss_mode/earth/smoke_6", 1.95, 0.1));
				lSmoke.position.set(-176, 269);
				lSmoke.rotation = 0; //Utils.gradToRad(0);
				this._fExplosionAnimationSmoke_spr_arr.push(lSmoke);

				let lSequanse_obj = this._createSmokeSpinSequanse({x:-934, y:-62}, 1.9198621771937625, 2.25); //Utils.gradToRad(110)
				Sequence.start(lSmoke, lSequanse_obj.position)
				Sequence.start(lSmoke, lSequanse_obj.scale)
				Sequence.start(lSmoke, lSequanse_obj.rotation)
				Sequence.start(lSmoke, lSequanse_obj.alpha)
			}},
			{tweens: [],duration: 1 * FRAME_RATE, onfinish: () => {
				let lSmoke = lContainer_sprt.addChild(this._createSmoke("boss_mode/earth/smoke_6", 1.74, 0.1));
				lSmoke.position.set(-39, -42);
				lSmoke.rotation = 0; //Utils.gradToRad(0);
				this._fExplosionAnimationSmoke_spr_arr.push(lSmoke);

				let lSequanse_obj = this._createSmokeSpinSequanse({x:68, y:-293}, -0.6283185307179586, 2.05); //Utils.gradToRad(-36)
				Sequence.start(lSmoke, lSequanse_obj.position)
				Sequence.start(lSmoke, lSequanse_obj.scale)
				Sequence.start(lSmoke, lSequanse_obj.rotation)
				Sequence.start(lSmoke, lSequanse_obj.alpha)
			}},
			{tweens: [],duration: 1 * FRAME_RATE, onfinish: () => {
				let lSmoke = lContainer_sprt.addChild(this._createSmoke("boss_mode/earth/smoke_6", 2.02, 0.1));
				lSmoke.position.set(48, 213);
				lSmoke.rotation = -0.6283185307179586; //Utils.gradToRad(-36);
				this._fExplosionAnimationSmoke_spr_arr.push(lSmoke);

				let lSequanse_obj = this._createSmokeSpinSequanse({x:-436, y:625}, -2.3736477827122884, 2.33); //Utils.gradToRad(-136)
				Sequence.start(lSmoke, lSequanse_obj.position)
				Sequence.start(lSmoke, lSequanse_obj.scale)
				Sequence.start(lSmoke, lSequanse_obj.rotation)
				Sequence.start(lSmoke, lSequanse_obj.alpha)
			}},
			{tweens: [],duration: 2 * FRAME_RATE, onfinish: () => {
				let lSmoke = lContainer_sprt.addChild(this._createSmoke("boss_mode/earth/smoke_6", 1.19, 0.1));
				lSmoke.position.set(21, 124);
				lSmoke.rotation = 0; //Utils.gradToRad(0);
				this._fExplosionAnimationSmoke_spr_arr.push(lSmoke);

				let lSequanse_obj = this._createSmokeSpinSequanse({x:-4, y:91}, -0.6283185307179586, 1.5); //Utils.gradToRad(-36)
				Sequence.start(lSmoke, lSequanse_obj.position)
				Sequence.start(lSmoke, lSequanse_obj.scale)
				Sequence.start(lSmoke, lSequanse_obj.rotation)
				Sequence.start(lSmoke, lSequanse_obj.alpha)
			}},
		];

		let lTimerOrangeSmoke_seq = [
			{tweens: [],duration: 3 * FRAME_RATE, onfinish: () => {
				let lSmoke = lContainer_sprt.addChild(this._createSmoke("boss_mode/earth/smoke_orange", 1.13, 0.1));
				lSmoke.position.set(196, 332);
				lSmoke.rotation = 0; //Utils.gradToRad(0);
				this._fExplosionAnimationSmoke_spr_arr.push(lSmoke);

				let lSequanse_obj = this._createSmokeSpinSequanse({x:754, y:25}, -2.251474735072685, 1.44); //Utils.gradToRad(-129)
				Sequence.start(lSmoke, lSequanse_obj.position)
				Sequence.start(lSmoke, lSequanse_obj.scale)
				Sequence.start(lSmoke, lSequanse_obj.rotation)
				Sequence.start(lSmoke, lSequanse_obj.alpha)
			}},
			{tweens: [],duration: 2 * FRAME_RATE, onfinish: () => {
				let lSmoke = lContainer_sprt.addChild(this._createSmoke("boss_mode/earth/smoke_orange", 1.63, 0.1));
				lSmoke.position.set(49, 213);
				lSmoke.rotation = -0.6283185307179586; //Utils.gradToRad(-36);
				this._fExplosionAnimationSmoke_spr_arr.push(lSmoke);

				let lSequanse_obj = this._createSmokeSpinSequanse({x:444, y:509}, -2.3736477827122884, 1.94); //Utils.gradToRad(-136)
				Sequence.start(lSmoke, lSequanse_obj.position)
				Sequence.start(lSmoke, lSequanse_obj.scale)
				Sequence.start(lSmoke, lSequanse_obj.rotation)
				Sequence.start(lSmoke, lSequanse_obj.alpha)
			}},
			{tweens: [],duration: 2 * FRAME_RATE, onfinish: () => {
				let lSmoke = lContainer_sprt.addChild(this._createSmoke("boss_mode/earth/smoke_orange", 1.18, 0.1));
				lSmoke.position.set(-175, 269);
				lSmoke.rotation = 0; //Utils.gradToRad(0);
				this._fExplosionAnimationSmoke_spr_arr.push(lSmoke);

				let lSequanse_obj = this._createSmokeSpinSequanse({x:-829, y:320}, 1.9198621771937625, 1.49); //Utils.gradToRad(110)
				Sequence.start(lSmoke, lSequanse_obj.position)
				Sequence.start(lSmoke, lSequanse_obj.scale)
				Sequence.start(lSmoke, lSequanse_obj.rotation)
				Sequence.start(lSmoke, lSequanse_obj.alpha)
			}},
		];
		//...SMOKE

		lContainer_sprt.scale.set(0.4);
		lContainer_sprt.position.set(0, -200);
		
		let lTimer_seq = [
			{tweens: [],duration: 79 * FRAME_RATE, onfinish: ()=> {
				Sequence.start(this, lTimerSmoke_seq);
				Sequence.start(this, lTimerOrangeSmoke_seq);
				this._startLigthExplosionAnimation(lContainer_sprt);
			}}
		];
		Sequence.start(this, lTimer_seq);
	}

	_startLigthExplosionAnimation(aContainer_sprt)
	{
		//Light Yelow...
		let lStartSetting_0 = {
			position: {x: -19, y:-5},
			scale: 0.23,
			rotation: 0.10471975511965977, //Utils.gradToRad(6)
		};
		let lFinishSetting_0 = {
			position: {x: 768, y:-215},
			scale: 0.6,
			rotation: 1.0821041362364843, //Utils.gradToRad(62)
			delayAlpha: 17 
		}
		this._startLigthExplosionSingleAnimation(aContainer_sprt, "boss_mode/common/particles_yellow", lStartSetting_0, lFinishSetting_0);

		let lStartSetting_1 = {
			position: {x: -133, y:-5},
			scale: 0.13,
			rotation: 1.53588974175501, //Utils.gradToRad(88)
		};
		let lFinishSetting_1 = {
			position: {x: -725, y: -249},
			scale: 0.5,
			rotation: 2.600540585471551, //Utils.gradToRad(149)
			delayAlpha: 17 
		}
		this._startLigthExplosionSingleAnimation(aContainer_sprt, "boss_mode/common/particles_yellow", lStartSetting_1, lFinishSetting_1);
		
		let lStartSetting_2 = {
			position: {x: -284, y:103},
			scale: 0.36,
			rotation: 2.0594885173533086, //Utils.gradToRad(118)
		};
		let lFinishSetting_2 = {
			position: {x: -698, y: 398},
			scale: 0.73,
			rotation: 2.9670597283903604, //Utils.gradToRad(170)
			delayAlpha: 33 
		}
		this._startLigthExplosionSingleAnimation(aContainer_sprt, "boss_mode/common/particles_yellow", lStartSetting_2, lFinishSetting_2);
		
		let lStartSetting_3 = {
			position: {x: -50, y:41},
			scale: 0.51,
			rotation: 2.007128639793479, //Utils.gradToRad(115)
		};
		let lFinishSetting_3 = {
			position: {x: 553, y: 481},
			scale: 0.88,
			rotation: 2.4609142453120043, //Utils.gradToRad(141)
			delayAlpha: 33
		}
		this._startLigthExplosionSingleAnimation(aContainer_sprt, "boss_mode/common/particles_yellow", lStartSetting_3, lFinishSetting_3);
		//...Light Yelow

		//Light Patricle...

		let lStartParticleSetting_0 = {
			position: {x: -19, y:-5},
			scale: 0.46,
			rotation: 0.05235987755982988, //Utils.gradToRad(3)
		};
		let lFinishParticleSetting_0 = {
			position: {x: 768, y:-215},
			scale: 0.83,
			rotation: 0.6632251157578452, //Utils.gradToRad(38)
			delayAlpha: 17
		}
		this._startLigthExplosionSingleAnimation(aContainer_sprt, "common/light_particle", lStartParticleSetting_0, lFinishParticleSetting_0);

		let lStartParticleSetting_1 = {
			position: {x: -133, y:-5},
			scale: 1.07,
			rotation: 1.4835298641951802, //Utils.gradToRad(85)
		};
		let lFinishParticleSetting_1 = {
			position: {x: -725, y: -249},
			scale: 1.44,
			rotation: 2.0943951023931953, //Utils.gradToRad(120)
			delayAlpha: 17
		}
		this._startLigthExplosionSingleAnimation(aContainer_sprt, "common/light_particle", lStartParticleSetting_1, lFinishParticleSetting_1);
		
		let lStartParticleSetting_2 = {
			position: {x: -284, y:103},
			scale: 1.3,
			rotation: 1.9198621771937625, //Utils.gradToRad(110)
		};
		let lFinishParticleSetting_2 = {
			position: {x: -698, y: 398},
			scale: 1.67,
			rotation: 1.5533430342749535, //Utils.gradToRad(89)
			delayAlpha: 33
		}
		this._startLigthExplosionSingleAnimation(aContainer_sprt, "common/light_particle", lStartParticleSetting_2, lFinishParticleSetting_2);
		
		let lStartParticleSetting_3 = {
			position: {x: -50, y:41},
			scale: 1.01,
			rotation: 1.9198621771937625, //Utils.gradToRad(110)
		};
		let lFinishParticleSetting_3 = {
			position: {x: 553, y: 481},
			scale: 1.38,
			rotation: 1.5533430342749535, //Utils.gradToRad(89)
			delayAlpha: 33
		}
		this._startLigthExplosionSingleAnimation(aContainer_sprt, "common/light_particle", lStartParticleSetting_3, lFinishParticleSetting_3);
		//...Light Patricle
	}

	_startLigthExplosionSingleAnimation(aContainer_sprt, aName_srt, aStartSetting_obj, aFinishSetting_obj)
	{
		let lLightParticleYellow_sprt = aContainer_sprt.addChild(this._createLight(aName_srt));
		lLightParticleYellow_sprt.scale.set(aStartSetting_obj.scale);
		lLightParticleYellow_sprt.alpha = 1;
		lLightParticleYellow_sprt.rotation = aStartSetting_obj.rotation;
		lLightParticleYellow_sprt.position.set(aStartSetting_obj.position.x, aStartSetting_obj.position.y);
		this._fLightParticleYellow_sprt_arr.push(lLightParticleYellow_sprt);

		let lAnimationSetting_seq_arr = {
			position: [
				{tweens: [ {prop: "position.x", to: aFinishSetting_obj.position.x}, {prop: "position.y", to: aFinishSetting_obj.position.y} ],duration: 79*FRAME_RATE},
			],
			scale: [
				{tweens: [ {prop: "scale.x", to: aFinishSetting_obj.scale}, {prop: "scale.y", to: aFinishSetting_obj.scale} ],duration: 79*FRAME_RATE}
			],
			rotation: [
				{tweens: [{prop: "rotation", to: aFinishSetting_obj.rotation}],duration: 79 * FRAME_RATE},
			],
			alpha: [
				{tweens: [{prop: "alpha", to: 1}],duration: 3 * FRAME_RATE},
				{tweens: [],duration: aFinishSetting_obj.delayAlpha * FRAME_RATE},
				{tweens: [{prop: "alpha", to: 0}],duration: 76-aFinishSetting_obj.delayAlpha * FRAME_RATE},
			]
		}
		Sequence.start(lLightParticleYellow_sprt, lAnimationSetting_seq_arr.position);
		Sequence.start(lLightParticleYellow_sprt, lAnimationSetting_seq_arr.scale);
		Sequence.start(lLightParticleYellow_sprt, lAnimationSetting_seq_arr.rotation);
		Sequence.start(lLightParticleYellow_sprt, lAnimationSetting_seq_arr.alpha);
	}

	_createSmokeSpinSequanse(aPosition_obj, aRotation_num , aScale_num)
	{
		let lPosition_seq = [
			{tweens: [],duration: 1 * FRAME_RATE},
			{tweens: [ {prop: "position.x", to: aPosition_obj.x}, {prop: "position.y", to: aPosition_obj.y} ],duration: 73*FRAME_RATE},
		]

		let lScale_seq = [
			{tweens: [ {prop: "scale.x", to: aScale_num}, {prop: "scale.y", to: aScale_num} ],duration: 73*FRAME_RATE, ease:Easing.sine.easeIn}
		]

		let lRotation_seq = [
			{tweens: [{prop: "rotation", to: aRotation_num}],duration: 73 * FRAME_RATE},
		]

		let lAlpha_seq = [
			{tweens: [{prop: "alpha", to: 0.8}],duration: 16 * FRAME_RATE, ease:Easing.sine.easeIn},
			{tweens: [{prop: "alpha", to: 0}],duration: 57 * FRAME_RATE, ease:Easing.sine.easeOut},
		]
		
		return {
			position: lPosition_seq,
			scale: lScale_seq,
			rotation: lRotation_seq,
			alpha: lAlpha_seq,
		}
	}
	
	_startAnyMovAnimation(aTexture_obj ,aPos_obj, aRot_num, aOptScale_num = 1, aBlendMode = PIXI.BLEND_MODES.ADD, aDelay_num = 0, lContainer = this )
	{
		let lParticle_sprt = lContainer.addChild(new Sprite());
		this._fParticles_arr.push(lParticle_sprt);
		lParticle_sprt.textures = aTexture_obj;
		lParticle_sprt.scale.set(aOptScale_num);
		lParticle_sprt.rotation = aRot_num;
		lParticle_sprt.position.set(aPos_obj.x, aPos_obj.y);
		lParticle_sprt.blendMode = aBlendMode;
		lParticle_sprt.anchor.set(0.5,0.67);
		lParticle_sprt.animationSpeed = 30/60;
		lParticle_sprt.on('animationend', () => {
			let id = this._fParticles_arr.indexOf(lParticle_sprt);
			if (~id)
			{
				this._fParticles_arr.splice(id, 1);
			}
			lParticle_sprt && lParticle_sprt.destroy();
			lParticle_sprt = null;

			if (this._fParticles_arr.length == 0)
			{
				this._fParticles_arr = [];
			}
		});

		if(aDelay_num > 0)
		{
			lParticle_sprt.visible = false;
		}

		let lTimer = [
			{tweens: [],duration: aDelay_num * FRAME_RATE, onfinish: ()=>
			{
				lParticle_sprt.visible = true;
				lParticle_sprt.play();
			}},
		]
		Sequence.start(lParticle_sprt, lTimer);
		return lParticle_sprt;
	}

	_startMiniExplosionAnimation()
	{
		let lContainer = new Sprite();
		
		this._startAnyMovAnimation(_crateStoneExplosion0Textures(),{x:0,y:0}, 0, 1.6,PIXI.BLEND_MODES.NORMAL, 4, lContainer);

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startSmokeAnimation(lContainer);
			this._startLightAnimation(lContainer);
		}

		let lFlame_sprt = this._startAnyMovAnimation(_crateFlameExplosionTextures(), {x:0,y:0}, 0, 1.7, PIXI.BLEND_MODES.ADD, 1, lContainer);
		this._fFlame_spr_arr.push(lFlame_sprt);
		let lScaleFlame_seq = 
		[
			{tweens: [],duration: 1 * FRAME_RATE},
			{tweens: [ {prop: "scale.x", to: 2}, {prop: "scale.y", to: 2} ],duration: 10 * FRAME_RATE, ease:Easing.sine.easeIn,
			onfinish: () => {
				let id = this._fFlame_spr_arr.indexOf(lFlame_sprt);
				if (~id)
				{
					this._fFlame_spr_arr.splice(id, 1);
				}
				lFlame_sprt && lFlame_sprt.destroy();
			}
		},
		];
		Sequence.start(lFlame_sprt, lScaleFlame_seq);
		return lContainer;
	}
	
	_startSmokeAnimation(aContainer_sprt)
	{
		let lSmokeOrange = aContainer_sprt.addChild(this._createSmoke("boss_mode/earth/smoke_orange", 0.31, 0));

		let lScaleSmokeOrange_seq = 
		[
			{tweens: [],duration: 2 * FRAME_RATE},
			{tweens: [ {prop: "scale.x", to: 0.68}, {prop: "scale.y", to: 0.68} ],duration: 24 * FRAME_RATE, ease:Easing.sine.easeIn},
		];

		let lPositionSmokeOrange_seq = 
		[
			{tweens: [],	duration: 2*FRAME_RATE},
			{tweens: [ {prop: "position.x", to: 86}, {prop: "position.y", to: -88} ],	duration: 24*FRAME_RATE, onfinish: ()=>{
				lSmokeOrange.destroy();
			}},
		];
		Sequence.start(lSmokeOrange, this._getSmokeAlphaSequance(2));
		Sequence.start(lSmokeOrange, this._getSmokeRotationSequance(2));
		Sequence.start(lSmokeOrange, lScaleSmokeOrange_seq);
		Sequence.start(lSmokeOrange, lPositionSmokeOrange_seq);

		let lSmoke6 = aContainer_sprt.addChild(this._createSmoke("boss_mode/earth/smoke_6", 1.03, 0));

		let lScaleSmoke6_seq = 
		[
			{tweens: [],duration: 5 * FRAME_RATE},
			{tweens: [ {prop: "scale.x", to: 1.57}, {prop: "scale.y", to: 1.57} ],duration: 24 * FRAME_RATE, ease:Easing.sine.easeIn},
		];

		let lPositionSmoke6_seq = 
		[
			{tweens: [],	duration: 5 * FRAME_RATE},
			{tweens: [ {prop: "position.x", to: -118}, {prop: "position.y", to: 22} ],	duration: 24*FRAME_RATE, onfinish: ()=>{
				lSmoke6.destroy();
			}},
		];
		Sequence.start(lSmoke6, this._getSmokeAlphaSequance(5));
		Sequence.start(lSmoke6, this._getSmokeRotationSequance(5));
		Sequence.start(lSmoke6, lScaleSmoke6_seq);
		Sequence.start(lSmoke6, lPositionSmoke6_seq);

		let lSmokeOrange2 = aContainer_sprt.addChild(this._createSmoke("boss_mode/earth/smoke_orange", 0.22, 0));
		
		let lScaleSmokeOrange2_seq = 
		[
			{tweens: [],duration: 3 * FRAME_RATE},
			{tweens: [ {prop: "scale.x", to: 0.76}, {prop: "scale.y", to: 0.76} ],duration: 24 * FRAME_RATE, ease:Easing.sine.easeIn},
		];

		let lPositionSmokeOrange2_seq = 
		[
			{tweens: [],	duration: 3 * FRAME_RATE},
			{tweens: [ {prop: "position.x", to: 34}, {prop: "position.y", to: 50} ],	duration: 24*FRAME_RATE, onfinish: ()=>{
				lSmokeOrange2.destroy();
			}},
		];
		Sequence.start(lSmokeOrange2, this._getSmokeAlphaSequance(3));
		Sequence.start(lSmokeOrange2, this._getSmokeRotationSequance(3));
		Sequence.start(lSmokeOrange2, lScaleSmokeOrange2_seq);
		Sequence.start(lSmokeOrange2, lPositionSmokeOrange2_seq);
	}
	
	_getSmokeAlphaSequance(aDelay)
	{
		return[
			{tweens: [],duration: aDelay * FRAME_RATE},
			{tweens: [ {prop: "alpha", to: 0.49} ],duration:9 * FRAME_RATE, ease:Easing.sine.easeIn},
			{tweens: [ {prop: "alpha", to: 0} ],duration:15 * FRAME_RATE, ease:Easing.sine.easeOut},
		];
	}

	_getSmokeRotationSequance(aDelay)
	{
		return [
			{tweens: [],duration: aDelay * FRAME_RATE},
			{tweens: [{prop: "rotation", to: 0.8377580409572781}],duration: 24 * FRAME_RATE} //Utils.gradToRad(48)
		];
	}
	
	_startLightAnimation(aContainer_sprt)
	{
		let lLightParticle_sprt = aContainer_sprt.addChild(this._createLight("common/light_particle", 7));
		lLightParticle_sprt.blendMode = PIXI.BLEND_MODES.ADD;

		let lAlphaLightParticle_seq =[
			{tweens: [],duration: 5 * FRAME_RATE},
			{tweens: [ {prop: "alpha", to: 0}],duration: 10 * FRAME_RATE, ease:Easing.sine.easeOut,
				onfinish: () => {
					lLightParticle_sprt && lLightParticle_sprt.destroy();
				}
			},
		];

		this._fLightParticleAnimation_spr_arr.push(lLightParticle_sprt);

		Sequence.start(lLightParticle_sprt, lAlphaLightParticle_seq);

		let lLight_sprt = aContainer_sprt.addChild(this._createLight("common/misty_flare", 1));
		let lScaleLight_seq =[
			{tweens: [],duration: 1 * FRAME_RATE},
			{tweens: [ {prop: "scale.x", to: 1.67}, {prop: "scale.y", to: 1.67} ],duration: 2 * FRAME_RATE},
			{tweens: [ {prop: "scale.x", to: 0}, {prop: "scale.y", to: 0} ],duration: 6 * FRAME_RATE,
				onfinish: () => {
					lLight_sprt && lLight_sprt.destroy();
				}
		},
		];

		this._fLightAnimation_spr_arr.push(lLight_sprt);

		Sequence.start(lLight_sprt, lScaleLight_seq);

		let lLightParticleYellow_sprt = aContainer_sprt.addChild(this._createLight("boss_mode/common/particles_yellow", 0.51));
		lLightParticleYellow_sprt.blendMode = PIXI.BLEND_MODES.ADD;

		let lScalelLightParticleYellow_seq =[
			{tweens: [],duration: 2 * FRAME_RATE},
			{tweens: [ {prop: "scale.x", to: 1.17}, {prop: "scale.y", to: 1.17} ],duration: 32 * FRAME_RATE},
		];

		let lAlphalLightParticleYellow_seq =[
			{tweens: [],duration: 10 * FRAME_RATE},
			{tweens: [ {prop: "alpha", to: 0}],duration: 24 * FRAME_RATE},
		];

		let lRotationlLightParticleYellow_seq =[
			{tweens: [],duration: 2 * FRAME_RATE},
			{tweens: [ {prop: "rotation", to: 0.3490658503988659}],duration: 32 * FRAME_RATE}, // Utils.gradToRad(20)
		];

		this._fLightParticleYellowAnimation_spr_arr.push(lLightParticleYellow_sprt);

		Sequence.start(lLightParticleYellow_sprt, lScalelLightParticleYellow_seq);
		Sequence.start(lLightParticleYellow_sprt, lAlphalLightParticleYellow_seq);
		Sequence.start(lLightParticleYellow_sprt, lRotationlLightParticleYellow_seq);

		let lLightCircle_sprt = aContainer_sprt.addChild(this._createLight("boss_mode/common/light_circle_1", 0.86, 1.74));
		lLightCircle_sprt.blendMode = PIXI.BLEND_MODES.ADD;

		let lScalelLightCircle_seq =[
			{tweens: [],duration: 1 * FRAME_RATE},
			{tweens: [ {prop: "scale.x", to: 2.76}, {prop: "scale.y", to: 2.76} ],duration: 5 * FRAME_RATE},
		];

		let lAlphalLightCircle_seq =[
			{tweens: [],duration: 2 * FRAME_RATE},
			{tweens: [ {prop: "alpha", to: 0}],duration: 4 * FRAME_RATE},
		];

		this._fLightCircleAnimation_spr_arr.push(lLightCircle_sprt);

		Sequence.start(lLightCircle_sprt, lScalelLightCircle_seq);
		Sequence.start(lLightCircle_sprt, lAlphalLightCircle_seq);
	}

	_startLightCircleAnimation()
	{
		let lContainer_sprt = this.addChild(new Sprite());
		let lTimer_seq = [
			{tweens: [],duration: 86 * FRAME_RATE, onfinish: ()=>{
				let lLight_sprt = this._fLight1_spr = lContainer_sprt.addChild(this._createLight("common/misty_flare", 0.19, 0.6));

				let lScaleLight_seq = [
					{tweens: [ {prop: "scale.x", to: 8.49}, {prop: "scale.y", to: 8.49} ],duration: 2*FRAME_RATE},
					{tweens: [ {prop: "scale.x", to: 0}, {prop: "scale.y", to: 0} ],duration: 57*FRAME_RATE},
				];
				let lAlphaLight_seq = [
					{tweens: [],duration: 12*FRAME_RATE},
					{tweens: [ {prop: "alpha", to: 0} ],duration: 47*FRAME_RATE, onfinish: ()=>{
						lLight_sprt.destroy();
					}},
				];
				
				Sequence.start(lLight_sprt, lScaleLight_seq);
				Sequence.start(lLight_sprt, lAlphaLight_seq);
				
				let lLightCircle_sprt = this._fLightCircle1_spr = lContainer_sprt.addChild(this._createLight("boss_mode/common/light_circle_1", 0.84, 1.2));
				let lScaleLightCircle_seq = [
					{tweens: [],duration: 1*FRAME_RATE},
					{tweens: [ {prop: "scale.x", to: 11.66}, {prop: "scale.y", to: 11.66} ],duration: 6*FRAME_RATE},
				];
				let lAlphaLightCircle_seq = [
					{tweens: [],duration: 2*FRAME_RATE},
					{tweens: [ {prop: "alpha", to: 0} ],duration: 5*FRAME_RATE, onfinish: ()=>{
						lLightCircle_sprt.destroy();
					}},
				];
				Sequence.start(lLightCircle_sprt, lScaleLightCircle_seq);
				Sequence.start(lLightCircle_sprt, lAlphaLightCircle_seq);
			}},
			{tweens: [],duration: 1 * FRAME_RATE, onfinish: ()=>{
				let lLight_sprt = this._fLight2_spr = lContainer_sprt.addChild(this._createLight("boss_mode/common/fx_light_2", 4.72, 0));
				let lAlphaLight_seq = [
					{tweens: [ {prop: "alpha", to: 0.48} ],duration: 1*FRAME_RATE},
					{tweens: [ {prop: "alpha", to: 0} ],duration: 20*FRAME_RATE, onfinish: ()=>{
						lLight_sprt.destroy();
					}},
				];
				Sequence.start(lLight_sprt, lAlphaLight_seq);
				
				let lLightCircle_sprt = this._fLightCircle2_spr = lContainer_sprt.addChild(this._createLight("boss_mode/common/light_circle_1", 0.84));
				let lScaleLightCircle_seq = [
					{tweens: [],duration: 1*FRAME_RATE},
					{tweens: [ {prop: "scale.x", to: 11.66}, {prop: "scale.y", to: 11.66} ],duration: 8*FRAME_RATE},
				];
				let lAlphaLightCircle_seq = [
					{tweens: [],duration: 2*FRAME_RATE},
					{tweens: [ {prop: "alpha", to: 0} ],duration: 7*FRAME_RATE, onfinish: ()=>{
						lLightCircle_sprt.destroy();
					}},
				];
				Sequence.start(lLightCircle_sprt, lScaleLightCircle_seq);
				Sequence.start(lLightCircle_sprt, lAlphaLightCircle_seq);
			}},
			{tweens: [],duration: 2 * FRAME_RATE, onfinish: ()=>{
				let lLight_sprt = this._fLight3_spr = lContainer_sprt.addChild(this._createLight("boss_mode/common/circle_blast", 0.14, 0.48));
				let lAlphaLight_seq = [
					{tweens: [],duration: 4*FRAME_RATE},
					{tweens: [ {prop: "alpha", to: 0} ],duration: 8*FRAME_RATE},
				];
				let lScaleLight_seq = [
					{tweens: [ {prop: "scale.x", to: 1}, {prop: "scale.y", to: 1} ],duration: 4*FRAME_RATE},
					{tweens: [ {prop: "scale.x", to: 7.2}, {prop: "scale.y", to: 7.2} ],duration: 20*FRAME_RATE, onfinish: ()=>{
						lLight_sprt.destroy();
					}},
				];
				Sequence.start(lLight_sprt, lAlphaLight_seq);
				Sequence.start(lLight_sprt, lScaleLight_seq);
				
				let lLightCircle_sprt = this._fLightCircle3_spr = lContainer_sprt.addChild(this._createLight("boss_mode/common/circle_blast", 0.15, 0.6));
				lLightCircle_sprt.position.set(5,50);
				let lScaleLightCircle_seq = [
					{tweens: [ {prop: "scale.x", to: 7.2}, {prop: "scale.y", to: 7.2} ],duration: 20*FRAME_RATE, onfinish: ()=>{
						lLightCircle_sprt.destroy();
					}},
				];
				let lAlphaLightCircle_seq = [
					{tweens: [],duration: 4*FRAME_RATE},
					{tweens: [ {prop: "alpha", to: 0} ],duration: 8*FRAME_RATE},
				];
				Sequence.start(lLightCircle_sprt, lScaleLightCircle_seq);
				Sequence.start(lLightCircle_sprt, lAlphaLightCircle_seq);
			}},
			{tweens: [],duration: 3 * FRAME_RATE, onfinish: ()=>{
				let lLight_sprt = this._fLight4_spr = lContainer_sprt.addChild(this._createLight("common/light_particle", 0.52));
				let lScaleLight_seq = [
					{tweens: [ {prop: "scale.x", to: 17.67}, {prop: "scale.y", to: 17.67} ],duration: 11*FRAME_RATE, onfinish: ()=>{
						lLight_sprt.destroy();
					}},
				];
				Sequence.start(lLight_sprt, lScaleLight_seq);
			}},
		];
		lContainer_sprt.position.set(0, -200);
		Sequence.start(this, lTimer_seq);
	}

	_startSmokeTrailAnimation()
	{
		let lContainer = this.addChild( new Sprite());
		
		let lTimer_seq = [
			{tweens: [],duration: 17 * FRAME_RATE, onfinish: ()=> {
				let lTrail_emsr = lContainer.addChild( new EarthMediumStoneRock());
				this._fSmokeTrailAnimation_emsr_arr.push(lTrail_emsr);
				lTrail_emsr.on(EarthMediumStoneRock.EVENT_ON_ANIMATION_ENDED, this._completeSmokeTrailAnimation, this);
				lTrail_emsr.startSmokeTrailAnimation();
			}},
			{tweens: [],duration: 13 * FRAME_RATE, onfinish: ()=> {
				let lTrail_emsr = lContainer.addChild( new EarthMediumStoneRock());
				this._fSmokeTrailAnimation_emsr_arr.push(lTrail_emsr);
				lTrail_emsr.on(EarthMediumStoneRock.EVENT_ON_ANIMATION_ENDED, this._completeSmokeTrailAnimation, this);
				lTrail_emsr.scale.set(0.77);
				lTrail_emsr.rotation = 0.7853981633974483; //Utils.gradToRad(45);
				lTrail_emsr.position.set(22, 58);
				lTrail_emsr.startSmokeTrailAnimation();
			}},
			{tweens: [],duration: 7 * FRAME_RATE, onfinish: ()=> {
				let lTrail_emsr = lContainer.addChild( new EarthMediumStoneRock());
				this._fSmokeTrailAnimation_emsr_arr.push(lTrail_emsr);
				lTrail_emsr.on(EarthMediumStoneRock.EVENT_ON_ANIMATION_ENDED, this._completeSmokeTrailAnimation, this);
				lTrail_emsr.scale.set(-0.99, 0.99);
				lTrail_emsr.position.set(-200, -27);
				lTrail_emsr.startSmokeTrailAnimation();
			}},
			{tweens: [],duration: 16 * FRAME_RATE, onfinish: ()=> {
				let lTrail_emsr = lContainer.addChild( new EarthMediumStoneRock());
				this._fSmokeTrailAnimation_emsr_arr.push(lTrail_emsr);
				lTrail_emsr.on(EarthMediumStoneRock.EVENT_ON_ANIMATION_ENDED, this._completeSmokeTrailAnimation, this);
				lTrail_emsr.scale.set(-0.75, 0.75);
				lTrail_emsr.position.set(-199, 48);
				lTrail_emsr.rotation = -0.24434609527920614; //Utils.gradToRad(-14);
				lTrail_emsr.alpha = 0.7;
				lTrail_emsr.startSmokeTrailAnimation();
			}},
			{tweens: [],duration: 4 * FRAME_RATE, onfinish: ()=> {
				let lTrail_emsr = lContainer.addChild( new EarthMediumStoneRock());
				this._fSmokeTrailAnimation_emsr_arr.push(lTrail_emsr);
				lTrail_emsr.on(EarthMediumStoneRock.EVENT_ON_ANIMATION_ENDED, this._completeSmokeTrailAnimation, this);
				lTrail_emsr.scale.set(0.99, 0.99);
				lTrail_emsr.position.set(-23, 48);
				lTrail_emsr.startSmokeTrailAnimation();
			}},
			{tweens: [],duration: 11 * FRAME_RATE, onfinish: ()=> {
				let lTrail_emsr = lContainer.addChild( new EarthMediumStoneRock());
				this._fSmokeTrailAnimation_emsr_arr.push(lTrail_emsr);
				lTrail_emsr.on(EarthMediumStoneRock.EVENT_ON_ANIMATION_ENDED, this._completeSmokeTrailAnimation, this);
				lTrail_emsr.scale.set(-0.99, 0.99);
				lTrail_emsr.position.set(-180, -12);
				lTrail_emsr.startSmokeTrailAnimation();
			}},
			{tweens: [],duration: 17 * FRAME_RATE, onfinish: ()=> {
				let lTrail_emsr = lContainer.addChild( new EarthMediumStoneRock());
				this._fSmokeTrailAnimation_emsr_arr.push(lTrail_emsr);
				lTrail_emsr.on(EarthMediumStoneRock.EVENT_ON_ANIMATION_ENDED, this._completeSmokeTrailAnimation, this);
				lTrail_emsr.scale.set(-0.75, 0.75);
				lTrail_emsr.position.set(-199, 50);
				lTrail_emsr.rotation = -0.24434609527920614; //Utils.gradToRad(-14);
				lTrail_emsr.alpha = 0.7;
				lTrail_emsr.startSmokeTrailAnimation();
			}},
			{tweens: [],duration: 1 * FRAME_RATE, onfinish: ()=> {
				let lTrail_emsr = lContainer.addChild( new EarthMediumStoneRock());
				this._fSmokeTrailAnimation_emsr_arr.push(lTrail_emsr);
				lTrail_emsr.on(EarthMediumStoneRock.EVENT_ON_ANIMATION_ENDED, this._completeSmokeTrailAnimation, this);
				lTrail_emsr.scale.set(-0.99, 0.99);
				lTrail_emsr.position.set(-162, -13);
				lTrail_emsr.rotation = 0.9250245035569946; //Utils.gradToRad(53);
				lTrail_emsr.startSmokeTrailAnimation();
			
				let lTrail2_emsr = lContainer.addChild( new EarthMediumStoneRock());
				this._fSmokeTrailAnimation_emsr_arr.push(lTrail_emsr);
				lTrail_emsr.on(EarthMediumStoneRock.EVENT_ON_ANIMATION_ENDED, this._completeSmokeTrailAnimation, this);
				lTrail2_emsr.scale.set(0.99, 0.99);
				lTrail2_emsr.position.set(-23, -13);
				lTrail2_emsr.startSmokeTrailAnimation();
			}},
			{tweens: [],duration: 3 * FRAME_RATE, onfinish: ()=> {
				let lTrail_emsr = lContainer.addChild( new EarthMediumStoneRock());
				this._fSmokeTrailAnimation_emsr_arr.push(lTrail_emsr);
				lTrail_emsr.on(EarthMediumStoneRock.EVENT_ON_ANIMATION_ENDED, this._completeSmokeTrailAnimation, this);
				lTrail_emsr.scale.set(-0.99, 0.99);
				lTrail_emsr.position.set(-180, -12);
				lTrail_emsr.startSmokeTrailAnimation();
			}},
		];
		Sequence.start(this, lTimer_seq);
		lContainer.position.set(100, -200);
	}
	
	_completeSmokeTrailAnimation(e)
	{
		let id = this._fSmokeTrailAnimation_emsr_arr.indexOf(e.target);
		if (~id)
		{
			e.target && e.target.destroy();
			this._fSmokeTrailAnimation_emsr_arr.splice(id, 1);
		}
	}

	_startMediumStoneAnimation() 
	{
		let lContainer = this.addChild( new Sprite());
		
		let lTimer_seq = [
			{tweens: [],duration: 17 * FRAME_RATE, onfinish: ()=> {
				let lTrail_emsr = lContainer.addChild( new EarthMediumStoneRock());
				this._fMediumStoneAnimation_emsr_arr.push(lTrail_emsr);
				lTrail_emsr.on(EarthMediumStoneRock.EVENT_ON_ANIMATION_ENDED, this._completeMediumStoneAnimation, this);
				lTrail_emsr.scale.set(-0.75, 0.75);
				lTrail_emsr.rotation = -0.24434609527920614; //Utils.gradToRad(-14);
				lTrail_emsr.startStoneAnimation(0);
			}},
			{tweens: [],duration: 7 * FRAME_RATE, onfinish: ()=> {
				let lTrail_emsr = lContainer.addChild( new EarthMediumStoneRock());
				this._fMediumStoneAnimation_emsr_arr.push(lTrail_emsr);
				lTrail_emsr.on(EarthMediumStoneRock.EVENT_ON_ANIMATION_ENDED, this._completeMediumStoneAnimation, this);
				lTrail_emsr.scale.set(-0.99, 0.99);
				lTrail_emsr.position.set(-91, -149);
				lTrail_emsr.startStoneAnimation(3);
			}},
			{tweens: [],duration: 12 * FRAME_RATE, onfinish: ()=> {
				let lTrail_emsr = lContainer.addChild( new EarthMediumStoneRock());
				this._fMediumStoneAnimation_emsr_arr.push(lTrail_emsr);
				lTrail_emsr.on(EarthMediumStoneRock.EVENT_ON_ANIMATION_ENDED, this._completeMediumStoneAnimation, this);
				lTrail_emsr.scale.set(0.99, 0.99);
				lTrail_emsr.position.set(48, -35);
				lTrail_emsr.startStoneAnimation(2);
			}},
			{tweens: [],duration: 17 * FRAME_RATE, onfinish: ()=> {
				let lTrail_emsr = lContainer.addChild( new EarthMediumStoneRock());
				this._fMediumStoneAnimation_emsr_arr.push(lTrail_emsr);
				lTrail_emsr.on(EarthMediumStoneRock.EVENT_ON_ANIMATION_ENDED, this._completeMediumStoneAnimation, this);
				lTrail_emsr.scale.set(-0.99, 0.99);
				lTrail_emsr.position.set(-20, -51);
				lTrail_emsr.rotation = -0.15707963267948966; //Utils.gradToRad(-9);
				lTrail_emsr.startStoneAnimation(1);
			}},
			{tweens: [],duration: 22 * FRAME_RATE, onfinish: ()=> {
				let lTrail_emsr = lContainer.addChild( new EarthMediumStoneRock());
				this._fMediumStoneAnimation_emsr_arr.push(lTrail_emsr);
				lTrail_emsr.on(EarthMediumStoneRock.EVENT_ON_ANIMATION_ENDED, this._completeMediumStoneAnimation, this);
				lTrail_emsr.scale.set(-0.99, 0.99);
				lTrail_emsr.position.set(48, 2);
				lTrail_emsr.rotation = -0.15707963267948966; //Utils.gradToRad(-9);
				lTrail_emsr.startStoneAnimation(3);
			}},
			{tweens: [],duration: 17 * FRAME_RATE, onfinish: ()=> {
				let lTrail_emsr = lContainer.addChild( new EarthMediumStoneRock());
				this._fMediumStoneAnimation_emsr_arr.push(lTrail_emsr);
				lTrail_emsr.on(EarthMediumStoneRock.EVENT_ON_ANIMATION_ENDED, this._completeMediumStoneAnimation, this);
				lTrail_emsr.scale.set(-0.80, 0.80);
				lTrail_emsr.position.set(-42, 18);
				lTrail_emsr.rotation = -0.24434609527920614; //Utils.gradToRad(-14);
				lTrail_emsr.startStoneAnimation(3);
			}},
			{tweens: [],duration: 2 * FRAME_RATE, onfinish: ()=> {
				let lTrail_emsr = lContainer.addChild( new EarthMediumStoneRock());
				this._fMediumStoneAnimation_emsr_arr.push(lTrail_emsr);
				lTrail_emsr.on(EarthMediumStoneRock.EVENT_ON_ANIMATION_ENDED, this._completeMediumStoneAnimation, this);
				lTrail_emsr.scale.set(0.99, 0.99);
				lTrail_emsr.position.set(47, 75);
				lTrail_emsr.rotation = 0.3665191429188092; //Utils.gradToRad(21);
				lTrail_emsr.startStoneAnimation(2);
			}},
			{tweens: [],duration: 2 * FRAME_RATE, onfinish: ()=> {
				let lTrail_emsr = lContainer.addChild( new EarthMediumStoneRock());
				this._fMediumStoneAnimation_emsr_arr.push(lTrail_emsr);
				lTrail_emsr.on(EarthMediumStoneRock.EVENT_ON_ANIMATION_ENDED, this._completeMediumStoneAnimation, this);
				lTrail_emsr.scale.set(0.99, 0.99);
				lTrail_emsr.position.set(-44, -61);
				lTrail_emsr.rotation = -0.20943951023931953; //Utils.gradToRad(-12);
				lTrail_emsr.startStoneAnimation(3);
			}},
			{tweens: [],duration: 2 * FRAME_RATE, onfinish: ()=> {
				let lTrail_emsr = lContainer.addChild( new EarthMediumStoneRock());
				this._fMediumStoneAnimation_emsr_arr.push(lTrail_emsr);
				lTrail_emsr.on(EarthMediumStoneRock.EVENT_ON_ANIMATION_ENDED, this._completeMediumStoneAnimation, this);
				lTrail_emsr.scale.set(-0.73, 0.73);
				lTrail_emsr.position.set(-15, -53);
				lTrail_emsr.rotation = 0.05235987755982988; //Utils.gradToRad(3);
				lTrail_emsr.startStoneAnimation(1);
			}},
		];
		Sequence.start(this, lTimer_seq);
		
		let lAlpha_seq = [
			{tweens: [],duration: 137 * FRAME_RATE},
			{tweens: [ {prop: "alpha", to: 0} ],duration: 21 * FRAME_RATE},
		]
		Sequence.start(lContainer, lAlpha_seq);
		lContainer.position.set(0, -100);
	}

	_completeMediumStoneAnimation(e)
	{
		let id = this._fMediumStoneAnimation_emsr_arr.indexOf(e.target);
		if (~id)
		{
			e.target && e.target.destroy();
			this._fMediumStoneAnimation_emsr_arr.splice(id, 1);
		}
	}

	_startSmallStoneAnimation() 
	{
		let lContainer = this.addChild( new Sprite());
		
		let lTimer_seq = [
			{tweens: [],duration: 33 * FRAME_RATE, onfinish: ()=> {
				let lRock_emsr = lContainer.addChild( new EarthSmallStoneRock() );
				this._fSmallStoneAnimation_emsr_arr.push(lRock_emsr);
				lRock_emsr.on(EarthMediumStoneRock.EVENT_ON_ANIMATION_ENDED, this._completeSmallStoneAnimation, this);
				lRock_emsr.rotation = 0.08726646259971647; //Utils.gradToRad(5);
				lRock_emsr.startAnimation(6);
			}},
			{tweens: [],duration: 25 * FRAME_RATE, onfinish: ()=> {
				let lRock_emsr = lContainer.addChild( new EarthSmallStoneRock() );
				this._fSmallStoneAnimation_emsr_arr.push(lRock_emsr);
				lRock_emsr.on(EarthMediumStoneRock.EVENT_ON_ANIMATION_ENDED, this._completeSmallStoneAnimation, this);
				lRock_emsr.scale.set(-1.1, 1.1);
				lRock_emsr.position.set(21,49)
				lRock_emsr.startAnimation(9);
			}},
			{tweens: [],duration: 8 * FRAME_RATE, onfinish: ()=> {
				let lRock_emsr = lContainer.addChild( new EarthSmallStoneRock() );
				this._fSmallStoneAnimation_emsr_arr.push(lRock_emsr);
				lRock_emsr.on(EarthMediumStoneRock.EVENT_ON_ANIMATION_ENDED, this._completeSmallStoneAnimation, this);
				lRock_emsr.position.set(-14,-37)
				lRock_emsr.startAnimation(6);
			}},
			{tweens: [],duration: 14 * FRAME_RATE, onfinish: ()=> {
				let lRock_emsr = lContainer.addChild( new EarthSmallStoneRock() );
				this._fSmallStoneAnimation_emsr_arr.push(lRock_emsr);
				lRock_emsr.on(EarthMediumStoneRock.EVENT_ON_ANIMATION_ENDED, this._completeSmallStoneAnimation, this);
				lRock_emsr.scale.set(-1, 1);
				lRock_emsr.position.set(-114,-117)
				lRock_emsr.startAnimation(6);
			}},
			{tweens: [],duration: 7 * FRAME_RATE, onfinish: ()=> {
				let lRock_emsr = lContainer.addChild( new EarthSmallStoneRock() );
				this._fSmallStoneAnimation_emsr_arr.push(lRock_emsr);
				lRock_emsr.on(EarthMediumStoneRock.EVENT_ON_ANIMATION_ENDED, this._completeSmallStoneAnimation, this);
				lRock_emsr.scale.set(-0.75, 0.75);
				lRock_emsr.position.set(77, 92);
				lRock_emsr.rotation = 0.3316125578789226; //Utils.gradToRad(19);
				lRock_emsr.startAnimation(5);
			}},
			{tweens: [],duration: 3 * FRAME_RATE, onfinish: ()=> {
				let lRock_emsr = lContainer.addChild( new EarthSmallStoneRock() );
				this._fSmallStoneAnimation_emsr_arr.push(lRock_emsr);
				lRock_emsr.on(EarthMediumStoneRock.EVENT_ON_ANIMATION_ENDED, this._completeSmallStoneAnimation, this);
				lRock_emsr.position.set(217, 43);
				lRock_emsr.rotation = 0.3316125578789226; //Utils.gradToRad(19);
				lRock_emsr.startAnimation(5);

				let lRock2_emsr = lContainer.addChild( new EarthSmallStoneRock() );
				this._fSmallStoneAnimation_emsr_arr.push(lRock_emsr);
				lRock_emsr.on(EarthMediumStoneRock.EVENT_ON_ANIMATION_ENDED, this._completeSmallStoneAnimation, this);
				lRock_emsr.scale.set(-0.75, 0.75);
				lRock2_emsr.position.set(109, 49);
				lRock2_emsr.rotation = 0.3316125578789226; //Utils.gradToRad(19);
				lRock2_emsr.startAnimation(5);
			}},
			{tweens: [],duration: 5 * FRAME_RATE, onfinish: ()=> {
				let lRock_emsr = lContainer.addChild( new EarthSmallStoneRock() );
				this._fSmallStoneAnimation_emsr_arr.push(lRock_emsr);
				lRock_emsr.on(EarthMediumStoneRock.EVENT_ON_ANIMATION_ENDED, this._completeSmallStoneAnimation, this);
				lRock_emsr.scale.set(-0.98, 0.98);
				lRock_emsr.position.set(-239, 72);
				lRock_emsr.rotation = 0.2617993877991494; //Utils.gradToRad(15);
				lRock_emsr.startAnimation(5);
			}},
			{tweens: [],duration: 2 * FRAME_RATE, onfinish: ()=> {
				let lRock_emsr = lContainer.addChild( new EarthSmallStoneRock() );
				this._fSmallStoneAnimation_emsr_arr.push(lRock_emsr);
				lRock_emsr.on(EarthMediumStoneRock.EVENT_ON_ANIMATION_ENDED, this._completeSmallStoneAnimation, this);
				lRock_emsr.scale.set(-0.69, 0.69);
				lRock_emsr.position.set(-211, 20);
				lRock_emsr.rotation = -0.017453292519943295; //Utils.gradToRad(-1);
				lRock_emsr.startAnimation(5);
			}},
		];
		Sequence.start(this, lTimer_seq);
	}

	_completeSmallStoneAnimation(e)
	{
		let id = this._fSmallStoneAnimation_emsr_arr.indexOf(e.target);
		if (~id)
		{
			e.target && e.target.destroy();
			this._fSmallStoneAnimation_emsr_arr.splice(id, 1);
		}
	}

	_startFinalExplosion()
	{
		let lContainer_sprt = this.addChild(new Sprite());

		//SMOKES...
		const SMOKES6_INFO = [ //6 is part of the smoke asset name
			{
				duration: 73*FRAME_RATE,
				startRotation: 0,
				finalRotation: -0.6283185307179586, //Utils.gradToRad(-36) 
				startScale: 1.19,
				finalScale: 1.5,
				delay: 9*FRAME_RATE,
				startPosition: {x: 20, y: -115},
				finalPosition: {x: 36, y: -2}
			},
			{
				duration: 83*FRAME_RATE,
				startRotation: -0.6283185307179586, //Utils.gradToRad(-36)
				finalRotation: -2.3736477827122884, //Utils.gradToRad(-136)
				startScale: 1.19,
				finalScale: 1.5,
				delay: 4*FRAME_RATE,
				startPosition: {x: -43, y: -52},
				finalPosition: {x: -142, y: -225}
			},
			{
				duration: 73*FRAME_RATE,
				startRotation: 0,
				finalRotation: -0.6283185307179586, //Utils.gradToRad(-36)
				startScale: 1.74,
				finalScale: 2.05,
				delay: 6*FRAME_RATE,
				startPosition: {x: 23, y: -79},
				finalPosition: {x: 124, y: -255}
			},
			{
				duration: 73*FRAME_RATE,
				startRotation: 0,
				finalRotation: 1.9198621771937625, //Utils.gradToRad(110)
				startScale: 1.94,
				finalScale: 2.25,
				delay: 5*FRAME_RATE,
				startPosition: {x: -55, y: 26},
				finalPosition: {x: -434, y: -75}
			},
			{
				duration: 83*FRAME_RATE,
				startRotation: -0.6283185307179586, //Utils.gradToRad(-36)
				finalRotation: -2.3736477827122884, //Utils.gradToRad(-136)
				startScale: 2.02,
				finalScale: 2.34,
				delay: 7*FRAME_RATE,
				startPosition: {x: 57, y: -2},
				finalPosition: {x: -135, y: 202}
			},
			{
				duration: 73*FRAME_RATE,
				startRotation: 0,
				finalRotation: -2.251474735072685, //Utils.gradToRad(-129)
				startScale: 2.15,
				finalScale: 2.46,
				delay: 3*FRAME_RATE,
				startPosition: {x: 131, y: 57},
				finalPosition: {x: 479, y: -37}
			},
		];
		
		for (let lSmoke6Info_obj of SMOKES6_INFO)
		{
			let lSmoke_spr = lContainer_sprt.addChild(APP.library.getSprite("boss_mode/earth/smoke_6"));
			lSmoke_spr.alpha = 0;
			this._fSmoke6_spr_arr.push(lSmoke_spr);
			lSmoke_spr.position = lSmoke6Info_obj.startPosition;
			lSmoke_spr.rotation = lSmoke6Info_obj.startRotation;
			lSmoke_spr.scale.set(lSmoke6Info_obj.startScale);
			lSmoke_spr.rotateTo(lSmoke6Info_obj.finalRotation, lSmoke6Info_obj.duration, undefined, undefined, undefined, false, lSmoke6Info_obj.delay);
			lSmoke_spr.scaleTo(lSmoke6Info_obj.finalScale, lSmoke6Info_obj.duration, undefined, undefined, undefined, false, lSmoke6Info_obj.delay);
			lSmoke_spr.moveTo(lSmoke6Info_obj.finalPosition.x, lSmoke6Info_obj.finalPosition.y, lSmoke6Info_obj.duration, undefined, undefined, undefined, false, lSmoke6Info_obj.delay);

			let lAlphaSequence_arr = [
				{tweens: [{prop: "alpha", from: 0.1, to: 0.8}], duration: 16*FRAME_RATE},
				{tweens: [{prop: "alpha", to: 0}], duration: lSmoke6Info_obj.duration - 16*FRAME_RATE,
				onfinish: () => {
					let id = this._fSmoke6_spr_arr.indexOf(lSmoke_spr);
					if (~id)
					{
						this._fSmoke6_spr_arr.splice(id, 1);
					}
					lSmoke_spr && lSmoke_spr.destroy();
				}
			},
			];
			Sequence.start(lSmoke_spr, lAlphaSequence_arr, lSmoke6Info_obj.delay);
		}

		const ORANGE_SMOKES_INFO = [
			{
				duration: 73*FRAME_RATE,
				startRotation: 0,
				finalRotation: -2.251474735072685, //Utils.gradToRad(-129)
				startScale: 1.13,
				finalScale: 1.44,
				delay: 3*FRAME_RATE,
				startPosition: {x: -55, y: 26},
				finalPosition: {x: 409, y: -92}
			},
			{
				duration: 83*FRAME_RATE,
				startRotation: -0.6283185307179586, //Utils.gradToRad(-36)
				finalRotation: -2.3736477827122884, //Utils.gradToRad(-136)
				startScale: 1.63,
				finalScale: 1.94,
				delay: 5*FRAME_RATE,
				startPosition: {x: 57, y: -2},
				finalPosition: {x: 254, y: 146}
			},
			{
				duration: 73*FRAME_RATE,
				startRotation: 0,
				finalRotation: 1.9198621771937625, //Utils.gradToRad(110)
				startScale: 1.18,
				finalScale: 1.5,
				delay: 7*FRAME_RATE,
				startPosition: {x: 20, y: -112},
				finalPosition: {x: -382, y: 52}
			},
		];
		for (let i=0; i < ORANGE_SMOKES_INFO.length; i++)
		{
			let lInfo_obj = ORANGE_SMOKES_INFO[i];

			let lSmoke_spr = lContainer_sprt.addChild(APP.library.getSprite("boss_mode/earth/smoke_orange"));
			this._fOrangeSmoke_spr_arr.push(lSmoke_spr);
			lSmoke_spr.alpha = 0;
			lSmoke_spr.position = lInfo_obj.startPosition;
			lSmoke_spr.rotation = lInfo_obj.startRotation;
			lSmoke_spr.scale.set(lInfo_obj.startScale);
			lSmoke_spr.rotateTo(lInfo_obj.finalRotation, lInfo_obj.duration, undefined, undefined, undefined, false, lInfo_obj.delay);
			lSmoke_spr.scaleTo(lInfo_obj.finalScale, lInfo_obj.duration, undefined, undefined, undefined, false, lInfo_obj.delay);

			let lPositionXEase_fn, lPositionYEase_fn;
			if (i == 0)
			{
				lPositionXEase_fn = easing.sine.easeOut;
			}
			else if (i == 1)
			{
				lPositionYEase_fn = easing.exponential.easeOut;
			}
			lSmoke_spr.moveXTo(lInfo_obj.finalPosition.x, lInfo_obj.duration, lPositionXEase_fn, undefined, undefined, false, lInfo_obj.delay);
			lSmoke_spr.moveXTo(lInfo_obj.finalPosition.y, lInfo_obj.duration, lPositionYEase_fn, undefined, undefined, false, lInfo_obj.delay);

			let lAlphaSequence_arr = [
				{tweens: [{prop: "alpha", from: 0.1, to: 0.8}], duration: 16*FRAME_RATE},
				{tweens: [{prop: "alpha", to: 0}], duration: lInfo_obj.duration - 16*FRAME_RATE,
				onfinish: () => {
					let id = this._fOrangeSmoke_spr_arr.indexOf(lSmoke_spr);
					if (~id)
					{
						this._fOrangeSmoke_spr_arr.splice(id, 1);
					}
					lSmoke_spr && lSmoke_spr.destroy();
				}
			},
			];
			Sequence.start(lSmoke_spr, lAlphaSequence_arr, lInfo_obj.delay);

		}
		//...SMOKES

		//PARTICLES AND LIGHTS...
		const PARTICLES_INFO = [
			{
				startRotation: 0.07504915783575616, //Utils.gradToRad(4.3)
				finalRotation: 1.0821041362364843, //Utils.gradToRad(62)
				startScale: 0.23,
				finalScale: 0.6,
				startPosition: {x: 15, y: -111},
				finalPosition: {x: 417, y: -216}
			},
			{
				startRotation: 1.5132004614790837, //Utils.gradToRad(86.7)
				finalRotation: 2.600540585471551, //Utils.gradToRad(149)
				startScale: 0.13,
				finalScale: 0.5,
				startPosition: {x: -27, y: -115},
				finalPosition: {x: -330, y: -233}
			},
			{
				startRotation: 2.9670597283903604, //Utils.gradToRad(117)
				finalRotation: 2.9670597283903604, //Utils.gradToRad(170)
				startScale: 0.36,
				finalScale: 0.73,
				startPosition: {x: -105, y: -59},
				finalPosition: {x: -316, y: 91}
			},
			{
				startRotation: 2.007128639793479, //Utils.gradToRad(115)
				finalRotation: 2.4609142453120043, //Utils.gradToRad(141)
				startScale: 0.5,
				finalScale: 0.88,
				startPosition: {x: 4, y: -94},
				finalPosition: {x: 309, y: 131}
			},
		];
		
		const LIGHTS_INFO = [
			{
				startRotation: 0.047123889803846894, //Utils.gradToRad(2.7)
				finalRotation: 0.6632251157578452, //Utils.gradToRad(38)
				startScale: 0.46,
				finalScale: 0.83,
				startPosition: {x: 33, y: -108},
				finalPosition: {x: 464, y: -210}
			},
			{
				startRotation: 1.478293876439197, //Utils.gradToRad(84.7)
				finalRotation: 2.0943951023931953, //Utils.gradToRad(2.7)
				startScale: 1.07,
				finalScale: 1.44,
				startPosition: {x: -42, y: -115},
				finalPosition: {x: -419, y: -253}
			},
			{
				startRotation: 1.9373154697137058, //Utils.gradToRad(111)
				finalRotation: 1.5533430342749535, //Utils.gradToRad(89)
				startScale: 1.3,
				finalScale: 1.67,
				startPosition: {x: -39, y: -50},
				finalPosition: {x: -369, y: 169}
			},
			{
				startRotation: 1.9373154697137058, //Utils.gradToRad(111)
				finalRotation: 1.5533430342749535, //Utils.gradToRad(89)
				startScale: 1,
				finalScale: 1.38,
				startPosition: {x: 94, y: -121},
				finalPosition: {x: 344, y: 194}
			},
		];
		const PARTICLES_AND_LIGHTS_ANIMATION_DURATION = 80*FRAME_RATE;

		for (let lParticlesInfo_obj of PARTICLES_INFO)
		{
			let lParticles_spr = lContainer_sprt.addChild(APP.library.getSprite("boss_mode/common/particles_yellow"));
			this._fParticles_spr_arr.push(lParticles_spr);
			lParticles_spr.alpha = 0;
			lParticles_spr.blendMode = PIXI.BLEND_MODES.ADD;
			lParticles_spr.position = lParticlesInfo_obj.startPosition;
			lParticles_spr.rotation = lParticlesInfo_obj.startRotation;
			lParticles_spr.scale.set(lParticlesInfo_obj.startScale);
			lParticles_spr.rotateTo(lParticlesInfo_obj.finalRotation, PARTICLES_AND_LIGHTS_ANIMATION_DURATION);
			lParticles_spr.scaleTo(lParticlesInfo_obj.finalScale, PARTICLES_AND_LIGHTS_ANIMATION_DURATION);
			lParticles_spr.moveTo(lParticlesInfo_obj.finalPosition.x, lParticlesInfo_obj.finalPosition.y, PARTICLES_AND_LIGHTS_ANIMATION_DURATION);

			const lAlphaSequence_arr = [
				{tweens: [{prop: "alpha", to: 1}], duration: 3*FRAME_RATE},
				{tweens: [], duration: 33*FRAME_RATE},
				{tweens: [{prop: "alpha", to: 0}], duration: 43*FRAME_RATE,
				onfinish: () => {
					let id = this._fParticles_spr_arr.indexOf(lParticles_spr);
					if (~id)
					{
						this._fParticles_spr_arr.splice(id, 1);
					}
					lParticles_spr && lParticles_spr.destroy();
				}
				}
				];

			Sequence.start(lParticles_spr, lAlphaSequence_arr, 1*FRAME_RATE);
		}

		for (let lLightInfo_obj of LIGHTS_INFO)
		{
			let lLight_spr = lContainer_sprt.addChild(APP.library.getSprite("common/light_particle"));
			this._fLight_spr_arr.push(lLight_spr);
			lLight_spr.alpha = 0;
			lLight_spr.blendMode = PIXI.BLEND_MODES.ADD;
			lLight_spr.position = lLightInfo_obj.startPosition;
			lLight_spr.rotation = lLightInfo_obj.startRotation;
			lLight_spr.scale.set(lLightInfo_obj.startScale);
			lLight_spr.rotateTo(lLightInfo_obj.finalRotation, PARTICLES_AND_LIGHTS_ANIMATION_DURATION);
			lLight_spr.scaleTo(lLightInfo_obj.finalScale, PARTICLES_AND_LIGHTS_ANIMATION_DURATION);
			lLight_spr.moveTo(lLightInfo_obj.finalPosition.x, lLightInfo_obj.finalPosition.y, PARTICLES_AND_LIGHTS_ANIMATION_DURATION);

			const lAlphaSequence_arr = [
				{tweens: [{prop: "alpha", to: 1}], duration: 3*FRAME_RATE},
				{tweens: [], duration: 33*FRAME_RATE},
				{tweens: [{prop: "alpha", to: 0}], duration: 43*FRAME_RATE,
				onfinish: () => {
					let id = this._fLight_spr_arr.indexOf(lLight_spr);
					if (~id)
					{
						this._fLight_spr_arr.splice(id, 1);
					}
					lLight_spr && lLight_spr.destroy();
				}
			}
			];

			Sequence.start(lLight_spr, lAlphaSequence_arr, 1*FRAME_RATE);
		}
		//...PARTICLES AND LIGHTS

		let lLightCircle_sprt = this._fLightCircle_sprt = lContainer_sprt.addChild(this._createLight("boss_mode/common/circle_blast", 0.15, 0.6));
		lLightCircle_sprt.position.set(5, 20);
		lLightCircle_sprt.blendMode = PIXI.BLEND_MODES.ADD;
		let lSecondLightCircle_sprt = this._fSecondLightCircle_sprt = lContainer_sprt.addChild(this._createLight("boss_mode/common/circle_blast", 0.15, 0.48));
		lSecondLightCircle_sprt.position.set(5, 20);
		lSecondLightCircle_sprt.blendMode = PIXI.BLEND_MODES.ADD;
		let lLightCircleAnimation_seq = [
			{tweens: [ {prop: "scale.x", to: 1.1}, {prop: "scale.y", to: 1.1} ], duration: 4*FRAME_RATE},
			{tweens: [ {prop: "scale.x", to: 5}, {prop: "scale.y", to: 5}, {prop: "alpha", to: 0.5} ], duration: 4*FRAME_RATE},
			{tweens: [ {prop: "scale.x", to: 8}, {prop: "scale.y", to: 8}, {prop: "alpha", to: 0} ], duration: 4*FRAME_RATE},
		];
		Sequence.start(lLightCircle_sprt, lLightCircleAnimation_seq, 4*FRAME_RATE);
		Sequence.start(lSecondLightCircle_sprt, lLightCircleAnimation_seq, 4*FRAME_RATE);

		let lLight_sprt = this._fFinalLight_sprt = lContainer_sprt.addChild(this._createLight("common/misty_flare", 0.19, 0.6));
		lLight_sprt.blendMode = PIXI.BLEND_MODES.ADD;

		let lScaleLight_seq = [
			{tweens: [ {prop: "scale.x", to: 8.49}, {prop: "scale.y", to: 8.49} ],duration: 2*FRAME_RATE},
			{tweens: [ {prop: "scale.x", to: 0}, {prop: "scale.y", to: 0} ],duration: 57*FRAME_RATE},
		];
		let lAlphaLight_seq = [
			{tweens: [],duration: 12*FRAME_RATE},
			{tweens: [ {prop: "alpha", to: 0} ],duration: 47*FRAME_RATE, onfinish: ()=>{
				lLight_sprt.destroy();
			}},
		];
		
		Sequence.start(lLight_sprt, lScaleLight_seq);
		Sequence.start(lLight_sprt, lAlphaLight_seq);

		let lTimer_seq = [
			{tweens: [],duration: 1 * FRAME_RATE, onfinish: ()=>{
				let lLight_sprt = this._fFinalLight2_sprt = lContainer_sprt.addChild(this._createLight("boss_mode/common/fx_light_2", 4.72, 0));
				lLight_sprt.blendMode = PIXI.BLEND_MODES.ADD;
				let lAlphaLight_seq = [
					{tweens: [ {prop: "alpha", to: 0.48} ],duration: 1*FRAME_RATE},
					{tweens: [ {prop: "alpha", to: 0} ],duration: 20*FRAME_RATE, onfinish: ()=>{
						lLight_sprt.destroy();
					}},
				];
				Sequence.start(lLight_sprt, lAlphaLight_seq);

				let lLightCircle_sprt = this._fFinalLightCircle1_sprt = lContainer_sprt.addChild(this._createLight("boss_mode/common/light_circle_1", 0.84));
				lLightCircle_sprt.blendMode = PIXI.BLEND_MODES.ADD;
				let lLightCircle2_sprt = this._fFinalLightCircle2_sprt = lContainer_sprt.addChild(this._createLight("boss_mode/common/light_circle_2", 0.84));
				lLightCircle2_sprt.blendMode = PIXI.BLEND_MODES.ADD;
				let lScaleLightCircle_seq = [
					{tweens: [ {prop: "scale.x", to: 11.66}, {prop: "scale.y", to: 11.66} ], duration: 8*FRAME_RATE},
				];
				let lAlphaLightCircle_seq = [
					{tweens: [ {prop: "alpha", to: 0} ],duration: 7*FRAME_RATE, onfinish: lLightCircle_sprt.destroy.bind(lLightCircle_sprt)},
				];
				let lAlphaLightCircle2_seq = [
					{tweens: [ {prop: "alpha", to: 0} ],duration: 7*FRAME_RATE, onfinish: lLightCircle2_sprt.destroy.bind(lLightCircle2_sprt)},
				];
				Sequence.start(lLightCircle_sprt, lScaleLightCircle_seq, 1*FRAME_RATE);
				Sequence.start(lLightCircle_sprt, lAlphaLightCircle_seq, 2*FRAME_RATE);
				Sequence.start(lLightCircle2_sprt, lScaleLightCircle_seq, 1*FRAME_RATE);
				Sequence.start(lLightCircle2_sprt, lAlphaLightCircle2_seq, 2*FRAME_RATE);
			}},
			{tweens: [],duration: 2 * FRAME_RATE, onfinish: ()=>{
				let lLight_sprt = this._fFinalLight3_sprt = lContainer_sprt.addChild(this._createLight("boss_mode/common/circle_blast", 0.14, 0.48));
				lLight_sprt.blendMode = PIXI.BLEND_MODES.ADD;
				let lAlphaLight_seq = [
					{tweens: [],duration: 4*FRAME_RATE},
					{tweens: [ {prop: "alpha", to: 0} ],duration: 8*FRAME_RATE},
				];
				let lScaleLight_seq = [
					{tweens: [ {prop: "scale.x", to: 1}, {prop: "scale.y", to: 1} ],duration: 4*FRAME_RATE},
					{tweens: [ {prop: "scale.x", to: 7.2}, {prop: "scale.y", to: 7.2} ],duration: 20*FRAME_RATE, onfinish: ()=>{
						lLight_sprt.destroy();
					}},
				];
				Sequence.start(lLight_sprt, lAlphaLight_seq);
				Sequence.start(lLight_sprt, lScaleLight_seq);

				let lLightCircle_sprt = this._fFinalLightCircle3_sprt = lContainer_sprt.addChild(this._createLight("boss_mode/common/circle_blast", 0.15, 1));
				lLightCircle_sprt.position.set(5, 20);
				lLightCircle_sprt.blendMode = PIXI.BLEND_MODES.ADD;
				let lScaleLightCircle_seq = [
					{tweens: [ {prop: "scale.x", to: 14}, {prop: "scale.y", to: 14} ], duration: 20*FRAME_RATE, onfinish: lLightCircle_sprt.destroy.bind(lLightCircle_sprt)},
				];
				let lAlphaLightCircle_seq = [
					{tweens: [ {prop: "alpha", to: 0} ], duration: 8*FRAME_RATE},
				];
				Sequence.start(lLightCircle_sprt, lScaleLightCircle_seq);
				Sequence.start(lLightCircle_sprt, lAlphaLightCircle_seq, 4*FRAME_RATE);
			}},
			{tweens: [],duration: 3 * FRAME_RATE, onfinish: ()=>{
				let lLight_sprt = this._fFinalLightparticle_sprt = lContainer_sprt.addChild(this._createLight("common/light_particle", 0.52));
				lLight_sprt.blendMode = PIXI.BLEND_MODES.ADD;
				let lScaleLight_seq = [
					{tweens: [ {prop: "scale.x", to: 17.67}, {prop: "scale.y", to: 17.67} ],duration: 11*FRAME_RATE, onfinish: ()=>{
						lLight_sprt.destroy();
					}},
				];
				Sequence.start(lLight_sprt, lScaleLight_seq);
			}},
		];
		lContainer_sprt.position.set(0, -130);
		Sequence.start(this, lTimer_seq);
	}

	destroy()
	{
		for (let l_spr of this._fSmoke_sprt_arr)
		{
			Sequence.destroy(Sequence.findByTarget(l_spr));
			l_spr && l_spr.destroy();
		}
		this._fSmoke_sprt_arr = [];

		for (let l_spr of this._fLight_sprt_arr )
		{
			Sequence.destroy(Sequence.findByTarget(l_spr));
			l_spr && l_spr.destroy();
		}
		this._fLight_sprt_arr = [];

		for (let l_spr of this._fEarthSmallStone_emsr_arr )
		{
			Sequence.destroy(Sequence.findByTarget(l_spr));
			l_spr && l_spr.destroy();
		}
		this._fEarthSmallStone_emsr_arr = [];

		Sequence.destroy(Sequence.findByTarget(this._fOpticalFlare_spr));
		this._fOpticalFlare_spr && this._fOpticalFlare_spr.destroy();
		this._fOpticalFlare_spr = null;

		Sequence.destroy(Sequence.findByTarget(this._fDarkBackground_g));
		this._fDarkBackground_g && this._fDarkBackground_g.destroy();
		this._fDarkBackground_g = null;

		Sequence.destroy(Sequence.findByTarget(this._fLightParticle_spr));
		this._fLightParticle_spr && this._fLightParticle_spr.destroy();
		this._fLightParticle_spr = null;

		for (let l_spr of this._fFlame_spr_arr )
		{
			Sequence.destroy(Sequence.findByTarget(l_spr));
			l_spr && l_spr.destroy();
		}
		this._fFlame_spr_arr = [];

		for (let l_spr of this._fParticles_arr )
		{
			Sequence.destroy(Sequence.findByTarget(l_spr));
			l_spr && l_spr.destroy();
		}
		this._fParticles_arr = [];

		for (let l_spr of this._fLightParticleAnimation_spr_arr )
		{
			Sequence.destroy(Sequence.findByTarget(l_spr));
			l_spr && l_spr.destroy();
		}
		this._fLightParticleAnimation_spr_arr = [];

		for (let l_spr of this._fLightAnimation_spr_arr )
		{
			Sequence.destroy(Sequence.findByTarget(l_spr));
			l_spr && l_spr.destroy();
		}
		this._fLightAnimation_spr_arr = [];

		for (let l_spr of this._fLightParticleYellowAnimation_spr_arr )
		{
			Sequence.destroy(Sequence.findByTarget(l_spr));
			l_spr && l_spr.destroy();
		}
		this._fLightParticleYellowAnimation_spr_arr = [];

		for (let l_spr of this._fLightCircleAnimation_spr_arr )
		{
			Sequence.destroy(Sequence.findByTarget(l_spr));
			l_spr && l_spr.destroy();
		}
		this._fLightCircleAnimation_spr_arr = [];

		Sequence.destroy(Sequence.findByTarget(this._fLight1_spr));
		this._fLight1_spr && this._fLight1_spr.destroy();
		this._fLight1_spr = null;

		Sequence.destroy(Sequence.findByTarget(this._fLightCircle1_spr));
		this._fLightCircle1_spr && this._fLightCircle1_spr.destroy();
		this._fLightCircle1_spr = null;

		Sequence.destroy(Sequence.findByTarget(this._fLight2_spr));
		this._fLight2_spr && this._fLight2_spr.destroy();
		this._fLight2_spr = null;

		Sequence.destroy(Sequence.findByTarget(this._fLightCircle2_spr));
		this._fLightCircle2_spr && this._fLightCircle2_spr.destroy();
		this._fLightCircle2_spr = null;

		Sequence.destroy(Sequence.findByTarget(this._fLight3_spr));
		this._fLight3_spr && this._fLight3_spr.destroy();
		this._fLight3_spr = null;

		Sequence.destroy(Sequence.findByTarget(this._fLightCircle3_spr));
		this._fLightCircle3_spr && this._fLightCircle3_spr.destroy();
		this._fLightCircle3_spr = null;

		Sequence.destroy(Sequence.findByTarget(this._fLight4_spr));
		this._fLight4_spr && this._fLight4_spr.destroy();
		this._fLight4_spr = null;

		for (let l_spr of this._fSmokeTrailAnimation_emsr_arr )
		{
			Sequence.destroy(Sequence.findByTarget(l_spr));
			l_spr && l_spr.destroy();
		}
		this._fSmokeTrailAnimation_emsr_arr = [];

		for (let l_spr of this._fLightParticleYellow_sprt_arr )
		{
			Sequence.destroy(Sequence.findByTarget(l_spr));
			l_spr && l_spr.destroy();
		}
		this._fLightParticleYellow_sprt_arr = [];

		for (let l_spr of this._fExplosionAnimationSmoke_spr_arr )
		{
			Sequence.destroy(Sequence.findByTarget(l_spr));
			l_spr && l_spr.destroy();
		}
		this._fExplosionAnimationSmoke_spr_arr = [];

		for (let l_spr of this._fMediumStoneAnimation_emsr_arr )
		{
			Sequence.destroy(Sequence.findByTarget(l_spr));
			l_spr && l_spr.destroy();
		}
		this._fMediumStoneAnimation_emsr_arr = [];

		for (let l_spr of this._fSmallStoneAnimation_emsr_arr )
		{
			Sequence.destroy(Sequence.findByTarget(l_spr));
			l_spr && l_spr.destroy();
		}
		this._fSmallStoneAnimation_emsr_arr = [];

		for (let l_spr of this._fSmoke6_spr_arr )
		{
			Sequence.destroy(Sequence.findByTarget(l_spr));
			l_spr && l_spr.destroy();
		}
		this._fSmoke6_spr_arr = [];

		for (let l_spr of this._fOrangeSmoke_spr_arr )
		{
			Sequence.destroy(Sequence.findByTarget(l_spr));
			l_spr && l_spr.destroy();
		}
		this._fOrangeSmoke_spr_arr = [];

		for (let l_spr of this._fParticles_spr_arr )
		{
			Sequence.destroy(Sequence.findByTarget(l_spr));
			l_spr && l_spr.destroy();
		}
		this._fParticles_spr_arr = [];

		for (let l_spr of this._fLight_spr_arr )
		{
			Sequence.destroy(Sequence.findByTarget(l_spr));
			l_spr && l_spr.destroy();
		}
		this._fLight_spr_arr = [];

		Sequence.destroy(Sequence.findByTarget(this._fLightCircle_sprt));
		this._fLightCircle_sprt && this._fLightCircle_sprt.destroy();
		this._fLightCircle_sprt = null;

		Sequence.destroy(Sequence.findByTarget(this._fSecondLightCircle_sprt));
		this._fSecondLightCircle_sprt && this._fSecondLightCircle_sprt.destroy();
		this._fSecondLightCircle_sprt = null;

		Sequence.destroy(Sequence.findByTarget(this._fFinalLight_sprt));
		this._fFinalLight_sprt && this._fFinalLight_sprt.destroy();
		this._fFinalLight_sprt = null;

		Sequence.destroy(Sequence.findByTarget(this._fFinalLight2_sprt));
		this._fFinalLight2_sprt && this._fFinalLight2_sprt.destroy();
		this._fFinalLight2_sprt = null;

		Sequence.destroy(Sequence.findByTarget(this._fFinalLightCircle1_sprt));
		this._fFinalLightCircle1_sprt && this._fFinalLightCircle1_sprt.destroy();
		this._fFinalLightCircle1_sprt = null;

		Sequence.destroy(Sequence.findByTarget(this._fFinalLightCircle2_sprt));
		this._fFinalLightCircle2_sprt && this._fFinalLightCircle2_sprt.destroy();
		this._fFinalLightCircle2_sprt = null;

		Sequence.destroy(Sequence.findByTarget(this._fFinalLight3_sprt));
		this._fFinalLight3_sprt && this._fFinalLight3_sprt.destroy();
		this._fFinalLight3_sprt = null;

		Sequence.destroy(Sequence.findByTarget(this._fFinalLightCircle3_sprt));
		this._fFinalLightCircle3_sprt && this._fFinalLightCircle3_sprt.destroy();
		this._fFinalLightCircle3_sprt = null;

		Sequence.destroy(Sequence.findByTarget(this._fFinalLightparticle_sprt));
		this._fFinalLightparticle_sprt && this._fFinalLightparticle_sprt.destroy();
		this._fFinalLightparticle_sprt = null;

		Sequence.destroy(Sequence.findByTarget(this));

		this._fUpperContiner_spr && this._fUpperContiner_spr.destroy();
		this._fUpperContiner_spr = null;

		this._fBottomContainer_spr && this._fBottomContainer_spr.destroy();
		this._fBottomContainer_spr = null;

		this.__onBossDeathAnimationCompleted();

		super.destroy();
	}
}

export default EarthBossDeathFxAnimation;