import { Sprite } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import TextField from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/TextField';
import { APP } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { WEAPONS } from '../../../../../../../../shared/src/CommonConstants';
import I18 from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
import { Filters } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Filters';

const ITEM_WIDTH = 117;
const ITEM_HEIGHT = 73;

class WeaponsFrameItem extends Sprite
{
	set ammoAmount(aValue_num)
	{
		this._fAmmo_num = aValue_num;
		this._update();
	}

	get id()
	{
		return this._fId_num;
	}

	constructor(aWeaponId_num)
	{
		super();

		this._fId_num = aWeaponId_num;

		this._fAmmo_num = null;

		this._fDisableBack_gr = null;
		this._fGun_sprt = null;
		this._fCaption_ta = null;
		this._fAmmoText_tf = null;

		this._fGrayFilter_f = null;
		this._fDisabledView_sprt = null;

		this._initItem(aWeaponId_num);
		this._setDisabled();
	}

	_initItem(aWeaponId_num)
	{
		let lBack_gr = this.addChild(new PIXI.Graphics());
		lBack_gr.beginFill(0x252525).drawRoundedRect(-ITEM_WIDTH/2, -ITEM_HEIGHT/2, ITEM_WIDTH, ITEM_HEIGHT, 4).endFill();
		
		let lborderWidth_int = APP.isMobile ? 2 : 1; 
		let lDisabledW_num = ITEM_WIDTH - lborderWidth_int;
		let lDisabledH_num = ITEM_HEIGHT - lborderWidth_int;
		this._fDisableBack_gr = this.addChild(new PIXI.Graphics());
		this._fDisableBack_gr.beginFill(0x000000).drawRoundedRect(-lDisabledW_num/2, -lDisabledH_num/2, lDisabledW_num, lDisabledH_num, 4).endFill();

		let lImageAsset_obj = this._getImageAsset(aWeaponId_num);
		this._fGun_sprt = this.addChild(APP.library.getSprite(lImageAsset_obj.src));
		this._fGun_sprt.position.set(lImageAsset_obj.x, lImageAsset_obj.y);

		let lTextAsset_str = this._getCaptionAsset(aWeaponId_num);
		this._fCaption_ta = this.addChild(I18.generateNewCTranslatableAsset(lTextAsset_str));
		this._fCaption_ta.position.set(-54, -32);

		this._fAmmoText_tf = this.addChild(new TextField(this._ammoStyle));
		this._fAmmoText_tf.position.set(56, -28);
		this._fAmmoText_tf.anchor.set(1, 0.5);
		this._fAmmoText_tf.maxWidth = 26;
		this._fAmmoText_tf.text = "0";
	}

	_getCaptionAsset(aWeaponId_num)
	{
		switch(aWeaponId_num)
		{
			case WEAPONS.ARTILLERYSTRIKE:	return "TAPlayerCollectionScreenWeaponsFrameArtilleryCaption";
			case WEAPONS.INSTAKILL:			return "TAPlayerCollectionScreenWeaponsFramePlasmaCaption";
			case WEAPONS.CRYOGUN:			return "TAPlayerCollectionScreenWeaponsFrameCryogunCaption";
			case WEAPONS.MINELAUNCHER:		return "TAPlayerCollectionScreenWeaponsFrameMineCaption";
			case WEAPONS.RAILGUN:			return "TAPlayerCollectionScreenWeaponsFrameFlameCaption";
			case WEAPONS.FLAMETHROWER:		return "TAPlayerCollectionScreenWeaponsFrameFlameCaption";
		}
	}

	_getImageAsset(aWeaponId_num)
	{
		switch(aWeaponId_num)
		{
			case WEAPONS.ARTILLERYSTRIKE:	return {src: "quests/weapons/artillery",		x: 0,	y: 10};
			case WEAPONS.INSTAKILL:			return {src: "quests/weapons/plasma_gun",		x: 0,	y: 8};
			case WEAPONS.CRYOGUN:			return {src: "quests/weapons/cryo_gun",			x: 0,	y: 10};
			case WEAPONS.MINELAUNCHER:		return {src: "quests/weapons/mine_launcher",	x: 0,	y: 14};
			case WEAPONS.RAILGUN:			return {src: "quests/weapons/railgun",			x: 0,	y: 10};
			case WEAPONS.FLAMETHROWER:		return {src: "quests/weapons/flamethrower",		x: 6,	y: 10};
		}
	}

	get _ammoStyle()
	{
		return {
			fontFamily: "fnt_nm_barlow_semibold",
			fontSize: 10,
			align: "right",
			fill: 0x464646
		};
	}

	_update()
	{
		if (this._fAmmo_num > 0)
		{
			this._setEnabled();
		}
		else
		{
			this._setDisabled();
		}

		this._fAmmoText_tf.text = +this._fAmmo_num;
	}

	_setDisabled()
	{
		this._fDisableBack_gr.visible = true;
		Object.assign(this._fAmmoText_tf.style, {fill: 0x464646});

		let lPrevScaleX_num = this._fCaption_ta.assetContent.scale.x;
		let lPrevScaleY_num = this._fCaption_ta.assetContent.scale.y;
		Object.assign(this._fCaption_ta.assetContent.style, {fill: 0x464646});
		this._fCaption_ta.assetContent.refresh();
		this._fCaption_ta.assetContent.scale.x = lPrevScaleX_num;
		this._fCaption_ta.assetContent.scale.y = lPrevScaleY_num;

		this.addChild(this._disabledView);
		this._disabledView.position.set(this._fGun_sprt.x, this._fGun_sprt.y);
		this._disabledView.scale.set(this._fGun_sprt.scale.x);
		this._disabledView.visible = true;
		this._disabledView.alpha = 0.5;
		this._fGun_sprt.visible = false;
	}

	_setEnabled()
	{
		if (this._fDisabledView_sprt)
		{
			this._fDisabledView_sprt.visible = false;
		}

		this._fDisableBack_gr.visible = false;
		Object.assign(this._fAmmoText_tf.style, {fill: 0xfc980d});

		let lPrevScaleX_num = this._fCaption_ta.assetContent.scale.x;
		let lPrevScaleY_num = this._fCaption_ta.assetContent.scale.y;
		Object.assign(this._fCaption_ta.assetContent.style, {fill: 0xffffff});
		this._fCaption_ta.assetContent.refresh();
		this._fCaption_ta.assetContent.scale.x = lPrevScaleX_num;
		this._fCaption_ta.assetContent.scale.y = lPrevScaleY_num;

		this._fGun_sprt.visible = true;
	}

	//DISABLED_VIEW...
	get _disabledView()
	{
		return this._fDisabledView_sprt || (this._fDisabledView_sprt = this._initDisabledView());
	}

	_initDisabledView()
	{
		switch (APP.stage.renderer.type)
		{
			case PIXI.RENDERER_TYPE.WEBGL:	return this._initWebGLDisabledView();
			case PIXI.RENDERER_TYPE.CANVAS:	return this._initCanvasDisabledView();
		}

		throw new Error (`${APP.stage.renderer.type} is unknown renderer type`);
		
	}

	_initCanvasDisabledView()
	{
		if (APP.stage.isWebglContextLost)
		{
			return new Sprite();
		}

		this._fGun_sprt.anchor.set(0, 0);

		let lCanvas_cnvs = APP.stage.renderer.plugins.extract.canvas(this._fGun_sprt);
		let lPixelData_obj = Filters.getPixelsFromCanvas(lCanvas_cnvs);
		var idata = Filters.grayscale(lPixelData_obj);

		let c = Filters.getCanvas(idata.width, idata.height);
		var ctx = c.getContext('2d');
		ctx.putImageData(idata, 0, 0);
		let texture = PIXI.Texture.from(c, {scaleMode: PIXI.SCALE_MODES.NEAREST});
		let sprt = new Sprite();
		sprt.textures = [texture];

		this._fGun_sprt.anchor.set(0.5, 0.5);

		return sprt;
	}

	_initWebGLDisabledView()
	{
		if (APP.stage.isWebglContextLost)
		{
			return new Sprite();
		}
		
		this._fGun_sprt.filters = [this._grayFilter]
		let lCanvas_cnvs = APP.stage.renderer.plugins.extract.canvas(this._fGun_sprt);
		let texture = PIXI.Texture.from(lCanvas_cnvs);
		this._fGun_sprt.filters = null;
		let sprt = new Sprite();
		sprt.textures = [texture];
		return sprt;
	}

	get _grayFilter()
	{
		return this._fGrayFilter_f || (this._fGrayFilter_f = this._initGrayFilter());
	}

	_initGrayFilter()
	{
		/*let colorMatrix = [
				//R  G  B  A
				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1
			];*/
		let filter = new PIXI.filters.ColorMatrixFilter();
		/*filter.matrix = colorMatrix;
		filter.resolution = 3;*/
		filter.greyscale(0.3, false);
		return filter;
	}
	//...DISABLED_VIEW

	destroy()
	{
		super.destroy();

		this._fId_num = undefined;

		this._fAmmo_num = undefined;

		this._fDisableBack_gr = undefined;
		this._fGun_sprt = undefined;
		this._fCaption_ta = undefined;
		this._fAmmoText_tf = undefined;

		this._fGrayFilter_f = undefined;
		this._fDisabledView_sprt = undefined;
	}
}

export default WeaponsFrameItem;