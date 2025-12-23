
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import AtlasSprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import AtlasConfig from '../../../../config/AtlasConfig';
import { FRAME_RATE } from '../../../../../../shared/src/CommonConstants';
import { Sequence } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import { Utils } from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import Timer from "../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer";

let _top_dust_textures = null;
function _generateTopDustTextures()
{
	if (_top_dust_textures) return

	_top_dust_textures = AtlasSprite.getFrames(
		[
			APP.library.getAsset("boss_mode/fire/top_dust/top_dust")
		],
		[
			AtlasConfig.TopDust,
		],
		"");
}

const TOP_DUST_COUNT = 17;

class AppearingDustAnimation extends Sprite
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

		_generateTopDustTextures();

		this._fBottomDustContainer_spr = null;
		this._fBottomDusts_spr_arr = [];
		this._fTopDustContainer_spr = null;
		this._fTopDustCount_num = 0;
		this._fTopDust1_spr = null;
		this._fTopDust_spt_arr = [];
	}

	_startAnimation()
	{
		this._fTopDustCount_num = 0;
		this._startBottomDusts();
		this._startTopDusts();
	}

	_startBottomDusts()
	{
		this._fBottomDustContainer_spr = this.addChild(new Sprite());

		this._startBottomDust({ x: 25, y: 113.5 }, { x: 0.792, y: 0.792 }, { x: 2.772, y: 2.772 }); //{ x: 50/2, y: 227/2 }, { x: 0.792, y: 0.792 }, { x: 2.772, y: 2.772 }
		let lTimingSeq_arr = [
			{
				tweens: [], duration: 8 * FRAME_RATE, onfinish: () =>
				{
					this._startBottomDust({ x: -4, y: 113.5 }, { x: -0.792, y: -0.792 }, { x: -2.4772, y: -2.772 }); //{ x: -8/2, y: 227/2 }, { x: -0.792, y: -0.792 }, { x: -2.4772, y: -2.772 }
				}
			},
			{
				tweens: [], duration: 7 * FRAME_RATE, onfinish: () =>
				{
					this._startBottomDust({ x: 40.5, y: 111.8 }, { x: 0.792, y: 0.792 }, { x: 2.772, y: 2.772 }); //{ x: 81/2, y: 223.6/2 }, { x: 0.792, y: 0.792 }, { x: 2.772, y: 2.772 }
				}
			},
		];
		Sequence.start(this, lTimingSeq_arr);
	}

	_startBottomDust(aStartPosition_obj, aStartScale_obj, aFinishScale_obj,)
	{
		let lBottomDust_spr = this._fBottomDustContainer_spr.addChild(APP.library.getSpriteFromAtlas("boss_mode/fire/bottom_dust"));
		lBottomDust_spr.position = aStartPosition_obj;
		lBottomDust_spr.scale.set(aStartScale_obj.x, aStartScale_obj.y);

		let lAlphaSeq_arr = [
			{ tweens: [], duration: 8 * FRAME_RATE },
			{ tweens: [{ prop: "alpha", to: 0 }], duration: 10 * FRAME_RATE },
		];
		Sequence.start(lBottomDust_spr, lAlphaSeq_arr);

		let lScaleSeq_arr = [
			{
				tweens: [{ prop: "scale.x", to: aFinishScale_obj.x }, { prop: "scale.y", to: aFinishScale_obj.y }], duration: 18 * FRAME_RATE,
				onfinish: () =>	{this._checkAnimationFinish();}
			}
		];
		Sequence.start(lBottomDust_spr, lScaleSeq_arr);

		this._fBottomDusts_spr_arr.push(lBottomDust_spr);
	}

	_startTopDusts()
	{
		this._fTopDustContainer_spr = this.addChild(new Sprite());

		this._startTopDust({ x: 80.5, y: 79 }, { x: 1.004, y: 2.124 }, 4); //{ x: 161/2, y: 158/2 }, { x: 1.004, y: 2.124 }
		this._startTopDust({ x: 96.5, y: 2 }, { x: 1.104, y: 3.504 } , 4); //{ x: 193/2, y: 4/2 }, { x: 1.104, y: 3.504 }

		this._fTopDust1_spr = this._startTopDust({ x: 125.5, y: 80.5 }, { x: 1.98, y: 1.98 }, 0); //{ x: 251/2, y: 161/2 }, { x: 1.98, y: 1.98 }

		let lTop1Seq_s = [
			{tweens: [{ prop: "scale.x", to: 4.05 }, { prop: "scale.y", to: 4.13 }], duration: 8 * FRAME_RATE, 
			onfinish: () =>	{this._checkAnimationFinish();}}
		];
		Sequence.start(this._fTopDust1_spr, lTop1Seq_s);


		let lTimingSeq_arr = [
			{
				tweens: [], duration: 18 * FRAME_RATE, onfinish: () =>
				{
					this._startTopDust({ x: -154.5, y: 164.5 }, { x: 1.004, y: 1.004 }, 4); //{ x: -309/2, y: 329/2 }, { x: 1.004, y: 1.004 }
					this._startTopDust({ x: -139.5, y: 87 }, { x: 1.104, y: 2.384 }, 4); //{ x: -279/2, y: 174/2 }, { x: 1.104, y: 2.384 }
				}
			},
			{
				tweens: [], duration: 1 * FRAME_RATE, onfinish: () =>
				{
					this._startTopDust({ x: 81, y: 79.5 }, { x: 1.004, y: 2.124 }, 4); //{ x: 162/2, y: 159/2 }, { x: 1.004, y: 2.124 }
					this._startTopDust({ x: 96.5, y: 2 }, { x: 1.104, y: 3.504 }, 4); //{ x: 193/2, y: 4/2 }, { x: 1.104, y: 3.504 }
				}
			},
			{
				tweens: [], duration: 6 * FRAME_RATE, onfinish: () =>
				{
					this._startTopDust({ x: 368, y: 91 }, { x: 1.694, y: 2.974 }, 4); //{ x: 736/2, y: 182/2 }, { x: 1.694, y: 2.974 }
					this._startTopDust({ x: 332, y: 152.5 }, { x: 1.594, y: 1.594 }, 4); //{ x: 664/2, y: 305/2 }, { x: 1.594, y: 1.594 }
				}
			},
			{
				tweens: [], duration: 3 * FRAME_RATE, onfinish: () =>
				{
					this._startTopDust({ x: 79, y: 119 }, { x: 1.724, y: 1.913 }); //{ x: 158/2, y: 238/2 }, { x: 1.724, y: 1.913 }
				}
			},
			{
				tweens: [], duration: 1 * FRAME_RATE, onfinish: () =>
				{
					this._startTopDust({ x: 343, y: -171 }, { x: 10.53, y: 10.50 }, 0); //{ x: 686/2, y: -342/2 }, { x: 10.53, y: 10.50 }
					this._startTopDust({ x: -370.5, y: -10 }, { x: -4.798, y: 6.374 }, 4); //{ x: -741/2, y: -20/2 }, { x: -4.798, y: 6.374 }
					this._startTopDust({ x: 71, y: -53.5 }, { x: -4.798, y: 6.374 }, 4); //{ x: 142/2, y: -107/2 }, { x: -4.798, y: 6.374 }
				}
			},
		];
		Sequence.start(this, lTimingSeq_arr);
	}

	_startTopDust(aPosition_obj, aScale_obj, aFrameToStart_num = 0)
	{
		let lTopDust_spr = this._fTopDustContainer_spr.addChild(new Sprite());
		lTopDust_spr.position = aPosition_obj;
		lTopDust_spr.scale.set(aScale_obj.x, aScale_obj.y);
		lTopDust_spr.textures = _top_dust_textures;
		lTopDust_spr.animationSpeed = 0.5; // 30 / 60
		lTopDust_spr.gotoAndPlay(aFrameToStart_num);
		lTopDust_spr.on('animationend', () =>
		{
			lTopDust_spr.destroy();
			this._checkAnimationFinish();
		});

		this._fTopDust_spt_arr.push(lTopDust_spr);

		return lTopDust_spr;
	}

	_checkAnimationFinish()
	{
		this._fTopDustCount_num++;
		if (this._fTopDustCount_num == TOP_DUST_COUNT)
		{
			this.emit(AppearingDustAnimation.EVENT_ON_ANIMATION_FINISH);
		}
	}

	_interrupt()
	{
		Sequence.destroy(Sequence.findByTarget(this));

		this._fBottomDusts_spr_arr.forEach(aBottomDust_spr =>
		{
			Sequence.destroy(Sequence.findByTarget(aBottomDust_spr));
			aBottomDust_spr = null;
		});
		this._fBottomDusts_spr_arr = [];

		this._fTopDust1_spr && Sequence.destroy(Sequence.findByTarget(this._fTopDust1_spr));
		this._fTopDust1_spr = null;

		this._fTopDust_spt_arr.forEach(aTopDust_spt =>
			{
				aTopDust_spt.destroy();
				aTopDust_spt = null;
			});
		this._fTopDust_spt_arr = [];

		this._fTopDustCount_num = 0;
	}

	destroy()
	{
		super.destroy();

		this._interrupt();

		this._fBottomDustContainer_spr = null;
		this._fTopDustContainer_spr = null;
		this._fTopDustCount_num = null;
	}
}

export default AppearingDustAnimation;