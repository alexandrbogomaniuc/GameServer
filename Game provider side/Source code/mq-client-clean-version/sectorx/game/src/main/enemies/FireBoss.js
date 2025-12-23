import BossEnemy from './BossEnemy';
import Timer from '../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import { FRAME_RATE } from '../../../../shared/src/CommonConstants';
import FireElementAnimation from '../../main/animation/boss_mode/fire/FireElementAnimation';
import BottomFlare from '../../main/animation/boss_mode/fire/BottomFlare';
import TopFire from '../../main/animation/boss_mode/fire/TopFire';
import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { Tween } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import { STATE_SPAWN } from './Enemy';
import Sprite from '../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';

const FIRE_PARTICLES_NAMES = [
	"fire01",
	"fire03",
	"fire05",
	"fire07",
	"fire02",
	"fire04",
	"fire06",
	"fire08",
]

class FireBoss extends BossEnemy
{
	constructor(params)
	{
		super(params);

		this._fIsOnSpawnActionRequired_bl = true;
		this._fAppearingFireElementTimer_t = null;
		this._fFireElement_spr = null;
		this._fBottomFlayer_spr = null;
		this._fTopFire_spr = null;
		this._fSloteTween_arr = [];
		this._fIsNeedIntroBottomFlareAnimation_bl = null;
	}

	// override
	__freeze(aIsAnimated_bl=true)
	{
		super.__freeze(aIsAnimated_bl);

		this._hideFireParticles();
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			if (aIsAnimated_bl)
			{
				this.topFire.stopAnimation();
				this.fireElement.stopAnimation();
				this.bottomFlayer.stopAnimation();
			}
			
			this.topFire.hide();
			this.fireElement.hide();
			this.bottomFlayer.hide();
		}
	}

	// override
	__unfreeze(aIsAnimated_bl=true, aIsDeathAnimation_bl=false)
	{
		super.__unfreeze(aIsAnimated_bl, aIsDeathAnimation_bl);

		if (aIsDeathAnimation_bl)
		{
			// Don't need to resume animation if boss dies
			return;
		}

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this.topFire.show();
			this.fireElement.show();
			this.bottomFlayer.show();

			if (aIsAnimated_bl)
			{
				// Wait for ice to melt before resuming
				this.once(FireBoss.EVENT_ON_FINISH_ICE_MELT, () => {
					this._showFireParticles(true);
					this._initConstantEffects();
				});
				return;
			}
		}

		this._showFireParticles(true);
		APP.profilingController.info.isVfxProfileValueMediumOrGreater && this._initConstantEffects();
	}

	_initView()
	{
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._initBottomFlayer();
			this._initFireElement();
		}

		super._initView();

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._initTopFire();
		}
	}

	_invalidateStates()
	{
		this._invalidateFireBossState();
	}

	//override
	showBossAppearance()
	{
		this._fIsNeedIntroBottomFlareAnimation_bl = true;
		super.showBossAppearance();
	}

	_changeDirection()
	{
		if (this.state == STATE_SPAWN)
		{
			this.spineView.view.scale.x = 1;
		}
		else
		{
			super._changeDirection();
		}
	}

	_onSpawnAnimationCompleted()
	{
		super._onSpawnAnimationCompleted();
		this._showFireParticles();
	}

	skipBossAppearance()
	{
		super.skipBossAppearance();
		this._showFireParticles(true);
	}

	_hideFireParticles()
	{
		if (!this.spineView || !this.spineView.view || !this.spineView.view.skeleton) return;
		FIRE_PARTICLES_NAMES.forEach(slotName => this.spineView.view.skeleton.findSlot(slotName).currentSprite.alpha = 0);
	}

	_showFireParticles(aIsSkipAnimation_bl = false)
	{
		FIRE_PARTICLES_NAMES.forEach(slotName =>
		{
			const lSlotSprite_spr = this.spineView.view.skeleton.findSlot(slotName).currentSprite;
			if (aIsSkipAnimation_bl)
			{
				lSlotSprite_spr.alpha = 1;
			}
			else
			{
				const lSlotTween_t = new Tween(lSlotSprite_spr, "alpha", 0, 1, 10 * FRAME_RATE);
				this._fSloteTween_arr.push(lSlotTween_t);
				lSlotTween_t.play();
			}
		});
	}

	_invalidateFireBossState()
	{
		if (this.isLasthand)
		{
			APP.profilingController.info.isVfxProfileValueMediumOrGreater && this._initConstantEffects();
			this._showFireParticles(true);
		}
		else
		{
			APP.profilingController.info.isVfxProfileValueMediumOrGreater && this._startAppearingEffects();
			this._hideFireParticles();
		}
	}

	_initConstantEffects()
	{
		if (this.container)
		{
			this._startFireElement();
			this._startBottomFlayer(true);
			this._startTopFire();
		}
	}

	_startAppearingEffects()
	{
		this._fAppearingFireElementTimer_t = new Timer(() =>
		{
			if (this.container)
			{
				this._startFireElement();
				this._startBottomFlayer();
				this._startTopFire();
			}
			this._fAppearingFireElementTimer_t && this._fAppearingFireElementTimer_t.destructor();
			this._fAppearingFireElementTimer_t = null;
		}, 35 * FRAME_RATE);
	}

	get fireElement()
	{
		return this._fFireElement_spr || this._initFireElement();
	}

	_initFireElement()
	{
		this._fFireElement_spr = this.container.addChild(new FireElementAnimation());
		this._fFireElement_spr.position.set(0, -200);
		this._fFireElement_spr.zIndex = 1
		return this._fFireElement_spr;
	}

	_startFireElement()
	{
		this.fireElement.startAnimation();
	}

	get bottomFlayer()
	{
		return this._fBottomFlayer_spr || this._initBottomFlayer();
	}

	_initBottomFlayer()
	{
		this._fBottomFlayer_spr = this.container.addChild(new BottomFlare());
		this._fBottomFlayer_spr.position.set(-12, -77);
		this._fBottomFlayer_spr.zIndex = 0;
		return this._fBottomFlayer_spr;
	}

	_startBottomFlayer(aIsLastHand = false)
	{
		this.bottomFlayer.startAnimation(aIsLastHand || !this._fIsNeedIntroBottomFlareAnimation_bl);
		this._fIsNeedIntroBottomFlareAnimation_bl = false;
	}

	get topFire()
	{
		return this._fTopFire_spr || this._initTopFire();
	}

	_initTopFire()
	{
		this._fTopFire_spr = this._fTopContainer_sprt.addChild(new TopFire());
		this._fTopFire_spr.position.set(-17, 8);
		this._fTopFire_spr.zIndex = 1000;
		return this._fTopFire_spr;
	}

	_startTopFire()
	{
		this.topFire.startAnimation();
	}

	getSpineSpeed()
	{
		return this.speed * 0.22;
	}

	setSpineViewPos()
	{
		let pos = { x: 0, y: 0 };
		this.spineViewPos = pos;
	}

	getScaleCoefficient()
	{
		return 0.7;
	}

	//override
	get _customSpineTransitionsDescr()
	{
		return [
			{ from: "spawn", to: "walk", duration: 0.5 },
			{ from: "walk", to: "dead", duration: 0.5 }
		];
	}

	getLocalCenterOffset()
	{
		let pos = { x: 0, y: -98 };
		return pos;
	}
	
	_getHitRectHeight()
	{
		return 350;
	}


	_getHitRectWidth()
	{
		return 250;
	}

	_playBossDeathFxAnimation()
	{
		this._fFireElement_spr && this._fFireElement_spr.stopAnimation();
		this._fBottomFlayer_spr && this._fBottomFlayer_spr.stopAnimation();
		this._fTopFire_spr && this._fTopFire_spr.stopAnimation();

		super._playBossDeathFxAnimation();
	}

	get __maxCrosshairDeviationOnEnemyX() //maximum deviation in X position of the cursor on the body of the enemy
	{
		return 56;
	}

	get __maxCrosshairDeviationOnEnemyY() //maximum deviation in Y position of the cursor on the body of the enemy
	{
		return 96;
	}
	
	get __maxCrosshairDeviationTwoOnEnemyX()
	{
		return 114;
	}

	get __maxCrosshairDeviationTwoOnEnemyY()
	{
		return 56;
	}

	tick()
	{
		super.tick();

		if(this._fIsOnSpawnActionRequired_bl)
		{
			this._fIsOnSpawnActionRequired_bl = false;
			
			if(
				this.trajectory &&
				this.trajectory.points &&
				this.trajectory.points[0] &&
				(APP.gameScreen.currentTime > this.trajectory.points[0].time + 1000)
				|| this.isLasthand
			)
			{
				this._fIsLasthand_bl = false;
				return;
			}
		}
	}

	destroy(purely = false)
	{
		for (let i = 0; i < this._fSloteTween_arr.length; i++)
		{
			this._fSloteTween_arr[i] && Tween.destroy(Tween.findByTarget(this._fSloteTween_arr[i]));
		}

		this._fSloteTween_arr = [];

		this._fAppearingFireElementTimer_t && this._fAppearingFireElementTimer_t.destructor();
		this._fAppearingFireElementTimer_t = null;

		this._fFireElement_spr && this._fFireElement_spr.destroy();
		this._fBottomFlayer_spr && this._fBottomFlayer_spr.destroy();
		this._fTopFire_spr && this._fTopFire_spr.destroy();
		this._fFireElement_spr = null;
		this._fBottomFlayer_spr = null;
		this._fTopFire_spr = null;
		this._fIsNeedIntroBottomFlareAnimation_bl = null;

		super.destroy(purely);
	}
}

export default FireBoss;