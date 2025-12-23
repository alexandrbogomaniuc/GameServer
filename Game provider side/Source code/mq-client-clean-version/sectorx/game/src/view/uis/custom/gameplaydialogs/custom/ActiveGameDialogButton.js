import GameDialogButton from './GameDialogButton';

class ActiveGameDialogButton extends GameDialogButton
{
	constructor(aBaseAssetActiveName_str, aCaptionId_str, noDefaultSound, anchorPoint, buttonType, isNeedButtonStyleUpdateOnHandle)
	{
		super(aBaseAssetActiveName_str, aBaseAssetActiveName_str, aCaptionId_str, noDefaultSound, anchorPoint, buttonType, isNeedButtonStyleUpdateOnHandle);

		this.handleOver();
	}

	_getBtnTextDectiveStyle()
	{
		return this._getBtnTextActiveStyle();
	}
}

export default ActiveGameDialogButton