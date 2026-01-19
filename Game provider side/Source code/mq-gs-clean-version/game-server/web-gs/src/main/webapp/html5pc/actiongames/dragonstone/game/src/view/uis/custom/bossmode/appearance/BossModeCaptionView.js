import Sprite from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import Sequence from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import I18 from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
import { ENEMIES, FRAME_RATE } from '../../../../../../../shared/src/CommonConstants';
import { AtlasSprite } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import AtlasConfig from './../../../../../config/AtlasConfig';
import TextField from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/TextField';

const FLAME_SCALE = [
	{w: 0.76, h: 1.03},
	{w: 0.7,  h: 0.95},
	{w: 0.76, h: 1.02},
	{w: 0.76, h: 1.02},
	{w: 0.7,  h: 0.94},
	{w: 0.5,  h: 0.67},
	{w: 0.5,  h: 0.67},
	{w: 0.7,  h: 0.94},
	{w: 0.7,  h: 0.94}
]

const FLAME_SIZE = {
	width: 287,
	height: 312
}

export const DRAGON_CAPTION_TYPES = 
{
	SUMMONED_DRAGON: 1,
	KEEP_PLAYING: 2,
	DRAGON_DEFEATED: 3,
	WINS_DOUBLED: 4
}

class BossModeCaptionView extends Sprite
{
	static get EVENT_ON_ANIMATION_STARTED()		{return "onCaptionAnimationStarted";}
	static get EVENT_ON_DISAPPEAR_STARTED()		{return "onCaptionDisappearStarted";}
	static get EVENT_ON_ANIMATION_ENDED()		{return "onCaptionAnimationEnded";}
	static get EVENT_ON_END_SOUND()				{return "EVENT_ON_END_SOUND"}

	playAnimation()
	{
		this._playAnimation();
	}

	forceDisappear()
	{
		this._forceDisappear();
	}

	get captionType()
	{
		return this._fType_num;
	}

	//INIT...
	constructor(aType_num=DRAGON_CAPTION_TYPES.SUMMONED_DRAGON, aOptAddText_str=undefined)
	{
		super();

		this._fCaptionContainer_sprt = null;
		this._fCaption_ta = null;
		this._sweep = null;
		this._fIsDisappearStarted_bl = false;
		this._fIsForceDisappearRequired_bl = false;

		this._fType_num = aType_num;
		this._fOptAddText_str = aOptAddText_str;
	}

	//...INIT

	get _captionAsset()
	{
		switch (this._fType_num)
		{
			case DRAGON_CAPTION_TYPES.SUMMONED_DRAGON:
				return "TABossModeSummonedDragonLabel";
			case DRAGON_CAPTION_TYPES.KEEP_PLAYING:
				return "TABossModeKeepPlayingLabel";
			case DRAGON_CAPTION_TYPES.DRAGON_DEFEATED:
				return "TABossModeDefeatedDragonLabel";
			case DRAGON_CAPTION_TYPES.WINS_DOUBLED:
				const returnCaption = APP.isBattlegroundGame ? "TABossModeDoubledWinDragonLabel" : "TABossModePlayerDefeatsDragonLabel";
				return returnCaption;
		}

		return null;
	}

	get _captionShadowAsset()
	{
		switch (this._fType_num)
		{
			case DRAGON_CAPTION_TYPES.SUMMONED_DRAGON:
				return "TABossModeSummonedDragonLabelShadow";
			case DRAGON_CAPTION_TYPES.KEEP_PLAYING:
				return "TABossModeKeepPlayingLabelShadow";
			case DRAGON_CAPTION_TYPES.DRAGON_DEFEATED:
				return "TABossModeDefeatedDragonLabelShadow";
			case DRAGON_CAPTION_TYPES.WINS_DOUBLED:
				const returnCaption = APP.isBattlegroundGame ? "TABossModeDoubledWinDragonLabelShadow" : "TABossModePlayerDefeatsDragonLabelShadow";
				return returnCaption;
		}

		return null;
	}

	get _captionSweepPositionAsset()
	{
		switch (this._fType_num)
		{
			case DRAGON_CAPTION_TYPES.SUMMONED_DRAGON:
				return "TABossModeSummonedDragonLabelLightSweepPosition";
			case DRAGON_CAPTION_TYPES.KEEP_PLAYING:
				return "TABossModeKeepPlayingLabelLightSweepPosition";
			case DRAGON_CAPTION_TYPES.DRAGON_DEFEATED:
				return "TABossModeDefeatedDragonLabelLightSweepPosition";
			case DRAGON_CAPTION_TYPES.WINS_DOUBLED:
				return "TABossModeDoubledWinDragonLabelLightSweepPosition";
		}

		return null;
	}

	_playAnimation()
	{
		let lCaptionContainer_sprt = this._fCaptionContainer_sprt = this.addChild(new Sprite());

		let lCaptionShadow_ta = this._fCaptionContainer_sprt.addChild(I18.generateNewCTranslatableAsset(this._captionShadowAsset));
		lCaptionShadow_ta.alpha = 0.85;
		let lCaption_ta = this._fCaption_ta = this._fCaptionContainer_sprt.addChild(I18.generateNewCTranslatableAsset(this._captionAsset));
		lCaption_ta.alpha = 0;
		
		lCaptionContainer_sprt.scale.set(0.7);
		lCaptionContainer_sprt.alpha = 0;

		this._addAdditionalTextIfRequired();

		let lIsFastAppearRequired_bl = this._fType_num == DRAGON_CAPTION_TYPES.WINS_DOUBLED || this._fType_num == DRAGON_CAPTION_TYPES.DRAGON_DEFEATED;

		let lTextScale_seq = [
			{ tweens:[],														duration: 1*FRAME_RATE},
			{ tweens:[{prop:"scale.x", to: 0.85}, {prop:"scale.y", to: 0.85}],	duration: (lIsFastAppearRequired_bl ? 5*FRAME_RATE : 16*FRAME_RATE)},
			{ tweens:[{prop:"scale.x", to: 1.3}, {prop:"scale.y", to: 1.3}],	duration: (lIsFastAppearRequired_bl ? 4*FRAME_RATE : 13*FRAME_RATE)},
			{ tweens:[{prop:"scale.x", to: 1.0}, {prop:"scale.y", to: 1.0}],	duration: (lIsFastAppearRequired_bl ? 4*FRAME_RATE : 13*FRAME_RATE)},
			{ tweens:[],														duration: 17*FRAME_RATE, onfinish: () => {this._onLightSweepTime();} }
			
		];

		let lTextAlpha_seq = [
			{ tweens:[],							duration: 1*FRAME_RATE},
			{ tweens:[{prop:"alpha", to: 0.1}],		duration: (lIsFastAppearRequired_bl ? 5*FRAME_RATE : 16*FRAME_RATE), onfinish: () => { this._soundBossNotifacation(this._captionAsset)} },
			{ tweens:[{prop:"alpha", to: 1}],		duration: (lIsFastAppearRequired_bl ? 4*FRAME_RATE : 13*FRAME_RATE)},
			{ tweens:[],							duration: 30*FRAME_RATE}
		];

		let lColorTextAlpha_seq = [
			{ tweens:[],							duration: 1*FRAME_RATE},
			{ tweens:[{prop:"alpha", to: 0}],		duration: (lIsFastAppearRequired_bl ? 5*FRAME_RATE : 16*FRAME_RATE)},
			{ tweens:[{prop:"alpha", to: 1}],		duration: (lIsFastAppearRequired_bl ? 4*FRAME_RATE : 13*FRAME_RATE)},
		];
		
		Sequence.start(lCaptionContainer_sprt, lTextScale_seq);
		Sequence.start(lCaptionContainer_sprt, lTextAlpha_seq);
		Sequence.start(lCaption_ta, lColorTextAlpha_seq);

		this.emit(BossModeCaptionView.EVENT_ON_ANIMATION_STARTED);
	}

	_addAdditionalTextIfRequired()
	{
		if (this._fOptAddText_str === undefined)
		{
			return;
		}

		let lName_str = this._fOptAddText_str;
		let lFontFamily_str = "fnt_nm_the_wild_breath_of_zelda";
		if (!APP.fonts.isGlyphsSupported(lFontFamily_str, lName_str))
		{
			lFontFamily_str = "sans-serif";
		}

		let lStyle_obj = {
			fontFamily: lFontFamily_str,
			fontSize: 50,
			fill: 0x000000,
			align: "center",
			shortLength: this._maxNicknameWidth // to fit Screen
		};

		let l_tf = this._fCaptionContainer_sprt.addChild(new TextField(lStyle_obj));
		l_tf.maxWidth = 850;
		l_tf.anchor.set(0.5, 0.5);
		l_tf.position.set(0, -90);

		l_tf.text = lName_str;
	}

	get _maxNicknameWidth()
	{
		return 460; // to fit the screen, close to TABossModeDefeatedDragonLabel asset width
	}

	_soundBossNotifacation(aSoundName_str)
	{
		var lSoundName_str = null;
		if(aSoundName_str === "TABossModeSummonedDragonLabel")
		{
			lSoundName_str = "mq_dragonstone_boss_intro_notification";
		}
		else if (aSoundName_str === "TABossModeKeepPlayingLabel")
		{
			this.emit(BossModeCaptionView.EVENT_ON_END_SOUND);
			lSoundName_str = "mq_dragonstone_boss_outro_notification"
		}
		else
		{
			lSoundName_str = "mq_dragonstone_notification"
		}
		APP.soundsController.play(lSoundName_str);
	}

	get _profilingInfo()
	{
		return APP.profilingController.info;
	}

	_onLightSweepTime()
	{
		if (this._fIsForceDisappearRequired_bl)
		{
			this._startDisappear();
			return;
		}

		let lSweepPosAsset_ta = I18.getTranslatableAssetDescriptor(this._captionSweepPositionAsset);
		let lSweepValuePos_obj = lSweepPosAsset_ta.areaInnerContentDescriptor.areaDescriptor;

		let lSweep_sprt;
		if (this._profilingInfo.isVfxProfileValueMediumOrGreater)
		{
			lSweep_sprt = this._sweep = this._fCaptionContainer_sprt.addChild(APP.library.getSprite("critical_hit/light_sweep"));
			lSweep_sprt.x = lSweepValuePos_obj.x;
			lSweep_sprt.y = lSweepValuePos_obj.y;

			let lCaptionAssetContent = this._fCaption_ta.assetContent;
			let lCaptionMask = this._fCaptionContainer_sprt.addChild(lCaptionAssetContent.clone());
			lCaptionMask.scale.set(lCaptionAssetContent.scale.x, lCaptionAssetContent.scale.y);
			let lMaskPos = lCaptionAssetContent.parent.localToLocal(lCaptionAssetContent.x, lCaptionAssetContent.y, this._fCaptionContainer_sprt);
			lCaptionMask.position.set(lMaskPos.x, lMaskPos.y);
			lSweep_sprt.mask = lCaptionMask;
		}
		else
		{
			lSweep_sprt = this._sweep = this._fCaptionContainer_sprt.addChild(new Sprite);
		}

		let lSweepDuration_num = 90*FRAME_RATE;
		if (
				APP.isBattlegroundGame && 
				(this._fType_num == DRAGON_CAPTION_TYPES.DRAGON_DEFEATED || this._fType_num == DRAGON_CAPTION_TYPES.WINS_DOUBLED)
			)
		{
			lSweepDuration_num = 45*FRAME_RATE;
		}
		lSweep_sprt.moveTo(lSweep_sprt.x+lSweepValuePos_obj.width, lSweep_sprt.y, lSweepDuration_num, undefined, () => { this._onLightSweepAnimationCompleted(); } );
	}

	_onLightSweepAnimationCompleted()
	{
		this._startDisappear();
	}

	_startDisappear()
	{
		let lCaptionContainer_sprt = this._fCaptionContainer_sprt;
		lCaptionContainer_sprt.scaleTo(1.5, 7*FRAME_RATE);
		lCaptionContainer_sprt.fadeTo(0, 7*FRAME_RATE, undefined, () => {this._onCaptionAnimationCompleted()});

		this._fIsDisappearStarted_bl = true;

		this.emit(BossModeCaptionView.EVENT_ON_DISAPPEAR_STARTED);
	}

	_onCaptionAnimationCompleted()
	{
		this.emit(BossModeCaptionView.EVENT_ON_ANIMATION_ENDED);
	}

	_forceDisappear()
	{
		if (this._fIsDisappearStarted_bl)
		{
			return;
		}

		if (this._sweep)
		{
			this._startDisappear();
			return;
		}

		this._fIsForceDisappearRequired_bl = true;
	}

	destroy()
	{
		this._fCaptionContainer_sprt && Sequence.destroy(Sequence.findByTarget(this._fCaptionContainer_sprt));
		this._fCaption_ta && Sequence.destroy(Sequence.findByTarget(this._fCaption_ta));

		super.destroy();

		this._fCaptionContainer_sprt = null;
		this._fCaption_ta = null;
		this._sweep = null;
		this._fIsDisappearStarted_bl = undefined;
		this._fIsForceDisappearRequired_bl = undefined;
		this._fType_num = undefined;
	}
}

export default BossModeCaptionView;