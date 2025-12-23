import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import EternalPlazmaSmoke from './EternalPlazmaSmoke';
import Lightning from './Lightning';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import InstantKillEffects from '../../InstantKillEffects';

const PARAMS =	[	{x: -31/2, y: -4/2, rotation: 10*0.017, scale: 0.12},
					{x: 31/2, y: -4/2, rotation: 70*0.017 - Math.PI, scale: 0.12},
					{x: 0, y: -92/2, rotation: -70*0.017 - Math.PI, scale: 0.26}];

class InstantKillGunFlare extends Sprite 
{
	constructor(id)
	{
		super();

		this.id = id;
		this.lensFlare = null;
		this.plasmaSmoke = null;
		this.lightning = null;
		this.bouncingBalls = null;

		let params = PARAMS[this.id];

		this.lensFlare = APP.library.getSprite("common/lensflare");
		this.lensFlare.scale.x = 0.795*0.127;
		this.lensFlare.scale.y = 0.795*0.127;
		this.lensFlare.blendMode = PIXI.BLEND_MODES.ADD;
		this.addChild(this.lensFlare);

		this.plasmaSmoke = this.addChild(new EternalPlazmaSmoke());		
		this.plasmaSmoke.scale.set(params.scale);

		this.position.set(params.x, params.y);
		this.rotation = params.rotation;

		if(APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this.alpha = 0;
			let sequence = [
							{
								tweens: [
									{prop: "alpha", to: 1}								
								],
								duration: 17*16.6,							
								onfinish: () => {
									this.showBouncingBalls();
									this.showLightnings();
								}
							}
						];
			var delay = this.id * 16.6 * 10;
			Sequence.start(this, sequence, /*delay*/delay);
		}
	}

	showLightnings()
	{
		this.lightning = this.addChild(new Lightning());
		this.lightning.alpha = 0;
		this.lightning.fadeTo(1, 16.6*5);
		this.lightning.scale.set(0.26);		
	}

	showBouncingBalls()
	{
		this.bouncingBalls = this.addChild(new Sprite);
		this.bouncingBalls.textures = InstantKillEffects['bouncingBalls'];
		this.bouncingBalls.blendMode = PIXI.BLEND_MODES.ADD;
		this.bouncingBalls.scale.set(0.75);
		this.bouncingBalls.play();
	}

	destroy()
	{
		Sequence.destroy(Sequence.findByTarget(this));

		this.id = undefined;
		this.lensFlare = null;
		this.plasmaSmoke = null;
		this.lightning = null;
		this.bouncingBalls = null;

		super.destroy();
	}
}



export default InstantKillGunFlare;