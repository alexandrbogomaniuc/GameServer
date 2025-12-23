import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sprite from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { Utils } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import AtlasSprite from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import AtlasConfig from '../../../../../config/AtlasConfig';
import Sequence from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import ElectricityEffects from '../ElectricityEffects';

class ElectricityBodyFrontAnimatedArcView extends Sprite
{
	static get EVENT_ON_ANIMATION_COMPLETED()	{return "EVENT_ON_ANIMATION_COMPLETED"};

	startAnimation()
	{
		this._startAnimation();
	}

	//INIT...
	constructor(arcType)
	{
		super();

		this._arc = null;
		this._baseArcs = null;
		this._overlayView = null;

		this._initView(arcType);
	}

	_initView(arcType)
	{
		ElectricityEffects.getTextures();
		this._baseArcs = [];

		this._overlayView = this.addChild(this._generateOverlayView(arcType));

		// debug ...
		// let txt = this.addChild(new PIXI.Text(""+arcType, {fontSize: 15, fill: 0xffff00}))
		// txt.position.set(10, -20)
		// ... debug
		
		// this._baseArcs.push(this.addChild(this._generateArcView(arcType, 0.5, 0.5, 0x5f9cdc)));
		// this._baseArcs.push(this.addChild(this._generateArcView(arcType, -0.5, -0.5, 0x5f9cdc)));
		
		let arc = this._arc = this.addChild(this._generateArcView(arcType));
		arc.on('animationend', () => {
			arc.stop();
			arc.destroy();

			this._arc = null;

			this.emit(ElectricityBodyFrontAnimatedArcView.EVENT_ON_ANIMATION_COMPLETED);
			this.destroy();
		});
	}

	_generateOverlayView(arcType)
	{
		let arcOverlayView = new Sprite();
		arcOverlayView = Sprite.createMultiframesSprite(ElectricityEffects["arc_"+arcType+"_glow_new"]);
		arcOverlayView.blendMode = PIXI.BLEND_MODES.ADD;
		arcOverlayView.anchor.set(0, 0);
		arcOverlayView.alpha = 0;
		arcOverlayView.animationSpeed = 24/60;

		arcOverlayView.on('animationend', () => {
			arcOverlayView.stop();
			arcOverlayView.destroy();

			this._overlayView = null;
		});
		
		return arcOverlayView;
	}

	_generateArcView(arcType, aX_num=0, aY_num=0, aTint_num=0xffffff)
	{
		let lArc_sprt;
		
		lArc_sprt = Sprite.createMultiframesSprite(ElectricityEffects["arc_"+arcType+"_new"]);
		lArc_sprt.anchor.set(0, 0);
		
		lArc_sprt.animationSpeed = 24/60;
		lArc_sprt.blendMode = PIXI.BLEND_MODES.ADD;

		lArc_sprt.x = aX_num;
		lArc_sprt.y = aY_num;
		lArc_sprt.tint = aTint_num;
		
		return lArc_sprt;
	}
	//...INIT

	_startAnimation()
	{
		this._arc.play();

		for (let i=0; i<this._baseArcs.length; i++)
		{
			let baseArc = this._baseArcs[i];
			baseArc.play();
		}
		
		if (this._overlayView.textures.length > 1)
		{
			this._overlayView.alpha = 0.2;
			this._overlayView.play();
		}
		else
		{
			this._startOverlaySeq();
		}
	}

	_startOverlaySeq()
	{
		let seq = [
					{ tweens:[{prop:"alpha", to:0.3}], duration:7*2*16.7 },
					{ tweens:[{prop:"alpha", to:0}], duration:10*2*16.7 }
				];

		let sequence = Sequence.start(this._overlayView, seq);
		sequence.once(Sequence.EVENT_ON_SEQUENCE_PLAYING_COMPLETED, this._onOverlaySequenceCompleted, this);
	}

	_onOverlaySequenceCompleted(event)
	{
		let seq = event.target;
		let seqObj = seq.obj;
		
		seq.destructor();
		seqObj.destroy();

		this._overlayView = null;
	}

	destroy()
	{		
		if (this._overlayView)
		{
			Sequence.destroy(Sequence.findByTarget(this._overlayView));
		}
		this._arc = null;
		this._overlayView = null;
		this._baseArcs = null;

		super.destroy();
	}
}

export default ElectricityBodyFrontAnimatedArcView;