import SimpleUIController from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/uis/base/SimpleUIController';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import GameFieldController from '../../../../controller/uis/game_field/GameFieldController';
import BossModeHPBarInfo from '../../../../model/uis/custom/bossmode/BossModeHPBarInfo';
import BossModeHPBarView from '../../../../view/uis/custom/bossmode/BossModeHPBarView';
import FreezeCapsuleFeatureController from '../../capsule_features/FreezeCapsuleFeatureController';

class BossModeHPBarController extends SimpleUIController
{
	updateBoss(aEnemy_e)
	{
		this._updateBoss(aEnemy_e);
	}

	initViewContainer(aViewContainerInfo)
	{
		this._fViewContainer = aViewContainerInfo.container;

		this._fViewContainer.addChild(this.view);
		this.view.zIndex = aViewContainerInfo.zIndex;
		this.view.setDefaultPosition();
	}

	constructor()
	{
		super(new BossModeHPBarInfo(), new BossModeHPBarView());
		this._fViewContainer = null;
	}

	__init()
	{
		super.__init();
	}

	__initControlLevel()
	{
		super.__initControlLevel();

		APP.currentWindow.gameFieldController.on(GameFieldController.EVENT_ON_ENEMY_HIT_ANIMATION, this._onEnemyHitAnimation, this);
		APP.currentWindow.gameFieldController.on(GameFieldController.EVENT_ON_NEW_BOSS_CREATED, this._onBossCreated, this);
		APP.currentWindow.gameFieldController.on(GameFieldController.EVENT_ON_BOSS_HP_BAR_DESTROYING, this._onDestroyHPBar, this);
		
		APP.currentWindow.freezeCapsuleFeatureController.on(FreezeCapsuleFeatureController.EVENT_ON_START_ACTIVATING_FEATURE, this._moveBarForFreezeTimer.bind(this, true), this);
		APP.currentWindow.freezeCapsuleFeatureController.on(FreezeCapsuleFeatureController.EVENT_ON_DEACTIVATE_FEATURE, this._moveBarForFreezeTimer.bind(this, false), this);
	}

	_onBossCreated(aEvent_obj)
	{
		let lGameField = APP.currentWindow.gameFieldController;
		let lEnemy_e = lGameField.getExistEnemy(aEvent_obj.enemyId);
		let lSkipAnimation_bl = aEvent_obj.isLasthandBossView;

		this.updateBoss(lEnemy_e);

		this._updateCurrentHealth(lEnemy_e.energy);
		this.view.showHPBar(lSkipAnimation_bl);
	}

	_onDestroyHPBar(aEvent_obj)
	{
		this.view.hideHPBar(aEvent_obj.skipAnimation);
	}

	_onEnemyHitAnimation(aEvent_obj)
	{
		let lInfo_bmhpbi = this.info;
		let lId_num = aEvent_obj.enemyId;

		if (lInfo_bmhpbi && lId_num == lInfo_bmhpbi.id)
		{
			let lNewEnergy_num = aEvent_obj.data.enemy.energy;
			if (lNewEnergy_num < lInfo_bmhpbi.currentHealth)
			{
				this._updateCurrentHealth(lNewEnergy_num, aEvent_obj.data.killed);
			}

			this._update();
		}
	}

	_updateCurrentHealth(aHealthValue_num, aIsKilled_bl)
	{
		let lInfo_bmhpbi = this.info;

		if (aHealthValue_num <= 0 && aIsKilled_bl)
		{
			lInfo_bmhpbi.currentHealth =  0;
		}
		else if ((aHealthValue_num / lInfo_bmhpbi.fullHealth).toFixed(10) <= lInfo_bmhpbi.rageHealthProgressValue)
		{
			lInfo_bmhpbi.currentHealth =  lInfo_bmhpbi.rageHealthValue;
		}
		else
		{
			lInfo_bmhpbi.currentHealth =  aHealthValue_num;
		}
	}

	_updateBoss(aEnemy_e)
	{
		let lInfo_bmhpbi = this.info;

		if (lInfo_bmhpbi)
		{
			lInfo_bmhpbi.fullHealth = aEnemy_e.fullEnergy;
			this._updateCurrentHealth(aEnemy_e.energy);

			lInfo_bmhpbi.name = aEnemy_e.name;
			lInfo_bmhpbi.id = aEnemy_e.id;
		}

		this._update();
	}

	_update()
	{
		let lView_bmhpbv = this.view;

		if (lView_bmhpbv)
		{
			lView_bmhpbv.update();
		}
	}

	_moveBarForFreezeTimer(aIsFrozen_bl)
	{
		if (!APP.isMobile)
		{
			this.view.i_moveBarForFreezeTimer(aIsFrozen_bl);
		}
	}

	destroy()
	{
		if (APP.currentWindow && APP.currentWindow.gameFieldController)
		{
			APP.currentWindow.gameFieldController.off(GameFieldController.EVENT_ON_ENEMY_HIT_ANIMATION, this._onEnemyHitAnimation, this);
		}

		super.destroy();
	}
}

export default BossModeHPBarController