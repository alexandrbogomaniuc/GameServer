import Sprite from '../../../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import * as Easing from '../../../../../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { APP } from '../../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../../../../../shared/src/CommonConstants';
import { Sequence } from '../../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import { Utils } from '../../../../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';

class FireBossDeathRaysAnimation extends Sprite
{
	static get EVENT_ON_ANIMATION_FINISH() { return "onAnimationFinish"; }

	startAnimation()
	{
		this._startAnimation();
	}

	interrupt()
	{
		this._interrupt();
	}

	constructor()
	{
		super();

		this._fFlare_spr = null;
		this._fRays_spr_arr = [];
	}

	_startAnimation()
	{
		this._startFlare();
		this._startFireRays();
	}

	_startFlare()
	{
		this._fFlare_spr = this.addChild(APP.library.getSpriteFromAtlas("boss_mode/fire/flare"));
		this._fFlare_spr.visible = false;
		this._fFlare_spr.scale.set(4);
		this._fFlare_spr.blendMode = PIXI.BLEND_MODES.ADD;

		const lAlphaSeq_arr = [
			{
				tweens: [], duration: 52 * FRAME_RATE, onfinish: () =>
				{
					this._fFlare_spr.visible = true;
				}
			},
			{ tweens: [], duration: 10 * FRAME_RATE },
			{
				tweens: [{ prop: "alpha", to: 0 }], duration: 5 * FRAME_RATE, onfinish: () =>
				{
					this.emit(FireBossDeathRaysAnimation.EVENT_ON_ANIMATION_FINISH);
				}
			},
		];
		Sequence.start(this._fFlare_spr, lAlphaSeq_arr);
	}

	_startFireRays()
	{
		this._startRay({x: 0, y: 0}, {x: 0, y: 1}, {x: 0.68, y: 1.28}, -1.2915436464758039, 37); //Utils.gradToRad(-74)
		let lTimingSeq_arr = [
			{
				tweens: [], duration: 6 * FRAME_RATE, onfinish: () =>
				{
					this._startRay({x: -17, y: 57}, {x: 0, y: 4}, {x: 0.91, y: 0.87}, 2.3911010752322315, 33); //Utils.gradToRad(137)
				}
			},
			{
				tweens: [], duration: 7 * FRAME_RATE, onfinish: () =>
				{
					this._startRay({x: 47, y: 30}, {x: 0, y: 4}, {x: 0.68, y: 1.28}, -0.767944870877505, 37); //Utils.gradToRad(-44)
				}
			},
			{
				tweens: [], duration: 4 * FRAME_RATE, onfinish: () =>
				{
					this._startRay({x: -37, y: 35}, {x: 0, y: 4}, {x: 0.91, y: 0.87}, 3.0892327760299634, 32); //Utils.gradToRad(177)
				}
			},
			{
				tweens: [], duration: 4 * FRAME_RATE, onfinish: () =>
				{
					this._startRay({x: 34, y: 58}, {x: 0, y: 4}, {x: 1.57, y: 1.28}, 0.6457718232379019, 29); //Utils.gradToRad(37)
				}
			},
			{
				tweens: [], duration: 4 * FRAME_RATE, onfinish: () =>
				{
					this._startRay({x: -46, y: -32}, {x: 0, y: 4}, {x: 0.53, y: 1.28}, -2.2689280275926285, 25); //Utils.gradToRad(-130)
				}
			},
		];

		Sequence.start(this, lTimingSeq_arr);
	}

	_startRay(aPosition_obj, aStartScale_obj, aFinishScale_obj, aRotation_num, aRayLifetimePerFrame_num)
	{
		let lRay_spr = this.addChild(APP.library.getSpriteFromAtlas("boss_mode/fire/fire_ray"));
		lRay_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lRay_spr.anchor.set(0.15, 0.5);
		lRay_spr.rotation = aRotation_num;
		lRay_spr.position = aPosition_obj;
		lRay_spr.scale.set(aStartScale_obj.x, aStartScale_obj.y);

		let lSequenceScale_arr = [
			{ tweens: [{ prop: "scale.x", to: aFinishScale_obj.x }, { prop: "scale.y", to: aFinishScale_obj.y }], duration: 7 * FRAME_RATE, ease: Easing.cubic.easeOut }
		];
		Sequence.start(lRay_spr, lSequenceScale_arr);

		let lSequenceLifeTime_arr = [
			{
				tweens: [], duration: aRayLifetimePerFrame_num * FRAME_RATE, onfinish: () =>
				{
					lRay_spr.visible = false;
				}
			}
		];
		Sequence.start(lRay_spr, lSequenceLifeTime_arr);

		this._fRays_spr_arr.push(lRay_spr);
	}

	_interrupt()
	{
		Sequence.destroy(Sequence.findByTarget(this));
		Sequence.destroy(Sequence.findByTarget(this._fFlare_spr));
		this._fFlare_spr = null;

		this._fRays_spr_arr.forEach(aRay_spr =>
		{
			Sequence.destroy(Sequence.findByTarget(aRay_spr));
			aRay_spr.destroy();
			aRay_spr = null;
		});
		this._fRays_spr_arr = [];
	}

	destroy()
	{
		super.destroy();

		this._interrupt();

		this._fFlare_spr = null;
		this._fRays_spr_arr = null;
	}
}

export default FireBossDeathRaysAnimation;