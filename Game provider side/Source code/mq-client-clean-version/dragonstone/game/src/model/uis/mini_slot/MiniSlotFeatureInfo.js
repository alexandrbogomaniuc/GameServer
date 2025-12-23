import SimpleUIInfo from '../../../../../../common/PIXI/src/dgphoenix/unified/model/uis/SimpleUIInfo';

class MiniSlotFeatureInfo extends SimpleUIInfo
{
	constructor()
	{
		super();

		this._fMiniSlotFeatures_arr = [];
		this._fSlotData_obj = null;
		this._fCurrentSpinNumber_int = 0;
		this._fHitData_obj = null;
		this._fHitDates_arr = [];
	}

	clear()
	{
		this._fMiniSlotFeatures_arr = [];
		this._fSlotData_obj = null;
		this._fHitData_obj = null;
		this._fCurrentSpinNumber_int = 0;
		this._fHitDates_arr = [];
	}

	get miniSlotFeatures()
	{
		return this._fMiniSlotFeatures_arr;
	}

	get hitDates()
	{
		return this._fHitDates_arr;
	}

	get currentSlotData()
	{
		return this._fSlotData_obj;
	}

	set currentSlotData(aVal_obj)
	{
		this._fSlotData_obj = aVal_obj;
	}

	resetCurrentSlotData()
	{
		this._fSlotData_obj = null;
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

	get currentSpinNumber()
	{
		return this._fCurrentSpinNumber_int;
	}

	set currentSpinNumber(aVal_int)
	{
		this._fCurrentSpinNumber_int = aVal_int;
	}

	resetCurrentSpinNumber()
	{
		this._fCurrentSpinNumber_int = 0;
	}

	get currentReelsPosition()
	{
		return this._fSlotData_obj[this._fCurrentSpinNumber_int].reels;
	}

	get currentSpinWin()
	{
		return this._fSlotData_obj[this._fCurrentSpinNumber_int].win;
	}

	get awardId()
	{
		return this._fHitData_obj ? this._fHitData_obj.awardId : null;
	}

	destroy()
	{
		super.destroy();

		this._fMiniSlotFeatures_arr = null;
		this._fSlotData_obj = null;
		this._fCurrentSpinNumber_int = null;
		this._fHitDates_arr = null;
		this._fHitData_obj = null;
	}
}

export default MiniSlotFeatureInfo