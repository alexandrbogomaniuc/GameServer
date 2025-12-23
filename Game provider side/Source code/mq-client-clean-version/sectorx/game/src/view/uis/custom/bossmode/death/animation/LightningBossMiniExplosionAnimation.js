import * as Easing from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { APP } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../../../../shared/src/CommonConstants';
import { Sequence } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import { Utils } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import { AtlasSprite, Sprite } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import AtlasConfig from '../../../../../../config/AtlasConfig';

let _lightning_ring_textures = null;
function _generateLightningRingTextures()
{
	if (_lightning_ring_textures) return

	_lightning_ring_textures = AtlasSprite.getFrames(
		[
			APP.library.getAsset("boss_mode/lightning/main_smoke/lightning_ring")
		],
		[
			AtlasConfig.LightningBossLightningRing
		],
		"");
}

class LightningBossMiniExplosionAnimation extends Sprite
{
	static get EVENT_ON_ANIMATION_ENDED()				{return "onAnimationEnded";}

	i_startAnimation()
	{
		this._startAnimation();
	}

	constructor()
	{
		super();
		
		_generateLightningRingTextures();

		this._fAnimationCount_num = null;

		this._fSmokeOrange_spr = null;
		this._fSmokePink_spr = null;
		this._fSmokeYellow_spr = null;
		this._fLightningRing_spr = null;
		this._fLightnParticle_spr = null;
		this._fLight5_spr = null;
		this._fParticlesYellow_spr = null;
		this._fLightCircle_spr = null;
	}

	_startAnimation()
	{
		this._fAnimationCount_num = 0;
		
		this._startSmokeOrange();
		this._startSmokePink();
		this._startSmokeYellow();
		this._startLightningRingAnimation();
		this._startParticle();

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startLight5();
		}
		
		this._startParticlesYellow();
	
	}

	_startSmokeOrange()
	{
		let lSmokeOrange_spr = this._fSmokeOrange_spr = this.addChild(APP.library.getSpriteFromAtlas('boss_mode/lightning/smoke_orange'));
		lSmokeOrange_spr.alpha = 0;
		lSmokeOrange_spr.position.set(0, 0);
		lSmokeOrange_spr.scale.set(0.31, 0.31);
		lSmokeOrange_spr.rotation = 0;

		let l_seq = [
			{tweens: [], duration: 2 * FRAME_RATE},
			{tweens: [
						{prop: 'x', to: 24.4}, 
						{prop: 'y', to: -24.95}, 
						{prop: 'alpha', to: 0.49}, 
						{prop: 'scale.x', to: 0.52}, 
						{prop: 'scale.y', to: 0.52}, 
						{prop: 'rotation', to: 0.3141592653589793} // Utils.gradToRad(18)
					],	duration: 9 * FRAME_RATE},
			{tweens: [
						{prop: 'x', to: 43}, 
						{prop: 'y', to: -44}, 
						{prop: 'alpha', to: 0}, 
						{prop: 'scale.x', to: 0.68}, 
						{prop: 'scale.y', to: 0.68}, 
						{prop: 'rotation', to: 0.8377580409572781} // Utils.gradToRad(48)
					],	duration: 15 * FRAME_RATE,
					onfinish: ()=>{
						lSmokeOrange_spr && lSmokeOrange_spr.destroy();
						this._fAnimationCount_num--;
						this._onAnimationCompletedSuspicison();
			}}
		]

		this._fAnimationCount_num++;
		Sequence.start(lSmokeOrange_spr, l_seq);
	}

	_startSmokePink()
	{
		let lSmokePink_spr = this._fSmokePink_spr = this.addChild(APP.library.getSpriteFromAtlas('boss_mode/lightning/smoke_pink'));
		lSmokePink_spr.alpha = 0;
		lSmokePink_spr.position.set(0, 0);
		lSmokePink_spr.scale.set(1.03, 1.03);
		lSmokePink_spr.rotation = 0;

		let l_seq = [
			{tweens: [], duration: 5 * FRAME_RATE},
			{tweens: [
						{prop: 'x', to: -33.5}, 
						{prop: 'y', to: 6.25}, 
						{prop: 'alpha', to: 0.49}, 
						{prop: 'scale.x', to: 1.336}, 
						{prop: 'scale.y', to: 1.336}, 
						{prop: 'rotation', to: 0.3141592653589793} // Utils.gradToRad(18)
					],	duration: 9 * FRAME_RATE},
			{tweens: [
						{prop: 'x', to: -59}, 
						{prop: 'y', to: 11}, 
						{prop: 'alpha', to: 0}, 
						{prop: 'scale.x', to: 1.57}, 
						{prop: 'scale.y', to: 1.57}, 
						{prop: 'rotation', to: 0.8377580409572781} // Utils.gradToRad(48)
					],	duration: 15 * FRAME_RATE,
					onfinish: ()=>{
						lSmokePink_spr && lSmokePink_spr.destroy();
						this._fAnimationCount_num--;
						this._onAnimationCompletedSuspicison();
			}}
		]

		this._fAnimationCount_num++;
		Sequence.start(lSmokePink_spr, l_seq);
	}

	_startSmokeYellow()
	{
		let lSmokeYellow_spr = this._fSmokeYellow_spr = this.addChild(APP.library.getSpriteFromAtlas('boss_mode/lightning/smoke_yellow'));
		lSmokeYellow_spr.alpha = 0;
		lSmokeYellow_spr.position.set(0, 0);
		lSmokeYellow_spr.scale.set(0.22, 0.22);
		lSmokeYellow_spr.rotation = 0;

		let l_seq = [
			{tweens: [], duration: 3 * FRAME_RATE},
			{tweens: [
						{prop: 'x', to: 9.65}, 
						{prop: 'y', to: 14.2}, 
						{prop: 'alpha', to: 0.49}, 
						{prop: 'scale.x', to: 0.526}, 
						{prop: 'scale.y', to: 0.526}, 
						{prop: 'rotation', to: 0.3141592653589793} // Utils.gradToRad(18)
					],	duration: 9 * FRAME_RATE},
			{tweens: [
						{prop: 'x', to: 17}, 
						{prop: 'y', to: 25}, 
						{prop: 'alpha', to: 0}, 
						{prop: 'scale.x', to: 0.76}, 
						{prop: 'scale.y', to: 0.76}, 
						{prop: 'rotation', to: 0.8377580409572781} // Utils.gradToRad(48)
					],	duration: 15 * FRAME_RATE,
					onfinish: ()=>{
						lSmokeYellow_spr && lSmokeYellow_spr.destroy();
						this._fAnimationCount_num--;
						this._onAnimationCompletedSuspicison();
			}}
		]

		this._fAnimationCount_num++;
		Sequence.start(lSmokeYellow_spr, l_seq);
	}

	_startLightningRingAnimation()
	{
		let lLightningRing_spr = this._fLightningRing_spr = this.addChild(new Sprite());
		lLightningRing_spr.textures = _lightning_ring_textures;
		lLightningRing_spr.animationSpeed = 0.5; //30 / 60;
		lLightningRing_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lLightningRing_spr.scale.set(1.28, 1.28);
		lLightningRing_spr.rotation = 0;

		let l_seq = [
			{tweens: [], duration: 1 * FRAME_RATE,
				onfinish: ()=>{
					lLightningRing_spr.alpha = 1;
					lLightningRing_spr.play();
			}},
			{tweens: [{prop: 'rotation', to: 1.3962634015954636}],	duration: 15 * FRAME_RATE, // Utils.gradToRad(80)
					onfinish: ()=>{
						lLightningRing_spr && lLightningRing_spr.destroy();
						lLightningRing_spr = null;
						this._fAnimationCount_num--;
						this._onAnimationCompletedSuspicison();
			}}
		]

		this._fAnimationCount_num++;
		Sequence.start(lLightningRing_spr, l_seq);
	}

	_startParticle()
	{
		let lParticle_spr = this._fLightnParticle_spr = this.addChild(APP.library.getSpriteFromAtlas('common/light_particle'));
		lParticle_spr.alpha = 0;
		lParticle_spr.scale.set(7.03, 7.03);
		
		let l_seq = [
			{tweens: [], duration: 1 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}], duration: 0 * FRAME_RATE},
			{tweens: [], duration: 4 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0}], duration: 16 * FRAME_RATE,
					onfinish: ()=>{
						lParticle_spr && lParticle_spr.destroy();
						lParticle_spr = null;
						this._fAnimationCount_num--;
						this._onAnimationCompletedSuspicison();
			}}
		]

		this._fAnimationCount_num++;
		Sequence.start(lParticle_spr, l_seq);
	}

	_startLight5()
	{
		let lLight5_spr = this._fLight5_spr = this.addChild(APP.library.getSpriteFromAtlas('common/misty_flare'));
		lLight5_spr.position.set(-3, 8);
		lLight5_spr.alpha = 0;
		lLight5_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lLight5_spr.scale.set(1, 1);

		let l_seq = [
			{tweens: [], duration: 1 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}], duration: 0 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 1.67}, {prop: 'scale.y', to: 1.67}], duration: 2 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 3}, {prop: 'scale.y', to: 3}], duration: 6 * FRAME_RATE,
				onfinish: ()=>{
					this._fAnimationCount_num--; 
					lLight5_spr && lLight5_spr.destroy();
					this._onAnimationCompletedSuspicison();
			}}
		]

		this._fAnimationCount_num++;
		Sequence.start(lLight5_spr, l_seq);
	}

	_startParticlesYellow()
	{
		let lParticlesYellow_spr = this._fParticlesYellow_spr = this.addChild(APP.library.getSprite('boss_mode/common/particles_yellow'));
		lParticlesYellow_spr.alpha = 0;
		lParticlesYellow_spr.scale.set(0.51, 0.51);
		lParticlesYellow_spr.blendMode = PIXI.BLEND_MODES.ADD;

		let l_seq = [
			{tweens: [], duration: 2 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}], duration: 0 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 0.722}, {prop: 'scale.y', to: 0.722}, {prop: 'rotation', to: 0.11693705988362009}], duration: 8 * FRAME_RATE}, // Utils.gradToRad(6.7)
			{tweens: [{prop: 'scale.x', to: 1.17}, {prop: 'scale.y', to: 1.17}, {prop: 'rotation', to: 0.36302848441482055}, {prop: 'alpha', to: 0}], duration: 24 * FRAME_RATE, // Utils.gradToRad(20.8)
				onfinish: ()=>{
					this._fAnimationCount_num--;
					lParticlesYellow_spr && lParticlesYellow_spr.destroy();
					this._onAnimationCompletedSuspicison();
			}}
		]

		this._fAnimationCount_num++;
		Sequence.start(lParticlesYellow_spr, l_seq);
	}

	_startLightCircle()
	{
		let lLightnCircle_spr = this._fLightCircle_spr = this.addChild(APP.library.getSprite('boss_mode/common/light_circle_1'));
		lLightnCircle_spr.position.set(-2.1, -6);
		lLightnCircle_spr.alpha = 0;
		lLightnCircle_spr.scale.set(0.86, 0.86); //0.43*2, 0.43*2
		lLightnCircle_spr.blendMode = PIXI.BLEND_MODES.ADD;

		let l_seq = [
			{tweens: [], duration: 1 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0.4}], duration: 0 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 0.671}, {prop: 'scale.y', to: 0.671}], ease: Easing.quadratic.easeOut, duration: 1 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 1.38}, {prop: 'scale.y', to: 1.38}, {prop: 'alpha', to: 0.06}], duration: 4 * FRAME_RATE,
				onfinish: ()=>{
					this._fAnimationCount_num--;
					lLightnCircle_spr && lLightnCircle_spr.destroy();
					this._onAnimationCompletedSuspicison();
			}}
		];

		this._fAnimationCount_num++;
		Sequence.start(lLightnCircle_spr, l_seq);
	}


	_onAnimationCompletedSuspicison()
	{
		if (this._fAnimationCount_num == 0)
		{
			this.emit(LightningBossMiniExplosionAnimation.EVENT_ON_ANIMATION_ENDED);
		}
	}

	destroy()
	{
		super.destroy();

		this._fAnimationCount_num = null;

		this._fSmokeOrange_spr && Sequence.destroy(Sequence.findByTarget(this._fSmokeOrange_spr));
		this._fSmokeOrange_spr && this._fSmokeOrange_spr.destroy();

		this._fSmokePink_spr && Sequence.destroy(Sequence.findByTarget(this._fSmokePink_spr));
		this._fSmokePink_spr && this._fSmokePink_spr.destroy();

		this._fSmokeYellow_spr && Sequence.destroy(Sequence.findByTarget(this._fSmokeYellow_spr));
		this._fSmokeYellow_spr && this._fSmokeYellow_spr.destroy();

		this._fLightningRing_spr && Sequence.destroy(Sequence.findByTarget(this._fLightningRing_spr));
		this._fLightningRing_spr && this._fLightningRing_spr.destroy();

		this._fLightnParticle_spr && Sequence.destroy(Sequence.findByTarget(this._fLightnParticle_spr));
		this._fLightnParticle_spr && this._fLightnParticle_spr.destroy();

		this._fLight5_spr && Sequence.destroy(Sequence.findByTarget(this._fLight5_spr));
		this._fLight5_spr && this._fLight5_spr.destroy();

		this._fParticlesYellow_spr && Sequence.destroy(Sequence.findByTarget(this._fParticlesYellow_spr));
		this._fParticlesYellow_spr && this._fParticlesYellow_spr.destroy();

		this._fLightCircle_spr && Sequence.destroy(Sequence.findByTarget(this._fLightCircle_spr));
		this._fLightCircle_spr && this._fLightCircle_spr.destroy();

		this._fSmokeOrange_spr = null;
		this._fSmokePink_spr = null;
		this._fSmokeYellow_spr = null;
		this._fLightningRing_spr = null;
		this._fLightnParticle_spr = null;
		this._fLight5_spr = null;
		this._fParticlesYellow_spr = null;
		this._fLightCircle_spr = null;
	}
}

export default LightningBossMiniExplosionAnimation;