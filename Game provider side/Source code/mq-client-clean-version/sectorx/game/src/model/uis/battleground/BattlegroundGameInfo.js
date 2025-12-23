import SimpleUIInfo from '../../../../../../common/PIXI/src/dgphoenix/unified/model/uis/SimpleUIInfo';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';

class BattlegroundGameInfo extends SimpleUIInfo
{
	constructor()
	{
		super();

		this._fIsPlayerClickedConfirmPlayForNextBattlegroundRound_bl = null;
		this._fIsNotFirstBattlegroundRoundAfterLoading_bl = null;

		this._fTimeToStart_int = APP.currentWindow.accurateCurrentTime + 60000; //60 * 1000
		this._fPlayerClickedConfirmWasResetOnQualifyState_bl = false;
	}
	
	get isPlayerClickedConfirmWasResetOnQualifyState()
	{
		return this._fPlayerClickedConfirmWasResetOnQualifyState_bl;
	}

	set isPlayerClickedConfirmWasResetOnQualifyState(aValue_bl)
	{
		this._fPlayerClickedConfirmWasResetOnQualifyState_bl = aValue_bl;
	}

	get isPlayerClickedConfirmPlayForNextBattlegroundRound()
	{
		return this._fIsPlayerClickedConfirmPlayForNextBattlegroundRound_bl;
	}

	set isPlayerClickedConfirmPlayForNextBattlegroundRound(aValue_bl)
	{
		this._fIsPlayerClickedConfirmPlayForNextBattlegroundRound_bl = aValue_bl;
	}

	get isNotFirstBattlegroundRoundAfterLoading()
	{
		return this._fIsNotFirstBattlegroundRoundAfterLoading_bl;
	}

	set isNotFirstBattlegroundRoundAfterLoading(aValue_bl)
	{
		this._fIsNotFirstBattlegroundRoundAfterLoading_bl = aValue_bl;
	}

	setTimeToStart(aTime_int)
	{
		this._fTimeToStart_int = aTime_int;
	}

	getTimeToStartInMillis()
	{
		if(this._fTimeToStart_int === undefined)
		{
			return undefined;
		}

		let lDelta_num = this._fTimeToStart_int - APP.currentWindow.currentTime;

		if(lDelta_num < 0)
		{
			return 0;
		}

		return lDelta_num;
	}

	getFormattedTimeToStart(aOptIsHHRequired_bl)
	{
		if(this._fTimeToStart_int === undefined)
		{
			return aOptIsHHRequired_bl ? "--:--:--" : "--:--"
		}

		let lSecondsCount_int = Math.round(this.getTimeToStartInMillis() / 1000);

		let hh = Math.floor(lSecondsCount_int / 3600); //lSecondsCount_int / 60 / 60
		let mm = Math.floor(lSecondsCount_int / 60 - hh * 60);
		let ss = lSecondsCount_int % 60;

		let ssPrefix_str = ss < 10 ? "0" : "";
		let mmPrefix_str = mm < 10 ? "0" : "";
		let hhPrefix_str = hh < 10 ? "0" : "";

		if(aOptIsHHRequired_bl)
		{
			return hhPrefix_str + hh + ":" + mmPrefix_str + mm + ":" + ssPrefix_str + ss;
		}

		return mmPrefix_str + mm + ":" + ssPrefix_str + ss;
	}

	destroy()
	{
		super.destroy();

		this._fIsPlayerClickedConfirmPlayForNextBattlegroundRound_bl = null;
		
	}
}

export default BattlegroundGameInfo;