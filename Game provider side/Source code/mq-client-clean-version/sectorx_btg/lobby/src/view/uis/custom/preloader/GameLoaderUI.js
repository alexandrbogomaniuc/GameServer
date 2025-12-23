import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import I18 from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
import { default as BaseUI } from '../../../../../../../common/PIXI/src/dgphoenix/gunified/view/layout/GULoaderUI';
import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import Timer from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import SyncQueue from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/interaction/resources/loaders/SyncQueue';
import Sequence from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { DropShadowFilter } from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Filters';
import LobbyPreloaderSoundButtonController from '../../../../controller/uis/custom/preloader/LobbyPreloaderSoundButtonController';
import LobbyPreloaderSoundButtonView from './LobbyPreloaderSoundButtonView';
import LobbyPreloaderLogoView from './LobbyPreloaderLogoView';
import LoadingScreenPlayNowButton from './LoadingScreenPlayNowButton';

let PROGRESS_SPEED = 240;   // time for 1 percent move
let PROGRESS_FINAL_SPEED = 120;   // time for a 1 percent move at the end
let PROGRESS_FILL_WIDTH = 898;  
//let LOADING_BAR_TEXT_NUMBER = 9;

class LoaderUI extends BaseUI
{
	static get EVENT_ON_CLICK_TO_START_CLICKED() 	{return "onClickToStartClicked";}

	constructor(layout, loader)
	{
		super(layout, loader = new SyncQueue());

		this._fPreloaderView_spr = null;
		this._fLastProgress_num = 0;
		this._fCompleteTimer_t = null;
		this._barMask = null;
		this._fTeasersContainer = null;
		this._fIntervalTimer_t = null;
		this._fLoadingBarText_spr_arr = [];
		this._fLoadingBarTextCurrentIndex_num = -1;

		this._fPlayNowButtonDisabled_btn = null;
		this._fPlayNowButtonEnabled_btn = null;
	}

	get __loadingBarPosition()
	{
		return {x: 9, y: 185};
	}

	get __brandPosition()
	{
		return {x: -344, y: -191};
	}

	get __soundButtonPosition()
	{
		return APP.isMobile ? {x: -438, y: -216} : {x: -452, y: -220};
	}

	createLayout(aIsFullScreenSupported_bl=false)
	{
		this._addPreloaderContainer();
		this._addBack();
		this._addTeasers();
		this._addLogo();
		this._addSoundButton();
		this._addLoadingBar();
		this._addButtons(aIsFullScreenSupported_bl);
		this._addBrand();
		this.addListeners();
	}

	_addPreloaderContainer()
	{
		let lBackOffsetY_num = ((APP.config.margin.bottom || 0) - (APP.config.margin.top || 0)) / 2;

		this._fPreloaderView_spr = APP.preloaderStage.view.addChild(new Sprite());
		this._fPreloaderView_spr.position.y = -lBackOffsetY_num;
	}

	_addLogo()
	{
		let lLogo_spr = this._fPreloaderView_spr.addChild(new LobbyPreloaderLogoView);
		lLogo_spr.position.set(-191, -160);
	}

	_addBack()
	{
		let lBackOffsetY_num = ((APP.config.margin.bottom || 0) - (APP.config.margin.top || 0)) / 2;

		let lBack_spr = this._fPreloaderView_spr.addChild(APP.library.getSprite('preloader/back'));
		lBack_spr.position.y = ~~lBackOffsetY_num;
	}

	_addBrand()
	{
		let lCustomerBrand_obj = APP.customerspecController.info.brand;
		let lSettingsBrand_obj = APP.config.brand;
		let lBrandEnable_bln = lSettingsBrand_obj.enable;

		if (lCustomerBrand_obj && lCustomerBrand_obj.priority >= lSettingsBrand_obj.priority)
		{
			lBrandEnable_bln = lCustomerBrand_obj.enable;
		}

		if (lBrandEnable_bln)
		{
			let lBrand_spr = this._fPreloaderView_spr.addChild(I18.generateNewCTranslatableAsset('TAPreloaderCustomBrand'));
			lBrand_spr.position.set(this.__brandPosition.x, this.__brandPosition.y);
		}
	}

	_addLoadingBar()
	{
		let lFillOffset = 2;
		let lLoadingBarContainer_spr = this._fPreloaderView_spr.addChild(new Sprite());
		lLoadingBarContainer_spr.position.set(this.__loadingBarPosition.x, this.__loadingBarPosition.y);

		let lBarContainer_spr = lLoadingBarContainer_spr.addChild(new Sprite());
		
		let lBarBack = lBarContainer_spr.addChild(APP.library.getSprite("preloader/loading_bar/back"));
		lBarBack.position.set(-2, 1.5);

		let lBarFill = lBarContainer_spr.addChild(APP.library.getSprite("preloader/loading_bar/fill"));
		lBarFill.anchor.set(0, 0.5);
		lBarFill.position.x = -lBarFill.width/2 - lFillOffset;

		var lBarMask = this._barMask = lBarContainer_spr.addChild(new Sprite);
		var lBarMaskGr = lBarMask.addChild(new PIXI.Graphics());
		lBarMaskGr.beginFill(0x00ff00).drawRect(0, 0, 620, 12);

		lBarMask.anchor.set(0, 0.5);
		lBarMask.scale.x = 0.001;
		lBarMask.position.x = - lBarFill.width/2 - lFillOffset;
		lBarFill.mask = lBarMaskGr;

		lBarContainer_spr.scale.set(1.8, 0.5);
	}

	_addButtons(aIsFullScreenSupported_bl=false)
	{
		let lX_num = 0;
		let lY_num = 237;
		let lIsVisible_bl = (
			!APP.isBattlegroundGame
			&& APP.browserSupportController.info.isAudioContextSuspended
			&& (!APP.isMobile || !aIsFullScreenSupported_bl)// no need to use "tap to start" for mobile devices, because currently we turn sounds on on;y by user interaction for mobile devices
			//(NOTE: we still need "tap to start" inside the game, because sound button won't unlock audion context in the game if game and lobby are in different domains)
		);

		let lPlayNowButtonDisabled_btn = new LoadingScreenPlayNowButton(false);
		lPlayNowButtonDisabled_btn.position.set(lX_num, lY_num);
		lPlayNowButtonDisabled_btn.visible = lIsVisible_bl;

		this._fPreloaderView_spr.addChild(lPlayNowButtonDisabled_btn);
		this._fPlayNowButtonDisabled_btn = lPlayNowButtonDisabled_btn;
		//...DISABLED VERSION

		//ENABLED VERSION...
		let lPlayNowButtonEnabled_btn = new LoadingScreenPlayNowButton(true);
		lPlayNowButtonEnabled_btn.position.set(lX_num, lY_num);
		lPlayNowButtonEnabled_btn.visible = false;

		this._fPreloaderView_spr.addChild(lPlayNowButtonEnabled_btn);
		this._fPlayNowButtonEnabled_btn = lPlayNowButtonEnabled_btn;
		//...ENABLED VERSION
	}

	_addTeasers()
	{
		this._fTeasersContainer = APP.preloaderStage.view.addChild(new Sprite());

		let l_s = this._fTeasersContainer;
		l_s.position.set(-112, -93 + (APP.isMobile ? 10 : 0));

		let lTeasersPositionsX_num_arr =
		[
			-172,
			110
		];

		for( let i = 0; i < lTeasersPositionsX_num_arr.length; i++ )
		{
			//TEASER IMAGE...
			let lImageName_str = "preloader/teasers/teaser_" + i;

			if (i == 0 && APP.isBattlegroundGame)
			{
				lImageName_str += "_btg";
			}

			let lTeaser_s = l_s.addChild(APP.library.getSprite(lImageName_str));
			lTeaser_s.anchor.set(0.5, 0.5);
			lTeaser_s.position.set(lTeasersPositionsX_num_arr[i], 64);
			var lTipsBase_s = lTeaser_s.addChild(APP.library.getSprite("preloader/tips_base_" + i));
			lTipsBase_s.anchor.set(0.5, 0.5);
			//...TEASER IMAGE

			//TEASER TEXT...
			let l_cta = null;
			let lTranslatableAssetDescriptorName_str = 'TAPreloderTeaser' + i;

			if(APP.isBattlegroundGame)
			{
				if(!!I18.getTranslatableAssetDescriptor(lTranslatableAssetDescriptorName_str + "Battleground"))
				{
					lTranslatableAssetDescriptorName_str += "Battleground";
				}
			}


			if(APP.isMobile)
			{
				if(!!I18.getTranslatableAssetDescriptor(lTranslatableAssetDescriptorName_str + "Mobile"))
				{
					lTranslatableAssetDescriptorName_str += "Mobile";
				}
			}

			l_cta = l_s.addChild(I18.generateNewCTranslatableAsset(lTranslatableAssetDescriptorName_str));
			l_cta.position.set(lTeasersPositionsX_num_arr[i], 181);
			l_cta.filters = [new DropShadowFilter({blur: 1, distance: 3, resolution: 2}), new DropShadowFilter({rotation: 20, blur: 2, distance: 5, resolution: 2})];
			//...TEASER TEXT
		}
	}

	//PRELOADER SOUND BUTTON...
	__providePreloaderSoundButtonControllerInstance()
	{
		return new LobbyPreloaderSoundButtonController();
	}

	_initSoundButtonView()
	{
		let l_sbv = this._fPreloaderView_spr.addChild(new LobbyPreloaderSoundButtonView());
		l_sbv.position.set(this.__soundButtonPosition.x, this.__soundButtonPosition.y);

		if (APP.isMobile)
		{
			l_sbv.scale.set(1.8);
		}

		return l_sbv;
	}
	//...PRELOADER SOUND BUTTON

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


	/*showProgress(aPercent_num = 0)
	{
		if (this._fLastProgress_num === aPercent_num)
		{
			return;
		}
		
		this._fLastProgress_num = aPercent_num;
		let lEndScaleCount_num = -220 + Math.max(aPercent_num / 100 * PROGRESS_FILL_WIDTH, 0.001);
		
		let lDuration = PROGRESS_SPEED;
		if (lEndScaleCount_num == PROGRESS_FILL_WIDTH)
		{
			lDuration = PROGRESS_FINAL_SPEED;
		}

		this._barMask && Sequence.destroy(Sequence.findByTarget(this._barMask));
		let lPosition_seq = [
			{tweens: [ {prop: "position.x", to: lEndScaleCount_num} ],duration: lDuration,
			onfinish: ()=>{
				this._onProgressTweenCompleted();
			}},
		]
		Sequence.start(this._barMask, lPosition_seq);
	}

	_onProgressTweenCompleted()
	{
		if (this._fLastProgress_num === 100)
		{
			this._barMask && Sequence.destroy(Sequence.findByTarget(this._barMask));
			this._fCompleteTimer_t = new Timer(this.onCompleteTimerFinished.bind(this), PROGRESS_SPEED * 3);
		
			//DEBUG...
			//this.showClickToStart();
			//...DEBUG
		}
	}*/

	showComplete()
	{
		this.showProgress(100);
	}

	onCompleteTimerFinished()
	{
		this._fCompleteTimer_t && this._fCompleteTimer_t.destructor();
		this._fCompleteTimer_t = null;

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

		this._fPreloaderView_spr = null;
		this._barMask = null;
	
		this._fPlayNowButtonDisabled_btn = null;
		this._fPlayNowButtonEnabled_btn = null;
	}
}

export default LoaderUI;