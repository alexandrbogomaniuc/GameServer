import { APP } from '../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sprite from '../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import IceBossAppearanceView from '../view/uis/custom/bossmode/appearance/IceBossAppearanceView';
import Game from '../Game';
import { WEAPONS, ENEMY_TYPES} from '../../../shared/src/CommonConstants';
import AwardingController from '../controller/uis/awarding/AwardingController';
import GameStateController from '../controller/state/GameStateController';
import LevelUpController from '../controller/uis/custom/level_up/LevelUpController';
import MapsController from '../controller/uis/maps/MapsController';
import BossModeController from '../controller/uis/custom/bossmode/BossModeController';
import BossModeView from '../view/uis/custom/bossmode/BossModeView';
import BossModeInfo from '../model/custom/bossmode/BossModeInfo';
import SubloadingController from '../controller/subloading/SubloadingController';
import GameWebSocketInteractionController from '../controller/interaction/server/GameWebSocketInteractionController';
import { CLIENT_MESSAGES, SERVER_MESSAGES } from '../model/interaction/server/GameWebSocketInteractionInfo';
import I18 from '../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
import PlayerInfo from '../../../../common/PIXI/src/dgphoenix/unified/model/custom/PlayerInfo';
import EnemiesController from '../controller/uis/enemies/EnemiesController';
import PlayerSpotsController from '../controller/uis/spots/PlayerSpotsController';
import GameExternalCommunicator, { LOBBY_MESSAGES, GAME_MESSAGES } from '../controller/../controller/external/GameExternalCommunicator';
import {ROUND_STATE} from '../model/state/GameStateInfo';
import WeaponsController from '../controller/uis/weapons/WeaponsController';
import FireSettingsController from '../controller/uis/fire_settings/FireSettingsController';
import InfoPanelController from '../controller/uis/info_panel/InfoPanelController';
import InfoPanelView from '../view/uis/info_panel/InfoPanelView';
import TargetingController from '../controller/uis/targeting/TargetingController';
import RoundResultScreenController from '../controller/uis/roundresult/RoundResultScreenController';
import Timer from "../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer";
import AutoTargetingSwitcherController from '../controller/uis/targeting/AutoTargetingSwitcherController';
import GamePlayerController from '../controller/custom/GamePlayerController';
import GameOptimizationController from '../controller/custom/GameOptimizationController';
import ShotResponsesController from '../controller/custom/ShotResponsesController';
import GameBuyAmmoRetryingController from '../controller/custom/GameBuyAmmoRetryingController';
import CursorController from '../controller/interaction/cursor/CursorController';
import PrizesController from '../controller/uis/prizes/PrizesController';
import GameBonusController from '../controller/uis/custom/bonus/GameBonusController';
import GameFRBController from './../controller/uis/custom/frb/GameFRBController';
import BigWinsController from '../controller/uis/awarding/big_win/BigWinsController';
import CursorAnimation from './animation/CursorAnimation';
import TransitionViewController from '../controller/uis/transition/TransitionViewController';
import BattlegroundGameController from '../controller/uis/battleground/BattlegroundGameController';
import BattlegroundCountDownDialogController from '../controller/uis/custom/gameplaydialogs/custom/BattlegroundCountDownDialogController';
import GameplayDialogsController from './../controller/uis/custom/gameplaydialogs/GameplayDialogsController';
import CalloutsController from '../controller/uis/custom/callouts/CalloutsController';
import BossModeHPBarController from '../controller/uis/custom/bossmode/BossModeHPBarController';
import ScoreboardController from '../controller/uis/scoreboard/ScoreboardController';
import LaserCapsuleFeatureController from '../controller/uis/capsule_features/LaserCapsuleFeatureController';
import BulletCapsuleFeatureController from '../controller/uis/capsule_features/BulletCapsuleFeatureController';
import KillerCapsuleFeatureController from '../controller/uis/capsule_features/KillerCapsuleFeatureController';
import LightningCapsuleFeatureController from '../controller/uis/capsule_features/LightningCapsuleFeatureController';
import BalanceController from '../controller/balance/BalanceController';
import FireController from '../controller/uis/fire/FireController';
import FreezeCapsuleFeatureController from '../controller/uis/capsule_features/FreezeCapsuleFeatureController';
import GameFieldController from '../controller/uis/game_field/GameFieldController'
import GameFieldView from '../view/uis/game_field/GameFieldView';
import BTGTransitionViewController from '../controller/uis/transition/BTGTransitionViewController';
import GamePendingOperationController from '../controller/gameplay/GamePendingOperationController';
import BattlegroundTutorialController from '../controller/uis/custom/tutorial/BattlegroundTutorialController';
import { SEATS_POSITION_IDS } from '../model/uis/game_field/GameFieldInfo';
import GamePleaseWaitDialogController from '../controller/uis/custom/GamePleaseWaitDialogController';
import CafPrivateRoundCountDownDialogController from '../controller/uis/custom/gameplaydialogs/custom/CafPrivateRoundCountDownDialogController';
import
{
	DIALOG_ID_INSUFFICIENT_FUNDS,
	DIALOG_ID_FRB,
	DIALOG_ID_BONUS,
} from '../../../shared/src/CommonConstants';

//Last server date response
var serverTime = Date.now();
var accurateServerTime = Date.now();
var smoothServerTime = Date.now();
var serverTimeInitiated = false;
var smoothClientTimeDiff = 0;
var clientTimeDiff = 0;
var accurateClientTimeDiff = 0;
var serverLastMessageRecieveTime = undefined;
var accurateServerLastMessageRecieveTime = undefined;

var lastTickOccurTime = undefined;

const MAX_TICK_DELAY = 3000;
const DOUBLE_PI = Math.PI * 2;

const MIN_VALUE_TO_SMOOTH_RECOVERY = 0;
const MAX_VALUE_TO_SMOOTH_RECOVERY = 1000;
const RECOVERY_HOPS_AMOUNT = 100;

class GameScreen extends Sprite
{
	static get EVENT_BATTLEGROUND_REQUEST_TIME_TO_START()					{return "EVENT_BATTLEGROUND_REQUEST_TIME_TO_START";}
	static get EVENT_BATTLEGROUND_CONFIRM_BUY_IN_REQUIRED()					{return "EVENT_BATTLEGROUND_CONFIRM_BUY_IN_REQUIRED";}
	static get EVENT_ON_READY()												{return "onGameScreenReady";}
	static get EVENT_ON_FORCE_SIT_OUT_REQUIRED()							{return "onForceSitOutRequired";}
	static get EVENT_ON_CLOSE_ROOM()										{return "onCloseRoom";}
	static get EVENT_ON_NEW_ROUND_STATE()									{return "onNewRoundState";}
	static get EVENT_ON_WAITING_NEW_ROUND()									{return "onWaitingNewRound";}
	static get EVENT_ON_ROOM_INFO_UPDATED()									{return "onRoomInfoUpdated";}
	static get EVENT_ON_NEXT_MAP_UPDATED()									{return "onNextMapUpdated";}
	static get EVENT_ON_CHOOSE_WEAPON_SCREEN_CHANGED()						{return "onWeaponsChooseScreenActivated";}
	static get EVENT_MID_ROUND_EXIT_REQUIRED()								{return "onMidRoundExitRequired";}
	static get EVENT_ON_BET_LEVEL_CHANGE_CONFIRMED()						{return "onBetLevelChangeConfirmed";}
	static get EVENT_ON_BET_LEVEL_CHANGE_NOT_CONFIRMED()					{return "onBetLevelChangeNotConfirmed";}
	static get EVENT_ON_FRB_ENDED_COMPLETED() 								{return "onFRBEndedCompleted";}
	static get EVENT_ON_BULLET()											{return "onBullet";}
	static get EVENT_ON_BULLET_RESPONSE()									{return "onBulletResponse";}
	static get EVENT_ON_BULLET_CLEAR_RESPONSE()								{return "onBulletClearResponse";}
	static get EVENT_ON_CO_PLAYER_COLLISION_OCCURED()						{return "onCoPlayerCollisionOccured";}
	static get EVENT_ON_LASTHAND_BULLETS()									{return "onLasthandBullets";}

	static get EVENT_ON_GAME_SOCKET_URL_UPDATED()							{return 'EVENT_ON_GAME_SOCKET_URL_UPDATED';}
	static get EVENT_ON_ROOM_ID_CHANGED()									{return 'EVENT_ON_ROOM_ID_CHANGED';}
	static get EVENT_ON_GAME_RESTORED_AFTER_UNSEASONABLE_REQUEST()			{return 'EVENT_ON_GAME_RESTORED_AFTER_UNSEASONABLE_REQUEST';}
	static get EVENT_ON_GAME_RESTORE_AFTER_UNSEASONABLE_REQUEST_CANCELED()	{return 'EVENT_ON_GAME_RESTORE_AFTER_UNSEASONABLE_REQUEST_CANCELED';}
	static get EVENT_ON_URL_BASED_PLAYER_STAKE_CHANGED()					{return 'EVENT_ON_URL_BASED_PLAYER_STAKE_CHANGED';}
	static get EVENT_ON_FULL_GAME_INFO_REQUIRED()							{return 'EVENT_ON_FULL_GAME_INFO_REQUIRED';}
	static get EVENT_ON_CLOSE_ROOM_REQUIRED()								{return 'EVENT_ON_CLOSE_ROOM_REQUIRED';}
	static get EVENT_ON_SIT_IN_REQUIRED()									{return 'EVENT_ON_SIT_IN_REQUIRED';}
	static get EVENT_ON_SIT_OUT_REQUIRED()									{return 'EVENT_ON_SIT_OUT_REQUIRED';}
	static get EVENT_ON_SHOT_TRIGGERED()									{return 'EVENT_ON_SHOT_TRIGGERED';}
	static get EVENT_ON_BUY_IN_REQUIRED()									{return 'EVENT_ON_BUY_IN_REQUIRED';}
	static get EVENT_ON_RE_BUY_REQUIRED()									{return 'EVENT_ON_RE_BUY_REQUIRED';}
	static get EVENT_ON_CHANGE_STAKE_REQUIRED()								{return 'EVENT_ON_CHANGE_STAKE_REQUIRED';}
	static get EVENT_ON_GAME_FIELD_CLEARED()								{return 'EVENT_ON_GAME_FIELD_CLEARED';}
	static get EVENT_ON_NEW_HV_ENEMY()										{return 'EVENT_ON_NEW_HV_ENEMY';}
	static get EVENT_ON_HV_ENEMY_PARENT_HIT()								{return 'EVENT_ON_HV_ENEMY_PARENT_HIT';}
	static get EVENT_ON_REVERT_AMMO_BACK()									{return 'EVENT_ON_REVERT_AMMO_BACK';}
	static get EVENT_ON_KILLED_MISS_ENEMY()									{return "EVENT_ON_KILLED_MISS_ENEMY";}
	static get EVENT_ON_INVULNERABLE_ENEMY()								{return "EVENT_ON_INVULNERABLE_ENEMY";}
	static get EVENT_ON_ROOM_PAUSED()										{return 'EVENT_ON_ROOM_PAUSED';}
	static get EVENT_ON_ROOM_UNPAUSED()										{return 'EVENT_ON_ROOM_UNPAUSED';}
	static get EVENT_ON_ROOM_RESTORING_ON_LAGS_STARTED()					{return 'EVENT_ON_ROOM_RESTORING_ON_LAGS_STARTED';}
	static get EVENT_ON_DIALOG_ACTIVATED()									{return 'EVENT_ON_DIALOG_ACTIVATED';}
	static get EVENT_ON_DIALOG_DEACTIVATED()								{return 'EVENT_ON_DIALOG_DEACTIVATED';}
	static get EVENT_ON_PLAYER_REMOVED()									{return 'EVENT_ON_PLAYER_REMOVED';}
	static get EVENT_ON_PLAYER_ADDED()										{return 'EVENT_ON_PLAYER_ADDED';}
	static get EVENT_ON_ROUND_ID_UPDATED()									{return 'EVENT_ON_ROUND_ID_UPDATED';}
	static get EVENT_ON_LOBBY_BACKGROUND_FADE_START()						{return 'EVENT_ON_LOBBY_BACKGROUND_FADE_START';}
	static get EVENT_ON_BOMB_ENEMY_KILLED()									{return 'EVENT_ON_BOMB_ENEMY_KILLED';}
	static get EVENT_ON_PLAYER_DATA_UPDATED()								{return 'EVENT_ON_PLAYER_DATA_UPDATED';}
	static get EVENT_ON_TICK_OCCURRED()										{return 'EVENT_ON_TICK_OCCURRED';}
	static get EVENT_ON_SHOT_RESPONSE_PARSED()								{return 'EVENT_ON_SHOT_RESPONSE_PARSED';}
	static get EVENT_ON_HIT_RESPONCE()										{return 'EVENT_ON_HIT_RESPONCE';}

	static get EVENT_ON_BACK_TO_LOBBY_BUTTON_CLICKED()						{return GameFieldController.EVENT_ON_BACK_TO_LOBBY_BUTTON_CLICKED;}
	static get EVENT_ON_ROUND_RESULT_SCREEN_DEACTIVATED()					{return GameFieldController.EVENT_ON_ROUND_RESULT_SCREEN_DEACTIVATED;}
	static get EVENT_ON_ROUND_RESULT_SCREEN_ACTIVATED()						{return GameFieldController.EVENT_ON_ROUND_RESULT_SCREEN_ACTIVATED;}
	static get EVENT_ON_BACK_TO_LOBBY_ROUND_RESULT_BUTTON_CLICKED()			{return GameFieldController.EVENT_ON_BACK_TO_LOBBY_ROUND_RESULT_BUTTON_CLICKED;}
	static get EVENT_ON_GAME_ROUND_STATE_CHANGED()							{return GameStateController.EVENT_ON_GAME_ROUND_STATE_CHANGED;}
	static get EVENT_ON_DRAW_MAP()											{return GameFieldController.EVENT_ON_DRAW_MAP;}
	static get EVENT_ON_WEAPON_UPDATED()									{return GameFieldController.EVENT_ON_WEAPON_UPDATED;}
	static get EVENT_REFRESH_COMMON_PANEL_REQUIRED()						{return GameFieldController.EVENT_REFRESH_COMMON_PANEL_REQUIRED;}
	static get EVENT_ON_NEW_BOSS_CREATED()									{return GameFieldController.EVENT_ON_NEW_BOSS_CREATED;}
	static get EVENT_ON_BOSS_DESTROYING()									{return GameFieldController.EVENT_ON_BOSS_DESTROYING;}
	static get EVENT_ON_BOSS_DESTROYED()									{return GameFieldController.EVENT_ON_BOSS_DESTROYED;}
	static get EVENT_ON_BOSS_DEATH_CRACK()									{return GameFieldController.EVENT_ON_BOSS_DEATH_CRACK;}
	static get EVENT_ON_TIME_TO_EXPLODE_COINS()								{return GameFieldController.EVENT_ON_TIME_TO_EXPLODE_COINS;}
	static get EVENT_DECREASE_AMMO()										{return GameFieldController.EVENT_DECREASE_AMMO;}
	static get EVENT_ON_RESET_TARGET()										{return FireController.EVENT_ON_RESET_TARGET;}
	static get EVENT_ON_TARGETING()											{return FireController.EVENT_ON_TARGETING;}	
	static get EVENT_ON_BULLET_CLEAR()										{return FireController.EVENT_ON_BULLET_CLEAR;}
	static get DEFAULT_GUN_SHOW_FIRE()										{return FireController.DEFAULT_GUN_SHOW_FIRE;}
	static get EVENT_NOT_ENOUGH_MONEY_DIALOG_REQUIRED()						{return FireController.EVENT_NOT_ENOUGH_MONEY_DIALOG_REQUIRED;}
	static get EVENT_ON_TARGET_ENEMY_IS_DEAD()								{return FireController.EVENT_ON_TARGET_ENEMY_IS_DEAD;}
	static get EVENT_ON_TARGET_B3_FORMATION_INVULNERABLE()					{return FireController.EVENT_ON_TARGET_B3_FORMATION_INVULNERABLE;}
	static get EVENT_ON_TARGET_B3_FORMATION_VULNERABLE()					{return FireController.EVENT_ON_TARGET_B3_FORMATION_VULNERABLE;}
	static get EVENT_ON_BULLET_PLACE_NOT_ALLOWED()							{return "onBulletPlaceNotAllowed";}
	static get EVENT_ON_BULLET_FLY_TIME() 									{return "onBulletFlyTime"}

	static get EVENT_ON_GAME_FIELD_SCREEN_CREATED()							{return GameFieldController.EVENT_ON_GAME_FIELD_SCREEN_CREATED;}
	static get EVENT_ON_ROOM_FIELD_CLEARED()								{return GameFieldController.EVENT_ON_ROOM_FIELD_CLEARED;}	
	static get EVENT_ON_HIT_AWARD_EXPECTED()								{return GameFieldController.EVENT_ON_HIT_AWARD_EXPECTED;}
	static get EVENT_ON_SHOT_SHOW_FIRE_START_TIME()							{return GameFieldController.EVENT_ON_SHOT_SHOW_FIRE_START_TIME;}
	static get EVENT_ON_BULLET_TARGET_TIME()								{return GameFieldController.EVENT_ON_BULLET_TARGET_TIME;}
	static get EVENT_ON_BET_MULTIPLIER_UPDATED()							{return "EVENT_ON_BET_MULTIPLIER_UPDATED";}
	static get EVENT_ON_TIME_TO_RESTART_BONUS_ROOM() 						{return "EVENT_ON_TIME_TO_RESTART_BONUS_ROOM";}
	static get EVENT_ON_TIME_TO_OPEN_REAL_ROOM_AFTER_BONUS() 				{return GameBonusController.EVENT_ON_TIME_TO_OPEN_REAL_ROOM_AFTER_BONUS;}
	static get EVENT_ON_GREEN_CLOUD_APPEARED()								{return GameFieldController.EVENT_ON_GREEN_CLOUD_APPEARED;}
	static get EVENT_ON_EMPTY_ARMOR_GLOWED()								{return GameFieldController.EVENT_ON_EMPTY_ARMOR_GLOWED;}
	static get EVENT_ON_SOME_ENEMY_SPAWN_SOUND_REQUIRED()					{return GameFieldController.EVENT_ON_SOME_ENEMY_SPAWN_SOUND_REQUIRED;}

	static get EVENT_ON_WEAPON_PAID_MULTIPLIER_UPDATE_REQUIRED()			{return "EVENT_ON_WEAPON_PAID_MULTIPLIER_UPDATE_REQUIRED"; }
	static get EVENT_BATTLEGROUND_TIME_TO_START_UPDATED()					{return "EVENT_BATTLEGROUND_TIME_TO_START_UPDATED"; }	
	static get EVENT_ON_SERVER_MESSAGE_GAME_STATE_CHANGED()					{return "EVENT_ON_SERVER_MESSAGE_GAME_STATE_CHANGED"; }	
	static get EVENT_ON_SIT_IN_COUNT_DOWN_REQUIRED() 						{return "EVENT_ON_SIT_IN_COUNT_DOWN_REQUIRED"; }
	static get EVENT_ON_BATTLEGROUND_ROUND_CANCELED() 						{return "EVENT_ON_BATTLEGROUND_ROUND_CANCELED"; }

	static get EVENT_ON_UPDATE_PLAYER_WIN_CAPTION()							{return GameFieldController.EVENT_ON_UPDATE_PLAYER_WIN_CAPTION;}

	static get EVENT_ON_DEATH_COIN_AWARD()									{return GameFieldController.EVENT_ON_DEATH_COIN_AWARD;}

	static get EVENT_ON_CARD_DISAPPEARED() 									{return KillerCapsuleFeatureController.EVENT_ON_CARD_DISAPPEARED;}

	static get EVENT_ON_ENEMY_DEATH_SFX()									{return GameFieldController.EVENT_ON_ENEMY_DEATH_SFX;}
	static get CHANGE_FIELD_FREEZE_STATE()									{ return FreezeCapsuleFeatureController.CHANGE_FIELD_FREEZE_STATE; }
	static get EVENT_ON_FREEZE_AFFECTED_ENEMIES()							{ return FreezeCapsuleFeatureController.EVENT_ON_FREEZE_AFFECTED_ENEMIES; }
	static get EVENT_ON_UNFREEZE_AFFECTED_ENEMIES()							{ return FreezeCapsuleFeatureController.EVENT_ON_UNFREEZE_AFFECTED_ENEMIES; }

	static get EVENT_ON_BOSS_BECOME_VISIBLE()									{return GameFieldController.EVENT_ON_BOSS_BECOME_VISIBLE;}
	static get EVENT_ON_BOSS_APPEARED()											{return GameFieldController.EVENT_ON_BOSS_APPEARED;}
	static get EVENT_ON_ICE_BOSS_FREEZE_LAND_NEEDED()							{ return IceBossAppearanceView.EVENT_ON_ICE_BOSS_FREEZE_LAND_NEEDED; }
	static get EVENT_ON_ICE_BOSS_FREEZE_LAND_MELTING()							{ return IceBossAppearanceView.EVENT_ON_ICE_BOSS_FREEZE_LAND_MELTING; }
	
	static get EVENT_ON_AUTOFIRE_BUTTON_ENABLED() 							{return PlayerSpotsController.EVENT_ON_AUTOFIRE_BUTTON_ENABLED;}
	static get EVENT_ON_AUTOFIRE_BUTTON_DISABLED() 							{return PlayerSpotsController.EVENT_ON_AUTOFIRE_BUTTON_DISABLED;}
	static get EVENT_ON_NO_EMPTY_SEATS()									{ return "EVENT_ON_NO_EMPTY_SEATS"; }
	static get EVENT_ON_BTG_ROUND_OBSERVER_DENIED()							{ return "EVENT_ON_BTG_ROUND_OBSERVER_DENIED"; }

	static get EVENT_ON_TIME_TO_HANDLE_AWARDED_WEAPON() 					{return LevelUpController.EVENT_ON_TIME_TO_HANDLE_AWARDED_WEAPON;}
	static get EVENT_ON_WEAPON_AWARDED()									{return LevelUpController.EVENT_ON_WEAPON_AWARDED;}

	static get EVENT_TIME_TO_SHOW_BATTLEGROUND_TUTORIAL()					{ return "EVENT_TIME_TO_SHOW_BATTLEGROUND_TUTORIAL"; }

	constructor()
	{
		super();

		this.getRoomParams = null;

		this.room = null;
		this.player = {
			currency: "UAH",
			nickname: "Alex",
			stake: 1
		};

		this.massDamageAffectedEnemies = [];

		this._fGameStateController_gsc = null;
		this._fBossModeController_bmc = null;
		this._fMapsController_msc = null;
		this._fSubloadingController_sc = null;
		this._fEnemiesController_ec = null;
		this._fBalanceController_bc = null;
		this._fPlayersSpotsController_ec = null;
		this._fWeaponsController_fwsc = null;
		this._fFireSettingsController_fsc = null;
		this._fInfoPanelController_ipc = null;
		this._fInfoPanelView_ipv = null;
		this._fTargetingController_tc = null;
		this._fAutoTargetingSwitcherController_atsc = null;
		this._fGameOptimizationController_goc = null;
		this._fCursorController_cc = null;
		this._fPrizesController_psc = null;
		this._fShotResponsesController_srsc = null;
		this._fBuyAmmoRetryingController_barc = null;
		this._fCompensationDialogActive_bln = false;
		this._fGameBonusController_gbc = null;
		this._fBigWinsController_bwsc = null;
		this._fTransitionViewController_tvc = null;
		this._fCalloutsController_cc = null;
		this._fBossHealthBarController_bmhpbc = null;
		this._fFireController_fc = null;

		this._fStartGameURL_str = null;
		this._fIsPaused_bl = false;
		this._fResumeInProcess_bl = true;
		this._fGameFieldCapture_sprt = null;
		this._fBackToLobbyRequired_bl = false;
		
		this._restoreAfterUnseasonableRequest = false;
		this._restoreAfterLagsInProgress = false;

		this._roomUnpauseTimer = null;
		this._screenShowTimer = null;

		this._ready = false;

		this._fForseSitOutInProgress = false;

		this._fRoundFinishSoon_bl = false;

		this._fBonusEndedPostponedData_obj = null;
		this._fFrbEndedPostponedData_obj = null;
		this._fBonusRoundEndedPostponedData_obj = null;
		this._fPostponedSitOutData_obj = null;

		this._fTournamentModeInfo = null;

		this._fIsExpectedBuyInOnRoomStarted_bl = null;
		this._fIsSitOutOnNotEnoughPlayersExpected_bl = null;
		this._fIsCountDownCanceled = null;

		this._fBattlegroundGameController_bgc = null;

		this._fIsFullGameInfoUpdateExpected_bl = null;

		this._fLaserCapsuleFeatureController_lcfc = null;
		this._fKillerCapsuleFeatureController_kcfc = null;

		this._fScoreboardController_sc = null;
		this._fScoreboardView_sv = null;

		this._fClientServerTimeCorrectionValue_num = 0;
		this._fClientServerTimeCorrectionHops_num = 0;
	}

	init(aOptRoomUrl_str=undefined)
	{
		//init controllers...
		this.mapsController.i_init();
		this.subloadingController.i_init();
		this.weaponsController.i_init();
		this.fireSettingsController.i_init();
		this.infoPanelController.i_init();
		this.targetingController.i_init();
		this.fireController.i_init();
		if (APP.isMobile)
		{
			this.autoTargetingSwitcherController.i_init();
		}
		this.bossModeController.i_init();
		this.gameOptimizationController.i_init();
		//...init controllers

		this._initShotResponsesController();

		this.gameFieldController;

		this.infoPanelController.initView(this.infoPanelView);

		this.start(aOptRoomUrl_str);

		this._initEnemiesController();
		this._initPrizesController();
		this.bigWinsController.i_init();
		this._initAwardingController();
		this._initGameStateController();
		this._initCursorController();
		this._initGameBonusController();
		this._initGameFrbController();
		this._initLevelUpController();
		this._initTransitionViewController();
		this._initBattlegroundGameController();

		this._startHandleLobbyExternalMessages();
		this._startHandleShotResponseMessages();
		this._startHandleWebSocketMessages();

		this._initBuyAmmoRetryingController();

		this._initGamePleaseWaitDialogController();

		this._initCalloutsController();

		this._initBossHealthBarController();

		this._initLaserCapsuleFeatureController();
		this._initKillerCapsuleFeatureController();
		this._initFreezeCapsuleFeatureController();

		this.fireSettingsController.initViewContainer(this.gameFieldController.fireSettingsContainerInfo);
		this.fireSettingsController.on(FireSettingsController.EVENT_SCREEN_ACTIVATED, this._onFireSettingsActivated, this);
		this.fireSettingsController.on(FireSettingsController.EVENT_SCREEN_DEACTIVATED, this._onFireSettingsDeactivated, this);

		APP.on(Game.EVENT_ON_ASSETS_LOADING_ERROR, this._onAssetsLoadingError, this);
		APP.on(Game.EVENT_ON_WEBGL_CONTEXT_LOST, this._onWebglContextLost, this);

		if (APP.isBattlegroundGame)
		{
			APP.on(Game.EVENT_ON_PLAYER_INFO_UPDATED, this._onLobbyPlayerInfoUpdated, this)
			APP.playerController.on(GamePlayerController.EVENT_ON_PLAYER_INFO_UPDATED, this._onGamePlayerInfoUpdated, this);
		}

		this._ready = true;
		this.emit(GameScreen.EVENT_ON_READY);

		this.on(GameScreen.EVENT_ON_ROOM_INFO_UPDATED, this._onRoomInfoUpdated, this);

		this._fGameBonusController_gbc.on(GameBonusController.EVENT_ON_BONUS_STATE_CHANGED, this._onBonusStateChanged, this);
		this._fGameBonusController_gbc.on(GameBonusController.EVENT_ON_TIME_TO_OPEN_REAL_ROOM_AFTER_BONUS, this._onTimeToOpenRealRoomAfterBonus, this);
		this._fGameFrbController_gfrbc.on(GameFRBController.EVENT_ON_FRB_STATUS_CHANGED, this.onFRBEnded, this);
		this._fGameFrbController_gfrbc.on(GameFRBController.EVENT_ON_TIME_TO_OPEN_REAL_ROOM_AFTER_BONUS, this._onTimeToOpenRealRoomAfterBonus, this);

		APP.gameScreen.balanceController.on(BalanceController.EVENT_ON_BUY_AMMO_REQUIRED, this._onBuyAmmoRequired, this);
		APP.gameScreen.balanceController.on(BalanceController.EVENT_ON_SERVER_BALANCE_UPDATED, this._onServerBalanceUpdated, this);

		APP.pendingOperationController.on(GamePendingOperationController.EVENT_ON_PENDING_OPERATION_STARTTED, this._onPendingOperationStarted, this);
		APP.pendingOperationController.on(GamePendingOperationController.EVENT_ON_PENDING_OPERATION_COMPLETED, this._onPendingOperationCompleted, this);
		APP.gameScreen.gameplayDialogsController.gameCafPrivateRoundCountDownDialogController.on(CafPrivateRoundCountDownDialogController.EVENT_ON_SCREEN_ACTIVATED, this._observerModeActivated, this);
    }

    _observerModeActivated(event)
    {
        console.log("observer problem: observer mode activated");
        APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.OBSERVER_MODE_ACTIVATED);
    }

	get _tournamentModeInfo()
	{
		return this._fTournamentModeInfo || (this._fTournamentModeInfo = APP.tournamentModeController.info);
	}

	hideBlur()
	{
		this._hideBlur();
	}

	showBlur()
	{
		this._showBlur();
	}

	get compensationDialogActive()
	{
		return this._fCompensationDialogActive_bln;
	}

	get isReady()
	{
		return this._ready;
	}

	get isPaused()
	{
		return this._fIsPaused_bl;
	}

	get currentTime()
	{
		return serverTime + clientTimeDiff;
	}

	get accurateCurrentTime()
	{
		return accurateServerTime + accurateClientTimeDiff;
	}

	get smoothCuurentTime()
	{
		return smoothClientTimeDiff + smoothServerTime;
	}

	get isExpectedBuyInOnRoomStarted()
	{
		if(APP.isBattlegroundGame)
		{
			return false;
		}

		if(this._isBonusMode)
		{
			return false;
		}

		if(this._isFrbMode)
		{
			return false;
		}

		if(this._isTournamentMode)
		{
			return false;
		}

		return this._fIsExpectedBuyInOnRoomStarted_bl;
	}

	clearAllButLobbyInfo()
	{
		var currency = this.player.currency,
			nickname = this.player.nickname;

		this.player = {
			currency: currency,
			nickname: nickname,
			stake: 1
		};
		this.room = null;

		APP.off(Game.EVENT_ON_GAME_SECONDARY_SCREEN_ACTIVATED, this.onSecondaryScreenActivated, this);
		APP.off(Game.EVENT_ON_GAME_SECONDARY_SCREEN_DEACTIVATED, this.onSecondaryScreenDeactivated, this);

		this._restoreAfterLagsInProgress = false;
	}

	clear()
	{
		this.enemiesController.clear();
		this.levelUpController.awardPostponedWeapons();

		APP.webSocketInteractionController.clearShotResponseParsed();
	}

	_onBulletFlyTime()
	{
		this.emit(GameScreen.EVENT_ON_BULLET_FLY_TIME);
	}

	_onBossCreated(e)
	{
		this.emit(e);
	}

	_onRoomFieldCleared(event)
	{
		this.emit(event);
	}

	_onNewRoundState(event, data)
	{
		this.emit(event, data);
		
		if(event.state === true)
		{
			APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.GAME_IN_PROGRESS);
		}
	}

	_onInteractionChanged(event)
	{
		let lAllowed_bl = event.allowed;

		APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.WEAPONS_INTERACTION_CHANGED, {allowed: lAllowed_bl});
	}

	_onPlayerBetMultiplierUpdated(aEvent_obj)
	{
		this.emit(GameScreen.EVENT_ON_BET_MULTIPLIER_UPDATED, {id: aEvent_obj.id, multiplier: aEvent_obj.multiplier});

		if (aEvent_obj.weaponUpdateAllowed)
		{
			this.gameFieldController.tryToChangeWeaponOnPlayerBetMultiplierUpdated();
		}
	}

	_onMasterSeatAdded()
	{
		this.gameFieldController.onMasterSeatAdded();
	}

	get _isFrbMode()
	{
		return APP.currentWindow.gameFrbController.info.frbMode;
	}

	get _isBonusMode()
	{
		return this.gameBonusController.info.isActivated;
	}

	get _isTournamentMode()
	{
		let lTournamentModeController_tmc = APP.tournamentModeController;

		if (
			lTournamentModeController_tmc &&
			lTournamentModeController_tmc.info &&
			lTournamentModeController_tmc.info.isTournamentMode
		)
		{
			return true;
		}

		return false;
	}

	isGamePlayInProgress()
	{
		return this.gameFieldController.isGamePlayInProgress();
	}

	onBackToLobbyButtonClicked(aIsRequestedFromBattlegroundDialog_bl)
	{
		if(aIsRequestedFromBattlegroundDialog_bl)
		{
			this.sitOut();
			this.goBackToLobby();
			return;
		}

		if (
				(
					this.gameStateController.info.gameState === ROUND_STATE.PLAY ||
					this.gameStateController.info.isGameInProgress
				) &&
				this.gameStateController.info.isPlayerSitIn &&
				(
					!this._isFrbMode
				)
			)
		{
			if (!APP.webSocketInteractionController.isSitoutRequestInProgress)
			{
				this.emit(GameScreen.EVENT_MID_ROUND_EXIT_REQUIRED, {roomId: this.room.id});
			}
		}
		else if (this._isFrbMode)
		{
			this.sitOut();
		}
		else if (this.gameStateController.info.isPlayerSitIn)
		{
			this.sitOut();
		}
		else
		{
			this.goBackToLobby();
		}
	}

	_isEmptyAmmoSpecialWeapons(aWeapons)
	{
		if (aWeapons)
		{
			for (let i = 0; i < aWeapons.length; i++)
			{
				if (aWeapons[i].shots != 0) return false;
			}
			return true;
		}
		else
		{
			return undefined;
		}
	}

	goBackToLobby(aOptErrorCode_num = null)
	{
		if (APP.isBattlegroundGame)
		{
			return;
		}

		this._fRoundFinishSoon_bl = false;
		this._fCompensationDialogActive_bln = false;
		this._fBackToLobbyRequired_bl = true;
		this._restoreAfterLagsInProgress = false;

		this.gameFieldController.roundResultScreenController.hideScreen();
		this.gameFieldController.roundResultScreenController.resetScreenAppearing();

		if (this.gameStateController.info.isPlayerSitIn)
		{
			this.sitOut();
		}
		else if (!this.player.sitInIsSent )
		{
			if (this.room && this.room.maxSeats !== undefined && this.room.maxSeats > 0)
			{
				this.closeRoom();
			}
			else
			{
				this.clearAllButLobbyInfo();
				this._emitBackToLobbyEvent(aOptErrorCode_num);
			}
		}
	}

	get isBackToLobbyRequired()
	{
		return this._fBackToLobbyRequired_bl;
	}

	_emitBackToLobbyEvent(aOptErrorCode_num)
	{
		this._fBackToLobbyRequired_bl = false;
		this.gameFieldController && this.gameFieldController.onBackToLobbyOccur();
		this.emit(GameScreen.EVENT_ON_BACK_TO_LOBBY_BUTTON_CLICKED, {errorCodeReason: aOptErrorCode_num});
	}

	sendCloseRoom()
	{
		this.emit(GameScreen.EVENT_ON_CLOSE_ROOM_REQUIRED, {roomId: this._roomId});
	}

	start(aStartGameUrl_str = undefined)
	{
		let GET = this._applyUrlParams(aStartGameUrl_str);

		if (aStartGameUrl_str !== undefined)
		{
			let socketUrl = decodeURIComponent(GET.WEB_SOCKET_URL);
			this.emit(GameScreen.EVENT_ON_GAME_SOCKET_URL_UPDATED, {socketUrl: socketUrl});
		}
	}

	_applyUrlParams(aStartGameUrl_str = undefined)
	{
		let GET = parseGet(aStartGameUrl_str);
		window.GET = GET;

		if (GET.room)
		{
			this.getRoomParams = GET.room;
		}

		if (GET.roomId)
		{
			this.room = {id: GET.roomId};
			this._roomId = GET.roomId;
			this.emit(GameScreen.EVENT_ON_ROOM_ID_CHANGED, {id: this.room.id});
			APP.urlBasedParams.roomId = this.room.id;
		}

		if (GET.playerStake)
		{
			this.player.stake = +GET.playerStake;
		}

		if (GET.serverId !== undefined)
		{
			APP.urlBasedParams.serverId = GET.serverId;
		}

		this.sid = APP.urlBasedParams.SID = GET.SID || APP.urlBasedParams.SID;

		this.lang = I18.currentLocale;
		this.mode = APP.urlBasedParams.MODE;

		return GET;
	}

	//LOBBY EXTERNAL MESSAGES...
	_startHandleLobbyExternalMessages()
	{
		APP.externalCommunicator.on(GameExternalCommunicator.LOBBY_MESSAGE_RECEIVED, this._onLobbyExternalMessageReceived, this);
	}

	_onLobbyExternalMessageReceived(event)
	{
		let msgType = event.type;

		switch (msgType)
		{
			case LOBBY_MESSAGES.GAME_URL_UPDATED:
				if (APP.isBattlegroundGame)
				{
					this.clear();
					this.gameFieldController && this.gameFieldController.clearRoom();
				}

				let updatedGameUrl = event.data.gameUrl;
				let GET = parseGet(updatedGameUrl);

				this._applyUrlParams(updatedGameUrl);

				let socketUrl = decodeURIComponent(GET.WEB_SOCKET_URL);
				this.emit(GameScreen.EVENT_ON_GAME_SOCKET_URL_UPDATED, {socketUrl: socketUrl});
				break;
			case LOBBY_MESSAGES.BACK_TO_LOBBY:
			case LOBBY_MESSAGES.BUY_AMMO_FAILED_EXIT_ROOM_REQUESTED:
				this.onBackToLobbyButtonClicked(event.data && event.data.isRequestedFromBattleGroundDialog);
				break;
			case LOBBY_MESSAGES.DIALOG_ACTIVATED:
				let lDialogId_int = event.data? event.data.dialogId : undefined;
				this.emit(GameScreen.EVENT_ON_DIALOG_ACTIVATED, {dialogId: lDialogId_int});
				break;
			case LOBBY_MESSAGES.DIALOG_DEACTIVATED:
				this.emit(GameScreen.EVENT_ON_DIALOG_DEACTIVATED);
				//WHEN BATTLEGROUND REBUY NEM DIALOG CLOSED...
				if(
					APP.isBattlegroundGame &&
					event.data.dialogId === DIALOG_ID_INSUFFICIENT_FUNDS &&
					this.gameStateController.info.isPlayerSitIn
				)
				{
					this.onBackToLobbyButtonClicked(true)
				}
				//...WHEN BATTLEGROUND REBUY NEM DIALOG CLOSED
				break;
			case LOBBY_MESSAGES.FORCE_SIT_OUT_EXIT_CONFIRMED:
				this._fForseSitOutInProgress = false;
				this.goBackToLobby();
				break;
			case LOBBY_MESSAGES.MID_ROUND_EXIT_CONFIRMED:
				this.gameFieldController.roundResultScreenController.resetScreenAppearing();
				this.sitOut();
				break;
			case LOBBY_MESSAGES.CHOOSE_WEAPON_SCREEN_CHANGED:
				if (this.gameFieldController)
				{
					this.fireController.i_onChooseWeaponsStateChanged(event.data.isActive);
				}
				this.emit(GameScreen.EVENT_ON_CHOOSE_WEAPON_SCREEN_CHANGED, {isActive: event.data.isActive});
				break;
			case LOBBY_MESSAGES.SERVER_ERROR_MESSAGE_RECIEVED:
				if (GameWebSocketInteractionController.isGeneralError(event.data.errorType))
				{
					let errorCode = event.data.errorCode;
					if (
							errorCode === GameWebSocketInteractionController.ERROR_CODES.ROOM_NOT_FOUND
							|| errorCode === GameWebSocketInteractionController.ERROR_CODES.ROOM_NOT_OPEN
						)
					{
						this.goBackToLobby();
					}
				}
				break;
			case LOBBY_MESSAGES.LOBBY_CONNECTION_STATE:
				let lLobbyConnectionOpened_bln = event.data.state;
				if (!lLobbyConnectionOpened_bln)
				{
					this.gameFieldController.lobbySecondaryScreenActive = false;
					this.hideBlur();
				}
				break;
			case LOBBY_MESSAGES.LOBBY_LOADING_ERROR:
			case LOBBY_MESSAGES.WEBGL_CONTEXT_LOST:
				this.gameFieldController && this.gameFieldController.clearRoom();
				this.clear();
				this.clearAllButLobbyInfo();
				break;
			case LOBBY_MESSAGES.BACKGROUND_FADE_START:
				this.emit(GameScreen.EVENT_ON_LOBBY_BACKGROUND_FADE_START, {endVolume: event.data.endVolume});
				break;
			case LOBBY_MESSAGES.FRB_RESTART_REQUIRED:
			case LOBBY_MESSAGES.BONUS_RESTART_REQUIRED:
				if (event.data && event.data.restartRoom)
				{
					//restart room without going back to Lobby
					this.emit(GameScreen.EVENT_ON_TIME_TO_RESTART_BONUS_ROOM);
					this._fBackToLobbyRequired_bl = false;
					this.closeRoom();
				}
				else
				{
					this._fFrbEndedPostponedData_obj = null;
					this._fBonusRoundEndedPostponedData_obj = null;
					APP.webSocketInteractionController.clearOpenRoomSent();
					this.goBackToLobby();
				}
				break;
			case LOBBY_MESSAGES.TOURNAMENT_REBUY_CONFIRMED:
			case LOBBY_MESSAGES.BATTLEGROUND_PLAY_AGAIN_CONFIRMED:
				if (
						APP.isBattlegroundGame &&
						(
								!this.gameStateController.info.isPlayerSitIn || 
								APP.webSocketInteractionController.isSitoutRequestInProgress
							)
					)
				{
					console.log("reconnect 1");
					APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.BATTLEGROUND_GAME_URL_NEED_UPDATED_ON_PLAY_AGAIN);
				}
				else
				{
					this.sendReBuy();
					this.gameFieldController.showKingsOfTheHill([-1]);
				}
				break;
			case LOBBY_MESSAGES.GAME_NEM_FOR_ROOM_REQUEST_CONFIRMED:
				if (this._tournamentModeInfo.isTournamentMode)
				{
					return;
				}
				this.goBackToLobby();
				break;
			case LOBBY_MESSAGES.TOURNAMENT_COMEPLETED_WITH_NO_REBUYS:
				this.goBackToLobby();
				break;
			case LOBBY_MESSAGES.BATTLEGROUND_NEED_RETRY_REBUY:
				this._needRetryRebuy();
				break;
			case LOBBY_MESSAGES.BATTLEGROUND_CHANGE_WORLD_BUTTON_CLICKED:
				this._onBattlegroundChangeWorldButtonClicked();
				break;
			case LOBBY_MESSAGES.BATTLEGROUND_NEED_UPDATE_TIME_TO_START:
				this._requestFullGameInfo();
				break;
			case LOBBY_MESSAGES.BATTLEGROUND_CONTINUE_READING_INFO_CLICKED:
				this._cancelRoundClicked();
				break;
			case LOBBY_MESSAGES.BATTLEGROUND_CANCEL_READY_CLICKED:
				this._cancelRoundClicked();
				break;
		}
	}

	//SHOT HANDLING...
	_startHandleShotResponseMessages()
	{
		this.shotResponsesController.on(ShotResponsesController.EVENT_ON_SERVER_SHOT_RESPONSE, this._onShotResponse, this);
	}

	_onShotResponse(data)
	{
		let lShotResponseInfo_sri = data.info;
		if (lShotResponseInfo_sri.isHit) {
			this._onServerHitMessage({messageData: lShotResponseInfo_sri.data, requestData: lShotResponseInfo_sri.requestData});
		}
		else if (lShotResponseInfo_sri.isMiss) {
			this._onServerMissMessage({messageData: lShotResponseInfo_sri.data, requestData: lShotResponseInfo_sri.requestData});
		}
		else {
			throw new Error("Shot response is neither Hit nor Miss " + lShotResponseInfo_sri.toString());
		}

		this.emit(GameScreen.EVENT_ON_SHOT_RESPONSE_PARSED, lShotResponseInfo_sri.requestData);	
	}
	//...SHOT HANDLING

	//SERVER INTERACTION...
	_startHandleWebSocketMessages()
	{
		let wsInteractionController = APP.webSocketInteractionController;

		wsInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_MESSAGE, this._onServerMessage, this);
		wsInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_CONNECTION_OPENED, this._onGameServerConnectionOpened, this);
		wsInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_CONNECTION_CLOSED, this._onGameServerConnectionClosed, this);
		wsInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_GET_ROOM_INFO_RESPONSE_MESSAGE, this._onServerGetRoomInfoResponseMessage, this);
		wsInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_FULL_GAME_INFO_MESSAGE, this._onServerFullGameInfoMessage, this);
		wsInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_SIT_IN_RESPONSE_MESSAGE, this._onServerSitInResponseMessage, this);
		wsInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_SIT_OUT_RESPONSE_MESSAGE, this._onServerSitOutResponseMessage, this);
		wsInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_CLIENTS_INFO_MESSAGE, this._onServerClientsInfoMessage, this);
		wsInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_ROUND_RESULT_MESSAGE, this._onServerRoundResultMessage, this);
		wsInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_GAME_STATE_CHANGED_MESSAGE, this._onServerGameStateChangedMessage, this);
		wsInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_BUY_IN_RESPONSE_MESSAGE, this._onServerBuyInResponseMessage, this);
		wsInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_RE_BUY_RESPONSE_MESSAGE, this._onServerReBuyResponseMessage, this);
		wsInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_CHANGE_MAP_MESSAGE, this._onServerChangeMapMessage, this);
		wsInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_ERROR_MESSAGE, this._onServerErrorMessage, this);
		wsInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_WEAPON_SWITCHED_MESSAGE, this._onServerWeaponSwitchedMessage, this);
		wsInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_OK_MESSAGE, this._onServerOkMessage, this);
		wsInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_ROUND_FINISH_SOON, this._onServerRoundFinishSoonMessage, this);
		wsInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_BALANCE_UPDATED_MESSAGE, this._onServerBalanceUpdatedMessage, this);
		wsInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_BET_LEVEL_CHANGED, this._onServerBetLevelChangeConfirmed, this);
		wsInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_FRB_ENDED_MESSAGE, this._onServerFRBEndedMessage, this);
		wsInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_BULLET_RESPONSE, this._onBulletResponse, this);
		wsInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_BULLET_CLEAR_RESPONSE, this._onBulletClearResponse, this);
		wsInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_CANCEL_BATTLEGROUND_ROUND, this._onCancelBattlegroundRound, this);
		wsInteractionController.on(GameWebSocketInteractionController.EVENT_BATTLEGROUND_SCORE_BOARD, this._onBattlegroundScoreBoard, this);

		wsInteractionController.on(GameWebSocketInteractionController.EVENT_ON_QUEST_WIN_PAYOUT, this._onSeatWinForQuest, this);
	}

	_onBattlegroundScoreBoard(event)
	{
		let lPlayersScore_obj_arr = event.messageData.scoreBySeatId;
		let lMasterSeatId_num = APP.playerController.info.seatId;
		for (let i=0; i<lPlayersScore_obj_arr.length; i++)
		{
			let lPlayerScore_obj = lPlayersScore_obj_arr[i];
			if (lPlayerScore_obj.seatId == lMasterSeatId_num)
			{
				this.player.lastReceivedBattlegroundScore_int = lPlayerScore_obj.winAmount;
			}
		}
	}

	_onGameServerConnectionOpened()
	{
		this._restoreAfterUnseasonableRequest = false;
		this._restoreAfterLagsInProgress = false;

		if (this.gameFieldController && this.gameFieldController.isGameplayStarted())
		{
			this.gameFieldController.screenField.show();
			if (APP.isBattlegroundGame)
			{
				this.gameFieldController.battlegroundFinalCountingController.i_checkCountingComplete();
			}
		}
		this.gameFieldController && this.gameFieldController.onConnectionOpenedHandled();
	}

	_onGameServerConnectionClosed(event)
	{
		this._restoreAfterUnseasonableRequest = false;
		this._restoreAfterLagsInProgress = false;

		if(APP.isBattlegroundGame && this.gameFieldController.isGameplayStarted)
		{
			this.battlegroundGameController.info.isNotFirstBattlegroundRoundAfterLoading = true;

			this._fBattlegroundIsNeedFullGameInfoUpdateOnGameState_bl = false;
			this.gameStateController.off(GameStateController.EVENT_ON_GAME_STATE_CHANGED, this._onCheckGameStateChangedForRequestFullGameInfo);
		}

		if (event.wasClean)
		{
			return;
		}

		this.gameFieldController && this.gameFieldController.clearRoom();
		this.fireController && this.fireController.i_onChooseWeaponsStateChanged(false);
		this.clear();
		this.clearAllButLobbyInfo();

		if (this._fStartGameURL_str)
		{
			this._applyUrlParams(this._fStartGameURL_str);
			this._fStartGameURL_str = null;
		}

		this.gameFieldController && this.gameFieldController.onConnectionClosedHandled();
	}

	_onServerMessage(event)
	{
		let messageData = event.messageData;
		let messageClass = messageData.class;

		//CATCHING RESPONSE TO BATTLEGROUND BUY IN CONFIRM HERE...
		if(
			APP.isBattlegroundGame &&
			APP.webSocketInteractionController.i_getLastItemClassInRequestList(CLIENT_MESSAGES.CONFIRM_BATTLEGROUND_BUY_IN) &&
			APP.webSocketInteractionController.i_getLastItemClassInRequestList(CLIENT_MESSAGES.CONFIRM_BATTLEGROUND_BUY_IN).rid === messageData.rid
			)
		{
			if(messageClass === SERVER_MESSAGES.OK)
			{
				this._onBattlegroundBuyInConfirmRequestApproved();
			}
			else
			{
				//DEBUG...
				APP.logger.i_pushDebug(`GameScreen. BTG buy-in confirm request was not approved by server. ${JSON.stringify(event.messageData)}`);
				console.error("battleground buy-in confirm request was not approved by server");
				//...DEBUG
			}
		}
		//....CATCHING RESPONSE TO BATTLEGROUND BUY IN CONFIRM HERE

		if (
				messageClass == SERVER_MESSAGES.GET_ROOM_INFO_RESPONSE
				|| messageClass == SERVER_MESSAGES.FULL_GAME_INFO
				|| (messageClass == SERVER_MESSAGES.GAME_STATE_CHANGED && (messageData.state === ROUND_STATE.PLAY || messageData.state === ROUND_STATE.WAIT))
				|| (messageClass == SERVER_MESSAGES.UPDATE_TRAJECTORIES && messageData.freezeTime !== undefined && messageData.freezeTime > 0)
				|| messageClass == SERVER_MESSAGES.BALANCE_UPDATED
				|| messageClass == SERVER_MESSAGES.BATTLEGROUND_SCORE_BOARD
			)
		{
			let lServerNewTime_int = messageData.date;
			if (!serverTimeInitiated || serverTime < lServerNewTime_int)
			{

				// SMOOTH RECOVERY...
				let lNewServerClientTimeDiff_num = lServerNewTime_int - this.smoothCuurentTime;

				if (
					lNewServerClientTimeDiff_num > 0
					&& lNewServerClientTimeDiff_num > MIN_VALUE_TO_SMOOTH_RECOVERY
					&& lNewServerClientTimeDiff_num <= MAX_VALUE_TO_SMOOTH_RECOVERY)
				{
					if (lNewServerClientTimeDiff_num <= RECOVERY_HOPS_AMOUNT)
					{
						this._fClientServerTimeCorrectionHops_num = lNewServerClientTimeDiff_num;
						this._fClientServerTimeCorrectionValue_num = 1;
					}
					else
					{
						this._fClientServerTimeCorrectionHops_num = RECOVERY_HOPS_AMOUNT;
						this._fClientServerTimeCorrectionValue_num = lNewServerClientTimeDiff_num / RECOVERY_HOPS_AMOUNT;
					}
				}
				else if (
					lNewServerClientTimeDiff_num < 0 
					&& Math.abs(lNewServerClientTimeDiff_num) > MIN_VALUE_TO_SMOOTH_RECOVERY 
					&& Math.abs(lNewServerClientTimeDiff_num) <= MAX_VALUE_TO_SMOOTH_RECOVERY)
				{
					if (Math.abs(lNewServerClientTimeDiff_num) <= RECOVERY_HOPS_AMOUNT)
					{
						this._fClientServerTimeCorrectionHops_num = Math.abs(lNewServerClientTimeDiff_num);
						this._fClientServerTimeCorrectionValue_num = -1;
					}
					else if (Math.abs(lNewServerClientTimeDiff_num) >= MAX_VALUE_TO_SMOOTH_RECOVERY)
					{
						this._fClientServerTimeCorrectionHops_num = RECOVERY_HOPS_AMOUNT;
						this._fClientServerTimeCorrectionValue_num = lNewServerClientTimeDiff_num / RECOVERY_HOPS_AMOUNT;
					}
				}
				else
				{
					smoothClientTimeDiff = 0;
					smoothServerTime = lServerNewTime_int;
					this._fClientServerTimeCorrectionHops_num = 0;
					this._fClientServerTimeCorrectionValue_num = 0;
				}
				// ...SMOOTH RECOVERY

				serverTimeInitiated = true;
				serverTime = lServerNewTime_int;
				serverLastMessageRecieveTime = Date.now();
				clientTimeDiff = 0;
			}

			accurateServerTime = lServerNewTime_int;
			accurateClientTimeDiff = 0;
			accurateServerLastMessageRecieveTime = Date.now();
			if (APP.isBattlegroundGame)
			{
				APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.BATTLEGROUND_TIME_SYNC, {serverTime: lServerNewTime_int});
			}
		}

		if (
			APP.isBattlegroundGame
			&& this.gameFieldController.isGameplayStarted
			&& (messageData.state === ROUND_STATE.PLAY)
			&& !this.battlegroundGameController.info.isPlayerClickedConfirmPlayForNextBattlegroundRound
			&& !this.gameStateController.info.isPlayerSitIn
			&& !APP.isCAFMode
		)
		{
			//this.emit(GameScreen.EVENT_ON_BTG_ROUND_OBSERVER_DENIED);
			//console.log("two missisipi");
			//APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.BATTLEGROUND_GAME_URL_NEED_UPDATED_ON_PLAY_AGAIN);
			//this.clear();
			//this.gameFieldController.clearRoom();
		}

		if (APP.isBattlegroundGame 
			&& messageData.state
			)
		{
			this.emit(GameScreen.EVENT_ON_SERVER_MESSAGE_GAME_STATE_CHANGED, {state: messageData.state})
		}
	}

	_onServerGetRoomInfoResponseMessage(event)
	{
		this.getRoomInfoResponse(event.messageData);
	}

	_onServerFullGameInfoMessage(event)
	{

		let unrespondedSitIn = APP.webSocketInteractionController.hasUnRespondedRequest(CLIENT_MESSAGES.SIT_IN);
		if(unrespondedSitIn)
		{
			setTimeout(()=>{
				this._onServerFullGameInfoMessage(event);
			}, 30);
			return;
		}

		this.fullGameInfoResponse(event.messageData);

		if(APP.isBattlegroundGame)
		{
			let lTimeToStart_num = event.messageData.timeToStart;
			let lEndTime_num = event.messageData.endTime;

			if(lTimeToStart_num !== undefined)
			{
				if(	lEndTime_num 
					&& event.messageData.state === ROUND_STATE.PLAY
					&& !this.battlegroundGameController.info.isPlayerClickedConfirmPlayForNextBattlegroundRound
					&& !this.gameStateController.info.isPlayerSitIn)
				{
					this.emit(GameScreen.EVENT_BATTLEGROUND_TIME_TO_START_UPDATED,
					{
						timeToStart: lEndTime_num,
						isRoundResultDisplayInProgress: this.isRoundResultDisplayInProgress(),
						isPlayerClickedConfirmPlayForNextBattlegroundRound: this.battlegroundGameController.info.isPlayerClickedConfirmPlayForNextBattlegroundRound
					});
				}
				else
				{
					APP.externalCommunicator.sendExternalMessage(
						GAME_MESSAGES.BATTLEGROUND_TIME_TO_START_UPDATED,
						{
							timeToStart: lTimeToStart_num,
							isRoundResultDisplayInProgress: this.isRoundResultDisplayInProgress(),
							isPlayerClickedConfirmPlayForNextBattlegroundRound: this.battlegroundGameController.info.isPlayerClickedConfirmPlayForNextBattlegroundRound
						}
					);

					this.emit(GameScreen.EVENT_BATTLEGROUND_TIME_TO_START_UPDATED,
						{
							timeToStart: lTimeToStart_num,
							isRoundResultDisplayInProgress: this.isRoundResultDisplayInProgress(),
							isPlayerClickedConfirmPlayForNextBattlegroundRound: this.battlegroundGameController.info.isPlayerClickedConfirmPlayForNextBattlegroundRound
						});
				}
			}
		}
	}

	isRoundResultDisplayInProgress()
	{
		return this.gameFieldController.roundResultActive;
	}

	_onServerSitInResponseMessage(event)
	{
		this.sitInResponse(event.messageData);

		if(APP.isBattlegroundGame)
		{
			this.emit(GameScreen.EVENT_BATTLEGROUND_REQUEST_TIME_TO_START);
			this._fIsFullGameInfoUpdateExpected_bl = true;
		}
	}

	_onServerSitOutResponseMessage(event)
	{
		this.sitOutResponse(event.messageData);
	}

	_onServerMissMessage(event)
	{
		let lRequestEnemyId_int = event.requestData ? event.requestData.enemyId : undefined;
		if (!isNaN(event.messageData.shotEnemyId) && event.messageData.shotEnemyId >= 0)
		{
			lRequestEnemyId_int = event.messageData.shotEnemyId;
		}
		let lIsPaidSpecialShot_bl = event.requestData ? !!event.requestData.isPaidSpecialShot : false;

		this.missResponse(event.messageData, lIsPaidSpecialShot_bl, lRequestEnemyId_int);

		this._checkForCoPlayerCollision(event.messageData);
	}

	_onServerHitMessage(event)
	{
		if (~~event.messageData.hvEnemyId > -1)
		{
			this.emit(GameScreen.EVENT_ON_HV_ENEMY_PARENT_HIT, {hvEnemyId: event.messageData.hvEnemyId, parentEnemyId: event.messageData.enemy.id});
		}
		let lRequestEnemyId_int = event.requestData ? event.requestData.enemyId : undefined;
		if (!isNaN(event.messageData.shotEnemyId) && event.messageData.shotEnemyId >= 0)
		{
			lRequestEnemyId_int = event.messageData.shotEnemyId;
		}
		let lIsPaidSpecialShot_bl = event.requestData ? !!event.requestData.isPaidSpecialShot : false;

		this.hitResponse(event.messageData, lIsPaidSpecialShot_bl, lRequestEnemyId_int);

		this._checkForCoPlayerCollision(event.messageData);
	}

	_checkForCoPlayerCollision(data)
	{
		if (data.rid === -1 && data.bulletId !== undefined)
		{
			this.emit(GameScreen.EVENT_ON_CO_PLAYER_COLLISION_OCCURED, {bulletId: data.bulletId});
		}
	}

	_onServerClientsInfoMessage(event)
	{
		this.updatePlayersInfo(event.messageData);
	}

	_onServerRoundResultMessage(event)
	{
		if (this._isFRBEnded || this._isBonusRoundEnded)
		{
			return;
		}

		this.roundResultResponse(event.messageData);
	}

	_onServerGameStateChangedMessage(event)
	{
		if (this._isFRBEnded || this._isBonusRoundEnded)
		{
			return;
		}

		this.gameStateChangedResponse(event.messageData);
	}

	_onServerBuyInResponseMessage(event)
	{
		this.onBuyInResponse(event.messageData);
	}

	_onServerReBuyResponseMessage(event)
	{
		this.onReBuyResponse(event.messageData);
	}

	_onServerChangeMapMessage(event)
	{
		if (this._isFRBEnded || this._isBonusRoundEnded)
		{
			return;
		}

		this.onChangeMap(event.messageData);
	}

	_onServerBetLevelChangeConfirmed(aEvent_obj)
	{
		let lBetLevel_num = aEvent_obj.messageData.betLevel;

		if(aEvent_obj.messageData.seatId == APP.playerController.info.seatId)
		{
			console.log("FireProblem_: betLevelChanged " + lBetLevel_num + " seet " + aEvent_obj.messageData.seatId );
		}
		
		this.emit(GameScreen.EVENT_ON_BET_LEVEL_CHANGE_CONFIRMED, {betLevel: lBetLevel_num, seatId: aEvent_obj.messageData.seatId});
		// this.playersSpotsController.onBetLevelChangeConfirmed({betLevel: lBetLevel_num, seatId: aEvent_obj.messageData.seatId});
	}

	_onServerBetLevelChangeNotConfirmed()
	{
		this.emit(GameScreen.EVENT_ON_BET_LEVEL_CHANGE_NOT_CONFIRMED);
		if (this.gameFieldController.spot)
		{
			this.gameFieldController.spot.onBetChangeNotConfirmed();
		}
	}

	_onServerOkMessage(event)
	{
		let requestClass = undefined;
		let requestData = event.requestData;
		if (requestData && requestData.rid >= 0)
		{
			requestClass = requestData.class;
		}

		if (requestClass !== undefined)
		{
			switch (requestClass)
			{
				case CLIENT_MESSAGES.CLOSE_ROOM:
					this._onCloseRoomConfirmed();
					break;
			}
		}
	}

	_onServerErrorMessage(event)
	{
		this._handleErrorCode(event.messageData, event.requestData, event.errorType);
	}

	_onServerWeaponSwitchedMessage(event)
	{
		this.onWeaponSwitched(event.messageData);
	}

	_onServerRoundFinishSoonMessage()
	{
		this._fRoundFinishSoon_bl = true;
	}

	_onSeatWinForQuest(aEvent_obj)
	{
		if (this.isPaused || !this.gameFieldController.getSeat(aEvent_obj.messageData.seatId, true))
		{
			return;
		}

		Object.assign(aEvent_obj.messageData, {enemy: {typeId: aEvent_obj.messageData.enemyId}});
		this.gameFieldController.showPrizes(aEvent_obj.messageData, {x: APP.config.size.width/2, y: APP.config.size.height/2}, aEvent_obj.enemyId);
	}
	//...SERVER INTERACTION

	get playersSpotsController()
	{
		return this._fPlayersSpotsController_ec || (this._fPlayersSpotsController_ec = this._initPlayersSpotsController());
	}

	get laserCapsuleFeatureController()
	{
		return this._fLaserCapsuleFeatureController_lcfc || (this._fLaserCapsuleFeatureController_lcfc = this._initLaserCapsuleFeatureController());
	}
	
	get bulletCapsuleFeatureController()
	{
		return this._fBulletCapsuleFeatureController_lcfc || (this._fBulletCapsuleFeatureController_lcfc = this._initBulletCapsuleFeatureController());
	}

	get lightningCapsuleFeatureController()
	{
		return this._fLightningCapsuleFeatureController_lcfc || (this._fLightningCapsuleFeatureController_lcfc = this._initLightningCapsuleFeatureController());
	}

	get killerCapsuleFeatureController()
	{
		return this._fKillerCapsuleFeatureController_kcfc || (this._fKillerCapsuleFeatureController_kcfc = this._initKillerCapsuleFeatureController());
	}

	get freezeCapsuleFeatureController()
	{
		return this._fFreezeCapsuleFeatureController_fcfc || (this._fFreezeCapsuleFeatureController_fcfc = this._initFreezeCapsuleFeatureController());
	}

	get enemiesController()
	{
		return this._fEnemiesController_ec || (this._fEnemiesController_ec = this._initEnemiesController());
	}

	get awardingController()
	{
		return this._fAwardingController_ac || (this._fAwardingController_ac = this._initAwardingController());
	}

	get gameStateController()
	{
		return this._fGameStateController_gsc || (this._fGameStateController_gsc = this._initGameStateController());
	}

	get gameFrbController()
	{
		return this._fGameFrbController_gfrbc || (this._fGameFrbController_gfrbc = this._initGameFrbController());
	}

	get levelUpController()
	{
		return this._fLevelUpController_luc || (this._fLevelUpController_luc = this._initLevelUpController());
	}

	get gameBonusController()
	{
		return this._fGameBonusController_gbc || (this._fGameBonusController_gbc = this._initGameBonusController());
	}

	get bossModeController()
	{
		return this._fBossModeController_bmc || (this._fBossModeController_bmc = this._initBossModeController());
	}

	get mapsController()
	{
		return this._fMapsController_msc || (this._fMapsController_msc = this._initMapsController());
	}

	get subloadingController()
	{
		return this._fSubloadingController_sc || (this._fSubloadingController_sc = this._initSubloadingController());
	}

	get weaponsController()
	{
		return this._fWeaponsController_fwsc || (this._fWeaponsController_fwsc = this._initWeaponsController());
	}

	get bigWinsController()
	{
		return this._fBigWinsController_bwsc || (this._fBigWinsController_bwsc = this._initBigWinsController());
	}

	get fireSettingsController()
	{
		return this._fFireSettingsController_fsc || (this._fFireSettingsController_fsc = this._initFireSettingsController());
	}

	get infoPanelController()
	{
		return this._fInfoPanelController_ipc || (this._fInfoPanelController_ipc = this._initInfoPanelController());
	}

	get gameFieldController()
	{
		return this._fGameFieldController_gfc || (this._fGameFieldController_gfc = this._initGameFieldController());
	}

	get gameFieldView()
	{
		return this._fGameFieldView_gfv || (this._fGameFieldView_gfv = this._initGameFieldView());
	}

	get infoPanelView()
	{
		return this._fInfoPanelView_ipv || (this._fInfoPanelView_ipv = this._initInfoPanelView());
	}

	get targetingController()
	{
		return this._fTargetingController_tc || (this._fTargetingController_tc = this._initTargetingController());
	}

	get fireController()
	{
		return this._fFireController_fc || (this._fFireController_fc = this._initFireController());
	}

	get autoTargetingSwitcherController()
	{
		return this._fAutoTargetingSwitcherController_atsc || (this._fAutoTargetingSwitcherController_atsc = this._initAutoTargetingSwitcherController());
	}

	get gameOptimizationController()
	{
		return this._fGameOptimizationController_goc || (this._fGameOptimizationController_goc = this._initGameOptimizationController());
	}

	get cursorController()
	{
		return this._fCursorController_cc || (this._fCursorController_cc = this._initCursorController());
	}

	get prizesController()
	{
		return this._fPrizesController_psc || (this._fPrizesController_psc = this._initPrizesController());
	}

	get shotResponsesController()
	{
		return this._fShotResponsesController_srsc || (this._fShotResponsesController_srsc = this._initShotResponsesController);
	}

	get buyAmmoRetryingController()
	{
		return this._fBuyAmmoRetryingController_barc || (this._fBuyAmmoRetryingController_barc = this._initBuyAmmoRetryingController());
	}

	get transitionViewController()
	{
		return this._fTransitionViewController_tvc || (this._fTransitionViewController_tvc = this._initTransitionViewController());
	}

	get battlegroundGameController()
	{
		return this._fBattlegroundGameController_bgc || (this._fBattlegroundGameController_bgc = this._initBattlegroundGameController());
	}

	get balanceController()
	{
		return this._fBalanceController_bc || (this._fBalanceController_bc = this._initBalanceController());
	}

	get gameplayDialogsController()
	{
		return this._fGameplayDialogController_gdsc || (this._fGameplayDialogController_gdsc = this._initGameplayDialogsController());
	}

	get battlegroundTutorialController()
	{
		return this._fBattlegroundTutorialController_btc || (this._fBattlegroundTutorialController_btc = this._initBattlegroundTutorialController());
	}

	//SCOREBOARD...
	get scoreboardController()
	{
		return this._fScoreboardController_sc || this._initScoreboardController();
	}

	_initScoreboardController()
	{
		if (this._fScoreboardController_sc)
		{
			return this._fScoreboardController_sc;
		}

		if (!APP.isBattlegroundGame)
		{
			return null;
		}
		
		let l_sc = this._fScoreboardController_sc = new ScoreboardController();
		l_sc.i_init();
		l_sc.on(ScoreboardController.EVENT_ON_SCORE_BOARD_SCORES_UPDATED, this._onScoreboardScoresUpdated, this);
		
		this._fScoreboardView_sv = l_sc.view;
		if (this.gameFieldController.scoreBoardContainerInfo.container)
		{
			this._fScoreboardView_sv.i_addToContainer(this.gameFieldController.scoreBoardContainerInfo);
		}
		else
		{
			this.gameFieldController.once(GameFieldController.EVENT_ON_GAME_FIELD_SCREEN_CREATED, () => {
				this._fScoreboardView_sv.i_addToContainer(this.gameFieldController.scoreBoardContainerInfo);
			});
		}
		return l_sc;
	}

	_onScoreboardScoresUpdated(event)
	{
		if (event.seatId == APP.playerController.info.seatId)
		{
			APP.gameScreen.gameFieldController.updateCommonPanelIndicators({win: event.win}, null);
		}
	}

	get isScoreboardAnimationsPlaying()
	{
		return (this._fScoreboardController_sc && this._fScoreboardController_sc.view.isAnimationsPlaying) || false;
	}
	//...SCOREBOARD

	//CALLOUT...
	get calloutsController()
	{
		return this._fCalloutsController_cc || this._initCalloutsController();
	}

	_initCalloutsController()
	{
		if (this._fCalloutsController_cc)
		{
			return this._fCalloutsController_cc;
		}

		let l_cc = this._fCalloutsController_cc = new CalloutsController();
		l_cc.init();
		if (this.gameFieldController.calloutsContainerInfo.container)
		{
			l_cc.initView(this.gameFieldController.calloutsContainerInfo);
		}
		else
		{
			this.gameFieldController.once(GameFieldController.EVENT_ON_GAME_FIELD_SCREEN_CREATED, () => {
				l_cc.initView(this.gameFieldController.calloutsContainerInfo);
			});
		}

		return l_cc;
	}
	//...CALLOUT

	//BOSS HP BAR CONTROLLER...
	get bossHealthBarController()
	{
		return this._fBossHealthBarController_bmhpbc || this._initBossHealthBarController();
	}

	_initBossHealthBarController()
	{
		if (this._fBossHealthBarController_bmhpbc)
		{
			return this._fBossHealthBarController_bmhpbc;
		}

		let l_bmhpbc = this._fBossHealthBarController_bmhpbc = new BossModeHPBarController();
		l_bmhpbc.i_init();
		if (this.gameFieldController.bossModeHPBarContainerInfo.container)
		{
			l_bmhpbc.initViewContainer(this.gameFieldController.bossModeHPBarContainerInfo);
		}
		else
		{
			this.gameFieldController.once(GameFieldController.EVENT_ON_GAME_FIELD_SCREEN_CREATED, () => {
				l_bmhpbc.initViewContainer(this.gameFieldController.bossModeHPBarContainerInfo);
			});
		}

		return l_bmhpbc;
	}
	//...BOSS HP BAR CONTROLLER

	//AMMO BUY RETRY...
	_initBuyAmmoRetryingController()
	{
		if (this._fBuyAmmoRetryingController_barc)
		{
			return this._fBuyAmmoRetryingController_barc;
		}

		let l_gbarc = new GameBuyAmmoRetryingController();
		l_gbarc.on(GameBuyAmmoRetryingController.EVENT_ON_RETRY_BUY_IN_REQUIRED, this._onBuyAmmoRetryTime, this);
		l_gbarc.on(GameBuyAmmoRetryingController.EVENT_ON_RETRY_RE_BUY_REQUIRED, this._onReBuyAmmoRetryTime, this);
		l_gbarc.i_init();

		return l_gbarc;
	}

	_onBuyAmmoRetryTime()
	{
		this.sendBuyIn();
	}

	_onReBuyAmmoRetryTime()
	{
		this.sendReBuy();
	}

	_onFireCancelledWithNotEnoughAmmo()
	{
		if (
				!this._isFrbMode
				&& !this._isBonusMode
				&& !this._tournamentModeInfo.isTournamentMode
				&& !APP.isBattlegroundGame
			)
		{
			this.sendBuyIn();
		}
	}
	//...AMMO BUY RETRY

	//SHOT RESPONSES WRAPPER...
	_initShotResponsesController()
	{
		if (this._fShotResponsesController_srsc)
		{
			return this._fShotResponsesController_srsc;
		}
		let l_srsc = new ShotResponsesController();
		l_srsc.i_init();
		this._fShotResponsesController_srsc = l_srsc;
		return l_srsc;
	}
	//...SHOT RESPONSES WRAPPER

	_initLaserCapsuleFeatureController()
	{
		if (this._fLaserCapsuleFeatureController_lcfc)
		{
			return this._fLaserCapsuleFeatureController_lcfc;
		}
		let l_lcfc = new LaserCapsuleFeatureController();
		l_lcfc.i_init();
		this._fLaserCapsuleFeatureController_lcfc = l_lcfc;
		return l_lcfc;
	}

	_initBulletCapsuleFeatureController()
	{
		if (this._fBulletCapsuleFeatureController_bcfc)
		{
			return this._fBulletCapsuleFeatureController_bcfc;
		}
		let l_lcfc = new BulletCapsuleFeatureController();
		l_lcfc.i_init();
		this._fBulletCapsuleFeatureController_bcfc = l_lcfc;
		return l_lcfc;
	}

	_initLightningCapsuleFeatureController()
	{
		if (this._fLightningCapsuleFeatureController_lcfc)
		{
			return this._fLightningCapsuleFeatureController_lcfc;
		}
		let l_lcfc = new LightningCapsuleFeatureController();
		l_lcfc.i_init();
		this._fLightningCapsuleFeatureController_lcfc = l_lcfc;
		return l_lcfc;
	}

	_initKillerCapsuleFeatureController()
	{
		if (this._fKillerCapsuleFeatureController_kcfc)
		{
			return this._fKillerCapsuleFeatureController_kcfc;
		}
		let l_kcfc = new KillerCapsuleFeatureController();

		l_kcfc.on(KillerCapsuleFeatureController.EVENT_ON_CARD_DISAPPEARED, this.emit, this);

		l_kcfc.i_init();
		return this._fKillerCapsuleFeatureController_kcfc = l_kcfc;
	}

	_initBalanceController()
	{
		if (this._fBalanceController_bc)
		{
			return this._fBalanceController_bc;
		}
		let l_bc = new BalanceController();

		l_bc.i_init();
		return l_bc;
	}

	_initFreezeCapsuleFeatureController()
	{
		if (this._fFreezeCapsuleFeatureController_fcfc)
		{
			return this._fFreezeCapsuleFeatureController_fcfc;
		}
		let l_fcfc = new FreezeCapsuleFeatureController();
		l_fcfc.i_init();
		l_fcfc.on(FreezeCapsuleFeatureController.CHANGE_FIELD_FREEZE_STATE, this._changeFreezeState, this);
		l_fcfc.on(FreezeCapsuleFeatureController.EVENT_ON_FREEZE_AFFECTED_ENEMIES, this.emit, this);
		l_fcfc.on(FreezeCapsuleFeatureController.EVENT_ON_UNFREEZE_AFFECTED_ENEMIES, this.emit, this);
		return this._fFreezeCapsuleFeatureController_fcfc = l_fcfc;
	}

	_changeFreezeState(aEvent_obj)
	{
		if (!aEvent_obj.frozen && this.room)
		{
			this.room.freezeTime = null;
		}
		this.emit(aEvent_obj);
	}

	_initGameFieldController()
	{
		if (this._fGameFieldController_gfc)
		{
			return this._fGameFieldController_gfc;
		}
		let l_gfc = new GameFieldController();
		l_gfc.i_init();
		this._fGameFieldController_gfc = l_gfc;
		l_gfc.initView(this.gameFieldView);

		l_gfc.on(GameFieldController.EVENT_ON_SOME_ENEMY_SPAWN_SOUND_REQUIRED, this.emit, this);
		l_gfc.on(GameFieldController.EVENT_ON_BULLET_FLY_TIME, this._onBulletFlyTime, this);
		l_gfc.on(GameFieldController.EVENT_BACK_TO_LOBBY_ON_SW_PURCHASE_LIMIT_EXCEEDED_DIALOG_DEACTIVATED, this.closeRoom, this);

		l_gfc.on('roomFieldClosed', () => {
			this.sendCloseRoom();
		});

		l_gfc.on('roomFieldCleared', () => {
			this.emit(GameScreen.EVENT_ON_GAME_FIELD_CLEARED);
		});

		l_gfc.on(GameFieldController.EVENT_ON_BACK_TO_LOBBY_BUTTON_CLICKED, this.onBackToLobbyButtonClicked, this);
		l_gfc.on(GameFieldController.EVENT_ON_ROUND_RESULT_SCREEN_DEACTIVATED, this.emit, this);
		l_gfc.on(GameFieldController.EVENT_ON_BACK_TO_LOBBY_ROUND_RESULT_BUTTON_CLICKED, this.goBackToLobby, this);
		l_gfc.on(GameFieldController.EVENT_ON_ROUND_RESULT_SCREEN_ACTIVATED, this.emit, this);
		l_gfc.on(GameFieldController.EVENT_ON_NEW_ROUND_STATE, this._onNewRoundState, this);
		l_gfc.on(GameFieldController.EVENT_ON_WAITING_NEW_ROUND, this.emit, this);
		l_gfc.on(GameFieldController.EVENT_ON_DRAW_MAP, this.emit, this);
		l_gfc.on(GameFieldController.EVENT_REFRESH_COMMON_PANEL_REQUIRED, this.emit, this);
		l_gfc.on(GameFieldController.EVENT_ON_WEAPON_UPDATED, this.emit, this);
		l_gfc.on(GameFieldController.EVENT_DECREASE_AMMO, this.emit, this);
		l_gfc.on(GameFieldController.EVENT_ON_NEW_BOSS_CREATED, this._onBossCreated, this);
		l_gfc.on(GameFieldController.EVENT_ON_BOSS_DESTROYING, this.emit, this);
		l_gfc.on(GameFieldController.EVENT_ON_BOSS_DESTROYED, this.emit, this);
		l_gfc.on(GameFieldController.EVENT_ON_BOSS_DEATH_CRACK, this.emit, this);
		l_gfc.on(GameFieldController.EVENT_ON_TIME_TO_EXPLODE_COINS, this.emit, this);
		l_gfc.on(GameFieldController.EVENT_ON_GAME_FIELD_SCREEN_CREATED, this.emit, this);
		l_gfc.on(GameFieldController.EVENT_ON_BULLET_TARGET_TIME, this.emit, this);
		l_gfc.on(GameFieldController.EVENT_ON_ROOM_FIELD_CLEARED, this._onRoomFieldCleared, this);
		l_gfc.on(GameFieldController.EVENT_ON_HIT_AWARD_EXPECTED, this.emit, this);
		l_gfc.on(GameFieldController.EVENT_ON_SHOT_SHOW_FIRE_START_TIME, this.emit, this);
		l_gfc.on(GameFieldController.EVENT_ON_WEAPONS_INTERACTION_CHANGED, this._onInteractionChanged, this);
		l_gfc.on(GameFieldController.EVENT_FULL_GAME_INFO_REQUIRED, this._requestFullGameInfo, this);
		l_gfc.on(GameFieldController.EVENT_ON_UPDATE_PLAYER_WIN_CAPTION, this.emit, this);
		l_gfc.on(GameFieldController.EVENT_ON_DEATH_COIN_AWARD, this.emit, this);
		l_gfc.on(GameFieldController.EVENT_ON_ENEMY_DEATH_SFX, this.emit, this);
		l_gfc.on(GameFieldController.EVENT_ON_BOSS_BECOME_VISIBLE, this.emit, this);
		l_gfc.on(GameFieldController.EVENT_ON_BOSS_APPEARED, this.emit, this);
		l_gfc.on(GameFieldController.EVENT_ON_BATTLEGROUND_NEXT_ROUND_CLICKED, this._onBattlegroundNextRoundClicked, this);

		return l_gfc;
	}

	_initGameFieldView()
	{
		let l_gfv = this.addChild(new GameFieldView());
		return l_gfv;
	}

	//ENEMIES...
	_initEnemiesController()
	{
		if (this._fEnemiesController_ec)
		{
			return this._fEnemiesController_ec;
		}
		let l_ec = new EnemiesController();
		l_ec.i_init();
		this._fEnemiesController_ec = l_ec;
		return l_ec;
	}
	//...ENEMIES

	//PLAYER SPOTS...
	_initPlayersSpotsController()
	{
		if (this._fPlayersSpotsController_ec)
		{
			return this._fPlayersSpotsController_ec;
		}
		let l_psc = new PlayerSpotsController();

		l_psc.on(PlayerSpotsController.EVENT_ON_BET_MULTIPLIER_CHANGED, this._onPlayerBetMultiplierUpdated, this);
		l_psc.on(PlayerSpotsController.EVENT_ON_AUTOFIRE_BUTTON_ENABLED, this.emit, this);
		l_psc.on(PlayerSpotsController.EVENT_ON_AUTOFIRE_BUTTON_DISABLED, this.emit, this);
		l_psc.on(PlayerSpotsController.EVENT_ON_MASTER_SEAT_ADDED, this._onMasterSeatAdded, this);

		l_psc.i_init();
		this._fPlayersSpotsController_ec = l_psc;
		return l_psc;
	}
	//...PLAYER SPOTS

	//PRIZES...
	_initPrizesController()
	{
		if (this._fPrizesController_psc)
		{
			return this._fPrizesController_psc;
		}
		let l_psc = new PrizesController();
		l_psc.i_init();
		this._fPrizesController_psc = l_psc;
		return l_psc;
	}
	//...PRIZES

	//AWARDING...
	_initAwardingController()
	{
		if (this._fAwardingController_ac)
		{
			return this._fAwardingController_ac;
		}
		let l_ac = new AwardingController();
		l_ac.on(AwardingController.EVENT_ON_COIN_LANDED, this._onCoinLanded, this);

		l_ac.i_init();
		this._fAwardingController_ac = l_ac;
		return l_ac;
	}

	_onCoinLanded(aEvent_obj)
	{
		if (aEvent_obj.money)
		{
			if (aEvent_obj.seatId !== APP.playerController.info.seatId)
			{
				this.gameFieldController.playerSeatBounce(aEvent_obj.seatId);
			}
		}
	}
	//...AWARDING

	//TRANSITION VIEW...
	_initTransitionViewController()
	{
		if (this._fTransitionViewController_tvc)
		{
			return;
		}

		let l_tvc = this._fTransitionViewController_tvc = new TransitionViewController();
		l_tvc.init();

		return l_tvc;
	}
	//...TRANSITION VIEW

	//BATTLEGROUND GAME CONTROLLER...
	_initBattlegroundGameController()
	{
		if (this._fBattlegroundGameController_bgc)
		{
			return;
		}

		let l_bgc = this._fBattlegroundGameController_bgc = new BattlegroundGameController();
		l_bgc.init();
		return l_bgc;
	}
	//...BATTLEGROUND GAME CONTROLLER

	//GAMEPLAY DIALOG...
	_initGameplayDialogsController()
	{
		if (this._fGameplayDialogController_gdsc)
		{
			return;
		}

		let l_gdsc = this._fGameplayDialogController_gdsc = new GameplayDialogsController();

		l_gdsc.gameBattlegroundCountDownDialogController.on(BattlegroundCountDownDialogController.EVENT_BATTLEGROUND_COUNTDOWN_CANCEL_CLICKED, this._cancelRoundClicked, this);
		return l_gdsc;
	}
	//...GAMEPLAY DIALOG

	// BATTLEGROUND TUTORIAL...
	_initBattlegroundTutorialController()
	{
		if (this._fBattlegroundTutorialController_btc)
		{
			return;
		}

		let l_btc = this._fBattlegroundTutorialController_btc = new BattlegroundTutorialController();

		l_btc.on(BattlegroundTutorialController.VIEW_HIDDEN, this._onTutorialHidden, this);
		return l_btc;
	}
	// ...BATTLEGROUND TUTORIAL

	_cancelRoundClicked()
	{
		this._fIsCountDownCanceled = true;

		if (this.gameStateController.info.isPlayerSitIn || this.player.sitInIsSent)
		{
			this.sitOut();
			this.clear();
		}
		this.battlegroundGameController.info.isPlayerClickedConfirmPlayForNextBattlegroundRound = false;
		this.player.confirmIsSent = false;
		this.player.battlegroundBuyInConfirmIsApproved = false;
	}

	//CURSOR...
	_initCursorController()
	{
		if (this._fCursorController_cc)
		{
			return this._fCursorController_cc;
		}

		let lCursorAnimation = this.addChild(new CursorAnimation());

		this._fCursorController_cc = new CursorController(lCursorAnimation);
		this._fCursorController_cc.init();

		return this._fCursorController_cc;
	}
	//...CURSOR

	//BOSS MODE...
	_initBossModeController()
	{
		let l_bmc = new BossModeController(new BossModeInfo(), new BossModeView());

		l_bmc.on(BossModeController.EVENT_ON_COIN_LANDED, this._onCoinLanded, this);

		l_bmc.on(IceBossAppearanceView.EVENT_ON_ICE_BOSS_FREEZE_LAND_NEEDED, this.emit, this);
		l_bmc.on(IceBossAppearanceView.EVENT_ON_ICE_BOSS_FREEZE_LAND_MELTING, this.emit, this);

		return l_bmc;
	}
	//...BOSS MODE

	//MAPS...
	_initMapsController()
	{
		let l_msc = new MapsController();
		return l_msc;
	}
	//...MAPS

	//GAME OPTIMIZATION...
	_initGameOptimizationController()
	{
		let l_goc = new GameOptimizationController();
		return l_goc;
	}
	//...GAME OPTIMIZATION

	//SUBLOADING...
	_initSubloadingController()
	{
		let l_sc = new SubloadingController();

		return l_sc;
	}
	//...SUBLOADING

	//WEAPONS...
	_initWeaponsController()
	{
		let l_wsc = new WeaponsController();
		l_wsc.on(WeaponsController.EVENT_ON_FRB_AMMO_UPDATED, this._onFrbAmmoUpdated, this);
		return l_wsc;
	}

	_onFrbAmmoUpdated()
	{
		this._updateAmmo(0);
	}
	//...WEAPONS

	//BIG WINS...
	_initBigWinsController()
	{
		let l_bwsc = new BigWinsController();
		l_bwsc.on(BigWinsController.EVENT_ON_COIN_LANDED, this._onCoinLanded, this);
		return l_bwsc;
	}
	//...BIG WINS

	//FIRE SETTINGS...
	_initFireSettingsController()
	{
		let l_fsc = new FireSettingsController();
		return l_fsc;
	}

	_onFireSettingsActivated()
	{
		this.gameFieldController.onFireSettingsActivated();
	}

	_onFireSettingsDeactivated()
	{
		this.gameFieldController.onFireSettingsDeactivated();
	}
	//...FIRE SETTINGS

	//INFO PANEL...
	_initInfoPanelController()
	{
		let l_ipc = new InfoPanelController();
		return l_ipc;
	}

	_initInfoPanelView()
	{
		let l_ipv = this.addChild(new InfoPanelView());
		return l_ipv;
	}
	//...INFO PANEL

	//TARGETING...
	_initTargetingController()
	{
		let l_tc = new TargetingController();
		return l_tc;
	}

	_initAutoTargetingSwitcherController()
	{
		let l_atsc = new AutoTargetingSwitcherController();
		return l_atsc;
	}
	//...TARGETING

	//FIRE...
	_initFireController()
	{
		let l_fc = new FireController();

		l_fc.on(FireController.EVENT_ON_RESET_TARGET, this.emit, this);
		l_fc.on(FireController.EVENT_ON_TARGETING, this.emit, this);
		l_fc.on(FireController.EVENT_ON_BULLET_FLY_TIME, this._onBulletFlyTime, this);
		l_fc.on(FireController.DEFAULT_GUN_SHOW_FIRE, this.emit, this);
		l_fc.on(FireController.EVENT_ON_BULLET_CLEAR, this.emit, this);
		l_fc.on(FireController.EVENT_NOT_ENOUGH_MONEY_DIALOG_REQUIRED, this._onNotEnougMoneyDialogRequired, this);
		l_fc.on(FireController.EVENT_ON_FIRE_CANCELLED_WITH_NOT_ENOUGH_AMMO, this._onFireCancelledWithNotEnoughAmmo, this);
		l_fc.on(FireController.EVENT_ON_TARGET_ENEMY_IS_DEAD, this.emit, this);
		l_fc.on(FireController.EVENT_ON_TARGET_B3_FORMATION_INVULNERABLE, this.emit, this);
		l_fc.on(FireController.EVENT_ON_TARGET_B3_FORMATION_VULNERABLE, this.emit, this);
		l_fc.on(FireController.EVENT_ON_NON_RICOCHET_BULLETS_PAYBACK_REQUIRED, this._onNonRicochetBulletsPaybackRequired, this);

		l_fc.on('fire', (params) =>{
			var shotData =
			{
				enemyId: params.id,
				weaponId: params.weaponId,
				x: params.x,
				y: params.y,
				weaponPrice: params.weaponPrice
			};

			if (params.bulletId !== undefined)
			{
				shotData.bulletId = params.bulletId;
			}

			this.emit(GameScreen.EVENT_ON_SHOT_TRIGGERED, shotData);
		});

		l_fc.on(FireController.EVENT_ON_RICOCHET_BULLET_REGISTER, (e) =>{
			var shotData =
			{
				bulletTime: this.accurateCurrentTime,
				bulletAngle: e.bullet.angle,
				bulletId: e.bullet.bulletId,
				weaponId: e.bullet.weaponId,
				startPoint: {x: e.bullet.startPos.x, y: e.bullet.startPos.y},
				endPoint: {x: e.bullet.endPos.x, y: e.bullet.endPos.y},
				startPointX: e.bullet.startPos.x,
				startPointY: e.bullet.startPos.y,
				endPointX: e.bullet.endPos.x,
				endPointY: e.bullet.endPos.y,
			};

			this.emit(GameScreen.EVENT_ON_BULLET, shotData);
		});
		
		return l_fc;
	}

	_onNonRicochetBulletsPaybackRequired(aEvent_obj)
	{
		this.revertAmmoBack(aEvent_obj.weaponId, aEvent_obj.betLevel, false, false, aEvent_obj.currentBullets);
	}
	//...FIRE

	_initGameStateController()
	{
		if (this._fGameStateController_gsc)
		{
			return this._fGameStateController_gsc;
		}

		let l_gsc = new GameStateController();
		l_gsc.init();
		this._fGameStateController_gsc = l_gsc;
		return l_gsc;
	}

	_initGameFrbController()
	{
		if (this._fGameFrbController_gfrbc)
		{
			return this._fGameFrbController_gfrbc;
		}

		let l_gfrbc = new GameFRBController();
		l_gfrbc.init();
		this._fGameFrbController_gfrbc = l_gfrbc;
		return l_gfrbc;
	}

	_initLevelUpController()
	{
		if (this._fLevelUpController_luc)
		{
			return this._fLevelUpController_luc;
		}

		let l_luc = new LevelUpController();
		l_luc.init();
		this._fLevelUpController_luc = l_luc;

		l_luc.on(LevelUpController.EVENT_ON_WEAPON_AWARDED, this.emit, this);
		l_luc.on(LevelUpController.EVENT_ON_TIME_TO_HANDLE_AWARDED_WEAPON, this.emit, this);

		return l_luc;
	}

	_initGameBonusController()
	{
		if (this._fGameBonusController_gbc)
		{
			return this._fGameBonusController_gbc;
		}

		let l_gbc = new GameBonusController();
		l_gbc.init();
		this._fGameBonusController_gbc = l_gbc;

		l_gbc.on(GameBonusController.EVENT_ON_BONUS_SIT_OUT_REQUIRED, this._onBonusSitOutRequired, this);
		l_gbc.on(GameBonusController.EVENT_ON_BONUS_BACK_TO_LOBBY_REQUIRED, this._onBonusBackToLobbyRequired, this);
		l_gbc.on(GameBonusController.EVENT_ON_FRB_BACK_TO_LOBBY_REQUIRED, this._onFRBBackToLobbyRequired, this);

		return l_gbc;
	}

	_onBonusSitOutRequired()
	{
		this.sitOut();
	}

	_onBonusBackToLobbyRequired()
	{
		this.goBackToLobby();
	}

	_onFRBBackToLobbyRequired()
	{
		this.goBackToLobby();
	}

	_initGamePleaseWaitDialogController()
	{
		let l_gpwdc = new GamePleaseWaitDialogController();
		l_gpwdc.init();
	}

	gameStateChangedResponse(data)
	{
		this.room.state = data.state;
		this.room.ttnx = data.ttnx;
		this.room.roundId = data.roundId;

		if (this.room.state == ROUND_STATE.PLAY)
		{
			this._requestFullGameInfo();
		}

		this.gameFieldController.changeState(this.room.state);

		this.emit(GameScreen.EVENT_ON_ROUND_ID_UPDATED, {roundId: data.roundId});

		let l_gwsic = APP.webSocketInteractionController;
		if (
				APP.isBattlegroundGame
				&& !APP.playerController.info.isObserver
				&& !(this.player.seatId >= 0)
				&& this._isRoomSitItAllowedState
				&& !l_gwsic.isSitoutRequestInProgress
				&& !l_gwsic.hasDelayedRequests(CLIENT_MESSAGES.SIT_OUT)
				&& !l_gwsic.hasUnRespondedRequest(CLIENT_MESSAGES.SIT_IN)
				&& !l_gwsic.hasUnRespondedRequest(CLIENT_MESSAGES.CONFIRM_BATTLEGROUND_BUY_IN)
				&& !l_gwsic.hasDelayedRequests(CLIENT_MESSAGES.SIT_IN)
				&& !l_gwsic.hasDelayedRequests(CLIENT_MESSAGES.CONFIRM_BATTLEGROUND_BUY_IN)
			)
		{
			this.sendSitIn(true);
			return;
		}

		if (this._canJoinRoom() && this.player.seatId === undefined)
		{
			if (
				!APP.isBattlegroundGame
				|| this.battlegroundGameController.info.isPlayerClickedConfirmPlayForNextBattlegroundRound
				)
			{
				this.sendSitIn();
			}

		}
	}

	get isRoomGameActive()
	{
		return (this.room.state == ROUND_STATE.PLAY);
	}

	roundResultResponse(aData_obj)
	{
		this.gameFieldController.roundResultScreenController.onRoundResultResponse(aData_obj);

		this.emit(GameScreen.EVENT_ON_NEXT_MAP_UPDATED, {nextMapId: aData_obj.nextMapId});
		this._clearAmmo();
		this.gameFieldController.onClearAmmo();

		if (this.isPaused)
		{
			this.gameFieldController && this.gameFieldController.clearWeapons();
		}

		if (APP.isBattlegroundGame)
		{
			this._requestFullGameInfo()
		}
	}

	_onTimeToShowTutorial(aEvent_obj, aOptAutoHide_bl=false)
	{
		
		if (this.gameFieldController.spot)
		{
			let spot = this.gameFieldController.spot;
			this.emit(GameScreen.EVENT_TIME_TO_SHOW_BATTLEGROUND_TUTORIAL, {
				positionId: 		SEATS_POSITION_IDS[this.player.seatId],
				mainSpot: 			this.gameFieldController.spot.getBounds(),
				isSpotAtBottom: 	this.gameFieldController.spot.isBottom,
				autoTargetSwitcher: APP.gameScreen.autoTargetingSwitcherController.view.getBounds(),
				autoHide:			aOptAutoHide_bl,
				roomState:			this.room.state
			});
		}
	}

	_onTutorialHidden()
	{
		this.gameFieldController.showUI();
		if (this._fGameStateController_gsc.info.isPlayState)
		{
			this.scoreboardController.view.show();
		}
	}

	_onBattlegroundChangeWorldButtonClicked()
	{
		if (this.gameStateController.info.isPlayerSitIn)
		{
			this.sitOut();
		}
		APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.BATTLEGROUND_BACK_TO_MQB_LOBBY);
	}

	onRoundResultActivated(e)
	{
		this.fireSettingsController.hideScreen();

		if (this.room)
		{
			this.tryToProceedPostponedSitOut();
		}

		if (!this.gameStateController.info.isGameInProgress)
		{
			this.clear();
		}

		if (this.gameStateController.info.isWaitState || e.roundResultOnAwaitingGameUnpause)
		{
			this._requestFullGameInfo();
		}
		else if (APP.webSocketInteractionController.isConnectionOpened)
		{
			this._onNeedFullGameInfoUpdateOnGameStatePlayOrWait();
		}
	}

	_onNeedFullGameInfoUpdateOnGameStatePlayOrWait()
	{
		if (!APP.isBattlegroundGame)
		{
			return;
		}

		if (this.gameStateController.info.isPlayerSitIn)
		{
			this._fBattlegroundIsNeedFullGameInfoUpdateOnGameState_bl = true;
			this.gameStateController.off(GameStateController.EVENT_ON_GAME_STATE_CHANGED, this._onCheckGameStateChangedForRequestFullGameInfo, this);
			this.gameStateController.on(GameStateController.EVENT_ON_GAME_STATE_CHANGED, this._onCheckGameStateChangedForRequestFullGameInfo, this);
		}
		else
		{
			console.log("reconnect 2");
			APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.BATTLEGROUND_GAME_URL_NEED_UPDATED_ON_PLAY_AGAIN);
		}
	}

	_onBattlegroundNextRoundClicked()
	{
		let roundState = this.gameStateController.info.gameState;
		if (roundState == ROUND_STATE.QUALIFY)
		{
			if (APP.webSocketInteractionController.isConnectionOpened)
			{
				this._onNeedFullGameInfoUpdateOnGameStatePlayOrWait();
			}
		}
		else
		{
			this._requestFullGameInfo();
		}

		APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.BATTLEGROUND_PLAY_AGAIN_REQUEST, {isRRActive: this.isRoundResultDisplayInProgress()});
		this.player.lastReceivedBattlegroundScore_int = 0;
		this.gameFieldController.spot && this.gameFieldController.spot.setScore();
	}

	_onCheckGameStateChangedForRequestFullGameInfo(e)
	{
		if (this._fBattlegroundIsNeedFullGameInfoUpdateOnGameState_bl && (e.value == ROUND_STATE.PLAY || e.value == ROUND_STATE.WAIT))
		{
			if (this.gameStateController.info.isPlayerSitIn)
			{
				this._fBattlegroundIsNeedFullGameInfoUpdateOnGameState_bl = false;
				this._requestFullGameInfo();
			}
			else
			{
				if (this.battlegroundGameController.info.isPlayerClickedConfirmPlayForNextBattlegroundRound)
				{
					this._fBattlegroundIsNeedFullGameInfoUpdateOnGameState_bl = false;
				}
				else
				{
					APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.BATTLEGROUND_PLAY_AGAIN_REQUEST, {isRRActive: this.isRoundResultDisplayInProgress()});
				}
			}

			this.gameStateController && this.gameStateController.off(GameStateController.EVENT_ON_GAME_STATE_CHANGED, this._onCheckGameStateChangedForRequestFullGameInfo);
		}
		else if (e.value == ROUND_STATE.CLOSED)
		{
			this._fBattlegroundIsNeedFullGameInfoUpdateOnGameState_bl = false;
			this.gameStateController && this.gameStateController.off(GameStateController.EVENT_ON_GAME_STATE_CHANGED, this._onCheckGameStateChangedForRequestFullGameInfo);
		}
	}

	getPlayer(id)
	{
		for (let seat of this.room.seats)
		{
			if (seat.seatId == id)
			{
				return seat;
			}
		}
	}

	updatePlayersInfo(data, redraw=true)
	{
		for (let seat of data.seats)
		{
			seat.seatId = seat.id;
			seat.weapon = {
				id: seat.specialWeaponId
			}
		}

		this.room.seats = data.seats;

		if (this.player.seatId === undefined && !this._roomHasEmptySeats)
		{
			redraw = false;
		}

		if (redraw)
		{
			this.playersSpotsController.drawAllPlayers(this.room.seats, this.player ? this.player.seatId : -1, true);
		}
	}

	onWeaponSwitched(data)
	{

		if(data.seatId == APP.playerController.info.seatId)
		{
			console.log("FireProblem_ WeaponSwitched " +  data.weaponId)
		}
		
		if (this.room && this.room.seats)
		{
			for (let i = 0; i < this.room.seats.length; i++)
			{
				let lRoomSeat_obj = this.room.seats[i];
				if (lRoomSeat_obj.seatId == data.seatId && data.rid == -1)
				{
					if (lRoomSeat_obj.specialWeaponId != data.weaponId)
					{
						lRoomSeat_obj.specialWeaponId = data.weaponId;
					}

					if (
							APP.isBattlegroundGame
							&& data.weaponId == WEAPONS.DEFAULT
							&& (this.gameStateController.info.isQualifyState)
						)
					{
						let lPlayerInfo_pi = APP.playerController.info;
						lRoomSeat_obj.betLevel = lPlayerInfo_pi.roomDefaultBetLevel;
					}
				}
			}
		}

		this.gameFieldController.showPlayersWeaponSwitched(data);
		}

	//BONUS...
	_onBonusStateChanged(e)
	{
		if (e.noWait)
		{
			return;
		}

		this._fBonusRoundEndedPostponedData_obj = {};
	}

	_onTimeToOpenRealRoomAfterBonus(data)
	{
		if (data.roomId && !isNaN(data.roomId) && data.roomId > -1)
		{
			APP.urlBasedParams.roomId = data.roomId;
		}

		//clearing...
		this._fRoundFinishSoon_bl = false;
		this._fCompensationDialogActive_bln = false;
		this._restoreAfterLagsInProgress = false;
		this.gameFieldController.roundResultScreenController.hideScreen();
		this.gameFieldCofntroller.roundResultScreenController.resetScreenAppearing();
		//...clearing

		this.emit(GameScreen.EVENT_ON_TIME_TO_OPEN_REAL_ROOM_AFTER_BONUS);
	}
	//...BONUS

	onFRBEnded()
	{
		this._fFrbEndedPostponedData_obj = {
			newStatus: APP.currentWindow.gameFrbController.info.frbEndReason,
			hasNextFrb: APP.currentWindow.gameFrbController.info.nextModeFrb,
			winSum: APP.currentWindow.gameFrbController.info.winSum,
			realWinSum: APP.currentWindow.gameFrbController.info.realWinSum
		};
	}

	get roundFinishSoon()
	{
		return this._fRoundFinishSoon_bl;
	}

	set roundFinishSoon(value)
	{
		this._fRoundFinishSoon_bl = value;
	}

	getMassDamageEffectedEnemies(rid)
	{
		let res = [];
		for (let i = 0; i < this.massDamageAffectedEnemies.length; ++i)
		{
			if (this.massDamageAffectedEnemies[i].rid == rid)
			{
				res.push(this.massDamageAffectedEnemies[i]);
				this.massDamageAffectedEnemies.splice(i, 1);
				--i;
			}
		}

		res.sort((a,b) => (a.data.lastResult && !b.data.lastResult) ? 1 : ((!a.data.lastResult  && b.data.lastResult) ? -1 : 0));
		return res;
	}

	missResponse(data, aIsPaidSpecialShot_bl, aRequestEnemyId_int = undefined)
	{
		if (!this.room)
		{
			return;
		}

		if (data.bossNumberShots)
		{
			this.bossModeController.bossNumberShots = data.bossNumberShots;
		}

		let lPlayerSeat_obj = this.gameFieldController.getSeat(data.seatId, true);
		if (lPlayerSeat_obj)
		{
			data.playerName = lPlayerSeat_obj.nickname;
		}

		if (data.killedMiss)
		{
			let enemy = this.getExistEnemy(data.enemyId);
			if (enemy)
			{
				enemy.killedMiss = true;
				this.emit(GameScreen.EVENT_ON_KILLED_MISS_ENEMY, {enemyId: data.enemyId});
			}
		}

		if (this.isPaused)
		{
			if (data.rid != -1 && (data.killedMiss == true || data.invulnerable == true))
			{
				this.emit(GameScreen.EVENT_ON_REVERT_AMMO_BACK, {weaponId: data.usedSpecialWeapon,
					revertByRoundNotStartedError: false,
					revertAmmoAmount: data.betLevel,
					isPaidSpecialShot: aIsPaidSpecialShot_bl});
			}
			return;
		}

		this.massDamageAffectedEnemies.push({rid: data.rid, enemyId: data.enemyId, data: data});
		if (data.lastResult)
		{
			let enemies = this.getMassDamageEffectedEnemies(data.rid);
			data.affectedEnemies = enemies;
			data.requestEnemyId = aRequestEnemyId_int;
		}
		else
		{
			return;
		}

		if (data.rid != -1)
		{
			this.gameFieldController.onShotResponse();

			if ((data.killedMiss == true || data.invulnerable == true))
			{
				this.revertAmmoBack(data.usedSpecialWeapon, data.betLevel, aIsPaidSpecialShot_bl);
			}
		}

		this.gameFieldController.showMiss(data, aIsPaidSpecialShot_bl);
	}

	revertAmmoBack(weaponId, aRequestBetLevel_num, aIsPaidSpecialShot_bl, optIsRoundNotStarted, aOptSpecialAmmoAmount_num = 1)
	{
		let lBetLevel_num = aRequestBetLevel_num ? aRequestBetLevel_num : APP.playerController.info.betLevel;
		let lRevertAmmoAmount_int = (aIsPaidSpecialShot_bl ? this.weaponsController.info.i_getWeaponShotPriceConvertedIntoDefaultAmmo(weaponId) : lBetLevel_num) || 1;
		lRevertAmmoAmount_int *= aOptSpecialAmmoAmount_num;
		if (isNaN(lRevertAmmoAmount_int) || lRevertAmmoAmount_int < 1)
		{
			throw new Error(`Incorrect revert ammo amount: ${lRevertAmmoAmount_int}`);
		}

		this.emit(GameScreen.EVENT_ON_REVERT_AMMO_BACK, {weaponId: weaponId,
			revertByRoundNotStartedError: optIsRoundNotStarted,
			revertAmmoAmount:lRevertAmmoAmount_int,
			isPaidSpecialShot: aIsPaidSpecialShot_bl});
		this.gameFieldController.handleAmmoBackMessage();
	}

	onShotResponse()
	{
		this.gameFieldController.onShotResponse();
	}

	hitResponse(data, aIsPaidSpecialShot_bl, aRequestEnemyId_int = undefined)
	{
		if (!this.room)
		{
			return;
		}

		if (data.bossNumberShots)
		{
			this.bossModeController.bossNumberShots = data.bossNumberShots;
		}

		data.awardedWin = Number(data.win);

		let lPlayerSeat_obj = this.gameFieldController.getSeat(data.seatId, true);
		if (lPlayerSeat_obj)
		{
			data.playerName = lPlayerSeat_obj.nickname;
		}

		this.emit(GameScreen.EVENT_ON_HIT_RESPONCE, {data: data});

		data = this._disableSpecialFeaturesForCoopPlayer(data);

		this.massDamageAffectedEnemies.push({rid: data.rid, enemyId: data.enemy.id, data: data});
		if (data.lastResult)
		{
			let enemies = this.getMassDamageEffectedEnemies(data.rid);
			data.affectedEnemies = enemies;
			data.requestEnemyId = aRequestEnemyId_int;
		}
		else
		{
			return;
		}

		if (data.rid != -1)
		{
			this.gameFieldController.onShotResponse();
		}

		if(this._fIsFullGameInfoUpdateExpected_bl || !this.player.sitIn)
		{
			data.fullGameInfoUpdateExpected = true;
		}

		//check Big Win...
		const lIsBigWin_bl = this.bigWinsController.i_isBigWin(data);
		let lMasterSeatId_num = APP.playerController.info.seatId;
		let lIsSkipAwardedWinRequired_bl = lIsBigWin_bl && data.seatId == lMasterSeatId_num; // skip if big win needed
		data.skipAwardedWin = lIsSkipAwardedWinRequired_bl;
		data.isKilledBossHit = this.bossModeController.i_isKilledBossWin(data);
		for (let affectedEnemy of data.affectedEnemies)
		{
			affectedEnemy.data.skipAwardedWin = lIsSkipAwardedWinRequired_bl;
			affectedEnemy.data.isKilledBossHit = /*data.isKilledBossHit &&*/this.bossModeController.checkKilledBossHitEnemy(affectedEnemy);
		}
		//...check Big Win

		if (this.isPaused)
		{
			if (data.awardedWeapons && data.awardedWeapons.length)
			{
				while (data.awardedWeapons.length)
				{
					let lSpecWeapon_obj = data.awardedWeapons.shift();
					let lWeapon_obj = {id: lSpecWeapon_obj.id, shots: lSpecWeapon_obj.shots};
					this.emit(GameScreen.EVENT_ON_WEAPON_AWARDED, {weapon: lWeapon_obj});
					this.gameFieldController.updateWeaponImmediately(lWeapon_obj);
				}
			}
			else if (data.awardedWeaponId != WEAPONS.DEFAULT)
			{
				let lWeapon_obj = {id: data.awardedWeaponId, shots: data.awardedWeaponShots};
				this.emit(GameScreen.EVENT_ON_WEAPON_AWARDED, {weapon: lWeapon_obj});
				this.gameFieldController.updateWeaponImmediately(lWeapon_obj);
			}

			return;
		}
		this.gameFieldController.showHit(data, aIsPaidSpecialShot_bl);
	}

	_disableSpecialFeaturesForCoopPlayer(aData_obj)
	{
		let lSeatId = APP.playerController.info.seatId;

		if (aData_obj.seatId !== lSeatId)
		{
			let lIsKilledBossWin_bl = aData_obj.killed && aData_obj.enemy.typeId == ENEMY_TYPES.BOSS; 
			if (lIsKilledBossWin_bl)
			{
				// keep killBonusPay for killed boss hits
			}
			else
			{
				aData_obj.awardedWin += (aData_obj.killBonusPay || 0);
			}
		}

		return aData_obj;
	}

	_onNotEnougMoneyDialogRequired(event)
	{
		this.emit(GameScreen.EVENT_ON_RESET_TARGET);

		let lNEMData_obj = {};
		if (event.hasUnrespondedShots !== undefined)
		{
			lNEMData_obj.hasUnrespondedShots = event.hasUnrespondedShots;
		}

		if (event.hasDelayedShots !== undefined)
		{
			lNEMData_obj.hasDelayedShots = event.hasDelayedShots;
		}

		if (event.hasUnparsedShotResponse !== undefined)
		{
			lNEMData_obj.hasUnparsedShotResponse = event.hasUnparsedShotResponse;
		}

		this.emit(GameScreen.EVENT_NOT_ENOUGH_MONEY_DIALOG_REQUIRED, lNEMData_obj);
	}

	_onServerFRBEndedMessage()
	{
		let lFrbInfo_bi = this.gameFrbController.info;
		this.gameFieldController.isWinLimitExceeded = lFrbInfo_bi.isWinLimitExceeded;
	}

	_onBulletResponse(aEvent_obj)
	{
		this.emit(GameScreen.EVENT_ON_BULLET_RESPONSE, {data: aEvent_obj.messageData});
	}

	_onBulletClearResponse(aEvent_obj)
	{
		this.emit(GameScreen.EVENT_ON_BULLET_CLEAR_RESPONSE, {data: aEvent_obj.messageData});
	}

	_onCancelBattlegroundRound(aEvent_obj)
	{
		let l_gsi = this._fGameStateController_gsc.info;
		APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.BATTLEGROUND_ROUND_CANCELED, {isGameInProgress: l_gsi.isGameInProgress, isWaitState: l_gsi.isWaitState, refundedAmount: aEvent_obj.messageData.refundedAmount, isCountDownCanceled: this._fIsCountDownCanceled });
		this.emit(GameScreen.EVENT_ON_BATTLEGROUND_ROUND_CANCELED, {isGameInProgress: l_gsi.isGameInProgress, isWaitState: l_gsi.isWaitState, refundedAmount: aEvent_obj.messageData.refundedAmount });

		if (l_gsi.isGameInProgress && l_gsi.isQualifyState && this.gameFieldController.roundResultActive)
		{
			return;
		}

		if (!APP.webSocketInteractionController.isSitoutRequestInProgress)
		{
			this._fIsSitOutOnNotEnoughPlayersExpected_bl = true;
			this.sitOut();
			this.clear();
		}
	}

	_onServerBalanceUpdatedMessage()
	{
		let lBalance_num;
		if (this.gameFieldController && this.gameStateController.info.isPlayerSitIn)
		{
			lBalance_num = this.balanceController.calcBalanceValue();
			let lWeaponsInfo_wsi = this.weaponsController.info;
			let lCurrentShotCost_num = lWeaponsInfo_wsi.i_getCurrentWeaponShotPrice();

			if (lBalance_num >= lCurrentShotCost_num && this.weaponsController.i_getInfo().ammo < lWeaponsInfo_wsi.i_getCurrentWeaponShotPriceConvertedIntoDefaultAmmo()) //[Y]TODO if currently selected is Free SW? do we really need re-buy
			{
				let lRoundResultActive_bln = this.gameFieldController.roundResultActivationInProgress || this.gameFieldController.roundResultActive;
				let lIsDefaultWeaponSelected_bln = this.weaponsController.i_getInfo().currentWeaponId === WEAPONS.DEFAULT;

				if (!lRoundResultActive_bln && (lIsDefaultWeaponSelected_bln || !APP.gameSettingsController.info.isBuyInNotMandatoryInRound))
				{
					if (this._tournamentModeInfo.isTournamentMode)
					{
						// in tournament mode auto BuyIn should never occur
					}
					else if (this._isBonusMode)
					{
						// in cash bonus mode auto BuyIn should never occur
					}
					else if (this._isFrbMode)
					{
						// in frb mode auto BuyIn should never occur
					}
					else if (APP.isBattlegroundGame)
					{
						// in battleground mode mode auto BuyIn should never occur
					}
					else
					{
						this.balanceController.tryToBuyAmmo();
					}
				}
			}
		}

		if(this._fGameStateController_gsc.info.isPlayState)
		{
			APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.GAME_IN_PROGRESS);
		}
	}

	getRoomInfoResponse(data)
	{
		//Full room info(players, enemies, weapons etc)
		this.room = {
			id: data.roomId,
			maxSeats: data.maxSeats,
			minBuyIn: data.minBuyIn,
			playerStake: (data.playerStake && data.playerStake !== -1) ? data.playerStake : this.player.stake,
			name: data.name,
			state: data.state,
			ttnx: data.ttnx,
			zombies: data.enemies,
			weapons: data.weapons, // obsolete and no longer used
			seats: data.seats,
			width: data.width,
			height: data.height,
			mapId: data.mapId,
			alreadySitInNumber: data.alreadySitInNumber,
			alreadySitInAmmoCount: data.alreadySitInAmmoCount,
			alreadySitInWin: data.alreadySitInWin,
			freezeTime: data.freezeTime,
			roundId: data.roundId
		};
		this._roomId = data.roomId;

		this._fIsFullGameInfoUpdateExpected_bl = false;

		if (data.alreadySitInNumber === -1)
		{
			this.player.sitIn = false;
			this.player.seatId = undefined;
			APP.playerController.updateMasterPlayerSeatId(undefined);
			this._fIsSitOutOnNotEnoughPlayersExpected_bl = false;
		}

		//BATTLEGROUND...
		if(data.battlegroundInfo)
		{
			this.clearPendingRequestSitin();
			this._resetWaitingBattlegroundReBuyOnGameState();

			if (
				(this.room.state == ROUND_STATE.PLAY)
				&& APP.isBattlegroundGame 
				&& this.gameFieldController.isGameplayStarted
				&& !this.battlegroundGameController.info.isPlayerClickedConfirmPlayForNextBattlegroundRound
				&& !this.gameStateController.info.isPlayerSitIn
				&& !APP.isCAFMode) 
			{
				console.log("reconnect 3");
				//APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.BATTLEGROUND_GAME_URL_NEED_UPDATED_ON_PLAY_AGAIN);
				//return;
			}

			if(this.battlegroundGameController.info.isPlayerClickedConfirmPlayForNextBattlegroundRound
				&& data.state === ROUND_STATE.WAIT
				&& this.battlegroundGameController.info.isNotFirstBattlegroundRoundAfterLoading
				&& !data.battlegroundInfo.buyInConfirmed)
			{
				this.battlegroundGameController.info.isPlayerClickedConfirmPlayForNextBattlegroundRound = false;
			}

			let lBattlegroundInfo_obj = data.battlegroundInfo;
			this.player.confirmIsSent = lBattlegroundInfo_obj.buyInConfirmed;
			this.player.battlegroundBuyInConfirmIsApproved = lBattlegroundInfo_obj.buyInConfirmed;
			this.player.battlegroundBuyInCost_num = data.battlegroundInfo.buyIn; 
			this.gameFieldController.roundResultScreenController.info.battlegroundBuyIn = this._fbattlegroundBuyInCost_num;
			this.player.battlegroundPotTaxMultiplier_num = (1 - data.battlegroundInfo.potTaxPercent * 0.01);
			if (data.alreadySitInWin > 0)
			{
				this.player.lastReceivedBattlegroundScore_int = data.alreadySitInWin;
				this.player.currentWin = data.alreadySitInWin;
			}

			if(data.battlegroundInfo.potTaxPercent === undefined)
			{
				this.player.battlegroundPotTaxMultiplier_num = 1;
			}

			let lKingOfTheHillId_int_arr = lBattlegroundInfo_obj.kingsOfHill;
			if(lKingOfTheHillId_int_arr !== undefined)
			{
				this.gameFieldController.showKingsOfTheHill(lKingOfTheHillId_int_arr);
			}

			this.gameFieldController.roundResultScreenController.view.alpha = 1;

			if (
				APP.isBattlegroundGame &&
				this.gameFieldController.roundResultActive &&
				(
					this.room.state == ROUND_STATE.QUALIFY ||
					this.room.state == ROUND_STATE.WAIT
				)
			) // in battleground in case of reconnect it is necessary to update the timers
			{
				this._requestFullGameInfo();
			}

			if (this.room.state == ROUND_STATE.QUALIFY)
			{
				this.gameFieldController.roundResultScreenController.checkActivateScreenAfterConnectionOpen();

				if (!this.gameFieldController.roundResultScreenController.isActiveOrActivationInProgress)
				{
					APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.BATTLEGROUND_PLAY_AGAIN_REQUEST, {isRRActive: this.isRoundResultDisplayInProgress(), alreadySitInNumber: data.alreadySitInNumber});
					this._requestFullGameInfo();
				}
			}
		}
		else
		{
			this.gameFieldController.roundResultScreenController.view.alpha = 0;
			this.gameFieldController.showKingsOfTheHill([-1]);
		}
		//...BATTLEGROUND

		if (this.bossModeController.bossSummoned || this.bossModeController.bossSummonedCheckRequired)
		{
			this.bossModeController.bossNumberShots = data.bossNumberShots;
		}
		this.bossModeController.bossSummonedCheckRequired = true;

		this.emit(GameScreen.EVENT_ON_ROOM_INFO_UPDATED, this.room);
		this.emit(GameScreen.EVENT_ON_ROUND_ID_UPDATED, {roundId: data.roundId});
		this.emit(GameScreen.EVENT_ON_ROOM_ID_CHANGED, {id: this.room.id});

		this.player.stake = this.room.playerStake;

		this.updatePlayersInfo(data, false);

		this.gameFieldController.startGamePlay();
		this.gameFieldController.changeState(this.room.state);

		if (this.room.state == ROUND_STATE.CLOSED) return;

		if (data.alreadySitInNumber === -1 && !this._roomHasEmptySeats)
		{
			// all seats are taken by other players -> request new room from the server
			this._onNoPlaceToSeat();
			return;
		}

		if (Object.keys(data.freezeTime).length)
		{
			this.freezeCapsuleFeatureController.i_updateFreezeTimes(data);
		}

		if ((!this.player || !this.player.sitIn) && !this._fCompensationDialogActive_bln)
		//sitIn means that we got response to SitIn request (got response == sit in was successful)
		{
			let alreadySitInNumber = data.alreadySitInNumber;
			if (alreadySitInNumber != -1 || this._canJoinRoom())
			{
				if (!APP.isBattlegroundGame)
				{
					this.sendSitIn();
				}
				else if (
					APP.isBattlegroundGame
					&& (this.gameStateController.info.isPlayerSitIn 
						||
						this.battlegroundGameController.info.isPlayerClickedConfirmPlayForNextBattlegroundRound)
				)
				{
					if (this.room.state == ROUND_STATE.QUALIFY) //if you send "SitIn" on the state QUALIFY there will be an error
					{
						this.scoreboardController.resetAndHideScoreBoard();
					}
					else if (!this.gameFieldController.roundResultScreenController.isActiveOrActivationInProgress 
							&& !this.battlegroundGameController.info.isPlayerClickedConfirmPlayForNextBattlegroundRound
							&& alreadySitInNumber != -1)
					{
						APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.BATTLEGROUND_PLAY_AGAIN_REQUEST, {isRRActive: this.isRoundResultDisplayInProgress(), alreadySitInNumber: data.alreadySitInNumber});
						this._requestFullGameInfo();
					}
					else
					{
						this.sendSitIn(true);
					}
				}
				else if (
					(
						APP.isBattlegroundGame
						&& APP.isConfirmBuyinDialogExpectedOnLastHand
					)
					||
					(
						APP.isBattlegroundGame
						&& !this.battlegroundGameController.info.isPlayerClickedConfirmPlayForNextBattlegroundRound
						&& !APP.isConfirmBuyinDialogExpectedOnLastHand
						&& !this.gameFieldController.roundResultActive
						&& !this.gameFieldController.roundResultScreenController.isActiveOrActivationInProgress
					)
				) 
				{
					APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.BATTLEGROUND_PLAY_AGAIN_REQUEST , {isRRActive: this.isRoundResultDisplayInProgress(), alreadySitInNumber: data.alreadySitInNumber});
					this._requestFullGameInfo();
				}

				if (
						this.room.seats
						&& (
								alreadySitInNumber != -1 ||
								this.room.state == ROUND_STATE.PLAY
							)
					)
				{
					this.playersSpotsController.drawAllPlayers(this.room.seats, alreadySitInNumber, false);
				}
			}
			else if (this.room.state == ROUND_STATE.PLAY)
			{
				if (this.room.seats)
				{
					this.playersSpotsController.drawAllPlayers(this.room.seats);
				}
				this.gameFieldController.showWaitScreen();
			}
			else if (this.room.state == ROUND_STATE.QUALIFY)
			{
				if (!this.transitionViewController.info.isFeatureActive)
				{
					this.gameFieldController.showWaitScreen();
				}

				if (APP.isBattlegroundGame)
				{
					this.scoreboardController.resetAndHideScoreBoard();
				}
			}
		}

		APP.on(Game.EVENT_ON_GAME_SECONDARY_SCREEN_ACTIVATED, this.onSecondaryScreenActivated, this);
		APP.on(Game.EVENT_ON_GAME_SECONDARY_SCREEN_DEACTIVATED, this.onSecondaryScreenDeactivated, this);

		this.emit(GameScreen.EVENT_ON_LASTHAND_BULLETS, {bullets: data.allBullets, alreadySitInNumber: data.alreadySitInNumber});

		if (this._isFrbMode && !APP.isBattlegroundGame)
		{
			this.balanceController && this.balanceController.resetPlayerWin();
			this.balanceController && this.balanceController.updatePlayerWin(this.room.alreadySitInWin);
		}

		this._fIsExpectedBuyInOnRoomStarted_bl = data.alreadySitInAmmoCount == 0;

		this.tryToProceedPostponedSitOut();


		if(this._fGameStateController_gsc.info.isPlayState)
		{
			APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.GAME_IN_PROGRESS);
		}

		this.emit(GameScreen.EVENT_ON_WEAPON_PAID_MULTIPLIER_UPDATE_REQUIRED, {roomId: this._roomId});
	}

	_onLobbyPlayerInfoUpdated(aEvent_obj)
	{
		let lData_obj = aEvent_obj.data;

		if(lData_obj[PlayerInfo.KEY_TOOL_TIP_ENABLED])
		{
			let lValue_bln = lData_obj[PlayerInfo.KEY_TOOL_TIP_ENABLED].value;
			this.battlegroundTutorialController.showAgain = lValue_bln;
			this.battlegroundTutorialController.isTutorialShowed = false;
		}
	}

	_onGamePlayerInfoUpdated(aEvent_obj)
	{
		this.player.stake = APP.playerController.info.currentStake;

		let lData_obj = aEvent_obj.data;

		if(lData_obj[PlayerInfo.KEY_TOOL_TIP_ENABLED])
		{
			let lValue_bln = lData_obj[PlayerInfo.KEY_TOOL_TIP_ENABLED].value;
			this.battlegroundTutorialController.showAgain = lValue_bln;
		}
	}

	_needRetryRebuy()
	{
		this._onReBuyAmmoRetryTime();
	}

	_canJoinRoom()
	{
		return this._roomHasEmptySeats
				&& this._isRoomSitItAllowedState;
	}

	get _roomHasEmptySeats()
	{
		return this.room.seats.length < this.room.maxSeats;
	}

	get _isRoomSitItAllowedState()
	{
		let state = this.gameStateController.info.gameState;
		return (state === ROUND_STATE.WAIT || state === ROUND_STATE.PLAY);
	}

	_showBlur()
	{
		if (APP.isMobile) return;
		this.gameFieldController.showBlur();
	}

	_hideBlur()
	{
		if (APP.isMobile) return;
		this.gameFieldController.checkBlur();
	}

	onSecondaryScreenActivated()
	{
		if (this.gameFieldController)
		{
			this.fireSettingsController.hideScreen();
			this.gameFieldController.lobbySecondaryScreenActive = true;
			this.showBlur();
		}
	}

	onSecondaryScreenDeactivated()
	{
		if (this.gameFieldController)
		{
			this.gameFieldController.lobbySecondaryScreenActive = false;
			this.hideBlur();
			this.gameFieldController.checkBlur();
		}

		if (APP.isBattlegroundGame)
		{
			if (this.battlegroundTutorialController.showAgain 
				&& !this.battlegroundTutorialController.isTutorialShowed 
				&& !this.gameFieldController.roundResultActive)
			{
				this._onTimeToShowTutorial(null, true);
			}
			else if(!this.battlegroundTutorialController.showAgain)
			{
				this.battlegroundTutorialController.hideTutorial();
			}
		}
	}

	closeRoom()
	{
		if (this._fIsPaused_bl)
		{
			this.onRoomUnpaused();
			this._fIsPaused_bl = false;
		}

		if (this.gameFieldController)
		{
			this.emit(GameScreen.EVENT_ON_CLOSE_ROOM);
			this.gameFieldController.closeRoom();
			this.clear();
		}

		this._fCompensationDialogActive_bln = false;
		this._fFrbEndedPostponedData_obj = null;
		this._fBonusRoundEndedPostponedData_obj = null;

		this._fWeaponsController_fwsc.i_clearAll();
	}

	onRoomClosed()
	{
		this._onCloseRoomConfirmed();
	}

	_onCloseRoomConfirmed()
	{
		this.clearAllButLobbyInfo();

		let lIsSwitchToLobbyExpected_bl = this._fBackToLobbyRequired_bl && !this._fStartGameURL_str;
		
		APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.ROOM_CLOSED, { switchToLobbyExpected: lIsSwitchToLobbyExpected_bl });

		if (APP.currentWindow.gameFrbController.info.frbEnded)
		{
			this.emit(GameScreen.EVENT_ON_FRB_ENDED_COMPLETED);
		}
		if (this.gameFieldController)
		{
			this.gameFieldController.onCloseRoom();
		}

		if (lIsSwitchToLobbyExpected_bl)
		{
			this._emitBackToLobbyEvent();
		}
		else if (this._fStartGameURL_str)
		{
			this.start(this._fStartGameURL_str);
			this._fStartGameURL_str = null;

			this._destroyScreenShowTimer();
			this._screenShowTimer = new Timer(this._onScreenShowTimerCompleted.bind(this), 10);
		}
	}

	_onScreenShowTimerCompleted()
	{
		this._destroyScreenShowTimer();

		this.gameFieldController.screenField.show();
	}

	_destroyScreenShowTimer()
	{
		if (this._screenShowTimer)
		{
			this._screenShowTimer.destructor();
			this._screenShowTimer = null;
		}
	}

	_onCloseRoomDenied()
	{
		if (this.player.sitIn)
		{
			if (!APP.webSocketInteractionController.isSitoutRequestInProgress)
			{
				this.sitOut();
			}
		}
		else
		{
			this.sendCloseRoom();
		}
	}

	sitOut()
	{
		this.emit(GameScreen.EVENT_ON_RESET_TARGET);

		this.emit(GameScreen.EVENT_ON_SIT_OUT_REQUIRED);
	}

	updateRoomInfo(aData_obj)
	{
		if (this.gameFieldController && this.gameFieldController.isGameplayStarted())
		{
			this._fResumeInProcess_bl = true;

			if (aData_obj && aData_obj.startGameUrl)
			{
				this._fStartGameURL_str = aData_obj.startGameUrl;

				if (APP.webSocketInteractionController.reconnectInProgress)
				{
					this.player.sitIn = false;
					this.start(this._fStartGameURL_str);
					this._fStartGameURL_str = null;
					return;
				}

				if (this.gameStateController.info.isPlayerSitIn)
				{
					this.sitOut();
				}
				else
				{
					if (this.room)
					{
						this.closeRoom();
					}
					else
					{
						if (this._fIsPaused_bl)
						{
							this.onRoomUnpaused();
							this._fIsPaused_bl = false;
						}

						this.start(this._fStartGameURL_str);
						this._fStartGameURL_str = null;
					}
				}
			}
			else
			{
				if (this._fIsPaused_bl)
				{
					this.onRoomUnpaused();
					this._fIsPaused_bl = false;
				}

				this._requestFullGameInfo();
			}
		}
		else if (aData_obj && aData_obj.startGameUrl)
		{
			this.start(aData_obj.startGameUrl);
		}
	}

	clearPendingRequestSitin()
	{
		this.player.sitInIsSent = false;
	}

	tryToProceedPostponedSitOut(aOptForced_bl)
	{
		if (this._fPostponedSitOutData_obj)
		{
			this.sitOutResponse(this._fPostponedSitOutData_obj, aOptForced_bl);
			this.gameFieldController.onFRBEnded();
		}
	}

	sitOutResponse(data, aOptForced_bl = false)
	{
		APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.ON_SIT_OUT_RESPONSE, data);

		if (data.rid != -1 || APP.playerController.info.seatId == data.id || this.room.alreadySitInNumber == data.id)
		{
			this.room.alreadySitInNumber = -1;
			
			if (APP.isBattlegroundGame)
			{
				this.battlegroundGameController.info.isPlayerClickedConfirmPlayForNextBattlegroundRound = false;
				this.player.battlegroundBuyInConfirmIsApproved = false;

				if (this._fIsSitOutOnNotEnoughPlayersExpected_bl)
				{
					this._fIsSitOutOnNotEnoughPlayersExpected_bl = false;
					this.removePlayer(data.id);
					this.changeWeaponToDefaultImmediatelyAfterSitOut(); //we need to do this BEFORE main player spot to be removed
					this.playersSpotsController.removeMasterPlayerSpot();
					this._clearAmmo();
					this.player.sitIn = false;
					this.player.seatId = -1;
					APP.playerController.updateMasterPlayerSeatId(undefined);
					return;
				}
				if(this._fIsCountDownCanceled)
				{
					this._fIsCountDownCanceled = null;
					this.removePlayer(data.id);
					this.changeWeaponToDefaultImmediatelyAfterSitOut(); //we need to do this BEFORE main player spot to be removed
					this.playersSpotsController.removeMasterPlayerSpot();
					this._clearAmmo();
					this.player.sitIn = false;
					this.player.seatId = -1;
					APP.playerController.updateMasterPlayerSeatId(undefined);
					return;
				}
			}

			if ((this._isFRBEnded || this._isBonusRoundEnded) && !this.gameFieldController.roundResultActive && !aOptForced_bl)
			{
				this._fPostponedSitOutData_obj = data;
				return;
			}

			this._fPostponedSitOutData_obj = null;

			this.removePlayer(data.id);
			this.player.sitIn = false;

			this.changeWeaponToDefaultImmediatelyAfterSitOut(); //we need to do this BEFORE main player spot to be removed
			this.playersSpotsController.removeMasterPlayerSpot();
			if (!APP.isBattlegroundGame) //we don't have RR for SP yet, but we don't need it in BTG now
			{
				this.gameFieldController.roundResultScreenController.resetScreenAppearing();
			}

			if (this._fStartGameURL_str || this._fBackToLobbyRequired_bl)
			{
				this.closeRoom();
			}

			this._clearAmmo();

			let tournamentModeInfo = this._tournamentModeInfo;
			if (tournamentModeInfo.isTournamentMode && tournamentModeInfo.isTournamentOnServerCompletedState)
			{
				// actions (force sitout dlg, sw compensation dlg, back to lobby) not required, because tournament finished/cancelled message is already on screen
			}
			else if (this._isBonusMode && this.gameBonusController.info.bonusCompletionData != null)
			{
				APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.EVENT_ON_BONUS_STATUS_CHANGED_RESPONSE,
					{
						messageData: this.gameBonusController.info.bonusCompletionData,
						nextRoomId: this.gameBonusController.info.nextRoomId,
						nextModeFRB: data.hasNextFrb
					}
				);
			}
			else if (this._isFRBEnded && this._fGameFrbController_gfrbc.info.bonusCompletionData != null)
			{
				APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.ON_FRB_ENDED_RESPONSE,
					{
						messageData: this._fGameFrbController_gfrbc.info.bonusCompletionData,
						nextRoomId: this._fGameFrbController_gfrbc.info.nextRoomId
					}
				);
			}
			else if	(this._isForceSitOut(data) && (!this.room || (this.room.state != ROUND_STATE.QUALIFY)))
			{
				if(
					(
						!this._isFRBEnded 
						|| 
						(
							!this._isFrbMode 
							&& (!this.room || (this.room.state != ROUND_STATE.QUALIFY))
						)
					)
					&&
					!APP.isBattlegroundGame
				)
				{
					this.emit(GameScreen.EVENT_ON_FORCE_SIT_OUT_REQUIRED, {roomId: this.room.id});
					this._fForseSitOutInProgress = true;
				}
			}
			else
			{
				if (!APP.isBattlegroundGame) this.goBackToLobby();
			}

			APP.playerController.updateMasterPlayerSeatId(undefined);
			this.player.seatId = -1;
		}
		else
		{
			this.removePlayer(data.id);

			if (this._canJoinRoom() && this.player.seatId === undefined)
			{
				if (!APP.isBattlegroundGame
					|| this.battlegroundGameController.info.isPlayerClickedConfirmPlayForNextBattlegroundRound)
				{
					this.sendSitIn();
				}
			}
		}
	}

	get isForcedSitOutInProgress()
	{
		return this._fForseSitOutInProgress;
	}

	get _isFRBEnded()
	{
		return this._fFrbEndedPostponedData_obj;
	}

	get _isBonusRoundEnded()
	{
		return this._fBonusRoundEndedPostponedData_obj;
	}

	_isForceSitOut(aData_obj)
	{
		return aData_obj.rid == -1 && APP.playerController.info.seatId == aData_obj.id;
	}

	sitInResponse(data)
	{
		if (this.isBackToLobbyRequired)
		{
			this.sitOut();
			return;
		}

		APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.ON_SIT_IN_RESPONSE, data);
		
		if (this._fGameStateController_gsc.info.isPlayState)
		{
			APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.GAME_IN_PROGRESS);
		}

		if (data.rid == -1)
		{
			var seat = {
				id: data.id,
				seatId: data.id,
				nickname: data.nickname,
				avatarId: data.avatarId,
				avatar: data.avatar,
				enterDate: data.enterDate,
				totalScore: 0,
				currentScore: 0,
				rankPonts: 0,
				weapon:{
					id: data.specialWeaponId
				}
			};
			this.addPlayer(seat);

			if (
					APP.playerController.info.seatId === undefined
					&& !this._roomHasEmptySeats
					&& !APP.webSocketInteractionController.hasDelayedRequests(CLIENT_MESSAGES.SIT_IN)
					&& !APP.webSocketInteractionController.hasUnRespondedRequest(CLIENT_MESSAGES.SIT_IN)
				)
			{
				// all seats are taken by other players -> request new room from the server
				this._onNoPlaceToSeat();
				return;
			}

			this.emit(GameScreen.EVENT_ON_PLAYER_ADDED, {seatId: data.id});

			this.playersSpotsController.drawAllPlayers(this.room.seats);
		}
		else
		{
			APP.playerController.updateMasterPlayerSeatId(data.id);

			let lAvatarData_obj = {
				border: data.avatar.borderStyle,
				hero: data.avatar.hero,
				back: data.avatar.background
			};
			APP.playerController.info.setPlayerInfo(PlayerInfo.KEY_AVATAR, {value: lAvatarData_obj});
			APP.playerController.info.setPlayerInfo(PlayerInfo.KEY_NICKNAME, {value: data.nickname});

			this.player.seatId = data.id;
			this.player.nickname = data.nickname;
			this.player.currentScore = 0;
			this.player.totalScore = 0;
			this.player.totalWin = data.frbBalance || 0;
			this.player.avatarId = data.avatarId;
			this.player.avatar = data.avatar;
			this.player.enterDate = data.enterDate;
			this.player.sitIn = true;
			this.player.confirmIsSent = false;
			this.player.battlegroundBuyInConfirmIsApproved = false;
			this.player.sitInIsSent = false;
			if (!this.isPaused)
			{
				this.playersSpotsController.addMasterPlayerSpot(this.player);
				this.playersSpotsController.drawAllPlayers(this.room.seats, data.id /*master seat*/, true);
			}
			this.gameFieldController.updatePlayerScore(this.player);

			this.gameFieldController.resetWaitBuyIn();
			this.gameFieldController.onBuyAmmoResponse();

			this.gameFieldController.removeWaitScreen();
			this.gameFieldController.validateState();
			this.gameFieldController.isWinLimitExceeded = false;

			if (this.weaponsController.info.ammo == 0)
			{
				if (this.gameStateController.info.gameState == ROUND_STATE.PLAY)
				{
					this.balanceController.tryToBuyAmmo();
				}
				else
				{
					this.gameFieldController.tryRoundResultBuyAmmoRequestAllowing(); // to be able to send BuyIn after state change to PLAY
				}
			}
		}

		this.emit(GameScreen.EVENT_ON_PLAYER_DATA_UPDATED, {id: data.id});
	}

	removePlayer(id)
	{
		if (!this.room || !this.room.seats)
		{
			return;
		}
		let removed = false;
		for (let i = 0; i < this.room.seats.length; i ++)
		{
			if (this.room.seats[i].id == id)
			{
				this.room.seats.splice(i, 1);
				removed = true;
				break;
			}
		}

		if (removed)
		{
			this.emit(GameScreen.EVENT_ON_PLAYER_REMOVED, {seatId: id});
			this.playersSpotsController.drawAllPlayers(this.room.seats);
		}
	}

	addPlayer(seat)
	{
		var check = false;
		for (let i = 0; i < this.room.seats.length; i ++)
		{
			if (this.room.seats[i].id == seat.id)
			{
				this.room.seats[i] = seat;
				check = true;
				break;
			}
		}
		if (!check)
		{
			this.room.seats.push(seat);
		}

		this.infoPanelView.update();
	}

	get restoreAfterUnseasonableRequestInProgress()
	{
		return this._restoreAfterUnseasonableRequest;
	}

	get restoreAfterLagsInProgress()
	{
		return this._restoreAfterLagsInProgress;
	}

	_requestFullGameInfo()
	{
		if (APP.isBattlegroundGame
			&& this._fIsFullGameInfoUpdateExpected_bl)
		{
			return;
		}

		if (
			APP.webSocketInteractionController.hasDelayedRequests(CLIENT_MESSAGES.GET_FULL_GAME_INFO)
			|| APP.webSocketInteractionController.hasUnRespondedRequest(CLIENT_MESSAGES.GET_FULL_GAME_INFO)
			|| !APP.pendingOperationController.info.isPendingOperationProgressStatusDefined
		)
		{
			return;
		}

		if (
			this.gameStateController.info.gameState !== ROUND_STATE.PLAY
			&&
				(
					APP.isDialogActive(DIALOG_ID_FRB) ||
					APP.isDialogActive(DIALOG_ID_BONUS)
				)
		)
		{
			return;
		}

		this._fIsFullGameInfoUpdateExpected_bl = true;
		this.emit(GameScreen.EVENT_ON_FULL_GAME_INFO_REQUIRED);
	}

	fullGameInfoResponse(data)
	{
		this._fIsFullGameInfoUpdateExpected_bl = false;

		APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.FULL_GAME_INFO_UPDATED, data);

		
		this.room.roundId = data.roundId;
		this.emit(GameScreen.EVENT_ON_ROUND_ID_UPDATED, {roundId: data.roundId});

		let l_gwsic = APP.webSocketInteractionController;
		if (
				this.player.sitIn
				&& !this._fGameStateController_gsc.info.isPlayerSitIn
				&& !l_gwsic.isSitoutRequestInProgress
			)
		{
			// sitout on server occurred but SitOutResponse was not sent to game client https://jira.dgphoenix.com/browse/MQBG-541
			this.player.sitIn = false;
			this.player.seatId = undefined;
			APP.playerController.updateMasterPlayerSeatId(undefined);
		}

		if (this._restoreAfterUnseasonableRequest)
		{
			this._restoreAfterUnseasonableRequest = false;
			this.restoreAfterUnseasonableRequest(data);
			return;
		}

		if (!this._fResumeInProcess_bl && !this._restoreAfterLagsInProgress) return;

		if (this.bossModeController.bossSummoned || this.bossModeController.bossSummonedCheckRequired)
		{
			this.bossModeController.bossNumberShots = data.bossNumberShots;
		}
		this.bossModeController.bossSummonedCheckRequired = true;
		this._fIsPaused_bl = false;
		this._restoreAfterLagsInProgress = false;

		if (data.mapId !== undefined && data.mapId !== this.room.mapId)
		{
			this.room.mapId = data.mapId;
		}
		if (data.state !== undefined && data.state !== this.room.state)
		{
			this.room.state = data.state;
			this.emit(GameScreen.EVENT_ON_NEW_ROUND_STATE, {state: (data.state == ROUND_STATE.PLAY)}); // (data.state == ROUND_STATE.PLAY) because GameFieldController emits EVENT_ON_NEW_ROUND_STATE event with true/false value meaning is round in progress or not on client side (pending animations etc), and GameStateController expects Boolean in GameScreen.EVENT_ON_NEW_ROUND_STATE
		}

		this.updatePlayersInfo(data, true);

		if (APP.playerController.info.seatId === undefined && !this._roomHasEmptySeats)
		{
			// all seats are taken by other players -> request new room from the server
			this._onNoPlaceToSeat();
			return;
		}

		if (this._canJoinRoom() && this.player.seatId === undefined)
		{
			if (!APP.isBattlegroundGame)
			{
				if (this.battlegroundGameController.info.isPlayerClickedConfirmPlayForNextBattlegroundRound)
				{
					if (
							this._fGameStateController_gsc.info.isPlayState
							&& !this._fGameStateController_gsc.info.isPlayerSitIn
							&& !APP.isCAFMode
						)
					{
						console.log("reconect 7 ");
						APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.BATTLEGROUND_GAME_URL_NEED_UPDATED_ON_PLAY_AGAIN);
						return;
					}
					else
					{
						this.sendSitIn();
					}
				}
			}
		}
		else if (!this.player.sitIn && this.player.seatId === undefined && !this._fForseSitOutInProgress)
		{
			if (!this.transitionViewController.info.isFeatureActive || this.room.state == ROUND_STATE.PLAY)
			{
				this.gameFieldController.showWaitScreen();
			}
		}

		this.room.freezeTime = data.freezeTime;
		if (Object.keys(data.freezeTime).length)
		{
			this.freezeCapsuleFeatureController.i_updateFreezeTimes(data);
		}

		this.emit(GameScreen.EVENT_ON_ROOM_INFO_UPDATED, this.room);
		this.gameFieldController.redrawMap();

		if (this.room.state === ROUND_STATE.PLAY)
		{
			this.gameFieldController.addRoomGradient();
		}

		this.gameFieldController.showRoom(this.room.state);
		
		this.emit(GameScreen.EVENT_ON_LASTHAND_BULLETS, {bullets: data.allBullets});

		this.onRoomUnpaused();

		if (data.seats && this._isFrbMode && !this._isFRBEnded && !APP.isBattlegroundGame)
		{
			let roundWin = 0;
			for (let seat of data.seats)
			{
				if (seat.id == this.player.seatId)
				{
					roundWin = seat.roundWin;
				}
			}
			this.balanceController.resetPlayerWin();
			this.balanceController.updatePlayerWin(roundWin);
		}

		this.emit(GameScreen.EVENT_ON_WEAPON_PAID_MULTIPLIER_UPDATE_REQUIRED, {roomId: this._roomId});
	}

	_destroyRoomUnpauseTimer()
	{
		if (this._roomUnpauseTimer)
		{
			this._roomUnpauseTimer.destructor();
			this._roomUnpauseTimer = null;
		}
	}

	restoreAfterUnseasonableRequest(data)
	{
		this.room.mapId = data.mapId;
		this.room.state = data.state;

		this.updatePlayersInfo(data, false);

		this.gameFieldController.startGamePlay();
		this.gameFieldController.changeState(this.room.state);
		if (this.room.state == ROUND_STATE.CLOSED) return;

		if (this._canJoinRoom() && !this.player.sitIn)
		{
			if (APP.isBattlegroundGame)
			{
				if (this.battlegroundGameController.info.isPlayerClickedConfirmPlayForNextBattlegroundRound)
				{
					if (
							this._fGameStateController_gsc.info.isPlayState
							&& !this._fGameStateController_gsc.info.isPlayerSitIn
							&& !APP.isCAFMode
						)
					{
						console.log("reconnect 4");
						APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.BATTLEGROUND_GAME_URL_NEED_UPDATED_ON_PLAY_AGAIN);
						return;
					}
					else
					{
						this.sendSitIn();
					}
				}
			}
			else
			{
				this.sendSitIn();
			}
		}
		else
		{
			if (this.player.seatId === undefined)
			{
				if (!this.transitionViewController.info.isFeatureActive || this.room.state == ROUND_STATE.PLAY)
				{
					this.gameFieldController.showWaitScreen();
				}
			}
			else
			{
				this.playersSpotsController.addMasterPlayerSpot(this.player);
			}
		}

		if (this.room.seats)
		{
			this.playersSpotsController.drawAllPlayers(this.room.seats);
		}

		if (
				this.room.state == ROUND_STATE.QUALIFY
				|| this.room.state == ROUND_STATE.WAIT
			)
		{
			this.gameFieldController.blurUI();
		}

		this.emit(GameScreen.EVENT_ON_LASTHAND_BULLETS, {bullets: data.allBullets});

		this.gameFieldController.resetBalanceFlags();

		this.emit(GameScreen.EVENT_ON_GAME_RESTORED_AFTER_UNSEASONABLE_REQUEST);
	}

	onRoomPaused()
	{
		if (this._fIsPaused_bl)
		{
			return;
		}

		if (this.gameFieldController && this.gameFieldController.isGameplayStarted())
		{
			this.gameFieldController.spot && this.gameFieldController.spot.onRoomPaused();
			this.fireController.i_onRoomPaused();
			this.emit(GameScreen.EVENT_ON_ROOM_PAUSED);
			this._fIsPaused_bl = true;
			this._fResumeInProcess_bl = false;
			this._restoreAfterLagsInProgress = false;

			this.gameFieldController.hideRoom();
			this.gameFieldController.screenField.hide();
			this.clear();
			
			this.subloadingController.i_showLoadingScreen();
		}
	}

	onRoomUnpaused()
	{
		this.gameFieldController.spot && this.gameFieldController.spot.onRoomUnpaused();
		this.fireController.i_validateCursor();

		if (!this._fIsPaused_bl)
		{
			return;
		}

		APP.forceRendering();

		this._destroyRoomUnpauseTimer();

		this.emit(GameScreen.EVENT_ON_ROOM_UNPAUSED);

		if (this.gameFieldController && this.gameFieldController.isGameplayStarted())
		{
			this.gameFieldController.screenField.show();
		}
	}

	_onRoomInfoUpdated()
	{
		this.subloadingController.i_hideLoadingScreen();
	}

	_onBattlegroundBuyInConfirmRequestApproved()
	{
		this.player.battlegroundBuyInConfirmIsApproved = true;
		this.sendSitIn();
	}

	sendSitIn(aBattlegroundPlayAgainIgnore_bl=false)
	{
		let l_poi = APP.pendingOperationController.info;
		if (
				this.player.sitInIsSent
				|| l_poi.isPendingOperationStatusCheckInProgress
			)
		{
			return;
		}

		//SEND CONFIRM BEFORE SIT IN IN BATTLEGROUND MODE...
		if (
			APP.isBattlegroundGame &&
			!this.player.battlegroundBuyInConfirmIsApproved
		)
		{
			if (!this.battlegroundGameController.info.isPlayerClickedConfirmPlayForNextBattlegroundRound)
			{
				if (!this.gameFieldController.roundResultScreenController.info.isScreenActive && !aBattlegroundPlayAgainIgnore_bl)
				{
					APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.BATTLEGROUND_PLAY_AGAIN_REQUEST, {isRRActive: this.isRoundResultDisplayInProgress()});
				}
			}
			else if(!this.player.confirmIsSent)
			{
				this.player.confirmIsSent = true;
				this.emit(GameScreen.EVENT_BATTLEGROUND_CONFIRM_BUY_IN_REQUIRED, {});
				return;
			}
		}
		//...SEND CONFIRM BEFORE SIT IN IN BATTLEGROUND MODE

		this.player.sitInIsSent = true;
		this.emit(GameScreen.EVENT_ON_SIT_IN_REQUIRED, {stake: this.player.stake});

		let lIsBattlegroundCountDownRequired_bl = (
			APP.isBattlegroundGame &&
			!this.isRoundResultDisplayInProgress() &&
			this.battlegroundGameController.info.isPlayerClickedConfirmPlayForNextBattlegroundRound);

		this.emit(GameScreen.EVENT_ON_SIT_IN_COUNT_DOWN_REQUIRED, {isBattlegroundCountDownRequired: lIsBattlegroundCountDownRequired_bl});
	}

	onChangeMap(data)
	{
		if (this.room.mapId && this.room.mapId !== data.mapId)
		{
			this.room.freezeTime = null;
			this.room.mapId = data.mapId;
			this.emit(GameScreen.EVENT_ON_ROOM_INFO_UPDATED, this.room);
		}
	}

	getExistEnemy(id)
	{
		return this.enemiesController.getExistEnemy(id);
	}

	getBullets()
	{
		return this.gameFieldController ? this.gameFieldController.bullets : null;
	}

	changeWeaponToDefaultImmediatelyAfterSitOut()
	{
		this.gameFieldController.changeWeaponToDefaultImmediatelyAfterSitOut();
	}

	_onBuyAmmoRequired()
	{
		if (this._fForseSitOutInProgress)
		{
			return;
		}

		if (!this.player.sitIn)
		{
			this.sendSitIn();
		}
		else
		{
			this.sendBuyIn();
		}
	}

	_onServerBalanceUpdated()
	{
		this.gameFieldController.redrawAmmoText();
	}

	sendBuyIn()
	{
		if(APP.isBattlegroundGame)
		{
			return;
		}

		if (
				!this.gameFieldController.isAmmoBuyingInProgress
				&& !APP.pendingOperationController.info.isPendingOperationStatusCheckInProgress
				&& !this.buyAmmoRetryingController.info.isRetryDialogActive
			)
		{
			this.emit(GameScreen.EVENT_ON_BUY_IN_REQUIRED);
			this.gameFieldController.waitBuyIn = true;
		}
	}

	onBuyInResponse(data)
	{
		APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.BUY_IN_RESPONSE_RECIEVED);

		this._updateAmmo(data.ammoAmount);

		this._fIsExpectedBuyInOnRoomStarted_bl = false;

		this.gameFieldController.resetWaitBuyIn();
		this.gameFieldController.onBuyAmmoResponse();
	}

	sendReBuy()
	{
		if (APP.isBattlegroundGame 
			&& this.gameStateController.info.gameState == ROUND_STATE.QUALIFY)
		{
			if (!this._fBattlegroundIsNeedReBuyOnGameState_bl)
			{
				this._fBattlegroundIsNeedReBuyOnGameState_bl = true;
				this.gameStateController.on(GameStateController.EVENT_ON_GAME_STATE_CHANGED, this._onGameStateChangedForBattlegroundReBuy, this);
			}
			return;
		}

		let lWeaponsInfo_wsi = this.weaponsController.i_getInfo();
		let lPlayerInfo_pi = APP.playerController.info;
		let lUnpresentedWin_num = lPlayerInfo_pi.unpresentedWin;
		let lShotCost_num = lPlayerInfo_pi.currentStake;
		let lRealAmmoCost_num = lWeaponsInfo_wsi.realAmmo * lShotCost_num;

		if (
				!this.gameFieldController.isAmmoBuyingInProgress
				&& !APP.pendingOperationController.info.isPendingOperationStatusCheckInProgress
				&& !this.buyAmmoRetryingController.info.isRetryDialogActive
				&& lWeaponsInfo_wsi.ammo == 0 // condition added due to https://jira.dgphoenix.com/browse/MQCMN-222
				&& (lUnpresentedWin_num+lRealAmmoCost_num) <= lShotCost_num
			)
		{
			this.emit(GameScreen.EVENT_ON_RE_BUY_REQUIRED);
		}
	}

	_onGameStateChangedForBattlegroundReBuy(e)
	{
		if (this._fBattlegroundIsNeedReBuyOnGameState_bl && e.value == ROUND_STATE.WAIT)
		{
			this._fBattlegroundIsNeedReBuyOnGameState_bl = false;

			if (this.player.sitIn)
			{
				this.sendReBuy();
			}
			else
			{
				console.log("reconnect 4");
				APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.BATTLEGROUND_GAME_URL_NEED_UPDATED_ON_PLAY_AGAIN);
				this.scoreboardController.resetAndHideScoreBoard();
			}

			this.gameStateController && this.gameStateController.off(GameStateController.EVENT_ON_GAME_STATE_CHANGED, this._onGameStateChangedForBattlegroundReBuy, this);
			return;
		}

		if (e.value == ROUND_STATE.PLAY || e.value == ROUND_STATE.CLOSED)
		{
			this._fBattlegroundIsNeedReBuyOnGameState_bl = false;
			this.gameStateController && this.gameStateController.off(GameStateController.EVENT_ON_GAME_STATE_CHANGED, this._onGameStateChangedForBattlegroundReBuy, this);
		}

	}

	_resetWaitingBattlegroundReBuyOnGameState()
	{
		if (APP.isBattlegroundGame && this._fBattlegroundIsNeedReBuyOnGameState_bl) //if we opened a new battleground room, then no need to send a rebuy
		{
			this._fBattlegroundIsNeedReBuyOnGameState_bl = false;
			this.gameStateController && this.gameStateController.off(GameStateController.EVENT_ON_GAME_STATE_CHANGED, this._onGameStateChangedForBattlegroundReBuy, this);
		}
	}

	onReBuyResponse(data)
	{
		APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.RE_BUY_RESPONSE_RECIEVED);

		if (APP.isBattlegroundGame)
		{
			this._updateAmmo(0 );
		}
		else
		{
			this._updateAmmo(data.ammoAmount);
		}


		this.gameFieldController.onReBuyAmmoResponse();
	}

	_onTimeToConvertBalanceToAmmo(event)
	{
		this._updateAmmo(event.ammoAmount);
	}

	_updateAmmo(ammoAmount)
	{
		this.balanceController.updateAmmo(ammoAmount);
	}

	_clearAmmo()
	{
		this.balanceController.clearAmmo();
	}

	static normalizeAngle(angle)
	{
		while (angle < 0) angle += DOUBLE_PI;
		while (angle > DOUBLE_PI) angle -= DOUBLE_PI;
		return angle;
	}

	updateTimeToNextState(delta)
	{
		if (!this.room) return;

		if (this.room.ttnx > 0)
		{
			this.room.ttnx -= delta;
			if (this.room.ttnx < 0) this.room.ttnx = -1;
		}
	}

	tickGamefield(delta, realDelta)
	{
		if (this.gameFieldController)
		{
			this.gameFieldController.tick(delta, realDelta);
		}
	}

	tick(delta, realDelta)
	{
		//STUBS MODE SYNC...
		let lWebSocketController_wsc = APP.webSocketInteractionController;

		if(
			lWebSocketController_wsc.isStubsMode &&
			lWebSocketController_wsc.isStubsMode()
			)
		{
			delta = 17;		
			if(lWebSocketController_wsc._fNextStubIndex_int < 5) delta = 30;
			realDelta = delta;

			lastTickOccurTime = serverTime;
			serverTime+= delta
			accurateServerTime = serverTime;

			let lNextStubTime_num = APP.webSocketInteractionController.getNextSubTime();

			if(serverTime > lNextStubTime_num)
			{
				let lOffSet_num = serverTime - lNextStubTime_num;

				delta -= lOffSet_num;

				serverTime = lNextStubTime_num;
				lastTickOccurTime = serverTime;
				accurateServerTime = serverTime;
				realDelta = delta;
			}

			if(delta >= 0)
			{
				this.enemiesController.tick();
				this.tickGamefield(delta, realDelta);
			}

			this.emit(GameScreen.EVENT_ON_TICK_OCCURRED, {delta: delta, realDelta: realDelta});
			return;
		}
		//...STUBS MODE SYNC



		let lCurTime_int = Date.now();

		let clientTimeDiffDelta = lastTickOccurTime !== undefined ? (lCurTime_int - lastTickOccurTime) : ~~realDelta;
		let serverTimeRecievedDelta;
		if (serverLastMessageRecieveTime !== undefined)
		{
			serverTimeRecievedDelta = lCurTime_int-serverLastMessageRecieveTime;
			clientTimeDiffDelta = serverTimeRecievedDelta;
		}
		serverLastMessageRecieveTime = undefined;
		clientTimeDiff += clientTimeDiffDelta;


		// SMOOTH RECOVERY...
		if (this._fClientServerTimeCorrectionHops_num === 0)
		{
			smoothClientTimeDiff += clientTimeDiffDelta;
		}
		else
		{
			smoothClientTimeDiff += clientTimeDiffDelta + this._fClientServerTimeCorrectionValue_num;
			--this._fClientServerTimeCorrectionHops_num;
		}
		// ...SMOOTH RECOVERY

		// accurate time...
		let accurateClientTimeDiffDelta = lastTickOccurTime !== undefined ? (lCurTime_int - lastTickOccurTime) : ~~realDelta;
		
		let accurateServerTimeRecievedDelta;
		if (accurateServerLastMessageRecieveTime !== undefined)
		{
			accurateServerTimeRecievedDelta = lCurTime_int-accurateServerLastMessageRecieveTime;
			accurateClientTimeDiffDelta = accurateServerTimeRecievedDelta;
		}
		accurateServerLastMessageRecieveTime = undefined;
		accurateClientTimeDiff += accurateClientTimeDiffDelta;
		// ...accurate time

		lastTickOccurTime = lCurTime_int;

		this.updateTimeToNextState(delta);

		let tournamentModeInfo = this._tournamentModeInfo;
		if (realDelta !== undefined && this._ready && realDelta > MAX_TICK_DELAY)
		{
			if (
					this.gameFieldController
					&& this.gameFieldController.isGameplayStarted()
					&& this.gameFieldController.screenField.visible
					&& !tournamentModeInfo.isTournamentOnServerCompletedState
				)
			{
				if (this.gameFieldController)
				{
					this.gameFieldController.clearRoom(false, false, true);
					this.fireSettingsController.hideScreen();
				}
				this.clear();

				this._restoreAfterLagsInProgress = true;

				this.emit(GameScreen.EVENT_ON_ROOM_RESTORING_ON_LAGS_STARTED);

				this._requestFullGameInfo();
			}
			return;
		}

		this.enemiesController.tick();
		this.fireController.tick(delta, realDelta);
		this.tickTarget();
		this.tickGamefield(delta, realDelta);

		this.emit(GameScreen.EVENT_ON_TICK_OCCURRED, {delta: delta, realDelta: realDelta});
	}

	tickTarget()
	{
		this._fTargetingController_tc && this._fTargetingController_tc.tick();
	}

	static getServerTime()
	{
		return serverTime;
	}

	static getClientTimeDiff()
	{
		return clientTimeDiff;
	}

	static getSmoothClientTimeDiff()
	{
		return smoothClientTimeDiff;
	}

	static getSmoothServerTime()
	{
		return smoothServerTime;
	}

	_onAssetsLoadingError()
	{
		this.gameFieldController && this.gameFieldController.clearRoom();
		this.clear();
		this.clearAllButLobbyInfo();
	}

	_onWebglContextLost()
	{
		this.gameFieldController && this.gameFieldController.clearRoom();
		this.clear();
		this.clearAllButLobbyInfo();
	}

	_handleErrorCode(serverData, requestData, errorType)
	{
		if (GameWebSocketInteractionController.isFatalError(errorType))
		{
			APP.logger.i_pushError(`GameScreen. ${errorType}: ${JSON.stringify(serverData)}`);
			console.error("GameScreen. Error handle.", serverData);
			console.log("GameScreen. ServerError. " + JSON.stringify(serverData));
			this.gameFieldController && this.gameFieldController.clearRoom();
			this.clear();
			this.clearAllButLobbyInfo();
			return;
		}
		else
		{
			APP.logger.i_pushWarning(`GameScreen. Error handle: ${JSON.stringify(serverData)}`);
			console.warn("GameScreen. Error handle.", serverData);
			console.log("GameScreen. ServerError. " + JSON.stringify(serverData));
		}

		var isRoundNotStartedError = false;

		switch (serverData.code)
		{
			case GameWebSocketInteractionController.ERROR_CODES.ROOM_NOT_OPEN:
				if (APP.isBattlegroundGame)
				{
					if (requestData.class === CLIENT_MESSAGES.CONFIRM_BATTLEGROUND_BUY_IN)
					{
						this.player.confirmIsSent = false;
					}
					console.log("reconnect 5");
					APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.BATTLEGROUND_GAME_URL_NEED_UPDATED_ON_PLAY_AGAIN);
				}
				else
				{
					this.goBackToLobby(serverData.code);
				}
				break;
			case GameWebSocketInteractionController.ERROR_CODES.ROUND_NOT_STARTED:
				isRoundNotStartedError = true;
				requestData.isRoundNotStartedError = isRoundNotStartedError;
				if (requestData.class === CLIENT_MESSAGES.BULLET)
				{
					this.emit(GameScreen.EVENT_ON_BULLET_PLACE_NOT_ALLOWED, {requestData: requestData});
				}
				if (requestData && requestData.rid >= 0)
				{
					switch (requestData.class)
					{
						case  CLIENT_MESSAGES.SHOT:
							let weaponId = requestData.weaponId;
							this.revertAmmoBack(weaponId, undefined, requestData.isPaidSpecialShot, isRoundNotStartedError);
							this.onShotResponse();
							break;
					}
				}
				break;
			case GameWebSocketInteractionController.ERROR_CODES.WRONG_WEAPON:
				if (requestData && requestData.rid >= 0)
				{
					switch (requestData.class)
					{
						case  CLIENT_MESSAGES.SHOT:
							let weaponId = requestData.weaponId;
							this.revertAmmoBack(weaponId, undefined, requestData.isPaidSpecialShot, isRoundNotStartedError);
							this.onShotResponse();

							this.gameFieldController.tryToChangeWeaponOnWrongWeaponErrorReceived(requestData);
							break;
					}
				}
				break;
			case GameWebSocketInteractionController.ERROR_CODES.NOT_ENOUGH_BULLETS:
				if (requestData && requestData.rid >= 0)
				{
					switch (requestData.class)
					{
						case  CLIENT_MESSAGES.SHOT:
							let weaponId = requestData.weaponId;
							this.revertAmmoBack(weaponId, undefined, requestData.isPaidSpecialShot, isRoundNotStartedError);
							this.onShotResponse();
							break;
					}
				}
				break;
			case GameWebSocketInteractionController.ERROR_CODES.REQUEST_FREQ_LIMIT_EXCEEDED:
			case GameWebSocketInteractionController.ERROR_CODES.WRONG_COORDINATES:
				if (requestData && requestData.rid >= 0)
				{
					switch (requestData.class)
					{
						case  CLIENT_MESSAGES.SHOT:
							{
								let weaponId = requestData.weaponId;
								this.revertAmmoBack(weaponId, undefined, requestData.isPaidSpecialShot);
								this.onShotResponse();
							}
							break;
						default:
							//nothing to do
							break;
					}
				}
				break;
			case GameWebSocketInteractionController.ERROR_CODES.TOO_MANY_OBSERVERS:
			case GameWebSocketInteractionController.ERROR_CODES.TOO_MANY_PLAYER:
				this.player.sitInIsSent = false;
			case GameWebSocketInteractionController.ERROR_CODES.ROOM_NOT_FOUND:
			case GameWebSocketInteractionController.ERROR_CODES.ROOM_MOVED:
			case GameWebSocketInteractionController.ERROR_CODES.SERVER_SHUTDOWN:
				this.gameFieldController && this.gameFieldController.clearRoom(false, true, true);
				this.clear();
				this.clearAllButLobbyInfo();
				break;

			case GameWebSocketInteractionController.ERROR_CODES.NOT_SEATER:
				if (requestData.class === CLIENT_MESSAGES.BULLET)
				{
					this.emit(GameScreen.EVENT_ON_BULLET_PLACE_NOT_ALLOWED, {requestData: requestData});
				}

				if (
						APP.webSocketInteractionController.isSitoutRequestInProgress
						|| APP.webSocketInteractionController.isCloseRoomRequestInProgress
						|| !this.player.sitIn
						|| this._fForseSitOutInProgress
					)
				{
					// no need to request full game info due to room exit initiated by the player,
					// or sitout already occurred in game client
					this.emit(GameScreen.EVENT_ON_GAME_RESTORE_AFTER_UNSEASONABLE_REQUEST_CANCELED);

					if (
							APP.isBattlegroundGame
							&& requestData.class === CLIENT_MESSAGES.RE_BUY
							&&
								(
									!this.gameStateController.info.isPlayerSitIn || 
									APP.webSocketInteractionController.isSitoutRequestInProgress
								)
						)
					{
						console.log("reconnect 6");
						APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.BATTLEGROUND_GAME_URL_NEED_UPDATED_ON_PLAY_AGAIN);
					}
				}
				else
				{
					this.player.sitIn = false;
					this.player.seatId = undefined;
					this.gameFieldController && this.gameFieldController.clearRoom(false, true, true);
					this.clear();
					this._restoreAfterUnseasonableRequest = true;
					this._restoreAfterLagsInProgress = false;
					APP.playerController.updateMasterPlayerSeatId(undefined);
					this._fIsSitOutOnNotEnoughPlayersExpected_bl = false;

					this._requestFullGameInfo();
				}
				break;

			case GameWebSocketInteractionController.ERROR_CODES.NEED_SITOUT:
				if (requestData && requestData.rid >= 0)
				{
					switch (requestData.class)
					{
						case  CLIENT_MESSAGES.SIT_IN:
							this.player.sitInIsSent = false;

							if (this._canJoinRoom())
							{
								this.sendSitIn();
							}
							break;
						case  CLIENT_MESSAGES.CLOSE_ROOM:
							this._onCloseRoomDenied();
							break;
					}
				}
				break;

			case GameWebSocketInteractionController.ERROR_CODES.INSUFFICIENT_FUNDS:
			case GameWebSocketInteractionController.ERROR_CODES.NOT_ENOUGH_MONEY:
				this.gameFieldController.resetWaitBuyIn();
				this.fireController.i_resetTargetIfRequired(true);

				if (
						requestData && requestData.rid >= 0 && requestData.class === CLIENT_MESSAGES.SIT_IN
						&& APP.tickerAllowed
					)

				{
					this.player.sitInIsSent = false;
					this.goBackToLobby();
				}
				break;

			case GameWebSocketInteractionController.ERROR_CODES.BUYIN_NOT_ALLOWED_AT_CURRENT_GAME_STATE:
			case GameWebSocketInteractionController.ERROR_CODES.NOT_FATAL_BAD_BUYIN:
			case GameWebSocketInteractionController.ERROR_CODES.TEMPORARY_PENDING_OPERATION:
			case GameWebSocketInteractionController.ERROR_CODES.PREV_OPERATION_IS_NOT_COMPLETE:
				this.gameFieldController.resetWaitBuyIn();

				if (APP.isBattlegroundGame)
				{
					if (
							this.battlegroundGameController.info.isPlayerClickedConfirmPlayForNextBattlegroundRound
							&& this.gameStateController.info.isPlayerSitIn
							&& !this.gameFieldController.roundResultScreenController.info.isScreenActive
							&& requestData
							&& (requestData.class === CLIENT_MESSAGES.RE_BUY || requestData.class === CLIENT_MESSAGES.CONFIRM_BATTLEGROUND_BUY_IN)
						)
					{
						this.battlegroundGameController.info.isPlayerClickedConfirmPlayForNextBattlegroundRound = false;
						this.player.confirmIsSent = false;

						this._fBattlegroundIsNeedFullGameInfoUpdateOnGameState_bl = false;
						this.gameStateController.off(GameStateController.EVENT_ON_GAME_STATE_CHANGED, this._onCheckGameStateChangedForRequestFullGameInfo);
						break;
					}
					
					this.player.sitIn = false;

					if (serverData.code === GameWebSocketInteractionController.ERROR_CODES.BUYIN_NOT_ALLOWED_AT_CURRENT_GAME_STATE)
					{
						// no need to send GAME_MESSAGES.BATTLEGROUND_GAME_URL_NEED_UPDATED_ON_PLAY_AGAIN, url will be requested from LobbyScreen for this error code
					}
					else
					{
						console.log("server error " + serverData.code);
						//APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.BATTLEGROUND_GAME_URL_NEED_UPDATED_ON_PLAY_AGAIN);
					}
					break;
				}
				break;
			case GameWebSocketInteractionController.ERROR_CODES.CHANGE_BET_NOT_ALLOWED:
				this._onServerBetLevelChangeNotConfirmed();
				break;
			case GameWebSocketInteractionController.ERROR_CODES.NOT_ALLOWED_PLACE_BULLET:
				this.emit(GameScreen.EVENT_ON_BULLET_PLACE_NOT_ALLOWED, {requestData: requestData});
				break;
			case GameWebSocketInteractionController.ERROR_CODES.BAD_REQUEST:
				if (requestData && requestData.class === CLIENT_MESSAGES.SHOT && requestData.bulletId !== undefined)
				{
					// BAD_REQUEST for ricochet shots is not considered as fatal error due to https://jira.dgphoenix.com/browse/DRAG-986
					this.revertAmmoBack(requestData.weaponId, undefined, requestData.isPaidSpecialShot, isRoundNotStartedError);
					this.onShotResponse();
				}
				break;
			case GameWebSocketInteractionController.ERROR_CODES.FOUND_PENDING_OPERATION:
				if (requestData && requestData.rid >= 0)
				{
					switch (requestData.class)
					{
						case  CLIENT_MESSAGES.SIT_IN:
							this.player.sitInIsSent = false;
							break;
						case  CLIENT_MESSAGES.BUY_IN:
							this.gameFieldController.resetWaitBuyIn();
							break;
						case  CLIENT_MESSAGES.CONFIRM_BATTLEGROUND_BUY_IN:
							this.player.confirmIsSent = false;
							break;
						case  CLIENT_MESSAGES.BET_LEVEL:
							this._onServerBetLevelChangeNotConfirmed();
							break;
					}
				}
				break;
		}
	}

	_onNoPlaceToSeat()
	{
		this.player.sitInIsSent = false;

		this.clear();
		this.clearAllButLobbyInfo();
		
		this.emit(GameScreen.EVENT_ON_NO_EMPTY_SEATS);
	}

	//PENDING_OPERATION...
	_onPendingOperationStarted(event)
	{
		let l_ws = APP.webSocketInteractionController;
		if (this.player.sitInIsSent)
		{
			this.player.sitInIsSent = false;
		}

		if (this.gameFieldController.waitBuyIn)
		{
			this.gameFieldController.resetWaitBuyIn();
		}

		if (this.player.confirmIsSent)
		{
			this.player.confirmIsSent = false;
		}
	}

	_onPendingOperationCompleted(event)
	{
		if (APP.isBattlegroundGame)
		{
			let l_gwsic = APP.webSocketInteractionController;

			if (
					(APP.playerController.info.isObserver || !(this.player.seatId >= 0) /*for reconnect in PLAY state*/ )
					&& !l_gwsic.isSitoutRequestInProgress
					&& !l_gwsic.hasDelayedRequests(CLIENT_MESSAGES.SIT_OUT)
					&& !l_gwsic.hasUnRespondedRequest(CLIENT_MESSAGES.SIT_IN)
					&& !l_gwsic.hasUnRespondedRequest(CLIENT_MESSAGES.CONFIRM_BATTLEGROUND_BUY_IN)
					&& !l_gwsic.hasDelayedRequests(CLIENT_MESSAGES.SIT_IN)
					&& !l_gwsic.hasDelayedRequests(CLIENT_MESSAGES.CONFIRM_BATTLEGROUND_BUY_IN)
				)
			{
				if (this.battlegroundGameController.info.isPlayerClickedConfirmPlayForNextBattlegroundRound)
				{
					if (this.gameStateController.info.isWaitState)
					{
						this.sendSitIn();
					}
				}
				else if (
							APP.playerController.info.isObserver
							&& this.gameStateController.info.isWaitState
							&& !this.gameFieldController.roundResultScreenController.info.isScreenActive
						)
				{
					APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.BATTLEGROUND_PLAY_AGAIN_REQUEST, {isRRActive: this.isRoundResultDisplayInProgress()});
				}
			}

		}
	}
	//...PENDING_OPERATION
}

export default GameScreen;

function parseGet(aOptLocation_str = undefined)
{
	var get = {};

	var s = aOptLocation_str ? aOptLocation_str : window.location.toString();
	var p = s.indexOf("?");
	var tmp, params;
	if (p >= 0)
	{
		s = s.substr(p + 1, s.length);
		params = s.split("&");
		for (var i = 0; i < params.length; i++)
		{
			tmp = params[i].split("=");
			get[tmp[0]] = tmp[1];
		}
	}

	return get;
}