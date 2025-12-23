import Sprite from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { APP } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../../../../shared/src/CommonConstants';
import { Sequence } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import { Utils } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';

const GOD_DEFEATED_PARAM =[
	{
		delay: 72,
		position: {x: 28.2, y: -139.8},
		rotation: 6.021385919380437, //Utils.gradToRad(345)
		scale: {x: 164.7, y: 0},
		anim: {sx1: 1.778, sy: 1.244, sx2: 1.942, sy2: 2.802, a2: 0.99, sx3: 2.204, sy3: 5.295, sx4: 2.309, sy4: 6.274, a4: 0}
	},
	{
		delay: 74,
		position: {x: 28.2, y: -139.8},
		rotation: 1.413716694115407, //Utils.gradToRad(81)
		scale: {x: 164.7, y: 0},
		anim: {sx1: 1.784, sy: 1.406, sx2: 1.951, sy2: 3.114, a2: 0.99, sx3: 2.197, sy3: 5.626, sx4: 2.267, sy4: 6.212, a4: 0}
	},
	{
		delay: 72,
		position: {x: 28.2, y: -139.8},
		rotation: 3.141592653589793, //Utils.gradToRad(180)
		scale: {x: 164.7, y: 0},
		anim: {sx1: 1.778, sy: 1.244, sx2: 1.942, sy2: 2.802, a2: 0.99, sx3: 2.204, sy3: 5.295, sx4: 2.309, sy4: 6.274, a4: 0}
	},
	{
		delay: 74,
		position: {x: 28.2, y: -139.8},
		rotation: 4.468042885105484, //Utils.gradToRad(256)
		scale: {x: 164.7, y: 0},
		anim: {sx1: 1.784, sy: 1.406, sx2: 1.951, sy2: 3.114, a2: 0.99, sx3: 2.197, sy3: 5.626, sx4: 2.267, sy4: 6.212, a4: 0}
	}	
];

class LightningBossGodDefeatedAnimation extends Sprite
{
	static get EVENT_ON_ANIMATION_ENDED()				{return "onGodDefeatedAnimationEnded";}

	i_startAnimation()
	{
		this._startAnimation();
	}

	constructor()
	{
		super();
		
		this._fAnimationCount_num = null;
		this._fGodDefeated_spr_arr = [];
	}

	_startAnimation()
	{
		if (!APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._onAnimationCompletedSuspicison();
			return;
		}
		
		this._fAnimationCount_num = 0;
		
		this._startGodDefeated();
	}

	_startGodDefeated()
	{
		for (let i = 0; i < GOD_DEFEATED_PARAM.length; i++)
		{
			this._fAnimationCount_num++;
			this._startGodDefeatedOnce(i);
		}
	}

	_startGodDefeatedOnce(aIndex)
	{
		let param = GOD_DEFEATED_PARAM[aIndex];
		let lLightning_spr = this._fGodDefeated_spr_arr[aIndex] = this.addChild(APP.library.getSprite('boss_mode/lightning/god_defeated'));
	
		lLightning_spr.alpha = 0;
		lLightning_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lLightning_spr.position = param.position;
		lLightning_spr.scale.set(param.scale.x, param.scale.y);
		lLightning_spr.rotation = param.rotation;
		lLightning_spr.pivot.set(0, -48); 

		let l_seq = [
			{tweens: [], duration: param.delay * FRAME_RATE},
			{tweens: [], duration: 3 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: param.anim.sx1}, {prop: 'scale.y', to: param.anim.sy1}], duration: 8 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: param.anim.sx2}, {prop: 'scale.y', to: param.anim.sy2}, {prop: 'alpha', to: param.anim.a2}], duration: 5 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: param.anim.sx3}, {prop: 'scale.y', to: param.anim.sy3}], duration: 8 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: param.anim.sx4}, {prop: 'scale.y', to: param.anim.sy4}, {prop: 'alpha', to: param.anim.a4}], duration: 8 * FRAME_RATE,
					onfinish: ()=>{
						this._fGodDefeated_spr_arr[aIndex] && this._fGodDefeated_spr_arr[aIndex].destroy();
						this._fAnimationCount_num--;
						this._onAnimationCompletedSuspicison();
			}}
		]

		Sequence.start(lLightning_spr, l_seq);
	}

	_onAnimationCompletedSuspicison()
	{
		if (this._fAnimationCount_num == 0)
		{
			this.emit(LightningBossGodDefeatedAnimation.EVENT_ON_ANIMATION_ENDED);
		}
	}

	destroy()
	{
		super.destroy();

		for (let i = 0; i < GOD_DEFEATED_PARAM.length; i++)
		{
			if (!this._fGodDefeated_spr_arr)
			{
				break;
			}

			this._fGodDefeated_spr_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fGodDefeated_spr_arr[i]));
			this._fGodDefeated_spr_arr[i] && this._fGodDefeated_spr_arr[i].destroy();
			this._fGodDefeated_spr_arr[i] = null;
		}

		this._fGodDefeated_spr_arr = null;
		this._fAnimationCount_num = null;
	}
}

export default LightningBossGodDefeatedAnimation;