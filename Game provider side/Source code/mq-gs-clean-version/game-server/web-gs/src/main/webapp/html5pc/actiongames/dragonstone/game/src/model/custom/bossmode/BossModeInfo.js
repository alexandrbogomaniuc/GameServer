import SimpleUIInfo from '../../../../../../common/PIXI/src/dgphoenix/unified/model/uis/SimpleUIInfo'

class BossModeInfo extends SimpleUIInfo
{
	constructor()
	{
		super();

		this._fBossNumberShots_int = 0;
	}

	get bossNumberShots()
	{
		return this._fBossNumberShots_int;
	}

	set bossNumberShots(aValue_num)
	{
		this._fBossNumberShots_int = aValue_num;
	}

	destroy()
	{
		super.destroy();

		this._fBossNumberShots_int = null;
	}
}

export default BossModeInfo