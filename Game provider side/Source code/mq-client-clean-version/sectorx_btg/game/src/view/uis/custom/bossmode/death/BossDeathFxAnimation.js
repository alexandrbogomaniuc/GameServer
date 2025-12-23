import Sprite from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import Timer from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import { FRAME_RATE} from '../../../../../../../shared/src/CommonConstants';


class BossDeathFxAnimation extends Sprite
{
	static get EVENT_ANIMATION_COMPLETED()			{return "onBossDeathFxAnimationCompleted";}
	static get EVENT_ON_TIME_TO_DEFEATED_CAPTION()		{ return "onBossTimeToDefeatedCaption"}	

	constructor()
	{
		super();

		this._fBossZombie_e = null;
		this._fStartDefeatedCaptionTimer_tmr = null;
		this._fDefatedAnimationTimerExpected_bl = null;
	}

	get _defeatedCaptionTime()
	{
		return 83 * FRAME_RATE;
	}

	_startAnimation(aZombieView_e)
	{
		this._fBossZombie_e = aZombieView_e;

		this._fBossZombie_e.isBossSequenceActive = true;

		this._fDefatedAnimationTimerExpected_bl = true;

		let lTimer = this._fStartDefeatedCaptionTimer_tmr = new Timer(()=>{
			lTimer && lTimer.destructor();
			this.emit(BossDeathFxAnimation.EVENT_ON_TIME_TO_DEFEATED_CAPTION);
			this._fDefatedAnimationTimerExpected_bl = false;
			
		}, this._defeatedCaptionTime, true);
	}

	__onTimeToExplodeCoin()
	{
		this._fBossZombie_e && this._fBossZombie_e.onTimeToExplodeCoins();				
	}

	__onBossDeathAnimationCompleted()
	{
		this._fBossZombie_e && this._fBossZombie_e.onDissaperingDeathAnimationCompleted();
		this.emit(BossDeathFxAnimation.EVENT_ANIMATION_COMPLETED);

		if (this._fDefatedAnimationTimerExpected_bl) //if the time for the title is defeated is not set correctly, start the animation immediately
		{
			this._fStartDefeatedCaptionTimer_tmr && this._fStartDefeatedCaptionTimer_tmr.destructor();
			this.emit(BossDeathFxAnimation.EVENT_ON_TIME_TO_DEFEATED_CAPTION);
			this._fDefatedAnimationTimerExpected_bl = false;
		}
	}

	destroy()
	{	
		super.destroy();

		this._fBossZombie_e = null;
		this._fDefatedAnimationTimerExpected_bl = null;

		this._fStartDefeatedCaptionTimer_tmr && this._fStartDefeatedCaptionTimer_tmr.destructor();
		this._fStartDefeatedCaptionTimer_tmr = null;
	}
}

export default BossDeathFxAnimation;