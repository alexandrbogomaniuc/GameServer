import CircleComponent from './CircleComponent';
import RectComponent from './RectComponent';

export const COLLIDER_COMPONENT_TYPES = 
{
	CIRCLE: "circle",
	RECT: "rect"
}

class ColliderInfo
{
	constructor(aOptColliderComponentsDescr=undefined)
	{
		this._circles = [];
		this._rects = [];

		this._position = new PIXI.Point(0, 0);

		if (!!aOptColliderComponentsDescr)
		{
			this._parseComponentsDescriptor(aOptColliderComponentsDescr);
		}
	}

	set x(value)
	{
		this._position.x = value;
	}

	get x()
	{
		return this._position.x;
	}

	set y(value)
	{
		this._position.y = value;
	}

	get y()
	{
		return this._position.y;
	}

	get position()
	{
		return this._position;
	}

	addCircle(aCircleComponent)
	{
		this._circles.push(aCircleComponent);
	}

	removeCircle(aCircleComponent)
	{
		let lCircleIndex = this._circles.indexOf(aCircleComponent);

		if (lCircleIndex >= 0)
		{
			this._circles.splice(lCircleIndex);
		}
	}

	addRect(aRectComponent)
	{
		this._rects.push(aRectComponent);
	}

	get circles()
	{
		return this._circles;
	}

	get rects()
	{
		return this._rects;
	}

	get globalCircles()
	{
		let lGlobalCircles = [];
		for (let i=0; i<this.circles.length; i++)
		{
			let lCircle = this.circles[i].clone();
			lCircle.moveTo(this.x + lCircle.centerX, this.y + lCircle.centerY);

			lGlobalCircles.push(lCircle);
		}

		return lGlobalCircles;
	}

	get globalRects()
	{
		let lGlobalRects = [];
		for (let i=0; i<this.rects.length; i++)
		{
			let lRect = this.rects[i].clone();
			lRect.moveTo(this.x + lRect.centerX, this.y + lRect.centerY);

			lGlobalRects.push(lRect);
		}

		return lGlobalRects;
	}

	_parseComponentsDescriptor(aComponentsDescr)
	{
		for (let i=0; i<aComponentsDescr.length; i++)
		{
			let lComponentDescr = aComponentsDescr[i];

			switch (lComponentDescr.type)
			{
				case COLLIDER_COMPONENT_TYPES.CIRCLE:
					this.addCircle(new CircleComponent(lComponentDescr.centerX, lComponentDescr.centerY, lComponentDescr.radius));
					break;
				case COLLIDER_COMPONENT_TYPES.RECT:
					this.addRect(new RectComponent(lComponentDescr.centerX, lComponentDescr.centerY, lComponentDescr.width, lComponentDescr.height));
					break;
			}
		}
	}

	destroy()
	{
		this._circles = null;
		this._rects = null;

		this._position = null;
	}
}

export default ColliderInfo;