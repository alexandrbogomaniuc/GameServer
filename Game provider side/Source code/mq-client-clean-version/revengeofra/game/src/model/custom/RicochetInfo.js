import SimpleInfo from '../../../../../common/PIXI/src/dgphoenix/unified/model/base/SimpleInfo';

class RicochetInfo extends SimpleInfo 
{
	constructor()
	{
		super();

		this._fExistingBullets_arr = [];
		this._fBulletsLimit_num = null;
		this._fMasterSeatId_num = null;
	}

	set masterSeatId(aVal_num)
	{
		this._fMasterSeatId_num = aVal_num;
	}

	set bulletsLimit(aVal_num)
	{
		this._fBulletsLimit_num = aVal_num;
	}

	get bulletsLimit()
	{
		return this._fBulletsLimit_num;
	}

	get isMasterBulletsLimitReached()
	{
		let masterSeatId = this._fMasterSeatId_num;
		let masterBullets = this.getBulletsBySeatId(masterSeatId);

		return masterBullets.length >= this.bulletsLimit;
	}

	get isAnyBulletExist()
	{
		return this._fExistingBullets_arr && this._fExistingBullets_arr.length > 0;
	}

	get existingBullets()
	{
		return this._fExistingBullets_arr;
	}

	get existingMasterBulletsCount()
	{
		let masterSeatId = this._fMasterSeatId_num;
		let masterBullets = this.getBulletsBySeatId(masterSeatId);

		return masterBullets.length;
	}

	addBullet(aBullet)
	{
		this._fExistingBullets_arr.push(aBullet);
	}

	getMasterBullets()
	{
		return this.getBulletsBySeatId(this._fMasterSeatId_num);
	}

	get activeMasterBulletsAmount()
	{
		let bullets = this.getMasterBullets();
		let actibeBulletsAmnt = 0;
		for (let bullet of bullets)
		{
			if (bullet.isActive) actibeBulletsAmnt ++;
		}
		return actibeBulletsAmnt;
	}

	getBulletsBySeatId(seatId)
	{
		let seatBullets = [];
		for (let i = 0; i < this._fExistingBullets_arr.length; ++i)
		{
			let bullet = this._fExistingBullets_arr[i];
			if (bullet.seatId == seatId)
			{
				seatBullets.push(bullet);
			}
		}

		return seatBullets;
	}

	getBulletByBulletId(bulletId)
	{
		for (let i = 0; i < this._fExistingBullets_arr.length; ++i)
		{
			let bullet = this._fExistingBullets_arr[i];
			if (bullet.bulletId == bulletId)
			{
				return bullet;
			}
		}

		return null;
	}

	removeBullet(aBullet)
	{
		let removedBullet = null;
		for (let i = 0; i < this._fExistingBullets_arr.length; ++i)
		{
			let curBullet = this._fExistingBullets_arr[i];
			if (curBullet === aBullet)
			{
				removedBullet = curBullet;
				this._fExistingBullets_arr.splice(i, 1);
				break;
			}
		}

		return removedBullet;
	}

	removeAllBullets()
	{
		this._fExistingBullets_arr = [];
	}

	removeBulletsBySeatId(seatId)
	{
		let removedBullets = [];
		for (let i = 0; i < this._fExistingBullets_arr.length; ++i)
		{
			let bullet = this._fExistingBullets_arr[i];
			if (bullet.seatId == seatId)
			{
				removedBullets.push(bullet);
				this._fExistingBullets_arr.splice(i, 1);
				--i;
			}
		}

		return removedBullets;
	}

	removeBulletByBulletId(bulletId)
	{
		let removedBullet = null;
		for (let i = 0; i < this._fExistingBullets_arr.length; ++i)
		{
			let bullet = this._fExistingBullets_arr[i];
			if (bullet.bulletId == bulletId)
			{
				removedBullet = bullet;
				this._fExistingBullets_arr.splice(i, 1);
				break;
			}
		}

		return removedBullet;
	}

	destroy()
	{
		super.destroy();

		this._fExistingBullets_arr = null;
		this._fBulletsLimit_num = null;
		this._fMasterSeatId_num = null;
	}
}

export default RicochetInfo;