import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';

class BombEnemyFootStep extends Sprite
{
	constructor()
	{
		super();

		this._trailSequence_s = null;

		this._addStepTrail();
	}

	_addStepTrail()
	{
		let lTrail_sprt = this.addChild(APP.library.getSprite("enemies/bomb/footstep"));
		lTrail_sprt.blendMode = PIXI.BLEND_MODES.ADD;
		lTrail_sprt.alpha = 0;

		this._trailSequence_s = Sequence.start(lTrail_sprt, this._trailSequenceSata);
	}

	get _trailSequenceSata()
	{
		let seq = [
			{tweens: {prop: "alpha", to: 1}, duration: 50},
			{tweens: {prop: "alpha", to: 0}, duration: 2000, onfinish: () => { this._onTrailSequenceCompleted(); } }
		]

		return seq;
	}

	_onTrailSequenceCompleted()
	{
		this.destroy();
	}

	destroy()
	{
		this._trailSequence_s && this._trailSequence_s.destructor();
		this._trailSequence_s = null;
		
		super.destroy();
	}
}

export default BombEnemyFootStep