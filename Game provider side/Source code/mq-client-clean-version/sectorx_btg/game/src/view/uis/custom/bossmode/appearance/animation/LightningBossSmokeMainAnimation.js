import * as Easing from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { APP } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../../../../shared/src/CommonConstants';
import { Sequence } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import { Utils } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import Timer from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import { AtlasSprite, Sprite } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import AtlasConfig from '../../../../../../config/AtlasConfig';
import LightningBossYellowOrangeSmokeAnimation from './LightningBossYellowOrangeSmokeAnimation';
import LightningBossSmokeLightParticleAnimation from './LightningBossSmokeLightParticleAnimation';
import LightningBossSmokeLightningsExplosionAnimation from './LightningBossSmokeLightningsExplosionAnimation';
import LightningBossSmokeLightningsYellowAnimation from './LightningBossSmokeLightningsYellowAnimation';
import LightningBossSmokeLightningsPinkAnimation from './LightningBossSmokeLightningsPinkAnimation';
import LightningBossPurplePinkSmokeAnimation from './LightningBossPurplePinkSmokeAnimation';
import { generateLightningTextures } from '../LightningBossAppearanceView';


let lightning_ring_textures = null;
export function generateLightningRingTextures()
{
	if (!lightning_ring_textures)
	{
		lightning_ring_textures = AtlasSprite.getFrames(
			[
				APP.library.getAsset("boss_mode/lightning/main_smoke/lightning_ring")
			],
			[
				AtlasConfig.LightningBossLightningRing
			],
			"");
	}
	return lightning_ring_textures;
}


class LightningBossSmokeMainAnimation extends Sprite
{
	static get EVENT_ON_ANIMATION_ENDED()				{return "onAnimationEnded";}

	i_startAppearingAnimation()
	{
		this._startAppearingAnimation();
	}

	i_startDisappearingAnimation()
	{
		this._startDisappearingAnimation();
	}

	constructor()
	{
		super();

		generateLightningRingTextures();
		
		this._fAnimationCount_num = null;

		this._fBottomContainer_spr = this.addChild(new Sprite());
		this._fMiddleContainer_spr = this.addChild(new Sprite());

		this._fTopContainer_spr = this.addChild(new Sprite());
		this._fSmokeSpinContainer_spr = this._fTopContainer_spr.addChild(new Sprite());
		this._fSmoke6Container_spr = this._fTopContainer_spr.addChild(new Sprite());
		this._fLight5Container_spr =  this._fTopContainer_spr.addChild(new Sprite());

		this._fRedGlow_spr = null;
		this._fYellowGlow_spr = null;
		this._fShadow_spr = null;
		
		this._fStartSmokeBackTimer_arr = [];
		this._fYellowOrangeSmokeAnimation_lbyosa_arr = [];
		
		this._fLightParticlesAnimation_lpa = null;		
		this._fLightExplosion_lea = null;		
		this._fLightningYellow_lya = null;		
		this._fLightningPink_lpa = null;

		this._fStartSmokeSpinTimer_arr = [];
		this._fPurplePinkSmokeAnimation_lbyosa_arr = [];
		
		this._fSmoke6_spr = null;
		this._fIsNeedSmoke6ContainerWiggle_bl = null;
		
		this._fStartLightning2Ring_tmr = null;
		this._fLightning2Ring_spr = null;
		this._fCompleteLightning2Ring_tmr = null;
		
		this._fLight5_spr = null;
		this._fIsNeedLight5ContainerWiggle_bl = null;
	}

	_startAppearingAnimation()
	{
		this._fAnimationCount_num = 0;

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startRedGlow();
			this._startShadow();
		}

		this._startSmokeBack(3);
		this._startLightParticles();
		this._startLightExplosion();
		this._startLightningYellow();
		this._startLightningPink();
		this._startSmokeSpin();

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startSmoke6();
		}

		this._startLightning2Ring(lightning_ring_textures);

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startLight5();
		}
	}
	
	_startDisappearingAnimation()
	{
		this._fAnimationCount_num = 0;
		
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startYellowGlow();
		}

		this._startSmokeBack(2);
		this._startLightParticles();
		this._startLightExplosion();
		this._startLightningYellow();
		this._startLightningPink();

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startSmoke6();
		}

		this._startLightning2Ring(generateLightningTextures());

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startLight5();
		}
	}

	_startRedGlow()
	{		
		let lRedGlow_spr = this._fRedGlow_spr = this._fBottomContainer_spr.addChild(APP.library.getSpriteFromAtlas('boss_mode/lightning/red_glow'));
		lRedGlow_spr.position.set(0, 20);
		lRedGlow_spr.alpha = 0;
		lRedGlow_spr.scale.set(5.08, 3.24); //2.54*2, 1.62*2

		let l_seq = [
			{tweens: [{prop: 'alpha', to: 1}], duration: 42 * FRAME_RATE},
			{tweens: [], duration: 66 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0.03}], duration: 13 * FRAME_RATE,
				onfinish: ()=>{
					this._fAnimationCount_num--; 
					this._onAnimationCompletedSuspicison();
			}}
		]

		this._fAnimationCount_num++;
		Sequence.start(lRedGlow_spr, l_seq);
	}

	_startYellowGlow()
	{		
		let lYellowGlow_spr = this._fYellowGlow_spr = this._fBottomContainer_spr.addChild(APP.library.getSpriteFromAtlas('boss_mode/lightning/yellow_glow'));
		lYellowGlow_spr.position.set(0, 20);
		lYellowGlow_spr.alpha = 0;
		lYellowGlow_spr.scale.set(5.08, 3.24); //2.54*2, 1.62*2

		let l_seq = [
			{tweens: [{prop: 'alpha', to: 1}], duration: 44 * FRAME_RATE},
			{tweens: [], duration: 64 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0.03}], duration: 13 * FRAME_RATE,
				onfinish: ()=>{
					this._fAnimationCount_num--; 
					this._onAnimationCompletedSuspicison();
			}}
		]

		this._fAnimationCount_num++;
		Sequence.start(lYellowGlow_spr, l_seq);
	}


	_startShadow()
	{
		let lShadow_spr = this._fShadow_spr = this._fBottomContainer_spr.addChild(APP.library.getSpriteFromAtlas('boss_mode/lightning/shadow'));
		lShadow_spr.position.set(-10, 30);
		lShadow_spr.alpha = 0;
		lShadow_spr.scale.set(1.78, 1.78); //0.89*2, 0.89*2

		let l_seq = [
			{tweens: [], duration: 5 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}], duration: 43 * FRAME_RATE},
			{tweens: [], duration: 57 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0}], duration: 11 * FRAME_RATE,
				onfinish: ()=>{
					this._fAnimationCount_num--; 
					lShadow_spr && lShadow_spr.destroy();
					this._onAnimationCompletedSuspicison();
			}}
		]

		this._fAnimationCount_num++;
		Sequence.start(lShadow_spr, l_seq);
	}

	_startSmokeBack(aCount)
	{
		for (let i = 0; i < aCount; i++)
		{
			let lTimer = this._fStartSmokeBackTimer_arr[i] = new Timer(()=>{
					lTimer && lTimer.destructor();
					this._fAnimationCount_num++;
					this._fYellowOrangeSmokeAnimation_lbyosa_arr[i] = this._fBottomContainer_spr.addChild(new LightningBossYellowOrangeSmokeAnimation());		
					this._fYellowOrangeSmokeAnimation_lbyosa_arr[i].once(LightningBossYellowOrangeSmokeAnimation.EVENT_ON_ANIMATION_ENDED, this._onSmokeBackAnimationCompleted, this);
					this._fYellowOrangeSmokeAnimation_lbyosa_arr[i].i_startAnimation();
			}, i * 74 * FRAME_RATE, true);
		}
	}

	_onSmokeBackAnimationCompleted()
	{
		this._fAnimationCount_num--;
		this._onAnimationCompletedSuspicison();
	}

	_startLightParticles()
	{
		this._fAnimationCount_num++;
		this._fLightParticlesAnimation_lpa = this._fMiddleContainer_spr.addChild(new LightningBossSmokeLightParticleAnimation());		
		this._fLightParticlesAnimation_lpa.once(LightningBossSmokeLightParticleAnimation.EVENT_ON_ANIMATION_ENDED, this._onLightParticlesAnimationCompleted, this);
		this._fLightParticlesAnimation_lpa.i_startAnimation();
	}

	_onLightParticlesAnimationCompleted()
	{
		this._fAnimationCount_num--;
		this._onAnimationCompletedSuspicison();
	}

	_startLightExplosion()
	{
		this._fAnimationCount_num++;
		this._fLightExplosion_lea = this._fMiddleContainer_spr.addChild(new LightningBossSmokeLightningsExplosionAnimation());		
		this._fLightExplosion_lea.once(LightningBossSmokeLightningsExplosionAnimation.EVENT_ON_ANIMATION_ENDED, this._onLightExplosionAnimationCompleted, this);
		this._fLightExplosion_lea.i_startAnimation();
	}

	_onLightExplosionAnimationCompleted()
	{
		this._fAnimationCount_num--;
		this._onAnimationCompletedSuspicison();
	}

	_startLightningYellow()
	{
		this._fAnimationCount_num++;
		this._fLightningYellow_lya = this._fMiddleContainer_spr.addChild(new LightningBossSmokeLightningsYellowAnimation());		
		this._fLightningYellow_lya.once(LightningBossSmokeLightningsYellowAnimation.EVENT_ON_ANIMATION_ENDED, this._onLightningYellowAnimationCompleted, this);
		this._fLightningYellow_lya.i_startAnimation();	
	}

	_onLightningYellowAnimationCompleted()
	{
		this._fAnimationCount_num--;
		this._onAnimationCompletedSuspicison();
	}

	_startLightningPink()
	{
		this._fAnimationCount_num++;
		this._fLightningPink_lpa = this._fMiddleContainer_spr.addChild(new LightningBossSmokeLightningsPinkAnimation());		
		this._fLightningPink_lpa.once(LightningBossSmokeLightningsPinkAnimation.EVENT_ON_ANIMATION_ENDED, this._onLightningPinkAnimationCompleted, this);
		this._fLightningPink_lpa.i_startAnimation();
	}

	_onLightningPinkAnimationCompleted()
	{
		this._fAnimationCount_num--;
		this._onAnimationCompletedSuspicison();
	}

	_startSmokeSpin()
	{
		for (let i = 0; i < 2; i++)
		{
			let lTimePause_num  = i == 0 ? 14: 92;

			let lTimer = this._fStartSmokeSpinTimer_arr[i] = new Timer(()=>{
					lTimer && lTimer.destructor();
					this._fAnimationCount_num++;
					this._fPurplePinkSmokeAnimation_lbyosa_arr[i] = this._fSmokeSpinContainer_spr.addChild(new LightningBossPurplePinkSmokeAnimation());		
					this._fPurplePinkSmokeAnimation_lbyosa_arr[i].once(LightningBossPurplePinkSmokeAnimation.EVENT_ON_ANIMATION_ENDED, this._onSmokeSpinAnimationCompleted, this);
					this._fPurplePinkSmokeAnimation_lbyosa_arr[i].i_startAnimation();
			}, lTimePause_num * FRAME_RATE, true);
		}
	}

	_onSmokeSpinAnimationCompleted()
	{
		this._fAnimationCount_num--;
		this._onAnimationCompletedSuspicison();
	}

	_startSmoke6()
	{
		let lSmoke6_spr = this._fSmoke6_spr = this._fSmoke6Container_spr.addChild(APP.library.getSpriteFromAtlas('boss_mode/lightning/fx_smoke_6'));
		lSmoke6_spr.position.set(-80, 28); //-160/2, 56/2
		lSmoke6_spr.alpha = 0;
		lSmoke6_spr.scale.set(1.78, 1.78);

		let l_seq = [
			{tweens: [], duration: 43 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0.5}], duration: 0 * FRAME_RATE},
			{tweens: [{prop: 'x', to: -14.65}, {prop: 'y', to: 21.55}, {prop: 'scale.x', to: 1.772}, {prop: 'scale.y', to: 1.772}], duration: 11 * FRAME_RATE}, //{prop: 'x', to: -29.3/2}, {prop: 'y', to: 43.1/2}
			{tweens: [{prop: 'x', to: 42}, {prop: 'y', to: 16}, {prop: 'scale.x', to: 1.78}, {prop: 'scale.y', to: 1.78}], duration: 11 * FRAME_RATE, //{prop: 'x', to: 84/2}, {prop: 'y', to: 32/2}
				onfinish: ()=>{
					this._fIsNeedSmoke6ContainerWiggle_bl = false;
					this._fAnimationCount_num--; 
					lSmoke6_spr && lSmoke6_spr.destroy();
					this._onAnimationCompletedSuspicison();
			}}
		]

		this._fIsNeedSmoke6ContainerWiggle_bl = true;
		this._fAnimationCount_num++;
		Sequence.start(lSmoke6_spr, l_seq);

		this._fAnimationCount_num++;
		this._startWiggleSmoke6Animation();
	}

	_startWiggleSmoke6Animation()
	{
		let l_seq = [
			{tweens: [{prop: 'alpha', to: Utils.getRandomWiggledValue(0.7, 0.3)}], duration: 2 * FRAME_RATE,
				onfinish: ()=>{				
					if (this._fIsNeedSmoke6ContainerWiggle_bl)
					{
						this._startWiggleSmoke6Animation();
					}
					else
					{
						this._fAnimationCount_num--;
						this._onAnimationCompletedSuspicison();
					}
			}}
		];

		Sequence.start(this._fSmoke6Container_spr, l_seq);
	}


	_startLightning2Ring(aTexture)
	{
		let lTimer = this._fStartLightning2Ring_tmr = new Timer(()=>{
			this._fAnimationCount_num++;

			lTimer && lTimer.destructor();
			
			let lLightning2Ring_spr = this._fLightning2Ring_spr = this.addChild(new Sprite());

			lLightning2Ring_spr.textures = aTexture;
			lLightning2Ring_spr.animationSpeed = 0.5; //30 / 60;
			lLightning2Ring_spr.blendMode = PIXI.BLEND_MODES.ADD;
		
			lLightning2Ring_spr.position.x = -5.25; 
			lLightning2Ring_spr.position.y = -62.15; 
			
			lLightning2Ring_spr.scale.set(2.694);
			lLightning2Ring_spr.rotation = 0.00034906585039886593; //Utils.gradToRad(0.02);
			lLightning2Ring_spr.loop = true;

			let lCompleteTimer = this._fCompleteLightning2Ring_tmr = new Timer(()=>{
				lCompleteTimer && lCompleteTimer.destructor();

				lLightning2Ring_spr.stop();
				lLightning2Ring_spr && lLightning2Ring_spr.destroy();
				lLightning2Ring_spr = null;

				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			}, 22 * FRAME_RATE, true);

			lLightning2Ring_spr.play();

		}, 43 * FRAME_RATE, true);
	}

	_startLight5()
	{
		let lLight5_spr = this._fLight5_spr = this._fLight5Container_spr.addChild(APP.library.getSprite('common/misty_flare'));
		lLight5_spr.position.set(-3, 8);
		lLight5_spr.alpha = 0;
		lLight5_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lLight5_spr.scale.set(1, 1);
		lLight5_spr.rotation = 0.05235987755982988; //Utils.gradToRad(3);

		let l_seq = [
			{tweens: [], duration: 3 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0.7}], duration: 0 * FRAME_RATE},
			{tweens: [{prop: 'rotation', to: 0.5759586531581288}], duration: 30 * FRAME_RATE}, //Utils.gradToRad(33)
			{tweens: [{prop: 'rotation', to: 1.0471975511965976}, {prop: 'alpha', to: 0}], duration: 27 * FRAME_RATE, //Utils.gradToRad(60)
				onfinish: ()=>{
					this._fIsNeedLight5ContainerWiggle_bl = false;
					this._fAnimationCount_num--; 
					lLight5_spr && lLight5_spr.destroy();
					this._onAnimationCompletedSuspicison();
			}}
		]

		this._fIsNeedLight5ContainerWiggle_bl = true;
		this._fAnimationCount_num++;
		Sequence.start(lLight5_spr, l_seq);

		this._fAnimationCount_num++;
		this._startWigglelLight5Animation();
	}

	_startWigglelLight5Animation()
	{
		let l_seq = [
			{tweens: [{prop: 'alpha', to: Utils.getRandomWiggledValue(0.7, 0.3)}], duration: 2 * FRAME_RATE,
				onfinish: ()=>{
					if (this._fIsNeedLight5ContainerWiggle_bl)
					{
						this._startWigglelLight5Animation();
					}
					else
					{
						this._fAnimationCount_num--;
						this._onAnimationCompletedSuspicison();
					}
			}}
		];

		Sequence.start(this._fLight5Container_spr, l_seq);
	}

	_onAnimationCompletedSuspicison()
	{
		if (this._fAnimationCount_num == 0)
		{
			this._destroyAnimation();
			this.emit(LightningBossSmokeMainAnimation.EVENT_ON_ANIMATION_ENDED);
		}
	}

	_destroyAnimation()
	{
		for (let i = 0; i < this._fStartSmokeBackTimer_arr.length; i++)
		{
			this._fStartSmokeBackTimer_arr[i] && this._fStartSmokeBackTimer_arr[i].destructor();
		}
		this._fStartSmokeBackTimer_arr = [];

		for (let i = 0; i < this._fStartSmokeSpinTimer_arr.length; i++)
		{
			this._fStartSmokeSpinTimer_arr[i] && this._fStartSmokeSpinTimer_arr[i].destructor();
		}
		this._fStartSmokeSpinTimer_arr = [];

		this._fStartLightning2Ring_tmr && this._fStartLightning2Ring_tmr.destructor();
		this._fStartLightning2Ring_tmr = null;

		this._fCompleteLightning2Ring_tmr && this._fCompleteLightning2Ring_tmr.destructor();
		this._fCompleteLightning2Ring_tmr = null;

		this._fRedGlow_spr && Sequence.destroy(Sequence.findByTarget(this._fRedGlow_spr));
		this._fRedGlow_spr && this._fRedGlow_spr.destroy();
		this._fRedGlow_spr = null;

		this._fYellowGlow_spr && Sequence.destroy(Sequence.findByTarget(this._fYellowGlow_spr));
		this._fYellowGlow_spr && this._fYellowGlow_spr.destroy();
		this._fYellowGlow_spr = null;

		this._fShadow_spr && Sequence.destroy(Sequence.findByTarget(this._fShadow_spr));
		this._fShadow_spr && this._fShadow_spr.destroy();
		this._fShadow_spr = null;

		for (let i = 0; i < this._fYellowOrangeSmokeAnimation_lbyosa_arr.length; i++)
		{
			this._fYellowOrangeSmokeAnimation_lbyosa_arr[i] && this._fYellowOrangeSmokeAnimation_lbyosa_arr[i].destroy();
		}
		this._fYellowOrangeSmokeAnimation_lbyosa_arr = [];

		this._fLightParticlesAnimation_lpa && this._fLightParticlesAnimation_lpa.destroy();
		this._fLightParticlesAnimation_lpa = null;

		this._fLightExplosion_lea && this._fLightExplosion_lea.destroy();
		this._fLightExplosion_lea = null;

		this._fLightningYellow_lya && this._fLightningYellow_lya.destroy();
		this._fLightningYellow_lya = null;

		this._fLightningPink_lpa && this._fLightningPink_lpa.destroy();
		this._fLightningPink_lpa = null;

		for (let i = 0; i < this._fPurplePinkSmokeAnimation_lbyosa_arr.length; i++)
		{
			this._fPurplePinkSmokeAnimation_lbyosa_arr[i] && this._fPurplePinkSmokeAnimation_lbyosa_arr[i].destroy();
		}
		this._fPurplePinkSmokeAnimation_lbyosa_arr = [];

		this._fSmoke6_spr && Sequence.destroy(Sequence.findByTarget(this._fSmoke6_spr));
		this._fSmoke6_spr && this._fSmoke6_spr.destroy();
		this._fSmoke6_spr = null;
		this._fIsNeedSmoke6ContainerWiggle_bl = null;
		
		this._fLightning2Ring_spr && this._fLightning2Ring_spr.destroy();
		this._fLightning2Ring_spr = null;

		this._fLight5_spr && Sequence.destroy(Sequence.findByTarget(this._fLight5_spr));
		this._fLight5_spr && this._fLight5_spr.destroy();
		this._fLight5_spr = null;
		this._fIsNeedLight5ContainerWiggle_bl = null;

		this._fSmoke6Container_spr && Sequence.destroy(Sequence.findByTarget(this._fSmoke6Container_spr));
		this._fSmoke6Container_spr && this._fSmoke6Container_spr.destroy();
		this._fSmoke6Container_spr = null;

		this._fLight5Container_spr && Sequence.destroy(Sequence.findByTarget(this._fLight5Container_spr));
		this._fLight5Container_spr && this._fLight5Container_spr.destroy();
		this._fLight5Container_spr = null;
	}

	destroy()
	{
		super.destroy();

		this._destroyAnimation();
	}
}

export default LightningBossSmokeMainAnimation;