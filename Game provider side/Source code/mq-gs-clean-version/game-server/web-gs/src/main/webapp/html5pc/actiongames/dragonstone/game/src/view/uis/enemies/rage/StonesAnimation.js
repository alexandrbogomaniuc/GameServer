import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sequence from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import * as Easing from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import AtlasConfig from '../../../../config/AtlasConfig';
import AtlasSprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import { FRAME_RATE } from '../../../../../../shared/src/CommonConstants';

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

class StonesAnimation extends Sprite
{
	constructor()
	{
		super();

		this._fxContainer = null;

		this._singleSmoke = null;
		this._smoke = null;

		this._stoneBig = null;
		this._stoneMedium = null;
		this._stoneSmall = null;

		this._initFxContainer();
	}

	startAnimation()
	{
		this._startSmokeAnimation();
		this._startStonesAnimation();
		this._smoke.play();
	}

	_startSmokeAnimation()
	{
		Sequence.start(this._singleSmoke, [
			{
				tweens: [
					{ prop: "alpha", to: 0.5 },
					{ prop: "scale.x", to: 0.36, duration: 26 * FRAME_RATE },
					{ prop: "scale.y", to: 0.36, duration: 26 * FRAME_RATE },
					{ prop: "rotation", to: -Math.PI / 2, duration: 90 * FRAME_RATE }
				],
				duration: 4 * FRAME_RATE,
				ease: Easing.sine.easeIn
			},
			{
				tweens: [{ prop: "alpha", to: 0 }],
				duration: 22 * FRAME_RATE,
				ease: Easing.sine.easeOut
			}
		]);
	}

	_startStonesAnimation()
	{
		let sequenceBig = [
			{
				tweens: [
					{ prop: "position.x", to: 35.3 },
					{ prop: "position.y", to: -88.8 },
					{ prop: "rotation", to: -269 * Math.PI / 180, duration: 17 * FRAME_RATE }
				],
				duration: 9 * FRAME_RATE
			},
			{
				tweens: [
					{ prop: "position.x", to: 74.9 },
					{ prop: "position.y", to: -70.8 }
				],
				duration: 4 * FRAME_RATE
			},
			{
				tweens: [
					{ prop: "position.x", to: 89.5 },
					{ prop: "position.y", to: -39.3 }
				],
				duration: 2 * FRAME_RATE
			},
			{
				tweens: [
					{ prop: "position.x", to: 106.5 },
					{ prop: "position.y", to: -8.3 }
				],
				duration: 2 * FRAME_RATE
			},
			{
				tweens: [
					{ prop: "position.x", to: 107.3 },
					{ prop: "position.y", to: -10 },
					{ prop: "rotation", to: 91 * Math.PI / 180, duration: 11 * FRAME_RATE }
				],
				duration: FRAME_RATE
			},
			{
				tweens: [
					{ prop: "position.x", to: 110.3 },
					{ prop: "position.y", to: -15.3 }
				],
				duration: 3 * FRAME_RATE
			},
			{
				tweens: [
					{ prop: "position.x", to: 115 },
					{ prop: "position.y", to: -15 }
				],
				duration: 3 * FRAME_RATE
			},
			{
				tweens: [
					{ prop: "position.x", to: 120.4 },
					{ prop: "position.y", to: -5.5 }
				],
				duration: 3 * FRAME_RATE
			},
			{
				tweens: [
					{ prop: "position.x", to: 123.5 },
					{ prop: "position.y", to: -5 }
				],
				duration: 4 * FRAME_RATE
			},
			{
				tweens: [],
				duration: 24 * FRAME_RATE
			},
			{
				tweens: [{ prop: "alpha", to: 0 }],
				duration: 8 * FRAME_RATE
			}
		];

		let sequenceMedium = [
			{
				tweens: [],
				duration: FRAME_RATE
			},
			{
				tweens: [
					{ prop: "position.x", to: 41.8 },
					{ prop: "position.y", to: -97.3 },
					{ prop: "rotation", to: -269 * Math.PI / 180, duration: 17 * FRAME_RATE }
				],
				duration: 9 * FRAME_RATE
			},
			{
				tweens: [
					{ prop: "position.x", to: 92 },
					{ prop: "position.y", to: -81.8 }
				],
				duration: 6 * FRAME_RATE
			},
			{
				tweens: [
					{ prop: "position.x", to: 109.5 },
					{ prop: "position.y", to: -53.5 },
					{ prop: "rotation", to: 91 * Math.PI / 180, duration: 11 * FRAME_RATE }
				],
				duration: 3 * FRAME_RATE
			},
			{
				tweens: [
					{ prop: "position.x", to: 124 },
					{ prop: "position.y", to: -20.8 }
				],
				duration: 3 * FRAME_RATE
			},
			{
				tweens: [
					{ prop: "position.x", to: 124.8 },
					{ prop: "position.y", to: -22.5 }
				],
				duration: 2 * FRAME_RATE
			},
			{
				tweens: [
					{ prop: "position.x", to: 127.8 },
					{ prop: "position.y", to: -27.8 }
				],
				duration: 3 * FRAME_RATE
			},
			{
				tweens: [
					{ prop: "position.x", to: 132.5 },
					{ prop: "position.y", to: -27.5 }
				],
				duration: 3 * FRAME_RATE
			},
			{
				tweens: [
					{ prop: "position.x", to: 138.3 },
					{ prop: "position.y", to: -18 }
				],
				duration: 3 * FRAME_RATE
			},
			{
				tweens: [
					{ prop: "position.x", to: 141 },
					{ prop: "position.y", to: -17.5 }
				],
				duration: 4 * FRAME_RATE
			},
			{
				tweens: [],
				duration: 18 * FRAME_RATE
			},
			{
				tweens: [{ prop: "alpha", to: 0 }],
				duration: 8 * FRAME_RATE
			}
		];

		let sequenceSmall = [
			{
				tweens: [],
				duration: FRAME_RATE
			},
			{
				tweens: [
					{ prop: "position.x", to: -19.2 },
					{ prop: "position.y", to: -81.3 },
					{ prop: "rotation", to: -269 * Math.PI / 180, duration: 17 * FRAME_RATE }
				],
				duration: 9 * FRAME_RATE
			},
			{
				tweens: [
					{ prop: "position.x", to: -62.5 },
					{ prop: "position.y", to: -63.1 }
				],
				duration: 6 * FRAME_RATE
			},
			{
				tweens: [
					{ prop: "position.x", to: -68.8 },
					{ prop: "position.y", to: -49.1 },
					{ prop: "rotation", to: 91 * Math.PI / 180, duration: 11 * FRAME_RATE }
				],
				duration: 2 * FRAME_RATE
			},
			{
				tweens: [
					{ prop: "position.x", to: -81 },
					{ prop: "position.y", to: -20.8 }
				],
				duration: 4 * FRAME_RATE
			},
			{
				tweens: [
					{ prop: "position.x", to: -87.4 },
					{ prop: "position.y", to: -22.6 }
				],
				duration: 2 * FRAME_RATE
			},
			{
				tweens: [
					{ prop: "position.x", to: -93.5 },
					{ prop: "position.y", to: -27.8 }
				],
				duration: 3 * FRAME_RATE
			},
			{
				tweens: [
					{ prop: "position.x", to: -98.3 },
					{ prop: "position.y", to: -27.6 }
				],
				duration: 3 * FRAME_RATE
			},
			{
				tweens: [
					{ prop: "position.x", to: 104 },
					{ prop: "position.y", to: -18.1 }
				],
				duration: 3 * FRAME_RATE
			},
			{
				tweens: [
					{ prop: "position.x", to: 106.8 },
					{ prop: "position.y", to: -17.6 }
				],
				duration: 4 * FRAME_RATE
			},
			{
				tweens: [],
				duration: 18 * FRAME_RATE
			},
			{
				tweens: [{ prop: "alpha", to: 0 }],
				duration: 8 * FRAME_RATE
			}
		];

		Sequence.start(this._stoneBig, sequenceBig);
		Sequence.start(this._stoneMedium, sequenceMedium);
		Sequence.start(this._stoneSmall, sequenceSmall);
	}

	_initFxContainer()
	{
		let container = this._fxContainer = this.addChild(new Sprite());

		let stone = this._stoneBig = container.addChild(APP.library.getSprite("enemies/rage/stone"));
		stone.scale.x = 0.13;
		stone.scale.y = 0.33;
		stone.rotation = -33 * Math.PI / 180;

		stone = this._stoneMedium = container.addChild(APP.library.getSprite("enemies/rage/stone"));
		stone.scale.x = 0.04;
		stone.scale.y = 0.17;
		stone.rotation = -33 * Math.PI / 180;

		stone = this._stoneSmall = container.addChild(APP.library.getSprite("enemies/rage/stone"));
		stone.scale.x = 0.04;
		stone.scale.y = 0.07;
		stone.rotation = -33 * Math.PI / 180;

		let singleSmoke = this._singleSmoke = container.addChild(APP.library.getSprite("enemies/rage/smoke"));
		singleSmoke.blendMode = PIXI.BLEND_MODES.ADD;
		singleSmoke.scale.set(0.19);
		singleSmoke.rotation = -2 * Math.PI / 180;
		singleSmoke.alpha = 0;

		let smoke = this._smoke = container.addChild(new Sprite());
		smoke.textures = SpikeSmoke.getSmokeTextures();
		smoke.blendMode = PIXI.BLEND_MODES.ADD;
		smoke.scale = 0.45;
		smoke.rotation = -261 * Math.PI / 180;
		smoke.loop = false;
		smoke.alpha = 0.6;
		smoke.animationSpeed = 0.5;
	}

	destroy()
	{
		this._stoneBig && Sequence.destroy(Sequence.findByTarget(this._stoneBig));
		this._stoneMedium && Sequence.destroy(Sequence.findByTarget(this._stoneMedium));
		this._stoneSmall && Sequence.destroy(Sequence.findByTarget(this._stoneSmall));
		this._singleSmoke && Sequence.destroy(Sequence.findByTarget(this._singleSmoke));

		this._fxContainer = null;
		this._singleSmoke = null;
		this._smoke = null;
		this._stoneBig = null;
		this._stoneMedium = null;
		this._stoneSmall = null;

		super.destroy();
	}
}

export default StonesAnimation;