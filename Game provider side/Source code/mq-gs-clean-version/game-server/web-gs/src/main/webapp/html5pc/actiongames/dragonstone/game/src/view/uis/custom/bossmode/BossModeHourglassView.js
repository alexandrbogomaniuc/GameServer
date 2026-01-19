import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import SimpleUIView from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/SimpleUIView';
import { Sprite, AtlasSprite } from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import { FRAME_RATE } from '../../../../../../shared/src/CommonConstants';
import { Sequence } from './../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import * as Easing from './../../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import Timer from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import AtlasConfig from './../../../../config/AtlasConfig';

let _sand_spread_textures = null;
function _initSandSpreadTextures()
{
	if (_sand_spread_textures) return;

	_sand_spread_textures = AtlasSprite.getFrames(APP.library.getAsset("boss_mode/hourglass/sand_spread"), AtlasConfig.SandSpread, "");
}


class BossModeHourglassView extends SimpleUIView
{
	static get EVENT_ON_DISAPPEAR_ANIMATION_COMPLETED() 	{ return "EVENT_ON_DISAPPEAR_ANIMATION_COMPLETED"; }
	static get EVENT_ON_DISAPPEAR_ANIMATION_COMPLETING() 	{ return "EVENT_ON_DISAPPEAR_ANIMATION_COMPLETING"; }
	static get EVENT_ON_PROGRESS_UPDATED() 					{ return "EVENT_ON_PROGRESS_UPDATED"; }

	pause()
	{
		this._pause();
	}

	update()
	{
		this._update();
	}

	showAppearAnimation()
	{
		this._showAppearAnimation();
	}

	showDisappearAnimation()
	{
		this._showDisappearAnimation();
	}

	constructor()
	{
		super();

		_initSandSpreadTextures();

		this._fContentContainer_spr = null;
		this._fSandStreamTimer_t = null;
		this._fSandCountainer_spr = null;
		this._fSandStreamParts_spr_arr = [];
		this._fBottomSandBig_spr = null;
		this._fBottomSandSmall_spr = null;
		this._fSandSpreadContainer_spr = null;
		this._fSandSpreadParts_spr_arr = [];
		this._fTopSandBigConstiner_spr = null;
		this._fTopSandSmallConstiner_spr = null;
		this._fIsPaused_bl = false;

		this._fProgress_num = undefined;

		APP.on("tick", this._onTick, this);
	}

	__init()
	{
		super.__init();

		this._initHourglass();
	}

	_initHourglass()
	{
		this._addHourglass();
		this._addFlame();
	}

	_addHourglass()
	{
		this._fContentContainer_spr = this.addChild(new Sprite());

		this._addGlass();
		this._addSand();
		this._addFrame();
	}

	_addFrame()
	{
		const lFrame_spr = this._fContentContainer_spr.addChild(APP.library.getSpriteFromAtlas("boss_mode/hourglass/frame"));
	}

	_addSand()
	{
		this._fSandCountainer_spr = this._fContentContainer_spr.addChild(new Sprite());

		const lMask_spr = this._fSandCountainer_spr.addChild(APP.library.getSpriteFromAtlas("boss_mode/hourglass/mask"));
		this._fSandCountainer_spr.mask = lMask_spr;

		this._addSandStream();
		this._addBottomSandBig();
		this._addBottomSandSmall();
		this._addTopSandBig();
		this._addTopSandSmall();
		this._addSandSpread()
	}

	_addSandStream()
	{
		this._fSandStreamContainer_spr = this._fSandCountainer_spr.addChild(new Sprite());

		const lMask_g = this._fSandStreamContainer_spr.addChild(new PIXI.Graphics());
		lMask_g.beginFill(0x000000).drawRect(-45, -45, 90, 90).endFill();
		lMask_g.position.set(0, 45);
		this._fSandStreamContainer_spr.mask = lMask_g;

		this._fSandStreamTimer_t = new Timer(()=>this._animateSandStreamPart(), 5 * FRAME_RATE, true);
		this._fSandStreamTimer_t.pause();
	}

	_addBottomSandBig()
	{
		this._fBottomSandBig_spr = this._fSandCountainer_spr.addChild(APP.library.getSpriteFromAtlas("boss_mode/hourglass/bottom_sand_big"));
	}

	_addBottomSandSmall()
	{
		this._fBottomSandSmall_spr = this._fSandCountainer_spr.addChild(APP.library.getSpriteFromAtlas("boss_mode/hourglass/bottom_sand_small"));
		this._fBottomSandSmall_spr.scale.set(0.5);
	}

	_addTopSandBig()
	{
		this._fTopSandBigConstiner_spr = this._fSandCountainer_spr.addChild(new Sprite());
		this._fTopSandBig_spr = this._fTopSandBigConstiner_spr.addChild(APP.library.getSpriteFromAtlas("boss_mode/hourglass/top_sand_big"));

		const lMask_g = this._fTopSandBigConstiner_spr.addChild(new PIXI.Graphics());
		lMask_g.beginFill(0x000000).drawRect(-45, -45, 90, 90).endFill();
		lMask_g.position.set(0, -47);
		this._fTopSandBigConstiner_spr.mask = lMask_g;
	}

	_addTopSandSmall()
	{
		this._fTopSandSmallConstiner_spr = this._fSandCountainer_spr.addChild(new Sprite());
		this._fTopSandSmall_spr = this._fTopSandSmallConstiner_spr.addChild(APP.library.getSpriteFromAtlas("boss_mode/hourglass/top_sand_small"));

		const lMask_g = this._fTopSandSmallConstiner_spr.addChild(new PIXI.Graphics());
		lMask_g.beginFill(0x000000).drawRect(-45, -45, 90, 90).endFill();
		lMask_g.position.set(0, -47);
		this._fTopSandSmallConstiner_spr.mask = lMask_g;

		this._fTopSandSmall_spr.scale.set(0.5);
	}

	_animateSandStreamPart()
	{
		let lSandStreamPart_spr = this._fSandStreamContainer_spr.addChild(APP.library.getSpriteFromAtlas("boss_mode/hourglass/sand_stream"));
		lSandStreamPart_spr.position.set(0, -107);
		lSandStreamPart_spr.scale.set(0.7);
		this._fSandStreamParts_spr_arr.push(lSandStreamPart_spr);

		let lSequenceScale_arr = [
			{ tweens: [{ prop: "scale.x", to: 0.8 }, 	{ prop: "scale.y", to: 0.563 }], 	duration: 29 * FRAME_RATE}
		];
		Sequence.start(lSandStreamPart_spr, lSequenceScale_arr);

		let lSequencePosition_arr = [
			{ tweens: [{ prop: "position.x", to: 0 }, { prop: "position.y", to: 107 }], duration: 30 * FRAME_RATE, onfinish: () => {
				let lId_num = this._fSandStreamParts_spr_arr.indexOf(lSandStreamPart_spr);
				if (~lId_num)
				{
					this._fSandStreamParts_spr_arr.splice(lId_num, 1);
				}
				lSandStreamPart_spr.destroy();
				lSandStreamPart_spr = null;
			}},
		];
		Sequence.start(lSandStreamPart_spr, lSequencePosition_arr);
	}

	_addSandSpread()
	{
		this._fSandSpreadContainer_spr = this._fSandCountainer_spr.addChild(new Sprite());
		this._fSandSpreadTimer_t = new Timer(()=>this._animateSandSpreadPart(), 47 * FRAME_RATE, true);
		this._fSandSpreadTimer_t.pause();
	}

	_animateSandSpreadPart()
	{
		let lSandSpreadPart_spr = this._fSandSpreadContainer_spr.addChild(new Sprite());
		lSandSpreadPart_spr.scale.set(0.5);
		lSandSpreadPart_spr.textures = _sand_spread_textures;
		lSandSpreadPart_spr.animationSpeed = 0.5;
		lSandSpreadPart_spr.once('animationend', () => {
			let lId_num = this._fSandSpreadParts_spr_arr.indexOf(lSandSpreadPart_spr);
			if (~lId_num)
			{
				this._fSandSpreadParts_spr_arr.splice(lId_num, 1);
			}
			lSandSpreadPart_spr && lSandSpreadPart_spr.destroy();
			lSandSpreadPart_spr = null;
		});
		lSandSpreadPart_spr.play();

		this._fSandSpreadParts_spr_arr.push(lSandSpreadPart_spr);
	}

	_addGlass()
	{
		const lGlass_spr = this._fContentContainer_spr.addChild(APP.library.getSpriteFromAtlas("boss_mode/hourglass/glass"));
	}

	_addFlame()
	{
		this._fFlame_spr = this.addChild(APP.library.getSpriteFromAtlas("boss_mode/hourglass/flame"));
		this._fFlame_spr.blendMode = PIXI.BLEND_MODES.SCREEN;
		this._fFlame_spr.scale.set(0);
	}

	_update()
	{
		let lCurrentTime_num = APP.gameScreen.currentTime - this.uiInfo.startPointTime;
		let lFullTime_num = this.uiInfo.fullTime;
		let lProgress_num = 1 - lCurrentTime_num / lFullTime_num;

		if(lProgress_num >= 1)
		{
			lProgress_num = 1;
		}
		if(lProgress_num <= 0)
		{
			lProgress_num = 0;
		}

		if (lProgress_num < 1)
		{
			this._fSandStreamTimer_t && !this._fSandStreamTimer_t.isInProgress() && this._fSandStreamTimer_t.resume();
			this._fSandSpreadTimer_t && !this._fSandSpreadTimer_t.isInProgress() && this._fSandSpreadTimer_t.resume();
		}

		if (lProgress_num < 0.05)
		{
			this._fSandStreamTimer_t && this._fSandStreamTimer_t.isInProgress() && this._fSandStreamTimer_t.pause();
			this._fSandSpreadTimer_t && this._fSandSpreadTimer_t.isInProgress() && this._fSandSpreadTimer_t.pause();
		}

		this._updateBottomSandBig(lProgress_num);
		this._updateBottomSandSmall(lProgress_num);
		this._updateTopSandBig(lProgress_num);
		this._updateTopSandSmall(lProgress_num);
		this._updateSandSpread(lProgress_num);

		let lPrevProgress = this._fProgress_num;
		this._fProgress_num = lProgress_num;

		if (lProgress_num !== lPrevProgress)
		{
			this.emit(BossModeHourglassView.EVENT_ON_PROGRESS_UPDATED, {curProgress: lProgress_num});
		}
	}

	_updateBottomSandBig(aProgress_num)
	{
		const lStartPositionY_num = 91;
		const lFinishPositionY_num = 64;
		const lCurrentPositionY_num = lStartPositionY_num + (lFinishPositionY_num - lStartPositionY_num) * (1 - aProgress_num);

		this._fBottomSandBig_spr && this._fBottomSandBig_spr.transform && this._fBottomSandBig_spr.position.set(0, lCurrentPositionY_num);

		const lStartScaleX_num = 1.32;
		const lFinishScaleX_num = 0.5;
		const lCurrentScaleX_num = lStartScaleX_num + (lFinishScaleX_num - lStartScaleX_num) * (1 - aProgress_num);

		const lStartScaleY_num = 0.25;
		const lFinishScaleY_num = 0.8;
		const lCurrentScaleY_num = lStartScaleY_num + (lFinishScaleY_num - lStartScaleY_num) * (1 - aProgress_num);

		this._fBottomSandBig_spr && this._fBottomSandBig_spr.transform && this._fBottomSandBig_spr.scale.set(lCurrentScaleX_num, lCurrentScaleY_num);
	}

	_updateBottomSandSmall(aProgress_num)
	{
		const lStartPositionY_num = 96;
		const lFinishPositionY_num = 84;
		const lCurrentPositionY_num = lStartPositionY_num + (lFinishPositionY_num - lStartPositionY_num) * (1 - aProgress_num);

		this._fBottomSandSmall_spr && this._fBottomSandSmall_spr.transform && this._fBottomSandSmall_spr.position.set(0, lCurrentPositionY_num);
	}

	_updateTopSandBig(aProgress_num)
	{
		const lStartPositionY_num = -19;
		const lFinishPositionY_num = 27;
		const lCurrentPositionY_num = lStartPositionY_num + (lFinishPositionY_num - lStartPositionY_num) * (1 - aProgress_num);

		this._fTopSandBig_spr && this._fTopSandBig_spr.transform && this._fTopSandBig_spr.position.set(0, lCurrentPositionY_num);

		const lStartScaleX_num = 0.42;
		const lFinishScaleX_num = 0.11;
		const lCurrentScaleX_num = lStartScaleX_num + (lFinishScaleX_num - lStartScaleX_num) * (1 - aProgress_num);

		const lStartScaleY_num = 0.5;
		const lFinishScaleY_num = 0.75;
		const lCurrentScaleY_num = lStartScaleY_num + (lFinishScaleY_num - lStartScaleY_num) * (1 - aProgress_num);

		this._fTopSandBig_spr && this._fTopSandBig_spr.transform && this._fTopSandBig_spr.scale.set(lCurrentScaleX_num, lCurrentScaleY_num);

		const lStartAlphaAnimationPercent_num = 0.15;
		if (aProgress_num < lStartAlphaAnimationPercent_num)
		{
			aProgress_num = 1/lStartAlphaAnimationPercent_num * aProgress_num;

			const lStartAlpha_num = 1;
			const lFinishAlpha_num = 0;
			const lCurrentAlpha_num = lStartAlpha_num + (lFinishAlpha_num - lStartAlpha_num) * (1 - aProgress_num);

			this._fTopSandBig_spr && this._fTopSandBig_spr.transform && (this._fTopSandBig_spr.alpha = lCurrentAlpha_num)
		}
	}

	_updateTopSandSmall(aProgress_num)
	{
		const lStartAnimationPercent_num = 0.5;
		if (aProgress_num > lStartAnimationPercent_num)
		{
			return;
		}

		const lPositionYProgress_num = 1/lStartAnimationPercent_num * aProgress_num
		const lStartPositionY_num = -7;
		const lFinishPositionY_num = 10;
		const lCurrentPositionY_num = lStartPositionY_num + (lFinishPositionY_num - lStartPositionY_num) * (1 - lPositionYProgress_num);

		this._fTopSandSmall_spr && this._fTopSandSmall_spr.transform && this._fTopSandSmall_spr.position.set(3, lCurrentPositionY_num);

		const lStartAlphaAnimationPercent_num = 0.3;
		if (aProgress_num < lStartAlphaAnimationPercent_num)
		{
			aProgress_num = 1/lStartAlphaAnimationPercent_num * aProgress_num

			const lStartAlpha_num = 1;
			const lFinishAlpha_num = 0;
			const lCurrentAlpha_num = lStartAlpha_num + (lFinishAlpha_num - lStartAlpha_num) * (1 - aProgress_num);

			this._fTopSandSmall_spr && this._fTopSandSmall_spr.transform && (this._fTopSandSmall_spr.alpha = lCurrentAlpha_num)
		}
	}

	_updateSandSpread(aProgress_num)
	{
		const lStartPositionY_num = 0;
		const lFinishPositionY_num = -30;
		const lCurrentPositionY_num = lStartPositionY_num + (lFinishPositionY_num - lStartPositionY_num) * (1 - aProgress_num);

		this._fSandSpreadContainer_spr && this._fSandSpreadContainer_spr.transform && this._fSandSpreadContainer_spr.position.set(-6, lCurrentPositionY_num);
	}

	_showAppearAnimation()
	{
		this._fContentContainer_spr.visible = false;

		this._fFlame_spr.scale.set(0.58);
		let lSequenceScale_arr = [
			{ tweens: [{ prop: "scale.x", to: 1.02 }, 	{ prop: "scale.y", to: 3.3 }], 	duration: 8 * FRAME_RATE, ease: Easing.exponential.easeInOut, onfinish: () => { this._fContentContainer_spr.visible = true; }},
			{ tweens: [{ prop: "scale.x", to: 1.12 }, 	{ prop: "scale.y", to: 3.3 }], 	duration: 3 * FRAME_RATE, ease: Easing.exponential.easeInOut },
			{ tweens: [{ prop: "scale.x", to: 0 }, 		{ prop: "scale.y", to: 0 }], 	duration: 14 * FRAME_RATE, ease: Easing.exponential.easeInOut },
		];
		Sequence.start(this._fFlame_spr, lSequenceScale_arr);
	}

	_showDisappearAnimation()
	{
		this._fFlame_spr.scale.set(0.58);
		let lSequenceScale_arr = [
			{ tweens: [{ prop: "scale.x", to: 1.02 }, 	{ prop: "scale.y", to: 3.3 }], 	duration: 8 * FRAME_RATE, ease: Easing.exponential.easeInOut, onfinish: () => { this._fContentContainer_spr.visible = false; this.emit(BossModeHourglassView.EVENT_ON_DISAPPEAR_ANIMATION_COMPLETING)}},
			{ tweens: [{ prop: "scale.x", to: 1.12 }, 	{ prop: "scale.y", to: 3.3 }], 	duration: 3 * FRAME_RATE, ease: Easing.exponential.easeInOut },
			{ tweens: [{ prop: "scale.x", to: 0 }, 		{ prop: "scale.y", to: 0 }], 	duration: 14 * FRAME_RATE, ease: Easing.exponential.easeInOut, onfinish: () => { this.emit(BossModeHourglassView.EVENT_ON_DISAPPEAR_ANIMATION_COMPLETED) }},
		];
		Sequence.start(this._fFlame_spr, lSequenceScale_arr);
	}

	_pause()
	{
		this._fIsPaused_bl = true;

		this._fSandStreamTimer_t && this._fSandStreamTimer_t.pause();
		this._fSandSpreadTimer_t && this._fSandSpreadTimer_t.pause();

		this._fSandStreamParts_spr_arr && this._fSandStreamParts_spr_arr.forEach((spr) => {Sequence.destroy(Sequence.findByTarget(spr));});
		this._fSandSpreadParts_spr_arr && this._fSandSpreadParts_spr_arr.forEach((spr) => {spr.stop()});
	}

	_onTick()
	{
		!this._fIsPaused_bl && this._update();
	}

	destroy()
	{
		APP.off("tick", this._onTick, this);

		this._fSandStreamTimer_t && this._fSandStreamTimer_t.destructor();
		this._fSandStreamTimer_t = null;

		this._fSandSpreadTimer_t && this._fSandSpreadTimer_t.destructor();
		this._fSandSpreadTimer_t = null;

		Sequence.destroy(Sequence.findByTarget(this._fBottomSandBig_spr));
		this._fBottomSandBig_spr = null;

		Sequence.destroy(Sequence.findByTarget(this._fBottomSandSmall_spr));
		this._fBottomSandSmall_spr = null;

		Sequence.destroy(Sequence.findByTarget(this._fTopSandBig_spr));
		this._fTopSandBig_spr = null;

		Sequence.destroy(Sequence.findByTarget(this._fTopSandSmall_spr));
		this._fTopSandSmall_spr = null;

		Sequence.destroy(Sequence.findByTarget(this._fSandSpreadContainer_spr));
		this._fSandSpreadContainer_spr = null;

		if (this._fSandStreamParts_spr_arr)
		{
			for (let l_spr of this._fSandStreamParts_spr_arr)
			{
				Sequence.destroy(Sequence.findByTarget(l_spr));
				l_spr.destroy();
				l_spr = null;
			}
			this._fSandStreamParts_spr_arr = [];
		}

		if (this._fSandSpreadParts_spr_arr)
		{
			for (let l_spr of this._fSandSpreadParts_spr_arr)
			{
				Sequence.destroy(Sequence.findByTarget(l_spr));
				l_spr.destroy();
				l_spr = null;
			}
			this._fSandSpreadParts_spr_arr = [];
		}

		Sequence.destroy(Sequence.findByTarget(this._fFlame_spr));
		this._fFlame_spr = null;

		super.destroy();

		this._fContentContainer_spr = null;
		this._fSandCountainer_spr = null;
		this._fTopSandBigConstiner_spr = null;
		this._fTopSandSmallConstiner_spr = null;
		this._fIsPaused_bl = null;
	}
}

export default BossModeHourglassView;