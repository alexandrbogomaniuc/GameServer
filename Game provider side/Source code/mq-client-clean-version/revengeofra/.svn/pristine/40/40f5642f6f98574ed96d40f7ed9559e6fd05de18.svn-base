import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sprite from '../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import ArrowButton from './ArrowButton';

import RoomButton from './RoomButton';
import LobbyStateController from '../../controller/state/LobbyStateController';
import LobbyPlayerController from '../../controller/custom/LobbyPlayerController';
import PlayerInfo from '../../../../../common/PIXI/src/dgphoenix/unified/model/custom/PlayerInfo';

class LobbyRoomButtons extends Sprite
{
	static get EVENT_LOBBY_ROOM_STAKE_SELECTED()			{return RoomButton.EVENT_LOBBY_ROOM_STAKE_SELECTED};
	static get EVENT_LOBBY_ROOM_WEAPONS_INDICATOR_CLICK()	{return RoomButton.EVENT_LOBBY_ROOM_WEAPONS_INDICATOR_CLICK};

	static get ROOM_IMAGES_AMOUNT() 				{return 5;}

	update(aStakes_num_arr)
	{
		this._update(aStakes_num_arr);
		this._updateRoomEnable(APP.playerController.info.balance);
	}

	updateWeapons(aData_arr)
	{
		this._updateWeapons(aData_arr);
	}

	constructor()
	{
		super();

		this._fRoomButtons = [];
		this._fRoomButtonsContainer = null;

		this._fCurrentPosition_int = undefined;
		this._fStakesAmount_int = undefined;
		this._fUpdateSubscribed_bln = false;

		this._fAllWeapons_obj_arr = null;

		this._init();
	}

	_init()
	{
		this._fRoomButtonsContainer = this.addChild(new Sprite());
		this._fArrowLeft_btn = this.addChild(new ArrowButton());
		this._fArrowLeft_btn.position.set(-452, 4);
		this._fArrowLeft_btn.hideSeptum();
		this._fArrowLeft_btn.on("pointerclick", this._moveLeft, this);

		this._fArrowRight_btn = this.addChild(new ArrowButton());
		this._fArrowRight_btn.position.set(452, 4);
		this._fArrowRight_btn.scale.x = -1;
		this._fArrowRight_btn.hideSeptum();
		this._fArrowRight_btn.on("pointerclick", this._moveRight, this);

		APP.playerController.on(LobbyPlayerController.EVENT_ON_PLAYER_INFO_UPDATED, this._onPlayerInfoUpdated, this);
		this._fUpdateSubscribed_bln = true;

		APP.lobbyStateController.on(LobbyStateController.EVENT_ON_LOBBY_VISIBILITY_CHANGED, this._onLobbyScreenVisibilityChanged, this);
	}

	_onLobbyScreenVisibilityChanged(data)
	{
		if (data.visible)
		{
			if (!this._fUpdateSubscribed_bln)
			{
				APP.playerController.on(LobbyPlayerController.EVENT_ON_PLAYER_INFO_UPDATED, this._onPlayerInfoUpdated, this);
				this._fUpdateSubscribed_bln = true;
			}
		}
		else
		{
			if (this._fUpdateSubscribed_bln)
			{
				APP.playerController.off(LobbyPlayerController.EVENT_ON_PLAYER_INFO_UPDATED, this._onPlayerInfoUpdated, this);
				this._fUpdateSubscribed_bln = false;
			}
		}

		this._updateRoomsOverState(data.visible);
	}

	_onPlayerInfoUpdated(event)
	{
		if (event.data[PlayerInfo.KEY_BALANCE])
		{
			this._updateRoomEnable(event.data[PlayerInfo.KEY_BALANCE].value);
		}
	}

	_updateRoomEnable(balance)
	{
		if (this._fRoomButtons)
		{
			for (let i = 0; i < this._fRoomButtons.length; i++)
			{
				const lRoomButton_b = this._fRoomButtons[i];
				let lSpecialWeaponsExist_bl = APP.isKeepSWModeActive ? this._isAnySpecialWeaponExistForStake(lRoomButton_b.stake) : false;

				if ((lRoomButton_b.stake > balance) && !lSpecialWeaponsExist_bl)
				{
					lRoomButton_b.disableRoomBtn();
				}
				else
				{
					lRoomButton_b.enableRoomBtn();
				}
			}
		}
		this._validateArrowButtonsGlow();
	}

	_isAnySpecialWeaponExistForStake(aStake_num)
	{
		for (var stake in this._fAllWeapons_obj_arr)
		{
			if (stake == aStake_num)
			{
				return this._getWeaponsCount(this._fAllWeapons_obj_arr[stake]) > 0;
			}
		}
		return false;
	}

	_updateRoomsOverState(lobbyScreenVisible_bl)
	{
		if(this._fRoomButtons)
		{
			for(let i = 0; i < this._fRoomButtons.length; i++)
			{
				this._fRoomButtons[i].updateOverState(lobbyScreenVisible_bl);
			}
		}
	}

	_update(aStakes_num_arr)
	{
		this._fRoomButtonsContainer && this._buttonsContainerClear();

		this._fStakesAmount_int = aStakes_num_arr.length;
		for (let i = 0; i < this._fStakesAmount_int; i++)
		{
			let lButton_rb = this._fRoomButtonsContainer.addChild(this._getRoomButton(i));
			lButton_rb.updateStake(aStakes_num_arr[i]);
			lButton_rb.updateIndicators(0);
		}

		this._fRoomButtonsContainer.position.x = -RoomButton.INIT_X - RoomButton.VISIBLE_OFFSET_X * (Math.min(this._fStakesAmount_int, RoomButton.VISIBLE_AMOUNT) - 1) / 2;

		this._fArrowLeft_btn.visible = (this._fStakesAmount_int > RoomButton.VISIBLE_AMOUNT);
		this._fArrowRight_btn.visible = (this._fStakesAmount_int > RoomButton.VISIBLE_AMOUNT);
		this._updateRoomsPosition(0, true);
	}

	_updateWeapons(aData_arr)
	{
		this._fAllWeapons_obj_arr = aData_arr;

		for (let stake in aData_arr)
		{
			let lButton_btn = this._getRoomButtonByStake(stake);
			let lWeaponsCount_num = this._getWeaponsCount(aData_arr[stake]);

			if (lButton_btn)
			{
				lButton_btn.updateWeaponsIndicator(lWeaponsCount_num);
			}
		}
		this._updateRoomEnable(APP.playerController.info.balance);
	}

	_getRoomButtonByStake(aStake_num)
	{
		return this._fRoomButtons.filter((val)=>{return val.stake == aStake_num})[0];
	}

	_getWeaponsCount(aWeapons_arr)
	{
		return aWeapons_arr.reduce((acc, cur)=>{return cur.shots ? acc+1 : acc}, 0);
	}

	_getRoomButton(aIndex_int)
	{
		return this._fRoomButtons[aIndex_int] || this._initRoomButton(aIndex_int);
	}

	_initRoomButton(aIndex_int)
	{
		let lButton_rb = new RoomButton(`lobby/button_incons/lobby_room_icon_${Math.min(aIndex_int + 1, LobbyRoomButtons.ROOM_IMAGES_AMOUNT)}`, aIndex_int);
		lButton_rb.on(LobbyRoomButtons.EVENT_LOBBY_ROOM_STAKE_SELECTED, this.emit, this);

		lButton_rb.on(LobbyRoomButtons.EVENT_LOBBY_ROOM_WEAPONS_INDICATOR_CLICK, this.emit, this);

		this._fRoomButtons[aIndex_int] = lButton_rb;
		return lButton_rb;
	}

	_buttonsContainerClear()
	{
		while (this._fRoomButtonsContainer.children.length != 0)
		{
			this._fRoomButtonsContainer.removeChild(this._fRoomButtonsContainer.children[0]);
		}

		let lMask_g = this._fRoomButtonsContainer.addChild(new PIXI.Graphics());
		lMask_g.beginFill(0x000000).drawRect(-440, -150, 880, 300).endFill();
		lMask_g.position.set(436, 0);
		this._fRoomButtonsContainer.mask = lMask_g;
	}

	_moveLeft()
	{
		if (this._fCurrentPosition_int > 0)
		{
			this._updateRoomsPosition(--this._fCurrentPosition_int);
		}
	}

	_moveRight()
	{
		if (this._fCurrentPosition_int < this._fStakesAmount_int - 1)
		{
			this._updateRoomsPosition(++this._fCurrentPosition_int);
		}
	}

	_updateRoomsPosition(aIndex_int, aSkipAnimation_bl)
	{
		this._fCurrentPosition_int = aIndex_int;
		for (let i = 0; i < this._fRoomButtons.length; i++)
		{
			this._fRoomButtons[i].updatePosition(aIndex_int, aSkipAnimation_bl);
		}
		this._fArrowLeft_btn.enabled = this._fCurrentPosition_int > 0;
		this._fArrowRight_btn.enabled = this._fCurrentPosition_int < this._fStakesAmount_int - RoomButton.VISIBLE_AMOUNT;

		this._validateArrowButtonsGlow();

	}

	_areAllVisibleRoomsDisabled()
	{
		let n = Math.min(this._fRoomButtons.length, this._fCurrentPosition_int + RoomButton.VISIBLE_AMOUNT);
		for (let i=this._fCurrentPosition_int; i<n; i++)
		{
			let lRoomButton_b = this._fRoomButtons[i];
			if (lRoomButton_b.enabled)
			{
				return false;
			}
		}
		return true;
	}

	_isAnyRoomEnabledToTheRight()
	{
		let start = this._fCurrentPosition_int + RoomButton.VISIBLE_AMOUNT;
		for (let i=start; i<this._fRoomButtons.length; i++)
		{
			let lRoomButton_b = this._fRoomButtons[i];
			if (lRoomButton_b.enabled)
			{
				return true;
			}
		}
		return false;
	}

	_isAnyRoomEnabledToTheLeft()
	{
		let start = this._fCurrentPosition_int - 1;
		for (let i=start; i>= 0; i--)
		{
			let lRoomButton_b = this._fRoomButtons[i];
			if (lRoomButton_b.enabled)
			{
				return true;
			}
		}
		return false;
	}

	_validateArrowButtonsGlow()
	{
		if (this._areAllVisibleRoomsDisabled())
		{
			this._fArrowLeft_btn.setGlowable(this._isAnyRoomEnabledToTheLeft());
			this._fArrowRight_btn.setGlowable(this._isAnyRoomEnabledToTheRight());
		}
		else
		{
			this._fArrowLeft_btn.setGlowable(false);
			this._fArrowRight_btn.setGlowable(false);
		}
	}

	_startArrowsAnimation()
	{
		for (let i = 0; i < this._fRoomButtons.length; i++)
		{
			this._fRoomButtons[i].startArrowAnimation();
		}
	}

	_stopArrowsAnimation()
	{
		for (let i = 0; i < this._fRoomButtons.length; i++)
		{
			this._fRoomButtons[i].stopArrowAnimation();
		}
	}

	destroy()
	{
		APP.playerController.off(LobbyPlayerController.EVENT_ON_PLAYER_INFO_UPDATED, this._onPlayerInfoUpdated, this);
		APP.lobbyStateController.off(LobbyStateController.EVENT_ON_LOBBY_VISIBILITY_CHANGED, this._onLobbyScreenVisibilityChanged, this);

		this._fRoomButtons = null;

		this._fRoomButtonsContainer && this._buttonsContainerClear();

		this._fRoomButtonsContainer && this._fRoomButtonsContainer.destroy();
		this._fRoomButtonsContainer = null;

		this._fUpdateSubscribed_bln = null;

		super.destroy();
	}
}

export default LobbyRoomButtons;