import { Sequence } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Timer from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import { Utils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { FRAME_RATE } from '../../../../../shared/src/CommonConstants';

const CLOUDS_COUNT = 2;

class CloudsPool extends Sprite
{
	constructor()
	{
		super();
		this._fSmokes_spr_arr = [];

		for( let i = 0; i < CLOUDS_COUNT; i++ )
		{
			let l_s = this.addChild(APP.library.getSprite("transition/fog"));
			l_s.scale.set(4);
			this._resetSmoke(l_s);
			this._fSmokes_spr_arr[i] = l_s;
		}

		this._fIsLoop_bl = false;
		this._fSmokesAnimationsCount_num = 0;
		this._fTimers_t_arr = [];
	}

	_startSmokesAnimations()
	{
		for (let i = 0; i < CLOUDS_COUNT; i++)
		{
			this._fTimers_t_arr.push(new Timer(this._startSmokeAnimation.bind(this, i),  50*i*FRAME_RATE));
		}
	}

	_startSmokeAnimation(aIndex_num)
	{
		let lSmoke_spr = this._fSmokes_spr_arr[aIndex_num];
		let lRotationRad_num = Utils.gradToRad(aIndex_num&2 == 0 ? 20 : -20); // every second rotates opposite direction
		lSmoke_spr.show();

		let lSeq_arr = [
			{
				tweens: [{prop: "alpha", to: 0.3}, {prop: "position.y", to: -100}, {prop: "rotation", to: lRotationRad_num/2}],
				duration: 50*FRAME_RATE
			},
			{
				tweens: [{prop: "alpha", to: 0}, {prop: "position.y", to: -200}, {prop: "rotation", to: lRotationRad_num}],
				duration: 50*FRAME_RATE,
				onfinish: this._tryToCompleteSmokesAnimations.bind(this, aIndex_num)
			},
		];

		this._fSmokesAnimationsCount_num++;
		Sequence.start(lSmoke_spr, lSeq_arr);
	}

	_tryToCompleteSmokesAnimations(aIndex_num)
	{
		this._resetSmoke(this._fSmokes_spr_arr[aIndex_num]);

		this._fSmokesAnimationsCount_num--;
		if (this._fIsLoop_bl)
		{
			this._startSmokeAnimation(aIndex_num)
		}
		else if (this._fSmokesAnimationsCount_num == 0)
		{
			this._resetAllSmokes();
		}
	}

	_resetSmoke(aSmoke_spr)
	{
		Sequence.destroy(Sequence.findByTarget(aSmoke_spr));
		aSmoke_spr.hide();
		aSmoke_spr.position.set(0, 0);
	}

	_resetAllSmokes()
	{
		this._fTimers_t_arr.forEach(l_t => l_t.destructor());
		this._fSmokes_spr_arr.forEach(a_spr => this._resetSmoke(a_spr));
		this._fSmokesAnimationsCount_num = 0;
	}


	setLoopMode(aIsloopMode_bl)
	{
		this._fIsLoop_bl = aIsloopMode_bl;

		if (this._fIsLoop_bl && this._fSmokesAnimationsCount_num == 0)
		{
			this._startSmokesAnimations();
		}
	}

	drop()
	{
		this._fIsLoop_bl = false;
		this._resetAllSmokes();
	}

	destroy()
	{
		this.drop();

		this._fSmokes_spr_arr.forEach(a_spr => a_spr.destroy());
		this._fSmokes_spr_arr = null;

		super.destroy();
	}

	isVisible()
	{
		return this._fSmokes_spr_arr.some(a_spr => a_spr.alpha > 0);
	}
}

export default CloudsPool;