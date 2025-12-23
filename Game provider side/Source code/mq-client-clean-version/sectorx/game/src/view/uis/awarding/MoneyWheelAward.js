import { Sequence, Tween } from "../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation";
import { AtlasSprite, Sprite } from "../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display";
import * as Easing from '../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { APP } from "../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals";
import { Utils } from "../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils";
import { FRAME_RATE } from "../../../../../shared/src/CommonConstants";
import CoinsAward from "./CoinsAward";
import CoinsFlyAnimation from './big_win/CoinsFlyAnimation';
import AtlasConfig from "../../../config/AtlasConfig";
import I18 from "../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18";
import { generateEnergyTextures } from "../../../main/animation/boss_mode/fire/AppearingTopFlareAnimation";

let particles_spread_textures = null;
function generate_particles_textures()
{
	if (!particles_spread_textures)
	{
		particles_spread_textures = AtlasSprite.getFrames([APP.library.getAsset("common/particles")], [AtlasConfig.Particles], "")
	}

	return particles_spread_textures;
}


class MoneyWheelAward extends CoinsAward
{
	showAwarding(aValue_num, aParams_obj)
	{
		this._fUncountedValue_num = aValue_num;
		this._fRid_num = aParams_obj.rid;
		this._fIsBoss_bl = aParams_obj.isBoss;
		this._fPayValue_num = this._fPayoutValue_num = Number(aValue_num);
		this._fCoinsMoneyStep_num = Math.ceil(Number(aValue_num) / this._fCoinsCounter_int);
		this._fSeatId_int = aParams_obj.seatId;

		this._fEndPosition_pt = aParams_obj.winPoint;
		this._fillDropPath({x: APP.config.size.width/2, y: APP.config.size.height/2}, {x: -10, y: 0}, 2);
		this._startIntroAnimation(aParams_obj.start);

		let lWinPayouts_arr = aParams_obj.payoutsArr;
		let lWinSoundId_str = '_win_sound';
		if (lWinPayouts_arr)
		{
			switch(aValue_num)
			{
				case lWinPayouts_arr[0]:
					lWinSoundId_str = 'big' + lWinSoundId_str;
					break;
				case lWinPayouts_arr[1]:
				case lWinPayouts_arr[2]:
					lWinSoundId_str = 'huge' + lWinSoundId_str;
					break;
				default:
					lWinSoundId_str = 'mega' + lWinSoundId_str;
			}
			this._fSoundId_str = lWinSoundId_str;
			APP.soundsController.play(lWinSoundId_str, false);
		}
		
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startParticlesAnimations();
		}
	}

	get isPayoutPresentationInProgress()
	{
		return !!this._fPayout_wp;
	}

	constructor(aGameField_sprt, aAwardType_int, aOptParams_obj)
	{
		super(aGameField_sprt, aAwardType_int, aOptParams_obj);

		this._fPayout_wp = null;
		this._fYouWinCaption_ta = null;
		this._fFlare_spr = null;
		this._fFireCircle_spr = null;
		this._fParticlesAnimationsCount_num = null;

		this._fIsMasterSeat_bl = APP.playerController.info.seatId === this._fSeatId_int;

		this._fSoundId_str = null;

		this._initSprites();
	}

	__initContainers()
	{
		super.__initContainers();

		this._fBaseContainer_spr = this.addChild(new Sprite());
		this._fBackgroundContainer_spr = this._fBaseContainer_spr.addChild(new Sprite());
		this._fCaptionContainer_spr = this._fBaseContainer_spr.addChild(new Sprite());
	}

	_initSprites()
	{
		this._fParticles_spr = [];

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._fFlare_spr = this._fBackgroundContainer_spr.addChild(APP.library.getSpriteFromAtlas("common/misty_flare"));
			this._fFlare_spr.scale.set(0);
			this._fFlare_spr.blendMode = PIXI.BLEND_MODES.ADD;
			this._fFlare_spr.position.set(0, -30);
	
			this._fFireCircle_spr = this._fBackgroundContainer_spr.addChild(new Sprite());
			this._fFireCircle_spr.textures = generateEnergyTextures();
			this._fFireCircle_spr.blendMode = PIXI.BLEND_MODES.ADD;
			this._fFireCircle_spr.scale.set(0);
			this._fFireCircle_spr.on('animationend', this._fFireCircle_spr.destroy.bind(this._fFireCircle_spr));
		}

		this._fYouWinCaption_ta = this._fCaptionContainer_spr.addChild(I18.generateNewCTranslatableAsset("TAMoneyWheelYouWinCaption"));
		this._fPayout_wp = this._fBaseContainer_spr.addChild(this._createWinPayout(1.8));
		this._fCoinsFlyAnimation_cfa = this._fBaseContainer_spr.addChild(new CoinsFlyAnimation());

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
		this._fBaseContainer_spr.position = aPosition_obj;
		this._fPayout_wp.value = this._fUncountedValue_num;
		
		let lCaptionAnimation_seq = [
			{
				tweens: [{prop: "position.y", to: -74}, {prop: "scale.x", to: 1.1}, {prop: "scale.y", to: 1.1}, {prop: "anchor.y", to: 0.2}],
				duration: 3*FRAME_RATE,
				ease: Easing.quartic.easeOut
			},
			{
				tweens: [{prop: "scale.x", to: 1.25}, {prop: "scale.y", to: 1.25}, {prop: "anchor.y", to: 0.5}],
				duration: 5*FRAME_RATE,
				onfinish: this._startCaptionLightSweep.bind(this)
			},
			{
				tweens: [{prop: "scale.x", to: 1.1}, {prop: "scale.y", to: 1.1}],
				duration: 21*FRAME_RATE,
			},
			{
				tweens: [{prop: "scale.x", to: 1.25}, {prop: "scale.y", to: 1.25}],
				duration: 6*FRAME_RATE,
				onfinish: this._startOutroAnimation.bind(this)
			},
			{
				tweens: [{prop: "position.y", to: -15}, {prop: "scale.x", to: 0}, {prop: "scale.y", to: 0}],
				duration: 5*FRAME_RATE,
				onfinish: this._tryToFinishAnimation.bind(this)
			}
		];

		let lPayoutScale_seq = [
			{
				tweens: [{prop: "scale.x", from: 0, to: 1.8}, {prop: "scale.y", from: 0, to: 1.8}, {prop: "rotation", to: 0.04363323129985824}], //Utils.gradToRad(2.5)
				duration: 4*FRAME_RATE,
				onfinish: ()=>
				{
					this._fIsMasterSeat_bl && this._fCoinsFlyAnimation_cfa.startAnimation();
					this.emit(CoinsAward.EVENT_ON_PAYOUT_IS_VISIBLE, { value: this._fPayoutValue_num, seatId: this._fSeatId_int, isBoss: this._fIsBoss_bl });
				}
			},
			{
				tweens: [{prop: "scale.x", to: 2}, {prop: "scale.y", to: 2}, {prop: "rotation", to: 0.015707963267948967}], //Utils.gradToRad(0.9)
				duration: 4*FRAME_RATE
			},
			{
				tweens: [{prop: "scale.x", to: 1.5}, {prop: "scale.y", to: 1.5}, {prop: "rotation", to: -0.012217304763960306}], //Utils.gradToRad(-0.7)
				duration: 4*FRAME_RATE
			},
			{
				tweens: [{prop: "scale.x", to: 1.17}, {prop: "scale.y", to: 1.17}, {prop: "rotation", to: 0}], 
				duration: 5*FRAME_RATE,
			},
			{
				tweens: [{prop: "scale.x", to: 1.27}, {prop: "scale.y", to: 1.27}], 
				duration: 12*FRAME_RATE,
			},
			{
				tweens: [{prop: "scale.x", to: 1.4}, {prop: "scale.y", to: 1.4}],
				duration: 4*FRAME_RATE
			},
			{
				tweens: [{prop: "scale.x", to: 1.45}, {prop: "scale.y", to: 1.45}, {prop: "alpha", to: 0.8}],
				duration: 2*FRAME_RATE
			},
			{
				tweens: [{prop: "scale.x", to: 0}, {prop: "scale.y", to: 0}, {prop: "position.y", to: -35}, {prop: "alpha", to: 0}], 
				duration: 5*FRAME_RATE,
			},
		];

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startFlareAndCircleAnimations();
		}

		Sequence.start(this._fPayout_wp, lPayoutScale_seq);
		Sequence.start(this._fCaptionContainer_spr, lCaptionAnimation_seq);
	}

	_startParticlesAnimations()
	{
		this._fParticles_spr_arr = [];
		let lFirstParticles_spr = this._fBackgroundContainer_spr.addChild(new Sprite());
		lFirstParticles_spr.textures = generate_particles_textures();
		lFirstParticles_spr.position.set(0, -50);
		lFirstParticles_spr.animationSpeed = 0.5;
		lFirstParticles_spr.zIndex = -1;
		lFirstParticles_spr.scale.set(2);
		lFirstParticles_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lFirstParticles_spr.on('animationend', ()=>{
			this._fParticlesAnimationsCount_num--;
			this._tryToFinishAnimation();
			lFirstParticles_spr && lFirstParticles_spr.destroy();
		});
		this._fParticles_spr_arr.push(lFirstParticles_spr);

		let lSecondParticles_spr = this._fBackgroundContainer_spr.addChild(new Sprite());
		lSecondParticles_spr.textures = generate_particles_textures();
		lSecondParticles_spr.position.set(90, -60);
		lSecondParticles_spr.animationSpeed = 0.5;
		lSecondParticles_spr.zIndex = -1;
		lSecondParticles_spr.scale.set(2);
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

	_startOutroAnimation()
	{
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startFlareAndCircleAnimations(true);
		}

		let lPayoutScale_seq = [
			{
				tweens: [{prop: "scale.x", to: 1.3}, {prop: "scale.y", to: 1.3}],
				duration: 10*FRAME_RATE,
				ease: Easing.sine.easeIn,
				onfinish: this._onCoinFlyInTime.bind(this, 0, 0)
			},
			{
				tweens: [{prop: "position.y", to: -40}, {prop: "scale.x", to: 0}, {prop: "scale.y", to: 0}], 
				duration: 5*FRAME_RATE, 
				ease: Easing.sine.easeOut
			}
		];

		Sequence.start(this._fPayout_wp, lPayoutScale_seq);
	}

	_startCaptionLightSweep()
	{
		var lBounds_obj = this._fCaptionContainer_spr.getBounds();
		let l_txtr = APP.stage.renderer.generateTexture(this._fYouWinCaption_ta, PIXI.SCALE_MODES.LINEAR, 2, lBounds_obj);				// renders just right part of _fMessageContainer_spr, idk how to fix that

		this._fSweep_sprt = this._fCaptionContainer_spr.addChild(new Sprite());

		let lMask_sprt = this._fCaptionContainer_spr.addChild(new Sprite.from(l_txtr));
		lMask_sprt.position.set(0, -10);
		lMask_sprt.anchor.set(0.5, 0.5);
		lMask_sprt.scale.set(0.8);

		let lFirstSweep_spr = this._fSweep_sprt.addChild(APP.library.getSpriteFromAtlas("money_wheel/you_win_lightsweep"));
		lFirstSweep_spr.rotation = -1.1;
		lFirstSweep_spr.scale.set(4);

		let lSecondSweep_spr = this._fSweep_sprt.addChild(APP.library.getSpriteFromAtlas("money_wheel/you_win_lightsweep"));
		lSecondSweep_spr.rotation = -1.1;
		lSecondSweep_spr.scale.set(4);

		this._fSweep_sprt.mask = lMask_sprt;

		this._fSweep_sprt.position.set(-lBounds_obj.width/2, -10);
		this._fSweep_sprt.moveXTo(lBounds_obj.width/2+10, 16*FRAME_RATE);
		
	}

	_startFlareAndCircleAnimations(aOptFinal_bl=false)
	{
		if (aOptFinal_bl)
		{
			let lFlareScale_seq = [
				{
					tweens: [{prop: "scale.x", to: 2.04}, {prop: "scale.y", to: 2.04}, {prop: "alpha", to: 1}],
					duration: 2*FRAME_RATE
				},
				{
					tweens: [{prop: "scale.x", to: 1.5}, {prop: "scale.y", to: 1.5}, {prop: "alpha", to: 0.46}],
					duration: 4*FRAME_RATE
				},
				{
					tweens: [{prop: "alpha", to: 0}],
					duration: 5*FRAME_RATE
				},
			];

			Sequence.start(this._fFlare_spr, lFlareScale_seq);
			this._fFlare_spr.rotateTo(0.9948376736367678, 11*FRAME_RATE); //Utils.gradToRad(57)
		}
		else
		{
			// FIRE CIRCLE...
			this._fFireCircle_spr.alpha = 1;
			this._fFireCircle_spr.scaleTo(4, 10*FRAME_RATE);
			this._fFireCircle_spr.play();
			// ...FIRE CIRCLE

			let lFlareScale_seq = [
				{
					tweens: [{prop: "scale.x", to: 5.05}, {prop: "scale.y", to: 5.05}, {prop: "alpha", to: 1}],
					duration: 4*FRAME_RATE
				},
				{
					tweens: [{prop: "scale.x", to: 2.26}, {prop: "scale.y", to: 2.26}, {prop: "alpha", to: 0.6}],
					duration: 8*FRAME_RATE
				},
				{
					tweens: [{prop: "alpha", to: 0}],
					duration: 7*FRAME_RATE
				},
			];

			Sequence.start(this._fFlare_spr, lFlareScale_seq);
			this._fFlare_spr.rotateTo(1.53588974175501, 22*FRAME_RATE); //Utils.gradToRad(88)
		}
	}

	_tryToFinishAnimation()
	{
		if (!this._fParticlesAnimationsCount_num)
		{
			this._completeAwarding();
		}
	}

	destroy()
	{
		if (this._fSoundId_str)
		{
			APP.soundsController.stop(this._fSoundId_str);
			this._fSoundId_str = null;
		}

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
		this._fFireCircle_spr && Sequence.destroy(Sequence.findByTarget(this._fFireCircle_spr));
		this._fFireCircle_spr && this._fFireCircle_spr.destroy();
		this._fFireCircle_spr = null;

		this._fFlare_spr && Sequence.destroy(Sequence.findByTarget(this._fFlare_spr));
		this._fFlare_spr && this._fFlare_spr.destroy();
		this._fFlare_spr = null;

		this._fCoinsFlyAnimation_cfa && this._fCoinsFlyAnimation_cfa.destroy();		
		this._fCoinsFlyAnimation_cfa = null;

		this._fPayout_wp && Tween.destroy(Tween.findByTarget(this._fPayout_wp));
		this._fPayout_wp && this._fPayout_wp.destroy();
		this._fPayout_wp = null;

		this._fSweep_sprt && Sequence.destroy(Sequence.findByTarget(this._fSweep_sprt));
		this._fSweep_sprt && this._fSweep_sprt.destroy();
		this._fSweep_sprt = null;

		this._fCaptionContainer_spr && Sequence.destroy(Sequence.findByTarget(this._fCaptionContainer_spr));
		this._fCaptionContainer_spr && this._fCaptionContainer_spr.destroy();
		this._fCaptionContainer_spr = null;

		super.destroy();
	}
}

export default MoneyWheelAward;