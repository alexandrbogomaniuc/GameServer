import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import AtlasSprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import AtlasConfig from '../../../../config/AtlasConfig';
import * as Easing from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import Timer from "../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer";
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE, ENEMY_TYPES } from '../../../../../../shared/src/CommonConstants';
import { Sequence } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import { ENEMY_DIRECTION } from '../../../../config/Constants';
import { Utils } from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';

let _hit_extra_electric_textures = null;
function _generateHitExtraElectricTextures()
{
	if (_hit_extra_electric_textures) return

	_hit_extra_electric_textures = AtlasSprite.getFrames(
		[
			APP.library.getAsset("enemies/lightning_capsule/hit/extra_enemy_electric")
		],
		[
			AtlasConfig.LightningCapsuleExtraEnemyElectric
		],
		"");
}

const HALF_PI = Math.PI / 2;
const PI_DIVIDED_18 = Math.PI / 18;

class LightningCapsuleEnemyHitAnimation extends Sprite
{
	static get EVENT_ON_ANIMATION_ENDED()				{return "onAnimationEnded";}
	static get EVENT_ON_PREPARE_TO_COMPLETE()			{return "onPreapareToComplete";}
	static get EVENT_ON_ENEMY_HIT_NEEDED()				{return "onAnimationStarted";}
	
	

	i_startAnimation()
	{
		this._startAnimation();
	}

	constructor(aCapsuleEnemyId_num, aEnemyPosition_obj, aDirection_str, aTypeEnemy_e, aEnemyId_num)
	{
		super();

		_generateHitExtraElectricTextures();

		this._fCapsuleEnemyId_num = aCapsuleEnemyId_num;
		this._fEnemyDirection_str = aDirection_str;
		this._fTypeEnemy_num = aTypeEnemy_e;
		this._fEnemyPosition_obj = aEnemyPosition_obj;
		this._fEnemyId_num = aEnemyId_num;


		this._fCircleContainer_spr = this.addChild(new Sprite());
		this._fCircleInner_spr = null;
		this._fCircleOuter_spr = null;

		this._fExtraElectricAnimation_spr = null;

		this._fSplat_spr = null;
		this._fFirstSpark_spr = null;
		this._fSecondSpark_spr = null;

		this._fSplatAnimationPlaying_bln = null;
		this._fSparkFirstAnimationPlaying_bln = null;
		this._fSparkSecondAnimationPlaying_bln = null;
	}

	_getScaleEnemy()
	{
		let lScale_num = 1;

		switch(this._fTypeEnemy_num)
		{
			case ENEMY_TYPES.SMALL_FLYER: 
				lScale_num = 0.3; 
				break;
			case ENEMY_TYPES.YELLOW_ALIEN:
				lScale_num = 0.8; 
				break;
			case ENEMY_TYPES.JUMPER_BLUE:
			case ENEMY_TYPES.JUMPER_GREEN:
			case ENEMY_TYPES.JUMPER_WHITE:
				lScale_num = 0.55; 
				break;
			case ENEMY_TYPES.GREEN_HOPPER:
				lScale_num = 0.75; 
				break;
			case ENEMY_TYPES.JELLYFISH:	 
				lScale_num = 0.45; 
				break;
			case ENEMY_TYPES.FLYER:	
				lScale_num = 0.65; 
				break;
			case ENEMY_TYPES.EYE_FLAER_GREEN:
			case ENEMY_TYPES.EYE_FLAER_PERPLE:
			case ENEMY_TYPES.EYE_FLAER_RED:	
			case ENEMY_TYPES.EYE_FLAER_YELLOW:
				lScale_num = 0.3; 
				break;
			case ENEMY_TYPES.CRAWLER:
				lScale_num = 0.9; 
				break;
			case ENEMY_TYPES.BIORAPTOR:
				lScale_num = 0.7;
				break;
			case ENEMY_TYPES.MOTHI_BLUE:
			case ENEMY_TYPES.MOTHI_RED:	
			case ENEMY_TYPES.MOTHI_WHITE:
			case ENEMY_TYPES.MOTHI_YELLOW:
				lScale_num = 0.6; 
				break;
			case ENEMY_TYPES.TREX:
				lScale_num = 1; 
				break;
			case ENEMY_TYPES.FROGGY: 
				lScale_num = 0.8; 
				break;
			case ENEMY_TYPES.MFLYER: 
				lScale_num = 0.65; 
				break;
			case ENEMY_TYPES.RED_HEAD_FLYER:
				lScale_num = 0.7; 
				break;
			case ENEMY_TYPES.ROCKY:
				lScale_num = 1.2; 
				break;
			case ENEMY_TYPES.POINTY:
				lScale_num = 1.1; 
				break;
			case ENEMY_TYPES.SPIKY:
				lScale_num = 0.9; 
				break;
			case ENEMY_TYPES.KRANG:
				lScale_num = 1; 
				break;
			case ENEMY_TYPES.KANG:
				lScale_num = 0.6; 
				break;
			case ENEMY_TYPES.ONE_EYE:
				lScale_num = 0.7; 
				break;
			case ENEMY_TYPES.PINK_FLYER:
				lScale_num = 0.5; 
				break;
			case ENEMY_TYPES.FLYER_MUTALISK:
				lScale_num = 0.5; 
				break;
			case ENEMY_TYPES.SLUG:
				lScale_num = 0.55; 
				break;
			case ENEMY_TYPES.GIANT_TREX:
				lScale_num = 1.5; 
				break;
			case ENEMY_TYPES.GIANT_PINK_FLYER:
				lScale_num = 0.75; 
				break;
				
			default:
				lScale_num = 1; 
				break;
		}

		return lScale_num;
	}

	_getScaleAndOffsetExtraElectric()
	{
		let lScale_num = 0.5;
		let lOffsetY_num = 0;

		switch(this._fTypeEnemy_num)
		{
			case ENEMY_TYPES.SMALL_FLYER: 
				lScale_num = 0.35;  break;
			case ENEMY_TYPES.YELLOW_ALIEN:
				lScale_num = 0.65;   lOffsetY_num = -20; break;
			case ENEMY_TYPES.JUMPER_BLUE:
			case ENEMY_TYPES.JUMPER_GREEN:
			case ENEMY_TYPES.JUMPER_WHITE:
				lScale_num = 0.45; lOffsetY_num = -30; break;
			case ENEMY_TYPES.GREEN_HOPPER:
				lScale_num = 0.5; lOffsetY_num = -50; break;
			case ENEMY_TYPES.JELLYFISH:
				lScale_num = 0.5; lOffsetY_num = 20; break;
			case ENEMY_TYPES.FLYER:
				lScale_num = 0.5;  break;
			case ENEMY_TYPES.EYE_FLAER_GREEN:
			case ENEMY_TYPES.EYE_FLAER_PERPLE:
			case ENEMY_TYPES.EYE_FLAER_RED:
			case ENEMY_TYPES.EYE_FLAER_YELLOW:
				lScale_num = 0.35; lOffsetY_num = 10;  break;
			case ENEMY_TYPES.CRAWLER:
				lScale_num = 0.55;  lOffsetY_num = -10; break;
			case ENEMY_TYPES.BIORAPTOR:
				lScale_num = 0.5; lOffsetY_num = 10;  break;
			case ENEMY_TYPES.MOTHI_BLUE:
			case ENEMY_TYPES.MOTHI_RED:	
			case ENEMY_TYPES.MOTHI_WHITE:
			case ENEMY_TYPES.MOTHI_YELLOW:
				lScale_num = 0.475; lOffsetY_num = 10;  break;
			case ENEMY_TYPES.TREX:
				lScale_num = 0.65;  lOffsetY_num = -25;  break;
			case ENEMY_TYPES.FROGGY:
				lScale_num = 0.575;   lOffsetY_num = -5; break;
			case ENEMY_TYPES.MFLYER:
				lScale_num = 0.5;   break;
			case ENEMY_TYPES.RED_HEAD_FLYER:
				lScale_num = 0.5; lOffsetY_num = 5;  break;
			case ENEMY_TYPES.ROCKY:
				lScale_num = 0.725;  lOffsetY_num = -80;  break;
			case ENEMY_TYPES.POINTY:
				lScale_num = 0.675;  lOffsetY_num = -60;  break;
			case ENEMY_TYPES.SPIKY:
				lScale_num = 0.55; lOffsetY_num = -25;  break;
			case ENEMY_TYPES.KRANG:
				lScale_num = 0.55;  lOffsetY_num = -20;  break;
			case ENEMY_TYPES.KANG:
				lScale_num = 0.5;  lOffsetY_num = -25;  break;
			case ENEMY_TYPES.ONE_EYE:
				lScale_num = 0.45;  lOffsetY_num = -30;  break;
			case ENEMY_TYPES.PINK_FLYER:
				lScale_num = 0.45;  break;
			case ENEMY_TYPES.FLYER_MUTALISK:
				lScale_num = 0.4; lOffsetY_num = -15;  break;
			case ENEMY_TYPES.SLUG:
				lScale_num = 0.5; lOffsetY_num = -5;  break;
			case ENEMY_TYPES.GIANT_TREX:
				lScale_num = 0.65;  lOffsetY_num = -25;  break;
			case ENEMY_TYPES.GIANT_PINK_FLYER:
				lScale_num = 0.45;  break;

			default:
				break;
		}

		return {scale: lScale_num, offsetY: lOffsetY_num };
	}

	_getSplatTypeAndRotation()
	{
		let lSplatType_str = "c";
		let lRotation_num = 0;

		switch(this._fTypeEnemy_num)
		{
			case ENEMY_TYPES.JELLYFISH:	
			case ENEMY_TYPES.BIORAPTOR:	
			case ENEMY_TYPES.TREX: 
			case ENEMY_TYPES.MFLYER: 
			case ENEMY_TYPES.SLUG: 
				if (this._fEnemyDirection_str == ENEMY_DIRECTION.RIGHT_DOWN || this._fEnemyDirection_str == ENEMY_DIRECTION.LEFT_UP)
				{
					lRotation_num = HALF_PI;
				};
				lSplatType_str = "a"; break;

			case ENEMY_TYPES.SMALL_FLYER: 
			case ENEMY_TYPES.YELLOW_ALIEN:
			case ENEMY_TYPES.GREEN_HOPPER:
			case ENEMY_TYPES.EYE_FLAER_GREEN: 
			case ENEMY_TYPES.EYE_FLAER_PERPLE:
			case ENEMY_TYPES.EYE_FLAER_RED:
			case ENEMY_TYPES.EYE_FLAER_YELLOW: 
			case ENEMY_TYPES.CRAWLER:
			case ENEMY_TYPES.FROGGY:
			case ENEMY_TYPES.RED_HEAD_FLYER: 
			case ENEMY_TYPES.ROCKY: 
			case ENEMY_TYPES.POINTY: 
			case ENEMY_TYPES.SPIKY: 
			case ENEMY_TYPES.KRANG:
			case ENEMY_TYPES.ONE_EYE:
				lSplatType_str = "b"; break;

			case ENEMY_TYPES.JUMPER_BLUE:
			case ENEMY_TYPES.JUMPER_GREEN:
			case ENEMY_TYPES.JUMPER_WHITE:
			case ENEMY_TYPES.FLYER:
			case ENEMY_TYPES.MOTHI_BLUE:
			case ENEMY_TYPES.MOTHI_RED:
			case ENEMY_TYPES.MOTHI_WHITE:
			case ENEMY_TYPES.MOTHI_YELLOW:
			case ENEMY_TYPES.KANG:
			case ENEMY_TYPES.PINK_FLYER:
			case ENEMY_TYPES.FLYER_MUTALISK:
				lSplatType_str = "c"; break;

			default:
				lSplatType_str = "c"; 
				break;
		}

		return {splatType: lSplatType_str, splatRotation: lRotation_num};
	}

	_startAnimation()
	{
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._fCircleInner_spr = this._fCircleContainer_spr.addChild(APP.library.getSprite('enemies/lightning_capsule/hit/lightning_capsule_enemy_hit_circle_inner'));
		}
		
		this._fCircleOuter_spr = this._fCircleContainer_spr.addChild(APP.library.getSprite('enemies/lightning_capsule/hit/lightning_capsule_enemy_hit_circle_outer'));
		this._fCircleContainer_spr.scale.set(1, 0.7);
		this._fCircleContainer_spr.position.y = 90;

		if (this._fEnemyDirection_str == ENEMY_DIRECTION.LEFT_DOWN || this._fEnemyDirection_str == ENEMY_DIRECTION.RIGHT_UP)
		{
			this._fCircleContainer_spr.rotation = PI_DIVIDED_18; //PI_DIVIDED_18  Math.PI/18
		}
		else
		{
			this._fCircleContainer_spr.rotation = - PI_DIVIDED_18;
		}

		this._fAnimationCount_num = 0;
		
		this._startCircleInnerAnimation();
		
		this._startCircleOuterAnimation();
		this._startExtraElectricAnimation();
	}

	get lightningCapsuleHitAnimationInfo()
	{
		return APP.gameScreen.gameFieldController.lightningCapsuleHitAnimationInfo;
	}


	_startExtraElectricAnimation()
	{
		let param = this._getScaleAndOffsetExtraElectric();
		let lExtraElectric_a = this._fExtraElectricAnimation_spr = this.lightningCapsuleHitAnimationInfo.container.addChild(new Sprite());		
		lExtraElectric_a.textures = _hit_extra_electric_textures;
		lExtraElectric_a.zIndex = APP.gameScreen.gameFieldController.lightningCapsuleHitAnimationInfo.zIndex;
		lExtraElectric_a.animationSpeed = 0.2; //12/60
		lExtraElectric_a.position.y = this._fEnemyPosition_obj.y + param.offsetY;
		lExtraElectric_a.position.x = this._fEnemyPosition_obj.x;
		lExtraElectric_a.scale.set(param.scale, 0.5);
		lExtraElectric_a.loop = true;
		lExtraElectric_a.play();
	}

	_startCircleInnerAnimation()
	{
		if (!APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			return;
		}

		this._fCircleInner_spr.scale.set(0.375, 0.375);
		this._fCircleInner_spr.alpha = 1;
		this._fCircleInner_spr.blendMode = PIXI.BLEND_MODES.ADD;

		let l_seq = [
			{tweens: [{prop: 'scale.x', to: 0.784}, {prop: 'scale.y', to: 0.784}], duration: 3 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 0.893}, {prop: 'scale.y', to: 0.893}, {prop: 'alpha', to: 0.25}], duration: 2 * FRAME_RATE}, 
			{tweens: [], duration: 1 * FRAME_RATE,
				onfinish: ()=>{
					this._fCircleInner_spr.alpha = 0;
			}}
		]

		Sequence.start(this._fCircleInner_spr, l_seq);
	}

	_startCircleOuterAnimation()
	{
		this._fCircleOuter_spr.scale.set(0.759, 0.759);
		this._fCircleOuter_spr.alpha = 0;
		this._fCircleOuter_spr.blendMode = PIXI.BLEND_MODES.ADD;

		let l_seq = [
			{tweens: [], duration: 2 * FRAME_RATE},	
			{tweens: [{prop: 'alpha', to: 1}], duration: 0 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 0.893}, {prop: 'scale.y', to: 0.893}], duration: 5 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0}], duration: 5 * FRAME_RATE},
			{tweens: [], duration: 7 * FRAME_RATE,
				onfinish: ()=>{
					this._onCircleOuterAnimationCompleted();
			}}
		]

		Sequence.start(this._fCircleOuter_spr, l_seq);
	}

	_onCircleOuterAnimationCompleted()
	{
		this._fAnimationCount_num++;

		if (this._fAnimationCount_num > 3)
		{
			this._fCircleInner_spr && Sequence.destroy(Sequence.findByTarget(this._fCircleInner_spr));
			this._fCircleOuter_spr && Sequence.destroy(Sequence.findByTarget(this._fCircleOuter_spr));

			this._fExtraElectricAnimation_spr && this._fExtraElectricAnimation_spr.destroy();

			this._startSplatAnimation();
			this._startSparkAnimation();
		}
		else
		{
			if (this._fAnimationCount_num > 2)
			{
				this.emit(LightningCapsuleEnemyHitAnimation.EVENT_ON_ENEMY_HIT_NEEDED, {enemyId : this._fEnemyId_num, capsuleId : this._fCapsuleEnemyId_num});
			}

			this._startCircleInnerAnimation();
			this._startCircleOuterAnimation();
		}
	}

	_startSplatAnimation()
	{
		let lTypeAndRotation_obj = this._getSplatTypeAndRotation();
		let lSplat_spr = this._fSplat_spr = this.addChild(APP.library.getSprite('enemies/lightning_capsule/hit/splat/lightning_splat_'+lTypeAndRotation_obj.splatType));
		
		let lScale_num = this._getScaleEnemy();
		lSplat_spr.scale.set(0.8 * lScale_num);
		lSplat_spr.alpha = 0.9;
		lSplat_spr.position.y = 90;
		lSplat_spr.rotation = lTypeAndRotation_obj.splatRotation;

		if (this._fEnemyDirection_str == ENEMY_DIRECTION.LEFT_DOWN || this._fEnemyDirection_str == ENEMY_DIRECTION.RIGHT_UP)
		{
			lSplat_spr.rotation = PI_DIVIDED_18;
		}
		else
		{
			lSplat_spr.rotation = - PI_DIVIDED_18;
		}

		let l_seq = [
			{tweens: [], duration: 6 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 2 * lScale_num}, {prop: 'scale.y', to: 2 * lScale_num}], duration: 1 * FRAME_RATE,
			onfinish: ()=>{
				this.emit(LightningCapsuleEnemyHitAnimation.EVENT_ON_PREPARE_TO_COMPLETE, {enemyId : this._fEnemyId_num, typeId: this._fTypeEnemy_num, capsuleId : this._fCapsuleEnemyId_num});
			}},
			{tweens: [{prop: 'alpha', to: 0}], duration: 26 * FRAME_RATE,
				onfinish: ()=>{
					this._fSplatAnimationPlaying_bln = false;
					this._onHitAnimationCompletedSuspicion();
			}}
		];

		this._fSplatAnimationPlaying_bln = true;

		Sequence.start(lSplat_spr, l_seq);
	}

	_startSparkAnimation()
	{
		let lRandomValue_num = Utils.random(0, 2);
		let lFirstSparkName_str = "0";
		let lSecondSparkName_str = "1";

		if (lRandomValue_num == 0)
		{
			lFirstSparkName_str = "0";
			lSecondSparkName_str = "1";
		}
		else if (lRandomValue_num == 1)
		{
			lFirstSparkName_str = "0";
			lSecondSparkName_str = "2";
		}
		else
		{
			lFirstSparkName_str = "1";
			lSecondSparkName_str = "2";
		}

		let lScale_num = this._getScaleEnemy();

		let lFirstSpark_spr = this._fFirstSpark_spr = this.addChild(APP.library.getSprite('enemies/lightning_capsule/hit/sparks/lightning_spark_'+lFirstSparkName_str));
		lFirstSpark_spr.scale.set(0.18 * lScale_num);
		lFirstSpark_spr.alpha = 1;
		lFirstSpark_spr.position.y = 90;
		lFirstSpark_spr.blendMode = PIXI.BLEND_MODES.ADD;

		let lSecondSpark_spr = this._fSecondSpark_spr = this.addChild(APP.library.getSprite('enemies/lightning_capsule/hit/sparks/lightning_spark_'+lSecondSparkName_str));
		lSecondSpark_spr.scale.set(0.18 * lScale_num);
		lSecondSpark_spr.alpha = 1;
		lSecondSpark_spr.position.y = 90;
		lSecondSpark_spr.blendMode = PIXI.BLEND_MODES.ADD;

		let lFirst_seq = [
			{tweens: [], duration: 6 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 1.05 * lScale_num}, {prop: 'scale.y', to: 1.05 * lScale_num}], duration: 5 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 1.2 * lScale_num}, {prop: 'scale.y', to: 1.2 * lScale_num}, {prop: 'alpha', to: 0.2}], duration: 3 * FRAME_RATE,			
				onfinish: ()=>{
					this._fSparkFirstAnimationPlaying_bln = false;
					this._onHitAnimationCompletedSuspicion();
			}}
		];

		let lSecond_seq = [
			{tweens: [], duration: 6 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 1.05 * lScale_num}, {prop: 'scale.y', to: 1.05 * lScale_num}], duration: 5 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 1.2 * lScale_num}, {prop: 'scale.y', to: 1.2 * lScale_num}, {prop: 'alpha', to: 0.2}], duration: 3 * FRAME_RATE,			
				onfinish: ()=>{
					this._fSparkSecondAnimationPlaying_bln = false;
					this._onHitAnimationCompletedSuspicion();
			}}
		];

		this._fSparkFirstAnimationPlaying_bln = true;
		this._fSparkSecondAnimationPlaying_bln = true;

		Sequence.start(lFirstSpark_spr, lFirst_seq);
		Sequence.start(lSecondSpark_spr, lSecond_seq);
	}

	_onHitAnimationCompletedSuspicion()
	{
		if (!this._fSplatAnimationPlaying_bln
			|| !this._fSparkFirstAnimationPlaying_bln
			|| !this._fSparkSecondAnimationPlaying_bln)
			{
				this._fSplat_spr && Sequence.destroy(Sequence.findByTarget(this._fSplat_spr));
				this._fFirstSpark_spr && Sequence.destroy(Sequence.findByTarget(this._fFirstSpark_spr));
				this._fSecondSpark_spr && Sequence.destroy(Sequence.findByTarget(this._fSecondSpark_spr));

				this._fSplat_spr && this._fSplat_spr.destroy();
				this._fFirstSpark_spr && this._fFirstSpark_spr.destroy();
				this._fSecondSpark_spr && this._fSecondSpark_spr.destroy();

				this.emit(LightningCapsuleEnemyHitAnimation.EVENT_ON_ANIMATION_ENDED, {capsuleId : this._fCapsuleEnemyId_num, typeId: this._fTypeEnemy_num,});
			}
	}


	_interrupt()
	{
		this._fCircleInner_spr && Sequence.destroy(Sequence.findByTarget(this._fCircleInner_spr));
		this._fCircleOuter_spr && Sequence.destroy(Sequence.findByTarget(this._fCircleOuter_spr));
		this._fCircleInner_spr && this._fCircleInner_spr.destroy();
		this._fCircleOuter_spr && this._fCircleOuter_spr.destroy();
		this._fCircleInner_spr = null;
		this._fCircleOuter_spr = null;

		this._fExtraElectricAnimation_spr && this._fExtraElectricAnimation_spr.destroy();
		this._fExtraElectricAnimation_spr = null;

		this._fSplat_spr && Sequence.destroy(Sequence.findByTarget(this._fSplat_spr));
		this._fFirstSpark_spr && Sequence.destroy(Sequence.findByTarget(this._fFirstSpark_spr));
		this._fSecondSpark_spr && Sequence.destroy(Sequence.findByTarget(this._fSecondSpark_spr));
		this._fSplat_spr && this._fSplat_spr.destroy();
		this._fFirstSpark_spr && this._fFirstSpark_spr.destroy();
		this._fSecondSpark_spr && this._fSecondSpark_spr.destroy();
		this._fSplat_spr = null;
		this._fFirstSpark_spr = null;
		this._fSecondSpark_spr = null;
	}


	destroy()
	{
		this._interrupt();

		super.destroy();
	}
}

export default LightningCapsuleEnemyHitAnimation;