
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { FRAME_RATE } from '../../../../../../shared/src/CommonConstants';
import Sequence from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { Utils } from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';

class CharredAnimation extends Sprite
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

		this._fCharred1_spr = null;
		this._fCharred2_spr = null;
		this._fCharred3_spr = null;

		this._fBlackCover1_spr = null;
		this._fBlackCover2_spr = null;
	}

	_startAnimation()
	{
		this._init();

		this._startBlackCover1();
		this._startBlackCover2();
		let lTimingSeq_arr = [
			{
				tweens: [], duration: 0 * FRAME_RATE, onfinish: () =>
				{
					this._startCharredAnimation3();
				}
			},
			{
				tweens: [], duration: 13 * FRAME_RATE, onfinish: () =>
				{
					this._startCharredAnimation2();
				}
			},
			{
				tweens: [], duration: 7 * FRAME_RATE, onfinish: () =>
				{
					this._startCharredAnimation1();
				}
			},
		];
		Sequence.start(this, lTimingSeq_arr).once(Sequence.EVENT_ON_SEQUENCE_PLAYING_COMPLETED, () =>
		{
			Sequence.destroy(Sequence.findByTarget(this));
			this._checkAnimationFinish();
		});
	}

	_init()
	{
		this._fCharred1_spr = this.addChild(APP.library.getSpriteFromAtlas("boss_mode/fire/charred"));
		this._fCharred1_spr.visible = false;
		this._fCharred2_spr = this.addChild(APP.library.getSpriteFromAtlas("boss_mode/fire/charred"));
		this._fCharred2_spr.visible = false;
		this._fCharred3_spr = this.addChild(APP.library.getSpriteFromAtlas("boss_mode/fire/charred"));
		this._fCharred3_spr.visible = false;

		this._fBlackCover1_spr = this.addChild(APP.library.getSpriteFromAtlas("boss_mode/fire/black_cover_2"));
		this._fBlackCover1_spr.visible = false;
		this._fBlackCover2_spr = this.addChild(APP.library.getSpriteFromAtlas("boss_mode/fire/black_cover_1"));
		this._fBlackCover2_spr.visible = false;
	}

	_startBlackCover1()
	{
		this._fBlackCover1_spr.visible = true;
		this._fBlackCover1_spr.position.set(-42, -13);
		this._fBlackCover1_spr.alpha = 0;
		this._fBlackCover1_spr.scale.set(2);

		let lAlphaSeq_arr = [
			{ tweens: [{ prop: "alpha", to: 0.5 }], duration: 18 * FRAME_RATE },
			{ tweens: [{ prop: "alpha", to: 0.5 }], duration: 2 * FRAME_RATE },
			{ tweens: [{ prop: "alpha", to: 0 }], duration: 29 * FRAME_RATE }
		];
		Sequence.start(this._fBlackCover1_spr, lAlphaSeq_arr).once(Sequence.EVENT_ON_SEQUENCE_PLAYING_COMPLETED, () =>
		{
			Sequence.destroy(Sequence.findByTarget(this._fBlackCover1_spr));
			this._checkAnimationFinish();
		});
	}

	_startBlackCover2()
	{
		this._fBlackCover2_spr.visible = true;
		this._fBlackCover2_spr.scale.set(4);
		this._fBlackCover2_spr.position.set(-18, 33);
		this._fBlackCover2_spr.alpha = 0;

		let lAlphaSeq_arr = [
			{ tweens: [{ prop: "alpha", to: 0.6 }], duration: 17 * FRAME_RATE },
			{ tweens: [{ prop: "alpha", to: 0.6 }], duration: 2 * FRAME_RATE },
			{ tweens: [{ prop: "alpha", to: 0 }], duration: 29 * FRAME_RATE }
		];
		Sequence.start(this._fBlackCover2_spr, lAlphaSeq_arr).once(Sequence.EVENT_ON_SEQUENCE_PLAYING_COMPLETED, () =>
		{
			Sequence.destroy(Sequence.findByTarget(this._fBlackCover2_spr));
			this._checkAnimationFinish();
		});
	}

	_startCharredAnimation1()
	{
		this._fCharred1_spr.visible = true;
		this._fCharred1_spr.position.set(0, 0);
		this._fCharred1_spr.scale.set(0.8, 0.68);
		this._fCharred1_spr.position.set(113, 22.5);

		let lSequenceScale_arr = [
			{ tweens: [{ prop: "scale.x", to: 1 }, { prop: "scale.y", to: 0.86 }], duration: 4 * FRAME_RATE }
		];
		Sequence.start(this._fCharred1_spr, lSequenceScale_arr).once(Sequence.EVENT_ON_SEQUENCE_PLAYING_COMPLETED, () =>
		{
			this._checkAnimationFinish();
		});

		let lAlphaSeq_arr = [
			{ tweens: [], duration: 9 * FRAME_RATE },
			{ tweens: [{ prop: "alpha", to: 0 }], duration: 13 * FRAME_RATE }
		];
		Sequence.start(this._fCharred1_spr, lAlphaSeq_arr).once(Sequence.EVENT_ON_SEQUENCE_PLAYING_COMPLETED, () =>
		{
			Sequence.destroy(Sequence.findByTarget(this._fCharred1_spr));
			this._checkAnimationFinish();
		});
	}

	_startCharredAnimation2()
	{
		this._fCharred2_spr.visible = true;
		this._fCharred2_spr.position.set(-104, 15.5);
		this._fCharred2_spr.scale.set(0.74, 1);
		this._fCharred2_spr.rotation = 3.9968039870670142; //Utils.gradToRad(229)

		let lSequenceScale_arr = [
			{ tweens: [{ prop: "scale.x", to: 0.96 }, { prop: "scale.y", to: 1.29 }], duration: 4 * FRAME_RATE }
		];
		Sequence.start(this._fCharred2_spr, lSequenceScale_arr).once(Sequence.EVENT_ON_SEQUENCE_PLAYING_COMPLETED, () =>
		{
			this._checkAnimationFinish();
		});

		let lAlphaSeq_arr = [
			{ tweens: [], duration: 16 * FRAME_RATE },
			{ tweens: [{ prop: "alpha", to: 0 }], duration: 13 * FRAME_RATE }
		];
		Sequence.start(this._fCharred2_spr, lAlphaSeq_arr).once(Sequence.EVENT_ON_SEQUENCE_PLAYING_COMPLETED, () =>
		{
			Sequence.destroy(Sequence.findByTarget(this._fCharred2_spr));
			this._checkAnimationFinish();
		});
	}

	_startCharredAnimation3()
	{
		this._fCharred3_spr.visible = true;
		this._fCharred3_spr.scale.set(1.15, 0.68);
		this._fCharred3_spr.rotation = 3.2;

		let lSequenceScale_arr = [
			{ tweens: [{ prop: "scale.x", to: 2.42}, { prop: "scale.y", to: 1.41 }], duration: 5 * FRAME_RATE }
		];
		Sequence.start(this._fCharred3_spr, lSequenceScale_arr).once(Sequence.EVENT_ON_SEQUENCE_PLAYING_COMPLETED, () =>
		{
			this._checkAnimationFinish();
		});

		let lAlphaSeq_arr = [
			{ tweens: [], duration: 29 * FRAME_RATE },
			{ tweens: [{ prop: "alpha", to: 0 }], duration: 18 * FRAME_RATE }
		];
		Sequence.start(this._fCharred3_spr, lAlphaSeq_arr).once(Sequence.EVENT_ON_SEQUENCE_PLAYING_COMPLETED, () =>
		{
			Sequence.destroy(Sequence.findByTarget(this._fCharred3_spr));
			this._checkAnimationFinish();
		});
	}

	_checkAnimationFinish()
	{
		if (
			Sequence.findByTarget(this).length == 0 &&
			Sequence.findByTarget(this._fCharred1_spr).length == 0 &&
			Sequence.findByTarget(this._fCharred2_spr).length == 0 &&
			Sequence.findByTarget(this._fCharred3_spr).length == 0 &&
			Sequence.findByTarget(this._fBlackCover1_spr).length == 0 &&
			Sequence.findByTarget(this._fBlackCover2_spr).length == 0
		)
		{
			this.emit(CharredAnimation.EVENT_ON_ANIMATION_FINISH);
		}
	}

	_interrupt()
	{
		Sequence.destroy(Sequence.findByTarget(this));
		this._fCharred1_spr && Sequence.destroy(Sequence.findByTarget(this._fCharred1_spr));
		this._fCharred2_spr && Sequence.destroy(Sequence.findByTarget(this._fCharred2_spr));
		this._fCharred3_spr && Sequence.destroy(Sequence.findByTarget(this._fCharred3_spr));
		this._fBlackCover1_spr && Sequence.destroy(Sequence.findByTarget(this._fBlackCover1_spr));
		this._fBlackCover2_spr && Sequence.destroy(Sequence.findByTarget(this._fBlackCover2_spr));

		this._fCharred1_spr = null;
		this._fCharred2_spr = null;
		this._fCharred3_spr = null;
		this._fBlackCover1_spr = null;
		this._fBlackCover2_spr = null;
	}

	destroy()
	{
		super.destroy();

		this._interrupt();

		this._fCharred1_spr = null;
		this._fCharred2_spr = null;
		this._fCharred3_spr = null;
		this._fBlackCover1_spr = null;
		this._fBlackCover2_spr = null;
	}
}

export default CharredAnimation;