import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../../../shared/src/CommonConstants';
import Sprite from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import Sequence from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import Timer from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';

const SMOKES_CONFIG = [
	{position: {x: 960, y: 210}, endPosition: {x: 0, y: 210}, scale: {x: -12.72, y: 12.72}, delay: 81*FRAME_RATE},
	{position: {x: 960, y: 210}, endPosition: {x: 0, y: 210}, scale: {x: -12.72, y: 12.72}, delay: 41*FRAME_RATE},
	{position: {x: 960, y: 210}, endPosition: {x: 0, y: 210}, scale: {x: -12.72, y: 12.72}, delay: 5*FRAME_RATE},

	{position: {x: 0, y: 230}, endPosition: {x: 960, y: 230}, scale: {x: -12.72, y: 4.52}, delay: 100*FRAME_RATE},
	{position: {x: 0, y: 230}, endPosition: {x: 960, y: 230}, scale: {x: 12.72, y: 4.52}, delay: 51*FRAME_RATE},
	{position: {x: 0, y: 230}, endPosition: {x: 960, y: 230}, scale: {x: 12.72, y: 4.52}, delay: 0*FRAME_RATE},

	{position: {x: 0, y: 210}, endPosition: {x: 960, y: 210}, scale: {x: 12.72, y: 12.72}, delay: 100*FRAME_RATE},
	{position: {x: 0, y: 210}, endPosition: {x: 960, y: 210}, scale: {x: 12.72, y: 12.72}, delay: 51*FRAME_RATE},
	{position: {x: 0, y: 210}, endPosition: {x: 960, y: 210}, scale: {x: 12.72, y: 12.72}, delay: 10*FRAME_RATE}
];

const FULL_TIME = 139*FRAME_RATE;

class BossDeathSmokeFxView extends Sprite
{
	static get EVENT_ON_ANIMATION_ENDED()		{return "onAnimationEnded";}

	startAnimation(aDelay_num=0)
	{
		if (aDelay_num > 0)
		{
			this._fTimet_t = new Timer( ()=>this._startAnimationImmediatly(), aDelay_num);
		}
		else
		{
			this._startAnimationImmediatly();
		}
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

		// let gr = this.addChild(new PIXI.Graphics).beginFill(0x000000).drawRect(0, 0, 960, 540).endFill();

		this._animTime = FULL_TIME;
		this._container = this.addChild(new Sprite());
		this._smokes = [];
		this._fTimet_t = null;
	}

	_startAnimationImmediatly()
	{
		for (let config of SMOKES_CONFIG)
		{
			this._startNextSmoke(config.position, config.endPosition, config.scale, config.delay);
		}
	}

	_startNextSmoke(position, endPosition, scale, delay)
	{
		let lActualDelay = delay;

		let smoke = this._container.addChild(new Sprite);
		let lSmokeView1 = smoke.addChild(APP.library.getSpriteFromAtlas("boss_mode/bm_boss_mode/smoke_fx"));
		lSmokeView1.scale.set(scale.x, -1*scale.y);
		// let lSmokeView2 = smoke.addChild(APP.library.getSprite("boss_mode/smoke_fx"));
		// lSmokeView2.scale.set(scale.x, -1*scale.y);
		// lSmokeView2.alpha = 0.7;

		let lDirX_int = endPosition.x > position.x ? 1 : -1;
		let lPosDeltaX_num = lDirX_int*100*Math.abs(scale.x);
		smoke.position.set(position.x-lPosDeltaX_num, position.y);
		smoke.alpha = 0;
		
		let seqAlph = [
			{tweens: [{prop: "alpha", to: 0.7}],	duration: 0.108*this.animTime},
			{tweens: [{prop: "alpha", to: 0}],		duration: 0.892*this.animTime, onfinish: ()=>{
				this._onNextSmokeEnded(smoke);
			}}
		];
		let seqPos = [
			{tweens: [{prop: "position.x", to: endPosition.x+lPosDeltaX_num}, {prop: "position.y", to: endPosition.y}], duration: this.animTime}
		];

		if (lActualDelay > 0)
		{
			lActualDelay *= this.animTime / FULL_TIME;
		}

		Sequence.start(smoke, seqAlph, lActualDelay);
		Sequence.start(smoke, seqPos, lActualDelay);

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
			this.emit(BossDeathSmokeFxView.EVENT_ON_ANIMATION_ENDED);
		}
	}

	destroy()
	{
		this._fTimet_t && this._fTimet_t.destructor();
		this._fTimet_t = null;

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

export default BossDeathSmokeFxView;