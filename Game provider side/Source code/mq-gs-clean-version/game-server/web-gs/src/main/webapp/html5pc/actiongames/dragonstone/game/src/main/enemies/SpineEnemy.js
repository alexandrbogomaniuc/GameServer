import Enemy from './Enemy';
import { STATE_WALK, STATE_IMPACT, STATE_DEATH, STATE_TURN, STATE_STAY, SPINE_SCALE, DIRECTION, TURN_DIRECTION } from './Enemy';
import { ENEMIES } from '../../../../shared/src/CommonConstants';
import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sprite from '../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import Sequence from '../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { FRAME_RATE } from '../../../../shared/src/CommonConstants';
import { Utils } from '../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';

export const FOOT_STEPS_POSITIONS =
{
};

const MIN_TURN_SPEED = 0.8;

class SpineEnemy extends Enemy
{
	static get EVENT_STATE_CHANGED ()			{ return "onEnemyStateChanged" };
	static get EVENT_ON_FOOT_STEP_OCCURRED ()	{ return "EVENT_ON_FOOT_STEP_OCCURRED" };

	constructor(params)
	{
		super(params);
	}

	get minTurnSpeed()
	{
		return MIN_TURN_SPEED;
	}

	getPositionOffsetX()
	{
		return 0;
	}

	getPositionOffsetY()
	{
		return 0;
	}

	//override...
	getSpineSpeed()
	{
		let lSpeed_num = 0.2;
		let lSpineSpeed_num = lSpeed_num * this.currentTrajectorySpeed;

		if (this.isImpactState)
		{
			lSpineSpeed_num *= 1.5;
		}

		return lSpineSpeed_num;
	}

	setViewPos()
	{
		let pos = {x: 0, y: 0};
		this.viewPos = pos;
	}

	setSpineViewPos()
	{
		let pos = {x: 0, y: 0};
		this.spineViewPos = pos;
	}

	setStay()
	{
		this.state = STATE_STAY;
		this._stopSpinePlaying();
	}

	calcMeshesHull(optMeshNames)
	{
		if (!this.spineView)
		{
			return null;
		}

		return this.spineView.calcMeshesHull(optMeshNames);
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
		this.container.addChild(this._generateSpineView(this.imageName + this.direction.substr(3)));
		this._onSpineViewChanged();
		this._updateTint();

		if (this.tintColor !== undefined)
		{
			this.spineView.tintIt(this.tintColor, this.tintIntensity);
		}

		this.spineView.scale.set(SPINE_SCALE);

		let lWalkAnimationName_str = this._calculateAnimationName(STATE_WALK);
		this.spineView.setAnimationByName(0, lWalkAnimationName_str, true);
		this._startSpinePlaying();
		this.spineView.view.state.timeScale = this.spineSpeed;
		this.spineView.position.set(this.spineViewPos.x, this.spineViewPos.y);
		this.spineView.zIndex = 3;

		this.stepTimers = this.getStepTimers();

		this.state = STATE_WALK;
		this._curAnimationState = STATE_WALK;

		this.changeTextures(this.state);

		//DEBUG...
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
		if (this.checkInitialTurn())
		{
			return;
		}
		let direction = this._calculateDirection();
		if (this._isRotationOnChangeViewRequired(direction))
		{
			this.turnDirection = this.getTurnDirection(direction);
			this.direction = direction;

			if (this.state == STATE_DEATH) return;
			if (this.state == STATE_STAY) return;

			if (this.isFastTurnEnemy)
			{
				this._fastTurn();
			}
			else
			{
				this.changeTextures(STATE_TURN);
				if (this.spineView && this.spineView.view)
				{
					this.stateListener = {complete: (e) => {
						this._stopSpinePlaying();
						this.endTurn();
						this.stateListener = null;
					}};
					this.spineView.view.state.addListener(this.stateListener);
				}
				else
				{
					this.setWalk();
				}
			}
		}

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
		this.changeInstaMarkPosition();

		this._fPrevUpdateAccurateTime_num = APP.gameScreen.accurateCurrentTime;
	}

	get _isSpineFrameSyncRequired()
	{
		if (!this.isWalkState)
		{
			return false;
		}

		let currentTime = APP.gameScreen.accurateCurrentTime;
		let lPoints = this.trajectory.points;
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

	_isRotationOnChangeViewRequired(targetDirection)
	{
		return (targetDirection != this.direction);
	}

	endTurn(aInitial_bl = false)
	{
		if (this._fIsDeathActivated_bl) // we were waiting for endTurn to proceed with the Death animation
		{
			this.setDeath();
		}
		else
		{
			if (this.isBoss)
			{
				if (aInitial_bl && (this.isFireDenied || !this.trajectoryPositionChangeInitiated))
				{
					return; // stay still while fire is denied or trajectory keeps unchanged point (for boss) ; fireDenied property is set only for Boss
				}
			}

			if (this._isHVRisingUpInProgress)
			{
				return;
			}

			this.setWalk();
		}
	}

	changeTextures(type)
	{
		this.changeSpineView(type);

		if (type == STATE_TURN)
		{
			this.emit("turn");
		}
	}

	changeSpineView(type)
	{
		if(!this.container)
		{
			return;
		}

		if (type === undefined)
		{
			throw new Error('SpineEnemy :: changeSpineView >> type = undefined');
		}

		if (type !== STATE_IMPACT)
		{
			this._resetImpactAnimationProgress();
		}

		if(!this.spineViewPos)
		{
			this.setSpineViewPos();
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

		if (type != STATE_TURN)
		{
			lNewSpineName_str += this._calculateSpineSpriteNameSuffix(type);
		}

		animationName = this._calculateAnimationName(type);
		animationLoop = this._calculateAnimationLoop(type);
		this._fAnimationName_str = animationName;

		if (type == STATE_TURN)
		{
			lNewSpineName_str = this._calculateSpineTurnName(animationName, this.imageName);
		}

		scale *= scaleCoefficient;

		let prevState = this.state;
		this.state = type;
		if (type !== STATE_STAY)
		{
			this._curAnimationState = type;
		}
		let newState = this.state;

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
			this.spineView.setAnimationByName(0, animationName, animationLoop);
		}
		catch (e)
		{
			console.trace("[y] ERROR! Animation not found >>  ANIMATION NAME = " + animationName, ", type = " + type, "this.state = " + this.state);
		}

		this.spineSpeed = this.getSpineSpeed();
		
		this.spineView.position.set(x, y);
		this.spineView.zIndex = 3;
		this.spineView.view.state.timeScale = this.isTurnState && this.spineSpeed < this.minTurnSpeed ? this.minTurnSpeed : this.spineSpeed;

		let timers = {
						start: this._calcSpineViewStartTime(type),
						delay: this._calcSpineViewStartDelay(type)
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

		if (prevState !== newState)
		{
			this.emit(SpineEnemy.EVENT_STATE_CHANGED, {prevState: prevState, newState: newState});
		}

		this.stepTimers = this.getStepTimers();
		this.spineView.view.state.onComplete = ((e) => { this.stepTimers = this.getStepTimers(); });

		this._onSpineViewChanged();
	}

	_calculateSpineTurnName(aAnimName_str, aSpineName_str)
	{
		let lDirAngles_arr = this._getPossibleDirections();

		let names = "";
		for (let lAngle_num of lDirAngles_arr)
		{
			let lResultSpineName_str = aSpineName_str + lAngle_num;
			let lDataAnimations_obj = APP.spineLibrary.getData(lResultSpineName_str).animations;

			for (let lAnim_obj of lDataAnimations_obj)
			{
				names += lAnim_obj.name + "; "
				if (lAnim_obj.name == aAnimName_str)
				{
					return lResultSpineName_str;
				}
			}
		}

		return 0;
	}

	_getPossibleDirections()
	{
		return [0, 90, 180, 270];
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

	_calcSpineViewStartDelay(type)
	{
		return 0;
	}

	_calculateSpineSpriteNameSuffix(stateType)
	{
		if (stateType == STATE_TURN)
		{
			return this.getTurnSuffix();
		}
		else
		{
			if(!this.direction)
			{
				this.direction = this._calculateDirection();
			}
			return this.direction.substr(3);
		}
	}

	_calculateAnimationName(stateType)
	{
		let animationName = '';

		switch (stateType)
		{
			case STATE_STAY:
			case STATE_WALK:
				animationName = this.getWalkAnimationName();
				break;
			case STATE_IMPACT:
				animationName = this.getImpactAnimationName();
				break;
			case STATE_TURN:
				animationName = this.getTurnAnimationName();
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

	get curAnimationTrack()
	{
		let animTrack = undefined;
		if (this.spineView && this.spineView.view && this.spineView.view.state && this.spineView.view.state.tracks[0])
		{
			animTrack = this.spineView.view.state.tracks[0];
		}

		return animTrack;
	}

	updateSpineAnimation()
	{
		if (this.spineView && this.spineView.alpha != 0 && this.spineView.view && this.spineView.view.state && this.spineView.view.state.tracks[0])
		{
			let animTime = this.spineView.view.state.tracks[0].animationLast;
			if (this.lastAnimTime && animTime < this.lastAnimTime)
			{
				this.lastAnimTime = 0;
			}
			if (this.stepTimers.length > 0)
			{
				for (let i = 0; i < this.stepTimers.length; i ++)
				{
					if (animTime >= this.stepTimers[i].time && !this.lastAnimTime)
					{
						this._playStepSound();

						if (this.isBoss)
						{
							this.emit(Enemy.EVENT_ON_GROUNDSHAKE);
						}

						this.stepTimers.splice(i, 1);
						--i;

						if (this.stepTimers.length == 0)
						{
							this.lastAnimTime = animTime;
						}

						let curStepId = this._stepsAmount - this.stepTimers.length - 1;
						this._onFootStepOccured(curStepId);
					}
				}
			}
		}
	}

	_onFootStepOccured(curStepId)
	{
		this.emit(SpineEnemy.EVENT_ON_FOOT_STEP_OCCURRED, {stepId:curStepId});
	}

	_playStepSound()
	{
		let soundName = '';
		let soundIndex = 1;
		switch(this.name)
		{
			default:
				return;
			break;
		}

		APP.soundsController.play(soundName);
	}

	getFootStepPosition(stepId)
	{
		let pos = new PIXI.Point(0, 0);

		let lFootStepPositionsDescriptor = this._footStepPositionsDescriptor;
		if (!!lFootStepPositionsDescriptor[this.name])
		{
			let stepDescription = lFootStepPositionsDescriptor[this.name][this.direction][stepId];
			pos = new PIXI.Point(stepDescription.x, stepDescription.y);
		}

		return pos;
	}

	get _footStepPositionsDescriptor()
	{
		return FOOT_STEPS_POSITIONS;
	}

	changeFootPointPosition()
	{
		let x = 0, y = 0;

		this.footPoint.position.set(x, y);

		this._updateHitPointerRectangle();
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
		switch (this.name)
		{
			
		}
		return hitWidth;
	}

	//override
	_getHitRectHeight()
	{
		let hitHeight = 0;
		switch (this.name)
		{
			
		}
		return hitHeight;
	}

	//override
	getHitRectangle()
	{
		let rect = new PIXI.Rectangle();
		rect.width = 0;
		rect.height = 0;
		if (this.isScarab || this.isLocust)
		{
			return rect;
		}

		rect.width =  10;
		rect.height = Math.abs(80) / (this.isBoss ? 1.2 : 2);
		return rect;
	}

	get crosshairsOffsetPosition()
	{
		let lOffset_pt = {x: 0, y: 0};

		return lOffset_pt;
	}

	setDeath(aIsInstantKill_bl = false, aPlayerWin_obj = null, aOptIsRageExplodeTarget = false)
	{
		super.setDeath(aIsInstantKill_bl, aPlayerWin_obj);

		this._fIsDeathActivated_bl = true;
		this.stateListener = null;

		this.setDeathFramesAnimation(aIsInstantKill_bl, aPlayerWin_obj, aOptIsRageExplodeTarget);
		this.emit(Enemy.EVENT_ON_ENEMY_START_DYING, {bossName: this.name, enemy: this, isInstantKill: aIsInstantKill_bl});
	}

	setDeathFramesAnimation(aIsInstantKill_bl = false, aPlayerWin_obj = null, aOptIsRageExplodeTarget = false)
	{
		this._deathInProgress = true;

		if (this.isBoss)
		{
			if (aIsInstantKill_bl)
			{
				this._playDeathFxAnimation(aIsInstantKill_bl);
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
			
			this._forceHVRisingUpIfRequired();

			if ((Enemy.i_isLongDeathAnimationSupported(this.typeId) && !this.isFrozen) || (aPlayerWin_obj && !aPlayerWin_obj.playerWin) || !this._isKilledDeath() || aOptIsRageExplodeTarget)
			{
				this._playDeathFxAnimation(aIsInstantKill_bl);
			}
			else
			{
				this._playSimpleEnemyDeathFxAnimation(aIsInstantKill_bl);
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

	_playSimpleEnemyDeathFxAnimation(aIsInstantKill_bl)
	{
		if (!this.spineView) return;

		this._stopSpinePlaying();

		let l_seq = [
			{ tweens: [{ prop: 'position.x', to: Utils.getRandomWiggledValue(0, 5) }, { prop: 'position.y', to: Utils.getRandomWiggledValue(0, 5) }], duration: 2 * FRAME_RATE, onfinish: () => {this._playHitHighlightAnimation(3*FRAME_RATE)}},
			{ tweens: [{ prop: 'position.x', to: Utils.getRandomWiggledValue(0, 5) }, { prop: 'position.y', to: Utils.getRandomWiggledValue(0, 5) }], duration: 2 * FRAME_RATE },
			{ tweens: [{ prop: 'position.x', to: Utils.getRandomWiggledValue(0, 5) }, { prop: 'position.y', to: Utils.getRandomWiggledValue(0, 5) }], duration: 2 * FRAME_RATE },
			{ tweens: [{ prop: 'position.x', to: Utils.getRandomWiggledValue(0, 5) }, { prop: 'position.y', to: Utils.getRandomWiggledValue(0, 5) }], duration: 2 * FRAME_RATE, onfinish: () => {this._playHitHighlightAnimation(3*FRAME_RATE)}},
			{ tweens: [{ prop: 'position.x', to: Utils.getRandomWiggledValue(0, 5) }, { prop: 'position.y', to: Utils.getRandomWiggledValue(0, 5) }], duration: 2 * FRAME_RATE },
			{ tweens: [{ prop: 'position.x', to: Utils.getRandomWiggledValue(0, 5) }, { prop: 'position.y', to: Utils.getRandomWiggledValue(0, 5) }], duration: 2 * FRAME_RATE },
			{ tweens: [{ prop: 'position.x', to: Utils.getRandomWiggledValue(0, 5) }, { prop: 'position.y', to: Utils.getRandomWiggledValue(0, 5) }], duration: 2 * FRAME_RATE, onfinish: () => {this._playHitHighlightAnimation(3*FRAME_RATE)}},
			{ tweens: [{ prop: 'position.x', to: Utils.getRandomWiggledValue(0, 5) }, { prop: 'position.y', to: Utils.getRandomWiggledValue(0, 5) }], duration: 2 * FRAME_RATE, onfinish: () => {
				this._playDeathFxAnimation(aIsInstantKill_bl);
			}}
		];

		Sequence.start(this.spineView, l_seq);
	}

	changeShadowPosition()
	{
		let x = 0, y = 0, scale = 1, alpha = 1;

		this.shadow.position.set(x, y);
		this.shadow.scale.set(scale);
		this.shadow.alpha = alpha;
	}

	getWalkAnimationName()
	{
		return this._calcWalkAnimationName(this.direction);
	}

	_calcWalkAnimationName(aDirection_str, aBaseWalkAnimationName_str = "walk")
	{
		switch (aDirection_str)
		{
			case DIRECTION.LEFT_UP:
				return '270_' + aBaseWalkAnimationName_str;
				break;
			case DIRECTION.LEFT_DOWN:
				return '0_' + aBaseWalkAnimationName_str;
				break;
			case DIRECTION.RIGHT_UP:
				return '180_' + aBaseWalkAnimationName_str;
				break;
			case DIRECTION.RIGHT_DOWN:
				return '90_' + aBaseWalkAnimationName_str;
				break;
		}
		throw new Error (aDirection_str + " is not supported direction.");
	}

	getImpactAnimationName()
	{
		return this._calcImpactAnimationName(this.direction);
	}

	_calcImpactAnimationName(aDirection_str, aBaseImpactAnimationName_str = "hit")
	{
		switch (aDirection_str)
		{
			case DIRECTION.LEFT_UP:
				return '270_' + aBaseImpactAnimationName_str;
				break;
			case DIRECTION.LEFT_DOWN:
				return '0_' + aBaseImpactAnimationName_str;
				break;
			case DIRECTION.RIGHT_UP:
				return '180_' + aBaseImpactAnimationName_str;
				break;
			case DIRECTION.RIGHT_DOWN:
				return '90_' + aBaseImpactAnimationName_str;
				break;
		}
		throw new Error (aDirection_str + " is not supported direction.");
	}

	getTurnAnimationName()
	{
		let lDirectionsAngles_int_arr = [0, 90, 180, 270]; //CCW
		let lFinalAngle_num = Number(this.direction.substr(3));
		let lFinalAngleIndex_int = lDirectionsAngles_int_arr.indexOf(lFinalAngle_num);

		let j = this.turnDirection == TURN_DIRECTION.CCW ? -1 : 1;
		let lPreviousAngleIndex_int = (lFinalAngleIndex_int + j) % lDirectionsAngles_int_arr.length;
		if (lPreviousAngleIndex_int < 0)
		{
			lPreviousAngleIndex_int = lDirectionsAngles_int_arr.length + lPreviousAngleIndex_int;
		}
		let lPreviousAngle_num = lDirectionsAngles_int_arr[lPreviousAngleIndex_int];

		return (this.turnPrefix + lPreviousAngle_num + this.turnAnglesSeparator + lFinalAngle_num + this.turnPostfix); //i.e. 270_to_180_turn
	}

	get turnPostfix()
	{
		return "_turn";
	}

	get turnPrefix()
	{
		return "";
	}

	get turnAnglesSeparator()
	{
		return "_to_";
	}

	get curAnimationFrameTime()
	{
		let animTrack = this.curAnimationTrack;
		if (animTrack)
		{
			return animTrack.animationLast;
		}

		return undefined;
	}

	getTurnSuffix()
	{
		let lFinalDirection_str = this.direction;
		let lTurnDirection_str = this.turnDirection;

		let lDirections_str_arr = [	DIRECTION.LEFT_DOWN,
									DIRECTION.RIGHT_DOWN,
									DIRECTION.RIGHT_UP,
									DIRECTION.LEFT_UP
									];

		let lFinalDirectionIndex_int = lDirections_str_arr.indexOf(lFinalDirection_str);

		let j = lTurnDirection_str == TURN_DIRECTION.CCW ? -1 : 1;
		let lPreviousDirection_ind = (lFinalDirectionIndex_int + j) % lDirections_str_arr.length;
		if (lPreviousDirection_ind < 0)
		{
			lPreviousDirection_ind = lDirections_str_arr.length + lPreviousDirection_ind;
		}
		let lPreviousDirection_str = lDirections_str_arr[lPreviousDirection_ind];

		if (lTurnDirection_str == TURN_DIRECTION.CW)
		{
			return lPreviousDirection_str.substr(3);
		}
		else if (lTurnDirection_str == TURN_DIRECTION.CCW)
		{
			return lFinalDirection_str.substr(3);
		}
		throw new Error ('Wrong turn direction ' + lTurnDirection_str);
	}

	getLocalCenterOffset()
	{
		let pos = {x: 0, y: 0};
		switch (this.name)
		{
			
		}
		return pos;
	}

	_onSpineViewChanged()
	{
		//to be overriden
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