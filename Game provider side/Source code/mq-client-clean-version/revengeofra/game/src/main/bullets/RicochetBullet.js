import Sprite from '../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import PlayerSpot from './../playerSpots/PlayerSpot';
import CollisionsController from '../../controller/collisions/CollisionsController';
import GameScreen from '../GameScreen';

const FLY_SPEED = 1.6;
let localId = 0;

const DEBUG_RICOCHETS_LIMIT = -1; // -1 for unlimited

class RicochetBullet extends Sprite
{
	static get EVENT_ON_RICOCHET_BULLET_COLLISION_OCCURRED()	{ return 'EVENT_ON_RICOCHET_BULLET_COLLISION_OCCURRED';}
	static get EVENT_ON_RICOCHET_BULLET_SHOT_OCCURRED()			{ return 'EVENT_ON_RICOCHET_BULLET_SHOT_OCCURRED';}
	static get EVENT_ON_RICOCHET_BULLET_DESTROY()				{ return 'EVENT_ON_RICOCHET_BULLET_DESTROY';}
	static get EVENT_ON_RICOCHET_BULLET_MOVE()					{ return 'EVENT_ON_RICOCHET_BULLET_MOVE';}

	get bulletId()
	{
		return this._bulletId;
	}

	get seatId()
	{
		return +this._bulletId.slice(0, 1);
	}

	get isMasterBullet()
	{
		let currentSeatId = APP.gameScreen.gameField.seatId;
		return this.seatId === currentSeatId;
	}

	get directionAngle()
	{
		return Math.PI-this._bulletAngle;
	}

	disableRicochet()
	{
		this._disableRicochet();
	}

	constructor(defaultBulletId, startPos, endPos, bulletId = null, timeDiff = 0, lasthand = false)
	{
		super();

		this.localId = localId++;
		if (bulletId === null || bulletId === undefined)
		{
			let seatId = APP.gameScreen.gameField.seatId;
			this._bulletId = seatId + "_" + this.localId;
		}
		else
		{
			this._bulletId = bulletId;
		}
		this.timeDiff = timeDiff;
		this._fFire_spr = null;
		this._wallsCollisionPoints = null;
		this.defaultBulletId = defaultBulletId;
		this.startPos = startPos;
		this.endPos = endPos;
		this._bulletAngle = Math.atan2(this.endPos.y - this.startPos.y, this.endPos.x - this.startPos.x);
		this._bulletAngle = +this._bulletAngle.toFixed(2);
		this.fireRotation = this._bulletAngle + Math.PI/2;
		this._isActive = false;
		this._fDisappeared_bl = false;
		this._isRicochetAllowed = true;
		this._debugRicochetsLimit = DEBUG_RICOCHETS_LIMIT;
		this._lasthand = lasthand;
		this._fIsConfirmed_bl = false;
		this._fIsCollisionOccurred_bl = false;
		this._fCollisionInfo_obj = null;

		APP.gameScreen.collisionsController.on(CollisionsController.EVENT_ON_COLLISION_OCCURRED, this._onCollisionOccurred, this);
		
		if (this.isMasterBullet)
		{
			APP.gameScreen.on(GameScreen.EVENT_ON_BULLET_RESPONSE, this._onBulletResponse, this);
			this._activateBullet();
		}

		this.once('added', ()=>this.createView());
	}

	_onBulletResponse(event)
	{
		if (event.data.bulletId === this.bulletId)
		{
			APP.gameScreen.off(GameScreen.EVENT_ON_BULLET_RESPONSE, this._onBulletResponse, this);

			this._fIsConfirmed_bl = true;

			this._tryToCompleteShot();
		}
	}

	get wallsCollisionPoints()
	{
		if (!this._wallsCollisionPoints)
		{
			switch(this.defaultBulletId)
			{
				case 5:
					this._wallsCollisionPoints = [new PIXI.Point(0, -40)];
				break;
				case 4:
					this._wallsCollisionPoints = [new PIXI.Point(0, -20)];
				break;
				case 3:
				case 2:
					this._wallsCollisionPoints = [new PIXI.Point(0, -18)];
				break;
				case 1:
				default:
					this._wallsCollisionPoints = [new PIXI.Point(0, -15)];
				break;
			}
		}

		return this._wallsCollisionPoints;
	}

	get localWallsCollisionPoints()
	{
		if (this._fFire_spr)
		{
			let points = [];
			for (let point of this.wallsCollisionPoints)
			{
				let newPoint = this._fFire_spr.localToLocal(point.x, point.y, this);
				points.push(new PIXI.Point(newPoint.x, newPoint.y));
			}
			return points;
		}

		return this.wallsCollisionPoints;
	}

	get isChangeDirectionAllowed()
	{
		return this._isRicochetAllowed;
	}

	_disableRicochet()
	{
		this._isRicochetAllowed = false;

		this._deactivateBullet();

		if (this.disappeared)
		{
			this.destroy();
		}
	}

	createView()
	{
		this.addFire();

		this.startBulletFly(this.startPos, this.endPos, true);

		this.on('tick', this.onTick, this);
	}

	startBulletFly(startPos, endPos, start = false)
	{
		if (this._debugRicochetsLimit === 0)
		{
			this._disableRicochet();
			return;
		}

		if (this._debugRicochetsLimit !== -1) --this._debugRicochetsLimit;

		this.startPos = startPos;
		this.endPos = endPos;
		if (!start)
		{
			this.startPos.x = +(this.startPos.x.toFixed(1));
			this.startPos.y = +(this.startPos.y.toFixed(1));
			this.endPos.x = +(this.endPos.x.toFixed(1));
			this.endPos.y = +(this.endPos.y.toFixed(1));
		}

		if (this.startPos.x == this.endPos.x) this.endPos.x+=1;
		if (this.startPos.y == this.endPos.y) this.endPos.y+=1;

		this.position.set(this.startPos.x, this.startPos.y);

		this._bulletAngle = Math.atan2(this.endPos.y - this.startPos.y, this.endPos.x - this.startPos.x);
		this._bulletAngle = +this._bulletAngle.toFixed(2);
		this.angleCos = Math.cos(this._bulletAngle);
		this.angleSin = Math.sin(this._bulletAngle);
		this.fireRotation = this._bulletAngle + Math.PI/2;

		if (this._fFire_spr)
		{
			this._fFire_spr.rotation = this.fireRotation;

			// Debug walls collision shape...
			// this._debugWallsCollisionShape();
			// ...Debug walls collision shape
		}
	}

	_debugWallsCollisionShape()
	{
		this._debugHitLine && this._debugHitLine.destroy();

		let points = this.localWallsCollisionPoints;
		this._debugHitLine = this.addChild(new PIXI.Graphics());
		this._debugHitLine.lineStyle(4, 0xff00ff, 0.8).drawPolygon(points);
	}

	onTick(e)
	{
		if (!this.endPos)
		{
			return;
		}

		if (this.disappeared)
		{
			this._fFire_spr.visible = false;
			
			this.off('tick', this.onTick, this);
		}

		let step = e.delta * FLY_SPEED;
		this.x += this.angleCos*step;
		this.y += this.angleSin*step;

		if (this.timeDiff > 0)
		{
			let delta = e.delta / 2;
			if (this._lasthand)
			{
				delta *= 10; // Speed up x10 times
			}
			if (this.timeDiff - delta < 0)
			{
				delta = this.timeDiff;
				this.timeDiff = 0;
			}
			else
			{
				this.timeDiff -= delta;
			}

			step = delta * FLY_SPEED;
			this.x += this.angleCos*step;
			this.y += this.angleSin*step;
		}
		else
		{
			this._lasthand = false;
		}

		this.emit(RicochetBullet.EVENT_ON_RICOCHET_BULLET_MOVE);

		if (this._lasthand)
		{
			this.onTick({delta:e.delta});
		}
	}

	addFire()
	{
		let lBullet, asset = this.assetName;
		switch (this.defaultBulletId)
		{
			case 1:
			case 2:
			case 3:
				this._fFire_spr = this.addChild(APP.library.getSprite(asset));
				break;
			case 4:
				this._fFire_spr = this.addChild(new Sprite);
				lBullet = this._fFire_spr.addChild(APP.library.getSprite(asset));
				lBullet.position.x -= 10;
				lBullet = this._fFire_spr.addChild(APP.library.getSprite(asset));
				lBullet.position.x += 10;
				break;
			case 5:
				this._fFire_spr = this.addChild(new Sprite);
				lBullet = this._fFire_spr.addChild(APP.library.getSprite(asset));
				lBullet.position.x -= 20;
				lBullet = this._fFire_spr.addChild(APP.library.getSprite(asset));
				lBullet.position.y -= 35;
				lBullet = this._fFire_spr.addChild(APP.library.getSprite(asset));
				lBullet.position.x += 20;
				break;
			default:
				this._fFire_spr = this.addChild(APP.library.getSprite('blend/bullet'));
				this._fFire_spr.blendMode = PIXI.BLEND_MODES.ADD;
				break;
		}

		let scaleX = this._fFire_spr.scale.x * 0.5;
		let scaleY = this._fFire_spr.scale.y * 0.5;
		this._fFire_spr.scale.set(scaleX * PlayerSpot.WEAPON_SCALE, scaleY * PlayerSpot.WEAPON_SCALE);
	}

	get assetName()
	{
		switch (this.defaultBulletId)
		{
			case 1: return 'weapons/DefaultGun/turret_1/bullet';
			case 2: return 'weapons/DefaultGun/turret_2/bullet';
			case 3: return 'weapons/DefaultGun/turret_3/bullet';
			case 4: return 'weapons/DefaultGun/turret_4/bullet';
			case 5: return 'weapons/DefaultGun/turret_5/bullet';
		}
		return 'blend/bullet';
	}

	_activateBullet()
	{
		this._isActive = true;
	}

	_deactivateBullet()
	{
		this._isActive = false;
	}

	get isActive()
	{
		return this._isActive;
	}

	_onCollisionOccurred(event)
	{
		let lBulletInfo = event.bullet;
		let lCollisionBulletId_str = lBulletInfo.id;
		if (lCollisionBulletId_str == this.bulletId)
		{
			this._fIsCollisionOccurred_bl = true;
			this._fCollisionInfo_obj = {enemyId: event.enemyId, x: lBulletInfo.x, y: lBulletInfo.y, bulletId: lBulletInfo.id }

			APP.gameScreen.collisionsController.off(CollisionsController.EVENT_ON_COLLISION_OCCURRED, this._onCollisionOccurred, this);

			this._deactivateBullet();

			this.emit(RicochetBullet.EVENT_ON_RICOCHET_BULLET_COLLISION_OCCURRED);

			this.disappear();

			this._tryToCompleteShot();
		}
	}

	_tryToCompleteShot()
	{
		if (this.isCompleted)
		{
			this._onBulletShot();
		}
	}

	_onBulletShot()
	{
		if (!this._fCollisionInfo_obj)
		{
			throw new Error(`Cannot send ricochet shot, bullet collision info is null`);
			return;
		}
		this.emit(RicochetBullet.EVENT_ON_RICOCHET_BULLET_SHOT_OCCURRED, this._fCollisionInfo_obj);
	}

	disappear()
	{
		this._onDisappeared();
	}

	_onDisappeared()
	{
		this._fDisappeared_bl = true;
	}

	get disappeared()
	{
		return this._fDisappeared_bl;
	}

	get isCompleted()
	{
		return this._fIsCollisionOccurred_bl && this._fIsConfirmed_bl;
	}

	tick(delta, realDelta)
	{
		// this.emit('tick', {delta: delta});
		this.emit('tick', {delta: realDelta});
	}

	destroy()
	{
		APP.gameScreen.collisionsController.off(CollisionsController.EVENT_ON_COLLISION_OCCURRED, this._onCollisionOccurred, this);
		APP.gameScreen.off(GameScreen.EVENT_ON_BULLET_RESPONSE, this._onBulletResponse, this);

		this.off('tick', this.onTick, this);

		this.emit(RicochetBullet.EVENT_ON_RICOCHET_BULLET_DESTROY, {bulletId: this._bulletId});

		super.destroy();

		this.startPos = undefined;
		this.endPos = undefined;
		this._bulletAngle = undefined;
		this.fireRotation = undefined;
		this.defaultBulletId = undefined;
		this._fFire_spr = undefined;
		this._wallsCollisionPoints = undefined;
		this._isActive = undefined;
		this._fDisappeared_bl = undefined;
		this._isRicochetAllowed = undefined;
		this._debugRicochetsLimit = undefined;
		this._lasthand = undefined;
		this._fIsConfirmed_bl = undefined;
		this._fIsCollisionOccurred_bl = undefined;
		this._fCollisionInfo_obj = null;
	}
}

export default RicochetBullet;