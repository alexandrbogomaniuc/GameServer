import GUSLobbyTournamentModeController from '../../../../../../common/PIXI/src/dgphoenix/gunified/controller/custom/tournament/GUSLobbyTournamentModeController';
import TournamentModeInfo from '../../../model/custom/tournament/TournamentModeInfo';

class TournamentModeController extends GUSLobbyTournamentModeController 
{
	constructor(aOptInfo) 
	{
		super(aOptInfo || new TournamentModeInfo());
	}
}

export default TournamentModeController