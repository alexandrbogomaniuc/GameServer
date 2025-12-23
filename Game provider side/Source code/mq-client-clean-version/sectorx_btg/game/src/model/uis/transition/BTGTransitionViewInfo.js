import TransitionViewInfo from './TransitionViewInfo';

class BTGTransitionViewInfo extends TransitionViewInfo
{
	constructor()
	{
		super();

		this._fIsBattlegroundCountDownDialogActivated_bl = null;
		this._fIsBattlegroundNoWeaponsFiredDialogExpected_bl = null;
		this._fisBattlegroundRoundResultExpected_bl = null;

		this._fStateId_int = null;
	}

	get isBattlegroundCountDownDialogActivated()
	{
		return this._fIsBattlegroundCountDownDialogActivated_bl;
	}

	set isBattlegroundCountDownDialogActivated(aVal_bl)
	{
		this._fIsBattlegroundCountDownDialogActivated_bl = aVal_bl;
	}

	get isBattlegroundNoWeaponsFiredDialogExpected()
	{
		return this._fIsBattlegroundNoWeaponsFiredDialogExpected_bl;
	}

	set isBattlegroundNoWeaponsFiredDialogExpected(aVal_bl)
	{
		this._fIsBattlegroundNoWeaponsFiredDialogExpected_bl = aVal_bl;
	}

	get isBattlegroundRoundResultExpected()
	{
		return this._fisBattlegroundRoundResultExpected_bl;
	}

	set isBattlegroundRoundResultExpected(aVal_bl)
	{
		this._fisBattlegroundRoundResultExpected_bl = aVal_bl;
	}

	destroy()
	{
		this._fIsBattlegroundCountDownDialogActivated_bl = null;
		this._fIsBattlegroundNoWeaponsFiredDialogExpected_bl = null;
		this._fisBattlegroundRoundResultExpected_bl = null;

		this._fStateId_int = null;

		super.destroy();
	}
}

export default BTGTransitionViewInfo;