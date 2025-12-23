import { APP } from '../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sprite from '../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { Utils } from '../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import AtlasSprite from '../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import AtlasConfig from '../config/AtlasConfig';
import Sequence from '../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import * as Easing from '../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import Timer from "../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer";
import { WEAPONS } from '../../../shared/src/CommonConstants';
import {Z_INDEXES} from './GameField';

class MissEffect extends Sprite{
	constructor(x, y, weaponId, optTargetEnemy, aCurrentDefaultWeaponId_int){
		super();

		this.noFlash = weaponId == undefined || aCurrentDefaultWeaponId_int == undefined || aCurrentDefaultWeaponId_int < 1 || aCurrentDefaultWeaponId_int > 5; /*noFlash*/
		this.showSplat = false;
		this.weaponId = weaponId;
		this.targetScale = optTargetEnemy ? optTargetEnemy.getViewScale() : 1;
		this.targetScale = Math.min(this.targetScale, 1);

		this.currentDefaultWeaponId_int = aCurrentDefaultWeaponId_int;

		this.smoke = null;
		this._isSmokePlaying_bl = false;

		this.hitFlash = null;
		this._hitFlashTimer = null;
		this._isHitFlashPlaying_bl = false;

		this.winFlare_arr = [];
		this.winFlareSequence_arr = [];
		this._countWinFlarePlaying_num = 0;

		this.explosion_arr = [];
		this.explosionSequence_arr = [];
		this._countExplosionPlaying_num = 0;

		this.circleBlast = null;
		this.circleBlastSequence = null;
		this._isCircleBlastPlaying_bl = false;

		this.circleBottomBlast = null;
		this.circleBottomBlastSequence = null;
		this._isCircleBottomBlastPlaying_bl = false;
		
		this.createView(x, y);
	}

	createView(x, y){
		this.smoke = this.addChild(new Sprite);
		this.smoke.textures = MissEffect.getSmokeTextures();
		this.smoke.blendMode = PIXI.BLEND_MODES.SCREEN;
		this.smoke.position.set(x - 14, y - 68);
		this.smoke.animationSpeed = 1;
		this.smoke.alpha = 1;
		this.zIndex = Z_INDEXES.MISS_EFFECT;

		this._isSmokePlaying_bl = true;
		this.smoke.play();
		this.smoke.once('animationend', (e) => {
			this.emit("animationFinish");
			this.removeSmoke();
		});

		if(!this.noFlash){
			this.hitFlash = this.addChild(APP.library.getSprite('hitflash'));
			this.hitFlash.scale.set(0.2);
			this.hitFlash.position.set(x, y);
			this.hitFlash.rotation = Utils.random(0, Math.PI*2, true);
			this.hitFlash.blendMode = PIXI.BLEND_MODES.SCREEN;

			this._isHitFlashPlaying_bl = true;
			this._hitFlashTimer = new Timer(this.removeHitFlash.bind(this), 75);

			if (APP.profilingController.info.isVfxProfileValueLowerOrGreater)
			{
				this._addHitSmoke(x, y);

				if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
				{
					this._addCircleBlast(x, y);
				}

				this._addExplosion(x, y);

				if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
				{
					this._addWinFlare(x, y);
				}
			}
		}
	}

	_addHitSmoke(x, y)
	{
		this.hitSmoke = this.addChild(APP.library.getSprite('blend/smoke'));
		this.hitSmoke.position.set(x, y);
		this.hitSmoke.scale.set(0.163);
		this.hitSmoke.alpha = 1;
		this.hitSmoke.blendMode = PIXI.BLEND_MODES.SCREEN;
			
		let lHitSmokeSequenceData = [{
			tweens:[
				{prop:"scale.x", to: 0.65},
				{prop:"scale.y", to: 0.65},
				{prop:"alpha", to: 0},
			], duration: 80, onfinish: () => {
				this.hitSmokeSequence_arr && this.hitSmokeSequence_arr.destructor();
				this.hitSmoke = null;
			}
		}];
			
		this.hitSmokeSequence_arr = Sequence.start(this.hitSmoke, lHitSmokeSequenceData);
	}

	_addWinFlare(x, y)
	{
		switch(this.currentDefaultWeaponId_int) {
			case 1:
				break;
			case 2:
				this.addCustomWinFlare(x - 15, y + 15.5, 20, 15.4, 0.74);
				break;
			case 3:
				this.addCustomWinFlare(x - 26, y + 28.5, 20, 15.4, 0.74);
				this.addCustomWinFlare(x - 41.5, y - 5.5, 110, 15.4, 0.74);
				break;
			case 4:
				this.addCustomWinFlare(x - 26, y + 28, 20, 15.4, 0.74);
				this.addCustomWinFlare(x - 41.5, y - 6, 100, 15.4, 0.74);
				break;
			case 5:
				this.addCustomWinFlare(x - 26, y + 28, 20, 15.4, 1.08);
				this.addCustomWinFlare(x - 52, y + 8.5, 60, -15.4, 1.08);
				this.addCustomWinFlare(x - 41.5, y - 6, 110, 15.4, 1.08);
				break;
			default: 
				break;
		}
	}

	addCustomWinFlare(x, y, delay, rotation, scale)
	{
		let elementId = this.winFlare_arr.push(this.addChild(APP.library.getSprite(this.getWinFlareAsset(this.currentDefaultWeaponId_int)))) - 1;
		this.winFlare_arr[elementId].position.set(x, y);
		this.winFlare_arr[elementId].scale.x = 0;
		this.winFlare_arr[elementId].scale.y = 0;

		this.winFlare_arr[elementId].blendMode = PIXI.BLEND_MODES.SCREEN;

		this._countWinFlarePlaying_num++;

		let lWinFlareSequenceData = this.getWinFlareSequenceData(delay, rotation, scale);
		lWinFlareSequenceData.push(
			{tweens:[], duration: 0, onfinish: () => {this.onWinFlareSequenceDataCompleted(elementId);}}
		);

		this.winFlareSequence_arr[elementId] = Sequence.start(this.winFlare_arr[elementId], lWinFlareSequenceData);
	}

	getWinFlareAsset(aId_int)
	{
		switch(aId_int)
		{
			case 2:	return 'enemy_impact/win_flare/win_flare_2';
			case 3:	return 'enemy_impact/win_flare/win_flare_3';
			case 4:	return 'enemy_impact/win_flare/win_flare_4_5';
			case 5:	return 'enemy_impact/win_flare/win_flare_4_5';
			default: return 'enemy_impact/win_flare/win_flare_2';
		}
	}

	getWinFlareSequenceData(delay, rotation, scale)
	{
		let seq = [];
		let fullRotation = rotation * Math.PI / 180;
		let halfRotation = fullRotation * 2 / 3;

		seq.push({tweens:[], duration: delay});

		seq.push({tweens:[
			{prop:"scale.x", to: scale},
			{prop:"scale.y", to: scale},
			{prop:"rotation", to: halfRotation},
		], duration: 140, ease: Easing.sine.easeIn});

		seq.push({tweens:[
			{prop:"scale.x", to: 0},
			{prop:"scale.y", to: 0},
			{prop:"rotation", to: fullRotation},
		], duration: 70, ease: Easing.sine.easeIn});

		return seq;
	}

	onWinFlareSequenceDataCompleted(aElementId)
	{
		this.winFlareSequence_arr[aElementId] && this.winFlareSequence_arr[aElementId].destructor();
		this.winFlareSequence_arr[aElementId] = null;
		this._countWinFlarePlaying_num--;
		this._animationPlayingCompletionSuspicion();
	}

	_addExplosion(x, y)
	{
		switch(this.currentDefaultWeaponId_int) {
			case 1:
				this.addCustomExplosion(x - 8, y + 3.5, 20, 13.3, 0.96);
				
				break;
			case 2:
				this.addCustomExplosion(x - 17, y + 30, 20, 13.3, 0.96);
				this.addCustomExplosion(x - 3, y - 8.5, 70, -13.3, 0.96);
				break;
			case 3:
				this.addCustomExplosion(x - 23.5, y + 27.5, 20, 13.3, 0.96);
				this.addCustomExplosion(x  - 61, y + 29.5, 60, -13.3, 0.96);
				this.addCustomExplosion(x + 9.5, y - 11, 70, -13.3, 0.96);
				this.addCustomExplosion(x - 69, y - 21, 110, -13.3, 0.96);
				break;
			case 4:
				this.addCustomExplosion(x - 24, y + 28.5, 20, 13.3, 0.96);
				this.addCustomExplosion(x - 56.5, y + 30.5, 60, -13.3, 0.96);
				this.addCustomExplosion(x - 10, y - 10, 70, -13.3, 0.96);
				this.addCustomExplosion(x - 6, y - 7.5, 80, -13.3, 0.96);
				this.addCustomExplosion(x - 24, y + 28.5, 90, 18, 1.96);
				break;
			case 5:
				this.addCustomExplosion(x - 15, y + 25.5, 20, 13.3, 0.96);
				this.addCustomExplosion(x - 50, y - 9.5, 30, 14, 2.16);
				this.addCustomExplosion(x - 50, y - 9.5, 40, 13.3, 0.96);
				this.addCustomExplosion(x - 48.5, y + 27.5, 60, -13.3, 0.96);
				this.addCustomExplosion(x - 2, y - 13, 70, -13.3, 0.96);
				this.addCustomExplosion(x + 2, y + 4.5, 80, 13.3, 0.96);
				this.addCustomExplosion(x - 8.5, y + 32.5, 110, -13.3, 0.96);
				break;
			default: 
				break;
		}
	}

	addCustomExplosion(x, y, delay, rotation, scale)
	{
		let elementId = this.explosion_arr.push(this.addChild(APP.library.getSprite(this.getExplosionAsset(this.currentDefaultWeaponId_int)))) - 1;
		this.explosion_arr[elementId].alpha = 1;
		this.explosion_arr[elementId].position.set(x, y);
		this.explosion_arr[elementId].scale.x = 0;
		this.explosion_arr[elementId].scale.y = 0;
			
		this.explosion_arr[elementId].blendMode = PIXI.BLEND_MODES.SCREEN;

		this._countExplosionPlaying_num++;

		let lExplosionSequenceData = this.getExplosionSequenceData(delay, rotation, scale);
		lExplosionSequenceData.push(
			{tweens:[], duration: 0, onfinish: () => {this.onExplosionSequenceDataCompleted(elementId);}}
		);

		this.explosionSequence_arr[elementId] = Sequence.start(this.explosion_arr[elementId], lExplosionSequenceData);
	}

	getExplosionAsset(aId_int)
	{
		switch(aId_int)
		{
			case 1:	return 'enemy_impact/explosion/explosion_1';
			case 2:	return 'enemy_impact/explosion/explosion_2';
			case 3:	return 'enemy_impact/explosion/explosion_3';
			case 4:	return 'enemy_impact/explosion/explosion_4_5';
			case 5:	return 'enemy_impact/explosion/explosion_4_5';
			default: return 'enemy_impact/explosion/explosion_1';
		}
	}

	getExplosionSequenceData(delay, rotation, scale)
	{
		let seq = [];
		let fullRotation = rotation * Math.PI / 180;
		let halfRotation = fullRotation / 2;
		let halfScale = scale / 2;

		seq.push({tweens:[], duration: delay});

		seq.push({tweens:[
			{prop:"scale.x", to: halfScale}, // image size has been reduced to 2, accordingly, all scales were increased by 2
			{prop:"scale.y", to: halfScale},
			{prop:"rotation", to: halfRotation},
		], duration: 200});

		seq.push({tweens:[
			{prop:"alpha", to: 0},
			{prop:"scale.x", to: scale},
			{prop:"scale.y", to: scale},
			{prop:"rotation", to: fullRotation},
		], duration: 200, ease: Easing.sine.easeOut});

		return seq;
	}

	onExplosionSequenceDataCompleted(aElementId)
	{
		this.explosionSequence_arr[aElementId] && this.explosionSequence_arr[aElementId].destructor();
		this.explosion_arr[aElementId] = null;
		this._countExplosionPlaying_num--;
		this._animationPlayingCompletionSuspicion();
	}

	
	_addCircleBlast(x, y)
	{
		this.circleBlast = this.addChild(APP.library.getSprite('enemy_impact/circle_blast/circle_blast_'+this.currentDefaultWeaponId_int));
		this.circleBlast.blendMode = PIXI.BLEND_MODES.SCREEN;
		this.circleBlast.alpha = 0.8;
		this.circleBlast.position.set(x -11, y - 11);
		this.circleBlast.scale.x = 0;
		this.circleBlast.scale.y = 0;
		this._isCircleBlastPlaying_bl = true;

		switch(this.currentDefaultWeaponId_int)
		{
			case 1:
				this.circleBlast.alpha = 0.72;
				this.circleBlast.scale.x = 0.12;
				this.circleBlast.scale.y = 0.12;
				this.circleBlast.position.set(x - 11, y - 11);
				break;
			case 2:
				this.circleBlast.alpha = 0.72;
				this.circleBlast.scale.x = 0.19;
				this.circleBlast.scale.y = 0.19;
				this.circleBlast.position.set(x - 18, y - 8);
				break;
			case 3:
				this.circleBlast.alpha = 0.8;
				this.circleBlast.scale.x = 0.13;
				this.circleBlast.scale.y = 0.13;
				this.circleBlast.position.set(x + 25, y - 19);
				break;
			case 4:
				this.circleBlast.alpha = 0.72;
				this.circleBlast.scale.x = 0.13;
				this.circleBlast.scale.y = 0.13;
				this.circleBlast.position.set(x, y);
				break;
			case 5:
				this.circleBlast.alpha = 0.72;
				this.circleBlast.scale.x = 0.19;
				this.circleBlast.scale.y = 0.19;
				this.circleBlast.position.set(x + 11, y - 11);

				this._addCircleBottomBlast(x , y);
				break;
			default:
				break;
		}

		this.circleBlastSequence = Sequence.start(this.circleBlast, this.circleBlastSequenceData);
	}

	get circleBlastSequenceData()
	{
		let seq = [];
		let lFirstScale_num = 0;
		let lSecondScale_num = 0;
		let lThirdScale_num = 0;
		let lFirstAlpha_num = 0;
		let lSecondAlpha_num = 0;

		switch(this.currentDefaultWeaponId_int)
		{
			case 1: // image size has been reduced to 2, accordingly, all scales were increased by 2
				lFirstScale_num = 0.32 * 2; 
				lFirstAlpha_num = 0.43;
				lSecondScale_num = 0.43 * 2;
				lSecondAlpha_num = 0;
				lThirdScale_num = 0.45 * 2;
				break;
			case 2:
				lFirstScale_num = 0.5;
				lFirstAlpha_num = 0.43;
				lSecondScale_num = 0.73;
				lSecondAlpha_num = 0;
				lThirdScale_num = 0.95;
				break;
			case 3: // image size has been reduced to 2, accordingly, all scales were increased by 2
				lFirstScale_num = 0.34 * 2;
				lFirstAlpha_num = 0.67;
				lSecondScale_num = 0.49 * 2;
				lThirdScale_num = 0.61 * 2;
				lSecondAlpha_num = 0;
				break;
			case 4:  // image size has been reduced to 2, accordingly, all scales were increased by 2
				lFirstScale_num = 0.37 * 2;
				lFirstAlpha_num = 0.43;
				lSecondScale_num = 0.56 * 2;
				lThirdScale_num = 0.76 * 2;
				lSecondAlpha_num = 0;
				break;

			case 5: // image size has been reduced to 2, accordingly, all scales were increased by 2
				lFirstScale_num = 0.54 * 2;
				lFirstAlpha_num = 0.43;
				lSecondScale_num = 0.83 * 2;
				lThirdScale_num = 1.18 * 2;
				lSecondAlpha_num = 0;
				break;
			default:
				break;
		}

		seq.push({tweens:[
			{prop:"scale.x", to: lFirstScale_num},
			{prop:"scale.y", to: lFirstScale_num},
			{prop:"alpha", to: lFirstAlpha_num},
		], duration: 20});

		seq.push({tweens:[
			{prop:"scale.x", to: lSecondScale_num},
			{prop:"scale.y", to: lSecondScale_num},
		], duration: 20});

		seq.push({tweens:[
			{prop:"scale.x", to: lThirdScale_num},
			{prop:"scale.y", to: lThirdScale_num},
			{prop:"alpha", to: lSecondAlpha_num},
		], duration: 30,
		onfinish: () => {this._oncircleBlastSequenceCompleted();}
		});

		return seq;
	}

	_oncircleBlastSequenceCompleted()
	{
		this.circleBlastSequence && this.circleBlastSequence.destructor();
		this.circleBlast = null;
		this._isCircleBlastPlaying_bl = false;
		this._animationPlayingCompletionSuspicion();
	}

	_addCircleBottomBlast(x , y)
	{
		this.circleBottomBlast = this.addChild(APP.library.getSprite('enemy_impact/circle_blast/circle_blast_bottom_5'));
		this.circleBottomBlast.blendMode = PIXI.BLEND_MODES.SCREEN;
		this.circleBottomBlast.alpha = 0.8;
		this.circleBottomBlast.position.set(x - 12, y + 79);
		this.circleBottomBlast.scale.x = 0;
		this.circleBottomBlast.scale.y = 0;
		this._isCircleBottomBlastPlaying_bl = true;

		let seq = [];

		seq.push({tweens:[
			{prop:"scale.x", to: 1.07},
			{prop:"scale.y", to: 1.07},
			{prop:"alpha", to: 0},
		], duration: 80, ease: Easing.sine.easeIn,
		onfinish: () => {this._oncircleBottomBlastSequenceCompleted();}
		});

		this.circleBottomBlastSequence = Sequence.start(this.circleBottomBlast, seq);
	}

	_oncircleBottomBlastSequenceCompleted()
	{
		this.circleBottomBlastSequence && this.circleBottomBlastSequence.destructor();
		this.circleBottomBlast = null;
		this._isCircleBottomBlastPlaying_bl = false;
		this._animationPlayingCompletionSuspicion();
	}

	removeHitFlash()
	{
		this.hitFlash.destroy();
		this._isHitFlashPlaying_bl = false;
		this._animationPlayingCompletionSuspicion();
	}

	removeSmoke()
	{
		this.smoke.stop();
		this.smoke.alpha = 0;
		this._isSmokePlaying_bl = false;
		this._animationPlayingCompletionSuspicion();
	}

	_animationPlayingCompletionSuspicion()
	{
		if (this._isSmokePlaying_bl 
			|| this._isHitFlashPlaying_bl
			|| this._countWinFlarePlaying_num > 0
			|| this._countExplosionPlaying_num > 0
			|| this._isCircleBlastPlaying_bl
			|| this._isCircleBottomBlastPlaying_bl)
		{
			return;
		}

		this.destroy();
	}

	destroy()
	{
		Sequence.destroy(Sequence.findByTarget(this));

		this.smoke = null;
		this.hitFlash = null;

		this._hitFlashTimer && this._hitFlashTimer.destructor();
		this._hitFlashTimer = null;

		this.targetScale = undefined;

		this.winFlare_arr = [];

		for (let i = 0; i< this.winFlareSequence_arr.length; i++)
		{
			this.winFlareSequence_arr[i] && this.winFlareSequence_arr[i].destructor();
		}

		this.winFlareSequence_arr = [];

		this.explosion_arr = [];

		for (let i = 0; i< this.explosionSequence_arr.length; i++)
		{
			this.explosionSequence_arr[i] && this.explosionSequence_arr[i].destructor();
		}

		this.explosionSequence_arr = [];

		this.circleBlast = null;
		this.circleBlastSequence && this.circleBlastSequence.destructor();
		this.circleBlastSequence = null;

		this.circleBottomBlast = null;
		this.circleBottomBlastSequence && this.circleBottomBlastSequence.destructor();
		this.circleBottomBlastSequence = null;

		this.hitSmokeSequence_arr && this.hitSmokeSequence_arr.destructor();
		this.hitSmokeSequence_arr = null;

		this._isSmokePlaying_bl = null;
		this._isHitFlashPlaying_bl = null;
		this._countWinFlarePlaying_num = null;
		this._countExplosionPlaying_num = null;
		this._isCircleBlastPlaying_bl = null;
		this._isCircleBottomBlastPlaying_bl = null;

		super.destroy();
	}
}

MissEffect.getSmokeTextures = function(){
	if(!MissEffect.smokeTextures){
		MissEffect.setSmokeTextures();
	}
	return MissEffect.smokeTextures;
}

MissEffect.setSmokeTextures = function (){
	var asset = APP.library.getAsset("enemy_impact/smoke");
	var config = AtlasConfig.SmokeImpactEnemy[0];
	var pathName = "SmokeImpactEnemy";

	MissEffect.smokeTextures = AtlasSprite.getFrames([asset], [config], pathName);
	MissEffect.smokeTextures.sort(function(a, b){if(a._atlasName > b._atlasName) return 1; else return -1});
}

export default MissEffect;