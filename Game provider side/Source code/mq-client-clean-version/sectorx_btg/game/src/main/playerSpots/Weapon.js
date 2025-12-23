import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sprite from '../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { FRAME_RATE, WEAPONS } from '../../../../shared/src/CommonConstants';
import * as Easing from '../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import Sequence from '../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import Gun from '../animation/Gun';
import GameFieldController from '../../controller/uis/game_field/GameFieldController';
import GameScreen from '../../main/GameScreen';
import Timer from "../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer";
import { Utils } from '../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import FireController from '../../controller/uis/fire/FireController';

import Turret1 from './turret/Turret1';
import Turret2 from './turret/Turret2';
import Turret3 from './turret/Turret3';
import Turret4 from './turret/Turret4';
import Turret5 from './turret/Turret5';

const MUZZLE_TIP_OFFSETS = {
	[WEAPONS.DEFAULT]: [48, 55, 60, 62, 70],
}

class Weapon extends Sprite 
{
	static get EVENT_ON_GUN_RELOADED() { return Gun.EVENT_ON_RELOADED }
	static get EVENT_ON_GUN_SHOT_COMPLETED() { return Gun.EVENT_ON_SHOT_COMPLETED }
	static get EVENT_ON_GUN_RESET() { return Gun.EVENT_ON_RESET }
	static get EVENT_ON_REMOVE_WEAPON_ANIMATION_FINISH() { return "removeWeaponAnimationFinish"; }

	get gun()
	{
		return this.weaponSprite;
	}

	get isIdleState()
	{
		return this.gun.isIdleState;
	}

	get isReloadState()
	{
		return this.gun.isReloadState;
	}

	get isShotState()
	{
		return this.gun.isShotState;
	}

	get muzzleTipOffset()
	{
		let lCurWeaponId = this.id;
		let tipOffset = MUZZLE_TIP_OFFSETS[lCurWeaponId];

		if (lCurWeaponId == WEAPONS.DEFAULT)
		{
			tipOffset = tipOffset[this._fDefaultWeaponId_int - 1]
		}
		else if (lCurWeaponId == WEAPONS.HIGH_LEVEL)
		{
			tipOffset = MUZZLE_TIP_OFFSETS[WEAPONS.DEFAULT][this._fDefaultWeaponId_int - 1];
		}

		return tipOffset;
	}

	get currentDefaultWeaponId()
	{
		return this._fDefaultWeaponId_int;
	}

	get _defaultShootingEffectDurations()
	{
		switch(this._fDefaultWeaponId_int)
		{
			case 1:
				return {intro: 2, peak: 2, outro: 7};
			default:
				return {intro: 0, peak: 0, outro: 0};
		}
	}

	playRemoveWeaponAnimation()
	{
		this._playRemoveWeaponAnimation();
	}

	showPowerUPGlow()
	{
		this._showPowerUPGlow();
	}

	constructor(id, aIsMaster_bl, aCurrentDefaultWeaponId, aSeatId_num, aIsSkipAnimation_bl = false)
	{
		super();

		this.id = id;
		this.isMaster = aIsMaster_bl;
		this.weaponSprite = null;
		this.shotlight = null;
		this._fSpecColorAmmo_sprt = null;
		this._fWeaponShootingEffect_spr = null;
		this._fFinishWeaponShootingEffectTimer_tmr = null;
		this._fSeatId_num = aSeatId_num;
		this._fIsSkipAnimation_bl = aIsSkipAnimation_bl;
		this.hitArea = null;
		this._fWeaponShootingInProgress_bl  = false;

		this._fDefaultWeaponId_int = aCurrentDefaultWeaponId ? aCurrentDefaultWeaponId : 1;

		this.once('added', () =>
		{
			this.createView();
		});
	}

	createView()
	{
		!this._fIsSkipAnimation_bl && this._animateWeaponChange();
		this.weaponSprite = this.addChild(this.getWeaponSprite());
		this.weaponSprite.scale.set(this.i_getWeaponScale(this.id));
		let anchor = this.getWeaponAnchor();
		this.weaponSprite.anchor.set(anchor.x, anchor.y);

		APP.currentWindow.on(GameScreen.DEFAULT_GUN_SHOW_FIRE, this._onDefaultWeaponShowFire, this);
	}

	_animateWeaponChange()
	{
		this._animateWeaponAppear();
	}

	_animateWeaponAppear()
	{
		this.scale.set(0);
		let lScale_seq = [
			{ tweens: [{ prop: "scale.x", to: 1 }, { prop: "scale.y", to: 1 }],		duration: 3 * FRAME_RATE, ease: Easing.quartic.easeIn},
		];

		Sequence.start(this, lScale_seq);
	}

	_playRemoveWeaponAnimation()
	{
		this._animateLightSweep();
		this._animateWeaponDisappear();
	}

	_animateLightSweep()
	{
		this._fSweep_sprt = this.weaponSprite.addChild(APP.library.getSprite("light_sweep"));
		this._fSweep_sprt.scale.set(0.8, 2.4);
		this._fSweep_sprt.rotation = 1.2217304763960306; //Utils.gradToRad(70);
		let lMask_ta = this.weaponSprite.addChild(this.getWeaponAsset());
		lMask_ta.position = this._getWeaponMaskPosition();
		this._fSweep_sprt.mask = lMask_ta;

		let lStartSweepY_num = -this._fSweep_sprt.height / 2 - this._fSweep_sprt.width / 2 - 10;
		let lEndSweepY_num = -lStartSweepY_num;
		this._fSweep_sprt.position.set(0, lStartSweepY_num);

		let l_seq = [{ tweens: [{ prop: 'position.y', to: lEndSweepY_num },], duration: 10 * FRAME_RATE, onfinish: () => this._destroySweep() }];
		Sequence.start(this._fSweep_sprt, l_seq);
	}

	_animateWeaponDisappear()
	{
		let lScale_seq = [
			{ tweens: [],		duration: 2 * FRAME_RATE},
			{ tweens: [{ prop: "scale.x", to: 0 }, { prop: "scale.y", to: 0 }],		duration: 5 * FRAME_RATE, onfinish: () => this._onFinishDisappearAnimation(), ease: Easing.quartic.easeIn },
		];

		Sequence.start(this, lScale_seq);
	}

	_onFinishDisappearAnimation()
	{
		this._destroySweep();
		Sequence.destroy(Sequence.findByTarget(this));
		this.emit(Weapon.EVENT_ON_REMOVE_WEAPON_ANIMATION_FINISH);
	}

	_destroySweep()
	{
		if (this._fSweep_sprt)
		{
			Sequence.destroy(Sequence.findByTarget(this._fSweep_sprt));
			this._fSweep_sprt = null;
		}
	}

	_onDefaultWeaponShowFire(event)
	{
		if (this.weaponSprite && event.seat == this._fSeatId_num)
		{
			this.weaponSprite.startGlowShotEffect();
		}
	}

	_showPowerUPGlow()
	{
		let lGlow_sprt = this.weaponSprite.addChild(this.getWeaponAsset());
		lGlow_sprt.tint = 0xEFAC43;
		lGlow_sprt.blendMode = PIXI.BLEND_MODES.ADD;

		let anchor = this.getWeaponAnchor();
		lGlow_sprt.anchor.set(anchor.x, anchor.y);

		lGlow_sprt.fadeTo(0, 22*FRAME_RATE, undefined, () => { lGlow_sprt.destroy(); })
	}

	destroy()
	{
		this._destroySweep();

		this.id = undefined;
		this._fSeatId_num = null;
		this.hitArea = null;

		APP.currentWindow.gameFieldController.off(GameFieldController.DEFAULT_GUN_SHOW_FIRE, this._onDefaultWeaponShowFire, this);

		this._fFinishWeaponShootingEffectTimer_tmr && this._fFinishWeaponShootingEffectTimer_tmr.destructor();
		this._fFinishWeaponShootingEffectTimer_tmr = null;

		this.weaponSprite && this.weaponSprite.off(Gun.EVENT_ON_RELOADED, this.emit, this);
		this.weaponSprite = null;
		this.shotlight = null;
		Sequence.destroy(Sequence.findByTarget(this._fWeaponShootingEffect_spr));
		this._fWeaponShootingEffect_spr = null;

		this._fSpecColorAmmo_sprt = null;
		this._fDefaultWeaponId_int = null;
		Sequence.destroy(Sequence.findByTarget(this));
		this.removeAllListeners();

		super.destroy();
	}

	get isCharged()
	{
		return this.weaponSprite.isCharged;
	}

	resetGun()
	{
		if (this.weaponSprite && this.weaponSprite instanceof Gun)
		{
			this.weaponSprite.once(Gun.EVENT_ON_RESET, this.emit, this);
			this.weaponSprite.reset();
		}
	}

	showShotlight()
	{
		if (this.shotlight)
		{
			return;
		}
		let lShotlightAsset_str, lAnchor_obj;

		if (lShotlightAsset_str)
		{
			this.shotlight = this.addChild(APP.library.getSprite(lShotlightAsset_str));
			if (lAnchor_obj)
			{
				this.shotlight.anchor.set(lAnchor_obj.x, lAnchor_obj.y);
			}
		}
	}

	hideShotlight()
	{
		if (this.shotlight)
		{
			this.shotlight.destroy();
			this.shotlight = null;
		}
	}

	i_getWeaponScale(aWeaponId)
	{
		let lWeaponId = aWeaponId ? aWeaponId : this.id;
		let lScaleValue = 1;
		switch (lWeaponId)
		{
			case WEAPONS.DEFAULT:
			case WEAPONS.HIGH_LEVEL:
				switch(this._fDefaultWeaponId_int)
				{
					case 1: lScaleValue = 0.8; break;
					case 2: lScaleValue = 0.76; break;
					case 3: lScaleValue = 0.64; break;
					case 4: lScaleValue = 0.48; break;
					case 5: lScaleValue = 0.52; break;
				}
				
				break;
			default:
				lScaleValue = 1;
				break;
		}
		return lScaleValue;
	}

	getWeaponAnchor()
	{
		let anchor = { x: 0.5, y: 0.585 };
		return anchor;
	}

	getWeaponSprite()
	{
		let lAssetName_str = "weapons/DefaultGun/turret_1/turret";
		switch (this.id)
		{
			case WEAPONS.DEFAULT:
			case WEAPONS.HIGH_LEVEL:
				switch(this._fDefaultWeaponId_int)
				{
					case 1: return new Turret1();
					case 2: return new Turret2();
					case 3: return new Turret3();
					case 4: return new Turret4();
					case 5: return new Turret5();
				}
			// case WEAPONS.HIGH_LEVEL:
			// 	lAssetName_str = "weapons/DefaultGun/turret_" + this._fDefaultWeaponId_int + "/turret";
			// 	break;
		}
		return APP.library.getSprite(lAssetName_str);
	}

	getWeaponAsset()
	{
		let lAssetName_str = "weapons/DefaultGun/default_turret_1/turret_top";
		switch (this.id)
		{
			case WEAPONS.DEFAULT:
			case WEAPONS.HIGH_LEVEL:
				lAssetName_str = "weapons/DefaultGun/default_turret_" + this._fDefaultWeaponId_int + "/turret_top";
				break;
		}
		return APP.library.getSprite(lAssetName_str);
	}

	_getWeaponMaskPosition()
	{
		let l_obj = { x: 0, y: 0 };
		switch (this.id)
		{
			case WEAPONS.DEFAULT:
				l_obj = { x: 0, y: -8 };
				break;
		}
		return l_obj;
	}
}

export default Weapon;