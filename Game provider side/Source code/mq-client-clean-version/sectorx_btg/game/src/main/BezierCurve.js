import { Utils } from '../../../../common/PIXI/src/dgphoenix/unified/model/Utils';

let cache = {};
let segmentLengthCache = {};
const THREE_PI = 3 * Math.PI; //3 - is the step sensitivity

class BezierCurve
{
	static getCurve(arr, t)
	{
		return BezierCurve.prepare(arr.length)(arr, t)
	}

	static prepare(pieces)
	{
		pieces = +pieces | 0
		if (!pieces) throw new Error('Cannot create a interpolator with no elements')
		if (cache[pieces]) return cache[pieces]

		let fn = ['let ut = 1 - t', '']

		let n = pieces
		while (n--)
		{
			for (let j = 0; j < n; j += 1)
			{
				if (n + 1 === pieces)
				{
					fn.push('let p' + j + ' = arr[' + j + '] * ut + arr[' + (j + 1) + '] * t')
				} else if (n > 1)
				{
					fn.push('p' + j + ' = p' + j + ' * ut + p' + (j + 1) + ' * t')
				} else
				{
					fn.push('return p' + j + ' * ut + p' + (j + 1) + ' * t')
				}
			}
			if (n > 1) fn.push('')
		}

		if (pieces == 2)
		{
			fn.push('return p0');
		}

		fn = [
			'return function bezier' + pieces + '(arr, t) {'
			, fn.map(function (s) { return '  ' + s }).join('\n')
			, '}'
		].join('\n')

		if (!cache[pieces])
		{
			cache[pieces] = Function(fn)();
		}

		return Function(fn)()
	}

	static approximateTrajectory(aTrajectoryPoint_arr, lSeparetedPoints_arr)
	{
		if (aTrajectoryPoint_arr.length <= 1)
		{
			APP.logger.i_pushError(`BezierCurve. Incorrect trajectory points for approximate.`);
			console.error("Incorrect trajectory points for approximate.");
			return;
		}

		let lValidatedTrajectoryPoints_arr = [];
		let lFinishTrajectoryPoint_arr = [];
		let lFirstTime_num = aTrajectoryPoint_arr[0].time;
		let lLastTime_num = aTrajectoryPoint_arr[aTrajectoryPoint_arr.length-1].time;
		let lFullTime_num = lLastTime_num - lFirstTime_num;
		let lPointTimeCorrect_bl = true;

		let lSeparetedPoints_pt = lSeparetedPoints_arr;

		for (let i = 0; i < aTrajectoryPoint_arr.length; i++) //convert time to percent
		{
			let lPercent_num = (aTrajectoryPoint_arr[i].time - lFirstTime_num) / lFullTime_num;
			if (lPercent_num > 1)
			{
				lPointTimeCorrect_bl = false;
				lPercent_num = 1;
			}

			let lPositionX_num = BezierCurve.getCurve(lSeparetedPoints_pt.x, lPercent_num);
			let lPositionY_num = BezierCurve.getCurve(lSeparetedPoints_pt.y, lPercent_num);
			lValidatedTrajectoryPoints_arr.push({x: lPositionX_num, y: lPositionY_num, percent: lPercent_num, correctPercent: lPercent_num});
		}

		if (!lPointTimeCorrect_bl)
		{
			APP.logger.i_pushError(`BezierCurve. Incorrect trajectory time for the enemy. The intermediate point time is greater than the last point time.`);
			console.error("Incorrect trajectory time for the enemy. The intermediate point time is greater than the last point time.");
		}

		lFinishTrajectoryPoint_arr.push(lValidatedTrajectoryPoints_arr[0]);

		for (let i = 1; i < lValidatedTrajectoryPoints_arr.length; i++) //approximate points
		{
			let lFirstPoint_pnt = {x: lValidatedTrajectoryPoints_arr[i-1].x, y: lValidatedTrajectoryPoints_arr[i-1].y, percent: Number(lValidatedTrajectoryPoints_arr[i-1].percent)};
			let lSecondPoint_pnt = {x: lValidatedTrajectoryPoints_arr[i].x, y: lValidatedTrajectoryPoints_arr[i].y, percent: Number(lValidatedTrajectoryPoints_arr[i].percent)};
			let newApproximatePoints = BezierCurve.approximatePoints(lFirstPoint_pnt, lSecondPoint_pnt, lSeparetedPoints_pt, BezierCurve.accuracyPointDefault);
			lFinishTrajectoryPoint_arr.push.apply(lFinishTrajectoryPoint_arr, newApproximatePoints);
		}

		let lFullTrajectoryLength_num = 0;

		for (let i = 1; i < lFinishTrajectoryPoint_arr.length; i++) //search for the full length of the trajectory
		{
			let lFirstPoint_pnt = {x: lFinishTrajectoryPoint_arr[i-1].x, y: lFinishTrajectoryPoint_arr[i-1].y};
			let lSecondPoint_pnt = {x: lFinishTrajectoryPoint_arr[i].x, y: lFinishTrajectoryPoint_arr[i].y};
			lFinishTrajectoryPoint_arr[i].segmentLength =  BezierCurve.getSegmentLength(lFirstPoint_pnt, lSecondPoint_pnt);
			lFullTrajectoryLength_num += lFinishTrajectoryPoint_arr[i].segmentLength;
		}

		let lCurrentTrajectoryLength_num = 0;
		for (let i = 1; i < lFinishTrajectoryPoint_arr.length; i++) //percent correct
		{
			lCurrentTrajectoryLength_num += lFinishTrajectoryPoint_arr[i].segmentLength;
			let lPercentTrajectoryLength = lCurrentTrajectoryLength_num / lFullTrajectoryLength_num;
			lFinishTrajectoryPoint_arr[i].correctPercent = 	lPercentTrajectoryLength;
		}

		return lFinishTrajectoryPoint_arr;
	}

	static approximatePoints(aFirstPoint_pt, aSecondPoint_pt, aSeparetedPoints_pt, aAccuracy_bl)
	{
		let laccuracyAchieved = this.accuracyAchieved(aFirstPoint_pt, aSecondPoint_pt, aAccuracy_bl);
		if (laccuracyAchieved)
		{
			return [aSecondPoint_pt];
		}

		let lFinishTrajectoryPoint_arr = [];

		let lHalfPercent_num = (aFirstPoint_pt.percent + aSecondPoint_pt.percent) / 2;
		let lPositionX_num = BezierCurve.getCurve(aSeparetedPoints_pt.x, lHalfPercent_num);
		let lPositionY_num = BezierCurve.getCurve(aSeparetedPoints_pt.y, lHalfPercent_num);

		let lMiddlePoint_pt = {x: lPositionX_num, y: lPositionY_num, percent: lHalfPercent_num};

		let lCosABC_num = Utils.cosABC(aFirstPoint_pt, lMiddlePoint_pt, aSecondPoint_pt);
		let lAccuracy_num = Math.ceil(THREE_PI / (Math.PI - Math.acos(lCosABC_num)));

		let lNewApproximatePointsPart1 = BezierCurve.approximatePoints(aFirstPoint_pt, lMiddlePoint_pt, aSeparetedPoints_pt, lAccuracy_num);
		let lNewApproximatePointsPart2 = BezierCurve.approximatePoints(lMiddlePoint_pt, aSecondPoint_pt, aSeparetedPoints_pt, lAccuracy_num);

		lFinishTrajectoryPoint_arr.push.apply(lFinishTrajectoryPoint_arr, lNewApproximatePointsPart1);
		lFinishTrajectoryPoint_arr.push.apply(lFinishTrajectoryPoint_arr, lNewApproximatePointsPart2);

		return lFinishTrajectoryPoint_arr;
	}

	static get accuracyPointDefault()
	{
		return 20;
	}

	static accuracyAchieved(aFirstPoint_pt_pnt, aSecondPoint_pt_pnt, aAccuracy_bl)
	{
		if (BezierCurve.getSegmentLength(aFirstPoint_pt_pnt, aSecondPoint_pt_pnt) > aAccuracy_bl)
		{
			return false;
		}

		return true;
	}

	static getSegmentLength(aFirstPoint_pt_pnt, aSecondPoint_pt_pnt)
	{
		let lx = Math.abs((aFirstPoint_pt_pnt.x - aSecondPoint_pt_pnt.x).toFixed(1));
		let ly = Math.abs((aFirstPoint_pt_pnt.y - aSecondPoint_pt_pnt.y).toFixed(1));

		if (segmentLengthCache[lx+";"+ly]) 
		{
			return segmentLengthCache[lx+";"+ly];
		}

		let result = Math.sqrt(lx*lx + ly*ly);
		segmentLengthCache[lx+";"+ly] = result;
		return result;
	}

}

export default BezierCurve;