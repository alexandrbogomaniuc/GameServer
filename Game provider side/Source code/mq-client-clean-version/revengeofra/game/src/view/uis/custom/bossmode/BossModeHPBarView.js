import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import I18 from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
import { ENEMIES } from '../../../../../../shared/src/CommonConstants';
import SimpleUIView from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/SimpleUIView';
import Sprite from './../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import TextField from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/TextField';

class BossModeHPBarView extends SimpleUIView
{
	static get BOSS_CAPTIONS()
	{
		return {
			Anubis:		"TABossModeAnubisCaption",
			Osiris:		"TABossModeOsirisCaption",
			Thoth:		"TABossModeThothCaption"
		};
	}

	update()
	{
		this._update();
	}

	//INIT...
	constructor()
	{
		super();

		this._fBarContainer_sprt = null;
		this._fProgressBar_sprt = null;
		this._fNameCaption_ta = null;
		this._fHealthValue_tf = null;
	}

	__init()
	{
		super.__init();

		this._initBar();
	}

	_initBar()
	{
		this._fBarContainer_sprt = this.addChild(new Sprite());

		this._fBarContainer_sprt.addChild(APP.library.getSprite("boss_mode/hp_bar/back"));

		const lBar_sprt = APP.library.getSprite("boss_mode/hp_bar/bar");
		this._fProgressBar_sprt = this._fBarContainer_sprt.addChild(lBar_sprt);
		this._fProgressBar_sprt.position.set(0.5, 179.5 - 33);
		this._fProgressBar_sprt.anchor.set(0.5, 1);
		//this._fProgressBar_sprt.tint = 0x3fffff;

		//this._fBarContainer_sprt.scale.y = 0.87;
	}

	_initHealthTextField()
	{
		let lStyle_obj = {
			fontFamily: "fnt_nm_barlow_bold",
			fontSize: 15,
			align: "center",
			letterSpacing: 0.5,
			padding: 5,
			fill: 0xfb8b0c
		};

		let lHealthValue_tf = this.addChild(new TextField(lStyle_obj));
		lHealthValue_tf.maxWidth = 50;
		lHealthValue_tf.anchor.set(0.5, 0.5);
		lHealthValue_tf.position.set(0, -179.5 + 15);

		return lHealthValue_tf;
	}

	get _healthValueTextField()
	{
		return this._fHealthValue_tf || (this._fHealthValue_tf = this._initHealthTextField());
	}

	_update()
	{
		this._updateBar();
		this._updateName();
	}

	_updateBar()
	{
		let lCurrentHealth_num = this.uiInfo.currentHealth;
		let lFullHealth_num = this.uiInfo.fullHealth;
		let lProgress_num = lCurrentHealth_num / lFullHealth_num;

		/*if (lProgress_num < 0.25) this._fProgressBar_sprt.tint = 0xff0067;
		else if (lProgress_num < 0.5) this._fProgressBar_sprt.tint = 0xffffff;
		else this._fProgressBar_sprt.tint = 0x00ffff;*/

		this._fProgressBar_sprt.scale.y = lProgress_num;

		this._healthValueTextField.text = Math.floor(lCurrentHealth_num);
	}

	_updateName()
	{
		if (this._fNameCaption_ta) return;

		let lName_str = this.uiInfo.name;

		this._fNameCaption_ta = this.addChild(I18.generateNewCTranslatableAsset(this._getBossId(lName_str)));
		this._fNameCaption_ta.position.set(0, 162);
	}

	_getBossId(aBossName_str)
	{
		let lCaptions_obj = BossModeHPBarView.BOSS_CAPTIONS;

		switch (aBossName_str)
		{
			case ENEMIES.Anubis:	return lCaptions_obj.Anubis;
			case ENEMIES.Osiris:	return lCaptions_obj.Osiris;
			case ENEMIES.Thoth:		return lCaptions_obj.Thoth;
		}
	}

	destroy()
	{
		super.destroy();

		this._fBarContainer_sprt = null;
		this._fProgressBar_sprt = null;
		this._fNameCaption_ta = null;
		this._fHealthValue_tf = null;
	}
}

export default BossModeHPBarView;