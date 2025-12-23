import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sequence from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import * as Easing from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { FRAME_RATE } from '../../../../../../shared/src/CommonConstants';
import SpikeRockAnimation from './SpikeRockAnimation';
import CrackAnimation from './CrackAnimation';
import Timer from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';

const SPIKES_APPEAR_BY_TIME = [
	{ time: 1,	spikesIndexes: [6, 8, 19, 21, 24] },
	{ time: 3,	spikesIndexes: [7, 20, 22] },
	{ time: 4,	spikesIndexes: [23] },
	{ time: 8,	spikesIndexes: [3, 5, 14, 16, 18, 25] },
	{ time: 10, spikesIndexes: [4, 15, 17] },
	{ time: 13, spikesIndexes: [0, 2, 9, 11, 13, 26] },
	{ time: 15, spikesIndexes: [1, 10, 12] }
];

const SPIKES_PARAMS = [
	{ x: -85,	y: 25, triple: true },
	{ x: 90,	y: 95 },
	{ x: 207.5,	y: 120, triple: true },
	{ x: 35,	y: 735, triple: true },
	{ x: 172.5,	y: 65 },
	{ x: 235,	y: 45, triple: true },
	{ x: 125,	y: 7.5 },
	{ x: 205,	y: 7.5, triple: true },
	{ x: 275,	y: -22 },
	{ x: -235,	y: -25, triple: true },
	{ x: 260,	y: 92 },
	{ x: 195,	y: -145, triple: true },
	{ x: 42,	y: -175 },
	{ x: -145,	y: -142, triple: true },
	{ x: -150,	y: 40, triple: true },
	{ x: 215,	y: 45 },
	{ x: 10,	y: -95, triple: true },
	{ x: -30,	y: -105 },
	{ x: -125,	y: -50, triple: true },
	{ x: -60,	y: 60, triple: true },
	{ x: 170,	y: 0 },
	{ x: 150,	y: -55, triple: true },
	{ x: 10,	y: -95, triple: true },
	{ x: -45,	y: -65 },
	{ x: -85,	y: 2, triple: true },
	{ x: 200,	y: -40, triple: true },
	{ x: 300,	y: -10, triple: true }
];

const STONES_PARAMS = [
	{ scaleX: 1, scaleY: 1.76, pointX1: 353,  pointY1: -120, pointX2: 353,  pointY2: 348 },
	{ scaleX: 0.7, scaleY: 1.22, pointX1: -219,  pointY1: -94, pointX2: -616,  pointY2: 348 },
	{ scaleX: -0.6, scaleY: 0.88, pointX1: -41,  pointY1: -30, pointX2: -310,  pointY2: 348 },
	{ scaleX: -0.41, scaleY: 0.60, pointX1: -92,  pointY1: -75, pointX2: -179,  pointY2: -120 }
];

const DELAY_START_ANIMATION = 1800;

class RageAreaOfEffectAnimation extends Sprite
{
	static get EVENT_ON_ANIMATION_ENDED() { return "onAnimationEnded"; }

	constructor(enemyPosition)
	{
		super();

		this._fxContainer = null;

		this._centerCrack = null;
		this._crack = null;
		this._spikes = [];
		this._circles = [];
		this._stones = [];

		this._spikesTimers = [];

		this._enemyPosition = enemyPosition;
		this._initFxContainer();
		this._initTimer();

		this._fAnimationStartTimer_tmr = null;
	}

	_initTimer()
	{
		this._fRageComplete_t && this._fRageComplete_t.destructor();
		this._fRageComplete_t = new Timer(() => this._onAnimationEnded(), 150*FRAME_RATE);
		this._fRageComplete_t.start();
	}

	startAnimation()
	{
		this._fAnimationStartTimer_tmr = new Timer(() => this._onTimeToStartAnimation(), DELAY_START_ANIMATION);
	}

	_onTimeToStartAnimation()
	{
		this._startCenterCrackAnimation();
		this._startSpikesRocksAnimation();
		this._crack._startCrackAnimation();
		this._startCirclesAnimation();
		this._startStonesAnimation();
	}

	_startSpikesRocksAnimation()
	{
		for (let i = 0; i < SPIKES_APPEAR_BY_TIME.length; i++)
		{
			this._spikesTimers[i] && this._spikesTimers[i].destructor();
			this._spikesTimers[i] = new Timer(() => {
				this._startSpikesByTime(SPIKES_APPEAR_BY_TIME[i].spikesIndexes)
			}, SPIKES_APPEAR_BY_TIME[i].time * FRAME_RATE);
		}
	}

	_startSpikesByTime(spikesIndexes)
	{
		for (let i = 0; i < spikesIndexes.length; i++)
		{
			this._spikes[spikesIndexes[i]].startAnimation();
		}
	}

	_startCenterCrackAnimation()
	{
		Sequence.start(this._centerCrack, [
			{
				tweens: [],
				duration: 25 * FRAME_RATE
			},
			{
				tweens: [{ prop: "alpha", to: 0 }],
				duration: 6 * FRAME_RATE
			}
		]);
	}

	_startCirclesAnimation()
	{
		Sequence.start(this._circles[0], [
			{
				tweens: [
							{ prop: "scale.x", to: 1.3 },
							{ prop: "scale.y", to: 1.092 }
						],
				ease: Easing.linear.easeInOut,
				duration: 15 * FRAME_RATE
			}
		]);

		Sequence.start(this._circles[0], [
			{
				tweens: [],
				duration: 2 * FRAME_RATE
			},
			{
				tweens: [{ prop: "alpha", to: 0 }],
				ease: Easing.linear.easeInOut,
				duration: 12 * FRAME_RATE
			}
		]);

		Sequence.start(this._circles[1], [
			{
				tweens: [],
				duration: 1 * FRAME_RATE
			},
			{
				tweens: [
							{ prop: "scale.x", to: 1.3 },
							{ prop: "scale.y", to: 1.092 }
						],
				ease: Easing.linear.easeInOut,
				duration: 15 * FRAME_RATE
			}
		]);

		Sequence.start(this._circles[1], [
			{
				tweens: [],
				duration: 3 * FRAME_RATE
			},
			{
				tweens: [{ prop: "alpha", to: 0 }],
				ease: Easing.linear.easeInOut,
				duration: 12 * FRAME_RATE
			}
		]);

		Sequence.start(this._circles[2], [
			{
				tweens: [],
				duration: 1 * FRAME_RATE
			},
			{
				tweens: [
							{ prop: "scale.x", to: 1.61 },
							{ prop: "scale.y", to: 1.61 }
						],
				ease: Easing.linear.easeInOut,
				duration: 25 * FRAME_RATE
			}
		]);

		Sequence.start(this._circles[2], [
			{
				tweens: [],
				duration: 3 * FRAME_RATE
			},
			{
				tweens: [{ prop: "alpha", to: 0 }],
				duration: 12 * FRAME_RATE
			}
		]);

		Sequence.start(this._circles[3], [
			{
				tweens: [],
				duration: 2 * FRAME_RATE
			},
			{
				tweens: [
							{ prop: "scale.x", to: 1.61 },
							{ prop: "scale.y", to: 1.61 }
						],
				ease: Easing.linear.easeInOut,
				duration: 26 * FRAME_RATE
			}
		]);

		Sequence.start(this._circles[3], [
			{
				tweens: [],
				duration: 4 * FRAME_RATE
			},
			{
				tweens: [{ prop: "alpha", to: 0 }],
				duration: 14 * FRAME_RATE
			}
		]);
	}

	_startStonesAnimation()
	{
		for (let i = 0; i < STONES_PARAMS.length; i++)
		{
			Sequence.start(this._stones[i], [
				{
					tweens: [
								{ prop: "x", to: STONES_PARAMS[i].pointX1 },
								{ prop: "y", to: STONES_PARAMS[i].pointY1 },
								{ prop: "rotation", to: 532*Math.PI/180, duration: 38 * FRAME_RATE}
							],
					ease: Easing.linear.easeInOut,
					duration: 7 * FRAME_RATE
				},
				{
					tweens: [
								{ prop: "x", to: STONES_PARAMS[i].pointX2 },
								{ prop: "y", to: STONES_PARAMS[i].pointY2 }
							],
					ease: Easing.linear.easeInOut,
					duration: 12 * FRAME_RATE
				},
				{
					tweens: [],
					duration: 35 * FRAME_RATE
				},
				{
					tweens: [{ prop: "alpha", to: 0 }],
					ease: Easing.linear.easeInOut,
					duration: 8 * FRAME_RATE
				}
			]);
		}
	}

	_initFxContainer()
	{
		let container = this._fxContainer = this.addChild(new Sprite());
		
		let centerCrack = this._centerCrack = container.addChild(APP.library.getSprite("enemies/rage/center_crack"));
		centerCrack.rotation = -170*Math.PI/180;
		centerCrack.scale.x = 1.24;
		centerCrack.scale.y = 1.16;
		centerCrack.alpha = 0.9;

		this._crack = container.addChild(new CrackAnimation());
		
		for (let i = 0; i < SPIKES_PARAMS.length; i++)
		{
			let spike = this._spikes[i] = container.addChild(new SpikeRockAnimation(SPIKES_PARAMS[i].triple));
			spike.position.x = SPIKES_PARAMS[i].x;
			spike.position.y = SPIKES_PARAMS[i].y;
		}
		
		for (let i = 0; i < 4; i++)
		{
			let circle;
			if (i < 2)
			{
				circle = this._circles[i] = container.addChild(APP.library.getSprite("enemies/rage/circle"));
				circle.x = 0;
				circle.y = 0;
				circle.rotation = 180*Math.PI/180;
				circle.blendMode = PIXI.BLEND_MODES.ADD;
			}
			else
			{
				circle = this._circles[i] = container.addChild(APP.library.getSprite("enemies/rage/circle_red"));
				circle.zIndex = this.zIndex - 1;
				circle.x = this._enemyPosition.x;
				circle.y = this._enemyPosition.y;
				circle.blendMode = PIXI.BLEND_MODES.SCREEN;
			}
			circle.scale.x = 0;
			circle.scale.y = 0;
		}

		for (let i = 0; i < STONES_PARAMS.length; i++)
		{
			let stone = this._stones[i] = container.addChild(APP.library.getSprite("enemies/rage/stone_big"));
			stone.x = 0;
			stone.y = 0;
			stone.rotation = 172*Math.PI/180;
			stone.scale.x = STONES_PARAMS[i].scaleX;
			stone.scale.y = STONES_PARAMS[i].scaleY;
		}
	}

	_onAnimationEnded()
	{
		this.emit(RageAreaOfEffectAnimation.EVENT_ON_ANIMATION_ENDED);
	}

	destroy()
	{
		this._fxContainer = null;

		this._crack = null;
		this._spikes = null;
		this._enemyPosition = null;

		this._fRageComplete_t && this._fRageComplete_t.destructor();
		this._fRageComplete_t = null;

		this._fAnimationStartTimer_tmr && this._fAnimationStartTimer_tmr.destructor();
		this._fAnimationStartTimer_tmr = null;
		
		for (let i = 0; i < this._stones.length; i++)
		{
			this._stones[i] && Sequence.destroy(Sequence.findByTarget(this._stones[i]));
		}
		this._stones = null;
		
		for (let i = 0; i < 4; i++)
		{
			this._circles[i] && Sequence.destroy(Sequence.findByTarget(this._circles[i]));
		}
		this._circles = null;

		this._centerCrack && Sequence.destroy(Sequence.findByTarget(this._centerCrack));
		this._centerCrack = null;
		
		
		for (let i = 0; i < SPIKES_APPEAR_BY_TIME.length; i++)
		{
			this._spikesTimers[i] && this._spikesTimers[i].destructor();
		}
		this._spikesTimers = null;

		super.destroy();
	}
}

export default RageAreaOfEffectAnimation;