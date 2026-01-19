import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../../../shared/src/CommonConstants';
import Sprite from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { Utils } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import CommonEffectsManager from '../../../../../main/CommonEffectsManager';
import Sequence from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';

const PARTS_DESCR = [
	{
		scale: {x: 1, y: 1},
		position: {x: 10, y: -5},
		flyOut: {deltaX: 700, deltaY: 80, duration: 33*FRAME_RATE}

	},
	{
		scale: {x: 0.74, y: 0.58},
		position: {x: -20+10, y: 10-5},
		flyOut: {deltaX: 750, deltaY: -220, duration: 26*FRAME_RATE}
	},
	{
		scale: {x: 0.95, y: -1.16},
		position: {x: -5+10, y: -12-5},
		flyOut: {deltaX: 810, deltaY: -305, duration: 29*FRAME_RATE}
	}
]

class DragonDamagePartsAnimation extends Sprite
{
	startAnimation()
	{
		this._startAnimation();
	}

	constructor()
	{
		super();

		CommonEffectsManager.getGroundSmokeTextures();

		this._fTrSmoke_sprt = null;
	}

	_startAnimation()
	{
		// debug...
		// let grb = this.addChild(new PIXI.Graphics());
		// grb.beginFill(0x000000).drawCircle(0, 0, 50).endFill();
		// ...debug

		for (let i=0; i<PARTS_DESCR.length; i++)
		{
			let lPartDescr_obj = PARTS_DESCR[i];
			this._addPartAnimation(lPartDescr_obj.position, lPartDescr_obj.scale, lPartDescr_obj.flyOut);
		}

		let lProfilingInfo = APP.profilingController.info;
		if (lProfilingInfo.isVfxProfileValueLowerOrGreater)
		{
			this._addGroundSmokeAnimation();
		}
		
		if (lProfilingInfo.isVfxProfileValueMediumOrGreater)
		{
			this._addTransitionSmokeAnimation();
		}

		// debug...
		// let gr = this.addChild(new PIXI.Graphics());
		// gr.beginFill(0xff0000).drawCircle(0, 0, 3).endFill();
		// ...debug
	}

	_addPartAnimation(aPos_obj, aScale_obj, aFlyOutDescr_obj)
	{
		let lPart_sprt = this.addChild(APP.library.getSpriteFromAtlas('boss_mode/damage/dragon_part'));
		lPart_sprt.scale.set(aScale_obj.x, aScale_obj.y);
		lPart_sprt.position.set(aPos_obj.x, aPos_obj.y);
		lPart_sprt.moveTo(aPos_obj.x+aFlyOutDescr_obj.deltaX, aPos_obj.y+aFlyOutDescr_obj.deltaY, aFlyOutDescr_obj.duration, undefined, () => { this._onPartAnimationCompleted(lPart_sprt); });
		lPart_sprt.rotateTo(Utils.gradToRad(360*2), aFlyOutDescr_obj.duration);
	}

	_onPartAnimationCompleted(aPart_sprt)
	{
		aPart_sprt.destroy();

		this._tryToCompleteAnimation();
	}

	_addGroundSmokeAnimation()
	{
		let textures = CommonEffectsManager.textures['groundSmoke'];
		let groundSmoke = this.addChild(new Sprite);
		groundSmoke.blendMode = PIXI.BLEND_MODES.SCREEN;
		groundSmoke.textures = textures;

		groundSmoke.rotation = Utils.gradToRad(90);
		groundSmoke.x = 10;
		groundSmoke.scale.x = 2;
		groundSmoke.scale.y = 2;

		groundSmoke.play();
		groundSmoke.once('animationend', (e) =>{			
			groundSmoke.destroy();
			this._tryToCompleteAnimation();
			
		});
	}

	_addTransitionSmokeAnimation()
	{
		let lTransitionSmoke_sprt = this._fTrSmoke_sprt = this.addChild(APP.library.getSprite('common/transition_smoke_fx_unmult'));
		lTransitionSmoke_sprt.blendMode = PIXI.BLEND_MODES.SCREEN;
		lTransitionSmoke_sprt.scale.set(-0.7, 0.7);
		lTransitionSmoke_sprt.x = 10;

		let l_seq = [
			{
				tweens: [
					{ prop: 'scale.x', to: -0.7*1.8 },
					{ prop: 'scale.y', to: 0.7*1.8},
					{ prop: 'alpha', to: 0},
					{ prop: 'rotation', to: Utils.gradToRad(-24) }
				],
				duration: 22*FRAME_RATE,
				onfinish: () => { 
									Sequence.destroy(Sequence.findByTarget(lTransitionSmoke_sprt));
									lTransitionSmoke_sprt.destroy();

									this._tryToCompleteAnimation(); 
								}
			}
		]
		Sequence.start(lTransitionSmoke_sprt, l_seq);
	}

	_tryToCompleteAnimation()
	{
		if (this.children.length == 0)
		{
			this.destroy();
		}
	}

	destroy()
	{
		let lTransitionSmoke_sprt = this._fTrSmoke_sprt;
		if (lTransitionSmoke_sprt)
		{
			Sequence.destroy(Sequence.findByTarget(lTransitionSmoke_sprt));
		}
		this._fTrSmoke_sprt = null;

		super.destroy();
	}
}

export default DragonDamagePartsAnimation