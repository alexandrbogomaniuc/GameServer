import SimpleUIView from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/SimpleUIView';
import { ENEMIES, FRAME_RATE } from '../../../../../../shared/src/CommonConstants';
import Timer from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import BossModeDisappearanceFxView from './death/BossModeDisappearanceFxView';
import AppearanceView from './appearance/AppearanceView';
import BossModeCaptionView from './appearance/captions/BossModeCaptionView';
import BossModePlayerWinAnimation from './death/BossModePlayerWinAnimation';
import LightningBossAppearanceView from './appearance/LightningBossAppearanceView';
import EarthAppearanceView from './appearance/EarthAppearanceView';
import IceBossAppearanceView from './appearance/IceBossAppearanceView';
import FireBossAppearanceView from './appearance/FireBossAppearanceView';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';

import LightningBossDeathFxAnimation from './death/LightningBossDeathFxAnimation';
import FireBossDeathFxAnimation from './death/FireBossDeathFxAnimation';
import EarthBossDeathFxAnimation from './death/EarthBossDeathFxAnimation';
import BossDeathFxAnimation from './death/BossDeathFxAnimation';
import IceBossDeathFxAnimation from './death/IceBossDeathFxAnimation';
import EarthBossCaptionView from './appearance/captions/EarthBossCaptionView';
import FireBossCaptionView from './appearance/captions/FireBossCaptionView';
import IceBossCaptionView from './appearance/captions/IceBossCaptionView';
import LightningBossCaptionView from './appearance/captions/LightningBossCaptionView';

class BossModeView extends SimpleUIView
{
	static get EVENT_APPEARING_STARTED()					{return AppearanceView.EVENT_APPEARING_STARTED;}
	static get EVENT_APPEARING_PRESENTATION_STARTED()		{return AppearanceView.EVENT_APPEARING_PRESENTATION_STARTED;}
	static get EVENT_APPEARING_PRESENTATION_CULMINATED()	{return AppearanceView.EVENT_APPEARING_PRESENTATION_CULMINATED;}
	static get EVENT_APPEARING_PRESENTATION_COMPLETION()	{return AppearanceView.EVENT_APPEARING_PRESENTATION_COMPLETION;}
	static get EVENT_APPEARING_PRESENTATION_COMPLETED()		{return AppearanceView.EVENT_APPEARING_PRESENTATION_COMPLETED;}
	static get EVENT_SHAKE_THE_GROUND_REQUIRED() 			{return AppearanceView.EVENT_SHAKE_THE_GROUND_REQUIRED;}

	static get EVENT_DISAPPEARING_PRESENTATION_STARTED()	{return "onDisappearingPresentationStarted";}
	static get EVENT_DISAPPEARING_PRESENTATION_COMPLETION()	{return "onDisappearingPresentationCompleteon";}
	static get EVENT_DISAPPEARING_PRESENTATION_COMPLETED()	{return "onDisappearingPresentationCompleted";}
	static get EVENT_ON_CAPTION_BECAME_VISIBLE()			{return BossModeCaptionView.EVENT_ON_CAPTION_BECAME_VISIBLE;}
	static get EVENT_ON_TIME_TO_DEFEATED_CAPTION()			{return BossDeathFxAnimation.EVENT_ON_TIME_TO_DEFEATED_CAPTION;}
	static get EVENT_ON_PLAYER_WIN_CAPTION_FINISHED()		{return BossModePlayerWinAnimation.EVENT_ON_WIN_ANIMATION_COMPLETED;}

	addToContainerIfRequired(aViewContainerInfo_obj)
	{
		this._addToContainerIfRequired(aViewContainerInfo_obj);
	}

	startAppearing(aZombieView_e)
	{
		this._startAppearing(aZombieView_e);
	}

	startDisappearing(bossGlobalPos, aEnemyId, aIsInstantKill_bl = false)
	{
		this._fCurrentEnemyId_num = aEnemyId;
		if(!aIsInstantKill_bl)
		{
			this._startDisappearing(bossGlobalPos);
		}
	}

	completeDisappearing(aZombiePosition_pt, aIsCoPlayerWin_bln)
	{
		this._completeDisappearing(aZombiePosition_pt, aIsCoPlayerWin_bln);
	}

	interruptAnimation()
	{
		this._destroyAnimations();
	}

	updateBossType(aEnemyName_str)
	{
		this._updateBossType(aEnemyName_str);
	}

	onTimeToExplodeCoins(aZombiePosition_pt, aIsCoPlayerWin_bln)
	{
		this._onTimeToExplodeCoins(aZombiePosition_pt, aIsCoPlayerWin_bln);
	}

	onTimeToDefeatedCaption()
	{
		this._onTimeToDefeatedCaption();
	}

	updatePlayerWinCaption(aPlayerName_str)
	{
		this._updatePlayerWinCaption(aPlayerName_str)
	}

	get bossType()
	{
		return this._fBossType_str;
	}

	get isAppearanceInProgress()
	{
		return this._fIsAppearanceInProgress_bl;
	}

	get isDisappearanceInProgress()
	{
		return this._fIsDisappearanceInProgress_bl;
	}

	//INIT...
	constructor()
	{
		super();

		this._fViewContainerInfo_obj = null;
		this._fBossType_str = null;
		this._fCaptionView_bmcv = null;
		this._fAppearanceView_av = null;
		this._fDisappearanceView_dv = null;
		this._fDeathDisappearanceFxView_bmdfxv = null;
		this._fBossModePlayerWinAnimation_bmpwa = null;
		this._fIsAppearanceInProgress_bl = false;
		this._fIsDisappearanceInProgress_bl = false;
		this._fDeathFxTimer_t = null;

		this._fDisappearanceView_arr_dv = [];
	}

	_initAppearing()
	{
		this._fAppearanceView_av && this._fAppearanceView_av.destroy();
		this._fAppearanceView_av = this.addChild(this._appearanceView);
		this._fIsAppearanceInProgress_bl = true;

		this._fAppearanceView_av.on(AppearanceView.EVENT_APPEARING_STARTED, this.emit, this);
		this._fAppearanceView_av.on(AppearanceView.EVENT_APPEARING_PRESENTATION_STARTED, this.emit, this);
		this._fAppearanceView_av.on(AppearanceView.EVENT_APPEARING_PRESENTATION_CULMINATED, this.emit, this);
		this._fAppearanceView_av.on(AppearanceView.EVENT_APPEARING_PRESENTATION_COMPLETION, this.emit, this);
		this._fAppearanceView_av.on(AppearanceView.EVENT_APPEARING_PRESENTATION_COMPLETED, this._onAppearingCompleted, this);
		this._fAppearanceView_av.on(AppearanceView.EVENT_SHAKE_THE_GROUND_REQUIRED, this.emit, this);
		this._fAppearanceView_av.once(AppearanceView.EVENT_ON_TIME_TO_START_CAPTION_ANIMATION, this._onTimeToStartCaptionAnimation, this);
		
		this._fAppearanceView_av.on(IceBossAppearanceView.EVENT_ON_ICE_BOSS_FREEZE_LAND_NEEDED, this.emit, this);
		this._fAppearanceView_av.on(IceBossAppearanceView.EVENT_ON_ICE_BOSS_FREEZE_LAND_MELTING, this.emit, this);
	}

	get _appearanceView()
	{
		switch (this._fBossType_str)
		{
			case ENEMIES.Earth:
				return new EarthAppearanceView(this._fViewContainerInfo_obj);
			case ENEMIES.LightningBoss:
				return new LightningBossAppearanceView(this._fViewContainerInfo_obj);
			case ENEMIES.FireBoss:
				return new FireBossAppearanceView(this._fViewContainerInfo_obj);
			case ENEMIES.IceBoss:
				return new IceBossAppearanceView(this._fViewContainerInfo_obj);
			default:
				APP.logger.i_pushError(`BossModeView. There is no view for ${this._fBossType_str}`)
				console.error(`There is no view for ${this._fBossType_str}`);
				return null;
		}
	}

	get _bossModePlayerWinAnimation()
	{
		return this._fBossModePlayerWinAnimation_bmpwa || this._initBossModePlayerWinAnimation();
	}

	_initBossModePlayerWinAnimation()
	{
		this._fBossModePlayerWinAnimation_bmpwa = this._fViewContainerInfo_obj.container.addChild(new BossModePlayerWinAnimation());
		this._fBossModePlayerWinAnimation_bmpwa.zIndex = this._fViewContainerInfo_obj.captionZIndex;
		this._fBossModePlayerWinAnimation_bmpwa.once(BossModePlayerWinAnimation.EVENT_ON_WIN_ANIMATION_COMPLETED, this._onPlayerWinCaptionAnimationCompleted, this);
		this._fBossModePlayerWinAnimation_bmpwa.position.set(APP.config.size.width/2, APP.config.size.height/2+70);
		return this._fBossModePlayerWinAnimation_bmpwa;
	}

	get isPlayerWinAnimationInProgress()
	{
		return this._fBossModePlayerWinAnimation_bmpwa && this._fBossModePlayerWinAnimation_bmpwa.isAnimationInProgress
	}
	//...INIT

	//APPEARING PRESENTATION...
	_startAppearing(aZombieView_e)
	{
		aZombieView_e && this._updateBossType(aZombieView_e.name);

		this._initAppearing();
		this._fAppearanceView_av.startAppearing(aZombieView_e);

		this.visible = true;
	}

	_onAppearingCompleted()
	{
		this.emit(BossModeView.EVENT_APPEARING_PRESENTATION_COMPLETED);

		this._destroyAppearance();
	}
	//...APPEARING PRESENTATION

	//CAPTION...
	_onTimeToStartCaptionAnimation()
	{
		this._fCaptionView_bmcv && this._fCaptionView_bmcv.destroy();

		this._fCaptionView_bmcv = this._generateBossCaptionView();

		let lViewContainer_sprt = this._fViewContainerInfo_obj.container;
		lViewContainer_sprt.addChild(this._fCaptionView_bmcv);
		this._fCaptionView_bmcv.zIndex = this._fViewContainerInfo_obj.captionZIndex;
		this._fCaptionView_bmcv.position = this._getCaptionPosition();
		this._fCaptionView_bmcv.once(BossModeCaptionView.EVENT_ON_CAPTION_BECAME_VISIBLE, this._onCaptionBecameVisible, this);
		this._fCaptionView_bmcv.i_playAnimation();
	}

	_generateBossCaptionView()
	{
		switch (this._fBossType_str)
		{
			case ENEMIES.Earth:
				return new EarthBossCaptionView();
			case ENEMIES.FireBoss:
				return new FireBossCaptionView();
			case ENEMIES.IceBoss:
				return new IceBossCaptionView();
			case ENEMIES.LightningBoss:
				return new LightningBossCaptionView();
			default:
				APP.logger.i_pushError(`BossModeView. Undefined boss ${this._fBossType_str}.`)
				console.error(`Undefined boss ${this._fBossType_str}.`);
				return new BossModeCaptionView();
		}
	}

	_onCaptionBecameVisible()
	{
		this.emit(BossModeView.EVENT_ON_CAPTION_BECAME_VISIBLE, {bossType: this.bossType})
	}

	_getCaptionPosition()
	{
		let lAPPSize_obj = APP.config.size;
		switch (this._fBossType_str)
		{
			case ENEMIES.Earth:
				return {x: lAPPSize_obj.width/2, y: lAPPSize_obj.height/2 + 86};
			case ENEMIES.FireBoss:
				return {x: lAPPSize_obj.width/2, y: lAPPSize_obj.height/2 + 120};
			case ENEMIES.IceBoss:
				return {x: lAPPSize_obj.width/2, y: lAPPSize_obj.height/2 + 52};
			case ENEMIES.LightningBoss:
				return {x: lAPPSize_obj.width/2, y: lAPPSize_obj.height/2 + 100};
			default:
				APP.logger.i_pushError(`BossModeView. Undefined boss ${this._fBossType_str}.`)
				console.error(`Undefined boss ${this._fBossType_str}.`);
				return {x: lAPPSize_obj.width/2, y: lAPPSize_obj.height/2};
		}
	}
	//...CAPTION

	//DISAPPEARING PRESENTATION...
	_initDisappearing()
	{
		this._fDisappearanceView_dv = this.addChild(this._disappearanceView);

		this._fDisappearanceView_arr_dv.push({disppearance: this._fDisappearanceView_dv, id: this._fCurrentEnemyId_num});
		
		this._fIsDisappearanceInProgress_bl = true;

		this._fDisappearanceView_dv.on(BossDeathFxAnimation.EVENT_ON_TIME_TO_DEFEATED_CAPTION, this.emit, this);

	}

	get _disappearanceView()
	{
		switch (this._fBossType_str)
		{
			case ENEMIES.Earth:
				return new EarthBossDeathFxAnimation();
			case ENEMIES.LightningBoss:
				return new LightningBossDeathFxAnimation();
			case ENEMIES.FireBoss:
				return new FireBossDeathFxAnimation();
			case ENEMIES.IceBoss:
				return new IceBossDeathFxAnimation();
			default:
				APP.logger.i_pushError(`BossModeView. There is no view for ${this._fBossType_str}`)
				console.error(`There is no view for ${this._fBossType_str}`);
				return null;
		}
	}

	_onTimeToExplodeCoins(aZombiePosition_pt, aIsCoPlayerWin_bln)
	{
		if (!this._fDeathDisappearanceFxView_bmdfxv)
		{
			this._fDeathDisappearanceFxView_bmdfxv = this._fViewContainerInfo_obj.container.addChild(this._generateDisappearanceFxViewInstance(aIsCoPlayerWin_bln));
			this._fDeathDisappearanceFxView_bmdfxv.zIndex = this._fViewContainerInfo_obj.youWinZIndex;
		}

		this._fDeathDisappearanceFxView_bmdfxv.position.set(aZombiePosition_pt.x, aZombiePosition_pt.y);
		this._fDeathDisappearanceFxView_bmdfxv.startCoinsExplodeAnimation(aZombiePosition_pt, aIsCoPlayerWin_bln);

		this.visible = true;
	}

	_startDisappearing(aZombieView_e)
	{
		this._initDisappearing();

		let position = aZombieView_e.getGlobalPosition();
		this._fDisappearanceView_dv.position.x = -480 + position.x; //-960/2 + position.x;

		switch (this._fBossType_str)
		{
			case ENEMIES.IceBoss:
				this._fDisappearanceView_dv.position.y = -370 + position.y; //-540/2 + position.y - 100;
				this._fDeathFxTimer_t = new Timer(this._needStartDisappearingAnimation(aZombieView_e), 35*FRAME_RATE, this);
				break;
			default:
				this._fDisappearanceView_dv.position.y = -270 + position.y; //-540/2 + position.y;
				this._needStartDisappearingAnimation(aZombieView_e);
				break;
		}

		this.visible = true;

		this.emit(BossModeView.EVENT_DISAPPEARING_PRESENTATION_STARTED, {bossType: this._fBossType_str});

		this._fBossType_str = undefined;
	}

	_needStartDisappearingAnimation(aZombieView_e)
	{
		this._fDeathFxTimer_t && this._fDeathFxTimer_t.destructor();
		this._fDisappearanceView_dv.i_startAnimation(aZombieView_e);
	}

	_completeDisappearing(aOptZombiePosition_pt, aIsCoPlayerWin_bln)
	{
		if (!aOptZombiePosition_pt)
		{
			this._onDisappearingCompleted(false);
			return;
		}

		let lZombiePosition_pt = this.globalToLocal(aOptZombiePosition_pt.x, aOptZombiePosition_pt.y);

		if (!this._fDeathDisappearanceFxView_bmdfxv)
		{
			this._fDeathDisappearanceFxView_bmdfxv = this.addChild(this._generateDisappearanceFxViewInstance(aIsCoPlayerWin_bln));
			this._fDeathDisappearanceFxView_bmdfxv.position.set(lZombiePosition_pt.x, lZombiePosition_pt.y);
		}

		this._fDeathDisappearanceFxView_bmdfxv.once(BossModeDisappearanceFxView.EVENT_ANIMATION_COMPLETED, this._onDisappearingCompleted, this);
		this._fDeathDisappearanceFxView_bmdfxv.startAnimation();

		this.visible = true;
	}

	_onTimeToDefeatedCaption()
	{
		this._bossModePlayerWinAnimation.startAnimation();
	}

	_onPlayerWinCaptionAnimationCompleted(e)
	{
		if (this._fBossModePlayerWinAnimation_bmpwa.isAnimationInProgress)
		{
			return;
		}
		this._fBossModePlayerWinAnimation_bmpwa.off(BossModePlayerWinAnimation.EVENT_ON_WIN_ANIMATION_COMPLETED, this._onPlayerWinCaptionAnimationCompleted, this, true);
		this._fBossModePlayerWinAnimation_bmpwa && this._fBossModePlayerWinAnimation_bmpwa.destroy();
		this._fBossModePlayerWinAnimation_bmpwa = null;

		this.emit(e);
	}

	_generateDisappearanceFxViewInstance(aIsCoPlayerWin_bln)
	{
		return new BossModeDisappearanceFxView(this._fBossType_str, aIsCoPlayerWin_bln);
	}

	_onDisappearingCompleted()
	{
		this.emit(BossModeView.EVENT_DISAPPEARING_PRESENTATION_COMPLETED);

		this._destroyAnimations();
		this.visible = false;
	}
	//...DISAPPEARING PRESENTATION

	_updateBossType(aEnemyName_str)
	{
		switch (aEnemyName_str)
		{
			case ENEMIES.FireBoss:
			case ENEMIES.LightningBoss:
			case ENEMIES.Earth:
			case ENEMIES.IceBoss:
				this._fBossType_str = aEnemyName_str;
				break;
			default:
				throw new Error('Unexpected boss ' + aEnemyName_str);
		}
	}

	_updatePlayerWinCaption(aPlayerName_str)
	{
		this._bossModePlayerWinAnimation.playerName = aPlayerName_str;
	}

	_addToContainerIfRequired(aViewContainerInfo_obj)
	{
		if (this.parent)
		{
			let lViewZIndex_num = aViewContainerInfo_obj.zIndex;
			this.zIndex = lViewZIndex_num;
			this._fViewContainerInfo_obj = aViewContainerInfo_obj;

			return;
		}

		this._fViewContainerInfo_obj = aViewContainerInfo_obj;

		let lViewContainer_sprt = aViewContainerInfo_obj.container;
		let lViewZIndex_num = aViewContainerInfo_obj.zIndex;

		lViewContainer_sprt.addChild(this);

		this.position.set(APP.config.size.width/2, APP.config.size.height/2);
		this.zIndex = lViewZIndex_num;
	}

	_destroyAppearance()
	{
		if (this._fAppearanceView_av)
		{
			this._fAppearanceView_av.off(AppearanceView.EVENT_APPEARING_STARTED, this.emit, this);
			this._fAppearanceView_av.off(AppearanceView.EVENT_APPEARING_PRESENTATION_STARTED, this.emit, this);
			this._fAppearanceView_av.off(AppearanceView.EVENT_APPEARING_PRESENTATION_CULMINATED, this.emit, this);
			this._fAppearanceView_av.off(AppearanceView.EVENT_APPEARING_PRESENTATION_COMPLETION, this.emit, this);
			this._fAppearanceView_av.off(AppearanceView.EVENT_APPEARING_PRESENTATION_COMPLETED, this._onAppearingCompleted, this);
			this._fAppearanceView_av.off(AppearanceView.EVENT_ON_TIME_TO_START_CAPTION_ANIMATION, this._onTimeToStartCaptionAnimation, this);
			this._fAppearanceView_av.off(AppearanceView.EVENT_SHAKE_THE_GROUND_REQUIRED, this.emit, this);

			this._fAppearanceView_av.off(IceBossAppearanceView.EVENT_ON_ICE_BOSS_FREEZE_LAND_NEEDED, this.emit, this);
			this._fAppearanceView_av.off(IceBossAppearanceView.EVENT_ON_ICE_BOSS_FREEZE_LAND_MELTING, this.emit, this);

			this._fAppearanceView_av.destroy();
		}

		this._fAppearanceView_av = null;
		this._fIsAppearanceInProgress_bl = false;
	}

	_destroyDisappearance()
	{
		for (let i = 0; i < this._fDisappearanceView_arr_dv.length; i++) {
			if(this._fDisappearanceView_arr_dv[i].id != this._fCurrentEnemyId_num)
			{
				this._fDisappearanceView_arr_dv[i].disppearance.off(BossDeathFxAnimation.EVENT_ON_TIME_TO_DEFEATED_CAPTION, this.emit, this);
				this._fDisappearanceView_arr_dv[i].disppearance.destroy();
				this._fDisappearanceView_arr_dv.splice(i,1);
			}
		}
		this._fDisappearanceView_dv = null;


		if (this._fDeathDisappearanceFxView_bmdfxv)
		{
			this._fDeathDisappearanceFxView_bmdfxv.off(BossModeDisappearanceFxView.EVENT_ANIMATION_COMPLETED, this._onDisappearingCompleted, this);
			this._fDeathDisappearanceFxView_bmdfxv.destroy();
		}

		this._fDeathDisappearanceFxView_bmdfxv = null;
	}

	_destroyCaption()
	{
		this._fCaptionView_bmcv && this._fCaptionView_bmcv.destroy();
		this._fCaptionView_bmcv = null;
	}

	_destroyAnimations()
	{
		this._fCurrentEnemyId_num = null;
		this._destroyAppearance();
		this._destroyDisappearance();
		this._destroyCaption();
		this._fBossModePlayerWinAnimation_bmpwa && this._fBossModePlayerWinAnimation_bmpwa.destroy();
		this._fBossModePlayerWinAnimation_bmpwa = null;

		this.parent && this.parent.removeChild(this);
	}

	destroy()
	{
		this._destroyAnimations();

		super.destroy();

		this._fViewContainerInfo_obj = null;
		this._fBossType_str = null;

		this._fDeathFxTimer_t && this._fDeathFxTimer_t.destructor();
		this._fDeathFxTimer_t = null;
	}
}

export default BossModeView;