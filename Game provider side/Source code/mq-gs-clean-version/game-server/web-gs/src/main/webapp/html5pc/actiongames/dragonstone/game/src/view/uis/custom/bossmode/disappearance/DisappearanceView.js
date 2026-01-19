import { FRAME_RATE } from '../../../../../../../shared/src/CommonConstants';
import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sprite from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import Timer from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import Sequence from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import SmokeFxView from './../appearance/SmokeFxView';
import ScreenFiresAnimation from './ScreenFiresAnimation';
import FiresFlashAnimation from './FiresFlashAnimation';
import { DRAGON_CAPTION_TYPES } from './../appearance/BossModeCaptionView';

class DisappearanceView extends Sprite
{
	static get EVENT_ON_FADED_BACK_HIDE_REQUIRED()				{return "onFadedBackHideRequired";}
	static get EVENT_ON_STOP_IDLE_SMOKE_REQUIRED()				{return "onStopIdleSmokeRequired";}
	static get EVENT_ON_DISAPPEAR_COMPLETED()					{return "onDisappearCompleted";}
	static get EVENT_ON_GROUND_BURN_REQUIRED()					{return "onGroundBurnRequired";}
	static get EVENT_ON_FIRE_FLASH_ANIMATION_COMPLETED()		{return "onFireFlashAnimationCompleted";}
	static get EVENT_ON_TIME_TO_START_CAPTION_ANIMATION()		{return "EVENT_ON_TIME_TO_START_CAPTION_ANIMATION";}

	startDisappearing(disappearExTime)
	{
		this._startDisappearing(disappearExTime);
	}

	interruptAnimation()
	{
		this._destroyAnimation();
	}

	get isAnimating()
	{
		return this._fTimer_t ? true : false;
	}

	constructor()
	{
		super();

		this._smokeFx = null;
		this._fTimer_t = null;
	}

	_startDisappearing(disappearExTime)
	{
		this._startSmokeAnimation(disappearExTime);
	}

	_startSmokeAnimation(disappearExTime = 0)
	{
		this._smokeFx = this.addChild(new SmokeFxView());
		let animTime = this._smokeFx.animTime;
		if (disappearExTime > 0)
		{
			animTime -= disappearExTime;
			this._smokeFx.animTime = animTime;
		}

		if (animTime > 0)
		{
			if(APP.profilingController.info.isVfxProfileValueMediumOrGreater)
			{
				this._smokeFx.once(SmokeFxView.EVENT_ON_ANIMATION_ENDED, this._onSmokeAnimationEnded, this);
				this._smokeFx.startAnimation();
			}
			else
			{
				this._smokeFx.destroy();
				this._smokeFx = null;
			}
		}

		let firesTime = 126*FRAME_RATE;
		firesTime -= disappearExTime;
		this._fTimer_t && this._fTimer_t.destructor();
		if (firesTime > 0)
		{
			this._fTimer_t = new Timer(()=>{
				this._startScreenFiresAnimation();
			}, firesTime);
		}
		else
		{
			this._startScreenFiresAnimation(-firesTime);
		}

		if (animTime <= 0)
		{
			this._onSmokeAnimationEnded();
		}
	}

	_onSmokeAnimationEnded()
	{
		this._smokeFx.destroy();
		this._smokeFx = null;

		this._tryToComplete();
	}

	_startScreenFiresAnimation(disappearExTime = 0)
	{
		this._screenFiresAnimation = this.addChild(new ScreenFiresAnimation());
		let animTime = this._screenFiresAnimation.animTime;
		if (disappearExTime > 0)
		{
			animTime -= disappearExTime;
			this._screenFiresAnimation.animTime = animTime;
		}

		if (animTime > 0)
		{
			if(APP.profilingController.info.isVfxProfileValueMediumOrGreater)
			{
				this._screenFiresAnimation.once(ScreenFiresAnimation.EVENT_ON_SCREEN_FIRES_ANIMATION_ENDED, this._onScreenFiresAnimationEnded, this);
				this._screenFiresAnimation.startAnimation();
			}
			else
			{
				this._screenFiresAnimation.destroy();
				this._screenFiresAnimation = null;
			}
		}

		this.emit(DisappearanceView.EVENT_ON_FADED_BACK_HIDE_REQUIRED);

		let tintTime = 3*FRAME_RATE;
		tintTime -= disappearExTime;
		this._fTimer_t && this._fTimer_t.destructor();
		if (tintTime > 0)
		{
			this._fTimer_t = new Timer(()=>{
				this._startOrangeTintAnimation();
			}, tintTime);
		}
		else
		{
			this._startOrangeTintAnimation(-tintTime);
		}

		if (animTime <= 0)
		{
			this._onScreenFiresAnimationEnded();
		}
	}

	_onScreenFiresAnimationEnded()
	{
		if (this._screenFiresAnimation)
		{
			this._screenFiresAnimation.destroy();
			this._screenFiresAnimation = null;
		}

		this._tryToComplete();
	}

	_startOrangeTintAnimation(disappearExTime = 0)
	{
		this._orangeTint = this.addChild(new PIXI.Graphics());
		this._orangeTint.beginFill(0xff9933, 0.15).drawRect(0, 0, 960, 540).endFill();
		this._orangeTint.alpha = 0;

		let animTime = 87*FRAME_RATE;
		if (disappearExTime > 0)
		{
			animTime -= disappearExTime;
		}

		if (animTime > 0)
		{
			let seq = [
				{tweens:[{ prop: "alpha", to: 1 }], duration: 0.092*animTime},
				{tweens:[{ prop: "alpha", to: 0 }], duration: 0.908*animTime, onfinish: () => {
					if (this._orangeTint && this._orangeTint.graphicsData) this._orangeTint.destroy();
					this._orangeTint = null;
					this._tryToComplete();
				}}
			];

			Sequence.start(this._orangeTint, seq);
		}

		let captionTime = 7*FRAME_RATE;
		captionTime -= disappearExTime;

		this._fTimer_t && this._fTimer_t.destructor();
		if (captionTime > 0)
		{
			this._fTimer_t = new Timer(()=>{
				this._startCaptionAnimation();
			}, captionTime);
		}
		else
		{
			this._startCaptionAnimation(-captionTime);
		}

		if (animTime <= 0)
		{
			if (this._orangeTint && this._orangeTint.graphicsData) this._orangeTint.destroy();
			this._orangeTint = null;
			this._tryToComplete();
		}
	}

	_startCaptionAnimation(disappearExTime = 0)
	{
		this.emit(DisappearanceView.EVENT_ON_TIME_TO_START_CAPTION_ANIMATION, {bossCaptionType: DRAGON_CAPTION_TYPES.KEEP_PLAYING});

		let fireTime = 29*FRAME_RATE;
		fireTime -= disappearExTime;

		this._fTimer_t && this._fTimer_t.destructor();
		if (fireTime > 0)
		{
			this._fTimer_t = new Timer(()=>{
				this._startFiresFlashAnimation();
			}, fireTime);
		}
		else
		{
			this._startFiresFlashAnimation(-fireTime);
		}
	}

	_startFiresFlashAnimation(disappearExTime = 0)
	{
		this._screenFiresFlashAnimation = this.addChild(new FiresFlashAnimation());
		this._screenFiresFlashAnimation.once(FiresFlashAnimation.EVENT_ON_FIRES_FLASH_ANIMATION_ENDED, this._onFiresFlashAnimationEnded, this);
		this._screenFiresFlashAnimation.startAnimation(disappearExTime);

		this.emit(DisappearanceView.EVENT_ON_GROUND_BURN_REQUIRED);
		
		this._fTimer_t && this._fTimer_t.destructor();
		this._fTimer_t = new Timer(()=>{
			this._onIdleStopRequired();
		}, 5*FRAME_RATE);

		let idleTime = 13*FRAME_RATE;
		idleTime -= disappearExTime;
		this._fTimer_t && this._fTimer_t.destructor();
		if (idleTime > 0)
		{
			this._fTimer_t = new Timer(()=>{
				this._onIdleStopRequired();
			}, idleTime);
		}
		else
		{
			this._onIdleStopRequired(-idleTime);
		}
	}

	_onFiresFlashAnimationEnded()
	{
		this.emit(DisappearanceView.EVENT_ON_FIRE_FLASH_ANIMATION_COMPLETED);

		if (this._screenFiresFlashAnimation)
		{
			this._screenFiresFlashAnimation.destroy();
			this._screenFiresFlashAnimation = null;
		}

		this._tryToComplete();
	}

	_onIdleStopRequired()
	{
		this.emit(DisappearanceView.EVENT_ON_STOP_IDLE_SMOKE_REQUIRED);

		this._fTimer_t && this._fTimer_t.destructor();
		this._fTimer_t = null;

		this._tryToComplete();
	}

	_tryToComplete()
	{
		if (!this._smokeFx && !this._fTimer_t && !this._screenFiresAnimation && !this._screenFiresFlashAnimation && !this._orangeTint)
		{
			this._onDisappearingCompleted();
		}
	}

	_onDisappearingCompleted()
	{
		this._destroyAnimation();

		this.emit(DisappearanceView.EVENT_ON_DISAPPEAR_COMPLETED);
	}

	_destroyAnimation()
	{
		this._fTimer_t && this._fTimer_t.destructor();
		this._fTimer_t = null;

		if (this._smokeFx)
		{
			this._smokeFx.off(SmokeFxView.EVENT_ON_ANIMATION_ENDED, this._onSmokeAnimationEnded, this);
			this._smokeFx.destroy();
		}

		if (this._screenFiresAnimation)
		{
			this._screenFiresAnimation.off(ScreenFiresAnimation.EVENT_ON_SCREEN_FIRES_ANIMATION_ENDED, this._onScreenFiresAnimationEnded, this);
			this._screenFiresAnimation.destroy();
		}

		this._smokeFx = null;
		this._screenFiresAnimation = null;
	}

	destroy()
	{
		this._destroyAnimation();

		super.destroy();
	}
}

export default DisappearanceView;