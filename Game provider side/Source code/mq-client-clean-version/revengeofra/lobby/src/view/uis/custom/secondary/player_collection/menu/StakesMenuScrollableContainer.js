import VerticalScrollableContainer from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/view/scroll/VerticalScrollableContainer';
import StakesMenuList from './StakesMenuList';

class StakesMenuScrollableContainer extends VerticalScrollableContainer
{
	constructor()
	{
		super();

		this._fMenuList_l = null;
	}

	set menuList(aList_l)
	{
		this._fMenuList_l = this.addChild(aList_l);
		this._fMenuList_l.on(StakesMenuList.EVENT_ON_ITEM_ADDED, this._onListUpdated, this);
		this._fMenuList_l.on(StakesMenuList.EVENT_ON_ITEM_MOVED, this._onListUpdated, this);
		this._fMenuList_l.on(StakesMenuList.EVENT_ON_ITEM_REMOVED, this._onListUpdated, this);
		this._fMenuList_l.on(StakesMenuList.EVENT_ON_CLEARED, this._onListUpdated, this);
	}

	_onListUpdated()
	{
		this.emit(StakesMenuScrollableContainer.EVENT_ON_CONTENT_UPDATED);
	}

	get measuredWidth()
	{
		return (this._fMenuList_l ? this._fMenuList_l.localBorders.width * this._fMenuList_l.scale.x : 0);
	}

	get measuredHeight()
	{
		return (this._fMenuList_l ? this._fMenuList_l.localBorders.height * this._fMenuList_l.scale.y : 0);
	}

	destroy()
	{
		this._fMenuList_l = undefined;

		super.destroy();
	}
}

export default StakesMenuScrollableContainer