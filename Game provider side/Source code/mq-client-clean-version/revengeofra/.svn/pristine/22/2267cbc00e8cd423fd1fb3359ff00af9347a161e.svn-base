import SimpleUIInfo from '../../../../../../common/PIXI/src/dgphoenix/unified/model/uis/SimpleUIInfo'

class RoundResultScreenInfo extends SimpleUIInfo
{
	constructor()
	{
		super();

		this._fPlayerNickname_str = null;

		this._fTotalDamage_num = null;

		this._fTotalKillsCount_num = null;

		this._fTotalTreasuresCount_num = null;
		
		this._fPlayerAvatarData_obj = null;

		this._fListData_arr = null;

		this._fRoundId_num = undefined;
		this._fRoundResultResponseRecieved_bln = null;

		this._pendingFinalPlayerStats = null;

		this._fQuestsCompletedCount_num = null;
		this._fQuestsPayouts_num = null;

		this._fWeaponsSurplus_num = 0;
	}

	get roundId()
	{
		return this._fRoundId_num;
	}

	set roundId(aVal_num)
	{
		this._fRoundId_num = aVal_num;
	}

	resetRoundId()
	{
		this._fRoundId_num = undefined;
	}

	get roundResultResponseRecieved()
	{
		return this._fRoundResultResponseRecieved_bln;
	}

	set roundResultResponseRecieved(aVal_bln)
	{
		this._fRoundResultResponseRecieved_bln = aVal_bln;
	}

	get playerNickname()
	{
		return this._fPlayerNickname_str;
	}

	set playerNickname(aValue_str)
	{
		this._fPlayerNickname_str = aValue_str;
	}

	get pendingFinalPlayerStats()
	{
		return this._pendingFinalPlayerStats;
	}

	set pendingFinalPlayerStats(aVal_obj)
	{
		this._pendingFinalPlayerStats = aVal_obj;
	}

	get totalDamage()
	{
		return this._fTotalDamage_num;
	}

	set totalDamage(aVal_num)
	{
		this._fTotalDamage_num = aVal_num;
	}

	get totalKillsCount()
	{
		return this._fTotalKillsCount_num;
	}

	set totalKillsCount(aVal_num)
	{
		this._fTotalKillsCount_num = aVal_num;
	}

	get totalTreasuresCount()
	{
		return this._fTotalTreasuresCount_num;
	}

	set totalTreasuresCount(aVal_num)
	{
		this._fTotalTreasuresCount_num = aVal_num;
	}

	get playerAvatarData()
	{
		return this._fPlayerAvatarData_obj;
	}

	set playerAvatarData(aVal_obj)
	{
		this._fPlayerAvatarData_obj = aVal_obj;
	}

	get listData()
	{
		return this._fListData_arr;
	}

	set listData(aVal_arr)
	{
		this._fListData_arr = aVal_arr;
	}

	get questsCompletedCount()
	{
		return this._fQuestsCompletedCount_num;
	}

	set questsCompletedCount(aVal_num)
	{
		this._fQuestsCompletedCount_num = aVal_num;
	}

	get questsPayouts()
	{
		return this._fQuestsPayouts_num;
	}

	set questsPayouts(aVal_num)
	{
		this._fQuestsPayouts_num = aVal_num;
	}

	get weaponsSurplus()
	{
		return this._fWeaponsSurplus_num;
	}

	set weaponsSurplus(aVal_num)
	{
		aVal_num = Number(aVal_num || 0);
		this._fWeaponsSurplus_num = aVal_num;
	}

	destroy()
	{
		this._fPlayerNickname_str = null;

		this._fTotalDamage_num = null;

		this._fTotalKillsCount_num = null;

		this._fTotalTreasuresCount_num = null;
		
		this._fListData_arr = null;

		this._pendingFinalPlayerStats = null;

		this._fQuestsCompletedCount_num = null;
		this._fQuestsPayouts_num = null;

		this._fWeaponsSurplus_num = null;

		super.destroy();
	}
}

export default RoundResultScreenInfo