import CalloutController from '../CalloutController';
import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import I18 from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
import GameField from '../../../../../main/GameField';
import GameScreen from '../../../../../main/GameScreen';
import { ENEMIES } from '../../../../../../../shared/src/CommonConstants';
import BossModeHourglassController from '../../bossmode/BossModeHourglassController';

class TimesRunningOutController extends CalloutController
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
		return this.__getViewLevelSelfInitializationViewProvider().timesRunningOutView;
	}

	__initViewLevel ()
	{
		super.__initViewLevel();
	}

	__initControlLevel ()
	{
		super.__initControlLevel();
		APP.currentWindow.gameField.on(GameField.EVENT_ON_NEW_BOSS_CREATED, this._onNewBossCreated, this);
		APP.gameScreen.on(GameScreen.EVENT_ON_BOSS_DESTROYING, this._onBossDestroying, this);
		APP.gameScreen.on(GameScreen.EVENT_ON_DRAGON_DISAPPEARED, this._onBossDisappeared, this);

		// DEBUG...
		// window.addEventListener("keydown", this.keyDownHandler.bind(this), false);
		// ...DEBUG
	}

	//DEBUG...
	/*keyDownHandler(keyCode)
	{
		if (keyCode.keyCode == 85) //u
	 	{
	 		this.__activateCallout();
		}
	}*/
	// ...DEBUG

	_onNewBossCreated()
	{
		APP.gameScreen.gameField.bossHourglassController.on(BossModeHourglassController.EVENT_ON_PROGRESS_UPDATED, this._onHourglassProgressUpdated, this);
	}

	_onHourglassProgressUpdated(event)
	{
		let lCurProgress_num = event.curProgress;
		if (lCurProgress_num >= 0.07 && lCurProgress_num <= 0.5)
		{
			APP.gameScreen.gameField.bossHourglassController.off(BossModeHourglassController.EVENT_ON_PROGRESS_UPDATED, this._onHourglassProgressUpdated, this);
			this.__activateCallout();
		}
	}

	_onBossDestroying(event)
	{
		APP.gameScreen.gameField.bossHourglassController.off(BossModeHourglassController.EVENT_ON_PROGRESS_UPDATED, this._onHourglassProgressUpdated, this);
		if (!this.info.isPresented)
		{
			this.__deactivateCallout();
		}
	}

	_onBossDisappeared(event)
	{
		APP.gameScreen.gameField.bossHourglassController.off(BossModeHourglassController.EVENT_ON_PROGRESS_UPDATED, this._onHourglassProgressUpdated, this);
		if (!this.info.isPresented)
		{
			this.__deactivateCallout();
		}
	}

	__deactivateCallout ()
	{
		APP.gameScreen.gameField.bossHourglassController.off(BossModeHourglassController.EVENT_ON_PROGRESS_UPDATED, this._onHourglassProgressUpdated, this);
		
		super.__deactivateCallout ();
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
			view.setCaption("TATimesRunningOutCaption", "TAHurryCaption");
		}

		super.__validateViewLevel();
	}
	//...VALIDATION
}

export default TimesRunningOutController