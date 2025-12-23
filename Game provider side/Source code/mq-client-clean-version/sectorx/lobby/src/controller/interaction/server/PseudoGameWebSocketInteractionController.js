import GUSPseudoGameWebSocketInteractionController from '../../../../../../common/PIXI/src/dgphoenix/gunified/controller/interaction/server/GUSPseudoGameWebSocketInteractionController';
import { PseudoGameWebSocketInteractionInfo } from '../../../model/interaction/server/PseudoGameWebSocketInteractionInfo';

class PseudoGameWebSocketInteractionController extends GUSPseudoGameWebSocketInteractionController
{
	constructor(aOptInfo_si)
	{
		super(aOptInfo_si || new PseudoGameWebSocketInteractionInfo());
	}
}

export default PseudoGameWebSocketInteractionController