import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import SimpleUIView from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/SimpleUIView';
import I18 from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
import TextField from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/TextField';
import Counter from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/custom/Counter';
import * as Easing from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import Sequence from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import AtlasConfig from '../../../../config/AtlasConfig';
import AtlasSprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import PathTween from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/PathTween';
import { FRAME_RATE } from '../../../../../../shared/src/CommonConstants';
import GameStateController from '../../../../controller/state/GameStateController'
import BattlegroundResultPlayersListView from './BattlegroundResultPlayersListView';
import RoundResultScreenView from './../RoundResultScreenView';
import BattlegroundResultButton from './BattlegroundResultButton';
import RoundResultTextIndicatorView from './../indicators/RoundResultTextIndicatorView';
import GameBonusController from '../../../../controller/uis/custom/bonus/GameBonusController';
import NumberValueFormat from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/custom/values/NumberValueFormat';
import CoinsFlyAnimation from '../../awarding/big_win/CoinsFlyAnimation'
import BattlegroundCountDownIndicatorView from './BattlegroundCountDownIndicatorView';

const HALF_PI = Math.PI / 2;

const COUNTING_DURATION_PARTIAL = 18 * FRAME_RATE;
const COINS_TIME_RANGE = 3 * FRAME_RATE;
const END_POSITION_COIN_RANGE = { x: 30, y: 30 };

class BattlegroundResultScreenView extends SimpleUIView
{
	static get EVENT_ON_NEXT_ROUND_CLICKED()							{ return "onNextRoundClicked"; }
	static get EVENT_ON_BACK_TO_LOBBY_ROUND_RESULT_BUTTON_CLICKED()		{ return "onBackToLobbyRoundResultBtnClicked"; }

	static get ON_COINS_ANIMATION_STARTED()								{ return "onCoinsAnimationStarted"; }
	static get ON_COINS_ANIMATION_COMPLETED()							{ return "onCoinsAnimationCompleted"; }
	static get ON_MAIN_PANEL_ANIMATION_COMPLITE()						{ return "onMainPanelAnimationComplite"}

	show(aSkipAnimation_bl = false)
	{
		this._show(aSkipAnimation_bl);
		this.showNextButton();
	}

	startPanelAnimation(aSkipAnimation_bl = false)
	{
		if((!aSkipAnimation_bl) && (this.uiInfo.winnersCount !== 0)) // l_rrsi.winnersCount === 0 is refund 
		{
			this._setResultPanelOnStartAnimationPosition();
			this._createSmallPanel();

			if(this.uiInfo.isPlayerWon)
			{
				this._panelWinFrame_spr.visible = true;
				this._startSmallPanelAnimation();
			}
			else
			{
				this._panelWinFrame_spr.visible = false;
				this._startMainPanelAnimation();
			}
		}
		else
		{
			this._removeSequences();
			this._onCoinsAnimationEnded()
			this._setResultPanelOnEndAnimationPosition();
		}
	}

	refreshPlayerStatsValues(playerStats)
	{
	}

	stopAllAnimation()
	{
		this._stopAllAnimation();
	}

	showNextButton()
	{
		this._showNextButton();
	}

	hideNextButton()
	{
		this._hideNextButton();
	}

	showWaitingCaption()
	{

	}

	hideWaitingCaption()
	{

	}

	battleGroundTimeToStartUpdated(aTime_str)
	{
		this._fCountDownIndicator_bcdiv.applyValue(aTime_str);
	}

	constructor()
	{
		super();

		this._fCoinsFlyAnimations_arr = [];
		this._fTopContainer_spr = null;
		this._fBottomContainer_spr = null;
		this._fTopFrameGlowContainer_spr = new Sprite();
		this._fTopFrameGlow_spr = null;
		this._fInfoContainer_spr = new Sprite();
		this._fPlayerNickname_tf = null;

		this._fTotalDamageValue_rrtiv = null;
		this._fTotalKillsCountValue_rrtiv = null;
		this._fTotalFreeShotsCountValue_rrtiv = null;
		this._fBulletsFiredCountValue_rrtiv = null;
		this._fBulletsFiredCounter_c = null;

		this._fPlayersListView_rrplv = null;
		this._fWeaponsPayoutsCaption_cta = null;

		this._fReturnToLobbyButton_brb = null;
		this._fPlayAgainButton_brb = null;
		this._exitRoomBtn = null;
		this._coinTextures = null;
		this._fSequences_arr = []
		this._fCoinsAnimationDelay_t = null;
		this._fGraphicLines_arr = [];

		this._showNextButton_bl = null;

		this._fYouWon_cta = null;
		this._fYouGotRefund_cta = null;
		this._fAnotherPlayerWon_cta = null;
		this._fYouWonTie_cta = null;
		this._fAnotherPlayerWonTie_cta = null;
		this._fCountDownIndicator_bcdiv = null;
		this._fPlayerWonValue_rrtiv = null;
	}

	__init()
	{
		super.__init();

		this._addTransparentBack();

		this._addFlarePanel()
		this._addTopFrame();
		this._addBottomFrame();
		this._fBottomContainer_spr.addChild(this._fInfoContainer_spr);

		this._addCaptions();
		this._addNickname();
		this._addValues();

		this._addPlayersList();

		APP.currentWindow.gameStateController.on(GameStateController.EVENT_ON_PLAYER_SEAT_STATE_CHANGED, this._onPlayerSeatStateChanged, this);
		APP.currentWindow.gameBonusController.on(GameBonusController.EVENT_ON_BONUS_STATE_CHANGED, this._onBonusStatusChanged, this);

		if(APP.isMobile) 
		{
			this.position.set(0, -2);
		}
	}

	_addTransparentBack()
	{
		let lTransparentBack_grphc = this.addChild(new PIXI.Graphics());

		lTransparentBack_grphc.beginFill(0x000000, this.uiInfo.isActiveScreenMode ? 0.45 : 0.01).drawRect(-480, -284, 960, 560).endFill();
		lTransparentBack_grphc.interactive = true;
		lTransparentBack_grphc.buttonMode = false;
	}

	_addFlarePanel()
	{
		this._flarePanelContainer_sprt;
	}

	_addTopFrame()
	{
		let lBack_spr = this.addChild(new Sprite());
		let lTopFrame_spr = lBack_spr.addChild(APP.library.getSprite("round_result/battleground/top_frame"));
		lBack_spr.position.set(0, -142);

		let logo = lTopFrame_spr.addChild(I18.generateNewCTranslatableAsset("TABattlegroundRoundResultLogo"));
		logo.position.set(-7, -73);

		let rc = lTopFrame_spr.addChild(I18.generateNewCTranslatableAsset("TABattlegroundRoundResultRoundComplete"));
		rc.position.set(-73, -20);

		this._fYouWon_cta = lTopFrame_spr.addChild(I18.generateNewCTranslatableAsset("TABattlegroundRoundResultYouWonThePot"));
		this._fYouWon_cta.position.set(-111, 7);
		this._fYouWon_cta.visible = false;

		this._fAnotherPlayerWon_cta = lTopFrame_spr.addChild(I18.generateNewCTranslatableAsset("TABattlegroundRoundResultAnotherPlayerWon"));
		this._fAnotherPlayerWon_cta.position.set(-82, 7);
		this._fAnotherPlayerWon_cta.visible = false;

		this._fYouWonTie_cta = lTopFrame_spr.addChild(I18.generateNewCTranslatableAsset("TABattlegroundRoundResultYouWonThePotTie"));
		this._fYouWonTie_cta.position.set(-111, 7);
		this._fYouWonTie_cta.visible = false;
		
		this._fAnotherPlayerWonTie_cta = lTopFrame_spr.addChild(I18.generateNewCTranslatableAsset("TABattlegroundRoundResultAnotherPlayerWonTie"));
		this._fAnotherPlayerWonTie_cta.position.set(-82, 7);
		this._fAnotherPlayerWonTie_cta.visible = false;

		let next = lTopFrame_spr.addChild(I18.generateNewCTranslatableAsset("TABattlegroundRoundResultNextBattle"));
		next.position.set(120, -27);

		this._fYouGotRefund_cta = lTopFrame_spr.addChild(I18.generateNewCTranslatableAsset("TABattlegroundRoundResultYouGotRefund"));
		this._fYouGotRefund_cta.position.set(-82, 7);
		this._fYouGotRefund_cta.visible = false;

		this._fTopContainer_spr = lBack_spr;

		let l_bcdiv = new BattlegroundCountDownIndicatorView();
		l_bcdiv.position.set(124, 8);
		l_bcdiv.applyValue("--:--:--");

		this._fCountDownIndicator_bcdiv = l_bcdiv;
		
		this._fTopContainer_spr.addChild(l_bcdiv);
		this._fTopContainer_spr.scale.x = 0;
		this._fTopContainer_spr.scale.y = 0;
	}

	_addValues()
	{
		this._fTotalFreeShotsCountValue_rrtiv = this._fInfoContainer_spr.addChild(new RoundResultTextIndicatorView(new TextField(this._partialValuesStyle), false, 0.5, 0.5));
		this._fTotalFreeShotsCountValue_rrtiv.maxWidth = 90;
		this._fTotalFreeShotsCountValue_rrtiv.position.set(148, 111);
		this._fTotalFreeShotsCounter_c = new Counter({ target: this._fTotalFreeShotsCountValue_rrtiv, method: "value" });

		this._fTotalKillsCountValue_rrtiv = this._fInfoContainer_spr.addChild(new RoundResultTextIndicatorView(new TextField(this._partialValuesStyle), false, 0.5, 0.5));
		this._fTotalKillsCountValue_rrtiv.maxWidth = 90;
		this._fTotalKillsCountValue_rrtiv.position.set(148, 151);
		this._fTotalKillsCounter_c = new Counter({ target: this._fTotalKillsCountValue_rrtiv, method: "value" });

		this._fBulletsFiredCountValue_rrtiv = this._fInfoContainer_spr.addChild(new RoundResultTextIndicatorView(new TextField(this._partialValuesStyle), false, 0.5, 0.5));
		this._fBulletsFiredCountValue_rrtiv.maxWidth = 90;
		this._fBulletsFiredCountValue_rrtiv.position.set(148, 191);
		this._fBulletsFiredCounter_c = new Counter({ target: this._fBulletsFiredCountValue_rrtiv, method: "value" });

		this._fPlayerWonValue_rrtiv = this._fTopContainer_spr.addChild(I18.generateNewCTranslatableAsset("TABattlegroundRoundResultYouWonThePotValue"));
		this._fPlayerWonValue_rrtiv.maxWidth = 70;
		this._fPlayerWonValue_rrtiv.position.set(14, 8);
		this._fPlayerWonValue_rrtiv.visible = false;
	}

	_addBottomFrame()
	{
		let lBack_spr = this.addChild(new Sprite());
		let lBottomFrame_spr = lBack_spr.addChild(APP.library.getSprite("round_result/battleground/bottom_frame"));
		lBottomFrame_spr.position.set(0, 94);

		let score = lBottomFrame_spr.addChild(I18.generateNewCTranslatableAsset("TABattlegroundRoundResultScoreCard"));
		score.position.set(-120, -132);

		let stat = lBottomFrame_spr.addChild(I18.generateNewCTranslatableAsset("TABattlegroundRoundResultQuickStats"));
		stat.position.set(165, -132);

		this._fBottomContainer_spr = lBack_spr;
		this._fBottomContainer_spr.scale.x = 0;
		this._fBottomContainer_spr.scale.y = 0;
	}

	_addCaptions()
	{
		let lTotalFreeShotsCaption_cta = this._fInfoContainer_spr.addChild(I18.generateNewCTranslatableAsset("TABattlegroundRoundResultFreeShotsWon"));
		lTotalFreeShotsCaption_cta.position.set(148, 94);
		
		let lSeparate_spr = this._fInfoContainer_spr.addChild(APP.library.getSprite("round_result/battleground/separate_line"));
		lSeparate_spr.position.set(147, 83);

		let lTotalKillsCaption_cta = this._fInfoContainer_spr.addChild(I18.generateNewCTranslatableAsset("TABattlegroundRoundResultFreeEnemiesDefeated"));
		lTotalKillsCaption_cta.position.set(148, 134);

		lSeparate_spr = this._fInfoContainer_spr.addChild(APP.library.getSprite("round_result/battleground/separate_line"));
		lSeparate_spr.position.set(147, 124.5);

		let lBulletsFiredCaption_cta = this._fInfoContainer_spr.addChild(I18.generateNewCTranslatableAsset("TABattlegroundRoundResultFreeBulletsFired"));
		lBulletsFiredCaption_cta.position.set(148, 174);

		lSeparate_spr = this._fInfoContainer_spr.addChild(APP.library.getSprite("round_result/battleground/separate_line"));
		lSeparate_spr.position.set(147, 165);
	}

	get _weaponsBonusCaption()
	{
		if(!(this._isFrbMode || this._isCashBonusMode))
		{
			return "TARoundResultUnusedBonusCaption";
		}
		return null;
	}

	_addNickname()
	{
		this._fPlayerNickname_tf = this._fInfoContainer_spr.addChild(new TextField(this._nicknameStyle));
		this._fPlayerNickname_tf.maxWidth = 100;
		this._fPlayerNickname_tf.anchor.set(0.5, 0.5);
		this._fPlayerNickname_tf.position.set(147.5, 70.5);
	}

	_updatePlayerWonField()
	{

		let l_rrsi = this.uiInfo;
		let nickName = l_rrsi.playerNickname !== undefined ? l_rrsi.playerNickname : "-";
		let txtStyle = this._fPlayerNickname_tf.getStyle() || {};
		txtStyle.fontFamily = this._nicknameStyle.fontFamily;
		txtStyle.shortLength = 120;
		this._fPlayerNickname_tf.textFormat = txtStyle;
		this._fPlayerNickname_tf.text = nickName;
		if (l_rrsi.winnersCount <= 1)
		{
			if (l_rrsi.isPlayerWon)
			{
				let lPlayerWonValueTemplate_cta = I18.generateNewCTranslatableAsset("TABattlegroundRoundResultYouWonThePotValue");
				this._fPlayerWonValue_rrtiv.position.set(-14, 8);
				this._fPlayerWonValue_rrtiv.visible = true;

				let lVal_str = APP.currencyInfo.i_formatNumber(l_rrsi.playerTotalPrize * 100, false, false, 2); //for correct XX.XX format
				let lVal_final_str = lPlayerWonValueTemplate_cta.text.replace("/VALUE/", APP.currencyInfo.i_formatString(lVal_str));
				if(lVal_final_str.length>=9){
					this._fPlayerWonValue_rrtiv.scale.set( 1.8, 1.8);
					this._fPlayerWonValue_rrtiv.position.set(15, 8);

				}else{
					this._fPlayerWonValue_rrtiv.scale.set( 1, 1);
					this._fPlayerWonValue_rrtiv.position.set(-14, 8);
				}
				this._fPlayerWonValue_rrtiv.text = lVal_final_str;
				let lNickNamePlayerWonTemplate_cta = I18.generateNewCTranslatableAsset("TABattlegroundRoundResultYouWonThePot");
				this._fAnotherPlayerWon_cta.visible = false;
				this._fAnotherPlayerWonTie_cta.visible = false;
				this._fYouWon_cta.visible = true;
				this._fYouWonTie_cta.visible = false;
				this._fYouGotRefund_cta.visible = false;
				this._fYouWon_cta.text = lNickNamePlayerWonTemplate_cta.text;
			}
			else if (l_rrsi.winnersCount !== 0)
			{
				this._fPlayerWonValue_rrtiv.visible = false;
				let lNickNamePlayerWonTemplate_cta = I18.generateNewCTranslatableAsset("TABattlegroundRoundResultAnotherPlayerWon");
				this._fAnotherPlayerWon_cta.visible = true;
				this._fAnotherPlayerWonTie_cta.visible = false;
				this._fYouWon_cta.visible = false;
				this._fYouWonTie_cta.visible = false;
				this._fYouGotRefund_cta.visible = false;

				let winnerNickname = new TextField(this._nicknameStyle);
				winnerNickname.text = l_rrsi.winnerNickname;

				this._fAnotherPlayerWon_cta.text = lNickNamePlayerWonTemplate_cta.text.replace("/PLAYER_NAME/", winnerNickname.text);
			}
			else //refund, l_rrsi.winnersCount === 0
			{
				let lWithoutRakeTemplate_cta = I18.generateNewCTranslatableAsset("TABattlegroundRoundResultYouGotRefund");
				let lisWithoutRake = ((APP.gameScreen.gameField.roundResultScreenController.info.battlegroundBuyIn !== null)&&(l_rrsi.playerTotalPrize * 100 !== APP.gameScreen.gameField.roundResultScreenController.info.battlegroundBuyIn))
				let lMinusRake = (lisWithoutRake) ? "minus rake" : "" ;
				this._fPlayerWonValue_rrtiv.visible = false;
				this._fAnotherPlayerWon_cta.visible = false;
				this._fAnotherPlayerWonTie_cta.visible = false;
				this._fYouWon_cta.visible = false;
				this._fYouWonTie_cta.visible = false;
				this._fYouGotRefund_cta.visible = true;
				this._fYouGotRefund_cta.text = lWithoutRakeTemplate_cta.text.replace("/MINUS_RAKE/", lMinusRake);
			}
		}
		else
		{

			if (l_rrsi.isPlayerWon)
			{
				let lPlayerWonValueTemplate_cta = I18.generateNewCTranslatableAsset("TABattlegroundRoundResultYouWonThePotValue");
				this._fPlayerWonValue_rrtiv.position.set(10, 8);
				this._fPlayerWonValue_rrtiv.visible = true;

				let lVal_str = APP.currencyInfo.i_formatNumber(l_rrsi.playerTotalPrize * 100, false, false, 2); //for correct XX.XX format
				let lVal_final_str = lPlayerWonValueTemplate_cta.text.replace("/VALUE/", APP.currencyInfo.i_formatString(lVal_str));
				if(lVal_final_str.length>=9){
					this._fPlayerWonValue_rrtiv.scale.set( 1.8, 1.8);
					this._fPlayerWonValue_rrtiv.position.set(15, 8);

				}else{
					this._fPlayerWonValue_rrtiv.scale.set( 1, 1);
					this._fPlayerWonValue_rrtiv.position.set(-14, 8);
				}
				this._fPlayerWonValue_rrtiv.text = lVal_final_str;
				this._fAnotherPlayerWon_cta.visible = false;
				this._fAnotherPlayerWonTie_cta.visible = false;
				this._fYouWon_cta.visible = false;
				this._fYouWonTie_cta.visible = true;
				this._fYouGotRefund_cta.visible = false;
			}
			else
			{
				this._fPlayerWonValue_rrtiv.visible = false;
				let lWinnersCountTemplate_cta = I18.generateNewCTranslatableAsset("TABattlegroundRoundResultAnotherPlayerWonTie");
				this._fAnotherPlayerWon_cta.visible = false;
				this._fAnotherPlayerWonTie_cta.visible = true;
				this._fYouWon_cta.visible = false;
				this._fYouWonTie_cta.visible = false;
				this._fYouGotRefund_cta.visible = false;
				this._fAnotherPlayerWonTie_cta.text = lWinnersCountTemplate_cta.text.replace("/WINNERS_COUNT/", l_rrsi.winnersCount);
			}
		}
	}

	_onBackToLobbyButtonClicked()
	{
		this.emit(RoundResultScreenView.EVENT_ON_BACK_TO_LOBBY_ROUND_RESULT_BUTTON_CLICKED);
	}

	_onPlayAgainButtonClicked()
	{
		this.emit(RoundResultScreenView.EVENT_ON_NEXT_ROUND_CLICKED);
		//this.emit(BattlegroundResultScreenView.EVENT_ON_NEXT_ROUND_CLICKED);
	}

	_onExitRoomButtonClicked()
	{
		this.emit(BattlegroundResultScreenView.EVENT_ON_BACK_TO_LOBBY_ROUND_RESULT_BUTTON_CLICKED);
	}

	_addPlayersList()
	{
		this._fPlayersListView_rrplv = this.addChild(new BattlegroundResultPlayersListView());
		this._fPlayersListView_rrplv.position.set(-53, 91);
		this._fBottomContainer_spr.addChild(this._fPlayersListView_rrplv);

		var lBottomFrameGlow_spr = this._fBottomContainer_spr.addChild(APP.library.getSprite("round_result/battleground/bottom_frame_glow"));
		lBottomFrameGlow_spr.blendMode = PIXI.BLEND_MODES.SCREEN;
		lBottomFrameGlow_spr.position.set(0, 94);
		this._fBottomFrameGlow_spr = lBottomFrameGlow_spr;
	}

	_updateValues(aSkipAnimation_bl = false)
	{
		let l_rrsi = this.uiInfo;

		if (l_rrsi && l_rrsi.isActiveScreenMode)
		{
			this._updatePlayerWonField();

			!APP.profilingController.info.isVfxDynamicProfileValueMediumOrGreater && (aSkipAnimation_bl = true)

			if (aSkipAnimation_bl)
			{
				//[TODO]this._fTotalDamageValue_rrtiv <- SCORES HERE
				this._fTotalKillsCounter_c && this._fTotalKillsCounter_c.stopCounting();
				this._fTotalKillsCountValue_rrtiv.value = l_rrsi.totalKillsCount || 0;

				this._fTotalFreeShotsCounter_c && this._fTotalFreeShotsCounter_c.stopCounting();
				this._fTotalFreeShotsCountValue_rrtiv.value = l_rrsi.totalFreeShotsCount || 0;

				this._fBulletsFiredCounter_c && this._fBulletsFiredCounter_c.stopCounting();
				this._fBulletsFiredCountValue_rrtiv.value = l_rrsi.bulletsFiredCount || 0;

				this._resetCoinDelay(true);
			}
			else
			{
				this._fTotalKillsCountValue_rrtiv.value = 0;
				this._fTotalFreeShotsCountValue_rrtiv.value = 0;
				this._fBulletsFiredCountValue_rrtiv.value = 0;

				this._startCountingBlock1();
			}
		}
	}

	_onePulseBeatAnimation(container)
	{
		let sequence = [
			{
				tweens: [
					{ prop: "scale.x", to: 1 },
					{ prop: "scale.y", to: 1 },
				],
				duration: 0.3 * COUNTING_DURATION_PARTIAL,
				ease: Easing.back.easeIn
			},
			{
				tweens: [
					{ prop: "scale.x", to: 1.4 },
					{ prop: "scale.y", to: 1.4 },
				],
				duration: 0.2 * COUNTING_DURATION_PARTIAL,
				ease: Easing.back.easeIn
			},
			{
				tweens: [
					{ prop: "scale.x", to: 0.8 },
					{ prop: "scale.y", to: 0.8 },
				],
				duration: 0.2 * COUNTING_DURATION_PARTIAL,
				ease: Easing.back.easeIn
			},
			{
				tweens: [
					{ prop: "scale.x", to: 1 },
					{ prop: "scale.y", to: 1 },
				],
				duration: 0.3 * COUNTING_DURATION_PARTIAL,
				ease: Easing.back.easeOut
			}
		];
		Sequence.start(container, sequence);
	}

	_startCoinsAnimation(aValueCounter_rrtiv)
	{
		let coin = this.addChild(new Sprite());
		coin.textures = this.coinTextures;
		coin.blendMode = PIXI.BLEND_MODES.ADD;
		coin.position.set(aValueCounter_rrtiv.position.x, aValueCounter_rrtiv.position.y);
		coin.animationSpeed = 0.8;
		coin.scale.set(0.8);

		coin.play();

		let lDropPath_arr = this._getCoinTrace(aValueCounter_rrtiv, aValueCounter_rrtiv.position.x, aValueCounter_rrtiv.position.y);

		let lPathTween_ptw = new PathTween(coin, lDropPath_arr, true, false);
		lPathTween_ptw.start(15 * FRAME_RATE, Easing.quadratic.easeOut, this._destroyCoin.bind(coin));
	}

	_destroyCoin()
	{
		this.stop();
		this.destroy();
	}

	_addSequence(aSeq)
	{
		this._fSequences_arr.push(aSeq);
	}

	_removeSequences()
	{
		if (!this._fSequences_arr)
		{
			return;
		}

		while (this._fSequences_arr.length)
		{
			this._fSequences_arr.pop().destructor();
		}
	}

	_getCoinTrace(aValueCounter_rrtiv, x, y)
	{
		let startPosition = aValueCounter_rrtiv.position;

		let intermediatePosition = { x: 20 + x + this._getRandomArbitary(50), y: y - 111 };
		let endPosition = { x: -86 + this._getRandomArbitary(END_POSITION_COIN_RANGE.x), y: -92 + this._getRandomArbitary(END_POSITION_COIN_RANGE.y) };

		return [startPosition, intermediatePosition, endPosition];
	}

	_getRandomArbitary(range)
	{
		return Math.floor(Math.random() * 2 * range + 1) - range;
	}

	get coinTextures()
	{
		if (!this._coinTextures)
		{
			this._coinTextures = AtlasSprite.getFrames([APP.library.getAsset("round_result/coin_atlas")], AtlasConfig.Coin, "");
		}
		return this._coinTextures;
	}

	_startCountingBlock1()
	{
		this._startCountingBlock2();
		this._resetCoinDelay();

		this.emit(BattlegroundResultScreenView.ON_COINS_ANIMATION_STARTED);
	}

	_onTotalDamageTick()
	{
		this._fTotalDamageValue_rrtiv.value = NumberValueFormat.formatMoney(this._fTotalDamageValue_rrtiv.value, true, 0);
	}

	_startCountingBlock2()
	{
		this._fTotalKillsCounter_c.startCounting(this.uiInfo.totalKillsCount, COUNTING_DURATION_PARTIAL, null, this._startCountingBlock3.bind(this));

		this._resetCoinDelay();
		this.emit(BattlegroundResultScreenView.ON_COINS_ANIMATION_COMPLETED);
	}

	_startCountingBlock3()
	{
		this._fTotalFreeShotsCounter_c.startCounting(this.uiInfo.totalFreeShotsCount, COUNTING_DURATION_PARTIAL, null, this._startCountingBlock4.bind(this));

		this._resetCoinDelay();
		this.emit(BattlegroundResultScreenView.ON_COINS_ANIMATION_COMPLETED);
	}

	_startCountingBlock4()
	{
		this._resetCoinDelay();
		this.emit(BattlegroundResultScreenView.ON_COINS_ANIMATION_COMPLETED);

		this._fBulletsFiredCounter_c.startCounting(
			this.uiInfo.bulletsFiredCount,
			COUNTING_DURATION_PARTIAL,
			null,
			this._startCountingBlock5.bind(this)
		);
	}

	_startCountingBlock5()
	{
		
	}

	_resetCoinDelay()
	{
		this._fCoinsAnimationDelay_t && this._fCoinsAnimationDelay_t.destructor();
		this._fCoinsAnimationDelay_t = null;
	}

	get _nicknameStyle()
	{
		let lStyle_obj = {
			fontFamily: "fnt_nm_barlow_bold",
			fontSize: 16,
			align: "center",
			fill: 0x000000,
			dropShadow: true,
			shortLength: 100,
			dropShadowColor: 0xffffff,
			dropShadowAngle: Math.PI/4,
			dropShadowDistance: 1,
			dropShadowAlpha: 0.4,
		};

		return lStyle_obj;
	}

	get _partialValuesStyle()
	{
		let lStyle_obj = {
			fontFamily: "fnt_nm_barlow_bold",
			fontSize: 22,
			align: "center",
			fill: 0xfccc32,
			dropShadow: true,
			dropShadowColor: 0x000000,
			dropShadowAngle: HALF_PI,
			dropShadowDistance: 4,
			dropShadowAlpha: 0.6,
		};

		return lStyle_obj;
	}

	get _partialValuesSmalPanelStyle()
	{
		let lStyle_obj = {
			fontFamily: "fnt_nm_barlow_bold",
			fontSize: 60,
			align: "left",
			fill: 0xfccc32,
			dropShadow: true,
			dropShadowColor: 0x000000,
			dropShadowAngle: HALF_PI,
			dropShadowDistance: 4,
			dropShadowAlpha: 0.6,
		};

		return lStyle_obj;
	}

	get _partialPlayerWonValuesStyle()
	{
		let lStyle_obj = {
			fontFamily: "fnt_nm_barlow_bold",
			fontSize: 24,
			align: "left",
			fill: 0xfccc32,
			dropShadow: true,
			dropShadowColor: 0x000000,
			dropShadowAngle: HALF_PI,
			dropShadowDistance: 4,
			dropShadowAlpha: 0.6,
		};

		return lStyle_obj;
	}
	

	_show(aSkipAnimation_bl = false)
	{
		if (this.uiInfo.isActiveScreenMode)
		{
			this._fPlayersListView_rrplv.update(this.uiInfo.listData);
			this._updateValues(aSkipAnimation_bl);

			this._invalidateNextButton();
		}

		this.visible = true;
	}


	get _isFrbMode()
	{
		return APP.currentWindow.gameFrbController.info.frbMode;
	}

	get _isCashBonusMode()
	{
		return APP.currentWindow.gameBonusController.info.isActivated;
	}

	_stopAllAnimation()
	{
		if (!this.uiInfo.isActiveScreenMode)
		{
			return;
		}

		this._fBulletsFiredCounter_c && this._fBulletsFiredCounter_c.stopCounting();
		this._fCoinsAnimationDelay_t && this._fCoinsAnimationDelay_t.destructor();

		this.emit(BattlegroundResultScreenView.ON_COINS_ANIMATION_COMPLETED);

		this._updateValues(true);
	}

	_onPlayerSeatStateChanged(aEvent_obj)
	{
		if (!this.uiInfo.isActiveScreenMode)
		{
			return;
		}

		this._invalidateNextButton();
	}

	_onBonusStatusChanged(aEvent_obj)
	{
		if (!this.uiInfo.isActiveScreenMode)
		{
			return;
		}

		this._invalidateNextButton();
	}

	_showNextButton()
	{
		if (!this.uiInfo.isActiveScreenMode)
		{
			return;
		}

		this._showNextButton_bl = true;

		if (!this._fPlayAgainButton_brb)
		{
			//RETURN TO LOBBY BUTTON...
			let lReturnToLobbyButton_brb = this._fReturnToLobbyButton_brb = this._fTopContainer_spr.addChild(new BattlegroundResultButton("round_result/battleground/button_gray", "TABattlegroundRoundResultChangeWorld", false, undefined, BattlegroundResultButton.BUTTON_TYPE_ACCEPT, false));
			lReturnToLobbyButton_brb.position.set(-26, 46);
			lReturnToLobbyButton_brb.on("pointerclick", this._onBackToLobbyButtonClicked, this);
			//...RETURN TO LOBBY BUTTON

			//PLAY AGAIN BUTTON...
			let lPlayAgainButton_btn = this._fPlayAgainButton_brb = this._fTopContainer_spr.addChild(new BattlegroundResultButton("round_result/battleground/button_yellow", "TABattlegroundRoundResultPlayAgain", false, undefined, BattlegroundResultButton.BUTTON_TYPE_ACCEPT, true));
			lPlayAgainButton_btn.position.set(121, 46);
			lPlayAgainButton_btn.on("pointerclick", this._onPlayAgainButtonClicked, this);
			//...PLAY AGAIN BUTTON
		}

		this._invalidateNextButton();

		this._createTopFrameGlow();
	}

	_createTopFrameGlow()
	{
		if(!this._fTopFrameGlow_spr)
		{
			var lTopFrameGlow_spr = APP.library.getSprite("round_result/battleground/top_frame_glow");
			lTopFrameGlow_spr.blendMode = PIXI.BLEND_MODES.SCREEN;

			let logo = lTopFrameGlow_spr.addChild(I18.generateNewCTranslatableAsset("TABattlegroundRoundResultLogoGlow"));
			logo.blendMode = PIXI.BLEND_MODES.SCREEN;
			logo.position.set(-7, -73);

			let lMaskReturnToLobbyButton_g = lTopFrameGlow_spr.addChild(new PIXI.Graphics());
			let lBounds_obj = this._fReturnToLobbyButton_brb.getLocalBounds();
			lMaskReturnToLobbyButton_g.beginFill(0x0000FF).drawRect(lBounds_obj.x , lBounds_obj.y, lBounds_obj.width, lBounds_obj.height / 2).endFill();
			lMaskReturnToLobbyButton_g.position.set(-26, 43 + lBounds_obj.height / 2);

			let lReturnToLobbyButton_spr = lTopFrameGlow_spr.addChild(APP.library.getSprite("round_result/battleground/button_gray_glow"));
			lReturnToLobbyButton_spr.blendMode = PIXI.BLEND_MODES.SCREEN;
			lReturnToLobbyButton_spr.position.set(-26, 46);
			lReturnToLobbyButton_spr.mask = lMaskReturnToLobbyButton_g;

			let lMaskPlayAgainButton_g = lTopFrameGlow_spr.addChild(new PIXI.Graphics());
			lBounds_obj = this._fPlayAgainButton_brb.getLocalBounds();
			lMaskPlayAgainButton_g.beginFill(0x0000FF).drawRect(lBounds_obj.x , lBounds_obj.y, lBounds_obj.width, lBounds_obj.height / 2).endFill();
			lMaskPlayAgainButton_g.position.set(121, 43 + lBounds_obj.height / 2);

			let lPlayAgainButton_spr = lTopFrameGlow_spr.addChild(APP.library.getSprite("round_result/battleground/button_yellow_glow"));
			lPlayAgainButton_spr.blendMode = PIXI.BLEND_MODES.SCREEN;
			lPlayAgainButton_spr.position.set(121, 46);
			lPlayAgainButton_spr.mask = lMaskPlayAgainButton_g;

			this._fTopFrameGlow_spr = this._fTopContainer_spr.addChild(lTopFrameGlow_spr);
		}
	}

	get _LightButton_sprt()
	{
		if(!this._fLightButton_sprt)
		{
			var lBounds_obj = this._fPlayAgainButton_brb.getBounds();
			var l_txtr = PIXI.RenderTexture.create({ width: lBounds_obj.width * 2, height:  lBounds_obj.height * 2});
			
			APP.stage.renderer.render(this._fPlayAgainButton_brb, { renderTexture: l_txtr });
			
			let lMask_sprt = new PIXI.Sprite(l_txtr);
	
			this._fLightButton_sprt = this._fPlayAgainButton_brb.addChild(APP.library.getSprite("light_sweep"))
			this._fLightButton_sprt.mask =  lMask_sprt;
			this._fTopContainer_spr.addChild(lMask_sprt)
		}
		return this._fLightButton_sprt;
	}

	_startGlowPlayAgainButton()
	{
		if (!this.uiInfo.isActiveScreenMode)
		{
			return;
		}

		var lLightButton = this._LightButton_sprt;
		lLightButton.blendMode = PIXI.BLEND_MODES.SCREEN;
		lLightButton.alpha = 0.8;
		lLightButton.x = -212;
		
		var lContainerXSeq = 
		[
			{tweens:[
				{ prop: "x", to: 212}
			],
			 duration: 45 * FRAME_RATE,
			 onfinish: () => {
				lLightButton.x = -212;
			 }
			},
			{
				tweens:[],
				duration: 7 * FRAME_RATE
			},
			{
				tweens:
				[
					{ prop: "x", to: 212}
				],
				duration: 45 * FRAME_RATE,
				onfinish: () => {
					lLightButton.x = -212;
				}
			}
		];
		this._addSequence(Sequence.start(lLightButton, lContainerXSeq));
	}
	
	_invalidateNextButton()
	{
		if (this._fPlayAgainButton_brb)
		{
			let lGameBonusInfo_gbi = APP.currentWindow.gameBonusController.info;
			const lIsCompletedBonusesExist_bl = lGameBonusInfo_gbi.isActivated && lGameBonusInfo_gbi.bonusCompletionData;

			const lGameFRBInfo_gbi = APP.currentWindow.gameFrbController.info;
			const lBattleGroundGame_bl = APP.isBattlegroundGame;
			const lIsFrbEnded_bl = lGameFRBInfo_gbi.frbEnded;

			let lGameStateInfo_gsi = APP.currentWindow.gameStateController.info;
			this._fPlayAgainButton_brb.visible = this._showNextButton_bl && (lGameStateInfo_gsi.isPlayerSitIn || lBattleGroundGame_bl) && !lIsCompletedBonusesExist_bl && !lIsFrbEnded_bl;;
		}
	}

	_hideNextButton()
	{
		if (this._fPlayAgainButton_brb)
		{
			this._fPlayAgainButton_brb.visible = false;
		}
	}

	get _playerInfo()
	{
		return APP.playerController.info;
	}

	get _smallPanelContainer_sprt()
	{
		return !this._fSmallPanelContainer_sprt ? this._fSmallPanelContainer_sprt = this.addChild(new Sprite()) : this._fSmallPanelContainer_sprt;
	}

	get _panelWinFrame_spr()
	{
		return !this._fPanelWinFrame_spr ? this._fPanelWinFrame_spr = this._smallPanelContainer_sprt.addChild(APP.library.getSprite("round_result/battleground/win_frame")) : this._fPanelWinFrame_spr;
	}

	get _flarePanelContainer_sprt()
	{
		!this._fFlarePanelContainer_sprt && (this._fFlarePanelContainer_sprt = this.addChild(new Sprite()));
		!this._fCoinsFlyContainer_sprt && (this._fCoinsFlyContainer_sprt = this.addChild(new Sprite()));
		return this._fFlarePanelContainer_sprt
	}

	_setResultPanelOnStartAnimationPosition()
	{
		this._flarePanelContainer_sprt.destroyChildren();
		this._fBlendFlarePanel_sprt = null;
		this._fBlendFlareLosePanel_sprt = null;
		this._fBlendStarFlarePanel_sprt = null;

		this._smallPanelContainer_sprt.visible = true;
		this._flarePanelContainer_sprt.visible = true;

		this._fTopContainer_spr.scale.x = 0;
		this._fTopContainer_spr.scale.y = 0;
		this._fTopFrameGlow_spr.alpha = 1;

		this._fBottomContainer_spr.scale.x = 0;
		this._fBottomContainer_spr.scale.y = 0;
		this._fBottomFrameGlow_spr.alpha = 1;
	}

	_setResultPanelOnEndAnimationPosition()
	{
		this._smallPanelContainer_sprt.visible = false;
		this._flarePanelContainer_sprt.visible = false;

		this._LightButton_sprt && (this._LightButton_sprt.x = -212);
		this._fLightText_sprt && (this._fLightText_sprt.x = -170);

		this._GlowSmallPanel_sprt.alpha = 0;

		this._fTopContainer_spr.scale.x = 1;
		this._fTopContainer_spr.scale.y = 1;
		this._fTopFrameGlow_spr.alpha = 0;

		this._fBottomContainer_spr.scale.x = 1;
		this._fBottomContainer_spr.scale.y = 1;
		this._fBottomFrameGlow_spr.alpha = 0;

		if(this._fWinPanelCountCounter_c && this._fWinPanelCountCounter_c.inProgress())
		{
			this._fWinPanelCountCounter_c.stopCounting();
		}
		this._panelWinFrame_spr.destroyChildren();
	}

	_createSmallPanel()
	{
		let l_rrsi = this.uiInfo;

		if (l_rrsi.isPlayerWon)
		{
			var lPanel_spr = this._panelWinFrame_spr;
			this._fWinTextAndValueContainer_cta = new Sprite();
			lPanel_spr.addChild(I18.generateNewCTranslatableAsset("TABattlegroundRoundResultYouWonTheRound"));

			var lWon_cta = this._fWinTextAndValueContainer_cta.addChild(I18.generateNewCTranslatableAsset("TABattlegroundRoundResultYouWin"));
			lWon_cta.position.set(-5, 15);

			this._fWinPanelCountValue_rrtiv = new RoundResultTextIndicatorView(new TextField(this._partialValuesStyle), false, 0.5, 0.5);
			this._fWinPanelCountValue_rrtiv.maxWidth = 90;
			this._fWinPanelCountValue_rrtiv.position.set(15, 10);
			this._fWinPanelCountCounter_c = new Counter({ target: this._fWinPanelCountValue_rrtiv, method: "value" });
			this._fSmallPanelValue_cta = this._fWinTextAndValueContainer_cta.addChild(I18.generateNewCTranslatableAsset("TABattlegroundRoundResultYouWonTheSmallPanelValue"));
			
			this._fWinTextAndValueContainer_cta.position.set(-40, 0);
			lPanel_spr.addChild(this._fWinTextAndValueContainer_cta);
		}
	}

	get _LightText_sprt()
	{
		if(this._fSmallPanelValue_cta)
		{
			if(!this._fLightText_sprt)
			{
				this._fLightText_sprt = this._smallPanelContainer_sprt.addChild(APP.library.getSprite("light_sweep"));
			}
	
			this._fSmallPanelValue_cta.y += 10;
			var lBounds_obj = this._fSmallPanelValue_cta.getBounds();
			var l_txtr = PIXI.RenderTexture.create({ width: lBounds_obj.width, height:  lBounds_obj.height});
	
			APP.stage.renderer.render(this._fSmallPanelValue_cta, { renderTexture: l_txtr });
			this._fSmallPanelValue_cta.y -= 10;
			let lMask_sprt = new PIXI.Sprite(l_txtr);
			lMask_sprt.position.set(-40, -10);
	
			this._fLightText_sprt.mask && this._fLightText_sprt.mask.destroy();
			this._fLightText_sprt.mask = lMask_sprt;
			this._smallPanelContainer_sprt.addChild(lMask_sprt)
			
			return this._fLightText_sprt;

		}
	}

	_startSmallPanelValueGlow()
	{
		var lLightText = this._LightText_sprt;
		lLightText.blendMode = PIXI.BLEND_MODES.SCREEN;
		lLightText.alpha = 0.8;
		lLightText.x = -70;

		var lContainerXSeq = 
		[
			{
				tweens:[],
				duration: 5 * FRAME_RATE
			},
			{
				tweens:
				[
					{ prop: "x", to: 300}
				],
				duration: 36 * FRAME_RATE,
				ease: Easing.sine.easeInOut
			}
		];
		this._addSequence(Sequence.start(lLightText, lContainerXSeq));
	}

	get _BlendFlarePanel_sprt()
	{
		return !this._fBlendFlarePanel_sprt ? this._fBlendFlarePanel_sprt = this._flarePanelContainer_sprt.addChild(APP.library.getSprite("round_result/battleground/blend_top_frame")) : this._fBlendFlarePanel_sprt;
	}

	get _BlendStarFlarePanel_sprt()
	{
		return !this._fBlendStarFlarePanel_sprt ? this._fBlendStarFlarePanel_sprt = this._flarePanelContainer_sprt.addChild(APP.library.getSprite("round_result/battleground/blend_star_top_frame")) : this._fBlendStarFlarePanel_sprt;
	}

	_startFlareSmallPanelAnimation()
	{
		let l_rrsi = this.uiInfo;

		if(l_rrsi.isPlayerWon)
		{
			var lBlendFlarePanel_sprt = this._BlendFlarePanel_sprt;
			lBlendFlarePanel_sprt.blendMode = PIXI.BLEND_MODES.SCREEN;
			lBlendFlarePanel_sprt.visible = true;
			lBlendFlarePanel_sprt.scale.x = 0.75;
			lBlendFlarePanel_sprt.scale.y = 0.75;
			lBlendFlarePanel_sprt.alpha = 0;
	
			var lStarFlarePanel_sprt = this._BlendStarFlarePanel_sprt;
			lStarFlarePanel_sprt.blendMode = PIXI.BLEND_MODES.ADD;
			lStarFlarePanel_sprt.visible = false;
			
			this._flarePanelContainer_sprt.scale.x = 2.3;
			this._flarePanelContainer_sprt.scale.y = 2.3;
			this._flarePanelContainer_sprt.y = -25;
			this._flarePanelContainer_sprt.alpha = 1;

			let lContainerFlareSeq = [
				{
					tweens:[],
					duration: 1 * FRAME_RATE,
					onfinish:() => {
						lStarFlarePanel_sprt.visible = true;
					}
				},
				{
					tweens:[],
					duration: 1 * FRAME_RATE,
					onfinish:() => {
						this._addSequence(Sequence.start(lBlendFlarePanel_sprt,
							[
								{
									tweens:
									[
										{ prop: "alpha", to: 1}
									],
									duration: 8 * FRAME_RATE,
									ease: Easing.sine.easeOut
								}
							]));
					}
				},
				{
					tweens:[],
					duration: 70 * FRAME_RATE
				},
				{
					tweens:
					[
						{ prop: "alpha", to: 0}
					],
					duration: 6 * FRAME_RATE,
					ease: Easing.sine.easeOut,
					onfinish: () => {
						lBlendFlarePanel_sprt.visible = false;
						lStarFlarePanel_sprt.visible = false;
					}
				}
			];

			this._addSequence(Sequence.start(this._flarePanelContainer_sprt, lContainerFlareSeq));
		}
	}

	get _GlowSmallPanel_sprt()
	{
		return !this._fGlowSmallpanel_sprt ? this._fGlowSmallpanel_sprt = this._smallPanelContainer_sprt.addChild(APP.library.getSprite("round_result/battleground/win_frame_glow")) : this._fGlowSmallpanel_sprt;
	}

	_startGlowAnimation()
	{
		var lGlowPanel_sprt = this._GlowSmallPanel_sprt;
		lGlowPanel_sprt.blendMode = PIXI.BLEND_MODES.SCREEN;
		lGlowPanel_sprt.alpha = 0;
		let containerAlphaSeq = [
			{
				tweens:
				[
					{ prop: "alpha", to: 1}
				],
				duration: 2 * FRAME_RATE,
				ease: Easing.sine.easeOut
			},
			{
				tweens:
				[
					{ prop: "alpha", to: 0}
				],
				duration: 4 * FRAME_RATE,
				ease: Easing.sine.easeOut
			},
			{
				tweens:[],
				duration: 22 * FRAME_RATE
		 	},
			{
				tweens:
				[
					{ prop: "alpha", to: 1}
				],
				duration: 3 * FRAME_RATE,
				ease: Easing.sine.easeOut
			},
			{
				tweens:
				[
					{ prop: "alpha", to: 0}
				],
				duration: 4 * FRAME_RATE,
				ease: Easing.sine.easeOut
			},
			{
				tweens:[],
				duration: 37 * FRAME_RATE
		 	},
			{
				tweens:
				[
					{ prop: "alpha", to: 1}
				],
				duration: 4 * FRAME_RATE,
				ease: Easing.sine.easeOut
			},
			{
				tweens:
				[
					{prop: "alpha", to: 0}
				],
				duration: 8 * FRAME_RATE,
				ease: Easing.sine.easeOut
			},
		]
		
		this._addSequence(Sequence.start(lGlowPanel_sprt, containerAlphaSeq));
	}

	_formatValueCounterWinPanel(aEvent_obj)
	{
		var lTextValue_str = (I18.generateNewCTranslatableAsset("TABattlegroundRoundResultYouWonTheSmallPanelValue"))
		let lVal_str = APP.currencyInfo.i_formatNumber(aEvent_obj.value * (this.uiInfo.playerTotalPrize * 100), false, false, 2);
		this._fSmallPanelValue_cta.text = lTextValue_str.text.replace("/VALUE/", APP.currencyInfo.i_formatString(lVal_str));
	}
	_startSmallPanelAnimation()
	{
		APP.soundsController.play("summary_win");
		this._smallPanelContainer_sprt.scale.x = 15;
		this._smallPanelContainer_sprt.scale.y = 15;
		this._smallPanelContainer_sprt.alpha = 0;
		let containerScaleSeq = [
			{
				tweens:
				[
					{ prop: "x", to: 10 },
					{ prop: "y", to: -267 },
				],
				duration: 0 * FRAME_RATE,
				onfinish: () => {
					this._fWinPanelCountCounter_c.startCounting(this.uiInfo.playerTotalPrize * 100, COUNTING_DURATION_PARTIAL * 2, null, null, this._formatValueCounterWinPanel.bind(this))
				}
			},
			{
				tweens:
				[
					{ prop: "scale.x", to: 1 },
					{ prop: "scale.y", to: 1 },
					{ prop: "x", to:0 },
					{ prop: "y", to: 0 },
					{ prop: "alpha", to: 1}
				],
				duration: 8 * FRAME_RATE,
				ease: Easing.sine.easeOut,
				onfinish: () => {
					this._startGlowAnimation();
					this._startFlareSmallPanelAnimation();
					this._startCoinsExplosion();
				}
			},
			{
				tweens:[],
			 	duration: 2 * FRAME_RATE
			},
			{
				tweens:
				[
					{ prop: "scale.x", to: 1.29 },
					{ prop: "scale.y", to: 1.29 },
				],
				duration: 3 * FRAME_RATE,
				ease: Easing.sine.easeInOut
			},
			{
				tweens:
				[
					{ prop: "scale.x", to: 1.06 },
					{ prop: "scale.y", to: 1.06 },
				],
				duration: 5 * FRAME_RATE,
				ease: Easing.sine.easeInOut
			},
			{
				tweens:
				[
					{ prop: "scale.x", to: 1.2 },
					{ prop: "scale.y", to: 1.2 },
				],
				duration: 16 * FRAME_RATE,
				ease: Easing.sine.easeInOut
			},
			{
				tweens:
				[
					{ prop: "scale.x", to: 1 },
					{ prop: "scale.y", to: 1 },
				],
				duration: 3 * FRAME_RATE,
				ease: Easing.sine.easeInOut
			},
			{
				tweens:
				[
					{ prop: "scale.x", to: 1.29 },
					{ prop: "scale.y", to: 1.29 },
				],
				duration: 3 * FRAME_RATE,
				ease: Easing.sine.easeInOut
			},
			{
				tweens:
				[
					{ prop: "scale.x", to: 1.06 },
					{ prop: "scale.y", to: 1.06 },
				],
				duration: 5 * FRAME_RATE,
				ease: Easing.sine.easeInOut
			},
			{
				tweens:
				[
					{ prop: "scale.x", to: 1.2 },
					{ prop: "scale.y", to: 1.2 },
				],
				duration: 6 * FRAME_RATE,
				ease: Easing.sine.easeInOut,
				onfinish: () => {
					this._startSmallPanelValueGlow();
				}
			},
			{
				tweens:
				[
					{ prop: "scale.x", to: 1.05 },
					{ prop: "scale.y", to: 1.05 },
				],
				duration: 30 * FRAME_RATE,
				ease: Easing.sine.easeInOut,
				onfinish:() => {
					this._addSequence(Sequence.start(this._smallPanelContainer_sprt, [
						{
						tweens:
						[
							{prop: "x", to: 0},
							{prop: "y", to: -142}
						],
							duration: 9 * FRAME_RATE,
							ease: Easing.sine.easeOut
						}]))
				}
			},
			{
				tweens:
				[
					{ prop: "scale.x", to: 1.29 },
					{ prop: "scale.y", to: 1.29 },
				],
				duration: 3 * FRAME_RATE,
				ease: Easing.sine.easeInOut,
				onfinish:() => {
					this._startMainPanelAnimation()
				}
			},
			{
				tweens:[],
				duration: 2 * FRAME_RATE,
				onfinish: ()=> {
					this._addSequence(Sequence.start(this._smallPanelContainer_sprt, [
						{
						tweens: 
						[
							{ prop: "alpha", to: 0}
						],
						duration: 3 * FRAME_RATE,
						ease: Easing.sine.easeOut
						}]))
				}
			},
			{
				tweens:
				[
					{ prop: "scale.x", to: 1.19 },
					{ prop: "scale.y", to: 1.19 },
				],
				duration: 2 * FRAME_RATE,
				ease: Easing.sine.easeInOut,
				onfinish:() => {
					this._panelWinFrame_spr.destroyChildren();
				}
			},
		];
		this._addSequence(Sequence.start(this._smallPanelContainer_sprt, containerScaleSeq));
	}

	_startMainPanelAnimation()
	{
		let containerTopScaleSeq = [
			{
				tweens:
				[
					{ prop: "scale.x", to: 1.22},
					{ prop: "scale.y", to: 1.22}
				],
				duration: 4 * FRAME_RATE,
				ease: Easing.sine.easeOut,
				onfinish:() => {
					var lAlphaSeq = 
					[
						{
							tweens:[],
							duration: 1 * FRAME_RATE
						},
						{
							tweens:[{ prop: "alpha", to: 0}],
							duration: 4 * FRAME_RATE,
							ease: Easing.sine.easeOut
						}
					];
					this._addSequence(Sequence.start(this._fTopFrameGlow_spr, lAlphaSeq));
					this._addSequence(Sequence.start(this._fBottomFrameGlow_spr, lAlphaSeq));
					this.emit(BattlegroundResultScreenView.ON_MAIN_PANEL_ANIMATION_COMPLITE);
				 }
			},
			{
				tweens:
				[
					{ prop: "scale.x", to: 1},
					{ prop: "scale.y", to: 1}
				],
				duration: 4 * FRAME_RATE,
				ease: Easing.sine.easeOut
			},
			{
				tweens:[],
				duration: 21 * FRAME_RATE,
				onfinish: () => {
					this._startGlowPlayAgainButton()
				}
			}
		];
		this._addSequence(Sequence.start(this._fTopContainer_spr, containerTopScaleSeq));
		this._addSequence(Sequence.start(this._fBottomContainer_spr, containerTopScaleSeq));
		
	}

	_startCoinsExplosion()
	{
		this._startNextExplosion(0*FRAME_RATE, {x: 0, y: -40});
		this._startNextExplosion(7*FRAME_RATE, {x: -78, y: -40});
		this._startNextExplosion(11*FRAME_RATE, {x: 0, y: -40});
		this._startNextExplosion(18*FRAME_RATE, {x: -78, y: -40});
		this._startNextExplosion(29*FRAME_RATE, {x: -78, y: -40});
		this._startNextExplosion(41*FRAME_RATE, {x: -78, y: -40});
		this._startNextExplosion(51*FRAME_RATE, {x: 0, y: -40});
		this._startNextExplosion(53*FRAME_RATE, {x: -78, y: -40});
		this._startNextExplosion(60*FRAME_RATE, {x: -78, y: -40});
		this._startNextExplosion(72*FRAME_RATE, {x: -78, y: -40}, true);
	}

	_startNextExplosion(aDelay_num, aPos_obj, aFinal_bln)
	{
		let lCoinsExplosion_cfa = this._fCoinsFlyContainer_sprt.addChild(this._generateCoinsFlyAnimationInstance());
		lCoinsExplosion_cfa.position.set(aPos_obj.x, aPos_obj.y);
		if(this._fCoinsFlyAnimations_arr)
		{
			this._fCoinsFlyAnimations_arr.push(lCoinsExplosion_cfa);
		}
		if (aFinal_bln)
		{
			lCoinsExplosion_cfa.once(CoinsFlyAnimation.EVENT_ON_ANIMATION_ENDED, this._onCoinsAnimationEnded, this);
		}
		lCoinsExplosion_cfa.startAnimation(aDelay_num);
	}

	_generateCoinsFlyAnimationInstance()
	{
		let l_cfa = new CoinsFlyAnimation();
		return l_cfa;
	}
	
	_onCoinsAnimationEnded()
	{
		while (this._fCoinsFlyAnimations_arr && this._fCoinsFlyAnimations_arr.length)
		{
			this._fCoinsFlyAnimations_arr.pop().destroy();
		}
		this._fCoinsFlyAnimations_arr = [];
	}

	destroy()
	{
		APP.currentWindow.gameStateController.off(GameStateController.EVENT_ON_PLAYER_SEAT_STATE_CHANGED, this._onPlayerSeatStateChanged, this);
		APP.currentWindow.gameBonusController.off(GameBonusController.EVENT_ON_BONUS_STATE_CHANGED, this._onBonusStatusChanged, this);

		super.destroy();

		this._fPlayerNickname_tf = null;

		this._fTotalDamageValue_rrtiv && this._fTotalDamageValue_rrtiv.destroy();
		this._fTotalDamageValue_rrtiv = null;

		this._fTotalKillsCountValue_rrtiv && this._fTotalKillsCountValue_rrtiv.destroy();
		this._fTotalKillsCountValue_rrtiv = null;
		this._fTotalKillsCounter_c && this._fTotalKillsCounter_c.destroy();
		this._fTotalKillsCounter_c = null;

		this._fTotalFreeShotsCountValue_rrtiv && this._fTotalFreeShotsCountValue_rrtiv.destroy();
		this._fTotalFreeShotsCountValue_rrtiv = null;
		this._fTotalFreeShotsCounter_c && this._fTotalFreeShotsCounter_c.destroy();
		this._fTotalFreeShotsCounter_c = null;
		
		this._fBulletsFiredCountValue_rrtiv && this._fBulletsFiredCountValue_rrtiv.destroy();
		this._fBulletsFiredCountValue_rrtiv = null;
		this._fBulletsFiredCounter_c && this._fBulletsFiredCounter_c.destroy();
		this._fBulletsFiredCounter_c = null;

		this._fWeaponsPayoutsCaption_cta = null;

		this._fPlayersListView_rrplv = null;

		this._fPlayAgainButton_brb = null;
		this._fGraphicLines_arr = null;

		this._showNextButton_bl = null;

		this._resetCoinDelay();
		this._removeSequences();

		this._coinTextures = null;

		this._fYouWon_cta = null;
		this._fYouGotRefund_cta = null;
		this._fAnotherPlayerWon_cta = null;
		this._fYouWonTie_cta = null;
		this._fAnotherPlayerWonTie_cta = null;
		this._fCountDownIndicator_bcdiv = null;
		this._fPlayerWonValue_rrtiv = null;
	}
}

export default BattlegroundResultScreenView;
