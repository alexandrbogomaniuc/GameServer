import SimpleUIController from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/uis/base/SimpleUIController';
import CalloutView from '../../../../view/uis/custom/callouts/CalloutView';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import GameScreen from '../../../../main/GameScreen';

class CalloutController extends SimpleUIController
{
	static get EVENT_CALLOUT_ACTIVATED () { return 'onCalloutActivated'; }
	static get EVENT_CALLOUT_DEACTIVATED () { return 'onCalloutDeactivated'; }
	
	constructor(aOptInfo_usuii, aOptView_uo, aOptParentController_usc)
	{
		super(aOptInfo_usuii, aOptView_uo, aOptParentController_usc);

		this._calloutsController = null;
		this._calloutsInfo = null;
	}

	__init ()
	{
		this._calloutsController = this.__getParentController();
		this._calloutsInfo = this._calloutsController.info;
		
		super.__init();

		this.__validate();
	}

	__initViewLevel ()
	{
		super.__initViewLevel();

		this.view.on(CalloutView.EVENT_ON_CALLOUT_HIDDEN, this.__onCalloutHidden, this);
		this.view.on(CalloutView.EVENT_ON_PRESENTATION_ENDED, this.__onPresentationEnded, this);

		this.__validateViewLevel();
	}

	__initControlLevel ()
	{
		super.__initControlLevel();

		APP.gameScreen.on(GameScreen.EVENT_ON_ROOM_FIELD_CLEARED, this.__onRoomFieldCleared, this);
	}

	__initViewLevelSelfInitialization ()
	{

	}

	__isViewLevelSelfInitializationAllowed ()
	{
		return true;
	}

	//VALIDATION...
	__validateModelLevel ()
	{
		super.__validateModelLevel();
		
		this._validatePresentationState();

		this.info.visible = this.info.isPresented;
	}

	__validate()
	{
		super.__validate();
	}
	//...VALIDATION

	__onViewLevelSelfInitializationViewProviderAccessible()
	{
		super.__onViewLevelSelfInitializationViewProviderAccessible();
		if (this.info.isPresented)
		{
			this.__forceViewLevelSelfInitialization();
		}
	}

	_validatePresentationState()
	{
		var info = this.info;
		this._updateCalloutPresentedState(info.isActive)
	}

	_updateCalloutPresentedState(aPresented_bl)
	{
		aPresented_bl = Boolean(aPresented_bl);
		var info = this.info;
		if (info.isPresented === aPresented_bl)
		{
			return;
		}

		info.isPresented = aPresented_bl;
		if (aPresented_bl)
		{
			if (!this.__fView_uo && this.__isViewLevelSelfInitializationViewProviderAccessible())
			{
				this.__forceViewLevelSelfInitialization();
			}

			APP.soundsController.play(this.info.soundName);
			this._startCallout();
		}
	}

	__onCalloutHidden()
	{
		this.__deactivateCallout();
	}

	__onPresentationEnded()
	{
		this.__deactivateCallout();
	}

	//CALLOUT ACTIVATION...
	__activateCallout()
	{
		if (APP.gameScreen.isPaused)
		{
			return;
		}

		this.__setActiveState(true);
		this.__validate();
	}

	__deactivateCallout ()
	{
		this.__setActiveState(false);
		this.__validate();
	}

	__setActiveState (aActive_bl)
	{
		aActive_bl = Boolean(aActive_bl);

		var info = this.info;
		if (info.isActive === aActive_bl)
		{
			return;
		}

		info.isActive = aActive_bl;

		if (aActive_bl)
		{
			this.emit(CalloutController.EVENT_CALLOUT_ACTIVATED, {calloutId: info.calloutId});
		}
		else
		{
			this.emit(CalloutController.EVENT_CALLOUT_DEACTIVATED, {calloutId: info.calloutId});
		}
	}	
	//...CALLOUT ACTIVATION

	__onRoomFieldCleared()
	{
		this.__deactivateCallout();
		this.view && this.view.i_interruptAnimations();
	}
}

export default CalloutController