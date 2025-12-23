import CalloutController from '../CalloutController';
import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import I18 from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
import GameField from '../../../../../main/GameField';
import { ENEMIES } from '../../../../../../../shared/src/CommonConstants';

class DarkKnightCalloutController extends CalloutController
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
		return this.__getViewLevelSelfInitializationViewProvider().darkKnightCalloutView;
	}

	__initViewLevel ()
	{
		super.__initViewLevel();
	}

	__initControlLevel ()
	{
		super.__initControlLevel();

		APP.currentWindow.gameField.on(GameField.EVENT_DARK_KNIGHT_CALLOUT_CREATED, this._onRareEnemyCreated, this);

		// DEBUG...
		// window.addEventListener("keydown", this.keyDownHandler.bind(this), false);
		// ...DEBUG
	}

	//DEBUG...
	/*keyDownHandler(keyCode)
	{
		if (keyCode.keyCode == 81) //q
	 	{
	 		this.__activateCallout();
		}
	}*/
	// ...DEBUG

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
			view.setCaption("TARareEnemyCaption", "TADarkKnightCaption");
		}

		super.__validateViewLevel();
	}
	//...VALIDATION
}

export default DarkKnightCalloutController