import AtlasSprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import AtlasConfig from '../../../../config/AtlasConfig';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';

let ElectricityEffects = {
	bouncingBalls: null,
	spinner: null,
	marker: null,
	groundSmoke: null

};

let imageNames = [],
	configs = []	


imageNames.push(['common/electricity/electricity_arcs']);
imageNames.push(['common/electricity/animated_arcs']);

configs.push(AtlasConfig.BossElectricity);
configs.push(AtlasConfig.BossElectricityAnimatedArcs);

ElectricityEffects.setTexture = function (name, imageNames, configs, path) {
	if(!ElectricityEffects[name]){
		ElectricityEffects[name] = [];

		if(!Array.isArray(imageNames)) imageNames = [imageNames];
		if(!Array.isArray(configs)) configs = [configs];

		let assets = [];
		imageNames.forEach(function(item){assets.push(APP.library.getAsset(item))});

		ElectricityEffects[name] = AtlasSprite.getFrames(assets, configs, path);
		ElectricityEffects[name].sort(function(a, b){if(a._atlasName > b._atlasName) return 1; else return -1});
	}
};

ElectricityEffects.getTextures = function(){
	ElectricityEffects.setTexture('arc_4',					imageNames[0], configs[0], 'arc_4');
	ElectricityEffects.setTexture('arc_6',					imageNames[0], configs[0], 'arc_6');
	ElectricityEffects.setTexture('arc_back',				imageNames[0], configs[0], 'arc_back');
	ElectricityEffects.setTexture('arc_overlay',			imageNames[0], configs[0], 'arc_overlay');
	ElectricityEffects.setTexture('arc_lighten_overlay',	imageNames[0], configs[0], 'arc_lighten_overlay');
	ElectricityEffects.setTexture('foot_arcs',				imageNames[0], configs[0], 'foot_step/foot_arcs');
	ElectricityEffects.setTexture('foot_electric_fx',		imageNames[0], configs[0], 'foot_step/electric_fx');

	ElectricityEffects.setTexture('arc_0_new', 		imageNames[1], configs[1], 'arc_0_new');
	ElectricityEffects.setTexture('arc_0_glow_new',	imageNames[1], configs[1], 'arc_0_glow_new');
	ElectricityEffects.setTexture('arc_1_new', 		imageNames[1], configs[1], 'arc_1_new');
	ElectricityEffects.setTexture('arc_1_glow_new',	imageNames[1], configs[1], 'arc_1_glow_new');
	ElectricityEffects.setTexture('arc_2_new',		imageNames[1], configs[1], 'arc_2_new');
	ElectricityEffects.setTexture('arc_2_glow_new',	imageNames[1], configs[1], 'arc_2_glow_new');
	ElectricityEffects.setTexture('arc_3_new',		imageNames[1], configs[1], 'arc_3_new');
	ElectricityEffects.setTexture('arc_3_glow_new',	imageNames[1], configs[1], 'arc_3_glow_new');
	ElectricityEffects.setTexture('arc_4_new',		imageNames[1], configs[1], 'arc_4_new');
	ElectricityEffects.setTexture('arc_4_glow_new',	imageNames[1], configs[1], 'arc_4_glow_new');
	ElectricityEffects.setTexture('arc_5_new',		imageNames[1], configs[1], 'arc_5_new');
	ElectricityEffects.setTexture('arc_5_glow_new',	imageNames[1], configs[1], 'arc_5_glow_new');
	
};

export default ElectricityEffects;