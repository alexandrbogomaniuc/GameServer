import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE, MONEY_WHEEL_ENABLED } from '../../../../../shared/src/CommonConstants';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import SimpleUIView from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/SimpleUIView';
import { Utils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import I18 from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
import { AtlasSprite } from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import AtlasConfig from '../../../config/AtlasConfig';
import GameFieldController from '../../../controller/uis/game_field/GameFieldController';
import * as Easing from '../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';

const DOUBLE_PI = Math.PI * 2;
const EIGHT_PI = Math.PI * 8;

const VALUE_PAYOUT_POSITION = 
[
	{x: 20, y: -72},
	{x: 71, y: 0},
	{x: 25, y: 70},
	{x: -190, y: 35},
	{x: -90, y: -165},
]

const ROTARION_GLOW_PART = 
[
	2.4958208303518914, //Utils.gradToRad(143),
	3.752457891787808, //Utils.gradToRad(215),
	5.009094953223726, //Utils.gradToRad(287),
	0, //Utils.gradToRad(0),
	1.2566370614359172 //Utils.gradToRad(72),
];

const ROTATION_VALUE = 
[
	-0.9599310885968813, //Utils.gradToRad(-55),
	0.24434609527920614, //Utils.gradToRad(14),
	1.5707963267948966, //Utils.gradToRad(90),
	-0.3316125578789226, //Utils.gradToRad(-19),
	0.9599310885968813 //Utils.gradToRad(55),
];

const ROTARION_POINTER_PART = 
[
	0.6457718232379019, //Utils.gradToRad(37),
	1.8675022996339325, //Utils.gradToRad(107),
	3.141592653589793, //Utils.gradToRad(180),
	4.328416544945937, //Utils.gradToRad(248),
	5.654866776461628, //Utils.gradToRad(324),
];

const PAYOUTS_PART_ID = 
{
	20: 0,
	50: 1,
	80: 2,
	100: 3,
	150: 4
};

let _particlesTexturesFlare = null;
let _particlesTexturesLight = null;
let _particlesTexturesPuff  = null;
function _initParticlesTexturesFlare()
{
	if (_particlesTexturesFlare) return;

	_particlesTexturesFlare = AtlasSprite.getFrames(APP.library.getAsset("money_wheel/wheel_particles"), AtlasConfig.MoneyWheelParticles, "");
}

function _initParticlesTexturesLight()
{
	if (_particlesTexturesLight) return;

	_particlesTexturesLight = AtlasSprite.getFrames(APP.library.getAsset("money_wheel/circle_light"), AtlasConfig.MoneyWheel, "");
}

function _initParticlesTexturesPuff()
{
	if (_particlesTexturesPuff) return;

	_particlesTexturesPuff = AtlasSprite.getFrames(APP.library.getAsset("common/puff_animation"), AtlasConfig.PuffAnimation, "");
}

class MoneyWheelView extends SimpleUIView
{
	static get EVENT_ON_WHEEL_MOVE_STARTED() { return "EVENT_ON_WHEEL_MOVE_STARTED";}
	static get EVENT_ON_WHEEL_MOVED() { return "EVENT_ON_WHEEL_MOVED";}
	static get EVENT_ON_ANIMATION_COMPLETED()			{return "onAnimationCompleted";}
	static get EVENT_ON_WIN_VALUE_ANIMATION_COMPLETED() { return 'EVENT_ON_WIN_VALUE_ANIMATION_COMPLETED';}
	static get EVENT_ON_WIN_ANIMATION_STARTED() { return "EVENT_ON_WIN_ANIMATION_STARTED";}
	static get EVENT_ON_WIN_ANIMATION_COMPLETED() { return "EVENT_ON_WIN_ANIMATION_COMPLETED";}

	static get EVENT_ON_WHEEL_POPUP_SFX()		{return "onWheelPopupSound";}
	static get EVENT_ON_WHEEL_HIGHLIGHT_SFX()	{return "onWheelHighlightSound";}
	static get EVENT_ON_WHEEL_TENSION_SFX()		{return "onWheelTensionSound";}
	static get EVENT_ON_WHEEL_WIN_SFX()			{return "onWheelWinSound";}

	resetView()
	{
		this._resetView();
	}

	get isAnimInProgress()
	{
		return this._fAnimInProgress_bln;
	}


	startAnimation(aValuePayout_num, aBetLevel_num, aAccelerateAnimation)
	{
		this._fAnimInProgress_bln = true;

		this._fPositionChanged_bln = false;
		this._fIsBossHpBarExist_bln = APP.gameScreen.gameFieldController.isBossEnemyExist;

		if(aAccelerateAnimation)
		{
			this._fLocalFrameRate_num = FRAME_RATE / 2;
		}
		else
		{
			this._fLocalFrameRate_num = FRAME_RATE;
		}

		this._startAnimation(aValuePayout_num, aBetLevel_num);
	}

	constructor()
	{
		super();
		this._fAnimInProgress_bln = false;

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			_initParticlesTexturesPuff();
			_initParticlesTexturesFlare();
			_initParticlesTexturesLight();
		}

		this._fFlare_sprt = null;
		this._fOrbGlow_sprt = null;
		this._fGlowPart_sprt = null;
		this._fPointer_sprt = null;
		this._fCircleRingGlow_sprt = null;
		this._fMoneyWheelGlow_g = null;
		this._fOrb_sprt = null;
		this._fCircle_sprt = null;
		this._fWheelContainer_spr = null;
		this._fStopPosition_num = null;
		this._fParticles_spr_arr = null;

		this._fParticlesAnimationsCount_num = 0;

		this._fLocalFrameRate_num = FRAME_RATE;

		this._fValue_ta_arr = [];
		this._initMoneyWheel();

		this._fPositionChanged_bln = false;
		this._fIsBossHpBarExist_bln = false;

		APP.gameScreen.gameFieldController.on(GameFieldController.EVENT_ON_NEW_BOSS_CREATED, this._bossEnemyCreated, this);
		APP.gameScreen.gameFieldController.on(GameFieldController.EVENT_ON_BOSS_DESTROYED, this._bossEnemyDestroyed, this);
	}

	_initMoneyWheel()
	{
		this._fWheelContainer_spr = this.addChild(new Sprite());
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._createFlare();
			this._createOrbGlow();
		}
		this._createCircle();
		this._createGlowPart();
		this._createCenter();
		this._createValuePayout();
		this._createPointer();
		this._createCircleRing();
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._createCircleRingGlow();
			this._createMoneyWheelGlow();
		}

		this._fWheelContainer_spr.scale.set(0);
		this._fWheelContainer_spr.position.set(this._screenCenterPoint.x, this._screenCenterPoint.y);
	}

	_createFlare()
	{
		let lFlare_sprt = this._fFlare_sprt = this._fWheelContainer_spr.addChild(APP.library.getSprite("money_wheel/flare"))
		lFlare_sprt.anchor.set(0.5, 0.5);
		lFlare_sprt.blendMode = PIXI.BLEND_MODES.ADD;
		lFlare_sprt.scale.set(8);
	}

	_createOrbGlow()
	{
		let lOrbGlow_sprt = this._fOrbGlow_sprt = this._fWheelContainer_spr.addChild(APP.library.getSprite("money_wheel/orb_glow"))
		lOrbGlow_sprt.anchor.set(0.5, 0.5);
		lOrbGlow_sprt.blendMode = PIXI.BLEND_MODES.ADD;
		lOrbGlow_sprt.scale.set(1.63);
		lOrbGlow_sprt.alpha = 0.6;
		lOrbGlow_sprt.visible = false;
	}

	_createCircle()
	{
		// CIRCLE_LIGHT...
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			let lParticle_sprt = this._fWheelContainer_spr.addChild(new Sprite());
			lParticle_sprt.textures = _particlesTexturesLight;
			lParticle_sprt.blendMode = PIXI.BLEND_MODES.ADD;
			lParticle_sprt.zIndex = 0;
			lParticle_sprt.scale.set(3.3);
			lParticle_sprt.position.set(-14, 3);
			lParticle_sprt.animationSpeed = 0.5;
			lParticle_sprt.play();
		}
		// ...CIRCLE_LIGHT

		let lCircle_sprt = this._fWheelContainer_spr.addChild(APP.library.getSprite("money_wheel/circle"))
		lCircle_sprt.anchor.set(0.5, 0.5);
	}
	
	_createGlowPart()
	{
		let lGlowPart_sprt = this._fGlowPart_sprt = this._fWheelContainer_spr.addChild(APP.library.getSprite("money_wheel/glow_part"))
		lGlowPart_sprt.anchor.set(0.747368, 0.41); //710/950, 205/500
		if (APP.isMobile)
		{
			lGlowPart_sprt.anchor.set(0.712368, 0.385);
		}
		lGlowPart_sprt.visible = false;
	}

	_createCenter()
	{
		let lCenter_sprt = this._fWheelContainer_spr.addChild(APP.library.getSprite("money_wheel/center"))
		lCenter_sprt.anchor.set(0.5, 0.5);
	}

	_createPointer()
	{
		let lPointer_sprt = this._fPointer_sprt = this._fWheelContainer_spr.addChild(APP.library.getSprite("money_wheel/pointer"))
		lPointer_sprt.anchor.set(0.5, 4);
	}

	_createCircleRing()
	{
		let lCircleRing_sprt = this._fWheelContainer_spr.addChild(APP.library.getSprite("money_wheel/circle_ring"))
		lCircleRing_sprt.anchor.set(0.5, 0.5);
	}

	_createCircleRingGlow()
	{
		let lCircleRingGlow_sprt = this._fCircleRingGlow_sprt = this._fWheelContainer_spr.addChild(APP.library.getSprite("money_wheel/circle_ring_glow"))
		lCircleRingGlow_sprt.anchor.set(0.5, 0.5);
		lCircleRingGlow_sprt.scale.set(2);
		lCircleRingGlow_sprt.position.set(2, 2);
		lCircleRingGlow_sprt.blendMode = PIXI.BLEND_MODES.ADD;
		lCircleRingGlow_sprt.alpha = 0;
	}

	_createMoneyWheelGlow()
	{
		let lMoneyWheelGlow_g = this._fMoneyWheelGlow_g = this._fWheelContainer_spr.addChild(new PIXI.Graphics());
		lMoneyWheelGlow_g.beginFill(0xffffff).drawCircle(0, 0, 251).endFill();
	}

	_createValuePayout()
	{
		for (let i = 0; i < VALUE_PAYOUT_POSITION.length; i++) {
			let lValue_ta = this._fValue_ta_arr[i] = this._fWheelContainer_spr.addChild(APP.isMobile?I18.generateNewCTranslatableAsset("TAMoneyWheelValueMobile"):I18.generateNewCTranslatableAsset("TAMoneyWheelValue"));
			lValue_ta.position.set(VALUE_PAYOUT_POSITION[i].x, VALUE_PAYOUT_POSITION[i].y);
			lValue_ta.rotation = ROTATION_VALUE[i];
		}
	}

	_updateValuePayout(aBetLevel_num)
	{
		let lWinPayouts_arr = [];
		for (let lPayoutBase_num in PAYOUTS_PART_ID) {
			let lWinPayout_num = lPayoutBase_num * APP.playerController.info.currentStake * aBetLevel_num;
			lWinPayouts_arr.push(lWinPayout_num);
			this._fValue_ta_arr[PAYOUTS_PART_ID[lPayoutBase_num]].text = APP.currencyInfo.i_formatNumber(lWinPayout_num, true);
		}
		this.uiInfo.payoutsArr = lWinPayouts_arr;
	}

	_startAnimation(aValuePayout_num, aBetLevel_num)
	{
		this._resetView();

		this.show();

		this._updateValuePayout(aBetLevel_num);
		if(MONEY_WHEEL_ENABLED)
		{
			if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
			{
				this._startOrbAnimation();
				this._startCircleAnimation();
			}

			let lWinPayoutBase_num = aValuePayout_num / (APP.playerController.info.currentStake * aBetLevel_num);
			this._fStopPosition_num = PAYOUTS_PART_ID[lWinPayoutBase_num];
			this._fPayoutValue_num = aValuePayout_num;

			if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
			{
				this._startParticlePuff({x: this._screenCenterPoint.x + 16, y: this._screenCenterPoint.y}, Math.PI);
				this._startParticlePuff({x: this._screenCenterPoint.x - 16, y: this._screenCenterPoint.y}, -Math.PI);
				this._startParticle({x: this._screenCenterPoint.x + 16, y: this._screenCenterPoint.y}, Math.PI);
			}

			this.emit(MoneyWheelView.EVENT_ON_WHEEL_POPUP_SFX);
			
			this._startMoveWheelAnimation();
		}else{
			this._startPayoutAnimation();
		}
		
	}

	_startCircleAnimation()
	{
		if(this._fCircle_sprt === null)
		{
			this._fCircle_sprt = this.addChild(APP.library.getSprite("money_wheel/circle_blast"));
			this._fCircle_sprt.blendMode = PIXI.BLEND_MODES.ADD;
			this._fCircle_sprt.anchor.set(0.5, 0.5);
			this._fCircle_sprt.position.set(this._screenCenterPoint.x ,this._screenCenterPoint.y);
		}

		this._fCircle_sprt.scale.set(0);
		this._fCircle_sprt.alpha = 1;

		this._fCircle_sprt.scaleTo(10, 22*this._fLocalFrameRate_num, null, null, null, null, 1*this._fLocalFrameRate_num);
		this._fCircle_sprt.fadeTo(0, 8*this._fLocalFrameRate_num, null, null, null, null, 15*this._fLocalFrameRate_num);
	}

	_startOrbAnimation()
	{
		if(this._fOrb_sprt === null)
		{
			this._fOrb_sprt = this.addChild(APP.library.getSpriteFromAtlas("common/orange_orb"));
			this._fOrb_sprt.blendMode = PIXI.BLEND_MODES.ADD;
			this._fOrb_sprt.anchor.set(0.5, 0.5);
			this._fOrb_sprt.position.set(this._screenCenterPoint.x ,this._screenCenterPoint.y);
		}

		this._fOrb_sprt.scale.set(0);
		this._fOrb_sprt.alpha = 0.9;

		this._fOrb_sprt.scaleTo(10, 13*this._fLocalFrameRate_num, null, null, null, null, 2*this._fLocalFrameRate_num);
		this._fOrb_sprt.fadeTo(0, 18*this._fLocalFrameRate_num, null, null, null, null, 2*this._fLocalFrameRate_num);
	}

	_startMoveWheelAnimation()
	{
		this._fWheelContainer_spr.show();
		
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			let lMoneyWheelGlowAlpha_seq = [
				{
					tweens: [{prop: "alpha", to: 0}],
					duration: 12*this._fLocalFrameRate_num,
					onfinish: this._endMoneyWheelGlowSequence.bind(this)
				}
			];
			Sequence.start(this._fMoneyWheelGlow_g, lMoneyWheelGlowAlpha_seq, 2*this._fLocalFrameRate_num);
		}

		let lScaleFirst_seq = [
			{
				tweens: [{prop: "scale.x", to: 0.685}, {prop: "scale.y", to: 0.685}],
				duration: 9*this._fLocalFrameRate_num,
				onfinish: this._sequenceAfterFirstScale.bind(this)
			},
			{
				tweens: [{prop: "scale.x", to: 0.47}, {prop: "scale.y", to: 0.47}],
				duration: 12*this._fLocalFrameRate_num
			},
		];

		Sequence.start(this._fWheelContainer_spr, lScaleFirst_seq);

		
		

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._fFlare_sprt.rotateTo(2.007128639793479, 139*this._fLocalFrameRate_num); // Utils.gradToRad(115)
			this._fCircleRingGlow_sprt.fadeTo(0, 8*this._fLocalFrameRate_num, null, null, null, null, 20*this._fLocalFrameRate_num);
			this._startOrbGlowAnimation();
		}
	}

	_sequenceAfterFirstScale()
	{
		this._fPositionChanged_bln = true;

		let lGlobalPosition_pt = this.globalToLocal(this._screenCenterPoint.x, this._screenCenterPoint.y);
		let lFinalPositionX_num = lGlobalPosition_pt.x + 330 * (APP.isMobile ? -1 : 1) - (this._fIsBossHpBarExist_bln && !APP.isMobile ? 70 : 0);
		let lFinalPositionY_num = lGlobalPosition_pt.y - 15;

		this._fWheelContainer_spr.moveXTo(lFinalPositionX_num, 12*this._fLocalFrameRate_num, Easing.back.easeIn, this._onWheelLanded.bind(this));
		this._fWheelContainer_spr.moveYTo(lFinalPositionY_num, 12*this._fLocalFrameRate_num, Easing.quartic.easeOut);
	}

	_onWheelLanded()
	{
		this.emit(MoneyWheelView.EVENT_ON_WHEEL_HIGHLIGHT_SFX);
		this._startRotationPointerAnimation();

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startWheelGlowFadeAnimation();
		}
	}

	_bossEnemyCreated()
	{
		this._fIsBossHpBarExist_bln = true;
		if(!this._fAnimInProgress_bln || APP.isMobile || !this._fPositionChanged_bln)
		{
			return;
		}

		this._fWheelContainer_spr.removeTweens();

		let lGlobalPosition_pt = this.globalToLocal(this._screenCenterPoint.x, this._screenCenterPoint.y);
		this._fWheelContainer_spr.moveXTo(lGlobalPosition_pt.x + 260, 5*this._fLocalFrameRate_num);
	}

	_bossEnemyDestroyed()
	{
		this._fIsBossHpBarExist_bln = false;
		if(!this._fAnimInProgress_bln || APP.isMobile || !this._fPositionChanged_bln)
		{
			return;
		}

		this._fWheelContainer_spr.removeTweens();

		let lGlobalPosition_pt = this.globalToLocal(this._screenCenterPoint.x, this._screenCenterPoint.y);
		this._fWheelContainer_spr.moveXTo(lGlobalPosition_pt.x + 330, 5*this._fLocalFrameRate_num);
	}

	_startOrbGlowAnimation()
	{
		this._fOrbGlow_sprt.scale.set(1.63);
		this._fOrbGlow_sprt.alpha = 0.6;
		this._fOrbGlow_sprt.visible = false;

		let lScaleOrbGlow_seq = [
			{
				tweens: [],
				duration: 23*this._fLocalFrameRate_num,
				onfinish: this._fOrbGlow_sprt.show.bind(this)
			},
			{
				tweens: [{prop: "scale.x", to: 2.44},{prop: "scale.y", to: 2.44}],
				duration: 21*this._fLocalFrameRate_num,
			},
		];
		Sequence.start(this._fOrbGlow_sprt, lScaleOrbGlow_seq)

		this._fOrbGlow_sprt.fadeTo(0, 13*this._fLocalFrameRate_num, null, null, null, null, 28*this._fLocalFrameRate_num);
	}

	_startWheelGlowFadeAnimation()
	{
		this._fCircleRingGlow_sprt.scale.set(2);
		this._fCircleRingGlow_sprt.alpha = 1;

		let l_seq = [
			{
				tweens: [{prop: "scale.x", to: 3}, {prop: "scale.y", to: 3}, {prop: "alpha", to: 0, ease: Easing.quadratic.easeOut}],
				duration: 10*this._fLocalFrameRate_num,
				onfinish: () => {
					this._fCircleRingGlow_sprt.scale.set(2);
				}
			}
		];
		Sequence.start(this._fCircleRingGlow_sprt, l_seq);
	}

	_startRotationPointerAnimation()
	{
		let lResultRotation_num = ROTARION_POINTER_PART[this._fStopPosition_num];
		this._fPointer_sprt.rotateTo(EIGHT_PI+lResultRotation_num, 70*this._fLocalFrameRate_num, Easing.cubic.easeInOut, this._startBlinkAnimation.bind(this), this._rotateGlowPart.bind(this));

		let lCircleGlow_seq = [
			{
				tweens: [{prop: "alpha", to: 1}],
				duration: 60*this._fLocalFrameRate_num
			}
		];
		Sequence.start(this._fCircleRingGlow_sprt, lCircleGlow_seq, 10*this._fLocalFrameRate_num);
		this.emit(MoneyWheelView.EVENT_ON_WHEEL_TENSION_SFX);
	}

	_rotateGlowPart()
	{
		let lGlowPartId_num = Math.floor(this._fPointer_sprt.rotation % (DOUBLE_PI) / 1.2566370614359172); //  Utils.gradToRad(72) 72 = 360/5;
		this._fGlowPart_sprt.rotation = ROTARION_GLOW_PART[lGlowPartId_num];
		if (!this._fGlowPart_sprt.visible && this._fGlowPart_sprt.rotation > 0)
		{
			this._fGlowPart_sprt.show();
		}
	}

	_startBlinkAnimation()
	{
		let lGlobalPosition_pt = this.globalToLocal(this._screenCenterPoint.x, this._screenCenterPoint.y);
		let lAlphaGlowPart_seq = [
			{tweens: [
				{prop: "alpha", to: 0}
			],
			duration: 2*this._fLocalFrameRate_num
			},
			{tweens: [
				{prop: "alpha", to: 1}
			],
			duration: 2*this._fLocalFrameRate_num
			},
			{tweens: [],
				duration: 3*this._fLocalFrameRate_num
			},
			{tweens: [
				{prop: "alpha", to: 0}
			],
			duration: 2*this._fLocalFrameRate_num
			},
			{tweens: [
				{prop: "alpha", to: 1}
			],
			duration: 3*this._fLocalFrameRate_num
			},
			{tweens: [],
				duration: 2*this._fLocalFrameRate_num
			},
			{tweens: [
				{prop: "alpha", to: 0}
			],
			duration: 2*this._fLocalFrameRate_num
			},
			{tweens: [
				{prop: "alpha", to: 1}
			],
			duration: 3*this._fLocalFrameRate_num,
			onfinish: ()=>{
				if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
				{
					this._startParticle({x: lGlobalPosition_pt.x + 330 * (APP.isMobile ? -1 : 1), y: lGlobalPosition_pt.y - 15}, Math.PI);
					this._startOrbGlowAnimation();
				}


				this._startOutroAnimation();
				if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
				{
					this._startWheelGlowFadeAnimation();
				}
			}
			},
		];

		Sequence.start(this._fGlowPart_sprt, lAlphaGlowPart_seq);
		this.emit(MoneyWheelView.EVENT_ON_WHEEL_WIN_SFX);
	}

	get _screenCenterPoint()
	{
		return {x: APP.config.size.width/2, y: APP.config.size.height/2}
	}

	_startPayoutAnimation()
	{
		this.emit(MoneyWheelView.EVENT_ON_WIN_VALUE_ANIMATION_COMPLETED);
		this._onWinAnimationCompleted();
	}

	_startParticle(aPos_obj, aRot_num, aOptIsFinal=false)
	{
		if (!this._fParticles_spr_arr)
		{
			this._fParticles_spr_arr = [];
		}

		let lParticle_sprt = this.addChild(new Sprite());
		lParticle_sprt.textures = _particlesTexturesFlare;
		lParticle_sprt.blendMode = PIXI.BLEND_MODES.ADD;
		lParticle_sprt.scale.set(4, -4);
		lParticle_sprt.rotation = aRot_num;
		lParticle_sprt.position.set(aPos_obj.x, aPos_obj.y);
		lParticle_sprt.animationSpeed = 0.27;
		lParticle_sprt.on('animationend', () => {
			this._fParticlesAnimationsCount_num--;
			aOptIsFinal && this._tryToResetAnimation();
			lParticle_sprt && lParticle_sprt.destroy();
			lParticle_sprt = null;
		});
		this._fParticles_spr_arr.push(lParticle_sprt);
		lParticle_sprt.play();
		this._fParticlesAnimationsCount_num++;
	}

	_startParticlePuff(aPos_obj, aRot_num)
	{
		if (!this._fParticles_spr_arr)
		{
			this._fParticles_spr_arr = [];
		}

		let lParticle_sprt = this.addChild(new Sprite());
		lParticle_sprt.textures = _particlesTexturesPuff;
		lParticle_sprt.blendMode = PIXI.BLEND_MODES.ADD;
		lParticle_sprt.scale.set(4);
		lParticle_sprt.rotation = aRot_num;
		lParticle_sprt.position.set(aPos_obj.x, aPos_obj.y);
		lParticle_sprt.animationSpeed = 0.5;
		lParticle_sprt.on('animationend', () => {
			lParticle_sprt && lParticle_sprt.destroy();
			lParticle_sprt = null;
		});
		this._fParticles_spr_arr.push(lParticle_sprt);
		lParticle_sprt.play();
	}

	_startOutroAnimation()
	{
		let lGlobalPosition_pt = this.globalToLocal(this._screenCenterPoint.x, this._screenCenterPoint.y);
		let lMiddlePositionX_num = (this._fWheelContainer_spr.position.x + lGlobalPosition_pt.x)/2;

		let lSequenceMove_seq = [
			{
				tweens: [
					{prop: "position.x", to: lMiddlePositionX_num},
					{prop: "position.y", to: lGlobalPosition_pt.y-50},
					{prop: "scale.x", to: 0.636},
					{prop: "scale.y", to: 0.636},
				],
				duration: 8*this._fLocalFrameRate_num,
				ease: Easing.quadratic.easeOut,
			},
			{
				tweens: [
					{prop: "position.x", to: lGlobalPosition_pt.x},
					{prop: "position.y", to: lGlobalPosition_pt.y},
					{prop: "scale.x", to: 0.3},
					{prop: "scale.y", to: 0.3},
				],
				duration: 5*this._fLocalFrameRate_num,
				ease: Easing.quadratic.easeIn,
				onfinish: this._startPayoutAnimation.bind(this)
			},
			{
				tweens: [
					{prop: "scale.x", to: 0},
					{prop: "scale.y", to: 0},
					{prop: "alpha", to: 0},
				],
				duration: 3*this._fLocalFrameRate_num,
				onfinish: () => {
					if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
					{
						this._startParticle(lGlobalPosition_pt, Math.PI, true);
					}
					else
					{
						this._tryToResetAnimation();
					}
				}
			},
		];
		Sequence.start(this._fWheelContainer_spr, lSequenceMove_seq);
	}

	_tryToResetAnimation()
	{
		if (
			Sequence.findByTarget(this._fWheelContainer_spr).length > 0 ||
			this._fParticlesAnimationsCount_num > 0
		)
		{
			return;
		}

		this._resetView();
	}
	
	_resetView()
	{
		this._interruptAnimations();
		this._fWheelContainer_spr.hide();
		this._fWheelContainer_spr.alpha = 1;
		this._fWheelContainer_spr.scale.set(0);

		this._fWheelContainer_spr.position.set(this._screenCenterPoint.x, this._screenCenterPoint.y)

		this._fGlowPart_sprt.hide();
		this._fPointer_sprt.rotation = 0;
		this._fParticlesAnimationsCount_num = 0;

		this.hide();
	}

	_onWinAnimationCompleted()
	{
		this._fAnimInProgress_bln = false;

		this._resetView();

		this.emit(MoneyWheelView.EVENT_ON_WIN_ANIMATION_COMPLETED);
	}

	_interruptAnimations()
	{
		this._fAnimInProgress_bln = false;

		if (this._fParticles_spr_arr && Array.isArray(this._fParticles_spr_arr))
		{
			for (let l_spr of this._fParticles_spr_arr)
			{
				l_spr && l_spr.destroy();
			}
		}
		this._fParticles_spr_arr = null;

		this._fGlowPart_sprt && Sequence.destroy(Sequence.findByTarget(this._fGlowPart_sprt));
		this._fMoneyWheelGlow_g && Sequence.destroy(Sequence.findByTarget(this._fMoneyWheelGlow_g));
		this._fOrbGlow_sprt && Sequence.destroy(Sequence.findByTarget(this._fOrbGlow_sprt));
		this._fOrbGlow_sprt && this._fOrbGlow_sprt.removeTweens();
		this._fOrb_sprt	&& this._fOrb_sprt.removeTweens();
		this._fOrb_sprt && this._fOrb_sprt.scale.set(0);

		this._fFlare_sprt && this._fFlare_sprt.removeTweens();
		this._fCircle_sprt && this._fCircle_sprt.removeTweens();

		this._fCircleRingGlow_sprt && Sequence.destroy(Sequence.findByTarget(this._fCircleRingGlow_sprt));	
		this._fCircleRingGlow_sprt && this._fCircleRingGlow_sprt.removeTweens();
	
		this._fWheelContainer_spr && Sequence.destroy(Sequence.findByTarget(this._fWheelContainer_spr));
		this._fWheelContainer_spr && this._fWheelContainer_spr.removeTweens();
	}

	_endMoneyWheelGlowSequence()
	{
		this._fMoneyWheelGlow_g && Sequence.destroy(Sequence.findByTarget(this._fMoneyWheelGlow_g));
		this._fMoneyWheelGlow_g && this._fMoneyWheelGlow_g.destroy();
		this._fMoneyWheelGlow_g = null;
	}

	destroy()
	{
		this._resetView();

		this._fStopPosition_num = null;
		this._fGlowPart_sprt && this._fGlowPart_sprt.destroy();
		this._fCircle_sprt && this._fCircle_sprt.destroy();
		this._fOrb_sprt && this._fOrb_sprt.destroy();
		this._fOrbGlow_sprt && this._fOrbGlow_sprt.destroy();
		this._fPointer_sprt && this._fPointer_sprt.destroy();
		this._fFlare_sprt && this._fFlare_sprt.destroy();
		this._fCircleRingGlow_sprt && this._fCircleRingGlow_sprt.destroy();
		this._fMoneyWheelGlow_g && this._fMoneyWheelGlow_g.destroy();
		super.destroy();
	}
}

export default MoneyWheelView;