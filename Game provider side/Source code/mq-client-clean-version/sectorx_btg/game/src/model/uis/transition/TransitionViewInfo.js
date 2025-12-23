import SimpleUIInfo from '../../../../../../common/PIXI/src/dgphoenix/unified/model/uis/SimpleUIInfo';

class TransitionViewInfo extends SimpleUIInfo
{
	static get TRANSITION_VIEW_STATE_ID_INVALID() { return -1; }
	static get TRANSITION_VIEW_STATE_ID_INTRO() { return 0; }
	static get TRANSITION_VIEW_STATE_ID_THICKEN() { return 1; }
	static get TRANSITION_VIEW_STATE_ID_LOOP() 	{ return 2; }
	static get TRANSITION_VIEW_STATE_ID_OUTRO() { return 3; }

	constructor()
	{
		super();

		this._fStateId_int = null;
	}

	set stateId(aStateId_int)
	{
		this._fStateId_int = aStateId_int;
	}
	
	get stateId()
	{
		return this._fStateId_int;
	}

	get isInvalidState()
	{
		return this._fStateId_int === TransitionViewInfo.TRANSITION_VIEW_STATE_ID_INVALID;
	}

	get isIntroState()
	{
		return this._fStateId_int === TransitionViewInfo.TRANSITION_VIEW_STATE_ID_INTRO;
	}

	get isThickenState()
	{
		return this._fStateId_int === TransitionViewInfo.TRANSITION_VIEW_STATE_ID_THICKEN;
	}

	get isLoopState()
	{
		return this._fStateId_int === TransitionViewInfo.TRANSITION_VIEW_STATE_ID_LOOP;
	}

	get isOutroState()
	{
		return this._fStateId_int === TransitionViewInfo.TRANSITION_VIEW_STATE_ID_OUTRO;
	}

	get isFeatureActive()
	{
		return true;
	}

	destroy()
	{
		this._fStateId_int = null;

		super.destroy();
	}
}

export default TransitionViewInfo;