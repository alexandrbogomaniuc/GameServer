import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import * as Easing from '../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../shared/src/CommonConstants';
import { Utils } from "../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils";
import { ColorOverlayFilter, GlowFilter, ColorReplaceFilter } from "../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Filters";
import { Tween } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import { AtlasSprite, Sprite } from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import AtlasConfig from '../../../config/AtlasConfig';

let all_enemies_avatars;
function generate_all_enemies_avatars_map()
{
	if (!all_enemies_avatars)
	{
		all_enemies_avatars = AtlasSprite.getMapFrames(APP.library.getAsset("enemies/all_enemies_avatars"), AtlasConfig.AllEnemiesAvatars, "");
	}

	return all_enemies_avatars;
}


class KillerCapsuleCardView extends Sprite
{
	static get EVENT_ON_CARD_LANDED() 						{ return 'onIntroCardLanded'; }
	static get EVENT_ON_CARD_DISAPPEARED() 					{ return 'onCardDisappeared'; }
	static get EVENT_ON_CARD_READY_TO_KILL() 				{ return 'onCardReadyToKill'; }

	i_startAnimation()
	{
		this._startAnimation();
	}

	i_startOutroAnimation()
	{
		this._startOutroAnimation();
	}

	i_setCardEnemyTypeId(aValue_num)
	{
		this._fFinalEnemyTypeId_num = aValue_num;
	}

	i_startCardRotationAnimation()
	{
		this._startCardRotationAnimation();
	}

	constructor(aOptSide_num=-1)
	{
		super();

		this._fCardView_spr = null;
		this._fCrossLights_spr_arr = null;

		this._fCardContent_spr = null;
		this._fCardContentColoredDuplicate_spr = null;
		this._fWhiteGlowBack_spr = null;
		this._fFrame_spr = null;
		this._fSignOfCardPositionSide_num = aOptSide_num; // -1 if the card is on the left side; 1 if the side is right
		
		this.scale.set(0);
	}

	_initCardContainer()
	{
		this._fWhiteGlowBack_spr = this.addChild(APP.library.getSprite("enemies/killer_capsule/glow_card"));
		this._fWhiteGlowBack_spr.blendMode = PIXI.BLEND_MODES.ADD;
		this._fWhiteGlowBack_spr.scale.set(1.1);
		this._fWhiteGlowBack_spr.zIndex = -3;

		this._fCardView_spr = this.addChild(APP.library.getSprite("enemies/killer_capsule/card_background"));

		// FRAME, COVER AND GLOWING BACKGROUND...
		this._fFrame_spr = this._fCardView_spr.addChild(APP.library.getSprite("enemies/killer_capsule/frame"));
		this._fFrame_spr.blendMode = PIXI.BLEND_MODES.ADD;
		this._fFrame_spr.alpha = 0;

		this._fCardCover_spr = this.addChild(APP.library.getSprite("enemies/killer_capsule/glow_card"));
		this._fCardCover_spr.blendMode = PIXI.BLEND_MODES.ADD;
		this._fCardCover_spr.alpha = 0.7;

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._fCardCover_spr.filters = [new ColorOverlayFilter(0xFF0000, 0.45)];
		}
		// ...FRAME, COVER AND GLOWING BACKGROUND

		this.convertSubtreeTo3d(); //for proper projection of all children
	}

	_startAnimation()
	{
		this._initCardContainer();

		this._changeCardEnemy();
		this._startCardIntroAnimation();
	}

	_startCardIntroAnimation()
	{
		if (!this._fCardView_spr)
		{
			this._initCardContainer();
		}

		this._startFlyingAndTransformingAnimation(this._onCardIntroCompleted.bind(this));

		let lCoverAlpha_seq = [
			{
				tweens: [{prop: "alpha", to: 0}],
				duration: 13*FRAME_RATE,
				ease: Easing.quadratic.easeIn,
				onfinish: ()=>{
					this._fCardCover_spr.filters = null;
				},
			}
		];

		Sequence.start(this._fCardCover_spr, lCoverAlpha_seq);
	}

	_onCardIntroCompleted()
	{
		this.emit(KillerCapsuleCardView.EVENT_ON_CARD_LANDED, {isInit: true});
		this._startCardLandAnimation();
	}

	_startFlyingAndTransformingAnimation(aOptCallback_fn, aOptFinalScale_num=0.9)
	{
		if (!aOptCallback_fn)
		{
			aOptCallback_fn = this._onCardOutroCompleted.bind(this);
		}

		let lCardScaleSeq_arr = [
			{
				tweens: [{prop: "scale.x", to: 1.75}, {prop: "scale.y", to: 1.75}, {prop: "position.y", to: -30}],
				duration: 7*FRAME_RATE,
				ease: Easing.cubic.easeIn
			},
			{
				tweens: [{prop: "scale.x", to: aOptFinalScale_num}, {prop: "scale.y", to: aOptFinalScale_num}, {prop: "position.y", to: 0}],
				duration: 8*FRAME_RATE,
				onfinish: ()=>{
					aOptCallback_fn && aOptCallback_fn.call();
				},
			},
			{
				tweens: [{prop: "scale.x", to: 1}, {prop: "scale.y", to: 1}],
				duration: 6*FRAME_RATE
			}
		];

		let lCardTransformSeq_arr = [
			{
				tweens: [
					{prop: "euler.x", to: Math.PI/5},
					{prop: "euler.y", to: 0.3490658503988659*this._fSignOfCardPositionSide_num}, //Utils.gradToRad(20)
					{prop: "euler.z", to: 0.3490658503988659*this._fSignOfCardPositionSide_num} //Utils.gradToRad(20)
				],
				duration: 7*FRAME_RATE,
				ease: Easing.cubic.easeOut
			},
			{
				tweens: [{prop: "euler.x", to: 0}, {prop: "euler.y", to: -Math.PI/6}, {prop: "euler.z", to: 0}],
				duration: 7*FRAME_RATE,
				ease: Easing.cubic.easeIn
			},
			{
				tweens: [{prop: "euler.y", to: 0}],
				duration: 9*FRAME_RATE,
				ease: Easing.cubic.easeInOut
			},
		];
		
		Sequence.start(this, lCardScaleSeq_arr);
		Sequence.start(this, lCardTransformSeq_arr);
	}

	
	_startCardLandAnimation()
	{
		// GLOW BACKGROUND...
		let lGlowBackgroundScale_seq = [
			{
				tweens: [{prop: "scale.x", to: 2}, {prop: "scale.y", to: 2}],
				duration: 4*FRAME_RATE,
			},
			{
				tweens: [{prop: "scale.x", to: 3}, {prop: "scale.y", to: 3}, {prop: "alpha", to: 0}],
				duration: 4*FRAME_RATE
			},
			{
				tweens: [],
				duration: 4*FRAME_RATE,
				onfinish: ()=>{
					this._startCardRotationAnimation();
				}, 
			},
		];

		Sequence.start(this._fWhiteGlowBack_spr, lGlowBackgroundScale_seq);
		// ...GLOW BACKGROUND
	}

	_startCardRotationAnimation()
	{
		if (!this._fCardView_spr)
		{
			this._initCardContainer();
		}
		
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this.filters = [new GlowFilter({color: 0xFF0000, outerStrength: 1.3, innerStrength: 0, knockout: false, distance: 20})];
		}

		let lFlip_seq = [
			{
				tweens: [{prop: "euler.y", to: -Math.PI/2}],
				duration: 2.5*FRAME_RATE,
				ease: Easing.cubic.easeOut,
				onfinish: ()=>{
					this._changeCardEnemy(1+Math.ceil(Math.random()*23));
				},
			},
			{ tweens: [{prop: "euler.y", to: -Math.PI}], duration: 2.5*FRAME_RATE, ease: Easing.cubic.easeIn },
			{
				tweens: [{prop: "euler.y", to: -Math.PI*3/2}],
				duration: 2.5*FRAME_RATE,
				ease: Easing.cubic.easeOut,
				onfinish: ()=>{
					this._changeCardEnemy(1+Math.ceil(Math.random()*23));
				},
			},
			{ tweens: [{prop: "euler.y", to: -Math.PI*2}], duration: 2.5*FRAME_RATE, ease: Easing.cubic.easeIn },
			{
				tweens: [{prop: "euler.y", to: -Math.PI*5/2}],
				duration: 2.5*FRAME_RATE,
				ease: Easing.cubic.easeOut,
				onfinish: ()=>{
					this._changeCardEnemy(this._fFinalEnemyTypeId_num);
				},
			},
			{ tweens: [{prop: "euler.y", to: -Math.PI*8/3}], duration: 2*FRAME_RATE, ease: Easing.cubic.easeIn },
			{
				tweens: [{prop: "scale.x", to: 1.4}, {prop: "scale.y", to: 1.4}, {prop: "euler.y", to: -Math.PI*3}],
				duration: 6*FRAME_RATE,
				ease: Easing.cubic.easeIn,
				onfinish: ()=>{
					let lAlphaTween_t = new Tween(this._fCardCover_spr, "alpha", 1, 0, 15*FRAME_RATE)
					lAlphaTween_t.play();
				}
			},
			{
				tweens: [{prop: "scale.x", to: 1.55}, {prop: "scale.y", to: 1.55}],
				duration: 2*FRAME_RATE,
				onfinish: ()=>{
					this._startEnemiesKillFieldAnimation();
				}
			},
			{
				tweens: [{prop: "scale.x", to: 0.95}, {prop: "scale.y", to: 0.95}],
				duration: 4*FRAME_RATE,
				ease: Easing.exponential.easeIn,
				onfinish: ()=>{
					this.emit(KillerCapsuleCardView.EVENT_ON_CARD_LANDED);
					this._startBlowByCompletionTheCardShow();

					// reset card transform			
					this.euler.x = 0;
					this.euler.y = 0;
					this._fCardContent_spr.scale.set(1);

					this._startCardIdleAnimation();
				},
			}
		];

		let lRotation_seq = [
			{ tweens: [{prop: "rotation", to: Utils.gradToRad(Utils.getRandomWiggledValue(-1.5, 3))}], duration: 10*FRAME_RATE},
			{ tweens: [{prop: "rotation", to: 0}], duration: 7*FRAME_RATE},
		];

		Sequence.start(this, lRotation_seq);
		Sequence.start(this, lFlip_seq);
	}

	_changeCardEnemy(aOptEnemyId_num)
	{
		this._fCardContent_spr && this._fCardContent_spr.destroy();

		let lEnemiesTextures_t_arr = generate_all_enemies_avatars_map();

		if (!aOptEnemyId_num && aOptEnemyId_num !== 0)
		{
			this._fCardContent_spr = this._fCardView_spr.addChild(APP.library.getSprite("enemies/killer_capsule/xsymbol"));
		}
		else
		{
			let l_spr = new Sprite();
			l_spr.texture = lEnemiesTextures_t_arr[aOptEnemyId_num];
			this._fCardContent_spr = this._fCardView_spr.addChild(l_spr);
			this._fCardContent_spr.scale.set(-1, 1);
		}
	}

	_startEnemiesKillFieldAnimation()
	{
		this.emit(KillerCapsuleCardView.EVENT_ON_CARD_READY_TO_KILL);
	}

	_startCardIdleAnimation()
	{
		if (!APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			return
		}

		Sequence.destroy(Sequence.findByTarget(this._fCardView_spr));

		let lContainerScale_seq = [
			{
				tweens :[
					{prop: "scale.x", to: 1},
					{prop: "scale.y", to: 1},
				],
				duration: 20*FRAME_RATE,
			},
			{
				tweens :[
					{prop: "scale.x", to: 1.1},
					{prop: "scale.y", to: 1.1},
				],
				duration: 10*FRAME_RATE,
			}
		];

		let lCardRotation_seq = [	
			{
				tweens: [{prop: "euler.x", to: Utils.gradToRad(Utils.getRandomWiggledValue(-3, 6))},{prop: "euler.y", to: Utils.gradToRad(Utils.getRandomWiggledValue(-3, 6))},],
				duration: 20*FRAME_RATE
			},
		];

		let lContainerPosition_seq = [
			{
				tweens :[
					{prop: "position.x", to: Utils.getRandomWiggledValue(-1, 2)},
					{prop: "position.y", to: Utils.getRandomWiggledValue(-1, 2)},
				],
				duration: 20*FRAME_RATE,
				onfinish: this._startCardIdleAnimation.bind(this)
			}
		];

		Sequence.start(this, lContainerScale_seq);
		Sequence.start(this, lContainerPosition_seq);
		Sequence.start(this._fCardView_spr, lCardRotation_seq);
		
		if (!this._fCardContentColoredDuplicate_spr)
		{
			this._fCardContentColoredDuplicate_spr = this._fCardView_spr.addChild(this._fCardContent_spr.clone());
			let l_crf = new ColorReplaceFilter(0x888888, 0xE90B0B, 1);
			l_crf.blendMode = PIXI.BLEND_MODES.ADD;
			this._fCardContentColoredDuplicate_spr.filters = [l_crf];
		}

		let lAlphaTween_t = new Tween(this._fCardContentColoredDuplicate_spr, "alpha", 1, 0, 15*FRAME_RATE)
		lAlphaTween_t.play();
	}

	_startBlowByCompletionTheCardShow()
	{
		this._fFrame_spr.alpha = 1;

		// GLOW BACKGROUND...
		this._fWhiteGlowBack_spr.alpha = 1;
		this.filters = null;
		let lGlowBackgroundScale_seq = [
			{
				tweens: [{prop: "scale.x", from: 1, to: 1.2}, {prop: "scale.y", from: 1, to: 1.2}],
				duration: 8*FRAME_RATE,
			},
			{
				tweens: [{prop: "scale.x", to: 0.8}, {prop: "scale.y", to: 0.8}],
				duration: 4*FRAME_RATE,
			},
			{
				tweens: [{prop: "scale.x", from: 0.5, to: 1.1}, {prop: "scale.y", from: 0.5, to: 1.1}],
				duration: 50*FRAME_RATE,
				ease: Easing.sine.easeOut,
			},
		];

		Sequence.start(this._fWhiteGlowBack_spr, lGlowBackgroundScale_seq);
		// ...GLOW BACKGROUND
	}

	_startOutroAnimation()
	{
		if (!this._fCardView_spr)
		{
			this._initCardContainer();
			this._changeCardEnemy();
		}

		this._startFlyingAndTransformingAnimation(this._onCardOutroCompleted.bind(this), 0);
	}

	_onCardOutroCompleted()
	{
		this.emit(KillerCapsuleCardView.EVENT_ON_CARD_DISAPPEARED);

		this.destroy();
	}

	_interrupt()
	{
		Sequence.destroy(Sequence.findByTarget(this));
		
		this._fCardCover_spr && Tween.destroy(Tween.findByTarget(this._fCardCover_spr));
		this._fCardCover_spr && Sequence.destroy(Sequence.findByTarget(this._fCardCover_spr));
		this._fCardCover_spr && this._fCardCover_spr.destroy();
		this._fCardCover_spr = null;
		
		this._fCardContent_spr && this._fCardContent_spr.destroy();
		this._fCardContent_spr = null;

		this._fCardContentColoredDuplicate_spr && Tween.destroy(Tween.findByTarget(this._fCardContentColoredDuplicate_spr));
		this._fCardContentColoredDuplicate_spr && this._fCardContentColoredDuplicate_spr.destroy();
		this._fCardContentColoredDuplicate_spr = null;

		this._fWhiteGlowBack_spr && Sequence.destroy(Sequence.findByTarget(this._fWhiteGlowBack_spr));
		this._fWhiteGlowBack_spr && this._fWhiteGlowBack_spr.destroy();
		this._fWhiteGlowBack_spr = null;

		this._fCardView_spr && Sequence.destroy(Sequence.findByTarget(this._fCardView_spr));
		this._fCardView_spr && this._fCardView_spr.destroy();
		this._fCardView_spr = null;
	}

	destroy()
	{
		this._interrupt();

		super.destroy();
	}
}

export default KillerCapsuleCardView;