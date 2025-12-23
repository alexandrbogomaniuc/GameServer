import { APP } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sprite from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { Utils } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import { FRAME_RATE } from '../../../../../../../../shared/src/CommonConstants';
import Sequence from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';


const CRACK_SETTING_0 = 
[
	{
		position: {x: 0, y: 50},
		rotation: 0,
		scale:  {x: 0.5, y: 0.5}
	},
	{
		position: {x: -25, y: 55},
		rotation: -0.08726646259971647, //Utils.gradToRad(-5)
		scale: {x: 0.5, y: -0.5}
	},
	{
		position: {x: 0, y: 70},
		rotation: -0.2617993877991494, //Utils.gradToRad(-15)
		scale:  {x: -0.5, y: 0.5}
	}
];

const CRACK_SETTING_1 = 
[
	{
		position: {x: 10, y: 65},
		rotation: 0,
		scale: {x: 0.59, y: 0.59}
	},
	{
		position: {x: 40, y: 30},
		rotation: -1.0995574287564276, //Utils.gradToRad(-63)
		scale: {x: 0.59, y: 0.59}
	},
];

class EarthCrackAnimation extends Sprite {

	static get EVENT_ON_ANIMATION_ENDED()				{return "onAnimationEnded";}

	constructor()
	{
		super();

		this._fAnimationCount_num = null;

		this._fCrack0_sprt_arr = [];
		this._fCrack1_sprt_arr = [];

		this._fMaskCrack0_sprt_arr = [];
		this._fMaskCrack1_sprt_arr = [];

		this._initView();
	}

	get _AccetCrack0 ()
	{
		return "boss_mode/earth/crack_0";
	}

	get _AccetCrack1 ()
	{
		return "boss_mode/earth/crack_1";
	}

	startAnimation()
	{
		this._fAnimationCount_num = 0;
		this._startCrackArrayAnimation();
		this._startAlphaAnimation()
	}

	_initView()
	{
		this._createCrack();
		
	}

	_createCrack()
	{	
		for (let i = 0; i < CRACK_SETTING_0.length; i++) {
			let lCrack0_sprt = this.addChild(APP.library.getSpriteFromAtlas(this._AccetCrack0));
			lCrack0_sprt.anchor.set(1, 0);
			lCrack0_sprt.visible = false;

			lCrack0_sprt.rotation = CRACK_SETTING_0[i].rotation;
			lCrack0_sprt.position.set(CRACK_SETTING_0[i].position.x, CRACK_SETTING_0[i].position.y);
			lCrack0_sprt.scale.set(CRACK_SETTING_0[i].scale.x, CRACK_SETTING_0[i].scale.y);
	
			this._fCrack0_sprt_arr.push(lCrack0_sprt);
		}

		for (let i = 0; i < CRACK_SETTING_1.length; i++) {
			let lCrack1_sprt = this.addChild(APP.library.getSpriteFromAtlas(this._AccetCrack1));
			lCrack1_sprt.anchor.set(224/614, 0);
			lCrack1_sprt.visible = false;

			lCrack1_sprt.rotation = CRACK_SETTING_1[i].rotation;
			lCrack1_sprt.position.set(CRACK_SETTING_1[i].position.x, CRACK_SETTING_1[i].position.y);
			lCrack1_sprt.scale.set(CRACK_SETTING_1[i].scale.x, CRACK_SETTING_1[i].scale.y);

			this._fCrack1_sprt_arr.push(lCrack1_sprt);
		}
	}

	_startCrackArrayAnimation()
	{
		let lTimer_seq = 
		[
			{tweens: [],duration: 14* FRAME_RATE},
			{tweens: [],duration: 0* FRAME_RATE, onfinish: ()=>{
				this._fAnimationCount_num++;
				this._startCrackAnimation(this._fCrack0_sprt_arr[0], 0);
			}},
			{tweens: [],duration: 5* FRAME_RATE, onfinish: ()=>{
				this._fAnimationCount_num++;
				this._startCrackAnimation(this._fCrack0_sprt_arr[1], 0);
			}},
			{tweens: [],duration: 2* FRAME_RATE, onfinish: ()=>{
				this._fAnimationCount_num++;
				this._startCrackAnimation(this._fCrack0_sprt_arr[2], 0);
			}},
		];
		Sequence.start(this, lTimer_seq);

		let lTimer2_seq = 
		[
			{tweens: [],duration: 14* FRAME_RATE},
			{tweens: [],duration: 0* FRAME_RATE, onfinish: ()=>{
				this._fAnimationCount_num++;
				this._startCrackAnimation(this._fCrack1_sprt_arr[0], 1);
			}},
			{tweens: [],duration: 4* FRAME_RATE, onfinish: ()=>{
				this._fAnimationCount_num++;
				this._startCrackAnimation(this._fCrack1_sprt_arr[1], 1);
			}},
		]
		Sequence.start(this, lTimer2_seq);
	}

	_startCrackAnimation(aCrack, CrackSkin_num)
	{
		if(CrackSkin_num == 0)
		{
			let lTimer_seq = 
			[
				{tweens: [],duration: 14* FRAME_RATE},
				{tweens: [],duration: 2* FRAME_RATE, onfinish: ()=>{
					this._setMaskCrack0(aCrack, 0)
					aCrack.visible = true;
				}},
				{tweens: [],duration: 3* FRAME_RATE, onfinish: ()=>{
					this._setMaskCrack0(aCrack, 1)
				}},
				{tweens: [],duration: 12* FRAME_RATE, onfinish: ()=>{
					this._setMaskCrack0(aCrack, 2)
				}},
				{tweens: [],duration: 3* FRAME_RATE, onfinish: ()=>{
					this._setMaskCrack0(aCrack, 3)
				}},
				{tweens: [],duration: 9* FRAME_RATE, onfinish: ()=>{
					this._setMaskCrack0(aCrack, 4)
				}},
				{tweens: [],duration: 7* FRAME_RATE, onfinish: ()=>{
					this._setMaskCrack0(aCrack, 5)
				},
				onfinish: ()=>{
					this._fAnimationCount_num--;
					this._onAnimationCompletedSuspicison();
				}},
			];
			Sequence.start(this, lTimer_seq);
		}

		if(CrackSkin_num == 1)
		{
			let lTimer_seq = 
			[
				{tweens: [],duration: 14* FRAME_RATE},
				{tweens: [],duration: 4* FRAME_RATE, onfinish: ()=>{
					this._setMaskCrack1(aCrack, 0)
					aCrack.visible = true;
				}},
				{tweens: [],duration: 3* FRAME_RATE, onfinish: ()=>{
					this._setMaskCrack1(aCrack, 1)
				}},
				{tweens: [],duration: 4* FRAME_RATE, onfinish: ()=>{
					this._setMaskCrack1(aCrack, 2)
				}},
				{tweens: [],duration: 9* FRAME_RATE, onfinish: ()=>{
					this._setMaskCrack1(aCrack, 3)
				}},
				{tweens: [],duration: 9* FRAME_RATE, onfinish: ()=>{
					this._setMaskCrack1(aCrack, 4)
				},
				onfinish: ()=>{
					this._fAnimationCount_num--;
					this._onAnimationCompletedSuspicison();
				}},
			];
			Sequence.start(this, lTimer_seq);
		}
	}

	_setMaskCrack0(aCrack, aMask_num)
	{
		aCrack.mask && aCrack.mask.destroy();

		let lMask = aCrack.addChild(APP.library.getSpriteFromAtlas("boss_mode/earth/crack_mask_" + aMask_num));
		lMask.scale.set(3);
		lMask.anchor.set(0.95, 0.15);
		
		aCrack.mask = lMask;
	}

	_setMaskCrack1(aCrack, aMask_num)
	{
		aCrack.mask && aCrack.mask.destroy();

		let lMask = aCrack.addChild(APP.library.getSpriteFromAtlas("boss_mode/earth/big_crack_mask_" + aMask_num));
		lMask.scale.set(3);
		lMask.anchor.set(aMask_num == 4 ? 0.364821 : 0.55, 0.07); //aMask_num == 4 ? 224/614 : 0.55, 0.07)

		aCrack.mask = lMask;
	}

	_startAlphaAnimation()
	{
		this.alpha = 1;

		let l_seq = [
			{tweens: [],duration: 14* FRAME_RATE},
			{tweens: [], duration: 93 * FRAME_RATE},
			{tweens: [{prop: "alpha", to: 0}], duration: 43 * FRAME_RATE,
					onfinish: ()=>{
						this._fAnimationCount_num--;
						this._onAnimationCompletedSuspicison();
			}}
		];

		this._fAnimationCount_num++;
		Sequence.start(this, l_seq);
	}

	_onAnimationCompletedSuspicison()
	{
		if (this._fAnimationCount_num == 0)
		{
			this._destroyAnimation();
			this.emit(EarthCrackAnimation.EVENT_ON_ANIMATION_ENDED);
		}
	}

	_destroyAnimation()
	{
		for (let i = 0; i < this._fCrack0_sprt_arr.length; i++)
		{
			if (!this._fCrack0_sprt_arr[i])
			{
				continue;
			}

			this._fCrack0_sprt_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fCrack0_sprt_arr[i]));
			this._fCrack0_sprt_arr[i] && this._fCrack0_sprt_arr[i].destroy();
			this._fCrack0_sprt_arr[i] = null;
		}
		this._fCrack0_sprt_arr = [];

		for (let i = 0; i < this._fCrack1_sprt_arr.length; i++)
		{
			if (!this._fCrack1_sprt_arr[i])
			{
				continue;
			}

			this._fCrack1_sprt_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fCrack1_sprt_arr[i]));
			this._fCrack1_sprt_arr[i] && this._fCrack1_sprt_arr[i].destroy();
			this._fCrack1_sprt_arr[i] = null;
		}
		this._fCrack1_sprt_arr = [];

		for (let i = 0; i < this._fMaskCrack0_sprt_arr.length; i++)
		{
			if (!this._fMaskCrack0_sprt_arr[i])
			{
				continue;
			}

			this._fMaskCrack0_sprt_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fMaskCrack0_sprt_arr[i]));
			this._fMaskCrack0_sprt_arr[i] && this._fMaskCrack0_sprt_arr[i].destroy();
			this._fMaskCrack0_sprt_arr[i] = null;
		}
		this._fMaskCrack0_sprt_arr = [];

		for (let i = 0; i < this._fMaskCrack1_sprt_arr.length; i++)
		{
			if (!this._fMaskCrack1_sprt_arr[i])
			{
				continue;
			}

			this._fMaskCrack1_sprt_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fMaskCrack1_sprt_arr[i]));
			this._fMaskCrack1_sprt_arr[i] && this._fMaskCrack1_sprt_arr[i].destroy();
			this._fMaskCrack1_sprt_arr[i] = null;
		}
		this._fMaskCrack1_sprt_arr = [];

		this && Sequence.destroy(Sequence.findByTarget(this));
	}

	destroy()
	{
		super.destroy();
		this._destroyAnimation();
	}
}

export default EarthCrackAnimation;	