import SimpleUIView from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/SimpleUIView';
import { StringUtils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import TorchFxAnimation from '../../../main/animation/TorchFxAnimation';
import { Sprite } from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';

const MAP_SCALE = 1.026;
const MAPS_PATH_BACK = 'maps/#level#/back_#level#';
const MAPS_PATH_WALL = 'maps/#level#/decoration_#level#_#index#';
const MAPS_DESCRIPTION = {
	"1":
	{
		"walls": 
		{
			"0":
			{
				"x": 430 / 2 / 2,
				"y": 789 / 2 / 2,
				"zIndex": 608 / 2
			},
			"1":
			{
				"x": 672 / 2 + 178 + 147.5 / 2,
				"y": 184.5 / 2,
				"zIndex": 244/2
			},
			"2":
			{
				"x": 960 - 160.5 / 2,
				"y": 376.5 / 2,
				"zIndex": 350/2
			}
		}
 	},
	"2":
	{
		"walls":
		{
			"0":
			{
				"x": 960 - 318 / 2,
				"y": 540 - 194 / 2,
				"zIndex": 2000/2
			}
		}
 	},
 	"3":
	{
		"walls": 
		{
			"0":
			{
				"x": 67.5 / 2,
				"y": 133 / 2 + 319 / 2,
				"zIndex": 580/2
			},
			"1":
			{
				"x": 166.5 / 2,
				"y": 213 / 2,
				"zIndex": 270/2
			},
			"2":
			{
				"x": 960 - 77.5 / 2,
				"y": 204.5 / 2 + 10,
				"zIndex": 280/2
			}
		}
	}
}

class MapsView extends SimpleUIView 
{
	constructor()
	{
		super();

		this._fMapId_int = undefined;

		this._fBack_sprt = undefined;
		this._fWalls_sprt_arr = [];
		this._fTorches_sprt_arr = [];
		this._fTintedObjects_sprt_arr = [];
	}

	//PUBLIC...

	/*draw or redraw map*/
	i_drawMap(aMapId_int)
	{
		if(aMapId_int === this._fMapId_int)
		{
			return;
		}
		
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

		this._fWalls_sprt_arr = [];
		let lWallsNumber_int = Object.keys(lMap_obj.walls).length;

		for (let i=0; i<lWallsNumber_int; i++)
		{
			let lWall_obj = lMap_obj.walls[i];
			let lWallPath_str = StringUtils.replaceAll(MAPS_PATH_WALL, '#level#', this._fMapId_int);
			lWallPath_str = StringUtils.replaceAll(lWallPath_str, '#index#', i);
			
			let lWall_sprt = this._wallsContainer.addChild(APP.library.getSprite(lWallPath_str));
			lWall_sprt.position.set(lWall_obj.x * lMapScale_num - dx/2, lWall_obj.y * lMapScale_num - dy/2);
			lWall_sprt.zIndex = lWall_obj.zIndex * lMapScale_num;
			lWall_sprt.scale.set(lMapScale_num);
			// lWall_sprt.tint = 0x0ff000;
			this._fWalls_sprt_arr.push(lWall_sprt);

			let lTintedWall_sprt = lWall_sprt.clone();
			lTintedWall_sprt.tint = 0x000000;
			lTintedWall_sprt.alpha = 0;
			lTintedWall_sprt.visible = false;
			this._fTintedObjects_sprt_arr.push(this._wallsContainer.addChild(lTintedWall_sprt));
		}

		if (lMap_obj.torches)
		{
			TorchFxAnimation.initTextures();
			
			this._fTorches_sprt_arr = [];
			let lTorchesNumber_int = Object.keys(lMap_obj.torches).length;
			
			for (let i=0; i<lTorchesNumber_int; i++)
			{
				let lTorch_obj = lMap_obj.torches[i];
				let lTorch_sprt = this._torchesContainer.addChild(new Sprite);
				lTorch_sprt.textures = TorchFxAnimation.textures.torch;
				lTorch_sprt.zIndex = lTorch_obj.zIndex * lMapScale_num;
				lTorch_sprt.position.set(lTorch_obj.x * lMapScale_num - dx/2, lTorch_obj.y * lMapScale_num - dy/2);
				
				let torchScaleX = lTorch_obj.scaleX !== undefined ? lTorch_obj.scaleX : lTorch_obj.scale !== undefined ? lTorch_obj.scale : 1;
				let torchScaleY = lTorch_obj.scaleY !== undefined ? lTorch_obj.scaleY : lTorch_obj.scale !== undefined ? lTorch_obj.scale : 1;
				let torchRotation = lTorch_obj.rotation !== undefined ? lTorch_obj.rotation : 0;

				lTorch_sprt.scale.set(torchScaleX * lMapScale_num, torchScaleY * lMapScale_num);
				lTorch_sprt.rotation = torchRotation;
				lTorch_sprt.blendMode = PIXI.BLEND_MODES.ADD;
				lTorch_sprt.play();
				this._fTorches_sprt_arr.push(lTorch_sprt);
			}
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
		// g.position.set(-960/2, -540/2);
		// this._backContainer.addChild(g);
		//...DEBUG
	}

	i_destroyMap()
	{
		this._fBack_sprt && this._fBack_sprt.destroy();
		this._fBack_sprt = null;

		while (this._fWalls_sprt_arr.length > 0)
		{
			this._fWalls_sprt_arr.pop().destroy();
		}
		this._fWalls_sprt_arr = null;

		while (this._fTorches_sprt_arr && this._fTorches_sprt_arr.length > 0)
		{
			this._fTorches_sprt_arr.pop().destroy();
		}
		this._fTorches_sprt_arr = null;

		while (this._fTintedObjects_sprt_arr.length > 0)
		{
			this._fTintedObjects_sprt_arr.pop().destroy();
		}
		this._fTintedObjects_sprt_arr = null;

		this._fMapFxAnimation_obj && this._fMapFxAnimation_obj.destroy();
		this._fMapFxAnimation_obj = null;
	}

	setTintedView(aVisible_bl, aDuration_int = 0)
	{
		let lTintedObjectsAmount_int = this._fTintedObjects_sprt_arr.length;
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
	get _backContainer ()
	{
		return APP.currentWindow.gameField.mapContainers.backContainer;
	}

	get _wallsContainer ()
	{
		return APP.currentWindow.gameField.mapContainers.wallsContainer;
	}

	get _torchesContainer ()
	{
		return APP.currentWindow.gameField.mapContainers.torchesContainer;
	}
	//...PRIVATE

}

export default MapsView;