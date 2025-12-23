import { STATE_WALK } from './Enemy';
import SpineEnemy from './SpineEnemy';

const SUB_ANIMATIONS =
{
	STATE_BLINK:	'blink',
	STATE_ROAR:		'roar'
}

class Crawler extends SpineEnemy
{	
	// override
	getSpineSpeed()
	{
		let lSpeed_num = 1;
		return lSpeed_num
	}

	//override
	get _isSpineFrameSyncRequired()
	{
		return false;
	}

	//override
	get _customSpineTransitionsDescr()
	{
		return [
			{from: "blink", to: "roar", duration: 0.2},
			{from: "roar", to: "blink", duration: 0.2}
		];
	}

	changeSpineView(type, noChangeFrame)
	{
		super.changeSpineView(type, noChangeFrame);

		if (type == STATE_WALK)
		{
			if (!this._fCurrentSubAnimation)
			{
				// this._playSubAnimation(SUB_ANIMATIONS.STATE_BLINK);
			}
		}
		else
		{
			this._fCurrentSubAnimation = null;
		}
	}

	_playSubAnimation(aAnimationName)
	{
		if (this.spineView && this.spineView.view)
		{
			this._fCurrentSubAnimation = aAnimationName;
			this.spineView.setAnimationByName(1, aAnimationName, false);
			this.spineView.view.state.tracks[1].onComplete = this._switchSubAnimation.bind(this);
		}
	}

	_switchSubAnimation()
	{
		let lNewAnimationName = SUB_ANIMATIONS.STATE_BLINK;
		if (this._fCurrentSubAnimation == SUB_ANIMATIONS.STATE_BLINK)
		{
			lNewAnimationName = SUB_ANIMATIONS.STATE_ROAR;
		}

		this._playSubAnimation(lNewAnimationName);
	}
	
	//override
	_calculateAnimationName()
	{
		let animationName = this.getWalkAnimationName();
		return animationName;
	}

	// override
	_calculateSpineSpriteNameSuffix()
	{
		return '';
	}

	//override
	_calculateAnimationLoop()
	{
		let animationLoop = true;

		return animationLoop;
	}

	//override
	getLocalCenterOffset()
	{
		let pos = { x: 0, y: -8 };
		return pos;
	}

	//override
	changeShadowPosition()
	{
		if (!this.spineView)
		{
			return;
		}

		let lX_num = 2*Math.sin(-this.spineView.rotation);
		let lY_num = 2*Math.cos(-this.spineView.rotation);
		this.shadow.position.set(lX_num, lY_num);
		this.shadow.rotation = this.spineView.rotation;
	}
	
	//override
	_getHitRectHeight()
	{
		return 70;
	}

	//override
	_getHitRectWidth()
	{
		return 90;
	}

	get __maxCrosshairDeviationOnEnemyX() //maximum deviation in X position of the cursor on the body of the enemy
	{
		return 21;
	}

	get __maxCrosshairDeviationOnEnemyY() //maximum deviation in Y position of the cursor on the body of the enemy
	{
		return 21;
	}
}

export default Crawler;