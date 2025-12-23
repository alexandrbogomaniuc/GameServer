import GUSLobbyCPanelInfoBlock from '../../../../../../../../common/PIXI/src/dgphoenix/gunified/view/uis/commonpanel/blocks/GUSLobbyCPanelInfoBlock';
import InfoBlockFreeShotsLabel from './InfoBlockFreeShotsLabel';

class InfoBlock extends GUSLobbyCPanelInfoBlock
{

	constructor()
	{
		super();
	}

	__provideInfoBlockFreeShotsLabelInstance()
	{
		return new InfoBlockFreeShotsLabel(); 
	}
}

export default InfoBlock