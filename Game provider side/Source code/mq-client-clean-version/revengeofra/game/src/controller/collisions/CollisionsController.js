import SimpleController from '../../../../../common/PIXI/src/dgphoenix/unified/controller/base/SimpleController';
import CollisionsInfo from '../../model/collisions/CollisionsInfo';
import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import GameScreen from '../../main/GameScreen';
import CollidersController from './CollidersController';
import {getCirclesCollision, getRectanglesCircleCollision, isPointInsideRect} from '../../model/collisions/CollisionTools';
import { Utils } from '../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';

const COLLISIONS_DIAMETER = 250;

class CollisionsController extends SimpleController
{
	static get EVENT_ON_COLLISION_OCCURRED ()	{ return "EVENT_ON_COLLISION_OCCURRED" };

	constructor(aInfo_csi = null)
	{
		let lInfo_csi = aInfo_csi ? aInfo_csi : new CollisionsInfo();
		super (lInfo_csi);

		this._fMapsInfo_msi = null;
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

		let lCollidersController = APP.currentWindow.collidersController;
		lCollidersController.on(CollidersController.EVENT_ON_COLLIDERS_UPDATED, this._onCollidersUpdated, this);
		this._fCollidersInfo_csi = lCollidersController.info;
	}

	_onGSReady(event)
	{
		this._startHandlingEnvMessages();
	}

	_onCollidersUpdated(event)
	{
		this._findCollisions();		
	}

	get _mapsInfo()
	{
		return this._fMapsInfo_msi || (this._fMapsInfo_msi = APP.currentWindow.mapsController.info);
	}

	_findCollisions()
	{
		let lEnemiesColliders = this._fCollidersInfo_csi.enemiesColliders;
		let lBulletsColliders = this._fCollidersInfo_csi.bulletsColliders;

		for (let i=0; i<lBulletsColliders.length; i++)
		{
			let lBulletCollider = lBulletsColliders[i];

			for (let j=0; j<lEnemiesColliders.length; j++)
			{
				let lEnemyCollider = lEnemiesColliders[j];

				var lDistance_num = Utils.getDistance(new PIXI.Point(lBulletCollider.x, lBulletCollider.y), new PIXI.Point(lEnemyCollider.x, lEnemyCollider.y));
				if (lDistance_num > COLLISIONS_DIAMETER) // for calculations optimization
				{
					continue;
				}

				let lCollisionComponents = this._getCollision(lBulletCollider, lEnemyCollider);
				if (!!lCollisionComponents)
				{
					if (this._isCollisionInRestrictedArea(lCollisionComponents, lEnemyCollider))
					{
						continue;
					}

					this._onCollisionFound(lBulletCollider, lEnemyCollider);
					return;
				}
			}
		}
	}

	_isCollisionInRestrictedArea(aCollisionComponents, aEnemyCollider)
	{
		if (aEnemyCollider.isEverywhereCollisionAllowed)
		{
			return false;
		}

		let lCurCollisionRestrictedRects = this._mapsInfo.currentMapCollisionRestrictedRects;

		if (!lCurCollisionRestrictedRects || !lCurCollisionRestrictedRects.length)
		{
			return false;
		}

		let lInsideMarks_arr = [false, false, false];
		for (let i=0; i<lCurCollisionRestrictedRects.length; i++)
		{
			let lCurRect = lCurCollisionRestrictedRects[i];
			if (isPointInsideRect(lCurRect, {x: aEnemyCollider.x, y: aEnemyCollider.y}))
			{
				lInsideMarks_arr[0] = true;
			}

			if (isPointInsideRect(lCurRect, {x: aCollisionComponents[0].centerX, y: aCollisionComponents[0].centerY}))
			{
				lInsideMarks_arr[1] = true;
			}

			if (isPointInsideRect(lCurRect, {x: aCollisionComponents[1].centerX, y: aCollisionComponents[1].centerY}))
			{
				lInsideMarks_arr[2] = true;
			}
		}

		for (let i=0; i<lInsideMarks_arr.length; i++)
		{
			if (!lInsideMarks_arr[i])
			{
				return false;
			}
		}

		return true;
	}

	_onCollisionFound(aBulletCollider, aEnemyCollider)
	{
		this.emit(CollisionsController.EVENT_ON_COLLISION_OCCURRED, {enemyId: aEnemyCollider.enemyId, bullet: {id: aBulletCollider.bulletId, x: aBulletCollider.x, y: aBulletCollider.y, angle: aBulletCollider.currentAngle}});
	}

	_getCollision(aBulletCollider, aEnemyCollider)
	{
		let lBulletGlobalCircles = aBulletCollider.globalCircles;
		for (let i=0; i<lBulletGlobalCircles.length; i++)
		{
			let lBulletComponentCollision = this._getBulletComponentCollision(lBulletGlobalCircles[i], aEnemyCollider)
			if (!!lBulletComponentCollision)
			{
				return lBulletComponentCollision;
			}
		}		

		return null;
	}

	_getBulletComponentCollision(aBulletCircleComponent, aEnemyCollider)
	{
		return getCirclesCollision(aBulletCircleComponent, aEnemyCollider.globalCircles)
				|| getRectanglesCircleCollision(aEnemyCollider.globalRects, aBulletCircleComponent);
	}
}

export default CollisionsController