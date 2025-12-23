import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { Utils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import AtlasSprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import AtlasConfig from '../../../config/AtlasConfig';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import Timer from "../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer";


const FINAL_SCALE = 0.1;
const FINAL_ALPHA = 0;
const FINAL_Y = -30;


class GreenSmokeEffect extends Sprite{
	constructor(aDeltaMultiplier_num){
		super();
		this.smoke = null;
		this._fIsAnimationInProgress_bl = false;
		this._fProgress_num = 0;


		let lFx_spr = this.addChild(APP.library.getSprite("enemies/wall_knight/green_smoke"));

		lFx_spr.scale.set(0);
		lFx_spr.position.set(0, 0);
		lFx_spr.alpha = 0;
		

		this.smoke = lFx_spr;
		this.smoke.visible = false;
		this._fDeltaMultiplier_num = aDeltaMultiplier_num ? aDeltaMultiplier_num : 1;

		lFx_spr.pivot.set(30 * this._fDeltaMultiplier_num, 30 * this._fDeltaMultiplier_num);
	}

	stopAnimation(){
		this._fIsAnimationInProgress_bl = false;
		this.smoke.visible = false;
	}

	update(){

		if(!this._fIsAnimationInProgress_bl)
		{
			return
		}

		this._fProgress_num += 0.015;
		
		if(this._fProgress_num >= 1)
		{
			this._fProgress_num = 0;
			this._fIsAnimationInProgress_bl = false;
			this.smoke.visible = false;
		}
		

		let lProgress_num = this._fProgress_num;

		this.smoke.scale.set(lProgress_num);
		this.smoke.position.set(0, FINAL_Y * lProgress_num * this._fDeltaMultiplier_num);

		let lAlpha_num = 1;

		if(lProgress_num > 0.5)
		{
			lAlpha_num = 1 - (lProgress_num - 0.5) * 2;
		}

		this.smoke.alpha = lAlpha_num;

	}

	isPlaying()
	{
		return this._fIsAnimationInProgress_bl;	
	}

	play()
	{
		this.smoke.visible = true;
		this._fProgress_num = 0;
		this._fIsAnimationInProgress_bl = true;

		this.smoke.scale.set(0);
		this.smoke.position.set(0, 0);
	}

}

export default GreenSmokeEffect;