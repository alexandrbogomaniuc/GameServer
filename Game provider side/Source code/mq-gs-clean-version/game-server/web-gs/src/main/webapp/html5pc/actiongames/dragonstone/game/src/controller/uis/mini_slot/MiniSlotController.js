import SimpleUIController from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/uis/base/SimpleUIController';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import MiniSlotView from '../../../view/uis/mini_slot/MiniSlotView';
import GameWebSocketInteractionController from './../../interaction/server/GameWebSocketInteractionController';

class MiniSlotController extends SimpleUIController
{
	static get EVENT_ON_SPIN_FINISH()						{return MiniSlotView.EVENT_ON_SPIN_FINISH;}

	setDefaultReelsContent(aReels_obj)
	{
		this._setDefaultReelsContent(aReels_obj);
	}

	startSpin(aReelsPositions_arr)
	{
		this._startSpin(aReelsPositions_arr);
	}

	showWinAnimation()
	{
		this._showWinAnimation();
	}

	constructor(aOptInfo_usuii, aOptView_uo)
	{
		super(aOptInfo_usuii, aOptView_uo);
	}

	__initControlLevel()
	{
		super.__initControlLevel();

		APP.webSocketInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_ROUND_RESULT_MESSAGE, this._onServerRoundResultMessage, this);
	}

	__initViewLevel()
	{
		super.__initViewLevel();

		this.view.on(MiniSlotView.EVENT_ON_SPIN_FINISH, this.emit, this);
	}

	_startSpin(aReelsPositions_arr)
	{
		let isRoundResultResponceRecieved = APP.gameScreen.gameField.roundResultActivationInProgress;
		this.info.currentSpinReelsPositions = aReelsPositions_arr;
		this.view.startSpin(isRoundResultResponceRecieved);
	}

	_onServerRoundResultMessage()
	{
		if (this.view.isReelsAnimating)
		{
			this.view.accelerateSpin();
		}
	}

	_showWinAnimation()
	{
		this.view.showWinAnimation();
	}

	_setDefaultReelsContent(aReels_obj)
	{
		if (this.info)
		{
			this.info.defaultReelsContent = aReels_obj;
		}
	}

	destroy()
	{
		APP.webSocketInteractionController.off(GameWebSocketInteractionController.EVENT_ON_SERVER_ROUND_RESULT_MESSAGE, this._onServerRoundResultMessage, this);

		super.destroy();
	}
}

export default MiniSlotController;
