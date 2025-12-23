import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../shared/src/CommonConstants';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import * as Easing from '../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { Utils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import FormationShockwaveAnimation from './FormationShockwaveAnimation';
import { SHIELD_DESTROY_ANIMATION_SPEED } from '../../enemies/Money';

const ANIMATION_SPEED = SHIELD_DESTROY_ANIMATION_SPEED;

const SHOCKWAVE_PARAM = [
	{delay: 19, x: 38, y: 31.5, angle: -0.8133234314293576, sx: 0.675, sy: 0.675}, //x: 152/4, y: 126/4, angle: -46.6, sx: 1.25 * 0.54, sy: 1.25 * 0.54   angle: Utils.gradToRad(-46.6)
	{delay: 33, x: -42, y: -42.5, angle: -4.061381169390804, sx: 0.4536, sy: 0.4536}, //x: -168/4, y: -170/4, angle: -232.7, sx: 0.84 * 0.54, sy: 0.84 * 0.54 angle: Utils.gradToRad(-232.7)
	{delay: 46, x: 41, y: -50.5, angle: -2.5656340004316647, sx: 0.7722, sy: 0.7722}, //x: 164/4, y: -202/4, angle: -147, sx: 1.43 * 0.54, sy: 1.43 * 0.54 angle: Utils.gradToRad(-147)
	{delay: 54, x: -40, y: 28, angle: 0.6684611035138281, sx: 0.7722, sy: 0.7722}, //x: -160/4, y: 112/4, angle: 38.3, sx: 1.43 * 0.54, sy: 1.43 * 0.54 angle: Utils.gradToRad(38.3)
	{delay: 67, x: 68, y: 9.5, angle: -1.3281955607676845, sx: 0.675, sy: 0.675}, //x: 272/4, y: 38/4, angle: -76.1, sx: 1.25 * 0.54, sy: 1.25 * 0.54  angle: Utils.gradToRad(-76.1)
	{delay: 60, x: -15.5, y: -48, angle: -3.4592425774527604, sx: 0.4536, sy: 0.4536}, //x: -62/4, y: -192/4, angle: -198.2, sx: 0.84 * 0.54, sy: 0.84 * 0.54 angle: Utils.gradToRad(-198.2)
	{delay: 71, x: 66.5, y: -16.5, angle: -1.9547687622336491, sx: 0.7722, sy: 0.7722}, //x: 266/4, y: -66/4, angle: -112, sx: 1.43 * 0.54, sy: 1.43 * 0.54 angle: Utils.gradToRad(-112)
	{delay: 74, x: -19, y: 53, angle: 0.5044001538263613, sx: 0.7722, sy: 0.7722} //x: -76/4, y: 212/4, angle: 28.9, sx: 1.43 * 0.54, sy: 1.43 * 0.54 angle: Utils.gradToRad(28.9)
]

class FormationDeathShockwaveAnimation extends Sprite
{
	static get EVENT_ON_ANIMATION_ENDED()				{return "onIntroAnimationEnded";}

	constructor()
	{
		super();
		this._fShockwave_spr_arr = [];
		this._fIsAnimationProgressCount_num  = null;
	}

	i_startAnimation()
	{
		this._playAnimation();
	}

	_playAnimation()
	{
		this._fIsAnimationProgressCount_num = 0;
		this._startShokewaveAnimation();
	}

	_startShokewaveAnimation()
	{
		for (let i = 0; i < SHOCKWAVE_PARAM.length; i++)
		{
			let lShockwave_spr = this._fShockwave_spr_arr[i] = this.addChild(new FormationShockwaveAnimation());
			lShockwave_spr.position.set(SHOCKWAVE_PARAM[i].x, SHOCKWAVE_PARAM[i].y);
			lShockwave_spr.scale.set(SHOCKWAVE_PARAM[i].sx, SHOCKWAVE_PARAM[i].sy);
			lShockwave_spr.alpha = 0;
			lShockwave_spr.rotation = SHOCKWAVE_PARAM[i].angle;
			lShockwave_spr.blendMode = PIXI.BLEND_MODES.ADD;

			let l_seq = [
				{tweens: [], duration: SHOCKWAVE_PARAM[i].delay * FRAME_RATE / ANIMATION_SPEED},
				{tweens: [{prop: 'alpha', to: 1}], duration: 0,
				onfinish: () => {
					lShockwave_spr.on(FormationShockwaveAnimation.EVENT_ON_ANIMATION_ENDED, this._onShockwaveAnimationCompleted, this);
					lShockwave_spr.i_startAnimation();
			}}];
			this._fIsAnimationProgressCount_num++;
			Sequence.start(lShockwave_spr, l_seq);			
		}
	}

	_onShockwaveAnimationCompleted(e)
	{
		let lShockwaveAnimation_fsa = e.target;
		const lIndex_int = this._fShockwave_spr_arr.indexOf(lShockwaveAnimation_fsa);
		if (~lIndex_int)
		{
			this._fShockwave_spr_arr.splice(lIndex_int, 1);
		}
		lShockwaveAnimation_fsa && lShockwaveAnimation_fsa.destroy();

		this._fIsAnimationProgressCount_num--;
		this._completeAnimationSuspicision();
	}

	_completeAnimationSuspicision()
	{
		if (this._fIsAnimationProgressCount_num <= 0)
		{
			this.emit(FormationDeathShockwaveAnimation.EVENT_ON_ANIMATION_ENDED);
		}
	}

	destroy()
	{
		for (let i = 0; i < this._fShockwave_spr_arr.length; i++)
		{
			this._fShockwave_spr_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fShockwave_spr_arr[i]));
			this._fShockwave_spr_arr[i] && this._fShockwave_spr_arr[i].destroy();
			this._fShockwave_spr_arr[i] = null;
		}
		this._fShockwave_spr_arr = [];

		this._fIsAnimationProgressCount_num = null;

		super.destroy();
	}
}

export default FormationDeathShockwaveAnimation;