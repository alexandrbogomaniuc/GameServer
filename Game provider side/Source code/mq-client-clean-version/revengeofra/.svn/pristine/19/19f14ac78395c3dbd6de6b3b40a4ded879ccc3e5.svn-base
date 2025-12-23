import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import Sequence from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { Utils } from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';

class ElectricitySmokeAnimation extends Sprite
{
	static get EVENT_ON_ANIMATION_COMPLETED()		{return "EVENT_ON_ANIMATION_COMPLETED"};

	startAnimation(animDurationMultiplyer)
	{
		this._animDurationMultiplyer = animDurationMultiplyer || 1;

		this._initAnimations();
		this._playAnimations();
	}

	//INIT...
	constructor(blendMode)
	{
		super();

		this._blendMode = blendMode;
		this._smokesContainer_sprt = this.addChild(new Sprite());
		this._plasmaSmokes = [];
	}

	_initAnimations()
	{
		let smokesProps = this._smokesInitialProperties;
		for (let i=0; i<smokesProps.length; i++)
		{
			let curSmokeProp = smokesProps[i];
			this._addPlasmaSmoke(curSmokeProp.alpha,
								curSmokeProp.scaleX,
								curSmokeProp.scaleY,
								curSmokeProp.rotation)
		}
		
		let smokesContainer = this._smokesContainer_sprt;
		smokesContainer.alpha = 0;
	}

	_addPlasmaSmoke(alpha_num, scaleX_num, scaleY_num, rotation_num)
	{
		let plasmaSmoke = this._smokesContainer_sprt.addChild(this._generatePlasmaSmokeView());
		plasmaSmoke.scale.set(scaleX_num, scaleY_num);
		plasmaSmoke.alpha = alpha_num;
		plasmaSmoke.rotation = Utils.gradToRad(rotation_num);
		
		this._plasmaSmokes.push(plasmaSmoke);
	}

	_generatePlasmaSmokeView()
	{
		let container = new Sprite();
		let plasmaSmoke = container.addChild(APP.library.getSprite('weapons/InstantKill/plasmasmoke'));
		plasmaSmoke.scale.set(2);
		plasmaSmoke.blendMode = this._blendMode;

		return container;
	}

	get _smokesInitialProperties()
	{
		return [
			{// smoke 0
				"alpha": 0.38,
				"scaleX": 0.8,
				"scaleY": 0.8,
				"rotation": 0
			},
			{// smoke 1
				"alpha": 1,
				"scaleX": 0.4,
				"scaleY": 0.4,
				"rotation": 100
			},
			{// smoke 2
				"alpha": 1,
				"scaleX": 0,
				"scaleY": 0,
				"rotation": 0
			},
			{// smoke 3
				"alpha": 1,
				"scaleX": 0,
				"scaleY": 0,
				"rotation": 100
			}
		];
	}
	//...INIT

	//ANIMATION...
	_playAnimations()
	{
		this._playSmokesAnimations();
		
		let mainSeq = [
							{ tweens:[{prop:"alpha", to:1}], duration:this._calcDurationInFrames(5)*2*16.7 },
							{ tweens:[], duration:this._calcDurationInFrames(16)*2*16.7 },
							{ tweens:[{prop:"alpha", to:0}], duration:this._calcDurationInFrames(5)*2*16.7, onfinish: this._onAnimationCompleted.bind(this) }
						];

		Sequence.start(this._smokesContainer_sprt, mainSeq);
	}

	_playSmokesAnimations()
	{
		let smokesSequences = this._smokesSequences;
		if (smokesSequences.length != this._plasmaSmokes.length)
		{
			throw new Error('Wrong electricity foot smokes sequences!');
		}

		for (let i=0; i<this._plasmaSmokes.length; i++)
		{
			let plasmaSmoke = this._plasmaSmokes[i];
			Sequence.start(plasmaSmoke, smokesSequences[i]);
		}
	}

	_resetSmokesProperties()
	{
		let smokesProps = this._smokesInitialProperties;

		for (let i=0; i<this._plasmaSmokes.length; i++)
		{
			let plasmaSmoke = this._plasmaSmokes[i];
			let smokeProps = smokesProps[i];
			plasmaSmoke.scale.set(smokeProps.scaleX, smokeProps.scaleY);
			plasmaSmoke.alpha = smokeProps.alpha;
			plasmaSmoke.rotation = Utils.gradToRad(smokeProps.rotation);
		}
	}

	_repeatAnimations()
	{
		this._playSmokesAnimations();
	}

	get _smokesSequences()
	{
		return [
			[// smoke 0
				{ tweens:[{prop:"scale.x", to:1.1}, {prop:"scale.y", to:1.1}, {prop:"alpha", to:0}], duration:this._calcDurationInFrames(5)*2*16.7 }
			],
			[// smoke 1
				{ tweens:[{prop:"scale.x", to:1.1}, {prop:"scale.y", to:1.1}, {prop:"alpha", to:0}], duration:this._calcDurationInFrames(13)*2*16.7 }
			],
			[// smoke 2
				{ tweens:[{prop:"scale.x", to:0.4}, {prop:"scale.y", to:0.4}], duration:this._calcDurationInFrames(8)*2*16.7 }
			],
			[// smoke 3
				{ tweens:[], duration:this._calcDurationInFrames(9)*2*16.7 },
				{ tweens:[{prop:"scale.x", to:0.4}, {prop:"scale.y", to:0.4}], duration:this._calcDurationInFrames(8)*2*16.7, onfinish: this._onAnimationCycleCompleted.bind(this) }
			]
		]
	}

	_calcDurationInFrames(baseDuration_num)
	{
		let animDurationMultiplyer = this._animDurationMultiplyer || 1;
		return Math.round(baseDuration_num*animDurationMultiplyer);
	}

	_onAnimationCycleCompleted()
	{
		this._resetSmokesProperties();

		this._repeatAnimations();
	}

	_onAnimationCompleted()
	{
		this.emit(ElectricitySmokeAnimation.EVENT_ON_ANIMATION_COMPLETED);
		
		this.destroy();
	}
	//...ANIMATION

	destroy()
	{
		this._blendMode = null;
		if (this._smokesContainer_sprt)
		{
			Sequence.destroy(Sequence.findByTarget(this._smokesContainer_sprt));
			this._smokesContainer_sprt = null;
		}

		while (this._plasmaSmokes && this._plasmaSmokes.length)
		{
			let plasmaSmoke = this._plasmaSmokes.pop();
			Sequence.destroy(Sequence.findByTarget(plasmaSmoke));
		}
		this._plasmaSmokes = null;

		this._animDurationMultiplyer = undefined;

		super.destroy();
	}
}

export default ElectricitySmokeAnimation;