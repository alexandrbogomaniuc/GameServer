import SimpleUIView from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/SimpleUIView';
import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import CalloutsInfo from '../../../../model/uis/custom/callouts/CalloutsInfo';
import CalloutView from './CalloutView';


class CalloutsView extends SimpleUIView
{
	constructor()
	{
		super();

		this.calloutsViews = null;

		this._initCalloutsView();
	}

	destroy()
	{
		this.calloutsViews = null;

		super.destroy();
	}

	get ogreCalloutView()
	{
		return this._ogreCalloutView;
	}

	get darkKnightCalloutView()
	{
		return this._darkKnightCalloutView;
	}

	get cerberusCalloutView()
	{
		return this._cerberusCalloutView;
	}

	get collectFragmentsView()
	{
		return this._collectFragmentsView;
	}

	get timesRunningOutView()
	{
		return this._timesRunningOutView;
	}

	getCalloutView (calloutId)
	{
		return this.__getCalloutView(calloutId);
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

	__generateCalloutView (calloutId)
	{
		var calloutView;
		switch (calloutId)
		{
			case CalloutsInfo.CALLOUT_ID_ORGE:
			case CalloutsInfo.CALLOUT_ID_DARK_KNIGHT:
			case CalloutsInfo.CALLOUT_ID_CERBERUS:
			case CalloutsInfo.CALLOUT_ID_TIMES_RUNNING_OUT:
			case CalloutsInfo.CALLOUT_ID_COLLECT_FRAGMENTS:
				calloutView = new CalloutView();
				break;
			default:
				throw new Error (`Unsupported callout id: ${calloutId}`);
		}
		return calloutView;
	}

	get _ogreCalloutView()
	{
		return this.__getCalloutView(CalloutsInfo.CALLOUT_ID_ORGE);
	}

	get _darkKnightCalloutView()
	{
		return this.__getCalloutView(CalloutsInfo.CALLOUT_ID_DARK_KNIGHT);
	}

	get _cerberusCalloutView()
	{
		return this.__getCalloutView(CalloutsInfo.CALLOUT_ID_CERBERUS);
	}

	get _collectFragmentsView()
	{
		return this.__getCalloutView(CalloutsInfo.CALLOUT_ID_COLLECT_FRAGMENTS);
	}

	get _timesRunningOutView()
	{
		return this.__getCalloutView(CalloutsInfo.CALLOUT_ID_TIMES_RUNNING_OUT);
	}

	destroy()
	{
		super.destroy();

		this.calloutsViews = null;
	}
}

export default CalloutsView;