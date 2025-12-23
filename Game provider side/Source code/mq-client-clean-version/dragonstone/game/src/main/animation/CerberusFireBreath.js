import Sprite from '../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import Sequence from '../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import * as Easing from '../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../shared/src/CommonConstants';

class CerberusFireBreath extends Sprite
{
	static get EVENT_ON_ANIMATION_FINISHED()		{return "onAnimationFinished";}

	startAnimation()
	{
		this._startFire();
		this._startSmoke();
	}

	constructor()
	{
		super();
	}

	_startFire()
	{
		this._fire = this.addChild(APP.library.getSprite("enemies/cerberus/fire_breath"));
		this._fire.blendMode = PIXI.BLEND_MODES.SCREEN;
		this._fire.scale.set(0.73, 0.42);

		let seq = [
			{tweens: [
				{ prop: 'position.y', to: -70}, { prop: 'rotation', to: 0.0157},
				{ prop: 'scale.x', to: 1}, { prop: 'scale.y', to: 1}], duration: 36*FRAME_RATE, ease: Easing.sine.easeOut
			}
		];
		Sequence.start(this._fire, seq);

		let alpha_seq = [
			{tweens: [],						duration: 21*FRAME_RATE},
			{tweens: [{ prop: 'alpha', to: 0}],	duration: 15*FRAME_RATE, ease: Easing.sine.easeIn, onfinish: ()=>{
				this._onAnimationEnded();
			}}
		];
		Sequence.start(this._fire, alpha_seq);
	}

	_startSmoke()
	{
		this._smoke = this.addChild(APP.library.getSprite("enemies/cerberus/fire_breath_smoke"));
		let smoke2 = this._smoke.addChild(APP.library.getSprite("enemies/cerberus/fire_breath_smoke"));
		smoke2.blendMode = PIXI.BLEND_MODES.SCREEN;
		smoke2.position.set(0, 5);
		this._smoke.blendMode = PIXI.BLEND_MODES.SCREEN;
		this._smoke.position.set(0, -5);

		let seq = [
			{tweens: [
				{ prop: 'position.y', to: -80}, { prop: 'rotation', to: 0.0157}], duration: 36*FRAME_RATE, ease: Easing.sine.easeOut
			}
		];
		Sequence.start(this._smoke, seq);

		let alpha_seq = [
			{tweens: [],						duration: 21*FRAME_RATE},
			{tweens: [{ prop: 'alpha', to: 0}],	duration: 15*FRAME_RATE, ease: Easing.sine.easeIn}
		];
		Sequence.start(this._smoke, alpha_seq);
	}

	_onAnimationEnded()
	{
		this._destroyAnimations();

		this.emit(CerberusFireBreath.EVENT_ON_ANIMATION_FINISHED);
	}

	_destroyAnimations()
	{
		if (this._smoke)
		{
			Sequence.destroy(Sequence.findByTarget(this._smoke));
			this._smoke.destroy();
			this._smoke = null;
		}

		if (this._fire)
		{
			Sequence.destroy(Sequence.findByTarget(this._fire));
			this._fire.destroy();
			this._fire = null;
		}
	}

	destroy()
	{
		this._destroyAnimations();

		super.destroy();
	}
}

export default CerberusFireBreath;