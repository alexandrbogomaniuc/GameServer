import SimpleUIView from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/SimpleUIView';
import I18 from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
import InfoPanelCPBIndicatorView from './InfoPanelCPBIndicatorView'
import Timer from "../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer";
import { ENEMIES } from '../../../../../shared/src/CommonConstants';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';

const VIEW_TYPES = {
	GENERAL: "GENERAL"
}

const BASE_X = -474;

class InfoPanelView extends SimpleUIView
{
	update()
	{
		this._update();
	}

	updateKills()
	{
		this._updateKills();
	}

	clear()
	{
		this._clear();
	}

	constructor()
	{
		super();

		this._fContainer_sprt = null;
		this.fIndicatorsContainer_sprt = null;
		this.fInfobarContainer_sprt = null;

		this._fRoomCaption_ta = null;
		this._fRoundIdCaption_ta = null;
		this._fCPBIndicatorView_ipcpbiv = null;
		this._cpbSeparator_gr = null;

		this._fKillsCaption_ta = null;
		this._fKillsCaptionTemplate_str = null;
		this._fKilledBossCaptionTemplate_str = null;

		this._fRoomCaptionTemplate_str = null;
		this._fRoundIdCaptionTemplate_str = null;

		this._fKillsCaptionShowTimer_t = null;

		this._viewType = VIEW_TYPES.GENERAL;
	}

	__init()
	{
		super.__init();

		this._fContainer_sprt = this.addChild(new Sprite());
		this._fContainer_sprt.position.set(0, -262);

		let base = this._fContainer_sprt.addChild(new PIXI.Graphics());
		base.beginFill(0x000000).drawRect(-480, -8, 960, 16).endFill();


		this.fIndicatorsContainer_sprt = this._fContainer_sprt.addChild(new Sprite());
		this.fInfobarContainer_sprt = this._fContainer_sprt.addChild(new Sprite());

		this._initCaptions();

		this._fKillsCaptionShowTimer_t = new Timer(this._hideKillsCaption.bind(this), 2600, true);
	}

	_initCaptions()
	{
		let InfoPanelGameNameLabel = APP.isBattlegroundGame ? (APP.isCAFMode ? "TAInfoPanelGameNameLabelCAF" : "TAInfoPanelGameNameLabelBTG") : "TAInfoPanelGameNameLabel";
		this._fGameNameLable_ta = this.fIndicatorsContainer_sprt.addChild(I18.generateNewCTranslatableAsset(InfoPanelGameNameLabel));
		this._fGameNameLable_ta.position.set(BASE_X, -1);

		let lGameNameLableBounds_obj = this._fGameNameLable_ta.assetContent.textBounds;
		let lGameNameLableOffset_num = lGameNameLableBounds_obj.width + 6;

		this._fRoomCaption_ta = this.fIndicatorsContainer_sprt.addChild(I18.generateNewCTranslatableAsset("TAInfoPanelRoomLabel"));
		this._fRoomCaption_ta.position.set(BASE_X + lGameNameLableOffset_num, -1);
		this._fRoomCaptionTemplate_str = this._fRoomCaption_ta.text;

		let lRoomBounds_obj = this._fRoomCaption_ta.assetContent.textBounds;
		let lRoundOffset_num = lRoomBounds_obj.width;
		this._fRoundIdCaption_ta = this.fIndicatorsContainer_sprt.addChild(I18.generateNewCTranslatableAsset("TAInfoPanelRoundIdLabel"));
		this._fRoundIdCaption_ta.position.set(BASE_X + lRoundOffset_num + lGameNameLableOffset_num, -1);
		this._fRoundIdCaptionTemplate_str = this._fRoundIdCaption_ta.text;

		this._fKillsCaption_ta = this.fIndicatorsContainer_sprt.addChild((I18.generateNewCTranslatableAsset("TAInfoPanelKillsLabel")));
		this._fKillsCaptionTemplate_str = this._fKillsCaption_ta.text;
		this._fKilledBossCaptionTemplate_str = I18.getTranslatableAssetDescriptor("TAInfoPanelKilledBossLabelTemplate").textDescriptor.text;
		this._fKillsCaption_ta.visible = false;

		this._fCPBIndicatorView_ipcpbiv = this.fIndicatorsContainer_sprt.addChild(new InfoPanelCPBIndicatorView(null, this._isFRBMode));

		let lIndicatorWidth_num = this._fCPBIndicatorView_ipcpbiv.indicatorMaxWidth;
		this._fCPBIndicatorView_ipcpbiv.anchor.set(lIndicatorWidth_num, 0.5);
		this._fCPBIndicatorView_ipcpbiv.position.set(478 + lIndicatorWidth_num - this._fCPBIndicatorView_ipcpbiv.getBounds().width, -1);
		this._cpbSeparator_gr = this.fIndicatorsContainer_sprt.addChild(new PIXI.Graphics());
		this._cpbSeparator_gr.clear();

		this._latencyLabel =  this.fIndicatorsContainer_sprt.addChild(I18.generateNewCTranslatableAsset("InfoPanelLatencyLabel"));
		if (APP.isBattlegroundGame && APP.isCAFMode) {
			this._latencyLabel.position.set(this._fRoundIdCaption_ta.x + 140, -1);
		} else if (APP.isBattlegroundGame && !APP.isCAFMode) {
			this._latencyLabel.position.set(this._fRoundIdCaption_ta.x + 100, -1);
		} else {
			this._latencyLabel.position.set(this._fRoundIdCaption_ta.x + 95, -1);
		}

		this._latencyLabelValue =  this.fIndicatorsContainer_sprt.addChild(I18.generateNewCTranslatableAsset("InfoPanelLatencyLabel"));
		this._latencyLabelValue.position.set(this._latencyLabel.x + 40,-1);
		this._latencyLabelValue.text = "Updating...";

		this._fKillsCaption_ta.position.set(this._latencyLabelValue.x + 150, -1);

		this._updateAccordingViewType();
	}

	_update()
	{
		let lGameNameLableBounds_obj = this._fGameNameLable_ta.assetContent.textBounds;
		let lGameNameLableOffset_num = lGameNameLableBounds_obj.width + 6;

		this._fRoomCaption_ta.text = this._fRoomCaptionTemplate_str.replace("/VALUE/", this.uiInfo.roomId);
		this._fRoundIdCaption_ta.text = this._fRoundIdCaptionTemplate_str.replace("/VALUE/", this.uiInfo.roundId);

		let lRoomBounds_obj = this._fRoomCaption_ta.assetContent.textBounds;
		let lRoundOffset_num = lRoomBounds_obj.width;
		this._fRoundIdCaption_ta.position.set(BASE_X + lRoundOffset_num + lGameNameLableOffset_num, -1);
		this._latencyLabelValue.text = this.uiInfo.latency + " ms";

		this._fCPBIndicatorView_ipcpbiv.updateBonusMode(this._isFRBMode);
		if (this.uiInfo.cpb !== undefined)
		{
			if(!APP.isBattlegroundGame)
			{
				this._fCPBIndicatorView_ipcpbiv.indicatorValue = this.uiInfo.cpb;
			}

			this._fCPBIndicatorView_ipcpbiv.show();
		}
		else
		{
			this._fCPBIndicatorView_ipcpbiv.hide();
		}

		this._updateAccordingViewType();
	}


	get _isFRBMode()
	{
		return APP.currentWindow.gameFrbController.info.frbMode;
	}

	_updateKills()
	{
		let template_str = this._enemyKillMessageTemplate;
		let lEnemyName_str = this._getEnemyName(this.uiInfo.messageEnemy);
		let lText_str = template_str.replace("/PLAYER_NAME/", this.uiInfo.messageNickname).replace("/ENEMY_NAME/", lEnemyName_str);

		let killsFont = this._fKillsCaption_ta.textFormat.fontFamily;
		if (!APP.fonts.isGlyphsSupported(killsFont, lText_str))
		{
			killsFont = "sans-serif";
		}

		let killsTf = this._fKillsCaption_ta.assetContent;
		let txtStyle = killsTf.getStyle() || {};
		txtStyle.fontFamily = killsFont;
		killsTf.textFormat = txtStyle;

		this._fKillsCaption_ta.text = lText_str;
		this._fKillsCaption_ta.visible = true;

		this._fKillsCaptionShowTimer_t.start();

		this._updateAccordingViewType();
	}

	_clear()
	{
		this._hideKillsCaption();
	}

	_updateAccordingViewType()
	{
		this._updateViewType();

		let curViewType = this._viewType;

		this.fIndicatorsContainer_sprt.x = 0;
		this.fIndicatorsContainer_sprt.scale.x = 1;

		switch (curViewType)
		{
			case VIEW_TYPES.GENERAL:
				this._cpbSeparator_gr && this._cpbSeparator_gr.clear();

				let lIndicatorWidth_num = this._fCPBIndicatorView_ipcpbiv.indicatorMaxWidth;
				this._fCPBIndicatorView_ipcpbiv && this._fCPBIndicatorView_ipcpbiv.position.set(478 + lIndicatorWidth_num - this._fCPBIndicatorView_ipcpbiv.getBounds().width, -1);
				this._fKillsCaption_ta && this._fKillsCaption_ta.position.set(this._latencyLabelValue.x + 150, -1);
				break;
		}
	}

	_updateViewType()
	{
		this._viewType = VIEW_TYPES.GENERAL;
	}

	get _enemyKillMessageTemplate()
	{
		let template = this._fKillsCaptionTemplate_str;

		switch (this.uiInfo.messageEnemy)
		{
			default:
				template = this._fKillsCaptionTemplate_str;
			break;
		}

		return template;
	}

	_hideKillsCaption()
	{
		this._fKillsCaption_ta.visible = false;
	}

	_getEnemyName(aName_str)
	{
		let lAssetName_str = null;

		switch(aName_str)
		{
			case ENEMIES.EyeFlyerGreen:			lAssetName_str = "TAInfoPanelEnemyMalachiteEyeFlyer";						break;
			case ENEMIES.EyeFlyerRed:			lAssetName_str = "TAInfoPanelEnemyAmberEyeFlyer";							break;
			case ENEMIES.EyeFlyerPurple:		lAssetName_str = "TAInfoPanelEnemyAmethystEyeFlyer";						break;
			case ENEMIES.EyeFlyerYellow:		lAssetName_str = "TAInfoPanelEnemyCitrineEyeFlyer";							break;
			case ENEMIES.Jellyfish:				lAssetName_str = "TAInfoPanelEnemyJelliedSkyswimmer";						break;
			case ENEMIES.Mflyer:				lAssetName_str = "TAInfoPanelEnemyMalignantRay";							break;
			case ENEMIES.JumperGreen:			lAssetName_str = "TAInfoPanelEnemyEmeraldJumper";							break;
			case ENEMIES.JumperBlue:			lAssetName_str = "TAInfoPanelEnemySapphireJumper";							break;
			case ENEMIES.JumperWhite:			lAssetName_str = "TAInfoPanelEnemyAlbinoJumper";							break;
			case ENEMIES.Slug:					lAssetName_str = "TAInfoPanelEnemyGrotesqueSlug";							break;
			case ENEMIES.OneEye:				lAssetName_str = "TAInfoPanelEnemyInvaderTrooper";							break;
			case ENEMIES.Pointy:				lAssetName_str = "TAInfoPanelEnemySpikedTriclops";							break;
			case ENEMIES.SmallFlyer:			lAssetName_str = "TAInfoPanelEnemyBuzzingWatcher";							break;
			case ENEMIES.YellowAlien:			lAssetName_str = "TAInfoPanelEnemyOcularTerror";							break;
			case ENEMIES.GreenHopper:			lAssetName_str = "TAInfoPanelEnemyNimbleJumper";							break;
			case ENEMIES.RedHeadFlyer:			lAssetName_str = "TAInfoPanelEnemyScarletGlider";							break;
			case ENEMIES.MothyBlue:				lAssetName_str = "TAInfoPanelEnemyAzureDevourer";							break;
			case ENEMIES.MothyRed:				lAssetName_str = "TAInfoPanelEnemyCrimsonDevourer";							break;
			case ENEMIES.MothyWhite:			lAssetName_str = "TAInfoPanelEnemyAlbinoDevourer";							break;
			case ENEMIES.MothyYellow:			lAssetName_str = "TAInfoPanelEnemyYellowDevourer";							break;
			case ENEMIES.FlyerMutalisk:			lAssetName_str = "TAInfoPanelEnemyFlutteringScreecher";						break;
			case ENEMIES.Kang:					lAssetName_str = "TAInfoPanelEnemyInvaderCommander";						break;
			case ENEMIES.PinkFlyer:				lAssetName_str = "TAInfoPanelEnemyCyborgRaider";							break;
			case ENEMIES.GiantPinkFlyer:		lAssetName_str = "TAInfoPanelEnemyMegaCyborgRaider";						break;
			case ENEMIES.Froggy:				lAssetName_str = "TAInfoPanelEnemyTrinocularLeaper";						break;
			case ENEMIES.Crawler:				lAssetName_str = "TAInfoPanelEnemyCrawlingHellmouth";						break;
			case ENEMIES.Bioraptor:				lAssetName_str = "TAInfoPanelEnemyRazortooth";								break;
			case ENEMIES.Spiky:					lAssetName_str = "TAInfoPanelEnemySpikedBeholder";							break;
			case ENEMIES.Flyer:					lAssetName_str = "TAInfoPanelEnemyDarkwingMutant";							break;
			case ENEMIES.Krang:					lAssetName_str = "TAInfoPanelEnemyHivemindOverlord";						break;
			case ENEMIES.Rocky:					lAssetName_str = "TAInfoPanelEnemyLivingMagma";								break;
			case ENEMIES.Trex:					lAssetName_str = "TAInfoPanelEnemyRampagingBehemoth";						break;
			case ENEMIES.GiantTrex:				lAssetName_str = "TAInfoPanelEnemyMegaRampagingBehemoth";					break;

			case ENEMIES.Money:					lAssetName_str = "TAInfoPanelEnemyConcealedCoins";							break;
			
			case ENEMIES.LaserCapsule:			lAssetName_str = "TAInfoPanelEnemyCapsuleLaserNet";							break;
			case ENEMIES.BulletCapsule:			lAssetName_str = "TAInfoPanelEnemyCapsuleChainReactionShot";				break;
			case ENEMIES.KillerCapsule:			lAssetName_str = "TAInfoPanelEnemyCapsuleEnemySeeker";						break;
			case ENEMIES.LightningCapsule:		lAssetName_str = "TAInfoPanelEnemyCapsuleArcLightning";						break;
			case ENEMIES.GoldCapsule:			lAssetName_str = "TAInfoPanelEnemyCapsuleMoneyWheel";						break;
			case ENEMIES.BombCapsule:			lAssetName_str = "TAInfoPanelEnemyCapsuleMultiplierBomb";					break;
			case ENEMIES.FreezeCapsule:			lAssetName_str = "TAInfoPanelEnemyCapsuleFlashBlizzard";					break;

			case ENEMIES.Earth:					lAssetName_str = "TAInfoPanelEnemyMonolithicMauler";						break;
			case ENEMIES.FireBoss:				lAssetName_str = "TAInfoPanelEnemyRagingInferno";							break;
			case ENEMIES.IceBoss:				lAssetName_str = "TAInfoPanelEnemyGlacialCrusher";							break;
			case ENEMIES.LightningBoss:			lAssetName_str = "TAInfoPanelEnemyStormbringer";							break;
		}

		let lAssetDescriptor_ad =  I18.getTranslatableAssetDescriptor(lAssetName_str);
		return lAssetDescriptor_ad ? lAssetDescriptor_ad.textDescriptor.content.text : "";
	}

	destroy()
	{
		this._fKillsCaptionShowTimer_t && this._fKillsCaptionShowTimer_t.destructor();

		super.destroy();

		this._fContainer_sprt = null;
		this.fIndicatorsContainer_sprt = null;
		this.fInfobarContainer_sprt = null;
		this._fRoomCaption_ta = null;
		this._fRoundIdCaption_ta = null;
		this._fKillsCaption_ta = null;
		this._fKillsCaptionTemplate_str = null;
		this._fKilledBossCaptionTemplate_str = null;
		this._fCPBIndicatorView_ipcpbiv = null;
		this._fRoomCaptionTemplate_str = null;
		this._fRoundIdCaptionTemplate_str = null;
		this._fKillsCaptionShowTimer_t = null;
		this._viewType = null;
	}
}

export default InfoPanelView