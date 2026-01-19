import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import {MAX_FRAGMENTS_AMOUNT} from '../../../model/uis/dragonstones/FragmentsPanelInfo';
import FragmentItem from './FragmentItem';
import { FRAME_RATE } from '../../../../../shared/src/CommonConstants';
import { Sequence } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import { Utils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import StoneHandFragmentItem from './StoneHandFragmentItem';

const FRAGMENTS_DISTANCE = 18.5;

class StoneHandFragmentsView extends Sprite
{
	updateFragments(aFragmentsAmount_num)
	{
		for (let i=1; i<=MAX_FRAGMENTS_AMOUNT; i++)
		{
			if (i <= aFragmentsAmount_num)
			{
				this._setFragmentMode(i, StoneHandFragmentItem.FRAGMENT_MODES.COLLECTED);
			}
			else
			{
				this._setFragmentMode(i, StoneHandFragmentItem.FRAGMENT_MODES.EMPTY);
			}
			
		}
	}

	addFragment(aFragmentId_num, aIsLastStoneFragment_bl=false)
	{
		this._setFragmentMode(aFragmentId_num, StoneHandFragmentItem.FRAGMENT_MODES.COLLECTED, true, aIsLastStoneFragment_bl);
	}

	interruptAnimation()
	{
		this._interruptAnimation();
	}

	getFragmentGlobalPosition(aFragmentId_num)
	{
		let lFragment_sprt = this._getFragmentById(aFragmentId_num);

		return lFragment_sprt.parent.localToGlobal(lFragment_sprt.x, lFragment_sprt.y);
	}

	startFragmentLandingAnimation(aLandedFragmentId_num, aIsLastStoneFragment_bl = false)
	{
		this._startFragmentLandingAnimation(aLandedFragmentId_num, aIsLastStoneFragment_bl);
	}

	constructor()
	{
		super();

		this._fragments = [];
		this._container = null;
		
		FragmentItem.initTextures();

		this._initView();
	}

	_initView()
	{
		this._container = this.addChild(new Sprite);

		for (let i=1; i<=MAX_FRAGMENTS_AMOUNT; i++)
		{
			this._initFragment(i);
		}
	}

	_initFragment(fragmentId)
	{
		let lFragment = this._container.addChild(new StoneHandFragmentItem(fragmentId));

		lFragment.y = -FRAGMENTS_DISTANCE * (fragmentId-1);

		this._fragments.push(lFragment);

		this._setFragmentMode(fragmentId, StoneHandFragmentItem.FRAGMENT_MODES.EMPTY);
	}

	_setFragmentMode(fragmentId, mode, aUseAnimation_bl=false, aIsLastStoneFragment_bl=false)
	{
		let lFragment_sprt = this._getFragmentById(fragmentId);
		lFragment_sprt.updateMode(mode, aUseAnimation_bl, aIsLastStoneFragment_bl);
	}

	_getFragmentById(fragmentId)
	{
		return this._fragments[fragmentId-1];
	}

	_interruptAnimation()
	{
		for (let i=1; i<=MAX_FRAGMENTS_AMOUNT; i++)
		{
			let lFragment_sprt = this._getFragmentById(i);
			lFragment_sprt.interruptAnimations();
		}
	}

	_startFragmentLandingAnimation(aLandedFragmentId_num, aIsLastStoneFragment_bl)
	{
		for (let i=1; i<=MAX_FRAGMENTS_AMOUNT; i++)
		{
			let lFragment_sprt = this._getFragmentById(i);
			lFragment_sprt.startFragmentLandingAnimation(aLandedFragmentId_num, aIsLastStoneFragment_bl);
		}
	}

	destroy()
	{
		this._container = null;
		this._fragments = null;

		super.destroy();
	}
}

export default StoneHandFragmentsView