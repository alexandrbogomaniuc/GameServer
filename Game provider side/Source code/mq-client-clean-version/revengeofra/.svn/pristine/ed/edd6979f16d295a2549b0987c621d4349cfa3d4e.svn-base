import JumpingEnemy from './JumpingEnemy';

class FiredEnemy extends JumpingEnemy
{
	constructor(params)
	{
		super(params);
	}

	_createView(aShowAppearanceEffect_bl)
	{
		super._createView(aShowAppearanceEffect_bl);
		
		this._initHVView(false);
	}

	get isHighVolatility()
	{
		return false;
	}

	get _isHvIdleFireEffectsRequired()
	{
		return true;
	}
}

export default FiredEnemy
