import SimpleUIController from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/uis/base/SimpleUIController';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import GameField from '../../../main/GameField';
import GameScreen from '../../../main/GameScreen';
import EnemyIndicatorsInfo from '../../../model/uis/enemies/EnemyIndicatorsInfo';
import { ENEMY_TYPES } from '../../../../../shared/src/CommonConstants';

class EnemyIndicatorsController extends SimpleUIController
{
	static get EVENT_ON_ENERGY_UPDATED () { return 'EVENT_ON_ENERGY_UPDATED' }

	get visibility()
	{
		return this._fVisibility_bln;
	}

	constructor(aInfo_obj, aView_eiv)
	{
		super(new EnemyIndicatorsInfo(aInfo_obj), aView_eiv);
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
	}

	_onEnemyHitAnnimation(event)
	{
		let l_eii = this.info;

		let lId_num = event.enemyId;
		let lDamage_num = event.damage;

		if(lId_num == l_eii.id)
		{
			/*
			Cerberus enemy has 3 heads, each can receive excess damage when killed
			excess damage should not be applied to other heads
			*/
			if(this.info.typeId === ENEMY_TYPES.CERBERUS)
			{
				let lSingleHeadEnergy_num = this.info._fFullEnergy_num / 3;
				let lCurrentHeadEnergy_num = this.info._fEnergy_num;

				while(lCurrentHeadEnergy_num > lSingleHeadEnergy_num)
				{
					lCurrentHeadEnergy_num-= lSingleHeadEnergy_num;
				}

				let lPredictedRemainingHealth_num = lCurrentHeadEnergy_num - lDamage_num;

				if(lPredictedRemainingHealth_num < 0)
				{
					lDamage_num += lPredictedRemainingHealth_num;
				}
			}
		}
	}

	destroy()
	{
		APP.currentWindow.gameField.off(GameField.EVENT_ON_ENEMY_HIT_ANIMATION, this._onEnemyHitAnnimation, this);

		super.destroy();

		this._fVisibility_bln = null;
	}
}

export default EnemyIndicatorsController;