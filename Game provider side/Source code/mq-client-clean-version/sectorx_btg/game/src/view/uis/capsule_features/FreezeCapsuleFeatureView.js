import SimpleUIView from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/SimpleUIView';
import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import * as Easing from '../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../shared/src/CommonConstants';
import { Utils } from "../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils";
import { AtlasSprite } from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import AtlasConfig from '../../../config/AtlasConfig';
import { PathTween } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import { GlowFilter, DropShadowFilter } from "../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Filters";

var freeze_spin_textures = null;
export function generate_freeze_spin_textures()
{
	if (!freeze_spin_textures)
	{
		freeze_spin_textures = AtlasSprite.getFrames([APP.library.getAsset("enemies/freeze_capsule/freeze_spin")], [AtlasConfig.FreezeSpin], "");
	}

	return freeze_spin_textures;
}

var ice_parts = null;
export function generate_ice_parts()
{
	if (!ice_parts)
	{
		ice_parts = AtlasSprite.getMapFrames([APP.library.getAsset("common/ice_parts")], [AtlasConfig.IceParts], "");
	}
	return ice_parts;
}

let freeze_cover_explode = null;
export function generate_freeze_cover_explosion_textures()
{
	if (!freeze_cover_explode)
	{
		freeze_cover_explode = AtlasSprite.getFrames([APP.library.getAsset("common/freeze_cover_explode")], [AtlasConfig.FreezeCoverExplode], "");
	}
	return freeze_cover_explode;
}

let ice_explode = null;
export function generate_enemy_ice_explosion_textures()
{
	if (!ice_explode)
	{
		ice_explode = AtlasSprite.getFrames([APP.library.getAsset("common/enemy_ice_explosion")], [AtlasConfig.EnemyIceExplosion], "");
	}
	return ice_explode;
}

let ice_melting_effect = null;
export function generate_ice_melting_effect()
{
	if (!ice_melting_effect)
	{
		ice_melting_effect = AtlasSprite.getFrames([APP.library.getAsset("enemies/freeze_capsule/freeze_feature_ice_melting")], [AtlasConfig.FreezeFeatureIceMeltingFx], "");
	}
	return ice_melting_effect;
}

let timer_atlas = null;
function get_timer_atlas()
{
	if (!timer_atlas)
	{
		timer_atlas = AtlasSprite.getMapFrames([APP.library.getAsset("enemies/freeze_capsule/freeze_timer")], [AtlasConfig.FreezeTimer], "");
	}
	return timer_atlas;
}

let blue_smokes = null;
function generate_blue_smokes()
{
	if (!blue_smokes)
	{
		blue_smokes = AtlasSprite.getFrames([APP.library.getAsset("enemies/freeze_capsule/blue_freeze_smokes")], [AtlasConfig.BlueFreezeSmokes], "");
	}
	return blue_smokes;
}


class FreezeCapsuleFeatureView extends SimpleUIView
{
	static get EVENT_ON_TIMER_APPEARED()					{ return "timerAppeared"; }
	static get CHANGE_FIELD_FREEZE_STATE()					{ return "onTimeToChangeFieldFreezeState"; }

	addToContainerIfRequired(aAwardingContainerInfo_obj)
	{
		this._addToContainerIfRequired(aAwardingContainerInfo_obj);
	}

	i_showFreezing(aStartPostion_obj, aOptSkipAnimation_bl, aIsBossSubround)
	{
		this._fIsBossSubround_bln = aIsBossSubround;
		if (!aStartPostion_obj || aOptSkipAnimation_bl)
		{
			this._showTimer(true);
		}
		else if (aStartPostion_obj && !aOptSkipAnimation_bl)
		{
			this._fExplosionPosition_obj = aStartPostion_obj;
			this._startAppearAnimation();
		}
	}

	i_startDisappearAnimation()
	{
		this._hideTimer();
		this._startDarkenFieldAnimation();
		this.emit(FreezeCapsuleFeatureView.CHANGE_FIELD_FREEZE_STATE, {frozen: false});
	}

	interrupt()
	{
		this._interrupt();
	}

	i_setTimerProgress(aOptValue_num=1)
	{
		if (!APP.isBattlegroundGame)
		{
			this._setTimerProgress(aOptValue_num);
		}
		else
		{
			this._setBattlegroundTimerProgress(aOptValue_num);
		}
	}

	i_updateTimerForBossHPBar(aDoesBossExist_bl)
	{
		if (!this._fTimerContainer_spr)
		{
			if (!APP.isBattlegroundGame)
			{
				this._initTimerContainer();
			}
			else
			{
				this._initBattlegroundTimerContainer();
			}
		}

		let lTimerContainerYPostion_num = APP.isBattlegroundGame ? 385 : 275;

		if (
			(aDoesBossExist_bl || this.isBossDeathAnimationInProgress)
			&& !APP.isMobile
			)
		{
			this._fTimerContainer_spr.moveTo(this._fFixPositionX_num - 40, lTimerContainerYPostion_num, 4*FRAME_RATE);
		}
		else
		{
			this._fTimerContainer_spr.moveTo(this._fFixPositionX_num, lTimerContainerYPostion_num, 4*FRAME_RATE);
		}
	}

	get killerFieldAnimationInfo()
	{
		return APP.gameScreen.gameFieldController.killerFieldAnimationInfo;
	}

	get isBossDeathAnimationInProgress()
	{
		return this._fIsBossDeathAnimationInProgress_bl;
	}

	set isBossDeathAnimationInProgress(aIsInProgress_bln)
	{
		this._fIsBossDeathAnimationInProgress_bl = aIsInProgress_bln;
	}

	constructor()
	{
		super();

		this._fTimerContainer_spr = null;
		this._fTimerProgressLine_spr = null;
		this._fProgressLineMask_g = null;
		this._fTimerArrow_spr = null;
		this._fFieldAnimationContainer_spr = null;
		this._fIcePartsExplosions_spr_arr = null;
		this._fBlackCover_spr = null;
		this._fBlastCircle_spr = null;
		this._fFreezeSpins_spr_arr = null;
		this._fBlueSmokes_spr = null;
		this._fFlare_spr = null;

		this._fBattlegroundProgressBarOverlap_g = null;
		this._fBattlegroundProgressBarCap_g = null;
		this._fBattlegroundProgressBar_sprt = null;

		this._fIsBossDeathAnimationInProgress_bl = false;
	}

	/**
	 * Calculating middle and final positions for better visibility on gameField.
	 * @param {Object} aPostion_obj
	 * @returns {Array[2]} [middlePoint, finalPoint]
	 */
	_calculatePositionsForPath(aPosition_obj)
	{
		let lAPPSize_obj = APP.config.size;

		let lFinalPosition_obj = {
			x: APP.config.size.width/2,
			y: APP.config.size.height/2,
		};

		let lMiddlePosition_obj = {
			x: aPosition_obj.x/2 + lFinalPosition_obj.x/2,
			y: aPosition_obj.y/2 + lFinalPosition_obj.y/2,
		};

		lMiddlePosition_obj.x += Utils.getRandomWiggledValue(aPosition_obj.x < lAPPSize_obj.width/2 ? 0 : -100, 100);
		lMiddlePosition_obj.y += Utils.getRandomWiggledValue(aPosition_obj.y < lAPPSize_obj.height/2 ? 0 : -100, 100);

		return [lMiddlePosition_obj, lFinalPosition_obj];
	}

	_addToContainerIfRequired(aAwardingContainerInfo_obj)
	{
		if (this.parent || !aAwardingContainerInfo_obj.container || aAwardingContainerInfo_obj.container.contains(this))
		{
			return;
		}

		aAwardingContainerInfo_obj.container.addChild(this);
		this.zIndex = aAwardingContainerInfo_obj.zIndex;
	}

	_initTimerContainer()
	{
		this._fTimerContainer_spr = this.addChild(new Sprite());

		let lTimerBackground_spr = this._fTimerContainer_spr.addChild(new Sprite.from(this._getTimerPart("back")));
		lTimerBackground_spr.anchor.set(0.5);
		lTimerBackground_spr.position.set(0, -13);

		this._fTimerProgressLine_spr = this._fTimerContainer_spr.addChild(new Sprite.from(this._getTimerPart("progress_line")));
		this._fTimerProgressLine_spr.anchor.set(0.5);
		this._fTimerProgressLine_spr.position.set(0, -15);
		this._fProgressLineMask_g = this._fTimerContainer_spr.addChild(new PIXI.Graphics());
		this._fProgressLineMask_g.position.set(0, 3);
		this._fTimerProgressLine_spr.mask = this._fProgressLineMask_g;

		let lTimerFrame_spr = this._fTimerContainer_spr.addChild(new Sprite.from(this._getTimerPart("frame")));
		lTimerFrame_spr.anchor.set(0.5);

		this._fTimerArrow_spr = this._fTimerContainer_spr.addChild(new Sprite.from(this._getTimerPart("arrow")));
		this._fTimerArrow_spr.position.set(0, 3);
		this._fTimerArrow_spr.anchor.set(0.5, 0.75);

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._fTimerArrow_spr.filters = [new DropShadowFilter({alpha: 0.7, distance: 4, blur: 0, resolution: 2, rotation: 90})];
		}

		let lPositionX_num = APP.isMobile ? lTimerFrame_spr.width/2 + 18 : APP.config.size.width - lTimerFrame_spr.width/2 - 18;
		this._fFixPositionX_num = lPositionX_num;

		this._fTimerContainer_spr.position.set(lPositionX_num, 275);
		this._fTimerContainer_spr.anchor.set(0.5, 0.5);
	}

	_initBattlegroundTimerContainer()
	{
		this._fTimerContainer_spr = this.addChild(new Sprite());

		// PROGRESS BAR...
		let lProgressBar_sprt = this._fBattlegroundProgressBar_sprt = this._fTimerContainer_spr.addChild(APP.library.getSprite("enemies/freeze_capsule/vertical_freeze_timer_progress_bar"));
		lProgressBar_sprt.anchor.set(0.5, 1);
		lProgressBar_sprt.position.set(-3, 83);
		lProgressBar_sprt.scale.x = 1.1;
		// ...PROGRESS BAR

		// PROGRESS BAR OVERLAP...
		let lProgressBarOverlapContainer_sprt = this._fTimerContainer_spr.addChild(new Sprite());
		lProgressBarOverlapContainer_sprt.anchor.set(0);
		lProgressBarOverlapContainer_sprt.position.y = 88;
		this._fBattlegroundProgressBarOverlap_g = lProgressBarOverlapContainer_sprt.addChild(new PIXI.Graphics());
		this._fBattlegroundProgressBarCap_g = lProgressBarOverlapContainer_sprt.addChild(new PIXI.Graphics());
		// ...PROGRESS BAR OVERLAP

		// FREEZE TIMER FRAME...
		let lFrame_sprt = this._fTimerContainer_spr.addChild(APP.library.getSprite("enemies/freeze_capsule/vertical_freeze_timer_frozen_frame"));
		lFrame_sprt.anchor.set(0.5);
		// ...FREEZE TIMER FRAME

		let lPositionX_num = APP.isMobile ? APP.config.size.width - lFrame_sprt.width/2 - 45 : APP.config.size.width - lFrame_sprt.width/2 - 18;
		this._fFixPositionX_num = lPositionX_num;

		this._fTimerContainer_spr.position.set(lPositionX_num, APP.isMobile ? 375 : 385);
		this._fTimerContainer_spr.anchor.set(0.5, 0.5);
		this._fTimerContainer_spr.scale.set(1, APP.isMobile ? 0.65 : 0.8);
	}

	_showTimer(aOptSkipAnimation_bl)
	{
		if (!this._fTimerContainer_spr)
		{
			if (!APP.isBattlegroundGame)
			{
				this._initTimerContainer();
			}
			else
			{
				this._initBattlegroundTimerContainer();
			}
		}

		if ((APP.gameScreen.gameFieldController.isBossEnemyExist || this._fIsBossSubround_bln || this.isBossDeathAnimationInProgress) && !APP.isMobile)
		{
			this._fTimerContainer_spr.position.x = this._fFixPositionX_num - 40;
		}
		else
		{
			this._fTimerContainer_spr.position.x = this._fFixPositionX_num;
		}

		if (APP.isBattlegroundGame)
		{
			this._setBattlegroundTimerProgress(1);
		}
		else
		{
			this._setTimerProgress(1);
		}

		if (!aOptSkipAnimation_bl)
		{
			this._fTimerContainer_spr.scale.set(0);

			let lScaleYVal_num = APP.isBattlegroundGame ? 0.8 : 1;

			if (APP.isMobile && APP.isBattlegroundGame)
			{
				lScaleYVal_num -= 0.15;
			}

			let l_seq = [
				{ tweens: [{prop: "scale.x", to: 1}, {prop: "scale.y", to: lScaleYVal_num}], duration: 10*FRAME_RATE, onfinish: this._onTimerAppeared.bind(this, true)}
			];
			Sequence.start(this._fTimerContainer_spr, l_seq, 3*FRAME_RATE);
		}
		else
		{
			this._onTimerAppeared(false);
		}
	}

	_hideTimer(aOptSkipAnimation_bl)
	{
		if (!this._fTimerContainer_spr)
		{
			return;
		}

		this._fProgressLineMask_g && this._fProgressLineMask_g.clear();

		if (!aOptSkipAnimation_bl)
		{
			let l_seq = [
				{ tweens: [{prop: "scale.x", to: 0}, {prop: "scale.y", to: 0}], duration: 10*FRAME_RATE, onfinish: this._onTimerDisappeared.bind(this)}
			];
			Sequence.start(this._fTimerContainer_spr, l_seq);
		}
		else
		{
			this._onTimerDisappeared();
		}
	}

	_getTimerPart(aPartName_str)
	{
		if (!aPartName_str)
		{
			throw new Error("Timer's part name must be defined!");
		}

		let l_map = get_timer_atlas();
		if (!l_map[aPartName_str])
		{
			throw new Error("There is no such part!");
		}

		return l_map[aPartName_str];
		
	}

	_startDarkenFieldAnimation()
	{
		this._fFieldAnimationContainer_spr = this.killerFieldAnimationInfo.container.addChild(new Sprite());
		this._fFieldAnimationContainer_spr.zIndex = this.killerFieldAnimationInfo.zIndex;

		this._fBlackCover_spr = this._fFieldAnimationContainer_spr.addChild(new PIXI.Graphics());
		this._fBlackCover_spr.beginFill(0x000000).drawRect(-10, 10, 970, 550).endFill();

		this._fBlackCover_spr.alpha = 0;
		
		let l_seq = [
			{ tweens: [{prop: "alpha", to: 0.4}], duration: 18*FRAME_RATE},
			{ 
				tweens: [{prop: "alpha", to: 0}], 
				duration: 10*FRAME_RATE,
				onfinish: ()=>{
					this._destroyDarkField();
				}
			},
		];

		Sequence.start(this._fBlackCover_spr, l_seq);
	}

	_startAppearAnimation()
	{
		this._startDarkenFieldAnimation();

		this._startSnowflakeAppearAnimation();
		this._startFreezeSpinExplosion();
	}

	_onTimerAppeared(aIsAnimated_bl)
	{
		this.emit(FreezeCapsuleFeatureView.EVENT_ON_TIMER_APPEARED);
		this.emit(FreezeCapsuleFeatureView.CHANGE_FIELD_FREEZE_STATE, {frozen: true, isLasthand: !aIsAnimated_bl});
		this._shiftTimerContainerIfNeeded();
	}

	_shiftTimerContainerIfNeeded()
	{
		if (
			!this._fIsBossDeathAnimationInProgress_bl
			&& !(APP.gameScreen.gameFieldController.isBossEnemyExist || this._fIsBossSubround_bln)
			&& this._fTimerContainer_spr.position.x !== this._fFixPositionX_num
			&& !APP.isMobile)
		{
			this.i_updateTimerForBossHPBar(false);
		}
	}
	
	_onTimerDisappeared()
	{
		this.emit();
	}

	_setTimerProgress(aOptValue_num=1)
	{
		if (!this._fTimerContainer_spr || !this._fTimerArrow_spr || !this._fProgressLineMask_g || aOptValue_num<0)
		{
			return;
		}

		let lArrrowRotation_num = -Math.PI*2/3 + aOptValue_num * Math.PI*4/3; // -PI*2/3 is Zero; PI*2/3 is Full;
		this._fTimerArrow_spr.rotation = lArrrowRotation_num;
		this._fProgressLineMask_g && this._fProgressLineMask_g.clear().lineStyle(30, 0xFF00FF, 2).arc(0, 0, 45, -Math.PI*7/6, -Math.PI/2+lArrrowRotation_num);
	}

	_setBattlegroundTimerProgress(aOptValue_num=1)
	{
		if (!this._fTimerContainer_spr || !this._fBattlegroundProgressBarOverlap_g || aOptValue_num < 0)
		{
			return;
		}

		let lProgressBar_sprt = this._fBattlegroundProgressBar_sprt;

		let lOverlapHeight_num = lProgressBar_sprt.height * (1 - aOptValue_num);

		let lOverlap_g = this._fBattlegroundProgressBarOverlap_g;
		lOverlap_g.clear();
		lOverlap_g.beginFill(0x000000).drawRect(-lProgressBar_sprt.width / 2, -lProgressBar_sprt.height, lProgressBar_sprt.width, lOverlapHeight_num).endFill();

		this._fBattlegroundProgressBarCap_g.clear();
		let lOverlapCap_g = this._fBattlegroundProgressBarCap_g;
		lOverlapCap_g.beginFill(0xffffff).drawRect(-lProgressBar_sprt.width / 2, -lProgressBar_sprt.height + lOverlapHeight_num, lProgressBar_sprt.width, 3).endFill();
		lOverlapCap_g.alpha = 0.4;
	}

	_startSnowflakeAppearAnimation()
	{
		this._fSnowflake_spr = this.addChild(APP.library.getSprite("enemies/freeze_capsule/snowflake"));
		this._fSnowflake_spr.scale.set(0);
		this._fSnowflake_spr.blendMode = PIXI.BLEND_MODES.ADD;
		this._fSnowflake_spr.position = this._fExplosionPosition_obj;
		
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._fSnowflake_spr.filters = [new GlowFilter({innerStrength: 0, outerStrength: 2, color: 0x52B0FF, distance: 13})];
			this._startIcePartsExplosionAnimation();
		}

		let [lMiddlePoint_obj, lFinalPosition_obj] = this._calculatePositionsForPath(this._fExplosionPosition_obj);

		let lScale_seq = [
			{tweens:[{prop: "scale.x", to: 1.5}, {prop: "scale.y", to: 1.5}], duration: 11*FRAME_RATE},
			{tweens:[], duration: 2*FRAME_RATE},
			{
				tweens:[{prop: "scale.x", to: 0}, {prop: "scale.y", to: 0}],
				duration: 11*FRAME_RATE,
				ease: Easing.sine.easeIn, 
				onfinish: ()=>{
					Sequence.destroy(Sequence.findByTarget(this._fSnowflake_spr));
					this._startAppearanceExplosion();
					this._startFreezeSpinExplosion(lFinalPosition_obj);
				}
			},
		];

		Sequence.start(this._fSnowflake_spr, lScale_seq);

		let lPositionTween_pt = new PathTween(this._fSnowflake_spr, [this._fExplosionPosition_obj, lMiddlePoint_obj, lFinalPosition_obj], true);
		lPositionTween_pt.start(24 * FRAME_RATE, Easing.sine.easeIn)
	}

	_startIcePartsExplosionAnimation()
	{
		if (!this._fIcePartsExplosions_spr_arr)
		{
			this._fIcePartsExplosions_spr_arr = [];
		}

		let lFirstExplosion_spr = this._fSnowflake_spr.addChild(new Sprite()); // one of the parts, the one used in enemy death animation
		lFirstExplosion_spr.textures = generate_enemy_ice_explosion_textures().slice().splice(5); //copy textures from 5 to the end
		lFirstExplosion_spr.rotation = Utils.getRandomWiggledValue(-Math.PI, Math.PI*2);
		lFirstExplosion_spr.animationSpeed = 0.5;
		lFirstExplosion_spr.scale.set(2);
		lFirstExplosion_spr.zIndex = -1;
		lFirstExplosion_spr.on('animationend', ()=>{
			lFirstExplosion_spr && lFirstExplosion_spr.destroy();
		});
		lFirstExplosion_spr.play();

		let lSnowflakeBounds_obj = this._fSnowflake_spr.getLocalBounds();

		for (let i=0; i < 5; i++)
		{
			let l_spr = this._fSnowflake_spr.addChild(new Sprite());
			let lRandomPartTextureId_num = Utils.random(1, 3);
			l_spr.textures = [generate_ice_parts()[`part_${lRandomPartTextureId_num}`]];
			l_spr.zIndex = -2;
			
			if (lRandomPartTextureId_num == 1)
			{
				l_spr.scale.set(0.3);
			}
			else
			{
				l_spr.scale.set(0.6);
			}

			let lPositionX_num = Utils.getRandomWiggledValue(-lSnowflakeBounds_obj.width/6, lSnowflakeBounds_obj.width/3);
			let lPositionY_num = Utils.getRandomWiggledValue(-lSnowflakeBounds_obj.height/6, lSnowflakeBounds_obj.height/3);
			l_spr.position.set(lPositionX_num, lPositionY_num);

			let l_seq = [
				{
					tweens:[{prop: "position.x", to: lPositionX_num*5}, {prop: "position.y", to: lPositionY_num*5}, {prop: "rotation", to: Utils.getRandomWiggledValue(-3, 6)}],
					duration: 10*FRAME_RATE
				},
				{
					
					tweens:[{prop: "alpha", to: 0}],
					duration: 5*FRAME_RATE
				}
			];

			this._fIcePartsExplosions_spr_arr.push(l_spr);
			Sequence.start(l_spr, l_seq);
		}
	}

	_startAppearanceExplosion()
	{
		this._showTimer();
		
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startBlastCircleAnimation();
		}

		this._startFlareAnimation();
		this._startSmokesAnimation();
	}

	_startFreezeSpinExplosion(aOptPosition_obj)
	{
		if (!aOptPosition_obj)
		{
			aOptPosition_obj = this._fExplosionPosition_obj;
		}

		if (!this._fFreezeSpins_spr_arr)
		{
			this._fFreezeSpins_spr_arr = [];
		}

		let lFreezeSpin_spr = this.addChild(new Sprite());
		lFreezeSpin_spr.textures = generate_freeze_spin_textures();
		lFreezeSpin_spr.position = aOptPosition_obj;
		lFreezeSpin_spr.scale.set(0);
		lFreezeSpin_spr.animationSpeed = 0.3;
		lFreezeSpin_spr.blendMode = PIXI.BLEND_MODES.ADD;

		this._fFreezeSpins_spr_arr.push(lFreezeSpin_spr);

		let l_seq = [
			{
				tweens: [{prop: "scale.x", to: 9}, {prop: "scale.y", to: 7}],
				duration: 14*FRAME_RATE,
			},
			{
				tweens: [{prop: "scale.x", to: 18}, {prop: "scale.y", to: 14}, {prop: "alpha", to: 0}],
				duration: 5*FRAME_RATE,
				onfinish: ()=>{
					this._fFreezeSpins_spr_arr && this._fFreezeSpins_spr_arr.splice(this._fFreezeSpins_spr_arr.indexOf(lFreezeSpin_spr, 1));
					lFreezeSpin_spr && lFreezeSpin_spr.destroy();
					lFreezeSpin_spr = null;
				}
			},
		];

		lFreezeSpin_spr.play();
		Sequence.start(lFreezeSpin_spr, l_seq);
	}

	_startSmokesAnimation()
	{
		this._fBlueSmokes_spr = this.addChild(new Sprite());
		this._fBlueSmokes_spr.textures = generate_blue_smokes();
		this._fBlueSmokes_spr.position.set(APP.config.size.width/2, APP.config.size.height/2);
		this._fBlueSmokes_spr.scale.set(2);
		this._fBlueSmokes_spr.anchor.set(0.5, 0.4);
		this._fBlueSmokes_spr.animationSpeed = 0.3;
		this._fBlueSmokes_spr.blendMode = PIXI.BLEND_MODES.ADD;

		this._fBlueSmokes_spr.on('animationend', ()=>{
			this._fBlueSmokes_spr && this._fBlueSmokes_spr.destroy();
		});

		this._fBlueSmokes_spr.play();
	}

	_startBlastCircleAnimation()
	{
		this._fBlastCircle_spr = this.addChild(APP.library.getSprite("awards/circle_blast"));
		this._fBlastCircle_spr.blendMode = PIXI.BLEND_MODES.SCREEN;
		this._fBlastCircle_spr.position.set(APP.config.size.width/2, APP.config.size.height/2);
		this._fBlastCircle_spr.scale.set(0);
		this._fBlastCircle_spr.zIndex = -2;

		let lCircleScale_seq = [
			{
				tweens: [{prop: "scale.x", to: 5}, {prop: "scale.y", to: 5}],
				duration: 8*FRAME_RATE
			},
			{
				tweens: [{prop: "scale.x", to: 7}, {prop: "scale.y", to: 7}, {prop: "alpha", to: 0}],
				duration: 3*FRAME_RATE,
				onfinish: ()=>{
					this._fBlastCircle_spr && Sequence.destroy(Sequence.findByTarget(this._fBlastCircle_spr));
					this._fBlastCircle_spr && this._fBlastCircle_spr.destroy();
					this._fBlastCircle_spr = null;
				},
			},
		];

		Sequence.start(this._fBlastCircle_spr, lCircleScale_seq);
	}

	_startFlareAnimation()
	{
		this._fFlare_spr = this.addChild(APP.library.getSpriteFromAtlas("common/blue_flare"));
		this._fFlare_spr.scale.set(0);
		this._fFlare_spr.blendMode = PIXI.BLEND_MODES.ADD;
		this._fFlare_spr.position.set(APP.config.size.width/2, APP.config.size.height/2);
		
		let lFlareScale_seq = [
			{
				tweens: [{prop: "scale.x", from: 0, to: 8}, {prop: "scale.y", from: 0, to: 4}],
				duration: 3*FRAME_RATE
			},
			{
				tweens: [{prop: "scale.x", to: 5}, {prop: "scale.y", to: 5}],
				duration: 6*FRAME_RATE
			},
			{
				tweens: [{prop: "scale.x", to: 0}, {prop: "scale.y", to: 0}],
				duration: 2*FRAME_RATE
			},
		];

		Sequence.start(this._fFlare_spr, lFlareScale_seq);
	}

	_destroyDarkField()
	{
		this._fBlackCover_spr && Sequence.destroy(Sequence.findByTarget(this._fBlackCover_spr));
		this._fBlackCover_spr && this._fBlackCover_spr.destroy();
		this._fBlackCover_spr = null;

		if (!this._fBlackCover_spr && APP.gameScreen.gameFieldController.killerFieldAnimationInfo.container)
		{
			APP.gameScreen.gameFieldController.killerFieldAnimationInfo.container.removeChild(this._fFieldAnimationContainer_spr);
			this._fFieldAnimationContainer_spr && this._fFieldAnimationContainer_spr.destroy();
			this._fFieldAnimationContainer_spr = null;
		}
	}

	_interrupt()
	{
		this._destroyDarkField();

		if (Array.isArray(this._fFreezeSpins_spr_arr))
		{
			for (let lFreezeSpin_spr of this._fFreezeSpins_spr_arr)
			{
				lFreezeSpin_spr && Sequence.destroy(Sequence.findByTarget(lFreezeSpin_spr));
				lFreezeSpin_spr && lFreezeSpin_spr.destroy();
				lFreezeSpin_spr = null;
			}
		}

		if (this._fIcePartsExplosions_spr_arr && Array.isArray(this._fIcePartsExplosions_spr_arr))
		{
			for (let lIceExplosion_spr of this._fIcePartsExplosions_spr_arr)
			{
				lIceExplosion_spr && Sequence.destroy(Sequence.findByTarget(lIceExplosion_spr));
				lIceExplosion_spr && lIceExplosion_spr.destroy();
				lIceExplosion_spr = null;
			}
		}
		this._fIcePartsExplosions_spr_arr = null;

		this._fFreezeSpins_spr_arr = null;

		this._fFlare_spr && Sequence.destroy(Sequence.findByTarget(this._fFlare_spr));
		this._fFlare_spr && this._fFlare_spr.destroy();
		this._fFlare_spr = null;

		this._fBlueSmokes_spr && this._fBlueSmokes_spr.destroy();
		this._fBlueSmokes_spr = null;

		this._fSnowflake_spr && PathTween.destroy(PathTween.findByTarget(this._fSnowflake_spr));
		this._fSnowflake_spr && Sequence.destroy(Sequence.findByTarget(this._fSnowflake_spr));
		this._fSnowflake_spr && this._fSnowflake_spr.destroy();
		this._fSnowflake_spr = null;

		this._fProgressLineMask_g && this._fProgressLineMask_g.destroy();
		this._fProgressLineMask_g = null;

		this._fTimerProgressLine_spr && this._fTimerProgressLine_spr.destroy();
		this._fTimerProgressLine_spr = null;

		this._fTimerArrow_spr && this._fTimerArrow_spr.destroy();
		this._fTimerArrow_spr = null;

		this._fTimerContainer_spr && Sequence.destroy(Sequence.findByTarget(this._fTimerContainer_spr));
		this._fTimerContainer_spr && this._fTimerContainer_spr.destroy();
		this._fTimerContainer_spr = null;
	}

	destroy()
	{
		this._interrupt();

		super.destroy();
	}
}

export default FreezeCapsuleFeatureView;