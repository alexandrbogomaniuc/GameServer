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
import { FRAME_RATE } from '../../../../../../shared/src/CommonConstants';

let _particlesBubbleTextures = null;
function _initParticlesBubbleTextures()
{
	if (_particlesBubbleTextures) return;

	_particlesBubbleTextures = AtlasSprite.getFrames(APP.library.getAsset("big_win/particles/particles_huge_win_bubble"), AtlasConfig.BigWinParticlesGreenBubble, "");
};

class HugeWinAnimation extends BigWinAnimation
{
	constructor(aPayoutValue_num)
	{
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			_initParticlesBubbleTextures();
		}

		super(aPayoutValue_num);

		this._fBurst_sprt = null;
		this._fCircleOut2_sprt = null;
		this._fCircleIn2_sprt = null;
	}

	_startAnimation()
	{
		super._startAnimation();

		this._startSecondCircleAnimation();
	}
	
	_startSecondCircleAnimation()
	{
		this._fCircleIn2_sprt = this.addChild(APP.library.getSpriteFromAtlas(this._circleAssetIn));
		this._fCircleIn2_sprt.blendMode = PIXI.BLEND_MODES.SCREEN;
		this._fCircleIn2_sprt.position.set(0, -20);
		this._fCircleIn2_sprt.scale.set(0);
		this._fCircleIn2_sprt.alpha = 0.8;

		this._fCircleOut2_sprt = this.addChild(APP.library.getSpriteFromAtlas(this._circleAssetOut));
		this._fCircleOut2_sprt.blendMode = PIXI.BLEND_MODES.SCREEN;
		this._fCircleOut2_sprt.position.set(0, -20);
		this._fCircleOut2_sprt.scale.set(0);
		this._fCircleOut2_sprt.alpha = 0.8;

		let lScaleIn_seq = [
			{tweens: [],															duration: 8*FRAME_RATE},
			{tweens: [	{prop: "scale.x", to: 9.8},	{prop: "scale.y", to: 9.8}],	duration: 15*FRAME_RATE} //{prop: "scale.x", to: 4.9*2},	{prop: "scale.y", to: 4.9*2}
		];

		let lAlphaIn_seq = [
			{tweens: [],							duration: 13*FRAME_RATE},
			{tweens: [	{prop: "alpha", to: 0}],	duration: 8*FRAME_RATE, onfinish: ()=>{
				this._endCircleIn2Sequence();
			}}
		];

		let lScaleOut_seq = [
			{tweens: [],															duration: 8*FRAME_RATE},
			{tweens: [	{prop: "scale.x", to: 9.8},	{prop: "scale.y", to: 9.8}],	duration: 15*FRAME_RATE} //{prop: "scale.x", to: 4.9*2},	{prop: "scale.y", to: 4.9*2}
		];

		let lAlphaOut_seq = [
			{tweens: [],							duration: 13*FRAME_RATE},
			{tweens: [	{prop: "alpha", to: 0}],	duration: 8*FRAME_RATE, onfinish: ()=>{
				this._endCircleOut2Sequence();
			}}
		];

		Sequence.start(this._fCircleOut2_sprt, lScaleOut_seq, 1*FRAME_RATE);
		Sequence.start(this._fCircleOut2_sprt, lAlphaOut_seq, 1*FRAME_RATE);

		Sequence.start(this._fCircleIn2_sprt, lScaleIn_seq, 4*FRAME_RATE);
		Sequence.start(this._fCircleIn2_sprt, lAlphaIn_seq, 4*FRAME_RATE);
	}

	get _scaleParticleBuble()
	{
		return 1;
	}

	get _fFlare_seq()
	{
		return {
		ScaleX: [
			{tweens: [	{prop: "scale.x", to: 1.9}],	duration: 0*FRAME_RATE},
			{tweens: [	{prop: "scale.x", to: 1.55}],	duration: 9*FRAME_RATE},
			{tweens: [	{prop: "scale.x", to: 1.96}],	duration: 16*FRAME_RATE},
			{tweens: [	{prop: "scale.x", to: 1.10}],	duration: 18*FRAME_RATE},
			{tweens: [	{prop: "scale.x", to: 1.13}],	duration: 4*FRAME_RATE},
			{tweens: [	{prop: "scale.x", to: 0},],		duration: 4*FRAME_RATE, onfinish: ()=>{
				this._endBigFlareSequence();
			}}
		],

		ScaleY: [
			{tweens: [	{prop: "scale.x", to: 1.63}],	duration: 0*FRAME_RATE},
			{tweens: [	{prop: "scale.y", to: 0.61}],	duration: 12*FRAME_RATE},
			{tweens: [	{prop: "scale.y", to: 0.94}],	duration: 10*FRAME_RATE},
			{tweens: [	{prop: "scale.y", to: 0.81}],	duration: 8*FRAME_RATE},
			{tweens: [	{prop: "scale.y", to: 0.88}],	duration: 5*FRAME_RATE},
			{tweens: [	{prop: "scale.y", to: 0.61}],	duration: 11*FRAME_RATE},
			{tweens: [	{prop: "scale.y", to: 0}],		duration: 4*FRAME_RATE},
		],


		Alpha: [ {tweens: [ {prop: "alpha", to: 1}], duration: 8*FRAME_RATE} ]
		}
	}

	get _fFlareScale()
	{
		return {x: 1.3, y:1.3}
	}

	get _fFlareAsset()
	{
		return "big_win/flare_huge_win";
	}
	get _fFlareLineAsset()
	{
		return "big_win/flare_line_huge_win";
	}

	get _fScaleGlowCaption()
	{
		return 1.10;
	}

	_endCircleIn2Sequence()
	{
		this._fCircleIn2_sprt && Sequence.destroy(Sequence.findByTarget(this._fCircleIn2_sprt));
		this._fCircleIn2_sprt && this._fCircleIn2_sprt.destroy();
		this._fCircleIn2_sprt = null;

		this._validateEnding();
	}

	_endCircleOut2Sequence()
	{
		this._fCircleOut2_sprt && Sequence.destroy(Sequence.findByTarget(this._fCircleOut2_sprt));
		this._fCircleOut2_sprt && this._fCircleOut2_sprt.destroy();
		this._fCircleOut2_sprt = null;

		this._validateEnding();
	}

	_startCoinsExplodeAnimation()
	{
		this._startNextExplosion(6*FRAME_RATE, {x: 0, y: 30});
		this._startNextExplosion(17*FRAME_RATE, {x: -39, y: 30});
		this._startNextExplosion(57*FRAME_RATE, {x: 0, y: 30}, true);
	}
	
	_startParticleBubble(aPos_obj, aRot_num, aOptScale_num=0)
	{
		if(!_particlesBubbleTextures) return;

		let lParticle_sprt = this.addChild(new Sprite());
		this._fParticles_arr.push(lParticle_sprt);
		lParticle_sprt.textures = _particlesBubbleTextures;
		lParticle_sprt.blendMode = PIXI.BLEND_MODES.ADD;
		lParticle_sprt.scale.set(aOptScale_num);
		lParticle_sprt.rotation = aRot_num;
		lParticle_sprt.position.set(aPos_obj.x, aPos_obj.y);
		lParticle_sprt.animationSpeed = 0.5; //30/60;

		let lScale_seq = [
			{tweens: [],	duration: 5*FRAME_RATE, onfinish: ()=> {
				
				lParticle_sprt.play();
			}},
			{tweens: [{prop: "scale.x", to: 3.2},		{prop: "scale.y", to: 3.2}],	duration: 11*FRAME_RATE},
			{tweens: [],	duration: 31*FRAME_RATE},
			{tweens: [{prop: "scale.x", to: 0},		{prop: "scale.y", to: 0}],	duration: 11*FRAME_RATE, onfinish: ()=> {
				let id = this._fParticles_arr.indexOf(lParticle_sprt);
				if (~id)
				{
					this._fParticles_arr.splice(id, 1);
				}
				lParticle_sprt && lParticle_sprt.destroy();
				lParticle_sprt = null;
	
				if (this._fParticles_arr.length == 0)
				{
					this._fParticles_arr = null;
				}
	
				this._validateEnding();
			}},
		]
		Sequence.start(lParticle_sprt, lScale_seq)
	}

	get _captionGlowAsset()
	{
		return "TAHugeWinGlowCaption";
	}

	get _payoutGlowColor()
	{
		return 0xc96000;
	}

	get _coinsAmount()
	{
		return 20;
	}


	get _captionAsset()
	{
		return "TAHugeWinCaption";
	}

	get _glowAsset()
	{
		return "big_win/glow_huge_win";
	}

	get _circleAssetIn()
	{
		return "big_win/circle_huge_win";
	}

	get _circleAssetOut()
	{
		return "big_win/circle_huge_win";
	}

	get _isSomethingAnimating()
	{
		return	super._isSomethingAnimating ||
				this._fCircleOut2_sprt ||
				this._fCircleIn2_sprt ||
				this._fBurst_sprt;
	}

	destroy()
	{
		this._fCircleOut2_sprt && Sequence.destroy(Sequence.findByTarget(this._fCircleOut2_sprt));
		this._fCircleIn2_sprt && Sequence.destroy(Sequence.findByTarget(this._fCircleIn2_sprt));
		this._fBurst_sprt && Sequence.destroy(Sequence.findByTarget(this._fBurst_sprt));

		super.destroy();

		this._fBurst_sprt = null;
		this._fCircleOut2_sprt = null;
		this._fCircleIn2_sprt = null;
	}
}

export default HugeWinAnimation;