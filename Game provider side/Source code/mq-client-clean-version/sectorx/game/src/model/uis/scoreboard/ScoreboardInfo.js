import SimpleUIInfo from "../../../../../../common/PIXI/src/dgphoenix/unified/model/uis/SimpleUIInfo";

class ScoreboardInfo extends SimpleUIInfo
{
	constructor(aOptId_obj, aOptParentInfo_usi)
	{
		super(aOptId_obj, aOptParentInfo_usi);

		this._fScoresData_obj = null;
		this._fBossRoundScoresData_obj = null;
		this._fRoundTimeIsOver_bl = null;
		this._fRoundEndTime_num = null;
		this._fIsUpdateLockedOnBattlegroundRoundResultExpected_bl = null;
	}

	get isUpdateLockedOnBattlegroundRoundResultExpected()
	{
		return this._fIsUpdateLockedOnBattlegroundRoundResultExpected_bl;
	}

	set isUpdateLockedOnBattlegroundRoundResultExpected(aValue_bl)
	{
		this._fIsUpdateLockedOnBattlegroundRoundResultExpected_bl = aValue_bl;
	}

	get roundEndTime()
	{
		return this._fRoundEndTime_num;
	}

	set roundEndTime(aValue_bl)
	{
		this._fRoundEndTime_num = aValue_bl;
	}

	get isRoundTimeIsOver()
	{
		return this._fRoundTimeIsOver_bl;
	}

	set isRoundTimeIsOver(aValue_bl)
	{
		this._fRoundTimeIsOver_bl = aValue_bl;
	}

	get currentScores()
	{
		return this._fScoresData_obj;
	}

	get currentBossRoundScores()
	{
		return this._fBossRoundScoresData_obj;
	}

	get seatsData()
	{
		return this._fSeats_obj_arr;
	}

	i_updateSeatsData(aData_obj_arr)
	{
		let lBuffer_arr = [];

		for (let i = 0; i < aData_obj_arr.length; i++)
		{
			lBuffer_arr[i] = Object.assign({}, aData_obj_arr[i]);
		}

		this._fSeats_obj_arr = lBuffer_arr;
	}

	i_updateScoresData(aScores_obj, aBossScores_obj)
	{
		this._fScoresData_obj = aScores_obj;
		this._fBossRoundScoresData_obj = aBossScores_obj;
	}

	destroy()
	{
		this._fScoresData_obj = null;
		this._fBossRoundScoresData_obj = null;
		this._fSeats_obj_arr = null;

		this._fRoundTimeIsOver_bl = null;
		this._fRoundEndTime_num = null;
		this._fIsUpdateLockedOnBattlegroundRoundResultExpected_bl = null;

		super.destroy();
	}
}

export default ScoreboardInfo;