import GUPreloaderSoundButtonView from '../../../../../../../common/PIXI/src/dgphoenix/gunified/view/uis/preloader/GUPreloaderSoundButtonView';
import Button from '../../../../ui/GameButton';

class GamePreloaderSoundButtonView extends GUPreloaderSoundButtonView
{
	constructor() 
	{
		super();
	}

	__provideOnButtonInstance()
	{
		let lButtonState_btn = this.addChild(new Button(this.__onButtonAssetName, undefined, true));
		lButtonState_btn.position.set(0.5, -0.5);

		return lButtonState_btn
	}

	get __onButtonAssetName()
	{
		return "common_btn_sound_on";
	}

	__provideOffButtonInstance()
	{
		let lButtonState_btn = this.addChild(new Button(this.__offButtonAssetName, undefined, true));
		lButtonState_btn.position.set(0.5, -0.5);

		return lButtonState_btn
	}

	get __offButtonAssetName()
	{
		return "common_btn_sound_off";
	}
}

export default GamePreloaderSoundButtonView;