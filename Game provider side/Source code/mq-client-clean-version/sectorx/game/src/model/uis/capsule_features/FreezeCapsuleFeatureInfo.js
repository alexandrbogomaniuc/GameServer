import SimpleUIInfo from '../../../../../../common/PIXI/src/dgphoenix/unified/model/uis/SimpleUIInfo';

class FreezeCapsuleFeatureInfo extends SimpleUIInfo
{
	static get i_SERVER_FULL_FREEZE_TIME_CONST()				{ return 10000; }
	static get i_INTRO_ANIMATION_DURATION()						{ return 1250; } // error on the intro animation when enemies can go further along the trajectory

	constructor()
	{
		super();

		this._fAffectedEnemies_obj = null;
		this._fFreezeTime_num = null;
		this._fActivatedTime_num = null;
		this._fIsActive_bl = null;
		this._fIsQuestForMainPlayer_bl = false;
	}

	get correctionTime()
	{
		return FreezeCapsuleFeatureInfo.i_INTRO_ANIMATION_DURATION;
	}

	get active()
	{
		return this._fIsActive_bl;
	}

	get isQuestForMainPlayer()
	{
		return this._fIsQuestForMainPlayer_bl;
	}
	
	set isQuestForMainPlayer(aValue_bl)
	{
		this._fIsQuestForMainPlayer_bl = aValue_bl;
	}

	i_resetTimes()
	{
		this.freezeTime = 0;
		this.activatedTime = 0;
		this._fIsActive_bl = false;
		this._fIsQuestForMainPlayer_bl = false;
	}

	get fullFreezeTime()
	{
		return FreezeCapsuleFeatureInfo.i_SERVER_FULL_FREEZE_TIME_CONST
	}

	set freezeTime(aValue_num)
	{
		if (!aValue_num || aValue_num < 0)
		{
			this._fFreezeTime_num = undefined;
		}
		else
		{
			this._fFreezeTime_num = aValue_num;

			if (!this.active && this._fFreezeTime_num < this.fullFreezeTime && this.activatedTime)
			{
				this._fIsActive_bl = true;
			}
		}
	}

	get freezeTime()
	{
		return this._fFreezeTime_num;
	}

	set activatedTime(aValue_num)
	{
		if (!aValue_num || aValue_num < 0)
		{
			this._fActivatedTime_num = undefined;
		}
		else
		{
			this._fActivatedTime_num = aValue_num;
		}
	}

	get activatedTime()
	{
		return this._fActivatedTime_num;
	}
	
	set affectedEnemies(aTrajectories_obj)
	{
		if (!aTrajectories_obj)
		{
			this._fAffectedEnemies_obj = null;
		}
		else
		{
			this._fAffectedEnemies_obj = aTrajectories_obj;
		}
	}

	get affectedEnemies()
	{
		return this._fAffectedEnemies_obj || {};
	}

	destroy()
	{
		this._fAffectedEnemies_obj = null;
		this._fFreezeTime_num = null;
		this._fIsActive_bl = null;
		this._fActivatedTime_num = null;
		this._fIsQuestForMainPlayer_bl = null;
		super.destroy();
	}
}

export default FreezeCapsuleFeatureInfo;