import SpineEnemy from './SpineEnemy';
import { STATE_DEATH, STATE_TURN,  STATE_WALK, STATE_SPAWN } from './Enemy';
import Enemy from './Enemy';
import Timer from '../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../shared/src/CommonConstants';
import * as Easing from '../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import Sequence from '../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { ColorOverlayFilter } from "../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Filters";


export const STATE_PRE_DEATH 	= 'dead';
const STATE_NORMAL 	= 0;
const STATE_RAGE 	= 1;
export const STATE_RAGE_HEALTH_VALUE 	= 0.1;

class BossEnemy extends SpineEnemy
{
	static get EVENT_ON_DEATH_ANIMATION_CRACK()		 		{ return Enemy.EVENT_ON_DEATH_ANIMATION_CRACK; }
	static get EVENT_ON_DEATH_ANIMATION_OUTRO_STARTED()		{ return Enemy.EVENT_ON_DEATH_ANIMATION_OUTRO_STARTED; }
	static get EVENT_ON_TIME_TO_EXPLODE_COINS()				{ return Enemy.EVENT_ON_TIME_TO_EXPLODE_COINS; }
	static get EVENT_ON_BOSS_BECOME_VISIBLE()		 		{ return 'onBossBecomeVisible'; }
	static get EVENT_ON_BOSS_APPEARED()		 				{ return 'onBossAppeared'; }
	static get EVENT_BOSS_IS_ENRAGED()		 				{ return 'onBossIsEnraged'; } //rage state started

	constructor(params)
	{
		super(params);

		this._fSpineDelayFix_tmr = null;
		this.visible = false;

		this._fPauseTimeMarker_num = undefined;

		this._fPlayerWin_obj = null;
		this._fIsRageHighlightInProgress = null;
		this._fWhiteHitHighlightFilter = null;
		this._fColorWhiteOverlay_s = null;
		this._fStateBossMode_s = null;
		this._fIsDeathBossAnimationStarted_bl = null;
		this._fIsRageState_bl = false;
		this._fIsIsInstantKill_bl = false;
		
		//DEBUG CROSSHAIR SHIFTING AREAS
		// let lCrosshairsOffsetPosition_pt = this.crosshairsOffsetPosition;
		// let lr = this.container.addChild(new PIXI.Graphics);
		// lr.beginFill(0x00ff00, 0.7).drawRect(-this.__maxCrosshairDeviationOnEnemyX, -this.__maxCrosshairDeviationOnEnemyY, this.__maxCrosshairDeviationOnEnemyX*2, this.__maxCrosshairDeviationOnEnemyY*2).endFill();
		// lr.x += this.getLocalCenterOffset().x + lCrosshairsOffsetPosition_pt.x;
		// lr.y += this.getLocalCenterOffset().y + lCrosshairsOffsetPosition_pt.y;
		// lr.zIndex = 999999999999;

		// let lrz = this.container.addChild(new PIXI.Graphics);
		// lrz.beginFill(0xff0000, 0.7).drawRect(-this.__maxCrosshairDeviationTwoOnEnemyX, -this.__maxCrosshairDeviationTwoOnEnemyY, this.__maxCrosshairDeviationTwoOnEnemyX*2, this.__maxCrosshairDeviationTwoOnEnemyY*2).endFill();
		// lrz.x += this.getLocalCenterOffset().x + lCrosshairsOffsetPosition_pt.x;
		// lrz.y += this.getLocalCenterOffset().y + lCrosshairsOffsetPosition_pt.y;
		// lrz.zIndex = 999999999999;

		this._updateBossMode();
	}

	get _isSupportRotateInMotion()
	{
		return false;
	}

	get turnPostfix()
	{
		return "";
	}

	onTimeToExplodeCoins()
	{
		this.__onTimeToExplodeCoins();
	}

	getSpineSpeed()
	{
		return this.speed * 1;
	}

	_invalidateStates()
	{
		super._invalidateStates();
	}

	_calcWalkAnimationName()
	{
		return "walk";
	}

	_calcPreDeathAnimationName()
	{
		return 'dead';
	}

	_calcSpawnAnimationName()
	{
		return 'spawn';
	}

	_calculateSpineTurnName(aAnimName_str, aSpineName_str)
	{
		return aSpineName_str;
	}

	_calculateAnimationName(stateType)
	{
		if (stateType === STATE_SPAWN)
		{
			return this._calcSpawnAnimationName();
		}
		else if (stateType === STATE_WALK)
		{
			return this._calcWalkAnimationName();
		}
		else if (stateType === STATE_PRE_DEATH)
		{
			return this._calcPreDeathAnimationName();
		}

		return super._calculateAnimationName(stateType);
	}

	_calculateAnimationLoop(stateType)
	{
		let animationLoop = true;

		switch(stateType)
		{
			case STATE_DEATH:
			case STATE_TURN:
			case STATE_SPAWN:
			case STATE_PRE_DEATH:
			{
				animationLoop = false;
				break;
			}
		}

		return animationLoop;
	}

	_calculateSpineSpriteNameSuffix(stateType)
	{
		return "";
	}

	showBossAppearance(aNeedShowBoss_bl = true)
	{
		this.visible = aNeedShowBoss_bl;
		this._setSpawnState();

		if (this.container)
		{
			this.container.visible = aNeedShowBoss_bl;
		}
	}
	
	skipBossAppearance()
	{
		this.container.visible = true;
		this._fBossAppearanceInProgress_bln = false;
	}

	onDissaperingDeathAnimationCompleted()
	{
		this.__onDeathAnimationCompleted();
	}

	doVisibleBossOnAppearance()
	{
		this.visible = true;

		if (this.container)
		{
			this.container.visible = true;
		}
	}
	
	_setSpawnState()
	{
		this.container.visible = true;
		this.changeTextures(STATE_SPAWN);
		this.spineView.view.state.onComplete = this._onSpawnAnimationCompleted.bind(this);
	}

	__onBossBecomeVisible()
	{
		this.emit(BossEnemy.EVENT_ON_BOSS_BECOME_VISIBLE);
	}

	_onSpawnAnimationCompleted()
	{
		if (!this.spineView)
		{
			return;
		}

		this.spineView.clearStateListeners();
		if (this.isFrozen || this.allowUpdatePosition === false)
		{
			this.setStay();
		}
		else
		{
			this.changeTextures(STATE_WALK);
		}
		this._onBossAppear();

		this.emit(BossEnemy.EVENT_ON_BOSS_APPEARED);
	}

	_pauseBossWalking()
	{
		if (!isNaN(this._fPauseTimeMarker_num)) return; // already paused

		this._fPauseTimeMarker_num = (new Date()).getTime();

		this.emit(Enemy.EVENT_ON_ENEMY_PAUSE_WALKING, {enemyId: this.id});
	}

	_resumeBossWalking()
	{
		let delta = 0;
		if (!isNaN(this._fPauseTimeMarker_num))
		{
			delta = (new Date()).getTime() - this._fPauseTimeMarker_num;
			this._fPauseTimeMarker_num = undefined;
		}

		let pt = {x: this.x, y: this.y};
		pt.y += this.getCurrentFootPointPosition().y;
		pt.x += this.getCurrentFootPointPosition().x;
		this.emit(Enemy.EVENT_ON_ENEMY_ADD_TRAJECTORY_POINT, {enemyId: this.id, x: pt.x, y: pt.y, timeOffset: -delta});

		this.emit(Enemy.EVENT_ON_ENEMY_RESUME_WALKING, {enemyId: this.id, timeOffset: delta});
	}

	setDeathFramesAnimation(aIsInstantKill_bl = false, aPlayerWin_obj = null)
	{
		this._fIsIsInstantKill_bl = aIsInstantKill_bl;

		if(aIsInstantKill_bl)
		{
			this._playDeathFxAnimation(aIsInstantKill_bl);
		}
		else
		{
			this._deathInProgress = true;

			this.emit(Enemy.EVENT_ON_DEATH_ANIMATION_STARTED, {position: lEnemyPosition_pt, angle: this.angle});

			this._startDeathSpineAnim(aPlayerWin_obj);

			let lEnemyPosition_pt = this.getGlobalPosition();
			lEnemyPosition_pt.x += this.getCurrentFootPointPosition().x;
			lEnemyPosition_pt.y += this.getCurrentFootPointPosition().y;
		}
	}

	_playDeathFxAnimation(aIsInstantKill_bl)
	{
		this._fIsDeathBossAnimationStarted_bl = true;
		super._playDeathFxAnimation(aIsInstantKill_bl);
	}

	_startDeathSpineAnim(aPlayerWin_obj)
	{
		this.spineView.view.state.onComplete = null;
		this.spineView.clearStateListeners();
		this.stateListener = null;

		this._deathOutroAnimationStarted = true;

		this._fPlayerWin_obj = aPlayerWin_obj;
		this._playBossDeathFxAnimation(aPlayerWin_obj);
		this.changeTextures(STATE_PRE_DEATH);

		try
		{
			this.emit(BossEnemy.EVENT_ON_DEATH_ANIMATION_OUTRO_STARTED, {position: this.getGlobalPosition(), isCoPlayerWin: this._fPlayerWin_obj.coPlayerWin});
		}
		catch (err)
		{

		}
	}

	_playBossDeathFxAnimation()
	{
		this._fIsDeathBossAnimationStarted_bl = true;
	}

	_onDeathSpineAnimCompleted(aPlaySound_bln = true)
	{
		if(!this._fIsIsInstantKill_bl)
		{
			this.emit(BossEnemy.EVENT_ON_DEATH_ANIMATION_CRACK, {playSound: aPlaySound_bln});
		}

		this._fSpineDelayFix_tmr = null;
		this.dissolveShadow();
	}

	changeSpineView(type, noChangeFrame)
	{
		super.changeSpineView(type, noChangeFrame);
	}

	changeTextures(type)
	{
		if (type == STATE_TURN)
		{
			super.changeTextures(STATE_WALK);
		}
		else
		{
			super.changeTextures(type);
		}
	}

	__onDeathAnimationCompleted()
	{
		this._deathInProgress = false;
		this._deathOutroAnimationStarted = false;

		this.destroy();
	}

	__onTimeToExplodeCoins()
	{
		if (this._fPlayerWin_obj && (this._fPlayerWin_obj.coPlayerWin || this._fPlayerWin_obj.playerWin))
		{
			this._onDeathSpineAnimCompleted(!this._fPlayerWin_obj.coPlayerWin)
			this.emit(BossEnemy.EVENT_ON_TIME_TO_EXPLODE_COINS, {position: this.getGlobalPosition(), isCoPlayerWin: this._fPlayerWin_obj.coPlayerWin});
		}
	}

	changeShadowPosition()
	{
		if(!this.shadow) return;

		this.shadow.position.set(0, 60);
		// this.shadow.scale.set(1.7);
	}

	get rageHealthProgressValue()
	{
		return STATE_RAGE_HEALTH_VALUE;
	}

	_onEnergyUpdated(data)
	{
		super._onEnergyUpdated(data);
		this._updateBossMode();
	}

	_updateBossMode()
	{
		this._fIsRageState_bl = (this.energy / this.fullEnergy).toFixed(10) <= this.rageHealthProgressValue;

		if (this._fIsRageState_bl)
		{
			this._fStateBossMode_s = STATE_RAGE;
			this._playRageAnimation();
			this.emit(BossEnemy.EVENT_BOSS_IS_ENRAGED);
		}
		else
		{
			this._fStateBossMode_s = STATE_NORMAL;
		}
	}

	_playRageAnimation()
	{
		if (this._fStateBossMode_s != STATE_RAGE || this._fIsRageHighlightInProgress || this._fIsDeathBossAnimationStarted_bl)
		{
			return;
		}

		this._fHitHighlightIntensitySeq && this._fHitHighlightIntensitySeq.destructor();
		this._fHitHighlightIntensitySeq = null;

		this._clearHitHighlightAnimation();
		this._checkHitHighlightFilter();

		let aTime_num = 16 * FRAME_RATE;
		this._fIsRageHighlightInProgress = true;
		this._hitHighlightInProgress = true;
		let aOptIntensity_num = this._baseGitHighlightFilterIntensity;

		let lHighlight_seq = [
			{tweens: [], duration: 3 * FRAME_RATE},
			{tweens: [{prop: "intensity.value", to: aOptIntensity_num}], ease: Easing.sine.easeIn, duration: aTime_num},
			{tweens: [{prop: "intensity.value", to: 0}], ease: Easing.quadratic.easeOut, duration: aTime_num, onfinish: this._completePlayRageAnimation.bind(this)}
		];
		this._fHitHighlightIntensitySeq = Sequence.start(this._hitHighlightFilterIntensity, lHighlight_seq);
	}

	_completePlayRageAnimation()
	{
		this._fIsRageHighlightInProgress = false;
		this._playRageAnimation();
	}

	_playHitHighlightAnimation(aTime_num)
	{
		if (this._fStateBossMode_s != STATE_RAGE)
		{
			super._playHitHighlightAnimation(aTime_num);
		}
		else
		{
			this._playWhiteHighlightAnimation();
		}
	}

	get colorWhiteOverlayFilter()
	{
		if (!this._fWhiteHitHighlightFilter)
		{
			this._fWhiteHitHighlightFilter = new ColorOverlayFilter(0xFFFFFF, 0);
		}
		return this._fWhiteHitHighlightFilter;
	}

	_playWhiteHighlightAnimation()
	{
		if (this._fColorWhiteOverlay_s)
		{
			this._destroyWhiteColorOverlay();
		}

		if (!this.spineView || !this.spineView.filters)
		{
			return;
		}

		let lColorOverlayFilter_f =  this.colorWhiteOverlayFilter;
		this.spineView.filters.push(lColorOverlayFilter_f);

		let lFilterAlpha_seq = [
			{tweens: [{prop: 'uniforms.alpha', to: 0.5}], duration: 3 * FRAME_RATE},
			{tweens: [{prop: 'uniforms.alpha', to: 0}], duration: 3 * FRAME_RATE,
				
				onfinish: ()=>{
					this._destroyWhiteColorOverlay();
				}
			}];
		
		this._fColorWhiteOverlay_s = Sequence.start(lColorOverlayFilter_f, lFilterAlpha_seq);
	}

	_destroyWhiteColorOverlay()
	{
		let lColorOverlayFilter_f =  this.colorWhiteOverlayFilter;

		if (this.spineView && this.spineView.filters)
		{
			let lIndex_int = this.spineView.filters.indexOf(lColorOverlayFilter_f);
			if (~lIndex_int)
			{
				this.spineView.filters.splice(lIndex_int, 1);
				this._fColorWhiteOverlay_s = null;
			}
		}

		Sequence.destroy(Sequence.findByTarget(lColorOverlayFilter_f));
	}

	get crosshairsOffsetPosition()
	{
		let lOffset_pt = {x: 0, y: 0};

		let lContainerPos_pt = this.container.position;

		lOffset_pt.x += lContainerPos_pt.x;
		lOffset_pt.y += lContainerPos_pt.y;

		return lOffset_pt;
	}

	get __maxCrosshairDeviationTwoOnEnemyX() //maximum deviation in X position of the cursor on the body of the enemy for the second area
	{
		return 20;
	}

	get __maxCrosshairDeviationTwoOnEnemyY() //maximum deviation in Y position of the cursor on the body of the enemy for the second area
	{
		return 20;
	}

	_getPositionConsideringScreenEdges(aCenter_pt) //checking the position of the center of the enemy, taking into account the edges of the screen
	{
		let lOffset_pt = {x: 0, y:0};

		let lIsFirstAreaValid_bl = this.checkIfCanPutLockInArea(aCenter_pt, this.__maxCrosshairDeviationOnEnemyX, this.__maxCrosshairDeviationOnEnemyY);

		if (lIsFirstAreaValid_bl)
		{
			lOffset_pt = this._getPositionConsideringScreenEdgesOffset(aCenter_pt, this.__maxCrosshairDeviationOnEnemyX, this.__maxCrosshairDeviationOnEnemyY);
		}
		else if (this.checkIfCanPutLockInArea(aCenter_pt, this.__maxCrosshairDeviationTwoOnEnemyX, this.__maxCrosshairDeviationTwoOnEnemyY))
		{
			lOffset_pt = this._getPositionConsideringScreenEdgesOffset(aCenter_pt, this.__maxCrosshairDeviationTwoOnEnemyX, this.__maxCrosshairDeviationTwoOnEnemyY);
		}
		
		this.currentCrosshairDeviationX = lOffset_pt.x;
		this.currentCrosshairDeviationY = lOffset_pt.y;

		return {x: aCenter_pt.x + lOffset_pt.x, y: aCenter_pt.y + lOffset_pt.y};
	}

	checkIfCanPutLockInArea(aCenter_pt, aOffsetX_num, aOffsetY_num)
	{
		let lIsXFits_bl = false;
		let lIsYFits_bl = false;
		
		if (aCenter_pt.x >= (this.crosshairPaddingXLeft - aOffsetX_num) && aCenter_pt.x <= (this.rightScreenBorderForCrosshair + aOffsetX_num))
		{
			lIsXFits_bl = true;
		}

		if (aCenter_pt.y >= (this.crosshairPaddingYBottom - aOffsetY_num) && aCenter_pt.y <= (this.topScreenBorderForCrosshair + aOffsetY_num))
		{
			lIsYFits_bl = true;
		}

		return lIsXFits_bl && lIsYFits_bl;
	}

	_getPositionConsideringScreenEdgesOffset(aCenter_pt, aOffsetX_num, aOffsetY_num)
	{
		let lx_num = 0;
		let ly_num = 0;

		if (aCenter_pt.x < this.crosshairPaddingXLeft)
		{
			lx_num = (-aCenter_pt.x+this.crosshairPaddingXLeft) < (aOffsetX_num ) ? -aCenter_pt.x+this.crosshairPaddingXLeft : (aOffsetX_num);
		}
		else if (aCenter_pt.x > this.rightScreenBorderForCrosshair)
		{
			lx_num = (aCenter_pt.x - this.rightScreenBorderForCrosshair) < aOffsetX_num ? -aCenter_pt.x + this.rightScreenBorderForCrosshair : -aOffsetX_num;
		}

		if (aCenter_pt.y < this.crosshairPaddingYBottom)
		{
			ly_num = (-aCenter_pt.y+this.crosshairPaddingYBottom) < (aOffsetY_num) ? -aCenter_pt.y + this.crosshairPaddingYBottom : aOffsetY_num;
		}
		else if (aCenter_pt.y > this.topScreenBorderForCrosshair)
		{
			ly_num = (aCenter_pt.y - this.topScreenBorderForCrosshair) < aOffsetY_num ? -aCenter_pt.y + this.topScreenBorderForCrosshair : -aOffsetY_num;
		}

		return {x: lx_num, y: ly_num};
	}

	destroy(purely)
	{
		this._fPauseTimeMarker_num = undefined;
		this._fSpineDelayFix_tmr = null;

		this._fPlayerWin_obj = null;

		Sequence.destroy(Sequence.findByTarget(this._hitHighlightFilterIntensity));
		Sequence.destroy(Sequence.findByTarget(this.colorWhiteOverlayFilter));

		this._fIsRageHighlightInProgress = null;

		this._fWhiteHitHighlightFilte && this._fWhiteHitHighlightFilte.destroy();
		this._fWhiteHitHighlightFilter = null;

		this._fColorWhiteOverlay_s = null;
		this._fStateBossMode_s = null;
		this._fIsDeathBossAnimationStarted_bl = null;

		super.destroy(purely);
	}
}

export default BossEnemy;