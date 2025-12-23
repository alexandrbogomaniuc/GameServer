import { Sprite } from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import EmblemRim from './EmblemRim';

class WeaponSidebarIconEmblemDefault extends Sprite {

	constructor()
	{
		super();
		this._fBg_sprt = null;
		this._fBody_sprt = null;
		this._fRim_er = null;
		this._initView();
	}

	show()
	{
		if (this.visible) return;
		super.show();
		this._invalidateRim();
	}

	hide()
	{
		if (!this.visible) return;
		super.hide();
		this._invalidateRim();
	}

	_initView()
	{
		this._fBg_sprt = this.addChild(APP.library.getSprite("weapons/sidebar/back_to_default_emblem_bg"));
		this._fBg_sprt.anchor.set(55.5/128, 57.5/128);

		this._fRim_er = this.addChild(new EmblemRim());
		this._invalidateRim();

		this._fBody_sprt = this.addChild(APP.library.getSprite("weapons/sidebar/back_to_default_emblem"));
		this._fBody_sprt.position.x = 2;
		this._fBody_sprt.position.y = -3;
	}

	_invalidateRim()
	{
		if (!this._fRim_er) return;

		if (this.visible)
		{
			this._fRim_er.i_activate();
		}
		else
		{
			this._fRim_er.i_deactivate();
		}
	}

	destroy()
	{
		super.destroy();
	}
}

export default WeaponSidebarIconEmblemDefault;