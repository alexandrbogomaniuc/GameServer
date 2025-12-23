import AtlasConfig from '../../../../config/AtlasConfig';
import AtlasSprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';

let HorusEffectsManager = {
	textures: {
		staffOrb: null,
		staffOrbBlurred: null,
		wingsFire: null
	}
};

HorusEffectsManager.setTexture = function (name, imageNames, configs, path) {
	if(!HorusEffectsManager.textures[name]){
		HorusEffectsManager.textures[name] = [];

		if(!Array.isArray(imageNames)) imageNames = [imageNames];
		if(!Array.isArray(configs)) configs = [configs];

		let assets = [];
		imageNames.forEach(function(item){assets.push(APP.library.getAsset(item))});

		HorusEffectsManager.textures[name] = AtlasSprite.getFrames(assets, configs, path);
		HorusEffectsManager.textures[name].sort(function(a, b){if(a._atlasName > b._atlasName) return 1; else return -1});
	}
};

HorusEffectsManager.getStaffOrbTextures = function()
{
	HorusEffectsManager.setTexture('staffOrb', 'enemies/horus/fx/orb', AtlasConfig.StaffOrb, '');
	return this.textures.staffOrb;
}

HorusEffectsManager.getStaffOrbBlurredTextures = function()
{
	HorusEffectsManager.setTexture('staffOrbBlurred', 'enemies/horus/fx/orb_blurred', AtlasConfig.StaffOrb, '');
	return this.textures.staffOrbBlurred;
}

HorusEffectsManager.getWingsFireTextures = function()
{
	HorusEffectsManager.setTexture('wingsFire', 'enemies/horus/fx/wings_fire', AtlasConfig.WingsFire, '');
	return this.textures.wingsFire;
}

export default HorusEffectsManager;