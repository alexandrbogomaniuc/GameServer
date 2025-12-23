import SimpleUIView from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/SimpleUIView';
import Weapon from '../../../main/playerSpots/Weapon';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE, WEAPONS } from '../../../../../shared/src/CommonConstants';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { Utils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';

class WeaponSpotView extends SimpleUIView
{
	/**
	 * @param {Object} aPoint_obj Global point (x, y)
	 * @returns {Boolean} Returns true if point is over the weapon
	 */
	i_doesWeaponViewContainPoint(aPoint_obj)
	{
		if (aPoint_obj instanceof Number)
		{
			throw new Error("Point must be an object!")
		}

		let lWeaponScale_num = this._fWeaponView_wpn.i_getWeaponScale(this._fWeaponView_wpn.id);
		let lWeaponLocalPoint_obj = this._fWeaponView_wpn.gun.globalToLocal(aPoint_obj);
		lWeaponLocalPoint_obj.x /= lWeaponScale_num;
		lWeaponLocalPoint_obj.y /= lWeaponScale_num;
		return this._fWeaponView_wpn.weaponSprite && this._fWeaponView_wpn.weaponSprite.hitArea.contains(lWeaponLocalPoint_obj.x, lWeaponLocalPoint_obj.y);
	}

	constructor(aIsBottom_bl = true, aSeatId_num)
	{
		super();

		this._fWeaponView_wpn = null;
		this._fIsBottom_bl = aIsBottom_bl;
		this._fSeatId_num = aSeatId_num;
		this._fCircleBlast_spr = null;
		this._fSmoke_spr = null;
		this._fWeaponChangeTimeMoment_int = null;
		this._fIsWeaponChangeInProgress_bl = false;
	}

	set pushSequence(value)
	{
		this._pushSequence = value;
	}

	get pushSequence()
	{
		return this._pushSequence;
	}

	showPowerUPGlow()
	{
		this._fWeaponView_wpn.showPowerUPGlow();
	}

	destroy()
	{
		this._destroyAnimation(this._fCircleBlast_spr);
		this._destroyAnimation(this._fSmoke_spr);

		this._fWeaponChangeTimeMoment_int = null;
		this._fIsWeaponChangeInProgress_bl = false;

		this._pushSequence && this._pushSequence.destructor();
		this._pushSequence = null;

		if (this._fWeaponView_wpn)
		{
			this._fWeaponView_wpn.destroy();
			this._fWeaponView_wpn = null;
		}

		this._fIsBottom_bl = undefined;
		this._fSeatId_num = null;

		super.destroy();
	}

	get gun()
	{
		return this._fWeaponView_wpn;
	}

	get isBottom()
	{
		return this._fIsBottom_bl;
	}

	i_updateWeapon(lIsSkipAnimationExternal_bl = false)
	{
		if (!this._isSkipAnimation() && !lIsSkipAnimationExternal_bl)
		{
			this._animateChangeWeapon();
			this._fIsWeaponChangeInProgress_bl = true;
			this._fWeaponView_wpn.playRemoveWeaponAnimation();
			this._fWeaponView_wpn.once(Weapon.EVENT_ON_REMOVE_WEAPON_ANIMATION_FINISH, this._createNewWeapon, this)
		}
		else
		{
			this._createNewWeapon(true);
		}
	}

	_isSkipAnimation()
	{
		let lWeaponChangeDeltaTime = 0;
		if (!this._fWeaponChangeTimeMoment_int)
		{
			this._fWeaponChangeTimeMoment_int = new Date().getTime();
		}
		else
		{
			lWeaponChangeDeltaTime = new Date().getTime() - this._fWeaponChangeTimeMoment_int;
		}

		if (this._fWeaponView_wpn && APP.profilingController.info.isVfxProfileValueMediumOrGreater && lWeaponChangeDeltaTime > 500)
		{
			if (this._fWeaponView_wpn.id != this.uiInfo.currentWeaponId && this.uiInfo.currentWeaponId != WEAPONS.DEFAULT)
			{
				return false;
			}
			else if (this._fWeaponView_wpn.currentDefaultWeaponId != this.uiInfo.currentDefaultWeaponId || this._fWeaponView_wpn.id != WEAPONS.DEFAULT)
			{
				return false;
			}
		}

		return true;
	}

	get isWeaponChangeInProgress()
	{
		return this._fIsWeaponChangeInProgress_bl;
	}

	_createNewWeapon(aIsSkipAnimation_bl = false)
	{
		this._fIsWeaponChangeInProgress_bl = false;
		this._fWeaponView_wpn && this._fWeaponView_wpn.destroy();

		let lInfo_wsi = this.uiInfo;
		this._fWeaponView_wpn = this.addChild(new Weapon(lInfo_wsi.currentWeaponId, lInfo_wsi.isMaster, lInfo_wsi.currentDefaultWeaponId, this._fSeatId_num, aIsSkipAnimation_bl));
	}

	_animateChangeWeapon()
	{
		this._animateCircleBlast();
		this._animateSmoke();
	}

	_animateCircleBlast()
	{
		this._fCircleBlast_spr = APP.library.getSprite("weapons/circle_blast");
		this.addChildAt(this._fCircleBlast_spr, 0);
		this._fCircleBlast_spr.scale.set(0.5);
		this._fCircleBlast_spr.blendMode = PIXI.BLEND_MODES.ADD;

		let lScale_seq = [
			{ tweens: [{ prop: "scale.x", to: 2 }, { prop: "scale.y", to: 2 }], duration: 5 * FRAME_RATE, onfinish: () => { this._destroyAnimation(this._fCircleBlast_spr); } },
		];
		Sequence.start(this._fCircleBlast_spr, lScale_seq);

		let lAlpha_seq = [
			{ tweens: [], duration: 1.5 * FRAME_RATE },
			{ tweens: [{ prop: "alpha", to: 0 }], duration: 3.5 * FRAME_RATE },
		];
		Sequence.start(this._fCircleBlast_spr, lAlpha_seq);
	}

	_destroyAnimation(aAnimation_spr)
	{
		Sequence.destroy(Sequence.findByTarget(aAnimation_spr));
		aAnimation_spr && aAnimation_spr.destroy();
		aAnimation_spr = null;
	}

	_animateSmoke()
	{
		if(this._fSmoke_spr)
		{
			this._destroyAnimation(this._fSmoke_spr);
		}
		
		this._fSmoke_spr = this.addChild(APP.library.getSpriteFromAtlas("common/transition_smoke_fx_unmult"));
		this._fSmoke_spr.blendMode = PIXI.BLEND_MODES.ADD;
		this._fSmoke_spr.scale.set(0.7);
		this._fSmoke_spr.alpha = 0.86;
		this._fSmoke_spr.rotation = 3.0019663134302466; //Utils.gradToRad(172);

		let lScale_seq = [
			{ tweens: [], duration: 2 * FRAME_RATE },
			{ tweens: [{ prop: "scale.x", to: 2.3 }, { prop: "scale.y", to: 2.3 }], duration: 6.5 * FRAME_RATE, onfinish: () => { this._destroyAnimation(this._fSmoke_spr); } },
		];
		Sequence.start(this._fSmoke_spr, lScale_seq);

		let lAlpha_seq = [
			{ tweens: [], duration: 2 * FRAME_RATE },
			{ tweens: [{ prop: "alpha", to: 0 }], duration: 6 * FRAME_RATE },
		];
		Sequence.start(this._fSmoke_spr, lAlpha_seq);

		let lAngle_seq = [
			{tweens: [{prop: 'rotation', to: 3.420845333908886}],		duration: 6 * FRAME_RATE}, // Utils.gradToRad(196)
		];
		Sequence.start(this._fSmoke_spr, lAngle_seq);
	}
}

export default WeaponSpotView;