import AtlasSprite from '../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import AtlasConfig from '../config/AtlasConfig';
import { APP } from '../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';

let CommonEffectsManager = {
	textures: {
		groundSmoke: null,
		dieSmokeUnmult: null,
		streak: null
	}
};

CommonEffectsManager.setTexture = function (name, imageNames, configs, path) {
	if (!CommonEffectsManager.textures[name]) {
		CommonEffectsManager.textures[name] = [];

		if (!Array.isArray(imageNames)) imageNames = [imageNames];
		if (!Array.isArray(configs)) configs = [configs];

		let assets = [];
		imageNames.forEach(function (item) {
			assets.push(APP.library.getAsset(item));
		});

		// Only proceed if we have valid assets
		if (assets.length === 0) {
			console.warn(`[CommonEffectsManager] No valid assets found for "${name}", using empty texture`);
			CommonEffectsManager.textures[name] = [PIXI.Texture.EMPTY];
			return;
		}

		CommonEffectsManager.textures[name] = AtlasSprite.getFrames(assets, configs, path);

		// Filter out any undefined textures that might have been created
		CommonEffectsManager.textures[name] = CommonEffectsManager.textures[name].filter(function (tex) {
			return tex && tex._uvs;
		});

		// Ensure we have at least one valid texture
		if (CommonEffectsManager.textures[name].length === 0) {
			console.warn(`[CommonEffectsManager] No valid textures created for "${name}", using empty texture`);
			CommonEffectsManager.textures[name] = [PIXI.Texture.EMPTY];
		}

		CommonEffectsManager.textures[name].sort(function (a, b) { if (a._atlasName > b._atlasName) return 1; else return -1 });
	}
};

CommonEffectsManager.getGroundSmokeTextures = function () {
	CommonEffectsManager.setTexture('groundSmoke', 'common/u_groundsmoke_unmult', AtlasConfig.CommonEffects[0], 'groundsmoke');
	return this.textures.groundSmoke;
}

CommonEffectsManager.getDieSmokeUnmultTextures = function () {
	CommonEffectsManager.setTexture('dieSmokeUnmult', 'common/die_smoke_unmult', AtlasConfig.DieSmokeUnmult, '');
	return this.textures.dieSmokeUnmult;
}

CommonEffectsManager.getStreakTextures = function () {
	CommonEffectsManager.setTexture('streak', 'common/streak', AtlasConfig.Streak, '');
	return this.textures.streak;
}


export default CommonEffectsManager;