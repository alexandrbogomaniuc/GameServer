import SpineEnemy from './SpineEnemy';
import Enemy, { STATE_WALK, STATE_IMPACT, DIRECTION } from './Enemy';
import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { Utils } from '../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import GameScreen from '../GameScreen';
import TrajectoryUtils from '../../main/TrajectoryUtils';
import * as Easing from '../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import Sequence from '../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';

class RavenEnemy extends SpineEnemy
{
	constructor(params, aGameField_gf)
	{
		super(params);

		this._fGameField_gf = aGameField_gf;
	}

	//override
	__generatePreciseCollisionBodyPartsNames()
	{
		return [
			"WING"
			];
	}

	//override
	get isCritter()
	{
		return true;
	}

	//override
	get isFastTurnEnemy()
	{
		return true;
	}

	//override
	get isFreezeGroundAvailable()
	{
		return false;
	}

	//override
	_getApproximateWidth()
	{
		return this._getHitRectWidth() * 3;
	}

	//override
	_getApproximateHeight()
	{
		return this._getHitRectHeight() * 3;
	}

	//override
	getSpineSpeed()
	{
		let lBaseSpeed_num = 0.09;
		let lSpineSpeed_num = this.currentTrajectorySpeed * lBaseSpeed_num;
		
		return lSpineSpeed_num;
	}

	//override
	_updateCurrentTrajectorySpeed(aLastPrevPoint, aNewPrevPoint, aLastNextPoint, aNewNextPoint)
	{
		this.currentTrajectorySpeed = this._calcCurrentTrajectorySpeed();
	}

	//override
	_calcCurrentTrajectorySpeed()
	{
		let lPoints = this.trajectory.points;
		if (lPoints.length >= 2)
		{
			let lFirstPoint = lPoints[0];
			let lLastPoint = lPoints[lPoints.length-1];

			let lDeltaTime = lLastPoint.time - lFirstPoint.time;
			let lDistance = Utils.getDistance(lLastPoint, lFirstPoint);

			if (~~lDistance == 0)
			{
				return this.speed;
			}
			
			let lCurTrajectorySpeed = +(lDistance/lDeltaTime*1000/11.45).toFixed(2);

			return lCurTrajectorySpeed;
		}
	}

	//override
	_isTrajectoryTurnPointCondition(aPrevAngle, aNextAngle)
	{
		return false;
	}

	//override
	getHitRectangle()
	{
		let rect = new PIXI.Rectangle();
		rect.width = 7;
		rect.height = 7;

		return rect;
	}

	//override
	_getHitRectHeight()
	{
		return 106 * this.getScaleCoefficient();
	}

	//override
	_getHitRectWidth()
	{
		return 133 * this.getScaleCoefficient();
	}

	//override
	changeShadowPosition()
	{
		let x = 0 * this.getScaleCoefficient(), y = 250 * this.getScaleCoefficient(), scale = 1.1 * this.getScaleCoefficient(), alpha = 0.4;

		this.shadow.position.set(x, y);
		this.shadow.scale.set(scale);
		this.shadow.alpha = alpha;
	}

	//override
	getLocalCenterOffset()
	{
		let pos = {x: 0 * this.getScaleCoefficient(), y: -53 * this.getScaleCoefficient()};
		return pos;
	}

	//override
	_calcWalkAnimationName(aDirection_str, aBaseWalkAnimationName_str = "walk")
	{
		switch (aDirection_str)
		{
			case DIRECTION.LEFT_UP:
				return 'Walk_270';
				break;
			case DIRECTION.LEFT_DOWN:
				return 'Walk_0';
				break;
			case DIRECTION.RIGHT_UP:
				return 'Walk_180';
				break;
			case DIRECTION.RIGHT_DOWN:
				return 'Walk_90';
				break;
		}
		throw new Error (aDirection_str + " is not supported direction.");
	}

	//override
	_calcImpactAnimationName(aDirection_str, aBaseImpactAnimationName_str = "hit")
	{
		switch (aDirection_str)
		{
			case DIRECTION.LEFT_UP:
				return 'Hit_at_270';
				break;
			case DIRECTION.LEFT_DOWN:
				return 'Hit_at_0';
				break;
			case DIRECTION.RIGHT_UP:
				return 'Hit_at_180';
				break;
			case DIRECTION.RIGHT_DOWN:
				return 'Hit_at_90';
				break;
		}
		throw new Error (aDirection_str + " is not supported direction.");
	}

	//override
	get turnPostfix()
	{
		return "";
	}

	//override
	get turnPrefix()
	{
		return "";
	}

	//override
	get turnAnglesSeparator()
	{
		return "";
	}

	//override
	get _customSpineTransitionsDescr()
	{
		return [
					{from: "Walk_<PREFIX>", to: "Walk_<PREFIX>", duration: 0.1},
					{from: "Walk_<PREFIX>", to: "Hit_at_<PREFIX>", duration: 0.1},
					{from: "Hit_at_<PREFIX>", to: "Walk_<PREFIX>", duration: 0.1}
				];
	}

	//override
	_getSpineAnimDefaultPrefix()
	{
		let spineName = this._fCurSpineName_str;
		let lMatchedDirection_arr = spineName.match(/\d+/ig);
		let prefix = (lMatchedDirection_arr && lMatchedDirection_arr.length) ? lMatchedDirection_arr[0] : "";

		return prefix;
	}

	_correctResumedWalkTimeDelta(delta)
	{
		return 0;
	}

	//override
	get _isPauseWalkingOnImpactAllowed()
	{
		return false;
	}

	destroy()
	{
		super.destroy();

		this._fGameField_gf = null;
	}

	//override
	__onSpawn()
	{
		this._fGameField_gf.onSomeEnemySpawnSoundRequired(this.typeId);
	}
}

export default RavenEnemy;