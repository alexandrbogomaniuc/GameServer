import SimpleUIController from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/uis/base/SimpleUIController';
import GameWebSocketInteractionController from '../../interaction/server/GameWebSocketInteractionController';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import GameField from '../../../main/GameField';
import GameScreen from '../../../main/GameScreen';

import EnemyIndicatorsInfo from '../../../model/uis/enemies/EnemyIndicatorsInfo';
import EnemyIndicatorsView from '../../../view/uis/enemies/EnemyIndicatorsView';

class EnemyIndicatorsController extends SimpleUIController
{
	static get EVENT_ON_ENERGY_UPDATED () { return 'EVENT_ON_ENERGY_UPDATED' }

	get visibility()
	{
		return this._fVisibility_bln;
	}

	hideHPBar()
	{
		this._hideHPBar();
	}

	showHpBar()
	{
		this._showHpBar();
	}

	disableHPBar()
	{
		this._disableHPBar();
	}

	constructor(aInfo_obj)
	{
		super(new EnemyIndicatorsInfo(aInfo_obj), new EnemyIndicatorsView);
	}

	__init()
	{
		super.__init();
	}

	__initControlLevel()
	{
		super.__initControlLevel();

		if (!APP.gameScreen.healthBarEnabled)
		{
			this._fVisibility_bln = false;
		}
		else
		{
			this._fVisibility_bln = true;
		}

		APP.currentWindow.gameField.on(GameField.EVENT_ON_ENEMY_HIT_ANIMATION, this._onEnemyHitAnnimation, this);
		APP.gameScreen.on(GameScreen.EVENT_ON_HEALTH_BAR_STATE_UPDATED, this._onHPBarVisibilityChange, this);
	}

	_onEnemyHitAnnimation(event)
	{
		let l_eii = this.info;

		let lId_num = event.enemyId;
		let lDamage_num = event.damage;

		if(lId_num == l_eii.id)
		{
			this.view.updateHp(lDamage_num);
			this.view.updateHpBar();
			this.info.energy = this.info.energy - lDamage_num;
			this.emit(EnemyIndicatorsController.EVENT_ON_ENERGY_UPDATED, { energy: this.info.energy, damage: lDamage_num });
		}
	}

	_showHpBar()
	{
		this.view.showHPBar();
	}

	_hideHPBar()
	{
		this.view.hideHPBar();
	}

	_disableHPBar()
	{
		this._fVisibility_bln = false;
		this.info.disableHPBar();
		this.view.disableHPBar();
	}

	_onHPBarVisibilityChange(event)
	{
		if(event.value)
		{
			this._fVisibility_bln = true;
			this.view.showHPBar();
		}
		else
		{
			this._fVisibility_bln = false;
			this.view.hideHPBar();
		}
	}

	destroy()
	{
		APP.currentWindow.gameField.off(GameField.EVENT_ON_ENEMY_HIT_ANIMATION, this._onEnemyHitAnnimation, this);
		APP.gameScreen.off(GameScreen.EVENT_ON_HEALTH_BAR_STATE_UPDATED, this._onHPBarVisibilityChange, this);

		super.destroy();

		this._fVisibility_bln = null;
	}
}

export default EnemyIndicatorsController;