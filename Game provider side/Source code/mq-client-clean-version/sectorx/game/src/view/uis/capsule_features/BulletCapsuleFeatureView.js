import SimpleUIView from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/SimpleUIView';
import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import * as Easing from '../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../shared/src/CommonConstants';
import { Utils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import BigBullet from './BigBullet';
import AtlasConfig from './../../../config/AtlasConfig';
import MTimeLine from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/timeLine/MTimeLine';
import { AtlasSprite } from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import Timer from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';

function _createEnergyBurstTextures()
{
	return AtlasSprite.getFrames(APP.library.getAsset("death/energy_burst"), AtlasConfig.EnergyBurst, "");
}

class BulletCapsuleFeatureView extends SimpleUIView
{
	static get EVENT_ON_TARGET_HIT()		{ return "onTargetHit"; }
	static get EVENT_ON_BIG_BULLET_FLY_SFX()	{ return "onBigBulletFlySound"; }
	static get EVENT_ON_ALL_ANIMATIONS_COMPLETED()	{ return "EVENT_ON_ALL_ANIMATIONS_COMPLETED"; }

	startFieldAnimation()
	{
		this._startFieldAnimation();
	}

	startAnimation(aStartPostion_obj, aHits_obj_arr)
	{
		this._startAnimation(aStartPostion_obj, aHits_obj_arr);
	}

	interrupt()
	{
		this._interrupt();
	}

	addToContainerIfRequired(aAwardingContainerInfo_obj)
	{
		this._addToContainerIfRequired(aAwardingContainerInfo_obj);
	}

	get isAnimationPlaying()
	{
		if (this._fIsFieldAnimationPlaying_bl || this._fBulletAnimationCount_num)
		{
			return true;
		}

		return false;
	}

	constructor()
	{
		super();

		this._fBlueCover_spr = null;
		this._fWhiteCover_g = null;

		this._fBigBullets_spr_arr = [];
		
		this._fTimeline_arr_mtl = [];
		this._fHitAnimationContainer_arr_sprt = [];
		this._fSparksAnimation_arr_sprt = [];
		this._fIsFieldAnimationPlaying_bl = null;
		this._fBulletAnimationCount_num = null;
	}

	get bulletCapsuleFieldAnimationInfo()
	{
		return APP.gameScreen.gameFieldController.bulletCapsuleFieldAnimationInfo;
	}

	__init()
	{
		super.__init();
	}

	_startAnimation(aStartPostion_obj, aHits_obj_arr)
	{
		this._startBulletAnimation(aStartPostion_obj, aHits_obj_arr);
	}

	_startBulletAnimation(aStartPostion_obj = { x: 0, y: 0 }, aHits_obj_arr)
	{
		this._fBulletAnimationCount_num = 0;

		if (aHits_obj_arr && aHits_obj_arr.length > 0)
		{
			this._fBulletAnimationCount_num++;
			let lBullet_bb = this.addChild(new BigBullet());
			this._fBigBullets_spr_arr.push(lBullet_bb);
			lBullet_bb.position = aStartPostion_obj;
			lBullet_bb.position.y -= 100;
			const BULLET_UPPER_START_POSITION = lBullet_bb.position.y - 170; 

			const lBulletAnimations_obj_arr = [
				{
					tweens: [{ prop: 'position.y', to: BULLET_UPPER_START_POSITION }], duration: 11 * FRAME_RATE, ease: Easing.quartic.easeIn
				}
			];

			for (let i = 0; i < aHits_obj_arr.length; i++)
			{
				let lHit_obj = aHits_obj_arr[i];
				const lEnemyPosition_obj = APP.currentWindow.gameFieldController.getEnemyPosition(lHit_obj.enemy.id);
				const lPrevEnemyPosition_obj = i == 0 ? // is previous enemy doesn't exist, flying to capsule
												{x: lBullet_bb.position.x, y: BULLET_UPPER_START_POSITION} :
												APP.currentWindow.gameFieldController.getEnemyPosition(aHits_obj_arr[i-1].enemy.id);
				const lRatationSeq_obj = {
					tweens: [{ prop: 'rotation', to: this._getAngleBetweenPoints(this.globalToLocal(lPrevEnemyPosition_obj), this.globalToLocal(lEnemyPosition_obj))}], 
					duration: 2 * FRAME_RATE,
					onfinish: this.emit.bind(this, BulletCapsuleFeatureView.EVENT_ON_BIG_BULLET_FLY_SFX)
				};
				lBulletAnimations_obj_arr.push(lRatationSeq_obj);
				lBulletAnimations_obj_arr.push(
					{
						tweens: [{ prop: 'position.x', to: lEnemyPosition_obj.x }, { prop: 'position.y', to: lEnemyPosition_obj.y }], 
						duration: 11 * FRAME_RATE, 
						ease: Easing.exponential.easeIn, 
						onfinish: () =>
						{
							lBullet_bb.startHitAnimation();
							APP.gameScreen.gameFieldController.shakeTheGround();
							this._startFieldFlashAnimation();
							this.emit(BulletCapsuleFeatureView.EVENT_ON_TARGET_HIT, { hitInfo: lHit_obj });
							this._startHitAmimation(lEnemyPosition_obj);
						}
					}
				);
			}

			Sequence.start(lBullet_bb, lBulletAnimations_obj_arr).once(Sequence.EVENT_ON_SEQUENCE_PLAYING_COMPLETED, this._tryToFinishAnimation.bind(this, lBullet_bb));
		}
	}

	_getAngleBetweenPoints(aA_obj, aB_obj)
	{
		try
		{
			aA_obj.y *= -1;
			aB_obj.y *= -1;
			return Utils.getAngle(aA_obj, aB_obj);
		}
		catch (e)
		{
			APP.logger.i_pushError(`BulletCapsuleFeatureView. Can't find angle between enemies for big bullet feature: ${aA_spr}, ${aB_spr}`);
			console.error("Can't find angle between enemies for big bullet feature", aA_spr, aB_spr);
			return 0;
		}
	}

	_startEnergyBurstAnimation(aTexture_obj ,aPos_obj, aOptScale_num = 1, lContainer = this )
	{
		let lParticle_sprt = lContainer.addChild(new Sprite());
		lParticle_sprt.textures = aTexture_obj;
		lParticle_sprt.scale.set(aOptScale_num);
		lParticle_sprt.position.set(aPos_obj.x, aPos_obj.y);
		lParticle_sprt.blendMode = PIXI.BLEND_MODES.ADD;
		lParticle_sprt.anchor.set(0.5,0.5);
		lParticle_sprt.animationSpeed = 0.5; //30/60;
		lParticle_sprt.on('animationend', () => {
			lParticle_sprt && lParticle_sprt.destroy();
			lParticle_sprt = null;
		});

		lParticle_sprt.play();
		return lParticle_sprt;
	}

	_setMask(aMask)
	{
		aMask.mask && aMask.mask.destroy();

		aMask.mask = aMask.addChild(APP.library.getSprite("enemies/bullet_capsule/mask"));
	}

	_startHitAmimation(aEnemyPosition_obj)
	{
		let lHitAnimationContainer_sprt = this.addChild(new Sprite());
		lHitAnimationContainer_sprt.position = aEnemyPosition_obj;

		let lTimeline_mtl = new MTimeLine();

		// ORB...
		let lDeathOrb_sprt = lHitAnimationContainer_sprt.addChild(APP.library.getSprite("death/death_orb"));
		lDeathOrb_sprt.scale.set(0.5);
		lDeathOrb_sprt.anchor.set(0.5,0.5);

		lTimeline_mtl.addAnimation(
			lDeathOrb_sprt,
			MTimeLine.SET_SCALE_X,
			0.5,
			[
				[1, 20]
			]
		);
		lTimeline_mtl.addAnimation(
			lDeathOrb_sprt,
			MTimeLine.SET_SCALE_Y,
			0.5,
			[
				[1, 20]
			]
		);
		lTimeline_mtl.addAnimation(
			lDeathOrb_sprt,
			MTimeLine.SET_ALPHA,
			1,
			[
				5,
				[0, 13]
			]
		);
		// ...ORB

		// FLARE...
		let lFlare_sprt = lHitAnimationContainer_sprt.addChild(APP.library.getSprite("death/flare"));
		lFlare_sprt.blendMode = PIXI.BLEND_MODES.ADD;
		lFlare_sprt.scale.set(0);
		lFlare_sprt.anchor.set(0.5,0.5);

		lTimeline_mtl.addAnimation(
			lFlare_sprt,
			MTimeLine.SET_SCALE_X,
			0,
			[
				3,
				[1, 2],
				[0.63, 2],
				[0, 2]
			]
		);
		lTimeline_mtl.addAnimation(
			lFlare_sprt,
			MTimeLine.SET_SCALE_Y,
			0,
			[
				3,
				[1, 2],
				[1.25, 2],
				[0, 2]
			]
		);
		// ...FLARE
		
		// SMOKE CIRCLE...
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			let lCircleSmoke_sprt = lHitAnimationContainer_sprt.addChild(APP.library.getSprite("death/smoke_circle"));
			lCircleSmoke_sprt.blendMode = PIXI.BLEND_MODES.ADD;
			lCircleSmoke_sprt.anchor.set(0.5,0.5);

			lTimeline_mtl.addAnimation(
				lCircleSmoke_sprt,
				MTimeLine.SET_SCALE_X,
				1,
				[
					[2.5, 10]
				]
			);
			lTimeline_mtl.addAnimation(
				lCircleSmoke_sprt,
				MTimeLine.SET_SCALE_Y,
				1,
				[
					[2.5, 10]
				]
			);
			lTimeline_mtl.addAnimation(
				lCircleSmoke_sprt,
				MTimeLine.SET_ALPHA,
				1,
				[
					7,
					[0, 3]
				]
			);
		}
		// ...SMOKE CIRCLE

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			let lSparkles_sprt = lHitAnimationContainer_sprt.addChild(APP.library.getSprite("death/killer_capsule_enemy_death_sparkles"));
			lSparkles_sprt.blendMode = PIXI.BLEND_MODES.ADD;
			lSparkles_sprt.anchor.set(0.5,0.5);

			lTimeline_mtl.addAnimation(
				lSparkles_sprt,
				MTimeLine.SET_SCALE_X,
				0.45, //0.15*3
				[
					[1.89, 3], //[0.63*3, 3],
					[2.73, 12] //[0.91*3, 12]
				]
			);
			lTimeline_mtl.addAnimation(
				lSparkles_sprt,
				MTimeLine.SET_SCALE_Y,
				0.15,
				[
					[1.89, 3], //[0.63*3, 3],
					[2.73, 12] //[0.91*3, 12]
				]
			);

			let lMask_g = lSparkles_sprt.addChild(new PIXI.Graphics());
			lMask_g.clear().lineStyle(60, 0xFFFFFF, 2).arc(0, 0, 45, -Math.PI, Math.PI);
			lSparkles_sprt.mask = lMask_g;

			lTimeline_mtl.addAnimation(
				lMask_g,
				MTimeLine.SET_SCALE_X,
				0,
				[
					[4, 11]
				]
			);
			lTimeline_mtl.addAnimation(
				lMask_g,
				MTimeLine.SET_SCALE_Y,
				0,
				[
					[4, 11]
				]
			);

			this._startEnergyBurstAnimation(_createEnergyBurstTextures(), {x: 0, y: 0}, 1, lHitAnimationContainer_sprt);
		}
		lTimeline_mtl.callFunctionOnFinish(this._destroyContainer, this);

		lTimeline_mtl.play();

		this._fTimeline_arr_mtl.push(lTimeline_mtl);
		this._fHitAnimationContainer_arr_sprt.push(lHitAnimationContainer_sprt);

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startSparkAnimation();
		}
	}

	_destroyContainer()
	{
		for (let i = 0; i < this._fHitAnimationContainer_arr_sprt.length; i++) {
			if(this._fTimeline_arr_mtl[i].isPlaying()) continue;
			
			this._fHitAnimationContainer_arr_sprt[i] && this._fHitAnimationContainer_arr_sprt[i].destroy();
		}
	}

	_startSparkAnimation()
	{
		this._startSingeSparkAnimation(-298)
		this._startSingeSparkAnimation(-348)
		this._startSingeSparkAnimation(-49)
		this._startSingeSparkAnimation(-98)
		this._startSingeSparkAnimation(-248)
		this._startSingeSparkAnimation(-208)
		this._startSingeSparkAnimation(-148)
		this._startSingeSparkAnimation(-268)
		this._startSingeSparkAnimation(-318)
		this._startSingeSparkAnimation(-19)
		this._startSingeSparkAnimation(-68)
		this._startSingeSparkAnimation(-218)
		this._startSingeSparkAnimation(-178)
		this._startSingeSparkAnimation(-68)
		this._startSingeSparkAnimation(-118)
	}

	_startSingeSparkAnimation(aRotation_num)
	{
		let lSpark_sprt = this._fHitAnimationContainer_arr_sprt[this._fHitAnimationContainer_arr_sprt.length-1].addChild(APP.library.getSprite("enemies/bullet_capsule/spark"));
		this._fSparksAnimation_arr_sprt.push(lSpark_sprt);
		lSpark_sprt.anchor.set(0,1);
		lSpark_sprt.scale.set(0);
		lSpark_sprt.rotation = aRotation_num + 68;

		let lSacle_seq =
		[
			{ tweens: [{ prop: "scale.x", to: 1.04 }, { prop: "scale.y", to: 1.04 }], duration: 1 * FRAME_RATE },
			{ tweens: [], duration: 9 * FRAME_RATE },
			{ tweens: [{ prop: "scale.x", to: 0 }, { prop: "scale.y", to: 0 }], duration: 1 * FRAME_RATE },
		];
		
		let lPosition_seq =
		[
			{ tweens: [], duration: 1 * FRAME_RATE },
			{ tweens: [{ prop: "position.x", to: 65 * Math.sin(aRotation_num) }, { prop: "position.y", to: -70 * Math.cos(aRotation_num) }], duration: 1 * FRAME_RATE },
			{ tweens: [{ prop: "position.x", to: 106 * Math.sin(aRotation_num) }, { prop: "position.y", to: -116 * Math.cos(aRotation_num) }], duration: 1 * FRAME_RATE },
			{ tweens: [{ prop: "position.x", to: 138 * Math.sin(aRotation_num) }, { prop: "position.y", to: -151 * Math.cos(aRotation_num) }], duration: 1 * FRAME_RATE },
			{ tweens: [{ prop: "position.x", to: 185 * Math.sin(aRotation_num) }, { prop: "position.y", to: -205 * Math.cos(aRotation_num) }], duration: 1 * FRAME_RATE },
			{ tweens: [{ prop: "position.x", to: 216 * Math.sin(aRotation_num) }, { prop: "position.y", to: -239 * Math.cos(aRotation_num) }], duration: 1 * FRAME_RATE },
			{ tweens: [{ prop: "position.x", to: 458 * Math.sin(aRotation_num) }, { prop: "position.y", to: -476 * Math.cos(aRotation_num) }], duration: 5 * FRAME_RATE ,
			onfinish: ()=>{
				Sequence.destroy(Sequence.findByTarget(lSpark_sprt));
				let lIndex_int = this._fSparksAnimation_arr_sprt.indexOf(lSpark_sprt);
				if (~lIndex_int)
				{
					this._fSparksAnimation_arr_sprt.splice(lIndex_int, 1);
				}
			}}
		];
		
		Sequence.start(lSpark_sprt, lSacle_seq);
		Sequence.start(lSpark_sprt, lPosition_seq);
	}

	_tryToFinishAnimation(aBullet_bb)
	{
		Sequence.destroy(Sequence.findByTarget(aBullet_bb));
		aBullet_bb.destroy();
		aBullet_bb = null;

		this._fBulletAnimationCount_num--;
		this._allAnimationCompleteSuspicion();
	}

	_addToContainerIfRequired(aAwardingContainerInfo_obj)
	{
		if (this.parent)
		{
			return;
		}

		aAwardingContainerInfo_obj.container.addChild(this);
		this.zIndex = aAwardingContainerInfo_obj.zIndex;
	}

	_startFieldAnimation()
	{
		this._fIsFieldAnimationPlaying_bl = true;
		this._fBlueCover_spr = this.bulletCapsuleFieldAnimationInfo.container.addChild(APP.library.getSprite('enemies/bullet_capsule/blue_cover'));
		this._fBlueCover_spr.zIndex = this.bulletCapsuleFieldAnimationInfo.zIndex;
		this._fBlueCover_spr.scale.set(2);
		this._fBlueCover_spr.position.set(480, 270); //960 / 2, 540 / 2
		this._fBlueCover_spr.alpha = 0;
		let lBlueCoverAlphaSeq_arr = [
			{ tweens: [{ prop: "alpha", to: 0.35 }], duration: 11 * FRAME_RATE },
			{ tweens: [{ prop: "alpha", to: 0.1 }], duration: 47 * FRAME_RATE },
			{
				tweens: [{ prop: "alpha", to: 0 }], duration: 32 * FRAME_RATE, onfinish: () =>
				{
					this._fBlueCover_spr && Sequence.destroy(Sequence.findByTarget(this._fBlueCover_spr));
					APP.gameScreen.gameFieldController.bulletCapsuleFieldAnimationInfo.container && APP.gameScreen.gameFieldController.bulletCapsuleFieldAnimationInfo.container.removeChild(this._fBlueCover_spr);
					this._fBlueCover_spr = null;
					this._fIsFieldAnimationPlaying_bl = false;
					this._allAnimationCompleteSuspicion();
				}
			}
		];
		Sequence.start(this._fBlueCover_spr, lBlueCoverAlphaSeq_arr);
	}

	_startFieldFlashAnimation()
	{
		if (this._fWhiteCover_g)
		{
			Sequence.destroy(Sequence.findByTarget(this._fWhiteCover_g));
			this._fWhiteCover_g.destroy();
			this._fWhiteCover_g = null;
		}
		this._fWhiteCover_g = this.bulletCapsuleFieldAnimationInfo.container.addChild(new PIXI.Graphics());
		this._fWhiteCover_g.beginFill(0xffffff).drawRect(0, 0, 960, 540).endFill();
		this._fWhiteCover_g.zIndex = this.bulletCapsuleFieldAnimationInfo.zIndex;
		this._fWhiteCover_g.alpha = 0.35;

		let lWhiteCoverAlphaSeq_arr = [
			{
				tweens: [{ prop: "alpha", to: 0 }], duration: 16 * FRAME_RATE, onfinish: () =>
				{
					Sequence.destroy(Sequence.findByTarget(this._fWhiteCover_g));
					this._fWhiteCover_g.destroy();
					this._fWhiteCover_g = null;
				}
			}
		];
		Sequence.start(this._fWhiteCover_g, lWhiteCoverAlphaSeq_arr);
	}

	_allAnimationCompleteSuspicion()
	{
 		if (!this._fIsFieldAnimationPlaying_bl && this._fBulletAnimationCount_num <= 0)
		{
			this.emit(BulletCapsuleFeatureView.EVENT_ON_ALL_ANIMATIONS_COMPLETED);
		}
	}

	_interrupt()
	{
		for (let lBullet_spr of this._fBigBullets_spr_arr)
		{
			this._tryToFinishAnimation(lBullet_spr);
		}

		if (this._fWhiteCover_g)
		{
			Sequence.destroy(Sequence.findByTarget(this._fWhiteCover_g));
			this._fWhiteCover_g.destroy();
			this._fWhiteCover_g = null;
		}
		
		if (this._fHitAnimationContainer_arr_sprt && Array.isArray(this._fHitAnimationContainer_arr_sprt))
		{
			for (let i = 0; i < this._fHitAnimationContainer_arr_sprt.length; i++)
			{
				this._fHitAnimationContainer_arr_sprt[i] && Sequence.destroy(Sequence.findByTarget(this._fHitAnimationContainer_arr_sprt[i]));		
				this._fHitAnimationContainer_arr_sprt[i] && this._fHitAnimationContainer_arr_sprt[i].destroy();
				this._fHitAnimationContainer_arr_sprt[i] = null;
			}
		}		
		this._fHitAnimationContainer_arr_sprt = [];

		if (this._fSparksAnimation_arr_sprt && Array.isArray(this._fSparksAnimation_arr_sprt))
		{
			for (let i = 0; i < this._fSparksAnimation_arr_sprt.length; i++)
			{
				this._fSparksAnimation_arr_sprt[i] && Sequence.destroy(Sequence.findByTarget(this._fSparksAnimation_arr_sprt[i]));		
				this._fSparksAnimation_arr_sprt[i] && this._fSparksAnimation_arr_sprt[i].destroy();
				this._fSparksAnimation_arr_sprt[i] = null;
			}
		}		
		this._fSparksAnimation_arr_sprt = [];

		if (this._fTimeline_arr_mtl && Array.isArray(this._fTimeline_arr_mtl))
		{
			for (let i = 0; i < this._fTimeline_arr_mtl.length; i++)
			{
				this._fTimeline_arr_mtl[i] && this._fTimeline_arr_mtl[i].destroy();
				this._fTimeline_arr_mtl[i] = null;
			}
		}		
		this._fTimeline_arr_mtl = [];

		this._fBlueCover_spr && Sequence.destroy(Sequence.findByTarget(this._fBlueCover_spr));
		APP.gameScreen.gameFieldController.bulletCapsuleFieldAnimationInfo.container && APP.gameScreen.gameFieldController.bulletCapsuleFieldAnimationInfo.container.removeChild(this._fBlueCover_spr);
		this._fBlueCover_spr = null;
	}

	destroy()
	{
		this._interrupt();

		this._fBigBullets_spr_arr = null;
		this._fBlueCover_spr = null;
		this._fWhiteCover_g = null;

		super.destroy();
	}
}

export default BulletCapsuleFeatureView;