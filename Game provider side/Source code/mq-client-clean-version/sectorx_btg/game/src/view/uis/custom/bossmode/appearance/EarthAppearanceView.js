import AppearanceView from './AppearanceView';
import { ENEMIES, FRAME_RATE } from '../../../../../../../shared/src/CommonConstants';
import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { Utils } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import Sequence from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import Sprite from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import * as Easing from '../../../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import AtlasConfig from '../../../../../config/AtlasConfig';
import { AtlasSprite } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import Timer from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';

import EarthBigStoneRock from '../animation/EarthBigStoneRock';
import EarthCrackAnimation from './animation/EarthCrackAnimation';
import EarthSmallStoneRockAnimation from './animation/EarthSmallStoneRockAnimation';
import EarthSmokeJumpsAnimation from './animation/EarthSmokeJumpsAnimation';
import EarthStoneExplosionAnimation from './animation/EarthStoneExplosionAnimation';
import EarthSmokeTrailAndMediumStoneAnimation from './animation/EarthSmokeTrailAndMediumStoneAnimation';
import { generateFlameTextures } from '../../../../../main/animation/boss_mode/fire/FlameAnimation';
import { generateTopExplosionTextures } from '../../../../../main/animation/boss_mode/fire/AppearingTopFireAnimation';


function _createTallExplosionTextures()
{
	return generateTopExplosionTextures();
}

function _crateFlameExplosionTextures()
{
	return generateFlameTextures().slice(9);
}

function _crateSmokeExplosionTextures()
{
	return AtlasSprite.getFrames(APP.library.getAsset("boss_mode/earth/smoke_explosion"), AtlasConfig.SmokeExplosion, "");
}

function _crateStoneExplosion0Textures()
{
	return AtlasSprite.getFrames(APP.library.getAsset("boss_mode/earth/stone_explosion_0"), AtlasConfig.Stone0Explosion, "");
}

function _crateEnergyBurstTextures()
{
	return AtlasSprite.getFrames(APP.library.getAsset("boss_mode/earth/energy_burst"), AtlasConfig.EarthEnergyBurst, "");
}

class EarthAppearanceView extends AppearanceView {

	static get EVENT_APPEARING_PRESENTATION_STARTED() { return AppearanceView.EVENT_APPEARING_PRESENTATION_STARTED; }
	static get EVENT_SHAKE_THE_GROUND_REQUIRED() { return AppearanceView.EVENT_SHAKE_THE_GROUND_REQUIRED; }

	constructor(aViewContainerInfo_obj)
	{
		super();

		this._fViewContainerInfo_obj = aViewContainerInfo_obj;

		this._fAnimationCount_num = null;

		this._fBottomFXContainer = this._fViewContainerInfo_obj.container.addChild(new Sprite());
		this._fBottomFXContainer.zIndex = this._fViewContainerInfo_obj.bottomZIndex;
		this._fTopFXContainer = this._fViewContainerInfo_obj.container.addChild(new Sprite());
		this._fTopFXContainer.zIndex = this._fViewContainerInfo_obj.zIndex;

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._fBlackSolidContainer_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
			this._fBlackSolidContainer_spr.position.set(480, 270); //960/2, 540/2
			this._fBottomFXContainer.addChild(this._fBlackSolidContainer_spr);
		}

		this._fCrackContainer_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
		this._fCrackContainer_spr.position.set(480, 270); //960/2, 540/2
		this._fBottomFXContainer.addChild(this._fCrackContainer_spr);

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._fDimAnimationContainer_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
			this._fDimAnimationContainer_spr.position.set(480, 270); //960/2, 540/2
			this._fBottomFXContainer.addChild(this._fDimAnimationContainer_spr);

			this._fFXExplosionTrailContainer_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
			this._fFXExplosionTrailContainer_spr.position.set(480, 270); //960/2, 540/2
			this._fBottomFXContainer.addChild(this._fFXExplosionTrailContainer_spr);

			this._fSmallStoneRocks1Container_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
			this._fSmallStoneRocks1Container_spr.position.set(480, 320); //960/2, 50 + 540/2)
			this._fBottomFXContainer.addChild(this._fSmallStoneRocks1Container_spr);

			this._fFastSmoke1Container_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
			this._fFastSmoke1Container_spr.position.set(480, 270); //960/2, 540/2
			this._fBottomFXContainer.addChild(this._fFastSmoke1Container_spr);

			this._fSmokeJumpsContainer_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
			this._fSmokeJumpsContainer_spr.position.set(480, 320); //960/2, 50 + 540/2)
			this._fBottomFXContainer.addChild(this._fSmokeJumpsContainer_spr);
		}

		this._fRocksGroundContainer_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
		this._fRocksGroundContainer_spr.position.set(480, 270); //960/2, 540/2
		this._fBottomFXContainer.addChild(this._fRocksGroundContainer_spr);

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._fSmokeJumpOnceContainer_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
			this._fSmokeJumpOnceContainer_spr.position.set(480, 320); //960/2, 50 + 540/2)
			this._fBottomFXContainer.addChild(this._fSmokeJumpOnceContainer_spr);

			this._fFastSmoke2Container_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
			this._fFastSmoke2Container_spr.position.set(480, 320); //960/2, 50 + 540/2)
			this._fBottomFXContainer.addChild(this._fFastSmoke2Container_spr);

			this._fRock11Container_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
			this._fRock11Container_spr.position.set(480, 320); //960/2, 50 + 540/2)
			this._fBottomFXContainer.addChild(this._fRock11Container_spr);

			this._fFastSmoke3Container_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
			this._fFastSmoke3Container_spr.position.set(480, 320); //960/2, 50 + 540/2)
			this._fBottomFXContainer.addChild(this._fFastSmoke3Container_spr);

			this._fStoneExplosion2Container_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
			this._fStoneExplosion2Container_spr.position.set(480, 320); //960/2, 50 + 540/2)
			this._fBottomFXContainer.addChild(this._fStoneExplosion2Container_spr);

			this._fFastSmoke4Container_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
			this._fFastSmoke4Container_spr.position.set(480, 320); //960/2, 50 + 540/2)
			this._fBottomFXContainer.addChild(this._fFastSmoke4Container_spr);

			this._fSmallStoneRocks2Container_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
			this._fSmallStoneRocks2Container_spr.position.set(480, 320); //960/2, 50 + 540/2)
			this._fBottomFXContainer.addChild(this._fSmallStoneRocks2Container_spr);


			this._fSmokeTrailContainer_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
			this._fSmokeTrailContainer_spr.position.set(480, 320); //960/2, 50 + 540/2)
			this._fTopFXContainer.addChild(this._fSmokeTrailContainer_spr);
		}

		this._fMiniExplosion3Container_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
		this._fMiniExplosion3Container_spr.position.set(480, 320); //960/2, 50 + 540/2)
		this._fTopFXContainer.addChild(this._fMiniExplosion3Container_spr);

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._fSmallStoneRocks3Container_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
			this._fSmallStoneRocks3Container_spr.position.set(480, 320); //960/2, 50 + 540/2)
			this._fTopFXContainer.addChild(this._fSmallStoneRocks3Container_spr);

			this._fCircleBlastContainer_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
			this._fCircleBlastContainer_spr.position.set(480, 270); //960/2, 540/2
			this._fTopFXContainer.addChild(this._fCircleBlastContainer_spr);
		}
		
		this._fEnergyBurstContainer_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
		this._fEnergyBurstContainer_spr.position.set(480, 320); //960/2, 50 + 540/2)
		this._fTopFXContainer.addChild(this._fEnergyBurstContainer_spr);

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._fLightCircle2OneContainer_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
			this._fLightCircle2OneContainer_spr.position.set(480, 270); //960/2, 540/2
			this._fTopFXContainer.addChild(this._fLightCircle2OneContainer_spr);

			this._fParticlesYellowContainer_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
			this._fParticlesYellowContainer_spr.position.set(480, 270); //960/2, 540/2
			this._fTopFXContainer.addChild(this._fParticlesYellowContainer_spr);

			this._fLight5Container_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
			this._fLight5Container_spr.position.set(480, 270); //960/2, 540/2
			this._fTopFXContainer.addChild(this._fLight5Container_spr);

			this._fLight2Container_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
			this._fLight2Container_spr.position.set(480, 270); //960/2, 540/2
			this._fTopFXContainer.addChild(this._fLight2Container_spr);
		}

		this._fLightCircleContainer_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
		this._fLightCircleContainer_spr.position.set(480, 270); //960/2, 540/2
		this._fTopFXContainer.addChild(this._fLightCircleContainer_spr);

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._fLightCircle2TwoContainer_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
			this._fLightCircle2TwoContainer_spr.position.set(480, 270); //960/2, 540/2
			this._fTopFXContainer.addChild(this._fLightCircle2TwoContainer_spr);
		}

		this._fStoneExplosionContainer_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
		this._fStoneExplosionContainer_spr.position.set(480, 320); //960/2, 50 + 540/2)
		this._fTopFXContainer.addChild(this._fStoneExplosionContainer_spr);

		this._fSmokeExplosionContainer_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
		this._fSmokeExplosionContainer_spr.position.set(480, 320); //960/2, 50 + 540/2)
		this._fTopFXContainer.addChild(this._fSmokeExplosionContainer_spr);
		
		this._fTallExplosionContainer_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
		this._fTallExplosionContainer_spr.position.set(480, 320); //960/2, 50 + 540/2)
		this._fTopFXContainer.addChild(this._fTallExplosionContainer_spr);

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._fSmokeSpin2Container_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
			this._fSmokeSpin2Container_spr.position.set(480, 270); //960/2, 540/2
			this._fTopFXContainer.addChild(this._fSmokeSpin2Container_spr);

			this._fOpticalFlareContainer_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
			this._fOpticalFlareContainer_spr.position.set(480, 270); //960/2, 540/2
			this._fTopFXContainer.addChild(this._fOpticalFlareContainer_spr);
		}

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._fBlackSolid_spr = null;
			this._fDim_spr = null;
			this._fFXExplosionTrail_spr = null;
			this._fEarthSmallStoneRock1Animation_essra = null;
			this._fEarthSmokeJumpAnimation_esja = null;
			this._fStartRockGroundTimer_tmr = null;
			this._fRock11Animation_essra = null;
			this._fStoneExplosion2Animation_esea = null;
			this._fEarthSmallStoneRock2Animation_essra = null;
			this._fEarthSmokeTrailAnimation_esta = null;
			this._fEarthSmallStoneRock3Animation_essra = null;
			this._fCircleBlast1_spr = null;
			this._fCircleBlast2_spr = null;
			this._fLightCircle2One_spr = null;
			this._fLightParticleYellow_sprt = null;
			this._fLight5_spr = null;
			this._fLight2_spr = null;
			this._fLightCircle2Two_spr = null;
			this._fStartSmokeExplosionTimer_tmr = null;
			this._fStartTallExplosionTimer_tmr = null;
			this._fSmokeSpin2_spr = null;				
			this._fOpticalFlare_spr = null;	
			this._fOpticalFlare1_spr = null;
			this._fOpticalFlare2_spr = null;
		}

		this._fMiniExplosionMovAnimationLightParticle_spr_arr = [];
		this._fMiniExplosionSmokeOrange_spr_arr = [];
		this._fMiniExplosionSmoke6_spr_arr = [];
		this._fMiniExplosionSmokeOrange2_spr_arr = [];
		this._fMiniExplosionMovAnimation_spr_arr = [];
		this._fParticles_arr = [];
		this._fEarthCrackAnimation_eca = null;
		this._fStartMiniExplosionTimer1_tmr = null;
		this._fMiniExplosion3Container1_spr = null;
		this._fStartMiniExplosionTimer2_tmr = null;
		this._fMiniExplosion3Container2_spr = null;
		this._fEnergyBurst_spr = null;
		this._fStartEnergyBurstTimer_tmr = null;
		this._fLightCircle_sprt = null;
		this._fRockGroundAnimation_ebsr = null;
		this._fStoneExplosionAnimation_esea = null;
		this._fSmokeExplosion_spr = null;
		this._fTallExplosion_spr = null;

		this._fSpinOrangeSmoke_spt_arr = [];
		this._fShowBossTimer_t = null;

		this._init();
	}

	//INIT...

	_init()
	{
	}


	get _bossType()
	{
		return ENEMIES.Earth;
	}
	
	get _captionPosition()
	{
		return { x:0, y:-4 };
	}

	get _appearingCulminationTime()
	{
		return 37 * FRAME_RATE;
	}

	get _needShowBossOnCulminateImmediately()
	{
		return false;
	}
	//...INIT

	//ANIMATION...
	//override
	_playAppearingAnimation()
	{
		super._playAppearingAnimation();
		this._startAppearingAnimation();

		this._fShowBossTimer_t && this._fShowBossTimer_t.destructor();
		this._fShowBossTimer_t = new Timer(this._onTimeToShowBossOnAppearing.bind(this), 94 * FRAME_RATE);
	}

	_onTimeToShowBossOnAppearing()
	{
		this._fShowBossTimer_t && this._fShowBossTimer_t.destructor();
		this._fBossZombie_e && this._fBossZombie_e.doVisibleBossOnAppearance();
	}

	_startAppearingAnimation()
	{
		this._fAnimationCount_num = 0;

		this._startCrackAnimation();

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startBlackSolidAnimation();
			this._startDimAnimation();
			this._startFXExplosionTrail();
			this._startSmallRockOneAnimation();
			this._startSmokeJumpsAnimation();
			this._startRock11Animation();
			this._startStoneExplosion2Animation();
			this._startSmallRockTwoAnimation();
			this._startSmokeTrailAnimation();
			this._startCircleBlastAnimation();
			this._startLightCircle2OneAnimation();
			this._startParticlesYellowAnimation();
			this._startLight5Animation();
			this._startLight2Animation();
			this._startSmokeSpin2Animation();
			this._startOpticalFlareAnimation();
			this._startSmallRockThreeAnimation();
		}

		this._startRockGroundAnimation();
		this._startMiniExplosion3Animation();
		this._startEnergyBurstAnimation();
		this._startLightCircleAnimation();

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startLightCircle2TwoAnimation();
			this._startStoneExplosionAnimation();
		}
		this._startSmokeExplosionAnimation();
		this._startTallExplosionAnimation();

		this.emit(EarthAppearanceView.EVENT_APPEARING_PRESENTATION_STARTED);
		this.emit(EarthAppearanceView.EVENT_SHAKE_THE_GROUND_REQUIRED);
	}

	_startBlackSolidAnimation()
	{
		let lBlackSolid_spr = this._fBlackSolid_spr = this._fBlackSolidContainer_spr.addChild(APP.library.getSprite('boss_mode/earth/black_solid'));
		lBlackSolid_spr.alpha = 0;
		lBlackSolid_spr.position.set(0, 50);
		lBlackSolid_spr.scale.set(2)

		let l_seq = [
			{tweens: [ {prop: 'alpha', to: 0.5}], duration: 13 * FRAME_RATE},
			{tweens: [], duration: 66 * FRAME_RATE},
			{tweens: [ {prop: 'alpha', to: 0}], duration: 22 * FRAME_RATE,
				onfinish: ()=>{
					this._fAnimationCount_num--; 
					lBlackSolid_spr && lBlackSolid_spr.destroy();
					this._onAnimationCompletedSuspicison();
			}}
		]

		this._fAnimationCount_num++;
		Sequence.start(lBlackSolid_spr, l_seq);
	}

	_startCrackAnimation()
	{
		this._fAnimationCount_num++;
		let lCrack_c = this._fEarthCrackAnimation_eca = this._fCrackContainer_spr.addChild(new EarthCrackAnimation());
		lCrack_c.on(EarthCrackAnimation.EVENT_ON_ANIMATION_ENDED, this._onCrackAnimationCompleted, this);
		lCrack_c.startAnimation();
	}

	_onCrackAnimationCompleted()
	{
		this._fAnimationCount_num--;
		this._onAnimationCompletedSuspicison();
	}

	_startDimAnimation()
	{
		let lDim_spr = this._fDim_spr = this._fDimAnimationContainer_spr.addChild(new PIXI.Graphics());
		lDim_spr.alpha = 0;
		lDim_spr.beginFill(0x000000).drawRect(-960, -540, 1920, 1080).endFill();

		let l_seq = [
			{tweens: [], duration: 8 * FRAME_RATE},
			{tweens: [ {prop: 'alpha', to: 0.3}], duration: 93 * FRAME_RATE},
			{tweens: [ {prop: 'alpha', to: 0}], duration: 6 * FRAME_RATE,
				onfinish: ()=>{
					this._fAnimationCount_num--;
					this._onAnimationCompletedSuspicison();
			}}
		];

		this._fAnimationCount_num++;
		Sequence.start(lDim_spr, l_seq);
	
	}

	_startFXExplosionTrail()
	{
		let lFXExplosionTrail_spr = this._fFXExplosionTrail_spr = this._fFXExplosionTrailContainer_spr.addChild(APP.library.getSprite('boss_mode/earth/explosion_trail'));
		lFXExplosionTrail_spr.alpha = 0;
		lFXExplosionTrail_spr.position.set(4.1, 45.6); //8.2 / 2, (41.2 + 50) / 2
		lFXExplosionTrail_spr.scale.set(2.01, 1.414);

		let l_seq = [
			{tweens: [], duration: 116 * FRAME_RATE},
			{tweens: [ {prop: 'alpha', to: 0.8}], duration: 8 * FRAME_RATE},
			{tweens: [], duration: 12 * FRAME_RATE},
			{tweens: [ {prop: 'alpha', to: 0}], duration: 18 * FRAME_RATE,
				onfinish: ()=>{
					this._fAnimationCount_num--; 
					lFXExplosionTrail_spr && lFXExplosionTrail_spr.destroy();
					this._onAnimationCompletedSuspicison();
			}}
		]

		this._fAnimationCount_num++;
		Sequence.start(lFXExplosionTrail_spr, l_seq);
	}

	_startSmallRockOneAnimation() 
	{
		this._fEarthSmallStoneRock1Animation_essra = this._fSmallStoneRocks1Container_spr.addChild(new EarthSmallStoneRockAnimation());
		this._fEarthSmallStoneRock1Animation_essra.once(EarthSmallStoneRockAnimation.EVENT_ON_ANIMATION_ENDED, this._onEarthSmallStoneRock1AnimationCompleted, this);
		this._fAnimationCount_num++;
		this._fEarthSmallStoneRock1Animation_essra.i_startAnimation(1);
	}

	_onEarthSmallStoneRock1AnimationCompleted()
	{
		this._fAnimationCount_num--;
		this._onAnimationCompletedSuspicison();
	}

	_startSmokeJumpsAnimation()
	{
		this._fEarthSmokeJumpAnimation_esja = new EarthSmokeJumpsAnimation(this._fSmokeJumpsContainer_spr, this._fSmokeJumpOnceContainer_spr);
		this._fEarthSmokeJumpAnimation_esja.once(EarthSmokeJumpsAnimation.EVENT_ON_ANIMATION_ENDED, this._onEarthSmokeJumpsAnimationCompleted, this);
		this._fAnimationCount_num++;
		this._fEarthSmokeJumpAnimation_esja.i_startAnimation();
	}

	_onEarthSmokeJumpsAnimationCompleted()
	{
		this._fEarthSmokeJumpAnimation_esja.destroy();
		this._fAnimationCount_num--;
		this._onAnimationCompletedSuspicison();
	}


	_startRockGroundAnimation()
	{
		this._fAnimationCount_num++;
		let lTimer1 = this._fStartRockGroundTimer_tmr = new Timer(()=>{
			lTimer1 && lTimer1.destructor();
			this._fRockGroundAnimation_ebsr = this._fRocksGroundContainer_spr.addChild(new EarthBigStoneRock());
			this._fRockGroundAnimation_ebsr.position.set(-7.25, 31.25); //-14.5/2, 62.5/2
			this._fRockGroundAnimation_ebsr.scale.set(1.119, 1.119);
			this._fRockGroundAnimation_ebsr.on(EarthBigStoneRock.EVENT_ON_ANIMATION_ENDED, this._onRockGroundAnimationCompleted, this);
			this._fRockGroundAnimation_ebsr.startAnimation();
		}, 31 * FRAME_RATE, true);
	}

	_onRockGroundAnimationCompleted()
	{
		this._fRockGroundAnimation_ebsr && this._fRockGroundAnimation_ebsr.destroy();
		this._fAnimationCount_num--;
		this._onAnimationCompletedSuspicison();
	}

	_startRock11Animation()
	{
		this._fRock11Animation_essra = this._fRock11Container_spr.addChild(new EarthSmallStoneRockAnimation());
		this._fRock11Animation_essra.once(EarthSmallStoneRockAnimation.EVENT_ON_ANIMATION_ENDED, this._onRock11AnimationCompleted, this);
		this._fAnimationCount_num++;
		this._fRock11Animation_essra.i_startAnimation(2);
	}

	_onRock11AnimationCompleted()
	{
		this._fAnimationCount_num--;
		this._onAnimationCompletedSuspicison();
	}

	_startStoneExplosion2Animation()
	{
		this._fStoneExplosion2Animation_esea = this._fStoneExplosion2Container_spr.addChild(new EarthStoneExplosionAnimation());
		this._fStoneExplosion2Animation_esea.once(EarthStoneExplosionAnimation.EVENT_ON_ANIMATION_ENDED, this._onStoneExplosion2AnimationCompleted, this);
		this._fAnimationCount_num++;
		this._fStoneExplosion2Animation_esea.i_startAnimation(2);
	}

	_onStoneExplosion2AnimationCompleted()
	{
		this._fStoneExplosion2Animation_esea && this._fStoneExplosion2Animation_esea.destroy();
		this._fAnimationCount_num--;
		this._onAnimationCompletedSuspicison();
	}

	_startSmallRockTwoAnimation()
	{
		this._fEarthSmallStoneRock2Animation_essra = this._fSmallStoneRocks2Container_spr.addChild(new EarthSmallStoneRockAnimation());
		this._fEarthSmallStoneRock2Animation_essra.once(EarthSmallStoneRockAnimation.EVENT_ON_ANIMATION_ENDED, this._onEarthSmallStoneRock2AnimationCompleted, this);
		this._fAnimationCount_num++;
		this._fEarthSmallStoneRock2Animation_essra.i_startAnimation(3);
	}

	_onEarthSmallStoneRock2AnimationCompleted()
	{
		this._fAnimationCount_num--;
		this._onAnimationCompletedSuspicison();
	}

	_startSmokeTrailAnimation()
	{
		this._fEarthSmokeTrailAnimation_esta = this._fSmokeTrailContainer_spr.addChild(new EarthSmokeTrailAndMediumStoneAnimation());
		this._fEarthSmokeTrailAnimation_esta.once(EarthSmokeTrailAndMediumStoneAnimation.EVENT_ON_ANIMATION_ENDED, this._onSmokeTrailAnimationCompleted, this);
		this._fAnimationCount_num++;
		this._fEarthSmokeTrailAnimation_esta.i_startAnimation();
	}

	_onSmokeTrailAnimationCompleted()
	{
		this._fAnimationCount_num--;
		this._onAnimationCompletedSuspicison();
	}

	_startMiniExplosion3Animation()
	{
		let lTimer1 = this._fStartMiniExplosionTimer1_tmr = new Timer(()=>{
			lTimer1 && lTimer1.destructor();
			this._fMiniExplosion3Container1_spr = this._fMiniExplosion3Container_spr.addChild(new Sprite());
			this._fMiniExplosion3Container1_spr.position.set(-3.35, -34.85); //-6.7/2, -69.7/2
			this._startMiniExplosionAnimation(2, this._fMiniExplosion3Container1_spr, 1);
			this._fAnimationCount_num--;
		}, 34 * FRAME_RATE, true);

		let lTimer2 = this._fStartMiniExplosionTimer2_tmr = new Timer(()=>{
			lTimer2 && lTimer2.destructor();
			this._fMiniExplosion3Container2_spr = this._fMiniExplosion3Container_spr.addChild(new Sprite());
			this._fMiniExplosion3Container2_spr.position.set(13.4, -53.5); //26.8/2, -107/2
			this._fMiniExplosion3Container2_spr.scale.set(0.71, 0.71);
			this._startMiniExplosionAnimation(2, this._fMiniExplosion3Container2_spr, 2);
			this._fAnimationCount_num--;
		}, 52 * FRAME_RATE, true);

		this._fAnimationCount_num++;
		this._fAnimationCount_num++;
	}

	_startSmallRockThreeAnimation()
	{
		this._fEarthSmallStoneRock3Animation_essra = this._fSmallStoneRocks3Container_spr.addChild(new EarthSmallStoneRockAnimation());
		this._fEarthSmallStoneRock3Animation_essra.once(EarthSmallStoneRockAnimation.EVENT_ON_ANIMATION_ENDED, this._onEarthSmallStoneRock3AnimationCompleted, this);
		this._fAnimationCount_num++;
		this._fEarthSmallStoneRock3Animation_essra.i_startAnimation(4);
	}

	_onEarthSmallStoneRock3AnimationCompleted()
	{
		this._fAnimationCount_num--;
		this._onAnimationCompletedSuspicison();
	}

	_startCircleBlastAnimation()
	{
		let lCircleBlast1_sprt = this._fCircleBlast1_spr = this._fCircleBlastContainer_spr.addChild(APP.library.getSprite('boss_mode/common/circle_blast'));
		let lCircleBlast2_sprt = this._fCircleBlast2_spr = this._fCircleBlastContainer_spr.addChild(APP.library.getSprite('boss_mode/common/circle_blast'));
		lCircleBlast1_sprt.alpha = 0.6;
		lCircleBlast2_sprt.alpha = 0.48;
		lCircleBlast1_sprt.blendMode = PIXI.BLEND_MODES.ADD;
		lCircleBlast2_sprt.blendMode = PIXI.BLEND_MODES.ADD;

		this._fCircleBlastContainer_spr.position.set(472, 252); //960/2 -16/2, 540/2 -36/2
		this._fCircleBlastContainer_spr.alpha = 0;
		this._fCircleBlastContainer_spr.scale.set(0.156, 0.156);

		let l_seq = [
			{tweens: [], duration: 102 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}], duration: 0 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 1.118}, {prop: 'scale.y', to: 1.118}], duration: 4 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 4.124}, {prop: 'scale.y', to: 4.124}, {prop: 'alpha', to: 0}], duration: 8 * FRAME_RATE,
				onfinish: ()=>{
					this._fAnimationCount_num--; 
					this._fCircleBlastContainer_spr && this._fCircleBlastContainer_spr.destroy();
					this._onAnimationCompletedSuspicison();
			}}
		]

		this._fAnimationCount_num++;
		Sequence.start(this._fCircleBlastContainer_spr, l_seq);
	}

	_startEnergyBurstAnimation()
	{
		if (!APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			return;
		}

		let lEnergyBurst_spr = this._fEnergyBurst_spr = this._fEnergyBurstContainer_spr.addChild(new Sprite());
		lEnergyBurst_spr.textures = _crateEnergyBurstTextures();
		lEnergyBurst_spr.animationSpeed = 0.5; // 30 / 60;
		lEnergyBurst_spr.position.set(24, -102); //48 / 2, -204 / 2
		lEnergyBurst_spr.alpha = 0;
		lEnergyBurst_spr.scale.set(1.45, 1.45);
		lEnergyBurst_spr.blendMode = PIXI.BLEND_MODES.ADD;
	
		lEnergyBurst_spr.on('animationend', ()=>{
			lEnergyBurst_spr.stop();
			lEnergyBurst_spr && lEnergyBurst_spr.destroy();
			lEnergyBurst_spr = null;
			this._fAnimationCount_num--;
			this._onAnimationCompletedSuspicison();
		});
	
		this._fAnimationCount_num++;
		let lStartTimer = this._fStartEnergyBurstTimer_tmr = new Timer(()=>{
				lStartTimer && lStartTimer.destructor();
				lEnergyBurst_spr.alpha = 1;
				lEnergyBurst_spr.play();
		}, 101 * FRAME_RATE, true);
	}

	_startLightCircle2OneAnimation()
	{
		let lLightCircle2_sprt = this._fLightCircle2One_spr = this._fLightCircle2OneContainer_spr.addChild(APP.library.getSprite('boss_mode/common/light_circle_2'));
		lLightCircle2_sprt.position.set(-16.25, 11.2); //-32.5/2, 22.4/2
		lLightCircle2_sprt.alpha = 0;
		lLightCircle2_sprt.scale.set(3.3, 3.3); //1.65*2, 1.65*2
		lLightCircle2_sprt.rotation = 5.3005649383067786; //Utils.gradToRad(303.7);
		lLightCircle2_sprt.blendMode = PIXI.BLEND_MODES.ADD;

		let l_seq = [
			{tweens: [], duration: 101 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 2.466}, {prop: 'scale.y', to: 2.466}, {prop: 'alpha', to: 0.99}], duration: 3 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 5.14}, {prop: 'scale.y', to: 5.14}, {prop: 'alpha', to: 0}], duration: 13 * FRAME_RATE,
				onfinish: ()=>{
					this._fAnimationCount_num--; 
					lLightCircle2_sprt && lLightCircle2_sprt.destroy();
					this._onAnimationCompletedSuspicison();
			}}
		]

		this._fAnimationCount_num++;
		Sequence.start(lLightCircle2_sprt, l_seq);
	}

	_startParticlesYellowAnimation()
	{
		let lLightParticleYellow_sprt = this._fLightParticleYellow_sprt = this._fParticlesYellowContainer_spr.addChild(this._createLight("boss_mode/common/particles_yellow", 0.52, PIXI.BLEND_MODES.ADD));
		lLightParticleYellow_sprt.position.set(-0.5, -42.2); //-1/2, -84.4/2
		lLightParticleYellow_sprt.alpha = 0;

		let l_seq =[
			{tweens: [],duration: 106 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}],duration: 0 * FRAME_RATE},
			{tweens: [ {prop: "scale.x", to: 17.68}, {prop: "scale.y", to: 17.68} ],duration: 12 * FRAME_RATE,
			onfinish: ()=>{
				lLightParticleYellow_sprt && lLightParticleYellow_sprt.destroy();
				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			}},
		];

		this._fAnimationCount_num ++;
		Sequence.start(lLightParticleYellow_sprt, l_seq);
	}

	_startLight5Animation()
	{
		let lLight_sprt = this._fLight5_spr = this._fLight5Container_spr.addChild(this._createLight("common/misty_flare", 0.19, PIXI.BLEND_MODES.ADD));
		lLight_sprt.position.set(-2.5, -18.8); //-5/2, -37.6/2
		lLight_sprt.alpha = 0;

		let lScaleLight_seq =[
			{tweens: [],duration: 100 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0.6}],duration: 0 * FRAME_RATE},
			{tweens: [ {prop: "scale.x", to: 8.492}, {prop: "scale.y", to: 8.492}],duration: 2 * FRAME_RATE},
			{tweens: [ {prop: "scale.x", to: 8.042}, {prop: "scale.y", to: 8.042}],duration: 10 * FRAME_RATE},
			{tweens: [ {prop: "scale.x", to: 0.187}, {prop: "scale.y", to: 0.187}, {prop: 'alpha', to: 0} ],duration: 46 * FRAME_RATE,
			onfinish: ()=>{
				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			}},
		];

		this._fAnimationCount_num++;
		Sequence.start(lLight_sprt, lScaleLight_seq);
	}

	_startLight2Animation()
	{
		let lLight_sprt = this._fLight2_spr = this._fLight2Container_spr.addChild(this._createLight("boss_mode/common/fx_light_2", 4.72, PIXI.BLEND_MODES.ADD));
		lLight_sprt.position.set(-264.3, -88.1); //-528.6/2, -176.2/2
		lLight_sprt.alpha = 0;

		let l_seq =[
			{tweens: [],duration: 101 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0.48}],duration: 1 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0}],duration: 20 * FRAME_RATE,
			onfinish: ()=>{
				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			}},
		];

		this._fAnimationCount_num++;
		Sequence.start(lLight_sprt, l_seq);
	}

	_startLightCircleAnimation()
	{
		let lLightCircle_sprt = this._fLightCircle_sprt = this._fLightCircleContainer_spr.addChild(this._createLight("boss_mode/common/light_circle_1", 0.84));
		lLightCircle_sprt.position.set(-5.15, -17.75); //-10.3/2, -35.5/2
		lLightCircle_sprt.alpha = 0;

		let l_seq =[
			{tweens: [],duration: 100 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0.6}],duration: 0 * FRAME_RATE},
			{tweens: [],duration: 1 * FRAME_RATE},
			{tweens: [{prop: "scale.x", to: 1.42}, {prop: "scale.y", to: 1.42}],duration: 1 * FRAME_RATE},
			{tweens: [{prop: "scale.x", to: 5.835}, {prop: "scale.y", to: 5.835}, {prop: 'alpha', to: 0}],duration: 5 * FRAME_RATE,
			onfinish: ()=>{
				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			}},
		];

		this._fAnimationCount_num++;
		Sequence.start(lLightCircle_sprt, l_seq);
	}

	_startLightCircle2TwoAnimation()
	{
		let lLightCircle2_sprt = this._fLightCircle2Two_spr = this._fLightCircle2TwoContainer_spr.addChild(APP.library.getSprite('boss_mode/common/light_circle_2'));
		lLightCircle2_sprt.position.set(-2.05, -13.65); //-4.1/2, -27.3/2
		lLightCircle2_sprt.alpha = 0;
		lLightCircle2_sprt.scale.set(0.84, 0.84);
		lLightCircle2_sprt.rotation = 5.3005649383067786; //Utils.gradToRad(303.7);
		lLightCircle2_sprt.blendMode = PIXI.BLEND_MODES.ADD;

		let l_seq = [
			{tweens: [], duration: 101 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}], duration: 0 * FRAME_RATE},
			{tweens: [],duration: 1 * FRAME_RATE},
			{tweens: [{prop: "scale.x", to: 1.152}, {prop: "scale.y", to: 1.152}],duration: 1 * FRAME_RATE},
			{tweens: [{prop: "scale.x", to: 5.837}, {prop: "scale.y", to: 5.837}, {prop: 'alpha', to: 0}],duration: 7 * FRAME_RATE,
				onfinish: ()=>{
					this._fAnimationCount_num--; 
					lLightCircle2_sprt && lLightCircle2_sprt.destroy();
					this._onAnimationCompletedSuspicison();
			}}
		];

		this._fAnimationCount_num++;
		Sequence.start(lLightCircle2_sprt, l_seq);
	}

	_startStoneExplosionAnimation()
	{
		this._fStoneExplosionAnimation_esea = this._fStoneExplosionContainer_spr.addChild(new EarthStoneExplosionAnimation());
		this._fStoneExplosionAnimation_esea.once(EarthStoneExplosionAnimation.EVENT_ON_ANIMATION_ENDED, this._onStoneExplosionAnimationCompleted, this);
		this._fAnimationCount_num++;
		this._fStoneExplosionAnimation_esea.i_startAnimation(1);
	}

	_onStoneExplosionAnimationCompleted()
	{
		this._fStoneExplosionAnimation_esea && this._fStoneExplosionAnimation_esea.destroy();
		this._fAnimationCount_num--;
		this._onAnimationCompletedSuspicison();
	}     
	

	_startSmokeExplosionAnimation()
	{
		let lSmokeExplosion_spr = this._fSmokeExplosion_spr = this._fSmokeExplosionContainer_spr.addChild(new Sprite());
		lSmokeExplosion_spr.textures = _crateSmokeExplosionTextures();
		lSmokeExplosion_spr.animationSpeed = 0.5; //30 / 60;
		lSmokeExplosion_spr.position.set(24, -102); //48 / 2, -204 / 2
		lSmokeExplosion_spr.alpha = 0;
		lSmokeExplosion_spr.scale.set(1.45, 1.45);
		lSmokeExplosion_spr.blendMode = PIXI.BLEND_MODES.ADD;
	
		lSmokeExplosion_spr.on('animationend', ()=>{
			lSmokeExplosion_spr.stop();
			lSmokeExplosion_spr && lSmokeExplosion_spr.destroy();
			lSmokeExplosion_spr = null;
			this._fAnimationCount_num--;
			this._onAnimationCompletedSuspicison();
		});
	
		this._fAnimationCount_num++;
		let lStartTimer = this._fStartSmokeExplosionTimer_tmr = new Timer(()=>{
				lStartTimer && lStartTimer.destructor();
				lSmokeExplosion_spr.alpha = 1;
				lSmokeExplosion_spr.play();
		}, 103 * FRAME_RATE, true);
	}

	_startTallExplosionAnimation()
	{
		let lTallExplosion_spr = this._fTallExplosion_spr = this._fTallExplosionContainer_spr.addChild(new Sprite());
		lTallExplosion_spr.textures = _createTallExplosionTextures();
		lTallExplosion_spr.animationSpeed = 0.5; //30 / 60;
		lTallExplosion_spr.position.set(8.25, -76.7); //16.5 / 2, -153.4 / 2
		lTallExplosion_spr.alpha = 0;
		lTallExplosion_spr.scale.set(1.46, 1.46);
		lTallExplosion_spr.blendMode = PIXI.BLEND_MODES.ADD;
	
		lTallExplosion_spr.on('animationend', ()=>{
			lTallExplosion_spr.stop();
			lTallExplosion_spr && lTallExplosion_spr.destroy();
			lTallExplosion_spr = null;
			this._fAnimationCount_num--;
			this._onAnimationCompletedSuspicison();
		});
	
		this._fAnimationCount_num++;
		let lStartTimer = this._fStartTallExplosionTimer_tmr = new Timer(()=>{
				lStartTimer && lStartTimer.destructor();
				lTallExplosion_spr.alpha = 1;
				lTallExplosion_spr.play();
		}, 102 * FRAME_RATE, true);
	}

	_startSmokeSpin2Animation()
	{
		let lSmokeSpin2_spr = this._fSmokeSpin2_spr = this._fSmokeSpin2Container_spr.addChild(new Sprite());
		let lTimer_seq = [
			{tweens: [],duration:0 * FRAME_RATE, onfinish:()=>{
				this._startSmokeSpin(this._fSmokeSpin2_spr);
			}},
			{tweens: [],duration:10 * FRAME_RATE, onfinish:()=>{
				this._startSmokeSpin(this._fSmokeSpin2_spr);
			},
			onfinish: ()=>{
				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			}}
		];

		this._fAnimationCount_num++;
		Sequence.start(lSmokeSpin2_spr, lTimer_seq);
	}

	
	//...ANIMATION

	_startAnyMovAnimation(aTexture_obj ,aPos_obj, aRot_num, aOptScale_num = 1, aBlendMode = PIXI.BLEND_MODES.ADD, aDelay_num = 0, lContainer = this )
	{
		let lParticle_sprt = lContainer.addChild(new Sprite());
		this._fParticles_arr.push(lParticle_sprt);
		lParticle_sprt.textures = aTexture_obj;
		lParticle_sprt.scale.set(aOptScale_num);
		lParticle_sprt.rotation = aRot_num;
		lParticle_sprt.position.set(aPos_obj.x, aPos_obj.y);
		lParticle_sprt.blendMode = aBlendMode;
		lParticle_sprt.anchor.set(0.5,0.67);
		lParticle_sprt.animationSpeed = 0.5; //30/60;
		lParticle_sprt.on('animationend', () => {
			let id = this._fParticles_arr.indexOf(lParticle_sprt);
			if (~id)
			{
				this._fParticles_arr.splice(id, 1);
			}
			lParticle_sprt && lParticle_sprt.destroy();
			lParticle_sprt = null;

			if (this._fParticles_arr.length == 0)
			{
				this._fParticles_arr = [];
			}

			this._fAnimationCount_num--;
			this._onAnimationCompletedSuspicison();
		});

		let lTimer = [
			{tweens: [],duration: aDelay_num * FRAME_RATE, onfinish: ()=>
			{
				lParticle_sprt.play();
			}},
		]

		this._fAnimationCount_num++;
		Sequence.start(this, lTimer);
		return lParticle_sprt;
	}

	_startMiniExplosionAnimation(aNum_num = 2, aContainer, aIndex)
	{
		let lContainer = aContainer.addChild( new Sprite());
		
		this._startAnyMovAnimation(_crateStoneExplosion0Textures(),{x:0,y:0}, 0,1,PIXI.BLEND_MODES.NORMAL, 4, lContainer);

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startSmokeAnimation(lContainer, aIndex);
		}
		
		if(aNum_num == 2)
		{
			let lFlame_sprt = this._fMiniExplosionMovAnimation_spr_arr[aIndex] = this._startAnyMovAnimation(_crateFlameExplosionTextures(),{x:0,y:0}, 0, 0.64,PIXI.BLEND_MODES.ADD, 1, lContainer);
			let lScaleFlame_seq = 
			[
				{tweens: [],duration: 1 * FRAME_RATE},
				{tweens: [ {prop: "scale.x", to: 1.28}, {prop: "scale.y", to: 1.28} ],duration: 10 * FRAME_RATE, ease:Easing.sine.easeIn,
				onfinish: ()=>{
					this._fAnimationCount_num--;
					this._onAnimationCompletedSuspicison();
				}},
			];

			this._fAnimationCount_num++;
			Sequence.start(lFlame_sprt, lScaleFlame_seq);
		}

	

		let lLightParticle_sprt = this._fMiniExplosionMovAnimationLightParticle_spr_arr[aIndex] = aContainer.addChild(this._createLight("common/light_particle", 7));
		let lAlphaLightParticle_seq =[
			{tweens: [],duration: 5 * FRAME_RATE},
			{tweens: [ {prop: "alpha", to: 0}],duration: 10 * FRAME_RATE, ease:Easing.sine.easeOut,
			onfinish: ()=>{
				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			}},
		];

		this._fAnimationCount_num++;
		Sequence.start(lLightParticle_sprt, lAlphaLightParticle_seq);
	}
	
	_getSmokeAlphaSequance(aDelay)
	{
		return[
			{tweens: [],duration: aDelay * FRAME_RATE},
			{tweens: [ {prop: "alpha", to: 0.49} ],duration:9 * FRAME_RATE, ease:Easing.sine.easeIn},
			{tweens: [ {prop: "alpha", to: 0} ],duration:15 * FRAME_RATE, ease:Easing.sine.easeOut}
		];
	}

	_getSmokeRotationSequance(aDelay)
	{
		return [
			{tweens: [],duration: aDelay * FRAME_RATE},
			{tweens: [{prop: "rotation", to: 0.8377580409572781}],duration: 24 * FRAME_RATE} // Utils.gradToRad(48)
		];
	}

	_startSmokeAnimation(aContainer_sprt, aIndex)
	{
		let lSmokeOrange = this._fMiniExplosionSmokeOrange_spr_arr[aIndex] = aContainer_sprt.addChild(this._createSmoke("boss_mode/earth/smoke_orange", 0.31, 0));

		let lScaleSmokeOrange_seq = 
		[
			{tweens: [],duration: 2 * FRAME_RATE},
			{tweens: [ {prop: "scale.x", to: 0.68}, {prop: "scale.y", to: 0.68} ],duration: 24 * FRAME_RATE, ease:Easing.sine.easeIn}
		];

		let lPositionSmokeOrange_seq = 
		[
			{tweens: [],	duration: 2*FRAME_RATE},
			{tweens: [ {prop: "position.x", to: 86}, {prop: "position.y", to: -88} ],	duration: 24*FRAME_RATE, onfinish: ()=>{
				lSmokeOrange.destroy();
				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			}},
		];

		this._fAnimationCount_num ++;
		Sequence.start(lSmokeOrange, this._getSmokeAlphaSequance(2));
		Sequence.start(lSmokeOrange, this._getSmokeRotationSequance(2));
		Sequence.start(lSmokeOrange, lScaleSmokeOrange_seq);
		Sequence.start(lSmokeOrange, lPositionSmokeOrange_seq);

		let lSmoke6 = this._fMiniExplosionSmoke6_spr_arr[aIndex] = aContainer_sprt.addChild(this._createSmoke("boss_mode/earth/smoke_6", 1.03, 0));

		let lScaleSmoke6_seq =
		[
			{tweens: [],duration: 5 * FRAME_RATE},
			{tweens: [ {prop: "scale.x", to: 1.57}, {prop: "scale.y", to: 1.57} ],duration: 24 * FRAME_RATE, ease:Easing.sine.easeIn},
		];

		let lPositionSmoke6_seq =
		[
			{tweens: [],	duration: 5 * FRAME_RATE},
			{tweens: [ {prop: "position.x", to: -118}, {prop: "position.y", to: 22} ],	duration: 24*FRAME_RATE, onfinish: ()=>{
				lSmoke6.destroy();
				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			}},
		];

		this._fAnimationCount_num ++;
		Sequence.start(lSmoke6, this._getSmokeAlphaSequance(5));
		Sequence.start(lSmoke6, this._getSmokeRotationSequance(5));
		Sequence.start(lSmoke6, lScaleSmoke6_seq);
		Sequence.start(lSmoke6, lPositionSmoke6_seq);

		let lSmokeOrange2 = this._fMiniExplosionSmokeOrange2_spr_arr[aIndex] = aContainer_sprt.addChild(this._createSmoke("boss_mode/earth/smoke_orange", 0.22, 0));
		
		let lScaleSmokeOrange2_seq =
		[
			{tweens: [],duration: 3 * FRAME_RATE},
			{tweens: [ {prop: "scale.x", to: 0.76}, {prop: "scale.y", to: 0.76} ],duration: 24 * FRAME_RATE, ease:Easing.sine.easeIn},
		];

		let lPositionSmokeOrange2_seq =
		[
			{tweens: [],	duration: 3 * FRAME_RATE},
			{tweens: [ {prop: "position.x", to: 34}, {prop: "position.y", to: 50} ],	duration: 24*FRAME_RATE, onfinish: ()=>{
				lSmokeOrange2.destroy();
				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			}},
		];

		this._fAnimationCount_num ++;
		Sequence.start(lSmokeOrange2, this._getSmokeAlphaSequance(3));
		Sequence.start(lSmokeOrange2, this._getSmokeRotationSequance(3));
		Sequence.start(lSmokeOrange2, lScaleSmokeOrange2_seq);
		Sequence.start(lSmokeOrange2, lPositionSmokeOrange2_seq);
	}

	_createSmoke(aName_srt, aScale, aAlpha)
	{
		let lSmoke = APP.library.getSprite(aName_srt);
		lSmoke.anchor.set(0.5, 0.5);
		lSmoke.scale.set(aScale);
		lSmoke.alpha = aAlpha;

		return lSmoke;
	}

	_createLight(aName_srt, aScale, blendMode = PIXI.BLEND_MODES.ADD)
	{
		let lLight_sprt = APP.library.getSprite(aName_srt);
		lLight_sprt.anchor.set(0.5, 0.5);
		lLight_sprt.scale.set(aScale);
		lLight_sprt.blendMode = blendMode;

		return lLight_sprt;
	}

	_startSmokeSpin(aContainer)
	{
		let lContainer_sprt = aContainer.addChild(new Sprite());

		let lTimerOrangeSmoke_seq =
		[
			{tweens: [],duration: 0 * FRAME_RATE, onfinish: () => {
				let lSmoke = this._fSpinOrangeSmoke_spt_arr[0] = lContainer_sprt.addChild(this._createSmoke("boss_mode/earth/smoke_orange", 0.67, 0));
				lSmoke.position.set(-128, -65);
				lSmoke.rotation = 0; //Utils.gradToRad(0);

				this._fAnimationCount_num += 4;
				let lSequanse_obj = this._createSmokeOrangeSpinSequanse(1.5009831567151233); //Utils.gradToRad(86)
				Sequence.start(lSmoke, lSequanse_obj.position)
				Sequence.start(lSmoke, lSequanse_obj.scale)
				Sequence.start(lSmoke, lSequanse_obj.rotation)
				Sequence.start(lSmoke, lSequanse_obj.alpha)
			}},
			{tweens: [],duration: 7 * FRAME_RATE, onfinish: () => {
				let lSmoke = this._fSpinOrangeSmoke_spt_arr[1] = lContainer_sprt.addChild(this._createSmoke("boss_mode/earth/smoke_orange", 0.67, 0));
				lSmoke.position.set(-128, -65);
				lSmoke.rotation = 0; //Utils.gradToRad(0);

				this._fAnimationCount_num += 4;
				let lSequanse_obj = this._createSmokeOrangeSpinSequanse(1.5009831567151233); //Utils.gradToRad(86)
				Sequence.start(lSmoke, lSequanse_obj.position)
				Sequence.start(lSmoke, lSequanse_obj.scale)
				Sequence.start(lSmoke, lSequanse_obj.rotation)
				Sequence.start(lSmoke, lSequanse_obj.alpha)
			}},
			{tweens: [],duration: 7 * FRAME_RATE, onfinish: () => {
				let lSmoke = this._fSpinOrangeSmoke_spt_arr[2] = lContainer_sprt.addChild(this._createSmoke("boss_mode/earth/smoke_orange", 0.67, 0.23));
				lSmoke.position.set(-128, -65);
				lSmoke.rotation = -1.1868238913561442; //Utils.gradToRad(-68);

				this._fAnimationCount_num += 4;
				let lSequanse_obj = this._createSmokeOrangeSpinSequanse(0.3141592653589793); //Utils.gradToRad(18)
				Sequence.start(lSmoke, lSequanse_obj.position)
				Sequence.start(lSmoke, lSequanse_obj.scale)
				Sequence.start(lSmoke, lSequanse_obj.rotation)
				Sequence.start(lSmoke, lSequanse_obj.alpha)
			}},
			{tweens: [],duration: 14 * FRAME_RATE, onfinish: () => {
				let lSmoke = this._fSpinOrangeSmoke_spt_arr[3] = lContainer_sprt.addChild(this._createSmoke("boss_mode/earth/smoke_orange", 0.67, 0.23));
				lSmoke.position.set(-128, -65);
				lSmoke.rotation = 0.41887902047863906; //Utils.gradToRad(24);

				this._fAnimationCount_num += 4;
				let lSequanse_obj = this._createSmokeOrangeSpinSequanse(1.9198621771937625); //Utils.gradToRad(110)
				Sequence.start(lSmoke, lSequanse_obj.position)
				Sequence.start(lSmoke, lSequanse_obj.scale)
				Sequence.start(lSmoke, lSequanse_obj.rotation)
				Sequence.start(lSmoke, lSequanse_obj.alpha)
			}},
			{tweens: [],duration: 5 * FRAME_RATE, onfinish: () => {
				let lSmoke = this._fSpinOrangeSmoke_spt_arr[4] = lContainer_sprt.addChild(this._createSmoke("boss_mode/earth/smoke_orange", 0.67, 0.23));
				lSmoke.position.set(-128, -65);
				lSmoke.rotation = 0.41887902047863906; //Utils.gradToRad(24);

				this._fAnimationCount_num += 4;
				let lSequanse_obj = this._createSmokeOrangeSpinSequanse(1.9198621771937625); //Utils.gradToRad(110)
				Sequence.start(lSmoke, lSequanse_obj.position)
				Sequence.start(lSmoke, lSequanse_obj.scale)
				Sequence.start(lSmoke, lSequanse_obj.rotation)
				Sequence.start(lSmoke, lSequanse_obj.alpha)
			}},
			{tweens: [],duration: 17 * FRAME_RATE, onfinish: () => {
				let lSmoke = this._fSpinOrangeSmoke_spt_arr[5] = lContainer_sprt.addChild(this._createSmoke("boss_mode/earth/smoke_orange", 0.67, 0.23));
				lSmoke.position.set(-128, -65);
				lSmoke.rotation = 0; //Utils.gradToRad(0);

				this._fAnimationCount_num += 4;
				let lSequanse_obj = this._createSmokeOrangeSpinSequanse(1.5009831567151233); //Utils.gradToRad(86)
				Sequence.start(lSmoke, lSequanse_obj.position)
				Sequence.start(lSmoke, lSequanse_obj.scale)
				Sequence.start(lSmoke, lSequanse_obj.rotation)
				Sequence.start(lSmoke, lSequanse_obj.alpha)
			}},
			{tweens: [],duration: 12 * FRAME_RATE, onfinish: () => {
				let lSmoke = this._fSpinOrangeSmoke_spt_arr[6] = lContainer_sprt.addChild(this._createSmoke("boss_mode/earth/smoke_orange", 0.67, 0.23));
				lSmoke.position.set(-128, -65);
				lSmoke.rotation = 0; //Utils.gradToRad(0);

				this._fAnimationCount_num += 4;
				let lSequanse_obj = this._createSmokeOrangeSpinSequanse(1.5009831567151233); //Utils.gradToRad(86)
				Sequence.start(lSmoke, lSequanse_obj.position)
				Sequence.start(lSmoke, lSequanse_obj.scale)
				Sequence.start(lSmoke, lSequanse_obj.rotation)
				Sequence.start(lSmoke, lSequanse_obj.alpha)
			}},
			{tweens: [],duration: 4 * FRAME_RATE, onfinish: () => {
				let lSmoke = this._fSpinOrangeSmoke_spt_arr[7] = lContainer_sprt.addChild(this._createSmoke("boss_mode/earth/smoke_orange", 0.67, 0.23));
				lSmoke.position.set(-128, -65);
				lSmoke.rotation = 0.41887902047863906; //Utils.gradToRad(24);

				this._fAnimationCount_num += 4;
				let lSequanse_obj = this._createSmokeOrangeSpinSequanse(1.5009831567151233); //Utils.gradToRad(86)
				Sequence.start(lSmoke, lSequanse_obj.position)
				Sequence.start(lSmoke, lSequanse_obj.scale)
				Sequence.start(lSmoke, lSequanse_obj.rotation)
				Sequence.start(lSmoke, lSequanse_obj.alpha)
			}},
			{tweens: [],duration: 5 * FRAME_RATE, onfinish: () => {
				let lSmoke = this._fSpinOrangeSmoke_spt_arr[8] = lContainer_sprt.addChild(this._createSmoke("boss_mode/earth/smoke_orange", 0.67, 0.23));
				lSmoke.position.set(-128, -65);
				lSmoke.rotation = 0.41887902047863906; //Utils.gradToRad(24);

				this._fAnimationCount_num += 4;
				let lSequanse_obj = this._createSmokeOrangeSpinSequanse(110);
				Sequence.start(lSmoke, lSequanse_obj.position)
				Sequence.start(lSmoke, lSequanse_obj.scale)
				Sequence.start(lSmoke, lSequanse_obj.rotation)
				Sequence.start(lSmoke, lSequanse_obj.alpha)
			}},
			{tweens: [],duration: 17 * FRAME_RATE, onfinish: () => {
				let lSmoke = this._fSpinOrangeSmoke_spt_arr[9] = lContainer_sprt.addChild(this._createSmoke("boss_mode/earth/smoke_orange", 0.67, 0.23));
				lSmoke.position.set(-128, -65);
				lSmoke.rotation = 0.41887902047863906; //Utils.gradToRad(24);

				this._fAnimationCount_num += 4;
				let lSequanse_obj = this._createSmokeOrangeSpinSequanse(1.5009831567151233); //Utils.gradToRad(86)
				Sequence.start(lSmoke, lSequanse_obj.position)
				Sequence.start(lSmoke, lSequanse_obj.scale)
				Sequence.start(lSmoke, lSequanse_obj.rotation)
				Sequence.start(lSmoke, lSequanse_obj.alpha)
			}},
			{tweens: [],duration: 12 * FRAME_RATE, onfinish: () => {
				let lSmoke = this._fSpinOrangeSmoke_spt_arr[10] = lContainer_sprt.addChild(this._createSmoke("boss_mode/earth/smoke_orange", 0.67, 0.23));
				lSmoke.position.set(-128, -65);
				lSmoke.rotation = 0; //Utils.gradToRad(0);

				this._fAnimationCount_num += 4;
				let lSequanse_obj = this._createSmokeOrangeSpinSequanse(1.5009831567151233); //Utils.gradToRad(86)
				Sequence.start(lSmoke, lSequanse_obj.position);
				Sequence.start(lSmoke, lSequanse_obj.scale);
				Sequence.start(lSmoke, lSequanse_obj.rotation);
				Sequence.start(lSmoke, lSequanse_obj.alpha);

				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			}},
		];

		this._fAnimationCount_num ++;
		Sequence.start(this, lTimerOrangeSmoke_seq);

		let lTimerSmoke_seq = [
			{tweens: [],duration: 0 * FRAME_RATE, onfinish: () => {
				let lSmoke = this._fSpinOrangeSmoke_spt_arr[11] = lContainer_sprt.addChild(this._createSmoke("boss_mode/earth/smoke_6", 1.13, 0));
				lSmoke.position.set(-239, -70);
				lSmoke.rotation = 0.41887902047863906; //Utils.gradToRad(24);

				this._fAnimationCount_num += 4;
				let lSequanse_obj = this._createSmokeSpinSequanse(3.9968039870670142,2.04); //Utils.gradToRad(229);
				Sequence.start(lSmoke, lSequanse_obj.position)
				Sequence.start(lSmoke, lSequanse_obj.scale)
				Sequence.start(lSmoke, lSequanse_obj.rotation)
				Sequence.start(lSmoke, lSequanse_obj.alpha)
			}},
			{tweens: [],duration: 12 * FRAME_RATE, onfinish: () => {
				let lSmoke = this._fSpinOrangeSmoke_spt_arr[12] = lContainer_sprt.addChild(this._createSmoke("boss_mode/earth/smoke_6", 1.13, 0));
				lSmoke.position.set(-239, -70);
				lSmoke.rotation = 1.9547687622336491; //Utils.gradToRad(112);

				this._fAnimationCount_num += 4;
				let lSequanse_obj = this._createSmokeSpinSequanse(5.707226654021458,1.64); //Utils.gradToRad(327);
				Sequence.start(lSmoke, lSequanse_obj.position)
				Sequence.start(lSmoke, lSequanse_obj.scale)
				Sequence.start(lSmoke, lSequanse_obj.rotation)
				Sequence.start(lSmoke, lSequanse_obj.alpha)
			}},
			{tweens: [],duration: 22 * FRAME_RATE, onfinish: () => {
				let lSmoke = this._fSpinOrangeSmoke_spt_arr[13] = lContainer_sprt.addChild(this._createSmoke("boss_mode/earth/smoke_6", 1.13, 0.23));
				lSmoke.position.set(-239, -70);
				lSmoke.rotation = 0.41887902047863906; //Utils.gradToRad(24);

				this._fAnimationCount_num += 4;
				let lSequanse_obj = this._createSmokeSpinSequanse(3.9968039870670142,1.98); //Utils.gradToRad(229);
				Sequence.start(lSmoke, lSequanse_obj.position)
				Sequence.start(lSmoke, lSequanse_obj.scale)
				Sequence.start(lSmoke, lSequanse_obj.rotation)
				Sequence.start(lSmoke, lSequanse_obj.alpha)
			}},
			{tweens: [],duration: 23 * FRAME_RATE, onfinish: () => {
				let lSmoke = this._fSpinOrangeSmoke_spt_arr[14] = lContainer_sprt.addChild(this._createSmoke("boss_mode/earth/smoke_6", 1.13, 0.23));
				lSmoke.position.set(-239, -70);
				lSmoke.rotation = 0.41887902047863906; //Utils.gradToRad(24);

				this._fAnimationCount_num += 4;
				let lSequanse_obj = this._createSmokeSpinSequanse(3.9968039870670142,2.07); //Utils.gradToRad(229);
				Sequence.start(lSmoke, lSequanse_obj.position)
				Sequence.start(lSmoke, lSequanse_obj.scale)
				Sequence.start(lSmoke, lSequanse_obj.rotation)
				Sequence.start(lSmoke, lSequanse_obj.alpha)
			}},
			{tweens: [],duration: 15 * FRAME_RATE, onfinish: () => {
				let lSmoke = this._fSpinOrangeSmoke_spt_arr[15] = lContainer_sprt.addChild(this._createSmoke("boss_mode/earth/smoke_6", 1.13, 0.23));
				lSmoke.position.set(-239, -70);
				lSmoke.rotation = 0.41887902047863906; //Utils.gradToRad(24);

				this._fAnimationCount_num += 4;
				let lSequanse_obj = this._createSmokeSpinSequanse(3.9968039870670142,1.98); //Utils.gradToRad(229);
				Sequence.start(lSmoke, lSequanse_obj.position)
				Sequence.start(lSmoke, lSequanse_obj.scale)
				Sequence.start(lSmoke, lSequanse_obj.rotation)
				Sequence.start(lSmoke, lSequanse_obj.alpha)
			}},
			{tweens: [],duration: 23 * FRAME_RATE, onfinish: () => {
				let lSmoke = this._fSpinOrangeSmoke_spt_arr[16] = lContainer_sprt.addChild(this._createSmoke("boss_mode/earth/smoke_6", 1.13, 0.23));
				lSmoke.position.set(-239, -70);
				lSmoke.rotation = 0.41887902047863906; //Utils.gradToRad(24);

				this._fAnimationCount_num += 4;
				let lSequanse_obj = this._createSmokeSpinSequanse(3.9968039870670142,2.07); //Utils.gradToRad(229);
				Sequence.start(lSmoke, lSequanse_obj.position);
				Sequence.start(lSmoke, lSequanse_obj.scale);
				Sequence.start(lSmoke, lSequanse_obj.rotation);
				Sequence.start(lSmoke, lSequanse_obj.alpha);

				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			}},
		];

		this._fAnimationCount_num ++;
		Sequence.start(this, lTimerSmoke_seq);
	}

	_createSmokeOrangeSpinSequanse( aRotation_num )
	{
		let lPosition_seq = [
			{tweens: [],duration: 1 * FRAME_RATE},
			{tweens: [ {prop: "position.x", to: 0}, {prop: "position.y", to: 0} ],duration: 21*FRAME_RATE},
			{tweens: [ {prop: "position.x", to: 200}, {prop: "position.y", to: -65} ],duration: 19*FRAME_RATE,
			onfinish: ()=>{
				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			}},
		]

		let lScale_seq = [
			{tweens: [],duration: 1 * FRAME_RATE},
			{tweens: [ {prop: "scale.x", to: 1.18}, {prop: "scale.y", to: 1.18} ],duration: 21*FRAME_RATE, ease:Easing.sine.easeIn},
			{tweens: [ {prop: "scale.x", to: 0.67}, {prop: "scale.y", to: 0.67} ],duration: 20*FRAME_RATE, ease:Easing.sine.easeOut,
			onfinish: ()=>{
				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			}},
		]

		let lRotation_seq = [
			{tweens: [],duration: 1 * FRAME_RATE},
			{tweens: [{prop: "rotation", to: aRotation_num}],duration: 41 * FRAME_RATE,
			onfinish: ()=>{
				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			}},
		]

		let lAlpha_seq = [
			{tweens: [],duration: 1 * FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.9}],duration: 21 * FRAME_RATE, ease:Easing.sine.easeIn},
			{tweens: [{prop: "alpha", to: 0}],duration: 20 * FRAME_RATE, ease:Easing.sine.easeOut,
			onfinish: ()=>{
				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			}},
		]
		
		return {
			position: lPosition_seq,
			scale: lScale_seq,
			rotation: lRotation_seq,
			alpha: lAlpha_seq,
		}
	}

	_createSmokeSpinSequanse( aRotation_num , aScale_num)
	{
		let lPosition_seq = [
			{tweens: [],duration: 1 * FRAME_RATE},
			{tweens: [ {prop: "position.x", to: 0}, {prop: "position.y", to: 0} ],duration: 21*FRAME_RATE},
			{tweens: [ {prop: "position.x", to: 249}, {prop: "position.y", to: -70} ],duration: 19*FRAME_RATE,
			onfinish: ()=>{
				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			}},
		]

		let lScale_seq = [
			{tweens: [],duration: 1 * FRAME_RATE},
			{tweens: [ {prop: "scale.x", to: aScale_num}, {prop: "scale.y", to: aScale_num} ],duration: 21*FRAME_RATE, ease:Easing.sine.easeIn},
			{tweens: [ {prop: "scale.x", to: 1.13}, {prop: "scale.y", to: 1.13} ],duration: 20*FRAME_RATE, ease:Easing.sine.easeOut,
			onfinish: ()=>{
				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			}},
		]

		let lRotation_seq = [
			{tweens: [],duration: 1 * FRAME_RATE},
			{tweens: [{prop: "rotation", to: aRotation_num}],duration: 58 * FRAME_RATE,
			onfinish: ()=>{
				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			}},
		]

		let lAlpha_seq = [
			{tweens: [],duration: 1 * FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.9}],duration: 30 * FRAME_RATE, ease:Easing.sine.easeIn},
			{tweens: [{prop: "alpha", to: 0}],duration: 28 * FRAME_RATE, ease:Easing.sine.easeOut,
			onfinish: ()=>{
				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			}},
		]
		
		return {
			position: lPosition_seq,
			scale: lScale_seq,
			rotation: lRotation_seq,
			alpha: lAlpha_seq,
		}
	}

	_startOpticalFlareAnimation()
	{
		let lFlareYellow_sprt = this._fOpticalFlare_spr = this._fOpticalFlareContainer_spr.addChild(this._createLight("boss_mode/common/optical_flare_yellow",1));
		lFlareYellow_sprt.scale.set(2.08, -2.08);
		lFlareYellow_sprt.alpha = 0;
		lFlareYellow_sprt.blendMode = PIXI.BLEND_MODES.ADD;

		let lAlpha_seq = [
			{tweens: [],duration: 29 * FRAME_RATE},
			{tweens: [ {prop: "alpha", to: Utils.getRandomWiggledValue(0.15, 0.1)} ],duration:9 * FRAME_RATE},
			{tweens: [ {prop: "alpha", to: Utils.getRandomWiggledValue(0.55, 0.1)} ],duration:2 * FRAME_RATE},
			{tweens: [ {prop: "alpha", to: Utils.getRandomWiggledValue(0.99, 0.1)} ],duration:2 * FRAME_RATE},
			{tweens: [ {prop: "alpha", to: Utils.getRandomWiggledValue(0.92, 0.1)} ],duration:19 * FRAME_RATE},
			{tweens: [ {prop: "alpha", to: Utils.getRandomWiggledValue(0.35, 0.1)} ],duration:8 * FRAME_RATE},
			{tweens: [ {prop: "alpha", to: Utils.getRandomWiggledValue(0.55, 0.1)} ],duration:41 * FRAME_RATE},
			{tweens: [ {prop: "alpha", to: Utils.getRandomWiggledValue(0.6, 0.1)} ],duration:13 * FRAME_RATE},
			{tweens: [ {prop: "alpha", to: Utils.getRandomWiggledValue(0, 0.1)} ],duration:54 * FRAME_RATE, onfinish: ()=>{
				lFlareYellow_sprt && lFlareYellow_sprt.destroy();
				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			}},
		];

		Sequence.start(lFlareYellow_sprt, lAlpha_seq);

		let lFlare_1_sprt = this._fOpticalFlare1_spr =this.addChild(this._createLight("boss_mode/common/gradient_orange",1));
		lFlare_1_sprt.scale.set(3.37, 2.32);
		lFlare_1_sprt.alpha = 0.17;
		lFlare_1_sprt.rotation = 1.5707963267948966; //Utils.gradToRad(90);
		lFlare_1_sprt.position.set(-391.4, -7); //-782.8 / 2, -7)

		let lFlare_2_sprt = this._fOpticalFlare2_spr = this.addChild(this._createLight("boss_mode/common/gradient_orange",1));
		lFlare_2_sprt.scale.set(3.37, -2.32);
		lFlare_2_sprt.alpha = 0.17;
		lFlare_2_sprt.rotation = 1.5707963267948966; //Utils.gradToRad(90);
		lFlare_2_sprt.position.set(389.75, -7); //779.5 / 2, -7

		let lAlphaFlare_seq = [
			{tweens: [],duration: 29 * FRAME_RATE},
			{tweens: [],duration:34 * FRAME_RATE},
			{tweens: [ {prop: "alpha", to: Utils.getRandomWiggledValue(0.9, 0.1)} ],duration:11 * FRAME_RATE},
			{tweens: [ {prop: "alpha", to: Utils.getRandomWiggledValue(0.55, 0.1)} ],duration:41 * FRAME_RATE},
			{tweens: [ {prop: "alpha", to: Utils.getRandomWiggledValue(0.6, 0.1)} ],duration:13 * FRAME_RATE},
			{tweens: [ {prop: "alpha", to: Utils.getRandomWiggledValue(0, 0.1)} ],duration:54 * FRAME_RATE, onfinish: ()=>{
				lFlare_2_sprt && Sequence.destroy(Sequence.findByTarget(lFlare_2_sprt));
				lFlare_1_sprt && Sequence.destroy(Sequence.findByTarget(lFlare_1_sprt));
				lFlare_2_sprt.destroy();
				lFlare_1_sprt.destroy();
				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			}},
		];

		this._fAnimationCount_num += 3;
		Sequence.start(lFlare_1_sprt, lAlphaFlare_seq);
		Sequence.start(lFlare_2_sprt, lAlphaFlare_seq);
		Sequence.start(lFlareYellow_sprt, lAlpha_seq);
	}

	_onAnimationCompletedSuspicison()
	{
		if (this._fAnimationCount_num == 0)
		{
			this._onAppearingCompleted();
			this._destroyAnimation();
		}
	}

	_destroyAnimation()
	{
		this._fShowBossTimer_t && this._fShowBossTimer_t.destructor();

		this._fBlackSolid_spr && Sequence.destroy(Sequence.findByTarget(this._fBlackSolid_spr));
		this._fBlackSolid_spr = null;

		this._fEarthCrackAnimation_eca && this._fEarthCrackAnimation_eca.destroy();
		this._fEarthCrackAnimation_eca = null;

		this._fDim_spr && Sequence.destroy(Sequence.findByTarget(this._fDim_spr));
		this._fDim_spr = null;

		this._fFXExplosionTrail_spr && Sequence.destroy(Sequence.findByTarget(this._fFXExplosionTrail_spr));
		this._fFXExplosionTrail_spr = null;

		this._fEarthSmallStoneRock1Animation_essra = null;

		this._fEarthSmokeJumpAnimation_esja && this._fEarthSmokeJumpAnimation_esja.destroy();
		this._fEarthSmokeJumpAnimation_esja = null;

		this._fStartRockGroundTimer_tmr && this._fStartRockGroundTimer_tmr.destructor();
		this._fStartRockGroundTimer_tmr = null;
		this._fRockGroundAnimation_ebsr && this._fRockGroundAnimation_ebsr.destroy();
		
		this._fRockGroundAnimation_ebsr = null;

		this._fRock11Animation_essra && this._fRock11Animation_essra.destroy();
		this._fRock11Animation_essra = null;

		this._fStoneExplosion2Animation_esea && this._fStoneExplosion2Animation_esea.destroy();
		this._fStoneExplosion2Animation_esea = null;

		this._fEarthSmallStoneRock2Animation_essra && this._fEarthSmallStoneRock2Animation_essra.destroy();
		this._fEarthSmallStoneRock2Animation_essra = null;

		this._fEarthSmokeTrailAnimation_esta && this._fEarthSmokeTrailAnimation_esta.destroy();
		this._fEarthSmokeTrailAnimation_esta = null;

		this._fStartMiniExplosionTimer1_tmr && this._fStartMiniExplosionTimer1_tmr.destructor();
		this._fStartMiniExplosionTimer1_tmr = null;
		this._fMiniExplosion3Container1_spr && this._fMiniExplosion3Container1_spr.destroy();
		this._fMiniExplosion3Container1_spr = null;
		this._fStartMiniExplosionTimer2_tmr && this._fStartMiniExplosionTimer2_tmr.destructor();
		this._fStartMiniExplosionTimer2_tmr = null;
		this._fMiniExplosion3Container2_spr && this._fMiniExplosion3Container2_spr.destroy();
		this._fMiniExplosion3Container2_spr = null;

		this._fEarthSmallStoneRock3Animation_essra && this._fEarthSmallStoneRock3Animation_essra.destroy();
		this._fEarthSmallStoneRock3Animation_essra = null;

		this._fCircleBlast1_spr = null;
		this._fCircleBlast2_spr = null;

		this._fCircleBlastContainer_spr && Sequence.destroy(Sequence.findByTarget(this._fCircleBlastContainer_spr));

		this._fStartEnergyBurstTimer_tmr && this._fStartEnergyBurstTimer_tmr.destructor();
		this._fStartEnergyBurstTimer_tmr = null;
		this._fEnergyBurst_spr = null;

		this._fLightCircle2One_spr && Sequence.destroy(Sequence.findByTarget(this._fLightCircle2One_spr));
		this._fLightCircle2One_spr = null;

		this._fLightParticleYellow_sprt && Sequence.destroy(Sequence.findByTarget(this._fLightParticleYellow_sprt));
		this._fLightParticleYellow_sprt = null;

		this._fLight5_spr && Sequence.destroy(Sequence.findByTarget(this._fLight5_spr));
		this._fLight5_spr = null;

		this._fLight2_spr && Sequence.destroy(Sequence.findByTarget(this._fLight2_spr));
		this._fLight2_spr = null;

		this._fLightCircle_sprt && Sequence.destroy(Sequence.findByTarget(this._fLightCircle_sprt));
		this._fLightCircle_sprt = null;

		this._fLightCircle2Two_spr && Sequence.destroy(Sequence.findByTarget(this._fLightCircle2Two_spr));
		this._fLightCircle2Two_spr = null;

		this._fStoneExplosionAnimation_esea && this._fStoneExplosionAnimation_esea.destroy();
		this._fStoneExplosionAnimation_esea = null;

		this._fStartSmokeExplosionTimer_tmr && this._fStartSmokeExplosionTimer_tmr.destructor();
		this._fStartSmokeExplosionTimer_tmr = null;
		this._fSmokeExplosion_spr = null;

		this._fStartTallExplosionTimer_tmr && this._fStartTallExplosionTimer_tmr.destructor();
		this._fStartTallExplosionTimer_tmr = null;
		this._fTallExplosion_spr = null;

		this._fSmokeSpin2_spr && Sequence.destroy(Sequence.findByTarget(this._fSmokeSpin2_spr));
		this._fSmokeSpin2_spr = null;

		for (let i = 0; i < this._fParticles_arr.length; i++)
		{
			this._fParticles_arr[i] && this._fParticles_arr[i].destroy();
		}
		this._fParticles_arr = [];
		
		this && Sequence.destroy(Sequence.findByTarget(this));

		for (let i = 0; i < this._fMiniExplosionMovAnimation_spr_arr.length; i++)
		{
			this._fMiniExplosionMovAnimation_spr_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fMiniExplosionMovAnimation_spr_arr[i]));
			this._fMiniExplosionMovAnimation_spr_arr[i] && this._fMiniExplosionMovAnimation_spr_arr[i].destroy();
		}
		this._fMiniExplosionMovAnimation_spr_arr = [];

		for (let i = 0; i < this._fMiniExplosionMovAnimationLightParticle_spr_arr.length; i++)
		{
			this._fMiniExplosionMovAnimationLightParticle_spr_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fMiniExplosionMovAnimationLightParticle_spr_arr[i]));
			this._fMiniExplosionMovAnimationLightParticle_spr_arr[i] && this._fMiniExplosionMovAnimationLightParticle_spr_arr[i].destroy();
		}
		this._fMiniExplosionMovAnimationLightParticle_spr_arr = [];
		
		for (let i = 0; i < this._fMiniExplosionSmokeOrange_spr_arr.length; i++)
		{
			this._fMiniExplosionSmokeOrange_spr_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fMiniExplosionSmokeOrange_spr_arr[i]));
			this._fMiniExplosionSmokeOrange_spr_arr[i] && this._fMiniExplosionSmokeOrange_spr_arr[i].destroy();
		}
		this._fMiniExplosionSmokeOrange_spr_arr = [];
		
		for (let i = 0; i < this._fMiniExplosionSmoke6_spr_arr.length; i++)
		{
			this._fMiniExplosionSmoke6_spr_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fMiniExplosionSmoke6_spr_arr[i]));
			this._fMiniExplosionSmoke6_spr_arr[i] && this._fMiniExplosionSmoke6_spr_arr[i].destroy();
		}
		this._fMiniExplosionSmoke6_spr_arr = [];

		for (let i = 0; i < this._fMiniExplosionSmokeOrange2_spr_arr.length; i++)
		{
			this._fMiniExplosionSmokeOrange2_spr_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fMiniExplosionSmokeOrange2_spr_arr[i]));
			this._fMiniExplosionSmokeOrange2_spr_arr[i] && this._fMiniExplosionSmokeOrange2_spr_arr[i].destroy();
		}
		this._fMiniExplosionSmokeOrange2_spr_arr = [];

		for (let i = 0; i < this._fSpinOrangeSmoke_spt_arr.length; i++)
		{
			this._fSpinOrangeSmoke_spt_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fSpinOrangeSmoke_spt_arr[i]));
			this._fSpinOrangeSmoke_spt_arr[i] && this._fSpinOrangeSmoke_spt_arr[i].destroy();
		}
		this._fSpinOrangeSmoke_spt_arr = [];

		this._fOpticalFlare_spr && Sequence.destroy(Sequence.findByTarget(this._fOpticalFlare_spr));
		this._fOpticalFlare_spr && this._fOpticalFlare_spr.destroy();
		this._fOpticalFlare_spr = null;	

		this._fOpticalFlare1_spr && Sequence.destroy(Sequence.findByTarget(this._fOpticalFlare1_spr));
		this._fOpticalFlare1_spr && this._fOpticalFlare1_spr.destroy();
		this._fOpticalFlare1_spr = null;

		this._fOpticalFlare2_spr && Sequence.destroy(Sequence.findByTarget(this._fOpticalFlare2_spr));
		this._fOpticalFlare2_spr && this._fOpticalFlare2_spr.destroy();
		this._fOpticalFlare2_spr = null;

		this._fTopFXContainer && this._fTopFXContainer.destroy();
		this._fBottomFXContainer && this._fBottomFXContainer.destroy();

		this._fTopFXContainer = null;
		this._fBottomFXContainer = null;
		this._fBlackSolidContainer_spr = null;
		this._fCrackContainer_spr = null;
		this._fDimAnimationContainer_spr = null;
		this._fFXExplosionTrailContainer_spr = null;
		this._fSmallStoneRocks1Container_spr  = null;
		this._fFastSmoke1Container_spr = null;
		this._fSmokeJumpsContainer_spr = null;
		this._fRocksGroundContainer_spr = null;
		this._fSmokeJumpOnceContainer_spr = null;
		this._fFastSmoke2Container_spr = null;
		this._fRock11Container_spr = null;
		this._fFastSmoke3Container_spr = null;
		this._fStoneExplosion2Container_spr = null;
		this._fFastSmoke4Container_spr = null;
		this._fSmallStoneRocks2Container_spr = null;
		this._fSmokeTrailContainer_spr = null;
		this._fMiniExplosion3Container_spr = null;
		this._fSmallStoneRocks3Container_spr = null;
		this._fCircleBlastContainer_spr = null;
		this._fEnergyBurstContainer_spr = null;
		this._fLightCircle2OneContainer_spr = null;
		this._fParticlesYellowContainer_spr = null;
		this._fLight5Container_spr = null;
		this._fLight2Container_spr = null;
		this._fLightCircleContainer_spr = null;
		this._fLightCircle2TwoContainer_spr = null;
		this._fStoneExplosionContainer_spr = null;
		this._fSmokeExplosionContainer_spr = null;
		this._fTallExplosionContainer_spr = null;
		this._fSmokeSpin2Container_spr = null;
		this._fOpticalFlareContainer_spr = null;
	}

	destroy()
	{
		super.destroy();
		this._destroyAnimation();
	}
}

export default EarthAppearanceView;	