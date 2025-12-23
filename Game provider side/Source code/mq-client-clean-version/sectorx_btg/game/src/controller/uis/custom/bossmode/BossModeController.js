import SimpleUIController from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/uis/base/SimpleUIController';
import BossModeView from '../../../../view/uis/custom/bossmode/BossModeView';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import GameScreen from '../../../../main/GameScreen';
import { ENEMY_TYPES } from '../../../../../../shared/src/CommonConstants';
import { HIT_RESULT_SINGLE_CASH_ID } from '../../prizes/PrizesController';
import IceBossAppearanceView from '../../../../view/uis/custom/bossmode/appearance/IceBossAppearanceView';
import GameStateController from '../../../state/GameStateController';

class BossModeController extends SimpleUIController
{
	static get EVENT_APPEARING_STARTED() 					{return BossModeView.EVENT_APPEARING_STARTED;}
	static get EVENT_APPEARING_PRESENTATION_STARTED() 		{return BossModeView.EVENT_APPEARING_PRESENTATION_STARTED;}
	static get EVENT_APPEARING_PRESENTATION_CULMINATED() 	{return BossModeView.EVENT_APPEARING_PRESENTATION_CULMINATED;}
	static get EVENT_APPEARING_PRESENTATION_COMPLETION() 	{return BossModeView.EVENT_APPEARING_PRESENTATION_COMPLETION;}
	static get EVENT_APPEARING_PRESENTATION_COMPLETED() 	{return BossModeView.EVENT_APPEARING_PRESENTATION_COMPLETED;}
	static get EVENT_DISAPPEARING_PRESENTATION_STARTED() 	{return BossModeView.EVENT_DISAPPEARING_PRESENTATION_STARTED;}
	static get EVENT_DISAPPEARING_PRESENTATION_COMPLETION() {return BossModeView.EVENT_DISAPPEARING_PRESENTATION_COMPLETION;}
	static get EVENT_DISAPPEARING_PRESENTATION_COMPLETED() 	{return BossModeView.EVENT_DISAPPEARING_PRESENTATION_COMPLETED;}
	static get EVENT_SHAKE_THE_GROUND_REQUIRED() 			{return BossModeView.EVENT_SHAKE_THE_GROUND_REQUIRED;}
	static get EVENT_ON_CAPTION_BECAME_VISIBLE() 			{return BossModeView.EVENT_ON_CAPTION_BECAME_VISIBLE;}
	static get EVENT_ON_PLAYER_WIN_CAPTION_FINISHED()		{return BossModeView.EVENT_ON_PLAYER_WIN_CAPTION_FINISHED;}
	static get EVENT_ON_TIME_TO_PRESENT_MULTIPLIER() 		{return "EVENT_ON_TIME_TO_PRESENT_MULTIPLIER";}

	//INIT...
	__init()
	{
		super.__init();
	}

	//INIT...
	__initControlLevel()
	{
		super.__initControlLevel();

		this._gameScreen = APP.gameScreen;
		this._gameScreen.on(GameScreen.EVENT_ON_NEW_BOSS_CREATED, this._onNewBossCreated, this);
		this._gameScreen.on(GameScreen.EVENT_ON_BOSS_DESTROYING, this._onBossDestroying, this);
		this._gameScreen.on(GameScreen.EVENT_ON_BOSS_DESTROYED, this._onBossDestroyed, this);
		this._gameScreen.on(GameScreen.EVENT_ON_TIME_TO_EXPLODE_COINS, this._onTimeToExplodeCoins, this);
		this._gameScreen.on(GameScreen.EVENT_ON_GAME_FIELD_CLEARED, this._onGameFieldCleared, this);
		this._gameScreen.on(GameScreen.EVENT_ON_UPDATE_PLAYER_WIN_CAPTION, this._onUpdatePlayerWinCaption, this);

		this._gameScreen.on(GameScreen.EVENT_ON_READY, this._onGameReady, this);

		this._fGameStateController_gsc = APP.currentWindow.gameStateController;
		this._fGameStateInfo_gsi = this._fGameStateController_gsc.info;
		this._fGameStateController_gsc.on(GameStateController.EVENT_ON_SUBROUND_STATE_CHANGED, this._onGameSubRoundStateChanged, this);
	}

	_onGameSubRoundStateChanged()
	{
		if (!this._fGameStateInfo_gsi.isBossSubround)
		{
			this.info.isBossAlreadyAppearedOnCurrentStateBossSubround = false;
		}
	}

	__initViewLevel()
	{
		super.__initViewLevel();

		let lView_bmv = this.view;

		lView_bmv.on(BossModeView.EVENT_APPEARING_STARTED, this._onAppearingPresentationStarted, this);
		lView_bmv.on(BossModeView.EVENT_APPEARING_PRESENTATION_STARTED, this.emit, this);
		lView_bmv.on(BossModeView.EVENT_APPEARING_PRESENTATION_CULMINATED, this.emit, this);
		lView_bmv.on(BossModeView.EVENT_APPEARING_PRESENTATION_COMPLETION, this.emit, this);
		lView_bmv.on(BossModeView.EVENT_APPEARING_PRESENTATION_COMPLETED, this.emit, this);
		lView_bmv.on(BossModeView.EVENT_DISAPPEARING_PRESENTATION_STARTED, this.emit, this);
		lView_bmv.on(BossModeView.EVENT_DISAPPEARING_PRESENTATION_COMPLETION, this.emit, this);
		lView_bmv.on(BossModeView.EVENT_DISAPPEARING_PRESENTATION_COMPLETED, this.emit, this);
		lView_bmv.on(BossModeView.EVENT_SHAKE_THE_GROUND_REQUIRED, this.emit, this);
		lView_bmv.on(IceBossAppearanceView.EVENT_ON_ICE_BOSS_FREEZE_LAND_NEEDED, this.emit, this);
		lView_bmv.on(IceBossAppearanceView.EVENT_ON_ICE_BOSS_FREEZE_LAND_MELTING, this.emit, this);
		lView_bmv.on(BossModeView.EVENT_ON_TIME_TO_DEFEATED_CAPTION, this._onTimeToDefeatedCaption, this);
		lView_bmv.on(BossModeView.EVENT_ON_CAPTION_BECAME_VISIBLE, this.emit, this);
		lView_bmv.on(BossModeView.EVENT_ON_PLAYER_WIN_CAPTION_FINISHED, this.emit, this);
	}
	//...INIT

	get bossType()
	{
		return this.view.bossType;
	}

	get bossSequenceCompleted()
	{
		return this.view && this.view.isBossSequenceActive;
	}

	get isPlayerWinAnimationInProgress()
	{
		return this.view && this.view.isPlayerWinAnimationInProgress
	}

	_onNewBossCreated(event)
	{
		let lView_bmv = this.view;
		let zombie = this._gameScreen.gameFieldController.getExistEnemy(event.enemyId);

		if (!zombie)
		{
			throw new Error(`No Boss enemy with id = ${event.enemyId} found on the screen`);
		}

		let isLasthandBossView = event.isLasthandBossView;
		//DEBUG...
		//isLasthandBossView = false;
		//...DEBUG
		if (isLasthandBossView || event.isBossRoundAlreadyGo)
		{
			this.info.isBossAlreadyAppearedOnCurrentStateBossSubround = true;
			lView_bmv.updateBossType(zombie.name);
			APP.soundsController.play("boss_laugh");
			return;
		}

		lView_bmv.addToContainerIfRequired(this._gameScreen.gameFieldController.bossModeAppearingContainerInfo);
		if (this.info.isBossAlreadyAppearedOnCurrentStateBossSubround)
		{
			lView_bmv.updateBossType(zombie.name);
			zombie.skipBossAppearance();
		}
		else
		{
			this.info.isBossAlreadyAppearedOnCurrentStateBossSubround = true;
			lView_bmv.startAppearing(zombie);
		}
	}

	_onAppearingPresentationStarted()
	{
		this.emit(BossModeController.EVENT_APPEARING_STARTED, {bossType: this.bossType});
	}

	_onBossDestroying(event)
	{
		let lView_bmv = this.view;

		let zombie = this._gameScreen.gameFieldController.getExistEnemy(event.enemyId);

		if (!zombie)
		{
			throw new Error(`No Boss enemy with id = ${event.enemyId} found on the screen`);
			return;
		}
		
		lView_bmv.addToContainerIfRequired(this._gameScreen.gameFieldController.bossModeDisappearingContainerInfo);
		lView_bmv.startDisappearing(zombie, event.enemyId, event.isInstantKill);
	}

	_onBossDestroyed(event)
	{
		this.view.completeDisappearing(event.enemyGlobalPoint, event.isCoPlayerWin);
	}

	_onTimeToExplodeCoins(event)
	{
		this._fIsCoPlayerWin_bl = event.isCoPlayerWin;
		this.view.onTimeToExplodeCoins(event.enemyGlobalPoint, event.isCoPlayerWin);
	}

	_onTimeToDefeatedCaption()
	{
		let lView_bmv = this.view;
		lView_bmv.addToContainerIfRequired(this._gameScreen.gameFieldController.bossModeDisappearingContainerInfo);
		lView_bmv.onTimeToDefeatedCaption();

		this.emit(BossModeController.EVENT_ON_TIME_TO_PRESENT_MULTIPLIER, {winSeatId: this._fCurrenWintSeatId_int, isCoPlayerWin: this._fIsCoPlayerWin_bl})
	}

	_onGameFieldCleared()
	{
		this.view && this.view.interruptAnimation();
	}

	i_isKilledBossWin(data)
	{
		return this._checkIfKilledBossWinMessage(data) !== false;
	}

	_checkIfKilledBossWinMessage(data)
	{
		let lTotalWin_num = 0;
		let lIsKilledBoss_bl = false;

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
					let lAddWin_num = innerData.killBonusPay;
					if (lAddWin_num == 0 && innerData.hitResultBySeats && innerData.hitResultBySeats[innerData.seatId])
					{
						let lSeatWins = innerData.hitResultBySeats[innerData.seatId];
						for (let i=0; i<lSeatWins.length; i++)
						{
							if (lSeatWins[i].id == HIT_RESULT_SINGLE_CASH_ID)
							{
								lAddWin_num = +lSeatWins[i].value;
							}
						}
					}
					lTotalWin_num += lAddWin_num;
				}

				if (innerData.killed)
				{
					lIsKilledBoss_bl = true;
				}
			}
		}

		if (lTotalWin_num > 0 && lIsKilledBoss_bl)
		{
			return lTotalWin_num;
		}

		return false;
	}

	checkKilledBossHitEnemy(aEnemy_obj)
	{
		return this._checkKilledBossHitEnemy(aEnemy_obj);
	}

	_checkKilledBossHitEnemy(aEnemy_obj)
	{
		if (aEnemy_obj.data.class == "Hit")
		{
			const innerData = aEnemy_obj.data;

			if (innerData.enemy.typeId == ENEMY_TYPES.BOSS && innerData.killed)
			{
				return true;
			}
		}
		return false;
	}

	_onUpdatePlayerWinCaption(event)
	{
		let lView_bmv = this.view;
		this._fCurrenWintSeatId_int = event.seatId;
		lView_bmv.addToContainerIfRequired(this._gameScreen.gameFieldController.bossModeAppearingContainerInfo);
		lView_bmv.updatePlayerWinCaption(event.playerName, event.seatId);
	}

	_onGameReady()
	{
		// CoinsEmitter.fillPool();
		// CoinsEmitterSilver.fillPool();
	}

	destroy()
	{
		if (this._gameScreen)
		{
			this._gameScreen.off(GameScreen.EVENT_ON_NEW_BOSS_CREATED, this._onNewBossCreated, this);
			this._gameScreen.off(GameScreen.EVENT_ON_BOSS_DESTROYING, this._onBossDestroying, this);
			this._gameScreen.off(GameScreen.EVENT_ON_BOSS_DESTROYED, this._onBossDestroyed, this);
			this._gameScreen.off(GameScreen.EVENT_ON_TIME_TO_EXPLODE_COINS, this._onTimeToExplodeCoins, this);
			this._gameScreen.off(GameScreen.EVENT_ON_GAME_FIELD_CLEARED, this._onGameFieldCleared, this);
			this._gameScreen.off(GameScreen.EVENT_ON_READY, this._onGameReady, this);
			this._gameScreen = null;

			let lView_bmv = this.view;

			lView_bmv.off(BossModeView.EVENT_APPEARING_STARTED, this._onAppearingPresentationStarted, this);
			lView_bmv.off(BossModeView.EVENT_APPEARING_PRESENTATION_STARTED, this.emit, this);
			lView_bmv.off(BossModeView.EVENT_APPEARING_PRESENTATION_CULMINATED, this.emit, this);
			lView_bmv.off(BossModeView.EVENT_APPEARING_PRESENTATION_COMPLETION, this.emit, this);
			lView_bmv.off(BossModeView.EVENT_APPEARING_PRESENTATION_COMPLETED, this.emit, this);
			lView_bmv.off(BossModeView.EVENT_DISAPPEARING_PRESENTATION_STARTED, this.emit, this);
			lView_bmv.off(BossModeView.EVENT_DISAPPEARING_PRESENTATION_COMPLETION, this.emit, this);
			lView_bmv.off(BossModeView.EVENT_DISAPPEARING_PRESENTATION_COMPLETED, this.emit, this);
			lView_bmv.off(BossModeView.EVENT_SHAKE_THE_GROUND_REQUIRED, this.emit, this);
			lView_bmv.off(BossModeView.EVENT_ON_CAPTION_BECAME_VISIBLE, this.emit, this);
		}

		super.destroy();
	}
}

export default BossModeController