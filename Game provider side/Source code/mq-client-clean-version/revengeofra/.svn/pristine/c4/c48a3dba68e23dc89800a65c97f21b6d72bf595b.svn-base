import Sprite from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import Sequence from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import BossModeUtils from '../BossModeUtils';
import I18 from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
import Timer from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import { FRAME_RATE } from '../../../../../../../shared/src/CommonConstants';

class BossModeCaptionView extends Sprite
{
	static get EVENT_ON_ANIMATION_STARTED()		{return "onCaptionAnimationStarted";}

	playAnimation(bossId, startDelay, finishDelay)
	{
		this._playAnimation(bossId, startDelay, finishDelay);
	}

	//INIT...
	constructor() 
	{
		super();

		this._fCaptionContainer_sprt = null;
		this._fCaption_sprt = null;
		this._fCaptionSmoke_sprt = null;

		this._fSmokeTimer_t = null;
		this._fStartTimer_t = null;
	}

	//...INIT

	_playAnimation(bossId, startDelay, finishDelay)
	{
		if (startDelay == undefined)
		{
			startDelay = this._startDelay;
		}

		if (finishDelay == undefined)
		{
			finishDelay = this._captionFinishDelay;
		}

		this._fCaptionContainer_sprt = this.addChild(new Sprite());
		this._fCaptionContainer_sprt.alpha = 0;

		this._fCaption_sprt = this._fCaptionContainer_sprt.addChild(I18.generateNewCTranslatableAsset(`TABossMode${bossId}Label`));
		this._fCaptionSmoke_sprt = this._fCaptionContainer_sprt.addChild(I18.generateNewCTranslatableAsset(`TABossMode${bossId}SmokeLabel`));
		this._fCaptionSmoke_sprt.assetContent.blendMode = PIXI.BLEND_MODES.ADD;
		this._fCaptionSmoke_sprt.alpha = 0;

		let lAlphaSeq_arr = [
			{ tweens:[{prop:"alpha", to:1}], duration:25*FRAME_RATE },
			{ tweens:[], duration:finishDelay, onfinish: this._onCaptionFinish.bind(this) }
		];

		let lWiggleSeq_arr = BossModeUtils.generateWiggleSequence({ x:5, y:5, period:30*FRAME_RATE, duration:52*FRAME_RATE });

		let lStartDelay_num = startDelay;
		let lSmokeDelay_num = startDelay + finishDelay + this._smokeDelay;

		Sequence.start(this._fCaptionContainer_sprt, lAlphaSeq_arr, lStartDelay_num);
		Sequence.start(this._fCaptionContainer_sprt, lWiggleSeq_arr, lStartDelay_num);

		this._fCaptionSmoke_sprt.visible = false;

		this._fSmokeTimer_t && this._fSmokeTimer_t.destructor();
		this._fSmokeTimer_t = new Timer(this._onCaptionSmokeAppearingTime.bind(this), lSmokeDelay_num);

		this._fStartTimer_t && this._fStartTimer_t.destructor();
		this._fStartTimer_t = new Timer(this._onAnimationStarted.bind(this), lStartDelay_num);
	}

	_onAnimationStarted()
	{
		this.emit(BossModeCaptionView.EVENT_ON_ANIMATION_STARTED);
	}

	get _captionFinishDelay()
	{
		return 51*FRAME_RATE;
	}

	get _startDelay()
	{
		return 128*FRAME_RATE;
	}

	get _smokeDelay()
	{
		return 17*FRAME_RATE;
	}

	_onCaptionFinish()
	{
		this._fCaption_sprt.visible = false;
	}

	_onCaptionSmokeAppearingTime()
	{
		this._fCaptionSmoke_sprt.visible = true;

		Sequence.start(this._fCaptionSmoke_sprt, this._smokeAlphaSequence);
		Sequence.start(this._fCaptionSmoke_sprt, this._smokeOffsetSequence);
	}

	get _smokeAlphaSequence()
	{
		return [
			{ tweens:[{prop:"alpha", to:1}],		duration:8*FRAME_RATE },
			{ tweens:[],							duration:18*FRAME_RATE },
			{ tweens:[{prop:"alpha", to:0}],		duration:29*FRAME_RATE }
		];
	}

	get _smokeOffsetSequence()
	{
		return [
			{ tweens:[], duration:11*FRAME_RATE },
			{ tweens:[{prop:"position.y", to:-81}], duration:83*FRAME_RATE, onfinish: this._onCaptionAnimationCompleted.bind(this) }
		];
	}

	_onCaptionAnimationCompleted()
	{
		this.destroy();
	}

	destroy()
	{
		this._fStartTimer_t && this._fStartTimer_t.destructor();
		this._fStartTimer_t = null;

		this._fCaption_sprt && this._fCaption_sprt.destroy();
		this._fCaption_sprt = null;

		if (this._fCaptionSmoke_sprt)
		{
			Sequence.destroy(Sequence.findByTarget(this._fCaptionSmoke_sprt));
			this._fCaptionSmoke_sprt.destroy();
			this._fCaptionSmoke_sprt = null;
		}

		if (this._fCaptionContainer_sprt)
		{
			Sequence.destroy(Sequence.findByTarget(this._fCaptionContainer_sprt));
			this._fCaptionContainer_sprt.destroy();
			this._fCaptionContainer_sprt = null;
		}

		this._fSmokeTimer_t && this._fSmokeTimer_t.destructor();
		this._fSmokeTimer_t = null;

		super.destroy();
	}
}

export default BossModeCaptionView;