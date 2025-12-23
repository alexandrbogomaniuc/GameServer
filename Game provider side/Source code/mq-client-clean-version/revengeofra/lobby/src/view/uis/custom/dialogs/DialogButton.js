import Button from '../../../../ui/LobbyButton';
import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';

class DialogButton extends Button
{
	static get BUTTON_ID_OK() {return "btn_ok"}
	static get BUTTON_ID_CANCEL() {return "btn_cancel"}
	static get BUTTON_ID_CUSTOM() {return "btn_custom"}

	constructor()
	{
		super("preloader/dialogs/btn_base", undefined, true);

		this._isDown = false;
		this._glow = null;
		this._buttonId = undefined;

		this.applyRoundedCornersHitArea();
	}

	set buttonId (value)
	{
		this._buttonId = value;

		switch (this._buttonId)
		{
			case DialogButton.BUTTON_ID_OK:
				{
					this.setOKCaption();
					break;
				}
			case DialogButton.BUTTON_ID_CANCEL:
				{
					this.setCancelCaption();
					break;
				}
			case DialogButton.BUTTON_ID_CUSTOM:
				{
					// no default caption
					break;
				}
			default:
				{
					throw new Error(`Unsupported button ID: ${value}`);
				}
		}
	}

	get buttonId ()
	{
		return this._buttonId;
	}

	get isOkButton ()
	{
		return this._buttonId == DialogButton.BUTTON_ID_OK;
	}

	get isCancelButton ()
	{
		return this._buttonId == DialogButton.BUTTON_ID_CANCEL;
	}

	get isCustomButton ()
	{
		return this._buttonId == DialogButton.BUTTON_ID_CUSTOM;
	}

	setOKCaption()
	{
		this.captionId = "TADialogButtonOK";
	}

	setCancelCaption()
	{
		this.captionId = "TADialogButtonCancel";
	}

	setBuyInCaption()
	{
		this.captionId = "TADialogButtonBuyIn";
	}

	setRefreshCaption()
	{
		this.captionId = "TADialogButtonRefresh";
	}

	setCopyCaption()
	{
		this.captionId = "TADialogButtonCopy";
	}

	setRetryCaption()
	{
		this.captionId = "TADialogButtonRetry";
	}

	setExitCaption()
	{
		this.captionId = "TADialogButtonExit";
	}

	setYesCaption()
	{
		this.captionId = "TADialogButtonYes";
	}

	setNoCaption()
	{
		this.captionId = "TADialogButtonNo";
	}

	handleDown(e)
	{
		super.handleDown(e);

		this._isDown = true;

		this.updateBase('preloader/dialogs/btn_down_base');
		this._updateCaptionColor(0xcc6600);
		this._hideGlow();
	}

	handleUpOutside(e)
	{
		super.handleUpOutside(e);
		this._updateCaptionColor(0xffffff);
	}

	handleUp(e)
	{
		super.handleUp(e);

		this._isDown = false;

		this.updateBase('preloader/dialogs/btn_base');
		this._updateCaptionColor(0xffcc00);
	}

	handleOver(e)
	{
		super.handleOver(e);

		if (!this._isDown)
		{
			this._updateCaptionColor(0xffcc00);

			this._showGlow();
		}
	}

	handleOut(e)
	{
		super.handleOut(e);

		if (!this._isDown)
		{
			this._updateCaptionColor(0xffffff);
		}
	}

	_updateCaptionColor(color)
	{
		if (!this.captionTf)
		{
			return;
		}

		this.captionTf.tint = color;
	}

	_showGlow()
	{
		if (!this._glow)
		{
			this._glow = new Sprite();

			let glowGraphics = new PIXI.Graphics();
			glowGraphics.beginFill(0xffffcc, 0.6);
			glowGraphics.drawRoundedRect(-37, -12, 74, 24, 12);
			glowGraphics.endFill();
			this._glow.addChild(glowGraphics);

			this.addChildAt(this._glow, 0);
		}

		this._glow.scale.set(1);
		this._glow.alpha = 1;

		this._glow.scaleXTo(1.35, 300);
		this._glow.scaleYTo(1.6, 300);
		this._glow.fadeTo(0, 500);
	}

	_hideGlow()
	{
		if (!this._glow)
		{
			return;
		}

		this._glow.removeTweens();
		this._glow.scale.set(1);
		this._glow.alpha = 1;
	}
}

export default DialogButton