import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import I18 from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import ProfilingInfo from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/profiling/ProfilingInfo';
import { FRAME_RATE } from '../../../../../../shared/src/CommonConstants';
import Sequence from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { Utils } from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import LogoSmokeView from '../LogoSmokeView';
import Timer from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';

export const Z_INDEXES = {
					SHADOW : 0,
					SMOKE_BOTTOM : 1,
					LOGO : 2,
					FLARE : 3,
					RET_OF_RA_GLOW : 4,
					MQ_GLOW : 5,
					SMOKE_TOP : 6
				};

class GamePreloaderLogoView extends Sprite
{
	constructor()
	{
		super();

		this._isAnimationAvailable_bl = false;
		
		this._logoReturnOfRaGlow = null;
		this._logoReturnOfRaGlowSeq = null;
		
		this._logoMaxQuestGlow = null;
		this._logoMaxQuestGlowSeq = null;

		this._logoFlare = null;
		this._logoFlareSeq = null;

		this._nextSmokeType_int = 0; // 0 - top smoke, 1 - bottom smoke
		this._smokeTimer = null;

		this._initView();
		this._startAnimation();
	}

	_initView()
	{
		this._addLogo();

		this._addGlow();
		this._addFlare();

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._isAnimationAvailable_bl = true;

			this._startSmokeAnimation();
		}
	}

	_addLogo()
	{
		let logo = this.addChild(I18.generateNewCTranslatableAsset('TALobbyPreloaderLogo'));
		logo.zIndex = Z_INDEXES.LOGO;
	}

	_addGlow()
	{
		let logoReturnOfRaGlow = this._logoReturnOfRaGlow = this.addChild(I18.generateNewCTranslatableAsset('TALobbyPreloaderLogoReturnOfRaGlow'));
		logoReturnOfRaGlow.zIndex = Z_INDEXES.RET_OF_RA_GLOW;	
		logoReturnOfRaGlow.alpha = 0;
		logoReturnOfRaGlow.assetContent.blendMode = PIXI.BLEND_MODES.ADD;

		let logoMaxQuestGlow = this._logoMaxQuestGlow = this.addChild(I18.generateNewCTranslatableAsset('TALobbyPreloaderLogoMaxQuestGlow'));
		logoMaxQuestGlow.zIndex = Z_INDEXES.MQ_GLOW;
		logoMaxQuestGlow.alpha = 0;
		logoMaxQuestGlow.assetContent.blendMode = PIXI.BLEND_MODES.ADD;
	}

	_addFlare()
	{
		let logoFlare = this._logoFlare = this.addChild(APP.library.getSprite("preloader/logo/logo_flare"));
		logoFlare.zIndex = Z_INDEXES.FLARE;
		logoFlare.blendMode = PIXI.BLEND_MODES.ADD;

		let lLogoFlarePositionAsset_ta = I18.getTranslatableAssetDescriptor("TALobbyPreloaderLogoFlarePosition");
		let lLogoFlarePositionDescriptor_obj = lLogoFlarePositionAsset_ta.areaInnerContentDescriptor.areaDescriptor;

		logoFlare.position.set(lLogoFlarePositionDescriptor_obj.x, lLogoFlarePositionDescriptor_obj.y);
		logoFlare.scale.set(Utils.random(0.8, 1, true), Utils.random(0.7, 0.9, true));
	}

	_startAnimation()
	{
		if (this._isAnimationAvailable_bl)
		{
			this._startReturnOfRaGlowCycle();
			this._startMaxQuestGlowCycle(20*FRAME_RATE);
			this._startFlareCycle();
		}
		else
		{
			this._logoReturnOfRaGlow.alpha = 0.78;
			this._logoMaxQuestGlow.alpha = 0.78;
		}
	}

	// RETURN OF RA GLOW ANIMATION...
	get _logoReturnOfRaGlowSequence()
	{
		let lGlowSeq_arr = [
			{tweens: [{prop: 'alpha', to: 0.78}],	duration: 32*FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0}],	duration: 34*FRAME_RATE, onfinish: (e) => { this._onReturnOfRaGlowCycleCompleted() } }
			
		];

		return lGlowSeq_arr
	}

	_startReturnOfRaGlowCycle(delay=0)
	{
		this._logoReturnOfRaGlowSeq = Sequence.start(this._logoReturnOfRaGlow, this._logoReturnOfRaGlowSequence, delay);
	}

	_onReturnOfRaGlowCycleCompleted()
	{
		this._logoReturnOfRaGlowSeq.destructor();

		this._startReturnOfRaGlowCycle();
	}
	// ...RETURN OF RA GLOW ANIMATION

	// MAX DUEL GLOW ANIMATION...
	get _logoMaxQuestGlowSequence()
	{
		let lGlowSeq_arr = [
			{tweens: [{prop: 'alpha', to: 0.78}],	duration: 32*FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0}],	duration: 34*FRAME_RATE, onfinish: (e) => { this._onMaxQuestGlowCycleCompleted() } }
			
		];

		return lGlowSeq_arr
	}

	_startMaxQuestGlowCycle(delay=0)
	{
		this._logoMaxQuestGlowSeq = Sequence.start(this._logoMaxQuestGlow, this._logoMaxQuestGlowSequence, delay);
	}

	_onMaxQuestGlowCycleCompleted()
	{
		this._logoMaxQuestGlowSeq.destructor();

		this._startMaxQuestGlowCycle();
	}
	// ...MAX DUEL GLOW ANIMATION

	// FLARE ANIMATION...
	get _logoFlareSequence()
	{
		let lFlareSeq_arr = [
			{tweens: [{prop: 'scale.x', to: Utils.random(0.8, 1, true)}, {prop: 'scale.y', to: Utils.random(0.7, 0.9, true)}],	duration: 30*FRAME_RATE, onfinish: (e) => { this._onFlareCycleCompleted() } }
			
		];

		return lFlareSeq_arr
	}

	_startFlareCycle(delay=0)
	{
		this._logoFlareSeq = Sequence.start(this._logoFlare, this._logoFlareSequence, delay);
	}

	_onFlareCycleCompleted()
	{
		this._logoFlareSeq.destructor();

		this._startFlareCycle();
	}
	// ...FLARE ANIMATION

	// SMOKES...
	_startSmokeAnimation()
	{
		this._addNextSmokeAnimation();
	}

	_addNextSmokeAnimation()
	{
		let smoke = this.addChild(new LogoSmokeView());
		smoke.alpha = this._smokeAlpha;
		smoke.scale.set(1.35, 0.66);
		smoke.y = APP.isMobile ? 160 : 150;
		smoke.zIndex = this._isTopSmokeType ? Z_INDEXES.SMOKE_TOP : Z_INDEXES.SMOKE_BOTTOM;

		smoke.x = this._isTopSmokeType ? -40 : 20;

		this._nextSmokeType_int = 1-this._nextSmokeType_int;

		this._startNextSmokeStartTimer(29*FRAME_RATE);
	}

	get _smokeAlpha()
	{
		return 0.3;
	}

	get _isTopSmokeType()
	{
		return this._nextSmokeType_int == 0;
	}

	_startNextSmokeStartTimer(delay)
	{
		this._smokeTimer = new Timer(() => this._onNextSmokeStartTimerCompleted(), delay);
	}

	_onNextSmokeStartTimerCompleted()
	{
		this._smokeTimer.destructor();
		this._smokeTimer = null;

		this._addNextSmokeAnimation();
	}
	// ...SMOKES

	destroy()
	{
		this._isAnimationAvailable_bl = undefined;
		
		this._logoReturnOfRaGlowSeq && this._logoReturnOfRaGlowSeq.destructor();
		this._logoReturnOfRaGlowSeq = null;
		this._logoReturnOfRaGlow = null;
		
		this._logoMaxQuestGlowSeq && this._logoMaxQuestGlowSeq.destructor();
		this._logoMaxQuestGlowSeq = null;
		this._logoMaxQuestGlow = null;
		
		this._logoFlareSeq && this._logoFlareSeq.destructor();
		this._logoFlareSeq = null;
		this._logoFlare = null;		

		this._nextSmokeType_int = undefined;
		
		this._smokeTimer && this._smokeTimer.destructor();
		this._smokeTimer = null;

		super.destroy();
	}
}

export default GamePreloaderLogoView;