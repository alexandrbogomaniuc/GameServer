import JumpingEnemy from './JumpingEnemy';

class JumperBlue extends JumpingEnemy
{
	get _isSupportDirectionChange()
	{
		return false;
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
	getScaleCoefficient()
	{
		return 0.25;
	}

	//override
	changeShadowPosition()
	{
		if (!this.spineView)
		{
			return;
		}

		let lX_num = 2*Math.sin(-this.spineView.rotation);
		let lY_num = 2*Math.cos(-this.spineView.rotation);
		this.shadow.position.set(lX_num, lY_num);
		this.shadow.rotation = this.spineView.rotation;
		this.shadow.scale.set(1);
		super.changeShadowPosition();
	}

	//override
	_getHitRectHeight()
	{
		return 110;
	}

	//override
	_getHitRectWidth()
	{
		return 90;
	}

	//override
	getLocalCenterOffset()
	{
		let pos = { x: 0, y: -10 };
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
		return 22;
	}

	get __maxCrosshairDeviationOnEnemyY() //maximum deviation in Y position of the cursor on the body of the enemy
	{
		return 22;
	}
}

export default JumperBlue;