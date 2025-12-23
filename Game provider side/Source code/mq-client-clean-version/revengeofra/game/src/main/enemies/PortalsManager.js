import PortalAnimation from '../../view/uis/enemies/portal/PortalAnimation';
import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Timer from '../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';

const CLOSE_PORTAL_DELAY = 1000;

class PortalsManager
{
	constructor()
	{
 		this._gameScreen = APP.currentWindow;
 		this._gameField = this._gameScreen.gameField;

 		this._closePortalTimer = null;

		this._portals = {};
		this._timers = [];
	}

	tryToOpenPortal(enemyId, points, portalId)
	{
		if (!this._portals[portalId])
		{
			this._portals[portalId] = { enemiesCount: 0, portal: null };

			let portal = this._portals[portalId].portal = this._gameField.screen.addChild(new PortalAnimation(portalId));

			portal.zIndex = points[1].y - 20;
			portal.setFixedPosition(points[1]);

			if (points[0].x < points[1].x)
			{
				portal.scale.x = -1;
			}

			portal.startIntroAnimation();
		}
		
		this._portals[portalId].enemiesCount++;
	}

	getMask(portalId, enemyId)
	{
		return this._portals[portalId].portal.getEnemyMask(enemyId);
	}

	tryToClosePortal(portalId, enemyId)
	{
		if (this._portals[portalId])
		{
			var portal = this._portals[portalId];
			
			portal.portal.disableMask(enemyId);
			portal.enemiesCount--;

			if (portal.enemiesCount === 0)
			{
				portal.portal.startOutroAnimation();
				portal.portal.once(PortalAnimation.EVENT_ON_PORTAL_DESTROYED, this._onSomePortalDestroyed, this);
			}
		}
	}

	destroyPortalIfRequired(portalId)
	{
		if (portalId && this._portals[portalId])
		{
			this._portals[portalId].portal.destroy();
		}
	}

	_onSomePortalDestroyed(e)
	{
		delete this._portals[e.id];
	}

	getPortalById(portalId)
	{
		if (this._portals[portalId])
		{
			return this._portals[portalId].portal;
		}

		return null;
	}

	destroy()
	{
		for (var key in this._portals)
		{
			this._portals[key].portal.destroy();
			delete this._portals[key];
		}
	}
}

export default PortalsManager;