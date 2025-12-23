import Sprite from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import Spinner from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/custom/Spinner';
import {easeIn as easing} from '../../../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing/cubic';

class PlayerCollectionWaitScreenView extends Sprite
{
	startAnimation()
	{
		this._spinner.startAnimation();
	}

	stopAnimation()
	{
		this._spinner.stopAnimation();
	}

	constructor()
	{
		super();

		this._fSpinnerView_s = null;

		this.interactive = true;

		this._initBack();
	}

	_initBack()
	{
		let lBack_gr = this.addChild(new PIXI.Graphics());
		lBack_gr.beginFill(0x000000, 0.4).drawRoundedRect(-178, -170, 552, 300, 5).endFill();
	}

	get _spinner()
	{
		if (!this._fSpinnerView_s)
		{
			this._fSpinnerView_s = this.addChild(new Spinner(1750, 40, 1, easing));
			this._fSpinnerView_s.position.set(98, 6);
		}

		return this._fSpinnerView_s;
	}

	destroy()
	{
		this._fSpinnerView_s && this._fSpinnerView_s.destroy();
		this._fSpinnerView_s = null;

		super.destroy();
	}
}

export default PlayerCollectionWaitScreenView