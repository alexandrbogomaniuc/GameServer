
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import AtlasSprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import AtlasConfig from '../../../../config/AtlasConfig';
import { FRAME_RATE } from '../../../../../../shared/src/CommonConstants';
import { Sequence } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import { Utils } from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import Timer from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';

class BottomFlare extends Sprite
{
	static get EVENT_ON_ANIMATION_FINISH() { return "onAnimationFinish"; }

	startAnimation(aIsLastHand)
	{
		this._startAnimation(aIsLastHand);
	}

	stopAnimation()
	{
		this._stopAnimation();
	}

	interrupt()
	{
		this._interrupt();
	}

	constructor()
	{
		super();

		this._fFlayerNorm_spr = null;
		this._fFlayerAdd_spr = null;
		this._fAppearingFlayerTimer_t = null;
	}

	get flareNorm()
	{
		return this._fFlayerNorm_spr || (this._fFlayerNorm_spr = this._initFlareNorm());
	}

	_initFlareNorm()
	{
		let lFlareNorm_spr = this.addChild(APP.library.getSpriteFromAtlas("boss_mode/fire/bottom_flayer"));
		return lFlareNorm_spr;
	}

	get flareAdd()
	{
		return this._fFlayerAdd_spr || (this._fFlayerAdd_spr = this._initFlareAdd());
	}

	_initFlareAdd()
	{
		let lFlareAdd_spr = this.addChild(APP.library.getSpriteFromAtlas("boss_mode/fire/bottom_flayer"));
		lFlareAdd_spr.blendMode = PIXI.BLEND_MODES.ADD;
		return lFlareAdd_spr;
	}

	_startAnimation(aIsLastHand)
	{
		this.alpha = 1;
		
		if (aIsLastHand)
		{
			this.flareNorm.alpha = 0.77;
			this.flareNorm.scale.set( 2.587,  0.538);
			this.flareNorm.anchor.set(0.5, 0.5);

			this._startAddFlareAnimation(aIsLastHand);
		}
		else
		{
			this.flareNorm.alpha = 0.3;
			this.flareNorm.scale.set( 1.28,  5.527);
			this.flareNorm.anchor.set(0.5, 0);

			this._startFlayerNormFirstWiggle();
		
			this._fAppearingFlayerTimer_t = new Timer(() =>
			{
				Sequence.destroy(Sequence.findByTarget(this.flareNorm));
				this._startAddFlareAnimation();

				this._fAppearingFlayerTimer_t && this._fAppearingFlayerTimer_t.destructor();
				this._fAppearingFlayerTimer_t = null;
			}, 10 * FRAME_RATE);
		}
	}

	_startFlayerNormFirstWiggle()
	{
		Sequence.destroy(Sequence.findByTarget(this.flareNorm));
		let l_seq = [
			{
				tweens: [
					{ prop: 'alpha', to: Utils.getRandomWiggledValue(0.3, 0.13)},
					{ prop: 'scale.x', to: Utils.getRandomWiggledValue( 1.28, 0.5)},
					{ prop: 'scale.y', to: Utils.getRandomWiggledValue( 5.527, 0.5)}
				],
				duration: 4 * FRAME_RATE,
				onfinish: () =>
				{
					this._startFlayerNormWiggle();
				}
			}
		]

		Sequence.start(this.flareNorm, l_seq);
	}

	_startAddFlareAnimation(aIsLastHand)
	{
		if (aIsLastHand)
		{
			this.flareAdd.alpha = 0.99;
			this.flareAdd.scale.set( 2.369, 0.424);
			this.flareAdd.anchor.set(0.5, 0.5);
			
			this._startFlayerNormWiggle();
			this._startFlayerAddWiggle();
		}
		else
		{
			this.flareAdd.alpha = 0;
			this.flareAdd.scale.set(0.436, 5.641);
			this.flareAdd.anchor.set(0.5, 0);
	
			let lSeq_arr = [
				{tweens: [{ prop: "scale.x", to:  0.976 }, { prop: 'scale.y', to:  4.516}], duration: 1 * FRAME_RATE},
				{tweens: [
							{ prop: "scale.x", to:  2.587 }, 
							{ prop: 'scale.y', to:  0.538}, 
							{ prop: 'alpha', to: 0.77}, 
							{ prop: 'anchor.y', to: 0.5},
					], 
							duration: 5 * FRAME_RATE}
			];
			Sequence.start(this.flareNorm, lSeq_arr);
	
	
			let lSeqAdd_arr = [
				{tweens: [{ prop: "scale.x", to: 0.758 }, { prop: 'scale.y', to:  (4.63)}], duration: 1 * FRAME_RATE},
				{tweens: [
							{ prop: "scale.x", to:  2.369 }, 
							{ prop: 'scale.y', to:  0.424}, 
							{ prop: 'alpha', to: 0.99}, 
							{ prop: 'anchor.y', to: 0.5},
						], 
							duration: 5 * FRAME_RATE,
							onfinish: () =>
							{
								this._startFlayerNormWiggle();
								this._startFlayerAddWiggle();
							}
				}
	
			];
			Sequence.start(this.flareAdd, lSeqAdd_arr);
		}		
	}

	_startFlayerNormWiggle()
	{
		Sequence.destroy(Sequence.findByTarget(this._fFlayerNorm_spr));
		let l_seq = [
			{
				tweens: [
					{ prop: 'alpha', to: Utils.getRandomWiggledValue(0.77, 0.13) }
				],
				duration: 8 * FRAME_RATE,
				onfinish: () =>
				{
					this._startFlayerNormWiggle();
				}
			}
		]

		Sequence.start(this.flareNorm, l_seq);
	}

	_startFlayerAddWiggle()
	{
		Sequence.destroy(Sequence.findByTarget(this._fFlayerAdd_spr));
		let l_seq = [
			{
				tweens: [
					{ prop: 'alpha', to: Utils.getRandomWiggledValue(0.87, 0.13) }
				],
				duration: 8 * FRAME_RATE,
				onfinish: () =>
				{
					this._startFlayerAddWiggle();
				}
			}
		]

		Sequence.start(this.flareAdd, l_seq);
	}

	_stopAnimation()
	{
		let lAlphaSeq_arr = [
			{
				tweens: [{ prop: "alpha", to: 0 }], duration: 6 * FRAME_RATE, onfinish: () =>
				{
					this._interrupt();
					this.emit(BottomFlare.EVENT_ON_ANIMATION_FINISH);
				}
			}
		];
		Sequence.start(this, lAlphaSeq_arr);
	}

	_interrupt()
	{
		this._fAppearingFlayerTimer_t && this._fAppearingFlayerTimer_t.destructor();
		this._fAppearingFlayerTimer_t = null;

		Sequence.destroy(Sequence.findByTarget(this));
		Sequence.destroy(Sequence.findByTarget(this._fFlayerNorm_spr));
		Sequence.destroy(Sequence.findByTarget(this._fFlayerAdd_spr));
	}

	destroy()
	{
		super.destroy();

		this._interrupt();

		this._fFlayerNorm_spr = null;
		this._fFlayerAdd_spr = null;
	}
}

export default BottomFlare;