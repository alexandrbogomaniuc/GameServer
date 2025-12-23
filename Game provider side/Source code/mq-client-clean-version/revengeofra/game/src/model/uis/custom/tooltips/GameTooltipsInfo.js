import SimpleUIInfo from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/uis/SimpleUIInfo'

class GameTooltipsInfo extends SimpleUIInfo
{
	constructor()
	{
		super();

		this._fGameTipsEnabled_bln = null;
	}

	get tooltipsEnabled()
	{
		return this._fGameTipsEnabled_bln;
	}

	set gameTipsEnabled(aVal_bln)
	{
		this._fGameTipsEnabled_bln = aVal_bln;
	}

	get gameTipsEnabled()
	{
		return this._fGameTipsEnabled_bln;
	}

	destroy()
	{
		super.destroy();

		this._fGameTipsEnabled_bln = null;
	}
}

export default GameTooltipsInfo