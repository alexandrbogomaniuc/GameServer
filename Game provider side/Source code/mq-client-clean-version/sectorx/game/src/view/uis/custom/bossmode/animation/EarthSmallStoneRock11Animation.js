import Sprite from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import * as Easing from '../../../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../../../shared/src/CommonConstants';
import { Sequence } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import { Utils } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';

class EarthSmallStoneRock11Animation extends Sprite
{
	static get EVENT_ON_ANIMATION_ENDED()				{return "onAnimationEnded";}

	i_startAnimation(aDelay)
	{
		this._startAnimation(aDelay);
	}

	constructor()
	{
		super();
		
		this._fAnimationCount_num = null;

		this._fStone_spr_arr = [];

		//this.position.set(-270, -80);
	}

	_startAnimation(aDelay = 0)
	{
		this._fAnimationCount_num = 0;

		this._fStartComp15Animation(0, 2 + aDelay, 1);
		this._fStartComp14Animation(1, 7 + aDelay, -1);
		this._fStartComp16Animation(2, 3 + aDelay, 1, 30);
		this._fStartComp16Animation(3, 7 + aDelay, 1, 0);
		this._fStartComp14Animation(4, 16 + aDelay, -1);
	}

	_fStartComp15Animation(aIndex, delay, direction)
	{
		let lStone_spr = this._fStone_spr_arr[aIndex] = this.addChild(APP.library.getSpriteFromAtlas('boss_mode/earth/srock_05'));

		lStone_spr.alpha = 0;
		lStone_spr.position.set(3, -0.7);
		lStone_spr.scale.set(0.09805 * direction, 0.196471); //0.37 * 0.265 * direction, 0.583 * 0.337
		
		let lSmoke_seq = [
			{tweens: [], duration: delay * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}], duration: 0 * FRAME_RATE},
			{tweens: [{prop: 'x', to: 13.4}, {prop: 'y', to: - 162.8}, {prop: 'rotation', to: 1.0245082709206714}], ease: Easing.quadratic.easeOut, duration: 11 * FRAME_RATE}, // Utils.gradToRad(58.7)
			{tweens: [{prop: 'x', to: 54.6}, {prop: 'y', to: 4.7}, {prop: 'rotation', to: 2.605776573227534}], ease: Easing.quadratic.easeIn, duration: 17 * FRAME_RATE, // Utils.gradToRad(149.3)
					onfinish: ()=>{
						lStone_spr && lStone_spr.destroy(); 
						lStone_spr = null;
						this._fAnimationCount_num--;
						this._onAnimationCompletedSuspicison();
			}}
		]

		this._fAnimationCount_num++;
		Sequence.start(lStone_spr, lSmoke_seq);
	}

	_fStartComp14Animation(aIndex, delay, direction)
	{
		let lStone_spr = this._fStone_spr_arr[aIndex] = this.addChild(APP.library.getSpriteFromAtlas('boss_mode/earth/srock_02'));

		lStone_spr.alpha = 0;
		lStone_spr.position.set(7 ,-0.7); 
		lStone_spr.scale.set(0.2756, 0.55268); //1.04 * 0.265, 1.64 * 0.337
		
		let lSmoke_seq = [
			{tweens: [], duration: delay * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}], duration: 0 * FRAME_RATE}, 
			{tweens: [{prop: 'x', to: 0.6}, {prop: 'y', to: - 162.8}, {prop: 'rotation', to: 1.0245082709206714 * direction}], ease: Easing.quadratic.easeOut, duration: 11 * FRAME_RATE}, //Utils.gradToRad(58.7 * direction)
			{tweens: [{prop: 'x', to: - 40.6}, {prop: 'y', to: 4.7}, {prop: 'rotation', to: 2.605776573227534 * direction}], ease: Easing.quadratic.easeIn, duration: 17 * FRAME_RATE, //Utils.gradToRad(149.3 * direction)
					onfinish: ()=>{
						lStone_spr && lStone_spr.destroy(); 
						lStone_spr = null;
						this._fAnimationCount_num--;
						this._onAnimationCompletedSuspicison();
			}}
		]

		this._fAnimationCount_num++;
		Sequence.start(lStone_spr, lSmoke_seq);
	}

	_fStartComp16Animation(aIndex, delay, direction, offset)
	{
		let lStone_spr = this._fStone_spr_arr[aIndex] = this.addChild(APP.library.getSpriteFromAtlas('boss_mode/earth/srock_04'));

		lStone_spr.alpha = 0;
		lStone_spr.position.set(3.3 + offset, -0.7); 
		lStone_spr.scale.set(0.09805, 0.196471); //0.37 * 0.265, 0.583 * 0.337
		
		let lSmoke_seq = [
			{tweens: [], duration: delay * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}], duration: 0 * FRAME_RATE}, 
			{tweens: [{prop: 'x', to: 31.4 + offset}, {prop: 'y', to: - 190.3}, {prop: 'rotation', to: 1.0245082709206714 * direction}], ease: Easing.quadratic.easeOut, duration: 11 * FRAME_RATE}, //Utils.gradToRad(58.7 * direction)
			{tweens: [{prop: 'x', to: 54.6 + offset}, {prop: 'y', to: 4.7}, {prop: 'rotation', to: 2.605776573227534 * direction}], ease: Easing.quadratic.easeIn, duration: 17 * FRAME_RATE, //Utils.gradToRad(149.3 * direction)
					onfinish: ()=>{
						lStone_spr && lStone_spr.destroy(); 
						lStone_spr = null;
						this._fAnimationCount_num--;
						this._onAnimationCompletedSuspicison();
			}}
		]

		this._fAnimationCount_num++;
		Sequence.start(lStone_spr, lSmoke_seq);
	}
	

	_onAnimationCompletedSuspicison()
	{
		if (this._fAnimationCount_num == 0)
		{
			this.emit(EarthSmallStoneRock11Animation.EVENT_ON_ANIMATION_ENDED);
		}
	}

	destroy()
	{
		super.destroy();

		for (let i = 0; i < this._fStone_spr_arr.length; i++)
		{
			if (!this._fStone_spr_arr)
			{
				break;
			}

			this._fStone_spr_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fStone_spr_arr[i]));
			this._fStone_spr_arr[i] && this._fStone_spr_arr[i].destroy();
			this._fStone_spr_arr[i] = null;
		}

		this._fStone_spr_arr = [];	

		this._fAnimationCount_num = null;
	}
}

export default EarthSmallStoneRock11Animation;