import SimpleUIView from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/SimpleUIView';
import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../shared/src/CommonConstants';
import { Utils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import AtlasConfig from './../../../config/AtlasConfig';
import { AtlasSprite } from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import Timer from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import LightningCapsuleEnemyHitAnimation from '../../../main/animation/death/lightning_capsule/LightningCapsuleEnemyHitAnimation';
import { ENEMY_DIRECTION } from '../../../config/Constants';


let _hit_enemy_lightning_textures = null;
function _generateHitEnemyLightningTextures()
{
	if (_hit_enemy_lightning_textures) return

	_hit_enemy_lightning_textures = AtlasSprite.getFrames(
		[
			APP.library.getAsset("enemies/lightning_capsule/hit/enemy_lightning/enemy_lightning_0"),
			APP.library.getAsset("enemies/lightning_capsule/hit/enemy_lightning/enemy_lightning_1"),
		],
		[
			AtlasConfig.LightningCapsuleEnemyLightning1,
			AtlasConfig.LightningCapsuleEnemyLightning2,
		],
		"");
}

const ENEMY_LIGHTNING_WIDTH = 316; //632 / 2
const HALF_PI = Math.PI / 2;

class LightningCapsuleFeatureView extends SimpleUIView
{
	static get EVENT_ON_TARGET_HIT() 				{ return "onTargetHit"; }
	static get EVENT_ON_HIT_ANIMATION_COMPLETED() 	{ return "onTargetHitAnimationCompleted"; }
	static get EVENT_ON_LIGHTNING_SFX() 			{ return "onLightningSound"; }
	static get EVENT_ON_TARGET_NOT_FOUND() 			{ return "onTargetNotFound"; }

	startAnimation(aStartPostion_obj, aCapsuleEnemyId_num)
	{
		this._startAnimation(aStartPostion_obj, aCapsuleEnemyId_num);
	}

	interrupt()
	{
		this._interrupt();
	}

	addToContainerIfRequired(aAwardingContainerInfo_obj)
	{
		this._addToContainerIfRequired(aAwardingContainerInfo_obj);
	}

	constructor()
	{
		super();

		_generateHitEnemyLightningTextures();

		this._fHitLightningAnimations_spr_arr = [];
		this._fBossHitLightningAnimations_spr_arr = [];
		this._fGlowIndigo_spr_arr = [];
		this._fBossGlowIndigo_spr_arr = [];
		this._fEnemiesAnimationCount_num = [];
		this._fHitEnemyAnimations_spr_arr = [];
		this._fBossHitEnemyAnimations_spr_arr = [];
		this._fHitObj_arr = [];
		this._fTimerTryToFinish_tmr_arr = [];

	}

	get lightningCapsuleHitAnimationInfo()
	{
		return APP.gameScreen.gameFieldController.lightningCapsuleHitAnimationInfo;
	}

	__init()
	{
		super.__init();
	}

	_startAnimation(aStartPostion_obj, aCapsuleEnemyId_num)
	{
		this._startEnemyHitAnimation(aStartPostion_obj, aCapsuleEnemyId_num);
		this.emit(LightningCapsuleFeatureView.EVENT_ON_LIGHTNING_SFX);
	}

	_startEnemyHitAnimation(aStartPostion_obj = { x: 0, y: 0 }, aCapsuleEnemyId_num)
	{
		this._fEnemiesAnimationCount_num[aCapsuleEnemyId_num] = 0;

		let lHits_obj_arr = APP.gameScreen.gameFieldController.delayedLightningExplosionHits[aCapsuleEnemyId_num];
		const lTargets_obj_arr = lHits_obj_arr && lHits_obj_arr.slice();
		if (lTargets_obj_arr && lTargets_obj_arr.length > 0)
		{
			lTargets_obj_arr && lTargets_obj_arr.forEach((aHit_obj, index) =>
			{
				const lEnemy_e = APP.currentWindow.gameFieldController.getExistEnemy(aHit_obj.enemy.id);
				let lEnemyPosition_obj = { x: 0, y: 0 };
				if (lEnemy_e)
				{
					lEnemyPosition_obj = lEnemy_e.getCenterPosition();
				}

				let lHitEnemy_e = APP.currentWindow.gameFieldController.getExistEnemy(aHit_obj.enemy.id);
				let lDirection_str = ENEMY_DIRECTION.RIGHT_DOWN;
				let lTypeEnemy_e = null;

				if (lHitEnemy_e)
				{
					lTypeEnemy_e = lHitEnemy_e.typeId;

					if (lHitEnemy_e.angle)
					{
						if (lHitEnemy_e.angle >= 0)
						{
							if (lHitEnemy_e.angle > HALF_PI)
							{
								lDirection_str = ENEMY_DIRECTION.RIGHT_UP;
							}
						}
						else
						{
							if (lHitEnemy_e.angle < (- HALF_PI))
							{
								lDirection_str = ENEMY_DIRECTION.LEFT_UP;
							}
							else
							{
								lDirection_str = ENEMY_DIRECTION.LEFT_DOWN;
							}
						}
					}
				}

				this._fEnemiesAnimationCount_num[aCapsuleEnemyId_num]++;
				this._enemyHitAnimation(aStartPostion_obj, lEnemyPosition_obj, aHit_obj, aCapsuleEnemyId_num, lDirection_str, lTypeEnemy_e);
			});
			
		}
		else
		{
			this._fTimerTryToFinish_tmr_arr[aCapsuleEnemyId_num] = new Timer(() => this._tryToFinishAnimation(aCapsuleEnemyId_num), 100 * FRAME_RATE);
	}
	}

	_getAngleBetweenSprites(aA_obj, aB_obj)
	{
		try
		{
			let aAPos_obj = { x: aA_obj.x, y: aA_obj.y * -1 };
			let aBPos_obj = { x: aB_obj.x, y: aB_obj.y * -1 };

			return Utils.getAngle(aAPos_obj, aBPos_obj);
		}
		catch (e)
		{
			APP.logger.i_pushError(`LightningCapsuleFeatureView. Can't find angle between enemies for lightning bullet feature: ${aA_spr}, ${aB_spr}`)
			console.error("Can't find angle between enemies for lightning bullet feature", aA_obj, aB_obj);
			return 0;
		}
	}

	_determStartLightningPosition(aStartPostion_obj, aEnemyPosition_obj)
	{
		let distanceX = Math.abs(aStartPostion_obj.x - aEnemyPosition_obj.x);
		let distanceY = Math.abs(aStartPostion_obj.y - aEnemyPosition_obj.y);		
		let distance = Math.sqrt(distanceX*distanceX + distanceY*distanceY);

		let lNewStartPosition_obj = {};
		Object.assign(lNewStartPosition_obj, {x: aStartPostion_obj.x, y: aStartPostion_obj.y});
		lNewStartPosition_obj.y -= 150;

		let newDistance_num = distance > 90 ? Utils.random(30, 90): parseInt(distance / 3);

		let distRatio = newDistance_num / distance;
		let newX = lNewStartPosition_obj.x - (lNewStartPosition_obj.x - aEnemyPosition_obj.x) * (distRatio);
		let newY = lNewStartPosition_obj.y - (lNewStartPosition_obj.y - aEnemyPosition_obj.y) * (distRatio);

		return {x: newX, y: newY};
	}

	_enemyHitAnimation(aStartPostion_obj, aEnemyPosition_obj, aHit_obj, aCapsuleEnemyId_num, lDirection_str, lTypeEnemy_e)
	{
		console.log("_enemyHitAnimation="+aEnemyPosition_obj.x+" "+aEnemyPosition_obj.y+" "+lDirection_str + " aHit_obj.enemy.typeId = " + aHit_obj.enemy.typeId);
		

		let lNewStartPosition_obj = this._determStartLightningPosition(aStartPostion_obj, aEnemyPosition_obj);

		let lHitEnemyAnimation_lceha = this.lightningCapsuleHitAnimationInfo.container.addChild(new LightningCapsuleEnemyHitAnimation(aCapsuleEnemyId_num, aEnemyPosition_obj, lDirection_str, lTypeEnemy_e, aHit_obj.enemyId));
		lHitEnemyAnimation_lceha.zIndex = APP.gameScreen.gameFieldController.lightningCapsuleHitAnimationInfo.zIndex;
		lHitEnemyAnimation_lceha.position.set(-14, -56);
		lHitEnemyAnimation_lceha.once(LightningCapsuleEnemyHitAnimation.EVENT_ON_PREPARE_TO_COMPLETE, this._onLightningCapsuleEnemyHitAnimationPrepareToComplete, this);
		lHitEnemyAnimation_lceha.once(LightningCapsuleEnemyHitAnimation.EVENT_ON_ENEMY_HIT_NEEDED, this._onLightningCapsuleEnemyHitNeeded, this);
		lHitEnemyAnimation_lceha.once(LightningCapsuleEnemyHitAnimation.EVENT_ON_ANIMATION_ENDED, this._onLightningCapsuleEnemyHitAnimationCompleted, this);
		lHitEnemyAnimation_lceha.position = aEnemyPosition_obj;
		lHitEnemyAnimation_lceha.scale.set(0.37);

		let lLightning_spr = this._getlightningCapsuleHitAnimationSprite(lNewStartPosition_obj, aEnemyPosition_obj);
		lLightning_spr.play();

		if(aHit_obj.enemy.typeId === 100)
		{
			this._fBossHitLightningAnimations_spr_arr[aCapsuleEnemyId_num] = lLightning_spr;
			this._fBossHitEnemyAnimations_spr_arr[aCapsuleEnemyId_num] = lHitEnemyAnimation_lceha;
		}
		else
		{
			this._fHitLightningAnimations_spr_arr[aHit_obj.enemyId] = lLightning_spr;
			this._fHitEnemyAnimations_spr_arr[aHit_obj.enemyId] = lHitEnemyAnimation_lceha;
		}
		
		this._fHitObj_arr[aHit_obj.enemyId] = aHit_obj;

		let lGlowIndigo_spr = this.lightningCapsuleHitAnimationInfo.container.addChild(APP.library.getSprite('enemies/lightning_capsule/death/lightning_glow_indigo'));
		lGlowIndigo_spr.zIndex = APP.gameScreen.gameFieldController.lightningCapsuleHitAnimationInfo.zIndex;
		lGlowIndigo_spr.position = lNewStartPosition_obj;
		lGlowIndigo_spr.scale.set(0.7);
		lGlowIndigo_spr.blendMode = PIXI.BLEND_MODES.ADD;

		if(aHit_obj.enemy.typeId === 100)
		{
			this._fBossGlowIndigo_spr_arr[aCapsuleEnemyId_num] = lGlowIndigo_spr;
		}
		else
		{
			this._fGlowIndigo_spr_arr[aHit_obj.enemyId] = lGlowIndigo_spr;
		}

		let lEnemy_obj = APP.currentWindow.gameFieldController.getExistEnemy(aHit_obj.enemyId);
		if(!lEnemy_obj)
		{
			lLightning_spr.destroy();
			this._fBossHitLightningAnimations_spr_arr[aCapsuleEnemyId_num].destroy();
			this._fBossHitLightningAnimations_spr_arr[aCapsuleEnemyId_num] = null;

			this._fBossGlowIndigo_spr_arr[aCapsuleEnemyId_num].destroy();
			this._fBossGlowIndigo_spr_arr[aCapsuleEnemyId_num] = null;
			
			new Timer(() => lHitEnemyAnimation_lceha.destroy(), 33 * FRAME_RATE); ;
		}
		else
		{
			lHitEnemyAnimation_lceha.i_startAnimation();
		}
	}

	_onLightningCapsuleEnemyHitAnimationPrepareToComplete(e)
	{
		if (!e.enemyId)
		{
			return;
		}

		let lId_num = e.enemyId;
		let lCapsuleId = e.capsuleId;

		if(e.typeId === 100)
		{
			this._fBossHitLightningAnimations_spr_arr[lCapsuleId] && this._fBossHitLightningAnimations_spr_arr[lCapsuleId].destroy();
			this._fBossHitLightningAnimations_spr_arr[lCapsuleId] = null;

			this._fBossGlowIndigo_spr_arr[lCapsuleId] && this._fBossGlowIndigo_spr_arr[lCapsuleId].destroy();
			this._fBossGlowIndigo_spr_arr[lCapsuleId] = null;
		}
		else
		{
			this._fHitLightningAnimations_spr_arr[lId_num] && this._fHitLightningAnimations_spr_arr[lId_num].destroy();
			this._fHitLightningAnimations_spr_arr[lId_num] = null;

			this._fGlowIndigo_spr_arr[lId_num] && this._fGlowIndigo_spr_arr[lId_num].destroy();
			this._fGlowIndigo_spr_arr[lId_num] = null;
		}
	}

	_onLightningCapsuleEnemyHitNeeded(aEvent_obj)
	{
		if (!aEvent_obj.enemyId)
		{
			return;
		}

		let lEnemy_obj = APP.currentWindow.gameFieldController.getExistEnemy(aEvent_obj.enemyId);
		if(!lEnemy_obj)
		{
			this.emit(LightningCapsuleFeatureView.EVENT_ON_TARGET_NOT_FOUND, { hitInfo : this._fHitObj_arr[aEvent_obj.enemyId]});
			return;
		}
	
		this.emit(LightningCapsuleFeatureView.EVENT_ON_TARGET_HIT, { hitInfo: this._fHitObj_arr[aEvent_obj.enemyId]});
	}

	_getlightningCapsuleHitAnimationSprite(aStartPostion_obj, aEnemyPosition_obj)
	{
		let distanceX = Math.abs(aStartPostion_obj.x - aEnemyPosition_obj.x);
		let distanceY = Math.abs(aStartPostion_obj.y - aEnemyPosition_obj.y);
		let distance = Math.sqrt(distanceX*distanceX + distanceY*distanceY);

		let lEnemyLeft_bl = aStartPostion_obj.x > aEnemyPosition_obj.x;

		let lHitExpl_spr = this.lightningCapsuleHitAnimationInfo.container.addChild(new Sprite());
		lHitExpl_spr.zIndex = APP.gameScreen.gameFieldController.lightningCapsuleHitAnimationInfo.zIndex;
		lHitExpl_spr.position = aStartPostion_obj;
		lHitExpl_spr.textures = _hit_enemy_lightning_textures;
		lHitExpl_spr.animationSpeed = 0.5; //30 / 60;
		lHitExpl_spr.loop = true;
		
		let scaleRatio = distance / ENEMY_LIGHTNING_WIDTH;
		let scaleRatioY = scaleRatio < 1 ? Math.sqrt(scaleRatio): 1;

		lHitExpl_spr.pivot.set(163, 10); //380 /2 - 27

		if (lEnemyLeft_bl)
		{
			lHitExpl_spr.scale.set(scaleRatio, scaleRatioY);	
			lHitExpl_spr.rotation = (HALF_PI + this._getAngleBetweenSprites(aStartPostion_obj, aEnemyPosition_obj));
		}
		else
		{
			lHitExpl_spr.scale.set(-scaleRatio, scaleRatioY);
			lHitExpl_spr.rotation = (3*HALF_PI + this._getAngleBetweenSprites(aStartPostion_obj, aEnemyPosition_obj));
		}

		return lHitExpl_spr;
	}

	_onLightningCapsuleEnemyHitAnimationCompleted(aEvent_obj)
	{
		if (aEvent_obj.typeId === 100)
		{
			const lIndex_int = this._fBossHitEnemyAnimations_spr_arr.indexOf(aEvent_obj.target);
			if (~lIndex_int)
			{
				this._fBossHitEnemyAnimations_spr_arr[lIndex_int].destroy();
				this._fBossHitEnemyAnimations_spr_arr.splice(lIndex_int, 1);
			}
		}
		else
		{
			const lIndex_int = this._fHitEnemyAnimations_spr_arr.indexOf(aEvent_obj.target);
			if (~lIndex_int)
			{
				this._fHitEnemyAnimations_spr_arr[lIndex_int].destroy();
				this._fHitEnemyAnimations_spr_arr.splice(lIndex_int, 1);
			}
		}

		let lCapsuleEnemyId_num = aEvent_obj.capsuleId;
		if (!lCapsuleEnemyId_num)
		{
			return;
		}

		this._fEnemiesAnimationCount_num[lCapsuleEnemyId_num]--;
		if (this._fEnemiesAnimationCount_num[lCapsuleEnemyId_num] <= 0)
		{	
			this._tryToFinishAnimation(lCapsuleEnemyId_num);
		}
	}

	_tryToFinishAnimation(aCapsuleEnemyId_num)
	{
		this._fTimerTryToFinish_tmr_arr[aCapsuleEnemyId_num] && this._fTimerTryToFinish_tmr_arr[aCapsuleEnemyId_num].destructor();
		this._fTimerTryToFinish_tmr_arr[aCapsuleEnemyId_num] = null;

		this.emit(LightningCapsuleFeatureView.EVENT_ON_HIT_ANIMATION_COMPLETED, { capsuleId: aCapsuleEnemyId_num });
		
		let lAllTimersDestroyed = true;
		this._fTimerTryToFinish_tmr_arr && this._fTimerTryToFinish_tmr_arr.forEach(a_tmr => {
			if (a_tmr)
			{
				lAllTimersDestroyed = false;
			}
		});

		if (this._fBossHitLightningAnimations_spr_arr.length == 0 && this._fHitLightningAnimations_spr_arr.length == 0 && lAllTimersDestroyed)
		{
			this._interrupt();
		}
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

	_interrupt()
	{
		this._fTimerTryToFinish_tmr_arr && this._fTimerTryToFinish_tmr_arr.forEach(a_tmr => {a_tmr && a_tmr.destructor() });
		this._fTimerTryToFinish_tmr_arr = [];

		this._fHitLightningAnimations_spr_arr && this._fHitLightningAnimations_spr_arr.forEach(a_spr => {a_spr && a_spr.destroy() });
		this._fHitLightningAnimations_spr_arr = [];

		this._fGlowIndigo_spr_arr && this._fGlowIndigo_spr_arr.forEach(a_spr => {a_spr && a_spr.destroy() });
		this._fGlowIndigo_spr_arr = [];

		this._fHitEnemyAnimations_spr_arr && this._fHitEnemyAnimations_spr_arr.forEach(a_spr => {a_spr && a_spr.destroy() });
		this._fHitEnemyAnimations_spr_arr = [];

		this._fBossHitLightningAnimations_spr_arr && this._fBossHitLightningAnimations_spr_arr.forEach(a_spr => {a_spr && a_spr.destroy() });
		this._fBossHitLightningAnimations_spr_arr = [];

		this._fBossGlowIndigo_spr_arr && this._fBossGlowIndigo_spr_arr.forEach(a_spr => {a_spr && a_spr.destroy() });
		this._fBossGlowIndigo_spr_arr = [];

		this._fBossHitEnemyAnimations_spr_arr && this._fBossHitEnemyAnimations_spr_arr.forEach(a_spr => {a_spr && a_spr.destroy() });
		this._fBossHitEnemyAnimations_spr_arr = [];

		this._fHitObj_arr = [];

		this._fEnemiesAnimationCount_num = [];
	}

	destroy()
	{
		this._interrupt();

		super.destroy();
	}
}

export default LightningCapsuleFeatureView;