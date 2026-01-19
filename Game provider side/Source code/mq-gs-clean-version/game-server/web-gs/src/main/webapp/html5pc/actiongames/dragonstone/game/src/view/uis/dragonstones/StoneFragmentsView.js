import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import {MAX_FRAGMENTS_AMOUNT} from '../../../model/uis/dragonstones/FragmentsPanelInfo';
import FragmentItem from './FragmentItem';
import { FRAME_RATE } from '../../../../../shared/src/CommonConstants';
import { Sequence } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import { Utils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import DragonstonesAssets from './DragonstonesAssets';
import StoneEyeFlyOutAnimation from './StoneEyeFlyOutAnimation';

const FRAGMENTS_POSITIONS = [
	{x: -13.1, 	y: -16.8},
	{x: -19.8, 	y: 1},
	{x: -20.5, 	y: 14.9},
	{x: -8.6, 	y: 22.9},
	{x: 8.5, 	y: 25},
	{x: 17.3, 	y: 16.4},
	{x: 17.2, 	y: -5.4},
	{x: 8.1, 	y: -18.7}
]

class StoneFragmentsView extends Sprite
{
	static get EVENT_ON_STONE_EYE_FLY_OUT_STARTED()					{return 'EVENT_ON_STONE_EYE_FLY_OUT_STARTED';}
	static get EVENT_ON_LAST_FRAME_COLLECT_ANIMATIONS_COMPLETED()	{return 'EVENT_ON_LAST_FRAME_COLLECT_ANIMATIONS_COMPLETED';}
	static get EVENT_ON_SCREEN_COVERED()							{return StoneEyeFlyOutAnimation.EVENT_ON_SCREEN_COVERED;}

	updateFragments(aFragmentsAmount_num)
	{
		for (let i=1; i<=MAX_FRAGMENTS_AMOUNT; i++)
		{
			if (i <= aFragmentsAmount_num)
			{
				this._showFragment(i);
			}
			else
			{
				this._hideFragment(i);
			}
		}

		if (!this._markerAurasSeq)
		{
			this._startAurasRotationCycle();
		}
	}

	addFragment(aFragmentId_num)
	{
		this._showFragment(aFragmentId_num);
		this.updateFragments(aFragmentId_num)
	}

	startFragmentLandingAnimation(aIsLastStoneFragment_bl = false)
	{
		this._startFragmentLandingAnimation(aIsLastStoneFragment_bl);
	}

	interruptAnimation()
	{
		this._interruptAnimation();
	}

	isFlyOutStarted()
	{
		return this._fIsFlyOutStarted_bl;
	}

	isScreenCovered()
	{
		return this._fIsScreenCovered_bl;
	}

	constructor(aFlyOutContainer, aBigFlare)
	{
		super();

		this._fragments = [];
		this._container = null;
		this._framentsContainer = null;
		this._eyeBg = null;
		this._flyOutViewContainer = aFlyOutContainer;
		this._markerAuras = null;
		this._markerAurasSeq = null;
		this._fIsFlyOutStarted_bl = false;
		this._fIsScreenCovered_bl = false;

		FragmentItem.initTextures();
		DragonstonesAssets.initTextures();

		this._initView();
	}

	_initView()
	{
		this._container = this.addChild(new Sprite);
		this._framentsContainer = this._container.addChild(new Sprite);

		let lEyeBg = this._eyeBg = this._framentsContainer.addChild(new Sprite);
		lEyeBg.textures = DragonstonesAssets['eye_bg'];
		lEyeBg.scale.set(2);
		lEyeBg.blendMode = PIXI.BLEND_MODES.ADD;
		lEyeBg.x = -1;
		lEyeBg.y = 4;

		let lBaseFragment = this._framentsContainer.addChild(new Sprite);
		lBaseFragment.textures = DragonstonesAssets['fragments_base'];
		lBaseFragment.x = -3;
		lBaseFragment.y = 3;

		for (let i=1; i<=MAX_FRAGMENTS_AMOUNT; i++)
		{
			this._initFragment(i);
		}

		let lFragmentsHighlight = this._fragmentsHighlight = this._container.addChild(new Sprite);
		lFragmentsHighlight.textures = DragonstonesAssets['fragments_eye_glow'];
		lFragmentsHighlight.scale.set(2);
		lFragmentsHighlight.blendMode = PIXI.BLEND_MODES.ADD;
		lFragmentsHighlight.visible = false;

		let lMarkerAuras = this._markerAuras = this._container.addChild(new Sprite)
		lMarkerAuras.textures = DragonstonesAssets['marker_auras'];
		lMarkerAuras.scale.set(2);
		lMarkerAuras.blendMode = PIXI.BLEND_MODES.SCREEN;
		this._resetAurasPosition();
		
		this._startAurasRotationCycle();
	}

	_initFragment(fragmentId)
	{
		let lFragment = this._framentsContainer.addChild(new Sprite);
		lFragment.scale.x = -1*0.4*0.7;
		lFragment.scale.y = 0.4*0.7;
		let lFragmentSprite_sprt = lFragment.addChild(new Sprite);
		lFragmentSprite_sprt.textures = [FragmentItem.textures['fragments'][8-fragmentId]];

		let lFragmentPos = FRAGMENTS_POSITIONS[8-fragmentId];
		lFragment.x = lFragmentPos.x;
		lFragment.y = lFragmentPos.y;

		this._fragments.push(lFragment);

		this._hideFragment(fragmentId);
	}

	_resetAurasPosition()
	{
		let lMarkerAuras = this._markerAuras;

		lMarkerAuras.x = -3;
		lMarkerAuras.y = -5;
		lMarkerAuras.rotation = 0;
	}

	_startAurasRotationCycle()
	{
		let lMarkerAuras = this._markerAuras;
		let lAurasSeq = [
				{tweens: [{prop: 'rotation', to: Utils.gradToRad(360)}],	duration: 450*FRAME_RATE, onfinish: ()=>{ this._onAurasRotationCycleCompleted(); }}
			]
		
		this._markerAurasSeq = Sequence.start(lMarkerAuras, lAurasSeq);
	}

	_onAurasRotationCycleCompleted()
	{
		let lMarkerAuras = this._markerAuras;
		
		Sequence.destroy(Sequence.findByTarget(lMarkerAuras));
		this._markerAurasSeq = null;

		lMarkerAuras.rotation = 0;

		this._startAurasRotationCycle();
	}

	_hideFragment(fragmentId)
	{
		this._getFragmentById(fragmentId).visible = false;
	}

	_showFragment(fragmentId)
	{
		this._getFragmentById(fragmentId).visible = true;
	}

	_getFragmentById(fragmentId)
	{
		return this._fragments[fragmentId-1];
	}

	_startFragmentLandingAnimation(aIsLastStoneFragment_bl)
	{
		let lFragmentsHighlight = this._fragmentsHighlight;

		Sequence.destroy(Sequence.findByTarget(lFragmentsHighlight));

		lFragmentsHighlight.visible = true;
		lFragmentsHighlight.alpha = 1;

		let lGlowSeq = [
			{tweens: [],	duration: 4*FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0.6}],	duration: 4*FRAME_RATE, onfinish: ()=>{ this._onHighlightPreDisappearedTime(aIsLastStoneFragment_bl); }},
			{tweens: [{prop: 'alpha', to: 0}],	duration: 7*FRAME_RATE, onfinish: ()=>{ this._onHighlightAnimationCompleted(); }}
		]
		Sequence.start(lFragmentsHighlight, lGlowSeq);

		this._interruptShake();
		this._shakeFragments();
	}

	_onHighlightPreDisappearedTime(aIsLastStoneFragment_bl)
	{
		if (aIsLastStoneFragment_bl)
		{
			this._startFlyOut();
		}
	}

	_onHighlightAnimationCompleted()
	{
		this._interruptHighlightAnimation();
		this._interruptShake();
	}

	_interruptHighlightAnimation()
	{
		let lFragmentsHighlight = this._fragmentsHighlight;
		
		Sequence.destroy(Sequence.findByTarget(lFragmentsHighlight));

		lFragmentsHighlight.visible = false;
		lFragmentsHighlight.alpha = 1;

		this._container.addChild(lFragmentsHighlight);
		lFragmentsHighlight.x = 0;
		lFragmentsHighlight.y = 0;
	}

	_shakeFragments()
	{
		let lShakeSeq = [
			{tweens: [{prop: 'x', to: Utils.getRandomWiggledValue(0, 2.5)}, {prop: 'y', to: Utils.getRandomWiggledValue(0, 2.5)}],	duration: 1*FRAME_RATE, onfinish: ()=>{ this._onShakeStepCompleted(); }}
		]

		Sequence.start(this._container, lShakeSeq);
	}

	_onShakeStepCompleted()
	{
		Sequence.destroy(Sequence.findByTarget(this._container));

		this._shakeFragments();
	}

	_interruptShake()
	{
		Sequence.destroy(Sequence.findByTarget(this._container));
		this._container.x = this._container.y = 0;
	}

	_interruptAnimation()
	{
		this._interruptHighlightAnimation();
		this._interruptShake();

		let lMarkerAuras = this._markerAuras;
		Sequence.destroy(Sequence.findByTarget(lMarkerAuras));
		this._markerAurasSeq = null;

		this._container.addChild(lMarkerAuras);
		this._resetAurasPosition();

		this._framentsContainer.visible = true;

		this._flyOutViewContainer.destroyChildren();

		this._fIsFlyOutStarted_bl = false;
		this._fIsScreenCovered_bl = false;
	}

	_startFlyOut()
	{
		this._fIsFlyOutStarted_bl = true;

		this._interruptShake();

		this._framentsContainer.visible = false;

		let lFlyOutAnimation = this._flyOutViewContainer.addChild(new StoneEyeFlyOutAnimation(this._fragmentsHighlight, this._markerAuras));
		lFlyOutAnimation.on(StoneEyeFlyOutAnimation.EVENT_ON_SCREEN_COVERED, this._onScreenCovered, this);
		lFlyOutAnimation.on(StoneEyeFlyOutAnimation.EVENT_ON_ANIMATIONS_COMPLETED, this._onStoneEyeFlyOutAnimationCompleted, this);
		lFlyOutAnimation.startAnimation();

		this.emit(StoneFragmentsView.EVENT_ON_STONE_EYE_FLY_OUT_STARTED);
	}

	_onScreenCovered()
	{
		this._fIsScreenCovered_bl = true;

		this.emit(StoneFragmentsView.EVENT_ON_SCREEN_COVERED);
	}

	_onStoneEyeFlyOutAnimationCompleted()
	{
		this.emit(StoneFragmentsView.EVENT_ON_LAST_FRAME_COLLECT_ANIMATIONS_COMPLETED);
	}

	destroy()
	{
		Sequence.destroy(Sequence.findByTarget(this._container));
		Sequence.destroy(Sequence.findByTarget(this._fragmentsHighlight));

		let lMarkerAuras = this._markerAuras;
		if (lMarkerAuras)
		{
			Sequence.destroy(Sequence.findByTarget(lMarkerAuras));
			this._markerAuras = null;
		}
		this._markerAurasSeq = null;

		this._container = null;
		this._eyeBg = null;
		this._fragments = null;
		this._fragmentsHighlight = null;
		this._framentsContainer = null;

		this._fIsFlyOutStarted_bl = undefined;
		this._fIsScreenCovered_bl = undefined;

		super.destroy();
	}
}

export default StoneFragmentsView