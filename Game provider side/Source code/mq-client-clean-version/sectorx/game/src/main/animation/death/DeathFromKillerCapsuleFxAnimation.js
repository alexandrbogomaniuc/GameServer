import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import DeathFxAnimation from './DeathFxAnimation';
import AtlasSprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import AtlasConfig from '../../../config/AtlasConfig';
import { FRAME_RATE } from '../../../../../shared/src/CommonConstants';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';

let l_red_smoke_spr = null;
function generate_red_smoke()
{
	if (!l_red_smoke_spr)
	{
		l_red_smoke_spr = AtlasSprite.getFrames(APP.library.getAsset("death/killer_capsule_enemy_death_smoke"), AtlasConfig.KillerCapsuleEnemyDeathSmoke, "");
	}
	return l_red_smoke_spr;
}


class DeathFromKillerCapsuleFxAnimation extends DeathFxAnimation
{
	playIntro()
	{
		// here we dont need the intro
		this._initDeathPale();
		this._playTripplePuff();

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startFlareAndSparklesAnimation();
		}
	}

	_playTripplePuff()
	{
		if (this._fTripplePuff_sprt) return; //already playing
		this._fTripplePuff_sprt = this.addChild(new Sprite());
		this._fTripplePuff_sprt.textures = generate_red_smoke();
		this._fTripplePuff_sprt.animationspeed = 0.5;
		this._fTripplePuff_sprt.scale.set(5);
		this._fTripplePuff_sprt.anchor.set(0.5, 0.85);
		this._fTripplePuff_sprt.on('animationend', this._destroyAll.bind(this));
		this._fTripplePuff_sprt.play();
	}

	_startFlareAndSparklesAnimation()
	{
		this._fSparkles_spr = this.addChild(APP.library.getSprite("death/killer_capsule_enemy_death_sparkles"));
		this._fSparkles_spr.blendMode = PIXI.BLEND_MODES.ADD;
		this._fSparkles_spr.position.set(0, -30);
		this._fSparkles_spr.anchor.set(0.5, 0.53);
		this._fSparkles_spr.scale.set(0);

		this._fFlare_spr = this.addChild(APP.library.getSpriteFromAtlas("common/killer_capsule_red_flare"));
		this._fFlare_spr.blendMode = PIXI.BLEND_MODES.ADD;
		this._fFlare_spr.position.set(0, -30);
		this._fFlare_spr.scale.set(0);

		let lSparklesAnimation_seq = [
			{ tweens: [{prop: "scale.x", to: 2}, {prop: "scale.y", to: 2}], duration: 6*FRAME_RATE},
			{ tweens: [{prop: "scale.x", to: 3}, {prop: "scale.y", to: 3}, {prop: "alpha", to: 0}], duration: 3.5*FRAME_RATE}
		];

		let lFlareAnimation_seq = [
			{ tweens: [{prop: "scale.x", to: 5}, {prop: "scale.y", to: 2}], duration: 3*FRAME_RATE },
			{ tweens: [{prop: "scale.x", to: 2.5}, {prop: "scale.y", to: 4}], duration: 4*FRAME_RATE },
			{ tweens: [{prop: "scale.x", to: 0}, {prop: "scale.y", to: 0}], duration: 2*FRAME_RATE, }
		];

		Sequence.start(this._fSparkles_spr, lSparklesAnimation_seq);
		Sequence.start(this._fFlare_spr, lFlareAnimation_seq);
	}

	destroy()
	{
		Sequence.destroy(Sequence.findByTarget(this._fSparkles_spr));
		this._fSparkles_spr && this._fSparkles_spr.destroy();
		this._fSparkles_spr = null;
		
		Sequence.destroy(Sequence.findByTarget(this._fFlare_spr));
		this._fFlare_spr && this._fFlare_spr.destroy();
		this._fFlare_spr = null;

		this._fTripplePuff_sprt && this._fTripplePuff_sprt.destroy();
		this._fTripplePuff_sprt = null;
		super.destroy();
	}
}

export default DeathFromKillerCapsuleFxAnimation;