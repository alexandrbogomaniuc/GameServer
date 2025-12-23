import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../shared/src/CommonConstants';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { Utils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import FormationHighlightAnimation from './FormationHighlightAnimation';
import Timer from "../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer";
import FormationDeathShockwaveAnimation from './FormationDeathShockwaveAnimation';
import { SHIELD_DESTROY_ANIMATION_SPEED } from '../../enemies/Money';

const ANIMATION_SPEED = SHIELD_DESTROY_ANIMATION_SPEED;

const LIGHT_RAYS_PARAM = [
	{delay: 20, x: 149, y: 148, angle: 2.4033183799961915, sx: 1.505, sy: 2.793, alpha: 0.68, asset: "3"}, //x: 298/2, y: 296/2  angle: Utils.gradToRad(137.7)
	{delay: 34, x: -184, y: -128.55, angle: -1.0053096491487339, sx: 1.678, sy: 1.059, alpha: 0.24, asset: "2"}, //x: -368/2, y: -257.1/2 angle: Utils.gradToRad(-57.6)
	{delay: 47, x: 136.85, y: -132.55, angle: 0.6911503837897546, sx: 2.074, sy: 0.751, alpha: 0.68, asset: "1"}, //x: 273.7/2, y: -265.1/2 angle: Utils.gradToRad(39.6)
	{delay: 59, x: -113.15, y: 82.45, angle: 4.0125119503349636, sx: 2.022, sy: 0.751, alpha: 0.68, asset: "1"}, //x: -226.3/2, y: 164.9/2 angle: Utils.gradToRad(229.9)
	{delay: 61, x: 53.85, y: -152.55, angle: 0.3420845333908886, sx: 1, sy: 1, alpha: 0.28, asset: "3"} //x: 107.7/2, y: -305.1/2 angle: Utils.gradToRad(19.6)
];

const HIGHLIGHT_PARAM = [
	{delay: 20, x: 78.1, y: 71.6, alpha: 0.5, sx: 0.54, sy: 0.54}, //x: 156.2/2, y: 143.2/2   sx: 1 * 0.54, sy: 1 * 0.54
	{delay: 34, x: 58.9, y: -68.4, alpha: 0.5, sx: 0.4752, sy: 0.4752}, //x: -117.8/2, y: -136.8/2   sx: 0.88 * 0.54, sy: 0.88 * 0.54
	{delay: 47, x: 82.1, y: -65.4, alpha: 0.5, sx: 0.4752, sy: 0.4752}, //x: 164.2/2, y: -130.8/2  sx: 0.88 * 0.54, sy: 0.88 * 0.54
	{delay: 55, x: -59.9, y: 80.6, alpha: 0.5, sx: 0.5346, sy: 0.5346}, //x: -119.8/2, y: 161.2/2  sx: 0.99 * 0.54, sy: 0.99 * 0.54
	{delay: 61, x: 69.1, y: -109.4, alpha: 0.5, sx: 0.3348, sy: 0.3348}, //x: 138.2/2, y: -218.8/2  sx: 0.62 * 0.54, sy: 0.62 * 0.54
	{delay: 71, x: 34.1, y: 22.9, alpha: 0.5, sx: 0.5616, sy: 0.5616} //x: 68.2/2, y: 45.8/2  sx: 1.04 * 0.54, sy: 1.04 * 0.54
];

class FormationDeathAnimation extends Sprite
{
	static get EVENT_ON_ANIMATION_ENDED()				{return "onIntroAnimationEnded";}

	constructor(aPos_pt)
	{
		super();
		this._fParentPosition_pt = aPos_pt;
		this._fLightBlue_spr = null;
		this._fLightRays_spr_arr = [];
		this._fShockwaveAnimation_fdsa = null;
		this._fFormationHighlightAnimation_fha_arr = [];
		this._fFormationHighlightTimer_t_arr = [];
		this._fIsAnimationProgressCount_num = null;
	}

	i_startAnimation()
	{
		this._playAnimation();
	}

	_playAnimation()
	{
		this._fIsAnimationProgressCount_num = 0;

		this._startLightBlueAnimation();
		this._startLightRaysAnimation();
		this._enemyDeathShockwaveAnimation();
		this._startFormationHighlightAnimation();
	}

	_startLightBlueAnimation()
	{
		let lLightBlue_spr = this._fLightBlue_spr = this.addChild(APP.library.getSprite("enemies/money/death/light_blue"));
		lLightBlue_spr.alpha = 0;
		lLightBlue_spr.scale.set(3.31, 3.31);
		lLightBlue_spr.position.set(-2.65, -4.2); //-5.3/2, -8.4/2
		lLightBlue_spr.blendMode = PIXI.BLEND_MODES.ADD;

		let l_seq = [
			{tweens: [], duration: 40 * FRAME_RATE / ANIMATION_SPEED},
			{tweens: [{prop: 'alpha', to: 0.76}], duration: 41 * FRAME_RATE / ANIMATION_SPEED,
			onfinish: () => {
				lLightBlue_spr && lLightBlue_spr.destroy();
				this._fIsAnimationProgressCount_num--;
				this._completeAnimationSuspicision();
		}}];
		this._fIsAnimationProgressCount_num++;
		Sequence.start(lLightBlue_spr, l_seq);
	}

	_startLightRaysAnimation()
	{
		for (let i = 0; i < LIGHT_RAYS_PARAM.length; i++)
		{
			let lLightRays_spr = this._fLightRays_spr_arr[i] = this.addChild(APP.library.getSprite("enemies/money/death/light_rays_"+LIGHT_RAYS_PARAM[i].asset));
			lLightRays_spr.position.set(LIGHT_RAYS_PARAM[i].x, LIGHT_RAYS_PARAM[i].y);
			lLightRays_spr.scale.set(LIGHT_RAYS_PARAM[i].sx, LIGHT_RAYS_PARAM[i].sy);
			lLightRays_spr.alpha = 0;
			lLightRays_spr.rotation = LIGHT_RAYS_PARAM[i].angle;
			lLightRays_spr.blendMode = PIXI.BLEND_MODES.ADD;

			let l_seq = [
				{tweens: [], duration: LIGHT_RAYS_PARAM[i].delay * FRAME_RATE / ANIMATION_SPEED},
				{tweens: [{prop: 'alpha', to: 1}], duration: 0,
				onfinish: () => {
					lLightRays_spr && lLightRays_spr.destroy();
					this._fIsAnimationProgressCount_num--;
					this._completeAnimationSuspicision();
			}}];
			this._fIsAnimationProgressCount_num++;
			Sequence.start(lLightRays_spr, l_seq);
		}
	}

	_enemyDeathShockwaveAnimation()
	{
		let lShockwaveAnimation_fdsa = this._fShockwaveAnimation_fdsa = new FormationDeathShockwaveAnimation();
		let lShockwaveAnimationContainer_spr = APP.gameScreen.gameFieldController.moneyEnemyShockwaveContainer.container.addChild(lShockwaveAnimation_fdsa);
		lShockwaveAnimationContainer_spr.zIndex = APP.gameScreen.gameFieldController.moneyEnemyShockwaveContainer.zIndex;

		lShockwaveAnimation_fdsa.on(FormationDeathShockwaveAnimation.EVENT_ON_ANIMATION_ENDED, this._onEnemyDeathShockwaveAnimationCompleted, this);
		lShockwaveAnimation_fdsa.position.set(this._fParentPosition_pt.x, this._fParentPosition_pt.y);
		this._fIsAnimationProgressCount_num++;
		lShockwaveAnimation_fdsa.i_startAnimation();
	}

	_onEnemyDeathShockwaveAnimationCompleted()
	{
		this._fShockwaveAnimation_fdsa && this._fShockwaveAnimation_fdsa.destroy();
		this._fIsAnimationProgressCount_num--;
		this._completeAnimationSuspicision();
	}


	_startFormationHighlightAnimation()
	{
		for (let i = 0; i < HIGHLIGHT_PARAM.length; i++)
		{
			this._fFormationHighlightTimer_t_arr[i] = new Timer(() =>
			{
				this._fFormationHighlightTimer_t_arr[i] && this._fFormationHighlightTimer_t_arr[i].destructor();

				let lFormationHighlightAnimation_fha = this._fFormationHighlightAnimation_fha_arr[i] = new FormationHighlightAnimation();
				let lFormationHighlightContainer_spr = APP.gameScreen.gameFieldController.moneyEnemyShockwaveContainer.container.addChild(lFormationHighlightAnimation_fha);
				lFormationHighlightContainer_spr.zIndex = APP.gameScreen.gameFieldController.moneyEnemyShockwaveContainer.zIndex;

				lFormationHighlightAnimation_fha.position.set(this._fParentPosition_pt.x + HIGHLIGHT_PARAM[i].x, this._fParentPosition_pt.y + HIGHLIGHT_PARAM[i].y);
				lFormationHighlightAnimation_fha.scale.set(HIGHLIGHT_PARAM[i].sx, HIGHLIGHT_PARAM[i].sy);
				lFormationHighlightAnimation_fha.alpha = HIGHLIGHT_PARAM[i].alpha;

				lFormationHighlightAnimation_fha.on(FormationHighlightAnimation.EVENT_ON_ANIMATION_ENDED, this._onFormationHighlightAnimationCompleted, this);
				this._fIsAnimationProgressCount_num++;
				lFormationHighlightAnimation_fha.i_startAnimation();

			}, HIGHLIGHT_PARAM[i].delay * FRAME_RATE / ANIMATION_SPEED);
		}
	}

	_onFormationHighlightAnimationCompleted(e)
	{
		e.target && e.target.destroy();
		this._fIsAnimationProgressCount_num--;
		this._completeAnimationSuspicision();
	}

	_completeAnimationSuspicision()
	{
		if (this._fIsAnimationProgressCount_num <= 0)
		{
			this.emit(FormationDeathAnimation.EVENT_ON_ANIMATION_ENDED);
		}
	}

	destroy()
	{
		this._fLightBlue_spr && Sequence.destroy(Sequence.findByTarget(this._fLightBlue_spr));
		this._fLightBlue_spr && this._fLightBlue_spr.destroy();
		this._fLightBlue_spr = null;

		for (let i = 0; i < this._fLightRays_spr_arr.length; i++)
		{
			this._fLightRays_spr_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fLightRays_spr_arr[i]));
			this._fLightRays_spr_arr[i] && this._fLightRays_spr_arr[i].destroy();
			this._fLightRays_spr_arr[i] = null;
		}
		this._fLightRays_spr_arr = [];

		this._fShockwaveAnimation_fdsa && this._fShockwaveAnimation_fdsa.destroy();
		this._fShockwaveAnimation_fdsa = null;

		for (let i = 0; i < this._fFormationHighlightTimer_t_arr.length; i++)
		{
			this._fFormationHighlightTimer_t_arr[i] && this._fFormationHighlightTimer_t_arr[i].destructor();
			this._fFormationHighlightTimer_t_arr[i] = null;
		}
		this._fFormationHighlightTimer_t_arr = [];

		for (let i = 0; i < this._fFormationHighlightAnimation_fha_arr.length; i++)
		{
			this._fFormationHighlightAnimation_fha_arr[i] && this._fFormationHighlightAnimation_fha_arr[i].destroy();
			this._fFormationHighlightAnimation_fha_arr[i] = null;
		}
		this._fFormationHighlightAnimation_fha_arr = [];

		this._fIsAnimationProgressCount_num = null;

		super.destroy();
	}
}

export default FormationDeathAnimation;