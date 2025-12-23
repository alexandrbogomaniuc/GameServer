import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import AtlasSprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import AtlasConfig from '../../../config/AtlasConfig';
import MTimeLine from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/timeLine/MTimeLine';
import { Utils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';

let _turret_hitboom_textures = null;
function _generateTurretHitBoomTextures()
{
	if (_turret_hitboom_textures) return
	_turret_hitboom_textures = AtlasSprite.getFrames([APP.library.getAsset("weapons/DefaultGun/hitboom")], [AtlasConfig.TurretHitBoom], "");
}

class Turret5FireEffect extends Sprite
{
	static get EVENT_ON_ANIMATION_COMPLETED() {return "EVENT_ON_ANIMATION_COMPLETED";}

	constructor( )
	{
		super();

		this._fTimeLine_mtl = null;
		this._fDustHorisontalTop_s = null;
		this._fDustHorisontalBottom_s = null;
		this._fDustVertical_s = null;
		this._fAnimationCount_num = null;

		//DUST HORISONTAL...
		let l_s = APP.library.getSpriteFromAtlas("weapons/DefaultGun/default_turret_5/dust");
		l_s.anchor.set(0.5, 0.5);
		l_s.scale.set(0.8, 0.8);
		l_s.blendMode = PIXI.BLEND_MODES.ADD;
		this._fDustHorisontalTop_s = this.addChild(l_s);
		l_s = APP.library.getSpriteFromAtlas("weapons/DefaultGun/default_turret_5/dust");
		l_s.anchor.set(0.5, 0.5);
		l_s.scale.set(0.8, 0.8);
		l_s.blendMode = PIXI.BLEND_MODES.ADD;
		this._fDustHorisontalBottom_s = this.addChild(l_s);
		//...DUST HORISONTAL

		//DUST VERTICAL...
		l_s = APP.library.getSpriteFromAtlas("weapons/DefaultGun/default_turret_5/dust");
		l_s.anchor.set(0.1, 0.55);
		l_s.scale.set(0.8, 0.8);
		l_s.rotation = -Math.PI / 2;
		l_s.blendMode = PIXI.BLEND_MODES.ADD;
		this._fDustVertical_s = this.addChild(l_s);
		//...DUST VERTICAL

		_generateTurretHitBoomTextures();

		let lHitBoom_spr = this._fHitBoom_spr = this.addChild(new Sprite());
		lHitBoom_spr.textures = _turret_hitboom_textures;
		lHitBoom_spr.animationSpeed = 0.5; //30 / 60
		lHitBoom_spr.anchor.set(0.5, 0.5);
		lHitBoom_spr.position.x = 21;
		lHitBoom_spr.position.y = -100;
		lHitBoom_spr.scale.set(2.22, 1.684);
		lHitBoom_spr.tint = 0x2e78c5;
		
		lHitBoom_spr.alpha = 1;
		lHitBoom_spr.blendMode = PIXI.BLEND_MODES.ADD;
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
			0.536,
			[
				[1.016, 13], //1.27  * 0.4 * 2, 13
			]);

		l_mtl.addAnimation(
			this._fDustHorisontalTop_s,
			MTimeLine.SET_SCALE_Y,
			0.328,
			[
				[1.456, 13],
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
			0.536,
			[
				[1.016, 13],
			]);

		l_mtl.addAnimation(
			this._fDustHorisontalBottom_s,
			MTimeLine.SET_SCALE_Y,
			-0.448,
			[
				[-0.72, 13],
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
			0.456,
			[
				[0.912, 13],
			]);

		l_mtl.addAnimation(
			this._fDustVertical_s,
			MTimeLine.SET_SCALE_Y,
			0.44,
			[
				[0.712, 13],
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

		l_mtl.callFunctionOnFinish(
			this._onChaineAnimationCompleted,
			this);

		this._fAnimationCount_num++;
		l_mtl.play();

		this._fTimeLine_mtl = l_mtl;
		//...ANIMATION

		this.scale.set(0.775);
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
			this.emit(Turret5FireEffect.EVENT_ON_ANIMATION_COMPLETED);
		}
	}

	destroy()
	{
		this._fHitBoom_spr && this._fHitBoom_spr.destroy();
		this._fTimeLine_mtl && this._fTimeLine_mtl.destroy();
		this._fDustHorisontalTop_s && this._fDustHorisontalTop_s.destroy();
		this._fDustHorisontalBottom_s && this._fDustHorisontalBottom_s.destroy();
		this._fDustVertical_s && this._fDustVertical_s.destroy();

		super.destroy();
	}
}

export default Turret5FireEffect 