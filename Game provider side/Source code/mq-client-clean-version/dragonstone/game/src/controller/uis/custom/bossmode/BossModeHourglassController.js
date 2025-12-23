import SimpleUIController from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/uis/base/SimpleUIController';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import GameField from '../../../../main/GameField';
import BossModeController from './BossModeController';
import BossModeHourglassView from '../../../../view/uis/custom/bossmode/BossModeHourglassView';

class BossModeHourglassController extends SimpleUIController
{
	static get EVENT_ON_HOURGLASS_DISAPPEAR_ANIMATION_COMPLETED()	{return BossModeHourglassView.EVENT_ON_DISAPPEAR_ANIMATION_COMPLETED;}
	static get EVENT_ON_DISAPPEAR_ANIMATION_COMPLETING()			{return BossModeHourglassView.EVENT_ON_DISAPPEAR_ANIMATION_COMPLETING;}	
	static get EVENT_ON_PROGRESS_UPDATED()							{return BossModeHourglassView.EVENT_ON_PROGRESS_UPDATED;}

	updateBoss(aEnemy_e)
	{
		this._updateBoss(aEnemy_e);
	}

	__init()
	{
		super.__init();
	}

	__initControlLevel()
	{
		super.__initControlLevel();

		APP.currentWindow.gameField.on(GameField.EVENT_ON_ENEMY_HIT_ANIMATION, this._onEnemyHitAnnimation, this);
	}

	__initViewLevel()
	{
		super.__initViewLevel();

		this.view.on(BossModeHourglassView.EVENT_ON_DISAPPEAR_ANIMATION_COMPLETED, this.emit, this);
		this.view.on(BossModeHourglassView.EVENT_ON_DISAPPEAR_ANIMATION_COMPLETING, this.emit, this);
		this.view.on(BossModeHourglassView.EVENT_ON_PROGRESS_UPDATED, this.emit, this);
	}

	_onEnemyHitAnnimation(aEvent_obj)
	{
		let lInfo_bmhi = this.info;
		let lId_num = aEvent_obj.enemyId;

		if (lInfo_bmhi && lId_num == lInfo_bmhi.id && aEvent_obj.data.killed)
		{
			const lView_bmhv = this.view;
			if (lView_bmhv)
			{
				lView_bmhv.pause();
			}
		}
	}

	_updateBoss(aEnemy_e)
	{
		let lInfo_bmhi = this.info;

		if (lInfo_bmhi)
		{
			const lTrajectory_obj_arr = aEnemy_e.trajectory.points;
			lInfo_bmhi.startPointTime = lTrajectory_obj_arr[1].time;
			lInfo_bmhi.fullTime = lTrajectory_obj_arr[lTrajectory_obj_arr.length - 2].time - lTrajectory_obj_arr[1].time - 800; //to the penultimate point, 
			lInfo_bmhi.name = aEnemy_e.name;
			lInfo_bmhi.id = aEnemy_e.id;
		}

		this._update();
	}

	_update()
	{
		let lView_bmhv = this.view;

		if (lView_bmhv)
		{
			lView_bmhv.update();
		}
	}

	destroy()
	{
		if (APP.currentWindow)
		{
			if (APP.currentWindow.gameField)
			{
				APP.currentWindow.gameField.off(GameField.EVENT_ON_ENEMY_HIT_ANIMATION, this._onEnemyHitAnnimation, this);
			}
		}

		super.destroy();
	}
}

export default BossModeHourglassController