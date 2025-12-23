import GUSLobbyPaytableScreenController from '../../../../../../../../common/PIXI/src/dgphoenix/gunified/controller/uis/custom/secondary/paytable/GUSLobbyPaytableScreenController';
import LobbyAPP from '../../../../../LobbyAPP';
import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import PlayerInfo from '../../../../../../../../common/PIXI/src/dgphoenix/unified/model/custom/PlayerInfo';

class PaytableScreenController extends GUSLobbyPaytableScreenController
{
	static get EVENT_ON_WEAPON_PAID_MULTIPLIER_UPDATED()			{ return "EVENT_ON_WEAPON_PAID_MULTIPLIER_UPDATED"; }

	constructor()
	{
		super();
	}

	//INIT...
	__initControlLevel()
	{
		super.__initControlLevel();
		
		APP.on(LobbyAPP.EVENT_ON_PLAYER_INFO_UPDATED, this._onPlayerInfoUpdated, this);
	}
	//...INIT

	_onPlayerInfoUpdated(e)
	{
		if (e.data[PlayerInfo.KEY_WEAPON_COST_MULTIPLIERS])
		{
			this.emit(PaytableScreenController.EVENT_ON_WEAPON_PAID_MULTIPLIER_UPDATED, {weaponPaidMultiplier: e.data[PlayerInfo.KEY_WEAPON_COST_MULTIPLIERS]});
		}
	}

	_createPrintablePath()
	{
		let lAppPathUrl_str = APP.appParamsInfo.lobbyPath || APP.applicationFolderURL;
		let lLocalizationFolder_str = "en";//I18.currentLocale; /*TODO: use I18.currentLocale instead of fixed 'en' value when localisations for printable rules will be supported*/
		let lFileName_str = 'MAXDUEL-GameRules';

		if (APP.isBattlegroundGame)
		{
			lFileName_str = 'MAXDUEL-Battleground-GameRules';
		}

		if (lAppPathUrl_str)
		{
			this._fPrintableRulesPath_str = `${lAppPathUrl_str}assets/rules/${lLocalizationFolder_str}/${lFileName_str}.pdf`;
		}
	}
}

export default PaytableScreenController