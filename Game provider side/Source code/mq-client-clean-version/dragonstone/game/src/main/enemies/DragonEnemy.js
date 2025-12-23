import { Sprite } from '../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import { FRAME_RATE } from '../../../../shared/src/CommonConstants';
import BossEnemy from './BossEnemy';
import Enemy, { DIRECTION } from './Enemy';
import Sequence from '../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import * as Easing from '../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { Utils } from '../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import DragonFireAnimation from './../animation/DragonFireAnimation';
import BossDeathFxAnimation from './../../view/uis/custom/bossmode/death/BossDeathFxAnimation';
import Timer from '../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import DragonDamagePartsAnimation from '../../view/uis/custom/bossmode/damage/DragonDamagePartsAnimation';
import DragonDamageFlameAnimation from '../../view/uis/custom/bossmode/damage/DragonDamageFlameAnimation';
import { DRAGON_DAMAGE_FLARE_TYPES } from '../../view/uis/custom/bossmode/damage/DragonDamageFlameAnimation';

const DRAGON_SPINE_ANIMATION_FINAL_POINT = 2.6537491136779776;

const TOTAL_DRAGON_DISAPPEAR_TIME = 200 * FRAME_RATE;
const DRAGON_IDLE_CYCLE_PARTS = [
	{ x: NaN, y: NaN, duration: 20 * FRAME_RATE },
	{ x: -140, y: 112, duration: 110 * FRAME_RATE },
	{ x: 140, y: -63, duration: 150 * FRAME_RATE },
	{ x: 0, y: 0, duration: 110 * FRAME_RATE }
];

const MOUTH_OPEN_ANIM_TIME_INTERVALS = { start: 0.7, end: 0.8 };

export const DRAGON_HEALTH_STATES =
{
	STATE_0: { name: "STATE_0", bossNumberShots: 0, flamesAmount: 0 },
	STATE_1: { name: "STATE_1", bossNumberShots: 81, flamesAmount: 1 },
	STATE_2: { name: "STATE_2", bossNumberShots: 181, flamesAmount: 2 },
	STATE_3: { name: "STATE_3", bossNumberShots: 301, flamesAmount: 4 },
	STATE_4: { name: "STATE_4", bossNumberShots: 451, flamesAmount: 5 }
}

const DAMAGE_FLAMES = [
	{ id: 0, type: DRAGON_DAMAGE_FLARE_TYPES.TYPE_1, delay: 0, boneName: "body2", scale: { x: 1.1, y: 1.1 }, offsetX: 11, offsetY: -7, offsetR: -50},
	{ id: 1, type: DRAGON_DAMAGE_FLARE_TYPES.TYPE_3, delay: 14 * FRAME_RATE, boneName: "arm_lf", scale: { x: -1, y: -1.15 }, offsetX: -14, offsetY: -33, offsetR: -60 },
	/* { id: 2, type: DRAGON_DAMAGE_FLARE_TYPES.TYPE_1, delay: 0, boneName: "body2", scale: { x: 0.95, y: 0.45 }, offsetX: 0, offsetY: 0, offsetR: 0 }, */
	{ id: 2, type: DRAGON_DAMAGE_FLARE_TYPES.TYPE_2, delay: 12 * FRAME_RATE, boneName: "body2", scale: { x: 0.65, y: 0.45 }, offsetX: -21, offsetY: 19, offsetR: -29 },
	{ id: 3, type: DRAGON_DAMAGE_FLARE_TYPES.TYPE_1, delay: 0, boneName: "body2", scale: { x: 0.65, y: 0.35 }, offsetX: 29, offsetY: 0, offsetR: -16 },
	{ id: 4, type: DRAGON_DAMAGE_FLARE_TYPES.TYPE_2, delay: 12 * FRAME_RATE, boneName: "arm_rt", scale: { x: 1, y: 0.95 }, offsetX: 21, offsetY: 1, offsetR: -154 },
]

class DragonEnemy extends BossEnemy
{
	static get EVENT_ON_DRAGON_DISAPPEARED() { return "onDragonDisappeared"; }

	constructor(params)
	{
		super(params);

		this._fIsFlightSoundRequiredOnTime_bl = false;
		this._fIsDragonGrowlRequired_bl = true;
		this._fIsShadowFlight_bl = false;

		this._fIsNeedPreapareForBossAppearance_bl = params.isNeedPrepareForBossAppearance;
		this._fIsNeedBossHideBeforeShadowAnimationOnLastHand_bl = params.isNeedBossHideOnIntro;
		this._fNeedBossHideOnFirstAnimationOnLastHandAppearance_bl = params.isFirstAnimationAppearance;

		if (this._fHealthState_obj === undefined)
		{
			this._fHealthState_obj = DRAGON_HEALTH_STATES.STATE_0;
		}

		if (this._fNeedBossHideOnFirstAnimationOnLastHandAppearance_bl)
		{
			this._resetMovementDelta();
			this._bossMovementDelta = { x: 480 + 140, y: -270 - 60 };
		}

		if (this._fIsNeedPreapareForBossAppearance_bl)
		{
			this.prepareForBossAppearance();
		}

		this._fLastImpactPosition_p = null;
		this.onBossShadowTime.bind(this);
	}


	__generatePreciseCollisionBodyPartsNames()
	{
		return [
			"wing",
			"WING",
			"tail",
			];
	}

	_initView()
	{
		super._initView();
	}

	_invalidateStates()
	{
		this._invalidateHealthState(true);

		if (this._fIsLasthand_bl && !this._fIsNeedPreapareForBossAppearance_bl)
		{
			this.setWalk();
			this._onBossAppear();
			this._checkForDisappearing();
		}

		super._invalidateStates();
	}

	_invalidateHealthState(aImmediately_bl = false, aImpactPosition_p = undefined)
	{
		let lCurHealthState = this._fHealthState_obj;

		let lNewHealthState = this._findHealthState(APP.currentWindow.bossModeController.bossNumberShots);

		if (!lCurHealthState || lCurHealthState.name != lNewHealthState.name)
		{
			let lImpactPosition_p = aImpactPosition_p;
			if (this._fLastImpactPosition_p)
			{
				lImpactPosition_p = this._fLastImpactPosition_p;
				this._fLastImpactPosition_p = null;
			}
			this._fHealthState_obj = lNewHealthState;
			this._updateHealthStateView(aImmediately_bl, lImpactPosition_p);
		}
	}

	_findHealthState(aBossNumberShots_num)
	{
		let lSortedStates = [];
		for (let prop in DRAGON_HEALTH_STATES)
		{
			lSortedStates.push(DRAGON_HEALTH_STATES[prop]);
		}

		lSortedStates.sort((a, b) => a.bossNumberShots >= b.bossNumberShots);

		for (let i = 0; i < lSortedStates.length - 1; i++)
		{
			if (aBossNumberShots_num >= lSortedStates[i].bossNumberShots && aBossNumberShots_num < lSortedStates[i + 1].bossNumberShots)
			{
				return lSortedStates[i];
			}
		}

		return DRAGON_HEALTH_STATES.STATE_4;
	}

	_updateHealthStateView(aImmediately_bl, aImpactPosition_p = undefined)
	{
		if (!!aImpactPosition_p)
		{
			this._showDragonPartsAnimation(aImpactPosition_p);
		}

		this._showHealthFlames(aImmediately_bl);
	}

	_showHealthFlames(aImmediately_bl)
	{
		this._fHealthFlames_obj_arr = this._fHealthFlames_obj_arr || [];
		this._healthFlamesContainer = this._healthFlamesContainer || this.container.addChild(new Sprite);

		let flCont = this._healthFlamesContainer;
		flCont.zIndex = this.spineView.zIndex + 1;

		let lHealthState = this._fHealthState_obj;
		let lRequiredFlamesAmount = lHealthState.flamesAmount;

		for (let i = flCont.children.length; i < lRequiredFlamesAmount; i++)
		{
			let lFlameDescr = DAMAGE_FLAMES[i];

			let lFlame = flCont.addChild(new DragonDamageFlameAnimation(lFlameDescr.type))
			lFlame.scale.set(lFlameDescr.scale.x, lFlameDescr.scale.y);
			
			lFlame.rotation = Utils.gradToRad(this.spineView.view.skeleton.findBone(lFlameDescr.boneName).rotation + lFlameDescr.offsetR);
			let lBoneName = lFlameDescr.boneName;

			this._fHealthFlames_obj_arr.push({ id: lFlameDescr.id, boneName: lBoneName, flame: lFlame });

			let lDelay = aImmediately_bl ? 0 : lFlameDescr.delay;
			lFlame.startAnimation(lDelay);
		}
	}

	_correctDamageFlames()
	{
		this._invalidateHealthState(true);

		if (!this._healthFlamesContainer)
		{
			return;
		}

		this._fHealthFlames_obj_arr && this._fHealthFlames_obj_arr.forEach((l_obj) =>
		{
			for (let i = 0; i < this.spineView.view.skeleton.bones.length; i++)
			{
				if (this.spineView.view.skeleton.bones[i].data.name == l_obj.boneName)
				{
					const lFlameDescr_obj = this._getFlameDescrById(l_obj.id);
					l_obj.flame.position.set(this.spineView.view.skeleton.bones[i].worldX * 0.4 + lFlameDescr_obj.offsetX, this.spineView.view.skeleton.bones[i].worldY * 0.4 + lFlameDescr_obj.offsetY);
				}
			}
		});
	}

	_getFlameDescrById(aId_num)
	{
		return DAMAGE_FLAMES.find((a_obj) => {
			if (a_obj.id == aId_num)
			{
				return true;
			}
		});
	}

	_showDragonPartsAnimation(aImpactPosition_p)
	{
		let lDragonPartsAnimation = this.container.addChild(new DragonDamagePartsAnimation());
		lDragonPartsAnimation.zIndex = this.spineView.zIndex + 2;

		let lAngle_num = Utils.random(0, 120);
		lDragonPartsAnimation.rotation = Utils.gradToRad(lAngle_num);

		let lPos_p = lDragonPartsAnimation.parent.globalToLocal(aImpactPosition_p.x, aImpactPosition_p.y);
		lDragonPartsAnimation.position.set(lPos_p.x, lPos_p.y);

		lDragonPartsAnimation.startAnimation();
	}

	rememberImpactPosition(aImpactPosition_p)
	{
		this._fLastImpactPosition_p = aImpactPosition_p;
	}

	setImpact(aImpactPosition_p)
	{
		this.rememberImpactPosition(aImpactPosition_p)

		super.setImpact(aImpactPosition_p);
	}

	_startLightningSpecterFeature()
	{
		return;
	}

	getImageName()
	{
		return 'enemies/dragon/Dragon';
	}

	getSpineSpeed()
	{
		return 0.5;
	}

	_getPossibleDirections()
	{
		return [0];
	}

	_calculateDirection()
	{
		return DIRECTION.LEFT_DOWN;
	}

	_calcWalkAnimationName()
	{
		return 'Fly';
	}

	_calculateAnimationName()
	{
		return 'Fly';
	}

	_generateShadowView()
	{
		return new Sprite();
	}

	changeZindex()
	{
		super.changeZindex();

		this.zIndex += 500;
	}

	onBossShadowTime(aFullShadowDuration, aRestShadowDuration)
	{
		this._fIsNeedBossHideBeforeShadowAnimationOnLastHand_bl = false;

		this._resetMovementDelta();
		this._startBossShadowAppear(aFullShadowDuration, aRestShadowDuration);

		if (this.spineView && this.spineView.view)
		{
			this.spineView.view.scale.x = -1;
		}
		
		this.setWalk();	
	}

	onBossAppearanceTime()
	{
		this._resetMovementDelta();
		this._startBossAppear();

		this.setWalk();

		this.emit(BossEnemy.EVENT_ON_BOSS_ENEMY_APPEARANCE_TIME);
	}

	onDisappearTime()
	{
		if (!this._fBossAppearanceInProgress_bln)
		{
			this._startDisappearing();
		}
		else
		{
			this._fStartDisappearAfterAppeare_bln = true;
		}
	}

	_startDisappearing()
	{
		this._fFlyOutMouthTimer_t && this._fFlyOutMouthTimer_t.destructor();

		let currentTime = APP.gameScreen.currentTime;
		let p = this.trajectory.points[this.trajectory.points.length - 1];
		let endTime = p ? p.time : 0;
		let lRestDragonTime = (endTime - currentTime);
		let disappearExTime = TOTAL_DRAGON_DISAPPEAR_TIME - lRestDragonTime;
		this._disappearExTime = disappearExTime;

		this._fDisappearInProgress_bln = true;
		this._flyRightTopCorner();

		if (this._disappearExTime < TOTAL_DRAGON_DISAPPEAR_TIME / 2)
		{
			let lTimeToMouthOpen = 0;
			if (this.spineView && this.spineView.view && this.spineView.view.state && this.spineView.view.state.tracks)
			{
				let animTime = this.spineView.view.state.tracks[0].animationLast;
				let animDuration = this.spineView.view.state.tracks[0].animationEnd;
				let lSpineTimeScale = this.spineView.view.state.timeScale;

				if (animTime < MOUTH_OPEN_ANIM_TIME_INTERVALS.start)
				{
					lTimeToMouthOpen = ~~((MOUTH_OPEN_ANIM_TIME_INTERVALS.start - animTime) / lSpineTimeScale * 1000);
				}
				else if (animTime > MOUTH_OPEN_ANIM_TIME_INTERVALS.end)
				{
					lTimeToMouthOpen = ~~((animDuration - animTime + MOUTH_OPEN_ANIM_TIME_INTERVALS.start) / lSpineTimeScale * 1000);
				}
			}

			if (lTimeToMouthOpen > lRestDragonTime)
			{
				lTimeToMouthOpen = lRestDragonTime;
			}

			if (lTimeToMouthOpen == 0)
			{
				this.startFlyOutAnimation();
				this.startMouthFireAnimation();
			}
			else
			{
				this._fFlyOutMouthTimer_t = new Timer(() =>
				{
					this.startFlyOutAnimation();
					this.startMouthFireAnimation();
				}, lTimeToMouthOpen);
			}
		}
		else
		{
			this._disappearExTime -= TOTAL_DRAGON_DISAPPEAR_TIME / 2; // Skipped right top fly and mouth check
			this.startFlyOutAnimation();
			this.startMouthFireAnimation();
		}

		APP.gameScreen.bossModeController.onDisappearStartRequired(disappearExTime);
	}

	startFlyOutAnimation()
	{
		this._startBossDisappear();
	}

	startMouthFireAnimation()
	{
		this._dragonFire = this.container.addChild(new DragonFireAnimation());
		this._dragonFire.once(DragonFireAnimation.EVENT_ON_ANIMATION_FINISHED, this._onDragonFireAnimationFinished, this);
		this._dragonFire.position.set(-360, 260);

		this._gameField.onDragonFireBreathStarted();
	}

	_onDragonFireAnimationFinished()
	{
		this._dragonFire && this._dragonFire.destroy();
		this._dragonFire = null;
	}

	_correctFire()
	{
		if (this._dragonFire)
		{
			if (this.spineView && this.spineView.view && this.spineView.view.state && this.spineView.view.state.tracks)
			{
				let animTime = this.spineView.view.state.tracks[0].animationLast;
				if (animTime < 0.8)
				{
					this._dragonFire.position.set(-360, 260);
				}
				else if (animTime >= 0.8 && animTime <= 0.9)
				{
					this._dragonFire.position.set(-365, 275);
				}
				else if (animTime > 0.9)
				{
					this._dragonFire.position.set(-370, 290);
				}
			}
		}
	}

	_checkForDisappearing()
	{
		if (!this._fDisappearInProgress_bln && !APP.gameScreen.bossModeController.isDisappearAnimating && this.trajectory && this.trajectory.points)
		{
			let currentTime = APP.gameScreen.currentTime;
			let p = this.trajectory.points[this.trajectory.points.length - 1];
			let endTime = p ? p.time : 0;

			if (endTime - currentTime < TOTAL_DRAGON_DISAPPEAR_TIME)
			{
				this.onDisappearTime();
			}
		}
	}

	_hideMainView()
	{
		if (this.spineView && this.spineView.view)
		{
			for (let i = 1; i < this.spineView.view.children.length; ++i)
			{
				this.spineView.view.children[i].scale.set(0);
			}
		}
		this._healthFlamesContainer && (this._healthFlamesContainer.visible = false);
	}

	_showMainView()
	{
		if (this.spineView && this.spineView.view)
		{
			for (let i = 1; i < this.spineView.view.children.length; ++i)
			{
				this.spineView.view.children[i].scale.set(1);
			}
		}

		this._healthFlamesContainer && (this._healthFlamesContainer.visible = true);
	}

	_startBossShadowAppear(aFullShadowDuration, aRestShadowDuration)
	{
		if(!this.container) return;
		this._bossMovementDelta = { x: 0 - 220, y: -270 - 270 };
		this._bossMovementDelta.sequence = Sequence.start(this._bossMovementDelta, this._getShadowAppearanceSequence(aRestShadowDuration));

		if (aRestShadowDuration >= aFullShadowDuration/2)
		{
			APP.soundsController.play('mq_dragonstone_boss_dragon_shadow');
		}
		
		this._hideMainView();
		this.setWalk();
		this.updateOffsets();
	}

	_getShadowAppearanceSequence(aRestShadowDuration)
	{
		let lDuration = aRestShadowDuration;

		return [
			{
				tweens: [{ prop: "x", to: 480 + 190 }, { prop: "y", to: 270 + 180 }], duration: lDuration, ease: Easing.quadratic.easeInOut,
				onfinish: () => this._onShadowFinish()
			}
		];
	}

	_onShadowFinish()
	{
		this._fIsShadowFlight_bl = true;
		this._resetMovementDelta();
		this.prepareForBossAppearance();
		this.setStay();
	}

	_startBossAppear()
	{
		this._fIsNeedBossHideBeforeShadowAnimationOnLastHand_bl = false;
		this._fNeedBossHideOnFirstAnimationOnLastHandAppearance_bl = false;

		this._resetMovementDelta();

		this._bossMovementDelta = { x: 480 + 140, y: -270 - 60 };
		this._bossMovementDelta.sequence = Sequence.start(this._bossMovementDelta, this._appearanceSequence);

		this.container && this.updateOffsets();
	}

	get _appearanceSequence()
	{
		return [
			{
				tweens: [{ prop: "x", to: 0 }, { prop: "y", to: 0 }], duration: 90 * FRAME_RATE, ease: Easing.quadratic.easeInOut,
				onfinish: () => this._onBossAppear()
			}
		];
	}

	_onBossAppear()
	{
		super._onBossAppear();

		if (this._fStartDisappearAfterAppeare_bln)
		{
			this._startDisappearing();
			this._fStartDisappearAfterAppeare_bln = false;
		}
		else
		{
			this._startBossIdleFlying();
		}
	}

	_flyRightTopCorner()
	{
		this._resetMovementDelta();

		this._bossMovementDelta = {x: this.container.position.x, y: this.container.position.y};
		this._bossMovementDelta.sequence = Sequence.start(this._bossMovementDelta, this._rightTopCornerSeq);
	}

	get _rightTopCornerSeq()
	{
		return [
			{ tweens: [{ prop: "x", to: 200 }, { prop: "y", to: -90 }], duration: 80 * FRAME_RATE, ease: Easing.quadratic.easeInOut }
		];
	}

	_startBossIdleFlying()
	{
		let currentTime = APP.gameScreen.currentTime;
		let p = this.trajectory && this.trajectory.points[this.trajectory.points.length-1];
		let endTime = p ? p.time : 0;
		let restTrajectoryTime = endTime - currentTime;

		if (this._fDisappearInProgress_bln) return;

		if (restTrajectoryTime > TOTAL_DRAGON_DISAPPEAR_TIME)
		{
			this._resetMovementDelta();

			let idleSeq = this._calcIdleMovementSequence(restTrajectoryTime);
			if (idleSeq)
			{
				this._bossMovementDelta = {x: this.container.position.x, y: this.container.position.y};
				this._bossMovementDelta.sequence = Sequence.start(this._bossMovementDelta, idleSeq);
			}
		}
	}

	_calcIdleMovementSequence(restTrajectoryTime = 0)
	{
		let lRestIdleTrajectoryDuration = restTrajectoryTime/* - TOTAL_DRAGON_DISAPPEAR_TIME*/;

		if (lRestIdleTrajectoryDuration <= 0)
		{
			return null;
		}

		let lFullCycleDuration = this._idleMovementFullCycleDuration;
		let lCyclesAmount = ~~(lRestIdleTrajectoryDuration / lFullCycleDuration);
		let lCurCycleRestDuration = lRestIdleTrajectoryDuration - lCyclesAmount * lFullCycleDuration;
		if (lCurCycleRestDuration <= 0)
		{
			lCurCycleRestDuration = lFullCycleDuration;
		}

		let lSeq = [];
		let xOffset = Utils.random(-20, 20);
		let yOffset = Utils.random(-20, 20);
		for (let i = DRAGON_IDLE_CYCLE_PARTS.length - 1; i >= 0; i--)
		{
			if (lCurCycleRestDuration <= 0)
			{
				break;
			}

			let lCurPart = DRAGON_IDLE_CYCLE_PARTS[i];
			let lCurPartActualDuration = lCurCycleRestDuration > lCurPart.duration ? lCurPart.duration : lCurCycleRestDuration;
			let lCurSeqTween = { tweens: [], duration: lCurPartActualDuration, ease: Easing.quadratic.easeInOut };

			if (!isNaN(lCurPart.x))
			{
				let lCurOffsetX = lCurPart.x != 0 ? xOffset * (lCurPart.x < 0 ? -1 : 1) : 0;
				lCurSeqTween.tweens.push({ prop: "x", to: (lCurPart.x + lCurOffsetX) });
			}

			if (!isNaN(lCurPart.y))
			{
				let lCurOffsetY = lCurPart.y != 0 ? yOffset * (lCurPart.y < 0 ? -1 : 1) : 0;
				lCurSeqTween.tweens.push({ prop: "y", to: (lCurPart.y + lCurOffsetY) });
			}

			lSeq.unshift(lCurSeqTween);
			lCurCycleRestDuration -= lCurPartActualDuration;
		}

		if (lSeq.length > 0)
		{
			lSeq[lSeq.length - 1].onfinish = this._onIdleFlyingCycleCompleted.bind(this);
		}

		return lSeq;
	}

	_onIdleFlyingCycleCompleted()
	{
		this._startBossIdleFlying();
	}

	get _idleMovementFullCycleDuration()
	{
		let lDuration = 0;

		for (let i = 0; i < DRAGON_IDLE_CYCLE_PARTS.length; i++)
		{
			lDuration += DRAGON_IDLE_CYCLE_PARTS[i].duration;
		}

		return lDuration;
	}

	_startBossDisappear()
	{
		this._resetMovementDelta();

		this._bossMovementDelta = { x: this.container.position.x, y: this.container.position.y };

		if (this._disappearExTime > TOTAL_DRAGON_DISAPPEAR_TIME / 2)
		{
			let pathPercent = this._disappearExTime / (80 * FRAME_RATE);
			this._bossMovementDelta.x = this._bossMovementDelta.x + (-(480 + 220) - this._bossMovementDelta.x) * pathPercent;
			this._bossMovementDelta.y = this._bossMovementDelta.y + (270 + 160 - this._bossMovementDelta.y) * pathPercent;
		}

		this._bossMovementDelta.sequence = Sequence.start(this._bossMovementDelta, this._disappearanceSequence);
	}

	get _disappearanceSequence()
	{
		let time = 80 * FRAME_RATE - (this._disappearExTime || 0);
		if (time <= 0)
		{
			time = 1 * FRAME_RATE;
		}

		return [
			{
				tweens: [{ prop: "x", to: -(480 + 220) }, { prop: "y", to: 270 + 160 }], duration: time, ease: Easing.quadratic.easeIn,
				onfinish: () => this._onBossDisappear()
			}
		];
	}

	get _redVertexShader()
	{
		return `
		attribute vec2 aVertexPosition;
		attribute vec2 aTextureCoord;
		uniform mat3 projectionMatrix;
		varying vec2 vTextureCoord;

		void main(void)
		{
			gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
			vTextureCoord = aTextureCoord;
		}`;
	}

	get _redFragmentShader()
	{
		return `
		varying vec2 vTextureCoord;
		uniform sampler2D uSampler;
		uniform float intensity;

		void main(void)
		{
			vec4 c = texture2D(uSampler, vTextureCoord);

			if (c.a < 0.7)
			{
				return;
			}

			vec4 result;
			float add = intensity;
			result.r = c.r+add;
			result.g = c.g-add*1.5;
			result.b = c.b-add*1.5;
			result.a = c.a;
			gl_FragColor = result;
		}`;
	}

	get _hitHighlightFragmentShader()
	{
		return `
		varying vec2 vTextureCoord;
		uniform sampler2D uSampler;
		uniform float intensity;

		void main(void)
		{
			vec4 c = texture2D(uSampler, vTextureCoord);

			if (c.a < 0.7)
			{
				vec4 result;
				result.r = c.r;
				result.g = c.g;
				result.b = c.b;
				result.a = c.a;
				gl_FragColor = result;

				return;
			}

			vec4 result;
			float add = intensity;
			result.r = c.r+add;
			result.g = c.g-add*3.0;
			result.b = c.b-add*3.0;
			result.a = c.a;
			gl_FragColor = result;
		}`;
	}

	get _redFilter()
	{
		if (!this._fRedFilter)
		{
			this._fRedFilter = new PIXI.Filter(this._redVertexShader, this._redFragmentShader, {intensity: this._intensity});
		}

		return this._fRedFilter;
	}

	get _baseRedFilterIntensity()
	{
		return 0;
	}

	get _intensity()
	{
		this.intensity = this._redFilterIntensity.intensity;
		return this.intensity;
	}

	get _redFilterIntensity()
	{
		if (!this._fFilterIntensity)
		{
			this._fFilterIntensity = { intensity: { type: 'f', value: this._baseRedFilterIntensity } };
		}

		return this._fFilterIntensity;
	}

	_playBossDeathFxAnimation(aPlayerWin_obj)
	{
		this._resetMovementDelta();

		this._fFlyOutMouthTimer_t && this._fFlyOutMouthTimer_t.destructor();
		this._fFlyOutMouthTimer_t = null;

		let wOff = this.getWingsPositionCoefficient();

		this.deathFxAnimation1 = this.container.addChild(new BossDeathFxAnimation(this, aPlayerWin_obj));
		this.deathFxAnimation1.position.set(120, wOff < 0 ? -80 * wOff : -100 * wOff);
		this.deathFxAnimation1.rotation = Utils.gradToRad(25);
		this.deathFxAnimation1.scale.set(1, 0.7);
		this.deathFxAnimation1.zIndex = 20;
		this.deathFxAnimation1.playIntro();

		this.deathFxAnimation2 = this.container.addChild(new BossDeathFxAnimation(this, aPlayerWin_obj));
		this.deathFxAnimation2.position.set(-80, wOff < 0 ? -40 * wOff : -240 * wOff);
		this.deathFxAnimation2.rotation = Utils.gradToRad(-40);
		this.deathFxAnimation2.scale.set(0.9, 0.8);
		this.deathFxAnimation2.zIndex = 20;
		this.deathFxAnimation2.playIntro(6 * FRAME_RATE);

		let lPlaySound_bln = !!(aPlayerWin_obj.playerWin !== null && aPlayerWin_obj.playerWin !== undefined && aPlayerWin_obj.playerWin > 0);
		this.deathFxAnimation = this.container.addChild(new BossDeathFxAnimation(this, aPlayerWin_obj));
		this.deathFxAnimation.scale.set(1.2, 1.1);
		this.deathFxAnimation.zIndex = 20;
		this.deathFxAnimation.once(BossDeathFxAnimation.EVENT_FLARE_STARTED, () =>
		{
			this.emit(Enemy.EVENT_ON_DEATH_ANIMATION_FLARE);
		});
		this.deathFxAnimation.on(BossDeathFxAnimation.EVENT_CRACK_STARTED, () =>
		{
			this.emit(Enemy.EVENT_ON_DEATH_ANIMATION_CRACK, { playSound: lPlaySound_bln });
		});
		this.deathFxAnimation.once(BossDeathFxAnimation.EVENT_OUTRO_STARTED, this.onBossDeathFxOutroStarted, this);
		this.deathFxAnimation.once(BossDeathFxAnimation.EVENT_ANIMATION_COMPLETED, this.onDeathFxAnimationCompleted, this);
		this.deathFxAnimation.once(BossDeathFxAnimation.EVENT_ON_TIME_TO_EXPLODE_COINS, this._onTimeToExplodeCoins, this);
		this.deathFxAnimation.playIntro(12 * FRAME_RATE);

		this._startRedColoring(30 * FRAME_RATE);
	}

	onDeathFxAnimationCompleted()
	{
		this.deathFxAnimation1 && this.deathFxAnimation1.destroy();
		this.deathFxAnimation1 = null;
		this.deathFxAnimation2 && this.deathFxAnimation2.destroy();
		this.deathFxAnimation2 = null;

		super.onDeathFxAnimationCompleted();
	}

	_startRedColoring(time)
	{
		this._endRedColoring();

		time = time || 1 * FRAME_RATE;

		if (this.spineView)
		{
			this.spineView.visible = true;
			this.spineView.alpha = 1;
			this.spineView.filters = null;
		}

		this._redFilterIntensity.intensity.value = this._baseRedFilterIntensity;

		let seq = [{
			tweens: [{
				prop: "intensity.value", to: 0.1, onchange: () =>
				{
					this._updateFilter();
				}
			}], ease: Easing.quadratic.easeIn, duration: time, onfinish: () =>
			{
				this._endRedColoring();
			}
		}];
		this._fIntensitySequence = Sequence.start(this._redFilterIntensity, seq);
	}

	_endRedColoring()
	{
		this._fIntensitySequence && this._fIntensitySequence.destructor();
		this._fIntensitySequence = null;
	}

	_updateFilter()
	{
		if (this.spineView)
		{
			this._redFilter.uniforms.intensity = this._redFilterIntensity.intensity.value;
			// console.log(this._redFilterIntensity, this.spineView.filters);
			this.spineView.filters = [this._redFilter];
		}
	}

	_onBossDisappear()
	{
		APP.gameScreen.bossModeController.onBossDisappeared();
		this.emit(DragonEnemy.EVENT_ON_DRAGON_DISAPPEARED);

		this.destroy();
	}

	_resetMovementDelta()
	{
		if (this.container
			&& !this._fIsNeedBossHideBeforeShadowAnimationOnLastHand_bl
			&& !this._fNeedBossHideOnFirstAnimationOnLastHandAppearance_bl)
		{
			this.container.visible = true;
		}

		if (this._bossMovementDelta && this._bossMovementDelta.sequence)
		{
			this._bossMovementDelta.sequence.destructor();
		}

		this._bossMovementDelta = null;

		this._showMainView();

		if (this.spineView && this.spineView.view)
		{
			this.spineView.view.scale.x = 1;
		}
	}

	_getOffset()
	{
		let offset = super._getOffset();

		if (this._bossMovementDelta)
		{
			offset.x += this._bossMovementDelta.x;
			offset.y += this._bossMovementDelta.y;
		}

		return offset;
	}

	getLocalCenterOffset()
	{
		let pos = { x: -40, y: -130 };
		return pos;
	}

	_getHitRectWidth()
	{
		return 300;
	}

	_getHitRectHeight()
	{
		return 250;
	}

	getWingsPositionCoefficient() // -1 to 1
	{
		let coef = this.getAnimationCoef();
		coef = 2 * (coef - 0.5);

		return coef;
	}

	getCurrentCenter()
	{
		let center = this.getLocalCenterOffset();
		let coef = this.getAnimationCoef();

		let shiftX = 0 * coef;
		let shiftY = 60 * coef;

		center.x += shiftX;
		center.y += shiftY;

		return center;
	}

	getAnimationCoef() // 0 to 1
	{
		let coef = 0;
		let track = this.curAnimationTrack;
		if (track)
		{
			let animTime = track.animationLast;

			if (animTime >= 0 && animTime < 0.9) coef = 1 - (animTime - 0) / (0.9 - 0); // Up to down
			else if (animTime >= 1.42 && animTime < 2.2) coef = 1 - (animTime - 1.42) / (2.2 - 1.42); // Up to down
			else if (animTime >= 0.9 && animTime < 1.42) coef = (animTime - 0.9) / (1.42 - 0.9); // Down to up
			else coef = (animTime - 2.2) / (2.667 - 2.2); // Down to up (2.2 -> 2.667 end)
		}

		return coef;
	}

	changeInstaMarkPosition()
	{
		if (this.instaMark)
		{
			let pos = this.getLocalCenterOffset();
			this.instaMark.position.set(pos.x + this.container.position.x, pos.y + this.container.position.y);
		}
	}

	tick()
	{
		super.tick();

		this._checkForDisappearing();
		this._correctFire();
		this._correctDamageFlames();

		//CALLING FLIGHT SOUNDS FROM HERE IF REQUIRED...

		let lCurrentTime_num = APP.gameScreen.currentTime;
		let lBreakpointMomentOffset_num = 0.05

		let points = this.trajectory ? this.trajectory.points : [];
		if (
			this._fIsDragonGrowlRequired_bl &&
			points[0] && points[0].time && points[1] && points[1].time &&
			(lCurrentTime_num - points[0].time) > (points[1].time - points[0].time) * 0.75
		)
		{
			this._gameField.onSomeEnemySpawnSoundRequired(this.typeId);
			this._fIsDragonGrowlRequired_bl = false;
		}

		let lFrameTime_num = this.curAnimationFrameTime;

		if (
			(
				lFrameTime_num > 0 &&
				lFrameTime_num < DRAGON_SPINE_ANIMATION_FINAL_POINT * lBreakpointMomentOffset_num
			)
			||
			(
				lFrameTime_num > DRAGON_SPINE_ANIMATION_FINAL_POINT * 0.5 - DRAGON_SPINE_ANIMATION_FINAL_POINT * lBreakpointMomentOffset_num &&
				lFrameTime_num < DRAGON_SPINE_ANIMATION_FINAL_POINT * 0.5 + DRAGON_SPINE_ANIMATION_FINAL_POINT * lBreakpointMomentOffset_num
			)
		)
		{
			if (this._fIsFlightSoundRequiredOnTime_bl && (!this._fBossAppearanceInProgress_bln || this._fIsShadowFlight_bl))
			{
				this._gameField.onDragonFlapsWings();
				this._fIsFlightSoundRequiredOnTime_bl = false;
			}
		}
		else
		{
			this._fIsFlightSoundRequiredOnTime_bl = true;
		}
		//...CALLING FLIGHT SOUNDS FROM HERE IF REQUIRED
	}

	showBombBounce()
	{
		return;
	}

	_playDeathFxAnimation(aIsInstantKill_bl)
	{
		this._resetMovementDelta();

		this._fFlyOutMouthTimer_t && this._fFlyOutMouthTimer_t.destructor();
		this._fFlyOutMouthTimer_t = null;

		if (aIsInstantKill_bl)
		{
			if (this._dragonFire)
			{
				this._dragonFire.off(DragonFireAnimation.EVENT_ON_ANIMATION_FINISHED, this._onDragonFireAnimationFinished, this);
				this._dragonFire.destroy();
				this._dragonFire = null;
			}

			this._healthFlamesContainer && this._healthFlamesContainer.destroy();
			this._healthFlamesContainer = null;
		}

		super._playDeathFxAnimation(aIsInstantKill_bl)
	}

	destroy()
	{
		this._fFlyOutMouthTimer_t && this._fFlyOutMouthTimer_t.destructor();
		this._fFlyOutMouthTimer_t = null;

		this._endRedColoring();
		this._resetMovementDelta();

		if (this._dragonFire)
		{
			this._dragonFire.off(DragonFireAnimation.EVENT_ON_ANIMATION_FINISHED, this._onDragonFireAnimationFinished, this);
			this._dragonFire.destroy();
		}

		if (this._fHealthFlames_obj_arr && this._fHealthFlames_obj_arr.length)
		{
			for (let l_obj of this._fHealthFlames_obj_arr)
			{
				l_obj = null;
			}

			this._fHealthFlames_obj_arr = null;
		}

		super.destroy();

		this._fDisappearInProgress_bln = null;
		this._dragonFire = null;
		this._fStartDisappearAfterAppeare_bln = null;
		this._fIsNeedPreapareForBossAppearance_bl = null;
		this._fIsNeedBossHideBeforeShadowAnimationOnLastHand_bl = null;
		this._fNeedBossHideOnFirstAnimationOnLastHandAppearance_bl = null;
		this._fHealthState_obj = undefined;
		this._healthFlamesContainer = null;
		this._fLastImpactPosition_p = null;
	}
}

export default DragonEnemy;