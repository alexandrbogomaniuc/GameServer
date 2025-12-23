import DialogView from '../DialogView';
import I18 from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
//import ActiveGameDialogButton from './game/ActiveGameDialogButton';
import GameDialogButton from './game/GameDialogButton';
import DialogButton from '../DialogButton';

class LobbyInsufficientFundsDialogView extends DialogView
{
	constructor()
	{
		super();
		
	}

	//INIT VIEW...
	_initDialogView()
	{
		super._initDialogView();

		this._baseContainer.position.set(0, 0);
		this._buttonsContainer.position.set(0, 0);
		this._messageContainer.position.set(-8, 15);
	}
	
	_addDialogBase()
	{

		//OVERLAY...
		let lOverlay_g = new PIXI.Graphics();
		lOverlay_g.beginFill(0x000000).drawRect(0, 0, 960, 540).endFill();
		lOverlay_g.alpha = 0.8;;
		lOverlay_g.position.set(-960 / 2, -540 / 2);
		this._baseContainer.addChild(lOverlay_g);
		//...OVERLAY

		//DIALOG BASE...
		let lWidth_num = 250;
		let lHeight_num = 205;

		let lFrame_g = new PIXI.Graphics();
		lFrame_g.beginFill(0xffca13).drawRect(0, 0, lWidth_num, lHeight_num).endFill();
		lFrame_g.position.set(-lWidth_num / 2, -lHeight_num / 2);

		this._baseContainer.addChild(lFrame_g);


		lWidth_num--;
		lHeight_num--;

		let l_g = new PIXI.Graphics();
		l_g.beginFill(0x000000).drawRect(0, 0, lWidth_num, lHeight_num).endFill();
		l_g.position.set(-lWidth_num / 2, -lHeight_num / 2);

		this._baseContainer.addChild(l_g);
		//...DIALOG BASE

	}

	__retreiveDialogButtonViewInstance (aIntId_int)
	{
		let lButton_btn;
		switch (aIntId_int)
		{
			case 0:
				lButton_btn = new GameDialogButton("dialogs/active_btn", "dialogs/deactive_btn", "TADialogButtonOK", undefined, undefined, GameDialogButton.BUTTON_TYPE_ACCEPT);
				lButton_btn.isOkButton = true;
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

		if (aIntButtonId_int === 0 || aIntButtonId_int === 1)
		{
			lYOffset_num = 56;
		}

		aButtonView_domdb.position.set(lXOffset_num, lYOffset_num);
	}
	//...INIT VIEW

	_setMessage(messageId)
	{
		this._messageContainer.destroyChildren();

		let msg = I18.generateNewCTranslatableAsset(messageId);
		msg.position.set(0, -42);
		this._messageContainer.addChild(msg);
	}

	get _supportedButtonsCount ()
	{
		return 1;
	}
}

export default LobbyInsufficientFundsDialogView;