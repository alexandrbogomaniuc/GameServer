import Sprite from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import * as Easing from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { APP } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../../../../shared/src/CommonConstants';
import { Sequence } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import { Utils } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';

const INTRO_LIGHTNING_PARAM =[
	{
		position: {x: 153, y: 239.5}, //y: 269.5 - 30
		rotation: -0.8011061266653973, //Utils.gradToRad(-45.9)
		scale: {x: 1, y: 1},
		asset: "1"		
	},
	{
		position: {x: 152.7, y: 215.8}, //x: 157.7 - 5, y: 235.8 - 20
		rotation: -0.8325220532012952, //Utils.gradToRad(-47.7)
		scale: {x: 1, y: 1},
		asset: "2"
	},
	{
		position: {x: 127.3, y: 232.8}, //{x: 113.3 + 14, y: 266.8 - 34
		rotation: -0.6422811647339132, //Utils.gradToRad(-36.8)
		scale: {x: 1.23, y: 1.23},
		asset: "4"
	},
	{
		position: {x: 160.5, y: 226.5}, //x: 160.5, y: 256.5 - 30
		rotation: 0.9232791743050003, //Utils.gradToRad(52.9)
		scale: {x: -1.12, y: 1.12},
		asset: "1"
	},
	{
		position: {x: 127.4, y: 229.7}, //x: 117.4 + 10, y: 249.7 - 20
		rotation: -0.6597344572538565, //Utils.gradToRad(-37.8)
		scale: {x: 1.25, y: 1.25},
		asset: "4"
	},
	{
		position: {x: 149, y: 217.2}, //x: 153 - 4, y: 232.2 - 15
		rotation: -0.8709192967451703, //Utils.gradToRad(-49.9)
		scale: {x: 1, y: 1},
		asset: "2"
	}
];

class LightningBossLightningMommiesAnimation extends Sprite
{
	static get EVENT_ON_ANIMATION_ENDED()				{return "onMommiesAnimationEnded";}

	i_startAnimation()
	{
		this._startAnimation();
	}

	constructor()
	{
		super();
		
		this._fAnimationCount_num = null;

		this._fIntroLightning8Container_spr = this.addChild(new Sprite());
		this._fIntroLightning124Container_spr = this.addChild(new Sprite());
		this._fIntroLightningparticleContainer_spr = this.addChild(new Sprite());
		this._fIntroLightningparticleContainerOne_spr = this._fIntroLightningparticleContainer_spr.addChild(new Sprite());
		this._fIntroLightningparticleContainerTwo_spr = this._fIntroLightningparticleContainer_spr.addChild(new Sprite());

		this._fLightning8_arr = [];
		this._fIntroLightningCircle_spr = null;
		this._fIntroLightning124_arr = [];
		this._fIntroLightning4_spr = null;

		this._fIntroLightningParticleOne_spr = null;
		this._fIntroLightningParticleTwo_spr = null;

		this._fIsNeedIntroLightParticleWiggleOne_bl = null;
		this._fIsNeedIntroLightParticleWiggleTwo_bl = null;
	}

	_startAnimation()
	{
		this._fAnimationCount_num = 0;

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startIntroLightCircle();
		}

		this._startIntroLightning8();
		this._startIntroLightning124();
		this._startIntroLightning4();

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startIntroLightParticle();
		}
	}

	_startIntroLightning8()
	{
		let lLightning8_1_spr = this._fIntroLightning8Container_spr.addChild(APP.library.getSpriteFromAtlas('boss_mode/lightning/lightning_8'));
		lLightning8_1_spr.position.set(149, 187.5);
		lLightning8_1_spr.blendMode = PIXI.BLEND_MODES.ADD;

		let lLightning8_2_spr = this._fIntroLightning8Container_spr.addChild(APP.library.getSpriteFromAtlas('boss_mode/lightning/lightning_8'));
		lLightning8_2_spr.position.set(151, 187.5);
		lLightning8_2_spr.blendMode = PIXI.BLEND_MODES.ADD;

		let lLightning8_3_spr = this._fIntroLightning8Container_spr.addChild(APP.library.getSpriteFromAtlas('boss_mode/lightning/lightning_8'));
		lLightning8_3_spr.position.set(153, 187.5);
		lLightning8_3_spr.blendMode = PIXI.BLEND_MODES.ADD;

		this._fLightning8_arr.push(lLightning8_1_spr);
		this._fLightning8_arr.push(lLightning8_2_spr);
		this._fLightning8_arr.push(lLightning8_3_spr);

		this._fIntroLightning8Container_spr.alpha = 0.8;

		let l_seq = [
			{tweens: [{prop: 'alpha', to: 0}], duration: 15 * FRAME_RATE, ease: Easing.quadratic.easeInOut,
				onfinish: ()=>{
					this._fAnimationCount_num--;
					lLightning8_1_spr && lLightning8_1_spr.destroy();
					lLightning8_2_spr && lLightning8_2_spr.destroy();
					lLightning8_3_spr && lLightning8_3_spr.destroy();

					this._fLightning8_arr = [];
					this._onIntroAnimationCompletedSuspicison();
			}}
		]

		this._fAnimationCount_num++;
		Sequence.start(this._fIntroLightning8Container_spr, l_seq);
	}


	_startIntroLightCircle()
	{
		let lLightningCircle_spr = this._fIntroLightningCircle_spr = this._fIntroLightning124Container_spr.addChild(APP.library.getSpriteFromAtlas('boss_mode/lightning/light_circle'));
		lLightningCircle_spr.position.set(145.9, 308); //416 - 108
		lLightningCircle_spr.alpha = 0.4;
		lLightningCircle_spr.scale.set(0.36, 0.19);

		let l_seq = [
			{tweens: [], duration: 1*FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 0.693}, {prop: 'scale.y', to: 0.342}], duration: 2 * FRAME_RATE},
			{tweens: [{prop: 'scale.x', to: 0.89}, {prop: 'scale.y', to: 0.432}, {prop: 'alpha', to: 0.06}], duration: 4 * FRAME_RATE, ease: Easing.quadratic.easeInOut,
				onfinish: ()=>{
					this._fAnimationCount_num--;
					lLightningCircle_spr && lLightningCircle_spr.destroy();
					this._onIntroAnimationCompletedSuspicison();
			}}
		]

		this._fAnimationCount_num++;
		Sequence.start(lLightningCircle_spr, l_seq);
	}

	_startIntroLightning124()
	{
		for (let i = 0; i < INTRO_LIGHTNING_PARAM.length; i++)
		{
			this._fAnimationCount_num++;
			this._startIntroLightningOnce(i);
		}
	}

	_startIntroLightningOnce(aIndex)
	{
		let param = INTRO_LIGHTNING_PARAM[aIndex];
		let lLightning_spr = this._fIntroLightning124_arr[aIndex] = this.addChild(APP.library.getSpriteFromAtlas('boss_mode/lightning/lightning_'+param.asset));
	
		lLightning_spr.alpha = aIndex == 0 ? 1: 0;
		lLightning_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lLightning_spr.position = param.position;
		lLightning_spr.scale = param.scale;
		lLightning_spr.rotation = param.rotation;


		let l_seq = [
			{tweens: [], duration: 2 * aIndex * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}], duration: 0 * FRAME_RATE},
			{tweens: [], duration: 2 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0}], duration: 0 * FRAME_RATE,
					onfinish: ()=>{
						this._fIntroLightning124_arr[aIndex] && this._fIntroLightning124_arr[aIndex].destroy();
						this._fAnimationCount_num--;
						this._onIntroAnimationCompletedSuspicison();
			}}
		]

		Sequence.start(lLightning_spr, l_seq);
	}


	_startIntroLightning4()
	{
		let lLightning_spr = this._fIntroLightning4_spr = this.addChild(APP.library.getSpriteFromAtlas('boss_mode/lightning/lightning_4'));

		lLightning_spr.alpha = 0;
		lLightning_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lLightning_spr.position.set(127.3, 232.8); //113.3 + 14, 266.8 - 34
		lLightning_spr.scale.set(1.23, 1.23);
		lLightning_spr.rotation = -0.6422811647339132; //Utils.gradToRad(-36.8);


		let l_seq = [
			{tweens: [], duration: 12 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 1}], duration: 0 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0}], duration: 16 * FRAME_RATE,
					onfinish: ()=>{
						lLightning_spr && lLightning_spr.destroy();
						this._fAnimationCount_num--;
						this._onIntroAnimationCompletedSuspicison();
			}}
		]

		this._fAnimationCount_num++;
		Sequence.start(lLightning_spr, l_seq);
	}


	_startIntroLightParticle()
	{
		let lLightningParticleOne_spr = this._fIntroLightningParticleOne_spr = this._fIntroLightningparticleContainerOne_spr.addChild(APP.library.getSprite('common/light_particle'));
		lLightningParticleOne_spr.position.set(150.9, 306.7); //150.9, 414.7 - 108
		lLightningParticleOne_spr.alpha = 0.6;
		lLightningParticleOne_spr.scale.set(2.46, 2.46);
		lLightningParticleOne_spr.rotation = -0.12915436464758037; //Utils.gradToRad(-7.4);

		let l_seq = [
			{tweens: [], duration: 12 * FRAME_RATE,
				onfinish: ()=>{
					lLightningParticleOne_spr && lLightningParticleOne_spr.destroy();
					this._fIsNeedIntroLightParticleWiggleOne_bl = false;
					this._fAnimationCount_num--;
					this._onIntroAnimationCompletedSuspicison();
			}}
		]

		this._fAnimationCount_num++;
		Sequence.start(lLightningParticleOne_spr, l_seq);

		this._fIsNeedIntroLightParticleWiggleOne_bl = true;
		this._fAnimationCount_num++;
		this._startIntroLightParticleWiggleOne();


		let lLightningParticleTwo_spr = this._fIntroLightningParticleTwo_spr = this._fIntroLightningparticleContainerTwo_spr.addChild(APP.library.getSprite('common/light_particle'));
		lLightningParticleTwo_spr.position.set(150.9, 306.7); //150.9, 414.7 - 108
		lLightningParticleTwo_spr.alpha = 0.6;
		lLightningParticleTwo_spr.scale.set(2.46, 2.46);
		lLightningParticleTwo_spr.rotation = -0.12915436464758037; //Utils.gradToRad(-7.4);

		let lt_seq = [
			{tweens: [], duration: 12 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0.97}], duration: 0 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0}], duration: 39 * FRAME_RATE,
				onfinish: ()=>{
					this._fAnimationCount_num--;
					lLightningParticleTwo_spr && lLightningParticleTwo_spr.destroy();
					this._fIsNeedIntroLightParticleWiggleTwo_bl = false;
					this._onIntroAnimationCompletedSuspicison();
			}}
		]

		this._fAnimationCount_num++;
		Sequence.start(lLightningParticleTwo_spr, lt_seq);

		this._fIsNeedIntroLightParticleWiggleTwo_bl = true;
		this._fAnimationCount_num++;
		this._startIntroLightParticleWiggleTwo();
	}

	_startIntroLightParticleWiggleOne()
	{  
		let l_seq = [
			{tweens: [{prop: 'alpha', to: 0.6 * Utils.getRandomWiggledValue(0.75, 0.25)}], duration: 1 * FRAME_RATE,
				onfinish: ()=>{
					if (this._fIsNeedIntroLightParticleWiggleOne_bl)
					{
						this._startIntroLightParticleWiggleOne();
					}
					else
					{
						this._fAnimationCount_num--;
						this._onIntroAnimationCompletedSuspicison();
					}
			}}
		]

		Sequence.start(this._fIntroLightningparticleContainerOne_spr, l_seq);
	}

	_startIntroLightParticleWiggleTwo()
	{  
		let l_seq = [
			{tweens: [{prop: 'alpha', to: 0.6 * Utils.getRandomWiggledValue(0.9, 0.1)}], duration: 1 * FRAME_RATE,
				onfinish: ()=>{
					if (this._fIsNeedIntroLightParticleWiggleTwo_bl)
					{
						this._startIntroLightParticleWiggleTwo();
					}
					else
					{
						this._fAnimationCount_num--;
						this._onIntroAnimationCompletedSuspicison();
					}
			}}
		]

		Sequence.start(this._fIntroLightningparticleContainerTwo_spr, l_seq);
	}


	_onIntroAnimationCompletedSuspicison()
	{
		if (this._fAnimationCount_num == 0)
		{
			this.emit(LightningBossLightningMommiesAnimation.EVENT_ON_ANIMATION_ENDED);
		}
	}


	destroy()
	{
		super.destroy();

		for (let i = 0; i < INTRO_LIGHTNING_PARAM.length; i++)
		{
			if (!this._fIntroLightning124_arr)
			{
				break;
			}

			this._fIntroLightning124_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fIntroLightning124_arr[i]));
			this._fIntroLightning124_arr[i] && this._fIntroLightning124_arr[i].destroy();
			this._fIntroLightning124_arr[i] = null;
		}

		this._fIntroLightning124_arr = null;


		if (this._fLightning8_arr)
		{
			for (let i = 0; i < this._fLightning8_arr.length; i++)
			{
				if (!this._fLightning8_arr[i])
				{
					continue;
				}

				this._fLightning8_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fLightning8_arr[i]));
				this._fLightning8_arr[i] && this._fLightning8_arr[i].destroy();
				this._fLightning8_arr[i] = null;
			}
		}

		this._fLightning8_arr = null;

		this._fIntroLightningCircle_spr && Sequence.destroy(Sequence.findByTarget(this._fIntroLightningCircle_spr));
		this._fIntroLightning4_spr && Sequence.destroy(Sequence.findByTarget(this._fIntroLightning4_spr));
		this._fIntroLightningParticleOne_spr && Sequence.destroy(Sequence.findByTarget(this._fIntroLightningParticleOne_spr));
		this._fIntroLightningParticleTwo_spr && Sequence.destroy(Sequence.findByTarget(this._fIntroLightningParticleTwo_spr));
		this._fIntroLightningparticleContainerOne_spr && Sequence.destroy(Sequence.findByTarget(this._fIntroLightningparticleContainerOne_spr));
		this._fIntroLightningparticleContainerTwo_spr && Sequence.destroy(Sequence.findByTarget(this._fIntroLightningparticleContainerTwo_spr));
	
		this._fIntroLightningCircle_spr = null;
		this._fIntroLightning4_spr = null;
		this._fIntroLightningParticleOne_spr = null;
		this._fIntroLightningParticleTwo_spr = null;
		this._fIsNeedIntroLightParticleWiggleOne_bl = null;
		this._fIsNeedIntroLightParticleWiggleTwo_bl = null;

	}
}

export default LightningBossLightningMommiesAnimation;