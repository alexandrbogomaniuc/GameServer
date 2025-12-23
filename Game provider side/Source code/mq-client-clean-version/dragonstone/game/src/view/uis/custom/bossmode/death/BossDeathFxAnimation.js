import Sprite from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import Timer from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../../../shared/src/CommonConstants';
import TorchFxAnimation from './../../../../../main/animation/TorchFxAnimation';

const BOSS_CRACKS_PARAMS = [
	{ //crack #1
		offset:	{x:35, y:123},
		times:	[4, 4, 7, 12],
		parts:	[
			[{x:-23, y: 41}, {x:-27, y: 28}, {x:-16, y: 16}, {x:-13, y: 16}, {x:-23, y: 29}, {x:-23, y: 41}],
			[{x:- 4, y: 37}, {x:- 9, y: 20}, {x:- 8, y: 16}, {x:- 6, y: 16}, {x:- 7, y: 20}, {x:- 4, y: 37}],
			[{x:-16, y: 16}, {x:-14, y: 14}, {x:-15, y:  4}, {x:- 4, y:- 8}, {x:- 2, y:- 8}, {x:- 1, y:- 3}, {x:- 6, y: 16}, {x:- 8, y: 16}, {x:- 4, y:- 3}, {x:-12, y:  6}, {x:-13, y: 16}],
			[{x:- 4, y:- 8}, {x:- 9, y:-26}, {x:-16, y:-35}, {x:- 9, y:-29}, {x:  0, y:-47}, {x:- 6, y:-26}, {x:- 2,y:- 8}]
		],
		limits:	[{x:-27, y:28}, {x:0, y:-47}, {x:-23, y:41}],
		weaks:	[{x:-4, y:-16}, {x:1, y:7}, {x:-10, y:17}, {x:-4, y:31}, {x:-21, y:40}]
	},
	{ //crack #2
		offset:	{x:16, y:-98},
		times:	[10, 16, 17, 21, 21],
		parts:	[
			[{x: 52, y:-18}, {x: 26, y:- 3}, {x: 18, y:- 3}, {x: 18, y:  0}, {x: 27, y:  0}, {x: 40, y:  6}, {x: 32, y:- 1}, {x: 52, y:-18}],
			[{x: 18, y:- 3}, {x:- 2, y:- 3}, {x:  0, y:  5}, {x:  2, y:  0}, {x: 18, y:  0}],
			[{x:- 2, y:- 3}, {x:-28, y: 13}, {x:-28, y: 16}, {x:- 3, y:  2}, {x:-14, y: 17}, {x:-24, y: 19}, {x:-28, y: 25}, {x:-28, y: 30}, {x:-22, y: 21}, {x:- 9, y: 19}, {x:  0, y:  5}],
			[{x:-28, y: 13}, {x:-31, y: 15}, {x:-58, y: 16}, {x:-31, y: 18}, {x:-28, y: 16}],
			[{x:-28, y: 25}, {x:-39, y: 40}, {x:-53, y: 41}, {x:-36, y: 43}, {x:-28, y: 30}]
		],
		limits:	[{x:-58, y:16}, {x:52, y:-18}, {x:-36, y:43}],
		weaks:	[{x:34, y:-5}, {x:29, y:0}, {x:0, y:0}, {x:-10, y:-17}, {x:-31, y:16}, {x:-35, y:39}]
	},
	{ //crack #3
		offset:	{x:-7, y:38},
		times:	[13, 16],
		parts:	[
			[{x:-48, y:-17}, {x:-24, y:- 2}, {x:  2, y:- 2}, {x:- 2, y:  1}, {x:-26, y:  1}, {x:-37, y:  6}, {x:-29, y:  0}, {x:-48, y:-17}],
			[{x:  2, y:- 2}, {x: 27, y: 12}, {x: 46, y: 14}, {x: 26, y: 15}, {x:  3, y:  2}, {x: 11, y: 14}, {x: 20, y: 17}, {x: 34, y: 35}, {x: 45, y: 36}, {x: 31, y: 37}, {x: 19, y: 18}, {x:  8, y: 17}, {x:- 2, y:  1}]
		],
		limits:	[{x:-48, y:-17}, {x:46, y:14}, {x:31, y:37}],
		weaks:	[{x:-28, y:-2}, {x:0, y:-1}, {x:9, y:15}, {x:28, y:14}, {x:32, y:36}]
	},
	{ //crack #4
		offset:	{x:4, y:-9},
		times:	[17, 21, 21],
		parts:	[
			[{x:-38, y: 46}, {x:-19, y: 37}, {x:-17, y: 18}, {x:-31, y: 13}, {x:-28, y:  9}, {x:-15, y: 16}, {x:-16, y: 36}, {x:- 5, y: 38}, {x:  5, y: 26}, {x:  8, y: 27}, {x:- 5, y: 40}, {x:-21, y: 41}, {x:-38, y: 46}],
			[{x:-31, y: 13}, {x:-29, y:-34}, {x:-27, y:-19}, {x:-13, y:-28}, {x:-26, y:-15}, {x:-28, y:  9}],
			[{x:  5, y: 26}, {x:- 1, y:  0}, {x:  2, y:-23}, {x:  3, y:- 3}, {x: 14, y:-11}, {x: 20, y:-20}, {x: 17, y:- 9}, {x:  5, y:- 1}, {x:  8, y: 27}]
		],
		limits:	[{x:-38, y:46}, {x:-29, y:-34}, {x:20, y:-20}],
		weaks:	[{x:-27, y:-17}, {x:-29, y:12}, {x:3, y:-2}, {x:-15, y:38}]
	},
	{ //crack #5
		offset:	{x:-21, y:82},
		times:	[18, 21],
		parts:	[
			[{x:-22, y:-47}, {x:-25, y:-34}, {x:-12, y:-20}, {x:-13, y:-10}, {x:- 3, y:  0}, {x:  1, y:- 2}, {x:- 5, y:-25}, {x:- 3, y:-43}, {x:- 8, y:-25}, {x:- 3, y:- 3}, {x:-11, y:-13}, {x:-11, y:-22}, {x:-22, y:-36}, {x:-22, y:-47}],
			[{x:- 3, y:  0}, {x:- 7, y: 20}, {x:-14, y: 27}, {x:- 8, y: 24}, {x:  0, y: 41}, {x:- 4, y: 20}, {x:  1, y:- 2}]
		],
		limits:	[{x:-25, y:-34}, {x:-22, y:-47}, {x:1, y:-2}, {x:0, y:41}],
		weaks:	[{x:-2, y:-2}, {x:-12, y:-11}, {x:-6, y:22}, {x:-23, y:-35}]
	},
	{ //crack #6
		offset:	{x:97, y:-68},
		times:	[19, 19, 25],
		parts:	[
			[{x:-20, y:-46}, {x:-24, y:-33}, {x:-11, y:-19}, {x:-13, y:-9 }, {x:-10, y:-12}, {x:-10, y:-20}, {x:-21, y:-34}, {x:-20, y:-46}],
			[{x:- 2, y:-42}, {x:- 7, y:-24}, {x:- 4, y:-12}, {x:- 1, y:-12}, {x:- 5, y:-25}, {x:- 2, y:-42}],
			[{x:-13, y:- 9}, {x:- 2, y:  2}, {x:- 7, y: 20}, {x:-14, y: 29}, {x:- 7, y: 24}, {x:  1, y: 42}, {x:- 4, y: 21}, {x:  2, y:  0}, {x:- 1, y:-12}, {x:- 4, y:-12}, {x:- 2, y:- 2}, {x:-10, y:-12}]
		],
		limits:	[{x:-24, y:-33}, {x:-20, y:-46}, {x:2, y:0}, {x:1, y:42}],
		weaks:	[{x:0, y:0}, {x:-11, y:-10}, {x:-5, y:23}, {x:-23, y:-33}]
	},
	{ //crack #7
		offset:	{x:15, y:-137},
		times:	[23, 26],
		parts:	[
			[{x: 37, y:-46}, {x: 16, y:-39}, {x: 14, y:-36}, {x: 14, y:-16}, {x: 28, y:- 8}, {x: 25, y: 15}, {x: 12, y: 27}, {x: 26, y: 18}, {x: 27, y: 34}, {x: 30, y:-12}, {x: 15, y:-18}, {x: 17, y:-37}, {x: 37, y:-46}],
			[{x: 16, y:-39}, {x:  4, y:-39}, {x:- 8, y:-26}, {x:- 5, y:  1}, {x:-18, y: 10}, {x:-21, y: 21}, {x:-16, y: 12}, {x:- 4, y:  4}, {x:- 3, y: 21}, {x:- 1, y:  1}, {x:- 7, y:-25}, {x:  3, y:-37}, {x: 14, y:-36}]
		],
		limits:	[{x:-21, y:21}, {x:37, y:-46}, {x:27, y:34}],
		weaks:	[{x:-4, y:1}, {x:27, y:-10}, {x:-7, y:-23}, {x:26, y:17}, {x:15, y:-38}]
	},
	{ //crack #8
		offset:	{x:-39, y:-137},
		times:	[27, 31, 31],
		parts:	[
			[{x: 40, y: 48}, {x: 22, y: 42}, {x:  7, y: 41}, {x:- 5, y: 28}, {x:- 4, y: 10}, {x:  0, y: 10}, {x:- 3, y: 27}, {x:  7, y: 39}, {x: 18, y: 38}, {x: 17, y: 18}, {x: 31, y: 10}, {x: 34, y: 14}, {x: 19, y: 20}, {x: 21, y: 38}, {x: 40, y: 48}],
			[{x:- 4, y: 10}, {x:- 2, y:  0}, {x:-14, y:- 9}, {x:-17, y:-19}, {x:-12, y:-10}, {x:- 1, y:- 2}, {x:  1, y:-19}, {x:  3, y:  1}, {x:  0, y: 10}],
			[{x: 31, y: 10}, {x: 28, y:-14}, {x: 15, y:-26}, {x: 29, y:-17}, {x: 31, y:-33}, {x: 34, y: 14}]
		],
		limits:	[{x:-17, y:-19}, {x:31, y:-33}, {x:40, y:48}],
		weaks:	[{x:1, y:0}, {x:31, y:-14}, {x:28, y:14}, {x:15, y:40}]
	},
	{ //crack #9
		offset:	{x:-35, y:-176},
		times:	[31, 35, 39, 39],
		parts:	[
			[{x: 54, y:-56}, {x: 41, y:-60}, {x: 13, y:-47}, {x:  9, y:-30}, {x:  3, y:-30}, {x: 10, y:-49}, {x: 46, y:-65}, {x: 54, y:-56}],
			[{x:  9, y:-30}, {x:-12, y:- 7}, {x: 22, y:- 2}, {x:-12, y:- 2}, {x:-16, y:- 3}, {x:-29, y:  4}, {x:-33, y:  2}, {x:-16, y:- 5}, {x:  3, y:-30}],
			[{x: 22, y:- 2}, {x:  0, y:  5}, {x:  8, y: 27}, {x: 22, y: 27}, {x: 23, y: 37}, {x: 20, y: 30}, {x:  6, y: 32}, {x:- 3, y: 60}, {x:  3, y: 31}, {x:- 2, y:  4}, {x:-12, y:- 2}],
			[{x:-29, y:  4}, {x:-28, y: 24}, {x:-34, y: 30}, {x:-25, y: 49}, {x:-38, y: 32}, {x:-51, y: 39}, {x:-51, y: 50}, {x:-54, y: 60}, {x:-44, y: 64}, {x:-41, y: 72}, {x:-37, y: 73}, {x:-42, y: 74}, {x:-46, y: 66}, {x:-56, y: 64}, {x:-68, y: 79}, {x:-57, y: 62}, {x:-54, y: 50}, {x:-55, y: 39}, {x:-34, y: 25}, {x:-33, y:  2}]
		],
		limits:	[{x:-68, y:79}, {x:46, y:-65}, {x:54, y:-56}],
		weaks:	[{x:0, y:-1}, {x:-30, y:23}, {x:5, y:-28}, {x:6, y:31}, {x:46, y:-62}, {x:-56, y:61}]
	}
];

const CRACKS_ANIMATION_TICKS_AMOUNT = 39;
const CRACKS_ANIMATION_TICKS_FREQUENCY = 33;

class BossDeathFxAnimation extends Sprite
{
	static get EVENT_FLARE_STARTED()				{return "onBossDeathFxFlareAnimationStarted";}
	static get EVENT_CRACK_STARTED()				{return "onBossDeathFxCrackAnimationStarted";}
	static get EVENT_OUTRO_STARTED()				{return "onBossDeathFxOutroAnimationCompleted";}
	static get EVENT_ANIMATION_COMPLETED()			{return "onBossDeathFxAnimationCompleted";}
	static get EVENT_ON_TIME_TO_EXPLODE_COINS()		{return "onTimeToExplodeCoins";}

	playIntro(offset)
	{
		this._playIntro(offset);
	}

	constructor(aEnemy, aPlayerWin_obj)
	{
		super();

		TorchFxAnimation.initTextures();

		this._fCoinsExplodeTimer_t = null;
		this._fPlayerWin_obj = aPlayerWin_obj;

		let lSpineView_sprt = aEnemy.spineView;
		let centerOffset = aEnemy.getCurrentCenter();

		let lRememberStats_obj = {
			containerRotation: this.rotation,
			spinePosX: lSpineView_sprt.position.x,
			spinePosY: lSpineView_sprt.position.y
		};
		this.rotation = 0;
		lSpineView_sprt.position.x = 0;
		lSpineView_sprt.position.y = 0;

		let lSpineScale_pt = lSpineView_sprt.scale;
		let lSpineLocBounds_obj = lSpineView_sprt.view.getLocalBounds();

		lSpineView_sprt.view.x = -lSpineLocBounds_obj.x*lSpineView_sprt.view.scale.x;
		lSpineView_sprt.view.y = -lSpineLocBounds_obj.y*lSpineView_sprt.view.scale.y;

		this._fSpineTexture_tx = PIXI.RenderTexture.create({ width: lSpineLocBounds_obj.width*lSpineView_sprt.view.scale.x, height: lSpineLocBounds_obj.height*lSpineView_sprt.view.scale.y });
		APP.stage.renderer.render(lSpineView_sprt.view, { renderTexture: this._fSpineTexture_tx });
		let sprite = new PIXI.Sprite(this._fSpineTexture_tx);

		this._fSpineTexturePixels_arr = APP.stage.renderer.plugins.extract.pixels(this._fSpineTexture_tx);

		lSpineView_sprt.view.x = 0;
		lSpineView_sprt.view.y = 0;

		let lLocalSpineBounds_obj = lSpineView_sprt.view.getLocalBounds();
		lLocalSpineBounds_obj.x *= lSpineView_sprt.scale.x;
		lLocalSpineBounds_obj.y *= lSpineView_sprt.scale.y;
		lLocalSpineBounds_obj.width *= lSpineView_sprt.scale.x;
		lLocalSpineBounds_obj.height *= lSpineView_sprt.scale.y;

		this.rotation = lRememberStats_obj.containerRotation;
		lSpineView_sprt.position.x = lRememberStats_obj.spinePosX;
		lSpineView_sprt.position.y = lRememberStats_obj.spinePosY;
		lRememberStats_obj = null;

		this._torchContainer = this.addChild(new Sprite());

		this._fSpineTextureMiddlePoint_obj = {x: 1220, y: 1410};//this._calcMiddlePoint();
		this._fCracksContainer_sprt = this.addChild(new Sprite());
		this._fCrackParts_arr_arr = [];
		this._fDeathFxContainer_sprt = this.addChild(new Sprite());
		this._fDeathBeams_arr_arr = [];
		for (let i = 0; i < BOSS_CRACKS_PARAMS.length; i++)
		{
			let lParams_obj = BOSS_CRACKS_PARAMS[i];
			let lTotalOffset_obj = {x:lParams_obj.offset.x + this._fSpineTextureMiddlePoint_obj.x, y:lParams_obj.offset.y + this._fSpineTextureMiddlePoint_obj.y};
			let lMissAmount_int = 0;//this._calcHitMissings(lParams_obj.limits, lTotalOffset_obj);

			if (lMissAmount_int == 0)
			{
				let lCrack_sprt = this._fCracksContainer_sprt.addChild(new Sprite());
				lCrack_sprt.position.set(lTotalOffset_obj.x, lTotalOffset_obj.y);

				let lParts_arr = lParams_obj.parts;
				for (let j = 0; j < lParts_arr.length; j++)
				{
					let lCrackPart_gr = lCrack_sprt.addChild(new PIXI.Graphics());
					lCrackPart_gr.beginFill(0xff99cc);
					lCrackPart_gr.blendMode = PIXI.BLEND_MODES.SCREEN;
					lCrackPart_gr.moveTo(lParts_arr[j][0].x, lParts_arr[j][0].y);
					for (let k = 1; k < lParts_arr[j].length; k++)
					{
						lCrackPart_gr.lineTo(lParts_arr[j][k].x, lParts_arr[j][k].y);
					}
					lCrackPart_gr.endFill();
					lCrackPart_gr.visible = false;

					let lCrackTime_int = lParams_obj.times[j];
					if (lCrackTime_int !== undefined)
					{
						this._fCrackParts_arr_arr[lCrackTime_int] = this._fCrackParts_arr_arr[lCrackTime_int] || [];
						this._fCrackParts_arr_arr[lCrackTime_int].push(lCrackPart_gr);
					}
				}
			}

			let lDeathBeamTime_int = lParams_obj.times[lParams_obj.times.length - 1];
			let lDeathBeamPoints_arr = lParams_obj.weaks;
			let lDeathBeamPoint_obj;
			for (let j = 0; j < lDeathBeamPoints_arr.length; j++)
			{
				let lPoint_obj = {x:lTotalOffset_obj.x + lDeathBeamPoints_arr[j].x, y:lTotalOffset_obj.y + lDeathBeamPoints_arr[j].y};
				lDeathBeamPoint_obj = lPoint_obj;
				if (this._spineHitTest(lPoint_obj.x, lPoint_obj.y))
				{
					break;
				}
			}

			if (lDeathBeamTime_int !== undefined && lDeathBeamPoint_obj)
			{
				let dx = lDeathBeamPoint_obj.x - this._fSpineTextureMiddlePoint_obj.x;
				let dy = lDeathBeamPoint_obj.y - this._fSpineTextureMiddlePoint_obj.y;
				let lRotation_num = dy < 0 ? Math.PI - Math.atan(dx/dy) : -Math.atan(dx/dy);
				this._fDeathBeams_arr_arr[lDeathBeamTime_int] = this._fDeathBeams_arr_arr[lDeathBeamTime_int] || [];
				this._fDeathBeams_arr_arr[lDeathBeamTime_int].push(this._fDeathFxContainer_sprt.addChild(this._createDeathBeam(lDeathBeamPoint_obj, lRotation_num)));
			}
		}
		this._fCracksContainer_sprt.scale.set(lSpineScale_pt.x, lSpineScale_pt.y);
		this._fCracksContainer_sprt.position.set(-APP.config.size.width/2 + centerOffset.x, -APP.config.size.height + centerOffset.y);

		this._fDeathFxContainer_sprt.scale.set(lSpineScale_pt.x, lSpineScale_pt.y);
		this._fDeathFxContainer_sprt.position.set(-APP.config.size.width/2 + centerOffset.x, -APP.config.size.height + centerOffset.y);

		this.visible = false;
	}

	_playIntro(offset = 0)
	{
		if (offset)
		{
			this._fTimeout_t && this._fTimeout_t.destructor();
			this._fTimeout_t = new Timer(()=>this._startAnimation(), offset);
		}
		else
		{
			this._startAnimation();
		}
	}

	_startAnimation()
	{
		this.visible = true;

		this._fTimeout_t && this._fTimeout_t.destructor();
		this._fTimeout_t = new Timer(()=>this._continueIntro(), 39*FRAME_RATE);

		this._startTorchAnimation();
		this._startTorchAnimation();
		this._startTorchAnimation();

		this._startCrack();

		this._fDeathFxContainer_sprt.visible = true;
	}

	_startTorchAnimation()
	{
		let lTorch_sprt = this._torchContainer.addChild(new Sprite);
		lTorch_sprt.textures = TorchFxAnimation.textures.torch;
		lTorch_sprt.position.set(0, -40);
		lTorch_sprt.anchor.set(0.5, 1);
		lTorch_sprt.blendMode = PIXI.BLEND_MODES.SCREEN;
		lTorch_sprt.tint = 0xff2288;
		lTorch_sprt.scale.set(2);
		lTorch_sprt.play();
	}

	_startCrack()
	{
		this._fCracksContainer_sprt.visible = true;

		this._fCrackTimer_t && this._fCrackTimer_t.destructor();
		this._fCrackTick_int = -1;
		this._onCrackTick();

		this._fCrackTimer_t && this._fCrackTimer_t.destructor();
		this._fCrackTimer_t = new Timer(()=>this._onCrackTick(), CRACKS_ANIMATION_TICKS_FREQUENCY, true);
		this._fCrackTimer_t.start();
	}

	_continueIntro()
	{
		this._fCoinsExplodeTimer_t && this._fCoinsExplodeTimer_t.destructor();

		if (this._fPlayerWin_obj && (this._fPlayerWin_obj.coPlayerWin || this._fPlayerWin_obj.playerWin))
		{
			this._fCoinsExplodeTimer_t = new Timer(()=>{
				this.emit(BossDeathFxAnimation.EVENT_ON_TIME_TO_EXPLODE_COINS, {isCoPlayerWin: this._fPlayerWin_obj.coPlayerWin && !this._fPlayerWin_obj.playerWin});
			}, 18*FRAME_RATE);
		}

		this._fTimeout_t && this._fTimeout_t.destructor();
		this._fTimeout_t = new Timer(()=>this._playOutro(), 22*FRAME_RATE);

		this.emit(BossDeathFxAnimation.EVENT_FLARE_STARTED);
	}

	_playOutro()
	{
		this._fTimeout_t && this._fTimeout_t.destructor();
		this._fTimeout_t = new Timer(()=>this._onOutroTime(), 32 * FRAME_RATE);

		this.emit(BossDeathFxAnimation.EVENT_OUTRO_STARTED);
	}

	_onOutroTime()
	{
		this._fTimeout_t && this._fTimeout_t.destructor();
		this._fTimeout_t = null;

		this._onBossDeathAnimationCompleted();
	}

	_onCrackTick()
	{
		this._fCrackTick_int++;

		let lParts_arr = this._fCrackParts_arr_arr[this._fCrackTick_int] || [];
		for (let i = 0; i < lParts_arr.length; i++)
		{
			lParts_arr[i].visible = true;
		}

		let lDeathBeams_arr = this._fDeathBeams_arr_arr[this._fCrackTick_int] || [];
		if(APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			for (let i = 0; i < lDeathBeams_arr.length; i++)
			{
				let lDeathBeam_sprt = lDeathBeams_arr[i];
				lDeathBeam_sprt.fadeTo(1, 2*FRAME_RATE);

				let lDeathSplat_sprt = this._fDeathFxContainer_sprt.addChild(this._createDeathSplat());
				lDeathSplat_sprt.position.set(lDeathBeam_sprt.x, lDeathBeam_sprt.y);
				lDeathSplat_sprt.fadeTo(0, 7*FRAME_RATE, null, (e) => {e.target.obj.destroy()});

				if (Math.random() < 0.7)
				{
					let lDistance_num = 2000;
					let lAngle_num = lDeathBeam_sprt.rotation;
					let lDeathBullet_sprt = this._fDeathFxContainer_sprt.addChild(this._createDeathBullet());
					lDeathBullet_sprt.position.set(lDeathBeam_sprt.x, lDeathBeam_sprt.y);
					lDeathBullet_sprt.rotation = lAngle_num;
					lDeathBullet_sprt.moveBy(-lDistance_num * Math.sin(lAngle_num), lDistance_num * Math.cos(lAngle_num), 30*FRAME_RATE, null, (e) => {e.target.obj.destroy()});
				}
			}
		}
		if (lDeathBeams_arr.length)
		{
			this.emit(BossDeathFxAnimation.EVENT_CRACK_STARTED);
		}

		if (this._fCrackTick_int >= CRACKS_ANIMATION_TICKS_AMOUNT && this._fCrackTimer_t)
		{
			this._fCrackTimer_t.destructor();
		}
	}

	_spineHitTest(aX_num, aY_num)
	{
		if (aX_num < 0 || aY_num < 0 || !this._fSpineTexturePixels_arr) return false;
		return this._fSpineTexturePixels_arr[(aY_num * this._fSpineTexture_tx.width + aX_num) * 4 + 3] > 0
	}
	
	_calcMiddlePoint()
	{
		let sumX = 0, sumY = 0, n = 0;
		for (let j = 0; j < this._fSpineTexture_tx.height; j++)
		{
			for (let i = 0; i < this._fSpineTexture_tx.width; i++)
			{
				if (this._spineHitTest(i, j))
				{
					n++;
					sumX+=i;
					sumY+=j;
				}
			}
		}
		return {x:Math.floor(sumX/n), y:Math.floor(sumY/n)}
	}

	_calcHitMissings(aLimits_arr, aOffset_obj, aAddOffset_obj = {x:0, y:0})
	{
		let lMissAmount_int = 0;
		for (let i = 0; i < aLimits_arr.length; i++)
		{
			lMissAmount_int += (this._spineHitTest(aLimits_arr[i].x + aOffset_obj.x + aAddOffset_obj.x, aLimits_arr[i].y + aOffset_obj.y + aAddOffset_obj.y) ? 0 : 1);
		}
		return lMissAmount_int;
	}

	_createDeathBeam(aPosition_obj, aRotation_num)
	{
		let lDeathBeam_sprt = APP.library.getSpriteFromAtlas(this._deathBeamTextureName);
		lDeathBeam_sprt.anchor.set(0.5, 0);
		lDeathBeam_sprt.scale.set(this._deathBeamScaleCoefficient);
		lDeathBeam_sprt.position.set(aPosition_obj.x, aPosition_obj.y);
		lDeathBeam_sprt.blendMode = PIXI.BLEND_MODES.SCREEN;
		lDeathBeam_sprt.rotation = aRotation_num;
		lDeathBeam_sprt.alpha = 0;

		let lDeathSplat_sprt = lDeathBeam_sprt.addChild(this._createDeathSplat());
		lDeathSplat_sprt.scale.set(6);
		lDeathSplat_sprt.fadeTo(0, 12*FRAME_RATE, null, (e) => {e.target.obj.destroy()});

		return lDeathBeam_sprt;
	}

	get _deathBeamScaleCoefficient()
	{
		return 2;
	}

	get _deathBeamTextureName()
	{
		return 'boss_mode/bm_boss_mode/death_beam';
	}

	_createDeathSplat()
	{
		let lDeathSplat_sprt = APP.library.getSpriteFromAtlas(this._deathSplatTextureName);
		lDeathSplat_sprt.anchor.set(0.5, 0.5);
		lDeathSplat_sprt.scale.set(2);
		lDeathSplat_sprt.blendMode = PIXI.BLEND_MODES.SCREEN;
		return lDeathSplat_sprt;
	}

	get _deathSplatTextureName()
	{
		return 'boss_mode/bm_boss_mode/death_splat';
	}

	_createDeathBullet()
	{
		let lDeathBullet_sprt = APP.library.getSpriteFromAtlas(this._deathBulletTextureName);
		lDeathBullet_sprt.anchor.set(0.5, 0);
		lDeathBullet_sprt.scale.set(2);
		lDeathBullet_sprt.blendMode = PIXI.BLEND_MODES.SCREEN;
		return lDeathBullet_sprt;
	}

	get _deathBulletTextureName()
	{
		return 'boss_mode/bm_boss_mode/death_bullet';
	}

	_onBossDeathAnimationCompleted()
	{
		this.emit(BossDeathFxAnimation.EVENT_ANIMATION_COMPLETED);

		this.destroy();
	}

	destroy()
	{
		this._fTimeout_t && this._fTimeout_t.destructor();
		this._fTimeout_t = null;

		this._fCrackTimer_t && this._fCrackTimer_t.destructor();
		this._fCrackTimer_t = null;

		this._fCoinsExplodeTimer_t && this._fCoinsExplodeTimer_t.destructor();
		this._fCoinsExplodeTimer_t = null;

		this._fCracksContainer_sprt && this._fCracksContainer_sprt.destroy();
		this._fCracksContainer_sprt = null;

		this._fDeathFxContainer_sprt && this._fDeathFxContainer_sprt.destroy()
		this._fDeathFxContainer_sprt = null;

		this._fCrackParts_arr_arr = null;

		this._fSpineTextureMiddlePoint_obj = null;
		this._fSpineTexturePixels_arr = null;

		this._fSpineTexture_tx && this._fSpineTexture_tx.destroy();
		this._fSpineTexture_tx = null;

		this._fSpineView_sprt && this._fSpineView_sprt.destroy();
		this._fSpineView_sprt = null;

		this._fFxContainer_sprt && this._fFxContainer_sprt.destroy();
		this._fFxContainer_sprt = null;

		super.destroy();
	}
}

export default BossDeathFxAnimation;