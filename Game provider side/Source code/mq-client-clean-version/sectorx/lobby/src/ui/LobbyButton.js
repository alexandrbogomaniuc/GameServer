import Button from '../../../../common/PIXI/src/dgphoenix/unified/view/ui/Button';
import { APP } from '../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';

class LobbyButton extends Button
{
	constructor(baseAssetName, captionId, cursorPointer, noDefaultSound, anchorPoint, buttonType)
	{
		super(baseAssetName, captionId, cursorPointer, noDefaultSound, anchorPoint, buttonType);
	}

	_tryPlaySound()
	{
		if (!this.noDefaultSound && APP.soundsController)
		{
			let soundName = "";

			switch (this._buttonType)
			{
				case Button.BUTTON_TYPE_ACCEPT:
					soundName = "mq_gui_button_generic_ui";
				break;
				case Button.BUTTON_TYPE_CANCEL:
					soundName = "mq_gui_button_generic_ui";
				break;
				case Button.BUTTON_TYPE_COMMON:
				default:
					soundName = "mq_gui_button_generic_ui";
				break;
			}

			APP.soundsController.play && APP.soundsController.play(soundName);
		}
	}

	_initGrayFilter()
	{
	let colorMatrix = [
		//R  G  B  A
		0, 0, 0, 0,
		0, 0, 0, 0,
		0, 0, 0, 0,
		0, 0, 0, 0
	];
	let filter = new PIXI.filters.ColorMatrixFilter();
	filter.matrix = colorMatrix;
	filter.resolution = 2;
	filter.alpha = 0.67;
	filter.blur = 10;
	return filter;
	}

}

export default LobbyButton