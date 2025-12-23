import SpineEnemy from './SpineEnemy';
import Sequence from '../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';

class Bioraptor extends SpineEnemy
{
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

	//override
	get _isSpineFrameSyncRequired()
	{
		return false;
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

		let lX_num = -5*Math.sin(-this.spineView.rotation);
		let lY_num = -5*Math.cos(-this.spineView.rotation);
		this.shadow.position.set(lX_num - 40, lY_num + 55);
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
		return 65;
	}

	//override
	getLocalCenterOffset()
	{
		let pos = { x: 0, y: -10 };
		return pos;
	}

	get __maxCrosshairDeviationOnEnemyX() //maximum deviation in X position of the cursor on the body of the enemy
	{
		return 24;
	}

	get __maxCrosshairDeviationOnEnemyY() //maximum deviation in Y position of the cursor on the body of the enemy
	{
		return 24;
	}
	
	//override
	destroy(purely = false)
	{
		this.spineView && Sequence.destroy(Sequence.findByTarget(this.spineView));

		super.destroy(purely);
	}
}

export default Bioraptor;