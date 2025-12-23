import Sprite from '../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import PointerSprite from '../../../../../common/PIXI/src/dgphoenix/unified/view/ui/PointerSprite';
import { GREYSCALE_FILTER } from '../../config/Constants';
import { Utils } from '../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import { FRAME_RATE } from '../../../../shared/src/CommonConstants';
import Sequence from '../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';

class PlayerSpotTurretButton extends PointerSprite
{
	set enabled(aValue_bl)
	{
		if (aValue_bl)
		{
			this.setEnabled();
		}
		else
		{
			this.setDisabled();
		}
	}

	get enabled()
	{
		return !!this.interactive;
	}

	set active(aValue_bl)
	{
		if (this._fIsActive_bl != aValue_bl)
		{
			this._fIsActive_bl = aValue_bl;

			this._invalidateBoby();
		}
	}

	get active()
	{
		return this._fIsActive_bl;
	}

	updateView()
	{
		this._invalidateBoby();
	}

	constructor()
	{
		super();

		this._fIsActive_bl = false;
		this._fBody_sprt = null;
		this._fDisappearSeq = null;

		this._init();
	}

	_init()
	{
		this.addChild(APP.library.getSpriteFromAtlas("player_spot/ps_player_spot/turret_btn_base"));

		this._fBody_sprt = this.addChild(new Sprite);

		this._initButtonBehaviour();

		this._invalidateBoby();
	}

	_initButtonBehaviour()
	{
		this.setHitArea(new PIXI.Circle(0, 0, 22));
		this.setEnabled();

		this.on("pointerdown", (e)=>e.stopPropagation(), this);
	}

	setEnabled()
	{
		super.setEnabled();

		this.filters = null;
	}

	setDisabled()
	{
		super.setDisabled();

		this.filters = [GREYSCALE_FILTER];
	}

	_invalidateBoby()
	{
		this._fBody_sprt.destroyChildren();
		this._fBody_sprt.rotation = 0;

		if (this._fIsActive_bl || !!this._fDisappearSeq)
		{
			let lBack = this._fBody_sprt.addChild(APP.library.getSpriteFromAtlas("player_spot/ps_player_spot/turret_btn_back"));
			lBack.alpha = 0.85;

			let lBetLevel_num = APP.playerController.info.betLevel;
			let lPlayerInfo_pi = APP.playerController.info;

			let lViewType_int = lPlayerInfo_pi.getTurretSkinId(lPlayerInfo_pi.betLevel);
			let lAssetName_str = "weapons/DefaultGun/turret_"+lViewType_int+"/turret";
			
			let lView = this._fBody_sprt.addChild(APP.library.getSprite(lAssetName_str));
			lView.scale.set(0.4)

			if (lViewType_int == 1)
			{
				lView.anchor.set(0.5, 0.585);
			}

			this._fBody_sprt.rotation = 0.3490658503988659; //Utils.gradToRad(20);
		}
		else
		{
			let lTurretIcon_sprt = this._fBody_sprt.addChild(APP.library.getSprite("player_spot/turret_icon"));

			if (!this.enabled)
			{
				this.setDisabled();
			}
		}
	}

	destroy()
	{
		this._fDisappearSeq = null;

		this._fIsActive_bl = undefined;
		this._fBody_sprt = null;

		super.destroy();
	}
}

export default PlayerSpotTurretButton