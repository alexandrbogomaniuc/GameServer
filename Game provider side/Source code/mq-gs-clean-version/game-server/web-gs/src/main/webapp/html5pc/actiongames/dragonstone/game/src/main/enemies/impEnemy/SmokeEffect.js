import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import AtlasConfig from '../../../config/AtlasConfig';
import { AtlasSprite } from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';

let SmokeClouds = {
	textures: {
		smoke: null
	}
};

SmokeClouds.setTexture = function (name, imageNames, configs, path) {
	if(!SmokeClouds.textures[name]){
		SmokeClouds.textures[name] = [];

		if(!Array.isArray(imageNames)) imageNames = [imageNames];
		if(!Array.isArray(configs)) configs = [configs];

		let assets = [];
		imageNames.forEach(function(item){assets.push(APP.library.getAsset(item))});

		SmokeClouds.textures[name] = AtlasSprite.getFrames(assets, configs, path);
		SmokeClouds.textures[name].sort(function(a, b){if(a._atlasName > b._atlasName) return 1; else return -1});
	}
};

SmokeClouds.generateSmokeCloudsTextures = function()
{
	SmokeClouds.setTexture('smoke', 'enemies/imp/smoke_clouds', AtlasConfig.SmokeClouds, '');
};


class SmokeEffect extends Sprite{

	static get SMOKE_ANIMATION_SPEED() { return 0.17 }

	constructor(aDescriptor_obj){
		super();

		this._fSmoke = null;
		this._fDescriptor_obj = aDescriptor_obj;
		SmokeClouds.generateSmokeCloudsTextures();

		let lSmokeClouds_spr = this._fSmoke = this.addChild(new Sprite());
			lSmokeClouds_spr.textures = SmokeClouds.textures.smoke;
			lSmokeClouds_spr.alpha = this._fDescriptor_obj.alpha;
			lSmokeClouds_spr.scale.x = this._fDescriptor_obj.scaleX;
			lSmokeClouds_spr.scale.y = this._fDescriptor_obj.scaleY;
			lSmokeClouds_spr.rotation = this._fDescriptor_obj.rotation;
			lSmokeClouds_spr.position.set(this._fDescriptor_obj.x, this._fDescriptor_obj.y);
			lSmokeClouds_spr.loop = true;
			lSmokeClouds_spr.animationSpeed = SmokeEffect.SMOKE_ANIMATION_SPEED;

			this._fSmoke.visible = false;
	}

	stopAnimation(){
		this._fIsAnimationInProgress_bl = false;
		this._fSmoke.visible = false;
		this._fSmoke.stop();
	}

	pause()
	{
		this._fSmoke.animationSpeed = 0;
	}

	unpause()
	{
		this._fSmoke.animationSpeed = SmokeEffect.SMOKE_ANIMATION_SPEED;
	}

	isPlaying()
	{
		return this._fIsAnimationInProgress_bl;	
	}

	play()
	{
		this._fIsAnimationInProgress_bl = true;
		this._fSmoke.visible = true;
		this._fSmoke.play();
	}
}

export default SmokeEffect;