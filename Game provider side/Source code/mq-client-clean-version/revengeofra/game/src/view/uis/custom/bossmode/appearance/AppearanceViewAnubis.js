import { ENEMIES, FRAME_RATE } from '../../../../../../../shared/src/CommonConstants';
import Timer from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import AppearanceAnubisMagicCircleView from './magic_circle/AppearanceAnubisMagicCircleView';
import Sequence from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import AppearanceView from './AppearanceView';

class AppearanceViewAnubis extends AppearanceView
{
	constructor() 
	{
		super();

		this._fHideTintTimer_t = null;
	}

	//INIT...
	_initSealView()
	{
		super._initSealView();

		this._fSealContainer_sprt.position.set(10, 20);
	}

	_initSmokeView()
	{
		super._initSmokeView();

		this._fCenterSmoke_sprt.position.set(220, -206);
	}

	_initMagicCircleView()
	{
		super._initMagicCircleView();

		this._fMagicCircleView_bmamcv.position.set(20, 60);
	}

	get _captionPosition()
	{
		return { x:0, y:-4 };
	}

	get _appearanceMagicCircleViewInstance()
	{
		return new AppearanceAnubisMagicCircleView();
	}

	get _bossType()
	{
		return ENEMIES.Anubis;
	}
	//...INIT

	//ANIMATION...
	_playAppearingAnimation()
	{
		super._playAppearingAnimation();

		this._fHideTintTimer_t = new Timer(this._onHideTintTimer.bind(this), 213*FRAME_RATE);
	}

	_onAppearingIntroTime()
	{
		super._onAppearingIntroTime();

		this.emit(AppearanceView.EVENT_APPEARING_PRESENTATION_STARTED, {duration: 29*FRAME_RATE, noTint: false});
	}

	_startSealAnimation()
	{
		super._startSealAnimation();

		let lShadowSealSeq_arr = [
			{ tweens:[{prop:"alpha", from:1, to:0}, {prop:"y", to:-48}], duration:34*FRAME_RATE },
		];

		Sequence.start(this._fSealShadow_sprt, lShadowSealSeq_arr, 205*FRAME_RATE);
	}

	get _lightningAppearOffset()
	{
		return 40;
	}

	_onAppearingCulminated()
	{
		super._onAppearingCulminated();

		this.emit(AppearanceView.EVENT_APPEARING_PRESENTATION_CULMINATED, {duration: 33*FRAME_RATE, noTint: true});
	}

	_onAppearingCompletionTime()
	{
		super._onAppearingCompletionTime();

		this.emit(AppearanceView.EVENT_APPEARING_PRESENTATION_COMPLETION, {duration: 14*FRAME_RATE, hideTint: false});
	}

	_onHideTintTimer()
	{
		this.emit(AppearanceView.EVENT_HIDE_TINTED_VIEW, {duration: 49*FRAME_RATE, hideTint: true})
	}

	_onTimeToStartCaptionAnimation()
	{
		this.emit(AppearanceView.EVENT_ON_TIME_TO_START_CAPTION_ANIMATION, {captionPosition: this._captionPosition});
	}
	//...ANIMATION

	destroy()
	{
		super.destroy();

		Sequence.destroy(Sequence.findByTarget(this._fSealShadow_sprt));

		this._fHideTintTimer_t && this._fHideTintTimer_t.destructor();
		this._fHideTintTimer_t = null;
	}
}

export default AppearanceViewAnubis;