import SimpleController from '../../../../../common/PIXI/src/dgphoenix/unified/controller/base/SimpleController';
import CollidersInfo from '../../model/collisions/CollidersInfo';
import EnemyColliderInfo from '../../model/collisions/EnemyColliderInfo';
import BulletColliderInfo from '../../model/collisions/BulletColliderInfo';
import CircleComponent from '../../model/collisions/CircleComponent';
import RectComponent from '../../model/collisions/RectComponent';
import GameScreen from '../../main/GameScreen';
import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import GameStateController from '../state/GameStateController';
import GameField from '../../main/GameField';
import Sprite from '../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import {getEnemyColliderDescriptor} from '../../model/collisions/EnemiesCollidersDescriptor';
import {getTurretColliderDescriptor} from '../../model/collisions/BulletsCollidersDescriptor';
import RicochetBullet from '../../main/bullets/RicochetBullet';
import {isBossEnemy, BASE_FRAME_RATE, ENEMIES} from '../../../../shared/src/CommonConstants';
import {WEAK_HEALTH_THRESHOLD} from '../../main/enemies/BossEnemy';
import TournamentModeController from '../custom/tournament/TournamentModeController';

const BULLET_MAX_SCALE = 2;

class CollidersController extends SimpleController
{
	static get EVENT_ON_COLLIDERS_UPDATED ()	{ return "EVENT_ON_COLLIDERS_UPDATED" };

	constructor(aInfo_csi = null)
	{
		let lInfo_csi = aInfo_csi ? aInfo_csi : new CollidersInfo();
		super (lInfo_csi);
	}

	__initModelLevel()
	{
		super.__initModelLevel();
	}

	__initControlLevel()
	{
		super.__initControlLevel();

		let gs = this._gs = APP.currentWindow;
		if (gs.isReady)
		{
			this._startHandlingEnvMessages();
		}
		else
		{
			gs.on(GameScreen.EVENT_ON_READY, this._onGSReady, this);
		}
	}

	_startHandlingEnvMessages()
	{
		let gs = this._gs;

		gs.on(GameScreen.EVENT_ON_TICK_OCCURRED, this._onGSTickOccurred, this);
		gs.on(GameScreen.EVENT_ON_SIT_OUT_REQUIRED, this._onSitOutRequired, this);
		
		let lGameStateController = APP.currentWindow.gameStateController;
		lGameStateController.on(GameStateController.EVENT_ON_GAME_STATE_CHANGED, this._onGameStateChanged, this);
		this._fGameStateInfo_gsi = lGameStateController.info;

		gs.gameField.on(GameField.EVENT_ON_ROOM_FIELD_CLEARED, this._onRoomCleared, this);

		let lTournamentModeController_tmc = APP.tournamentModeController;
		lTournamentModeController_tmc.on(TournamentModeController.EVENT_ON_TOURNAMENT_SERVER_STATE_CHANGED, this._onTournamentModeServerStateChanged, this);
		this._fTournamentModeInfo_tmi = lTournamentModeController_tmc.info;
	}

	_onGSReady(event)
	{
		this._startHandlingEnvMessages();
	}

	_onGSTickOccurred(event)
	{
		this._rebuildColliders(event.delta, event.realDelta);
	}

	_onGameStateChanged(event)
	{
		if (!this._collidersAllowed)
		{
			this._removeAllColliders();
		}
	}

	_onTournamentModeServerStateChanged(event)
	{
		if (!this._collidersAllowed)
		{
			this._removeAllColliders();
		}
	}

	_onSitOutRequired(event)
	{
		if (!this._collidersAllowed)
		{
			this._removeAllColliders();
		}
	}

	_onRoomCleared(event)
	{
		this._removeAllColliders();
	}

	get _collidersAllowed()
	{
		if (
				!this._fGameStateInfo_gsi.isPlayState
				|| this._fTournamentModeInfo_tmi.isTournamentOnServerCompletedState
				|| APP.webSocketInteractionController.isSitoutRequestInProgress
			)
		{
			return false;
		}

		return true;
	}

	_rebuildColliders(aDelta_num, aRealDelta_num)
	{
		this._removeAllColliders();
		
		if (!this._collidersAllowed)
		{
			return;
		}

		this._addBulletsColliders(aRealDelta_num);

		let lBulletsColliders = this.info.bulletsColliders;
		if (!lBulletsColliders || !lBulletsColliders.length)
		{
			// no need to add enemies colliders if there are no bullets
			return;
		}

		this._addEnemiesColliders();

		//debug...
		// this._drawColliders();
		//...debug

		this.emit(CollidersController.EVENT_ON_COLLIDERS_UPDATED);
	}

	// enemies colliders...
	_addEnemiesColliders()
	{
		let lEnemies_obj_arr = this._gs.getEnemies();
		for (let i=0; i<lEnemies_obj_arr.length; i++)
		{
			let lEnemy_obj = lEnemies_obj_arr[i];

			if (
					lEnemy_obj.life === 0
					|| lEnemy_obj.isFirstStep
					|| lEnemy_obj.invulnerable
					|| lEnemy_obj.isEnded
					|| lEnemy_obj.isHidden
				)
			{
				continue;
			}

			this.info.addEnemyCollider(this._generateEnemyCollider(lEnemy_obj));
		}
	}

	_generateEnemyCollider(aEnemy_obj)
	{
		let lIsEnemyWeakState_bl = this._isEnemyWeakState(aEnemy_obj);
		let lColliderDescr = getEnemyColliderDescriptor(aEnemy_obj.name, aEnemy_obj.angle, lIsEnemyWeakState_bl);
		
		let lIsEnemyEverywhereCollisionAllowed_bl = aEnemy_obj.name == ENEMIES.Locust || aEnemy_obj.name == ENEMIES.LocustTeal;

		let lEnemyCollider = new EnemyColliderInfo(aEnemy_obj.id, lColliderDescr, lIsEnemyEverywhereCollisionAllowed_bl);
		lEnemyCollider.x = aEnemy_obj.x;
		lEnemyCollider.y = aEnemy_obj.y;

		let lEnemyView_e = APP.currentWindow.gameField.getEnemyById(aEnemy_obj.id);
		if (lEnemyView_e && lEnemyView_e.isJumping)
		{
			lEnemyCollider.y += lEnemyView_e.colliderYShift || 0;
		}

		return lEnemyCollider;
	}

	_isEnemyWeakState(aEnemy_obj)
	{
		let lEnemyName_str = aEnemy_obj.name;
		let lEnemyId_num = aEnemy_obj.id;
		let lEnemyTypeId_num = aEnemy_obj.typeId;
		
		if (isBossEnemy(lEnemyTypeId_num))
		{
			let lEnemyView = this._gs.gameField.getExistEnemy(lEnemyId_num);
			if (!!lEnemyView)
			{
				return lEnemyView.isHealthStateWeak;
			}
			else
			{
				let healthPercent = aEnemy_obj.energy / aEnemy_obj.fullEnergy;
				return healthPercent <= WEAK_HEALTH_THRESHOLD; 
			}
		}

		return false;
	}
	//...enemies colliders

	//bullets colliders...
	_addBulletsColliders(aRealTickDelta_num)
	{
		let lBullets_sprt_arr = this._gs.getBullets();
		
		for (let i=0; i<lBullets_sprt_arr.length; i++)
		{
			let lBullet_sprt = lBullets_sprt_arr[i];

			if (
					!(lBullet_sprt instanceof RicochetBullet)
					|| !lBullet_sprt.isActive
					|| !lBullet_sprt.isMasterBullet
				)
			{
				continue;
			}

			let lBulletCollider = this._generateBulletCollider(lBullet_sprt, aRealTickDelta_num);
			lBulletCollider.x = lBullet_sprt.x;
			lBulletCollider.y = lBullet_sprt.y;

			this.info.addBulletCollider(lBulletCollider);
		}
	}

	_generateBulletCollider(aBullet_sprt, aRealTickDelta_num)
	{
		let lTurretType_int = aBullet_sprt.defaultBulletId;
		let lColliderDescr = getTurretColliderDescriptor(lTurretType_int);

		let lBulletScale = aRealTickDelta_num/BASE_FRAME_RATE;
		if (lBulletScale > BULLET_MAX_SCALE)
		{
			lBulletScale = BULLET_MAX_SCALE;
		}

		let lBulletCollider = new BulletColliderInfo(aBullet_sprt.bulletId);
		lBulletCollider.applyCollider(lColliderDescr, aBullet_sprt.directionAngle, lBulletScale);

		return lBulletCollider;
	}
	//...bullets colliders

	//debug...
	_drawColliders()
	{
		let lContainer = this._debugContainer || (this._debugContainer = new Sprite);
		lContainer.zIndex = 10000000;
		if (!lContainer.parent && this._gs.gameField.screen) 
		{
			this._gs.gameField.screen.addChild(lContainer);
		}

		lContainer.destroyChildren();

		let lEnemiesColliders = this.info.enemiesColliders;
		for (let i=0; i<lEnemiesColliders.length; i++)
		{
			this._drawCollider(lEnemiesColliders[i]);
		}

		let lBulletsColliders = this.info.bulletsColliders;
		for (let i=0; i<lBulletsColliders.length; i++)
		{
			this._drawCollider(lBulletsColliders[i]);
		}
	}

	_clearCollidersView()
	{
		let lContainer = this._debugContainer || (this._debugContainer = new Sprite);
		lContainer.destroyChildren();
	}

	_drawCollider(aColliderInfo)
	{
		let lContainer = this._debugContainer;

		let colliderInfo = aColliderInfo;
		let lColliderView = lContainer.addChild(new Sprite);
		lColliderView.x = colliderInfo.x;
		lColliderView.y = colliderInfo.y;

		let circles = colliderInfo.circles;
		for (let i=0; i<circles.length; i++)
		{
			let circle = circles[i];
			lColliderView.addChild(this._getCircleView(circle.centerX, circle.centerY, circle.radius));
		}

		let rects = colliderInfo.rects;
		for (let i=0; i<rects.length; i++)
		{
			let rect = rects[i];
			lColliderView.addChild(this._getRectView(rect.centerX, rect.centerY, rect.width, rect.height));
		}
	}

	_getCircleView(baseX, baseY, baseRadius)
	{
		var g = new PIXI.Graphics();
		g.beginFill(0x00ff00, 0.5);
		g.drawCircle(baseX, baseY, baseRadius);
		g.endFill();

		return g;
	}

	_getRectView(baseX, baseY, baseWidth, baseHeight)
	{
		var g = new PIXI.Graphics();
		g.beginFill(0x00ff00, 0.5);
		g.drawRect(baseX-baseWidth/2, baseY-baseHeight/2, baseWidth, baseHeight);
		g.endFill();

		return g;
	}
	//...debug

	_removeAllColliders()
	{
		this.info.removeAllColliders();

		this._clearCollidersView();
	}
}

export default CollidersController