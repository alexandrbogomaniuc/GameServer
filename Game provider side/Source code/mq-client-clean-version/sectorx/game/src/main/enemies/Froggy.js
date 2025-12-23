import JumpingEnemy from './JumpingEnemy';

class Froggy extends JumpingEnemy
{
	//override
	get _origSpineRotationPerGrad()
	{
		return 0;
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
		this.shadow.position.set(lX_num - 5, lY_num);
		this.shadow.rotation = this.spineView.rotation;
		this.shadow.scale.set(1);
		super.changeShadowPosition();
	}

	//override
	_getHitRectHeight()
	{
		return 90;
	}

	//override
	_getHitRectWidth()
	{
		return 120;
	}

	// override
	getSpineSpeed()
	{
		let lSpeed_num = 1;
		return lSpeed_num
	}

	//override
	getLocalCenterOffset()
	{
		let pos = { x: 0, y: -5 };
		return pos;
	}

	//override
	get _finishJumpSpineAnimationTime()
	{
		return 0.879;
	}

	//override
	get _startJumpSpineAnimationTime()
	{
		return 0.296;
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

export default Froggy;