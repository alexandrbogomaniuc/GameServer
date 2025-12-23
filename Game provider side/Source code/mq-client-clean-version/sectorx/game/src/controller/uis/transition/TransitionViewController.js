import SimpleUIController from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/uis/base/SimpleUIController';
import TransitionView from '../../../view/uis/transition/TransitionView';
import TransitionViewInfo from '../../../model/uis/transition/TransitionViewInfo';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import GameStateController from '../../state/GameStateController';
import { ROUND_STATE } from '../../../model/state/GameStateInfo';
import GameFieldController from '../../../controller/uis/game_field/GameFieldController';
import GameWebSocketInteractionController from '../../interaction/server/GameWebSocketInteractionController';
import { SERVER_MESSAGES } from '../../../model/interaction/server/GameWebSocketInteractionInfo';
import GameScreen from '../../../main/GameScreen';
import TransitionRoundEndController from './TransitionRoundEndController';

class TransitionViewController extends SimpleUIController
{
	static get EVENT_ON_TRANSITION_INTRO_COMPLETED() { return "EVENT_ON_TRANSITION_INTRO_COMPLETED"; }

	constructor()
	{
		super (new TransitionViewInfo(), new TransitionView());
		this._fTransitionRoundEndController_trec = null;
	}

	__initControlLevel()
	{
		super.__initControlLevel();

		if (!this.info.isFeatureActive)
		{
			return;
		}

		this._initTransitionRoundEndController();

		this.__fGameScreen_gs = APP.gameScreen;
		this.__fGameScreen_gs.on(GameScreen.EVENT_ON_ROOM_UNPAUSED, this.__onRoomUnpaused, this);
		this.__fGameScreen_gs.on(GameScreen.EVENT_ON_ROOM_PAUSED, this.__onRoomPaused, this);
		
		this.__fGameScreen_gs.on(GameScreen.EVENT_ON_CLOSE_ROOM, this._onCloseRoom, this);

		this._fGameFieldController_gfc = this.__fGameScreen_gs.gameFieldController;
		this._fGameFieldController_gfc.on(GameFieldController.EVENT_ON_GAME_FIELD_SCREEN_CREATED, this.__onGameFieldScreenCreated, this);
		this._fGameFieldController_gfc.on(GameFieldController.EVENT_ON_ROOM_FIELD_CLEARED, this.__onRoomFieldCleared, this);
		this._fGameFieldController_gfc.on(GameFieldController.EVENT_ON_ROUND_STATE_CHANGED, this._onRoundStateChanged, this);
		
		this.__fGameStateController_gsc = this.__fGameScreen_gs.gameStateController;
		this.__fGameStateController_gsc.on(GameStateController.EVENT_ON_SUBROUND_STATE_CHANGED, this._onSubroundStateChanged, this);

		// window.addEventListener("keydown", this.keyDownHandler.bind(this), false);
	}

	__initViewLevel()
	{
		super.__initViewLevel();
		this.view.on(TransitionView.EVENT_ON_TRANSITION_INTRO_COMPLETED, this.__onTransitionIntroCompleted, this);
	}

	startListenForRoundEnd()
	{
		this._fGameFieldController_gfc.once(GameFieldController.EVENT_ON_NEW_ROUND_STATE, this.__onAllRoundAnimationsCompleted, this);
	}

	//TRANSITION ROUND END...
	get transitionRoundEndController()
	{
		return this._fTransitionRoundEndController_trec || (this._fTransitionRoundEndController_trec = this._initTransitionRoundEndController());
	}

	_initTransitionRoundEndController()
	{
		if (this._fTransitionRoundEndController_trec)
		{
			return;
		}

		let l_trec = this._fTransitionRoundEndController_trec = new TransitionRoundEndController();
		l_trec.on(TransitionRoundEndController.EVENT_ON_TRANSITION_INTRO_COMPLETED, this._onRoundEndIntroCompleted, this);
		l_trec.on(TransitionRoundEndController.EVENT_ON_TRANSITION_OUTRO_COMPLETED, this._onRoundEndOutroCompleted, this);
		
		l_trec.init();
		return l_trec;
	}

	_onRoundEndIntroCompleted()
	{
		this.__setNewState(TransitionViewInfo.TRANSITION_VIEW_STATE_ID_LOOP_NEW_FOG);
	}

	_onRoundEndOutroCompleted()
	{
		this.__setNewState(TransitionViewInfo.TRANSITION_VIEW_STATE_ID_INVALID);
	}
	//...TRANSITION ROUND END

	__setNewState(aStateId_int)
	{
		if (!this.__checkIsNewStateInappropriate(aStateId_int))
		{
			switch (aStateId_int)
			{
				case TransitionViewInfo.TRANSITION_VIEW_STATE_ID_INVALID:
						this.view.setInvalidState();
						this.transitionRoundEndController.setInvalidState();
					break;
				case TransitionViewInfo.TRANSITION_VIEW_STATE_ID_INTRO:
						this.view.setIntroState();
					break;
				case TransitionViewInfo.TRANSITION_VIEW_STATE_ID_THICKEN:
						this.view.setThickenState();
					break;
				case TransitionViewInfo.TRANSITION_VIEW_STATE_ID_LOOP:
						this.view.setLoopState();
					break;
				case TransitionViewInfo.TRANSITION_VIEW_STATE_ID_OUTRO:
						this.view.setOutroState();
					break;
				case TransitionViewInfo.TRANSITION_VIEW_STATE_ID_INTRO_NEW_FOG:
					this.transitionRoundEndController.setIntroState();
					break;
				case TransitionViewInfo.TRANSITION_VIEW_STATE_ID_LOOP_NEW_FOG:
					this.transitionRoundEndController.setLoopState();
					break;
				case TransitionViewInfo.TRANSITION_VIEW_STATE_ID_OUTRO_NEW_FOG:
					this.transitionRoundEndController.setOutroState();
					break;
			}

			this.info.stateId = aStateId_int;
		}
	}

	__checkIsNewStateInappropriate(aStateId_int)
	{
		return 	this.info.stateId === aStateId_int ||
				this.info.isThickenState && aStateId_int === TransitionViewInfo.TRANSITION_VIEW_STATE_ID_LOOP ||
				this.info.isInvalidState && aStateId_int === TransitionViewInfo.TRANSITION_VIEW_STATE_ID_OUTRO ||
				this.info.isLoopState && aStateId_int === TransitionViewInfo.TRANSITION_VIEW_STATE_ID_INTRO ||
				this.info.isIntroNewFogState && aStateId_int === TransitionViewInfo.TRANSITION_VIEW_STATE_ID_INTRO_NEW_FOG ||
				this.info.isLoopNewFogState && aStateId_int === TransitionViewInfo.TRANSITION_VIEW_STATE_ID_INTRO_NEW_FOG ||
				this.info.isInvalidState && aStateId_int === TransitionViewInfo.TRANSITION_VIEW_STATE_ID_OUTRO_NEW_FOG ||
				APP.gameScreen.isPaused && aStateId_int != TransitionViewInfo.TRANSITION_VIEW_STATE_ID_INVALID;
	}

	__onQualifyRoundState()
	{
		if (this.__fGameScreen_gs.isPaused)
		{
			return;
		}

		if (this.info.isPlayStateWas)
		{
			if (APP.gameScreen.gameFieldController.roundResultScreenController.info.roundResultResponseRecieved)
			{
				if (!APP.gameScreen.gameFieldController.isAnyAnimationInProgress)
				{
					this.__setNewState(TransitionViewInfo.TRANSITION_VIEW_STATE_ID_INTRO_NEW_FOG);
				}
			}
			else
			{
				this.__setNewState(TransitionViewInfo.TRANSITION_VIEW_STATE_ID_LOOP_NEW_FOG);
			}
		}
		else
		{
			this.__setNewState(TransitionViewInfo.TRANSITION_VIEW_STATE_ID_LOOP);
		}
	}

	__onWaitRoundState()
	{
		if (
			 this.info.isPlayStateWas
			)
		{
			if (!this.info.isIntroNewFogState
				&& !this.info.isLoopNewFogState)
			{
				this.__setNewState(TransitionViewInfo.TRANSITION_VIEW_STATE_ID_LOOP_NEW_FOG);
			}
		}
		else
		{
			if (this.info.isLoopNewFogState || this.info.isIntroNewFogState)
			{
				APP.logger.i_pushWarning(`Transition. Invalid smoke state for PLAY round state: ${this.info.stateId}.`);
				this.__setNewState(TransitionViewInfo.TRANSITION_VIEW_STATE_ID_INVALID);
			}

			this.__setNewState(TransitionViewInfo.TRANSITION_VIEW_STATE_ID_LOOP);
		}
	}

	__onPlayRoundState()
	{
		let lView_tw = this.view;

		if (lView_tw.stateId == TransitionView.TRANSITION_VIEW_STATE_ID_INTRO || lView_tw.stateId == TransitionView.TRANSITION_VIEW_STATE_ID_THICKEN)
		{
			APP.logger.i_pushWarning(`Transition. Invalid smoke state for PLAY round state: ${lView_tw.stateId}.`);
		}

		if (this.info.isInvalidState)
		{
			lView_tw.drop();
		}
		else
		{
			if (this.info.isLoopNewFogState || this.info.isIntroNewFogState )
			{
				this.__setNewState(TransitionViewInfo.TRANSITION_VIEW_STATE_ID_OUTRO_NEW_FOG);
			}
			else if (!this.info.isInvalidState)
			{
				this.__setNewState(TransitionViewInfo.TRANSITION_VIEW_STATE_ID_OUTRO);
			}
		}
	}

	__onTransitionIntroCompleted()
	{
		this.emit(TransitionViewController.EVENT_ON_TRANSITION_INTRO_COMPLETED);
	}



	__onRoomUnpaused()
	{
		 this.__validateRoundState(this.__fGameStateController_gsc.info.gameState, null, true);
	}

	__onRoomPaused()
	{
		this.__setNewState(TransitionViewInfo.TRANSITION_VIEW_STATE_ID_INVALID);
	}

	_onCloseRoom()
	{
		this.info.isPlayStateWas = false;
	}

	__onGameFieldScreenCreated()
	{
		this.view.initOnScreen(APP.currentWindow.gameFieldController.transitionViewContainerInfo);
		APP.webSocketInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_MESSAGE, this.__onServerMessage, this);

		this.transitionRoundEndController.i_onGameFieldScreenCreated();
	}

	__onRoomFieldCleared(aEvent_obj)
	{
		if (!aEvent_obj.keepPlayersOnScreen)
		{
			if (this.__fGameScreen_gs.isPaused)
			{
				this.__setNewState(TransitionViewInfo.TRANSITION_VIEW_STATE_ID_INVALID);
			}
			else if (this.info.isIntroNewFogState || this.info.isLoopNewFogState)
			{
				this.__setNewState(TransitionViewInfo.TRANSITION_VIEW_STATE_ID_OUTRO_NEW_FOG);
			}
			else if (this.info.isPlayStateWas && (this.info.isIntroState || this.info.isOutroState))
			{
				this.__setNewState(TransitionViewInfo.TRANSITION_VIEW_STATE_ID_THICKEN);
			}
		}

		this._fGameFieldController_gfc.off(GameFieldController.EVENT_ON_NEW_ROUND_STATE, this.__onAllRoundAnimationsCompleted, this)
	}

	__onServerMessage(aEvent_obj)
	{
		let lData_obj = aEvent_obj.messageData;
		switch(lData_obj.class)
		{
			case SERVER_MESSAGES.GET_ROOM_INFO_RESPONSE:
			case SERVER_MESSAGES.FULL_GAME_INFO:
				this.__validateRoundState(lData_obj.state, lData_obj.endTime, true);
				break;
		}
	}

	__onAllRoundAnimationsCompleted(e)
	{
		if (!e.state)
		{
			if (this.info.isPlayStateWas)
			{
				this.__setNewState(TransitionViewInfo.TRANSITION_VIEW_STATE_ID_INTRO_NEW_FOG);
			}
			else
			{
				this.__setNewState(TransitionViewInfo.TRANSITION_VIEW_STATE_ID_THICKEN);
			}
		}
	}

	__validateRoundState(aState_str, aOptRoundEndTime_num, aLastHand_bl)
	{
		if (!aState_str)
		{
			aState_str = this.__fGameStateController_gsc.info.gameState;
		}

		if (!aOptRoundEndTime_num)
		{
			aOptRoundEndTime_num = this.__fGameStateController_gsc.info.roundEndTime;
		}

		switch (aState_str)
		{
			case ROUND_STATE.QUALIFY:
				this.__onQualifyRoundState();
				break;
			case ROUND_STATE.WAIT:
				this.__onWaitRoundState();
				break;
			case ROUND_STATE.PLAY:
				this.__onPlayRoundState();
				break;
		}
	}

	_onSubroundStateChanged()
	{
		if (this.__fGameStateController_gsc.info.isBossSubround)
		{
			if (!this.info.isOutroState)
			{
				this.__setNewState(TransitionViewInfo.TRANSITION_VIEW_STATE_ID_INVALID);
			}
		}
	}

	_onRoundStateChanged(e)
	{
		if (this.__fGameStateController_gsc.info.isPlayState)
		{
			this.info.isPlayStateWas = true;
		}

		this.__validateRoundState(e.newState, null);
	}

	destroy()
	{
		this.__fGameScreen_gs.off(GameScreen.EVENT_ON_ROOM_UNPAUSED, this.__onRoomUnpaused, this);
		this.__fGameScreen_gs = null;

		if (this._fGameFieldController_gfc)
		{
			this._fGameFieldController_gfc.off(GameFieldController.EVENT_ON_GAME_FIELD_SCREEN_CREATED, this.__onGameFieldScreenCreated, this);
			this._fGameFieldController_gfc.off(GameFieldController.EVENT_ON_ROOM_FIELD_CLEARED, this.__onRoomFieldCleared, this);
			this._fGameFieldController_gfc.off(GameFieldController.EVENT_ON_NEW_ROUND_STATE, this.__onAllRoundAnimationsCompleted, this, true);
			this._fGameFieldController_gfc = null;
		}

		if (this.__fGameStateController_gsc)
		{
			this.__fGameStateController_gsc.off(GameStateController.EVENT_ON_SUBROUND_STATE_CHANGED, this._onSubroundStateChanged, this);
			this.__fGameStateController_gsc = null;
		}

		super.destroy();
	}

	/*
	//DEBUG...
	keyDownHandler(e)
	{
		switch(e.keyCode)
		{
			case 49:
				this.__setNewState(TransitionViewInfo.TRANSITION_VIEW_STATE_ID_INTRO);
				break;
			case 50:
				this.__setNewState(TransitionViewInfo.TRANSITION_VIEW_STATE_ID_LOOP);
				break;
			case 51:
				this.__setNewState(TransitionViewInfo.TRANSITION_VIEW_STATE_ID_OUTRO);
				break;
			case 52:
				this.__setNewState(TransitionViewInfo.TRANSITION_VIEW_STATE_ID_THICKEN);
				break;
		}
	}
	//...DEBUG
	*/
}

export default TransitionViewController;