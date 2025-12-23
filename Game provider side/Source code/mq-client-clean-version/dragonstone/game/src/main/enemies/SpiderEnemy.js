import SpineEnemy from './SpineEnemy';
import { Utils } from '../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';

class SpiderEnemy extends SpineEnemy
{
	constructor(params)
	{
		super(params);
	}

	//override...
	__isSimpleCollisionEnemy()
	{
		return true;
	}

	//override...
	getSpineSpeed()
	{
		let lSpeed_num = 0.18;
		let lSpineSpeed_num = lSpeed_num * this.currentTrajectorySpeed;

		if (this.isImpactState)
		{
			if (lSpineSpeed_num == 0)
			{
				return 1;
			}
			else
			{
				lSpineSpeed_num *= 1.5;
			}
			
		}

		return lSpineSpeed_num;
	}

	//override...
	_calcCurrentTrajectorySpeed()
	{
		if (!!this.prevTurnPoint && !!this.nextTurnPoint)
		{
			let lDeltaTime = this.nextTurnPoint.time - this.prevTurnPoint.time;
			let lDistance = Utils.getDistance(this.nextTurnPoint, this.prevTurnPoint)

			if (~~lDistance == 0)
			{
				return 0;
			}
			
			let lCurTrajectorySpeed = +(lDistance/lDeltaTime*1000/11.45).toFixed(2);

			return lCurTrajectorySpeed;
		}
	}

	//override...
	_getFreezeGroundScaleCoef()
	{
		return 0.99;
	}

	//override...
	setViewPos()
	{
		this.viewPos = {x: 0, y: 0};
	}

	//override...
	_getHitRectWidth()
	{
		return 33;
	}

	//override...
	_getHitRectHeight()
	{
		return 33;
	}

	//override...
	changeShadowPosition()
	{
		let lPos_obj = {x: 1, y: 5.5};
		let lScale_num = 0.66;
		let lAlpha_num = 0.72;

		this.shadow.position.set(lPos_obj.x, lPos_obj.y);
		this.shadow.scale.set(lScale_num);
		this.shadow.alpha = lAlpha_num;
	}

	//override...
	getLocalCenterOffset()
	{
		return {x: 0, y: -6.5};
	}

	destroy(purely)
	{
		super.destroy(purely);
	}
}

export default SpiderEnemy;