import GameplayDialogView from '../GameplayDialogView';
import I18 from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import AlignDescriptor from '../../../../../../../../common/PIXI/src/dgphoenix/unified/model/display/align/AlignDescriptor';
import TextField from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/TextField';
import Sprite from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import ActiveGameDialogButton from './ActiveGameDialogButton';
import BattlegroundCountDownView from './BattlegroundCountDownView';

class BattlegroundCountDownDialogView extends GameplayDialogView
{
	constructor()
	{
		super();
	}

	//INIT VIEW...
	_initDialogView()
	{
		super._initDialogView();

		let lCenterX = 0;
		let lCenterY = 0;

		this._baseContainer.position.set(lCenterX, lCenterY);
		this._messageContainer.position.set(lCenterX - 8, lCenterY + 15);
	}
	
	_addDialogBase()
	{
		this._fBackContainer_sprt = this.addChild(APP.library.getSprite("gameplay_dialogs/battleground/count_down/count_down_frame"));
		this._baseContainer.addChild(this._fBackContainer_sprt);

		//LOGO...
		let logo = I18.generateNewCTranslatableAsset("TABattlegroundRoundResultLogo");
		logo.position.set(-1, -113);
		this._messageContainer.addChild(logo);
		//...LOGO

		//TEXTS...
		let msg = I18.generateNewCTranslatableAsset("TABattlegroundWaitingPlayers");
		msg.position.set(8, -48);
		this._messageContainer.addChild(msg);
		//...TEXTS

		//COUNTER...
		let l_bcdv = new BattlegroundCountDownView();
		l_bcdv.position.set(1, 14);
		
		this._baseContainer.addChild(l_bcdv);
		this._fCounter = l_bcdv;
		//...COUNTER
	}

	updateTimeIndicator(aTimeLeft_str)
	{
		this._fCounter.applyValue(aTimeLeft_str);
	}

	__retreiveDialogButtonViewInstance (aIntId_int)
	{
		let lButton_btn;
		switch (aIntId_int)
		{
			case 0:
				lButton_btn = new ActiveGameDialogButton("gameplay_dialogs/battleground/close_button", undefined, undefined, undefined, ActiveGameDialogButton.BUTTON_TYPE_CANCEL);
				lButton_btn.isCancelButton = true;
				break;
			default:
				throw new Error (`Unsupported button id: ${aIntId_int}`);
		}
		return lButton_btn;
	}

	_alignButtonView (aIntButtonId_int, aButtonsCount_int, aButtonView_domdb)
	{
		var lXOffset_num = 0;
		var lYOffset_num = 0;

		switch (aIntButtonId_int)
		{
			case 0:
				lXOffset_num = lXOffset_num + 205;
				lYOffset_num = lYOffset_num - 150;
				break;
		}

		aButtonView_domdb.position.set(lXOffset_num, lYOffset_num);
	}
	//...INIT VIEW

	_deactivateCancelButton()
	{
		if(this.cancelButton)
		{
			this.cancelButton.enabled = false;
			this.cancelButton.alpha = 0.3;
		}
	}

	_activateCancelButton()
	{
		if(this.cancelButton)
		{
			this.cancelButton.enabled = true;
			this.cancelButton.alpha = 1;
		}
	}

	get _supportedButtonsCount ()
	{
		return 1;
	}
}

export default BattlegroundCountDownDialogView;