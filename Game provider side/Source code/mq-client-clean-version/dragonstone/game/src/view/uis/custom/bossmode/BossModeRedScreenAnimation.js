import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { Sprite } from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import { FRAME_RATE } from '../../../../../../shared/src/CommonConstants';
import { Sequence } from './../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';


class BossModeRedScreenAnimation extends Sprite
{
	startAnimation(aCurSpeedProgress_num=0)
	{
		if (aCurSpeedProgress_num < this._fSpeedProgress_num)
		{
			return;
		}
		this._fSpeedProgress_num = aCurSpeedProgress_num;
		this._startAnimation();
	}

	updateAnimation(aCurSpeedProgress_num=0)
	{
		if (aCurSpeedProgress_num < this._fSpeedProgress_num)
		{
			return;
		}

		this._fSpeedProgress_num = aCurSpeedProgress_num;
		if (aCurSpeedProgress_num == 1)
		{
			Sequence.destroy(Sequence.findByTarget(this._redView));

			this._startBlinkCycle();
		}
	}

	startBossDieAnimation()
	{
		this._startBossDieAnimation();
	}

	completeBossDieAnimation()
	{
		this._completeBossDieAnimation();
	}

	constructor()
	{
		super();

		this._redView = null;
		this._fSpeedProgress_num = 0; // 0 to 1
	}

	__init()
	{
		super.__init();

		this._initHourglass();
	}

	_startAnimation()
	{
		if (this._redView)
		{
			return;
		}

		this._createView();

		this._startBlinkCycle();
	}

	_createView()
	{
		let lRedView = this._redView = this.addChild(APP.library.getSpriteFromAtlas('boss_mode/bm_boss_mode/red_screen'));
		lRedView.position.set(APP.config.size.width/2, APP.config.size.height/2);
		lRedView.scale.set(8);
		lRedView.alpha = 0;
	}

	_startBlinkCycle()
	{
		let lRedView = this._redView;
		lRedView.alpha = this._fSpeedProgress_num == 1 ? 0.7 : 0;

		let lBlinkInterval = 19 * FRAME_RATE;
		if (this._fSpeedProgress_num > 0)
		{
			lBlinkInterval -= Math.min(15*FRAME_RATE, lBlinkInterval*this._fSpeedProgress_num*2);
		}

		lBlinkInterval = ~~lBlinkInterval;

		let lFinalAlpha = this._fSpeedProgress_num == 1 ? 0.3 : 0;
		
		let lSeq = [
			{ tweens: [{ prop: "alpha", to: 0.7 }], 	duration: 4 * FRAME_RATE},
			{ tweens: [{ prop: "alpha", to: lFinalAlpha }], 		duration: 6 * FRAME_RATE},
			{ tweens: [], 		duration: lBlinkInterval, onfinish: () => { this._onBlinkCycleCompleted(); } }
		];

		Sequence.start(lRedView, lSeq);
	}

	_onBlinkCycleCompleted()
	{
		Sequence.destroy(Sequence.findByTarget(this._redView));
		this._redView.alpha = 0;

		if (this._fSpeedProgress_num < 1)
		{
			this._startBlinkCycle();
		}
	}

	_startBossDieAnimation()
	{
		let lRedView = this._redView;
		
		Sequence.destroy(Sequence.findByTarget(lRedView));

		let lSeq = [
			{ tweens: [{ prop: "alpha", to: 0.7 }], 	duration: 3*FRAME_RATE}
		];

		Sequence.start(lRedView, lSeq);
	}

	_completeBossDieAnimation()
	{
		let lRedView = this._redView;

		Sequence.destroy(Sequence.findByTarget(lRedView));

		let lSeq = [
			{ tweens: [{ prop: "alpha", to: 0 }], 		duration: 44*FRAME_RATE, onfinish: () => { this._onBossDieAnimationCompleted(); } }
		];

		Sequence.start(lRedView, lSeq);	
	}

	_onBossDieAnimationCompleted()
	{
		Sequence.destroy(Sequence.findByTarget(this._redView));
	}

	destroy()
	{
		this._fSpeedProgress_num = undefined;

		if (this._redView)
		{
			Sequence.destroy(Sequence.findByTarget(this._redView));
			this._redView.removeTweens();
		}
		this._redView = null;

		super.destroy();
	}
}

export default BossModeRedScreenAnimation;