import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sequence from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { FRAME_RATE } from '../../../../../../shared/src/CommonConstants';

const CRACKS_PARAMS = [
	{ x: -27, y: -42, scaleX: 0.84, scaleY: 1.2, rotation: 250 },
	{ x: -52, y: -23, scaleX: -1.08, scaleY: 1.2, rotation: 16 },
	{ x: -12, y: 46, scaleX: -1.08, scaleY: 1.2, rotation: 271 },
	{ x: -8, y: -12, scaleX: 0.9, scaleY: 0.72, rotation: 355 },
	{ x: -12, y: 6, scaleX: 1.5, scaleY: 1.2, rotation: 311 },
	{ x: -70, y: 35, scaleX: 1.44, scaleY: 1.2, rotation: 332 },
	{ x: 53, y: -33, scaleX: 0.93, scaleY: 1.2, rotation: 337 },
	{ x: -48, y: 1, scaleX: 0.93, scaleY: 1.2, rotation: 170 },
	{ x: 50, y: 10, scaleX: 0.93, scaleY: 1.2, rotation: 16 }
];

class CrackAnimation extends Sprite
{
	constructor()
	{
		super();

		this._fxContainer = null;

		this._cracks = [];
		this._showMask = null;

		this._initFxContainer();
	}

	_startCrackAnimation()
	{
		let showMask = this._showMask = this._fxContainer.addChild(new Sprite);
		
		let mask = new PIXI.Graphics();

		mask.beginFill(0xffffff)
		.drawPolygon([	-100,	-100,
						0,		-120,
						100,	-100,
						120,	0,
						100,	100,
						0,		120,
						-100,	100,
						-120,	0 ])
		.drawPolygon([ -30, -30,
						0,	-33,
						30, -30,
						33,	0,
						30, 30,
						0,	33,
						-30, 30,
						-33, 0])
		.beginHole();

		mask.filters = [new PIXI.filters.BlurFilter(10)];
		showMask.addChild(mask);
		showMask.scale.set(0.01);
		this._fxContainer.mask = mask;
		
		Sequence.start(this._showMask, [
			{
				tweens: [
							{ prop: "scale.x", to: 4 },
							{ prop: "scale.y", to: 3 }
						],
				duration: 12 * FRAME_RATE
			}
		]);

		Sequence.start(this._fxContainer, [
			{
				tweens: [],
				duration: 90 * FRAME_RATE,
			},
			{
				tweens: [{ prop: "alpha", to: 0 }],
				duration: 8 * FRAME_RATE
			}
		]);
	}

	_initFxContainer()
	{
		let container = this._fxContainer = this.addChild(new Sprite());

		for (let i = 0; i < CRACKS_PARAMS.length; i++)
		{
			let crack = this._cracks[i] = container.addChild(APP.library.getSprite("enemies/rage/light"));
			crack.scale.x = CRACKS_PARAMS[i].scaleX;
			crack.scale.y = CRACKS_PARAMS[i].scaleY;
			crack.rotation = CRACKS_PARAMS[i].rotation * Math.PI / 180;
			crack.position.x = CRACKS_PARAMS[i].x;
			crack.position.y = CRACKS_PARAMS[i].y;
			crack.blendMode = PIXI.BLEND_MODES.ADD;
		}
	}

	destroy()
	{
		this._showMask && Sequence.destroy(Sequence.findByTarget(this._showMask));
		this._fxContainer && Sequence.destroy(Sequence.findByTarget(this._fxContainer));
		
		this._showMask = null;
		this._fxContainer = null;
		this._cracks = null;
		super.destroy();
	}
}

export default CrackAnimation;