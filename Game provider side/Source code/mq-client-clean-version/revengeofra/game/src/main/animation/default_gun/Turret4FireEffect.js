import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import DefaultWeaponsShotEffects from '../../DefaultWeaponsShotEffects';
import CasingsAnimation from './CasingsAnimation';

class Turret4FireEffect extends Sprite
{
	static get EVENT_ON_ANIMATION_COMPLETED() {return "EVENT_ON_ANIMATION_COMPLETED";}

	constructor(aWeaponOffsetYFiringContinuously_int = 0)
	{
		super();

		this._fCasingsAnimation_ca = null;
		this._fFire_spr = null;
		this._fBullets_spr = null;
		this._fWeaponOffsetYFiringContinuously_int = aWeaponOffsetYFiringContinuously_int;

		this._startAnimation();
	}

	_startAnimation()
	{
		this._animateFire();
		this._animateСasings();
	}

	_animateFire()
	{
		DefaultWeaponsShotEffects.getTextures();
		this._fFire_spr = this.addChild(new Sprite);
		this._fFire_spr.textures = DefaultWeaponsShotEffects['turret_4'];
		this._fFire_spr.blendMode = PIXI.BLEND_MODES.SCREEN;
		this._fFire_spr.animationSpeed = 30 / 60;
		this._fFire_spr.scale.set(1);
		this._fFire_spr.play();
		this._fFire_spr.once('animationend', (e) => {
			e.target.destroy();
			this._fFire_spr = null;
			this._animationCompleated();
		});
	}

	_animateСasings()
	{
		this._fCasingsAnimation_ca = this.addChild(new CasingsAnimation());
		this._fCasingsAnimation_ca.position.set(3, 92 - this._fWeaponOffsetYFiringContinuously_int);
		this._fCasingsAnimation_ca.once(CasingsAnimation.EVENT_ON_ANIMATION_COMPLETED, (e) => {
			e.target.destroy();
			this._fCasingsAnimation_ca = null;
			this._animationCompleated();
		});
	}

	_animationCompleated()
	{
		if (!this._fFire_spr && !this._fCasingsAnimation_ca)
		{
			this.emit(Turret4FireEffect.EVENT_ON_ANIMATION_COMPLETED);
		}
	}

	destroy()
	{
		super.destroy();

		this._fCasingsAnimation_ca = null;
		this._fFire_spr = null;
		this._fBullets_spr = null;
		this._fWeaponOffsetYFiringContinuously_int = null;
	}
}

export default Turret4FireEffect 