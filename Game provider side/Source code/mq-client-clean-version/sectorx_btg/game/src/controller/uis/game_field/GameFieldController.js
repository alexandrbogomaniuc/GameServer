import
{
	DIALOG_ID_INSUFFICIENT_FUNDS,
	DIALOG_ID_BATTLEGROUND_NOT_ENOUGH_PLAYERS,
	DIALOG_ID_BATTLEGROUND_BUY_IN_CONFIRMATION,
	DIALOG_ID_BATTLEGROUND_COUNT_DOWN,
	DIALOG_ID_BATTLEGROUND_RULES,
	DIALOG_ID_BATTLEGROUND_CAF_ROOM_MANAGER

} from '../../../../../shared/src/CommonConstants';
import SimpleUIController from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/uis/base/SimpleUIController';
import GameFieldInfo from '../../../model/uis/game_field/GameFieldInfo';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import I18 from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import Enemy from '../../../main/enemies/Enemy';
import { WEAPONS, ENEMIES, FRAME_RATE, ENEMY_TYPES, RICOCHET_WEAPONS } from '../../../../../shared/src/CommonConstants';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import * as Easing from '../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import Timer from "../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer";
import { Utils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import BattlegroundMainPlayerSpot from '../../../main/playerSpots/battleground/BattlegroundMainPlayerSpot';
import GameScreen from '../../../main/GameScreen';
import AwardingController from '../../../controller/uis/awarding/AwardingController';
import ScoreboardController from '../scoreboard/ScoreboardController';
import RoundResultScreenView from '../../../view/uis/roundresult/RoundResultScreenView';
import BattlegroundResultScreenView from '../../../view/uis/roundresult/battleground/BattlegroundResultScreenView';
import RoundResultScreenInfo from '../../../model/uis/roundresult/RoundResultScreenInfo';
import RoundResultScreenController from '../../../controller/uis/roundresult/RoundResultScreenController';
import BossModeController from '../../../controller/uis/custom/bossmode/BossModeController';
import GamePlayerController from '../../../controller/custom/GamePlayerController';
import GameStateController from '../../../controller/state/GameStateController';
import { SUBROUND_STATE, ROUND_STATE } from '../../../model/state/GameStateInfo';
import { SERVER_MESSAGES } from '../../../model/interaction/server/GameWebSocketInteractionInfo';
import Game from '../../../Game';
import GameFieldScreen from '../../../main/gameField/GameFieldScreen';
import ContentItemInfo from '../../../model/uis/content/ContentItemInfo';
import FreeShotsCounterView from '../../../ui/content/FreeShotsCounterView';
import Crate from '../../../ui/Crate';
import ContentItem from '../../../ui/content/ContentItem';

import GameSoundsController from '../../../controller/sounds/GameSoundsController';
import MapsController from '../../../controller/uis/maps/MapsController';
import SpineEnemy from '../../../main/enemies/SpineEnemy';
import ShotResultsUtil from '../../../main/ShotResultsUtil';
import { GAME_MESSAGES, LOBBY_MESSAGES } from '../../../controller/external/GameExternalCommunicator';
import GameExternalCommunicator from '../../../controller/external/GameExternalCommunicator';
import PrizesController, { HIT_RESULT_SINGLE_CASH_ID, HIT_RESULT_ADDITIONAL_CASH_ID } from '../../../controller/uis/prizes/PrizesController';
import ProfilingInfo from '../../../../../../common/PIXI/src/dgphoenix/unified/model/profiling/ProfilingInfo';
import TournamentModeController from '../../../controller/custom/tournament/TournamentModeController';
import BigWinsController from '../../../controller/uis/awarding/big_win/BigWinsController';
import GameWebSocketInteractionController from '../../../controller/interaction/server/GameWebSocketInteractionController';
import RicochetController from '../../../controller/custom/RicochetController';
import FireController from '../../../controller/uis/fire/FireController';
import BossEnemy from '../../../main/enemies/BossEnemy';
import LightningBoss from '../../../main/enemies/LightningBoss';
import BattlegroundFinalCountingController from '../../../controller/uis/final_counting/BattlegroundFinalCountingController';
import BattlegroundFinalCountingView from '../../../view/uis/final_counting/BattlegroundFinalCountingView';
import BattlegroundFinalCountingInfo from '../../../model/uis/final_counting/BattlegroundFinalCountingInfo';
import SpecialAreasMap from '../../../main/specialAreas/SpecialAreasMap';
import MissEffect from '../../../main/missEffects/MissEffect';
import MissEffectsPool from '../../../main/missEffects/MissEffectsPool';
import EnemiesController from '../../../controller/uis/enemies/EnemiesController';
import LaserCapsuleFeatureController from '../../../controller/uis/capsule_features/LaserCapsuleFeatureController';
import BulletCapsuleFeatureController from '../../../controller/uis/capsule_features/BulletCapsuleFeatureController';
import LightningCapsuleFeatureController from '../../../controller/uis/capsule_features/LightningCapsuleFeatureController';

import Rocky from '../../../main/enemies/Rocky';
import Pointy from '../../../main/enemies/Pointy';
import Spiky from '../../../main/enemies/Spiky';
import Trex from '../../../main/enemies/Trex';
import Krang from '../../../main/enemies/Krang';
import Kang from '../../../main/enemies/Kang';
import OneEye from '../../../main/enemies/OneEye';
import PinkFlyer from '../../../main/enemies/PinkFlyer';
import YellowAlien from '../../../main/enemies/YellowAlien';
import SmallFlyer from '../../../main/enemies/SmallFlyer';
import JumperBlue from '../../../main/enemies/JumperBlue';
import GreenHopper from '../../../main/enemies/GreenHopper';
import FlyerMutalisk from '../../../main/enemies/FlyerMutalisk';
import Slug from '../../../main/enemies/Slug';
import Jellyfish from '../../../main/enemies/Jellyfish';
import MFlyer from '../../../main/enemies/MFlyer';
import RedHeadFlyer from '../../../main/enemies/RedHeadFlyer';
import Froggy from '../../../main/enemies/Froggy';
import EyeFlyer from '../../../main/enemies/EyeFlyer';
import Bioraptor from '../../../main/enemies/Bioraptor';
import Crawler from '../../../main/enemies/Crawler';
import Mothy from '../../../main/enemies/Mothy';
import Flyer from '../../../main/enemies/Flyer';
import Money from '../../../main/enemies/Money';
import GiantTrex from '../../../main/enemies/GiantTrex';
import GiantPinkFlyer from '../../../main/enemies/GiantPinkFlyer';
import LaserCapsule from '../../../main/enemies/LaserCapsule';
import LightningCapsule from '../../../main/enemies/LightningCapsule';
import GoldCapsule from '../../../main/enemies/GoldCapsule'
import KillerCapsule from '../../../main/enemies/KillerCapsule';
import BulletCapsule from '../../../main/enemies/BulletCapsule';
import BombCapsule from '../../../main/enemies/BombCapsule';
import EarthBossEnemy from '../../../main/enemies/EarthBossEnemy';
import FireBoss from '../../../main/enemies/FireBoss';

import MoneyWheelController from '../../../controller/uis/quests/MoneyWheelController';
import MoneyWheelView from '../../../view/uis/quests/MoneyWheelView';
import MoneyWheelInfo from '../../../model/uis/quests/MoneyWheelInfo';
import KillerCapsuleFeatureController from '../../../controller/uis/capsule_features/KillerCapsuleFeatureController';
import FreezeCapsule from '../../../main/enemies/FreezeCapsule';
import BombController from '../../../controller/uis/quests/BombController';
import BombView from '../../../view/uis/quests/BombView';
import BombInfo from '../../../model/uis/quests/BombInfo';
import IceBoss from '../../../main/enemies/IceBoss';
import GameplayDialogsInfo from '../../../model/uis/custom/gameplaydialogs/GameplayDialogsInfo';
import GamePendingOperationController from '../../gameplay/GamePendingOperationController';
import MTimeLine from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/timeLine/MTimeLine';

//-----------------
// | this
// ----------------
//   | container
// ----------------
//     | screen
//-----------------
export const Z_INDEXES = {
	WAIT_SCREEN: 								100000, /*this*/
	WAITING_CAPTION: 							100000, /*this*/
	SUBLOADING: 								100001, /*this*/
	TRANSITION_VIEW: 							110002, /*this*/
	ROUND_RESULT: 								110003, /*this*/
	COUNT_DOWN: 								110004, /*this*/
	BTG_FINAL_COUNTING: 						110005, /*this*/
	FIRE_SETTINGS: 								110006, /*this*/
	FREEZE_AWARDING: 							110006, /*this*/
	MONEY_WHEEL_AWARDING: 						110006, /*this*/

	GROUNDBURN: 								-541, /*this.view.screen*/
	LASER_FIELD_ANIMATION: 						1, /*this.view.screen*/
	BULLET_CAPSULE_FIELD_ANIMATION: 			1, /*this.view.screen*/
	SLUG: 										10, /*this.view.screen*/
	BOSS_DISAPPEARING_BOTTOM_FX: 				11, /*this.view.screen*/
	BOSS_APPEARING_BOTTOM_FX: 					11, /*this.view.screen*/
	ICE_COVER: 									1400, /*this.view.screen*/
	LASER_CAPSULE_FEATURE: 						1429, /*this.view.screen*/
	BULLET_CAPSULE_FEATURE: 					1429, /*this.view.screen*/
	KILLER_CAPSULE_FEATURE: 					1429, /*this.view.screen*/
	LASER_CAPSULE_EXPLOAD: 						1431, /*this.view.screen*/
	BULLET_CAPSULE_EXPLOASION_ANIMATION: 		1431, /*this.view.screen*/
	LASER_CAPSULE_LASER_NET_EXPLOAD: 			1432, /*this.view.screen*/
	LASER_CAPSULE_FLARE_EXPLOAD: 				1433, /*this.view.screen*/
	LIGHTNING_CAPSULE_HIT_ANIMATION: 			1434, /*this.view.screen*/
	LIGHTNING_CAPSULE_OPTICAL_FLARE_CYAN: 		1435, /*this.view.screen*/
	BOSS_APPEARING_FX: 							1440, /*this.view.screen*/
	FREEZE_CAPSULE_FEATURE: 					3500, /*this.view.screen*/
	GRADIENT: 									19000, /*this.view.screen*/
	LOGO: 										19999, /*this.view.screen*/
	MISS_EFFECT: 								20002, /*this.view.screen*/
	BOSS_GUI_VIEW: 								20003, /*this.view.screen*/
	MONEY_WHEEL: 								20004, /*this.view.screen*/
	BOMB: 										20004, /*this.view.screen*/
	PLAYERS_CONTAINER: 							20010, /*this.view.screen*/
	MAIN_SPOT: 									20012, /*this.view.screen*/
	CALLOUTS: 									20013, /*this.view.screen*/
	BULLET: 									20014, /*this.view.screen*/
	GUN_FIRE_EFFECT: 							20121, /*this.view.screen*/
	LIGHTNING_CAPSULE_ORB: 						20122, /*this.view.screen*/
	MONEY_ENEMY_SHOCKWAVE:	 					20123, /*this.view.screen*/
	PLAYER_REWARD: 								21000, /*this.view.screen*/
	AWARDED_WEAPON_CONTENT:						26000, /*this.view.screen*/
	AMMO_COUNTER: 								26001, /*this.view.screen*/
	TARGETING: 									27000, /*this.view.screen*/
	POWER_UP_MULTIPLIER:						27011, /*this.view.screen*/
	BIG_WINS_CONTENT: 							27016, /*this.view.screen*/
	AUTO_TARGETING_SWITCHER: 					27020, /*this.view.screen*/
	BET_LEVEL_BUTTON_HIT_AREA: 					27021, /*this.view.screen should be greater than MAIN_SPOT*/
	BOSS_APPEARING_FLAMES_FX: 					28003, /*this.view.screen*/
	BOSS_DISAPPEARING_FX: 						28004, /*this.view.screen*/
	BOSS_DIE_RED_SCREEN: 						28005, /*this.view.screen*/
	BOSS_YOU_WIN: 								28019, /*this.view.screen*/
	BOSS_CAPTION: 								28020, /*this.view.screen*/
	AWARDED_WIN_CONTENT: 						28021, /*this.view.screen*/
	SCOREBOARD: 								28022, /*this.view.screen*/
}

const HALF_PI = Math.PI / 2;

class GameFieldController extends SimpleUIController
{
	static get EVENT_REFRESH_COMMON_PANEL_REQUIRED() { return "onRefreshCommonPanelRequired"; }
	static get EVENT_ON_TIME_TO_CONVERT_BALANCE_TO_AMMO() { return "EVENT_ON_TIME_TO_CONVERT_BALANCE_TO_AMMO"; }
	static get EVENT_ON_BACK_TO_LOBBY_BUTTON_CLICKED() { return "onBackToLobbyButtonClicked"; }
	static get EVENT_ON_NEW_ENEMY_CREATED() { return "newEnemyCreated"; }
	static get EVENT_ON_NEW_BOSS_CREATED() { return "newBossCreated"; }
	static get EVENT_ON_BOSS_DESTROYING() { return "bossDestroying"; }

	static get EVENT_ON_CAPSULE_CREATED() { return "onCapsuleCreated"; }

	static get EVENT_ON_BOSS_DESTROYED() { return "bossDestroyed"; }
	static get EVENT_ON_END_SHOW_WEAPON() {return "endShowWeapon";}
	static get EVENT_ON_DRAW_MAP() { return "onDrawMap"; }
	static get EVENT_ON_WEAPON_UPDATED() { return "onWeaponUpdated"; }
	static get EVENT_ON_GAME_FIELD_SCREEN_CREATED() { return "onGameFieldScreenCreated"; }
	static get EVENT_ON_ENEMY_HIT_ANIMATION() { return "onEnemyHitAnimation"; }
	static get EVENT_ON_ENEMY_MISS_ANIMATION() { return "onEnemyMissAnimation"; }
	static get EVENT_ON_ROOM_FIELD_CLEARED() { return "roomFieldCleared"; }
	static get EVENT_ON_WEAPONS_INTERACTION_CHANGED() { return "onWeaponsInteractionChanged"; }
	static get EVENT_ON_ROUND_RESULT_FORCED() { return "onRoundResultForced"; }
	static get EVENT_ON_FREE_HIT_INTERRUPTED() { return "onFreeHitInterrupted"; }
	static get EVENT_ON_WEAPON_TO_UNPRESENTED_TRANSFER_REQUIRED() { return "onWEaponToUnpresentedTransferRequired"; }
	static get EVENT_ON_BET_MULTIPLIER_UPDATED() { return "onBetMultiplierUpdate"; }
	static get EVENT_ON_CLEAR_ROOM_STARTED() { return "onRoomClearStarted"; }

	static get EVENT_ON_BULLET_FLY_TIME() { return 'EVENT_ON_BULLET_FLY_TIME'; }
	static get EVENT_ON_BULLET_TARGET_TIME() { return 'EVENT_ON_BULLET_TARGET_TIME'; }
	static get EVENT_DECREASE_AMMO() { return 'EVENT_DECREASE_AMMO'; }
	static get EVENT_NEW_WEAPON_CONTENT_LANDED_WITHOUT_CHANGING()	{return 'EVENT_NEW_WEAPON_CONTENT_LANDED_WITHOUT_CHANGING';}
	static get EVENT_ON_ENEMY_KILLED_BY_PLAYER() { return 'EVENT_ON_ENEMY_KILLED_BY_PLAYER'; }
	static get EVENT_ON_HIT_AWARD_EXPECTED() { return 'EVENT_ON_HIT_AWARD_EXPECTED'; }
	static get EVENT_ON_SHOT_SHOW_FIRE_START_TIME() { return 'EVENT_ON_SHOT_SHOW_FIRE_START_TIME'; }
	static get EVENT_ON_SHOW_ENEMY_HIT() { return 'showEnemyHit'; }
	static get EVENT_ON_REMOVE_ENEMY() { return 'removeEnemy'; }

	static get EVENT_ON_PICKS_UP_SPECIAL_WEAPONS_FIRST_TIME() {return 'EVENT_ON_PICKS_UP_SPECIAL_WEAPONS_FIRST_TIME';}
	static get EVENT_ON_TOTAL_WIN_UPDATED() { return "EVENT_ON_TOTAL_WIN_UPDATED"; }

	static get EVENT_RELOAD_REQUIRED() { return BattlegroundMainPlayerSpot.EVENT_RELOAD_REQUIRED; }
	static get EVENT_ON_ENEMY_VIEW_REMOVING() { return Enemy.EVENT_ON_ENEMY_VIEW_REMOVING; }
	static get EVENT_ON_DEATH_ANIMATION_STARTED() { return Enemy.EVENT_ON_DEATH_ANIMATION_STARTED; }
	static get EVENT_ON_ENEMY_ADD_TRAJECTORY_POINT() { return Enemy.EVENT_ON_ENEMY_ADD_TRAJECTORY_POINT; }
	static get EVENT_ON_ENEMY_PAUSE_WALKING() { return Enemy.EVENT_ON_ENEMY_PAUSE_WALKING; }
	static get EVENT_ON_ENEMY_RESUME_WALKING() { return Enemy.EVENT_ON_ENEMY_RESUME_WALKING; }
	static get EVENT_ON_BOSS_DEATH_CRACK() { return Enemy.EVENT_ON_DEATH_ANIMATION_CRACK; }

	static get EVENT_ON_TIME_TO_EXPLODE_COINS() { return Enemy.EVENT_ON_TIME_TO_EXPLODE_COINS; }
	static get EVENT_ON_NEW_ROUND_STATE() { return GameScreen.EVENT_ON_NEW_ROUND_STATE; }
	static get EVENT_ON_WAITING_NEW_ROUND() { return GameScreen.EVENT_ON_WAITING_NEW_ROUND; }
	static get EVENT_ON_BACK_TO_LOBBY_ROUND_RESULT_BUTTON_CLICKED() { return RoundResultScreenController.EVENT_ON_BACK_TO_LOBBY_ROUND_RESULT_BUTTON_CLICKED; }
	static get EVENT_ON_ROUND_RESULT_SCREEN_DEACTIVATED() { return RoundResultScreenController.EVENT_ON_ROUND_RESULT_SCREEN_DEACTIVATED; }
	static get EVENT_ON_ROUND_RESULT_SCREEN_ACTIVATED() { return RoundResultScreenController.EVENT_ON_ROUND_RESULT_SCREEN_ACTIVATED; }
	static get EVENT_ON_BATTLEGROUND_NEXT_ROUND_CLICKED() { return RoundResultScreenController.EVENT_ON_BATTLEGROUND_NEXT_ROUND_CLICKED; }
	static get EVENT_TIME_TO_SHOW_PRIZES() { return "EVENT_TIME_TO_SHOW_PRIZES"; }
	static get EVENT_ON_RICOCHET_BULLETS_UPDATED() { return RicochetController.EVENT_ON_RICOCHET_BULLETS_UPDATED; }
	static get EVENT_BACK_TO_LOBBY_ON_SW_PURCHASE_LIMIT_EXCEEDED_DIALOG_DEACTIVATED() { return "EVENT_BACK_TO_LOBBY_ON_SW_PURCHASE_LIMIT_EXCEEDED_DIALOG_DEACTIVATED"; }
	static get EVENT_FULL_GAME_INFO_REQUIRED() { return "EVENT_FULL_GAME_INFO_REQUIRED" }

	static get EVENT_ON_UPDATE_PLAYER_WIN_CAPTION() { return "EVENT_ON_UPDATE_PLAYER_WIN_CAPTION"; }

	static get EVENT_ON_DEATH_COIN_AWARD() { return Enemy.EVENT_ON_DEATH_COIN_AWARD; }

	static get EVENT_ON_BOSS_HP_BAR_DESTROYING() { return 'EVENT_ON_BOSS_HP_BAR_DESTROYING'; }
	static get DELAY_BOMB_ARRAY_COMPLETE() { return 'DELAY_BOMB_ARRAY_COMPLETE'; }
	static get EVENT_ON_SHOW_BONUS_CAPSULE_WIN() { return "EVENT_ON_SHOW_BONUS_CAPSULE_WIN" }

	static get EVENT_ON_ENEMY_DEATH_SFX() { return Enemy.EVENT_ON_ENEMY_DEATH_SFX; }
	static get EVENT_ON_ICE_EXPLOSION_ANIMATION_STARTED() 	{ return Enemy.EVENT_ON_ICE_EXPLOSION_ANIMATION_STARTED; }

	static get EVENT_ON_BOSS_BECOME_VISIBLE() { return BossEnemy.EVENT_ON_BOSS_BECOME_VISIBLE; }
	static get EVENT_ON_BOSS_APPEARED() { return BossEnemy.EVENT_ON_BOSS_APPEARED; }
	static get EVENT_ON_SOME_ENEMY_SPAWN_SOUND_REQUIRED() { return "EVENT_ON_SOME_ENEMY_SPAWN_SOUND_REQUIRED"; }
	static get EVENT_ON_NEW_B3_ENEMY_CREATED() { return "EVENT_ON_NEW_B3_ENEMY_CREATED"; }
	static get EVENT_BOSS_IS_ENRAGED() { return BossEnemy.EVENT_BOSS_IS_ENRAGED; }

	static get EVENT_ON_NEED_TO_COUNT_WIN_FOR_LOST_ENEMY()	{ return 'EVENT_ON_NEED_TO_COUNT_WIN_FOR_LOST_ENEMY'; }

	static get EVENT_ON_BOSS_IMMEDIATELY_DEATH()						{ return 'EVENT_ON_BOSS_IMMEDIATELY_DEATH'; }
	static get EVENT_ON_DELAYED_LASER_CAPSULES_AWARDS_ARE_COLLECTED()	{ return 'EVENT_ON_DELAYED_LASER_CAPSULES_AWARDS_ARE_COLLECTED'; }
	static get EVENT_ON_LIGHTNING_CAPSULE_DELAYED_AWARDS_COLLECTED() 	{ return 'EVENT_ON_LIGHTNING_CAPSULE_DELAYED_AWARDS_COLLECTED'; }

	get screenField()
	{
		return this.view.screen;
	}

	get ricochetController()
	{
		return this._ricochetController;
	}

	get moneyWheelController()
	{
		return this._moneyWheelController;
	}

	get bombController()
	{
		return this._bombController;
	}

	get roundResultScreenController()
	{
		return this._roundResultScreenController;
	}

	get delayedLaserExploasionHits()
	{
		return this._fDelayedLaserExploasionHits_obj_arr;
	}

	get isWaitingAnimationsEnd()
	{
		return this._fRoundResultAnimsCount_num > 0;
	}


	get delayedBombExploasionHits()
	{
		return this._fDelayedBombExploasionHits_obj_arr;
	}

	get delayedBulletExploasionHits()
	{
		return this._fDelayedBulletExploasionHits_obj;
	}

	get delayedKillerExplosionHits()
	{
		return this._fDelayedKillerExplosionHits_obj_arr;
	}

	get delayedLightningExplosionHits()
	{
		return this._fDelayedLightningExplosionHits_obj;
	}

	get fireSettingsScreenActive()
	{
		return this._fFireSettingsScreenActive_bln;
	}

	get battlegroundFinalCountingController()
	{
		return this._battlegroundFinalCountingController;
	}

	get newWeapons()
	{
		let lNewWeapons_arr = [];

		for (let i = 0; i < this._fNewWeapons_arr.length; ++i)
		{
			let lAward_obj = this._fNewWeapons_arr[i];
			let lContentItems_arr = null;

			if (lAward_obj instanceof Crate)
			{
				lContentItems_arr = lAward_obj.contentItems;
			}
			else if (lAward_obj instanceof ContentItem)
			{
				lContentItems_arr = [lAward_obj];
			}

			for (let j = 0; j < lContentItems_arr.length; ++j)
			{
				let lNewWeapon_obj = lContentItems_arr[j].info ? lContentItems_arr[j].info.awardedWeapon : lContentItems_arr[j].awardedWeapon;
				if (lNewWeapon_obj)
				{
					lNewWeapons_arr.push(lNewWeapon_obj);
				}
			}
		}

		return lNewWeapons_arr;
	}

	get totalWin()
	{
		return this._fTotalWin_num;
	}

	set totalWin(aValue_num)
	{
		this._fTotalWin_num = aValue_num;
		this.emit(GameFieldController.EVENT_ON_TOTAL_WIN_UPDATED, { value: this._fTotalWin_num });
	}

	set isWinLimitExceeded(aValue_bl)
	{
		this._fIsWinLimitExceeded_bl = aValue_bl;
	}

	get weaponSwitchInProgress()
	{
		return this._fWeaponSwitchInProgress_bln;
	}

	get serverMessageWeaponSwitchExpected()
	{
		return this._fServerMessageWeaponSwitchExpected_bln;
	}

	get gamePlayers()
	{
		return this.players;
	}

	get isConnectionHasBeenRecentlyClosed()
	{
		return this._fConnectionHasBeenRecentlyClosed_bln;
	}

	get isExternalBalanceUpdated()
	{
		return this._fExternalBalanceUpdated_bl;
	}

	get isRoundResultOnLasthandWaitState()
	{
		return this._fRoundResultOnLasthandWaitState_bln;
	}

	validateCursor()
	{
		this._validateCursor();
	}

	resetWaitBuyIn()
	{
		this.waitBuyIn = false;
		this.spot && (this.spot.reloadRequiredSent = false);
	}

	showPrizes(data, aPrizePosition_pt, aEnemyId_int, aIsBoss_bl)
	{
		this._showPrizes(data, aPrizePosition_pt, aEnemyId_int, aIsBoss_bl);
	}

	onFireSettingsActivated()
	{
		this._onFireSettingsActivated();
	}

	onFireSettingsDeactivated()
	{
		this._onFireSettingsDeactivated();
	}

	get playersPositions()
	{
		return this.info.playersPositions;
	}

	get sitPositionIds()
	{
		return this.info.sitPositionIds;
	}

	get freezeGroundContainer()
	{
		return this._fFreezeGroundContainer_sprt;
	}

	get shotRequestsAwaiting()
	{
		return this.shotRequestsAwaiting_num;
	}

	constructor()
	{
		super(new GameFieldInfo());

		this._fCurrentKingsOfTheHillSeatId_int_arr = [];

		this._fRoundResultAnimsCount_num = 0;
		this._fRoundEndListenHandlers_arr = [];
		this._fNewWeapons_arr = [];

		this.enemies = [];
		this.deadEnemies = [];
		this.seatId = -1;
		this.currentScore = 0;
		this.playersContainer = null;
		this.spot = null;

		this.waitBuyIn = false;

		this._fIndicatedEnemy_e = null;

		this._fLobbySecondaryScreenActive_bln = false;
		this._fWeaponSwitchTry_bln = false;
		this._fWeaponSwitchInProgress_bln = false;

		this._fIsWeaponAddingInProgress_bl = false;
		this._fRoundResultBuyAmmoRequest_bln = false;
		this._fRoundResultActive_bln = false;
		this._fRoundResultResponseReceived_bl = false;
		this._fExternalBalanceUpdated_bl = false;
		this._fFireSettingsScreenActive_bln = false;
		this._fRoundResultOnLasthandWaitState_bln = false;
		this._fShowHPBarInstaste_bl = false;

		this.players = [];

		this.playerPosition = null;

		this._fWeaponToRestore_int = null;

		this._fIsWinLimitExceeded_bl = null;

		this._fMidRoundExitDialogActive_bln = false;
		this._fBonusDialogActive_bln = false;
		this._fFRBDialogActive_bln = false;
		this._fDialogActivated_bln = false;

		this._fRoundResultScreenView_bwsv = null;
		this._fRoundResultScreenController_bwsv = null;

		this.shotRequestsAwaiting_num = 0;

		this.enemiesLastPositions = {};

		this._fWeaponsController_wsc = APP.currentWindow.weaponsController;
		this._fWeaponsInfo_wsi = this._fWeaponsController_wsc.i_getInfo();

		this._fGameStateController_gsc = APP.currentWindow.gameStateController;
		this._fGameStateInfo_gsi = this._fGameStateController_gsc.info;

		this._fBossModeController_bmc = APP.currentWindow.bossModeController;

		this._fCurChangeWeaponTimerInfo_obj = null;

		this._fConnectionClosed_bln = false;
		this._fConnectionHasBeenRecentlyClosed_bln = false;
		this._fUnpresentedWeaponSurplus_num = null;

		this._fTournamentModeInfo_tmi = null;

		this._fServerMessageWeaponSwitchExpected_bln = false;
		this._fLastRequestedWeaponId_int = undefined;
		this._fLastReceivedWeaponId_int = undefined;

		this._fCommonPanelIndicatorsData_obj = null;

		this._fRestoreAfterFreeShotsWeaponId_int = undefined;

		this._fBattlegroundFinalCountingController_fcc = null;

		this._fSpecialAreasMap_sam = new SpecialAreasMap();
		this._fMissEffectsPool_mep = null;

		this._fCurrentLevelUpTimeout = null;

		this._fDelayedLaserExploasionHits_obj_arr = [];
		this._fDelayedBulletExploasionHits_obj = {};
		this._fDelayedKillerExplosionHits_obj_arr = [];
		this._fDelayedBombExploasionHits_obj_arr = [];
		this._fDelayedLightningExplosionHits_obj = {};

		this._fGameStateWaitIsWatingBattlegroundRoundResult_bl = null;

		this._fFreezeGroundContainer_sprt = null;
	}

	__init()
	{
		super.__init();
	}

	__initControlLevel()
	{
		super.__initControlLevel();
	}

	__initViewLevel()
	{
		super.__initViewLevel();

		APP.externalCommunicator.on(GameExternalCommunicator.LOBBY_MESSAGE_RECEIVED, this._onLobbyExternalMessageReceived, this);

		this._roundResultScreenController.init();
		this._roundResultScreenController.on(RoundResultScreenController.EVENT_ON_ROUND_RESULT_SCREEN_DEACTIVATED, this._onRoundResultDeactivatedOrSkipped, this);
		this._roundResultScreenController.on(RoundResultScreenController.EVENT_ON_ROUND_RESULT_SCREEN_SKIPPED, this._onRoundResultDeactivatedOrSkipped, this);
		this._roundResultScreenController.on(RoundResultScreenController.EVENT_ON_ROUND_RESULT_SCREEN_ACTIVATED, this._onRoundResultScreenActivated, this);

		APP.on(Game.EVENT_ON_PLAYER_INFO_UPDATED, this._onPlayerInfoUpdated, this);
		APP.playerController.on(GamePlayerController.EVENT_ON_PLAYER_INFO_UPDATED, this._onPlayerInfoUpdated, this);
		APP.playerController.on(GamePlayerController.EVENT_ON_WEAPON_SURPLUS_UPDATED, this._onWeaponSurplusUpdated, this);

		APP.webSocketInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_WEAPON_SWITCHED_MESSAGE, this._onServerWeaponSwitchedMessage, this);
		APP.webSocketInteractionController.on(GameWebSocketInteractionController.EVENT_ON_REQUEST_WEAPON_UPDATE_SENDED, this._onWeaponUpdated, this);

		APP.webSocketInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_MESSAGE, this._onServerMessage, this);
		APP.webSocketInteractionController.on(GameWebSocketInteractionController.EVENT_ON_DELAYED_SHOT_REMOVED, this._onDelayedShotRemoved, this);

		this._fBossModeController_bmc.on(BossModeController.EVENT_SHAKE_THE_GROUND_REQUIRED, this._onBossModeAppearingShakeTheGroundRequired, this);

		APP.gameScreen.on(GameScreen.EVENT_ON_DIALOG_ACTIVATED, this._onDialogActivated, this);
		APP.gameScreen.on(GameScreen.EVENT_ON_DIALOG_DEACTIVATED, this._onDialogDectivated, this);
		APP.gameScreen.on(GameScreen.EVENT_ON_FRB_ENDED_COMPLETED, this._onFRBEndedCompleted, this);
		APP.gameScreen.on(GameScreen.EVENT_ON_ROOM_PAUSED, this._onRoomPaused, this);

		APP.currentWindow.mapsController.on(MapsController.EVENT_CURRENT_MAP_ID_UPDATED, this._onCurrentMapUpdated, this);

		let tournamentModeController = APP.tournamentModeController;
		this._fTournamentModeInfo_tmi = tournamentModeController.info;
		tournamentModeController.on(TournamentModeController.EVENT_ON_TOURNAMENT_SERVER_STATE_CHANGED, this._onTournamentModeServerStateChanged, this);
		tournamentModeController.on(TournamentModeController.EVENT_ON_TOURNAMENT_CLIENT_STATE_CHANGED, this._onTournamentModeClientStateChanged, this);

		this._fRicochetInfo_ri = this._ricochetController.info;

		APP.gameScreen.laserCapsuleFeatureController.on(LaserCapsuleFeatureController.EVENT_ON_SHOW_DELAYED_AWARD, this._onShowDalayedLaserCapsuleAward, this);
		APP.gameScreen.bulletCapsuleFeatureController.on(BulletCapsuleFeatureController.EVENT_ON_TARGET_HIT, this._onShowDalayedBulletCapsuleAward, this);
		APP.gameScreen.killerCapsuleFeatureController.on(KillerCapsuleFeatureController.EVENT_ON_TARGET_HIT, this._onShowDalayedKillerCapsuleAward, this);
		APP.gameScreen.lightningCapsuleFeatureController.on(LightningCapsuleFeatureController.EVENT_ON_TARGET_HIT, this._onShowDelayedLightningCapsuleAward, this);
		APP.gameScreen.lightningCapsuleFeatureController.on(LightningCapsuleFeatureController.EVENT_ON_TARGET_NOT_FOUND, this._onLightningCapsuleFeatureEnemyNotFound, this);

		let lFireController_fc = APP.gameScreen.fireController;
		lFireController_fc.init();
		lFireController_fc.on(FireController.EVENT_ON_SHOT_REQUEST, this.onShotRequest, this);

		APP.pendingOperationController.on(GamePendingOperationController.EVENT_ON_PENDING_OPERATION_STARTTED, this._onPendingOperationStarted, this);

		this._tryToProceedNewPlayer();

		this._validateCursor();
	}

	get isAnyAnimationInProgress()
	{
		return this._fRoundResultAnimsCount_num > 0;
	}

	get isRoundResultActive()
	{
		return this.roundResultActivationInProgress || this.roundResultActive;
	}

	get isRoundResultBuyAmmoRequest()
	{
		return this._fRoundResultBuyAmmoRequest_bln;
	}

	set isRoundResultBuyAmmoRequest(aValue_bl)
	{
		this._fRoundResultBuyAmmoRequest_bln = aValue_bl;
	}

	get isRoundStatePlay()
	{
		return this._fGameStateInfo_gsi ? (this._fGameStateInfo_gsi.gameState == ROUND_STATE.PLAY) : false;
	}

	get lobbySecondaryScreenActive()
	{
		return this._fLobbySecondaryScreenActive_bln;
	}

	set lobbySecondaryScreenActive(aVal_bln)
	{
		this._fLobbySecondaryScreenActive_bln = aVal_bln;
		this._validateInteractivity();
	}

	get specialAreasMap()
	{
		return this._fSpecialAreasMap_sam;
	}

	get awardingContainerInfo()
	{
		return { container: this.view.screen, zIndex: Z_INDEXES.AWARDED_WIN_CONTENT, stackContainer: this.view.screen, keySparklesContainer: this.view.screen }
	}

	get bigWinsContainerInfo()
	{
		return { container: this.view.screen, zIndex: Z_INDEXES.BIG_WINS_CONTENT };
	}

	get mapContainers()
	{
		return this.view && this.view.mapContainers;
	}

	get laserCapsuleExplodeContainer()
	{
		return { container: this.view.screen, zIndex: Z_INDEXES.LASER_CAPSULE_EXPLOAD };
	}

	get laserCapsuleFeatureContainerInfo()
	{
		return { container: this.view.screen, zIndex: Z_INDEXES.LASER_CAPSULE_FEATURE };
	}

	get bulletCapsuleFeatureContainerInfo()
	{
		return { container: this.view.screen, zIndex: Z_INDEXES.BULLET_CAPSULE_FEATURE };
	}

	get laserFieldAnimationInfo()
	{
		return { container: this.view.screen, zIndex: Z_INDEXES.LASER_FIELD_ANIMATION };
	}

	get bulletCapsuleFieldAnimationInfo()
	{
		return { container: this.view.screen, zIndex: Z_INDEXES.BULLET_CAPSULE_FIELD_ANIMATION };
	}

	get bulletCapsuleExploasionAnimationInfo()
	{
		return { container: this.view.screen, zIndex: Z_INDEXES.BULLET_CAPSULE_EXPLOASION_ANIMATION };
	}

	get laserCapsuleLaserNetExplodeContainer()
	{
		return { container: this.view.screen, zIndex: Z_INDEXES.LASER_CAPSULE_LASER_NET_EXPLOAD };
	}

	get laserCapsuleLaserFlareExplodeContainer()
	{
		return { container: this.view.screen, zIndex: Z_INDEXES.LASER_CAPSULE_FLARE_EXPLOAD };
	}

	get lightningCapsuleOpticalFlareCyanContainer()
	{
		return { container: this.view.screen, zIndex: Z_INDEXES.LIGHTNING_CAPSULE_OPTICAL_FLARE_CYAN };
	}

	get lightningCapsuleOrbContainer()
	{
		return { container: this.view.screen, zIndex: Z_INDEXES.LIGHTNING_CAPSULE_ORB };
	}

	get moneyEnemyShockwaveContainer()
	{
		return { container: this.view.screen, zIndex: Z_INDEXES.MONEY_ENEMY_SHOCKWAVE };
	}	

	get lightningCapsuleHitAnimationInfo()
	{
		return { container: this.view.screen, zIndex: Z_INDEXES.LIGHTNING_CAPSULE_HIT_ANIMATION };
	}

	get killerCapsuleFeatureContainerInfo()
	{
		return { container: this.view.screen, zIndex: Z_INDEXES.KILLER_CAPSULE_FEATURE };
	}

	get freezeCapsuleFeatureContainerInfo()
	{
		return { container: this.view.screen, zIndex: Z_INDEXES.FREEZE_CAPSULE_FEATURE };
	}

	get powerUpMultiplierAnimationContainer()
	{
		return {container: this.view.screen, zIndex: Z_INDEXES.POWER_UP_MULTIPLIER};
	}

	get freezeAwardingContainerInfo()
	{
		return { container: this.view.screen, zIndex: Z_INDEXES.FREEZE_AWARDING };
	}

	get moneyWheelAwardingContainerInfo()
	{
		return { container: this.view.screen, zIndex: Z_INDEXES.MONEY_WHEEL_AWARDING };
	}

	get killerFieldAnimationInfo()
	{
		return { container: this.view.screen, zIndex: Z_INDEXES.GROUNDBURN }; // zIndex == GROUNDBURN for guarantee that it would be under all enemies
	}

	get transitionViewContainerInfo()
	{
		return { container: this.view, zIndex: Z_INDEXES.TRANSITION_VIEW };
	}

	get btgFinalCountingViewContainerInfo()
	{
		return { container: this.view, zIndex: Z_INDEXES.BTG_FINAL_COUNTING };
	}

	get bossAppearingFXViewContainerInfo()
	{
		return { container: this.view, zIndex: Z_INDEXES.BOSS_APPEARING_FLAMES_FX };
	}

	get bossDissappearingBottomFXContainerInfo()
	{
		return { container: this.view.screen, zIndex: Z_INDEXES.BOSS_DISAPPEARING_BOTTOM_FX };
	}

	get bossDissappearingUpperFXContainerInfo()
	{
		return { container: this.view.screen, zIndex: Z_INDEXES.BOSS_GUI_VIEW };
	}

	//TARGETING...
	get targetingContainerInfo()
	{
		return { container: this.view.screen, zIndex: Z_INDEXES.TARGETING };
	}

	get autoTargetingSwitcherContainerInfo()
	{
		return { container: this.view.screen, zIndex: Z_INDEXES.AUTO_TARGETING_SWITCHER };
	}
	//...TARGETING

	get subloadingContainerInfo()
	{
		return { container: this.view, zIndex: Z_INDEXES.SUBLOADING /*+1 to the WaitScreen*/ };
	}

	get bossModeAppearingContainerInfo()
	{
		return { container: this.view.screen, zIndex: Z_INDEXES.BOSS_APPEARING_FX, captionZIndex: Z_INDEXES.BOSS_CAPTION, bottomZIndex: Z_INDEXES.BOSS_APPEARING_BOTTOM_FX };
	}

	get bossModeDisappearingContainerInfo()
	{
		return { container: this.view.screen, zIndex: Z_INDEXES.BOSS_DISAPPEARING_FX, captionZIndex: Z_INDEXES.BOSS_CAPTION, dieRedScreenZIndex: Z_INDEXES.BOSS_DIE_RED_SCREEN, youWinZIndex: Z_INDEXES.BOSS_YOU_WIN };
	}

	get calloutsContainerInfo()
	{
		return { container: this.view.screen, zIndex: Z_INDEXES.CALLOUTS };
	}

	get bossModeHPBarContainerInfo()
	{
		return { container: this.view.screen, zIndex: Z_INDEXES.BOSS_GUI_VIEW };
	}

	get fireSettingsContainerInfo()
	{
		return { container: this.view, zIndex: Z_INDEXES.FIRE_SETTINGS };
	}

	get mainSpotContainerInfo()
	{
		return { container: this.view.screen, zIndexMainSpot: Z_INDEXES.MAIN_SPOT, zIndexBetButtons: Z_INDEXES.BET_LEVEL_BUTTON_HIT_AREA };
	}

	get scoreBoardContainerInfo()
	{
		return { container: this.view.screen, zIndex: Z_INDEXES.SCOREBOARD };
	}

	set indicatedEnemy(value)
	{
		this._fIndicatedEnemy_e = value;
	}

	get indicatedEnemy()
	{
		return this._fIndicatedEnemy_e;
	}

	addRoomGradient()
	{
		this.view && this.view.addRoomGradient();
	}

	removeRoomGradient()
	{
		this.view && this.view.removeRoomGradient();
	}

	redrawMap()
	{
		this.emit(GameFieldController.EVENT_ON_DRAW_MAP);
	}

	_onCurrentMapUpdated()
	{
		this.validateState();
	}

	validateState()
	{
		if (this._fGameStateInfo_gsi.gameState == ROUND_STATE.WAIT)
		{
			APP.gameScreen.roundFinishSoon = false;
			this.changeState(this._fGameStateInfo_gsi.gameState);
		}
		else if (this._fGameStateInfo_gsi.gameState == ROUND_STATE.PLAY)
		{
			APP.gameScreen.roundFinishSoon = false;
			this._fConnectionHasBeenRecentlyClosed_bln = false;
			this._fConnectionClosed_bln = false;
		}
	}

	updateEnemyTrajectory(enemyId, trajectory)
	{
		let enemy = this.getExistEnemy(enemyId);
		if (enemy)
		{
			enemy.updateTrajectory(trajectory);
		}
	}

	isGamePlayInProgress()
	{
		return (
			this.view && this.view.waitScreen === null &&
			this.enemies &&
			this.enemies.length > 0);
	}

	removeWaitScreen()
	{
		this.view && this.view.removeWaitScreen();
		this._checkBlur();
		this._validateCursor();
	}

	showWaitScreen()
	{
		this.view && this.view.showWaitScreen();
	}

	showBlur()
	{
		this.view && this.view.showBlur();
	}

	checkBlur()
	{
		this._checkBlur();
	}

	hideBlur()
	{
		this.view && this.view.hideBlur();
	}

	onCloseRoom()
	{
		this._onCloseRoom();
	}

	_onRoomPaused()
	{
		this.view && this.view.resetGameFieldScale();
	}

	_onWeaponUpdated(event)
	{
		this._fServerMessageWeaponSwitchExpected_bln = true;
		this._fLastRequestedWeaponId_int = event.weaponId;
	}

	_onServerMessage(event)
	{
		let messageData = event.messageData;
		let messageClass = messageData.class;

		switch (messageClass)
		{
			case SERVER_MESSAGES.KING_OF_HILL_CHANGED:
				this.showKingsOfTheHill(messageData.newKings);
				break;
		}
	}

	showKingsOfTheHill(aSeatId_int_arr)
	{
		let lSeatId_int_arr = (aSeatId_int_arr.length > 0) ? aSeatId_int_arr : this._fCurrentKingsOfTheHillSeatId_int_arr;

		if ((lSeatId_int_arr === undefined) || (lSeatId_int_arr.length === 0))
		{
			return;
		}

		for (let i = 0; i < this.info.maxPlayerInRoom; i++)
		{
			let lSeat_s = this.getSeat(i, true)

			if (lSeat_s)
			{
				lSeat_s.setBattlegroundCrownVisible(false);
			}
		}
		for (let i = 0; i < lSeatId_int_arr.length; i++)
		{
			let lSeat_s = this.getSeat(lSeatId_int_arr[i], true)
			if (lSeat_s)
			{
				lSeat_s.setBattlegroundCrownVisible(true);
			}
		}
		this._fCurrentKingsOfTheHillSeatId_int_arr = lSeatId_int_arr;
	}

	_onServerWeaponSwitchedMessage(event)
	{
		this._fLastReceivedWeaponId_int = event.messageData.weaponId;

		if (this._fLastReceivedWeaponId_int === this._fLastRequestedWeaponId_int)
		{
			this._fServerMessageWeaponSwitchExpected_bln = false;
		}
	}

	//CUSTOM CURSOR...
	_validateCursor()
	{
		APP.gameScreen.fireController.i_validateCursor();
	}
	//...CUSTOM CURSOR

	onBackToLobbyOccur()
	{
		this._fNewPlayerFlag_bln = false;
		
		this._destroyBossHealthBar(true);

		this.view.screen && this.view.screen.hide();
	}

	//RICOCHET CONTROLLER...
	get _ricochetController()
	{
		return this._fRicochetController_rc || (this._fRicochetController_rc = this._initRicochetController());
	}

	_initRicochetController()
	{
		let l_rc = new RicochetController();
		l_rc.init();
		l_rc.on(RicochetController.EVENT_ON_RICOCHET_BULLETS_UPDATED, this.emit, this);
		l_rc.on(RicochetController.EVENT_ON_RICOCHET_BULLETS_PAYBACK_REQUIRED, this._onRicochetBulletsPaybackRequired, this);

		return l_rc;
	}

	_onRicochetBulletsPaybackRequired(aEvent_obj)
	{
		APP.gameScreen.revertAmmoBack(aEvent_obj.weaponId, aEvent_obj.betLevel, false, false, aEvent_obj.currentBullets);
	}
	//...RICOCHET CONTROLLER

	//BATTLEGROUND FINAL COUNTING...
	get isFinalCountingFireDenied()
	{
		return this._battlegroundFinalCountingController && this._battlegroundFinalCountingController.info.isFinalCountingFireDenied;
	}
	
	get _battlegroundFinalCountingController()
	{
		return this._fBattlegroundFinalCountingController_fcc || (this._fBattlegroundFinalCountingController_fcc = this._initBattlegroundFinalCountingController());
	}

	_initBattlegroundFinalCountingController()
	{
		let l_fsc = new BattlegroundFinalCountingController(new BattlegroundFinalCountingInfo(), this._battlegroundFinalCountingView);
		return l_fsc;
	}

	get _battlegroundFinalCountingView()
	{
		return this._fBattlegroundFinalCountingView_bfcv || (this._fBattlegroundFinalCountingView_bfcv = this._initBattlegroundFinalCountingView());
	}

	_initBattlegroundFinalCountingView()
	{
		const l_bfcv = this.view.screen.addChild(new BattlegroundFinalCountingView());
		l_bfcv.position.set(480, 270); //960 / 2, 540 / 2
		l_bfcv.zIndex = Z_INDEXES.BTG_FINAL_COUNTING;

		return l_bfcv;
	}
	//...BATTLEGROUND FINAL COUNTING

	//BOSS HP BAR...
	_onBossDeath()
	{
		this.emit(GameFieldController.EVENT_ON_BOSS_HP_BAR_DESTROYING, { skipAnimation: false });
	}

	_destroyBossHealthBar(aSkipAnimation_bl = false)
	{
		this.emit(GameFieldController.EVENT_ON_BOSS_HP_BAR_DESTROYING, { skipAnimation: aSkipAnimation_bl });
	}
	//...BOSS HP BAR

	get _isFrbMode()
	{
		return APP.currentWindow.gameFrbController.info.frbMode;
	}

	get _isBonusMode()
	{
		return APP.currentWindow.gameBonusController.info.isActivated;
	}

	_onPlayerInfoUpdated(event)
	{
		if (event.class == SERVER_MESSAGES.ROUND_RESULT)
		{
			this._fRoundResultResponseReceived_bl = true;
		}
		else if (event.class == SERVER_MESSAGES.GET_ROOM_INFO_RESPONSE)
		{
			if (
				event.data
				&& event.data.betLevel
				&& event.data.betLevel.value === APP.playerController.info.betLevel
				) {
					this._fServerMessageWeaponSwitchExpected_bln = false;
				}
				

			if (this._isFrbMode)
			{
				if (!APP.currentWindow.gameFrbController.info.frbEnded)
				{
					this._fExternalBalanceUpdated_bl = false;
				}
			}
		}
		else if ((event.data.balance !== undefined) && (this.roundResultActivationInProgress || this.roundResultActive || APP.currentWindow.gameFrbController.info.frbEnded))
		{
			this._fExternalBalanceUpdated_bl = true;

			if (this._isBonusMode)
			{
				let lBonusInfo_gbi = APP.currentWindow.gameBonusController.info;
				if (lBonusInfo_gbi.isWinLimitExceeded)
				{
					this._forceRoundResult();
				}
			}
		}
		!this._fConnectionClosed_bln && APP.gameScreen.balanceController.updatePlayerBalance();
	}

	_onFRBEndedCompleted()
	{
		this._fExternalBalanceUpdated_bl = false;
	}

	onFRBEnded()
	{
		APP.gameScreen.balanceController.updatePlayerBalance();
	}

	_onTickerResumed()
	{
		APP.gameScreen.balanceController.updatePlayerBalance();
	}

	isGameplayStarted()
	{
		return this.view.screen !== null;
	}

	startGamePlay()
	{
		if (!this.view.screen)
		{
			this.view.screen = new GameFieldScreen();

			this.gameplayDialogScreen = this.view.addChild(new Sprite());

			this._fFreezeGroundContainer_sprt = this.view.screen.addChild(new Sprite());
			this._fFreezeGroundContainer_sprt.zIndex = Z_INDEXES.GROUNDBURN;
			
			if (APP.isBattlegroundGame)
			{
				APP.gameScreen.battlegroundTutorialController.init();
				APP.gameScreen.battlegroundTutorialController.initView(this.gameplayDialogScreen);
			}

			APP.gameScreen.gameplayDialogsController.init();
			APP.gameScreen._fGameplayDialogController_gdsc.initView(this.gameplayDialogScreen);
			this.gameplayDialogScreen.zIndex = Z_INDEXES.COUNT_DOWN;

			this._fMissEffectsPool_mep = this.view.screen.addChild(new MissEffectsPool());
			this._fMissEffectsPool_mep.zIndex = Z_INDEXES.MISS_EFFECT;
			this._battlegroundFinalCountingController.init();
			
			if (APP.isBattlegroundGame)
			{
				APP.gameScreen.scoreboardController; // for init
			}

			this.emit(GameFieldController.EVENT_ON_GAME_FIELD_SCREEN_CREATED);

			this._moneyWheelController.init();
			this._moneyWheelController.on(MoneyWheelController.EVENT_ON_MONEY_WHEEL_OCCURED, this._onMoneyWheelOccured, this);

			this.bombController.init();
			this.bombController.on(BombController.EVENT_ON_BOMB_OCCURED, this._onBombOccured, this);
			this.bombController.on(BombController.EVENT_ON_SHOW_DELAYED_AWARD, this._onShowDalayedBombAward, this);
		}

		this.view.container.addChild(this.view.screen);
		this.view.screen.position.set(-480, -270);

		this._fLobbySecondaryScreenActive_bln = false;
		this._checkBlur();

		this.redrawMap();
		this.addRoomGradient();

		this._fGameStateController_gsc.on(GameStateController.EVENT_ON_GAME_STATE_CHANGED, this._onGameRoundStateChanged, this);
	}

	_isDialogViewBlurForbidden(aDialogId_int)
	{
		switch(aDialogId_int)
		{
			case DIALOG_ID_INSUFFICIENT_FUNDS:
			case DIALOG_ID_BATTLEGROUND_NOT_ENOUGH_PLAYERS:
			case DIALOG_ID_BATTLEGROUND_BUY_IN_CONFIRMATION:
			case DIALOG_ID_BATTLEGROUND_COUNT_DOWN:
			case DIALOG_ID_BATTLEGROUND_RULES:
			case DIALOG_ID_BATTLEGROUND_CAF_ROOM_MANAGER:
				return true;
		}

		return false;
	}

	_onDialogActivated(e)
	{
		if (this._isDialogViewBlurForbidden(e.dialogId))
		{
			return;
		}

		this._fDialogActivated_bln = true;
		this.showBlur();
	}

	_onDialogDectivated()
	{
		this._fDialogActivated_bln = false;
		this._checkBlur();
		this._validateCursor();
	}

	_checkBlur()
	{
		if (this.roundResultActive ||
			this.lobbySecondaryScreenActive ||
			APP.gameScreen.compensationDialogActive ||
			this._fDialogActivated_bln
		)
		{
			this.showBlur();
		}
		else
		{
			this.hideBlur();
		}
	}

	_onGameRoundStateChanged(event)
	{
		if (event.value === ROUND_STATE.PLAY)
		{
			this._fCurrentKingsOfTheHillSeatId_int_arr = [];
			APP.gameScreen.roundFinishSoon = false;
			this._fConnectionHasBeenRecentlyClosed_bln = false;
			this._fConnectionClosed_bln = false;
		}

		this._validateWeaponsBlockAvailability();
		APP.gameScreen.balanceController.tryToBuyAmmoFromRoundResult();
	}

	_validateWeaponsBlockAvailability()
	{
		let lAllowWeaponsBlockInteraction_bl = true;

		this._onInteractionChanged(lAllowWeaponsBlockInteraction_bl);
	}

	_onInteractionChanged(aAllow_bln)
	{
		this.emit(GameFieldController.EVENT_ON_WEAPONS_INTERACTION_CHANGED, { allowed: aAllow_bln })
	}

	_validateInteractivity()
	{
		this.view.interactive = !this._fFireSettingsScreenActive_bln;
		this._validateCursor();
	}

	//...BUY WEAPON SCREEN CONTROLLER

	// MONEY WHEEL...
	get _moneyWheelController()
	{
		return this._fMoneyWheelController_mwc || (this._fMoneyWheelController_mwc = this._initMoneyWheelController());
	}

	_initMoneyWheelController()
	{
		const l_kqpc = new MoneyWheelController(new MoneyWheelInfo(), this._moneyWheelView);
		return l_kqpc;
	}

	get _moneyWheelView()
	{
		return this._fMoneyWheelView_mwv || (this._fMoneyWheelView_mwv = this._initMoneyWheelView());
	}

	_initMoneyWheelView()
	{
		const l_kqpv = this.view.screen.addChild(new MoneyWheelView());
		l_kqpv.position.set(0, 0);
		l_kqpv.zIndex = Z_INDEXES.MONEY_WHEEL;

		return l_kqpv;
	}

	_onMoneyWheelOccured()
	{
		if (this._fAllAnimationsEndedTimer_t || this._fRoundResultActive_bln && this._moneyWheelController && this._moneyWheelController.isAnimInProgress)
		{
			this._moneyWheelController.interruptAnimations();
		}
	}

	// ...MONEY WHEEL

	// BOMB...
	get _bombController()
	{
		return this._fBombController_bc || (this._fBombController_bc = this._initBombController());
	}

	_initBombController()
	{
		const l_kqpc = new BombController(new BombInfo(), this._BombView);

		return l_kqpc;
	}

	get _BombView()
	{
		return this._fBombView_bv || (this._fBombView_bv = this._initBombView());
	}

	_initBombView()
	{
		const l_kqpv = this.view.screen.addChild(new BombView());
		l_kqpv.position.set(APP.config.size.width / 2, APP.config.size.height / 2);
		l_kqpv.zIndex = Z_INDEXES.BOMB;

		return l_kqpv;
	}

	_onBombOccured()
	{
		if (this._fAllAnimationsEndedTimer_t || this._fRoundResultActive_bln && this.bombController && this.bombController.isAnimInProgress)
		{
			this.bombController.interruptAnimations();
		}
	}
	// ...BOMB

	//ROUND RESULT SCREEN CONTROLLER...
	get _roundResultScreenController()
	{
		return this._fRoundResultScreenController_bwsv || (this._fRoundResultScreenController_bwsv = this._initRoundResultScreenController());
	}

	_initRoundResultScreenController()
	{
		let l_rrsc = new RoundResultScreenController(new RoundResultScreenInfo(), this._roundResultScreenView, this);

		l_rrsc.on(RoundResultScreenController.EVENT_ON_NEXT_ROUND_CLICKED , this._onRoundResultNextRoundClicked, this);
		l_rrsc.on(RoundResultScreenController.EVENT_ON_BATTLEGROUND_NEXT_ROUND_CLICKED, this.emit, this);
		l_rrsc.on(RoundResultScreenController.EVENT_ON_ROUND_RESULT_SCREEN_ACTIVATION_START, this.emit, this);


		return l_rrsc;
	}

	onRoundResultNextRoundClicked()
	{
		this._onRoundResultNextRoundClicked();
	}

	_onRoundResultNextRoundClicked()
	{
		this.tryRoundResultBuyAmmoRequestAllowing();

		APP.gameScreen.balanceController.tryToBuyAmmoFromRoundResult(true);
	}

	tryRoundResultBuyAmmoRequestAllowing()
	{
		this._fRoundResultBuyAmmoRequest_bln = this._isFrbMode ? false : true;
	}

	//https://jira.dgphoenix.com/browse/MQPRT-343...
	_tryToBuyAmmoOnRoundStart()
	{
		let lRoundResultActive_bln = this.roundResultActivationInProgress || this.roundResultActive;
		if (
			this._fWeaponsInfo_wsi.ammo == 0
			&& (
				!lRoundResultActive_bln
				|| this._isBonusMode
				|| this._fTournamentModeInfo_tmi.isTournamentMode
			)
		)
		{
			let lPlayerInfo_pi = APP.playerController.info;
			let lBalance_num = lPlayerInfo_pi.balance;
			let lCurrentStake_num = APP.playerController.info.currentStake;
			if (lBalance_num >= lCurrentStake_num)
			{
				if (this._isBonusMode || this._fTournamentModeInfo_tmi.isTournamentMode)
				{
					//convert balance into ammo for Cash Bonus/tournaments mode
					this.emit(GameFieldController.EVENT_ON_TIME_TO_CONVERT_BALANCE_TO_AMMO, { ammoAmount: ~~(lBalance_num / lCurrentStake_num) });
					APP.gameScreen.balanceController.updatePlayerBalance();

				}
				else
				{
					APP.gameScreen.balanceController.tryToBuyAmmo();
				}
			}
		}
	}
	//...https://jira.dgphoenix.com/browse/MQPRT-343

	_onRoundResultScreenActivated(e)
	{
		this._fRoundResultActive_bln = true;
		this._fCurrentKingsOfTheHillSeatId_int_arr = [];

		this.emit(GameFieldController.EVENT_ON_ROUND_RESULT_SCREEN_ACTIVATED);

		this._validateCursor();

		if (!APP.currentWindow.gameStateController.info.isGameInProgress)
		{
			this.clearRoom(true);
		}

		if (!this._isFrbMode)
		{
			APP.gameScreen.balanceController.resetPlayerWin();
		}

		if (APP.isBattlegroundGame)
		{
			this._fRestoreAfterFreeShotsWeaponId_int = undefined;
			if (this.spot)
			{
				this.spot.onBetChangeConfirmed(APP.playerController.info.betLevel, false);
			}
			console.log("FireProblem_ change weapon call 2");
			this.changeWeapon(WEAPONS.DEFAULT);

			this._resetCoPlayersWeaponsIfRequired(true);
		}

		this._validateUIBlur();
		this.showBlur();

		APP.gameScreen.balanceController.updatePlayerBalance();

		if (this._fGameStateWaitIsWatingBattlegroundRoundResult_bl)
		{
			this._fGameStateWaitIsWatingBattlegroundRoundResult_bl = false;
			this._completeActionsOnRoundStateWait();
		}

		APP.gameScreen.onRoundResultActivated(e);
	}

	_onRoundResultDeactivatedOrSkipped()
	{
		this._onRoundResultScreenDeactivated();
	}

	_onRoundResultScreenDeactivated()
	{
		this._fRoundResultActive_bln = false;
		this._fRoundResultResponseReceived_bl = false;
		this._fExternalBalanceUpdated_bl = false;
		this._fServerMessageWeaponSwitchExpected_bln = false;
		this._fRoundResultOnLasthandWaitState_bln = false;

		if (!APP.currentWindow.isBackToLobbyRequired)
		{
			this.changeState(this._fGameStateInfo_gsi.gameState);

			if (!this._roundResultScreenController.info.isActiveScreenMode)	
			{
				this.tryRoundResultBuyAmmoRequestAllowing();
			}
			APP.gameScreen.balanceController.tryToBuyAmmoFromRoundResult();
		}

		this.emit(GameFieldController.EVENT_ON_ROUND_RESULT_SCREEN_DEACTIVATED);
		this._validateCursor();
		this._validateWeaponsBlockAvailability();
		this._validateUIBlur();

		this._checkBlur();
	}

	get roundResultActivationInProgress()
	{
		return this._roundResultScreenController.info.roundResultResponseRecieved || this._fRoundResultResponseReceived_bl;
	}

	get roundResultActive()
	{
		return this._fRoundResultActive_bln;
	}
	//...ROUND RESULT SCREEN CONTROLLER

	//ROUND RESULT SCREEN VIEW...
	get _roundResultScreenView()
	{
		return this._fRoundResultScreenView_bwsv || (this._fRoundResultScreenView_bwsv = this._initRoundResultScreenView());
	}

	_tryToProceedNewPlayer()
	{
		if (APP.playerController.info.isNewbie)
		{
			this._fNewPlayerFlag_bln = true;
		}
	}

	_initRoundResultScreenView()
	{
		let l_rrsv = undefined;

		if (APP.isBattlegroundGame)
		{
			l_rrsv = new BattlegroundResultScreenView();
		}
		else
		{
			l_rrsv = new RoundResultScreenView();
		}

		this.view.addChild(l_rrsv);
		l_rrsv.zIndex = Z_INDEXES.ROUND_RESULT;

		return l_rrsv;
	}
	//...ROUND RESULT SCREEN VIEW

	_onCloseRoom()
	{
		this._fWeaponToRestore_int = null;
		this._fRestoreAfterFreeShotsWeaponId_int = undefined;
	}

	shakeTheGround(aShakingType_str, aOptResetExistingShaking_bl)
	{
		this.view && this.view.shakeTheGround(aShakingType_str, aOptResetExistingShaking_bl);
	}

	changeState(state)
	{
		if (typeof state != "string")
		{
			return;
		}

		switch (state)
		{
			case ROUND_STATE.PLAY:

				if (this._fGameStateWaitIsWatingBattlegroundRoundResult_bl)
				{
					this._fGameStateWaitIsWatingBattlegroundRoundResult_bl = false;
				}

				this._validateWeaponsBlockAvailability();
				this.redrawMap();
				this.addRoomGradient();

				this.emit(GameFieldController.EVENT_ON_NEW_ROUND_STATE, { state: true });
				this.focusUI();
				this.showUI();
				this.removeTimeLeftText();

				if (this.spot) //I'm player, not observer
				{
					if (this._fNewPlayerFlag_bln) //Leave new player with default gun
					{
						this.tryToChangeWeapon(WEAPONS.DEFAULT);
					}
					else
					{
						if (this._fWeaponToRestore_int != null)
						{
							if (this._fWeaponToRestore_int !== null) lWeaponToRestore_num = this._fWeaponToRestore_int;
							this._selectRememberedWeapon(lWeaponToRestore_num);
							this._fWeaponToRestore_int = null;
						}
					}

					this.redrawAmmoText();
					this._tryToBuyAmmoOnRoundStart();
				}

				let awardingController = APP.currentWindow.awardingController;
				awardingController.removeAllAwardings();

				// cursor validation...
				this._validateInteractivity();
				this.validateCursor();
				// ...cursor validation
				break;

			case ROUND_STATE.WAIT:
				if (!APP.currentWindow.isKeepSWModeActive)
				{
					this._fWeaponToRestore_int = null;
				}
				if (this._fGameStateWaitIsWatingBattlegroundRoundResult_bl)
				{
					break;
				}

				this._completeActionsOnRoundStateWait();
				break;

			case ROUND_STATE.QUALIFY:
				if (APP.isBattlegroundGame)
				{
					this._fGameStateWaitIsWatingBattlegroundRoundResult_bl = true;
				}
				if (!APP.currentWindow.isKeepSWModeActive)
				{
					this._fWeaponToRestore_int = null;
				}
				this._onBossDeath();

				this._fRoundResultOnLasthandWaitState_bln = false;
				this._startListenForRoundEnd();
				if (this.seatId != -1)
				{
					this.removeWaitScreen();
				}
				break;
		}

		if (!this.isBossEnemyExist)
		{
			this._destroyBossHealthBar();
		}
		this._validateCursor();
	}

	_completeActionsOnRoundStateWait()
	{
		this._checkForIncompleteRoundAnimations();
		this._stopListenForRoundEnd();
		if (!this.roundResultActive && this.seatId != -1)
		{
			this.addTimeLeftText();
		}

		if (this.playersContainer)
		{
			for (let seat of this.playersContainer.children)
			{
				seat.currentScore = 0;
			}
		}
		this.redrawMap();
		APP.gameScreen.balanceController.updatePlayerBalance();
		this.emit(GameFieldController.EVENT_ON_WAITING_NEW_ROUND);

		this._resetCoPlayersWeaponsIfRequired();
	}

	_resetCoPlayersWeaponsIfRequired(aIsIgnoreWaitState_bl = false)
	{
		let lPlayerInfo_pi = APP.playerController.info;
		let lGameStateInfo_gsi = APP.currentWindow.gameStateController.info;

		if (
			APP.isBattlegroundGame
			&& (lGameStateInfo_gsi.isWaitState || aIsIgnoreWaitState_bl)
			&& this.playersContainer
		)
		{
			// reset for the case if we still havn't got WeaponSwitched for the player in QUALIFY state (ex., if his socket was aborted)
			for (let seat of this.playersContainer.children)
			{
				let player = this.getPlayerBySeatId(seat.id);

				if (player.betLevel !== lPlayerInfo_pi.roomDefaultBetLevel)
				{
					player.betLevel = lPlayerInfo_pi.roomDefaultBetLevel;

					let lSpotCurrentDefaultWeaponId_int = lPlayerInfo_pi.getTurretSkinId(player.betLevel);
					console.log("FireProblem_ change weapon call 3");
					seat.changeWeapon(WEAPONS.DEFAULT, lSpotCurrentDefaultWeaponId_int, true);
				}
			}
		}
	}

	_startListenForRoundEnd()
	{
		this._stopListenForRoundEnd();

		this._fRoundResultAnimsCount_num = 0;

		APP.gameScreen.fireController.i_clearBulletsIfRequired();

		for (let enemy of this.enemies)
		{
			++this._fRoundResultAnimsCount_num;

			let eventType = enemy.isBoss ? Enemy.EVENT_ON_DEATH_ANIMATION_COMPLETED : Enemy.EVENT_ON_ENEMY_DESTROY;
			enemy.once(eventType, this._onRREnemyDeathCompleted, this);

			this._fRoundEndListenHandlers_arr.push({
				obj: enemy,
				event: eventType,
				handler: this._onRREnemyDeathCompleted
			});
		}

		for (let enemy of this.deadEnemies)
		{
			++this._fRoundResultAnimsCount_num;
			enemy.once(Enemy.EVENT_ON_ENEMY_DESTROY, this._onRREnemyDestroyed, this);

			this._fRoundEndListenHandlers_arr.push({
				obj: enemy,
				event: Enemy.EVENT_ON_ENEMY_DESTROY,
				handler: this._onRREnemyDestroyed
			});
		}

		let awardingController = APP.currentWindow.awardingController;
		if (awardingController && awardingController.isAnyAwardingInProgress)
		{
			++this._fRoundResultAnimsCount_num;
			awardingController.once(AwardingController.EVENT_ON_ALL_ANIMATIONS_COMPLETED, this._onAwardsAnimationsCompleted, this);

			this._fRoundEndListenHandlers_arr.push({
				obj: awardingController,
				event: AwardingController.EVENT_ON_ALL_ANIMATIONS_COMPLETED,
				handler: this._onAwardsAnimationsCompleted
			});
		}

		if (this._fIsWeaponAddingInProgress_bl)
		{
			++this._fRoundResultAnimsCount_num;
			this.once(GameFieldController.EVENT_ON_END_SHOW_WEAPON, this._onEndShowWeapon, this);

			this._fRoundEndListenHandlers_arr.push({
				obj: this,
				event: GameFieldController.EVENT_ON_END_SHOW_WEAPON,
				handler: this._onEndShowWeapon
			});
		}

		let bigWinsController = APP.currentWindow.bigWinsController;
		if (bigWinsController && bigWinsController.isAnyBigWinInProgress)
		{
			++this._fRoundResultAnimsCount_num;
			bigWinsController.once(BigWinsController.EVENT_ON_ALL_ANIMATIONS_COMPLETED, this._onBigWinsAnimationsCompleted, this);
			this._fRoundEndListenHandlers_arr.push({
				obj: bigWinsController,
				event: BigWinsController.EVENT_ON_ALL_ANIMATIONS_COMPLETED,
				handler: this._onBigWinsAnimationsCompleted
			});

			bigWinsController.once(BigWinsController.EVENT_ON_ANIMATION_INTERRUPTED, this._onBigWinsAnimationsInterrupted, this);
			this._fRoundEndListenHandlers_arr.push({
				obj: bigWinsController,
				event: BigWinsController.EVENT_ON_ANIMATION_INTERRUPTED,
				handler: this._onBigWinsAnimationsInterrupted,
			});
		}

		let scoreboardController = APP.gameScreen.scoreboardController;
		if (scoreboardController && scoreboardController.isAnimationsPlaying)
		{
			++this._fRoundResultAnimsCount_num;
			scoreboardController.once(ScoreboardController.EVENT_ON_BOSS_ROUND_MODE_HIDDEN, this._onScoreBoardAnimationsCompleted, this);
			this._fRoundEndListenHandlers_arr.push({
				obj: scoreboardController,
				event: ScoreboardController.EVENT_ON_BOSS_ROUND_MODE_HIDDEN,
				handler: this._onScoreBoardAnimationsCompleted,
			});
		}


		const moneyWheelController = this.moneyWheelController;
		if ((moneyWheelController && moneyWheelController.isAnimInProgress) || awardingController.isAnyMoneyWheelAwardExpected)
		{
			++this._fRoundResultAnimsCount_num;
			moneyWheelController.once(MoneyWheelController.EVENT_ON_ALL_ANIMATIONS_COMPLETED, this._onMoneyWheelsAnimationsCompleted, this);
			this._fRoundEndListenHandlers_arr.push({
				obj: moneyWheelController,
				event: MoneyWheelController.EVENT_ON_ALL_ANIMATIONS_COMPLETED,
				handler: this._onMoneyWheelsAnimationsCompleted,
			});
		}

		const BombController = this.bombController;
		if ((BombController && BombController.isAnimInProgress) || awardingController.isAnyBombAwardExpected)
		{
			++this._fRoundResultAnimsCount_num;
			BombController.once(BombController.EVENT_ON_ALL_ANIMATIONS_COMPLETED, this._onBombsAnimationsCompleted, this);
			this._fRoundEndListenHandlers_arr.push({
				obj: BombController,
				event: BombController.EVENT_ON_ALL_ANIMATIONS_COMPLETED,
				handler: this._onBombsAnimationsCompleted,
			});
		}

		let freezeController = APP.gameScreen.freezeCapsuleFeatureController;
		if (freezeController.isFreezingInProgress)
		{
			++this._fRoundResultAnimsCount_num;
			APP.gameScreen.once(freezeController.EVENT_ON_UNFREEZE_AFFECTED_ENEMIES, this._onFreezeAnimationsCompleted, this);

			this._fRoundEndListenHandlers_arr.push({
				obj: freezeController,
				event: freezeController.EVENT_ON_ALL_COMPLETED_QUESTS_ANIMATIONS_COMPLETED,
				handler: this._onFreezeAnimationsCompleted
			});
		}

		if (this._fRoundResultAnimsCount_num == 0)
		{
			this.onNextAnimationEnd();
		}
	}

	_onRREnemyDeathCompleted()
	{
		this.onNextAnimationEnd();
	}

	_onEndShowWeapon()
	{
		this.onNextAnimationEnd();
	}

	_onRREnemyDestroyed()
	{
		this.onNextAnimationEnd();
	}

	_onAwardsAnimationsCompleted()
	{
		this.onNextAnimationEnd();
	}

	_onBigWinsAnimationsCompleted()
	{
		this.onNextAnimationEnd();
	}

	_onBigWinsAnimationsInterrupted()
	{
		this.onNextAnimationEnd();
	}

	_onMoneyWheelsAnimationsCompleted()
	{
		this.onNextAnimationEnd();
	}

	_onScoreBoardAnimationsCompleted()
	{
		this.onNextAnimationEnd();
	}

	_onBombsAnimationsCompleted()
	{
		this.onNextAnimationEnd();
	}

	_onCompletedQuestsAnimationsCompleted()
	{
		this.onNextAnimationEnd();
	}

	_onFreezeAnimationsCompleted()
	{
		this.onNextAnimationEnd();
	}

	_onGunUnlockedBeforeRoundEnd()
	{
		this._stopListenForRoundEnd();
		this._startListenForRoundEnd(); //check from the beginning
	}

	onNextAnimationEnd()
	{
		--this._fRoundResultAnimsCount_num;
		if (this._fRoundResultAnimsCount_num <= 0)
		{
			this._destroyAnimationsEndTimer();
			this._fAllAnimationsEndedTimer_t = new Timer(this._onAllAnimationsEnd.bind(this), 100);
			this._stopListenForRoundEnd();
		}
	}

	_onAllAnimationsEnd()
	{
		this._destroyAnimationsEndTimer();
		this.emit(GameFieldController.EVENT_ON_NEW_ROUND_STATE, { state: (this._fGameStateInfo_gsi.gameState === ROUND_STATE.PLAY) });
	}

	_destroyAnimationsEndTimer()
	{
		this._fAllAnimationsEndedTimer_t && this._fAllAnimationsEndedTimer_t.destructor();
		this._fAllAnimationsEndedTimer_t = null;
	}

	_checkForIncompleteRoundAnimations()
	{
		if (this._fRoundResultAnimsCount_num > 0)
		{
			this.clearRoom(true);

			this._forceRoundResult();
		}
	}

	_forceRoundResult()
	{
		this._stopListenForRoundEnd();
		this.emit(GameFieldController.EVENT_ON_ROUND_RESULT_FORCED);
		this.emit(GameFieldController.EVENT_ON_NEW_ROUND_STATE, { state: (this._fGameStateInfo_gsi.gameState === ROUND_STATE.PLAY) });
	}

	_stopListenForRoundEnd()
	{
		for (let i = 0; i < this._fRoundEndListenHandlers_arr.length; ++i)
		{
			let lObj = this._fRoundEndListenHandlers_arr[i].obj;
			let lEvent = this._fRoundEndListenHandlers_arr[i].event;
			let lHandler = this._fRoundEndListenHandlers_arr[i].handler;

			if (this._fRoundEndListenHandlers_arr[i].obj)
			{
				lObj.off(lEvent, lHandler, this);
			}
		}

		this._fRoundEndListenHandlers_arr = [];

		this._fRoundResultAnimsCount_num = 0;
	}

	_onTournamentModeServerStateChanged()
	{
		if (this._fTournamentModeInfo_tmi.isTournamentOnServerCompletedState)
		{
			if (this._fRoundResultAnimsCount_num > 0)
			{
				for (let enemy of this.enemies)
				{
					if (enemy.life != 0 || enemy.isDeathOutroAnimationStarted) continue;

					this.onNextAnimationEnd();
				}
			}
		}
	}

	_onTournamentModeClientStateChanged()
	{
		if (this._fTournamentModeInfo_tmi.isTournamentOnClientCompletedState)
		{
			this.removeWaitScreen();
		}
	}

	blurUI()
	{
		if (APP.isBattlegroundGame)
		{
			return;
		}

		this.spot && this.spot.blurSpot();

		for (var i = 0; i < this.players.length; ++i)
		{
			let curCoPlayer = this.players[i].spot;
			curCoPlayer && curCoPlayer.blurSpot();
		}
	}

	focusUI()
	{
		this.spot && this.spot.focusSpot()

		for (var i = 0; i < this.players.length; ++i)
		{
			let curCoPlayer = this.players[i].spot;
			curCoPlayer && curCoPlayer.focusSpot();
		}
	}

	_validateUIBlur()
	{
		switch (this._fGameStateInfo_gsi.gameState)
		{
			case ROUND_STATE.QUALIFY:
			case ROUND_STATE.WAIT:
				this.blurUI();
				break;
			case ROUND_STATE.PLAY:
				this.focusUI();
				break;
		}
	}

	showUI()
	{
		if (this.spot && this.spot.weaponSpotView) this.spot.weaponSpotView.visible = true;
		if (this.spot)
		{
			this.spot.visible = true;
		}
		if (this.playersContainer) this.playersContainer.visible = true;
	}

	closeRoom()
	{
		this.clearRoom();
		APP.gameScreen.balanceController.resetPlayerWin();
		this._fMidRoundExitDialogActive_bln = false;
		this._fBonusDialogActive_bln = false;
		this._fFRBDialogActive_bln = false;
		this._fDialogActivated_bln = false;
		this._checkBlur();
		this._roundResultScreenController.hideScreen();

		this.emit('roomFieldClosed');
	}

	_onBossModeAppearingShakeTheGroundRequired()
	{
		this.shakeTheGround("bossAppearing");
	}

	clearRoom(keepPlayersOnScreen = false, clearMasterPlayerInfo = true, aClearRicochetBullets_bl = false)
	{
		if (aClearRicochetBullets_bl)
		{
			APP.gameScreen.fireController.i_clearBulletsIfRequired();
		}

		this.emit(GameFieldController.EVENT_ON_CLEAR_ROOM_STARTED);

		this._fDelayedLaserExploasionHits_obj_arr = [];
		this._fDelayedBombExploasionHits_obj_arr = [];
		this._fDelayedBulletExploasionHits_obj = {};
		this._fDelayedLightningExplosionHits_obj = {};
		this._fDelayedKillerExplosionHits_obj_arr = [];

		this.focusUI();
		this.removeWaitScreen();
		this.removeTimeLeftText();

		APP.gameScreen.fireController.i_clearRoom();

		this.removeAllEnemies();
		this.removeAllFxAnimations();

		this._stopListenForRoundEnd();
		this.shotRequestsAwaiting_num = 0;
		this._fWeaponSwitchTry_bln = false;
		this._fWeaponSwitchInProgress_bln = false;
		this._fUnpresentedWeaponSurplus_num = null;
		this._fBossModeController_bmc && (this._fBossModeController_bmc.bossNumberShots = 0);

		this.view && this.view.clearRoom();

		if (this.playersContainer)
		{
			Sequence.destroy(Sequence.findByTarget(this.playersContainer));
			this.playersContainer.position.set(0, 0);
		}

		if (this.spot)
		{
			Sequence.destroy(Sequence.findByTarget(this.spot));
			this.spot.position.set(this.playerPosition.x, this.playerPosition.y);
			this.spot.resetWaitingBetLevelChange();
		}

		if (this.spot && APP.isBattlegroundGame)
		{
			this.spot.forceLevelUps();
		}

		if (keepPlayersOnScreen)
		{
			APP.gameScreen.playersSpotsController.resetPlayersSpotValues();

			if (this.playersContainer)
			{
				for (let seat of this.playersContainer.children)
				{
					let targetWeaponSpotView = seat.weaponSpotView;
					if (targetWeaponSpotView.pushSequence && !isNaN(targetWeaponSpotView.startPosX) && !isNaN(targetWeaponSpotView.startPosY))
					{
						targetWeaponSpotView.pushSequence.stop();
						targetWeaponSpotView.pushSequence.destructor();
						targetWeaponSpotView.pushSequence = null;

						targetWeaponSpotView.x = targetWeaponSpotView.startPosX;
						targetWeaponSpotView.y = targetWeaponSpotView.startPosY;
					}

					targetWeaponSpotView.gun.resetGun();
				}
			}
		}
		else
		{
			if (this.roundResultActive)
			{
				this._roundResultScreenController.showScreen(true);
			}

			this.resetBalanceFlags();
			this.endShowWeapon();

			if (this.spot)
			{
				APP.gameScreen.playersSpotsController.clearSpot();
			}

			this._removeAllPlayersSpots(clearMasterPlayerInfo);
			this.redrawAmmoText();
		}

		this._destroyCurChangeWeaponTimerInfo();

		if (this._fGameStateInfo_gsi.gameState == ROUND_STATE.PLAY && !keepPlayersOnScreen)
		{
			let l_wci = this._fWeaponsController_wsc.i_getInfo();
			let lIsLastFreeShot_bln = l_wci.isFreeWeaponsQueueActivated && l_wci.currentWeaponId != WEAPONS.DEFAULT && !l_wci.remainingSWShots;
			if (!lIsLastFreeShot_bln)
			{
				this.rememberWeaponToRestore();
			}
		}

		this._validateInteractivity();

		// clear this.view.screen ...
		this.removeRoomGradient();
		// ... clear this.view.screen

		this.emit(GameFieldController.EVENT_ON_ROOM_FIELD_CLEARED, { keepPlayersOnScreen: keepPlayersOnScreen });

		if (!this._isFrbMode && !APP.isBattlegroundGame)
		{
			APP.gameScreen.balanceController.resetPlayerWin();
		}

		if (!this.isBossEnemyExist)
		{
			this._destroyBossHealthBar(true);
		}
	}

	_onDelayedShotRemoved(aEvent_obj)
	{
		if (this._fGameStateInfo_gsi.isPlayState || this._isFrbMode)
		{
			APP.gameScreen.revertAmmoBack(aEvent_obj.weaponId, aEvent_obj.betLevel, false, false, 1);
		}
	}

	onConnectionClosedHandled()
	{
		this._fWeaponSwitchInProgress_bln = false;

		this._destroyCurChangeWeaponTimerInfo();
		this._fConnectionClosed_bln = true;

		this._fConnectionHasBeenRecentlyClosed_bln = true;


		if (!this._isFrbMode && !APP.isBattlegroundGame)
		{
			APP.gameScreen.balanceController.resetPlayerWin();
		}
	}

	onConnectionOpenedHandled()
	{
		this._fConnectionClosed_bln = false;
		if (!this._isFrbMode && !APP.isBattlegroundGame)
		{
			APP.gameScreen.balanceController.resetPlayerWin();
		}
	}

	/*special for game pause: when player exits to lobby, open secondary screen or change active tab*/
	hideRoom()
	{
		this._fWeaponsController_wsc && this.getNextWeaponFromTheQueue();
		APP.gameScreen.fireController.i_clearBulletsIfRequired();
		this.clearRoom(false, false);
	}

	/*special for game unpause: when player return to game from lobby or another tab, or close secondary screen*/
	resetBalanceFlags()
	{
		this._fRoundResultResponseReceived_bl = false;

		if (!this.roundResultActive)
		{
			this._fExternalBalanceUpdated_bl = false;
		}
	}

	showRoom(state)
	{
		if (typeof state != "string")
		{
			return;
		}

		switch (state)
		{
			case ROUND_STATE.PLAY:
				this.focusUI();
				this.showUI();
				this._fShowHPBarInstaste_bl = false;

				if (this._fRoundResultResponseReceived_bl)
				{
					this.roundResultScreenController.resetScreenAppearing();
					this.resetBalanceFlags();
				}

				if (this.spot)
				{
					this.redrawAmmoText();
				}
				APP.gameScreen.balanceController.tryToBuyAmmoFromRoundResult();
				break;

			case ROUND_STATE.WAIT:
				this.blurUI();
				if (this._fRoundResultResponseReceived_bl || this.roundResultActive)
				{
					this._fRoundResultOnLasthandWaitState_bln = true;
				}
				this._fExternalBalanceUpdated_bl = false;
				this._fRoundResultResponseReceived_bl = false;

				if (!this.roundResultActive && this.seatId != -1)
				{
					this.addTimeLeftText();
				}
				break;

			case ROUND_STATE.QUALIFY:
				this.blurUI();

				if (this.seatId != -1)
				{
					if (!this.roundResultActive)
					{
						this._startListenForRoundEnd();
					}

					this.removeWaitScreen();
				}
				break;
		}
	}

	removeTimeLeftText()
	{
		this.view && this.view.removeTimeLeftText();
	}

	addTimeLeftText()
	{
		this.view && this.view.addTimeLeftText();
	}

	updateCommonPanelIndicators(data, duration = 0)
	{
		let lData_obj = this._fCommonPanelIndicatorsData_obj || {};
		if (data.balance !== undefined)
		{
			lData_obj.balance = { value: data.balance };
		}
		if (data.win !== undefined)
		{
			if (APP.isBattlegroundGame)
			{
				this.spot && this.spot.setScore(data.win);
			}
			lData_obj.win = { value: data.win };
		}
		if (duration > 0)
		{
			lData_obj.duration = duration;
		}


		this._fCommonPanelIndicatorsData_obj = lData_obj;
	}

	//returns PlayerSpot ?
	getSeat(id, optAllowSpot)
	{
		optAllowSpot = Boolean(optAllowSpot);

		if (optAllowSpot && this.spot && this.spot.id == id)
		{
			return this.spot;
		}

		if (this.playersContainer)
		{
			for (let seat of this.playersContainer.children)
			{
				if (seat.id == id) 
				{
					return seat;
				}
			}
		}

		return null;
	}

	getPlayerBySeatId(seatId)
	{
		for (let player of this.players)
		{
			if (player.seatId == seatId)
			{
				return player;
			}
		}
		return null;
	}

	tryToChangeWeaponOnPlayerBetMultiplierUpdated()
	{
		let lCurrentWeaponId_int = this._fWeaponsController_wsc.i_getInfo().currentWeaponId;

		if (lCurrentWeaponId_int === WEAPONS.DEFAULT)
		{
			this.tryToChangeWeapon(WEAPONS.DEFAULT);
		}
	}

	get isWeaponChangeInProcess()
	{
		return !!this._fCurChangeWeaponTimerInfo_obj && !!this._fCurChangeWeaponTimerInfo_obj.timer;
	}

	tryToChangeWeapon(weaponId, aIgnoreRoundResult_bln, aIsNewAwardedLevelUp_bl = false)
	{
		if (this._fCurChangeWeaponTimerInfo_obj)
		{
			if (this._fCurChangeWeaponTimerInfo_obj.weaponId == WEAPONS.HIGH_LEVEL)
			{
				// we should not interrupt HIGH_LEVEL weapon switch
				return;
			}
			else
			{
				this._destroyCurChangeWeaponTimerInfo();
			}
		}

		let lCurrentTime_num = Date.now();
		let lTimeout_num = lCurrentTime_num - APP.gameScreen.fireController.lastFireTime;
		let lFireTimeout_num = APP.gameScreen.fireController.fireTimeout;

		if (this.shotRequestsAwaiting_num > 0
			|| (lTimeout_num < lFireTimeout_num && weaponId != WEAPONS.HIGH_LEVEL) /* after switching weapon fireImmediately might be initiated, we need to be sure there enough time passed*/
			|| this._fWeaponSwitchInProgress_bln)
		{
			this._startChangeWeaponTimer(weaponId, aIsNewAwardedLevelUp_bl);

			return false;
		}
		console.log("FireProblem_ change weapon call 4");
		this.changeWeapon(weaponId, aIgnoreRoundResult_bln, false, aIsNewAwardedLevelUp_bl);

		if (this.spot && this.spot.hasPendingHighLevelShots)
		{
			this._startChangeWeaponTimer(WEAPONS.HIGH_LEVEL, true);
		}

		return true;
	}

	_startChangeWeaponTimer(weaponId, aIsNewAwardedLevelUp_bl)
	{
		let lChangeWeaponTimer_tmr = new Timer(() =>
		{
			this._destroyCurChangeWeaponTimerInfo();
			this.tryToChangeWeapon(weaponId, false, aIsNewAwardedLevelUp_bl, true);
		}, 150);

		this._fCurChangeWeaponTimerInfo_obj = { timer: lChangeWeaponTimer_tmr, weaponId: weaponId };
	}

	_destroyCurChangeWeaponTimerInfo()
	{
		if (!this._fCurChangeWeaponTimerInfo_obj)
		{
			return;
		}

		let lCurChangeWeaponTimerInfo_obj = this._fCurChangeWeaponTimerInfo_obj;
		lCurChangeWeaponTimerInfo_obj.timer.destructor();

		delete lCurChangeWeaponTimerInfo_obj.timer;
		delete lCurChangeWeaponTimerInfo_obj.weaponId;

		this._fCurChangeWeaponTimerInfo_obj = null;
	}

	onMasterSeatAdded()
	{
		if (this._fWeaponToRestore_int !== null)
		{
			this._fWeaponToRestore_int = null;
		}
	}
	
	changeWeapon(weaponId, aIgnoreRoundResult_bln = false, aIsSkipAnimation_bl = false, aIsNewAwardedLevelUp_bl = false)
	{
		console.log("FireProblem_ CHANGE WEAPON CALL");
		if (APP.currentWindow.gameFrbController.info.frbEnded || !APP.currentWindow.gameStateController.info.isPlayerSitIn)
		{
			return;
		}

		//BATTLEGROUND...
		if(APP.isBattlegroundGame)
		{
			this.spot && this.spot.updateAmmo();
		}
		//...BATTLEGROUND

		if (this._fWeaponToRestore_int !== null) weaponId = this._fWeaponToRestore_int;

		let lWeaponsInfo_wsi = this._fWeaponsController_wsc.info;
		let lNextWeaponIdByWSI_num = lWeaponsInfo_wsi.i_getNextWeaponIdToShoot();

		if (lNextWeaponIdByWSI_num !== WEAPONS.DEFAULT)
		{
			let lShots_num = lWeaponsInfo_wsi.i_getWeaponFreeShots(lNextWeaponIdByWSI_num);
			if (aIsSkipAnimation_bl && lShots_num > 0 && this.spot)
			{
				weaponId = lNextWeaponIdByWSI_num;
			}
		}

		if (this._fCurChangeWeaponTimerInfo_obj)
		{
			if (this._fCurChangeWeaponTimerInfo_obj.weaponId == WEAPONS.HIGH_LEVEL)
			{
				return;
			}
			else
			{
				this._destroyCurChangeWeaponTimerInfo();
			}
		}

		if (
				!APP.currentWindow.player.sitIn
				&& !(
						this._fConnectionHasBeenRecentlyClosed_bln
						&& (
								this._fGameStateInfo_gsi.gameState == ROUND_STATE.WAIT
								|| this._fGameStateInfo_gsi.gameState == ROUND_STATE.QUALIFY
							)
					)
			)
		{
			return;
		}

		let lCurrentWeaponId_int = lWeaponsInfo_wsi.currentWeaponId;

		let lSpotCurrentDefaultWeaponId_int = lWeaponsInfo_wsi.currentDefaultWeaponId;

		if(
			lWeaponsInfo_wsi.isAnyAwardedWeapon
			&& !lWeaponsInfo_wsi.isFreeWeaponsQueueActivated
			&& this._fRestoreAfterFreeShotsWeaponId_int === undefined
			)
		{
			if (lCurrentWeaponId_int === undefined)
			{
				lCurrentWeaponId_int = WEAPONS.DEFAULT;
			}

			this._fRestoreAfterFreeShotsWeaponId_int = lCurrentWeaponId_int;
		}

		if (lCurrentWeaponId_int === weaponId && !this._fWeaponSwitchTry_bln)
		{
			if (this.spot)
			{
				if (
						this._fWeaponToRestore_int === null
						&& lCurrentWeaponId_int !== WEAPONS.DEFAULT
						&& (
							(lWeaponsInfo_wsi.remainingSWShots > 0
							&& !lWeaponsInfo_wsi.isFreeWeaponsQueueActivated)
							|| (lWeaponsInfo_wsi.remainingSWShots <= 0
							&& lNextWeaponIdByWSI_num === WEAPONS.DEFAULT))

					)
				{
					console.log("FireProblem_WPN_UPD_1");
					this.emit(GameFieldController.EVENT_ON_WEAPON_UPDATED, { weaponId: weaponId });
				}

				this.redrawAmmoText();
				this.spot.once(BattlegroundMainPlayerSpot.EVENT_RELOAD_REQUIRED, this._onReloadRequired, this);
				console.log("FireProblem_ change weapon call 5");
				this.spot.changeWeapon(lCurrentWeaponId_int, lSpotCurrentDefaultWeaponId_int, aIsSkipAnimation_bl, aIsNewAwardedLevelUp_bl);
			}

			this._fWeaponSwitchTry_bln = false;
			this._fWeaponSwitchInProgress_bln = false;

			if (this._fWeaponToRestore_int !== null)
			{
				console.log("FireProblem_WPN_UPD_2");
				this.emit(GameFieldController.EVENT_ON_WEAPON_UPDATED, {weaponId: weaponId});
			}

			return;
		}

		this.shotRequestsAwaiting_num = 0;

		if (!APP.currentWindow.isPaused)
		{
			this._fWeaponSwitchTry_bln = true;
			this._fWeaponSwitchInProgress_bln = true;
		}

		console.log("FireProblem_WPN_UPD_3");
		this.emit(GameFieldController.EVENT_ON_WEAPON_UPDATED, { weaponId: weaponId });

		if (this._fGameStateInfo_gsi.gameState == ROUND_STATE.WAIT || this._fGameStateInfo_gsi.gameState == ROUND_STATE.QUALIFY)
		{
			APP.externalCommunicator.sendExternalMessage(GAME_MESSAGES.WEAPON_SELECTED, { weaponId: weaponId });
		}

		this.redrawAmmoText();
		console.log("FireProblem_ change weapon call 6");
		this.spot && this.spot.changeWeapon(weaponId, lSpotCurrentDefaultWeaponId_int, false, aIsNewAwardedLevelUp_bl);
	}

	changeWeaponToDefaultImmediatelyAfterSitOut()
	{
		this._destroyCurChangeWeaponTimerInfo();
		console.log("FireProblem_WPN_UPD_4");
		this.emit(GameFieldController.EVENT_ON_WEAPON_UPDATED, { weaponId: WEAPONS.DEFAULT });
	}

	onClearAmmo()
	{
		APP.gameScreen.balanceController.updatePlayerBalance();

		if (this._fUnpresentedWeaponSurplus_num)
		{
			this.emit(GameFieldController.EVENT_ON_WEAPON_TO_UNPRESENTED_TRANSFER_REQUIRED, { winValue: this._fUnpresentedWeaponSurplus_num })
			this._fUnpresentedWeaponSurplus_num = null;
		}
	}

	onBuyAmmoResponse()
	{
		this._fRoundResultBuyAmmoRequest_bln = false;

		APP.gameScreen.balanceController.updatePlayerBalance();
		this.redrawAmmoText();
	}

	onReBuyAmmoResponse()
	{
		APP.gameScreen.balanceController.updatePlayerBalance();
		this.redrawAmmoText();
	}

	showAddWeapon(weapon, pos, enemyLife, optMultipleWeapons, optFinalPosition)
	{
		if (!pos)
		{
			throw new Error('GameField :: showAddWeapon >> pos is null');
		}
		this._fIsWeaponAddingInProgress_bl = true;
		if (enemyLife === 0)
		{
			if (optMultipleWeapons)
			{
				this.showWeapon(pos, weapon, optFinalPosition);
			}
			else
			{
				this.showCrateWithWeapon(pos.x, pos.y, this.spot, weapon);
			}
		}
		else
		{
			this.showWeapon(pos, weapon);
		}

		this._tryToShowPowerUpMultiplier(pos, weapon.id);
	}

	get isWeaponAddingInProgress()
	{
		return this._fIsWeaponAddingInProgress_bl;
	}

	endShowWeapon()
	{
		while (this._fNewWeapons_arr.length)
		{
			let lAward_obj = this._fNewWeapons_arr.shift();

			let lContentItems_arr = null;

			if (lAward_obj instanceof Crate)
			{
				lContentItems_arr = lAward_obj.contentItems;
			}
			else if (lAward_obj instanceof ContentItem)
			{
				lContentItems_arr = [lAward_obj];
			}

			while (lContentItems_arr.length)
			{
				let lContentItem = lContentItems_arr.pop();
				let lAwardedWeapon_obj = lContentItem.info ? lContentItem.info.awardedWeapon : lContentItem.awardedWeapon;

				if (lAwardedWeapon_obj)
				{
					if (!APP.currentWindow.player.sitIn)
					{
						this._fIsWeaponAddingInProgress_bl = false;
						this.emit(GameFieldController.EVENT_ON_END_SHOW_WEAPON, {weapon: lAwardedWeapon_obj});
					}
					else
					{
						this._onWeaponAddingAnimationCompleted(lAwardedWeapon_obj);
					}
				}
			}

			lAward_obj.destroy();
		}
	}

	_tryToShowPowerUpMultiplier(aEnemyPosition_obj, aWeaponId_int)
	{
		const lPlayerInfo_pi = APP.playerController.info;
		const lCurrentPowerUpMultiplier_num = lPlayerInfo_pi.currentPowerUpMultiplier;
		if (lCurrentPowerUpMultiplier_num > 1 && this._isPowerUpWeapon(aWeaponId_int))
		{
			this._showPowerUpMultiplier(aEnemyPosition_obj, lCurrentPowerUpMultiplier_num)
		}
	}

	_isPowerUpWeapon(aWeaponId_int)
	{
		for (let lPowerUpWeapon in POWER_UP_WEAPONS)
		{
			if (POWER_UP_WEAPONS[lPowerUpWeapon] == aWeaponId_int)
			{
				return true;
			}
		}

		return false;
	}

	_showPowerUpMultiplier(aEnemyPosition_obj, aCurrentPowerUpMultiplier_num)
	{
		let lContainer_spr = this.powerUpMultiplierAnimationContainer.container.addChild(new Sprite());
		let lPowerUpMultiplier_pumv = lContainer_spr.addChild(new PowerUpMultiplierView());
		lContainer_spr.zIndex = this.powerUpMultiplierAnimationContainer.zIndex;
		lPowerUpMultiplier_pumv.value = aCurrentPowerUpMultiplier_num;

		let lSpot_ps = this.getSeat(this.seatId, true);
		let lCenterPoint_obj = lSpot_ps.globalGunCenter;

		lPowerUpMultiplier_pumv.on(PowerUpMultiplierView.EVENT_ON_APPEAR_ANIMATION_COMPLETED, ()=>{
			lPowerUpMultiplier_pumv && lPowerUpMultiplier_pumv.destroy();
			lPowerUpMultiplier_pumv = null;
		})
		lPowerUpMultiplier_pumv.i_startAppearAnimation(aEnemyPosition_obj, lCenterPoint_obj);
	}

	getWeaponEmblemAssetName(weaponId)
	{
		let assetName = '';

		switch (weaponId)
		{
			case WEAPONS.DEFAULT:
				assetName = 'weapons/DefaultGun/turret_1/turret';
				break;
			case WEAPONS.HIGH_LEVEL:
				assetName = 'battleground/powerup/background';
				break;
			default:
				throw new Error ('no assets for weapon id ' + weaponId);
		}
		return assetName;
	}

	getWeaponEmblemGlowAssetName(weaponId)
	{
		let assetName = '';
		switch (weaponId)
		{
			case WEAPONS.DEFAULT:
				assetName = 'weapons/DefaultGun/turret_1/turret';
				break;
			case WEAPONS.HIGH_LEVEL:
				assetName = 'battleground/powerup/background';
				break;
			default:
				throw new Error ('no assets for weapon id ' + weaponId);
		}
		return assetName;
	}

	getWeaponEmblemAnchor()
	{
		return {x: 0.5, y: 0.5};
	}

	getWeaponEmblemGlowAnchor(weaponId)
	{
		let anchor = {x: 0.5, y: 0.5};
		return anchor;
	}

	getWeaponContentLandingPosition(aOptWeaponId_int)
	{
		if (this.spot)
		{
            let l_pt = this.spot.getAwardedWeaponLandingPosition(aOptWeaponId_int);

            return this.spot.localToGlobal(l_pt.x, l_pt.y);
		}
		return APP.isMobile ? {x: 502, y: 532} : {x: 534, y: 532};
	}

	getMasterCoinsLandingPosition()
	{
		if (this.spot && this.spot.parent)
		{
			return this.spot.parent.localToGlobal(this.spot.spotVisualCenterPoint.x, this.spot.spotVisualCenterPoint.y);
		}
		return null;
	}

	showWeapon(pos, aAwardedWeapon_obj, aOptFinalPosition_pt)
	{
		let lAwardedWeapon_obj = aAwardedWeapon_obj || this._fWeaponsInfo_wsi.i_extractAwardedWeapon();

		if (!this.spot)
		{
			return;
		}

		let lWeaponId_num = lAwardedWeapon_obj.id;
		let weaponAssetName = this.getWeaponEmblemAssetName(lWeaponId_num);
		let weaponAssetAnchor = this.getWeaponEmblemAnchor(lWeaponId_num);

		let weaponAssetGlowName = this.getWeaponEmblemGlowAssetName(lWeaponId_num);
		let weaponAssetGlowAnchor = this.getWeaponEmblemGlowAnchor(lWeaponId_num);
		let weaponAssetGlowScale = 2;
		let weaponAssetGlowDescriptor = {
			assetName: weaponAssetGlowName,
			anchor: weaponAssetGlowAnchor,
			scale: weaponAssetGlowScale
		};

		let contentItemInfo = new ContentItemInfo(ContentItemInfo.TYPE_WEAPON, this.spot.id, weaponAssetName, weaponAssetAnchor, null, lWeaponId_num, lAwardedWeapon_obj, null, null, weaponAssetGlowDescriptor);
		let contentItem = this.view.screen.addChild(new ContentItem(contentItemInfo));
		contentItem.zIndex = Z_INDEXES.AWARDED_WEAPON_CONTENT;

		let lWeaponItemHeight_num = APP.library.getSprite(weaponAssetName).height;
		let lWeaponItemWidth_num = APP.library.getSprite(weaponAssetName).width;
		let lWeaponBaseScale_num = contentItem.getBaseScale();
		let lWeaponMaxScale_num = contentItem.getMaxScale();

		let lFreeShotCounterOffset_num = contentItem.getAmmoCounterOffset();
		let lFreeShotCounterAreaDescriptor_fscad = I18.getTranslatableAssetDescriptor("TAAwardedFreeShotsCounterLabel").areaInnerContentDescriptor.areaDescriptor;
		let lFreeShotsCounterLabelWidth_num = FreeShotsCounterView.i_getWidth();
		let lFreeShotsCounterLabelHeigth_num = lFreeShotCounterAreaDescriptor_fscad.height;

		let lFinalPosition_pt = aOptFinalPosition_pt ? new PIXI.Point(aOptFinalPosition_pt.x, aOptFinalPosition_pt.y) : new PIXI.Point(0, -100);
		let lPosX_num = pos.x;
		let lPosY_num = pos.y;

		let lMaxWeaponWidth_num = lWeaponItemWidth_num * lWeaponBaseScale_num * lWeaponMaxScale_num;
		let lMaxWidth_num = Math.max(
			lMaxWeaponWidth_num,
			lFreeShotsCounterLabelWidth_num + lFreeShotCounterOffset_num
		);

		if (pos.x < ((lMaxWidth_num / 2) - lFinalPosition_pt.x))
		{
			lPosX_num = (lMaxWidth_num / 2);
		}
		else if (pos.x > (APP.config.size.width - (lMaxWidth_num / 2) + lFinalPosition_pt.x))
		{
			lPosX_num = APP.config.size.width - (lMaxWidth_num / 2);
		}

		let lMaxWeaponHeight_num = lWeaponItemHeight_num * lWeaponBaseScale_num * lWeaponMaxScale_num;
		let lMaxHeight_num = Math.max(
			lMaxWeaponHeight_num,
			lFreeShotCounterOffset_num + lFreeShotsCounterLabelHeigth_num
		);

		if (pos.y < ((lMaxHeight_num / 2) - lFinalPosition_pt.y))
		{
			lPosY_num = (lMaxHeight_num / 2) - lFinalPosition_pt.y;
		}
		else if (pos.y > (APP.config.size.height - (lMaxHeight_num / 2) + lFinalPosition_pt.y))
		{
			lPosY_num = APP.config.size.height - (lMaxHeight_num / 2);
		}

		contentItem.position.set(lPosX_num, lPosY_num);
		contentItem.once(ContentItem.ON_CONTENT_LANDED, this._onWeaponContentLanded.bind(this, lAwardedWeapon_obj));
		contentItem.startAnimation(lFinalPosition_pt, false, 2, false);
		this._fNewWeapons_arr.push(contentItem);

		lFreeShotCounterAreaDescriptor_fscad = null;
		lWeaponItemHeight_num= null;
		lWeaponItemWidth_num = null;
	}

	showCrateWithWeapon(x, y, playerSeat, aAwardedWeapon_obj)
	{
		if (!this.spot)
		{
			return;
		}

		let cratePos = new PIXI.Point(x, y);

		let lAwardedWeapon_obj = aAwardedWeapon_obj || this._fWeaponsInfo_wsi.i_extractAwardedWeapon();

		let lWeaponId_num = lAwardedWeapon_obj.id;
		let assetName = this.getWeaponEmblemAssetName(lWeaponId_num);
		let assetAnchor = this.getWeaponEmblemAnchor(lWeaponId_num);

		let weaponAssetGlowName = this.getWeaponEmblemGlowAssetName(lWeaponId_num);
		let weaponAssetGlowAnchor = this.getWeaponEmblemGlowAnchor(lWeaponId_num);
		let weaponAssetGlowScale = 2;
		let weaponAssetGlowDescriptor = {
			assetName: weaponAssetGlowName,
			anchor: weaponAssetGlowAnchor,
			scale: weaponAssetGlowScale
		};

		let crateContentItemInfo = new ContentItemInfo(ContentItemInfo.TYPE_WEAPON, playerSeat.id, assetName, assetAnchor, null, lWeaponId_num, lAwardedWeapon_obj, null, null, weaponAssetGlowDescriptor);
		var crate = this.view.screen.addChild(new Crate(cratePos, [crateContentItemInfo]));
		crate.once(Crate.ON_CRATE_DISAPPEARED, this._onCrateDisappeared, this);
		crate.once(Crate.ON_CRATE_WEAPON_REVEAL, () => {
			let shift = crate.calculateCrateFinalPoint({x:x, y:y});
		});
		crate.zIndex = crate.y + crate.finalPoint.y + 65;

		crate.once(Crate.ON_CRATE_CONTENT_LANDED, this._onWeaponContentLanded.bind(this, lAwardedWeapon_obj));
		this._fNewWeapons_arr.push(crate);

		return crate;
	}

	_onCrateDisappeared(event)
	{
		let crate = event.target;
		var lIndex_int = this._fNewWeapons_arr.indexOf(crate);
		if (~lIndex_int)
		{
			this._fNewWeapons_arr.splice(lIndex_int, 1);
		}
		crate.destroy();
	}

	_onWeaponContentLanded(aLandedWeapon_obj, event)
	{
		let lLandedWeapon_obj = aLandedWeapon_obj;
		let contentItem = event ? event.target : null;

		if (contentItem)
		{
			var lIndex_int = this._fNewWeapons_arr.indexOf(contentItem);
			if (~lIndex_int)
			{
				this._fNewWeapons_arr.splice(lIndex_int, 1);
			}
			contentItem.destroy();
		}

		this.redrawAmmoText();

		this._onWeaponAddingAnimationCompleted(lLandedWeapon_obj);
	}

	_onWeaponAddingAnimationCompleted(aLandedWeapon_obj, aIsNewAwardedLevelUp_bl=false)
	{
		this._fIsWeaponAddingInProgress_bl = false;

		if (
				this._fRoundResultActive_bln
				|| (
						APP.currentWindow.isPaused
						&& this._fGameStateInfo_gsi.gameState != ROUND_STATE.PLAY
					)
			)
		{
			return;
		}

		this.emit(GameFieldController.EVENT_ON_END_SHOW_WEAPON, {weapon: aLandedWeapon_obj});
		this.redrawAmmoText();

		if(!APP.playerController.info.didThePlayerWinSWAlready && aLandedWeapon_obj !== undefined && aLandedWeapon_obj.id !== WEAPONS.HIGH_LEVEL)
		{
			this._fFirstPicksUpWeapon_num = aLandedWeapon_obj.id;
			this.emit(GameFieldController.EVENT_ON_PICKS_UP_SPECIAL_WEAPONS_FIRST_TIME);
			return;
		}

		const lWeaponsInfo_wsi = this._fWeaponsInfo_wsi;
		let lCurrentWeaponId_int = lWeaponsInfo_wsi.currentWeaponId;
		let lIsFreeShot_bl = lCurrentWeaponId_int !== WEAPONS.DEFAULT && lWeaponsInfo_wsi.remainingSWShots > 0 && lWeaponsInfo_wsi.isFreeWeaponsQueueActivated;

		if (
				(lWeaponsInfo_wsi.autoEquipFreeSW
				&& aLandedWeapon_obj !== undefined
				&& !lIsFreeShot_bl
				&& this._isProperWeaponLevelApplied(aLandedWeapon_obj.id))
				||
				(aLandedWeapon_obj !== undefined && aLandedWeapon_obj.id == WEAPONS.HIGH_LEVEL)
			)
		{
			this.tryToChangeWeapon(aLandedWeapon_obj.id, false, aIsNewAwardedLevelUp_bl);
		}
	}

	_isProperWeaponLevelApplied(aOptWeaponId_int=undefined)
	{
		/**
		 * Fire denied because lCurrentBetLevel_int = 1 
		 * and lPlayerInfo_pi.possibleBetLevels[0] 1 
		 * and lCompareWeaponId_int = 16 
		 * aOptWeaponId_int= undefined
		 */
		let lCurrentWeaponId_int = this._fWeaponsInfo_wsi.currentWeaponId;
		let lPlayerInfo_pi = APP.playerController.info;
		let lCurrentBetLevel_int = lPlayerInfo_pi.betLevel;
		let lCompareWeaponId_int = aOptWeaponId_int !== undefined ? aOptWeaponId_int : lCurrentWeaponId_int;

		let return_bool = (lCurrentBetLevel_int == lPlayerInfo_pi.possibleBetLevels[0] && lCompareWeaponId_int !== WEAPONS.HIGH_LEVEL)
		|| (lCurrentBetLevel_int > lPlayerInfo_pi.possibleBetLevels[0] && lCompareWeaponId_int == WEAPONS.HIGH_LEVEL);

		/**
		 * SwitchWeapon
		 * WeaponSwithced
		 * BetLevelResponse 
		 * // there is another message containing bet level 
		 * 
		 * 
		 */

		if(!return_bool)
		{
			console.log("FireProblem_level: DENIED because lCurrentWeaponId_int = " +lCurrentWeaponId_int +  " lCurrentBetLevel_int = " + lCurrentBetLevel_int )
		}else{
			//console.log("FireProblem_level ALLOWED because lCurrentWeaponId_int = " +lCurrentWeaponId_int +  " lCurrentBetLevel_int = " + lCurrentBetLevel_int )
		}

		return return_bool;
	}


	spotBounce()
	{
		this.spot && this.spot.bounceEffect();
	}

	playerSeatBounce(aSeatId_int)
	{
		let playerSeat = this.getSeat(aSeatId_int, true);
		playerSeat && playerSeat.bounceEffect();
	}

	clearWeapons()
	{
		this._fWeaponToRestore_int = null;
		this._fWeaponsController_wsc.i_clearAll();
	}

	_onReloadRequired()
	{
		APP.gameScreen.balanceController.tryToBuyAmmo();
	}

	_removeAllPlayersSpots(clearMasterPlayerInfo = true)
	{
		APP.gameScreen.playersSpotsController.removeCoPlayers();
		APP.gameScreen.playersSpotsController.removeMasterPlayerSpot(clearMasterPlayerInfo);
	}

	handleAmmoBackMessage()
	{
		this.redrawAmmoText();
		APP.gameScreen.balanceController.updatePlayerBalance();
	}

	onShotRequest()
	{
		this.shotRequestsAwaiting_num++;
	}

	onShotResponse()
	{
		this.shotRequestsAwaiting_num--;
		if (this.shotRequestsAwaiting_num < 0)
		{
			this.shotRequestsAwaiting_num = 0;
		}
	}

	decreaseAmmo(aShotAmmoAmount_int)
	{
		if (isNaN(aShotAmmoAmount_int) || aShotAmmoAmount_int < 1)
		{
			throw new Error(`Incorrect decrease ammo amount: ${aShotAmmoAmount_int}`);
		}

		this.emit(GameFieldController.EVENT_DECREASE_AMMO, { decreaseAmmoAmount: aShotAmmoAmount_int});
		this.redrawAmmoText();
		APP.gameScreen.balanceController.updatePlayerBalance();
	}

	updateCurrentWeapon(aIsPaidSpecialShot_bl)
	{
		let lWeaponsInfo_wsi = this._fWeaponsController_wsc.i_getInfo();
		let lCurrentWeaponId_int = lWeaponsInfo_wsi.currentWeaponId;

		let lFireController_fc = APP.gameScreen.fireController;

		if (!(this.spot && lCurrentWeaponId_int !== undefined && this.shotRequestsAwaiting_num === 0)) 
		{
			console.log("FireProblem_ selectNextWeaponFromTheQueue precall 1 return  ");
			return;
		}

		if (lCurrentWeaponId_int !== WEAPONS.DEFAULT && lWeaponsInfo_wsi.remainingSWShots == 0 && !aIsPaidSpecialShot_bl)
		{
			
			if (lFireController_fc.isRicochetSW(lCurrentWeaponId_int)
				&& (this.ricochetController.info.getMasterBullets(true, lCurrentWeaponId_int).length > 0
					|| lFireController_fc.isActiveMasterBulletExist()
					|| this.shotRequestsAwaiting_num > 0
				)
			)
			{
				console.log("FireProblem_ selectNextWeaponFromTheQueue precall 2 return  +  this.shotRequestsAwaiting_num " + this.shotRequestsAwaiting_num + " lFireController_fc.isActiveMasterBulletExist() " + lFireController_fc.isActiveMasterBulletExist() );
				return;
			}

			console.log("FireProblem_ selectNextWeaponFromTheQueue 1 ");
			this.selectNextWeaponFromTheQueue();
			this.redrawAmmoText();
		}
	}

	tryToChangeWeaponOnSpotAdded(player, aOptCurrentWeaponId_int = WEAPONS.DEFAULT)
	{
		if (this._fWeaponToRestore_int !== null && this._fWeaponsInfo_wsi.remainingSWShots)
		{
			console.log("FireProblem_ change weapon call 7");
			this.changeWeapon(this._fWeaponToRestore_int);
			this.redrawAmmoText();

			this.spot.once(BattlegroundMainPlayerSpot.EVENT_RELOAD_REQUIRED, this._onReloadRequired, this);

			let lSpotCurrentDefaultWeaponId_int = this._fWeaponsController_wsc.i_getInfo().currentDefaultWeaponId;
			console.log("FireProblem_ change weapon call 8");
			this.spot.changeWeapon(this._fWeaponToRestore_int, lSpotCurrentDefaultWeaponId_int);

			this._fWeaponToRestore_int = null;
		}
		else
		{
			let lCurrentWeaponId_int = aOptCurrentWeaponId_int !== undefined ? aOptCurrentWeaponId_int : WEAPONS.DEFAULT;

			const l_wci = this._fWeaponsController_wsc.i_getInfo();
			if (!l_wci.isFreeWeaponsQueueActivated && !isNaN(this._fRestoreAfterFreeShotsWeaponId_int))
			{
				lCurrentWeaponId_int = this._fRestoreAfterFreeShotsWeaponId_int;
				this._fRestoreAfterFreeShotsWeaponId_int = undefined;
			}

			if (this._fWeaponToRestore_int != null && this._fGameStateInfo_gsi.gameState == ROUND_STATE.PLAY)
			{
				this._selectRememberedWeapon(this._fWeaponToRestore_int);
				this._fWeaponToRestore_int = null;
			}
			else if (
						(this._fGameStateInfo_gsi.gameState == ROUND_STATE.PLAY || this.roundResultActivationInProgress)
						&& lCurrentWeaponId_int != WEAPONS.DEFAULT
						&& !this._fNewPlayerFlag_bln
					)
			{
				this.tryToChangeWeapon(lCurrentWeaponId_int);
			}
			else if (this._fGameStateInfo_gsi.gameState == ROUND_STATE.PLAY && !this._fNewPlayerFlag_bln)
			{
				console.log("FireProblem_ selectNextWeaponFromTheQueue 2 ");
				this.selectNextWeaponFromTheQueue();
			}
			else if (this._fNewPlayerFlag_bln)
			{
				console.log("FireProblem_ selectNextWeaponFromTheQueue 3 ");
				this.selectNextWeaponFromTheQueue();
			}
			else
			{
				console.log("FireProblem_ change weapon call 10");
				this.changeWeapon(lCurrentWeaponId_int);
			}
		}

	}

	_selectRememberedWeapon(aWeapon_num)
	{
		console.log("FireProblem_ change weapon call 11");
		this.changeWeapon(aWeapon_num, null, true);
	}

	selectNextWeaponFromTheQueue()
	{
		let lNextWeaponId_int = this.getNextWeaponFromTheQueue();
		console.log("FireProblem_ change weapon call 14 lNextWeaponId_int " + lNextWeaponId_int);
		this.changeWeapon(lNextWeaponId_int);
		return lNextWeaponId_int;
	}

	tryToChangeWeaponOnWrongWeaponErrorReceived(e)
	{
		if (e.weaponId == WEAPONS.HIGH_LEVEL)
		{
			console.log("FireProblem_ change weapon call 12");
			this.changeWeapon(WEAPONS.DEFAULT);
		}
	}


	resetWeaponToDefault()
	{
		/*console.log("FireProblem: reset weapon to default")
		this.redrawAmmoText();
		this.spot.once(BattlegroundMainPlayerSpot.EVENT_RELOAD_REQUIRED, this._onReloadRequired, this);
		let lSpot_ps = this.getSeat(this.seatId);
		let lSpotCurrentDefaultWeaponId_int = lSpot_ps ? lSpot_ps.currentDefaultWeaponId : 1;
		this.spot.changeWeapon(WEAPONS.DEFAULT, lSpotCurrentDefaultWeaponId_int, true, false);
		this.emit(GameFieldController.EVENT_ON_WEAPON_UPDATED, {weaponId: WEAPONS.DEFAULT});
		this.redrawAmmoText();*/

	}

	getNextWeaponFromTheQueue()
	{
		let lWeaponsInfo_wsi = this._fWeaponsController_wsc.i_getInfo();
		let lNextWeaponId_int = undefined;

		if(lWeaponsInfo_wsi.i_getWeaponFreeShots(WEAPONS.HIGH_LEVEL) > 0)
		{
			lNextWeaponId_int = WEAPONS.HIGH_LEVEL;
		}
		else if(lWeaponsInfo_wsi.autoEquipFreeSW)
		{
			lNextWeaponId_int = lWeaponsInfo_wsi.i_getNextWeaponIdToShoot();

			//WHEN NO FREE SHOTS LEFT, RESTORE WEAPON
			if(
				lNextWeaponId_int === WEAPONS.DEFAULT &&
				this._fRestoreAfterFreeShotsWeaponId_int !== undefined
				)
			{
				lNextWeaponId_int = this._fRestoreAfterFreeShotsWeaponId_int;
				this._fRestoreAfterFreeShotsWeaponId_int = undefined;
			}
			//...WHEN NO FREE SHOTS LEFT, RESTORE WEAPON
		}
		else
		{
			lNextWeaponId_int = WEAPONS.DEFAULT;
		}

		return lNextWeaponId_int;
	}

	_onWeaponSurplusUpdated(aEvent_obj)
	{
		this._fUnpresentedWeaponSurplus_num = aEvent_obj.winBonus;
	}

	redrawAmmoText()
	{
		if (this.spot)
		{
			let lAmmo_int = this._fWeaponsInfo_wsi.ammo;
			if (this._fWeaponsInfo_wsi.currentWeaponId != WEAPONS.DEFAULT/* && this._fWeaponsInfo_wsi.remainingSWShots > 0*/)
			{
				lAmmo_int = this._fWeaponsInfo_wsi.remainingSWShots;
			}

			this.spot.updateAmmo(lAmmo_int, this.isAmmoBuyingInProgress);
		}
	}

	get isAmmoBuyingInProgress()
	{
		return this.waitBuyIn || APP.webSocketInteractionController.isRebuyRequestInProgress;
	}

	get _fireSettingsController()
	{
		return APP.currentWindow.fireSettingsController;
	}

	get _fireSettingsInfo()
	{
		return this._fireSettingsController.info;
	}

	_onLobbyExternalMessageReceived(event)
	{
		switch (event.type)
		{
			case LOBBY_MESSAGES.MID_ROUND_EXIT_DIALOG_ACTIVATED:
				this._fMidRoundExitDialogActive_bln = true;
				this._checkBlur();
				break;
			case LOBBY_MESSAGES.MID_ROUND_EXIT_DIALOG_DEACTIVATED:
				this._fMidRoundExitDialogActive_bln = false;
				this._checkBlur();
				break;
			case LOBBY_MESSAGES.BONUS_DIALOG_ACTIVATED:
				this._fBonusDialogActive_bln = true;
				this._checkBlur();
				break;
			case LOBBY_MESSAGES.BONUS_DIALOG_DEACTIVATED:
				this._fBonusDialogActive_bln = false;
				this._checkBlur();
				break;
			case LOBBY_MESSAGES.FRB_DIALOG_ACTIVATED:
				this._fFRBDialogActive_bln = true;
				this._checkBlur();
				break;
			case LOBBY_MESSAGES.FRB_DIALOG_DEACTIVATED:
				this._fFRBDialogActive_bln = false;
				this._checkBlur();
				break;
			case LOBBY_MESSAGES.SW_PURCHASE_LIMIT_EXCEEDED_DIALOG_DEACTIVATED:
				if (event.data.backToLobby)
				{
					this.emit(GameFieldController.EVENT_BACK_TO_LOBBY_ON_SW_PURCHASE_LIMIT_EXCEEDED_DIALOG_DEACTIVATED);
				}
				break;
		}
	}

	_onFireSettingsActivated()
	{
		APP.gameScreen.fireController.i_unpushPointer();
		this._fFireSettingsScreenActive_bln = true;

		this._validateInteractivity();
	}

	_onFireSettingsDeactivated()
	{
		this._fFireSettingsScreenActive_bln = false;

		this._validateInteractivity();
	}

	showMiss(data, aIsPaidSpecialShot_bl)
	{
		if (data.rid != -1 && (!data.bulletId || APP.gameScreen.fireController.isRicochetSW(data.usedSpecialWeapon)))
		{
			this.updateCurrentWeapon(aIsPaidSpecialShot_bl);
		}

		if (data.killedMiss || data.invulnerable)
		{
			//do not show animation of bullet flying nowhere
			return;
		}

		let missData = Object.assign({}, data);

		for (let obj of ShotResultsUtil.excludeFakeEnemies(missData.affectedEnemies))
		{
			if (
				this._isAnyCashAwardAnimationRequired(obj.data)
				|| this._isMasterScoreAwardRequired(obj.data)
			)
			{
				obj.data.rid = data.rid;
				this.emit(GameFieldController.EVENT_ON_HIT_AWARD_EXPECTED, { hitData: obj.data, masterSeatId: this.seatId });
			}
		}

		this.showFire(missData, this.proceedFireResult.bind(this, missData));
	}

	showHit(data, aIsPaidSpecialShot_bl)
	{
		if (data.rid != -1 && (!data.bulletId || APP.gameScreen.fireController.isRicochetSW(data.usedSpecialWeapon)))
		{
			this.updateCurrentWeapon(aIsPaidSpecialShot_bl);
		}

		let hitData = Object.assign({}, data);

		for (let obj of ShotResultsUtil.excludeFakeEnemies(hitData.affectedEnemies))
		{
			if (
				this._isAnyCashAwardAnimationRequired(obj.data)
				|| this._isMasterScoreAwardRequired(obj.data)
			)
			{
				obj.data.rid = data.rid;
				this.emit(GameFieldController.EVENT_ON_HIT_AWARD_EXPECTED, { hitData: obj.data, masterSeatId: this.seatId });
			}
		}

		this.showFire(hitData, this.proceedFireResult.bind(this, hitData));
	}

	updatePlayerScore(aAddScore_num, aOptBounce_bln = false)
	{
		if (!this.spot) return;

		if (this.roundResultActive)
		{
			if (aOptBounce_bln)
			{
				this.spotBounce();
			}
		}
	}

	updateWeaponImmediately(aWeapon_obj, aIsNewAwardedLevelUp_bl=false)
	{
		this._updateWeaponImmediately(aWeapon_obj, aIsNewAwardedLevelUp_bl);
	}

	_updateWeaponImmediately(aWeapon_obj, aIsNewAwardedLevelUp_bl=false)
	{
		if (aIsNewAwardedLevelUp_bl && !!this.spot)
		{
			this.spot.addPendingHighLevelShots(aWeapon_obj.shots);
		}

		this.redrawAmmoText();

		if (APP.currentWindow.isPaused)
		{
			this.rememberWeaponToRestore();
		}

		this._onWeaponAddingAnimationCompleted(aWeapon_obj, aIsNewAwardedLevelUp_bl);
		this.emit(GameFieldController.EVENT_NEW_WEAPON_CONTENT_LANDED_WITHOUT_CHANGING);
	}

	rememberWeaponToRestore()
	{
		let lPendingWeaponId_num = null;
		let lPendingMasterSWAwards = APP.gameScreen.levelUpController.pendingMasterSWAwards;
		if (lPendingMasterSWAwards && lPendingMasterSWAwards.length)
		{
			lPendingWeaponId_num = lPendingMasterSWAwards[0].id;
		}

		const l_wci = this._fWeaponsInfo_wsi;

		if (lPendingWeaponId_num !== null)
		{
			this._fWeaponToRestore_int = lPendingWeaponId_num;
		}
		if (
					l_wci
					&& l_wci.autoEquipFreeSW
					&& l_wci.isAnyFreeSpecialWeaponExist
					&& l_wci.currentWeaponId == WEAPONS.DEFAULT
				)
		{
			this._fWeaponToRestore_int = l_wci.i_getNextWeaponIdToShoot();
		}
		else if (l_wci && l_wci.currentWeaponId !== undefined && this._fGameStateInfo_gsi.gameState === ROUND_STATE.PLAY)
		{
			this._fWeaponToRestore_int = l_wci.currentWeaponId;
		}
		else
		{
			this._fWeaponToRestore_int = null;
		}
	}

	showFire(data, callback)
	{
		this.emit(GameFieldController.EVENT_ON_SHOT_SHOW_FIRE_START_TIME, { data: data, masterSeatId: this.seatId });

		if (!this.getSeat(data.seatId, true))
		{
			APP.logger.i_pushWarning(`GameFieldController. Cannot show fire, no target seat detected, seatId: ${data.seatId}.`);
			console.log(`Cannot show fire, no target seat detected, seatId: ${data.seatId}`);
			return;
		}

		this.emit(GameFieldController.EVENT_ON_BULLET_FLY_TIME);

		let startPos = {}, endPos = { x: 0, y: 0 };
		let enemyId = (data.enemy) ? data.enemy.id : data.enemyId;
		let enemy;

		if (Array.isArray(data.affectedEnemies) && data.affectedEnemies.length > 1)
		{
			enemyId = data.requestEnemyId;
		}

		enemy = this.getExistEnemy(enemyId);
		if (!enemy)
		{
			APP.logger.i_pushWarning(`GameFieldController. The affected enemy with enemyId=${enemyId} no longer exists in the game field!`);
			console.log(`Attention! The affected enemy with enemyId=${enemyId} no longer exists in the game field!`);

			endPos = this.enemiesLastPositions[enemyId];
			if (!endPos)
			{
				callback(null, 0);
				return;
			}
		}
		else
		{
			endPos = enemy.getAccurateCenterPositionWithCrosshairOffset();
		}


		let lSpot_ps = this.getSeat(data.seatId, true);
		let lSpotCurrentDefaultWeaponId_int = lSpot_ps ? lSpot_ps.currentDefaultWeaponId : 1;
		let lIsRicochetBulletResultData_bl = this._isRicochetBulletResultData(data);

		if (!lIsRicochetBulletResultData_bl)
		{
			this.playWeaponSound(data.usedSpecialWeapon, data.rid === -1, lSpotCurrentDefaultWeaponId_int);
		}

		startPos = lSpot_ps.muzzleTipGlobalPoint;

		let seat = this.getSeat(data.seatId);
		let angle;

		let points = [startPos];

		points.push(endPos);

		angle = Utils.getAngle(points[0], points[1]) + HALF_PI;

		if (!lIsRicochetBulletResultData_bl)
		{
			APP.gameScreen.fireController.showPlayersWeaponEffect(data, angle);
		}

		let lIsMasterBullet_bl = (data.seatId === this.seatId);

		if (lIsRicochetBulletResultData_bl || lIsMasterBullet_bl)
		{
			let lBulletPos = null;
			let lBulletAngle = 0;

			// ricochet bullet results
			let lIsMasterRicochetBullet_bl = this._isMasterRicochetBulletResultData(data);
			if (!lIsMasterRicochetBullet_bl)
			{
				if (!isNaN(data.x) && !isNaN(data.y))
				{
					lBulletPos = { x: data.x, y: data.y };
				}

				let lTargetRicochetBullet_rb = this.ricochetController.info.getBulletByBulletId(data.bulletId);
				if (lTargetRicochetBullet_rb)
				{
					if (!lBulletPos)
					{
						lBulletPos = { x: lTargetRicochetBullet_rb.x, y: lTargetRicochetBullet_rb.y };
					}

					lBulletAngle = lTargetRicochetBullet_rb.directionAngle;
				}
			}
			callback(lBulletPos, lBulletAngle);
			return;
		}

		if (!lIsMasterBullet_bl)
		{
			let bulletProps = {
				radius: 4,
				typeId: data.usedSpecialWeapon
			};
	
			if (enemy)
			{
				bulletProps.targetEnemy = enemy;
			}
	
			switch (data.usedSpecialWeapon)
			{
				case WEAPONS.DEFAULT:
				case WEAPONS.HIGH_LEVEL:
					bulletProps.weapon = data.usedSpecialWeapon;
					bulletProps.defaultWeaponBulletId = lSpotCurrentDefaultWeaponId_int;
					break;
			}
	
			let lWeaponScale = seat ? seat.weaponSpotView.gun.i_getWeaponScale(this._fWeaponsController_wsc.i_getInfo().currentWeaponId) : 1;
			bulletProps.weaponScale = lWeaponScale;

			var projectile = APP.gameScreen.fireController.generateBullet(bulletProps, points, callback, lIsMasterBullet_bl);

			this.view.screen.addChild(projectile);
			APP.gameScreen.fireController.i_addBullet(projectile);
		}
	}

	_validateCoPlayerHighLevel(data)
	{
		let lSpot_ps = this.getSeat(data.seatId);

		if (data.rid !== -1 || !lSpot_ps || lSpot_ps.currentWeaponId !== WEAPONS.HIGH_LEVEL)
		{
			return;
		}

		let lExpectedMult_int = APP.playerController.info.getTurretSkinId(lSpot_ps.player.betLevel);
		if (lExpectedMult_int > lSpot_ps.currentDefaultWeaponId && !this._fCurrentLevelUpTimeout)
		{
			this._fCurrentLevelUpTimeout = new Timer(() => {
				this._fCurrentLevelUpTimeout && this._fCurrentLevelUpTimeout.destructor();
				this._fCurrentLevelUpTimeout = null;
				console.log("FireProblem_ change weapon call 13");
				lSpot_ps.changeWeapon(lSpot_ps.currentWeaponId, lExpectedMult_int);
			}, 1000);

			
		}
	}

	_isRicochetBulletResultData(data)
	{
		return (data.bulletId !== undefined && data.bulletId.length > 0);
	}

	_isMasterRicochetBulletResultData(data)
	{
		return this._isRicochetBulletResultData(data) && data.seatId == this.seatId;
	}

	playWeaponSound(id, aOptOtherPlayersShot_bl = false, aDefaultWeaponId_int = 1)
	{
		let soundName = '';
		switch (id)
		{
			case WEAPONS.DEFAULT:
			case WEAPONS.HIGH_LEVEL:
				let lSpotCurrentDefaultWeaponId_int = aDefaultWeaponId_int; //this._fWeaponsController_wsc.i_getInfo().currentDefaultWeaponId;
				soundName = 'mq_turret_burst' + lSpotCurrentDefaultWeaponId_int;
				break;
		}

		if (soundName)
		{
			let lVolume_num = aOptOtherPlayersShot_bl ? GameSoundsController.OPPONENT_WEAPON_VOLUME : 1;
			APP.soundsController.play(soundName, false, lVolume_num, aOptOtherPlayersShot_bl);
		}
	}

	showPlayersWeaponSwitched(data)
	{
		if (data.seatId == this.seatId)
		{
			this._fWeaponSwitchTry_bln = false;
			this._fWeaponSwitchInProgress_bln = false;
			APP.gameScreen.fireController.fireImmediatelyIfRequired();
		}

		for (var i = 0; i < this.players.length; i++)
		{
			let lPlayer_obj = this.players[i];
			if (lPlayer_obj.seatId == data.seatId && data.rid == -1)
			{
			
				
				lPlayer_obj.currentWeaponId = lPlayer_obj.specialWeaponId = data.weaponId;
				if (lPlayer_obj.spot)
				{
					let lSpotCurrentDefaultWeaponId_int = APP.playerController.info.getTurretSkinId(lPlayer_obj.betLevel);
					console.log("FireProblem_ change weapon call 15");
					lPlayer_obj.spot.changeWeapon(data.weaponId, lSpotCurrentDefaultWeaponId_int);
				}
			}
		}

		this.checkIfChangedWeaponNotCorrect(data);
	}

	checkIfChangedWeaponNotCorrect(data)
	{
		if (data.seatId == this.seatId)
		{
			if (data.weaponId == WEAPONS.DEFAULT)
			{
				for (var i = 0; i < data.weapons.length; i++)
				{
					if (data.weapons[i].id == WEAPONS.HIGH_LEVEL && data.weapons[i].shots && data.weapons[i].shots > 0)
					{
						console.log("FireProblem_ change weapon call 16");
						this.changeWeapon(WEAPONS.HIGH_LEVEL);
						break;
					}
				}
			}
			else if (data.weaponId == WEAPONS.HIGH_LEVEL)
			{
				for (var i = 0; i < data.weapons.length; i++)
				{
					if (data.weapons[i].id == WEAPONS.HIGH_LEVEL 
						&& (!data.weapons[i].shots || data.weapons[i].shots == 0)
						)
					{
						console.log("FireProblem_ change weapon call 17");
						this.changeWeapon(WEAPONS.DEFAULT);
						break;
					}
				}
			}

		}
	}

	showMissEffect(x, y, weaponId, optTargetEnemy, aOptCurrentDefaultWeaponId_int = 1, aOptIsMasterEffect_bl = true)
	{
		switch (weaponId)
		{
			case WEAPONS.DEFAULT:
			case WEAPONS.HIGH_LEVEL:

				if (MissEffect.IS_MISS_EFFECT_REQUIRED)
				{
					this._fMissEffectsPool_mep.addMissEffect(
						aOptCurrentDefaultWeaponId_int,
						x,
						y,
						aOptIsMasterEffect_bl);
				}

				break;
			default:
				break;
		}
	}

	removeAllFxAnimations()
	{
		this._fMissEffectsPool_mep && this._fMissEffectsPool_mep.drop();
	}

	proceedFireResult(data, endPos, angle)
	{
		this.emit(GameFieldController.EVENT_ON_BULLET_TARGET_TIME, { data: data });

		switch (data.usedSpecialWeapon)
		{
			case WEAPONS.HIGH_LEVEL:
				this._validateCoPlayerHighLevel(data);
			default:
				for (let obj of data.affectedEnemies)
				{
					if (obj.data.class == 'Miss') this.showMissAnimation(endPos, angle, obj.data);
					if (obj.data.class == 'Hit') this.showHitAnimation(endPos, angle, obj.data);
				}
		}
	}

	showMissAnimation(endPos, angle, data)
	{
		let enemyId = (data.enemy) ? data.enemy.id : data.enemyId;
		let enemy = this.getExistEnemy(enemyId);
		let lIsMasterRicochetBullet_bl = this._isMasterRicochetBulletResultData(data);

		if (data.laserExplode)
		{
			this._fDelayedLaserExploasionHits_obj_arr = this._fDelayedLaserExploasionHits_obj_arr || [];
			this._fDelayedLaserExploasionHits_obj_arr.push(data);
			return;
		}

		if (data.bombExplode)
		{
			this._fDelayedBombExploasionHits_obj_arr = this._fDelayedBombExploasionHits_obj_arr || [];
			this._fDelayedBombExploasionHits_obj_arr.push(data);
			return;
		}
		if (data.bulletExplode)
		{
			this._fDelayedBulletExploasionHits_obj = this._fDelayedBulletExploasionHits_obj || {};
			if (!this._fDelayedBulletExploasionHits_obj[data.shotEnemyId])
			{
				this._fDelayedBulletExploasionHits_obj[data.shotEnemyId] = [];
			}
			this._fDelayedBulletExploasionHits_obj[data.shotEnemyId].push(data);
			return;
		}

		if (data.killerExplode)
		{
			this._fDelayedKillerExplosionHits_obj_arr = this._fDelayedKillerExplosionHits_obj_arr || [];
			this._fDelayedKillerExplosionHits_obj_arr.push(data);
			return;
		}

		if (data.lightningExplode)
		{
			this._fDelayedLightningExplosionHits_obj = this._fDelayedLightningExplosionHits_obj || {};
			if (!this._fDelayedLightningExplosionHits_obj[data.shotEnemyId])
			{
				this._fDelayedLightningExplosionHits_obj[data.shotEnemyId] = [];
			}
			this._fDelayedLightningExplosionHits_obj[data.shotEnemyId].push(data);
			return;
		}

		this.emit(GameFieldController.EVENT_ON_ENEMY_MISS_ANIMATION, { data: data, enemyId: enemyId, rid: data.rid });

		if (enemy)
		{
			if (data.killedMiss)
			{
				let lPlayerWin_bln = false;
				let lCoPlayerWin_bln = false;

				if (data.hitResultBySeats)
				{
					for (let key in data.hitResultBySeats)
					{
						for (let prize of data.hitResultBySeats[key])
						{
							if ((prize.id === HIT_RESULT_SINGLE_CASH_ID || prize.id === HIT_RESULT_ADDITIONAL_CASH_ID) && +prize.value > 0)
							{
								lPlayerWin_bln = lPlayerWin_bln || !!(+key === +this.seatId);
								lCoPlayerWin_bln = lCoPlayerWin_bln || !!(+key !== +this.seatId);
							}
						}
					}
				}

				if (enemy.isBoss && data.playerName)
				{
					this.emit(GameFieldController.EVENT_ON_UPDATE_PLAYER_WIN_CAPTION, { playerName: data.playerName, seatId: data.seatId })
				}

				enemy.childHvEnemyId = data.hvEnemyId;
				enemy.setDeath(false, { playerWin: lPlayerWin_bln, coPlayerWin: lCoPlayerWin_bln });

				this.pushEnemyToDeadList(data.enemyId);
				this.emit(GameFieldController.EVENT_ON_REMOVE_ENEMY, { id: data.enemyId });
			}
			else
			{
				let lIsMasterBullet_bl = (data.seatId === this.seatId);

				if (!lIsMasterRicochetBullet_bl && !lIsMasterBullet_bl)
				{
					enemy.showHitBounce(angle, data.usedSpecialWeapon, data.hitDuration);
					enemy.playHitHighlightAnimation(5 * FRAME_RATE);
				}
			}
		}

		this.onEnemyImpacted(endPos, data, enemyId, enemy);
	}

	showHitAnimation(endPos, angle, data, aOptKillerEnemyName_str)
	{
		let enemyId = (data.enemy) ? data.enemy.id : data.enemyId;
		let enemy = this.getExistEnemy(enemyId);
		let lIsMasterRicochetBullet_bl = this._isMasterRicochetBulletResultData(data);

		if (data.laserExplode)
		{
			this._fDelayedLaserExploasionHits_obj_arr = this._fDelayedLaserExploasionHits_obj_arr || [];
			this._fDelayedLaserExploasionHits_obj_arr.push(data);

			if (enemy)
			{
				APP.gameScreen.enemiesController.setEnemyAwaitingDelayedHit(enemy.id);
			}
			else
			{
				APP.logger.i_pushError(`GameFieldController. Enemy to Hit with id= ${data.enemy.id} not found.`);
				console.error("Enemy to Hit with id="+data.enemy.id+" not found.");
			}
			
			return;
		}

		if (data.bulletExplode)
		{
			this._fDelayedBulletExploasionHits_obj = this._fDelayedBulletExploasionHits_obj || {};
			if (!this._fDelayedBulletExploasionHits_obj[data.shotEnemyId])
			{
				this._fDelayedBulletExploasionHits_obj[data.shotEnemyId] = [];
			}
			this._fDelayedBulletExploasionHits_obj[data.shotEnemyId].push(data);
			return;
		}

		if (data.killerExplode)
		{
			if (enemy)
			{
				APP.gameScreen.enemiesController.setEnemyAwaitingDelayedHit(enemy.id);
			}
			else
			{
				APP.logger.i_pushError(`GameFieldController. Enemy to Hit with id= ${data.enemy.id} not found.`);
				console.error("Enemy to Hit with id="+data.enemy.id+" not found.");
			}

			this._fDelayedKillerExplosionHits_obj_arr = this._fDelayedKillerExplosionHits_obj_arr || [];
			this._fDelayedKillerExplosionHits_obj_arr.push(data);
			return;
		}

		if (data.bombExplode)
		{
			this._fDelayedBombExploasionHits_obj_arr = this._fDelayedBombExploasionHits_obj_arr || [];
			this._fDelayedBombExploasionHits_obj_arr.push(data);
			return;
		}

		if (data.lightningExplode)
		{
			this._fDelayedLightningExplosionHits_obj = this._fDelayedLightningExplosionHits_obj || {};
			if (!this._fDelayedLightningExplosionHits_obj[data.shotEnemyId])
			{
				this._fDelayedLightningExplosionHits_obj[data.shotEnemyId] = [];
			}
			this._fDelayedLightningExplosionHits_obj[data.shotEnemyId].push(data);
			return;
		}

		if (enemy && enemy.typeId == ENEMY_TYPES.BOMB_CAPSULE && data.killed)
		{
			this.emit(GameFieldController.DELAY_BOMB_ARRAY_COMPLETE, { dataArray: this._fDelayedBombExploasionHits_obj_arr })
		}

		this.emit(GameFieldController.EVENT_ON_ENEMY_HIT_ANIMATION, { data: data, enemyId: enemyId, damage: data.damage, rid: data.rid });

		if (enemy)
		{
			if (!data.killed)
			{
				if (enemy.isBoss)
				{
					enemy.onEnergyUpdated({energy: data.enemy.energy}); // to trigger boss's weak state
				}

				enemy.awardedPrizes = data.enemy.awardedPrizes;

				let lIsMasterBullet_bl = (data.seatId === this.seatId);
				if (!lIsMasterRicochetBullet_bl && !lIsMasterBullet_bl)
				{
					enemy.showHitBounce(angle, data.usedSpecialWeapon, data.hitDuration);
					enemy.playHitHighlightAnimation(5 * FRAME_RATE);
				}
			}
			else
			{
				let lPlayerWin_bln = false;
				let lCoPlayerWin_bln = false;

				if (data.hitResultBySeats)
				{
					for (let key in data.hitResultBySeats)
					{
						for (let prize of data.hitResultBySeats[key])
						{
							if ((prize.id === HIT_RESULT_SINGLE_CASH_ID || prize.id === HIT_RESULT_ADDITIONAL_CASH_ID) && +prize.value > 0)
							{
								if (prize.id === HIT_RESULT_SINGLE_CASH_ID && !!data.skipAwardedWin && data.enemy.typeId != ENEMY_TYPES.BOSS)
								{
									continue;
								}
								lPlayerWin_bln = lPlayerWin_bln || !!(+key === +this.seatId);
								lCoPlayerWin_bln = lCoPlayerWin_bln || !!(+key !== +this.seatId);
							}
						}
					}
				}

				if (enemy.isBoss && data.playerName)
				{
					this.emit(GameFieldController.EVENT_ON_UPDATE_PLAYER_WIN_CAPTION, { playerName: data.playerName, seatId: data.seatId })
				}

				enemy.childHvEnemyId = data.hvEnemyId;

				if (enemy.typeId == ENEMY_TYPES.KILLER_CAPSULE)
				{
					enemy.setIsAffectedEnemiesExist(data.isAffectedEnemiesExist);
				}

				enemy.setDeath(false, { playerWin: lPlayerWin_bln, coPlayerWin: lCoPlayerWin_bln }, aOptKillerEnemyName_str);

				let bigWinsController = APP.currentWindow.bigWinsController;
				if (data.killBonusPay && data.seatId == this.seatId && !bigWinsController.isAnyBigWinInProgress)
				{
					this.emit(GameFieldController.EVENT_ON_SHOW_BONUS_CAPSULE_WIN, { endPos: { x: data.x, y: data.y }, enemyId: enemyId });
				}
				this.pushEnemyToDeadList(enemyId);
				this.emit(GameFieldController.EVENT_ON_REMOVE_ENEMY, { id: enemyId });

				this.emit(GameFieldController.EVENT_ON_ENEMY_KILLED_BY_PLAYER, {
					playerName: data.playerName || "",
					enemyName: enemy.name
				});
			}
		}
		else
		{
			if (data && data.enemy && data.enemy.typeId)
			{
				const name = EnemiesController.calculateEnemyName(~~data.enemy.typeId, data.enemy.skin);

				this.emit(GameFieldController.EVENT_ON_ENEMY_KILLED_BY_PLAYER, {
					playerName: data.playerName || "",
					enemyName: name
				});
			}
		}

		this.onEnemyImpacted(endPos, data, enemyId, enemy, true);
	}

	hideEnemyEffectsBeforeDeathIfRequired(enemy)
	{
		for (let i = 0; i < this.enemies.length; i++)
		{
			const enemyView = this.enemies[i];
			if (enemy.id == enemyView.id)
			{
				enemyView.hideEnemyEffectsBeforeDeathIfRequired();
				break;
			}
		}
	}

	_onShowDalayedBombAward(lMult_int)
	{
		this._fDelayedBombExploasionHits_obj_arr && this._fDelayedBombExploasionHits_obj_arr.forEach((lDelayedBobmExploasionHitData) =>
		{
			lDelayedBobmExploasionHitData.bombExplode = false;
			lDelayedBobmExploasionHitData.chMult = lMult_int.chMult;
			let angle = 0;
			if (lDelayedBobmExploasionHitData.class == 'Miss') this.showMissAnimation(null, angle, lDelayedBobmExploasionHitData);
			if (lDelayedBobmExploasionHitData.class == 'Hit') this.showHitAnimation(null, angle, lDelayedBobmExploasionHitData, ENEMIES.BombCapsule);
		});
		this._fDelayedBombExploasionHits_obj_arr = [];
	}

	_onShowDalayedLaserCapsuleAward()
	{
		this._fDelayedLaserExploasionHits_obj_arr && this._fDelayedLaserExploasionHits_obj_arr.forEach((lDelayedLaserExploasionHitData) =>
		{
			lDelayedLaserExploasionHitData.laserExplode = false;
			let angle = 0;
			if (lDelayedLaserExploasionHitData.class == 'Miss') this.showMissAnimation(null, angle, lDelayedLaserExploasionHitData);

			if (lDelayedLaserExploasionHitData.class == 'Hit')
			{
				if (this._checkIfDelayedLaserCapsuleEnemyStillExists(lDelayedLaserExploasionHitData))
				{
					this.showHitAnimation(null, angle, lDelayedLaserExploasionHitData);
				}
				else
				{
					this._onCapsuleEnemyNotFound(lDelayedLaserExploasionHitData);
				}
			}
		});
		this._fDelayedLaserExploasionHits_obj_arr = [];
		this.emit(GameFieldController.EVENT_ON_DELAYED_LASER_CAPSULES_AWARDS_ARE_COLLECTED);
	}

	_checkIfDelayedLaserCapsuleEnemyStillExists(aHitData_obj) {
		let lEnemyId_int = (aHitData_obj.enemy) ? aHitData_obj.enemy.id : aHitData_obj.enemyId;
		let lEnemy_e = this.getExistEnemy(lEnemyId_int);

		return !!lEnemy_e;
	}

	checkIfBossIsInDelayedLaserCapsuleEnemies()
	{
		for (const lHitData_obj of this._fDelayedLaserExploasionHits_obj_arr)
		{
			if (
				lHitData_obj.enemy
				&& lHitData_obj.enemy.typeId == ENEMY_TYPES.BOSS
				&& lHitData_obj.laserExplode)
			{
				return lHitData_obj;
			}
		}
		
		return null;
	}

	checkIfBossIsInDelayedLightningCapsuleEnemies()
	{
		for (const lHitInfo_obj_arr of Object.values(this._fDelayedLightningExplosionHits_obj))
		{
			for (const lHitInfo_obj of lHitInfo_obj_arr) 
			{
				if (
					lHitInfo_obj.enemy
					&& lHitInfo_obj.enemy.typeId == ENEMY_TYPES.BOSS
					&& lHitInfo_obj.lightningExplode)
				{
					return lHitInfo_obj;
				}
			}
		}

		return null;
	}

	_onShowDalayedBulletCapsuleAward(e)
	{
		let lHitInfo_obj = e.hitInfo;
		let lCupsuleId_num = Object.keys(this._fDelayedBulletExploasionHits_obj).find(key => this._fDelayedBulletExploasionHits_obj[key].includes(lHitInfo_obj));
		if (lCupsuleId_num)
		{
			let lIndex_num = this._fDelayedBulletExploasionHits_obj[lCupsuleId_num].indexOf(lHitInfo_obj);
			if (~lIndex_num)
			{
				this._fDelayedBulletExploasionHits_obj[lCupsuleId_num].splice(lIndex_num, 1);
				lHitInfo_obj.bulletExplode = false;
				let angle = 0;
				if (lHitInfo_obj.class == 'Miss') this.showMissAnimation(null, angle, lHitInfo_obj);
				if (lHitInfo_obj.class == 'Hit') this.showHitAnimation(null, angle, lHitInfo_obj);
			}
		}
	}

	_onShowDalayedKillerCapsuleAward(e)
	{
		let lHitInfo_obj = e.hitInfo;
		const lIndex_int = this._fDelayedKillerExplosionHits_obj_arr.indexOf(lHitInfo_obj);
		if (~lIndex_int)
		{
			this._fDelayedKillerExplosionHits_obj_arr.splice(lIndex_int, 1);
			lHitInfo_obj.killerExplode = false;
			let angle = 0;
			if (lHitInfo_obj.class == 'Miss') this.showMissAnimation(null, angle, lHitInfo_obj);
			if (lHitInfo_obj.class == 'Hit') this.showHitAnimation(null, angle, lHitInfo_obj, true);
		}
	}

	_onShowDelayedLightningCapsuleAward(e)
	{
		let lHitInfo_obj = e.hitInfo;
		let lCupsuleId_num = Object.keys(this._fDelayedLightningExplosionHits_obj).find(key => this._fDelayedLightningExplosionHits_obj[key].includes(lHitInfo_obj));
		if (lCupsuleId_num)
		{
			let lIndex_num = this._fDelayedLightningExplosionHits_obj[lCupsuleId_num].indexOf(lHitInfo_obj);
			if (~lIndex_num)
			{
				this._fDelayedLightningExplosionHits_obj[lCupsuleId_num].splice(lIndex_num, 1);
				lHitInfo_obj.lightningExplode = false;
				let angle = 0;
				if (lHitInfo_obj.class == 'Miss') this.showMissAnimation(null, angle, lHitInfo_obj);
				if (lHitInfo_obj.class == 'Hit') this.showHitAnimation(null, angle, lHitInfo_obj);
			}
		}
		this.emit(GameFieldController.EVENT_ON_LIGHTNING_CAPSULE_DELAYED_AWARDS_COLLECTED);
	}

	_onLightningCapsuleFeatureEnemyNotFound(e)
	{
		let lHitInfo_obj = e.hitInfo;
		let lCupsuleId_num = Object.keys(this._fDelayedLightningExplosionHits_obj).find(key => this._fDelayedLightningExplosionHits_obj[key].includes(lHitInfo_obj));
		if (lCupsuleId_num)
		{
			let lIndex_num = this._fDelayedLightningExplosionHits_obj[lCupsuleId_num].indexOf(lHitInfo_obj);
			if (~lIndex_num)
			{
				this._fDelayedLightningExplosionHits_obj[lCupsuleId_num].splice(lIndex_num, 1);
			}
		}

		this._onCapsuleEnemyNotFound(e.hitInfo);
	}

	_onCapsuleEnemyNotFound(aHitInfo_obj)
	{
		const lLostEnemyWin_obj = this._prepareLostEnemyWin(aHitInfo_obj);

		if (!lLostEnemyWin_obj)
		{
			console.error('Couldn\'t count win value to scoreboard due to enemy was destroyed!');
			return;
		}

		this.emit(GameFieldController.EVENT_ON_NEED_TO_COUNT_WIN_FOR_LOST_ENEMY, lLostEnemyWin_obj);
	}

	_prepareLostEnemyWin(aEnemyHitInfo_obj)
	{
		if (!aEnemyHitInfo_obj)
		{
			return;
		}

		let lWinValue_num = 0;

		const lSeatId_num = aEnemyHitInfo_obj.seatId;
		
		if (aEnemyHitInfo_obj.hitResultBySeats)
		{
			if (aEnemyHitInfo_obj.hitResultBySeats && aEnemyHitInfo_obj.hitResultBySeats[lSeatId_num] && aEnemyHitInfo_obj.hitResultBySeats[lSeatId_num][0])
			{
				lWinValue_num += +aEnemyHitInfo_obj.hitResultBySeats[lSeatId_num][0].value;
			}
		}

		const lAwardSkeepNeeded_bl = aEnemyHitInfo_obj.skipAwardedWin;

		const lIsBossEnemy_bl = aEnemyHitInfo_obj.enemy && aEnemyHitInfo_obj.enemy.typeId && aEnemyHitInfo_obj.enemy.typeId == ENEMY_TYPES.BOSS;

		return {
			isBoss: lIsBossEnemy_bl,
			seatId: lSeatId_num,
			skipAward: lAwardSkeepNeeded_bl,
			value: lWinValue_num
		};
	}

	onEnemyImpacted(endPos, data, enemyId, enemy)
	{
		let lIsMasterRicochetBullet_bl = this._isMasterRicochetBulletResultData(data);

		if (endPos && !lIsMasterRicochetBullet_bl)
		{
			let lSeat_pt = this.getSeat(data.seatId, true);
			let lSpotCurrentDefaultWeaponId_int = lSeat_pt ? lSeat_pt.currentDefaultWeaponId : 1;
			let lTargetRicochetBullet_rb = this.ricochetController.info.getBulletByBulletId(data.bulletId);
			if (lTargetRicochetBullet_rb && !lTargetRicochetBullet_rb.disappeared)
			{
				this.showMissEffect(
					endPos.x,
					endPos.y,
					data.usedSpecialWeapon,
					enemy,
					lSpotCurrentDefaultWeaponId_int,
					lSeat_pt.isMaster);
			}
		}

		let lCurrentEnemyPosition_pt = this.enemiesLastPositions[enemyId] || new PIXI.Point(data.x + Utils.random(-10, 10), data.y + Utils.random(-10, 10));
		if (enemy)
		{
			lCurrentEnemyPosition_pt = enemy.getGlobalPosition();
		}

		if (!endPos)
		{
			endPos = Utils.clone(lCurrentEnemyPosition_pt);
		}

		let lEnemyId_int = enemy ? enemy.id : null;
		let lPrizePosition_pt = lCurrentEnemyPosition_pt;
		let lIsBoss_bl = (enemy && enemy.isBoss)
						|| (data.enemy && data.enemy.typeId == ENEMY_TYPES.BOSS);

		if (enemy && enemy.isBoss)
		{
			lPrizePosition_pt.y -= 70;
		}

		this._showPrizes(data, lPrizePosition_pt, lEnemyId_int, lIsBoss_bl);

		this.emit(GameFieldController.EVENT_ON_SHOW_ENEMY_HIT, { id: enemyId, data: data, enemyView: enemy, position: endPos });
	}

	/*
	@aPrizePosition_pt - current dying enemy position
	*/
	_showPrizes(data, aPrizePosition_pt, aEnemyId_int, aIsBoss_bl)
	{
		this.emit(GameFieldController.EVENT_TIME_TO_SHOW_PRIZES, {
			prizesData:
			{
				hitData: data,
				prizePosition: aPrizePosition_pt,
				enemyId: aEnemyId_int,
				isBoss: aIsBoss_bl
			}
		}
		);
	}

	_isAnyCashAwardAnimationRequired(hitData)
	{
		return PrizesController.isAnyCashAwardAnimationRequired(hitData);
	}

	_isMasterScoreAwardRequired(hitData)
	{
		return this.spot && (hitData.score > 0 && hitData.seatId === this.seatId);
	}

	checkExistEnemy(id)
	{
		for (var i = 0; i < this.enemies.length; i++)
		{
			if (this.enemies[i].id == id)
			{
				return true;
			}
		}

		return false;
	}

	getExistEnemy(id)
	{
		for (var i = 0; i < this.enemies.length; i++)
		{
			if (this.enemies[i].id == id)
			{
				return this.enemies[i];
			}
		}
	}

	get allExistEnemies()
	{
		return this.enemies;
	}

	get isBossEnemyExist()
	{
		return this.enemies.some(e => e.isBoss);
	}

	getEnemyPosition(enemyId, aFootPosition_bl = false)
	{
		let enemy = this.getExistEnemy(enemyId);
		if (enemy)
		{
			return aFootPosition_bl ? enemy.getGlobalPosition() : enemy.getAccurateCenterPositionWithCrosshairOffset();
		}
		return this.enemiesLastPositions[enemyId];
	}

	createEnemy(aEnemy_obj)
	{
		let zombie;
		switch (aEnemy_obj.name)
		{
			case ENEMIES.Rocky:
				zombie = new Rocky(aEnemy_obj);
				break;
			case ENEMIES.Pointy:
				zombie = new Pointy(aEnemy_obj);
				break;
			case ENEMIES.Spiky:
				zombie = new Spiky(aEnemy_obj);
				break;
			case ENEMIES.Trex:
				zombie = new Trex(aEnemy_obj);
				break;
			case ENEMIES.Krang:
				zombie = new Krang(aEnemy_obj);
				break;
			case ENEMIES.Kang:
				zombie = new Kang(aEnemy_obj);
				break;
			case ENEMIES.OneEye:
				zombie = new OneEye(aEnemy_obj);
				break;
			case ENEMIES.PinkFlyer:
				zombie = new PinkFlyer(aEnemy_obj);
				break;
			case ENEMIES.YellowAlien:
				zombie = new YellowAlien(aEnemy_obj);
				break;
			case ENEMIES.SmallFlyer:
				zombie = new SmallFlyer(aEnemy_obj);
				break;
			case ENEMIES.JumperBlue:
				zombie = new JumperBlue(aEnemy_obj);
				break;
			case ENEMIES.JumperGreen:
				zombie = new JumperBlue(aEnemy_obj);
				break;
			case ENEMIES.JumperWhite:
				zombie = new JumperBlue(aEnemy_obj);
				break;
			case ENEMIES.GreenHopper:
				zombie = new GreenHopper(aEnemy_obj);
				break;
			case ENEMIES.FlyerMutalisk:
				zombie = new FlyerMutalisk(aEnemy_obj);
				break;
			case ENEMIES.Slug:
				zombie = new Slug(aEnemy_obj);
				break;
			case ENEMIES.Jellyfish:
				zombie = new Jellyfish(aEnemy_obj);
				break;
			case ENEMIES.Mflyer:
				zombie = new MFlyer(aEnemy_obj);
				break;
			case ENEMIES.RedHeadFlyer:
				zombie = new RedHeadFlyer(aEnemy_obj);
				break;
			case ENEMIES.Froggy:
				zombie = new Froggy(aEnemy_obj);
				break;
			case ENEMIES.EyeFlyerGreen:
			case ENEMIES.EyeFlyerPurple:
			case ENEMIES.EyeFlyerRed:
			case ENEMIES.EyeFlyerYellow:
				zombie = new EyeFlyer(aEnemy_obj);
				break;
			case ENEMIES.Bioraptor:
				zombie = new Bioraptor(aEnemy_obj);
				break;
			case ENEMIES.Crawler:
				zombie = new Crawler(aEnemy_obj);
				break;
			case ENEMIES.MothyBlue:
			case ENEMIES.MothyRed:
			case ENEMIES.MothyWhite:
			case ENEMIES.MothyYellow:
				zombie = new Mothy(aEnemy_obj);
				break;
			case ENEMIES.Flyer:
				zombie = new Flyer(aEnemy_obj);
				break;
			case ENEMIES.Money:
				zombie = new Money(aEnemy_obj);
				break;
			case ENEMIES.GiantTrex:
				zombie = new GiantTrex(aEnemy_obj);
				break;
			case ENEMIES.GiantPinkFlyer:
				zombie = new GiantPinkFlyer(aEnemy_obj);
				break;

			case ENEMIES.LaserCapsule:
				zombie = new LaserCapsule(aEnemy_obj);
				this.emit(GameFieldController.EVENT_ON_CAPSULE_CREATED, {capsuleName: ENEMIES.LaserCapsule, enemyId: aEnemy_obj.id});
				break;
			case ENEMIES.KillerCapsule:
				zombie = new KillerCapsule(aEnemy_obj);
				this.emit(GameFieldController.EVENT_ON_CAPSULE_CREATED, {capsuleName: ENEMIES.KillerCapsule, enemyId: aEnemy_obj.id});
				break;
			case ENEMIES.FreezeCapsule:
				zombie = new FreezeCapsule(aEnemy_obj);
				this.emit(GameFieldController.EVENT_ON_CAPSULE_CREATED, {capsuleName: ENEMIES.FreezeCapsule, enemyId: aEnemy_obj.id});
				break;
			case ENEMIES.LightningCapsule:
				zombie = new LightningCapsule(aEnemy_obj);
				this.emit(GameFieldController.EVENT_ON_CAPSULE_CREATED, {capsuleName: ENEMIES.LightningCapsule, enemyId: aEnemy_obj.id});
				break;
			case ENEMIES.GoldCapsule:
				zombie = new GoldCapsule(aEnemy_obj);
				this.emit(GameFieldController.EVENT_ON_CAPSULE_CREATED, {capsuleName: ENEMIES.GoldCapsule, enemyId: aEnemy_obj.id});
				break;
			case ENEMIES.BulletCapsule:
				zombie = new BulletCapsule(aEnemy_obj);
				this.emit(GameFieldController.EVENT_ON_CAPSULE_CREATED, {capsuleName: ENEMIES.BulletCapsule, enemyId: aEnemy_obj.id});
				break;
			case ENEMIES.BombCapsule:
				zombie = new BombCapsule(aEnemy_obj);
				this.emit(GameFieldController.EVENT_ON_CAPSULE_CREATED, {capsuleName: ENEMIES.BombCapsule, enemyId: aEnemy_obj.id});
				break;
			case ENEMIES.Earth:
				zombie = new EarthBossEnemy(aEnemy_obj);
				break;
			case ENEMIES.FireBoss:
				zombie = new FireBoss(aEnemy_obj);
				break;
			case ENEMIES.LightningBoss:
				zombie = new LightningBoss(aEnemy_obj);
				break;
			case ENEMIES.IceBoss:
				zombie = new IceBoss(aEnemy_obj);
				break;
			default:
				zombie = new SpineEnemy(aEnemy_obj); //[Y]TODO to add exception - unknown enemy type
				break;
		}

		// alter this to have animation 
		zombie.alpha = 0;
		this._fTimeline_mtl = new MTimeLine();
		this._fTimeline_mtl.addAnimation(
			zombie,
			MTimeLine.SET_ALPHA,
			0,
			[
				[1, 60]
			]
		);
		this._fTimeline_mtl.play();


		this.view.screen.addChild(zombie);
		this.enemies.push(zombie);

		this.emit(GameFieldController.EVENT_ON_NEW_ENEMY_CREATED, { enemyId: aEnemy_obj.id, enemy: zombie });

		if (zombie.typeId == ENEMY_TYPES.MONEY || zombie.parentEnemyTypeId == ENEMY_TYPES.MONEY)
		{
			this.emit(GameFieldController.EVENT_ON_NEW_B3_ENEMY_CREATED, { enemyId: zombie.id, enemyTypeId: zombie.typeId, parentId: zombie.parentEnemyId, parentTypeId: zombie.parentEnemyTypeId});
		}

		zombie.on(Enemy.EVENT_ON_DEATH_ANIMATION_STARTED, this._onEnemyDeathAnimationStarted, this);
		if (zombie.isBoss)
		{
			zombie.on(BossEnemy.EVENT_ON_BOSS_BECOME_VISIBLE, this.emit, this);
			zombie.on(BossEnemy.EVENT_ON_BOSS_APPEARED, this.emit, this);
			zombie.on(BossEnemy.EVENT_BOSS_IS_ENRAGED, this.emit, this);
			zombie.once(Enemy.EVENT_ON_DEATH_ANIMATION_CRACK, this.emit, this);
			zombie.on(Enemy.EVENT_ON_ENEMY_START_DYING, (e) =>
			{
				this.emit(GameFieldController.EVENT_ON_BOSS_DESTROYING, { enemyId: e.enemyId, bossName: e.bossName, enemy: e.enemy, isInstantKill: e.isInstantKill });

				if (e.isInstantKill)
				{
					Sequence.destroy(Sequence.findByTarget(this.view.container));
					this.view.container.x = 0;
					this.view.container.y = 0;
				}
			});
			
			if (this._fGameStateInfo_gsi.subroundLasthand)
			{
				this.emit(GameFieldController.EVENT_ON_NEW_BOSS_CREATED, { enemyId: aEnemy_obj.id, isLasthandBossView: !this._fShowHPBarInstaste_bl, bossName: aEnemy_obj.name, energy: aEnemy_obj.energy, fullEnergy: aEnemy_obj.fullEnergy, isBossRoundAlreadyGo: this._fShowHPBarInstaste_bl});
				this._fShowHPBarInstaste_bl = true;
			}
			else
			{
				zombie.prepareForBossAppearance();
				
				this.emit(GameFieldController.EVENT_ON_NEW_BOSS_CREATED, { enemyId: aEnemy_obj.id, isLasthandBossView: false, bossName: aEnemy_obj.name, });
			}
		}
		zombie.on(Enemy.EVENT_ON_ENEMY_VIEW_REMOVING, this._onEnemyViewRemoving, this);
		zombie.on(Enemy.EVENT_ON_ENEMY_ADD_TRAJECTORY_POINT, this.emit, this);
		zombie.on(Enemy.EVENT_ON_ENEMY_PAUSE_WALKING, this.emit, this);
		zombie.on(Enemy.EVENT_ON_ENEMY_RESUME_WALKING, this.emit, this);
		zombie.once(Enemy.EVENT_ON_DEATH_COIN_AWARD, this.emit, this);
		zombie.once(Sprite.EVENT_ON_DESTROYING, this._onEnemyViewDestroying, this);

		zombie.on(Enemy.EVENT_ON_ENEMY_DEATH_SFX, this.emit, this);
		zombie.on(Enemy.EVENT_ON_ICE_EXPLOSION_ANIMATION_STARTED, this.emit, this);
		// this.onSomeEnemySpawnSoundRequired(zombie.typeId); // not required by https://youtrack.dgphoenix.com/issue/MSX-343/0021689-SXSP-62-AUDIO-ADJUSTMENTS#focus=Comments-4-169518.0-0

		this.validateEnemyZindex();

		return zombie;
	}

	onSomeEnemySpawnSoundRequired(aEnemyTypeId_int)
	{
		this.emit(GameFieldController.EVENT_ON_SOME_ENEMY_SPAWN_SOUND_REQUIRED, { enemyTypeId: aEnemyTypeId_int });
	}

	_onEnemyDeathAnimationStarted(event)
	{
		let zombie = event.target;
		if (zombie.isBoss)
		{
			this.shakeTheGround("bossShining");
			zombie.once(BossEnemy.EVENT_ON_DEATH_ANIMATION_OUTRO_STARTED, (e) =>
			{
				this.emit(GameFieldController.EVENT_ON_BOSS_DESTROYED, { enemyGlobalPoint: e.position, isCoPlayerWin: e.isCoPlayerWin });
				this.shakeTheGround("bossExplosion", true);
			});

			zombie.once(BossEnemy.EVENT_ON_TIME_TO_EXPLODE_COINS, (e) =>
			{
				if (!this.isBossEnemyExist)
				{
					this._onBossDeath();
				}
				this.emit(GameFieldController.EVENT_ON_TIME_TO_EXPLODE_COINS, { enemyGlobalPoint: e.position, isCoPlayerWin: e.isCoPlayerWin });
			});
		}
		this.emit(GameFieldController.EVENT_ON_DEATH_ANIMATION_STARTED, { enemyId: zombie.id });
	}

	_onEnemyViewRemoving(event)
	{
		let zombie = event.target;
		let enemyId = zombie.id;

		this.enemiesLastPositions[enemyId] = zombie.getGlobalPosition();
		this.pushEnemyToDeadList(enemyId);

		this.emit(GameFieldController.EVENT_ON_ENEMY_VIEW_REMOVING, { enemyId: enemyId });
	}

	_onEnemyViewDestroying(event)
	{
		let zombie = event.target;

		let index = this.deadEnemies.indexOf(zombie);
		if (~index)
		{
			this.deadEnemies.splice(index, 1);
		}
	}

	getEnemy(id)
	{
		for (var enemy of this.enemies)
		{
			if (enemy.id == id)
			{
				return enemy;
			}
		}
	}

	removeAllEnemies()
	{
		while (this.enemies.length)
		{
			try
			{
				this.enemies.pop().destroy(true);
			}
			catch (err)
			{
				APP.logger.i_pushWarning(`GameFieldController. :: removeAllEnemies >> ${JSON.stringify(err)}.`);
				console.log("GameFieldController.js :: removeAllEnemies >> ", err);
			}
		}
		this.enemies = [];
		this.enemiesLastPositions = {};

		while (this.deadEnemies.length)
		{
			try
			{
				this.deadEnemies.pop().destroy(true);
			}
			catch (err)
			{
				APP.logger.i_pushWarning(`GameFieldController. :: removeAllEnemies (dead) >> ${JSON.stringify(err)}.`);
				console.log("GameFieldController.js :: removeAllEnemies (dead) >> ", err);
			}
		}

		this.deadEnemies = [];
	}

	removeEnemy(enemy)
	{
		for (var i = 0; i < this.enemies.length; i++)
		{
			var enemyView = this.enemies[i];
			if (enemy.id == enemyView.id)
			{
				enemyView.i_playPreDeathAnimation();
				break;
			}
		}
	}

	pushEnemyToDeadList(id)
	{
		if (id !== undefined)
		{
			if (this.indicatedEnemy && this.indicatedEnemy.id == id)
			{
				this.indicatedEnemy = null;
			}
			for (var i = 0; i < this.enemies.length; i++)
			{
				let zombie = this.enemies[i];
				if (zombie.id == id)
				{
					this.enemiesLastPositions[id] = zombie.getGlobalPosition();
					this.enemies.splice(i, 1);

					this.deadEnemies.push(zombie);
					zombie.once(Enemy.EVENT_ON_DEATH_ANIMATION_COMPLETED, (e) =>
					{
						let index = this.deadEnemies.indexOf(e.target);
						if (~index)
						{
							this.deadEnemies.splice(this.deadEnemies.indexOf(e.target), 1);
						}
					})
					return;
				}
			}
		}
	}

	/**
	 * @param {Number} id
	 * @param {Number} reason:
	 *						0 - as a result of usual death;
	 *						1 - as a result of quick disappearing before/after boss
	 */
	setEnemyDestroy(id, reason = 0)
	{
		let enemy = this.getExistEnemy(id);
		if (enemy)
		{
			enemy.updateLife(0);
			enemy.deathReason = reason;
		}

		if (reason == 1) //immediately
		{
			if (enemy)
			{
				enemy.setDeath(true);

				if (enemy.isBoss)
				{
					this.emit(GameFieldController.EVENT_ON_BOSS_IMMEDIATELY_DEATH, { bossId: id});
				}

				this.pushEnemyToDeadList(id);
			}
			this.emit(GameFieldController.EVENT_ON_REMOVE_ENEMY, { id: id });
		}
	}

	validateEnemyZindex()
	{
		let zombie;
		let enemies = APP.gameScreen.enemiesController.getRegisteredEnemies();
		for (let i = 0; i < enemies.length; i++)
		{
			let enemyInfo = enemies[i];
			if (this.checkExistEnemy(enemyInfo.id))
			{
				zombie = this.getExistEnemy(enemyInfo.id);
				zombie.changeZindex();
			}
		}
	}

	drawEnemies(enemies)
	{
		let zombie;
		for (let i = 0; i < enemies.length; i++)
		{
			let enemyInfo = enemies[i];
			if (enemyInfo.angle === undefined)
			{
				continue;
			}

			if (!this.checkExistEnemy(enemyInfo.id))
			{
				if (enemyInfo.life === 0 || enemyInfo.isEnded)
				{
					if (enemyInfo.life === 0)
					{
						//this means that when it's time to add enemy to the screen it's already killed
						this.enemiesLastPositions[enemyInfo.id] = new PIXI.Point(enemyInfo.x, enemyInfo.y);
						this.emit(GameFieldController.EVENT_ON_REMOVE_ENEMY, { id: enemyInfo.id });
					}

					continue;
				}

				zombie = this.createEnemy(enemyInfo);
			}
			else
			{
				zombie = this.getExistEnemy(enemyInfo.id);
				if (!zombie.trajectoryPositionChangeInitiated)
				{
					zombie.trajectoryPositionChangeInitiated = (zombie.position.x !== (enemyInfo.x - zombie.footPoint.x) || zombie.position.y !== (enemyInfo.y - zombie.footPoint.y))
				}

				if (zombie.isStayState &&
					zombie.trajectoryPositionChangeInitiated)
				{
					if (enemyInfo.allowUpdatePosition)
					{
						zombie.setWalk();
					}
					else
					{
						zombie.continueStayedStateAnim();
					}
				}
			}

			zombie.life = enemyInfo.life;
			zombie.invulnerable = enemyInfo.invulnerable;

			if (enemyInfo.life != 0)
			{
				if (enemyInfo.isEnded)
				{
					if (zombie.isBoss)
					{
						this._destroyBossHealthBar();
					}

					zombie.i_playPreDeathAnimation();
					if (!zombie.isPlantEnemy)
					{
						zombie.visible = false;
						zombie.isEnded = true;
					}
					continue;
				}

				zombie.visible = !enemies[i].isHidden;
			}

			zombie.angle = enemyInfo.angle;
			zombie.position.set(enemyInfo.x - zombie.footPoint.x, enemyInfo.y - zombie.footPoint.y);

			zombie.lastPointTimeInterval = enemyInfo.lastPointTimeInterval;
			zombie.changeView();
		}

		if(this._fGameStateInfo_gsi.subroundState == SUBROUND_STATE.BOSS && !this.isBossEnemyExist)
		{
			this._fShowHPBarInstaste_bl = true;
		}
	}

	tickEnemies(delta)
	{
		for (let enemy of this.enemies)
		{
			enemy.tick(delta);
		}
	}

	tick(delta, realDelta)
	{
		this.tickEnemies(delta);

		this.spot && this.spot.tick && this.spot.tick(delta);

		if (this._fCommonPanelIndicatorsData_obj)
		{
			let lCommonPanelIndicatorsData_obj = Object.assign({}, this._fCommonPanelIndicatorsData_obj);
			this._fCommonPanelIndicatorsData_obj = null;

			this.emit(GameFieldController.EVENT_REFRESH_COMMON_PANEL_REQUIRED, { data: lCommonPanelIndicatorsData_obj });
		}
	}

	//PENDING_OPERATION...
	_onPendingOperationStarted(event)
	{
		this.resetWaitBuyIn();
	}
	//...PENDING_OPERATION

	destroy()
	{
		super.destroy();
	}
}

export default GameFieldController;