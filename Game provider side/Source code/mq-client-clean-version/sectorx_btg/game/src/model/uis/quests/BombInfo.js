import SimpleUIInfo from "../../../../../../common/PIXI/src/dgphoenix/unified/model/uis/SimpleUIInfo";

class BomblInfo extends SimpleUIInfo
{
	constructor()
	{
		super();
		
		this._fMultiplayerWin_num = null;
		this._fHitData_obj = null;
		this._fHitDatasArray_arr = [];
		this._fEndPosArray_arr = [];
		this._fQueueHitDataArray = [];
	}

	clear()
	{
		this._fMultiplayerWin_num = null;
		this._fHitData_obj = null;
		this._fHitDatasArray_arr = [];
		this._fEndPosArray_arr = [];
		this._fQueueHitDataArray = [];
	}

	get queueHitDataArray()
	{
		return this._fQueueHitDataArray;
	}

	get awardId()
	{
		return this._fHitData_obj ? this._fHitData_obj.awardId : null;
	}

	get multiplayerWin()
	{
		return this._fMultiplayerWin_num;
	}

	set multiplayerWin(aVal_num)
	{
		this._fMultiplayerWin_num = aVal_num;
	}

	get currentHitData()
	{
		return this._fHitData_obj;
	}

	set currentHitData(aVal_obj)
	{
		this._fHitData_obj = aVal_obj;
	}

	resetCurrentHitData()
	{
		this._fHitData_obj = null;
	}

	set hitDataArray(aVal_arr)
	{
		this._fHitDatasArray_arr = aVal_arr;
	}

	get hitDataArray()
	{
		return this._fHitDatasArray_arr;
	}

	set endPosArray(aVal_arr)
	{
		this._fEndPosArray_arr = aVal_arr;
	}

	get endPosArray()
	{
		return this._fEndPosArray_arr;
	}

	
	destroy()
	{
		super.destroy();

		this._fAwardedWin_num = null;
	}
}

export default BomblInfo