import SimpleUIView from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/SimpleUIView';
import CloudsPool from './CloudsPool';
import { FRAME_RATE } from '../../../../../shared/src/CommonConstants';
import { Tween } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';

const HALF_PI = Math.PI / 2;

const CLOUD_POOLS_DESCRIPTORS =
[
	{
		x: 0.5,
		y: 1.1,
		angle: 0,
		scale: 1.25,
		alpha:  0.5
	},
	{
		x: 0.5,
		y: 0.25,
		angle: 0,
		scale: 1,
		alpha: 0.25,
	},
	{
		x: 0,
		y: 0.5,
		angle: HALF_PI,
		scale: 2,
		alpha: 1,
	},
	{
		x: 1,
		y: 0.5,
		angle: -HALF_PI,
		scale: 2,
		alpha: 1,
	}
]

class TransitionView extends SimpleUIView
{
	static get EVENT_ON_TRANSITION_INTRO_COMPLETED() { return "EVENT_ON_TRANSITION_INTRO_COMPLETED"; }

	initOnScreen(containerInfo)
	{
		containerInfo.container.addChild(this);

		this.zIndex = containerInfo.zIndex;
		this.position.set(-480, -270); //-960/2, -540/2
	}

	constructor()
	{
		super();

		this._fStateId_int = undefined;
		this._fFramesCount_num = 0;
		this._fCloudsPools_cp_arr = [];
		this._fIsNeedEventOnTransitionIntroCompleted_bl = null;

		this._fOverlay_g = this.addChild(new PIXI.Graphics());
		this._fOverlay_g.beginFill(0x888888).drawRect(0, 0, 960, 540).endFill();
		this._fOverlay_g.alpha = 0;

		for (let lDescriptor_obj of CLOUD_POOLS_DESCRIPTORS)
		{
			let lCloudsPool_cp = this.addChild(new CloudsPool());
			lCloudsPool_cp.position.set(lDescriptor_obj.x * 960, lDescriptor_obj.y * 540);
			lCloudsPool_cp.scale.set(lDescriptor_obj.scale);
			lCloudsPool_cp.alpha = lDescriptor_obj.alpha;
			lCloudsPool_cp.rotation = lDescriptor_obj.angle;

			this._fCloudsPools_cp_arr.push(lCloudsPool_cp); 
		}

		/*
		//DEBUG...
		let l_html = window.document.createElement('div');

		l_html.id = "ID1";
		l_html.style.color = "white";
		l_html.style.position = "absolute";
		l_html.style.left = "0px";
		l_html.style.top = "0px";
		l_html.style.margin = "10px";
		l_html.style.width = "100px";
		l_html.style.height = "100px";
		l_html.style["background-color"] = "#7e5ad1";
		l_html.style["z-index"] = "999";

		l_html.style["text-align"] = "center";
		l_html.style["vertical-align"] = "middle";
		l_html.style["line-height"] = "100px";
		l_html.style["font-family"] = "calibri";
		l_html.style["font-weight"] = "bold";
		l_html.style["font-size"] = "80px";
		l_html.style["border-radius"] = "20px";
		l_html.style["cursor"] = "pointer";
		l_html.style["opacity"] = "1";

		l_html.innerText = "I";

		l_html.addEventListener("click", this.setIntroState.bind(this));

		document.body.appendChild(l_html);

		l_html = window.document.createElement('div');
		l_html.id = "ID2";
		l_html.style.color = "white";
		l_html.style.position = "absolute";
		l_html.style.left = "110px";
		l_html.style.top = "0px";
		l_html.style.margin = "10px";
		l_html.style.width = "100px";
		l_html.style.height = "100px";
		l_html.style["background-color"] = "#7e5ad1";
		l_html.style["z-index"] = "999";

		l_html.style["text-align"] = "center";
		l_html.style["vertical-align"] = "middle";
		l_html.style["line-height"] = "100px";
		l_html.style["font-family"] = "calibri";
		l_html.style["font-weight"] = "bold";
		l_html.style["font-size"] = "80px";
		l_html.style["border-radius"] = "20px";
		l_html.style["cursor"] = "pointer";
		l_html.style["opacity"] = "1";

		l_html.innerText = "T";

		l_html.addEventListener("click", this.setThickenState.bind(this));

		document.body.appendChild(l_html);

		l_html = window.document.createElement('div');
		l_html.id = "ID3";
		l_html.style.color = "white";
		l_html.style.position = "absolute";
		l_html.style.left = "220px";
		l_html.style.top = "0px";
		l_html.style.margin = "10px";
		l_html.style.width = "100px";
		l_html.style.height = "100px";
		l_html.style["background-color"] = "#7e5ad1";
		l_html.style["z-index"] = "999";

		l_html.style["text-align"] = "center";
		l_html.style["vertical-align"] = "middle";
		l_html.style["line-height"] = "100px";
		l_html.style["font-family"] = "calibri";
		l_html.style["font-weight"] = "bold";
		l_html.style["font-size"] = "80px";
		l_html.style["border-radius"] = "20px";
		l_html.style["cursor"] = "pointer";
		l_html.style["opacity"] = "1";

		l_html.innerText = "L";
		l_html.addEventListener("click", this.setLoopState.bind(this));
		document.body.appendChild(l_html);


		l_html = window.document.createElement('div');
		l_html.id = "ID4";
		l_html.style.color = "white";
		l_html.style.position = "absolute";
		l_html.style.left = "330px";
		l_html.style.top = "0px";
		l_html.style.margin = "10px";
		l_html.style.width = "100px";
		l_html.style.height = "100px";
		l_html.style["background-color"] = "#7e5ad1";
		l_html.style["z-index"] = "999";

		l_html.style["text-align"] = "center";
		l_html.style["vertical-align"] = "middle";
		l_html.style["line-height"] = "100px";
		l_html.style["font-family"] = "calibri";
		l_html.style["font-weight"] = "bold";
		l_html.style["font-size"] = "80px";
		l_html.style["border-radius"] = "20px";
		l_html.style["cursor"] = "pointer";
		l_html.style["opacity"] = "1";

		l_html.innerText = "O";
		l_html.addEventListener("click", this.setOutroState.bind(this));
		document.body.appendChild(l_html);
		//...DEBUG
		*/
	
		this.drop();
	}

	setInvalidState()
	{
		this._fIsNeedEventOnTransitionIntroCompleted_bl = false;
		this.drop();
	}

	setIntroState()
	{
		this._fIsNeedEventOnTransitionIntroCompleted_bl = true;
		this._fOverlay_g.alpha = 0;
		this.drop();

		this._startOverlayAlphaAnimation(0.6, 26*FRAME_RATE, this._tryToCompleteIntroState.bind(this), 20*FRAME_RATE);
		this._setCloudsLoopMode(true);
		this.show();
	}

	setThickenState()
	{
		this._startOverlayAlphaAnimation(1, 36*FRAME_RATE, this._tryToCompleteIntroState.bind(this));
		this._setCloudsLoopMode(true);
		this.show();
	}

	setLoopState()
	{
		this._setCloudsLoopMode(true);
		this._fOverlay_g.alpha = 1;
		this.show();
	}

	setOutroState()
	{
		this._fFramesCount_num = 0;
		this._setCloudsLoopMode(false);
		this.show();

		this._startOverlayAlphaAnimation(0, 100*FRAME_RATE, this._tryToCompleteOutroState.bind(this));
	}

	_setCloudsLoopMode(aIsLoop_bl)
	{
		this._fCloudsPools_cp_arr.forEach(cp => cp.setLoopMode(aIsLoop_bl));
	}

	_startOverlayAlphaAnimation(aEndValue_num, aDuration_num, aCallback_fn, aOptDelay_num=0)
	{
		if (this._fOverlay_g.alpha === aEndValue_num)
		{
			aCallback_fn.call();
		}
		else
		{
			let lAlphaTween_t = new Tween(this._fOverlay_g, "alpha", this._fOverlay_g.alpha, aEndValue_num, aDuration_num, undefined, undefined, aOptDelay_num);
			lAlphaTween_t.on(Tween.EVENT_ON_FINISHED, aCallback_fn, this);
			lAlphaTween_t.play();
		}
	}

	_tryToCompleteIntroState()
	{
		if (this._fIsNeedEventOnTransitionIntroCompleted_bl)
		{
			this._fIsNeedEventOnTransitionIntroCompleted_bl = false;
			this.emit(TransitionView.EVENT_ON_TRANSITION_INTRO_COMPLETED);
		}
	}

	_tryToCompleteOutroState()
	{
		if(!this._isVisible())
		{
			this.setInvalidState();
		}
	}

	_isVisible()
	{
		return this._fOverlay_g.alpha > 0 || this._fCloudsPools_cp_arr.every(cp => cp.isVisible());
	}

	drop()
	{
		this._fOverlay_g.alpha = 0;
		this._fFramesCount_num = 0;

		Tween.destroy(Tween.findByTarget(this._fOverlay_g));

		this._fCloudsPools_cp_arr.forEach(cp => cp.drop());
		this.hide();
	}

	destroy()
	{
		this._fOverlay_g.destroy();
		this._fCloudsPools_cp_arr.forEach(cp => cp.destroy());
		this._fCloudsPools_cp_arr = null;
		this._fIsNeedEventOnTransitionIntroCompleted_bl = null;

		super.destroy();
	}
}

export default TransitionView;