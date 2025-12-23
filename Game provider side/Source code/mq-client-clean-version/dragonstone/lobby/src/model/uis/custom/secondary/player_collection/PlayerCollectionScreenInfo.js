import SimpleUIInfo from '../../../../../../../../common/PIXI/src/dgphoenix/unified/model/uis/SimpleUIInfo';

class PlayerCollectionScreenInfo extends SimpleUIInfo
{
	static get SCREENS()	
	{
		return {
			QUESTS: 0,
			WEAPONS:1
		};
	}

	constructor()
	{
		super();
	}

	destroy()
	{
		super.destroy();
	}

}

export default PlayerCollectionScreenInfo