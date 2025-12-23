import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import {Sprite } from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import { FRAME_RATE } from '../../../../../shared/src/CommonConstants';
import * as Easing from '../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import Timer from "../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer";
import TurretBase from './TurretBase';


class Turret3 extends TurretBase 
{
	constructor(id)
	{
		super(id);

	}

	get __getTurretBottomImage()
	{
		return "weapons/DefaultGun/default_turret_3/turret_bottom";
	}

	get _getTurretBottomOffset()
	{
		return 24;
	}

	get __getTurretTopImage()
	{
		return "weapons/DefaultGun/default_turret_3/turret_top";
	}

	get __getTurretTopOffset()
	{
		return 10;
	}

	_initView()
	{
		this.addChild(this._getTurretBottomAnimation());

		super._initView();
	}

	_getTurretBottomAnimation()
	{
		let lBottomGlow = this._fBottomGlow_spr = APP.library.getSpriteFromAtlas("weapons/DefaultGun/default_turret_3/turret_bottom_glow");
		lBottomGlow.position.x = 0;
		lBottomGlow.position.y = 28;
		lBottomGlow.alpha = 0.42;

		this._startBottomGlow();

		return lBottomGlow;
	}

	_startBottomGlow()
	{
		let l_seq = [
			{tweens: [{prop: 'alpha', to: 1}], duration: 40 * FRAME_RATE, ease: Easing.quadratic.easeOut}, 
			{tweens: [{prop: 'alpha', to: 0.42}], duration: 40 * FRAME_RATE, ease: Easing.quadratic.easeIn,
				onfinish: ()=>{
					this._startBottomGlow();
				}
			}
		];

		Sequence.start(this._fBottomGlow_spr, l_seq);
	}


	__getBottomGlowShotSprite()
	{
		let lWeaponGlowBottomEffect_spr = APP.library.getSpriteFromAtlas("weapons/DefaultGun/default_turret_3/turret_shot_glow");
		lWeaponGlowBottomEffect_spr.alpha = 0;
		lWeaponGlowBottomEffect_spr.anchor.set(0.5, 0.6);
		lWeaponGlowBottomEffect_spr.position.set(0, -72);

		return lWeaponGlowBottomEffect_spr;
	}	

	get __needBottomGlowShotEffect()
	{
		return APP.profilingController.info.isVfxProfileValueMediumOrGreater;
	}

	get __getBubbleImage()
	{
		return "weapons/DefaultGun/default_turret_2/bubble";
	}

	__getBubbleAnimationParam()
	{
		return [	
		]
	}

	__getLiguidAnimation()
	{
		let lLiquidContainer_spr = new Sprite();
		lLiquidContainer_spr.position.y = 22;
		lLiquidContainer_spr.position.x = 1;

		let lLiquid = this._fLiquid_spr = lLiquidContainer_spr.addChild(APP.library.getSprite("weapons/DefaultGun/default_turret_3/liquid"));

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
		return new PIXI.Rectangle(lBounds_obj.x, -87, lBounds_obj.width, 135);
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

export default Turret3;