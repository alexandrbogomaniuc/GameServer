import GUSLobbyDialogsController from '../../../../../../../common/PIXI/src/dgphoenix/gunified/controller/uis/custom/dialogs/GUSLobbyDialogsController';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import DialogsInfo from '../../../../model/uis/custom/dialogs/DialogsInfo';
import DialogsView from '../../../../view/uis/custom/dialogs/DialogsView';
import LobbySoundButtonController from '../secondary/LobbySoundButtonController';

class DialogsController extends GUSLobbyDialogsController
{
	constructor(aOptDialogsInfo)
	{
		super(aOptDialogsInfo || new DialogsInfo());

		this._initDialogsController();
	}

	__provideDialogsViewInstance()
	{
		return new DialogsView();
	}

	_updateSoundButtonPosition(aSoundButtonView_sbv)
	{
		aSoundButtonView_sbv.position.set(-454.5, -247.5);

		if (APP.isMobile)
		{
			aSoundButtonView_sbv.scale.set(1.8);
			aSoundButtonView_sbv.position.y += 14.5;
			aSoundButtonView_sbv.position.x += 5;
		}
	}

	_provideSoundButtonControllerInstance()
	{
		return new LobbySoundButtonController();
	}

	destroy()
	{
		super.destroy();
	}
}

export default DialogsController