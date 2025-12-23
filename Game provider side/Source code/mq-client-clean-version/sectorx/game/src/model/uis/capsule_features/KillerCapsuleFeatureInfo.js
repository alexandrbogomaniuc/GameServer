import SimpleUIInfo from '../../../../../../common/PIXI/src/dgphoenix/unified/model/uis/SimpleUIInfo';

class KillerCapsuleFeatureInfo extends SimpleUIInfo
{
	constructor()
	{
		super();

		this._fEnemies_obj_arr = null;
	}

	set affectedEnemiesInfo(aValue_any)
	{
		if (!aValue_any)
		{
			return
		}
		else if (aValue_any && !Array.isArray(aValue_any))
		{
			aValue_any = [aValue_any];
		}

		this._fEnemies_obj_arr = aValue_any.slice();
	}

	get affectedEnemiesInfo()
	{
		return this._fEnemies_obj_arr || [];
	}

	destroy()
	{
		this._fEnemies_obj_arr = null;
		super.destroy();
	}
}

export default KillerCapsuleFeatureInfo;