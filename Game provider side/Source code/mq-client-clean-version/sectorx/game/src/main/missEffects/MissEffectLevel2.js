import MissEffect from './MissEffect';
import MissEffectLevel2ExplosionAnimation from './MissEffectLevel2ExplosionAnimation';

class MissEffectLevel2 extends MissEffect
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
		this._fExplosion_melea = this.addChild(new MissEffectLevel2ExplosionAnimation());
		this._fExplosion_melea.alpha = 0.8;
		this._fExplosion_melea.scale.set(1.32, 1.32);
		this._fExplosion_melea.on(MissEffectLevel2ExplosionAnimation.EVENT_ON_ANIMATION_ENDED, this.drop, this);
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

export default MissEffectLevel2;