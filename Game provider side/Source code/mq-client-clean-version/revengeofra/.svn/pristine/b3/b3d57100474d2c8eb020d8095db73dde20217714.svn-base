import SimpleUIInfo from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/uis/SimpleUIInfo';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';


class MineInfo extends SimpleUIInfo {

	constructor()
	{
		super();

		this._fMineId_str = undefined;
		this.x = undefined;
		this.y = undefined;
		this._fRid_num = undefined;
		this._fSeatId_int = undefined;
		this._fIsAdded_bl = false; // whether the landmine already added visually on the screen or not
		this._fOrigPoint_pt = null; // the point where the user clicked originally
	}

	set mineId(aValue_str)
	{
		this._fMineId_str = aValue_str;
	}

	get mineId()
	{
		return this._fMineId_str;
	}

	set coords({x, y})
	{
		this.x = x;
		this.y = y;
	}

	get coords()
	{
		return {x: this.x, y: this.y};
	}

	set rid (aRid_num)
	{
		this._fRid_num = aRid_num;
	}

	get rid ()
	{
		return this._fRid_num;
	}

	set seatId(aSeatId_int)
	{
		this._fSeatId_int = aSeatId_int;
	}

	get seatId()
	{
		return this._fSeatId_int;
	}

	get isMaster()
	{
		return this.seatId === APP.playerController.info.seatId;
	}

	set isAdded(aValue_bl)
	{
		this._fIsAdded_bl = aValue_bl;
	}

	get isAdded()
	{
		return this._fIsAdded_bl;
	}

	set origPoint(aPoint_pt)
	{
		this._fOrigPoint_pt = aPoint_pt;
	}

	get origPoint()
	{
		return this._fOrigPoint_pt;
	}
}

export default MineInfo;