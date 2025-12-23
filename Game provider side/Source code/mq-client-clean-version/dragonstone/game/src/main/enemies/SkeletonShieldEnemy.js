import SpineEnemy from './SpineEnemy';
import { DIRECTION, SPINE_SCALE } from './Enemy';
import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';


class SkeletonShieldEnemy extends SpineEnemy
{
	constructor(params)
	{
		super(params);
	}

	//override
	__generatePreciseCollisionBodyPartsNames()
	{
		return [
			"sword"
			];
	}

	//override
	hideEnemyEffectsBeforeDeathIfRequired()
	{

	}


	//override
	_createView(aShowAppearanceEffect_bl)
	{
		super._createView(aShowAppearanceEffect_bl);
	}


	//override
	getSpineSpeed()
	{
		if (this.isTurnState)
		{
			return 2;
		}

		let lBaseSpeed_num = 0.025;
		switch (this.direction)
		{
			case DIRECTION.RIGHT_UP: 	lBaseSpeed_num = 0.025;	break;
			case DIRECTION.LEFT_UP:		lBaseSpeed_num = 0.021;	break;
			case DIRECTION.LEFT_DOWN:	lBaseSpeed_num = 0.025;	break;
			case DIRECTION.RIGHT_DOWN:	lBaseSpeed_num = 0.023;	break;
			
		}
		let lSpineSpeed_num = (this.currentTrajectorySpeed*lBaseSpeed_num/(SPINE_SCALE*this.getScaleCoefficient())).toFixed(2);

		if (this.isImpactState)
		{
			lSpineSpeed_num *= 1.8;
		}

		return lSpineSpeed_num;
	}

	//override
	get turnPostfix()
	{
		return "";
	}

	//override
	_getHitRectHeight()
	{
		return 126;
	}

	//override
	_getHitRectWidth()
	{
		return 72;
	}

	//override
	changeShadowPosition()
	{
		let x = 5, y = 0, scale = 1.4, alpha = 1;

		this.shadow.position.set(x, y);
		this.shadow.scale.set(scale);
		this.shadow.alpha = alpha;
	}

	//override
	getLocalCenterOffset()
	{
		let pos = {x: 0, y: -46};
		return pos;
	}

	tick()
	{
		super.tick();
	}


	destroy()
	{
		super.destroy();
	}
}

export default SkeletonShieldEnemy;