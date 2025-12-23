import Trex from './Trex';

class GiantTrex extends Trex
{
	//override
	_getHitRectHeight()
	{
		return 90;
	}

	//override
	_getHitRectWidth()
	{
		return 210;
	}

	getLocalCenterOffset()
	{
		let pos = { x: 0, y: -30 };
		return pos;
	}

	get __maxCrosshairDeviationOnEnemyX() //maximum deviation in X position of the cursor on the body of the enemy
	{
		return 48;
	}

	get __maxCrosshairDeviationOnEnemyY() //maximum deviation in Y position of the cursor on the body of the enemy
	{
		return 48;
	}
}

export default GiantTrex;