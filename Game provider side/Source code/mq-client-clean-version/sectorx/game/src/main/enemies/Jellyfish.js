import SpineEnemy from './SpineEnemy';

class Jellyfish extends SpineEnemy
{
	//override
	get _isSpineFrameSyncRequired()
	{
		return false;
	}

	_initView()
	{
		super._initView();
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

		let lX_num = 5*Math.sin(-this.spineView.rotation);
		let lY_num = 5*Math.cos(-this.spineView.rotation);
		this.shadow.position.set(lX_num, lY_num + 35);
	}

	//override
	_getHitRectHeight()
	{
		return 50;
	}

	//override
	_getHitRectWidth()
	{
		return 45;
	}

	get __maxCrosshairDeviationOnEnemyX() //maximum deviation in X position of the cursor on the body of the enemy
	{
		return 18;
	}

	get __maxCrosshairDeviationOnEnemyY()
	{
		return 18;
	}

	
	//override
	destroy(purely = false)
	{
		super.destroy(purely);
	}
}

export default Jellyfish;