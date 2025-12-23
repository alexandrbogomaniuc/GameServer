import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import AtlasSprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import AtlasConfig from '../../../../config/AtlasConfig';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { Sequence } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import { FRAME_RATE } from '../../../../../../shared/src/CommonConstants';

export let _lightning_explode_textures = null;
export function _generateLightningExplodeTextures()
{
	if (_lightning_explode_textures) return;

	_lightning_explode_textures = AtlasSprite.getFrames([APP.library.getAsset("enemies/lightning_capsule/death/lightning_explode/lightning_explode_0"), APP.library.getAsset("enemies/lightning_capsule/death/lightning_explode/lightning_explode_1")], [AtlasConfig.LightningExplode1, AtlasConfig.LightningExplode2], "");
}

class LightningCapsuleLightningExplodeAnimation extends Sprite
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

		_generateLightningExplodeTextures();

		this._fLightningExplodeAnimation = null;
		this._fLightningExplodeSpriteAnimation_bl = null;
		this._fLightningExplodeSequenceAnimation_bl = null;
	}

	_startIntroAnimation()
	{
		this._startIntroLightningExplodeAnimation();
	}

	_startIntroLightningExplodeAnimation()
	{
		let anim = this._fLightningExplodeAnimation = this.addChild(new Sprite());
		anim.textures = _lightning_explode_textures;
		anim.blendMode = PIXI.BLEND_MODES.ADD;
		anim.animationSpeed = 0.2; //12/60
		anim.position.y = -88;
		anim.position.x = 6;
		anim.scale.set(0.91, 0.91);

		this._fLightningExplodeSpriteAnimation_bl = true;

		anim.on('animationend', ()=>{
			this._fLightningExplodeSpriteAnimation_bl = false;
			this._onIntroLightningExplodeAnimationCompletedSuspicision();
		});

		let l_seq = [
			{tweens: [{prop: 'scale.x', to: 3.29}, {prop: 'scale.y', to: 3.29}], duration: 7 * FRAME_RATE,
			onfinish: ()=>{
				this._fLightningExplodeSequenceAnimation_bl = false;
				this._onIntroLightningExplodeAnimationCompletedSuspicision();
			}}
		];

		this._fLightningExplodeSequenceAnimation_bl = true;
		Sequence.start(this._fLightningExplodeAnimation, l_seq);
		
		anim.play();
	}

	_onIntroLightningExplodeAnimationCompletedSuspicision()
	{	
		if (!this._fLightningExplodeSpriteAnimation_bl && !this._fLightningExplodeSequenceAnimation_bl)
		{
			this._fLightningExplodeAnimation && Sequence.destroy(Sequence.findByTarget(this._fLightningExplodeAnimation));
			this._fLightningExplodeAnimation && this._fLightningExplodeAnimation.destroy();
			this._fLightningExplodeAnimation = null;
			this.emit(LightningCapsuleLightningExplodeAnimation.EVENT_ON_INTRO_ANIMATION_ENDED);
		}
	}

	_startOutroAnimation()
	{
		let anim = this._fLightningExplodeAnimation = this.addChild(new Sprite());
		anim.textures = _lightning_explode_textures;
		anim.blendMode = PIXI.BLEND_MODES.ADD;
		anim.animationSpeed = 0.2; //12/60
		anim.position.y = -88;
		anim.position.x = 6;
		anim.scale.set(3.462, 3.462);
		anim.aplha = 0;
		anim.play();

		let l_seq = [
			{tweens: [], duration: 3 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}], duration: 0 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 0.981}, {prop: 'scale.y', to: 0.981}], duration: 5 * FRAME_RATE,
			onfinish: ()=>{
				this.emit(LightningCapsuleLightningExplodeAnimation.EVENT_ON_OUTRO_ANIMATION_ENDED);
				this._fLightningExplodeAnimation && Sequence.destroy(Sequence.findByTarget(this._fLightningExplodeAnimation));
				this._fLightningExplodeAnimation && this._fLightningExplodeAnimation.destroy();
				this._fLightningExplodeAnimation = null;
			}}
		];

		Sequence.start(anim, l_seq);
	}

	destroy()
	{
		this._fLightningExplodeAnimation && Sequence.destroy(Sequence.findByTarget(this._fLightningExplodeAnimation));
		this._fLightningExplodeAnimation && this._fLightningExplodeAnimation.destroy();
		this._fLightningExplodeAnimation = null;

		super.destroy();
	}
}

export default LightningCapsuleLightningExplodeAnimation;