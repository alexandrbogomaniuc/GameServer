import SpineEnemy from './SpineEnemy';

class RedHeadFlyer extends SpineEnemy
{
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
	_calculateAnimationLoop()
	{
		let animationLoop = true;

		return animationLoop;
	}

	//override
	changeShadowPosition()
	{
		if (!this.spineView)
		{
			return;
		}

		let lX_num = -3*Math.sin(-this.spineView.rotation);
		let lY_num = -3*Math.cos(-this.spineView.rotation);
		this.shadow.position.set(lX_num, lY_num + 40);
		this.shadow.rotation = this.spineView.rotation;
	}
	
	//override
	_getHitRectHeight()
	{
		return 50;
	}

	//override
	_getHitRectWidth()
	{
		return 70;
	}

	get __maxCrosshairDeviationOnEnemyX() //maximum deviation in X position of the cursor on the body of the enemy
	{
		return 23;
	}

	get __maxCrosshairDeviationOnEnemyY() //maximum deviation in Y position of the cursor on the body of the enemy
	{
		return 23;
	}
	
}

export default RedHeadFlyer;