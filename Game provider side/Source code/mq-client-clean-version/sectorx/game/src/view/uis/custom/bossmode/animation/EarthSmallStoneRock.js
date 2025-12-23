
import {  FRAME_RATE } from '../../../../../../../shared/src/CommonConstants';
import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { Utils } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import Sequence from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import Sprite from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';

class EarthSmallStoneRock extends Sprite 
{
	static get EVENT_ON_ANIMATION_ENDED()				{return "onAnimationEnded";}

	constructor()
	{
		super();
		this._fRock_sprt_arr = []
		this._fShadow_sprt_arr = [];

		this._fAnimationCount_num = null;
	}

	startAnimation(aNum = 0, aSpeedScale_num = 1, aAlphadelayDuration)
	{
		if (!APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			return;
		}

		this._fAnimationCount_num = 0;

		switch (aNum) {
			case 5:
				this.startAnimationRock5(aSpeedScale_num, aAlphadelayDuration);
				break;
			case 6:
				this.startAnimationRock6(aSpeedScale_num, aAlphadelayDuration);
				break;
			case 9:
				this.startAnimationRock9(aSpeedScale_num, aAlphadelayDuration);
				break;
			case 12:
				this.startAnimationRock12(aSpeedScale_num);
				break;
			case 13:
				this.startAnimationRock13(aSpeedScale_num);
				break;
			case 14:
				this.startAnimationRock14(aSpeedScale_num);
				break;
			default:
				this.startJumpSmoke(aSpeedScale_num);
				break;
		}
	}

	_createSmallRock(aNum, aRotation_num, aScale_obj)
	{
		if(aNum > 3) return;
		let lRock = this.addChild(APP.library.getSpriteFromAtlas("boss_mode/earth/srock_0" + (aNum + 2)))
		lRock.rotation = aRotation_num;
		lRock.anchor.set(0.5, 0.5);
		lRock.scale.set(aScale_obj.x, aScale_obj.y)

		this._fRock_sprt_arr.push(lRock);

		return lRock;
	}

	_createShadow(aScale_obj, aAlpha)
	{
		let lShadow = this.addChild(APP.library.getSpriteFromAtlas("boss_mode/earth/sshadow"));
		lShadow.alpha = aAlpha;
		lShadow.anchor.set(0.5, 0.5);
		lShadow.scale.set(aScale_obj.x, aScale_obj.y);

		this._fShadow_sprt_arr.push(lShadow);

		return lShadow;
	}

	getAlpha_seq(aDelay, aSpeedScale_num)
	{
		return [
			{tweens: [],duration: aDelay * FRAME_RATE*aSpeedScale_num},
			{tweens: [{prop: "alpha", to: 0}],duration: 23 * FRAME_RATE*aSpeedScale_num},
		]
	}

	getAlphaShadow_seq(aFirstDelay, aSecondDelay, aSpeedScale_num)
	{
		return [
			{tweens: [],duration: aFirstDelay * FRAME_RATE*aSpeedScale_num},
			{tweens: [{prop: "alpha", to: 0.75}],duration: 15 * FRAME_RATE*aSpeedScale_num},
			{tweens: [{prop: "alpha", to: 1}],duration: aSecondDelay * FRAME_RATE*aSpeedScale_num},
			{tweens: [{prop: "alpha", to: 0}],duration: 8 * FRAME_RATE*aSpeedScale_num},
		]
	}

	startAnimationRock5(aSpeedScale_num = 1, aAlphadelayDuration = 57)
	{
		
		this._startShadowRock5Animation(aSpeedScale_num, aAlphadelayDuration);

		let lRock_0 = this._createSmallRock(0, -1.6231562043547263, {x:0.182, y: 0.198}); //Utils.gradToRad(-93)

		let lRock0Position_seq = 
		[
			{tweens: [],duration: 2 * FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 30}, {prop: "position.y", to: -94} ],duration: 8*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 59}, {prop: "position.y", to: -66} ],duration: 4*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 70}, {prop: "position.y", to: -51} ],duration: 6*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 79}, {prop: "position.y", to: -22} ],duration: 5*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 80}, {prop: "position.y", to: -24} ],duration: 2*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 83}, {prop: "position.y", to: -29} ],duration: 3*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 88}, {prop: "position.y", to: -29} ],duration: 3*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 93}, {prop: "position.y", to: -19} ],duration: 3*FRAME_RATE*aSpeedScale_num},
		];

		let lRock0Rotation_seq = 
		[
			{tweens: [{prop: "rotation", to: -6.14355896702004}],duration: 23 * FRAME_RATE*aSpeedScale_num}, // Utils.gradToRad(-352)
			{tweens: [{prop: "rotation", to: 0.13962634015954636}],duration: 11 * FRAME_RATE*aSpeedScale_num} // Utils.gradToRad(8)
		];


		Sequence.start(lRock_0, lRock0Position_seq);
		Sequence.start(lRock_0, this.getAlpha_seq(aAlphadelayDuration,aSpeedScale_num));
		Sequence.start(lRock_0, lRock0Rotation_seq);

		let lRock_1 = this._createSmallRock(1, 1.8849555921538759, {x:0.234, y: 0.264}); //Utils.gradToRad(108)

		let lRock1Position_seq = 
		[
			{tweens: [],duration: 1 * FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 56}, {prop: "position.y", to: -108} ],duration: 9*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 96}, {prop: "position.y", to: -94} ],duration: 4*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 122}, {prop: "position.y", to: -67} ],duration: 4*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 139}, {prop: "position.y", to: -36} ],duration: 3*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 143}, {prop: "position.y", to: -44} ],duration: 3*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 147}, {prop: "position.y", to: -48} ],duration: 4*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 153}, {prop: "position.y", to: -48} ],duration: 3*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 162}, {prop: "position.y", to: -38} ],duration: 4*FRAME_RATE*aSpeedScale_num},
		];

		let lRock1Rotation_seq = 
		[
			{tweens: [{prop: "rotation", to: -3.2463124087094526}],duration: 21 * FRAME_RATE*aSpeedScale_num}, // Utils.gradToRad(-186)
			{tweens: [{prop: "rotation", to: -0.12217304763960307}],duration: 12 * FRAME_RATE*aSpeedScale_num} // Utils.gradToRad(-7)
		];

		Sequence.start(lRock_1, lRock1Position_seq);
		Sequence.start(lRock_1, this.getAlpha_seq(aAlphadelayDuration - 1,aSpeedScale_num));
		Sequence.start(lRock_1, lRock1Rotation_seq);
		
		let lRock_2 = this._createSmallRock(2, -0.29670597283903605, {x:0.208, y: 0.33}); //Utils.gradToRad(-17)
		
		let lRock2Position_seq = 
		[
			{tweens: [ {prop: "position.x", to: 35}, {prop: "position.y", to: -89} ],duration: 9*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 75}, {prop: "position.y", to: -71} ],duration: 4*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 89}, {prop: "position.y", to: -39} ],duration: 2*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 106}, {prop: "position.y", to: -8} ],duration: 2*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 108}, {prop: "position.y", to: -2} ],duration: 1*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 110}, {prop: "position.y", to: -15} ],duration: 3*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 115}, {prop: "position.y", to: -15} ],duration: 3*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 120}, {prop: "position.y", to: -5} ],duration: 3*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 123}, {prop: "position.y", to: -5} ],duration: 4*FRAME_RATE*aSpeedScale_num},
		];

		let lRock2Rotation_seq = 
		[
			{tweens: [{prop: "rotation", to: -4.4156830075456535}],duration: 17 * FRAME_RATE*aSpeedScale_num}, // Utils.gradToRad(-253)
			{tweens: [{prop: "rotation", to: 1.8675022996339325}],duration: 11 * FRAME_RATE*aSpeedScale_num} // Utils.gradToRad(107)
		];

		Sequence.start(lRock_2, lRock2Position_seq);
		Sequence.start(lRock_2, this.getAlpha_seq(aAlphadelayDuration - 3, aSpeedScale_num));
		Sequence.start(lRock_2, lRock2Rotation_seq);

		this._fAnimationCount_num++;
		Sequence.start(this, [
			{tweens: [],duration: (9 + aAlphadelayDuration) * FRAME_RATE*aSpeedScale_num,onfinish: ()=>{
				lRock_0 && Sequence.destroy(Sequence.findByTarget(lRock_0));
				lRock_0.destroy();
				lRock_1 && Sequence.destroy(Sequence.findByTarget(lRock_1));
				lRock_1.destroy();
				lRock_2 && Sequence.destroy(Sequence.findByTarget(lRock_2));
				lRock_2.destroy();

				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			}}]);
	}

	_startShadowRock5Animation(aSpeedScale_num = 1, aAlphadelayDuration = 57)
	{
		let lRockShadow_0 = this._createShadow({x:0.8, y:0.32}, 0.55);

		let lRockShadowPosition_0_seq = 
		[
			{tweens: [ {prop: "position.x", to: 45}, {prop: "position.y", to: -28} ],duration: 9*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 119}, {prop: "position.y", to: -32} ],duration: 8*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 130}, {prop: "position.y", to: -33} ],duration: 4*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 136}, {prop: "position.y", to: -32} ],duration: 2*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 152}, {prop: "position.y", to: -33} ],duration: 8*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 165}, {prop: "position.y", to: -33} ],duration: 4*FRAME_RATE*aSpeedScale_num},
		];

		Sequence.start(lRockShadow_0, lRockShadowPosition_0_seq);
		Sequence.start(lRockShadow_0, this.getAlphaShadow_seq(4, (aAlphadelayDuration - 19), aSpeedScale_num));

		let lRockShadow_1 = this._createShadow({x:0.39, y:0.22}, 0.55);

		let lRockShadowPosition_1_seq = 
		[
			{tweens: [ {prop: "position.x", to: 14}, {prop: "position.y", to: -17} ],duration: 7*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 67}, {prop: "position.y", to: -17} ],duration: 10*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 76}, {prop: "position.y", to: -17} ],duration: 5*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 86}, {prop: "position.y", to: -17} ],duration: 5*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 95}, {prop: "position.y", to: -17} ],duration: 5*FRAME_RATE*aSpeedScale_num},
		];

		Sequence.start(lRockShadow_1, lRockShadowPosition_1_seq);
		Sequence.start(lRockShadow_1, this.getAlphaShadow_seq(9, (aAlphadelayDuration - 25), aSpeedScale_num));

		let lRockShadow_2 = this._createShadow({x:0.73, y:0.42}, 0.55);
		let lRockShadowPosition_2_seq = 
		[
			{tweens: [ {prop: "position.x", to: 45}, {prop: "position.y", to: 0} ],duration: 7*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 105}, {prop: "position.y", to: 0} ],duration: 10*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 114}, {prop: "position.y", to: 0} ],duration: 5*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 119}, {prop: "position.y", to: 0} ],duration: 5*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 120}, {prop: "position.y", to: 0} ],duration: 5*FRAME_RATE*aSpeedScale_num},
		];
		Sequence.start(lRockShadow_2, lRockShadowPosition_2_seq);
		Sequence.start(lRockShadow_2, this.getAlphaShadow_seq(9, (aAlphadelayDuration - 27), aSpeedScale_num));
		
		this._fAnimationCount_num++;
		Sequence.start(this, [
			{tweens: [],duration: (aAlphadelayDuration + 9) * FRAME_RATE*aSpeedScale_num,onfinish: ()=>{
				lRockShadow_0 && Sequence.destroy(Sequence.findByTarget(lRockShadow_0));
				lRockShadow_0.destroy();
				lRockShadow_1 && Sequence.destroy(Sequence.findByTarget(lRockShadow_1));
				lRockShadow_1.destroy();
				lRockShadow_2 && Sequence.destroy(Sequence.findByTarget(lRockShadow_2));
				lRockShadow_2.destroy();

				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			}}])
	}

	startAnimationRock6(aSpeedScale_num = 1, aAlphadelayDuration = 56)
	{
		this._startShadowRock6Animation(aSpeedScale_num, aAlphadelayDuration);
		let lRock_0 = this._createSmallRock(0, -2.0943951023931953, {x:0.182, y: 0.198}); //Utils.gradToRad(-120)
		
		let lRock0Position_seq = 
		[
			{tweens: [],duration: 2 * FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 212}, {prop: "position.y", to: -84} ],duration: 8*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 344}, {prop: "position.y", to: -4} ],duration: 9*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 346}, {prop: "position.y", to: -5} ],duration: 2*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 365}, {prop: "position.y", to: -10} ],duration: 3*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 390}, {prop: "position.y", to: -4} ],duration: 6*FRAME_RATE*aSpeedScale_num},
		];

		let lRock0Rotation_seq = 
		[
			{tweens: [{prop: "rotation", to: -6.14355896702004}],duration: 16 * FRAME_RATE*aSpeedScale_num}, // Utils.gradToRad(-352)
			{tweens: [{prop: "rotation", to: 0.13962634015954636}],duration: 11 * FRAME_RATE*aSpeedScale_num} // Utils.gradToRad(8)
		];


		Sequence.start(lRock_0, lRock0Position_seq);
		Sequence.start(lRock_0, this.getAlpha_seq(aAlphadelayDuration - 3,aSpeedScale_num));
		Sequence.start(lRock_0, lRock0Rotation_seq);

		let lRock_1 = this._createSmallRock(1, 0.8377580409572781, {x:0.234, y: 0.264}); //Utils.gradToRad(48)
		let lRock1Position_seq = 
		[
			{tweens: [],duration: 1 * FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 166}, {prop: "position.y", to: -108} ],duration: 9*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 206}, {prop: "position.y", to: -94} ],duration: 4*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 232}, {prop: "position.y", to: -67} ],duration: 4*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 249}, {prop: "position.y", to: -36} ],duration: 3*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 253}, {prop: "position.y", to: -44} ],duration: 3*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 257}, {prop: "position.y", to: -48} ],duration: 4*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 263}, {prop: "position.y", to: -48} ],duration: 3*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 279}, {prop: "position.y", to: -34} ],duration: 4*FRAME_RATE*aSpeedScale_num},
		];

		let lRock1Rotation_seq = 
		[
			{tweens: [{prop: "rotation", to: -6.14355896702004}],duration: 21 * FRAME_RATE*aSpeedScale_num}, // Utils.gradToRad(-352)
			{tweens: [{prop: "rotation", to: -1.5707963267948966}],duration: 14 * FRAME_RATE*aSpeedScale_num} // Utils.gradToRad(-90)
		];

		Sequence.start(lRock_1, lRock1Position_seq);
		Sequence.start(lRock_1, this.getAlpha_seq(aAlphadelayDuration - 2,aSpeedScale_num));
		Sequence.start(lRock_1, lRock1Rotation_seq);
		
		let lRock_2 = this._createSmallRock(2, -0.29670597283903605, {x:0.208, y: 0.33}); //Utils.gradToRad(-17)
		lRock_2.position.set(-77, 0);
		
		let lRock2Position_seq = 
		[
			{tweens: [ {prop: "position.x", to: 138}, {prop: "position.y", to: -89} ],duration: 9*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 178}, {prop: "position.y", to: -71} ],duration: 4*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 192}, {prop: "position.y", to: -39} ],duration: 2*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 209}, {prop: "position.y", to: -8} ],duration: 2*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 210}, {prop: "position.y", to: -10} ],duration: 1*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 213}, {prop: "position.y", to: -15} ],duration: 3*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 218}, {prop: "position.y", to: -15} ],duration: 3*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 223}, {prop: "position.y", to: -5} ],duration: 3*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 226}, {prop: "position.y", to: -5} ],duration: 4*FRAME_RATE*aSpeedScale_num},
		];

		let lRock2Rotation_seq = 
		[
			{tweens: [{prop: "rotation", to: -4.97418836818384}],duration: 17 * FRAME_RATE*aSpeedScale_num}, // Utils.gradToRad(-285)
			{tweens: [{prop: "rotation", to: .8675022996339325}],duration: 11 * FRAME_RATE*aSpeedScale_num} // Utils.gradToRad(107)
		];

		Sequence.start(lRock_2, lRock2Position_seq);
		Sequence.start(lRock_2, this.getAlpha_seq(aAlphadelayDuration,aSpeedScale_num));
		Sequence.start(lRock_2, lRock2Rotation_seq);

		this._fAnimationCount_num++;
		Sequence.start(this, [
			{tweens: [],duration: (24 + aAlphadelayDuration) * FRAME_RATE*aSpeedScale_num,onfinish: ()=>{
				lRock_0 && Sequence.destroy(Sequence.findByTarget(lRock_0));
				lRock_0.destroy();
				lRock_1 && Sequence.destroy(Sequence.findByTarget(lRock_1));
				lRock_1.destroy();
				lRock_2 && Sequence.destroy(Sequence.findByTarget(lRock_2));
				lRock_2.destroy();

				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			}}]);
	}

	_startShadowRock6Animation(aSpeedScale_num = 1, aAlphadelayDuration = 56)
	{
		let lContainer_sprt = this.addChild(new Sprite());
		lContainer_sprt.position.set(105, -5)
		let lRockShadow_0 = lContainer_sprt.addChild(this._createShadow({x:0.8, y:0.324}, 0.55));

		let lRockShadowPosition_0_seq = 
		[
			{tweens: [ {prop: "position.x", to: 49}, {prop: "position.y", to: -17} ],duration: 9*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 123}, {prop: "position.y", to: -22} ],duration: 8*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 134}, {prop: "position.y", to: -23} ],duration: 4*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 140}, {prop: "position.y", to: -22} ],duration: 2*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 156}, {prop: "position.y", to: -23} ],duration: 8*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 169}, {prop: "position.y", to: -23} ],duration: 4*FRAME_RATE*aSpeedScale_num},
		];

		Sequence.start(lRockShadow_0, lRockShadowPosition_0_seq);
		Sequence.start(lRockShadow_0, this.getAlphaShadow_seq(4, (aAlphadelayDuration - 7), aSpeedScale_num));

		let lRockShadow_1 = lContainer_sprt.addChild(this._createShadow({x:0.649, y:0.224}, 0.55));

		let lRockShadowPosition_1_seq = 
		[
			{tweens: [ {prop: "position.x", to: 180}, {prop: "position.y", to: -17} ],duration: 7*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 235}, {prop: "position.y", to: -8} ],duration: 10*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 254}, {prop: "position.y", to: -3} ],duration: 5*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 277}, {prop: "position.y", to: 3} ],duration: 5*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 284}, {prop: "position.y", to: 5} ],duration: 4*FRAME_RATE*aSpeedScale_num},
		];

		Sequence.start(lRockShadow_1, lRockShadowPosition_1_seq);
		Sequence.start(lRockShadow_1, this.getAlphaShadow_seq(9, (aAlphadelayDuration - 11), aSpeedScale_num));

		let lRockShadow_2 = lContainer_sprt.addChild(this._createShadow({x:0.73, y:0.424}, 0.55));
		let lRockShadowPosition_2_seq = 
		[
			{tweens: [ {prop: "position.x", to: 45}, {prop: "position.y", to: 0} ],duration: 7*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 105}, {prop: "position.y", to: 0} ],duration: 10*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 114}, {prop: "position.y", to: 0} ],duration: 5*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 119}, {prop: "position.y", to: 0} ],duration: 5*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 120}, {prop: "position.y", to: 0} ],duration: 4*FRAME_RATE*aSpeedScale_num},
		];
		Sequence.start(lRockShadow_2, lRockShadowPosition_2_seq);
		Sequence.start(lRockShadow_2, this.getAlphaShadow_seq(9, (aAlphadelayDuration - 9), aSpeedScale_num));
		
		this._fAnimationCount_num++;
		Sequence.start(this, [
			{tweens: [],duration: (25 + aAlphadelayDuration) * FRAME_RATE*aSpeedScale_num,onfinish: ()=>{
				lRockShadow_0 && Sequence.destroy(Sequence.findByTarget(lRockShadow_0));
				lRockShadow_0.destroy();
				lRockShadow_1 && Sequence.destroy(Sequence.findByTarget(lRockShadow_1));
				lRockShadow_1.destroy();
				lRockShadow_2 && Sequence.destroy(Sequence.findByTarget(lRockShadow_2));
				lRockShadow_2.destroy();

				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			}}]);
	}

	startAnimationRock9(aSpeedScale_num = 1, aAlphadelayDuration = 57)
	{
		this._startShadowRock9Animation(aSpeedScale_num, aAlphadelayDuration);
		let lRock_1 = this._createSmallRock(1, -1.8849555921538759, {x:0.247, y: 0.1848}); //Utils.gradToRad(-108)

		let lRock1Position_seq = 
		[
			{tweens: [],duration: 1 * FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 56}, {prop: "position.y", to: -108} ],duration: 9*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 96}, {prop: "position.y", to: -94} ],duration: 4*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 122}, {prop: "position.y", to: -67} ],duration: 4*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 139}, {prop: "position.y", to: -36} ],duration: 3*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 143}, {prop: "position.y", to: -44} ],duration: 3*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 147}, {prop: "position.y", to: -48} ],duration: 4*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 153}, {prop: "position.y", to: -48} ],duration: 3*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 162}, {prop: "position.y", to: -38} ],duration: 4*FRAME_RATE*aSpeedScale_num},
		];

		let lRock1Rotation_seq = 
		[
			{tweens: [{prop: "rotation", to: -6.14355896702004}],duration: 21 * FRAME_RATE*aSpeedScale_num}, // Utils.gradToRad(-352)
			{tweens: [{prop: "rotation", to: -1.5707963267948966}],duration: 14 * FRAME_RATE*aSpeedScale_num} // Utils.gradToRad(-90)
		];


		Sequence.start(lRock_1, lRock1Position_seq);
		Sequence.start(lRock_1, this.getAlpha_seq(aAlphadelayDuration,aSpeedScale_num));
		Sequence.start(lRock_1, lRock1Rotation_seq);

		let lRock_2 = this._createSmallRock(2, 0.29670597283903605, {x:0.216, y: 0.49}); //Utils.gradToRad(17)

		let lRock2Position_seq = 
		[
			{tweens: [ {prop: "position.x", to: 35}, {prop: "position.y", to: -89} ],duration: 9*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 75}, {prop: "position.y", to: -71} ],duration: 4*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 89}, {prop: "position.y", to: -39} ],duration: 2*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 106}, {prop: "position.y", to: -8} ],duration: 2*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 107}, {prop: "position.y", to: -10} ],duration: 1*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 110}, {prop: "position.y", to: -15} ],duration: 3*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 115}, {prop: "position.y", to: -15} ],duration: 3*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 120}, {prop: "position.y", to: -5} ],duration: 2*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 123}, {prop: "position.y", to: -5} ],duration: 4*FRAME_RATE*aSpeedScale_num},
		];

		let lRock2Rotation_seq = 
		[
			{tweens: [{prop: "rotation", to: -4.4156830075456535}],duration: 17 * FRAME_RATE*aSpeedScale_num},  // Utils.gradToRad(-253)
			{tweens: [{prop: "rotation", to: 1.5707963267948966}],duration: 11 * FRAME_RATE*aSpeedScale_num} // Utils.gradToRad(90)
		];

		Sequence.start(lRock_2, lRock2Position_seq);
		Sequence.start(lRock_2, this.getAlpha_seq(aAlphadelayDuration - 3, aSpeedScale_num));
		Sequence.start(lRock_2, lRock2Rotation_seq);
		
		this._fAnimationCount_num++;
		Sequence.start(this, [
			{tweens: [],duration: (24 + aAlphadelayDuration) * FRAME_RATE*aSpeedScale_num,onfinish: ()=>{
				lRock_1 && Sequence.destroy(Sequence.findByTarget(lRock_1));
				lRock_1.destroy();
				lRock_2 && Sequence.destroy(Sequence.findByTarget(lRock_2));
				lRock_2.destroy();

				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			}}]);
	}

	_startShadowRock9Animation(aSpeedScale_num = 1, aAlphadelayDuration = 57)
	{
		let lContainer_sprt = this.addChild(new Sprite());
		lContainer_sprt.position.set(-5, -3)
		let lRockShadow_0 = lContainer_sprt.addChild(this._createShadow({x:0.8, y:0.32}, 0.55));

		let lRockShadowPosition_0_seq = 
		[
			{tweens: [ {prop: "position.x", to: 45}, {prop: "position.y", to: -22} ],duration: 9*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 119}, {prop: "position.y", to: -27} ],duration: 8*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 130}, {prop: "position.y", to: -28} ],duration: 4*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 136}, {prop: "position.y", to: -27} ],duration: 2*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 152}, {prop: "position.y", to: -28} ],duration: 8*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 165}, {prop: "position.y", to: -28} ],duration: 4*FRAME_RATE*aSpeedScale_num},
		];

		Sequence.start(lRockShadow_0, lRockShadowPosition_0_seq);
		Sequence.start(lRockShadow_0, this.getAlphaShadow_seq(4, aAlphadelayDuration - 4, aSpeedScale_num));

		let lRockShadow_1 = lContainer_sprt.addChild(this._createShadow({x:0.39, y:0.22}, 0.55));

		let lRockShadowPosition_1_seq = 
		[
			{tweens: [ {prop: "position.x", to: 45}, {prop: "position.y", to: 0} ],duration: 7*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 105}, {prop: "position.y", to: 0} ],duration: 10*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 114}, {prop: "position.y", to: 0} ],duration: 5*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 119}, {prop: "position.y", to: 0} ],duration: 5*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 120}, {prop: "position.y", to: 0} ],duration: 5*FRAME_RATE*aSpeedScale_num},
		];
		Sequence.start(lRockShadow_1, lRockShadowPosition_1_seq);
		Sequence.start(lRockShadow_1, this.getAlphaShadow_seq(9, aAlphadelayDuration - 12, aSpeedScale_num));
		
		Sequence.start(this, [
			{tweens: [],duration: (24 + aAlphadelayDuration) * FRAME_RATE*aSpeedScale_num,onfinish: ()=>{
				lRockShadow_0 && Sequence.destroy(Sequence.findByTarget(lRockShadow_0));
				lRockShadow_0.destroy()
				lRockShadow_1 && Sequence.destroy(Sequence.findByTarget(lRockShadow_1));
				lRockShadow_1.destroy()
			}}]);
	}
	
	startAnimationRock12(aSpeedScale_num = 1)
	{
		let lRock = this._createSmallRock(3, 0, {x:0.3926, y: 0.7854});

		let lRock1Position_seq = 
		[
			{tweens: [],duration: 1 * FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 302}, {prop: "position.y", to: -1056} ],duration: 28*FRAME_RATE*aSpeedScale_num},
		];

		let lRock1Rotation_seq = 
		[
			{tweens: [{prop: "rotation", to: 4.869468613064179}],duration: 29 * FRAME_RATE*aSpeedScale_num}, // Utils.gradToRad(279)
		];


		Sequence.start(lRock, lRock1Position_seq);
		Sequence.start(lRock, lRock1Rotation_seq);	

		this._fAnimationCount_num++;
		Sequence.start(this, [
			{tweens: [],duration: 30 * FRAME_RATE*aSpeedScale_num,onfinish: ()=>{
				lRock && Sequence.destroy(Sequence.findByTarget(lRock));
				lRock.destroy();

				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			}}]);
	}
	
	startAnimationRock13(aSpeedScale_num = 1)
	{
		let lRock = this._createSmallRock(0, 0, {x:0.3926, y: 0.7854});

		let lRock1Position_seq = 
		[
			{tweens: [],duration: 1 * FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 302}, {prop: "position.y", to: -1124} ],duration: 28*FRAME_RATE*aSpeedScale_num},
		];

		let lRock1Rotation_seq = 
		[
			{tweens: [{prop: "rotation", to: 4.869468613064179}],duration: 29 * FRAME_RATE*aSpeedScale_num}, // Utils.gradToRad(279)
		];


		Sequence.start(lRock, lRock1Position_seq);
		Sequence.start(lRock, lRock1Rotation_seq);	

		this._fAnimationCount_num++;
		Sequence.start(this, [
			{tweens: [],duration: 30 * FRAME_RATE*aSpeedScale_num,onfinish: ()=>{
				lRock && Sequence.destroy(Sequence.findByTarget(lRock));
				lRock.destroy();

				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			}}]);
	}

	startAnimationRock14(aSpeedScale_num = 1)
	{
		let lRock_2 = this._createSmallRock(2, -1.4486232791552935, {x:1.4805, y: 1.428}); //Utils.gradToRad(-83)

		let lRock1Position_seq = 
		[
			{tweens: [],duration: 1 * FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 302}, {prop: "position.y", to: -1056} ],duration: 28*FRAME_RATE*aSpeedScale_num},
		];

		let lRock1Rotation_seq = 
		[
			{tweens: [{prop: "rotation", to: 1.239183768915974}],duration: 28 * FRAME_RATE*aSpeedScale_num}, // Utils.gradToRad(71)
		];


		Sequence.start(lRock_2, lRock1Position_seq);
		Sequence.start(lRock_2, lRock1Rotation_seq);	

		this._fAnimationCount_num++;
		Sequence.start(this, [
			{tweens: [],duration: 30 * FRAME_RATE*aSpeedScale_num,onfinish: ()=>{
				lRock_2 && Sequence.destroy(Sequence.findByTarget(lRock_2));
				lRock_2.destroy();

				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			}}]);
	}
	
	startJumpSmoke(aSpeedScale_num = 1)
	{
		let lSmoke_sprt = this.addChild(APP.library.getSpriteFromAtlas("boss_mode/earth/smoke_7"));
		lSmoke_sprt.scale.set(0.62, 0.86);
		lSmoke_sprt.anchor.set(0.5, 0.5);
		lSmoke_sprt.alpha = 0.1;
		this._fShadow_sprt_arr.push(lSmoke_sprt);

		let lAplha_seq =
		[
			{tweens: [{prop: "alpha", to: 0.8}],duration: 4 * FRAME_RATE*aSpeedScale_num},
			{tweens: [],duration: 6 * FRAME_RATE*aSpeedScale_num},
			{tweens: [{prop: "alpha", to: 0.4}],duration: 8 * FRAME_RATE*aSpeedScale_num},
			{tweens: [{prop: "alpha", to: 0}],duration: 4 * FRAME_RATE*aSpeedScale_num},
		];
		Sequence.start(lSmoke_sprt, lAplha_seq);

		let lScale_seq = 
		[
			{tweens: [{prop: "scale.y", to: 1.39}],duration: 11 * FRAME_RATE*aSpeedScale_num},
			{tweens: [{prop: "scale.y", to: 0.86}],duration: 11 * FRAME_RATE*aSpeedScale_num},
		];
		Sequence.start(lSmoke_sprt, lScale_seq);

		let lPosition_seq = 
		[
			{tweens: [{prop: "position.y", to: -206}],duration: 11 * FRAME_RATE*aSpeedScale_num},
			{tweens: [{prop: "position.y", to: 0}],duration: 11 * FRAME_RATE*aSpeedScale_num},
		];
		Sequence.start(lSmoke_sprt, lPosition_seq);

		let lRock_3 = this._createSmallRock(3, 0, {x:0, y: 0});
		lRock_3.position.set(40, -50);

		let lRock_2 = this._createSmallRock(2, 0, {x:0.04, y: 0.04});
		lRock_2.position.set(-81, -57);

		let lRockSecond_2 = this._createSmallRock(2, 0, {x:0.47, y: 0.47});

		let lRotationRock_seq = 
		[
			{tweens: [{prop: "rotation", to: 2.321287905152458}],duration: 2 * FRAME_RATE*aSpeedScale_num}, // Utils.gradToRad(133)
		];

		let lScaleRock_seq = 
		[
			{tweens: [{prop: "scale.x", to: 0.18}, {prop: "scale.y", to: 0.18}],duration: 6 * FRAME_RATE*aSpeedScale_num},
			{tweens: [],duration: 11 * FRAME_RATE*aSpeedScale_num},
			{tweens: [{prop: "scale.x", to: 0}, {prop: "scale.y", to: 0}],duration: 3 * FRAME_RATE*aSpeedScale_num},
		];
		
		let lPositionRock_seq = [
			{tweens: [{prop: "position.y", to: -600}],duration: 9 * FRAME_RATE*aSpeedScale_num},
			{tweens: [{prop: "position.y", to: 0}],duration: 11 * FRAME_RATE*aSpeedScale_num},
		];

		let lScaleRockSecond_seq = 
		[
			{tweens: [{prop: "scale.x", to: 0.18}, {prop: "scale.y", to: 0.35}],duration: 6 * FRAME_RATE*aSpeedScale_num},
			{tweens: [],duration: 11 * FRAME_RATE*aSpeedScale_num},
			{tweens: [{prop: "scale.x", to: 0}, {prop: "scale.y", to: 0}],duration: 3 * FRAME_RATE*aSpeedScale_num},
		];
	
		Sequence.start(lRockSecond_2, lRotationRock_seq);
		Sequence.start(lRockSecond_2, lPositionRock_seq);
		Sequence.start(lRockSecond_2, lScaleRockSecond_seq);

		
		Sequence.start(lRock_2, lRotationRock_seq);
		Sequence.start(lRock_2, lPositionRock_seq);
		Sequence.start(lRock_2, lScaleRock_seq);

		
		Sequence.start(lRock_3, lRotationRock_seq);
		Sequence.start(lRock_3, lPositionRock_seq);
		Sequence.start(lRock_3, lScaleRock_seq);
		
		this._fAnimationCount_num++;
		Sequence.start(this, [
			{tweens: [],duration: 25 * FRAME_RATE*aSpeedScale_num,onfinish: ()=>{
				lRockSecond_2 && Sequence.destroy(Sequence.findByTarget(lRockSecond_2));
				lRockSecond_2.destroy();
				
				lRock_2 && Sequence.destroy(Sequence.findByTarget(lRock_2));
				lRock_2.destroy();
				
				lRock_3 && Sequence.destroy(Sequence.findByTarget(lRock_3));
				lRock_3.destroy();

				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			}}]);
	}

	_onAnimationCompletedSuspicison()
	{
		if (this._fAnimationCount_num == 0)
		{
			this.emit(EarthSmallStoneRock.EVENT_ON_ANIMATION_ENDED);
		}
	}	

	destroy(options)
	{
		this && Sequence.destroy(Sequence.findByTarget(this));
		
		for (let l_spr of this.children)
		{
			Sequence.destroy(Sequence.findByTarget(l_spr));
			l_spr && l_spr.destroy();
		}

		for (let i = 0; i < this._fRock_sprt_arr.length; i++) {
			this._fRock_sprt_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fRock_sprt_arr[i]));
			this._fRock_sprt_arr[i].destroy();
		}
		this._fRock_sprt_arr = [];

		for (let i = 0; i < this._fShadow_sprt_arr.length; i++) {
			this._fShadow_sprt_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fShadow_sprt_arr[i]));
			this._fShadow_sprt_arr[i].destroy();
		}
		this._fShadow_sprt_arr = [];

		super.destroy(options);
	}
}
export default EarthSmallStoneRock;
