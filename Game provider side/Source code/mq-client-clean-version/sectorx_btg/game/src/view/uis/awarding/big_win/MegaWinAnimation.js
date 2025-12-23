import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import Sequence from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import * as Easing from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import Timer from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import TextField from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/TextField';
import AtlasConfig from './../../../../config/AtlasConfig';
import { AtlasSprite } from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import I18 from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
import BigWinAnimation from './BigWinAnimation';
import HugeWinAnimation from './HugeWinAnimation';
import { FRAME_RATE } from '../../../../../../shared/src/CommonConstants';


let _particlesBubbleTextures = null;
function _initParticlesBubbleTextures()
{
	if (_particlesBubbleTextures) return;

	_particlesBubbleTextures = AtlasSprite.getFrames(APP.library.getAsset("big_win/particles/particles_bubble"), AtlasConfig.BigWinParticlesBubble, "");
};

class MegaWinAnimation extends HugeWinAnimation
{
	constructor(aPayoutValue_num)
	{
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			_initParticlesBubbleTextures();
		}

		super(aPayoutValue_num);

		this._fMegaBurst1_sprt = null;
		this._fMegaBurst2_sprt = null;
		this._fBurst1Timer_t = null;
		this._fBurst2Timer_t = null;
	}

	_startAnimation()
	{
		super._startAnimation();

	}

	get _fFlare_seq()
	{
		return {
		ScaleX: [
			{tweens: [	{prop: "scale.x", to: 2.21}],	duration: 0*FRAME_RATE}, //{prop: "scale.x", to: 1.7*1.3}
			{tweens: [	{prop: "scale.x", to: 2.353}],	duration: 1*FRAME_RATE}, //{prop: "scale.x", to: 1.81*1.3}
			{tweens: [	{prop: "scale.x", to: 1.742}],	duration: 11*FRAME_RATE}, //{prop: "scale.x", to: 1.34*1.3}
			{tweens: [	{prop: "scale.x", to: 2.405}],	duration: 10*FRAME_RATE}, //{prop: "scale.x", to: 1.85*1.3}
			{tweens: [	{prop: "scale.x", to: 2.002}],	duration: 6*FRAME_RATE}, //{prop: "scale.x", to: 1.54*1.3}
			{tweens: [	{prop: "scale.x", to: 2.548}],	duration: 9*FRAME_RATE}, //{prop: "scale.x", to: 1.96*1.3}
			{tweens: [	{prop: "scale.x", to: 0},],		duration: 8*FRAME_RATE, onfinish: ()=>{
				this._endBigFlareSequence();
			}}
		],

		ScaleY: [
			{tweens: [	{prop: "scale.x", to: 1.456}],	duration: 0*FRAME_RATE}, //{prop: "scale.x", to: 1.12*1.3}
			{tweens: [	{prop: "scale.y", to: 2.821}],	duration: 10*FRAME_RATE}, //{prop: "scale.y", to: 2.17*1.3}
			{tweens: [	{prop: "scale.y", to: 1.443}],	duration: 20*FRAME_RATE}, //{prop: "scale.y", to: 1.11*1.3}
			{tweens: [	{prop: "scale.y", to: 2.392}],	duration: 9*FRAME_RATE}, //{prop: "scale.y", to: 1.84*1.3}
			{tweens: [	{prop: "scale.y", to: 0}],		duration: 9*FRAME_RATE},
		],


		Alpha: [ {tweens: [ {prop: "alpha", to: 1}], duration: 8*FRAME_RATE} ]
		}
	}

	get _fScaleGlowCaption()
	{
		return 1.05;
	}

	_startCoinsExplodeAnimation()
	{
		this._startNextExplosion(6*FRAME_RATE, {x: 0, y: 30});
		this._startNextExplosion(13*FRAME_RATE, {x: -39, y: 30});
		this._startNextExplosion(17*FRAME_RATE, {x: 0, y: 30});
		this._startNextExplosion(24*FRAME_RATE, {x: -39, y: 30});
		this._startNextExplosion(35*FRAME_RATE, {x: -39, y: 30});
		this._startNextExplosion(47*FRAME_RATE, {x: 0, y: 30});
		this._startNextExplosion(57*FRAME_RATE, {x: -39, y: 30});
		this._startNextExplosion(59*FRAME_RATE, {x: 0, y: 30}, true);
	}

	get _scaleParticleBuble()
	{
		return 1.2;
	}

	get _fFlareScale()
	{
		return {x: 1.8, y:1.8}
	}

	get _fFlareAsset()
	{
		return "big_win/flare_mega_win";
	}
	get _fFlareLineAsset()
	{
		return "big_win/flare_line_mega_win";
	}

	get _captionGlowAsset()
	{
		return "TAMegaWinGlowCaption";
	}

	get _payoutGlowColor()
	{
		return 0xfb6b6b;
	}

	get _coinsAmount()
	{
		return 40;
	}

	get _captionAsset()
	{
		return "TAMegaWinCaption";
	}

	get _glowAsset()
	{
		return "big_win/glow_mega_win";
	}

	get _circleAssetIn()
	{
		return "big_win/circle_big_win";
	}

	get _circleAssetOut()
	{
		return "big_win/circle_big_win";
	}

	get _isSomethingAnimating()
	{
		return	super._isSomethingAnimating ||
				this._fMegaBurst1_sprt ||
				this._fMegaBurst2_sprt;
	}

	destroy()
	{
		this._fBurst1Timer_t && this._fBurst1Timer_t.destructor();
		this._fBurst2Timer_t && this._fBurst2Timer_t.destructor();

		super.destroy();

		this._fMegaBurst1_sprt = null;
		this._fMegaBurst2_sprt = null;
		this._fBurst1Timer_t = null;
		this._fBurst2Timer_t = null;
	}
}

export default MegaWinAnimation;