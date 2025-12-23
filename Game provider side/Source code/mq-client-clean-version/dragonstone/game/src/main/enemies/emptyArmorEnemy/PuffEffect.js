import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { Utils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import AtlasSprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import AtlasConfig from '../../../config/AtlasConfig';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import Timer from "../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer";


class PuffEffect extends Sprite{

	static get PUFF_ANIMATION_SPEED() { return 0.5 }

	constructor(){
		super();
		this.smoke = null;
		
		this.createView();
		this.smoke.visible = false;

		this._fIsAnimationInProgress_bl = false;

	}

	createView(){
		this.smoke = this.addChild(new Sprite);
		this.smoke.textures = PuffEffect.getSmokeTextures();
		this.smoke.position.set(0, 0);
		this.smoke.animationSpeed = PuffEffect.PUFF_ANIMATION_SPEED;

		this.smoke.on('animationend', (e) => {
			this.smoke.stop();
			this.smoke.visible = false;
			this._fIsAnimationInProgress_bl = false;
		});
	}

	pause()
	{
		this.smoke.animationSpeed = 0;
	}

	unpause()
	{
		this.smoke.animationSpeed = PuffEffect.PUFF_ANIMATION_SPEED;
	}

	stopAnimation(){
		this._fIsAnimationInProgress_bl = false;
		this.smoke.visible = false;
	}

	isPlaying()
	{
		return this._fIsAnimationInProgress_bl;	
	}

	play()
	{
		this.smoke.visible = true;
		this.smoke.play();
		this._fIsAnimationInProgress_bl = true;
	}

}

PuffEffect.getSmokeTextures = function(){
	if(!PuffEffect.smokeTextures){
		PuffEffect.setSmokeTextures();
	}
	return PuffEffect.smokeTextures;
}

PuffEffect.setSmokeTextures = function (){
	var asset = AtlasSprite.getFrames(APP.library.getAsset("enemies/wall_knight/green_puff"), AtlasConfig.GreenPuff, "");
	var config = AtlasConfig.GreenPuff[0];
	var pathName = "green_puff";
	PuffEffect.smokeTextures = AtlasSprite.getFrames(APP.library.getAsset("enemies/wall_knight/green_puff"), AtlasConfig.GreenPuff, "");
}

export default PuffEffect;