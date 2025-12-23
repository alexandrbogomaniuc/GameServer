import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { AtlasSprite } from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/index';
import AtlasConfig from '../../../config/AtlasConfig';
import * as Easing from '../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import Timer from "../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer";
import { Utils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../shared/src/CommonConstants';

let _aura_textures = null;
function _generateAuraTextures()
{
	if (_aura_textures) return;

	_aura_textures = AtlasSprite.getFrames([APP.library.getAsset("enemies/specter/lightning/aura")], [AtlasConfig.FireSpecterAura], "");
}

let _single_lightning_textures = null;
function _generateSingleLightningTextures()
{
	if (_single_lightning_textures) return;

	_single_lightning_textures = AtlasSprite.getFrames([APP.library.getAsset("enemies/specter/lightning/single_lightning")], [AtlasConfig.SpecterSingleLightning], "");
}

let _area_lightning_textures = null;
function _generateAreaLightningTextures()
{
	if (_area_lightning_textures) return;

	_area_lightning_textures = AtlasSprite.getFrames([APP.library.getAsset("enemies/specter/lightning/area_lightning")], [AtlasConfig.SpecterAreaLightning], "");
}

const SINGLE_LIGHTNINGS_CONFIG = {
	start_interval: {min: 5*FRAME_RATE, max: 17*FRAME_RATE},
	positions_dispersion: {x: 50, y: -100}, // -x .. x / 0 .. y
	scales_dispersion: {min: 1.2, max: 2},
	alpha_dispersion: {min: 0.6, max: 1},
	rotation_dispersion: {min: -Math.PI/2, max: Math.PI/2}
};

const AREA_LIGHTNINGS_CONFIG = {
	start_interval: {min: 11*FRAME_RATE, max: 20*FRAME_RATE},
	positions_dispersion: {x: 70, y: -40}, // -x .. x / 0 .. y
	scales_dispersion: {min: 1.6, max: 2.4}
};

class LightningSpecterIdleAnimation extends Sprite
{
	static get EVENT_ON_ANIMATION_ENDED()				{return "onAnimationEnded";}

	startAnimation()
	{
		this._startAnimation();
	}

	finishLightningsAnimations()
	{
		this._finishLightningsAnimations();
	}

	finishAurasAnimations()
	{
		this._finishAurasAnimations();
	}

	constructor(backContainer)
	{
		super();

		_generateAuraTextures();
		_generateSingleLightningTextures();
		_generateAreaLightningTextures();

		// let debugBack = this.addChild(new PIXI.Graphics());
		// debugBack.beginFill(0x000000).drawRect(-960, -540, 960*2, 540*2).endFill();
		// let debugCent = debugBack.addChild(new PIXI.Graphics());
		// debugCent.beginFill(0xff0000).drawRect(-2, -2, 1, 1).endFill();

		this._backContainer = backContainer || this.addChild(new Sprite());
		this._singleLightningTimer = null;
		this._areaTimer = null;
		this._animationsCounter = 0;
	}

	_startAnimation()
	{
		this._startAurasAnimation();
		this._startNextSingleLightningAnimaton();
		this._startNextAreaAnimation();
	}

	_startAurasAnimation()
	{
		this._feetAura = this._getAura({x: 0, y: 20}, {x: 2.5, y: 2});
		this._backAura = this._getAura({x: 0, y: -30}, {x: 3, y: 3.5});

		let seq = [{tweens: [{prop: "alpha", to: 1}], duration: 4*FRAME_RATE}];

		Sequence.start(this._feetAura, seq);
		Sequence.start(this._backAura, seq);
	}

	_getAura(pos, scale)
	{
		let aura = this._backContainer.addChild(new Sprite());
		aura.textures = _aura_textures;
		aura.position.set(pos.x, pos.y);
		aura.scale.set(scale.x, scale.y);
		aura.blendMode = PIXI.BLEND_MODES.SCREEN;
		aura.animationSpeed = 24/60;
		aura.alpha = 0;
		aura.play();

		return aura;
	}

	_startNextAreaAnimation()
	{
		this._areaTimer && this._areaTimer.destructor();
		this._areaTimer = null;

		let t = Utils.random(AREA_LIGHTNINGS_CONFIG.start_interval.min, AREA_LIGHTNINGS_CONFIG.start_interval.max);
		let posX = Utils.random(-AREA_LIGHTNINGS_CONFIG.positions_dispersion.x, AREA_LIGHTNINGS_CONFIG.positions_dispersion.x);
		let posY = Utils.random(0, AREA_LIGHTNINGS_CONFIG.positions_dispersion.y);
		let scaleX = Utils.random(AREA_LIGHTNINGS_CONFIG.scales_dispersion.min, AREA_LIGHTNINGS_CONFIG.scales_dispersion.max);
		let scaleY = Utils.random(AREA_LIGHTNINGS_CONFIG.scales_dispersion.min, AREA_LIGHTNINGS_CONFIG.scales_dispersion.max);
		this._areaTimer = new Timer(()=>{
			this._generateAreaLightning({x: posX, y: posY}, {x: scaleX, y: scaleY});
			this._startNextAreaAnimation();
		}, t);
	}

	_generateAreaLightning(pos, scale)
	{
		let light = this.addChild(new Sprite());
		light.textures = _area_lightning_textures;
		light.blendMode = PIXI.BLEND_MODES.SCREEN;
		light.position.set(pos.x, pos.y);
		light.scale.set(scale.x, scale.y);
		light.animationSpeed = 0.3;

		++this._animationsCounter;
		light.once("animationend", ()=>{
			--this._animationsCounter;
			light && light.destroy();
			this._tryToCompleteAnimation();
		});
		light.play();

		return light;
	}

	_startNextSingleLightningAnimaton()
	{
		this._singleLightningTimer && this._singleLightningTimer.destructor();
		this._singleLightningTimer = null;

		let t = Utils.random(SINGLE_LIGHTNINGS_CONFIG.start_interval.min, SINGLE_LIGHTNINGS_CONFIG.start_interval.max);
		let posX = Utils.random(-SINGLE_LIGHTNINGS_CONFIG.positions_dispersion.x, SINGLE_LIGHTNINGS_CONFIG.positions_dispersion.x);
		let posY = Utils.random(0, SINGLE_LIGHTNINGS_CONFIG.positions_dispersion.y);
		let scaleX = Utils.random(SINGLE_LIGHTNINGS_CONFIG.scales_dispersion.min, SINGLE_LIGHTNINGS_CONFIG.scales_dispersion.max);
		let scaleY = Utils.random(SINGLE_LIGHTNINGS_CONFIG.scales_dispersion.min, SINGLE_LIGHTNINGS_CONFIG.scales_dispersion.max);
		let angle = Utils.random(SINGLE_LIGHTNINGS_CONFIG.rotation_dispersion.min, SINGLE_LIGHTNINGS_CONFIG.rotation_dispersion.max);
		let alpha = Utils.random(SINGLE_LIGHTNINGS_CONFIG.alpha_dispersion.min, SINGLE_LIGHTNINGS_CONFIG.alpha_dispersion.max);
		this._singleLightningTimer = new Timer(()=>{
			this._generateSingleLightning({x: posX, y: posY}, {x: scaleX, y: scaleY}, angle, alpha);
			this._startNextSingleLightningAnimaton();
		}, t);
	}

	_generateSingleLightning(pos, scale, angle, alpha)
	{
		let light = this.addChild(new Sprite());
		light.textures = _single_lightning_textures;
		light.blendMode = PIXI.BLEND_MODES.SCREEN;
		light.position.set(pos.x, pos.y);
		light.scale.set(scale.x, scale.y);
		light.rotation = angle;
		light.animationSpeed = 0.4;
		light.alpha = alpha;

		++this._animationsCounter;
		light.once("animationend", ()=>{
			light.gotoAndStop(3);
			light.fadeTo(0, 16*FRAME_RATE, Easing.quadratic.easeIn, ()=>{
				--this._animationsCounter;
				light && light.destroy();
				this._tryToCompleteAnimation();
			});
		});
		light.play();

		return light;
	}

	_finishLightningsAnimations()
	{
		this._destroyTimers();

		this._tryToCompleteAnimation();
	}

	_finishAurasAnimations()
	{
		let seq = [{tweens: [{prop: "alpha", to: 0}], duration: 4*FRAME_RATE, onfinish: ()=>{
			this._destroyAuras();
			this._tryToCompleteAnimation();
		}}];

		Sequence.start(this._feetAura, seq);
		Sequence.start(this._backAura, seq);
	}

	_destroyAuras()
	{
		if (this._feetAura)
		{
			Sequence.destroy(Sequence.findByTarget(this._feetAura));
			this._feetAura.destroy();
			this._feetAura = null;
		}

		if (this._backAura)
		{
			Sequence.destroy(Sequence.findByTarget(this._backAura));
			this._backAura.destroy();
			this._backAura = null;
		}
	}

	_destroyTimers()
	{
		this._singleLightningTimer && this._singleLightningTimer.destructor();
		this._singleLightningTimer = null;
		this._areaTimer && this._areaTimer.destructor();
		this._areaTimer = null;
	}

	_tryToCompleteAnimation()
	{
		if (this._animationsCounter <= 0 && !this._feetAura && !this._backAura && !this._areaTimer && !this._singleLightningTimer)
		{
			this._onAnimationEnded();
		}
	}

	_onAnimationEnded()
	{
		this.emit(LightningSpecterIdleAnimation.EVENT_ON_ANIMATION_ENDED);
	}

	destroy()
	{
		this._destroyAuras();
		this._destroyTimers();

		this._feetAura && this._feetAura.destroy();
		this._backAura && this._backAura.destroy();

		super.destroy();

		this._backContainer = null;
		this._animationsCounter = null;
		this._feetAura = null;
		this._backAura = null;
	}
}

export default LightningSpecterIdleAnimation;