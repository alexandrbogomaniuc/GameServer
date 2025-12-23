import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import AtlasSprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import AtlasConfig from '../../../../config/AtlasConfig';
import * as Easing from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../../shared/src/CommonConstants';
import { Sequence } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';

export let _electricity_ring_textures = null;
export function _generateElectricityRingTextures()
{
	if (_electricity_ring_textures) return;

	_electricity_ring_textures = AtlasSprite.getFrames(
		[
			APP.library.getAsset("enemies/lightning_capsule/death/electricity_ring/electricity_ring_0"),
			APP.library.getAsset("enemies/lightning_capsule/death/electricity_ring/electricity_ring_1"),
		], 
		[
			AtlasConfig.LightningCapsuleElectricityRing1,
			AtlasConfig.LightningCapsuleElectricityRing2
		],
		"");
}

class LightningCapsuleElectricityRingAnimation extends Sprite
{
	static get EVENT_ON_INTRO_ANIMATION_ENDED()				{return "onIntroAnimationEnded";}
	static get EVENT_ON_OUTRO_ANIMATION_ENDED()				{return "onOutroAnimationEnded";}

	i_startIntroAnimation()
	{
		this._startIntroAnimation();
	}

	i_startOutroAnimation()
	{
		this._startOutroAnimation();
	}

	constructor()
	{
		super();

		_generateElectricityRingTextures();

		this._fElectricityRing_spr = null;
		this._fElectricityRingIdle_spr = null;
		this._fAnimationCount_num = null;

		this._fElectricityRingsContainer_spr = this.addChild(new Sprite())
	}

	_startIntroAnimation()
	{
		this._startElectricityRingIntro();
		this._startElectricityRingIdle();
	}

	_startElectricityRingIntro()
	{
		let anim = this._fElectricityRing_spr = this._fElectricityRingsContainer_spr.addChild(new Sprite());
		anim.textures = _electricity_ring_textures;
		anim.blendMode = PIXI.BLEND_MODES.ADD;
		anim.animationSpeed = 0.2; //12/60
		anim.loop = true;

		this._fElectricityRing_spr.scale.set(0);
		this._fElectricityRing_spr.alpha = 0;

		let l_seq = [
			{tweens: [], duration: 12 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 1.27}, {prop: 'scale.y', to: 1.27}, {prop: 'alpha', to: 0.7}], duration: 0 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 2.27}, {prop: 'scale.y', to: 2.27}, {prop: 'alpha', to: 0.7}], duration: 2 * FRAME_RATE}, 
			{tweens: [{prop: 'scale.x', to: 3.6}, {prop: 'scale.y', to: 3.6}, {prop: 'alpha', to: 0.35}], duration: 5 * FRAME_RATE,  ease: Easing.quadratic.easeIn,
			onfinish: ()=>{
				this._fElectricityRing_spr && Sequence.destroy(Sequence.findByTarget(this._fElectricityRing_spr));
				this._fElectricityRing_spr.destroy();
				this._onIntroAnimationEnded();
			}}
		];
		
		Sequence.start(this._fElectricityRing_spr, l_seq);
		anim.play();
	}

	_startElectricityRingIdle()
	{
		let anim = this._fElectricityRingIdle_spr = this._fElectricityRingsContainer_spr.addChild(new Sprite());
		anim.textures = _electricity_ring_textures;
		anim.blendMode = PIXI.BLEND_MODES.ADD;
		anim.animationSpeed = 0.2; //12/60
		anim.loop = true;

		this._fElectricityRingIdle_spr.scale.set(0);
		this._fElectricityRingIdle_spr.alpha = 0;

		let l_seq = [
			{tweens: [], duration: 22 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 3.6}, {prop: 'scale.y', to: 3.6}, {prop: 'alpha', to: 0.7}], duration: 0 * FRAME_RATE},
			{tweens: [], duration: 24 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0.35}], duration: 4 * FRAME_RATE,
				onfinish: ()=>{
			}}
		];
		
		Sequence.start(this._fElectricityRingIdle_spr, l_seq);
		anim.play();
	}

	_onIntroAnimationEnded(aIndex)
	{
		this.emit(LightningCapsuleElectricityRingAnimation.EVENT_ON_INTRO_ANIMATION_ENDED);
	}


	_startOutroAnimation()
	{
		let l_seq = [
			{tweens: [], duration: 7 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0.08}], duration: 4 * FRAME_RATE,
				onfinish: ()=>{	
					this._fElectricityRingIdle_spr && Sequence.destroy(Sequence.findByTarget(this._fElectricityRingIdle_spr));
					this._fElectricityRingIdle_spr && this._fElectricityRingIdle_spr.destroy();
					this._onOutroAnimationEnded();
			}}
		];
		
		Sequence.start(this._fElectricityRingIdle_spr, l_seq);
	}

	_onOutroAnimationEnded()
	{
		this.emit(LightningCapsuleElectricityRingAnimation.EVENT_ON_OUTRO_ANIMATION_ENDED);
	}

	destroy()
	{
		super.destroy();

		this._fElectricityRing_spr && Sequence.destroy(Sequence.findByTarget(this._fElectricityRing_spr));
		this._fElectricityRingIdle_spr && Sequence.destroy(Sequence.findByTarget(this._fElectricityRingIdle_spr));
		this._fElectricityRing_spr && this._fElectricityRing_spr.destroy();	
		this._fElectricityRingIdle_spr && this._fElectricityRing_spr.destroy();	
		this._fElectricityRingsContainer_spr && this._fElectricityRing_spr.destroy();
		this._fElectricityRingsContainer_spr = null;
		this._fElectricityRing_spr = null;
		this._fElectricityRingIdle_spr = null;
	}
}

export default LightningCapsuleElectricityRingAnimation;