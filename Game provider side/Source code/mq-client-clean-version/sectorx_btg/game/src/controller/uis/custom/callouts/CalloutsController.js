import SimpleUIController from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/uis/base/SimpleUIController';
import CalloutController from './CalloutController';
import CalloutsInfo from '../../../../model/uis/custom/callouts/CalloutsInfo';
import CalloutsView from '../../../../view/uis/custom/callouts/CalloutsView';
import TimesRunningOutController from './custom/TimesRunningOutController';
import CapsulesCalloutController from './custom/CapsulesCalloutController';
import EnragedBossCalloutController from './custom/EnragedBossCalloutController';
import ProfilingInfo from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/profiling/ProfilingInfo';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';


class CalloutsController extends SimpleUIController
{
	static get EVENT_CALLOUT_ACTIVATED() 			{ return CalloutController.EVENT_CALLOUT_ACTIVATED; }
	static get EVENT_CALLOUT_DEACTIVATED() 			{ return CalloutController.EVENT_CALLOUT_DEACTIVATED; }

	constructor()
	{
		super(new CalloutsInfo());

		this._calloutsControllers = null;
		this._fViewContainer_sprt = null;

		this._initCalloutsController();
	}

	initView(viewContainerInfo)
	{
		this._fViewContainer_sprt = viewContainerInfo.container;

		let view = new CalloutsView();
		this._fViewContainer_sprt.addChild(view);
		view.zIndex = viewContainerInfo.zIndex;

		super.initView(view);
	}
	
	get viewContainer()
	{
		return this._fViewContainer_sprt;
	}

	get timesRunningOutController()
	{
		return this._timesRunningOutController;
	}

	destroy()
	{
		this._calloutsControllers = null;

		super.destroy();
	}

	_initCalloutsController()
	{
		this._calloutsControllers = [];
	}

	__init ()
	{
		super.__init();
	}

	__initControlLevel ()
	{
		super.__initControlLevel();

		var info = this.info;
		var calloutsAmount = info.calloutsCount;
		for (var i = 0; i < calloutsAmount; i++)
		{
			var calloutController = this.__getCalloutController(i);
			calloutController.init();
		}
	}

	__initViewLevel ()
	{
		super.__initViewLevel();

		var view = this.__fView_uo;
		var calloutsAmount = this.info.calloutsCount;
		for (var i = 0; i < calloutsAmount; i++)
		{
			var calloutController = this.__getCalloutController(i);
			if (calloutController.isViewLevelSelfInitializationMode)
			{
				if (!calloutController.hasView)
				{
					calloutController.initViewLevelSelfInitializationViewProvider(view);
				}
			}
			else
			{
				calloutController.initView(view.getCalloutView(i));
			}
		}
	}

	__getCalloutController (calloutId)
	{
		return this._calloutsControllers[calloutId] || this._initCalloutController(calloutId);
	}

	_initCalloutController (calloutId)
	{
		var calloutController = this.__generateCalloutController(this.info.getCalloutInfo(calloutId));
		this._calloutsControllers[calloutId] = calloutController;

		calloutController.on(CalloutController.EVENT_CALLOUT_ACTIVATED, this._onCalloutActivated, this);
		calloutController.on(CalloutController.EVENT_CALLOUT_DEACTIVATED, this._onCalloutDeactivated, this);

		return calloutController;
	}

	__generateCalloutController (calloutInfo)
	{
		var calloutController;
		var calloutId = calloutInfo.calloutId;

		switch (calloutId)
		{
			case CalloutsInfo.CALLOUT_ID_CAPSULE_APPEARANCE:
				calloutController = new CapsulesCalloutController(calloutInfo, this);
				break;
			case CalloutsInfo.CALLOUT_ID_TIMES_RUNNING_OUT:
				calloutController = new TimesRunningOutController(calloutInfo, this);
				break;
			case CalloutsInfo.CALLOUT_ID_BOSS_IS_ENRAGED:
				calloutController = new EnragedBossCalloutController(calloutInfo, this);
				break;
			default:
				throw new Error(`Unsupported callout id: ${calloutId}`);
		}

		return calloutController;
	}

	_onCalloutActivated (aEvent_ue)
	{
		this._updateCalloutForPresentationSettings();
		this.view.moveCalloutsIfRequired(this.info.calloutIdsForPresentation);
		this.emit(aEvent_ue);
	}

	_onCalloutDeactivated (aEvent_ue)
	{
		this._removeDeactivatedCalloutsFromPresentList();
		this.emit(aEvent_ue);
	}

	_updateCalloutForPresentationSettings ()
	{
		let lActiveCallouts_int_arr = this._getActiveCalloutsIds();
		let lInfo_csi = this.info;

		if (!lActiveCallouts_int_arr)
		{
			lInfo_csi.calloutIdsForPresentation = undefined;
		}
	}

	_getActiveCalloutsIds ()
	{
		let lActiveCallouts_int_arr = this.info.calloutIdsForPresentation || [];
		let lCalloutsAmount_num = this.info.calloutsCount;
		for (let i = 1; i < lCalloutsAmount_num; i++) // let i = 1;... - to skip TimesRunningOut callout
		{
			let lCalloutController_cc = this.__getCalloutController(i);
			if (lCalloutController_cc.info.isActive)
			{
				if (lActiveCallouts_int_arr.indexOf(i) !== -1)
				{
					continue;
				}
				lActiveCallouts_int_arr.push(i);
			}
		}

		if (lActiveCallouts_int_arr.length > 0)
		{
			this.info.calloutIdsForPresentation = lActiveCallouts_int_arr;
			return lActiveCallouts_int_arr;
		}
	}

	_removeDeactivatedCalloutsFromPresentList ()
	{
		let lActiveCallouts_int_arr = this.info.calloutIdsForPresentation;
		let lCalloutsAmount_num = this.info.calloutsCount;

		for (let i = 0; i < lCalloutsAmount_num; i++)
		{
			let lCalloutController_cc = this.__getCalloutController(i);
			if (!lCalloutController_cc.info.isActive)
			{
				let lInActiveCalloutId_int = lCalloutController_cc.info.calloutId;
				let lInActiveCalloutIndex_int = lActiveCallouts_int_arr.indexOf(lInActiveCalloutId_int);
				lActiveCallouts_int_arr.splice(lInActiveCalloutIndex_int, 1);
			}
		}

		this.info.calloutIdsForPresentation = lActiveCallouts_int_arr;
	}

	get _timesRunningOutController()
	{
		return this.__getCalloutController(CalloutsInfo.CALLOUT_ID_TIMES_RUNNING_OUT);
	}
}

export default CalloutsController