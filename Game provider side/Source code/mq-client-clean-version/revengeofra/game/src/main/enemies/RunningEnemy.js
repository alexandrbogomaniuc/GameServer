import SpineEnemy from './SpineEnemy';
import { DIRECTION, STATE_WALK } from './Enemy';

const MIN_RUNNING_SPEED = 8.5;
const MIN_RUNNING_TURN_SPEED = 4;
const MIN_WALKING_TURN_SPEED = 1.5;

const FOOT_RUN_STEPS_POSITIONS = 
{
};

/*The enemy which sometimes walks and sometimes runs, depending on its speed*/
class RunningEnemy extends SpineEnemy {

	get isWalkTypeRunning()
	{
		return this.speed > MIN_RUNNING_SPEED;
	}

	//override
	get minTurnSpeed()
	{
		return this.isWalkTypeRunning ? MIN_RUNNING_TURN_SPEED : MIN_WALKING_TURN_SPEED;
	}

	//override
	get _footStepPositionsDescriptor()
	{
		if (this.isWalkTypeRunning)
		{
			return FOOT_RUN_STEPS_POSITIONS;
		}

		return super._footStepPositionsDescriptor;
	}

	//override
	getStepTimers()
	{
		return super.getStepTimers();
	}

	constructor(params)
	{
		super(params);
	}

	//override
	_calcWalkAnimationName(aDirection_str)
	{
		let lWalkingAnimationName_str = this.isWalkTypeRunning ? "run" : "walk"
		return super._calcWalkAnimationName(aDirection_str, lWalkingAnimationName_str);
	}

	//override
	getSpineSpeed()
	{
		if (!this.isWalkTypeRunning)
			return super.getSpineSpeed();

		return 0.07 * this.speed;
	}

	//override
	changeShadowPosition()
	{
		if (!this.isWalkTypeRunning)
			return super.changeShadowPosition();
		
		let x = 0, y = 0, scale = 1;
		
		switch(this.direction)
		{
			case DIRECTION.LEFT_DOWN:
				x = 5;
				y = -10;
				break;
			case DIRECTION.RIGHT_DOWN:
				x = -5;
				y = -10;
				break;
		}
		this.shadow.position.set(x, y);
		this.shadow.scale.set(scale);
	}

}

export default RunningEnemy;