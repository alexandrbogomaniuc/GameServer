import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { Sprite } from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import { FRAME_RATE } from '../../../../../shared/src/CommonConstants';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { Utils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';

class TurretBase extends Sprite 
{
	constructor(id)
	{
		super();

		this._fDefaultTurretBaseId_int = id;
		this._fTurretBottom_spr = null;
		this._fTurretTop_spr = null;
		this._fLiquid_spr = null;

		this._fBubbleContainer_spr_arr = [];
		this._fBubble_spr_arr = [];
		this._fWeaponGlowBottomEffect_spr = null;
		this._fWeaponGlowBottomInProgress_bl = null;

		this._fWeaponGlowTopEffect_spr = null;
		this._fWeaponGlowTopInProgress_bl = null;

		this._initView();
		this.hitArea = this.__getHitArea();

		// DEBUG...
		// let lBounds_obj = this.__getHitArea();
		// let l_g = this.addChild(new PIXI.Graphics());
		// l_g.beginFill(0x00ffff, 0.4).drawRect(lBounds_obj.x, lBounds_obj.y, lBounds_obj.width, lBounds_obj.height).endFill();
		// ...DEBUG
	}

	get isWeaponGlowBottomEffect()
	{
		return this._fWeaponGlowBottomEffect_spr;
	}

	get isWeaponGlowBottomInProgress()
	{
		return this._fWeaponGlowBottomInProgress_bl;
	}

	get isWeaponGlowTopInProgress()
	{
		return this._fWeaponGlowTopInProgress_bl;
	}

	get __defaultShootingEffectDurations()
	{
		return {intro: 2, outro: 7};
	}

	startGlowShotEffect()
	{
		if (this.__needBottomGlowShotEffect)
		{
			Sequence.destroy(Sequence.findByTarget(this._fWeaponGlowBottomEffect_spr));
			this._fWeaponGlowBottomEffect_spr.visible = true;
			this._fWeaponGlowBottomEffect_spr.alpha = 0;

			if (this._fWeaponGlowBottomEffect_spr)
			{
				let lSequence_arr = [
					{ tweens: [{ prop: "alpha", to: 1 }], duration: this.__defaultShootingEffectDurations.intro * FRAME_RATE },
					{ tweens: [{ prop: "alpha", to: 0 }], duration: this.__defaultShootingEffectDurations.outro * FRAME_RATE,
					onfinish: () =>
					{
						Sequence.destroy(Sequence.findByTarget(this._fWeaponGlowBottomEffect_spr));
						this._fWeaponGlowBottomInProgress_bl = false;
						this._fWeaponGlowBottomEffect_spr.visible = false;
					}}
				];

				Sequence.start(this._fWeaponGlowBottomEffect_spr, lSequence_arr);
				this._fWeaponGlowBottomInProgress_bl = true;
			}
		}
		
		if (this.__needTopGlowShotEffect)
		{
			Sequence.destroy(Sequence.findByTarget(this._fWeaponGlowTopEffect_spr));
			this._fWeaponGlowTopEffect_spr.alpha = 0;

			if (this._fWeaponGlowTopEffect_spr)
				{
					let lSequence_arr = [
						{ tweens: [{ prop: "alpha", to: 1 }], duration: this.__defaultShootingEffectDurations.intro * FRAME_RATE },
						{ tweens: [{ prop: "alpha", to: 0 }], duration: this.__defaultShootingEffectDurations.outro * FRAME_RATE,
						onfinish: () =>
						{
							Sequence.destroy(Sequence.findByTarget(this._fWeaponGlowTopEffect_spr));
							this._fWeaponGlowTopInProgress_bl = false;
						}}
					];

					Sequence.start(this._fWeaponGlowTopEffect_spr, lSequence_arr);
					this._fWeaponGlowTopInProgress_bl = true;
				}
		}
	}

	_initView()
	{
		if (this.__needBottomGlowShotEffect)
		{
			this._fWeaponGlowBottomEffect_spr = this.addChild(this.__getBottomGlowShotSprite());
		}
		
		this._fTurretBottom_spr = this.addChild(APP.library.getSpriteFromAtlas(this.__getTurretBottomImage));
		this._fTurretBottom_spr.position.y = this._getTurretBottomOffset;

		this.addChild(this.__getLiguidAnimation());
		this.addChild(this._getBubbleAnimation());
		this.addChild(this.__getWaveAnimation());

		this._fTurretTop_spr = this.addChild(APP.library.getSpriteFromAtlas(this.__getTurretTopImage));
		this._fTurretTop_spr.position.y = this.__getTurretTopOffset;


		//this._fTurretTop_spr.tint = 0x5bcc23;

		if (this.__needTopGlowShotEffect)
		{
			this._fWeaponGlowTopEffect_spr = this.addChild(this.__getTopGlowShotSprite());
		}
	}

	get _getTurretBottomOffset()
	{
		return 0;
	}

	get __getTurretTopOffset()
	{
		return 0;
	}

	get __getTurretBottomImage()
	{
		return "weapons/DefaultGun/default_turret_1/turret_bottom";
	}

	get __getTurretTopImage()
	{
		return "weapons/DefaultGun/default_turret_1/turret_top";
	}

	get __needBottomGlowShotEffect()
	{
		return false;
	}

	__getBottomGlowShotSprite()
	{
		return new Sprite();
	}

	get __needTopGlowShotEffect()
	{
		return false;
	}

	__getTopGlowShotSprite()
	{
		return new Sprite();
	}

	_getBubbleAnimation()
	{
		this._fBubbleContainer_spr = this.addChild(new Sprite());
		let param = this.__getBubbleAnimationParam();

		for (let i = 0; i < param.length; i++)
		{
			this._fBubbleContainer_spr_arr[i] = this._fBubbleContainer_spr.addChild(new Sprite());
			this._fBubbleContainer_spr_arr[i].alpha = 0;
			let lBubble = this._fBubble_spr_arr[i] = APP.library.getSpriteFromAtlas(this.__getBubbleImage);
			lBubble.scale.set(param[i].scale.x, param[i].scale.y);
			lBubble.position.x = param[i].position.x;
			lBubble.position.y = param[i].position.y;
			this._fBubbleContainer_spr_arr[i].addChild(lBubble);
		}
		
		this._startWiggleBubbleAnimation();

		return this._fBubbleContainer_spr;
	}

	get __getBubbleImage()
	{
		return null;
	}

	__getBubbleAnimationParam()
	{
		return [];
	}

	_startWiggleBubbleAnimation()
	{
		for (let i = 0; i < this._fBubble_spr_arr.length; i++)
		{
			let param = this.__getBubbleAnimationParam();
			this._startWiggleBubbleAnimationOnce(i, param[i]);

			if (param[i].rise)
			{
				this._startRiseBubbleAnimationOnce(i, param[i]);
			}
			else
			{
				this._fBubbleContainer_spr_arr[i].alpha = 1;
			}
			
		}
	}

	_startWiggleBubbleAnimationOnce(aIndex, aParam)
	{
		let l_seq = [
			{tweens: [
						{prop: 'x', to: aParam.position.x + Utils.getRandomWiggledValue(0.6, 0.6)},
						{prop: 'y', to: aParam.position.y + Utils.getRandomWiggledValue(0.6, 0.6)}], duration: 8 * FRAME_RATE,
						onfinish: ()=>{this._startWiggleBubbleAnimationOnce(aIndex, aParam);}
			}
		];

		Sequence.start(this._fBubble_spr_arr[aIndex], l_seq);
	}

	_startRiseBubbleAnimationOnce(aIndex, aParam)
	{
		let l_seq = [
			{tweens: [], duration: aParam.rise.delay * FRAME_RATE},
			{tweens: [{prop: 'y', to: 0}, {prop: 'alpha', to: 1}], duration: 0 * FRAME_RATE},
			{tweens: [{prop: 'y', to: - aParam.rise.y_rise}], duration: aParam.rise.duration * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0}], duration: 0 * FRAME_RATE},
			{tweens: [], duration: aParam.rise.finish_delay * FRAME_RATE,
						onfinish: ()=>{this._startRiseBubbleAnimationOnce(aIndex, aParam);}
			}
		];

		Sequence.start(this._fBubbleContainer_spr_arr[aIndex], l_seq);
	}
	
	__getWaveAnimation()
	{
		return new Sprite();
	}

	__getLiguidAnimation()
	{
		return new Sprite();
	}

	__getHitArea()
	{
		return new PIXI.Rectangle(-30, -50, 60, 100);
	}

	destroy()
	{
		this.id = undefined;

		for (let i = 0; i < this._fBubble_spr_arr.length; i++)
		{
			this._fBubble_spr_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fBubble_spr_arr[i]));
			this._fBubble_spr_arr[i] && this._fBubble_spr_arr[i].destroy();
		}
		this._fBubble_spr_arr = [];

		for (let i = 0; i < this._fBubbleContainer_spr_arr.length; i++)
		{
			this._fBubbleContainer_spr_arr[i] && Sequence.destroy(Sequence.findByTarget(this._fBubbleContainer_spr_arr[i]));
			this._fBubbleContainer_spr_arr[i] && this._fBubbleContainer_spr_arr[i].destroy();
		}
		this._fBubbleContainer_spr_arr = [];

		this._fWeaponGlowBottomEffect_spr && Sequence.destroy(Sequence.findByTarget(this._fWeaponGlowBottomEffect_spr));
		this._fWeaponGlowBottomEffect_spr && this._fWeaponGlowBottomEffect_spr.destroy();
		this._fWeaponGlowBottomEffect_spr = null;

		this._fWeaponGlowTopEffect_spr && Sequence.destroy(Sequence.findByTarget(this._fWeaponGlowTopEffect_spr));
		this._fWeaponGlowTopEffect_spr && this._fWeaponGlowTopEffect_spr.destroy();
		this._fWeaponGlowTopEffect_spr = null;

		super.destroy();
	}
}

export default TurretBase;