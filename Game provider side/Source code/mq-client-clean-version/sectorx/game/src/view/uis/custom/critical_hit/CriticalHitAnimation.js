import { Sprite, AtlasSprite } from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import I18 from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
import AtlasConfig from './../../../../config/AtlasConfig';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { Utils } from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import Sequence from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { FRAME_RATE } from './../../../../../../shared/src/CommonConstants';
import CriticalHitMultiplierView from './CriticalHitMultiplierView';
import { GlowFilter } from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Filters';

let _criticalExplosionTextures = null;

function _initExplosionTextures()
{
	if (_criticalExplosionTextures) return;

	_criticalExplosionTextures = AtlasSprite.getFrames(APP.library.getAsset("critical_hit/critical_explosion"), AtlasConfig.CriticalExplosion, "");
}


class CriticalHitAnimation extends Sprite
{
	static get EVENT_ON_CRITICAL_HIT_ANIMATION_ENDED()		{return "onCriticalHitAnimationEnded";}

	startAnimation(aIsMasterSeat_bln)
	{
		this._startAnimation(aIsMasterSeat_bln);
	}

	constructor(aMult_num)
	{
		super();

		_initExplosionTextures();

		this._fMult_num = aMult_num;
		this._fContainer_sprt = null;
		this._fCaption_ta = null;
		this._fCaptionContainer_sprt = null;
		this._fExplosion_sprt = null;
		this._fMultiplierContainer_sprt = null;
		this._fMultiplier_chmv = null;
		this._fSweep_sprt = null;
		this._fFlare_sprt = null;
		this._fMultiplierInitiated_bln = false;
		this._fCashAppeared_bln = false;

		this._init();
	}

	_init()
	{
		this._initContainer();
		this._initExplosion();
		this._initFlare();

		this._fCaptionContainer_sprt = this._fContainer_sprt.addChild(new Sprite());
		this._fCaptionContainer_sprt.position.set(0, -10);
		this._fMultiplierContainer_sprt = this._fContainer_sprt.addChild(new Sprite());
		this._fMultiplierContainer_sprt.position.set(0, -10);

		this._initCaption();
		this._initMultiplier();
		this._initSweep();
	}

	_initCaption()
	{
		this._fCaption_ta = I18.generateNewCTranslatableAsset("TACriticalHitLabel");

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._fCaptionContainer_sprt.addChild(this._createGlowCopy(this._fCaption_ta, 6));
		}

		this._fCaptionContainer_sprt.addChild(this._fCaption_ta);
	}

	_initMultiplier()
	{
		this._fMultiplier_chmv = new CriticalHitMultiplierView();
		this._fMultiplier_chmv.value = "x" + this._fMult_num;

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._fMultiplierContainer_sprt.addChild(this._createGlowCopy(this._fMultiplier_chmv, 8));
		}

		this._fMultiplierContainer_sprt.addChild(this._fMultiplier_chmv);
		this._fMultiplierContainer_sprt.scale.set(0);
	}

	_createGlowCopy(aSprite_sprt, aExtraSize_num)
	{
		let lGlowFilter_cmf = new GlowFilter({distance: 8, outerStrength: 2.5, innerStrength: 2, color: 0xffffe6, quality: 2});

		let remProps = {
			x: aSprite_sprt.x,
			y: aSprite_sprt.y
		}

		aSprite_sprt.filters = [lGlowFilter_cmf];
		let lGlowBounds_obj = aSprite_sprt.getBounds();
		lGlowBounds_obj.height += aExtraSize_num;
		lGlowBounds_obj.y -= aExtraSize_num/2;
		lGlowBounds_obj.width += aExtraSize_num;
		lGlowBounds_obj.x -= aExtraSize_num/2;
		
		aSprite_sprt.x = lGlowBounds_obj.width/2;
		aSprite_sprt.y = lGlowBounds_obj.height/2;
		var lGlowTexture_txt = PIXI.RenderTexture.create({ width: lGlowBounds_obj.width, height: lGlowBounds_obj.height, scaleMode: PIXI.SCALE_MODES.NEAREST, resolution: 2 });
		APP.stage.renderer.render(aSprite_sprt, { renderTexture: lGlowTexture_txt });
		aSprite_sprt.x = remProps.x;
		aSprite_sprt.y = remProps.y;
		aSprite_sprt.filters = [];

		let lGlowSprite_sprt = new Sprite();
		lGlowSprite_sprt.texture = lGlowTexture_txt;
		lGlowSprite_sprt.scale.set(1.04);
		lGlowSprite_sprt.tint = 0xffffe6;
		lGlowSprite_sprt.blendMode = PIXI.BLEND_MODES.ADD;
		lGlowSprite_sprt.alpha = 0.9;

		return lGlowSprite_sprt;
	}

	_initContainer()
	{
		this._fContainer_sprt = this.addChild(new Sprite());
		// this._fContainer_sprt.visible = false;
	}

	_initExplosion()
	{
		this._fExplosion_sprt = this._fContainer_sprt.addChild(new Sprite());
		this._fExplosion_sprt.scale.set(2);
		this._fExplosion_sprt.blendMode = PIXI.BLEND_MODES.SCREEN;
		this._fExplosion_sprt.textures = _criticalExplosionTextures;
		this._fExplosion_sprt.position.set(11, -70);
		this._fExplosion_sprt.rotation = 1.1344640137963142; //Utils.gradToRad(65);
		this._fExplosion_sprt.animationSpeed = 0.5;
		this._fExplosion_sprt.on('animationend', () => {
			this._fExplosion_sprt && this._fExplosion_sprt.destroy();
			this._fExplosion_sprt = null;
		});
	}

	_initFlare()
	{
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._fFlare_sprt = this._fContainer_sprt.addChild(APP.library.getSprite("critical_hit/flare"));
			this._fFlare_sprt.blendMode = PIXI.BLEND_MODES.SCREEN;
		}
	}

	_initSweep()
	{
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			let lTextWidthDescr = I18.getTranslatableAssetDescriptor("TACriticalHitTextWidthDescriptor");
			this._fTextWidth_num = !!lTextWidthDescr ? lTextWidthDescr.areaInnerContentDescriptor.areaDescriptor.width : this._fCaption_ta.assetContent.getBounds().width;

			this._fSweep_sprt = this._fCaption_ta.addChild(APP.library.getSprite("light_sweep"));
			this._fSweep_sprt.scale.set(0.5);
			let lMask_ta = this._fCaption_ta.addChild(I18.generateNewCTranslatableAsset("TACriticalHitLabel"));
			this._fSweep_sprt.mask = lMask_ta.assetContent;

			let lStartSweepX_num = -this._fTextWidth_num/2 - this._fSweep_sprt.width/2;
			this._fSweep_sprt.position.set(lStartSweepX_num, 0);
		}
	}

	_startAnimation(aIsMasterSeat_bln)
	{
		this._fContainer_sprt.show();

		this._fExplosion_sprt.play();

		this._startCaptionAnimation(aIsMasterSeat_bln);
		this._startFlareAnimation();
	}

	_startFlareAnimation()
	{
		if (!this._fFlare_sprt) return;

		this._fFlare_sprt.scale.set(0);
		let lFlareSeq_arr = [
			{tweens: [{prop: 'scale.x', to: 0.4},	{prop: 'scale.y', to: 0.4}],	duration: 1*FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 1},		{prop: 'scale.y', to: 1}],		duration: 1*FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 0},		{prop: 'scale.y', to: 0}],		duration: 12*FRAME_RATE, onfinish: () => {
				this._fFlare_sprt && this._fFlare_sprt.destroy();
				this._fFlare_sprt = null;
			}}
		];

		Sequence.start(this._fFlare_sprt, lFlareSeq_arr);
	}

	_startCaptionAnimation(aIsMasterSeat_bln)
	{
		this._fCaptionContainer_sprt.scale.set(0);
		let lCaptionSeq_arr = [
			{tweens: [{prop: 'scale.x', to: 1.6},	{prop: 'scale.y', to: 1.6}],	duration: 5*FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 1.4},	{prop: 'scale.y', to: 1.4}],	duration: 3*FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 1.45},	{prop: 'scale.y', to: 1.45}],	duration: 2*FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 1},		{prop: 'scale.y', to: 1}],		duration: 9*FRAME_RATE, onfinish: () => {
				this._startSweep();
				this._fMultiplierInitiated_bln = true;
				this._startMultiplier();
			}},
			{tweens: [],	duration: 5*FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0}],	duration: 2*FRAME_RATE, onfinish: () => {
				this._fCaptionContainer_sprt && this._fCaptionContainer_sprt.destroy();
				this._fCaptionContainer_sprt = null;
			}},
		];

		Sequence.start(this._fCaptionContainer_sprt, lCaptionSeq_arr);
		
		if (aIsMasterSeat_bln)
		{			
			if (APP.soundsController.isSoundPlaying("critical_hit"))
			{
				APP.soundsController.stop("critical_hit");
			}

			APP.soundsController.play("critical_hit");
		}
	}

	_startSweep()
	{
		if (!this._fSweep_sprt) return;

		let l_seq = [{tweens: [{prop: 'position.x', to: this._fTextWidth_num/2},],	duration: 8*FRAME_RATE}];

		Sequence.start(this._fSweep_sprt, l_seq);
	}

	_startMultiplier()
	{
		let lFinalPos_obj = new PIXI.Point(-24, -61);

		let lMultSeq_arr = [
			{tweens: [{prop: 'scale.x', to: 2.6}, {prop: 'scale.y', to: 2.6}], duration: 4*FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 1.17}, {prop: 'scale.y', to: 1.17},	{prop: 'position.y', to: -6}], duration: 8*FRAME_RATE},
			{tweens: [{prop: 'position.x', to: lFinalPos_obj.x}, {prop: 'position.y', to: lFinalPos_obj.y}], duration: 5*FRAME_RATE},
			{tweens: [],	duration: 1*FRAME_RATE, onfinish: () => {
				this._fMultiplierContainer_sprt && this._fMultiplierContainer_sprt.destroy();
				this._fMultiplierContainer_sprt = null;
				this._onAnimationEnded();
			}},
		];

		Sequence.start(this._fMultiplierContainer_sprt, lMultSeq_arr);
	}

	_onAnimationEnded()
	{
		this.emit(CriticalHitAnimation.EVENT_ON_CRITICAL_HIT_ANIMATION_ENDED);
	}

	destroy()
	{
		this._fFlare_sprt && Sequence.destroy(Sequence.findByTarget(this._fFlare_sprt));
		this._fCaptionContainer_sprt && Sequence.destroy(Sequence.findByTarget(this._fCaptionContainer_sprt));
		this._fSweep_sprt && Sequence.destroy(Sequence.findByTarget(this._fSweep_sprt));
		this._fMultiplierContainer_sprt && Sequence.destroy(Sequence.findByTarget(this._fMultiplierContainer_sprt));

		super.destroy();

		this._fMult_num = null;
		this._fContainer_sprt = null;
		this._fCaption_ta = null;
		this._fCaptionContainer_sprt = null;
		this._fExplosion_sprt = null;
		this._fMultiplierContainer_sprt = null;
		this._fMultiplier_chmv = null;
		this._fSweep_sprt = null;
		this._fFlare_sprt = null;
		this._fMultiplierInitiated_bln = null;
		this._fCashAppeared_bln = null;
	}
}

export default CriticalHitAnimation;