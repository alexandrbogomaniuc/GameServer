import SimpleUIController from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/uis/base/SimpleUIController';
import BigWinsInfo from '../../../../model/uis/awarding/big_win/BigWinsInfo';
import BigWinsView from '../../../../view/uis/awarding/big_win/BigWinsView';
import BigWinController from './BigWinController';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import GameScreen from '../../../../main/GameScreen';
import { BIG_WIN_PAYOUT_RATIOS } from '../../../../model/uis/awarding/big_win/BigWinInfo';
import GameField from '../../../../main/GameField';
import Timer from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import MiniSlotFeatureController from '../../../../controller/uis/mini_slot/MiniSlotFeatureController';
import { ENEMY_TYPES, BATTLEGROUND_STAKE_MULTIPLIER } from '../../../../../../shared/src/CommonConstants';

const SKIP_DELAY = 1200;

class BigWinsController extends SimpleUIController {

	static get EVENT_ON_COIN_LANDED() 				{ return BigWinController.EVENT_ON_COIN_LANDED; }
	static get EVENT_ON_BIG_WIN_AWARD_COUNTED() 	{ return BigWinController.EVENT_ON_BIG_WIN_AWARD_COUNTED; }
	static get EVENT_ON_ANIMATION_INTERRUPTED() 	{ return BigWinController.EVENT_ON_ANIMATION_INTERRUPTED; }
	static get EVENT_ON_ALL_ANIMATIONS_COMPLETED() 	{ return "EVENT_ON_ALL_ANIMATIONS_COMPLETED"; }
	static get EVENT_ON_BIG_WIN_STARTED()			{ return "EVENT_ON_BIG_WIN_STARTED"; }
	static get EVENT_ON_PENDING_BIG_WINS_SKIPPED()	{ return "EVENT_ON_PENDING_BIG_WINS_SKIPPED"; }
	static get EVENT_ON_PENDING_SLOT_WINS_SKIPPED()	{ return "EVENT_ON_PENDING_SLOT_WINS_SKIPPED"; }
	static get EVENT_NEED_MUTE_BG_SOUND_ON_BIG_WIN_PLAYING() { return BigWinController.EVENT_NEED_MUTE_BG_SOUND_ON_BIG_WIN_PLAYING;}
	static get EVENT_NEED_FADE_BACK_BG_SOUND_ON_BIG_WIN_PLAYING() { return BigWinController.EVENT_NEED_FADE_BACK_BG_SOUND_ON_BIG_WIN_PLAYING;}	

	static get EVENT_BIG_WIN_PRESETNTATION_STARTED() { return BigWinController.EVENT_BIG_WIN_PRESETNTATION_STARTED; }
	static get EVENT_BIG_WIN_PRESETNTATION_COINS_REQUIRED() { return BigWinController.EVENT_BIG_WIN_PRESETNTATION_COINS_REQUIRED; }

	i_isBigWin(data)
	{
		return this._checkIfBigWinAnimationNeeded(data) !== false;
	}

	get bigWinsContainerInfo()
	{
		return this._gameScreen.gameField.bigWinsContainerInfo;
	}

	get isAnyBigWinInProgress()
	{
		return this.isAnyBigWinAnimationInProgress 
				|| (this._fPendingAnimBigWinValues_num_arr && this._fPendingAnimBigWinValues_num_arr.length)
				|| (this._fPendingSlotsWins_arr && this._fPendingSlotsWins_arr.length);
	}

	get isAnyBigWinAnimationInProgress()
	{
		return this._fBigWinControllers_bwc_arr && this._fBigWinControllers_bwc_arr.length;
	}

	constructor()
	{
		super(new BigWinsInfo(), new BigWinsView());

		this._gameScreen = null;
		this._gameField = null;

		this._fPlayerInfo_pi = null;

		this._fBigWinControllers_bwc_arr = [];
		this._fPendingSlotsWins_arr = [];

		this._fSkipTimer_tmr = null;
		this._fIsSkipProhibited_bl = true;
		this._fPendingAnimBigWinValues_num_arr = [];
		this._fPendingRageBigWinResults_obj = {};
	}

	__initControlLevel()
	{
		super.__initControlLevel();

		this._gameScreen = APP.currentWindow;
		this._gameScreen.on(GameScreen.EVENT_ON_GAME_FIELD_SCREEN_CREATED, this._onGameFieldScreenCreated, this);
		this._gameScreen.on(GameScreen.EVENT_ON_SHOT_SHOW_FIRE_START_TIME, this._onShotShowFireStartTime, this);

		this._fPlayerInfo_pi = APP.playerController.info;
	}

	_onGameFieldScreenCreated()
	{
		this._gameField = this._gameScreen.gameField;
		this._gameField.on(GameField.EVENT_ON_BULLET_TARGET_TIME, this._onBulletTargetTime, this);
		this._gameField.on(GameField.EVENT_ON_PRERAGE_ANIMATION_ENDED, this._onPreRageAnimationEnded, this);
		this._gameField.on(GameField.EVENT_ON_TRY_TO_SKIP_BIG_WIN, this._onTryToSkipBigWin, this);
		this._gameField.on(GameField.EVENT_ON_ROOM_FIELD_CLEARED, this._onRoomFieldCleared, this);

		this._gameField.miniSlotFeatureController.on(MiniSlotFeatureController.EVENT_ON_MINI_SLOT_WIN_REQUIRED, this._onMiniSlotAwardRequired, this);
	}

	_onMiniSlotAwardRequired(aEvent_obj)
	{
		if (this._fPendingSlotsWins_arr && this._fPendingSlotsWins_arr.length)
		{
			let lCurrentSlotRid = aEvent_obj.rid;

			let pendingWin = this._getPendingSlotInfoByRid(lCurrentSlotRid);
			if (!pendingWin || !pendingWin.slotWins || !pendingWin.slotWins.length)
			{
				throw new Error("Cannot find slot win for rid:" + lCurrentSlotRid);
			}

			let pendingWinValue = pendingWin.slotWins.shift();

			if (!pendingWin.slotWins.length)
			{
				this._removePendingSlotInfo(pendingWin);
			}

			this._generateBigWinController(pendingWinValue, pendingWin.shotStake, true);
		}
		else
		{
			// throw new Error("No pending slot awards registered, source rid:" + aEvent_obj.rid);
		}
	}

	_getPendingSlotInfoByRid()
	{
		if (!this._fPendingSlotsWins_arr || !this._fPendingSlotsWins_arr.length)
		{
			return null;
		}

		for (let i=0; i<this._fPendingSlotsWins_arr.length; i++)
		{
			let pendingWin = this._fPendingSlotsWins_arr[i];
			if (pendingWin.rid)
			{
				return pendingWin;
			}
		}

		return null;
	}

	_removePendingSlotInfo(slotInfo)
	{
		let lPendingSlotInfoIndex_int = this._fPendingSlotsWins_arr.indexOf(slotInfo);
		if (lPendingSlotInfoIndex_int >= 0)
		{
			this._fPendingSlotsWins_arr.splice(slotInfo, 1);
		}
	}

	_onShotShowFireStartTime(event)
	{
		let lShotResultsData_obj = event.data;
		
		if (lShotResultsData_obj.seatId !== event.masterSeatId) return;

		let lPendingSlotWinsAdded_bl = this._addPendingSlotWinsIfRequired(lShotResultsData_obj);

		if (lPendingSlotWinsAdded_bl)
		{
			return;
		}

		let result = this._checkIfBigWinAnimationNeeded(lShotResultsData_obj);
		if (result)
		{
			this._fPendingAnimBigWinValues_num_arr.push(result.totalWin);
		}
		else
		{
			if (lShotResultsData_obj.skipAwardedWin)
			{
				return;
			}
		}
	}

	_onBulletTargetTime(aEvent_obj)
	{
		const data = aEvent_obj.data;

		let l_enm = this._gameField.getExistEnemy(data.enemyId);
		let lIsBoss_bl = l_enm && l_enm.isBoss;

		if (data.seatId !== this._fPlayerInfo_pi.seatId) return; // for master player only

		let result = this._checkIfBigWinAnimationNeeded(data);
		
		if (!result) return;

		let lRageEnemyHitData = this._findRageEnemyHitData(data);
		if (lRageEnemyHitData)
		{
			let lRageEnemyId = (lRageEnemyHitData.enemy) ? lRageEnemyHitData.enemy.id : lRageEnemyHitData.enemyId;
			let lRageEnemyView = this._gameField.getExistEnemy(lRageEnemyId);
			if (lRageEnemyView)
			{
				// will be triggerred in _onPreRageAnimationEnded
				let lPendingRageBigWinResultId_str = data.rid + "_" + lRageEnemyId;
				this._fPendingRageBigWinResults_obj[lPendingRageBigWinResultId_str] = result;
				return;
			}
		}
		
		if (this._fPendingSlotsWins_arr && this._fPendingSlotsWins_arr.length > 0 || this._gameField.miniSlotFeatureController.isAnimInProgress)
		{
			// skip "simple" big wins (that are not triggered by slot), if by the time they are presented there is still some slot
			// that is, skip big win animation itself, but add its win

			let lSkippedBigWinValue_num = result.totalWin;
			this._removePendingBigWinValue(lSkippedBigWinValue_num);
			this.emit(BigWinsController.EVENT_ON_PENDING_BIG_WINS_SKIPPED, {skippedPendingBigWinsValue: lSkippedBigWinValue_num, isBoss: lIsBoss_bl});
			return;
		}

		this._generateBigWinController(result.totalWin, result.shotStake, false, lIsBoss_bl);
	}

	_findRageEnemyHitData(rageImpactedEnemyData)
	{
		for (let affectedEnemy of rageImpactedEnemyData.affectedEnemies)
		{
			if (!!affectedEnemy.data.rage)
			{
				return affectedEnemy.data;
			}
		}

		return null;
	}

	_onPreRageAnimationEnded(aEvent_obj)
	{
		const data = aEvent_obj.data;
		
		let l_enm = this._gameField.getExistEnemy(data.enemyId);
		let lIsBoss_bl = l_enm && l_enm.isBoss;

		if (data.seatId !== this._fPlayerInfo_pi.seatId) return; // for master player only

		let lRageEnemyId = (data.enemy) ? data.enemy.id : data.enemyId;
		let lPendingRageBigWinResultId_str = data.rid + "_" + lRageEnemyId;
		let result = this._fPendingRageBigWinResults_obj[lPendingRageBigWinResultId_str];

		delete this._fPendingRageBigWinResults_obj[lPendingRageBigWinResultId_str];
		
		if (!result) 
		{
			return;
		}

		if (this._fPendingSlotsWins_arr && this._fPendingSlotsWins_arr.length > 0 || this._gameField.miniSlotFeatureController.isAnimInProgress)
		{
			// skip "simple" big wins (that are not triggered by slot), if by the time they are presented there is still some slot
			// that is, skip big win animation itself, but add its win

			let lSkippedBigWinValue_num = result.totalWin;
			this._removePendingBigWinValue(lSkippedBigWinValue_num);
			this.emit(BigWinsController.EVENT_ON_PENDING_BIG_WINS_SKIPPED, {skippedPendingBigWinsValue: lSkippedBigWinValue_num, isBoss: lIsBoss_bl});
			return;
		}

		this._generateBigWinController(result.totalWin, result.shotStake, false, lIsBoss_bl);
	}

	_addPendingSlotWinsIfRequired(data)
	{
		if (!data || !data.affectedEnemies)
		{
			return false;
		}
		
		let lAdded_bl = false;
		for (let affectedEnemy of data.affectedEnemies)
		{
			if (affectedEnemy.data.class == "Hit")
			{
				const innerData = affectedEnemy.data;
				if (innerData.slot)
				{
					let lSlotWins_arr = [];
					for (let i = 0; i < innerData.slot.length; i++)
					{
						let lCurSlot = innerData.slot[i];
						if (lCurSlot.win > 0)
						{
							lAdded_bl = true;
							lSlotWins_arr.push(lCurSlot.win);
						}
					}

					if (lSlotWins_arr.length != 0)
					{
						let lShotStake_num = null;
						if(APP.isBattlegroundGame)
						{
							lShotStake_num = BATTLEGROUND_STAKE_MULTIPLIER * data.betLevel;
						}
						else
						{
							lShotStake_num = this._fPlayerInfo_pi.currentStake * data.betLevel;
						}

						this._fPendingSlotsWins_arr.push({isSlotWin: true, slotWins: lSlotWins_arr, shotStake: lShotStake_num, rid: innerData.rid});
					}
				}
			}
		}

		return lAdded_bl;
	}

	_checkIfBigWinAnimationNeeded(data)
	{
		let lTotalWin_num = 0;

		if (!data || !data.affectedEnemies)
		{
			return false;
		}

		for (let affectedEnemy of data.affectedEnemies)
		{
			if (affectedEnemy.data.class == "Hit")
			{
				const innerData = affectedEnemy.data;
				if (innerData.enemy.typeId == ENEMY_TYPES.BOSS && innerData.killed)
				{
					return false;
				}
				
				lTotalWin_num += innerData.win + innerData.killBonusPay + innerData.multiplierPay;

				if (innerData.slot)
				{
					return false;
					// if slot is triggered by the shot then this shot won't trigger big win:
					// shoe usual wins (CoinsAward) and slot win itself after slot rotation stop
				}
			}
		}

		if (lTotalWin_num == 0)
		{
			return false;
		}

		if (data.betLevel == null)
		{
			APP.logger.i_pushWarning(`BigWin. No betLevel value in Hit response! ${JSON.stringify(data)}`);
			console.error("No betLevel value in Hit response!", data);
			return false;
		}
		if (data.isPaidSpecialShot == null)
		{
			APP.logger.i_pushWarning(`BigWin. No isPaidSpecialShot in Hit response! ${JSON.stringify(data)}`);
			console.error("No isPaidSpecialShot value in Hit response!");
			return false;
		}

		let lShotStake_num = this._fPlayerInfo_pi.currentStake * data.betLevel;


		if(APP.isBattlegroundGame)
		{
			lShotStake_num = BATTLEGROUND_STAKE_MULTIPLIER * data.betLevel;
		}


		const lRatio_num = lTotalWin_num / lShotStake_num;
		if (lRatio_num >= BIG_WIN_PAYOUT_RATIOS.BIG)
		{
			return {totalWin: lTotalWin_num, shotStake: lShotStake_num};
		}
		return false;
	}

	_generateBigWinController(aTotalWin_num, aShotStake_num, aOptIsMinislot_bl=false, aOptIsBoss_bl=false)
	{
		if (!aOptIsMinislot_bl)
		{
			this._removePendingBigWinValue(aTotalWin_num);
		}
		
		this.view.addToContainerIfRequired(this.bigWinsContainerInfo);

		let l_bwc = new BigWinController(aTotalWin_num, aShotStake_num, this.view, aOptIsMinislot_bl);
		l_bwc.i_init();
		l_bwc.on(BigWinController.EVENT_ON_ANIMATION_COMPLETED, this._onBigWinAnimationCompleted, this);
		l_bwc.on(BigWinController.EVENT_ON_COIN_LANDED, this.emit, this);
		l_bwc.on(BigWinController.EVENT_ON_BIG_WIN_AWARD_COUNTED, this.emit, this);
		l_bwc.on(BigWinController.EVENT_ON_ANIMATION_INTERRUPTED, this.emit, this);
		l_bwc.on(BigWinController.EVENT_BIG_WIN_PRESETNTATION_STARTED, (e)=>{
			this.emit(
				BigWinsController.EVENT_BIG_WIN_PRESETNTATION_STARTED,
				Object.assign(e, {
					isBoss: aOptIsBoss_bl,
					value: aTotalWin_num,
					seatId: APP.currentWindow.player.seatId
				})
			);

			this.view.updateZIndex(e.bigWinTypeId);

		}, this);
		l_bwc.on(BigWinController.EVENT_BIG_WIN_PRESETNTATION_COINS_REQUIRED, this.emit, this);
		l_bwc.on(BigWinController.EVENT_NEED_MUTE_BG_SOUND_ON_BIG_WIN_PLAYING, this.emit, this);
		l_bwc.on(BigWinController.EVENT_NEED_FADE_BACK_BG_SOUND_ON_BIG_WIN_PLAYING, this.emit, this);

		this._skipActive(); //skip all previous Big Wins animation

		this._fBigWinControllers_bwc_arr.push(l_bwc);

		l_bwc.i_startAnimation();
		this._startSkipTimer();

		this.emit(BigWinsController.EVENT_ON_BIG_WIN_STARTED);
	}

	_removePendingBigWinValue(aValue_num)
	{
		let lPendingValueIndex_int = this._fPendingAnimBigWinValues_num_arr.indexOf(aValue_num);
		if (lPendingValueIndex_int >= 0)
		{
			this._fPendingAnimBigWinValues_num_arr.splice(lPendingValueIndex_int, 1);
		}
	}

	_startSkipTimer()
	{
		this._resetSkipTimer();
		this._fIsSkipProhibited_bl = true;
		this._fSkipTimer_tmr = new Timer(() => {
			this._fIsSkipProhibited_bl = false
		},SKIP_DELAY);
	}

	_resetSkipTimer()
	{
		this._fSkipTimer_tmr && this._fSkipTimer_tmr.destructor();
		this._fSkipTimer_tmr = null;
	}

	_onBigWinAnimationCompleted(aEvent_obj)
	{
		let lIndex_int = this._fBigWinControllers_bwc_arr.indexOf(aEvent_obj.target);
		if (lIndex_int > -1)
		{
			let l_bwc = this._fBigWinControllers_bwc_arr.splice(lIndex_int, 1)[0];
			this._onAllAnimationsCompleteSuspision();
			l_bwc.destroy();
		}
		else
		{
			throw new Error("Can't find completed BigWinController in array, lIndex_int = " + lIndex_int, aEvent_obj);
		}
	}

	_onAllAnimationsCompleteSuspision()
	{
		if (!this.isAnyBigWinInProgress)
		{
			this.emit(BigWinsController.EVENT_ON_ALL_ANIMATIONS_COMPLETED);
		}
	}

	_onRoomFieldCleared()
	{
		this._skipAll();
	}

	_onTryToSkipBigWin()
	{
		if (!this._fIsSkipProhibited_bl)
		{
			this._skipActive();
		}
	}

	_skipActive()  
	{
		this._resetSkipTimer();

		for (let lBigWinController_bwc of this._fBigWinControllers_bwc_arr)
		{
			lBigWinController_bwc.i_interrupt();
			lBigWinController_bwc.destroy();
		}
		this._fBigWinControllers_bwc_arr = [];

		this._fIsSkipProhibited_bl = true;
	}

	_skipAll()
	{
		this._resetSkipTimer();

		if (this._fPendingAnimBigWinValues_num_arr && this._fPendingAnimBigWinValues_num_arr.length)
		{
			let skippedPendingBigWinsValue = 0;
			while (this._fPendingAnimBigWinValues_num_arr && this._fPendingAnimBigWinValues_num_arr.length)
			{
				skippedPendingBigWinsValue += this._fPendingAnimBigWinValues_num_arr.shift();
			}
			this._fPendingAnimBigWinValues_num_arr = [];

			this.emit(BigWinsController.EVENT_ON_PENDING_BIG_WINS_SKIPPED, {skippedPendingBigWinsValue: skippedPendingBigWinsValue});
		}

		if (this._fPendingSlotsWins_arr && this._fPendingSlotsWins_arr.length)
		{
			let skippedPendingSlotWinsValue = 0;
			while (this._fPendingSlotsWins_arr && this._fPendingSlotsWins_arr.length)
			{
				let lCurSlotWins = this._fPendingSlotsWins_arr.shift();
				for (let i=0; i<lCurSlotWins.slotWins.length; i++)
				{
					skippedPendingSlotWinsValue += lCurSlotWins.slotWins[i];
				}
			}
			this._fPendingSlotsWins_arr = [];

			this.emit(BigWinsController.EVENT_ON_PENDING_SLOT_WINS_SKIPPED, {skippedPendingSlotWinsValue: skippedPendingSlotWinsValue});
		}

		for (let lBigWinController_bwc of this._fBigWinControllers_bwc_arr)
		{
			lBigWinController_bwc.i_interrupt();
			lBigWinController_bwc.destroy();
		}
		this._fBigWinControllers_bwc_arr = [];

		this._fIsSkipProhibited_bl = true;

		this._fPendingRageBigWinResults_obj = {};
		
		this._onAllAnimationsCompleteSuspision();
	}
}

export default BigWinsController;