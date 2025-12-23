import SoundsController from '../../../../../common/PIXI/src/dgphoenix/unified/controller/sounds/SoundsController';
import SimpleSoundController from '../../../../../common/PIXI/src/dgphoenix/unified/controller/sounds/SimpleSoundController';
import GameSoundsInfo from '../../model/sounds/GameSoundsInfo';
import GameStateController from '../../controller/state/GameStateController';
import RoundResultScreenController from '../../controller/uis/roundresult/RoundResultScreenController';
import GameScreen from '../../main/GameScreen';
import Timer from '../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import { SUBROUND_STATE, ROUND_STATE } from '../../model/state/GameStateInfo';
import GameWebSocketInteractionController from '../interaction/server/GameWebSocketInteractionController';
import { SERVER_MESSAGES } from '../../model/interaction/server/GameWebSocketInteractionInfo';
import { ENEMY_TYPES, BACKGROUND_SOUNDS_FADING_TIME, ENEMIES } from '../../../../shared/src/CommonConstants';

import ASSETS from '../../config/assets.json';
import Game from '../../Game';
import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import BigWinsController from '../uis/awarding/big_win/BigWinsController';
import Enemy from '../../main/enemies/Enemy';
import BossModeController from '../uis/custom/bossmode/BossModeController';
import { Utils } from '../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import BattlegroundFinalCountingController from '../uis/final_counting/BattlegroundFinalCountingController';
import BombController from '../uis/quests/BombController';
import MoneyWheelController from '../uis/quests/MoneyWheelController';
import BulletCapsuleFeatureController from '../uis/capsule_features/BulletCapsuleFeatureController';
import KillerCapsuleFeatureController from '../uis/capsule_features/KillerCapsuleFeatureController';
import LaserCapsuleFeatureController from '../uis/capsule_features/LaserCapsuleFeatureController';
import LightningCapsuleFeatureController from '../uis/capsule_features/LightningCapsuleFeatureController';
import GameFieldController from '../../controller/uis/game_field/GameFieldController'

const BG_MAIN_SOUND_NAME = "mq_mus_game_bg_main_";
const BG_SUMMARY_SCREEN_SOUND_NAME = "mq_mus_game_bg_summary_screen";

const BG_MAIN_SOUNDS = [
	BG_MAIN_SOUND_NAME + "1",
	BG_MAIN_SOUND_NAME + "2",
	BG_MAIN_SOUND_NAME + "3"
];

// redefine BG_SOUNDS below in _initBgSoundNames
let BG_SOUNDS = [
	...BG_MAIN_SOUNDS,
	"mq_mus_game_bg_boss",
	BG_SUMMARY_SCREEN_SOUND_NAME
];

const CROSS_FADE_DURATION = 3000;

const FADE_DURATION_ON_BIG_WIN = 2000;
const FADE_DURATION_ON_BIG_WIN_TIME_COUNTING_STEP = 100;
const FADE_DURATION_ON_BIG_WIN_VOLUME_STEP = FADE_DURATION_ON_BIG_WIN_TIME_COUNTING_STEP / FADE_DURATION_ON_BIG_WIN;

const FADE_EXEPTIONS = [
	"mq_gui_button_generic_ui"
];

class GameSoundsController extends SoundsController
{
	static get MAIN_PLAYER_VOLUME() 	{ return 1; }
	static get OPPONENT_VOLUME() 		{ return 0.15; }
	static get OPPONENT_WEAPON_VOLUME()	{ return 0.5; }

	//IL CONSTRUCTION...
	constructor()
	{
		super(new GameSoundsInfo());
		this._initGSoundsController();

		this._fIsFaded_bl = false;
		this._fMusicBg_uscc = null;

		this._curFadeMult = 1;
		this._fMainBgMusicChangeTimer_tmr = null;

		this._fBackgroundMusicChangeRequired_bl = false;
		this._fCurrentBgMusicInd_int = 0;
		this._fCurrentBgMusicSound = null;
		this._fIsBossSubroubdPlaying_bl = false;
		this._fIsMenuOpen_bl = null;
		this._fIsNeedFadeBgMusicSound_bl = false;

		this._fVolumeBgMusicChangeTimer_tmr = null;
		this._fCurrentTimerVolumeDown_tmr = null;
		this._fIsMuteOnBigWinPlayingInProgress_num = 0;
		this._fPreviousBGSoundName_str = null;
		this._fCurrentMusicVolume_num = 0;
		this._fIsGameRoundPlaying_bl = null;
		this._fIsRoundResultScreenActivated_bl = null;
		this._fCrossFadeOutBg_uscc_arr = [];

		this._fBigWinSound_ussc = null;
		this._fIsNeedFadeBgMusicSoundAfterBigWin_bl = false;
	}
	//...IL CONSTRUCTION

	//IL INTERFACE...
	initListeners(aGameScreen_gs)
	{
		aGameScreen_gs.on(GameScreen.EVENT_ON_NEW_BOSS_CREATED, this._onBossEnemyRising, this);
		aGameScreen_gs.on(GameScreen.EVENT_ON_BOSS_DESTROYING, this._onBossEnemyDestroying, this);
		aGameScreen_gs.on(GameScreen.EVENT_ON_LOBBY_BACKGROUND_FADE_START, this._onLobbyBackgroundFadeStart, this);
		aGameScreen_gs.on(GameScreen.EVENT_ON_ROOM_PAUSED, this._onRoomPaused, this);
		aGameScreen_gs.on(GameScreen.EVENT_ON_ROOM_UNPAUSED, this._onRoomUnpaused, this);
		aGameScreen_gs.on(GameScreen.EVENT_BATTLEGROUND_CONFIRM_BUY_IN_REQUIRED, this._validateMusic, this);
		aGameScreen_gs.on(GameScreen.EVENT_BATTLEGROUND_REQUEST_TIME_TO_START, this._validateMusic, this);
		aGameScreen_gs.on(GameScreen.EVENT_ON_CARD_DISAPPEARED, this._onInstakillOutro, this);
		aGameScreen_gs.on(GameScreen.EVENT_ON_ENEMY_DEATH_SFX, this._onSomeEnemyDeathSoundRequired, this);
		aGameScreen_gs.on(GameScreen.CHANGE_FIELD_FREEZE_STATE, this._onGroundFreeze, this);

		this._fGameStateController_gsc = aGameScreen_gs.gameStateController;
		this._fGameStateInfo_gsi = this._fGameStateController_gsc.i_getInfo();
		this._fGameStateController_gsc.on(GameStateController.EVENT_ON_SUBROUND_STATE_CHANGED, this._onGameSubRoundStateChanged, this);
		this._fGameStateController_gsc.on(GameStateController.EVENT_ON_GAME_STATE_CHANGED, this._onGameStateChanged, this);
		APP.webSocketInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_MESSAGE, this._onServerMessage, this);
		APP.webSocketInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_ROUND_FINISH_SOON, this._onServerRoundFinishSoonMessage, this);

		this._fRoundResultScreenController_tsc = APP.gameScreen.gameFieldController.roundResultScreenController;
		this._fRoundResultScreenController_tsc.on(RoundResultScreenController.EVENT_ON_ROUND_RESULT_SCREEN_ACTIVATED, this._onRoundResultScreenActivated, this);
		this._fRoundResultScreenController_tsc.on(RoundResultScreenController.EVENT_ON_ROUND_RESULT_SCREEN_DEACTIVATED, this._onRoundResultScreenDeactivated, this);
		this._fRoundResultScreenController_tsc.on(RoundResultScreenController.ON_COINS_ANIMATION_STARTED, this._onTreasuresCoinsAnimationStarted, this);
		this._fRoundResultScreenController_tsc.on(RoundResultScreenController.ON_COINS_ANIMATION_COMPLETED, this._onTreasuresCoinsAnimationCompleted, this);

		let lBigWinsController_bwc = aGameScreen_gs.bigWinsController;
		lBigWinsController_bwc.on(BigWinsController.EVENT_BIG_WIN_PRESETNTATION_STARTED, this._onSomeBigWinPresentationStarted, this);
		lBigWinsController_bwc.on(BigWinsController.EVENT_NEED_MUTE_BG_SOUND_ON_BIG_WIN_PLAYING, this._onNeedMuteBgSoundOnBigWinPlaying, this);
		lBigWinsController_bwc.on(BigWinsController.EVENT_NEED_FADE_BACK_BG_SOUND_ON_BIG_WIN_PLAYING, this._onNeedFadeBackBGSoundOnBigWinPlayingCompleted, this);
		lBigWinsController_bwc.on(BigWinsController.EVENT_ON_BIG_WIN_AWARD_COUNTED, this._onSomeBigWinAwardCounted, this);

		let lBulletCapsuleFeatureController = aGameScreen_gs.bulletCapsuleFeatureController;
		lBulletCapsuleFeatureController.on(BulletCapsuleFeatureController.EVENT_ON_BIG_BULLET_FLY_SFX, this._onBigBulletFlySound, this);
		lBulletCapsuleFeatureController.on(BulletCapsuleFeatureController.EVENT_ON_TARGET_HIT, this._onBigBulletExplosionSound, this);

		let lKillerCapsuleFeatureController = aGameScreen_gs.killerCapsuleFeatureController;
		lKillerCapsuleFeatureController.on(KillerCapsuleFeatureController.EVENT_ON_INSTAKILL_BEAM_SFX, this._onKillerBeamSound, this);

		let lLaserCapsuleFeatureController = aGameScreen_gs.laserCapsuleFeatureController;
		lLaserCapsuleFeatureController.on(LaserCapsuleFeatureController.EVEN_ON_LASERNET_SFX, this._onLaserNetSound, this);

		let lLightningCapsuleFeatureController = aGameScreen_gs.lightningCapsuleFeatureController;
		lLightningCapsuleFeatureController.on(LightningCapsuleFeatureController.EVENT_ON_LIGHTNING_SFX, this._onLightningSound, this);
		
		APP.currentWindow.gameFieldController.on(GameFieldController.EVENT_ON_GAME_FIELD_SCREEN_CREATED, this._onGameFieldScreenCreated, this);
		APP.currentWindow.gameFieldController.on(Enemy.EVENT_ON_DEATH_ANIMATION_CRACK, this._onBossCoinsExplodeStart, this);
		APP.currentWindow.gameFieldController.on(Enemy.EVENT_ON_ICE_EXPLOSION_ANIMATION_STARTED, this._onEnemyIceExplosionAnimationStarting, this);

		APP.on(Game.EVENT_ON_GAME_SECONDARY_SCREEN_DEACTIVATED, this._onSecondaryScreenDeactivated.bind(this));
		APP.on(Game.EVENT_ON_GAME_SECONDARY_SCREEN_ACTIVATED, this._onSecondaryScreenActivated.bind(this));

		let lBossModeController = aGameScreen_gs.bossModeController;
		lBossModeController.on(BossModeController.EVENT_APPEARING_STARTED, this._onBossAppearingStarted, this);
		lBossModeController.on(BossModeController.EVENT_ON_CAPTION_BECAME_VISIBLE, this._onBossCaptionBecameVisible, this);
		lBossModeController.on(BossModeController.EVENT_DISAPPEARING_PRESENTATION_STARTED, this._onBossDisappearingStarted, this);
	}

	_onInstakillOutro()
	{
		this.__playSound('instakill_outro');
	}

	_onBounceExpolisionSound()
	{
		this.__playSound('bomb_bounce_explosion');
	}

	_onMoneyWheelPopupSound()
	{
		this.__playSound('moneywheel_popup');
	}

	_onMoneyWheelHighlightSound()
	{
		this.__playSound('moneywheel_highlight');
	}

	_onMoneyWheelTensionSound()
	{
		this.__playSound('moneywheel_tension_loop');
	}

	_onMoneyWheelWinSound()
	{
		this.__playSound('moneywheel_win');
	}

	_onBigBulletFlySound()
	{
		this.__playSound('rocket_whoosh');
	}

	_onBigBulletExplosionSound()
	{
		this.__playSound('rocket_explosion');
	}

	_onKillerBeamSound()
	{
		this.__playSound('instakill_beam');
	}

	_onLaserNetSound()
	{
		this.__playSound('lasernet');
	}

	_onLightningSound()
	{
		this.__playSound('lightning');
	}

	_onGroundFreeze(aEvent_obj)
	{
		if (aEvent_obj.frozen && !aEvent_obj.isLasthand)
		{
			this.__playSound('freeze_ground');
		}
	}

	_isActualBgMusic(aSoundName_str)
	{
		return (
			this._fMusicBg_uscc &&
			this._fMusicBg_uscc._fSoundInfo_ussi._fSoundName_str === aSoundName_str);
	}

	_onSecondaryScreenActivated()
	{
		this._fIsMenuOpen_bl = true;
		this._stopAllExcessMusic();
	}

	_onSecondaryScreenDeactivated()
	{
		this._fIsMenuOpen_bl = false;
		let lIsNextMusicRequested_bl = false;

		if (this._fBackgroundMusicChangeRequired_bl)
		{
			this._onTimeToChangeMainBgMusicWithinRound();
			lIsNextMusicRequested_bl = true;
		}

		if (lIsNextMusicRequested_bl && !this._isBossExist())
		{
			this._changeMainBgMusic();
			return;
		}

		this._validateMusic();
	}

	_onGameFieldScreenCreated()
	{
		let lBattlegroundFinalCountingController_bfcc = APP.gameScreen.gameFieldController.battlegroundFinalCountingController;
		lBattlegroundFinalCountingController_bfcc.on(BattlegroundFinalCountingController.EVENT_ON_BATTLEGROUND_FINAL_COUNTING_NEXT_COUNT_STARTED, this._onBattlegroundFinalCountingNextCountStarted, this);
	
		let lBombController_bc = APP.gameScreen.gameFieldController.bombController;
		lBombController_bc.on(BombController.EVENT_ON_BOMB_SFX, this._onBounceExpolisionSound, this);

		let lMoneyWheelController_mwc = APP.gameScreen.gameFieldController.moneyWheelController;
		lMoneyWheelController_mwc.on(MoneyWheelController.EVENT_ON_WHEEL_POPUP_SFX, this._onMoneyWheelPopupSound, this);
		lMoneyWheelController_mwc.on(MoneyWheelController.EVENT_ON_WHEEL_HIGHLIGHT_SFX, this._onMoneyWheelHighlightSound, this);
		lMoneyWheelController_mwc.on(MoneyWheelController.EVENT_ON_WHEEL_TENSION_SFX, this._onMoneyWheelTensionSound, this);
		lMoneyWheelController_mwc.on(MoneyWheelController.EVENT_ON_WHEEL_WIN_SFX, this._onMoneyWheelWinSound, this);
	}

	_onNeedMuteBgSoundOnBigWinPlaying()
	{
		if (!this._fIsGameRoundPlaying_bl || !this._isFXSoundVolumeOn())
		{
			return;
		}

		let lMusicBgInfo_ussi = this._fMusicBg_uscc ? this._fMusicBg_uscc.i_getInfo() : null;
		let lCurrentPlayingBgSoundName_str = lMusicBgInfo_ussi ? lMusicBgInfo_ussi.i_getSoundName() : null;
		let lCurrentBGSoundController_sc = this.i_getSoundController(lCurrentPlayingBgSoundName_str);

		if (!lCurrentBGSoundController_sc) 
		{
			APP.logger.i_pushWarning(`GameSoundsController. _onNeedMuteBgSoundOnBigWinPlaying. Failed to get sound controller for sound: ${lCurrentPlayingBgSoundName_str}`);
			return;
		}

		this._fVolumeBgMusicChangeTimer_tmr && this._fVolumeBgMusicChangeTimer_tmr.destructor();
		this._fVolumeBgMusicChangeTimer_tmr = null;

		this._fIsMuteOnBigWinPlayingInProgress_num++;

		lCurrentBGSoundController_sc && lCurrentBGSoundController_sc.i_setVolume(0);

		if (this._fPreviousBGSoundName_str && this._isAnyMusicCrossFadeOut())
		{
			this._resetAllCrossFadeOutMusic();
			let lPreviousBGSoundController_sc = this.i_getSoundController(this._fPreviousBGSoundName_str);
			lPreviousBGSoundController_sc && lPreviousBGSoundController_sc.i_stopPlaying();
		}
	}

	_onNeedFadeBackBGSoundOnBigWinPlayingCompleted()
	{
		if (!this._fIsGameRoundPlaying_bl || !this._isFXSoundVolumeOn())
		{
			return;
		}

		this._fIsMuteOnBigWinPlayingInProgress_num--;
		if (this._fIsMuteOnBigWinPlayingInProgress_num <= 0)
		{
			let lMusicBgInfo_ussi = this._fMusicBg_uscc ? this._fMusicBg_uscc.i_getInfo() : null;
			if (lMusicBgInfo_ussi && !lMusicBgInfo_ussi.i_isPlayingStatePlaying())
			{
				this._fMusicBg_uscc.i_startPlaying();
			}

			this._unmuteFxSounds();
			this._fadeBGSounds(this._curFadeMult);
			this._fIsMuteOnBigWinPlayingInProgress_bl = false;
			this._fVolumeCounter_num = 0;
			if (this._fBigWinSound_ussc)
			{
				this._fIsNeedFadeBgMusicSoundAfterBigWin_bl = true;
			}
			else
			{
				this._fVolumeBgMusicChangeTimer_tmr = new Timer(this._onTimeToFadeMainBgMusic.bind(this), FADE_DURATION_ON_BIG_WIN_TIME_COUNTING_STEP);
			}
		}
	}

	_onSomeBigWinAwardCounted(e)
	{
		this._clearBigWinSound();
	}

	_onTimeToFadeMainBgMusic()
	{
		if (!this._fIsGameRoundPlaying_bl)
		{
			return;
		}

		this._fVolumeCounter_num += FADE_DURATION_ON_BIG_WIN_VOLUME_STEP;
		this._fVolumeCounter_num = Math.round( this._fVolumeCounter_num * 1000 ) / 1000;
		let lMusicBgInfo_ussi = this._fMusicBg_uscc ? this._fMusicBg_uscc.i_getInfo() : null;
		let lCurrentPlayingBgSoundName_str = lMusicBgInfo_ussi ? lMusicBgInfo_ussi.i_getSoundName() : null;
		let lCurrentBGSoundController_sc = this.i_getSoundController(lCurrentPlayingBgSoundName_str);

		if (!lCurrentBGSoundController_sc)
		{
			APP.logger.i_pushWarning(`GameSoundsController. _onTimeToFadeMainBgMusic. Failed to get sound controller for sound: ${lCurrentPlayingBgSoundName_str}`);
			return;
		}

		if (this._fVolumeCounter_num >= 1)
		{
			lCurrentBGSoundController_sc && lCurrentBGSoundController_sc.i_setVolume(this._fCurrentMusicVolume_num);
			this._fVolumeBgMusicChangeTimer_tmr && this._fVolumeBgMusicChangeTimer_tmr.destructor();
			this._fVolumeBgMusicChangeTimer_tmr = null;
		}
		else
		{
			let lVolume_num = this._fVolumeCounter_num * this._fCurrentMusicVolume_num;
			if (lVolume_num > 1)
			{
				lVolume_num = 1;
			}
			lCurrentBGSoundController_sc && lCurrentBGSoundController_sc.i_setVolume(lVolume_num);
			this._fVolumeBgMusicChangeTimer_tmr = new Timer(this._onTimeToFadeMainBgMusic.bind(this), FADE_DURATION_ON_BIG_WIN_TIME_COUNTING_STEP);
		}

	}
	//...IL INTERFACE

	//ILI INIT...
	_initGSoundsController()
	{
		this._initSoundsMetrics();
	}

	__initControlLevel()
	{
		super.__initControlLevel();

		APP.on(Game.EVENT_ON_SOUND_SETTINGS_CHANGED, this.__updateSoundSettings, this);
		APP.on(Game.EVENT_ON_CLOSE_ROOM, this._onCloseRoom, this);
	}

	_initSoundsMetrics()
	{
		this.__getInfo().i_initSoundsMetrics(ASSETS.sounds);
	}
	//...ILI INIT

	//override...
	_resetMusicVolume()
	{
		if (APP.isSecondaryScreenActive)
		{
			return;
		}

		super._resetMusicVolume();
	}

	__updateSoundSettings(event)
	{
		super.__updateSoundSettings(event);

		if (event.lobbySoundsLoadingOccurred !== undefined)
		{
			this.__getInfo().lobbySoundsLoadingOccurred = Boolean(event.lobbySoundsLoadingOccurred);
		}

		if (this._fIsFaded_bl)
		{
			this._muteFxSounds();
		}

		if (!APP.isSecondaryScreenActive)
		{
			this._stopAllExcessMusic();
		}

		this._fCurrentMusicVolume_num = event.musicVolume ? (event.musicVolume > 1 ? 1 : event.musicVolume) : 0;
	}

	_addSoundToCrossFadeOut(aMusicBg_uscc)
	{
		if (aMusicBg_uscc && this._fMusicBg_uscc.i_getInfo().i_getSoundName())
		{
			this._fCrossFadeOutBg_uscc_arr[this._fMusicBg_uscc.i_getInfo().i_getSoundName()] = aMusicBg_uscc;
		}

		return aMusicBg_uscc;
	}

	_isAnyMusicCrossFadeOut()
	{
		for (let key in this._fCrossFadeOutBg_uscc_arr) 
		{
			if (this._fCrossFadeOutBg_uscc_arr[key])
			{
				return true;
			}
		}

		return false;
	}

	_isThisMusicCrossFadeOut(aSoundName_str)
	{
		if (this._fCrossFadeOutBg_uscc_arr[aSoundName_str])
		{
			return true;
		}

		return false;
	}

	_resetCrossFadeOutMusic(aMusicBg_uscc)
	{
		let lSoundName_str = aMusicBg_uscc.i_getInfo().i_getSoundName();
		delete this._fCrossFadeOutBg_uscc_arr[lSoundName_str];
		aMusicBg_uscc && aMusicBg_uscc.i_stopPlaying();
	}

	_resetAllCrossFadeOutMusic()
	{
		for (let key in this._fCrossFadeOutBg_uscc_arr)
		{
			let lMusicBg_uscc = this._fCrossFadeOutBg_uscc_arr[key];
			lMusicBg_uscc && lMusicBg_uscc.i_stopPlaying();
			delete this._fCrossFadeOutBg_uscc_arr[key];
		}
	}

	_onCloseRoom()
	{
		this._clearMainBgMusicChangeTimer();

		this._fMusicBg_uscc && this._fMusicBg_uscc.i_stopPlaying();
		this._fMusicBg_uscc = null;

		this._resetAllCrossFadeOutMusic();

		this._fIsFaded_bl = false;
		this.__stopAllFxSounds();

		this._fVolumeBgMusicChangeTimer_tmr && this._fVolumeBgMusicChangeTimer_tmr.destructor();
		this._fVolumeBgMusicChangeTimer_tmr = null;

		this._fIsGameRoundPlaying_bl = false;
	}

	__disableAllSounds(event)
	{
		if (this._fMusicBg_uscc)
		{
			this._fMusicBg_uscc.i_startPlaying();
		}
		this._resetAllCrossFadeOutMusic();
		super.__disableAllSounds.call(this, event);
	}

	__enableAllSounds(event)
	{
		super.__enableAllSounds.call(this, event);
	}

	__playSound(aSoundName_str, aOptLoop_bl, aOptVolumeMultiplier_num = 1)
	{
		let lSound_ussc = super.__playSound(aSoundName_str, aOptLoop_bl);

		if (lSound_ussc)
		{
			if (!this._fIsFaded_bl)
			{
				switch (aSoundName_str)
				{
					case "fire_ice_boss_death":
					case "fire_boss_spawn":
					case "earth_boss_spawn":
					case "earth_boss_death":
					case "lightning_boss_spawn":
					case "lightning_boss_death":
					case "ice_boss_spawn":
					case "boss_laugh":
					case "boss_coins_explode":
					case "wins_small":
					case "wins_medium":
					case "wins_large":
						if(!this._isFXSoundVolumeOn() && (aSoundName_str == "wins_small" || aSoundName_str == "wins_medium" || aSoundName_str == "wins_large"))
						{
							break;
						}
						if (this._fIsMuteOnBigWinPlayingInProgress_num > 0 || this._fVolumeBgMusicChangeTimer_tmr || this._fIsNeedFadeBgMusicSound_bl)
						{
							break;
						}

						let lSoundNames_arr = [
							...BG_MAIN_SOUNDS
						];
						this._multiplySoundVolume(lSoundNames_arr, 0.75);
						lSound_ussc.once(SimpleSoundController.i_EVENT_SOUND_PLAYING_COMPLETED, () => { !this._fIsFaded_bl && (this._fIsMuteOnBigWinPlayingInProgress_num <= 0) && !this._fVolumeBgMusicChangeTimer_tmr && this._multiplySoundVolume(lSoundNames_arr, 1) });
						break;
				}

				if (aOptVolumeMultiplier_num !== lSound_ussc.i_getInfo().i_getIndependentVolumeFactor())
				{
					this._multiplySoundVolume([aSoundName_str], aOptVolumeMultiplier_num);
					if (aOptVolumeMultiplier_num !== 1)
					{
						lSound_ussc.once(SimpleSoundController.i_EVENT_SOUND_PLAYING_COMPLETED, () => { !this._fIsFaded_bl && this._multiplySoundVolume([aSoundName_str], 1) });
					}
				}

				if (this._fIsBuyScreeenActive_bl)
				{
					!this._isFadeExeprion(aSoundName_str) && this._multiplySoundVolume([aSoundName_str], 0.8);
				}
			}
			else
			{
				!this._isFadeExeprion(aSoundName_str) && this._multiplySoundVolume([aSoundName_str], 0);
			}
		}
		else
		{
			APP.logger.i_pushWarning(`GameSoundsController. __playSound. Failed to play sound: ${aSoundName_str}`);
		}

		return lSound_ussc;
	}

	_onServerMessage(event)
	{
		let data = event.messageData;
		switch (data.class)
		{
			case SERVER_MESSAGES.GET_ROOM_INFO_RESPONSE:
				this._onGameStateChanged({ mapId: data.mapId });
				break;
		}
	}

	_onGameSubRoundStateChanged(aEvent_evnt)
	{
		this._fCurrentMap_num = aEvent_evnt.mapId;
		if (this._fIsBossSubroubdPlaying_bl && aEvent_evnt.value !== SUBROUND_STATE.BOSS)
		{
			this._changeBossBgSounds();
			return;
		}
		if (aEvent_evnt.value === SUBROUND_STATE.BOSS)
		{
			this._fIsBossSubroubdPlaying_bl = true;
		}
		this._validateMusic();
	}

	_changeBossBgSounds()
	{
		this._fIsBossSubroubdPlaying_bl = false;
		if (this._fMusicBg_uscc !== undefined)
		{
			let lCrossFadeMusicBg_uscc = this._addSoundToCrossFadeOut(this._fMusicBg_uscc);
			this.setVolumeSmoothly(this._fCurrentBgMusicSound, 0, CROSS_FADE_DURATION, null, () =>
			{
				this._resetCrossFadeOutMusic(lCrossFadeMusicBg_uscc);
			});
		}
		this._validateMusic();
	}

	_onGameStateChanged(aEvent_evnt)
	{
		if (!this._fIsMenuOpen_bl)
		{
			this._validateMusic();
		}

		switch (aEvent_evnt.value)
		{
			case ROUND_STATE.PLAY:
				this._fIsGameRoundPlaying_bl = true;
				break;
		}
	}

	_stopAllExcessMusic()
	{
		let l_uscc = this._fMusicBg_uscc;
		for (let i = 0; i < BG_SOUNDS.length; i++)
		{
			let lMusicName_str = BG_SOUNDS[i];

			if (
				l_uscc &&
				l_uscc.i_getInfo().i_getSoundName() !== lMusicName_str
			)
			{
				this.__stopSound(lMusicName_str);
			}
			else if (!l_uscc)
			{
				this.__stopSound(lMusicName_str);
			}
		}

	}

	_validateMusic()
	{
		if (this._fIsMenuOpen_bl)
		{
			return;
		}

		if (this._isRoundResultScreenActive())
		{
			this._tryToPlayBGScreenSummarySound();
			return;
		}

		if (this._fIsBossSubroubdPlaying_bl)
		{
			if (this._fGameStateInfo_gsi.subroundLasthand || APP.currentWindow.isPaused)
			{
				this._clearMainBgMusicChangeTimer();
				this._playBgMusic("mq_mus_game_bg_boss");
			}
		}
		else if (this._fGameStateInfo_gsi.isQualifyState)
		{
			if (this._fRoundResultScreenController_tsc.info.isActiveScreenMode)
			{
				if (APP.isBattlegroundGame && !this._fIsRoundResultScreenActivated_bl)
				{
					this._tryToPlayMainBgMusic();
				}
				else if (!APP.isBattlegroundGame
					|| APP.isBattlegroundGame && APP.currentWindow.isPaused)
				{
					this._stopBgMusic();
				}
			}
			else
			{
				this._tryToPlayMainBgMusic();
			}
		}
		else if (APP.isBattlegroundGame)
		{
			this._tryToPlayMainBgMusic();
		}
		else if (!this._fGameStateInfo_gsi.isWaitState)
		{
			this._tryToPlayMainBgMusic();
		}
	}

	_tryToPlayMainBgMusic()
	{
		let lMusicBgInfo_ussi = this._fMusicBg_uscc ? this._fMusicBg_uscc.i_getInfo() : null;
		let lCurrentPlayingBgSoundName_str = lMusicBgInfo_ussi ? lMusicBgInfo_ussi.i_getSoundName() : null;
		if (
			lMusicBgInfo_ussi
			&& lCurrentPlayingBgSoundName_str
			&& ~lCurrentPlayingBgSoundName_str.indexOf(BG_MAIN_SOUND_NAME)
			&& lMusicBgInfo_ussi.i_isPlayingStatePlaying()
		) //already playing
		{
			return;
		}

		this._playMainBgMusic(this._fCurrentBgMusicSound === "mq_mus_game_bg_boss");
	}

	_playMainBgMusic(aOptSmoothly_bl = true)
	{
		this._clearMainBgMusicChangeTimer();

		this._fCurrentBgMusicInd_int = this._generateNextBgMusicInd();
		let lStopPreviousBgMusic_bl = !aOptSmoothly_bl;
		let lSoundName_str = BG_MAIN_SOUND_NAME + this._fCurrentBgMusicInd_int;

		let lMainBgMusic_mssc = this.i_getSoundController(lSoundName_str);

		if (!lMainBgMusic_mssc)
		{
			APP.logger.i_pushWarning(`GameSoundsController. _playMainBgMusic. Failed to get sound controller for sound: ${lSoundName_str}`);
		}

		if (this._fIsMuteOnBigWinPlayingInProgress_num > 0)
		{
			lMainBgMusic_mssc && lMainBgMusic_mssc.i_setVolume(0);
		}
		else if (this._fVolumeBgMusicChangeTimer_tmr)
		{
			let lVolume_num = this._fVolumeCounter_num * this._fCurrentMusicVolume_num;
			if (lVolume_num > 1)
			{
				lVolume_num = 1;
			}
			lMainBgMusic_mssc && lMainBgMusic_mssc.i_setVolume(lVolume_num);
		}

		this._playBgMusic(lSoundName_str, true, aOptSmoothly_bl, lStopPreviousBgMusic_bl);
	}

	_isFXSoundVolumeOn()
	{
		for (let lSoundName_str in this._fFxSounds_ussc_obj)
		{
			if(this._getAbsoluteVolume(lSoundName_str) == 0 )
			{
				return false;
			}
		}
		return true;
	}

	_isBossExist()
	{
		const lEnemies_arr = APP.gameScreen.enemiesController.getRegisteredEnemies();
		if (lEnemies_arr)
		{
			for (let i = 0; i < lEnemies_arr.length; i++)
			{
				if (lEnemies_arr[i].typeId == ENEMY_TYPES.BOSS)
				{
					return true;
				}
			}
		}
		return false;
	}

	_generateNextBgMusicInd()
	{
		if (this._fCurrentBgMusicInd_int != null)
		{
			return this._fCurrentBgMusicInd_int % BG_MAIN_SOUNDS.length + 1;
		}

		return Math.floor(Math.random() * BG_MAIN_SOUNDS.length) + 1;
	}

	_onTimeToChangeMainBgMusicWithinRound()
	{
		if (APP.isSecondaryScreenActive)
		{
			this._fBackgroundMusicChangeRequired_bl = true;
		}
		else 
		{
			this._changeMainBgMusic();
			this._fBackgroundMusicChangeRequired_bl = false;
		}

	}

	_clearMainBgMusicChangeTimer()
	{
		this._fMainBgMusicChangeTimer_tmr && this._fMainBgMusicChangeTimer_tmr.destructor();
		this._fMainBgMusicChangeTimer_tmr = null;
	}

	_isRoundResultScreenActive()
	{
		return this._fRoundResultScreenController_tsc.isActive && this._fRoundResultScreenController_tsc.info.isActiveScreenMode && !this._fGameStateInfo_gsi.isPlayState;
	}

	_changeMainBgMusic()
	{
		if (APP.isBattlegroundGame && this._isRoundResultScreenActive())
		{
			return;
		}

		this._clearMainBgMusicChangeTimer();

		if (this._fMusicBg_uscc !== undefined && this._fCurrentBgMusicSound)
		{

			if (this._fIsMuteOnBigWinPlayingInProgress_num <= 0)
			{
				this._fPreviousBGSoundName_str = this._fCurrentBgMusicSound;
				let lCrossFadeMusicBg_uscc = this._addSoundToCrossFadeOut(this._fMusicBg_uscc);
				this.setVolumeSmoothly(this._fCurrentBgMusicSound, 0, CROSS_FADE_DURATION, null, () =>
				{
					this._resetCrossFadeOutMusic(lCrossFadeMusicBg_uscc);
				});
				this._fCurrentTimerVolumeDown_tmr = new Timer(() => { this._fIsNeedFadeBgMusicSound_bl = false; }, CROSS_FADE_DURATION);
				this._fIsNeedFadeBgMusicSound_bl = true;
			}

			this._fPreviousBGSoundName_str = this._fCurrentBgMusicSound;
		}

		this._playMainBgMusic(true);
	}

	_playBgMusic(aSoundName_str, aOptAutoplay_bl = true, aOptSmoothly_bl = false, aOptStopPreviousBgSound_bl = true)
	{
		if (!this.__getInfo().soundsAllowedToPlay)
		{
			return;
		}

		if (this._fMusicBg_uscc)
		{
			let lMusicBgInfo_ussi = this._fMusicBg_uscc.i_getInfo();

			if (lMusicBgInfo_ussi.i_getSoundName() === aSoundName_str)
			{
				return;
			}

			if (lMusicBgInfo_ussi.i_isPlayingStatePlaying() || lMusicBgInfo_ussi.i_isPlayingStatePaused())
			{
				if (aOptStopPreviousBgSound_bl)
				{
					this._fMusicBg_uscc.i_stopPlaying();
				}
			}
		}

		this._clearMainBgMusicChangeTimer();

		var isNeedLoop_bl = aSoundName_str == "mq_mus_game_bg_boss";
		this._fMusicBg_uscc = this.i_getSoundController(aSoundName_str, isNeedLoop_bl);

		if (this._fMusicBg_uscc && aOptAutoplay_bl)
		{
			this._fMusicBg_uscc.i_startPlaying();
			let duration = this._fMusicBg_uscc.i_getInfo().i_getSoundDescriptor().i_getLength() - CROSS_FADE_DURATION;
			if (duration < 0)
			{
				duration = 0;
			}
			if (aSoundName_str != "mq_mus_game_bg_boss" && aSoundName_str != BG_SUMMARY_SCREEN_SOUND_NAME)
			{
				this._fMainBgMusicChangeTimer_tmr = new Timer(this._onTimeToChangeMainBgMusicWithinRound.bind(this), duration);
			}
		}
		if (aOptSmoothly_bl || aSoundName_str == "mq_mus_game_bg_boss")
		{
			let lSoundName_str = aSoundName_str;
			this.setFadeMultiplier(lSoundName_str, 0);

			if (this._fIsMuteOnBigWinPlayingInProgress_num > 0)
			{
				this.setVolumeSmoothly(lSoundName_str, 0, 1, null);
			}
			else
			{
				this.setVolumeSmoothly(lSoundName_str, this._curFadeMult, CROSS_FADE_DURATION);
			}
		}
		this._fCurrentBgMusicSound = aSoundName_str;
	}

	_stopBgMusic()
	{
		if (this._fMusicBg_uscc)
		{
			let lMusicBgInfo_ussi = this._fMusicBg_uscc.i_getInfo();
			if (lMusicBgInfo_ussi.i_isPlayingStatePlaying() || lMusicBgInfo_ussi.i_isPlayingStatePaused())
			{
				this._fMusicBg_uscc.i_stopPlaying();
			}
			this._fMusicBg_uscc = null;
		}
		this._fCurrentBgMusicSound = null;
		this._fCurrentBgMusicInd_int = 0;
		this._clearMainBgMusicChangeTimer();
		this._resetAllCrossFadeOutMusic();
	}

	_onBossEnemyRising(aEvent_evnt)
	{
		if (this._fCurrentBgMusicSound === "mq_mus_game_bg_boss")
		{
			this._playBossLaughSound();
			return;
		}

		if (this._fMusicBg_uscc)
		{
			let lCrossFadeMusicBg_uscc = this._addSoundToCrossFadeOut(this._fMusicBg_uscc);
			this.setVolumeSmoothly(this._fCurrentBgMusicSound, 0, CROSS_FADE_DURATION, null, () =>
			{
				this._resetCrossFadeOutMusic(lCrossFadeMusicBg_uscc);
			});
			this._playBgMusic("mq_mus_game_bg_boss", true, true, false);
		}
	}

	_onBossEnemyDestroying(aEvent_evnt)
	{
		switch (aEvent_evnt.bossName)
		{
			case ENEMIES.LightningBoss:
				//this.__playSound("mq_boss_spider_death"); //TO DO
				break;
		}
	}

	_onLobbyBackgroundFadeStart(event)
	{
		let lIsUIVisible_bl = Boolean(event.endVolume);
		this._fIsFaded_bl = lIsUIVisible_bl;

		if (lIsUIVisible_bl)
		{
			this._muteFxSounds();
			this._fadeBGSounds(0);
		}
		else
		{
			if (this._fIsMuteOnBigWinPlayingInProgress_num <= 0)
			{
				this._unmuteFxSounds();
				this._fadeBGSounds(this._curFadeMult);
			}

		}
	}

	_fadeBGSounds(aEndVolume, aFadingTime_num)
	{
		for (let i = 0; i < BG_SOUNDS.length; i++)
		{
			let lBgSoundName_str = BG_SOUNDS[i];
			if (this._isThisMusicCrossFadeOut(lBgSoundName_str))
			{
				// this sound is already fading out, don't apply additional fading
				continue;
			}

			let lVolume_num = aEndVolume;
			if (aEndVolume > 1)
			{
				lVolume_num = 1;
			}

			let lFadingTime_num = aFadingTime_num ? aFadingTime_num : BACKGROUND_SOUNDS_FADING_TIME;
			this.setVolumeSmoothly(lBgSoundName_str, lVolume_num, lFadingTime_num);
		}
	}

	_muteFxSounds()
	{
		for (let lSoundName_str in this._fFxSounds_ussc_obj)
		{
			!this._isFadeExeprion(lSoundName_str) && this._multiplySoundVolume([lSoundName_str], 0);
		}
	}

	_unmuteFxSounds()
	{
		for (let lSoundName_str in this._fFxSounds_ussc_obj)
		{
			this._multiplySoundVolume([lSoundName_str], 1);
		}
	}

	_isFadeExeprion(aSoundName_str)
	{
		for (let i = 0; i < FADE_EXEPTIONS.length; i++)
		{
			if (aSoundName_str == FADE_EXEPTIONS[i])
			{
				return true;
			}
		}
		return false;
	}

	_onRoomPaused()
	{
		this._validateMusic();
	}

	_onRoomUnpaused()
	{
		if (this._fGameStateInfo_gsi.subroundState != SUBROUND_STATE.BOSS)
		{
			this._fIsBossSubroubdPlaying_bl = false;
		}
		this._validateMusic();
		if (this._fMusicBg_uscc && this._fMusicBg_uscc.i_getInfo() && this._fMainBgMusicChangeTimer_tmr)
		{
			var lCurrentPositionMusicBg_num = this._fMusicBg_uscc.i_getPosition();
			var duration = this._fMusicBg_uscc.i_getInfo().i_getSoundDescriptor().i_getLength() - CROSS_FADE_DURATION;
			this._fMainBgMusicChangeTimer_tmr.setTimeout(duration - lCurrentPositionMusicBg_num);
		}
	}

	_onBattlegroundFinalCountingNextCountStarted()
	{
		this.__playSound("mq_dragonstone_round_countdown");
	}

	_onSomeBigWinPresentationStarted(aEvent_evnt)
	{
		let lSoundName_str = "";

		switch (aEvent_evnt.bigWinTypeId)
		{
			case "BIG":
				lSoundName_str = "big_win_sound";
				break;
			case "HUGE":
				lSoundName_str = "huge_win_sound";
				break;
			case "MEGA":
				lSoundName_str = "mega_win_sound";
				break;
		}

		this._fBigWinSound_ussc = this.__playSound(lSoundName_str, false);

		let lMusicSoundController_mssc = this.__getMusicSoundController(lSoundName_str);

		if (!lMusicSoundController_mssc)
		{
			APP.logger.i_pushWarning(`GameSoundsController. _onSomeBigWinPresentationStarted. Failed to get music sound controller for sound: ${lSoundName_str}`);
			return;
		}

		let lMusicSoundInfo_smsi = lMusicSoundController_mssc ? lMusicSoundController_mssc.__getInfo() : null;

		if (lMusicSoundInfo_smsi)
		{
			lMusicSoundInfo_smsi.i_setLoop(false);
		}
	}

	_onSomeEnemyDeathSoundRequired(aEvent_evnt)
	{
		let soundName = "";
		switch (aEvent_evnt.typeId)
		{
			case ENEMY_TYPES.GOLD_CAPSULE:
				soundName = 'moneywheel_container_explosion';
				break;
			case ENEMY_TYPES.BOMB_CAPSULE:
				soundName = 'bomb_container_explosion';
				break;
			case ENEMY_TYPES.BULLET_CAPSULE:
				soundName = 'rocket_container_explosion';
				break;
			case ENEMY_TYPES.KILLER_CAPSULE:
				soundName = 'instakill_triggered';
				break;
			case ENEMY_TYPES.FREEZE_CAPSULE:
				soundName = 'freeze_container_explosion';
				break;
		}
		if (soundName)
		{
			this.__playSound(soundName);
		}
	}


	_onServerRoundFinishSoonMessage()
	{
		this.play('10secleft');
	}

	_onBossAppearingStarted(aEvent_obj)
	{
		switch(aEvent_obj.bossType)
		{
			case ENEMIES.LightningBoss: 
				this.__playSound("lightning_boss_spawn");
				break;
			case ENEMIES.FireBoss: 
				this.__playSound("fire_boss_spawn");
				break;
			case ENEMIES.Earth: 
				this.__playSound("earth_boss_spawn");
				break;
			case ENEMIES.IceBoss: 
				this.__playSound("ice_boss_spawn");
				break;
			default:
				break;
		}
	}

	_onBossCaptionBecameVisible(aEvent_obj)
	{
		let lSoundName_str = "";

		switch(aEvent_obj.bossType)
		{
			case ENEMIES.LightningBoss: 
				lSoundName_str = "lightning_boss_spawn_caption";
				break;
			case ENEMIES.FireBoss: 
				lSoundName_str = "fire_boss_spawn_caption";
				break;
			case ENEMIES.Earth: 
				lSoundName_str = "earth_boss_spawn_caption";
				break;
			case ENEMIES.IceBoss: 
				lSoundName_str = "ice_boss_spawn_caption";
				break;
			default:
				break;
		}

		this._fBossCaptionSound_ussc = this.__playSound(lSoundName_str, false);
		this._fBossCaptionSound_ussc && this._fBossCaptionSound_ussc.once(SimpleSoundController.i_EVENT_SOUND_PLAYING_COMPLETED, this._playBossLaughSound, this);
	}

	_playBossLaughSound()
	{
		this.__playSound("boss_laugh", false);
	}

	_onBossDisappearingStarted(e)
	{
		switch(e.bossType)
		{
			case ENEMIES.LightningBoss: 
				this.__playSound("lightning_boss_death");
				break;
			case ENEMIES.FireBoss:
				this.__playSound("fire_ice_boss_death");
				break;
			case ENEMIES.Earth: 
				this.__playSound("earth_boss_death");
				break;
			case ENEMIES.IceBoss: 
				this.__playSound("fire_ice_boss_death");
				break;
			default:
				break;
		}
	}

	_onBossCoinsExplodeStart(aEvent)
	{
		if(aEvent.playSound)
		{
			this.__playSound("boss_coins_explode");
		}
	}

	_onEnemyIceExplosionAnimationStarting()
	{
		this.__playSound("ice_breaking");
	}

	_onRoundResultScreenActivated(aEvent)
	{
		this._fIsRoundResultScreenActivated_bl = true;
		if(aEvent.needStartSummary || aEvent.isSkipIntro_bl)
		{
			this._tryToPlayBGScreenSummarySound();
		}
		else
		{
			this._tryStopAllMusic();
			let lSummaryWinSound_ussc = this.__playSound("summary_win", false);
			lSummaryWinSound_ussc.once(SimpleSoundController.i_EVENT_SOUND_PLAYING_COMPLETED, () => {
				this._tryToPlayBGScreenSummarySound();
			}, this);
		}
	}

	_isSummaryWinPlaying()
	{
		let lSummaryWinSound_ussc = this.i_getSoundController("summary_win", false);
		return lSummaryWinSound_ussc.i_isSoundPlaying();
	}

	_onTreasuresCoinsAnimationStarted(aEvent_evnt)
	{
		this.__playSound("wins_coinappear", true);
	}

	_onTreasuresCoinsAnimationCompleted(aEvent_evnt)
	{
		this.__stopSound("wins_coinappear");
	}

	_clearBigWinSound()
	{
		if (this._fIsNeedFadeBgMusicSoundAfterBigWin_bl)
		{
			this._onTimeToFadeMainBgMusic();
			this._fIsNeedFadeBgMusicSoundAfterBigWin_bl = false;
		}

		let lMusicSoundController_mssc = this._fBigWinSound_ussc;
		lMusicSoundController_mssc && lMusicSoundController_mssc.i_destroy();
	}

	_tryStopAllMusic()
	{
		let lMusicBgInfo_ussi = this._fMusicBg_uscc ? this._fMusicBg_uscc.i_getInfo() : null;
		let lCurrentPlayingBgSoundName_str = lMusicBgInfo_ussi ? lMusicBgInfo_ussi.i_getSoundName() : null;

		if (!lCurrentPlayingBgSoundName_str
			|| lCurrentPlayingBgSoundName_str && lCurrentPlayingBgSoundName_str != BG_SUMMARY_SCREEN_SOUND_NAME)
		{
			this._clearMainBgMusicChangeTimer();
			this._resetAllCrossFadeOutMusic();
			this._stopBgMusic();
		}
	}

	_tryToPlayBGScreenSummarySound()
	{
		if (this._fIsRoundResultScreenActivated_bl && APP.isBattlegroundGame)
		{
			if (!this._isSummaryWinPlaying())
			{
				this._tryStopAllMusic();

				this._playBgMusic(BG_SUMMARY_SCREEN_SOUND_NAME);
			}
		}
		else
		{
			this._validateMusic();
		}
	}

	_onRoundResultScreenDeactivated()
	{
		this._fIsRoundResultScreenActivated_bl = false;
		if (this._fGameStateInfo_gsi.isPlayState
			|| APP.isBattlegroundGame)
		{
			this._validateMusic();
		}
	}

	destroy()
	{
		APP.off(Game.EVENT_ON_SOUND_SETTINGS_CHANGED, this.__updateSoundSettings, this);
		APP.off(Game.EVENT_ON_CLOSE_ROOM, this._onCloseRoom, this);

		if (APP.webSocketInteractionController)
		{
			APP.webSocketInteractionController.off(GameWebSocketInteractionController.EVENT_ON_SERVER_MESSAGE, this._onServerMessage, this);
		}

		if (APP.currentWindow)
		{
			APP.currentWindow.off(GameScreen.EVENT_ON_NEW_BOSS_CREATED, this._onBossEnemyRising, this);
			APP.currentWindow.off(GameScreen.EVENT_ON_BOSS_DESTROYING, this._onBossEnemyDestroying, this);
			APP.currentWindow.off(GameScreen.EVENT_ON_ROOM_PAUSED, this._onRoomPaused, this);
			APP.currentWindow.off(GameScreen.EVENT_ON_ROOM_UNPAUSED, this._onRoomUnpaused, this);

			APP.currentWindow.gameFieldController && APP.currentWindow.gameFieldController.off(GameFieldController.EVENT_ON_GAME_FIELD_SCREEN_CREATED, this._onGameFieldScreenCreated, this);
		}

		if (this._fGameStateController_gsc)
		{
			this._fGameStateController_gsc.off(GameStateController.EVENT_ON_SUBROUND_STATE_CHANGED, this._onGameSubRoundStateChanged, this);
		}

		this._fGameStateController_gsc = null;
		this._fGameStateInfo_gsi = null;

		this._fMusicBg_uscc = null;
		this._fIsFaded_bl = null;

		this._fVolumeBgMusicChangeTimer_tmr && this._fVolumeBgMusicChangeTimer_tmr.destructor();
		this._fVolumeBgMusicChangeTimer_tmr = null;

		this._fIsGameRoundPlaying_bl = null;

		this._fBigWinSound_ussc && this._fBigWinSound_ussc.i_destroy();
		this._fBigWinSound_ussc = null;

		this._fCrossFadeOutBg_uscc_arr = null;

		super.destroy();
	}
}

export default GameSoundsController;