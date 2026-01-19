import { APP } from '../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import I18 from '../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
import LoaderUI from './GameLoaderUI';

class BattlegroundLoaderUI extends LoaderUI
{
	get __backgroundName()
	{
		return 'preloader/battleground/back';
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
		return "preloader/battleground/info_pictures/picture_"
	}

	get __teaserTANamePrefix()
	{
		return 'TABattlegroundPreloderTeaser';
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
		super(layout);
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

		//this._addBattlegroundTitle();

		this.addListeners();
	}

	/*_addBattlegroundTitle()
	{
		let l_spr = this.__fPreloaderView_spr.addChild(I18.generateNewCTranslatableAsset("TABattlegroundLogo"));
		l_spr.position.set(-282, 233);
		l_spr.scale.set(1.2);
	}*/

	__addLoadingBar()
	{
		super.__addLoadingBar();


		/*this._fLoadedCores_cta = this.__fPreloaderView_spr.addChild(new I18.generateNewCTranslatableAsset("TALoadedGameCore"));
		this._fLoadedCores_cta.position.set(this.__loadingBarPosition.x, this.__loadingBarPosition.y+22);*/
	
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
}

export default BattlegroundLoaderUI;