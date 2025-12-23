import BossEnemy from './BossEnemy';
import { STATE_SPAWN } from './Enemy';
import { Sequence } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';

class IceBoss extends BossEnemy 
{
	constructor(params)
	{
		super(params);
		this._fAppearStamp_obj = null;
		this._fDeathFxTimer_t = null;
	}

	getSpineSpeed()
	{
		return this.speed * 0.2;
	}

	setSpineViewPos()
	{
		let pos = {x: 0, y: 0};
		this.spineViewPos = pos;
	}

	getScaleCoefficient()
	{
		return 0.5;
	}
	
	_getHitRectHeight()
	{
		return 120;
	}
	
	_getHitRectWidth()
	{
		return 260;
	}

	_setSpawnState()
	{
		this._fAppearStamp_obj = {function: this.__onBossBecomeVisible.bind(this), timeStamps: [1], percentDelta: 0.018, animationName: 'spawn'}
		this.spineView.addCallFunctionAtStamps(this._fAppearStamp_obj);

		super._setSpawnState();
	}

	__onBossBecomeVisible()
	{
		this.spineView && this.spineView.removeCallsAtStamps(this._fAppearStamp_obj);
		super.__onBossBecomeVisible();
	}

	_playBossDeathFxAnimation()
	{
		if (this.currentAnimationName == STATE_SPAWN)
		{
			this.__onBossBecomeVisible();
			this.emit(BossEnemy.EVENT_ON_BOSS_APPEARED);
		}

		super._playBossDeathFxAnimation();
	}
	//...death

	getLocalCenterOffset()
	{
		let pos = {x: 0, y: -50};
		return pos;
	}

	get __maxCrosshairDeviationOnEnemyX() //maximum deviation in X position of the cursor on the body of the enemy
	{
		return 36;
	}

	get __maxCrosshairDeviationOnEnemyY() //maximum deviation in Y position of the cursor on the body of the enemy
	{
		return 65;
	}

	get __maxCrosshairDeviationTwoOnEnemyX()
	{
		return 82;
	}

	get __maxCrosshairDeviationTwoOnEnemyY()
	{
		return 54;
	}

	destroy(purely = false)
	{
		this.spineView && this._fAppearStamp_obj && this.spineView.removeCallsAtStamps(this._fAppearStamp_obj);
		this._fAppearStamp_obj = null;

		this._fDeathFxTimer_t && this._fDeathFxTimer_t.destructor();
		this._fDeathFxTimer_t = null;

		if (this.spineView && this.spineView.filters && Array.isArray(this.spineView.filters))
		{
			for (let l_f of this.spineView.filters)
			{
				Sequence.destroy(Sequence.findByTarget(l_f));
			}
		}

		super.destroy(purely);
	}
}

export default IceBoss;