import GUExternalAPI from '../../../../common/PIXI/src/dgphoenix/gunified/controller/main/GUExternalAPI';
import { APP } from '../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import BattlegroundLoaderUI from './BattlegroundLoaderUI';
import LoaderUI from './GameLoaderUI';


/** @ignore */
class GameAPI extends GUExternalAPI
{
	constructor(config)
	{
		super(config);
	}

	get LoaderUI()
	{
		return APP.isBattlegroundGame ? BattlegroundLoaderUI : LoaderUI;
	}

}

export default GameAPI;