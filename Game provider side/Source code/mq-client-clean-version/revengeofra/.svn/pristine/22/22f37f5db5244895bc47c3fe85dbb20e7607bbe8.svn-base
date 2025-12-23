import { APP } from '../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { Utils } from '../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import Sequence from '../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import Timer from "../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer";
import EventDispatcher from '../../../../common/PIXI/src/dgphoenix/unified/controller/events/EventDispatcher';
import GameScreen from './GameScreen';
import GameField from './GameField';
import BombEnemy from './enemies/BombEnemy';
import { HIT_RESULT_SINGLE_CASH_ID, HIT_RESULT_SPECIAL_WEAPON_ID } from '../controller/uis/prizes/PrizesController';

class MassDeathManager extends EventDispatcher
{
	static get EVENT_ON_TIME_TO_SHOW_DEATH() 			{ return 'EVENT_ON_TIME_TO_SHOW_DEATH' }
	static get EVENT_ON_EXPLOSION_HIT_AWARD_EXPECTED() 	{ return 'EVENT_ON_EXPLOSION_HIT_AWARD_EXPECTED' }

	i_init()
	{
 		this._gameScreen = APP.currentWindow;

 		this._gameScreen.on(GameScreen.EVENT_ON_BOMB_ENEMY_KILLED, this._onBombEnemyKilled, this);
		this._gameScreen.on(GameScreen.EVENT_ON_BULLET_TARGET_TIME, this._onBulletTargetTime, this);

 		this._pendingExplosions = {};
	}

	_onBombEnemyKilled(data)
	{
		let zombie = this._gameScreen.gameField.getExistEnemy(data.enemyId);
		
		if (zombie)
		{
			zombie.on(BombEnemy.EVENT_ON_BOMB_ENEMY_EXPLOSION, this._onBombEnemyExplosion, this);
			zombie.on(BombEnemy.EVENT_ON_BOMB_ENEMY_DESTROYED, this._onBombEnemyDestroyed, this);

			this._pendingExplosions[data.enemyId] = Utils.clone(data);
		}
	}

	_onBombEnemyExplosion(event)
	{
		 this._onTimeToShowAwards(event);
	}

	_onBulletTargetTime(event)
	{
		if (!event.data.enemy || event.data.enemy.typeId !== 13) return;

		let affectedEnemies = event.data.affectedEnemies;

		for (var i = 0; i < affectedEnemies.length; i++)
		{
			let id = affectedEnemies[i].enemyId;
			if (this._pendingExplosions[id])
			{
				if (this._gameScreen.checkExistEnemy(id)) return;

				event.data.id = id;
				this._onTimeToShowAwards(event.data);
			}
		}
	}

	_onTimeToShowAwards(event)
	{
		if (!this._pendingExplosions[event.id])
		{
			return;
		}

		let explodeData = this._pendingExplosions[event.id];
		let explodePosition = {x: explodeData.x, y: explodeData.y};
		let enemiesInstantKilled = explodeData.enemiesInstantKilled;
		
		for (let key in enemiesInstantKilled)
		{
			let prizeId = enemiesInstantKilled[key][0].id;
			let hitResultBySeats = {};

			explodeData.awardedWeaponId = -1;
			explodeData.awardedWeaponShots = 0;
			explodeData.awardedWin = 0;
			explodeData.ignorePending = false;

			if (prizeId === HIT_RESULT_SINGLE_CASH_ID)
			{
				let payout = enemiesInstantKilled[key][0].value;
				explodeData.awardedWin = Number(payout);

				hitResultBySeats[explodeData.seatId] = [{
					id: HIT_RESULT_SINGLE_CASH_ID,
					value: payout
				}];
			}
			else if (prizeId === HIT_RESULT_SPECIAL_WEAPON_ID)
			{
				let awardedWeapon = enemiesInstantKilled[key][0].value.split('|');
				let weaponId = awardedWeapon[0];
				let weaponShots = awardedWeapon[1];

				hitResultBySeats[explodeData.seatId] = [{
					id: HIT_RESULT_SPECIAL_WEAPON_ID,
					value: Number(weaponId)
				}];

				if (APP.playerController.info.seatId === explodeData.seatId)
				{
					explodeData.awardedWeaponId = Number(weaponId);
					explodeData.awardedWeaponShots = Number(weaponShots);
				}
				else
				{
					explodeData.ignorePending = true;
				}
			}
			else
			{
				return;
			}

			explodeData.hitResultBySeats = hitResultBySeats;
			explodeData.enemy.id = explodeData.enemyId = key;
			explodeData.enemy.typeId = -1;
			explodeData.skipAwardedWin = false;
			explodeData.awardedWeapons = [];

			let clonedExplodeData = Utils.clone(explodeData);
			clonedExplodeData.killedByBomb = true;
			clonedExplodeData.enemiesInstantKilled = {};

			this.emit(MassDeathManager.EVENT_ON_EXPLOSION_HIT_AWARD_EXPECTED, {explodeHitData: clonedExplodeData});

			this._startDeathTimer(explodePosition, clonedExplodeData);
		}

		delete this._pendingExplosions[event.id];
	}

	_startDeathTimer(explodePosition, data)
	{
		let enemyPosition = this._gameScreen.gameField.getEnemyPosition(data.enemyId);
		let interval = (enemyPosition ? Utils.getDistance(explodePosition, enemyPosition) * 0.75 : 0) + 50;
		let eventData = {e: null, endPos: undefined, angle: 0, data: data};

		let timer = new Timer(() => {
			this.emit(MassDeathManager.EVENT_ON_TIME_TO_SHOW_DEATH, eventData);
			timer.destructor();
		}, interval);
	}
}

export default MassDeathManager;