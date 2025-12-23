import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import Sequence from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import * as Easing from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import AtlasConfig from './../../../../config/AtlasConfig';
import { AtlasSprite } from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import { FRAME_RATE } from '../../../../../../shared/src/CommonConstants';
import WinPayout from '../../../../ui/WinPayout';
import { GlowFilter } from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Filters';

let _mini_slot_win_textures = null;
function _generateMiniSlotWinTextures()
{
	if (_mini_slot_win_textures) return

	_mini_slot_win_textures = AtlasSprite.getFrames([APP.library.getAsset("mini_slot/win/texture-0"), APP.library.getAsset("mini_slot/win/texture-1"), APP.library.getAsset("mini_slot/win/texture-2"), APP.library.getAsset("mini_slot/win/texture-3")], [AtlasConfig.MiniSlotWin0, AtlasConfig.MiniSlotWin1, AtlasConfig.MiniSlotWin2, AtlasConfig.MiniSlotWin3], "");
}


class MiniSlotWinAnimation extends Sprite
{
	static get EVENT_ON_BIG_WIN_ANIMATION_COMPLETED()			{return "onBigWinAnimationCompleted";}
	static get EVENT_ON_BIG_WIN_COINS_REQUIRED()				{return "onBigWinCoinsRequired";}

	startAnimation()
	{
		this._startAnimation();
	}

	constructor(aPayoutValue_num, aScale_num = 1)
	{
		super();

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			_generateMiniSlotWinTextures();
		}
		
		this._fPayoutValue_num = aPayoutValue_num;
		this._fPayoutView_wp = null;
		this._fPayoutGlowView_bwpv = null;
		this._fEndFlare_sprt = null;
		this._fWinAnimation_spr = null;
		this._fScale_num = aScale_num;
	}

	_startAnimation()
	{
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startWinAnimation()
		}
		this._startPayoutAnimation();
		this._initPayoutGlowAnimation();
		this._startPayoutGlowAnimation();
	}

	_onCoinsAnimationRequired()
	{
		this.emit(MiniSlotWinAnimation.EVENT_ON_BIG_WIN_COINS_REQUIRED, {amount: this._coinsAmount});
	}

	get _coinsAmount()
	{
		return 10;
	}

	_startPayoutAnimation()
	{
		this._fPayoutView_wp = this.addChild(new WinPayout(true, null, null, this._fScale_num));
		this._fPayoutView_wp.value = this._fPayoutValue_num;
		this._fPayoutView_wp.scale.set(2*this._fScale_num);
		this._fPayoutView_wp.position.set(0, -20);

		let lScale_seq = [
			{tweens: [	{prop: "scale.x", to:  this._fScale_num*1.5},
						{prop: "scale.y", to:  this._fScale_num*1.5}],	duration: 7*FRAME_RATE, ease: Easing.quadratic.easeIn},
			{tweens: [],												duration: 4*FRAME_RATE, ease: Easing.quadratic.easeIn, onfinish: ()=>{this._startEndFlareAnimation();}},
			{tweens: [],												duration: 3*FRAME_RATE, ease: Easing.quadratic.easeIn, onfinish: ()=>{this._endPayoutSequence()}},
		];

		Sequence.start(this._fPayoutView_wp, lScale_seq);
	}

	_endPayoutSequence()
	{
		this._onCoinsAnimationRequired();

		this._fPayoutView_wp && Sequence.destroy(Sequence.findByTarget(this._fPayoutView_wp));
		this._fPayoutView_wp && this._fPayoutView_wp.destroy();
		this._fPayoutView_wp = null;

		this._validateEnding();
	}

	_initPayoutGlowAnimation()
	{
		this._fPayoutView_wp.filters = [new GlowFilter({distance: 12, outerStrength: 0, innerStrength: 3, color: this._payoutGlowColor, quality: 2})];
		var lBounds_obj = this._fPayoutView_wp.getBounds();
		var l_txtr = PIXI.RenderTexture.create({ width: lBounds_obj.width, height:  lBounds_obj.height, scaleMode: PIXI.SCALE_MODES.LINEAR, resolution: 2 });
		APP.stage.renderer.render(this._fPayoutView_wp, { renderTexture: l_txtr });

		let l_sprt = new Sprite();
		l_sprt.texture = l_txtr;
		l_sprt.blendMode = PIXI.BLEND_MODES.ADD;
		this._fPayoutView_wp.filters = [];

		this._fPayoutGlowView_bwpv = this._fPayoutView_wp.addChild(l_sprt);
		this._fPayoutGlowView_bwpv.alpha = 0;
	}

	_startPayoutGlowAnimation()
	{
		let lAlpha_seq = [
			{tweens: [],							duration: 1*FRAME_RATE},
			{tweens: [	{prop: "alpha", to: 1}],	duration: 3*FRAME_RATE, ease: Easing.cubic.easeIn},
			{tweens: [	{prop: "alpha", to: 0}],	duration: 4*FRAME_RATE, ease: Easing.cubic.easeIn, onfinish: ()=>{
				this._endPayoutGlowSequence();
			}}
		];

		Sequence.start(this._fPayoutGlowView_bwpv, lAlpha_seq);
	}

	_endPayoutGlowSequence()
	{
		this._fPayoutGlowView_bwpv && Sequence.destroy(Sequence.findByTarget(this._fPayoutGlowView_bwpv));
		this._fPayoutGlowView_bwpv && this._fPayoutGlowView_bwpv.destroy();
		this._fPayoutGlowView_bwpv = null;

		this._validateEnding();
	}

	_startWinAnimation()
	{
		this._fWinAnimation_spr = this.addChild(new Sprite());
		this._fWinAnimation_spr.textures = _mini_slot_win_textures;
		this._fWinAnimation_spr.blendMode = PIXI.BLEND_MODES.ADD;
		this._fWinAnimation_spr.scale.set(2);
		this._fWinAnimation_spr.animationSpeed = 30/60;
		this._fWinAnimation_spr.on('animationend', () => {
			this._fWinAnimation_spr && this._fWinAnimation_spr.destroy();
			this._fWinAnimation_spr = null;

			this._validateEnding();
		});
		this._fWinAnimation_spr.play();
	}

	_startEndFlareAnimation()
	{
		this._fEndFlare_sprt = this.addChild(APP.library.getSprite("critical_hit/flare"));
		this._fEndFlare_sprt.blendMode = PIXI.BLEND_MODES.ADD;
		this._fEndFlare_sprt.tint = 0xffdb4d;
		this._fEndFlare_sprt.scale.set(0);
		this._fEndFlare_sprt.position.set(0, -26);

		let lScale_seq = [
			{tweens: [	{prop: "scale.x", to: 2.2},		{prop: "scale.y", to: 0.8}],	duration: 2*FRAME_RATE},
			{tweens: [	{prop: "scale.x", to: 1.4},		{prop: "scale.y", to: 1}],		duration: 2*FRAME_RATE},
			{tweens: [	{prop: "scale.x", to: 0},		{prop: "scale.y", to: 0}],		duration: 4*FRAME_RATE, onfinish: ()=>{
				this._endEndFlareSequence();
			}}
		];

		Sequence.start(this._fEndFlare_sprt, lScale_seq);
	}

	_endEndFlareSequence()
	{
		this._fEndFlare_sprt && Sequence.destroy(Sequence.findByTarget(this._fEndFlare_sprt));
		this._fEndFlare_sprt && this._fEndFlare_sprt.destroy();
		this._fEndFlare_sprt = null;

		this._validateEnding();
	}

	get _isSomethingAnimating()
	{
		return	this._fPayoutView_wp ||
				this._fEndFlare_sprt ||
				this._fWinAnimation_spr ||
				this._fPayoutGlowView_bwpv
	}

	_validateEnding()
	{
		if (this._isSomethingAnimating) return;

		this._onAnimationCompleted();
	}

	_onAnimationCompleted()
	{
		this.emit(MiniSlotWinAnimation.EVENT_ON_BIG_WIN_ANIMATION_COMPLETED, {value: this._fPayoutValue_num});
	}

	destroy()
	{
		this._fPayoutView_wp && Sequence.destroy(Sequence.findByTarget(this._fPayoutView_wp));
		this._fPayoutGlowView_bwpv && Sequence.destroy(Sequence.findByTarget(this._fPayoutGlowView_bwpv));
		this._fEndFlare_sprt && Sequence.destroy(Sequence.findByTarget(this._fEndFlare_sprt));

		super.destroy();

		this._fPayoutView_wp = null;
		this._fPayoutValue_num = null;
		this._fPayoutGlowView_bwpv = null;
		this._fEndFlare_sprt = null;
		this._fWinAnimation_spr = null;
	}
}

export default MiniSlotWinAnimation;