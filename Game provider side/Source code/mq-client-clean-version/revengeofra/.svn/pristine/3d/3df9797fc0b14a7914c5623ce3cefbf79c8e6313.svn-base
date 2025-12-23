import SpineEnemy from './SpineEnemy';
import { Utils } from '../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../shared/src/CommonConstants';
import Timer from '../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import { Sequence } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import BombEnemyDeathFxAnimation from '../animation/death/BombEnemyDeathFxAnimation';
import * as Easing from '../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { STATE_WALK, STATE_TURN, DIRECTION } from './Enemy';
import BombEnemyFootStep from '../animation/bomb_enemy/BombEnemyFootStep';

const TINT_COLOR = 0x333333;
const GLOW_OFFSET_DURATION = 10;

const STEPS_OFFSET = [
	[[  0, -13], [ 5,  -6]],
	[[  5,  18], [-6,   2]],
	[[-17,  -2], [ 3, -15]],
	[[ 17,   4], [-3,  10]]
];

const STEPS_ROTATION = [0, 0, 60, 60];

class BombEnemy extends SpineEnemy
{
	static get EVENT_ON_BOMB_ENEMY_EXPLOSION() { return 'EVENT_ON_BOMB_ENEMY_EXPLOSION' }
	static get EVENT_ON_BOMB_ENEMY_DESTROYED() { return 'EVENT_ON_BOMB_ENEMY_DESTROYED' }

	constructor(aParams_obj)
	{
		super(aParams_obj);

		this._prepareTrajectoryForLeaving();

		this.tintColor = TINT_COLOR;
		this._updateTint();
	}

	_addSpecialEffectsIfRequired()
	{
		this._initGlow();
		this._updateGlowOffset();
	}

	get _stepsTrailContainer()
	{
		return APP.gameScreen.gameField.stepsTrailContainer;
	}

	_updateGlowOffset()
	{
		Sequence.destroy(Sequence.filter("position.x", this._glow));

		let offset = 0;

		switch (this.direction)
		{
			case DIRECTION.LEFT_DOWN:
				offset = -15*1.15;
				break;
			case DIRECTION.LEFT_UP:
				offset = -8*1.15;
				break;
			case DIRECTION.RIGHT_DOWN:
			case DIRECTION.RIGHT_UP:
				offset = 10*1.15;
				break;
		}

		Sequence.start(this._glow, [{tweens: {prop: "position.x", to: offset}, duration: FRAME_RATE * GLOW_OFFSET_DURATION}]);
	}

	_initGlow()
	{
		let glow = this._glow = this.container.addChild(APP.library.getSprite("enemies/bomb/glow"));
		glow.blendMode = PIXI.BLEND_MODES.ADD;
		glow.scale.set(1.15);
		glow.position.y -= 50;
		glow.zIndex = 0.9;
	}

	_generateStep(curStepId)
	{
		let lStepsTrailContainer = this._stepsTrailContainer;
		if (!lStepsTrailContainer)
		{
			return;
		}

		let lTrail_sprt = this._stepsTrailContainer.addChild(new BombEnemyFootStep());
		
		let offsetX = 0;
		let offsetY = 0;
		let stepRotation = 0;

		switch (this.direction)
		{
			case DIRECTION.LEFT_DOWN:
				stepRotation = Utils.gradToRad(STEPS_ROTATION[0]);
				offsetX = STEPS_OFFSET[0][0][curStepId];
				offsetY = STEPS_OFFSET[0][1][curStepId];
				break;
			case DIRECTION.RIGHT_UP:
				stepRotation = Utils.gradToRad(STEPS_ROTATION[1]);
				offsetX = STEPS_OFFSET[1][0][curStepId];
				offsetY = STEPS_OFFSET[1][1][curStepId];
				break;
			case DIRECTION.LEFT_UP:
				stepRotation = Utils.gradToRad(STEPS_ROTATION[2]);
				offsetX = STEPS_OFFSET[2][0][curStepId];
				offsetY = STEPS_OFFSET[2][1][curStepId];
				break;
			case DIRECTION.RIGHT_DOWN:
				stepRotation = Utils.gradToRad(STEPS_ROTATION[3]);
				offsetX = STEPS_OFFSET[3][0][curStepId];
				offsetY = STEPS_OFFSET[3][1][curStepId];
				break;
		}

		lTrail_sprt.rotation = stepRotation;
		lTrail_sprt.scale.set(1.15);
		lTrail_sprt.x = this.position.x + offsetX*1.15;
		lTrail_sprt.y = this.position.y + offsetY*1.15;
	}

	//override
	_playDeathFxAnimation()
	{
		this._glow.destroy();

		this.deathFxAnimation = this.container.addChild(new BombEnemyDeathFxAnimation());
		this.deathFxAnimation.position.set(this.footPoint.x, this.footPoint.y);
		this.deathFxAnimation.startAnimation();

		this.deathFxAnimation.once(BombEnemyDeathFxAnimation.EVENT_ANIMATION_COMPLETED, (e) => {
			this.onDeathFxAnimationCompleted();
		});

		Sequence.destroy(Sequence.findByTarget(this.shadow));
		Sequence.destroy(Sequence.findByTarget(this.shadow.view));

		this.shadow.fadeTo(0, 1000, Easing.quadratic.easeIn);
		this.deathFxAnimation.zIndex = 20;

		this.emit(BombEnemy.EVENT_ON_BOMB_ENEMY_EXPLOSION, { id: this.id });
	}

	//override
	_onFootStepOccured(curStepId)
	{
		super._onFootStepOccured(curStepId);
		
		this._generateStep(curStepId);
	}

	//override
	getStepTimers()
	{
		let timers = [];

		if (this.state == STATE_WALK)
		{
			timers = [ {time: 0.4}, {time: 1.1} ];
		}

		this._stepsAmount = timers.length;

		return timers;
	}

	//override
	changeTextures(type, noChangeFrame, switchView, checkBackDirection)
	{
		super.changeTextures(type, noChangeFrame, switchView, checkBackDirection);

		if (type == STATE_TURN)
		{
			this._updateGlowOffset();
		}
	}

	//override
	_freeze(aIsAnimated_bl = true)
	{
		super._freeze(aIsAnimated_bl);

		Sequence.destroy(Sequence.filter('alpha', this._glow));
		Sequence.start(this._glow, [
			{tweens: {prop: 'alpha', to: 0}, duration: FRAME_RATE * 5}
		]);
	}

	//override
	_unfreeze(aIsAnimated_bl = true)
	{
		super._unfreeze(aIsAnimated_bl);

		Sequence.destroy(Sequence.filter('alpha', this._glow));
		Sequence.start(this._glow, [
			{tweens: {prop: 'alpha', to: 1}, duration: FRAME_RATE * 5}
		]);
	}

	//override
	updateTrajectory(aTrajectory_obj)
	{
		super.updateTrajectory(aTrajectory_obj);

		this._prepareTrajectoryForLeaving();
	}

	_prepareTrajectoryForLeaving()
	{
		let points = this.trajectory.points;
		let befLastPoint = points[points.length - 2];
		let lastPoint = points[points.length - 1];

		if (befLastPoint && lastPoint && this.spineView && this.spineView.view)
		{
			let xDist = lastPoint.x - befLastPoint.x;
			let yDist = lastPoint.y - befLastPoint.y;
			let tDist = lastPoint.time - befLastPoint.time;

			let lSpineBounds_obj = this.spineView.view.getBounds();
			let distNew = Math.max(lSpineBounds_obj.width, lSpineBounds_obj.height);

			let xyMin = Math.min(Math.abs(xDist), Math.abs(yDist));
			let xNorm = xDist / xyMin;
			let yNorm = yDist / xyMin;

			let xDistNew = +(distNew * xNorm).toFixed(2);
			let yDistNew = +(distNew * yNorm).toFixed(2);
			let tDistNew = tDist * Math.abs((xDist + xDistNew) / xDist);

			lastPoint.invulnerable = true;
			let newPoint = {x: lastPoint.x + xDistNew, y: lastPoint.y + yDistNew, time: Math.round(lastPoint.time + tDistNew)};
			points.push(newPoint);
		}
	}

	destroy()
	{
		Sequence.destroy(Sequence.findByTarget(this._glow));

		this.emit(BombEnemy.EVENT_ON_BOMB_ENEMY_DESTROYED, { id: this.id });

		super.destroy();
	}
}

export default BombEnemy;