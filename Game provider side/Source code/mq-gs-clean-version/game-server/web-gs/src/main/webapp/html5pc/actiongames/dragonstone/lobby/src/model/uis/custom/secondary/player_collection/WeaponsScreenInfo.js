import PlayerCustomCollectionScreenInfo from './PlayerCustomCollectionScreenInfo';
import PlayerCollectionScreenInfo from './PlayerCollectionScreenInfo';

class WeaponsScreenInfo extends PlayerCustomCollectionScreenInfo
{
	constructor()
	{
		super(PlayerCollectionScreenInfo.SCREENS.WEAPONS);
	}

	destroy()
	{
		super.destroy();
	}
}

export default WeaponsScreenInfo