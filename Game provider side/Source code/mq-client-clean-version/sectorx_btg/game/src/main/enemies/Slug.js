import SpineEnemy from './SpineEnemy';

class Slug extends SpineEnemy
{
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
	get _isSpineFrameSyncRequired()
	{
		return false;
	}

	//override
	_getHitRectHeight()
	{
		return 40;
	}

	//override
	_getHitRectWidth()
	{
		return 60;
	}

	//override
	getLocalCenterOffset()
	{
		let pos = { x: 0, y: -5 };
		return pos;
	}

	get __maxCrosshairDeviationOnEnemyX() //maximum deviation in X position of the cursor on the body of the enemy
	{
		return 16;
	}

	get __maxCrosshairDeviationOnEnemyY() //maximum deviation in Y position of the cursor on the body of the enemy
	{
		return 24;
	}
}

export default Slug;