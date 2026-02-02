import SpineEnemy from './SpineEnemy';
import Enemy, { DIRECTION, SPINE_SCALE } from './Enemy';
import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import DarkKnightDeathFxAnimation from '../animation/death/DarkKnightDeathFxAnimation';
import BigEnemyDeathFxAnimation from '../animation/death/BigEnemyDeathFxAnimation';
import DeathFxAnimation from '../animation/death/DeathFxAnimation';
import { Sequence } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import { BulgePinchFilter } from '../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Filters';

const FOOT_STEP_TIMES = [{ time: 0.03 }, { time: 0.38 }];

class DarkKnightEnemy extends SpineEnemy {
	static get EVENT_DARK_KNIGHT_CALLOUT_CREATED() { return "EVENT_DARK_KNIGHT_CALLOUT_CREATED"; }

	constructor(params) {
		super(params);

		this._fIsCalloutAwaiting_bl = true;
	}

	//override
	__generatePreciseCollisionBodyPartsNames() {
		return [
			"cape",
			"sword"
		];
	}

	//override
	getSpineSpeed() {
		if (this.isTurnState) {
			return 2;
		}

		let lBaseSpeed_num = 0.0425;
		switch (this.direction) {
			case DIRECTION.RIGHT_UP: lBaseSpeed_num = 0.0427; break;
			case DIRECTION.LEFT_DOWN: lBaseSpeed_num = 0.0422; break;
			case DIRECTION.RIGHT_DOWN: lBaseSpeed_num = 0.0425; break;
			case DIRECTION.LEFT_UP: lBaseSpeed_num = 0.0425; break;
		}
		return (this.currentTrajectorySpeed * lBaseSpeed_num / (SPINE_SCALE * this.getScaleCoefficient())).toFixed(2);
	}

	//override
	get isBodyOutOfScreen() {
		let lCurrentGlobalFootPointPos = this.getCurrentGlobalFootPointPosition();
		const lX_Offset_num = 175;
		const lY_Offset_num = 155;

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
				this.emit(DarkKnightEnemy.EVENT_DARK_KNIGHT_CALLOUT_CREATED);
			}
		}
	}

	// override
	_generateDeathFxAnimation() {
		return new DarkKnightDeathFxAnimation();
	}

	//override
	_getHitRectHeight() {
		return 184;
	}

	//override
	_getHitRectWidth() {
		return 92;
	}

	//override
	changeShadowPosition() {
		let x = 13, y = 0, scale = 1.8, alpha = 1;

		this.shadow.position.set(x, y);
		this.shadow.scale.set(scale);
		this.shadow.alpha = alpha;
	}

	//override
	getStepTimers() {
		let lTimers_arr = [];
		for (let time of FOOT_STEP_TIMES) {
			lTimers_arr.push({ time: time.time });
		}

		this._stepsAmount = lTimers_arr.length;
		return lTimers_arr;
	}

	//override
	getLocalCenterOffset() {
		let pos = { x: 0, y: 0 };
		switch (this.direction) {
			case DIRECTION.LEFT_DOWN: pos = { x: 0, y: -73 }; break;
			case DIRECTION.LEFT_UP: pos = { x: 0, y: -73 }; break;
			case DIRECTION.RIGHT_DOWN: pos = { x: 0, y: -73 }; break;
			case DIRECTION.RIGHT_UP: pos = { x: 0, y: -73 }; break;
		}
		return pos;
	}

	//override
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
		APP.soundsController.play('mq_dragonstone_dark_knight_death');
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
					tweens: [{ prop: 'uniforms.strength', to: 0.4 }],
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
		let lPos_obj;

		switch (this.direction) {
			case DIRECTION.LEFT_UP:
				lPos_obj = { x: 0.5, y: 0.5 };
				break;
			case DIRECTION.LEFT_DOWN:
				lPos_obj = { x: 0.5, y: 0.5 };
				break;
			case DIRECTION.RIGHT_UP:
				lPos_obj = { x: 0.4, y: 0.5 };
				break;
			case DIRECTION.RIGHT_DOWN:
				lPos_obj = { x: 0.4, y: 0.5 };
				break;
			default:
				lPos_obj = { x: 0.5, y: 0.5 };
				break;
		}

		return lPos_obj;
	}

	destroy() {
		super.destroy();

		this._fIsCalloutAwaiting_bl = null;
	}
}

export default DarkKnightEnemy;