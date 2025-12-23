import SimpleUIView from '../../../../../common/PIXI/src/dgphoenix/unified/view/base/SimpleUIView';
import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import PreloadingSpinner from '../../../../../common/PIXI/src/dgphoenix/gunified/view/custom/PreloadingSpinner';
import I18 from '../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
import Sprite from '../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';

class SubloadingView extends SimpleUIView {
	
	constructor() {
		super();

		this.waitScreen = null;
		this._fSubloadingContainer_sprt = null;
	}

	i_showLoadingScreen(aSubloadingContainerInfo_obj)
	{
		this._fSubloadingContainer_sprt = aSubloadingContainerInfo_obj.container;
		this._fSubloadingContainer_sprt.addChild(this);

		this.zIndex = aSubloadingContainerInfo_obj.zIndex;

		let backOffsetY_num = ((APP.config.margin.bottom || 0) - (APP.config.margin.top || 0)) / 2;
		this.waitScreen = this.addChild(APP.library.getSprite('preloader/back'));
		this.waitScreen.position.y = backOffsetY_num;

		if (APP.tournamentModeController.info.isTournamentOnServerCompletedState)
		{
			return;
		}

		let lLoadingBase_sprt = this.waitScreen.addChild(APP.library.getSprite('preloader/loading_back'));
		lLoadingBase_sprt.position.set(235, 0);

		let lCaption_cta = this.waitScreen.addChild(I18.generateNewCTranslatableAsset('TAWaitWhileMapIsLoadingCaption'));
		lCaption_cta.position.set(235, 17);

		this.waitScreen.spinner = this.addChild(new PreloadingSpinner(2100, 110));
		this.waitScreen.spinner.position.y = -51;
		this.waitScreen.spinner.position.x = 235;
		this.waitScreen.spinner.startAnimation();
	}

	i_hideLoadingScreen()
	{
		this.parent && this.parent.removeChild(this);
		this.waitScreen && this.waitScreen.destroy();
		this.waitScreen = null;
	}

	get isLoadingScreenShown()
	{
		return (this.waitScreen !== null);
	}

	destroy()
	{
		this.waitScreen = null;
		this._fSubloadingContainer_sprt = null;
		
		super.destroy();
	}
}

export default SubloadingView;