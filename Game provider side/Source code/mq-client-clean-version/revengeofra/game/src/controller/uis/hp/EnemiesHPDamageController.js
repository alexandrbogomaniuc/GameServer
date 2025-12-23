import SimpleUIController from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/uis/base/SimpleUIController';
import SimpleUIInfo from '../../../../../../common/PIXI/src/dgphoenix/unified/model/uis/SimpleUIInfo';
import EnemiesHPDamageView from '../../../view/uis/hp/EnemiesHPDamageView';
import GameScreen from '../../../main/GameScreen';
import GameField from '../../../main/GameField';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';

class EnemiesHPDamageController extends SimpleUIController
{
	get hpDamageContainerInfo()
	{
		return this._gameScreen.gameField.hpDamageContainerInfo;
	}

	constructor()
	{
		super(new SimpleUIInfo(), new EnemiesHPDamageView());

		this._gameScreen = null;
	}

	__initControlLevel()
	{
		super.__initControlLevel();

		this._gameScreen = APP.gameScreen;

		this._gameScreen.once(GameScreen.EVENT_ON_READY, this._onGameScreenReady, this);
		this._gameScreen.on(GameScreen.EVENT_ON_CLOSE_ROOM, this._onCloseRoom, this);
		this._gameScreen.on(GameScreen.EVENT_ON_GAME_FIELD_CLEARED, this._onGameFieldCleared, this);
	}

	__initViewLevel()
	{
		super.__initViewLevel();
	}

	_onGameScreenReady(event)
	{
		this._gameField = this._gameScreen.gameField;

		this._gameField.on(GameField.EVENT_ON_ENEMY_ENERGY_UPDATED, this._onEnemyEnergyUpdated, this);
	}

	_onEnemyEnergyUpdated(event)
	{
		let targetEnemy = event.target;
		let damage = event.damage;

		if (!targetEnemy || isNaN(damage) || !this._gameScreen.healthBarEnabled || damage == 0)
		{
			return;
		}

		let enemyIndicatorsController = targetEnemy.enemyIndicatorsController;

		if (enemyIndicatorsController.info.isHPBarDisabled)
		{
			return;
		}

		this.view.addToContainerIfRequired(this.hpDamageContainerInfo);

		let targetPos = enemyIndicatorsController.view.hpBarGlobalPos;
		this.view.showHPDamageAnimation(damage, targetPos);
	}

	_onCloseRoom(event)
	{
		this.view && this.view.interruptAnimations();
	}

	_onGameFieldCleared(event)
	{
		this.view && this.view.interruptAnimations();
	}

	destroy()
	{
		this._gameScreen.off(GameScreen.EVENT_ON_CLOSE_ROOM, this._onCloseRoom, this);
		this._gameScreen.off(GameScreen.EVENT_ON_GAME_FIELD_CLEARED, this._onGameFieldCleared, this);
		this._gameScreen = null;

		this._gameField && this._gameField.off(GameField.EVENT_ON_ENEMY_ENERGY_UPDATED, this._onEnemyEnergyUpdated, this);
		this._gameField = null;

		super.destroy();
	}

}

export default EnemiesHPDamageController
