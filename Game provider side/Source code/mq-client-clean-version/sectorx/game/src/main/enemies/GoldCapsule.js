import Capsule from "./Capsule";

class GoldCapsule extends Capsule
{

	constructor(params)
	{
		super(params);
	}

	_playDeathFxAnimation(aIsInstantKill_bl)
	{
		super._playDeathFxAnimation(aIsInstantKill_bl);
	}

	get __maxCrosshairDeviationOnEnemyX() //maximum deviation in X position of the cursor on the body of the enemy
	{
		return 52;
	}

	get __maxCrosshairDeviationOnEnemyY() //maximum deviation in Y position of the cursor on the body of the enemy
	{
		return 65;
	}

	destroy(purely = false)
	{
		super.destroy(purely)
	}
}

export default GoldCapsule;