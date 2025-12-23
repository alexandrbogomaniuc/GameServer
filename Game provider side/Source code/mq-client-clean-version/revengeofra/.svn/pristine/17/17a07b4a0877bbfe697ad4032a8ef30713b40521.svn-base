import AtlasConfig from '../../../../config/AtlasConfig';
import AtlasSprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';

let PortalEffectsManager = {
	textures: {
		portal: null		
	}
};

PortalEffectsManager.setTexture = function (name, imageNames, configs, path) {
	if(!PortalEffectsManager.textures[name]){
		PortalEffectsManager.textures[name] = [];

		if(!Array.isArray(imageNames)) imageNames = [imageNames];
		if(!Array.isArray(configs)) configs = [configs];

		let assets = [];
		imageNames.forEach(function(item){assets.push(APP.library.getAsset(item))});

		PortalEffectsManager.textures[name] = AtlasSprite.getFrames(assets, configs, path);
		PortalEffectsManager.textures[name].sort(function(a, b){if(a._atlasName > b._atlasName) return 1; else return -1});
	}
};

PortalEffectsManager.getPortalTextures = function()
{
	PortalEffectsManager.setTexture('portal', 'portal/portal', AtlasConfig.Portal, '');
	return this.textures.portal;
}

export default PortalEffectsManager;