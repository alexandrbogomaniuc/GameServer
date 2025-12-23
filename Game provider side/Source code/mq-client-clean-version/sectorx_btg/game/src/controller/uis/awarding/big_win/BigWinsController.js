import SimpleUIController from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/uis/base/SimpleUIController';
import BigWinsInfo from '../../../../model/uis/awarding/big_win/BigWinsInfo';
import BigWinsView from '../../../../view/uis/awarding/big_win/BigWinsView';
import BigWinController from './BigWinController';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import GameScreen from '../../../../main/GameScreen';
import { BIG_WIN_PAYOUT_RATIOS } from '../../../../model/uis/awarding/big_win/BigWinInfo';
import Timer from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import { ENEMY_TYPES, BATTLEGROUND_STAKE_MULTIPLIER } from '../../../../../../shared/src/CommonConstants';
import MoneyWheelController from '../../quests/MoneyWheelController';
import {HIT_RESULT_MONEY_WHEEL_WIN_ID} from '../../prizes/PrizesController';
import FireController from '../../fire/FireController';
import GameFieldController from '../../../../controller/uis/game_field/GameFieldController'
import Enemy from '../../../../main/enemies/Enemy';
import BossModeController from '../../custom/bossmode/BossModeController';

const SKIP_DELAY = 1200;

class BigWinsController extends SimpleUIController
{
	static get EVENT_ON_COIN_LANDED() 				{ return BigWinController.EVENT_ON_COIN_LANDED; }
	static get EVENT_ON_BIG_WIN_AWARD_COUNTED() 	{ return BigWinController.EVENT_ON_BIG_WIN_AWARD_COUNTED; }
	static get EVENT_ON_ANIMATION_INTERRUPTED() 	{ return BigWinController.EVENT_ON_ANIMATION_INTERRUPTED; }
	static get EVENT_ON_ALL_ANIMATIONS_COMPLETED() 	{ return "EVENT_ON_ALL_ANIMATIONS_COMPLETED"; }
	static get EVENT_ON_BIG_WIN_STARTED()			{ return "EVENT_ON_BIG_WIN_STARTED"; }
	static get EVENT_ON_PENDING_BIG_WINS_SKIPPED()	{ return "EVENT_ON_PENDING_BIG_WINS_SKIPPED"; }
	static get EVENT_NEED_MUTE_BG_SOUND_ON_BIG_WIN_PLAYING() { return BigWinController.EVENT_NEED_MUTE_BG_SOUND_ON_BIG_WIN_PLAYING;}
	static get EVENT_NEED_FADE_BACK_BG_SOUND_ON_BIG_WIN_PLAYING() { return BigWinController.EVENT_NEED_FADE_BACK_BG_SOUND_ON_BIG_WIN_PLAYING;}	

	static get EVENT_BIG_WIN_PRESETNTATION_STARTED() { return BigWinController.EVENT_BIG_WIN_PRESETNTATION_STARTED; }

	i_isBigWin(data)
	{
		return this._checkIfBigWinAnimationNeeded(data) !== false;
	}

	get bigWinsContainerInfo()
	{
		return this._gameScreen.gameFieldController.bigWinsContainerInfo;
	}

	get isAnyBigWinInProgress()
	{
		return this.isAnyBigWinAnimationInProgress 
				|| (this._fPendingAnimBigWinValues_num_arr && this._fPendingAnimBigWinValues_num_arr.length)
	}

	get isAnyBigWinAnimationInProgress()
	{
		return this._fBigWinControllers_bwc_arr && this._fBigWinControllers_bwc_arr.length;
	}

	get isAnyLightningOrLaserCapsuleBigWinAwaited()
	{
		return this._fPendingLaserAndLightningCapsulesIds_int_arr.length > 0;
	}

	constructor()
	{
		super(new BigWinsInfo(), new BigWinsView());

		this._gameScreen = null;
		this._gameField = null;

		this._fPlayerInfo_pi = null;

		this._fBigWinControllers_bwc_arr = [];
		this._fPendingMoneyWheelsWin_arr = [];

		this._fSkipTimer_tmr = null;
		this._fIsSkipProhibited_bl = true;
		this._fPendingAnimBigWinValues_num_arr = [];

		this._fPendingLaserAndLightningCapsulesIds_int_arr = [];
	}

	__initControlLevel()
	{
		super.__initControlLevel();

		this._gameScreen = APP.currentWindow;
		this._gameScreen.on(GameScreen.EVENT_ON_GAME_FIELD_SCREEN_CREATED, this._onGameFieldScreenCreated, this);
		this._gameScreen.on(GameScreen.EVENT_ON_SHOT_SHOW_FIRE_START_TIME, this._onShotShowFireStartTime, this);
		this._gameScreen.fireController.on(FireController.EVENT_ON_TRY_TO_SKIP_BIG_WIN, this._onTryToSkipBigWin, this);
		this._gameScreen.bossModeController.on(BossModeController.EVENT_ON_TIME_TO_PRESENT_MULTIPLIER, this._onBossModeTimeToShowDefeatedCaption, this);

		this._fPlayerInfo_pi = APP.playerController.info;
	}

	_onGameFieldScreenCreated()
	{
		this._gameField = this._gameScreen.gameFieldController;
		this._gameField.on(GameFieldController.EVENT_ON_BULLET_TARGET_TIME, this._onBulletTargetTime, this);
		this._gameField.on(GameFieldController.EVENT_ON_ROOM_FIELD_CLEARED, this._onRoomFieldCleared, this);

		this._gameField.moneyWheelController.on(MoneyWheelController.EVENT_ON_MONEY_WHEEL_WIN_REQUIRED, this._onMoneyWheelAwardRequired, this);
	}

	_onBossModeTimeToShowDefeatedCaption()
	{
		this._skipActive(); // prevent overlaying
	}

	_onMoneyWheelAwardRequired(aEvent_obj)
	{
		if (!aEvent_obj.isBigWin) // usual win (not big win) of money wheel feature
		{
			this._skipActive();
		}

		let lCurrentWheelRid_num = aEvent_obj.rid;
		if (this._fPendingMoneyWheelsWin_arr && this._fPendingMoneyWheelsWin_arr.length)
		{
			for (let key in this._fPendingMoneyWheelsWin_arr)
			{
				let pendingWheel = this._fPendingMoneyWheelsWin_arr[key]
				if (pendingWheel.rid == lCurrentWheelRid_num)
				{
					pendingWheel.moneyWheelsAmount--;
					if (pendingWheel.moneyWheelsAmount > 0)
					{
						break;
					}

					if (this._gameScreen.bossModeController.isPlayerWinAnimationInProgress)
					{
						// skip big win triggered by money wheel, 
						// if by the time it is presented there is still some active win pewsentation of boss
						// that is, skip big win animation itself, but add its win

						let lSkippedBigWinValue_num = pendingWheel.totalWin;
						this._removePendingBigWinValue(lSkippedBigWinValue_num);

						this.emit(BigWinsController.EVENT_ON_PENDING_BIG_WINS_SKIPPED, {skippedPendingBigWinsValue: lSkippedBigWinValue_num, isBoss: false, bossValue: 0});
					}
					else
					{
						this._startBigWinAnimation(this._generateBigWinController(pendingWheel.totalWin, pendingWheel.shotStake, false));
					}
					
					this._fPendingMoneyWheelsWin_arr.splice(key, 1);
				}
			}
		}
	}

	_onShotShowFireStartTime(event)
	{
		let lShotResultsData_obj = event.data;
		
		if (lShotResultsData_obj.seatId !== event.masterSeatId) return;

		let result = this._checkIfBigWinAnimationNeeded(lShotResultsData_obj);
		if (result)
		{
			this._fPendingAnimBigWinValues_num_arr.push(result.totalWin);
		}
	}

	_onBulletTargetTime(aEvent_obj)
	{
		const data = aEvent_obj.data;

		let l_enm = this._gameField.getExistEnemy(data.enemyId);

		if (data.seatId !== this._fPlayerInfo_pi.seatId) return; // for master player only

		let result = this._checkIfBigWinAnimationNeeded(data);
		
		let lIsBoss_bl = result.isBoss || l_enm && l_enm.isBoss;

		if (!result) return;
		if (result.isMoneyWheel)
		{
			this._fPendingMoneyWheelsWin_arr.push(result);
			return;
		}

		if (l_enm && data.killed)
		{

			if (data.lightningExplode || data.laserExplode)
			{
				this._fPendingLaserAndLightningCapsulesIds_int_arr.push(data.enemyId);
			}

			l_enm.once(Enemy.EVENT_ON_DEATH_COIN_AWARD, this._onEnemyBigWinTime.bind(this, result, lIsBoss_bl, data.enemyId), this);
		}
		else
		{
			this._onEnemyBigWinTime(result, lIsBoss_bl);
		}
	}

	_checkIfBigWinAnimationNeeded(data)
	{
		let lTotalWin_num = 0;
		let lMoneyWheelsAmount_num = 0;
		let lIsBossHit = false;
		let lBossWin_num = 0;

		if (!data || !data.affectedEnemies)
		{
			return false;
		}

		for (let affectedEnemy of data.affectedEnemies)
		{
			if (affectedEnemy.data.class == "Hit")
			{
				const innerData = affectedEnemy.data;
				if (innerData.enemy.typeId == ENEMY_TYPES.BOSS)
				{
					if(innerData.killed)
					{
						return false;
					}

					lIsBossHit = true;
					lBossWin_num += innerData.win + innerData.killBonusPay + innerData.multiplierPay;
				}
				
				lTotalWin_num += innerData.win + innerData.killBonusPay + innerData.multiplierPay;
				let currentSeat = APP.playerController.info.seatId;
				if (innerData.hitResultBySeats && innerData.hitResultBySeats[currentSeat])
				{
					let hitResult = innerData.hitResultBySeats[currentSeat];
					for (let award of hitResult)
					{
						if (data.enemy.typeId === ENEMY_TYPES.GOLD_CAPSULE && award.id == 0 && +award.value > 0)
						{
							lMoneyWheelsAmount_num++;
						}
					}
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
			return {
				totalWin: lTotalWin_num,
				shotStake: lShotStake_num,
				isMoneyWheel: (lMoneyWheelsAmount_num > 0),
				moneyWheelsAmount: lMoneyWheelsAmount_num,
				isBoss: lIsBossHit,
				bossWin: lBossWin_num,
				rid: data.rid
			};
		}
		return false;
	}

	_onEnemyBigWinTime(aCheckBigWinResult_obj, aIsBoss_bl=false, aOptEnemyId_num)
	{
		if (aOptEnemyId_num)
		{
			let lPendingEnemyIndex_num = this._fPendingLaserAndLightningCapsulesIds_int_arr.indexOf(aOptEnemyId_num);
			if (lPendingEnemyIndex_num !== -1)
			{
				this._fPendingLaserAndLightningCapsulesIds_int_arr.splice(lPendingEnemyIndex_num, 1);
			}
		}

		if (!aCheckBigWinResult_obj)
		{
			throw new Error("Big Win 'result' must be passed as argument.");
		}

		if (
				this._gameField.moneyWheelController.isPayoutPresentationInProgress
				||this._gameScreen.bossModeController.isPlayerWinAnimationInProgress
			)
		{
			// skip "simple" big wins (that are not triggered by money wheel),
			// if by the time they are presented there is still some active money wheel's you won animations or win pewsentation of boss
			// that is, skip big win animation itself, but add its win

			let lSkippedBigWinValue_num = aCheckBigWinResult_obj.totalWin;
			this._removePendingBigWinValue(lSkippedBigWinValue_num);

			this.emit(BigWinsController.EVENT_ON_PENDING_BIG_WINS_SKIPPED, {skippedPendingBigWinsValue: lSkippedBigWinValue_num, isBoss: aIsBoss_bl, bossValue: (aCheckBigWinResult_obj.bossWin || 0)});
			return;
		}

		let l_bwc = this._generateBigWinController(aCheckBigWinResult_obj.totalWin, aCheckBigWinResult_obj.shotStake, aIsBoss_bl, aCheckBigWinResult_obj.bossWin);
		this._startBigWinAnimation(l_bwc);
	}

	_generateBigWinController(aTotalWin_num, aShotStake_num, aOptIsBoss_bl=false, aOptBossWin = 0)
	{
		this.view.addToContainerIfRequired(this.bigWinsContainerInfo);

		let l_bwc = new BigWinController(aTotalWin_num, aShotStake_num, this.view);
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
					bossValue: aOptBossWin,
					seatId: APP.currentWindow.player.seatId
				})
			);

			this.view.updateZIndex();

		}, this);
		l_bwc.on(BigWinController.EVENT_NEED_MUTE_BG_SOUND_ON_BIG_WIN_PLAYING, this.emit, this);
		l_bwc.on(BigWinController.EVENT_NEED_FADE_BACK_BG_SOUND_ON_BIG_WIN_PLAYING, this.emit, this);

		return l_bwc;
	}
	
	_startBigWinAnimation(aBigWinController_bwc)
	{
		// if controller is not defined or not BigWinController
		if (!(aBigWinController_bwc && aBigWinController_bwc instanceof BigWinController))
		{
			throw new Error("Big Win Controller must be passed as argument.");
		}

		this._skipActive(); //skip all previous Big Win animations

		this._removePendingBigWinValue(aBigWinController_bwc.info.totalWin);
		aBigWinController_bwc.i_startAnimation();
		this._fBigWinControllers_bwc_arr.push(aBigWinController_bwc);

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

		for (let lBigWinController_bwc of this._fBigWinControllers_bwc_arr)
		{
			lBigWinController_bwc.i_interrupt();
			lBigWinController_bwc.destroy();
		}
		this._fBigWinControllers_bwc_arr = [];

		this._fIsSkipProhibited_bl = true;
		
		this._onAllAnimationsCompleteSuspision();
	}
	
	destroy()
	{
		if (this._gameField)
		{
			if (this._gameField.moneyWheelController)
			{
				this._gameField.moneyWheelController.off(MoneyWheelController.EVENT_ON_MONEY_WHEEL_WIN_REQUIRED, this._onMoneyWheelAwardRequired, this);
			}
		}
		
		super.destroy();
	}
}

export default BigWinsController;