import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { WEAPONS } from '../../../../../shared/src/CommonConstants';
import TextField from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/TextField';
import PlayerSpot from '../PlayerSpot';
import I18 from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
import GameScreen from './../../GameScreen';
import PlayerSpotRestrictedZone from '../PlayerSpotRestrictedZone';
import Weapon from '../Weapon';
import FireController from '../../../controller/uis/fire/FireController';
import NumberValueFormat from '../../../../../../common/PIXI/src/dgphoenix/unified/view/custom/values/NumberValueFormat';
import AutofireOnOffButton from './AutofireOnOffButton';
import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import LevelUpAnimation from './LevelUpAnimation';

const DEF_WEAPON_VALUE = "∞";
const AMMO_FONT_SIZE = {
	"DEFAULT" : 10,
	"INFINITY" : 20
};

class BattlegroundMainPlayerSpot extends PlayerSpot
{
	static get EVENT_CHANGE_WEAPON() { return PlayerSpot.EVENT_CHANGE_WEAPON; }
	static get EVENT_RELOAD_REQUIRED() { return "onPlayerSpotReloadRequired"; }
	static get EVENT_AMMO_UPDATED() { return "onAmmoUpdated"; }
	static get EVENT_ON_BET_MULTIPLIER_CHANGED() { return "onBetMultiplierChanged"; }
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

	updateAmmo(aAmmo_int, aWaitBuyIn_bln)
	{
		this._updateAmmo(aAmmo_int, aWaitBuyIn_bln);
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

	i_getApproximateWidth()
	{
		return 186;
	}

	onRoomPaused()
	{
		if (this._fIsValidateCursorTracking_bl)
		{
			this._fIsValidateCursorTracking_bl = false;
			APP.gameScreen.fireController.off(FireController.EVENT_TIME_TO_VALIDATE_CURSOR, this._onTimeToValidateCursor, this);
		}
	}

	onRoomUnpaused()
	{
		let lX_num = APP.stage.renderer.plugins.interaction.mouse.global.x;
		let lY_num = APP.stage.renderer.plugins.interaction.mouse.global.y;
		this.__validateMouseOverRestrictedZone({x: lX_num, y: lY_num});
	}

	forceLevelUps()
	{
		this._forceLevelUps();
	}

	get hasPendingHighLevelShots()
	{
		return !!this._fPendingLevelUpShots_num_arr && !!this._fPendingLevelUpShots_num_arr.length;
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

	get autofireButton()
	{
		return this._fAutoFireButton_b;
	}

	constructor(aPlayer_obj, aPosition_obj)
	{
		super(aPlayer_obj, aPosition_obj);

		if(APP.gameScreen.player.lastReceivedBattlegroundScore_int !== undefined)
		{
			this._setScoreValue(APP.gameScreen.player.lastReceivedBattlegroundScore_int);
		}
	}

	__validateMouseOverRestrictedZone(aPoint_obj)
	{
		let lOverZone_bl = this.__checkMouseOverRestrictedZone(aPoint_obj);
		let lOverWeapon_bl = this.__checkMouseOverTheWeapon(aPoint_obj);

		if (
			lOverZone_bl &&
			this._weaponSpotView &&
			!APP.currentWindow.fireController.isAutoFireEnabled
		)
		{
			let lIsShotState_bl = this._weaponSpotView && this._weaponSpotView.gun && this._weaponSpotView.gun.isShotState;
			let lIsReloadState_bl = this._weaponSpotView && this._weaponSpotView.gun && this._weaponSpotView.gun.isReloadState;

			if (!this._fRotationBlocked_bln && lIsShotState_bl || lIsReloadState_bl)
			{
				this._weaponSpotView.gun.on(Weapon.EVENT_ON_GUN_SHOT_COMPLETED, this._rotateGunToZero, this);
			}
			else
			{
				this._rotateGunToZero();
			}
		}
		else if (!lOverZone_bl && !lOverWeapon_bl)
		{
			this._fRotationBlocked_bln = false;
		}

		if (!APP.isMobile)
		{
			this._fIsMouseOverRestrictedZone_bl = lOverZone_bl || lOverWeapon_bl;
			this.setOverRestrictedZone(this._fIsMouseOverRestrictedZone_bl);
		}
	}

	__validateSpotClick(aEvent_obj)
	{
		super.__validateSpotClick(aEvent_obj);
	}

	setOverRestrictedZone(aRestricted_bl)
	{
		if (aRestricted_bl && !this._fIsValidateCursorTracking_bl)
		{
			this._fIsValidateCursorTracking_bl = true;
			APP.gameScreen.fireController.off(FireController.EVENT_TIME_TO_VALIDATE_CURSOR, this._onTimeToValidateCursor, this); // to avoid multiple listeners
			APP.gameScreen.fireController.on(FireController.EVENT_TIME_TO_VALIDATE_CURSOR, this._onTimeToValidateCursor, this);			
		}
		else if (!aRestricted_bl && this._fIsValidateCursorTracking_bl)
		{
			this._fIsValidateCursorTracking_bl = false;
			APP.gameScreen.fireController.off(FireController.EVENT_TIME_TO_VALIDATE_CURSOR, this._onTimeToValidateCursor, this);		
		}

		super.setOverRestrictedZone(aRestricted_bl);
	}

	_onTimeToValidateCursor()
	{
		let lX_num = APP.stage.renderer.plugins.interaction.mouse.global.x;
		let lY_num = APP.stage.renderer.plugins.interaction.mouse.global.y;
		this.__validateMouseOverRestrictedZone({x: lX_num, y: lY_num});
	}

	get isMouseOverRestrictedZone()
	{
		return this._fIsMouseOverRestrictedZone_bl;
	}

	get __restrictedZonesInfo()
	{
		let lHitZoneFirstBottomOffsetY_num = this._isBottom ? 1 : -1;
		let lHitZoneSecondBottomOffsetY_num = this._isBottom ? 1 : 12;

		return [
			{
				type: PlayerSpotRestrictedZone.TYPE_HIT_ZONE_CIRCLE,
				params: {x: 0, y: -6.5 + lHitZoneSecondBottomOffsetY_num, width: 40, height: 60}
			},
			{
				type: PlayerSpotRestrictedZone.TYPE_HIT_ZONE_CIRCLE,
				params: {x: -61, y: lHitZoneFirstBottomOffsetY_num, width: 25.5, height: 25.5}
			},
			{
				type: PlayerSpotRestrictedZone.TYPE_HIT_ZONE_CIRCLE,
				params: {x: 61, y: lHitZoneFirstBottomOffsetY_num, width: 25.5, height: 25.5}
			},
			{
				type: PlayerSpotRestrictedZone.TYPE_HIT_ZONE_RECT,
				params: {x: 0, y: lHitZoneFirstBottomOffsetY_num, width: 130, height: 51, radius: 25 }
			}
		];
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

	get isBetLevelChangeRequiredAfterFiring()
	{
		return this._isPlusBetLevelChangeRequiredAfterFiring_bl || this._isMinusBetLevelChangeRequiredAfterFiring_bl;
	}

	get isWaitingResponseToBetLevelChangeRequest()
	{
		return this._fIsWaitingBetLevelChange_bl;
	}

	get spotVisualCenterPoint()
	{
		return this.localToGlobal(this.scoreFieldPosition);
	}

	get scoreFieldPosition()
	{
		let lX_num = -58;
		let lY_num = this._isBottom ? 14 : 7;

		return {x: lX_num, y: lY_num};
	}

	_init()
	{
		this._fPendingLevelUpShots_num_arr = [];

		this._tournamentModeInfo = APP.tournamentModeController.info;
		this._fIsWaitingBetLevelChange_bl = null;

		this._fAmmoValue_tf = null;
		this._fCurrentMultId_num = 0;
		this._fIsNeedPlaySoundChangeWeapon_int = 1;
		this._fCurrentMult_num = this._possibleBetLevels[this._fCurrentMultId_num];

		this._fLevelUpAnimations_lup_arr = [];
		this._fLevelUpWeaponGlowEffects_sprt_arr = [];

		this._isPlusBetLevelChangeRequiredAfterFiring_bl = false;
		this._isMinusBetLevelChangeRequiredAfterFiring_bl = false;
		this.mouseover = null;
		this.mouseout = null;
		this._fIsValidateCursorTracking_bl = null;

		this._fReloadRequiredSent_bln = false;
		this._fGameStateInfo_gsi = APP.currentWindow.gameStateController.info;

		this._fGunLevelDigits_s_arr = [];
		this._fGunLevelPowerArrows_s_arr = [];

		super._init();

		this._fWeaponsInfo_wsi = APP.currentWindow.weaponsController.i_getInfo();
		this._fFireSettingsInfo_fssi = APP.currentWindow.fireSettingsController.i_getInfo();

		this._initMain();

		APP.currentWindow.on(GameScreen.EVENT_ON_TARGETING, this._onTargetingEnemy, this);

		// window.addEventListener(
		// 	"keydown", this.keyDownHandler.bind(this), false
		// );
		
	}

	// keyDownHandler(keyCode)
	// {
	// 	if (keyCode.keyCode == 97)
	// 	{
	// 	}	
	// }

	addPendingHighLevelShots(aShots_num)
	{
		this._fPendingLevelUpShots_num_arr.push(aShots_num);
	}

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
		console.log("IndicatorProblem: Show new weapond " + aWeaponId_int);
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

		super._changeWeapon(aWeaponId_int, aCurrentDefaultWeaponId_int, aIsSkipAnimation_bl);
		console.log("IndicatorProblem: Show gun level " + APP.playerController.info.betLevel);
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

	_getBetLevelMinusButtonOffset()
	{
		return {x: -53, y: -5}
	}

	_getBetLevelPlusButtonOffset()
	{
		return {x: 54, y: -5}
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
		this.emit(BattlegroundMainPlayerSpot.EVENT_ON_BET_MULTIPLIER_CHANGED, { id: this._fCurrentMultId_num + 1, multiplier: this._fCurrentMult_num, weaponUpdateAllowed: lWeaponViewUpdateAllowed_bl });
	}

	_checkBalanceForPlusButtonActive()
	{
		let lPlayerInfo_pi = APP.playerController.info;
		let lIsFrb_bln = APP.currentWindow.gameFrbController.info.frbMode;
		let lAmmoCost_num = lIsFrb_bln ? 0 : this._fWeaponsInfo_wsi.ammo * lPlayerInfo_pi.currentStake;
		let lNextBetLevel_num = this._possibleBetLevels[this._fCurrentMultId_num + 1] * lPlayerInfo_pi.currentStake;
		return (lPlayerInfo_pi.balance + lAmmoCost_num) >= lNextBetLevel_num;
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
	}

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
			fontSize: 9.5,
			align: "left",
			fill: 0xffffff
		}

		return lStyle_obj;
	}

	//override
	_getWeaponsBackPosition()
	{
		if(!this._isBottom)
		{
			return {x: -0.5, y: 2};
		}

		return { x: -0.5, y: -2 };
	}

	//override
	_getWeaponsBackScale()
	{
		return { x: 1.05, y: 1.05 };
	}

	_initMain()
	{
		this.position.set(this.initialPosition.x, this.initialPosition.y);

		this._addScoreValue();
		this._getAmmoTextField();

		this._addGunLevelIndicator();

		this._addAutoFireButton();
	}

	_addAutoFireButton()
	{
		this._fAutoFireButton_b = this.addChild(new AutofireOnOffButton());

		this._fAutoFireButton_b.on(AutofireOnOffButton.EVENT_ON_ENABLE, this._onAutoFireEnabled, this);
		this._fAutoFireButton_b.on(AutofireOnOffButton.EVENT_ON_DISABLE, this._onAutoFireDisnabled, this);

		let lPositionX_num = 70;
		let lPositionY_num = this._isBottom ? 5 : 0 ;
		this._fAutoFireButton_b.position.set(lPositionX_num, lPositionY_num);

		if(!APP.isAutoFireMode)
		{
			this._fAutoFireButton_b.setDisabled(); 
			this._fAutoFireButton_b.scale.set(0.6,0.6);
		}

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

	_addBack()
	{
		this._fBack_sprt = this.addChild(APP.library.getSprite("player_spot/battleground/back"));
		
		if (!this._isBottom)
		{
			this._fBack_sprt.scale.y = -1;
		}

		this.__createRestrictedZones();
	}

	_addNickname()
	{
		let lNickname_tf = super._addNickname();
		lNickname_tf.anchor.set(0.5, 0);
		lNickname_tf.position.set(0, 24);

		if (!this._isBottom)
		{
			lNickname_tf.anchor.set(0.5, 1);
			lNickname_tf.position.set(0, -24);
		}
	}

	get _maxNicknameWidth()
	{
		return 80;
	}

	_addScoreValue()
	{
		let lBackPos_obj = this.scoreFieldPosition;
		let lX_num = lBackPos_obj.x;
		let lY_num = lBackPos_obj.y;

		let lScoreBack_g = this.addChild(new Sprite());
		lScoreBack_g.position.set(lX_num, lY_num);

		let lStyle_obj = {
			fontFamily: "fnt_nm_barlow_bold",
			fontSize: 10,
			align: "center",
			fill: 0xffffff,
			lineHeight: 10
		}

		let l_tf = lScoreBack_g.addChild(new TextField(lStyle_obj));

		l_tf.position.set(0, 0);
		l_tf.anchor.set(0.5, 0.5);
		l_tf.text="0";
		l_tf.maxWidth = 40;

		this._fScoreValue_tf = l_tf;

		let l_ta = this.addChild(I18.generateNewCTranslatableAsset("TABattlegroundPlayerSpotScore"));
		l_ta.position.set(lX_num, lY_num - 11);
	}

	_getAmmoTextField()
	{
		if(!this._fAmmoValue_tf)
		{
			this._addAmmoValue();
		}

		return this._fAmmoValue_tf;
	}

	_addGunLevelIndicator()
	{
		this._fGunLevelDigits_s_arr = [];
		this._fGunLevelPowerArrows_s_arr = [];

		let lGunLevelDigitsX_num = 39;
		let lGunLevelDigitsY_num = 7;

		if(!this._isBottom)
		{
			lGunLevelDigitsY_num = -8;
		}

		let lArrowsplaceDirection_int = this._isBottom ? 1 : -1;

		//DIGITS...
		for( let i = 0; i < 3; i++ )
		{
			let l_s = this.addChild(APP.library.getSprite("player_spot/battleground/gun_level_" + i));

			l_s.position.set(
				lGunLevelDigitsX_num,
				lGunLevelDigitsY_num);
			this._fGunLevelDigits_s_arr[i] = l_s;
		}
		//...DIGITS

		this._fGunLevelDigits_s_arr[0].position.x -= 0.5;

		//STAR...
		let lStar_s = this.addChild(APP.library.getSprite("player_spot/battleground/star"));
		lStar_s.position.set(
			lGunLevelDigitsX_num,
			lGunLevelDigitsY_num + (5*lArrowsplaceDirection_int));

		this._fGunLevelDigits_s_arr.push(lStar_s);
		//...STAR

		//POWER ARROWS...
		for( let i = 0; i < 3; i++ )
		{
			let l_s = this.addChild(APP.library.getSprite("player_spot/battleground/arrow"));
			if(!this._isBottom)
			{
				l_s.scale.y = -1;
			}

			l_s.position.set(
				lGunLevelDigitsX_num,
				lGunLevelDigitsY_num - (12.5 + i * 4.5)*lArrowsplaceDirection_int);
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

	_getAmmoBackgroundPosition()
	{
		if (!this._isBottom)
		{
			return {x: -58, y: -14}
		}
		return {x: -58, y: -8}
	}

	_addAmmoValue()
	{
		let lBackPos_obj = this._getAmmoBackgroundPosition();
		let lX_num = lBackPos_obj.x;
		let lY_num = lBackPos_obj.y;

		let lAmmoBack_g = this.addChild(new Sprite);
		lAmmoBack_g.position.set(lX_num, lY_num);

		let lStyle_obj =
		{
			fontFamily: "fnt_nm_barlow_bold",
			fontSize: AMMO_FONT_SIZE["DEFAULT"],
			align: "center",
			fill: 0xffffff
		}

		let l_tf = lAmmoBack_g.addChild(new TextField(lStyle_obj));

		l_tf.position.set(0, 0);
		l_tf.anchor.set(0.5, 0.5);
		l_tf.maxWidth = 40;

		this._fAmmoValue_tf = l_tf;

		let l_ta = this.addChild(I18.generateNewCTranslatableAsset("TABattlegroundPlayerSpotAmmo"));
		l_ta.position.set(lX_num, lY_num - 11);
	}

	_updateAmmo(aAmmo_int, aWaitBuyIn_bln)
	{
		if(aAmmo_int === undefined)
		{
			aAmmo_int = this._fWeaponsInfo_wsi.ammo;
			if (this._fWeaponsInfo_wsi.currentWeaponId !== WEAPONS.DEFAULT)
			{
				aAmmo_int = this._fWeaponsInfo_wsi.remainingSWShots;
			}
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
			this.emit(BattlegroundMainPlayerSpot.EVENT_RELOAD_REQUIRED);
		}
		else
		{
			this.emit(BattlegroundMainPlayerSpot.EVENT_AMMO_UPDATED);
			this.reloadRequiredSent = false;
		}

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

	getAwardedWeaponLandingPosition(aWeaponId_int)
	{
		return this._gunCenter;
	}

	_rotateGunToZero()
	{
		this._weaponSpotView.gun.off(Weapon.EVENT_ON_GUN_SHOT_COMPLETED, this._rotateGunToZero, this);
		this.emit(BattlegroundMainPlayerSpot.EVENT_ON_ROTATE_GUN_TO_ZERO);
		this._fRotationBlocked_bln = true;
	}

	_onTargetingEnemy()
	{
		if(APP.isAutoFireEnabled)
		{
			this._fRotationBlocked_bln = false;
			this._fAutoFireButton_b.i_setEnable(true, undefined, true);
		}
		
	}

	destroy()
	{	
		APP.currentWindow.off(GameScreen.EVENT_ON_TARGETING, this._onTargetingEnemy, this);
		APP.gameScreen.fireController.off(FireController.EVENT_TIME_TO_VALIDATE_CURSOR, this._onTimeToValidateCursor, this);
		
		this._fWeaponQueueController_wqc && this._fWeaponQueueController_wqc.destroy();

		super.destroy();

		this._fWeaponQueueController_wqc = null;
		this._fReloadRequiredSent_bln = undefined;
		this._fCurrentMult_num = null;
		this._fCurrentMultId_num = null;
		this._fWeaponsInfo_wsi = null;
		this._fFireSettingsInfo_fssi = null;
		this._fGameStateInfo_gsi = null;
		this._fUpdateSent_bln = null;
		this._fBack_sprt = null;
		this._fRotationBlocked_bln = null;
		this._fIsWaitingBetLevelChange_bl = null;
		this._fIsValidateCursorTracking_bl = null;
	}
}

export default BattlegroundMainPlayerSpot;