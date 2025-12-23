import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../../shared/src/CommonConstants';
import SimpleUIView from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/SimpleUIView';
import Sprite from './../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { AtlasSprite } from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import AtlasConfig from '../../../../config/AtlasConfig';
import * as Easing from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import Sequence from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { ColorOverlayFilter } from "../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Filters";

let hp_bars_textures;
function generate_hp_bars_textures()
{
	if (!hp_bars_textures)
	{
		hp_bars_textures = AtlasSprite.getMapFrames([APP.library.getAsset("boss_mode/hp_bars")], [AtlasConfig.BossesHpBars], "");
	}
	return hp_bars_textures;
}

class BossModeHPBarView extends SimpleUIView
{
	update()
	{
		this._updateBar();
	}

	showHPBar(aSkipAnimation_bl)
	{
		this._showHPBar(aSkipAnimation_bl);
	}

	hideHPBar(aSkipAnimation_bl)
	{
		this._hideHPBar(aSkipAnimation_bl);
	}

	setDefaultPosition()
	{
		this._setDefaultPosition();
	}

	i_moveBarForFreezeTimer(aIsFrozen_bl)
	{
		this._moveBarForFreezeTimer(aIsFrozen_bl);
	}

	//INIT...
	constructor()
	{
		super();

		this._fBarContainer_sprt = null;
		this._fProgressBar_sprt = null;
		this._fFrame_sprt = null;
		this.visible = false;
		this._fRedAnimationStarted_bl = null;
		this._fColorRedOverlay_s = null;
		this._fRedHitHighlightFilter = null;
		this._isShowHPBarAnimation_bl = false;

		this._fBattlegroundProgressBarVarticalOffset_num = 50;
		this._fBattlegroundProgressBarYScale_num = 1.3;
	}

	__init()
	{
		super.__init();

		this._initBarContainer();
	}

	_setDefaultPosition()
	{
		this.position.set(960/2+444, 540/2);
	}

	_initBarContainer()
	{
		this._fBarContainer_sprt = this.addChild(new Sprite());

		if (APP.isBattlegroundGame)
		{
			this._fBarContainer_sprt.position.set(APP.isMobile ? 10 : 13, APP.isMobile ? 120 : 140);
		}
		else
		{
			this._fBarContainer_sprt.position.set(APP.isMobile ? - 20 : -35, -5);
		}
	}

	_createBarView()
	{
		let lFrameName_str = "#name#Frame".replace("#name#", this.uiInfo.name);
		let lBar_str = "#name#Bar".replace("#name#", this.uiInfo.name);
		let lHpBarsTextures_t_map = generate_hp_bars_textures();
		
		let lBarTexture_t = lHpBarsTextures_t_map[lBar_str];
		this._fProgressBar_sprt = this._fBarContainer_sprt.addChild(Sprite.from(lBarTexture_t));
		this._fProgreesBarMask_g = this._fBarContainer_sprt.addChild(new PIXI.Graphics());
		this._fProgreesBarMask_g.beginFill(0x000000).drawRect(-lBarTexture_t.width, -lBarTexture_t.height, lBarTexture_t.width*2, lBarTexture_t.height*2).endFill();
		let lProgressBarXScale_num = 2;
		let lProgressBarYScale_num = APP.isBattlegroundGame ? this._fBattlegroundProgressBarYScale_num : 2;
		this._fProgressBar_sprt.scale.set(lProgressBarXScale_num, lProgressBarYScale_num);

		let lProgressBarVerticalGap_num = APP.isBattlegroundGame ? this._fBattlegroundProgressBarVarticalOffset_num : 0;
		this._fProgressBar_sprt.position.set(-lBarTexture_t.width, -lBarTexture_t.height + lProgressBarVerticalGap_num);
		this._fProgressBar_sprt.mask = this._fProgreesBarMask_g;

		this._fFrame_sprt = this._fBarContainer_sprt.addChild(Sprite.from(lHpBarsTextures_t_map[lFrameName_str]));
		this._fFrame_sprt.anchor.set(0.5, 0.5);
		this._fFrame_sprt.scale.set(1, APP.isBattlegroundGame ? 0.65 : 0.97);
	}

	_showHPBar(aSkipAnimation_bl = false)
	{
		if (!this._fFrame_sprt || !this._fProgressBar_sprt)
		{
			this._createBarView();
		}

		if (aSkipAnimation_bl)
		{
			this._resetRedAnimation();
		}

		if (this.visible)
		{
			this._onBarHidden();
			this._updateBar();
			aSkipAnimation_bl = true;
		}

		this.visible = true;
		this.removeTweens();
		this._setDefaultPosition();
		this._checkRedAnimation();

		if ( APP.currentWindow.freezeCapsuleFeatureController.info.freezeTime > 500)
		{
			if (!APP.isBattlegroundGame && !APP.isMobile)
			{
				this.position.x += 40;	
			}
		}

		if (!aSkipAnimation_bl)
		{
			this._isShowHPBarAnimation_bl = true;
			this.position.x += 100;
			this.moveTo(this.defaultPosition.x, this.defaultPosition.y, 31 * FRAME_RATE, undefined, () => {this._isShowHPBarAnimation_bl = false});
		}
	}

	_hideHPBar(aSkipAnimation_bl = false)
	{
		this._fRedAnimationStarted_bl = false;
		Sequence.destroy(Sequence.findByTarget(this.colorRedOverlayFilter));

		if (aSkipAnimation_bl)
		{
			this._onBarHidden();
			return;
		}

		this.moveTo(this.defaultPosition.x + 100, this.defaultPosition.y, 31 * FRAME_RATE, undefined, this._onBarHidden.bind(this));
	}

	_onBarHidden()
	{
		this.removeTweens();
		this.visible = false;
		this._fFrame_sprt && this._fFrame_sprt.destroy();
		this._fFrame_sprt = null;
		this._fProgressBar_sprt && this._fProgressBar_sprt.destroy();
		this._fProgressBar_sprt = null;
	}

	_updateBar()
	{
		if (!this._fFrame_sprt || !this._fProgressBar_sprt || !this._fProgreesBarMask_g)
		{
			this._createBarView();
		}

		this._checkRedAnimation();

		let lProgressBarScaleMultiplyer_num = APP.isBattlegroundGame ? this._fBattlegroundProgressBarYScale_num : 2;
		let lProgressBarMaskVerticalGap_num = APP.isBattlegroundGame ? this._fBattlegroundProgressBarVarticalOffset_num : 0;

		this._fProgreesBarMask_g.position.set(0, lProgressBarScaleMultiplyer_num * this._fProgressBar_sprt.texture.height * (1-this.uiInfo.progressHealth) + lProgressBarMaskVerticalGap_num);
	}

	_checkRedAnimation()
	{
		if (this.visible && !this._fRedAnimationStarted_bl && this.uiInfo.progressHealth != null && this.uiInfo.progressHealth <= this.uiInfo.rageHealthProgressValue)
		{
			this._fRedAnimationStarted_bl = true;
			this._fFrame_sprt.filters = [this.colorRedOverlayFilter];
	
			this._fFilterRedAlpha_seq = [
				{tweens: [], duration: 3 * FRAME_RATE},
				{tweens: [{prop: 'uniforms.alpha', to: 0.5}], ease: Easing.sine.easeIn, duration: 16 * FRAME_RATE},
				{tweens: [{prop: 'uniforms.alpha', to: 0}], ease: Easing.quadratic.easeOut, duration: 16 * FRAME_RATE,
					
					onfinish: ()=>{
						this._playRedAnimation();
					}
				}];
	
			this._playRedAnimation();
		}
	}

	_playRedAnimation()
	{
		if (this.visible)
		{
			Sequence.start(this.colorRedOverlayFilter, this._fFilterRedAlpha_seq);
		}
	}

	_resetRedAnimation()
	{
		Sequence.destroy(Sequence.findByTarget(this.colorRedOverlayFilter));
		this._fRedAnimationStarted_bl = false;
		this.colorRedOverlayFilter.uniforms.alpha = 0;
	}

	get colorRedOverlayFilter()
	{
		if (!this._fRedHitHighlightFilter)
		{
			this._fRedHitHighlightFilter = new ColorOverlayFilter(0xFF0000, 0);
		}
		return this._fRedHitHighlightFilter;
	}

	get defaultPosition()
	{
		return {x: 960/2+444, y:540/2}
	}

	_moveBarForFreezeTimer(aIsFrozen_bl)
	{
		let lGameField = APP.currentWindow.gameFieldController;
		let lEnemy_e = lGameField.getExistEnemy(this.uiInfo.id);

		if (this.visible && !this._isShowHPBarAnimation_bl && lEnemy_e)
		{
			let lPositionX_num = aIsFrozen_bl ? this.defaultPosition.x + 40 : this.defaultPosition.x 
			this.moveTo(lPositionX_num, this.defaultPosition.y, 15 * FRAME_RATE, undefined, undefined, undefined, undefined, 25*FRAME_RATE);
		}
	}

	destroy()
	{
		super.destroy();

		Sequence.destroy(Sequence.findByTarget(this.colorRedOverlayFilter));
		this._fRedAnimationStarted_bl = null;
		this._fColorRedOverlay_s = null;
		this._fRedHitHighlightFilter = null;

		this._fBarContainer_sprt = null;

		this._fProgressBar_sprt && this._fProgressBar_sprt.destroy();
		this._fProgressBar_sprt = null;

		this._fFrame_sprt && this._fFrame_sprt.destroy();
		this._fFrame_sprt = null;

	}
}

export default BossModeHPBarView;