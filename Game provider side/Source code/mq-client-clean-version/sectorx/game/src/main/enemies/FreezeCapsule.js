import Capsule from "./Capsule";
import { Sequence } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import Enemy from "./Enemy";
import { APP } from "../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals";
import { BulgePinchFilter, ColorOverlayFilter } from "../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Filters";
import { FRAME_RATE } from "../../../../shared/src/CommonConstants";
import { Utils } from "../../../../../common/PIXI/src/dgphoenix/unified/model/Utils";

class FreezeCapsule extends Capsule
{
	constructor(params)
	{
		super(params);
		this._fBulgePinchFilter_f = null;
		this._fColorOverlayFilter_f = null;
	}

	//override
	_playDeathFxAnimation(aIsInstantKill_bl)
	{
		this.spineView.visible = true;

		this._startWiggling();

		if (!aIsInstantKill_bl)
		{
			APP.gameScreen.freezeCapsuleFeatureController.startAnimation(this.getCenterPosition());
		}
		this._startBulge();

		this.emit(Enemy.EVENT_ON_DEATH_COIN_AWARD);
	}

	_startBulge()
	{
		this._fBulgePinchFilter_f = new BulgePinchFilter();
		this._fBulgePinchFilter_f.resolution = APP.stage.renderer.resolution;
		this._fBulgePinchFilter_f.uniforms.center = [0.5, 0.3];
		this._fBulgePinchFilter_f.uniforms.radius = 100;
		this._fBulgePinchFilter_f.uniforms.strength = 0;

		this.container.filters = [this._fBulgePinchFilter_f];

		let lFilterStrength_seq = [
			{
				tweens: [{prop: 'uniforms.strength', to: 0.7}],
				duration: 10*FRAME_RATE,
				onfinish: this._startBlowAnimation.bind(this)
			},
		];
		Sequence.start(this._fBulgePinchFilter_f, lFilterStrength_seq);
	}

	_startBlowAnimation()
	{
		let lFilterStrength_seq = [{ tweens: [{prop: 'uniforms.strength', to: 0}], duration: 3*FRAME_RATE }];
		Sequence.start(this._fBulgePinchFilter_f, lFilterStrength_seq);

		this._fColorOverlayFilter_f = new ColorOverlayFilter(0xFF0000, 0);

		this.spineView.filters = [this._fColorOverlayFilter_f];

		let lFilterAlpha_seq = [
			{
				tweens: [{prop: 'uniforms.alpha', to: 0.5}],
				duration: 6*FRAME_RATE,
				onfinish: ()=>{
					Sequence.destroy(Sequence.findByTarget(this._fColorOverlayFilter_f))
					this.__tryToFinishDeathFxAnimation();
				}
			},
		];
		Sequence.start(this._fColorOverlayFilter_f, lFilterAlpha_seq);
	}

	_startWiggling()
	{
		let lPosition_obj = this.position;

		let lSequenceScale_arr = [
			{ 
				tweens: [
					{ prop: "position.x", to: Utils.getRandomWiggledValue(lPosition_obj.x, 3) },
					{ prop: "position.y", to: Utils.getRandomWiggledValue(lPosition_obj.y, 3) }
				], 	
				duration: 2 * FRAME_RATE
			},
			{ 
				tweens: [
					{ prop: "position.x", to: Utils.getRandomWiggledValue(lPosition_obj.x, 5) },
					{ prop: "position.y", to: Utils.getRandomWiggledValue(lPosition_obj.y, 5) }
				], 	
				duration: 2 * FRAME_RATE
			},
			{ 
				tweens: [
					{ prop: "position.x", to: Utils.getRandomWiggledValue(lPosition_obj.x, 5) },
					{ prop: "position.y", to: Utils.getRandomWiggledValue(lPosition_obj.y, 5) }
				], 	
				duration: 2 * FRAME_RATE
			},
			{ 
				tweens: [
					{ prop: "position.x", to: Utils.getRandomWiggledValue(lPosition_obj.x, 5) },
					{ prop: "position.y", to: Utils.getRandomWiggledValue(lPosition_obj.y, 5) }
				], 	
				duration: 2 * FRAME_RATE
			},
			{ tweens: [{ prop: "scale.x", to: 1.2 }, 	{ prop: "scale.y", to: 1.2 }], 	duration: 4 * FRAME_RATE},
			{ tweens: [{ prop: "scale.x", to: 0 }, 		{ prop: "scale.y", to: 0 }], 	duration: 4 * FRAME_RATE, onfinish: () => {
				Sequence.destroy(Sequence.findByTarget(this))
				this.__tryToFinishDeathFxAnimation();
			}}
		];
		Sequence.start(this, lSequenceScale_arr);
	}

	__tryToFinishDeathFxAnimation()
	{
		if (	(!Sequence.findByTarget(this) 
					|| !Sequence.findByTarget(this).length) 
				&& (!Sequence.findByTarget(this._fColorOverlayFilter_f) 
					|| !Sequence.findByTarget(this._fColorOverlayFilter_f).length))
		{
			super.__tryToFinishDeathFxAnimation();
		}
	}

	get __maxCrosshairDeviationOnEnemyX() //maximum deviation in X position of the cursor on the body of the enemy
	{
		return 52;
	}

	get __maxCrosshairDeviationOnEnemyY() //maximum deviation in Y position of the cursor on the body of the enemy
	{
		return 65;
	}

	destroy()
	{		
		this._fBulgePinchFilter_f && Sequence.destroy(Sequence.findByTarget(this._fBulgePinchFilter_f));
		this._fBulgePinchFilter_f = null;

		this._fColorOverlayFilter_f && Sequence.destroy(Sequence.findByTarget(this._fColorOverlayFilter_f));
		this._fColorOverlayFilter_f = null;

		Sequence.destroy(Sequence.findByTarget(this));

		super.destroy();
	}
}

export default FreezeCapsule;