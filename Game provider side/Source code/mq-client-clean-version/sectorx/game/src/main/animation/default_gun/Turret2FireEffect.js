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

class Turret2FireEffect extends Sprite
{
	static get EVENT_ON_ANIMATION_COMPLETED() {return "EVENT_ON_ANIMATION_COMPLETED";}

	constructor()
	{
		super();

		_generateTurretHitBoomTextures();

		this._fTimeLine_mtl = null;
		this._fCircle_s = null;
		this._fDustHorisontal_s = null;
		this._fDustVertical_s = null;
		this._fAnimationCount_num = null;

		//DUST HORISONTAL...
		let l_s = APP.library.getSpriteFromAtlas("weapons/DefaultGun/default_turret_2/dust");
		l_s.anchor.set(0.5, 0.5);
		l_s.blendMode = PIXI.BLEND_MODES.ADD;
		this._fDustHorisontal_s = this.addChild(l_s);
		//...DUST HORISONTAL

		//DUST VERTICAL...
		l_s = APP.library.getSpriteFromAtlas("weapons/DefaultGun/default_turret_2/dust");
		l_s.anchor.set(0.1, 0.55);
		l_s.rotation = -Math.PI / 2;
		l_s.blendMode = PIXI.BLEND_MODES.ADD;
		this._fDustVertical_s = this.addChild(l_s);
		//...DUST VERTICAL

		//CIRCLE...
		l_s = APP.library.getSpriteFromAtlas("weapons/DefaultGun/default_turret_2/circle");
		l_s.anchor.set(0.5, 0.5);
		l_s.blendMode = PIXI.BLEND_MODES.ADD;
		l_s.scale.set(0);
		l_s.position.x = 0;
		this._fCircle_s = this.addChild(l_s);
		//...CIRCLE

		let lHitBoom_spr = this._fHitBoom_spr = this.addChild(new Sprite());
		lHitBoom_spr.textures = _turret_hitboom_textures;
		lHitBoom_spr.animationSpeed = 0.5; //30 / 60
		lHitBoom_spr.anchor.set(0.5, 0.5);
		lHitBoom_spr.position.x = 24;
		lHitBoom_spr.position.y = -140;
		lHitBoom_spr.scale.set(2.712, 2.804); //1.356 * 2, 1.402 * 2
		lHitBoom_spr.tint = 0x42ff06;
		
		lHitBoom_spr.alpha = 1;
		lHitBoom_spr.blendMode = PIXI.BLEND_MODES.ADD;
		this._fAnimationCount_num++;
		lHitBoom_spr.play();
		lHitBoom_spr.on('animationend', ()=>{
			lHitBoom_spr && lHitBoom_spr.destroy();
			this._fAnimationCount_num--;
			this._onAnimationCompletedSuspicion();
		});


		//CHAINE MUZZLE...
		this._fChaineMuzzleContainer_spr = this.addChild(new Sprite());

		l_s = APP.library.getSpriteFromAtlas("weapons/DefaultGun/default_turret_2/chainmuzzle");
		l_s.rotation = 1.4486232791552935; //Utils.gradToRad(83);
		l_s.position.set(-3, 6);
		l_s.position.alpha = 0.99
		l_s.scale.set(0.358, 0.194);
		l_s.blendMode = PIXI.BLEND_MODES.ADD;
		this._fChaineMuzzle_s = this._fChaineMuzzleContainer_spr.addChild(l_s);
		//...CHAINE MUZZLE

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
			0.8,
			[
				7,
				[0, 6],
			]);
		//...DUST VERTICAL

		//CIRCLE...
		l_mtl.addAnimation(
			this._fCircle_s,
			MTimeLine.SET_SCALE_Y,
			0.45,
			[
				[1, 10]
			]);

		l_mtl.addAnimation(
			this._fCircle_s,
			MTimeLine.SET_SCALE_X,
			0.45,
			[
				[1, 10]
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

		l_mtl.addAnimation(
			this._fChaineMuzzleContainer_spr,
			MTimeLine.SET_ALPHA,
			1,
			[
				1,
				[0, 2],
			]);


		l_mtl.callFunctionOnFinish(
			this._onTimeLineAnimationCompleted,
			this);

		this._fAnimationCount_num++;
		l_mtl.play();

		this._fTimeLine_mtl = l_mtl;
		//...ANIMATION

		this.scale.set(0.845);
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
			this.emit(Turret2FireEffect.EVENT_ON_ANIMATION_COMPLETED);
		}
	}

	destroy()
	{
		this._fTimeLine_mtl && this._fTimeLine_mtl.destroy();
		this._fDustVertical_s && this._fDustVertical_s.destroy();
		this._fDustHorisontal_s && this._fDustHorisontal_s.destroy();
		this._fChaineMuzzleContainer_spr && this._fChaineMuzzleContainer_spr.destroy();
		this._fHitBoom_s && this._fHitBoom_s.destroy();
		super.destroy();
	}
}

export default Turret2FireEffect 