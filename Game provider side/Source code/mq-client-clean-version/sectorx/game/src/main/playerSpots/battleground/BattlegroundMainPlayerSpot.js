import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { WEAPONS } from '../../../../../shared/src/CommonConstants';
import TextField from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/TextField';

import PlayerSpot from './../PlayerSpot';

import NumberValueFormat from '../../../../../../common/PIXI/src/dgphoenix/unified/view/custom/values/NumberValueFormat';
import I18 from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
import GameStateController from './../../../controller/state/GameStateController';
import PlayerSpotButton from './../PlayerSpotButton';
import PlayerSpotTurretButton from './../PlayerSpotTurretButton';
import GameFieldController from '../../../controller/uis/game_field/GameFieldController';
import GameScreen from './../../GameScreen';
import ShotResponsesController from './../../../controller/custom/ShotResponsesController';
import PlayerSpotRestrictedZone from './../PlayerSpotRestrictedZone';
import MainPlayerSpot from './../MainPlayerSpot';
import LevelUpAnimation from './LevelUpAnimation';

import BattlegroundSpotWeaponQueueView from './BattlegroundSpotWeaponQueueView';

import GamePlayerController from './../../../controller/custom/GamePlayerController';
import PlayerInfo from '../../../../../../common/PIXI/src/dgphoenix/unified/model/custom/PlayerInfo';
import AutofireOnOffButton from './AutofireOnOffButton';

const DEF_WEAPON_VALUE = "∞";
const AMMO_FONT_SIZE = {
	"DEFAULT" : 15,
	"INFINITY" : 38
}

class BattlegroundMainPlayerSpot extends PlayerSpot
{
	static get EVENT_CHANGE_WEAPON() { return PlayerSpot.EVENT_CHANGE_WEAPON; }
	static get EVENT_RELOAD_REQUIRED() { return "onPlayerSpotReloadRequired"; }
	static get EVENT_AMMO_UPDATED() { return "onAmmoUpdated"; }
	static get EVENT_ON_BET_MULTIPLIER_CHANGED() { return "onBetMultiplierChanged"; }
	static get EVENT_ON_BET_UPDATE_REQUIRED() { return "onBetUpdateRequired"; }
	static get EVENT_ON_CHANGE_WEAPON_TO_DEFAULT_REQUIRED() { return "onChangeWeaponToDefaultRequired"; }
	static get EVENT_ON_ROTATE_GUN_TO_ZERO() { return "rotateGunToZero"; }

	static get EVENT_ON_AUTOFIRE_BUTTON_ENABLED() 					{return AutofireOnOffButton.EVENT_ON_ENABLE;}
	static get EVENT_ON_AUTOFIRE_BUTTON_DISABLED() 					{return AutofireOnOffButton.EVENT_ON_DISABLE;}

	get rotationBlocked()
	{
		return this._fRotationBlocked_bln;
	}
	
	onBetChangeConfirmed(aMultiplier_num, aNeedSoundChangeTuret_bl = true)
	{
		this._onBetChangeConfirmed(aMultiplier_num, aNeedSoundChangeTuret_bl);
	}

	onBetChangeNotConfirmed()
	{
		this._onBetChangeNotConfirmed();
	}

	get currentBetMultiplier()
	{
		return this._fCurrentMult_num;
	}

	updateAmmo(aOptAmmo_int, aOptWaitBuyIn_bln)
	{
		this._updateAmmo(aOptAmmo_int, aOptWaitBuyIn_bln);
	}

	onPlusButtonClicked(aEmulateClickAnimation_bln, aWaitingBetLevelChange_bln)
	{
		this._onPlusButtonClicked(aEmulateClickAnimation_bln, aWaitingBetLevelChange_bln);
	}

	onMinusButtonClicked(aEmulateClickAnimation_bln, aWaitingBetLevelChange_bln)
	{
		this._onMinusButtonClicked(aEmulateClickAnimation_bln, aWaitingBetLevelChange_bln);
	}

	isPlusButtonClickedAllowed()
	{
		return true;
	}

	isMinusButtonClickedAllowed()
	{
		return true;
	}

	resetWaitingBetLevelChange()
	{
		this._fIsWaitingBetLevelChange_bl = false;
	}

	constructor(aPlayer_obj, aPosition_obj)
	{
		super(aPlayer_obj, aPosition_obj);

		if(APP.gameScreen.player.lastReceivedBattlegroundScore_int !== undefined)
		{
			this._setScoreValue(APP.gameScreen.player.lastReceivedBattlegroundScore_int);
		}
	}

	get __restrictedZonesInfo()
	{
		let lHitZoneFirstBottomOffsetY_num = this._isBottom ? 0 : -4.5;
		let lHitZoneSecondBottomOffsetY_num = this._isBottom ? 0 : 13;
		let lHitZoneCircleRadiusOffset_num  = this._isBottom ? 0 : 2;

		return [
			{
				type: PlayerSpotRestrictedZone.TYPE_HIT_ZONE_CIRCLE,
				params: {x: -1, y: -7.5 + lHitZoneSecondBottomOffsetY_num, width: 29.5 + lHitZoneCircleRadiusOffset_num, height: 29.5 + lHitZoneCircleRadiusOffset_num}
			},
			{
				type: PlayerSpotRestrictedZone.TYPE_HIT_ZONE_CIRCLE,
				params: {x: -89.5, y: 2.5 + lHitZoneFirstBottomOffsetY_num, width: 25.5, height: 25.5}
			},
			{
				type: PlayerSpotRestrictedZone.TYPE_HIT_ZONE_CIRCLE,
				params: {x: 89.5, y: 2.5 + lHitZoneFirstBottomOffsetY_num, width: 25.5, height: 25.5}
			},
			{
				type: PlayerSpotRestrictedZone.TYPE_HIT_ZONE_RECT,
				params: {x: -94, y: -23 + lHitZoneFirstBottomOffsetY_num, width: 188, height: 50.5}
			}
		];
	}

	forceLevelUps()
	{
		this._forceLevelUps();
	}

	get hasPendingHighLevelShots()
	{
		return !!this._fPendingLevelUpShots_num_arr && !!this._fPendingLevelUpShots_num_arr.length;
	}

	setScore(aScore_int)
	{
		if(aScore_int === undefined)
		{
			aScore_int = 0;
		}
		
		this._setScoreValue(aScore_int);
	}

	_setScoreValue(aScore_int)
	{
		let l_str = NumberValueFormat.formatMoney(aScore_int, true, 0) + "";
		
		if(l_str === "NaN")
		{
			l_str = "0";
		}

		this._fScoreValue_tf.text = l_str;
	}


	get _gunCenter()
	{
		if (!this._isBottom)
		{
			return { x: 0, y: 8 };
		}
		return { x: 0, y: -8 };
	}

	get _possibleBetLevels()
	{
		return APP.playerController.info.possibleBetLevels;
	}

	// override
	get isWeaponChangeEffectsInProgress()
	{
		if (!this._fLevelUpAnimations_lup_arr || !this._fLevelUpAnimations_lup_arr.length)
		{
			return false;
		}

		let l_bl = false;

		for (let i=0; i<this._fLevelUpAnimations_lup_arr.length; i++)
		{
			let l_lup = this._fLevelUpAnimations_lup_arr[i];
			if (!l_lup.isBadgeLanded)
			{
				l_bl = true;
				break;
			}
		}

		return l_bl;
	}

	_init()
	{
		this._fPendingLevelUpShots_num_arr = [];

		this._tournamentModeInfo = APP.tournamentModeController.info;
		this._fIsWaitingBetLevelChange_bl = null;

		this._fGunLevelDigits_s_arr = [];
		this._fGunLevelPowerArrows_s_arr = [];

		this._fAmmoValue_tf = null;
		this._fCurrentMultId_num = 0;
		this._fIsNeedPlaySoundChangeWeapon_int = 1;
		this._fCurrentMult_num = this._possibleBetLevels[this._fCurrentMultId_num];

		this._fLevelUpAnimations_lup_arr = [];
		this._fLevelUpWeaponGlowEffects_sprt_arr = [];

		this._fRicochetInfo_ri = null;
		this._fReloadRequiredSent_bln = false;
		this._fGameStateInfo_gsi = APP.currentWindow.gameStateController.info;

		super._init();

		this._fWeaponsInfo_wsi = APP.currentWindow.weaponsController.i_getInfo();
		this._fFireSettingsInfo_fssi = APP.currentWindow.fireSettingsController.i_getInfo();

		this._initMain();

		this.on("pointermove", this._onPointerMove, this);

		APP.currentWindow.gameStateController.on(GameStateController.EVENT_ON_GAME_STATE_CHANGED, this._onGameStateChanged, this);
		APP.currentWindow.gameFieldController.on(GameFieldController.EVENT_ON_RICOCHET_BULLETS_UPDATED, this._onRicochetBulletsUpdated, this);
		APP.currentWindow.on(GameScreen.EVENT_ON_SHOT_TRIGGERED, this._onShotTriggered, this);
		APP.currentWindow.shotResponsesController.on(ShotResponsesController.EVENT_ON_SERVER_SHOT_RESPONSE, this._onShotResponse, this);
		APP.playerController.on(GamePlayerController.EVENT_ON_PLAYER_INFO_UPDATED, this._onPlayerInfoUpdated, this);
	}

	_onPlayerInfoUpdated(aEvent_obj )
	{
		const lUpdatedWeapons_obj = aEvent_obj.data[PlayerInfo.KEY_CURRENT_POWER_UP_MULTIPLIER];
		if (lUpdatedWeapons_obj)
		{
			this._fWeaponsInfo_wsi && this._fWeaponsInfo_wsi.currentWeaponId && this._updatePowerUpIndicator(this._fWeaponsInfo_wsi.currentWeaponId);
		}
	}

	_initMain()
	{
		this._addScoreValue();
		this._getAmmoTextField();


		this._addGunLevelIndicator();

		this._addAutoFireButton();
		//DEBUG...
		//this._addStakeButtons();
		//...DEBUG
	}


	_addAutoFireButton()
	{
		this._fAutoFireButton_b = this.addChild(new AutofireOnOffButton());

		this._fAutoFireButton_b.on(AutofireOnOffButton.EVENT_ON_ENABLE, this._onAutoFireEnabled, this);
		this._fAutoFireButton_b.on(AutofireOnOffButton.EVENT_ON_DISABLE, this._onAutoFireDisnabled, this);

		let lPositionX_num = 67;
		let lPositionY_num = this._isBottom ? 4 : 0 ;
		this._fAutoFireButton_b.position.set(lPositionX_num, lPositionY_num);
	}

	//override
	_changeWeapon(aWeaponId_int, aCurrentDefaultWeaponId_int, aIsSkipAnimation_bl = false, aIsNewAwardedLevelUp_bl = false)
	{
		if (
			aWeaponId_int == WEAPONS.HIGH_LEVEL &&
			this.currentBetMultiplier > this._possibleBetLevels[0] &&
			!aIsSkipAnimation_bl &&
			aIsNewAwardedLevelUp_bl
			)
		{
			let lIsPowerUpType_bl = this._fCurrentDefaultWeaponId_num !== aCurrentDefaultWeaponId_int;
			if (lIsPowerUpType_bl && this._isDuplicatedPowerUpAnimationExists(aCurrentDefaultWeaponId_int))
			{
				return;
			}

			if (!this._fPendingLevelUpShots_num_arr.length)
			{
				throw new Error(`Unable to start LevelUpAnimation, no pending shots amount defined`);
			}
			
			let lFinalPosition = {x: 0, y: 0};
			let lStartPosition_obj = {
				x: 0, 
				y: this._isBottom ? -150 : 150
			};

			if (!lIsPowerUpType_bl)
			{
				lFinalPosition = this._getAmmoBackgroundPosition();
			}

			let lShotsAmount = this._fPendingLevelUpShots_num_arr.shift();
			let lLevelUpAnimation_lua = this.addChild(new LevelUpAnimation(lStartPosition_obj, lFinalPosition, lShotsAmount));
			lLevelUpAnimation_lua.once(LevelUpAnimation.EVENT_ON_BADGE_LANDED, this._onLevelUpBadgeLanded, this);
			lLevelUpAnimation_lua.once(LevelUpAnimation.EVENT_ON_ANIMATION_COMPLETED, this._onLevelUpAnimationCompleted, this);

			this._fLevelUpAnimations_lup_arr.push(lLevelUpAnimation_lua);

			lLevelUpAnimation_lua.i_startLevelUpAnimation(aCurrentDefaultWeaponId_int, this._fCurrentDefaultWeaponId_num, this._isBottom);
		}
		else
		{
			this._showNewWeapon(aWeaponId_int, aCurrentDefaultWeaponId_int, aIsSkipAnimation_bl);
		}
	}

	_isDuplicatedPowerUpAnimationExists(aNewTurretTypeId_int)
	{
		if (!this._fLevelUpAnimations_lup_arr || !this._fLevelUpAnimations_lup_arr.length)
		{
			return false;
		}

		for (let i=0; i<this._fLevelUpAnimations_lup_arr.length; i++)
		{
			let l_lup = this._fLevelUpAnimations_lup_arr[i];
			if (l_lup.turretTypeId == aNewTurretTypeId_int)
			{
				return true;
			}
		}

		return false;
	}

	_onLevelUpBadgeLanded(event)
	{
		let lLevelUpAnim_lupa = event.target;
		let lTargetTurretTypeId = lLevelUpAnim_lupa.turretTypeId;

		if (lLevelUpAnim_lupa.isPowerUpAnimation)
		{
			this._showNewWeapon(WEAPONS.HIGH_LEVEL, lTargetTurretTypeId, true);

			if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
			{
				this.weaponSpotView.showPowerUPGlow();
			}
		}
		else
		{
			this._updateAmmo();
		}
	}

	_forceLevelUps()
	{
		if (this.isWeaponChangeEffectsInProgress)
		{
			for (let i=0; i<this._fLevelUpAnimations_lup_arr.length; i++)
			{
				let l_lup = this._fLevelUpAnimations_lup_arr[i];
				if (!l_lup.isBadgeLanded)
				{
					l_lup.once(LevelUpAnimation.EVENT_ON_BADGE_LANDED, () => { this._fPendingLevelUpShots_num_arr = []; }, this);
					break;
				}
			}
		}
		else
		{
			this._fPendingLevelUpShots_num_arr = [];
		}
	}

	_onLevelUpAnimationCompleted(event)
	{
		let lLevelUpAnim_lupa = event.target;
		
		this._destroyLevelUpAnimation(lLevelUpAnim_lupa);
	}

	_destroyLevelUpAnimation(aLevelUpAnim_lupa)
	{
		let l_int = this._fLevelUpAnimations_lup_arr.indexOf(aLevelUpAnim_lupa);
		if (l_int >= 0)
		{
			this._fLevelUpAnimations_lup_arr.splice(l_int, 1);
		}

		aLevelUpAnim_lupa.off(LevelUpAnimation.EVENT_ON_ANIMATION_COMPLETED, this._onLevelUpAnimationCompleted, this, true);
		aLevelUpAnim_lupa.destroy();
	}

	_interruptLevelUps()
	{
		if (this._fLevelUpAnimations_lup_arr)
		{
			while (this._fLevelUpAnimations_lup_arr.length)
			{
				this._destroyLevelUpAnimation(this._fLevelUpAnimations_lup_arr.pop());
			}
		}

		this._fPendingLevelUpShots_num_arr = [];
	}

	_showNewWeapon(aWeaponId_int, aCurrentDefaultWeaponId_int, aIsSkipAnimation_bl)
	{
		if (aWeaponId_int !== WEAPONS.HIGH_LEVEL
			&& !this._fGameStateInfo_gsi.isPlayState)
		{
			this._interruptLevelUps();
		}

		if (
			aWeaponId_int !== WEAPONS.HIGH_LEVEL
			&& this._fLevelUpAnimations_lup_arr.length > 0
			&& this._fGameStateInfo_gsi.isPlayState
			)
		{
			throw new Error(`Attempt to change weapon to ${aWeaponId_int} while any power up animation exist.`);
		}

		let lPrevWeaponId_num = this.currentWeaponId;
		super._changeWeapon(aWeaponId_int, aCurrentDefaultWeaponId_int, aIsSkipAnimation_bl);
		this._invalidateView();
	
		this._showGunLevel(APP.playerController.info.betLevel);
		this._updateAmmo();

		if(this._fCurrentDefaultWeaponId_num && this._fCurrentDefaultWeaponId_num != aCurrentDefaultWeaponId_int)
		{
			switch (this._fIsNeedPlaySoundChangeWeapon_int) {
				case 0:
					APP.soundsController.play("turret_battleground_change");// on change bet up
					this._fIsNeedPlaySoundChangeWeapon_int = 1;
					break;
				case 1:
					if(this._getAmmoTextField().text === DEF_WEAPON_VALUE)
					{
						APP.soundsController.play("turret_change");// on change down or not change bet
					}
					break;
				default:
					break;
			}
		}
		
		this._fCurrentDefaultWeaponId_num = aCurrentDefaultWeaponId_int;
	}

	_onAutoFireEnabled(aEvent_obj)
	{
		this._fRotationBlocked_bln = false;
		this.emit(BattlegroundMainPlayerSpot.EVENT_ON_AUTOFIRE_BUTTON_ENABLED, {enemy: aEvent_obj.enemy});
	}

	_onAutoFireDisnabled()
	{
		this.emit(BattlegroundMainPlayerSpot.EVENT_ON_AUTOFIRE_BUTTON_DISABLED);
	}

	_addTurretButton()
	{
		this._fTurretButton_b = this.addChild(new PlayerSpotTurretButton());
		this._fTurretButton_b.blendMode = PIXI.BLEND_MODES.SCREEN;
		this._fTurretButton_b.position.set(90, 0);
		this._fTurretButton_b.on("pointerdown", (e) => e.stopPropagation(), this);
		this._fTurretButton_b.on("pointerclick", this._onTurretClicked, this);

		if (this.currentWeaponId == WEAPONS.DEFAULT)
		{
			this._fTurretButton_b.enabled = false;
		}

		if (!this._isBottom)
		{
			this._fTurretButton_b.position.y = -3;
		}
	}

	_destroyLevelUpWeaponGlowEffect(aEffect_spr)
	{
		let l_int = this._fLevelUpWeaponGlowEffects_sprt_arr.indexOf(aEffect_spr);
		if (l_int >= 0)
		{
			this._fLevelUpWeaponGlowEffects_sprt_arr.splice(l_int, 1);
		}

		aEffect_spr.destroy();
	}
	
	_onTurretClicked(e)
	{
		e.stopPropagation();

		this._fTurretButton_b.enabled = false;
		this.emit(MainPlayerSpot.EVENT_ON_CHANGE_WEAPON_TO_DEFAULT_REQUIRED);
	}

	_getAmmoTextField()
	{
		if(!this._fAmmoValue_tf)
		{
			this._addAmmoValue();
		}

		return this._fAmmoValue_tf;
	}

	_getAmmoBackgroundPosition()
	{
		if (!this._isBottom)
		{
			return {x: 67, y: -3}
		}
		return {x: 67, y: 0}
	}

	_addAmmoValue()
	{
		let lBackPos_obj = this._getAmmoBackgroundPosition();
		let lX_num = lBackPos_obj.x;
		let lY_num = lBackPos_obj.y;

		let lBlueBase_s = this.getBackgroundSprite().addChild(APP.library.getSprite("player_spot/battleground/ammo_back"));
		lBlueBase_s.position.set(lX_num, lY_num);

		let lStyle_obj =
		{
			fontFamily: "fnt_nm_barlow_bold",
			fontSize: AMMO_FONT_SIZE["DEFAULT"],
			align: "center",
			fill: 0x000000
		}

		this._fAmmoValue_tf = this.getBackgroundSprite().addChild(new TextField(lStyle_obj));
		this._fAmmoValue_tf.position.set(lX_num, lY_num-2);
		this._fAmmoValue_tf.maxWidth = 38;
		this._fAmmoValue_tf.anchor.set(0.5, 0.5);

		let l_ta = this.getBackgroundSprite().addChild(I18.generateNewCTranslatableAsset("TABattlegroundPlayerSpotAmmo"));
		l_ta.position.set(lX_num, lY_num + 20);
	}

	_addScoreValue()
	{
		let l_s = this.getBackgroundSprite().addChild(APP.library.getSprite("player_spot/battleground/score_back"));
		l_s.anchor.set(0.5, 0.5);
		l_s.position.set(-62, 10);


		let lStyle_obj = {
			fontFamily: "fnt_nm_barlow_bold",
			fontSize: 13.5,
			align: "center",
			fill: 0x000000
		}

		let l_tf = this.getBackgroundSprite().addChild(new TextField(lStyle_obj)); 

		l_tf.position.set(-62, 11);
		l_tf.maxWidth = 55;
		l_tf.anchor.set(0.5, 0.5);
		l_tf.text= "0"

		this._fScoreValue_tf = l_tf;


		let l_ta = this.getBackgroundSprite().addChild(I18.generateNewCTranslatableAsset("TABattlegroundPlayerSpotScore"));
		l_ta.position.set(-62, 26);
	}

	_addStakeButtons()
	{
		this._fPlusButton_b = this.addChild(new PlayerSpotButton("player_spot/bet_level/btn_plus_glow", "player_spot/bet_level/btn_plus_disabled"));
		this._fPlusButton_b.blendMode = PIXI.BLEND_MODES.SCREEN;
		this._fPlusButton_b.position.set(this._getBetLevelPlusButtonOffset().x, this._getBetLevelPlusButtonOffset().y);
		this._fPlusButton_b.zIndex = PlayerSpotButton.BET_LEVEL_BUTTON_Z_INDEX;
		this._fPlusButton_b.on('pointerdown', (e)=>e.stopPropagation(), this);

		this._fMinusButton_b = this.addChild(new PlayerSpotButton("player_spot/bet_level/btn_minus_glow", "player_spot/bet_level/btn_minus_disabled", false));
		this._fMinusButton_b.blendMode = PIXI.BLEND_MODES.SCREEN;
		this._fMinusButton_b.position.set(this._getBetLevelMinusButtonOffset().x, this._getBetLevelMinusButtonOffset().y);
		this._fMinusButton_b.zIndex = PlayerSpotButton.BET_LEVEL_BUTTON_Z_INDEX;
		this._fMinusButton_b.on('pointerdown', (e)=>e.stopPropagation(), this);

		if (!this._isBottom)
		{
			this._fPlusButton_b.position.y = 6;
			this._fMinusButton_b.position.y = 6;
		}

		this._fPlusButton_b.enabled = true;
		this._fMinusButton_b.enabled = true;
	}

	_getBetLevelMinusButtonOffset()
	{
		return {x: -49, y: -3.5}
	}

	_getBetLevelPlusButtonOffset()
	{
		return {x: 48, y: -3.5}
	}

	_invalidateView()
	{
		// Check free shots
		const lWeaponsInfo_wsi = this._fWeaponsInfo_wsi;
		const lIsFree_bln = (
			(lWeaponsInfo_wsi.isFreeWeaponsQueueActivated)
			|| lWeaponsInfo_wsi.isFreeWeaponsQueueActivated
		)
			|| this._isFRBMode;

		if (lIsFree_bln)
		{
			//this._fStakeValue_tf.visible = false;
			//this._fFreeCaption_ta.visible = true;
		}
		else
		{
			//this._fStakeValue_tf.visible = true;
			//this._fFreeCaption_ta.visible = false;
		}

		this._validateButtonsEnable();

	}

	_onPlusButtonClicked(aEmulateClickAnimation_bln, aWaitingBetLevelChange_bln)
	{
		if (aEmulateClickAnimation_bln)
		{
			this._fPlusButton_b.startGlowAnimation();
		}

		if (!aWaitingBetLevelChange_bln)
		{
			if (this._fCurrentMultId_num < 4)
			{
				this._fPrevMultId_num = this._fCurrentMultId_num;
				++this._fCurrentMultId_num;
				if (this._fCurrentMultId_num > 4)
				{
					this._fCurrentMultId_num = 0;
				}
				this._fCurrentMult_num = this._possibleBetLevels[this._fCurrentMultId_num];
				this._onStakeValueUpdateRequred();
			}

			this._fIsWaitingBetLevelChange_bl = false;
		}
		else
		{
			this._fIsWaitingBetLevelChange_bl = true;
		}

		this._validateButtonsEnable();
	}

	_onMinusButtonClicked(aEmulateClickAnimation_bln, aWaitingBetLevelChange_bln)
	{
		if (aEmulateClickAnimation_bln)
		{
			this._fMinusButton_b.startGlowAnimation();
		}

		if (!aWaitingBetLevelChange_bln)
		{
			if (this._fCurrentMultId_num > 0)
			{
				this._fPrevMultId_num = this._fCurrentMultId_num;
				--this._fCurrentMultId_num;
				if (this._fCurrentMultId_num < 0)
				{
					this._fCurrentMultId_num = 0;
					return;
				}
				this._fCurrentMult_num = this._possibleBetLevels[this._fCurrentMultId_num];

				this._onStakeValueUpdateRequred();
				this._fIsWaitingBetLevelChange_bl = false;
			}
		}
		else
		{
			this._fIsWaitingBetLevelChange_bl = true;
		}

		this._validateButtonsEnable();
	}

	_onStakeValueUpdateRequred()
	{
		APP.logger.i_pushDebug(`BTG Spot. Current mult: ${this._fCurrentMult_num}`);
		console.error(this._fCurrentMult_num);
		this.emit(MainPlayerSpot.EVENT_ON_BET_UPDATE_REQUIRED, { id: this._fCurrentMultId_num, multiplier: this._fCurrentMult_num });
	}

	_onBetChangeConfirmed(aMultiplier_num, aNeedSoundChangeTuret_bl = true)
	{
		this._fIsWaitingBetLevelChange_bl = false;
		this._fUpdateSent_bln = false;
		if(aMultiplier_num > this._fCurrentMult_num)
		{
			this._fIsNeedPlaySoundChangeWeapon_int = 0;
		}
		else if(aMultiplier_num <= this._fCurrentMult_num && !aNeedSoundChangeTuret_bl)
		{
				this._fIsNeedPlaySoundChangeWeapon_int = -1;
		}
		this._fCurrentMult_num = aMultiplier_num;
		this._fCurrentMultId_num = this._possibleBetLevels.indexOf(this._fCurrentMult_num);

		let lWeaponViewUpdateAllowed_bl = this._fCurrentMultId_num == this._possibleBetLevels.length-1;

		this.emit(MainPlayerSpot.EVENT_ON_BET_MULTIPLIER_CHANGED, { id: this._fCurrentMultId_num + 1, multiplier: this._fCurrentMult_num, weaponUpdateAllowed: lWeaponViewUpdateAllowed_bl });

	}

	_onGameStateChanged()
	{
		//this._validateButtonsEnable();
	}

	_onRicochetBulletsUpdated()
	{
		//this._validateButtonsEnable();
	}

	_onShotTriggered()
	{
		//this._validateButtonsEnable();
	}

	_onShotResponse()
	{
		//this._validateButtonsEnable();
	}

	get ricochetInfo()
	{
		return this._fRicochetInfo_ri || (this._fRicochetInfo_ri = APP.gameScreen.gameFieldController.ricochetController.info);
	}

	_validateButtonsEnable()
	{

		if (!APP.gameScreen.gameFieldController.isRoundStatePlay || this._fIsWaitingBetLevelChange_bl)
		{
			//this._fPlusButton_b.enabled = false;
			//this._fMinusButton_b.enabled = false;
			//this._fTurretButton_b.enabled = false;
		}
		else if (this._fUpdateSent_bln)
		{
			//this._fPlusButton_b.interactive = false;
			//this._fMinusButton_b.interactive = false;
			//this._fTurretButton_b.enabled = false;
		}
		else
		{
			let wsInteractionController = APP.webSocketInteractionController;
			const lIsRicochetBulletsExist_bl = this.ricochetInfo.existingMasterBulletsCount > 0;

			const lBetChangeEnabled_bln = !this._isFRBMode
											&& !lIsRicochetBulletsExist_bl
											&& !wsInteractionController.hasUnrespondedShots
											&& !wsInteractionController.hasDelayedShots
											&& !this._fWeaponsInfo_wsi.isFreeWeaponsQueueActivated;

			if (this._fCurrentMultId_num >= 4)
			{
				//this._fPlusButton_b.enabled = false;
			}
			else
			{
				if (lBetChangeEnabled_bln)
				{
					//this._fPlusButton_b.interactive = true;
					//this._fPlusButton_b.enabled = true;
				}
				else
				{
					/*
					this._fPlusButton_b.interactive = false;
					this._fPlusButton_b.enabled = !(lAllowDisable_bln
													|| lIsFree_bln
													|| this._isFRBMode
													|| this._fWeaponsInfo_wsi.isFreeWeaponsQueueActivated
													);
													*/
				}
			}

			if (this._fCurrentMultId_num <= 0)
			{
				//this._fMinusButton_b.enabled = false;
			}
			else
			{
				if (lBetChangeEnabled_bln)
				{
					//this._fMinusButton_b.interactive = true;
					//this._fMinusButton_b.enabled = true;
				}
				else
				{
					/*
					this._fMinusButton_b.interactive = false;
					this._fMinusButton_b.enabled = !(lAllowDisable_bln
													|| lIsFree_bln
													|| this._isFRBMode
													|| this._fWeaponsInfo_wsi.isFreeWeaponsQueueActivated
													);*/
				}
			}

			if (this.currentWeaponId == WEAPONS.DEFAULT)
			{
				//this._fTurretButton_b.enabled = false;
			}
			else
			{
				/*
				this._fTurretButton_b.enabled = !(APP.gameScreen.gameFieldController.isWeaponChangeInProcess 
													|| lIsFree_bln
													|| this._isFRBMode
													|| this._fWeaponsInfo_wsi.isFreeWeaponsQueueActivated
												);
												*/
			}
		}
	}

	get _isFRBMode()
	{
		return APP.currentWindow.gameFrbController.info.frbMode;
	}

	get _isBonusMode()
	{
		return APP.currentWindow.gameBonusController.info.isActivated;
	}

	_onBetChangeNotConfirmed()
	{
		this._fIsWaitingBetLevelChange_bl = false;
		this._fCurrentMultId_num = this._fPrevMultId_num;
		this._fCurrentMult_num = this._possibleBetLevels[this._fCurrentMultId_num];
		this._fUpdateSent_bln = false;

		this._validateButtonsEnable();
	}

/*
	_invalidateShotPrice()
	{
		let lBet_num = this._fWeaponsInfo_wsi.i_getWeaponShotPrice(this._fWeaponsInfo_wsi.currentWeaponId);
		let lCurrency_str = APP.playerController.info.currencySymbol || "";
		let lDecimalsCount_int = undefined;

		//NO DECIMALS IN BATTLEGROUND MODE...
		if(APP.isBattlegroundGame)
		{
			lDecimalsCount_int = 0;
		}
		//...NO DECIMALS IN BATTLEGROUND MODE
		
		this._fStakeValue_tf.text = "\u200E" + lCurrency_str + "\u200E" + NumberValueFormat.formatMoney(lBet_num, true, lDecimalsCount_int);
	}

	*/

	get _stakeStyle()
	{
		let lStyle_obj = {
			fontFamily: "fnt_nm_barlow_semibold",
			fontSize: 10,
			align: "center",
			fill: 0xffffff
		}

		return lStyle_obj;
	}

	get _nicknameStyle()
	{
		let lFontFamily_str = "fnt_nm_barlow_semibold";
		if (!APP.fonts.isGlyphsSupported(lFontFamily_str, this._fPlayer_obj.nickname))
		{
			lFontFamily_str = "sans-serif";
		}

		let lStyle_obj = {
			fontFamily: lFontFamily_str,
			fontSize: 8,
			align: "center",
			fill: 0xffffff
		}

		return lStyle_obj;
	}

	//override
	_getWeaponsBackPosition()
	{
		if(!this._isBottom)
		{
			return {x: -0.5, y: 6.5};
		}

		return { x: -0.5, y: -6 };
	}

	//override
	_getWeaponsBackScale()
	{
		return { x: 1, y: 1 };
	}

	_addBack()
	{
		this._fBack_sprt = this.getBackgroundSprite().addChild(APP.library.getSprite("player_spot/battleground/back"));
		this._fBack_sprt.position.x = 1;

		this.__createRestrictedZones();
		
		if (!this._isBottom)
		{
			this._fBack_sprt.scale.y = -1;
		}
	}

	_addGunLevelIndicator()
	{
		this._fGunLevelDigits_s_arr = [];
		this._fGunLevelPowerArrows_s_arr = [];

		let lGunLevelDigitsX_num = 37.5;
		let lGunLevelDigitsY_num = 7;

		if(!this._isBottom)
		{
			lGunLevelDigitsY_num = 3;
		}

		//DIGITS...
		for( let i = 0; i < 3; i++ )
		{
			let l_s = this.getBackgroundSprite().addChild(APP.library.getSprite("player_spot/battleground/gun_level_" + i));

			l_s.position.set(
				lGunLevelDigitsX_num,
				lGunLevelDigitsY_num);
			this._fGunLevelDigits_s_arr[i] = l_s;
		}
		//...DIGITS

		this._fGunLevelDigits_s_arr[0].position.x -= 0.5;

		//STAR...
		let lStar_s = this.getBackgroundSprite().addChild(APP.library.getSprite("player_spot/battleground/star"));
		lStar_s.position.set(
			lGunLevelDigitsX_num,
			lGunLevelDigitsY_num - 5);

		this._fGunLevelDigits_s_arr.push(lStar_s);
		//...STAR

		//POWER ARROWS...
		for( let i = 0; i < 3; i++ )
		{
			let l_s = this.getBackgroundSprite().addChild(APP.library.getSprite("player_spot/battleground/arrow"));

			l_s.position.set(
				lGunLevelDigitsX_num,
				lGunLevelDigitsY_num - 12.5 - i * 5);
			this._fGunLevelPowerArrows_s_arr[i] = l_s;
		}
		//...POWER ARROWS

		this._showGunLevel();
	}

	_showGunLevel()
	{
		if(!this._fGunLevelDigits_s_arr)
		{
			return;
		}

		let l_s_arr = this._fGunLevelDigits_s_arr;
		let lBetLevel_int = APP.playerController.info.betLevel;
		let lWeaponId_int = this._fWeaponsInfo_wsi.currentWeaponId;
		let lLevelIndex_int = undefined;

		switch(this._fWeaponsInfo_wsi.currentWeaponId)
		{
			case WEAPONS.DEFAULT:
				lLevelIndex_int = 0;// 1^
				break;
			case WEAPONS.HIGH_LEVEL:
				switch (lBetLevel_int)
				{
					case this._possibleBetLevels[1]: lLevelIndex_int = 1; break;// 2^^
					case this._possibleBetLevels[2]: lLevelIndex_int = 2; break;// 3^^^
					default: lLevelIndex_int = 1; break;// 2^^
				}
				break;
			default:
				lLevelIndex_int = 3;// *
				break;
		}

		//DIGITS (OR STAR)...
		for( let i = 0; i < l_s_arr.length; i++ )
		{
			l_s_arr[i].visible = (lLevelIndex_int === i);
		}
		//...DIGITS (OR STAR)

		//POWER ARROWS...
		l_s_arr = this._fGunLevelPowerArrows_s_arr;
		let lFinalArrowIndex_int = lLevelIndex_int;

		if(lFinalArrowIndex_int > 2)
		{
			lFinalArrowIndex_int = -1;
		}

		for( let i = 0; i < l_s_arr.length; i++ )
		{
			l_s_arr[i].visible = (i <= lFinalArrowIndex_int);
		}
		//...POWER ARROWS
 	}

	_addNickname()
	{
		let lNickname_tf = super._addNickname();
		lNickname_tf.anchor.set(0.5, 0.5);
		lNickname_tf.position.set(-60, -2);

		if (!this._isBottom)
		{
			lNickname_tf.position.set(-60, -2);
		}
	}

	get _maxNicknameWidth()
	{
		return 60;
	}

	_addAvatar()
	{
		this._fAvatar_pa = super._addAvatar();
		this._fAvatar_pa.position.set(-61, -20);
		this._fAvatar_pa.scale.set(0.25);
		this._fAvatar_pa.anchor.set(0.5, 0.5);

		if (!this._isBottom)
		{
			this._fAvatar_pa.position.set(-61, -20);
		}

		this._refreshPlayer();
	}

	_updateAmmo(aAmmo_int, aWaitBuyIn_bln)
	{
		if(aAmmo_int === undefined)
		{
			aAmmo_int = this._fWeaponsInfo_wsi.ammo;
		}

		if (this.currentWeaponId == WEAPONS.HIGH_LEVEL)
		{
			if (this._fLevelUpAnimations_lup_arr)
			{
				for (let i=0; i<this._fLevelUpAnimations_lup_arr.length; i++)
				{
					let lLevelUpAnim_lupa = this._fLevelUpAnimations_lup_arr[i];
					if (!lLevelUpAnim_lupa.isBadgeLanded)
					{
						if (aAmmo_int > lLevelUpAnim_lupa.shotsAmount)
						{
							aAmmo_int -= lLevelUpAnim_lupa.shotsAmount;
						}
					}
				}
			}

			if (this._fPendingLevelUpShots_num_arr.length)
			{
				for (let i=0; i<this._fPendingLevelUpShots_num_arr.length; i++)
				{
					if (aAmmo_int > this._fPendingLevelUpShots_num_arr[i])
					{
						aAmmo_int -= this._fPendingLevelUpShots_num_arr[i];
					}
				}	
			}
		}
		
		let lIsSpecWeaponChosen_bln = !!(this._fWeaponsInfo_wsi.currentWeaponId !== WEAPONS.DEFAULT);
		let lIsFrb_bln = APP.currentWindow.gameFrbController.info.frbMode;

		let lPlayerInfo_pi = APP.playerController.info;
		let lBetLevel_num = lPlayerInfo_pi.betLevel * lPlayerInfo_pi.currentStake;
		let lAmmoLimit_num = lPlayerInfo_pi.balance < lPlayerInfo_pi.currentStake || this._fGameStateInfo_gsi.extraBuyInAvailable ? lBetLevel_num : lPlayerInfo_pi.stakesLimit * lPlayerInfo_pi.betLevel;
		let lAmmoCost_num = lIsFrb_bln ? 0 : this._fWeaponsInfo_wsi.ammo * lPlayerInfo_pi.currentStake;
		let lIsBulletSpentWeaponChoosed_bln = !lIsSpecWeaponChosen_bln;

		let lTotalRealAmmoAmount_num = this._fWeaponsInfo_wsi.realAmmo + lPlayerInfo_pi.pendingAmmo;
		lTotalRealAmmoAmount_num = Number(lTotalRealAmmoAmount_num.toFixed(2));

		let lTotalAmmoAmount_num = Math.floor(lTotalRealAmmoAmount_num);

		if (
			!lIsFrb_bln &&
			!APP.currentWindow.gameFieldController.roundResultActive &&
			!APP.currentWindow.gameFieldController.roundResultActivationInProgress &&
			this._fWeaponsInfo_wsi.ammo < lAmmoLimit_num &&
			lTotalAmmoAmount_num < lAmmoLimit_num &&
			!this.reloadRequiredSent &&
			!aWaitBuyIn_bln &&
			(lPlayerInfo_pi.balance + lAmmoCost_num) > 0 &&
			lPlayerInfo_pi.balance >= lPlayerInfo_pi.currentStake &&
			lIsBulletSpentWeaponChoosed_bln &&
			!APP.currentWindow.gameBonusController.info.isActivated && /* in cash bonus mode auto BuyIn should never occur */
			!this._tournamentModeInfo.isTournamentMode /* in tournament mode auto BuyIn should never occur */
		)
		{
			this.reloadRequiredSent = true;
			this.emit(MainPlayerSpot.EVENT_RELOAD_REQUIRED);
		}
		else
		{
			this.emit(MainPlayerSpot.EVENT_AMMO_UPDATED);
			this.reloadRequiredSent = false;
		}

		this._invalidateView();

		if (this.currentWeaponId === WEAPONS.DEFAULT)
		{
			this._getAmmoTextField().text = DEF_WEAPON_VALUE;
		}
		else
		{
			if(!Number.isNaN(aAmmo_int));
			{
				let lFinalText_str = NumberValueFormat.formatMoney(aAmmo_int * 100, true, 0);
				
				if(lFinalText_str !== "NaN")
				{
					this._getAmmoTextField().text = lFinalText_str;
				}
			}
		}

		this._validateAmmoFormat();
	}

	_validateAmmoFormat()
	{
		let l_tf = this._getAmmoTextField();
		let txtStyle = l_tf.getStyle() || {};

		let lCurFontSize = txtStyle.fontSize;
		let lRequiredFontSize = l_tf.text == DEF_WEAPON_VALUE ? AMMO_FONT_SIZE["INFINITY"] : AMMO_FONT_SIZE["DEFAULT"];

		if (lCurFontSize !== lRequiredFontSize)
		{
			txtStyle.fontSize = lRequiredFontSize;
  			l_tf.textFormat = txtStyle;
		}
	}

	set reloadRequiredSent(aValue_bln)
	{
		this._fReloadRequiredSent_bln = aValue_bln;
	}

	get reloadRequiredSent()
	{
		return this._fReloadRequiredSent_bln;
	}

	_onPointerMove(e)
	{
		let lIsPointerPushed_bl = APP.isMobile ? false : APP.currentWindow.fireController.isPointerPushed;

		if (this._weaponSpotView && !lIsPointerPushed_bl && !APP.currentWindow.fireController.isAutoFireEnabled)
		{
			if (this.__checkMouseOverRestrictedZone(e.data.global))
			{
				if (!this._fRotationBlocked_bln)
				{
					this.emit(MainPlayerSpot.EVENT_ON_ROTATE_GUN_TO_ZERO);
					this._fRotationBlocked_bln = true;
				}
			}
			else
			{
				this._fRotationBlocked_bln = false;
			}
		}
	}

	destroy()
	{
		this.off("pointermove", this._onPointerMove, this);
		
		APP.currentWindow.gameStateController.off(GameStateController.EVENT_ON_GAME_STATE_CHANGED, this._onGameStateChanged, this);
		APP.currentWindow.gameFieldController.off(GameFieldController.EVENT_ON_RICOCHET_BULLETS_UPDATED, this._onRicochetBulletsUpdated, this);
		APP.currentWindow.off(GameScreen.EVENT_ON_SHOT_TRIGGERED, this._onShotTriggered, this);
		APP.currentWindow.shotResponsesController.off(ShotResponsesController.EVENT_ON_SERVER_SHOT_RESPONSE, this._onShotResponse, this);

		this._fWeaponQueueController_wqc && this._fWeaponQueueController_wqc.destroy();

		if (this._fLevelUpAnimations_lup_arr)
		{
			while (this._fLevelUpAnimations_lup_arr.length)
			{
				this._destroyLevelUpAnimation(this._fLevelUpAnimations_lup_arr[0]);
			}
			this._fLevelUpAnimations_lup_arr = null;
		}

		if (this._fLevelUpWeaponGlowEffects_sprt_arr)
		{
			while (this._fLevelUpWeaponGlowEffects_sprt_arr.length)
			{
				this._destroyLevelUpWeaponGlowEffect(this._fLevelUpWeaponGlowEffects_sprt_arr[0]);
			}
			this._fLevelUpWeaponGlowEffects_sprt_arr = null;
		}

		super.destroy();

		this._fWeaponQueueController_wqc = null;
		this._fReloadRequiredSent_bln = undefined;
		this._fCurrentMult_num = null;
		this._fCurrentMultId_num = null;
		this._fStakeValue_tf = null;
		this._fWeaponsInfo_wsi = null;
		this._fFireSettingsInfo_fssi = null;
		this._fGameStateInfo_gsi = null;
		this._fPlusButton_b = null;
		this._fMinusButton_b = null;
		this._fUpdateSent_bln = null;
		this._fBack_sprt = null;
		this._fRotationBlocked_bln = null;
		this._fIsWaitingBetLevelChange_bl = null;
	}

	getNextSuggestedBattlegroundFreeWeaponId()
	{
		return this._fQueue_bswqv.getNextSuggestedBattlegroundFreeWeaponId();
	}

	getAwardedWeaponLandingPosition(aWeaponId_int)
	{
		return new PIXI.Point(
			this._avatarCenterPoint.x + this._fQueue_bswqv.position.x + this._fQueue_bswqv.getAwardedWeaponLandingX(aWeaponId_int),
			this._avatarCenterPoint.y + this._fQueue_bswqv.position.y);
	}

	tick(aDelta_int)
	{

		this._fQueue_bswqv.tick(aDelta_int);
	}
}

export default BattlegroundMainPlayerSpot;
