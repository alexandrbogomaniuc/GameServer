import SimpleUIInfo from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/uis/SimpleUIInfo';

class MoneyWheelInfo extends SimpleUIInfo
{
	constructor()
	{
		super();

		this._fAwardId_num = null;
		this._fAwardedWin_num = null;
		this._fHitData_obj = null;
		this._fHitDatasArray_arr = [];
	}

	clear()
	{
		this._fAwardId_num = null;
		this._fAwardedWin_num = null;
		this._fHitData_obj = null;
		this._fHitDatasArray_arr = [];
	}

	get awardedWin()
	{
		return this._fAwardedWin_num;
	}

	set awardedWin(aVal_num)
	{
		this._fAwardedWin_num = aVal_num;
	}

	get awardId()
	{
		return this._fHitData_obj ? this._fHitData_obj.awardId : null;
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

		this._fAwardId_num = null;
		this._fAwardedWin_num = null;
		this._fHitData_obj = null;
		this._fHitDatasArray_arr = null;
	}
}

export default MoneyWheelInfo