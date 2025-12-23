import GUSLobbySettingsScreenView from '../../../../../../../../common/PIXI/src/dgphoenix/gunified/view/uis/secondary/settings/GUSLobbySettingsScreenView';
import SettingsScreenSlider from './SettingsScreenSlider';
import I18 from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import USwitchButton from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/ui/USwitchButton';
import GUSLobbyGameDialogButton from '../../../../../../../../common/PIXI/src/dgphoenix/gunified/view/uis/dialogs/custom/game/GUSLobbyGameDialogButton';
import GUSLobbyButton from '../../../../../../../../common/PIXI/src/dgphoenix/gunified/view/uis/GUSLobbyButton';

class SettingsScreenView extends GUSLobbySettingsScreenView
{
	constructor()
	{
		super();

		this._init();
	}

	_addBack()
	{
		this.addChild(APP.library.getSprite("settings/back"));

		let lLine_sprt = this.addChild(APP.library.getSprite("dialogs/line"));
		lLine_sprt.position.set(0, 80);
		lLine_sprt.scale.x = 0.73;
	}

	_addTitleCaption()
	{
		let lTitleCaption_ta = this.addChild(I18.generateNewCTranslatableAsset("TASettingsScreenCaption"));
		lTitleCaption_ta.position.set(-145.5, -168);

		let lIcon_sprt = this.addChild(APP.library.getSprite("settings/icon"));
		lIcon_sprt.position.set(-208, -168);
	}

	_addCaptions()
	{
		let lSoundVolumeCaption_ta = this.addChild(I18.generateNewCTranslatableAsset("TASettingsScreenSoundVolumeLabel"));
		lSoundVolumeCaption_ta.position.set(-195, -110);

		let lMusicVolumeCaption_ta = this.addChild(I18.generateNewCTranslatableAsset("TASettingsScreenMusicVolumeLabel"));
		lMusicVolumeCaption_ta.position.set(-195, -55);

		this._fTutorialCaption_ta = this.addChild(I18.generateNewCTranslatableAsset("TASettingsScreenTutorialLabel"));
		this._fTutorialCaption_ta.position.set(-195, 0);
	}

	__provideSoundSliderInstance()
	{
		let l_sss = new SettingsScreenSlider(0, 100, 100);
		l_sss.position.set(100, -110);
		l_sss.scale.x = 0.89;

		return l_sss;
	}

	__provideMusicSliderInstance()
	{
		let l_sss = new SettingsScreenSlider(0, 100, 100);
		l_sss.position.set(100, -55);
		l_sss.scale.x = 0.89;

		return l_sss;
	}

	__provideOkButtonInstance()
	{
		let lOkButton_btn = new GUSLobbyGameDialogButton("dialogs/active_btn", "dialogs/deactive_btn", "TAEditProfileScreenButtonAcceptLabel", undefined, undefined, GUSLobbyGameDialogButton.BUTTON_TYPE_ACCEPT);
		lOkButton_btn.position.set(0, 105);
		return lOkButton_btn;
	}

	__provideCloseButtonInstance()
	{
		let lCloseButton_btn = new GUSLobbyButton("dialogs/exit_btn", null, true, undefined, undefined, GUSLobbyButton.BUTTON_TYPE_CANCEL);
		lCloseButton_btn.position.set(216.5, -168);
		return lCloseButton_btn;
	}

	__provideTutorialToggleInstance()
	{
		let l_sb = new USwitchButton(this._switchBtnProps);
		l_sb.position.set(100, 0);

		return l_sb;
	}

	get _switchBtnProps()
	{
		let lProps_obj = {
			onBlackBtnBaseAssetName: "settings/toggle_button/off_btn",
			onYellowBtnBaseAssetName: "settings/toggle_button/on_btn",
			onCaptionTAssetName: "TASettingsTutorialLabelOn",
			onBtnSoundName: "mq_gui_button_generic_ui",
			onBtnPosition: {x: -51.5, y: 0},
			onBtnScale : {x: -1, y: 1},

			offBlackBtnBaseAssetName: "settings/toggle_button/off_btn",
			offYellowBtnBaseAssetName: "settings/toggle_button/on_btn",
			offCaptionTAssetName: "TASettingsTutorialLabelOff",
			offBtnSoundName: "mq_gui_button_generic_ui",
			offBtnPosition: {x: 51.5, y: 0},
			offBtnScale : {x: 1, y: 1}
		};

		return lProps_obj;
	}

	__provideTimerCaptionInstance()
	{
		let l_ta = I18.generateNewCTranslatableAsset("TASettingsScreenTimer");
		l_ta.position.set(-80, 50);

		return l_ta;
	}

	__provideTimerValueInstance()
	{
		let l_tf = super.__provideTimerValueInstance();
		l_tf.position.set(35, 50-4);

		return l_tf;
	}

	get _timerStyle()
	{
		let lStyle_obj = {
			fontFamily: "fnt_nm_barlow_semibold",
			fontSize: 16,
			align: "left",
			fill: 0xffffff
		};

		return lStyle_obj;
	}

	destroy()
	{
		super.destroy();
	}
}

export default SettingsScreenView;