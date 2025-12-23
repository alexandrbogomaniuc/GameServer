import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import AtlasSprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import AtlasConfig from '../../../config/AtlasConfig';
import { BitmapText } from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';

const MAX_WIDTH = 700;

class KillStreakNumberView extends Sprite
{
	static get ON_INTRO_ANIMATION_COMPLETED() { return "ON_INTRO_ANIMATION_COMPLETED"; }
	static get ON_OUTRO_ANIMATION_COMPLETED() { return "ON_OUTRO_ANIMATION_COMPLETED"; }

	startIntro()
	{
		this._startIntro();
	}

	startOutro(isStreakDisappearing)
	{
		this._startOutro(isStreakDisappearing);
	}

	get isIntroInProgress()
	{
		return this._isIntroInProgress;
	}

	constructor(streakNumber, speed = 1)
	{
		super();

		this._container = this.addChild(new Sprite());
		this._numbersContainer = this._container.addChild(new Sprite());

		this._baseView = null;
		this._glowView = null;

		this._isIntroInProgress = false;

		this._fStreakNumber_num = streakNumber;
		this._fSpeedMultiplier_num = Math.max(0.01, 1 / speed);
	}

	_startIntro()
	{
		this._createNumberView();

		this._showIntroAnimation();

		this._isIntroInProgress = true;
	}

	_startOutro(isStreakDisappearing)
	{
		this._showOutroAnimation(isStreakDisappearing);
	}

	_createNumberView()
	{
		let baseView = this._baseView = this._numbersContainer.addChild(this._createBitmapText());
		baseView.write(this._formatText());
		baseView.x = -baseView.getBounds().width/2;

		if (APP.profilingController.info.isVfxDynamicProfileValueMediumOrGreater)
		{
			this._addGlowView();
		}

		let numbersWidth = this._numbersContainer.getBounds().width;
		if (numbersWidth > MAX_WIDTH)
		{
			let numsScaleX = MAX_WIDTH/numbersWidth;
			this._numbersContainer.scale.x = numsScaleX;
		}
	}

	_addGlowView()
	{
		let glowView = this._glowView = this._numbersContainer.addChild(this._createBitmapText());
		glowView.write(this._formatText());
		glowView.x = -glowView.getBounds().width/2;
		glowView.addTint(0xffc68e);
		glowView.addBlendMode(PIXI.BLEND_MODES.ADD);
	}

	_createBitmapText()
	{
		return new BitmapText(KillStreakNumberView.getKillStreakNumbersTextures(), "", this._getLetterSpacing());
	}

	_showIntroAnimation()
	{
		this._container.scale.set(1.5, 1.5);
		this._glowView && (this._glowView.alpha = 1);

		let scaleSeq = [
			{tweens: [{prop: "scale.x", to: 0.9}, {prop: "scale.y", to: 0.9}], duration: 7*2*16.7 * this._fSpeedMultiplier_num},
			{tweens: [{prop: "scale.x", to: 1}, {prop: "scale.y", to: 1}], duration: 5*2*16.7 * this._fSpeedMultiplier_num, onfinish: this._onIntroAnimationCompleted.bind(this)}
		];

		let glowSeq = [
			{tweens: [{prop: "alpha", to: 0}], duration: 9*2*16.7 * this._fSpeedMultiplier_num}
		];

		Sequence.start(this._container, scaleSeq);
		this._glowView && Sequence.start(this._glowView, glowSeq);
	}

	_onIntroAnimationCompleted()
	{
		this._isIntroInProgress = false;

		this.emit(KillStreakNumberView.ON_INTRO_ANIMATION_COMPLETED);
	}

	_showOutroAnimation(isStreakDisappearing)
	{
		let scaleSeq = [];
		if (isStreakDisappearing)
		{
			scaleSeq = [
				{tweens: [{prop: "scale.x", to: 1.2}, {prop: "scale.y", to: 1.2}], duration: 3*2*16.7 * this._fSpeedMultiplier_num},
				{tweens: [{prop: "scale.x", to: 1}, {prop: "scale.y", to: 1}], duration: 3*2*16.7 * this._fSpeedMultiplier_num}
			];
		}
		scaleSeq.push({tweens: [{prop: "scale.x", to: 0}, {prop: "scale.y", to: 0}], duration: 2*2*16.7 * this._fSpeedMultiplier_num, onfinish: this._onOutroAnimationCompleted.bind(this)});
		Sequence.start(this._container, scaleSeq);

		if (isStreakDisappearing && this._glowView)
		{
			let glowSeq = [
				{tweens: [{prop: "alpha", to: 1}], duration: 7*2*16.7 * this._fSpeedMultiplier_num}
			];
			Sequence.start(this._glowView, glowSeq);
		}
	}

	_onOutroAnimationCompleted()
	{
		this.emit(KillStreakNumberView.ON_OUTRO_ANIMATION_COMPLETED);
	}

	_formatText()
	{
		return ""+this._fStreakNumber_num;
	}

	_getLetterSpacing()
	{
		return 0;
	}

	destroy()
	{
		if (this._container)
		{
			Sequence.destroy(Sequence.findByTarget(this._container));
		}

		if (this._glowView)
		{
			Sequence.destroy(Sequence.findByTarget(this._glowView));
		}

		super.destroy();

		this._fStreakNumber_num = undefined;
		this._container = null;
		this._numbersContainer = null;
		this._baseView = null;
		this._glowView = null;
		this._isIntroInProgress = undefined;
	}
}

KillStreakNumberView.getKillStreakNumbersTextures = function (){
	if (!KillStreakNumberView.killStreakNumbersTextures){
		KillStreakNumberView.setKillStreakNumbersTextures();
	}
	return KillStreakNumberView.killStreakNumbersTextures;
}

KillStreakNumberView.setKillStreakNumbersTextures = function (){
	KillStreakNumberView.killStreakNumbersTextures = AtlasSprite.getMapFrames(APP.library.getAsset("kill_streak_counter/kill_streak_digits"), AtlasConfig.KillStreakNumbers, "");
}

export default KillStreakNumberView;
