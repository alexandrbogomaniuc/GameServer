import CalloutController from '../CalloutController';
import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import GameFieldController from '../../../../../controller/uis/game_field/GameFieldController';
import { ENEMIES } from '../../../../../../../shared/src/CommonConstants';
import CalloutView from '../../../../../view/uis/custom/callouts/CalloutView';

class CapsulesCalloutController extends CalloutController
{
	constructor(aOptInfo_usuii, parentController)
	{
		super(aOptInfo_usuii, undefined, parentController);
	}

	__init ()
	{
		super.__init();
		this._fCurrentCupsuleName_str = null;
	}

	__getExternalViewForSelfInitialization()
	{
		return this.__getViewLevelSelfInitializationViewProvider().capsuleCalloutView;
	}


	__initControlLevel ()
	{
		super.__initControlLevel();
		APP.currentWindow.gameFieldController.on(GameFieldController.EVENT_ON_CAPSULE_CREATED, this._onCapsuleCreated, this);
	}

	__deactivateCallout()
	{
		super.__deactivateCallout();
		this._fCurrentCupsuleName_str = undefined;
	}

	__onPresentationEnded()
	{
		this._validateQueue();
	}

	_onCapsuleCreated(aEvent_obj)
	{
		if (!this.info.i_checkCapsuleInQueue(aEvent_obj.capsuleName) && this._fCurrentCupsuleName_str !== aEvent_obj.capsuleName)
		{
			this.info.i_addCapsule(aEvent_obj);
			if (!this.info.isActive)
			{
				this._validateQueue();
			}
		}
	}

	_validateQueue()
	{
		if (this.info.queueLength && this.info.queueLength > 0)
		{
			let lCapsuleInfo_obj = this.info.i_getNextCapsuleInfo();
			if (
				APP.currentWindow.enemiesController.getExistEnemy(lCapsuleInfo_obj.enemyId) &&
				this._fCurrentCupsuleName_str !== lCapsuleInfo_obj.capsuleName
			)
			{
				this._fCurrentCupsuleName_str = lCapsuleInfo_obj.capsuleName;
				this.__validateViewLevel();
				this.__activateCallout();
			}
			else
			{
				this._validateQueue();
			}
		}
		else
		{
			this.view.stopCallout();
		}
	}

	_startCallout()
	{
		let lIsFastAnimation_bl = this.info.queueLength > 0;
		this.view && this.view.startCallout(lIsFastAnimation_bl);
	}

	//VALIDATION...
	__validateViewLevel ()
	{
		super.__validateViewLevel();

		if (this.info.isActive && !APP.gameScreen.subloadingController.isLoadingScreenShown)
		{
			var lRareCaption_spr = "TARareEnemyCaption";
			var lCapsuleCaption_spr = null;
			
			switch (this._fCurrentCupsuleName_str)
			{
				case ENEMIES.BombCapsule:
				case ENEMIES.BulletCapsule:
				case ENEMIES.FreezeCapsule:
				case ENEMIES.GoldCapsule:
				case ENEMIES.KillerCapsule:
				case ENEMIES.LaserCapsule:
				case ENEMIES.LightningCapsule:
					lCapsuleCaption_spr = `TA${this._fCurrentCupsuleName_str}Caption`;
					break;
				default:
					throw new Error(`There is no TA caption for ${this._fCurrentCupsuleName_str}`);
			}
			this.view.setCaption(lRareCaption_spr, lCapsuleCaption_spr);
			this._startCallout();
		}
	}
	//...VALIDATION

	__onRoomFieldCleared()
	{
		this._fCurrentCupsuleName_str = undefined;
		this.info.i_clearQueue();
		super.__onRoomFieldCleared();
	}
}

export default CapsulesCalloutController;