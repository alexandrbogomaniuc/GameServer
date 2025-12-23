import SimpleUIController from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/uis/base/SimpleUIController';
import BigWinsInfo from '../../../../model/uis/awarding/big_win/BigWinsInfo';
import BigWinsView from '../../../../view/uis/awarding/big_win/BigWinsView';
import BigWinController from './BigWinController';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import GameScreen from '../../../../main/GameScreen';
import { BIG_WIN_PAYOUT_RATIOS } from '../../../../model/uis/awarding/big_win/BigWinInfo';
import GameField from '../../../../main/GameField';
import Timer from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import { HIT_RESULT_MONEY_WHEEL_WIN_ID } from './../../prizes/PrizesController';
import MoneyWheelController from './../../quests/wheel/MoneyWheelController';

const SKIP_DELAY = 1200;

class BigWinsController extends SimpleUIController {

	static get EVENT_ON_COIN_LANDED() 				{ return BigWinController.EVENT_ON_COIN_LANDED; }
	static get EVENT_ON_BIG_WIN_AWARD_COUNTED() 	{ return BigWinController.EVENT_ON_BIG_WIN_AWARD_COUNTED; }
	static get EVENT_ON_ANIMATION_INTERRUPTED() 	{ return BigWinController.EVENT_ON_ANIMATION_INTERRUPTED; }
	static get EVENT_ON_ALL_ANIMATIONS_COMPLETED() 	{ return "EVENT_ON_ALL_ANIMATIONS_COMPLETED"; }
	static get EVENT_ON_BIG_WIN_STARTED()			{ return "EVENT_ON_BIG_WIN_STARTED"; }
	static get EVENT_ON_PENDING_BIG_WINS_SKIPPED()	{ return "EVENT_ON_PENDING_BIG_WINS_SKIPPED"; }
	
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
				|| (this._fPendingAnimBigWinValues_num_arr && this._fPendingAnimBigWinValues_num_arr.length);
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
		this._fPendingMoneyWheelsWin_arr = [];

		this._fSkipTimer_tmr = null;
		this._fIsSkipProhibited_bl = true;
		this._fPendingAnimBigWinValues_num_arr = [];
	}

	__initControlLevel()
	{
		super.__initControlLevel();

		this._gameScreen = APP.currentWindow;
		this._gameScreen.on(GameScreen.EVENT_ON_GAME_FIELD_SCREEN_CREATED, this._onGameFieldScreenCreated, this);
		this._gameScreen.on(GameScreen.EVENT_ON_HIT_AWARD_EXPECTED, this._onHitAwardExpected, this);

		this._fPlayerInfo_pi = APP.playerController.info;
	}

	_onGameFieldScreenCreated()
	{
		this._gameField = this._gameScreen.gameField;
		this._gameField.on(GameField.EVENT_ON_BULLET_TARGET_TIME, this._onBulletTargetTime, this);
		this._gameField.on(GameField.EVENT_ON_TRY_TO_SKIP_BIG_WIN, this._onTryToSkipBigWin, this);
		this._gameField.on(GameField.EVENT_ON_ROOM_FIELD_CLEARED, this._onRoomFieldCleared, this);

		this._gameField.moneyWheelController.on(MoneyWheelController.EVENT_ON_MONEY_WHEEL_WIN_REQUIRED, this._onMoneyWheelAwardRequired, this);
	}

	_onHitAwardExpected(event)
	{
		let lHitData_obj = event.hitData;

		if (lHitData_obj.seatId !== event.masterSeatId) return;

		let result = this._checkIfBigWinAnimationNeeded(lHitData_obj);

		if (!!result)
		{
			this._fPendingAnimBigWinValues_num_arr.push(result.totalWin);
		}
		else
		{
			if (lHitData_obj.skipAwardedWin)
			{
				return;
			}
		}
	}

	_onMoneyWheelAwardRequired(aEvent_obj)
	{
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

					this._generateBigWinController(pendingWheel.totalWin, pendingWheel.shotStake);
					this._fPendingMoneyWheelsWin_arr.splice(key, 1);
				}
			}
		}
	}

	_onBulletTargetTime(aEvent_obj)
	{
		const data = aEvent_obj.data;

		if (data.seatId !== this._fPlayerInfo_pi.seatId) return; // for master player only

		let result = this._checkIfBigWinAnimationNeeded(data);
		
		if (!result) return;
		if (result.isMoneyWheel)
		{
			this._fPendingMoneyWheelsWin_arr.push(result);
			return;
		}

		if (this._fPendingMoneyWheelsWin_arr && this._fPendingMoneyWheelsWin_arr.length > 0)
		{
			// "простые" биг вины (которые без колеса поднимаются) - мы пропускаем, если к моменту их отрисовки еще крутится какое-то колесо, влекущее за собой свой биг вин
			// то есть, саму анимацию биг вина пропустим, но его вин зачисляем

			let lSkippedBigWinValue_num = result.totalWin;
			this._removePendingBigWinValue(lSkippedBigWinValue_num);
			this.emit(BigWinsController.EVENT_ON_PENDING_BIG_WINS_SKIPPED, {skippedPendingBigWinsValue: lSkippedBigWinValue_num});
			return;
		}

		this._generateBigWinController(result.totalWin, result.shotStake);
	}

	_checkIfBigWinAnimationNeeded(data)
	{
		let lTotalWin_num = 0;
		let lMoneyWheelsAmount_num  = 0;

		if (!data || !data.affectedEnemies)
		{
			return false;
		}

		for (let affectedEnemy of data.affectedEnemies)
		{
			if (affectedEnemy.data.class == "Hit")
			{
				const innerData = affectedEnemy.data;
				lTotalWin_num += innerData.win + innerData.killBonusPay + innerData.multiplierPay;
				let currentSeat = APP.playerController.info.seatId;
				if (innerData.hitResultBySeats && innerData.hitResultBySeats[currentSeat])
				{
					let hitResult = innerData.hitResultBySeats[currentSeat];
					for (let award of hitResult)
					{
						if (award.id == HIT_RESULT_MONEY_WHEEL_WIN_ID && +award.value > 0)
						{
							lTotalWin_num += +award.value;
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
			console.error("No betLevel value in Hit response!", data);
			return false;
		}
		if (data.isPaidSpecialShot == null)
		{
			console.error("No isPaidSpecialShot value in Hit response!");
			return false;
		}

		let lShotStake_num = this._fPlayerInfo_pi.currentStake * data.betLevel;

		const lRatio_num = lTotalWin_num / lShotStake_num;
		if (lRatio_num >= BIG_WIN_PAYOUT_RATIOS.BIG)
		{
			return {totalWin: lTotalWin_num, shotStake: lShotStake_num, isMoneyWheel: (lMoneyWheelsAmount_num > 0), moneyWheelsAmount: lMoneyWheelsAmount_num, rid: data.rid};
		}
		return false;
	}

	_generateBigWinController(aTotalWin_num, aShotStake_num)
	{
		this._removePendingBigWinValue(aTotalWin_num);
		
		this.view.addToContainerIfRequired(this.bigWinsContainerInfo);

		let l_bwc = new BigWinController(aTotalWin_num, aShotStake_num, this.view);
		l_bwc.i_init();
		l_bwc.on(BigWinController.EVENT_ON_ANIMATION_COMPLETED, this._onBigWinAnimationCompleted, this);
		l_bwc.on(BigWinController.EVENT_ON_COIN_LANDED, this.emit, this);
		l_bwc.on(BigWinController.EVENT_ON_BIG_WIN_AWARD_COUNTED, this.emit, this);
		l_bwc.on(BigWinController.EVENT_ON_ANIMATION_INTERRUPTED, this.emit, this);

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
			},
			SKIP_DELAY
		);
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

	_onRoomFieldCleared(event)
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

		this._fPendingMoneyWheelsWin_arr = []; // no need to send money from _fPendingMoneyWheelsWin_arr to ammo, as we have already sent that money from _fPendingAnimBigWinValues_num_arr

		for (let lBigWinController_bwc of this._fBigWinControllers_bwc_arr)
		{
			lBigWinController_bwc.i_interrupt();
			lBigWinController_bwc.destroy();
		}
		this._fBigWinControllers_bwc_arr = [];

		this._fIsSkipProhibited_bl = true;
		
		this._onAllAnimationsCompleteSuspision();
	}
}

export default BigWinsController;