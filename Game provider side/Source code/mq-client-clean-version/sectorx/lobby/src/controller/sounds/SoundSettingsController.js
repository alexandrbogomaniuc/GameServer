import GUSLobbySoundSettingsController from '../../../../../common/PIXI/src/dgphoenix/gunified/controller/sounds/GUSLobbySoundSettingsController';
import SoundSettingsInfo from '../../model/sounds/SoundSettingsInfo';

class SoundSettingsController extends GUSLobbySoundSettingsController
{
	//IL CONSTRUCTION...
	constructor(aOptInfo_ussi)
	{
		super(aOptInfo_ussi ? aOptInfo_ussi : new SoundSettingsInfo());
	}
	//...IL CONSTRUCTION
}

export default SoundSettingsController;