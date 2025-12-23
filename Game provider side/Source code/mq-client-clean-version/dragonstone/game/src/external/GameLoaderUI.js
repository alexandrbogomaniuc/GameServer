import { APP } from '../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { default as BaseUI } from '../../../../common/PIXI/src/dgphoenix/gunified/view/layout/GULoaderUI';
import Sprite from '../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import Timer from "../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer";
import I18 from '../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
import SyncQueue from '../../../../common/PIXI/src/dgphoenix/unified/controller/interaction/resources/loaders/SyncQueue';
import GamePreloaderSoundButtonController from '../controller/uis/custom/preloader/GamePreloaderSoundButtonController';
import GamePreloaderSoundButtonView from '../view/uis/custom/preloader/GamePreloaderSoundButtonView';
import GamePreloaderLogoView from '../view/uis/custom/preloader/GamePreloaderLogoView';
import LoadingScreenPlayNowButton from '../ui/LoadingScreenPlayNowButton';
import { INDICATORS_CONSTANT_VALUES } from '../../../shared/src/CommonConstants';
import AtlasConfig from '../config/AtlasConfig';

let PROGRESS_SPEED = 100;   // time for 1 percent move

class LoaderUI extends BaseUI
{
	static get EVENT_ON_CLICK_TO_START_CLICKED() 	{return "onClickToStartClicked";}

	get __backgroundName()
	{
		return 'preloader/back';
	}
	get __logoPosition()
	{
		return {x: 7, y: -184};
	}

	get __logoScale()
	{
		return 1.3;
	}

	get __brandPosition()
	{
		return {x: -344, y: -191};
	}

	get __soundButtonPosition()
	{
		return APP.isMobile ? {x: -438, y: -216} : {x: -452, y: -220};
	}
	get __teaserImageNamePrefix()
	{
		return "preloader/info_pictures/picture_"
	}

	get __teaserTANamePrefix()
	{
		return "TAPreloderTeaser";
	}

	get __teasersContainerPosition()
	{
		return {x: 7, y: 55}
	}

	get __loadingBarPosition()
	{
		return {x: 9, y: 210}
	}

	get __playNowButtonPosition()
	{
		return {x: 8, y: 253}
	}
	get __teaserIntervalAdd()
	{
		return -4;
	}

	get __teaserTextPosition()
	{
		return {x: 0, y: 33}
	}

	constructor(layout)
	{
		super(layout, new SyncQueue());

		this.__fPreloaderView_spr = null;
		this._fLastProgress_num = 0;
		this._fCompleteTimer_t = null;
		this._barMask = null;
		this._fIntervalTimer_t = null;

		this._fPlayNowButtonDisabled_btn = null;
		this._fPlayNowButtonEnabled_btn = null;
	}

	createLayout()
	{
		this.__addPreloaderContainer();
		this.__addBack();
		this.__addTeasers();
		this.__addLogo();
		this.__addSoundButton();
		this.__addLoadingBar();
		this.__addButtons();
		this.__addBrand();

		this.addListeners();
	}

	__addPreloaderContainer()
	{
		let lBackOffsetY_num = ((APP.config.margin.bottom || 0) - (APP.config.margin.top || 0)) / 2;

		this.__fPreloaderView_spr = APP.preloaderStage.view.addChild(new Sprite());
		this.__fPreloaderView_spr.position.y = -lBackOffsetY_num;
	}


	__addLogo()
	{
		let lLogo_spr = this.__fPreloaderView_spr.addChild(new GamePreloaderLogoView);
		lLogo_spr.position.set(this.__logoPosition.x, this.__logoPosition.y);
		lLogo_spr.scale.set(this.__logoScale);
	}

	__addBack()
	{
		let lBackOffsetY_num = ((APP.config.margin.bottom || 0) - (APP.config.margin.top || 0)) / 2;

		let lBack_spr = this.__fPreloaderView_spr.addChild(APP.library.getSprite(this.__backgroundName));
		lBack_spr.position.y = ~~lBackOffsetY_num;
	}

	__addBrand()
	{
		if (APP.playerController.info.brandEnable)
		{
			let lBrand_spr = this.__fPreloaderView_spr.addChild(I18.generateNewCTranslatableAsset('TAPreloaderBrand'));
			lBrand_spr.position.set(this.__brandPosition.x, this.__brandPosition.y);
		}
	}

	__addSoundButton()
	{
		super._addSoundButton();
	}

	__addLoadingBar()
	{
		let lFillOffset = 2;
		let lLoadingBarContainer_spr = this.__fPreloaderView_spr.addChild(new Sprite);
		lLoadingBarContainer_spr.position.set(this.__loadingBarPosition.x, this.__loadingBarPosition.y);

		let lBarContainer_spr = lLoadingBarContainer_spr.addChild(new Sprite);
		
		let lBarBack = lBarContainer_spr.addChild(APP.library.getSprite("preloader/loading_bar/back"));
		lBarBack.position.set(-2, 1.5);

		let lBarFill = lBarContainer_spr.addChild(APP.library.getSprite("preloader/loading_bar/fill"));
		lBarFill.anchor.set(0, 0.5);
		lBarFill.position.x = -lBarFill.width/2 - lFillOffset;

		var lBarMask = this._barMask = lBarContainer_spr.addChild(new Sprite);
		var lBarMaskGr = lBarMask.addChild(new PIXI.Graphics());
		lBarMaskGr.beginFill(0x00ff00).drawRect(0, -6, 407, 12);

		lBarMask.anchor.set(0, 0.5);
		lBarMask.scale.x = 0.001;
		lBarMask.position.x = - lBarFill.width/2 - lFillOffset;
		lBarFill.mask = lBarMaskGr;

		lBarContainer_spr.scale.set(1.5, 0.5);

	}

	__addButtons()
	{
		let lIsVisible_bl = APP.browserSupportController.info.isAudioContextSuspended;

		//DISABLED VERSION...
		let lPlayNowButtonDisabled_btn = new LoadingScreenPlayNowButton(false);
		lPlayNowButtonDisabled_btn.position.set(this.__playNowButtonPosition.x, this.__playNowButtonPosition.y);
		lPlayNowButtonDisabled_btn.visible = lIsVisible_bl;

		this.__fPreloaderView_spr.addChild(lPlayNowButtonDisabled_btn);
		this._fPlayNowButtonDisabled_btn = lPlayNowButtonDisabled_btn;
		//...DISABLED VERSION

		//ENABLED VERSION...
		let lPlayNowButtonEnabled_btn = new LoadingScreenPlayNowButton(true);
		lPlayNowButtonEnabled_btn.position.set(this.__playNowButtonPosition.x, this.__playNowButtonPosition.y);
		lPlayNowButtonEnabled_btn.visible = false;

		this.__fPreloaderView_spr.addChild(lPlayNowButtonEnabled_btn);
		this._fPlayNowButtonEnabled_btn = lPlayNowButtonEnabled_btn;
		//...ENABLED VERSION
	}

	__addTeasers()
	{
		this._fTeasersContainer = this.__fPreloaderView_spr.addChild(new Sprite());
			
		const TEASERS_COUNT_NUM = 3;
		let lImageAnchorX_num = 0.5;
		let lCoefficientForPositionByIndex_num = TEASERS_COUNT_NUM / 2 - lImageAnchorX_num; //all teasers will always be at their points relatively the middle

		for( let i = 0; i < TEASERS_COUNT_NUM; i++ )
		{
			let lTeaser_spr = this._fTeasersContainer.addChild(new Sprite());
	
			//TEASER IMAGE...
			let lImage_spr = lTeaser_spr.addChild(this.__generateTeaserImage(i));
			lImage_spr.anchor.set(lImageAnchorX_num, 1);
			lImage_spr.scale.set(1.2, 1.2);

			//...TEASER IMAGE
	
			//TEASER TEXT...
			let lTranslatableAssetDescriptorName_str = this.__teaserTANamePrefix + i;
	
			let l_cta = lTeaser_spr.addChild(I18.generateNewCTranslatableAsset(lTranslatableAssetDescriptorName_str));
			l_cta.position.set(this.__teaserTextPosition.x, this.__teaserTextPosition.y);
			l_cta.scale.set(1.35, 1.35);
			
			//SUBSTITUTE PLACEHOLDERS WTIH VALUES...
			if (l_cta.text.includes("##DRAGONSTONE_FRAGMENTS_COUNT##")) //all TAs are text-based, so there must be no error
			{
				l_cta.text = l_cta.text.replace("##DRAGONSTONE_FRAGMENTS_COUNT##", INDICATORS_CONSTANT_VALUES.DRAGONSTONE_FRAGMENTS_COUNT);
			}
			//...SUBSTITUTE PLACEHOLDERS WTIH VALUES
	
			//...TEASER TEXT

			let lPositionX_num = lTeaser_spr.getBounds().width * (i - lCoefficientForPositionByIndex_num)
				+ this.__teaserIntervalAdd * (i - lCoefficientForPositionByIndex_num);
			lTeaser_spr.position.set(lPositionX_num, 0);
		}

		this._fTeasersContainer.position.set(this.__teasersContainerPosition.x, this.__teasersContainerPosition.y);
	}

	__generateTeaserImage(aIndex_num)
	{
		let lImageName_str = this.__teaserImageNamePrefix + aIndex_num;
		
		let lImage_spr = APP.library.getSprite(lImageName_str);
		let lImageBounds_obj = lImage_spr.getBounds();

		let lFrame_spr = lImage_spr.addChild(APP.library.getSprite("preloader/battleground/info_pictures/frame"));
		lFrame_spr.position.set(0, -lImageBounds_obj.height/2);

		return lImage_spr;
	}

	//PRELOADER SOUND BUTTON...
	__providePreloaderSoundButtonControllerInstance()
	{
		return new GamePreloaderSoundButtonController();
	}

	_initSoundButtonView()
	{
		let l_sbv = this.__fPreloaderView_spr.addChild(new GamePreloaderSoundButtonView());
		l_sbv.position.set(this.__soundButtonPosition.x, this.__soundButtonPosition.y);

		let platformInf = window.getPlatformInfo ? window.getPlatformInfo() : {};
		this._isMobile = platformInf.mobile;

		if (this._isMobile)
		{
			l_sbv.scale.set(1.8);
		}

		return l_sbv;
	}
	//...PRELOADER SOUND BUTTON

	fitLayout()
	{
		// nothing to do
	}

	showProgress(aPercent_num = 0)
	{
		if (this._fLastProgress_num === aPercent_num)
		{
			return;
		}

		this._fLastProgress_num = aPercent_num;
		let lEndScaleCount_num = Math.max(aPercent_num / 100, 0.001);

		this._barMask.removeTweens();
		this._barMask.addTween(
									'x',
									lEndScaleCount_num, PROGRESS_SPEED,
									null, this._onProgressTweenCompleted.bind(this),
									() => {},
									this._barMask.scale
								).play();
	}

	_onProgressTweenCompleted()
	{
		if (this._fLastProgress_num === 100)
		{
			this._barMask.removeTweens();

			this._fCompleteTimer_t = new Timer(this.onCompleteTimerFinished.bind(this), PROGRESS_SPEED * 3);
		}
	}

	showComplete()
	{
		this.showProgress(100);
	}

	onCompleteTimerFinished()
	{
		this._fCompleteTimer_t && this._fCompleteTimer_t.destructor();
		this._fCompleteTimer_t = null;

		APP.library.registerAtlas("round_result/battleground/battleground_atlas", AtlasConfig.BattlegroundAtlas);
		APP.library.registerAtlas("battleground/powerup/powerup_atlas", AtlasConfig.PowerupAtlas);
		APP.library.registerAtlas("big_win/big_win_atlas", AtlasConfig.BigWinAtlas);
		APP.library.registerAtlas("blend/blend_atlas", AtlasConfig.BlendAtlas);
		APP.library.registerAtlas("boss_mode/bm_boss_mode/boss_mode_atlas", AtlasConfig.BossModeAtlas);
		APP.library.registerAtlas("boss_mode/hourglass/hourglass_atlas", AtlasConfig.HourglassAtlas);
		APP.library.registerAtlas("cursor/cursor_atlas", AtlasConfig.CursorAtlas);
		APP.library.registerAtlas("enemy_impact/circle_blast/circle_blast_atlas", AtlasConfig.CircleBlastAtlas);
		APP.library.registerAtlas("enemy_impact/default_weapon_4/default_weapon_4_atlas", AtlasConfig.DefaultWeapon4Atlas);
		APP.library.registerAtlas("enemy_impact/explosion/explosion_atlas", AtlasConfig.ExplosionAtlas);
		APP.library.registerAtlas("final_count/final_count_atlas", AtlasConfig.FinalCountAtlas);
		APP.library.registerAtlas("gameplay_dialogs/battleground/count_down/count_down_atlas", AtlasConfig.CountDownAtlas);
		APP.library.registerAtlas("mini_slot/mini_slot_atlas", AtlasConfig.MiniSlotAtlas);
		APP.library.registerAtlas("player_spot/ps_player_spot/player_spot_atlas", AtlasConfig.PlayerSpotAtlas);
		APP.library.registerAtlas("player_spot/bet_level/bet_level_atlas", AtlasConfig.BetLevelAtlas);
		APP.library.registerAtlas("round_result/rr_round_result/round_result_atlas", AtlasConfig.RoundResultAtlas);
		APP.library.registerAtlas("round_result/chest/chest_atlas", AtlasConfig.ChestAtlas);
		APP.library.registerAtlas("round_result/effect/effect_atlas", AtlasConfig.EffectAtlas);
		APP.library.registerAtlas("round_result/players_list/gold/gold_atlas", AtlasConfig.GoldAtlas);
		APP.library.registerAtlas("tips/tips_atlas", AtlasConfig.TipsAtlas);
		APP.library.registerAtlas("tutorial/tutorial_atlas", AtlasConfig.TutorialAtlas);
	
		APP.library.registerAtlas("player_spot/playerspotbattleground/playerspotbattleground_atlas", AtlasConfig.PlayerspotbattlegroundAtlas);
    	APP.library.registerAtlas("player_spot/playerspoticons/playerspoticons_atlas", AtlasConfig.PlayerspoticonsAtlas);
    	APP.library.registerAtlas("player_spot/playerspotfx/playerspotfx_atlas", AtlasConfig.PlayerspotfxAtlas); // this one?
		APP.library.registerAtlas("weapons/wp_weapons/weapons_atlas", AtlasConfig.WeaponsAtlas);
		APP.library.registerAtlas("weapons/emblems/emblems_atlas", AtlasConfig.EmblemsAtlas);
		APP.library.registerAtlas("weapons/GrenadeGun/grenade_gun_atlas", AtlasConfig.GrenadeGunAtlas);
		APP.library.registerAtlas("weapons/sidebar/sb_sidebar/sidebar_atlas", AtlasConfig.SidebarAtlas);
    	APP.library.registerAtlas("weapons/sidebar/sb_artillerystrike/sb_artillerystrike_atlas", AtlasConfig.SbArtillerystrikeAtlas);
    	APP.library.registerAtlas("weapons/sidebar/sb_cryogun/sb_cryogun_atlas", AtlasConfig.SbCryogunAtlas);
    	APP.library.registerAtlas("weapons/sidebar/sb_flamethrower/sb_flamethrower_atlas", AtlasConfig.SbFlamethrowerAtlas);
    	APP.library.registerAtlas("weapons/sidebar/sb_minelauncher/sb_minelauncher_atlas", AtlasConfig.SbMinelauncherAtlas);
    	APP.library.registerAtlas("weapons/sidebar/sb_plasma/sb_plasma_atlas", AtlasConfig.SbPlasmaAtlas);
    	APP.library.registerAtlas("weapons/sidebar/sb_railgun/sb_railgun_atlas", AtlasConfig.SbRailgunAtlas);
    	APP.library.registerAtlas("weapons/MineLauncher/minelauncher_debris/minelauncher_debris_atlas", AtlasConfig.MinelauncherDebrisAtlas);
    	APP.library.registerAtlas("weapons/grenadegun_debris/grenadegun_debris_atlas", AtlasConfig.GrenadegunDebrisAtlas);
    	APP.library.registerAtlas("weapons/Railgun/railgun_atlas", AtlasConfig.RailgunAtlas);	
		APP.library.registerAtlas("weapons/DefaultGun/weapons_default_gun_atlas", AtlasConfig.WeaponsDefaultGun);	
		APP.library.registerAtlas("weapons/ArtilleryStrike/weapons_artillery_gun_atlas", AtlasConfig.ArtilleryStrikeAtlas);
		APP.library.registerAtlas("weapons/Cryogun/cryo_gun_atlas", AtlasConfig.CryogunAtlas);
		APP.library.registerAtlas("weapons/FlameThrower/flame_thrower_atlas", AtlasConfig.FlameThrowerAtlas);
		APP.library.registerAtlas("weapons/InstantKill/instant_kill_atlas", AtlasConfig.InstantKillAtlas);	
		APP.library.registerAtlas("boss_mode/damage/damage_atlas", AtlasConfig.DamageAtlas);

		APP.library.registerAtlas("round_result/battleground/fire_win/fire_win_animation", AtlasConfig.FireWinAnimation);
		APP.library.registerAtlas("round_result/battleground/fire_explosion/fire_explosion_texture", AtlasConfig.FireWinExplosionAnimation);
		
		
    	this.dispatchComplete();
	}

	//CLICK TO START...
	showClickToStart()
	{
		this._fPlayNowButtonDisabled_btn.visible = false;
		this._fPlayNowButtonEnabled_btn.visible = true;

		this._fPlayNowButtonEnabled_btn.once("pointerclick", () => {
			this._fPlayNowButtonDisabled_btn.visible = true;
			this._fPlayNowButtonEnabled_btn.visible = false;
			this.emit(LoaderUI.EVENT_ON_CLICK_TO_START_CLICKED);
		});

	}
	//...CLICK TO START

	destructor()
	{
		super.destructor();

		this._fLastProgress_num = undefined;

		this._fCompleteTimer_t && this._fCompleteTimer_t.destructor();
		this._fCompleteTimer_t = null;

		this._fIntervalTimer_t && this._fIntervalTimer_t.destructor();
		this._fIntervalTimer_t = null;

		this.__fPreloaderView_spr = null;
		this._barMask = null;


		this._fPlayNowButtonDisabled_btn = null;
		this._fPlayNowButtonEnabled_btn = null;
	}
}

export default LoaderUI;