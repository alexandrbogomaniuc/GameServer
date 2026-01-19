import StakesMenuItem from './StakesMenuItem';
import {List} from '../list/List';

class StakesMenuList extends List
{
	static get EVENT_ON_ITEM_SELECTED()		{ return "onListItemSelected"; }

	setItemSelectedByIndex(aIndex_num)
	{
		if (this._items[aIndex_num] != null)
		{
			this._setSelected(aIndex_num);
		}
	}

	setItemSelectedByStake(aStake_num)
	{
		let lIndex_num = -1;
		for (let i = 0; i < this._items.length; ++i)
		{
			if (this._items[i].stake == aStake_num)
			{
				lIndex_num = i;
				break;
			}
		}

		if (lIndex_num != -1)
		{
			this._setSelected(lIndex_num);
		}
	}

	constructor()
	{
		super();

		this._fCurrentSelectedItemIndex_num = null;
	}

	_generateNewItemInstance(aStake_num)
	{
		let lMenuItem_qmi = new StakesMenuItem(this._itemHitArea, aStake_num);
		lMenuItem_qmi.on(StakesMenuItem.EVENT_ON_ITEM_SELECTED, this._onItemSelected, this);
		lMenuItem_qmi.on("pointerclick", this._onItemClicked, this);

		return lMenuItem_qmi;
	}

	_setSelected(aId_num)
	{
		this._fCurrentSelectedItemIndex_num = aId_num;

		for (let item of this._items)
		{
			item.setDeselected();
		}

		this._items[aId_num].setSelected();
	}

	_onItemSelected(aEvent_obj)
	{
		let lItemIndex_num = this._items.indexOf(aEvent_obj.target);
		this.emit(StakesMenuList.EVENT_ON_ITEM_SELECTED, {id: lItemIndex_num, stake: this._items[lItemIndex_num].stake});
	}

	_onItemClicked(aEvent_obj)
	{
		let lItemIndex_num = this._items.indexOf(aEvent_obj.target);

		if (this._fCurrentSelectedItemIndex_num == lItemIndex_num) return;

		this._setSelected(lItemIndex_num);
	}

	get _itemsDistance()
	{
		return 5;
	}

	get _itemHitArea()
	{
		return new PIXI.Rectangle(-73, -15, 146, 30);
	}

	destroy()
	{
		super.destroy();

		this._fCurrentSelectedItemIndex_num = undefined;
	}
}

export  default StakesMenuList