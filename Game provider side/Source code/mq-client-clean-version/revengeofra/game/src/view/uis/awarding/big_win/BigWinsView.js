import SimpleUIView from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/SimpleUIView';

class BigWinsView extends SimpleUIView {

	addToContainerIfRequired(aBigWinContainerInfo_obj)
	{
		this._addToContainerIfRequired(aBigWinContainerInfo_obj);
	}

	constructor()
	{
		super();
	}

	_addToContainerIfRequired(aBigWinContainerInfo_obj)
	{
		if (this.parent)
		{
			return;
		}

		aBigWinContainerInfo_obj.container.addChild(this);
		this.zIndex = aBigWinContainerInfo_obj.zIndex;
	}
}

export default BigWinsView;