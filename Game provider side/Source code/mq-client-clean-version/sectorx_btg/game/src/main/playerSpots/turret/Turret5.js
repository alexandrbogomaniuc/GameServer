import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import {Sprite } from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import { FRAME_RATE } from '../../../../../shared/src/CommonConstants';
import * as Easing from '../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import Timer from "../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer";
import TurretBase from './TurretBase';


class Turret5 extends TurretBase 
{
	constructor(id)
	{
		super(id);
	}

	get __getTurretBottomImage()
	{
		return "weapons/DefaultGun/default_turret_5/turret_bottom";
	}

	get _getTurretBottomOffset()
	{
		return -7;
	}

	get __getTurretTopImage()
	{
		return "weapons/DefaultGun/default_turret_5/turret_top";
	}

	get __getTurretTopOffset()
	{
		return -7;
	}

	_initView()
	{
		super._initView();

		this._startDisplacementTimer();
	}

	get __needBottomGlowShotEffect()
	{
		return false;
	}

	get __getBubbleImage()
	{
		return "weapons/DefaultGun/default_turret_5/bubble";
	}

	__getBubbleAnimationParam()
	{
		return [
			{
				scale: {x: 1, y: 1},
				position: {x: 12, y: 74},
				rise: null
			},
			{
				scale: {x: .5, y: 0.5},
				position: {x: 0, y: 79},
				rise: null
			},
			{
				scale: {x: 0.5, y: 0.5},
				position: {x: -11, y: 81},
				rise: null
			},
			{
				scale: {x: 0.3, y: 0.3},
				position: {x: -7, y: 66},
				rise: null
			},
		]
	}

	__getLiguidAnimation()
	{
		let lLiquidContainer_spr = new Sprite();
		lLiquidContainer_spr.position.y = 40;
		lLiquidContainer_spr.position.x = 1;

		let lLiquid = this._fLiquid_spr = lLiquidContainer_spr.addChild(APP.library.getSprite("weapons/DefaultGun/default_turret_5/liquid"));

		let displacementSprite = this._fDisplacementLiquidSprite = this.addChild(APP.library.getSprite("weapons/DefaultGun/liquid_map"));
		const displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
		displacementFilter.padding = 10;
		displacementFilter.aplha = 1;

		displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
		displacementSprite.position = lLiquid.position;
		displacementSprite.scale.set(1,1);
		lLiquid.filters = [displacementFilter];

		let lLiquidTexture = lLiquidContainer_spr.addChild(APP.library.getSpriteFromAtlas("weapons/DefaultGun/default_turret_5/bubble_texture"));
		lLiquidTexture.position.set(-1, -28);

		return lLiquidContainer_spr;
	}

	__getWaveAnimation()
	{
		let lWaveContainer_spr = new Sprite();
		lWaveContainer_spr.position.y = -11;
		lWaveContainer_spr.position.x = 3;

		let lLiquid = this._fWave_spr = lWaveContainer_spr.addChild(APP.library.getSpriteFromAtlas("weapons/DefaultGun/default_turret_5/turret_wave"));

		let displacementSprite = this._fDisplacementWaveSprite = this.addChild(APP.library.getSprite("weapons/DefaultGun/liquid_map"));
		const displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
		displacementFilter.padding = 10;
		displacementFilter.aplha = 1;

		displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
		displacementSprite.position = lLiquid.position;
		displacementSprite.scale.set(1,1);
		lLiquid.filters = [displacementFilter];

		return lWaveContainer_spr;
	}
	
	__getHitArea()
	{
		let lBounds_obj = this.getLocalBounds();
		return new PIXI.Rectangle(lBounds_obj.x, -114, lBounds_obj.width, 202);
	}

	_startDisplacementTimer()
	{
		this._fTickDisplacement_tmr = new Timer(()=>{
			this._tickDisplacement();
		}, 1 * FRAME_RATE, true);
	}

	_tickDisplacement()
	{
		this._fDisplacementLiquidSprite.x++;
		if (this._fDisplacementLiquidSprite.x > this._fDisplacementLiquidSprite.width) { this._fDisplacementLiquidSprite.x = 0; }

		this._fDisplacementWaveSprite.x += 1.1;
		if (this._fDisplacementWaveSprite.x > this._fDisplacementWaveSprite.width) { this._fDisplacementWaveSprite.x = 0; }
	}

	destroy()
	{
		this._fTickDisplacement_tmr && this._fTickDisplacement_tmr.destructor();
		this._fTickDisplacement_tmr = null;
	
		super.destroy();
	}
}

export default Turret5;