import CalloutController from '../CalloutController';
import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import I18 from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
import GameField from '../../../../../main/GameField';
import GameScreen from '../../../../../main/GameScreen';
import { ENEMIES } from '../../../../../../../shared/src/CommonConstants';
import GameStateController from '../../../../state/GameStateController';
import BossModeController from '../../bossmode/BossModeController';

class CollectFragmentsController extends CalloutController
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
		return this.__getViewLevelSelfInitializationViewProvider().collectFragmentsView;
	}

	__initViewLevel ()
	{
		super.__initViewLevel();
	}

	__initControlLevel ()
	{
		super.__initControlLevel();
		APP.gameScreen.on(GameScreen.EVENT_ON_DRAGON_DISAPPEARED, this._onBossDisappeared, this);
		APP.gameScreen.on(GameScreen.EVENT_ON_CLOSE_ROOM, this._onCloseRoom, this);
		
		APP.gameScreen.bossModeController.on(BossModeController.EVENT_ON_DEATH_DISAPPEARING_STARTED, this._onBossDeathDisappearingStarted, this);

		let lGameStateController_gsc = this._fGameStateController_gsc = APP.currentWindow.gameStateController;
		this._gameStateInfo = lGameStateController_gsc.info;
		if (lGameStateController_gsc.info.isPlayerSitIn && lGameStateController_gsc.info.isGameInProgress && !this._isBossSubround)
		{
			this.__activateCallout();
		}
		else
		{
			lGameStateController_gsc.on(GameStateController.EVENT_ON_PLAYER_SEAT_STATE_CHANGED, this._onGamePlayerStateChanged, this);
			lGameStateController_gsc.on(GameStateController.EVENT_ON_GAME_ROUND_STATE_CHANGED, this._onGameRoundStateChanged, this);
		}

		// DEBUG...
		// window.addEventListener("keydown", this.keyDownHandler.bind(this), false);
		// ...DEBUG
	}

	//DEBUG...
	/*keyDownHandler(keyCode)
	{
		if (keyCode.keyCode == 84) //t
	 	{
	 		this.__activateCallout();
		}
	}*/
	// ...DEBUG

	_onBossDeathDisappearingStarted()
	{
		this.__activateCallout();
	}

	_onBossDisappeared(event)
	{
		this.__activateCallout();
	}

	_onGamePlayerStateChanged(event)
	{
		let lIsPlayerSitIn_bln = event.value;
		let lIsGameInProgress_bln = this._gameStateInfo.isGameInProgress;
		
		if (lIsPlayerSitIn_bln && lIsGameInProgress_bln)
		{
			this._fGameStateController_gsc.off(GameStateController.EVENT_ON_PLAYER_SEAT_STATE_CHANGED, this._onGamePlayerStateChanged, this);
			this._fGameStateController_gsc.off(GameStateController.EVENT_ON_GAME_ROUND_STATE_CHANGED, this._onGameRoundStateChanged, this);
			
			if (!this._isBossSubround)
			{
				this.__activateCallout();
			}
		}
	}

	_onGameRoundStateChanged(event)
	{
		let lIsGameInProgress_bln = event.value;
		let lIsPlayerSitIn_bln = this._gameStateInfo.isPlayerSitIn;

		if (lIsPlayerSitIn_bln && lIsGameInProgress_bln)
		{
			this._fGameStateController_gsc.off(GameStateController.EVENT_ON_PLAYER_SEAT_STATE_CHANGED, this._onGamePlayerStateChanged, this);
			this._fGameStateController_gsc.off(GameStateController.EVENT_ON_GAME_ROUND_STATE_CHANGED, this._onGameRoundStateChanged, this);
			
			if (!this._isBossSubround)
			{
				this.__activateCallout();
			}
		}
	}

	_onCloseRoom(event)
	{
		this._fGameStateController_gsc.off(GameStateController.EVENT_ON_PLAYER_SEAT_STATE_CHANGED, this._onGamePlayerStateChanged, this);
		this._fGameStateController_gsc.on(GameStateController.EVENT_ON_PLAYER_SEAT_STATE_CHANGED, this._onGamePlayerStateChanged, this);

		this._fGameStateController_gsc.off(GameStateController.EVENT_ON_GAME_ROUND_STATE_CHANGED, this._onGameRoundStateChanged, this);
		this._fGameStateController_gsc.on(GameStateController.EVENT_ON_GAME_ROUND_STATE_CHANGED, this._onGameRoundStateChanged, this);
	}

	 _startCallout()
	{
		let l_ltv = this.view;

		if (l_ltv)
		{
			l_ltv.startCallout();
		}
	}

	get _isBossSubround()
	{
		return APP.gameScreen.gameStateController.info.isBossSubround;
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

			view.setCaption("TACollectFragmentsCaption", "TASummonTheDragonCaption");
		}

		super.__validateViewLevel();
	}
	//...VALIDATION
}

export default CollectFragmentsController