
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import AtlasSprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import AtlasConfig from '../../../../config/AtlasConfig';
import { FRAME_RATE } from '../../../../../../shared/src/CommonConstants';
import { Sequence } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import { Utils } from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';

let top_flare_energy_textures = null;
export function generateEnergyTextures()
{
	if (!top_flare_energy_textures)
	{
		top_flare_energy_textures = AtlasSprite.getFrames(
			[
				APP.library.getAsset("common/fire_circle"),
			],
			[
				AtlasConfig.TopFlareEnergy,
			],
			"");
	}
	return top_flare_energy_textures;
}

class AppearingTopFlareAnimation extends Sprite
{
	static get EVENT_ON_ANIMATION_FINISH() { return "onAnimationFinish"; }

	startAnimation()
	{
		this._startAnimation();
	}

	interrupt()
	{
		this._interrupt();
	}

	constructor()
	{
		super();

		generateEnergyTextures();

		this._fEnergy_spr = null;
		this._fFlare_spr = null;
	}

	_startAnimation()
	{
		this._fEnergy_spr = this.addChild(new Sprite());
		this._fFlare_spr = this.addChild(APP.library.getSpriteFromAtlas("boss_mode/fire/flare"));

		this._startFlareAnimation();
		let lTimingSeq_arr = [
			{
				tweens: [], duration: 3 * FRAME_RATE, onfinish: () =>
				{
					this._startEnergyAnimation();
				}
			},
		];
		Sequence.start(this, lTimingSeq_arr);
	}

	_startFlareAnimation()
	{
		this._fFlare_spr.scale.set(0);
		this._fFlare_spr.blendMode = PIXI.BLEND_MODES.ADD;
		let lSequenceScale_arr = [
			{ tweens: [{ prop: "scale.x", to: 2.372 }, { prop: "scale.y", to: 2.372 }, {prop: "rotation", to: 0.20943951023931953}], duration: 5 * FRAME_RATE }, //4 * 0.593  4 * 0.593    Utils.gradToRad(12)
			{ tweens: [{ prop: "scale.x", to: 8.336 }, { prop: "scale.y", to: 8.336 }, {prop: "rotation", to: 0.5567600313861911}], duration: 7 * FRAME_RATE }, //4 * 2.084    4 * 2.084   Utils.gradToRad(31.9)
			{ tweens: [{ prop: "scale.x", to: 0 }, { prop: "scale.y", to: 0 }, {prop: "rotation", to: 1.6493361431346414}], duration: 5 * FRAME_RATE, onfinish: () => {  //Utils.gradToRad(94.5)
				Sequence.destroy(Sequence.findByTarget(this._fFlare_spr));
				this._fFlare_spr.destroy();
				this._fFlare_spr = null;
				this._checkAnimationFinish();
			} },
		];
		Sequence.start(this._fFlare_spr, lSequenceScale_arr);
	}

	_startEnergyAnimation()
	{
		this._fEnergy_spr.textures = top_flare_energy_textures;
		this._fEnergy_spr.scale.set(5);
		this._fEnergy_spr.blendMode = PIXI.BLEND_MODES.ADD;
		this._fEnergy_spr.animationSpeed = 0.5; //30 / 60
		this._fEnergy_spr.play();
		this._fEnergy_spr.on('animationend', () =>
		{
			Sequence.destroy(Sequence.findByTarget(this._fEnergy_spr));
			this._fEnergy_spr.destroy();
			this._fEnergy_spr = null;
			this._checkAnimationFinish();
		});

		let lSequenceScale_arr = [
			{ tweens: [{ prop: "scale.x", to: 10 }, { prop: "scale.y", to: 10 }], duration: 8 * FRAME_RATE }
		];
		Sequence.start(this._fEnergy_spr, lSequenceScale_arr);
	}

	_checkAnimationFinish()
	{
		if (!this._fEnergy_spr && !this._fFlare_spr)
		{
			this.emit(AppearingTopFlareAnimation.EVENT_ON_ANIMATION_FINISH);
		}
	}

	_interrupt()
	{
		Sequence.destroy(Sequence.findByTarget(this));

		if (this._fEnergy_spr)
		{
			Sequence.destroy(Sequence.findByTarget(this._fEnergy_spr));
			this._fEnergy_spr.destroy();
		}

		if (this._fFlare_spr)
		{
			Sequence.destroy(Sequence.findByTarget(this._fFlare_spr));
			this._fFlare_spr.destroy();
		}

	}

	destroy()
	{
		super.destroy();

		this._interrupt();

		this._fEnergy_spr = null;
		this._fFlare_spr = null;
	}
}

export default AppearingTopFlareAnimation;