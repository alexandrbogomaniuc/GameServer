import SpineEnemy from './SpineEnemy';
import { DIRECTION } from './Enemy';
import { ENEMIES } from '../../../../shared/src/CommonConstants';

class GoblinEnemy extends SpineEnemy
{
	constructor(params)
	{
		super(params);
	}

	//override...
	getSpineSpeed()
	{
		let lSpeed_num = 0.15;
		switch (this.direction)
		{
			case DIRECTION.RIGHT_UP:	lSpeed_num = 0.11;	break;
			case DIRECTION.RIGHT_DOWN:	lSpeed_num = 0.11;	break;
			case DIRECTION.LEFT_DOWN:	lSpeed_num = 0.15;	break;
			case DIRECTION.LEFT_UP:		lSpeed_num = 0.15;	break;
		}

		let lSpineSpeed_num = lSpeed_num * this.currentTrajectorySpeed;

		if (this.isImpactState)
		{
			lSpineSpeed_num *= 1.5;
		}

		return lSpineSpeed_num;
	}

	//override...
	_getHitRectWidth()
	{
		return 30;
	}

	//override...
	_getHitRectHeight()
	{
		return 70;
	}

	//override...
	getLocalCenterOffset()
	{
		let pos = {x: 0, y: 0};
		switch (this.direction)
		{
			case DIRECTION.LEFT_DOWN:
				pos.x = -10;
				pos.y = -20;
				break;
			case DIRECTION.LEFT_UP:
				pos.x = -10;
				pos.y = -40;
				break;
			case DIRECTION.RIGHT_DOWN:
				pos.x = 0;
				pos.y = -20;
				break;
			case DIRECTION.RIGHT_UP:
				pos.x = 0;
				pos.y = -40;
				break;
		}
		return pos;
	}

	get isDuplicatedGoblin()
	{
		return this.name == ENEMIES.DuplicatedGoblin;
	}

	destroy(purely)
	{
		super.destroy(purely);
	}

	_generateFreezeMask(aResolution_num)
	{
		let containerScale = {x: this.container.scale.x, y: this.container.scale.y};
		this.container.scale.set(1, 1);

		let mask = super._generateFreezeMask(aResolution_num);

		this.container.scale.set(containerScale.x, containerScale.y);

		return mask;
	}
}
export default GoblinEnemy;