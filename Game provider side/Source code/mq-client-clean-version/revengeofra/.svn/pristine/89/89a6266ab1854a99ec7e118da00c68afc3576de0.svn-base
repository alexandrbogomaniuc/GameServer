import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import Timer from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import ElectricityBodyFrontAnimatedArcView from './body_arcs/ElectricityBodyFrontAnimatedArcView';
import { Utils } from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import { DIRECTION } from '../../../../main/enemies/Enemy';
import { ANIMATED_ARCS_POSITIONS, ANIMATED_ARCS_SCALES } from './custom/ElectricityBodyAnimatedArcsProperties';

const ARC_DELAYS_IN_FRAMES = [17, 8, 8, 4, 19, 14, 8];


class ElectricityBodyFrontArcsAnimation extends Sprite
{
	static get EVENT_ON_ANIMATION_CYCLE_COMPLETED()	{return "EVENT_ON_ANIMATION_CYCLE_COMPLETED"};
	
	startAnimation()
	{
		this._startAnimation();
	}

	//INIT...
	constructor(targetEnemy)
	{
		super();

		this._targetEnemy = targetEnemy;
		this._arcAppearTimer = null;
		this._currentArcDelayIndex = -1;
		this._addedArcsAmount_num = 0;
	}
	//...INIT

	//ANIMATION...
	_startAnimation()
	{
		this._currentArcDelayIndex = -1;
		this._addedArcsAmount_num = 0;
		this._addArc();

		this._startArcAppearTimer();
	}

	get _arcPositions()
	{
		return ANIMATED_ARCS_POSITIONS[this._targetEnemy.name];
	}

	get _arcViewDefaultScale()
	{
		return ANIMATED_ARCS_SCALES[this._targetEnemy.name];
	}

	_addArc()
	{
		let arcType = this._addedArcsAmount_num;
		if (arcType == 6)
		{
			arcType = 2;
		}
		else if (arcType == 7)
		{
			arcType = 3;
		}

		let arcAnim = this.addChild(new ElectricityBodyFrontAnimatedArcView(arcType));
		let arcPos = this._calcNextArcPosition();
		arcAnim.scale.set(this._arcViewDefaultScale);
		arcAnim.x = arcPos.x;
		arcAnim.y = arcPos.y;
		arcAnim.rotation = arcPos.rotation;
		arcAnim.scale.x *= arcPos.scaleXDirectionMult;

		
		if (this._addedArcsAmount_num == this._arcPositions[DIRECTION.LEFT_DOWN].length-1)
		{
			arcAnim.on(ElectricityBodyFrontAnimatedArcView.EVENT_ON_ANIMATION_COMPLETED, this._onLastArcAnimationCompleted, this);
		}

		arcAnim.startAnimation();

		this._addedArcsAmount_num++;
	}

	_onLastArcAnimationCompleted(event)
	{
		this.emit(ElectricityBodyFrontArcsAnimation.EVENT_ON_ANIMATION_CYCLE_COMPLETED);
	}

	_calcNextArcPosition()
	{
		let arcIndex = this._addedArcsAmount_num;
		let enemyDirection = this._targetEnemy.direction;
		let nextArcPositionProperties = this._arcPositions[enemyDirection][arcIndex];
		let arcPos = {};
		arcPos.x = nextArcPositionProperties.x;
		arcPos.y = nextArcPositionProperties.y;
		arcPos.rotation = Utils.gradToRad(nextArcPositionProperties.angle);
		arcPos.scaleXDirectionMult = nextArcPositionProperties.scaleXDirectionMult;
		
		return arcPos;
	}

	//TIMER...
	_startArcAppearTimer()
	{
		this._currentArcDelayIndex++;
		let delayFramesAmount_num;
		if (this._currentArcDelayIndex < ARC_DELAYS_IN_FRAMES.length)
		{
			delayFramesAmount_num = ARC_DELAYS_IN_FRAMES[this._currentArcDelayIndex];
			this._arcAppearTimer = new Timer(this._onArcAppearTimerCompleted.bind(this), delayFramesAmount_num*2*16.7);
		}
		else
		{
			this._currentArcDelayIndex = -1;
		}
	}

	_clearArcAppearTimer()
	{
		this._arcAppearTimer && this._arcAppearTimer.destructor();
		this._arcAppearTimer = null;
	}

	_onArcAppearTimerCompleted()
	{
		this._clearArcAppearTimer();

		this._addArc();

		this._startArcAppearTimer();		
	}
	//...TIMER

	//...ANIMATION
	
	destroy()
	{
		this._targetEnemy = null;
		this._clearArcAppearTimer();

		this._currentArcDelayIndex = undefined;
		this._addedArcsAmount_num = undefined;

		super.destroy();
	}
}

export default ElectricityBodyFrontArcsAnimation;