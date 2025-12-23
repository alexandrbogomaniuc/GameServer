import MTimeLine from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/timeLine/MTimeLine';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { Utils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import AtlasSprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import AtlasConfig from '../../../config/AtlasConfig';

let _turret_hitboom_textures = null;
function _generateTurretHitBoomTextures()
{
	if (_turret_hitboom_textures) return
	_turret_hitboom_textures = AtlasSprite.getFrames([APP.library.getAsset("weapons/DefaultGun/hitboom")], [AtlasConfig.TurretHitBoom], "");
}

const HALF_PI = Math.PI / 2;

class Turret1FireEffect extends Sprite
{
	static get EVENT_ON_ANIMATION_COMPLETED() {return "EVENT_ON_ANIMATION_COMPLETED";}

	constructor()
	{
		super();

		_generateTurretHitBoomTextures();

		this._fTimeLine_mtl = null;
		this._fCircle_s = null;
		this._fSparkLeft_s = null;
		this._fSparkRight_s = null;
		this._fAnimationCount_num = null;

		//DUST HORISONTAL...
		let l_s = APP.library.getSpriteFromAtlas("weapons/DefaultGun/default_turret_1/dust");
		l_s.anchor.set(0.5, 0.5);
		l_s.blendMode = PIXI.BLEND_MODES.ADD;
		this._fDustHorisontal_s = this.addChild(l_s);
		//...DUST HORISONTAL

		//DUST VERTICAL...
		l_s = APP.library.getSpriteFromAtlas("weapons/DefaultGun/default_turret_1/dust");
		l_s.anchor.set(0.1, 0.55);
		l_s.rotation = -HALF_PI;
		l_s.blendMode = PIXI.BLEND_MODES.ADD;
		this._fDustVertical_s = this.addChild(l_s);
		//...DUST VERTICAL

		//CIRCLE...
		l_s = APP.library.getSpriteFromAtlas("weapons/DefaultGun/default_turret_1/circle");
		l_s.anchor.set(0.5, 0.5);
		l_s.blendMode = PIXI.BLEND_MODES.ADD;
		this._fCircle_s = this.addChild(l_s);
		//...CIRCLE

		let lHitBoom_spr = this._fHitBoom_spr = this.addChild(new Sprite());
		lHitBoom_spr.textures = _turret_hitboom_textures;
		lHitBoom_spr.animationSpeed = 0.5; //30 / 60
		lHitBoom_spr.anchor.set(0.5, 0.5);
		lHitBoom_spr.position.x = 17;
		lHitBoom_spr.position.y = -128;
		lHitBoom_spr.scale.set(2.112, 2.184); //1.056 * 2, 1.092 * 2
		lHitBoom_spr.tint = 0xfffd77;
		
		lHitBoom_spr.alpha = 1;
		lHitBoom_spr.blendMode = PIXI.BLEND_MODES.ADD;
		this._fAnimationCount_num++;
		lHitBoom_spr.play();
		lHitBoom_spr.on('animationend', ()=>{
			lHitBoom_spr && lHitBoom_spr.destroy();	
			this._fAnimationCount_num--;
			this._onAnimationCompletedSuspicion();
		});

		//SPARKS...
		//LEFT...
		l_s = APP.library.getSpriteFromAtlas("weapons/DefaultGun/default_turret_1/bullet");
		l_s.scale.set(0.12);
		l_s.angle = -19;
		this._fSparkLeft_s = this.addChild(l_s);
		//...LEFT
		//RIGHT...
		l_s = APP.library.getSpriteFromAtlas("weapons/DefaultGun/default_turret_1/bullet");
		l_s.scale.set(0.12);
		l_s.angle = 18;
		this._fSparkRight_s = this.addChild(l_s);
		//...RIGHT
		//...SPARKS

		//ANIMATION...
		let l_mtl = new MTimeLine();

		//DUST HORISONTAL...
		l_mtl.addAnimation(
			this._fDustHorisontal_s,
			MTimeLine.SET_SCALE_X,
			0.31,
			[
				[0.91, 13],
			]);

		l_mtl.addAnimation(
			this._fDustHorisontal_s,
			MTimeLine.SET_SCALE_Y,
			0.31,
			[
				[0.64, 13],
			]);

		l_mtl.addAnimation(
			this._fDustHorisontal_s,
			MTimeLine.SET_ALPHA,
			1,
			[
				7,
				[0, 6],
			]);


		//...DUST HORISONTAL

		//DUST VERTICAL...

		l_mtl.addAnimation(
			this._fDustVertical_s,
			MTimeLine.SET_SCALE_X,
			0.18,
			[
				[0.45, 13],
			]);

		l_mtl.addAnimation(
			this._fDustVertical_s,
			MTimeLine.SET_SCALE_Y,
			0.31,
			[
				[0.64, 13],
			]);

		l_mtl.addAnimation(
			this._fDustVertical_s,
			MTimeLine.SET_ALPHA,
			1,
			[
				3,
				[0, 7],
			]);
		//...DUST VERTICAL

		//CIRCLE...
		l_mtl.addAnimation(
			this._fCircle_s,
			MTimeLine.SET_SCALE_Y,
			0.26,
			[
				[1, 10],
			]);

		l_mtl.addAnimation(
			this._fCircle_s,
			MTimeLine.SET_SCALE_X,
			0.26,
			[
				[1, 10],
			]);

		l_mtl.addAnimation(
			this._fCircle_s,
			MTimeLine.SET_ALPHA,
			1,
			[
				3,
				[0, 7]
			]);

		l_mtl.addAnimation(
			this._fCircle_s,
			MTimeLine.SET_Y,
			30,
			[
				[-40, 9],
			]);
		//...CIRCLE

		//SPARKS...
		//LEFT...
		l_mtl.addAnimation(
			this._fSparkLeft_s,
			MTimeLine.SET_X,
			-20,
			[
				[-40, 7],
			]);
		
		l_mtl.addAnimation(
			this._fSparkLeft_s,
			MTimeLine.SET_Y,
			20,
			[
				[-50, 7],
			]);
		
		l_mtl.addAnimation(
			this._fSparkLeft_s,
			MTimeLine.SET_ALPHA,
			0,
			[
				[1, 1],
				5,
				[0, 3]
			]);
		//...LEFT
		//RIGHT...
		l_mtl.addAnimation(
			this._fSparkRight_s,
			MTimeLine.SET_X,
			20,
			[
				[40, 7],
			]);
		
		l_mtl.addAnimation(
			this._fSparkRight_s,
			MTimeLine.SET_Y,
			10,
			[
				[-60, 7],
			]);
		
		l_mtl.addAnimation(
			this._fSparkRight_s,
			MTimeLine.SET_ALPHA,
			0,
			[
				[1, 1],
				5,
				[0, 3]
			]);
		//...RIGHT
		//...SPARKS


		l_mtl.callFunctionOnFinish(
			this._onTimeLineAnimationCompleted,
			this);

		this._fAnimationCount_num++;
		l_mtl.play();

		this._fTimeLine_mtl = l_mtl;
		//...ANIMATION


		this.scale.set(0.7);
	}

	_onTimeLineAnimationCompleted()
	{
		this._fAnimationCount_num--;
		this._onAnimationCompletedSuspicion();
	}

	_onAnimationCompletedSuspicion()
	{
		if (this._fAnimationCount_num == 0)
		{
			this.emit(Turret1FireEffect.EVENT_ON_ANIMATION_COMPLETED);
		}
	}

	destroy()
	{
		this._fTimeLine_mtl && this._fTimeLine_mtl.destroy();
		this._fDustVertical_s && this._fDustVertical_s.destroy();
		this._fDustHorisontal_s && this._fDustHorisontal_s.destroy();
		this._fHitBoom_s && this._fHitBoom_s.destroy();
		this._fCircle_s && this._fCircle_s.destroy();
		this._fSparkLeft_s && this._fSparkLeft_s.destroy();
		this._fSparkRight_s && this._fSparkRight_s.destroy();
		super.destroy();
	}
}

export default Turret1FireEffect 