import SimpleUIInfo from '../../../../../../common/PIXI/src/dgphoenix/unified/model/uis/SimpleUIInfo'

export const MAX_FRAGMENTS_AMOUNT = 8;

class FragmentsPanelInfo extends SimpleUIInfo
{
	constructor()
	{
		super();

		this._fCollectedFragmentsAmount_int = 0;
		this._fLastLandedFragmentId_num = undefined;
		this._fIsNeedHidePanel_bl= null;
		this._fIsHourglassShowed_bl= null;
		this._fIsHidePanelOnRoundResultExpected_bl = null;
	}

	updateFragmentsAmount(aCollectedFragmentsAmount_int)
	{
		this._fCollectedFragmentsAmount_int = aCollectedFragmentsAmount_int || 0;
	}

	resetCollectedTreasures()	
	{
		this._fCollectedFragmentsAmount_int = 0;
	}

	increaseFragmentsAmount()
	{
		if (this._fCollectedFragmentsAmount_int === MAX_FRAGMENTS_AMOUNT)
		{
			throw new Error("Fragments panel info: cannot exceed max items amount.");
		}
		else
		{
			this._fCollectedFragmentsAmount_int += 1;
		}
	}

	

	get isHidePanelOnRoundResultExpected()
	{
		return this._fIsHidePanelOnRoundResultExpected_bl;
	}

	set isHidePanelOnRoundResultExpected(fragmentId)
	{
		this._fIsHidePanelOnRoundResultExpected_bl = fragmentId;
	}

	get isNeedHidePanel()
	{
		return this._fIsNeedHidePanel_bl;
	}

	set isNeedHidePanel(fragmentId)
	{
		this._fIsNeedHidePanel_bl = fragmentId;
	}

	get isHourglassShowed()
	{
		return this._fIsHourglassShowed_bl;
	}

	set isHourglassShowed(fragmentId)
	{
		this._fIsHourglassShowed_bl = fragmentId;
	}

	get fragmentsAmount()
	{
		return this._fCollectedFragmentsAmount_int;
	}

	set lastLandedFragment(fragmentId)
	{
		this._fLastLandedFragmentId_num = fragmentId;
	}

	get lastLandedFragment()
	{
		return this._fLastLandedFragmentId_num;
	}

	destroy()
	{
		super.destroy();

		this._fCollectedFragmentsAmount_int = undefined;
		this._fLastLandedFragmentId_num = undefined;
		this._fIsNeedHidePanel_bl= null;
		this._fIsHourglassShowed_bl= null;
		this._fIsHidePanelOnRoundResultExpected_bl = null;
	}
}

export default FragmentsPanelInfo