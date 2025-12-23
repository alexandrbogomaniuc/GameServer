import GUSGamePreloaderSoundButtonController from '../../../../../../../common/PIXI/src/dgphoenix/gunified/controller/uis/custom/preloader/GUSGamePreloaderSoundButtonController';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Game from '../../../../Game';

class GamePreloaderSoundButtonController extends GUSGamePreloaderSoundButtonController
{
	//INIT...
	__initControlLevel()
	{
		super.__initControlLevel();

		APP.on(Game.EVENT_ON_SOUND_SETTINGS_CHANGED, this._updateSoundButtonState, this);
	}

	__initViewLevel()
	{
		super.__initViewLevel();
	}
	//...INIT

	destroy()
	{
		APP.off(Game.EVENT_ON_SOUND_SETTINGS_CHANGED, this._updateSoundButtonState, this);
		
		super.destroy();
	}
}
export default GamePreloaderSoundButtonController