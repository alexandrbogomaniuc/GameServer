import SpineEnemy from './SpineEnemy';
import { DIRECTION, STATE_WALK, STATE_TURN, STATE_STAY, SPINE_SCALE } from './Enemy';
import * as Easing from '../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { ENEMY_TYPES, FRAME_RATE } from '../../../../shared/src/CommonConstants';
import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sprite from '../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import TrajectoryUtils from '../../main/TrajectoryUtils';
import Timer from '../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import AtlasConfig from './../../config/AtlasConfig';
import { AtlasSprite } from '../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import Sequence from '../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';

const APPEARING_DURATION = 2500;

let _explode_textures = null;
function _generateExplodeTextures()
{
	if (_explode_textures) return

	_explode_textures = AtlasSprite.getFrames([APP.library.getAsset("enemies/specter/explode_1"), APP.library.getAsset("enemies/specter/explode_2")], [AtlasConfig.FireSpecterExplode1, AtlasConfig.FireSpecterExplode2], "");
}

class SpecterEnemy extends SpineEnemy
{
	static isSpecter(aTypeId_num)
	{
		return  aTypeId_num == ENEMY_TYPES.SPIRIT_SPECTER ||
				aTypeId_num == ENEMY_TYPES.FIRE_SPECTER ||
				aTypeId_num == ENEMY_TYPES.LIGHTNING_SPECTER
	}

	//override
	__generatePreciseCollisionBodyPartsNames()
	{
		return [
			"specter"
			];
	}

	get isAppearingFinish()
	{
		const lCurrentPoint_obj = TrajectoryUtils.getPrevTrajectoryPoint(this.trajectory, APP.gameScreen.currentTime);
		return lCurrentPoint_obj && !lCurrentPoint_obj.invulnerable;
	}

	get isCritter()
	{
		return true;
	}

	get isTurnState()
	{
		return false; //because specters can not turn at all
	}

	//override
	get isFreezeGroundAvailable()
	{
		return false;
	}

	constructor(params)
	{
		super(params);

		this._fIsDisappearingInProgress_bl = false;
		this._fIsDisappearingStartReported_bl = false;
		this._fIsDisappearingEndReported_bl = false;
		
		this.spineView.scale.set(SPINE_SCALE*this.getScaleCoefficient());
	}
	
	//override
	static getDirection()
	{
		return this.direction;
	}

	_isTrajectoryTurnPointCondition()
	{
		return false; //because specters can not turn at all
	}

	_calculateDirection()
	{		
		if (this.startPosition.x > (APP.config.size.width / 2))
		{
			return DIRECTION.LEFT_DOWN;
		}
		else
		{
			return DIRECTION.RIGHT_DOWN;
		}
	}

	_invalidateStates()
	{
		this._invalidateSpecterState();
		super._invalidateStates();
	}

	_invalidateSpecterState()
	{
		if (this.isLasthand && !this._isAppearingInProgress())
		{
			this._initConstantEffect();
		}
		else
		{
			if (this._isEnoughTimeToAnimateAppearing())
			{
				const lAppearingDelay_num = this._getAppearingDelay();
	
				this.container.visible = false;
				this._fAppearingTimer_t = new Timer(()=>{
					this._startSpecterAppearing();
					this._fAppearingTimer_t && this._fAppearingTimer_t.destructor();
					this._fAppearingTimer_t = null;
				}, lAppearingDelay_num);
			}
			else
			{
				this._initConstantEffect();
			}
		}
	}

	_getAppearingDelay()
	{
		if (!this.trajectory ||
			!this.trajectory.points ||
			!this.trajectory.points[0] ||
			!this.trajectory.points[1])
		{
			return 0;
		}

		if (this.trajectory.points[1].time - APP.gameScreen.currentTime >= APPEARING_DURATION)
		{
			return (this.trajectory.points[1].time - APP.gameScreen.currentTime) - APPEARING_DURATION;
		}
	}

	_isAppearingInProgress()
	{
		if (this.trajectory &&
			this.trajectory.points &&
			this.trajectory.points[0] &&
			this.trajectory.points[0].invulnerable)
		{
			return true;
		}

		return false;
	}

	_isEnoughTimeToAnimateAppearing()
	{
		if (this.trajectory &&
			this.trajectory.points &&
			this.trajectory.points[0] &&
			this.trajectory.points[1] &&
			this.trajectory.points[0].invulnerable &&
			this.trajectory.points[1].time - APP.gameScreen.currentTime >= APPEARING_DURATION)
		{
			return true;
		}

		return false;
	}

	_startSpecterAppearing()
	{
		this._initStartEffect();
		this._riseEnemy();
	}

	_riseEnemy()
	{
		this.container.visible = true;
		let lSpineViewWidth_num = this.spineView.getBounds().width;
		let lSpineViewHeight_num = this.spineView.getBounds().height;
		let lAppearingSpinePositionOffesetY_num = lSpineViewHeight_num;
		this.spineView.y += lAppearingSpinePositionOffesetY_num;

		let lMask_gr = this.container.addChild(new PIXI.Graphics());
		lMask_gr.beginFill(0x000000).drawRect(-lSpineViewWidth_num / 2, -lSpineViewHeight_num / 2, lSpineViewWidth_num, lSpineViewHeight_num).endFill();
		lMask_gr.position.y -= (lAppearingSpinePositionOffesetY_num / 2);
		this.spineView.mask = lMask_gr;

		this.spineView.moveYTo(this.spineView.y - lAppearingSpinePositionOffesetY_num, this._riseTime, Easing.sine.easeOut, () => { this._onFinishAppearing() });
	}

	get _riseTime()
	{
		return 20*FRAME_RATE;
	}

	_onFinishAppearing()
	{
		this.spineView.mask.destroy();
		this.spineView.mask = null;
	}

	_initConstantEffect()
	{

	}

	_initStartEffect()
	{

	}

	getTurnDirection()
	{
		return this.direction; //because specters can not turn at all
	}

	//override
	_getPossibleDirections()
	{
		return [0, 90];
	}

	//override
	_isRotationOnChangeViewRequired()
	{
		return false;
	}

	//override
	getSpineSpeed()
	{
		const lBaseSpeed_num = 1;
		return this.currentTrajectorySpeed * this.getScaleCoefficient() * lBaseSpeed_num;
	}

	//override
	_getHitRectHeight()
	{
		return 170;
	}

	//override
	_getHitRectWidth()
	{
		return 140;
	}

	//override
	changeShadowPosition()
	{
		this.shadow.alpha = 0;
	}

	//override
	_calculateAnimationName(stateType)
	{
		let animationName = '';

		switch (stateType)
		{
			case STATE_STAY:
			case STATE_WALK:
				animationName = this.getWalkAnimationName();
				break;
		}

		return animationName;
	}

	//override
	get _isImpactAllowed()
	{
		return false;
	}

	//override
	getLocalCenterOffset()
	{
		let pos = {x: 0, y: 0};
		switch (this.direction)
		{
			case DIRECTION.LEFT_DOWN:	pos = {x: 0,	y: -80};	break;
			case DIRECTION.RIGHT_DOWN:	pos = {x: 0,	y: -80};	break;
		}
		return pos;
	}

	_onDisappearingStarted()
	{
		this._fIsDisappearingInProgress_bl = true;

		if(!this._fIsDisappearingStartReported_bl)
		{
			this._fIsDisappearingStartReported_bl = true;
		}
	}

	_onDisappearingEnded()
	{
		this._fIsDisappearingInProgress_bl = false;

		if(!this._fIsDisappearingEndReported_bl)
		{
			this._fIsDisappearingEndReported_bl = true;
		}
	}

	_startNoDeathExplodeAnimation()
	{
		this.spineView.visible = true;
		if (this.spineView && this.spineView.transform)
		{
			let lAlpha_seq = [
				{tweens: [	{prop: "alpha", to: 0}],	duration: 10 * FRAME_RATE}
			];
	
			Sequence.start(this.spineView, lAlpha_seq);
		}

		_generateExplodeTextures();

		this._fNoDeathExplode_spr = this.container.addChild(new Sprite());
		this._fNoDeathExplode_spr.position.set(0, -53);
		this._fNoDeathExplode_spr.textures = _explode_textures;
		this._fNoDeathExplode_spr.blendMode = PIXI.BLEND_MODES.SCREEN;
		this._fNoDeathExplode_spr.scale.set(4, 4);
		this._fNoDeathExplode_spr.animationSpeed = 30 / 60;
		this._fNoDeathExplode_spr.once('animationend', () =>
		{
			this._fIsDeathFxFinished_bl = true;
			this._fNoDeathExplode_spr.destroy();
			this.onDeathFxAnimationCompleted();
			this._onDisappearingEnded();
		});
		this._fNoDeathExplode_spr.play();
	}

	//override
	isRedTargetMarkerRejected()
	{
		if(this._fIsDisappearingInProgress_bl)
		{
			return true;
		}

		return super.isRedTargetMarkerRejected();
	}

	//override
	destroy(purely)
	{
		this.removeTweens();

		this.spineView && Sequence.destroy(Sequence.findByTarget(this.spineView));

		this._fAppearingTimer_t && this._fAppearingTimer_t.destructor();
		this._fAppearingTimer_t = null;

		super.destroy(purely);

		this._fIsDisappearingInProgress_bl = null;
		this._fIsDisappearingStartReported_bl = null;
		this._fIsDisappearingEndReported_bl = null;
		this._fNoDeathExplode_spr = null;
	}
}

export default SpecterEnemy;