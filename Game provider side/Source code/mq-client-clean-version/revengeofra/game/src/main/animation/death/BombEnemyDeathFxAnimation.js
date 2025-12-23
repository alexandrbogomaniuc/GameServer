import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { AtlasSprite } from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/index';
import AtlasConfig from '../../../config/AtlasConfig';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import ProfilingInfo from '../../../../../../common/PIXI/src/dgphoenix/unified/model/profiling/ProfilingInfo';
import { Utils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import * as Easing from '../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { FRAME_RATE } from '../../../../../shared/src/CommonConstants';
import MissEffect from '../../MissEffect';
import CommonEffectsManager from '../../CommonEffectsManager';
import Grenade from '../../Grenade';
import SparkExplode from './bomb_fx/SparkExplode';

class BombEnemyDeathFxAnimation extends Sprite
{
	static get EVENT_ANIMATION_COMPLETED() { return "onAnimationCompleted"; }

	constructor()
	{
		super();

		this._gameField = APP.currentWindow.gameField;

		this._smokes = [];
		this._sparkExplodes = [];
		this._smokePillars = [];

		this._upperCircle = null;
		this._sparkExplodesContainer = null;
		this._lowerCircle = null;
		this._crateGlow = null;
		this._fireBlast = null;
		this._grenadeBlast = null;
		this._smokePillarsContainer = null;
		this._groundSmoke = null;
		this._smokesContainer = null;
		this._groundBurn = null;
		this._dimmer = null;

		Grenade.getTextures();

		APP.profilingController.info.isVfxProfileValueMediumOrGreater && this._initShadowDimmer();
		this._initGroundBurn();
		this._initSmokes();
		this._initGroundSmoke();
		this._initSmokePillars();
		this._initGrenadeBlast();
		APP.profilingController.info.isVfxProfileValueMediumOrGreater && this._initFireBlast();
		this._initCrateGlow();
		this._initLowerCircle();
		this._initSparkExplodes();
		this._initUpperCircle();
	}

	startAnimation()
	{
		APP.profilingController.info.isVfxProfileValueMediumOrGreater && this._playShadowDimmerAnimation();
		this._playGroundBurnAnimation();
		this._playSmokesAnimation();
		this._playGroundSmokeAnimation();
		this._playSmokePillarsAnimation();
		this._playGrenadeBlastAnimation();
		APP.profilingController.info.isVfxProfileValueMediumOrGreater && this._playFireBlastAnimation();
		this._playGlowAnimation();
		this._playLowerCircleAnimation();
		this._playSparkExplodesAnimation();
		this._playUpperCircleAnimation();
		
		this._gameField.shakeTheGround("bombEnemy");

		APP.soundsController.play("explode");
	}

	//ANIMATIONS...
	_playShadowDimmerAnimation()
	{
		Sequence.start(this._dimmer, [
			{tweens: [{prop: 'alpha', to: 0.54}], duration:  3 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0.55}], duration:  2 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to:    0}], duration: 10 * FRAME_RATE}
		]);
	}

	_playGroundBurnAnimation()
	{
		Sequence.start(this._groundBurn, [
			{tweens: [], duration: 80 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0}], duration: 15 * FRAME_RATE,
				onfinish: (e) => { this.destroy() }
			}
		]);
	}

	_playSmokesAnimation()
	{
		for (let i = 0; i < SMOKES_PARAMS.length; i++)
		{
			this._smokes[i].gotoAndPlay(3);

			this._smokes[i].once('animationend', (e) => {
				this._smokes[i].destroy();
			});
		}
	}

	_playGroundSmokeAnimation()
	{
		this._groundSmoke.play();

		this._groundSmoke.once('animationend', (e) => {
			this._groundSmoke.destroy();
		});
	}

	_playSmokePillarsAnimation()
	{
		for (let i = 0; i < SMOKE_PILLARS_PARAMS.length; i++)
		{
			Sequence.start(this._smokePillars[i], [{
				tweens: [
					{prop: 'scale.x', from: 1.25, to: 1.68},
					{prop: 'scale.y', from: 1.25, to: 1.68},
					{prop: 'position.y', from: 0, to: i == 1 ? -30 : 0},
					{prop: 'position.x', from: 0, to: i == 0 ? -50 : i == 2 ? 50 : 0},
					{prop: 'alpha', from: 1, to: 0}
				],
				duration: 10 * FRAME_RATE,
				ease: Easing.sine.easeOut
			}]);
		}
	}

	_playGrenadeBlastAnimation()
	{
		this._grenadeBlast.play();

		this._grenadeBlast.once('animationend', (e) => {
			this._grenadeBlast && this._grenadeBlast.destroy();
		});
	}

	_playFireBlastAnimation()
	{
		Sequence.start(this._fireBlast, [
			{tweens: [{prop: 'scale.x', from: 1.5, to: 0}, {prop: 'scale.y', from: 1.5, to: 0}], duration: 4 * FRAME_RATE}
		]);
	}

	_playGlowAnimation()
	{
		Sequence.start(this._crateGlow, [
			{tweens: [{prop: 'scale.x', to: 1.5 * 2}, {prop: 'scale.y', to: 1.5 * 2}], duration: 1 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 1.6 * 2}, {prop: 'scale.y', to: 1.6 * 2}], duration: 2 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 3.7 * 2}, {prop: 'scale.y', to: 3.7 * 2}], duration: 1 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to:   0 * 2}, {prop: 'scale.y', to:   0 * 2}], duration: 3 * FRAME_RATE}
		]);
	}

	_playLowerCircleAnimation()
	{
		Sequence.start(this._lowerCircle, [
			{tweens: [{prop: 'scale.x', to: 6}, {prop: 'scale.y', to: 4}, {prop: 'alpha', to: 0}], duration: 8 * FRAME_RATE}
		]);
	}

	_playSparkExplodesAnimation()
	{
		for (let i = 0; i < SPARK_EXPLODES_PARAMS.length; i++)
		{
			this._sparkExplodes[i].play();

			this._sparkExplodes[i].once('animationend', (e) => {
				this._sparkExplodes[i].destroy();
			});
		}
	}

	_playUpperCircleAnimation()
	{
		Sequence.start(this._upperCircle, [
			{tweens: [], duration: 1 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 2.2}, {prop: 'scale.y', to: 2.2}], duration: 2 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0}], duration: 6 * FRAME_RATE}
		]);
	}
	//...ANIMATIONS

	//ASSETS...
	_initUpperCircle()
	{
		let circle = this._upperCircle = this.addChild(APP.library.getSprite('death/bomb/circle'));
		circle.blendMode = PIXI.BLEND_MODES.ADD;
		circle.scale.set(0)
	}

	_initSparkExplodes()
	{
		this._sparkExplodesContainer = this.addChild(new Sprite());

		for (let i = 0; i < SPARK_EXPLODES_PARAMS.length; i++)
		{
			let explode = this._sparkExplodes[i] = this._sparkExplodesContainer.addChild(new Sprite());
			explode.textures = SparkExplode.getSparkExplodeTextures();
			explode.blendMode = PIXI.BLEND_MODES.ADD;

			let params = SPARK_EXPLODES_PARAMS[i];
			explode.scale.set(params.scaleX, params.scaleY);
			explode.position.set(params.positionX, params.positionY);
			explode.rotation = Utils.gradToRad(params.rotation);
		}

		this._sparkExplodesContainer.y -= 50;
	}

	_initLowerCircle()
	{
		let circle = this._lowerCircle = this.addChild(APP.library.getSprite('death/bomb/circle'));
		circle.blendMode = PIXI.BLEND_MODES.ADD;
		circle.scale.set(0);
		circle.rotation = Utils.gradToRad(180);
	}

	_initCrateGlow()
	{
		let glow = this._crateGlow = this.addChild(APP.library.getSprite('common/crate_glow'));
		glow.blendMode = PIXI.BLEND_MODES.ADD;
		glow.scale.set(0.8)
	}

	_initFireBlast()
	{
		let fireBlast = this._fireBlast = this.addChild(APP.library.getSprite('weapons/GrenadeGun/MQ_Grenade_Fireblast_ADD'));
		fireBlast.blendMode = PIXI.BLEND_MODES.ADD;
		fireBlast.position.y -= 20;
	}

	_initGrenadeBlast()
	{
		let blast = this._grenadeBlast = this.addChild(new Sprite());
		blast.textures = Grenade.textures['grenadeBlast'];
		blast.scale.set(2);
		blast.blendMode = PIXI.BLEND_MODES.ADD;
	}

	_initSmokePillars()
	{
		this._smokePillarsContainer = this.addChild(new Sprite());

		for (let i = 0; i < SMOKE_PILLARS_PARAMS.length; i++)
		{
			let pillar = this._smokePillars[i] = this._smokePillarsContainer.addChild(APP.library.getSprite("death/bomb/smoke_pillar"));
			pillar.blendMode = PIXI.BLEND_MODES.MULTIPLY;
	 		pillar.anchor.set(0.5, 0.9);
	 		pillar.rotation = Utils.gradToRad(SMOKE_PILLARS_PARAMS[i].rotation);
		}
	}

	_initGroundSmoke()
	{
		let groundSmoke = this._groundSmoke = this.addChild(new Sprite());
		groundSmoke.textures = Grenade.textures['groundSmoke'];
		groundSmoke.scale.set(8);
		groundSmoke.blendMode = PIXI.BLEND_MODES.ADD;
		groundSmoke.position.y -= 70;
	}

	_initSmokes()
	{
		this._smokesContainer = this.addChild(new Sprite());

		for (let i = 0; i < SMOKES_PARAMS.length; i++)
		{
			let smoke = this._smokes[i] = this._smokesContainer.addChild(new Sprite());
			smoke.textures = MissEffect.getSmokeTextures();
			smoke.blendMode = PIXI.BLEND_MODES.ADD;
	 		smoke.anchor.set(0.5, 0.9);

	 		let params = SMOKES_PARAMS[i];
	 		smoke.position.set(params.positionX, params.positionY);
	 		smoke.scale.set(params.scaleX, params.scaleY);
	 		smoke.rotation = Utils.gradToRad(params.rotation);
		}

		this._smokesContainer.position.set(20, 10);
	}

	_initGroundBurn()
	{
		let groundburn = this._groundBurn = this.addChild(APP.library.getSprite('common/groundburn'));
		groundburn.blendMode = PIXI.BLEND_MODES.MULTIPLY;
		groundburn.scale.set(2);
	}

	_initShadowDimmer()
	{
 		let dimmer = this._dimmer = this.addChild(APP.library.getSprite('weapons/GrenadeGun/dimmer'));
 		dimmer.scale.set(4);
 		dimmer.position.set(12, -15);
 		dimmer.alpha = 0.14;
	}
	//...ASSETS

	destroy()
	{
		for (let i = 0; i < SPARK_EXPLODES_PARAMS.length; i++)
		{
			Sequence.destroy(Sequence.findByTarget(this._smokePillars[i]));
		}

		Sequence.destroy(Sequence.findByTarget(this._dimmer));
		Sequence.destroy(Sequence.findByTarget(this._groundBurn));
		Sequence.destroy(Sequence.findByTarget(this._fireBlast));
		Sequence.destroy(Sequence.findByTarget(this._crateGlow));
		Sequence.destroy(Sequence.findByTarget(this._lowerCircle));
		Sequence.destroy(Sequence.findByTarget(this._upperCircle));

		this._upperCircle = null;
		this._sparkExplodesContainer = null;
		this._lowerCircle = null;
		this._crateGlow = null;
		this._fireBlast = null;
		this._grenadeBlast = null;
		this._smokePillarsContainer = null;
		this._groundSmoke = null;
		this._smokesContainer = null;
		this._groundBurn = null;
		this._dimmer = null;

		this.emit(BombEnemyDeathFxAnimation.EVENT_ANIMATION_COMPLETED);
		
		super.destroy();
	}
}

const SMOKES_PARAMS = [
	{scaleX: 3.9, scaleY: 6.8, rotation:   89, positionX:  -90, positionY:    0},
	{scaleX: 3.9, scaleY: 6.8, rotation:  -83, positionX:   90, positionY:    0},
	{scaleX: 3.9, scaleY: 6.8, rotation: -123, positionX:  160, positionY: -100},
	{scaleX: 3.9, scaleY: 6.8, rotation: -233, positionX: -160, positionY: -100},
	{scaleX: 7.4, scaleY:   8, rotation:   -1, positionX:    0, positionY:   50},
	{scaleX: 6.7, scaleY: 2.2, rotation:  180, positionX:    0, positionY: -100},
	{scaleX:   1, scaleY: 2.7, rotation:  165, positionX:  -50, positionY: -180}
]

const SMOKE_PILLARS_PARAMS = [
	{rotation: -90},
	{rotation:   0},
	{rotation:  90}
]

const SPARK_EXPLODES_PARAMS = [
	{scaleX: 2.3, scaleY: 2.3, rotation:   0, positionX:   0, positionY: -30},
	{scaleX:   2, scaleY:   2, rotation:  50, positionX:  30, positionY:   0},
	{scaleX:   2, scaleY:   2, rotation: -52, positionX: -30, positionY:   0}
]

export default BombEnemyDeathFxAnimation;