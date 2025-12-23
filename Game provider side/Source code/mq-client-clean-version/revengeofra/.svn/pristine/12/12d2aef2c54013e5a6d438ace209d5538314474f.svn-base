import LobbyPreloaderLogoView from './preloader/LobbyPreloaderLogoView'
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { Z_INDEXES } from './preloader/LobbyPreloaderLogoView';

class LobbyLogoView extends LobbyPreloaderLogoView
{
	constructor()
	{
		super();
	}

	_addLogo()
	{
		let logoShadow = this.addChild(APP.library.getSprite("lobby/logo_shadow"));
		logoShadow.zIndex = Z_INDEXES.SHADOW;

		super._addLogo();
	}

	get _smokeAlpha()
	{
		return 0.2;
	}
}

export default LobbyLogoView;