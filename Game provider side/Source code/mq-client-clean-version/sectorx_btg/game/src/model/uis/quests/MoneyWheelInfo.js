import SimpleUIInfo from "../../../../../../common/PIXI/src/dgphoenix/unified/model/uis/SimpleUIInfo";

class MoneyWheelInfo extends SimpleUIInfo
{
	constructor()
	{
		super();

		this._fAwardedWin_num = null;
		this._fHitData_obj = null;
		this._fHitDatasArray_arr = [];
		this._fWinPayouts_arr = [];
	}

	clear()
	{
		this._fAwardedWin_num = null;
		this._fHitData_obj = null;

		while (this._fHitDatasArray_arr && this._fHitDatasArray_arr.length)
		{
			this._fHitDatasArray_arr.pop();
		}
		this._fHitDatasArray_arr = [];

		while (this._fWinPayouts_arr && this._fWinPayouts_arr.length)
		{
			this._fWinPayouts_arr.pop();
		}
		this._fWinPayouts_arr = [];
	}

	get payoutsArr()
	{
		return this._fWinPayouts_arr;
	}

	set payoutsArr(aVal_arr)
	{
		this._fWinPayouts_arr = aVal_arr;
	}

	get awardId()
	{
		return this._fHitData_obj ? this._fHitData_obj.awardId : null;
	}

	get awardedWin()
	{
		return this._fAwardedWin_num;
	}

	set awardedWin(aVal_num)
	{
		this._fAwardedWin_num = aVal_num;
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

	destroy()
	{
		super.destroy();

		this._fAwardedWin_num = null;

		while (this._fHitDatasArray_arr && this._fHitDatasArray_arr.length)
		{
			this._fHitDatasArray_arr.pop();
		}
		this._fHitDatasArray_arr = null;

		while (this._fWinPayouts_arr && this._fWinPayouts_arr.length)
		{
			this._fWinPayouts_arr.pop();
		}
		this._fWinPayouts_arr = null;
	}
}

export default MoneyWheelInfo