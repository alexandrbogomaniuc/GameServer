import SimpleInfo from '../../../../../common/PIXI/src/dgphoenix/unified/model/base/SimpleInfo';

const MAXIMUM_CEILING_DUST_ANIMATIONS_NUMBER = 0;

class GameOptimizationInfo extends SimpleInfo {
	constructor()
	{
		super();

		this._fCeilingDustAnimationsNumber_int = 0;
		this._fGrenadeExplosionsNumber_int = 0;
		this._fFlameThrowerHitExplosionsNumber_int = 0;
		this._fRailgunHitExplosionsNumber_int = 0;

		this._fCurrentShotsAmount_int = 0;
		this._fCurrentAwardAnimationsAmount_int = 0;
		this._fCurrentTreasuresAnimationsAmount_int = 0;

		this._fMiniSlot_num = 0;
	}

	get currentCeilingDustAnimationsNumber()
	{
		return this._fCeilingDustAnimationsNumber_int;
	}

	i_increaseCeilingDustAnimationsNumber()
	{
		this._fCeilingDustAnimationsNumber_int++;
	}

	i_decreaseCeilingDustAnimationsNumber()
	{
		this._fCeilingDustAnimationsNumber_int > 0 && this._fCeilingDustAnimationsNumber_int--;
	}

	//grenade...
	i_increaseGrenadeExplosionsNumber()
	{
		this._fGrenadeExplosionsNumber_int++;
	}

	i_decreaseGrenadeExplosionsNumber()
	{
		this._fGrenadeExplosionsNumber_int > 0 && this._fGrenadeExplosionsNumber_int--;
	}

	get currentGrenadeExplosionsNumber()
	{
		return this._fGrenadeExplosionsNumber_int;
	}
	//...drenade

	//flamethrower...
	i_increaseFlameThrowerHitExplosionsNumber()
	{
		this._fFlameThrowerHitExplosionsNumber_int++;
	}

	i_decreaseFlameThrowerHitExplosionsNumber()
	{
		this._fFlameThrowerHitExplosionsNumber_int > 0 && this._fFlameThrowerHitExplosionsNumber_int--;
	}

	get currentFlameThrowerHitExplosionsNumber()
	{
		return this._fFlameThrowerHitExplosionsNumber_int;
	}
	//...flamethrower

	//railgun...
	i_increaseRailgunHitExplosionsNumber()
	{
		this._fRailgunHitExplosionsNumber_int++;
	}

	i_decreaseRailgunHitExplosionsNumber()
	{
		this._fRailgunHitExplosionsNumber_int > 0 && this._fRailgunHitExplosionsNumber_int--;
	}

	get currentRailgunHitExplosionsNumber()
	{
		return this._fRailgunHitExplosionsNumber_int;
	}
	//...railgun

	i_isCeilingDustMaximumExceed()
	{
		return this.currentCeilingDustAnimationsNumber >= MAXIMUM_CEILING_DUST_ANIMATIONS_NUMBER;
	}

	//current shots...
	i_increaseCurrentShotsAmount()
	{
		this._fCurrentShotsAmount_int++;
	}

	i_decreaseCurrentShotsAmount()
	{
		this._fCurrentShotsAmount_int > 0 && this._fCurrentShotsAmount_int--;
	}

	get currentShotsAmount()
	{
		return this._fCurrentShotsAmount_int;
	}
	//...current shots

	//current awards...
	i_increaseCurrentAwardsAmount()
	{
		this._fCurrentAwardAnimationsAmount_int++;
	}

	i_decreaseCurrentAwardsAmount()
	{
		this._fCurrentAwardAnimationsAmount_int > 0 && this._fCurrentAwardAnimationsAmount_int--;
	}

	i_resetCurrentAwardsAmount()
	{
		this._fCurrentAwardAnimationsAmount_int = 0;
	}

	get currentAwardsAmount()
	{
		return this._fCurrentAwardAnimationsAmount_int;
	}
	//...current awards

	//treasures...
	i_increaseCurrentTreasuresAmount()
	{
		this._fCurrentTreasuresAnimationsAmount_int++;
	}

	i_decreaseCurrentTreasuresAmount()
	{
		this._fCurrentTreasuresAnimationsAmount_int > 0 && this._fCurrentTreasuresAnimationsAmount_int--;
	}

	i_resetCurrentTreasuresAmount()
	{
		this._fCurrentTreasuresAnimationsAmount_int = 0;
	}

	get currentTreasuresAnimationsAmount()
	{
		return this._fCurrentTreasuresAnimationsAmount_int;
	}
	//...treasures

	//mini slot...
	i_increaseCurrentMiniSlotFeatureAmount()
	{
		this._fMiniSlot_num++;
	}

	i_decreaseCurrentMiniSlotFeatureAmount()
	{
		this._fMiniSlot_num > 0 && this._fMiniSlot_num--;
	}

	get currentMiniSlotAmount()
	{
		return this._fMiniSlot_num;
	}
	//...mini slot

	i_clearAll()
	{
		this._fCeilingDustAnimationsNumber_int = 0;
		this._fGrenadeExplosionsNumber_int = 0;
		this._fFlameThrowerHitExplosionsNumber_int = 0;
		this._fRailgunHitExplosionsNumber_int = 0;

		this._fCurrentShotsAmount_int = 0;
		this._fCurrentAwardAnimationsAmount_int = 0;
		this._fCurrentTreasuresAnimationsAmount_int = 0;

		this._fMiniSlot_num = 0;
	}
}

export default GameOptimizationInfo;