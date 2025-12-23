import GUSPreloaderTooltip from '../../../../../../../../common/PIXI/src/dgphoenix/gunified/view/uis/preloader/tips/GUSPreloaderTooltip';
import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import I18 from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';

class PreloaderTooltip extends GUSPreloaderTooltip
{	
	get TOOLTIP_SCREEN()
	{
		return {
			0:	"preloader/tips/tip_screen_0",
			1:  "preloader/tips/tip_screen_1",
			2:	"preloader/tips/tip_screen_2",
			3:	"preloader/tips/tip_screen_3",
			4:	"preloader/tips/tip_screen_4",};
	}

	get DESCTOP_TOOLTIP_TEXT()
	{
		return {
			0:	"TAPreloaderTip0",
			1:	"TAPreloaderTip1",
			2:	"TAPreloaderTip2",
			3:	this.DESCTOP_TOOLTIP_TEXT_3,
			4:	"TAPreloaderTip4",
		};
	}

	get DESCTOP_TOOLTIP_TEXT_3()
	{
		return [
		{src: "TAPreloaderTip3_1", x: -90, y: 60},
		{src: "TAPreloaderTip3_2", x: -120, y: 149},
		{src: "TAPreloaderTip3_3", x: 80, y: 60},
		{src: "TAPreloaderTip3_4", x: 115, y: 149},
		];
	}
	
	get MOBILE_TOOLTIP_TEXT()
	{
		return {
			0:	"TAPreloaderMobileTip0",
			1:  "TAPreloaderTip1",
			2:	"TAPreloaderTip2",
			3:	this.DESCTOP_TOOLTIP_TEXT_3,
			4:	"TAPreloaderMobileTip4",
		};
	}

	get ELLIPSE_CONFIGS()
	{
		return {
			0: {src: "preloader/tips/ellipse_tip_0", x: -8, y: 40},
			1: {src: "preloader/tips/ellipse_tip_1", x: 10, y: 90},
			2: {src: "preloader/tips/ellipse_tip_2", x: -83, y: 25},
			3: null,
			4: {src: "preloader/tips/ellipse_tip_0", x: -14, y: 30},
		}
	}

	constructor(aTooltipID)
	{
		super(aTooltipID);
	}

	__init()
	{
		if (APP.isMobile)
		{
			this.TOOLTIP_TEXT = this.MOBILE_TOOLTIP_TEXT;
			this.ARROW_POSITION = this.MOBILE_ARROW_POSITION;
		}
		else
		{
			this.TOOLTIP_TEXT = this.DESCTOP_TOOLTIP_TEXT;
			this.ARROW_POSITION = this.DESCTOP_ARROW_POSITION;
		}
	}

	_addContent()
	{
		let tooltipScreen = this.addChild(APP.library.getSprite(this.TOOLTIP_SCREEN[this._fTooltipID]));

		let ellipseConf = this.ELLIPSE_CONFIGS[this._fTooltipID];
		if (ellipseConf)
		{
			let ellipse = this.addChild(APP.library.getSprite(ellipseConf.src));
			ellipse.position.set(ellipseConf.x, ellipseConf.y);
		}

		if (Array.isArray(this.TOOLTIP_TEXT[this._fTooltipID]))
		{
			let larray_str = this.TOOLTIP_TEXT[this._fTooltipID];
			for(let i = 0; i < larray_str.length; i ++){
				let tooltipText = this.addChild(I18.generateNewCTranslatableAsset(larray_str[i].src));
				tooltipText.position.set(larray_str[i].x, larray_str[i].y);
			}
		}
		else
		{
			let tooltipText = this.addChild(I18.generateNewCTranslatableAsset(this.TOOLTIP_TEXT[this._fTooltipID]));
			tooltipText.position.set(0, 149);
		}
	}

	destroy() 
	{
		super.destroy();

		this.TOOLTIP_TEXT = null;
		this.ARROW_POSITION = null;
	}
}

export default PreloaderTooltip;