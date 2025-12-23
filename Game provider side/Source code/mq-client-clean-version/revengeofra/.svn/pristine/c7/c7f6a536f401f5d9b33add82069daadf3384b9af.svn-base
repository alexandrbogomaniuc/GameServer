import SimpleUIController from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/uis/base/SimpleUIController';
import PlayerCollectionScreenInfo from '../../../../../model/uis/custom/secondary/player_collection/PlayerCollectionScreenInfo';
import PlayerCollectionScreenView from '../../../../../view/uis/custom/secondary/player_collection/PlayerCollectionScreenView';
import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import LobbyAPP from '../../../../../LobbyAPP';
import LobbyWebSocketInteractionController from '../../../../interaction/server/LobbyWebSocketInteractionController';
import {CLIENT_MESSAGES} from '../../../../../model/interaction/server/LobbyWebSocketInteractionInfo';
import LobbyScreen from '../../../../../main/LobbyScreen';
import LobbyExternalCommunicator from '../../../../../external/LobbyExternalCommunicator';
import {GAME_MESSAGES} from '../../../../../../../../common/PIXI/src/dgphoenix/gunified/controller/external/GUSLobbyExternalCommunicator';
import PlayerInfo from '../../../../../../../../common/PIXI/src/dgphoenix/unified/model/custom/PlayerInfo';
import PlayerController from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/custom/PlayerController';
import WeaponsScreenController from './WeaponsScreenController';

class PlayerCollectionScreenController extends SimpleUIController
{
	static get EVENT_SCREEN_ACTIVATED()					{ return "onPlayerCollectionScreenActivated"; }
	static get EVENT_SCREEN_DEACTIVATED()				{ return "onPlayerCollectionScreenDeactivated"; }

	static get EVENT_ON_CLOSE_BTN_CLICKED()				{ return PlayerCollectionScreenView.EVENT_ON_CLOSE_BTN_CLICKED; }
	static get EVENT_ON_FRAME_SWITCHED()				{ return PlayerCollectionScreenView.EVENT_ON_FRAME_SWITCHED; }
	static get EVENT_ON_SELECTED_STAKE_CHANGED()		{ return PlayerCollectionScreenView.EVENT_ON_SELECTED_STAKE_CHANGED; }

	showScreen()
	{
		this._showScreen();
	}

	hideScreen()
	{
		this._hideSceeen();
	}

	configureWeaponsScreenMode(aStake_num)
	{
		this.view.configureWeaponsScreenMode(aStake_num);
	}

	get weaponsScreenController()
	{
		return this._weaponsScreenController;
	}

	constructor()
	{
		super(new PlayerCollectionScreenInfo());

		this._fWeaponsScreenController_qssc = null;
	}

	//INIT...
	__init()
	{
		super.__init();

		this._fIsBGLoadingCompleted_bl = false;
		this._fEnterOccurred_bl = false;
	}

	__initControlLevel()
	{
		super.__initControlLevel();

		APP.playerController.on(PlayerController.EVENT_ON_PLAYER_INFO_UPDATED, this._onPlayerInfoUpdated, this);
		APP.on(LobbyAPP.EVENT_ON_PLAYER_INFO_UPDATED, this._onPlayerInfoUpdated, this);

		this._weaponsScreenController.init();

		APP.on(LobbyAPP.EVENT_ON_SOME_BONUS_STATE_CHANGED, this._onSomeBonusStateChanged, this);
	}

	__initViewLevel()
	{
		super.__initViewLevel();

		let lView_qssv = this.view;
		lView_qssv.on(PlayerCollectionScreenView.EVENT_ON_CLOSE_BTN_CLICKED, this.emit, this);
		lView_qssv.on(PlayerCollectionScreenView.EVENT_ON_FRAME_SWITCHED, this.emit, this);
		lView_qssv.on(PlayerCollectionScreenView.EVENT_ON_SELECTED_STAKE_CHANGED, this.emit, this);

		this._weaponsScreenController.initView(lView_qssv.weaponsScreenView);
	}

	get _weaponsScreenController()
	{
		return this._fWeaponsScreenController_qssc || (this._fWeaponsScreenController_qssc = new WeaponsScreenController(this));
	}
	//...INIT

	_onSomeBonusStateChanged()
	{
		let lView_qssv = this.view;
		if (lView_qssv)
		{
			lView_qssv.onSomeBonusStateChanged();
		}
	}

	_onPlayerInfoUpdated(aEvent_obj)
	{
		if (aEvent_obj.data[PlayerInfo.KEY_CURRENCY_SYMBOL])
		{
			let lView_qssv = this.view;
			if (lView_qssv)
			{
				lView_qssv.updateCurrency(aEvent_obj.data[PlayerInfo.KEY_CURRENCY_SYMBOL].value);
			}
		}

		if (aEvent_obj.data[PlayerInfo.KEY_STAKES])
		{
			let lView_qssv = this.view;
			if (lView_qssv)
			{
				lView_qssv.updateStakes(aEvent_obj.data[PlayerInfo.KEY_STAKES].value);
			}
		}

		if (aEvent_obj.data[PlayerInfo.KEY_STAKE])
		{
			let lView_qssv = this.view;
			if (lView_qssv)
			{
				lView_qssv.setStake(aEvent_obj.data[PlayerInfo.KEY_STAKE].value);
			}
		}
	}

	_showScreen()
	{
		let lView_qssv = this.view;

		lView_qssv.show();
		lView_qssv.updatePlayerData(APP.lobbyScreen.playerInfo);

		this.emit(PlayerCollectionScreenController.EVENT_SCREEN_ACTIVATED);
	}

	_hideSceeen()
	{
		let lView_qssv = this.view;
		if (lView_qssv)
		{
			lView_qssv.hide();

			this.emit(PlayerCollectionScreenController.EVENT_SCREEN_DEACTIVATED);
		}
	}

	destroy()
	{
		this._fWeaponsScreenController_qssc && this._fWeaponsScreenController_qssc.destroy();
		this._fWeaponsScreenController_qssc = null;

		super.destroy();
	}

}

export default PlayerCollectionScreenController