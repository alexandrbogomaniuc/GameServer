import { Sprite } from "../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display";
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sequence from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { Utils } from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import { FRAME_RATE } from '../../../../../../shared/src/CommonConstants';
import SendWind from './SendWind';

const SENDS_WIND_PROPERTIES = [
	{
		deltaTime: 0,
		alpha: 1,
		position: {
			start: {x: 93, y: -94},
			finish: {x: 1140, y: 412},
			duration: 265 * FRAME_RATE
		},
		rotation: 0
	},
	{
		deltaTime: 199 * FRAME_RATE,
		alpha: 0.9,
		position: {
			start: {x: -265, y: 159},
			finish: {x: 950, y: 627},
			duration: 265 * FRAME_RATE
		},
		rotation: 7
	},
	{
		deltaTime: 229 * FRAME_RATE,
		alpha: 0.9,
		position: {
			start: {x: -365, y: 269},
			finish: {x: 850, y: 700},
			duration: 265 * FRAME_RATE
		},
		rotation: 12
	}
];

class Map4FXAnimation extends Sprite
{
	startAnimation()
	{
		this._startAnimation();
	}

	constructor()
	{
		super();
		
		this._fFlare_spr = null;
		this._fSendWinds_sw_arr = [];
		this._fFinishedSend_int = 0;

		this._createView();
	}

	_createView()
	{
		this._mainContainer.container.addChild(this);
		this.zIndex = this._mainContainer.zIndex;

		this._addFlare();
	}

	get _mainContainer()
	{
		return APP.currentWindow.gameField.mapFXAnimationContainer;
	}

	_addFlare()
	{
		this._fFlare_spr = this.addChild(APP.library.getSprite("maps/fx/flare"));
		this._fFlare_spr.position.set(234, 215);
		this._fFlare_spr.blendMode = PIXI.BLEND_MODES.ADD;
	}

	_startAnimation()
	{
		this._startFlareAnimation();
		this._startSendAnimation();
	}

	_startFlareAnimation()
	{
		let lValue_num = Utils.random(0, 25) / 100;
		let lNewAlpha = this._fFlare_spr.alpha - lValue_num;

		let lAlpha_seq = [
			{tweens: [{prop: 'alpha', to: lNewAlpha}],		duration: 5*FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}],				duration: 5*FRAME_RATE , onfinish: ()=>this._restartFlareAnimation()},
		];

		Sequence.start(this._fFlare_spr, lAlpha_seq);
	}

	_restartFlareAnimation()
	{
		if (this._fFlare_spr)
		{
			Sequence.destroy(Sequence.findByTarget(this._fFlare_spr));
			this._startFlareAnimation();
		}
	}

	_startSendAnimation()
	{
		for (let i = 0; i < SENDS_WIND_PROPERTIES.length; i++)
		{
			let lSendProperties_obj = SENDS_WIND_PROPERTIES[i];
			let lSend_sw = this.addChild(new SendWind());
			lSend_sw.position = lSendProperties_obj.position.start;
			lSend_sw.rotation = Utils.gradToRad(lSendProperties_obj.rotation);

			let lPos_seq = [
				{tweens: [],																																		duration: lSendProperties_obj.deltaTime, onfinish: ()=>{lSend_sw.startAnimation();}},
				{tweens: [{prop: 'position.x', to: lSendProperties_obj.position.finish.x},	{prop: 'position.y', to: lSendProperties_obj.position.finish.y}],		duration: lSendProperties_obj.position.duration, onfinish: ()=>this._tryToResetSendsAnimation()}
			];

			Sequence.start(lSend_sw, lPos_seq);

			this._fSendWinds_sw_arr.push(lSend_sw);
		}
	}

	_tryToResetSendsAnimation()
	{
		this._fFinishedSend_int++;
		if(SENDS_WIND_PROPERTIES.length == this._fFinishedSend_int)
		{
			this._destroySendWinds();
			this._fFinishedSend_int = 0;
			this._startSendAnimation();
		}
	}

	_destroySendWinds()
	{
		while (this._fSendWinds_sw_arr.length > 0)
		{
			let l_sw = this._fSendWinds_sw_arr.pop();
			Sequence.destroy(Sequence.findByTarget(l_sw));
			l_sw.destroy();
		}
		this._fSendWinds_sw_arr = [];
	}

	destroy()
	{
		this.parent && this.parent.removeChild(this);
		if (this._fFlare_spr)
		{
			Sequence.destroy(Sequence.findByTarget(this._fFlare_spr));
		}
		this._fFlare_spr = null;
		this._destroySendWinds();
		this._fSendWinds_sw_arr = null;
		this._fFinishedSend_int = null;

		super.destroy();
	}
}

export default Map4FXAnimation;