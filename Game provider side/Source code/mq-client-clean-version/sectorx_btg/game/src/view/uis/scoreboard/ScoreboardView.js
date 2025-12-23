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
import GameScreen from '../../../main/GameScreen';
import * as Easing from '../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { Utils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import AtlasConfig from '../../../config/AtlasConfig';
import { AtlasSprite } from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';

const MAX_PLAYERS = 6;

const TIME_DEFAULT_COLOR = 0xffffff;
const TIME_OVER_COLOR = 0xffffff;

const TIME_FORMAT = {
	fontFamily: "fnt_nm_barlow_bold_digits",
	fontSize: 17,
	align: "left",
	fill: TIME_DEFAULT_COLOR
};

const PRIZE_FORMAT = {
	fontFamily: "fnt_nm_barlow_bold",
	fontSize: 17,
	align: "left",
	fill: 0xffffff
};

const MAX_PRIZE_TEXT_WIDTH = 60;

const MULTIPLIER_OFFSET_Y = -90;

let _particlesTextures = null;
function _initParticlesTextures()
{
	if (_particlesTextures) return;

	_particlesTextures = AtlasSprite.getFrames(APP.library.getAsset("critical_hit/critical_particles"), AtlasConfig.CriticalParticles, "");
}

class ScoreboardView extends SimpleUIView
{

	static get EVENT_ON_BOSS_ROUND_MODE_HIDDEN() 		{ return 'onBossRoundModeHidden';}
	static get EVENT_ON_TIME_IS_OVER() 					{ return 'EVENT_ON_TIME_IS_OVER';}
	static get EVENT_ON_SCORE_BOARD_SCORES_UPDATED() 	{ return 'EVENT_ON_SCORE_BOARD_SCORES_UPDATED';}
	static get EVENT_ON_BOSS_TITLE_HIDDEN()				{return 'EVENT_ON_BOSS_TITLE_HIDDEN';}
	static get EVENT_ON_YOU_WIN_MULTIPLIER_LANDED() 	{ return 'EVENT_ON_YOU_WIN_MULTIPLIER_LANDED';}
	static get EVENT_ON_ALL_BOSS_SCORES_UPDATED()		{ return 'EVENT_ON_ALL_BOSS_SCORES_UPDATED'; }

	constructor()
	{
		super();

		this._fContainer_spr = null;
		this._fScoreboardItemsAdditionalCellsBackground_gr = null;
		this._fRemainingTimeContainer_spr = null;
		this._fTimerTitle_tf = null;
		this._fTime_tf = null;
		this._fScoreboardItems_si_arr = [];
		this._fCurrentAmountOfPlayers_num = 0;
		this._fIsBossRoundMode_bl = false;

		this._fBossRoundBackground_g = null;
		this._fBossScoreTitle_tf = null;
		this._fSortTimer_t = null;
		this._fIsTimeIsOverEventSend_bl = null;

		this._fAppliedTimeColor_int = undefined;
		this._fPrevLastSecond_int = undefined;

		this._fBossMultiplierContainer_spr = null;
		this._fLandingFlare_sprt = null;
		this._fMultiplierGlowView_ta = null;
		this._fMultiplierView_ta = null;
		this._fParticles_arr = [];
		this._fIsMultiplierAnimationPlaying_bl = null;

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			_initParticlesTextures();
		}

		this._init();
	}

	get _isBossSubround()
	{
		return APP.gameScreen.gameStateController.info.isBossSubround || APP.gameScreen.gameFieldController.isBossEnemyExist;
	}

	get isMultiplierAnimating()
	{
		return this._isMultiplierAnimating;
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

		if (this._isMultiplierAnimating)
		{
			return true;
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

	get isItemsBossCounting()
	{
		for (let lItem_si of this._fScoreboardItems_si_arr)
		{
			if (lItem_si.isBossCounterInProgress)
			{
				return true;
			}
		}

		return false;
	}

	get contentContainerHeight()
	{
		return this._fContainer_spr.getBounds().height;
	}

	i_interruptAnimations()
	{
		this._sortItems(true);

		if (!this._fIsBossRoundMode_bl)
		{
			this.i_hideBossRoundPanel();
		}

		this._interruptMultiplierAnimations();
	}

	i_needSortItems(aOptSkipAnimation_bl)
	{
		this._sortItems(aOptSkipAnimation_bl);
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

		this._drawBackgroundForAdditionalCells();

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
		if (!this._isBossSubround)
		{
			this._onTimeToHideBossScoreTitle(0, true);
		}
	}

	i_calculateBossRoundWins()
	{
		if (!this._fIsBossRoundMode_bl || this._fIsMultiplierAnimationPlaying_bl)
		{
			return;
		}

		this._fSortTimer_t && this._fSortTimer_t.destructor();
		this._fSortTimer_t = null;

		let lArrLength_num = this._fScoreboardItems_si_arr && this._fScoreboardItems_si_arr.length;
		for (let i = 0; i < lArrLength_num; i++)
		{
			let lItem_si = this._fScoreboardItems_si_arr[i];
			lItem_si.i_showAdditionalCellWinCounting();
			this.emit(ScoreboardView.EVENT_ON_SCORE_BOARD_SCORES_UPDATED, {seatId: lItem_si.seatId, win: lItem_si.totalScore});
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
		
		this._resetTimeBlinking();

		this._fPrize_tf.text = '';

		this._fPrevLastSecond_int = undefined;
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
		this._aScoresBySeatId_obj_arr = aScoresBySeatId_obj_arr;
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
			this.emit(ScoreboardView.EVENT_ON_SCORE_BOARD_SCORES_UPDATED, {seatId: lSeatId_num, win: this._fScoreboardItems_si_arr[lItemIndex_num].totalScore});
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
			this.emit(ScoreboardView.EVENT_ON_SCORE_BOARD_SCORES_UPDATED, {seatId: lSeatId_num, win: this._fScoreboardItems_si_arr[lItemIndex_num].totalScore + lScore_num});
		}

		this._sortItems();
	}

	i_addBossRoundScoreForLostBoss(aData_obj)
	{
		this.i_addBossRoundScore(aData_obj);
	}

	i_addToContainer(aContainerInfo_obj)
	{
		aContainerInfo_obj.container.addChild(this);
		this.position.set(12, 112);
		this.zIndex = aContainerInfo_obj.zIndex;
	}

	i_hideAdditionalCells(aForce_bl)
	{
		let lArrLength_num = Array.isArray(this._fScoreboardItems_si_arr) && this._fScoreboardItems_si_arr.length;
		lArrLength_num && this._fScoreboardItems_si_arr[lArrLength_num-1].on(ScoreboardItem.EVENT_ON_ADDITIONAL_CELL_DISAPPEARED, this._onBossRoundModeHidden.bind(this), this);
		for (let i = 0; i < lArrLength_num; i++)
		{
			let lItem_si = this._fScoreboardItems_si_arr[i];
			lItem_si.i_hideAdditionalCell(i*2*FRAME_RATE, aForce_bl);
		}
		this._fScoreboardItemsAdditionalCellsBackground_gr.clear();
	}

	//MULTIPLIER
	i_timeToPresentMultiplier(aPlayerWinSeatId_num, aIsCoPlayerWin_bl)
	{
		if (this._fIsMultiplierAnimationPlaying_bl)
		{
			return;
		}

		this._fIsMultiplierAnimationPlaying_bl = true;
		this._fCurrenWintSeatId_int = aPlayerWinSeatId_num;
		this._fIsMasterWin_bl = !aIsCoPlayerWin_bl;
		this._startMultiplierAnimation();
		this._startMultiplierGlowAnimation();
	}

	_startParticle(aPos_obj, aRot_num, aOptScale_num=2.5)
	{
		let lParticle_sprt = this._fBossMultiplierContainer_spr.addChild(new Sprite());
		this._fParticles_arr.push(lParticle_sprt);
		lParticle_sprt.textures = _particlesTextures;
		lParticle_sprt.blendMode = PIXI.BLEND_MODES.ADD;
		lParticle_sprt.scale.set(aOptScale_num);
		lParticle_sprt.rotation = aRot_num;
		lParticle_sprt.position.set(aPos_obj.x, aPos_obj.y);
		lParticle_sprt.animationSpeed = 30/60;
		lParticle_sprt.on('animationend', () => {
			let id = this._fParticles_arr.indexOf(lParticle_sprt);
			if (~id)
			{
				this._fParticles_arr.splice(id, 1);
			}
			lParticle_sprt && lParticle_sprt.destroy();
			lParticle_sprt = null;

			if (this._fParticles_arr.length == 0)
			{
				this._fParticles_arr = null;
			}
		});
		lParticle_sprt.play();
		lParticle_sprt.fadeTo(0, 12*FRAME_RATE);
	}

	_generateMultiplierView()
	{
		if (this._fIsMasterWin_bl)
		{
			return APP.library.getSprite("boss_mode/dragon_mult");
		}

		return APP.library.getSprite("boss_mode/dragon_mult_silver");
	}

	get _multiplierInitialParams()
	{
		return {x: 0, y: -50, scale: 500};
	}

	get _multuiplierPosSequence()
	{
		let lPos_seq = [
			{tweens: [],	duration: 20*FRAME_RATE},
			{tweens: [	{prop: "position.x", to: 0},	{prop: "position.y", to: -72}],	duration: 5*FRAME_RATE, ease: Easing.cubic.easeIn}
		]

		return lPos_seq;
	}

	get _multiplierScaleSequence()
	{
		let lScale_seq = [
			{tweens: [],	duration: 20*FRAME_RATE},
			{tweens: [	{prop: "scale.x", to: 0.9*1.7},	{prop: "scale.y", to: 0.9*1.7}],		duration: 5*FRAME_RATE, ease: Easing.quadratic.easeOut},
			{tweens: [],	duration: 2*FRAME_RATE},
			{tweens: [	{prop: "scale.x", to: 1.3*1.7},		{prop: "scale.y", to: 1.3*1.7}],	duration: 3*FRAME_RATE, ease: Easing.quadratic.easeIn},
			{tweens: [	{prop: "scale.x", to: 0.96*1.7},	{prop: "scale.y", to: 0.96*1.7}],	duration: 5*FRAME_RATE, ease: Easing.quadratic.easeIn},
			{tweens: [	{prop: "scale.x", to: 1.00*1.7},	{prop: "scale.y", to: 1.00*1.7}],	duration: 8*FRAME_RATE, ease: Easing.quadratic.easeIn},
			{tweens: [	{prop: "scale.x", to: 0.90*1.7},	{prop: "scale.y", to: 0.90*1.7}],	duration: 3*FRAME_RATE, ease: Easing.quadratic.easeIn},
			{tweens: [	{prop: "scale.x", to: 1.30*1.7},	{prop: "scale.y", to: 1.30*1.7}],	duration: 3*FRAME_RATE, ease: Easing.quadratic.easeIn,
			onfinish: ()=>{
				this._startMultiplierFinalAnimation();
			}
		}];

		return lScale_seq;
	}

	get positionScoreboardItemOfWinningPlayer()
	{
		let lItemView_si = this.getItemView(this._fCurrenWintSeatId_int);
		let lGlobalPos_p = lItemView_si ? lItemView_si.targetBossMultiplierGlobalPosition : new PIXI.Point(160, 270);
		lGlobalPos_p.x -= APP.config.size.width/2;
		lGlobalPos_p.y -= MULTIPLIER_OFFSET_Y + APP.config.size.height/2;

		if (this._fIsMasterWin_bl)
		{
			lGlobalPos_p.y += 11;
		}

		let lTargetMultPos_p = this.globalToLocal(lGlobalPos_p.x, lGlobalPos_p.y);

		return lTargetMultPos_p;
	}

	_endMultiplierSequence()
	{
		this._fMultiplierView_ta && Sequence.destroy(Sequence.findByTarget(this._fMultiplierView_ta));
		this._fMultiplierView_ta && this._fMultiplierView_ta.destroy();
		this._fMultiplierView_ta = null;

		this._multiplierAnimationCompletedSuspicion();
	}

	_startMultiplierAnimation()
	{
		this._fMultiplierView_ta = this._fBossMultiplierContainer_spr.addChild(this._generateMultiplierView());
		let lInitialParams = this._multiplierInitialParams;
		this._fMultiplierView_ta.scale.set(lInitialParams.scale);
		this._fMultiplierView_ta.position.set(lInitialParams.x, lInitialParams.y);

		let lScale_seq = this._multiplierScaleSequence;
		let lPos_seq = this._multuiplierPosSequence;

		Sequence.start(this._fMultiplierView_ta, lScale_seq);
		lPos_seq && Sequence.start(this._fMultiplierView_ta, lPos_seq);
	}

	_startMultiplierFinalAnimation()
	{
		let lFirstTargetMultPos_p = this.positionScoreboardItemOfWinningPlayer;

		let lScale_seq = [
			{tweens: [	{prop: "scale.x", to: 0.12*1.7},	{prop: "scale.y", to: 0.12*1.7},
						{prop: "position.x", to: lFirstTargetMultPos_p.x}, {prop: "position.y", to: lFirstTargetMultPos_p.y}],
				duration: 5*FRAME_RATE, ease: Easing.quadratic.easeOut, onfinish: ()=>{
					this._endMultiplierFinalAnimation();
				}}
		];

		Sequence.start(this._fMultiplierView_ta, lScale_seq);
	}

	_endMultiplierFinalAnimation()
	{
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			let lTargetMultPos_p = this.positionScoreboardItemOfWinningPlayer;
			this._fMultiplierView_ta.position.set(lTargetMultPos_p);
			this._fParticles_arr = this._fParticles_arr || [];
			this._startParticle({x: lTargetMultPos_p.x, y: lTargetMultPos_p.y}, 0, 1.2);
			this._startParticle({x: lTargetMultPos_p.x, y: lTargetMultPos_p.y}, Math.PI/2, 1.2);
			this._startParticle({x: lTargetMultPos_p.x, y: lTargetMultPos_p.y}, Math.PI, 1.2);
			this._startParticle({x: lTargetMultPos_p.x, y: lTargetMultPos_p.y}, Math.PI*3/2, 1.2);
			this._startMultiplyerLandingAnimation({x: lTargetMultPos_p.x, y: lTargetMultPos_p.y});
		}

		let lItemView_si = this.getItemView(this._fCurrenWintSeatId_int);
		lItemView_si && lItemView_si.i_doubleUpBossScores();

		this._endMultiplierSequence();
	}

	_generateMultiplierGlowView()
	{
		let lGlowView = APP.library.getSprite("boss_mode/dragon_mult_glow");
		lGlowView.scale.set(2);
		lGlowView.blendMode = PIXI.BLEND_MODES.ADD;
		return lGlowView;
	}

	_startMultiplierGlowAnimation()
	{
		this._fMultiplierGlowView_ta = this._fMultiplierView_ta.addChild(this._generateMultiplierGlowView());
		this._fMultiplierGlowView_ta.alpha = 1;

		let lAlpha_seq = [
			{tweens: [],	duration: 20*FRAME_RATE},
			{tweens: [],							duration: 3*FRAME_RATE, ease: Easing.cubic.easeIn},
			{tweens: [	{prop: "alpha", to: 0}],	duration: 4*FRAME_RATE, ease: Easing.cubic.easeIn},
			{tweens: [],							duration: 17*FRAME_RATE},
			{tweens: [	{prop: "alpha", to: 1}],	duration: 3*FRAME_RATE, ease: Easing.cubic.easeIn},
			{tweens: [	{prop: "alpha", to: 0}],	duration: 4*FRAME_RATE, ease: Easing.cubic.easeIn, onfinish: ()=>{
				this._endMultiplierGlowSequence();
			}}
		];

		Sequence.start(this._fMultiplierGlowView_ta, lAlpha_seq);
	}

	_endMultiplierGlowSequence()
	{
		this._fMultiplierGlowView_ta && Sequence.destroy(Sequence.findByTarget(this._fMultiplierGlowView_ta));
		this._fMultiplierGlowView_ta && this._fMultiplierGlowView_ta.destroy();
		this._fMultiplierGlowView_ta = null;

		this._multiplierAnimationCompletedSuspicion();
	}

	get multLandingFlareAnimation()
	{
		return this._fLandingFlare_sprt || (this._fLandingFlare_sprt = this._initMultLandingFlareAnimation());
	}

	_initMultLandingFlareAnimation()
	{
		this._fLandingFlare_sprt = this._fBossMultiplierContainer_spr.addChild(APP.library.getSprite("boss_mode/dragon_mult_flare"));
		this._fLandingFlare_sprt.blendMode = PIXI.BLEND_MODES.SCREEN;
		this._fLandingFlare_sprt.visible = false;

		return this._fLandingFlare_sprt;
	}

	_startMultiplyerLandingAnimation(aPos_p)
	{
		let lLandingFlare_sprt = this.multLandingFlareAnimation;
		lLandingFlare_sprt.scale.set(0.57*2);
		lLandingFlare_sprt.position.set(aPos_p.x, aPos_p.y);

		let l_seq = [
			{tweens: [], duration: 2*FRAME_RATE, onfinish: ()=>{ lLandingFlare_sprt.visible = true; }},
			{tweens: [	{prop: "scale.x", to: 0}, 
						{prop: "scale.y", to: 0}, 
						{prop: "rotation", to: Utils.gradToRad(45)} ],	duration: 15*FRAME_RATE, onfinish: ()=>{ this._onLandingFlareSeqCompleted(); }}
		];

		Sequence.start(lLandingFlare_sprt, l_seq);
	}

	_onLandingFlareSeqCompleted()
	{
		let lLandingFlare_sprt = this.multLandingFlareAnimation;
		Sequence.destroy(Sequence.findByTarget(lLandingFlare_sprt));
		lLandingFlare_sprt.destroy();
		this._fLandingFlare_sprt = null;

		this._multiplierAnimationCompletedSuspicion();
	}

	get _isMultiplierAnimating()
	{
		return	this._fMultiplierView_ta ||
				this._fLandingFlare_sprt ||
				this._fMultiplierGlowView_ta ;
	}

	_multiplierAnimationCompletedSuspicion()
	{
		if (this._isMultiplierAnimating) return;

		this._fIsMultiplierAnimationPlaying_bl = false;
		this.emit(ScoreboardView.EVENT_ON_YOU_WIN_MULTIPLIER_LANDED);
	}

	_interruptMultiplierAnimations()
	{
		this._fLandingFlare_sprt && Sequence.destroy(Sequence.findByTarget(this._fLandingFlare_sprt));
		this._fLandingFlare_sprt = null;

		this._fMultiplierGlowView_ta && Sequence.destroy(Sequence.findByTarget(this._fMultiplierGlowView_ta));
		this._fMultiplierGlowView_ta && this._fMultiplierGlowView_ta.destroy();
		this._fMultiplierGlowView_ta = null;

		this._fMultiplierView_ta && Sequence.destroy(Sequence.findByTarget(this._fMultiplierView_ta));
		this._fMultiplierView_ta && this._fMultiplierView_ta.destroy();
		this._fMultiplierView_ta = null;

		while (this._fParticles_arr && this._fParticles_arr.length)
		{
			this._fParticles_arr.pop().destroy();
		}

		this._fParticles_arr = [];
		this._fIsMultiplierAnimationPlaying_bl = null;
	}
	//MULTIPLIER

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

		this._fScoreboardItemsAdditionalCellsBackground_gr = this._fContainer_spr.addChild(new PIXI.Graphics());
		
		for (let i = 0; i < MAX_PLAYERS; i++)
		{
			let l_si = new ScoreboardItem();
			l_si.position.set(0, 29*i);
			l_si.i_setPosition(i);
			l_si.on(ScoreboardItem.EVENT_ON_BOSS_COUNTING_COMPLETED, this._onItemFinishedCounting, this);
			//l_si.filters = [new PIXI.filters.DropShadowFilter(90, 2, 0x000000, 0.5)];
			this._fContainer_spr.addChild(l_si);
			this._fScoreboardItems_si_arr.push(l_si);
		}

		this._fContainer_spr.position.set(-10, 80);

		// BOSS SCORE TITLE FOR BOSS ROUND ...
		let lItemMainBackgroundWidth_num  = ScoreboardItem.i_getItemBackgroundWidth();
		let lAdditionalCellWidth_num = ScoreboardItem.i_getAdditionalCellBackgroundWidth();
		let lMask_g = this._fContainer_spr.addChild(new PIXI.Graphics());
		lMask_g.beginFill(0x00ff00).drawRect(lItemMainBackgroundWidth_num + 1, -27, lAdditionalCellWidth_num+2, 25);

		this._fBossRoundBackground_g = this._fContainer_spr.addChild(new PIXI.Graphics());
		this._fBossRoundBackground_g.beginFill(0x350f53).drawRoundedRect(0, 0, lAdditionalCellWidth_num, 25, 4);
		this._fBossRoundBackground_g.position.set(lItemMainBackgroundWidth_num + 1, 10); //below the mask
		this._fBossRoundBackground_g.mask = lMask_g;

		let lBGBounds_obj = this._fBossRoundBackground_g.getBounds();
		this._fBossScoreTitle_tf = this._fBossRoundBackground_g.addChild(I18.generateNewCTranslatableAsset('TABattlegroundScoreboardBossScore'));
		this._fBossScoreTitle_tf.position.set(lBGBounds_obj.width/2, lBGBounds_obj.height/2);
		// ... BOSS SCORE TITLE FOR BOSS ROUND

		this._initPrizePoolPanel();
		this._initTimerPanel();

		this._fBossMultiplierContainer_spr = this.addChild(new Sprite());
		this._fBossMultiplierContainer_spr.position.set(APP.config.size.width/2, MULTIPLIER_OFFSET_Y + APP.config.size.height/2);
	}

	_initPrizePoolPanel()
	{
		let lHeigth_num = ScoreboardItem.i_getItemBackgroundHeight();
		
		let lPositionY_num = (MAX_PLAYERS + 1) * lHeigth_num + 1; // approximate eposition of th 8th item. The gap will appear because each item has position = height - 1

		this._fPrizePoolContainer_spr = this._fContainer_spr.addChild(new Sprite());
		this._fPrizePoolContainer_spr.position.set(0, lPositionY_num); 

		let lPrizeBackground_sprt = this._fPrizePoolContainer_spr.addChild(APP.library.getSprite("battleground/scoreboard/scoreboard_prize_bg"));
		lPrizeBackground_sprt.scale.set(1.145, 1.1);
		lPrizeBackground_sprt.anchor.set(0);

		this._fPrizeTitle_tf = this._fPrizePoolContainer_spr.addChild(I18.generateNewCTranslatableAsset('TABattlegroundScoreboardPrize'));

		let lPrizeBGBounds_obj = lPrizeBackground_sprt.getBounds();
		let lPositionX_num = lPrizeBGBounds_obj.width/2 + 37;
		this._fPrize_tf = this._fPrizePoolContainer_spr.addChild(new TextField(PRIZE_FORMAT));
		this._fPrize_tf.anchor.set(0.5, 0.5);
		this._fPrize_tf.maxWidth = MAX_PRIZE_TEXT_WIDTH;
		this._fPrize_tf.position.set(lPositionX_num, lPrizeBGBounds_obj.height/2);
	}

	_initTimerPanel()
	{
		let lHeigth_num = ScoreboardItem.i_getItemBackgroundHeight();
		let lPositionY_num = MAX_PLAYERS * lHeigth_num - 2; // approximate eposition of th 7th item. The gap will appear because each item has position = height - 1

		this._fRemainingTimeContainer_spr = this._fContainer_spr.addChild(new Sprite());
		this._fRemainingTimeContainer_spr.position.set(0, lPositionY_num);

		let lRemainingTimeContainerBackground_sprt = this._fRemainingTimeContainer_spr.addChild(APP.library.getSprite("battleground/scoreboard/scoreboard_time_bg")); 
		lRemainingTimeContainerBackground_sprt.scale.set(1.145, 1.1);
		lRemainingTimeContainerBackground_sprt.anchor.set(0);

		//TEXT ROUND ENDS IN...
		this._fTimerTitle_tf = this._fRemainingTimeContainer_spr.addChild(I18.generateNewCTranslatableAsset('TABattlegroundScoreboardRoundEndsIn'));
		//...TEXT ROUND ENDS IN

		//TIMER...

		let lTimeBGBounds_obj = lRemainingTimeContainerBackground_sprt.getBounds();
		let lPositionX_num = lTimeBGBounds_obj.width/2 + 59;
		this._fTime_tf = this._fRemainingTimeContainer_spr.addChild(new TextField(TIME_FORMAT));
		this._fTime_tf.anchor.set(1, 0.5);
		this._fTime_tf.maxWidth = lTimeBGBounds_obj.width - 18;
		this._fTime_tf.position.set(lPositionX_num, lTimeBGBounds_obj.height/2);
		//...TIMER

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

		APP.gameScreen.on(GameScreen.EVENT_ON_TICK_OCCURRED, this._onGSTickOccurred, this);
	}

	_drawBackgroundForAdditionalCells()
	{
		let lStartXPosition_num = ScoreboardItem.i_getItemBackgroundWidth() + 1;
		let lStartYPosition_num = 0;
		let lWidth_num = ScoreboardItem.i_getAdditionalCellBackgroundWidth() + 2;
		let lHeigth_num = ( ScoreboardItem.i_getItemBackgroundHeight() * MAX_PLAYERS) - 5;

		this._fScoreboardItemsAdditionalCellsBackground_gr.beginFill(0x615843).drawRoundedRect(lStartXPosition_num, lStartYPosition_num, lWidth_num, lHeigth_num, 3);
		this._fScoreboardItemsAdditionalCellsBackground_gr.alpha = 0.83;
	}

	_sortItems(aOptSkipAnimation_bl=false)
	{
		if(!this._aScoresBySeatId_obj_arr) return;

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
		Sequence.destroy(Sequence.findByTarget(this._fBossRoundBackground_g));

		let l_seq = [
			{
				tweens: [
					{prop: 'position.y', to: -27}
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
					this.emit(ScoreboardView.EVENT_ON_BOSS_TITLE_HIDDEN, {force: aForce_bl});
				}
			}
		];
		Sequence.start(this._fBossRoundBackground_g, l_seq, aOptDelay_num);
	}

	_onItemFinishedCounting(e)
	{
		for (const item of this._fScoreboardItems_si_arr)
		{
			if (item.isBossCounterInProgress) {
				return;
			}
		}

		this.emit(ScoreboardView.EVENT_ON_ALL_BOSS_SCORES_UPDATED);
	}

	_onBossRoundModeHidden()
	{
		this.emit(ScoreboardView.EVENT_ON_BOSS_ROUND_MODE_HIDDEN);
		this._fIsBossRoundMode_bl = false;

		for (let lItem_si of this._fScoreboardItems_si_arr)
		{
			this.emit(ScoreboardView.EVENT_ON_SCORE_BOARD_SCORES_UPDATED, {seatId: lItem_si.seatId, win: lItem_si.totalScore});
		}
	}

	_formatPrize(aValuePerPerson_num)
	{
		let lPrize_num = aValuePerPerson_num * this._fCurrentAmountOfPlayers_num;
		let lStartPrizeToConvert_num = 100000; //the prize will be converted only if it is more that 100K

		this._fPrize_tf.text = APP.currencyInfo.i_formatNumber(lPrize_num, true, true, 2, lStartPrizeToConvert_num)
	}

	_formatTime()
	{
		let l_si = this.uiInfo;

		let lText_str = "";
		let lTextColor_int = TIME_DEFAULT_COLOR;
		
		if (l_si.isRoundStartTimeDefined && l_si.isRoundStartTimeDefined)
		{
			if (l_si.isRoundTimeIsOver)
			{
				this._fPrevLastSecond_int = undefined;

				this._playTimeBlinking();
				lTextColor_int = TIME_OVER_COLOR;
			}
			else
			{
				this._resetTimeBlinking();
			}

			let lRestDuration_num = l_si.restRoundDuration;
			if (lRestDuration_num < 0)
			{
				lRestDuration_num = 0;
			}

			if (lRestDuration_num > l_si.roundPlayableDuration)
			{
				lRestDuration_num = l_si.roundPlayableDuration;
			}

			let lSecondsCount_int = Math.floor((lRestDuration_num / 1000) % 60);
			let lMinutesCount_int = Math.floor((lRestDuration_num / (1000 * 60)) % 60);

			let lSecondsCount_str = (lSecondsCount_int < 10) ? "0" + lSecondsCount_int : "" + lSecondsCount_int;
			let lMinutesCount_str = (lMinutesCount_int == 0) ? "" : "" + lMinutesCount_int;

			lText_str = lMinutesCount_str + ':' + lSecondsCount_str;

			if (!l_si.isRoundTimeIsOver && lMinutesCount_int == 0 && lSecondsCount_int <= 3)
			{
				if (this._fPrevLastSecond_int != lSecondsCount_int)
				{
					let lMillisecondsCount_int = Math.floor(lRestDuration_num % 1000);

					if (lMillisecondsCount_int > 500)
					{
						this._fPrevLastSecond_int = lSecondsCount_int;
						this.emit(ScoreboardView.EVENT_ON_SCORE_BOARD_LAST_SECONDS, {seconds: lSecondsCount_int});
					}
				}
			}
		}
		else
		{
			this._resetTimeBlinking();
		}

		this._fTime_tf.text = lText_str;

		if (this._fAppliedTimeColor_int !== lTextColor_int)
		{
			this._fTime_tf.updateFontColor(lTextColor_int);

			this._fAppliedTimeColor_int = lTextColor_int;
		}
		
	}

	_playTimeBlinking()
	{
		if (!this._fBlinkingTimerTimeline_mtl)
		{
			return;
		}

		if (!this._fBlinkingTimerTimeline_mtl.isPlaying())
		{
			this._fBlinkingTimerTimeline_mtl.playLoop();
		}
	}

	_resetTimeBlinking()
	{
		if (!this._fBlinkingTimerTimeline_mtl)
		{
			return;
		}

		if (this._fBlinkingTimerTimeline_mtl.isPlaying())
		{
			this._fBlinkingTimerTimeline_mtl.stop();
		}

		this._fTime_tf.alpha = 1;
	}

	_onGSTickOccurred(event)
	{
		this._formatTime();
	}

	destroy()
	{
		super.destroy();

		this._fContainer_spr && this._fContainer_spr.destroy();
		this._fContainer_spr = null;
		this._fRemainingTimeContainer_spr = null;
		this._fTimerTitle_tf = null;
		this._fTime_tf = null;
		this._fCurrentAmountOfPlayers_num = null;
		this._fIsBossRoundMode_bl = null;
		this._aScoresBySeatId_obj_arr = null;
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

		this._fBlinkingTimerTimeline_mtl && this._fBlinkingTimerTimeline_mtl.destroy();
		this._fBlinkingTimerTimeline_mtl = null;

		this._fAppliedTimeColor_int = undefined;
		this._fPrevLastSecond_int = undefined;

		this._interruptMultiplierAnimations();
		this._fBossMultiplierContainer_spr = null;
	}
}

export default ScoreboardView;