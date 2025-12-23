import AppearanceView from './AppearanceView';
import { ENEMIES, FRAME_RATE } from '../../../../../../../shared/src/CommonConstants';
import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sprite from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import Timer from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import AtlasConfig from '../../../../../config/AtlasConfig';
import { AtlasSprite } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import { Sequence } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';

let ice_explosion_textures = null;
function generate_ice_boss_ice_explosion_textures()
{
	if (!ice_explosion_textures)
	{
		ice_explosion_textures = AtlasSprite.getFrames([APP.library.getAsset("enemies/ice_boss/ice_boss_ice_explosion")], [AtlasConfig.IceBossIceExplosion], "");
	}
	return ice_explosion_textures;
}

let spawn_explosion_textures = null;
function generate_ice_boss_spawn_explosion_textures()
{
	if (!spawn_explosion_textures)
	{
		spawn_explosion_textures = AtlasSprite.getFrames([APP.library.getAsset("enemies/ice_boss/ice_boss_spawn_explosion")], [AtlasConfig.IceBossSpawnExplosion], "");
	}
	return spawn_explosion_textures;
}

let flare_textures = null;
export function generate_flare_textures()
{
	if (!flare_textures)
	{
		flare_textures = AtlasSprite.getFrames([APP.library.getAsset("enemies/ice_boss/ice_boss_appearance_flare")], [AtlasConfig.IceBossAppearanceFlare], "");
	}
	return flare_textures;
}

let ice_mist_texures = null;
function generate_ice_mist_texures()
{
	if (!ice_mist_texures)
	{
		ice_mist_texures = AtlasSprite.getFrames([APP.library.getAsset("enemies/ice_boss/ice_mist")], [AtlasConfig.IceBossIceMist], "");
	}
	return ice_mist_texures;
}


class IceBossAppearanceView extends AppearanceView
{
	static get EVENT_ON_ICE_BOSS_FREEZE_LAND_NEEDED()				{return "onIceBossAppearanceFreezeLandNeeded"; }
	static get EVENT_ON_ICE_BOSS_FREEZE_LAND_MELTING()				{return "onIceBossAppearanceFreezeLandMelting"; }

	constructor(aViewContainerInfo_obj)
	{
		super();

		this._fViewContainerInfo_obj = aViewContainerInfo_obj;
		this._fSmokes_arr = [];
		this._fAppearingSmokesTimers_arr_t = [];
		this._fAppearingSmokes_spr_arr = [];
		this._fFlares_spr_arr = [];
		this._fStreaksTimers_t_arr = [];
		this._fFlareTimer_t = null;
	}

	//INIT...
	get _captionPosition()
	{
		return { x:0, y:-4 };
	}

	get _bossType()
	{
		return ENEMIES.IceBoss;
	}
	//...INIT

	/**
	 * @override
	 * @protected
	 */
	__onBossBecomeVisible()
	{
		super.__onBossBecomeVisible();
		this._startSpawnExplosion();
	}
	
	/**
	 * @override
	 * @protected
	 */
	__onBossAppeared()
	{
		super.__onBossAppeared();
		this._fBlessedRays_spr && this._fBlessedRays_spr.fadeTo(0, 8*FRAME_RATE);
		this._fMist_spr && this._fMist_spr.fadeTo(0, 19*FRAME_RATE, undefined, () => { this._onAppearingCompleted(); });
		this.emit(IceBossAppearanceView.EVENT_ON_ICE_BOSS_FREEZE_LAND_MELTING);
	}

	_startAppearing(aZombieView_e)
	{
		this._fBossZombie_e = aZombieView_e;

		this.emit(AppearanceView.EVENT_APPEARING_STARTED);

		this._freezeLand();
		this._startSmokesAnimations();
		this._fFlareTimer_t = new Timer(this._startFlareAndFreezeStreaksAnimations.bind(this), 7*FRAME_RATE);
	}

	_freezeLand()
	{
		this.emit(IceBossAppearanceView.EVENT_ON_ICE_BOSS_FREEZE_LAND_NEEDED);
	}

	_startSmokesAnimations()
	{
		const SMOKES_INFORMATION = [
			{
				position: {x: -74, y: -20},
				delay: 0,
			},
			{
				position: {x: -20, y: -19},
				delay: 1*FRAME_RATE,
			},
			{
				position: {x: 10, y: 10},
				delay: 2*FRAME_RATE,
			},
			{
				position: {x: 0, y: 0},
				delay: 13*FRAME_RATE,
			},
		];

		if (!this._fAppearingSmokes_spr_arr)
		{
			this._fAppearingSmokes_spr_arr = [];
		}

		for (let lInfo_obj of SMOKES_INFORMATION)
		{
			let lIsLast_bl = SMOKES_INFORMATION.indexOf(lInfo_obj) == SMOKES_INFORMATION.length - 1;
			let lScaleCoeff_num = lIsLast_bl ? 2 : 1;

			let l_spr = this.addChild(APP.library.getSprite("enemies/ice_boss/appearance_small_smoke"));
			l_spr.position = lInfo_obj.position;
			l_spr.zIndex = 10;
			l_spr.hide();

			let l_seq = [
				{tweens: [], duration: 0, onfinish: /*on sequence started */ l_spr && l_spr.show.bind(l_spr)},
				{tweens: [{prop: 'scale.x', to: 2*lScaleCoeff_num}, {prop: 'scale.y', to: 2*lScaleCoeff_num}], duration: 8*FRAME_RATE, onfinish: lIsLast_bl && this._onAppearingCulminated.bind(this)},
				{ tweens: [{prop: 'scale.x', to: 3.5*lScaleCoeff_num}, {prop: 'scale.y', to: 3.5*lScaleCoeff_num}, {prop: 'alpha', to: 0}], duration: 10*FRAME_RATE},
			];

			this._fAppearingSmokes_spr_arr.push(l_spr);

			Sequence.start(l_spr, l_seq, lInfo_obj.delay);
		}
	}

	_shakeTheGround()
	{
		this.emit(AppearanceView.EVENT_SHAKE_THE_GROUND_REQUIRED);
	}

	_startFlareAndFreezeStreaksAnimations()
	{
		//FLARES...
		if (!this._fFlares_spr_arr)
		{
			this._fFlares_spr_arr = [];
		}

		let lAPPSize_obj = APP.config.size;
		let lUpperFlare_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
		lUpperFlare_spr.textures = generate_flare_textures();
		lUpperFlare_spr.zIndex = this._fViewContainerInfo_obj.bottomZIndex;
		lUpperFlare_spr.position.set(lAPPSize_obj.width/2, lAPPSize_obj.height/2);
		lUpperFlare_spr.anchor.set(0.55, 0.85);
		lUpperFlare_spr.scale.set(0);
		lUpperFlare_spr.alpha = 0;
		lUpperFlare_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lUpperFlare_spr.play();
		
		let lLowerFlare_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
		lLowerFlare_spr.textures = generate_flare_textures();
		lLowerFlare_spr.zIndex = this._fViewContainerInfo_obj.bottomZIndex;
		lLowerFlare_spr.position.set(lAPPSize_obj.width/2, lAPPSize_obj.height/2);
		lLowerFlare_spr.anchor.set(0.55, 0.85);
		lLowerFlare_spr.scale.set(0);
		lLowerFlare_spr.alpha = 0;
		lLowerFlare_spr.rotation = Math.PI;
		lLowerFlare_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lLowerFlare_spr.play();

		let lUpperFlareAnimation_seq = [
			{tweens: [{prop: "scale.x", to: 4.34}, {prop: "scale.y", to: 1}, {prop: "alpha", to: 1}], duration: 7*FRAME_RATE},
			{tweens: [], duration: 47*FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0}], duration: 16*FRAME_RATE},
		];

		let lLowerFlareAnimation_seq = [
			{tweens: [{prop: "scale.x", to: 4.34}, {prop: "scale.y", to: 1}, {prop: "alpha", to: 1}], duration: 7*FRAME_RATE},
			{tweens: [{prop: "scale.x", to: 5.5}], duration: 28*FRAME_RATE},
			{tweens: [], duration: 20*FRAME_RATE},
			{tweens: [{prop: "scale.x", to: 0}, {prop: "scale.y", to: 0}], duration: 8*FRAME_RATE}
		];

		this._fFlares_spr_arr.push(lUpperFlare_spr);
		this._fFlares_spr_arr.push(lLowerFlare_spr);

		Sequence.start(lUpperFlare_spr, lUpperFlareAnimation_seq);
		Sequence.start(lLowerFlare_spr, lLowerFlareAnimation_seq);
		//...FLARES

		//STREAKS...
		const STREAKS_INFO = [
			{
				position: {x: 70, y: -50},
				delay: 8*FRAME_RATE,
			},
			{
				position: {x: 25, y: -45},
				delay: 17*FRAME_RATE,
			},
			{
				position: {x: 130, y: -50},
				delay: 18*FRAME_RATE,
			},
			{
				position: {x: -85, y: -40},
				delay: 45*FRAME_RATE,
			},
			{
				position: {x: -140, y: -25},
				delay: 46*FRAME_RATE,
			},
		];

		if (!this._fStreaksTimers_t_arr)
		{
			this._fStreaksTimers_t_arr = [];
		}

		for (let lInfo_obj of STREAKS_INFO)
		{
			let l_spr = this.addChild(new Sprite());
			l_spr.textures = generate_ice_boss_ice_explosion_textures();
			l_spr.scale.set(2.2);
			l_spr.position = lInfo_obj.position;
			l_spr.animationSpeed = 0.3;
			l_spr.hide();

			l_spr.on('animationend', l_spr.destroy.bind(l_spr));

			this._fStreaksTimers_t_arr.push(new Timer(()=>{
				l_spr.show();
				l_spr.play();

				this._shakeTheGround();
			}, lInfo_obj.delay));
		}
		//...STREAKS

	}

	_startSpawnExplosion()
	{	
		this._freezeLand(); //add more freeze ground effects

		// RAYS...
		this._fBlessedRays_spr = this._fViewContainerInfo_obj.container.addChild(APP.library.getSpriteFromAtlas("common/blessed_rays"));
		this._fBlessedRays_spr.alpha = 0;
		this._fBlessedRays_spr.zIndex = 0;
		this._fBlessedRays_spr.scale.set(1.5, 0);
		this._fBlessedRays_spr.position.set(480, 230);
		this._fBlessedRays_spr.anchor.set(0.5, 1);
		this._fBlessedRays_spr.blendMode = PIXI.BLEND_MODES.ADD;
		this._fBlessedRays_spr && this._fBlessedRays_spr.scaleYTo(2, 5*FRAME_RATE);
		this._fBlessedRays_spr && this._fBlessedRays_spr.fadeTo(1, 5*FRAME_RATE);
		// ...RAYS

		// BLAST CIRCLE...
		this._fBlastCircle_spr = this.addChild(APP.library.getSprite("enemies/ice_boss/ice_blast_circle"));
		this._fBlastCircle_spr.blendMode = PIXI.BLEND_MODES.ADD;
		this._fBlastCircle_spr.scale.set(0);
		this._fBlastCircle_spr.position.set(-35, 0);

		let l_seq = [
			{tweens: [{prop: "scale.x", to: 4}, {prop: "scale.y", to: 4}], duration: 5*FRAME_RATE},
			{tweens: [{prop: "scale.x", to: 16}, {prop: "scale.y", to: 16}, {prop: "alpha", to: 0}], duration: 8*FRAME_RATE, onfinish: this._startMistAnimation.bind(this)}
		];
		Sequence.start(this._fBlastCircle_spr, l_seq);
		// ...BLAST CIRCLE

		// ICE PEAKS EXPLOSION...
		this._fSpawnExplosion_spr = this.addChild(new Sprite());
		this._fSpawnExplosion_spr.textures = generate_ice_boss_spawn_explosion_textures();
		let lAddExplosion_spr = this._fSpawnExplosion_spr.addChild(new Sprite());
		lAddExplosion_spr.textures = generate_ice_boss_spawn_explosion_textures();
		lAddExplosion_spr.blendMode = PIXI.BLEND_MODES.ADD;
		this._fSpawnExplosion_spr.scale.set(2);
		this._fSpawnExplosion_spr.position.set(0, -150);
		this._fSpawnExplosion_spr.on('animationend', this._fSpawnExplosion_spr.destroy.bind(this._fSpawnExplosion_spr));

		lAddExplosion_spr.play();
		this._fSpawnExplosion_spr.play();
		// ...ICE PEAKS EXPLOSION
	}

	_startMistAnimation()
	{
		this._fMist_spr = this._fViewContainerInfo_obj.container.addChild(new Sprite());
		this._fMist_spr.textures = generate_ice_mist_texures();
		this._fMist_spr.position.set(480, 300);
		this._fMist_spr.scale.set(2);
		this._fMist_spr.alpha = 0;
		this._fMist_spr.play();
		this._fMist_spr.fadeTo(1, 15*FRAME_RATE);
	}

	_clearTimers()
	{
		if(this._fAppearingSmokesTimers_arr_t && this._fAppearingSmokesTimers_arr_t.length)
		{
			while (this._fAppearingSmokesTimers_arr_t.length)
			{
				let l_t = this._fAppearingSmokesTimers_arr_t.shift();
				l_t.destructor();
			}
		}

		if(this._fStreaksTimers_t_arr && this._fStreaksTimers_t_arr.length)
		{
			while (this._fStreaksTimers_t_arr.length)
			{
				let l_t = this._fStreaksTimers_t_arr.shift();
				l_t.destructor();
			}
		}

		if(this._fLandFreezes_spr_arr && Array.isArray(this._fLandFreezes_spr_arr))
		{
			for (let l_spr of this._fLandFreezes_spr_arr)
			{
				Sequence.destroy(Sequence.findByTarget(l_spr));
				l_spr && l_spr.destroy();
			}
		}
		this._fLandFreezes_spr_arr = null;

		this._fFlareTimer_t && this._fFlareTimer_t.destructor();
		this._fFlareTimer_t = null;
	}

	destroy()
	{
		if (this._fAppearingSmokes_spr_arr && Array.isArray(this._fAppearingSmokes_spr_arr))
		{
			for (let l_spr of this._fAppearingSmokes_spr_arr)
			{
				Sequence.destroy(Sequence.findByTarget(l_spr));
				l_spr && l_spr.destroy();
			}
		}
		this._fAppearingSmokes_spr_arr = null;

		if (this._fFlares_spr_arr && Array.isArray(this._fFlares_spr_arr))
		{
			for (let l_spr of this._fFlares_spr_arr)
			{
				Sequence.destroy(Sequence.findByTarget(l_spr));
				l_spr && l_spr.destroy();
			}
		}
		this._fFlares_spr_arr = null;

		this._fBlessedRays_spr && this._fBlessedRays_spr.destroy();
		this._fBlessedRays_spr = null;

		this._fMist_spr && this._fMist_spr.destroy();
		this._fMist_spr = null;

		this._fBlastCircle_spr && Sequence.destroy(Sequence.findByTarget(this._fBlastCircle_spr));
		this._fBlastCircle_spr && this._fBlastCircle_spr.destroy();
		this._fBlastCircle_spr = null;

		this._fSpawnExplosion_spr && this._fSpawnExplosion_spr.destroy();
		this._fSpawnExplosion_spr = null;

		this._fBossZombie_e = null;
		this._clearTimers();
		super.destroy();
	}
}

export default IceBossAppearanceView;