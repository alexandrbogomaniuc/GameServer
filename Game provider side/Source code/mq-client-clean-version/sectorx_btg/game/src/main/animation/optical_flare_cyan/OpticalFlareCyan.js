import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import * as Easing from '../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';

import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../shared/src/CommonConstants';
import { Sequence } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import { Utils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';

class OpticalFlareCyan extends Sprite
{
	static get EVENT_ON_OUTRO_ANIMATION_ENDED()				{return "onOutroAnimationEnded";}

	i_startAnimation()
	{
		this._startAnimation();
	}

	i_startOutroAnimation()
	{
		this._startOutroAnimation();
	}

	constructor()
	{
		super();

		this._fOpticalFlareCyan_spr = null;
		this._fOpticalFlareCyanWiggle_s = null;	
	}

	_startAnimation()
	{
		let lOpticalFlareCyan_spr = this._fOpticalFlareCyan_spr = APP.gameScreen.gameFieldController.lightningCapsuleOpticalFlareCyanContainer.container.addChild(APP.library.getSprite('enemies/lightning_capsule/death/lighting_optical_flare_cyan'));
		lOpticalFlareCyan_spr.zIndex = APP.gameScreen.gameFieldController.lightningCapsuleOpticalFlareCyanContainer.zIndex;
		lOpticalFlareCyan_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lOpticalFlareCyan_spr.scale.set(2.1, 2.1);
		lOpticalFlareCyan_spr.position.set(480, 270); //960 / 2, 540 / 2
		lOpticalFlareCyan_spr.alpha = 0;

		let l_seq = [
			{tweens: [], duration: 10 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}], duration: 3 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0.5}], duration: 8 * FRAME_RATE, ease: Easing.quadratic.easeInOut,
				onfinish: ()=>{
				this._startOpticalFlareCyanWiggleAnimation();
			}}];
		
		Sequence.start(lOpticalFlareCyan_spr, l_seq);
	}

	_startOpticalFlareCyanWiggleAnimation()
	{
		let l_seq = [
			{tweens: [
					{prop: 'alpha', to: Utils.getRandomWiggledValue(0.5, 0.12)}],
					duration: 9 * FRAME_RATE,
			onfinish: ()=>{
				this._fOpticalFlareCyan_spr && Sequence.destroy(Sequence.findByTarget(this._fOpticalFlareCyan_spr));
				this._startOpticalFlareCyanWiggleAnimation();
			}} 
		];

		this._fOpticalFlareCyanWiggle_s = Sequence.start(this._fOpticalFlareCyan_spr, l_seq);
	}

	_startOutroAnimation()
	{
		this._fOpticalFlareCyan_spr && Sequence.destroy(Sequence.findByTarget(this._fOpticalFlareCyan_spr));

		let l_seq = [
			{tweens: [],	duration: 5 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0.91}],	duration: 3 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0}],	duration: 5 * FRAME_RATE,
			onfinish: ()=>{
				this._fOpticalFlareCyan_spr && Sequence.destroy(Sequence.findByTarget(this._fOpticalFlareCyan_spr));
				this.emit(OpticalFlareCyan.EVENT_ON_OUTRO_ANIMATION_ENDED);
			}} 
		];

		Sequence.start(this._fOpticalFlareCyan_spr, l_seq);
	}

	destroy()
	{
		super.destroy();

		this._fOpticalFlareCyanWiggle_s && this._fOpticalFlareCyanWiggle_s.destructor();
		this._fOpticalFlareCyan_spr && Sequence.destroy(Sequence.findByTarget(this._fOpticalFlareCyan_spr));
		this._fOpticalFlareCyan_spr && this._fOpticalFlareCyan_spr.destroy();
			
		this._fOpticalFlareCyanWiggle_s = null;
		this._fOpticalFlareCyan_spr = null;
	}
}

export default OpticalFlareCyan;