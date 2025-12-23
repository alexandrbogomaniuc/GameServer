import SimpleUIView from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/SimpleUIView';
import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import * as Easing from '../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../shared/src/CommonConstants';
import { Utils } from "../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils";
import { AtlasSprite } from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import AtlasConfig from '../../../config/AtlasConfig';
import { Tween } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import { ProjectionUtils } from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/ProjectionUtils';
import Timer from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import KillerCapsuleCardView from './KillerCapsuleCardView';
import { GlowFilter } from "../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Filters";

let blow_lines_texture;
function generate_blow_lines_texture()
{
	if (!blow_lines_texture)
	{
		blow_lines_texture = AtlasSprite.getFrames(APP.library.getAsset("enemies/killer_capsule/blow_lines"), AtlasConfig.KillerCapsuleBlowLines, "");
	}

	return blow_lines_texture;
}

let grey_smoke_texture;
function generate_grey_smoke_texture()
{
	if (!grey_smoke_texture)
	{
		grey_smoke_texture = AtlasSprite.getFrames(APP.library.getAsset("enemies/killer_capsule/grey_smoke"), AtlasConfig.KillerCapsuleSmoke, "");
	}

	return grey_smoke_texture;
}

let red_smoke_texture;
function generate_red_smoke_texture()
{
	if (!red_smoke_texture)
	{
		red_smoke_texture = AtlasSprite.getFrames(APP.library.getAsset("enemies/killer_capsule/red_smoke"), AtlasConfig.KillerCapsuleSmoke, "");
	}

	return red_smoke_texture;
}


class KillerCapsuleFeatureView extends SimpleUIView
{
	static get EVENT_ON_CARD_LANDED() 						{ return KillerCapsuleCardView.EVENT_ON_CARD_LANDED; }
	static get EVENT_ON_CARD_DISAPPEARED() 					{ return KillerCapsuleCardView.EVENT_ON_CARD_DISAPPEARED; }
	static get EVENT_ON_CARD_READY_TO_KILL() 				{ return KillerCapsuleCardView.EVENT_ON_CARD_READY_TO_KILL; }
	static get EVENT_ON_TARGET_HIT() 						{ return "onTargetHit"; }
	static get EVENT_ON_INSTAKILL_BEAM_SFX()				{ return "onInstakillBeamSound"; }

	addToContainerIfRequired(aAwardingContainerInfo_obj)
	{
		this._addToContainerIfRequired(aAwardingContainerInfo_obj);
	}

	startAnimation(aStartPostion_obj)
	{
		this._fCardPosition_obj = this._calculatePosition(aStartPostion_obj);
		this._startAnimation();
	}

	interrupt()
	{
		this._interrupt();
	}

	i_setFinalEnemyType(aValue_num)
	{
		if (!aValue_num && aValue_num !== 0)
		{
			APP.logger.i_pushError(`KillerCapsuleFeatureView. The type ID must be defined!`);
			console.error('The type ID must be defined!');
			return;
		}

		this._fCardContainer_kccv && this._fCardContainer_kccv.i_setCardEnemyTypeId(aValue_num);
	}

	i_fireEnemies()
	{
		this._startShootingAnimations();
		this._startRedFlareAnimation();
	}

	setInfoAffectedEnemiesInfo(aTargets_obj_arr)
	{
		if (Array.isArray(aTargets_obj_arr))
		{
			this._fAffectedEnemiesInfo_obj_arr = aTargets_obj_arr.slice();
		}
	}

	get affectedEnemiesInfo()
	{
		return this._fAffectedEnemiesInfo_obj_arr;
	}

	get killerFieldAnimationInfo()
	{
		return APP.gameScreen.gameFieldController.killerFieldAnimationInfo;
	}

	constructor()
	{
		super();

		this._fCardPosition_obj = null;
		this._fCrossLights_spr_arr = null;
		this._fCardContainer_kccv = null;

		this._fFieldAnimationContainer_spr = null;
		this._fMainAnimationContainer_spr = null;
		this._fBlastCirle_spr = null;
		this._fFireExplosion_spr = null;
		this._fSmokes_spr_arr = null;
		this._fRedFlare_spr = null;

		this._fCardProjectionCamera_c3d = null;
		this._fBlowLines_spr_arr = [];
		this._fFireTimers_t_arr = [];
	}

	/**
	 * Calculating new cards' position for better visibility on gameField.
	 * @param {Object} aPostion_obj
	 * @returns {Object} 
	 */
	_calculatePosition(aPostion_obj)
	{
		let lResultPosition_obj = {x: 0, y: 0};
		let lCardAsset_obj = APP.library.getAsset("enemies/killer_capsule/card_background");
		let lAPPSize_obj = APP.config.size;

		lResultPosition_obj.x = Math.max(lCardAsset_obj.width/2, Math.min(lAPPSize_obj.width-lCardAsset_obj.width/2, aPostion_obj.x));
		lResultPosition_obj.y = Math.max(lCardAsset_obj.height/2, Math.min(lAPPSize_obj.height-lCardAsset_obj.height/2, aPostion_obj.y));

		return lResultPosition_obj;
	}

	_addToContainerIfRequired(aAwardingContainerInfo_obj)
	{
		if (this.parent)
		{
			return;
		}

		aAwardingContainerInfo_obj.container.addChild(this);
		this.zIndex = aAwardingContainerInfo_obj.zIndex;
	}

	_initCardContainer()
	{
		this._fMainAnimationContainer_spr = this.addChild(new Sprite());
		this._fMainAnimationContainer_spr.position = this._fCardPosition_obj;

		this._fCardProjectionCamera_c3d = this._fMainAnimationContainer_spr.addChild(new ProjectionUtils.Camera3d());
		this._fCardProjectionCamera_c3d.setPlanes(1000, 0, 1000);

		let lSign_num = Math.sign(this._fCardPosition_obj.x - APP.config.size.width/2);  // -1 if the card is on the left side; 1 if the side is right
		this._fCardContainer_kccv = this._fCardProjectionCamera_c3d.addChild(new KillerCapsuleCardView(lSign_num));
		this._fCardContainer_kccv.on(KillerCapsuleCardView.EVENT_ON_CARD_LANDED, this._onCardLanded, this);
		this._fCardContainer_kccv.on(KillerCapsuleCardView.EVENT_ON_CARD_DISAPPEARED, this._onCardDisappeared, this);
		this._fCardContainer_kccv.on(KillerCapsuleCardView.EVENT_ON_CARD_READY_TO_KILL, this._startEnemiesDeathAnimation, this);

		this._fRedFlare_spr = this._fMainAnimationContainer_spr.addChild(APP.library.getSpriteFromAtlas("common/killer_capsule_red_flare"));
		this._fRedFlare_spr.blendMode = PIXI.BLEND_MODES.ADD;
		this._fRedFlare_spr.scale.set(0);
	}

	_startFieldAnimation()
	{
		this._fFieldAnimationContainer_spr = this.killerFieldAnimationInfo.container.addChild(new Sprite());
		this._fFieldAnimationContainer_spr.zIndex = this.killerFieldAnimationInfo.zIndex;

		this._fBlackCover_spr = this._fFieldAnimationContainer_spr.addChild(new PIXI.Graphics());
		let lRedCover_spr = this._fBlackCover_spr.addChild(APP.library.getSpriteFromAtlas("common/red_screen_round_cover"));
		lRedCover_spr.scale.set(2.5);
		lRedCover_spr.position.set(480, 270);
		lRedCover_spr.alpha = 0.4;
		this._fBlackCover_spr.beginFill(0x000000).drawRect(-10, 10, 970, 550).endFill();
		this._fBlackCover_spr.alpha = 0;

		let lAlphaTween_t = new Tween(this._fBlackCover_spr, "alpha", 0, 0.4, 20*FRAME_RATE)
		lAlphaTween_t.play();
	}

	_startAnimation()
	{
		this._startFieldAnimation();

		this._initCardContainer();

		this._startFireExplosionAnimation();
		this._startSmokeAnimation();
		
		this._fCardContainer_kccv.i_startAnimation();
	}

	_onCardLanded(aEvent_obj)
	{
		this.emit(KillerCapsuleFeatureView.EVENT_ON_CARD_LANDED, aEvent_obj);

		if (aEvent_obj.isInit)
		{
			this._startCardIntroLandedAnimation();
		}
		else
		{
			this._fCardContainer_kccv.filters = null;
			this._startBlowByCompletionTheCardShow();
		}
	}

	_onCardDisappeared(event)
	{
		this._startFireExplosionAnimation();
		this._completeFieldAnimation();
		this.emit(event);
	}

	/**
	 * Creating X-lights and calls creating white blast circle and white smoke.
	 */
	_startCardIntroLandedAnimation()
	{
		if (!this._fCardContainer_kccv)
		{
			this._initCardContainer();
		}

		// X-light behind...
		this._fCrossLights_spr_arr = [];

		let lHorizontalXLight_spr = this._fMainAnimationContainer_spr.addChild(APP.library.getSprite("enemies/killer_capsule/glow_card"));
		lHorizontalXLight_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lHorizontalXLight_spr.scale.set(1, 0);
		lHorizontalXLight_spr.zIndex = -2;
		lHorizontalXLight_spr.rotation = Math.PI/2;
		this._fCrossLights_spr_arr.push(lHorizontalXLight_spr);

		let lVerticalXLight_spr = this._fMainAnimationContainer_spr.addChild(APP.library.getSprite("enemies/killer_capsule/glow_card"));
		lVerticalXLight_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lVerticalXLight_spr.scale.set(1, 0);
		lVerticalXLight_spr.zIndex = -2;
		this._fCrossLights_spr_arr.push(lVerticalXLight_spr);

		let lHorizontalScale_seq = [
			{
				tweens: [{prop: "scale.y", from: 1, to: 8}],
				duration: 4*FRAME_RATE,
			},
			{
				tweens: [{prop: "scale.x", to: 0}, {prop: "scale.y", to: 10}],
				duration: 2*FRAME_RATE,
				onfinish: ()=>{
					lHorizontalXLight_spr && Sequence.destroy(Sequence.findByTarget(lHorizontalXLight_spr));
					lHorizontalXLight_spr && lHorizontalXLight_spr.destroy();
					lHorizontalXLight_spr = null;
				},
			},
		];

		let lVerticalScale_seq = [
			{
				tweens: [{prop: "scale.y", from: 1, to: 5}],
				duration: 4*FRAME_RATE,
			},
			{
				tweens: [{prop: "scale.x", to: 0}, {prop: "scale.y", to: 7}],
				duration: 2*FRAME_RATE,
				onfinish: ()=>{
					lVerticalXLight_spr && Sequence.destroy(Sequence.findByTarget(lVerticalXLight_spr));
					lVerticalXLight_spr && lVerticalXLight_spr.destroy();
					lVerticalXLight_spr = null;
				},
			},
		];

		Sequence.start(lHorizontalXLight_spr, lHorizontalScale_seq);
		Sequence.start(lVerticalXLight_spr, lVerticalScale_seq);
		// ...X-light behind

		this._startBlastCircleAnimation();
		this._startSmokeAnimation();

		// SWIRLS IN THE CARD...
		let lCardFirstSwirl_spr = this._fMainAnimationContainer_spr.addChild(new Sprite());
		lCardFirstSwirl_spr.textures = generate_blow_lines_texture();
		lCardFirstSwirl_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lCardFirstSwirl_spr.rotation = Math.PI*5/6;
		lCardFirstSwirl_spr.animationSpeed = 0.55;
		lCardFirstSwirl_spr.position.set(70, -60);
		lCardFirstSwirl_spr.anchor.set(0, 0.5);
		lCardFirstSwirl_spr.scale.set(1.5);
		lCardFirstSwirl_spr.on('animationend', ()=>{
			this._startRedFlareAnimation(true);
			lCardFirstSwirl_spr && lCardFirstSwirl_spr.destroy();
		});
		lCardFirstSwirl_spr.play();

		let lCardSecondSwirl_spr = this._fMainAnimationContainer_spr.addChild(new Sprite());
		lCardSecondSwirl_spr.textures = generate_blow_lines_texture();
		lCardSecondSwirl_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lCardSecondSwirl_spr.animationSpeed = 0.7;
		lCardSecondSwirl_spr.rotation = -Math.PI/6;
		lCardSecondSwirl_spr.position.set(-70, 60);
		lCardSecondSwirl_spr.anchor.set(0, 0.5);
		lCardSecondSwirl_spr.scale.set(1.5);
		lCardSecondSwirl_spr.on('animationend', ()=>{
			lCardSecondSwirl_spr && lCardSecondSwirl_spr.destroy();
		});
		lCardSecondSwirl_spr.play();
		// ...SWIRLS IN THE CARD
	}

	/**
	 * Creates fire under the enemy or the card and animates it.
	 */
	_startFireExplosionAnimation()
	{
		if (!this._fFireExplosion_spr)
		{
			this._fFireExplosion_spr = this._fMainAnimationContainer_spr.addChild(APP.library.getSpriteFromAtlas("common/orange_orb"));
		}
		this._fFireExplosion_spr.scale.set(1);
		this._fFireExplosion_spr.anchor.set(0.5, 0.55);
		this._fFireExplosion_spr.zIndex = -1;
		this._fFireExplosion_spr.blendMode = PIXI.BLEND_MODES.ADD;

		let lScale_seq = [
			{
				tweens: [{prop: "scale.x", to: 5}, {prop: "scale.y", to: 5}],
				duration: 5*FRAME_RATE,
			},
			{
				tweens: [{prop: "scale.x", to: 9}, {prop: "scale.y", to: 9}, {prop: "alpha", to: 0}],
				duration: 6*FRAME_RATE,
				ease: Easing.cubic.easeOut,
				onfinish: ()=>{
					this._fFireExplosion_spr && Sequence.destroy(Sequence.findByTarget(this._fFireExplosion_spr));
					this._fFireExplosion_spr && this._fFireExplosion_spr.destroy();
					this._fFireExplosion_spr = null;
				},
			},
		];

		Sequence.start(this._fFireExplosion_spr, lScale_seq);
	}

	/**
	 * Starts red flare animation.
	 * @param {Boolean} aOptIsInit_bl If it's true, the animation will be shorter
	 */
	_startRedFlareAnimation(aOptIsInit_bl=false)
	{
		let lShort_seq = [
			{ tweens: [{prop: "scale.x", to: 5}, {prop: "scale.y", to: 2}], duration: 1*FRAME_RATE },
			{ tweens: [{prop: "scale.x", to: 2.5}, {prop: "scale.y", to: 4}], duration: 4*FRAME_RATE },
			{ tweens: [{prop: "scale.x", to: 0}, {prop: "scale.y", to: 0}], duration: 2*FRAME_RATE, } //onfinish: this._fCardContainer_kccv.i_startCardRotationAnimation.bind(this._fCardContainer_kccv)},
		];

		let lLong_seq = [
			{ tweens: [{prop: "scale.x", to: 5}, {prop: "scale.y", to: 2}], duration: 1*FRAME_RATE },
			{ tweens: [{prop: "scale.x", to: 2.5}, {prop: "scale.y", to: 2}], duration: 4*FRAME_RATE },
			{ tweens: [{prop: "scale.x", from: 5, to: 2.5}, {prop: "scale.y", from: 1.5, to: 3}], duration: 4*FRAME_RATE },
			{ tweens: [{prop: "scale.x", from: 5, to: 2.5}, {prop: "scale.y", from: 1.5, to: 3}], duration: 4*FRAME_RATE },
			{ tweens: [{prop: "scale.x", from: 5, to: 2}, {prop: "scale.y", from: 1.5, to: 4}], duration: 4*FRAME_RATE },
			{ tweens: [{prop: "scale.x", to: 0}, {prop: "scale.y", to: 0}], duration: 2*FRAME_RATE },
		];

		if (!aOptIsInit_bl)
		{
			this._fRedFlare_spr.position.set(0, 30);
		}

		Sequence.start(this._fRedFlare_spr, aOptIsInit_bl ? lShort_seq : lLong_seq);
	}

	/**
	 * Starts 6 red swirl lines' animations.
	 */
	_startBlowByCompletionTheCardShow()
	{
		// LINES...
		for (let i = 0; i < 6; i++)
		{
			let lLine_spr = this._fMainAnimationContainer_spr.addChild(new Sprite());
			lLine_spr.textures = generate_blow_lines_texture();
			lLine_spr.rotation = Utils.gradToRad(-10 + 60*i); // every 60 grad
			lLine_spr.zIndex = -1;
			lLine_spr.animationSpeed = 0.35;
			lLine_spr.blendMode = PIXI.BLEND_MODES.ADD;
			lLine_spr.scale.set(5);
			lLine_spr.anchor.set(0, 0.5);
			lLine_spr.on('animationend', ()=>{
				lLine_spr && lLine_spr.destroy();
			});

			this._fBlowLines_spr_arr.push(lLine_spr);
			lLine_spr.play();
		}
		// ...LINES

		this._startBlastCircleAnimation(true);
	}

	/**
	 * Starts death field for each enemy.
	 */
	_startEnemiesDeathAnimation()
	{
		this.emit(KillerCapsuleFeatureView.EVENT_ON_CARD_READY_TO_KILL);
		this._fEnemiesDeathsAnimationsById_obj = {};

		let lEnemiesInfo_arr = this._fAffectedEnemiesInfo_obj_arr;
		for (let i=0; i < lEnemiesInfo_arr.length; i++)
		{
			let l_enm = APP.gameScreen.gameFieldController.getEnemy(lEnemiesInfo_arr[i].enemy.id);
			if(l_enm)
			{
				let lEnemyWidth_num = l_enm.getClickableRectangle().width;
				let lPosition_obj = APP.gameScreen.enemiesController.getEnemyPositionInTheFuture(l_enm.id);
				let lContainer_spr = this._generateEnemyPositionHighlightAnimation(lPosition_obj, lEnemyWidth_num, i*4*FRAME_RATE); // X-symbol animation for dead enemies
				this._fEnemiesDeathsAnimationsById_obj[l_enm.id] = 	lContainer_spr;
			}
		}
	}

	/**
	 * Creates Red Blow Swirl Lines connected with Card and the Enemies.
	 */
	_startShootingAnimations()
	{
		let lEnemiesInfo_arr = this._fAffectedEnemiesInfo_obj_arr;

		if (!Array.isArray(lEnemiesInfo_arr))
		{
			return
		}

		if (!this._fBlowLines_spr_arr)
		{
			this._fBlowLines_spr_arr = [];
		}

		if (!this._fFireTimers_t_arr)
		{
			this._fFireTimers_t_arr = [];
		}

		if (lEnemiesInfo_arr.length === 0) // in the case when two cards with the same enemies apeeared one after the other
		{
			this._fCardContainer_kccv.i_startOutroAnimation();
			this._fAffectedEnemiesInfo_obj_arr && this._startDestroyingAllFieldsAnimation();
		}

		for (let i=0; i < lEnemiesInfo_arr.length; i++)
		{
			let l_obj = lEnemiesInfo_arr[i];
			let lLastEnemy_bl = Boolean(i===lEnemiesInfo_arr.length-1);

			let lLine_spr = this._fMainAnimationContainer_spr.addChild(new Sprite());
			lLine_spr.textures = generate_blow_lines_texture();
			lLine_spr.visible = false;
			let lFinalPosition_obj = APP.gameScreen.gameFieldController.getEnemyPosition(l_obj.enemy.id);
			let lDistance_num = Utils.getDistance(this._fCardPosition_obj, lFinalPosition_obj);
			let lScale_num = lDistance_num / 350;

			lLine_spr.rotation = Math.atan2(lFinalPosition_obj.y-this._fCardPosition_obj.y, lFinalPosition_obj.x-this._fCardPosition_obj.x) 
			lLine_spr.animationSpeed = 0.35;
			lLine_spr.blendMode = PIXI.BLEND_MODES.ADD;
			lLine_spr.scale.set(lScale_num*3, Math.min(lScale_num*3, 5));
			lLine_spr.anchor.set(0, 0.5);
			lLine_spr.on('animationend', ()=>{
				this.emit(KillerCapsuleFeatureView.EVENT_ON_TARGET_HIT, { hitInfo: l_obj });
				this._fBlowLines_spr_arr.splice(this._fBlowLines_spr_arr.indexOf(lLine_spr), 1);
				lLine_spr && lLine_spr.destroy();

				this._startDestroyingFieldAnimation(l_obj.enemy.id, false);
			});

			this._fBlowLines_spr_arr.push(lLine_spr);

			let l_t = new Timer(()=>{
				lLine_spr.show();
				lLine_spr.play();
				lLastEnemy_bl && this._fCardContainer_kccv && this._fCardContainer_kccv.i_startOutroAnimation() && this._startDestroyingAllFieldsAnimation();
				this.emit(KillerCapsuleFeatureView.EVENT_ON_INSTAKILL_BEAM_SFX);
			}, (i+1)*10*FRAME_RATE, false);
			this._fFireTimers_t_arr.push(l_t);
		}
	}

	/**
	 * Depending on given bool argument creates white or red smoke under the card and animates it.
	 * @param {Boolean} aOptIsRedSmoke_bl 
	 */
	_startSmokeAnimation(aOptIsRedSmoke_bl=false)
	{
		if (!this._fSmokes_spr_arr)
		{
			this._fSmokes_spr_arr = [];
		}
		let lSmoke_spr = this._fMainAnimationContainer_spr.addChild(new Sprite());
		lSmoke_spr.textures = !aOptIsRedSmoke_bl ? generate_grey_smoke_texture() : generate_red_smoke_texture();
		lSmoke_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lSmoke_spr.animationSpeed = 0.65;
		lSmoke_spr.scale.set(8);
		lSmoke_spr.zIndex = -1;

		this._fSmokes_spr_arr.push(lSmoke_spr);
		lSmoke_spr.on("animationend", ()=>{
			this._fSmokes_spr_arr.splice(this._fSmokes_spr_arr.indexOf(lSmoke_spr), 1);
			lSmoke_spr && lSmoke_spr.destroy();
		});

		lSmoke_spr.play();
	}

	/**
	 * Depending on given bool argument creates white or red blast circle and animates it.
	 * @param {Boolean} aOptIsRedCircle_bl 
	 */
	_startBlastCircleAnimation(aOptIsRedCircle_bl=false)
	{
		if (!APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			return;
		}

		this._fBlastCirle_spr && this._fBlastCirle_spr.destroy();

		let lSpriteName_str = !aOptIsRedCircle_bl ? "awards/circle_blast" : "enemies/killer_capsule/red_circle_blast";
		this._fBlastCirle_spr = this._fMainAnimationContainer_spr.addChild(APP.library.getSprite(lSpriteName_str));
		this._fBlastCirle_spr.blendMode = PIXI.BLEND_MODES.SCREEN;
		this._fBlastCirle_spr.scale.set(0);
		this._fBlastCirle_spr.zIndex = -2;

		let lCircleScale_seq = [
			{
				tweens: [{prop: "scale.x", to: 10}, {prop: "scale.y", to: 10}],
				duration: 8*FRAME_RATE
			},
			{
				tweens: [{prop: "scale.x", to: 14}, {prop: "scale.y", to: 14}, {prop: "alpha", to: 0}],
				duration: 2*FRAME_RATE,
				onfinish: ()=>{
					this._fBlastCirle_spr && Sequence.destroy(Sequence.findByTarget(this._fBlastCirle_spr));
					this._fBlastCirle_spr && this._fBlastCirle_spr.destroy();
					this._fBlastCirle_spr = null;
				},
			},
		];

		Sequence.start(this._fBlastCirle_spr, lCircleScale_seq);
	}
	
	/**
	 * Generates X-symbol under enemy (by position) and animates it.
	 * @param {Object} aPostion_obj  Position on gameField
	 * @param {Number} aEnemyWidth_num Enemy width
	 * @param {Number} aOptDelay_num Optional. Delay in frame rate
	 * 
	 * @returns {Sprite}
	 */
	_generateEnemyPositionHighlightAnimation(aPostion_obj, aEnemyWidth_num, aOptDelay_num=0)
	{
		let lContainer_spr = this._fFieldAnimationContainer_spr.addChild(new Sprite());
		lContainer_spr.zIndex = 10;
		lContainer_spr.position.set(aPostion_obj.x, aPostion_obj.y+15);

		let lXSign_spr = lContainer_spr.addChild(APP.library.getSprite("enemies/killer_capsule/xsymbol"));
		lXSign_spr.hide();
		let lLineorbs_spr = lContainer_spr.addChild(APP.library.getSprite("enemies/killer_capsule/lineorbs"));
		lLineorbs_spr.blendMode = PIXI.BLEND_MODES.SCREEN;
		
		let lScale_num = (aEnemyWidth_num + 10) / lXSign_spr.width;
		lContainer_spr.scale.set(1*lScale_num, 0.7*lScale_num);

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			lXSign_spr.filters = [new GlowFilter(1, 1/lScale_num, 0, 0xffffff)];
		}
		let lSignIdleScale_seq = [
			{ tweens: [{prop: "scale.x", to: 1}, {prop: "scale.y", to: 1}], duration: 6*FRAME_RATE },
			{ tweens: [{prop: "scale.x", to: 0.75}, {prop: "scale.y", to: 0.75}], duration: 2.5*FRAME_RATE}
		];
		lSignIdleScale_seq[1].onfinish = Sequence.start.bind(this, lXSign_spr, lSignIdleScale_seq);

		let lSignScale_seq = [
			{ tweens: [], duration: 0, onfinish: lXSign_spr.show.bind(lXSign_spr)},
			{
				tweens: [{prop: "scale.x", from: 0, to: 1.2}, {prop: "scale.y", from: 0, to: 1.2}],
				duration: 13*FRAME_RATE,
				onfinish: Sequence.start.bind(this, lXSign_spr, lSignIdleScale_seq)
			},
		];

		let lLineOrbsIdle_seq = [
			{ tweens: [{prop: "scale.x", to: 1.3}, {prop: "scale.y", to: 1.3}], duration: 2*FRAME_RATE },
			{ tweens: [{prop: "scale.x", to: 3.2}, {prop: "scale.y", to: 3.2}], duration: 6*FRAME_RATE }
		];
		lLineOrbsIdle_seq[1].onfinish = Sequence.start.bind(this, lLineorbs_spr, lLineOrbsIdle_seq);

		let lLineorbsScale_seq = [
			{
				tweens: [{prop: "scale.x", from: 0, to: 3.5}, {prop: "scale.y", from: 0, to: 3.5}],
				duration: 13*FRAME_RATE,
				onfinish: Sequence.start.bind(this, lLineorbs_spr, lLineOrbsIdle_seq)
			},
		];

		Sequence.start(lXSign_spr, lSignScale_seq, aOptDelay_num);
		Sequence.start(lLineorbs_spr, lLineorbsScale_seq, 4*FRAME_RATE+aOptDelay_num);

		return lContainer_spr;
	}

	/**
	 * Deletes container from  this._fEnemiesDeathsAnimationsById_obj by enemie's ID.
	 * @param {Number} aId_num 
	 * @param {Boolean} aOptForce_bl 
	 */
	_startDestroyingFieldAnimation(aId_num, aOptForce_bl=false)
	{
		let lContainer_spr = this._fEnemiesDeathsAnimationsById_obj ? this._fEnemiesDeathsAnimationsById_obj[aId_num] : null;
		if (!lContainer_spr)
		{
			return;
		}

		Sequence.destroy(Sequence.findByTarget(lContainer_spr));
		for(let l_spr of lContainer_spr.children)
		{
			Sequence.destroy(Sequence.findByTarget(l_spr));
		}

		if (aOptForce_bl)
		{
			lContainer_spr && lContainer_spr.destroy();
		}
		else
		{
			let l_seq = [
				{
					tweens: [{prop: "scale.x", to: 0}, {prop: "scale.y", to: 0}],
					duration: 10*FRAME_RATE,
					onfinish: ()=>{
						Sequence.destroy(Sequence.findByTarget(lContainer_spr));
						lContainer_spr && lContainer_spr.destroy();
					}
				}
			];
			Sequence.start(lContainer_spr, l_seq, 5*FRAME_RATE);
		}
	}

	_startDestroyingAllFieldsAnimation()
	{
		for (let lId_num in this._fEnemiesDeathsAnimationsById_obj)
		{
			this._startDestroyingFieldAnimation(lId_num, true);
		}
		this._fEnemiesDeathsAnimationsById_obj = null;
	}

	/**
	 * Calls destroying gray background and destroys it's animation.
	 * @param {Boolean} aOptForce_bl 
	 */
	_completeFieldAnimation(aOptForce_bl=false)
	{
		if (!aOptForce_bl)
		{
			let lAlphaTween_t = new Tween(this._fBlackCover_spr, "alpha", 0.4, 0, 25*FRAME_RATE);
			lAlphaTween_t.on(Tween.EVENT_ON_FINISHED, ()=>{
				this._destroyDarkFieldAndInterrupt();
			});
			lAlphaTween_t.play();
		}
		else
		{
			this._destroyDarkFieldAndInterrupt();
		}
	}

	_destroyDarkField()
	{
		this._fBlackCover_spr && Tween.destroy(Tween.findByTarget(this._fBlackCover_spr));
		this._fBlackCover_spr && this._fBlackCover_spr.destroy();
		this._fBlackCover_spr = null;

		if (!this._fCardContainer_kccv && !this._fBlackCover_spr && APP.gameScreen.gameFieldController.killerFieldAnimationInfo.container)
		{
			APP.gameScreen.gameFieldController.killerFieldAnimationInfo.container.removeChild(this._fFieldAnimationContainer_spr);
			this._fFieldAnimationContainer_spr && this._fFieldAnimationContainer_spr.destroy();
			this._fFieldAnimationContainer_spr = null;
		}
	}

	_destroyDarkFieldAndInterrupt()
	{
		this._destroyDarkField();
		this._interrupt();
	}

	_interrupt()
	{
		this._fAffectedEnemiesInfo_obj_arr && this._fAffectedEnemiesInfo_obj_arr.forEach(lHitInfo => {
			this.emit(KillerCapsuleFeatureView.EVENT_ON_TARGET_HIT, { hitInfo: lHitInfo });
		});
		
		this._fFireExplosion_spr && Sequence.destroy(Sequence.findByTarget(this._fFireExplosion_spr));
		this._fFireExplosion_spr && this._fFireExplosion_spr.destroy();
		this._fFireExplosion_spr = null;

		this._fCardPosition_obj = null;

		if (Array.isArray(this._fBlowLines_spr_arr))
		{
			for (let l_spr of this._fBlowLines_spr_arr)
			{
				l_spr && l_spr.destroy();
			}
		}
		this._fBlowLines_spr_arr = null;

		if (Array.isArray(this._fCrossLights_spr_arr))
		{
			for (let l_spr of this._fCrossLights_spr_arr)
			{
				l_spr && Sequence.destroy(Sequence.findByTarget(l_spr));
				l_spr && l_spr.destroy();
			}
		}
		this._fCrossLights_spr_arr = null;

		if (Array.isArray(this._fFireTimers_t_arr))
		{
			for (let l_t of this._fFireTimers_t_arr)
			{
				l_t && l_t.destructor();
			}
		}
		this._fFireTimers_t_arr = null;

		for (let lId_num in this._fEnemiesDeathsAnimationsById_obj)
		{
			this._startDestroyingFieldAnimation(lId_num, true);
		}
		this._fEnemiesDeathsAnimationsById_obj = null;

		this._fCardContainer_kccv && this._fCardContainer_kccv.destroy();
		this._fCardContainer_kccv = null;

		this._fRedFlare_spr && Tween.destroy(Tween.findByTarget(this._fRedFlare_spr));
		this._fRedFlare_spr && Sequence.destroy(Sequence.findByTarget(this._fRedFlare_spr));
		this._fRedFlare_spr && this._fRedFlare_spr.destroy();
		this._fRedFlare_spr = null;

		if (Array.isArray(this._fSmokes_spr_arr))
		{
			for (let l_spr of this._fSmokes_spr_arr)
			{
				
				l_spr && l_spr.destroy();
			}
		}

		this._destroyDarkField();

		this._fBlastCirle_spr && Sequence.destroy(Sequence.findByTarget(this._fBlastCirle_spr));
		this._fBlastCirle_spr && this._fBlastCirle_spr.destroy();
		this._fBlastCirle_spr = null;

		this._fMainAnimationContainer_spr && this._fMainAnimationContainer_spr.destroy();
		this._fMainAnimationContainer_spr = null;

		Sequence.destroy(Sequence.findByTarget(this));

		this.destroy();
	}

	destroy()
	{
		super.destroy();

		this._fAffectedEnemiesInfo_obj_arr = null;
	}
}

export default KillerCapsuleFeatureView;