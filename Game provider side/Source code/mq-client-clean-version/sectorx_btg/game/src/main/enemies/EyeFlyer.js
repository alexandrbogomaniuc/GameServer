import SpineEnemy from './SpineEnemy';
import Sequence from '../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';

class EyeFlyer extends SpineEnemy
{
	constructor(params)
	{
		super(params);
	}

	//override
	get isFreezeGroundAvailable()
	{
		return false;
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
		let lSpeed_num = 2;
		return lSpeed_num
	}

	//override
	_calculateAnimationName()
	{
		let animationName = this.getWalkAnimationName();
		return animationName;
	}

	//override
	_playDeathFxAnimation(aIsInstantKill_bl, aOptKilledByKillerCapsule_bl=false)
	{
		this.container && Sequence.destroy(Sequence.findByTarget(this.container));
		this.spineView && Sequence.destroy(Sequence.findByTarget(this.spineView));
		super._playDeathFxAnimation(aIsInstantKill_bl, aOptKilledByKillerCapsule_bl);
		this.deathFxAnimation.scale.set(0.4);
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

		let lX_num = 4*Math.sin(-this.spineView.rotation);
		let lY_num = 4*Math.cos(-this.spineView.rotation);
		this.shadow.position.set(lX_num, lY_num + 35);
		this.shadow.rotation = this.spineView.rotation;
	}

	//override
	_getHitRectHeight()
	{
		return 30;
	}

	//override
	_getHitRectWidth()
	{
		return 30;
	}

	//override
	getLocalCenterOffset()
	{
		let pos = { x: 0, y: -3 };
		return pos;
	}

	get __maxCrosshairDeviationOnEnemyX() //maximum deviation in X position of the cursor on the body of the enemy
	{
		return 10;
	}

	get __maxCrosshairDeviationOnEnemyY() //maximum deviation in Y position of the cursor on the body of the enemy
	{
		return 10;
	}

	//override
	destroy(purely = false)
	{
		this.container && Sequence.destroy(Sequence.findByTarget(this.container));
		this.spineView && Sequence.destroy(Sequence.findByTarget(this.spineView));

		super.destroy(purely);
	}
}

export default EyeFlyer;