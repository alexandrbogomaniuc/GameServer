import { Sequence } from "../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation";
import { Sprite } from "../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display";
import { APP } from "../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals";
import { FRAME_RATE } from "../../../../../shared/src/CommonConstants";
import * as Easing from '../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import Timer from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import AtlasConfig from '../../../config/AtlasConfig';
import { AtlasSprite } from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';

let _lightning_explosion_ring_texture = null;
function _generateLightningExplosionRingTextures()
{
	if (_lightning_explosion_ring_texture) return

	_lightning_explosion_ring_texture = AtlasSprite.getFrames([APP.library.getAsset("enemies/specter/png_assets-0"), APP.library.getAsset("enemies/specter/png_assets-1")], [AtlasConfig.SpecterPngAssets0, AtlasConfig.SpecterPngAssets1], "explosion_ring");
}

let _spirit_explosion_ring_texture = null;
function _generateSpiritExplosionRingTextures()
{
	if (_spirit_explosion_ring_texture) return

	_spirit_explosion_ring_texture = AtlasSprite.getFrames([APP.library.getAsset("enemies/specter/spirit/appearing_smoke")], [AtlasConfig.SpiritSpecterAppearingSmoke], "explosion_ring");
}

class SpecterExplosionRings extends Sprite
{
	static get SPIRIT_SPECTER_RINGS() 		{return "enemies/specter/spirit/appearing_smoke";}
	static get LIGHTNING_SPECTER_RINGS()	{return "enemies/specter/lightning/explosion_ring";}

	static get SPIRIT_EXPLOSION_RING_TEXTURES()
	{
		if (!_lightning_explosion_ring_texture)
		{
			_generateSpiritExplosionRingTextures();
		}

		return _spirit_explosion_ring_texture;
	}

	constructor(aAssetName_str)
	{
		if (aAssetName_str === undefined)
		{
			throw Error("The name must be defined!");
		}

		super();
		this._fRing_spr = null;
		this._fRingAssetName_str = aAssetName_str;

		this._fTimer_t = null;

		_generateLightningExplosionRingTextures();
		_generateSpiritExplosionRingTextures();

		this._initView();
	}

	_initView()
	{
		this._fRing_spr = this.addChild(new Sprite);

		if (this._fRingAssetName_str == SpecterExplosionRings.LIGHTNING_SPECTER_RINGS)
		{
			this._fRing_spr.textures = _lightning_explosion_ring_texture;
		}
		else
		{
			this._fRing_spr.textures = _spirit_explosion_ring_texture;
		}
		
		this._fRing_spr.alpha = 0;
		this._fRing_spr.scale.set(0, 0);
		this._fRing_spr.blendMode = PIXI.BLEND_MODES.ADD;
	}

	startAnimation(aDelayTimeInFrames_num=0)
	{
		this._fTimer_t = new Timer(()=>this._startRingAnimation(), aDelayTimeInFrames_num);
		let lSequence_seq = [
			{tweens: [{prop: 'rotation', to: 2}], duration: 15*FRAME_RATE}
		];

		Sequence.start(this, lSequence_seq);
	}

	_startRingAnimation()
	{
		this._fRing_spr.alpha = 1;
		let sequence = [
			{tweens: [{prop: 'scale.x', from: 0.1, to: 15}, {prop: 'scale.y', from: 0.1, to: 15}, {prop: 'alpha', to: 0.2}], duration: 10*FRAME_RATE, ease: Easing.quadratic.easeIn, onfinish: () => {
				this._fRing_spr.alpha = 0;
			}}
		];

		Sequence.start(this._fRing_spr, sequence);
	}

	destroy()
	{
		Sequence.destroy(Sequence.findByTarget(this._fRing_spr));
		Sequence.destroy(Sequence.findByTarget(this));
		
		this._fTimer_t && this._fTimer_t.destructor();
		this._fTimer_t = null;

		this._fRing_spr = null;

		super.destroy();
	}
}

export default SpecterExplosionRings;