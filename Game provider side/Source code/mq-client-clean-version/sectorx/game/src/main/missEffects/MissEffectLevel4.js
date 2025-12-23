import MissEffect from './MissEffect';
import MissEffectLevel4ExplosionAnimation from './MissEffectLevel4ExplosionAnimation';

class MissEffectLevel4 extends MissEffect
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
		this._fExplosion_melea = this.addChild(new MissEffectLevel4ExplosionAnimation());
		this._fExplosion_melea.alpha = 1;
		this._fExplosion_melea.scale.set(1.36, 1.36);
		this._fExplosion_melea.on(MissEffectLevel4ExplosionAnimation.EVENT_ON_ANIMATION_ENDED, this.drop, this);
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

export default MissEffectLevel4;