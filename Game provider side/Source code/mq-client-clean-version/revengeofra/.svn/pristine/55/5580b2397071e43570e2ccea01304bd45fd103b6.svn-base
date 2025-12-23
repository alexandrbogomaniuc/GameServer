import { Sprite } from "../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display";
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../../shared/src/CommonConstants';
import Sequence from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { Utils } from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';

const SENDS_PROPERTIES = [
	{
		name: "maps/fx/sand_0",
		position: {x: 0, y: 0},
		scale: {x: 0.61, y: 0.59},
		rotation: 100
	},
	{
		name: "maps/fx/sand_1",
		position: {x: 80, y: -24},
		scale: {x: 0.61, y: 0.59},
		rotation: 90
	},
	{
		name: "maps/fx/sand_2",
		position: {x: 138, y: 18},
		scale: {x: 0.61, y: 0.59},
		rotation: 120
	},
	{
		name: "maps/fx/sand_3",
		position: {x: -87, y: -23},
		scale: {x: 0.61, y: 0.59},
		rotation: 151
	}
];

class SendWind extends Sprite
{
	startAnimation()
	{
		this._startAnimation();
	}

	constructor()
	{
		super();

		this._fSand_spr_arr = [];
		this._fFinishedSendScaleWiggle_int = 0;

		this._initView();
	}

	_initView()
	{
		for (let i = 0; i < SENDS_PROPERTIES.length; i++)
		{
			let lSendProreties_obj = SENDS_PROPERTIES[i];
			let lSend_spr = this.addChild(APP.library.getSprite(lSendProreties_obj.name));
			lSend_spr.blendMode = PIXI.BLEND_MODES.SCREEN;
			lSend_spr.position = lSendProreties_obj.position;
			lSend_spr.rotation = Utils.gradToRad(0);
			lSend_spr.scale.set(lSendProreties_obj.scale.x, lSendProreties_obj.scale.y);
			
			this._fSand_spr_arr.push(lSend_spr);
		}
	}

	_startAnimation()
	{
		this._startRotationAnimation();
		this._startScaleWiggleAnimation();
	}

	_startRotationAnimation()
	{
		for (let i = 0; i < this._fSand_spr_arr.length; i++)
		{
			let lSendProreties_obj = SENDS_PROPERTIES[i];
			let lAngle_seq = [
				{tweens: [{prop: 'rotation', to: Utils.gradToRad(lSendProreties_obj.rotation)}],		duration: 303 * FRAME_RATE},
			];

			Sequence.start(this._fSand_spr_arr[i], lAngle_seq);
		}
	}

	_startScaleWiggleAnimation()
	{
		for (let i = 0; i < this._fSand_spr_arr.length; i++)
		{
			let lSendProreties_obj = SENDS_PROPERTIES[i];
			let lValue_num = Utils.random(0, 13) / 100;
			let lNewScaleY_num = this._fSand_spr_arr[i].scale.x - lValue_num;

			let lScale_seq = [
				{tweens: [{prop: 'scale.y', to: lNewScaleY_num}],					duration: 15*FRAME_RATE},
				{tweens: [{prop: 'scale.y', to: lSendProreties_obj.scale.y}],		duration: 15*FRAME_RATE, onfinish: ()=>this._tryToResetScaleWiggleAnimation()}
			];

			Sequence.start(this._fSand_spr_arr[i], lScale_seq);
		}
	}

	_tryToResetScaleWiggleAnimation()
	{
		this._fFinishedSendScaleWiggle_int++;
		if(SENDS_PROPERTIES.length == this._fFinishedSendScaleWiggle_int)
		{
			this._fFinishedSendScaleWiggle_int = 0;
			this._startScaleWiggleAnimation();
		}
	}

	_destroySends()
	{
		while (this._fSand_spr_arr.length > 0)
		{
			let l_sw = this._fSand_spr_arr.pop();
			Sequence.destroy(Sequence.findByTarget(l_sw));
			l_sw.destroy();
		}
		this._fSand_spr_arr = [];
	}

	destroy()
	{
		this._destroySends();
		this._fSand_spr_arr = null;
		this._fFinishedSendScaleWiggle_int = null;

		super.destroy();
	}
}

export default SendWind;