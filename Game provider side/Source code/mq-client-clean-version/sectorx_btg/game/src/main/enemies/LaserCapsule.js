import Capsule from "./Capsule";
import Sprite from '../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import AtlasConfig from './../../config/AtlasConfig';
import AtlasSprite from '../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../shared/src/CommonConstants';
import Sequence from '../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import * as Easing from '../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import Enemy from "./Enemy";

let _explode_textures = null;
function _generateExplodeTextures()
{
	if (_explode_textures) return

	_explode_textures = AtlasSprite.getFrames([APP.library.getAsset("enemies/laser_capsule/explode_1"), APP.library.getAsset("enemies/laser_capsule/explode_2")], [AtlasConfig.LaserCapsuleExplode1, AtlasConfig.LaserCapsuleExplode2], "");
}

class LaserCapsule extends Capsule
{
	constructor(params)
	{
		super(params);

		this._fDeathExplode_spr = null;
		this._fExplasionLaserNet_spr = null;
		this._fExplasionLaserFlare_spr = null;
	}

	//override
	_playDeathFxAnimation()
	{
		this.spineView.visible = true;

		this._startExploadionAnimation();
		if (this.isDeathActivated && this.deathReason != 1)
		{
			this._startExploadionLaserNetAnimation();
			APP.gameScreen.laserCapsuleFeatureController.startFieldAnimation(this.id);
		}

		this.emit(Enemy.EVENT_ON_DEATH_COIN_AWARD);
	}

	_startExploadionAnimation()
	{
		_generateExplodeTextures();

		this.spineView.visible = false;
		this.shadow.visible = false;
		this._fDeathExplode_spr = APP.gameScreen.gameFieldController.laserCapsuleExplodeContainer.container.addChild(new Sprite());
		this._fDeathExplode_spr.zIndex = APP.gameScreen.gameFieldController.laserCapsuleExplodeContainer.zIndex;
		const lOffsetX = 40;
		const lOffsetY = -20;
		this._fDeathExplode_spr.position.set(this.position.x + lOffsetX, this.position.y + lOffsetY);
		this._fDeathExplode_spr.textures = _explode_textures;
		this._fDeathExplode_spr.blendMode = PIXI.BLEND_MODES.ADD;
		this._fDeathExplode_spr.scale.set(2);
		this._fDeathExplode_spr.animationSpeed = 0.5; //30 / 60
		this._fDeathExplode_spr.once('animationend', () =>
		{
			APP.gameScreen.gameFieldController.laserCapsuleExplodeContainer.container.removeChild(this._fDeathExplode_spr);
			this._fDeathExplode_spr.destroy();
			this._fDeathExplode_spr = null;
			this.__tryToFinishDeathFxAnimation();
		});
		this._fDeathExplode_spr.play();
	}

	_startExploadionLaserNetAnimation()
	{
		this._fExplasionLaserNet_spr = APP.gameScreen.gameFieldController.laserCapsuleLaserNetExplodeContainer.container.addChild(APP.library.getSprite("enemies/laser_capsule/laser_net_exploasion"));
		this._fExplasionLaserNet_spr.zIndex = APP.gameScreen.gameFieldController.laserCapsuleLaserNetExplodeContainer.zIndex;
		this._fExplasionLaserNet_spr.blendMode = PIXI.BLEND_MODES.ADD;
		const lOffsetX = 1;
		const lOffsetY = -100;
		this._fExplasionLaserNet_spr.position.set(this.position.x + lOffsetX, this.position.y + lOffsetY);
		this._fExplasionLaserNet_spr.scale.set(0.8);

		const lFinishPositionX_num = this._fExplasionLaserNet_spr.position.x - 10;
		const lFinishPositionY_num = this._fExplasionLaserNet_spr.position.y + 30;

		let lSequencePosition_arr = [
			{ tweens: [{ prop: 'position.x', to: lFinishPositionX_num }, { prop: 'position.y', to: lFinishPositionY_num }], duration: 18 * FRAME_RATE}
		];
		Sequence.start(this._fExplasionLaserNet_spr, lSequencePosition_arr);

		let lSequenceScale_arr = [
			{ tweens: [{ prop: "scale.x", to: 2.08 }, 	{ prop: "scale.y", to: 2.08 }], duration: 7 * FRAME_RATE, ease: Easing.quartic.easeOut},
			{ tweens: [{ prop: "scale.x", to: 0.3 }, 	{ prop: "scale.y", to: 0.3 }], 	duration: 13 * FRAME_RATE, ease: Easing.quartic.easeIn, onfinish: () => {
				this._startFlareAnimation();
				APP.gameScreen.laserCapsuleFeatureController.startAnimation({x: 480, y: 270}, this.id); //x: 960 / 2, y: 540 / 2
			}},
			{ tweens: [{ prop: "scale.x", to: 0 }, 		{ prop: "scale.y", to: 0 }], 		duration: 3 * FRAME_RATE, onfinish: () => {
				APP.gameScreen.gameFieldController.laserCapsuleExplodeContainer.container.removeChild(this._fExplasionLaserNet_spr);
				Sequence.destroy(Sequence.findByTarget(this._fExplasionLaserNet_spr))
				this._fExplasionLaserNet_spr.destroy();
				this._fExplasionLaserNet_spr = null;
			}}
		];
		Sequence.start(this._fExplasionLaserNet_spr, lSequenceScale_arr);
	}

	_startFlareAnimation()
	{
		this._fExplasionLaserFlare_spr = APP.gameScreen.gameFieldController.laserCapsuleLaserFlareExplodeContainer.container.addChild(APP.library.getSpriteFromAtlas("common/orange_flare_glowed"));
		this._fExplasionLaserFlare_spr.zIndex = APP.gameScreen.gameFieldController.laserCapsuleLaserFlareExplodeContainer.zIndex;
		this._fExplasionLaserFlare_spr.blendMode = PIXI.BLEND_MODES.ADD;
		let lPosition_obj = this.position;
		if (this._fExplasionLaserNet_spr)
		{
			lPosition_obj = this._fExplasionLaserNet_spr.position;
		}
		this._fExplasionLaserFlare_spr.position = lPosition_obj;
		this._fExplasionLaserFlare_spr.scale.set(0);

		let lSequenceScale_arr = [
			{ tweens: [{ prop: "scale.x", to: 2.2 }, 	{ prop: "scale.y", to: 0.8 }], 	duration: 2 * FRAME_RATE},
			{ tweens: [{ prop: "scale.x", to: 1.4 }, 	{ prop: "scale.y", to: 1 }], 	duration: 2 * FRAME_RATE},
			{ tweens: [{ prop: "scale.x", to: 0 }, 		{ prop: "scale.y", to: 0 }], 	duration: 4 * FRAME_RATE, onfinish: () => {
				APP.gameScreen.gameFieldController.laserCapsuleLaserFlareExplodeContainer.container.removeChild(this._fExplasionLaserFlare_spr);
				Sequence.destroy(Sequence.findByTarget(this._fExplasionLaserFlare_spr))
				this._fExplasionLaserFlare_spr.destroy();
				this._fExplasionLaserFlare_spr = null;
				this.__tryToFinishDeathFxAnimation();
			}}
		];
		Sequence.start(this._fExplasionLaserFlare_spr, lSequenceScale_arr);
	}

	__tryToFinishDeathFxAnimation()
	{
		if (!this._fDeathExplode_spr &&
			!this._fExplasionLaserNet_spr &&
			!this._fExplasionLaserFlare_spr)
		{
			super.__tryToFinishDeathFxAnimation();
		}
	}

	get __maxCrosshairDeviationOnEnemyX() //maximum deviation in X position of the cursor on the body of the enemy
	{
		return 52;
	}

	get __maxCrosshairDeviationOnEnemyY() //maximum deviation in Y position of the cursor on the body of the enemy
	{
		return 65;
	}

	//override
	destroy(purely)
	{
		if(this._fDeathExplode_spr)
		{
			APP.gameScreen.gameFieldController.laserCapsuleExplodeContainer.container.removeChild(this._fDeathExplode_spr);
			this._fDeathExplode_spr.destroy();
		}

		if(this._fExplasionLaserNet_spr)
		{
			APP.gameScreen.gameFieldController.laserCapsuleLaserNetExplodeContainer.container.removeChild(this._fExplasionLaserNet_spr);
			Sequence.destroy(Sequence.findByTarget(this._fExplasionLaserNet_spr))
			this._fExplasionLaserNet_spr.destroy();
		}

		if(this._fExplasionLaserFlare_spr)
		{
			APP.gameScreen.gameFieldController.laserCapsuleLaserFlareExplodeContainer.container.removeChild(this._fExplasionLaserFlare_spr);
			Sequence.destroy(Sequence.findByTarget(this._fExplasionLaserFlare_spr))
			this._fExplasionLaserFlare_spr.destroy();
		}

		super.destroy(purely);

		this._fDeathExplode_spr = null;
		this._fExplasionLaserNet_spr = null;
		this._fExplasionLaserFlare_spr = null;
	}
}

export default LaserCapsule;