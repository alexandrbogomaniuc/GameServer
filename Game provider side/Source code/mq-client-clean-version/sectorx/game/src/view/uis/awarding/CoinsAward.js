import BaseAward from './BaseAward';
import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import Timer from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import * as Easing from '../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import WinPayout from '../../../ui/WinPayout';
import SilverWinPayout from '../../../ui/SilverWinPayout';
import WinTierUtil from '../../../main/WinTierUtil';
import AtlasConfig from '../../../config/AtlasConfig';
import AtlasSprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import { ENEMIES, ENEMY_TYPES, FRAME_RATE } from '../../../../../shared/src/CommonConstants';
import BombController from '../../../controller/uis/quests/BombController';
import GameFieldController from '../../../controller/uis/game_field/GameFieldController';
import { Utils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import CriticalHitAnimation from '../custom/critical_hit/CriticalHitAnimation';

let particles_spread_textures = null;
function generate_particles_textures()
{
	if (!particles_spread_textures)
	{
		particles_spread_textures = AtlasSprite.getFrames([APP.library.getAsset("common/particles")], [AtlasConfig.Particles], "")
	}

	return particles_spread_textures;
}

const COIN_FLY_DURATION = 9 * FRAME_RATE;

export const COINS_ANIMATIONS_PARAMS = [
	{ id: 2, startFrame: 1, x: 19, y: -308 },
	{ id: 3, startFrame: 2, x: -33, y: -285 },
	{ id: 1, startFrame: 0, x: 54, y: -207 },
	{ id: 4, startFrame: 3, x: -56, y: -240 },
	{ id: 5, startFrame: 4, x: -84, y: -265 },
	{ id: 6, startFrame: 2, x: 4, y: -232 },
	{ id: 7, startFrame: 0, x: -8, y: -215 },
	{ id: 8, startFrame: 2, x: -63, y: -205 },
	{ id: 9, startFrame: 1, x: -95, y: -152 },
	{ id: 10, startFrame: 4, x: 88, y: -260 },
	{ id: 11, startFrame: 2, x: 92, y: -193 },
	{ id: 12, startFrame: 0, x: 89, y: -178 },
	{ id: 13, startFrame: 2, x: 23, y: -170 },
	{ id: 14, startFrame: 1, x: -6, y: -144 },
	{ id: 15, startFrame: 4, x: 171, y: -245 },
	{ id: 16, startFrame: 1, x: 109, y: -308 },
	{ id: 17, startFrame: 2, x: -83, y: -285 },
	{ id: 18, startFrame: 0, x: 144, y: -207 },
	{ id: 19, startFrame: 3, x: -106, y: -240 },
	{ id: 20, startFrame: 4, x: -34, y: -265 },
	{ id: 21, startFrame: 2, x: -86, y: -232 },
	{ id: 22, startFrame: 0, x: 42, y: -215 },
	{ id: 23, startFrame: 2, x: -133, y: -205 },
	{ id: 24, startFrame: 1, x: -15, y: -152 },
	{ id: 25, startFrame: 4, x: 28, y: -260 },
	{ id: 26, startFrame: 2, x: 182, y: -193 },
	{ id: 27, startFrame: 0, x: 59, y: -178 },
	{ id: 28, startFrame: 2, x: 73, y: -170 },
	{ id: 29, startFrame: 1, x: -96, y: -144 },
	{ id: 30, startFrame: 4, x: 221, y: -245 },
	{ id: 31, startFrame: 4, x: -144, y: -205 },
	{ id: 32, startFrame: 2, x: 64, y: -172 },
	{ id: 33, startFrame: 0, x: -98, y: -155 },
	{ id: 34, startFrame: 2, x: 7, y: -155 },
	{ id: 35, startFrame: 1, x: -145, y: -112 },
	{ id: 36, startFrame: 4, x: 178, y: -310 },
	{ id: 37, startFrame: 2, x: 52, y: -223 },
	{ id: 38, startFrame: 0, x: 139, y: -228 },
	{ id: 39, startFrame: 2, x: -47, y: -230 },
	{ id: 40, startFrame: 1, x: 84, y: -194 },
];

// { id: 2, startFrame: 1, x: 19, y: -308 },
// { id: 3, startFrame: 2, x: -33, y: -285 },
// { id: 1, startFrame: 0, x: 54, y: -207 },
// { id: 4, startFrame: 3, x: -56, y: -240 },
// { id: 5, startFrame: 4, x: -84, y: -265 },
// { id: 6, startFrame: 2, x: 4, y: -232 },
// { id: 7, startFrame: 0, x: -8, y: -215 },
// { id: 8, startFrame: 2, x: -63, y: -205 },
// { id: 9, startFrame: 1, x: -95, y: -152 },
// { id: 10, startFrame: 4, x: 88, y: -260 },
// { id: 11, startFrame: 2, x: 92, y: -193 },
// { id: 12, startFrame: 0, x: 89, y: -178 },
// { id: 13, startFrame: 2, x: 23, y: -170 },
// { id: 14, startFrame: 1, x: -6, y: -144 },
// { id: 15, startFrame: 4, x: 171, y: -245 },
// { id: 16, startFrame: 1, x: 19 + 90, y: -308 },
// { id: 17, startFrame: 2, x: -33 - 50, y: -285 },
// { id: 18, startFrame: 0, x: 54 + 90, y: -207 },
// { id: 19, startFrame: 3, x: -56 - 50, y: -240 },
// { id: 20, startFrame: 4, x: -84 + 50, y: -265 },
// { id: 21, startFrame: 2, x: 4 - 90, y: -232 },
// { id: 22, startFrame: 0, x: -8 + 50, y: -215 },
// { id: 23, startFrame: 2, x: -63 - 70, y: -205 },
// { id: 24, startFrame: 1, x: -95 + 80, y: -152 },
// { id: 25, startFrame: 4, x: 88 - 60, y: -260 },
// { id: 26, startFrame: 2, x: 92 + 90, y: -193 },
// { id: 27, startFrame: 0, x: 89 - 40, y: -178 },
// { id: 28, startFrame: 2, x: 23 + 50, y: -170 },
// { id: 29, startFrame: 1, x: -6 - 90, y: -144 },
// { id: 30, startFrame: 4, x: 171 + 50, y: -245 },
// { id: 31, startFrame: 4, x: -84 - 60, y: -265 + 60 },
// { id: 32, startFrame: 2, x: 4 + 60, y: -232 + 50 },
// { id: 33, startFrame: 0, x: -8 - 90, y: -2155 + 60 },
// { id: 34, startFrame: 2, x: -63 + 70, y: -205 + 50 },
// { id: 35, startFrame: 1, x: -95 - 50, y: -152 + 40 },
// { id: 36, startFrame: 4, x: 88 + 90, y: -260 - 50 },
// { id: 37, startFrame: 2, x: 92 - 40, y: -193 - 30 },
// { id: 38, startFrame: 0, x: 89 + 50, y: -178 - 50 },
// { id: 39, startFrame: 2, x: 23 - 70, y: -170 - 60 },
// { id: 40, startFrame: 1, x: -6 + 90, y: -144 - 50 },

const PAYOUTS_SETTINGS = [
	{
		timeout: 0 * FRAME_RATE,
		percent: 0.13
	},
	{
		timeout: 15 * FRAME_RATE,
		percent: 0.2
	},
	{
		timeout: 29 * FRAME_RATE,
		percent: 0.27
	},
	{
		timeout: 40 * FRAME_RATE,
		percent: 0.33
	},
	{
		timeout: 51 * FRAME_RATE,
		percent: 0.4
	},
	{
		timeout: 62 * FRAME_RATE,
		percent: 0.53
	},
	{
		timeout: 69 * FRAME_RATE,
		percent: 1
	}
];

const PARTICLLES_ANIMATIONS_PARAMS = [
	{
		x: -9.5,
		y: 0
	},
	{
		x: 9.5,
		y: 0
	}
];

const Z_INDEXES = {
	BACK_EFFECTS: 0,
	COINS: 2,
	PAYOUT: 1,
	TOP_EFFECTS: 3
};


class CoinsAward extends BaseAward
{
	static get EVENT_ON_COIN_LANDED() { return "onCoinLanded"; }
	static get EVENT_ON_PAYOUT_IS_VISIBLE() { return "onPayoutIsVisible"; }

	constructor(aGameField_sprt, aAwardType_int, aOptParams_obj)
	{
		super(aGameField_sprt, aAwardType_int);

		this._fParams_obj = aOptParams_obj;
		this._fRid_num = aOptParams_obj.rid;
		this._fSeatId_int = +aOptParams_obj.seatId;
		this._fCoins_sprt_arr = null;
		this._fPayout_wp = null;
		this._fDropPaths_arr_arr = null;
		this._fCoinsTimer_t = null;
		this._fEndPosition_pt = null;
		this._fCoinsCounter_int = undefined;
		this._fPayValue_num = null;
		this._fPayoutValue_num = null;
		this._fCoinsMoneyStep_num = null;
		this._fCoinsMoneyCounter_num = null;
		this._fSpecifiedWinSoundTier = aOptParams_obj.specifiedWinSoundTier;
		this._winDevalued_bl = false;
		this._fGenerateId_num = null;
		this._fOffscreenOffsetX_num = null;
		this._fOffscreenOffsetY_num = null;
		this._fIsBoss_bl = null;
		this._fSpeed_num = 1;
		this._fOnCoinsLanded_bln = false;
		this._fCoinsScale_num = null;
		this.__fPayoutContainer_sprt = null;

		this._fCoinExplosion_bln = aOptParams_obj.coinExplosion;
		this._fTimers_arr = [];

		this._fEnemyId_num = aOptParams_obj.enemyId;

		this.__initContainers();
	}

	get countedCoinsAmount()
	{
		return this._fCoinsMoneyCounter_num || this._fBundleCoinsMoneyCounter_num || 0;
	}

	get rid()
	{
		return this._fRid_num;
	}

	get seatId()
	{
		return this._fSeatId_int;
	}

	get isWinDevalued()
	{
		return this._winDevalued_bl;
	}

	get isMasterSeat()
	{
		return (this._fSeatId_int === APP.playerController.info.seatId);
	}

	get winValue()
	{
		return this._fPayoutValue_num;
	}

	get enemyId()
	{
		return this._fEnemyId_num;
	}

	get offscreenOffset()
	{
		if (this._fOffscreenOffsetX_num !== null && this._fOffscreenOffsetY_num !== null)
		{
			return { x: this._fOffscreenOffsetX_num, y: this._fOffscreenOffsetY_num };
		}

		return { x: 0, y: 0 };
	}

	__initContainers()
	{
		this.__fPayoutContainer_sprt = this.addChild(new Sprite());
		this._fParticlesContainer_sprt = this.addChild(new Sprite());
	}

	_calcAnimationSpeed(aWinTier_int)
	{
		let lIsWinTier_int = aWinTier_int;
		let lIsWinTierSmall_bl = lIsWinTier_int !== WinTierUtil.WIN_TIERS.TIER_BIG;
		let lIsSmallBossWin_bl = this._fIsBoss_bl && lIsWinTierSmall_bl && !this._fCoinExplosion_bln;
		return lIsSmallBossWin_bl ? 2 : 1;
	}

	_showAwarding(aValue_num, aParams_obj)
	{
		let lWinCoins_int = Math.floor(Number(aValue_num));
		if (lWinCoins_int > 15) lWinCoins_int = 15;
		let lWinTier_int = this._calcWinTier(Number(aValue_num));

		this._fCoins_sprt_arr = [];
		this._fCoinsCounter_int = lWinCoins_int;

		for (let i = 0; i < this._fCoinsCounter_int; i++)
		{
			let coin = this._generateCoin();
			this._fCoins_sprt_arr.push(this.addChild(coin)); //!@!
		}

		this._fRid_num = aParams_obj.rid;
		this._fIsBoss_bl = aParams_obj.isBoss;
		this._fChMult_num = aParams_obj.chMult;

		const lWeaponsInfo_wsi = APP.currentWindow.weaponsController.i_getInfo();
		let lCurrentShotPrice_num = lWeaponsInfo_wsi.i_getWeaponShotPrice(lWeaponsInfo_wsi.currentWeaponId);

		this._fEndPosition_pt = aParams_obj.winPoint || this._defaultPoint;
		this._winDevalued_bl = aParams_obj.isQualifyWinDevalued;

		this._fCoinsScale_num = this._fIsBoss_bl ? 0.6 : aValue_num < lCurrentShotPrice_num ? 0.25 : 0.5;

		this._fPayValue_num = Number(aValue_num);

		this._fCoinsMoneyStep_num = Math.ceil(Number(aValue_num) / this._fCoinsCounter_int);
		this._fCoinsMoneyCounter_num = 0;

		let startOffset = aParams_obj.startOffset || { x: 0, y: 0 };
		let lPayoutPos_obj = { x: aParams_obj.start.x + startOffset.x, y: aParams_obj.start.y + startOffset.y };

		let lPayoutFontScale_num = (lWinTier_int == WinTierUtil.WIN_TIERS.TIER_SMALL ? 1.2 : (lWinTier_int == WinTierUtil.WIN_TIERS.TIER_BIG ? 1.56 : 1.4)) * 0.7;
		let lWinPayout_wp = this._createWinPayout(lPayoutFontScale_num);
		//lWinPayout_wp.zIndex = Z_INDEXES.PAYOUT; !@!
		this._fPayout_wp = this.__fPayoutContainer_sprt.addChild(lWinPayout_wp); //!@!
		this._fPayout_wp.visible = false;

		this._fPayoutValue_num = Number(aValue_num);
		
		APP.gameScreen.gameFieldController.bombController.on(BombController.SHOW_MULT_WIN_AWARD, this._updateBombPayoutValue, this);
		if (this._fChMult_num > 1 && this._fParams_obj.enemyTypeId !== ENEMY_TYPES.BOMB_CAPSULE)
		{
			let lPayVal_num = (aValue_num / this._fChMult_num).toFixed(2);
			this._fPayout_wp.value = +lPayVal_num;
		}
		else
		{
			this._fPayout_wp.value = aValue_num;
		}

		this._fOffscreenOffsetY_num = this._getOffscreenOffsetY(lPayoutPos_obj.y - 20);
		this._fOffscreenOffsetX_num = this._getOffscreenOffsetX(lPayoutPos_obj.x);

		this._fPayout_wp.position.set(lPayoutPos_obj.x + this._fOffscreenOffsetX_num, lPayoutPos_obj.y + this._fOffscreenOffsetY_num);

		let lSpeed_num = this._fSpeed_num = this._calcAnimationSpeed(lWinTier_int);
		if (!this.isMasterSeat)
		{
			lSpeed_num *= this._fChMult_num != 1 ? 0.7 : 1.5;
		}
		this._fillDropPath(aParams_obj.start, startOffset, lSpeed_num);
		this._onPayoutTimerCounted();
		this._onCoinFlyInTime();
		this._playWinTierSoundSuspicion(lWinTier_int);
	}

	_createWinPayout(aOptFontScale_num)
	{
		return (this.isMasterSeat ? new WinPayout(aOptFontScale_num)
			: new SilverWinPayout(aOptFontScale_num));
	}

	_getOffscreenOffsetY(aPayoutPosY_num)
	{
		let lOffscreenOffsetY_num = 0;
		let lPayoutHeigth_num = this._fPayout_wp.getBounds().height
		if (aPayoutPosY_num - lPayoutHeigth_num / 2 < 16) /* 16 - not to be covered by top black bar (infobar)*/
		{
			lOffscreenOffsetY_num = 16 - (aPayoutPosY_num - lPayoutHeigth_num / 2);
		}
		else if (aPayoutPosY_num + lPayoutHeigth_num / 2 > 540)
		{
			lOffscreenOffsetY_num = 540 - (aPayoutPosY_num + lPayoutHeigth_num / 2);
		}

		return lOffscreenOffsetY_num;
	}

	_getOffscreenOffsetX(aPayoutPosX_num)
	{
		let lOffscreenOffsetX_num = 0;
		let lMaxPayoutScale_num = 1.2;
		let lPayoutWidth_num = this._fPayout_wp.getBounds().width;
		lPayoutWidth_num = (lPayoutWidth_num * lMaxPayoutScale_num) / this._fPayout_wp.scale.x;

		if (aPayoutPosX_num - lPayoutWidth_num / 2 < 0)
		{
			lOffscreenOffsetX_num = 0 - (aPayoutPosX_num - lPayoutWidth_num / 2);
		}
		else if (aPayoutPosX_num + lPayoutWidth_num / 2 > 960)
		{
			lOffscreenOffsetX_num = 960 - (aPayoutPosX_num + lPayoutWidth_num / 2);
		}

		return lOffscreenOffsetX_num;
	}

	_fillDropPath(aStart_obj, startOffset, aSpeed_num)
	{
		let lOrigStartX_num = aStart_obj ? aStart_obj.x : 0;
		lOrigStartX_num += startOffset.x;
		let lOrigStartY_num = (aStart_obj ? aStart_obj.y : 0);
		lOrigStartY_num += startOffset.y;

		this._fDropPaths_arr_arr = [];

		for (let i = 0; i < this._fCoinsCounter_int; ++i)
		{
			let lCoinParams_obj = COINS_ANIMATIONS_PARAMS[i];
			let lFinishX_num = lCoinParams_obj.x / 2 * this._fCoinsScale_num;
			let lFinishY_num = lCoinParams_obj.y / 2 * this._fCoinsScale_num + 30;
			let lFinalScale_num = 1;
			let lStartX_num = lOrigStartX_num;
			let lStartY_num = lOrigStartY_num + 20;
			let lWiggleYOffset_num = 25;

			if (!this.isMasterSeat)
			{
				lFinishX_num *= 0.53;
				lFinishY_num *= 0.53;
				lStartY_num -= 50;
				lWiggleYOffset_num *= 0.53;

			}

			lFinishX_num += lStartX_num + this._fOffscreenOffsetX_num;
			lFinishY_num += lStartY_num + this._fOffscreenOffsetY_num;

			if (lFinishY_num <= 20)
			{
				lFinishY_num += 40;
			}

			let speedMultiplier = 1 * 0.7;

			let seq = [
				{
					tweens: [],
					duration: lCoinParams_obj.startFrame + FRAME_RATE
				},
				{
					tweens: [{ prop: "position.x", to: lFinishX_num },
					{ prop: "position.y", to: lFinishY_num },
					{ prop: 'scale.x', to: -1 * lFinalScale_num * this._fCoinsScale_num },
					{ prop: 'scale.y', to: 1 * lFinalScale_num * this._fCoinsScale_num }
					],
					duration: (10 * FRAME_RATE / aSpeed_num) * speedMultiplier,
					ease: Easing.sine.easeOut
				},
				{
					tweens: [
						{ prop: 'position.y', to: lFinishY_num + lWiggleYOffset_num }
					],
					duration: (15 * FRAME_RATE / aSpeed_num) * speedMultiplier,
					ease: Easing.sine.easeOut
				},
				{
					tweens: [
						{ prop: 'position.y', to: lFinishY_num }
					],
					duration: (15 * FRAME_RATE / aSpeed_num) * speedMultiplier,
					ease: Easing.sine.easeOut
				}
			];

			if (this._fCoinExplosion_bln)
			{
				for (let j = 0; j < 4; j++)
				{
					seq.push({
						tweens: [
							{ prop: 'position.y', to: lFinishY_num + (j % 2 ? lWiggleYOffset_num : -lWiggleYOffset_num)}
						],
						duration: 10 * FRAME_RATE / aSpeed_num,
						ease: Easing.sine.easeOut
					})
				}
			}

			let startPoint = new PIXI.Point(lStartX_num, lStartY_num);

			this._fDropPaths_arr_arr.push([startPoint, seq]);
		}
	}

	_playWinTierSoundSuspicion(aWinTier_int)
	{
		if (this.isMasterSeat)
		{
			this._playWinTierSound(aWinTier_int);
		}
	}

	_playWinTierSound(aWinTier_int)
	{
		if (!this.isMasterSeat)
		{
			return;
		}

		let lSoundId_str = "wins_";
		let lSoundTier_num = this._fSpecifiedWinSoundTier || aWinTier_int;
		if (lSoundTier_num == WinTierUtil.WIN_TIERS.TIER_SMALL) lSoundId_str += "small";
		else if (lSoundTier_num == WinTierUtil.WIN_TIERS.TIER_MEDIUM) lSoundId_str += "medium";
		else if (lSoundTier_num == WinTierUtil.WIN_TIERS.TIER_BIG) lSoundId_str += "large";
		else lSoundId_str = null;

		this._interrupPreviousWinSound(lSoundId_str);

		APP.soundsController.play(lSoundId_str);
	}

	_playCoinDropSoundSuspicion()
	{
		if (this.isMasterSeat)
		{
			APP.soundsController.play('wins_coincollect');
		}
	}

	_startContinuousDelay()
	{
		this._continueAwarding();
	}

	_interrupPreviousWinSound(aSoundId_str)
	{
		if (APP.soundsController.isSoundPlaying(aSoundId_str))
		{
			APP.soundsController.stop(aSoundId_str);
		}
	}

	_calcWinTier(aMoneyValue_num)
	{
		let lCurrentStake_num = this.currentStake * APP.playerController.info.betLevel;
		let lWinTier_int = WinTierUtil.calcWinTier(aMoneyValue_num, lCurrentStake_num);

		if (lWinTier_int === 0)
		{
			throw new Error('CoinsAward can\'t be created for zero wins!');
		}
		return lWinTier_int;
	}

	_onCoinFlyInTime(aCoinIndex_int = 0, aOptWaitTime_num=1*FRAME_RATE)
	{
		this._fCoinsTimer_t && this._fCoinsTimer_t.destructor();

		let lCoin_sprt = this._fCoins_sprt_arr[aCoinIndex_int];
		if (lCoin_sprt)
		{
			let lStartPosition_pt = this._fDropPaths_arr_arr[aCoinIndex_int][0];

			let lStartScale_num = 0.71 * this._fCoinsScale_num;
			if (!this.isMasterSeat)
			{
				lStartScale_num *= 0.53 * this._fCoinsScale_num;
			}
			lCoin_sprt.scale.set(lStartScale_num);
			lCoin_sprt.scale.x *= -1;
			lCoin_sprt.position.set(lStartPosition_pt.x, lStartPosition_pt.y);
			lCoin_sprt.visible = true;
			lCoin_sprt.play();

			let lSequence_s = this._fDropPaths_arr_arr[aCoinIndex_int][1];
			Sequence.start(lCoin_sprt, lSequence_s).once(Sequence.EVENT_ON_SEQUENCE_PLAYING_COMPLETED, () =>
			{
				this._startContinuousDelay();
			});
		}

		if (aCoinIndex_int < this._fCoins_sprt_arr.length - 1)
		{
			let waitTime = aOptWaitTime_num;
			if (!this.isMasterSeat)
			{
				waitTime = 0.1 * aOptWaitTime_num;
			}
			this._fCoinsTimer_t = new Timer(this._onCoinFlyInTime.bind(this, aCoinIndex_int + 1), waitTime);
		}
	}

	_continueAwarding()
	{
		this._startCoinFlyOut();
	}

	get _payoutScaleMultiplier()
	{
		return this.isMasterSeat ? 1 : 0.6;
	}

	_onPayoutTimerCounted()
	{
		if (this._fChMult_num > 1 && this._fParams_obj.killerEnemyName !== ENEMIES.BombCapsule && this._fParams_obj.enemyTypeId !== ENEMY_TYPES.BOMB_CAPSULE)
		{
			this._startCriticalHitAnimation();
			this._onMultiplierPayoutAppearTime();
		}
		else
		{
			this._onPayoutAppearTime();
		}

		this.emit(CoinsAward.EVENT_ON_PAYOUT_IS_VISIBLE, { value: this._fPayoutValue_num, seatId: this._fSeatId_int, isBoss: this._fIsBoss_bl });
	}

	_onPayoutAppearTime()
	{
		this._fPayout_wp.scale.set(0);
		this._fPayout_wp.visible = true;

		if (this._fCoinExplosion_bln)
		{
			this._startPayoutCounting();
		}

		let lSequence_s = this._getPayoutSequence();

		if (this._fCoinExplosion_bln)
		{
			let lFinishY_num = this._fPayout_wp.position.y;
			let lFinishX_num = this._fPayout_wp.position.x;
			for (let j = 0; j < 4; j++)
			{
				let lWiggleYOffset_num = Math.floor(2 + Math.random() * 3);
				let lWiggleXOffset_num = Math.floor(2 + Math.random() * 2);
				lSequence_s.push({
					tweens: [
						{ prop: 'position.y', to: lFinishY_num + (j % 2 ? lWiggleYOffset_num : -lWiggleYOffset_num) },
						{ prop: 'position.x', to: lFinishX_num + (j % 2 ? -lWiggleXOffset_num : lWiggleXOffset_num) }
					],
					duration: 10 * FRAME_RATE,
					ease: Easing.sine.easeOut
				})
			}
		}

		Sequence.start(this._fPayout_wp, lSequence_s);
	}

	_onMultiplierPayoutAppearTime()
	{
		let lScaleMultiplier_num = this._payoutScaleMultiplier;
		let lSpeed_num = this._fSpeed_num;

		this._fPayout_wp.scale.set(0);
		this._fPayout_wp.visible = true;

		let lSequence_s = [
			{ 	tweens:[	{prop:"scale.x", to: 1.37 * lScaleMultiplier_num},
						{prop:"scale.y", to: 1.37 * lScaleMultiplier_num}		],
				duration:6*FRAME_RATE / lSpeed_num, ease:Easing.sine.easeIn
			},
			{ 	tweens:[	{prop:"scale.x", to: 1 * lScaleMultiplier_num},
						{prop:"scale.y", to: 1 * lScaleMultiplier_num}		],
				duration:8*FRAME_RATE / lSpeed_num, ease:Easing.sine.easeOut
			},
			{ 	tweens:[	{prop:"position.y", to:this._fPayout_wp.position.y + 2},
						{prop:"position.x", to:this._fPayout_wp.position.x - 1} ],
				duration:7*FRAME_RATE
			},
			{ 	tweens:[	{prop:"position.y", to:this._fPayout_wp.position.y - 2},
						{prop:"position.x", to:this._fPayout_wp.position.x}
																				],
				duration:10*FRAME_RATE
			},
			{ 	tweens:[	{prop:"position.y", to:this._fPayout_wp.position.y - 1.5},
						{prop:"position.x", to:this._fPayout_wp.position.x + 2.5}
																				],
				duration:3*FRAME_RATE
			}
		];

		Sequence.start(this._fPayout_wp, lSequence_s);
	}

	_startCriticalHitAnimation()
	{
		this._fCriticalAnimation_cha = this.__fPayoutContainer_sprt.addChild(new CriticalHitAnimation(this._fChMult_num));
		this._fCriticalAnimation_cha.position.set(this._fPayout_wp.position.x+20, this._fPayout_wp.position.y+60);
		this._fCriticalAnimation_cha.once(CriticalHitAnimation.EVENT_ON_CRITICAL_HIT_ANIMATION_ENDED, this._onCriticalHitAnimationEnded, this);
		this._fCriticalAnimation_cha.startAnimation(this._fSeatId_int == APP.playerController.info.seatId);

		if (this._fRid_num < 0) // co-Player
		{
			this._fCriticalAnimation_cha.alpha = 0.3;
		}
	}

	_onCriticalHitAnimationEnded()
	{
		if (this._fPayout_wp)
		{
			this._fCriticalAnimation_cha.off(CriticalHitAnimation.EVENT_ON_CRITICAL_HIT_ANIMATION_ENDED, this._onCriticalHitAnimationEnded, this, true);
			this._onMultiplierPayoutUpdateTime();
		}
	}

	_onMultiplierPayoutUpdateTime()
	{
		Sequence.destroy(Sequence.findByTarget(this._fPayout_wp));

		this._fPayout_wp.value = this._fPayoutValue_num;
		this._fPayout_wp.scale.set(1.6);
		this._fPayout_wp.scaleTo(1, 8*FRAME_RATE);

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._startMultiplyAnimation();
		}

		let lSequence_s = [
			{ 	tweens:[	{prop:"position.y", to:this._fPayout_wp.position.y - 2},
						{prop:"position.x", to:this._fPayout_wp.position.x + 3}
																				],
				duration:5*FRAME_RATE
			},
			{ 	tweens:[	{prop:"position.y", to:this._fPayout_wp.position.y - 1},
						{prop:"position.x", to:this._fPayout_wp.position.x + 1}
																				],
				duration:6*FRAME_RATE
			},
			{ 	tweens:[	{prop:"position.y", to:this._fPayout_wp.position.y + 2},
						{prop:"position.x", to:this._fPayout_wp.position.x - 1} ],
				duration:7*FRAME_RATE
			},
			{
			 	tweens:[	{prop:"position.y", to:this._fPayout_wp.position.y - 2},
						{prop:"position.x", to:this._fPayout_wp.position.x}
																				],
				duration:10*FRAME_RATE, onfinish: () => {
					this._startPayoutFlyOut();
					this._fChMult_num = 0;
			}},
		];

		Sequence.start(this._fPayout_wp, lSequence_s);
	}

	_startMultiplyAnimation(aPosOpt_obj)
	{
		if (this._fMultFlare_sprt)
		{
			//already exist
			return;
		}

		let lPos_obj = aPosOpt_obj || {x: this._fPayout_wp.position.x, y: this._fPayout_wp.position.y};
		this._fParticlesContainer_sprt.position.set(lPos_obj.x, lPos_obj.y);

		this._startParticle({x: PARTICLLES_ANIMATIONS_PARAMS[0].x, y: PARTICLLES_ANIMATIONS_PARAMS[0].y}, 0.5235987755982988, this._fParticlesContainer_sprt); //Utils.gradToRad(30)
		this._startParticle({x: PARTICLLES_ANIMATIONS_PARAMS[1].x, y: PARTICLLES_ANIMATIONS_PARAMS[1].y}, 3.490658503988659, this._fParticlesContainer_sprt); //Utils.gradToRad(200)
		this._startCircleBlast(lPos_obj.x, lPos_obj.y);

		this._fMultFlare_sprt = this.addChild(APP.library.getSprite("critical_hit/flare"));
		this._fMultFlare_sprt.blendMode = PIXI.BLEND_MODES.SCREEN;
		this._fMultFlare_sprt.position.set(lPos_obj.x, lPos_obj.y);

		this._fMultFlare_sprt.scale.set(0);
		let lFlareSeq_arr = [
			{tweens: [{prop: 'scale.x', to: 0.471},	{prop: 'scale.y', to: 0.471}, {prop: 'rotation', to: 0.18849555921538758}],	duration: 2*FRAME_RATE}, //Utils.gradToRad(10.8)
			{tweens: [{prop: 'scale.x', to: 0},	{prop: 'scale.y', to: 0}, {prop: 'rotation', to: 0.5689773361501514}],	duration: 15*FRAME_RATE, onfinish: () => { //Utils.gradToRad(32.6)
				this._fMultFlare_sprt && this._fMultFlare_sprt.destroy();
				this._fMultFlare_sprt = null;
			}}
		];

		Sequence.start(this._fMultFlare_sprt, lFlareSeq_arr);
	}

	_startCircleBlast(x, y, aContainer)
	{
		if (this._fCircleBlast_sprt)
		{
			//already exists
			return;
		}

		if (aContainer)
		{
			this._fCircleBlast_sprt = aContainer.addChild(APP.library.getSprite("awards/circle_blast"));
			this._fCircleBlastSecond_sprt = aContainer.addChild(APP.library.getSprite("awards/circle_blast"));
		}
		else
		{
			this._fCircleBlast_sprt = this.addChild(APP.library.getSprite("awards/circle_blast"));
			this._fCircleBlastSecond_sprt = this.addChild(APP.library.getSprite("awards/circle_blast"));
		}
		this._fCircleBlast_sprt.blendMode = PIXI.BLEND_MODES.SCREEN;
		this._fCircleBlast_sprt.position.set(x, y);
		this._fCircleBlast_sprt.alpha = 0.8;
		this._fCircleBlast_sprt.scale.set(0);

		this._fCircleBlast_sprt.scaleTo(0.765, 9*FRAME_RATE);
		this._fCircleBlast_sprt.fadeTo(0, 9*FRAME_RATE, null, this._fCircleBlast_sprt.destroy.bind(this._fCircleBlast_sprt));

		this._fCircleBlastSecond_sprt.blendMode = PIXI.BLEND_MODES.SCREEN;
		this._fCircleBlastSecond_sprt.position.set(x, y);
		this._fCircleBlastSecond_sprt.alpha = 0.8;
		this._fCircleBlastSecond_sprt.scale.set(0);

		this._fCircleBlastSecond_sprt.scaleTo(0.765, 9*FRAME_RATE);
		this._fCircleBlastSecond_sprt.fadeTo(0, 9*FRAME_RATE, null, this._fCircleBlastSecond_sprt.destroy.bind(this._fCircleBlastSecond_sprt), null, null, 2*FRAME_RATE);
	}

	_startParticle(aPos_obj, aRot_num, aCountainer_spr, callback = null)
	{
		let lParticle_sprt = aCountainer_spr.addChild(new Sprite());
		lParticle_sprt.textures = generate_particles_textures();
		lParticle_sprt.blendMode = PIXI.BLEND_MODES.ADD;
		lParticle_sprt.scale.set(2);
		lParticle_sprt.rotation = aRot_num;
		lParticle_sprt.position.set(aPos_obj.x, aPos_obj.y);
		lParticle_sprt.on('animationend', () => {
			callback && callback();
			lParticle_sprt && lParticle_sprt.destroy();
			lParticle_sprt = null;
		});
		lParticle_sprt.play();
		lParticle_sprt.fadeTo(1, 10*FRAME_RATE, null, () => {
			lParticle_sprt.fadeTo(0, 10*FRAME_RATE);
		});
	}

	_getPayoutSequence()
	{
		let lScaleMultiplier_num = this._payoutScaleMultiplier;
		let lSpeed_num = this._fSpeed_num;

		this._fPayout_wp.visible = true;

		let lYOffset_num = 50;
		if (!this.isMasterSeat)
		{
			lYOffset_num *= 0.53;
		}

		let lTargetScale_num = 0.8 * lScaleMultiplier_num;
		let lEndY_num = this._fPayout_wp.position.y - lYOffset_num;

		this._fPayout_wp.scale.set(lTargetScale_num);
		lEndY_num += this._getOffscreenOffsetY(lEndY_num);

		this._fPayout_wp.scale.set(0);

		return [
			{
				tweens: [
					{ prop: "scale.x", to: 0.97 * lScaleMultiplier_num },
					{ prop: "scale.y", to: 0.97 * lScaleMultiplier_num }
				],
				duration: 3 * FRAME_RATE / lSpeed_num, ease: Easing.sine.easeIn
			},
			{
				tweens: [{ prop: "scale.x", to: 0.6 * lScaleMultiplier_num },
				{ prop: "scale.y", to: 0.6 * lScaleMultiplier_num }],
				duration: 3 * FRAME_RATE / lSpeed_num, ease: Easing.sine.easeOut
			},
			{
				tweens: [{ prop: "scale.x", to: lTargetScale_num },
				{ prop: "scale.y", to: lTargetScale_num },
				{ prop: "position.y", to: lEndY_num }],
				duration: 5 * FRAME_RATE / lSpeed_num, ease: Easing.sine.easeOut
			}
		];
	}

	_startPayoutCounting()
	{
		let lValue_num = PAYOUTS_SETTINGS[0].percent * this._fPayoutValue_num;
		this._updatePayoutValue(lValue_num, 0);

		for (let i = 1; i < PAYOUTS_SETTINGS.length; ++i)
		{
			this._generateNextPayoutTimer(PAYOUTS_SETTINGS[i].timeout, PAYOUTS_SETTINGS[i].percent * this._fPayoutValue_num, i);
		}
	}

	_generateNextPayoutTimer(aTime_num, aValue_num, aId_num)
	{
		let lTimer_t = new Timer(() =>
		{
			this._updatePayoutValue(aValue_num, aId_num);
		}, aTime_num);
		this._fTimers_arr.push(lTimer_t);
	}

	_updatePayoutValue(aVal_num, aId_num)
	{
		if (!this._fPayout_wp) return;

		this._setValue(aVal_num);

		let lBaseScale_num = 1 * this._payoutScaleMultiplier * 0.726;
		let lScalePrev_num = lBaseScale_num + ((aId_num > 0) ? 0.3 * ((aId_num - 1) / (PAYOUTS_SETTINGS.length - 1)) : 0);
		let lScale_num = lBaseScale_num + 0.3 * (aId_num / (PAYOUTS_SETTINGS.length - 1));
		let lSeq_arr = [
			{ tweens: [{ prop: "scale.x", to: lScalePrev_num - 0.05 }, { prop: "scale.y", to: lScalePrev_num - 0.05 }], duration: 2 * FRAME_RATE, ease: Easing.sine.easeOut },
			{ tweens: [{ prop: "scale.x", to: lScale_num }, { prop: "scale.y", to: lScale_num }], duration: 2 * FRAME_RATE, ease: Easing.sine.easeIn }
		];

		Sequence.start(this._fPayout_wp, lSeq_arr);

	}

	_updateBombPayoutValue()
	{
		if(!this._fPayout_wp) return;
		Sequence.destroy(Sequence.findByTarget(this._fPayout_wp));

		this._setValue(this._fPayoutValue_num);
		this._fPayout_wp.scale.set(1.6*this._payoutScaleMultiplier);
		this._fPayout_wp.scaleTo(this._payoutScaleMultiplier, 14*FRAME_RATE);
		
		let lSeq_arr = [
			{ tweens: [], duration: 14 * FRAME_RATE, onfinish: this._startPayoutFlyOut.bind(this)},
		];
		
		Sequence.start(this, lSeq_arr);
	}

	_setValue(aVal_num)
	{
		let lOldPos_obj = { x: this._fPayout_wp.position.x, y: this._fPayout_wp.position.y };
		let lOldScale_obj = { x: this._fPayout_wp.scale.x, y: this._fPayout_wp.scale.y };

		this._fPayout_wp.position.set(0, lOldPos_obj.y);
		this._fPayout_wp.scale.set(1, 1);

		this._fPayout_wp.value = aVal_num;

		this._fPayout_wp.position.set(lOldPos_obj.x, lOldPos_obj.y);
		this._fPayout_wp.scale.set(lOldScale_obj.x, lOldScale_obj.y);
	}

	_finishPayoutCounting()
	{
		if (Array.isArray(this._fTimers_arr))
		{
			for (let lTimer_t of this._fTimers_arr)
			{
				lTimer_t && lTimer_t.destructor();
				lTimer_t = null;
			}
		}

		this._fTimers_arr = [];

		if (this._fPayout_wp)
		{
			this._setValue(this._fPayoutValue_num);
		}
	}

	_startPayoutFlyOut()
	{
		this._fPayout_wp && Sequence.destroy(Sequence.findByTarget(this._fPayout_wp));
		this._finishPayoutCounting();

		if (this._fPayout_wp)
		{
			let duration = 6 * FRAME_RATE;
			if (!this.isMasterSeat)
			{
				duration /= 2;
			}
			this._fPayout_wp.fadeTo(0, duration, Easing.quadratic.easeInOut, this._completeAwarding.bind(this));
		}
		else
		{
			this._completeAwarding();
		}
	}

	_startCoinFlyOut()
	{
		if (this._fCoinsCounter_int > 0 && this._fCoins_sprt_arr[this._fCoinsCounter_int - 1])
		{
			let lIndex_int = this._fCoins_sprt_arr.length - this._fCoinsCounter_int--;
			let lOutCoin_sprt = this._fCoins_sprt_arr[lIndex_int];
			lOutCoin_sprt.position.x = this._fCoins_sprt_arr[lIndex_int].position.x;
			lOutCoin_sprt.position.y = this._fCoins_sprt_arr[lIndex_int].position.y;

			this._onCoinFlyOutTime(lOutCoin_sprt);
		}
		else
		{
			this._onCoinsLanded();
		}
	}

	_onCoinFlyOutTime(aCoin_sprt)
	{
		let lRestCoinsAmount_int = this._fCoinsCounter_int;
		let lSpeed_num = this._fSpeed_num;
		let lCoinFlyDuration_num = COIN_FLY_DURATION / lSpeed_num;

		if (!this.isMasterSeat)
		{
			lCoinFlyDuration_num /= 2;
		}

		if (aCoin_sprt)
		{
			aCoin_sprt.visible = true;
			aCoin_sprt.play();
			aCoin_sprt.moveTo(this._fEndPosition_pt.x, this._fEndPosition_pt.y, lCoinFlyDuration_num, null, () =>
			{
				if (aCoin_sprt === this._fCoins_sprt_arr[0])
				{
					this._playCoinDropSoundSuspicion();
				}

				aCoin_sprt.destroy();

				if (!this._fPayValue_num)
				{
					this._fCoinsMoneyStep_num = 0;
				}
				else if ((this._fCoinsMoneyCounter_num + this._fCoinsMoneyStep_num) <= this._fPayValue_num)
				{
					this._fCoinsMoneyCounter_num += Number(this._fCoinsMoneyStep_num);
				}
				else
				{
					this._fCoinsMoneyStep_num = Number(this._fPayValue_num) - this._fCoinsMoneyCounter_num;
					this._fPayValue_num = 0;
				}

				this.emit(CoinsAward.EVENT_ON_COIN_LANDED, { money: this._fCoinsMoneyStep_num, seatId: this._fSeatId_int });

				if (lRestCoinsAmount_int === 0)
				{
					this._onCoinsLanded();
				}
			});
		}
	}

	_onCoinsLanded()
	{
		if (this._fNoPayout_bln)
		{
			if (this._fPayout_wp)
			{
				this._onAwardCounted(this._fPayoutValue_num);
			}
			super._completeAwarding();
			return;
		}

		this._fOnCoinsLanded_bln = true;

		if (!(this._fChMult_num > 1 && this._fParams_obj.enemyTypeId !== ENEMY_TYPES.BOMB_CAPSULE))
		{
			this._startPayoutFlyOut();
		}
	}

	_completeAwarding(aIsFinalAwardingSum = true)
	{
		if (this._fPayout_wp)
		{
			this._onAwardCounted(this._fPayoutValue_num, aIsFinalAwardingSum);
		}

		this._validateCompleteAwarding();
	}

	_validateCompleteAwarding()
	{
		if (!this._fPayout_wp && this._fOnCoinsLanded_bln)
		{
			super._completeAwarding();
		}
	}

	_onAwardCounted(lPayoutValue_num, aIsFinalAwardingSum = true)
	{
		if (aIsFinalAwardingSum)
		{
			super._onAwardCounted(lPayoutValue_num);
		}

		if (this._fPayout_wp)
		{
			this._fPayoutTimer_t && this._fPayoutTimer_t.destructor();
			Sequence.destroy(Sequence.findByTarget(this._fPayout_wp));
			this._fPayout_wp.destroy();
			this._fPayout_wp = null;
		}
	}

	_generateAwardCountedEventData(aValue_num)
	{
		let awardCountedEventData = super._generateAwardCountedEventData(aValue_num);
		awardCountedEventData.isQualifyWinDevalued = this.isWinDevalued;
		return awardCountedEventData;
	}

	_generateCoin()
	{
		let lCoin_sprt = new Sprite();
		if (this.isMasterSeat)
		{
			lCoin_sprt.textures = AtlasSprite.getFrames([APP.library.getAsset("common/coin_spin")], AtlasConfig.WinCoin, "");
		}
		else
		{
			lCoin_sprt.textures = AtlasSprite.getFrames([APP.library.getAsset("common/silver_coin_spin")], AtlasConfig.SilverWinCoin, "");
		}

		++this._fGenerateId_num;
		if (this._fGenerateId_num >= lCoin_sprt.textures.length) this._fGenerateId_num = 0;
		let lStartFrameIndex_num = ++this._fGenerateId_num;

		lCoin_sprt.anchor.set(0.5);
		lCoin_sprt.gotoAndStop(lStartFrameIndex_num);
		lCoin_sprt.visible = false;
		//lCoin_sprt.zIndex = Z_INDEXES.COINS; !@!

		return lCoin_sprt;
	}

	_interruptAnimationsAndTimers()
	{
		this._fCoinsTimer_t && this._fCoinsTimer_t.destructor();
		this._fCoinsTimer_t = null;

		while (this._fCoins_sprt_arr && this._fCoins_sprt_arr.length)
		{
			let lCoin_sprt = this._fCoins_sprt_arr.pop();
			Sequence.destroy(Sequence.findByTarget(lCoin_sprt));
			lCoin_sprt.destroy();
		}

		Sequence.destroy(Sequence.findByTarget(this._fPayout_wp));

		Sequence.destroy(Sequence.findByTarget(this._fMultFlare_sprt));
		this._fMultFlare_sprt && this._fMultFlare_sprt.destroy();
		this._fMultFlare_sprt = null;
	}

	destroy()
	{
		APP.gameScreen.gameFieldController.bombController.off(BombController.SHOW_MULT_WIN_AWARD, this._updateBombPayoutValue, this);

		if (this._fCriticalAnimation_cha)
		{
			this._fCriticalAnimation_cha.off(GameFieldController.EVENT_ON_CRITICAL_HIT_ANIMATION_ENDED, this._onCriticalHitAnimationEnded, this, true);
			this._fCriticalAnimation_cha.destroy();
		}

		this._finishPayoutCounting();
		
		this._interruptAnimationsAndTimers();

		this._winDevalued_bl = false;

		super.destroy();

		this._fOnCoinsLanded_bln = undefined;
		this._fRid_num = undefined;
		this._fEndPosition_pt = undefined;
		this._fDropPaths_arr_arr = undefined;
		this._fCoinsCounter_int = undefined;
		this._fPayValue_num = undefined;
		this._fCoinsMoneyStep_num = undefined;
		this._fCoinsMoneyCounter_num = undefined;
		this._fSpecifiedWinSoundTier = undefined;
		this._fGenerateId_num = undefined;
		this._fPayout_wp = undefined;
		this._fCoins_sprt_arr = undefined;
		this._fCoinsTimer_t = undefined;
		this._fOffscreenOffsetX_num = undefined;
		this._fOffscreenOffsetY_num = undefined;
		this._fSpeed_num = undefined;
		this._fPayoutValue_num = undefined;
		this._fTimers_arr = undefined;
		this._fEnemyId_num = undefined;
		this.__fPayoutContainer_sprt = undefined;
		this._fCoinsScale_num = undefined;
	}
}

export default CoinsAward;