import Enemy, { STATE_IDLE, STATE_SPAWN } from './Enemy';
import { STATE_WALK, STATE_IMPACT, STATE_DEATH, STATE_TURN, STATE_STAY, SPINE_SCALE } from './Enemy';
import { ENEMIES } from '../../../../shared/src/CommonConstants';
import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sprite from '../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import Sequence from '../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { FRAME_RATE } from '../../../../shared/src/CommonConstants';
import { Utils } from '../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import { BulgePinchFilter } from '../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Filters';

const HALF_PI = Math.PI / 2;

class SpineEnemy extends Enemy
{
	static get EVENT_ON_ENEMY_START_DYING ()	{ return Enemy.EVENT_ON_ENEMY_START_DYING }

	constructor(params)
	{
		super(params);
		this._fCurrentAnimationName_str = undefined;
	}

	get currentAnimationName()
	{
		return this._fCurrentAnimationName_str;
	}

	get minTurnSpeed()
	{
		return 0.8;
	}

	//override...
	getSpineSpeed()
	{
		let lSpeed_num = 0.2;
		let lSpineSpeed_num = lSpeed_num * this.spineSpeed;

		return lSpineSpeed_num;
	}

	setViewPos()
	{
		this.viewPos = {x: 0, y: 0};
	}

	_getSpineViewOffset()
	{
		return {x: 0, y: 0};
	}

	setSpineViewPos()
	{
		this.spineViewPos = {x: 0, y: 0};
	}

	setStay()
	{
		this.state = STATE_STAY;
		this._stopSpinePlaying();
	}

	_onDebugTintUpdated()
	{
		this.tintColor = APP.gameDebuggingController.debugTintColor;
		this.tintIntensity = APP.gameDebuggingController.debugTintIntencity;
		super._onDebugTintUpdated();
	}

	//override protected
	_untint()
	{
		this.spineView && this.spineView.untint();
	}

	//override protected
	_updateTint()
	{
		if (this.tintColor !== undefined)
		{
			this.spineView && this.spineView.tintIt(this.tintColor, this.tintIntensity);
		}
	}

	_initView()
	{
		this.container.addChild(this._generateSpineView(this.imageName));
		this._updateTint();

		if (this.tintColor !== undefined)
		{
			this.spineView.tintIt(this.tintColor, this.tintIntensity);
		}
		this.spineView.scale.set(SPINE_SCALE);

		let lWalkAnimationName_str = this._calculateAnimationName(STATE_WALK);
		this._fCurrentAnimationName_str = lWalkAnimationName_str;
		this.spineView.setAnimationByName(0, lWalkAnimationName_str, true);
		this._startSpinePlaying();
		this.spineView.view.state.timeScale = this.spineSpeed;
		this.spineView.position.set(this.spineViewPos.x, this.spineViewPos.y);
		this.spineView.zIndex = 3;

		this.stepTimers = this.getStepTimers();

		this.state = STATE_WALK;
		this._curAnimationState = STATE_WALK;

		this.changeTextures(this.state);

		//DEBUG... !@!
		// this.hitCircle = this.container.addChild(new PIXI.Graphics());
		// let color = 0xff0000;//this.getColor();
		// let alpha = 0.5;
		// this.hitCircle.clear()
		// 	.beginFill(color, alpha)
		// 	.drawCircle(this.footPoint.position.x, this.footPoint.position.y, 5);
		// this.hitCircle.zIndex = 3;
		//...DEBUG
	}

	changeView()
	{
		if (this.isWalkState)
		{
			let lSpeedDelta_num = (this.spineView && this.spineView.view) ? Math.abs(this.spineView.view.state.timeScale - this.getSpineSpeed()) : 0;
			//need update speed?
			if (lSpeedDelta_num > 0.01 || this._isSpineFrameSyncRequired)
			{
				this.spineSpeed = this.getSpineSpeed();
				this.setWalk(); //guarantees re-creation of spineView & updating its speed
			}
		}
		else if (this.isStayState)
		{
			this._stopSpinePlaying();
		}
		else
		{
			this._startSpinePlaying();
		}
		this.changeFootPointPosition();
		this.changeShadowPosition();

		this._fPrevUpdateAccurateTime_num = APP.gameScreen.accurateCurrentTime;

		if (!this.isFrozen)
		{	
			this._changeRotation();
			this._changeDirection();
		}
	}

	get _origSpineRotationPerGrad()
	{
		return HALF_PI;
	}

	get _isSupportRotateInMotion()
	{
		return true;
	}

	get _isSupportDirectionChange()
	{
		return true;
	}

	_changeDirection()
	{
		if (!this._isSupportDirectionChange) return;
		if (this.angle > 0)
		{
			if (this.spineView.view.scale.x < 0)
			{
				this.spineView.view.scale.x *= -1;
			}
		}
		else
		{
			if (this.spineView.view.scale.x > 0)
			{
				this.spineView.view.scale.x *= -1;
			}
		}
	}

	_changeRotation()
	{
		if (!this._isSupportRotateInMotion) return;
		if (this.angle > 0)
		{
			this.spineView.rotation = -(this.angle - Utils.gradToRad(this._origSpineRotationPerGrad));
		}
		else
		{
			this.spineView.rotation = -(this.angle + Utils.gradToRad(this._origSpineRotationPerGrad));
		}
	}

	//override
	_createShadow()
	{
		return super._createShadow();
	}

	dissolveShadow()
	{
		if (this.shadow)
		{
			this.shadow.fadeTo(0, 100);
			this.shadow.scaleTo(0, 100, null, () => {
				this.shadow && this.shadow.destroy();
			})
		}
	}

	get _isSpineFrameSyncRequired()
	{
		if (!this.isWalkState)
		{
			return false;
		}

		let currentTime = APP.gameScreen.accurateCurrentTime;
		let lPrevUpdateTime = this._fPrevUpdateAccurateTime_num;
		let lPrevRealTurnPoint = this._calcPrevRealTurnPoint(currentTime);
		let lPrevRealTurnTime_num = lPrevRealTurnPoint ? lPrevRealTurnPoint.time : undefined;

		if (
				lPrevRealTurnTime_num !== undefined 
				&& lPrevUpdateTime !== undefined 
				&& lPrevRealTurnTime_num > lPrevUpdateTime
			)
		{
			return true;
		}

		return false;
	}

	_stopSpinePlaying()
	{
		this.spineView && this.spineView.stop();
	}

	_startSpinePlaying()
	{
		this.spineView && this.spineView.play();
	}

	_fastTurn()
	{
		this.setWalk();
	}

	changeTextures(type)
	{
		this.changeSpineView(type);
	}

	changeSpineView(type)
	{
		if (type === undefined)
		{
			throw new Error('SpineEnemy :: changeSpineView >> type = undefined');
		}

		if (!this.spineViewPos) // TODO delete when the server is ready
		{
			return
		}

		let x = this.spineViewPos.x;
		let y = this.spineViewPos.y;
		let lNewSpineName_str = this.imageName;
		let animationName = '';
		let animationLoop = true;
		let scale = SPINE_SCALE;
		let scaleCoefficient = this.getScaleCoefficient();

		if (type == STATE_DEATH)
		{
			if (this.isBoss)
			{
				this.destroy();
			}
			return;
		}

		animationName = this._calculateAnimationName(type);
		animationLoop = this._calculateAnimationLoop(type);
		this._fAnimationName_str = animationName;

		scale *= scaleCoefficient;

		this.state = type;
		if (type !== STATE_STAY)
		{
			this._curAnimationState = type;
		}

		if (this.spineView)
		{
			if (this.spineView.view && this.spineView.view.state)
			{
				this.spineView.removeAllListeners();
				this.spineView.clearStateListeners();
				this.spineView.view.state.onComplete = null;
				this.stateListener = null;
				if (this.spineView.view.state.tracks && this.spineView.view.state.tracks[0])
				{
					this.spineView.view.state.tracks[0].onComplete = null;
				}
			}

			this._stopSpinePlaying();

			if (lNewSpineName_str !== this._fCurSpineName_str)
			{
				Sequence.destroy(Sequence.findByTarget(this.spineView));
				this.spineView.destroy();
				this.spineView = null;
				this._fCurSpineName_str = undefined;
			}			
		}

		this.container.addChild(this.spineView || this._generateSpineView(lNewSpineName_str));
		
		if (this.tintColor !== undefined)
		{
			this.spineView.tintIt(this.tintColor, this.tintIntensity);
		}
		this._updateTint();

		this.spineView.scale.set(scale);
		try
		{
			this._fCurrentAnimationName_str = animationName;
			if ( this.state != STATE_IMPACT) this.spineView.setAnimationByName(0, animationName, animationLoop); // to avoid sliding
		}
		catch (e)
		{
			APP.logger.i_pushError(`SpineEnemy. [y] ERROR! Animation not found >>  ANIMATION NAME = ${animationName}, type = ${type}, "this.state = ${this.state}`);
			console.trace("[y] ERROR! Animation not found >>  ANIMATION NAME = " + animationName, ", type = " + type, "this.state = " + this.state);
		}

		this.spineSpeed = this.getSpineSpeed();
		
		this.spineView.position.set(x, y);
		this.spineView.zIndex = 3;
		this.spineView.view.state.timeScale = this.isTurnState && this.spineSpeed < this.minTurnSpeed ? this.minTurnSpeed : this.spineSpeed;

		let timers = {
						start: this._calcSpineViewStartTime(type),
						delay: 0
					};
		
		if (timers.start > 0)
		{
			if (animationLoop)
			{
				this.spineView.view.state.tracks[0].trackTime = timers.start;
			}
			else
			{
				this.spineView.view.state.tracks[0].animationStart = timers.start;
			}
		}
		this.spineView.view.state.tracks[0].delay = timers.delay;

		if (type === STATE_STAY)
		{
			this._stopSpinePlaying();
		}
		else
		{
			this._startSpinePlaying();
		}

		this.stepTimers = this.getStepTimers();
		this.spineView.view.state.onComplete = (() => { this.stepTimers = this.getStepTimers(); });

	}

	_calcSpineViewStartTime(type)
	{
		let lStartTime = 0;

		if (type == STATE_WALK)
		{
			let currentTime = APP.gameScreen.accurateCurrentTime;
			let lNextRealTurnTrajectoryPoint = this._calcNextRealTurnPoint(currentTime) || this.trajectory.points[this.trajectory.points.length-1];
			let walkTime = lNextRealTurnTrajectoryPoint.time - currentTime;
			let lTimeScale = this.spineView.view.state.timeScale;

			let lTrack = this.spineView.view.state.tracks[0];
			let lWalkCycleDuration = ~~(lTrack.animationEnd/lTimeScale*1000);

			let lCyclesAmount = Math.floor(walkTime/lWalkCycleDuration);

			lStartTime = (lWalkCycleDuration - (walkTime - lCyclesAmount*lWalkCycleDuration))*lTimeScale;
			lStartTime /= 1000;
		}

		return lStartTime;
	}

	_calcNextRealTurnPoint(aFromTime_num)
	{
		let lPoints = this.trajectory.points;
		for (let i=0; i<lPoints.length; i++)
		{
			let lPoint = lPoints[i];
			if (!!lPoint.isRealTurnPoint && lPoint.time > aFromTime_num)
			{
				return lPoint;
			}
		}

		return null;
	}

	_calcPrevRealTurnPoint(aFromTime_num)
	{
		let lPoints = this.trajectory.points;
		for (let i=lPoints.length-1; i>=0; i--)
		{
			let lPoint = lPoints[i];
			if (!!lPoint.isRealTurnPoint && lPoint.time < aFromTime_num)
			{
				return lPoint;
			}
		}

		return null;
	}

	_calculateAnimationName(stateType)
	{
		let animationName = '';

		switch (stateType)
		{
			case STATE_STAY:
			case STATE_WALK:
			case STATE_IMPACT:
				animationName = this.getWalkAnimationName();
				break;
			case STATE_TURN:
			case STATE_IDLE:
				animationName = stateType;
				break;
		}

		return animationName;
	}

	_calculateAnimationLoop(stateType)
	{
		let animationLoop = true;

		switch (stateType)
		{
			case STATE_TURN:
				animationLoop = false;
				break;
		}

		return animationLoop;
	}

	__freeze(aIsAnimated_bl=true)
	{
		super.__freeze(aIsAnimated_bl);
		this.spineView && Sequence.destroy(Sequence.findByTarget(this.spineView));
	}

	changeFootPointPosition()
	{
		let x = 0, y = 0;

		this.footPoint.position.set(x, y);
	}

	getStepTimers()
	{
		let timers = [];

		this._stepsAmount = timers.length;

		return timers;
	}

	//override
	_getHitRectWidth()
	{
		let hitWidth = 0;
		return hitWidth;
	}

	//override
	_getHitRectHeight()
	{
		let hitHeight = 0;
		return hitHeight;
	}

	//override
	getHitRectangle()
	{
		let rect = new PIXI.Rectangle();
		rect.width = 0;
		rect.height = 0;
		rect.width =  10;
		rect.height = 80 / (this.isBoss ? 1.2 : 2); //Math.abs(80)
		return rect;
	}

	get crosshairsOffsetPosition()
	{
		let lLocalOffset_obj = this.getLocalCenterOffset();

		if (!this.spineView)
		{
			return lLocalOffset_obj;
		}

		return {x: lLocalOffset_obj.x + lLocalOffset_obj.y*Math.sin(-this.spineView.rotation), y: lLocalOffset_obj.y*Math.cos(-this.spineView.rotation)-lLocalOffset_obj.y};
	}

	setDeath(aIsInstantKill_bl = false, aPlayerWin_obj = null, aOptKillerEnemyName_str)
	{
		super.setDeath(aIsInstantKill_bl, aPlayerWin_obj);

		this._fIsDeathActivated_bl = true;
		this.stateListener = null;

		this.setDeathFramesAnimation(aIsInstantKill_bl, aPlayerWin_obj, aOptKillerEnemyName_str);
		let lData_obj = {bossName: this.name, enemyId: this.id, enemy: this, isInstantKill: aIsInstantKill_bl};

		switch (aOptKillerEnemyName_str)
		{
			case ENEMIES.BombCapsule:
				lData_obj.isBombCapsuleWin = true;
				break;
		}

		this.emit(Enemy.EVENT_ON_ENEMY_START_DYING, lData_obj);
	}

	setDeathFramesAnimation(aIsInstantKill_bl = false, aPlayerWin_obj = null, aOptKillerEnemyName_str)
	{
		this._deathInProgress = true;

		if (this.isBoss)
		{
			if (aIsInstantKill_bl)
			{
				this._playDeathFxAnimation(aIsInstantKill_bl, aOptKillerEnemyName_str);
			}
			else
			{
				this._stopSpinePlaying();
				this._playBossDeathFxAnimation(aPlayerWin_obj);
			}
		}
		else
		{
			if (!aIsInstantKill_bl)
			{
				this.playDeathSound();
			}
			
			if ((aPlayerWin_obj && !aPlayerWin_obj.playerWin) || !this._isKilledDeath())
			{
				this._playDeathFxAnimation(aIsInstantKill_bl, aOptKillerEnemyName_str);
			}
			else
			{
				this._playSimpleEnemyDeathFxAnimation(aIsInstantKill_bl, aOptKillerEnemyName_str);
			}
		}

		let lEnemyPosition_pt = this.getGlobalPosition();
		lEnemyPosition_pt.x += this.getCurrentFootPointPosition().x;
		lEnemyPosition_pt.y += this.getCurrentFootPointPosition().y;
		this.emit(Enemy.EVENT_ON_DEATH_ANIMATION_STARTED, {position: lEnemyPosition_pt, angle: this.angle});
	}

	_isKilledDeath()
	{
		return this.isDeathActivated && this.deathReason != 1;
	}

	__getDeathAnimationContainer() {
		return this.addChild(new Sprite);
	}

	_playSimpleEnemyDeathFxAnimation(aIsInstantKill_bl, aOptKillerEnemyName_str)
	{
		if (!this.spineView) return;

		this._stopSpinePlaying();

		let l_seq = [
			{ tweens: [{ prop: 'position.x', to: Utils.getRandomWiggledValue(0, 5) }, { prop: 'position.y', to: Utils.getRandomWiggledValue(0, 5) }], duration: 2 * FRAME_RATE },
			{ tweens: [{ prop: 'position.x', to: Utils.getRandomWiggledValue(0, 5) }, { prop: 'position.y', to: Utils.getRandomWiggledValue(0, 5) }], duration: 2 * FRAME_RATE },
			{ tweens: [{ prop: 'position.x', to: Utils.getRandomWiggledValue(0, 5) }, { prop: 'position.y', to: Utils.getRandomWiggledValue(0, 5) }], duration: 2 * FRAME_RATE },
			{ tweens: [{ prop: 'position.x', to: Utils.getRandomWiggledValue(0, 5) }, { prop: 'position.y', to: Utils.getRandomWiggledValue(0, 5) }], duration: 2 * FRAME_RATE },
			{ tweens: [{ prop: 'position.x', to: Utils.getRandomWiggledValue(0, 5) }, { prop: 'position.y', to: Utils.getRandomWiggledValue(0, 5) }], duration: 2 * FRAME_RATE },
			{ tweens: [{ prop: 'position.x', to: Utils.getRandomWiggledValue(0, 5) }, { prop: 'position.y', to: Utils.getRandomWiggledValue(0, 5) }], duration: 2 * FRAME_RATE },
			{ tweens: [{ prop: 'position.x', to: Utils.getRandomWiggledValue(0, 5) }, { prop: 'position.y', to: Utils.getRandomWiggledValue(0, 5) }], duration: 2 * FRAME_RATE },
			{ tweens: [{ prop: 'position.x', to: Utils.getRandomWiggledValue(0, 5) }, { prop: 'position.y', to: Utils.getRandomWiggledValue(0, 5) }], duration: 2 * FRAME_RATE, onfinish: () => {
				this._playDeathFxAnimation(aIsInstantKill_bl, aOptKillerEnemyName_str);
			}}
		];

		Sequence.start(this.spineView, l_seq);

		if (!aIsInstantKill_bl && !this.isCritter)
		{
			let lBounds_obj = this.spineView.getBounds();
			let lRadius_num = 0.8 * Math.min(lBounds_obj.height/2, lBounds_obj.width/2);
	
			let lFilter_f = new BulgePinchFilter();
			lFilter_f.resolution = APP.stage.renderer.resolution;
			lFilter_f.center = [0.5, 0.5];
			lFilter_f.radius = lRadius_num;
			lFilter_f.strength = 0;
			this.spineView.filters = [lFilter_f];

			let lFilter_seq = [
				{ tweens: [{ prop: 'uniforms.strength', to: 1 }], duration: 3 * FRAME_RATE, onfinish: () => { Sequence.destroy(Sequence.findByTarget(lFilter_f)); } }
			];

			Sequence.start(lFilter_f, lFilter_seq);
		}
	}

	changeShadowPosition()
	{
		if (!this.spineView)
		{
			return;
		}

		this.shadow.rotation = this.spineView.rotation;
	}

	getWalkAnimationName()
	{
		return this._calcWalkAnimationName();
	}

	_calcWalkAnimationName()
	{
		return STATE_WALK;
	}
	
	getLocalCenterOffset()
	{
		return {x: 0, y: 0};
	}

	destroy(purely = false)
	{
		this.stateListener = null;

		this.tintColor = undefined;
		this.tintIntensity = undefined;
		this._fAnimationName_str = null;

		super.destroy(purely);
	}
}

export default SpineEnemy;