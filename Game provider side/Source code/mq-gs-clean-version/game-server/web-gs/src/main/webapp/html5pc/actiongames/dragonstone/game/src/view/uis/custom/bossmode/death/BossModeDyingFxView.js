import Sprite from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sequence from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import MissEffect from '../../../../../main/missEffects/MissEffect';
import Timer from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import { FRAME_RATE } from '../../../../../../../shared/src/CommonConstants';
import CoinsExplosionSmokeAnimation from './../coins_explosion/CoinsExplosionSmokeAnimation';
import BossDeathSmokeFxView from './BossDeathSmokeFxView';
import ScreenFiresAnimation from '../disappearance/ScreenFiresAnimation';
import FiresFlashAnimation from '../disappearance/FiresFlashAnimation';
import { DRAGON_CAPTION_TYPES } from './../appearance/BossModeCaptionView';

class BossModeDyingFxView extends Sprite {
	static get EVENT_ANIMATION_COMPLETED() { return "onBossDisappearenceFxAnimationCompleted"; }
	static get EVENT_ON_STOP_IDLE_RQUIRED() { return "onStopIdleRequired"; }
	static get EVENT_ON_TIME_TO_START_CAPTION_ANIMATION() { return "EVENT_ON_TIME_TO_START_CAPTION_ANIMATION"; }

	startScreenSmokeAnimation() {
		this._startScreenSmokeAnimation();
	}

	startCoinsExplodeAnimation(aIsCoPlayerWin_bln) {
		this._startCoinsExplodeAnimation(aIsCoPlayerWin_bln);
	}

	startOutroAnimation() {
		this._startOutroAnimation();
	}

	constructor() {
		super();

		this._fDeathFlash_sprt = null;
		this._fDeathSplat_sprt = null;
		this._fSmokeAnim_cesa = null;
		this._fScreenSmoke_bdsfxv = null;
		this._fIsOutroAnimationCompleted_bl = false;
		this._screenFiresAnimation = null;
		this._screenFiresFlashAnimation = null;
		this._fTimer_t = null;
	}

	_startScreenSmokeAnimation() {
		this._fScreenSmoke_bdsfxv = this.addChild(new BossDeathSmokeFxView);
		this._fScreenSmoke_bdsfxv.position.set(-APP.config.size.width / 2, -APP.config.size.height / 2);
		this._fScreenSmoke_bdsfxv.once(BossDeathSmokeFxView.EVENT_ON_ANIMATION_ENDED, this._onScreenSmokeAnimationCompleted, this);
		this._fScreenSmoke_bdsfxv.startAnimation(10 * FRAME_RATE);
	}

	_onScreenSmokeAnimationCompleted(event) {
		this._fScreenSmoke_bdsfxv.destroy();
		this._fScreenSmoke_bdsfxv = null;

		this._validateCompletion();
	}

	_startCoinsExplodeAnimation(aIsCoPlayerWin_bln) {
		this._startSplatAnimation();

		let lShowSmoke_bln = APP.profilingController.info.isVfxProfileValueMediumOrGreater;
		if (lShowSmoke_bln) {
			this._startFlashAnimation();
			this._startSmokeAnimation();
		}
	}

	_startSmokeAnimation() {
		this._fSmokeAnim_cesa = this.addChild(new CoinsExplosionSmokeAnimation());
		this._fSmokeAnim_cesa.scale.set(1.4);
		this._fSmokeAnim_cesa.once(CoinsExplosionSmokeAnimation.EVENT_ON_COINS_EXPLOSION_SMOKE_ANIMATION_COMPLETED, this._onCoinsSmokeAnimationCompleted, this);

		this._fSmokeAnim_cesa.startAnimation(10 * FRAME_RATE);
	}

	_onCoinsSmokeAnimationCompleted() {
		this._fSmokeAnim_cesa.destroy();
		this._fSmokeAnim_cesa = null;

		this._validateCompletion();
	}

	get _isExplosionCompleted() {
		return (!this._fSmokeAnim_cesa && !this._fDeathSplat_sprt && !this._fDeathFlash_sprt);
	}

	//SPLAT...
	_startSplatAnimation() {
		if (this._fDeathSplat_sprt) {
			Sequence.destroy(Sequence.findByTarget(this._fDeathSplat_sprt));
			this._fDeathSplat_sprt.destroy();
		}

		this._fDeathSplat_sprt = this.addChild(this._createDeathSplat());

		let lSplatSeq_arr = [
			{ tweens: [], duration: 1 * FRAME_RATE },
			{ tweens: [{ prop: "alpha", to: 0 }], duration: 7 * FRAME_RATE },
			{ tweens: [], duration: 3 * FRAME_RATE },
			{ tweens: [{ prop: "alpha", to: 1 }], duration: 1 * FRAME_RATE },
			{ tweens: [{ prop: "alpha", to: 0 }], duration: 7 * FRAME_RATE, onfinish: () => { this._onSplatSeqCompleted(); } }
		];

		Sequence.start(this._fDeathSplat_sprt, lSplatSeq_arr);
	}

	_onSplatSeqCompleted() {
		this._destroyDeathSplat();
		this._validateCompletion();
	}

	_createDeathSplat() {
		let lDeathSplat_sprt = APP.library.getSpriteFromAtlas(this._deathSplatTextureName);
		let pos = this._deathSplatPosition;
		lDeathSplat_sprt.anchor.set(0.5, 0.5);
		lDeathSplat_sprt.position.set(pos.x, pos.y);
		lDeathSplat_sprt.scale.set(12);
		lDeathSplat_sprt.blendMode = PIXI.BLEND_MODES.ADD;
		return lDeathSplat_sprt;
	}

	get _deathSplatPosition() {
		return new PIXI.Point(-20, -50);
	}

	get _deathSplatTextureName() {
		return 'boss_mode/bm_boss_mode/death_splat';
	}
	//...SPLAT

	//FLASH...
	_startFlashAnimation() {
		if (this._fDeathFlash_sprt) {
			Sequence.destroy(Sequence.findByTarget(this._fDeathFlash_sprt));
			this._fDeathFlash_sprt.destroy();
		}
		this._fDeathFlash_sprt = this.addChild(this._createDeathFlash());
		this._fDeathFlash_sprt.alpha = 0;

		this._gf = APP.gameScreen.gameField;

		this._startFlashSequence();
	}

	_startFlashSequence() {
		let lFlashSeq_arr = [
			{ tweens: [], duration: 2 * FRAME_RATE, onfinish: () => { this._fDeathFlash_sprt.alpha = 1; } },
			{ tweens: [], duration: 10 * FRAME_RATE },
			{ tweens: [{ prop: 'alpha', to: 0 }], duration: 5 * FRAME_RATE, onfinish: () => { this._onFlashSeqCompleted(); } }
		];

		Sequence.start(this._fDeathFlash_sprt, lFlashSeq_arr);
	}

	_onFlashSeqCompleted() {
		this._destroyDeathFlash();
		this._validateCompletion();
	}

	_createDeathFlash() {
		let lDeathFlash_sprt = APP.library.getSpriteFromAtlas(this._deathFlashTextureName);
		let pos = this._deathFlashPosition;
		lDeathFlash_sprt.blendMode = PIXI.BLEND_MODES.ADD;
		lDeathFlash_sprt.position.set(pos.x, pos.y);
		lDeathFlash_sprt.scale.set(12);

		return lDeathFlash_sprt;
	}

	get _deathFlashPosition() {
		return new PIXI.Point(0, 0);
	}

	get _deathFlashTextureName() {
		return 'boss_mode/bm_boss_mode/death_flash';
	}
	//...FLASH

	//OUTRO...
	_startOutroAnimation() {
		this._startScreenFiresAnimation();
	}

	_startScreenFiresAnimation() {
		this._screenFiresAnimation = this.addChild(new ScreenFiresAnimation());
		this._screenFiresAnimation.position.set(-APP.config.size.width / 2, -APP.config.size.height / 2);
		this._screenFiresAnimation.once(ScreenFiresAnimation.EVENT_ON_SCREEN_FIRES_ANIMATION_ENDED, this._onScreenFiresAnimationEnded, this);

		this._screenFiresAnimation.startAnimation();

		this._fTimer_t = new Timer(() => { this._startCaptionAnimation(); }, (APP.isBattlegroundGame ? 34 * FRAME_RATE : 68 * FRAME_RATE));
	}

	_onScreenFiresAnimationEnded() {
		if (this._screenFiresAnimation) {
			this._screenFiresAnimation.destroy();
			this._screenFiresAnimation = null;
		}

		this._validateOutroCompletion();

		if (this._fIsOutroAnimationCompleted_bl) {
			this._validateCompletion();
		}
	}

	_startCaptionAnimation() {
		this._fTimer_t && this._fTimer_t.destructor();
		this._fTimer_t = null;
		this._fTimer_t = new Timer(() => { this._startFiresFlashAnimation(); }, (APP.isBattlegroundGame ? 15 * FRAME_RATE : 29 * FRAME_RATE));
	}

	_startFiresFlashAnimation() {
		this._fTimer_t && this._fTimer_t.destructor();
		this._fTimer_t = null;

		this._screenFiresFlashAnimation = this.addChild(new FiresFlashAnimation());
		this._screenFiresFlashAnimation.position.set(-APP.config.size.width / 2, -APP.config.size.height / 2);
		this._screenFiresFlashAnimation.once(FiresFlashAnimation.EVENT_ON_FIRES_FLASH_ANIMATION_ENDED, this._onFiresFlashAnimationEnded, this);
		this._screenFiresFlashAnimation.startAnimation();
	}

	_onFiresFlashAnimationEnded() {
		if (this._screenFiresFlashAnimation) {
			this._screenFiresFlashAnimation.destroy();
			this._screenFiresFlashAnimation = null;
		}

		this._validateOutroCompletion();

		if (this._fIsOutroAnimationCompleted_bl) {
			this._validateCompletion();
		}
	}

	_validateOutroCompletion() {
		if (!this._screenFiresAnimation && !this._screenFiresFlashAnimation && !this._fTimer_t) {
			this._fIsOutroAnimationCompleted_bl = true;
		}
	}
	//...OUTRO

	_validateCompletion() {
		if (this._isExplosionCompleted && !this._fScreenSmoke_bdsfxv && this._fIsOutroAnimationCompleted_bl) {
			this.emit(BossModeDyingFxView.EVENT_ANIMATION_COMPLETED);
		}
	}

	_destroyDeathSplat() {
		if (this._fDeathSplat_sprt) {
			Sequence.destroy(Sequence.findByTarget(this._fDeathSplat_sprt));
			this._fDeathSplat_sprt.destroy();
			this._fDeathSplat_sprt = null;
		}
	}

	_destroyDeathFlash() {
		if (this._fDeathFlash_sprt) {
			Sequence.destroy(Sequence.findByTarget(this._fDeathFlash_sprt));
			this._fDeathFlash_sprt.destroy();
			this._fDeathFlash_sprt = null;
		}
	}

	destroy() {
		this._fTimer_t && this._fTimer_t.destructor();
		this._fTimer_t = null;

		this._destroyDeathFlash();
		this._destroyDeathSplat();

		this._fSmokeAnim_cesa && this._fSmokeAnim_cesa.destroy();
		this._fSmokeAnim_cesa = null;

		this._fScreenSmoke_bdsfxv && this._fScreenSmoke_bdsfxv.destroy();
		this._fScreenSmoke_bdsfxv = null;

		this._fIsOutroAnimationCompleted_bl = undefined;

		this._screenFiresAnimation && this._screenFiresAnimation.destroy();
		this._screenFiresAnimation = null;

		this._screenFiresFlashAnimation && this._screenFiresFlashAnimation.destroy();
		this._screenFiresFlashAnimation = null;

		super.destroy();
	}
}

export default BossModeDyingFxView