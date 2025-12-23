import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { Sprite } from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import { FRAME_RATE } from '../../../../../shared/src/CommonConstants';
import Timer from "../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer";
import TurretBase from './TurretBase';

class Turret2 extends TurretBase 
{
	constructor(id)
	{
		super(id);

	}

	get __getTurretBottomImage()
	{
		return "weapons/DefaultGun/default_turret_2/turret_bottom";
	}

	get _getTurretBottomOffset()
	{
		return -82;
	}

	get __getTurretTopImage()
	{
		return "weapons/DefaultGun/default_turret_2/turret_top";
	}

	get __getTurretTopOffset()
	{
		return -16;
	}

	__getBottomGlowShotSprite()
	{
		return new Sprite();
	}	

	get __needBottomGlowShotEffect()
	{
		return false;
	}

	get __getBubbleImage()
	{
		return "weapons/DefaultGun/default_turret_2/bubble";
	}

	__getBubbleAnimationParam()
	{
		return [
			{
				scale: {x: 0.6, y: 0.6}, //x: 0.75 * 0.8, y: 0.75 * 0.8
				position: {x: -5, y: -9.5},
				rise: null
			},
			{
				scale: {x: 0.375, y: 0.375}, //x: 0.75 * 0.5, y: 0.75  * 0.5
				position: {x: 5, y: -9},
				rise: null
			},
			{
				scale: {x: 0.375, y: 0.375}, //x: 0.75 * 0.5, y: 0.75  * 0.5
				position: {x: -7, y: -17.5},
				rise: null
			},
			{
				scale: {x: 0.1875, y: 0.1875}, //x: 0.75 * 0.25, y: 0.75  * 0.25
				position: {x: -1, y: -14},
				rise: null
			},
			{
				scale: {x: 0.2175, y: 0.2175}, //x: 0.75 * 0.29, y: 0.75  * 0.29
				position: {x: 3, y: -16.5},
				rise: null
			},
			{
				scale: {x: 0.6, y: 0.6}, //x: 0.75 * 0.8, y: 0.75 * 0.8
				position: {x: -22, y: 23},
				rise: null
			},
			{
				scale: {x: 0.375, y: 0.375}, //x: 0.75 * 0.5, y: 0.75  * 0.5
				position: {x: -17, y: 20},
				rise: null
			},
			{
				scale: {x: 0.2175, y: 0.2175}, //x: 0.75 * 0.29, y: 0.75  * 0.29
				position: {x: -13, y: 23.5},
				rise: null
			},


			{
				scale: {x: 0.6, y: 0.6}, //x: 0.75 * 0.8, y: 0.75 * 0.8
				position: {x: 24, y: 18},
				rise: null
			},
			{
				scale: {x: 0.375, y: 0.375}, //x: 0.75 * 0.5, y: 0.75  * 0.5
				position: {x: 17, y: 25},
				rise: null
			},
			{
				scale: {x: 0.2175, y: 0.2175}, //x: 0.75 * 0.29, y: 0.75  * 0.29
				position: {x: 19, y: 21},
				rise: null
			},

		]
	}

	__getLiguidAnimation()
	{
		let lLiquidContainer_spr = new Sprite();
		let lLiquidBg = this._fLiquidBg_spr = lLiquidContainer_spr.addChild(APP.library.getSpriteFromAtlas("weapons/DefaultGun/default_turret_2/liquid_bg"));
		lLiquidBg.position.set(0, 6);

		let lLiquid = this._fLiquid_spr = lLiquidContainer_spr.addChild(APP.library.getSprite("weapons/DefaultGun/default_turret_2/liquid"));

		let displacementSprite = this._fdisplacementSprite = this.addChild(APP.library.getSprite("weapons/DefaultGun/liquid_map"));
		const displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
		displacementFilter.padding = 10;
		displacementFilter.aplha = 0.4;

		displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
		displacementSprite.position = lLiquid.position;
		displacementSprite.scale.set(1,1);
		lLiquid.filters = [displacementFilter];

		this._fTickLiquid_tmr = new Timer(()=>{
			this._tickLiquid();
		}, 1 * FRAME_RATE, true);

		return lLiquidContainer_spr;
	}

	__getHitArea()
	{
		let lBounds_obj = this.getLocalBounds();
		return new PIXI.Rectangle(lBounds_obj.x, -75, lBounds_obj.width, 115);
	}

	_tickLiquid()
	{
		this._fdisplacementSprite.x++;
		if (this._fdisplacementSprite.x > this._fdisplacementSprite.width) { this._fdisplacementSprite.x = 0; }
	}

	destroy()
	{
		this._fTickLiquid_tmr && this._fTickLiquid_tmr.destructor();
		this._fTickLiquid_tmr = null;
	
		super.destroy();
	}
}

export default Turret2;