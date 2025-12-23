import Sprite from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import YouWinAnimation from './YouWinAnimation';
import YouWinCoinsAward from './YouWinCoinsAward';

class BossModeWinAnimation extends Sprite
{
	static get EVENT_ON_BOSS_WIN_AWARD_COUNTED()		{return "EVENT_ON_BOSS_WIN_AWARD_COUNTED";}
	static get EVENT_ON_COIN_LANDED() 					{ return YouWinCoinsAward.EVENT_ON_COIN_LANDED; }
	static get EVENT_ON_BOSS_WIN_PAYOUT_APPEARED() 		{ return YouWinAnimation.EVENT_ON_BIG_WIN_PAYOUT_APPEARED; }
	static get EVENT_ON_BOSS_WIN_MULTIPLIER_LANDED() 	{ return YouWinAnimation.EVENT_ON_YOU_WIN_MULTIPLIER_LANDED; }
	static get EVENT_ON_BOSS_WIN_AWARD_PRESENTATION_COMPLETED()		{return "EVENT_ON_BOSS_WIN_AWARD_PRESENTATION_COMPLETED";}

	startWinAnimation()
	{
		this._startWinAnimation();
	}

	get uncountedWin()
	{
		return this._fUncountedWin_num;
	}

	get notLandedWin()
	{
		return this._fNotLandedWin_num;
	}

	get isMasterWin()
	{
		return this._fIsMasterWin_bl;
	}

	get isWinPresentationInProgress()
	{
		return this._fIsInProgress_bl;
	}

	constructor(aPayoutValue_num, aIsMasterWin_bl, aSeatId_int)
	{
		super();

		this._fPayoutValue_num = aPayoutValue_num;
		this._fIsMasterWin_bl = aIsMasterWin_bl;
		this._fSeatId_int = aSeatId_int;

		this._fUncountedWin_num = this._fPayoutValue_num;
		this._fNotLandedWin_num = this._fPayoutValue_num;

		this._fIsInProgress_bl = false;
	}

	_startWinAnimation()
	{
		this._fIsInProgress_bl = true;

		let lYouWinAnim = this.addChild(new YouWinAnimation(this._fPayoutValue_num, this._fIsMasterWin_bl, this._fSeatId_int));

		lYouWinAnim.once(YouWinAnimation.EVENT_ON_BIG_WIN_COINS_REQUIRED, this._onBigWinCoinsRequired, this);
		lYouWinAnim.once(YouWinAnimation.EVENT_ON_BIG_WIN_PAYOUT_APPEARED, this.emit, this);
		lYouWinAnim.once(YouWinAnimation.EVENT_ON_YOU_WIN_MULTIPLIER_LANDED, this.emit, this);

		lYouWinAnim.startAnimation();
	}

	_onBigWinCoinsRequired(event)
	{
		this._startFinalCoinsAnimation(this._fPayoutValue_num, this._fSeatId_int, this._fIsMasterWin_bl);
	}

	_startFinalCoinsAnimation(aWinValue_num, aSeatId_int, aIsMasterWin_bl)
	{
		let lStartPos_obj = this._screenCenterPoint;

		let spot = APP.currentWindow.gameField.getSeat(aSeatId_int, true);
		let lFinishPos_obj = spot ? spot.spotVisualCenterPoint : null;
		if (lFinishPos_obj)
		{
			lFinishPos_obj = this.globalToLocal(lFinishPos_obj.x, lFinishPos_obj.y);
		}

		let lYouWinCoinsAward = this._fYouWinCoinsAward_ywca = this.addChild(new YouWinCoinsAward(aWinValue_num, aIsMasterWin_bl, aSeatId_int, lStartPos_obj, lFinishPos_obj, this._screenCenterPoint));
		lYouWinCoinsAward.on(YouWinCoinsAward.EVENT_ON_COIN_LANDED, this._onCoinLanded, this);
		lYouWinCoinsAward.on(YouWinCoinsAward.EVENT_AWARDING_COMPLETED, this._onYouWinCoinsAwardCompleted, this);
		lYouWinCoinsAward.i_startAnimation(40);
	}

	get _screenCenterPoint()
	{
		return {x: 0, y: 0};
	}

	_onCoinLanded(event)
	{
		this._fNotLandedWin_num -= event.money;

		this.emit(BossModeWinAnimation.EVENT_ON_COIN_LANDED, event);
	}

	_onYouWinCoinsAwardCompleted(event)
	{
		let lYouWinCoinsAward = event.target;
		this._fUncountedWin_num -= lYouWinCoinsAward.totalWin;
		
		if (this._fIsMasterWin_bl)
		{
			this.emit(BossModeWinAnimation.EVENT_ON_BOSS_WIN_AWARD_COUNTED, {money: lYouWinCoinsAward.totalWin});
		}

		this._completePresentation();
	}

	_completePresentation()
	{
		this._fIsInProgress_bl = false;

		this.emit(BossModeWinAnimation.EVENT_ON_BOSS_WIN_AWARD_PRESENTATION_COMPLETED);
	}

	destroy()
	{
		this._fPayoutValue_num = undefined;
		this._fIsMasterWin_bl = undefined;
		this._fSeatId_int = undefined;
		this._fIsInProgress_bl = undefined;

		super.destroy();
	}
}

export default BossModeWinAnimation;