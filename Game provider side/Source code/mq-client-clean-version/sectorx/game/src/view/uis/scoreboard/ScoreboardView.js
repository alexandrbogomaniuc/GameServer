import { Sequence } from "../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation";
import Timer from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import { Sprite } from "../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display";
import TextField from "../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/TextField";
import SimpleUIView from "../../../../../../common/PIXI/src/dgphoenix/unified/view/base/SimpleUIView";
import { FRAME_RATE } from "../../../../../shared/src/CommonConstants";
import ScoreboardItem from './ScoreboardItem';
import { APP } from "../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals";
import MTimeLine from "../../../../../../common/PIXI/src/dgphoenix/unified/controller/timeLine/MTimeLine";
import I18 from "../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18";

const MAX_PLAYERS = 6;

const TIME_FORMAT = {
	fontFamily: "fnt_nm_barlow_bold_digits",
	fontSize: 17,
	align: "left",
	fill: 0x000000
};

const PRIZE_FORMAT = {
	fontFamily: "fnt_nm_barlow_bold",
	fontSize: 17,
	align: "left",
	fill: 0x000000
};

class ScoreboardView extends SimpleUIView
{

	static get EVENT_ON_BOSS_ROUND_MODE_HIDDEN() 	{ return 'onBossRoundModeHidden';}
	static get EVENT_ON_TIME_IS_OVER() 			{ return 'EVENT_ON_TIME_IS_OVER';}

	constructor()
	{
		super();

		this._fContainer_spr = null;
		this._fRemainingTimeContainer_spr = null;
		this._fTimerBackground_spr = null;
		this._fTimerTitle_tf = null;
		this._fTime_tf = null;
		this._fScoreboardItems_si_arr = [];
		this._fCurrentAmountOfPlayers_num = 0;
		this._fIsBossRoundMode_bl = false;
		this._fEndTime_num = null;

		this._fBossRoundBackground_g = null;
		this._fBossScoreTitle_tf = null;

		this._fSortTimer_t = null;
		this._fTimeUpdateTimer_t = null;
		this._fIsTimerLockOnFinalCounting_bl = null;
		this._fIsTimeIsOverEventSend_bl = null;

		this._init();
	}

	get isAnimationsPlaying()
	{
		for (let lItem_si of this._fScoreboardItems_si_arr)
		{
			if (lItem_si.isAnimationsPlaying)
			{
				return true;
			}
		}

		if (
			Sequence.findByTarget(this._fBossRoundBackground_g).length > 0
			|| this._fIsBossRoundMode_bl
		)
		{
			return true;
		}

		return false;
	}

	i_interruptAnimations()
	{
		this._sortItems(true);

		if (!this._fIsBossRoundMode_bl)
		{
			this.i_hideBossRoundPanel();
		}
	}

	i_showBossRoundPanel(aOptForce_bl=false)
	{
		if (this._fIsBossRoundMode_bl)
		{
			return
		}

		this._fIsBossRoundMode_bl = true;
		let lArrLength_num = this._fScoreboardItems_si_arr && this._fScoreboardItems_si_arr.length;

		for (let i = 0; i < lArrLength_num; i++)
		{
			let lItem_si = this._fScoreboardItems_si_arr[i];
			lItem_si.i_showAdditionalCell(i*2*FRAME_RATE, aOptForce_bl);
		}

		if (aOptForce_bl)
		{
			this._onTimeToShowBossScoreTitle();
		}
		else
		{
			this._fScoreboardItems_si_arr[0].on(ScoreboardItem.EVENT_ON_ADDITIONAL_CELL_APPEARED, this._onTimeToShowBossScoreTitle.bind(this), this);
		}

		this._fSortTimer_t = new Timer(this._sortItems.bind(this), ScoreboardItem.i_getWinCountingDuration()/2, true);
	}

	i_hideBossRoundPanel()
	{
		this._onTimeToHideBossScoreTitle(0, true);
	}

	i_calculateBossRoundWins()
	{
		this._fSortTimer_t && this._fSortTimer_t.destructor();
		this._fSortTimer_t = null;

		let lArrLength_num = this._fScoreboardItems_si_arr && this._fScoreboardItems_si_arr.length;
		for (let i = 0; i < lArrLength_num; i++)
		{
			let lItem_si = this._fScoreboardItems_si_arr[i];
			lItem_si.i_showAdditionalCellWinCounting();
		}

		let lTitleHideDelay_num = ScoreboardItem.i_getWinCountingDuration() - ScoreboardItem.i_getAdditionalCellAnimationDuration()/2;
		this._onTimeToHideBossScoreTitle(lTitleHideDelay_num, false);
	}

	i_updatePlayersBetsInfo(aSeats_obj_arr)
	{
		let lIsSortNeeded_bl = true; // because this method is called when new dara is recieved. in the new data there are
		for (let lSeat_obj of aSeats_obj_arr)
		{
			let lItemIndex_num = this._getItemIndexInScoreboardBySeatId(lSeat_obj.seatId);

			if (lItemIndex_num === -1)
			{
				continue;
			}
			else
			{
				let lPlayerItem_si = this._fScoreboardItems_si_arr[lItemIndex_num];
				lPlayerItem_si.betAmount = lSeat_obj.betAmount

				if (lSeat_obj.winAmount !== lPlayerItem_si.totalScore) // probably some award animations is playing or being awaited, and there is no needs to sort before awards is shown
				{
					lIsSortNeeded_bl = false;
				}
			}
		}

		if (lIsSortNeeded_bl)
		{
			this._sortItems();
		}
	}

	i_resetScoreboard()
	{
		for (let lItem_si of this._fScoreboardItems_si_arr)
		{
			lItem_si.i_resetItem();
		}

		this._fCurrentAmountOfPlayers_num = 0;
		
		this._fBlinkingTimerTimeline_mtl && this._fBlinkingTimerTimeline_mtl.stop();
		this._fTime_tf.textFormat = {fill: 0x000000};
		this._fPrize_tf.text = '';
	}

	i_updatePrizePoolValue(aValuePerPerson_num)
	{
		this._formatPrize(aValuePerPerson_num);
	}

	i_updatePlayersInfo(aSeats_obj_arr)
	{
		this.i_resetScoreboard();

		for (let lSeat_obj of aSeats_obj_arr)
		{
			let lSeatId_num =  lSeat_obj.id;
			let lName_str = lSeat_obj.nickname;

			let lItemIndex_num = this._getItemIndexInScoreboardBySeatId(lSeatId_num);

			if (lItemIndex_num === -1)
			{
				lItemIndex_num = this._fCurrentAmountOfPlayers_num;
				this._fCurrentAmountOfPlayers_num += 1;
			}
			let lPlayerItem_si = this._fScoreboardItems_si_arr[lItemIndex_num];
			
			if (lPlayerItem_si !== undefined)
			{
				if (lPlayerItem_si.seatId === null)
				{
					lPlayerItem_si.seatId = lSeatId_num;
				}

				lPlayerItem_si.name = lName_str;
			}
	
			this._sortItems(true);
		}
	}

	i_updateAllScores(aScoresBySeatId_obj_arr, aBossScoresBySeatId_obj)
	{
		for (let lSeat_obj of aScoresBySeatId_obj_arr)
		{
			let lSeatId_num =  lSeat_obj.seatId;

			let lItemIndex_num = this._getItemIndexInScoreboardBySeatId(lSeatId_num);
			let lPlayerItem_si = this._fScoreboardItems_si_arr[lItemIndex_num];
			
			if (lPlayerItem_si !== undefined)
			{
				let lBossRoundScore_num = aBossScoresBySeatId_obj[lSeatId_num];
				let lUsualScore_num = lSeat_obj.winAmount - lBossRoundScore_num; //because winAmount already contains BossRound win
				lPlayerItem_si.i_setScore(lUsualScore_num, true);
				lPlayerItem_si.i_setBossRoundScore(lBossRoundScore_num, true);
			}
	
			this._sortItems(true);
		}
	}

	i_addScore(aData_obj)
	{
		let lSeatId_num = aData_obj.seatId;
		let lScore_num = aData_obj.win;
		
		let lItemIndex_num = this._getItemIndexInScoreboardBySeatId(lSeatId_num)

		if (lItemIndex_num !== -1) // if player is already playing
		{
			this._fScoreboardItems_si_arr[lItemIndex_num].i_incomeScore(lScore_num);
		}

		this._sortItems();
	}

	i_addBossRoundScore(aData_obj)
	{
		let lSeatId_num = aData_obj.seatId;
		let lScore_num = aData_obj.win;
		
		let lItemIndex_num = this._getItemIndexInScoreboardBySeatId(lSeatId_num)

		if (lItemIndex_num !== -1) // if player is already playing
		{
			this._fScoreboardItems_si_arr[lItemIndex_num].i_incomeBossRoundScore(lScore_num);
		}

		this._sortItems();
	}

	i_updateTimer(aValue_num)
	{
		if (this._fEndTime_num !== aValue_num)
		{
			this._fEndTime_num = aValue_num;
			this._formatTime();
		}
	}

	i_setTimerLock(aValue_bl)
	{
		this._fIsTimerLockOnFinalCounting_bl = aValue_bl;
		this._formatTime();
	}

	i_addToContainer(aContainerInfo_obj)
	{
		aContainerInfo_obj.container.addChild(this);
		this.position.set(0, 80);
		this.zIndex = aContainerInfo_obj.zIndex;
	}

	getItemView(aSeatId_num)
	{
		return this._fScoreboardItems_si_arr[this._getItemIndexInScoreboardBySeatId(aSeatId_num)];
	}

	_getItemIndexInScoreboardBySeatId(aSeatId_num)
	{
		if (typeof aSeatId_num !== 'number')
		{
			aSeatId_num = Number(aSeatId_num);
			if (isNaN(aSeatId_num))
			{
				return -1;
			}
		}

		for (let lItem_si of this._fScoreboardItems_si_arr)
		{
			if (lItem_si.seatId === aSeatId_num)
			{
				return lItem_si.currentPlace;
			}
		}
		return -1;
	}

	_init()
	{
		this._fContainer_spr = this.addChild(new Sprite());
		
		for (let i = 0; i < MAX_PLAYERS; i++)
		{
			let l_si = new ScoreboardItem();
			l_si.position.set(0, 29*i);
			l_si.i_setPosition(i);
			//l_si.filters = [new PIXI.filters.DropShadowFilter(90, 2, 0x000000, 0.5)];
			this._fContainer_spr.addChild(l_si);
			this._fScoreboardItems_si_arr.push(l_si);
		}

		this._fContainer_spr.position.set(-10, 80);

		// BOSS SCORE TITLE FOR BOSS ROUND ...
		let lItemMainBackgroundWidth_num  = ScoreboardItem.i_getItemBackgroundWidth();
		let lAdditionalCellWidth_num = ScoreboardItem.i_getAdditionalCellBackgroundWidth();
		let lMask_g = this._fContainer_spr.addChild(new PIXI.Graphics());
		lMask_g.beginFill(0x00ff00).drawRect(lItemMainBackgroundWidth_num, -25, lAdditionalCellWidth_num+2, 25);

		this._fBossRoundBackground_g = this._fContainer_spr.addChild(new PIXI.Graphics());
		this._fBossRoundBackground_g.beginFill(0x252525).drawRoundedRect(0, 0, lAdditionalCellWidth_num, 25, 4);
		this._fBossRoundBackground_g.position.set(lItemMainBackgroundWidth_num, 10); //below the mask
		this._fBossRoundBackground_g.mask = lMask_g;

		let lBGBounds_obj = this._fBossRoundBackground_g.getBounds();
		this._fBossScoreTitle_tf = this._fBossRoundBackground_g.addChild(I18.generateNewCTranslatableAsset('TABattlegroundScoreboardBossScore'));
		this._fBossScoreTitle_tf.position.set(lBGBounds_obj.width/2, lBGBounds_obj.height/2);
		// ... BOSS SCORE TITLE FOR BOSS ROUND

		this._initPrizePoolPanel();
		this._initTimerPanel()
	}

	_initPrizePoolPanel()
	{
		let lAlpha_num = ScoreboardItem.i_getItemAlphaByPosition(MAX_PLAYERS-1);
		let lWidth_num = ScoreboardItem.i_getItemBackgroundWidth();
		let lHeigth_num = ScoreboardItem.i_getItemBackgroundHeight();
		let lPositionY_num = MAX_PLAYERS * lHeigth_num - 2; // approximate eposition of th 7th item. The gap will appear because each item has position = height - 1

		this._fPrizePoolContainer_spr = this._fContainer_spr.addChild(new Sprite());
		this._fPrizePoolContainer_spr.position.set(0, lPositionY_num); 

		let lPrizeBackground_g = this._fPrizePoolContainer_spr.addChild(new PIXI.Graphics());
		lPrizeBackground_g.beginFill(0x252525, lAlpha_num).drawRoundedRect(0, 0, lWidth_num, lHeigth_num, 5);

		this._fPrizeTitle_tf = this._fPrizePoolContainer_spr.addChild(I18.generateNewCTranslatableAsset('TABattlegroundScoreboardPrize'));

		this._fPrizeBackground_spr = this._fPrizePoolContainer_spr.addChild(APP.library.getSprite('battleground/scoreboard/prize_background'));
		this._fPrizeBackground_spr.scale.set(1.1, 1.1);
		this._fPrizeBackground_spr.anchor.set(1, 0);
		this._fPrizeBackground_spr.position.set(lWidth_num, 1);

		let lTimeBGBounds_obj = this._fPrizeBackground_spr.getBounds();
		let lPositionX_num = lWidth_num - lTimeBGBounds_obj.width/2;
		this._fPrize_tf = this._fPrizePoolContainer_spr.addChild(new TextField(PRIZE_FORMAT));
		this._fPrize_tf.anchor.set(0.5, 0.5);
		this._fPrize_tf.maxWidth = lTimeBGBounds_obj.width - 18;
		this._fPrize_tf.position.set(lPositionX_num, ScoreboardItem.i_getItemBackgroundHeight()/2);
	}

	_initTimerPanel()
	{		
		let lAlpha_num = ScoreboardItem.i_getItemAlphaByPosition(MAX_PLAYERS-1);
		let lWidth_num = ScoreboardItem.i_getItemBackgroundWidth();
		let lHeigth_num = ScoreboardItem.i_getItemBackgroundHeight();
		let lPositionY_num = (MAX_PLAYERS + 1) * lHeigth_num + 1; // approximate eposition of th 8th item. The gap will appear because each item has position = height - 1

		this._fRemainingTimeContainer_spr = this._fContainer_spr.addChild(new Sprite());
		this._fRemainingTimeContainer_spr.position.set(0, lPositionY_num);

		let lRemainingTimeContainerBackground_g = this._fRemainingTimeContainer_spr.addChild(new PIXI.Graphics());
		lRemainingTimeContainerBackground_g.beginFill(0x252525, lAlpha_num).drawRoundedRect(0, 0, lWidth_num, lHeigth_num, 5);

		//TEXT ROUND ENDS IN...
		this._fTimerTitle_tf = this._fRemainingTimeContainer_spr.addChild(I18.generateNewCTranslatableAsset('TABattlegroundScoreboardRoundEndsIn'));
		//...TEXT ROUND ENDS IN

		//TIMER...
		this._fTimerBackground_spr = this._fRemainingTimeContainer_spr.addChild(APP.library.getSprite('battleground/scoreboard/timer_background'));
		this._fTimerBackground_spr.scale.set(1.1, 1.1);
		this._fTimerBackground_spr.anchor.set(1, 0);
		this._fTimerBackground_spr.position.set(lWidth_num, 1);

		let lTimeBGBounds_obj = this._fTimerBackground_spr.getBounds();
		let lPositionX_num = lTimeBGBounds_obj.x + lTimeBGBounds_obj.width;
		this._fTime_tf = this._fRemainingTimeContainer_spr.addChild(new TextField(TIME_FORMAT));
		this._fTime_tf.anchor.set(1, 0.5);
		this._fTime_tf.maxWidth = lTimeBGBounds_obj.width - 18;
		this._fTime_tf.position.set(lPositionX_num, ScoreboardItem.i_getItemBackgroundHeight()/2);
		//...TIMER

		this._fTimeUpdateTimer_t = new Timer(this._formatTime.bind(this), 30*FRAME_RATE, true);

		//BLINKING TIMELINE...
		let l_mtl = new MTimeLine();
		l_mtl.addAnimation(
			this._fTime_tf,
			MTimeLine.SET_ALPHA,
			1,
			[
				[0, 3],
				5,
				[1, 3],
				5,
			]);

		this._fBlinkingTimerTimeline_mtl = l_mtl;
		//...BLINKING TIMELINE
	}

	_sortItems(aOptSkipAnimation_bl=false)
	{
		let lSortedByScores_arr = this._fScoreboardItems_si_arr.sort((a, b)=>{
			return b.totalScore - a.totalScore || b.betAmount - a.betAmount; //in case if players have the same scores the result will be sorted by bets
		});

		for (let i = 0; i < 6; i++)
		{
			let lNewIndex_num = lSortedByScores_arr.indexOf(this._fScoreboardItems_si_arr[i]);

			this._fScoreboardItems_si_arr[i].i_setPosition(lNewIndex_num, aOptSkipAnimation_bl);
			//this._fScoreboardItems_si_arr.splice(lNewIndex_num, 0, this._fScoreboardItems_si_arr.splice(i, 1)[0])
		}
	}

	_onTimeToShowBossScoreTitle()
	{
		let l_seq = [
			{
				tweens: [
					{prop: 'position.y', to: -25}
				],
				duration: ScoreboardItem.i_getAdditionalCellAnimationDuration()/2,
				onfinish: ()=>{
					Sequence.destroy(Sequence.findByTarget(this._fBossRoundBackground_g));
				}
			}
		];

		Sequence.start(this._fBossRoundBackground_g, l_seq);
	}

	_onTimeToHideBossScoreTitle(aOptDelay_num, aForce_bl)
	{
		this._fIsBossRoundMode_bl = false;

		let lDuration_num;
		if (aForce_bl)
		{
			lDuration_num = 0;
			Sequence.destroy(Sequence.findByTarget(this._fBossRoundBackground_g));
		}
		else
		{
			lDuration_num = ScoreboardItem.i_getAdditionalCellAnimationDuration()/2;
		}

		let l_seq = [
			{
				tweens: [
					{prop: 'position.y', to: 10}
				],
				duration: lDuration_num,
				onfinish: ()=>{
					Sequence.destroy(Sequence.findByTarget(this._fBossRoundBackground_g));
					let lArrLength_num = Array.isArray(this._fScoreboardItems_si_arr) && this._fScoreboardItems_si_arr.length;
					lArrLength_num && this._fScoreboardItems_si_arr[lArrLength_num-1].on(ScoreboardItem.EVENT_ON_ADDITIONAL_CELL_DISAPPEARED, this._onBossRoundModeHidden.bind(this), this);
					for (let i = 0; i < lArrLength_num; i++)
					{
						let lItem_si = this._fScoreboardItems_si_arr[i];
						lItem_si.i_hideAdditionalCell(i*2*FRAME_RATE, aForce_bl);
					}
				}
			}
		];

		Sequence.start(this._fBossRoundBackground_g, l_seq, aOptDelay_num);
	}

	_onBossRoundModeHidden()
	{
		this.emit(ScoreboardView.EVENT_ON_BOSS_ROUND_MODE_HIDDEN);
	}

	_formatPrize(aValuePerPerson_num)
	{
		let lPrize_num = aValuePerPerson_num * this._fCurrentAmountOfPlayers_num;
		let lStartPrizeToConvert_num = 100000; //the prize will be converted only if it is more that 100K

		this._fPrize_tf.text = APP.currencyInfo.i_formatNumber(lPrize_num, true, true, 2, lStartPrizeToConvert_num)
	}

	_formatTime()
	{
		if (this._fIsTimerLockOnFinalCounting_bl)
		{
			this._fTime_tf.alpha = 1;
			this._fTime_tf.textFormat = {fill: 0x000000};
			this._fTime_tf.text = '--:--';
			return;
		}

		if (this._fEndTime_num === null)
		{
			this._fEndTime_num = APP.gameScreen.currentTime;
		}

		let lDifferenceInSec_num = (this._fEndTime_num - APP.gameScreen.currentTime) / 1000;

		if (lDifferenceInSec_num <= 0)
		{
			if (!this._fIsTimeIsOverEventSend_bl)
			{
				this._fIsTimeIsOverEventSend_bl = true;
				this.emit(ScoreboardView.EVENT_ON_TIME_IS_OVER);
			}

			lDifferenceInSec_num = 0;
			this._fTime_tf.textFormat = {fill: 0xcc1d00};

			if(
				this._fBlinkingTimerTimeline_mtl &&
				!this._fBlinkingTimerTimeline_mtl.isPlaying()
				)
			{
				this._fBlinkingTimerTimeline_mtl.playLoop();
			}
		}
		else
		{
			this._fIsTimeIsOverEventSend_bl = false;

			if(
				this._fBlinkingTimerTimeline_mtl &&
				this._fBlinkingTimerTimeline_mtl.isPlaying()
				)
			{
				this._fBlinkingTimerTimeline_mtl.stop();
			}
			
			this._fTime_tf.alpha = 1;
			this._fTime_tf.textFormat = {fill: 0x000000};
		}

		let lMinutes_str = (Math.floor(lDifferenceInSec_num/60)).toString();
		let lSeconds_str = (Math.trunc(lDifferenceInSec_num % 60)).toString();

		if (lMinutes_str === '0')
		{
			lMinutes_str = '';
		}

		if (lSeconds_str.length === 1)
		{
			lSeconds_str = '0' + lSeconds_str;
		}

		this._fTime_tf.text = lMinutes_str + ':' + lSeconds_str;
	}

	destroy()
	{
		super.destroy();

		this._fContainer_spr && this._fContainer_spr.destroy();
		this._fContainer_spr = null;
		this._fRemainingTimeContainer_spr = null;
		this._fTimerBackground_spr = null;
		this._fTimerTitle_tf = null;
		this._fTime_tf = null;
		this._fCurrentAmountOfPlayers_num = null;
		this._fIsBossRoundMode_bl = null;

		this._fBossRoundBackground_g = null;
		this._fBossScoreTitle_tf = null;

		for (let lItem_si of this._fScoreboardItems_si_arr)
		{
			lItem_si.destroy();
			lItem_si = null;
		}
		this._fScoreboardItems_si_arr = null;

		this._fSortTimer_t && this._fSortTimer_t.destructor();
		this._fSortTimer_t = null;

		this._fTimeUpdateTimer_t && this._fTimeUpdateTimer_t.destructor();
		this._fTimeUpdateTimer_t = null;

		this._fBlinkingTimerTimeline_mtl && this._fBlinkingTimerTimeline_mtl.destroy();
		this._fIsTimerLockOnFinalCounting_bl = null;
		this._fIsTimeIsOverEventSend_bl = null;
	}
}

export default ScoreboardView;