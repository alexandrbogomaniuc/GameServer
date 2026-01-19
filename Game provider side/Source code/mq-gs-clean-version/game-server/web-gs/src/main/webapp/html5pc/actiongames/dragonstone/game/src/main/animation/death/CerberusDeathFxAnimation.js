import { AtlasSprite, Sprite } from "../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display";
import { APP } from "../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals";
import AtlasConfig from "../../../config/AtlasConfig";
import BigEnemyDeathFxAnimation from "./BigEnemyDeathFxAnimation";
import * as Easing from '../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { Sequence } from "../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation";
import { FRAME_RATE } from "../../../../../shared/src/CommonConstants";

const PARTS_ANIMATIONS = [
	[
		{tweens: [
			{prop: 'rotation', to: 4},
			{prop: 'position.x', from: 0, to: 45},
			{prop: 'position.y', from: -120, to: -10, ease: Easing.bounce.easeOut}
		], duration: 30*FRAME_RATE, delay: 10*FRAME_RATE}
	],
	[
		{tweens: [
			{prop: 'rotation', to: -4},
			{prop: 'position.x', from: 0, to: -50},
			{prop: 'position.y', from: -120, to: 10, ease: Easing.bounce.easeOut}
		], duration: 40*FRAME_RATE}
	],
	[
		{tweens: [
			{prop: 'rotation', to: 4},
			{prop: 'position.y', from: -120, to: 10, ease: Easing.bounce.easeOut}
		], duration: 35*FRAME_RATE}
	]
];

class CerberusDeathFxAnimation extends BigEnemyDeathFxAnimation
{
	constructor()
	{
		super();
		this._fParts_spr_arr = null;
		this._fPartsAnimationsCounter_num = null;
	}

	get _fPileContainerOffset()
	{
		return {x: 0, y: 60};
	}

	_startEnemyPartsAnimation()
	{
		this._fParts_spr_arr = AtlasSprite.getFrames([APP.library.getAsset('death/big_enemy/cerberus_parts')], [AtlasConfig.CerberusDeathParts], "")
		for (let i=0; i < this._fParts_spr_arr.length; i++)
		{
			let l_spr = this._fPartsContainer_spr.addChild(new Sprite());
			l_spr.textures = [this._fParts_spr_arr[i]];
			l_spr.scale.set(1.3);
			let l_seq = PARTS_ANIMATIONS[i];

			this._fPartsAnimationsCounter_num++;
			l_seq[l_seq.length-1].onfinish = ()=>{
				this._fPartsAnimationsCounter_num--;
				this._tryToCompleteAnimation();
				Sequence.destroy(Sequence.findByTarget(l_spr));
			};

			this._fPartsSequences_seq_arr.push(Sequence.start(l_spr, l_seq));
		}
	}

	destroy()
	{
		super.destroy();
		this._fParts_spr_arr = null;
		this._fPartsAnimationsCounter_num = null;
	}
}

export default CerberusDeathFxAnimation;