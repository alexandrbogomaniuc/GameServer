import MissEffect from './MissEffect';
import MissEffectLevel5ExplosionAnimation from './MissEffectLevel5ExplosionAnimation';

class MissEffectLevel5 extends MissEffect
{
	constructor()
	{
		super()

		this._fExplosion_melea = null;
	}

	getExplosion()
	{
		return this._fExplosion_melea || this._initExplosion();
	}

	_initExplosion()
	{
		this._fExplosion_melea = this.addChild(new MissEffectLevel5ExplosionAnimation());
		this._fExplosion_melea.alpha = 1;
		this._fExplosion_melea.scale.set(1.04, 1.04);
		this._fExplosion_melea.on(MissEffectLevel5ExplosionAnimation.EVENT_ON_ANIMATION_ENDED, this.drop, this);
		return this._fExplosion_melea;
	}	

	reset(aX_num, aY_num)
	{
		super.reset(aX_num, aY_num);
		this._startAnimation();
	}

	drop()
	{
		super.drop();
	}

	_startAnimation()
	{
		this.getExplosion().i_startAnimation();
	}

	init()
	{
		this._initExplosion();
	}

	destroy()
	{
		super.destroy();
		this._fExplosion_melea && this._fExplosion_melea.destroy();
	}
}

export default MissEffectLevel5;