import BossEnemy from './BossEnemy';

class LightningBoss extends BossEnemy 
{

	constructor(params)
	{
		super(params);
	}

	getSpineSpeed()
	{
		return this.speed * 0.2;
	}

	setSpineViewPos()
	{
		let pos = { x: 0, y: 0 };
		this.spineViewPos = pos;
	}

	getScaleCoefficient()
	{
		return 0.5;
	}

	getLocalCenterOffset()
	{
		let pos = { x: 0, y: -96 };
		return pos;
	}

	//override
	get _customSpineTransitionsDescr()
	{
		return [
			{ from: "spawn", to: "walk", duration: 0.5 },
			{ from: "walk", to: "dead", duration: 0.5 }
		];
	}

	//override
	changeShadowPosition()
	{
		if(!this.shadow) return;

		this.shadow.position.set(0, 20);
	}

	_getHitRectHeight()
	{
		return 120;
	}

	_getHitRectWidth()
	{
		return 190;
	}

	get __maxCrosshairDeviationOnEnemyX() //maximum deviation in X position of the cursor on the body of the enemy
	{
		return 36;
	}

	get __maxCrosshairDeviationOnEnemyY() //maximum deviation in Y position of the cursor on the body of the enemy
	{
		return 76;
	}

	get __maxCrosshairDeviationTwoOnEnemyX()
	{
		return 82;
	}

	get __maxCrosshairDeviationTwoOnEnemyY()
	{
		return 52;
	}

	destroy(purely = false)
	{
		super.destroy(purely);
	}
}

export default LightningBoss;