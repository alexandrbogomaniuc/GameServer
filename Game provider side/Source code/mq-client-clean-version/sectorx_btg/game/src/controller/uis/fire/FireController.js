
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import * as Easing from '../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { Utils } from "../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils";
import SimpleUIController from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/uis/base/SimpleUIController';
import FireInfo from '../../../model/uis/fire/FireInfo';
import GameScreen from '../../../main/GameScreen';
import GameExternalCommunicator from '../../../controller/external/GameExternalCommunicator';
import KeyboardControlProxy from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/interaction/keyboard/KeyboardControlProxy';
import GameWebSocketInteractionController from '../../interaction/server/GameWebSocketInteractionController';
import { LOBBY_MESSAGES} from '../../../controller/external/GameExternalCommunicator';
import GameFieldController, {Z_INDEXES} from '../../../controller/uis/game_field/GameFieldController'
import {WEAPONS, RICOCHET_WEAPONS, FRAME_RATE, IS_SPECIAL_WEAPON_SHOT_PAID, ENEMY_TYPES, ENEMIES} from '../../../../../shared/src/CommonConstants';
import { MIN_SHOT_Y, MAX_SHOT_Y } from '../../../config/Constants';
import { ROUND_STATE } from '../../../model/state/GameStateInfo';
import Bullet from '../../../main/bullets/Bullet';
import RicochetBullet from '../../../main/bullets/RicochetBullet';
import RicochetEffect from '../../../main/bullets/RicochetEffect';
import DefaultGunFireEffect from '../../../main/animation/default_gun/DefaultGunFireEffect';
import PlayerSpot from '../../../main/playerSpots/PlayerSpot';
import GunRotateController from './GunRotateController';
import TargetingController from '../targeting/TargetingController';
import Timer from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import FireSettingsController from '../fire_settings/FireSettingsController';

const HALF_PI = Math.PI / 2;

const AUTO_FIRE_TIMEOUTS = {
	MIN: {
		OTHER: 160
	},
	MIDDLE: {
		OTHER: 290
	},
	MAX: {
		OTHER: 550
	}
}

const CURSOR_MOVE_UNIT = 7; // px
const MIN_FIRE_REQUEST_TIMEOUT = 150; // minimum timeout between shots
const MIDDLE_FIRE_REQUEST_TIMEOUT = 230; // middle timeout between shots
const MAX_FIRE_REQUEST_TIMEOUT = 500; // maximum timeout between shots

class FireController extends SimpleUIController
{
	static get EVENT_ON_START_UPDATE_CURSOR_POSITION() 				{ return 'onStartUpdateCursorPosition';}
	static get EVENT_ON_RESET_TARGET() 								{ return 'onResetTarget';}
	static get EVENT_TIME_TO_VALIDATE_CURSOR() 						{ return 'onTimeToValidateCursor';}
	static get EVENT_ON_TRY_TO_SKIP_BIG_WIN() 						{ return 'onTryToSkipBigWin';}
	static get EVENT_ON_BULLET_FLY_TIME() 							{ return 'onBulletFlyTime';}
	static get DEFAULT_GUN_SHOW_FIRE() 								{ return 'onGunShowFire';}
	static get EVENT_ON_RICOCHET_BULLET_REGISTER() 					{ return 'onRicochetBulletRegister';}
	static get EVENT_ON_RICOCHET_BULLET_FLY_OUT() 					{ return 'onRicochetBulletFlyOut';}
	static get EVENT_ON_BULLET_PLACE_NOT_ALLOWED() 					{ return 'onBulletPlaceNotAllowed';}
	static get EVENT_ON_CLEAR_BULLETS_BY_SEAT_ID() 					{ return 'onClearBulletsBySeatId';}
	static get EVENT_ON_TARGETING() 								{ return 'onTargeting';}
	static get EVENT_ON_BULLET_CLEAR()								{return "onBulletClear";}
	static get EVENT_NOT_ENOUGH_MONEY_DIALOG_REQUIRED()				{return "onNotEnoughMoneyDialogRequired";}
	static get EVENT_ON_FIRE_CANCELLED_WITH_NOT_ENOUGH_AMMO()		{return 'onFireConcalledWithNotEnoughAmmo';}
	static get EVENT_ON_TARGET_ENEMY_IS_DEAD()						{return 'onTargetEnemyIsDead';}
	static get EVENT_ON_SHOT_REQUEST()								{return 'onShotRequest';}
	static get EVENT_ON_BULLET_WAS_REMOVED()						{return 'onBulletWasRemoved';}
	static get DEFAULT_GUN_SHOW_SHOT_GLOW()							{return "onDefaultGunShowShotGlow";}
	static get EVENT_ON_TARGET_B3_FORMATION_INVULNERABLE()			{return "onTargetB3FormationInvulnerable";}
	static get EVENT_ON_TARGET_B3_FORMATION_VULNERABLE()			{return "onTargetB3FormationVulnerable"}

	static get EVENT_ON_STOP_UPDATE_CURSOR_POSITION() 				{ return GunRotateController.EVENT_ON_STOP_UPDATE_CURSOR_POSITION};
	static get EVENT_ON_SET_SPECIFIC_CURSOR_POSITION() 				{ return GunRotateController.EVENT_ON_SET_SPECIFIC_CURSOR_POSITION};	

	static get EVENT_ON_AUTOFIRE_BUTTON_ENABLED() 							{return GameScreen.EVENT_ON_AUTOFIRE_BUTTON_ENABLED;}
	static get EVENT_ON_AUTOFIRE_BUTTON_DISABLED() 							{return GameScreen.EVENT_ON_AUTOFIRE_BUTTON_DISABLED;}
	static get EVENT_ON_NON_RICOCHET_BULLETS_PAYBACK_REQUIRED() 			{return "onNonRicochetBulletsPaybackRequired"}

	constructor() {
		super(new FireInfo());

		this._gameScreen = null;
		this._gameField = null;

		this._fFireSettingsController_fssc = null;
		this._fFireSettingsInfo_fsi = null;

		this._fTargetingController_tc = null;
		this._fTargetingInfo_tc = null;

		this._fGunRotateController_grc = null;

		this._fAutoTargetingSwitcherController_atsc = null;
		this._fAutoTargetingSwitcherInfo_atsi = null;

		this._fRicochetController_rc = null;

		this._fGameStateController_gsc =  null;
		this._fGameStateInfo_gsi = null;

		this.pointerPushed = false;
		this.autofireTime = 0;
		this._fLastFireTime_num = 0;

		this._flastPointerPos_pnt = {
			x: 0,
			y: 0
		};

		this.bullets = [];
		this.cursorKeysMoveTime = 0;
		this._fFxAnims_arr = [];

		this._fTournamentModeInfo_tmi = null;
		this._defaultGunFireEffects_sprt_arr = [];

		this._fWeaponOffsetYFiringContinuously_int = null;
		this._fPushWeaponEffectPlaying_bl = null;
		this._fCurrentWeaponSpotGun = null;

		this._fTickListening_bln = null;
		
		this.autofireButtonEnabled = false;
	}

	i_clearRoom()
	{
		this.removeAllBullets();
		this._removeAllDefaultGunFireEffects();
		this._resetTargetIfRequired(true);
		this._removeRichochetFxAnimations();
		this._stopListeningCursorMoveTick();

		this.emit(FireController.EVENT_ON_START_UPDATE_CURSOR_POSITION);
	}

	i_unpushPointer()
	{
		this.unpushPointer();
	}

	i_resetTargetIfRequired(aAnyway_bl = false)
	{
		this._resetTargetIfRequired(aAnyway_bl);
	}

	i_validateCursor()
	{
		this._validateCursor();
	}

	i_clearBulletsIfRequired()
	{
		let lClearRicochetBullets_bl = false;
		let lClearNonRicochetBullets_bl = false;

		if (this._fRicochetController_rc)
		{
			let lDelayedRicochetShotsAmount = APP.webSocketInteractionController.delayedRicochetShotsAmount;
			let lHasDelayedRicochetShots = lDelayedRicochetShotsAmount > 0;
			if (
					this._fRicochetController_rc.info.isAnyBulletExist
					|| lHasDelayedRicochetShots
				)
			{
				lClearRicochetBullets_bl = true;
			}
		}

		lClearNonRicochetBullets_bl = APP.webSocketInteractionController.delayedNonRicochetShotsAmount > 0;

		if (lClearRicochetBullets_bl || lClearNonRicochetBullets_bl)
		{
			this.clearMasterBullets(lClearRicochetBullets_bl);
		}
	}

	i_onChooseWeaponsStateChanged(aVal_bln)
	{
		this.gunRotateController.i_onChooseWeaponsStateChanged(aVal_bln);
	}

	isMasterBulletExist()
	{
		let lMasterSeatBuletCount_num = this.bullets.filter(function(item) {
			return item.isMasterBullet;
		}).length;

		return lMasterSeatBuletCount_num > 0;
	}

	isActiveMasterBulletExist()
	{
		let lActiveMasterSeatBuletCount_num = this.bullets.filter(function(item) {
			return item.isMasterBullet && item.isActive && item.isRequired;
		}).length;

		return lActiveMasterSeatBuletCount_num > 0;
	}

	i_startDefaultGunShowFire(aSeatId)
	{
		this._startDefaultGunShowFire(aSeatId);
	}

	i_addBullet(aProjectile)
	{
		this.bullets.push(aProjectile);
	}

	i_rotateGun(x, y)
	{
		this.gunRotateController.rotateGun(x, y)
	}

	i_onRoomPaused()
	{
		this.gunRotateController.i_onRoomPaused();
		this._stopListeningCursorMoveTick();
	}

	get lastFireTime()
	{
		return this._fLastFireTime_num;
	}

	get isPointerPushed()
	{
		return this.pointerPushed;
	}

	get isRicochetLimitReached()
	{
		let isRicochetsLimitReached = (this._fRicochetController_rc && this._fRicochetController_rc.info.isMasterBulletsLimitReached);

		return isRicochetsLimitReached;
	}

	get fireTimeout()
	{
		switch (this._fFireSettingsInfo_fsi.fireSpeed)
		{
			case 1:
				return MAX_FIRE_REQUEST_TIMEOUT;
			case 2:
				return MIDDLE_FIRE_REQUEST_TIMEOUT;
			case 3:
			default:
				return MIN_FIRE_REQUEST_TIMEOUT;
		}
	}

	get spot()
	{
		return this._gameField.spot;
	}

	get seatId()
	{
		return APP.playerController.info.seatId;
	}

	get autoTargetingEnemy()
	{
		let lTargetEnemyId_int = APP.currentWindow.targetingController.info.targetEnemyId;
		return this._gameField.getExistEnemy(lTargetEnemyId_int);
	}

	get _isAutoTargetingEnemyAvailableForFire()
	{
		if (this.autoTargetingEnemy && !this.autoTargetingEnemy.isTargetable())
		{
			return false;
		}
		return true;
	}

	get isRicochetAllowed()
	{
		let lCurWeaponId_num = this._fWeaponsInfo_wsi ? this._fWeaponsInfo_wsi.currentWeaponId : undefined;
		let isAutotargetActive = this._fTargetingInfo_tc.isActive;

		return this.isRicochetWeapon(lCurWeaponId_num) && !isAutotargetActive;
	}

	get screenField()
	{
		return APP.currentWindow.gameFieldController.screenField;
	}

	isRicochetWeapon(aWeaponId)
	{
		return RICOCHET_WEAPONS.indexOf(aWeaponId) >= 0;
	}

	isRicochetSW(aWeaponId)
	{
		return this.isRicochetWeapon(aWeaponId) && aWeaponId !== WEAPONS.DEFAULT;
	}

	getGunPosition(seatId)
	{
		let seat = this.getSeat(seatId, true);

		if (!seat)
		{
			return null;
		}

		let gunPos = {x: 0, y: 0};
		let lSitPositionIds_arr = APP.currentWindow.gameFieldController.sitPositionIds;
		let playerPos = this.getSpotPosition(lSitPositionIds_arr[seatId], (this.seatId === seatId));

		gunPos.x = playerPos.x + seat.gunCenter.x;
		gunPos.y = playerPos.y + seat.gunCenter.y;

		return gunPos;
	}

	getSeat(id, optAllowSpot)
	{
		optAllowSpot = Boolean(optAllowSpot);

		if (optAllowSpot && this.spot && this.spot.id == id)
		{
			return this.spot;
		}

		if (this._gameField.playersContainer)
		{
			for (let seat of this._gameField.playersContainer.children)
			{
				if (seat.id == id) return seat;
			}
		}

		return null;
	}

	getSpotPosition(positionId, isMasterSpot_bl)
	{
		let lPlayersPositions_obj = APP.currentWindow.gameFieldController.playersPositions;
		let positions = APP.isMobile ? lPlayersPositions_obj["MOBILE"] : lPlayersPositions_obj["DESKTOP"]
		let spotPosDescr = positions[positionId];

		let spotPos = {
			x: 		spotPosDescr.x + (isMasterSpot_bl ? spotPosDescr.masterOffset.x : 0),
			y: 		spotPosDescr.y + (isMasterSpot_bl ? spotPosDescr.masterOffset.y : 0),
			direct: spotPosDescr.direct,
		}

		return spotPos;
	}

	//GUN ROTATE...
	get gunRotateController()
	{
		return this._fGunRotateController_grc || (this._fGunRotateController_grc = this._initGunRotateController());
	}

	_initGunRotateController()
	{
		let l_grc = new GunRotateController();

		l_grc.on(GunRotateController.EVENT_ON_STOP_UPDATE_CURSOR_POSITION, this.emit, this);
		l_grc.on(GunRotateController.EVENT_ON_SET_SPECIFIC_CURSOR_POSITION, this.emit, this);

		return l_grc;
	}
	//...GUN ROTATE

	set lastPointerPos(aPos)
	{
		this._flastPointerPos_pnt = aPos;
	}

	get lastPointerPos()
	{
		return this._flastPointerPos_pnt;
	}

	get _isFrbMode()
	{
		return APP.currentWindow.gameFrbController.info.frbMode;
	}

	get _isBonusMode()
	{
		return APP.currentWindow.gameBonusController.info.isActivated;
	}

	get _roundResultActive()
	{
		return this._gameField.roundResultActive;
	}

	__init()
	{
		super.__init();
	}

	init()
	{
		this._gameScreen = APP.currentWindow;
		this._gameField = this._gameScreen.gameFieldController;

		this._fFireSettingsController_fssc = this._gameScreen.fireSettingsController;
		this._fFireSettingsInfo_fsi = this._fFireSettingsController_fssc.info;
		this._fFireSettingsController_fssc.on(FireSettingsController.EVENT_ON_FIRE_SETTINGS_CHANGED, this._onFireSettingsChanged, this);

		this._fTargetingController_tc = this._gameScreen.targetingController;
		this._fTargetingInfo_tc = this._fTargetingController_tc.info;

		this._fAutoTargetingSwitcherController_atsc = this._gameScreen.autoTargetingSwitcherController;
		this._fAutoTargetingSwitcherInfo_atsi = this._fAutoTargetingSwitcherController_atsc.info;

		this._fWeaponsController_wsc = this._gameScreen.weaponsController;
		this._fWeaponsInfo_wsi = this._fWeaponsController_wsc.i_getInfo();

		this._fRicochetController_rc = this._gameField.ricochetController;

		this._fGameStateController_gsc =  this._gameScreen.gameStateController;
		this._fGameStateInfo_gsi = this._fGameStateController_gsc.info;
	
		this._fTournamentModeInfo_tmi = APP.tournamentModeController.info;

		APP.webSocketInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_MESSAGE, this._onServerMessage, this);
		this._gameScreen.on(GameScreen.EVENT_ON_BULLET_RESPONSE, this._onBulletResponse, this);
		this._gameScreen.on(GameScreen.EVENT_ON_BULLET_CLEAR_RESPONSE, this._onBulletClearResponse, this);
		this._gameScreen.on(GameScreen.EVENT_ON_LASTHAND_BULLETS, this._onLasthandBullets, this);
		this._gameScreen.on(GameScreen.EVENT_ON_BULLET_PLACE_NOT_ALLOWED, this._onBulletPlaceNotAllowed, this);

		this._gameScreen.on(GameScreen.EVENT_ON_AUTOFIRE_BUTTON_ENABLED, this._onAutoFireButtonEnabled, this);
		this._gameScreen.on(GameScreen.EVENT_ON_AUTOFIRE_BUTTON_DISABLED, this._onAutoFireButtonDisabled, this);

		this._fTargetingController_tc.on(TargetingController.EVENT_ON_PAUSE_STATE_UPDATED, this._onTargetingControllerPauseStateUpdate, this);
		this._fTargetingController_tc.on(TargetingController.EVENT_ON_TARGET_RESET, this._tryToResumeAutofire, this)

		this._gameField.on(GameFieldController.EVENT_ON_NEW_ENEMY_CREATED, this._onNewEnemyCreated, this);

		this._gameField.view.on('pointerdown', (e)=> this.pushPointer(e));
		this._gameField.view.on('pointermove', (e) => {
			this.emit(FireController.EVENT_ON_START_UPDATE_CURSOR_POSITION);

			this.gunRotateController.tryRotateGun(e);
			if (!this._roundResultActive)
			{
				this._validateCursor();
			}
		});
		this._gameField.view.on('pointerup', (e) => this.unpushPointer(e));
		this._gameField.view.on('pointerupoutside', (e) => this.unpushPointer(e));
		window.addEventListener('mouseup', (e) => this.unpushPointer(e));
		this._gameField.view.on('rightclick', (e) => this.onPointerRightClick(e));
		this._gameField.view.on('pointerclick', (e) => this.onPointerClick(e));
		APP.on('onTickerPaused', (e) => this.unpushPointer(e));

		APP.externalCommunicator.on(GameExternalCommunicator.LOBBY_MESSAGE_RECEIVED, this._onLobbyExternalMessageReceived, this);
		APP.keyboardControlProxy.on(KeyboardControlProxy.i_EVENT_BUTTON_CLICKED, this._onKeyboardButtonClicked, this);
		APP.keyboardControlProxy.on(KeyboardControlProxy.i_EVENT_BUTTON_SPACE_UP, this._onKeyboardButtonSpaceUp, this);
		
		this.gunRotateController.init();
	}

	__initControlLevel()
	{
		super.__initControlLevel();		
	}

	_onServerMessage(event)
	{
		let messageData = event.messageData;
		let messageClass = messageData.class;

		switch( messageClass )
		{
			case "Miss":
			case "Hit":
				if(messageData.seatId != this.seatId)
				{
					if(this._isNeedRotate_bl && !this._isRicochetBulletExist())
					{
						this.gunRotateController.i_rotatePlayerGun(messageData.seatId, messageData.x, messageData.y);
					}
					else
					{
						this._isNeedRotate_bl = true;
					}
				}
		}
	}

	_onAutoFireButtonEnabled(aEvent_obj)
	{
		this.autofireButtonEnabled = true;

		if (aEvent_obj.enemy)
		{
			this.emit(FireController.EVENT_ON_AUTOFIRE_BUTTON_ENABLED);
			this._tryUpdateTargetAndFire(aEvent_obj.enemy);
		}
		else
		{
			let lTargetEnemy_enm = this.getNearestEnemy(this.spot.x, this.spot.y, 2);

			if (!lTargetEnemy_enm)
			{
				this._validateAutofireButton(false);
				return;
			}
			else
			{
				this.emit(FireController.EVENT_ON_AUTOFIRE_BUTTON_ENABLED);
				this._tryUpdateTargetAndFire(lTargetEnemy_enm);
			}
		}
	}

	_onAutoFireButtonDisabled()
	{
		this.autofireButtonEnabled = false;

		this.emit(FireController.EVENT_ON_AUTOFIRE_BUTTON_DISABLED);
		this._resetTargetIfRequired(true);
	}

	_tryToResumeAutofire()
	{
		//for mobile BTG: target is not reset by AutoTargetingSwitcher, shooting resumes
		if(APP.isBattlegroundGame && this.autofireButtonEnabled) return;

		if(APP.isBattlegroundGame && !this._fAutoTargetingSwitcherInfo_atsi.isOn)
		{
			this._validateAutofireButton(true);
		}
		else
		{
			this._validateAutofireButton(false, null, true);
		}
	}

	_validateAutofireButton(aState_bl, aEnemy_e, aOptIsQuietMode_bl=false)
	{
		this.autofireButtonEnabled = aState_bl;
		if (APP.isBattlegroundGame && this._gameField.spot && this._gameField.spot.autofireButton.enabled != aState_bl)
		{
			this._gameField.spot.autofireButton.i_setEnable(aState_bl, aEnemy_e, aOptIsQuietMode_bl);
		}
	}

	_onTargetingControllerPauseStateUpdate()
	{
		this.fireImmediatelyIfRequired();
	}

	_tryToSkipBigWin()
	{
		this.emit(FireController.EVENT_ON_TRY_TO_SKIP_BIG_WIN);
	}

	//CUSTOM CURSOR...
	_validateCursor()
	{
		this.emit(FireController.EVENT_TIME_TO_VALIDATE_CURSOR);
	}
	//...CUSTOM CURSOR


	//BULLET...	
	_onBulletPlaceNotAllowed(aEvent_obj)
	{
		let requestData = aEvent_obj.requestData;
		APP.gameScreen.revertAmmoBack(requestData.weaponId, undefined, requestData.isPaidSpecialShot, requestData.isRoundNotStartedError);
		
		this.emit(FireController.EVENT_ON_BULLET_PLACE_NOT_ALLOWED, {bulletId: requestData.bulletId});
	}

	_onBulletClearResponse(aEvent_obj)
	{
		let seatId = aEvent_obj.data.seatNumber;
		this.emit(FireController.EVENT_ON_CLEAR_BULLETS_BY_SEAT_ID, {seatId: seatId});
	}

	_onBulletResponse(aEvent_obj)
	{
		let data = aEvent_obj.data;
		let isMasterSeat = (data.rid !== -1);

		for( let i = 0; i < this.bullets.length; i++ )
		{
			if(this.bullets[i].bulletId === data.bulletId)
			{
				this.bullets[i].onBulletResponse();
			}
		}

		if (!isMasterSeat)
		{
			this._isNeedRotate_bl = false;
			let bulletId = data.bulletId;
			let seatId = +bulletId.slice(0, 1);
			let weaponId = data.weaponId;

			let startPos = {x: data.startPointX, y: data.startPointY};
			let distanationPos = {x: data.endPointX, y: data.endPointY};

			this.ricochetFire(distanationPos, seatId, bulletId, weaponId, data.bulletTime, startPos);
		}
	}

	_onLasthandBullets(aEvent_obj)
	{
		let bullets = aEvent_obj.bullets;
		let alreadySeatId = aEvent_obj.alreadySitInNumber;
		let isClearMasterBulletsRequired = false;
		
		for (let bullet of bullets)
		{
			let bulletId = bullet.bulletId;
			let seatId = +bulletId.slice(0, 1);
			let weaponId = bullet.weaponId;

			if (seatId === alreadySeatId)
			{
				isClearMasterBulletsRequired = true;
				continue;
			}

			if (this._isRicochetBulletExist(bulletId))
			{
				continue;
			}

			let startPos = {x: bullet.startPointX, y: bullet.startPointY};
			let distanationPos = {x: bullet.endPointX, y: bullet.endPointY};

			this.ricochetFire(distanationPos, seatId, bulletId, weaponId, bullet.bulletTime, startPos, true);
		}

		if (isClearMasterBulletsRequired)
		{
			this.clearMasterBullets(true);
		}
	}

	clearMasterBullets(aClearBulletsOnServer_bl=false)
	{
		this.emit(FireController.EVENT_ON_BULLET_CLEAR, {clearBulletsOnServer: aClearBulletsOnServer_bl});
	}

	removeAllBullets()
	{
		while (this.bullets.length)
		{
			try
			{
				let bullet = this.bullets.shift();
				if (
					bullet instanceof Bullet 
					&& bullet.isMasterBullet 
					&& bullet.isActive
				)
				{
					this._backAmmoForCurrentNotRichochetBullet(bullet);
				}
				
				bullet.destroy();
			}
			catch (err)
			{
				APP.logger.i_pushWarning(`FireController. :: removeAllBullets >>  ${JSON.stringify(err)}.`);
				console.log("FireController.js :: removeAllBullets >> ", err);
			}
		}
		this.bullets = [];
	}

	_backAmmoForCurrentNotRichochetBullet(bullet)
	{
		let lBackAmmoOpt_obj = {
			weaponId: bullet.weapon,
			betLevel: bullet.betLevel,
			currentBullets: 1
		}

		this.emit(FireController.EVENT_ON_NON_RICOCHET_BULLETS_PAYBACK_REQUIRED, lBackAmmoOpt_obj);
	}

	_isRicochetBulletExist(aOptBulletId_str=undefined)
	{
		for(var i = 0; i < this.bullets.length; i++)
		{
			let lCurBullet = this.bullets[i];
			if ( lCurBullet instanceof RicochetBullet)
			{
				if (aOptBulletId_str === undefined || aOptBulletId_str === lCurBullet.bulletId)
				{
					return true;
				}
			}
		}
		return false;
	}

	ricochetFire(distanationPos, seatId, optResponseBulletId_str = null, optResponseWeaponId_int = null, optStartTime = null, optStartPos = null, lasthand = false)
	{
		let lSpot_ps = this.getSeat(seatId, true);
		if (!lSpot_ps)
		{
			APP.logger.i_pushWarning(`FireController. Cannot show ricochet fire, no target seat detected, seatId: ${seatId}.`);
			console.log(`Cannot show ricochet fire, no target seat detected, seatId: ${seatId}`);
			return;
		}

		this.emit(FireController.EVENT_ON_BULLET_FLY_TIME);
		this._gameField.playWeaponSound(WEAPONS.DEFAULT, seatId !== this.seatId, lSpot_ps.currentDefaultWeaponId);

		let endPos = {x: Math.round(distanationPos.x), y: Math.round(distanationPos.y)};
		let startPos = optStartPos ? optStartPos : lSpot_ps.muzzleTipGlobalPoint;
		startPos = {x: Math.round(startPos.x), y: Math.round(startPos.y)};
		let angle = Math.atan2(endPos.x - startPos.x, endPos.y - startPos.y);
		let len = Math.sqrt(Math.pow(startPos.x - endPos.x, 2) + Math.pow(startPos.y - endPos.y, 2));

		if (!lasthand)
		{
			this.gunRotateController.i_rotatePlayerGun(seatId, endPos.x, endPos.y);
			this._startDefaultGunShowFire(seatId);	
			this.addPushEffect(lSpot_ps);
		}

		if(seatId != this.seatId)
		{
			this._addDefaultGunFireEffect(lSpot_ps.muzzleTipGlobalPoint.x, lSpot_ps.muzzleTipGlobalPoint.y, angle + HALF_PI, len, lSpot_ps.currentDefaultWeaponId, lSpot_ps);
		}
		else
		{
			this._addDefaultGunFireEffect(startPos.x, startPos.y, angle + HALF_PI, len, lSpot_ps.currentDefaultWeaponId, lSpot_ps);
		}

		let timeDiff = 0;
		if (optStartTime !== null)
		{
			timeDiff = APP.gameScreen.accurateCurrentTime - optStartTime;
		}

		let lWeaponId_num = optResponseWeaponId_int !== null ? optResponseWeaponId_int : lSpot_ps.currentWeaponId;

		var bullet = new RicochetBullet({weaponId: lWeaponId_num, defaultWeaponId: lSpot_ps.currentDefaultWeaponId}, startPos, endPos, optResponseBulletId_str, timeDiff, lasthand);
		bullet.zIndex = Z_INDEXES.BULLET;

		if (!optResponseBulletId_str)
		{
			this.emit(FireController.EVENT_ON_RICOCHET_BULLET_REGISTER, {bullet: bullet});
		}

		this.emit(FireController.EVENT_ON_RICOCHET_BULLET_FLY_OUT, {bullet: bullet});

		this._addMaskToBullet(bullet, lSpot_ps);

		this.screenField.addChild(bullet);
		this.bullets.push(bullet);
		APP.currentWindow.balanceController.updatePlayerBalance();
	}

	_addMaskToBullet(aBullet_rb, aSpot_obj)
	{
		let lMask_g = this.screenField.addChild(new PIXI.Graphics());
		lMask_g.zIndex = Z_INDEXES.BULLET;

		let lPosition_obj = {...aSpot_obj.position};
		let lRadius_num = 205;

		if(!aSpot_obj.isMaster)
		{
			lPosition_obj._x += 25;
			lPosition_obj._y -= !aSpot_obj.isBottom ? 10 : 0;
			lRadius_num -= 5;
		}
		lMask_g.clear().lineStyle(300, 0x000000, 2).arc(lPosition_obj._x, lPosition_obj._y, lRadius_num, 2/3*Math.PI, Math.PI-2/3*Math.PI);

		if(!aSpot_obj.isBottom)
		{
			lMask_g.clear().lineStyle(300, 0x000000, 2).arc(lPosition_obj._x, lPosition_obj._y, lRadius_num, -2/3*Math.PI, Math.PI+2/3*Math.PI);
		}
		
		new Timer(() => {
			aBullet_rb.mask =null;
			lMask_g && lMask_g.destroy()
		}, 3*FRAME_RATE);
		aBullet_rb.mask = lMask_g;
	}

	_startDefaultGunShowFire(aSeatId)
	{
		this.emit(FireController.DEFAULT_GUN_SHOW_FIRE, {seat: aSeatId});
	}
	
	onRicochetBulletShotOccurred(aBullet_rb, aEnemy_e)
	{
		this.emit(FireController.EVENT_ON_SHOT_REQUEST);

		this.emit(
			'fire',
			{
				id: aEnemy_e.id,
				weaponId: aBullet_rb.weaponId,
				x: aBullet_rb.position.x,
				y: aBullet_rb.position.y,
				bulletId: aBullet_rb.bulletId,
				weaponPrice: this._calcShotWeaponPrice(aBullet_rb.weaponId)
			});
	}	

	_onCollisionOccurred(aBullet_rb, aEnemy_e)
	{
		aEnemy_e.showHitBounce(aBullet_rb.directionAngle, aBullet_rb.weaponId);
		aEnemy_e.playHitHighlightAnimation(5 * FRAME_RATE);
		
		let lSeat_pt = this.getSeat(aBullet_rb.seatId, true);
		let lSpotCurrentDefaultWeaponId_int = lSeat_pt ? lSeat_pt.currentDefaultWeaponId : 1;
		
		lSeat_pt && this._gameField.showMissEffect(
			aBullet_rb.position.x,
			aBullet_rb.position.y,
			aBullet_rb.weaponId,
			aEnemy_e,
			lSpotCurrentDefaultWeaponId_int,
			lSeat_pt.isMaster);
	}

	tickBullets(delta, realDelta)
	{
		let lDelta_num = realDelta;

		for (let bullet of this.bullets)
		{
			if (
				bullet.isConfirmedOrDeniedByServer() &&
				!bullet.isRequired()
				)
			{
				this.removeBullet(bullet);
			}

			//NON RICOCHET BULLETS...
			if(!bullet.isRicochetBullet())
			{
				bullet.tick(delta, realDelta);
			}
			//...NON RICOCHET BULLETS
		}
	

		//RICOCHET BULLETS...
		while(lDelta_num > 0)
		{
			let lStepDelta_num = 5;

			if(lDelta_num < lStepDelta_num)
			{
				lStepDelta_num = lDelta_num;
			}

			lDelta_num -= lStepDelta_num;
		
			for (let bullet of this.bullets)
			{
				if(
					bullet.isRicochetBullet() &&
					bullet.isRequired()
					)
				{
					do
					{
						
						bullet.timeDiff -= lStepDelta_num;
						bullet.tick(lStepDelta_num, lStepDelta_num);
						this._fRicochetController_rc.onBulletMove(bullet);
						
						//CHECK COLLISIONS...
						if(bullet.isRequired() && lDelta_num == 0)
						{
							let lEnemies_arr = this._gameField.allExistEnemies;
							for( let i = 0; i < lEnemies_arr.length; i++ )
							{
								let lEnemy_e = lEnemies_arr[i];
	
								if(
									bullet.isRequired() &&
									lEnemy_e.isEnemyAvailableToShot() &&
									lEnemy_e.isCollision(
										bullet.position.x,
										bullet.position.y)
									)
								{
									lEnemy_e = this._getEnemyIfB3FormationCollision(lEnemy_e);
									bullet.onCollisionOccurred(lEnemy_e);
									this._onCollisionOccurred(bullet, lEnemy_e);
									bullet.setIsRequired(false);
									break;
								}
							}		
						}
						//...CHECK COLLISIONS
					}
					while (bullet.timeDiff > 0)
				}
			}
		}
		//...RICOCHET BULLETS
	}

	_getEnemyIfB3FormationCollision(aEnemy_e)
	{
		if (aEnemy_e.typeId == ENEMY_TYPES.MONEY)
		{
			let lAffectedEnemy_e = this._getRandomB3FormationCircularEnemy(aEnemy_e.id);
			if (lAffectedEnemy_e)
			{
				let lRadius_num = APP.gameScreen.enemiesController.getCircularRadius(lAffectedEnemy_e.typeId, lAffectedEnemy_e.isCircularLargeRadius);
				lRadius_num += APP.gameScreen.enemiesController.getCircularRadius(ENEMY_TYPES.MONEY, false);
				aEnemy_e.hitDome({x: lAffectedEnemy_e.x, y: lAffectedEnemy_e.y, radius: lRadius_num});
				aEnemy_e = lAffectedEnemy_e;
			}
		}

		return aEnemy_e;
	}

	_getRandomB3FormationCircularEnemy(aParentId_num)
	{
		let lEnemies_arr = this._gameField.allExistEnemies;
		let lEnemyId_arr = [];
		for (let i = 0; i < lEnemies_arr.length; i++)
		{
			if (lEnemies_arr[i].parentEnemyTypeId == ENEMY_TYPES.MONEY 
				&& lEnemies_arr[i].parentEnemyId == aParentId_num
				&& lEnemies_arr[i].isTargetable())
			{
				lEnemyId_arr.push(i);
			}
		}

		let lRandomId_num = Math.floor(Math.random() * lEnemyId_arr.length);
		return lEnemies_arr[lEnemyId_arr[lRandomId_num]];
	}

	removeBullet(bullet)
	{
		if (!this.bullets)
		{
			return;
		}

		if(bullet.isRicochetBullet())
		{
			bullet.tryToCompleteShotIfCollisionHappenedBeforeBulletWasApprovedByServer();
		}
		
		let bulletIndex = this.bullets.indexOf(bullet);
		if (bulletIndex >= 0)
		{
			bullet = this.bullets.splice(bulletIndex, 1)[0];
		}

		if(bullet.isRicochetBullet())
		{
			this._fRicochetController_rc.onBulletDestroy(bullet);	
		}

		if (!this.isMasterBulletExist())
		{
			this.emit(FireController.EVENT_ON_BULLET_WAS_REMOVED);
		}

		if(bullet)
		{
			bullet.destroy();
		}
	}

	generateBullet(bulletProps, points, callback, aIsMasterBullet_bl)
	{
		let bullet;
		bullet = new Bullet(bulletProps, points, callback, aIsMasterBullet_bl);
		bullet.on(Bullet.EVENT_ON_SHOW_RICOCHET_EFFECT, (e) => {this.showRicochetEffect(e.x, e.y)}); 
		

		return bullet;
	}

	showRicochetEffect(x, y)
	{
		let ricochetEffect = this.screenField.addChild(new RicochetEffect(x, y));
		ricochetEffect.once("animationFinish", this.onRicochetEffectFinished, this);

		this._fFxAnims_arr.push(ricochetEffect);
	}

	onRicochetEffectFinished(event)
	{
		let lIndex_int = this._fFxAnims_arr.indexOf(event.target);
		if (~lIndex_int)
		{
			this._fFxAnims_arr.splice(lIndex_int, 1);
		}
	}

	_removeRichochetFxAnimations()
	{
		while (this._fFxAnims_arr.length)
		{
			this._fFxAnims_arr.shift().destroy();
		}
		this._fFxAnims_arr = [];
	}
	//...BULLET

	//FIRE EFFECTS...
	_addDefaultGunFireEffect(x, y, angle, len, aOptSpotCurrentDefaultWeaponId_int = 1, aOptSpot_s)
	{
		if (aOptSpot_s && APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			let lSpotCurrentDefaultWeaponId_int = aOptSpotCurrentDefaultWeaponId_int;
			let fireEffect = new DefaultGunFireEffect(lSpotCurrentDefaultWeaponId_int, this._fWeaponOffsetYFiringContinuously_int, aOptSpot_s.isMaster);
			
			let scale = 2;
			let hitboomScale = 1;

			let lWeaponMultiplierValue_num;

			switch (lSpotCurrentDefaultWeaponId_int)
			{
				case 1:
					hitboomScale = 1.09;
					lWeaponMultiplierValue_num = 90;
					break;
				case 2:
					hitboomScale = 1.5;
					lWeaponMultiplierValue_num = 91;
					break;
				case 3:
					hitboomScale = 1.5;
					lWeaponMultiplierValue_num = 88;
					break;
				case 4:
					hitboomScale = 2.54;
					lWeaponMultiplierValue_num = 85;
					break;
				case 5:
					hitboomScale = 2.23;
					lWeaponMultiplierValue_num = 88;
					break;
				default:
					break;
			}

			let lPosMultiplier_num = lWeaponMultiplierValue_num * PlayerSpot.WEAPON_SCALE * scale * hitboomScale;

			fireEffect.rotation = - angle - HALF_PI;
			let dx = - Math.cos(angle) * lPosMultiplier_num;
			let dy = - Math.sin(angle) * lPosMultiplier_num;

			fireEffect.scale.set(hitboomScale * PlayerSpot.WEAPON_SCALE);
			fireEffect.position.set(x + dx, y - dy);

			fireEffect.once(DefaultGunFireEffect.EVENT_ON_ANIMATION_COMPLETED, this._onDefaultGunAnimationCompleted, this);
			fireEffect.once(Sprite.EVENT_ON_DESTROYING, this._onDefaultGunAnimationDestroying, this);
			
			this.screenField.addChild(fireEffect);
			fireEffect.zIndex = Z_INDEXES.GUN_FIRE_EFFECT;
			
			this._defaultGunFireEffects_sprt_arr.push(fireEffect);

			this.emit(FireController.DEFAULT_GUN_SHOW_SHOT_GLOW, {x: x, y: y, angle: angle});
		}
	}

	_onDefaultGunAnimationCompleted(event)
	{
		this._destroyDefaultGunFireEffect(event.target);
	}

	
	_onDefaultGunAnimationDestroying(event)
	{
		if (!this._defaultGunFireEffects_sprt_arr || !this._defaultGunFireEffects_sprt_arr.length)
		{
			return;
		}

		let fireEffect = event.target;
		
		let lIndex_int = this._defaultGunFireEffects_sprt_arr.indexOf(fireEffect);
		if (~lIndex_int)
		{
			this._defaultGunFireEffects_sprt_arr.splice(lIndex_int, 1);
		}
	}

	_destroyDefaultGunFireEffect(fireEffect)
	{
		if (!fireEffect)
		{
			return;
		}

		let lIndex_int = this._defaultGunFireEffects_sprt_arr.indexOf(fireEffect);
		if (~lIndex_int)
		{
			this._defaultGunFireEffects_sprt_arr.splice(lIndex_int, 1);
		}

		fireEffect.off(DefaultGunFireEffect.EVENT_ON_ANIMATION_COMPLETED, this._onDefaultGunAnimationCompleted, this, true);
		fireEffect.destroy();
	}

	_removeAllDefaultGunFireEffects()
	{
		if (!this._defaultGunFireEffects_sprt_arr)
		{
			return;
		}

		while (this._defaultGunFireEffects_sprt_arr.length)
		{
			let fireEffect = this._defaultGunFireEffects_sprt_arr.pop();
			fireEffect.off(DefaultGunFireEffect.EVENT_ON_ANIMATION_COMPLETED, this._onDefaultGunAnimationCompleted, this, true);
			fireEffect.destroy();
		}
		this._defaultGunFireEffects_sprt_arr = [];
	}

	showPlayersWeaponEffect(data, angle = undefined)
	{
		let lPlayers = this._gameField.gamePlayers;

		for (var i = 0; i < lPlayers.length; ++i)
		{
			if (lPlayers[i].seatId == data.seatId)
			{
				if (lPlayers[i].weaponSpotView)
				{
					if (lPlayers[i].currentWeaponId != data.usedSpecialWeapon
							|| (data.betLevel && lPlayers[i].spot.currentDefaultWeaponId != this._getDefaultWeaponIdByBetLeavel(data.betLevel)))
					{
						lPlayers[i].currentWeaponId = lPlayers[i].specialWeaponId = data.usedSpecialWeapon;
						let lMult_int = APP.playerController.info.getTurretSkinId(data.betLevel);
						lPlayers[i].spot.changeWeapon(data.usedSpecialWeapon, lMult_int);
					}

					lPlayers[i].weaponSpotView.rotation = -angle - HALF_PI;

					if (!lPlayers[i].spot.isBottom)
					{
						lPlayers[i].weaponSpotView.rotation += Math.PI;
					}

					let seat = this.getSeat(lPlayers[i].seatId, true);
					this.addPushEffect(seat);
				}
				break;
			}
		}
	}
	
	_getDefaultWeaponIdByBetLeavel(aBetLevel_num)
	{
		let lDefaultWeaponId_num = 1
		switch(aBetLevel_num)
		{
			case 1:
				lDefaultWeaponId_num = 1;
				break;
			case 2:
				lDefaultWeaponId_num = 2;
				break;
			case 3:
				lDefaultWeaponId_num = 3;
				break;
			case 5:
				lDefaultWeaponId_num = 4;
				break;
			case 10:
				lDefaultWeaponId_num = 5;
				break;
			default:
				throw new Error(`Wrong bet leavel ${aBetLevel_num} !`);
		}

		return lDefaultWeaponId_num;
	}

	addPushEffect(seat)
	{
		let target = seat.weaponSpotView;
		let gun = seat.weaponSpotView.gun;

		this._fPushWeaponEffectPlaying_bl = true;
		this._fCurrentWeaponSpotGun = gun;

		if (!target.pushSequence)
		{
			target.startPosX = target.x;
			target.startPosY = target.y;
		}
		else
		{
			target.pushSequence.stop();
			target.pushSequence.destructor();
			target.pushSequence = null;

			target.x = target.startPosX;
			target.y = target.startPosY;
		}

		gun.showShotlight();

		var endX = target.x;
		var endY = target.y;

		var dist = 8;
		let durations = [40, 0, 60, 5];

		dist *= PlayerSpot.WEAPON_SCALE;

		let ang = -HALF_PI;

		let dx = dist*Math.cos(ang);
		let dy = dist*Math.sin(ang);

		var pushX = endX - dx;
		var pushY = endY - dy;

		let sequence = [
			{
				tweens: [
					{prop: "x", to: pushX},
					{prop: "y", to: pushY}
				],
				duration: durations[0],
				ease: Easing.quadratic.easeInOut
			},
			{
				tweens: [],
				duration: durations[1]
			},
			{
				tweens: [
					{prop: "x", to: endX},
					{prop: "y", to: endY}
				],
				duration: durations[2],
				ease: Easing.quadratic.easeInOut
			},
			{
				tweens: [],
				duration: durations[3],
				onfinish: () => {
					gun.hideShotlight();

					if (!this.isPointerPushed && !this.isAutoFireEnabled)
					{
						gun.y = 0;
						this._fWeaponOffsetYFiringContinuously_int = 0;
					}

					this._fPushWeaponEffectPlaying_bl = false;
				}
			}
		];

		target.pushSequence = Sequence.start(gun, sequence);
	}
	//...FIRE EFFECTS


	//FIRE...
	chooseFireType(e)
	{
		if (!this.isRicochetAllowed)
		{
			if (e)
			{
				this.fire(e); 
			}
			else
			{
				this._isAutoTargetingEnemyAvailableForFire && this.fireImmediately();
			}
		}
		else
		{
			if (this.isRicochetLimitReached)
			{
				let limit = this._fRicochetController_rc ? this._fRicochetController_rc.info.bulletsLimit : undefined;
				APP.logger.i_pushWarning(`FireController. Ricochet bullets has reached their limit: ${limit}, shot is refused.`);
				console.log(`Ricochet bullets has reached their limit: ${limit}, shot is refused.`);
			}
			else
			{
				let data = data || {data: {global:{x: this._flastPointerPos_pnt.x, y: this._flastPointerPos_pnt.y}}}
				this.fire(data, true);
			}
		}
	}

	_tryUpdateTargetAndFire(aEnemy_e)
	{
		// DEBUG... stub update trajectory
		// this.emit("stubUpdateTrajectory", {enemyId: e.enemyId});
		// return;
		// ...DEBUG
		let lId_int = aEnemy_e.id;

		if (!this._fFireSettingsInfo_fsi.lockOnTarget || aEnemy_e.isEnemyLockedForTarget && aEnemy_e.typeId != ENEMY_TYPES.MONEY) 
		{
			return;
		}

		this.unpushPointer();
		this.emit(FireController.EVENT_ON_TARGETING, {targetEnemyId: lId_int});
		if (this._fFireSettingsInfo_fsi.autoFire && !this._fTargetingInfo_tc.isPaused)
		{
			this.fireImmediately();
			this._validateAutofireButton(true);
		}
	}

	_checkWeaponRecoilOffsetAfterEndShooting() 
	{
		if (!this._fPushWeaponEffectPlaying_bl
			&& this._fWeaponOffsetYFiringContinuously_int > 0
			)
		{
			this._fCurrentWeaponSpotGun.y = 0;
		}
	}

	fireImmediatelyIfRequired()
	{
		if (this._fFireSettingsInfo_fsi.autoFire)
		{
			if (
					(this._fTargetingInfo_tc.isActive && !!this.autoTargetingEnemy)
					|| this.pointerPushed
				)
			{
				this._isAutoTargetingEnemyAvailableForFire && this.fireImmediately();
			}
		}
	}
	
	fireImmediately()
	{
		this.fire({ 
			data: {
				global:{
					x: this._flastPointerPos_pnt.x,
					y: this._flastPointerPos_pnt.y,
				}
			}
		});
	}

	get _fireDenyReasons()
	{
		let lReasons_obj = {
			"Not a PLAY state": this._fGameStateInfo_gsi.gameState != ROUND_STATE.PLAY,
			"Spot is not defined": !this.spot,
			"Spot is not visible": this.spot && this.spot.weaponSpotView && !this.spot.weaponSpotView.visible,
			"Round Result window is active": this._roundResultActive,
			"Map is loading": APP.currentWindow.subloadingController.isLoadingScreenShown,
			"Weapon switch in progress": this._gameField.weaponSwitchInProgress,
			"Weapon change in process": this._gameField.isWeaponChangeInProcess,
			"Lobby secondary screen is active": this._gameField.lobbySecondaryScreenActive,
			"Tournament completed": this._fTournamentModeInfo_tmi.isTournamentOnServerCompletedState,
			"Sit Out request is awaited": APP.webSocketInteractionController.isSitoutRequestInProgress,
			"Some dialogs are active": APP.isAnyDialogActive,
			"Fire settings screen is active": this._gameField.fireSettingsScreenActive,
			"Server's message of weapon switch is awaited": this._gameField.serverMessageWeaponSwitchExpected,
			"Spot is waiting for bet level response": this.spot && this.spot.isWaitingResponseToBetLevelChangeRequest,
			"Spot weapon change is in progress": this.spot && this.spot.weaponSpotView && this.spot.weaponSpotView.isWeaponChangeInProgress,
			"Spot weapon change animations have effects": this.spot && this.spot.isWeaponChangeEffectsInProgress,
			"Buy-In expected on room start": APP.currentWindow.isExpectedBuyInOnRoomStarted,
			"Spot is waiting for bet level change after fire": this.spot && this.spot.isBetLevelChangeRequiredAfterFiring,
			"Proper bet level is not applied yet": !this._gameField._isProperWeaponLevelApplied(),
			"BTG final counting denies fire": APP.isBattlegroundGame && this._gameField.battlegroundFinalCountingController.info.isFinalCountingFireDenied,
			"AutoFire: terget is paused": this._fTargetingInfo_tc.isActiveTargetPaused,
			"Current weapon is not defined": this._fWeaponsInfo_wsi.currentWeaponId == undefined || this._fWeaponsInfo_wsi.currentWeaponId == null,
			// "Some debug reason": true
		}
		return Object.entries(lReasons_obj).filter(([k, v]) => Boolean(v)).map(([k, v])=> k);
	}

	get _isFireDenied()
	{
		return	this._fGameStateInfo_gsi.gameState != ROUND_STATE.PLAY
				|| !this.spot
				|| (this.spot.weaponSpotView && !this.spot.weaponSpotView.visible)
				|| this._roundResultActive
				|| APP.currentWindow.subloadingController.isLoadingScreenShown /*map is loading*/
				|| this._gameField.weaponSwitchInProgress
				|| this._gameField.isWeaponChangeInProcess
				|| this._gameField.lobbySecondaryScreenActive
				|| this._fTournamentModeInfo_tmi.isTournamentOnServerCompletedState
				|| APP.webSocketInteractionController.isSitoutRequestInProgress
				|| APP.isAnyDialogActive
				|| this._gameField._fWeaponToRestore_int !== null
				|| this._gameField.fireSettingsScreenActive
				|| this._gameField.serverMessageWeaponSwitchExpected
				|| this.spot.isWaitingResponseToBetLevelChangeRequest
				|| (this.spot.weaponSpotView && this.spot.weaponSpotView.isWeaponChangeInProgress)
				|| this.spot.isWeaponChangeEffectsInProgress
				|| APP.currentWindow.isExpectedBuyInOnRoomStarted
				|| this.spot.isBetLevelChangeRequiredAfterFiring
				|| !this._gameField._isProperWeaponLevelApplied()
				|| APP.isBattlegroundGame && this._gameField.isFinalCountingFireDenied
				|| APP.isBattlegroundGame && APP.gameScreen.roundFinishSoon
				|| APP.isBattlegroundGame && APP.gameScreen.scoreboardController.info.isRoundTimeIsOver
				|| this._fTargetingInfo_tc.isActiveTargetPaused
				|| this._fWeaponsInfo_wsi.currentWeaponId == undefined	|| this._fWeaponsInfo_wsi.currentWeaponId == null
	}

	fire(e, isRicochet = false)
	{
		//debug info for QA...
		// if (this._fWeaponsInfo_wsi && this._fWeaponsInfo_wsi.currentWeaponId === WEAPONS.DEFAULT)
		// {
		// 	console.log("FIRE attempt, DEFAULT weapon ammo:" + this._fWeaponsInfo_wsi.ammo);
		// }
		//...debug info for QA

		let lWeaponsInfo_wsi = this._fWeaponsInfo_wsi;
		let lCurrentWeaponId_int = lWeaponsInfo_wsi.currentWeaponId;
		let IsFreeSWShots_bl = lCurrentWeaponId_int !== WEAPONS.DEFAULT;
		let lIsFreeShot_bl = IsFreeSWShots_bl || this._isFrbMode;
		
		//https://jira.dgphoenix.com/browse/DRAG-753
		if (
			this._isFrbMode
			&& lWeaponsInfo_wsi.ammo <= 0
		)
		{
			return;
		}

		if (this._isFireDenied)
		{
			let lReasons_arr = this._fireDenyReasons;
			if (lReasons_arr.length > 0)
			{
				APP.logger.i_pushDebug(`FireController. Fire denied because ${lReasons_arr.toString()}`);
				console.log(`FireController. Fire denied because ${lReasons_arr.toString()}`);
			}

			if(!this._gameField._isProperWeaponLevelApplied())
			{
				console.log("FireProblem_Fix One");
				this._gameField.selectNextWeaponFromTheQueue();
				this._gameField.redrawAmmoText();
			}

			return;
		}

		this.autofireTime = 0;

		let lTargetPoint_pt = e.data.global;

		if (!this._fLastFireTime_num) 
		{
			this._fLastFireTime_num = Date.now();
		}
		else
		{
			let lCurrentTime_num = Date.now();
			let lTimeout_num = lCurrentTime_num - this._fLastFireTime_num;

			let lFireTimeout_num = this.fireTimeout;

			if (lTimeout_num  < lFireTimeout_num)
			{
				APP.logger.i_pushDebug(`FireController. Shot is refused because the previous shot was done ${lTimeout_num} ms ago. This is less then a minimum timeout of ${lFireTimeout_num} ms.`);
				console.log(`Shot is refused because the previous shot was done ${lTimeout_num} ms ago. This is less then a minimum timeout of ${lFireTimeout_num} ms.`);
				return;
			}

			this._fLastFireTime_num = lCurrentTime_num;
		}

		let lPlayerInfo_pi = APP.playerController.info;
		let lShotMultiplier_int = lPlayerInfo_pi.betLevel * this._calcShotMultiplier();
		let lShotAmmoAmount_int = lShotMultiplier_int;

		if (lIsFreeShot_bl)
		{
			lShotAmmoAmount_int = 1; // for FREE SW
		}

		let lIsBattlegroundDefaultShot_bl = lCurrentWeaponId_int == WEAPONS.DEFAULT && APP.isBattlegroundGame;
		if ( !lIsFreeShot_bl && !lIsBattlegroundDefaultShot_bl && lWeaponsInfo_wsi.ammo < lShotAmmoAmount_int)
		{
			APP.logger.i_pushDebug(`FireController. Rest ammo (${lWeaponsInfo_wsi.ammo}) < shot required ammo (${lShotAmmoAmount_int}).`);
			console.log(`rest ammo (${lWeaponsInfo_wsi.ammo}) < shot required ammo (${lShotAmmoAmount_int})`);
			if (!this._gameField.isAmmoBuyingInProgress)
			{
				if (this._gameField.isWeaponAddingInProgress || APP.gameScreen.levelUpController.isPendingMasterSWAwardsExist)
				{
					return;
				}

				this._gameField.redrawAmmoText();

				let lRicochetBullets_num = lPlayerInfo_pi.ricochetBullets;
				if (lPlayerInfo_pi.betLevel > 1 && (lWeaponsInfo_wsi.ammo >= 1))
				{
					lRicochetBullets_num = 0; // Ignore if bet > 1 or not default weapon
				}
				let lShotCost_num = this._fWeaponsInfo_wsi.i_getCurrentWeaponShotPrice();
				if (lPlayerInfo_pi.balance < lShotCost_num && !lPlayerInfo_pi.unpresentedWin)
				{
					if (
							this._fTournamentModeInfo_tmi.isTournamentMode
							&& !IS_SPECIAL_WEAPON_SHOT_PAID
						)
					{
						// in tournaments we should not trigger rebuy if we still have
						this._resetTargetIfRequired();
					}
					else if (lRicochetBullets_num)
					{
						return; // No actions needed if we don't have money, but have ricochet bullets on screen
					}
					else
					{
						console.error("NOT enough ammo for shot, ammo:", lWeaponsInfo_wsi.ammo, "; requires for shot:", lShotAmmoAmount_int);
						APP.logger.i_pushError(`NOT enough ammo for shot, ammo: ${lWeaponsInfo_wsi.ammo}; requires for shot: ${lShotAmmoAmount_int}`);
					}
				}
				else
				{
					let lTotalRealAmmoAmount_num = lWeaponsInfo_wsi.realAmmo + lPlayerInfo_pi.pendingAmmo;
					lTotalRealAmmoAmount_num = Number(lTotalRealAmmoAmount_num.toFixed(2));

					let lTotalAmmoAmount_num = Math.floor(lTotalRealAmmoAmount_num);
					if (lTotalAmmoAmount_num < lShotAmmoAmount_int && !APP.playerController.info.unpresentedWin) //wait until the win is presented
					{
						this.emit(FireController.EVENT_ON_FIRE_CANCELLED_WITH_NOT_ENOUGH_AMMO);

					}
				}
			}
			return;
		}
		else if (lIsFreeShot_bl && lCurrentWeaponId_int == WEAPONS.HIGH_LEVEL && lWeaponsInfo_wsi.remainingSWShots <= 0)
		{
			APP.currentWindow.gameFieldController.updateCurrentWeapon(false);
			return;
		}

		if (lWeaponsInfo_wsi.currentWeaponId != WEAPONS.DEFAULT)
		{
			if (lWeaponsInfo_wsi.remainingSWShots == 0)
			{
				APP.logger.i_pushDebug(`GameField. '0 special ammo left, shotRequestsAwaiting = ${this._gameField.shotRequestsAwaiting}.`);
				console.log('0 special ammo left, shotRequestsAwaiting = ' + this._gameField.shotRequestsAwaiting);
				return;
			}
		}

		let lEnemyX_num = this.lastPointerPos.x = e.data.global.x;
		let lEnemyY_num = this.lastPointerPos.y = e.data.global.y;

		let lAutoTargetEnemy = this.autoTargetingEnemy;
		//check autoTargetingEnemy, if it's already dead or fire dinied...
		if (lAutoTargetEnemy)
		{
			let enemyId = lAutoTargetEnemy.id;
			let enemyObj = APP.currentWindow.getExistEnemy(enemyId);
			let lEnemy_e = this._gameField.getExistEnemy(enemyId);

			if ((enemyObj && enemyObj.life === 0) || lEnemy_e.isFireDenied || lEnemy_e.invulnerable)
			{
				//select another target
				this.emit(FireController.EVENT_ON_TARGET_ENEMY_IS_DEAD, {enemyId: enemyId});
			}
		}
		//...check autoTargetingEnemy, if it's already dead or fire dinied
		
		let enemy = lAutoTargetEnemy || this._gameField.indicatedEnemy || this.getNearestEnemy(lEnemyX_num, lEnemyY_num);

		let lIsTargetB3FormationMainEnemy_bl = false;
		if (enemy && enemy.typeId == ENEMY_TYPES.MONEY && enemy.isEnemyLockedForTarget)
		{
			let lSaveEnemy_obj = enemy;
			lIsTargetB3FormationMainEnemy_bl = true;
			enemy = this._getRandomB3FormationCircularEnemy(enemy.id);
			if(!enemy)
			{
				enemy = lSaveEnemy_obj;
				if(enemy.circularEnemyCount_num == 0) 
				{
					enemy.setEnemyUnlocked(true);
				}
				else
				{
					this.emit(FireController.EVENT_ON_TARGET_B3_FORMATION_INVULNERABLE, {enemyId: lSaveEnemy_obj.id});//part of formation not targetable
				}
			}
		}
		let lRememberedB3Target_enemyObj = this._gameField.getExistEnemy(APP.currentWindow.targetingController.info.rememberedTargetUntilInvulnerable);
		if( lRememberedB3Target_enemyObj && lRememberedB3Target_enemyObj.typeId == ENEMY_TYPES.MONEY && APP.currentWindow.targetingController.info.isTargetEnemyDefined)
		{
			let lNewEnemy = this._getRandomB3FormationCircularEnemy(lRememberedB3Target_enemyObj.id);
			if(lNewEnemy)
			{
				enemy = lNewEnemy;
				this.emit(FireController.EVENT_ON_TARGET_B3_FORMATION_VULNERABLE);//part of formation targetable again
			}
			
			if(lRememberedB3Target_enemyObj.circularEnemyCount_num == 0)
			{
				enemy = lRememberedB3Target_enemyObj;
				enemy.setEnemyUnlocked(true);
				this.emit(FireController.EVENT_ON_TARGET_B3_FORMATION_VULNERABLE);
			}
		}

		if(
			enemy &&
			!isRicochet &&
			!enemy.isTargetable()
			)
		{
			APP.logger.i_pushDebug("FireController. Fire attempt: nearest enemy is not targetable.");
			console.log('Fire attempt: nearest enemy is not targetable.');
			return;
		}

		if (!enemy && !isRicochet)
		{
			APP.logger.i_pushDebug("FireController. Fire attempt: nearest enemy not found.");
			console.log('Fire attempt: nearest enemy not found.');
			return;
		}

		if (enemy && enemy.isDestroyed)
		{
			if (APP.mobileValidator.ios())
			{
				//IOS fire on reconnect fix
				enemy = this.getNearestEnemy(lEnemyX_num, lEnemyY_num);
			}

			if (enemy.isDestroyed)
			{
				return;
			}
			else
			{
				this._gameField.indicatedEnemy = enemy;
			}
		}

		let pushPos = this.lastPointerPos;

		if (lIsTargetB3FormationMainEnemy_bl)
		{
			pushPos = enemy.getAccurateCenterPositionWithCrosshairOffset();
		}
		else if (this.autoTargetingEnemy)
		{
			pushPos = this.autoTargetingEnemy.getAccurateCenterPositionWithCrosshairOffset();
		}
		else if (this._gameField.indicatedEnemy)
		{
			pushPos = this._gameField.indicatedEnemy.getAccurateCenterPositionWithCrosshairOffset();
		}

		lTargetPoint_pt = pushPos;
		if((lTargetPoint_pt.x < 0|| lTargetPoint_pt.x > APP.config.size.width) || (lTargetPoint_pt.y < 0 || lTargetPoint_pt.y > APP.config.size.height))
		{
			return;
		}

		this.gunRotateController.rotateGun(pushPos.x, pushPos.y);

		this._gameField.decreaseAmmo(lShotAmmoAmount_int, false);

		if (!isRicochet)
		{
			//first create the bullet then send the Shot
			let lSpot_ps = this.getSeat(APP.playerController.info.seatId, true);
			let startPos = lSpot_ps.muzzleTipGlobalPoint;
			let lSpotCurrentDefaultWeaponId_int = lSpot_ps ? lSpot_ps.currentDefaultWeaponId : 1;
			let points = [startPos];
			points.push(lTargetPoint_pt);
			let angle = Utils.getAngle(points[0], points[1]) + HALF_PI;
			let len = Math.sqrt(Math.pow(points[0].x - points[1].x, 2) + Math.pow(points[0].y - points[1].y, 2));
			
			this.i_startDefaultGunShowFire(APP.playerController.info.seatId);
			this._addDefaultGunFireEffect(startPos.x, startPos.y, angle, len, lSpotCurrentDefaultWeaponId_int, lSpot_ps);

			let bulletProps = {
				radius: 4,
				typeId: false
			};
	
			if (enemy)
			{
				bulletProps.targetEnemy = enemy;
			}

			let lCurrentWeaponId_num = this._fWeaponsController_wsc.i_getInfo().currentWeaponId;
			switch (lCurrentWeaponId_num)
			{
				case WEAPONS.DEFAULT:
				case WEAPONS.HIGH_LEVEL:
					bulletProps.defaultWeaponBulletId = lSpotCurrentDefaultWeaponId_int;
					break;
			}

			bulletProps.betLevel = lPlayerInfo_pi.betLevel;
			bulletProps.weapon = this._fWeaponsInfo_wsi.currentWeaponId;

			let seat = this.getSeat(APP.playerController.info.seatId, true);
			let lWeaponScale = seat ? seat.weaponSpotView.gun.i_getWeaponScale(lCurrentWeaponId_num) : 1;
			bulletProps.weaponScale = lWeaponScale;

			var projectile = this.generateBullet(bulletProps, points, this._onMasterNonRicochetBulletReachedTarget.bind(this), true);

			APP.gameScreen.gameFieldController.view.screen.addChild(projectile);
			this.i_addBullet(projectile);
			this.addPushEffect(this.spot);
		}
		else
		{
			this.ricochetFire(this.lastPointerPos, this.seatId);
		}

		this.changeIndicator(e);
	}

	_onMasterNonRicochetBulletReachedTarget(aBulletEndPos_p, aBulletAngle_num, aBullet_b)
	{
		let lTargetBullet_b = aBullet_b;
		let lTargetEnemyId_num = lTargetBullet_b.targetEnemyId;
		let lTargetEnemy_e = this._gameField.getExistEnemy(lTargetEnemyId_num);
		let lBulletWeaponId_num = lTargetBullet_b.weapon;
		
		if (lTargetEnemy_e)
		{
			lTargetEnemy_e.showHitBounce(aBulletAngle_num, lBulletWeaponId_num);
			lTargetEnemy_e.playHitHighlightAnimation(5 * FRAME_RATE);
		}

		this.emit(FireController.EVENT_ON_SHOT_REQUEST);

		this.emit(
			'fire',
			{
				id: lTargetEnemyId_num,
				weaponId: lBulletWeaponId_num,
				x: aBulletEndPos_p.x,
				y: aBulletEndPos_p.y,
				weaponPrice:  this._calcShotWeaponPrice(lBulletWeaponId_num)
			});
	}

	_calcShotMultiplier()
	{
		return 1;
	}

	_calcShotWeaponPrice(aWeaponId_int=undefined)
	{
		let lWeaponsInfo_wsi = this._fWeaponsInfo_wsi;
		let lCurrentWeaponId_int = aWeaponId_int !== undefined ? aWeaponId_int : lWeaponsInfo_wsi.currentWeaponId;
		let lPlayerInfo_pi = APP.playerController.info;

		let lShotMultiplier_int = lPlayerInfo_pi.getWeaponPaidCostMultiplier(lCurrentWeaponId_int);

		return lShotMultiplier_int;
	}

	changeIndicator(e)
	{
		if (this._fGameStateInfo_gsi.gameState != ROUND_STATE.PLAY || !this.spot) return;

		let x = e.data.global.x;
		let y = e.data.global.y;

		let enemy = this.getNearestEnemy(x,y),
			dist = 100;
		let len = (enemy) ? Math.sqrt(Math.pow(enemy.x - x, 2) + Math.pow(enemy.y - y, 2)) : Infinity;

		if (!enemy || len >= dist)
		{
			this._gameField.indicatedEnemy = null;
		}
		else
		{
			if (enemy && enemy.life !== 0 &&
				((this._gameField.indicatedEnemy && this._gameField.indicatedEnemy != enemy) || !this._gameField.indicatedEnemy))
			{
				this._gameField.indicatedEnemy = enemy;
			}
		}
	}

	/*
	** /aOptForcedSelectionType_int:
	** 0 - no forced selection type, use by weapon type,
	** 1 - forced selection nearest toward point (x, y),
	** 2 - forced selection nearest to point (x, y)
	*/
	getNearestEnemy(x,y, aOptForcedSelectionType_int = 0, aOptFilteredEnemyIds_int_arr = null)
	{
		let lEnemies_arr = this._gameField.allExistEnemies;

		if (!lEnemies_arr || !lEnemies_arr.length || this.seatId < 0 || !this.spot)
		{
			//console.log("[GameFieldController] getNearestEnemy: can't detect nearest enemy, no enemies on the screen.");
			return null;
		}

		let activeEnemiesPositions = [];
		for (let i = 0; i < lEnemies_arr.length; i ++)
		{
			var enemy = lEnemies_arr[i];

			if (aOptFilteredEnemyIds_int_arr && aOptFilteredEnemyIds_int_arr.indexOf(enemy.id) < 0)
			{
				continue;
			}

			if (enemy.life === 0) continue; //don't select killed enemies - the enemy might be dead on the server, but still walking on client, untill weapon killing animation is completed
			if ((enemy.isBoss) && enemy.isFireDenied) continue;
			if (enemy.isFireDenied) continue;
			if (enemy.invulnerable) continue;
			if (enemy.isDestroyed) continue; //[Y]TODO to figure out why the destroyed enemy wasn't removed from the array
			if (!enemy.isTargetable()) continue;

			var enemyPos = enemy.getAccurateCenterPositionWithCrosshairOffset();
			activeEnemiesPositions.push({enemyPos: enemyPos, enemyIndex:i});
		}

		let nearestEnemyIndex = -1;
		if (aOptForcedSelectionType_int === 0)
		{
			nearestEnemyIndex = this._isGunTowardPointerEnemySelectionTypeAvailable(this._fWeaponsInfo_wsi.currentWeaponId)
									? this._getNearestTowardPointerEnemyIndex(new PIXI.Point(x, y), activeEnemiesPositions)
									: this._getNearestToPointerEnemyIndex(new PIXI.Point(x, y), activeEnemiesPositions);
		}
		else if (aOptForcedSelectionType_int === 1)
		{
			nearestEnemyIndex = this._getNearestTowardPointerEnemyIndex(new PIXI.Point(x, y), activeEnemiesPositions);
		}
		else if (aOptForcedSelectionType_int === 2)
		{
			nearestEnemyIndex = this._getNearestToPointerEnemyIndex(new PIXI.Point(x, y), activeEnemiesPositions);
		}

		return nearestEnemyIndex < 0 ? null : lEnemies_arr[nearestEnemyIndex];
	}

	_isGunTowardPointerEnemySelectionTypeAvailable(weaponId)
	{
		if (weaponId === WEAPONS.DEFAULT || weaponId === WEAPONS.HIGH_LEVEL)
		{
			return true;
		}

		return false;
	}

	_getNearestTowardPointerEnemyIndex(pointerPosition, activeEnemiesPositions)
	{
		let gunPos = this.getGunPosition(this.seatId);
		var angles = [];
		var minAngle = 180;
		var minUnderPadAngle = 180;

		for (let i = 0; i < activeEnemiesPositions.length; i ++)
		{
			var enemyPosDescr = activeEnemiesPositions[i];
			var enemyPos = enemyPosDescr.enemyPos;
			var enemyIndex = enemyPosDescr.enemyIndex;
			let lIsUnderPadEnemy_bl = false;

			if (
				enemyPos.x > spotLeft &&
				enemyPos.x < spotRight &&
				enemyPos.y > spotTop &&
				enemyPos.y < spotBottom
			)
			{
				lIsUnderPadEnemy_bl = true;
			}

			let pointA = {x: pointerPosition.x, y: pointerPosition.y};
			let pointB = {x: gunPos.x, y: gunPos.y};
			let pointC = {x: enemyPos.x, y: enemyPos.y};

			let cosABC = Utils.cosABC(pointA, pointB, pointC);
			cosABC = Math.min(cosABC, 1);
			cosABC = Math.max(cosABC, -1);
			let angleABCInRad = Math.acos(cosABC);
			let angleABC = Utils.radToGrad(angleABCInRad)
			if (lIsUnderPadEnemy_bl && angleABC < minUnderPadAngle)
			{
				minUnderPadAngle = angleABC;
			}
			if (angleABC < minAngle && !lIsUnderPadEnemy_bl)
			{
				minAngle = angleABC;
			}

			angles.push({angle:angleABC, enemyPos:enemyPos, index: enemyIndex, isUnderPadEnemy: lIsUnderPadEnemy_bl});
		}

		if (angles.length == 0) return -1;

		var minDist = -1;
		var min = -1;
		let sortAngle = Math.max(10, minAngle);
		let edgeDist = 50; //50px to the edge of the standard weapon length
		let spotBounds = this.spot.getBounds();
		let spotLeft = this.spot.position.x - spotBounds.width/2;
		let spotRight = this.spot.position.x + spotBounds.width/2;
		let spotTop = this.spot.position.y - spotBounds.height/2;
		let spotBottom = this.spot.position.y + spotBounds.height/2;
		let underPadEnemies = [];
		for (let i = 0; i < angles.length; i ++)
		{
			let lEnemyAngleDescr = angles[i];
			
			if (lEnemyAngleDescr.angle > sortAngle) continue;
			
			if (lEnemyAngleDescr.isUnderPadEnemy)
			{
				if (lEnemyAngleDescr.angle <= minUnderPadAngle)
				{
					underPadEnemies.unshift(lEnemyAngleDescr);
				}
				else
				{
					underPadEnemies.push(lEnemyAngleDescr);
				}
				continue;
			}

			var curDistance = Math.sqrt(Math.pow(lEnemyAngleDescr.enemyPos.x - gunPos.x, 2) + Math.pow(lEnemyAngleDescr.enemyPos.y - gunPos.y, 2));
			if ((minDist == -1 || curDistance < minDist) && curDistance > edgeDist)
			{
				minDist = curDistance;
				min = i;
			}
		}

		if (min < 0)
		{
			if (!!underPadEnemies && !!underPadEnemies.length)
			{
				return underPadEnemies[0].index;
			}
			
			return angles[0].index;
		}

		return angles[min].index;
	}

	_getNearestToPointerEnemyIndex(pointerPosition, activeEnemiesPositions)
	{
		var distances = [];
		for (let i = 0; i < activeEnemiesPositions.length; i ++)
		{
			var enemyPosDescr = activeEnemiesPositions[i];
			var enemyPos = enemyPosDescr.enemyPos;
			var enemyIndex = enemyPosDescr.enemyIndex;

			var  len = Math.sqrt(Math.pow(enemyPos.x - pointerPosition.x, 2) + Math.pow(enemyPos.y - pointerPosition.y, 2));
			distances.push({len:len, index: enemyIndex});

		}

		if (distances.length == 0) return -1;

		var  min = 0;
		for (let i = 1; i < distances.length; i ++)
		{
			if (distances[i].len < distances[min].len)
			{
				min = i;
			}
		}

		return distances[min].index;
	}
	//...FIRE

	//INTERACTION...
	pushPointer(e)
	{
		this.emit(FireController.EVENT_ON_START_UPDATE_CURSOR_POSITION);

		if (APP.currentWindow.bigWinsController.isAnyBigWinAnimationInProgress)
		{
			this._tryToSkipBigWin();
			return; //prevent firing while any Big Win animations are playing
		}

		if (this._fAutoTargetingSwitcherInfo_atsi.isOn && (APP.isAutoFireMode || this._fTargetingInfo_tc.targetEnemyId)) return;

		this._resetTargetIfRequired();

		this.pointerPushed = true;

		var interaction = APP.stage.renderer.plugins.interaction;

		if (
				APP.isMobile
				|| (
						interaction.mouse.global.y > MIN_SHOT_Y
						&& interaction.mouse.global.y < MAX_SHOT_Y
					)
			)
		{
			this.gunRotateController.tryRotateGun(e);
			this.changeIndicator(e);

			if(this._fAutoTargetingSwitcherInfo_atsi.isOn)
            {
                setTimeout(()=>{
                    if(!this._fTargetingInfo_tc.targetEnemyId)
                    {
                        this.chooseFireType(e);
                    }else{
						console.log("target defined ignore shooting ");
					}
                },100);
            }else{
                this.chooseFireType(e);
            }
			
		}
	}
	
	unpushPointer()
	{
		this.emit(FireController.EVENT_ON_START_UPDATE_CURSOR_POSITION);
		this.pointerPushed = false;
		this._checkWeaponRecoilOffsetAfterEndShooting();
	}

	_onNewEnemyCreated(aEvent_obj)
	{
		if (APP.isBattlegroundGame && this.autofireButtonEnabled && !this._fTargetingInfo_tc.targetEnemyId && !this._fAutoTargetingSwitcherInfo_atsi.isOn && APP.isAutoFireEnabled)
		{
			this._tryUpdateTargetAndFire(aEvent_obj.enemy);
		}
	}

	_onEnemyRightClick(aEnemy_e)
	{
		//DEBUG...
		console.log("RIGHT CLICK ON ENEMY ID = " + aEnemy_e.id);
		//...DEBUG

		this._tryUpdateTargetAndFire(aEnemy_e);
	}

	_onEnemyClick(aEnemy_e)
	{
		let lId_int = aEnemy_e.id;

		if (this._fTargetingInfo_tc.isActive)
		{
			this._tryUpdateTargetAndFire(aEnemy_e);
		}
		else if (this._fAutoTargetingSwitcherInfo_atsi.isOn && this._fFireSettingsInfo_fsi.lockOnTarget && APP.isAutoFireEnabled)
		{
			const lTargetEnemyId_int = lId_int;
			this.emit(FireController.EVENT_ON_TARGETING, {targetEnemyId: lTargetEnemyId_int});
			if (this._fFireSettingsInfo_fsi.autoFire && !this._fTargetingInfo_tc.isPaused)
			{
				this.chooseFireType();
			}
			return;
		}
		this.unpushPointer();
	}

	onPointerRightClick(e)
	{
		if (APP.currentWindow.bigWinsController.isAnyBigWinAnimationInProgress)
		{
			this._tryToSkipBigWin();
		}

		if (!this._fFireSettingsInfo_fsi.lockOnTarget) return;

		let lEnemies_arr = this._gameField.allExistEnemies;
		for( let i = 0; i < lEnemies_arr.length; i++ )
		{
			if(lEnemies_arr[i].onPointerRightClick(e.data.global.x, e.data.global.y))
			{
				this.unpushPointer();
				this.emit(FireController.EVENT_ON_RESET_TARGET);

				this._fTargetingInfo_tc.targetEnemyId = lEnemies_arr[i].id;
				this._onEnemyRightClick(lEnemies_arr[i]);

				if (this._fFireSettingsInfo_fsi.lockOnTarget)
				{
					this._validateAutofireButton(true, lEnemies_arr[i]);
				}
				break;
			}
		}

	}

	onPointerClick(e)
	{
		if (
			this._fAutoTargetingSwitcherInfo_atsi.isOn || 
			(
				this._fTargetingInfo_tc.isActive
				&& this._fFireSettingsInfo_fsi.autoFire
			)
		)
		{
			let lEnemies_arr = this._gameField.allExistEnemies;
			for( let i = 0; i < lEnemies_arr.length; i++ )
			{
				if(lEnemies_arr[i].onPointerClick(e.data.global.x, e.data.global.y))
				{
					this._resetTargetIfRequired(true);

					this._fTargetingInfo_tc.targetEnemyId = lEnemies_arr[i].id;
					this._onEnemyClick(lEnemies_arr[i]);

					if (this._fFireSettingsInfo_fsi.lockOnTarget)
					{
						this._validateAutofireButton(true, lEnemies_arr[i]);
					}
					break;
				}
			}
		}
	}

	_onFireSettingsChanged()
	{
		if (!this._fFireSettingsInfo_fsi.lockOnTarget)
		{
			this._resetTargetIfRequired(true);
			this._validateAutofireButton(false, null, true);
		}
	}

	get _turretKeysMoveTimeout()
	{
		return 10;
	}

	_onKeyboardButtonClicked(event)
	{
		this._chooseKeyboardAction(event.code);
	}

	_chooseKeyboardAction(code)
	{
		switch (code)
		{
			case "Space":
				if (!APP.keyboardControlProxy.isSpaceDown && (!this.spot || !this.spot.isMouseOverRestrictedZone))
				{
					this.chooseFireType();
				}
			break;		
			case "ArrowUp":
			case "KeyW":
				if (!APP.keyboardControlProxy.isUpDown)
				{
					this.cursorKeysMoveTime = 0;
					this._startListeningCursorMoveTick();
				}
			break;
			case "ArrowDown":
			case "KeyS":
				if (!APP.keyboardControlProxy.isDownDown)
				{
					this.cursorKeysMoveTime = 0;
					this._startListeningCursorMoveTick();
				}
			break;
		}
	}

	_startListeningCursorMoveTick()
	{
		if (!this._fTickListening_bln)
		{
			APP.ticker.on("tick", this.tickCursorMove, this);
			this._fTickListening_bln = true;
		}
	}

	_onKeyboardButtonSpaceUp(event)
	{
		switch (event.code)
		{
			case "ArrowUp":
			case "KeyW":
				if (!APP.keyboardControlProxy.isDownDown)
				{
					this._stopListeningCursorMoveTick();
				}	
			break;
			case "ArrowDown":
			case "KeyS":
				if (!APP.keyboardControlProxy.isUpDown)
				{
					this._stopListeningCursorMoveTick();
				}
			break;
		}
	}

	_stopListeningCursorMoveTick()
	{
		if (this._fTickListening_bln)
		{
			APP.ticker.off("tick", this.tickCursorMove, this);
			this._fTickListening_bln = false;
		}
	}

	_onLobbyExternalMessageReceived(event)
	{
		switch (event.type)
		{
			case LOBBY_MESSAGES.KEYBOARD_BUTTON_CLICKED:
				this._chooseKeyboardAction(event.data.code);
			break;
		}
	}

	_tryMoveCursorUp()
	{
		this._tryMoveCursor(1);
	}

	_tryMoveCursorDown()
	{
		this._tryMoveCursor(-1);
	}

	_tryMoveCursor(aDirect_num)
	{
		if (this.seatId === null || this.seatId === undefined) return;
		if (!APP.gameScreen.cursorController.isCursorRendering) return;

		let lSitPositionIds_arr = APP.currentWindow.gameFieldController.sitPositionIds;
		let seatPosition = lSitPositionIds_arr[this.seatId];
		if (seatPosition > 2) aDirect_num *= -1;

		let gunPos = this.getGunPosition(this.seatId);
		let _flastPointerPos_pnt = this._flastPointerPos_pnt;

		let angle = Utils.getAngle(gunPos, _flastPointerPos_pnt);
		let dist = Utils.getDistance(gunPos, _flastPointerPos_pnt);

		let newDist = dist + aDirect_num * CURSOR_MOVE_UNIT;
		if (newDist < 60) newDist = 60;
		let newPosition = {x: gunPos.x + Math.cos(angle - HALF_PI)*newDist, y: gunPos.y - Math.sin(angle - HALF_PI)*newDist};

		let e = {data: {global: newPosition}};
		let isRotated = this.gunRotateController.tryRotateGun(e);

		if (isRotated)
		{
			this.emit(FireController.EVENT_ON_STOP_UPDATE_CURSOR_POSITION);
			this.emit(FireController.EVENT_ON_SET_SPECIFIC_CURSOR_POSITION, {pos: newPosition});
		}
	}

	tickCursorMove(e)
	{
		let isUpDown = APP.keyboardControlProxy.isUpDown;
		let isDownDown = APP.keyboardControlProxy.isDownDown;
		if (isUpDown || isDownDown)
		{
			let timeout = this._turretKeysMoveTimeout;
			this.cursorKeysMoveTime += e.delta;

			if (this.cursorKeysMoveTime >= timeout)
			{
				this.cursorKeysMoveTime = 0;

				if (isUpDown)
				{
					this._tryMoveCursorUp();
				}
				if (isDownDown)
				{
					this._tryMoveCursorDown();
				}
			}
		}
	}
	//...INTERACTION

	//AUTOFIRE...
	get isAutoFireEnabled()
	{
		return (this._fTargetingInfo_tc.isActive || this._fTargetingInfo_tc.isActiveTargetPaused) && APP.currentWindow.fireSettingsController.info.autoFire;
	}

	get _autoFireTimeout()
	{
		let timeoutObj;
		switch (this._fFireSettingsInfo_fsi.fireSpeed)
		{
			case 1:
				timeoutObj = AUTO_FIRE_TIMEOUTS.MAX;
				break;
			case 2:
				timeoutObj = AUTO_FIRE_TIMEOUTS.MIDDLE;
				break;
			case 3:
			default:
				timeoutObj = AUTO_FIRE_TIMEOUTS.MIN;
				break;
		}

		let timeout = timeoutObj.OTHER;

		return timeout;
	}

	tickAutoFire(delta)
	{
		if (
				(this.pointerPushed || this._fTargetingInfo_tc.isActive || APP.keyboardControlProxy.isSpaceDown) &&
				this._fFireSettingsInfo_fsi.autoFire &&
				(!this.spot || !this.spot.isMouseOverRestrictedZone || this.isAutoFireEnabled)
			)
		{
			let timeout = this._autoFireTimeout;
			this.autofireTime += delta;

			if (this.autofireTime >= timeout)
			{
				this.autofireTime = 0;
				this.chooseFireType();
			}
		}
	}

	_resetTargetIfRequired(aAnyway_bl = false)
	{
		if (aAnyway_bl)
		{
			this.unpushPointer();
			this.emit(FireController.EVENT_ON_RESET_TARGET);
		}
	}
	//...AUTOFIRE

	tick(delta, realDelta)
	{
		this.tickAutoFire(delta); 
		this.tickBullets(delta, realDelta);
	}	

	destroy()
	{
		this.i_clearRoom();
		this._fTickListening_bln = null;

		super.destroy();
	}	
}
export default FireController
