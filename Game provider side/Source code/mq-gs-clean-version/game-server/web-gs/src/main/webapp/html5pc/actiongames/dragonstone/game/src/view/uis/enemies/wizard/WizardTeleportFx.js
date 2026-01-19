import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../../shared/src/CommonConstants';
import Sequence from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import Timer from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import {DIRECTION} from '../../../../main/enemies/Enemy';

class WizardTeleportFx extends Sprite
{
	static get EVENT_ON_APPEAR_REQUIRED()				{return "onAppearRequired";}
	static get EVENT_ON_DISAPPEAR_REQUIRED()			{return "onDisappearRequired";}
	static get EVENT_ON_TELEPORTED_IN()					{return "onTeleportedIn";}
	static get EVENT_ON_TELEPORTED_OUT()				{return "onTeleportedOut";}

	startDisappear(direction)
	{
		this._startDisappear(direction);
	}

	startAppear(direction)
	{
		this._startAppear(direction);
	}

	pauseAnimation()
	{
		this._pauseAnimation();
	}

	resumeAnimation()
	{
		this._resumeAnimation();
	}

	get isDisappearing()
	{
		return this._fDisappearInProgress_bln;
	}

	constructor()
	{
		super();

		this._fContainer_sprt = null;
		this._fDisappearInProgress_bln = false;
		this._fAppearInProgress_bln = false;
		this._fWizardAppearTimer_t = null;
		this._fGlowTimer_t = null;
		this._fSmokeTimer_t = null;
		this._fTeleportAnimation_spr = null;
		this._fGlow_spr = null;

		this._init();
	}

	_init()
	{
		this._fContainer_sprt = this.addChild(new Sprite());
		this._fContainer_sprt.visible = false;
	}

	_startMainAnimation()
	{
		this._fTeleportAnimation_spr = this._fContainer_sprt.addChild(new Sprite());
		this._fTeleportAnimation_spr.textures = this._getTeleportTextures();
		this._fTeleportAnimation_spr.blendMode = PIXI.BLEND_MODES.SCREEN;
		this._fTeleportAnimation_spr.scale.set(2);
		this._fTeleportAnimation_spr.animationSpeed = 30/60;
		this._fTeleportAnimation_spr.position = this._getMainAnimationPosition();
		this._fTeleportAnimation_spr.on('animationend', () => {
			this._fTeleportAnimation_spr && this._fTeleportAnimation_spr.destroy();
			this._fTeleportAnimation_spr = null;
			this._onMainAnimationEnded();
		});
		this._fTeleportAnimation_spr.play();
	}

	_getMainAnimationPosition()
	{
		return {x: 0, y: 0};
	}

	_startGlowAnimation()
	{
		this._fGlow_spr && Sequence.destroy(Sequence.findByTarget(this._fGlow_spr));
		this._fGlow_spr && this._fGlow_spr.destroy();
		this._fGlow_spr = null;

		this._fGlow_spr = this._fContainer_sprt.addChild(APP.library.getSprite(this._getGlowSrc()));
		this._fGlow_spr.scale.set(4);
		this._fGlow_spr.alpha = 0;
		this._fGlow_spr.blendMode = PIXI.BLEND_MODES.SCREEN;

		let lAlpha_seq = [
			{tweens: [	{prop: "alpha", to: 0.4}],	duration: 2*FRAME_RATE},
			{tweens: [	{prop: "alpha", to: 0}],	duration: 6*FRAME_RATE, onfinish: ()=>{
				this._fGlow_spr && this._fGlow_spr.destroy();
				this._fGlow_spr = null;
			}}
		];

		Sequence.start(this._fGlow_spr, lAlpha_seq);
	}

	_startSmokeAnimation(direction)
	{
		let lSmoke_spr = APP.gameScreen.gameField.wizardTeleportAnimationContainer.container.addChild(new Sprite);
		APP.gameScreen.gameField.wizardTeleportSmokeAnimations.push(lSmoke_spr);
		lSmoke_spr.textures = this._getSmokeTextures();
		let lScale_obj = this._getSmokeScale(direction);
		let lPositionOffset_obj = this._getSmokePosition(direction);
		lSmoke_spr.blendMode = PIXI.BLEND_MODES.SCREEN;
		lSmoke_spr.scale.set(lScale_obj.x, lScale_obj.y);
		lSmoke_spr.position.set(this.parent.localToGlobal().x + lPositionOffset_obj.x, this.parent.localToGlobal().y + lPositionOffset_obj.y);
		lSmoke_spr.once('animationend', () => {
			lSmoke_spr.destroy();
		})
		lSmoke_spr.play();
	}

	_getSmokePosition(direction)
	{
		let lResult_obj = {};
		switch (direction)
		{
			case DIRECTION.LEFT_DOWN:
				lResult_obj = {x: -520, y: -300};
				break;
			case DIRECTION.LEFT_UP:
				lResult_obj = {x: -520, y: -300};
				break;
			case DIRECTION.RIGHT_DOWN:
				lResult_obj = {x: -450, y: -300};
				break;
			case DIRECTION.RIGHT_UP:
				lResult_obj = {x: -450, y: -300};
				break;
			default:
				throw new Error('Wrong direction for wizard teleport animation');
		}

		return lResult_obj;
	}

	_getSmokeScale(direction)
	{
		let lResult_obj = {};
		switch (direction)
		{
			case DIRECTION.LEFT_DOWN:
				lResult_obj = {x: 2, y: 2};
				break;
			case DIRECTION.LEFT_UP:
				lResult_obj = {x: 2, y: -2};
				break;
			case DIRECTION.RIGHT_DOWN:
				lResult_obj = {x: -2, y: 2};
				break;
			case DIRECTION.RIGHT_UP:
				lResult_obj = {x: -2, y: -2};
				break;
			default:
				throw new Error('Wrong direction for wizard teleport animation');
		}

		return lResult_obj;
	}

	_getGlowSrc()
	{
		//override;
	}

	_getTeleportTextures()
	{
		//override;
	}

	_getSmokeTextures()
	{
		//override;
	}

	_onMainAnimationEnded()
	{
		if (this._fAppearInProgress_bln)
		{
			this._onTeleportedIn();
		}
		else if (this._fDisappearInProgress_bln)
		{
			this._onTeleportedOut();
		}

		this._fAppearInProgress_bln = false;
		this._fDisappearInProgress_bln = false;
	}

	_startDisappear(direction)
	{
		this._fContainer_sprt.visible = true;
		this._fDisappearInProgress_bln = true;

		this._startMainAnimation();
		this._fGlowTimer_t = new Timer(()=>{
			APP.profilingController.info.isVfxProfileValueMediumOrGreater && this._startGlowAnimation();
			this._startWizardDisappearAnim();
			this._fGlowTimer_t = null;
		}, 5 * FRAME_RATE);

		this._fSmokeTimer_t = new Timer(()=>{
			APP.profilingController.info.isVfxProfileValueMediumOrGreater && this._startSmokeAnimation(direction);
			this._fSmokeTimer_t = null;
		}, 7 * FRAME_RATE);
	}

	_startAppear(direction)
	{
		this._fContainer_sprt.visible = true;
		this._fAppearInProgress_bln = true;

		this._startMainAnimation();
		APP.profilingController.info.isVfxProfileValueMediumOrGreater && this._startGlowAnimation();
		this._fWizardAppearTimer_t = new Timer(()=>{
			APP.profilingController.info.isVfxProfileValueMediumOrGreater && this._startSmokeAnimation(direction);
			this._startWizardAppearAnim(); 
			this._fWizardAppearTimer_t = null;
		}, 4*FRAME_RATE);
	}

	_pauseAnimation()
	{
		this._fGlowTimer_t && this._fGlowTimer_t.pause();
		this._fWizardAppearTimer_t && this._fWizardAppearTimer_t.pause();
		this._fTeleportAnimation_spr && this._fTeleportAnimation_spr.stop();
	}

	_resumeAnimation()
	{
		this._fGlowTimer_t && this._fGlowTimer_t.resume();
		this._fWizardAppearTimer_t && this._fWizardAppearTimer_t.resume();
		this._fTeleportAnimation_spr && this._fTeleportAnimation_spr.play();
	}

	_onTeleportedIn()
	{
		this._fContainer_sprt.visible = false;

		this.emit(WizardTeleportFx.EVENT_ON_TELEPORTED_IN);
	}

	_onTeleportedOut()
	{
		this._fContainer_sprt.visible = false;

		this.emit(WizardTeleportFx.EVENT_ON_TELEPORTED_OUT);
	}

	_startWizardDisappearAnim()
	{
		this.emit(WizardTeleportFx.EVENT_ON_DISAPPEAR_REQUIRED);
	}

	_startWizardAppearAnim()
	{
		this.emit(WizardTeleportFx.EVENT_ON_APPEAR_REQUIRED);
	}

	destroy()
	{
		this._fGlow_spr && Sequence.destroy(Sequence.findByTarget(this._fGlow_spr));

		this._fWizardAppearTimer_t && this._fWizardAppearTimer_t.destructor();
		this._fGlowTimer_t && this._fGlowTimer_t.destructor();
		this._fSmokeTimer_t && this._fSmokeTimer_t.destructor();

		super.destroy();

		this._fContainer_sprt = null;
		this._fDisappearInProgress_bln = null;
		this._fWizardAppearTimer_t = null;
		this._fGlowTimer_t = null;
		this._fSmokeTimer_t = null;
		this._fAppearInProgress_bln = null;
		this._fTeleportAnimation_spr = null;
		this._fGlow_spr = null;
	}
}

export default WizardTeleportFx;