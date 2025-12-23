import GUSLobbyView from '../../../../common/PIXI/src/dgphoenix/gunified/view/main/GUSLobbyView';
import { APP } from '../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import I18 from '../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
import * as FEATURES from '../../../../common/PIXI/src/dgphoenix/unified/view/layout/features';
import LobbyLogoView from '../view/uis/custom/LobbyLogoView';
import LobbyRoomButtons from '../view/uis/custom/lobby_room_buttons/LobbyRoomButtons';
import GUSLobbyButton from '../../../../common/PIXI/src/dgphoenix/gunified/view/uis/GUSLobbyButton';

class LobbyView extends GUSLobbyView
{
	static get LOBBY_PLAYER_INFO_BLOCK_Y()							{ return 162 }
	static get LOBBY_PLAYER_INFO_BLOCK_HEIGHT()						{ return 80 }

	constructor (aPlayer_obj)
	{
		super(aPlayer_obj);
	}

	_addCaptions()
	{
		let logo = this.addChild(new LobbyLogoView());
		logo.position.set(-240, -165);
		logo.scale.set(0.93);

		if (APP.isMobile)
		{
			logo.y -= 10;
		}
	}

	_addBrand()
	{	
		let lBrand = this.addChild(I18.generateNewCTranslatableAsset('TAPreloaderCustomBrand'));
		lBrand.position.set(this.__brandPosition.x, this.__brandPosition.y);
	}

	get __brandPosition()
	{
		return {x: -344, y: -191};
	}

	__provideRoomButtonsInstance()
	{
		let l_lrb = new LobbyRoomButtons();
		l_lrb.position.set(300, -10);

		window.rbs = l_lrb;

		return l_lrb;
	}

	get __launchGameSoundName()
	{
		return "mq_gui_launch";
	}

	//USER_DETAILS...
	_addUserDetailsContainer()
	{
		super._addUserDetailsContainer();

		this._fUserDetailsContainer_spr.position.set(-480, 171 + (APP.isMobile ? -25 : 0));
	}
	
	_addUserDetailsBackground()
	{
		let l_s = this._fUserDetailsContainer_spr.addChild(APP.library.getSprite("lobby/player_info_background"));
		l_s.anchor.set(0, 0);
		l_s.position.x = -360;
	}

	get __nickNameProps()
	{
		return {
			pivot: new PIXI.Point(0, 0),
			fontName: "fnt_nm_barlow",
			maxWidth: 100,
			position: new PIXI.Point(24, 22)
		}
	}

	__provideEditUserDetailsButtonInstance()
	{
		let l_b = new GUSLobbyButton("lobby/edit_btn", "TALobbyEditProfileBtnLabel", true);

		l_b.position.set(63, 60);
		l_b.caption.position.set(-8, -4);

		if (FEATURES.IE)
		{
			l_b.caption.pivot.set(-1, -1);
		}

		return l_b;
	}
	//...USER_DETAILS

	destroy()
	{
		super.destroy();
	}
}

export default LobbyView;