import SpineEnemy from './SpineEnemy';
import { DIRECTION, STATE_STAY } from './Enemy';
import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';

const BAT_MINIMAL_SWING_DELTA = 22;
const BAT_ADDITIONAL_SWING_DELTA = 34;

const BAT_MINIMAL_SWING_TIME = 3000;
const BAT_ADDITIONAL_SWING_TIME = 4000;

const SPINE_ANIMATION_FINAL_POINT = 0.2653885521000005;

const PSEUDO_RANDOM_NUMBERS =
[
	0.9535513454504285,
	0.140484697741591,
	0.21681080778532724,
	0.4224325978769279,
	0.31218684665365126,
	0.46047345836717213,
	0.6805786584456448,
	0.36589247288200455,
	0.5520982140577715,
	0.353293006563822,
	0.10363612213525597,
	0.6990115577441931,
	0.44218276128090284,
	0.110803708254537,
	0.42241847575663427,
	0.2365255714157044,
	0.5962708927881075,
	0.16810197342633248,
	0.37423395196694664,
	0.7416600925355761,
	0.7728783077537793,
	0.814273078202367,
	0.5452909014262328,
	0.2708690309584476,
	0.3899057717630481,
	0.22239793762935278,
	0.44255377839151766,
	0.7619196822218561,
	0.9110036322123198,
	0.8600236131173304,
	0.4549027985950813,
	0.6958574179987054,
	0.34450514540033716,
	0.17200658009484182,
	0.7146974517085107,
	0.6037130357913962,
	0.0479858071526269,
	0.7091473505403867,
	0.20533770943300889,
	0.595254790724453,
	0.11774512512647606,
	0.531775004412782,
	0.007916281000500458,
	0.012160007478166701,
	0.2392764372545939,
	0.06169774457271271,
	0.501370036427973,
	0.6085970496640609,
	0.27925364529421937,
	0.4004878672824337,
	0.6783037839308306,
	0.245180125303621,
	0.27173755641263764,
	0.20046976582177511,
	0.3903027871487159,
	0.3805531495324359,
	0.22981443643962063,
	0.9729731840381568,
	0.4909488849505803,
	0.49952900193504157,
	0.516706886717804,
	0.6086123438612943,
	0.21630169862942572,
	0.3150562030320654,
	0.7287646831075183,
	0.512801865019767,
	0.3356010225821193,
	0.13862883570675288,
	0.8095334440757895,
	0.997072228697893,
	0.7704145858375477,
	0.2834350406027122,
	0.7980939457074019,
	0.6815563639300448,
	0.3741647293735155,
	0.26424142070404955,
	0.612106502461957,
	0.8819219166536931,
	0.5294202542837214,
	0.30683435907342616,
	0.6695960026380017,
	0.5584975979870037,
	0.8535994287057704,
	0.8039768457775271,
	0.39478796081091394,
	0.2982613912812466,
	0.7776313937952484,
	0.7910352059571935,
	0.48825245417091345,
	0.766587787424382,
	0.576640268496547,
	0.7529866208246461,
	0.49009313349164585,
	0.02560838834891932,
	0.5258290755527721,
	0.07550258341982996,
	0.4417644612834404,
	0.45392263981771896,
	0.9333025123047827,
	0.40124022794645464,
];

class BatEnemy extends SpineEnemy
{
	constructor(params)
	{
		super(params);

		this._fPseudoRandomInitialShiftIndex_int = this.id % PSEUDO_RANDOM_NUMBERS.length;
		this._fPseudoRandomInitialNumber_num = PSEUDO_RANDOM_NUMBERS[this._fPseudoRandomInitialShiftIndex_int];
	
		this._fSwingTime_num = BAT_MINIMAL_SWING_TIME + BAT_ADDITIONAL_SWING_TIME * this._fPseudoRandomInitialNumber_num;
		this._fSwingDelta_num = BAT_MINIMAL_SWING_DELTA + BAT_ADDITIONAL_SWING_DELTA * this._fPseudoRandomInitialNumber_num;
		
		this._fSwingOffset_num = 0;
		this._fVisualAngle_num = 0;

		if(this.id % 3 === 0)
		{
			this._fSwingTime_num += BAT_MINIMAL_SWING_TIME * 0.75;
		}

		this._fRecoveryOffsetX_num = 0;
		this._fRecoveryOffsetY_num = 0;
		this._fRecoveryProgress_num = 1;
	}

	//override...
	/*
	__generatePreciseCollisionBodyPartsNames()
	{
		return [
			"wing",
			];
	}*/

	//override...
	__isSimpleCollisionEnemy()
	{
		return true;
	}

	__onBeforeNewTrajectoryApplied(aTrajectory_obj)
	{
		this._fRecoveryOffsetX_num = this.getPositionOffsetX();
		this._fRecoveryOffsetY_num = this.getPositionOffsetY();
		this._fRecoveryProgress_num = 0;
	}

	_getVisualAngle()
	{
		if(
			this.trajectory &&
			this.trajectory.points
			)
		{
			let lPoints_pt_arr = this.trajectory.points;
			let lPoint1_pt = lPoints_pt_arr[0];
			let lPoint2_pt = lPoints_pt_arr[lPoints_pt_arr.length-1];

			return Math.atan2(lPoint2_pt.y - lPoint1_pt.y, lPoint2_pt.x - lPoint1_pt.x);
		}

		return 0;
	}

	getTrajectoryProgress()
	{
		if(
			this.trajectory &&
			this.trajectory.points
			)
		{
			let lPoints_pt_arr = this.trajectory.points;
			let lCurrentTime_num = APP.gameScreen.currentTime;

			if(
				lPoints_pt_arr[0].x === lPoints_pt_arr[1].x &&
				lPoints_pt_arr[0].y === lPoints_pt_arr[1].y
				)
			{
				return 0;
			}


			let lTimeStart_num = lPoints_pt_arr[0].time;
			let lTimeFinish_num = lPoints_pt_arr[lPoints_pt_arr.length-1].time;

			if(
				lCurrentTime_num >= lTimeStart_num &&
				lCurrentTime_num <= lTimeFinish_num
				)
			{
				return (lCurrentTime_num - lTimeStart_num) / (lTimeFinish_num - lTimeStart_num);
			}
		}

		return 0;
	}

	getOffsetProgress()
	{
		if(
			this.trajectory &&
			this.trajectory.points
			)
		{
			let lPoints_pt_arr = this.trajectory.points;
			let lCurrentTime_num = APP.gameScreen.currentTime;


			let lTimeStart_num = lPoints_pt_arr[0].time;
			let lTimeFinish_num = lPoints_pt_arr[lPoints_pt_arr.length-1].time;

			let lProgress_num = 0;
			let lSwingIndex_int = 0;

			if(
				lCurrentTime_num >= lTimeStart_num &&
				lCurrentTime_num <= lTimeFinish_num
				)
			{
				let lTimeDelta_num = lCurrentTime_num - lTimeStart_num;

				lProgress_num = lTimeDelta_num % this._fSwingTime_num / this._fSwingTime_num;
				lSwingIndex_int = Math.round((lTimeDelta_num - (lTimeDelta_num % this._fSwingTime_num)) / this._fSwingTime_num);
			}

			let lResult_num = 1;

			//CASTING TO -0.5 <-> 0.5...
			if(lProgress_num < 0.5)
			{
				lResult_num = lProgress_num * 2 - 0.5;
			}
			else
			{
				lResult_num = 1 - (lProgress_num - 0.5) * 2 - 0.5;
			}
			//...CASTING TO -0.5 <-> 0.5


			//DIVERSIFYING MOVEMENT...
			if(this.id % 2 === 0)
			{
				lResult_num = lResult_num - 1;

				if(lSwingIndex_int % 2 === 0)
				{
					lResult_num = -0.5;
				}
			}
			
			else if(
				this.id % 3 === 0 &&
				lSwingIndex_int % 2 !== 0
				)
			{
				lResult_num = -0.5;
			}

			if(this.id % 5 === 0)
			{
				lResult_num = -0.5; //SKIP ALL SWINGS...
			}

			return lResult_num;
			
		}

		return 0;
	}


	getPositionOffsetX()
	{
		let lOffset_num = Math.cos(this.getOffsetProgress() * Math.PI * 2) * this._fSwingDelta_num;
		let lAddintionalAngle_num = Math.round(this._fPseudoRandomInitialNumber_num * 100) % 3 === 0 ? 0 : Math.PI / 2;

		this._fSwingOffset_num = lOffset_num;
		this._fVisualAngle_num = this._getVisualAngle()

		if(lAddintionalAngle_num === 0)
		{
			lOffset_num *= 0.75;
			
		}

		let lResultX_num = Math.cos(this._fVisualAngle_num + lAddintionalAngle_num) * (lOffset_num);

		return this._fRecoveryOffsetX_num * (1 - this._fRecoveryProgress_num) + lResultX_num * this._fRecoveryProgress_num;
	}

	getPositionOffsetY()
	{
		let lOffset_num = this._fSwingOffset_num;
		let lAddintionalAngle_num = Math.round(this._fPseudoRandomInitialNumber_num * 100) % 3 === 0 ? 0 : Math.PI / 2;
		let lHieight_num = 0;

		if(lAddintionalAngle_num === 0)
		{
			lHieight_num = lOffset_num * 0.25;
			lOffset_num *= 0.75;

		}

		let lResultY_num = Math.sin(this._fVisualAngle_num + lAddintionalAngle_num) * lOffset_num + lHieight_num;

		return this._fRecoveryOffsetY_num * (1 - this._fRecoveryProgress_num) + lResultY_num * this._fRecoveryProgress_num;
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
		let lSpineSpeed_num = this.currentTrajectorySpeed * 0.09775;

		return lSpineSpeed_num;
	}

	//override
	getHitRectangle()
	{
		let rect = new PIXI.Rectangle();
		rect.width = 5;
		rect.height = 5;

		return rect;
	}

	//override
	_getHitRectHeight()
	{
		return 210 * this.getScaleCoefficient();
	}

	//override
	_getHitRectWidth()
	{
		return 300 * this.getScaleCoefficient();
	}

	//override
	changeShadowPosition()
	{
		let x = 0 * this.getScaleCoefficient(), y = 300 * this.getScaleCoefficient(), scale = 2.1 * this.getScaleCoefficient(), alpha = 0.4;

		this.shadow.position.set(x, y);
		this.shadow.scale.set(scale);
		this.shadow.alpha = alpha;
	}

	//override
	getLocalCenterOffset()
	{
		let xOffset=0;
		let yOffset=-55;
		
		switch (this.direction)
		{
			case DIRECTION.LEFT_UP:
				xOffset = 30;
				yOffset = 15;
				break;
			case DIRECTION.LEFT_DOWN:
				break;
			case DIRECTION.RIGHT_UP:
				xOffset = -30;
				yOffset = 0;
				break;
			case DIRECTION.RIGHT_DOWN:
				break;
		}

		return {x: xOffset * this.getScaleCoefficient(), y: yOffset * this.getScaleCoefficient()};
	}

	//override
	_calcWalkAnimationName(aDirection_str, aBaseWalkAnimationName_str = "walk")
	{
		switch (aDirection_str)
		{
			case DIRECTION.LEFT_UP:
				return '270_fly';
				break;
			case DIRECTION.LEFT_DOWN:
				return '0_fly';
				break;
			case DIRECTION.RIGHT_UP:
				return '180_fly';
				break;
			case DIRECTION.RIGHT_DOWN:
				return '90_fly';
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
					{from: "<PREFIX>_fly", to: "<PREFIX>_fly", duration: 0.1}
				];
	}

	/*//override
	_getSpineAnimDefaultPrefix()
	{
		let spineName = this._fCurSpineName_str;
		let lMatchedDirection_arr = spineName.match(/\d+/ig);
		let prefix = (lMatchedDirection_arr && lMatchedDirection_arr.length) ? lMatchedDirection_arr[0] : "";

		return prefix;
	}*/

	tick(delta)
	{
		super.tick(delta);

		if(
			!this.isFrozen &&
			this.state !== STATE_STAY &&
			this._fRecoveryProgress_num < 1
			)
		{
			this._fRecoveryProgress_num += 0.01;

			if(this._fRecoveryProgress_num > 1)
			{
				this._fRecoveryProgress_num = 1;
			}
		}
	}

	__onWalk()
	{
		//RANDOMIZING WINGS FLAPP ANIMATION...
		let lWind_num = SPINE_ANIMATION_FINAL_POINT * this._fPseudoRandomInitialNumber_num;
		this.windSpineAnimationTo(lWind_num)
		//...RANDOMIZING WINGS FLAPP ANIMATION
	}

	destroy()
	{
		super.destroy();
	}
}

export default BatEnemy;