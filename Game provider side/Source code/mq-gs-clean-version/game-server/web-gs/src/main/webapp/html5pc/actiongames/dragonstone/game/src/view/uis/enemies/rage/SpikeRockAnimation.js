import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sequence from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import * as Easing from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import AtlasConfig from '../../../../config/AtlasConfig';
import AtlasSprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import { FRAME_RATE } from '../../../../../../shared/src/CommonConstants';
import StonesAnimation from './StonesAnimation';
import Timer from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';

let SpikeSmoke = {
	textures: {
		smoke: null
	}
};

SpikeSmoke.setTexture = function (name, imageNames, configs, path) {
	if (!SpikeSmoke.textures[name]) {
		SpikeSmoke.textures[name] = [];

		if (!Array.isArray(imageNames)) imageNames = [imageNames];
		if (!Array.isArray(configs)) configs = [configs];

		let assets = [];
		imageNames.forEach(function (item) { assets.push(APP.library.getAsset(item)) });

		SpikeSmoke.textures[name] = AtlasSprite.getFrames(assets, configs, path);
		SpikeSmoke.textures[name].sort(function (a, b) { if (a._atlasName > b._atlasName) return 1; else return -1 });
	}
};

SpikeSmoke.getSmokeTextures = function () {
	SpikeSmoke.setTexture('smoke', 'enemies/rage/spike_smoke', AtlasConfig.SpikeSmoke, '');
	return this.textures.smoke;
};

const STONES_START_ONE_TIME = 4;
const STONES_PARAMS = [
	{ x: 0, y: 0, scaleX: 0.6, scaleY: 0.6 },
	{ x: 0, y: -5, scaleX: -0.6, scaleY: 0.6 },
	{ x: 0, y: 5, scaleX: -0.6, scaleY: 0.6 },
	{ x: 0, y: 10, scaleX: 0.95, scaleY: 0.95 },
	{ x: 0, y: 0, scaleX: 0.6, scaleY: 0.6 },
	{ x: 0, y: 5, scaleX: -0.6, scaleY: 0.6 },
	{ x: 0, y: -5, scaleX: 0.6, scaleY: 0.6 },
	{ x: 0, y: 0, scaleX: -0.6, scaleY: 0.6 }
];

const CRACK_PARAMS = [
	{ x: 2, y: 7, scaleX: 0.95, scaleY: 0.95, rot: 110 },
	{ x: -7, y: 0, scaleX: 0.33, scaleY: 0.33, rot: -46 },
	{ x: 17, y: 7, scaleX: 0.45, scaleY: 0.45, rot: 122 },
	{ x: -1, y: 7, scaleX: 0.73, scaleY: 0.63, rot: -170 }
];

class SpikeRockAnimation extends Sprite
{
	constructor(isTripleOpt)
	{
		super();

		this._isTriple_bl = isTripleOpt || false;
		this._fxContainer = null;

		this._cracks = [];

		this._leftSpike = null;
		this._centralSpike = null;
		this._rightSpike = null;

		this._stones = [];

		this._smoke = null;
		this._additionalSmoke = null;
		this._stonesTimer = null;

		this._initFxContainer();
	}

	startAnimation()
	{
		this._startSpikeAnimation();
		this._startStonesAnimation();
		this._startCracksAnimatioin();
		this._smoke.play();
	}

	//ANIMATION...
	//SPIKES...
	_startSpikeAnimation()
	{
		Sequence.start(this._centralSpike, [
			{
				tweens: [{ prop: "position.y", to: 0 }],
				duration: 4 * FRAME_RATE,
				ease: Easing.sine.easeIn
			},
			{
				tweens: [],
				duration: 23 * FRAME_RATE,
			},
			{
				tweens: [{ prop: "position.y", to: 150 }],
				duration: 25 * FRAME_RATE,
				ease: Easing.sine.easeInOut
			}
		]);

		Sequence.start(this._rightSpike, [
			{
				tweens: [],
				duration: 2 * FRAME_RATE,
			},
			{
				tweens: [
							{ prop: "position.y", to: 9.5 },
							{ prop: "position.x", to: 12 }
						],
				duration: 6 * FRAME_RATE,
				ease: Easing.sine.easeIn
			},
			{
				tweens: [],
				duration: 22 * FRAME_RATE,
				onfinish: () => {
					this._additionalSmoke.play();
					this._startAdditionalStonesAnimation();
				}
			},
			{
				tweens: [
							{ prop: "position.y", to: 150.5 },
							{ prop: "position.x", to: -16.5 }
						],
				duration: 27 * FRAME_RATE,
				ease: Easing.sine.easeInOut
			}
		]);

		if (this._isTriple_bl)
		{
			Sequence.start(this._leftSpike, [
				{
					tweens: [],
					duration: 3 * FRAME_RATE,
				},
				{
					tweens: [
								{ prop: "position.y", to: 22.5 },
								{ prop: "position.x", to: -16 }
							],
					duration: 6 * FRAME_RATE,
					ease: Easing.sine.easeIn
				},
				{
					tweens: [],
					duration: 21 * FRAME_RATE	
				},
				{
					tweens: [
								{ prop: "position.y", to: 166.5 },
								{ prop: "position.x", to: 7 }
							],
					duration: 27 * FRAME_RATE,
					ease: Easing.sine.easeInOut
				}
			]);
		}
	}

	//...SPIKES

	//CRACKS...
	_startCracksAnimatioin()
	{
		let secuence = [
			{
				tweens: [],
				duration: 59 * FRAME_RATE,
			},
			{
				tweens: [{ prop: "alpha", to: 0 }],
				duration: 6 * FRAME_RATE
			}
		];

		for (let i = 0; i < CRACK_PARAMS.length; i++)
		{
			Sequence.start(this._cracks[i], secuence);
		}
	}
	//...CRACKS

	//STONES...
	_startStonesAnimation()
	{
		for (let i = 0; i < STONES_START_ONE_TIME; i++)
		{
			this._stones[i].startAnimation();
		}
	}

	_startAdditionalStonesAnimation()
	{
		let i = STONES_START_ONE_TIME;

		this._stonesTimer = new Timer(() => {
			if (i >= STONES_PARAMS.length)
			{
				this._stonesTimer.destructor();
			}
			else 
			{
				this._stones[i].startAnimation();
				i++;
			}
		}, 6 * FRAME_RATE, true);
	}
	//...STONES
	//...ANIMATION

	//ASSETS...
	_initFxContainer()
	{
		let container = this._fxContainer = this.addChild(new Sprite());

		for (let i = 0; i < CRACK_PARAMS.length; i++)
		{
			let crack = this._cracks[i] = container.addChild(APP.library.getSprite("enemies/rage/crack"));
			crack.scale.x = CRACK_PARAMS[i].scaleX;
			crack.scale.y = CRACK_PARAMS[i].scaleY;
			crack.rotation = CRACK_PARAMS[i].rot * Math.PI / 180;
			crack.position.x = CRACK_PARAMS[i].x;
			crack.position.y = CRACK_PARAMS[i].y;
			crack.blendMode = PIXI.BLEND_MODES.MULTIPLY;
		}

		let sc = this._spikesContainer = container.addChild(new Sprite());
		//spikes
		if(this._isTriple_bl)
		{
			let spike = this._centralSpike = sc.addChild(APP.library.getSprite("enemies/rage/spike"));
			spike.scale.set(1);
			spike.position.x = 0;
			spike.position.y = 150;
	
			spike = this._leftSpike = sc.addChild(APP.library.getSprite("enemies/rage/spike"));
			spike.scale.set(0.65);
			spike.rotation = -6 * Math.PI / 180;
			spike.position.x = 7;
			spike.position.y = 166.5;
	
			spike = this._rightSpike = sc.addChild(APP.library.getSprite("enemies/rage/spike"));
			spike.scale.set(0.60);
			spike.rotation = 6 * Math.PI / 180;
			spike.position.x = -16.5;
			spike.position.y = 150.5;
		}
		else
		{
			let spike = this._centralSpike = sc.addChild(APP.library.getSprite("enemies/rage/spike"));
			spike.scale.x = 1.3;
			spike.scale.y = 0.57;
			spike.position.x = 0;
			spike.position.y = 150;

			spike = this._rightSpike = sc.addChild(APP.library.getSprite("enemies/rage/spike"));
			spike.scale.x = 0.76;
			spike.scale.y = 0.46;
			spike.rotation = 6 * Math.PI / 180;
			spike.position.x = -6.5;
			spike.position.y = 150.5;
		}

		
		let mask = this._Mask = this._spikesContainer.addChild(new Sprite);
		let maskGraphics = mask.addChild(new PIXI.Graphics());
		maskGraphics.beginFill(0xffffff).drawRect(-25, -50, 50, 55).endFill();
		mask.scale.set(1);
		this._spikesContainer.mask = maskGraphics;

		//stones
		for (let i = 0; i < STONES_PARAMS.length; i++)
		{
			this._stones[i] = container.addChild(new StonesAnimation())
			this._stones[i].scale.x = STONES_PARAMS[i].scaleX;
			this._stones[i].scale.y = STONES_PARAMS[i].scaleX;
			this._stones[i].position.x = STONES_PARAMS[i].x;
			this._stones[i].position.y = STONES_PARAMS[i].y;
		}

		//smokes
		let smoke = this._smoke = container.addChild(new Sprite());
		smoke.textures = SpikeSmoke.getSmokeTextures();
		smoke.blendMode = PIXI.BLEND_MODES.ADD;
		smoke.scale.x = 0.4;
		smoke.scale.y = 1.09;
		smoke.position.y = -0;
		smoke.loop = false;
		smoke.animationSpeed = 0.5;

		smoke = this._additionalSmoke = container.addChild(new Sprite());
		smoke.textures = SpikeSmoke.getSmokeTextures();
		smoke.blendMode = PIXI.BLEND_MODES.ADD;
		smoke.rotation = 261 * Math.PI / 180;
		smoke.scale.x = 0.25;
		smoke.scale.y = 0.68;
		smoke.position.y = 0;
		smoke.loop = false;
		smoke.animationSpeed = 0.5;
	}
	//...ASSETS

	destroy()
	{
		this._leftSpike && Sequence.destroy(Sequence.findByTarget(this._leftSpike));
		this._rightSpike && Sequence.destroy(Sequence.findByTarget(this._rightSpike));
		this._centralSpike && Sequence.destroy(Sequence.findByTarget(this._centralSpike));

		this._stonesTimer && this._stonesTimer.destructor();

		this._isTriple_bl = false;
		this._fxContainer = null;

		this._cracks = null;

		this._leftSpike = null;
		this._centralSpike = null;
		this._rightSpike = null;

		this._stones = null;

		this._smoke = null;
		this._additionalSmoke = null;


		super.destroy();
	}
}

export default SpikeRockAnimation;