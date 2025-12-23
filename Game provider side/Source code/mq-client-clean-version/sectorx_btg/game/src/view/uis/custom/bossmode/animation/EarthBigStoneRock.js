import { ENEMIES, FRAME_RATE } from '../../../../../../../shared/src/CommonConstants';
import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { Utils } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import Sequence from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import Sprite from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import * as Easing from '../../../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';

class EarthBigStoneRock extends Sprite {

	static get EVENT_ON_ANIMATION_ENDED()				{return "onAnimationEnded";}

	constructor()
	{
		super();

		this._fAnimationCount_num = null;

		this._fRock_0_sprt = null;
		this._fRock_1_sprt = null;
		this._fRock_2_sprt = null;
		
		this._fRockGlow_0_sprt = null;
		this._fRockGlow_1_sprt = null;
		this._fRockGlow_2_sprt = null;

		this._fGlow_sprt = null;

		this._initView();
	}

	startAnimation()
	{
		this._startAnimation()
	}

	_initView()
	{
		this._createRock2();
		this._createRock3();
		this._createGlow();
		this._createRock1();
	}
	
	_createRock1()
	{
		this._fRock_0_sprt = this.addChild(APP.library.getSpriteFromAtlas("boss_mode/earth/brock_1"));
		this._fRock_0_sprt.anchor.set(0.5, 0.941176471) //160/170
		this._fRock_0_sprt.position.set(10, 60);

		this._fRockGlow_0_sprt = this._fRock_0_sprt.addChild(APP.library.getSpriteFromAtlas("boss_mode/earth/brock_glow_1"));
		this._fRockGlow_0_sprt.anchor.set(0.5, 0.941176471) //160/170
		this._fRockGlow_0_sprt.position.set(1, -14);
	}

	_createRock2()
	{
		this._fRock_1_sprt = this.addChild(APP.library.getSpriteFromAtlas("boss_mode/earth/brock_2"));
		this._fRock_1_sprt.anchor.set(0.328244275, 0.863636364); //43/131    133/154
		this._fRock_1_sprt.position.set(-52, 45);

		this._fRockGlow_1_sprt = this._fRock_1_sprt.addChild(APP.library.getSpriteFromAtlas("boss_mode/earth/brock_glow_2"));
		this._fRockGlow_1_sprt.anchor.set(0.328244275, 0.863636364); //43/131    133/154
		this._fRockGlow_1_sprt.position.set(21, -15);
	}

	_createGlow()
	{
		this._fGlow_sprt = this.addChild(APP.library.getSpriteFromAtlas("boss_mode/earth/bglow"));
		this._fGlow_sprt.anchor.set(0.5, 0.5)
		this._fGlow_sprt.position.set(0, 0);
		this._fGlow_sprt.scale.set(2);
		this._fGlow_sprt.blendMode = PIXI.BLEND_MODES.ADD;
	}

	_createRock3()
	{
		this._fRock_2_sprt = this.addChild(APP.library.getSpriteFromAtlas("boss_mode/earth/brock_3"));
		this._fRock_2_sprt.anchor.set(0.564971751, 0.892405063); //100/177, 282/316
		this._fRock_2_sprt.position.set(40, 40);

		this._fRockGlow_2_sprt = this._fRock_2_sprt.addChild(APP.library.getSpriteFromAtlas("boss_mode/earth/brock_glow_3"));
		this._fRockGlow_2_sprt.anchor.set(0.564971751, 0.892405063); //100/177, 282/316
		this._fRockGlow_2_sprt.position.set(-18, -6);
	}

	_startAnimation()
	{
		this._fAnimationCount_num = 0;

		this._startGlowAnimation();
		this._startRock1Animation();
		this._startRock2Animation();
		this._startRock3Animation();
	}

	_startGlowAnimation()
	{
		this._fGlow_sprt.alpha = 0.1;
		let lGlowAlpha_seq = 
		[
			{tweens: [],duration: 4 * FRAME_RATE},
		];
		
		for (let i = 0; i < 81; i++) {
			this._fAnimationCount_num++;
			lGlowAlpha_seq.push({tweens: [{prop: "alpha", to: Utils.getRandomWiggledValue(0.01 * i, 0.06)}],duration: 1 * FRAME_RATE,
			onfinish: ()=>{
				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			}})
		}
		
		Sequence.start(this._fGlow_sprt, lGlowAlpha_seq);
	}
	
	_getShakeSequase(aValue)
	{
		let lShake_seq =[];
		for (let i = 0; i < 82; i++) {
			this._fAnimationCount_num++;
			lShake_seq.push({tweens: [{prop: "rotation", to: Utils.gradToRad(Utils.getRandomWiggledValue(0, aValue))}],duration: 1 * FRAME_RATE,
			onfinish: ()=>{
				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			}})
		}
		return lShake_seq;
	}

	get _glowRockSequance()
	{
		return [
			{tweens: [],duration: 4 * FRAME_RATE},
			{tweens: [ {prop: "alpha", to: 1} ],duration: 41*FRAME_RATE,
			onfinish: ()=>{
				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			}},
		];
	}
	_startRock1Animation()
	{
		this._fRockGlow_0_sprt.alpha = 0.38;
		this._fAnimationCount_num++;
		Sequence.start(this._fRockGlow_0_sprt, this._glowRockSequance);

		this._fRock_0_sprt.scale.set(0.42, 0.42)
		let lScaleRock_seq = 
		[
			{tweens: [],duration: 16 * FRAME_RATE},
			{tweens: [ {prop: "scale.x", to: 0.77}, {prop: "scale.y", to: 0.77} ],duration: 6*FRAME_RATE, ease:Easing.sine.easeIn},
			{tweens: [],duration: 19 * FRAME_RATE},
			{tweens: [ {prop: "scale.x", to: 1}, {prop: "scale.y", to: 1} ],duration: 5*FRAME_RATE},
			{tweens: [],duration: 23 * FRAME_RATE},
			{tweens: [ {prop: "scale.x", to: 1.04}, {prop: "scale.y", to: 1.04} ],duration: 5*FRAME_RATE},
			{tweens: [],duration: 10 * FRAME_RATE},
			{tweens: [ {prop: "scale.x", to: 0.24}, {prop: "scale.y", to: 0.24} ],duration: 9*FRAME_RATE, ease:Easing.sine.easeOut,
			onfinish: ()=>{
				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			}},
		]
		this._fAnimationCount_num++;
		Sequence.start(this._fRock_0_sprt, lScaleRock_seq);

		this._fRock_0_sprt.rotation = 0;
		let lRotation_seq = 
		[
			{tweens: [],duration: 82 * FRAME_RATE},
			{tweens: [{prop: "rotation", to: 0.30543261909900765}],duration: 8 * FRAME_RATE, // Utils.gradToRad(17.5)
			onfinish: ()=>{
				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			}}
		];

		this._fAnimationCount_num++;
		Sequence.start(this._fRock_0_sprt, this._getShakeSequase((0.03)));
		Sequence.start(this._fRock_0_sprt, lRotation_seq);
	}

	_startRock2Animation()
	{
		this._fRockGlow_1_sprt.alpha = 0.38;
		this._fAnimationCount_num++;
		Sequence.start(this._fRockGlow_1_sprt, this._glowRockSequance);

		this._fRock_1_sprt.scale.set(0.42, 0.42)
		let lScaleRock_seq = 
		[
			{tweens: [],duration: 4 * FRAME_RATE},
			{tweens: [ {prop: "scale.x", to: 0.81}, {prop: "scale.y", to: 0.81} ],duration: 6*FRAME_RATE, ease:Easing.sine.easeIn},
			{tweens: [],duration: 27 * FRAME_RATE},
			{tweens: [ {prop: "scale.x", to: 1}, {prop: "scale.y", to: 1} ],duration: 5*FRAME_RATE},
			{tweens: [],duration: 43 * FRAME_RATE},
			{tweens: [ {prop: "scale.x", to: 0.18}, {prop: "scale.y", to: 0.18} ],duration: 5*FRAME_RATE, ease:Easing.sine.easeOut,
			onfinish: ()=>{
				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			}},
		]
		this._fAnimationCount_num++;
		Sequence.start(this._fRock_1_sprt, lScaleRock_seq);

		this._fRock_1_sprt.rotation = 0;
		let lRotation_seq = 
		[
			{tweens: [],duration: 82 * FRAME_RATE},
			{tweens: [{prop: "rotation", to: -1.8151424220741028}],duration: 8 * FRAME_RATE, // Utils.gradToRad(-104)
			onfinish: ()=>{
				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			}}
		];

		this._fAnimationCount_num++;
		Sequence.start(this._fRock_1_sprt, this._getShakeSequase(0.04));
		Sequence.start(this._fRock_1_sprt, lRotation_seq);
	}

	_startRock3Animation()
	{
		this._fRockGlow_2_sprt.alpha = 0.38;
		this._fAnimationCount_num++;
		Sequence.start(this._fRockGlow_2_sprt, this._glowRockSequance);

		this._fRock_2_sprt.scale.set(0.42, 0.42)
		let lScaleRock_seq = 
		[
			{tweens: [],duration: 4 * FRAME_RATE},
			{tweens: [ {prop: "scale.x", to: 0.51}, {prop: "scale.y", to: 0.51} ],duration: 4*FRAME_RATE},
			{tweens: [],duration: 15 * FRAME_RATE},
			{tweens: [ {prop: "scale.x", to: 0.69}, {prop: "scale.y", to: 0.69} ],duration: 4*FRAME_RATE},
			{tweens: [],duration: 20 * FRAME_RATE},
			{tweens: [ {prop: "scale.x", to: 0.95}, {prop: "scale.y", to: 0.95} ],duration: 4*FRAME_RATE},
			{tweens: [],duration: 13 * FRAME_RATE},
			{tweens: [ {prop: "scale.x", to: 1}, {prop: "scale.y", to: 1} ],duration: 3*FRAME_RATE},
			{tweens: [],duration: 17 * FRAME_RATE},
			{tweens: [ {prop: "scale.x", to: 0.13}, {prop: "scale.y", to: 0.13} ],duration: 6*FRAME_RATE, ease:Easing.sine.easeOut,
			onfinish: ()=>{
				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			}},
		]
		this._fAnimationCount_num++;
		Sequence.start(this._fRock_2_sprt, lScaleRock_seq);

		this._fRock_2_sprt.rotation = 0;
		let lRotation_seq = 
		[
			{tweens: [],duration: 82 * FRAME_RATE},
			{tweens: [{prop: "rotation", to: 1.6580627893946132}],duration: 8 * FRAME_RATE, // Utils.gradToRad(95)
			onfinish: ()=>{
				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			}}
		];

		this._fAnimationCount_num++;
		Sequence.start(this._fRock_2_sprt, this._getShakeSequase(0.03));
		Sequence.start(this._fRock_2_sprt, lRotation_seq);
	}

	_onAnimationCompletedSuspicison()
	{
		if (this._fAnimationCount_num == 0)
		{
			this.emit(EarthBigStoneRock.EVENT_ON_ANIMATION_ENDED);
		}
	}

	destroy(options)
	{
		this._fRock_0_sprt && Sequence.destroy(Sequence.findByTarget(this._fRock_0_sprt));
		this._fRock_0_sprt.destroy();
		this._fRock_1_sprt && Sequence.destroy(Sequence.findByTarget(this._fRock_1_sprt));
		this._fRock_1_sprt.destroy();
		this._fRock_2_sprt && Sequence.destroy(Sequence.findByTarget(this._fRock_2_sprt));
		this._fRock_2_sprt.destroy();
		
		this._fRockGlow_0_sprt && Sequence.destroy(Sequence.findByTarget(this._fRockGlow_0_sprt));
		this._fRockGlow_0_sprt.destroy();
		this._fRockGlow_1_sprt && Sequence.destroy(Sequence.findByTarget(this._fRockGlow_1_sprt));
		this._fRockGlow_1_sprt.destroy();
		this._fRockGlow_2_sprt && Sequence.destroy(Sequence.findByTarget(this._fRockGlow_2_sprt));
		this._fRockGlow_2_sprt.destroy();

		this._fGlow_sprt && Sequence.destroy(Sequence.findByTarget(this._fGlow_sprt));
		this._fGlow_sprt.destroy();

		super.destroy(options);
	}
}

export default EarthBigStoneRock;