import WizardTeleportFx from './WizardTeleportFx';
import AtlasConfig from './../../../../config/AtlasConfig';
import { AtlasSprite } from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';

let _teleport_textures = null;
function _generateTeleportTextures()
{
	if (_teleport_textures) return

	_teleport_textures = AtlasSprite.getFrames([APP.library.getAsset("enemies/wizards/purple/teleport0"), APP.library.getAsset("enemies/wizards/purple/teleport1")], [AtlasConfig.PurpleTeleport0, AtlasConfig.PurpleTeleport1], "");
}

let _smoke_textures = null;
function _generateSmokeTextures()
{
	if (_smoke_textures) return

	_smoke_textures = AtlasSprite.getFrames([APP.library.getAsset("enemies/wizards/purple/smoke")], [AtlasConfig.PurpleSmoke], "");
}

class PurpleWizardTeleportFx extends WizardTeleportFx
{
	constructor()
	{
		super();

		_generateTeleportTextures();
		APP.profilingController.info.isVfxProfileValueMediumOrGreater && _generateSmokeTextures();
	}

	//override
	_getMainAnimationPosition()
	{
		return {x: 90, y: -80};
	}

	//override
	_getTeleportTextures()
	{
		return _teleport_textures;
	}

	//override
	_getSmokeTextures()
	{
		return _smoke_textures;
	}

	//override
	_getGlowSrc()
	{
		return "enemies/wizards/purple/glow";
	}

	destroy()
	{
		super.destroy();
	}
}

export default PurpleWizardTeleportFx;