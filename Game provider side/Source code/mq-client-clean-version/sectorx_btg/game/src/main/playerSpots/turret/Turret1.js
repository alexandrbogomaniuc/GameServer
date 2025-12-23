import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import AtlasSprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import AtlasConfig from '../../../config/AtlasConfig';
import { FRAME_RATE } from '../../../../../shared/src/CommonConstants';
import * as Easing from '../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import TurretBase from './TurretBase';

let _turret1_liquid_textures = null;
function _generateTurret1LiquidTextures()
{
	if (_turret1_liquid_textures) return
	_turret1_liquid_textures = AtlasSprite.getFrames([APP.library.getAsset("weapons/DefaultGun/default_turret_1/liquid")], [AtlasConfig.Turret1Liquid], "");
}

class Turret1 extends TurretBase 
{
	constructor(id)
	{
		super(id);

		this._fBottomRing_spr = null;
		this._fLiquid_spr = null;

		this.addChild(this._getTurretRingAnimation());
	}

	get __defaultShootingEffectDurations()
	{
		return {intro: 3, outro: 8};
	}

	_initView()
	{
		_generateTurret1LiquidTextures();

		super._initView();
	}

	_getTurretRingAnimation()
	{
		let lContainer_spr = this._fTurretRingContainer_spr = new Sprite();

		let lBottomRing = this._fBottomRing_spr = lContainer_spr.addChild(APP.library.getSpriteFromAtlas("weapons/DefaultGun/default_turret_1/turret_bottom_ring"));
		lBottomRing.position.x = 0;
		lBottomRing.position.y = -50.5;
		lBottomRing.alpha = 0;

		this._startBottomRingGlow();

		return lContainer_spr;
	}

	_startBottomRingGlow()
	{
		let l_seq = [
			{tweens: [{prop: 'alpha', to: 1}], duration: 40 * FRAME_RATE, ease: Easing.quadratic.easeOut}, 
			{tweens: [{prop: 'alpha', to: 0}], duration: 40 * FRAME_RATE, ease: Easing.quadratic.easeIn,
				onfinish: ()=>{
					this._startBottomRingGlow();
				}
			}
		];

		Sequence.start(this._fBottomRing_spr, l_seq);
	}

	
	get __getBubbleImage()
	{
		return "weapons/DefaultGun/default_turret_1/bubble";
	}

	get __getTurretBottomImage()
	{
		return "weapons/DefaultGun/default_turret_1/turret_bottom";
	}

	get _getTurretBottomOffset()
	{
		return 8;
	}

	get __getTurretTopImage()
	{
		return "weapons/DefaultGun/default_turret_1/turret_top";
	}

	get __getTurretTopOffset()
	{
		return -25;
	}

	get __needBottomGlowShotEffect()
	{
		return false;
	}

	get __needTopGlowShotEffect()
	{
		return true;
	}

	__getTopGlowShotSprite()
	{
		let lWeaponGlowBottomEffect_spr = APP.library.getSpriteFromAtlas("weapons/DefaultGun/default_turret_1/turret_top_ring");
		lWeaponGlowBottomEffect_spr.alpha = 0;
		lWeaponGlowBottomEffect_spr.anchor.set(0.5, 0.6);
		lWeaponGlowBottomEffect_spr.position.set(0, -57);

		return lWeaponGlowBottomEffect_spr;
	}

	__getBubbleAnimationParam()
	{
		return [
			{
				scale: {x: 0.25, y: 0.25}, 
				position: {x: -4, y: 5},
				rise: null
			},
			{
				scale: {x: 0.13, y: 0.14}, //x: 0.52 * 0.25, y: 0.56 * 0.25
				position: {x: 8, y: 15},
				rise: null
			},
			{
				scale: {x: 0.145, y: 0.155}, //x: 0.58 * 0.25, y: 0.62 * 0.25
				position: {x: 4, y: 3},
				rise: null
			},
			{
				scale: {x: 0.075, y: 0.0825}, //x: 0.3 * 0.25, y: 0.33 * 0.25
				position: {x: 3, y: -3},
				rise: null
			},
			{
				scale: {x: 0.25, y: 0.25}, //x: 1 * 0.25, y: 1 * 0.25
				position: {x: 6, y: 15},
				rise: {delay: 15, y_rise: 25.2, duration: 59, finish_delay: 29}
			},
			{
				scale: {x: 0.13, y: 0.14}, //x: 0.52 * 0.25, y: 0.56 * 0.25
				position: {x: -6, y: 17},
				rise: {delay: 34, y_rise: 33.5, duration: 86, finish_delay: 0}
			},
			{
				scale: {x: 0.145, y: 0.155}, //x: 0.58 * 0.25, y: 0.62 * 0.25
				position: {x: -0.5, y: 15.5},
				rise: {delay: 13, y_rise: 93, duration: 124, finish_delay: 0}
			},
			{
				scale: {x: 0.08, y: 0.08}, //0.32 * 0.25, y: 0.32 * 0.25
				position: {x: -10, y: 20},
				rise: {delay: 0, y_rise: 60, duration: 108, finish_delay: 0}
			}
		]
	}

	__getLiguidAnimation()
	{
		let lLiquid = this._fLiquid_spr = APP.library.getSprite("weapons/DefaultGun/default_turret_1/liquid");

		lLiquid.textures = _turret1_liquid_textures;
		lLiquid.animationSpeed = 0.5; //30 / 60;
		lLiquid.position.x = 0; 
		lLiquid.position.y = 4; 
		lLiquid.loop = true;
		lLiquid.play();

		return lLiquid;
	}

	__getHitArea()
	{
		let lBounds_obj = this.getLocalBounds();
		return new PIXI.Rectangle(lBounds_obj.x, -56, lBounds_obj.width, 110);
	}

	destroy()
	{
		this._fLiquid_spr && this._fLiquid_spr.destroy();
		this._fLiquid_spr = null;
		
		this._fBottomRing_spr && Sequence.destroy(Sequence.findByTarget(this._fBottomRing_spr));
		this._fBottomRing_spr && this._fBottomRing_spr.destroy();
		this._fBottomRing_spr = null;
	
		super.destroy();
	}
}

export default Turret1;