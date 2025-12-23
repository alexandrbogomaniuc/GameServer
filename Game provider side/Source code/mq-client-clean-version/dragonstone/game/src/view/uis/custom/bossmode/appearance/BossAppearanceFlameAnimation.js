import Sprite from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import FiresFlashAnimation from '../disappearance/FiresFlashAnimation';
import { FRAME_RATE } from '../../../../../../../shared/src/CommonConstants';
import Sequence from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';

const NEXT_FIRES_DELAYS = {
	SIDE_FIRES_FLASH: 64*FRAME_RATE,
	FIRES_FLASH: 25*FRAME_RATE
}

class BossAppearanceFlameAnimation extends Sprite
{
	static get EVENT_ON_ANIMATION_ENDED()			{return "EVENT_ON_ANIMATION_ENDED";}

	startAnimation(aDurationExTime=0)
	{
		this._startAnimation(aDurationExTime);
	}

	constructor()
	{
		super();

		this._fireFlash_1 = null;
		this._fireFlash_2 = null;
		this._fireSidesFlash = null;
	}

	_startAnimation(aDurationExTime=0)
	{
		this._fireFlash_1 = this.addChild(new FiresFlashAnimation(FiresFlashAnimation.TYPES.NORMAL));

		this._fireFlash_1.once(FiresFlashAnimation.EVENT_ON_FIRES_FLASH_ANIMATION_ENDED, this._onFirstFiresFlashAnimationEnded, this);
		this._fireFlash_1.startAnimation(aDurationExTime);

		this._fireFlash_2 = this.addChild(new FiresFlashAnimation(FiresFlashAnimation.TYPES.NORMAL));
		this._fireSidesFlash = this.addChild(new FiresFlashAnimation(FiresFlashAnimation.TYPES.SIDES));

		let lFlames_seq = [
			{ tweens:[],	duration: NEXT_FIRES_DELAYS.SIDE_FIRES_FLASH, onfinish: () => { this._onSidesFiresFlashTime(); }},
			{ tweens:[],	duration: NEXT_FIRES_DELAYS.FIRES_FLASH, onfinish: () => { this._onSecondFiresFlashTime(); }}
		];
		
		Sequence.start(this, lFlames_seq);
	}

	_onFirstFiresFlashAnimationEnded(event)
	{
		this._fireFlash_1.destroy();
		this._fireFlash_1 = null;

		this._tryToCompleteAnimation();
	}

	_onSecondFiresFlashTime()
	{
		this._fireFlash_2.once(FiresFlashAnimation.EVENT_ON_FIRES_FLASH_ANIMATION_ENDED, this._onSecondFiresFlashAnimationEnded, this);
		this._fireFlash_2.startAnimation();
	}

	_onSecondFiresFlashAnimationEnded(event)
	{
		this._fireFlash_2.destroy();
		this._fireFlash_2 = null;

		this._tryToCompleteAnimation();
	}

	_onSidesFiresFlashTime()
	{
		this._fireSidesFlash.once(FiresFlashAnimation.EVENT_ON_FIRES_FLASH_ANIMATION_ENDED, this._onSidesFiresFlashAnimationEnded, this);
		this._fireSidesFlash.startAnimation();
	}

	_onSidesFiresFlashAnimationEnded(event)
	{
		this._fireSidesFlash.destroy();
		this._fireSidesFlash = null;

		this._tryToCompleteAnimation();
	}

	_tryToCompleteAnimation()
	{
		if (!this._fireFlash_2 && !this._fireFlash_2 && !this._fireSidesFlash)
		{
			this._onAnimationCompleted();
		}
	}

	_onAnimationCompleted()
	{
		this.emit(BossAppearanceFlameAnimation.EVENT_ON_ANIMATION_ENDED);
	}

	destroy()
	{
		Sequence.destroy(Sequence.findByTarget(this));

		this._fireFlash_1 = null;
		this._fireFlash_2 = null;
		this._fireSidesFlash = null;

		super.destroy();
	}
}

export default BossAppearanceFlameAnimation;