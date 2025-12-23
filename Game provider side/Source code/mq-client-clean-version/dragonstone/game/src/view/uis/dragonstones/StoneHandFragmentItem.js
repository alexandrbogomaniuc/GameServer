import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../shared/src/CommonConstants';
import { Sequence } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import * as Easing from '../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { Utils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import FragmentItem from './FragmentItem';
import DragonstonesAssets from './DragonstonesAssets';

class StoneHandFragmentItem extends Sprite
{
	static get FRAGMENT_MODES()
	{
		return {
					EMPTY: "EMPTY",
					COLLECTED: "COLLECTED"
				}
	}

	updateMode(mode, aUseAnimation_bl = false, aIsLastStoneFragment_bl=false)
	{
		this._updateMode(mode, aUseAnimation_bl, aIsLastStoneFragment_bl);
	}

	get currentMode()
	{
		return this._mode;
	}

	interruptAnimations()
	{
		this._interruptAnimations();
	}

	startFragmentLandingAnimation(aLandedFragmentId_num, aIsLastStoneFragment_bl)
	{
		this._startFragmentLandingAnimation(aLandedFragmentId_num, aIsLastStoneFragment_bl);
	}

	constructor(aFragmentId_num)
	{
		super();

		FragmentItem.initTextures();
		DragonstonesAssets.initTextures();

		this._fFragmentId_num = aFragmentId_num;

		this._mode = undefined;
		this._collectedView_sprt = null;
		this._emptyView_sprt = null;
		this._container = this.addChild(new Sprite);
		this._wiggleSeq = null;
		this._collectedGlowView_sprt = null;

		this._initView();
	}

	_initView()
	{
		let lGlowFrame_sprt = this._container.addChild(new Sprite);
		lGlowFrame_sprt.textures = [FragmentItem.textures['fragments_glow'][8-this._fFragmentId_num]];
		lGlowFrame_sprt.blendMode = PIXI.BLEND_MODES.ADD;
		lGlowFrame_sprt.scale.set(2*0.15, 2*0.15);
		lGlowFrame_sprt.zIndex = 0;
	}

	_updateMode(mode, aUseAnimation_bl=false, aIsLastStoneFragment_bl=false)
	{
		this._mode = mode;

		switch (mode)
		{
			case StoneHandFragmentItem.FRAGMENT_MODES.COLLECTED:
				if (aUseAnimation_bl && aIsLastStoneFragment_bl)
				{
					this.interruptAnimations();
				}

				if (this._emptyView_sprt)
				{
					this._interruptWiggle();
					
					this._emptyView_sprt.destroy();
					this._emptyView_sprt = null;
				}

				let lIsAnimationRequired_bl = aUseAnimation_bl && !this._collectedView_sprt;
				let lCollectedView = this._collectedView_sprt;
				if (!lCollectedView)
				{
					lCollectedView = this._collectedView_sprt = this._container.addChild(new Sprite);
					lCollectedView.textures = [DragonstonesAssets['hand_fragments'][8-this._fFragmentId_num]];
					lCollectedView.zIndex = 1;
				}

				if (lIsAnimationRequired_bl)
				{
					let lCollectedGlowView_sprt = this._collectedGlowView_sprt = this._collectedView_sprt.addChild(new Sprite);
					lCollectedGlowView_sprt.textures = [DragonstonesAssets['hand_fragments_white'][8-this._fFragmentId_num]];
					lCollectedGlowView_sprt.blendMode = PIXI.BLEND_MODES.ADD;
					
					let lScaleSeq;
					if (aIsLastStoneFragment_bl)
					{
						lScaleSeq = [
							{tweens: [],	duration: 4*FRAME_RATE},
							{tweens: [{prop: 'scale.x', to: 1.3}, {prop: 'scale.y', to: 1.3}],	duration: 5*FRAME_RATE},
							{tweens: [{prop: 'scale.x', to: 1.55}, {prop: 'scale.y', to: 1.55}],	duration: 5*FRAME_RATE},
							{tweens: [{prop: 'scale.x', to: 1.3}, {prop: 'scale.y', to: 1.3}],	duration: 4*FRAME_RATE},
							{tweens: [{prop: 'scale.x', to: 1}, {prop: 'scale.y', to: 1}],	duration: 4*FRAME_RATE}
						];
					}
					else
					{
						if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
						{
							lScaleSeq = [
								{tweens: [],	duration: 4*FRAME_RATE},
								{tweens: [{prop: 'scale.x', to: 1.3}, {prop: 'scale.y', to: 1.3}],	duration: 5*FRAME_RATE},
								{tweens: [{prop: 'scale.x', to: 1.55}, {prop: 'scale.y', to: 1.55}],	duration: 5*FRAME_RATE},
								{tweens: [{prop: 'scale.x', to: 1.3}, {prop: 'scale.y', to: 1.3}],	duration: 5*FRAME_RATE, onfinish: ()=>{ lCollectedGlowView_sprt.fadeTo(0, 8*FRAME_RATE); }},
								{tweens: [{prop: 'scale.x', to: 0.95}, {prop: 'scale.y', to: 0.95}],	duration: 4*FRAME_RATE},
								{tweens: [{prop: 'scale.x', to: 1.05}, {prop: 'scale.y', to: 1.05}],	duration: 7*FRAME_RATE},
								{tweens: [{prop: 'scale.x', to: 1}, {prop: 'scale.y', to: 1}],	duration: 5*FRAME_RATE, onfinish: ()=>{ this._onCollectedViewIntroAnimationCompleted(); } }
							];
						}
						else
						{
							lScaleSeq = [
								{tweens: [],	duration: 4*FRAME_RATE},
								{tweens: [{prop: 'scale.x', to: 1.3}, {prop: 'scale.y', to: 1.3}],	duration: 5*FRAME_RATE, onfinish: ()=>{ lCollectedGlowView_sprt.fadeTo(0, 3*FRAME_RATE); }},
								{tweens: [{prop: 'scale.x', to: 1}, {prop: 'scale.y', to: 1}],	duration: 5*FRAME_RATE, onfinish: ()=>{ this._onCollectedViewIntroAnimationCompleted(); } }
							];
						}
					}

					Sequence.start(lCollectedView, lScaleSeq);
				}

				break;

			case StoneHandFragmentItem.FRAGMENT_MODES.EMPTY:
				if (this._collectedView_sprt)
				{
					Sequence.destroy(Sequence.findByTarget(this._collectedView_sprt));
					this._collectedView_sprt.destroy();
					this._collectedView_sprt = null;
				}

				if (!this._emptyView_sprt)
				{
					let lEmptyView = this._emptyView_sprt = this._container.addChild(new Sprite);
					lEmptyView.textures = [DragonstonesAssets['hand_fragments_white'][8-this._fFragmentId_num]];
					lEmptyView.blendMode = PIXI.BLEND_MODES.ADD;
					lEmptyView.zIndex = 1;
					lEmptyView.alpha = 0.82;

					if (!this._wiggleSeq)
					{
						this._wiggleStep();
					}
				}
				break;
		}
	}

	_onCollectedViewIntroAnimationCompleted()
	{
		this._collectedGlowView_sprt && this._collectedGlowView_sprt.destroy();
		this._collectedGlowView_sprt = null;

		Sequence.destroy(Sequence.findByTarget(this._collectedView_sprt));
	}

	_interruptFlyOut()
	{
		Sequence.destroy(Sequence.findByTarget(this._container));
		this._container.x = 0;
		this._container.y = 0;
		this._container.scale.set(1);

		this._collectedGlowView_sprt && this._collectedGlowView_sprt.destroy();
		this._collectedGlowView_sprt = null;

		Sequence.destroy(Sequence.findByTarget(this._collectedView_sprt));
	}

	_wiggleStep()
	{
		let lWiggleStepSeq = [
			{tweens: [{prop: 'x', to: Utils.getRandomWiggledValue(-1, 1)}, {prop: 'y', to: Utils.getRandomWiggledValue(-1, 1)}],	duration: 7*FRAME_RATE, onfinish: ()=>{ this._onWiggleStepCompleted(); }}
		]

		Sequence.start(this._container, lWiggleStepSeq);
	}

	_onWiggleStepCompleted()
	{
		Sequence.destroy(Sequence.findByTarget(this._container));
		this._wiggleSeq = null;

		this._wiggleStep();
	}

	_interruptWiggle()
	{
		Sequence.destroy(Sequence.findByTarget(this._container));
		this._container.x = 0;
		this._container.y = 0;

		this._wiggleSeq = null;
	}

	_interruptAnimations()
	{
		this._collectedGlowView_sprt && this._collectedGlowView_sprt.destroy();
		this._collectedGlowView_sprt = null;

		if (this._collectedView_sprt)
		{
			Sequence.destroy(Sequence.findByTarget(this._collectedView_sprt));
		}

		this._interruptLandingGlowAnimation();
		this._interruptFlyOut();

		if (!this._wiggleSeq && this._mode == StoneHandFragmentItem.FRAGMENT_MODES.EMPTY)
		{
			this._wiggleStep();
		}
	}

	_startFragmentLandingAnimation(aLandedFragmentId_num, aIsLastStoneFragment_bl)
	{
		this._showLandingGlowAnimation(aIsLastStoneFragment_bl);
	}

	_showLandingGlowAnimation(aIsLastStoneFragment_bl)
	{
		let lGlowView_sprt = this._white_glow;
		if (lGlowView_sprt)
		{
			this._interruptLandingGlowAnimation();
		}

		let lTexturesName = aIsLastStoneFragment_bl ? 'hand_fragments_white' : 'hand_fragments_glow';
		lGlowView_sprt = this._white_glow = this._container.addChild(new Sprite);
		lGlowView_sprt.textures = [DragonstonesAssets[lTexturesName][8-this._fFragmentId_num]];
		lGlowView_sprt.blendMode = PIXI.BLEND_MODES.ADD;
		lGlowView_sprt.scale.set(aIsLastStoneFragment_bl ? 1 : 2);
		lGlowView_sprt.zIndex = 3;

		lGlowView_sprt.alpha = 1;

		let lGlowSeq;
		if (aIsLastStoneFragment_bl)
		{
			lGlowSeq = [
				{tweens: [],	duration: 22*FRAME_RATE, onfinish: ()=>{ this._startFlyOut(); } },
			];
		}
		else
		{
			lGlowSeq = [
				{tweens: [],	duration: 4*FRAME_RATE},
				{tweens: [{prop: 'alpha', to: 0}],	duration: 11*FRAME_RATE, onfinish: ()=>{ this._onLandingGlowAnimationCompleted(); }}
			];
		}


		Sequence.start(lGlowView_sprt, lGlowSeq);
	}

	_startFlyOut()
	{
		let lTargetPos = this.globalToLocal(960/2, 540/2);
		let lDelayFrames_num = (this._fFragmentId_num-1)*3;
		
		let lMoveSeq = [
			{tweens: [], duration: lDelayFrames_num*FRAME_RATE},
			{tweens: [{prop: 'x', to: this._container.x+25}, {prop: 'y', to: this._container.y-8}], ease: Easing.bounce.easeOut, duration: 6*FRAME_RATE},
			{tweens: [{prop: 'x', to: lTargetPos.x}, {prop: 'y', to: lTargetPos.y}], ease: Easing.bounce.easeIn, duration: 12*FRAME_RATE}
		]

		let lScaleSeq = [
			{tweens: [], duration: lDelayFrames_num*FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 2.4}, {prop: 'scale.y', to: 2.4}], ease: Easing.cubic.easeIn, duration: 16*FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 0.5}, {prop: 'scale.y', to: 0.5}], duration: 4*FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 0}, {prop: 'scale.y', to: 0}], duration: 1*FRAME_RATE, onfinish: ()=>{} }
		]

		Sequence.start(this._container, lMoveSeq);
		Sequence.start(this._container, lScaleSeq);
	}

	_onLandingGlowAnimationCompleted()
	{
		this._interruptLandingGlowAnimation();
	}

	_interruptLandingGlowAnimation()
	{
		let lGlowView_sprt = this._white_glow;

		if (lGlowView_sprt)
		{
			Sequence.destroy(Sequence.findByTarget(lGlowView_sprt));

			lGlowView_sprt.destroy();
			this._white_glow = null;
		}
	}

	destroy()
	{
		if (this._collectedView_sprt)
		{
			Sequence.destroy(Sequence.findByTarget(this._collectedView_sprt));
		}

		this._interruptWiggle();
		this._interruptLandingGlowAnimation();

		this._fFragmentId_num = undefined;

		this._mode = undefined;
		this._collectedView_sprt = null;
		this._emptyView_sprt = null;
		this._container = null;
		this._wiggleSeq = null;
		this._white_glow = null;
		this._collectedGlowView_sprt = null;

		super.destroy();
	}

}

export default StoneHandFragmentItem;