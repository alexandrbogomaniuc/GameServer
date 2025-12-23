import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { WEAPONS } from '../../../../shared/src/CommonConstants';
import TextField from '../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/TextField';
import BalanceController from '../../controller/balance/BalanceController';
import PlayerSpot from './PlayerSpot';
import I18 from '../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
import GameStateController from './../../controller/state/GameStateController';
import PlayerSpotButton from './PlayerSpotButton';
import GameFieldController from '../../controller/uis/game_field/GameFieldController';
import GameScreen from './../GameScreen';
import ShotResponsesController from './../../controller/custom/ShotResponsesController';
import PlayerSpotRestrictedZone from './PlayerSpotRestrictedZone';
import Weapon from './Weapon';
import FireController from '../../controller/uis/fire/FireController';
import FreezeCapsuleFeatureController from '../../controller/uis/capsule_features/FreezeCapsuleFeatureController';

class MainPlayerSpot extends PlayerSpot
{
	static get EVENT_CHANGE_WEAPON() { return PlayerSpot.EVENT_CHANGE_WEAPON; }
	static get EVENT_RELOAD_REQUIRED() { return "onPlayerSpotReloadRequired"; }
	static get EVENT_AMMO_UPDATED() { return "onAmmoUpdated"; }
	static get EVENT_ON_BET_MULTIPLIER_CHANGED() { return "onBetMultiplierChanged"; }
	static get EVENT_ON_BET_UPDATE_REQUIRED() { return "onBetUpdateRequired"; }
	static get EVENT_ON_CHANGE_WEAPON_TO_DEFAULT_REQUIRED() { return "onChangeWeaponToDefaultRequired"; }
	static get EVENT_ON_ROTATE_GUN_TO_ZERO() { return "rotateGunToZero"; }

	get rotationBlocked()
	{
		return this._fRotationBlocked_bln;
	}

	onBetChangeConfirmed(aMultiplier_num)
	{
		this._onBetChangeConfirmed(aMultiplier_num);
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
		return this._fPlusButton_b && this._fPlusButton_b.enabled && this._fCurrentMultId_num < 4;
	}

	isMinusButtonClickedAllowed()
	{
		return this._fMinusButton_b && this._fMinusButton_b.enabled && this._fCurrentMultId_num > 0;
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

	constructor(aPlayer_obj, aPosition_obj)
	{
		super(aPlayer_obj, aPosition_obj);

		this._tournamentModeInfo = APP.tournamentModeController.info;
		this._fIsWaitingBetLevelChange_bl = null;

		this._isPlusBetLevelChangeRequiredAfterFiring_bl = false;
		this._isMinusBetLevelChangeRequiredAfterFiring_bl = false;
		this.mouseover = null;
		this.mouseout = null;
		this._fIsValidateCursorTracking_bl = null;
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
		let lSpotLocalPoint_obj = this.globalToLocal(aEvent_obj.data.global.x, aEvent_obj.data.global.y);
		
		if (this._fPlusButtonArea_c.contains(lSpotLocalPoint_obj.x, lSpotLocalPoint_obj.y))
		{
			this._onPlusButtonClicked();
		}
		if (this._fMinusButtonArea_c.contains(lSpotLocalPoint_obj.x, lSpotLocalPoint_obj.y))
		{
			this._onMinusButtonClicked();
		}

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

	_init()
	{
		this._fRicochetInfo_ri = null;
		this._fReloadRequiredSent_bln = false;
		this._fGameStateInfo_gsi = APP.currentWindow.gameStateController.info;

		super._init();

		this._fWeaponsInfo_wsi = APP.currentWindow.weaponsController.i_getInfo();
		this._fFireSettingsInfo_fssi = APP.currentWindow.fireSettingsController.i_getInfo();

		this._initMain();

		APP.currentWindow.gameStateController.on(GameStateController.EVENT_ON_GAME_STATE_CHANGED, this._onGameStateChanged, this);
		APP.currentWindow.gameFieldController.on(GameFieldController.EVENT_ON_RICOCHET_BULLETS_UPDATED, this._onRicochetBulletsUpdated, this);
		APP.currentWindow.on(GameScreen.EVENT_ON_SHOT_TRIGGERED, this._onShotTriggered, this);
		APP.currentWindow.on(GameScreen.EVENT_ON_TARGETING, this._onTargetingEnemy, this);
		APP.currentWindow.shotResponsesController.on(ShotResponsesController.EVENT_ON_SERVER_SHOT_RESPONSE, this._onShotResponse, this);
		APP.currentWindow.fireController.on(FireController.EVENT_ON_BULLET_WAS_REMOVED, this._processDelayedBetChanges, this);
		APP.currentWindow.freezeCapsuleFeatureController.on(FreezeCapsuleFeatureController.EVENT_ON_START_ACTIVATING_FEATURE, this._validateButtonsEnable, this);
		APP.currentWindow.freezeCapsuleFeatureController.on(FreezeCapsuleFeatureController.EVENT_ON_DEACTIVATE_FEATURE, this._validateButtonsEnable, this);
		APP.currentWindow.balanceController.on(BalanceController.EVENT_ON_SERVER_BALANCE_UPDATED, this._onServerBalanceUpdated, this);
		
	}

	_onServerBalanceUpdated()
	{
		this._validateButtonsEnable();
	}

	_initMain()
	{
		this.position.set(this.initialPosition.x, this.initialPosition.y);

		this._addStakeButtons();
		this._addStakeValue();
		this._addFreeStake();
	}

	_changeWeapon(aWeaponId_int, aCurrentDefaultWeaponId_int, aIsSkipAnimation_bl = false, aIsNewAwardedLevelUp_bl = false)
	{
		console.log("FireProblem_ change weapon call 20");
		super._changeWeapon(aWeaponId_int, aCurrentDefaultWeaponId_int, aIsSkipAnimation_bl, aIsNewAwardedLevelUp_bl);
		this._invalidateView();
	}

	_addStakeValue()
	{
		this._fStakeValue_tf = this.addChild(new TextField(this._stakeStyle));
		this._fStakeValue_tf.position.set(47, 19.5);
		this._fStakeValue_tf.maxWidth = 41;
		this._fStakeValue_tf.anchor.set(0.5, 0.5);
		this._fCurrentMultId_num = this._possibleBetLevels.indexOf(APP.playerController.info.betLevel);
		if (this._fCurrentMultId_num < 0)
		{
			this._fCurrentMultId_num = 0;
		}
		this._fPrevMultId_num = this._fCurrentMultId_num;
		this._fCurrentMult_num = this._possibleBetLevels[this._fCurrentMultId_num];

		this._invalidateShotPrice();

		if (!this._isBottom)
		{
			this._fStakeValue_tf.position.y = -21;
		}

		this._fStakeValue_tf.on('pointerdown', (e)=>e.stopPropagation(), this);

		this._validateButtonsEnable();
	}

	_addStakeButtons()
	{
		this._fPlusButton_b = this.addChild(new PlayerSpotButton("player_spot/bet_level/btn_plus_glow", "player_spot/bet_level/btn_plus_disabled"));
		this._fPlusButton_b.blendMode = PIXI.BLEND_MODES.SCREEN;
		this._fPlusButton_b.position.set(this._getBetLevelPlusButtonOffset().x, this._getBetLevelPlusButtonOffset().y);
		this._fPlusButton_b.zIndex = PlayerSpotButton.BET_LEVEL_BUTTON_Z_INDEX;

		this._fPlusButtonArea_c = new PIXI.Circle(this._getBetLevelPlusButtonOffset().x, this._getBetLevelPlusButtonOffset().y, 20);

		this._fPlusButton_b.mouseover = this._fPlusButton_b.mouseout = (e) => this.__validateMouseOverRestrictedZone(e.data.global);
		this._fPlusButton_b.on(PlayerSpotButton.EVENT_ON_BUTTON_CLICKED, this._onPlusButtonClicked, this);
		

		this._fMinusButton_b = this.addChild(new PlayerSpotButton("player_spot/bet_level/btn_minus_glow", "player_spot/bet_level/btn_minus_disabled", false));
		this._fMinusButton_b.blendMode = PIXI.BLEND_MODES.SCREEN;
		this._fMinusButton_b.position.set(this._getBetLevelMinusButtonOffset().x, this._getBetLevelMinusButtonOffset().y);
		this._fMinusButton_b.zIndex = PlayerSpotButton.BET_LEVEL_BUTTON_Z_INDEX;

		this._fMinusButtonArea_c = new PIXI.Circle(this._getBetLevelMinusButtonOffset().x, this._getBetLevelMinusButtonOffset().y, 20);
		
		this._fMinusButton_b.mouseover = this._fMinusButton_b.mouseout = (e) => this.__validateMouseOverRestrictedZone(e.data.global);
		this._fMinusButton_b.on(PlayerSpotButton.EVENT_ON_BUTTON_CLICKED, this._onMinusButtonClicked, this);

		if (!this._isBottom)
		{
			this._fPlusButton_b.position.y = 3;
			this._fMinusButton_b.position.y = 3;
		}
	}

	_getBetLevelMinusButtonOffset()
	{
		return {x: -53, y: -5}
	}

	_getBetLevelPlusButtonOffset()
	{
		return {x: 54, y: -5}
	}

	_addFreeStake()
	{
		this._fFreeCaption_ta = this.addChild(I18.generateNewCTranslatableAsset("TAPlayerSpotFree"));
		this._fFreeCaption_ta.position.set(47, 19.5);
		this._fFreeCaption_ta.visible = false;
		this._fFreeCaption_ta.on('pointerdown', (e)=>e.stopPropagation(), this);

		if (!this._isBottom)
		{
			this._fFreeCaption_ta.position.y = -21;
		}
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
			this._fStakeValue_tf.visible = false;
			this._fFreeCaption_ta.visible = true;
		}
		else
		{
			this._fStakeValue_tf.visible = true;
			this._fFreeCaption_ta.visible = false;
		}

		this._validateButtonsEnable();
		this._invalidateShotPrice();
	}

	_onPlusButtonClicked(aEmulateClickAnimation_bln = true)
	{
		if (!this.isPlusButtonClickedAllowed()) return;
		let lWaitingBetLevelChange_bl =
			this._fIsWaitingBetLevelChange_bl
			|| (APP.gameScreen.fireController.isMasterBulletExist() && !this._isPlusBetLevelChangeRequiredAfterFiring_bl);
		
		if (aEmulateClickAnimation_bln)
		{
			this._fPlusButton_b.startGlowAnimation();
		}

		if (!lWaitingBetLevelChange_bl)
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

			this._isPlusBetLevelChangeRequiredAfterFiring_bl = false;
		}
		else
		{
			this._isPlusBetLevelChangeRequiredAfterFiring_bl = true;
			this._fIsWaitingBetLevelChange_bl = true;
		}

		this._validateButtonsEnable();
	}

	_onMinusButtonClicked(aEmulateClickAnimation_bln)
	{
		if (!this.isMinusButtonClickedAllowed()) return;

		let lWaitingBetLevelChange_bl =
			this._fIsWaitingBetLevelChange_bl
			|| (APP.gameScreen.fireController.isMasterBulletExist() && !this._isMinusBetLevelChangeRequiredAfterFiring_bl);

		if (aEmulateClickAnimation_bln)
		{
			this._fMinusButton_b.startGlowAnimation();
		}

		if (!lWaitingBetLevelChange_bl)
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
				this._isMinusBetLevelChangeRequiredAfterFiring_bl = false;
			}
		}
		else
		{
			this._isMinusBetLevelChangeRequiredAfterFiring_bl = true;
			this._fIsWaitingBetLevelChange_bl = true;
		}

		this._validateButtonsEnable();
	}

	_processDelayedBetChanges()
	{
		this._fIsWaitingBetLevelChange_bl = false;
		if (this._isPlusBetLevelChangeRequiredAfterFiring_bl)
		{
			this._fPlusButton_b && (this._fPlusButton_b.enabled = this._checkBalanceForPlusButtonActive());
			this._onPlusButtonClicked(false);
		}
		if (this._isMinusBetLevelChangeRequiredAfterFiring_bl)
		{
			this._fMinusButton_b && (this._fMinusButton_b.enabled = true);
			this._onMinusButtonClicked(false);
		}
	}

	_onStakeValueUpdateRequred()
	{
		this._fUpdateSent_bln = true;
		this._fPlusButton_b.interactive = false;
		this._fMinusButton_b.interactive = false;
		this._fIsWaitingBetLevelChange_bl = true;

		this.emit(MainPlayerSpot.EVENT_ON_BET_UPDATE_REQUIRED, { id: this._fCurrentMultId_num, multiplier: this._fCurrentMult_num });
	}

	_onBetChangeConfirmed(aMultiplier_num)
	{
		this._fIsWaitingBetLevelChange_bl = false;
		this._fUpdateSent_bln = false;
		this._fCurrentMult_num = aMultiplier_num;
		this._fCurrentMultId_num = this._possibleBetLevels.indexOf(this._fCurrentMult_num);

		this.emit(MainPlayerSpot.EVENT_ON_BET_MULTIPLIER_CHANGED, { id: this._fCurrentMultId_num + 1, multiplier: this._fCurrentMult_num, weaponUpdateAllowed: true });

		APP.soundsController.play("turret_change");

		this._validateButtonsEnable();
		this._invalidateShotPrice();

		this._updateAmmo();
	}

	_onGameStateChanged()
	{
		this._validateButtonsEnable();
	}

	_onRicochetBulletsUpdated()
	{
		this._validateButtonsEnable();
	}

	_onShotTriggered()
	{
		this._validateButtonsEnable();
	}

	_onShotResponse()
	{
		this._validateButtonsEnable();
	}

	get ricochetInfo()
	{
		return this._fRicochetInfo_ri || (this._fRicochetInfo_ri = APP.gameScreen.gameFieldController.ricochetController.info);
	}

	_checkBalanceForPlusButtonActive()
	{
		let lPlayerInfo_pi = APP.playerController.info;
		let lIsFrb_bln = APP.currentWindow.gameFrbController.info.frbMode;
		let lAmmoCost_num = lIsFrb_bln ? 0 : this._fWeaponsInfo_wsi.ammo * lPlayerInfo_pi.currentStake;
		let lNextBetLevel_num = this._possibleBetLevels[this._fCurrentMultId_num + 1] * lPlayerInfo_pi.currentStake;
		return (lPlayerInfo_pi.balance + lAmmoCost_num) >= lNextBetLevel_num;
	}

	_validateButtonsEnable()
	{
		if (!this._fPlusButton_b || !this._fMinusButton_b)
		{
			return;
		}

		if (
			!APP.gameScreen.gameFieldController.isRoundStatePlay || 
			this._fIsWaitingBetLevelChange_bl || 
			this._fUpdateSent_bln ||
			(
				APP.gameScreen.freezeCapsuleFeatureController.info.isQuestForMainPlayer &&
				(
					APP.gameScreen.freezeCapsuleFeatureController.info.active ||
					APP.gameScreen.freezeCapsuleFeatureController.info.freezeTime
				)
			)
		)
		{
			this._fPlusButton_b.enabled = false;
			this._fMinusButton_b.enabled = false;
		}
		else
		{
			let wsInteractionController = APP.webSocketInteractionController;
			const lIsRicochetBulletsExist_bl = this.ricochetInfo.existingMasterBulletsCount > 0;

			const lBetChangeEnabled_bln = !this._isFRBMode
											&& !lIsRicochetBulletsExist_bl
											&& !wsInteractionController.hasUnrespondedShots
											&& !wsInteractionController.hasDelayedShots
											&& this._fWeaponsInfo_wsi && !this._fWeaponsInfo_wsi.isFreeWeaponsQueueActivated;

			const lAllowDisable_bln = (
				!lIsRicochetBulletsExist_bl &&
				!wsInteractionController.hasUnrespondedShots &&
				!wsInteractionController.hasDelayedShots
			);

			if (this._fCurrentMultId_num >= 4)
			{
				this._fPlusButton_b.enabled = false;
			}
			else
			{
				if (lBetChangeEnabled_bln)
				{
					let lIsCanChangeBetLevel_bl = this._checkBalanceForPlusButtonActive();
					this._fPlusButton_b.enabled = lIsCanChangeBetLevel_bl;
					this._fPlusButton_b.interactive = lIsCanChangeBetLevel_bl;
				}
				else
				{
					this._fPlusButton_b.enabled = !(lAllowDisable_bln
													|| this._isFRBMode
													|| this._fWeaponsInfo_wsi && this._fWeaponsInfo_wsi.isFreeWeaponsQueueActivated
													) && this._checkBalanceForPlusButtonActive();
				}
			}

			if (this._fCurrentMultId_num <= 0)
			{
				this._fMinusButton_b.enabled = false;
			}
			else
			{
				if (lBetChangeEnabled_bln)
				{
					this._fMinusButton_b.interactive = true;
					this._fMinusButton_b.enabled = true;
				}
				else
				{
					this._fMinusButton_b.enabled = !(lAllowDisable_bln
													|| this._isFRBMode
													|| this._fWeaponsInfo_wsi && this._fWeaponsInfo_wsi.isFreeWeaponsQueueActivated
													);
				}
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

	_invalidateShotPrice()
	{
		let lBet_num = this._fWeaponsInfo_wsi.i_getWeaponShotPrice(this._fWeaponsInfo_wsi.currentWeaponId);
		this._fStakeValue_tf.text = APP.currencyInfo.i_formatNumber(lBet_num, true);
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
		this._fBack_sprt = this.addChild(APP.library.getSpriteFromAtlas("player_spot/ps_player_spot/player_spot_atlas"));
		
		if (!this._isBottom)
		{
			this._fBack_sprt.scale.y = -1;
		}

		this.__createRestrictedZones();
	}

	_addNickname()
	{
		let lNickname_tf = super._addNickname();
		lNickname_tf.anchor.set(0, 0.5);
		lNickname_tf.position.set(-68.5, 19.5);

		if (!this._isBottom)
		{
			lNickname_tf.position.set(-68.5, -21);
		}
	}

	get _maxNicknameWidth()
	{
		return 44;
	}

	_updateAmmo(aAmmo_int, aWaitBuyIn_bln)
	{
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
	}

	set reloadRequiredSent(aValue_bln)
	{
		this._fReloadRequiredSent_bln = aValue_bln;
	}

	get reloadRequiredSent()
	{
		return this._fReloadRequiredSent_bln;
	}

	_rotateGunToZero()
	{
		this._weaponSpotView.gun.off(Weapon.EVENT_ON_GUN_SHOT_COMPLETED, this._rotateGunToZero, this);
		this.emit(MainPlayerSpot.EVENT_ON_ROTATE_GUN_TO_ZERO);
		this._fRotationBlocked_bln = true;
	}

	_onTargetingEnemy()
	{
		this._fRotationBlocked_bln = false;
	}

	destroy()
	{	
		APP.currentWindow.gameStateController.off(GameStateController.EVENT_ON_GAME_STATE_CHANGED, this._onGameStateChanged, this);
		APP.currentWindow.gameFieldController.off(GameFieldController.EVENT_ON_RICOCHET_BULLETS_UPDATED, this._onRicochetBulletsUpdated, this);
		APP.currentWindow.off(GameScreen.EVENT_ON_SHOT_TRIGGERED, this._onShotTriggered, this);
		APP.currentWindow.off(GameScreen.EVENT_ON_TARGETING, this._onTargetingEnemy, this);
		APP.currentWindow.shotResponsesController.off(ShotResponsesController.EVENT_ON_SERVER_SHOT_RESPONSE, this._onShotResponse, this);
		APP.currentWindow.freezeCapsuleFeatureController.off(FreezeCapsuleFeatureController.EVENT_ON_START_ACTIVATING_FEATURE, this._validateButtonsEnable, this);
		APP.currentWindow.freezeCapsuleFeatureController.off(FreezeCapsuleFeatureController.EVENT_ON_DEACTIVATE_FEATURE, this._validateButtonsEnable, this);
		APP.gameScreen.fireController.off(FireController.EVENT_TIME_TO_VALIDATE_CURSOR, this._onTimeToValidateCursor, this);

		this._fWeaponQueueController_wqc && this._fWeaponQueueController_wqc.destroy();

		super.destroy();

		this._fPlusButton_b && this._fPlusButton_b.off(PlayerSpotButton.EVENT_ON_BUTTON_CLICKED, this._onPlusButtonClicked, this);
		this._fMinusButton_b && this._fMinusButton_b.off(PlayerSpotButton.EVENT_ON_BUTTON_CLICKED, this._onMinusButtonClicked, this);

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
		this._fIsValidateCursorTracking_bl = null;
	}
}

export default MainPlayerSpot;