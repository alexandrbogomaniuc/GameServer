import GUSLobbySoundsBackgoundLoadingController from '../../../../../common/PIXI/src/dgphoenix/gunified/controller/sounds/GUSLobbySoundsBackgoundLoadingController';

import ASSETS from '../../config/assets.json';
import PRELOADER_ASSETS from '../../config/preloader_assets.json';

class SoundsBackgoundLoadingController extends GUSLobbySoundsBackgoundLoadingController
{
	constructor()
	{
		super();
	}

	get __preloaderSoundsAssets()
	{
		return PRELOADER_ASSETS.sounds;
	}

	get __lobbySoundsAssets()
	{
		return ASSETS.sounds;
	}
}

export default SoundsBackgoundLoadingController;