import { AtlasSprite, Sprite } from "../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display";
import { APP } from "../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals";
import AtlasConfig from "../../../config/AtlasConfig";
import BigEnemyDeathFxAnimation, { getSequenceTweenFieldValue } from "./BigEnemyDeathFxAnimation";
import * as Easing from '../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { Sequence } from "../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation";
import { FRAME_RATE } from "../../../../../shared/src/CommonConstants";

const SHADOWS_SCALES = [
	{x: 2, y: 2.5},
	{x: 2, y: 2.5},
	{x: 3, y: 2},
	{x: 2, y: 4}
];

const PARTS_ANIMATIONS = [
	[
		{tweens: [
			{prop: 'rotation', to: 4},
			{prop: 'position.x', from: 0, to: 130},
			{prop: 'position.y', from: -100, to: -10, ease: Easing.bounce.easeOut}
		], duration: 30*FRAME_RATE, delay: 10*FRAME_RATE}
	],
	[
		{tweens: [
			{prop: 'rotation', to: 4},
			{prop: 'position.x', from: 0, to: 230},
			{prop: 'position.y', from: -100, to: 0, ease: Easing.bounce.easeOut}
		], duration: 40*FRAME_RATE}
	],
	[
		{tweens: [
			{prop: 'rotation', to: -3},
			{prop: 'position.x', from: 0, to: -150},
			{prop: 'position.y', from: -120, to: 180, ease: Easing.bounce.easeOut}
		], duration: 35*FRAME_RATE, delay: 10*FRAME_RATE}
	],
	[
		{tweens: [
			{prop: 'rotation', to: -4},
			{prop: 'position.x', from: 0, to: -240},
			{prop: 'position.y', from: -120, to: 30, ease: Easing.bounce.easeOut}
		], duration: 30*FRAME_RATE, delay: 5*FRAME_RATE}
	],
	//weapon
	[
		{tweens: [
			{prop: 'position.x', to: 10},
			{prop: 'rotation', to: -2*Math.PI},
			{prop: 'position.y', from: -150, to: -250, ease: Easing.quartic.easeOut}
		], duration: 15*FRAME_RATE},
		{tweens: [
			{prop: 'position.x', to: 20},
			{prop: 'rotation', to: -5*Math.PI/2},
			{prop: 'position.y', to: -9, ease: Easing.quartic.easeIn}
		], duration: 10*FRAME_RATE}
	]
];

class DarkKnightDeathFxAnimation extends BigEnemyDeathFxAnimation
{
	constructor()
	{
		super();
		this._fParts_spr_arr = null;
		this._fPartsAnimationsCounter_num = null;
		this._fWeaponContainer_spr = null;
		this._fWeaponSmoke_spr = null;
	}

	get _fPileContainerOffset()
	{
		return {x: 0, y: 92};
	}

	_startEnemyPartsAnimation()
	{
		this._fParts_spr_arr = AtlasSprite.getFrames([APP.library.getAsset('death/big_enemy/knight_parts')], [AtlasConfig.DarkKnightDeathParts], "");
		
		this._startWeaponAnimation();

		//PARTS ANIMATIONS...
		for (let i=0; i < this._fParts_spr_arr.length; i++)
		{
			let lPart_seq = PARTS_ANIMATIONS[i];

			//PART'S SHADOW...
			let lShadow_spr = this._fPartsContainer_spr.addChild(APP.library.getSprite('death/big_enemy/shadow'));
			let lPositionYTween_obj = getSequenceTweenFieldValue(lPart_seq[0], 'prop', 'position.y');
			lShadow_spr.position.set(0, lPositionYTween_obj['to']+5);
			lShadow_spr.rotation = -Math.PI/4;
			lShadow_spr.scale.set(SHADOWS_SCALES[i].x, SHADOWS_SCALES[i].y);

			this._fPartsAnimationsCounter_num++;

			let lShadowTweens_arr = getSequenceTweenFieldValue(lPart_seq[0], 'prop', 'position.x');

			let lShadow_seq = [
				{
					tweens: lShadowTweens_arr,
					duration: lPart_seq[0].duration,
					delay: lPart_seq[0].delay,
					onfinish: ()=>{
						this._fPartsAnimationsCounter_num--;
						this._tryToCompleteAnimation();
						Sequence.destroy(Sequence.findByTarget(lShadow_spr));
					} 
				}
			];
			
			this._fPartsSequences_seq_arr.push(Sequence.start(lShadow_spr, lShadow_seq));
			//...PART'S SHADOW

			let lPart_spr = this._fPartsContainer_spr.addChild(new Sprite());
			lPart_spr.textures = [this._fParts_spr_arr[i]];
			lPart_spr.scale.set(1.8);

			this._fPartsAnimationsCounter_num++;
			lPart_seq[lPart_seq.length-1].onfinish = ()=>{
				this._fPartsAnimationsCounter_num--;
				this._tryToCompleteAnimation();
				Sequence.destroy(Sequence.findByTarget(lPart_spr));
			};

			this._fPartsSequences_seq_arr.push(Sequence.start(lPart_spr, lPart_seq));
		}
		//...PARTS ANIMATIONS
	}

	_startWeaponAnimation()
	{
		this._fWeaponContainer_spr = APP.gameScreen.gameField.bottomScreen.addChild(new Sprite());
		this._fWeaponContainer_spr.position = this._fGameFieldPosition_obj;
		this._fWeaponContainer_spr.zIndex = this._fAdditionalZIndex;

		//SMOKE AFTER WEAPON LANDS...
		let lWeaponSmoke_spr = new Sprite();
		lWeaponSmoke_spr.textures = AtlasSprite.getFrames([APP.library.getAsset('death/big_enemy/swords_smoke')], [AtlasConfig.DarkKnightSwordsSmoke], "");
		lWeaponSmoke_spr.animationSpeed = 0.5;
		lWeaponSmoke_spr.position.set(0, -35);
		lWeaponSmoke_spr.scale.set(4);
		lWeaponSmoke_spr.blendMode = PIXI.BLEND_MODES.ADD;
		lWeaponSmoke_spr.on('animationend', ()=>{
			this._fPartsAnimationsCounter_num--;
			lWeaponSmoke_spr && lWeaponSmoke_spr.destroy();
			this._tryToCompleteAnimation();
		});
		//...SMOKE AFTER WEAPON LANDS

		let lWeapon_spr = this._fWeaponContainer_spr.addChild(new Sprite());
		lWeapon_spr.position.set(0, -150);
		lWeapon_spr.textures = [this._fParts_spr_arr.pop()];
		
		let lWeapon_seq = PARTS_ANIMATIONS[PARTS_ANIMATIONS.length-1];

		this._fPartsAnimationsCounter_num++;
		lWeapon_seq[lWeapon_seq.length-1].onfinish = ()=>{
			this._fPartsAnimationsCounter_num--;
			this._tryToCompleteAnimation();
			lWeapon_spr.textures = [APP.library.getSprite('death/big_enemy/knight_swords_part')];
			
			this._fWeaponSmoke_spr = this._fPartsContainer_spr.addChild(lWeaponSmoke_spr);
			this._fPartsAnimationsCounter_num++;
			this._fWeaponSmoke_spr.play();
			Sequence.destroy(Sequence.findByTarget(lWeapon_spr));
		};

		this._fPartsSequences_seq_arr.push(Sequence.start(lWeapon_spr, lWeapon_seq));
	}

	destroy()
	{
		super.destroy();
		this._fParts_spr_arr = null;
		this._fPartsAnimationsCounter_num = null;

		this._fWeaponContainer_spr && this._fWeaponContainer_spr.destroy();
		this._fWeaponContainer_spr = null;
		
		this._fWeaponSmoke_spr && this._fWeaponSmoke_spr.destroy();
		this._fWeaponSmoke_spr = null;
	}
}

export default DarkKnightDeathFxAnimation;