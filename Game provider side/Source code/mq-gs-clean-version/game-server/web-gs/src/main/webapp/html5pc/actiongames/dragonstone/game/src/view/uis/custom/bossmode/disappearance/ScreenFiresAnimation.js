import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../../../shared/src/CommonConstants';
import Sprite from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import Sequence from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';

class ScreenFiresAnimation extends Sprite
{
	static get EVENT_ON_SCREEN_FIRES_ANIMATION_ENDED()			{return "onScreenFiresAnimationEnded";}

	startAnimation()
	{
		this._startAnimation();
	}

	get animTime()
	{
		return this._animTime;
	}

	set animTime(val)
	{
		this._animTime = val;
	}

	constructor()
	{
		super();

		this._animTime = 104*FRAME_RATE;

		this._fire1 = null;
		this._fire2 = null;
		this._fire3 = null;
	}

	_startAnimation()
	{
		this._fire1 = this._generateFire({x: 470, y: 150}, 5.77);
		let seq1 = [
			{tweens:[{ prop: "alpha", to: 1 }, { prop: "scale.x", to: 6.4129 }, { prop: "scale.y", to: 6.4129 }, { prop: "position.y", to: 150-6.429 }], duration: 0.23*this.animTime},
			{tweens:[{ prop: "alpha", to: 0 }, { prop: "scale.x", to: 7.27 }, { prop: "scale.y", to: 7.27 }, { prop: "position.y", to: 150-15 }], duration: 0.31*this.animTime, onfinish: () => {
				this._fire1 && this._fire1.destroy();
				this._fire1 = null;
				this._tryToComplete();
			}}
		];

		Sequence.start(this._fire1, seq1);

		this._fire2 = this._generateFire({x: 490, y: 150}, 1.27);
		let seq2 = [
			{tweens:[{ prop: "alpha", to: 1 }, { prop: "scale.x", to: 2.1475 }, { prop: "scale.y", to: 2.1475 }], duration: 0.23*this.animTime},
			{tweens:[{ prop: "alpha", to: 0 }, { prop: "scale.x", to: 7.81 }, { prop: "scale.y", to: 7.81 }], duration: 0.433*this.animTime, onfinish: () => {
				this._fire2 && this._fire2.destroy();
				this._fire2 = null;
				this._tryToComplete();
			}}
		];

		Sequence.start(this._fire2, seq2, 0.144*this.animTime);

		this._fire3 = this._generateFire({x: 480, y: 145}, 1.27);
		let seq3 = [
			{tweens:[{ prop: "alpha", to: 1 }, { prop: "scale.x", to: 2.1475 }, { prop: "scale.y", to: 2.1475 }], duration: 0.23*this.animTime},
			{tweens:[{ prop: "alpha", to: 0 }, { prop: "scale.x", to: 7.81 }, { prop: "scale.y", to: 7.81 }], duration: 0.433*this.animTime, onfinish: () => {
				this._fire3 && this._fire3.destroy();
				this._fire3 = null;
				this._tryToComplete();
			}}
		];

		Sequence.start(this._fire3, seq3, 0.3365*this.animTime);
	}

	_generateFire(pos, scale)
	{
		let fire = this.addChild(APP.library.getSpriteFromAtlas("boss_mode/bm_boss_mode/fire_on_top"));
		fire.blendMode = PIXI.BLEND_MODES.ADD;
		fire.position.set(pos.x, pos.y);
		fire.scale.set(scale);
		fire.alpha = 0;

		return fire;
	}

	_tryToComplete()
	{
		if (!this._fire1 && !this._fire2 && !this._fire3)
		{
			this.emit(ScreenFiresAnimation.EVENT_ON_SCREEN_FIRES_ANIMATION_ENDED);
		}
	}

	destroy()
	{
		this._fire1 && Sequence.destroy(Sequence.findByTarget(this._fire1));
		this._fire2 && Sequence.destroy(Sequence.findByTarget(this._fire2));
		this._fire3 && Sequence.destroy(Sequence.findByTarget(this._fire3));

		super.destroy();

		this._fire1 = null;
		this._fire2 = null;
		this._fire3 = null;
		this._animTime = null;
	}
}

export default ScreenFiresAnimation;