import { Sprite } from "../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display";
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { FRAME_RATE } from '../../../../../shared/src/CommonConstants';
import * as Easing from '../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';

const ICONS_SRC = [
	"mini_slot/claws",	//id = 0
	"mini_slot/eye",	//id = 1
	"mini_slot/fire",	//id = 2
	"mini_slot/sward",	//id = 3
	"mini_slot/rune",	//id = 4
];

export const ICONS_LAST_ID = ICONS_SRC.length - 1;

class ReelIcon extends Sprite
{
	startGlowAnimation()
	{
		this._startGlowAnimation();
	}

	startScaleAnimation()
	{
		this._startScaleAnimation();
	}

	constructor(aIconId_int)
	{
		super();

		this._fWinGlow_spr = null;

		this._addIcon(aIconId_int);
	}

	_addIcon(aIconId_int)
	{
		const lIcon_spr = this.addChild(APP.library.getSpriteFromAtlas(ICONS_SRC[aIconId_int]));

		this._fWinGlow_spr = this.addChild(APP.library.getSprite("mini_slot/icon_glow"));
		this._resetGlowAnimation();
	}

	_startGlowAnimation()
	{
		this._fWinGlow_spr.visible = true;
		Sequence.destroy(Sequence.findByTarget(this._fWinGlow_spr));

		let lSequenceAlpha_arr = [
			{tweens: [{ prop: "alpha", to: 0 }],		duration: 9 * FRAME_RATE, ease: Easing.exponential.easeIn, onfinish: ()=>{ this._resetGlowAnimation(); }}
		];
		Sequence.start(this._fWinGlow_spr, lSequenceAlpha_arr);
	}

	_resetGlowAnimation()
	{
		this._fWinGlow_spr.visible = false;
		this._fWinGlow_spr.scale.set(0.82);
		this._fWinGlow_spr.alpha = 0.6;
		this._fWinGlow_spr.position.set(-4, 3);
	}

	_startScaleAnimation()
	{
		let lSequenceScale_arr = [
			{tweens: [{ prop: "scale.x", to: this.scale.x + 0.1}, 	{ prop: "scale.y", to: this.scale.y + 0.1}], 	duration: 4 * FRAME_RATE},
			{tweens: [{ prop: "scale.x", to: this.scale.x}, 		{ prop: "scale.y", to: this.scale.y}], 			duration: 6 * FRAME_RATE, ease: Easing.back.easeOut},
		];
		Sequence.start(this, lSequenceScale_arr);
	}

	destroy()
	{
		super.destroy();

		Sequence.destroy(Sequence.findByTarget(this));

		Sequence.destroy(Sequence.findByTarget(this._fWinGlow_spr));
		this._fWinGlow_spr = null;
	}
}

export default ReelIcon;