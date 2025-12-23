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
	static get DEFAULT_TIP_DURATION() 	{ return 2000; }

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

	set enabled(aVal_bln)
	{
		this._fEnabled_bln = aVal_bln;
	}

	get enabled()
	{
		return this._fEnabled_bln;
	}

	//INIT...
	constructor(aCaptionAsset_str, aTipId_num, aTipAsset_str, aOptTipDurationMs_num = TooltipView.DEFAULT_TIP_DURATION)
	{
		super();

		this._fId_num = aTipId_num;
		this._fCaptionAsset_str = aCaptionAsset_str;
		this._fTipAsset_str = aTipAsset_str;
		this._fTipDurationMs_num = aOptTipDurationMs_num;

		this._fBackContainer_sprt = null;
		this._fBack_spr = null;
		this._fLeftEdge_sprt = null;
		this._fRightEdge_sprt = null;
		this._fCaption_ta = null;
		this._fImage_sprt = null;
		this._fShowTimer_tmr = null;
		this._fEnabled_bln = true;

		this._init();
	}

	_init()
	{
		this._addBack();
		this._addCaption();
		this._addImage();

		this._format();
	}

	_addBack()
	{
		this._fBackContainer_sprt = this.addChild(new Sprite());
		this._fBackContainer_sprt.position.set(0, -5);

		this._fBack_spr = this._fBackContainer_sprt.addChild(APP.library.getSprite("tips/back"));

		this._fLeftEdge_sprt = this._fBackContainer_sprt.addChild(APP.library.getSprite("tips/back_edge_left"));
		this._fLeftEdge_sprt.anchor.set(1, 0.5);
		this._fRightEdge_sprt = this._fBackContainer_sprt.addChild(APP.library.getSprite("tips/back_edge_right"));
		this._fRightEdge_sprt.anchor.set(0, 0.5);
	}

	_addCaption()
	{
		this._fCaption_ta = this.addChild(I18.generateNewCTranslatableAsset(this._fCaptionAsset_str));

		let text = this._fCaption_ta.text;
		if (text && ~text.indexOf("/MINUS_IMG/"))
		{
			let posTadId = "TATipsBetLevel"+(APP.isMobile?"Mobile":"")+"MinusPosition";
			this._changeCaptionTag("/MINUS_IMG/", "player_spot/bet_level/btn_minus_glow", posTadId);
		}
		if (text && ~text.indexOf("/PLUS_IMG/"))
		{
			let posTadId = "TATipsBetLevel"+(APP.isMobile?"Mobile":"")+"PlusPosition";
			this._changeCaptionTag("/PLUS_IMG/", "player_spot/bet_level/btn_plus_glow", posTadId);
		}
	}

	_changeCaptionTag(tag, imgSrc, posTadId)
	{
		let textField = this._fCaption_ta.assetContent;
		textField.uncache();
		let text = textField.text;

		textField.text = " ";
		let spaceWidth = textField.textBounds.width;
		textField.text = text;

		let img = this._fCaption_ta.addChild(APP.library.getSprite(imgSrc));
		img.scale.set(0.5);
		let imgWidth = img.getBounds().width;

		let spacesCount = Math.ceil(imgWidth / spaceWidth);
		let spaces = "";
		while (spacesCount--) spaces += " ";
		if (spacesCount > 2) spacesCount -= 2;
		textField.text = text.replace(tag, spaces);

		let posDescriptor = I18.getTranslatableAssetDescriptor(posTadId);
		if (posDescriptor)
		{
			let areaDescriptor = posDescriptor.areaInnerContentDescriptor.areaDescriptor;
			img.position.set(areaDescriptor.x, areaDescriptor.y);
		}
	}

	_addImage()
	{
		if (!this._isImageDefined) return;

		this._fImage_sprt = this.addChild(APP.library.getSprite(this._fTipAsset_str));
	}

	get _isImageDefined()
	{
		return !!this._fTipAsset_str;
	}

	_format()
	{
		if (this._isImageDefined)
		{
			let lImageBounds_obj = this._fImage_sprt.getBounds();

			let lCaptionBounds_obj = this._fCaption_ta.getBounds();
			let lBackBounds_obj = this._fBack_spr.getBounds();
			let lIndentY_num = 12;
			let lIndentX_num = 2;

			let lBackScaleX_num = (lCaptionBounds_obj.width + lImageBounds_obj.width + lIndentX_num) / lBackBounds_obj.width;
			let lBackScaleY_num = (lCaptionBounds_obj.height + lIndentY_num) / (lBackBounds_obj.height - 10);

			this._fBack_spr.scale.x = lBackScaleX_num;
			this._fBack_spr.scale.y = lBackScaleY_num;

			this._fLeftEdge_sprt.scale.y = lBackScaleY_num;
			this._fRightEdge_sprt.scale.y = lBackScaleY_num;

			let lUpdatedBackBounds_obj = this._fBack_spr.getBounds();
			let lEdgeIndent_num = lUpdatedBackBounds_obj.width/2;
			this._fLeftEdge_sprt.x = -lEdgeIndent_num;
			this._fRightEdge_sprt.x = lEdgeIndent_num;

			this._fCaption_ta.position.set(-lCaptionBounds_obj.width/2 + lImageBounds_obj.width/2 + lIndentX_num/2 + 5, 0);
			this._fImage_sprt.position.set(-lUpdatedBackBounds_obj.width/2 + lImageBounds_obj.width/2 - 5, 0);

			this._fBackContainer_sprt.pivot.y = -10*lBackScaleY_num;
		}
		else
		{
			let lCaptionBounds_obj = this._fCaption_ta.getBounds();
			let lBackBounds_obj = this._fBack_spr.getBounds();
			let lIndentY_num = 12;

			let lBackScaleX_num = lCaptionBounds_obj.width / lBackBounds_obj.width;
			let lBackScaleY_num = (lCaptionBounds_obj.height + lIndentY_num) / (lBackBounds_obj.height - 10);

			this._fBack_spr.scale.x = lBackScaleX_num;
			this._fBack_spr.scale.y = lBackScaleY_num;

			this._fLeftEdge_sprt.scale.y = lBackScaleY_num;
			this._fRightEdge_sprt.scale.y = lBackScaleY_num;

			let lUpdatedBackBounds_obj = this._fBack_spr.getBounds();
			let lEdgeIndent_num = lUpdatedBackBounds_obj.width/2;
			this._fLeftEdge_sprt.x = -lEdgeIndent_num;
			this._fRightEdge_sprt.x = lEdgeIndent_num;

			this._fCaption_ta.position.set(-lCaptionBounds_obj.width/2, 0);

			this._fBackContainer_sprt.pivot.y = -10*lBackScaleY_num;
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
				if (this._fTipDurationMs_num == -1) return;

				this._fShowTimer_tmr && this._fShowTimer_tmr.destructor();
				this._fShowTimer_tmr = new Timer(() => this._onShowTimerCompleted(), this._fTipDurationMs_num);
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
		this._fShowTimer_tmr && this._fShowTimer_tmr.destructor();

		this._fId_num = null;
		this._fCaptionAsset_str = null;
		this._fTipAsset_str = null;
		this._fTipDurationMs_num = null;

		this._fBackContainer_sprt = null;
		this._fBack_spr = null;
		this._fLeftEdge_sprt = null;
		this._fRightEdge_sprt = null;
		this._fCaption_ta = null;
		this._fImage_sprt = null;
		this._fShowTimer_tmr = null;
		this._fEnabled_bln = null;

		super.destroy();
	}
}

export default TooltipView;