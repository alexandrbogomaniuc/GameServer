import SpineEnemy from './SpineEnemy';
import Enemy, { STATE_WALK, STATE_TURN, STATE_DEATH, STATE_RAGE, STATE_STAY} from "./Enemy";
import Sequence from '../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import * as Easing from '../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { ENEMY_TYPES, FRAME_RATE } from '../../../../shared/src/CommonConstants';
import Timer from '../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sprite from '../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { Utils } from '../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';

class RageEnemy extends SpineEnemy 
{
	static get EVENT_START_RAGE()				{return "EVENT_START_RAGE";}

	constructor(params)
	{
		super(params);
		this._fPauseTimeMarker_num = undefined;
		this._fFreezeTimeMarker_num = undefined;
		this._fStartAOEAwaitingTimer_t = null;
		this._fIsRageAnimationInProgress_bl = false;
	}

	static isRageEnemy(aTypeId_num)
	{
		return  aTypeId_num == ENEMY_TYPES.OGRE;
	}

	//override
	_calculateAnimationName(state)
	{
		if (state == STATE_RAGE)
		{
			return this.getRageAnimation(); 
		}
		return super._calculateAnimationName(state);
	}

    getRageAnimation()
    {
    }

	//override
	_calculateAnimationLoop(state)
	{
		let animationLoop = true;

		switch(state)
		{
			case STATE_TURN:
			case STATE_RAGE:
			{
				animationLoop = false;
				break;
			}
		}
		return animationLoop;
	}

	//override
	get _isImpactAllowed()
	{
		return super._isImpactAllowed
				&& this.state !== STATE_RAGE;
	}

	startRageAnimation(data)
	{
		if (this._fIsFrozen_bl)
		{
			this.once(Enemy.EVENT_ON_ENEMY_UNFREEZE, this._startRageAnimation, this);
		}
		else
		{
			this._startRageAnimation();
		}
	}

	_startRageAnimation()
	{
		if(this.state !== STATE_RAGE)
		{
			this.emit(RageEnemy.EVENT_START_RAGE);
			this._fIsRageAnimationInProgress_bl = true;
			this._fIsRageStage_bl = true;
			this.state = STATE_RAGE;
			this._updateSpineAnimation();
		}
	}

	//override
	_calculateDirection(aOptAngle_num=undefined)
	{
		if(this._fRageDirection_str !== undefined)
		{
			return this._fRageDirection_str;
		}

		return super._calculateDirection(aOptAngle_num);
	}

	//override
	_isRotationOnChangeViewRequired(targetDirection)
	{
		if(this._fRageDirection_str !== undefined)
		{
			return false;
		}

		return super._isRotationOnChangeViewRequired(targetDirection);
	}

	_updateSpineAnimation()
	{
		// override
	}

	_startTintAnimation()
	{
		this._fTintTimer_t = null;
		
		let lDuration_num = 20*FRAME_RATE;
		
		this._fTintTimer_t = new Timer(() => {
			this._playHitHighlightAnimation(lDuration_num, 0.2)
		}, lDuration_num, true);
		this._fTintTimer_t.tick(lDuration_num);
	}

	getAOECenter()
	{
	}

	_createAOEonGameField(data)
	{
		APP.gameScreen.gameField.startRageAOEAnimation(this.getAOECenter(), this.position, data);
	}

	destroy()
	{
		this._fTintTimer_t && this._fTintTimer_t.destructor();
		this._fTintTimer_t = null;
		this._fIsRageAnimationInProgress_bl = false;
		this.spineView && this.spineView.view && Sequence.destroy(Sequence.findByTarget(this.spineView));
		this._fPauseTimeMarker_num = undefined;
		this._fFreezeTimeMarker_num = undefined;
		super.destroy();
	}
}

export default RageEnemy;