import { Sequence, Tween } from "../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation";
import { AtlasSprite, Sprite } from "../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display";
import * as Easing from '../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { APP } from "../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals";
import { Utils } from "../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils";
import { FRAME_RATE } from "../../../../../shared/src/CommonConstants";
import { generate_ice_parts } from "../capsule_features/FreezeCapsuleFeatureView";
import CoinsAward from "./CoinsAward";
import CoinsFlyAnimation from './big_win/CoinsFlyAnimation';
import { ColorOverlayFilter } from "../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Filters";
import AtlasConfig from "../../../config/AtlasConfig";

let particles_spread_textures = null;
function generate_particles_textures()
{
	if (!particles_spread_textures)
	{
		particles_spread_textures = AtlasSprite.getFrames([APP.library.getAsset("common/particles")], [AtlasConfig.Particles], "")
	}

	return particles_spread_textures;
}
class FreezeAward extends CoinsAward
{
	showAwarding(aValue_num, aParams_obj)
	{
		this._fUncountedValue_num = aValue_num;
		this._fRid_num = aParams_obj.rid;
		this._fIsBoss_bl = aParams_obj.isBoss;
		this._fPayValue_num = this._fPayoutValue_num = Number(aValue_num);
		this._fCoinsMoneyStep_num = Math.ceil(Number(aValue_num) / this._fCoinsCounter_int);
		this._fSeatId_int = aParams_obj.seatId;
		let lWinTier_int = super._calcWinTier(Number(aValue_num));

		this._fEndPosition_pt = aParams_obj.winPoint;
		this._fillDropPath({x: APP.config.size.width/2, y: APP.config.size.height/2}, {x: -10, y: 0}, 2);
		this._startIntroAnimation(aParams_obj.start);
		super._playWinTierSoundSuspicion(lWinTier_int);
	}

	get isPayoutPresentationInProgress()
	{
		return !!this._fPayout_wp;
	}

	constructor(aGameField_sprt, aAwardType_int, aOptParams_obj)
	{
		super(aGameField_sprt, aAwardType_int, aOptParams_obj);

		this._fBaseFreezeContainer_spr = null;
		this._fIceBackground_spr = null;
		this._fSnowflake_spr = null;
		this._fPayout_wp = null;
		this._fFlare_spr = null;
		this._fBlastCircle_spr = null;
		this._fBackBlueGlow_spr = null;
		this._fParticlesAnimationsCount_num = null;

		this._fIsMasterSeat_bl = APP.playerController.info.seatId === this._fSeatId_int;

		this._initSprites();
	}

	_initSprites()
	{
		this._fBaseFreezeContainer_spr = this.addChild(new Sprite());
		this._fBaseFreezeContainer_spr.anchor.set(0.5, 0.5);
		
		this._fBackBlueGlow_spr = this._fBaseFreezeContainer_spr.addChild(APP.library.getSpriteFromAtlas("common/blue_blurred_flare"));
		this._fBackBlueGlow_spr.scale.set(6, 4);
		this._fBackBlueGlow_spr.alpha = 0;
		this._fBackBlueGlow_spr.blendMode = PIXI.BLEND_MODES.SCREEN;
		this._fParticles_spr = [];

		this._fIceContainer_spr = this._fBaseFreezeContainer_spr.addChild(new Sprite());
		this._fIceContainer_spr.scale.set(0);
		let lIceParts_map = generate_ice_parts();
		this._fIceBackground_spr = this._fIceContainer_spr.addChild(new Sprite.from(lIceParts_map["background"]));
		this._fIceBackground_spr.scale.set(2);
		this._fIceBackground_spr.anchor.set(0.53, 0.4);

		this._fSnowflake_spr = this._fIceBackground_spr.addChild(APP.library.getSprite("enemies/freeze_capsule/snowflake"));
		this._fSnowflake_spr.scale.set(0.85);
		this._fSnowflake_spr.rotation = -0.13962634015954636; //Utils.gradToRad(-8);

		this._fPayout_wp = this._fBaseFreezeContainer_spr.addChild(this._createWinPayout(1.8));
		this._fCoinsFlyAnimation_cfa = this._fBaseFreezeContainer_spr.addChild(new CoinsFlyAnimation());

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._fFlare_spr = this._fBaseFreezeContainer_spr.addChild(APP.library.getSprite("awards/freeze_award_final_blue_flare"));
			this._fFlare_spr.scale.set(0);
			this._fFlare_spr.blendMode = PIXI.BLEND_MODES.ADD;
	
			this._fBlastCircle_spr = this._fBaseFreezeContainer_spr.addChild(APP.library.getSprite("enemies/freeze_capsule/blue_circle_blast"));
			this._fBlastCircle_spr.blendMode = PIXI.BLEND_MODES.ADD;
			this._fBlastCircle_spr.scale.set(0);
		}

		//FINAL COINS...
		this._fCoinsScale_num = 1.1;
		this._fCoins_sprt_arr = [];
		this._fCoinsCounter_int = 16;
		
		this._fOffscreenOffsetY_num = 1;
		this._fOffscreenOffsetX_num = 1;

		for (let i = 0; i < this._fCoinsCounter_int; i++)
		{
			let lCoin_spr = this._generateCoin();
			this._fCoins_sprt_arr.push(this.addChild(lCoin_spr));
		}
		//...FINAL COINS
	}

	_startIntroAnimation(aPosition_obj)
	{
		this._fBaseFreezeContainer_spr.position = aPosition_obj;
		this._fPayout_wp.value = this._fUncountedValue_num;
		
		let lBlueBackgroundAlpha_t = new Tween(this._fBackBlueGlow_spr, "alpha", 0, 1, 8*FRAME_RATE);
		lBlueBackgroundAlpha_t.play();

		let lPayoutScale_seq = [
			{tweens: [{prop: "scale.x", to: 1.8}, {prop: "scale.y", to: 1.8}], duration: 10*FRAME_RATE},
			{tweens: [{prop: "scale.x", to: 1.5}, {prop: "scale.y", to: 1.5}], duration: 5*FRAME_RATE},
		];

		let lSnowflakeAnimation_seq = [
			{
				tweens: [{prop: "rotation", to: 0}, {prop: "scale.x", to: 0.7}, {prop: "scale.y", to: 0.7}],
				duration: 5*FRAME_RATE, 
			}];

		let lContainerScale_seq = [
			{
				tweens: [{prop: "scale.x", to: 1.3}, {prop: "scale.y", to: 1.3}],
				duration: 10*FRAME_RATE,
				onfinish: ()=>
				{
					this._fIsMasterSeat_bl && this._fCoinsFlyAnimation_cfa.startAnimation();
					this.emit(CoinsAward.EVENT_ON_PAYOUT_IS_VISIBLE, { value: this._fPayoutValue_num, seatId: this._fSeatId_int, isBoss: this._fIsBoss_bl });
				}
			},
			{
				tweens: [{prop: "scale.x", to: 0.9}, {prop: "scale.y", to: 0.9}], 
				duration: 5*FRAME_RATE, 
				onfinish: ()=>{
					Sequence.start(this._fSnowflake_spr, lSnowflakeAnimation_seq);
				}
			},
			{
				tweens: [{prop: "scale.x", to: 1}, {prop: "scale.y", to: 1}], 
				duration: 15*FRAME_RATE, 
				onfinish: ()=>{
					this._startOutroAnimation();
				}
			},
		];

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startFlareAndCircleAnimations();
		}

		Sequence.start(this._fIceContainer_spr, lContainerScale_seq);
		Sequence.start(this._fPayout_wp, lPayoutScale_seq);
	}

	_startOutroAnimation()
	{
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startFlareAndCircleAnimations(true);
		}

		let lPayoutScale_seq = [
			{tweens: [{prop: "scale.x", to: 1.8}, {prop: "scale.y", to: 1.8}], duration: 10*FRAME_RATE, ease: Easing.sine.easeIn},
			{tweens: [{prop: "scale.x", to: 0}, {prop: "scale.y", to: 0}], duration: 5*FRAME_RATE},
		];

		let lContainerScale_seq = [
			{
				tweens: [{prop: "scale.x", to: 1.3}, {prop: "scale.y", to: 1.3}],
				duration: 10*FRAME_RATE,
				ease: Easing.sine.easeIn,
				onfinish: ()=>{
					if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
					{
						let l_cof = new ColorOverlayFilter();
						l_cof.color = 0xfefeef;
						l_cof.alpha = 0.75;
						this._fIceBackground_spr.filters = [l_cof];
					}
					this._onCoinFlyInTime(0, 0);
				}
			},
			{
				tweens: [{prop: "scale.x", to: 0}, {prop: "scale.y", to: 0}], 
				duration: 5*FRAME_RATE, 
				ease: Easing.sine.easeOut
			}
		];

		Sequence.start(this._fIceContainer_spr, lContainerScale_seq);
		Sequence.start(this._fPayout_wp, lPayoutScale_seq);
	}

	_startFlareAndCircleAnimations(aOptFinal_bl=false)
	{
		this._fBlastCircle_spr.alpha = 1;

		let lFlareScale_seq = [
			{
				tweens: [{prop: "scale.x", from: 0.49, to: 3.92}, {prop: "scale.y", from: 0.24, to: 1.92}],
				duration: 3*FRAME_RATE
			},
			{
				tweens: [{prop: "scale.x", to: 0}, {prop: "scale.y", to: 0}],
				duration: 7*FRAME_RATE
			},
		];
		
		let lFinalFlareScale_seq = [
			{
				tweens: [{prop: "scale.x", from: 0, to: 3.4}, {prop: "scale.y", from: 0, to: 1.24}],
				duration: 2*FRAME_RATE,
				onfinish: this._startIdleOutroAnimations.bind(this)
			},
			{
				tweens: [{prop: "scale.x", to: 2.6}, {prop: "scale.y", to: 1.44}],
				duration: 2*FRAME_RATE
			},
			{
				tweens: [{prop: "scale.x", to: 0}, {prop: "scale.y", to: 0}],
				duration: 4*FRAME_RATE
			},
		];

		let lCircleScale_seq = [
			{
				tweens: [{prop: "scale.x", from: 0, to: 5}, {prop: "scale.y", from: 0, to: 5}],
				duration: 8*FRAME_RATE
			},
			{
				tweens: [{prop: "scale.x", to: 7}, {prop: "scale.y", to: 7}, {prop: "alpha", to: 0}],
				duration: 3*FRAME_RATE
			},
		];

		Sequence.start(this._fBlastCircle_spr, lCircleScale_seq, 4*FRAME_RATE);
		Sequence.start(this._fFlare_spr, aOptFinal_bl ? lFinalFlareScale_seq : lFlareScale_seq);
	}

	_startIdleOutroAnimations()
	{
		this._fParticles_spr_arr = [];
		let lFirstParticles_spr = this._fBaseFreezeContainer_spr.addChild(new Sprite());
		lFirstParticles_spr.textures = generate_particles_textures();
		lFirstParticles_spr.rotation = -2.9670597283903604; //Utils.gradToRad(-170);
		lFirstParticles_spr.position.set(-57, 0);
		lFirstParticles_spr.animationSpeed = 1.4;
		lFirstParticles_spr.zIndex = -1;
		lFirstParticles_spr.scale.set(3);
		lFirstParticles_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lFirstParticles_spr.on('animationend', ()=>{
			this._fParticlesAnimationsCount_num--;
			this._tryToFinishAnimation();
			lFirstParticles_spr && lFirstParticles_spr.destroy();
		});
		this._fParticles_spr_arr.push(lFirstParticles_spr);

		let lSecondParticles_spr = this._fBaseFreezeContainer_spr.addChild(new Sprite());
		lSecondParticles_spr.textures = generate_particles_textures();
		lSecondParticles_spr.position.set(57, 0);
		lSecondParticles_spr.animationSpeed = 1.4;
		lSecondParticles_spr.zIndex = -1;
		lSecondParticles_spr.scale.set(3);
		lSecondParticles_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lSecondParticles_spr.on('animationend', ()=>{
			this._fParticlesAnimationsCount_num--;
			this._tryToFinishAnimation();
			lSecondParticles_spr && lSecondParticles_spr.destroy();
		});
		this._fParticles_spr_arr.push(lSecondParticles_spr);

		this._fParticlesAnimationsCount_num = 2;
		lFirstParticles_spr.play();
		lSecondParticles_spr.play();
	}

	_tryToFinishAnimation()
	{
		if (!this._fParticlesAnimationsCount_num)
		{
			let lAlphaTween_t = new Tween(this._fBackBlueGlow_spr, "alpha", 1, 0, 6*FRAME_RATE);
			// lAlphaTween_t.on(Tween.EVENT_ON_FINISHED, this._completeAwarding.bind(this));
			lAlphaTween_t.play();
		}
	}

	destroy()
	{
		if (Array.isArray(this._fParticles_spr_arr))
		{
			for (let l_spr of this._fParticles_spr_arr)
			{
				l_spr && l_spr.destroy();
			}
		}
		this._fIsMasterSeat_bl = false;

		this._fPayout_wp && Sequence.destroy(Sequence.findByTarget(this._fPayout_wp));
		this._fPayout_wp && this._fPayout_wp.destroy();
		this._fPayout_wp = null;

		this._fBackBlueGlow_spr && Tween.destroy(Tween.findByTarget(this._fBackBlueGlow_spr));
		this._fBackBlueGlow_spr && this._fBackBlueGlow_spr.destroy();
		this._fBackBlueGlow_spr = null;

		this._fBackBlueGlow_spr && this._fBackBlueGlow_spr.destroy();
		this._fBackBlueGlow_spr = null;
		this._fBlastCircle_spr && Sequence.destroy(Sequence.findByTarget(this._fBlastCircle_spr));
		this._fBlastCircle_spr && this._fBlastCircle_spr.destroy();
		this._fBlastCircle_spr = null;

		this._fFlare_spr && Sequence.destroy(Sequence.findByTarget(this._fFlare_spr));
		this._fFlare_spr && this._fFlare_spr.destroy();
		this._fFlare_spr = null;

		this._fCoinsFlyAnimation_cfa && this._fCoinsFlyAnimation_cfa.destroy();		
		this._fCoinsFlyAnimation_cfa = null;

		this._fIceContainer_spr && Sequence.destroy(Sequence.findByTarget(this._fIceContainer_spr));
		this._fIceContainer_spr && this._fIceContainer_spr.destroy();
		this._fIceContainer_spr = null;

		this._fSnowflake_spr && Sequence.destroy(Sequence.findByTarget(this._fSnowflake_spr));
		this._fSnowflake_spr && this._fSnowflake_spr.destroy();
		this._fSnowflake_spr = null;

		this._fPayout_wp && Tween.destroy(Tween.findByTarget(this._fPayout_wp));
		this._fPayout_wp && this._fPayout_wp.destroy();
		this._fPayout_wp = null;

		this._fBaseFreezeContainer_spr && this._fBaseFreezeContainer_spr.destroy();
		this._fBaseFreezeContainer_spr = null;

		super.destroy();
	}
}

export default FreezeAward;