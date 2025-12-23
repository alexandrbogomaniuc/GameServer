import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import I18 from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import Sequence from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import * as Easing from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import Timer from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';

class TooltipView extends Sprite
{
	static get EVENT_ON_TIP_SHOWN()		{ return "onTipShown"; }
	static get EVENT_ON_TIP_HIDED()		{ return "onTipHided"; }

	get id()
	{
		return this._fId_num;
	}

	showTip()
	{
		this._showTip();
	}

	hideTip()
	{
		this._hideTip();
	}

	//INIT...
	constructor(aCaptionAsset_str, aTipId_num, aArrowDir_str, aTipDurationMs_num)
	{
		super();

		this._fId_num = aTipId_num;
		this._fArrowDir_str = aArrowDir_str;
		this._fCaptionAsset_str = aCaptionAsset_str;
		this._fBack_spr = null;
		this._fArrow_sprt = null;
		this._fTipDurationMs_num = aTipDurationMs_num;
		this._fShowTimer_tmr = null;

		this._init();
	}

	_init()
	{
		this._createCaption();
		this._addBack();
		this._addArrow();
		this._addCaption();
	}

	_createCaption()
	{
		this._fCaption_ta = I18.generateNewCTranslatableAsset(this._fCaptionAsset_str);
	}

	_addBack()
	{
		this._fBack_spr = this.addChild(APP.library.getSprite("tips/back"));
		this._fBack_spr.anchor.set(0.5, 0.5);

		let lTextBounds_obj = this._fCaption_ta.assetContent.textBounds;
		let lTextScale_num = this._fCaption_ta.assetContent.scale.x;

		let lArrowShift_num = this._fArrowDir_str ? 35 : 0;

		this._fBack_spr.scale.x = (lTextBounds_obj.width*lTextScale_num*(APP.isMobile?2:1) + 28 + lArrowShift_num) / this._fBack_spr.width;
		this._fBack_spr.scale.y = (lTextBounds_obj.height*lTextScale_num + 34) / this._fBack_spr.height;

		this.interactive = true;
		this.buttonMode = false;
	}

	_addArrow()
	{
		if (!this._fArrowDir_str) return;

		this._fArrow_sprt = this.addChild(new Sprite());

		let lBackBounds_obj = this._fBack_spr.getBounds();
		let lArrowBounds_obj = this._fArrow_sprt.getBounds();

		let lArrowX_num = lArrowBounds_obj.width/2;
		if (this._fArrowDir_str == "right") lArrowX_num += (lBackBounds_obj.width - lArrowBounds_obj.width);
		this._fArrow_sprt.position.set(lArrowX_num, 11);
	}

	_addCaption()
	{
		this.addChild(this._fCaption_ta);
		this._fCaption_ta.position.set(0, -7);

		let lBackBounds_obj = this._fBack_spr.getBounds();

		if (this._fArrow_sprt)
		{
			let lArrowBounds_obj = this._fArrow_sprt.getBounds();

			if (this._fArrowDir_str == "left") this._fCaption_ta.position.x += (lArrowBounds_obj.width/2 + 10);
			if (this._fArrowDir_str == "right") this._fCaption_ta.position.x += (lBackBounds_obj.width - lArrowBounds_obj.width);
		}
	}

	_showTip()
	{
		this.visible = true;
		this.scale.set(0);

		let visible = [{
			tweens: [{ prop: "scale.x", to: 1 }, { prop: "scale.y", to: 1 }],
			duration: 300,
			ease: Easing.back.easeOut,
			onfinish: () =>
			{
				this._fShowTimer_tmr = new Timer((e) => {this._onShowTimerCompleted();}, this._fTipDurationMs_num);
			}
		}];

		Sequence.start(this, visible);

		this.emit(TooltipView.EVENT_ON_TIP_SHOWN, {id: this._fId_num});
	}

	_onShowTimerCompleted()
	{
		this._hideTip();
	}

	_hideTip()
	{
		this._fShowTimer_tmr && this._fShowTimer_tmr.destructor();
		this._fShowTimer_tmr = null;

		let hide = [{
			tweens: [{ prop: "scale.x", to: 0 }, { prop: "scale.y", to: 0 }],
			duration: 100,
			ease: Easing.linear.easeIn,
			onfinish: () =>
			{
				this.visible = false;

				this.emit(TooltipView.EVENT_ON_TIP_HIDED, {id: this._fId_num});
			}
		}];

		Sequence.start(this, hide);
	}

	destroy()
	{
		Sequence.destroy(Sequence.findByTarget(this));

		this._fId_num = null;
		this._fArrowDir_str = null;
		this._fCaptionAsset_str = null;
		this._fBack_spr = null;
		this._fArrow_sprt = null;

		this._fShowTimer_tmr && this._fShowTimer_tmr.destructor();
		this._fShowTimer_tmr = null;

		super.destroy();
	}
}

export default TooltipView;