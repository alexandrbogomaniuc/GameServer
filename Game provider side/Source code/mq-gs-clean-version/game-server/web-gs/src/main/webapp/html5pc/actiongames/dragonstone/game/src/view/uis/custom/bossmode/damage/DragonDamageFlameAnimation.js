import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../../../shared/src/CommonConstants';
import Sprite from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { Utils } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import Sequence from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import AtlasSprite from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import AtlasConfig from '../../../../../config/AtlasConfig';
import Timer from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';

export const DRAGON_DAMAGE_FLARE_TYPES = 
{
	TYPE_1: 1,
	TYPE_2: 2,
	TYPE_3: 3
}

const CRACK_SETTINGS = {
	[DRAGON_DAMAGE_FLARE_TYPES.TYPE_1] : {scale: {x: 1, y: -1}, angle: 10},
	[DRAGON_DAMAGE_FLARE_TYPES.TYPE_2] : {scale: {x: 1, y: 1.1}, angle: 0},
	[DRAGON_DAMAGE_FLARE_TYPES.TYPE_3] : {scale: {x: 1, y: 1.1}, angle: 0},
}

const RAY_SETTINGS = {
	[DRAGON_DAMAGE_FLARE_TYPES.TYPE_1] : {scale: {x: -0.35, y: -0.4}, angle: 18},
	[DRAGON_DAMAGE_FLARE_TYPES.TYPE_2] : {scale: {x: -0.70, y: -0.45}, angle: -8},
	[DRAGON_DAMAGE_FLARE_TYPES.TYPE_3] : {scale: {x: -0.70, y: -0.45}, angle: -20}
}

const FLAME_SETTINGS = {
	[DRAGON_DAMAGE_FLARE_TYPES.TYPE_1] : {texturesName: "dragon_torch_v1", startFrame: 0, isWideStretched: false},
	[DRAGON_DAMAGE_FLARE_TYPES.TYPE_2] : {texturesName: "dragon_torch_v2", startFrame: 0, isWideStretched: true},
	[DRAGON_DAMAGE_FLARE_TYPES.TYPE_3] : {texturesName: "dragon_torch_v3", startFrame: 2, isWideStretched: true}
}

class DragonDamageFlameAnimation extends Sprite
{
	startAnimation(aDelay_num)
	{
		if (aDelay_num > 0)
		{
			this._fTimer_t = new Timer( () => {
													this._startAnimation();
												}, 
										aDelay_num
									);
			return;
		}

		this._startAnimation();
	}

	constructor(aAnimationType=DRAGON_DAMAGE_FLARE_TYPES.TYPE_1)
	{
		super();

		DragonDamageFlameAnimation.initTextures();

		this._animType = aAnimationType;
		this._contentContainer = this.addChild(new Sprite);

		this._fTimer_t = null;
	}

	_startAnimation()
	{
		let lProfilingInfo = APP.profilingController.info;

		let lCont_sprt = this._contentContainer;

		// debug...
		// let grb = lCont_sprt.addChild(new PIXI.Graphics());
		// grb.beginFill(0x000000).drawCircle(0, 0, 30).endFill();
		// ...debug

		this._showCrack();
		if (lProfilingInfo.isVfxProfileValueMediumOrGreater)
		{
			this._showRay();
			this._showSplat();
			this._showGlow();
		}
		
		this._showTorch();

		// debug...
		// let gr = this._contentContainer.addChild(new PIXI.Graphics());
		// gr.beginFill(0xff0000).drawCircle(0, 0, 3).endFill();
		// ...debug

		let lFlameSettings = FLAME_SETTINGS[this._animType];
		if (lFlameSettings.isWideStretched && lProfilingInfo.isVfxProfileValueMediumOrGreater)
		{
			this._playStretchCycle();
		}
	}

	_showCrack()
	{
		let lCrack_sprt = this._contentContainer.addChild(APP.library.getSpriteFromAtlas('boss_mode/damage/crack'));
		let lCrackSettings = CRACK_SETTINGS[this._animType];

		lCrack_sprt.scale.set(lCrackSettings.scale.x, lCrackSettings.scale.y);
		lCrack_sprt.rotation = Utils.gradToRad(lCrackSettings.angle);
	}

	_showRay()
	{
		let lRay_sprt = this._contentContainer.addChild(new Sprite);
		lRay_sprt.textures = DragonDamageFlameAnimation["god_defeated_ray"];
		
		let lRaySettings = RAY_SETTINGS[this._animType];

		lRay_sprt.anchor.set(0.49, 0.27);
		lRay_sprt.blendMode = PIXI.BLEND_MODES.ADD;
		lRay_sprt.x = 5;
		lRay_sprt.scale.set(lRaySettings.scale.x*4, 0);
		lRay_sprt.rotation = Utils.gradToRad(lRaySettings.angle);
		lRay_sprt.alpha = 0;

		let l_seq = [
			{
				tweens: [],
				duration: 2*FRAME_RATE,
				onfinish: () => { lRay_sprt.alpha = 1; }
			},
			{
				tweens: [
					{ prop: 'scale.y', to: lRaySettings.scale.y*4}
				],
				duration: 3*FRAME_RATE
			}
		]
		Sequence.start(lRay_sprt, l_seq);
	}

	_showSplat()
	{
		let lSplat_sprt = this._contentContainer.addChild(new Sprite);
		lSplat_sprt.textures = DragonDamageFlameAnimation["god_defeated_splat"];
		lSplat_sprt.blendMode = PIXI.BLEND_MODES.ADD;
		lSplat_sprt.alpha = 0;

		let l_seq = [
			{
				tweens: [],
				duration: 1*FRAME_RATE,
				onfinish: () => { lSplat_sprt.alpha = 1; }
			},
			{
				tweens: [
					{ prop: 'alpha', to: 0}
				],
				duration: 7*FRAME_RATE
			}
		]
		Sequence.start(lSplat_sprt, l_seq);
	}

	_showGlow()
	{
		let lGlow_sprt = this._contentContainer.addChild(APP.library.getSprite('common/crate_glow'));
		lGlow_sprt.blendMode = PIXI.BLEND_MODES.ADD;
		lGlow_sprt.scale.set(0.8);
	}

	_showTorch()
	{
		let lFlameSettings = FLAME_SETTINGS[this._animType];
		let lTorch_sprt = this._contentContainer.addChild(Sprite.createMultiframesSprite(DragonDamageFlameAnimation[lFlameSettings.texturesName], lFlameSettings.startFrame));
		lTorch_sprt.anchor.set(0.52, 0.69);
		lTorch_sprt.blendMode = PIXI.BLEND_MODES.ADD;
		lTorch_sprt.animationSpeed = 8/60;
		lTorch_sprt.play();

		lTorch_sprt.scale.y = 0;

		let l_seq = [
			{
				tweens: [
					{ prop: 'scale.y', to: 1.2}
				],
				duration: 2*FRAME_RATE
			},
			{
				tweens: [
					{ prop: 'scale.y', to: 1}
				],
				duration: 3*FRAME_RATE
			}
		]
		Sequence.start(lTorch_sprt, l_seq);
	}

	_playStretchCycle()
	{
		let lCont_sprt = this._contentContainer;
		let lTargetScale = lCont_sprt.scale.x == 1 ? 1.4 : 1;
		lCont_sprt.scaleXTo(lTargetScale, 300*FRAME_RATE, undefined, () => { this._onStretchCycleCompleted(); })
	}

	_onStretchCycleCompleted()
	{
		this._playStretchCycle();
	}

	destroy()
	{
		this._fTimer_t && this._fTimer_t.destructor();
		this._fTimer_t = null;

		for (let i=0; i<this._contentContainer.children.length; i++)
		{
			let lChild = this._contentContainer.children[i];
			Sequence.destroy(Sequence.findByTarget(lChild));
		}

		this._animType = null;
		this._contentContainer = null;

		super.destroy();
	}
}

export default DragonDamageFlameAnimation

DragonDamageFlameAnimation.initTextures = function()
{
	DragonDamageFlameAnimation.setTexture('dragon_torch_v1', ["boss_mode/damage/damage_assets"], [AtlasConfig.DragonDamageTorches], 'dragon_torch_v1');
	DragonDamageFlameAnimation.setTexture('dragon_torch_v2', ["boss_mode/damage/damage_assets"], [AtlasConfig.DragonDamageTorches], 'dragon_torch_v2');
	DragonDamageFlameAnimation.setTexture('dragon_torch_v3', ["boss_mode/damage/damage_assets"], [AtlasConfig.DragonDamageTorches], 'dragon_torch_v3');
	DragonDamageFlameAnimation.setTexture('god_defeated_ray', ["boss_mode/damage/damage_assets"], [AtlasConfig.DragonDamageTorches], 'god_defeated_ray');
	DragonDamageFlameAnimation.setTexture('god_defeated_splat', ["boss_mode/damage/damage_assets"], [AtlasConfig.DragonDamageTorches], 'god_defeated_splat');
}

DragonDamageFlameAnimation.setTexture = function (name, imageNames, configs, path)
{
	if (!DragonDamageFlameAnimation[name])
	{
		DragonDamageFlameAnimation[name] = [];

		if(!Array.isArray(imageNames)) imageNames = [imageNames];
		if(!Array.isArray(configs)) configs = [configs];

		let assets = [];
		imageNames.forEach(function(item){assets.push(APP.library.getAsset(item))});

		DragonDamageFlameAnimation[name] = AtlasSprite.getFrames(assets, configs, path);
		DragonDamageFlameAnimation[name].sort(function(a, b){if(a._atlasName > b._atlasName) return 1; else return -1});
	}
};