import ColliderInfo from './ColliderInfo';
import {Utils} from '../../../../../common/PIXI/src/dgphoenix/unified/model/Utils'

class EnemyColliderInfo extends ColliderInfo
{
	constructor(aEnemyId_num, aOptColliderComponentsDescr=undefined, aIsEverywhereCollisionAllowed_bl = false)
	{
		super(aOptColliderComponentsDescr);

		this._fEnemyId_num = aEnemyId_num;
		this._fIsEverywhereCollisionAllowed_bl = aIsEverywhereCollisionAllowed_bl;
	}

	get enemyId()
	{
		return this._fEnemyId_num;
	}

	get isEverywhereCollisionAllowed()
	{
		return this._fIsEverywhereCollisionAllowed_bl;
	}
}

export default EnemyColliderInfo