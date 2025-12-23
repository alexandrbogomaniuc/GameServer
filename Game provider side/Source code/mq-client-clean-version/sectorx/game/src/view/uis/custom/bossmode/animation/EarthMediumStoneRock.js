
import { FRAME_RATE } from '../../../../../../../shared/src/CommonConstants';
import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { Utils } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import Sequence from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import Sprite from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import * as Easing from '../../../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import AtlasConfig from '../../../../../config/AtlasConfig';
import { AtlasSprite } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';

function _crateStoneFallTextures()
{
	return AtlasSprite.getFrames(APP.library.getAsset("boss_mode/earth/stone_fall"), AtlasConfig.StoneFall, "");
}

const SMOKE_SETTING =[
	{
		position: {x: 0, y: 0},
		rotation: 0
	},
	{
		position: {x: 54, y: -58},
		rotation: 0.8028514559173915 //Utils.gradToRad(46)
	},
	{
		position: {x: 95, y: -102},
		rotation: 0.8028514559173915 //Utils.gradToRad(46)
	},
	{
		position: {x: 129, y: -131},
		rotation: 1.9198621771937625 //Utils.gradToRad(110)
	},
	{
		position: {x: 153, y: -159},
		rotation: 2.548180707911721 //Utils.gradToRad(146)
	},
	{
		position: {x: 202, y: -167},
		rotation: 0
	},
	{
		position: {x: 228, y: -159},
		rotation: 0.8028514559173915 //Utils.gradToRad(46)
	},
	{
		position: {x: 304, y: -137},
		rotation: 0.8028514559173915 //Utils.gradToRad(46)
	},
	{
		position: {x: 348, y: -98},
		rotation: 1.9198621771937625 //Utils.gradToRad(110)
	},
	{
		position: {x: 374, y: -51},
		rotation: 2.548180707911721 //Utils.gradToRad(146)
	}
];

const MEDIUM_ROCK_SETTING = [
	{
		shadowScale: {x:3.61, y:1.21},
		finalRotation: -0.03490658503988659 // Utils.gradToRad(-2)
	},
	{
		shadowScale: {x:2.66, y:0.89},
		finalRotation: -0.03490658503988659 // Utils.gradToRad(-2)
	},
	{
		shadowScale: {x:3.61, y:1.21},
		finalRotation: -0.03490658503988659 // Utils.gradToRad(-2)
	},
	{
		shadowScale: {x:2.66, y:0.89},
		finalRotation: 1.780235837034216 // Utils.gradToRad(102)
	},
]


class EarthMediumStoneRock extends Sprite {

	static get EVENT_ON_ANIMATION_ENDED()				{return "onAnimationEnded";}

	constructor()
	{
		super();

		this._fAnimationCount_num = null;
		this._fSmoke_sprt_arr = [];
		this._fShadow_sprt_arr = [];
		this._fRock_sprt_arr = [];
		this._fParticles_arr = [];
		this._createSmokeTrail();
	}

	_createMediumRock(aNum, aRotation_num, aScale_obj)
	{
		if(aNum > 4) return;
		let lRock = this.addChild(APP.library.getSpriteFromAtlas("boss_mode/earth/mrock_" + (aNum)))
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

	_createSmoke(aRotation_num, aScale_obj)
	{
		let lSmoke = this.addChild(APP.library.getSpriteFromAtlas("boss_mode/earth/smoke_7"))
		lSmoke.rotation = aRotation_num;
		lSmoke.anchor.set(0.5, 0.5);
		lSmoke.scale.set(aScale_obj.x, aScale_obj.y)

		this._fSmoke_sprt_arr.push(lSmoke);

		return lSmoke;
	}

	_createSmokeTrail()
	{
		for (let i = 0; i < SMOKE_SETTING.length; i++) {
			let lSmoke = this._createSmoke(SMOKE_SETTING[i].rotation,{x: 0.23, y: 0.23});
			lSmoke.position.set(SMOKE_SETTING[i].position.x, SMOKE_SETTING[i].position.y);
			lSmoke.alpha = 0.1
			lSmoke.visible = false;
		}
	}

	startSmokeTrailAnimation(aSpeedScale_num = 1)
	{
		this._fAnimationCount_num = 0;
		
		let lTimer_seq = []
		for (let i = 0; i < SMOKE_SETTING.length; i++) {
			lTimer_seq.push({tweens: [],duration: i * FRAME_RATE*aSpeedScale_num,
				onfinish: ()=> {
					this._startSingleSmokeTrailAnimation(this._fSmoke_sprt_arr[i], SMOKE_SETTING[i].rotation, aSpeedScale_num);
				}});
		}

		lTimer_seq.push({tweens: [],duration: 0 * FRAME_RATE,
			onfinish: ()=> {
				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
		}});

		this._fAnimationCount_num++;
		Sequence.start(this, lTimer_seq);
	}

	_startSingleSmokeTrailAnimation(aSmoke_sprt, aCurrentRotation_num, aSpeedScale_num = 1)
	{
		aSmoke_sprt.visible = true;

		let lRotation_seq = 
		[
			{tweens: [{prop: "rotation", to: aCurrentRotation_num + 0.6457718232379019}],duration: 53 * FRAME_RATE*aSpeedScale_num, ease:Easing.sine.easeIn, //aCurrentRotation_num + Utils.gradToRad(37)
				onfinish: ()=> {
					aSmoke_sprt.visible = false;
					this._fAnimationCount_num--;
					this._onAnimationCompletedSuspicison();
				}
			}
		];
		
		let lScale_seq = 
		[
			{tweens: [{prop: "scale.x", to: 0.77*3}, {prop: "scale.y", to: 0.77*3}],duration: 53 * FRAME_RATE*aSpeedScale_num, ease:Easing.sine.easeIn,
			onfinish: ()=> {
				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			}},
		];

		let lAlpha_seq = 
		[
			{tweens: [{prop: "alpha", to: 0.8}],duration: 2 * FRAME_RATE*aSpeedScale_num, ease:Easing.sine.easeIn },
			{tweens: [{prop: "alpha", to: 0}],duration: 51 * FRAME_RATE*aSpeedScale_num, ease:Easing.sine.easeOut,
			onfinish: ()=> {
				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			}},
		];
		
		this._fAnimationCount_num += 3;
		Sequence.start(aSmoke_sprt, lRotation_seq);
		Sequence.start(aSmoke_sprt, lScale_seq);
		Sequence.start(aSmoke_sprt, lAlpha_seq);
	}

	startStoneAnimation(aNum_num = 0, aSpeedScale_num = 1)
	{
		this._fAnimationCount_num = 0;

		if(aNum_num > 3) return;

		let lShadow_sprt = this._createShadow(MEDIUM_ROCK_SETTING[aNum_num].shadowScale, 0);
		lShadow_sprt.position.set(374,aNum_num == 3 ? 75 : 82)

		let lShadowAlpha_seq =
		[
			{tweens: [],duration: 13 * FRAME_RATE*aSpeedScale_num},
			{tweens: [{prop: "alpha", to: 0.8}],duration: 3 * FRAME_RATE*aSpeedScale_num,
			onfinish: ()=> {
				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			}},
		];

		let lShadowPosition_seq = 
		[
			{tweens: [],	duration: 13*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 390} ],	duration: 3*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 410} ],	duration: 5*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 438} ],	duration: 6*FRAME_RATE*aSpeedScale_num,
				onfinish: ()=> {
					lShadow_sprt.fadeTo(0, 5*FRAME_RATE, undefined, ()=>{
						this._fAnimationCount_num--;
						this._onAnimationCompletedSuspicison();
					});
				}
			},
		];

		this._fAnimationCount_num +=2;
		Sequence.start(lShadow_sprt, lShadowAlpha_seq);
		Sequence.start(lShadow_sprt, lShadowPosition_seq);

		this.startSmokeTrailAnimation(aSpeedScale_num / 2.5);
		let lRock_sprt = this._createMediumRock(aNum_num,-3.6302848441482056,{x:0.55, y:0.55}); //Utils.gradToRad(-208)
		lRock_sprt.alpha = 0.05;

		let lScale_seq = [
			{tweens: [{prop: "scale.x", to: 1}, {prop: "scale.y", to: 1}],duration: 11 * FRAME_RATE*aSpeedScale_num,
			onfinish: ()=> {
				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			}},
		];
		
		let lRotation_seq = 
		[
			{tweens: [{prop: "rotation", to: 0.715584993317675}],duration: 16 * FRAME_RATE*aSpeedScale_num}, //Utils.gradToRad(41)
			{tweens: [{prop: "rotation", to: 0}],duration: 3 * FRAME_RATE*aSpeedScale_num}, //Utils.gradToRad(0)
			{tweens: [{prop: "rotation", to: -0.03490658503988659}],duration: 2 * FRAME_RATE*aSpeedScale_num}, //Utils.gradToRad(-2)
			{tweens: [{prop: "rotation", to: 0.06981317007977318}],duration: 2 * FRAME_RATE*aSpeedScale_num}, //Utils.gradToRad(4)
			{tweens: [{prop: "rotation", to: 0.13962634015954636}],duration: 2 * FRAME_RATE*aSpeedScale_num}, //Utils.gradToRad(8)
			{tweens: [{prop: "rotation", to: MEDIUM_ROCK_SETTING[aNum_num].finalRotation}],duration: 2 * FRAME_RATE*aSpeedScale_num,
			onfinish: ()=> {
				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			}},
		];

		let lAlpha_seq = 
		[
			{tweens: [{prop: "alpha", to: 1}],duration: 5 * FRAME_RATE*aSpeedScale_num},
			{tweens: [],duration: 24 * FRAME_RATE*aSpeedScale_num},
			{tweens: [{prop: "alpha", to: 0}],duration: 5 * FRAME_RATE*aSpeedScale_num,
			onfinish: ()=> {
					this._fAnimationCount_num--;
					this._onAnimationCompletedSuspicison();
			}}
		];

		let lPosition_seq = 
		[
			{tweens: [ {prop: "position.x", to: 181}, {prop: "position.y", to: -196} ],	duration: 7*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 374}, {prop: "position.y", to: -51} ],		duration: 9*FRAME_RATE*aSpeedScale_num},
			{tweens: [ {prop: "position.x", to: 422}, {prop: "position.y", to: 64} ],	duration: 6*FRAME_RATE*aSpeedScale_num, 
				onfinish: ()=>{
					this._startStoneFallAnimation({x:432, y:80}, 0, 1)
				}},
			{tweens: [ {prop: "position.x", to: 437}, {prop: "position.y", to: 52} ],	duration: 3*FRAME_RATE*aSpeedScale_num, ease:Easing.sine.easeIn},
			{tweens: [ {prop: "position.x", to: 440}, {prop: "position.y", to: 65} ],	duration: 4*FRAME_RATE*aSpeedScale_num, ease:Easing.sine.easeOut,
				onfinish: ()=> {
						this._fAnimationCount_num--;
						this._onAnimationCompletedSuspicison();
				}
			},
		];

		this._fAnimationCount_num +=4;
		Sequence.start(lRock_sprt, lScale_seq);
		Sequence.start(lRock_sprt, lRotation_seq);
		Sequence.start(lRock_sprt, lAlpha_seq);
		Sequence.start(lRock_sprt, lPosition_seq);
	}

	_startStoneFallAnimation(aPos_obj, aRot_num, aOptScale_num = 1)
	{
		let lParticle_sprt = this.addChild(new Sprite());
		this._fParticles_arr.push(lParticle_sprt);
		lParticle_sprt.textures = _crateStoneFallTextures();
		lParticle_sprt.scale.set(aOptScale_num);
		lParticle_sprt.rotation = aRot_num;
		lParticle_sprt.position.set(aPos_obj.x, aPos_obj.y);
		lParticle_sprt.anchor.set(0.5,0.67);
		lParticle_sprt.animationSpeed = 0.5; //30/60;
		lParticle_sprt.on('animationend', () => {
			let id = this._fParticles_arr.indexOf(lParticle_sprt);
			if (~id)
			{
				this._fParticles_arr.splice(id, 1);
			}
			lParticle_sprt.fadeTo(0, 5*FRAME_RATE, undefined, ()=>{
				lParticle_sprt.destroy();
				this._fAnimationCount_num--;
				this._onAnimationCompletedSuspicison();
			});
		});

		this._fAnimationCount_num++;
		lParticle_sprt.play();
	}

	_onAnimationCompletedSuspicison()
	{
		if (this._fAnimationCount_num == 0)
		{
			this.emit(EarthMediumStoneRock.EVENT_ON_ANIMATION_ENDED);
			this.destroy();
		}
	}

	destroy()
	{
		for (let i = 0; i < this._fSmoke_sprt_arr.length; i++)
		{
			this._fSmoke_sprt_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fSmoke_sprt_arr[i]));
			this._fSmoke_sprt_arr[i] && this._fSmoke_sprt_arr[i].destroy();
		}
		this._fSmoke_sprt_arr = [];

		for (let i = 0; i < this._fShadow_sprt_arr.length; i++)
		{
			this._fShadow_sprt_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fShadow_sprt_arr[i]));
			this._fShadow_sprt_arr[i] && this._fShadow_sprt_arr[i].destroy();
		}
		this._fShadow_sprt_arr = [];

		for (let i = 0; i < this._fRock_sprt_arr.length; i++)
		{
			this._fRock_sprt_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fRock_sprt_arr[i]));
			this._fRock_sprt_arr[i] && this._fRock_sprt_arr[i].destroy();
		}
		this._fRock_sprt_arr = [];

		for (let i = 0; i < this._fParticles_arr.length; i++)
		{
			this._fParticles_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fParticles_arr[i]));
			this._fParticles_arr[i] && this._fParticles_arr[i].destroy();
		}
		this._fParticles_arr = [];

		Sequence.destroy(Sequence.findByTarget(this));

		this._fAnimationCount_num = null;

		super.destroy();
	}
}

export default EarthMediumStoneRock;