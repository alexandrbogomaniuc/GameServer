import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import * as Easing from '../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { FRAME_RATE } from '../../../../../shared/src/CommonConstants';
import { Sequence } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import { Utils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import DeathFxAnimation from '../../../main/animation/death/DeathFxAnimation';
import { AtlasSprite } from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/index';
import AtlasConfig from '../../../config/AtlasConfig';

class FragmentItem extends Sprite
{
	static get ON_FRAGMENT_APPEARING_STARTED()		{return "ON_FRAGMENT_APPEARING_STARTED";}
	static get ON_FRAGMENT_APPEARED()				{return "ON_FRAGMENT_APPEARED";}
	static get ON_FRAGMENT_LANDING_STARTED()		{return "ON_FRAGMENT_LANDING_STARTED";}
	static get ON_FRAGMENT_LANDED()					{return "ON_FRAGMENT_LANDED";}
	static get ON_FRAGMENT_ANIMATION_COMPLETED()	{return "ON_FRAGMENT_ANIMATION_COMPLETED";}

	get fragmentId()
	{
		return this._fragmentId;
	}

	get isAppearred()
	{
		return this._fIsAppearred_bl;
	}

	get isLandingAllowed()
	{
		return this._fIsLandingAllowed_bl;
	}

	constructor(fragmentId)
	{
		super();

		DeathFxAnimation.initSmokePuffTextures();
		FragmentItem.initTextures();

		this._contentContainer = null;
		this._fragmentView = null;
		this._fragmentId = fragmentId;
		this._appearPos_p = null;
		this._finalPos_p = null;
		this._fBounceY_num = undefined;
		this._highlightedView = null;
		this._glowView = null;
		
		this._fIsAppearred_bl = false;
		this._fIsLandingAllowed_bl = false;

		this._baseContentPosition = null;

		this._initContent();
	}

	destroy()
	{
		Sequence.destroy(Sequence.findByTarget(this._fragmentView));
		this._fragmentView = null;

		Sequence.destroy(Sequence.findByTarget(this._contentContainer));
		this._contentContainer = null;

		if (this._highlightedView)
		{
			Sequence.destroy(Sequence.findByTarget(this._highlightedView));
			this._highlightedView = null;
		}		

		if (this._glowView)
		{
			Sequence.destroy(Sequence.findByTarget(this._glowView));
			this._glowView = null;
		}		

		this._fragmentId = undefined;
		this._appearPos_p = null;
		this._finalPos_p = null;
		this._fBounceY_num = undefined;
		
		this._fIsAppearred_bl = undefined;
		this._fIsLandingAllowed_bl = undefined;

		this._baseContentPosition = null;

		this._hoverSequence && this._hoverSequence.destructor();
		this._hoverSequence = null;

		super.destroy();
	}

	startAnimation(aAppearGlobalPosition_p, aFinalGlobalPosition_p)
	{
		this._appearPos_p = this.globalToLocal(aAppearGlobalPosition_p);
		this._finalPos_p = this.globalToLocal(aFinalGlobalPosition_p);

		this._addFragmentView();

		this._startAppearAnimation();

		this.emit(FragmentItem.ON_FRAGMENT_APPEARING_STARTED);
	}

	allowLanding()
	{
		if (this._fIsLandingAllowed_bl)
		{
			return;
		}

		this._fIsLandingAllowed_bl = true;
		this._startLandingIfRequired();
	}
	
	_initContent()
	{
		this._contentContainer = this.addChild(new Sprite());
	}

	//FRAGMENT...
	_addFragmentView()
	{
		let fv = this._fragmentView = this._contentContainer.addChild(new Sprite());
		let lFragmentSprite_sprt = new Sprite();
		lFragmentSprite_sprt.textures = [FragmentItem.textures['fragments'][8-this._fragmentId]];
		lFragmentSprite_sprt.scale.set(-1, 1);

		fv.addChild(lFragmentSprite_sprt);

		if (this._profilingInfo.isVfxProfileValueLowerOrGreater)
		{
			let lHighlightedView = this._highlightedView = fv.addChild(new Sprite());
			let lHighlightedFrame_sprt = new Sprite();
			lHighlightedFrame_sprt.textures = [FragmentItem.textures['fragments_tint'][8-this._fragmentId]];
			lHighlightedFrame_sprt.scale.set(-2, 2);
			lHighlightedView.addChild(lHighlightedFrame_sprt);
			lHighlightedView.alpha = 1;
		}		

		if (this._profilingInfo.isVfxProfileValueMediumOrGreater)
		{
			let lGlowView = this._glowView = fv.addChild(new Sprite);
			let lGlowFrame_sprt = new Sprite();
			lGlowFrame_sprt.textures = [FragmentItem.textures['fragments_glow'][8-this._fragmentId]];
			lGlowFrame_sprt.blendMode = PIXI.BLEND_MODES.ADD;
			lGlowFrame_sprt.scale.set(-2, 2);
			lGlowView.addChild(lGlowFrame_sprt);
			lGlowView.alpha = 0.8;
		}		
		
		fv.zIndex = 10;
		fv.scale.set(0.15, 0.15);
		fv.rotation = Utils.gradToRad(-100);
	}
	//...FRAGMENT

	_startAppearAnimation()
	{
		let lTargetX_num = this._appearPos_p.x;
		let lTargetY_num = this._appearPos_p.y;
		let lYBounceDir_num = lTargetY_num > 0 ? -1 : 1;
		let lBounceY_num = this._fBounceY_num = lTargetY_num+10*lYBounceDir_num;

		let lMoveInSeq = [
							{tweens: [{prop: 'x', to: lTargetX_num}, {prop: 'y', to: lBounceY_num}],	duration: 15*FRAME_RATE, onfinish: ()=>{ this._onPuffTime(); }},
							{tweens: [{prop: 'y', to: lTargetY_num}],	duration: 16*FRAME_RATE, onfinish: ()=>{ this._onGlowInDisappearTime();}},
							{tweens: [],	duration: 5*FRAME_RATE, onfinish: ()=>{ this._onFragmentAppearred(); } }
						]

		let lScaleInSeq = [
							{tweens: [{prop: 'scale.x', to: 0.84}, {prop: 'scale.y', to: 0.84}],	duration: 22*FRAME_RATE}
						]

		let lRotationInSeq = [
							{tweens: [{prop: 'rotation', to: Utils.gradToRad(10)}],	duration: 13*FRAME_RATE},
							{tweens: [{prop: 'rotation', to: Utils.gradToRad(-13)}],	duration: 23*FRAME_RATE}
						]

		Sequence.start(this._fragmentView, lMoveInSeq);
		Sequence.start(this._fragmentView, lScaleInSeq);
		Sequence.start(this._fragmentView, lRotationInSeq);

		if (this._highlightedView)
		{
			let lHighlightInSeq = [
							{tweens: [],	duration: 2*FRAME_RATE},
							{tweens: [{prop: 'alpha', to: 0}],	duration: 4*FRAME_RATE}
						]

			Sequence.start(this._highlightedView, lHighlightInSeq);
		}		
	}

	_onPuffTime()
	{
		if (this._profilingInfo.isVfxProfileValueMediumOrGreater)
		{
			this._playSmokeEffect(this._appearPos_p.x, this._fBounceY_num);
			this._playSmokeEffect(this._appearPos_p.x, this._fBounceY_num);
		}		
	}

	_onGlowInDisappearTime()
	{
		if (!this._glowView)
		{
			return;
		}

		let lGlowInSeq = [
							{tweens: [{prop: 'alpha', to: 0.2}],	duration: 5*FRAME_RATE}
						]

		Sequence.start(this._glowView, lGlowInSeq);
	}

	_onFragmentAppearred()
	{
		this._fIsAppearred_bl = true;
		this._glowView && (this._glowView.alpha = 0);

		this.emit(FragmentItem.ON_FRAGMENT_APPEARED);

		this._startLandingIfRequired();
	}

	_playSmokeEffect(aX_num, aY_num, callback = null)
	{
		let effect = this._contentContainer.addChild(new Sprite());
		effect.textures = DeathFxAnimation.textures['smokePuff'];
		effect.blendMode = PIXI.BLEND_MODES.ADD;
		effect.scale.set(2*0.5);
		effect.position.set(aX_num, aY_num);
		effect.animationSpeed = 48/60;
		effect.play();
		effect.once('animationend', (e) => {
			e.target.destroy();
			if (callback)
			{
				callback.call();
			}
		});
		return effect;
	}

	get _profilingInfo()
	{
		return APP.profilingController.info;
	}
	
	_startLandingIfRequired()
	{
		if (this._fIsAppearred_bl && this._fIsLandingAllowed_bl)
		{
			this._stopHoverCycle();
			this._startLanding();
		}
		else if (this._fIsAppearred_bl)
		{
			this._baseContentPosition = new PIXI.Point(this._contentContainer.x, this._contentContainer.y);
			this._startHoverCycle();
		}
	}

	_startLanding()
	{
		let lMoveOutSeq = [
							{tweens: [{prop: 'y', to: this._fBounceY_num}],	duration: 4*FRAME_RATE},
							{tweens: [{prop: 'x', to: this._finalPos_p.x}, {prop: 'y', to: this._finalPos_p.y}],	duration: 8*FRAME_RATE, onfinish: ()=>{ this._onFragmentLanded(); }},
							{tweens: [],	duration: 3*FRAME_RATE, onfinish: ()=>{ this._onFragmentAnimationCompleted(); }}
						]

		let lScaleOutSeq = [
							{tweens: [{prop: 'scale.x', to: 1}, {prop: 'scale.y', to: 1}],	duration: 3*FRAME_RATE, onfinish: ()=>{ this._onGlowOutAppearTime(); }},
							{tweens: [{prop: 'scale.x', to: 0.4}, {prop: 'scale.y', to: 0.4}],	duration: 9*FRAME_RATE}
						]

		let lRotationOutSeq = [
							{tweens: [{prop: 'rotation', to: Utils.gradToRad(60)}],	duration: 15*FRAME_RATE}
						]

		Sequence.start(this._fragmentView, lMoveOutSeq);
		Sequence.start(this._fragmentView, lScaleOutSeq);
		Sequence.start(this._fragmentView, lRotationOutSeq);

		if (this._highlightedView)
		{
			this._highlightedView.alpha = 0.3/*42*/;

			let lHighlightOutSeq = [
							{tweens: [{prop: 'alpha', to: 0.7/*1*/}],	duration: 2*FRAME_RATE},
							{tweens: [{prop: 'alpha', to: 0.5/*71*/}],	duration: 9*FRAME_RATE}
						]

			Sequence.start(this._highlightedView, lHighlightOutSeq);
		}		

		this.emit(FragmentItem.ON_FRAGMENT_LANDING_STARTED);
	}

	_onGlowOutAppearTime()
	{
		if (!this._glowView)
		{
			return;
		}

		this._glowView.alpha = 0;

		let lGlowInSeq = [
							{tweens: [{prop: 'alpha', to: 1}],	duration: 3*FRAME_RATE},
							{tweens: [{prop: 'alpha', to: 0.8}],	duration: 5*FRAME_RATE},
						]

		Sequence.start(this._glowView, lGlowInSeq);
	}

	_onFragmentLanded()
	{
		let lIsFinalFragment_bl = APP.gameScreen.gameField.fragmentsPanelController.isOneFragmentLeftBeforeBossRising;

		this.emit(FragmentItem.ON_FRAGMENT_LANDED, {isFinalFragment: lIsFinalFragment_bl});
	}

	_onFragmentAnimationCompleted()
	{
		this.emit(FragmentItem.ON_FRAGMENT_ANIMATION_COMPLETED);
	}

	//HOVER...
	_startHoverCycle()
	{
		let content = this._contentContainer;

		let baseX = this._baseContentPosition.x;
		let baseY = this._baseContentPosition.y;
		let newX = Utils.getRandomWiggledValue(this._baseContentPosition.x, 5);
		let newY = Utils.getRandomWiggledValue(this._baseContentPosition.y, 5);
		let newRotation = Utils.gradToRad(Utils.getRandomWiggledValue(0, 5));

		let seq = [
					{
						tweens: [
									{prop: 'x', to: newX}, 
									{prop: 'y', to: newY}
								], 
						duration: 5*FRAME_RATE,
						onfinish: () => { this._onHoverCycleCompleted();}
					}
		]

		this._hoverSequence = Sequence.start(content, seq);
	}

	_onHoverCycleCompleted()
	{
		this._stopHoverCycle();

		this._startHoverCycle();
	}

	_stopHoverCycle()
	{
		this._hoverSequence && this._hoverSequence.destructor();
		this._hoverSequence = null;
	}
	//...HOVER
}

FragmentItem.textures = {
	fragments: null
}

FragmentItem.initTextures = function()
{
	FragmentItem.setTexture('fragments', ["dragonstones/stone_fragments"], [AtlasConfig.StoneFragments], 'normal');
	FragmentItem.setTexture('fragments_tint', ["dragonstones/stone_fragments"], [AtlasConfig.StoneFragments], 'tinted');
	FragmentItem.setTexture('fragments_glow', ["dragonstones/stone_fragments_highlight"], [AtlasConfig.StoneFragmentsHighlight], '');
}

FragmentItem.setTexture = function (name, imageNames, configs, path)
{
	if (!FragmentItem.textures[name])
	{
		FragmentItem.textures[name] = [];

		if(!Array.isArray(imageNames)) imageNames = [imageNames];
		if(!Array.isArray(configs)) configs = [configs];

		let assets = [];
		imageNames.forEach(function(item){assets.push(APP.library.getAsset(item))});

		FragmentItem.textures[name] = AtlasSprite.getFrames(assets, configs, path);
		FragmentItem.textures[name].sort(function(a, b){if(a._atlasName > b._atlasName) return 1; else return -1});
	}
};

export default FragmentItem