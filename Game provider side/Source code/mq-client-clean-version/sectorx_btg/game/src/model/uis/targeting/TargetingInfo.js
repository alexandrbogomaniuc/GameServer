import SimpleUIInfo from '../../../../../../common/PIXI/src/dgphoenix/unified/model/uis/SimpleUIInfo';

class TargetingInfo extends SimpleUIInfo {

	constructor() {
		super();

		this._fTargetEnemyId_int = null;
		this._fIsPaused_bl = false;
		this._fIsLookingForATarget_bl = false;
		this._fIsCurrentTargetB3formation_bl = null;
		this._fIsCurrentTargetB3formationMainEnemyId_num = null;
		this._fRememberedTargetUntilInvulnerable_id = null;
		this._fRememberedUserSelectedStateUntilInvulnerable_bl = false;
	}

	i_resetTarget()
	{
		this.targetEnemyId = null;
	}

	set targetEnemyId(aTargetEnemyId_int)
	{
		this._fTargetEnemyId_int = aTargetEnemyId_int;
	}

	get targetEnemyId()
	{
		return this._fTargetEnemyId_int;
	}
	
	get isTargetEnemyDefined()
	{
		return this._fTargetEnemyId_int !== null;
	}

	get rememberedTargetUntilInvulnerable()
	{
		if(!this._fRememberedTargetUntilInvulnerable_id	|| this._fRememberedTargetUntilInvulnerable_id == this.targetEnemyId)
		{
			return null;
		}
		
		return this._fRememberedTargetUntilInvulnerable_id;
	}

	set rememberedTargetUntilInvulnerable(aValue)
	{
		this._fRememberedTargetUntilInvulnerable_id = aValue;
	}

	get rememberedUserSelectedStateUntilInvulnerable()
	{
		return this._fRememberedUserSelectedStateUntilInvulnerable_bl;
	}

	set rememberedUserSelectedStateUntilInvulnerable(value)
	{
		this._fRememberedUserSelectedStateUntilInvulnerable_bl = value;
	}

	get isActive()
	{
		return (this.isTargetEnemyDefined || this.lookingForATarget) && !this.isPaused;
	}

	get isActiveTargetPaused()
	{
		return (this.isTargetEnemyDefined || this.lookingForATarget) && this.isPaused;
	}

	set isPaused(aValue_bl)
	{
		this._fIsPaused_bl = aValue_bl;
	}

	get isPaused()
	{
		return this._fIsPaused_bl;
	}

	get lookingForATarget()
	{
		return this._fIsLookingForATarget_bl;
	}

	set lookingForATarget(aValue_bl)
	{
		this._fIsLookingForATarget_bl = aValue_bl;
	}

	get isCurrentTargetB3formation()
	{
		return this._fIsCurrentTargetB3formation_bl;
	}

	set isCurrentTargetB3formation(aValue)
	{
		this._fIsCurrentTargetB3formation_bl = aValue;
	}

	get isCurrentTargetB3formationMainEnemyId()
	{
		return this._fIsCurrentTargetB3formationMainEnemyId_num;
	}

	set isCurrentTargetB3formationMainEnemyId(aValue)
	{
		this._fIsCurrentTargetB3formationMainEnemyId_num = aValue;
	}

	destroy()
	{
		this._fTargetEnemyId_int = null;
		this._fIsPaused_bl = undefined;
		this._fIsCurrentTargetB3formation_bl = null;
		this._fIsCurrentTargetB3formationMainEnemyId_num = null;
		this._fRememberedTargetUntilInvulnerable_id = undefined;
		this._fRememberedUserSelectedStateUntilInvulnerable_bl = undefined;
		
		super.destroy();
	}
}

export default TargetingInfo