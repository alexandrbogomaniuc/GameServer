import Sprite from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import I18 from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18'
import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sequence from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { FRAME_RATE } from '../../../../../../../shared/src/CommonConstants';
import { DropShadowFilter, ColorOverlayFilter } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Filters';
import { easing } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation';
import Tween from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Tween';

class BossModePlayerWinAnimation extends Sprite
{
	static get EVENT_ON_WIN_ANIMATION_COMPLETED()					{return "onBossModePlayerWinAnimationCompleted"; }

	constructor()
	{
		super();

		this._fCaption_cta = null;
		this._fCaption_cta = null;
		this._fPlayerName_str = null;
		this._fAnimationsCount_num = 0;
		this._fAnimationInProgress_bl = false;

		this._fBottomContainer_spr = this.addChild(new Sprite());
		this._fCaptionContainer_spr = this.addChild(new Sprite());

		this._initCaption();
		this.hide();
	}

	get isAnimationInProgress()
	{
		return this._fAnimationInProgress_bl;
	}
	
	set playerName(aPlayerName_str)
	{
		this._fPlayerName_str = String(aPlayerName_str);

		if (!this._fCaption_cta)
		{
			this._initCaption();
		}

		this._fCaption_cta.text = this._fCaption_cta.text.replace("/USERNAME/", this._fPlayerName_str);
	}

	get playerName()
	{
		return this._fPlayerName_str;
	}

	startAnimation()
	{
		this._startAnimation();
	}
	
	_initCaption()
	{
		this._fCaption_cta = this._fCaptionContainer_spr.addChild(I18.generateNewCTranslatableAsset("TABossModePlayerWin"));
		this._fCaption_cta.filters = [ new DropShadowFilter({alpha: 0.7, angle: 90, distance: 5}) ];
	}

	_startAnimation()
	{
		if (this._fAnimationInProgress_bl || !this._fPlayerName_str)
		{
			return;
		}
		
		this.show();
		this._fCaptionContainer_spr.scale.set(0);
		this._fAnimationInProgress_bl = true;

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startFlareAndCircleAnimations();
		}

		this._fAnimationsCount_num++;
		let lScaleSeq_obj = [
			{ tweens: [ {prop: 'scale.x', to: 1.14}, {prop: 'scale.y', to: 1.14} ], duration: 10 * FRAME_RATE, ease: easing.quadratic.easeIn },
			{ tweens: [ {prop: 'scale.x', to: 0.9}, {prop: 'scale.y', to: 0.9} ], duration: 10 * FRAME_RATE },
			{ tweens: [], duration: 26 * FRAME_RATE },
			{ tweens: [ {prop: 'scale.x', to: 0.75}, {prop: 'scale.y', to: 0.75} ], duration: 2 * FRAME_RATE },
			{ tweens: [ {prop: 'scale.x', to: 1.35}, {prop: 'scale.y', to: 1.35} ], duration: 3 * FRAME_RATE, onfinish: this._startGlowAnimation.bind(this), ease: easing.sine.easeIn },
			{ tweens: [ {prop: 'scale.x', to: 1.5}, {prop: 'scale.y', to: 1.5}, {prop: "alpha", to: 0} ], duration: 6 * FRAME_RATE, onfinish: ()=>{
				this._fAnimationsCount_num--;
				this._tryToCompleteAnimation();
			}}
		];

		let lAlphaAnimation_seq = [
			{ tweens: [{prop: "alpha", to: 1}], duration: 18*FRAME_RATE}
		];

		Sequence.start(this._fCaptionContainer_spr, lScaleSeq_obj, 9*FRAME_RATE);
		Sequence.start(this._fCaptionContainer_spr, lAlphaAnimation_seq, 9*FRAME_RATE);
	}

	_tryToCompleteAnimation()
	{
		if (!this._fAnimationsCount_num)
		{
			this._reset();
			this.emit(BossModePlayerWinAnimation.EVENT_ON_WIN_ANIMATION_COMPLETED);
		}
	}

	_startFlareAndCircleAnimations()
	{
		this._fGlow_spr = this._fBottomContainer_spr.addChild(APP.library.getSpriteFromAtlas("big_win/glow_big_win"));
		this._fGlow_spr.alpha = 0;
		this._fGlow_spr.position.set(0, -50);
		this._fGlow_spr.scale.set(2.24, 1.5);
		this._fGlow_spr.blendMode = PIXI.BLEND_MODES.SCREEN;
		let lGlowAlpha_seq = [
			{tweens: [{prop: "alpha", to: 1}], duration: 9*FRAME_RATE},
			{tweens: [], duration: 52*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0}], duration: 6*FRAME_RATE, onfinish: ()=>{
				this._fAnimationsCount_num--;
				this._tryToCompleteAnimation();
			}}
		];
		this._fAnimationsCount_num++;
		Sequence.start(this._fGlow_spr, lGlowAlpha_seq, 4*FRAME_RATE);

		this._fFlare_spr = this._fBottomContainer_spr.addChild(APP.library.getSpriteFromAtlas("big_win/glow_big_win"));
		this._fFlare_spr.blendMode = PIXI.BLEND_MODES.ADD;
		this._fFlare_spr.position.set(0, -50);
		let lFlareScale_seq = [
			{tweens: [{prop: "scale.x", to: 3.92}, {prop: "scale.y", to: 1.92}], duration: 4*FRAME_RATE},
			{tweens: [{prop: "scale.x", to: 0}, {prop: "scale.y", to: 0}], duration: 7*FRAME_RATE,onfinish: ()=>{
				this._fAnimationsCount_num--;
				this._tryToCompleteAnimation();
			}}
		];
		this._fAnimationsCount_num++;
		Sequence.start(this._fFlare_spr, lFlareScale_seq);

		this._fFirstCircle_spr = this._fBottomContainer_spr.addChild(APP.library.getSpriteFromAtlas("big_win/circle_big_win"));
		this._fFirstCircle_spr.blendMode = PIXI.BLEND_MODES.SCREEN;
		this._fFirstCircle_spr.position.set(0, -30);
		this._fFirstCircle_spr.scale.set(0);

		this._fSecondCircle_spr = this._fBottomContainer_spr.addChild(APP.library.getSpriteFromAtlas("big_win/circle_big_win"));
		this._fSecondCircle_spr.blendMode = PIXI.BLEND_MODES.SCREEN;
		this._fSecondCircle_spr.position.set(0, -30);
		this._fSecondCircle_spr.scale.set(0);

		let lCircleScale_seq = [
			{tweens: [{prop: "scale.x", to: 1.6}, {prop: "scale.y", to: 1.6}], duration: 4.5*FRAME_RATE},
			{tweens: [{prop: "scale.x", to: 7}, {prop: "scale.y", to: 7}, {prop: "alpha", to: 0}], duration: 7*FRAME_RATE, onfinish: ()=>{
				this._fAnimationsCount_num--;
				this._tryToCompleteAnimation();
			}},
		];

		this._fAnimationsCount_num++;
		Sequence.start(this._fFirstCircle_spr, lCircleScale_seq, 9*FRAME_RATE);
		this._fAnimationsCount_num++;
		Sequence.start(this._fSecondCircle_spr, lCircleScale_seq, 12*FRAME_RATE);
	}

	_startGlowAnimation()
	{
		if (!APP.profilingController.info.isVfxProfileValueMediumOrGreater || !this._fCaption_cta || !this._fCaption_cta.filters)
		{
			return;
		}
		else
		{
			let lGlowFilter_gf = new ColorOverlayFilter(0xffffff, 0);
			let lAlphaTween_t = new Tween(lGlowFilter_gf, "alpha", 0, 1, 2*FRAME_RATE);
			lAlphaTween_t.play();
			this._fCaption_cta.filters.push(lGlowFilter_gf);
		}
	}

	_reset()
	{
		if (this._fCaption_cta && this._fCaption_cta.filters && Array.isArray(this._fCaption_cta.filters))
		{
			for (let l_f of this._fCaption_cta.filters)
			{
				Sequence.destroy(Sequence.findByTarget(l_f));
			}
		}
		
		Sequence.destroy(Sequence.findByTarget(this._fCaptionContainer_spr));
		Sequence.destroy(Sequence.findByTarget(this._fGlow_spr));
		Sequence.destroy(Sequence.findByTarget(this._fFlare_spr));
		Sequence.destroy(Sequence.findByTarget(this._fFirstCircle_spr));
		Sequence.destroy(Sequence.findByTarget(this._fSecondCircle_spr));

		this._fAnimationInProgress_bl = false;
	}

	destroy()
	{
		if (this._fCaption_cta && Array.isArray(this._fCaption_cta.filters))
		{
			for (let l_f of this._fCaption_cta.filters)
			{
				Tween.destroy(Tween.findByTarget(l_f));
			}
		}

		Sequence.destroy(Sequence.findByTarget(this._fCaptionContainer_spr));

		if (this._fCaption_cta && this._fCaption_cta.filters && Array.isArray(this._fCaption_cta.filters))
		{
			for (let l_f of this._fCaption_cta.filters)
			{
				Sequence.destroy(Sequence.findByTarget(l_f));
			}
		}

		
		Sequence.destroy(Sequence.findByTarget(this._fGlow_spr));
		this._fGlow_spr && this._fGlow_spr.destroy();
		this._fGlow_spr = null;

		Sequence.destroy(Sequence.findByTarget(this._fFlare_spr));
		this._fFlare_spr && this._fFlare_spr.destroy();
		this._fFlare_spr = null;

		Sequence.destroy(Sequence.findByTarget(this._fFirstCircle_spr));
		this._fFirstCircle_spr && this._fFirstCircle_spr.destroy();
		this._fFirstCircle_spr = null;

		Sequence.destroy(Sequence.findByTarget(this._fSecondCircle_spr));
		this._fSecondCircle_spr && this._fSecondCircle_spr.destroy();
		this._fSecondCircle_spr = null;

		this._fBottomContainer_spr && this._fBottomContainer_spr.destroy();
		this._fBottomContainer_spr = null;

		this._fCaption_cta && this._fCaption_cta.destroy();
		this._fCaption_cta = null;

		this._fCaptionContainer_spr && this._fCaptionContainer_spr.destroy();
		this._fCaptionContainer_spr = null;

		this._fPlayerName_str = null;
		this._fAnimationInProgress_bl = null;
		
		super.destroy();
	}
}

export default BossModePlayerWinAnimation;