import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import * as Easing from '../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import CommonEffectsManager from '../../CommonEffectsManager';
import { Utils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import EternalCryogunSmoke from '../cryogun/EternalCryogunSmoke';
import Timer from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';

const Z_INDEXES = {
	ETERNAL_PLASMA_SMOKE: 	200 - 62,
	BLUE_FLARE:				200 - 100,
	DIE_SMOKE: 				200 - 112,
	BLUE_CIRCLE: 			200 - 129,
	TRANSITION_SMOKE_WHITE:	200 - 106,
	TRANSITION_SMOKE_BLUE: 	200 - 105,
	TRANSITION_SMOKE_GREY: 	200 - 126
}

class RailgunHitEffect extends Sprite {

	static get EVENT_ON_ANIMATION_END()		{ return 'EVENT_ON_ANIMATION_END'; }

	constructor()
	{
		super();

		this._fBlueFlare_sprt = null;
		this._fPlasmaSmoke_eps = null;
		this._fTransitionSmokeWhite_sprt = null;
		this._fTransitionSmokeBlue_sprt = null;
		this._fTransitionSmokeGrey_sprt = null;
		this._fBlueCircle_sprt = null;

		this._createView();
	}

	_createView()
	{
		if(APP.profilingController.info.isVfxDynamicProfileValueMediumOrGreater)
		{
			this._addPlasmaSmoke();
			this._addBlueFlare();
			this._addDieSmoke();
		}
		else
		{
			let l_t = new Timer(()=>this._onAnimationCompleted(), 57*2*16.7);
		}

		this._addTransitionSmokes();
		this._addBlueCircle();
	}

	_addBlueFlare()
	{
		let lBlueFlare_sprt = this.addChild(APP.library.getSprite('common/blue_flare'));
		lBlueFlare_sprt.zIndex = Z_INDEXES.BLUE_FLARE;
		lBlueFlare_sprt.anchor.set(213/437, 135/271);
		lBlueFlare_sprt.blendMode = PIXI.BLEND_MODES.SCREEN;
		lBlueFlare_sprt.scale.set(4*0.016);

		let seq = [
			{
				tweens: [
					{ prop: 'scale.x', to: 4*0.54 },
					{ prop: 'scale.y', to: 4*0.54 }
				],
				duration: 3*2*16.7
			},
			{
				tweens: [],
				duration: 3*2*16.7
			},
			{
				tweens: [
					{ prop: 'scale.x', to: 0 },
					{ prop: 'scale.y', to: 0 }
				],				
				duration: 8*2*16.7,
				ease: Easing.sine.easeInOut,
				onfinish: () => {
					lBlueFlare_sprt.destroy();				
				}
			}
		];

		this._fBlueFlare_sprt = lBlueFlare_sprt;
		Sequence.start(lBlueFlare_sprt, seq);
	}

	_addDieSmoke()
	{
		let smoke = this.addChild(new Sprite);
		smoke.zIndex = Z_INDEXES.DIE_SMOKE;
		smoke.textures = CommonEffectsManager.getDieSmokeUnmultTextures();
		smoke.anchor.set(0.57, 0.81);
		smoke.scale.set(2);
		smoke.rotation = Utils.gradToRad(-20);
		smoke.tint = 0xA8F2FF/*0xCBEAEF*/;
		smoke.on('animationend', () => {
			smoke.destroy();
			this._onAnimationCompleted();
		})
		smoke.play();
	}

	_addPlasmaSmoke()
	{
		let smoke = new EternalCryogunSmoke(true, 'screen');
		this.addChild(smoke);
		smoke.zIndex = Z_INDEXES.ETERNAL_PLASMA_SMOKE;
		
		smoke.scale.set(2*0.54);
		smoke.alpha = 0;
		let seq = [
			{
				tweens: [
					{ prop: 'alpha', to: 1 },					
				],
				duration: 5*2*16.7
			},
			{
				tweens: [],
				duration: 13*2*16.7
			},
			{
				tweens: [
					{ prop: 'alpha', to: 0 }
				],
				duration: 6*2*16.7,
				onfinish: () => {
					smoke.destroy();
				}
			}
		];

		this._fPlasmaSmoke_eps = smoke;
		Sequence.start(smoke, seq);
	}

	_addTransitionSmokes()
	{
		//white...
		let smokeWhite = this.addChild(APP.library.getSprite('common/transition_smoke_fx_unmult'));
		smokeWhite.zIndex = Z_INDEXES.TRANSITION_SMOKE_WHITE;
		smokeWhite.blendMode = PIXI.BLEND_MODES.SCREEN;
		smokeWhite.scale.set(4*0.165);
		smokeWhite.alpha = 0;
		smokeWhite.rotation = Utils.gradToRad(-82.1);

		let seqWhite = [
			{
				tweens: [
					{ prop: 'alpha', to: 1}
				],
				duration: 3*2*16.7
			},
			{
				tweens: [
					{ prop: 'alpha', to: 0 }
				],
				duration: 26*2*16.7,
				onfinish: () => {
					smokeWhite.destroy();
				}
			}
		];
		smokeWhite.scaleTo(4*0.34, 16*2*16.7);
		smokeWhite.rotateTo(Utils.gradToRad(-111.1), 29*2*16.7);

		this._fTransitionSmokeWhite_sprt = smokeWhite;
		Sequence.start(smokeWhite, seqWhite);
		//...white

		//blue...
		let smokeBlue = this.addChild(APP.library.getSprite('common/transition_smoke_fx_unmult')); 
		smokeBlue.zIndex = Z_INDEXES.TRANSITION_SMOKE_BLUE;
		smokeBlue.tint = 0x73E8FD;
		smokeBlue.blendMode = PIXI.BLEND_MODES.MULTIPLY
		smokeBlue.scale.set(4*0.127);
		smokeBlue.alpha = 0;
		smokeBlue.rotation = Utils.gradToRad(95.8);

		let seqBlue = [
			{
				tweens: [
					{ prop: 'scale.x', to: 4*0.15},
					{ prop: 'scale.y', to: 4*0.15},
					{ prop: 'alpha', to: 1}
				],
				duration: 7*2*16.7
			},
			{
				tweens: [
					{ prop: 'alpha', to: 0 }
				],
				duration: 22*2*16.7,
				onfinish: () => {
					smokeBlue.destroy();
				}
			}
		];
		smokeBlue.rotateTo(Utils.gradToRad(129.6), 29*2*16.7);

		this._fTransitionSmokeBlue_sprt = smokeBlue;
		Sequence.start(smokeBlue, seqBlue);
		//...blue

		//grey...
		let smokeGrey = this.addChild(APP.library.getSprite('common/transition_smoke_fx_unmult'));
		smokeGrey.zIndex = Z_INDEXES.TRANSITION_SMOKE_GREY;
		smokeGrey.tint = 0x757575;
		smokeGrey.blendMode = PIXI.BLEND_MODES.MULTIPLY
		smokeGrey.scale.set(4*0.146);
		smokeGrey.alpha = 0;
		smokeGrey.rotation = Utils.gradToRad(-82.1);		

		let seqGrey = [
			{
				tweens: [
					{ prop: 'alpha', to: 1}
				],
				duration: 7*2*16.7
			},
			{
				tweens: [
					{ prop: 'alpha', to: 0 }
				],
				duration: 22*2*16.7,
				onfinish: () => {
					smokeGrey.destroy();
				}
			}
		];
		smokeGrey.scaleTo(4*0.353, 29*2*16.7);
		smokeGrey.rotateTo(Utils.gradToRad(-111.1), 29*2*16.7);

		this._fTransitionSmokeGrey_sprt = smokeGrey;
		Sequence.start(smokeGrey, seqGrey);
		//...grey

	}

	_addBlueCircle()
	{
		let lBlueCircle_sprt = this.addChild(APP.library.getSpriteFromAtlas('weapons/Railgun/blue_circle'));
		lBlueCircle_sprt.anchor.y = 139/167;
		lBlueCircle_sprt.zIndex = Z_INDEXES.BLUE_CIRCLE;
		lBlueCircle_sprt.scale.set(0);

		let seq = [
			{
				tweens: [],
				duration: 1*2*16.7,
				onfinish: () => {
					lBlueCircle_sprt.scaleTo(1, 6*2*16.7);
				}
			},
			{
				tweens: [],
				duration: 2*2*16.7
			},
			{
				tweens: [
					{ prop: 'alpha', to: 0 }
				],
				duration: 8*2*16.7,
				onfinish: () => {
					lBlueCircle_sprt.destroy();
				}
			}
		];

		this._fBlueCircle_sprt = lBlueCircle_sprt;
		Sequence.start(lBlueCircle_sprt, seq);
	}

	_onAnimationCompleted()
	{
		this.emit(RailgunHitEffect.EVENT_ON_ANIMATION_END);
		this.destroy();
	}

	destroy()
	{
		Sequence.destroy(Sequence.findByTarget(this._fBlueFlare_sprt));
		Sequence.destroy(Sequence.findByTarget(this._fPlasmaSmoke_eps));
		Sequence.destroy(Sequence.findByTarget(this._fTransitionSmokeWhite_sprt));
		Sequence.destroy(Sequence.findByTarget(this._fTransitionSmokeBlue_sprt));
		Sequence.destroy(Sequence.findByTarget(this._fTransitionSmokeGrey_sprt));
		Sequence.destroy(Sequence.findByTarget(this._fBlueCircle_sprt));		
		
		this._fBlueFlare_sprt && this._fBlueFlare_sprt.destroy();
		this._fBlueFlare_sprt = null;

		this._fPlasmaSmoke_eps && this._fPlasmaSmoke_eps.destroy();
		this._fPlasmaSmoke_eps = null;

		this._fTransitionSmokeWhite_sprt = null;
		this._fTransitionSmokeBlue_sprt = null;
		this._fTransitionSmokeGrey_sprt = null;
		this._fBlueCircle_sprt = null;

		this.removeAllListeners();

		super.destroy();
	}
}

export default RailgunHitEffect;