import SimpleUIController from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/uis/base/SimpleUIController';
import { SERVER_MESSAGES } from '../../../model/interaction/server/GameWebSocketInteractionInfo';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import GameWebSocketInteractionController from '../../interaction/server/GameWebSocketInteractionController';
import FragmentsController from './FragmentsController';
import { MAX_FRAGMENTS_AMOUNT } from '../../../model/uis/dragonstones/FragmentsPanelInfo';
import GameScreen from '../../../main/GameScreen';
import GameField from '../../../main/GameField';
import FragmentsPanelView from '../../../view/uis/dragonstones/FragmentsPanelView';
import BossModeController from './../custom/bossmode/BossModeController';
import { ENEMY_TYPES } from '../../../../../shared/src/CommonConstants';
import { SUBROUND_STATE, ROUND_STATE } from '../../../model/state/GameStateInfo';
import GameStateController from '../../state/GameStateController';
import BossModeHourglassController from '../custom/bossmode/BossModeHourglassController';
import ScoreboardController from '../scoreboard/ScoreboardController';
import RoundResultScreenController from '../roundresult/RoundResultScreenController';

class FragmentsPanelController extends SimpleUIController
{
	static get EVENT_ON_UPDATE_ANIMATION_COMPLETED()			{return FragmentsPanelView.EVENT_ON_UPDATE_ANIMATION_COMPLETED;}
	static get EVENT_ON_UPDATE_ANIMATION_INTERRUPTED()			{return FragmentsPanelView.EVENT_ON_UPDATE_ANIMATION_INTERRUPTED;}
	static get EVENT_ON_STONE_FLY_OUT_STARTED()					{return FragmentsPanelView.EVENT_ON_STONE_FLY_OUT_STARTED;}
	static get EVENT_ON_STONE_SCREEN_COVERED()					{return FragmentsPanelView.EVENT_ON_STONE_SCREEN_COVERED;}
	static get EVENT_ON_ONE_FRAGMENT_LEFT_BEFORE_BOSS_RISING()	{return "EVENT_ON_ONE_FRAGMENT_LEFT_BEFORE_BOSS_RISING";}

	get isOneFragmentLeftBeforeBossRising()
	{
		return this.info.fragmentsAmount == MAX_FRAGMENTS_AMOUNT - 1;
	}

	getFragmentLandingGlobalPosition(aFragmentId_num)
	{
		let l_fspv = this.view;

		return l_fspv.getFragmentLandingGlobalPosition(aFragmentId_num);
	}

	constructor(aOptInfo_usuii, aOptView_uo)
	{
		super(aOptInfo_usuii, aOptView_uo);

		this._fScoreBoardController_scb = null;
	}

	__initModelLevel()
	{
		super.__initModelLevel();

		let gs = APP.gameScreen;
		if (gs.room && gs.room.fragments !== undefined)
		{
			this.info.updateFragmentsAmount(gs.room.fragments);
		}
	}

	__initControlLevel()
	{
		super.__initControlLevel();

		let lGameScreen_gs = APP.gameScreen;

		APP.webSocketInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_MESSAGE, this._onServerMessage, this);

		let lFragmentsAwardController = this._fFragmentsAwardController = lGameScreen_gs.gameField.fragmentsController;
		lFragmentsAwardController.on(FragmentsController.ON_FRAGMENT_LANDED, this._onFragmentLanded, this);
		lFragmentsAwardController.on(FragmentsController.ON_FRAGMENT_APPEARED, this._onFragmentAppearing, this);

		lFragmentsAwardController.on(FragmentsController.EVENT_ON_FRAGMENTS_AWARD_INTERRUPTED, this._onFragmentsAwardInterrupted, this);

		lGameScreen_gs.on(GameScreen.EVENT_ON_ROOM_FIELD_CLEARED, this._onRoomFieldCleared, this);
		lGameScreen_gs.on(GameScreen.EVENT_ON_NEW_BOSS_CREATED, this._onBossCreated, this);
		lGameScreen_gs.on(GameScreen.EVENT_ON_DRAGON_DISAPPEARED, this._onDragonDisappeared, this);
		lGameScreen_gs.on(GameScreen.EVENT_ON_BOSS_DESTROYING, this._onBossDestroying, this);
		lGameScreen_gs.on(GameScreen.EVENT_ON_TIME_TO_EXPLODE_COINS, this._onTimeToExplodeCoins, this);
		lGameScreen_gs.on(GameScreen.EVENT_ON_CLOSE_ROOM, this._onCloseRoom, this);

		lGameScreen_gs.gameField.on(GameField.EVENT_ON_ENEMY_HIT_ANIMATION, this._onEnemyHitAnimation, this);
		lGameScreen_gs.gameField.on(GameField.EVENT_ON_DESTROY_BOSS_HOURGLASS, this._onDestroyBossHourglass, this);

		let lGameStateController_gsc = APP.currentWindow.gameStateController;
		lGameStateController_gsc.on(GameStateController.EVENT_ON_SUBROUND_STATE_CHANGED, this._onSubroundStateChanged, this);
		lGameStateController_gsc.on(GameStateController.EVENT_ON_GAME_ROUND_STATE_CHANGED, this._onGameRoundStateChanged, this);

		if (APP.isBattlegroundGamePlayMode)
		{
			lGameStateController_gsc.on(GameStateController.EVENT_ON_PLAYER_SEAT_STATE_CHANGED, this._onPlayerSeatStateChanged, this);
			lGameScreen_gs.gameField.scoreboardController.on(ScoreboardController.EVENT_ON_SCORE_BOARD_START_HIDE_ON_ROUND_RESULT, this._onScoreBoardStartHideOnRoundResult, this);

			this.info.isNeedHidePanel = true;
		}
	}

	__initViewLevel()
	{
		super.__initViewLevel();

		this._updateCollectedFragments(this.info.fragmentsAmount);
		this._updatePanelMode(APP.currentWindow.gameStateController.info.isBossSubround);

		this.view.on(FragmentsPanelView.EVENT_ON_UPDATE_ANIMATION_COMPLETED, this.emit, this);
		this.view.on(FragmentsPanelView.EVENT_ON_UPDATE_ANIMATION_INTERRUPTED, this.emit, this);
		this.view.on(FragmentsPanelView.EVENT_ON_STONE_FLY_OUT_STARTED, this.emit, this);
		this.view.on(FragmentsPanelView.EVENT_ON_STONE_SCREEN_COVERED, this.emit, this);
	}

	_onScoreBoardStartHideOnRoundResult()
	{
		if (APP.isBattlegroundGamePlayMode)
		{
			this.info.isNeedHidePanel = true;
			this.info.isHidePanelOnRoundResultExpected = false;
			this._updatePanelMode();
		}
	}

	_onPlayerSeatStateChanged(aEvent_obj)
	{
		if (!APP.isBattlegroundGamePlayMode)
		{
			return;
		}

		if (!aEvent_obj.value) //sit out
		{
			this.info.isNeedHidePanel = true;
		}

		this._updatePanelMode();
	}

	_onServerMessage(aEvent_obj)
	{
		if (
			aEvent_obj.messageData.class === SERVER_MESSAGES.GET_ROOM_INFO_RESPONSE
			|| aEvent_obj.messageData.class === SERVER_MESSAGES.FULL_GAME_INFO
		)
		{
			let lCollectedFragmentsAmount_int = aEvent_obj.messageData.fragments;
			if (APP.currentWindow.gameStateController.info.isBossSubround)
			{
				lCollectedFragmentsAmount_int = MAX_FRAGMENTS_AMOUNT;
			}

			if (this._fFragmentsAwardController.isAwardingInProgress)
			{
				//lCollectedFragmentsAmount_int -= this._fFragmentsAwardController.pendingFragmentsAmount;
				lCollectedFragmentsAmount_int -= this._fFragmentsAwardController.activeAwardsAmount;
			}

			if (lCollectedFragmentsAmount_int < 0)
			{
				throw new Error(`Negative collected fragments value: ${lCollectedFragmentsAmount_int}, received fragments amount: ${aEvent_obj.messageData.fragments}`);
			}

			let roundState = aEvent_obj.messageData.state;
			if (roundState == ROUND_STATE.PLAY)
			{
				this.info.isNeedHidePanel = false;
			}
			else if (roundState == ROUND_STATE.QUALIFY)
			{
				this.info.isHidePanelOnRoundResultExpected = true;
			}
			else if (roundState == ROUND_STATE.WAIT)
			{
				this.info.isHidePanelOnRoundResultExpected = true;
			}

			this._updateCollectedFragments(lCollectedFragmentsAmount_int);
			this._updatePanelMode(APP.currentWindow.gameStateController.info.isBossSubround);
		}
	}

	_onBossCreated(aEvent_obj)
	{
		let lBossHourglassController = APP.gameScreen.gameField.bossHourglassController;
		lBossHourglassController.once(BossModeHourglassController.EVENT_ON_HOURGLASS_DISAPPEAR_ANIMATION_COMPLETED, this._onHourglassDisappeared, this);
		lBossHourglassController.once(BossModeHourglassController.EVENT_ON_DISAPPEAR_ANIMATION_COMPLETING, this._onHourglassDisappearCompleting, this);

		if (lBossHourglassController.view.visible)
		{
			this.info.isHourglassShowed = true;
		}
		else
		{
			this.info.isHourglassShowed = false;
			APP.gameScreen.bossModeController.once(BossModeController.EVENT_ON_IDLE_ANIMATION_STARTING, this._onHourglassIntroTime, this);
		}

		if (aEvent_obj.isLasthandBossView)
		{
			this._updatePanelMode(true);
		}
	}

	_onHourglassIntroTime()
	{
		this.info.isHourglassShowed = true;
	}

	_onSubroundStateChanged(event)
	{
		if (event.value === SUBROUND_STATE.BASE && !APP.gameScreen.gameField.isBossEnemyExist)
		{
			if (this.info.fragmentsAmount == MAX_FRAGMENTS_AMOUNT)
			{
				this.info.resetCollectedTreasures();
				this._updatePanel(true);
			}
			this._updatePanelMode();
		}
	}

	_onGameRoundStateChanged(event)
	{
		let lIsGameRoundInProgress_bln = event.value;

		if (APP.isBattlegroundGame)
		{
			if (!lIsGameRoundInProgress_bln)
			{
				this._updateCollectedFragments(0);
				this._updatePanelMode(true);
			}
			else
			{
				this.info.isNeedHidePanel = false;
			}
		}
	}

	_onDragonDisappeared()
	{
		this.info.resetCollectedTreasures();
		this._updatePanel(true);
	}

	_onHourglassDisappeared(event)
	{
		this.info.isHourglassShowed = false;
		this._updatePanelMode();
	}

	_onHourglassDisappearCompleting()
	{
		this.info.isHourglassShowed = false;
		this._updatePanelMode();
	}

	_onBossDestroying(event)
	{
		if (event.isInstantKill)
		{
			this.info.resetCollectedTreasures();
			this._updatePanel(true);

			this._updatePanelMode();
		}
	}

	_onDestroyBossHourglass()
	{
		APP.gameScreen.bossModeController.off(BossModeController.EVENT_ON_IDLE_ANIMATION_STARTING, this._onHourglassIntroTime, this, true);

		this.info.isHourglassShowed = false;
		this._updatePanelMode();
	}

	_onTimeToExplodeCoins()
	{
		this.info.resetCollectedTreasures();
		this._updatePanel(true);
		this._updatePanelMode();
	}

	_onEnemyHitAnimation(aEvent_obj)
	{
		const data = aEvent_obj.data;

		if (data.killed && data.enemy && data.enemy.typeId === ENEMY_TYPES.BOSS)
		{
			let enemyId = data.enemy.id;
			let enemy = APP.gameScreen.gameField.getExistEnemy(enemyId);

			if (!enemy)
			{
				this.info.resetCollectedTreasures();
				this._updatePanel(true);
				this._updatePanelMode();
			}
		}
	}

	_onFragmentLanded(aEvent_obj)
	{
		//this.info.increaseFragmentsAmount();
		this.info.lastLandedFragment = aEvent_obj.target.fragmentId;

		if (this.info.fragmentsAmount == MAX_FRAGMENTS_AMOUNT - 1)
		{
			this.emit(FragmentsPanelController.EVENT_ON_ONE_FRAGMENT_LEFT_BEFORE_BOSS_RISING);
		}

		this._updatePanel(false);
	}

	_onFragmentAppearing()
	{
		this.info.increaseFragmentsAmount();
	}

	_onFragmentsAwardInterrupted(aEvent_obj)
	{
		this._interruptAnimations();

		let lInterruptedFragments_int_arr = aEvent_obj.interruptedFragments;
		let lAddFragmentsAmount_num = lInterruptedFragments_int_arr ? lInterruptedFragments_int_arr.length : 0;

		if (lAddFragmentsAmount_num > 0)
		{
			let lNewFragmentsAmount_num = (this.info.fragmentsAmount + lAddFragmentsAmount_num)%(MAX_FRAGMENTS_AMOUNT+1)

			this._updateCollectedFragments(lNewFragmentsAmount_num);
		}
	}

	_onRoomFieldCleared()
	{
		this._interruptAnimations();
		this._updatePanelMode(true);
	}

	_updateCollectedFragments(aCollectedFragmentsAmount_int)
	{
		this.info.updateFragmentsAmount(aCollectedFragmentsAmount_int);

		if (this.info.fragmentsAmount == MAX_FRAGMENTS_AMOUNT - 1)
		{
			this.emit(FragmentsPanelController.EVENT_ON_ONE_FRAGMENT_LEFT_BEFORE_BOSS_RISING);
		}

		this._updatePanel(true);
	}

	_onCloseRoom()
	{
		this._updateCollectedFragments(0);
		this._updatePanelMode(true);
	}

	_updatePanel(aSkipAnimation_bln = false)
	{
		let l_fspv = this.view;
		if (!l_fspv) return;

		l_fspv.update(aSkipAnimation_bln);
	}

	_updatePanelMode(aIsBossMode_bl = false)
	{
		let l_fspv = this.view;
		if (!l_fspv) return;

		let lNeedHide_bl = aIsBossMode_bl;

		if (APP.isBattlegroundGamePlayMode)
		{
			lNeedHide_bl = aIsBossMode_bl && !this.info.isHidePanelOnRoundResultExpected;
		}

		l_fspv.updatePanelMode(lNeedHide_bl);
	}

	_updatePanelFade(aValue_bln = false, aAnimate_bln = false)
	{
		let l_fspv = this.view;
		if (!l_fspv) return;

		l_fspv.updatePanelFade(aValue_bln, aAnimate_bln);
	}

	_interruptAnimations()
	{
		this.view.interruptAnimations();
	}
}

export default FragmentsPanelController;