import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../shared/src/CommonConstants';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { Utils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import FormationHighlightAnimation from './FormationHighlightAnimation';
import Timer from "../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer";
import AtlasSprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import AtlasConfig from '../../../config/AtlasConfig';

export let _metal_explosion_textures = null;
export function _generateMetalExplosionTextures()
{
	if (_metal_explosion_textures) return;

	_metal_explosion_textures = AtlasSprite.getFrames([APP.library.getAsset("enemies/money/mistery/metal_explosion")], AtlasConfig.MetalExplosion, "");
}

export let _flame_explosion_textures = null;
function _crateFlameExplosionTextures()
{
	if (_flame_explosion_textures) return;

	_flame_explosion_textures = AtlasSprite.getFrames(
	 [APP.library.getAsset("enemies/money/mistery/flame/flame_explosion_1"), APP.library.getAsset("enemies/money/mistery/flame/flame_explosion_2")],
	 [AtlasConfig.FlameExplosion1,	AtlasConfig.FlameExplosion2], "");
}

const SMOKE_BLUE_PARAM = [
	{
		delay: 0, x1: 19.35, 	y1: 5.05, angle1: 0.10471975511965977, 	sx1: 0.497, sy1: 0.497, alpha1: 0, //x1: 38.7/2, 	y1: 10.1/2 		angle1: Utils.gradToRad(6
		time2: 6, x2: 41.5, 	y2: -17.6, angle2: 0.3141592653589793, sx2: 0.687, sy2: 0.687, alpha2: 0.49, //x2: 83/2, 	y2: -35.2/2 	angle2: Utils.gradToRad(18
		time3: 15, x3: 66.1,    y3: -42.8, angle3: 0.8377580409572781, sx3: 0.899, sy3: 0.899, alpha3: 0, //x3: 132.2/2, y3: -85.6/2		angle3: Utils.gradToRad(48
	},
	{
		delay: 0, x1: 9.25, 	y1: 15.4, angle1: 0, 	sx1: 1.362, sy1: 1.362, alpha1: 0, //x1: 18.5/2, 	y1: 30.8/2
		time2: 9, x2: -35.05, 	y2: 23.65, angle2: 0.3141592653589793, sx2: 1.767, sy2: 1.767, alpha2: 0.49, //x2: -70.1/2, 	y2: 47.3/2	angle2: Utils.gradToRad(18
		time3: 15, x23: -68.75, y3: 29.95, angle2: 0.8377580409572781, sx2: 2.076, sy2: 2.076, alpha2: 0, //x23: -137.5/2, y3: 59.9/2		angle2: Utils.gradToRad(48
	},
	{
		delay: 0, x1: 11.75, 	y1: 19.05, angle1: 0.06981317007977318, 	sx1: 0.37, sy1: 0.37, alpha1: 0, //x1: 23.5/2, 	y1: 38.1/2		angle1: Utils.gradToRad(4
		time2: 7, x2: 22, 		y2: 34.15, angle2: 0.3141592653589793, sx2: 0.69, sy2: 0.69, alpha2: 0.49, //x2: 44/2, 	y2: 68.3/2		angle2: Utils.gradToRad(18
		time3: 15, x3: 31.7, 	y3: 48.45, angle3: 0.8377580409572781, sx3: 1.005, sy3: 1.005, alpha3: 0, //x3: 63.4/2, y3: 96.9/2		angle3: Utils.gradToRad(48
	},
	{
		delay: 0, x1: 16.35, 	y1: -15.1, angle1: 0, sx1: 1.124, sy1: 1.124, alpha1: 0, //x1: 32.7/2, 	y1: -30.2/2
		time2: 5, x2: 18.7, 	y2: -38.05, angle2: 0.10821041362364843, sx2: 1.229, sy2: 1.229, alpha2: 0.49, //x2: 37.4/2, 	y2: -76.1/2		angle2: Utils.gradToRad(6.2
		time3: 34, x3: 62.2, 	y3: -126.5, angle3: 0.8377580409572781, sx3: 1.7, sy3: 1.7, alpha3: 0, //x3: 124.4/2, y3: -253/2		angle3: Utils.gradToRad(48
	},
	{
		delay: 2, x1: -36.55, 	y1: -30.4, angle1: 0, sx1: 1.362, sy1: 1.362, alpha1: 0, //x1: -73.1/2, 	y1: -60.8/2
		time2: 5, x2: -37.1, 	y2: -52.85, angle2: 0.10821041362364843, sx2: 1.442, sy2: 1.442, alpha2: 0.49, //x2: -74.2/2, 	y2: -105.7/2		angle2: Utils.gradToRad(6.2
		time3: 34, x3: -86.05,  y3: -136.85, angle3: 0.8377580409572781, sx3: 1.8, sy3: 1.8, alpha3: 0, //x3: -172.1/2, y3: -273.7/2		angle3: Utils.gradToRad(48
	},
	{
		delay: 3, x1: -11.1, 	y1: -22.25, angle1: 1.710422666954443, sx1: 1.124, sy1: 1.124, alpha1: 0, //x1: -22.2/2, 	y1: -44.5/2		angle1: Utils.gradToRad(98
		time2: 5, x2: -6.55, 	y2: -36.2, angle2: 1.8186330805780915, sx2: 1.229, sy2: 1.229, alpha2: 0.49, //x2: -13.1/2, 	y2: -72.4/2		angle2: Utils.gradToRad(104.2
		time3: 34, x3: 2.2, 	y3: -101.35, angle3: 2.548180707911721, sx3: 1.7, sy3: 1.7, alpha3: 0, //x3: 4.4/2, y3: -202.7/2		angle3: Utils.gradToRad(146
	}
];

const LIGHT_PARTICLE_PARAM = [
		{
		delay: 1,
		position: [
				{x: -83.5, y: -6.7}, 
				{x: -111.4, y: -13.1},
				{x: -122, y: -46.2},
				{x: -125.1, y: -82.3},
				{x: -126, y: -118.6},
				{x: -126.5, y: -154.4},
				{x: -127.7, y: -189.3},
				{x: -130.4, y: -222.9},
				{x: -135.4, y: -254.8},
				{x: -144, y: -284},
				{x: -157.6, y: -308.7},
				{x: -177.1, y: -325.6},
				{x: -198.9, y: -332.4},
				{x: -218.5, y: -332.4},
				{x: -233.7, y: -329.7},
				{x: -243.6, y: -327},
				{x: -247.3, y: -325.8}
			]
		},
		{
			delay: 1,
			position: [
					{x: -68.5, y: 40.1}, 
					{x: -69.3, y: 72.6},
					{x: -81.1, y: 107.1},
					{x: -104.5, y: 136.7},
					{x: -134.6, y: 159.5},
					{x: -167.6, y: 177.2},
					{x: -200.9, y: 191.8},
					{x: -233.6, y: 205.1},
					{x: -264.5, y: 218.5},
					{x: -292.4, y: 233.6},
					{x: -314.9, y: 252.8},
					{x: -326.3, y: 277},
					{x: -324.7, y: 300.8},
					{x: -317.3, y: 319.8},
					{x: -309.2, y: 333.7},
					{x: -303.1, y: 342.6},
					{x: -300.8, y: 345.9}
				]
		},
		{
			delay: 2,
			position: [
					{x: 73.5, y: 33.4}, 
					{x: 85.3, y: 50},
					{x: 97.8, y: 69.1},
					{x: 109.4, y: 89.6},
					{x: 119, y: 111.2},
					{x: 124.6, y: 133.8},
					{x: 123.3, y: 156.3},
					{x: 114.3, y: 176.3},
					{x: 102.7, y: 193.8},
					{x: 93.7, y: 211.4},
					{x: 89.9, y: 229.4},
					{x: 90.7, y: 246.2},
					{x: 93.8, y: 260.9},
					{x: 97.8, y: 273},
					{x: 101.5, y: 282.3},
					{x: 104.2, y: 288.5},
					{x: 105.3, y: 290.7}
				]
		},
		{
			delay: 4,
			position: [
					{x: 73.5, y: 33.4}, 
					{x: 90.9, y: 55.9},
					{x: 112.4, y: 79.5},
					{x: 137.7, y: 100.6},
					{x: 167.7, y: 113.8},
					{x: 199.7, y: 110.4},
					{x: 225.8, y: 92.6},
					{x: 246.4, y: 69.8},
					{x: 263.5, y: 46},
					{x: 278.6, y: 22.7},
					{x: 292.1, y: 0.7},
					{x: 304.3, y: -19.5},
					{x: 315.2, y: -37.4},
					{x: 324.6, y: -52.5},
					{x: 332.1, y: -64.4},
					{x: 337.3, y: -72.3},
					{x: 339.2, y: -75.2}
				]
		},
		{
			delay: 6,
			position: [
					{x: 80.2, y: -41.8}, 
					{x: 74.9, y: -80.7},
					{x: 73.4, y: -124.8},
					{x: 78.1, y: -170},
					{x: 90.2, y: -214},
					{x: 110.1, y: -254.3},
					{x: 136.8, y: -289.1},
					{x: 168.2, y: -317.5},
					{x: 202, y: -339.8},
					{x: 236.4, y: -356.7},
					{x: 269.9, y: -369.2},
					{x: 301.2, y: -378.1},
					{x: 329.6, y: -384.1},
					{x: 353.9, y: -387.9},
					{x: 373.2, y: -389.9},
					{x: 386.1, y: -390.8},
					{x: 391, y: -391}
				]
		},
];

class FormationMisteryAnimation extends Sprite
{
	static get EVENT_ON_ANIMATION_ENDED()				{return "onIntroAnimationEnded";}

	constructor()
	{
		super();

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			_generateMetalExplosionTextures();
			_crateFlameExplosionTextures();
		}

		this._fFireSmoke21_spr = null;
		this._fFireSmoke_spr = null;
		this._fFireSmoke22_spr = null;
		this._fMetalExplosionTimer_t = null;
		this._fMetalExplosion_spr = null;
		this._fSmokeBlue_spr_arr = [];
		this._fFlameExplosion_spr = null;
		this._fFxExplosion_spr = null;
		this._fLightParticlePurple_spr = null;
		this._fLight8_spr = null;
		this._fParticlesYellow_spr = null;
		this._fLightParticleT1_spr = null;
		this._fLightCirclePurple_spr = null;
		this._fLightCircle4_spr = null;
		this._flLightParticle2_spr_arr = [];
		this._fStreakFlare_spr = null;
		this._fIsFlameExplosionAnimationProgressCount_num = null;
	}

	i_startAnimation()
	{
		this._playAnimation();
	}

	_playAnimation()
	{
		this._fIsAnimationProgressCount_num = 0;
		this._startFireSmokeAnimation();
	}

	_startFireSmokeAnimation()
	{
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startFireSmoke21();
		}
		
		this._startFireSmoke();

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startFireSmoke22();
			this._startMetalExplosion();
			this._startSmokeBlue();
			this._startFlameExplosion();
			this._startFxExplosion();
			this._startLightParticlePurple();
			this._startLight8();
			this._startParticlesYellow();
			this._startLightParticleT1();
		}

		this._startLightCirclePurple();
		this._startLightCircle4();

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startLightParticle2();
		}

		this._startStreakFlare();
	}

	_startFireSmoke21()
	{
		let lFireSmoke_spr = this._fFireSmoke21_spr = this.addChild(APP.library.getSprite("enemies/money/shockwave/fire_smoke"));
		lFireSmoke_spr.alpha = 0;
		lFireSmoke_spr.scale.set(0.892, 0.892); //0.223 * 4, 0.223 * 4
		lFireSmoke_spr.rotation =  -1.2217304763960306; //Utils.gradToRad(-70);

		let l_seq = [
			{tweens: [
						{prop: 'scale.x', to: 1.124}, //0.281 * 4
						{prop: 'scale.y', to: 1.124}, //0.281 * 4
						{prop: 'rotation', to: -1.038470904936626}, //Utils.gradToRad(-59.5)
						{prop: 'alpha', to: 1}], duration: 2 * FRAME_RATE},
			{tweens: [
						{prop: 'scale.x', to: 2.8}, //0.7 * 4
						{prop: 'scale.y', to: 2.8}, //0.7 * 4
						{prop: 'rotation', to: 0.47123889803846897}, //Utils.gradToRad(27)
						{prop: 'alpha', to: 0}], duration: 20 * FRAME_RATE,
			onfinish: () => {
				lFireSmoke_spr && lFireSmoke_spr.destroy();
				this._fIsAnimationProgressCount_num--;
				this._completeAnimationSuspicision();
		}}];
		this._fIsAnimationProgressCount_num++;
		Sequence.start(lFireSmoke_spr, l_seq);
	}

	_startFireSmoke()
	{
		let lFireSmoke_spr = this._fFireSmoke_spr = this.addChild(APP.library.getSprite("enemies/money/mistery/fire_smoke"));
		lFireSmoke_spr.alpha = 0;
		lFireSmoke_spr.scale.set(0.446, 0.446); //0.223 * 2, 0.223 * 2
		lFireSmoke_spr.rotation =  -1.2217304763960306; //Utils.gradToRad(-70); 
		lFireSmoke_spr.blendMode = PIXI.BLEND_MODES.ADD;

		let l_seq = [
			{tweens: [], duration: 3 * FRAME_RATE},
			{tweens: [
						{prop: 'scale.x', to: 0.538}, // 0.269 * 2
						{prop: 'scale.y', to: 0.538}, // 0.269 * 2
						{prop: 'rotation', to: -1.069886831472524}, //Utils.gradToRad(-61.3)
						{prop: 'alpha', to: 1}
					 ], duration: 2 * FRAME_RATE},
			{tweens: [
						{prop: 'scale.x', to: 0.908}, //0.454 * 2
						{prop: 'scale.y', to: 0.908}, //0.454 * 2
						{prop: 'rotation', to: -0.48171087355043496} //Utils.gradToRad(-27.6)
					 ], duration: 7 * FRAME_RATE},
			{tweens: [
						{prop: 'scale.x', to: 1.24}, //0.62 * 2
						{prop: 'scale.y', to: 1.24}, //0.62 * 2
						{prop: 'rotation', to: 0.24434609527920614}, //Utils.gradToRad(14)
						{prop: 'alpha', to: 0}], duration: 14 * FRAME_RATE,
			onfinish: () => {
				lFireSmoke_spr && lFireSmoke_spr.destroy();
				this._fIsAnimationProgressCount_num--;
				this._completeAnimationSuspicision();
		}}];
		this._fIsAnimationProgressCount_num++;
		Sequence.start(lFireSmoke_spr, l_seq);
	}

	_startFireSmoke22()
	{
		let lFireSmoke_spr = this._fFireSmoke22_spr = this.addChild(APP.library.getSprite("enemies/money/shockwave/fire_smoke"));
		lFireSmoke_spr.alpha = 0;
		lFireSmoke_spr.scale.set(0.892, 0.892); //0.223 * 4, 0.223 * 4
		lFireSmoke_spr.rotation =  -0.890117918517108; //Utils.gradToRad(-51);

		let l_seq = [
			{tweens: [], duration: 8 * FRAME_RATE},
			{tweens: [
						{prop: 'scale.x', to: 1.012}, // 0.253 * 4
						{prop: 'scale.y', to: 1.012}, // 0.253 * 4
						{prop: 'rotation', to: -0.8360127117052838}, //Utils.gradToRad(-47.9)
						{prop: 'alpha', to: 1}
					 ], duration: 2 * FRAME_RATE},
			{tweens: [
						{prop: 'scale.x', to: 2.8}, //0.7 * 4
						{prop: 'scale.y', to: 2.8}, //0.7 * 4
						{prop: 'rotation', to: 0.031415926535897934}, //Utils.gradToRad(1.8)
						{prop: 'alpha', to: 0}], duration: 37 * FRAME_RATE,
			onfinish: () => {
				lFireSmoke_spr && lFireSmoke_spr.destroy();
				this._fIsAnimationProgressCount_num--;
				this._completeAnimationSuspicision();
		}}];
		this._fIsAnimationProgressCount_num++;
		Sequence.start(lFireSmoke_spr, l_seq);
	}

	_startMetalExplosion()
	{
		this._fIsAnimationProgressCount_num++;
		this._fMetalExplosionTimer_t = new Timer(() =>
			{
				this._fMetalExplosionTimer_t && this._fMetalExplosionTimer_t.destructor();

				let lMetalExplosion_me = this._fMetalExplosion_spr = this.addChild(new Sprite());
				lMetalExplosion_me.textures = _metal_explosion_textures;
				lMetalExplosion_me.blendMode = PIXI.BLEND_MODES.ADD;
				lMetalExplosion_me.scale.set(1.62, 1.62);
				lMetalExplosion_me.play();
				lMetalExplosion_me.on('animationend', () =>
				{
					lMetalExplosion_me && lMetalExplosion_me.destroy();
					this._fIsAnimationProgressCount_num--;
					this._completeAnimationSuspicision();
				});

			}, 4 * FRAME_RATE);
	}

	_startSmokeBlue()
	{
		for (let i = 0; i < SMOKE_BLUE_PARAM.length; i++)
		{
			let lSmokeBlue_spr = this._fSmokeBlue_spr_arr[i] = this.addChild(APP.library.getSprite("enemies/money/mistery/smoke_blue"));
			lSmokeBlue_spr.position.set(SMOKE_BLUE_PARAM[i].x1, SMOKE_BLUE_PARAM[i].y1);
			lSmokeBlue_spr.scale.set(SMOKE_BLUE_PARAM[i].sx1, SMOKE_BLUE_PARAM[i].sy1);
			lSmokeBlue_spr.alpha = SMOKE_BLUE_PARAM[i].alpha1;
			lSmokeBlue_spr.rotation = SMOKE_BLUE_PARAM[i].angle1;

			let l_seq = [
				{tweens: [], duration: SMOKE_BLUE_PARAM[i].delay * FRAME_RATE},
				{tweens: [
					{prop: 'x', to: SMOKE_BLUE_PARAM[i].x2},
					{prop: 'y', to: SMOKE_BLUE_PARAM[i].y2},
					{prop: 'scale.x', to: SMOKE_BLUE_PARAM[i].sx2},
					{prop: 'scale.y', to: SMOKE_BLUE_PARAM[i].sy2},
					{prop: 'alpha', to: SMOKE_BLUE_PARAM[i].alpha2},
					{prop: 'rotation', to: SMOKE_BLUE_PARAM[i].angle2},
				], duration: SMOKE_BLUE_PARAM[i].time2 * FRAME_RATE},
				{tweens: [
					{prop: 'x', to: SMOKE_BLUE_PARAM[i].x3},
					{prop: 'y', to: SMOKE_BLUE_PARAM[i].y3},
					{prop: 'scale.x', to: SMOKE_BLUE_PARAM[i].sx3},
					{prop: 'scale.y', to: SMOKE_BLUE_PARAM[i].sy3},
					{prop: 'alpha', to: SMOKE_BLUE_PARAM[i].alpha3},
					{prop: 'rotation', to: SMOKE_BLUE_PARAM[i].angle3},
				], duration: SMOKE_BLUE_PARAM[i].time3 * FRAME_RATE,
				onfinish: () => {
					lSmokeBlue_spr && lSmokeBlue_spr.destroy();
					this._fIsAnimationProgressCount_num--;
					this._completeAnimationSuspicision();
			}}];
			this._fIsAnimationProgressCount_num++;
			Sequence.start(lSmokeBlue_spr, l_seq);
		}
	}

	_startFlameExplosion()
	{
		this._fIsAnimationProgressCount_num++;
		this._fIsFlameExplosionAnimationProgressCount_num = 0;

		let lFlameExplosion_fe = this._fFlameExplosion_spr = this.addChild(new Sprite());
		lFlameExplosion_fe.textures = _flame_explosion_textures;
		lFlameExplosion_fe.blendMode = PIXI.BLEND_MODES.ADD;
		lFlameExplosion_fe.scale.set(0.266, 0.266);
		this._fIsFlameExplosionAnimationProgressCount_num++;
		lFlameExplosion_fe.play();
		lFlameExplosion_fe.on('animationend', () =>		{

			lFlameExplosion_fe.alpha = 0;
			this._fIsFlameExplosionAnimationProgressCount_num--;
			this._completeFlameExplosion();
		});

		let l_seq = [
			{tweens: [], duration: 4 * FRAME_RATE},
			{tweens: [
						{prop: 'scale.x', to: 0.678}, //0.339 * 2
						{prop: 'scale.y', to: 0.678}, //0.339 * 2
						{prop: 'alpha', to: 1}
					 ], duration: 2 * FRAME_RATE},
			{tweens: [
						{prop: 'scale.x', to: 1.04}, //0.52 * 2
						{prop: 'scale.y', to: 1.04} //0.52 * 2
					], duration: 8 * FRAME_RATE,
			onfinish: () => {
				this._fIsFlameExplosionAnimationProgressCount_num--;
				this._completeFlameExplosion();
		}}];
		this._fIsFlameExplosionAnimationProgressCount_num++;
		Sequence.start(lFlameExplosion_fe, l_seq);
	}

	_completeFlameExplosion()
	{
		if (this._fIsFlameExplosionAnimationProgressCount_num <= 0)
		{
			Sequence.destroy(Sequence.findByTarget(this._fFlameExplosion_spr));
			this._fFlameExplosion_spr && this._fFlameExplosion_spr.destroy();
			this._fIsAnimationProgressCount_num--;
			this._completeAnimationSuspicision();
		}
	}

	_startFxExplosion()
	{
		let lFxExplosion_spr = this._fFxExplosion_spr = this.addChild(APP.library.getSprite("enemies/money/mistery/fx_explosion"));
		lFxExplosion_spr.alpha = 0;
		lFxExplosion_spr.scale.set(0.423, 0.423);
		lFxExplosion_spr.blendMode = PIXI.BLEND_MODES.ADD;

		let l_seq = [
			{tweens: [], duration: 1 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}], duration: 0 * FRAME_RATE},
			{tweens: [
						{prop: 'scale.x', to: 0.746},
						{prop: 'scale.y', to: 0.746}
					], duration: 2 * FRAME_RATE},
			{tweens: [
						{prop: 'scale.x', to: 1.231},
						{prop: 'scale.y', to: 1.231},
						{prop: 'alpha', to: 0.2}], duration: 3 * FRAME_RATE},
			{tweens: [
						{prop: 'alpha', to: 0.1}], duration: 1 * FRAME_RATE,
			onfinish: () => {
				lFxExplosion_spr && lFxExplosion_spr.destroy();
				this._fIsAnimationProgressCount_num--;
				this._completeAnimationSuspicision();
		}}];
		this._fIsAnimationProgressCount_num++;
		Sequence.start(lFxExplosion_spr, l_seq);
	}

	_startLightParticlePurple()
	{
		let lLightParticlePurple_spr = this._fLightParticlePurple_spr = this.addChild(APP.library.getSpriteFromAtlas("common/light_particle_purple"));
		lLightParticlePurple_spr.aplha = 0;
		lLightParticlePurple_spr.scale.set(7.03, 7.03);
		lLightParticlePurple_spr.position.set(-2.8, -16.85); //-5.6/2, -33.7/2
		lLightParticlePurple_spr.blendMode = PIXI.BLEND_MODES.ADD;

		let lLightParticlePurple_seq = [
			{tweens: [], duration: 1 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}], duration: 0 * FRAME_RATE},
			{tweens: [], duration: 11 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0.85}], duration: 4 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0.97}], duration: 4 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0}], duration: 10 * FRAME_RATE,
			onfinish: () => {
				lLightParticlePurple_spr && lLightParticlePurple_spr.destroy();
				this._fIsAnimationProgressCount_num--;
				this._completeAnimationSuspicision();
		}}];
		this._fIsAnimationProgressCount_num++;
		Sequence.start(lLightParticlePurple_spr, lLightParticlePurple_seq);
	}  

	_startLight8()
	{
		let lLight8_spr = this._fLight8_spr = this.addChild(APP.library.getSpriteFromAtlas("common/light8"));
		lLight8_spr.aplha = 0;
		lLight8_spr.scale.set(1.94, 1.94);
		lLight8_spr.blendMode = PIXI.BLEND_MODES.ADD;

		let l_seq = [
			{tweens: [], duration: 1 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}], duration: 0 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 1.67},{prop: 'scale.y', to: 1.67}], duration: 2 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 0},{prop: 'scale.y', to: 0}], duration: 6 * FRAME_RATE,
			onfinish: () => {
				lLight8_spr && lLight8_spr.destroy();
				this._fIsAnimationProgressCount_num--;
				this._completeAnimationSuspicision();
		}}];
		this._fIsAnimationProgressCount_num++;
		Sequence.start(lLight8_spr, l_seq);
	}

	_startParticlesYellow()
	{
		let lParticlesYellow_spr = this._fParticlesYellow_spr = this.addChild(APP.library.getSprite("enemies/money/mistery/particles_yellow"));
		lParticlesYellow_spr.aplha = 0;
		lParticlesYellow_spr.scale.set(0.51, 0.51);
		lParticlesYellow_spr.rotation = 0;
		lParticlesYellow_spr.blendMode = PIXI.BLEND_MODES.ADD;

		let l_seq = [
			{tweens: [], duration: 2 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}], duration: 0 * FRAME_RATE},
			{tweens: [
				{prop: 'scale.x', to: 0.722},
				{prop: 'scale.y', to: 0.722}, 
				{prop: 'rotation', to: 0.11693705988362009},], duration: 8 * FRAME_RATE}, //Utils.gradToRad(6.7)
			{tweens: [
				{prop: 'scale.x', to: 1.17},
				{prop: 'scale.y', to: 1.17},
				{prop: 'alpha', to: 0},
				{prop: 'rotation', to: 0.36302848441482055},], duration: 24 * FRAME_RATE, //Utils.gradToRad(20.8)
			onfinish: () => {
				lParticlesYellow_spr && lParticlesYellow_spr.destroy();
				this._fIsAnimationProgressCount_num--;
				this._completeAnimationSuspicision();
		}}];
		this._fIsAnimationProgressCount_num++;
		Sequence.start(lParticlesYellow_spr, l_seq);
	}

	_startLightParticleT1()
	{
		let lLightParticleT1_spr = this._fLightParticleT1_spr = this.addChild(APP.library.getSprite("enemies/money/mistery/light_particle_t1"));
		lLightParticleT1_spr.aplha = 0;
		lLightParticleT1_spr.scale.set(12.238, 12.238);
		lLightParticleT1_spr.blendMode = PIXI.BLEND_MODES.ADD;

		let l_seq = [
			{tweens: [], duration: 2 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0.21}], duration: 0 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}], duration: 5 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0}], duration: 13 * FRAME_RATE,
			onfinish: () => {
				lLightParticleT1_spr && lLightParticleT1_spr.destroy();
				this._fIsAnimationProgressCount_num--;
				this._completeAnimationSuspicision();
		}}];
		this._fIsAnimationProgressCount_num++;
		Sequence.start(lLightParticleT1_spr, l_seq);
	}

	_startLightCirclePurple()
	{
		let lLightCirclePurple_spr = this._fLightCirclePurple_spr = this.addChild(APP.library.getSprite("enemies/money/hit/light_circle_purple"));
		lLightCirclePurple_spr.aplha = 0;
		lLightCirclePurple_spr.scale.set(1, 1);
		lLightCirclePurple_spr.rotation = 0;
		lLightCirclePurple_spr.blendMode = PIXI.BLEND_MODES.ADD;

		let l_seq = [
			{tweens: [], duration: 1 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}, {prop: 'scale.x', to: 1.264}, {prop: 'scale.y', to: 1.264}], duration: 2 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0}, {prop: 'scale.x', to: 2.15}, {prop: 'scale.y', to: 2.15}], duration: 9 * FRAME_RATE,
		
			onfinish: () => {
				lLightCirclePurple_spr && lLightCirclePurple_spr.destroy();
				this._fIsAnimationProgressCount_num--;
				this._completeAnimationSuspicision();
		}}];
		this._fIsAnimationProgressCount_num++;
		Sequence.start(lLightCirclePurple_spr, l_seq);
	}

	_startLightCircle4()
	{
		let lLightCircle4_spr = this._fLightCircle4_spr = this.addChild(APP.library.getSprite("enemies/money/hit/light_circle_4"));
		lLightCircle4_spr.aplha = 0;
		lLightCircle4_spr.scale.set(0.43, 0.226);
		lLightCircle4_spr.position.set(-2.1, 12.4);
		lLightCircle4_spr.rotation = 0;
		lLightCircle4_spr.blendMode = PIXI.BLEND_MODES.ADD;

		let l_seq = [
			{tweens: [], duration: 1 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0.87}], duration: 0 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 0.886}, {prop: 'scale.y', to: 0.494}], duration: 1 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0.06}, {prop: 'scale.x', to: 5.03}, {prop: 'scale.y', to: 2.921}], duration: 18 * FRAME_RATE,
			onfinish: () => {
				lLightCircle4_spr && lLightCircle4_spr.destroy();
				this._fIsAnimationProgressCount_num--;
				this._completeAnimationSuspicision();
		}}];
		this._fIsAnimationProgressCount_num++;
		Sequence.start(lLightCircle4_spr, l_seq);
	}

	_startLightParticle2()
	{
		for (let i = 0; i < LIGHT_PARTICLE_PARAM.length; i++)
		{
			let lLightParticle2_spr = this._flLightParticle2_spr_arr[i] = this.addChild(APP.library.getSprite("enemies/money/mistery/light_particle_2"));
			lLightParticle2_spr.position.set(LIGHT_PARTICLE_PARAM[i].position[0].x, LIGHT_PARTICLE_PARAM[i].position[0].y);
			lLightParticle2_spr.scale.set(0.835, .835);
			lLightParticle2_spr.alpha = 0;
			lLightParticle2_spr.blendMode = PIXI.BLEND_MODES.ADD;

			let l_seq = [
				{tweens: [], duration: LIGHT_PARTICLE_PARAM[i].delay * FRAME_RATE},
				{tweens: [{prop: 'x', to: LIGHT_PARTICLE_PARAM[i].position[1].x}, {prop: 'y', to: LIGHT_PARTICLE_PARAM[i].position[1].y}], duration: 1 * FRAME_RATE},
				{tweens: [{prop: 'x', to: LIGHT_PARTICLE_PARAM[i].position[2].x}, {prop: 'y', to: LIGHT_PARTICLE_PARAM[i].position[2].y}], duration: 1 * FRAME_RATE},
				{tweens: [{prop: 'x', to: LIGHT_PARTICLE_PARAM[i].position[3].x}, {prop: 'y', to: LIGHT_PARTICLE_PARAM[i].position[3].y}], duration: 1 * FRAME_RATE},
				{tweens: [{prop: 'x', to: LIGHT_PARTICLE_PARAM[i].position[4].x}, {prop: 'y', to: LIGHT_PARTICLE_PARAM[i].position[4].y}], duration: 1 * FRAME_RATE},
				{tweens: [{prop: 'x', to: LIGHT_PARTICLE_PARAM[i].position[5].x}, {prop: 'y', to: LIGHT_PARTICLE_PARAM[i].position[5].y}], duration: 1 * FRAME_RATE},
				{tweens: [{prop: 'x', to: LIGHT_PARTICLE_PARAM[i].position[6].x}, {prop: 'y', to: LIGHT_PARTICLE_PARAM[i].position[6].y}], duration: 1 * FRAME_RATE},
				{tweens: [{prop: 'x', to: LIGHT_PARTICLE_PARAM[i].position[7].x}, {prop: 'y', to: LIGHT_PARTICLE_PARAM[i].position[7].y}], duration: 1 * FRAME_RATE},
				{tweens: [{prop: 'x', to: LIGHT_PARTICLE_PARAM[i].position[8].x}, {prop: 'y', to: LIGHT_PARTICLE_PARAM[i].position[8].y}], duration: 1 * FRAME_RATE},
				{tweens: [{prop: 'x', to: LIGHT_PARTICLE_PARAM[i].position[9].x}, {prop: 'y', to: LIGHT_PARTICLE_PARAM[i].position[9].y}], duration: 1 * FRAME_RATE},
				{tweens: [{prop: 'x', to: LIGHT_PARTICLE_PARAM[i].position[10].x}, {prop: 'y', to: LIGHT_PARTICLE_PARAM[i].position[10].y}], duration: 1 * FRAME_RATE},
				{tweens: [{prop: 'x', to: LIGHT_PARTICLE_PARAM[i].position[11].x}, {prop: 'y', to: LIGHT_PARTICLE_PARAM[i].position[11].y}, {prop: 'alpha', to: 0.83}], duration: 1 * FRAME_RATE},
				{tweens: [{prop: 'x', to: LIGHT_PARTICLE_PARAM[i].position[11].x}, {prop: 'y', to: LIGHT_PARTICLE_PARAM[i].position[11].y}, {prop: 'alpha', to: 0.67}], duration: 1 * FRAME_RATE},
				{tweens: [{prop: 'x', to: LIGHT_PARTICLE_PARAM[i].position[11].x}, {prop: 'y', to: LIGHT_PARTICLE_PARAM[i].position[11].y}, {prop: 'alpha', to: 0.5}], duration: 1 * FRAME_RATE},
				{tweens: [{prop: 'x', to: LIGHT_PARTICLE_PARAM[i].position[11].x}, {prop: 'y', to: LIGHT_PARTICLE_PARAM[i].position[11].y}, {prop: 'alpha', to: 0.17}], duration: 1 * FRAME_RATE},
				{tweens: [{prop: 'x', to: LIGHT_PARTICLE_PARAM[i].position[11].x}, {prop: 'y', to: LIGHT_PARTICLE_PARAM[i].position[11].y}, {prop: 'alpha', to: 0}], duration: 1 * FRAME_RATE,
				onfinish: () => {
					lLightParticle2_spr && lLightParticle2_spr.destroy();
					this._fIsAnimationProgressCount_num--;
					this._completeAnimationSuspicision();
			}}];
			this._fIsAnimationProgressCount_num++;
			Sequence.start(lLightParticle2_spr, l_seq);
		}
	}

	_startStreakFlare()
	{
		let lStreakFlare_spr = this._fStreakFlare_spr = this.addChild(APP.library.getSprite("enemies/money/mistery/streak_flare"));
		lStreakFlare_spr.aplha = 1;
		lStreakFlare_spr.scale.set(0, 0);
		lStreakFlare_spr.blendMode = PIXI.BLEND_MODES.ADD;

		let l_seq = [
			{tweens: [{prop: 'scale.x', to: 2.292}, {prop: 'scale.y', to: 2.292}], duration: 1 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 1.115}, {prop: 'scale.y', to: 1.115}], duration: 5 * FRAME_RATE,
			onfinish: () => {
				lStreakFlare_spr && lStreakFlare_spr.destroy();
				this._fIsAnimationProgressCount_num--;
				this._completeAnimationSuspicision();
		}}];
		this._fIsAnimationProgressCount_num++;
		Sequence.start(lStreakFlare_spr, l_seq);
	}

	_completeAnimationSuspicision()
	{
		if (this._fIsAnimationProgressCount_num <= 0)
		{
			this.emit(FormationHighlightAnimation.EVENT_ON_ANIMATION_ENDED);
		}
	}

	destroy()
	{
		this._fIsAnimationProgressCount_num = null;

		Sequence.destroy(Sequence.findByTarget(this._fFireSmoke21_spr));
		this._fFireSmoke21_spr && this._fFireSmoke21_spr.destroy();
		this._fFireSmoke21_spr = null;

		Sequence.destroy(Sequence.findByTarget(this._fFireSmoke_spr));
		this._fFireSmoke_spr && this._fFireSmoke_spr.destroy();
		this._fFireSmoke_spr = null;

		Sequence.destroy(Sequence.findByTarget(this._fFireSmoke22_spr));
		this._fFireSmoke22_spr && this._fFireSmoke22_spr.destroy();
		this._fFireSmoke22_spr = null;

		this._fMetalExplosionTimer_t && this._fMetalExplosionTimer_t.destructor();
		this._fMetalExplosionTimer_t = null;

		for (let i = 0; i < this._fSmokeBlue_spr_arr.length; i++)
		{
			Sequence.destroy(Sequence.findByTarget(this._fSmokeBlue_spr_arr[i]));
			this._fSmokeBlue_spr_arr[i] && this._fSmokeBlue_spr_arr[i].destroy();
			this._fSmokeBlue_spr_arr[i] = null;
		}
		this._fSmokeBlue_spr_arr = [];

		Sequence.destroy(Sequence.findByTarget(this._fFlameExplosion_spr));
		this._fFlameExplosion_spr && this._fFlameExplosion_spr.destroy();
		this._fFlameExplosion_spr = null;

		Sequence.destroy(Sequence.findByTarget(this._fFxExplosion_spr));
		this._fFxExplosion_spr && this._fFxExplosion_spr.destroy();
		this._fFxExplosion_spr = null;

		Sequence.destroy(Sequence.findByTarget(this._fLightParticlePurple_spr));
		this._fLightParticlePurple_spr && this._fLightParticlePurple_spr.destroy();
		this._fLightParticlePurple_spr = null;

		Sequence.destroy(Sequence.findByTarget(this._fLight8_spr));
		this._fLight8_spr && this._fLight8_spr.destroy();
		this._fLight8_spr = null;

		Sequence.destroy(Sequence.findByTarget(this._fParticlesYellow_spr));
		this._fParticlesYellow_spr && this._fParticlesYellow_spr.destroy();
		this._fParticlesYellow_spr = null;

		Sequence.destroy(Sequence.findByTarget(this._fLightParticleT1_spr));
		this._fLightParticleT1_spr && this._fLightParticleT1_spr.destroy();
		this._fLightParticleT1_spr = null;

		Sequence.destroy(Sequence.findByTarget(this._fLightCirclePurple_spr));
		this._fLightCirclePurple_spr && this._fLightCirclePurple_spr.destroy();
		this._fLightCirclePurple_spr = null;

		Sequence.destroy(Sequence.findByTarget(this._fLightCircle4_spr));
		this._fLightCircle4_spr && this._fLightCircle4_spr.destroy();
		this._fLightCircle4_spr = null;	

		for (let i = 0; i < this._flLightParticle2_spr_arr.length; i++)
		{
			Sequence.destroy(Sequence.findByTarget(this._flLightParticle2_spr_arr[i]));
			this._flLightParticle2_spr_arr[i] && this._flLightParticle2_spr_arr[i].destroy();
			this._flLightParticle2_spr_arr[i] = null;
		}
		this._flLightParticle2_spr_arr = [];

		Sequence.destroy(Sequence.findByTarget(this._fStreakFlare_spr));
		this._fStreakFlare_spr && this._fStreakFlare_spr.destroy();
		this._fStreakFlare_spr = null;

		super.destroy();
	}
}

export default FormationMisteryAnimation;