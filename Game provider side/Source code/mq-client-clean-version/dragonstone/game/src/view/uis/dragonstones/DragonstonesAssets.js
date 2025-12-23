import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { AtlasSprite } from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/index';
import AtlasConfig from '../../../config/AtlasConfig';

var DragonstonesAssets = {
	black_base: null,
	fragments_base: null,
	orange_flare_purple: null,
	stone_hand: null,
	stone_purple_glow: null,
	stone_purple_out_glow: null,
	hand_fragments: null,
	big_flare: null,
	big_flare_purple: null,
	curcle_blast: null,
	curcle_purple: null,
	eye_bg: null,
	fragments_eye_glow: null,
	marker_auras: null,
	orange_flare: null,
	screen_purple: null,
	stone_hand_glow: null,
	stone_purple_glow_add: null,
	hand_fragments_glow: null,
	hand_fragments_white: null,
}

DragonstonesAssets.initTextures = function()
{
	DragonstonesAssets.setTexture('black_base', ["dragonstones/dragonstone_assets_normal"], [AtlasConfig.DragonstonesNormalAssets], 'black_base');
	DragonstonesAssets.setTexture('fragments_base', ["dragonstones/dragonstone_assets_normal"], [AtlasConfig.DragonstonesNormalAssets], 'fragments_base');
	DragonstonesAssets.setTexture('orange_flare_purple', ["dragonstones/dragonstone_assets_normal"], [AtlasConfig.DragonstonesNormalAssets], 'orange_flare_purple');
	DragonstonesAssets.setTexture('stone_hand', ["dragonstones/dragonstone_assets_normal"], [AtlasConfig.DragonstonesNormalAssets], 'stone_hand');
	DragonstonesAssets.setTexture('stone_purple_glow', ["dragonstones/dragonstone_assets_normal"], [AtlasConfig.DragonstonesNormalAssets], 'stone_purple_glow');
	DragonstonesAssets.setTexture('stone_purple_out_glow', ["dragonstones/dragonstone_assets_normal"], [AtlasConfig.DragonstonesNormalAssets], 'stone_purple_out_glow');
	DragonstonesAssets.setTexture('hand_fragments', ["dragonstones/dragonstone_assets_normal"], [AtlasConfig.DragonstonesNormalAssets], 'hand_fragments');

	DragonstonesAssets.setTexture('big_flare', ["dragonstones/dragonstone_assets_blend"], [AtlasConfig.DragonstonesBlendAssets], 'big_flare');
	DragonstonesAssets.setTexture('big_flare_purple', ["dragonstones/dragonstone_assets_blend"], [AtlasConfig.DragonstonesBlendAssets], 'big_flare_purple');
	DragonstonesAssets.setTexture('curcle_blast', ["dragonstones/dragonstone_assets_blend"], [AtlasConfig.DragonstonesBlendAssets], 'curcle_blast');
	DragonstonesAssets.setTexture('curcle_purple', ["dragonstones/dragonstone_assets_blend"], [AtlasConfig.DragonstonesBlendAssets], 'curcle_purple');
	DragonstonesAssets.setTexture('eye_bg', ["dragonstones/dragonstone_assets_blend"], [AtlasConfig.DragonstonesBlendAssets], 'eye_bg');
	DragonstonesAssets.setTexture('fragments_eye_glow', ["dragonstones/dragonstone_assets_blend"], [AtlasConfig.DragonstonesBlendAssets], 'fragments_eye_glow');
	DragonstonesAssets.setTexture('marker_auras', ["dragonstones/dragonstone_assets_blend"], [AtlasConfig.DragonstonesBlendAssets], 'marker_auras');
	DragonstonesAssets.setTexture('orange_flare', ["dragonstones/dragonstone_assets_blend"], [AtlasConfig.DragonstonesBlendAssets], 'orange_flare');
	DragonstonesAssets.setTexture('screen_purple', ["dragonstones/dragonstone_assets_blend"], [AtlasConfig.DragonstonesBlendAssets], 'screen_purple');
	DragonstonesAssets.setTexture('stone_hand_glow', ["dragonstones/dragonstone_assets_blend"], [AtlasConfig.DragonstonesBlendAssets], 'stone_hand_glow');
	DragonstonesAssets.setTexture('stone_purple_glow_add', ["dragonstones/dragonstone_assets_blend"], [AtlasConfig.DragonstonesBlendAssets], 'stone_purple_glow_add');
	DragonstonesAssets.setTexture('hand_fragments_glow', ["dragonstones/dragonstone_assets_blend"], [AtlasConfig.DragonstonesBlendAssets], 'hand_fragments_glow');
	DragonstonesAssets.setTexture('hand_fragments_white', ["dragonstones/dragonstone_assets_blend"], [AtlasConfig.DragonstonesBlendAssets], 'hand_fragments_white');
}

DragonstonesAssets.setTexture = function (name, imageNames, configs, path)
{
	if (!DragonstonesAssets[name])
	{
		DragonstonesAssets[name] = [];

		if(!Array.isArray(imageNames)) imageNames = [imageNames];
		if(!Array.isArray(configs)) configs = [configs];

		let assets = [];
		imageNames.forEach(function(item){assets.push(APP.library.getAsset(item))});

		DragonstonesAssets[name] = AtlasSprite.getFrames(assets, configs, path);
		DragonstonesAssets[name].sort(function(a, b){if(a._atlasName > b._atlasName) return 1; else return -1});
	}
};

export default DragonstonesAssets;