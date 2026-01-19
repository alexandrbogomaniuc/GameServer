import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../../../shared/src/CommonConstants';
import Sprite from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import Timer from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import Sequence from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import IdleCloudsFlyAnimation from './IdleCloudsFlyAnimation';
import { Utils } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';

class IdleView extends Sprite
{
	static get EVENT_ON_IDLE_ANIMATION_FINISHED()			{return "onIdleAnimationFinished";}
	static get EVENT_ON_IDLE_FADE_BACK_ANIMATION_COMPLETED()			{return "onIdleFadeBackAnimationCompleted";}

	startIdle(skipIntro = false)
	{
		this._startIdle(skipIntro);
	}

	interruptAnimation()
	{
		this._destroyAnimation();
	}

	hideFadedBack()
	{
		this._hideFadedBack();
	}

	animateIdleEnding()
	{
		this._animateIdleEnding();
	}

	get isAnimating()
	{
		return this._fadedBack ? !this._fadedBackHiding : false;
	}

	constructor()
	{
		super();

		this._fTimer_t = null;
		this._smokesTimer = null;
		this._fadedBack = null;
		this._cloudsContainer = null;
		this._cloudsAnim1 = null;
		this._cloudsAnim2 = null;
		this._fadedBackHiding = false;
		this._smokes = [];
	}

	_startIdle(skipIntro)
	{
		if (skipIntro)
		{
			this._startIdleAnimation();
		}
		else
		{
			this._startIntroAnimation();
		}
	}

	_startIntroAnimation()
	{
		this._addFadedBack();
		this._fadedBack.alpha = 0;

		this._cloudsContainer && this._cloudsContainer.destroy();
		this._cloudsContainer = this.addChild(new Sprite());

		if(APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startSmokesAnimation();
		}

		this._fTimer_t && this._fTimer_t.destructor();
		this._fTimer_t = new Timer(()=>{
			this._startFirstClouds();
		}, 8*FRAME_RATE);
	}

	_startFirstClouds(ignoreFadde = false)
	{
		this._cloudsAnim1 = this._cloudsContainer.addChild(new IdleCloudsFlyAnimation());
		this._cloudsAnim1.on(IdleCloudsFlyAnimation.EVENT_ON_CLOUDS_ANIMATION_FINISHED, this._onCloudAnimationEnded, this);
		this._cloudsAnim1.rotation = Utils.gradToRad(148);
		this._cloudsAnim1.scale.set(1.4);
		this._cloudsAnim1.position.set(920, 340);
		this._cloudsAnim1.startAnimation();

		this._fTimer_t && this._fTimer_t.destructor();
		this._fTimer_t = new Timer(()=>{
			this._startSecondClouds();
			if (!ignoreFadde)
			{
				this._startFadedBackAnimation();
			}
			else
			{
				this._fadedBackAnimationCompleted();
			}
		}, 2*FRAME_RATE);
	}

	_startSecondClouds()
	{
		this._cloudsAnim2 = this._cloudsContainer.addChild(new IdleCloudsFlyAnimation());
		this._cloudsAnim2.on(IdleCloudsFlyAnimation.EVENT_ON_CLOUDS_ANIMATION_FINISHED, this._onCloudAnimationEnded, this);
		this._cloudsAnim2.rotation = Utils.gradToRad(149);
		this._cloudsAnim2.scale.set(1.4);
		this._cloudsAnim2.alpha = 0.8;
		this._cloudsAnim2.position.set(1120, 420);
		this._cloudsAnim2.startAnimation();
	}

	_onCloudAnimationEnded(e)
	{
		if (this._cloudsAnim1 == e.target)
		{
			this._cloudsAnim1.destroy();
			this._cloudsAnim1 = null;
		}

		if (this._cloudsAnim2 == e.target)
		{
			this._cloudsAnim2.destroy();
			this._cloudsAnim2 = null;
		}

		this._tryToCompleteIdle();
	}

	_animateIdleEnding()
	{
		this._fTimer_t && this._fTimer_t.destructor();
		this._fTimer_t = null;

		this._smokesTimer && this._smokesTimer.destructor();
		this._smokesTimer = null;

		this._cloudsAnim1 && this._cloudsAnim1.finishAnimation();
		this._cloudsAnim2 && this._cloudsAnim2.finishAnimation();

		this._tryToCompleteIdle();
	}

	_startSmokesAnimation()
	{
		this._startNextSmoke({x: 230, y: 135}, 0*FRAME_RATE);
		this._startNextSmoke({x: 240, y: 420}, 1*FRAME_RATE);
		this._startNextSmoke({x: 720, y: 125}, 2*FRAME_RATE);
		this._startNextSmoke({x: 690, y: 405}, 5*FRAME_RATE);

		this._smokesTimer && this._smokesTimer.destructor();
		this._smokesTimer = new Timer(()=>{
			this._startSmokesAnimation();
		}, 74*FRAME_RATE);
	}

	_hideFadedBack()
	{
		if (this._fadedBack)
		{
			this._fadedBackHiding = true;
			Sequence.destroy(Sequence.findByTarget(this._fadedBack));

			let seqAlph = [
				{tweens: [{prop: "alpha", to: 0}],	duration: 40*FRAME_RATE, onfinish: ()=>{
					this._fadedBack && this._fadedBack.destroy();
					this._fadedBack = null;
					this._tryToCompleteIdle();
				}}
			];
			Sequence.start(this._fadedBack, seqAlph);
		}
	}

	_startFadedBackAnimation()
	{
		let seqAlph = [
			{tweens: [{prop: "alpha", to: 1}],	duration: 8*FRAME_RATE, onfinish:()=>{
				this._fadedBackAnimationCompleted();
			}}
		];
		Sequence.start(this._fadedBack, seqAlph);
	}

	_fadedBackAnimationCompleted()
	{
		this.emit(IdleView.EVENT_ON_IDLE_FADE_BACK_ANIMATION_COMPLETED);
	}

	_addFadedBack()
	{
		this._fadedBack = this.addChild(new PIXI.Graphics());
		this._fadedBack.beginFill(0x474747).drawRect(0, 0, 960, 540).endFill();
	}

	_startNextSmoke(position, delay)
	{
		let smoke = this.addChild(APP.library.getSpriteFromAtlas("boss_mode/bm_boss_mode/smoke_fx"));
		smoke.alpha = 0;
		smoke.blendMode = PIXI.BLEND_MODES.SCREEN;
		smoke.scale.set(12.72);
		smoke.position.set(position.x, position.y);
		smoke.rotation = 1.995;

		let seqAlph = [
			{tweens: [{prop: "alpha", to: 1}],	duration: 13*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0}],	duration: 30*FRAME_RATE, onfinish: ()=>this._onNextSmokeEnd(smoke)}
		];
		let seqPos = [
			{tweens: [],																					duration: 8*FRAME_RATE},
			{tweens: [{prop: "scale.x", to: 8.3}, {prop: "scale.y", to: 8.3}],								duration: 5*FRAME_RATE},
			{tweens: [{prop: "position.x", to: position.x+680}, {prop: "position.y", to: position.y-360}],	duration: 9*FRAME_RATE},
			{tweens: [{prop: "position.x", to: position.x+120}, {prop: "position.y", to: position.y-60}],	duration: 21*FRAME_RATE}
		];
		Sequence.start(smoke, seqAlph, delay);
		Sequence.start(smoke, seqPos, delay);

		this._smokes.push(smoke);
	}

	_onNextSmokeEnd(smoke)
	{
		if (!this._smokes || !this._smokes.length) return;

		let id = this._smokes.indexOf(smoke);
		if (~id)
		{
			this._smokes.splice(id, 1);
			Sequence.destroy(Sequence.findByTarget(smoke));
			smoke.destroy();
		}

		this._tryToCompleteIdle();
	}

	_startIdleAnimation()
	{
		this._addFadedBack();

		this._cloudsContainer && this._cloudsContainer.destroy();
		this._cloudsContainer = this.addChild(new Sprite());

		if(APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startSmokesAnimation();
		}
		this._startFirstClouds(true);
	}

	_tryToCompleteIdle()
	{
		if (!this._fadedBack && !this._fTimer_t && !this._smokesTimer && !this._cloudsAnim1 && !this._cloudsAnim2)
		{
			if (!this._smokes || !this._smokes.length)
			{
				this._onAnimationFinished();
			}
		}
	}

	_onAnimationFinished()
	{
		this.emit(IdleView.EVENT_ON_IDLE_ANIMATION_FINISHED);
	}

	_destroySmokes()
	{
		if (this._smokes)
		{
			for (let smoke of this._smokes)
			{
				Sequence.destroy(Sequence.findByTarget(smoke));
				smoke.destroy();
			}
		}

		this._smokes = [];
	}

	_destroyAnimation()
	{
		this._fTimer_t && this._fTimer_t.destructor();
		this._fTimer_t = null;

		this._smokesTimer && this._smokesTimer.destructor();
		this._smokesTimer = null;

		if (this._fadedBack)
		{
			Sequence.destroy(Sequence.findByTarget(this._fadedBack));
			this._fadedBack.destroy();
		}

		this._destroySmokes();

		this._cloudsAnim1 && this._cloudsAnim1.destroy();
		this._cloudsAnim2 && this._cloudsAnim2.destroy();
		this._cloudsContainer && this._cloudsContainer.destroy();

		this._fadedBack = null;
		this._cloudsAnim1 = null;
		this._cloudsAnim2 = null;
	}

	destroy()
	{
		this._destroyAnimation();

		super.destroy();

		this._smokes = null;
		this._cloudsContainer = null;
		this._fadedBackHiding = null;
	}
}

export default IdleView;