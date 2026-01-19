import SimpleUIInfo from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/uis/SimpleUIInfo'

class BossModeHourglassInfo extends SimpleUIInfo
{
	constructor(aOptId_obj, aOptParentInfo_usi)
	{
		super(aOptId_obj, aOptParentInfo_usi);

		this._fName_str = null;
		this._fId_num = null;
		this._fFullTime_num = null;
		this._fStartPointTime_num = null;
	}

	get fullTime()
	{
		return this._fFullTime_num;
	}

	set fullTime(aVal_num)
	{
		this._fFullTime_num = aVal_num;
	}

	get startPointTime()
	{
		return this._fStartPointTime_num;
	}

	set startPointTime(aVal_num)
	{
		this._fStartPointTime_num = aVal_num;
	}

	get name()
	{
		return this._fName_str;
	}

	set name(aVal_str)
	{
		this._fName_str = aVal_str;
	}

	get id()
	{
		return this._fId_num;
	}

	set id(aVal_num)
	{
		this._fId_num = aVal_num;
	}

	destroy()
	{
		super.destroy();

		this._fName_str = null;
		this._fId_num = null;
		this._fFullTime_num = null;
		this._fStartPointTime_num = null;
	}
}

export default BossModeHourglassInfo