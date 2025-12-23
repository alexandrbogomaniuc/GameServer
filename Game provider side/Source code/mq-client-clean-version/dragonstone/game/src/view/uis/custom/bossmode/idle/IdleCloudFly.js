import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../../../shared/src/CommonConstants';
import Sprite from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import Sequence from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';

class IdleCloudFly extends Sprite
{
	static get EVENT_ON_CLOUD_ANIMATION_ENDED()			{return "onCloudAnimationEnded";}

	startAnimation()
	{
		this._startAnimation();
	}

	finishAnimation()
	{
		this._stopIterations = true;
	}

	constructor()
	{
		super();

		this._stopIterations = false;
		this._clouds = [];
		this._containerOne = this.addChild(new Sprite());
		this._containerTwo = this.addChild(new Sprite());
	}

	_startAnimation()
	{
		this._nextIteration();
	}

	_nextIteration()
	{
		let smoke = this._generateSmoke({x: 5.19, y: -0.75}, this._containerOne);

		let seqPos = [
			{tweens: [{prop: "position.x", to: 480}],		duration: 8*FRAME_RATE, onfinish: ()=>{
				this._startCloud2();
			}},
			{tweens: [{prop: "position.x", to: -800}],	duration: 8*FRAME_RATE, onfinish: ()=>{
				if (!this._stopIterations)
				{
					this._nextIteration();
				}
				this._onNextCloudEnded(smoke);
			}}
		];
		Sequence.start(smoke, seqPos);
	}

	_startCloud2()
	{
		let smoke = this._generateSmoke({x: 5.19, y: -0.975}, this._containerTwo);

		let seqPos = [
			{tweens: [{prop: "position.x", to: -800}],	duration: 16*FRAME_RATE, onfinish: ()=>{
				this._onNextCloudEnded(smoke);
			}}
		];
		Sequence.start(smoke, seqPos);
	}

	_generateSmoke(scale, container)
	{
		let smoke = container.addChild(APP.library.getSpriteFromAtlas("boss_mode/bm_boss_mode/smoke_fx"));
		smoke.blendMode = PIXI.BLEND_MODES.SCREEN;
		smoke.position.set(960+800, 0);
		smoke.scale.set(scale.x*2, scale.y*2);

		this._clouds.push(smoke);

		return smoke;
	}

	_onNextCloudEnded(cloud)
	{
		let id = this._clouds.indexOf(cloud);
		if (~id)
		{
			this._clouds.splice(id, 1);
			cloud.destroy();
		}

		if (this._stopIterations && !this._clouds.length)
		{
			this.emit(IdleCloudFly.EVENT_ON_CLOUD_ANIMATION_ENDED);
		}
	}

	destroy()
	{
		if (this._clouds)
		{
			while (this._clouds.length)
			{
				let cloud = this._clouds.pop();
				Sequence.destroy(Sequence.findByTarget(cloud));
				cloud.destroy();
			}
		}

		super.destroy();

		this._containerOne = null;
		this._containerTwo = null;
		this._clouds = null;
		this._stopIterations = null;
	}
}

export default IdleCloudFly;