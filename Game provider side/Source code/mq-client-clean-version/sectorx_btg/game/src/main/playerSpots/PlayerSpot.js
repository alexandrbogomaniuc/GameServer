import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sprite from '../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { WEAPONS } from '../../../../shared/src/CommonConstants';
import Sequence from '../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import * as Easing from '../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import TextField from '../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/TextField';
import WeaponSpotController from '../../controller/uis/weapons/WeaponSpotController';
import PlayerSpotWeaponsBack from './PlayerSpotWeaponsBack';
import PlayerSpotRestrictedZone from './PlayerSpotRestrictedZone';

const WEAPON_SPOT_VIEW_SCALE = 1;

class PlayerSpot extends Sprite
{
	static get EVENT_CHANGE_WEAPON() 			{return 'EVENT_CHANGE_WEAPON';}
	static get WEAPON_SCALE() 					{return WEAPON_SPOT_VIEW_SCALE;}

	get currentWeaponId()
	{
		return this._fWeaponSpotController_wsc ? this._fWeaponSpotController_wsc.info.currentWeaponId : WEAPONS.DEFAULT;
	}

	get player()
	{
		return this._fPlayer_obj;
	}

	set currentScore(aVal_num)
	{
		if (this._fPlayer_obj)
		{
			this._fPlayer_obj.currentScore = aVal_num;
		}
	}

	get currentScore()
	{
		return this._fPlayer_obj ? this._fPlayer_obj.currentScore : null;
	}

	get gunCenter()
	{
		return this._gunCenter;
	}

	get globalGunCenter()
	{
		return this.localToGlobal(this._gunCenter.x, this._gunCenter.y);
	}

	get weaponSpotView()
	{
		return this._weaponSpotView;
	}

	get muzzleTipGlobalPoint()
	{
		let lGunCenter = this.gunCenter;

		if (!this.weaponSpotView || !this.weaponSpotView.gun)
		{
			return this.localToGlobal(lGunCenter.x, lGunCenter.y);
		}

		let weaponView = this.weaponSpotView;
		let weaponGun = weaponView.gun;

		let muzzleTipOffset = weaponGun.muzzleTipOffset;
		if (!muzzleTipOffset)
		{
			return this.localToGlobal(lGunCenter.x, lGunCenter.y);
		}

		let startPos = new PIXI.Point();
		let startAngle = weaponView.rotation;
		let sign = this.isBottom ? 1 : -1;
		startPos.x = this.position.x + weaponView.x * sign;
		startPos.y = this.position.y + weaponView.y * sign;
		let gunPos = lGunCenter;
		startPos.x += gunPos.x * this.scale.x;
		startPos.y += gunPos.y * this.scale.y;

		let dist = muzzleTipOffset * weaponGun.i_getWeaponScale() * this.scale.x * sign * PlayerSpot.WEAPON_SCALE;

		startPos.x -= Math.cos(startAngle + Math.PI/2)*dist;
		startPos.y -= Math.sin(startAngle + Math.PI/2)*dist;

		return startPos;
	}

	get isWeaponChangeEffectsInProgress()
	{
		return false;
	}

	get spotVisualCenterPoint()
	{
		return new PIXI.Point(this.globalGunCenter.x, this.globalGunCenter.y);
	}

	get isBottom()
	{
		return this._isBottom;
	}

	get isMaster()
	{
		return this._fPlayer_obj.master;
	}

	get id()
	{
		return this._fPlayer_obj.seatId;
	}

	get initialPosition()
	{
		return this._fDefaultPosition_obj;
	}

	changeWeapon(aWeaponId_int, aCurrentDefaultWeaponId_int, aIsSkipAnimation_bl = false, aIsNewAwardedLevelUp_bl = false)
	{
		this._changeWeapon(aWeaponId_int, aCurrentDefaultWeaponId_int, aIsSkipAnimation_bl, aIsNewAwardedLevelUp_bl);
	}

	bounceEffect()
	{
		this._showBounceEffect();
	}

	get nickname()
	{
		if (this._fPlayer_obj)
		{
			return this._fPlayer_obj.nickname;
		}

		return null;
	}

	blurSpot()
	{
		let blurFilter = new PIXI.filters.BlurFilter();
		blurFilter.blur = 2;

		if (this.weaponSpotView)
		{
			if (this.isMaster)
			{
				this._fWeaponsBack_pswb.hideGlow();
			}
			this.weaponSpotView.filters = [blurFilter];
		}
		this.filters = [blurFilter];
	}

	focusSpot()
	{
		this.filters = null;

		if (this.weaponSpotView)
		{
			this.weaponSpotView.filters = null;
		}

		this._fWeaponsBack_pswb.showGlow();
	}

	get currentDefaultWeaponId()
	{
		return this._fWeaponSpotController_wsc.info.currentDefaultWeaponId || 1;
	}

	constructor(aPlayer_obj, aPosition_obj)
	{
		super();

		this._fBgContainer_s = this.addChild(new Sprite);

		this._fPlayer_obj = aPlayer_obj;
		this._fDefaultPosition_obj = aPosition_obj;

		this._fUserStyles_obj = {
			back: this._fPlayer_obj.avatar.background,
			hero: this._fPlayer_obj.avatar.hero,
			border: this._fPlayer_obj.avatar.borderStyle
		};

		this._fWeaponSpotController_wsc = null;
		this._fWeaponsBack_pswb = null;

		this._init();

		this._addWeapon();

		//set cursor to default over the spot
		this.interactive = true;

		this._fBattlegroundCrown_s = null;

		this.mouseover = this.mouseout = (e) => this.__validateMouseOverRestrictedZone(e.data.global);
	}

	__checkMouseOverTheWeapon(aPoint_obj)
	{
		return this._weaponSpotView.i_doesWeaponViewContainPoint(aPoint_obj);
	}

	__checkMouseOverRestrictedZone(aPoint_obj)
	{
		// Check spot zones collision...
		let lSpotLocalPoint_obj = this.globalToLocal(aPoint_obj.x, aPoint_obj.y);
		for (let l_psrz of this.__fRestrictedZones_arr)
		{
			if (l_psrz.hitTestPoint(this.localToLocal(lSpotLocalPoint_obj.x, lSpotLocalPoint_obj.y, l_psrz)))
			{
				return true;
			}
		}
		// ...check spot zones collision

		return false;
	}

	__validateMouseOverRestrictedZone(aPoint_obj)
	{
		let l_bl = this.__checkMouseOverRestrictedZone(aPoint_obj) && this.__checkMouseOverTheWeapon(aPoint_obj);
		this.setOverRestrictedZone(l_bl);
	}

	__validateSpotClick(aEvent_obj)
	{
		if (this.__checkMouseOverRestrictedZone(aEvent_obj.data.global) || this.__checkMouseOverTheWeapon(aEvent_obj.data.global))
		{
			aEvent_obj.stopPropagation();
		}
	}

	get __restrictedZonesInfo()
	{
		return [
			{
				type: PlayerSpotRestrictedZone.TYPE_HIT_ZONE_CIRCLE,
				params: {x: 25, y: -7, width: 30, height: 30}
			},
			{
				type: PlayerSpotRestrictedZone.TYPE_HIT_ZONE_ROUNDED_RECT,
				params: {x: -20, y: -5, width: 60, height: 37, radius: 5 }
			}
		];
	}

	__createRestrictedZones()
	{
		this.__fRestrictedZones_arr = [];

		for (let l_obj of this.__restrictedZonesInfo)
		{
			let l_psrz = this.addChild(new PlayerSpotRestrictedZone(l_obj.type, l_obj.params));
			l_psrz.mouseover = l_psrz.mouseout = (e) => this.__validateMouseOverRestrictedZone(e.data.global);
			l_psrz.on("pointerdown", this.__validateSpotClick.bind(this), this);
			this.__fRestrictedZones_arr.push(l_psrz);
		}
	}

	getBackgroundSprite()
	{
		return this._fBgContainer_s;
	}

	setOverRestrictedZone(aRestricted_bl)
	{
		APP.currentWindow.cursorController.setOverRestrictedZone(aRestricted_bl);
	}

	get _isBottom()
	{
		return Boolean(this._fDefaultPosition_obj.direct == 0);
	}

	get _gunCenter()
	{
		return {x: 25, y: -10};
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
			fontSize: 7.5,
			align: "left",
			fill: 0xffffff,
			shortLength: this._maxNicknameWidth // to fit player spot
		}

		return lStyle_obj;
	}

	_init()
	{
		this._addWeaponBack();
		this._addBack();
		this._addNickname();
		this._addWeaponsBack();
	}

	_getBattlegroundCrown()
	{
		if(!this._fBattlegroundCrown_s)
		{
			let l_s = this.addChild(APP.library.getSprite("battleground/crown"));

			l_s.visible = true;

			if(this.isMaster)
			{
				l_s.position.set(-107, 0);
			}
			else
			{
				l_s.position.set(-70, 0);
			}

			this._fBattlegroundCrown_s = l_s;
		}

		return this._fBattlegroundCrown_s;
	}

	setBattlegroundCrownVisible(aIsVisible_bl)
	{
		if(
			!aIsVisible_bl &&
			!this._fBattlegroundCrown_s
		)
		{
			return;
		}

		this._getBattlegroundCrown().visible = aIsVisible_bl;
	}

	/*
	_onServerMessage(event)
	{
		let messageData = event.messageData;
		let messageClass = messageData.class;

		if(messageClass == SERVER_MESSAGES.KING_OF_HILL_CHANGED)
		{

			let lIsVisible_bl = false;

			if(
				this._fPlayer_obj &&
				this._fPlayer_obj.seatId === messageData.newKing
				)
			{
				lIsVisible_bl = true;
			}

			this._getBattlegroundCrown().visible = lIsVisible_bl;
		}
	}*/

	_addWeaponBack()
	{
		this._fWeaponBackContainer_spr = this.addChild(new Sprite());
	}

	_updateWeaponBack(aCurrentDefaultWeaponId_int)
	{
		this._fWeaponBack_spr && this._fWeaponBack_spr.destroy();
		this._fWeaponBack_spr = null;

		if (!this.isMaster)
		{
			return;
		}

		let lLeft_sprt;
		let lRight_sprt;
		let lAssetName_str;
		switch(aCurrentDefaultWeaponId_int)
		{
			case 4:
				lAssetName_str = "weapons/DefaultGun/turret_4/turret_back";

				this._fWeaponBack_spr = this._fWeaponBackContainer_spr.addChild(new Sprite);
				
				lLeft_sprt = this._fWeaponBack_spr.addChild(APP.library.getSprite(lAssetName_str));
				lLeft_sprt.position.set(-75, 0);

				lRight_sprt = this._fWeaponBack_spr.addChild(APP.library.getSprite(lAssetName_str));
				lRight_sprt.scale.set(-1, 1);
				lRight_sprt.position.set(75, 0);
				break;
			case 5:
				lAssetName_str = "weapons/DefaultGun/turret_5/turret_back";

				this._fWeaponBack_spr = this._fWeaponBackContainer_spr.addChild(new Sprite);
				
				lLeft_sprt = this._fWeaponBack_spr.addChild(APP.library.getSprite(lAssetName_str));
				lLeft_sprt.position.set(-78, -5);

				lRight_sprt = this._fWeaponBack_spr.addChild(APP.library.getSprite(lAssetName_str));
				lRight_sprt.scale.set(-1, 1);
				lRight_sprt.position.set(78, -5);
				break;
		}

		if (!this._isBottom)
		{
			this._fWeaponBack_spr && this._fWeaponBack_spr.scale.set(1, -1);
		}
	}

	_addBack()
	{
		this._fBackground_spr = this._fBgContainer_s.addChild(APP.library.getSpriteFromAtlas("player_spot/ps_player_spot/back_small"));

		this.__createRestrictedZones();
	}

	_addNickname()
	{
		let lNickname_tf = this.addChild(new TextField(this._nicknameStyle));
		lNickname_tf.text = this._fPlayer_obj.nickname;
		lNickname_tf.anchor.set(0, 0.5);
		lNickname_tf.position.set(-36, -5);
		lNickname_tf._fShortLength_num = APP.isMobile ? this._maxNicknameWidth * 2 : this._maxNicknameWidth;
		lNickname_tf.text = lNickname_tf._createShortenedForm(lNickname_tf.text); // this._nicknameStyle not apply _createShortenedForm
		return lNickname_tf;
	}

	get _maxNicknameWidth()
	{
		return 32;
	}

	_addWeaponsBack()
	{
		this._fWeaponsBack_pswb = this.addChild(new PlayerSpotWeaponsBack(this._fPlayer_obj));
		this._fWeaponsBack_pswb.position = this._getWeaponsBackPosition();
		this._fWeaponsBack_pswb.scale = this._getWeaponsBackScale();
	}

	_getWeaponsBackPosition()
	{
		return {x: 25, y: -5};
	}

	_getWeaponsBackScale()
	{
		return {x: 0.75, y: 0.75};
	}

	_refreshPlayer()
	{
		this._fPlayer_obj.avatar = {
			background: this._fUserStyles_obj.back,
			hero: this._fUserStyles_obj.hero,
			borderStyle: this._fUserStyles_obj.border
		};
	}

	_addWeapon()
	{
		let lWeaponSpotSprite_sprt = this.addChild(new Sprite);
		lWeaponSpotSprite_sprt.position.set(this._gunCenter.x, this._gunCenter.y);
		if(!this._isBottom)
		{
			lWeaponSpotSprite_sprt.rotation = Math.PI;
		}

		this._fWeaponSpotController_wsc = new WeaponSpotController(this, this._fPlayer_obj);
		this._fWeaponSpotController_wsc.i_init();

		this._weaponSpotView = this._fPlayer_obj.weaponSpotView = lWeaponSpotSprite_sprt.addChild(this._fWeaponSpotController_wsc.view); // [Y]TODO to remove
		this._weaponSpotView.scale.set(WEAPON_SPOT_VIEW_SCALE);
		this._weaponSpotView.on('mouseover', e => this.__validateMouseOverRestrictedZone(e.data.global));
		this._weaponSpotView.on('mouseout', e => this.__validateMouseOverRestrictedZone(e.data.global));
		this._weaponSpotView.on('pointerdown', e => this.__validateSpotClick(e));

		let lCurrentPlayerWeaponId = this._fPlayer_obj.specialWeaponId;
		if (isNaN(lCurrentPlayerWeaponId))
		{
			lCurrentPlayerWeaponId = this._fPlayer_obj.currentWeaponId;
		}

		if (lCurrentPlayerWeaponId === undefined)
		{
			lCurrentPlayerWeaponId = WEAPONS.DEFAULT;
		}

		let lPlayerInfo = APP.playerController.info;
		let lSpotDefaultWeaponId_int = lPlayerInfo.getTurretSkinId(this._fPlayer_obj.betLevel || lPlayerInfo.roomDefaultBetLevel);

		if (this.isMaster)
		{
			if (lCurrentPlayerWeaponId !== undefined)
			{
				this._changeWeapon(lCurrentPlayerWeaponId, lSpotDefaultWeaponId_int);
			}
		}
		else
		{
			this._changeWeapon(lCurrentPlayerWeaponId, lSpotDefaultWeaponId_int);
		}
	}

	_changeWeapon(aWeaponId_int, aCurrentDefaultWeaponId_int, aIsSkipAnimation_bl = false)
	{
		if (this._fWeaponsBack_pswb)
		{
			this._updateWeaponBack(aCurrentDefaultWeaponId_int);
			this._fWeaponsBack_pswb.update(aWeaponId_int, aCurrentDefaultWeaponId_int);
			this.emit(PlayerSpot.EVENT_CHANGE_WEAPON, {weaponId: aWeaponId_int, defaultWeaponId: aCurrentDefaultWeaponId_int, isSkipAnimation_bl: aIsSkipAnimation_bl});
		}
	}

	_showBounceEffect()
	{
		this.removeTweens();

		let lSequence_arr = [
			{tweens: [{prop:'scale.x', to:0.86}, {prop:'scale.y', to:0.86}], duration:55, ease:Easing.sine.easeOut},
			{tweens: [{prop:'scale.x', to:0.92}, {prop:'scale.y', to:0.92}], duration:55, ease:Easing.sine.easeIn},
			{tweens: [{prop:'scale.x', to:1  }, {prop:'scale.y', to:1  }], duration:55, ease:Easing.sine.easeOut}
		];

		Sequence.start(this, lSequence_arr);
	}

	destroy()
	{
		Sequence.destroy(Sequence.findByTarget(this));

		this._fWeaponSpotController_wsc && this._fWeaponSpotController_wsc.destroy();

		super.destroy();

		this._fWeaponsBack_pswb && this._fWeaponsBack_pswb.destroy();
		this._fWeaponsBack_pswb = null;

		this._fDefaultPosition_obj = null;
		this._fPlayer_obj = null;
		this._fUserStyles_obj = null;

		this._fWeaponSpotController_wsc = null;
	}
}

export default PlayerSpot;
