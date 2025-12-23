import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import PortalEffectsManager from './PortalEffectsManager';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../../shared/src/CommonConstants';
import PortalSmokeAnimation from './PortalSmokeAnimation';
import Sequence from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import * as Easing from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { Utils } from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';

const IDLE_DURATION = 30;
const INTRO_DURATION = 14;
const OUTRO_DURATION = 14;
const OUTRO_DELAY = 15;

const Y_OFFSET = -55;
const X_OFFSET = 0;

class PortalAnimation extends Sprite
{
	static get EVENT_ON_PORTAL_DESTROYED() { return "onPortalDestroyed"; }

	constructor(id)
	{
		super();

		this._id = id;

		this._gameScreen = APP.currentWindow;
		this._vfxProfleMediumOrGreater = APP.profilingController.info.isVfxProfileValueMediumOrGreater;

		this._vfxProfleMediumOrGreater && (this._smokeAnimation = null);
		
		this._enemiesMasks = null;
		this._portal = null;
		this._levelBG = null;
		this._skewBackContainer = null;
		this._skewFrontContainer = null;
		this._flareWithHole = null;
		this._finalFlare = null;
		this._yellowSolid1 = null;
		this._yellowSolid2 = null;
		this._bolt1 = null;
		this._bolt2 = null;

		this._initSkewBackContainer();
		this._initBolts();
		this._initGlows();
		this._initBG();
		this._initPortal();
		this._initSkewFrontContainer();
	}

	setFixedPosition(point)
	{
		this.position = {x: point.x + X_OFFSET, y: point.y + Y_OFFSET}
	}

	getEnemyMask(id)
	{
		if (!this._enemiesMasks) this._enemiesMasks = {};

		this._enemiesMasks[id] = this.addChild(APP.library.getSprite("portal/masks/enemy_mask"));
		this._enemiesMasks[id].scale.set(1.6);
		this._enemiesMasks[id].blendMode = PIXI.BLEND_MODES.ADD;

		return this._enemiesMasks[id];
	}

	disableMask(id)
	{
		this.removeChild(this._enemiesMasks[id]);
		this._enemiesMasks[id] = null;
	}

	//ANIMATION...
	startIntroAnimation()
	{
		this._playOpenSound();

		this._vfxProfleMediumOrGreater && this._smokeAnimation.startAnimation();

		this._portal.play();

		Sequence.start(this._yellowSolid1, [
			{tweens: [{prop: "alpha", to: 0.8}]},
			{tweens: [], duration: 2 * FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.5}], duration: 2 * FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0.8}]},
			{tweens: [], duration: 2 * FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0}], duration: 2 * FRAME_RATE}
		]);

		Sequence.start(this._bolt1, [
			{tweens: [{prop: "visible", to: true}]},
			{tweens: [], duration: 4 * FRAME_RATE},
			{tweens: [{prop: "visible", to: false}]}
		]);

		Sequence.start(this._bolt2, [
			{tweens: [], duration: 4 * FRAME_RATE, onfinish: (e) => { this._portal.play(); }},
			{tweens: [{prop: "visible", to: true}]},
			{tweens: [], duration: 3 * FRAME_RATE},
			{tweens: [{prop: "visible", to: false}]}
		]);

		Sequence.start(this._yellowSolid2, [
			{tweens: [], duration: 4 * FRAME_RATE},
			{tweens: [{prop:"alpha", from: 0, to: 1}], duration: INTRO_DURATION * FRAME_RATE}
		]);

		Sequence.start(this._portal, [
			{tweens: [], duration: 4 * FRAME_RATE},
			{tweens: [{prop:"scale.x", to: 1.6}, {prop:"scale.y", to: 1.6}], duration: INTRO_DURATION * FRAME_RATE, ease: Easing.back.easeOut}
		]);

		Sequence.start(this._levelBG.mask, [
			{tweens: [], duration: 4 * FRAME_RATE},
			{tweens: [{prop:"scale.x", to: 1.5}, {prop:"scale.y", to: 1.5}], duration: INTRO_DURATION * FRAME_RATE, ease: Easing.back.easeOut}
		]);
		
		Sequence.start(this._levelBG, [
			{tweens: [], duration: 4 * FRAME_RATE},
			{tweens: [{prop:"scale.x", to: 1.05}, {prop:"scale.y", to: 1.05}], duration: (INTRO_DURATION - 8) * FRAME_RATE, ease: Easing.back.easeIn},
			{tweens: [{prop:"scale.x", to:    1}, {prop:"scale.y", to:    1}], duration: 8 * FRAME_RATE, ease: Easing.back.easeOut}
		]);

		Sequence.start(this._flareWithHole, [
			{tweens: [], duration: 5 * FRAME_RATE},
			{tweens: [{prop:"scale.x", to: 0.8}, {prop:"scale.y", to: 0.8}], duration: (INTRO_DURATION - 1) * FRAME_RATE, ease: Easing.back.easeOut}
		]);

		Sequence.start(this._flareWithHole, [
			{tweens: [], duration: 4 * FRAME_RATE},
			{
				tweens: [{prop: "rotation", to: Math.PI / 8}], duration: INTRO_DURATION * FRAME_RATE,
				onfinish: (e) => {
					this._playIdleSound();
					this.startIdleAnimation();
				}
			}
		]);
	}

	startIdleAnimation()
	{
		var flare = this._flareWithHole;

		var rotation = flare.rotation;
		var scale = flare.scale.x;

		Sequence.start(flare, [
			{tweens: [{prop:"scale.x", to: scale + 0.1}, {prop:"scale.y", to: scale + 0.1}], duration: IDLE_DURATION * FRAME_RATE}
		]);

		Sequence.start(flare, [
			{
				tweens: [{prop: "rotation", to: rotation + Math.PI / 8}], duration: IDLE_DURATION * FRAME_RATE,
				onfinish: (e) => {
					this.startIdleAnimation();
				}
			},
		]);
	}

	startOutroAnimation()
	{
		Sequence.destroy(Sequence.findByTarget(this._flareWithHole));

		this._vfxProfleMediumOrGreater && this._smokeAnimation.completeAnimation();

		Sequence.start(this._yellowSolid2, [
			{tweens: [], duration: OUTRO_DELAY * FRAME_RATE},
			{tweens: [{prop:"alpha", from: 1, to: 0}], duration: OUTRO_DURATION * FRAME_RATE}
		]);

		Sequence.start(this._portal, [
			{tweens: [], duration: OUTRO_DELAY * FRAME_RATE},
			{tweens: [{prop:"scale.x", to: 0}, {prop:"scale.y", to: 0}], duration: OUTRO_DURATION * FRAME_RATE, ease: Easing.back.easeIn}
		]);

		Sequence.start(this._levelBG.mask, [
			{tweens: [], duration: OUTRO_DELAY * FRAME_RATE},
			{tweens: [{prop:"scale.x", to: 0}, {prop:"scale.y", to: 0}], duration: OUTRO_DURATION * FRAME_RATE, ease: Easing.back.easeIn}
		]);
		
		Sequence.start(this._levelBG, [
			{tweens: [], duration: OUTRO_DELAY * FRAME_RATE},
			{tweens: [{prop:"scale.x", to: 1.1}, {prop:"scale.y", to: 1.1}], duration: 14 * FRAME_RATE, ease: Easing.sine.easeIn}
		]);

		Sequence.start(this._flareWithHole, [
			{tweens: [], duration: (OUTRO_DELAY - 2) * FRAME_RATE},
			{tweens: [{prop:"scale.x", to: 0}, {prop:"scale.y", to: 0}], duration: OUTRO_DURATION * FRAME_RATE, ease: Easing.back.easeIn},
		]);

		var rotation = this._flareWithHole.rotation;

		Sequence.start(this._flareWithHole, [
			{tweens: [{prop: "rotation", to: rotation + Math.PI / 8}], duration: IDLE_DURATION * FRAME_RATE},
		]);

		Sequence.start(this._finalFlare, [
			{tweens: [], duration: (OUTRO_DURATION - 4 + OUTRO_DELAY) * FRAME_RATE},
			{tweens: [{prop:"scale.x", to: 0.5}, {prop:"scale.y", to: 0.5}], duration: 4 * FRAME_RATE, ease: Easing.sine.easeOut},
			{tweens: [{prop:"scale.x", to:   0}, {prop:"scale.y", to:   0}], duration: 8 * FRAME_RATE, ease: Easing.back.easeIn,
				onfinish: () => {
					this.destroy();
				}
			}
		]);

		Sequence.start(this._finalFlare, [
			{tweens: [], duration: (OUTRO_DURATION - 4 + OUTRO_DELAY) * FRAME_RATE,
				onfinish: () => {
					this._playCloseSound();
				}
			},
			{tweens: [{prop: 'rotation', to: Utils.gradToRad(10)}], duration: 12 * FRAME_RATE},
		]);
	}
	//...ANIMATION

	//SOUNDS...
	_playOpenSound()
	{
		this._playSound("portal_open");
	}

	_playIdleSound()
	{
		this._playSound("portal_hum", true);
	}

	_playCloseSound()
	{
		this._stopSound("portal_hum");
		this._playSound("portal_close");
	}

	_stopSound(aSoundName_str)
	{
		APP.soundsController.stop(aSoundName_str);
	}

	_playSound(aSoundName_str, aOptLoop_bl = false)
	{
		APP.soundsController.play(aSoundName_str, aOptLoop_bl);
	}
	//...SOUNDS

	//ASSETS...
	_initSkewBackContainer()
	{
		let container = this._skewBackContainer = this.addChild(new Sprite());
		container.skew.y = Utils.gradToRad(35);
		this._vfxProfleMediumOrGreater && (this._smokeAnimation = container.addChild(new PortalSmokeAnimation()));
	}

	_initPortal()
	{
		let portal = this._portal = this.addChild(new Sprite());
		portal.textures = PortalEffectsManager.getPortalTextures();
		portal.blendMode = PIXI.BLEND_MODES.ADD;
		portal.scale.set(0);
	}

	_initBG()
	{
		let currentMapId = this._gameScreen.room.mapId - 500;
 		let bgId = Math.floor(Math.random() * 3 + 1);

		while (currentMapId === bgId)
		{
			bgId = Math.floor(Math.random() * 3 + 1);
		}

 		let level = this._levelBG = this.addChild(APP.library.getSprite("portal/bgs/bg_" + bgId));
 		level.mask = level.addChild(APP.library.getSprite("portal/masks/mask"));
		level.mask.scale.set(0);
	}

	_initSkewFrontContainer()
	{
		let container = this._skewFrontContainer = this.addChild(new Sprite());
		container.skew.y = Utils.gradToRad(35);

		let flare0 = this._flareWithHole = container.addChild(APP.library.getSprite("portal/fx/flare_2_add"));
		flare0.blendMode = PIXI.BLEND_MODES.ADD;
		flare0.position.x += 5;
 		flare0.scale.set(0);

		let flare1 = this._finalFlare = container.addChild(APP.library.getSprite("portal/fx/flare_add"));
		flare1.blendMode = PIXI.BLEND_MODES.ADD;
 		flare1.anchor.set(0.43, 0.53);
 		flare1.scale.set(0);
	}

	_initGlows()
	{
		let glow1 = this._yellowSolid1 = this.addChild(APP.library.getSprite("portal/fx/yellow_solid_1_add"));
		glow1.blendMode = PIXI.BLEND_MODES.ADD;
		glow1.position.y += 80;
		glow1.alpha = 0;

		let glow2 = this._yellowSolid2 = this.addChild(APP.library.getSprite("portal/fx/yellow_solid_2_add"));
		glow2.blendMode = PIXI.BLEND_MODES.ADD;
		glow2.position.y += 80;
		glow2.scale.set(0.8);
		glow2.alpha = 0;
	}

	_initBolts()
	{
		let bolt1 = this._bolt1 = this.addChild(APP.library.getSprite("portal/fx/bolt_1_add"));
		bolt1.blendMode = PIXI.BLEND_MODES.ADD;
		bolt1.position.x -= 20;
		bolt1.position.y -= 60;
		bolt1.visible = false;
		bolt1.anchor.set(0.5, 1);

		let bolt2 = this._bolt2 = this.addChild(APP.library.getSprite("portal/fx/bolt_2_add"));
		bolt2.blendMode = PIXI.BLEND_MODES.ADD;
		bolt2.position.x += 20;
		bolt2.position.y -= 60;
		bolt2.visible = false;
		bolt2.anchor.set(0.5, 1);
	}
	//...ASSETS

	destroy()
	{
		this._enemiesMasks = null;

		this._vfxProfleMediumOrGreater && this._smokeAnimation.destroy();

		this.emit(PortalAnimation.EVENT_ON_PORTAL_DESTROYED, {id: this._id});

		Sequence.destroy(Sequence.findByTarget(this._portal));
		Sequence.destroy(Sequence.findByTarget(this._levelBG.mask));
		Sequence.destroy(Sequence.findByTarget(this._levelBG));
		Sequence.destroy(Sequence.findByTarget(this._flareWithHole));
		Sequence.destroy(Sequence.findByTarget(this._finalFlare));
		Sequence.destroy(Sequence.findByTarget(this._yellowSolid1));
		Sequence.destroy(Sequence.findByTarget(this._yellowSolid2));
		Sequence.destroy(Sequence.findByTarget(this._bolt1));
		Sequence.destroy(Sequence.findByTarget(this._bolt2));

		super.destroy();
	}
}

export default PortalAnimation;