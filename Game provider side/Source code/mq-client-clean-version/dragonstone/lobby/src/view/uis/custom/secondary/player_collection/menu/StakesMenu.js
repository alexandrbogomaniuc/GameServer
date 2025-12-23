import Sprite from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import VerticalSlider from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/view/slider/VerticalSlider';
import StakesMenuList from './StakesMenuList';
import StakesMenuScrollableContainer from './StakesMenuScrollableContainer';
import VerticalScrollBar from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/view/scroll/VerticalScrollBar';

class StakesMenu extends Sprite
{
	static get EVENT_ON_SELECTED_ITEM_CHANGED()		{ return "onSelectedItemChanged"; }

	updateStakes(aStakes_arr)
	{
		this._updateStakes(aStakes_arr);
	}

	setStake(aStake_num)
	{
		this._setStake(aStake_num);
	}

	enableScroll()
	{
		this._enableScroll();
	}

	disableScroll()
	{
		this._disableScroll();
	}

	onShow()
	{
		this._moveToSelectedStake();
	}

	constructor()
	{
		super();

		this._fMenuSlider_vs = null;
		this._fStakesMenuList_ml = null;
		this._fStakesMenuScrollBar_vsb = null;
		this._fCurrentStake_num = null;
		this._fStakes_arr = null;

		this._init();
	}

	_init()
	{
		this._initSlider();
		this._initList();
	}

	_initSlider()
	{
		let lScrollBack_grphc = new PIXI.Graphics();
		lScrollBack_grphc.beginFill(0x262626).drawRoundedRect(-2.5, -84, 5, 168 + 40, 2).endFill();

		let lScrollThumb_grphc = new PIXI.Graphics();
		lScrollThumb_grphc.beginFill(0x5c5c5c).drawRoundedRect(-2.5, -38, 5, 76 + 40, 2).endFill();

		this._fMenuSlider_vs = new VerticalSlider(lScrollBack_grphc, lScrollThumb_grphc, undefined, undefined, 0, null, false);
		this._fMenuSlider_vs.scrollMultiplier = 18;
		this._fMenuSlider_vs.position.set(92, 10);
		this.addChild(this._fMenuSlider_vs);
	}

	_initList()
	{
		this._fStakesMenuList_ml = new StakesMenuList();
		this._fStakesMenuList_ml.on(StakesMenuList.EVENT_ON_ITEM_SELECTED, this._onMenuItemSelected, this);

		let lScrollableContainer_msc = new StakesMenuScrollableContainer();
		lScrollableContainer_msc.menuList = this._fStakesMenuList_ml;
		lScrollableContainer_msc.position.set(0, -59);

		this._fStakesMenuScrollBar_vsb = this.addChild(new VerticalScrollBar());
		this._fStakesMenuScrollBar_vsb.position.set(0, 0);
		this._fStakesMenuScrollBar_vsb.visibleArea = new PIXI.Rectangle(-74, -74, 148, 171 + 40);
		this._fStakesMenuScrollBar_vsb.hitArea = new PIXI.Rectangle(-74, -74, 170, 171 + 40);
		this._fStakesMenuScrollBar_vsb.slider = this._fMenuSlider_vs;
		this._fStakesMenuScrollBar_vsb.scrollableContainer = lScrollableContainer_msc;

		this._fStakesMenuScrollBar_vsb.addChild(lScrollableContainer_msc);
	}

	_setStake(aStake_num)
	{
		if (!this._fStakes_arr) return;
		let lIndexOfStake_num = this._fStakes_arr.indexOf(aStake_num);
		if (lIndexOfStake_num == -1) return;

		this._fCurrentStake_num = aStake_num;
		this._fStakesMenuList_ml.setItemSelectedByStake(aStake_num);
		this._moveToSelectedStake();
	}

	_onMenuItemSelected(aEvent_obj)
	{
		this._fCurrentStake_num = aEvent_obj.stake;
		this.emit(StakesMenu.EVENT_ON_SELECTED_ITEM_CHANGED, {stake: aEvent_obj.stake});
	}

	_updateStakes(aStakes_arr)
	{
		this._fStakes_arr = aStakes_arr;
		this._fStakesMenuList_ml.data = aStakes_arr;
	}

	_moveToSelectedStake()
	{
		let lIndexOfStake_num = this._fStakes_arr.indexOf(this._fCurrentStake_num);
		if (lIndexOfStake_num == -1) lIndexOfStake_num = 0;

		let lMoveTo_num = lIndexOfStake_num*35 - 87;
		lMoveTo_num = Math.max(lMoveTo_num, 0);
		lMoveTo_num = Math.min(lMoveTo_num, this._fStakesMenuScrollBar_vsb.scrollableContainer.measuredHeight - (171 + 40));

		lMoveTo_num = Math.max(lMoveTo_num, 0);

		this._fMenuSlider_vs.moveTo(lMoveTo_num);
		this._fStakesMenuScrollBar_vsb.scrollableContainer.moveTo(lMoveTo_num);
	}

	_enableScroll()
	{
		this._fStakesMenuScrollBar_vsb && this._fStakesMenuScrollBar_vsb.enableScroll();
	}

	_disableScroll()
	{
		this._fStakesMenuScrollBar_vsb && this._fStakesMenuScrollBar_vsb.disableScroll();
	}

	destroy()
	{
		super.destroy();

		this._fMenuSlider_vs = undefined;
		this._fStakesMenuList_ml = undefined;
		this._fStakesMenuScrollBar_vsb = undefined;
		this._fCurrentStake_num = undefined;
		this._fStakes_arr = undefined;
	}
}

export default StakesMenu