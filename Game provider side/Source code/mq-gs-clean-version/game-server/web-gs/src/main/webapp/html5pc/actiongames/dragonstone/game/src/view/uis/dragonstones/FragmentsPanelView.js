import SimpleUIView from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/SimpleUIView';
import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import {MAX_FRAGMENTS_AMOUNT} from '../../../model/uis/dragonstones/FragmentsPanelInfo';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../shared/src/CommonConstants';
import { Sequence } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import { Utils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import BloodStone from './BloodStone';
import * as Easing from '../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';

class FragmentsPanelView extends SimpleUIView
{
	static get EVENT_ON_UPDATE_ANIMATION_COMPLETED()		{return 'EVENT_ON_UPDATE_ANIMATION_COMPLETED';}
	static get EVENT_ON_UPDATE_ANIMATION_INTERRUPTED()		{return 'EVENT_ON_UPDATE_ANIMATION_INTERRUPTED';}
	static get EVENT_ON_STONE_FLY_OUT_STARTED()			{return BloodStone.EVENT_ON_STONE_FLY_OUT_STARTED;}
	static get EVENT_ON_STONE_SCREEN_COVERED()				{return BloodStone.EVENT_ON_STONE_SCREEN_COVERED;}

	update(aSkipAnimation_bln)
	{
		this._update(aSkipAnimation_bln);
	}

	interruptAnimations()
	{
		this._interruptAnimations();
	}

	updatePanelMode(aIsBossMode_bl)
	{
		this._updatePanelMode(aIsBossMode_bl);
	}

	validatePanelVisibility(aIsForceHide_bl = false)
	{
		this._validatePanelVisibility(aIsForceHide_bl);
	}

	get isAnimationInProgress()
	{
		return this._bloodStone.isAnimationInProgress;
	}

	get isStoneFlyOutStarted()
	{
		return this._bloodStone.isStoneFlyOutStarted;
	}

	get isScreenCovered()
	{
		return this._bloodStone.isScreenCovered;
	}

	getFragmentLandingGlobalPosition(aFragmentId_num)
	{
		return this._bloodStone.getHandFragmentGlobalPosition(aFragmentId_num);
	}

	constructor()
	{
		super();

		this._bloodStone = null;

		this._init();

		// DEBUG...
		// window.addEventListener("keydown", this.keyDownHandler.bind(this), false);
		// ...DEBUG
	}

	//DEBUG...
	// keyDownHandler(keyCode)
	// {
	// 	if (keyCode.keyCode == 16)
	// 	{
	// 	}
	// }
	//...DEBUG

	_init()
	{
		let lStone = this._bloodStone = this.addChild(new BloodStone());
		lStone.on(BloodStone.EVENT_ON_STONE_LANDING_ANIMATION_COMPLETED, this._onStoneLandingAnimationCompleted, this);
		lStone.on(BloodStone.EVENT_ON_STONE_FLY_OUT_STARTED, this._onStoneFlyOutStarted, this);
		lStone.on(BloodStone.EVENT_ON_STONE_SCREEN_COVERED, this.emit, this);
		lStone.y = -112;
		lStone.zIndex = 1;
	}

	get _profilingInfo()
	{
		return APP.profilingController.info;
	}

	_update(aSkipAnimation_bln = false)
	{
		if (aSkipAnimation_bln)
		{
			this._bloodStone.updateFragments(this.uiInfo.fragmentsAmount);
		}
		else
		{
			this._bloodStone.startFragmentLandingAnimation(this.uiInfo.lastLandedFragment, this.uiInfo.fragmentsAmount === MAX_FRAGMENTS_AMOUNT);
		}
	}

	_updatePanelMode(aIsBossMode_bl = false)
	{
		this._validatePanelVisibility(aIsBossMode_bl);
	}

	_interruptAnimations()
	{
		Sequence.destroy(Sequence.findByTarget(this));

		this._bloodStone.interruptAnimation();

		this.emit(FragmentsPanelView.EVENT_ON_UPDATE_ANIMATION_INTERRUPTED);
	}
	
	_tryToCompleteUpdateAnimation()
	{
		if (!this.isAnimationInProgress)
		{
			this._onUpdateAnimationCompleted();
		}
	}

	_onStoneLandingAnimationCompleted()
	{	
		this._validatePanelVisibility();

		this._tryToCompleteUpdateAnimation();
	}

	_onStoneFlyOutStarted(event)
	{
		this.emit(FragmentsPanelView.EVENT_ON_STONE_FLY_OUT_STARTED);
	}

	_onUpdateAnimationCompleted()
	{
		this.emit(FragmentsPanelView.EVENT_ON_UPDATE_ANIMATION_COMPLETED);
	}

	_validatePanelVisibility(aIsForceHide_bl = false)
	{
		if (aIsForceHide_bl)
		{
			this.visible = false;
			return;
		}
		
		this.visible = !(this.uiInfo.fragmentsAmount === MAX_FRAGMENTS_AMOUNT) && !this.uiInfo.isNeedHidePanel && !this.uiInfo.isHourglassShowed;
	}

	destroy()
	{
		this._bloodStone = null;

		super.destroy();
	}
}

export default FragmentsPanelView;