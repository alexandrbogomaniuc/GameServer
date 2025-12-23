import TargetingInfo from '../../../model/uis/targeting/TargetingInfo';
import GameScreen from '../../../main/GameScreen';
import { ROUND_STATE } from '../../../model/state/GameStateInfo';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import SimpleUIController from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/uis/base/SimpleUIController';
import TargetingView from '../../../view/uis/targeting/TargetingView';
import Game from '../../../Game';
import { ENEMIES, ENEMY_TYPES } from '../../../../../shared/src/CommonConstants';
import { Utils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import FireSettingsController from '../fire_settings/FireSettingsController';
import Timer from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import AutoTargetingSwitcherController from './AutoTargetingSwitcherController';
import Enemy from '../../../main/enemies/Enemy';

const TARGET_FIRE_START_DELAY = 500;

class TargetingController extends SimpleUIController {

	static get EVENT_ON_TARGET_UPDATED() 		{ return 'EVENT_ON_TARGET_UPDATED';}
	static get EVENT_ON_TARGET_RESET() 			{ return 'EVENT_ON_TARGET_RESET';}
	static get EVENT_ON_PAUSE_STATE_UPDATED() 	{ return 'EVENT_ON_PAUSE_STATE_UPDATED';}

	constructor() {
		super(new TargetingInfo(), new TargetingView());

		this._gameScreen = null;

		this._fIsLobbySecondaryScreenActive_bl = false;
		this._fIsDialogActivated_bl = false;
		this._fIsFireSettingsActivated_bl = false;
		this._fIsChooseWeaponScreenActivated_bln = false;

		this._fWeaponsController_wsc = null;
		this._fWeaponsInfo_wsi = null;

		this._fFireSettingsController_fssc = null;
		this._fCurTargetPreference_int = undefined;
		this._fIsUserSelectedEnemy_bl = false;
		this._fUserSelectionTime_int = undefined;

		this._fFireController_fc = null;
	}

	__init()
	{
		super.__init();

		this._gameScreen = APP.currentWindow;

		this._fGameStateInfo_gsi = this._gameScreen.gameStateController.info;

		this._fWeaponsController_wsc = APP.currentWindow.weaponsController;
		this._fWeaponsInfo_wsi = this._fWeaponsController_wsc.i_getInfo();

		this._fFireController_fc = this._gameScreen.fireController;

		this._gameScreen.on(GameScreen.EVENT_ON_TARGETING, this._onTargetingSuspicion, this);
		this._gameScreen.on(GameScreen.EVENT_ON_RESET_TARGET, this._onResetTarget, this);
		this._gameScreen.on(GameScreen.EVENT_ON_ROOM_UNPAUSED, this._onRoomUnpaused, this);
		this._gameScreen.on(GameScreen.EVENT_ON_DIALOG_ACTIVATED, this._onDialogActivated, this);
		this._gameScreen.on(GameScreen.EVENT_ON_DIALOG_DEACTIVATED, this._onDialogDeactivated, this);
		this._gameScreen.on(GameScreen.EVENT_ON_BACK_TO_LOBBY_BUTTON_CLICKED, this._onBackToLobbyButtonClicked, this);
		this._gameScreen.on(GameScreen.EVENT_ON_KILLED_MISS_ENEMY, this._onEnemyKilledMiss, this);
		this._gameScreen.on(GameScreen.EVENT_ON_INVULNERABLE_ENEMY, this._onEnemyInvulnerableMiss, this);
		this._gameScreen.on(GameScreen.EVENT_ON_TARGET_ENEMY_IS_DEAD, this._onTargetEnemyIsDead, this);
		this._gameScreen.on(GameScreen.EVENT_ON_TARGET_B3_FORMATION_INVULNERABLE, this._onTargetingB3Invulnerable, this);
		this._gameScreen.on(GameScreen.EVENT_ON_TARGET_B3_FORMATION_VULNERABLE, this._onTargetingB3Vulnerable, this);
		this._gameScreen.on(GameScreen.EVENT_ON_CHOOSE_WEAPON_SCREEN_CHANGED, this._onChooseWeaponScreenChanged, this);

		this._fFireSettingsController_fssc = this._gameScreen.fireSettingsController;
		this._fFireSettingsController_fssc.on(FireSettingsController.EVENT_SCREEN_ACTIVATED, this._onFireSettingsScreenActivated, this);
		this._fFireSettingsController_fssc.on(FireSettingsController.EVENT_SCREEN_DEACTIVATED, this._onFireSettingsScreenDeactivated, this);

		APP.on(Game.EVENT_ON_GAME_SECONDARY_SCREEN_ACTIVATED, this._onSecondaryScreenActivated, this);
		APP.on(Game.EVENT_ON_GAME_SECONDARY_SCREEN_DEACTIVATED, this._onSecondaryScreenDeactivated, this);

		let lAutoTargetingSwitcher_atsc = APP.currentWindow.autoTargetingSwitcherController;
		lAutoTargetingSwitcher_atsc.on(AutoTargetingSwitcherController.EVENT_ON_AUTO_TARGETING_SWITCHED, this._onAutoTargetingSwitched, this);
	}

	tick()
	{
		if (this.info.isTargetEnemyDefined)
		{
			let lEnemy_enm = this._gameScreen.gameFieldController.getExistEnemy(this.info.targetEnemyId);

			if (
				lEnemy_enm &&
				lEnemy_enm.parent &&
				lEnemy_enm.isTargetable()
			)
			{
				
				let lEnemyPos_pt = lEnemy_enm.getAccurateCenterPositionWithCrosshairOffset();
				this.view.crosshairs.position = this._fLastCrosshairsPos_p = lEnemyPos_pt;
				this.view.updateCrosshair(true);
			}
			else
			{
				this.view.updateCrosshair(false);
				this._onSelectNextTargetSuspicion();
			}
		}

		if (APP.isBattlegroundGame)
		{
			let lTargetCrosshairsPos_pt = this._fLastCrosshairsPos_p;
			let lNearestTowardTargetEnemy_e = lTargetCrosshairsPos_pt ? this._fFireController_fc.getNearestEnemy(lTargetCrosshairsPos_pt.x, lTargetCrosshairsPos_pt.y, 1) : null;
	
			if (
					this.info.isTargetEnemyDefined
					&& !this.isUserSelectedEnemy
					&& lNearestTowardTargetEnemy_e
					&& lNearestTowardTargetEnemy_e.id !== this.info.targetEnemyId
				)
			{
				this._resetTarget();
				this._resetB3FormationTarget();
				this._tryToSelectNextTarget();
			}
			else if (this.info.isPaused && this._fUserSelectionTime_int !== undefined)
			{
				if (Date.now() - this._fUserSelectionTime_int >= TARGET_FIRE_START_DELAY)
				{
					this._fUserSelectionTime_int = undefined;
					this._validatePause();
				}
			}
		}
	}

	get isUserSelectedEnemy()
	{
		return this._fIsUserSelectedEnemy_bl;
	}

	_onSelectNextTargetSuspicion()
	{
		this._resetTarget();
		this._tryToSelectNextTarget();
	}

	_onTargetingSuspicion(event)
	{
		this._fCurTargetPreference_int = undefined;
		this._fIsUserSelectedEnemy_bl = true;
		this._updateTargeting(event.targetEnemyId);

		if (APP.isBattlegroundGame)
		{
			this._fUserSelectionTime_int = Date.now();
			this._validatePause();
		}
	}

	_onResetTarget()
	{
		this._resetTarget();
		this._resetB3FormationTarget();
		this._fCurTargetPreference_int = undefined;
	}

	_onEnemyKilledMiss(event)
	{
		if (this.info.isActive && this.info.targetEnemyId === event.enemyId)
		{
			this._resetTarget();
			this._tryToSelectNextTarget();
		}
	}

	_onEnemyInvulnerableMiss(event)
	{
		if (this.info.isActive && this.info.targetEnemyId === event.enemyId)
		{
			this._resetTarget();
			this._tryToSelectNextTarget();

			APP.logger.i_pushDebug(`TargetingController. DEBUG: enemy id: ${event.enemyId} is set invulnerable by server. Target dropped.`);
			console.log("DEBUG: enemy id: " + event.enemyId + " is set invulnerable by server. Target dropped");
		}
	}

	_onTargetEnemyIsDead(event)
	{
		if (this.info.isActive && this.info.targetEnemyId === event.enemyId)
		{
			this._resetTarget();
			this._tryToSelectNextTarget();
		}
	}

	_onTargetingB3Invulnerable(event)
	{
		if (this.info.isActive && this.info.targetEnemyId === event.enemyId)
		{
			this.info.rememberedTargetUntilInvulnerable = event.enemyId;
			this._resetTarget();
			this._tryToSelectNextTarget();
		}
	}

	_onTargetingB3Vulnerable()
	{
		if (this.info.isActive && this.info.rememberedTargetUntilInvulnerable)
		{
			this._resetTarget();
			this._updateTargeting(this.info.rememberedTargetUntilInvulnerable);
			this.info.rememberedTargetUntilInvulnerable = null;
		}
	}

	_onAutoTargetingSwitched(event)
	{
		if (event.on) // Clear current target
		{
			this.info.i_resetTarget();
			this.view.updateCrosshair(false);
			this.emit(TargetingController.EVENT_ON_TARGET_RESET);
		}
		else
		{
			
			this._resetTarget();
			this._resetB3FormationTarget();
			this._tryToSelectNextTarget();
			this.emit(TargetingController.EVENT_ON_TARGET_RESET);
			
		}
	}

	_updateTargeting(aTargetEnemyId_int)
	{
		this._resetNextTargetTimer();

		let lTargetEnemyId_int = aTargetEnemyId_int;

		if (this._fGameStateInfo_gsi.gameState != ROUND_STATE.PLAY
			|| APP.playerController.info.isObserver
			|| this._gameScreen.gameFieldController.roundResultActive)
		{
			lTargetEnemyId_int = null;
		}

		this._addViewIfRequired();

		this.info.targetEnemyId = lTargetEnemyId_int;

		let lTargetEnemy_enm;
		if (lTargetEnemyId_int !== null && !isNaN(lTargetEnemyId_int))
		{
			lTargetEnemy_enm = this._gameScreen.gameFieldController.getExistEnemy(lTargetEnemyId_int);
		}

		if (!lTargetEnemy_enm || !lTargetEnemy_enm.parent)
		{
			this.info.i_resetTarget();
			this.view.updateCrosshair(false);
		}

		if (lTargetEnemy_enm)
		{
			// if (this._gameScreen.gameStateController.info.isBossSubround && !lTargetEnemy_enm.isBoss)
			// {
			// 	return; // Do not choose non enemy target during boss round
			// }

			if (lTargetEnemy_enm.isB3FormationEnemy() || lTargetEnemy_enm.typeId == ENEMY_TYPES.MONEY)
			{
				this.info.isCurrentTargetB3formation = true;
				this.info.isCurrentTargetB3formationMainEnemyId = lTargetEnemy_enm.id == ENEMY_TYPES.MONEY ? lTargetEnemy_enm.id : lTargetEnemy_enm.parentEnemyId;
			}

			this._fCurTargetPreference_int = APP.playerController.info.getEnemyPayouts(lTargetEnemy_enm.typeId).minPayout;

			lTargetEnemy_enm.on(Enemy.EVENT_ON_ENEMY_START_DYING, this._onSelectNextTargetSuspicion, this);
			lTargetEnemy_enm.on(Enemy.EVENT_ON_ENEMY_VIEW_REMOVING, this._onSelectNextTargetSuspicion, this);
			this.view.updateCrosshair(true);
		}

		this.emit(TargetingController.EVENT_ON_TARGET_UPDATED, {targetEnemyId: this.info.targetEnemyId});
	}

	_addViewIfRequired()
	{
		if (this.view.parent)
		{
			return;
		}
		this.view.addToContainerIfRequired(this._gameScreen.gameFieldController.targetingContainerInfo);
	}

	_onRoomUnpaused()
	{
		this._updateTargeting(this.info.targetEnemyId);
	}

	_onSecondaryScreenActivated()
	{
		this._fIsLobbySecondaryScreenActive_bl = true;
		this._validatePause();
	}

	_onSecondaryScreenDeactivated()
	{
		this._fIsLobbySecondaryScreenActive_bl = false;
		this._validatePause();
	}

	_onFireSettingsScreenActivated()
	{
		this._fIsFireSettingsActivated_bl = true;
		this._validatePause();
	}

	_onFireSettingsScreenDeactivated()
	{
		this._fIsFireSettingsActivated_bl = false;
		this._validatePause();
	}

	_onDialogActivated()
	{
		this._fIsDialogActivated_bl = true;
		this._validatePause();
	}

	_onDialogDeactivated()
	{
		this._fIsDialogActivated_bl = false;
		this._validatePause();
	}

	_onChooseWeaponScreenChanged(aEvent_obj)
	{
		let lIsActive_bln = aEvent_obj.isActive;
		if (lIsActive_bln == this._fIsChooseWeaponScreenActivated_bln) return;

		this._fIsChooseWeaponScreenActivated_bln = lIsActive_bln;
		this._validatePause();
	}

	_validatePause()
	{
		let lIsPaused_bl =	this._fIsLobbySecondaryScreenActive_bl ||
							this._fIsDialogActivated_bl ||
							this._fIsFireSettingsActivated_bl ||
							this._fIsChooseWeaponScreenActivated_bln ||
							this._fUserSelectionTime_int !== undefined;

		if (this.info.isPaused !== lIsPaused_bl)
		{
			this.info.isPaused = lIsPaused_bl;
			this.emit(TargetingController.EVENT_ON_PAUSE_STATE_UPDATED);
		}
	}

	_onBackToLobbyButtonClicked()
	{
		this._clearAll();
	}

	_tryToSelectNextTarget()
	{
		console.log("iafm: " + APP.isAutoFireMode );
		if(APP.isAutoFireMode)
		{
			let lNextEnemyId_int = this._getNextMostValuableEnemyId();
			if (lNextEnemyId_int == null || lNextEnemyId_int < 0)
			{
				this._resetTarget();
				this._resetB3FormationTarget();
				this._startNextTargetTimer();
				return;
			}
			this._updateTargeting(lNextEnemyId_int)
		}else{
			return;
		}
	}

	_resetNextTargetTimer()
	{
		this.info.lookingForATarget = false;
		this._fNextTargetTimer_tmr && this._fNextTargetTimer_tmr.destructor();
		this._fNextTargetTimer_tmr = null;
	}

	_startNextTargetTimer()
	{
		this.view.updateCrosshair(false);
		this._resetNextTargetTimer();
		this.info.lookingForATarget = true;
		this._fNextTargetTimer_tmr = new Timer(this._tryToSelectNextTarget.bind(this), 100);
	}

	_getNextMostValuableEnemyId()
	{
		let lPlayerInfo_pi = APP.playerController.info;
		let lCurTargetPriorityType_int = lPlayerInfo_pi.targetPriority;
		let lCurTargetPreference_int = this._fCurTargetPreference_int;
		let lEnemies_obj_arr = this._gameScreen.enemiesController.getRegisteredEnemies().slice();
		let lGameScreen_gs = this._gameScreen;
		let lGameField_gf = lGameScreen_gs.gameFieldController;

		!APP.isBattlegroundGame && lEnemies_obj_arr.sort(
			function (a, b)
			{
				let lEnemyAPreference_int = lPlayerInfo_pi.getEnemyPayouts(a.typeId).minPayout;
				let lEnemyBPreference_int = lPlayerInfo_pi.getEnemyPayouts(b.typeId).minPayout;
				if (lCurTargetPriorityType_int == 2
					&& lCurTargetPreference_int !== undefined) // SAME
				{
					let lAPrefDelta = Math.abs(lEnemyAPreference_int - lCurTargetPreference_int);
					let lBPrefDelta = Math.abs(lEnemyBPreference_int - lCurTargetPreference_int);

					return (lAPrefDelta <= lBPrefDelta) ? -1 : 1;
				}
				else if (lCurTargetPriorityType_int == 1) // LOW
				{
					//boss has highest priority...
					if (a.typeId == ENEMY_TYPES.BOSS)
					{
						return 1;
					}
					else if (b.typeId == ENEMY_TYPES.BOSS)
					{
						return -1;
					}
					//...boss has highest priority

					return lEnemyAPreference_int - lEnemyBPreference_int;
				}
				else //HIGH
				{
					//boss has highest priority...
					if (a.typeId == ENEMY_TYPES.BOSS)
					{
						return -1;
					}
					else if (b.typeId == ENEMY_TYPES.BOSS)
					{
						return 1;
					}
					//...boss has highest priority

					return lEnemyBPreference_int - lEnemyAPreference_int;
				}
			}
		);

		let lBossVisible_bl = lGameField_gf.isBossEnemyExist;

		// It's needed to find out the visibility of the boss
		if (lBossVisible_bl)
		{
			lEnemies_obj_arr.map(enemy => {
				let lEnemyView_enm = lGameField_gf.getExistEnemy(enemy.id);
	
				if (enemy.typeId == ENEMY_TYPES.BOSS)
				{
					let lPosition_obj = lEnemyView_enm.getAccurateCenterPositionWithCrosshairOffset();
					lBossVisible_bl = Utils.isPointInsideRect(new PIXI.Rectangle(lEnemyView_enm.crosshairPaddingXLeft, lEnemyView_enm.crosshairPaddingYBottom, lEnemyView_enm.pointInsideRectWidth, lEnemyView_enm.pointInsideRectHeight), lPosition_obj);
				}
			});
		}

		this._checkB3FormationTarget(lEnemies_obj_arr);

		// if the boss is visible, we should choose him. Otherwise, we use default filter
		let lEnemies_B3_obj_arr = null;
		if(this.info.isCurrentTargetB3formation)
		{
			lEnemies_B3_obj_arr = lEnemies_obj_arr.filter(enemy => {
				let lEnemyView_enm = lGameField_gf.getExistEnemy(enemy.id);
				if (
					lEnemyView_enm && 
					(lEnemyView_enm.isB3FormationEnemy() && lEnemyView_enm.isTargetable() 
					|| lEnemyView_enm.typeId == ENEMY_TYPES.MONEY && !lEnemyView_enm.isEnemyLockedForTarget)
					)
				{
					return true;
				}
				else
				{
					return false;
				}
			});
		}

		if(	this.info.isCurrentTargetB3formation && !lEnemies_B3_obj_arr
			|| !this.info.isCurrentTargetB3formation)
		{
			lEnemies_obj_arr = lEnemies_obj_arr.filter(enemy => {
				let lEnemyView_enm = lGameField_gf.getExistEnemy(enemy.id);	
				if (lBossVisible_bl)
				{
					if (enemy.typeId !== ENEMY_TYPES.BOSS)
					{
						return false;
					}
	
					return true;
				}
	
				return (enemy.life !== 0
					&& !enemy.killedMiss
					&& lEnemyView_enm
					&& lEnemyView_enm.parent
					&& !lEnemyView_enm.isFireDenied
					&& !lEnemyView_enm.invulnerable
					&& lEnemyView_enm.isTargetable()
					&& !lEnemyView_enm.isEnemyLockedForTarget);
			});
		}
		else
		{
			lEnemies_obj_arr = lEnemies_B3_obj_arr;
		}
		

		if (lEnemies_obj_arr.length === 0)
		{
			return null;
		}

		if (APP.isBattlegroundGame)
		{
			let lLastPos_p = this._fLastCrosshairsPos_p;

			let lNearestEnemy_obj = null;
			let lEnemiesIds_int_arr = [];
			for (let i=0; i<lEnemies_obj_arr.length; i++)
			{
				lEnemiesIds_int_arr.push(lEnemies_obj_arr[i].id);
			}

			if (!!lLastPos_p)
			{
				lNearestEnemy_obj = this._fFireController_fc.getNearestEnemy(lLastPos_p.x, lLastPos_p.y, 1, lEnemiesIds_int_arr);
			}
			else
			{
				let lGunPos_p = lGameField_gf.getGunPosition(lGameField_gf.seatId);
				if (!lGunPos_p)
				{
					return null;
				}

				lNearestEnemy_obj = this._fFireController_fc.getNearestEnemy(lGunPos_p.x, lGunPos_p.y, 2, lEnemiesIds_int_arr);
			}

			return lNearestEnemy_obj ? lNearestEnemy_obj.id : null;
		}

		lEnemies_obj_arr = lEnemies_obj_arr.filter(function(value, index, self) {
			return (value.typeId === self[0].typeId || value.typeId === ENEMY_TYPES.BOSS);
		});

		let r = Utils.random(0, lEnemies_obj_arr.length-1);
		return lEnemies_obj_arr[r].id;
	}

	_checkB3FormationTarget(aEnemies_obj_arr)
	{
		if (this.info.isCurrentTargetB3formation)
		{
			let lGameScreen_gs = this._gameScreen;
			let lGameField_gf = lGameScreen_gs.gameFieldController;
			for (let i = 0; i < aEnemies_obj_arr.length; i++)
			{
				let lEnemyView_enm = lGameField_gf.getExistEnemy(aEnemies_obj_arr[i].id);
				if (
					lEnemyView_enm && 
					(
					(
						lEnemyView_enm.isB3FormationEnemy()
						&& lEnemyView_enm.parentEnemyId == this.info.isCurrentTargetB3formationMainEnemyId
					)
					|| 
					(
						lEnemyView_enm.typeId == ENEMY_TYPES.MONEY
						 && !lEnemyView_enm.isEnemyLockedForTarget
					 	&& lEnemyView_enm.id == this.info.isCurrentTargetB3formationMainEnemyId
					)
					)
					)
				{
					return;
				}
			}

			this._resetB3FormationTarget();	
		}
	}

	_resetB3FormationTarget()
	{
		this.info.isCurrentTargetB3formation = false;
		this.info.isCurrentTargetB3formationMainEnemyId = null;
	}

	_resetTarget()
	{
		let lValidatePauseRequired_bl = this._fUserSelectionTime_int !== undefined;

		if (this.info.targetEnemyId)
		{
			let l_enm = this._gameScreen.gameFieldController.getExistEnemy(this.info.targetEnemyId);

			if (l_enm)
			{
				l_enm.off(Enemy.EVENT_ON_ENEMY_START_DYING, this._onSelectNextTargetSuspicion, this);
				l_enm.off(Enemy.EVENT_ON_ENEMY_VIEW_REMOVING, this._onSelectNextTargetSuspicion, this);
			}
		}

		this._fIsBossTargetingRequired_bl = false;
		this._fIsUserSelectedEnemy_bl = false;
		this._fUserSelectionTime_int = undefined;
		this._updateTargeting(null);

		if (lValidatePauseRequired_bl)
		{
			this._validatePause();
		}
	}

	destroy()
	{
		this._resetTarget();
		this._resetB3FormationTarget();

		if (this._gameScreen)
		{
			this._gameScreen.off(GameScreen.EVENT_ON_TARGETING, this._onTargetingSuspicion, this);
			this._gameScreen.off(GameScreen.EVENT_ON_RESET_TARGET, this._onResetTarget, this);
			this._gameScreen.off(GameScreen.EVENT_ON_ROOM_UNPAUSED, this._onRoomUnpaused, this);
			this._gameScreen.off(GameScreen.EVENT_ON_DIALOG_ACTIVATED, this._onDialogActivated, this);
			this._gameScreen.off(GameScreen.EVENT_ON_DIALOG_DEACTIVATED, this._onDialogDeactivated, this);
			this._gameScreen.off(GameScreen.EVENT_ON_BACK_TO_LOBBY_BUTTON_CLICKED, this._onBackToLobbyButtonClicked, this);
			this._gameScreen.off(GameScreen.EVENT_ON_KILLED_MISS_ENEMY, this._onEnemyKilledMiss, this);
			this._gameScreen = null;
		}

		APP.off(Game.EVENT_ON_GAME_SECONDARY_SCREEN_ACTIVATED, this._onSecondaryScreenActivated, this);
		APP.off(Game.EVENT_ON_GAME_SECONDARY_SCREEN_DEACTIVATED, this._onSecondaryScreenDeactivated, this);

		this._fGameStateInfo_gsi = null;
		this._fIsLobbySecondaryScreenActive_bl = undefined;
		this._fIsDialogActivated_bl = undefined;
		this._fIsFireSettingsActivated_bl = undefined;
		this._fIsChooseWeaponScreenActivated_bln = undefined;
		this._fIsUserSelectedEnemy_bl = undefined;
		this._fUserSelectionTime_int = undefined;

		super.destroy();
	}

	_clearAll()
	{
		this._resetNextTargetTimer();
		this._resetTarget();
		this._resetB3FormationTarget();

		this._fCurTargetPreference_int = undefined;

		this._fIsLobbySecondaryScreenActive_bl = false;
		this._fIsDialogActivated_bl = false;
		this._fIsFireSettingsActivated_bl = false;
		this._fIsChooseWeaponScreenActivated_bln = false;
		this._fIsUserSelectedEnemy_bl = false;

		this.info.isPaused = false;
	}
}

export default TargetingController