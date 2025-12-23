import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import AtlasSprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import AtlasConfig from '../../../config/AtlasConfig';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../shared/src/CommonConstants';
import ProfilingInfo from '../../../../../../common/PIXI/src/dgphoenix/unified/model/profiling/ProfilingInfo';
import MTimeLine from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/timeLine/MTimeLine';

class DeathFxAnimation extends Sprite
{
	
	static get EVENT_OUTRO_STARTED() 		{ return "EVENT_OUTRO_STARTED" };
	static get EVENT_ANIMATION_COMPLETED() 	{ return "EVENT_ANIMATION_COMPLETED" };
	static get EVENT_ON_DEATH_COIN_AWARD()	{ return "eventDeathFxCoinAward" }

	playAnimation(aIsInstantKill_bl = false)
	{
		this._playAnimation(aIsInstantKill_bl);
	}

	constructor()
	{
		super();

		this._fTimeline_mtl = null;
	}

	_playAnimation(aIsInstantKill_bl = false)
	{
		DeathFxAnimation.initTextures();

		let lCircleSmoke_sprt = this.addChild(APP.library.getSprite("death/smoke_circle"));
		lCircleSmoke_sprt.blendMode = PIXI.BLEND_MODES.ADD;

		this._fTimeline_mtl = new MTimeLine();
		
		if (!aIsInstantKill_bl)
		{
			// ORB...
			let lDeathOrb_sprt = this.addChild(APP.library.getSprite("death/death_orb"));
			lDeathOrb_sprt.scale.set(0.5);

			this._fTimeline_mtl.addAnimation(
				lDeathOrb_sprt,
				MTimeLine.SET_SCALE_X,
				0.5,
				[
					[1, 20]
				]
			);
			this._fTimeline_mtl.addAnimation(
				lDeathOrb_sprt,
				MTimeLine.SET_SCALE_Y,
				0.5,
				[
					[1, 20]
				]
			);
			this._fTimeline_mtl.addAnimation(
				lDeathOrb_sprt,
				MTimeLine.SET_ALPHA,
				1,
				[
					5,
					[0, 13]
				]
			);
			// ...ORB

			// FLARE...
			let lFlare_sprt = this.addChild(APP.library.getSprite("death/flare"));
			lFlare_sprt.blendMode = PIXI.BLEND_MODES.ADD;
			lFlare_sprt.scale.set(0);

			this._fTimeline_mtl.addAnimation(
				lFlare_sprt,
				MTimeLine.SET_SCALE_X,
				0,
				[
					3,
					[1, 2],
					[0.63, 2],
					[0, 2]
				]
			);
			this._fTimeline_mtl.addAnimation(
				lFlare_sprt,
				MTimeLine.SET_SCALE_Y,
				0,
				[
					3,
					[1, 2],
					[1.25, 2],
					[0, 2]
				]
			);
			// ...FLARE
		}

		// SMOKE CIRCLE...
		this._fTimeline_mtl.addAnimation(
			lCircleSmoke_sprt,
			MTimeLine.SET_SCALE_X,
			1,
			[
				[2.5, 10]
			]
		);
		this._fTimeline_mtl.addAnimation(
			lCircleSmoke_sprt,
			MTimeLine.SET_SCALE_Y,
			1,
			[
				[2.5, 10]
			]
		);
		this._fTimeline_mtl.addAnimation(
			lCircleSmoke_sprt,
			MTimeLine.SET_ALPHA,
			1,
			[
				7,
				[0, 3]
			]
		);
		// ...SMOKE CIRCLE

		if (aIsInstantKill_bl)
		{
			this._coinAward();
		}
		else
		{
			this._fTimeline_mtl.callFunctionAtFrame(this._coinAward, 12, this);
		}

		this._fTimeline_mtl.callFunctionOnFinish(this._destroyAll, this);

		this._fTimeline_mtl.play();
		
		if (!APP.profilingController.info.isVfxProfileValueLessThan(ProfilingInfo.i_VFX_LEVEL_PROFILE_VALUES.LOWER) && !aIsInstantKill_bl)
		{
			this._playEffect('energyBurst', PIXI.BLEND_MODES.ADD, 2);
		}
	}

	_playEffect(texturesName, blendMode = PIXI.BLEND_MODES.NORMAL, scale = 1, callback = null)
	{
		let effect = this.addChild(new Sprite());
		effect.textures = DeathFxAnimation.textures[texturesName];
		effect.blendMode = blendMode;
		effect.scale.set(scale);
		effect.play();
		effect.once('animationend', (e) => {
			e.target.destroy();
			if (callback)
			{
				callback.call();
			}
		});
		return effect;
	}

	_destroyAll()
	{
		this.emit(DeathFxAnimation.EVENT_ANIMATION_COMPLETED);
		this.destroy();
	}

	_coinAward()
	{
		this.emit(DeathFxAnimation.EVENT_ON_DEATH_COIN_AWARD);
	}

	destroy()
	{
		this._fTimeline_mtl && this._fTimeline_mtl.destroy();
		this._fTimeline_mtl = null;
		Sequence.destroy(Sequence.findByTarget(this));
		super.destroy();
	}
}

DeathFxAnimation.textures = {
	energyBurst: null
};

let imageNames = [],
	configs = [];

imageNames.push('death/energy_burst');
configs.push(AtlasConfig.EnergyBurst);

DeathFxAnimation.setTexture = function (name, imageNames, configs, path)
{
	if (!DeathFxAnimation.textures[name])
	{
		DeathFxAnimation.textures[name] = [];

		if(!Array.isArray(imageNames)) imageNames = [imageNames];
		if(!Array.isArray(configs)) configs = [configs];

		let assets = [];
		imageNames.forEach(function(item){assets.push(APP.library.getAsset(item))});

		DeathFxAnimation.textures[name] = AtlasSprite.getFrames(assets, configs, path);
		DeathFxAnimation.textures[name].sort(function(a, b){if(a._atlasName > b._atlasName) return 1; else return -1});
	}
};

DeathFxAnimation.initTextures = function()
{
	DeathFxAnimation.setTexture('energyBurst', imageNames, configs, 'MQ_SX_EnergyFX');
}


export default DeathFxAnimation;