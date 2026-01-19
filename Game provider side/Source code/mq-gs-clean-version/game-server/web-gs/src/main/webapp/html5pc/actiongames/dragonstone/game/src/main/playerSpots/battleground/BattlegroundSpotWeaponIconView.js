import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { WEAPONS } from '../../../../../shared/src/CommonConstants';
import MTimeLine from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/timeLine/MTimeLine';

const ICON_WEAPONS_IDS =
[
	WEAPONS.RAILGUN,
	WEAPONS.ARTILLERYSTRIKE,
	WEAPONS.CRYOGUN,
	WEAPONS.FLAMETHROWER,
	WEAPONS.PLASMAGUN,
	WEAPONS.HIGH_LEVEL
];

const ASSETS_NAMES =
[
	"player_spot/playerspoticons/railgun",
	"player_spot/playerspoticons/artillery_strike",
	"player_spot/playerspoticons/cryogun",
	"player_spot/playerspoticons/flamethrower",
	"player_spot/playerspoticons/plasma",
	"battleground/powerup/background"
];

class BattlegroundSpotWeaponIconView extends Sprite
{
	constructor()
	{
		super();


		this._fContentContainer_s = this.addChild(new Sprite())
		this._fIconsContainer_s = this._fContentContainer_s.addChild(new Sprite())
		this._fIntroAnimation_mtl = null;
		this._fOutroAnimation_mtl = null;
		this._fRechargeAnimation_mtl = null;
		this._fIsRequired_bl = false;
		this._fIconImages_s_arr = [];
		this._fWeaponId_int = undefined;
		this._fRemainingShotsCount_int = 0;
		this._fBlick_s = null;
		this._fBlueFlash_s = null;
		this._fHighLevelWeaponView_sprt = null;


		this._fContentContainer_s.visible = false;
		//ADDING ALL AVAILABLE SW IMAGES...
		for( let i = 0; i < ICON_WEAPONS_IDS.length; i++ )
		{
			let l_s = APP.library.getSpriteFromAtlas(ASSETS_NAMES[i]);
			l_s.anchor.set(0.5, 0.5);
			l_s.visible = false;
			
			if (ICON_WEAPONS_IDS[i] == WEAPONS.HIGH_LEVEL)
			{
				l_s.x = -1.5;
				l_s.y = -1.5;

				l_s.scale.set(0.35);

				const STRIPES_POSITIONS_Y = [6, -2, -10];
				for (let i = 0; i < 3; i++)
				{
					let lNormalStripe_spr = l_s.addChild(APP.library.getSprite("battleground/powerup/stripe_normal"));
					lNormalStripe_spr.position.set(11, STRIPES_POSITIONS_Y[i]);

					this._fHighLevelWeaponView_sprt = l_s.addChild(new Sprite);
				}
			}

			this._fIconImages_s_arr[i] = l_s;
			this._fIconsContainer_s.addChild(l_s);
		}
		//...ADDING ALL AVAILABLE SW IMAGES

		//BLICK...
		let l_s = APP.library.getSpriteFromAtlas("player_spot/playerspoticons/playerspotfx/blick");
		l_s.anchor.set(0.5, 0.5);
		l_s.alpha = 0;
		this._fBlick_s = this._fIconsContainer_s.addChild(l_s);
		//...BLICK

		//BLUE FLASH...
		l_s = APP.library.getSpriteFromAtlas("player_spot/playerspoticons/playerspotfx/blue_flash");
		l_s.anchor.set(0.5, 0.5);
		l_s.scale.set(0, 0);
		l_s.blendMode = PIXI.BLEND_MODES.ADD;
		this._fBlueFlash_s = this._fContentContainer_s.addChild(l_s);
		//...BLUE FLASH


		//ANIMATIONS...
		//INTRO...
		let l_mtl = new MTimeLine();

		l_mtl.callFunctionAtFrame(
			this._fContentContainer_s.show,
			1,
			this._fContentContainer_s);

		l_mtl.addAnimation(
			this._fIconsContainer_s,
			MTimeLine.SET_SCALE,
			0,
			[
				10,
				[0.68, 3],
				[1, 2],
				[0.87, 5],
				[1, 13],
			]);

		l_mtl.addAnimation(
			this._fBlick_s,
			MTimeLine.SET_ALPHA,
			1,
			[
				10,
				[0, 10],
			]);

		l_mtl.addAnimation(
			this._fBlueFlash_s,
			MTimeLine.SET_SCALE,
			0,
			[
				[1.48, 3],
				[0, 15],
			]);

		l_mtl.addAnimation(
			this._fBlueFlash_s,
			MTimeLine.SET_ROTATION_IN_DEGREES,
			36,
			[
				[48, 18],
			]);

		this._fIntroAnimation_mtl = l_mtl;
		//...INTRO


		//OUTRO...
		l_mtl = new MTimeLine();

		l_mtl.addAnimation(
			this._fIconsContainer_s,
			MTimeLine.SET_SCALE,
			1,
			[
				[1.25, 10],
				[0, 10],
			]);

		l_mtl.callFunctionAtFrame(
			this.drop,
			20,
			this);

		this._fOutroAnimation_mtl = l_mtl;
		//...OUTRO

		//RECHARGE...
		l_mtl = new MTimeLine();
		l_mtl.addAnimation(
			this._fBlick_s,
			MTimeLine.SET_ALPHA,
			0,
			[
				[1, 7],
				[0, 7],
			]);

		l_mtl.addAnimation(
			this._fIconsContainer_s,
			MTimeLine.SET_SCALE,
			1,
			[
				[1.149, 5],
				[1, 13],
			]);

		this._fRechargeAnimation_mtl = l_mtl;
		//...RECHARGE
		//...ANIMATIONS
	}

	setRemainingShotsCount(aRemainingShotsCount_int)
	{
		this._fRemainingShotsCount_int = aRemainingShotsCount_int;

		this._validateIconWeaponView();
	}

	getRemainingShotsCount()
	{
		return this._fRemainingShotsCount_int;
	}

	drop()
	{
		this._fRemainingShotsCount_int = 0;
		this._fIsRequired_bl = false;
		this._fContentContainer_s.visible = false;
		this._resetAnimations();
	}

	canBeReused()
	{
		return !this._fContentContainer_s.visible && !this._fIsRequired_bl;
	}

	isRequired()
	{
		return this._fIsRequired_bl;
	}

	setIsRequired(aIsRequired_bl)
	{
		this._fIsRequired_bl = aIsRequired_bl;
	}


	_resetAnimations()
	{
		this._fIntroAnimation_mtl.stop();
		this._fOutroAnimation_mtl.stop();
		this._fRechargeAnimation_mtl.stop();
	}

	startIntroAnimation(aWeaponId_int, aShotsCount_int)
	{
		this._resetAnimations();

		this._fRemainingShotsCount_int = aShotsCount_int;
		this._fWeaponId_int = aWeaponId_int;
		this._fIsRequired_bl = true;

		//DISPLAYING RQUIRED WEAPON IMAGE...
		for( let i = 0; i < ICON_WEAPONS_IDS.length; i++ )
		{
			this._fIconImages_s_arr[i].visible = (ICON_WEAPONS_IDS[i] === aWeaponId_int);
		}
		//...DISPLAYING RQUIRED WEAPON IMAGE

		this._fIntroAnimation_mtl.play();

		this._validateIconWeaponView();
	}

	_validateIconWeaponView()
	{
		if (this.getWeaponId() == WEAPONS.HIGH_LEVEL)
		{
			this._fHighLevelWeaponView_sprt.destroyChildren();

			let lPlayerInfo_pi = APP.playerController.info;
			let lPossibleBetLevels_arr = lPlayerInfo_pi.possibleBetLevels;
			let lSkinBetLevel_int = lPossibleBetLevels_arr[1];
			let lBetLevelCntroller_blc = APP.gameScreen.betLevelController;

			if (
					this._fRemainingShotsCount_int > 1
					|| (this._fRemainingShotsCount_int == 1 && lBetLevelCntroller_blc.info.hasPendingBetLevelUpdate(lPossibleBetLevels_arr[2]) )
				)
			{
				lSkinBetLevel_int = lPossibleBetLevels_arr[2];
			}

			let lHighLevelWeaponSkin = lPlayerInfo_pi.getTurretSkinId(lSkinBetLevel_int);
			let lWeaponSkinView = APP.library.getSpriteFromAtlas(`weapons/DefaultGun/turret_${lHighLevelWeaponSkin}/turret`);
			lWeaponSkinView.position.set(-10, 0);
			lWeaponSkinView.scale.set(0.3);

			this._fHighLevelWeaponView_sprt.addChild(lWeaponSkinView);
		}
	}

	tryToPlayRechargeAnimation()
	{
		if(
			this._fRechargeAnimation_mtl.isPlaying() ||
			this._fIntroAnimation_mtl.isPlaying() ||
			this._fOutroAnimation_mtl.isPlaying()
			)
		{
			return;
		}

		this._resetAnimations();
		this._fRechargeAnimation_mtl.play();
	}

	startOutroAnimation()
	{
		this._resetAnimations();
		this._fOutroAnimation_mtl.play();
	}

	getWeaponId()
	{
		return this._fWeaponId_int;
	}

	isOutroAnimationInProcess()
	{
		return this._fOutroAnimation_mtl.isPlaying();
	}

	skipIntroIfPlaying()
	{
		if(this._fIntroAnimation_mtl.isPlaying())
		{
			this._fIntroAnimation_mtl.windToEnd();
		}
	}

	destroy()
	{
		this._fIntroAnimation_mtl && this._fIntroAnimation_mtl.destroy();
		this._fIntroAnimation_mtl = null;
		
		this._fOutroAnimation_mtl && this._fOutroAnimation_mtl.destroy();
		this._fOutroAnimation_mtl = null;
		
		this._fRechargeAnimation_mtl && this._fRechargeAnimation_mtl.destroy();
		this._fRechargeAnimation_mtl = null;
		
		this._fIntroAnimation_mtl = null;
		this._fOutroAnimation_mtl = null;
		this._fRechargeAnimation_mtl = null;
		this._fIsRequired_bl = false;
		this._fIconImages_s_arr = null;
		this._fWeaponId_int = null;
		this._fRemainingShotsCount_int = null;
		this._fBlick_s = null;
		this._fBlueFlash_s = null;
		this._fHighLevelWeaponView_sprt = null;

		super.destroy();
	}
}

export default BattlegroundSpotWeaponIconView;