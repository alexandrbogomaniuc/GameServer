class CircleComponent
{
	constructor(aCenterX, aCenterY, aRadius)
	{
		this._centerX = aCenterX
		this._centerY = aCenterY
		this._radius = aRadius
	}

	get centerX()
	{
		return this._centerX;
	}

	get centerY()
	{
		return this._centerY;
	}

	get radius()
	{
		return this._radius;
	}

	moveTo(x, y)
	{
		this._centerX = x;
		this._centerY = y;
	}

	clone()
	{
		return new CircleComponent(this.centerX, this.centerY, this.radius);
	}
}

export default CircleComponent