import BossEnemy from './BossEnemy';
import { FRAME_RATE } from '../../../../shared/src/CommonConstants';
import * as easing from '../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';

class EarthBossEnemy extends BossEnemy
{
	constructor(params)
	{
		super(params);
		this._fAppearStamp_obj = null;
	}

	//override
	get turnPostfix()
	{
		return this.isHealthStateWeak ? "_weak_turn" : "_turn";
	}

	moveSpineOnDeathMiniExplosion(aPosition_obj)
	{
		this._moveSpineOnDeathMiniExplosion(aPosition_obj);
	}

	//override
	getSpineSpeed()
	{
		let lBaseSpeed_num = this.isHealthStateWeak ? 0.25 : 0.20;
		return this.speed * this.getScaleCoefficient() * lBaseSpeed_num;
	}

	_calculateSpineTurnName(aAnimName_str, aSpineName_str)
	{
		return aSpineName_str;
	}

	//override
	getScaleCoefficient()
	{
		return 0.7;
	}

	//override
	getLocalCenterOffset()
	{
		let pos = new PIXI.Point();
		pos.x = 0;
		pos.y = -94;

		let scale = this.getScaleCoefficient();
		pos.x *= scale;
		pos.y *= scale;
		return pos;
	}

	//override
	_getHitRectHeight()
	{
		return 500 * this.getScaleCoefficient();
	}

	//override
	_getHitRectWidth()
	{
		return 80 * this.getScaleCoefficient();
	}

	_moveSpineOnDeathMiniExplosion(aPosition_obj)
	{
		if (!this.spineView)
		{
			return;
		}

		this.spineView.moveTo(-aPosition_obj.x/10, -aPosition_obj.y/10, 8*FRAME_RATE, easing.exponential.easeOut);
	}

	_setSpawnState()
	{
		this._fAppearStamp_obj = {function: this.__onBossBecomeVisible.bind(this), timeStamps: [1], percentDelta: 0.018, animationName: 'spawn'}
		this.spineView && this.spineView.addCallFunctionAtStamps(this._fAppearStamp_obj);

		super._setSpawnState();
	}

	__onBossBecomeVisible()
	{
		this.spineView && this.spineView.removeCallsAtStamps(this._fAppearStamp_obj);
		super.__onBossBecomeVisible();
	}

	get __maxCrosshairDeviationOnEnemyX() //maximum deviation in X position of the cursor on the body of the enemy
	{
		return 52;
	}

	get __maxCrosshairDeviationOnEnemyY() //maximum deviation in Y position of the cursor on the body of the enemy
	{
		return 84;
	}

	get __maxCrosshairDeviationTwoOnEnemyX()
	{
		return 100;
	}

	get __maxCrosshairDeviationTwoOnEnemyY()
	{
		return 60;
	}

	destroy(purely = false)
	{
		this.spineView && this._fAppearStamp_obj && this.spineView.removeCallsAtStamps(this._fAppearStamp_obj);
		this._fAppearStamp_obj = null;

		super.destroy(purely)
	}
}

export default EarthBossEnemy;