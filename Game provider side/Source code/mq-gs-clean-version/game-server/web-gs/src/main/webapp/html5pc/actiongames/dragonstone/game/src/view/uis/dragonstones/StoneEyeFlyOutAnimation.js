import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../shared/src/CommonConstants';
import { Sequence } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import { Utils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import { AtlasSprite } from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/index';
import AtlasConfig from '../../../config/AtlasConfig';
import DragonstonesAssets from './DragonstonesAssets';

const START_POS = {x: -10, y: 33};

const Z_INDEXES = 
{
	BLACK_SOLID: 1,
	FLARE_ORANGE: 2,
	BIG_FLARE: 3,
	STONE_PURPLE_OUT_GLOW: 4,
	STONE_PURPLE_GLOW: 5,
	STONE_PURPLE_GLOW_ADD: 6,
	FRAGMENTS_HIGHLIGHT: 7,
	MARKER_AURAS: 8
}

class StoneEyeFlyOutAnimation extends Sprite
{
	static get EVENT_ON_SCREEN_COVERED()			{return 'EVENT_ON_SCREEN_COVERED';}
	static get EVENT_ON_ANIMATIONS_COMPLETED()		{return 'EVENT_ON_ANIMATIONS_COMPLETED';}

	startAnimation()
	{
		this._startAnimation();
	}

	constructor(aFragmentsHighlight, aMarkerAuras)
	{
		super();

		DragonstonesAssets.initTextures();

		this._fragmentsHighlight = aFragmentsHighlight;
		this._markerAuras = aMarkerAuras;

		this._raysContainer = this.addChild(new Sprite);
		this._shakeContainer = this.addChild(new Sprite);
		this._curclesContainer = this.addChild(new Sprite);
		
		this._eyeContainer = this._shakeContainer.addChild(new Sprite);
		this._eyeContainer.x = START_POS.x;
		this._eyeContainer.y = START_POS.y;

		this._eyeGlow = null;
		this._eyeGlowAdd = null;
		this._fBigFlare = null;
		this._fOrangeFlare = null;
		this._finalPos = null;
		this._fCirclePurple = null;
		this._fScreenPurple = null;

		StoneEyeFlyOutAnimation._initRaysTexture();
	}

	_startAnimation()
	{
		this._eyeContainer.x = START_POS.x;
		this._eyeContainer.y = START_POS.y;

		let lBigFlare = this._fBigFlare = this._eyeContainer.addChild(new Sprite);
		lBigFlare.textures = DragonstonesAssets['big_flare_purple'];
		lBigFlare.scale.set(2*0.95);
		lBigFlare.blendMode = PIXI.BLEND_MODES.ADD;
		lBigFlare.zIndex = Z_INDEXES.BIG_FLARE;
		this._startBigFlareRotationCycle();

		let lEye = this._eyeContainer.addChild(new Sprite);
		lEye.textures = DragonstonesAssets['stone_purple_out_glow'];
		lEye.scale.x = -1;
		lEye.zIndex = Z_INDEXES.STONE_PURPLE_OUT_GLOW;

		this._eyeGlow = this._eyeContainer.addChild(new Sprite);
		this._eyeGlow.textures = DragonstonesAssets['stone_purple_glow'];
		this._eyeGlow.alpha = 0.3;
		this._eyeGlow.zIndex = Z_INDEXES.STONE_PURPLE_GLOW;

		this._eyeGlowAdd = this._eyeContainer.addChild(new Sprite);
		this._eyeGlowAdd.textures = DragonstonesAssets['stone_purple_glow_add'];
		this._eyeGlowAdd.alpha = 0.3;
		this._eyeGlowAdd.blendMode = PIXI.BLEND_MODES.ADD;
		this._eyeGlowAdd.zIndex = Z_INDEXES.STONE_PURPLE_GLOW_ADD;

		let lFinalPos = this._finalPos = this._eyeContainer.globalToLocal(480, 270);
		lFinalPos.x = -lFinalPos.x+lFinalPos.x*0.1;
		lFinalPos.y = lFinalPos.y*1.1;

		this._raysContainer.position.set(lFinalPos.x, lFinalPos.y);
		this._curclesContainer.position.set(lFinalPos.x, lFinalPos.y);

		let lMoveSeq = [
			{tweens: [{prop: 'y', to: START_POS.y-10}],	duration: 4*FRAME_RATE},
			{tweens: [{prop: 'x', to: START_POS.x+2}, {prop: 'y', to: START_POS.y-10-1}],	duration: 1*FRAME_RATE},
			{tweens: [{prop: 'x', to: START_POS.x+2}, {prop: 'y', to: START_POS.y-10-1}],	duration: 1*FRAME_RATE},
			{tweens: [{prop: 'x', to: START_POS.x+2+4}, {prop: 'y', to: START_POS.y-10-1-3}],	duration: 1*FRAME_RATE},
			{tweens: [{prop: 'x', to: START_POS.x+2+4+9}, {prop: 'y', to: START_POS.y-10-1-3-3}],	duration: 1*FRAME_RATE},
			{tweens: [{prop: 'x', to: START_POS.x+2+4+9+15}, {prop: 'y', to: START_POS.y-10-1-3-3-3}],	duration: 1*FRAME_RATE},
			{tweens: [{prop: 'x', to: lFinalPos.x}, {prop: 'y', to: lFinalPos.y}],	duration: 8*FRAME_RATE, onfinish: () => { this._onEyeLanded(); } },
			{tweens: [],	duration: 12*FRAME_RATE, onfinish: () => { this._startFlyedOutAnimation(); } },
			{tweens: [{prop: 'x', to: lFinalPos.x+10}, {prop: 'y', to: lFinalPos.y-8}],	duration: 2*FRAME_RATE},
			{tweens: [{prop: 'x', to: lFinalPos.x}, {prop: 'y', to: lFinalPos.y}],	duration: 3*FRAME_RATE},
			{tweens: [{prop: 'x', to: lFinalPos.x+10}, {prop: 'y', to: lFinalPos.y-8}],	duration: 2*FRAME_RATE},
			{tweens: [{prop: 'x', to: lFinalPos.x}, {prop: 'y', to: lFinalPos.y}],	duration: 3*FRAME_RATE},
			{tweens: [{prop: 'x', to: lFinalPos.x+10}, {prop: 'y', to: lFinalPos.y-8}],	duration: 2*FRAME_RATE},
			{tweens: [{prop: 'x', to: lFinalPos.x}, {prop: 'y', to: lFinalPos.y}],	duration: 3*FRAME_RATE},
			{tweens: [{prop: 'x', to: lFinalPos.x+10}, {prop: 'y', to: lFinalPos.y-8}],	duration: 2*FRAME_RATE},
			{tweens: [{prop: 'x', to: lFinalPos.x}, {prop: 'y', to: lFinalPos.y}],	duration: 3*FRAME_RATE, onfinish: () => { this._onMoveAnimationCompleted(); } }
		]

		Sequence.start(this._eyeContainer, lMoveSeq);

		let lGlowSeq = [
			{tweens: [{prop: 'alpha', to: 0}],	duration: 19*FRAME_RATE},
			{tweens: [],	duration: 9*FRAME_RATE, onfinish: () => { this._startSoundFragmetColect(); } },
			{tweens: [{prop: 'alpha', to: 1}],	duration: 2*FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0}],	duration: 3*FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}],	duration: 2*FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0}],	duration: 3*FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}],	duration: 2*FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0}],	duration: 3*FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}],	duration: 2*FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0}],	duration: 3*FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}],	duration: 2*FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0}],	duration: 3*FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0.42}],	duration: 4*FRAME_RATE},
		]

		Sequence.start(this._eyeGlow, lGlowSeq);

		if (this._fragmentsHighlight)
		{
			this._eyeContainer.addChild(this._fragmentsHighlight);
			this._fragmentsHighlight.zIndex = Z_INDEXES.FRAGMENTS_HIGHLIGHT;
		}

		if (this._markerAuras)
		{
			this._eyeContainer.addChild(this._markerAuras);
			this._markerAuras.zIndex = Z_INDEXES.MARKER_AURAS;
		}

		this._wiggleStep();
	}

	_startSoundFragmetColect()
	{
		APP.soundsController.play("mq_dragonstone_token_eye_collect");
	}

	_startBigFlareRotationCycle()
	{
		let lBigFlare = this._fBigFlare;
		let lSeq = [
				{tweens: [{prop: 'rotation', to: Utils.gradToRad(360)}],	duration: 720*FRAME_RATE, onfinish: ()=>{ this._onBigFlareRotationCycleCompleted(); }}
			]
		Sequence.start(lBigFlare, lSeq);
	}

	_onBigFlareRotationCycleCompleted()
	{
		let lBigFlare = this._fBigFlare;
		
		Sequence.destroy(Sequence.findByTarget(lBigFlare));

		lBigFlare.rotation = 0;

		this._startBigFlareRotationCycle();
	}

	_onEyeLanded()
	{
		this._raysContainer.scale.x = -1;

		this._addRay(0, 0, 0);
		this._addRay(0, -110, 25);
		this._addRay(300, -110, 150);
		this._addRay(125, -60, 65);
		this._addRay(250, -15, 215);
		this._addRay(170, 35, 260);
		this._addRay(90, 75, -30);
		
		this._addRay(60, 60, -40);
		this._addRay(45, -30, -20);
		this._addRay(190, -155, 110);
		this._addRay(65, -85, 25);
		this._addRay(250, -85, 170);
		this._addRay(210, 0, 220);
		this._addRay(145, 110, -70);
	}

	_addRay(aX_num, aY_num, aAngle_num)
	{
		let lRay = this._raysContainer.addChild(new Sprite);
		lRay.textures = StoneEyeFlyOutAnimation.rays_texture;
		lRay.animationSpeed = 8/60;
		lRay.scale.set(3.3);
		lRay.anchor.set(1, 0.6);
		lRay.x = aX_num - 140;
		lRay.y = aY_num;
		lRay.rotation = Utils.gradToRad(aAngle_num);

		lRay.once('animationend', () => {
			lRay.destroy();
		});

		let lStartFrame = ~~Utils.random(0, lRay.textures.length/2);
		lRay.gotoAndPlay(lStartFrame);
	}

	_startFlyedOutAnimation()
	{
		let lScaleSeq = [
			{tweens: [{prop: 'scale.x', to: 1.44}, {prop: 'scale.y', to: 1.44}],	duration: 2*FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 1.15}, {prop: 'scale.y', to: 1.15}],	duration: 1*FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 1.56}, {prop: 'scale.y', to: 1.56}],	duration: 2*FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 1.23}, {prop: 'scale.y', to: 1.23}],	duration: 2*FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 1.72}, {prop: 'scale.y', to: 1.72}],	duration: 2*FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 1.44}, {prop: 'scale.y', to: 1.44}],	duration: 2*FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 1.80}, {prop: 'scale.y', to: 1.80}],	duration: 2*FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 1.48}, {prop: 'scale.y', to: 1.48}],	duration: 2*FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 2.00}, {prop: 'scale.y', to: 2.00}],	duration: 2*FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 1.56}, {prop: 'scale.y', to: 1.56}],	duration: 2*FRAME_RATE, onfinish: ()=>{ this._onEyeScaleSeqPreCompletion(); }},
			{tweens: [{prop: 'scale.x', to: 1.64}, {prop: 'scale.y', to: 1.64}],	duration: 3*FRAME_RATE, onfinish: ()=>{ this._onEyeScaleSeqCompleted(); }}
		]

		Sequence.start(this._eyeContainer, lScaleSeq);
		let lBlackBase = this._eyeContainer.addChild(new Sprite);
		lBlackBase.textures = DragonstonesAssets['black_base'];
		lBlackBase.scale.set(2);
		lBlackBase.zIndex = Z_INDEXES.BLACK_SOLID;
		lBlackBase.alpha = 0.3;
		lBlackBase.fadeTo(1, 21*FRAME_RATE);

		this._showCurcleBlasts();
	}

	_showCurcleBlasts()
	{
		this._addCurcleBlast(1);
		this._addCurcleBlast(4);
		this._addCurcleBlast(6);
		this._addCurcleBlast(9);
		this._addCurcleBlast(11);
		this._addCurcleBlast(14);
		this._addCurcleBlast(16);
		this._addCurcleBlast(19);
		this._addCurcleBlast(21);
		this._addCurcleBlast(24);
		this._addCurcleBlast(26);
		this._addCurcleBlast(29);
	}

	_addCurcleBlast(aInvisibleFramesAmount_num=1)
	{
		let lBlast = this._fCirclePurple = this._curclesContainer.addChild(new Sprite);
		lBlast.zIndex = 1;
		let lBlastView = lBlast.addChild(new Sprite);
		lBlastView.textures = DragonstonesAssets['curcle_blast'];
		lBlastView.scale.set(2);
		lBlastView.blendMode = PIXI.BLEND_MODES.ADD;
		lBlast.alpha = 0;

		lBlast.scaleTo(3.5, 8*FRAME_RATE);

		let lBlastAlphaSeq = [
			{tweens: [],	duration: aInvisibleFramesAmount_num*FRAME_RATE, onfinish: ()=>{ lBlast.alpha = 0.3; }},
			{tweens: [],	duration: 1*FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0}],	duration: 6*FRAME_RATE}
		]

		Sequence.start(lBlast, lBlastAlphaSeq);
	}

	_wiggleStep()
	{
		let lShakeSeq = [
			{tweens: [{prop: 'x', to: Utils.getRandomWiggledValue(0, 5)}, {prop: 'y', to: Utils.getRandomWiggledValue(0, 5)}],	duration: 1*FRAME_RATE, onfinish: ()=>{ this._onShakeStepCompleted(); }}
		]

		Sequence.start(this._shakeContainer, lShakeSeq);
	}

	_onShakeStepCompleted()
	{
		Sequence.destroy(Sequence.findByTarget(this._shakeContainer));

		this._wiggleStep();
	}

	_onMoveAnimationCompleted()
	{
		let lGlowSeq = [
			{tweens: [{prop: 'alpha', to: 0}],	duration: 19*FRAME_RATE}
		]

		Sequence.start(this._eyeGlowAdd, lGlowSeq);
	}

	_onEyeScaleSeqPreCompletion()
	{
		let lOrangeFlare = this._fOrangeFlare = this._eyeContainer.addChild(new Sprite);
		lOrangeFlare.textures = DragonstonesAssets['orange_flare_purple'];
		lOrangeFlare.zIndex = Z_INDEXES.FLARE_ORANGE;

		let lScaleSeq = [
			{tweens: [{prop: 'scale.x', to: 3.2}, {prop: 'scale.y', to: 3.2}],	duration: 3*FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 2.25}, {prop: 'scale.y', to: 2.25}],	duration: 6*FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 2.38}, {prop: 'scale.y', to: 2.38}],	duration: 2*FRAME_RATE}
		]

		Sequence.start(lOrangeFlare, lScaleSeq);


		let lCirclePurple = this._fCirclePurple = this._curclesContainer.addChild(new Sprite);
		lCirclePurple.zIndex = 0;
		let lCircleView = lCirclePurple.addChild(new Sprite);
		lCircleView.textures = DragonstonesAssets['curcle_purple'];
		lCircleView.scale.set(2);
		lCircleView.blendMode = PIXI.BLEND_MODES.ADD;

		let lCurcleSeq = [
			{tweens: [{prop: 'scale.x', to: 3.5}, {prop: 'scale.y', to: 3.5}],	duration: 3*FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 6}, {prop: 'scale.y', to: 6}, {prop: 'alpha', to: 0.2}],	duration: 4*FRAME_RATE}
		]

		Sequence.start(lCirclePurple, lCurcleSeq);
	}

	_onEyeScaleSeqCompleted()
	{
		let lBigUpperFlare = this._fBigFlare.addChild(new Sprite);
		lBigUpperFlare.textures = DragonstonesAssets['big_flare_purple'];
		lBigUpperFlare.blendMode = PIXI.BLEND_MODES.ADD;
		lBigUpperFlare.scaleTo(6, 7*FRAME_RATE);

		let lScreenPurple = this._fScreenPurple = this._curclesContainer.addChild(new Sprite);
		lScreenPurple.textures = DragonstonesAssets['screen_purple'];
		lScreenPurple.scale.set(44);
		lScreenPurple.blendMode = PIXI.BLEND_MODES.ADD;
		lScreenPurple.alpha = 0;

		let lScreepPurpleSeq = [
			{tweens: [],	duration: 2*FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0.77}],	duration: 5*FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0.75}],	duration: 1*FRAME_RATE, onfinish: ()=>{ this._onScreenPurpleFilled(); }},
			{tweens: [{prop: 'alpha', to: 0}],	duration: 10*FRAME_RATE, onfinish: ()=>{ this._onAnimationsCompleted(); }}
		]

		Sequence.start(lScreenPurple, lScreepPurpleSeq);
	}

	_onScreenPurpleFilled()
	{
		this._raysContainer.visible = false;
		this._shakeContainer.visible = false;

		Sequence.destroy(Sequence.findByTarget(this._eyeContainer));
		Sequence.destroy(Sequence.findByTarget(this._shakeContainer));
		Sequence.destroy(Sequence.findByTarget(this._eyeGlow));
		Sequence.destroy(Sequence.findByTarget(this._eyeGlowAdd));
		Sequence.destroy(Sequence.findByTarget(this._fBigFlare));
		Sequence.destroy(Sequence.findByTarget(this._fOrangeFlare));

		this.emit(StoneEyeFlyOutAnimation.EVENT_ON_SCREEN_COVERED);
	}

	_onAnimationsCompleted()
	{
		this.emit(StoneEyeFlyOutAnimation.EVENT_ON_ANIMATIONS_COMPLETED);
	}

	destroy()
	{
		if (this._fragmentsHighlight && this._eyeContainer.contains(this._fragmentsHighlight))
		{
			this._eyeContainer.removeChild(this._fragmentsHighlight);
		}
		this._fragmentsHighlight = null;

		if (this._markerAuras && this._eyeContainer.contains(this._markerAuras))
		{
			this._eyeContainer.removeChild(this._markerAuras);
		}
		this._markerAuras = null;

		Sequence.destroy(Sequence.findByTarget(this._eyeContainer));
		Sequence.destroy(Sequence.findByTarget(this._shakeContainer));
		Sequence.destroy(Sequence.findByTarget(this._eyeGlow));
		Sequence.destroy(Sequence.findByTarget(this._eyeGlowAdd));
		Sequence.destroy(Sequence.findByTarget(this._fBigFlare));
		Sequence.destroy(Sequence.findByTarget(this._fOrangeFlare));
		Sequence.destroy(Sequence.findByTarget(this._fCirclePurple));
		Sequence.destroy(Sequence.findByTarget(this._fScreenPurple));

		for (let i=0; i<this._curclesContainer.children.length; i++)
		{
			Sequence.destroy(Sequence.findByTarget(this._curclesContainer.children[i]));
		}

		this._eyeContainer = null;
		this._eyeGlow = null;
		this._shakeContainer = null;
		this._eyeGlowAdd = null;
		this._fBigFlare = null;
		this._fOrangeFlare = null;
		this._finalPos = null;
		this._raysContainer = null;
		this._curclesContainer = null;
		this._fCirclePurple = null;
		this._fScreenPurple = null;

		super.destroy();
	}
}

StoneEyeFlyOutAnimation.rays_texture = null;
StoneEyeFlyOutAnimation._initRaysTexture = function ()
{
	if(!StoneEyeFlyOutAnimation.rays_texture)
	{
		StoneEyeFlyOutAnimation.rays_texture = AtlasSprite.getFrames([APP.library.getAsset("dragonstones/ray_purple")], [AtlasConfig.StoneEyeRayPurple], "");
		StoneEyeFlyOutAnimation.rays_texture.sort(function(a, b){if(a._atlasName > b._atlasName) return 1; else return -1});
	}
};

export default StoneEyeFlyOutAnimation