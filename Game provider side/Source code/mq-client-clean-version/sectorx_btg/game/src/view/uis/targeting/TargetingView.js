import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import SimpleUIView from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/SimpleUIView';

class TargetingView extends SimpleUIView
{

	constructor()
	{
		super();
		this._fCrosshairs_c = null;
	}

	addToContainerIfRequired(targetingContainerInfo)
	{
		if (this.parent || !targetingContainerInfo || !targetingContainerInfo.container)
		{
			return;
		}

		targetingContainerInfo.container.addChild(this);
		this.zIndex = targetingContainerInfo.zIndex;
	}

	updateCrosshair(aOptRedrawRequired_bl=false)
	{
		this.crosshairs.visible = Boolean(aOptRedrawRequired_bl);
	}

	get crosshairs()
	{
		return this._fCrosshairs_c || this._initCrosshairs();
	}

	_initCrosshairs()
	{
		return (this._fCrosshairs_c = this.addChild(APP.library.getSprite('TargetCrosshair_RED')));
	}	

	destroy()
	{
		this._fCrosshairs_c && this._fCrosshairs_c.destroy();
		this._fCrosshairs_c = null;

		super.destroy();

	}
}

export default TargetingView
