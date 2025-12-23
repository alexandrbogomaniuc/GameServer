import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import Sequence from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { Utils } from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import ElectricityEffects from './ElectricityEffects';

class ElectricityBodyBackArcsAnimation extends Sprite
{
	static get EVENT_ON_ANIMATION_COMPLETED()		{return "EVENT_ON_ANIMATION_COMPLETED"};

	startAnimation()
	{
		this._initAnimations();
		this._playAnimations();
	}

	//INIT...
	constructor()
	{
		super();

		this._arcsContainer_sprt = this.addChild(new Sprite());
		this._arcs_arr = [];
	}

	_initAnimations()
	{
		ElectricityEffects.getTextures();

		let arcsProps = this._arcsInitialProperties;
		for (let i=0; i<arcsProps.length; i++)
		{
			let curArcProp = arcsProps[i];
			this._addArc(curArcProp.x, curArcProp.y, curArcProp.rotation);
		}
	}

	_addArc(aX_num, aY_num, rotation_num)
	{
		let arc = this._arcsContainer_sprt.addChild(this._generateArcView());
		arc.alpha = 0;
		arc.rotation = Utils.gradToRad(rotation_num);
		arc.position.set(aX_num, aY_num);
		
		this._arcs_arr.push(arc);
	}

	_generateArcView()
	{
		let container = new Sprite();
		let arc = container.addChild(new Sprite());
		arc.textures = ElectricityEffects["arc_back"];
		arc.scale.set(2);
		arc.anchor.set(0, 0.5);
		arc.alpha = 0.7;
		arc.blendMode = PIXI.BLEND_MODES.ADD;

		return container;
	}

	get _arcsInitialProperties()
	{
		return [
			{// arc 0
				"x": 0, "y": 0,
				"rotation": Utils.random(-120, -110, false), //-113
				"delay": 0
			},
			{// arc 1
				"x": 25, "y": 15,
				"rotation": Utils.random(40, 60, false), //50
				"delay": 0
			},
			{// arc 2
				"x": 8, "y": -12,
				"rotation": Utils.random(-30, -20, false), //25
				"delay": 4*2*16.7
			},
			{// arc 3
				"x": 30, "y": 12,
				"rotation": Utils.random(40, 60, false), //50
				"delay": 4*2*16.7
			},
			{// arc 4
				"x": 10, "y": 36,
				"rotation": Utils.random(-190, -180, false), //-185
				"delay": 1*2*16.7
			},
			{// arc 5
				"x": -8, "y": -13,
				"rotation": Utils.random(-100, -90, false), //-93
				"delay": 8*2*16.7
			},
			{// arc 6
				"x": 10, "y": 36,
				"rotation": Utils.random(-190, -180, false), //-185
				"delay": 8*2*16.7
			}
		];
	}
	//...INIT

	//ANIMATION...
	_playAnimations()
	{
		this._playArcsAnimations();
	}

	_playArcsAnimations()
	{
		let arcsInitialProperties = this._arcsInitialProperties;

		for (let i=0; i<this._arcs_arr.length; i++)
		{
			let arc = this._arcs_arr[i];
			let arcInitialProperties = arcsInitialProperties[i];
			let seq = Sequence.start(arc, this._generateArcSequence(arc.x, arc.y), arcInitialProperties.delay);
			seq.once(Sequence.EVENT_ON_SEQUENCE_PLAYING_COMPLETED, this._onArcSequenceCompleted, this);
		}
	}

	_generateArcSequence(aX_num, aY_num)
	{
		let directionX = Math.random() < 0.5 ? 1 : -1;
		let newX = aX_num+directionX*Utils.random(3, 5, false);

		let directionY = Math.random() < 0.5 ? 1 : -1;
		let newY = aY_num+directionY*Utils.random(3, 5, false);

		let seq = [
					{ tweens:[{prop:"alpha", to:1}], duration:1*2*16.7 },
					{ tweens:[{prop:"x", to:newX}, {prop:"y", to:newY}], duration:4*2*16.7}
				];

		return seq;
	}

	_onArcSequenceCompleted(e)
	{
		let seq = e.target;
		let seqObj = seq.obj;
		seq.destructor();
		
		let arcIndex = this._arcs_arr.indexOf(seqObj);
		this._arcs_arr.splice(arcIndex, 1);
		seqObj.destroy();

		if (!this._arcs_arr.length)
		{
			this._onAnimationCompleted();
		}
	}

	_onAnimationCompleted()
	{
		this.emit(ElectricityBodyBackArcsAnimation.EVENT_ON_ANIMATION_COMPLETED);
		
		this.destroy();
	}
	//...ANIMATION

	destroy()
	{
		while (this._arcs_arr && this._arcs_arr.length)
		{
			let arc = this._arcs_arr.pop();
			Sequence.destroy(Sequence.findByTarget(arc));
		}
		this._arcs_arr = null;
		this._arcsContainer_sprt = null;

		super.destroy();
	}
}

export default ElectricityBodyBackArcsAnimation;