import SpecterEnemy from './SpecterEnemy';
import { Sprite } from '../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import AtlasConfig from './../../config/AtlasConfig';
import { AtlasSprite } from '../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Timer from '../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import { FRAME_RATE } from '../../../../shared/src/CommonConstants';
import { Sequence } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import Enemy, { DIRECTION, TURN_DIRECTION } from './Enemy';

let _frame_textures = null;
function _generateFrameTextures()
{
	if (_frame_textures) return

	_frame_textures = AtlasSprite.getFrames([APP.library.getAsset("enemies/specter/png_assets-0"), APP.library.getAsset("enemies/specter/png_assets-1")], [AtlasConfig.SpecterPngAssets0, AtlasConfig.SpecterPngAssets1], "frame");
}

let _top_fire_textures = null;
function _generateTopFireTextures()
{
	if (_top_fire_textures) return

	_top_fire_textures = AtlasSprite.getFrames([APP.library.getAsset("enemies/specter/png_assets-0"), APP.library.getAsset("enemies/specter/png_assets-1")], [AtlasConfig.SpecterPngAssets0, AtlasConfig.SpecterPngAssets1], "top_fire");
}

let _smoke_textures = null;
function _generateSmokeTextures()
{
	if (_smoke_textures) return

	_smoke_textures = AtlasSprite.getFrames([APP.library.getAsset("enemies/specter/fire/smoke")], [AtlasConfig.FireSpecterSmoke], "");
}

let _fire_circle_textures = null;
function _generateFireCircleTextures()
{
	if (_fire_circle_textures) return

	_fire_circle_textures = AtlasSprite.getFrames([APP.library.getAsset("enemies/specter/fire/circle")], [AtlasConfig.FireSpecterCircle], "");
}

let _aura_textures = null;
function _generateAuraTextures()
{
	if (_aura_textures) return

	_aura_textures = AtlasSprite.getFrames([APP.library.getAsset("enemies/specter/fire/aura")], [AtlasConfig.FireSpecterAura], "");
}

let _bottom_fire_textures = null;
function _generateBottomFireTextures()
{
	if (_bottom_fire_textures) return

	_bottom_fire_textures = AtlasSprite.getFrames([APP.library.getAsset("enemies/specter/fire/bottom_fire")], [AtlasConfig.FireSpecterBottomFire], "");
}

let _explode_add_textures = null;
function _generateExplodeADDTextures()
{
	if (_explode_add_textures) return

	_explode_add_textures = AtlasSprite.getFrames([APP.library.getAsset("enemies/specter/fire/explode_add")], [AtlasConfig.FireSpecterExplodeADD], "");
}

let _explode_norm_textures = null;
function _generateExplodeNormTextures()
{
	if (_explode_norm_textures) return

	_explode_norm_textures = AtlasSprite.getFrames([APP.library.getAsset("enemies/specter/png_assets-0"), APP.library.getAsset("enemies/specter/png_assets-1")], [AtlasConfig.SpecterPngAssets0, AtlasConfig.SpecterPngAssets1], "explode_norm");
}

class FireSpecterEnemy extends SpecterEnemy
{
	static get FIRE_ANIMATION_SPEED() { return 24/60 }

	static get FRAME_TEXTURES()
	{
		if (!_frame_textures)
		{
			_generateFrameTextures();
		}

		return _frame_textures;
	}

	constructor(params)
	{
		super(params);
		this._fIsEffectsAnimationPaused_bl = false;
	}

	changeSpineView(type, noChangeFrame)
	{
		super.changeSpineView(type, noChangeFrame);

		_generateTopFireTextures();
		this._addTopFire();
	}

	_addTopFire()
	{
		if (this._fTopFire_spr && this._fTopFire_spr.transform)
		{
			let lPosition_obj = this._getTopFirePosition();
			this._fTopFire_spr.position = lPosition_obj;
			let lScale_obj = this._getTopFireScale();
			this._fTopFire_spr.scale.set(lScale_obj.x, lScale_obj.y);
			return;
		}

		this._fTopFire_spr = this.container.addChildAt(new Sprite(), 1);
		this._fTopFire_spr.zIndex = 100;
		let lPosition_obj = this._getTopFirePosition();
		this._fTopFire_spr.position = lPosition_obj;
		this._fTopFire_spr.textures = _top_fire_textures;
		let lScale_obj = this._getTopFireScale();
		this._fTopFire_spr.blendMode = PIXI.BLEND_MODES.ADD;
		this._fTopFire_spr.scale.set(lScale_obj.x, lScale_obj.y);
		this._fTopFire_spr.animationSpeed = 24/60;
		this._fTopFire_spr.play();
		this._fTopFire_spr.alpha = 0.8;
	}

	_getTopFirePosition()
	{
		let lResult_obj = {};
		switch (this.direction)
		{
			case DIRECTION.LEFT_DOWN:
				lResult_obj = { x: -20 * (1 / this.container.scale.x), y: -125 * (1 / this.container.scale.y)};
				break;
			case DIRECTION.RIGHT_DOWN:
				lResult_obj = { x: 20 * (1 / this.container.scale.x), y: -125 * (1 / this.container.scale.y)};
				break;
			default:
				throw new Error('Wrong direction for animation');
		}

		return lResult_obj;
	}

	_getTopFireScale()
	{
		let lResult_obj = {};
		switch (this.direction)
		{
			case DIRECTION.LEFT_DOWN:
				lResult_obj = { x: 2 * (1 / this.container.scale.x), y: 2 * (1 / this.container.scale.y)};
				break;
			case DIRECTION.RIGHT_DOWN:
				lResult_obj = { x: -2 * (1 / this.container.scale.x), y: 2 * (1 / this.container.scale.y)};
				break;
			default:
				throw new Error('Wrong direction for animation');
		}

		return lResult_obj;
	}

	//override
	_startSpecterAppearing()
	{
		this._initStartEffect();
		this.spineView.visible = false;
		this._fRiseTimer_t = new Timer(() =>
		{
			this.spineView.visible = true;
			APP.profilingController.info.isVfxProfileValueMediumOrGreater && this._startBottomFire(0);
			this._riseEnemy();
			this._fRiseTimer_t = null;
		}, 50 * FRAME_RATE);
		this._fRiseTimer_t.on("end", this._startSpawnSound, this);
	}

	_startSpawnSound()
	{
		APP.soundsController.play("mq_dragonstone_fire_specter_spawn");
	}

	//override
	_initConstantEffect()
	{
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startAuraAnimation();
			this._startFireCircleAnimation(67);
			this._startBottomFire(16);
		}
	}

	//override
	_initStartEffect()
	{
		this._startSmokeAnimation();

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startAuraAnimation();
			this._fFireCircleTimer_t = new Timer(() =>
			{
				this._startFireCircleAnimation(0);
				this._fFireCircleTimer_t = null;
			}, 24 * FRAME_RATE);
		}
	}

	_startBottomFire(aStartFrame_int)
	{
		_generateBottomFireTextures();

		this._fBottomFire_spr = this.container.addChild(new Sprite());
		let lPosition_obj = this._getBottomFirePosition();
		this._fBottomFire_spr.position = lPosition_obj;
		this._fBottomFire_spr.textures = _bottom_fire_textures;
		this._fBottomFire_spr.blendMode = PIXI.BLEND_MODES.SCREEN;
		this._fBottomFire_spr.scale.set(2);
		this._fBottomFire_spr.animationSpeed = FireSpecterEnemy.FIRE_ANIMATION_SPEED;
		this._fBottomFire_spr.on('animationend', () =>
		{
			this._fBottomFire_spr.gotoAndPlay(20);
		});
		this._fBottomFire_spr.gotoAndPlay(aStartFrame_int);
	}

	_getBottomFirePosition()
	{
		let lResult_obj = {};
		switch (this.direction)
		{
			case DIRECTION.LEFT_DOWN:
				lResult_obj = { x: 7, y: -29 };
				break;
			case DIRECTION.RIGHT_DOWN:
				lResult_obj = { x: -35, y: -29 };
				break;
			default:
				throw new Error('Wrong direction for animation');
		}

		return lResult_obj;
	}

	_startAuraAnimation()
	{
		_generateAuraTextures();

		this._fAura_spr = this.container.addChildAt(new Sprite(), 0);
		let lPosition_obj = this._getAuraPosition();
		this._fAura_spr.position = lPosition_obj;
		this._fAura_spr.textures = _aura_textures;
		this._fAura_spr.blendMode = PIXI.BLEND_MODES.SCREEN;
		let lAuraScale_obj = this._getAuraScale();
		this._fAura_spr.scale.set(lAuraScale_obj.x, lAuraScale_obj.y);
		this._fAura_spr.animationSpeed = FireSpecterEnemy.FIRE_ANIMATION_SPEED;
		this._fAura_spr.play();
		this._fAura_spr.alpha = 0;

		let lAlpha_seq = [
			{tweens: [	{prop: "alpha", to: 1}],	duration: 5 * FRAME_RATE}
		];

		Sequence.start(this._fAura_spr, lAlpha_seq);
	}

	_getAuraScale()
	{
		switch (this.direction)
		{
			case DIRECTION.LEFT_DOWN:
				return {x: -2, y: 2};
			case DIRECTION.RIGHT_DOWN:
				return {x: 2, y: 2};
			default:
				throw new Error('Wrong direction for animation');
		}
	}

	_getAuraPosition()
	{
		let lResult_obj = {};
		switch (this.direction)
		{
			case DIRECTION.LEFT_DOWN:
				lResult_obj = { x: 21, y: 32};
				break;
			case DIRECTION.RIGHT_DOWN:
				lResult_obj = { x: -21, y: 32};
				break;
			default:
				throw new Error('Wrong direction for animation');
		}

		return lResult_obj;
	}

	_startFireCircleAnimation(aStartFrame_int)
	{
		_generateFireCircleTextures();

		this._fFireCircle_spr = this.container.addChildAt(new Sprite(), 1);
		let lPosition_obj = this._getFireCirclePosition();
		this._fFireCircle_spr.position = lPosition_obj;
		this._fFireCircle_spr.textures = _fire_circle_textures;
		this._fFireCircle_spr.blendMode = PIXI.BLEND_MODES.SCREEN;
		this._fFireCircle_spr.scale.set(2);
		this._fFireCircle_spr.animationSpeed = FireSpecterEnemy.FIRE_ANIMATION_SPEED;
		this._fFireCircle_spr.on('animationend', () =>
		{
			this._fFireCircle_spr.gotoAndPlay(67);
		});
		this._fFireCircle_spr.gotoAndPlay(aStartFrame_int);
	}

	_getFireCirclePosition()
	{
		let lResult_obj = {};
		switch (this.direction)
		{
			case DIRECTION.LEFT_DOWN:
				lResult_obj = { x: 130, y: -100 };
				break;
			case DIRECTION.RIGHT_DOWN:
				lResult_obj = { x: 87, y: -100 };
				break;
			default:
				throw new Error('Wrong direction for animation');
		}

		return lResult_obj;
	}

	_startSmokeAnimation()
	{
		_generateSmokeTextures();

		this._fSmoke_spr = this.container.addChild(new Sprite());
		let lPosition_obj = this._getSmokePosition();
		this._fSmoke_spr.position = lPosition_obj;
		this._fSmoke_spr.textures = _smoke_textures;
		let lScale_obj = this._getSmokeScale();
		this._fSmoke_spr.blendMode = PIXI.BLEND_MODES.SCREEN;
		this._fSmoke_spr.scale.set(lScale_obj.x, lScale_obj.y);
		this._fSmoke_spr.animationSpeed = FireSpecterEnemy.FIRE_ANIMATION_SPEED;
		this._fSmoke_spr.once('animationend', () =>
		{
			this._fSmoke_spr.destroy();
		});
		this._fSmoke_spr.play();
	}

	_getSmokeScale()
	{
		let lResult_obj = {};
		switch (this.direction)
		{
			case DIRECTION.LEFT_UP:
			case DIRECTION.LEFT_DOWN:
				lResult_obj = { x: 2, y: 2 };
				break;
			case DIRECTION.RIGHT_UP:
			case DIRECTION.RIGHT_DOWN:
				lResult_obj = { x: -2, y: 2 };
				break;
			default:
				throw new Error('Wrong direction for animation');
		}

		return lResult_obj;
	}

	_getSmokePosition()
	{
		let lResult_obj = {};
		switch (this.direction)
		{
			case DIRECTION.LEFT_DOWN:
			case DIRECTION.LEFT_UP:
				lResult_obj = { x: 105, y: -96 };
				break;
			case DIRECTION.RIGHT_DOWN:
			case DIRECTION.RIGHT_UP:
				lResult_obj = { x: -119, y: -96 };
				break;
			default:
				throw new Error('Wrong direction for animation');
		}

		return lResult_obj;
	}

	//override
	getImageName()
	{
		return 'enemies/specter/fire/Specter';
	}

	//override
	getTurnAnimationName()
	{
		let lDirectionsAngles_int_arr = [0, 90]; //CCW
		let lFinalAngle_num = Number(this.direction.substr(3));
		let lFinalAngleIndex_int = lDirectionsAngles_int_arr.indexOf(lFinalAngle_num);

		let j = this.turnDirection == TURN_DIRECTION.CCW ? -1 : 1;
		let lPreviousAngleIndex_int = (lFinalAngleIndex_int + j) % lDirectionsAngles_int_arr.length;
		if (lPreviousAngleIndex_int < 0)
		{
			lPreviousAngleIndex_int = lDirectionsAngles_int_arr.length + lPreviousAngleIndex_int;
		}
		let lPreviousAngle_num = lDirectionsAngles_int_arr[lPreviousAngleIndex_int];

		return (lPreviousAngle_num + "_to_" + lFinalAngle_num + this.turnPostfix); //i.e. 270_to_180_turn
	}

	//override
	_playDeathFxAnimation()
	{
		this._onDisappearingStarted();

		this._fIsDeathFxFinished_bl = false;
		this._fIsDeathFxPlayed_bl = true;
		if (this.isDeathActivated && this.deathReason != 1 /* 1 - as a result of death before/after boss */)
		{
			this._playWiggle();
			this._fHideEnemyTimer_t = new Timer(() =>
			{
				this._hideEnemy();
			}, 8 * FRAME_RATE);
		}
		else
		{
			this._hideEnemy();
			this._startNoDeathExplodeAnimation();
		}
	}

	_hideEnemy()
	{
		this.spineView.visible = false;
		this._fTopFire_spr && (this._fTopFire_spr.visible = false);
		this._fSmoke_spr && (this._fSmoke_spr.visible = false);
		this._fFireCircle_spr && (this._fFireCircle_spr.visible = false);
		this._fAura_spr && (this._fAura_spr.visible = false);
		this._fBottomFire_spr && (this._fBottomFire_spr.visible = false);
		this.emit(Enemy.EVENT_ON_ENEMY_IS_HIDDEN);
	}

	_playWiggle()
	{
		let l_seq = [
			{ tweens: [{ prop: 'position.x', to: 2 }, { prop: 'position.y', to: -1 }], duration: 1 * FRAME_RATE },
			{ tweens: [{ prop: 'position.x', to: 0 }, { prop: 'position.y', to: 1 }], duration: 1 * FRAME_RATE },
			{ tweens: [{ prop: 'position.x', to: -2 }, { prop: 'position.y', to: -2 }], duration: 1 * FRAME_RATE },
			{ tweens: [{ prop: 'position.x', to: -4 }, { prop: 'position.y', to: 1 }], duration: 1 * FRAME_RATE },
			{ tweens: [{ prop: 'position.x', to: -5 }, { prop: 'position.y', to: 6 }], duration: 1 * FRAME_RATE },
			{ tweens: [{ prop: 'position.x', to: 3 }, { prop: 'position.y', to: -4 }], duration: 1 * FRAME_RATE, onfinish: () => {
				APP.soundsController.play("mq_dragonstone_fire_specter_death");
				this._startFireRingAnimation();
				this._startExplodeAnimationNorm();
				this._startExplodeAnimationADD();
				this._startGameFieldAnimation();
				APP.gameScreen.gameField.shakeTheGround("bossExplosion");

				this._fImpactTimer_t = new Timer(() =>{APP.gameScreen.gameField.rageImpactOnOtherEnemies(this.id)}, 3 * FRAME_RATE);

			}}
		];

		Sequence.start(this.spineView, l_seq);
	}

	_startGameFieldAnimation()
	{
		APP.gameScreen.gameField.showFireSpecterExplodeAnimation();
	}

	_startExplodeAnimationADD()
	{
		_generateExplodeADDTextures();

		this._fExplodeAdd_spr = this.container.addChild(new Sprite());

		this._fExplodeAdd_spr.position.set(-3, -65);
		this._fExplodeAdd_spr.textures = _explode_add_textures;
		this._fExplodeAdd_spr.blendMode = PIXI.BLEND_MODES.ADD;
		this._fExplodeAdd_spr.scale.set(2);
		this._fExplodeAdd_spr.animationSpeed = FireSpecterEnemy.FIRE_ANIMATION_SPEED;
		this._fExplodeAdd_spr.once('animationend', () =>
		{
			this._fExplodeAdd_spr.destroy();
			this._fExplodeAdd_spr = null;
			this._tryFinishDeathAnimation();
		});
		this._fExplodeAdd_spr.play();
	}

	_startExplodeAnimationNorm()
	{
		_generateExplodeNormTextures();

		this._fExplodeNorm_spr = this.container.addChild(new Sprite());

		this._fExplodeNorm_spr.position.set(116, -97);
		this._fExplodeNorm_spr.textures = _explode_norm_textures;
		this._fExplodeNorm_spr.scale.set(4);
		this._fExplodeNorm_spr.animationSpeed = 24/60;
		this._fExplodeNorm_spr.once('animationend', () =>
		{
			this._fExplodeNorm_spr.destroy();
			this._fExplodeNorm_spr = null;
			this._tryFinishDeathAnimation();
		});
		this._fExplodeNorm_spr.play();
	}

	_startFireRingAnimation()
	{
		this._fFireRing_spr = this.container.addChild(new Sprite);
		let lRingView = this._fFireRing_spr.addChild(APP.library.getSprite("enemies/specter/fire/fire_ring"));
		lRingView.scale.set(2);
		lRingView.blendMode = PIXI.BLEND_MODES.ADD;

		this._fFireRing_spr.position.set(-50, 0);
		this._fFireRing_spr.scale.set(0.52);
		this._fFireRing_spr.alpha = 0.35;

		let lSequenceScale_arr = [
			{ tweens: [{ prop: "scale.x", to: 1.75 }, 	{ prop: "scale.y", to: 1.75 }], 	duration: 7 * FRAME_RATE}
		];
		Sequence.start(this._fFireRing_spr, lSequenceScale_arr);

		let lSequenceAlpha_arr = [
			{ tweens: [{ prop: "alpha", to: 0.33 }], 	duration: 10 * FRAME_RATE},
			{ tweens: [{ prop: "alpha", to: 0 }], 		duration: 11 * FRAME_RATE, onfinish: () => {
				this._fFireRing_spr.destroy();
				this._fFireRing_spr = null;
				this._tryFinishDeathAnimation();
			}},
		];
		Sequence.start(this._fFireRing_spr, lSequenceAlpha_arr);
	}

	_tryFinishDeathAnimation()
	{
		if (
			!this._fExplodeAdd_spr &&
			!this._fExplodeNorm_spr &&
			!this._fFireRing_spr
		)
		{
			this._fIsDeathFxFinished_bl = true;
			this.onDeathFxAnimationCompleted();
			this._onDisappearingEnded();
		}
	}

	//override
	_getPossibleDirections()
	{
		return [0, 90];
	}


	tick()
	{
		super.tick();

		//EFFECTS TRANSPARENCY VALIDATION WHEN FROZEN|UNFROZEN...
		let lIsJustFrozen_bl = false;
		let lIsJustUnfrozen_bl = false;

		if(this.isFrozen)
		{
			lIsJustFrozen_bl = !this._fIsEffectsAnimationPaused_bl;
			lIsJustUnfrozen_bl = false;
			this._fIsEffectsAnimationPaused_bl = true;
		}
		else
		{
			lIsJustFrozen_bl = false;
			lIsJustUnfrozen_bl = this._fIsEffectsAnimationPaused_bl;
			this._fIsEffectsAnimationPaused_bl = false;
		}

		this._fIsEffectsAnimationPaused_bl = this.isFrozen;

		let lEffectsAlphaMultiplier_num = 1;
		let lIsUnfreezingOrNotFreezed_bl = true;

		if(this.isFrozen)
		{
			let lPoints_p_arr = this.trajectory.points;
			let lCurrentTime_num = APP.gameScreen.currentTime;
			let lFreezeMomentTime_num = lPoints_p_arr[0].time;

			let lFreezeProgress_num = (lFreezeMomentTime_num - lCurrentTime_num) / 3000;

			if(lFreezeProgress_num > 1)
			{
				lFreezeProgress_num = 1;
			}
			else if(lFreezeProgress_num < 0)
			{
				lFreezeProgress_num = 0;
			}

			lFreezeProgress_num = 1 - lFreezeProgress_num;

			let lAlphaIntroOutroProgressDuration_num = 0.16;
			let lOutroProgressBorder_num = 1 - lAlphaIntroOutroProgressDuration_num;

			//FREEZE INTRO...
			if(lFreezeProgress_num < lAlphaIntroOutroProgressDuration_num)
			{
				lIsUnfreezingOrNotFreezed_bl = false;
				lEffectsAlphaMultiplier_num = 1 - lFreezeProgress_num / lAlphaIntroOutroProgressDuration_num;
			}
			//...FREEZE INTRO
			else
			//FREEZE OUTRO...
			if(lFreezeProgress_num > lOutroProgressBorder_num)
			{
				lIsUnfreezingOrNotFreezed_bl = true;
				lEffectsAlphaMultiplier_num = (lFreezeProgress_num - lOutroProgressBorder_num) / lAlphaIntroOutroProgressDuration_num;
			}
			//...FREEZE OUTRO
			else
			//ABSOLUTE FREEZE...
			{
				lIsUnfreezingOrNotFreezed_bl = false;
				lEffectsAlphaMultiplier_num = 0;
			}
			//...FREEZE ABSOLUTE
		}

		if(lIsUnfreezingOrNotFreezed_bl)
		{
			if(this._fBottomFire_spr) this._fBottomFire_spr.alpha = lEffectsAlphaMultiplier_num;
			if(this._fTopFire_spr) this._fTopFire_spr.alpha = lEffectsAlphaMultiplier_num;
			if(this._fSmoke_spr) this._fSmoke_spr.alpha = lEffectsAlphaMultiplier_num;
			if(this._fFireCircle_spr) this._fFireCircle_spr.alpha = lEffectsAlphaMultiplier_num;
			if(this._fFireRing_spr) this._fFireRing_spr.alpha = lEffectsAlphaMultiplier_num;
			if(this._fAura_spr) this._fAura_spr.alpha = lEffectsAlphaMultiplier_num;
		}
		else
		{
			if(this._fBottomFire_spr) this._fBottomFire_spr.alpha *= lEffectsAlphaMultiplier_num;
			if(this._fTopFire_spr) this._fTopFire_spr.alpha *= lEffectsAlphaMultiplier_num;
			if(this._fSmoke_spr) this._fSmoke_spr.alpha *= lEffectsAlphaMultiplier_num;
			if(this._fFireCircle_spr) this._fFireCircle_spr.alpha *= lEffectsAlphaMultiplier_num;
			if(this._fFireRing_spr) this._fFireRing_spr.alpha *= lEffectsAlphaMultiplier_num;
			if(this._fAura_spr) this._fAura_spr.alpha *= lEffectsAlphaMultiplier_num;
		}
		//...EFFECTS TRANSPARENCY VALIDATION WHEN FROZEN|UNFROZEN

	}

	destroy(purely)
	{
		if(!this._fIsDeathFxPlayed_bl && !purely)
		{
			this.visible = true;
			this._playDeathFxAnimation();
			return;
		}

		if(!this._fIsDeathFxFinished_bl && !purely)
		{
			return;
		}

		this._fAura_spr && Sequence.destroy(Sequence.findByTarget(this._fAura_spr));
		this.spineView && Sequence.destroy(Sequence.findByTarget(this.spineView));
		this._fFireRing_spr && Sequence.destroy(Sequence.findByTarget(this._fFireRing_spr));

		this._fRiseTimer_t && this._fRiseTimer_t.destructor();
		this._fFireCircleTimer_t && this._fFireCircleTimer_t.destructor();
		this._fHideEnemyTimer_t && this._fHideEnemyTimer_t.destructor();
		this._fImpactTimer_t && this._fImpactTimer_t.destructor();

		super.destroy(purely);

		this._fTopFire_spr = null;
		this._fSmoke_spr = null;
		this._fRiseTimer_t = null;
		this._fFireCircleTimer_t = null;
		this._fFireCircle_spr = null;
		this._fAura_spr = null;
		this._fBottomFire_spr = null;
		this._fHideEnemyTimer_t = null;
		this._fFireRing_spr = null;
		this._fExplodeAdd_spr = null;
		this._fExplodeNorm_spr = null;
		this._fNoDeathExplode_spr = null;
	}
}

export default FireSpecterEnemy;