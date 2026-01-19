import BigWinCoinsAward from '../../../awarding/big_win/BigWinCoinsAward';
import AtlasSprite from '../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import AtlasConfig from '../../../../../config/AtlasConfig';
import { APP } from '../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';

class YouWinCoinsAward extends BigWinCoinsAward
{
	constructor(aTotalWin_num, aIsMasterWin_bl, aSeatId_int, aStartPos_pt, aEndPos_pt, lOrigPos_pt = null)
	{
		super(aTotalWin_num, aStartPos_pt, aEndPos_pt, lOrigPos_pt);

		this._fIsMasterWin_bl = aIsMasterWin_bl;
		this._fSeatId_int = aSeatId_int;
	}

	// override
	get _coinTextures()
	{
		if (!this._fIsMasterWin_bl)
		{
			return AtlasSprite.getFrames([APP.library.getAsset("common/silver_coin_spin")], AtlasConfig.SilverWinCoin, "");
		}
		
		return super._coinTextures;
	}

	// override
	get _targetSeatId()
	{
		return this._fSeatId_int;
	}

	_playCoinDropSoundSuspicion()
	{
		if (this._fIsMasterWin_bl)
		{
			super._playCoinDropSoundSuspicion();
		}
	}
	
	destroy()
	{
		this._fIsMasterWin_bl = undefined;

		super.destroy();
	}
}

export default YouWinCoinsAward;