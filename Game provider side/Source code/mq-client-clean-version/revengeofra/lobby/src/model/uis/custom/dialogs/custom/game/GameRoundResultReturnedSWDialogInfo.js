import GameBaseDialogInfo from './GameBaseDialogInfo';

class GameRoundResultReturnedSWDialogInfo extends GameBaseDialogInfo
{
	constructor(dialogId, priority)
	{
		super(dialogId, priority);

		this._fTotalReturnedSpecialWeapons_num = 0;
	}

	get totalReturnedSpecialWeapons()
	{
		return this._fTotalReturnedSpecialWeapons_num;
	}

	set totalReturnedSpecialWeapons(aValue_num)
	{
		this._fTotalReturnedSpecialWeapons_num = aValue_num;
	}
}

export default GameRoundResultReturnedSWDialogInfo