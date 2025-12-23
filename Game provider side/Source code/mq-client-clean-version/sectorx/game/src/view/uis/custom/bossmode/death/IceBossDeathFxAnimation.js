import Sprite from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import Sequence from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import Timer from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../../../shared/src/CommonConstants';
import { Utils } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import { AtlasSprite } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import AtlasConfig from '../../../../../config/AtlasConfig';
import BossDeathFxAnimation from './BossDeathFxAnimation';

const EXPLOSIONS_INFO = [
	{
		position: {x: 8, y: -22},
		rotation: -1.43116998663535, //Utils.gradToRad(-82),
		scaleX: 1.5,
		scaleY: 3,
		delay: 0,
		explosionDelay: 5*FRAME_RATE
	},
	{
		position: {x: 0, y: 0},
		rotation: 2.303834612632515, //Utils.gradToRad(132),
		scaleX: 2.5,
		scaleY: 2.5,
		delay: 6*FRAME_RATE,
		explosionDelay: 3*FRAME_RATE
	},
	{
		position: {x: 26, y: -22},
		rotation: -0.8203047484373349, //Utils.gradToRad(-47),
		scaleX: 1.5,
		scaleY: 3,
		delay: 13*FRAME_RATE,
		explosionDelay: 4*FRAME_RATE
	},
	{
		position: {x: 0, y: 0},
		rotation: 3.0892327760299634, //Utils.gradToRad(177),
		scaleX: 2.5,
		scaleY: 3,
		delay: 17*FRAME_RATE,
		explosionDelay: 3*FRAME_RATE
	},
	{
		position: {x: 50, y: -12},
		rotation: 0.767944870877505, //Utils.gradToRad(44),
		scaleX: 3.5,
		scaleY: 3.5,
		delay: 21*FRAME_RATE,
		explosionDelay: 3.5*FRAME_RATE
	},
	{
		position: {x: -30, y: -35},
		rotation: -2.5132741228718345, //Utils.gradToRad(-144),
		scaleX: 1.5,
		scaleY: 3.5,
		delay: 25*FRAME_RATE,
		explosionDelay: 3*FRAME_RATE
	},
];

let explosion_textures;
export function generate_explosion_textures()
{
	if (!explosion_textures)
	{
		explosion_textures = AtlasSprite.getFrames([APP.library.getAsset("enemies/ice_boss/death/death_explosion")], [AtlasConfig.IceBossFireExplosion], "");
	}
	return explosion_textures;
}


class IceBossDeathFxAnimation extends BossDeathFxAnimation
{	
	i_startAnimation(aZombieView_e)
	{
		this._startAnimation(aZombieView_e);
	}

	get bossDissappearingBottomFXContainerInfo()
	{
		return APP.gameScreen.gameFieldController.bossDissappearingBottomFXContainerInfo;
	}

	get _defeatedCaptionTime()
	{
		return 61 * FRAME_RATE;
	}


	constructor()
	{
		super();

		this.zIndex = 100;

		this._fRays_spr_arr = null;
		this._fExplosionsTimers_t_arr = null;
	}

	_startAnimation(aZombieView_e)
	{
		super._startAnimation(aZombieView_e);

		this._fAnimationCount_num = 0;
		this._startRaysAnimations();
	}

	_startRaysAnimations()
	{
		if (!this._fRays_spr_arr)
		{
			this._fRays_spr_arr = [];
		}

		if (!this._fExplosionsTimers_t_arr)
		{
			this._fExplosionsTimers_t_arr = [];
		}

		for (let lInfo_obj of EXPLOSIONS_INFO)
		{
			this._fAnimationCount_num++;

			let lIsLast_bl = EXPLOSIONS_INFO.indexOf(lInfo_obj) == EXPLOSIONS_INFO.length - 1;

			let lRay_spr = this.addChild(APP.library.getSprite("enemies/ice_boss/death/final_ray"));
			lRay_spr.anchor.set(0.095, 0.48);
			lRay_spr.rotation = lInfo_obj.rotation;
			lRay_spr.scale.set(0, lInfo_obj.scaleY);
			lRay_spr.position = lInfo_obj.position;
			lRay_spr.blendMode = PIXI.BLEND_MODES.ADD;
			this._fRays_spr_arr.push(lRay_spr);

			let l_seq = [
				{tweens: [{prop: "scale.x", to: lInfo_obj.scaleX}], duration: 7*FRAME_RATE},
				{tweens: [], duration: 20*FRAME_RATE, onfinish: ()=>{
					lRay_spr.hide();
					this._fAnimationCount_num--;
				}}
			];
			Sequence.start(lRay_spr, l_seq, lInfo_obj.delay);

			let lExplosion_spr = this.addChild(new Sprite());
			lExplosion_spr.textures = generate_explosion_textures();
			lExplosion_spr.position = lInfo_obj.position;
			lExplosion_spr.scale.set(2.3);
			lExplosion_spr.hide();
			lExplosion_spr.on('animationend', ()=>{
				lExplosion_spr.destroy();
				this._fAnimationCount_num--;
			});

			this._fExplosionsTimers_t_arr.push(new Timer(()=>{
				lExplosion_spr.show();
				lExplosion_spr.play();
				this._fAnimationCount_num++;

				if (lIsLast_bl)
				{
					this._startIndependentExplosions();
				}
			}, lInfo_obj.delay + lInfo_obj.explosionDelay));

		}
	}

	_startIndependentExplosions()
	{
		for (let i = 0; i < 4; i++)
		{
			let lExplosion_spr = this.addChild(new Sprite());
			lExplosion_spr.textures = generate_explosion_textures();
			lExplosion_spr.position.set(Utils.getRandomWiggledValue(-30, 60), Utils.getRandomWiggledValue(-40, 80));
			lExplosion_spr.scale.set(2.5+Utils.getRandomWiggledValue(-0.2, 0.4));
			lExplosion_spr.on('animationend', ()=>{
				lExplosion_spr.destroy();
				this._fAnimationCount_num--;
			});
			lExplosion_spr.hide();

			let lDelay_num = 6*FRAME_RATE + i*FRAME_RATE*Utils.getRandomWiggledValue(2, 1);
			this._fExplosionsTimers_t_arr.push(new Timer(()=>{
				lExplosion_spr.show();
				lExplosion_spr.play();
				this._fAnimationCount_num++;
			}, lDelay_num));

			if (i == 3)
			{
				this._fExplosionsTimers_t_arr.push(new Timer(this._startFinalExplosion.bind(this), lDelay_num + 3*FRAME_RATE));
			}
		}
	}

	_startFinalExplosion()
	{
		this.__onTimeToExplodeCoin();

		let lFireExplosion_spr = this.addChild(new Sprite());
		lFireExplosion_spr.textures = AtlasSprite.getFrames([APP.library.getAsset("boss_mode/common/tall_fire_explosion")], [AtlasConfig.TallFireExplosion], "");
		lFireExplosion_spr.scale.set(3);
		lFireExplosion_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lFireExplosion_spr.on('animationend', ()=>{
			lFireExplosion_spr.destroy();
			this._fAnimationCount_num--;
			this._animationCompletedSuspicion();
		});
		lFireExplosion_spr.play();
		this._fAnimationCount_num++;

		if (!this._fIceExplosions_spr_arr)
		{
			this._fIceExplosions_spr_arr = [];
		}

		let lFirstIceFxExplosion_spr = this.addChild(new Sprite());
		lFirstIceFxExplosion_spr.textures = AtlasSprite.getFrames([APP.library.getAsset("enemies/ice_boss/death/final_ice_fx_explosion")], [AtlasConfig.IceBossFinalIceFxExplosion], "");
		lFirstIceFxExplosion_spr.scale.set(0);
		lFirstIceFxExplosion_spr.play();
		this._fAnimationCount_num++;
		this._fIceExplosions_spr_arr.push(lFirstIceFxExplosion_spr);
		
		let lSecondIceFxExplosion_spr = this.addChild(new Sprite());
		lSecondIceFxExplosion_spr.textures = AtlasSprite.getFrames([APP.library.getAsset("enemies/ice_boss/death/final_ice_fx_explosion")], [AtlasConfig.IceBossFinalIceFxExplosion], "");
		lSecondIceFxExplosion_spr.scale.set(0);
		lSecondIceFxExplosion_spr.play();
		this._fAnimationCount_num++;
		lSecondIceFxExplosion_spr.rotation = Math.PI/6;
		this._fIceExplosions_spr_arr.push(lSecondIceFxExplosion_spr);

		let l_seq = [
			{tweens: [{prop: "scale.x", to: 5}, {prop: "scale.y", to: 5}], duration: 6*FRAME_RATE},
			{tweens: [{prop: "scale.x", to: 8}, {prop: "scale.y", to: 8}, {prop: "alpha", to: 0}], duration: 3.5*FRAME_RATE, onfinish: ()=>{
				this._fAnimationCount_num--;
				this._animationCompletedSuspicion();
			}}
		];

		Sequence.start(lFirstIceFxExplosion_spr, l_seq);
		Sequence.start(lSecondIceFxExplosion_spr, l_seq, 1*FRAME_RATE);
	}

	_animationCompletedSuspicion()
	{
		if (this._fAnimationCount_num == 0)
		{
			this.__onBossDeathAnimationCompleted();
		}
	}

	destroyAnimation()
	{
		if (this._fRays_spr_arr && Array.isArray(this._fRays_spr_arr))
		{
			for (let l_spr of this._fRays_spr_arr)
			{
				l_spr && Sequence.destroy(Sequence.findByTarget(l_spr));
				l_spr && l_spr.destroy();
			}
		}
		this._fRays_spr_arr = null;

		if (this._fIceExplosions_spr_arr && Array.isArray(this._fIceExplosions_spr_arr))
		{
			for (let l_spr of this._fIceExplosions_spr_arr)
			{
				l_spr && Sequence.destroy(Sequence.findByTarget(l_spr));
				l_spr && l_spr.destroy();
			}
		}
		this._fIceExplosions_spr_arr = null;

		if (this._fExplosionsTimers_t_arr && Array.isArray(this._fExplosionsTimers_t_arr))
		{
			for (let l_t of this._fExplosionsTimers_t_arr)
			{
				l_t && !l_t.destroy && l_t.destructor();
			}
		}
		this._fExplosionsTimers_t_arr = null;
	}

	destroy()
	{
		this.destroyAnimation();
		super.destroy();
	}
}

export default IceBossDeathFxAnimation;