import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../shared/src/CommonConstants';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import Timer from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import SimpleUIView from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/SimpleUIView';
import { Utils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import BombValue from '../../../ui/BombValue';
import { AtlasSprite } from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import AtlasConfig from '../../../config/AtlasConfig';
import { BulgePinchFilter } from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Filters';
import * as Easing from '../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';

let _particlesTextures = null;
let _partBombTextures = null;
function _initPartBombTextures()
{
	if (_partBombTextures) return;

	_partBombTextures = AtlasSprite.getFrames(APP.library.getAsset("bomb/bomb_part"), AtlasConfig.Bomb, "");
}

function _initWickPoofTextures()
{
	if (_particlesTextures) return;

	_particlesTextures = AtlasSprite.getFrames(APP.library.getAsset("bomb/wick_poof"), AtlasConfig.BombWickPoof, "");
}

const CRACK_SETTING = 
{
	length: 5,
	position: [
		{x: -57, y: 50},
		{x: 15, y: 25},
		{x: 65, y: -34},
		{x: 50, y: 56},
		{x: 8, y: 20},
	],
	rotation: [
		-0.3665191429188092, //Utils.gradToRad(-21),
		-1.4660765716752369, //Utils.gradToRad(-84),
		-3.01941960595019, //Utils.gradToRad(-173),
		-2.478367537831948, //Utils.gradToRad(-142),
		0.12217304763960307 //Utils.gradToRad(7),
	],
	scale: [
		0.49,
		0.49,
		0.77,
		0.79,
		0.34,
	],
	delay: [
		70,
		71,
		72,
		74,
		78,
	],
	durationCoef:
	[
		21/15,
		20/15,
		19/15,
		17/15,
		13/15,
	]
};

const RAYS_SETTING = 
{
	length: 4,
	position: [
		{x: -33, y: 30},
		{x: 15, y: 15},
		{x: 40, y: -40},
		{x: -50, y: -45},
	],
	rotation: [
		-1.0995574287564276, //Utils.gradToRad(-63),
		-4.1887902047863905, //Utils.gradToRad(-240),
		-6.09119908946021, //Utils.gradToRad(-349),
		-0.4363323129985824 //Utils.gradToRad(-25),
	],
	delay: [
		68,
		70,
		73,
		79
	],
	duration: [
		23,
		21,
		18,
		12
	],
	scaleY: [
		0.55,
		0.55,
		0.85,
		0.44
	]
};

const BOMB_PART_SETTING = 
{
	length: 5,
	position: [
		{x: 0, y: -50},
		{x: -41, y: 23},
		{x: 0, y: 10},
		{x: 55, y: 10},
		{x: 12, y: 60},
	],
	rotation: [
		5.759586531581287, //Utils.gradToRad(330),
		-4.991641660703783, //Utils.gradToRad(-286),
		0, //Utils.gradToRad(0),
		4.991641660703783, //Utils.gradToRad(286),
		-4.537856055185257, //Utils.gradToRad(-260),
	],
	final_position: [
		{x: 100, y: -500},
		{x: -800, y: 100},
		{x: 600, y: -600},
		{x: 800, y: 50},
		{x: 70, y: 600},
	]
};

const SMOKE_SETTING = {
	length: 4,
	position: [
		{x: -24, y: 107},
		{x: -14, y: 99},
		{x: -7, y: 59},
		{x: 0, y: 40},
	],
}

const CIRCLE_FLOOR_SETTING = {
	length: 3,
	position: [
		{x: -24, y: 107},
		{x: -14, y: 99},
		{x: -7, y: 59},
		{x: 0, y: 40},
	],
}

class BombView extends SimpleUIView
{
	static get EVENT_ON_ANIMATION_COMPLETED()			{return "onAnimationCompleted";}
	static get EVENT_ON_WIN_VALUE_ANIMATION_COMPLETED() { return 'EVENT_ON_WIN_VALUE_ANIMATION_COMPLETED';}
	static get EVENT_ON_WIN_ANIMATION_STARTED() { return "EVENT_ON_WIN_ANIMATION_STARTED";}
	static get EVENT_ON_WIN_ANIMATION_COMPLETED() { return "EVENT_ON_WIN_ANIMATION_COMPLETED";}
	static get START_DELAY_AWARD() { return "START_DELAY_AWARD";}
	static get SHOW_MULT_WIN_AWARD() { return "SHOW_MULT_WIN_AWARD";}

	static get EVENT_ON_BOMB_SFX() { return "EVENT_ON_BOMB_SFX"; }


	resetView()
	{
		this._resetView();
	}

	get isAnimInProgress()
	{
		return this._fAnimInProgress_bln;
	}

	set Multiplayer_num(aVal_num)
	{
		this._fMultiplayer_num = aVal_num;
	}
	get Multiplayer_num()
	{
		return this._fMultiplayer_num ;
	}

	startAnimation()
	{
		this._interruptAnimations();
		this._fAnimInProgress_bln = true;
		this.visible = true;
		this._fBombContainer_sptr.visible = true;
		this._fMultiplayer_num = this.uiInfo.multiplayerWin;
		this._clearFinalMultiplayer();
		this._fEnemyArray_obj_arr = this.uiInfo.hitDataArray;

		this._updateMultiplayerCapture();

		this._startAnimation();
	}

	constructor()
	{
		super();
		this._fAnimInProgress_bln = false;
		this._fMultiplayer_num = 1;
		
		this._fBombContainer_sptr = null;
		this._fBomb_sprt  = null;
		this._fBombWick_sprt = null;
		this._fBombCrack_sprt_arr = [];
		this._fBombRays_sprt_arr = [];
		this._fSmoke_sqrt_arr = [];
		this._fCircleFloor_sprt_arr = [];
		this._fBombPart_sprt_arr = [];
		this._fMultiplayer_obj_arr = [];
		this._fGunBlust_sprt_arr = [];
		this._fMultiplayerValue_obj_arr = [];
		this.visible = false;
		this._fEnemyArray_obj_arr = [];
		this._fParticles_arr = [];
		this._fCountEnemyMultiplierAnimationPlaying_num = null;
		this._initBomb()
	}

	//CREATE BOMB...
	_initBomb()
	{
		this._createCover();
		this._createExplosion();
		this._createCircleBlast();

		let lBombContainer_sprt = this._fBombContainer_sptr = this.addChild(new Sprite());
		lBombContainer_sprt.scale.set(1.7);

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._createBombGlow();
		}
		this._createBomb();
		this._createRedBomb();
		this._createWick();
		this._createRedWick();
		this._createWickFire();
		this._createBombCrack();
		this._createRays();
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._createBombLight();
		}
		this._createGunBlust();
		this._createGlowOrb();
		this._createBombPart();
		
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			_initWickPoofTextures();
		}

		this._createMultiplayerCapture();
		this._createSmoke();
	}

	_createCover()
	{
		this._fCoverRed_sprt = this.addChild(APP.library.getSpriteFromAtlas("bomb/cover_red"));
		this._fCoverRed_sprt.scale.set(2.5, 2.5);
		this._fCoverRed_sprt.alpha = 0;

		let lAPPSize_obj = APP.config.size;
		this._fCoverBlack_sprt = this.addChild(new PIXI.Graphics());
		this._fCoverBlack_sprt.beginFill(0x000000).drawRect(-lAPPSize_obj.width/4-20, -lAPPSize_obj.height/4-10, lAPPSize_obj.width+40, lAPPSize_obj.height+20).endFill();
		this._fCoverBlack_sprt.scale.set(2.5, 2.5);
		this._fCoverBlack_sprt.alpha = 0;
	}

	_createExplosion()
	{
		let lExplision = this._fExplosion_sprt = this.addChild(APP.library.getSpriteFromAtlas("bomb/explosion"));
		lExplision.blendMode = PIXI.BLEND_MODES.ADD
		lExplision.anchor.set(0.5, 0.5);
		lExplision.scale.set(0.4);
		lExplision.visible = false;
	}

	_createCircleBlast()
	{
		let lCircle_sprt = this._fCircle_sprt = this.addChild(APP.library.getSprite("money_wheel/circle_blast"));
		lCircle_sprt.blendMode = PIXI.BLEND_MODES.SCREEN;
		lCircle_sprt.anchor.set(0.5, 0.5);
		lCircle_sprt.scale.set(0);
		lCircle_sprt.alpha = 0.72;

		for (let i = 0; i < CIRCLE_FLOOR_SETTING.length; i++) {
			let lCircleFloor_sprt = this.addChild(APP.library.getSprite("bomb/circle_blast_floor"));
			lCircleFloor_sprt.blendMode = PIXI.BLEND_MODES.SCREEN;
			lCircleFloor_sprt.anchor.set(0.5, 200/512);
			lCircleFloor_sprt.scale.set(0);
			lCircleFloor_sprt.visible = false;
			lCircleFloor_sprt.position.set(CIRCLE_FLOOR_SETTING.position[i].x, CIRCLE_FLOOR_SETTING.position[i].y);

			this._fCircleFloor_sprt_arr.push(lCircleFloor_sprt);
		}
		
	}

	_createBombGlow()
	{
		let lBomb_sprt = this._fBombGlow_sprt = this._fBombContainer_sptr.addChild(APP.library.getSpriteFromAtlas("bomb/bomb_glow"))
		lBomb_sprt.anchor.set(0.5, 0.5);
		lBomb_sprt.scale.set(0.9);
		lBomb_sprt.alpha = 0.;
	}

	_createBomb()
	{
		let lBomb_sprt = this._fBomb_sprt = this._fBombContainer_sptr.addChild(APP.library.getSpriteFromAtlas("bomb/bomb"))
		lBomb_sprt.anchor.set(0.5, 0.5);
	}

	_createWick()
	{
		let lBombWick_sprt = this._fBombWick_sprt = this._fBombContainer_sptr.addChild(APP.library.getSpriteFromAtlas("bomb/wick"))
		lBombWick_sprt.anchor.set(0.28125, 0.515625); //72/256, 132/256
		lBombWick_sprt.position.set(-55, -80)
	}

	_createWickFire()
	{
		let lBombWickFire_sprt = this._fBombWickFire_sprt = this._fBombContainer_sptr.addChild(APP.library.getSpriteFromAtlas("bomb/wick_fire"))
		lBombWickFire_sprt.anchor.set(0.5, 0.5);
		lBombWickFire_sprt.position.set(0, -105)
		lBombWickFire_sprt.rotation = -0.6981317007977318; //Utils.gradToRad(-40)

		let lBombWickFuse_1_sprt = this._fBombWickFuse_1_sprt = this._fBombWickFire_sprt.addChild(APP.library.getSpriteFromAtlas("bomb/fuse_1"))
		lBombWickFuse_1_sprt.anchor.set(0.273032, 0.5); //163/597, 0.5
		lBombWickFuse_1_sprt.scale.set(0.5);
		
		let lBombWickFuse_2_sprt = this._fBombWickFuse_2_sprt = this._fBombWickFire_sprt.addChild(APP.library.getSpriteFromAtlas("bomb/fuse_1"))
		lBombWickFuse_2_sprt.anchor.set(0.273032, 0.5); //163/597, 0.5
		lBombWickFuse_2_sprt.scale.set(0.5);

		let lBombWickFuse_3_sprt = this._fBombWickFuse_3_sprt = this._fBombWickFire_sprt.addChild(APP.library.getSpriteFromAtlas("bomb/fuse_2"))
		lBombWickFuse_3_sprt.anchor.set(0.273032, 0.5); //163/597, 0.5
		lBombWickFuse_3_sprt.scale.set(0.5);
	}

	_createMultiplayerCapture()
	{
		this._fValueContainer_obj = this._fBombContainer_sptr.addChild( new Sprite());
		this._fMultiplayerView_bv = this._fValueContainer_obj.addChild(new BombValue())
	}

	_updateMultiplayerCapture()
	{
		this._fMultiplayerView_bv.i_updateValue(this._fMultiplayer_num);

		let lBounds_obj = this._fMultiplayerView_bv.getLocalBounds();
		this._fMultiplayerView_bv.position.set(-lBounds_obj.width/2, 0);
	}

	_createRedBomb()
	{
		let lBomb_sprt = this._fBombRed_sprt = this._fBombContainer_sptr.addChild(APP.library.getSpriteFromAtlas("bomb/bomb_red"))
		lBomb_sprt.anchor.set(0.5, 0.5);
	}

	_createRedWick()
	{
		let lBombWick_sprt = this._fBombWickRed_sprt = this._fBombContainer_sptr.addChild(APP.library.getSpriteFromAtlas("bomb/wick_red"))
		lBombWick_sprt.anchor.set(0.28125, 0.515625); //72/256, 132/256
		lBombWick_sprt.position.set(-55, -80)
	}

	_createBombCrack()
	{
		for (let i = 0; i < CRACK_SETTING.length; i++)
		{
			let lBombCrack_sprt = this._fBombContainer_sptr.addChild(APP.library.getSpriteFromAtlas("bomb/bomb_crack"));
			lBombCrack_sprt.anchor.set(0.019531, 0.429688); //10/512, 55/128

			let lBounds_rect = lBombCrack_sprt.getBounds();
			let lMask_sprt = new Sprite();
	
			let lGraphics_gr = new PIXI.Graphics();
			lGraphics_gr.beginFill(0xffffff);
			lGraphics_gr.drawRect(lBounds_rect.x, lBounds_rect.y, lBounds_rect.width, lBounds_rect.height);
			lMask_sprt.addChild(lGraphics_gr);
	
			let l_txtr = APP.stage.renderer.generateTexture(lMask_sprt, PIXI.SCALE_MODES.LINEAR, 2, lBounds_rect);
			lMask_sprt = new PIXI.Sprite(l_txtr);
			lMask_sprt.anchor.set(1, 0.5);
			lMask_sprt.alpha = 0.7;

			lBombCrack_sprt.rotation = CRACK_SETTING.rotation[i];
			lBombCrack_sprt.position.set(CRACK_SETTING.position[i].x, CRACK_SETTING.position[i].y);
			lBombCrack_sprt.scale.set(CRACK_SETTING.scale[i]);

			lBombCrack_sprt.addChild(lMask_sprt);
			lBombCrack_sprt.mask = lMask_sprt;

			this._fBombCrack_sprt_arr.push(lBombCrack_sprt);
		}
	}

	_createRays()
	{
		for (let i = 0; i < RAYS_SETTING.length; i++) {
			let lBombRays_sprt = this._fBombContainer_sptr.addChild(APP.library.getSprite("bomb/bomb_rays"));
			lBombRays_sprt.anchor.set(0.441406, 0.851563); //452/1024, 872/1024
			
			lBombRays_sprt.rotation = RAYS_SETTING.rotation[i];
			lBombRays_sprt.position.set(RAYS_SETTING.position[i].x, RAYS_SETTING.position[i].y);
			lBombRays_sprt.visible = false;

			this._fBombRays_sprt_arr.push(lBombRays_sprt);
		}
	}

	_createBombLight()
	{
		let lBomblight_sprt = this._fBombLight_sprt = this._fBombContainer_sptr.addChild(APP.library.getSpriteFromAtlas("bomb/bomb_light"))
		lBomblight_sprt.anchor.set(0.5, 0.48);
		if(APP.isMobile)
		{
			lBomblight_sprt.position.set(35, 30);
		}
	}

	_createGunBlust()
	{
		let lGunBlust_sprt = this.addChild(APP.library.getSprite("bomb/gun_blast"));
		lGunBlust_sprt.visible = false;
		lGunBlust_sprt.anchor.set(0.5, 0.5);
		lGunBlust_sprt.scale.set(12.64, 12.64)
		lGunBlust_sprt.blendMode = PIXI.BLEND_MODES.ADD;
		this._fGunBlust_sprt_arr.push(lGunBlust_sprt)

		let lGunBlust2_sprt = this.addChild(APP.library.getSprite("bomb/gun_blast"));
		lGunBlust2_sprt.visible = false;
		lGunBlust2_sprt.anchor.set(0.5, 0.5);
		lGunBlust2_sprt.scale.set(10.73, 10.73 )
		lGunBlust2_sprt.blendMode = PIXI.BLEND_MODES.ADD;
		this._fGunBlust_sprt_arr.push(lGunBlust2_sprt)

		let lGunBlust3_sprt = this.addChild(APP.library.getSprite("bomb/gun_blast"));
		lGunBlust3_sprt.visible = false;
		lGunBlust3_sprt.anchor.set(0.5, 0.5);
		lGunBlust3_sprt.scale.set(5.92, 5.92)
		lGunBlust3_sprt.blendMode = PIXI.BLEND_MODES.ADD;
		this._fGunBlust_sprt_arr.push(lGunBlust3_sprt)
	}
	
	_createGlowOrb()
	{
		let lGlowOrb_sprt = this._fGlowOrb_sprt = this.addChild(APP.library.getSpriteFromAtlas("bomb/orb_glow"));
		lGlowOrb_sprt.visible = false;
		lGlowOrb_sprt.anchor.set(0.5, 0.5);
		lGlowOrb_sprt.blendMode = PIXI.BLEND_MODES.ADD;
	}

	_createBombPart()
	{
		this._fBombPartContainer_sptr = this.addChild(new Sprite());
		this._fBombPartContainer_sptr.visible = false;

		_initPartBombTextures();
		for (let i = 0; i < _partBombTextures.length; i++) {
			let lBombPart_sprt = this._fBombPartContainer_sptr.addChild(new Sprite());
			lBombPart_sprt.texture = _partBombTextures[i];
			lBombPart_sprt.blendMode = PIXI.BLEND_MODES.SCREEN;
			lBombPart_sprt.scale.set(1.08);
			lBombPart_sprt.position.set(BOMB_PART_SETTING.position[i].x, BOMB_PART_SETTING.position[i].y);
			this._fBombPart_sprt_arr.push(lBombPart_sprt);
		}
	}

	_createSmoke()
	{
		for (let i = 0; i < SMOKE_SETTING.length; i++) {
			let lSmoke_sprt = this.addChild(APP.library.getSprite("bomb/smoke"));
			lSmoke_sprt.anchor.set(0.412109,0.5); //211/512,0.5)
			lSmoke_sprt.visible = false;
			lSmoke_sprt.blendMode = PIXI.BLEND_MODES.ADD;
			lSmoke_sprt.position.set(SMOKE_SETTING.position[i].x, SMOKE_SETTING.position[i].y)

			this._fSmoke_sqrt_arr.push(lSmoke_sprt);
		}
	}

	_createFinalMultiplayer()
	{
		for (let i = 0; i < this._fEnemyArray_obj_arr.length; i++) {
			let Container_obj = this.addChild( new Sprite());
	
			let lValue_ta = Container_obj.addChild(new BombValue());
			this._fMultiplayerValue_obj_arr.push(lValue_ta);

			Container_obj.scale.set(0, 0);
			this._fMultiplayer_obj_arr.push(Container_obj);
		}

		if (!this._fEnemyArray_obj_arr || !this._fEnemyArray_obj_arr.length)
		{
			this._completeAllEnemyMultiplierAnimationSuspicion();
		}
		
		this._apdateFinalMultiplayer(this._fMultiplayer_num);
	}

	_clearFinalMultiplayer()
	{
		for (let i = 0; i < this._fMultiplayer_obj_arr.length; i++) {
			this._fMultiplayer_obj_arr[i].destroy();
		}
		this._fMultiplayer_obj_arr = [];
		this._fEnemyArray_obj_arr = [];
		for (let i = 0; i < this._fMultiplayerValue_obj_arr.length; i++) {
			this._fMultiplayerValue_obj_arr[i].destroy();
		}
		this._fMultiplayerValue_obj_arr = [];
	}

	_apdateFinalMultiplayer(aVal_num)
	{
		for (let i = 0; i < this._fMultiplayerValue_obj_arr.length; i++) {
			this._fMultiplayerValue_obj_arr[i].i_updateValue(aVal_num);
		}
	}
	//...CREATE BOMB

	_startAnimation()
	{
		this._startCoverAnimation();
		this._startBombMoveAnimation();
		this._startBombExplosionAnimation();

		APP.gameScreen.gameFieldController.shakeTheGround("bomb");
	}
	
	_startCoverAnimation()
	{
		let lAlphaRed_seq = 
		[
			{tweens: [],duration: 6*FRAME_RATE},
			{tweens: [ {prop: "alpha", to: 0.35} ],duration: 11*FRAME_RATE},
			{tweens: [ {prop: "alpha", to: 0.1} ],duration: 91*FRAME_RATE},
			{tweens: [ {prop: "alpha", to: 0} ],duration: 32*FRAME_RATE},
		];
		Sequence.start(this._fCoverRed_sprt, lAlphaRed_seq);

		let lAlphaBlack_seq = 
		[
			{tweens: [],duration: 3*FRAME_RATE},
			{tweens: [ {prop: "alpha", to: 0.5} ],duration: 7*FRAME_RATE},
			{tweens: [ {prop: "alpha", to: 0.62} ],duration: 99*FRAME_RATE},
			{tweens: [ {prop: "alpha", to: 0} ],duration: 32*FRAME_RATE},
		];
		Sequence.start(this._fCoverBlack_sprt, lAlphaBlack_seq);
	}

	_startBombMoveAnimation()
	{
		this._fBombContainer_sptr.scale.set(1.7);
		this._fBombContainer_sptr.rotation = -1.5707963267948966; //Utils.gradToRad(-90);
		this._fBombContainer_sptr.position.set(-40,157)

		let lScale_seq = [
			{tweens: [ {prop: "scale.x", to: 1.81}, {prop: "scale.y", to: 1.81} ],duration: 8*FRAME_RATE, ease:Easing.sine.easeOut},
			{tweens: [ {prop: "scale.x", to: 0.73}, {prop: "scale.y", to: 0.73} ],duration: 8*FRAME_RATE, ease:Easing.sine.easeIn},
			{tweens: [ {prop: "scale.x", to: 0.79}, {prop: "scale.y", to: 0.79} ],duration: 3*FRAME_RATE, ease:Easing.sine.easeOut},
			{tweens: [ {prop: "scale.x", to: 0.58}, {prop: "scale.y", to: 0.58} ],duration: 3*FRAME_RATE, ease:Easing.sine.easeInOut},
			{tweens: [ {prop: "scale.x", to: 0.59}, {prop: "scale.y", to: 0.59} ],duration: 4*FRAME_RATE, ease:Easing.sine.easeOut},
			{tweens: [ {prop: "scale.x", to: 0.56}, {prop: "scale.y", to: 0.56} ],duration: 5*FRAME_RATE, ease:Easing.sine.easeIn},
			{tweens: [],duration: 40*FRAME_RATE},
			{tweens: [ {prop: "scale.x", to: 0.62}, {prop: "scale.y", to: 0.62} ],duration: 7*FRAME_RATE, ease:Easing.sine.easeOut},
			{tweens: [ {prop: "scale.x", to: 0.71}, {prop: "scale.y", to: 0.71} ],duration: 14*FRAME_RATE, ease:Easing.sine.easeOut},
		];
		Sequence.start(this._fBombContainer_sptr, lScale_seq);

		let lRotation_seq = [
			{tweens:[{prop: "rotation", to: -0.3490658503988659}], duration: 16*FRAME_RATE, ease:Easing.sine.easeOut}, // Utils.gradToRad(-20)
			{tweens:[{prop: "rotation", to: -0.2617993877991494}], duration: 1*FRAME_RATE}, // Utils.gradToRad(-15)
			{tweens:[{prop: "rotation", to: -0.17453292519943295}], duration: 5*FRAME_RATE, ease:Easing.sine.easeOut}, // Utils.gradToRad(-10)
			{tweens:[{prop: "rotation", to: -0.14835298641951802}], duration: 1*FRAME_RATE, ease:Easing.sine.easeIn}, // Utils.gradToRad(-8.5)
			{tweens:[{prop: "rotation", to: 0}], duration: 30*FRAME_RATE, ease:Easing.sine.easeInOut}, //Utils.gradToRad(0)
		]
		Sequence.start(this._fBombContainer_sptr, lRotation_seq);

		let lPosition_seq = [
			{tweens: [	
				{prop: "position.x", to: -24},
				{prop: "position.y", to: 72},
			],
			duration: 16*FRAME_RATE, ease:Easing.sine.easeOut},
			{tweens: [	
				{prop: "position.x", to: -14},
				{prop: "position.y", to: 64},
			],
			duration: 6*FRAME_RATE, ease:Easing.sine.easeInOut},
			{tweens: [	
				{prop: "position.x", to: -7},
				{prop: "position.y", to: 24},
			],
			duration: 9*FRAME_RATE, ease:Easing.sine.easeInOut},
			{tweens: [	
				{prop: "position.x", to: 0},
				{prop: "position.y", to: 5, ease:Easing.sine.easeInOut},
			],
			duration: 5*FRAME_RATE},
			{tweens: [	
				{prop: "position.x", to: 0},
				{prop: "position.y", to: 0, ease:Easing.sine.easeOut},
			],
			duration: 13*FRAME_RATE},
		];

		Sequence.start(this._fBombContainer_sptr, lPosition_seq);
		
		let lScaleY_seq = [
			{tweens: [],duration: 15*FRAME_RATE},
			{tweens: [ {prop: "scale.y", to: 0.6716} ],duration: 1*FRAME_RATE, ease:Easing.sine.easeOut}, //prop: "scale.y", to: 0.92 * 0.73}
			{tweens: [ {prop: "scale.y", to: 0.6083} ],duration: 2*FRAME_RATE, ease:Easing.sine.easeOut}, //prop: "scale.y", to: 0.79 * 0.77
			{tweens: [ {prop: "scale.y", to: 0.58} ],duration: 4*FRAME_RATE, ease:Easing.sine.easeOut}, //{prop: "scale.y", to: 1 * 0.58} 
			{tweens: [ {prop: "scale.y", to: 0.5452} ],duration: 1*FRAME_RATE, ease:Easing.sine.easeOut}, //{prop: "scale.y", to: 0.94 * 0.58} 
			{tweens: [ {prop: "scale.y", to: 0.4872} ],duration: 2*FRAME_RATE, ease:Easing.sine.easeOut}, //{prop: "scale.y", to: 0.84 * 0.58} 
			{tweens: [ {prop: "scale.y", to: 0.56} ],duration: 5*FRAME_RATE, ease:Easing.sine.easeOut}, //{prop: "scale.y", to: 1 * 0.56}
			{tweens: [ {prop: "scale.y", to: 0.5264} ],duration: 1*FRAME_RATE, ease:Easing.sine.easeOut}, //{prop: "scale.y", to: 0.94 * 0.56}
			{tweens: [ {prop: "scale.y", to: 0.58} ],duration: 2*FRAME_RATE, ease:Easing.sine.easeOut}, //{prop: "scale.y", to: 1 * 0.58} 
		];
		Sequence.start(this._fBombContainer_sptr, lScaleY_seq);

		this._startSmokeAnimation();
		this._startFoorBlastAnimation();
	}

	_startSmokeAnimation()
	{
		let lTimout_seq = [
			{tweens: [],duration: 16*FRAME_RATE, onfinish: () => {this._startSingleSmokeAnimation(this._fSmoke_sqrt_arr[0])}},
			{tweens: [],duration: 8*FRAME_RATE, onfinish: () => {this._startSingleSmokeAnimation(this._fSmoke_sqrt_arr[1])}},
			{tweens: [],duration: 6*FRAME_RATE, onfinish: () => {this._startSingleSmokeAnimation(this._fSmoke_sqrt_arr[2])}},
			{tweens: [],duration: 8*FRAME_RATE, onfinish: () => {this._startSingleSmokeAnimation(this._fSmoke_sqrt_arr[3])}},
		];
		Sequence.start(this, lTimout_seq);
	}

	_startSingleSmokeAnimation(aSmoke_sprt)
	{
		aSmoke_sprt.scale.set(0.23, 0.30);
		aSmoke_sprt.alpha = 1;
		aSmoke_sprt.visible = true;

		let lScale_seq = [
			{tweens: [ {prop: "scale.x", to: 0.83}, {prop: "scale.y", to: 0.64} ],duration: 13*FRAME_RATE},
		];
		Sequence.start(aSmoke_sprt, lScale_seq);

		let lAlpha_seq = [
			{tweens: [],duration: 7*FRAME_RATE},
			{tweens: [ {prop: "alpha", to: 0} ],duration: 6*FRAME_RATE,	onfinish: () => {
				aSmoke_sprt.visible = false;
			}}
		];
		Sequence.start(aSmoke_sprt, lAlpha_seq);
	}

	_startFoorBlastAnimation()
	{
		let lTimout_seq = [
			{tweens: [],duration: 12*FRAME_RATE, onfinish: () => {this.emit(BombView.EVENT_ON_BOMB_SFX), this._startSingleFoorBlastAnimation(this._fCircleFloor_sprt_arr[0])}},
			{tweens: [],duration: 7*FRAME_RATE, onfinish: () => {this._startSingleFoorBlastAnimation(this._fCircleFloor_sprt_arr[1])}},
			{tweens: [],duration: 9*FRAME_RATE, onfinish: () => {this._startSingleFoorBlastAnimation(this._fCircleFloor_sprt_arr[2])}},
		];
		Sequence.start(this, lTimout_seq);
	}

	_startSingleFoorBlastAnimation(aCircleFloor_sprt)
	{
		aCircleFloor_sprt.scale.set(0, 0);
		aCircleFloor_sprt.alpha = 0.72;
		aCircleFloor_sprt.visible = true;

		let lScale_seq = [
			{tweens: [ {prop: "scale.x", to: 0.45}, {prop: "scale.y", to: 0.45} ],duration: 12*FRAME_RATE, ease:Easing.sine.easeOut},
		];
		Sequence.start(aCircleFloor_sprt, lScale_seq);

		let lAlpha_seq = [
			{tweens: [],duration: 1*FRAME_RATE},
			{tweens: [ {prop: "alpha", to: 0} ],duration: 8*FRAME_RATE, ease:Easing.sine.easeOut,	onfinish: () => {
				aCircleFloor_sprt.visible = false;
			}}
		];
		Sequence.start(aCircleFloor_sprt, lAlpha_seq);
	}

	_startExplosionAnimation()
	{
		let lScale_seq = [
			{tweens: [],duration: 80*FRAME_RATE, onfinish: () => {
				this.emit(BombView.START_DELAY_AWARD);
			}},
			{tweens: [],duration: 10*FRAME_RATE, onfinish: () => {
				this._fExplosion_sprt.visible = true;
				this._fExplosion_sprt.scale.set(0.4);
				this._startBombPartAnimation();
				this._startGlowOrbAnimation();
				if(this.Multiplayer_num != 1)
				{
					this._startMultiplaerAnimation();
				}
				else
				{
					this.emit(BombView.EVENT_ON_WIN_ANIMATION_COMPLETED);
				}
			}},
			{tweens: [ {prop: "scale.x", to: 1}, {prop: "scale.y", to: 1} ],duration: 4*FRAME_RATE},
			{tweens: [ {prop: "scale.x", to: 4}, {prop: "scale.y", to: 4} ],duration: 15*FRAME_RATE},
		];

		let lAplha_seq = [
			{tweens: [],duration: 102*FRAME_RATE},
			{tweens: [ {prop: "alpha", to: 0} ],duration: 6*FRAME_RATE, onfinish:() => {
				this._fExplosion_sprt.visible = false;
			}},
		];

		Sequence.start(this._fExplosion_sprt, lScale_seq);
		Sequence.start(this._fExplosion_sprt, lAplha_seq);
	}

	_startCircleGlowAnimation()
	{
		let lTimout_seq = [
			{tweens: [],duration: 50*FRAME_RATE, onfinish: () => {this._startSingleCircleGlowAnimation()}},
			{tweens: [],duration: 19*FRAME_RATE, onfinish: () => {this._startSingleCircleGlowAnimation()}},
			{tweens: [],duration: 8*FRAME_RATE, onfinish: () => {this._startSingleCircleGlowAnimation()}},
			{tweens: [],duration: 6*FRAME_RATE, onfinish: () => {this._startSingleCircleGlowAnimation()}},
			{tweens: [],duration: 3*FRAME_RATE, onfinish: () => {this._startSingleCircleGlowAnimation()}},
		];
		Sequence.start(this, lTimout_seq);
	}

	_startSingleCircleGlowAnimation()
	{
		this._fCircle_sprt.scale.set(1); //0.25 * 4
		this._fCircle_sprt.alpha = 0.72;

		let lScale_seq = [
			{tweens: [ {prop: "scale.x", to: 1.8}, {prop: "scale.y", to: 1.8} ],duration: 9*FRAME_RATE, ease:Easing.sine.easeOut}, //{prop: "scale.x", to: 0.45*4}, {prop: "scale.y", to: 0.45*4}
		];

		let lAplha_seq = [
			{tweens: [ {prop: "alpha", to: 0} ],duration: 8*FRAME_RATE, ease:Easing.sine.easeOut},
		];

		Sequence.start(this._fCircle_sprt, lScale_seq);
		Sequence.start(this._fCircle_sprt, lAplha_seq);
	}

	_startBombExplosionAnimation()
	{
		this._startWickAnimation();
		this._startRedAnimation();
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startBombGlowAnimation();
			this._startLightAnimation();
		}
		this._startRayAnimation();
		this._startCrackAnimation();
		this._startBulgeAnimation();

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startParticleAnimation();
		}

		this._startExplosionAnimation();
		this._startCircleGlowAnimation();
	}

	get _WickMask_sprt()
	{
		return this._fWickMask_sprt ? this._fWickMask_sprt : this._fWickMask_sprt = this._createWickMask();
	}

	_createWickMask()
	{
		this._fBombWickFire_sprt.visible = true;
		let lBounds_rect = this._fBombWick_sprt.getBounds();
		lBounds_rect.height = lBounds_rect.height * 2;
		let lMask_sprt = new Sprite();


		let lGraphics_gr = new PIXI.Graphics();
		lGraphics_gr.beginFill(0xffffff);
		lGraphics_gr.drawRect(lBounds_rect.x, lBounds_rect.y, lBounds_rect.width, lBounds_rect.height);
		lMask_sprt.addChild(lGraphics_gr);

		let l_txtr = APP.stage.renderer.generateTexture(lMask_sprt, PIXI.SCALE_MODES.LINEAR, 2, lBounds_rect);
		lMask_sprt = new PIXI.Sprite(l_txtr);
		lMask_sprt.anchor.set(0.5, 1);
		lMask_sprt.rotation = -140;
		lMask_sprt.position.set(60, -25)
		this._fBombWickRed_sprt.addChild(lMask_sprt);
		this._fBombWickRed_sprt.mask = lMask_sprt;
		this._fBombWick_sprt.addChild(lMask_sprt);
		this._fBombWick_sprt.mask = lMask_sprt;

		return lMask_sprt;
	}

	_startWickAnimation()
	{
		this._startFireAnimation();

		let lMask_sprt = this._WickMask_sprt
		lMask_sprt.rotation = -140;
		lMask_sprt.position.set(60, -25)


		let lMaskPosition_seq = 
		[
			{tweens: [	
				{prop: "position.x", to: 50},
				{prop: "position.y", to: -10},
			],
			duration: 18*FRAME_RATE},
			{tweens: [	
				{prop: "position.x", to: 40},
				{prop: "position.y", to: -6},
			],
			duration: 7*FRAME_RATE},
			{tweens: [	
				{prop: "position.x", to: 0},
				{prop: "position.y", to: -15},
			],
			duration: 8*FRAME_RATE,
			onfinish: () => {lMask_sprt.rotation = -184.8}},
			{tweens: [	
				{prop: "position.x", to: -18},
				{prop: "position.y", to: 0},
			],
			duration: 10*FRAME_RATE},
			{tweens: [	
				{prop: "position.x", to: -15},
				{prop: "position.y", to: 13},
			],
			duration: 10*FRAME_RATE,
			onfinish: () => {lMask_sprt.rotation = -185.5}},
			{tweens: [	
				{prop: "position.x", to: 0},
				{prop: "position.y", to: 35},
			],
			duration: 23*FRAME_RATE,},
		];
		Sequence.start(lMask_sprt, lMaskPosition_seq);
	}

	_startFireAnimation()
	{
		this._fBombWickFire_sprt.visible = true;
		this._fBombWickFire_sprt.position.set(0, -105)
		this._fBombWickFire_sprt.rotation = -0.6981317007977318; //Utils.gradToRad(-40)

		let lFirePosition_seq = 
		[
			{tweens: [	
				{prop: "position.x", to: -10},
				{prop: "position.y", to: -90},
			],
			duration: 18*FRAME_RATE},
			{tweens: [	
				{prop: "position.x", to: -20},
				{prop: "position.y", to: -86},
			],
			duration: 7*FRAME_RATE},
			{tweens: [	
				{prop: "position.x", to: -60},
				{prop: "position.y", to: -95},
			],
			duration: 9*FRAME_RATE},
			{tweens: [	
				{prop: "position.x", to: -74},
				{prop: "position.y", to: -80},
			],
			duration: 10*FRAME_RATE},
			{tweens: [	
				{prop: "position.x", to: -70},
				{prop: "position.y", to: -63},
			],
			duration: 10*FRAME_RATE},
			{tweens: [	
				{prop: "position.x", to: -50},
				{prop: "position.y", to: -45},
			],
			duration: 23*FRAME_RATE},
		];
		
		let lFireRotation_seq = 
		[
			{tweens: [{prop: "rotation", to: 0}],duration: 34*FRAME_RATE}, //Utils.gradToRad(0)
			{tweens: [{prop: "rotation", to: -2.9146998508305306}],duration: 26*FRAME_RATE}, // Utils.gradToRad(-167)
			{tweens: [{prop: "rotation", to: -2.9321531433504737}],duration: 22*FRAME_RATE, // Utils.gradToRad(-168)
				onfinish: () => {this._fBombWickFire_sprt.visible = false;}},
		];

		let lTimer_tmr = this._fTimer_tmr = new Timer(()=>{} , 72 * FRAME_RATE)
		lTimer_tmr.on("tick" , () => {
			this._fBombWickFuse_1_sprt.alpha = Math.random();
			this._fBombWickFuse_2_sprt.alpha = Math.random();
			this._fBombWickFuse_3_sprt.alpha = Math.random();

			this._fBombWickFuse_1_sprt.scale.set(Utils.random(13,30) / 100);
			this._fBombWickFuse_2_sprt.scale.set(Utils.random(13,30) / 100);
			this._fBombWickFuse_3_sprt.scale.set(Utils.random(13,30) / 100);
		}, this);
		
		Sequence.start(this._fBombWickFire_sprt, lFirePosition_seq);
		Sequence.start(this._fBombWickFire_sprt, lFireRotation_seq);
	}

	_startRedAnimation()
	{
		this._fBombWickRed_sprt.alpha = 0;
		this._fBombRed_sprt.alpha = 0;

		let lAplhaRedBomb_seq = 
		[
			{tweens: [],duration: 15*FRAME_RATE},
			{tweens: [ {prop: "alpha", to: 1} ],duration: 1*FRAME_RATE},
			{tweens: [ {prop: "alpha", to: 0} ],duration: 3*FRAME_RATE},
			{tweens: [],duration: 3*FRAME_RATE},
			{tweens: [ {prop: "alpha", to: 1} ],duration: 2*FRAME_RATE},
			{tweens: [ {prop: "alpha", to: 0} ],duration: 2*FRAME_RATE},
			{tweens: [],duration: 3*FRAME_RATE},
			{tweens: [ {prop: "alpha", to: 1} ],duration: 2*FRAME_RATE},
			{tweens: [ {prop: "alpha", to: 0} ],duration: 2*FRAME_RATE},
			{tweens: [],duration: 5*FRAME_RATE},
			{tweens: [ {prop: "alpha", to: 1} ],duration: 2*FRAME_RATE},
			{tweens: [ {prop: "alpha", to: 0} ],duration: 2*FRAME_RATE},
			{tweens: [],duration: 6*FRAME_RATE},
			{tweens: [ {prop: "alpha", to: 1} ],duration: 2*FRAME_RATE},
			{tweens: [ {prop: "alpha", to: 0} ],duration: 2*FRAME_RATE},
			{tweens: [],duration: 2*FRAME_RATE},
			{tweens: [ {prop: "alpha", to: 1} ],duration: 2*FRAME_RATE},
			{tweens: [ {prop: "alpha", to: 0} ],duration: 2*FRAME_RATE},
			{tweens: [],duration: 1*FRAME_RATE},
			{tweens: [ {prop: "alpha", to: 1} ],duration: 2*FRAME_RATE},
			{tweens: [ {prop: "alpha", to: 0} ],duration: 2*FRAME_RATE},
			{tweens: [ {prop: "alpha", to: 1} ],duration: 2*FRAME_RATE},
			{tweens: [ {prop: "alpha", to: 0} ],duration: 2*FRAME_RATE},
			{tweens: [ {prop: "alpha", to: 1} ],duration: 2*FRAME_RATE},
		];
		Sequence.start(this._fBombRed_sprt, lAplhaRedBomb_seq);

		let lAplhaRedBombWick_seq = 
		[
			{tweens: [],duration: 38*FRAME_RATE},
			{tweens: [ {prop: "alpha", to: 1} ],duration: 2*FRAME_RATE},
			{tweens: [ {prop: "alpha", to: 0} ],duration: 2*FRAME_RATE},
			{tweens: [],duration: 8*FRAME_RATE},
			{tweens: [ {prop: "alpha", to: 1} ],duration: 2*FRAME_RATE},
			{tweens: [ {prop: "alpha", to: 0} ],duration: 2*FRAME_RATE},
			{tweens: [],duration: 7*FRAME_RATE},
			{tweens: [ {prop: "alpha", to: 1} ],duration: 2*FRAME_RATE},
		];
		Sequence.start(this._fBombWickRed_sprt, lAplhaRedBombWick_seq);
	}

	_startBombGlowAnimation()
	{
		this._fBombGlow_sprt.alpha = 0;
		this._fBombGlow_sprt.scale.set(0.9);

		let lAplhaGlowBomb_seq = 
		[
			{tweens: [],duration: 32*FRAME_RATE},
			{tweens: [ {prop: "alpha", to: 1} ],duration: 36*FRAME_RATE},
		];
		Sequence.start(this._fBombGlow_sprt, lAplhaGlowBomb_seq);

		let lScaleGlowBomb_seq = 
		[
			{tweens: [],duration: 32*FRAME_RATE},
			{tweens: [ {prop: "scale.x", to: 1.1}, {prop: "scale.y", to: 1.1} ],duration: 58*FRAME_RATE},
		];
		Sequence.start(this._fBombGlow_sprt, lScaleGlowBomb_seq);
	}

	_startLightAnimation()
	{
		this._fBombLight_sprt.alpha = 0;

		let lAplhaGlowBomb_seq = 
		[
			{tweens: [],duration: 70*FRAME_RATE},
			{tweens: [ {prop: "alpha", to: 1} ],duration: 20*FRAME_RATE},
		];
		Sequence.start(this._fBombLight_sprt, lAplhaGlowBomb_seq);
	}

	_startRayAnimation()
	{
		for (let i = 0; i < RAYS_SETTING.length; i++) {
			let lBombRays_sprt = this._fBombRays_sprt_arr[i];
			lBombRays_sprt.scale.x = 0.55;
			lBombRays_sprt.scale.y = 0;

			let lScaleRay_seq = 
			[
				{tweens: [],duration: RAYS_SETTING.delay[i] * FRAME_RATE,onfinish: () => {lBombRays_sprt.visible = true}},
				{tweens: [ {prop: "scale.x", to: 0.85}, {prop: "scale.y", to: RAYS_SETTING.scaleY[i]} ],duration: RAYS_SETTING.duration[i] * FRAME_RATE, ease:Easing.sine.easeOut},
			];
			Sequence.start(lBombRays_sprt, lScaleRay_seq);
		}
	}

	_startCrackAnimation()
	{
		for (let i = 0; i < CRACK_SETTING.length; i++) {
			let lBombCrack_sprt = this._fBombCrack_sprt_arr[i].mask;
			lBombCrack_sprt.position.x = 0;
			
			let lScaleRay_seq = 
			[
				{tweens: [],duration: CRACK_SETTING.delay[i] * FRAME_RATE},
				{tweens: [ {prop: "position.x", to: 75} ],duration: 2 * CRACK_SETTING.durationCoef[i] * FRAME_RATE},
				{tweens: [],duration: 4 * CRACK_SETTING.durationCoef[i] * FRAME_RATE},
				{tweens: [ {prop: "position.x", to: 160} ],duration: 2 * CRACK_SETTING.durationCoef[i] * FRAME_RATE},
				{tweens: [],duration: 5 * CRACK_SETTING.durationCoef[i] * FRAME_RATE},
				{tweens: [ {prop: "position.x", to: 200} ],duration: 2 * CRACK_SETTING.durationCoef[i] * FRAME_RATE},
			];
			Sequence.start(lBombCrack_sprt, lScaleRay_seq);
		}
	}

	_createBulgePenchFilter()
	{
		this._fBulgePinchFilter_f = new BulgePinchFilter();
		this._fBulgePinchFilter_f.resolution = APP.stage.renderer.resolution;
		this._fBulgePinchFilter_f.uniforms.strength = 0;
		this._fBulgePinchFilter_f.uniforms.radius = 234;
		this._fBombContainer_sptr.filters = this._fBombContainer_sptr.filters || [];
		let lAlphaFilter = new PIXI.filters.AlphaFilter();
		lAlphaFilter.resolution = APP.stage.renderer.resolution;
		this._fBombContainer_sptr.filters = this._fBombContainer_sptr.filters.concat([this._fBulgePinchFilter_f, lAlphaFilter]);
	}

	_startBulgeAnimation()
	{
		this._createBulgePenchFilter();
		let lFilterStrength_seq = [
			{tweens: [],duration: 64*FRAME_RATE},
			{tweens: [{prop: 'uniforms.strength', to: 0.7}],duration: 27*FRAME_RATE, 
				onfinish: () =>{
					this._fBombContainer_sptr.visible = false
					this._fBombContainer_sptr.filters = null;}},
		];
		Sequence.start(this._fBulgePinchFilter_f, lFilterStrength_seq);
	}

	_startParticleAnimation()
	{
		let lTimout_seq = 
		[
			{tweens: [],duration: 8*FRAME_RATE , onfinish: () => {this._startParticle({x: 0, y: - 105})}},
			{tweens: [],duration: 4*FRAME_RATE , onfinish: () => {this._startParticle({x: -6, y: - 90})}},
			{tweens: [],duration: 18*FRAME_RATE , onfinish: () => {this._startParticle({x: -28, y: - 87})}},
			{tweens: [],duration: 5*FRAME_RATE , onfinish: () => {this._startParticle({x: -46, y: - 90})}},
			{tweens: [],duration: 8*FRAME_RATE , onfinish: () => {this._startParticle({x: -57, y: - 93})}},
			{tweens: [],duration: 9*FRAME_RATE , onfinish: () => {this._startParticle({x: -68, y: - 87})}},
			{tweens: [],duration: 5*FRAME_RATE , onfinish: () => {this._startParticle({x: -72, y: - 77})}},
			{tweens: [],duration: 7*FRAME_RATE , onfinish: () => {this._startParticle({x: -72, y: - 65})}},
			{tweens: [],duration: 11*FRAME_RATE , onfinish: () => {this._startParticle({x: -68, y: - 60})}},
			{tweens: [],duration: 13*FRAME_RATE , onfinish: () => {this._startParticle({x: -64, y: - 55})}},
			{tweens: [],duration: 8*FRAME_RATE , onfinish: () => {this._startParticle({x: -58, y: - 50})}},
			{tweens: [],duration: 6*FRAME_RATE , onfinish: () => {this._startParticle({x: -55, y: - 45})}},
		]
		;
		Sequence.start(this, lTimout_seq);
	}

	_startBombPartAnimation()
	{
		this._fBombPartContainer_sptr.visible = true;
		for (let i = 0; i < BOMB_PART_SETTING.length; i++) {
			let lPartRotation_seq = [
				{tweens: [{prop: "rotation", to: BOMB_PART_SETTING.rotation[i]}],duration: 21*FRAME_RATE}
			];
			Sequence.start(this._fBombPart_sprt_arr[i], lPartRotation_seq);

			let lPatrPosition_seq = [
				{tweens: [ {prop: "position.x", to: BOMB_PART_SETTING.final_position[i].x} , {prop: "position.y", to: BOMB_PART_SETTING.final_position[i].y} ],duration: 21*FRAME_RATE, ease:Easing.sine.easeOut},
			];
			Sequence.start(this._fBombPart_sprt_arr[i], lPatrPosition_seq);
		}
		let lTimer_seq = [
			{tweens: [],duration: 21*FRAME_RATE, onfinish: () => {this._fBombPartContainer_sptr.visible = false;}}
		];
		Sequence.start(this, lTimer_seq);
	}

	_startGlowOrbAnimation()
	{
		this._fGlowOrb_sprt.alpha = 0.9;
		this._fGlowOrb_sprt.scale.set(0.31,0.31)
		this._fGlowOrb_sprt.visible = true;

		let lAplhaGlow_seq = 
		[
			{tweens: [],duration: 3*FRAME_RATE},
			{tweens: [ {prop: "alpha", to: 0} ],duration: 13*FRAME_RATE},
		];
		Sequence.start(this._fGlowOrb_sprt, lAplhaGlow_seq);

		let lScaleGlow_seq = 
		[
			{tweens: [],duration: 1*FRAME_RATE,
				onfinish: () => {
					for (let i = 0; i < this._fGunBlust_sprt_arr.length; i++) {
						this._fGunBlust_sprt_arr[i].visible = true;
					}
				}},
			{tweens: [ {prop: "scale.x", to: 3.35}, {prop: "scale.y", to: 3.35} ],duration: 16*FRAME_RATE,
				onfinish: () => {
					for (let i = 0; i < this._fGunBlust_sprt_arr.length; i++) {
						this._fGunBlust_sprt_arr[i].visible = false;
					}
				}},
		];
		Sequence.start(this._fGlowOrb_sprt, lScaleGlow_seq);

		Sequence.destroy(Sequence.findByTarget(this._fCircle_sprt));
		this._fCircle_sprt.alpha = 0.8;
		this._fCircle_sprt.scale.set(0.29, 0.29);
		let lScale_seq = [
			{tweens: [ {prop: "scale.x", to: 7.46}, {prop: "scale.y", to: 7.46} ],duration: 27*FRAME_RATE},
		];

		let lAplha_seq = [
			{tweens: [],duration: 12*FRAME_RATE},
			{tweens: [ {prop: "alpha", to: 0} ],duration: 8*FRAME_RATE, onfinish: () => {
				this._onWinAnimationCompleted()
			}},
		];

		Sequence.start(this._fCircle_sprt, lScale_seq);
		Sequence.start(this._fCircle_sprt, lAplha_seq);

	}

	_startGunBlustAnimation()
	{
		for (let i = 0; i < this._fGunBlust_sprt_arr.length; i++) {
			this._fGunBlust_sprt_arr[i].visible = true;
		}
	}

	_startMultiplaerAnimation()
	{
		this._createFinalMultiplayer();

		this._fCountEnemyMultiplierAnimationPlaying_num =  this._fEnemyArray_obj_arr ? this._fEnemyArray_obj_arr.length : 0;
		
		for (let i = 0; i < this._fEnemyArray_obj_arr.length; i++) {
			let lScale_seq = [
				{tweens: [ {prop: "scale.x", to: 0.81}, {prop: "scale.y", to: 0.81} ],duration: 4*FRAME_RATE, ease:Easing.sine.easeIn},
				{tweens: [ {prop: "scale.x", to: 1.34}, {prop: "scale.y", to: 1.34} ],duration: 2*FRAME_RATE, ease:Easing.sine.easeIn},
				{tweens: [ {prop: "scale.x", to: 1.17}, {prop: "scale.y", to: 1.17} ],duration: 7*FRAME_RATE, ease:Easing.sine.easeIn},
				{tweens: [],duration: 17*FRAME_RATE},
				{tweens: [ {prop: "scale.x", to: 0}, {prop: "scale.y", to: 0} ],duration: 7*FRAME_RATE, ease:Easing.sine.easeOut},
			];
			Sequence.start(this._fMultiplayer_obj_arr[i], lScale_seq);
			
			let enemy_pos = APP.gameScreen.gameFieldController.getEnemyPosition(this._fEnemyArray_obj_arr[i].enemy.id)
			let pos = this.globalToLocal(enemy_pos.x, enemy_pos.y)
			let lPosition_seq = [
				{tweens: [],duration: 15*FRAME_RATE},
				{tweens: [ {prop: "position.x", to: pos.x/7} , {prop: "position.y", to: pos.y/7} ],duration: 10*FRAME_RATE, ease:Easing.sine.easeIn},
				{tweens: [ {prop: "position.x", to: pos.x} , {prop: "position.y", to: pos.y} ],duration: 12	*FRAME_RATE, ease:Easing.sine.easeIn ,
					onfinish: () => {
						this.visible = false;
						this.emit(BombView.SHOW_MULT_WIN_AWARD);
						this._fCountEnemyMultiplierAnimationPlaying_num--;
						this._completeAllEnemyMultiplierAnimationSuspicion();
					}
				},
			];
			Sequence.start(this._fMultiplayer_obj_arr[i], lPosition_seq);
		}
	}

	_completeAllEnemyMultiplierAnimationSuspicion()
	{
		if (!this._fCountEnemyMultiplierAnimationPlaying_num || this._fCountEnemyMultiplierAnimationPlaying_num <= 0)
		{
			this.emit(BombView.EVENT_ON_WIN_ANIMATION_COMPLETED);
		}
	}

	_debugPoint(aPos_obj)
	{
		//DEBUG... !@!
		this.hitCircle = this.addChild(new PIXI.Graphics());
		let color = 0xff0000;//this.getColor();
		let alpha = 0.5;
		this.hitCircle.clear()
			.beginFill(color, alpha)
			.drawCircle(aPos_obj.x, aPos_obj.y, 5);
		this.hitCircle.zIndex = 3;
		//...DEBUG
	}

	_startParticle(aPos_obj, aRot_num = 0, aOptScale_num=0.56)
	{
		let lParticle_sprt = this._fBombContainer_sptr.addChild(new Sprite());
		this._fParticles_arr.push(lParticle_sprt);
		lParticle_sprt.textures = _particlesTextures;
		lParticle_sprt.scale.set(aOptScale_num);
		lParticle_sprt.rotation = aRot_num;
		lParticle_sprt.position.set(aPos_obj.x, aPos_obj.y);
		lParticle_sprt.anchor.set(0.5,0.67);
		lParticle_sprt.animationSpeed = 0.5; //30/60;
		lParticle_sprt.on('animationend', () => {
			let id = this._fParticles_arr.indexOf(lParticle_sprt);
			if (~id)
			{
				this._fParticles_arr.splice(id, 1);
			}
			lParticle_sprt && lParticle_sprt.destroy();
			lParticle_sprt = null;

			if (this._fParticles_arr.length == 0)
			{
				this._fParticles_arr = [];
			}
		});
		lParticle_sprt.play();
		lParticle_sprt.fadeTo(0, 12*FRAME_RATE);
	}
	
	_resetView()
	{
		this._interruptAnimations();
	}
	
	_onWinAnimationCompleted()
	{
		this._fAnimInProgress_bln = false;

		this.emit(BombView.EVENT_ON_ANIMATION_COMPLETED);
	}

	_interruptAnimations()
	{
		Sequence.destroy(Sequence.findByTarget(this));
		this._fTimer_tmr && this._fTimer_tmr.destructor();

		this._fAnimInProgress_bln = false;

		this._fCoverRed_sprt && Sequence.destroy(Sequence.findByTarget(this._fCoverRed_sprt));
		this._fCoverBlack_sprt && Sequence.destroy(Sequence.findByTarget(this._fCoverBlack_sprt));
		this._fBombContainer_sptr && Sequence.destroy(Sequence.findByTarget(this._fBombContainer_sptr));
		this._fExplosion_sprt && Sequence.destroy(Sequence.findByTarget(this._fExplosion_sprt));
		this._fCircle_sprt && Sequence.destroy(Sequence.findByTarget(this._fCircle_sprt));
		this._WickMask_sprt && Sequence.destroy(Sequence.findByTarget(this._WickMask_sprt));
		this._fBombWickFire_sprt && Sequence.destroy(Sequence.findByTarget(this._fBombWickFire_sprt));
		this._fBombRed_sprt && Sequence.destroy(Sequence.findByTarget(this._fBombRed_sprt));
		this._fBombWickRed_sprt && Sequence.destroy(Sequence.findByTarget(this._fBombWickRed_sprt));
		this._fBombGlow_sprt && Sequence.destroy(Sequence.findByTarget(this._fBombGlow_sprt));
		this._fBombLight_sprt && Sequence.destroy(Sequence.findByTarget(this._fBombLight_sprt));
		this._fBulgePinchFilter_f && Sequence.destroy(Sequence.findByTarget(this._fBulgePinchFilter_f));
		this._fGlowOrb_sprt && Sequence.destroy(Sequence.findByTarget(this._fGlowOrb_sprt));

		for (let i = 0; i < this._fBombCrack_sprt_arr.length; i++) {
			this._fBombCrack_sprt_arr[i].mask && Sequence.destroy(Sequence.findByTarget(this._fBombCrack_sprt_arr[i].mask));
		}
		for (let i = 0; i < this._fMultiplayer_obj_arr.length; i++) {
			this._fMultiplayer_obj_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fMultiplayer_obj_arr[i]));
		}
		for (let i = 0; i < this._fBombPart_sprt_arr.length; i++) {
			this._fBombPart_sprt_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fBombPart_sprt_arr[i]));
		}
		for (let i = 0; i < this._fBombRays_sprt_arr.length; i++) {
			this._fBombRays_sprt_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fBombRays_sprt_arr[i]));
		}
		for (let i = 0; i < this._fSmoke_sqrt_arr.length; i++) {
			this._fSmoke_sqrt_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fSmoke_sqrt_arr[i]));
		}
		for (let i = 0; i < this._fCircleFloor_sprt_arr.length; i++) {
			this._fCircleFloor_sprt_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fCircleFloor_sprt_arr[i]));
		}

		this._setStartPosition();
	}

	_setStartPosition()
	{
		this._fAnimInProgress_bln = false;
		this.visible = false;

		this._fCoverRed_sprt.alpha = 0;
		this._fCoverBlack_sprt.alpha = 0;

		this._fExplosion_sprt.scale.set(0.4);
		this._fExplosion_sprt.visible = false;
		
		this._fCircle_sprt.scale.set(0);
		for (let i = 0; i < this._fCircleFloor_sprt_arr.length; i++) {
			this._fCircleFloor_sprt_arr[i].scale.set(0);
			this._fCircleFloor_sprt_arr[i].visible = false;
			this._fCircleFloor_sprt_arr[i].position.set(CIRCLE_FLOOR_SETTING.position[i].x, CIRCLE_FLOOR_SETTING.position[i].y);
		}

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._fBombGlow_sprt.scale.set(0.9);
			this._fBombGlow_sprt.alpha = 0.;
		}
		
		this._fGlowOrb_sprt.visible = false;
		this._fBombPartContainer_sptr.visible = false;
		for (let i = 0; i < this._fSmoke_sqrt_arr.length; i++) {
			this._fSmoke_sqrt_arr[i].visible = false;
		}
		for (let i = 0; i < this._fMultiplayer_obj_arr.length; i++) {
			this._fMultiplayer_obj_arr[i].scale.set(0, 0);
		}
		for (let i = 0; i < this._fGunBlust_sprt_arr.length; i++) {
			this._fGunBlust_sprt_arr[i].visible = false;
		}
		for (let i = 0; i < this._fParticles_arr.length; i++) {
			this._fParticles_arr[i] && this._fParticles_arr[i].destroy();
			this._fParticles_arr[i] = null;
		}
		this._fParticles_arr = [];

		this._fBombContainer_sptr.visible = false
		this._fBombContainer_sptr.filters = null;
	}
	
	destroy()
	{

		super.destroy();

		this._interruptAnimations();
		this._fCountEnemyMultiplierAnimationPlaying_num = null;
	}
}

export default BombView;