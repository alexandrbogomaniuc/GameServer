import SpineEnemy from "./SpineEnemy";
import BonusWinCapsuleFxAnimation from "../animation/death/BonusWinCapsuleFxAnimation";
import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import GameFieldController, { Z_INDEXES } from '../../controller/uis/game_field/GameFieldController';

class Capsule extends SpineEnemy
{
	__tryToFinishDeathFxAnimation()
	{
		if (!this.__fBonusWin_bwcfa || !this.__fBonusWin_bwcfa.isAnimationProgress)
		{
			this.onDeathFxAnimationCompleted();
		}
	}

	__onBonusAnimationCompleted()
	{
		this.__fBonusWin_bwcfa && this.__fBonusWin_bwcfa.destroy();
		this.onDeathFxAnimationCompleted()
	}

	_initView()
	{
		super._initView();
		this.__fBonusWin_bwcfa = APP.currentWindow.gameFieldController.screenField.addChild(new BonusWinCapsuleFxAnimation());
		this.__fBonusWin_bwcfa.on(BonusWinCapsuleFxAnimation.EVENT_ANIMATION_COMPLETED, this.__onBonusAnimationCompleted, this);
		this.__fBonusWin_bwcfa.zIndex = Z_INDEXES.PLAYER_REWARD;
		APP.currentWindow.gameFieldController.on(GameFieldController.EVENT_ON_SHOW_BONUS_CAPSULE_WIN, this._onShowBonus, this);
	}

	_onShowBonus(data)
	{
		if(!this.__fBonusWin_bwcfa.isAnimationProgress && this.id == data.enemyId)
		{
			let lWinPos_obj = APP.gameScreen.enemiesController._getEnemyPosition(this)
			let lLeftMostBorderX_num = 100;
			let lRightMostBorderX_num = 860;
			let lTopMostBorderY_num = 100;
			let lBottomMostBorderY_num = 470;

			if(lWinPos_obj.x < lLeftMostBorderX_num)
			{
				lWinPos_obj.x = lLeftMostBorderX_num;
			}
			else if(lWinPos_obj.x > lRightMostBorderX_num)
			{
				lWinPos_obj.x = lRightMostBorderX_num;
			}

			if(lWinPos_obj.y < lTopMostBorderY_num)
			{
				lWinPos_obj.y = lTopMostBorderY_num;
			}
			else if(lWinPos_obj.y > lBottomMostBorderY_num)
			{
				lWinPos_obj.y = lBottomMostBorderY_num;
			}
			this.__fBonusWin_bwcfa.position.set(lWinPos_obj.x, lWinPos_obj.y);
			this.__fBonusWin_bwcfa.playAnimation();
		}
	}

	get _isSupportRotateInMotion()
	{
		return false;
	}

	//override
	get _isSupportDirectionChange()
	{
		return false;
	}

	//override
	get isCritter()
	{
		return true;
	}

	//override
	_calculateAnimationLoop()
	{
		let animationLoop = true;

		return animationLoop;
	}

	// override
	getSpineSpeed()
	{
		let lSpeed_num = 1;
		return lSpeed_num
	}

	//override
	_calculateAnimationName()
	{
		let animationName = this.getWalkAnimationName();
		return animationName;
	}

	// override
	_calculateSpineSpriteNameSuffix()
	{
		return '';
	}

	//override
	changeShadowPosition()
	{
		let x = 0, y = 15;
		this.shadow.position.set(x, y);
	}

	//override
	_getHitRectHeight()
	{
		return 150;
	}

	//override
	_getHitRectWidth()
	{
		return 150;
	}

	//override
	getLocalCenterOffset()
	{
		let pos = { x: 0, y: -45 };
		return pos;
	}

	destroy(purely = false)
	{
		APP.currentWindow.gameFieldController.off(GameFieldController.EVENT_ON_SHOW_BONUS_CAPSULE_WIN,this._onShowBonus, this);

		//Animation is not used at the moment, but an instance of the class is created and not deleted every time a capsule appears, clogs the gamescreen, forcibly deleted
		this.__fBonusWin_bwcfa && this.__fBonusWin_bwcfa.destroy();
		
		super.destroy(purely);
	}
}

export default Capsule;