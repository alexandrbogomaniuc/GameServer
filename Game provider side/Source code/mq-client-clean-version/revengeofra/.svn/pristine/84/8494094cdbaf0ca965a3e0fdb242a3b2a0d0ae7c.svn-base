import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { ENEMIES, FRAME_RATE } from '../../../../../../../shared/src/CommonConstants';
import Timer from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import AppearanceFogMagicCircleView from './magic_circle/AppearanceFogMagicCircleView';
import Sequence from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import Sprite from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import AppearanceMarkerSmokeView from './magic_circle/AppearanceMarkerSmokeView';
import { Utils } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import * as Easing from '../../../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import AppearanceView from './AppearanceView';

const SEREN_FOG_PARAMETERS = [
	{	x: -43,	y: 80,	scaleX: 3.77,	scaleY: 2.48,
		sequences: [
						[	{tweens: [{prop: "alpha", to: 0.9}],	duration: 35*FRAME_RATE},
							{tweens: [],							duration: 52*FRAME_RATE},
							{tweens: [{prop: "alpha", to: 0}],		duration: 36*FRAME_RATE}	],
						[	{tweens: [{prop: "scale.x", to: 6.17}, {prop: "position.x", to: 130}, {prop: "position.y", to: 92}],	duration: 123*FRAME_RATE}	]
					]
	},
	{	x: 56,	y: 77,	scaleX: -5.16,	scaleY: 1.86,
		sequences: [
						[	{tweens: [{prop: "alpha", to: 0.9}],	duration: 35*FRAME_RATE},
							{tweens: [],							duration: 52*FRAME_RATE},
							{tweens: [{prop: "alpha", to: 0}],		duration: 36*FRAME_RATE}	],
						[	{tweens: [{prop: "position.x", to: -152}, {prop: "position.y", to: 94}],	duration: 123*FRAME_RATE}	]
					]
	},
	{	x: -117,	y: -2,	scaleX: 3.73,	scaleY: 2.48,
		sequences: [
						[	{tweens: [{prop: "alpha", to: 0.9}],	duration: 35*FRAME_RATE},
							{tweens: [],							duration: 52*FRAME_RATE},
							{tweens: [{prop: "alpha", to: 0}],		duration: 36*FRAME_RATE}	],
						[	{tweens: [{prop: "scale.x", to: 4.75}, {prop: "position.x", to: 130}, {prop: "position.y", to: -8}],	duration: 123*FRAME_RATE}	]
					]
	},
	{	x: -25,	y: 27,	scaleX: 1.93,	scaleY: 1.29,
		sequences: [
						[	{tweens: [{prop: "alpha", to: 1}],		duration: 35*FRAME_RATE},
							{tweens: [],							duration: 52*FRAME_RATE},
							{tweens: [{prop: "alpha", to: 0}],		duration: 36*FRAME_RATE}	],
						[	{tweens: [{prop: "scale.x", to: 2.03}, {prop: "scale.y", to: 1.58}, {prop: "position.y", to: -68}],	duration: 123*FRAME_RATE}	]
					]
	},
	{	x: -25,	y: 27,	scaleX: 1.93,	scaleY: 1.29,
		sequences: [
						[	{tweens: [],							duration: 95*FRAME_RATE},
							{tweens: [{prop: "alpha", to: 1}],		duration: 35*FRAME_RATE},
							{tweens: [],							duration: 52*FRAME_RATE},
							{tweens: [{prop: "alpha", to: 0}],		duration: 36*FRAME_RATE}	],
						[	{tweens: [],																						duration: 95*FRAME_RATE},
							{tweens: [{prop: "scale.x", to: 2.03}, {prop: "scale.y", to: 1.58}, {prop: "position.y", to: -68}],	duration: 123*FRAME_RATE}	]
					]
	}
];

class AppearanceViewFog extends AppearanceView
{
	constructor() 
	{
		super();

		this._fSerenFogContainer_sprt = null;
		this._fSerenFogs_arr = null;
		this._fHeadSmokeContainer_sprt = null;
		this._fHeadSmokes_arr = null;
	}

	//INIT...
	_initAppearing()
	{
		super._initAppearing();

		this._fHeadSmokeContainer_sprt = this.addChild(new Sprite());
		this._initHeadSmokeAnimation();

		this._fSerenFogContainer_sprt = this.addChild(new Sprite());
		this._initSerenFogView();
	}

	_initHeadSmokeAnimation()
	{
		let lSmokesConfig_arr = [
			{x: 55,		y: -89},
			{x: 30,		y: -141},
			{x: 0,		y: -112},
			{x: -30,	y: -150},
			{x: -55,	y: -102}
		];

		this._fHeadSmokes_arr = [];
		for (let i = 0; i < lSmokesConfig_arr.length; ++i)
		{
			let lHeadSmoke_sprt = this._fHeadSmokeContainer_sprt.addChild(new AppearanceMarkerSmokeView('boss_mode/marker_smoke_blue'));
			lHeadSmoke_sprt.position.set(lSmokesConfig_arr[i].x, lSmokesConfig_arr[i].y);
			this._fHeadSmokes_arr.push(lHeadSmoke_sprt);
		}
	}

	_initSerenFogView()
	{
		this._fSerenFogs_arr = [];

		for (let lParam of SEREN_FOG_PARAMETERS)
		{
			let lFog_sprt = this._fSerenFogContainer_sprt.addChild(APP.library.getSprite("blend/smoke"));
			lFog_sprt.position.set(lParam.x, lParam.y);
			lFog_sprt.scale.x = lParam.scaleX;
			lFog_sprt.scale.y = lParam.scaleY;
			lFog_sprt.alpha = 0;
			lFog_sprt.blendMode = PIXI.BLEND_MODES.SCREEN;
			this._fSerenFogs_arr.push(lFog_sprt);
		}
	}

	_initSealView()
	{
		super._initSealView();

		this._fSealContainer_sprt.position.set(10, 60);
	}

	_initSmokeView()
	{
		super._initSmokeView();

		this._fCenterSmoke_sprt.position.set(220, -206);
	}

	_initMagicCircleView()
	{
		super._initMagicCircleView();

		this._fMagicCircleView_bmamcv.position.set(20, 60);
	}

	get _captionPosition()
	{
		return { x:0, y:0 };
	}

	get _appearanceMagicCircleViewInstance()
	{
		return new AppearanceFogMagicCircleView();
	}

	get _bossType()
	{
		return ENEMIES.Osiris;
	}
	//...INIT

	//ANIMATION...
	_playAppearingAnimation()
	{
		super._playAppearingAnimation();

		this._playSerenFogAnimation();
		this._playHeadSmokeAnimation();

		this._fHideTintTimer_t = new Timer(this._onHideTintTimer.bind(this), 213*FRAME_RATE);
	}

	get _appearingCulminationTime()
	{
		return 42*FRAME_RATE;
	}

	_playSerenFogAnimation()
	{
		let lParams = SEREN_FOG_PARAMETERS;

		for (let i = 0; i < this._fSerenFogs_arr.length; ++i)
		{
			let lFog_sprt = this._fSerenFogs_arr[i];
			for (let lSeq of lParams[i].sequences)
			{
				Sequence.start(lFog_sprt, lSeq);
			}
		}
	}

	_playHeadSmokeAnimation()
	{
		for (let i = 0; i < this._fHeadSmokes_arr.length; i++)
		{
			let lHeadSmoke_bmamsv = this._fHeadSmokes_arr[i];
			lHeadSmoke_bmamsv.play(61*FRAME_RATE, 70*2*FRAME_RATE, 1*FRAME_RATE);
		}
	}

	_onAppearingIntroTime()
	{
		super._onAppearingIntroTime();

		this.emit(AppearanceView.EVENT_APPEARING_PRESENTATION_STARTED, {duration: 29*FRAME_RATE, noTint: false});
	}

	get _bossAppearanceSequences()
	{
		return [[{ tweens:[{prop:"y", to:0}, {prop:"rotation", to:Utils.gradToRad(0)}],	duration:82*FRAME_RATE,	ease:Easing.sine.easeInOut }]];
	}

	get _bossAppearanceInit()
	{
		return {x: 0, y: 220, rotation: Utils.gradToRad(5.8)};
	}

	_startSealAnimation()
	{
		super._startSealAnimation();

		let lShadowSealSeq_arr = [
			{ tweens:[{prop:"alpha", from:1, to:0}, {prop:"y", to:-48}], duration:34*FRAME_RATE },
		];

		Sequence.start(this._fSealShadow_sprt, lShadowSealSeq_arr, 205*FRAME_RATE);
	}

	_onAppearingCulminated()
	{
		super._onAppearingCulminated();

		this.emit(AppearanceView.EVENT_APPEARING_PRESENTATION_CULMINATED, {duration: 33*FRAME_RATE, noTint: true});
	}

	_onAppearingCompletionTime()
	{
		super._onAppearingCompletionTime();

		this.emit(AppearanceView.EVENT_APPEARING_PRESENTATION_COMPLETION, {duration: 14*FRAME_RATE, hideTint: false});
	}

	_onHideTintTimer()
	{
		this.emit(AppearanceView.EVENT_HIDE_TINTED_VIEW, {duration: 49*FRAME_RATE, hideTint: true})
	}

	_onTimeToStartCaptionAnimation()
	{
		this.emit(AppearanceView.EVENT_ON_TIME_TO_START_CAPTION_ANIMATION, {captionPosition: this._captionPosition, 
																			startDelay: 68*FRAME_RATE, 
																			finishDelay: 111*FRAME_RATE});
	}
	//...ANIMATION

	_destroyAnimation()
	{
		super._destroyAnimation();

		if (this._fSerenFogs_arr)
		{
			for (let i = 0; i < this._fSerenFogs_arr.length; ++i)
			{
				Sequence.destroy(Sequence.findByTarget(this._fSerenFogs_arr[i]));
			}
		}
	}

	destroy()
	{
		super.destroy();

		this._fSerenFogContainer_sprt = null;
		this._fSerenFogs_arr = null;
		this._fHeadSmokeContainer_sprt = null;
		this._fHeadSmokes_arr = null;
	}
}

export default AppearanceViewFog;