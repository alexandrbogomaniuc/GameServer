import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import ElectricitySmokeAnimation from './ElectricitySmokeAnimation';
import ElectricityBodyBackArcsAnimation from './ElectricityBodyBackArcsAnimation';
import Timer from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import { DIRECTION } from '../../../../main/enemies/Enemy';
import { ENEMIES } from '../../../../../../shared/src/CommonConstants';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';

const ARCS_VIEW_POSITION = 
{
	[ENEMIES.Anubis] : {
		[DIRECTION.LEFT_DOWN]	: {x: -20, y: -120},
		[DIRECTION.LEFT_UP]		: {x: -25, y: -120},
		[DIRECTION.RIGHT_DOWN]	: {x: -12, y: -120},
		[DIRECTION.RIGHT_UP]	: {x: -15, y: -120}
	},
	[ENEMIES.Osiris] : {
		[DIRECTION.LEFT_DOWN]	: {x: -20, y: -120},
		[DIRECTION.LEFT_UP]		: {x: -25, y: -120},
		[DIRECTION.RIGHT_DOWN]	: {x: -12, y: -120},
		[DIRECTION.RIGHT_UP]	: {x: -15, y: -120}
	},
	[ENEMIES.Thoth] : {
		[DIRECTION.LEFT_DOWN]	: {x: -20, y: -120},
		[DIRECTION.LEFT_UP]		: {x: -25, y: -120},
		[DIRECTION.RIGHT_DOWN]	: {x: -2, y: -120},
		[DIRECTION.RIGHT_UP]	: {x: 5, y: -120}
	},
	[ENEMIES.MummyGodGreen] : {
		[DIRECTION.LEFT_DOWN]	: {x: -30, y: -93},
		[DIRECTION.LEFT_UP]		: {x: -22, y: -90},
		[DIRECTION.RIGHT_DOWN]	: {x: 7, y: -93},
		[DIRECTION.RIGHT_UP]	: {x: 0, y: -90}
	},
	[ENEMIES.MummySmallWhite] : {
		[DIRECTION.LEFT_DOWN]	: {x: -20, y: -93},
		[DIRECTION.LEFT_UP]		: {x: -22, y: -90},
		[DIRECTION.RIGHT_DOWN]	: {x: -7, y: -95},
		[DIRECTION.RIGHT_UP]	: {x: -15, y: -95}
	}
}

const VIEW_SCALE = 
{
	[ENEMIES.Anubis] : 1.15 * 1.25,
	[ENEMIES.Osiris] : 1.15 * 1.25,
	[ENEMIES.Thoth] : 1.15 * 1.25,
	[ENEMIES.MummyGodGreen] : 0.6,
	[ENEMIES.MummySmallWhite] : 0.5
}

class ElectricityBodyBackAnimation extends Sprite
{
	
	startAnimation(targetEnemy)
	{
		this._targetEnemy = targetEnemy;

		this._initAnimationScale();
		this._startAnimation();
	}

	pauseAnimationCycling()
	{
		this._clearArcsTimer();
		this._clearSmokesTimer();
	}

	resumeAnimationCycling()
	{
		this._startAnimation();
	}

	//INIT...
	constructor()
	{
		super();

		this._smokesTimer = null;
		this._arcsTimer = null;
		this._targetEnemy = null;
	}

	_initAnimationScale()
	{
		let targetEnemy = this._targetEnemy;
		let enemyName = targetEnemy.name;

		let animScale = VIEW_SCALE[enemyName];

		this.scale.set(animScale);
	}
	//...INIT

	//ANIMATION...
	_startAnimation()
	{
		APP.profilingController.info.isVfxProfileValueMediumOrGreater && this._startSmokesAnimations();
		this._startArcsTimer(10);
	}

	//SMOKES...
	_startSmokesAnimations()
	{
		let smoke;
		smoke = this._addSmokesAnimation(0, -70);
		smoke.startAnimation();

		smoke = this._addSmokesAnimation(0, -120);
		smoke.startAnimation();

		this._startSmokesTimer();
	}

	_startSmokesTimer()
	{
		this._smokesTimer = new Timer(this._onSmokesTimerCompleted.bind(this), 21*2*16.7);
	}

	_clearSmokesTimer()
	{
		this._smokesTimer && this._smokesTimer.destructor();
		this._smokesTimer = null;
	}

	_onSmokesTimerCompleted()
	{
		this._clearSmokesTimer();

		this._startSmokesAnimations();
	}

	_addSmokesAnimation(aX_num, aY_num)
	{
		let smokesAnimation = this.addChild(new ElectricitySmokeAnimation(PIXI.BLEND_MODES.SCREEN));
		smokesAnimation.position.set(aX_num, aY_num);

		return smokesAnimation;
	}
	//...SMOKES

	//ARCS...
	_startArcsAnimations()
	{
		let arcsAnimation = this.addChild(new ElectricityBodyBackArcsAnimation());
		let arcsPos = this._calcArcsPosition();
		arcsAnimation.position.set(arcsPos.x, arcsPos.y);
		arcsAnimation.startAnimation();

		this._startArcsTimer();
	}

	_calcArcsPosition()
	{
		let pos = new PIXI.Point(0, 0);

		let enemyName = this._targetEnemy.name;
		let enemyDirection = this._targetEnemy.direction;

		let arcsPos = ARCS_VIEW_POSITION[enemyName][enemyDirection];
		pos.x = arcsPos.x;
		pos.y = arcsPos.y;
		
		return pos;
	}

	_startArcsTimer(optDelayFramesAmount)
	{
		let delayFramesAmount = 8;
		if (!isNaN(optDelayFramesAmount))
		{
			delayFramesAmount = optDelayFramesAmount;
		}
		this._arcsTimer = new Timer(this._onArcsTimerCompleted.bind(this), delayFramesAmount*2*16.7);
	}

	_clearArcsTimer()
	{
		this._arcsTimer && this._arcsTimer.destructor();
		this._arcsTimer = null;
	}

	_onArcsTimerCompleted()
	{
		this._clearArcsTimer();

		this._startArcsAnimations();
	}
	//...ARCS

	//...ANIMATION

	destroy()
	{
		this._clearSmokesTimer();
		this._clearArcsTimer();

		this._targetEnemy = null;

		super.destroy();
	}
}

export default ElectricityBodyBackAnimation;