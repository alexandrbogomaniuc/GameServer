import Map4FXAnimation from './Map4FXAnimation';

class Map5FXAnimation extends Map4FXAnimation
{
	constructor()
	{
		super();
	}

	//override
	_startAnimation()
	{
		this._startSendAnimation();
	}

	//override
	_addFlare()
	{

	}

	destroy()
	{
		super.destroy();
	}
}

export default Map5FXAnimation;