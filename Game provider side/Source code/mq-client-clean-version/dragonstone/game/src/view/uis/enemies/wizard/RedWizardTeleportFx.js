import WizardTeleportFx from './WizardTeleportFx';
import AtlasConfig from './../../../../config/AtlasConfig';
import { AtlasSprite } from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';

let _teleport_textures = null;
function _generateTeleportTextures()
{
	if (_teleport_textures) return

	_teleport_textures = AtlasSprite.getFrames([APP.library.getAsset("enemies/wizards/red/teleport0"), APP.library.getAsset("enemies/wizards/red/teleport1")], [AtlasConfig.RedTeleport0, AtlasConfig.RedTeleport1], "");
}

let _smoke_textures = null;
function _generateSmokeTextures()
{
	if (_smoke_textures) return

	_smoke_textures = AtlasSprite.getFrames([APP.library.getAsset("enemies/wizards/red/smoke")], [AtlasConfig.RedSmoke], "");
}

class RedWizardTeleportFx extends WizardTeleportFx
{
	constructor()
	{
		super();

		_generateTeleportTextures();
		APP.profilingController.info.isVfxProfileValueMediumOrGreater && _generateSmokeTextures();
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
		return "enemies/wizards/red/glow";
	}

	destroy()
	{
		super.destroy();
	}
}

export default RedWizardTeleportFx;