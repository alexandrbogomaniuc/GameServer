import SpineEnemy from './SpineEnemy';

class Trex extends SpineEnemy
{
	/**
	 * @override
	 */
	addShadow()
	{
		super.addShadow();
		this.shadow.hide();
	}

	//override
	_calculateAnimationLoop()
	{
		let animationLoop = true;

		return animationLoop;
	}

	// override
	getSpineSpeed()
	{
		let lSpeed_num = 1;
		return lSpeed_num
	}

	//override
	get _isSpineFrameSyncRequired()
	{
		return false;
	}

	//override
	_calculateAnimationName()
	{
		let animationName = this.getWalkAnimationName();
		return animationName;
	}

	// override
	_calculateSpineSpriteNameSuffix()
	{
		return '';
	}

	//override
	changeShadowPosition()
	{
		// nothing to do
	}

	//override
	_getHitRectHeight()
	{
		return 60;
	}

	//override
	_getHitRectWidth()
	{
		return 140;
	}

	//override
	getLocalCenterOffset()
	{
		let pos = { x: 0, y: -25 };
		return pos;
	}

	get __maxCrosshairDeviationOnEnemyX() //maximum deviation in X position of the cursor on the body of the enemy
	{
		return 16;
	}

	get __maxCrosshairDeviationOnEnemyY() //maximum deviation in Y position of the cursor on the body of the enemy
	{
		return 16;
	}
}

export default Trex;