import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sprite from '../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { WEAPONS } from '../../../../shared/src/CommonConstants';
import Sequence from '../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { Utils } from '../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import {Z_INDEXES} from '../GameField';
import PlayerSpot from '../playerSpots/PlayerSpot';

const DISTANCE_EPS = 10;//px

class Bullet extends Sprite
{
	static get EVENT_ON_SHOW_RICOCHET_EFFECT() 	{ return 'EVENT_ON_SHOW_RICOCHET_EFFECT'};
	static get EVENT_ON_DESTROYED()				{ return 'EVENT_ON_DESTROYED'};
	static get EVENT_ON_DISAPPEAR()				{ return 'EVENT_ON_DISAPPEAR'};

	constructor(params, points, callback)
	{
		super();
		
		this.pointsArray = points.reverse();
		this._fCallback_func = callback;

		let startPos = this.pointsArray.pop();
		let endPos = this.pointsArray.pop();

		this.id = params.id || 0;
		this.typeId = params.typeId;
		this.defaultWeaponBulletId = params.defaultWeaponBulletId;
		this.radius = params.radius || 4;

		this.startPos = startPos;

		this.endPos = endPos;
		this.targetEnemy = params.targetEnemy;
		this.randomOffset = params.randomOffset;
		this._bulletAngle = Math.atan2(endPos.x - startPos.x, endPos.y - startPos.y) + Math.PI/2;
		this.preEndProps = (params.preEndPos === undefined) ? null : params.preEndPos;

		this._fFire_spr = null;
		this._fCircles_sprt_arr = null;
		this.pathCount = undefined;
		this._fWeaponScale = params.weaponScale ? params.weaponScale: 1;

		this.fireRotation = -this._bulletAngle - Math.PI/2;

		this.speed = this.getSpeed();

		this.trailTime = 0;

		this._fDisappeared_bl = false;

		this.targetEnemy && this.targetEnemy.once(Sprite.EVENT_ON_DESTROYING, this._onTargetEnemyDestroyed, this);

		this.once('added', () => {
			this.createView(callback);
		})
	}

	_onTargetEnemyDestroyed(event)
	{
		this.targetEnemy = null;
	}

	getSpeed()
	{
		switch (this.typeId)
		{
			case WEAPONS.DEFAULT: 
				return 4;
			default: 
				return 3;
		}
	}

	createView(callback)
	{
		this.addFire();
		this.setPos(callback);
	}

	setPos(callback)
	{
		this.position.set(this.startPos.x, this.startPos.y);
		this.pathCount = 0;

		this.showDefaultTrajectory(callback);
		
		this.zIndex = Z_INDEXES.BULLET;
	}

	showDefaultTrajectory(callback)
	{
		let len = Math.sqrt(Math.pow(this.x - this.endPos.x, 2) + Math.pow(this.y - this.endPos.y, 2));
		let time = len / this.speed;

		if(this.pointsArray.length == 0)
		{
			this.scaleTo(0.5, time);

			this.on('tick', this.onTick, this);
		}
		else
		{
			this.scaleTo(0.1, time);
			
			this.moveTo(this.endPos.x, this.endPos.y, time, null, (e) => {
				this.startPos.x = this.endPos.x;
				this.startPos.y = this.endPos.y;
				this.endPos = this.pointsArray.pop();

				this._bulletAngle = Math.atan2(this.endPos.x - this.startPos.x, this.endPos.y - this.startPos.y) + Math.PI/2;
				this.fireRotation = -this._bulletAngle - Math.PI/2;
				this._fFire_spr.rotation = this.fireRotation;

				this.emit(Bullet.EVENT_ON_SHOW_RICOCHET_EFFECT, {x: this.startPos.x, y: this.startPos.y});
				this.showDefaultTrajectory(callback);
			});
		}
	}

	onTick(e)
	{
		if (!this.endPos)
		{
			return;
		}

		let dist = Math.sqrt(Math.pow(this.x - this.endPos.x, 2) + Math.pow(this.y - this.endPos.y, 2));
		if (this.targetEnemy)
		{
			this.endPos = (this.targetEnemy && this.targetEnemy.transform) ? this.targetEnemy.getCenterPosition() : this.endPos;
			if (this.randomOffset) 
			{
				this.endPos.x += this.randomOffset.x;
				this.endPos.y += this.randomOffset.y;
			}
		}

		let step = e.delta * this.speed;
		if (dist < DISTANCE_EPS || step > dist)
		{
			this.off('tick', this.onTick, this);
			this.position.set(this.endPos.x, this.endPos.y);
			this._fCallback_func(this, this.endPos, this._bulletAngle);
			this.disappear();
			return;
		}

		this._bulletAngle = Math.atan2(this.endPos.x - this.x, this.endPos.y - this.y) + Math.PI/2;
		this.fireRotation = -this._bulletAngle - Math.PI/2;
		this._fFire_spr.rotation = this.fireRotation;

		let angle = this._bulletAngle - Math.PI;
		this.x = this.x + Math.cos(angle)*step;
		this.y = this.y - Math.sin(angle)*step;
	}

	addFire()
	{
		let lBullet1_spr;
		let lBullet2_spr;
		let lBullet3_spr;

		switch (this.typeId)
		{
			case WEAPONS.DEFAULT:
				switch (this.defaultWeaponBulletId)
				{
					case 1:
						this._fFire_spr = this.addChild(APP.library.getSprite('weapons/DefaultGun/turret_1/bullet'));
						break;
					case 2:
						this._fFire_spr = this.addChild(APP.library.getSprite('weapons/DefaultGun/turret_2/bullet'));
						break;
					case 3:
						this._fFire_spr = this.addChild(APP.library.getSprite('weapons/DefaultGun/turret_3/bullet'));
						break;
					case 4:
						this._fFire_spr = this.addChild(new Sprite);
						lBullet1_spr = this._fFire_spr.addChild(APP.library.getSprite('weapons/DefaultGun/turret_4/bullet'));
						lBullet2_spr = this._fFire_spr.addChild(APP.library.getSprite('weapons/DefaultGun/turret_4/bullet'));
						lBullet1_spr.position.x -= 10;
						lBullet2_spr.position.x += 10;
						break;
					case 5:
						this._fFire_spr = this.addChild(new Sprite);
						lBullet1_spr = this._fFire_spr.addChild(APP.library.getSprite('weapons/DefaultGun/turret_5/bullet'));
						lBullet2_spr = this._fFire_spr.addChild(APP.library.getSprite('weapons/DefaultGun/turret_5/bullet'));
						lBullet3_spr = this._fFire_spr.addChild(APP.library.getSprite('weapons/DefaultGun/turret_5/bullet'));
						lBullet1_spr.position.x -= 20;
						lBullet2_spr.position.y -= 35;
						lBullet3_spr.position.x += 20;
						break;
					default:
						this._fFire_spr = this.addChild(APP.library.getSprite('blend/bullet'));
						this._fFire_spr.blendMode = PIXI.BLEND_MODES.ADD;
						break;
				}
				break;
			default:
				this._fFire_spr = this.addChild(APP.library.getSprite('blend/bullet'));
				this._fFire_spr.blendMode = PIXI.BLEND_MODES.ADD;
				break;
		}
		this._fFire_spr.rotation = this.fireRotation;

		let scaleX = this._fFire_spr.scale.x * this._fWeaponScale;
		let scaleY = this._fFire_spr.scale.y * this._fWeaponScale;
		this._fFire_spr.scale.set(scaleX * PlayerSpot.WEAPON_SCALE, scaleY * PlayerSpot.WEAPON_SCALE);
	}

	disappear()
	{
		this.emit(Bullet.EVENT_ON_DISAPPEAR);
		this.scaleTo(0.1, 50, null, () => this._onDisappeared());
	}

	get disappeared()
	{
		return this._fDisappeared_bl;
	}

	get isCompleted()
	{
		return this.disappeared;
	}

	_onDisappeared()
	{
		this._fDisappeared_bl = true;

		this.destroy();
	}

	destroy()
	{
		this.off('tick', this.onTick, this);

		Sequence.destroy(Sequence.findByTarget(this));

		if (this._fFire_spr)
		{
			Sequence.destroy(Sequence.findByTarget(this._fFire_spr));
			this._fFire_spr = null;
		}

		if (this._fCircles_sprt_arr)
		{
			while (this._fCircles_sprt_arr.length)
			{
				this._fCircles_sprt_arr.pop().destroy();
			}
			this._fCircles_sprt_arr = null;
		}

		this.pointsArray = null;

		this.id = undefined;
		this.typeId = undefined;
		this.radius = undefined;
		this.startPos = null;
		this.endPos = null;
		
		this.targetEnemy && this.targetEnemy.off(Sprite.EVENT_ON_DESTROYING, this._onTargetEnemyDestroyed, this, true);
		this.targetEnemy = null;

		this.randomOffset = undefined;
		this._bulletAngle = undefined;
		this.preEndProps = null;
		this.pathCount = undefined;
		this.fireRotation = undefined;
		this.speed = undefined;

		this.trailTime = undefined;
		this._fDisappeared_bl = undefined;

		super.destroy();
	}

	tick(delta)
	{
		this.emit('tick', {delta: delta});
	}
}

export default Bullet;