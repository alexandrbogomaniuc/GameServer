import SimpleUIController from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/uis/base/SimpleUIController';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { WHEEL_POSITION_STATES, WHEEL_POSITION } from '../../../../view/uis/quests/wheel/WheelView';
import WheelView from '../../../../view/uis/quests/wheel/WheelView';
import PrizesController from '../../prizes/PrizesController';
import WinTierUtil from '../../../../main/WinTierUtil';
import { Sequence } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import { FRAME_RATE } from '../../../../../../shared/src/CommonConstants';
import Enemy from '../../../../main/enemies/Enemy';
import CommonEffectsManager from './../../../../main/CommonEffectsManager';
import { Sprite } from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import { Utils } from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import GameField from '../../../../main/GameField';
import GameScreen from '../../../../main/GameScreen';

class MoneyWheelController extends SimpleUIController
{
	static get EVENT_ON_TIME_TO_FINAL_PANEL_ANIM() 				{ return WheelView.EVENT_ON_TIME_TO_FINAL_PANEL_ANIM };
	static get EVENT_ON_WIN_MULTIPLIER_ANIMATION_COMPLETED()	{ return WheelView.EVENT_ON_WIN_VALUE_ANIMATION_COMPLETED };
	static get EVENT_ON_WHEEL_MOVED_TO_STATE_POSITION() 		{ return WheelView.EVENT_ON_WHEEL_MOVED };
	static get EVENT_ON_WIN_ANIMATION_STARTED() 				{ return WheelView.EVENT_ON_WIN_ANIMATION_STARTED };
	static get EVENT_ON_WIN_ANIMATION_COMPLETED() 				{ return WheelView.EVENT_ON_WIN_ANIMATION_COMPLETED };
	static get EVENT_ON_WHEEL_MOVE_TO_POSITION_STATE_STARTED() 	{ return WheelView.EVENT_ON_WHEEL_MOVE_STARTED };

	static get EVENT_ON_MONEY_WHEEL_OCCURED()					{ return "onMoneyWheelOccured" };
	static get EVENT_ON_MONEY_WHEEL_WIN_REGISTER()				{ return "onWheelWinRegister" };
	static get EVENT_ON_MONEY_WHEEL_WIN_REQUIRED()				{ return "onWheelWinRequired" };
	static get EVENT_ON_ALL_ANIMATIONS_COMPLETED()				{ return "onAllAnimationsCompleted" };

	get isWinAnimationInProgress()
	{
		return this.view ? this.view.isWinAnimationInProgress : false;
	}

	get isAnimInProgress()
	{
		return (!!this._fFlare_sprt || !!this._fFlareSequence_fs || (this.view ? this.view.isAnimInProgress : false) || !!this.info.currentHitData || this.isWinAnimationInProgress);
	}

	interruptAnimations()
	{
		this._interrupt();
	}

	constructor(aOptInfo_usuii, aOptView_uo)
	{
		super(aOptInfo_usuii, aOptView_uo);

		this._fFlare_sprt = null;
		this._fFlareSequence_fs = null;
	}

	__initControlLevel()
	{
		super.__initControlLevel();

		// let questPanelController = this._questPanelController = APP.gameScreen.gameField.keysQuestPanelController;
		// questPanelController.on(QuestPanelController.EVENT_ON_QUEST_COMPLETE_ANIMATIONS_COMPLETED, this._onQuestPanelWinAnimationCompleted, this);

		// let questsController = APP.gameScreen.questsController;
		// questsController.on(QuestsController.EVENT_ON_COMPLETED_QUEST_PRIZE_VALUE_REGISTERED, this._onNewCompletedQuestControllerPrizeRegistered, this);

		this._gameScreen = APP.currentWindow;

		this._gameScreen.prizesController.on(PrizesController.i_EVENT_ON_TIME_TO_SHOW_MONEY_WHEEL_PRIZE, this._onTimeToStartAward, this);
		this._gameScreen.on(GameScreen.EVENT_ON_HIT_AWARD_EXPECTED, this._onHitAwardExpected, this);

		this._gameField = this._gameScreen.gameField;
		
		if (this._gameField.isGameplayStarted())
		{
			this._startListenRoundFieldMessages();
		}
		
		this._gameScreen.on(GameScreen.EVENT_ON_GAME_FIELD_SCREEN_CREATED, this._onGameFieldScreenCreated, this);
		this._gameScreen.on(GameScreen.EVENT_ON_ROOM_PAUSED, this._onRoomPaused, this);
		this._gameScreen.on(GameScreen.EVENT_ON_ROOM_UNPAUSED, this._onRoomUnpaused, this);
	}

	__initViewLevel()
	{
		super.__initViewLevel();

		let lView = this.view;

		lView.on(WheelView.EVENT_ON_TIME_TO_FINAL_PANEL_ANIM, this.emit, this);
		lView.on(WheelView.EVENT_ON_WIN_VALUE_ANIMATION_COMPLETED, this._onWinValueAnimationCompleted, this);
		lView.on(WheelView.EVENT_ON_WHEEL_MOVE_STARTED, this.emit, this);
		lView.on(WheelView.EVENT_ON_WHEEL_MOVED, this._onWheelMovedToStatePosition, this);
		lView.on(WheelView.EVENT_ON_WIN_ANIMATION_STARTED, this.emit, this);
		lView.on(WheelView.EVENT_ON_WIN_ANIMATION_COMPLETED, this._winAnimationCompleted, this);

		lView.data = APP.playerController.info.moneyWheelPayouts;

		lView.resetView();
	}

	_onGameFieldScreenCreated(event)
	{
		this._startListenRoundFieldMessages();		
	}

	_startListenRoundFieldMessages()
	{
		this._gameField.on(GameField.EVENT_ON_ROOM_FIELD_CLEARED, this._onRoomFieldCleared, this);
	}

	_onRoomPaused(event)
	{
		this._interrupt();
	}

	_onRoomUnpaused(event)
	{

	}

	_onRoomFieldCleared(event)
	{
		this._interrupt();
	}

	_interrupt()
	{
		if (this._fFlare_sprt)
		{
			Sequence.destroy(Sequence.findByTarget(this._fFlare_sprt));
			this._fFlareSequence_fs = null;
			this._fFlare_sprt.destroy();
			this._fFlare_sprt = null;
		}

		this._fSmokeContainer_sprt && this._fSmokeContainer_sprt.destroy();
		this._fSmokeContainer_sprt = null;

		this.view && this.view.resetView();
		this.info && this.info.clear();
	}

	_onHitAwardExpected(event)
	{
		if (event.hitData.seatId !== event.masterSeatId) return;

		if (!event.hitData.moneyWheelWin || event.hitData.skipAwardedWin) return;

		let lHitData_obj = event.hitData;
		
		this.emit(MoneyWheelController.EVENT_ON_MONEY_WHEEL_WIN_REGISTER, {hitData: lHitData_obj, awardedWin: lHitData_obj.moneyWheelWin});
	}

	_onTimeToStartAward(event)
	{
		let lHitData_obj = event.hitData;
		this._addNewMoneyWheelDateToQueue(lHitData_obj);
		
		this._tryStartAnotherAnimation();
	}

	_addNewMoneyWheelDateToQueue(aHitData_obj)
	{
		let lNewRid_num = aHitData_obj.rid;
		let lCurrentHitData = this.info.currentHitData;

		let lWheelsData_arr = this.info.hitDataArray;
		if (!lWheelsData_arr || !lWheelsData_arr.length)
		{
			lWheelsData_arr.push(aHitData_obj);
			return;
		}

		for (let i=lWheelsData_arr.length-1; i>=0; i--)
		{
			if (lWheelsData_arr[i].rid == aHitData_obj.rid)
			{
				lWheelsData_arr.splice(i+1, 0, aHitData_obj);
				return;
			}			
		}

		let lCurPlayingWheelData = this.info.currentHitData;
		if (!!lCurrentHitData && lCurrentHitData.rid == aHitData_obj.rid)
		{
			lWheelsData_arr.unshift(aHitData_obj);
			return;
		}

		lWheelsData_arr.push(aHitData_obj);
	}

	_onQuestPanelWinAnimationCompleted(event)
	{
		if (this.view)
		{
			this.view.onQuestPanelWinAnimationCompleted();
		}
	}

	_onNewCompletedQuestControllerPrizeRegistered(event)
	{
		this._onCompletedQuestWinValueReadyToShow();
	}

	_onCompletedQuestWinValueReadyToShow(event)
	{
		let questController = event.target;
		let awardedWin = questController.info.collectedPrizeAmount;
	}

	_onWheelMovedToStatePosition(event)
	{
		this.emit(event);

		if (!this.info.currentHitData)
		{
			return;
		}

		let lView = this.view;
		let curWinMultiplier = this.info.currentHitData.moneyWheelWin/APP.playerController.info.currentStake;
		lView.showWin(curWinMultiplier, this.info.currentHitData.betLevel);
	}

	_startAnimation()
	{
		let lHitData_obj = this.info.hitDataArray.shift();
		this.info.currentHitData = lHitData_obj;
		let enemyId = (lHitData_obj.enemy) ? lHitData_obj.enemy.id : lHitData_obj.enemyId;

		let enemy = APP.currentWindow.gameField.getDeathEnemy(enemyId);
		if (enemy && !enemy.isCritter && !enemy.isBonesFellDown)
		{
			enemy.once(Enemy.EVENT_ON_DEATH_ANIMATION_BONES_FELL_DOWN, this._onDeadEnemyBonesFellDown, this);
			enemy.once(Sprite.EVENT_ON_DESTROYING, this._onDeadEnemyDestroying, this);			
		}
		else
		{
			this._startFlareAnimation();
		}

		this.emit(MoneyWheelController.EVENT_ON_MONEY_WHEEL_OCCURED);
	}

	_onDeadEnemyBonesFellDown(event)
	{
		let targetEnemy = event.target;
		targetEnemy.off(Sprite.EVENT_ON_DESTROYING, this._onDeadEnemyDestroying, this, true);

		this._startFlareAnimation();
	}

	_onDeadEnemyDestroying(event)
	{
		this._startFlareAnimation();
	}

	_startFlareAnimation()
	{
		let lHitData_obj = this.info.currentHitData;
		if (!lHitData_obj) return;
		let enemyId = (lHitData_obj.enemy) ? lHitData_obj.enemy.id : lHitData_obj.enemyId;
		let enemyPos = APP.currentWindow.gameField.getEnemyPosition(enemyId);
		if (!enemyPos)
		{
			this._startMainAnimation();
			return;
		}
		enemyPos.y -= 10;
		let lFlare_sprt = this._fFlare_sprt = this.view.addChild(APP.library.getSprite("common/orange_flare_glowed"));
		lFlare_sprt.scale.set(0.58);
		lFlare_sprt.position.set(enemyPos.x, enemyPos.y);
		lFlare_sprt.blendMode = PIXI.BLEND_MODES.ADD;

		let lDist_num = Utils.getDistance2(enemyPos.x, enemyPos.y, 960/2, 540/2);
		let lDist2_num = Utils.getDistance2(0, 0, 960/2, 540/2);
		let lDur_num = (lDist_num / lDist2_num) * 20;
		if (lDur_num < 6) lDur_num = 6;
		let l_seq = [{tweens: [{prop: "position.x", to: 960/2}, {prop: "position.y", to: 540/2}], duration: lDur_num*FRAME_RATE, onfinish: ()=>{
			lFlare_sprt && lFlare_sprt.destroy();
			lFlare_sprt = null;
			this._fFlare_sprt = null;

			this._fSmokeContainer_sprt && this._fSmokeContainer_sprt.destroy();
			this._fSmokeContainer_sprt = null;

			this._fFlareSequence_fs = null;

			this._startMainAnimation();
		}}];

		this._fSmokeContainer_sprt = this.view.addChild(new Sprite());
		this._fSmokeContainer_sprt.position.set(enemyPos.x, enemyPos.y);
		this._generateSmoke({x: -10, y: -5}, Math.PI);
		this._generateSmoke({x: 10, y: 5}, 2*Math.PI);
		this._generateSmoke({x: -5, y: 10}, -Math.PI/2);

		this._fFlareSequence_fs = Sequence.start(lFlare_sprt, l_seq);
	}

	_generateSmoke(aPos_obj, aAngle_num)
	{
		let smoke = this._fSmokeContainer_sprt.addChild(new Sprite);
		smoke.position.set(aPos_obj.x, aPos_obj.y);
		smoke.textures = CommonEffectsManager.getDieSmokeUnmultTextures();
		smoke.rotation = aAngle_num;
		smoke.anchor.set(0.57, 0.81);
		smoke.animationSpeed = 9.5;
		smoke.scale.set(2);
		smoke.on('animationend', ()=>{smoke.destroy()});
		smoke.play();
	}

	_startMainAnimation()
	{
		this.view.startAnimation();
	}

	_onWinValueAnimationCompleted(e)
	{
		let lAwardingController_ac = APP.currentWindow.awardingController;
		let lContainer_sprt = lAwardingController_ac.awardingContainerInfo.container;
		let lSpot = APP.gameScreen.gameField.spot;
		let lHitData_obj = this.info.currentHitData;
		if (lAwardingController_ac && lSpot && lContainer_sprt && lHitData_obj)
		{
			let lCurrentStake_num = APP.playerController.info.currentStake;
			let lStartPos_obj = lContainer_sprt.globalToLocal(WHEEL_POSITION.x+10, WHEEL_POSITION.y-24);
			let lFinalPos_obj = lSpot.spotVisualCenterPoint;

			let pendingAwardInfo = lAwardingController_ac.getPendingAwardInfo(this.info.awardId);

			let isBigWin = lHitData_obj.skipAwardedWin;
			if (!pendingAwardInfo)
			{
				if (isBigWin)
				{
					this.emit(MoneyWheelController.EVENT_ON_MONEY_WHEEL_WIN_REQUIRED, {data: null, isBigWin: isBigWin, rid: lHitData_obj.rid});
				}
				return;
			}

			let data = [lHitData_obj.moneyWheelWin,
				lCurrentStake_num,
				{
					start: lStartPos_obj,
					startOffset: {x: 0, y: 0},
					winPoint: lFinalPos_obj,
					specifiedWinSoundTier: WinTierUtil.WIN_TIERS.TIER_BIG,
					isQualifyWinDevalued: (pendingAwardInfo.isQualifyWinDevalued || false),
					awardId: this.info.awardId, // added as unique id to remove award info from the queue (AwardingController._awardsInfo_arr)
					seatId: APP.playerController.info.seatId,
					isMoneyWheelAward: true
				}
			];

			this.emit(MoneyWheelController.EVENT_ON_MONEY_WHEEL_WIN_REQUIRED, {data: data, rid: lHitData_obj.rid});
		}
	}

	_tryStartAnotherAnimation()
	{
		if (this.info.hitDataArray && this.info.hitDataArray.length && !this.isAnimInProgress)
		{
			this._startAnimation();
		}
	}

	_winAnimationCompleted()
	{
		this.info.resetCurrentHitData();

		if (!this.info.hitDataArray || (this.info.hitDataArray && !this.info.hitDataArray.length))
		{
			this.emit(MoneyWheelController.EVENT_ON_ALL_ANIMATIONS_COMPLETED);
		}

		this._tryStartAnotherAnimation();
	}

	destroy()
	{
		super.destroy();

		this._fFlare_sprt = null;
		this._fFlareSequence_fs && this._fFlareSequence_fs.destructor();
	}
}

export default MoneyWheelController;
