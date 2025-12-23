import SimpleUIInfo from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/uis/SimpleUIInfo';

class MinesInfo extends SimpleUIInfo {

	constructor()
	{
		super();

		this._fMinesInfo_mi_arr = [];
	}

	i_clear()
	{
		this._fMinesInfo_mi_arr = [];
	}

	i_addMine(aMineInfo_mi)
	{
		this._fMinesInfo_mi_arr.push(aMineInfo_mi);
	}

	i_getMineInfoById(aMineId_int)
	{
		for (let i=0; i<this._fMinesInfo_mi_arr.length; i++)
		{
			if (this._fMinesInfo_mi_arr[i].mineId === aMineId_int)
			{
				return this._fMinesInfo_mi_arr[i];
			}
		}
		return null;
	}

	clearAll()
	{
		this._fMinesInfo_mi_arr = [];
	}
}

export default MinesInfo;