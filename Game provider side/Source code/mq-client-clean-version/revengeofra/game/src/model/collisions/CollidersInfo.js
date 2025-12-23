import SimpleInfo from '../../../../../common/PIXI/src/dgphoenix/unified/model/base/SimpleInfo'

class CollidersInfo extends SimpleInfo
{
	constructor() 
	{
		super();

		this._enemiesColliders = [];
		this._bulletsColliders = [];
	}

	get enemiesColliders()
	{
		return this._enemiesColliders;
	}

	get bulletsColliders()
	{
		return this._bulletsColliders;
	}

	addEnemyCollider(aCollider)
	{
		this._enemiesColliders = this._enemiesColliders || [];

		this._enemiesColliders.push(aCollider);
	}

	addBulletCollider(aCollider)
	{
		this._bulletsColliders = this._bulletsColliders || [];

		this._bulletsColliders.push(aCollider);
	}

	removeCollider(aCollider)
	{
		let lColliderIndex = this._enemiesColliders.indexOf(aCollider);
		if (lColliderIndex >= 0)
		{
			this._enemiesColliders.splice(lColliderIndex, 1);
		}
		else
		{
			lColliderIndex = this._bulletsColliders.indexOf(aCollider);
			if (lColliderIndex >= 0)
			{
				this._bulletsColliders.splice(lColliderIndex, 1);
			}
		}
		
	}

	removeAllColliders()
	{
		while (this._enemiesColliders && this._enemiesColliders.length)
		{
			this._enemiesColliders.pop().destroy();
		}

		while (this._bulletsColliders && this._bulletsColliders.length)
		{
			this._bulletsColliders.pop().destroy();
		}
	}

	destroy()
	{
		this.removeAllColliders();

		this._enemiesColliders = null;
		this._bulletsColliders = null;

		super.destroy();
	}
}

export default CollidersInfo