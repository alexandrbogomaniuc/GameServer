import GUSGamePendingOperationController from '../../../../../common/PIXI/src/dgphoenix/gunified/controller/gameplay/GUSGamePendingOperationController';
import GameWebSocketInteractionController from '../interaction/server/GameWebSocketInteractionController';
import GameScreen from '../../main/GameScreen';
import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';

class GamePendingOperationController extends GUSGamePendingOperationController
{
	constructor()
	{
		super();
	}

	__initControlLevel()
	{
		super.__initControlLevel();

		APP.gameScreen.on(GameScreen.EVENT_ON_BTG_ROUND_OBSERVER_DENIED, this._onBattlegroundRoundObserverDenied, this);
	}

	__startHandleServerMessages()
	{
		super.__startHandleServerMessages();

		let wsInteractionController = APP.webSocketInteractionController;
		wsInteractionController.on(GameWebSocketInteractionController.EVENT_ON_CONNECTION_READY_TO_ROOM_OPEN, this._onServerConnectionReadyToRoomOpen, this);
	}

	_onBattlegroundRoundObserverDenied(event)
	{
		this.__resetPendingOperationIfPossible();
	}

	_onServerConnectionReadyToRoomOpen(event)
	{
		if (!this.info.isPendingOperationProgressStatusDefined)
		{
			this._requestPendingOperationStatus();
		}
	}
}

export default GamePendingOperationController;