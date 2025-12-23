import Sprite from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { APP } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../../../../shared/src/CommonConstants';
import { Sequence } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import Timer from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import { Utils } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';

class LightningBossGradientOrangeAnimation extends Sprite
{
	static get EVENT_ON_ANIMATION_ENDED()				{return "onAnimationEnded";}

	i_startAnimation()
	{
		this._startAnimation();
	}

	constructor()
	{
		super();

		this._fContainer_spr = this.addChild(new Sprite());

		this._fStartTimer_tmr = null;
		
		this._fAnimationCount_num = null;
		this._fGradientlFlare1_spr = null;
		this._fGradientlFlare2_spr = null;
		this._fIsNeedWiggle_bl = null;
	}

	_startAnimation()
	{
		if (!APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._onAnimationCompletedSuspicison();
			return;
		}

		this._fAnimationCount_num = 0;
		
		let lTimer = this._fStartTimer_tmr = new Timer(()=>{
			lTimer && lTimer.destructor();
			let lGradientlFlare1_spr = this._fGradientlFlare1_spr = this._fContainer_spr.addChild(APP.library.getSprite('boss_mode/common/gradient_orange'));
			lGradientlFlare1_spr.alpha = 0;
			lGradientlFlare1_spr.position.x = -391.4; 	//-782.8 / 2; 
			lGradientlFlare1_spr.position.y = -7.5; 
			lGradientlFlare1_spr.scale.set(3.37, 2.32); 	
			lGradientlFlare1_spr.blendMode = PIXI.BLEND_MODES.ADD;
			lGradientlFlare1_spr.rotation = 1.5707963267948966; //Utils.gradToRad(90);

			let lGradientlFlare2_spr = this._fGradientlFlare2_spr = this._fContainer_spr.addChild(APP.library.getSprite('boss_mode/common/gradient_orange'));
			lGradientlFlare2_spr.alpha = 0;
			lGradientlFlare2_spr.position.x = 389.75; 	//779.5 / 2
			lGradientlFlare2_spr.position.y = -7.5;
			lGradientlFlare2_spr.scale.set(3.37, -2.32); 
			lGradientlFlare2_spr.blendMode = PIXI.BLEND_MODES.ADD;
			lGradientlFlare2_spr.rotation = 1.5707963267948966; //Utils.gradToRad(90);

			this._fContainer_spr.alpha = 0.17;

			let l_seq = [
				{tweens: [{prop: 'alpha', to: 0.15}], duration: 11 * FRAME_RATE},
				{tweens: [{prop: 'alpha', to: 0.6}], duration: 54 * FRAME_RATE},
				{tweens: [{prop: 'alpha', to: 0}], duration: 51 * FRAME_RATE,
						onfinish: ()=>{
							this._fIsNeedWiggle_bl = false;
							lGradientlFlare1_spr && Sequence.destroy(Sequence.findByTarget(lGradientlFlare1_spr));
							lGradientlFlare1_spr && lGradientlFlare1_spr.destroy();
							this._fGradientlFlare1_spr = null;

							lGradientlFlare2_spr && Sequence.destroy(Sequence.findByTarget(lGradientlFlare2_spr));
							lGradientlFlare2_spr && lGradientlFlare2_spr.destroy();
							this._fGradientlFlare2_spr = null;

							this._fAnimationCount_num--;
							this._onAnimationCompletedSuspicison();
				}}
			]
	
			this._fAnimationCount_num++;
			this._fIsNeedWiggle_bl = true;
			Sequence.start(this._fContainer_spr, l_seq);

			this._startWiggle1();
			this._startWiggle2();

		}, 36 * FRAME_RATE, true);
	}

	_startWiggle1()
	{  
		let l_seq = [
			{tweens: [{prop: 'alpha', to: 0.6 * Utils.getRandomWiggledValue(0.8, 0.2)}], duration: 1 * FRAME_RATE,
				onfinish: ()=>{
					if (this._fIsNeedWiggle_bl)
					{
						this._startWiggle1();
					}
			}}
		]

		Sequence.start(this._fGradientlFlare1_spr, l_seq);
	}

	_startWiggle2()
	{  
		let l_seq = [
			{tweens: [{prop: 'alpha', to: 0.6 * Utils.getRandomWiggledValue(0.8, 0.2)}], duration: 1 * FRAME_RATE,
				onfinish: ()=>{
					if (this._fIsNeedWiggle_bl)
					{
						this._startWiggle2();
					}
			}}
		]

		Sequence.start(this._fGradientlFlare2_spr, l_seq);
	}


	_onAnimationCompletedSuspicison()
	{
		if (this._fAnimationCount_num == 0)
		{
			this.emit(LightningBossGradientOrangeAnimation.EVENT_ON_ANIMATION_ENDED);
		}
	}

	destroy()
	{
		super.destroy();

		this._fStartTimer_tmr && this._fStartTimer_tmr.destructor();

		this._fOpticalFlare_spr && Sequence.destroy(Sequence.findByTarget(this._fOpticalFlare_spr));
		this._fOpticalFlare_spr && this._fOpticalFlare_spr.destroy();
		this._fOpticalFlare_spr = null;

		this._fContainer_spr && Sequence.destroy(Sequence.findByTarget(this._fContainer_spr));
		this._fContainer_spr && this._fContainer_spr.destroy();
		this._fContainer_spr = null;
	
		this._fAnimationCount_num = null;
	}
}

export default LightningBossGradientOrangeAnimation;