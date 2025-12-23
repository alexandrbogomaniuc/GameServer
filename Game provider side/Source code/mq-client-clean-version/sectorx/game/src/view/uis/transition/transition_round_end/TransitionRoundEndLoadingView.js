import SimpleUIView from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/SimpleUIView';
import { FRAME_RATE } from '../../../../../../shared/src/CommonConstants';
import Sequence from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { Sprite } from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import Timer from "../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer";
import I18 from "../../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18";

class TransitionRoundEndLoadingView extends SimpleUIView
{
	static get EVENT_ON_INTRO_COMPLETED() { return "EVENT_ON_INTRO_COMPLETED"; }
	static get EVENT_ON_OUTRO_COMPLETED() { return "EVENT_ON_OUTRO_COMPLETED"; }

	constructor()
	{
		super();

		this._fCaptionContainer_spr = null;
		this._fRoundCompletedCaption_ta = null;
		this._fNextRoundCaption_ta = null;

		this._fBarContainer_spr = null;
		this._fBarBg_spr = null;
		this._fBarFillContainer_spr = null;
		this._fBarFill_spr = null;
		this._fBarMask_pg = null;

		this._fCaptionIntroPlaying_bl = null;
		this._fCaptionOutroPlaying_bl = null;

		this._fBarIntroPlaying_bl = null;
		this._fBarOutroPlaying_bl = null;

		this._fCurrentProgress_num  = 0;
		this._fLoadingTimer_t = null;

		this._initCaption();
		this._initLoading();
	}

	_initCaption()
	{
		this._fCaptionContainer_spr = this.addChild(new Sprite());
		this._fCaptionContainer_spr.alpha = 0;

		this._fRoundCompletedCaption_ta = this._fCaptionContainer_spr.addChild(I18.generateNewCTranslatableAsset("TATransitionRoundRoundCompletedCaption"));
		this._fRoundCompletedCaption_ta.position.set(54, -43);

		this._fNextRoundCaption_ta = this._fCaptionContainer_spr.addChild(I18.generateNewCTranslatableAsset("TATransitionRoundNextRoundLoadingCaption"));
		this._fNextRoundCaption_ta.position.set(54, 16);

		this._redfundCapture_ta = this._fCaptionContainer_spr.addChild(I18.generateNewCTranslatableAsset("TARefundEndGameValue"));
		this._redfundCapture_ta.position.set(54, 120);
		this._redfundCapture_str = this._redfundCapture_ta.text;
		this._redfundCapture_ta.visible = false;
	}
		

	_initLoading()
	{
		this._fBarContainer_spr = this.addChild(new Sprite());
		this._fBarContainer_spr.alpha = 0;
		this._fBarContainer_spr.position.set(0, 69 - 36);

		this._fBarBg_spr = this._fBarContainer_spr.addChild(APP.library.getSprite("transition/loading_bar_bg"));
		this._fBarBg_spr.position.set(0, 0);

		this._fBarFillContainer_spr = this._fBarContainer_spr.addChild(new Sprite());
		this._fBarFill_spr = this._fBarFillContainer_spr.addChild(APP.library.getSprite("transition/loading_bar_fill"));		
		let lMask_g = this._fBarMask_pg = this._fBarFill_spr.addChild(new PIXI.Graphics());
		lMask_g.beginFill(0x000000).drawRect(-42, -6, 84, 12);
		this._fBarFill_spr.mask = lMask_g;

		this._fBarFrame_spr = this._fBarContainer_spr.addChild(APP.library.getSprite("transition/loading_bar_frame"));
	}

	_updateLoadingCounter()
	{
		if (this._fCurrentProgress_num > 300)
		{
			this._fCurrentProgress_num = 0;
		}

		const refundAmmount = APP.endOfRoundRefund;
		console.log("BalanceProblem of round refund game  " + refundAmmount); 
		if(!!refundAmmount && refundAmmount !=0)
		{
			this._redfundCapture_ta.text = this._redfundCapture_str + " " + APP.currencyInfo.i_formatNumber(refundAmmount, true);
			this._redfundCapture_ta.visible = true;
		}else{
			this._redfundCapture_ta.visible = false;
		}


		this._fCurrentProgress_num += 2;
		this._updateBarPosition();
		this._fLoadingTimer_t && this._fLoadingTimer_t.destructor();
		this._fLoadingTimer_t = new Timer(this._updateLoadingCounter.bind(this), 3);
	}

	_updateBarPosition()
	{
		let offset = 0;

		if (this._fCurrentProgress_num <= 81)
		{
			offset = 81 - this._fCurrentProgress_num;
		}		
		else if (this._fCurrentProgress_num > (157))
		{
			offset = - (this._fCurrentProgress_num - (157));
		}
		
		this._fBarFill_spr.position.set(this._fCurrentProgress_num - 119, 0);
		this._fBarMask_pg.position.set(offset, 0);
	}

	startIntro()
	{
		this._startCaptionIntro();

		this._fCurrentProgress_num  = -200;
		this._updateBarPosition();

		this._startBarIntro();
	}

	startLoop()
	{
		this._fCaptionContainer_spr.alpha = 1;
		this._fBarContainer_spr.alpha = 1;	
		this._updateLoadingCounter();
	}

	startOutro()
	{
		this._startCaptionOutro();
		this._startBarOutro();
	}
	
	_startCaptionIntro()
	{
		this._fCaptionContainer_spr.alpha = 0;
		this._fCaptionIntroPlaying_bl = true;

		let l_seq = [
			{tweens: [], duration: 38 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}], duration: 19 * FRAME_RATE,
			onfinish: () => {
				this._fCaptionIntroPlaying_bl = false;
				this._completeIntroAnimationSuspicision();
		}}];

		Sequence.start(this._fCaptionContainer_spr, l_seq);
	}

	_startCaptionOutro()
	{
		this._fCaptionOutroPlaying_bl = true;

		let l_seq = [
			{tweens: [], duration: 5 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0}], duration: 19 * FRAME_RATE,
			onfinish: () => {
				this._fCaptionOutroPlaying_bl = false;
				this._completeOutroAnimationSuspicision();
		}}];

		Sequence.start(this._fCaptionContainer_spr, l_seq);
	}

	_startBarIntro()
	{
		this._fBarContainer_spr.alpha = 0;
		this._fBarIntroPlaying_bl = true;

		let l_seq = [
			{tweens: [], duration: 40 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}], duration: 15 * FRAME_RATE,
			onfinish: () => {
				this._fBarIntroPlaying_bl = false;
				this._completeIntroAnimationSuspicision();
		}}];

		Sequence.start(this._fBarContainer_spr, l_seq);
	}

	_startBarOutro()
	{
		this._fBarOutroPlaying_bl = true;

		let l_seq = [
			{tweens: [], duration: 9 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0}], duration: 16 * FRAME_RATE,
			onfinish: () => {
				this._fBarOutroPlaying_bl = false;
				this._completeOutroAnimationSuspicision();
		}}];

		Sequence.start(this._fBarContainer_spr, l_seq);
	}

	_completeIntroAnimationSuspicision()
	{
		if (!this._fCaptionIntroPlaying_bl && !this._fBarIntroPlaying_bl)
		{
			this._updateLoadingCounter();
			this.emit(TransitionRoundEndLoadingView.EVENT_ON_INTRO_COMPLETED);
		}
	}

	_completeOutroAnimationSuspicision()
	{
		if (!this._fCaptionOutroPlaying_bl && !this._fBarOutroPlaying_bl)
		{
			this._fLoadingTimer_t && this._fLoadingTimer_t.destructor();
			this.emit(TransitionRoundEndLoadingView.EVENT_ON_OUTRO_COMPLETED);
		}
	}

	interrupt()
	{
		this._fLoadingTimer_t && this._fLoadingTimer_t.destructor();

		this._fCaptionContainer_spr && Sequence.destroy(Sequence.findByTarget(this._fCaptionContainer_spr));
		this._fCaptionContainer_spr.alpha = 0;

		this._fBarContainer_spr && Sequence.destroy(Sequence.findByTarget(this._fBarContainer_spr));
		this._fBarContainer_spr.alpha = 0;
	}

	destroy()
	{
		this._fLoadingTimer_t && this._fLoadingTimer_t.destructor();
		this._fLoadingTimer_t = null;

		this._fRoundCompletedCaption_ta = null;
		this._fNextRoundCaption_ta = null;
		this._fCaptionContainer_spr && Sequence.destroy(Sequence.findByTarget(this._fCaptionContainer_spr));
		this._fCaptionContainer_spr = null;

		this._fBarContainer_spr && Sequence.destroy(Sequence.findByTarget(this._fBarContainer_spr));

		this._fBarFill_spr = null;
		this._fBarMask_pg = null;
		this._fBarFillContainer_spr = null;
		this._fBarContainer_spr = null;
		this._fBarBg_spr = null;

		this._fCaptionIntroPlaying_bl = null;
		this._fCaptionOutroPlaying_bl = null;

		this._fBarIntroPlaying_bl = null;
		this._fBarOutroPlaying_bl = null;

		this._fCurrentProgress_num  = 0;
		

		super.destroy();
	}
}

export default TransitionRoundEndLoadingView