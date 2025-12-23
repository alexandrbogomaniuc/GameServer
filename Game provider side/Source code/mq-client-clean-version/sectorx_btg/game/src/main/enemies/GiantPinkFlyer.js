import PinkFlyer from './PinkFlyer';

class GiantPinkFlyer extends PinkFlyer
{
	//override
	_getHitRectHeight()
	{
		return 90;
	}

	//override
	_getHitRectWidth()
	{
		return 90;
	}

	getLocalCenterOffset()
	{
		let pos = { x: 0, y: -31 };
		return pos;
	}

	get __maxCrosshairDeviationOnEnemyX() //maximum deviation in X position of the cursor on the body of the enemy
	{
		return 38;
	}

	get __maxCrosshairDeviationOnEnemyY() //maximum deviation in Y position of the cursor on the body of the enemy
	{
		return 38;
	}
}

export default GiantPinkFlyer;