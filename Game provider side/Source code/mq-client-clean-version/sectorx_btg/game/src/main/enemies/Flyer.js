import { STATE_WALK } from './Enemy';
import SpineEnemy from './SpineEnemy';

class Flyer extends SpineEnemy
{
	constructor(params)
	{
		super(params);

		this._fCurrentFlyAnimationName_str = null;
		this._fWingFlapCounter_int = 0;
	}

	//override
	get _isSpineFrameSyncRequired()
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
	_calculateAnimationName()
	{
		return STATE_WALK;
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

		let lX_num = 2*Math.sin(-this.spineView.rotation);
		let lY_num = 2*Math.cos(-this.spineView.rotation);
		this.shadow.position.set(lX_num, lY_num);
		this.shadow.rotation = this.spineView.rotation;
	}

	//override
	_getHitRectHeight()
	{
		return 60;
	}

	//override
	_getHitRectWidth()
	{
		return 90;
	}

	//override
	getLocalCenterOffset()
	{
		let pos = { x: 0, y: -12 };
		return pos;
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

export default Flyer;