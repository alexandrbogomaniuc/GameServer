import SpineEnemy from './SpineEnemy';
import Sequence from '../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';

class Mothy extends SpineEnemy
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

		let lX_num = 6*Math.sin(-this.spineView.rotation);
		let lY_num = 6*Math.cos(-this.spineView.rotation);
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
		return 65;
	}

	get __maxCrosshairDeviationOnEnemyX() //maximum deviation in X position of the cursor on the body of the enemy
	{
		return 26;
	}

	get __maxCrosshairDeviationOnEnemyY() //maximum deviation in Y position of the cursor on the body of the enemy
	{
		return 26;
	}
	
	//override
	destroy(purely = false)
	{
		this.spineView && Sequence.destroy(Sequence.findByTarget(this.spineView));

		super.destroy(purely);
	}
}

export default Mothy;