import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import CommonEffectsManager from '../../CommonEffectsManager';
import { Utils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';

class MineLauncherGunFireEffect extends Sprite {

	static get EVENT_ON_ANIMATION_END() { return 'animationend'};

	constructor(aWeaponScale)
	{
		super();

		this._fDieSmoke_sprt = null;
		this._fStreak_sprt = null;
		this._fWeaponScale = aWeaponScale ? aWeaponScale: 1;

		this.once('added', (e) => {this._onAdded();});
	}

	_onAdded()
	{
		this._showEffect();
	}

	_showEffect()
	{
		let streak = this.addChild(new Sprite);
		streak.textures = CommonEffectsManager.getStreakTextures();
		streak.once('animationend', (e) => {
			streak.destroy();
		})
		streak.blendMode = PIXI.BLEND_MODES.ADD;
		streak.scale.set(0.07*2 * this._baseScale.x, 0.312*2 * this._baseScale.y);
		streak.scaleXTo(0.15*2 * this._baseScale.x, 22*2*16.7);
		streak.rotation = Utils.gradToRad(-90);
		streak.anchor.set(0.16, 0.49);
		streak.gotoAndPlay(21);
		this._fStreak_sprt = streak;

		let smoke = this.addChild(new Sprite);		
		smoke.textures = CommonEffectsManager.getDieSmokeUnmultTextures();
		smoke.anchor.set(0.57, 0.81);
		smoke.once('animationend', (e) => {
			smoke.destroy();
			this.emit(MineLauncherGunFireEffect.EVENT_ON_ANIMATION_END);
			this.destroy();
		})
		smoke.scale.set(this._baseScale.x*1, this._baseScale.y*0.6);
		smoke.play();
		this._fDieSmoke_sprt = smoke;	
	}

	get _baseScale()
	{
		return {x: 2*this._fWeaponScale, y: 2*this._fWeaponScale};
	}

	destroy()
	{
		this._fDieSmoke_sprt && this._fDieSmoke_sprt.destroy();
		this._fDieSmoke_sprt = null;
		this._fStreak_sprt && this._fStreak_sprt.destroy();
		this._fStreak_sprt = null;
		this._fWeaponScale = null;
		super.destroy();
	}
}

export default MineLauncherGunFireEffect;