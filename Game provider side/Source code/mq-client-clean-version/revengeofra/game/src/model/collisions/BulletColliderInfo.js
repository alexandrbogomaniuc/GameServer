import ColliderInfo from './ColliderInfo';
import {Utils} from '../../../../../common/PIXI/src/dgphoenix/unified/model/Utils'

class BulletColliderInfo extends ColliderInfo
{
	constructor(aBulletId_str, aOptColliderComponentsDescr=undefined)
	{
		super(aOptColliderComponentsDescr);

		this._fBulletId_str = aBulletId_str;
		this._fAngle_num = 0;
	}

	get bulletId()
	{
		return this._fBulletId_str;
	}

	get currentAngle()
	{
		return this._fAngle_num;
	}

	applyCollider(aComponentsDescr, aCurBulletAngle, aBulletScale_num)
	{
		let lComponentsDescr = aComponentsDescr.slice();
		this._fAngle_num = aCurBulletAngle;

		if (aBulletScale_num > 1)
		{
			lComponentsDescr = this._extendColliderComponents(lComponentsDescr, aBulletScale_num);
		}

		for (let i=0; i<lComponentsDescr.length; i++)
		{
			let lComponentDescr = Object.assign({}, lComponentsDescr[i]);
			lComponentsDescr[i] = lComponentDescr;
			
			let r = Utils.getDistance({x:0, y:0}, {x: lComponentDescr.centerX, y: lComponentDescr.centerY});
			let lPointAngle_num = Utils.getAngle({x:0, y:0}, {x: lComponentDescr.centerX, y: lComponentDescr.centerY}) + aCurBulletAngle;
			let dx = r*Math.cos(-lPointAngle_num)
			let dy = r*Math.sin(-lPointAngle_num)

			lComponentDescr.centerX = dx;
			lComponentDescr.centerY = dy;
		}

		this._parseComponentsDescriptor(lComponentsDescr);
	}

	_extendColliderComponents(aComponentsDescr, aBulletScale_num)
	{
		if (!aComponentsDescr || !aComponentsDescr.length)
		{
			return aComponentsDescr
		}

		let topComponent = aComponentsDescr[0];
		let bottomComponent = aComponentsDescr[0];

		for (let i=1; i<aComponentsDescr.length; i++)
		{
			let curComponent = aComponentsDescr[i];
			if ((curComponent.centerY - curComponent.radius) < (topComponent.centerY - topComponent.radius))
			{
				topComponent = curComponent;
			}

			if ((curComponent.centerY + curComponent.radius) > (bottomComponent.centerY + bottomComponent.radius))
			{
				bottomComponent = curComponent;
			}
		}

		let topExtraComponent = Object.assign({}, topComponent);
		let bottomExtraComponent = Object.assign({}, bottomComponent);

		let topY = topExtraComponent.centerY - topExtraComponent.radius;
		let bottomY = bottomExtraComponent.centerY + bottomExtraComponent.radius;
		
		let hh = Math.abs(bottomY - topY);

		let dif = hh*aBulletScale_num - hh;

		topExtraComponent.centerY -= dif/2;
		bottomExtraComponent.centerY += dif/2;

		aComponentsDescr.push(topExtraComponent);
		aComponentsDescr.push(bottomExtraComponent);

		return aComponentsDescr;
	}

	destroy()
	{
		this._fAngle_num = undefined;
		this._fBulletId_str = undefined;

		super.destroy();
	}
}

export default BulletColliderInfo