import GUSLobbyRoomButtons from '../../../../../../../common/PIXI/src/dgphoenix/gunified/view/uis/lobby_room_buttons/GUSLobbyRoomButtons';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import RoomButton from './RoomButton';

const CARDS_POSITIONS =
[
	{x: 50, y: -10},
	{x: 207, y: -47},
	{x: 377, y: -55},
	{x: 537, y: -35},
	{x: 200, y: 165},
	{x: 420, y: 185},
];

const CARDS_Z_INDEXES = [6, 5, 4, 3, 2, 1];


class LobbyRoomButtons extends GUSLobbyRoomButtons
{
	static get ROOMS_SKIPPED_PER_CLICK_COUNT() {return 5};

	constructor()
	{
		super();
	}

	get __isArrowButtonsSupported()
	{
		return false;
	}

	get __maxAvailableRoomsAmount()
	{
		return 6;
	}

	

	_update(aStakes_num_arr)
	{
		this._fRoomButtonsContainer && this._buttonsContainerClear();

		//there was a request to limit room icons amount: https://jira.dgphoenix.com/browse/DRAG-691
		this._fStakesAmount_int = aStakes_num_arr.length;
		if (this._isMaxAvailableRoomsAmountDefined)
		{
			let lMaxAmount_int = this.__maxAvailableRoomsAmount;
			if (this._fStakesAmount_int > lMaxAmount_int)
			{
				this._fStakesAmount_int = lMaxAmount_int;
			}
		}

		var lValueGrow_bl = true;
		if (this._fStakesAmount_int > 1 && aStakes_num_arr[0] > aStakes_num_arr[1])
		{
			lValueGrow_bl = false;
		}

		for (let i = 0; i < this._fStakesAmount_int; i++)
		{
			let lButton_rb = this._fRoomButtonsContainer.addChild(this._getRoomButton(i));
			lButton_rb.updateStake(aStakes_num_arr[i], (lValueGrow_bl ? i : this._fStakesAmount_int - 1 - i));
			lButton_rb.visible = false;
			if(i == 0)
			{
				setTimeout(() => {
					lButton_rb._onRoomBtnClicked();
				}, 0);
				
			}
		}

		let lRoomButtonsContainerPosition_p = this.__calcRoomButtonsContainerPosition();
		this._fRoomButtonsContainer.position.x = lRoomButtonsContainerPosition_p.x;
		this._fRoomButtonsContainer.position.y = lRoomButtonsContainerPosition_p.y;

		if (this.__isArrowButtonsSupported)
		{
			this._fArrowLeft_btn.visible = (this._fStakesAmount_int > GUSLobbyRoomButton.VISIBLE_AMOUNT);
			this._fArrowRight_btn.visible = (this._fStakesAmount_int > GUSLobbyRoomButton.VISIBLE_AMOUNT);
		}

		window.LA = this._fArrowLeft_btn;

		this._updateRoomsPosition(0, true, lValueGrow_bl);

		this._redrowRoomBrowsingProgress();
	}


	__updateRoomsCoordinates(aIndex_int, aSkipAnimation_bl, aIsReverseGrow_bl)
	{
		for (let i = 0; i < this._fRoomButtons.length; i++)
		{
			this._fRoomButtons[i].position = CARDS_POSITIONS[aIndex_int+i];
			this._fRoomButtons[i].zIndex = CARDS_Z_INDEXES[aIndex_int+i];
		}
	}

	_buttonsContainerClear()
	{
		while (this._fRoomButtonsContainer.children.length != 0)
		{
			this._fRoomButtonsContainer.removeChild(this._fRoomButtonsContainer.children[0]);
		}
	}

	_redrowRoomBrowsingProgress()
	{
		if(this._fProgressBarContainer_c)
		{
			if(this._fProgressBarButtons_btn_arr)
			{
				for( let i = 0; i < this._fProgressBarButtons_btn_arr.length; i++ )
				{
					this._fProgressBarButtons_btn_arr[i].removeAllListeners();
					this._fProgressBarButtons_btn_arr[i].destroy();
					this._fProgressBarContainer_c.removeChild(this._fProgressBarButtons_btn_arr[i]);
				}
			}

			if(this._fProgressBar_g)
			{
				this._fProgressBarContainer_c.removeChild(this._fProgressBar_g);
			}

			this.removeChild(this._fProgressBarContainer_c);
			this._fProgressBarButtons_btn_arr = null;
		}


		this._fProgressBarContainer_c = this.addChild(new Sprite());
		this._fProgressBarButtons_btn_arr = [];

		let lTotalSectionsCount_int = Math.ceil(this._fStakesAmount_int / LobbyRoomButtons.ROOMS_SKIPPED_PER_CLICK_COUNT);
		
		if(lTotalSectionsCount_int === 0)
		{
			return;
		}
		
		let l_g = this._fProgressBarContainer_c.addChild(new PIXI.Graphics());

		this._fProgressBarContainer_c.position.y = APP.isMobile ? 165 : 175;

		this._fProgressBar_g = l_g;
	}

	__calcRoomButtonsContainerPosition()
	{
		let lX_num = 0;
		let lY_num = 0;

		switch(Math.min(this._fStakesAmount_int, RoomButton.VISIBLE_AMOUNT))
		{
			case 1: 
				lX_num = -445; //-595 + 165 - 15
				lY_num = 70;
				break;
			case 2:
				lX_num = -522.5; //-595 + 165/2 - 10
				lY_num = 70;
				break;
			case 3:
				lX_num = -595;
				lY_num = 70;
				break;
			case 4:
			case 5:
			default:
				lX_num = -595;
				lY_num = -40;
				break;
		}
		
		lY_num += (APP.isMobile ? -10 : 0);

		return new PIXI.Point(lX_num, lY_num);
	}

	__provideRoomBtninstance(aIndex_int)
	{
		return new RoomButton(aIndex_int);
	}

	__provideAreaMaskInstance()
	{
		let lMask_g = new PIXI.Graphics();
		lMask_g.beginFill(0x000000).drawRect(10, -190, 600, 490).endFill();

		return lMask_g;
	}

	destroy()
	{
		super.destroy();

		this._fProgressBarContainer_c = null;
		this._fProgressBarButtons_btn_arr = null;
		this._fProgressBar_g = null;
	}
}

export default LobbyRoomButtons;