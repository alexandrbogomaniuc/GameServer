import SpineEnemy from './SpineEnemy';
import { DIRECTION, STATE_STAY } from './Enemy';
import Enemy from './Enemy';
import { FRAME_RATE } from '../../../../shared/src/CommonConstants';
import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Timer from '../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import { Utils } from '../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import CerberusFireBreath from './../animation/CerberusFireBreath';
import CerberusDeathFxAnimation from '../animation/death/CerberusDeathFxAnimation';
import DeathFxAnimation from '../animation/death/DeathFxAnimation';
import { Sequence } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import BigEnemyDeathFxAnimation from '../animation/death/BigEnemyDeathFxAnimation';
import { BulgePinchFilter } from '../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Filters';

const HEADS_STATE_3 = '';
const HEADS_STATE_2 = '_head1_dead';
const HEADS_STATE_1 = '_head2_dead';
const HEADS_STATE_0 = '_head3_dead'; // only for stay state

const STATE_HEAD_DEATH = "STATE_HEAD_DEATH";

const FIRES_CONFIG = {
	[DIRECTION.RIGHT_DOWN]: [{ x: 100, y: -35, angle: 140 }, { x: 75, y: -60, angle: 140 }, { x: 32, y: -2, angle: 140 }],
	[DIRECTION.RIGHT_UP]: [{ x: 30, y: -100, angle: 65 }, { x: 77, y: -115, angle: 110 }, { x: 100, y: -65, angle: 120 }],
	[DIRECTION.LEFT_UP]: [{ x: -60, y: -35, angle: -65 }, { x: -76, y: -120, angle: -110 }, { x: -100, y: -65, angle: -120 }],
	[DIRECTION.LEFT_DOWN]: [{ x: -10, y: -15, angle: -140 }, { x: -55, y: -52, angle: -140 }, { x: -25, y: -15, angle: -140 }]
}

class CerberusEnemy extends SpineEnemy {
	static get EVENT_ON_ENEMY_STATE_CHANGED() { return "onCerberusHeadStateChanged"; }
	static get EVENT_CERBERUS_CALLOUT_CREATED() { return "EVENT_CERBERUS_CALLOUT_CREATED"; }

	constructor(params, aGameField_gf) {
		super(params);
		this._fGameField_gf = aGameField_gf;
		this._delayedHeadDeath = false;
		this._deathFilterIntensity = { intensity: { type: 'f', value: 0 } };
		this._fIsCalloutAwaiting_bl = true;
	}

	//override
	__generateIgnoreCollisionsBodyPartsNames() {
		return [
			"chain"
		];
	}

	//override
	__generatePreciseCollisionBodyPartsNames() {
		return [
			"tail"
		];
	}

	_initView() {
		this._invalidateCerberusState();

		super._initView();

		this._prevBreathId = 0;
		this._breathTimer = new Timer(() => this._tryNextBreath(), 80 * FRAME_RATE, true);
	}

	_tryNextBreath() {
		if (!this.container || this._fireBreath || this.isDestroyed || this.isFrozen || !this.isWalkState || this.isDeathInProgress) return;
		if (Math.random() > 0.25) return;

		let stateId = this._stateId - 1;
		if (stateId < 0) return;
		let breathId = stateId ? Utils.random(0, stateId) : 0;
		if (breathId == this._prevBreathId) breathId = this._prevBreathId + 1;
		if (breathId > stateId) breathId = 0;
		this._prevBreathId = breathId;

		let config = FIRES_CONFIG[this.direction][breathId];

		if (this.direction == DIRECTION.RIGHT_UP || this.direction == DIRECTION.LEFT_UP) {
			this._fireBreath = this.container.addChildAt(new CerberusFireBreath(), 0);
			this._fireBreath.zIndex = -1;
		}
		else {
			this._fireBreath = this.container.addChild(new CerberusFireBreath());
		}
		this._fireBreath.position.set(config.x, config.y);
		this._fireBreath.rotation = Utils.gradToRad(config.angle);
		this._fireBreath.once(CerberusFireBreath.EVENT_ON_ANIMATION_FINISHED, this._onFireFinished, this);
		this._fireBreath.startAnimation();
	}

	get _stateId() {
		switch (this._fCerberusState_str) {
			case HEADS_STATE_3: return 3;
			case HEADS_STATE_2: return 2;
			case HEADS_STATE_1: return 1;
			default: return 0;
		}
	}

	get _headStateChange() {
		return this._fheadStateChange_bl;
	}

	_onFireFinished() {
		this._fireBreath && this._fireBreath.destroy();
		this._fireBreath = null;
	}

	changeShadowPosition() {
		this.shadow.position.set(0, 0);
		this.shadow.scale.set(2);
		this.shadow.alpha = 0.7;
	}

	getSpineSpeed() {
		let lSpineSpeed_num = 1;

		switch (this.direction) {
			default:
			case DIRECTION.RIGHT_UP: lSpineSpeed_num = 0.108 * this.currentTrajectorySpeed / 0.75; break;
			case DIRECTION.RIGHT_DOWN: lSpineSpeed_num = 0.123 * this.currentTrajectorySpeed / 0.75; break;
			case DIRECTION.LEFT_DOWN: lSpineSpeed_num = 0.12 * this.currentTrajectorySpeed / 0.75; break;
			case DIRECTION.LEFT_UP: lSpineSpeed_num = 0.11 * this.currentTrajectorySpeed / 0.75; break;
		}

		if (this.isImpactState) {
			lSpineSpeed_num *= 1.8;
		}

		return lSpineSpeed_num;
	}

	_getHitRectWidth() {
		return 170 * 0.75;
	}

	_getHitRectHeight() {
		return 160 * 0.75;
	}

	getLocalCenterOffset() {
		return { x: 0, y: -60 * 0.75 };
	}

	setImpact(aImpactPosition_p) {
		this._invalidateCerberusState();

		super.setImpact(aImpactPosition_p);
	}

	_onEnergyUpdated(data) {
		super._onEnergyUpdated(data);

		this._invalidateCerberusState();
	}

	_invalidateCerberusState() {
		let prevState = this._fCerberusState_str;

		if (this._fEnergy_num == 1) {
			this._fCerberusState_str = HEADS_STATE_1;
		}
		else if (this._fEnergy_num == 2) {
			this._fCerberusState_str = HEADS_STATE_2;
		}
		else {
			this._fCerberusState_str = HEADS_STATE_3;
		}

		if (prevState !== this._fCerberusState_str) {
			this._onCerberusStateChanged(prevState, this._fCerberusState_str);
			this._fheadStateChange_bl = true;
		}
		else {
			this._fheadStateChange_bl = false;
		}
	}

	get cerberusState() {
		return this._fCerberusState_str;
	}

	get _isImpactAllowed() {
		return super._isImpactAllowed
			&& this.state !== STATE_HEAD_DEATH;
	}

	changeTextures(type, noChangeFrame, switchView, checkBackDirection) {
		super.changeTextures(type, noChangeFrame, switchView, checkBackDirection);
	}

	changeSpineView(type, noChangeFrame) {
		super.changeSpineView(type, noChangeFrame);

		if (type === STATE_HEAD_DEATH) {
			this.spineView.view.state.onComplete = (() => {
				this._resumeWalking();
				if (this.state !== STATE_STAY && !this.isFrozen) {
					this.setWalk();
				}
			});
			this._pauseWalking();
		}
	}

	_calculateAnimationName(stateType) {
		if (stateType === STATE_HEAD_DEATH) {
			switch (this.direction) {
				case DIRECTION.LEFT_UP: return '270' + this.cerberusState;
				case DIRECTION.LEFT_DOWN: return '0' + this.cerberusState;
				case DIRECTION.RIGHT_UP: return '180' + this.cerberusState;
				case DIRECTION.RIGHT_DOWN: return '90' + this.cerberusState;
			}
		}

		return super._calculateAnimationName(stateType) + this.cerberusState;
	}

	_onCerberusStateChanged(prevState, newState) {
		if (this.isWalkState) {
			if (this.cerberusState === HEADS_STATE_2 || this.cerberusState === HEADS_STATE_1) {
				this.setHeadDeathAnimation();
			}
			else if (!this._isImpactAllowed) {
				this.setWalk();
			}
		}
		else if (this.isStayState) {
			if (!this.isFrozen && (this.cerberusState === HEADS_STATE_2 || this.cerberusState === HEADS_STATE_1)) {
				this.setHeadDeathAnimation();
			}
			else if (this.isFrozen) {
				this._delayedHeadDeath = true;
			}
			else if (!this._isImpactAllowed) {
				this.setStay();
			}
		}

		this.emit(CerberusEnemy.EVENT_ON_ENEMY_STATE_CHANGED, { prevState: prevState, newState: newState });
	}

	//override
	get isBodyOutOfScreen() {
		let lCurrentGlobalFootPointPos = this.getCurrentGlobalFootPointPosition();
		const lX_Offset_num = 195;
		const lY_Offset_num = 150;

		if (!this.prevTurnPoint || !this.nextTurnPoint) {
			return true;
		}

		if ((this.prevTurnPoint.x < this.nextTurnPoint.x
			&& (lCurrentGlobalFootPointPos.x + lX_Offset_num) >= 0
			&& (this.prevTurnPoint.y < this.nextTurnPoint.y && (lCurrentGlobalFootPointPos.y + lY_Offset_num) >= 0
				|| this.prevTurnPoint.y > this.nextTurnPoint.y && (lCurrentGlobalFootPointPos.y - lY_Offset_num) <= 540 + lY_Offset_num
			)
		)
			||
			(this.prevTurnPoint.x > this.nextTurnPoint.x
				&& (lCurrentGlobalFootPointPos.x - lX_Offset_num) <= 960
				&& (this.prevTurnPoint.y < this.nextTurnPoint.y && (lCurrentGlobalFootPointPos.y + lY_Offset_num) >= 0
					|| this.prevTurnPoint.y > this.nextTurnPoint.y && (lCurrentGlobalFootPointPos.y - lY_Offset_num) <= 540 + lY_Offset_num
				)
			)
		) {
			return false;
		}

		return true;
	}

	//override
	tick() {
		super.tick();

		if (this._fIsCalloutAwaiting_bl) {
			if (!this.isBodyOutOfScreen) {
				this._fIsCalloutAwaiting_bl = false;
				this.emit(CerberusEnemy.EVENT_CERBERUS_CALLOUT_CREATED);
			}
		}
	}

	setHeadDeathAnimation() {
		this._delayedHeadDeath = false;

		this.changeTextures(STATE_HEAD_DEATH);
	}

	get _customSpineTransitionsDescr() {
		return super._customSpineTransitionsDescr.concat([
			{ from: "<PREFIX>walk" + HEADS_STATE_3, to: "<PREFIX>walk" + HEADS_STATE_2, duration: 0.1 },
			{ from: "<PREFIX>walk" + HEADS_STATE_3, to: "<PREFIX>" + HEADS_STATE_2, duration: 0.1 },
			{ from: "<PREFIX>" + HEADS_STATE_3, to: "<PREFIX>walk" + HEADS_STATE_2, duration: 0.1 },
			{ from: "<PREFIX>walk" + HEADS_STATE_2, to: "<PREFIX>walk" + HEADS_STATE_1, duration: 0.1 },
			{ from: "<PREFIX>walk" + HEADS_STATE_2, to: "<PREFIX>" + HEADS_STATE_1, duration: 0.1 },
			{ from: "<PREFIX>" + HEADS_STATE_2, to: "<PREFIX>walk" + HEADS_STATE_1, duration: 0.1 },
			{ from: "<PREFIX>walk" + HEADS_STATE_3, to: "<PREFIX>hit" + HEADS_STATE_3, duration: 0.1 },
			{ from: "<PREFIX>hit" + HEADS_STATE_3, to: "<PREFIX>walk" + HEADS_STATE_3, duration: 0.1 },
			{ from: "<PREFIX>hit" + HEADS_STATE_3, to: "<PREFIX>" + HEADS_STATE_2, duration: 0.1 },
			{ from: "<PREFIX>walk" + HEADS_STATE_2, to: "<PREFIX>hit" + HEADS_STATE_2, duration: 0.1 },
			{ from: "<PREFIX>hit" + HEADS_STATE_2, to: "<PREFIX>walk" + HEADS_STATE_2, duration: 0.1 },
			{ from: "<PREFIX>hit" + HEADS_STATE_2, to: "<PREFIX>" + HEADS_STATE_1, duration: 0.1 },
			{ from: "<PREFIX>walk" + HEADS_STATE_1, to: "<PREFIX>hit" + HEADS_STATE_1, duration: 0.1 },
			{ from: "<PREFIX>hit" + HEADS_STATE_1, to: "<PREFIX>walk" + HEADS_STATE_1, duration: 0.1 }
		]);
	}

	setDeathFramesAnimation(aIsInstantKill_bl = false) {
		this._deathInProgress = true;

		this.deathFxAnimation = this.container.addChild(this._generateDeathFxAnimation());
		this.deathFxAnimation.position.set(0, -this._getHitRectHeight() / 2);
		this.deathFxAnimation.scale.set(this._deathFxScale);
		this.deathFxAnimation.gameFieldPosition = APP.gameScreen.gameField.getEnemyPosition(this.id);
		this.deathFxAnimation.additionalZIndex = this.zIndex + 1; //+1 because his weapon must be over the sand

		this.deathFxAnimation.once(DeathFxAnimation.EVENT_ANIMATION_COMPLETED, (e) => {
			this.onDeathFxAnimationCompleted();
		});

		this.deathFxAnimation.zIndex = 20;

		if (aIsInstantKill_bl) {
			if (this.spineView) {
				this.spineView.destroy();
				this.spineView = null;
				this._fCurSpineName_str = undefined;
			}
			this.deathFxAnimation.i_startOutroAnimation();
		}
		else {
			this.spineView.stop();
			this._startTriggeringAnimation(BigEnemyDeathFxAnimation.TRIGGERING_DURATION);
			this.deathFxAnimation.on(BigEnemyDeathFxAnimation.ON_ENEMY_MUST_BE_HIDDEN, this._hideEnemy.bind(this));
			this.deathFxAnimation.i_startAnimation();
		}

		let lEnemyPosition_pt = this.getGlobalPosition();
		lEnemyPosition_pt.x += this.getCurrentFootPointPosition().x;
		lEnemyPosition_pt.y += this.getCurrentFootPointPosition().y;
		APP.soundsController.play('mq_dragonstone_cerberus_death');
		this.emit(Enemy.EVENT_ON_DEATH_ANIMATION_STARTED, { position: lEnemyPosition_pt, angle: this.angle });
	}

	_hideEnemy() {
		this.shadow.addTween('alpha', 0, BigEnemyDeathFxAnimation.HIDIING_DURATION).play();
		this.spineView.addTween('alpha', 0, BigEnemyDeathFxAnimation.HIDIING_DURATION, null, this._validatezIndexOnDeath.bind(this)).play();
		this.emit(Enemy.EVENT_ON_ENEMY_IS_HIDDEN);
	}

	_startTriggeringAnimation(aDuration_num) {
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater) {
			let lPos_obj = this._getBlowingFilterPosition();
			// [Fix] Disabling BulgePinchFilter
			let lBlowFilter_bpf = null; // new BulgePinchFilter({x: lPos_obj.x, y: lPos_obj.y}, 150, 0);
			this.container.filters = [lBlowFilter_bpf];
			let lBlowing_seq = [
				{
					tweens: [{ prop: 'uniforms.strength', to: 0.5 }],
					duration: aDuration_num,
					onfinish: () => {
						if (this.container) {
							this.container.filters = null;
						}
						Sequence.destroy(Sequence.findByTarget(lBlowFilter_bpf));
					}
				}
			];
			Sequence.start(lBlowFilter_bpf, lBlowing_seq);
		}

		this._hitHighlightInProgress = true;
		this._hitHighlightFilterIntensity.intensity.value = 0;
		let lHighlight_seq = [{ tweens: [{ prop: "intensity.value", to: 0.1 }], duration: aDuration_num }];
		Sequence.start(this._hitHighlightFilterIntensity, lHighlight_seq);

		let lTriggering_seq = [
			{ tweens: [{ prop: 'position.x', to: 2 }, { prop: 'position.y', to: -1 }] },
			{ tweens: [{ prop: 'position.x', to: 0 }, { prop: 'position.y', to: 1 }] },
			{ tweens: [{ prop: 'position.x', to: -2 }, { prop: 'position.y', to: -2 }] },
			{ tweens: [{ prop: 'position.x', to: -3 }, { prop: 'position.y', to: 1 }] },
			{ tweens: [{ prop: 'position.x', to: -4 }, { prop: 'position.y', to: 5 }] },
			{ tweens: [{ prop: 'position.x', to: 3 }, { prop: 'position.y', to: -3 }] },
			{ tweens: [{ prop: 'position.x', to: 0 }, { prop: 'position.y', to: 1 }] },
			{ tweens: [{ prop: 'position.x', to: -4 }, { prop: 'position.y', to: 5 }] },
			{ tweens: [{ prop: 'position.x', to: -5 }, { prop: 'position.y', to: 6 }] },
			{ tweens: [{ prop: 'position.x', to: 5 }, { prop: 'position.y', to: -3 }] },
			{ tweens: [{ prop: 'position.x', to: 0 }, { prop: 'position.y', to: 1 }] },
			{ tweens: [{ prop: 'position.x', to: -7 }, { prop: 'position.y', to: -2 }] },
			{ tweens: [{ prop: 'position.x', to: 10 }, { prop: 'position.y', to: -5 }] },
			{ tweens: [{ prop: 'position.x', to: -2 }, { prop: 'position.y', to: 4 }] },
			{ tweens: [{ prop: 'position.x', to: -10 }, { prop: 'position.y', to: 8 }] },
			{
				tweens: [{ prop: 'position.x', to: 3 }, { prop: 'position.y', to: -4 }],
				onfinish: () => {
					this.spineView && Sequence.destroy(Sequence.findByTarget(this.spineView));
				}
			}
		];

		let lTweensAmount_num = lTriggering_seq.length;
		for (let i = 0; i < lTweensAmount_num; i++) {
			lTriggering_seq[i].duration = aDuration_num / lTweensAmount_num;
		}

		Sequence.start(this.spineView, lTriggering_seq);
	}

	_getBlowingFilterPosition() {
		return { x: 0.5, y: 0.5 };
	}

	// override
	_resumeAfterUnfreeze() {
		super._resumeAfterUnfreeze();

		if (this._delayedHeadDeath) {
			this.setHeadDeathAnimation();
		}
	}

	// override
	_generateDeathFxAnimation() {
		return new CerberusDeathFxAnimation();
	}

	destroy(purely) {
		if (this._fireBreath) {
			this._fireBreath.off(CerberusFireBreath.EVENT_ON_ANIMATION_FINISHED, this._onFireFinished, this);
			this._fireBreath.destroy();
		}

		this._breathTimer && this._breathTimer.destructor();

		super.destroy(purely);

		this._fIsCalloutAwaiting_bl = null;
		this._fireBreath = null;
		this._prevBreathId = null;
		this._breathTimer = null;
		this._delayedHeadDeath = null;
		this._fGameField_gf = null;
		this._deathFilterIntensity = null;
	}

	//override
	_restoreStateBeforeFreeze() {
		if (this._fIsDeathActivated_bl) {
			return;
		}

		if (this._curAnimationState === STATE_HEAD_DEATH && !!this._fPauseWalkingTimeMarker_num) {
			this._resumeWalking();
		}

		this.setWalk();
	}

	//override
	__onSpawn() {
		this._fGameField_gf.onSomeEnemySpawnSoundRequired(this.typeId);
	}
}

export default CerberusEnemy;