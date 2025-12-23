import Sprite from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import * as Easing from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { APP } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../../../../shared/src/CommonConstants';
import { Sequence } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import Timer from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import { Utils } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';

class LightningBossOpticalFlareYellowAnimation extends Sprite
{
	static get EVENT_ON_ANIMATION_ENDED()				{return "onAnimationEnded";}

	i_startAppearingAnimation()
	{
		this._startAppearingAnimation();
	}

	i_startDisappearingAnimation()
	{
		this._startDisappearingAnimation();
	}

	get bossAppearingFXViewContainerInfo()
	{
		return APP.gameScreen.gameFieldController.bossAppearingFXViewContainerInfo;
	}

	constructor()
	{
		super();

		this._fContainer_spr = this.bossAppearingFXViewContainerInfo.container.addChild(new Sprite());
		
		this._fStartTimer_tmr = null;
		
		this._fAnimationCount_num = null;
		this._fOpticalFlare_spr = null;
		this._fIsNeedContainerWiggle_bl = null;
	}

	_startAppearingAnimation()
	{
		if (!APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._onAnimationCompletedSuspicison();
			return;
		}

		this._fAnimationCount_num = 0;
		
		let lTimer = this._fStartTimer_tmr = new Timer(()=>{
			lTimer && lTimer.destructor();
			let lOpticalFlare_spr = this._fOpticalFlare_spr = this._fContainer_spr.addChild(APP.library.getSprite('boss_mode/common/optical_flare_yellow'));

			lOpticalFlare_spr.alpha = 0;
			lOpticalFlare_spr.scale.set(2.087, -2.085);
			lOpticalFlare_spr.blendMode = PIXI.BLEND_MODES.ADD;

			let lSmoke_seq = [
				{tweens: [{prop: 'alpha', to: 0.99}], duration: 15 * FRAME_RATE},
				{tweens: [{prop: 'alpha', to: 0}], duration: 94 * FRAME_RATE,
						onfinish: ()=>{
							this._fIsNeedContainerWiggle_bl = false;
							lOpticalFlare_spr && lOpticalFlare_spr.destroy();
							lOpticalFlare_spr = null;
							this._fAnimationCount_num--;
							this._onAnimationCompletedSuspicison();
				}}
			]
	
			this._fAnimationCount_num++;
			this._fIsNeedContainerWiggle_bl = true;
			Sequence.start(lOpticalFlare_spr, lSmoke_seq);

			this._startWiggle();

		}, 31 * FRAME_RATE, true);	
	}

	_startDisappearingAnimation()
	{
		if (!APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._onAnimationCompletedSuspicison();
			return;
		}

		this._fAnimationCount_num = 0;
		
		let lTimer = this._fStartTimer_tmr = new Timer(()=>{
			lTimer && lTimer.destructor();
			let lOpticalFlare_spr = this._fOpticalFlare_spr = this._fContainer_spr.addChild(APP.library.getSprite('boss_mode/common/optical_flare_yellow'));

			lOpticalFlare_spr.alpha = 0.6;
			lOpticalFlare_spr.scale.set(2.087, -2.085);
			lOpticalFlare_spr.blendMode = PIXI.BLEND_MODES.ADD;

			let lSmoke_seq = [
				{tweens: [{prop: 'alpha', to: 0.8}], duration: 78 * FRAME_RATE},
				{tweens: [{prop: 'alpha', to: 0}], duration: 50 * FRAME_RATE,
						onfinish: ()=>{
							this._fIsNeedContainerWiggle_bl = false;
							lOpticalFlare_spr && lOpticalFlare_spr.destroy();
							lOpticalFlare_spr = null;
							this._fAnimationCount_num--;
							this._onAnimationCompletedSuspicison();
				}}
			]

			this._fAnimationCount_num++;
			this._fIsNeedContainerWiggle_bl = true;
			Sequence.start(lOpticalFlare_spr, lSmoke_seq);

			this._startWiggle();

		}, 16 * FRAME_RATE, true);
	}

	_startWiggle()
	{  
		let l_seq = [
			{tweens: [{prop: 'alpha', to: 0.6 * Utils.getRandomWiggledValue(0.8, 0.2)}], duration: 1 * FRAME_RATE,
				onfinish: ()=>{
					if (this._fIsNeedContainerWiggle_bl)
					{
						this._startWiggle();
					}
			}}
		]

		Sequence.start(this._fContainer_spr, l_seq);
	}


	_onAnimationCompletedSuspicison()
	{
		if (this._fAnimationCount_num == 0)
		{
			this.emit(LightningBossOpticalFlareYellowAnimation.EVENT_ON_ANIMATION_ENDED);
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

export default LightningBossOpticalFlareYellowAnimation;