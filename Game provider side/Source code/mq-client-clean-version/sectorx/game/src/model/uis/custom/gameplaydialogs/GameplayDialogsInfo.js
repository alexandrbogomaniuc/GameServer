import SimpleUIInfo from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/uis/SimpleUIInfo';
import GameplayDialogInfo from './GameplayDialogInfo';
import BattlegroundCountDownDialogInfo from './custom/BattlegroundCountDownDialogInfo';

let DIALOGS_AMOUNT = 1;

class GameplayDialogsInfo extends SimpleUIInfo
{
	static get DIALOG_ID_BATTLEGROUND_COUNT_DOWN() 					{ return 0; }

	constructor()
	{
		super();

		this._dialogsInfos = null;
		this._dialogIdForPresentation = undefined;

		this._initDialogsInfo();
	}

	destroy()
	{
		this._dialogsInfos = null;

		super.destroy();
	}

	getDialogInfo (dialogId)
	{
		return this._getDialogInfo(dialogId);
	}

	get dialogsCount ()
	{
		return DIALOGS_AMOUNT;
	}

	get dialogIdForPresentation ()
	{
		return this._dialogIdForPresentation;
	}

	set dialogIdForPresentation (dialogId)
	{
		this._dialogIdForPresentation = dialogId;
	}

	hasActiveDialogWithId(aDialogId_int)
	{
		var dialogsAmount = this.dialogsCount;
		for (var i = 0; i < dialogsAmount; i++)
		{
			if (
				this._getDialogInfo(i).isActive &&
				aDialogId_int === this._getDialogInfo(i).dialogId
				)
			{
				return true;
			}
		}
		return false;
	}


	get hasActiveDialog ()
	{
		var dialogsAmount = this.dialogsCount;
		for (var i = 0; i < dialogsAmount; i++)
		{
			if (this._getDialogInfo(i).isActive)
			{
				return true;
			}
		}
		return false;
	}

	get hasActiveCriticalDialog ()
	{
		var dialogsAmount = this.dialogsCount;
		return false;
	}

	_initDialogsInfo()
	{
		this._dialogsInfos = [];
	}

	_getDialogInfo (dialogId)
	{
		return this._dialogsInfos[dialogId] || this._initDialogInfo(dialogId);
	}

	_initDialogInfo (dialogId)
	{
		var dialogInfo = this.__generateDialogInfo(dialogId);

		this._dialogsInfos[dialogId] = dialogInfo;

		return dialogInfo;
	}

	__generateDialogInfo (dialogId)
	{
		var dialogInfo = null;
		switch (dialogId)
		{
			case GameplayDialogsInfo.DIALOG_ID_BATTLEGROUND_COUNT_DOWN:
				dialogInfo = new BattlegroundCountDownDialogInfo(dialogId, -1);
				break;
			default:
				throw new Error (`Unsupported dialog id: ${dialogId}`);
		}
		return dialogInfo;
	}
}

export default GameplayDialogsInfo