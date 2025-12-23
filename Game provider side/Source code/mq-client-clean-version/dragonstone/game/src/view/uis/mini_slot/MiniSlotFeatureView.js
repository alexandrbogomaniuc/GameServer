import SimpleUIView from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/SimpleUIView';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { FRAME_RATE, MINI_SLOT_ENABLED } from '../../../../../shared/src/CommonConstants';
import * as Easing from '../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { Sprite } from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';

const SLOT_SCALE = 0.49;

class MiniSlotFeatureView extends SimpleUIView
{
	static get EVENT_ON_SLOT_APPEARING_FINISH() 	{ return "EVENT_ON_SLOT_APPEARING_FINISH"; }
	static get EVENT_ON_SLOT_DISAPPEARING_FINISH() 	{ return "EVENT_ON_SLOT_DISAPPEARING_FINISH"; }
	static get EVENT_ON_WIN_ANIMATION_STARTED() 	{ return "EVENT_ON_WIN_ANIMATION_STARTED"; }

	showWinSmoke()
	{
		this._showWinSmoke();
	}

	finishAnimation()
	{
		this._finishAnimation();
	}

	startAnimation()
	{
		this._startAnimation();
	}

	setSlotView(aMiniSlotView_msv)
	{
		this._addSlotView(aMiniSlotView_msv);
	}

	showSpinSmoke()
	{
		this._showSpinSmoke();
	}

	get isAnimInProgress()
	{
		return this._fIsAnimationInProgress_bl;
	}

	resetView()
	{
		this._resetView();
	}

	constructor()
	{
		super();

		this._fIsAnimationInProgress_bl = null;
		this._fAppearingSmoke_spr = null;
		this._fWinSmoke_spr = null;
		this._fSpinSmoke_spr = null;
		this._fMiniSlotView_msv = null;
		this._fMiniSlotViewAnimationContainer_spr = this.addChild(new Sprite());

		this._addAppearingSmoke();
		this._addWinSmoke();
		this._addSpinSmoke();
	}

	_addAppearingSmoke()
	{
		this._fAppearingSmoke_spr = this.addChild(APP.library.getSpriteFromAtlas("mini_slot/smoke"));
		this._fAppearingSmoke_spr.blendMode = PIXI.BLEND_MODES.SCREEN;
		this._resetAppearingSmoke();
	}

	_resetAppearingSmoke()
	{
		Sequence.destroy(Sequence.findByTarget(this._fAppearingSmoke_spr));
		this._fAppearingSmoke_spr.alpha = 0.7;
		this._fAppearingSmoke_spr.scale.set(5.14);
		this._fAppearingSmoke_spr.position.set(0, 0);
		this._fAppearingSmoke_spr.visible = false;
	}

	_showAppearingSmoke()
	{
		this._resetAppearingSmoke();
		this._fAppearingSmoke_spr.visible = true;
		Sequence.destroy(Sequence.findByTarget(this._fAppearingSmoke_spr));

		let lSequenceAlpha_arr = [
			{ tweens: [{ prop: "alpha", to: 0 }], duration: 14 * FRAME_RATE }
		];
		Sequence.start(this._fAppearingSmoke_spr, lSequenceAlpha_arr);

		let lSequenceScale_arr = [
			{ tweens: [{ prop: "scale.x", to: 7.41 }, { prop: "scale.y", to: 7.41 }], duration: 20 * FRAME_RATE },
		];
		Sequence.start(this._fAppearingSmoke_spr, lSequenceScale_arr);

		let lSequencePosition_arr = [
			{ tweens: [{ prop: "x", to: 0 }, { prop: "y", to: -20 }], duration: 32 * FRAME_RATE },
		];
		Sequence.start(this._fAppearingSmoke_spr, lSequencePosition_arr);
	}

	_addWinSmoke()
	{
		this._fWinSmoke_spr = this._fMiniSlotViewAnimationContainer_spr.addChild(APP.library.getSpriteFromAtlas("mini_slot/smoke"));
		this._fWinSmoke_spr.blendMode = PIXI.BLEND_MODES.SCREEN;
		this._resetWinSmoke();
	}

	_resetWinSmoke()
	{
		Sequence.destroy(Sequence.findByTarget(this._fWinSmoke_spr));
		this._fWinSmoke_spr.alpha = 0.7;
		this._fWinSmoke_spr.scale.set(3.94);
		this._fWinSmoke_spr.position.set(0, -54);
		this._fWinSmoke_spr.visible = false;
	}

	_showWinSmoke()
	{
		this._resetWinSmoke();
		this._fWinSmoke_spr.visible = true;
		Sequence.destroy(Sequence.findByTarget(this._fWinSmoke_spr));

		let lSequenceAlpha_arr = [
			{ tweens: [{ prop: "alpha", to: 0 }], duration: 14 * FRAME_RATE }
		];
		Sequence.start(this._fWinSmoke_spr, lSequenceAlpha_arr);

		let lSequenceScale_arr = [
			{ tweens: [{ prop: "scale.x", to: 5.41 }, { prop: "scale.y", to: 5.41 }], duration: 20 * FRAME_RATE },
		];
		Sequence.start(this._fWinSmoke_spr, lSequenceScale_arr);

		let lSequencePosition_arr = [
			{ tweens: [{ prop: "x", to: this._fWinSmoke_spr.position.x }, { prop: "y", to: this._fWinSmoke_spr.position.y - 20 }], duration: 32 * FRAME_RATE },
		];
		Sequence.start(this._fWinSmoke_spr, lSequencePosition_arr);
	}

	_addSpinSmoke()
	{
		this._fSpinSmoke_spr = this._fMiniSlotViewAnimationContainer_spr.addChild(APP.library.getSpriteFromAtlas("mini_slot/spin_smoke"));
		this._fSpinSmoke_spr.blendMode = PIXI.BLEND_MODES.SCREEN;
		this._resetSpineSmoke();
	}

	_resetSpineSmoke()
	{
		Sequence.destroy(Sequence.findByTarget(this._fSpinSmoke_spr));
		this._fSpinSmoke_spr.alpha = 0.7;
		this._fSpinSmoke_spr.position.set(0, 0);
		this._fSpinSmoke_spr.visible = false;
	}

	_showSpinSmoke()
	{
		this._resetSpineSmoke();
		this._fSpinSmoke_spr.visible = true;
		Sequence.destroy(Sequence.findByTarget(this._fSpinSmoke_spr));

		let lSequenceAlpha_arr = [
			{ tweens: [{ prop: "alpha", to: 0 }], duration: 47 * FRAME_RATE }
		];
		Sequence.start(this._fSpinSmoke_spr, lSequenceAlpha_arr);

		let lSequencePosition_arr = [
			{ tweens: [{ prop: "x", to: this._fSpinSmoke_spr.position.x }, { prop: "y", to: this._fSpinSmoke_spr.position.y - 210 }], duration: 64 * FRAME_RATE },
		];
		Sequence.start(this._fSpinSmoke_spr, lSequencePosition_arr);
	}

	_addSlotView(aMiniSlotView_msv)
	{
		this._fMiniSlotView_msv = this._fMiniSlotViewAnimationContainer_spr.addChild(aMiniSlotView_msv);
		this._resetSlotView();
	}

	_resetSlotView()
	{
		Sequence.destroy(Sequence.findByTarget(this._fMiniSlotView_msv));
		this._fMiniSlotView_msv.scale.set(0);
		this._fMiniSlotView_msv.reset();

		Sequence.destroy(Sequence.findByTarget(this._fMiniSlotViewAnimationContainer_spr));
		this._fMiniSlotViewAnimationContainer_spr.scale.set(1);
		this._fMiniSlotViewAnimationContainer_spr.position.set(0, 0);
	}

	_showSlotView()
	{
		this._resetSlotView();

		this._fMiniSlotView_msv.startAppearingAnimation();

		const lSequenceScale_arr = [
			{ tweens: [{ prop: 'scale.x', to: 0.62 }, 	{ prop: 'scale.y', to: 0.83 }],									duration: 6 * FRAME_RATE },
			{ tweens: [{ prop: 'scale.x', to: 1 }, 		{ prop: 'scale.y', to: 1 }], 									duration: 8 * FRAME_RATE, ease: Easing.back.easeOut },
			{ tweens: [{ prop: 'scale.x', to: 0.93 }, 	{ prop: 'scale.y', to: 0.93 }], 								duration: 3 * FRAME_RATE },
			{ tweens: [{ prop: 'scale.x', to: 1 }, 		{ prop: 'scale.y', to: 1 }], 									duration: 10 * FRAME_RATE, ease: Easing.back.easeOut },
		];
		Sequence.start(this._fMiniSlotView_msv, lSequenceScale_arr);

		const lScale_arr = [
			{ tweens: [],																								duration: 15 * FRAME_RATE },
			{ tweens: [{ prop: 'scale.x', to: 0.47 }, 	{ prop: 'scale.y', to: 0.47 }],									duration: 9 * FRAME_RATE },
			{ tweens: [{ prop: 'scale.x', to: 0.51 }, 	{ prop: 'scale.y', to: 0.51 }],									duration: 9 * FRAME_RATE },
		];
		Sequence.start(this._fMiniSlotViewAnimationContainer_spr, lScale_arr);

		const lSequencePosition_arr = [
			{ tweens: [], duration: 15 * FRAME_RATE },
			{ tweens: [{ prop: "x", to: 224 }, { prop: "y", to: 121 }], duration: 8 * FRAME_RATE, ease: Easing.quartic.easeIn, onfinish: () => { this._onSlotAppearingFinish(); } },
		];
		Sequence.start(this._fMiniSlotViewAnimationContainer_spr, lSequencePosition_arr);
		if(!MINI_SLOT_ENABLED){
			this.visible = false;	
		}
	}

	_onSlotAppearingFinish()
	{
		this.emit(MiniSlotFeatureView.EVENT_ON_SLOT_APPEARING_FINISH);
	}

	_hideSlotView()
	{
		Sequence.destroy(Sequence.findByTarget(this._fMiniSlotView_msv));

		this._fMiniSlotView_msv.startDisappearingAnimation();

		let lSequenceScale_arr = [
			{ tweens: [{ prop: 'scale.x', to: 0.9 }, { prop: 'scale.y', to: 0.9 }], duration: 2 * FRAME_RATE, ease: Easing.smoothstep.easeInOut },
			{ tweens: [{ prop: 'scale.x', to: 1.1 }, { prop: 'scale.y', to: 1.05 }], duration: 4 * FRAME_RATE, ease: Easing.smoothstep.easeInOut },
			{ tweens: [{ prop: 'scale.x', to: 0 }, { prop: 'scale.y', to: 0 }], duration: 5 * FRAME_RATE, ease: Easing.exponential.easeOut, onfinish: () => { this._onAllAnimationFinish() } }
		];

		Sequence.start(this._fMiniSlotView_msv, lSequenceScale_arr);
	}

	_resetView()
	{
		this._resetAppearingSmoke();
		this._resetSpineSmoke();
		this._resetSlotView();

		this._fIsAnimationInProgress_bl = false;
	}

	_startAnimation()
	{
		this._fIsAnimationInProgress_bl = true;

		this._showAppearingSmoke();
		this._showSlotView();
	}

	_finishAnimation()
	{
		this._hideSlotView();
	}

	_onAllAnimationFinish()
	{
		this._fIsAnimationInProgress_bl = false;

		this._resetView();

		this.emit(MiniSlotFeatureView.EVENT_ON_SLOT_DISAPPEARING_FINISH);
	}

	destroy()
	{
		super.destroy();

		this._fIsAnimationInProgress_bl = null;

		Sequence.destroy(Sequence.findByTarget(this._fAppearingSmoke_spr));
		this._fAppearingSmoke_spr = null;

		Sequence.destroy(Sequence.findByTarget(this._fWinSmoke_spr));
		this._fWinSmoke_spr = null;

		Sequence.destroy(Sequence.findByTarget(this._fSpinSmoke_spr));
		this._fSpinSmoke_spr = null;

		Sequence.destroy(Sequence.findByTarget(this._fMiniSlotView_msv));
		this._fMiniSlotView_msv = null;

		Sequence.destroy(Sequence.findByTarget(this._fMiniSlotViewAnimationContainer_spr));
		this._fMiniSlotViewAnimationContainer_spr = null;
	}
}

export default MiniSlotFeatureView;