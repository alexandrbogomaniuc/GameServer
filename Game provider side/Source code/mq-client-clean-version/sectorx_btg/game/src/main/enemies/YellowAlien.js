import SpineEnemy from './SpineEnemy';

class YellowAlien extends SpineEnemy
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
		if (!this.spineView)
		{
			return;
		}

		let lX_num = -2*Math.sin(-this.spineView.rotation);
		let lY_num = -2*Math.cos(-this.spineView.rotation);
		this.shadow.position.set(lX_num, lY_num);
		this.shadow.rotation = this.spineView.rotation;
	}

	//override
	_getHitRectHeight()
	{
		return 80;
	}

	//override
	_getHitRectWidth()
	{
		return 80;
	}

	//override
	getLocalCenterOffset()
	{
		let pos = { x: 0, y: -7 };
		return pos;
	}

	get __maxCrosshairDeviationOnEnemyX() //maximum deviation in X position of the cursor on the body of the enemy
	{
		return 19;
	}

	get __maxCrosshairDeviationOnEnemyY() //maximum deviation in Y position of the cursor on the body of the enemy
	{
		return 19;
	}
}

export default YellowAlien;