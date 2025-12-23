import TransitionViewController from './TransitionViewController';
import TransitionView from '../../../view/uis/transition/TransitionView';
import BTGTransitionViewInfo from '../../../model/uis/transition/BTGTransitionViewInfo';
import GameScreen from '../../../main/GameScreen';
import { SERVER_MESSAGES } from '../../../model/interaction/server/GameWebSocketInteractionInfo';
import BattlegroundCountDownDialogController from '../custom/gameplaydialogs/custom/BattlegroundCountDownDialogController';
import RoundResultScreenController from '../roundresult/RoundResultScreenController';
import TransitionViewInfo from '../../../model/uis/transition/TransitionViewInfo';

class BTGTransitionViewController extends TransitionViewController
{
	constructor()
	{
		super (new BTGTransitionViewInfo(), new TransitionView());
	}

	__init()
	{
		super.__init();
	}

	__initModelLevel()
	{
		super.__initModelLevel();
	}

	__initControlLevel()
	{
		super.__initControlLevel();

		this._gameScreen.on(GameScreen.EVENT_ON_BATTLEGROUND_ROUND_CANCELED, this._onCancellBattlegroundRound, this);

		this._gameScreen.gameplayDialogsController.gameBattlegroundCountDownDialogController.on(BattlegroundCountDownDialogController.EVENT_COUNT_DOWN_DIALOG_ACTIVATED, this._onCountDownDialogActivated, this);
		this._gameScreen.gameplayDialogsController.gameBattlegroundCountDownDialogController.on(BattlegroundCountDownDialogController.EVENT_COUNT_DOWN_DIALOG_DEACTIVATED, this._onCountDownDialogDeactivated, this);
	}

	__initViewLevel()
	{
		super.__initViewLevel();
	}

	_startHandle()
	{
		super._startHandle();

		this._gameField.roundResultScreenController.on(RoundResultScreenController.EVENT_ON_ROUND_RESULT_SCREEN_ACTIVATED, this._onRoundResultActivated, this);
		this._gameField.roundResultScreenController.on(RoundResultScreenController.EVENT_ON_NEED_TRANSITION_BEFORE_ROUND_RESULT_SCREEN_ACTIVATED, this._onNeedTranstionBeforeRoundResultScreenActivated, this);
	}

	_onCancellBattlegroundRound(event)
	{
		this.info.isBattlegroundNoWeaponsFiredDialogExpected = !event.isWaitState;

		if (
				!this.info.isBattlegroundCountDownDialogActivated
				&& this.info.isInvalidState
			)
		{
			this.setStateId(TransitionViewInfo.TRANSITION_VIEW_STATE_ID_INTRO);
		}

		if (this.info.isBattlegroundCountDownDialogActivated)
		{
			if (!this.info.isOutroState)
			{
				this.setStateId(TransitionViewInfo.TRANSITION_VIEW_STATE_ID_INVALID);
			}
			return;
		}

		let l_gsi = this._gameStateController.info;
		if (l_gsi.isQualifyState)
		{
			this._destroyTimer();

			this.info.isBattlegroundRoundResultExpected = true;

			if (!this._gameScreen.player.sitIn && this._gameScreen.room && !this._gameScreen.room.alreadySitInNumber >= 0)
			{
				this.setStateId(TransitionViewInfo.TRANSITION_VIEW_STATE_ID_INTRO);
			}
		}

		if (l_gsi.isWaitState)
		{
			this._destroyTimer();

			if (this.info.isInvalidState || this.info.isLoopState || this.info.isOutroState)
			{
				if (this.info.isBattlegroundRoundResultExpected)
				{
					this.setStateId(TransitionViewInfo.TRANSITION_VIEW_STATE_ID_INTRO);
				}
			}
			else if (!this.info.isIntroState)
			{
				this.setStateId(TransitionViewInfo.TRANSITION_VIEW_STATE_ID_THICKEN);
			}
		}

		if (l_gsi.isPlayState)
		{
			if (this.info.isBattlegroundNoWeaponsFiredDialogExpected)
			{
				return;
			}

			if (!this.info.isInvalidState)
			{
				this.setStateId(TransitionViewInfo.TRANSITION_VIEW_STATE_ID_OUTRO);
			}
		}
	}

	_onCountDownDialogActivated()
	{
		if (this.info.isBattlegroundNoWeaponsFiredDialogExpected)
		{
			this.info.isBattlegroundNoWeaponsFiredDialogExpected = false;
		}

		if (!this.info.isBattlegroundCountDownDialogActivated)
		{
			this.info.isBattlegroundCountDownDialogActivated = true;

			if (this.info.isInvalidState)
			{
				// no need to set new state as INVALID state is the goal
			}
			else if (this.info.isOutroState)
			{
				this.setStateId(TransitionViewInfo.TRANSITION_VIEW_STATE_ID_INVALID);
			}
			else
			{
				this.setStateId(TransitionViewInfo.TRANSITION_VIEW_STATE_ID_OUTRO);
			}
		}
	}

	_onCountDownDialogDeactivated(event)
	{
		if (this.info.isBattlegroundCountDownDialogActivated)
		{
			this.info.isBattlegroundCountDownDialogActivated = false;

			if (event.isReasonForDeactivateDialog)
			{
				this.setStateId(TransitionViewInfo.TRANSITION_VIEW_STATE_ID_INTRO);
			}
		}
	}

	_onNeedTranstionBeforeRoundResultScreenActivated()
	{
		if (this.info.isInvalidState || this.info.isOutroState || this.info.stateId === null)
		{
			this.setStateId(TransitionViewInfo.TRANSITION_VIEW_STATE_ID_INTRO);
		}
		else if (this.info.isLoopState || this.info.isThickenState)
		{
			this.emit(TransitionViewController.EVENT_ON_TRANSITION_INTRO_COMPLETED);
		}
	}

	_onRoundResultActivated()
	{
		if (this.info.isBattlegroundRoundResultExpected)
		{
			this.info.isBattlegroundRoundResultExpected = false;
		}

		if (this._gameStateController.info.isWaitState)
		{
			if (this.info.isInvalidState)
			{
				this.setStateId(TransitionViewInfo.TRANSITION_VIEW_STATE_ID_LOOP);
			}
		}
	}

	// override
	__onServerMessage(aEvent_obj)
	{
		let lData_obj = aEvent_obj.messageData;
		switch(lData_obj.class)
		{
			case SERVER_MESSAGES.GET_ROOM_INFO_RESPONSE:
			case SERVER_MESSAGES.FULL_GAME_INFO:
			case SERVER_MESSAGES.GAME_STATE_CHANGED:
				if (this.info.isBattlegroundCountDownDialogActivated)
				{
					if (!this.info.isOutroState)
					{
						this.setStateId(TransitionViewInfo.TRANSITION_VIEW_STATE_ID_INVALID);
					}
					break;
				}

				super.__onServerMessage(aEvent_obj);
				break;

			default:
				super.__onServerMessage(aEvent_obj);
				break;
		}
	}

	// override
	get __preRoundEndIntervalTime()
	{
		return 0;
	}

	// override
	__onQualifyRoundState()
	{			
		this._destroyTimer();

		if (this._gameScreen.isPaused)
		{
			return;
		}

		if (
				this._gameField.roundResultScreenController.info.isScreenActive
				&& !this.info.isIntroState
			)
		{
			this.setStateId(TransitionViewInfo.TRANSITION_VIEW_STATE_ID_LOOP);
		}
	}

	destroy()
	{
		super.destroy();
	}
}

export default BTGTransitionViewController;