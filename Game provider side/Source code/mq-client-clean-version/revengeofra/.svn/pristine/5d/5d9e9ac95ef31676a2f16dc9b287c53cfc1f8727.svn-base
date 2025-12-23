import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { Utils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import I18 from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
import * as Easing from '../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';

class KillStreakCaptionView extends Sprite
{
	static get ON_INTRO_ANIMATION_COMPLETED() { return "ON_INTRO_ANIMATION_COMPLETED"; }
	static get ON_HIGHLIGHT_ANIMATION_COMPLETED() { return "ON_HIGHLIGHT_ANIMATION_COMPLETED"; }
	static get ON_OUTRO_ANIMATION_COMPLETED() { return "ON_OUTRO_ANIMATION_COMPLETED"; }

	startIntroAnimation()
	{
		this._startIntroAnimation();
	}

	startHighlightAnimation()
	{
		this._showHighlightAnimation();
	}

	startOutroAnimation()
	{
		this._showOutroAnimation();
	}

	resetView()
	{
		this._resetView();
	}

	constructor()
	{
		super();

		this._container = this.addChild(new Sprite());
		this._smokeView = null;
		this._glowView = null;
	}

	_startIntroAnimation()
	{
		if (!this._smokeView)
		{
			this._createCaptionView();
		}

		this._showIntroAnimation();
	}

	_createCaptionView()
	{
		let smokeView = this._smokeView = this._container.addChild(I18.generateNewCTranslatableAsset("TAWinStreakLabel"));

		if (APP.profilingController.info.isVfxDynamicProfileValueMediumOrGreater)
		{
			this._addCaptionGlow();
		}
	}

	_addCaptionGlow()
	{
		let smokeGlowView = this._glowView = this._container.addChild(I18.generateNewCTranslatableAsset("TAWinStreakLabel"));
		smokeGlowView.assetContent.tint = 0xffc68e;
		smokeGlowView.assetContent.blendMode = PIXI.BLEND_MODES.ADD;
	}

	_resetView()
	{
		if (this._container)
		{
			Sequence.destroy(Sequence.findByTarget(this._container));
			this._container.scale.set(0, 0);
		}

		if (this._glowView)
		{
			Sequence.destroy(Sequence.findByTarget(this._glowView));
			this._glowView.alpha = 1;
		}
	}
	
	_showIntroAnimation()
	{
		this._container.scale.set(0, 0);
		this._container.pivot.set(0, 60);
		this._glowView && (this._glowView.alpha = 1);

		let scaleSeq = [
			{tweens: [], duration: 1*2*16.7},
			{tweens: [{prop: "scale.x", to: 1.2}, {prop: "scale.y", to: 1.2}], duration: 6*2*16.7, ease: Easing.sine.easeIn},
			{tweens: [{prop: "scale.x", to: 0.9}, {prop: "scale.y", to: 0.9}], duration: 5*2*16.7, ease: Easing.sine.easeOut},
			{tweens: [{prop: "scale.x", to: 1}, {prop: "scale.y", to: 1}], duration: 5*2*16.7, ease: Easing.sine.easeOut, onfinish: this._onIntroAnimationCompleted.bind(this)}
		];

		let glowSeq = [
			{tweens: [], duration: 5*2*16.7},
			{tweens: [{prop: "alpha", to: 0}], duration: 9*2*16.7, ease: Easing.sine.easeOut}
		];

		Sequence.start(this._container, scaleSeq);
		this._glowView && Sequence.start(this._glowView, glowSeq);
	}

	_onIntroAnimationCompleted()
	{
		this.emit(KillStreakCaptionView.ON_INTRO_ANIMATION_COMPLETED);
	}

	_showHighlightAnimation()
	{
		if (this._glowView)
		{
			Sequence.destroy(Sequence.findByTarget(this._glowView));

			let glowSeq = [
				{tweens: [{prop: "alpha", to: 1}], duration: 2*2*16.7},
				{tweens: [{prop: "alpha", to: 0}], duration: 5*2*16.7, ease: Easing.sine.easeOut}
			];
	
			Sequence.start(this._glowView, glowSeq);
		}
	}

	_showOutroAnimation()
	{
		let scaleSeq = [
			{tweens: [{prop: "scale.x", to: 1.25}, {prop: "scale.y", to: 1.25}], duration: 3*2*16.7, ease: Easing.sine.easeIn},
			{tweens: [{prop: "scale.x", to: 1}, {prop: "scale.y", to: 1}], duration: 3*2*16.7, ease: Easing.sine.easeOut},
			{tweens: [{prop: "scale.x", to: 0}, {prop: "scale.y", to: 0}], duration: 2*2*16.7, ease: Easing.sine.easeIn, onfinish: this._onOutroAnimationCompleted.bind(this)}
		];

		let glowSeq = [
			{tweens: [], duration: 1*2*16.7},
			{tweens: [{prop: "alpha", to: 1}], duration: 7*2*16.7, ease: Easing.sine.easeIn}
		];

		Sequence.start(this._container, scaleSeq);
		this._glowView && Sequence.start(this._glowView, glowSeq);
	}

	_onOutroAnimationCompleted()
	{
		this.emit(KillStreakCaptionView.ON_OUTRO_ANIMATION_COMPLETED);
	}

	destroy()
	{
		if (this._container)
		{
			Sequence.destroy(Sequence.findByTarget(this._container));
		}

		if (this._glowView)
		{
			Sequence.destroy(Sequence.findByTarget(this._glowView));
		}

		super.destroy();

		this._container = null;
		this._smokeView = null;
		this._glowView = null;
	}
}

export default KillStreakCaptionView;
