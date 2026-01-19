import SpecterEnemy from './SpecterEnemy';
import { Sprite } from '../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import AtlasConfig from './../../config/AtlasConfig';
import { AtlasSprite } from '../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Timer from '../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import { FRAME_RATE } from '../../../../shared/src/CommonConstants';
import Enemy, { TURN_DIRECTION } from './Enemy';
import { Sequence } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';

let _appearing_smoke_textures = null;
function _generateAppearingSmokeTextures()
{
	if (_appearing_smoke_textures) return

	_appearing_smoke_textures = AtlasSprite.getFrames([APP.library.getAsset("enemies/specter/spirit/appearing_smoke")], [AtlasConfig.SpiritSpecterAppearingSmoke], "appearing_smoke");
}

let _bottom_smoke_textures = null;
function _generateBottomSmokeTextures()
{
	if (_bottom_smoke_textures) return

	_bottom_smoke_textures = AtlasSprite.getFrames([APP.library.getAsset("enemies/specter/spirit/bottom_smoke")], [AtlasConfig.SpiritSpecterBottomSmoke], "");
}

let _smoke_textures = null;
function _generateSmokeTextures()
{
	if (_smoke_textures) return

	_smoke_textures = AtlasSprite.getFrames([APP.library.getAsset("enemies/specter/spirit/smoke")], [AtlasConfig.SpiritSpecterSmoke], "");
}

let _explode_textures = null;
function _generateExplodeTextures()
{
	if (_explode_textures) return

	_explode_textures = AtlasSprite.getFrames([APP.library.getAsset("enemies/specter/spirit/explode_1"), APP.library.getAsset("enemies/specter/spirit/explode_2")], [AtlasConfig.SpiritSpecterExplode1, AtlasConfig.SpiritSpecterExplode2], "");
}

class SpiritSpecterEnemy extends SpecterEnemy
{
	static get FIRE_ANIMATION_SPEED() { return 0.4 } // 24/60

	constructor(params)
	{
		super(params);
		this._fIsEffectsAnimationPaused_bl = false;
	}

	//override
	_initConstantEffect()
	{
		this._startBottomSmoke();
		APP.profilingController.info.isVfxProfileValueMediumOrGreater && this._startConstantSmoke();
	}

	//override
	_initStartEffect()
	{
		APP.soundsController.play("mq_dragonstone_spirit_specter_spawn")
		this._startAppearingSmokeAnimation();

		this._fBottomSmokeTimer_t = new Timer(() =>
		{
			this._startBottomSmoke();
		}, 10 * FRAME_RATE);
	}

	_startBottomSmoke()
	{
		_generateBottomSmokeTextures();

		this._fBottomSmoke_spr = this.container.addChild(new Sprite());
		this._fBottomSmoke_spr.position.set(0, -112);
		this._fBottomSmoke_spr.textures = _bottom_smoke_textures;
		this._fBottomSmoke_spr.blendMode = PIXI.BLEND_MODES.ADD;
		this._fBottomSmoke_spr.scale.set(2, 2);
		this._fBottomSmoke_spr.animationSpeed = SpiritSpecterEnemy.FIRE_ANIMATION_SPEED;
		this._fBottomSmoke_spr.play();
	}

	_startAppearingSmokeAnimation()
	{
		_generateAppearingSmokeTextures();

		this._fAppearingSmoke_spr = this.container.addChild(new Sprite());
		this._fAppearingSmoke_spr.position.set(0, -60);
		this._fAppearingSmoke_spr.textures = _appearing_smoke_textures;
		this._fAppearingSmoke_spr.blendMode = PIXI.BLEND_MODES.ADD;
		this._fAppearingSmoke_spr.scale.set(2, 2);
		this._fAppearingSmoke_spr.animationSpeed = SpiritSpecterEnemy.FIRE_ANIMATION_SPEED;
		this._fAppearingSmoke_spr.once('animationend', () =>
		{
			APP.profilingController.info.isVfxProfileValueMediumOrGreater && this._startConstantSmoke();
			this._fAppearingSmoke_spr.destroy();
			this._fAppearingSmoke_spr = null;
		});
		this._fAppearingSmoke_spr.play();
	}

	_startConstantSmoke()
	{
		_generateSmokeTextures();

		this._fSmoke_spr = this.container.addChild(new Sprite());
		this._fSmoke_spr.position.set(10, -87);
		this._fSmoke_spr.textures = _smoke_textures;
		this._fSmoke_spr.blendMode = PIXI.BLEND_MODES.ADD;
		this._fSmoke_spr.scale.set(2, 2);
		this._fSmoke_spr.animationSpeed = SpiritSpecterEnemy.FIRE_ANIMATION_SPEED;
		this._fSmoke_spr.play();
	}

	_spiritSpecterFx()
	{
		this._fAppearingSmoke_spr && (this._fAppearingSmoke_spr.zIndex = 10);
		this._fSmoke_spr && (this._fSmoke_spr.zIndex = 11);
		this._fBottomSmoke_spr && (this._fBottomSmoke_spr.zIndex = 12);
	}

	//override
	getImageName()
	{
		return 'enemies/specter/spirit/Specter';
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
		this._fSmoke_spr && (this._fSmoke_spr.visible = false);
		this._fAppearingSmoke_spr && (this._fAppearingSmoke_spr.visible = false);
		this._fBottomSmoke_spr && (this._fBottomSmoke_spr.visible = false);
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
				this._startExplodeAnimation();
				this._startSpiritSpecterExplosionRingsAnimation();
				APP.gameScreen.gameField.shakeTheGround("plasma");

				APP.gameScreen.gameField.rageImpactOnOtherEnemies(this.id);
			}}
		];

		Sequence.start(this.spineView, l_seq);
	}

	_startSpiritSpecterExplosionRingsAnimation()
	{
		APP.gameScreen.gameField.startSpiritSpecterExplosionRingsAnimation(this.position);
	}

	_startExplodeAnimation()
	{
		_generateExplodeTextures();

		this._fExplode_spr = this.container.addChild(new Sprite());
		this._fExplode_spr.position.set(0, -53);
		this._fExplode_spr.textures = _explode_textures;
		this._fExplode_spr.blendMode = PIXI.BLEND_MODES.SCREEN;
		this._fExplode_spr.scale.set(4, 4);
		this._fExplode_spr.animationSpeed = SpiritSpecterEnemy.FIRE_ANIMATION_SPEED;
		this._fExplode_spr.once('animationend', () =>
		{
			this._fIsDeathFxFinished_bl = true;
			this._fExplode_spr.destroy();
			this.onDeathFxAnimationCompleted();
			this._onDisappearingEnded();
		});
		this._fExplode_spr.play();
	}

	//override
	_getPossibleDirections()
	{
		return [0, 90];
	}

	//override
	tick()
	{
		super.tick();

		this._spiritSpecterFx();


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
			if(this._fAppearingSmoke_spr) this._fAppearingSmoke_spr.alpha = lEffectsAlphaMultiplier_num;
			if(this._fBottomSmoke_spr) this._fBottomSmoke_spr.alpha = lEffectsAlphaMultiplier_num;
			if(this._fSmoke_spr) this._fSmoke_spr.alpha = lEffectsAlphaMultiplier_num;
		}
		else
		{
			if(this._fAppearingSmoke_spr) this._fAppearingSmoke_spr.alpha *= lEffectsAlphaMultiplier_num;
			if(this._fBottomSmoke_spr) this._fBottomSmoke_spr.alpha *= lEffectsAlphaMultiplier_num;
			if(this._fSmoke_spr) this._fSmoke_spr.alpha *= lEffectsAlphaMultiplier_num;
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

		this.spineView && Sequence.destroy(Sequence.findByTarget(this.spineView));

		this._fBottomSmokeTimer_t && this._fBottomSmokeTimer_t.destructor();
		this._fBottomSmokeTimer_t = null;

		this._fHideEnemyTimer_t && this._fHideEnemyTimer_t.destructor();
		this._fHideEnemyTimer_t = null;

		this._fAppearingSmoke_spr = null;
		this._fBottomSmoke_spr = null;
		this._fSmoke_spr = null;
		this._fExplode_spr = null;

		super.destroy(purely);
	}
}

export default SpiritSpecterEnemy;