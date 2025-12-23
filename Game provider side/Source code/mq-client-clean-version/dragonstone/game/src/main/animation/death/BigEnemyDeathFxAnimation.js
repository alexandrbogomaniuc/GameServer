import Timer from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import { Sequence } from "../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation";
import { AtlasSprite, Sprite } from "../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display";
import { APP } from "../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals";
import { FRAME_RATE } from "../../../../../shared/src/CommonConstants";
import AtlasConfig from "../../../config/AtlasConfig";
import DeathFxAnimation from "./DeathFxAnimation";

export function getSequenceTweenFieldValue(aSeq_obj, aField_str='prop', aValue_str)
{
	return aSeq_obj.tweens.filter( (aObj)=>aObj[aField_str] === aValue_str )[0]
}

class BigEnemyDeathFxAnimation extends Sprite
{
	static get ANIMATION_HIDING_DELAY() {return 30*FRAME_RATE;}
	static get ANIMATION_HIDING_DURATION() {return 40*FRAME_RATE;}
	static get TRIGGERING_DURATION() {return 20*FRAME_RATE;}
	static get HIDIING_DURATION() {return 10*FRAME_RATE;}
	static get EVENT_ANIMATION_COMPLETED() {return DeathFxAnimation.EVENT_ANIMATION_COMPLETED;}
	static get ON_ENEMY_MUST_BE_HIDDEN() {return "onEnemyMustBeHidden";}

	i_startAnimation()
	{
		this._startAnimation();
	}

	i_startExplosionAnimation()
	{
		this._startExplosionAnimation();
	}

	i_startOutroAnimation()
	{
		this._startSmokeAnimation();
		let lFlare_seq = [
			{tweens: [{prop: 'scale.x', to: 0}, {prop: 'scale.x', to: 0}], duration: 12*FRAME_RATE, onfinish: ()=>{
				this._fSecondFlare_spr && this._fSecondFlare_spr.destroy() && Sequence.destroy(Sequence.findByTarget(this._fSecondFlare_spr));
				this._fFirstFlare_spr && this._fFirstFlare_spr.destroy();
			}}
		];

		let lWind_seq = [
			{tweens: [{prop: 'alpha', to: 0}], duration: 16*FRAME_RATE, onfinish: ()=>{
				this._fWindAnimation_spr && this._fWindAnimation_spr.destroy() && Sequence.destroy(Sequence.findByTarget(this._fWindAnimation_spr));
			}}
		];
		this._fTimers_t_arr.push(new Timer(()=>{
				this._showPile();
				this._fSecondFlare_spr && Sequence.start(this._fSecondFlare_spr, lFlare_seq);
				this._fWindAnimation_spr && Sequence.start(this._fWindAnimation_spr, lWind_seq);
				this._startEnemyPartsAnimation();
			}, 3*FRAME_RATE
		));
	}

	constructor()
	{
		super();
		this._fBlast_spr = null;
		this._fFirstFlare_spr = null;
		this._fSecondFlare_spr = null;
		this._fSmokeAnimation_spr = null;
		this._fWindAnimation_spr = null;
		this._fPartsContainer_spr = null;
		this._fGameFieldPosition_obj = null;
		this._fAdditionalZIndex = this.zIndex; // for weapon and smoke
		
		this._fPartsSequences_seq_arr = [];
		this._fTimers_t_arr = [];
	}

	set gameFieldPosition(aValue_obj)
	{
		this._fGameFieldPosition_obj = aValue_obj;
	}

	set additionalZIndex(aValue_num)
	{
		this._fAdditionalZIndex = aValue_num;
	}

	get _fPileContainerOffset()
	{
		return {x: 0, y: 0};
	}

	_startAnimation()
	{
		let lWind_spr = this._fWindAnimation_spr = this.addChild(new Sprite());
		lWind_spr.textures = AtlasSprite.getFrames([APP.library.getAsset('death/big_enemy/wind')], [AtlasConfig.BigEnemyExplosionWind], "");
		lWind_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lWind_spr.position.set(0, 50);
		lWind_spr.scale.set(15);
		lWind_spr.animationSpeed = 0.2;
		lWind_spr.play();

		this._fTimers_t_arr.push(new Timer(()=>this._startExplosionAnimation(), BigEnemyDeathFxAnimation.TRIGGERING_DURATION-2*FRAME_RATE));
	}

	_startExplosionAnimation()
	{
		let lFirstFlare_spr = this._fFirstFlare_spr = this.addChild(APP.library.getSprite('death/big_enemy/flare'));
		lFirstFlare_spr.position.set(-50, -20);
		lFirstFlare_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lFirstFlare_spr.scale.set(20);
		lFirstFlare_spr.alpha = 0;

		let lSecondFlare_Spr = this._fSecondFlare_spr = this.addChild(APP.library.getSprite('death/big_enemy/flare'));
		lSecondFlare_Spr.position.set(50, -20);
		lSecondFlare_Spr.blendMode = PIXI.BLEND_MODES.ADD;
		lSecondFlare_Spr.scale.set(20);
		lSecondFlare_Spr.alpha = 0;

		this._fTimers_t_arr.push(new Timer(()=>{
				this._fFirstFlare_spr.alpha = 1;
				this._startBlastAnimation();
				this._onHideRequired();
			}, 1*FRAME_RATE
		));
		this._fTimers_t_arr.push(new Timer(()=>{
				this._fSecondFlare_spr.alpha = 1;
				this.i_startOutroAnimation();
		 	}, 3*FRAME_RATE
		));
		this._startSwirls();
	}

	_onHideRequired()
	{
		this.emit(BigEnemyDeathFxAnimation.ON_ENEMY_MUST_BE_HIDDEN);
	}

	_startSwirls()
	{
		const SWIRLS_DELAYS = [0, 0, 6*FRAME_RATE, 12*FRAME_RATE, 12*FRAME_RATE];
		const SWIRLS_POSITIONS = [
			{x: 0, y:  20},
			{x: 0, y:  70},
			{x: 0, y: -20},
			{x: 0, y: -50},
			{x: 0, y:  30},
		];
		const SWIRLS_SCALES = [4, 5, 4, 6, 7.5];

		for (let i =0; i < 5; i++)
		{
			let l_spr = this.addChild(new Sprite());
			l_spr.textures = AtlasSprite.getFrames([APP.library.getAsset('death/big_enemy/swirl')], [AtlasConfig.BigEnemyExplosionSwirl], "");
			l_spr.position.set(SWIRLS_POSITIONS[i].x, SWIRLS_POSITIONS[i].y);
			l_spr.scale.set(SWIRLS_SCALES[i], 4);
			l_spr.blendMode = PIXI.BLEND_MODES.ADD;

			l_spr.on('animationend', ()=>l_spr && l_spr.destroy());

			this._fTimers_t_arr.push(new Timer(()=>l_spr.play(), SWIRLS_DELAYS[i]));
		}
	}
	
	_startBlastAnimation()
	{
		let l_spr = this._fBlast_spr = this.addChild(APP.library.getSprite('death/big_enemy/blast'));
		l_spr.blendMode = PIXI.BLEND_MODES.SCREEN;
		let l_seq = [
			{tweens: [{prop: 'scale.x', from: 5, to: 20}, {prop: 'scale.y', from: 5, to: 20}, {prop: 'alpha', to: 0.5}], 
				duration: 6*FRAME_RATE
			},
			{tweens: [{prop: 'alpha', to: 0}], 
				duration: 2*FRAME_RATE, 
				onfinish: ()=>{
					this._fBlast_spr && this._fBlast_spr.destroy();
				}
			}
		]

		Sequence.start(l_spr, l_seq);
	}

	_startSmokeAnimation()
	{
		let l_spr = this._fSmokeAnimation_spr = APP.gameScreen.gameField.bottomScreen.addChild(new Sprite());
		l_spr.textures = AtlasSprite.getFrames([APP.library.getAsset('death/big_enemy/smoke')], [AtlasConfig.BigEnemyExplosionSmoke], "");
		l_spr.blendMode = PIXI.BLEND_MODES.SCREEN;
		l_spr.position.set(this._fGameFieldPosition_obj.x, this._fGameFieldPosition_obj.y);
		l_spr.anchor.set(0.6, 0.85);
		l_spr.scale.set(8);
		l_spr.animationSpeed = 0.6;

		l_spr.on('animationend', ()=> l_spr && l_spr.destroy());
		l_spr.play();
	}

	_showPile()
	{
		this._fPartsContainer_spr = this.addChild(new Sprite());
		this._fPartsContainer_spr.position.set(this._fPileContainerOffset.x, this._fPileContainerOffset.y);
		this._fPartsContainer_spr.zIndex = -1;
		let lBackPile_spr = this._fBackPile_spr = this._fPartsContainer_spr.addChild(APP.library.getSprite('death/big_enemy/pile_back'));
		lBackPile_spr.scale.set(1.2);
		let lFrontPile_spr = this._fFrontPile_spr = this._fPartsContainer_spr.addChild(APP.library.getSprite('death/big_enemy/pile_front'));
		lFrontPile_spr.position.set(-3, 12);
		lFrontPile_spr.scale.set(1.2);
		lFrontPile_spr.zIndex = 2;
	}

	_tryToCompleteAnimation()
	{
		if (this._fPartsAnimationsCounter_num)
		{
			return;
		}
		else
		{
			let l_seq = [
				{tweens: [{prop: 'alpha', to: 0}], 
					duration: BigEnemyDeathFxAnimation.ANIMATION_HIDING_DURATION, 
					onfinish: ()=>{
						Sequence.destroy(Sequence.findByTarget(this._fPartsContainer_spr));
						Sequence.destroy(Sequence.findByTarget(this._fWeaponContainer_spr));
						this._onAnimationCompleted();
					}
				}
			];

			Sequence.start(this._fPartsContainer_spr, l_seq, BigEnemyDeathFxAnimation.ANIMATION_HIDING_DELAY); //last parameter is for delay, so the parts are visible for some time
			Sequence.start(this._fWeaponContainer_spr, l_seq, BigEnemyDeathFxAnimation.ANIMATION_HIDING_DELAY);
		}
	}

	_onAnimationCompleted()
	{
		this.emit(BigEnemyDeathFxAnimation.EVENT_ANIMATION_COMPLETED);
		this.destroy();
	}

	destroy()
	{
		super.destroy();
		this._fWindAnimation_spr && this._fWindAnimation_spr.destroy();
		this._fWindAnimation_spr = null;
		
		this._fSmokeAnimation_spr && this._fSmokeAnimation_spr.destroy();
		this._fSmokeAnimation_spr = null;
		
		this._fBlast_spr && this._fBlast_spr.destroy();
		this._fBlast_spr = null;

		this._fGameFieldPosition_obj = null;
		
		this._fFirstFlare_spr && Sequence.destroy(Sequence.findByTarget(this._fFirstFlare_spr));
		this._fFirstFlare_spr && this._fFirstFlare_spr.destroy();
		this._fFirstFlare_spr = null;

		this._fSecondFlare_spr && Sequence.destroy(Sequence.findByTarget(this._fSecondFlare_spr));
		this._fSecondFlare_spr && this._fSecondFlare_spr.destroy();
		this._fSecondFlare_spr = null;

		if (Array.isArray(this._fPartsSequences_seq_arr) && this._fPartsSequences_seq_arr.length > 0)
		{
			Sequence.destroy(this._fPartsSequences_seq_arr);
		}
		this._fPartsSequences_seq_arr = null;
		this._fPartsContainer_spr && this._fPartsContainer_spr.destroy();
		this._fPartsContainer_spr = null;

		this._fTimers_t_arr && Timer.destroy(this._fTimers_t_arr);
		this._fTimers_t_arr = null;
	}
}

export default BigEnemyDeathFxAnimation;