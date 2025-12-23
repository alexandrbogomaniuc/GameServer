class RectComponent
{
	constructor(aCenterX, aCenterY, aWidth, aHeight)
	{
		this._centerX = aCenterX
		this._centerY = aCenterY
		this._width = aWidth
		this._height = aHeight
	}

	get centerX()
	{
		return this._centerX;
	}

	get centerY()
	{
		return this._centerY;
	}

	get width()
	{
		return this._width;
	}

	get height()
	{
		return this._height;
	}

	moveTo(x, y)
	{
		this._centerX = x;
		this._centerY = y;
	}

	clone()
	{
		return new RectComponent(this.centerX, this.centerY, this.width, this.height);
	}
}

export default RectComponent