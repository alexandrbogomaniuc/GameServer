import Sprite from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Timer from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import GameScreen from '../../../../../main/GameScreen';

class AppearanceView extends Sprite
{
	static get EVENT_APPEARING_STARTED()					{ return "onBossModeAppearingStarted"; }
	static get EVENT_APPEARING_PRESENTATION_STARTED()		{ return "onBossModeAppearingPresentationStarted"; }
	static get EVENT_APPEARING_PRESENTATION_CULMINATED()	{ return "onBossModeAppearingPresentationCulminated"; }
	static get EVENT_APPEARING_PRESENTATION_COMPLETION()	{ return "onBossModeAppearingPresentationCompletion"; }
	static get EVENT_APPEARING_PRESENTATION_COMPLETED()		{ return "onBossModeAppearingPresentationCompleted"; }
	static get EVENT_ON_TIME_TO_START_CAPTION_ANIMATION() 	{ return "onTimeToStartCaptionAnimation"; }
	static get EVENT_SHAKE_THE_GROUND_REQUIRED() 			{ return "onShakeTheGroundRequired"; }

	startAppearing(aZombieView_e)
	{
		this._startAppearing(aZombieView_e);
	}

	interruptAnimation()
	{
		this._destroyAnimation();
	}

	//INIT...
	constructor()
	{
		super();

		this._fBossZombie_e = null;
		this._fYellowView_sprt = null;
		this._fTimer_t = null;
	}
	//...INIT

	/**
	 * @protected
	 * @virtual
	 */
	__onBossBecomeVisible()
	{
		APP.gameScreen.off(GameScreen.EVENT_ON_BOSS_BECOME_VISIBLE, this.__onBossBecomeVisible, this, true);
	}

	/**
	 * @protected
	 * @virtual
	 */
	__onBossAppeared()
	{
		APP.gameScreen.off(GameScreen.EVENT_ON_BOSS_APPEARED, this.__onBossAppeared, this, true);
		this.__onTimeToStartCaptionAnimation();
	}

	/**
	 * @protected
	 * @virtual
	 */
	__onTimeToStartCaptionAnimation()
	{
		this.emit(AppearanceView.EVENT_ON_TIME_TO_START_CAPTION_ANIMATION);
	}

	get _needShowBossOnCulminateImmediately()
	{
		return true;
	}

	//APPEARING PRESENTATION...
	_startAppearing(aZombieView_e)
	{
		this._fBossZombie_e = aZombieView_e;

		this._fTimer_t && this._fTimer_t.destructor();
		this._fTimer_t = new Timer(this._onAppearingIntroTime.bind(this), this._appearingIntroDelay);

		this.emit(AppearanceView.EVENT_APPEARING_STARTED);
	}

	_onAppearingIntroTime()
	{
		this._fTimer_t && this._fTimer_t.destructor();
		this._fTimer_t = null;

		this._playAppearingAnimation();
	}

	_playAppearingAnimation()
	{
		this._fTimer_t && this._fTimer_t.destructor();
		this._fTimer_t = new Timer(this._onAppearingCulminated.bind(this), this._appearingCulminationTime);

		this.visible = true;
	}

	_onAppearingCulminated()
	{
		if (this._fBossZombie_e)
		{
			APP.gameScreen.once(GameScreen.EVENT_ON_BOSS_BECOME_VISIBLE, this.__onBossBecomeVisible, this);
			APP.gameScreen.once(GameScreen.EVENT_ON_BOSS_APPEARED, this.__onBossAppeared, this);
			this._fBossZombie_e.showBossAppearance(this._needShowBossOnCulminateImmediately)
		}
		this._fTimer_t && this._fTimer_t.destructor();
	}

	_onAppearingCompleted()
	{
		this._fTimer_t && this._fTimer_t.destructor();
		this._fTimer_t = null;

		this.visible = false;
		this.emit(AppearanceView.EVENT_APPEARING_PRESENTATION_COMPLETED);

		this.interruptAnimation();
	}
	//...APPEARING PRESENTATION

	_destroyAnimation()
	{
		this._fTimer_t && this._fTimer_t.destructor();
		this._fTimer_t = null;

		this._fBossZombie_e = null;
	}

	destroy()
	{
		APP.gameScreen.off(GameScreen.EVENT_ON_BOSS_BECOME_VISIBLE, this.__onBossBecomeVisible, this, true);
		APP.gameScreen.off(GameScreen.EVENT_ON_BOSS_APPEARED, this.__onBossAppeared, this, true);
		this._destroyAnimation();
		super.destroy();

		this._fBossZombie_e = null;

		this._fTimer_t && this._fTimer_t.destructor();
		this._fTimer_t = null;
	}
}

export default AppearanceView;