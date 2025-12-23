import AtlasSprite from '../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import AtlasConfig from '../config/AtlasConfig';
import { APP } from '../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';

let InstantKillEffects = {
	bouncingBalls: null,
	spinner: null,
	marker: null,
	groundSmoke: null

};

let imageNames = [],
	configs = []	


imageNames.push('weapons/InstantKill/instant_kill_atlas');
configs.push(AtlasConfig.InstantKill);

InstantKillEffects.setTexture = function (name, imageNames, configs, path) {
	if(!InstantKillEffects[name]){
		InstantKillEffects[name] = [];

		if(!Array.isArray(imageNames)) imageNames = [imageNames];
		if(!Array.isArray(configs)) configs = [configs];

		let assets = [];
		imageNames.forEach(function(item){assets.push(APP.library.getAsset(item))});

		InstantKillEffects[name] = AtlasSprite.getFrames(assets, configs, path);
		InstantKillEffects[name].sort(function(a, b){if(a._atlasName > b._atlasName) return 1; else return -1});
	}
};

InstantKillEffects.getTextures = function(){
	InstantKillEffects.setTexture('bouncingBalls', imageNames, configs, 'bounce_ball');
	InstantKillEffects.setTexture('marker', imageNames, configs, 'marker');
	InstantKillEffects.setTexture('groundSmoke', imageNames, configs, 'groundsmoke');
	InstantKillEffects.setTexture('spinner', imageNames, configs, 'spinner');
};

export default InstantKillEffects;