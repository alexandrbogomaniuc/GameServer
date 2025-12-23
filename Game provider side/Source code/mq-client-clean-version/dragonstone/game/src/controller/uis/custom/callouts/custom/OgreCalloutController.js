import CalloutController from '../CalloutController';
import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import I18 from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
import GameField from '../../../../../main/GameField';
import { ENEMIES } from '../../../../../../../shared/src/CommonConstants';

class OgreCalloutController extends CalloutController
{
	constructor(aOptInfo_usuii, parentController)
	{
		super(aOptInfo_usuii, undefined, parentController);
	}

	__init ()
	{
		super.__init();
	}

		__getExternalViewForSelfInitialization()
	{
		return this.__getViewLevelSelfInitializationViewProvider().ogreCalloutView;
	}

	__initViewLevel ()
	{
		super.__initViewLevel();
	}

	__initControlLevel ()
	{
		super.__initControlLevel();
		APP.currentWindow.gameField.on(GameField.EVENT_OGRE_CALLOUT_CREATED, this._onRareEnemyCreated, this);
	}

	 _onRareEnemyCreated ()
	 {
		this.__activateCallout();
	 }

	 _startCallout()
	{
		let l_ltv = this.view;

		if (l_ltv)
		{
			l_ltv.startCallout();
		}
	}

	//VALIDATION...
	__validateModelLevel ()
	{
		super.__validateModelLevel();
	}

	__validateViewLevel ()
	{
		let info = this.info;
		if (info.isActive)
		{
			let view = this.__fView_uo;
			view.setCaption("TARareEnemyCaption", "TAOgreCaption");
		}

		super.__validateViewLevel();
	}
	//...VALIDATION
}

export default OgreCalloutController