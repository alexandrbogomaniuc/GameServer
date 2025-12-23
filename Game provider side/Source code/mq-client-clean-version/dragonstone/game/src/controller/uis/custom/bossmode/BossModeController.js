import SimpleUIController from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/uis/base/SimpleUIController';
import BossModeView from '../../../../view/uis/custom/bossmode/BossModeView';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import GameScreen from '../../../../main/GameScreen';
import GameField from '../../../../main/GameField';
import FragmentsPanelController from './../../dragonstones/FragmentsPanelController';
import Timer from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import TrajectoryUtils from '../../../../main/TrajectoryUtils';
import { TIMERS_TO_NEXT_ANIM, DRAGON_APPEAR_INVULNERABLE_TIME } from './../../../../view/uis/custom/bossmode/appearance/AppearanceView';
import BossModeHourglassController from './BossModeHourglassController';
import { ENEMY_TYPES, ENEMIES } from '../../../../../../shared/src/CommonConstants';
import { HIT_RESULT_SINGLE_CASH_ID } from '../../prizes/PrizesController';
import BigWinsController from '../../awarding/big_win/BigWinsController';

const WAIT_APPEARING_ANIM_DURATION = 1200;

class BossModeController extends SimpleUIController {
	static get EVENT_APPEARING_PRESENTATION_STARTED() { return BossModeView.EVENT_APPEARING_PRESENTATION_STARTED; }
	static get EVENT_APPEARING_PRESENTATION_COMPLETED() { return BossModeView.EVENT_APPEARING_PRESENTATION_COMPLETED; }
	static get EVENT_ON_CAPTION_ANIMATION_STARTED() { return BossModeView.EVENT_ON_CAPTION_ANIMATION_STARTED; }
	static get EVENT_ON_TIME_TO_SCALE_MAP() { return BossModeView.EVENT_ON_TIME_TO_SCALE_MAP; }
	static get EVENT_ON_TIME_TO_BLUR_MAP() { return BossModeView.EVENT_ON_TIME_TO_BLUR_MAP; }
	static get EVENT_DISAPPEARING_PRESENTATION_STARTED() { return BossModeView.EVENT_DISAPPEARING_PRESENTATION_STARTED; }
	static get EVENT_DISAPPEARING_PRESENTATION_COMPLETED() { return BossModeView.EVENT_DISAPPEARING_PRESENTATION_COMPLETED; }
	static get EVENT_ON_FADED_BACK_HIDE_REQUIRED() { return BossModeView.EVENT_ON_FADED_BACK_HIDE_REQUIRED; }
	static get EVENT_ON_GROUND_BURN_REQUIRED() { return BossModeView.EVENT_ON_GROUND_BURN_REQUIRED; }
	static get EVENT_ON_IDLE_ANIMATION_STARTING() { return BossModeView.EVENT_ON_IDLE_ANIMATION_STARTING; }
	static get EVENT_ON_IDLE_FADE_BACK_ANIMATION_COMPLETED() { return BossModeView.EVENT_ON_IDLE_FADE_BACK_ANIMATION_COMPLETED; }
	static get EVENT_ON_FIRE_FLASH_ANIMATION_COMPLETED() { return BossModeView.EVENT_ON_FIRE_FLASH_ANIMATION_COMPLETED; }
	static get EVENT_ON_BOSS_WIN_AWARD_COUNTED() { return BossModeView.EVENT_ON_BOSS_WIN_AWARD_COUNTED; }
	static get EVENT_ON_BOSS_WIN_AWARD_PRESENTATION_COMPLETED() { return BossModeView.EVENT_ON_BOSS_WIN_AWARD_PRESENTATION_COMPLETED; }
	static get EVENT_ON_COIN_LANDED() { return BossModeView.EVENT_ON_COIN_LANDED; }
	static get EVENT_ON_BOSS_WIN_MULTIPLIER_LANDED() { return BossModeView.EVENT_ON_BOSS_WIN_MULTIPLIER_LANDED; }
	static get EVENT_ON_WIN_PRESENTATION_INTERRUPTED() { return BossModeView.EVENT_ON_WIN_PRESENTATION_INTERRUPTED; }
	static get COIN_SPLASH_STARTED() { return BossModeView.COIN_SPLASH_STARTED }
	static get EVENT_ON_DEATH_DISAPPEARING_STARTED() { return BossModeView.EVENT_ON_DEATH_DISAPPEARING_STARTED }
	static get EVENT_ON_END_SOUND() { return BossModeView.EVENT_ON_END_SOUND; }

	static get EVENT_ON_INTRO_ANIMATION_ON_LAST_HAND_WAS_DEFINED() { return "onIntroAnimationOnLastHandWasDefined" };

	static get EVENT_ON_PENDING_BOSS_WINS_SKIPPED() { return "EVENT_ON_PENDING_BOSS_WINS_SKIPPED" };

	i_isKilledBossWin(data) {
		return this._checkIfKilledBossWinMessage(data) !== false;
	}

	isNeedPrepareForBossAppearance(aPoints_arr) {
		return this._determineIfAnimationPointHasPassen(aPoints_arr, this._getTimeToAnimationPartStart(8));
	}

	isNeedBossHideOnIntro(aPoints_arr) {
		return this._determineIfAnimationPointHasPassen(aPoints_arr, this._getTimeToAnimationPartStart(5));
	}

	isNextAnimationAppearanceOnIntro(aPoints_arr) {
		return this._determineAppearAnimationPointInBetween(aPoints_arr, this._getTimeToAnimationPartStart(5), this._getTimeToAnimationPartStart(8));
	}

	get isHourglassTimeOccurred() {
		return this.view && this.view.isHourglassTimeOccurred;
	}

	set bossNumberShots(aValue_num) {
		this.info && (this.info.bossNumberShots = aValue_num);
	}

	get bossNumberShots() {
		return this.info && this.info.bossNumberShots;
	}

	get isWinPresentationAwaiting() {
		return this._fPendingKilledBossWins_obj_arr && this._fPendingKilledBossWins_obj_arr.length > 0;
	}

	get isWinPresentationInProgress() {
		return this.view && this.view.isWinPresentationInProgress;
	}

	//INIT...
	__init() {
		super.__init();
	}

	//INIT...
	__initControlLevel() {
		super.__initControlLevel();

		this._gameScreen = APP.gameScreen;
		this._gameScreen.on(GameScreen.EVENT_ON_NEW_BOSS_CREATED, this._onNewBossCreated, this);
		this._gameScreen.on(GameScreen.EVENT_ON_BOSS_DESTROYING, this._onBossDestroying, this);
		// no longer in use CP-1520
		//this._gameScreen.on(GameScreen.EVENT_ON_GAME_FIELD_CLEARED, this._onGameFieldCleared, this);
		this._gameScreen.on(GameScreen.EVENT_ON_TIME_TO_EXPLODE_COINS, this._onTimeToExplodeCoins, this);
		this._gameScreen.on(GameScreen.EVENT_ON_READY, this._onGameReady, this);
		this._gameScreen.on(GameScreen.EVENT_ON_SHOT_SHOW_FIRE_START_TIME, this._onShotShowFireStartTime, this);

		let lBigWinsController_bwc = this._gameScreen.bigWinsController;
		lBigWinsController_bwc.on(BigWinsController.EVENT_BIG_WIN_PRESETNTATION_STARTED, this._onSomeBigWinPresentationStarted, this);

		this._fTimer_t = null;

		this._fPendingKilledBossWins_obj_arr = [];

		// DEBUG...
		// window.addEventListener("keydown", this.keyDownHandler.bind(this), false);
		// ...DEBUG
	}

	//DEBUG...
	// keyDownHandler(keyCode)
	// {
	// 	if (keyCode.keyCode == 103) //7
	// 	{
	// 		this.view.addToContainerIfRequired(this._gameScreen.gameField.bossModeAppearingContainerInfo);
	// 		this.view.startYouWinAnimation(1500, true, 0);
	// 	}
	// }
	//...DEBUG

	__initViewLevel() {
		super.__initViewLevel();

		let lView_bmv = this.view;
		lView_bmv.on(BossModeView.EVENT_ON_FADED_BACK_HIDE_REQUIRED, this.emit, this);
		lView_bmv.on(BossModeView.EVENT_DISAPPEARING_PRESENTATION_STARTED, this.emit, this);
		lView_bmv.on(BossModeView.EVENT_DISAPPEARING_PRESENTATION_COMPLETED, this.emit, this);
		lView_bmv.on(BossModeView.EVENT_APPEARING_PRESENTATION_STARTED, this.emit, this);
		lView_bmv.on(BossModeView.EVENT_APPEARING_PRESENTATION_COMPLETED, this.emit, this);
		lView_bmv.on(BossModeView.EVENT_ON_CAPTION_ANIMATION_STARTED, this.emit, this);
		lView_bmv.on(BossModeView.EVENT_ON_TIME_TO_SCALE_MAP, this.emit, this);
		lView_bmv.on(BossModeView.EVENT_ON_GROUND_BURN_REQUIRED, this.emit, this);
		lView_bmv.on(BossModeView.EVENT_ON_IDLE_ANIMATION_STARTING, this.emit, this);
		lView_bmv.on(BossModeView.EVENT_ON_IDLE_FADE_BACK_ANIMATION_COMPLETED, this.emit, this);
		lView_bmv.on(BossModeView.EVENT_ON_FIRE_FLASH_ANIMATION_COMPLETED, this.emit, this);
		lView_bmv.on(BossModeView.EVENT_ON_YOU_WIN_PRESENTATION_TIME, this._onYouWinPresentationTime, this);
		lView_bmv.on(BossModeView.EVENT_ON_BOSS_WIN_AWARD_COUNTED, this.emit, this);
		lView_bmv.on(BossModeView.EVENT_ON_BOSS_WIN_AWARD_PRESENTATION_COMPLETED, this.emit, this);
		lView_bmv.on(BossModeView.EVENT_ON_COIN_LANDED, this.emit, this);
		lView_bmv.on(BossModeView.EVENT_ON_BOSS_WIN_MULTIPLIER_LANDED, this.emit, this);
		lView_bmv.on(BossModeView.EVENT_ON_WIN_PRESENTATION_INTERRUPTED, this.emit, this);
		lView_bmv.on(BossModeView.COIN_SPLASH_STARTED, this.emit, this);
		lView_bmv.on(BossModeView.EVENT_ON_DEATH_DISAPPEARING_STARTED, this.emit, this);
		lView_bmv.on(BossModeView.EVENT_ON_END_SOUND, this.emit, this)
	}
	//...INIT

	get isIdleAnimating() {
		return this.view ? this.view.isIdleInProgress : false;
	}

	get isDisappearAnimating() {
		return this.view ? this.view.isDisappearanceInProgress : false;
	}

	_onShotShowFireStartTime(event) {
		let lShotResultsData_obj = event.data;

		let lBossWin_num = this._checkIfKilledBossWinMessage(lShotResultsData_obj);
		if (lBossWin_num) {
			this._fPendingKilledBossWins_obj_arr.push({ win: lBossWin_num, isMaster: (lShotResultsData_obj.seatId === event.masterSeatId), seatId: lShotResultsData_obj.seatId });
			this.view.targetSeatId = this._fPendingKilledBossWins_obj_arr[0].seatId;
		}
	}

	_onNewBossCreated(event) {
		this._gameScreen.gameField.off(GameField.EVENT_ON_ENEMY_KILLED_BY_PLAYER, this._onEnemyKilled, this, true);
		this._gameScreen.gameField.once(GameField.EVENT_ON_ENEMY_KILLED_BY_PLAYER, this._onEnemyKilled, this);

		let zombie = this._gameScreen.gameField.getExistEnemy(event.enemyId);

		if (!zombie) {
			throw new Error(`No Boss enemy with id = ${event.enemyId} found on the screen`);
		}

		let isLasthandBossView = event.isLasthandBossView;
		if (isLasthandBossView) {
			this._defineBossIntroAnimationToRunOnLastHand(zombie);
		}
		else {
			let lFragmentsController_fsc = APP.gameScreen.gameField.fragmentsController;
			let lFragmentsPanelController_fspc = APP.gameScreen.gameField.fragmentsPanelController;
			if (
				lFragmentsController_fsc.isAwardingInProgress
				|| (lFragmentsPanelController_fspc.view.isAnimationInProgress && !lFragmentsPanelController_fspc.view.isStoneFlyOutStarted)
			) {
				this._fCreatedBossId_num = event.enemyId;
				lFragmentsPanelController_fspc.once(FragmentsPanelController.EVENT_ON_STONE_FLY_OUT_STARTED, this._onStoneFlyOutStarted, this);
			}
			else {
				this._startAppearing(zombie);
			}
		}

		this._gameScreen.gameField.bossHourglassController.on(BossModeHourglassController.EVENT_ON_PROGRESS_UPDATED, this._onHourglassProgressUpdated, this);
		this._gameScreen.once(GameScreen.EVENT_ON_DRAGON_FIRE_BREATH_STARTED, this._onDragonFireBreathStarted, this);
	}

	_onSomeBigWinPresentationStarted(event) {
		if (this.view && this.view.isKeepPlayingCaptionInProgress) {
			this.view.forceCaptionDisappearing();
		}
	}

	_onStoneFlyOutStarted() {
		let zombie = this._gameScreen.gameField.getExistEnemy(this._fCreatedBossId_num);

		this._fCreatedBossId_num = undefined;

		this._startAppearing(zombie)
	}

	_onHourglassProgressUpdated(event) {
		let lCurProgress_num = event.curProgress;
		if (lCurProgress_num <= 0.5) {
			let lRedScreenSpeedProgress = (0.5 - lCurProgress_num) * 2;
			this.view.addToContainerIfRequired(this._gameScreen.gameField.bossModeAppearingContainerInfo);
			this.view.startRedScreenAnimation(lRedScreenSpeedProgress);
		}
	}

	_onDragonFireBreathStarted(event) {
		this._gameScreen.gameField.bossHourglassController.off(BossModeHourglassController.EVENT_ON_PROGRESS_UPDATED, this._onHourglassProgressUpdated, this);
		this.view.addToContainerIfRequired(this._gameScreen.gameField.bossModeAppearingContainerInfo);
		this.view.startRedScreenAnimation(1);
	}

	_checkIfKilledBossWinMessage(data) {
		let lTotalWin_num = 0;
		let lIsKilledBoss_bl = false;

		if (!data || !data.affectedEnemies) {
			return false;
		}

		for (let affectedEnemy of data.affectedEnemies) {
			if (affectedEnemy.data.class == "Hit") {
				const innerData = affectedEnemy.data;
				if (innerData.enemy.typeId == ENEMY_TYPES.BOSS) {
					let lAddWin_num = innerData.killBonusPay;
					if (lAddWin_num == 0 && innerData.hitResultBySeats && innerData.hitResultBySeats[innerData.seatId]) {
						let lSeatWins = innerData.hitResultBySeats[innerData.seatId];
						for (let i = 0; i < lSeatWins.length; i++) {
							if (lSeatWins[i].id == HIT_RESULT_SINGLE_CASH_ID) {
								lAddWin_num = +lSeatWins[i].value;
							}
						}
					}
					lTotalWin_num += lAddWin_num;
				}

				if (innerData.killed) {
					lIsKilledBoss_bl = true;
				}
			}
		}

		if (lTotalWin_num > 0 && lIsKilledBoss_bl) {
			return lTotalWin_num;
		}

		return false;
	}

	_defineBossIntroAnimationToRunOnLastHand(zombie) {
		let lInitialTime_num = zombie.trajectory.points[0].time;
		let lCurrentTime_num = APP.gameScreen.currentTime;
		const lCurrentPoint_p = TrajectoryUtils.getPrevTrajectoryPoint(zombie.trajectory, lCurrentTime_num);
		let lInvulnerable_bl = lCurrentPoint_p.invulnerable;

		if (!lInvulnerable_bl) {
			this._fTimer_t && this._fTimer_t.destructor();
			this._onStartIdleRequired();
			return;
		}

		this.emit(BossModeController.EVENT_ON_INTRO_ANIMATION_ON_LAST_HAND_WAS_DEFINED);

		let lElapsedTime_num = lCurrentTime_num - lInitialTime_num;
		if (lElapsedTime_num < this._getTimeToAnimationPartStart(0)) {
			let lTime_num = this._getTimeToAnimationPartStart(0) - lElapsedTime_num;
			this._fTimer_t && this._fTimer_t.destructor();
			this._fTimer_t = new Timer(() => {
				this._startAppearing(zombie, true);
			}, lTime_num);
		}
		else if (lElapsedTime_num >= this._getTimeToAnimationPartStart(0) && lElapsedTime_num < this._getTimeToAnimationPartStart(1)) {
			let lTime_num = this._getTimeToAnimationPartStart(1) - lElapsedTime_num;
			this._fTimer_t && this._fTimer_t.destructor();
			this._fTimer_t = new Timer(() => {
				this._startMapBlurAnimation(zombie);
			}, lTime_num)
		}
		else if (lElapsedTime_num >= this._getTimeToAnimationPartStart(1) && lElapsedTime_num < this._getTimeToAnimationPartStart(2)) {
			let lTime_num = this._getTimeToAnimationPartStart(2) - lElapsedTime_num;
			this._fTimer_t && this._fTimer_t.destructor();
			this._fTimer_t = new Timer(() => {
				this._startCaptionAnimation(zombie);
			}, lTime_num)
		}
		else if (lElapsedTime_num >= this._getTimeToAnimationPartStart(2) && lElapsedTime_num < this._getTimeToAnimationPartStart(3)) {
			let lTime_num = this._getTimeToAnimationPartStart(3) - lElapsedTime_num;
			this._fTimer_t && this._fTimer_t.destructor();
			this._fTimer_t = new Timer(() => {
				this._startDragonFireAnimation(zombie);
			}, lTime_num)
		}
		else if (lElapsedTime_num >= this._getTimeToAnimationPartStart(3) && lElapsedTime_num < this._getTimeToAnimationPartStart(4)) {
			let lTime_num = this._getTimeToAnimationPartStart(4) - lElapsedTime_num;
			this._fTimer_t && this._fTimer_t.destructor();
			this._fTimer_t = new Timer(() => {
				this._startFireOnTopAnimation(zombie);
			}, lTime_num)
		}
		else if (lElapsedTime_num >= this._getTimeToAnimationPartStart(4) && lElapsedTime_num < this._getTimeToAnimationPartStart(5)) {
			let lTime_num = this._getTimeToAnimationPartStart(5) - lElapsedTime_num;
			this._fTimer_t && this._fTimer_t.destructor();
			this._fTimer_t = new Timer(() => {
				this._startDragonShadowAnimation(zombie);
			}, lTime_num)
		}
		else if (lElapsedTime_num >= this._getTimeToAnimationPartStart(5) && lElapsedTime_num < this._getTimeToAnimationPartStart(6)) {
			let lRestShadowTime = this._getTimeToAnimationPartStart(6) - lElapsedTime_num;
			this._startDragonShadowAnimation(zombie, lRestShadowTime);
		}
		else if (lElapsedTime_num >= this._getTimeToAnimationPartStart(6) && lElapsedTime_num < this._getTimeToAnimationPartStart(7)) {
			let lTime_num = this._getTimeToAnimationPartStart(7) - lElapsedTime_num;
			this._fTimer_t && this._fTimer_t.destructor();
			this._fTimer_t = new Timer(() => {
				this._startSecondSmoke(zombie);
			}, lTime_num)
		}
		else if (lElapsedTime_num >= this._getTimeToAnimationPartStart(7) && lElapsedTime_num < this._getTimeToAnimationPartStart(8)) {
			let lTime_num = this._getTimeToAnimationPartStart(8) - lElapsedTime_num;
			this._fTimer_t && this._fTimer_t.destructor();
			this._fTimer_t = new Timer(() => {
				this._startDragonAppearAnimation(zombie);
			}, lTime_num)
		}
		else if (lElapsedTime_num >= this._getTimeToAnimationPartStart(8)) {
			this._onStartIdleRequired();
		}
	}

	_startAppearing(zombie, aIsLasthandView_bl = false) {
		let lRestAppearingTime = undefined;

		let lAppearingAccelerateTime_num = 0;
		if (!aIsLasthandView_bl) {
			let lCurrentTime_num = APP.gameScreen.currentTime;
			const lCurrentPoint_p = TrajectoryUtils.getPrevTrajectoryPoint(zombie.trajectory, lCurrentTime_num);
			let lInvulnerable_bl = lCurrentPoint_p.invulnerable;

			if (!lInvulnerable_bl) {
				this._onStartIdleRequired();
				return;
			}

			let lRestInvulnerableTime = zombie.trajectory.points[1].time - lCurrentTime_num;
			let lFullAppearingAnimInvTime = ~~(this._getTimeToAnimationPartStart(8, 1) + DRAGON_APPEAR_INVULNERABLE_TIME);
			if (lRestInvulnerableTime < lFullAppearingAnimInvTime) {
				lAppearingAccelerateTime_num = lFullAppearingAnimInvTime - lRestInvulnerableTime;
			}
		}


		APP.gameScreen.gameField.fragmentsPanelController.off(FragmentsPanelController.EVENT_ON_STONE_FLY_OUT_STARTED, this._onStoneFlyOutStarted, this, true);
		this._fCreatedBossId_num = undefined;

		let lView_bmv = this.view;
		lView_bmv.addToContainerIfRequired(this._gameScreen.gameField.bossModeAppearingContainerInfo);
		lView_bmv.startAppearing(zombie, lAppearingAccelerateTime_num);
	}

	_startMapBlurAnimation(zombie) {
		let lView_bmv = this.view;
		lView_bmv.addToContainerIfRequired(this._gameScreen.gameField.bossModeAppearingContainerInfo);
		lView_bmv.startMapBlurAnimationOnLastHand(zombie);
	}

	_startCaptionAnimation(zombie) {
		let lView_bmv = this.view;
		lView_bmv.addToContainerIfRequired(this._gameScreen.gameField.bossModeAppearingContainerInfo);
		lView_bmv.startCaptionAnimationOnLastHand(zombie);
	}

	_startDragonFireAnimation(zombie) {
		let lView_bmv = this.view;
		lView_bmv.addToContainerIfRequired(this._gameScreen.gameField.bossModeAppearingContainerInfo);
		lView_bmv.startDragonFireAnimationOnLastHand(zombie);
	}

	_startFireOnTopAnimation(zombie) {
		let lView_bmv = this.view;
		lView_bmv.addToContainerIfRequired(this._gameScreen.gameField.bossModeAppearingContainerInfo);
		lView_bmv.startFireOnTopAnimationOnLastHand(zombie);
	}

	_startDragonShadowAnimation(zombie, aRestShadowTime = undefined) {
		let lView_bmv = this.view;
		lView_bmv.addToContainerIfRequired(this._gameScreen.gameField.bossModeAppearingContainerInfo);
		lView_bmv.startDragonShadowAnimationOnLastHand(zombie, aRestShadowTime);
	}

	_startIdleAnimation(zombie) {
		let lView_bmv = this.view;
		lView_bmv.addToContainerIfRequired(this._gameScreen.gameField.bossModeAppearingContainerInfo);
		lView_bmv.startIdleAnimationOnLastHand(zombie);
	}

	_startSecondSmoke(zombie) {
		let lView_bmv = this.view;
		lView_bmv.addToContainerIfRequired(this._gameScreen.gameField.bossModeAppearingContainerInfo);
		lView_bmv.startSecondSmokeOnLastHand(zombie);
	}

	_startDragonAppearAnimation(zombie) {
		let lView_bmv = this.view;
		lView_bmv.addToContainerIfRequired(this._gameScreen.gameField.bossModeAppearingContainerInfo);
		lView_bmv.startDragonAppearAnimationOnLastHand(zombie);
	}

	onDisappearStartRequired(disappearExTime) {
		let lView_bmv = this.view;
		lView_bmv.addToContainerIfRequired(this._gameScreen.gameField.bossModeAppearingContainerInfo);
		lView_bmv.setTopContainer(this._gameScreen.gameField.bossModeDisappearingContainerInfo);
		lView_bmv.startDisappearing(disappearExTime);
	}

	onBossDisappeared() {
		this.view.onStopIdleRequired();
		this._gameScreen.gameField.bossHourglassController.off(BossModeHourglassController.EVENT_ON_PROGRESS_UPDATED, this._onHourglassProgressUpdated, this);
		this._gameScreen.off(GameScreen.EVENT_ON_DRAGON_FIRE_BREATH_STARTED, this._onDragonFireBreathStarted, this, true);
	}

	_onEnemyKilled(event) {
		if (event.enemyName == ENEMIES.Dragon && this._fPendingKilledBossWins_obj_arr.length > 0 && !this.view.isDeathAnimationInProgress) {
			if (this.view.targetSeatId === undefined) // to prevent trying to get nickname of undefined
			{
				this.view.targetSeatId = this._fPendingKilledBossWins_obj_arr[0].seatId;
			}
			this._onStartIdleRequired();

			let lIsCoPlayerWin = !this._fPendingKilledBossWins_obj_arr[0].isMaster;
			this.view.onTimeToExplodeCoins(lIsCoPlayerWin);
		}
	}

	_onBossDestroying(event) {
		let lView_bmv = this.view;

		this._gameScreen.gameField.bossHourglassController.off(BossModeHourglassController.EVENT_ON_PROGRESS_UPDATED, this._onHourglassProgressUpdated, this);
		this._gameScreen.off(GameScreen.EVENT_ON_DRAGON_FIRE_BREATH_STARTED, this._onDragonFireBreathStarted, this, true);

		this._gameScreen.gameField.off(GameField.EVENT_ON_ENEMY_KILLED_BY_PLAYER, this._onEnemyKilled, this, true);
		/*if (event.isInstantKill) {
			this._fTimer_t && this._fTimer_t.destructor();

			if (APP.gameScreen.gameField.screen) {
				APP.gameScreen.gameField.fragmentsPanelController.off(FragmentsPanelController.EVENT_ON_STONE_FLY_OUT_STARTED, this._onStoneFlyOutStarted, this, true);
			}

			this._fCreatedBossId_num = undefined;

			lView_bmv && lView_bmv.interruptAnimation();

			this._skipPendingWins();
		}
		else {*/
		lView_bmv.setTopContainer(this._gameScreen.gameField.bossModeDisappearingContainerInfo);
		lView_bmv.startDying(event.enemy, this._fPendingKilledBossWins_obj_arr[0].seatId);
		this.view.addToContainerIfRequired(this._gameScreen.gameField.bossModeAppearingContainerInfo);
		this.view.startRedScreenAnimation(0.5);
		//}
	}

	get isBossSequenceInProgress() {
		return this.view.isBossSequenceInProgress;
	}

	get bossExtentionTime() {
		return this.view.bossExtentionTime;
	}

	_onStartIdleRequired() {
		let lView_bmv = this.view;
		lView_bmv.addToContainerIfRequired(this._gameScreen.gameField.bossModeAppearingContainerInfo);
		lView_bmv.startIdle(true);
	}

	_onTimeToExplodeCoins(event) {
		this.view.onTimeToExplodeCoins(event.isCoPlayerWin);
	}
	// no longer in use CP-1520 
	_onGameFieldCleared() {
		this._fTimer_t && this._fTimer_t.destructor();

		if (APP.gameScreen.gameField.screen) {
			APP.gameScreen.gameField.fragmentsPanelController.off(FragmentsPanelController.EVENT_ON_STONE_FLY_OUT_STARTED, this._onStoneFlyOutStarted, this, true);
		}

		this._fCreatedBossId_num = undefined;

		this.view && this.view.interruptAnimation();

		this._skipPendingWins();
	}

	_skipPendingWins() {
		// ds animation is no longer skiped CP-1520 
		return;
		if (this._fPendingKilledBossWins_obj_arr && this._fPendingKilledBossWins_obj_arr.length) {
			let skippedPendingBossWinsValue = 0;
			while (this._fPendingKilledBossWins_obj_arr && this._fPendingKilledBossWins_obj_arr.length) {
				let lPendingKilledBossWin_obj = this._fPendingKilledBossWins_obj_arr.shift();
				if (lPendingKilledBossWin_obj.isMaster) {
					skippedPendingBossWinsValue += lPendingKilledBossWin_obj.win;
				}

			}
			this._fPendingKilledBossWins_obj_arr = [];

			this.emit(BossModeController.EVENT_ON_PENDING_BOSS_WINS_SKIPPED, { skippedPendingBossWinsValue: skippedPendingBossWinsValue });
		}
	}

	_onGameReady() {
	}

	_onYouWinPresentationTime(event) {
		let lPendingKilledBossWin_obj = this._fPendingKilledBossWins_obj_arr.shift();
		if (!!lPendingKilledBossWin_obj) {
			this.view.startYouWinAnimation(lPendingKilledBossWin_obj.win, lPendingKilledBossWin_obj.isMaster, lPendingKilledBossWin_obj.seatId);
		}
	}

	destroy() {
		this._fTimer_t && this._fTimer_t.destructor();
		this._fTimer_t = null;

		if (this._gameScreen) {
			this._gameScreen.off(GameScreen.EVENT_ON_NEW_BOSS_CREATED, this._onNewBossCreated, this);
			this._gameScreen.off(GameScreen.EVENT_ON_BOSS_DESTROYING, this._onBossDestroying, this);
			//this._gameScreen.off(GameScreen.EVENT_ON_GAME_FIELD_CLEARED, this._onGameFieldCleared, this);
			this._gameScreen.off(GameScreen.EVENT_ON_TIME_TO_EXPLODE_COINS, this._onTimeToExplodeCoins, this);
			this._gameScreen.off(GameScreen.EVENT_ON_READY, this._onGameReady, this);
			this._gameScreen = null;
		}

		APP.gameScreen.gameField.fragmentsPanelController.off(FragmentsPanelController.EVENT_ON_STONE_FLY_OUT_STARTED);
		this._fCreatedBossId_num = undefined;

		super.destroy();
	}

	_getTimeToAnimationPartStart(aAnimationPartIndex_int, aStartPartIndex_int = 0) {
		if (aAnimationPartIndex_int < aStartPartIndex_int) {
			throw new Error(`Cannot count time from part ${aStartPartIndex_int} to part ${aAnimationPartIndex_int}.`);
		}

		if (aAnimationPartIndex_int == 0) {
			return WAIT_APPEARING_ANIM_DURATION;
		}

		if (aAnimationPartIndex_int > TIMERS_TO_NEXT_ANIM.length) {
			throw new Error(`Cannot determin boss intro animation part ${aAnimationPartIndex_int}, max possible parts: ${TIMERS_TO_NEXT_ANIM.length + 1}`)
		}

		let lDuration = (aStartPartIndex_int == 0) ? WAIT_APPEARING_ANIM_DURATION : 0;
		let lAnimsStartIndex = (aStartPartIndex_int == 0) ? 0 : aStartPartIndex_int - 1;
		for (let i = lAnimsStartIndex; i < aAnimationPartIndex_int; i++) {
			lDuration += TIMERS_TO_NEXT_ANIM[i];
		}

		return lDuration;
	}

	_determineIfAnimationPointHasPassen(aPoints_arr, aAnimationMaxTime_num) {
		if (!aPoints_arr[0] || (aPoints_arr[0] && !aPoints_arr[0].invulnerable && aPoints_arr.length === 1)) {
			return false;
		}

		let lCurrentTime_num = APP.gameScreen.currentTime;
		let lInitialTime_num = aPoints_arr[0].time;
		let lElapsedTime_num = lCurrentTime_num - lInitialTime_num;
		return lElapsedTime_num < aAnimationMaxTime_num;
	}

	_determineAppearAnimationPointInBetween(aPoints_arr, aAnimationMinTime_num, aAnimationMaxTime_num) {
		if (!aPoints_arr[0] || aPoints_arr[0] && !aPoints_arr[0].invulnerable) {
			return false;
		}

		let lCurrentTime_num = APP.gameScreen.currentTime;
		let lInitialTime_num = aPoints_arr[0].time;
		let lElapsedTime_num = lCurrentTime_num - lInitialTime_num;

		return lElapsedTime_num >= aAnimationMinTime_num && lElapsedTime_num <= aAnimationMaxTime_num;
	}
}

export default BossModeController