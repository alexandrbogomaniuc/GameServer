import SimpleUIView from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/SimpleUIView';
import BaseAward from './BaseAward';
import CoinsAward from './CoinsAward';
import Timer from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import FreezeAward from './FreezeAward';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import MoneyWheelAward from './MoneyWheelAward';

class AwardingView extends SimpleUIView
{
	static get EVENT_ON_AWARD_COUNTED()					{ return 'onAwardCounted'; }
	static get EVENT_ON_AWARD_ANIMATION_STARTED()		{ return 'onAwardAnimationStarted'; }
	static get EVENT_ON_AWARD_ANIMATION_INTERRUPTED()	{ return 'onAwardAnimationIneterrupted'; }
	static get EVENT_ON_AWARD_ANIMATION_COMPLETED()		{ return 'onAwardAnimationCompleted'; }
	static get EVENT_ON_ALL_ANIMATIONS_COMPLETED()		{ return 'onAllAnimationsCompleted'; }
	static get EVENT_ON_COIN_LANDED()					{ return 'onCoinLanded'; }
	static get EVENT_ON_PAYOUT_IS_VISIBLE()				{ return CoinsAward.EVENT_ON_PAYOUT_IS_VISIBLE; }

	static get AWARD_TYPE_COINS()						{return 0;}

	//INTERFACE...
	addToContainerIfRequired(aAwardingContainerInfo_obj)
	{
		this._addToContainerIfRequired(aAwardingContainerInfo_obj);
	}

	get isAnyAwardingInProgress()
	{
		return this._fAwardings_ba_arr.length > 0;
	}

	get isAnyMoneyWheelPayoutPresentationInProgress()
	{
		if (!this.isAnyAwardingInProgress)
		{
			return false;
		}

		for (let lAward_ba of this._fAwardings_ba_arr)
		{
			if (lAward_ba instanceof MoneyWheelAward && lAward_ba.isPayoutPresentationInProgress)
			{
				return true;
			}
		}

		return false;
	}

	get isFreezeAwardInProgress()
	{
		if (!this.isAnyAwardingInProgress)
		{
			return false;
		}

		for (let lAward_ba of this._fAwardings_ba_arr)
		{
			if (lAward_ba instanceof FreezeAward && lAward_ba.isPayoutPresentationInProgress)
			{
				return true;
			}
		}

		return false;
	}

	get hasUncountedAwards()
	{
		if (!this._fAwardings_ba_arr || !this._fAwardings_ba_arr.length)
		{
			return false;
		}

		for (let lAward_ba of this._fAwardings_ba_arr)
		{
			if (lAward_ba.uncountedValue > 0)
			{
				return true;
			}
		}

		return false;
	}

	set isFreezeAwardCanBePresented(aIsCaptionAnimationInProgress_bl)
	{
		this._fIsFreezeAwardCanBePresented_bl = aIsCaptionAnimationInProgress_bl;
	}

	showAwarding(aMoneyValue_num, aCurrentStake_num, aOptParams_obj, aStartShift_obj, aDelay_num)
	{
		//PREVENTING OUT OFF SCREEN...
		if(aOptParams_obj.start)
		{
			let lLeftMostBorderX_num = 50;
			let lRightMostBorderX_num = 910;
			let lTopMostBorderY_num = 50;
			let lBottomMostBorderY_num = 520;

			if(aOptParams_obj.start.x < lLeftMostBorderX_num)
			{
				aOptParams_obj.start.x = lLeftMostBorderX_num;
			}
			else if(aOptParams_obj.start.x > lRightMostBorderX_num)
			{
				aOptParams_obj.start.x = lRightMostBorderX_num;
			}

			if(aOptParams_obj.start.y < lTopMostBorderY_num)
			{
				aOptParams_obj.start.y = lTopMostBorderY_num;
			}
			else if(aOptParams_obj.start.y > lBottomMostBorderY_num)
			{
				aOptParams_obj.start.y = lBottomMostBorderY_num;
			}
		}
		//...PREVENTING OUT OF SCREEN

		this._showAwarding(aMoneyValue_num, aCurrentStake_num, aOptParams_obj, aStartShift_obj, aDelay_num);
	}

	removeAllAwarding()
	{
		this._removeAllAwarding();
	}

	removeMoneyWheelOrFreezeAwards()
	{
		this._removeMoneyWheelOrFreezeAwards();
	}

	destroyCoinsAwardsByDestinationSeatId(aSeatId_int)
	{
		this._destroyCoinsAwardsByDestinationSeatId(aSeatId_int);
	}

	getAwardByRid(aRid_num, aEnemyId_num)
	{
		if (this._fAwardings_ba_arr)
		{
			for (let lAward_ba of this._fAwardings_ba_arr)
			{
				if ((lAward_ba.rid === aRid_num) && (lAward_ba.enemyId === aEnemyId_num))
				{
					return lAward_ba;
				}
			}
		}

		return null;
	}

	getSameAwardCount(aRid_num, aSeatId_num)
	{
		return this._getSameAwardCount(aRid_num, aSeatId_num);
	}//...INTERFACE

	constructor()
	{
		super();

		this._fTimers_arr = [];
		this._fAwardings_ba_arr = [];
		this._fStackContainer_sprt = null;
		this._fIsFreezeAwardCanBePresented_bl = false;
	}

	//IMPLEMENTATION...
	_showAwarding(aMoneyValue_num, aCurrentStake_num, aOptParams_obj, aStartShift_obj, aDelay_num)
	{
		if (aMoneyValue_num > 0)
		{
			if (aDelay_num > 0)
			{
				this._fTimers_arr.push(new Timer(()=>this._showMoneyAward(aMoneyValue_num, aCurrentStake_num, aOptParams_obj, aStartShift_obj), aDelay_num));
			}
			else
			{
				this._showMoneyAward(aMoneyValue_num, aCurrentStake_num, aOptParams_obj);
			}

			this.emit(AwardingView.EVENT_ON_AWARD_ANIMATION_STARTED);
		}
	}

	_showMoneyAward(aMoneyValue_num, aCurrentStake_num, aOptParams_obj, aStartShift_obj = null)
	{
		let lAward_ba = this.addChild(this._generateAward(AwardingView.AWARD_TYPE_COINS, aOptParams_obj));
		lAward_ba.currentStake = aCurrentStake_num;
		if (aStartShift_obj)
		{
			aOptParams_obj.startOffset = aStartShift_obj;
		}

		if (lAward_ba instanceof FreezeAward && !this._fIsFreezeAwardCanBePresented_bl)
		{
			const lInterruptedAwardData_obj = this._prepareAwardAnimationInterrupting(lAward_ba);

			this.emit(AwardingView.EVENT_ON_AWARD_ANIMATION_INTERRUPTED, lInterruptedAwardData_obj);
				
			lAward_ba.destroy();

			return;
		}

		lAward_ba.showAwarding(aMoneyValue_num, aOptParams_obj);
		this._fAwardings_ba_arr.push(lAward_ba);

		this.emit(AwardingView.EVENT_ON_AWARD_ANIMATION_STARTED);
	}

	_prepareAwardAnimationInterrupting(aInterruptingAward_ba)
	{
		let lData_obj = {};
		lData_obj.money = aInterruptingAward_ba.uncountedValue;
		lData_obj.isQualifyWinDevalued = aInterruptingAward_ba.isWinDevalued;
		lData_obj.rid = aInterruptingAward_ba.rid;
		lData_obj.isMasterSeat = aInterruptingAward_ba.isMasterSeat;
		lData_obj.uncountedWin = aInterruptingAward_ba.uncountedValue - aInterruptingAward_ba.countedCoinsAmount;

		return lData_obj;
	}

	_onAwardAnimationFinished(aEvent_evnt)
	{
		this._completeAward(aEvent_evnt.target);
	}

	_completeAward(aAward_ba)
	{
		let lIndex_int = this._fAwardings_ba_arr.indexOf(aAward_ba);
		if (~lIndex_int)
		{
			this._fAwardings_ba_arr.splice(lIndex_int, 1);
		}

		this.emit(AwardingView.EVENT_ON_AWARD_ANIMATION_COMPLETED);

		if (this._fAwardings_ba_arr.length == 0)
		{
			this.emit(AwardingView.EVENT_ON_ALL_ANIMATIONS_COMPLETED);
		}
	}

	_interruptAward(aAward_ba)
	{
		this._completeAward(aAward_ba);
		aAward_ba.destroy();
	}

	_removeAllAwarding()
	{
		while (this._fAwardings_ba_arr.length)
		{
			let l_ba = this._fAwardings_ba_arr.shift();
			let lData_obj = {};
			if (l_ba.awardType === AwardingView.AWARD_TYPE_COINS)
			{
				lData_obj = this._prepareAwardAnimationInterrupting(l_ba);
			}

			this.emit(AwardingView.EVENT_ON_AWARD_ANIMATION_INTERRUPTED, lData_obj);
			l_ba.destroy();

			if (this._fAwardings_ba_arr.length == 0)
			{
				this.emit(AwardingView.EVENT_ON_ALL_ANIMATIONS_COMPLETED); // for the case when RoundResult screen is waiting for Awardings to be finished
			}
		}

		for (let lTimer_t of this._fTimers_arr)
		{
			lTimer_t.destructor();
		}
		this._fTimers_arr = [];
	}

	_removeMoneyWheelOrFreezeAwards()
	{
		for (let i=0; i<this._fAwardings_ba_arr.length; i++)
		{
			let lAward_ba = this._fAwardings_ba_arr[i];
			if (lAward_ba instanceof MoneyWheelAward || lAward_ba instanceof FreezeAward)
			{
				const lInterruptedAwardData_obj = this._prepareAwardAnimationInterrupting(lAward_ba);

				this.emit(AwardingView.EVENT_ON_AWARD_ANIMATION_INTERRUPTED, lInterruptedAwardData_obj);
				
				lAward_ba.destroy();
				this._fAwardings_ba_arr.splice(i, 1);
				i--;
			}
		}
	}

	_destroyCoinsAwardsByDestinationSeatId(aSeatId_int)
	{
		for (let i=0; i<this._fAwardings_ba_arr.length; i++)
		{
			let l_ba = this._fAwardings_ba_arr[i];
			if (l_ba instanceof CoinsAward)
			{
				if (l_ba.seatId === aSeatId_int)
				{
					this._interruptAward(l_ba);
					i--;
				}
			}
		}
	}

	_generateAward(aType_int, aOptParams_obj)
	{
		let lAward_ba;
		if (aType_int === AwardingView.AWARD_TYPE_COINS)
		{
			if (aOptParams_obj.isFreezeWin)
			{
				lAward_ba = new FreezeAward(this._fStackContainer_sprt, aType_int, aOptParams_obj);
			}
			else if (aOptParams_obj.isMoneyWheelWin)
			{
				lAward_ba = new MoneyWheelAward(this._fStackContainer_sprt, aType_int, aOptParams_obj);
			}
			else
			{
				lAward_ba = new CoinsAward(this._fStackContainer_sprt, aType_int, aOptParams_obj);
			}

			lAward_ba.once(BaseAward.EVENT_AWARD_COUNTED, (e) => {
				this.emit(AwardingView.EVENT_ON_AWARD_COUNTED, {
					money:e.value,
					isQualifyWinDevalued: e.isQualifyWinDevalued,
					rid: lAward_ba.rid,
					isMasterSeat: lAward_ba.isMasterSeat,
					isFreezeWin: aOptParams_obj.isFreezeWin
				});
			});

			lAward_ba.once(CoinsAward.EVENT_ON_PAYOUT_IS_VISIBLE, this.emit, this);
			lAward_ba.on(CoinsAward.EVENT_ON_COIN_LANDED, this.emit, this);
		}
		lAward_ba.once(BaseAward.EVENT_ANIMATION_COMPLETED, this._onAwardAnimationFinished, this);
		return lAward_ba;
	}

	_getSameAwardCount(aRid_num, aSeatId_num)
	{
		let lCount_num = 0;

		for (let lAward_ba of this._fAwardings_ba_arr)
		{
			if (lAward_ba.seatId == aSeatId_num && lAward_ba.rid == aRid_num && lAward_ba.isMassExplosive)
			{
				++lCount_num;
			}
		}
		--lCount_num; //excepting itself

		return lCount_num;
	}

	_addToContainerIfRequired(aAwardingContainerInfo_obj)
	{
		if (this.parent)
		{
			return;
		}

		aAwardingContainerInfo_obj.container.addChild(this);
		this.zIndex = aAwardingContainerInfo_obj.zIndex;
		this._fStackContainer_sprt = aAwardingContainerInfo_obj.stackContainer;
	}
	//...IMPLEMENTATION
}

export default AwardingView