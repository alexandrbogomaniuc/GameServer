import MissEffect from './MissEffect';
import MissEffectLevel1ExplosionAnimation from './MissEffectLevel1ExplosionAnimation';

class MissEffectLevel1 extends MissEffect
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
		this._fExplosion_melea = this.addChild(new MissEffectLevel1ExplosionAnimation());
		this._fExplosion_melea.alpha = 0.8;
		this._fExplosion_melea.scale.set(1.02, 1.02);
		this._fExplosion_melea.on(MissEffectLevel1ExplosionAnimation.EVENT_ON_ANIMATION_ENDED, this.drop, this);	
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

export default MissEffectLevel1;