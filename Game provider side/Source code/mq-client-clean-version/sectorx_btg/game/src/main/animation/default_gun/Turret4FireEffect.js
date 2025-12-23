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

class Turret4FireEffect extends Sprite
{
	static get EVENT_ON_ANIMATION_COMPLETED() {return "EVENT_ON_ANIMATION_COMPLETED";}

	constructor()
	{
		super();

		_generateTurretHitBoomTextures();
		
		this._fTimeLine_mtl = null;
		this._fAnimationCount_num = null;
		this._fDustHorisontalTop_s = null;
		this._fDustHorisontalBottom_s = null;
		this._fDustVertical_s = null;

		//DUST HORISONTAL...
		let l_s = APP.library.getSpriteFromAtlas("weapons/DefaultGun/default_turret_4/dust");
		l_s.anchor.set(0.5, 0.5);
		l_s.scale.set(0.96, 0.96);
		l_s.blendMode = PIXI.BLEND_MODES.ADD;
		this._fDustHorisontalTop_s = this.addChild(l_s);
		l_s = APP.library.getSpriteFromAtlas("weapons/DefaultGun/default_turret_4/dust");
		l_s.anchor.set(0.5, 0.5);
		l_s.scale.set(0.96, 0.96);
		l_s.blendMode = PIXI.BLEND_MODES.ADD;
		this._fDustHorisontalBottom_s = this.addChild(l_s);
		//...DUST HORISONTAL

		//DUST VERTICAL...
		l_s = APP.library.getSpriteFromAtlas("weapons/DefaultGun/default_turret_4/dust");
		l_s.anchor.set(0.1, 0.55);
		l_s.scale.set(0.96, 0.96);
		l_s.rotation = -Math.PI / 2;
		l_s.blendMode = PIXI.BLEND_MODES.ADD;
		this._fDustVertical_s = this.addChild(l_s);
		//...DUST VERTICAL
		
		//CHAINE MUZZLE...
		this._fChaineMuzzleContainer_spr = this.addChild(new Sprite());

		l_s = APP.library.getSpriteFromAtlas("weapons/DefaultGun/default_turret_4/chainmuzzle");
		l_s.rotation = 1.7627825445142729; //Utils.gradToRad(101);
		l_s.position.set(9, -4);
		l_s.scale.set(0.401, -0.275);
		l_s.blendMode = PIXI.BLEND_MODES.ADD;
		this._fChaineMuzzle_s = this._fChaineMuzzleContainer_spr.addChild(l_s);

		l_s = APP.library.getSpriteFromAtlas("weapons/DefaultGun/default_turret_4/chainmuzzle");
		l_s.rotation = 1.7453292519943295; //Utils.gradToRad(100);
		l_s.position.set(1, -6);
		l_s.scale.set(0.41, -0.282); 
		l_s.blendMode = PIXI.BLEND_MODES.ADD;
		this._fChaineMuzzle_s = this._fChaineMuzzleContainer_spr.addChild(l_s);

		l_s = APP.library.getSpriteFromAtlas("weapons/DefaultGun/default_turret_4/chainmuzzle");
		l_s.rotation = 1.4486232791552935; //Utils.gradToRad(83);
		l_s.position.set(-9, -5);
		l_s.scale.set(0.41, 0.282); 
		l_s.blendMode = PIXI.BLEND_MODES.ADD;
		this._fChaineMuzzle_s = this._fChaineMuzzleContainer_spr.addChild(l_s);
		//...CHAINE MUZZLE

		let lHitBoom_spr = this._fHitBoom_spr = this.addChild(new Sprite());
		lHitBoom_spr.textures = _turret_hitboom_textures;
		lHitBoom_spr.animationSpeed = 0.5; //30 / 60
		lHitBoom_spr.anchor.set(0.5, 0.5);
		lHitBoom_spr.position.x = 20;
		lHitBoom_spr.position.y = -125;
		lHitBoom_spr.scale.set(2.069, 2.14);
		lHitBoom_spr.tint = 0x6B23E4;
		
		lHitBoom_spr.alpha = 1;
		lHitBoom_spr.blendMode = PIXI.BLEND_MODES.ADD;
		this._fAnimationCount_num++;
		lHitBoom_spr.play();
		lHitBoom_spr.on('animationend', ()=>{
			lHitBoom_spr && lHitBoom_spr.destroy();	
			this._fAnimationCount_num--;
			this._onAnimationCompletedSuspicion();
		});

		//ANIMATION...
		let l_mtl = new MTimeLine();

		//DUST HORISONTAL...
		l_mtl.addAnimation(
			this._fDustHorisontalTop_s,
			MTimeLine.SET_SCALE_X,
			0.297,
			[
				[0.777, 13],
			]);

		l_mtl.addAnimation(
			this._fDustHorisontalTop_s,
			MTimeLine.SET_SCALE_Y,
			0.297,
			[
				[0.547, 13],
			]);

		l_mtl.addAnimation(
			this._fDustHorisontalTop_s,
			MTimeLine.SET_ALPHA,
			1,
			[
				7,
				[0, 6],
			]);

		l_mtl.addAnimation(
			this._fDustHorisontalBottom_s,
			MTimeLine.SET_SCALE_X,
			0.297,
			[
				[0.777, 13],
			]);

		l_mtl.addAnimation(
			this._fDustHorisontalBottom_s,
			MTimeLine.SET_SCALE_Y,
			-0.297,
			[
				[-0.681],
			]);

		l_mtl.addAnimation(
			this._fDustHorisontalBottom_s,
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
			0.172,
			[
				[0.432, 13],
			]);

		l_mtl.addAnimation(
			this._fDustVertical_s,
			MTimeLine.SET_SCALE_Y,
			0.297,
			[
				[0.614, 13],
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

		l_mtl.addAnimation(
			this._fChaineMuzzleContainer_spr,
			MTimeLine.SET_ALPHA,
			1,
			[
				1,
				[0, 2],
			]);

		l_mtl.callFunctionOnFinish(
			this._onChaineAnimationCompleted,
			this);

		this._fAnimationCount_num++;
		l_mtl.play();

		this._fTimeLine_mtl = l_mtl;
		//...ANIMATION

		this.scale.set(0.825);
	}

	_onChaineAnimationCompleted()
	{
		this._fAnimationCount_num--;
		this._onAnimationCompletedSuspicion();
	}

	_onAnimationCompletedSuspicion()
	{
		if (this._fAnimationCount_num == 0)
		{
			this.emit(Turret4FireEffect.EVENT_ON_ANIMATION_COMPLETED);
		}
	}

	destroy()
	{
		this._fTimeLine_mtl && this._fTimeLine_mtl.destroy();
		this._fDustHorisontalTop_s && this._fDustHorisontalTop_s.destroy();
		this._fDustHorisontalBottom_s && this._fDustHorisontalBottom_s.destroy();
		this._fDustVertical_s && this._fDustVertical_s.destroy();
		this._fChaineMuzzleContainer_spr && this._fChaineMuzzleContainer_spr.destroy();
		this._fHitBoom_s && this._fHitBoom_s.destroy();
		super.destroy();
	}
}

export default Turret4FireEffect 