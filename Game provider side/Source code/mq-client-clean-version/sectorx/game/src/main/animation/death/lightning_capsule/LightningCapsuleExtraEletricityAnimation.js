import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { Sequence } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import { FRAME_RATE } from '../../../../../../shared/src/CommonConstants';
import Timer from "../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer";

const EXTRA_COUNT = 6;

const EXTRA_PARAM =[
	{
		delay: 0,
		asset: "enemies/lightning_capsule/death/extra_eletricity/extra_electricity_e",
		pivot: {x: 50, y: 115},
		position: {x: 296.1, y: -79.4}
	},
	{
		delay: 4,
		asset: "enemies/lightning_capsule/death/extra_eletricity/extra_electricity_d",
		pivot: {x: 75, y: 150},
		position: {x: -316.7, y: -101.1}
	},
	{
		delay: 10,
		asset: "enemies/lightning_capsule/death/extra_eletricity/extra_electricity_b",
		pivot: {x: 150, y: 145},
		position: {x: 180.7, y: 170}
	},
	{
		delay: 14,
		asset: "enemies/lightning_capsule/death/extra_eletricity/extra_electricity_a",
		pivot: {x: 280, y: 125},
		position: {x: -9.4, y: -244.4}
	},
	{
		delay: 18,
		asset: "enemies/lightning_capsule/death/extra_eletricity/extra_electricity_c",
		pivot: {x: 190, y: 210},
		position: {x: -150, y: 98.9}
	},
	{
		delay: 23,
		asset: "enemies/lightning_capsule/death/extra_eletricity/extra_electricity_d",
		pivot: {x: 75, y: 150},
		position: {x: -316.7, y: -101.1}
	}
	
]

class LightningCapsuleExtraEletricityAnimation extends Sprite
{
	static get EVENT_ON_ANIMATION_ENDED()				{return "onAnimationEnded";}

	i_startIntroAnimation()
	{
		this._startIntroAnimation();
	}

	i_startOutroAnimation()
	{
		this._startOutroAnimation();
	}

	constructor()
	{
		super();

		this._fFXContainer_spr = this.addChild(new Sprite());
		this._fExtraEletricityAnimationContainer_spr = [];
		this._fExtraEletricityAnimation_spr = [];
		this._fStartTimer_t = null;
	}

	_startIntroAnimation()
	{
		this._startExtraEletricityAnimation();
	}

	_startOutroAnimation()
	{
		this._fStartTimer_t && this._fStartTimer_t.destructor();

		this._startOutroExtraEletricityContainerAnimation();
	}

	_startExtraEletricityAnimation()
	{
		for (let i = 0; i < EXTRA_COUNT; i++)
		{
			this._startExtraEletricitySpriteAnimation(i);
		}

		this._fStartTimer_t = new Timer(()=>{
			this._fStartTimer_t && this._fStartTimer_t.destructor();
			this._startExtraEletricityAnimation();
		}, 35*FRAME_RATE, true);
		
	}
	

	_startExtraEletricitySpriteAnimation(aIndex)
	{
		let lParam_obj = EXTRA_PARAM[aIndex];

		let lExtraEletricityAnimationContainer_spr = this._fExtraEletricityAnimationContainer_spr[aIndex] = this._fFXContainer_spr.addChild(new Sprite());
		lExtraEletricityAnimationContainer_spr.scale.set(0.42, 0.42);

		let lExtraEletricityAnimationE_spr = this._fExtraEletricityAnimation_spr[aIndex] = lExtraEletricityAnimationContainer_spr.addChild(APP.library.getSprite(lParam_obj.asset));
		lExtraEletricityAnimationE_spr.position.set(lParam_obj.position.x, lParam_obj.position.y);
		lExtraEletricityAnimationE_spr.pivot.set(lParam_obj.pivot.x, lParam_obj.pivot.y);
		lExtraEletricityAnimationE_spr.alpha = 0;
		

		let l_seq = [
			{tweens: [], duration: lParam_obj.delay * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 1.35}, {prop: 'scale.y', to: 1.35}], duration: 7 * FRAME_RATE}
		];

		Sequence.start(lExtraEletricityAnimationContainer_spr, l_seq);

		l_seq = [
			{tweens: [], duration: lParam_obj.delay * FRAME_RATE},
			{tweens: [], duration: 2 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}], duration: 0 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0}], duration: 6 * FRAME_RATE,
			onfinish: ()=>{
				this._fExtraEletricityAnimationContainer_spr[aIndex] && Sequence.destroy(Sequence.findByTarget(this._fExtraEletricityAnimationContainer_spr[aIndex]));
				this._fExtraEletricityAnimationContainer_spr[aIndex] && this._fExtraEletricityAnimationContainer_spr[aIndex].destroy();
				this._fExtraEletricityAnimationContainer_spr[aIndex] = null;

				this._fExtraEletricityAnimation_spr[aIndex] && Sequence.destroy(Sequence.findByTarget(this._fExtraEletricityAnimation_spr[aIndex]));
				this._fExtraEletricityAnimation_spr[aIndex] && this._fExtraEletricityAnimation_spr[aIndex].destroy();
				this._fExtraEletricityAnimation_spr[aIndex] = null;
			}}
		];

		Sequence.start(lExtraEletricityAnimationE_spr, l_seq);
	}

	_startOutroExtraEletricityContainerAnimation()
	{
		this._fFXContainer_spr.scale.set(1,1);

		let l_seq = [
			{tweens: [], duration: 8 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 0.82}, {prop: 'scale.y', to: 0.85}, {prop: 'alpha', to: 1}], duration: 4 * FRAME_RATE,
			onfinish: ()=>{
				this._interruppt();
				this._onExtraEletricityOutroAnimationCompletedSuspicision();
			}}
		];

		Sequence.start(this._fFXContainer_spr, l_seq);
	}

	_onExtraEletricityOutroAnimationCompletedSuspicision()
	{	
		this.emit(LightningCapsuleExtraEletricityAnimation.EVENT_ON_ANIMATION_ENDED);
	}

	_interruppt()
	{
		while (this._fExtraEletricityAnimationContainer_spr && this._fExtraEletricityAnimationContainer_spr.length)
		{
			let lExtraEletricityAnimationContainer_spr = this._fExtraEletricityAnimationContainer_spr.pop();
			if (lExtraEletricityAnimationContainer_spr)
			{
				Sequence.destroy(Sequence.findByTarget(lExtraEletricityAnimationContainer_spr));
				lExtraEletricityAnimationContainer_spr.destroy();
			}
			
		}
		this._fExtraEletricityAnimationContainer_spr = null;

		while (this._fExtraEletricityAnimation_spr && this._fExtraEletricityAnimation_spr.length)
		{
			let lExtraEletricityAnimation_spr = this._fExtraEletricityAnimation_spr.pop();
			if (lExtraEletricityAnimation_spr)
			{
				Sequence.destroy(Sequence.findByTarget(lExtraEletricityAnimation_spr));
				lExtraEletricityAnimation_spr.destroy();
			}
		}
		this._fExtraEletricityAnimation_spr = null;

		this._fFXContainer_spr && Sequence.destroy(Sequence.findByTarget(this._fFXContainer_spr));

	}

	destroy()
	{
		this._fStartTimer_t && this._fStartTimer_t.destructor();
		this._fStartTimer_t = null;

		this._interruppt();

		this._fFXContainer_spr = null;
		this._fExtraEletricityAnimationContainer_spr = null;
		this._fExtraEletricityAnimation_spr = null;

		super.destroy();
	}
}

export default LightningCapsuleExtraEletricityAnimation;