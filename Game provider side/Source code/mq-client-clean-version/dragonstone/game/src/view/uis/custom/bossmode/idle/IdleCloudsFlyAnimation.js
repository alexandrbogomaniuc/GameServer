import Sprite from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import IdleCloudFly from './IdleCloudFly';

class IdleCloudsFlyAnimation extends Sprite
{
	static get EVENT_ON_CLOUDS_ANIMATION_FINISHED()			{return "onCloudsAnimationEnded";}

	startAnimation()
	{
		this._startAnimation();
	}

	finishAnimation()
	{
		this._finishAnimation();
	}

	constructor()
	{
		super();

		this._fCloudsOne = null;
		this._fCloudsTwo = null;
		this._fCloudsThree = null;
	}

	_startAnimation()
	{
		this._fCloudsOne = this.addChild(new IdleCloudFly());
		this._fCloudsOne.on(IdleCloudFly.EVENT_ON_CLOUD_ANIMATION_ENDED, this._onCloudAnimationEnded, this);
		this._fCloudsOne.position.set(0, 115);
		this._fCloudsOne.scale.set(1, 1.35);
		this._fCloudsOne.startAnimation();

		this._fCloudsTwo = this.addChild(new IdleCloudFly());
		this._fCloudsTwo.on(IdleCloudFly.EVENT_ON_CLOUD_ANIMATION_ENDED, this._onCloudAnimationEnded, this);
		this._fCloudsTwo.position.set(0, 250);
		this._fCloudsTwo.scale.set(1, 1.3);
		this._fCloudsTwo.startAnimation();

		this._fCloudsThree = this.addChild(new IdleCloudFly());
		this._fCloudsThree.on(IdleCloudFly.EVENT_ON_CLOUD_ANIMATION_ENDED, this._onCloudAnimationEnded, this);
		this._fCloudsThree.position.set(0, 385);
		this._fCloudsThree.scale.set(1, 1.55);
		this._fCloudsThree.startAnimation();
	}

	_onCloudAnimationEnded(e)
	{
		if (this._fCloudsOne == e.target)
		{
			this._fCloudsOne.destroy();
			this._fCloudsOne = null;
		}

		if (this._fCloudsTwo == e.target)
		{
			this._fCloudsTwo.destroy();
			this._fCloudsTwo = null;
		}

		if (this._fCloudsThree == e.target)
		{
			this._fCloudsThree.destroy();
			this._fCloudsThree = null;
		}

		if (!this._fCloudsOne && !this._fCloudsTwo && !this._fCloudsThree)
		{
			this._onCludsAnimationEnded();
		}
	}

	_finishAnimation()
	{
		this._fCloudsOne && this._fCloudsOne.finishAnimation();
		this._fCloudsTwo && this._fCloudsTwo.finishAnimation();
		this._fCloudsThree && this._fCloudsThree.finishAnimation();
	}

	_onCludsAnimationEnded()
	{
		this.emit(IdleCloudsFlyAnimation.EVENT_ON_CLOUDS_ANIMATION_FINISHED);
	}

	destroy()
	{
		super.destroy();

		this._fCloudsOne = null;
		this._fCloudsTwo = null;
		this._fCloudsThree = null;
	}
}

export default IdleCloudsFlyAnimation;