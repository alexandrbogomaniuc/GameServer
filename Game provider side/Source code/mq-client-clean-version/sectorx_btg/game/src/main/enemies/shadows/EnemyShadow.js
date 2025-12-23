import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { ENEMIES } from '../../../../../shared/src/CommonConstants';

class EnemyShadow extends Sprite
{

	constructor(aEnemyName_str)
	{
		super();
		this._fEnemyName_str = aEnemyName_str;
		
		this.view = null;
		this._createView();
	}

	_createView()
	{
		this.view = this._generateShadowView();

		this._fCorrectScaleAndAlpha();
	}

	_generateShadowView()
	{
		let lShadow_sprt = null;
		switch (this._fEnemyName_str) {
			case ENEMIES.Flyer:
			case ENEMIES.SmallFlyer:
			case ENEMIES.Jellyfish:
			case ENEMIES.EyeFlyerGreen:
			case ENEMIES.EyeFlyerPurple:
			case ENEMIES.EyeFlyerRed:
			case ENEMIES.EyeFlyerYellow:
				lShadow_sprt = this.addChild(APP.library.getSprite('shadow'));
				return lShadow_sprt;
			case ENEMIES.LaserCapsule:
			case ENEMIES.KillerCapsule:
			case ENEMIES.LightningCapsule:
			case ENEMIES.GoldCapsule:
			case ENEMIES.BulletCapsule:
			case ENEMIES.BombCapsule:
			case ENEMIES.FreezeCapsule:
			case ENEMIES.PinkFlyer:
			case ENEMIES.GiantPinkFlyer:
			case ENEMIES.FlyerMutalisk:
			case ENEMIES.Bioraptor:
			case ENEMIES.RedHeadFlyer:
			case ENEMIES.Mflyer:
				lShadow_sprt = this.addChild(APP.library.getSprite('shadow_2'));
				return lShadow_sprt;
			case ENEMIES.GiantTrex:
			case ENEMIES.Trex:
				return;
			default :
				let lDoubleShadow_srt = this.addChild(new Sprite());
				let lFirstShadow = lDoubleShadow_srt.addChild(APP.library.getSprite('shadow'));
				lFirstShadow.scale.set(0.48, 0.48);
				lFirstShadow.alpha = 0.7;

				let lSecondShadow = lDoubleShadow_srt.addChild(APP.library.getSprite('shadow_2'));
				lSecondShadow.alpha = 0.45;

				return lDoubleShadow_srt;
		}
	}

	_fCorrectScaleAndAlpha()
	{
		let lView_sprt = this.view;
		switch (this._fEnemyName_str) {
			case ENEMIES.Flyer:
				lView_sprt.alpha = 0.4;
				lView_sprt.scale.set(1.1, 1.48);
				break;
			case ENEMIES.SmallFlyer:
				lView_sprt.alpha = 0.4;
				lView_sprt.scale.set(1, 0.87);
				break;
			case ENEMIES.Jellyfish:
				lView_sprt.alpha = 0.4;
				lView_sprt.scale.set(1.41, 0.68);
				break;
			case ENEMIES.EyeFlyerGreen:
			case ENEMIES.EyeFlyerPurple:
			case ENEMIES.EyeFlyerRed:
			case ENEMIES.EyeFlyerYellow:
				lView_sprt.alpha = 0.35;
				lView_sprt.scale.set(1, 0.68);
				break;
			case ENEMIES.LaserCapsule:
			case ENEMIES.KillerCapsule:
			case ENEMIES.LightningCapsule:
			case ENEMIES.GoldCapsule:
			case ENEMIES.BulletCapsule:
			case ENEMIES.BombCapsule:
			case ENEMIES.FreezeCapsule:
				lView_sprt.alpha = 0.65;
				lView_sprt.scale.set(2.88, 1.69);
				break;
			case ENEMIES.PinkFlyer:
			case ENEMIES.GiantPinkFlyer:
				lView_sprt.alpha = 0.4;
				lView_sprt.scale.set(1.61, 1.17);
				break;
			case ENEMIES.FlyerMutalisk:
				lView_sprt.alpha = 0.35;
				lView_sprt.scale.set(1.39, 0.77);
				break;
			case ENEMIES.Bioraptor:
				lView_sprt.alpha = 0.5;
				lView_sprt.scale.set(0.70, 1.46);
				break;
			case ENEMIES.RedHeadFlyer:
			case ENEMIES.Mflyer:
				lView_sprt.alpha = 0.66;
				lView_sprt.scale.set(1.78, 1);
				break;
			case ENEMIES.IceBoss:
			case ENEMIES.LightningBoss:
				lView_sprt.alpha = 0.7;
				lView_sprt.scale.set(3.42, 1.76);
				break;
			case ENEMIES.Earth:
			case ENEMIES.FireBoss:
				lView_sprt.alpha = 0.8;
				lView_sprt.scale.set(3.42, 1.76);
				break;
			case ENEMIES.Rocky:
				lView_sprt.alpha = 0.8;
				lView_sprt.scale.set(3.38, 3.38);
				break;
			case ENEMIES.JumperBlue:
			case ENEMIES.JumperGreen:
			case ENEMIES.JumperWhite:
			case ENEMIES.OneEye:
				lView_sprt.alpha = 0.8;
				lView_sprt.scale.set(1.1, 0.9);
				break;
			case ENEMIES.YellowAlien:
				lView_sprt.alpha = 0.8;
				lView_sprt.scale.set(1.73, 2.17);
				break;
			case ENEMIES.GreenHopper:
			case ENEMIES.Froggy:
				lView_sprt.alpha = 0.9;
				lView_sprt.scale.set(2.5, 1.93);
				break;
			case ENEMIES.MothyBlue:
			case ENEMIES.MothyRed:
			case ENEMIES.MothyWhite:
			case ENEMIES.MothyYellow:
				lView_sprt.alpha = 1;
				lView_sprt.scale.set(1.91, 1.93);
				break;
			case ENEMIES.Krang:
				lView_sprt.alpha = 0.9;
				lView_sprt.scale.set(1.64, 1.83);
				break;
			case ENEMIES.Crawler:
				lView_sprt.alpha = 0.9;
				lView_sprt.scale.set(2.02, 2.53);
				break;
			case ENEMIES.Slug:
				lView_sprt.alpha = 1;
				lView_sprt.scale.set(1.52, 2.53);
				break;
			case ENEMIES.Pointy:
				lView_sprt.alpha = 1;
				lView_sprt.scale.set(1.64, 1.83);
				break;
			case ENEMIES.Kang:
				lView_sprt.alpha = 1;
				lView_sprt.scale.set(1.21, 1.58);
				break;
			case ENEMIES.Spiky:
				lView_sprt.alpha = 1;
				lView_sprt.scale.set(2.01, 3.28);
				break;
			default :
				break;
		}
	}
}

export default EnemyShadow;