import SimpleController from "../../../../../../common/PIXI/src/dgphoenix/unified/controller/base/SimpleController";
import EnemiesInfo from '../../../model/uis/enemies/EnemiesInfo';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import GameWebSocketInteractionController from '../../interaction/server/GameWebSocketInteractionController';
import { ENEMY_TYPES, ENEMIES, ENEMY_BOSS_SKINS, isFlyingEnemy } from '../../../../../shared/src/CommonConstants';
import { Utils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import { Sequence } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/index';
import * as Easing from '../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import ShotResponsesController from '../../../controller/custom/ShotResponsesController';
import GameScreen from '../../../main/GameScreen';
import GameFieldController from '../../../controller/uis/game_field/GameFieldController';
import TrajectoryUtils from '../../../main/TrajectoryUtils';
import LaserCapsuleFeatureController from '../../../controller/uis/capsule_features/LaserCapsuleFeatureController';
import BulletCapsuleFeatureController from '../../../controller/uis/capsule_features/BulletCapsuleFeatureController';
import TextField from "../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/TextField";
import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import BezierCurve from '../../../main/BezierCurve';
import KillerCapsuleFeatureController from "../capsule_features/KillerCapsuleFeatureController";
import LightningCapsuleFeatureController from '../../../controller/uis/capsule_features/LightningCapsuleFeatureController';
import FreezeCapsuleFeatureInfo from "../../../model/uis/capsule_features/FreezeCapsuleFeatureInfo";
import Enemy from "../../../main/enemies/Enemy";

const DEFAULT_ENEMY_CIRCULAR_RADIUS = 80;
const ENEMY_CIRCULAR_SPEED_COEF = 11000;

class EnemiesController extends SimpleController
{
	static calculateEnemyName(aTypeId_num, aSkin_num)
	{
		// TODO: Change names for Sector X
		let lName_str;
		switch (aTypeId_num)
		{
			case ENEMY_TYPES.ROCKY:
				lName_str = ENEMIES.Rocky;
				break;
			case ENEMY_TYPES.POINTY:
				lName_str = ENEMIES.Pointy;
				break;
			case ENEMY_TYPES.SPIKY:
				lName_str = ENEMIES.Spiky;
				break;
			case ENEMY_TYPES.TREX:
				lName_str = ENEMIES.Trex;
				break;
			case ENEMY_TYPES.KRANG:
				lName_str = ENEMIES.Krang;
				break;
			case ENEMY_TYPES.KANG:
				lName_str = ENEMIES.Kang;
				break;
			case ENEMY_TYPES.ONE_EYE:
				lName_str = ENEMIES.OneEye;
				break;
			case ENEMY_TYPES.PINK_FLYER:
				lName_str = ENEMIES.PinkFlyer;
				break;
			case ENEMY_TYPES.YELLOW_ALIEN:
				lName_str = ENEMIES.YellowAlien;
				break;
			case ENEMY_TYPES.SMALL_FLYER:
				lName_str = ENEMIES.SmallFlyer;
				break;
			case ENEMY_TYPES.JUMPER_BLUE:
				lName_str = ENEMIES.JumperBlue;
				break;
			case ENEMY_TYPES.JUMPER_GREEN:
				lName_str = ENEMIES.JumperGreen;
				break;
			case ENEMY_TYPES.JUMPER_WHITE:
				lName_str = ENEMIES.JumperWhite;
				break;
			case ENEMY_TYPES.GREEN_HOPPER:
				lName_str = ENEMIES.GreenHopper;
				break;
			case ENEMY_TYPES.FLYER_MUTALISK:
				lName_str = ENEMIES.FlyerMutalisk;
				break;
			case ENEMY_TYPES.SLUG:
				lName_str = ENEMIES.Slug;
				break;
			case ENEMY_TYPES.JELLYFISH:
				lName_str = ENEMIES.Jellyfish;
				break;
			case ENEMY_TYPES.MFLYER:
				lName_str = ENEMIES.Mflyer;
				break;
			case ENEMY_TYPES.RED_HEAD_FLYER:
				lName_str = ENEMIES.RedHeadFlyer;
				break;
			case ENEMY_TYPES.FROGGY:
				lName_str = ENEMIES.Froggy;
				break;
			case ENEMY_TYPES.EYE_FLAER_GREEN:
				lName_str = ENEMIES.EyeFlyerGreen;
				break;
			case ENEMY_TYPES.EYE_FLAER_PERPLE:
				lName_str = ENEMIES.EyeFlyerPurple;
				break;
			case ENEMY_TYPES.EYE_FLAER_RED:
				lName_str = ENEMIES.EyeFlyerRed;
				break;
			case ENEMY_TYPES.EYE_FLAER_YELLOW:
				lName_str = ENEMIES.EyeFlyerYellow;
				break;
			case ENEMY_TYPES.BIORAPTOR:
				lName_str = ENEMIES.Bioraptor;
				break;
			case ENEMY_TYPES.CRAWLER:
				lName_str = ENEMIES.Crawler;
				break;
			case ENEMY_TYPES.MOTHI_BLUE:
				lName_str = ENEMIES.MothyBlue;
				break;
			case ENEMY_TYPES.MOTHI_RED:
				lName_str = ENEMIES.MothyRed;
				break;
			case ENEMY_TYPES.MOTHI_WHITE:
				lName_str = ENEMIES.MothyWhite;
				break;
			case ENEMY_TYPES.MOTHI_YELLOW:
				lName_str = ENEMIES.MothyYellow;
				break;
			case ENEMY_TYPES.FLYER:
				lName_str = ENEMIES.Flyer;
				break;
			case ENEMY_TYPES.MONEY:
				lName_str = ENEMIES.Money;
				break;
			case ENEMY_TYPES.GIANT_TREX:
				lName_str = ENEMIES.GiantTrex;
				break;
			case ENEMY_TYPES.GIANT_PINK_FLYER:
				lName_str = ENEMIES.GiantPinkFlyer;
				break;

			case ENEMY_TYPES.LASER_CAPSULE:
				lName_str = ENEMIES.LaserCapsule;
				break;
			case ENEMY_TYPES.KILLER_CAPSULE:
				lName_str = ENEMIES.KillerCapsule;
				break;
			case ENEMY_TYPES.LIGHTNING_CAPSULE:
				lName_str = ENEMIES.LightningCapsule;
				break;
			case ENEMY_TYPES.GOLD_CAPSULE:
				lName_str = ENEMIES.GoldCapsule;
				break;
			case ENEMY_TYPES.BULLET_CAPSULE:
				lName_str = ENEMIES.BulletCapsule;
				break;
			case ENEMY_TYPES.BOMB_CAPSULE:
				lName_str = ENEMIES.BombCapsule;
				break;
			case ENEMY_TYPES.FREEZE_CAPSULE:
				lName_str = ENEMIES.FreezeCapsule;
				break;
			
			case ENEMY_TYPES.BOSS:
				switch (aSkin_num)
				{
					case ENEMY_BOSS_SKINS.EARTH:	lName_str = ENEMIES.Earth; break;
					case ENEMY_BOSS_SKINS.FIRE: 	lName_str = ENEMIES.FireBoss; break;
					case ENEMY_BOSS_SKINS.LIGHTNING: lName_str = ENEMIES.LightningBoss; break;
					case ENEMY_BOSS_SKINS.ICE:		lName_str = ENEMIES.IceBoss; break;
					default: throw new Error ("Unexpected Boss skin: " + aSkin_num);
				}
				break;
			default:
				throw new Error("Unexpected enemy typeId " + aTypeId_num);
		}

		return lName_str;
	}

	static get EVENT_ON_TRAJECTORIES_UPDATED()			{return "onTrajectoriesUpdated"; }

	getEnemyPositionInTheFuture(aEnemyId_int, aFutureTimeOffset_num = 0)
	{
		return this._getEnemyPositionInTheFuture(aEnemyId_int, aFutureTimeOffset_num)
	}

	clear()
	{
		this._clear();
	}

	getRegisteredEnemies()
	{
		return this.info.registeredEnemies;
	}

	getEnemiesByType(aTypeId_num)
	{
		let lResult_arr = this.info.registeredEnemies;
		return lResult_arr && lResult_arr.filter(enm => enm.typeId === aTypeId_num);
	}

	getExistEnemy(aId_num)
	{
		return this._getExistEnemy(aId_num);
	}

	getCircularRadius(aTypeId_num, aIsLarge_bl = false)
	{
		if (aTypeId_num == undefined || aTypeId_num == null)
		{
			return 0;
		}

		if (aIsLarge_bl)
		{
			return this.getCircularLargeTrajectoryRadius();
		}
		else
		{
			return this.getCircularTrajectoryRadius(aTypeId_num);
		}
	}

	constructor()
	{
		super(new EnemiesInfo());

		//DEBUG...
		//setTimeout(this._debugUpdateTrajectories.bind(this), 10000);
		//...DEBUG

		//DEBUG RANDOM TRAJECTORIES...
		// document.addEventListener('keyup', (e)=>{
		// 	if (e.keyCode === 16) this._randomDirectionsTrajectoriesDebug();
		// });
		//...DEBUG RANDOM TRAJECTORIES
	}

	__initControlLevel()
	{
		super.__initControlLevel();

		APP.webSocketInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_GET_ROOM_INFO_RESPONSE_MESSAGE, this._onServerGetRoomInfoResponseMessage, this);
		APP.webSocketInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_FULL_GAME_INFO_MESSAGE, this._onServerFullGameInfoMessage, this);
		APP.webSocketInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_ENEMY_DESTROYED_MESSAGE, this._onServerEnemyDestroyedMessage, this);
		APP.webSocketInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_UPDATE_TRAJECTORIES_MESSAGE, this._onServerUpdateTrajectoriesMessage, this);
		APP.webSocketInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_NEW_ENEMIES_MESSAGE, this._onServerNewEnemiesMessage, this);
		APP.webSocketInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_NEW_ENEMY_MESSAGE, this._onServerNewEnemyMessage, this);

		APP.currentWindow.shotResponsesController.on(ShotResponsesController.EVENT_ON_SERVER_SHOT_RESPONSE, this._onShotResponse, this);

		APP.currentWindow.gameFieldController.on(GameFieldController.EVENT_ON_SHOW_ENEMY_HIT, this._onShowEnemyHit, this);
		APP.currentWindow.gameFieldController.on(GameFieldController.EVENT_ON_REMOVE_ENEMY, this._onRemoveEnemy, this);
		APP.currentWindow.gameFieldController.on(GameFieldController.EVENT_ON_DEATH_ANIMATION_STARTED, this.onDeathAnimationStarted, this);
		APP.currentWindow.gameFieldController.on(GameFieldController.EVENT_ON_ENEMY_VIEW_REMOVING, this.onEnemyViewRemoving, this);
		APP.currentWindow.gameFieldController.on(GameFieldController.EVENT_ON_ENEMY_RESUME_WALKING, this._onEnemyResumeWalking, this);
		APP.currentWindow.gameFieldController.on(GameFieldController.EVENT_ON_ENEMY_PAUSE_WALKING, this._onEnemyPauseWalking, this);
		APP.currentWindow.gameFieldController.on(GameFieldController.EVENT_ON_ENEMY_ADD_TRAJECTORY_POINT, this._onEnemyAddTrajectoryPoint, this);
		APP.currentWindow.gameFieldController.on(GameFieldController.EVENT_ON_NEW_B3_ENEMY_CREATED, this._onNewEnemyB3Created, this);

		APP.currentWindow.laserCapsuleFeatureController.on(LaserCapsuleFeatureController.EVENT_ON_ENEMY_START_LASER_NET_SMOKE_ANIMATION, this._onEnemyStartLaserNetSmokeAnimation, this);
		APP.currentWindow.bulletCapsuleFeatureController.on(BulletCapsuleFeatureController.EVENT_ON_STOP_AFFECTED_ENEMIES, this._onEnemyStopAffectedEnemies, this);
		APP.currentWindow.killerCapsuleFeatureController.on(KillerCapsuleFeatureController.EVENT_ON_STOP_AFFECTED_ENEMIES, this._onEnemyStopAffectedEnemies, this);
		APP.currentWindow.lightningCapsuleFeatureController.on(LightningCapsuleFeatureController.EVENT_ON_STOP_AFFECTED_ENEMIES, this._onLightningCapsuleEnemyStopAffectedEnemies, this);
		APP.currentWindow.lightningCapsuleFeatureController.on(LightningCapsuleFeatureController.EVENT_ON_HIT_ANIMATION_COMPLETED, this._onLightningCapsuleEnemyWalkBossContinue, this);
		APP.currentWindow.on(GameScreen.EVENT_ON_FREEZE_AFFECTED_ENEMIES, this._onFreezeAffectedEnemies, this);
		APP.currentWindow.on(GameScreen.EVENT_ON_UNFREEZE_AFFECTED_ENEMIES, this._onUnfreezeAffectedEnemies, this);
		//DEBUG...
		//APP.currentWindow.gameFieldController.on('stubUpdateTrajectory', this._onStubUpdateTrajectory, this);
		//...DEBUG
	}

	_onEnemyStopAffectedEnemies(e)
	{
		let lDelayedBulletExploasionHits_obj_arr = e.delayedExplosionHits;
		lDelayedBulletExploasionHits_obj_arr.forEach((hitInfo) =>
		{
			const lId_num = hitInfo.enemy.id;
			this._onEnemyPauseWalking({ enemyId: lId_num });
			if (e.stopWalking)
			{
				let enemy = APP.currentWindow.gameFieldController.getExistEnemy(lId_num);
				enemy && enemy.setStay();
			}
		});
	}

	_onEnemyStartLaserNetSmokeAnimation(e)
	{
		let lEnemyId_num = e.enemyId;
		let enemy = APP.currentWindow.gameFieldController.getExistEnemy(lEnemyId_num);
		enemy && enemy.addLaserNetSmoke();
	}

	_onEnemyAddTrajectoryPoint(e)
	{
		let enemy = this._getExistEnemy(e.enemyId);
		let timeOffset = e.timeOffset ? e.timeOffset : 0;
		if (enemy)
		{
			let lEnemyTimeOffset_num = enemy.timeOffset || 0;
			let newPoint = { x: e.x, y: e.y, time: serverTime + clientTimeDiff - lEnemyTimeOffset_num + timeOffset };

			this._pushInRightPosition(enemy, newPoint);
		}
	}

	_onLightningCapsuleEnemyStopAffectedEnemies(e)
	{
		let lDelayedLightningExplosionHits_obj_arr = e.delayedLightningExplosionHits;
		lDelayedLightningExplosionHits_obj_arr.forEach((hitInfo) => {
			const lId_num = hitInfo.enemy.id;
			this._onEnemyPauseWalking({enemyId: lId_num});
			if (e.stopWalking)
			{
				let enemy = APP.currentWindow.gameFieldController.getExistEnemy(lId_num);
				if (enemy && !(enemy.isBoss && enemy.isSpawnState))
				{
					enemy && enemy.setStay();
				}
			}
		});
	}

	_onLightningCapsuleEnemyWalkBossContinue(e)
	{
		let lDelayedLightningExplosionHits_obj_arr = e.delayedLightningExplosionHits;
		let lEnemiesTrajectoriesInfo_obj = e.affectedEnemies.shift();

		if (lDelayedLightningExplosionHits_obj_arr.length > 1)
		{
			lDelayedLightningExplosionHits_obj_arr.shift();
			return;
		}

		for (let lId_num in lEnemiesTrajectoriesInfo_obj)
		{
			let lEnemyInfo_obj = this._getExistEnemy(Number(lId_num));
			lEnemyInfo_obj && this._updateEnemyTrajectory(Number(lId_num), lEnemiesTrajectoriesInfo_obj[lId_num]);
		}

		lDelayedLightningExplosionHits_obj_arr.forEach((hitInfo) => {
			const lId_num = hitInfo.enemy.id;
			this._onEnemyResumeWalking({enemyId: lId_num});
			if (!e.stopWalking)
			{
				let enemy = APP.currentWindow.gameFieldController.getExistEnemy(lId_num);
				enemy && enemy.setWalk();
			}
		});
		
		lDelayedLightningExplosionHits_obj_arr.shift();
	}

	_pushInRightPosition(enemy, point)
	{
		let lPoints_arr = enemy.trajectory.points;
		for (let i = 1; i < lPoints_arr.length; ++i)
		{
			if (lPoints_arr[i].time > point.time)
			{
				if (Utils.isEqualTrajectoryPoints(lPoints_arr[i], lPoints_arr[i - 1])) // the enemy is probably frozen, we can update the points anyway
				{
					enemy.trajectory.points.splice(i - 1, 2, point); //delete two points with approximately the same coords and put the new one
				}
				else
				{
					enemy.trajectory.points.splice(i, 0, point);
				}
				return;
			}
		}

		enemy.trajectory.points.push(point);
	}

	_onEnemyPauseWalking(e)
	{
		let enemy = this._getExistEnemy(e.enemyId)
		if (enemy)
		{
			enemy.allowUpdatePosition = false;
			enemy.timeOffset = e.timeOffset || 0;
		}
	}

	_onEnemyResumeWalking(e)
	{
		let enemy = this._getExistEnemy(e.enemyId)
		if (enemy)
		{
			if (e.timeOffset > 0)
			{
				this._onSetEnemyTimeOffset(e);
			}
			enemy.allowUpdatePosition = true;
		}
	}

	_onSetEnemyTimeOffset(aEvent_obj)
	{
		let enemy = this._getExistEnemy(aEvent_obj.enemyId);

		if (!enemy)
		{
			APP.logger.i_pushWarning(`EnemiesController. _onSetEnemyTimeOffset >> enemy with id ${aEvent_obj.enemyId} doesn't exist.`);
			console.log(`Error! _onSetEnemyTimeOffset >> enemy with id ${aEvent_obj.enemyId} doesn't exist`);
			return;
		}

		enemy.timeOffset = aEvent_obj.timeOffset;

		let lTrajectoryDuration_num = TrajectoryUtils.extractTrajectoryDuration(enemy.trajectory.points, 0);

		//limit duration maximum to make sure enemy will catch up his time offset until next UpdateTrajectory happens
		let lTimeRestoreDuration_num = Math.max(0, Math.min(lTrajectoryDuration_num - enemy.timeOffset, enemy.timeOffset * enemy.speed));

		let startDelay = aEvent_obj.startDelay || 0;

		let seq = [
			{
				tweens: [{ prop: "timeOffset", to: 0 }],
				duration: lTimeRestoreDuration_num,
				ease: Easing.sine.easeInOut
			}
		];
		let timeOffsetSequence = Sequence.start(enemy, seq, startDelay);
		enemy.timeOffsetSequence = timeOffsetSequence;

		enemy.allowUpdatePosition = true;
	}

	setEnemyTimeOffset(aEnemyId_num, lTimeOffset_num)
	{
		const lEnemy_obj = this._getExistEnemy(aEnemyId_num);
		lEnemy_obj && (lEnemy_obj.timeOffset = lTimeOffset_num);
	}

	setEnemyRotationSupport(aEnemyId_num, lValue_bl)
	{
		const lEnemy_obj = this._getExistEnemy(aEnemyId_num);
		lEnemy_obj && (lEnemy_obj.rotationSupport = lValue_bl);
	}

	onEnemyViewRemoving(params)
	{
		this._tryToRemoveEnemy(params.enemyId);
	}

	onDeathAnimationStarted(params)
	{
		this._tryToRemoveEnemy(params.enemyId);
	}

	_onRemoveEnemy(params)
	{
		this._tryToRemoveEnemy(params.id);
	}

	_onShowEnemyHit(params)
	{
		let enemy = this._getExistEnemy(params.id);		
		if (enemy && params.enemyView)
		{
			this._updateEnemyHealth(enemy, params.enemyView)
		}

		if (enemy && params.data.killed)
		{
			this._removeEnemy(enemy);
		}
	}

	__initModelLevel()
	{
		super.__initModelLevel();
	}

	_onServerNewEnemyMessage(event)
	{
		this._registerEnemy(event.messageData.newEnemy);
	}

	_onServerNewEnemiesMessage(event)
	{
		this._newEnemiessResponse(event.messageData);
	}

	_newEnemiessResponse(data)
	{
		if (!data.enemies) return;

		data = this._sortEnemiesIfRequired(Utils.clone(data));

		for (let i = 0; i < data.enemies.length; ++i)
		{
			this._registerEnemy(data.enemies[i]);
		}
	}

	_sortEnemiesIfRequired()
	{
		if (data.enemies[0].trajectory.points[0].portal && data.enemies[0].swarmType === 1)
		{
			let firstEnemy = Utils.clone(data.enemies[0]);
			data.enemies[0] = Utils.clone(data.enemies[data.enemies.length - 1]);
			data.enemies[data.enemies.length - 1] = firstEnemy;
		}

		return data;
	}

	_onShotResponse(data)
	{
		const lShotResponseInfo_sri = data.info;
		if (lShotResponseInfo_sri.isHit)
		{
			this._onServerHitMessage({ messageData: lShotResponseInfo_sri.data, requestData: lShotResponseInfo_sri.requestData });
		}
	}

	_onServerHitMessage(event)
	{
		if (event.messageData.killed)
		{
			let lExistEnemy_e = this.getEnemyById(event.messageData.enemy.id);
			this._destroyEnemy({ enemyId: event.messageData.enemy.id, reason: 0 });
			
			if (lExistEnemy_e && lExistEnemy_e.isB3FormationEnemy())
			{
				this.updateB3FormationMainEnemyState(lExistEnemy_e.parentEnemyId);
			}
		}

		if (event.messageData.damage > 0)
		{
			this._damageEnemyEnergy(event.messageData.enemy.id, event.messageData.damage);
		}
	}

	_onNewEnemyB3Created(e)
	{
		if (e.enemyTypeId == ENEMY_TYPES.MONEY)
		{
			this.updateB3FormationMainEnemyState(e.enemyId, true);
		}
		else if (e.parentTypeId == ENEMY_TYPES.MONEY)
		{
			this.updateB3FormationMainEnemyState(e.parentId, true);
		}
	}
	
	getB3FormationMainEnemy(aEnemyId_num)
	{
		let lEnemies_arr = APP.currentWindow.gameFieldController.allExistEnemies;

		for (let i = 0; i < lEnemies_arr.length; i++)
		{
			if (lEnemies_arr[i].typeId == ENEMY_TYPES.MONEY && lEnemies_arr[i].id == aEnemyId_num)
			{
				return lEnemies_arr[i];
			}
		}

		return null;
	}

	getB3FormationMainEnemies()
	{
		let lEnemies_arr = APP.currentWindow.gameFieldController.allExistEnemies;
		let lMoneyEnemies_arr = [];

		for (let i = 0; i < lEnemies_arr.length; i++)
		{
			if (lEnemies_arr[i].typeId == ENEMY_TYPES.MONEY)
			{
				lMoneyEnemies_arr.push(lEnemies_arr[i]);
			}
		}

		return lMoneyEnemies_arr;
	}

	getEnemyById(id)
	{
		let lEnemies_arr = APP.currentWindow.gameFieldController.allExistEnemies;

		for (let i = 0; i < lEnemies_arr.length; i++)
		{
			if (lEnemies_arr[i].id == id)
			{
				return lEnemies_arr[i];
			}
		}

		return null;
	}

	updateB3FormationMainEnemyState(aParentEnemyId_num, aLastHand_bl = false)
	{
		if (aParentEnemyId_num)
		{
			let lB3FormationMainEmey_e = this.getB3FormationMainEnemy(aParentEnemyId_num);
			lB3FormationMainEmey_e && lB3FormationMainEmey_e.updateCircularEnemyCount(this._getB3FormationCircularEnemyCount(aParentEnemyId_num), aLastHand_bl);
		}
		else
		{
			let lB3FormationMainEmemies_e = this.getB3FormationMainEnemies();
			for (let i = 0; i < lB3FormationMainEmemies_e.length; i++)
			{
				lB3FormationMainEmemies_e[i] && lB3FormationMainEmemies_e[i].updateCircularEnemyCount(this._getB3FormationCircularEnemyCount(lB3FormationMainEmemies_e[i].id), aLastHand_bl);
			}
		}
	}

	_getB3FormationCircularEnemyCount(aParentEnemyId_num)
	{
		let lEnemies_arr = APP.currentWindow.gameFieldController.allExistEnemies;
		return lEnemies_arr.filter(enemy => (enemy.isB3FormationEnemy() && enemy.parentEnemyId != -1 && enemy.parentEnemyId == aParentEnemyId_num && enemy.life != 0)).length;
	}

	_randomDirectionsTrajectoriesDebug()
	{
		let data = {};
		let trajectories = {};

		const lRegisteredEnemy_obj = this.info.registeredEnemies;
		lRegisteredEnemy_obj.forEach((enemy) =>
		{
			let trajectory = {};
			trajectory.points = [];
			trajectory.speed = 0;
			trajectories[enemy.id] = trajectory;
		});

		data.trajectories = trajectories;

		this._onUpdateTrajectories(data);
	}

	_onStubUpdateTrajectory(e)
	{
		let data = {};
		let trajectories = {};
		let currentPoint = null;

		serverTime = APP.gameScreen.currentTime;
		clientTimeDiff = 0;

		let enemyId = e.enemyId;
		let enemyInfo = this._getExistEnemy(enemyId);
		if (!enemyInfo)
		{
			currentPoint = e.firstPoint;
		}
		else
		{
			currentPoint = this._getEnemyPosition(enemyInfo);
		}

		let nStartTime = APP.gameScreen.currentTime;
		let nEndTime = nStartTime + 10000;

		let points = [];
		let trajectory = {};
		points.push({ x: currentPoint.x, y: currentPoint.y, time: nStartTime });
		points.push({ x: 0, y: 0, time: nEndTime });
		trajectory.points = points;
		trajectory.speed = 10;
		trajectories[enemyId] = trajectory;

		data.trajectories = trajectories;
		this._onUpdateTrajectories(data);
	}

	_debugUpdateTrajectories()
	{
		let data = {};
		let trajectories = {};
		const lRegisteredEnemy_obj = this.info.registeredEnemies;
		lRegisteredEnemy_obj.forEach((enemy) =>
		{
			let trajectory = {};
			let points = [];
			let nStartTime = (new Date()).getTime();
			let nEndTime = nStartTime + 10000;
			let currentPoint = this._getEnemyPosition(enemy);

			points.push({ x: currentPoint.x, y: currentPoint.y, time: nStartTime });
			points.push({ x: 56, y: 93, time: nEndTime });
			trajectory.points = points;
			trajectory.speed = 4;
			trajectories[enemy.id] = trajectory;
		});

		data.trajectories = trajectories;
		this._onUpdateTrajectories(data);
	}

	_onServerEnemyDestroyedMessage(aEvent_obj)
	{
		this._destroyEnemy(aEvent_obj.messageData);
	}

	_onServerUpdateTrajectoriesMessage(aEvent_obj)
	{
		this._onUpdateTrajectories(aEvent_obj.messageData);
		this.emit(EnemiesController.EVENT_ON_TRAJECTORIES_UPDATED, aEvent_obj.messageData);
	}

	_onServerGetRoomInfoResponseMessage(aEvent_obj)
	{
		const lResponce_obj = aEvent_obj.messageData;
		const lIsLasthand_bl = true;

		this._registerEnemies(lResponce_obj, lIsLasthand_bl);
	}

	_onServerFullGameInfoMessage(aEvent_obj)
	{
		const lResponce_obj = aEvent_obj.messageData;
		const lIsLasthand_bl = true;

		this._registerEnemies(lResponce_obj, lIsLasthand_bl);
	}

	_registerEnemies(aResponce_obj, aIsLasthand_bl)
	{
		if (aResponce_obj && aResponce_obj.roomEnemies && aResponce_obj.roomEnemies.length && !APP.currentWindow.isPaused)
		{
			const lNewEnemies_arr = aResponce_obj.roomEnemies;
			lNewEnemies_arr.forEach((aEnemyInfo_obj) =>
			{
				Object.assign(aEnemyInfo_obj, { isLasthand: aIsLasthand_bl });
				let lFreezeTime_num = aResponce_obj.freezeTime && aResponce_obj.freezeTime[aEnemyInfo_obj.id] || 0;
				if (lFreezeTime_num)
				{
					for (let lPoint_obj of aEnemyInfo_obj.trajectory.points)
					{
						lPoint_obj.time -= lFreezeTime_num + FreezeCapsuleFeatureInfo.i_INTRO_ANIMATION_DURATION;
					}
					aEnemyInfo_obj.frozen = true;
					this._registerEnemy(aEnemyInfo_obj);

					aEnemyInfo_obj.lastPositionBeforeFreeze = this._getEnemyPosition(aEnemyInfo_obj);
				}
				else
				{
					aEnemyInfo_obj.frozen = false;
					this._registerEnemy(aEnemyInfo_obj);
				}
			});
		}
	}

	_registerEnemy(aEnemyInfo_obj)
	{
		if (APP.currentWindow.gameFrbController.info.frbEnded && !APP.currentWindow.gameStateController.info.isPlayerSitIn)
		{
			//don't register new enemies, because the room is cleared already
			APP.logger.i_pushWarning(`EnemiesController. [Y] Omit adding new enemies, because the room is cleared already!`);
			console.log("[Y] Omit adding new enemies, because the room is cleared already!");
			return;
		}

		//DEBUG...
		/*if (!aEnemyInfo_obj.test)
		{
			return;
		}

		let lSeparetedPoints = this.getSeparetedTrajectoryPoints(aEnemyInfo_obj.trajectory.points);
		this._drawEnemyTrajectoryBezierApproximate(aEnemyInfo_obj, lSeparetedPoints);*/
		//...DEBUG

		if (this._checkExistEnemy(aEnemyInfo_obj.id))
		{
			const lExistEnemy_obj = this._getExistEnemy(aEnemyInfo_obj.id);
			lExistEnemy_obj.prevX = aEnemyInfo_obj.x;
			lExistEnemy_obj.prevY = aEnemyInfo_obj.y;
			this._updateEnemyTrajectory(aEnemyInfo_obj.id, aEnemyInfo_obj.trajectory); // in case previous enemy has not been destroyed yet by some reason, we need to update a trajectory for it
			return;
		}

		const firstPoint = aEnemyInfo_obj.trajectory && aEnemyInfo_obj.trajectory.points ? aEnemyInfo_obj.trajectory.points[0] : null;
		let lStartPosition_pt = null;
		if (firstPoint)
		{
			lStartPosition_pt = { x: firstPoint.x, y: firstPoint.y };
		}
		aEnemyInfo_obj.startPosition = lStartPosition_pt;
		aEnemyInfo_obj.prevX = aEnemyInfo_obj.x;
		aEnemyInfo_obj.prevY = aEnemyInfo_obj.y;
		aEnemyInfo_obj.name = EnemiesController.calculateEnemyName(aEnemyInfo_obj.typeId, aEnemyInfo_obj.skin);
		aEnemyInfo_obj.allowUpdatePosition = true;
		aEnemyInfo_obj.angle = 0;
		aEnemyInfo_obj.rotationSupport = true;

		if (aEnemyInfo_obj.trajectory.isCircularTrajectory)
		{
			let lEnemyRadius = aEnemyInfo_obj.trajectory.isCircularLargeRadius ? 
									this.getCircularLargeTrajectoryRadius() : this.getCircularTrajectoryRadius(aEnemyInfo_obj.typeId);
			let lParentRadius = this.getCircularTrajectoryRadius(aEnemyInfo_obj.parentEnemyTypeId);
			aEnemyInfo_obj.circularRadius = lEnemyRadius + lParentRadius;
			let lRelativeRadius = DEFAULT_ENEMY_CIRCULAR_RADIUS / aEnemyInfo_obj.circularRadius;
			let lRadiusKoeff_num = lRelativeRadius > 1 ? Math.sqrt(Math.sqrt(lRelativeRadius)) : 1;
			aEnemyInfo_obj.isCircularSpeedCoefficient = isFlyingEnemy(aEnemyInfo_obj.typeId) ? ENEMY_CIRCULAR_SPEED_COEF / lRadiusKoeff_num: ENEMY_CIRCULAR_SPEED_COEF * 1.5 / lRadiusKoeff_num;
		}

		if (aEnemyInfo_obj.trajectory.bezierTrajectory) //trajectory approximation
		{
			aEnemyInfo_obj.trajectory = this._getEnemyTrajectoryWithApproximateData(aEnemyInfo_obj);
		}

		//[Y]DEBUG...
		// let startTime = aEnemyInfo_obj.trajectory.points[0].time;
		// let curTime = APP.gameScreen.currentTime;
		// aEnemyInfo_obj.trajectory.points.sort((a, b) => {
		// 	return (a.time - b.time)
		// });
		// for (let point of aEnemyInfo_obj.trajectory.points)
		// {
		// 	point.time = point.time - startTime + curTime;
		// }
		//...[Y]DEBUG

		this.info.registeredEnemies.push(aEnemyInfo_obj);
	}

	_getEnemyTrajectoryWithApproximateData(aEnemyInfo_obj)
	{
		let lTrajectory_obj = aEnemyInfo_obj.trajectory;
		lTrajectory_obj.separetedPoints = this.getSeparetedTrajectoryPoints(lTrajectory_obj.points);
		let lApproximateTrajectory = BezierCurve.approximateTrajectory(lTrajectory_obj.points, lTrajectory_obj.separetedPoints);
		lTrajectory_obj.approximateTrajectory = lApproximateTrajectory;

		return lTrajectory_obj;
	}

	getSeparetedTrajectoryPoints(aPoints_arr)
	{
		let lXPosionsPoints_arr = [];
		let lYPosionsPoints_arr = [];
		aPoints_arr.forEach(point =>
		{
			lXPosionsPoints_arr.push(point.x);
			lYPosionsPoints_arr.push(point.y);
		});

		let lSeparetedPoints = {};
		lSeparetedPoints.x = lXPosionsPoints_arr;
		lSeparetedPoints.y = lYPosionsPoints_arr;

		return lSeparetedPoints;
	}

	_drawEnemyTrajectoryBezierApproximate(aEnemyInfo_obj, lSeparatedPoints)
	{
		if (this.container)
		{
			this.container.destroy();
		}
		if (!APP.gameScreen.gameFieldController.screenField) return;
		this.container = APP.gameScreen.gameFieldController.screenField.addChild(new Sprite());

		let lTrajectoryPoints = aEnemyInfo_obj.trajectory.points;

		lTrajectoryPoints.forEach((point, index) =>
		{
			let gr = this.container.addChild(new PIXI.Graphics());
			gr.beginFill(0xff00ff, 1).drawCircle(0, 0, 6).endFill();
			gr.position.set(point.x, point.y);

			let l_tf = gr.addChild(new TextField({
				fontSize: 12,
				color: "0xff0000"
			}));
			l_tf.text = `${index} point{x: ${point.x}, y: ${point.y}}`;
		});

		let newpoint = BezierCurve.approximateTrajectory(lTrajectoryPoints, lSeparatedPoints);

		for (let i = 0; i < newpoint.length; i++)
		{
			let gr = this.container.addChild(new PIXI.Graphics());
			gr.beginFill(0xff0000, 1).drawCircle(0, 0, 1).endFill();
			gr.position.set(newpoint[i].x, newpoint[i].y);
		}
	}

	_checkExistEnemy(aId_num)
	{
		for (let i = 0; i < this.info.registeredEnemies.length; i++)
		{
			if (this.info.registeredEnemies[i].id == aId_num)
			{
				return true;
			}
		}
		return false;
	}

	_getExistEnemy(aId_num)
	{
		return this.info.registeredEnemies.find(aRegisteredEnemy => aRegisteredEnemy.id == aId_num);
	}

	_updateEnemyTrajectory(aEnemyId_num, aTrajectory_arr, aOptFreezeTimeMs_num=0)
	{
		const lRegisteredEnemy_obj = this._getExistEnemy(aEnemyId_num);
		if (lRegisteredEnemy_obj)
		{
			if (lRegisteredEnemy_obj.currentApproximatePositionIndex)
			{
				lRegisteredEnemy_obj.currentApproximatePositionIndex = null;
			}

			if (aOptFreezeTimeMs_num == 0)
			{
				lRegisteredEnemy_obj.trajectory = aTrajectory_arr;
				lRegisteredEnemy_obj.trajectory = this._getEnemyTrajectoryWithApproximateData(lRegisteredEnemy_obj);
				lRegisteredEnemy_obj.speed = aTrajectory_arr.speed;
				APP.currentWindow.gameFieldController.updateEnemyTrajectory(lRegisteredEnemy_obj.id, lRegisteredEnemy_obj.trajectory);
			}

			// if(lRegisteredEnemy_obj.typeId == 100)
			// {
			// 	lRegisteredEnemy_obj.trajectory = aTrajectory_arr;
			// 	lRegisteredEnemy_obj.speed = aTrajectory_arr.speed;
			// 	APP.currentWindow.gameFieldController.updateEnemyTrajectory(lRegisteredEnemy_obj.id, lRegisteredEnemy_obj.trajectory);
			// 	console.log(lRegisteredEnemy_obj);
			// }
		}
	}

	_onFreezeAffectedEnemies(aEventInfo_obj)
	{
		let lEnemies_obj = aEventInfo_obj.affectedEnemies;

		for (let lId_num in lEnemies_obj)
		{
			let lExistEnemyOnGameField_enm = APP.currentWindow.gameFieldController.getExistEnemy(Number(lId_num));
			lExistEnemyOnGameField_enm && lExistEnemyOnGameField_enm.i_freeze();
			let lEnemyInfo_obj = this._getExistEnemy(Number(lId_num));
			if (lEnemyInfo_obj)
			{
				lEnemyInfo_obj.frozen = true;
			}
		}
	}

	_onUnfreezeAffectedEnemies(aEventInfo_obj)
	{
		let lEnemiesTrajectoriesInfo_obj = aEventInfo_obj.affectedEnemies;

		for (let lId_num in lEnemiesTrajectoriesInfo_obj)
		{
			let lEnemyInfo_obj = this._getExistEnemy(Number(lId_num));

			if (lEnemyInfo_obj)
			{
				if (lEnemyInfo_obj.frozen)
				{
					lEnemyInfo_obj.frozen = false;
					lEnemyInfo_obj.lastPositionBeforeFreeze = null;
					let lExistEnemyOnGameField_enm = APP.currentWindow.gameFieldController.getExistEnemy(Number(lId_num));
					lExistEnemyOnGameField_enm && lExistEnemyOnGameField_enm.i_unfreeze();
				}

				this._updateEnemyTrajectory(Number(lId_num), lEnemiesTrajectoriesInfo_obj[lId_num]);
			}
		}
	}

	_resetTimeOffsetForEnemy(aEnemyId_num)
	{
		let lExistEnemy_obj = this._getExistEnemy(aEnemyId_num);
		if (lExistEnemy_obj)
		{
			if (lExistEnemy_obj.timeOffsetSequence)
			{
				Sequence.destroy([lExistEnemy_obj.timeOffsetSequence]);
				lExistEnemy_obj.allowUpdatePosition = true;
				lExistEnemy_obj.timeOffsetSequence = null;
			}
			lExistEnemy_obj.timeOffset = 0;
		}
	}

	_destroyEnemy(aMessageData_obj)
	{
		const lDeadEnemyId_num = aMessageData_obj.enemyId;
		this.info.registeredEnemies.forEach((aRegisteredEnemy) =>
		{
			if (aRegisteredEnemy.id === lDeadEnemyId_num)
			{
				aRegisteredEnemy.life = 0;//death flag
				APP.currentWindow.gameFieldController.setEnemyDestroy(aRegisteredEnemy.id, aMessageData_obj.reason);
			}
		});
	}

	_damageEnemyEnergy(aEnemyId_num, aEnemyDamage_num)
	{
		const lRegisteredEnemy_obj = this.info.registeredEnemies;
		for (let enemy of lRegisteredEnemy_obj)
		{
			if (enemy.id == aEnemyId_num && !isNaN(enemy.energy))
			{
				enemy.energy = Math.max(0, enemy.energy - aEnemyDamage_num);
				break;
			}
		}
	}

	_onUpdateTrajectories(data)
	{
		for (let enemyId in data.trajectories)
		{
			let trajectory = data.trajectories[enemyId];
			this._updateEnemyTrajectory(enemyId, trajectory, data.freezeTime);
		}
	}

	_getEnemyPosition(enemy)
	{
		if (enemy && enemy.trajectory)
		{
			const lIsBezierTrajectoryType_bl = enemy.trajectory.bezierTrajectory;
			if (enemy.frozen && enemy.lastPositionBeforeFreeze)
			{
				return enemy.lastPositionBeforeFreeze;
			}
			else if (lIsBezierTrajectoryType_bl)
			{
				return this._getBezierEnemyPosition(enemy);
			}
			else
			{
				return this._getLinerEnemyPosition(enemy);
			}
		}
		else
		{
			APP.logger.i_pushError(`EnemiesController. Wrong enemy info for getting position. ${JSON.stringify(enemy)}`);
			console.error(enemy);
			console.error(`Wrong enemy info for getting position`);
		}
	}

	getCircularTrajectoryRadius(aTypeId_num)
	{
		let lRadius_num = 0;
		switch (aTypeId_num)
		{
			case ENEMY_TYPES.EYE_FLAER_GREEN:
			case ENEMY_TYPES.EYE_FLAER_PERPLE:
			case ENEMY_TYPES.EYE_FLAER_RED:
			case ENEMY_TYPES.EYE_FLAER_YELLOW: //3
				lRadius_num = 37;
				break;
			case ENEMY_TYPES.JELLYFISH: //4
				lRadius_num = 44;
				break;
			case ENEMY_TYPES.MFLYER: //5
				lRadius_num = 52;
				break;
			case ENEMY_TYPES.JUMPER_BLUE:
			case ENEMY_TYPES.JUMPER_GREEN:
			case ENEMY_TYPES.JUMPER_WHITE: //8
				lRadius_num = 56;
				break;
			case ENEMY_TYPES.SLUG: //9
				lRadius_num = 50;
				break;
			case ENEMY_TYPES.ONE_EYE: //10
				lRadius_num = 52;
				break;
			case ENEMY_TYPES.POINTY: //11
				lRadius_num = 60;
				break;
			case ENEMY_TYPES.SMALL_FLYER: //12
				lRadius_num = 54;
				break;
			case ENEMY_TYPES.YELLOW_ALIEN: //13
				lRadius_num = 66;
				break;
			case ENEMY_TYPES.GREEN_HOPPER: //14
				lRadius_num = 66;
				break;
			case ENEMY_TYPES.RED_HEAD_FLYER: //15
				lRadius_num = 58;
				break;
			case ENEMY_TYPES.MOTHI_BLUE:
			case ENEMY_TYPES.MOTHI_RED:
			case ENEMY_TYPES.MOTHI_WHITE:
			case ENEMY_TYPES.MOTHI_YELLOW: //19
				lRadius_num = 64;
				break;
			case ENEMY_TYPES.FLYER_MUTALISK: //20
				lRadius_num = 64;
				break;
			case ENEMY_TYPES.KANG: //21
				lRadius_num = 64;
				break;
			case ENEMY_TYPES.PINK_FLYER: //22
				lRadius_num = 74;
				break;
			case ENEMY_TYPES.FROGGY: //23
				lRadius_num = 74;
				break;
			case ENEMY_TYPES.CRAWLER: //24
				lRadius_num = 70;
				break;
			case ENEMY_TYPES.BIORAPTOR: //25
				lRadius_num = 76;
				break;
			case ENEMY_TYPES.SPIKY: //26
				lRadius_num = 80;
				break;
			case ENEMY_TYPES.FLYER: //27
				lRadius_num = 66;
				break;
			case ENEMY_TYPES.KRANG: //28
				lRadius_num = 76;
				break;
			case ENEMY_TYPES.ROCKY:
				lRadius_num = 82;
				break;
			case ENEMY_TYPES.MONEY:
				lRadius_num = 90;
				break;
			case ENEMY_TYPES.TREX:
				lRadius_num = 84;
				break;
			case ENEMY_TYPES.GIANT_TREX:
				lRadius_num = 125;
				break;
			case ENEMY_TYPES.GIANT_PINK_FLYER:
				lRadius_num = 111;
				break;

			case ENEMY_TYPES.LASER_CAPSULE:
			case ENEMY_TYPES.KILLER_CAPSULE:
			case ENEMY_TYPES.LIGHTNING_CAPSULE:
			case ENEMY_TYPES.GOLD_CAPSULE:
			case ENEMY_TYPES.BULLET_CAPSULE:
			case ENEMY_TYPES.BOMB_CAPSULE:
			case ENEMY_TYPES.FREEZE_CAPSULE:
				lRadius_num = 92;
				break;
			case ENEMY_TYPES.BOSS:
				lRadius_num = 130;
				break;
			default:
				lRadius_num = DEFAULT_ENEMY_CIRCULAR_RADIUS;
				break;
		}

		return lRadius_num;
	}

	getCircularLargeTrajectoryRadius() //Only for formation B3
	{
		return (this.getCircularTrajectoryRadius(ENEMY_TYPES.EYE_FLAER_YELLOW)*2 + this.getCircularTrajectoryRadius(ENEMY_TYPES.JELLYFISH));
	}

	_determCircularPosition(enemy, aCurrentTime_num)
	{
		let lPosition_pt = {x: 0, y: 0};

		if (!enemy.trajectory.isCircularTrajectory)
		{
			return lPosition_pt;
		}

		let lEnemySpeed_num = enemy.speed;
		let lParentEnemy_obj = this.getEnemyById(enemy.parentEnemyId);
		if(lEnemySpeed_num == 0 && lParentEnemy_obj)
		{
			lEnemySpeed_num = lParentEnemy_obj.speed
		}

		let lFirstTrajectoryPointTime_num = enemy.trajectory.points[0].time;
		let lPassTime = (aCurrentTime_num - lFirstTrajectoryPointTime_num) * lEnemySpeed_num / enemy.isCircularSpeedCoefficient;
		if (enemy.trajectory.circularAngle && enemy.trajectory.circularAngle != -1)
		{
			lPassTime += Utils.gradToRad(enemy.trajectory.circularAngle);
		}

		lPosition_pt.x = lPosition_pt.x + enemy.circularRadius * Math.sin(lPassTime);
		lPosition_pt.y = lPosition_pt.y + enemy.circularRadius * Math.cos(lPassTime);
		
		return lPosition_pt;
	}

	_determCircularStaticPosition(enemy)
	{
		let lPosition_pt = {x: 0, y: 0};

		if (!enemy.trajectory.isCircularTrajectory)
		{
			return lPosition_pt;
		}

		let lFirstTrajectoryPointTime_num = Utils.gradToRad(enemy.trajectory.circularAngle);

		lPosition_pt.x = lPosition_pt.x + enemy.circularRadius * Math.sin(lFirstTrajectoryPointTime_num);
		lPosition_pt.y = lPosition_pt.y + enemy.circularRadius * Math.cos(lFirstTrajectoryPointTime_num);
		
		return lPosition_pt;
	}

	_getCircularStaticAngle(aAngle_num)
	{
		return Utils.gradToRad(aAngle_num + 180);
	}

	_getCircularPosition(enemy, lCurrentTime_num)
	{
		let lCircularPosition_pt = {x:0, y:0};
		if (enemy.trajectory.isCircularTrajectory)
		{
			if (enemy.trajectory.isCircularStatic)
			{
				if (enemy.trajectory.determCircularStaticPosition)
				{
					lCircularPosition_pt = enemy.trajectory.determCircularStaticPosition;
				}
				else
				{
					lCircularPosition_pt = this._determCircularStaticPosition(enemy);
					enemy.trajectory.determCircularStaticPosition = lCircularPosition_pt; //cache
				}
			}
			else
			{
				lCircularPosition_pt = this._determCircularPosition(enemy, lCurrentTime_num);
			}
		}

		return lCircularPosition_pt;
	}

	_getApproximateBezierPosition(enemy, aCurrentPercentageOfTrajectoryMoved_num)
	{
		let lApproximateTrajectory_arr = enemy.trajectory.approximateTrajectory;
		let lSeparetedPoints_arr = enemy.trajectory.separetedPoints;
		let lX_num = lApproximateTrajectory_arr[0].x;
		let lY_num = lApproximateTrajectory_arr[0].y;
		let lCorrectPercent_num = aCurrentPercentageOfTrajectoryMoved_num;

		let lStartPosition_num = 1;
		if (enemy.currentApproximatePositionIndex 
			&& lApproximateTrajectory_arr[enemy.currentApproximatePositionIndex]
			&& lApproximateTrajectory_arr[enemy.currentApproximatePositionIndex].correctPercent <= aCurrentPercentageOfTrajectoryMoved_num)
		{ 
			//if the past coordinates and path segment have already been determined, i.e. not the first drawing, then we start the search from this position
			lStartPosition_num = enemy.currentApproximatePositionIndex;
		}
		
		for (let i = lStartPosition_num; i < lApproximateTrajectory_arr.length; i++)
		{
			if (lApproximateTrajectory_arr[i].correctPercent == aCurrentPercentageOfTrajectoryMoved_num)
			{
				lCorrectPercent_num = lApproximateTrajectory_arr[i].percent;
				enemy.currentApproximatePositionIndex = i;
				break;
			}
			else if (lApproximateTrajectory_arr[i].correctPercent > aCurrentPercentageOfTrajectoryMoved_num)
			{
				let lOffsetSegmentPercent_num = aCurrentPercentageOfTrajectoryMoved_num - lApproximateTrajectory_arr[i-1].correctPercent;
				let lFullSegmentPercent_num = lApproximateTrajectory_arr[i].correctPercent - lApproximateTrajectory_arr[i-1].correctPercent;
				let lRelativeOffset_num = lOffsetSegmentPercent_num / lFullSegmentPercent_num;

				let lFullSegmentCorrectPercent_num = lApproximateTrajectory_arr[i].percent - lApproximateTrajectory_arr[i-1].percent;
				lCorrectPercent_num = lFullSegmentCorrectPercent_num * lRelativeOffset_num +  lApproximateTrajectory_arr[i-1].percent ;
				enemy.currentApproximatePositionIndex = i - 1;
				break;
			}
		}

		lX_num = BezierCurve.getCurve(lSeparetedPoints_arr.x, lCorrectPercent_num);
		lY_num = BezierCurve.getCurve(lSeparetedPoints_arr.y, lCorrectPercent_num);

		return {x: lX_num, y: lY_num};
	}

	_getBezierEnemyPosition(enemy)
	{
		let lEnemyTimeOffset_num = enemy.timeOffset || 0;
		let lCurrentTime_num = GameScreen.getSmoothServerTime() + GameScreen.getSmoothClientTimeDiff() + lEnemyTimeOffset_num;
		let lTrajectoryPoints_arr = enemy.trajectory.points;
		let lFirstTrajectoryPointTime_num = lTrajectoryPoints_arr[0].time;
		let lLastTrajectoryPointTime_num = lTrajectoryPoints_arr[lTrajectoryPoints_arr.length - 1].time;
		let lIsEnded_bl = false;
		if (lCurrentTime_num > lLastTrajectoryPointTime_num)
		{
			lIsEnded_bl = true;
		}
		let lTotalEnemyMovementTime_num = lLastTrajectoryPointTime_num - lFirstTrajectoryPointTime_num;
		let lCurrentPercentageOfTrajectoryMoved_num = Math.max((lCurrentTime_num - lFirstTrajectoryPointTime_num) / lTotalEnemyMovementTime_num, 0);

		let lEnemyPositionX_num = 0;
		let lEnemyPositionY_num = 0;

		if (enemy.trajectory.approximateTrajectory)
		{
			let lEnemyPositionPoint_pnt = this._getApproximateBezierPosition(enemy, lCurrentPercentageOfTrajectoryMoved_num);
			lEnemyPositionX_num = lEnemyPositionPoint_pnt.x;
			lEnemyPositionY_num = lEnemyPositionPoint_pnt.y;
		}
		else
		{
			APP.logger.i_pushError(`EnemiesController. Missing approximateTrajectory property, enemyid= ${enemy.id}`);
			console.error("Missing approximateTrajectory property, enemyid="+enemy.id+".");
		}

		let lCircularPosition_pt = this._getCircularPosition(enemy, lCurrentTime_num);
		lEnemyPositionX_num += lCircularPosition_pt.x;
		lEnemyPositionY_num += lCircularPosition_pt.y;

		let lAngle_num = enemy.angle || 0;
		if (enemy)
		{
			if (enemy.trajectory.isCircularTrajectory && enemy.trajectory.isCircularStatic)
			{
				lAngle_num = this._getCircularStaticAngle(enemy.trajectory.circularAngle);
			}
			else
			{
				if (enemy.prevX && enemy.prevY)
				{
					let lPrevPos_obj = {x: enemy.prevX, y: enemy.prevY};
					let lCurrentPos_obj = {x: lEnemyPositionX_num, y: lEnemyPositionY_num};
					lAngle_num = Utils.getAngle(lPrevPos_obj, lCurrentPos_obj);
				}

				if (
					(
						enemy.angle &&
						Math.sign(enemy.angle) != Math.sign(lAngle_num) && 
						Math.abs(enemy.angle + lAngle_num) < 0.001
					) ||
					(
						!enemy.rotationSupport &&
						enemy.rotationSupport != undefined
					)
				)
				{
					lAngle_num = enemy.angle;
				}
			}

			enemy.prevX = lEnemyPositionX_num;
			enemy.prevY = lEnemyPositionY_num;
		}

		return {
			x: lEnemyPositionX_num,
			y: lEnemyPositionY_num,
			angle: lAngle_num,
			isEnded: lIsEnded_bl
		};
	}

	_getLinerEnemyPosition(enemy, aFutureTimeOffset_int = 0, aIgnoreEnemyTimeOffset_bl = false)
	{
		let pMin = Number.MAX_VALUE;
		let nMin = Number.MAX_VALUE;

		let pp = null;
		let np = null;
		let nnp = null;

		let lEnemyTimeOffset_num = aIgnoreEnemyTimeOffset_bl ? 0 : (enemy.timeOffset || 0);
		let time = GameScreen.getSmoothServerTime() + GameScreen.getSmoothClientTimeDiff() + lEnemyTimeOffset_num;
		let trajectoryPoints = enemy.trajectory.points;
		if (trajectoryPoints.length == 0) return;
		let lastTrajectoryPointTime = trajectoryPoints[trajectoryPoints.length - 1].time;
		let counter = 0;
		for (let point of trajectoryPoints)
		{
			if (point.time < time)
			{
				let d = Math.abs(time - point.time);
				if (d < pMin)
				{
					pMin = d;
					pp = point;
				}
			}
			if (point.time >= time)
			{
				let d = Math.abs(time - point.time);
				if (d < nMin)
				{
					nMin = d;
					np = point;
					if (counter < trajectoryPoints.length - 1)
					{
						nnp = trajectoryPoints[counter + 1];
					}
				}
			}

			if (point.time > lastTrajectoryPointTime)
			{
				lastTrajectoryPointTime = point.time;
			}
			counter++;
		}

		let lastPointTimeInterval = lastTrajectoryPointTime - time;
		if (lastPointTimeInterval < 0)
		{
			lastPointTimeInterval = 0;
		}

		let isFirstStep = enemy.trajectory.points[0] === pp
			&& enemy.trajectory.points.length >= 3
			&& Utils.isEqualPoints(enemy.trajectory.points[0], enemy.trajectory.points[1]) && enemy.trajectory.points[0].invulnerable
			// && !enemy.frozen;

		/*let testMode = false;
		if (testMode) //set enemy position in the middle of the scene
		{
			let angles = [0, Math.PI, Math.PI * 1.2, Math.PI * 1.8];
			return {
				x: 480,
				y: 270,
				angle: (testAngleId == -1) ? angles[3] : angles[testAngleId],
				isEnded: false,
				isFirstStep: isFirstStep,
				lastPointTimeInterval: lastPointTimeInterval
			};
		}*/

		if (pp && np)
		{
			// Optimized code. Excluded sin and cos expensive operations.
			// Also calculate angle not per every frame, but once between two points. That means, we dont need to calculate atan2 at every frame.
			// Tests with performance.now() showed a performance boost for this function in about 10 times.
			// May be appropriate tested and included in the future, if performance optimizations would be needed.

			let xLen = np.x - pp.x;
			let yLen = np.y - pp.y;

			let len = Math.sqrt(xLen * xLen + yLen * yLen);

			let xOffset = (len == 0 ? 1 : xLen / len); //replacement for cos operation
			let yOffset = (len == 0 ? 0 : yLen / len); //replacement for sin operation
			let angle = 0;

			if (np.angle !== undefined)
			{
				// if angle was already calculated, use it
				angle = np.angle;
			}
			else if (Utils.isEqualPoints(pp, np) && nnp && !enemy.frozen)
			{
				// calculation for frozen enemies in lasthand state
				let nxLen = nnp.x - np.x;
				let nyLen = nnp.y - np.y;
				let nLen = Math.sqrt(nxLen * nxLen + nyLen * nyLen);
				angle = Math.atan2(nnp.y - np.y, nnp.x - np.x);
				xOffset = (nLen == 0 ? 1 : nxLen / nLen);
				yOffset = (nLen == 0 ? 0 : nyLen / nLen);
			}
			else
			{
				angle = Math.atan2(yLen, xLen);
			}

			np.angle = angle; //remember angle for the further steps

			let d = np.time - pp.time;
			let c = time - pp.time;
			len = len * (c / d);

			let x = pp.x + xOffset * len;
			let y = pp.y + yOffset * len;

			return { x: x, y: y, invulnerable: pp.invulnerable, angle: angle, isEnded: false, isFirstStep: isFirstStep, lastPointTimeInterval: lastPointTimeInterval };

		}
		else if (pp)
		{
			return {
				x: pp.x,
				y: pp.y,
				angle: 0,
				invulnerable: pp.invulnerable,
				isEnded: true,
				isFirstStep: isFirstStep,
				lastPointTimeInterval: lastPointTimeInterval
			};
		}
		else if (np)
		{
			return {
				x: np.x,
				y: np.y,
				angle: undefined,
				isHidden: true,
				invulnerable: undefined,
				isFirstStep: isFirstStep,
				lastPointTimeInterval: lastPointTimeInterval
			};
		}

		return null;
	}

	_getEnemyPositionInTheFuture(aEnemyId_int, aFutureTimeOffset_num = 0)
	{
		let enemy = this._getExistEnemy(aEnemyId_int);
		if (enemy)
		{
			//https://jira.dgphoenix.com/projects/MQ/issues/MQ-1218...
			let lIgnoreEnemyTimeOffset_bl = false;
			if (enemy.typeId == ENEMY_TYPES.BOSS)
			{
				lIgnoreEnemyTimeOffset_bl = true;
			}
			//...MQ-1218

			return this._getEnemyPosition(enemy, aFutureTimeOffset_num, lIgnoreEnemyTimeOffset_bl);
		}
		return null;
	}

	_clear()
	{
		this.info.registeredEnemies = [];
	}

	_updateEnemyHealth(enemy, params)
	{
		if (params.life === 0)
		{
			enemy.life = params.life;
		}

		enemy.awardedPrizes = params.awardedPrizes;
	}

	_tryToRemoveEnemy(aEnemyId_num)
	{
		let enemy = this._getExistEnemy(aEnemyId_num);
		if (enemy)
		{
			this._removeEnemy(enemy);
		}
	}

	_removeEnemy(enemy)
	{
		const lRegisteredEnemy_obj = this.info.registeredEnemies;
		for (let i = 0; i < lRegisteredEnemy_obj.length; i++)
		{
			if (enemy.id == lRegisteredEnemy_obj[i].id)
			{
				APP.currentWindow.gameFieldController.hideEnemyEffectsBeforeDeathIfRequired(enemy);

				lRegisteredEnemy_obj.splice(i, 1);
				i--;
			}
		}

		//debug trajectory draw...
		// enemy.gr && enemy.gr.destroy();
		// enemy.gr = null;
		//...debug trajectory draw
	}

	_updateEnemies()
	{
		const lRegisteredEnemy_obj = this.info.registeredEnemies;
		for (let enemy of lRegisteredEnemy_obj)
		{
			if (!enemy.allowUpdatePosition || enemy.frozen && !enemy.lastPositionBeforeFreeze)
			{
				continue;
			}

			enemy.invulnerable = false;

			let p = this._getEnemyPosition(enemy);
			if (p)
			{
				enemy.x = p.x;
				enemy.y = p.y;
				enemy.angle = p.angle;
				enemy.isEnded = !!p.isEnded;
				enemy.isFirstStep = p.isFirstStep;
				enemy.lastPointTimeInterval = p.lastPointTimeInterval;
				enemy.invulnerable = p.invulnerable;
			}
		}
	}

	setEnemyAwaitingDelayedHit(aId_num)
	{
		const lRegisteredEnemy_obj = this.info.registeredEnemies;
		for (let i = 0; i < lRegisteredEnemy_obj.length; i++)
		{
			let enemy = lRegisteredEnemy_obj[i];
			if (enemy.id == aId_num)
			{
				enemy.isAwaitingDelayedHit = true;
				break;
			}
		}
	}

	_removeOutsideEnemies()
	{
		const lRegisteredEnemy_obj = this.info.registeredEnemies;
		for (let i = 0; i < lRegisteredEnemy_obj.length; i++)
		{
			let enemy = lRegisteredEnemy_obj[i];
			if (enemy.isEnded && enemy.typeId !== ENEMY_TYPES.BOSS && !enemy.isAwaitingDelayedHit)
			{
				lRegisteredEnemy_obj.splice(i, 1);
				APP.currentWindow.gameFieldController.removeEnemy(enemy);
				i--;
			}
		}
	}

	_drawEnemies()
	{
		APP.currentWindow.gameFieldController.drawEnemies(this.info.registeredEnemies.slice());
	}

	tick()
	{
		this._updateEnemies();
		this._drawEnemies();
		this._removeOutsideEnemies();
	}

	destroy()
	{
		super.destroy();
	}
}

export default EnemiesController;