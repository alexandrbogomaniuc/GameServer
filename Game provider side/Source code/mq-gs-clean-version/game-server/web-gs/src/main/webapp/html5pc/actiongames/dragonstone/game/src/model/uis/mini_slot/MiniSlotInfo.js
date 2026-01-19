import SimpleUIInfo from '../../../../../../common/PIXI/src/dgphoenix/unified/model/uis/SimpleUIInfo';

const REELS_COUNT = 3;
const LINES_COUNT = 3;

class MiniSlotInfo extends SimpleUIInfo
{
	constructor(aReels_obj)
	{
		super();

		this._fDefaultReelsContent_obj = aReels_obj;
		this._fCurrentSpinReelsPositions_arr = null;
		this._fCurrentSpinNumber_int = 0;
	}

	clear()
	{
		this._fCurrentSpinReelsPositions_arr = null;
		this._fCurrentSpinNumber_int = 0;
	}

	get defaultReelsContent()
	{
		return this._fDefaultReelsContent_obj 
	}

	set defaultReelsContent(aValue_arr)
	{
		this._fDefaultReelsContent_obj = aValue_arr;
	}

	set currentSpinReelsPositions(aValue_arr)
	{
		this._fCurrentSpinReelsPositions_arr = aValue_arr;
	}

	get currentSpinReelsPositions()
	{
		return this._fCurrentSpinReelsPositions_arr
	}

	get currentSpinNumber()
	{
		return this._fCurrentSpinNumber_int;
	}

	set currentSpinNumber(aVal_int)
	{
		this._fCurrentSpinNumber_int = aVal_int;
	}

	getCurrentSpinFinishIconsContent()
	{
		const lResult_arr = [];

		for ( let i = 0; i < REELS_COUNT; i++)
		{
			let lFinishReelIconsByReelId = this._getSpinFinishIconByReelId(i);
			lResult_arr.push(lFinishReelIconsByReelId);
		}

		return lResult_arr;
	}

	_getSpinFinishIconByReelId(aReelId_int)
	{
		const lDefaultIconsInReelByReelId_arr = this.defaultReelsContent[aReelId_int + 1  /* lines from server start from 1 */];
		const lFinishReelPositionByReelId_int = this.currentSpinReelsPositions[aReelId_int];
		const lResult_arr = [];

		if (lFinishReelPositionByReelId_int - 1 < 0)
		{
			lResult_arr.push(lDefaultIconsInReelByReelId_arr[lDefaultIconsInReelByReelId_arr.length - 1])
		}
		else
		{
			lResult_arr.push(lDefaultIconsInReelByReelId_arr[lFinishReelPositionByReelId_int - 1]);
		}

		lResult_arr.push(lDefaultIconsInReelByReelId_arr[lFinishReelPositionByReelId_int]);

		if(lFinishReelPositionByReelId_int + 1 >= lDefaultIconsInReelByReelId_arr.length)
		{
			lResult_arr.push(lDefaultIconsInReelByReelId_arr[0]);
		}
		else
		{
			lResult_arr.push(lDefaultIconsInReelByReelId_arr[lFinishReelPositionByReelId_int + 1]);
		}

		return lResult_arr;
	}

	destroy()
	{
		super.destroy();

		this._fCurrentSpinNumber_int = null;
		this._fDefaultReelsContent_obj = null;
		this._fCurrentSpinReelsPositions_arr = null;
	}
}

export default MiniSlotInfo