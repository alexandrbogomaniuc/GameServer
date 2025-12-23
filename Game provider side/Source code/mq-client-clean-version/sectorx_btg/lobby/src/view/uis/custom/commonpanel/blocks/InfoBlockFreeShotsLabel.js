import GUSLobbyCPanelInfoBlockFreeShotsLabel from '../../../../../../../../common/PIXI/src/dgphoenix/gunified/view/uis/commonpanel/blocks/GUSLobbyCPanelInfoBlockFreeShotsLabel';
import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';

class InfoBlockFreeShotsLabel extends GUSLobbyCPanelInfoBlockFreeShotsLabel
{
	get translatableAssetName()
	{
		return APP.isMobile ? "TACommonPanelFreeShotsLabelMobile" : "TACommonPanelFreeShotsLabel";
	}

	get __flareAssetName()
	{
		return "common_panel/flare";
	}

	constructor()
	{
		super();
	}
}

export default InfoBlockFreeShotsLabel;
