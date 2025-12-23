import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import GameFieldController from '../../../game_field/GameFieldController';
import CalloutController from '../CalloutController';
import {STATE_RAGE_HEALTH_VALUE} from '../../../../../main/enemies/BossEnemy';

class EnragedBossCalloutController extends CalloutController
{
	constructor(aOptInfo_usuii, parentController)
	{
		super(aOptInfo_usuii, undefined, parentController);
	}

	__getExternalViewForSelfInitialization()
	{
		return this.__getViewLevelSelfInitializationViewProvider().enragedBossCalloutView;
	}

	__initControlLevel ()
	{
		super.__initControlLevel();
		APP.currentWindow.gameFieldController.on(GameFieldController.EVENT_ON_NEW_BOSS_CREATED, this._onBossCreated, this);
		APP.currentWindow.gameFieldController.on(GameFieldController.EVENT_BOSS_IS_ENRAGED, this._onBossIsEnraged, this);
		APP.currentWindow.gameFieldController.on(GameFieldController.EVENT_ON_BOSS_DESTROYING, this._onBossDestroying, this);
	}

	//VALIDATION...
	__validateViewLevel ()
	{
		super.__validateViewLevel();

		if (this.info.isActive && !APP.gameScreen.subloadingController.isLoadingScreenShown)
		{
			this.view.setCaption("TABossIsEnragedCalloutCaption", "TAFinishEnragedBossCalloutCaption");
			this._startCallout();
		}
	}
	//...VALIDATION

	__onPresentationEnded()
	{
		this.view.stopCallout();
	}

	_startCallout()
	{
		this.view && this.view.startCallout();
	}

	_onBossIsEnraged()
	{
		this.__activateCallout();
	}

	_onBossDestroying()
	{
		if (this.info.isActive && this.view)
		{
			this.view.i_interruptAnimations();
			this.view.stopCallout();
		}
	}

	_onBossCreated(aEnemy_obj)
	{
		if (aEnemy_obj.energy 
			&&  aEnemy_obj.fullEnergy 
			&&  (aEnemy_obj.energy / aEnemy_obj.fullEnergy).toFixed(10) <= STATE_RAGE_HEALTH_VALUE)
		{
			this.__activateCallout();
		}
	}
}

export default EnragedBossCalloutController;