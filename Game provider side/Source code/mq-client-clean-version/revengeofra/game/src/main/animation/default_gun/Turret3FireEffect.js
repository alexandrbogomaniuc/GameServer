import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import DefaultWeaponsShotEffects from '../../DefaultWeaponsShotEffects';

class Turret3FireEffect extends Sprite
{
	static get EVENT_ON_ANIMATION_COMPLETED() {return "EVENT_ON_ANIMATION_COMPLETED";}

	constructor()
	{
		super();

		this._startAnimation();
	}

	_startAnimation()
	{
		this._animateFire();
	}

	_animateFire()
	{
		DefaultWeaponsShotEffects.getTextures();
		let lFire_spr = this.addChild(new Sprite);
		lFire_spr.textures = DefaultWeaponsShotEffects['turret_3'];
		lFire_spr.blendMode = PIXI.BLEND_MODES.SCREEN;
		lFire_spr.animationSpeed = 30 / 60;
		lFire_spr.scale.set(1);
		lFire_spr.play();
		lFire_spr.once('animationend', (e) => {
			e.target.destroy();
			this.emit(Turret3FireEffect.EVENT_ON_ANIMATION_COMPLETED);
		});
	}

	destroy()
	{
		super.destroy();
	}
}

export default Turret3FireEffect 