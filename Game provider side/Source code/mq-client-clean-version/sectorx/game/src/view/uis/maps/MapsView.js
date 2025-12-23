import SimpleUIView from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/SimpleUIView';
import { StringUtils, Utils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { Tween } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import { FRAME_RATE } from '../../../../../shared/src/CommonConstants';
import { AtlasSprite, Sprite } from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import AtlasConfig from '../../../config/AtlasConfig';
import { ShockwaveFilter } from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Filters';

const MAP_SCALE = 1.026;
const MAPS_PATH_BACK = 'maps/#level#/back_#level#';
const MAPS_PATH_DECORATION = 'maps/#level#/decoration_#level#_#index#';
const MAPS_DESCRIPTION = {
	"1": {},
	"2": {},
	"3": {},
	"4": {}
}
const FROZEN_MAP_PATH = 'maps/#level#/frozen';

let ice_land_animation_textures = null;
function generate_ice_land_animation_textures()
{
	if (!ice_land_animation_textures)
	{
		ice_land_animation_textures = AtlasSprite.getFrames([APP.library.getAsset("enemies/ice_boss/ice_land_animation")], [AtlasConfig.IceLandAnimation], "");
	}
	return ice_land_animation_textures;
}


class MapsView extends SimpleUIView 
{
	constructor()
	{
		super();

		this._fMapId_int = undefined;

		this._fBack_sprt = undefined;
		this._fDecorations_sprt_arr = [];
		this._fTintedObjects_sprt_arr = [];
		this._fFrozenBack_sprt = undefined;
	}

	//PUBLIC...
	i_freeze(aOptSkipAnimation_bl=false)
	{
		if (this._fFrozenBack_sprt || !this._fMapId_int && this._fMapId_int !== 0)
		{
			return;
		}

		let lPath_str = StringUtils.replaceAll(FROZEN_MAP_PATH, '#level#', this._fMapId_int);
		this._fFrozenBack_sprt = this._backContainer.addChild(APP.library.getSprite(lPath_str));
		this._fFrozenBack_sprt.zIndex = 1;
		let lAddedFrozenPart_spr = this._fFrozenBack_sprt.addChild(APP.library.getSprite("maps/frozen_add"));
		lAddedFrozenPart_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lAddedFrozenPart_spr.alpha = 0.7;
		lAddedFrozenPart_spr.scale.set(2*MAP_SCALE);
		this._fFrozenBack_sprt.scale.set(MAP_SCALE);

		if (!aOptSkipAnimation_bl)
		{
			this._fFrozenBack_sprt.alpha = 0;
			let lAlphaTween_t = new Tween(this._fFrozenBack_sprt, "alpha", 0, 1, 15*FRAME_RATE)
			lAlphaTween_t.play();
		}

	}

	i_unfreeze(aOptSkipAnimation_bl=false)
	{
		if (aOptSkipAnimation_bl || !this._fFrozenBack_sprt)
		{
			this._destroyFrozenView();
		}
		else
		{
			let lAlphaTween_t = new Tween(this._fFrozenBack_sprt, "alpha", 1, 0, 15*FRAME_RATE);
			lAlphaTween_t.on(Tween.EVENT_ON_FINISHED, this._destroyFrozenView, this);
			lAlphaTween_t.play();
		}
	}

	i_addIceBossFreezeEffect()
	{
		if (!this._fIceBossFreezeEffect_spr_arr)
		{
			this._fIceBossFreezeEffect_spr_arr = [];
		}

		if (Array.isArray(this._fIceBossFreezeEffect_spr_arr) && this._fIceBossFreezeEffect_spr_arr.length > 0)
		{
			const FREEZE_EFFECTS_POSITIONS = [
				{x: 0, y: 0},
				{x: 145, y: -55},
				{x: 145, y: 85},
				{x: 255, y: 35},
				{x: 45, y: -55},
				{x: 37, y: 123},
				{x: -57, y: 123},
				{x: -37, y: -77},
				{x: -15, y: 90},
				{x: -145, y: 0},
				{x: -205, y: 50},
				{x: 130, y: 27},
			];

			for (let lPosition_obj of FREEZE_EFFECTS_POSITIONS)
			{
				let l_spr = this._backContainer.addChild(new Sprite());
				l_spr.textures = generate_ice_land_animation_textures();
				l_spr.scale.set(1.5);
				l_spr.position = lPosition_obj;
				l_spr.zIndex = 2;

				this._fIceBossFreezeEffect_spr_arr.push(l_spr);
			}
		}
		else
		{
			let lFirst_spr = this._backContainer.addChild(new Sprite());
			lFirst_spr.textures = generate_ice_land_animation_textures();
			lFirst_spr.scale.set(1.5);
			lFirst_spr.alpha = 0;
			lFirst_spr.zIndex = 2;
			lFirst_spr.position.set(0, 10);

			let lFirstAlphaTween_t = new Tween(lFirst_spr, "alpha", 0, 1, 9*FRAME_RATE);
			lFirstAlphaTween_t.play();
			this._fIceBossFreezeEffect_spr_arr.push(lFirst_spr);
			
			let lSecond_spr = this._backContainer.addChild(new Sprite());
			lSecond_spr.textures = generate_ice_land_animation_textures();
			lSecond_spr.scale.set(1.5);
			lSecond_spr.alpha = 0;
			lSecond_spr.zIndex = 2;
			lSecond_spr.position.set(0, 50);

			let lSecondAlphaTween_t = new Tween(lSecond_spr, "alpha", 0, 1, 18*FRAME_RATE);
			lSecondAlphaTween_t.play();
			this._fIceBossFreezeEffect_spr_arr.push(lSecond_spr);
		}
	}

	i_hideIceBossFreezeEffect()
	{
		if (this._fIceBossFreezeEffect_spr_arr && Array.isArray(this._fIceBossFreezeEffect_spr_arr))
		{
			for (let l_spr of this._fIceBossFreezeEffect_spr_arr)
			{
				if (l_spr)
				{
					if (Math.random() > 0.5)
					{
						let lAlphaTween_t = new Tween(l_spr, "alpha", 1, 0, 19*FRAME_RATE);
						lAlphaTween_t.on(Tween.EVENT_ON_FINISHED, this._tryToDestroyIceBossFreezeEffects.bind(this));
						lAlphaTween_t.play();
					}
					else
					{
						l_spr.on('animationend', ()=>{
							l_spr.destroy();
							this._tryToDestroyIceBossFreezeEffects();
						});
						l_spr.play();
					}
				}
			}
		}
	}

	/**
	 * draw or redraw map
	 * @param aMapId_int map id
	 */
	i_drawMap(aMapId_int)
	{
		this.i_destroyMap();

		this._fMapId_int = aMapId_int;

		let lMap_obj = MAPS_DESCRIPTION[this._fMapId_int];
		let lMapScale_num = MAP_SCALE;

		let lBackPath_str = StringUtils.replaceAll(MAPS_PATH_BACK, '#level#', this._fMapId_int);
		this._fBack_sprt = this._backContainer.addChild(APP.library.getSprite(lBackPath_str));
		let dx = this._fBack_sprt.width * (lMapScale_num - 1);
		let dy = this._fBack_sprt.height * (lMapScale_num - 1);
		this._fBack_sprt.scale.set(lMapScale_num);

		this._fTintedObjects_sprt_arr = this._fTintedObjects_sprt_arr || [];

		this._fDecorations_sprt_arr = [];
		let lDecorationsNumber_int = lMap_obj.decoration ? Object.keys(lMap_obj.decoration).length : 0;

		for (let i = 0; i < lDecorationsNumber_int; i++)
		{
			let lDecoration_obj = lMap_obj.decoration[i];
			let lDecorationPath_str = StringUtils.replaceAll(MAPS_PATH_DECORATION, '#level#', this._fMapId_int);
			lDecorationPath_str = StringUtils.replaceAll(lDecorationPath_str, '#index#', i);

			let lDecoration_sprt = this._decorationsContainer.addChild(APP.library.getSprite(lDecorationPath_str));
			lDecoration_sprt.position.set(lDecoration_obj.x * lMapScale_num - dx / 2, lDecoration_obj.y * lMapScale_num - dy / 2);
			lDecoration_sprt.zIndex = lDecoration_obj.zIndex * lMapScale_num;
			lDecoration_sprt.scale.set(lMapScale_num);
			this._fDecorations_sprt_arr.push(lDecoration_sprt);

			let lTintedDecoration_sprt = lDecoration_sprt.clone();
			lTintedDecoration_sprt.tint = 0x000000;
			lTintedDecoration_sprt.alpha = 0;
			lTintedDecoration_sprt.visible = false;
			this._fTintedObjects_sprt_arr.push(this._decorationsContainer.addChild(lTintedDecoration_sprt));
		}
		
		if (this.uiInfo.isFrozen)
		{
			this.i_freeze(true);
		}


		//DEBUG...
		// let polygon = this.uiInfo.currentMapWalkingZone;
		// let g = new PIXI.Graphics();
		// g.beginFill(0xff0000, 0.6);
		// console.log("[Y] DrawPolygon >> ", polygon);
		// g.drawPolygon(polygon);
		// // g.drawRect(0, 0, 400, 500);
		// // g.drawPolygon(0, 259, 286, 139, 593, 153);
		// g.endFill();
		// g.zIndex = 1000000;
		// g.position.set(-960 / 2, -540 / 2);
		// this._backContainer.addChild(g);
		//...DEBUG
	}

	i_destroyMap()
	{
		this._destroyIceBossFreezeEffects();

		this._fBack_sprt && this._fBack_sprt.destroy();
		this._fBack_sprt = null;
		
		this._destroyFrozenView();

		while (this._fDecorations_sprt_arr && Array.isArray(this._fDecorations_sprt_arr) && this._fDecorations_sprt_arr.length > 0)
		{
			this._fDecorations_sprt_arr.pop().destroy();
		}
		this._fDecorations_sprt_arr = null;

		while (this._fTintedObjects_sprt_arr && Array.isArray(this._fTintedObjects_sprt_arr) && this._fTintedObjects_sprt_arr.length > 0)
		{
			this._fTintedObjects_sprt_arr.pop().destroy();
		}
		this._fTintedObjects_sprt_arr = null;
	}

	setTintedView(aVisible_bl, aDuration_int = 0)
	{
		let lTintedObjectsAmount_int = Array.isArray(this._fTintedObjects_sprt_arr) ? this._fTintedObjects_sprt_arr.length : 0;
		for (var i = 0; i < lTintedObjectsAmount_int; i++)
		{
			let lAlpha_num = aVisible_bl ? (i > 0 ? 0.4 : 1) : 0;
			let lObject_sprt = this._fTintedObjects_sprt_arr[i];

			if (aDuration_int > 0)
			{
				if (aVisible_bl)
				{
					lObject_sprt.visible = true;
					lObject_sprt.fadeTo(lAlpha_num, aDuration_int);
				}
				else
				{
					lObject_sprt.fadeTo(lAlpha_num, aDuration_int, null, this.hideTintedObject.bind(this, lObject_sprt, i));
				}
			}
			else
			{
				lObject_sprt.visible = aVisible_bl;
				lObject_sprt.alpha = lAlpha_num;
			}
		}
	}

	hideTintedObject(aObject_sprt)
	{
		aObject_sprt.visible = false;
	}

	destroy()
	{
		this.i_destroyMap();

		this._fMapId_int = undefined;

		this._fBack_sprt = undefined;
		this._fDecorations_sprt_arr = null;
		this._fTintedObjects_sprt_arr = null;

		super.destroy();
	}
	//...PUBLIC

	//PRIVATE...
	_destroyFrozenView()
	{
		Tween.destroy(Tween.findByTarget(this._fFrozenBack_sprt));
		this._fFrozenBack_sprt && this._fFrozenBack_sprt.destroy();
		this._fFrozenBack_sprt = null;
	}

	_tryToDestroyIceBossFreezeEffects()
	{
		if (this._fIceBossFreezeEffect_spr_arr && Array.isArray(this._fIceBossFreezeEffect_spr_arr))
		{
			for (let l_spr of this._fIceBossFreezeEffect_spr_arr)
			{
				if (Tween.findByTarget(l_spr).length > 0)
				{
					return;
				}
			}
		}
		this._destroyIceBossFreezeEffects();
	}

	_destroyIceBossFreezeEffects()
	{
		if (this._fIceBossFreezeEffect_spr_arr && Array.isArray(this._fIceBossFreezeEffect_spr_arr))
		{
			for (let l_spr of this._fIceBossFreezeEffect_spr_arr)
			{
				Tween.destroy(Tween.findByTarget(l_spr));
				l_spr && l_spr.destroy();
			}
		}
		this._fIceBossFreezeEffect_spr_arr = null;
	}

	get _backContainer()
	{
		return APP.currentWindow.gameFieldController.mapContainers.backContainer;
	}

	get _decorationsContainer()
	{
		return APP.currentWindow.gameFieldController.mapContainers.decorationsContainer;
	}
	//...PRIVATE
}

export default MapsView;