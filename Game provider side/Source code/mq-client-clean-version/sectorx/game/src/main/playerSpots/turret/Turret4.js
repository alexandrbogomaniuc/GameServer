import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import {Sprite } from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import { FRAME_RATE } from '../../../../../shared/src/CommonConstants';
import * as Easing from '../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import Timer from "../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer";
import TurretBase from './TurretBase';


class Turret4 extends TurretBase 
{
	constructor(id)
	{
		super(id);
	}

	get __getTurretBottomImage()
	{
		return "weapons/DefaultGun/default_turret_4/turret_bottom";
	}

	get _getTurretBottomOffset()
	{
		return 7;
	}

	get __getTurretTopImage()
	{
		return "weapons/DefaultGun/default_turret_4/turret_top";
	}

	get __getTurretTopOffset()
	{
		return 12;
	}

	_initView()
	{
		super._initView();

		this.addChild(this._getTurretWaveAnimation());

		this._startDisplacementTimer();
	}

	__getBottomGlowShotSprite()
	{
		let lWeaponGlowBottomEffect_spr = APP.library.getSpriteFromAtlas("weapons/DefaultGun/default_turret_4/turret_bottom_shot_glow");
		lWeaponGlowBottomEffect_spr.alpha = 0;
		lWeaponGlowBottomEffect_spr.visible = false;
		lWeaponGlowBottomEffect_spr.anchor.set(0.5, 0.6);
		lWeaponGlowBottomEffect_spr.position.set(0, 6);

		return lWeaponGlowBottomEffect_spr;
	}	

	get __needBottomGlowShotEffect()
	{
		return APP.profilingController.info.isVfxProfileValueMediumOrGreater;
	}

	get __getBubbleImage()
	{
		return "weapons/DefaultGun/default_turret_4/bubble";
	}

	__getBubbleAnimationParam()
	{
		return [	
			{
				scale: {x: 0.25, y: 0.25},
				position: {x: -24, y: 18},
				rise: null
			},
			{
				scale: {x: 0.15, y: 0.15},
				position: {x: -19, y: 8},
				rise: null
			},
			{
				scale: {x: 0.4, y: 0.4},
				position: {x: -19, y: 35},
				rise: null
			},
			{
				scale: {x: 0.12, y: 0.12},
				position: {x: -22, y: 23},
				rise: null
			},
			{
				scale: {x: 0.25, y: 0.25},
				position: {x: 18, y: 23},
				rise: null
			},
			{
				scale: {x: 0.14, y: 0.14},
				position: {x: 23, y: 18},
				rise: null
			},
			{
				scale: {x: 0.25, y: 0.25},
				position: {x: 21, y: 3},
				rise: null
			}
		]
	}

	__getLiguidAnimation()
	{
		let lLiquidContainer_spr = new Sprite();
		lLiquidContainer_spr.position.y = -7;
		lLiquidContainer_spr.position.x = 1;

		let lLiquid = this._fLiquid_spr = lLiquidContainer_spr.addChild(APP.library.getSprite("weapons/DefaultGun/default_turret_4/liquid"));

		let displacementSprite = this._fDisplacementLiquidSprite = this.addChild(APP.library.getSprite("weapons/DefaultGun/liquid_map"));
		const displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
		displacementFilter.padding = 10;
		displacementFilter.aplha = 1;

		displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
		displacementSprite.position = lLiquid.position;
		displacementSprite.scale.set(1,1);
		lLiquid.filters = [displacementFilter];

		let lLiquidTexture = lLiquidContainer_spr.addChild(APP.library.getSpriteFromAtlas("weapons/DefaultGun/default_turret_4/bubble_texture"));
		lLiquidTexture.position.set(0, 9);

		return lLiquidContainer_spr;
	}
	
	__getHitArea()
	{
		let lBounds_obj = this.getLocalBounds();
		return new PIXI.Rectangle(lBounds_obj.x, -75, lBounds_obj.width, 172);
	}

	_getTurretWaveAnimation()
	{
		let lWaveContainer_spr = new Sprite();
		lWaveContainer_spr.position.y = 14;
		lWaveContainer_spr.position.x = 0;

		let lLiquid = this._fWave_spr = lWaveContainer_spr.addChild(APP.library.getSpriteFromAtlas("weapons/DefaultGun/default_turret_4/turret_wave"));

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

		this._fDisplacementWaveSprite.x++;
		if (this._fDisplacementWaveSprite.x > this._fDisplacementWaveSprite.width) { this._fDisplacementWaveSprite.x = 0; }		
	}

	destroy()
	{
		this._fTickDisplacement_tmr && this._fTickDisplacement_tmr.destructor();
		this._fTickDisplacement_tmr = null;
	
		super.destroy();
	}
}

export default Turret4;