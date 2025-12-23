import SimpleUIView from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/SimpleUIView';
import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import CalloutsInfo from '../../../../model/uis/custom/callouts/CalloutsInfo';
import CalloutView from './CalloutView';
import CapsuleCalloutView from './custom/CapsuleCalloutView';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';


class CalloutsView extends SimpleUIView
{
	constructor()
	{
		super();

		this.calloutsViews = null;
		this._fCalloutsPossiblePositions_arr = [];

		if (APP.isBattlegroundGame)
		{
			this.position.y = 40;
		}

		this._initCalloutsView();
	}

	destroy()
	{
		this.calloutsViews = null;

		super.destroy();
	}

	get capsuleCalloutView()
	{
		return this._capsuleCalloutView;
	}

	get enragedBossCalloutView()
	{
		return this._enragedBossCalloutView;
	}

	get timesRunningOutView()
	{
		return this._timesRunningOutView;
	}

	getCalloutView (calloutId)
	{
		return this.__getCalloutView(calloutId);
	}

	moveCalloutsIfRequired(aCalloutIds_arr)
	{
		let l_csi = this.uiInfo;

		for (let calloutId of aCalloutIds_arr)
		{
			if (l_csi.getCalloutInfo(calloutId).isPresented || calloutId === l_csi.CALLOUT_ID_TIMES_RUNNING_OUT)
			{
				continue;
			}
			this._moveCalloutifRequired(calloutId);
		}
	}

	_moveCalloutifRequired(aCalloutId_int)
	{
		let lCalloutYPos_num = this._getFreeCalloutsYPositions()[0];
		let lCalloutView_cv = this.__getCalloutView(aCalloutId_int);

		lCalloutView_cv.position.y = lCalloutYPos_num;
	}

	_initCalloutsView()
	{
		this.calloutsViews = [];
	}

	__getCalloutView (calloutId)
	{
		return this.calloutsViews[calloutId] || this._initCalloutView(calloutId);
	}

	_initCalloutView (calloutId)
	{
		var calloutView = this.__generateCalloutView(calloutId);

		this.calloutsViews[calloutId] = calloutView;
		this.addChild(calloutView);

		return calloutView;
	}

	//CALLOUT Y OFFSET...
	_getCalloutsPossiblePositions()
	{
		if (this._fCalloutsPossiblePositions_arr.length > 0)
		{
			return this._fCalloutsPossiblePositions_arr;
		}
		else
		{
			return this._generateCalloutsPossiblePositions();
		}
	}

	_generateCalloutsPossiblePositions()
	{
		let lCalloutsCount_num = this.uiInfo.calloutsCount - 1; // - 1;... - to skip TimesRunningOut callout
		let lAnyCapsuleHeight_num = this._capsuleCalloutView.panelHeight;

		let lCapsulesPos_arr = [];

		for (let i = 0; i < lCalloutsCount_num; i++)
		{
			lCapsulesPos_arr.push(i * lAnyCapsuleHeight_num);
		}

		this._fCalloutsPossiblePositions_arr = lCapsulesPos_arr;

		return lCapsulesPos_arr;
	}

	_getCalloutsOccupiedPositions()
	{
		let lCalloutsCount_num = this.uiInfo.calloutsCount;
		let lCalloutsOccupied_arr = [];

		for (let i  = 0; i < lCalloutsCount_num; i++)
		{
			let l_cv = this.calloutsViews[i]
			if (l_cv && this.uiInfo.getCalloutInfo(i).isPresented)
			{
				lCalloutsOccupied_arr.push(l_cv.position.y);
			}
		}

		return lCalloutsOccupied_arr;
	}

	_getFreeCalloutsYPositions()
	{
		let lPossible_arr = this._getCalloutsPossiblePositions();
		let lOccupied_arr = this._getCalloutsOccupiedPositions();
		let lFree_arr = [];

		for (let i = 0; i < lPossible_arr.length; i++)
		{
			let lIsFree_bi = true;
			for (let j = 0; j < lOccupied_arr.length; j++)
			{
				if (lPossible_arr[i] === lOccupied_arr[j])
				{
					lIsFree_bi = false;
					break;
				}
			}

			if (lIsFree_bi)
			{
				lFree_arr.push(lPossible_arr[i]);
			}
		}
		return lFree_arr;
	}
	//...CALCULATE Y OFFSET

	__generateCalloutView (calloutId)
	{
		var calloutView;
		switch (calloutId)
		{
			case CalloutsInfo.CALLOUT_ID_TIMES_RUNNING_OUT:
			case CalloutsInfo.CALLOUT_ID_BOSS_IS_ENRAGED:
				calloutView = new CalloutView();
				break;
			case CalloutsInfo.CALLOUT_ID_CAPSULE_APPEARANCE:
				calloutView = new CapsuleCalloutView();
				break;
			default:
				throw new Error (`Unsupported callout id: ${calloutId}`);
		}
		return calloutView;
	}

	get _capsuleCalloutView()
	{
		return this.__getCalloutView(CalloutsInfo.CALLOUT_ID_CAPSULE_APPEARANCE);
	}

	get _enragedBossCalloutView()
	{
		return this.__getCalloutView(CalloutsInfo.CALLOUT_ID_BOSS_IS_ENRAGED);
	}

	get _timesRunningOutView()
	{
		return this.__getCalloutView(CalloutsInfo.CALLOUT_ID_TIMES_RUNNING_OUT);
	}
}

export default CalloutsView;