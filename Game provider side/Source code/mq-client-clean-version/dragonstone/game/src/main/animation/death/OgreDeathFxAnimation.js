import { AtlasSprite, Sprite } from "../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display";
import { APP } from "../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals";
import AtlasConfig from "../../../config/AtlasConfig";
import BigEnemyDeathFxAnimation, { getSequenceTweenFieldValue } from "./BigEnemyDeathFxAnimation";
import * as Easing from '../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { Sequence } from "../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation";
import { FRAME_RATE } from "../../../../../shared/src/CommonConstants";

const SHADOWS_SCALES = [
	{x: 1.6, y: 2.5},
	{x: 2, y: 2.5},
	{x: 1.6, y: 3},
	{x: 2, y: 2},
	{x: 10, y: 4}
];

const PARTS_ANIMATIONS = [
	[
		{tweens: [
			{prop: 'rotation', to: 5},
			{prop: 'position.x', from: 0, to: 130},
			{prop: 'position.y', from: -100, to: -30, ease: Easing.bounce.easeOut}
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
			{prop: 'rotation', to: -4},
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
			{prop: 'position.x', to: -20},
			{prop: 'rotation', from: Math.PI/2, to: -Math.PI/2},
			{prop: 'position.y', from: -150, to: -250, ease: Easing.quartic.easeOut}
		], duration: 15*FRAME_RATE},
		{tweens: [
			{prop: 'rotation', to: -Math.PI},
			{prop: 'position.y', to: 10, ease: Easing.quadratic.easeIn}
		], duration: 12*FRAME_RATE},
		{tweens: [
			{prop: 'rotation', to: -5*Math.PI/4},
			{prop: 'position.y', to: -60, ease: Easing.quartic.easeOut}
		], duration: 9*FRAME_RATE},
		{tweens: [
			{prop: 'rotation', to: -6*Math.PI/4},
			{prop: 'position.y', to: 10, ease: Easing.quadratic.easeIn}
		], duration: 9*FRAME_RATE},
	]
];

const WEAPON_SHADOW_SEQUENCE = [
	{tweens: [
		{prop: 'alpha', to: 0.2},
		{prop: 'scale.y', to: 6, ease: Easing.quartic.easeOut},
		{prop: 'scale.x', to: 15, ease: Easing.quartic.easeOut}
	], duration: 15*FRAME_RATE},
	{tweens: [
		{prop: 'alpha', to: 0.8},
		{prop: 'scale.y', to: 3, ease: Easing.quartic.easeOut},
		{prop: 'scale.x', to: 5, ease: Easing.quartic.easeOut},
		{prop: 'position.x', to: 0, ease: Easing.quartic.easeOut}
	], duration: 12*FRAME_RATE},
	{tweens: [
		{prop: 'alpha', to: 0.6},
		{prop: 'scale.y', to: 5, ease: Easing.quartic.easeOut},
		{prop: 'position.x', to: -15, ease: Easing.quartic.easeOut}
	], duration: 9*FRAME_RATE},
	{tweens: [
		{prop: 'alpha', to: 0.8},
		{prop: 'scale.y', to: 4, ease: Easing.quartic.easeIn},
		{prop: 'scale.x', to: 10},
		{prop: 'position.x', to: -30, ease: Easing.quartic.easeIn}
	], duration: 9*FRAME_RATE},	
];

class OgreDeathFxAnimation extends BigEnemyDeathFxAnimation
{
	constructor()
	{
		super();
		this._fParts_spr_arr = null;
		this._fPartsAnimationsCounter_num = null;
		this._fWeaponContainer_spr = null;
	}

	get _fPileContainerOffset()
	{
		return {x: 0, y: 130};
	}

	_startEnemyPartsAnimation()
	{
		this._fParts_spr_arr = AtlasSprite.getFrames([APP.library.getAsset('death/big_enemy/ogre_parts')], [AtlasConfig.OgreDeathParts], "")

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
			lPart_spr.scale.set(1.5);

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
		//WEAPON'S SHADOW...
		let lWeaponShadow_spr = this._fPartsContainer_spr.addChild(APP.library.getSprite('death/big_enemy/shadow'));
		let lWeaponShadowScale_obj = SHADOWS_SCALES[SHADOWS_SCALES.length-1];
		lWeaponShadow_spr.scale.set(lWeaponShadowScale_obj.x, lWeaponShadowScale_obj.y);
		lWeaponShadow_spr.position.set(-30, 50);

		let lWeaponShadow_seq = WEAPON_SHADOW_SEQUENCE.slice();
		this._fPartsAnimationsCounter_num++;
		lWeaponShadow_seq[lWeaponShadow_seq.length-1].onfinish = ()=>{
			this._fPartsAnimationsCounter_num--;
			this._tryToCompleteAnimation();
			Sequence.destroy(Sequence.findByTarget(lWeaponShadow_spr));
		};
		
		this._fPartsSequences_seq_arr.push(Sequence.start(lWeaponShadow_spr, lWeaponShadow_seq));
		//...WEAPON'S SHADOW

		this._fWeaponContainer_spr = APP.gameScreen.gameField.bottomScreen.addChild(new Sprite());
		this._fWeaponContainer_spr.position = this._fGameFieldPosition_obj;
		this._fWeaponContainer_spr.zIndex = this._fAdditionalZIndex;
		
		let lWeapon_spr = this._fWeaponContainer_spr.addChild(new Sprite());
		lWeapon_spr.scale.set(1.2);
		lWeapon_spr.textures = [this._fParts_spr_arr.pop()];
		
		let lWeapon_seq = PARTS_ANIMATIONS[PARTS_ANIMATIONS.length-1];
		
		this._fPartsAnimationsCounter_num++;
		lWeapon_seq[lWeapon_seq.length-1].onfinish = ()=>{
			this._fPartsAnimationsCounter_num--;
			this._tryToCompleteAnimation();
			Sequence.destroy(Sequence.findByTarget(lWeapon_spr));
		};

		this._fPartsSequences_seq_arr.push(Sequence.start(lWeapon_spr, lWeapon_seq));
	}

	destroy()
	{
		super.destroy();
		this._fParts_spr_arr = null;
		this._fPartsAnimationsCounter_num = null;
		this._fWeaponzIndex = null;

		this._fWeaponContainer_spr && this._fWeaponContainer_spr.destroy();
		this._fWeaponContainer_spr = null;
	}
}

export default OgreDeathFxAnimation;