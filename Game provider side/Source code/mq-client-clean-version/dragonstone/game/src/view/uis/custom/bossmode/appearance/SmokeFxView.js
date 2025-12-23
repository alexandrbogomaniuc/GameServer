import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../../../shared/src/CommonConstants';
import Sprite from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import Sequence from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';

const SMOKES_CONFIG = [
	{position: {x: 0, y: 270}, endPosition: {x: 960, y: 285}, scale: {x: -12.72, y: 12.72}, delay: 0*FRAME_RATE},
	{position: {x: 960, y: 270}, endPosition: {x: 0, y: 285}, scale: {x: 12.72, y: 4.52}, delay: 9*FRAME_RATE},
	{position: {x: 960, y: 270}, endPosition: {x: 0, y: 285}, scale: {x: 12.72, y: 12.72}, delay: 11*FRAME_RATE},

	{position: {x: 0, y: 290}, endPosition: {x: 960, y: 305}, scale: {x: -12.72, y: 12.72}, delay: 49*FRAME_RATE},
	{position: {x: 960, y: 290}, endPosition: {x: 0, y: 305}, scale: {x: 12.72, y: 4.52}, delay: 58*FRAME_RATE},
	{position: {x: 960, y: 290}, endPosition: {x: 0, y: 305}, scale: {x: 12.72, y: 12.72}, delay: 60*FRAME_RATE},

	{position: {x: 0, y: 290}, endPosition: {x: 960, y: 305}, scale: {x: -12.72, y: 12.72}, delay: 98*FRAME_RATE},
	{position: {x: 960, y: 290}, endPosition: {x: 0, y: 305}, scale: {x: 12.72, y: 4.52}, delay: 107*FRAME_RATE},
	{position: {x: 960, y: 290}, endPosition: {x: 0, y: 305}, scale: {x: 12.72, y: 12.72}, delay: 109*FRAME_RATE}
];

class SmokeFxView extends Sprite
{
	static get EVENT_ON_ANIMATION_ENDED()		{return "onAnimationEnded";}

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

		this._animTime = 133*FRAME_RATE;
		this._container = this.addChild(new Sprite());
		this._smokes = [];
	}

	_startAnimation()
	{
		for (let config of SMOKES_CONFIG)
		{
			this._startNextSmoke(config.position, config.endPosition, config.scale, config.delay);
		}
	}

	_startNextSmoke(position, endPosition, scale, delay)
	{
		let smoke = this._container.addChild(new Sprite);
		let lSmokeView = smoke.addChild(APP.library.getSpriteFromAtlas("boss_mode/bm_boss_mode/smoke_fx"));
		lSmokeView.scale.set(scale.x, -1*scale.y);

		let lDirX_int = endPosition.x > position.x ? 1 : -1;
		let lPosDeltaX_num = lDirX_int*100*Math.abs(scale.x);
		smoke.position.set(position.x-lPosDeltaX_num, position.y);
		smoke.alpha = 0;
		
		let seqAlph = [
			{tweens: [{prop: "alpha", to: 0.7}],	duration: 0.1128*this.animTime},
			{tweens: [{prop: "alpha", to: 0}],		duration: 0.8872*this.animTime, onfinish: ()=>{
				this._onNextSmokeEnded(smoke);
			}}
		];
		let seqPos = [
			{tweens: [{prop: "position.x", to: endPosition.x+lPosDeltaX_num}, {prop: "position.y", to: endPosition.y}], duration: this.animTime}
		];

		Sequence.start(smoke, seqAlph, delay);
		Sequence.start(smoke, seqPos, delay);

		this._smokes.push(smoke);
	}

	_onNextSmokeEnded(smoke)
	{
		if (!this._smokes) return;

		let id = this._smokes.indexOf(smoke)
		if (~id)
		{
			this._smokes.splice(id, 1);
		}

		if (!this._smokes.length)
		{
			this.emit(SmokeFxView.EVENT_ON_ANIMATION_ENDED);
		}
	}

	destroy()
	{
		if (this._smokes)
		{
			while (this._smokes.length)
			{
				let smoke = this._smokes.pop();
				smoke && Sequence.destroy(Sequence.findByTarget(smoke));
				smoke && smoke.destroy();
			}
		}

		super.destroy();

		this._container = null;
		this._smokes = null;
		this._animTime = null;
	}
}

export default SmokeFxView;