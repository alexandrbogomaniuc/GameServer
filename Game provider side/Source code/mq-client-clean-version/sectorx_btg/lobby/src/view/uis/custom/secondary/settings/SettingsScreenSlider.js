import GUSettingsScreenSlider from '../../../../../../../../common/PIXI/src/dgphoenix/gunified/view/uis/secondary/settings/GUSettingsScreenSlider';

class SettingsScreenSlider extends GUSettingsScreenSlider 
{
	constructor(aMin, aMax, aVal)
	{
		super(aMin, aMax, aVal);
	}

	get __backAssetName()
	{
		return "settings/slider_back";
	}

	get __barAssetName()
	{
		return "settings/bar";
	}

	get __startMoveSoundName()
	{
		return "mq_gui_slider";
	}
}

export default SettingsScreenSlider;