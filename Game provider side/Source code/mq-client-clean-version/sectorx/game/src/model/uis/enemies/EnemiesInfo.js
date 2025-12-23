import SimpleUIInfo from '../../../../../../common/PIXI/src/dgphoenix/unified/model/uis/SimpleUIInfo';

class EnemiesInfo extends SimpleUIInfo
{
	constructor()
	{
		super();

		this._fRegisteredEnemies_arr = [];
	}

	get registeredEnemies()
	{
		return this._fRegisteredEnemies_arr;
	}

	set registeredEnemies(aValue_arr)
	{
		this._fRegisteredEnemies_arr = aValue_arr;
	}

	destroy()
	{
		super.destroy();

		this._fRegisteredEnemies_arr = null;
	}
}

export default EnemiesInfo;