import InstantKillEffects from '../../InstantKillEffects';
import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import EternalPlazmaSmoke from './EternalPlazmaSmoke';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';

class InstantKillMarker extends Sprite 
{
	constructor(aIsFast_bl = false)
	{
		super();

		this.marker = null;
		this.flare = null;
		this.eternalPlazmaSmoke = null;
		this.indigoSmoke = null;

		InstantKillEffects.getTextures();
		APP.profilingController.info.isVfxProfileValueMediumOrGreater && this.startIndigoSmoke();

		this.marker = this.addChild(new Sprite());

		this.marker.textures = InstantKillEffects['marker'];
		this.marker.blendMode = PIXI.BLEND_MODES.ADD;
		this.marker.scale.set(2);
		this.marker.play();

		this.flare = this.addChild(APP.library.getSprite("weapons/InstantKill/marker_flare"));
		this.flare.blendMode = PIXI.BLEND_MODES.ADD;
		this.flare.scale.set(2);
		this.startFlareRotation();

		this.zIndex = 100000;
		this.scale.set(0.1);
		let duration = aIsFast_bl ? 100 : 500;
		this.scaleTo(0.8, duration);

		if(APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this.eternalPlazmaSmoke = this.addChild(new EternalPlazmaSmoke());
			this.eternalPlazmaSmoke.scale.set(2);
		}
	}

	startFlareRotation()
	{
		this.flare.rotateBy(Math.PI*2, 360*16.7, null, (e)=>{this.startFlareRotation()});
	}

	destroy()
	{
		this.eternalPlazmaSmoke && this.eternalPlazmaSmoke.destroy();
		this.marker && this.marker.destroy();

		this.marker = null;
		this.flare = null;
		this.eternalPlazmaSmoke = null;
		this.indigoSmoke = null;

		super.destroy();
	}

	startIndigoSmoke()
	{
		this.indigoSmoke = this.addChild(new EternalPlazmaSmoke(true));
		this.indigoSmoke.scale.set(0);
		this.indigoSmoke.scaleXTo(2*1.63, 12*2*16.6);
		this.indigoSmoke.scaleYTo(2*2.45, 12*2*16.6);
	}	
}

export default InstantKillMarker;