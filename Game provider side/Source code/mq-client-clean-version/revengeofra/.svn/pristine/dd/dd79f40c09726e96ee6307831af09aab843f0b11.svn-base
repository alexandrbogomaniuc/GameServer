import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import ElectricitySmokeAnimation from './ElectricitySmokeAnimation';
import ElectricityEffects from './ElectricityEffects';
import { ENEMIES } from '../../../../../../shared/src/CommonConstants';

const VIEW_SCALE = 
{
	[ENEMIES.Anubis] : 1 * 1.25,
	[ENEMIES.Osiris] : 1 * 1.25,
	[ENEMIES.Thoth] : 1 * 1.25,
	[ENEMIES.MummyGodGreen] : 0.45,
	[ENEMIES.MummySmallWhite] : 0.35
}

class ElectricityFootStepAnimation extends Sprite
{
	startAnimation(targetEnemy)
	{
		this._initAnimations(targetEnemy);
		this._playAnimations();
	}

	//INIT...
	constructor()
	{
		super();

		this._smokesAnimation = null;
	}

	_initAnimations(targetEnemy)
	{
		this._targetEnemy = targetEnemy;

		ElectricityEffects.getTextures();
		this._smokesAnimation = this.addChild(new ElectricitySmokeAnimation(PIXI.BLEND_MODES.ADD));

		this._initAnimationScale(targetEnemy);
	}

	_initAnimationScale(targetEnemy)
	{
		let enemyName = targetEnemy.name;

		let animScale = VIEW_SCALE[enemyName];

		this.scale.set(animScale);
	}
	//...INIT

	//ANIMATION...
	get _animSpeedMultiplyer()
	{
		if (this._targetEnemy && this._targetEnemy.isWalkTypeRunning)
		{
			return 2;
		}

		return 1
	}

	_playAnimations()
	{
		this._smokesAnimation.startAnimation(1/this._animSpeedMultiplyer);

		this._playStepElectricityArcs();
		this._playStepElectricity();
	}

	_playStepElectricityArcs()
	{
		let lElectricityArcs_sprt = Sprite.createMultiframesSprite(ElectricityEffects["foot_arcs"], -5);
		this.addChild(lElectricityArcs_sprt);

		lElectricityArcs_sprt.animationSpeed = 30/60*this._animSpeedMultiplyer;
		lElectricityArcs_sprt.blendMode = PIXI.BLEND_MODES.ADD;
		lElectricityArcs_sprt.scale.set(2);
		lElectricityArcs_sprt.play();
		
		lElectricityArcs_sprt.on('animationend', () => {
			lElectricityArcs_sprt.stop();
		});
	}

	_playStepElectricity()
	{
		let lElectricity_sprt = Sprite.createMultiframesSprite(ElectricityEffects["foot_electric_fx"], -2);
		this.addChild(lElectricity_sprt);
		lElectricity_sprt.animationSpeed = 30/60*this._animSpeedMultiplyer;
		lElectricity_sprt.blendMode = PIXI.BLEND_MODES.SCREEN;
		lElectricity_sprt.scale.set(1/0.33);
		lElectricity_sprt.play();
		
		lElectricity_sprt.on('animationend', () => {
			lElectricity_sprt.stop();
			this._onAnimationCompleted();
		});
	}

	_onAnimationCompleted()
	{
		this.destroy();
	}
	//...ANIMATION

	destroy()
	{
		if (this._smokesAnimation)
		{
			this._smokesAnimation.destroy();
			this._smokesAnimation = null;
		}

		this._targetEnemy = null;

		super.destroy();
	}
}

export default ElectricityFootStepAnimation;