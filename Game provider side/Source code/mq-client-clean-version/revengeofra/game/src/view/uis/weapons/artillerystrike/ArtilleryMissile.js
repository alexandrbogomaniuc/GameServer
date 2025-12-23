import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import AtlasSprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import AtlasConfig from '../../../../config/AtlasConfig';

class ArtilleryMissile extends Sprite {

	static get EVENT_ON_ANIMATION_END() { return 'EVENT_ON_ANIMATION_END'; }

	i_hideMissile()
	{
		this._hideMissile();
	}

	constructor()
	{
		super();

		APP.profilingController.info.isVfxDynamicProfileValueMediumOrGreater && ArtilleryMissile.initTextures();

		this._fMissile_sprt = null;
		this._fFireloop_sprt = null;
		this._fSmokeTrail_sprt = null;

		this._createView();	
	}

	_createView()
	{
		let missile = APP.library.getSprite('weapons/ArtilleryStrike/missile');
		missile.anchor.set(0.5, 0);
		let fireloop = APP.library.getSprite('weapons/ArtilleryStrike/fireloop');
		fireloop.anchor.set(0.5, 0);
		fireloop.blendMode = PIXI.BLEND_MODES.SCREEN;
		this.addChild(missile);
		this.addChild(fireloop);

		let lMissileBounds_obj = missile.getBounds();
		fireloop.y = lMissileBounds_obj.height - 10;

		this._fMissile_sprt = missile;
		this._fFireloop_sprt = fireloop;

		APP.profilingController.info.isVfxDynamicProfileValueMediumOrGreater && this._addSmokeTrail(fireloop.x, fireloop.y);
	}

	_addSmokeTrail(x,  y)
	{
		let smokeTrail = this.addChild(new Sprite);
		smokeTrail.position.set(x, y);
		smokeTrail.alpha = 0.7;
		smokeTrail.scale.set(2);
		smokeTrail.textures = ArtilleryMissile.textures.smokeTrail;
		smokeTrail.anchor.set(740/960, 291/540);
		smokeTrail.rotation = -Math.PI/2;
		smokeTrail.once('animationend', _=> {
			smokeTrail.destroy();
			this._fSmokeTrail_sprt = null;
			this._onAnimationEndSuspicion();
		})
		smokeTrail.play();

		this._fSmokeTrail_sprt = smokeTrail;
	}

	_onAnimationEndSuspicion()
	{
		if (!this._fSmokeTrail_sprt && !this._fMissile_sprt)
		{
			this._onAnimationEnd();
		}
	}

	_onAnimationEnd()
	{
		this.emit(ArtilleryMissile.EVENT_ON_ANIMATION_END);
	}

	_hideMissile()
	{
		this._fMissile_sprt.destroy();
		this._fFireloop_sprt.destroy();

		this._fMissile_sprt = null;
		this._fFireloop_sprt = null;

		this._onAnimationEndSuspicion();
	}

	destroy()
	{
		this.removeAllListeners();

		super.destroy();
	}
}

ArtilleryMissile.textures = {
	smokeTrail: null
};

ArtilleryMissile.setTexture = function (name, imageNames, configs, path) {
	if(!ArtilleryMissile.textures[name]){
		ArtilleryMissile.textures[name] = [];

		if(!Array.isArray(imageNames)) imageNames = [imageNames];
		if(!Array.isArray(configs)) configs = [configs];

		let assets = [];
		imageNames.forEach(function(item){assets.push(APP.library.getAsset(item))});

		ArtilleryMissile.textures[name] = AtlasSprite.getFrames(assets, configs, path);
		ArtilleryMissile.textures[name].sort(function(a, b){if(a._atlasName > b._atlasName) return 1; else return -1});
	}
};

ArtilleryMissile.initTextures = function(){
	ArtilleryMissile.setTexture('smokeTrail', 'weapons/ArtilleryStrike/smoke_trail', AtlasConfig.SmokeTrail, '');
};

export default ArtilleryMissile;