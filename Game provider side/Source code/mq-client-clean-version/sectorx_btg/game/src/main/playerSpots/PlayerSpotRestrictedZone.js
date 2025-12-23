import Button from '../../../../../common/PIXI/src/dgphoenix/unified/view/ui/Button';

class PlayerSpotRestrictedZone extends Button {

	static get TYPE_HIT_ZONE_CIRCLE()			{return 1;}
	static get TYPE_HIT_ZONE_RECT()				{return 2;}
	static get TYPE_HIT_ZONE_ROUNDED_RECT()		{return 3;}

	constructor(type_int, param_obj) {
		super();

		this._fTypeArea_int = type_int;
		this._fParam_obj = param_obj;
		this.position.set(param_obj.x, param_obj.y)

		this._init()
		this._initButtonBehaviour();
	}

	hitTestPoint(x, y)
	{
		let lPoint_obj;

		if(y === undefined) lPoint_obj = x;
		else lPoint_obj = new PIXI.Point(x, y);
		return this.hitArea.contains(lPoint_obj.x, lPoint_obj.y);
	}

	_init()
	{
		//DEBUG... 
		//Needed to highlight buttons
		// this._fButton_b = this.addChild(new PIXI.Graphics());

		// if (this.isAllParamsForAreaExists())
		// {
		// 	switch(this._fTypeArea_int)
		// 	{
		// 		case PlayerSpotRestrictedZone.TYPE_HIT_ZONE_CIRCLE:
		// 				this._fButton_b.beginFill(0xFF0000).drawCircle(0, 0, this._fParam_obj.width, this._fParam_obj.height).endFill();	
		// 			break;
		// 		case PlayerSpotRestrictedZone.TYPE_HIT_ZONE_RECT:
		// 				this._fButton_b.beginFill(0xFF0000).drawRect(-this._fParam_obj.width/2, -this._fParam_obj.height/2, this._fParam_obj.width, this._fParam_obj.height).endFill();	
		// 			break;
		// 		case PlayerSpotRestrictedZone.TYPE_HIT_ZONE_ROUNDED_RECT:
		// 			this._fButton_b.beginFill(0xFF0000).drawRoundedRect(-this._fParam_obj.width/2, -this._fParam_obj.height/2, this._fParam_obj.width, this._fParam_obj.height, this._fParam_obj.radius).endFill();	
		// 			break;
		// 		default:
		// 			break;
		// 	}
		// }
		
		// this._fButton_b.alpha = 0.2;
		//...DEBUG
	}

	_initButtonBehaviour()
	{
		if (this.isAllParamsForAreaExists())
		{
			
			switch(this._fTypeArea_int)
			{
				case PlayerSpotRestrictedZone.TYPE_HIT_ZONE_CIRCLE:
					this.setHitArea(new PIXI.Circle(0, 0, this._fParam_obj.width, this._fParam_obj.height));
					this.setEnabled();
					break;
				case PlayerSpotRestrictedZone.TYPE_HIT_ZONE_RECT:
						this.setHitArea(new PIXI.Rectangle(-this._fParam_obj.width/2, -this._fParam_obj.height/2, this._fParam_obj.width, this._fParam_obj.height));
						this.setEnabled();
					break;
				case PlayerSpotRestrictedZone.TYPE_HIT_ZONE_ROUNDED_RECT:
						this.setHitArea(new PIXI.RoundedRectangle(-this._fParam_obj.width/2, -this._fParam_obj.height/2, this._fParam_obj.width, this._fParam_obj.height, this._fParam_obj.radius));
						this.setEnabled();
					break;
				default:
					break;
			}
		}
		else
		{
			APP.logger.i_pushWarning(`PlayerSpotRestrictedZone. [WARNING] Not all parameters for the zone are available!`);
			console.log("[WARNING] Not all parameters for the zone are available!");
		}

		this.on("pointerdown", (e)=>e.stopPropagation(), this);
		this.on("pointerclick", (e)=>e.stopPropagation(), this);
	}

	isAllParamsForAreaExists()
	{
		return this._fParam_obj.x != undefined && this._fParam_obj.y != undefined && this._fParam_obj.width != undefined && this._fParam_obj.height != undefined;
	}

	destroy()
	{
		this.off("pointerdown", (e)=>e.stopPropagation(), this);
		this.off("pointerclick", (e)=>e.stopPropagation(), this);

		this._fTypeArea_int = null;
		this._fParam_obj = null;

		super.destroy();
	}
}

export default PlayerSpotRestrictedZone;