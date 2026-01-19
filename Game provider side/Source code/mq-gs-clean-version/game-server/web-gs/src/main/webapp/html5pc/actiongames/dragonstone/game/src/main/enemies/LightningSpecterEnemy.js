import SpecterEnemy from './SpecterEnemy';
import { Sprite } from '../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import { FRAME_RATE } from '../../../../shared/src/CommonConstants';
import Enemy, { DIRECTION, TURN_DIRECTION } from './Enemy';
import LightningSpecterAppearAnimation from './../animation/specter/LightningSpecterAppearAnimation';
import LightningSpecterIdleAnimation from './../animation/specter/LightningSpecterIdleAnimation';
import LightningSpecterDisappearAnimation from './../animation/specter/LightningSpecterDisappearAnimation';
import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { Sequence } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import LightningSpecterKillAnimation from '../animation/specter/LightningSpecterKillAnimation';

class LightningSpecterEnemy extends SpecterEnemy
{
	constructor(params)
	{
		super(params);
		this._disappearAnimation = null;
	}

	//override
	getImageName()
	{
		return 'enemies/specter/lightning/Specter';
	}

	//override
	_getPossibleDirections()
	{
		return [0, 90];
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

	_initConstantEffect()
	{
		this._startSpecterIdle();
	}

	_startSpecterIdle()
	{
		this._backContainer = this.container.addChildAt(new Sprite(), 0);
		this._idleAnimation = this.addChild(new LightningSpecterIdleAnimation(this._backContainer));
		this._idleAnimation.zIndex = 20;
		this._idleAnimation.position.set(0, -40);
		this._idleAnimation.once(LightningSpecterIdleAnimation.EVENT_ON_ANIMATION_ENDED, this._onIdleAnimationEnded, this);
		this._idleAnimation.startAnimation();
	}

	_onIdleAnimationEnded()
	{
		this._destroyIdleAnimation();
	}

	_startSpecterAppearing()
	{
		if (this.spineView) this.spineView.visible = false;
		this.container.visible = true;

		this._appearAnimation = this.container.addChild(new LightningSpecterAppearAnimation());
		this._appearAnimation.zIndex = 20;
		this._appearAnimation.position.set(0, 0);
		this._appearAnimation.once(LightningSpecterAppearAnimation.EVENT_ON_ANIMATION_ENDED, this._onAppearAnimationEnded, this);
		this._appearAnimation.once(LightningSpecterAppearAnimation.EVENT_ON_SPECTER_APPEAR_REQUIRED, this._onSpecterAppearRequired, this);
		this._appearAnimation.startAnimation();
	}

	_onSpecterAppearRequired()
	{
		this.spineView.visible = true;

		this._riseEnemy();

		APP.gameScreen.gameField.shakeTheGround("plasma");
	}

	_onFinishAppearing()
	{
		super._onFinishAppearing();

		this._startSpecterIdle();
	}

	get _riseTime()
	{
		return 10*FRAME_RATE;
	}

	_onAppearAnimationEnded()
	{
		this._destroyAppearAnimation();
	}

	_playDeathFxAnimation()
	{
		this._onDisappearingStarted();

		if (this._fIsDeathFxPlayed_bl) return;

		this._fIsDeathFxPlayed_bl = true;
		this._fIsDeathFxFinished_bl = false;

		if (this.isDeathActivated && this.deathReason != 1)
		{
			this._playWiggle();
		}
		else
		{
			this._destroyIdleAnimation();
			if (this.spineView) this.spineView.visible = false;
			this.emit(Enemy.EVENT_ON_ENEMY_IS_HIDDEN);
			this._startNoDeathExplodeAnimation();
		}
	}

	_startSpecterDisappear()
	{
		this._onDisappearingStarted();
		this._idleAnimation && this._idleAnimation.finishLightningsAnimations();

		this._disappearAnimation = this.container.addChild(new LightningSpecterKillAnimation());
		APP.gameScreen.gameField.rageImpactOnOtherEnemies(this.id);
		this._disappearAnimation.zIndex = 20;
		this._disappearAnimation.position.set(0, -40);
		this._disappearAnimation.once(LightningSpecterDisappearAnimation.EVENT_ON_SPECTER_HIDE_REQUIRED, this._onSpecterHideRequired, this);
		this._disappearAnimation.once(LightningSpecterDisappearAnimation.EVENT_ON_ANIMATION_ENDED, this._onDisappearAnimationEnded, this);
		this._disappearAnimation.i_startAnimation();
	}

	_onSpecterHideRequired()
	{
		this._hideSpecter()
	}

	_playWiggle()
	{
		let l_seq = [
			{ tweens: [{ prop: 'position.x', to: 2 }, { prop: 'position.y', to: -1 }], duration: 1 * FRAME_RATE },
			{ tweens: [{ prop: 'position.x', to: 0 }, { prop: 'position.y', to: 1 }], duration: 1 * FRAME_RATE },
			{ tweens: [{ prop: 'position.x', to: -2 }, { prop: 'position.y', to: -2 }], duration: 1 * FRAME_RATE },
			{ tweens: [{ prop: 'position.x', to: -4 }, { prop: 'position.y', to: 1 }], duration: 1 * FRAME_RATE },
			{ tweens: [{ prop: 'position.x', to: -5 }, { prop: 'position.y', to: 6 }], duration: 1 * FRAME_RATE },
			{ tweens: [{ prop: 'position.x', to: 5 }, { prop: 'position.y', to: -3 }], duration: 1 * FRAME_RATE },
			{ tweens: [{ prop: 'position.x', to: 0 }, { prop: 'position.y', to: 1 }], duration: 1 * FRAME_RATE },
			{ tweens: [{ prop: 'position.x', to: -7 }, { prop: 'position.y', to: -2 }], duration: 1 * FRAME_RATE },
			{ tweens: [{ prop: 'position.x', to: 10 }, { prop: 'position.y', to: -5 }], duration: 1 * FRAME_RATE },
			{ tweens: [{ prop: 'position.x', to: -2 }, { prop: 'position.y', to: 4 }], duration: 1 * FRAME_RATE },
			{ tweens: [{ prop: 'position.x', to: -10 }, { prop: 'position.y', to: 8 }], duration: 1 * FRAME_RATE },
			{ tweens: [{ prop: 'position.x', to: 3 }, { prop: 'position.y', to: -4 }], duration: 1 * FRAME_RATE, 
				onfinish: ()=>
				{
					this._startSpecterDisappear();
					this.spineView && Sequence.destroy(Sequence.findByTarget(this.spineView));
				}
			}
		];

		Sequence.start(this.spineView, l_seq);
	}

	_hideSpecter()
	{
		this._idleAnimation && this._idleAnimation.finishAurasAnimations();

		if (this.spineView) this.spineView.visible = false;
		this.emit(Enemy.EVENT_ON_ENEMY_IS_HIDDEN);
	}

	_onDisappearAnimationEnded()
	{
		this._destroyDisappearAnimation();
		this._fIsDeathFxFinished_bl = true;

		this.onDeathFxAnimationCompleted();
		this._onDisappearingEnded();
	}

	_destroyAppearAnimation()
	{
		if (this._appearAnimation)
		{
			this._appearAnimation.off(LightningSpecterAppearAnimation.EVENT_ON_ANIMATION_ENDED, this._onAppearAnimationEnded, this);
			this._appearAnimation.off(LightningSpecterAppearAnimation.EVENT_ON_SPECTER_APPEAR_REQUIRED, this._onSpecterAppearRequired, this);
			this._appearAnimation.destroy();
			this._appearAnimation = null;
		}
	}

	_destroyIdleAnimation()
	{
		if (this._idleAnimation)
		{
			this._idleAnimation.off(LightningSpecterIdleAnimation.EVENT_ON_ANIMATION_ENDED, this._onIdleAnimationEnded, this);
			this._idleAnimation.destroy();
			this._idleAnimation = null;
		}
	}

	_destroyDisappearAnimation()
	{
		if (this._disappearAnimation)
		{
			this._disappearAnimation.off(LightningSpecterDisappearAnimation.EVENT_ON_ANIMATION_ENDED, this._onDisappearAnimationEnded, this);
			this._disappearAnimation.off(LightningSpecterDisappearAnimation.EVENT_ON_SPECTER_HIDE_REQUIRED, this._onSpecterHideRequired, this);
			this._disappearAnimation.destroy();
			this._disappearAnimation = null;
		}
	}

	destroy(purely)
	{
		if (!this._fIsDeathFxPlayed_bl && !purely)
		{
			this.visible = true;
			this._playDeathFxAnimation();
			return;
		}

		if (!this._fIsDeathFxFinished_bl && !purely)
		{
			return;
		}

		this.spineView && Sequence.destroy(Sequence.findByTarget(this.spineView));

		this._destroyAppearAnimation();
		this._destroyIdleAnimation();
		this._destroyDisappearAnimation();

		this._fNoDeathExplode_spr = null;

		super.destroy(purely);
	}

	tick()
	{
		super.tick();

		//EFFECTS TRANSPARENCY VALIDATION WHEN FROZEN|UNFROZEN...
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
			if(this._idleAnimation) this._idleAnimation.alpha = lEffectsAlphaMultiplier_num;
			if(this._backContainer) this._backContainer.alpha = lEffectsAlphaMultiplier_num;
		}
		else
		{
			if(this._idleAnimation) this._idleAnimation.alpha *= lEffectsAlphaMultiplier_num;
			if(this._backContainer) this._backContainer.alpha *= lEffectsAlphaMultiplier_num;
		}
		//...EFFECTS TRANSPARENCY VALIDATION WHEN FROZEN|UNFROZEN
	}
}

export default LightningSpecterEnemy;