import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { FRAME_RATE } from '../../../../../../shared/src/CommonConstants';
import Sequence from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { Utils } from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';

class FireCircleOrangeRedAnimation extends Sprite
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

		this._fCircleContainer_spr = null;
		this._fCircleRed_spr = null;
		this._fCircleOrange_spr = null;
	}

	_startAnimation()
	{
		this._startCircleRedAnimation();
	}

	_startCircleRedAnimation()
	{
		this._fCircleContainer_spr = this.addChild(new Sprite());
		this._fCircleContainer_spr.convertTo3d();
		this._fCircleContainer_spr.position3d.set(0, 0, 1);
		this._fCircleContainer_spr.scale.set(0.616, 0.616) //0.308 * 2, 0.308 * 2
		this._fCircleContainer_spr.euler.x = -0.6981317007977318; //Utils.gradToRad(-40)

		this._fCircleRed_spr = this._fCircleContainer_spr.addChild(APP.library.getSpriteFromAtlas("big_win/circle_big_win"));
		this._fCircleRed_spr.blendMode = PIXI.BLEND_MODES.ADD;
		this._fCircleRed_spr.scale.set(0.5)
		this._fCircleRed_spr.alpha = 0.6;

		this._fCircleOrange_spr = this._fCircleContainer_spr.addChild(APP.library.getSpriteFromAtlas("boss_mode/fire/circle_blast_orange"));
		this._fCircleOrange_spr.alpha = 0.48;

		let lSequenceScale_arr = [
			{
				tweens: [{ prop: "scale.x", to: 28.514 }, //14.257 * 2
						{ prop: "scale.y", to: 28.514},  //14.257 * 2
						{ prop: "euler.x", to: -1.2217304763960306}, //Utils.gradToRad(-70)
						{ prop: "y", to: 200 }, 
					], duration: 24 * FRAME_RATE, onfinish: () =>
				{
					this.emit(FireCircleOrangeRedAnimation.EVENT_ON_ANIMATION_FINISH);
				}
			}
		];
		Sequence.start(this._fCircleContainer_spr, lSequenceScale_arr);

		let lAlphaRedSeq_arr = [
			{ tweens: [], duration: 4 * FRAME_RATE },
			{ tweens: [{ prop: "alpha", to: 0 }], duration: 8 * FRAME_RATE }
		];
		Sequence.start(this._fCircleRed_spr, lAlphaRedSeq_arr);

		let lAlphaOrangeSeq_arr = [
			{ tweens: [], duration: 4 * FRAME_RATE },
			{ tweens: [{ prop: "alpha", to: 0 }], duration: 8 * FRAME_RATE }
		];
		Sequence.start(this._fCircleOrange_spr, lAlphaOrangeSeq_arr);
	}

	_interrupt()
	{
		this._fCircleRed_spr && Sequence.destroy(Sequence.findByTarget(this._fCircleRed_spr));
		this._fCircleRed_spr = null;

		this._fCircleOrange_spr && Sequence.destroy(Sequence.findByTarget(this._fCircleOrange_spr));
		this._fCircleOrange_spr = null;

		this._fCircleContainer_spr && Sequence.destroy(Sequence.findByTarget(this._fCircleContainer_spr));
		this._fCircleContainer_spr = null;
	}

	destroy()
	{
		super.destroy();

		this._interrupt();
	}
}

export default FireCircleOrangeRedAnimation;