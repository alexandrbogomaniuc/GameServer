import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import Timer from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import ElectricityBodyFrontArcView from './body_arcs/ElectricityBodyFrontArcView';
import Sequence from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { Utils } from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import { ENEMIES } from '../../../../../../shared/src/CommonConstants';

const ARC_DELAYS_IN_FRAMES = [4, 2, 2, 4, 9, 4];

const ARC_MESHES = 
{
	[ENEMIES.Anubis] : [],
	[ENEMIES.Osiris] : [],
	[ENEMIES.Thoth] : [],
	[ENEMIES.MummyGodGreen] : [],
	[ENEMIES.MummySmallWhite] : []
}

class ElectricityArmWeaponAnimation extends Sprite
{	
	startAnimation()
	{
		this._startAnimation();
	}

	//INIT...
	constructor(targetEnemy)
	{
		super();

		this._targetEnemy = targetEnemy;
		this._arcAppearTimer = null;
		this._currentArcDelayIndex = -1;
		this._arcs_arr = [];
	}
	//...INIT

	//ANIMATION...
	_startAnimation()
	{
		this._currentArcDelayIndex = -1;
		this._addArc();

		this._startArcAppearTimer();
	}

	_addArc()
	{
		let calcProps = this._calculateArcProps();

		let sprt = this.addChild(new ElectricityBodyFrontArcView());
		sprt.x = calcProps.x;
		sprt.y = calcProps.y;
		sprt.rotation = Utils.gradToRad(Utils.random(45, 135, false));
		sprt.alpha = 0;
		
		sprt.scale.x = Utils.random(0.5, 0.8, true) * (Math.random() > 0.5 ? 1 : -1);
		sprt.scale.y = Utils.random(0.2, 0.6, true) * (Math.random() > 0.5 ? 1 : -1);

		this._arcs_arr.push(sprt);

		let seq = [
					{ tweens:[{prop:"alpha", to:1}], duration:1*2*16.7 },
					{ tweens:[], duration:3*2*16.7 },
					{ tweens:[{prop:"alpha", to:0}], duration:3*2*16.7 }
				];

		let sequence = Sequence.start(sprt, seq);
		sequence.once(Sequence.EVENT_ON_SEQUENCE_PLAYING_COMPLETED, this._onArcSequenceCompleted, this);
	}

	_onArcSequenceCompleted(event)
	{
		let seq = event.target;
		let seqObj = seq.obj;
		seq.destructor();
		
		let arcIndex = this._arcs_arr.indexOf(seqObj);
		this._arcs_arr.splice(arcIndex, 1);
		seqObj.destroy();
	}

	_calculateArcProps()
	{
		let props = {x: 0, y: 0};

		let arcMesheNames = ARC_MESHES[this._targetEnemy.name];
		let targetEnemyArmHull = this._targetEnemy.calcMeshesHull(arcMesheNames);
		if (targetEnemyArmHull && targetEnemyArmHull.length > 0)
		{
			let meshPoligonIndex = 0;
			if (targetEnemyArmHull.length > 1)
			{
				meshPoligonIndex = Utils.random(0, (targetEnemyArmHull.length-1));
			}
			let armPoligonPoints = targetEnemyArmHull[meshPoligonIndex].points;
			let minPointYIndex = 1;
			let maxPointYIndex = 1;
			for (let i=3; i<armPoligonPoints.length; i+=2)
			{
				let curY_num = armPoligonPoints[i];
				if (curY_num < armPoligonPoints[minPointYIndex])
				{
					minPointYIndex = i;
				}
				if (curY_num > armPoligonPoints[maxPointYIndex])
				{
					maxPointYIndex = i;
				}
			}

			let topWeaponPoint = this._convertEnemyPointToLocal(armPoligonPoints[minPointYIndex-1], armPoligonPoints[minPointYIndex]);
			let bottomWeaponPoint = this._convertEnemyPointToLocal(armPoligonPoints[maxPointYIndex-1], armPoligonPoints[maxPointYIndex]);

			// let angle = -(bottomWeaponPoint.y - topWeaponPoint.y)/(bottomWeaponPoint.x - topWeaponPoint.x);

			let randomDist = Utils.random(0.2, 0.87, true);
			props.x = bottomWeaponPoint.x + (topWeaponPoint.x-bottomWeaponPoint.x)*randomDist;
			props.y = bottomWeaponPoint.y + (topWeaponPoint.y-bottomWeaponPoint.y)*randomDist;

			// debug ...
			// let gr = this.addChild(new PIXI.Graphics());
			// gr.lineStyle(1, 0x00ffff);
			// gr.position.set(topWeaponPoint.x, topWeaponPoint.y);
			// gr.beginFill(0xf0f0f0, 1).drawCircle(0, 0, 5).endFill();
			// ... debug
		}

		return props;
	}

	_convertEnemyPointToLocal(aX_num, aY_num)
	{
		let pnt = new PIXI.Point(aX_num, aY_num);
		pnt = this._targetEnemy.spineView.localToLocal(pnt.x, pnt.y, this);
		pnt.x = pnt.x*this._targetEnemy.spineView.scale.x;
		pnt.y = pnt.y*this._targetEnemy.spineView.scale.y;

		return pnt;
	}

	//TIMER...
	_startArcAppearTimer()
	{
		this._currentArcDelayIndex++;
		let delayFramesAmount_num;
		if (this._currentArcDelayIndex < ARC_DELAYS_IN_FRAMES.length)
		{
			delayFramesAmount_num = ARC_DELAYS_IN_FRAMES[this._currentArcDelayIndex];
			this._arcAppearTimer = new Timer(this._onArcAppearTimerCompleted.bind(this), delayFramesAmount_num*2*16.7);
		}
		else
		{
			this._currentArcDelayIndex = -1;
		}
	}

	_clearArcAppearTimer()
	{
		this._arcAppearTimer && this._arcAppearTimer.destructor();
		this._arcAppearTimer = null;
	}

	_onArcAppearTimerCompleted()
	{
		this._clearArcAppearTimer();

		this._addArc();

		this._startArcAppearTimer();		
	}
	//...TIMER

	//...ANIMATION
	
	destroy()
	{
		this._targetEnemy = null;
		this._clearArcAppearTimer();

		this._currentArcDelayIndex = undefined;
		while (this._arcs_arr && this._arcs_arr.length)
		{
			let arc = this._arcs_arr.pop();
			Sequence.destroy(Sequence.findByTarget(arc));
		}
		this._arcs_arr = null;

		super.destroy();
	}
}

export default ElectricityArmWeaponAnimation;