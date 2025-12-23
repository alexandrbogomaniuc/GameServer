import { Sprite } from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import SimpleUIView from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/SimpleUIView';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { FRAME_RATE, MINI_SLOT_ENABLED } from '../../../../../shared/src/CommonConstants';
import ReelIcon, { ICONS_LAST_ID } from './ReelIcon'
import Timer from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import PointerSprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/ui/PointerSprite';

const REELS_COUNT = 3;
const ICONS_IN_REEL_COUNT = 12;
const LINES_COUNT = 3;
const MIDDLE_ICONS_IN_RELL_COUNT = 6;
const REEL_SPIN_LENGTH = 1143;
const REELS_SPIN_PAUSE_DURATION = 4 * FRAME_RATE;
const WIN_ICON_PRESENTATION_PAUSE_DURATION = 1 * FRAME_RATE;

const ICONS_POSITION_IN_REEL = [
	{x: 0, y: 127},
	{x: 0, y: 0},
	{x: 0, y: -127},

	{x: 0, y: -254},
	{x: 0, y: -381},
	{x: 0, y: -508},

	{x: 0, y: -635},
	{x: 0, y: -762},
	{x: 0, y: -889},
	
	{x: 0, y: -1016},
	{x: 0, y: -1143},
	{x: 0, y: -1270},
];

const REELS_POSITION = [
	{x: -120, y: 0},
	{x: 0, y: 0},
	{x: 120, y: 0},
];

class MiniSlotView extends SimpleUIView
{
	static get EVENT_ON_SPIN_FINISH()						{ return "EVENT_ON_SPIN_FINISH"; }

	reset()
	{
		this._reset();
	}

	showWinAnimation()
	{
		this._showWinAnimation();
	}

	startSpin(aIsAcceleratedMode_bl)
	{
		this._startSpin(aIsAcceleratedMode_bl);
	}

	startAppearingAnimation()
	{
		this._startAppearingAnimation();
	}

	startDisappearingAnimation()
	{
		this._startDisappearingAnimation();
	}

	accelerateSpin()
	{
		this._accelerateSpin();
	}

	get isReelsAnimating()
	{
		return Boolean(this._fSpinReelsTimers_arr_t.length || this._fAnimatinngReelsCount_num > 0);
	}

	constructor()
	{
		super();

		this._fInteractiveArea_btn = null;
		this._fFrameGlow_spr = null;
		this._fFrontShadowGlow_spr = null;
		this._fReelsContainer_spr = null;
		this._fReels_arr_spr = [];
		this._fReelsFilterContainer_spr = null;
		this._fSpinReelsTimers_arr_t = [];
		this._fWinPresentationIconsTimers_arr_t = [];
		this._fReels_spr_arr = [];
		this._fCurrentReelSpinFinishCount_int = 0;
		this._fAnimatinngReelsCount_num = 0;
		this._fReelsNextPositionY_num = null;

		this._fIsAcceleratedMode_bl = false;

		this._addBackShadow();
		this._addBack();
		this._addReels();
		this._addFrontShadow();
		this._addFrontShadowGlow();
		this._addFrame();
		this._addFrameGlow();

		this._fInteractiveArea_btn.on("pointerclick", this._onPointerclick, this);
		this._fInteractiveArea_btn.on("pointerdown", (e)=>e.stopPropagation(), this);
	}

	_addBackShadow()
	{
		const lBackSadow_spr = this.addChild(APP.library.getSprite("mini_slot/back_shadow"));
		lBackSadow_spr.position.set(18, 121);
	}

	_addBack()
	{
		this.addChild(APP.library.getSprite("mini_slot/back"));
	}

	_addReels()
	{
		this._fReelsFilterContainer_spr = this.addChild(new Sprite());
		this._fReelsContainer_spr = this._fReelsFilterContainer_spr.addChild(new Sprite());

		for (let i = 0; i < REELS_COUNT; i++)
		{
			const lReel_spr = this._fReelsContainer_spr.addChild(new Sprite());
			lReel_spr.position = this._getReelPosionById(i);
			this._fReels_arr_spr.push(lReel_spr);
		}

		//this._createAndAddBulgeFilter();

		const MASK_HEIGHT = 246;
		const MASK_WIDTH = 380;
		
		let lMask_gr = this._fReelsContainer_spr.addChild(new PIXI.Graphics());
		lMask_gr.beginFill(0x000000).drawRect(-MASK_WIDTH/2-7, -MASK_HEIGHT/2, MASK_WIDTH, MASK_HEIGHT).endFill();

		this._fReelsContainer_spr.mask = lMask_gr;
	}

	_createAndAddBulgeFilter()
	{
		// create filter
		let fragSrc = `
			precision mediump float;
			varying vec2 vTextureCoord;
			uniform sampler2D uSampler;
			uniform vec2 dimensions;
			uniform vec4 filterArea;

			vec2 mapCoord( vec2 coord )
			{
				coord *= filterArea.xy;
				return coord;
			}

			vec2 unmapCoord( vec2 coord )
			{
				coord /= filterArea.xy;
				return coord;
			}

			vec2 warpAmount = vec2( 6.0 / 34.0, 1.0 / 16.0 );

			vec2 warp(vec2 pos)
			{
				pos = pos * 2.0 - 1.0;
				pos *= vec2(
								1.0 + (pos.y * pos.y) * warpAmount.x,
								1.0 + (pos.x * pos.x) * warpAmount.y
							);
				return pos * 0.5 + 0.5;;
			}

			void main()
			{
				vec2 coord = vTextureCoord;
				coord = mapCoord(coord ) / dimensions;
				coord = warp( coord );
				coord = unmapCoord(coord * dimensions);
				gl_FragColor = texture2D( uSampler, coord );
			}
			`.split('\n').reduce((c, a) => c + a.trim() + '\n');
		let filter = new PIXI.Filter(null, fragSrc);
		filter.apply = function (filterManager, input, output)
		{
			// draw the filter...
			filterManager.applyFilter(this, input, output);
		}

		this._fReelsFilterContainer_spr.filters = [filter];
	}

	_getReelPosionById(aReelId_int)
	{
		return REELS_POSITION[aReelId_int];
	}

	_setDefaultReelsContent()
	{
		const lDefaultReelsContent_obj = this.uiInfo.defaultReelsContent;

		let lCenterLineIconsIds_arr = [];
		while(lCenterLineIconsIds_arr.length < this._fReels_arr_spr.length) {
			let l_num = Math.floor(Math.random() * ICONS_LAST_ID) + 1 /* lines from server start from 1 */;
			if (lCenterLineIconsIds_arr.indexOf(l_num) === -1)
			{
				lCenterLineIconsIds_arr.push(l_num);
			}
		}

		for (let i = 0; i < this._fReels_arr_spr.length; i++)
		{
			for (let j = 0; j < LINES_COUNT; j++)
			{
				const lReelContainer_spr = this._fReels_arr_spr[i];

				let lId_num = (j === 1 /*center line*/) ? lCenterLineIconsIds_arr[i] : lDefaultReelsContent_obj[i + 1 /* lines from server start from 1 */][j];
				const lReelIcon_ri = lReelContainer_spr.addChild(this._getReelIconById(lId_num));
				const lIconPosition_obj = this._getIconPositionInReelByOrderPosition(j);
				lReelIcon_ri.position = lIconPosition_obj;
				lReelIcon_ri.scale.set(0.82);
			}
		}
	}

	_getReelIconById(aReelIconId_int)
	{
		const lReelIcon_ri = new ReelIcon(aReelIconId_int - 1 /* lines from server start from 1 */ );

		return lReelIcon_ri;
	}

	_getIconPositionInReelByOrderPosition(aIconOrderPosition_int)
	{
		const l_obj = Object.assign({}, ICONS_POSITION_IN_REEL[aIconOrderPosition_int]);
		l_obj.y = l_obj.y - this.uiInfo.currentSpinNumber * REEL_SPIN_LENGTH;
		return l_obj;
	}

	_addFrontShadow()
	{
		this.addChild(APP.library.getSprite("mini_slot/front_shadow"));
	}

	_addFrontShadowGlow()
	{
		this._fFrontShadowGlow_spr = this.addChild(APP.library.getSprite("mini_slot/front_shadow_glow"));
		this._resetFrontShadowGlow();
	}

	_resetFrontShadowGlow()
	{
		Sequence.destroy(Sequence.findByTarget(this._fFrontShadowGlow_spr));
		this._fFrontShadowGlow_spr.visible = false;
		this._fFrontShadowGlow_spr.alpha = 1;
	}

	_appearingSlotFrontShadowGlowAnimation()
	{
		this._resetFrontShadowGlow();
		this._fFrontShadowGlow_spr.visible = true;
		Sequence.destroy(Sequence.findByTarget(this._fFrontShadowGlow_spr));

		let lSequenceAlpha_arr = [
			{tweens: [],								duration: 7 * FRAME_RATE},
			{tweens: [{ prop: "alpha", to: 0 }],		duration: 8 * FRAME_RATE}
		];
		Sequence.start(this._fFrontShadowGlow_spr, lSequenceAlpha_arr);
	}

	_disappearingSlotFrontShadowGlowAnimation()
	{
		this._fFrontShadowGlow_spr.alpha = 0;
		this._fFrontShadowGlow_spr.visible = true;
		Sequence.destroy(Sequence.findByTarget(this._fFrontShadowGlow_spr));

		let lSequenceAlpha_arr = [
			{tweens: [{ prop: "alpha", to: 1 }],		duration: 8 * FRAME_RATE}
		];
		Sequence.start(this._fFrontShadowGlow_spr, lSequenceAlpha_arr);
	}

	_addFrame()
	{
		let lFrame_spr = APP.library.getSpriteFromAtlas("mini_slot/frame");
		let lWidth_num = lFrame_spr.width;
		let lHeight_num = lFrame_spr.height;
		this._fInteractiveArea_btn = new PointerSprite();
		this._fInteractiveArea_btn.setHitArea(new PIXI.RoundedRectangle(-lWidth_num/2, -lHeight_num/2, lWidth_num, lHeight_num, lHeight_num/2));

		this.addChild(this._fInteractiveArea_btn);
		this.addChild(lFrame_spr);
	}

	_addFrameGlow()
	{
		this._fFrameGlow_spr = this.addChild(APP.library.getSprite("mini_slot/frame_glow"));
		this._fFrameGlow_spr.blendMode = PIXI.BLEND_MODES.SCREEN;
		this._resetFrameGlow();
	}

	_resetFrameGlow()
	{
		Sequence.destroy(Sequence.findByTarget(this._fFrameGlow_spr));
		this._fFrameGlow_spr.visible = false;
		this._fFrameGlow_spr.alpha = 1;
	}

	_appearingSlotFrameGlowAnimation()
	{
		this._resetFrameGlow();
		this._fFrameGlow_spr.visible = true;
		Sequence.destroy(Sequence.findByTarget(this._fFrameGlow_spr));

		let lSequenceAlpha_arr = [
			{tweens: [],								duration: 7 * FRAME_RATE},
			{tweens: [{ prop: "alpha", to: 0 }],		duration: 8 * FRAME_RATE}
		];
		Sequence.start(this._fFrameGlow_spr, lSequenceAlpha_arr);
	}

	_disappearingSlotFrameGlowAnimation()
	{
		this._fFrameGlow_spr.alpha = 0;
		this._fFrameGlow_spr.visible = true;
		Sequence.destroy(Sequence.findByTarget(this._fFrameGlow_spr));

		let lSequenceAlpha_arr = [
			{tweens: [{ prop: "alpha", to: 1 }],		duration: 8 * FRAME_RATE}
		];
		Sequence.start(this._fFrameGlow_spr, lSequenceAlpha_arr);
	}

	_resetReels()
	{
		for (let i = 0; i < REELS_COUNT; i++)
		{
			const lReelContainer_spr = this._fReels_arr_spr[i];
			Sequence.destroy(Sequence.findByTarget(lReelContainer_spr));
			for (let lIcon_spr of lReelContainer_spr.children)
			{
				lIcon_spr.destroy();
			}
			lReelContainer_spr.position.y = 0;
		}

		if (this._fSpinReelsTimers_arr_t && this._fSpinReelsTimers_arr_t.length > 0)
		{
			for (let l_t of this._fSpinReelsTimers_arr_t)
			{
				l_t.destructor();
			}
			this._fSpinReelsTimers_arr_t = [];
		}

		if (this._fWinPresentationIconsTimers_arr_t && this._fWinPresentationIconsTimers_arr_t.length > 0)
		{
			for (let l_t of this._fWinPresentationIconsTimers_arr_t)
			{
				l_t.destructor();
			}
			this._fWinPresentationIconsTimers_arr_t = [];
		}
	}

	_startIconsGlowAnimation()
	{
		for (let i = 0; i < REELS_COUNT; i++)
		{
			const lReelContainer_spr = this._fReels_arr_spr[i];
			for (let lIcon_spr of lReelContainer_spr.children)
			{
				lIcon_spr.startGlowAnimation();
			}
		}
	}

	_onPointerclick(e)
	{
		e.stopPropagation();

		this._accelerateSpin();
	}

	_reset()
	{
		this._resetFrameGlow();
		this._resetFrontShadowGlow();
		this._resetReels();
		this._fCurrentReelSpinFinishCount_int = 0;
		this._fAnimatinngReelsCount_num = 0;
		this._fReels_spr_arr = [];
		this._fIsAcceleratedMode_bl = false;
	}

	_startAppearingAnimation()
	{
		this._setDefaultReelsContent();
		this._startIconsGlowAnimation();
		this._appearingSlotFrontShadowGlowAnimation();
		this._appearingSlotFrameGlowAnimation();
	}

	_startDisappearingAnimation()
	{
		this._startIconsGlowAnimation();
		this._disappearingSlotFrontShadowGlowAnimation();
		this._disappearingSlotFrameGlowAnimation();
	}

	_startSpin(aIsAcceleratedMode_bl)
	{
		this._removeSpinedIcons();
		this._prepareReelsForSpin();
		this._spinReels(aIsAcceleratedMode_bl);
	}

	_removeSpinedIcons()
	{
		if (this.uiInfo.currentSpinNumber > 0)
		{
			for (let i = 0; i < REELS_COUNT; i++)
			{
				for (let j = 0; j < ICONS_IN_REEL_COUNT - LINES_COUNT; j++)
				{
					const lReelContainer_spr = this._fReels_arr_spr[i];
					const lReelIcon_ri = lReelContainer_spr.children.shift();
					lReelIcon_ri.destroy();
				}
			}
		}
	}

	_prepareReelsForSpin()
	{
		this._addMiddleIcons();
		this._addSpinFinishIcons();
	}

	_addMiddleIcons()
	{
		const lDefaultReelsContent_obj = this.uiInfo.defaultReelsContent;

		for (let i = 0; i < REELS_COUNT; i++)
		{
			for (let j = 0; j < MIDDLE_ICONS_IN_RELL_COUNT; j++)
			{
				const lReelContainer_spr = this._fReels_arr_spr[i];
				const lReelIcon_ri = lReelContainer_spr.addChild(this._getReelIconById(lDefaultReelsContent_obj[i + 1 /* lines from server start from 1 */][j]));
				const lIconPosition_obj = this._getIconPositionInReelByOrderPosition(j + LINES_COUNT/* add icons to reels next to currently existing on the screen */);
				lReelIcon_ri.position = lIconPosition_obj;
				lReelIcon_ri.scale.set(0.82);
			}
		}
	}

	_addSpinFinishIcons()
	{
		const lSpinFinishIconsContent_obj = this.uiInfo.getCurrentSpinFinishIconsContent();
		for (let i = 0; i < REELS_COUNT; i++)
		{
			for (let j = 0; j < LINES_COUNT; j++)
			{
				const lReelContainer_spr = this._fReels_arr_spr[i];
				const lReelIcon_ri = lReelContainer_spr.addChild(this._getReelIconById(lSpinFinishIconsContent_obj[i][j]));
				const lIconPosition_obj = this._getIconPositionInReelByOrderPosition(j + LINES_COUNT + MIDDLE_ICONS_IN_RELL_COUNT/* add icons to reels next to currently existing on the screen and next to that will be appeared during spin */);
				lReelIcon_ri.position = lIconPosition_obj;
				lReelIcon_ri.scale.set(0.82);
			}
		}
	}

	_accelerateSpin()
	{
		this._fIsAcceleratedMode_bl = true;
		
		this._fReelsNextPositionY_num && this._fReels_spr_arr.forEach(((reel) => {
			let lReelSeqs_arr = Sequence.findByTarget(reel);
			if (lReelSeqs_arr && lReelSeqs_arr.length > 0)
			{
				Sequence.destroy(lReelSeqs_arr);
				let lSequencePosition_arr = [
					{tweens: [{ prop: "y", to: this._fReelsNextPositionY_num }], duration: 5 * FRAME_RATE, ease: this._backEaseInOut, onfinish: ()=>{
						let id = this._fReels_spr_arr.indexOf(reel);
						if (~id) this._fReels_spr_arr.splice(id, 1);
						this._fReelsNextPositionY_num = null;
						this._onReelSpinFinish();
					}},
				];
				Sequence.start(reel, lSequencePosition_arr);
			}
		}));
	}

	_spinReels(aIsAcceleratedMode_bl=false)
	{
		this._fIsAcceleratedMode_bl = aIsAcceleratedMode_bl;
		if(!MINI_SLOT_ENABLED)
		{
			this._fIsAcceleratedMode_bl = true;
		}
		for (let i = 0; i < this._fReels_arr_spr.length; i++)
		{
			const l_t = new Timer(()=>{
				let id = this._fSpinReelsTimers_arr_t.indexOf(l_t);
				if (~id) this._fSpinReelsTimers_arr_t.splice(id, 1);
				this._spinReel(this._fReels_arr_spr[i]);
			}, REELS_SPIN_PAUSE_DURATION * i);
			this._fSpinReelsTimers_arr_t.push(l_t);
		}
	}

	_spinReel(aReel_spr)
	{
		Sequence.destroy(Sequence.findByTarget(aReel_spr));

		++this._fAnimatinngReelsCount_num;
		this._fReels_spr_arr.push(aReel_spr);
		this._fReelsNextPositionY_num = aReel_spr.position.y + REEL_SPIN_LENGTH;
		let lDuration_num = this._fIsAcceleratedMode_bl ? 5 * FRAME_RATE : 40 * FRAME_RATE;
		let lSequencePosition_arr = [
			{tweens: [{ prop: "y", to: aReel_spr.position.y + REEL_SPIN_LENGTH }], duration: lDuration_num, ease: this._backEaseInOut, onfinish: ()=>{
				let id = this._fReels_spr_arr.indexOf(aReel_spr);
				if (~id) this._fReels_spr_arr.splice(id, 1);
				this._fReelsNextPositionY_num = null;
				this._onReelSpinFinish();
			}},
		];
		Sequence.start(aReel_spr, lSequencePosition_arr);
	}

	_backEaseInOut(t, b, c, d)
	{
		let s = 1.70158 / 2;
		if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
		return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
	}

	_showWinAnimation()
	{
		for (let i = 0; i < REELS_COUNT; i++)
		{
			const lReelContainer_spr = this._fReels_arr_spr[i];
			if (lReelContainer_spr && lReelContainer_spr.children.length > LINES_COUNT)
			{
				const lWinLineIcon_spr = lReelContainer_spr.children[lReelContainer_spr.children.length - 2];
				const l_t = new Timer(this._showWinIconAnimation.bind(this, lWinLineIcon_spr), WIN_ICON_PRESENTATION_PAUSE_DURATION * i);
				this._fWinPresentationIconsTimers_arr_t.push(l_t);
			}
		}
	}

	_showWinIconAnimation(aIcon_spr)
	{
		aIcon_spr.startScaleAnimation();
		aIcon_spr.startGlowAnimation();
	}

	_onReelSpinFinish()
	{
		this._fCurrentReelSpinFinishCount_int++;
		--this._fAnimatinngReelsCount_num;
		if (this._fCurrentReelSpinFinishCount_int == REELS_COUNT)
		{
			this._fCurrentReelSpinFinishCount_int = 0;
			this.emit(MiniSlotView.EVENT_ON_SPIN_FINISH);
		}
	}

	destroy()
	{
		super.destroy();

		Sequence.destroy(Sequence.findByTarget(this._fFrameGlow_spr));
		this._fFrameGlow_spr = null;

		this._fInteractiveArea_btn.destroy();
		this._fInteractiveArea_btn = null;

		Sequence.destroy(Sequence.findByTarget(this._fFrontShadowGlow_spr));
		this._fFrontShadowGlow_spr = null;

		if (this._fReels_arr_spr && this._fReels_arr_spr.length > 0)
		{
			for (let l_spr of this._fReels_arr_spr)
			{
				Sequence.destroy(Sequence.findByTarget(l_spr));
				for (let lIcon_spr of l_spr.children)
				{
					lIcon_spr.destroy();
				}
				l_spr.destroy();
			}
			this._fReels_arr_spr = null;
		}
		this._fReelsContainer_spr = null;

		this._fReelsFilterContainer_spr = null;

		if (this._fSpinReelsTimers_arr_t && this._fSpinReelsTimers_arr_t.length > 0)
		{
			for (let l_t of this._fSpinReelsTimers_arr_t)
			{
				l_t.destructor();
			}
			this._fSpinReelsTimers_arr_t = null;
		}

		if (this._fWinPresentationIconsTimers_arr_t && this._fWinPresentationIconsTimers_arr_t.length > 0)
		{
			for (let l_t of this._fWinPresentationIconsTimers_arr_t)
			{
				l_t.destructor();
			}
			this._fWinPresentationIconsTimers_arr_t = null;
		}

		this._fCurrentReelSpinFinishCount_int = 0;
		this._fReelsNextPositionY_num = null;
		this._fIsAcceleratedMode_bl = undefined;
	}
}

export default MiniSlotView;