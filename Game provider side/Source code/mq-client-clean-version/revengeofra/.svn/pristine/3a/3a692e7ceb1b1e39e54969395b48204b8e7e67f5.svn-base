import { APP } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sprite from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import Sequence from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import Timer from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import { FRAME_RATE } from '../../../../../../../../shared/src/CommonConstants';

class AppearanceMarkerSmokeView extends Sprite
{
	play(initialDelay, disappearDelay, disappearDuration)
	{
		this._playSmokeAnimations(initialDelay, disappearDelay, disappearDuration);
	}

	stop()
	{
	}

	//INIT...
	constructor(smokeAssetName) 
	{
		super();

		this._fSmoke1_sprt = this.addChild(this._generateSmoke(smokeAssetName));
		this._fSmoke1_sprt.alpha = 0;
		this._fSmoke2_sprt = this.addChild(this._generateSmoke(smokeAssetName));
		this._fSmoke2_sprt.alpha = 0;
		this._fSmoke3_sprt = this.addChild(this._generateSmoke(smokeAssetName));
		this._fSmoke3_sprt.alpha = 0;

		this._fLastSequence_s = null;

		this._fDisappearDuration_num = undefined;
		this._fInitialDelay_num = 0;
		
		this._fTimer_t = null;
	}

	_generateSmoke(smokeAssetName)
	{
		let l_sprt = APP.library.getSprite(smokeAssetName);
		l_sprt.scale.set(2);
		l_sprt.blendMode = PIXI.BLEND_MODES.ADD;
		return l_sprt;
	}//...INIT

	_playSmokeAnimations(initialDelay, disappearDelay, disappearDuration)
	{
		this._fDisappearDuration_num = disappearDuration;
		this._fInitialDelay_num = initialDelay;

		this._destroyTimer();
		this._fTimer_t = new Timer(this._onDisappearDelayTimerCompleted.bind(this), (initialDelay+disappearDelay));

		this._startSequences();
	}

	_startSequences()
	{
		if (this._fLastSequence_s)
		{
			this._fLastSequence_s.off(Sequence.EVENT_ON_SEQUENCE_PLAYING_COMPLETED, this._startSequences, this);
		}

		this._fSmoke1_sprt.position.set(0, 0);
		this._fSmoke2_sprt.position.set(0, 0);
		this._fSmoke3_sprt.position.set(0, 0);

		let lSeq_arr = [
			{ tweens:[{prop:"alpha", from:0, to:1}], duration:1*FRAME_RATE },
			{ tweens:[{prop:"x", to:1}, {prop:"y", to:-59}], duration:14*FRAME_RATE },
			{ tweens:[{prop:"x", to:2}, {prop:"y", to:-110}, {prop:"alpha", to:0}], duration:14*FRAME_RATE }
		];

		Sequence.start(this._fSmoke1_sprt, lSeq_arr, this._fInitialDelay_num);
		Sequence.start(this._fSmoke2_sprt, lSeq_arr, this._fInitialDelay_num+14*FRAME_RATE);
		this._fLastSequence_s = Sequence.start(this._fSmoke3_sprt, lSeq_arr, this._fInitialDelay_num*2);
		this._fLastSequence_s.once(Sequence.EVENT_ON_SEQUENCE_PLAYING_COMPLETED, this._startSequences, this);
	}

	_onDisappearDelayTimerCompleted()
	{
		this._destroyTimer();

		if (this._fLastSequence_s)
		{
			this._fLastSequence_s.off(Sequence.EVENT_ON_SEQUENCE_PLAYING_COMPLETED, this._startSequences, this);
		}

		this._playDisappearingAnimation();
	}

	_playDisappearingAnimation()
	{
		let seq = [
			{
				tweens: [{prop: "alpha", to: 0}],
				duration: this._fDisappearDuration_num,
				onfinish: () => this._onDisappeared()
			}
		];
		Sequence.start(this, seq);
	}

	_onDisappeared()
	{
		this.destroy();
	}

	_destroyTimer()
	{
		this._fTimer_t && this._fTimer_t.destructor();
		this._fTimer_t = null;
	}

	destroy()
	{
		this._destroyTimer();

		this._fDisappearDuration_num = undefined;

		if (this._fLastSequence_s)
		{
			this._fLastSequence_s.off(Sequence.EVENT_ON_SEQUENCE_PLAYING_COMPLETED, this._startSequences, this);
			this._fLastSequence_s.destructor();
			this._fLastSequence_s = null;
		}

		if (this._fSmoke1_sprt)
		{
			Sequence.destroy(Sequence.findByTarget(this._fSmoke1_sprt));
			this._fSmoke1_sprt.destroy();
			this._fSmoke1_sprt = null;
		}
		
		if (this._fSmoke2_sprt)
		{
			Sequence.destroy(Sequence.findByTarget(this._fSmoke2_sprt));
			this._fSmoke2_sprt.destroy();
			this._fSmoke2_sprt = null;
		}

		if (this._fSmoke3_sprt)
		{
			Sequence.destroy(Sequence.findByTarget(this._fSmoke3_sprt));
			this._fSmoke3_sprt.destroy();
			this._fSmoke3_sprt = null;
		}

		Sequence.destroy(Sequence.findByTarget(this));

		super.destroy.call(this);
	}
}

export default AppearanceMarkerSmokeView;