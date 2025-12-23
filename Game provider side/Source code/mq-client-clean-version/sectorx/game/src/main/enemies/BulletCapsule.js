import Capsule from "./Capsule";
import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../shared/src/CommonConstants';
import Sequence from '../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import * as Easing from '../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import Enemy from "./Enemy";
import BulletCapsuleDeathAnimation from "../animation/death/BulletCapsuleDeathAnimation";
import { BulgePinchFilter } from '../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Filters';

class BulletCapsule extends Capsule
{
	constructor(params)
	{
		super(params);

		this._fBulletCapsuleDeathAnimation_bcda = null;
		this._fCirle_spr = null;
		this._fBlowFilter_bpf = null;
		this._fBulletCapsuleDeathAnimation_bcda = new BulletCapsuleDeathAnimation();
	}

	//override
	_playDeathFxAnimation(aIsInstantKill_bl)
	{
		this._fBulletCapsuleDeathAnimation_bcda.on(BulletCapsuleDeathAnimation.EVENT_ON_ANIMATION_END, this._onBulletCapsuleDeathAnimationFinish, this);

		if (aIsInstantKill_bl)
		{
			this._fBulletCapsuleDeathAnimation_bcda.off(BulletCapsuleDeathAnimation.EVENT_ON_ANIMATION_END, this._onBulletCapsuleDeathAnimationFinish, this);
			this._fBulletCapsuleDeathAnimation_bcda = null;
		}

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startBlowingAnimation();
		}

		if (this.isDeathActivated && this.deathReason != 1)
		{
			const lDathAnimSeq_arr = [
				{
					tweens: [], duration: 10 * FRAME_RATE, onfinish: () =>
					{
						this._startDeathCircleAnimation();

						if (this._fBulletCapsuleDeathAnimation_bcda)
						{
							this._fBulletCapsuleDeathAnimation_bcda.startAnimation(this.position, this.id);
						}
					}
				},
				{
					tweens: [], duration: 3 * FRAME_RATE, onfinish: () =>
					{
						this.spineView.visible = false;
						this.shadow.visible = false;
						APP.gameScreen.bulletCapsuleFeatureController.startAnimation(this.position, this.id);
					}
				}
			];
			Sequence.start(this, lDathAnimSeq_arr);
		}
		else
		{
			const lDeathDelayAnimSeq_arr = [
				{
					tweens: [], duration: 1 * FRAME_RATE, onfinish: () => { this._tryToFinishDeathAnimation(); }
				}
			];

			Sequence.start(this, lDeathDelayAnimSeq_arr);
		}
	}

	_onBulletCapsuleDeathAnimationFinish()
	{
		this._fBulletCapsuleDeathAnimation_bcda && this._fBulletCapsuleDeathAnimation_bcda.off(BulletCapsuleDeathAnimation.EVENT_ON_ANIMATION_END, this._onBulletCapsuleDeathAnimationFinish, this);
		this._fBulletCapsuleDeathAnimation_bcda = null;
		this._tryToFinishDeathAnimation();
	}

	_startBlowingAnimation()
	{
		this._fBlowFilter_bpf = new BulgePinchFilter();
		this.container.filters = this.container.filters || [];

		this._fBlowFilter_bpf.resolution = APP.stage.renderer.resolution;
		this._fBlowFilter_bpf.uniforms.center = [0.46, 0.33];
		this._fBlowFilter_bpf.uniforms.radius = 77;
		this._fBlowFilter_bpf.uniforms.strength = 0;

		let lAlphaFilter = new PIXI.filters.AlphaFilter();
		lAlphaFilter.resolution = APP.stage.renderer.resolution;
		this.container.filters = this.container.filters.concat([this._fBlowFilter_bpf, lAlphaFilter]);
		let lBlowing_seq = [
			{
				tweens: [{ prop: 'uniforms.strength', to: 0.91 }],
				duration: 10 * FRAME_RATE,
				onfinish: () =>
				{
					if (this.container)
					{
						this.container.filters = null;
					}
					Sequence.destroy(Sequence.findByTarget(this._fBlowFilter_bpf));
					this._fBlowFilter_bpf = null;
					this.spineView.visible = false;
					this._tryToFinishDeathAnimation();
				}
			}
		];
		Sequence.start(this._fBlowFilter_bpf, lBlowing_seq);
	}

	_startDeathCircleAnimation()
	{
		this._fCirle_spr = this.addChildAt(APP.library.getSprite("enemies/bullet_capsule/circle"), 0);
		this._fCirle_spr.blendMode = PIXI.BLEND_MODES.SCREEN;
		this._fCirle_spr.alpha = 0.8;
		this._fCirle_spr.scale.set(0);

		const lAlphaSeq_arr = [
			{ tweens: [], duration: 15 * FRAME_RATE },
			{ tweens: [{ prop: "alpha", to: 0 }], duration: 8 * FRAME_RATE }
		];
		Sequence.start(this._fCirle_spr, lAlphaSeq_arr);

		const lScaleSeq_arr = [
			{ tweens: [], duration: 1 * FRAME_RATE },
			{ tweens: [{ prop: 'scale.x', to: 8.44 }, { prop: 'scale.y', to: 8.44 }], duration: 13 * FRAME_RATE, ease: Easing.quartic.easeIn }, //4.22*2
			{
				tweens: [{ prop: 'scale.x', to: 14.92 }, { prop: 'scale.y', to: 14.92 }], duration: 15 * FRAME_RATE, ease: Easing.cubic.easeOut, onfinish: () => //7.46*2 
				{
					this._fCirle_spr && Sequence.destroy(Sequence.findByTarget(this._fCirle_spr));
					this._fCirle_spr = null;
					this._tryToFinishDeathAnimation();
				}
			},
		];
		Sequence.start(this._fCirle_spr, lScaleSeq_arr);
	}

	_tryToFinishDeathAnimation()
	{
		if (!this._fCirle_spr &&
			!this._fBlowFilter_bpf &&
			!this._fBulletCapsuleDeathAnimation_bcda)
		{
			this.emit(Enemy.EVENT_ON_DEATH_COIN_AWARD);
			super.onDeathFxAnimationCompleted();
		}
	}

	get __maxCrosshairDeviationOnEnemyX() //maximum deviation in X position of the cursor on the body of the enemy
	{
		return 52;
	}

	get __maxCrosshairDeviationOnEnemyY() //maximum deviation in Y position of the cursor on the body of the enemy
	{
		return 65;
	}

	//override
	destroy(purely)
	{
		Sequence.destroy(Sequence.findByTarget(this));

		this._fBulletCapsuleDeathAnimation_bcda && this._fBulletCapsuleDeathAnimation_bcda.off(BulletCapsuleDeathAnimation.EVENT_ON_ANIMATION_END, this._tryToFinishDeathAnimation, this)
		this._fBulletCapsuleDeathAnimation_bcda = null;

		this._fCirle_spr && Sequence.destroy(Sequence.findByTarget(this._fCirle_spr));
		this._fCirle_spr = null;

		Sequence.destroy(Sequence.findByTarget(this._fBlowFilter_bpf));
		this._fBlowFilter_bpf = null;

		super.destroy(purely);
	}
}

export default BulletCapsule;