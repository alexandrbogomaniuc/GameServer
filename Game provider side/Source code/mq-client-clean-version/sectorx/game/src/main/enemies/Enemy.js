import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sprite from '../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import Sequence from '../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import * as Easing from '../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { Utils } from '../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import DeathFxAnimation from '../animation/death/DeathFxAnimation';
import { WHITE_FILTER } from '../../config/Constants';
import { WEAPONS, ENEMIES, ENEMY_TYPES, FRAME_RATE, isBossEnemy } from '../../../../shared/src/CommonConstants';
import GameDebuggingController from '../../controller/debug/GameDebuggingController';
import GameScreen from '../GameScreen';
import { Z_INDEXES } from '../../controller/uis/game_field/GameFieldController';
import EnemyShadow from './shadows/EnemyShadow';
import CommonEffectsManager from '../CommonEffectsManager';
import DeathFromKillerCapsuleFxAnimation from '../animation/death/DeathFromKillerCapsuleFxAnimation';
import { generate_enemy_ice_explosion_textures, generate_freeze_cover_explosion_textures, generate_freeze_spin_textures, generate_ice_melting_effect, generate_ice_parts } from '../../view/uis/capsule_features/FreezeCapsuleFeatureView';
import { Tween } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';

const HIT_BOUNCE_TIME = 70;
const CROSSHAIR_POSITION_ACCURACY = 0.01;
const HALF_PI = Math.PI / 2;

export const SPINE_SCALE = 0.4;
export const TURN_ANIM_TIME = 1000;

export const STATE_STAY 	= 'stay';
export const STATE_WALK 	= 'walk';
export const STATE_IMPACT 	= 'impact';
export const STATE_DEATH 	= 'death';
export const STATE_TURN 	= 'turn';
export const STATE_SPAWN	= 'spawn'; // for boss

const MOVE_TYPES = {
	CRAWL:		0,
	WALK:		1,
	LEVITATE:	2,
	JUMP:		3,
	FLY_HIGH:	4
}

const ENEMIES_SCALES = 
{
	[ENEMIES.Rocky]:						0.35,
	[ENEMIES.Pointy]:						0.13,
	[ENEMIES.Spiky]:						0.33,
	[ENEMIES.Trex]:							0.38,
	[ENEMIES.Krang]:						0.22,
	[ENEMIES.Kang]:							0.3,
	[ENEMIES.OneEye]:						0.23,
	[ENEMIES.PinkFlyer]:					0.22,
	[ENEMIES.YellowAlien]:					0.33,
	[ENEMIES.SmallFlyer]:					0.25,
	[ENEMIES.JumperBlue]:					0.22,
	[ENEMIES.JumperGreen]:					0.22,
	[ENEMIES.JumperWhite]:					0.22,
	[ENEMIES.GreenHopper]:					0.25,
	[ENEMIES.FlyerMutalisk]:				0.18,
	[ENEMIES.Slug]:							0.19,
	[ENEMIES.Jellyfish]:					0.13,
	[ENEMIES.Mflyer]:						0.08,
	[ENEMIES.RedHeadFlyer]:					0.14,
	[ENEMIES.Froggy]:						0.3,
	[ENEMIES.EyeFlyerGreen]:				0.12,
	[ENEMIES.EyeFlyerPurple]:				0.12,
	[ENEMIES.EyeFlyerRed]:					0.12,
	[ENEMIES.EyeFlyerYellow]:				0.12,
	[ENEMIES.Bioraptor]:					0.25,
	[ENEMIES.Crawler]:						0.25,
	[ENEMIES.MothyBlue]:					0.36,
	[ENEMIES.MothyRed]:						0.36,
	[ENEMIES.MothyWhite]:					0.36,
	[ENEMIES.MothyYellow]:					0.36,
	[ENEMIES.Flyer]:						0.33,
	[ENEMIES.Money]:						0.54,
	[ENEMIES.GiantTrex]:					0.57,
	[ENEMIES.GiantPinkFlyer]:				0.33,

	[ENEMIES.LaserCapsule]:					0.5,
	[ENEMIES.KillerCapsule]:				0.5,
	[ENEMIES.LightningCapsule]:				0.5,
	[ENEMIES.GoldCapsule]:					0.5,
	[ENEMIES.BulletCapsule]:				0.5,
	[ENEMIES.BombCapsule]:					0.5,
	[ENEMIES.FreezeCapsule]:				0.5,

	[ENEMIES.FireBoss]:						0.7,
	[ENEMIES.LightningBoss]:				0.5,
}



class Enemy extends Sprite
{
	static get EVENT_ON_ENEMY_START_DYING()					{ return "onEnemyStartDying"; }
	static get EVENT_ON_DEATH_ANIMATION_STARTED() 			{ return "deathAnimationStarted"; }
	static get EVENT_ON_DEATH_ANIMATION_CRACK()		 		{ return "deathAnimationCrack"; }
	static get EVENT_ON_DEATH_ANIMATION_OUTRO_STARTED() 	{ return "deathAnimationOutroStarted"; }
	static get EVENT_ON_DEATH_ANIMATION_COMPLETED() 		{ return "deathAnimationCompleted";}
	static get EVENT_ON_ENEMY_VIEW_REMOVING() 				{ return "onEnemyViewRemoving"; }
	static get EVENT_ON_ENEMY_ADD_TRAJECTORY_POINT()		{ return "onEnemyAddTrajectoryPoint"; }
	static get EVENT_ON_ENEMY_PAUSE_WALKING() 				{ return "onEnemyPauseWalking"; }
	static get EVENT_ON_ENEMY_RESUME_WALKING() 				{ return "onEnemyResumeWalking"; }
	static get EVENT_ON_ENEMY_DESTROY()						{ return "onEnemyDestroy"; }
	static get EVENT_ON_ICE_EXPLOSION_ANIMATION_STARTED() 	{ return "onIceExplosionAnimationStarted"; }

	static get EVENT_ON_TIME_TO_EXPLODE_COINS()				{ return "onTimeToExplodeCoin"; }

	static get EVENT_ON_DEATH_COIN_AWARD()					{ return DeathFxAnimation.EVENT_ON_DEATH_COIN_AWARD }

	static get EVENT_ON_ENEMY_SPAWN_SFX()					{ return "onEnemySpawnSound"; }
	static get EVENT_ON_ENEMY_DEATH_SFX()					{ return "onEnemyDeathSound"; }

	static get EVENT_ON_FINISH_ICE_MELT()					{ return "onFinishIceMelt"; }

	static getEnemyDefaultScaleCoef(aEnemyName_str)
	{
		return ENEMIES_SCALES[aEnemyName_str] || 1;
	}

	set deathReason(aValue_num)
	{
		this._fDeathReason_num = aValue_num;
	}

	get isEnemyLockedForTarget()
	{
		return false;
	}

	get circularEnemyCount_num ()
	{
		return 0;
	}

	get deathReason()
	{
		return this._fDeathReason_num;
	}

	set energy(aValue_num)
	{
		this._fEnergy_num = aValue_num;
		if (this._fEnergy_num < 0) this._fEnergy_num = 0;
	}

	set angle(aValue_num)
	{
		this._angle = aValue_num;
	}

	get angle()
	{
		return this._angle;
	}

	get energy()
	{
		if (this._fEnergy_num > this.fullEnergy)
		{
			return this.fullEnergy;
		}
		return this._fEnergy_num;
	}

	get isDeathActivated()
	{
		return this._fIsDeathActivated_bl;
	}

	set fullEnergy(aValue_num)
	{
		this._fFullEnergy_num = aValue_num;
	}

	get fullEnergy()
	{
		return this._fFullEnergy_num;
	}

	set childHvEnemyId(aEnemyId_num)
	{
		this._fChildHvEnemyId_num = aEnemyId_num;
	}

	get isDeathOutroAnimationStarted()
	{
		return this._deathOutroAnimationStarted;
	}

	get isStayState()
	{
		return this.state == STATE_STAY;
	}

	get isWalkState()
	{
		return this.state == STATE_WALK;
	}

	get isTurnState()
	{
		return this.state == STATE_TURN;
	}

	get isSpawnState()
	{
		return this.state == STATE_SPAWN;
	}

	get isFireDenied()
	{
		return this._fIsFireDenied_bl;
	}

	set isFireDenied(aValue_bl)
	{
		this._fIsFireDenied_bl = aValue_bl;
	}

	get trajectoryPositionChangeInitiated()
	{
		return this._fIsTrajectoryPositionChangeInitiated_bl;
	}

	set trajectoryPositionChangeInitiated(aValue_bl)
	{
		this._fIsTrajectoryPositionChangeInitiated_bl = aValue_bl;
	}

	get crosshairsOffsetPosition()
	{
		let lOffset_pt = {x: 0, y: 0};

		let lContainerPos_pt = this.container.position;

		lOffset_pt.x += lContainerPos_pt.x;
		lOffset_pt.y += lContainerPos_pt.y;

		return lOffset_pt;
	}

	get isFrozen()
	{
		return this.__fIsFrozen_bl;
	}

	i_freeze()
	{
		this.__freezeIfRequired();
	}

	i_unfreeze()
	{
		this.__unfreezeIfRequired();
	}

	i_playPreDeathAnimation()
	{
		this.destroy();
	}

	i_hitHiglightUpdate()
	{
		this._hitHiglightUpdate();
	}
	
	playHitHighlightAnimation(time)
	{
		this._playHitHighlightAnimation(time);
	}

	hideEnemyEffectsBeforeDeathIfRequired()
	{
		return;
	}

	__onBeforeNewTrajectoryApplied()
	{
		// to be overridden
	}

	addLaserNetSmoke()
	{
		this._addLaserNetSmoke();
	}

	onEnergyUpdated(data)
	{
		this._onEnergyUpdated(data);
	}

	updateTrajectory(aTrajectory_obj)
	{
		this.__onBeforeNewTrajectoryApplied(aTrajectory_obj);

		this.trajectory = aTrajectory_obj;
		this.speed = aTrajectory_obj.speed || this.speed;

		this._validateTrajectoryPoints();

		this.changeView();
	}

	_validateTrajectoryPoints()
	{
		let lPoints = this.trajectory.points;
		for (let i=0; i<lPoints.length; i++)
		{
			let lPoint = lPoints[i];
			if (i == 0)
			{
				lPoint.isStartPoint = true;
				continue;
			}

			if (i == lPoints.length-1)
			{
				lPoint.isEndPoint = true;
				continue;
			}

			lPoint.isRealTurnPoint = false;

			let lPrevPoint = lPoints[i-1];
			let lNextPoint = lPoints[i+1];

			let lPrevAngle = !isNaN(lPrevPoint.angle) ? lPrevPoint.angle : undefined;
			if (isNaN(lPrevAngle))
			{
				for (let j=i-1; j>=0; j--)
				{
					if (!Utils.isEqualPoints(lPoints[j], lPoint))
					{
						lPrevAngle = Math.atan2(lPoint.y - lPoints[j].y, lPoint.x - lPoints[j].x);
						break;
					}
				}

				if (isNaN(lPrevAngle))
				{
					lPoint.isRealTurnPoint = false;
					continue;
				}
			}

			let lNextAngle = !isNaN(lNextPoint.angle) ? lNextPoint.angle : undefined;
			if (isNaN(lNextAngle))
			{
				if (Utils.isEqualPoints(lNextPoint, lPoint))
				{
					lPoint.isRealTurnPoint = false;
					continue;
				}

				lNextAngle = Math.atan2(lNextPoint.y - lPoint.y, lNextPoint.x - lPoint.x);
			}

			lPrevAngle = GameScreen.normalizeAngle(lPrevAngle);
			lNextAngle = GameScreen.normalizeAngle(lNextAngle);
		}
	}

	updateLife(aVal_num)
	{
		this.life = aVal_num;
	}

	get invulnerable()
	{
		return this._fInvulnerable_bl;
	}

	set invulnerable(aValue_bl)
	{
		this._fInvulnerable_bl = aValue_bl;
	}

	isB3FormationEnemy()
	{
		return (this.parentEnemyTypeId == ENEMY_TYPES.MONEY) &&  this.isCircularTrajectory;
	}

	constructor(params)
	{
		super();

		this.params = params;

		this._fIgnoreCollisionsBodyPartsNames_str_arr = this.__generateIgnoreCollisionsBodyPartsNames();
		this._fPreciseCollisionBodyPartsNames_str_arr = this.__generatePreciseCollisionBodyPartsNames();

		this._fPrevUpdateAccurateTime_num = undefined;
		this._fInvulnerable_bl = false;
		this._curAnimationState = undefined;
		this._fIsUndetectableSpineBodyBounds_bl = false;

		//DEBUG...
		// this.tintColor = undefined;
		// this.tintIntencity = undefined;
		// this.shadowTintColor = undefined;
		//if (APP.currentWindow.mapsController.info.mapId === 1)
		// {
		// 	this._fGameDebuggingController_gdc = APP.gameDebuggingController;
		// 	this._fGameDebuggingController_gdc.on(GameDebuggingController.i_EVENT_TINT_UPDATE, this._onDebugTintUpdated, this);
		// 	this._fGameDebuggingController_gdc.on(GameDebuggingController.i_EVENT_SHADOW_TINT_UPDATE, this._onDebugShadowTintUpdated, this);
		// 	this.tintColor = APP.gameDebuggingController.debugTintColor;
		// 	this.tintIntensity = APP.gameDebuggingController.debugTintIntencity;
		// 	this.shadowTintColor = APP.gameDebuggingController.debugShadowTintColor;
		// }
		//...DEBUG

		this.parentEnemyId = params.parentEnemyId;
		this.parentEnemyTypeId = params.parentEnemyTypeId;
		this.typeId = params.typeId;
		this.name = params.name;
		this.id = params.id;
		this.radius = params.radius;
		this.life = 1;
		this.angle = params.angle;
		this.speed = params.trajectory.speed || params.speed; //2,4,8
		this.awardedPrizes = params.awardedPrizes;
		this.prizes = params.prizes;
		this._fEnergy_num = params.energy;
		this._fFullEnergy_num = params.fullEnergy;
		this.boss = params.boss;
		this.skin = params.skin;
		this.isCircularTrajectory = params.trajectory.isCircularTrajectory;
		this.isCircularLargeRadius = params.trajectory.isCircularLargeRadius;
		this.circularRadius = null;

		this._fLaserCapsileSmoke_spr_arr = [];

		this.startPosition = params.startPosition;
		this.trajectory = params.trajectory;
		this._validateTrajectoryPoints();
		this.swarmType = params.swarmType;

		this._fLastPosition_obj = null;

		this.__initBottomFXContainer();

		this.container = this.addChild(new Sprite);
		this.container.zIndex = 1;

		this.__initTopFXContainer();

		this.imageName = this.getImageName(this.name);
		this.isEnded = false;

		this.state = null;
		this._fIsImpactAnimationInProgress_bl = false;
		this.spineSpeed = this.getSpineSpeed();

		this.hitBounceDelta = null;
		this.bombBounceDelta = null;
		this.currentHitBounceDelta = null;
		this.currentBombBounceDelta = null;

		this._deathInProgress = false;
		this._deathOutroAnimationStarted = false;
		this._fBonesFellDown_bl = false;

		this.deathFxAnimation = null;

		this.view = null;
		this.viewPos = null;
		this.spineView = null;
		this._fCurSpineName_str = undefined;
		this.spineViewPos = null;
		this.shadow = null;
		this.footPoint = null;

		this.stepTimers = null;
		this._stepsAmount = undefined;

		this._fChildHvEnemyId_num = undefined;

		this._fIsFireDenied_bl = false;
		this._fIsTrajectoryPositionChangeInitiated_bl = false;

		this._fBossAppearanceInProgress_bln = false;
		this.setSpineViewPos();
		this.setViewPos();

		this.addShadow();
		this.addFootPoint();
		this.changeShadowPosition();
		this.changeFootPointPosition();

		let lShowAppearanceEffect_bl = !params.allowUpdatePosition;
		this._fIsLasthand_bl = params.isLasthand;
		this._createView(lShowAppearanceEffect_bl);

		this._fIsDeathActivated_bl = false;
		this._fDeathAnimationInProgress_bl = false;

		this._fDeathReason_num = null;

		this._gameScreen = APP.currentWindow;
		this._gameField = this._gameScreen.gameFieldController;

		this._firstPoint = null;

		this._fPauseWalkingTimeMarker_num = undefined;

		this.__freezeSuspicionAfterCreation();

		this._fCurrentCrosshairDeviationX_num = 0;
		this._fCurrentCrosshairDeviationY_num = 0;
		this._fMaxCrosshairOffsetOnSpineEnemyX_num = null;
		this._fMaxCrosshairOffsetOnSpineEnemyY_num = null;
		this._fPointInsideRectWidth_num = null;
		this._fPointInsideRectHeight_num = null;
		this._fBottomScreenBorderForCrosshair_num = null;
		this._fTopScreenBorderForCrosshair_num = null;

		this._invalidateStates();
	}

	get isLasthand()
	{
		return !!this._fIsLasthand_bl;
	}

	//virtual protected
	_updateTint()
	{
		// nothing to do
	}

	//virtual protected
	_untint()
	{
		// nothing to do
	}

	_onDebugTintUpdated()
	{
		// nothing to do
	}

	_onDebugShadowTintUpdated()
	{
		this.shadowTintColor = APP.gameDebuggingController.debugShadowTintColor;
		this._rerenderShadow();
	}

	__initTopFXContainer()
	{
		this._fTopContainer_sprt = this.addChild(new Sprite);
		this._fTopContainer_sprt.zIndex = 4;
	}

	__initBottomFXContainer()
	{
		this._fBottomContainer_sprt = this.addChild(new Sprite);
		this._fBottomContainer_sprt.zIndex = 0;
	}

	_onEnergyUpdated(data)
	{
		let lNewEnergy_num = data.energy;
		this.energy = lNewEnergy_num;
	}

	_invalidateStates()
	{
		this._fIsLasthand_bl = false;
	}

	isEnemyAvailableToShot()
	{
		//is invulnerable
		if(
			this.invulnerable
			|| this.life === 0 //is dead
			|| this._fDeathAnimationInProgress_bl
			|| !this.transform //the check for transform should be before the check for position, because position is taken from transform
			|| !this.position
		)
		{
			return false;
		}

		return true;
	}

	isTargetable()
	{
		if(!this.isEnemyAvailableToShot())
		{
			return false;
		}

		let lEnemyCenterPos_pt = this.getCenterPosition();
		if (!lEnemyCenterPos_pt)
		{
			return false;
		}

		let lCrosshairsOffsetPosition_pt = this.crosshairsOffsetPosition;
		lEnemyCenterPos_pt.x += lCrosshairsOffsetPosition_pt.x;
		lEnemyCenterPos_pt.y += lCrosshairsOffsetPosition_pt.y;
		let lPossibleCenter_pt = this._getPositionConsideringScreenEdges(lEnemyCenterPos_pt);

		//is out of screen
		
		return Utils.isPointInsideRect(new PIXI.Rectangle(this.crosshairPaddingXLeftWithAccuracy, this.crosshairPaddingYBottomWithAccuracy, this.pointInsideRectWidth, this.pointInsideRectHeight), lPossibleCenter_pt);;
	}

	getAccurateCenterPositionWithCrosshairOffset()
	{
		let lEnemyPos_pt = this.getCenterPosition();
		let lCrosshairAccurateOffsetPosition_pt = this.crosshairAccurateOffsetPosition;
		lEnemyPos_pt.x += lCrosshairAccurateOffsetPosition_pt.x;
		lEnemyPos_pt.y += lCrosshairAccurateOffsetPosition_pt.y;

		return lEnemyPos_pt;
	}

	get pointInsideRectWidth()
	{
		if (this._fPointInsideRectWidth_num)
		{
			return this._fPointInsideRectWidth_num;
		}

		this._fPointInsideRectWidth_num = APP.config.size.width - this.crosshairPaddingXRight - this.crosshairPaddingXLeft + CROSSHAIR_POSITION_ACCURACY * 2;
		return this._fPointInsideRectWidth_num;
	}

	get pointInsideRectHeight()
	{
		if (this._fPointInsideRectHeight_num)
		{
			return this._fPointInsideRectHeight_num;
		}

		this._fPointInsideRectHeight_num = APP.config.size.height - this.crosshairPaddingYTop - this.crosshairPaddingYBottom + CROSSHAIR_POSITION_ACCURACY * 2;
		return this._fPointInsideRectHeight_num;
	}

	get crosshairPaddingXLeft() //the minimum value of X at which the crosshair cannot go beyond the screen
	{
		return 19;
	}

	get crosshairPaddingXLeftWithAccuracy() //the minimum value of X at which the crosshair cannot go beyond the screen
	{
		return 19 - CROSSHAIR_POSITION_ACCURACY;
	}

	get crosshairPaddingXRight() //the minimum value of X at which the crosshair cannot go beyond the screen
	{
		return 20;
	}

	get crosshairPaddingYBottom() //bottom Y value at which the crosshair cannot go beyond the screen
	{
		return 35;
	}

	get crosshairPaddingYBottomWithAccuracy() //bottom Y value at which the crosshair cannot go beyond the screen
	{
		return 35 - CROSSHAIR_POSITION_ACCURACY;
	}

	get crosshairPaddingYTop() //top Y value at which the crosshair cannot go beyond the screen
	{
		return 29;
	}

	get crosshairAccurateOffsetPosition() //sight deviation taking into account the deviation on the enemy's body due to the edges of the screen
	{
		let lPosition_pt = {x: 0, y: 0};
		let lCrosshairsOffsetPosition_pt = this.crosshairsOffsetPosition;
		lPosition_pt.x += lCrosshairsOffsetPosition_pt.x + this.currentCrosshairDeviationX;
		lPosition_pt.y += lCrosshairsOffsetPosition_pt.y + this.currentCrosshairDeviationY;
		return lPosition_pt;
	}

	get __maxCrosshairDeviationOnEnemyX() //maximum deviation in X position of the cursor on the body of the enemy
	{
		APP.logger.i_pushWarning(`Enemy. __maxCrosshairDeviationOnEnemyX method must be overridden!`);
		console.error('__maxCrosshairDeviationOnEnemyX method must be overridden!');
		return 0;
	}

	get __maxCrosshairDeviationOnEnemyY() //maximum deviation in Y position of the cursor on the body of the enemy
	{
		APP.logger.i_pushWarning(`Enemy. __maxCrosshairDeviationOnEnemyY method must be overridden!`);
		console.error('__maxCrosshairDeviationOnEnemyY method must be overridden!');
		return 0;
	}

	get rightScreenBorderForCrosshair()
	{
		if (this._fBottomScreenBorderForCrosshair_num)
		{
			return this._fBottomScreenBorderForCrosshair_num;
		}

		this._fBottomScreenBorderForCrosshair_num = APP.config.size.width - this.crosshairPaddingXRight;
	}

	get topScreenBorderForCrosshair()
	{
		if (this._fTopScreenBorderForCrosshair_num)
		{
			return this._fTopScreenBorderForCrosshair_num;
		}

		this._fTopScreenBorderForCrosshair_num = APP.config.size.height - this.crosshairPaddingYTop;
	}

	_getPositionConsideringScreenEdges(aCenter_pt) //checking the position of the center of the enemy, taking into account the edges of the screen
	{
		let lx = 0;
		let ly = 0;
		let lOffsetX_num = this.__maxCrosshairDeviationOnEnemyX;
		let lOffsetY_num = this.__maxCrosshairDeviationOnEnemyY;

		if (aCenter_pt.x < this.crosshairPaddingXLeft)
		{
			lx = (-aCenter_pt.x+this.crosshairPaddingXLeft) < lOffsetX_num ? -aCenter_pt.x+this.crosshairPaddingXLeft : lOffsetX_num;
		}
		else if (aCenter_pt.x > this.rightScreenBorderForCrosshair)
		{
			lx = (aCenter_pt.x - this.rightScreenBorderForCrosshair) < lOffsetX_num ? -(aCenter_pt.x - this.rightScreenBorderForCrosshair) : -lOffsetX_num;
		}

		if (aCenter_pt.y < this.crosshairPaddingYBottom)
		{
			ly = (-aCenter_pt.y+this.crosshairPaddingYBottom) < lOffsetY_num ? -aCenter_pt.y+this.crosshairPaddingYBottom : lOffsetY_num;
		}
		else if (aCenter_pt.y > this.topScreenBorderForCrosshair)
		{
			ly = (aCenter_pt.y - this.topScreenBorderForCrosshair) < lOffsetY_num ? -(aCenter_pt.y - this.topScreenBorderForCrosshair) : -lOffsetY_num;
		}

		this.currentCrosshairDeviationX = lx;
		this.currentCrosshairDeviationY = ly;

		return {x: aCenter_pt.x + lx, y: aCenter_pt.y + ly};
	}

	get currentCrosshairDeviationX() //deviation from the edge of the screen in X
	{
		return this._fCurrentCrosshairDeviationX_num;
	}

	set currentCrosshairDeviationX(value) //deviation from the edge of the screen in X
	{
		this._fCurrentCrosshairDeviationX_num = value;
	}

	get currentCrosshairDeviationY() //deviation from the edge of the screen in Y
	{
		return this._fCurrentCrosshairDeviationY_num;
	}

	set currentCrosshairDeviationY(value) //deviation from the edge of the screen in Y
	{
		this._fCurrentCrosshairDeviationY_num = value;
	}

	//RIGHT CLICK DETECTION...
	onPointerRightClick(aX_num, aY_num)
	{
		return (
			this.isEnemyAvailableToShot() &&
			this.isCollision(aX_num, aY_num));
	}

	onPointerClick(aX_num, aY_num)
	{
		return this.onPointerRightClick(aX_num, aY_num);
	}
	//...RIGHT CLICK DETECTION

	getImageName(name)
	{
		let imageName;
		switch (name)
		{
			case ENEMIES.Rocky:
				imageName = 'enemies/rocky/rocky';
				break;
			case ENEMIES.Pointy:
				imageName = 'enemies/pointy/pointy';
				break;
			case ENEMIES.Spiky:
				imageName = 'enemies/spiky/spiky';
				break;
			case ENEMIES.Trex:
				imageName = 'enemies/trex/trex';
				break;
			case ENEMIES.Krang:
				imageName = 'enemies/krang/krang';
				break;
			case ENEMIES.Kang:
				imageName = 'enemies/kang/kang';
				break;
			case ENEMIES.OneEye:
				imageName = 'enemies/one_eye/one_eye';
				break;
			case ENEMIES.PinkFlyer:
				imageName = 'enemies/pink_flyer/pink_flyer';
				break;
			case ENEMIES.YellowAlien:
				imageName = 'enemies/yellow_alien/yellow_alien';
				break;
			case ENEMIES.SmallFlyer:
				imageName = 'enemies/small_flyer/small_flyer';
				break;
			case ENEMIES.JumperBlue:
				imageName = 'enemies/jump/jumper_blue';
				break;
			case ENEMIES.JumperGreen:
				imageName = 'enemies/jump/jumper_green';
				break;
			case ENEMIES.JumperWhite:
				imageName = 'enemies/jump/jumper_white';
				break;
			case ENEMIES.GreenHopper:
				imageName = 'enemies/green_hopper/green_hopper';
				break;
			case ENEMIES.FlyerMutalisk:
				imageName = 'enemies/flyer_mutalisk/flyer_mutalisk';
				break;
			case ENEMIES.Slug:
				imageName = 'enemies/slug/slug';
				break;
			case ENEMIES.Jellyfish:
				imageName = 'enemies/jellyfish/jellyfish';
				break;
			case ENEMIES.Mflyer:
				imageName = 'enemies/mflyer/mflyer';
				break;
			case ENEMIES.RedHeadFlyer:
				imageName = 'enemies/red_head_flyer/red_head_flyer';
				break;
			case ENEMIES.Froggy:
				imageName = 'enemies/froggy/froggy';
				break;
			case ENEMIES.EyeFlyerGreen:
				imageName = 'enemies/eye_flyer/eye_flyer_green';
				break;
			case ENEMIES.EyeFlyerPurple:
				imageName = 'enemies/eye_flyer/eye_flyer_purple';
				break;
			case ENEMIES.EyeFlyerRed:
				imageName = 'enemies/eye_flyer/eye_flyer_red';
				break;
			case ENEMIES.EyeFlyerYellow:
				imageName = 'enemies/eye_flyer/eye_flyer_yellow';
				break;
			case ENEMIES.Bioraptor:
				imageName = 'enemies/bioraptor/bioraptor';
				break;
			case ENEMIES.Crawler:
				imageName = 'enemies/crawler/crawler';
				break;
			case ENEMIES.MothyBlue:
				imageName = 'enemies/mothy/mothy_blue';
				break;
			case ENEMIES.MothyRed:
				imageName = 'enemies/mothy/mothy_red';
				break;
			case ENEMIES.MothyWhite:
				imageName = 'enemies/mothy/mothy_white';
				break;
			case ENEMIES.MothyYellow:
				imageName = 'enemies/mothy/mothy_yellow';
				break;
			case ENEMIES.Flyer:
				imageName = 'enemies/flyer/flyer';
				break;
			case ENEMIES.Money:
				imageName = 'enemies/money/gold_container';
				break;
			case ENEMIES.GiantTrex:
				imageName = 'enemies/trex/trex';
				break;
			case ENEMIES.GiantPinkFlyer:
				imageName = 'enemies/pink_flyer/pink_flyer';
				break;

			case ENEMIES.LaserCapsule:
				imageName = 'enemies/laser_capsule/laser_capsule';
				break;
			case ENEMIES.BulletCapsule:
				imageName = 'enemies/bullet_capsule/bullet_capsule';
				break;
			case ENEMIES.KillerCapsule:
				imageName = 'enemies/killer_capsule/killer_capsule';
				break;
			case ENEMIES.LightningCapsule:
				imageName = 'enemies/lightning_capsule/lightning_capsule';
				break;
			case ENEMIES.GoldCapsule:
				imageName = 'enemies/gold_capsule/gold_capsule';
				break;
			case ENEMIES.BombCapsule:
				imageName = 'enemies/bomb_capsule/bomb_capsule';
				break;
			case ENEMIES.FreezeCapsule:
				imageName = 'enemies/freeze_capsule/freeze_capsule';
				break;

			case ENEMIES.Earth:
				imageName = 'enemies/earth/earth';
				break;
			case ENEMIES.FireBoss:
				imageName = 'enemies/fire_boss/fire_boss';
				break;
			case ENEMIES.IceBoss:
				imageName = 'enemies/ice_boss/ice_boss';
				break;
			case ENEMIES.LightningBoss: 
				imageName = 'enemies/lightning_boss/lightning_boss';
				break;
			default: throw new Error('imageName is undefined for ' + name);
		}

		return imageName;
	}

	playDeathSound()
	{
		this.emit(Enemy.EVENT_ON_ENEMY_DEATH_SFX, { typeId: this.typeId });
	}

	getSpineSpeed()
	{
		let speed = 1;
		return speed;
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

	addShadow()
	{
		this.shadow = this.container.addChild(this._createShadow());
	}

	_createShadow()
	{
		return (new EnemyShadow(this.name));
	}

	_rerenderShadow()
	{
		let lTintColor_hex = this.shadowTintColor;
		if (lTintColor_hex == undefined) return;
		try
		{
			let sprite = this.shadow.view;
			sprite.convertToHeaven();
			sprite.tint = lTintColor_hex;
			sprite.color.dark[0] = sprite.color.light[0];
			sprite.color.dark[1] = sprite.color.light[1];
			sprite.color.dark[2] = sprite.color.light[2];
			sprite.color.invalidate();
		}
		catch (e)
		{
			console.log(e);
		}

	}

	_generateShadowView()
	{
		return APP.library.getSprite('shadow');
	}

	addFootPoint()
	{
		this.footPoint = this.container.addChild(new PIXI.Graphics());
		this.footPoint.clear().beginFill(0x000000, 0.01).drawCircle(0, 0, 4);
		this.footPoint.position.set(30, 120);
		this.footPoint.zIndex = 10;
	}

	get isBodyOutOfScreen()
	{
		return false;
	}

	_createView()
	{
		this._initView();
	}

	get isHighVolatility()
	{
		return false;
	}

	_initView()
	{
		this.view = this.container.addChild(new Sprite());
		this.view.scale.set(this.getViewScale());
		this.view.position.set(this.viewPos.x, this.viewPos.y);
		this.view.alpha = 0;
		this.view.animationSpeed = 1;
		this.view.zIndex = 3;


		this.state = STATE_STAY;
		this._curAnimationState = STATE_WALK;

		this.container.addChild(this._generateSpineView(this.imageName));

		this.spineView.scale.set(SPINE_SCALE);
		this._fCurrentAnimationName_str = "Walk";
		this.spineView.setAnimationByName(0, "Walk", true);
		this.spineView.play();
		this.spineView.view.state.timeScale = this.spineSpeed;
		this.spineView.position.set(this.spineViewPos.x, this.spineViewPos.y);
		this.spineView.zIndex = 3;
	}
	
	getClickableRectangle()
	{
		let lResult_r = new PIXI.Rectangle();
		lResult_r.width = this._getHitRectWidth();
		lResult_r.height = this._getHitRectHeight();
		return lResult_r;
	}

	_getHitRectWidth()
	{
		return 0;
	}

	_getHitRectHeight()
	{
		return 0;
	}

	getViewScale()
	{
		let scale = 1;
		return scale;
	}

	getStepTimers()
	{
		let timers = [];

		this._stepsAmount = 0;

		return timers;
	}

	getScaleCoefficient()
	{
		return Enemy.getEnemyDefaultScaleCoef(this.name);
	}

	changeSpineView(type)
	{
		if (type == STATE_DEATH)
		{
			return;
		}

		let x = this.spineViewPos.x;
		let y = this.spineViewPos.y;
		let name = this.imageName;
		let animationName = '';
		let animationLoop = true;
		let scale = SPINE_SCALE;

		if (this.spineView)
		{
			if (this.spineView.view && this.spineView.view.state)
			{
				this.spineView.view.state.onComplete = null;

				if (this.spineView.view.state.tracks && this.spineView.view.state.tracks[0])
				{
					this.spineView.view.state.tracks[0].onComplete = null;
				}
			}
			this.spineView.destroy();
		}

		let scaleCoefficient = this.getScaleCoefficient();
		scale *= scaleCoefficient;

		switch(type)
		{
			case STATE_STAY:
			case STATE_WALK:
			case STATE_IMPACT:
				animationName = 'Walk';
				break;
		}

		this.state = type;
		if (type !== STATE_STAY)
		{
			this._curAnimationState = type;
		}		

		this.container.addChild(this._generateSpineView(name));

		this.spineView.scale.set(scale);
		this._fCurrentAnimationName_str = animationName;
		this.spineView.setAnimationByName(0, animationName, animationLoop);

		if (this.state == STATE_STAY)
		{
			this.spineView.stop();
		}
		else
		{
			this.spineView.play();
		}

		this.spineView.position.set(x, y);
		this.spineView.zIndex = 3;
		this.spineView.view.state.timeScale = this.spineSpeed;
	}

	_generateSpineView(spineName)
	{
		let lSpineView = this.spineView = APP.spineLibrary.getSprite(spineName);
		this._fCurSpineName_str = spineName;
		this._addSpineMixes();
		lSpineView.anchor.set(0.5, 0.5)

		return lSpineView;
	}

	_addSpineMixes()
	{
		this.spineView.setAnimationsDefaultMixDuration(0);

		this._addSpineCustomAnimationsMixes();
	}

	_addSpineCustomAnimationsMixes()
	{
		let lCustomSpineTransitions_arr = this._customSpineTransitionsDescr;
		if (!lCustomSpineTransitions_arr || !lCustomSpineTransitions_arr.length)
		{
			return;
		}

		let prefix = this._getSpineAnimDefaultPrefix();

		for (let i=0; i<lCustomSpineTransitions_arr.length; i++)
		{
			let customTransition = lCustomSpineTransitions_arr[i];

			let fromName = this._getSpineMixAnimName(customTransition.from, prefix);
			let toName = this._getSpineMixAnimName(customTransition.to, prefix);
			let transDuration = customTransition.duration; // duration in sec

			if (this.spineView.hasAnimation(fromName) && this.spineView.hasAnimation(toName))
			{
				this.spineView.setAnimationMix(fromName, toName, transDuration);
			}
		}
	}

	get customSpineTransitions()
	{
		let lCustomSpineTransitions_arr = this._customSpineTransitionsDescr;
		if (!lCustomSpineTransitions_arr || !lCustomSpineTransitions_arr.length)
		{
			return null;
		}

		let prefix = this._getSpineAnimDefaultPrefix();

		let customTransitions = [];
		for (let i=0; i<lCustomSpineTransitions_arr.length; i++)
		{
			let customTransition = lCustomSpineTransitions_arr[i];

			let fromName = this._getSpineMixAnimName(customTransition.from, prefix);
			let toName = this._getSpineMixAnimName(customTransition.to, prefix);
			let transDuration = customTransition.duration; // duration in sec

			customTransitions.push({fromName: fromName, toName: toName, transDuration: transDuration})
		}

		return customTransitions;
	}

	_getSpineAnimDefaultPrefix()
	{
		let spineName = this._fCurSpineName_str;
		let lMatchedDirection_arr = spineName.match(/\d+/ig);
		let prefix = (lMatchedDirection_arr && lMatchedDirection_arr.length) ? lMatchedDirection_arr[0] + "_" : "";

		return prefix;
	}

	_getSpineMixAnimName(animNameTemplate, prefix)
	{
		let animName = animNameTemplate;
		animName = animName.replace("<PREFIX>", prefix);

		return animName;
	}

	get _customSpineTransitionsDescr()
	{
		// returns array of custom spine transitions,
		// format of single transition: {from: <ANIM_NAME>, from: <ANIM_NAME>, duration: <TRANSITION_DURATION_IN_SEC>},
		// ANIM_NAME - spine animation name; optional <ANIM_NAME> placeholder will be replaced with current spine anim direction prefix ("0_", "90_", "180_", "270_"),
		// example: {from: "idle", to: "walk", duration: 0.2} or {from: "<PREFIX>idle", to: "<PREFIX>walk", duration: 0.2}

		return null;
	}

	changeTextures(type, noChangeFrame)
	{
		this.view.alpha = (type == STATE_TURN) ? 1 : 0;

		if (type == STATE_DEATH)
		{
			this.changeSpineView(type);
			return;
		}

		this.spineView.alpha = (type == STATE_IMPACT || type == STATE_WALK || type == STATE_STAY ) ? 1 : 0;

		if (this.spineView && this.spineView.alpha > 0)
		{
			this.changeSpineView(type);
		}
		else
		{
			if (this.view.alpha == 0)
			{
				this.view.alpha = !this.view.alpha*1;
				this.spineView.alpha = !this.spineView.alpha*1;
			}

			let textures, speedCoefficient = 1;

			let scale = this.getViewScale();
			this.view.textures = textures;
			this.view.scale.set(scale);
			this.view.animationSpeed = 24 * speedCoefficient / (TURN_ANIM_TIME / this.view.textures.length);

			if (noChangeFrame)
			{
				this.view.play();
			}
			else
			{
				this.view.gotoAndPlay(0);
			}

			this.changeShadowPosition();
		}
	}

	changeShadowPosition()
	{
		let x = 18, y = 50, scale = 1;

		this.shadow.position.set(x, y);
		this.shadow.scale.set(scale);
	}

	changeFootPointPosition()
	{
		let x = 0, y = 0;

		this.footPoint.position.set(x, y);
	}

	getCurrentFootPointPosition()
	{
		return this.footPoint.position;
	}

	changeView()
	{
	}

	isFlyingEnemy()
	{
		switch (this.name)
		{
			case ENEMIES.PinkFlyer:
			case ENEMIES.SmallFlyer:
			case ENEMIES.FlyerMutalisk:
			case ENEMIES.EyeFlyerGreen:
			case ENEMIES.EyeFlyerPurple:
			case ENEMIES.EyeFlyerRed:
			case ENEMIES.EyeFlyerYellow:
			case ENEMIES.Mflyer:
			case ENEMIES.RedHeadFlyer:
			case ENEMIES.Flyer:
				return true;
			default:
				return false;
		}
	}

	getMoveType()
	{
		switch(this.typeId)
		{
			case ENEMY_TYPES.SLUG:
			case ENEMY_TYPES.KANG:
				return MOVE_TYPES.CRAWL;

			case ENEMY_TYPES.BIORAPTOR:
			case ENEMY_TYPES.FLYER:
			case ENEMY_TYPES.JELLYFISH:
			case ENEMY_TYPES.MONEY:
			case ENEMY_TYPES.KRANG:
			case ENEMY_TYPES.MFLYER:
			case ENEMY_TYPES.POINTY:
			case ENEMY_TYPES.ROCKY:
			case ENEMY_TYPES.RED_HEAD_FLYER:
			case ENEMY_TYPES.SPIKY:
			case ENEMY_TYPES.BOMB_CAPSULE:
			case ENEMY_TYPES.BULLET_CAPSULE:
			case ENEMY_TYPES.FLYER_MUTALISK:
			case ENEMY_TYPES.FREEZE_CAPSULE:
			case ENEMY_TYPES.GOLD_CAPSULE:
			case ENEMY_TYPES.KILLER_CAPSULE:
			case ENEMY_TYPES.LASER_CAPSULE:
			case ENEMY_TYPES.LIGHTNING_CAPSULE:
				return MOVE_TYPES.LEVITATE;

			case ENEMY_TYPES.EYE_FLAER_GREEN:
			case ENEMY_TYPES.EYE_FLAER_PERPLE:
			case ENEMY_TYPES.EYE_FLAER_RED:
			case ENEMY_TYPES.EYE_FLAER_YELLOW:
			case ENEMY_TYPES.PINK_FLYER:
			case ENEMY_TYPES.GIANT_PINK_FLYER:
			case ENEMY_TYPES.SMALL_FLYER:
				return MOVE_TYPES.FLY_HIGH;

			case ENEMY_TYPES.JUMPER_BLUE:
			case ENEMY_TYPES.JUMPER_GREEN:
			case ENEMY_TYPES.JUMPER_WHITE:
			case ENEMY_TYPES.GREEN_HOPPER:
			case ENEMY_TYPES.FROGGY:
				return MOVE_TYPES.JUMP;
			default:
				return MOVE_TYPES.WALK;
		}
	}

	//override
	changeZindex()
	{
		switch (this.getMoveType())
		{
			case MOVE_TYPES.CRAWL:
				this.zIndex = -200 + this._getHitRectWidth(); 
				break;
			case MOVE_TYPES.WALK:
				this.zIndex = this._getHitRectWidth();
				break;
			case MOVE_TYPES.LEVITATE:
				this.zIndex = 270 + this._getHitRectWidth();
				break;
			case MOVE_TYPES.JUMP:
				this.zIndex = this._getHitRectWidth() + this._getHitRectHeight()*this.jumpHeightProgress;
				break;
			case MOVE_TYPES.FLY_HIGH:
				this.zIndex = 1000 + this._getHitRectWidth();
				break;
			default:
				this.zIndex = 0;
				break;
		}

		if (this.isBoss)
		{
			this.zIndex = 1100 + this._getHitRectWidth();
		}

		if (this.__fFreezeBaseContainer_sprt)
		{
			this.__fFreezeBaseContainer_sprt.zIndex = this.zIndex + Z_INDEXES.ICE_COVER;
		}
	}
	
	//FREEZE EFFECT...
	__freezeSuspicionAfterCreation()
	{
		if (APP.currentWindow.freezeCapsuleFeatureController.i_isEnemyFrozen(this.id))
		{
			this.__freezeIfRequired(false);
			this._fFreezAfterLasthand_bl = true;
		}
		else if (this.__fFreezeExplosionsContainer_spr)
		{
			this.__unfreeze(false, false);
		}
	}

	__freezeIfRequired(aIsAnimated_bl=true)
	{
		if (!this._fIsDeathActivated_bl)
		{
			//non-animated freezing means this is lasthand - we must check first points then to make sure we need to freeze him
			this.__freeze(aIsAnimated_bl);
		}
	}

	__freeze(aIsAnimated_bl=true)
	{
		if (!this.__fIsFrozen_bl)
		{
			if (!(this.isBoss && this.isSpawnState))
			{
				this.setStay();
			}

			this.__fIsFrozen_bl = true;

			this.__addFreezeCover(aIsAnimated_bl);
		}

		this._fLastPosition_obj = null;
	}

	__addFreezeCover(aIsAnimated_bl=true)
	{
		this.__fFreezeBaseContainer_sprt = this._fTopContainer_sprt.addChild(new Sprite());
		this.__fFreezeBaseContainer_sprt.rotation = this.__getBodyRotation();

		this.__addFreezeEffect(aIsAnimated_bl);

		let lIceParts_map = generate_ice_parts();
		let lIcePart_t = lIceParts_map["part_1"];
		let lClickableRect_obj = this.getClickableRectangle();
		let lSpineBounds_obj = this.__getBodyBounds();
		let lFinalScale_num = Math.max(
			lClickableRect_obj.height/(lIcePart_t.height),
			lClickableRect_obj.width/(lIcePart_t.width),
			lSpineBounds_obj.height/(lIcePart_t.height),
			lSpineBounds_obj.width/(lIcePart_t.width),
		)*1.4; // *0.90 because there is an empty space on the sides of the ice floe. So error is approx. 10%

		this.__fIceCover_spr = this._fTopContainer_sprt.addChild(new Sprite());
		this.__fIceCover_spr.textures = [lIcePart_t];
		this.__fIceCover_spr.zIndex = this.__getBodyZIndex() + 2;
		this.__fIceCover_spr.scale.set(lFinalScale_num);
		this.__fIceCover_spr.rotation = this.__getBodyRotation();
		this.__fIceCover_spr.position.set(0, -40)

		if(!this.isBoss)
		{
			let lLocalPosition_obj = this.container.globalToLocal(lSpineBounds_obj.x, lSpineBounds_obj.y);
			let lPosX_num = lLocalPosition_obj.x + lSpineBounds_obj.width/2;
			let lPosY_num = lLocalPosition_obj.y + lSpineBounds_obj.height/2;
			this.__fIceCover_spr.position.set(lPosX_num, lPosY_num)
		}

		if (aIsAnimated_bl)
		{
			this.__fIceCover_spr.scale.set(0);
			let l_seq = [{ tweens: [{prop: 'scale.x', to: lFinalScale_num}, {prop: 'scale.y', to: lFinalScale_num}], duration: 10*FRAME_RATE }];
			Sequence.start(this.__fIceCover_spr, l_seq);
			APP.profilingController.info.isVfxDynamicProfileValueMediumOrGreater && this.__addFreezeSmoke();
		}

		this.__addFreezeGround();
	}

	__getSpineViewForMask()
	{
		return this.spineView.view;
	}
	
	__generateSpineMask(aOptFilter_f)
	{
		if (aOptFilter_f)
		{
			this.__getSpineViewForMask().filters = [aOptFilter_f];
		}

		let lSpineBounds_obj = this.__getBodyBounds();
		let l_txtr = APP.stage.renderer.generateTexture(this.__getSpineViewForMask(), PIXI.SCALE_MODES.NEAREST, 0, lSpineBounds_obj);
		this.__getSpineViewForMask().filters = null;

		let lLocalPosition_obj = this.container.globalToLocal(lSpineBounds_obj.x, lSpineBounds_obj.y);
		let lPosX_num = lLocalPosition_obj.x + lSpineBounds_obj.width/2;
		let lPosY_num = lLocalPosition_obj.y + lSpineBounds_obj.height/2;

		let lMask_sprt = new Sprite.from(l_txtr);
		lMask_sprt.position.set(lPosX_num, lPosY_num);
		lMask_sprt.anchor.set(0.5, 0.5);
		return lMask_sprt;
	}

	__addFreezeEffect(aIsAnimated_bl)
	{	
		let lFreezeTexture_t = generate_ice_parts()["enemies_freeze"];
		this.__fFreezeMask_spr = this.container.addChild(this.__generateSpineMask(WHITE_FILTER));

		if (APP.isPixiHeavenLibrarySupported && APP.profilingController.info.isVfxProfileValueMediumOrGreater && !APP.isMobile)
		{
			this.__fFreezeEffect_sprt = this.container.addChild(new PIXI.heaven.Sprite(lFreezeTexture_t));
			this.__fFreezeEffect_sprt.maskSprite = this.__fFreezeMask_spr;
			this.__fFreezeEffect_sprt.pluginName = "batchMasked";
			this.__fFreezeMask_spr.alpha = 0.3;
		}
		else
		{
			this.__fFreezeEffect_sprt = this.container.addChild(new Sprite.from(lFreezeTexture_t));
			this.__fFreezeEffect_sprt.mask = this.__fFreezeMask_spr;
			this.__fFreezeMask_spr.alpha = 0.6;
		}
		
		this.__fFreezeEffect_sprt.zIndex = this.__getBodyZIndex();
		this.__fFreezeEffect_sprt.anchor.set(0.5, 0.5);
		this.__fFreezeEffect_sprt.position = this.__fFreezeMask_spr.position;

		let lMaskBounds_obj = this.__fFreezeMask_spr.getBounds();
		let lFreezeCoverScaleY_num =  lMaskBounds_obj.height / (lFreezeTexture_t.height-20);
		let lFreezeCoverScaleX_num = lMaskBounds_obj.width / (lFreezeTexture_t.width-20);
		this.__fFreezeEffect_sprt.scale.set(Math.max(lFreezeCoverScaleX_num, lFreezeCoverScaleY_num, 1));
		
		if (aIsAnimated_bl)
		{
			this.__fFreezeEffect_sprt.alpha = 0;
			let lAlphaTween_t = new Tween(this.__fFreezeEffect_sprt, "alpha", 0, 1, 10*FRAME_RATE)
			lAlphaTween_t.play();
		}
	}

	__addFreezeSmoke()
	{
		let lSmoke_spr = this.__fFreezeBaseContainer_sprt.addChild(new Sprite());
		lSmoke_spr.position.set(this.getLocalCenterOffset().x, this.getLocalCenterOffset().y);
		lSmoke_spr.zIndex = 100;
		lSmoke_spr.textures = CommonEffectsManager.getDieSmokeUnmultTextures();
		lSmoke_spr.anchor.set(0.57, 0.81);
		lSmoke_spr.scale.set(3);
		lSmoke_spr.on('animationend', () => {
			lSmoke_spr.destroy();
		})
		lSmoke_spr.play();
	}

	__addFreezeGround()
	{
		let lShadowScale_obj = this.shadow ? this.shadow.scale : {x: 1, y: 1};
		this.__fFreezeGround_spr = this._fBottomContainer_sprt.addChild(new Sprite());
		this.__fFreezeGround_spr.zIndex = Z_INDEXES.GROUNDBURN;
		this.__fFreezeGround_spr.textures = generate_freeze_spin_textures();
		this.__fFreezeGround_spr.animationSpeed += Utils.getRandomWiggledValue(-0.1, 0.2); // so that not all enemies have the same speed
		this.__fFreezeGround_spr.blendMode = PIXI.BLEND_MODES.ADD;
		this.__fFreezeGround_spr.rotation = HALF_PI;
		this.__fFreezeGround_spr.scale.set(1.1*lShadowScale_obj.x, 1.5*lShadowScale_obj.y);
		this.__fFreezeGround_spr.play();
	}

	__unfreezeIfRequired(aIsDeathAnimation_bl=false)
	{
		if (this.isFrozen)
		{
			this.__unfreeze(true, aIsDeathAnimation_bl);
		}
	}

	__unfreeze(aIsAnimated_bl=true, aIsDeathAnimation_bl=false)
	{
		this.__fIsFrozen_bl = false;
		this.__resumeAfterUnfreeze();
		if (aIsAnimated_bl && !aIsDeathAnimation_bl)
		{
			this.__startIceMelting();
		}
		else if (aIsDeathAnimation_bl)
		{
			this.__explodeIce();
		}

		this.emit(Enemy.EVENT_ON_ENEMY_UNFREEZE, {enemyId: this.id});
	}

	__startIceMelting()
	{
		this.__destroyEnemyWhiteFreezeEffectAndGround();

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this.__fFreezeIceMeltingFxBackground_spr = this.__fFreezeBaseContainer_sprt.addChild(APP.library.getSprite("enemies/freeze_capsule/freeze_feature_ice_melting_background"));
			this.__fFreezeIceMeltingFxBackground_spr.alpha = 0;
			this.__fFreezeIceMeltingFxBackground_spr.zIndex = -10;
			this.__fFreezeIceMeltingFxBackground_spr.blendMode = PIXI.BLEND_MODES.ADD;
			this.__fFreezeIceMeltingFxBackground_spr.position.set(0, 5);
	
			this.__fFreezeIceMeltingFx_spr = this.__fFreezeBaseContainer_sprt.addChild(new Sprite());
			this.__fFreezeIceMeltingFx_spr.zIndex = this.__getBodyZIndex() + 2;
			this.__fFreezeIceMeltingFx_spr.alpha = 0;
			this.__fFreezeIceMeltingFx_spr.textures = generate_ice_melting_effect();
			this.__fFreezeIceMeltingFx_spr.blendMode = PIXI.BLEND_MODES.ADD;
			this.__fFreezeIceMeltingFx_spr.anchor.set(0.5, 0);
			this.__fFreezeIceMeltingFx_spr.play();
	
			this.__fFreezeIceMeltingFxBackground_spr.fadeTo(1, 6*FRAME_RATE);
			this.__fFreezeIceMeltingFx_spr.fadeTo(1, 6*FRAME_RATE);

			let lScale_num = this.__fIceCover_spr.getBounds().width/this.__fFreezeIceMeltingFxBackground_spr.texture.width*0.7;
			this.__fFreezeIceMeltingFxBackground_spr.scale.set(lScale_num*1.6);
			this.__fFreezeIceMeltingFx_spr.scale.set(lScale_num);
		}

		let lIceTextures_map = generate_ice_parts();
		let lIceCoverScale_obj = this.__fIceCover_spr.scale;
		let lMaskTexture_t = lIceTextures_map["ice_part_melt_mask"];
		this.__fFreezeCoverMeltingMask_spr = this.__fFreezeBaseContainer_sprt.addChild(Sprite.from(lMaskTexture_t));
		this.__fFreezeCoverMeltingMask_spr.textures = [lIceTextures_map["ice_part_melt_mask"]];
		this.__fFreezeCoverMeltingMask_spr.scale.set(lIceCoverScale_obj.x, lIceCoverScale_obj.y);
		this.__fFreezeCoverMeltingMask_spr.anchor.set(this.__fIceCover_spr.anchor.x, this.__fIceCover_spr.anchor.y);
		this.__fIceCover_spr.mask = this.__fFreezeCoverMeltingMask_spr;
		
		let l_seq = [
			{ 
				tweens: [{prop: 'position.y', to: lMaskTexture_t.height*lIceCoverScale_obj.y*0.8}], 
				duration: 25*FRAME_RATE, 
				onfinish: ()=>{
					this.__fFreezeIceMeltingFxBackground_spr && this.__fFreezeIceMeltingFxBackground_spr.fadeTo(0, 6*FRAME_RATE);
					this.__fFreezeIceMeltingFx_spr && this.__fFreezeIceMeltingFx_spr.fadeTo(0, 6*FRAME_RATE);
					this.emit(Enemy.EVENT_ON_FINISH_ICE_MELT);
				}
			},
			{ tweens: [{prop: 'position.y', to: lMaskTexture_t.height*lIceCoverScale_obj.y}], duration: 6*FRAME_RATE, onfinish: this.__destroyIce.bind(this) },
		];
		Sequence.start(this.__fIceCover_spr, l_seq);

		let lFreezeEffectAlphaTween_t = new Tween(this.__fFreezeEffect_sprt, "alpha", 1, 0, 10*FRAME_RATE)
		lFreezeEffectAlphaTween_t.play();
	}
	
	/**
	 * Ice explosion animation.
	 */
	__explodeIce()
	{
		this.__destroyIceCover();

		this.__fFreezeExplosionsContainer_spr = this._gameField.screenField.addChild(new Sprite());
		this.__fFreezeExplosionsContainer_spr.position = this.position;

		let lIceCoverBounds_obj = this.__fIceCover_spr ? this.__fIceCover_spr.getBounds() : {width: this._getHitRectWidth(), height: this._getHitRectHeight()};

		let lFreezeEffectExplosionTextures_arr = generate_freeze_cover_explosion_textures();
		let lFreezeCoverScale_num = Math.max(lFreezeEffectExplosionTextures_arr[0].width/lIceCoverBounds_obj.width, lFreezeEffectExplosionTextures_arr[0].height/lIceCoverBounds_obj.height);
		let lFreezeEffectExplosion_spr = this.__fFreezeExplosionsContainer_spr.addChild(new Sprite());
		lFreezeEffectExplosion_spr.textures = lFreezeEffectExplosionTextures_arr;
		lFreezeEffectExplosion_spr.scale.set(lFreezeCoverScale_num);
		lFreezeEffectExplosion_spr.on('animationend', ()=>{
			lFreezeEffectExplosion_spr.destroy();
			lFreezeEffectExplosion_spr = null;
			if (!this.__fFreezeExplosionsContainer_spr.children.some(l_spr=>!!l_spr)) // if all children are null
			{
				this.__destroyIce();
			}
		});
		lFreezeEffectExplosion_spr.play();

		let lIceExplosionTextures_arr = generate_enemy_ice_explosion_textures();
		let lIceScale_num = Math.max(lIceExplosionTextures_arr[0].width/lIceCoverBounds_obj.width, lIceExplosionTextures_arr[0].height/lIceCoverBounds_obj.height);
		let lIceExplosion_spr = this.__fFreezeExplosionsContainer_spr.addChild(new Sprite());
		lIceExplosion_spr.textures = lIceExplosionTextures_arr;
		lIceExplosion_spr.scale.set(lIceScale_num);
		lIceExplosion_spr.on('animationend', ()=>{
			lIceExplosion_spr.destroy();
			lIceExplosion_spr = null;
			if (!this.__fFreezeExplosionsContainer_spr.children.some(l_spr=>!!l_spr)) // if all children are null
			{
				this.__fFreezeExplosionsContainer_spr.destroy();
				this.__fFreezeExplosionsContainer_spr = null;
				this.__destroyIce();
			}
		});
		lIceExplosion_spr.play();
		this.emit(Enemy.EVENT_ON_ICE_EXPLOSION_ANIMATION_STARTED);
	}

	/**
	 * Destructor for ice effects.
	 */
	__destroyIce()
	{
		this._clearHitHighlightAnimation();

		this.__destroyIceCover();

		this.__fFreezeExplosionsContainer_spr && this.__fFreezeExplosionsContainer_spr.destroy();
		this.__fFreezeExplosionsContainer_spr = null;
	}

	__destroyEnemyWhiteFreezeEffectAndGround()
	{
		if (this.__fFreezeMask_spr && this.container)
		{
			this.container.removeChild(this.__fFreezeMask_spr);
			this.__fFreezeMask_spr = null;
		}
		
		this.__fFreezeGround_spr && this.__fFreezeGround_spr.destroy();
		this.__fFreezeGround_spr = null;
	}

	__destroyIceCover()
	{
		this.__fFreezeIceMeltingFxBackground_spr && this.__fFreezeIceMeltingFxBackground_spr.destroy();
		this.__fFreezeIceMeltingFxBackground_spr = null;

		this.__fFreezeIceMeltingFx_spr && this.__fFreezeIceMeltingFx_spr.destroy();
		this.__fFreezeIceMeltingFx_spr = null;

		this.__fIceCover_spr && Sequence.destroy(Sequence.findByTarget(this.__fIceCover_spr));
		this.__fIceCover_spr && this.__fIceCover_spr.destroy();
		this.__fIceCover_spr = null;

		this.__destroyEnemyWhiteFreezeEffectAndGround();

		if (this.__fFreezeEffect_sprt && this.container)
		{
			Tween.destroy(Tween.findByTarget(this.__fFreezeEffect_sprt));
			this.container.removeChild(this.__fFreezeEffect_sprt);
			this.__fFreezeEffect_sprt = null;
		}

		this.__fFreezeBaseContainer_sprt && this.__fFreezeBaseContainer_sprt.destroy();
		this.__fFreezeBaseContainer_sprt = null;
	}

	__resumeAfterUnfreeze()
	{
		if (this.spineView && this.spineView.view && this.spineView.view.state && !this._fIsImpactAnimationInProgress_bl)
		{
			this.__resumeSpineAnimationAfterUnfreeze();
		}
		else
		{
			this.setWalk();
		}
	}

	__resumeSpineAnimationAfterUnfreeze()
	{
		if (this._fFreezAfterLasthand_bl)
		{
			this._fFreezAfterLasthand_bl = false;
		}

		this.setWalk();
		this.spineView.play();
	}
	//...FREEZE EFFECT

	setStay()
	{
		this.view && this.view.removeListener('animationend');
		this.state = STATE_STAY;
		this.changeTextures(STATE_STAY);
	}

	setWalk()
	{
		if (this.__fIsFrozen_bl)
		{
			return;
		}

		this.view && this.view.removeListener('animationend');
		this.changeTextures(STATE_WALK);
	}

	continueStayedStateAnim()
	{
		if (this.isStayState && !!this._curAnimationState)
		{
			this.state = this._curAnimationState;
		}
	}

	get currentHitBounce()
	{
		return this.currentHitBounceDelta;
	}

	get isCritter()
	{
		return 	false;
	}

	get isBoss()
	{
		return isBossEnemy(this.typeId);
	}

	showHitBounce(angle, weaponId)
	{
		let hitBounceDistance = this.getHitBounceDistance(weaponId) * this.getHitBounceMultiplier();

		if (isNaN(hitBounceDistance))
		{
			throw new Error('hitBounceDistance error! hitBounceDistance = ' + hitBounceDistance + ', weaponId = ' + weaponId + ", angle = " + angle);
		}

		let dx = hitBounceDistance * Math.cos(-angle - Math.PI),
			dy = hitBounceDistance * Math.sin(-angle - Math.PI);

		if (!this.hitBounceDelta)
		{
			this.hitBounceDelta = {x: dx, y: dy};

			let seq = [
				{
					tweens: [
						{prop: "x", to: this.hitBounceDelta.x*1.2}, //increased jitter of enemies by 20% (1.2)
						{prop: "y", to: this.hitBounceDelta.y*1.2}
					],
					duration: HIT_BOUNCE_TIME/5
					//ease: /*Easing.quadratic.easeIn*/ Easing.linear.easeIn,
				},
				{
					tweens: [
						{prop: "x", to: 0},
						{prop: "y", to: 0}
					],
					duration: HIT_BOUNCE_TIME,
					//ease: /*Easing.quadratic.easeOut*/Easing.linear.easeOut,
					onfinish: () => {
						this.resetHit();
					}
				}
			]

			this.currentHitBounceDelta = {x: 0, y: 0};
			Sequence.start(this.currentHitBounceDelta, seq);
		}
	}

	prepareForBossAppearance()
	{
		this.container.visible = false;
		this._fBossAppearanceInProgress_bln = true;
	}

	_onBossAppear()
	{
		this._fBossAppearanceInProgress_bln = false;
	}

	resetHit()
	{
		Sequence.destroy(Sequence.findByTarget(this.currentHitBounceDelta));
		this.hitBounceDelta = null;
		this.currentHitBounceDelta = null;
	}

	setDeath()
	{
		this.__unfreezeIfRequired(true);
		this.life = 0;
	}

	setDeathFramesAnimation(aIsInstantKill_bl = false)
	{
		this._deathInProgress = true;

		this.view && this.view.removeListener('animationend');

		if (this.isBoss)
		{
			if (aIsInstantKill_bl)
			{
				this._playDeathFxAnimation(aIsInstantKill_bl);
			}
			else
			{
				this.spineView.stop();
				this._playBossDeathFxAnimation();
			}
		}
		else
		{
			if (!aIsInstantKill_bl)
			{
				this.playDeathSound();
			}

			this._playDeathFxAnimation(aIsInstantKill_bl);
		}

		this.emit(Enemy.EVENT_ON_DEATH_ANIMATION_STARTED);
	}

	__getDeathAnimationPointX()
	{
		return this.getLocalCenterOffset().x;
	}

	__getDeathAnimationPointY()
	{
		return this.getLocalCenterOffset().y;
	}

	__getDeathAnimationContainer()
	{
		return this.container;
	}

	__tryToFinishDeathFxAnimation()
	{
		this.onDeathFxAnimationCompleted();
	}

	_playDeathFxAnimation(aIsInstantKill_bl, aOptKillerEnemyName_str)
	{
		if (this.spineView)
		{
			Sequence.destroy(Sequence.findByTarget(this.spineView));
			this.spineView.destroy();
			this.spineView = null;
			this._fCurSpineName_str = undefined;
		}

		if (this.shadow)
		{
			Sequence.destroy(Sequence.findByTarget(this.shadow));
			this.shadow.view && Sequence.destroy(Sequence.findByTarget(this.shadow.view));
			this.shadow && this.shadow.destroy();
			this.shadow = null;
		}

		this.deathFxAnimation = this.__getDeathAnimationContainer().addChild(this._generateDeathFxAnimation(aOptKillerEnemyName_str));

		this.deathFxAnimation.position.set(
			this.__getDeathAnimationPointX(),
			this.__getDeathAnimationPointY());
		this.deathFxAnimation.scale.set(this._deathFxScale);

		this._validatezIndexOnDeath();

		this.deathFxAnimation.once(DeathFxAnimation.EVENT_ON_DEATH_COIN_AWARD, e=>this.emit(Object.assign(e, {killerEnemyName: aOptKillerEnemyName_str})), this);
		this.deathFxAnimation.playAnimation(this.isCritter || aIsInstantKill_bl);
		this.deathFxAnimation.once(DeathFxAnimation.EVENT_ANIMATION_COMPLETED, this.__tryToFinishDeathFxAnimation, this);

		if (!this.isCritter && !aIsInstantKill_bl)
		{
			this.deathFxAnimation.once(DeathFxAnimation.EVENT_OUTRO_STARTED, () => {
				this.onDeathFxOutroStarted();
			});
		}
		this.deathFxAnimation.zIndex = 20;
	}

	_validatezIndexOnDeath()
	{
		this.zIndex = Z_INDEXES.GROUNDBURN;
	}

	_generateDeathFxAnimation(aOptKillerEnemyName_str)
	{
		switch (aOptKillerEnemyName_str)
		{
			case ENEMIES.KillerCapsule:
				return new DeathFromKillerCapsuleFxAnimation();
			default:
				return new DeathFxAnimation();
		}
	}

	get _deathFxScale()
	{
		return 0.7;
	}

	_playBossDeathFxAnimation()
	{
		this.onDeathFxAnimationCompleted();
		this._onTimeToExplodeCoins();
	}

	onDeathFxAnimationCompleted()
	{
		this._deathInProgress = false;
		this._deathOutroAnimationStarted = false;
		this.emit(Enemy.EVENT_ON_DEATH_ANIMATION_COMPLETED);
		this.destroy();
	}

	_onTimeToExplodeCoins(event)
	{
		this.emit(Enemy.EVENT_ON_TIME_TO_EXPLODE_COINS, {position: this.getGlobalPosition(), isCoPlayerWin: event.isCoPlayerWin});
	}

	onDeathFxOutroStarted()
	{
		this.showDeathOutroFx();
	}

	showDeathOutroFx()
	{
		this.spineView && this.spineView.destroy();
		this.shadow && this.shadow.destroy();
		
		this._deathOutroAnimationStarted = true;

		try
		{
			this.emit(Enemy.EVENT_ON_DEATH_ANIMATION_OUTRO_STARTED, {position: this.getGlobalPosition()});
		}
		catch (err)
		{
			APP.logger.i_pushError(`Enemy. Error occurred in determining the global position of the enemy.`);
			console.error("Enemy. Error occurred in determining the global position of the enemy.")
		}
	}

	getHitRectangle()
	{
		let rect = new PIXI.Rectangle();
		rect.width = this.isBoss ? 20 : 10;
		rect.height = Math.abs(this.getCurrentFootPointPosition().y) / (this.isBoss ? 1.2 : 2);
		return rect;
	}

	_checkHitHighlightFilter()
	{
		if (!this.spineView)
		{
			return;
		}

		if (!Array.isArray(this.spineView.filters))
		{
			this.spineView.filters = [];
		}

		if (!this.spineView.filters.includes(this._hitHighlightFilter))
		{
			this.spineView.filters.push(this._hitHighlightFilter);
		}
	}

	_playHitHighlightAnimation(aTime_num, aOptIntensity_num)
	{
		this._fHitHighlightIntensitySeq && this._fHitHighlightIntensitySeq.destructor();
		this._fHitHighlightIntensitySeq = null;

		this._clearHitHighlightAnimation();

		if (!this.spineView)
		{
			return;
		}

		this._checkHitHighlightFilter();

		aTime_num = aTime_num || 1 * FRAME_RATE;
		this._hitHighlightInProgress = true;
		aOptIntensity_num = aOptIntensity_num || this._baseGitHighlightFilterIntensity;

		let lHighlight_seq = [
			{tweens: [{prop: "intensity.value", to: aOptIntensity_num}], ease: Easing.sine.easeIn, duration: aTime_num/2},
			{tweens: [{prop: "intensity.value", to: 0}], ease: Easing.quadratic.easeOut, duration: aTime_num/2, onfinish: this._clearHitHighlightAnimation.bind(this)}
		];
		this._fHitHighlightIntensitySeq = Sequence.start(this._hitHighlightFilterIntensity, lHighlight_seq);
	}

	_clearHitHighlightAnimation()
	{
		this._hitHighlightInProgress = false;

		if (this.spineView)
		{
			if (this.spineView && Array.isArray(this.spineView.filters) && this.spineView.filters.includes(this._hitHighlightFilter))
			{
				this._hitHighlightFilterIntensity.intensity.value = 0;
				this._hitHighlightFilter.uniforms.intensity = 0;

				let lIndex_int = this.spineView.filters.indexOf(this._hitHighlightFilter);
				if (~lIndex_int)
				{
					this.spineView.filters.splice(lIndex_int, 1);
				}
			}
		}

		if (this.view)
		{
			this.view.filters = null;
		}
		if (this.__fIceCover_spr)
		{
			this.__fIceCover_spr.filters = null;
		}
	}

	get _hitHighlightVertexShader()
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

	get _hitHighlightFragmentShader()
	{
		return `
		varying vec2 vTextureCoord;
		uniform sampler2D uSampler;
		uniform float intensity;

		void main(void)
		{
			vec4 c = texture2D(uSampler, vTextureCoord);

			vec4 result;
			float add = intensity;

			if (c.a < 0.7)
			{
				result.r = c.r;
				result.g = c.g;
				result.b = c.b;
				result.a = c.a;
			}
			else
			{
				result.r = c.r+add;
				result.g = c.g-add*3.0;
				result.b = c.b-add*3.0;
				result.a = c.a;
			}

			gl_FragColor = result;
		}`;
	}

	get _hitHighlightFilter()
	{
		if (!this._fHitHighlightFilter)
		{
			this._fHitHighlightFilter = new PIXI.Filter(this._hitHighlightVertexShader, this._hitHighlightFragmentShader, {intensity: this._intensity});
			this._fHitHighlightFilter.resolution = APP.stage.renderer.resolution;
		}
		return this._fHitHighlightFilter;
	}

	get _baseGitHighlightFilterIntensity()
	{
		return this.isFrozen ? 0.1 : 0.3;
	}

	get _intensity()
	{
		this.intensity = this._hitHighlightFilterIntensity.intensity;
		return this.intensity;
	}

	get _hitHighlightFilterIntensity()
	{
		if (!this._fHitHighlightFilterIntensity)
		{
			this._fHitHighlightFilterIntensity = {intensity: {type: 'f', value: this._baseGitHighlightFilterIntensity}};
		}
		return this._fHitHighlightFilterIntensity;
	}

	_hitHiglightUpdate()
	{
		if (this._hitHighlightInProgress && this.spineView)
		{
			this._hitHighlightFilter.uniforms.intensity = this._hitHighlightFilterIntensity.intensity.value;

			if (this.isFrozen && this.__fIceCover_spr)
			{
				this.__fIceCover_spr.filters = [this._hitHighlightFilter];
			}
		}
	}

	tick()
	{
		this.updateOffsets();
		this._hitHiglightUpdate();

		//DEBUG...
		// this._drawColliders();
		//...DEBUG
	}

	//COLLISIONS...
	__generatePreciseCollisionBodyPartsNames()
	{
		return [];
	}

	__generateIgnoreCollisionsBodyPartsNames()
	{
		return ["shadow"];
	}

	__isSimpleCollisionEnemy()
	{
		return false;
	}

	__getBodyBounds()
	{
		return this.spineView.getBounds();
	}

	__getBodyRotation()
	{
		return this.spineView.rotation;
	}

	__getBodyZIndex()
	{
		return this.spineView.zIndex;
	}

	isCollision(aX_num, aY_num)
	{
		if(
			!this.container.visible ||
			!this.spineView ||
			!this.spineView.view ||
			!this.spineView.view.skeleton
			||
				(
					!this.spineView.view._localBoundsRect &&
					!this.spineView.view._bounds
				)
		)
		{
			return false;
		}

		let lSpineView_s = this.spineView;
		let scaleCoefficient = this.getScaleCoefficient() * 0.4;
		let lMeshes_obj_arr = lSpineView_s.view.skeleton.drawOrder;

		let lPoinerX_num = (aX_num - this.position.x - this.container.position.x) / scaleCoefficient;
		let lPoinerY_num = (aY_num - this.position.y - this.container.position.y) / scaleCoefficient;


		//BODY BOUNDS...
		let lSpineViewBounds_obj = this.__getBodyBounds();
		let lBoundsLeftX_num = lSpineViewBounds_obj.left;
		let lBoundsRightX_num = lSpineViewBounds_obj.right;
		let lBoundsTopY_num = lSpineViewBounds_obj.top;
		let lBoundsBottomY_num = lSpineViewBounds_obj.bottom;


		if(
			Math.abs(lBoundsLeftX_num) === Infinity ||
			Math.abs(lBoundsRightX_num) === -Infinity ||
			Math.abs(lBoundsTopY_num) === Infinity ||
			Math.abs(lBoundsBottomY_num) === -Infinity
		)
		{
			this._fIsUndetectableSpineBodyBounds_bl = true;
		}
		//...BODY BOUNDS

		//CHECK IF POINT INSIDE SPINE RECTANGLE BOUNDS...
		if(
			!this._fIsUndetectableSpineBodyBounds_bl &&
			!lSpineViewBounds_obj.contains(aX_num, aY_num)
		)
		{
			return false; //not even close, no collision
		}
		//...CHECK IF POINT INSIDE SPINE RECTANGLE BOUNDS

		//CHECK ELIIPSE INSIDE SPINE RECTANGLE BOUNDS IF ONLY SIMPLE CHECK IS REQUIRED...
		if(this.__isSimpleCollisionEnemy())
		{
			let lW_num = (lBoundsRightX_num - lBoundsLeftX_num) / 2;
			let lH_num = (lBoundsBottomY_num - lBoundsTopY_num) / 2;

			return(
					this._isPointInsideEllipse(
						lPoinerX_num,
						lPoinerY_num,
						lBoundsLeftX_num + lW_num,
						lBoundsTopY_num + lH_num,
						lW_num,
						lH_num)
					);
		}
		//...CHECK ELIIPSE INSIDE SPINE RECTANGLE BOUNDS IF ONLY SIMPLE CHECK IS REQUIRED


		//CHECK EACH BODY PART...
		for( let i = 0; i < lMeshes_obj_arr.length; i++ )
		{
			if(!lMeshes_obj_arr[i].currentMesh)
			{
				continue; //no mesh = no collision for this body part
			}

			let lBodyPartName_str = lMeshes_obj_arr[i].currentMeshName;

			if(!this._isCollisionRequired(lBodyPartName_str))
			{
				continue; //body part excluded
			}

			let lVertices_num_arr = lMeshes_obj_arr[i].currentMesh.vertices;

			if (lMeshes_obj_arr[i].currentMesh.getBounds().contains(aX_num, aY_num))
			{
				return true;
			}

			//CHECK IF IS INSIDE BODY PART BOUNDS...
			let lLeftX_num = 100000;
			let lRightX_num = -100000;
			let lTopY_num = 100000;
			let lBottomY_num = -100000;
			let lFinalVerticeIndex_int = 0;

			for( let j = 0; j < lVertices_num_arr.length; j+=2 )
			{
				let lX_num = lVertices_num_arr[j];
				let lY_num = lVertices_num_arr[j + 1];

				if(lX_num < lLeftX_num)
				{
					lLeftX_num = lX_num;

					if(j > lFinalVerticeIndex_int)
					{
						lFinalVerticeIndex_int = j;
					}
				}
				if(lX_num > lRightX_num)
				{
					lRightX_num = lX_num;

					if(j > lFinalVerticeIndex_int)
					{
						lFinalVerticeIndex_int = j;
					}
				}
				
				if(lY_num < lTopY_num)
				{
					lTopY_num = lY_num;

					if(j > lFinalVerticeIndex_int)
					{
						lFinalVerticeIndex_int = j;
					}
				}

				if(lY_num > lBottomY_num)
				{
					lBottomY_num = lY_num;

					if(j > lFinalVerticeIndex_int)
					{
						lFinalVerticeIndex_int = j;
					}
				}
			}

			if(
				lPoinerX_num < lLeftX_num && aX_num < lLeftX_num ||
				lPoinerX_num > lRightX_num && aX_num > lRightX_num  ||
				lPoinerY_num < lTopY_num && aY_num < lTopY_num ||
				lPoinerY_num > lBottomY_num && aY_num > lBottomY_num 
			)
			{
				continue; //not even inside bounds, skip this body part
			}
			//...CHECK IF IS INSIDE BODY PART BOUNDS

			if(!this._isPreciseCollisionRequired(lBodyPartName_str))
			{
				//CHECK ZONE AS AN ELLIPSE...
				let lWidth_num = (lRightX_num - lLeftX_num);
				let lHeight_num = (lBottomY_num - lTopY_num);
				let lCenterX_num = lLeftX_num + lWidth_num / 2;
				let lCenterY_num = lTopY_num + lHeight_num / 2;


				if(
					this._isPointInsideEllipse(
						lPoinerX_num,
						lPoinerY_num,
						lCenterX_num,
						lCenterY_num,
						lWidth_num / 2,
						lHeight_num / 2)
				)
				{
					return true; //collision found!
				}
				//...CHECK ZONE AS AN ELLIPSE
			}
			else
			{
				//CHECK IF IS INSIDE POLYGON...
				if(this._isPointInsidePolygon(lPoinerX_num, lPoinerY_num, lVertices_num_arr, lFinalVerticeIndex_int))
				{
					return true; //collision found!
				}
				//CHECK IF IS INSIDE POLYGON
			}
		}
		//...CHECK EACH BODY PART

		return false;
	}

	_isPreciseCollisionRequired(aBodyPartName_str)
	{
		let l_str_arr = this._fPreciseCollisionBodyPartsNames_str_arr;

		for( let i = 0; i < l_str_arr.length; i++ )
		{
			if(aBodyPartName_str.includes(l_str_arr[i]))
			{
				return true;
			}
		}

		return false;
	}

	_isCollisionRequired(aBodyPartName_str)
	{
		let l_str_arr = this._fIgnoreCollisionsBodyPartsNames_str_arr;

		for( let i = 0; i < l_str_arr.length; i++ )
		{
			if(aBodyPartName_str.includes(l_str_arr[i]))
			{
				return false;
			}
		}

		return true;
	}

	_isPointInsideEllipse(aX_num, aY_num, aCenterX_num, aCenterY_num, aWidth_num, aHeight_num)
	{
		return ((aX_num - aCenterX_num) ** 2 / aWidth_num ** 2 + (aY_num-aCenterY_num) ** 2 / aHeight_num ** 2) <= 1;
	}

	_isPointInsidePolygon(aX_num, aY_num, aVertices_int_arr, aOptFinalVerticeIndex_int)
	{
		let lIsInside_bl = false;

		let lFinalVerticeIndex_int = aOptFinalVerticeIndex_int === undefined ? aVertices_int_arr.length - 2 : aOptFinalVerticeIndex_int;


		let j = lFinalVerticeIndex_int;

		for (let i = 0; i <= lFinalVerticeIndex_int; i+= 2)
		{
			if(i > 0)
			{
				j = i - 2;
			}

			let lXi_num = aVertices_int_arr[i];
			let lYi_num = aVertices_int_arr[i + 1];
			
			let lXj_num = aVertices_int_arr[j];
			let lYj_num = aVertices_int_arr[j + 1];

			if (
				(
					(lYi_num > aY_num) !== (lYj_num > aY_num)
				)
					&&
					(
						aX_num < (lXj_num - lXi_num) * (aY_num - lYi_num) / (lYj_num - lYi_num) + lXi_num
					)
			)
			{
				lIsInside_bl = !lIsInside_bl;
			}
		}

		return lIsInside_bl;
	}

	//DEBUG...
	_drawColliders()
	{
		if(
			!this.container.visible ||
			!this.spineView ||
			!this.spineView.view ||
			!this.spineView.view.skeleton
			||
				(
					!this.spineView.view._localBoundsRect &&
					!this.spineView.view._bounds
				)
			)
		{
			return false;
		}

		let lSpineView_s = this.spineView.view;
		let scaleCoefficient = this.getScaleCoefficient() * 0.4;
		let lMeshes_obj_arr = lSpineView_s.skeleton.drawOrder;
		let lContainer = this._debugContainer || (this._debugContainer = new Sprite);

		lContainer.zIndex = 10000000;
		lContainer.rotation = this.__getBodyRotation();

		if (!lContainer.parent && APP.gameScreen) 
		{
			this.addChild(lContainer);
		}

		lContainer.destroyChildren();

		//BODY BOUNDS...
		let lSpineViewBounds_obj = lSpineView_s._localBoundsRect || lSpineView_s._bounds;
		let lBoundsLeftX_num = lSpineViewBounds_obj.left;
		let lBoundsRightX_num = lSpineViewBounds_obj.right;
		let lBoundsTopY_num = lSpineViewBounds_obj.top;
		let lBoundsBottomY_num = lSpineViewBounds_obj.bottom;

		let g = new PIXI.Graphics();
		g.beginFill(0X0000FF, 0.5);

		g.drawRect(
			(lBoundsLeftX_num) * scaleCoefficient + this.container.position.x,
			(lBoundsTopY_num) * scaleCoefficient + this.container.position.y,
			(lBoundsRightX_num - lBoundsLeftX_num) * scaleCoefficient,
			(lBoundsBottomY_num - lBoundsTopY_num) * scaleCoefficient);
		g.endFill();

		lContainer.addChild(g);
		//...BODY BOUNDS


		//SIMPLE COLLISION MODE...
		if(this.__isSimpleCollisionEnemy())
		{
			let lW_num = (lBoundsRightX_num - lBoundsLeftX_num) / 2 * scaleCoefficient;
			let lH_num = (lBoundsBottomY_num - lBoundsTopY_num) / 2 * scaleCoefficient;

			g.beginFill(0X00FF00, 0.5);
			g.drawEllipse(
				(lBoundsLeftX_num) * scaleCoefficient + lW_num + this.container.position.x,
				(lBoundsTopY_num) * scaleCoefficient + lH_num + this.container.position.y,
				lW_num,
				lH_num)
			g.endFill();

			return;
		}
		//...SIMPLE COLLISION MODE


		//BODY PARTS...
		for( let i = 0; i < lMeshes_obj_arr.length; i++ )
		{
			if(!lMeshes_obj_arr[i].currentMesh)
			{
				continue;
			}
			let lName_str = lMeshes_obj_arr[i].currentMeshName;

			if(!this._isCollisionRequired(lName_str))
			{
				continue;
			}

			let lVertices_num_arr = lMeshes_obj_arr[i].currentMesh.vertices;

			//BODY PART BOUNDS...
			let lLeftX_num = 100000;
			let lRightX_num = -100000;
			let lTopY_num = 100000;
			let lBottomY_num = -100000;


			for( let j = 0; j < lVertices_num_arr.length; j+=2 )
			{
				let lX_num = lVertices_num_arr[j];
				let lY_num = lVertices_num_arr[j + 1];

				if(lX_num < lLeftX_num) lLeftX_num = lX_num;
				if(lX_num > lRightX_num) lRightX_num = lX_num;
				if(lY_num < lTopY_num) lTopY_num = lY_num;
				if(lY_num > lBottomY_num) lBottomY_num = lY_num;
			}
			//...BODY PART BOUNDS


			if(this._isPreciseCollisionRequired(lName_str))
			{

				//BODY PART POLYGON...
				g.beginFill(0x00FF00, 1);
				let ver = [];
				


				for( let j = 0; j < lVertices_num_arr.length; j+=2 )
				{

					let lX_num = (lVertices_num_arr[j]) * scaleCoefficient + this.container.position.x;
					let lY_num = (lVertices_num_arr[j + 1]) * scaleCoefficient + this.container.position.y;
					

					ver.push(lX_num, lY_num);
				}

				g.drawPolygon(ver);
				g.endFill();
				//...BODY PART POLYGON
			}
			else
			{
				//BODY PART BOUNDS...
				let lW_num = (lRightX_num - lLeftX_num) * scaleCoefficient * 0.5;
				let lH_num = (lBottomY_num - lTopY_num) * scaleCoefficient * 0.5

				g.beginFill(0X00FF00, 0.35);
				g.drawEllipse(
					(lLeftX_num) * scaleCoefficient + lW_num + this.container.position.x,
					(lTopY_num) * scaleCoefficient + lH_num + this.container.position.y,
					lW_num,
					lH_num)
				g.endFill();
				//...BODY PART BOUNDS
			}
		}
		//...BODY PARTS
	}
	//...DEBUG
	//...COLLISIONS

	__getPositionFreezeOffsetX()
	{
		return 0;
	}

	__getPositionFreezeOffsetY()
	{
		return 0;
	}

	updateOffsets()
	{
		let lOffset_obj = this._getOffset();
		let lCenterPosition_obj = this.getLocalCenterOffset();
		let lPositionOffset_obj = this.getPositionOffset();
		lCenterPosition_obj.x += lPositionOffset_obj.x;
		lCenterPosition_obj.y += lPositionOffset_obj.y;

		let lX_num = lCenterPosition_obj.x*Math.sin(this.__getBodyRotation()) + lCenterPosition_obj.y*Math.sin(this.__getBodyRotation()) + lOffset_obj.x;
		let lY_num = lCenterPosition_obj.x*Math.sin(this.__getBodyRotation()) - lCenterPosition_obj.y*Math.cos(this.__getBodyRotation()) + lOffset_obj.y;

		this.container.position.set(lX_num, lY_num);
	}

	_getOffset()
	{
		let dx = 0, dy = 0;

		if (this.currentHitBounce !== null)
		{
			dx += this.currentHitBounce.x;
			dy += this.currentHitBounce.y;
		}

		return {x: dx, y: dy};
	}

	_addLaserNetSmoke()
	{
		this._fLaserCapsileSmoke_spr_arr = this._fLaserCapsileSmoke_spr_arr || [];
		const lDieSmoke = APP.gameScreen.gameFieldController.laserCapsuleExplodeContainer.container.addChild(new Sprite());
		lDieSmoke.zIndex = APP.gameScreen.gameFieldController.laserCapsuleExplodeContainer.zIndex;
		lDieSmoke.textures = CommonEffectsManager.getDieSmokeUnmultTextures();
		lDieSmoke.blendMode = PIXI.BLEND_MODES.SCREEN;
		lDieSmoke.animationSpeed = 0.5;
		lDieSmoke.anchor.set(0.57, 0.81);
		lDieSmoke.scale.set(2);
		lDieSmoke.position.set(this.x, this.y);
		lDieSmoke.play();
		lDieSmoke.on("animationend", () =>
		{
			const lIndex_int = this._fLaserCapsileSmoke_spr_arr.indexOf(lDieSmoke);
			if (~lIndex_int)
			{
				this._fLaserCapsileSmoke_spr_arr.splice(lIndex_int, 1);
			}
			lDieSmoke.destroy();
		});

		this._fLaserCapsileSmoke_spr_arr.push(lDieSmoke);
	}

	destroy(purely = false)
	{
		this.__destroyIce();

		this._fHitHighlightIntensitySeq && this._fHitHighlightIntensitySeq.destructor();
		this._fHitHighlightIntensitySeq = null;

		Sequence.destroy(Sequence.findByTarget(this.currentHitBounceDelta));
		Sequence.destroy(Sequence.findByTarget(this.currentBombBounceDelta));

		this.emit(Enemy.EVENT_ON_ENEMY_DESTROY);
		if (this._destroyed)
		{
			return;
		}

		if (!purely)
		{
			let lEnemyPosition_pt = this.getGlobalPosition();
			lEnemyPosition_pt.x += this.getCurrentFootPointPosition().x;
			lEnemyPosition_pt.y += this.getCurrentFootPointPosition().y;

			this.emit(Enemy.EVENT_ON_ENEMY_VIEW_REMOVING, {position: lEnemyPosition_pt, angle: this.angle});
		}

		this.container && Sequence.destroy(Sequence.findByTarget(this.container));
		if (this.currentBombBounceDelta)
		{
			this.currentBombBounceDelta.sequence && this.currentBombBounceDelta.sequence.destructor();
			this.currentBombBounceDelta.sequence = null;
			this.currentBombBounceDelta = null;
		}

		if (this.shadow)
		{
			Sequence.destroy(Sequence.findByTarget(this.shadow));
			this.shadow.view && Sequence.destroy(Sequence.findByTarget(this.shadow.view));
		}

		this.name = undefined;
		this.container = null;

		this.id = undefined;
		this.typeId = undefined;
		this.imageName = undefined;
		this.radius = undefined;
		this.life = undefined;
		this.isEnded = false;
		this.isAwaitingDelayedHit = false;
		this.angle = undefined;
		this.speed = undefined;
		this._fLastPosition_obj = null;
		this.swarmType = null;
		this._fDeathReason_num = null;

		this.awardedPrizes = null;
		this.prizes = undefined;

		this.boss = false;
		this.skin = undefined;

		this.state = null;
		this.spineSpeed = undefined;

		this.trajectory = null;

		this.hitBounceDelta = null;
		this.bombBounceDelta = null;
		this.currentHitBounceDelta = null;

		this._deathInProgress = false;
		this._deathOutroAnimationStarted = false;
		this.deathFxAnimation = null;
		this._fBonesFellDown_bl = false;

		this._fIsFireDenied_bl = false;
		this._fIsTrajectoryPositionChangeInitiated_bl = false;

		this.view = null;
		this.viewPos = null;
		this.spineViewPos = null;
		this.shadow = null;
		this.footPoint = null;

		if (this.spineView)
		{
			if (this.spineView.view && this.spineView.view.state)
			{
				this.spineView.view.state.onComplete = null;
				if (this.spineView.view.state.tracks && this.spineView.view.state.tracks[0])
				{
					this.spineView.view.state.tracks[0].onComplete = null;
				}
			}
		}

		Sequence.destroy(Sequence.findByTarget(this.spineView));
		this.spineView = null;
		this._fCurSpineName_str = undefined;

		this.stepTimers = null;
		this._stepsAmount = undefined;

		this._fChildHvEnemyId_num = undefined;

		this._fBossAppearanceInProgress_bln = null;

		this._fGameDebuggingController_gdc && this._fGameDebuggingController_gdc.off(GameDebuggingController.i_EVENT_TINT_UPDATE, this._onDebugTintUpdated, this);
		this._fGameDebuggingController_gdc && this._fGameDebuggingController_gdc.off(GameDebuggingController.i_EVENT_SHADOW_TINT_UPDATE, this._onDebugShadowTintUpdated, this);
		this._fGameDebuggingController_gdc = null;

		this._fIsImpactAnimationInProgress_bl = undefined;
		this._fPauseWalkingTimeMarker_num = undefined;

		this._fPrevUpdateAccurateTime_num = undefined;
		this._curAnimationState = undefined;

		this._gameScreen = null;
		this._gameField = null;

		if (this._fLaserCapsileSmoke_spr_arr)
		{
			for (let lAnim_sprt of this._fLaserCapsileSmoke_spr_arr)
			{
				lAnim_sprt && lAnim_sprt.destroy();
				lAnim_sprt = null;
			}

			this._fLaserCapsileSmoke_spr_arr = [];
		}

		this.params = null;

		this._hitHighlightInProgress = undefined;

		this._fCurrentCrosshairDeviationX_num = null;
		this._fCurrentCrosshairDeviationY_num = null;
		this._fMaxCrosshairOffsetOnSpineEnemyX_num = null;
		this._fMaxCrosshairOffsetOnSpineEnemyY_num = null;
		super.destroy();
	}

	get isDestroyed()
	{
		return this._destroyed;
	}

	getHitBounceDistance(weaponId)
	{
		switch (weaponId)
		{
			case WEAPONS.DEFAULT:
			case WEAPONS.HIGH_LEVEL:
				return 10;
		}
		return 0;
	}

	getHitBounceMultiplier()
	{
		let mult = 1;
		let lSpeed_num = this.speed || 4;
		return mult * Math.sqrt(Math.max(lSpeed_num/4, 1));
	}

	getCenterPosition()
	{
		let pos = {x: 0, y: 0};
		let lGlobalPos_pnt = this.getGlobalPosition();
		

		if (lGlobalPos_pnt)
		{
			pos.x = lGlobalPos_pnt.x + this.getLocalCenterOffset().x + this._getOffset().x;
			pos.y = lGlobalPos_pnt.y + this.getLocalCenterOffset().y + this._getOffset().y;
		}

		return pos;
	}

	getLocalCenterOffset()
	{
		let pos = {x: 0, y: 0};
		return pos;
	}

	// Fixes position without changing collisions and crosshair
	getPositionOffset()
	{
		let pos = { x: 0, y: 0 };
		return pos;
	}
}

export default Enemy;