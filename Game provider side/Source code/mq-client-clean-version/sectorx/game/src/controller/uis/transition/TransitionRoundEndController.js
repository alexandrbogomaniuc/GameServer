import SimpleUIController from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/uis/base/SimpleUIController';
import TransitionRoundEndView from '../../../view/uis/transition/TransitionRoundEndView';
import TransitionRoundEndInfo from '../../../model/uis/transition/TransitionRoundEndInfo';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';

class TransitionRoundEndController extends SimpleUIController
{
	static get EVENT_ON_TRANSITION_INTRO_COMPLETED() { return TransitionRoundEndView.EVENT_ON_TRANSITION_INTRO_COMPLETED; }
	static get EVENT_ON_TRANSITION_OUTRO_COMPLETED() { return TransitionRoundEndView.EVENT_ON_TRANSITION_OUTRO_COMPLETED; }

	constructor()
	{
		super (new TransitionRoundEndInfo(), new TransitionRoundEndView());
		this._fTimer_t = null;
	}

	i_onGameFieldScreenCreated()
	{
		this.view.initOnScreen(APP.currentWindow.gameFieldController.transitionRouneEndContainerInfo);
	}

	setInvalidState()
	{
		this.__setNewState(TransitionRoundEndInfo.TRANSITION_VIEW_STATE_ID_INVALID);
	}

	setIntroState()
	{
		this.__setNewState(TransitionRoundEndInfo.TRANSITION_VIEW_STATE_ID_INTRO);
	}

	setLoopState()
	{
		this.__setNewState(TransitionRoundEndInfo.TRANSITION_VIEW_STATE_ID_LOOP);
	}

	setOutroState()
	{
		this.__setNewState(TransitionRoundEndInfo.TRANSITION_VIEW_STATE_ID_OUTRO);
	}

	__initControlLevel()
	{
		super.__initControlLevel();
	}

	__initViewLevel()
	{
		super.__initViewLevel();
		this.view.on(TransitionRoundEndView.EVENT_ON_TRANSITION_INTRO_COMPLETED, this.emit, this);
		this.view.on(TransitionRoundEndView.EVENT_ON_TRANSITION_OUTRO_COMPLETED, this.emit, this);
	}

	__setNewState(aStateId_int)
	{
		this.info.stateId = aStateId_int;

		switch (aStateId_int)
			{
				case TransitionRoundEndInfo.TRANSITION_VIEW_STATE_ID_INVALID:
					this.view.setInvalidState();
					break;
				case TransitionRoundEndInfo.TRANSITION_VIEW_STATE_ID_INTRO:
					this.view.setIntroState();
					break;
				case TransitionRoundEndInfo.TRANSITION_VIEW_STATE_ID_LOOP:
					this.view.setLoopState();
					break;
				case TransitionRoundEndInfo.TRANSITION_VIEW_STATE_ID_OUTRO:
					this.view.setOutroState();
					break;
			}

	}

	destroy()
	{
		super.destroy();
	}
}

export default TransitionRoundEndController;