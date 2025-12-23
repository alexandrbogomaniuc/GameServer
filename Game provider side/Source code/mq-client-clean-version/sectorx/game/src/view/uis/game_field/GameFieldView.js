import SimpleUIView from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/SimpleUIView';
import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import GameFieldBackContainer from '../../../main/gameField/GameFieldBackContainer';
import I18 from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import PreloadingSpinner from '../../../../../../common/PIXI/src/dgphoenix/gunified/view/custom/PreloadingSpinner';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import * as Easing from '../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { Utils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import { WEAPONS, ENEMIES, FRAME_RATE, ENEMY_TYPES } from '../../../../../shared/src/CommonConstants';

//-----------------
// | this
// ----------------
//   | container
// ----------------
//     | screen
//-----------------
export const Z_INDEXES = {
	WAIT_SCREEN: 100000, /*this*/
	WAITING_CAPTION: 100000, /*this*/
	SUBLOADING: 100001, /*this*/
	TRANSITION_VIEW: 110002, /*this*/
	ROUND_RESULT: 110003, /*this*/
	COUNT_DOWN: 110004, /*this*/
	BTG_FINAL_COUNTING: 110005, /*this*/
	FIRE_SETTINGS: 110006, /*this*/
	FREEZE_AWARDING: 110006, /*this*/

	GROUNDBURN: -541, /*this.screen*/
	LASER_FIELD_ANIMATION: 1, /*this.screen*/
	BULLET_CAPSULE_FIELD_ANIMATION: 1, /*this.screen*/
	SLUG: 10, /*this.screen*/
	BOSS_DISAPPEARING_BOTTOM_FX: 260, /*this.screen*/
	BOSS_APPEARING_BOTTOM_FX: 260, /*this.screen*/
	LASER_CAPSULE_FEATURE: 1429, /*this.screen*/
	BULLET_CAPSULE_FEATURE: 1429, /*this.screen*/
	KILLER_CAPSULE_FEATURE: 1429, /*this.screen*/
	FREEZE_CAPSULE_FEATURE: 1429, /*this.screen*/
	LASER_CAPSULE_EXPLOAD: 1431, /*this.screen*/
	BULLET_CAPSULE_EXPLOASION_ANIMATION: 1431, /*this.screen*/
	LASER_CAPSULE_LASER_NET_EXPLOAD: 1432, /*this.screen*/
	LASER_CAPSULE_FLARE_EXPLOAD: 1433, /*this.screen*/
	LIGHTNING_CAPSULE_HIT_ANIMATION: 1434, /*this.screen*/
	LIGHTNING_CAPSULE_OPTICAL_FLARE_CYAN: 1435, /*this.screen*/
	BOSS_APPEARING_FX: 1440, /*this.screen*/
	GRADIENT: 19000, /*this.screen*/
	LOGO: 19999, /*this.screen*/
	BULLET: 20000, /*this.screen*/
	MISS_EFFECT: 20002, /*this.screen*/
	BOSS_GUI_VIEW: 20003, /*this.screen*/
	PLAYERS_CONTAINER: 20010, /*this.screen*/
	MAIN_SPOT: 20012, /*this.screen*/
	CALLOUTS: 20013, /*this.screen*/
	GUN_FIRE_EFFECT: 20121, /*this.screen*/
	LIGHTNING_CAPSULE_ORB: 20122, /*this.screen*/
	SCOREBOARD: 20130, /*this.screen*/
	PLAYER_REWARD: 21000, /*this.screen*/
	AMMO_COUNTER: 26001, /*this.screen*/
	TARGETING: 27000, /*this.screen*/
	AWARDED_WIN_CONTENT: 27010, /*this.screen*/
	BIG_WINS_CONTENT: 27016, /*this.screen*/
	AUTO_TARGETING_SWITCHER: 27020, /*this.screen*/
	BET_LEVEL_BUTTON_HIT_AREA: 27021, /*this.screen should be greater than MAIN_SPOT*/
	BOSS_APPEARING_FLAMES_FX: 28003, /*this.screen*/
	BOSS_DISAPPEARING_FX: 28004, /*this.screen*/
	BOSS_DIE_RED_SCREEN: 28005, /*this.screen*/
	BOSS_YOU_WIN: 28019, /*this.screen*/
	BOSS_CAPTION: 28020, /*this.screen*/
}

class GameFieldView extends SimpleUIView
{
	get mapContainers()
	{
		return { backContainer: this.backContainer, decorationsContainer: this.screen};
	}

	showBlur()
	{
		this._showBlur();
	}

	hideBlur()
	{
		this._hideBlur();
	}

	showWaitScreen()
	{
		this._showWaitScreen();
	}

	removeWaitScreen()
	{
		this._removeWaitScreen();
	}

	get waitScreen()
	{
		return this._fWaitScreen_spr;
	}

	shakeTheGround(aShakingType_str, aOptResetExistingShaking_bl)
	{
		this._shakeTheGround(aShakingType_str, aOptResetExistingShaking_bl);
	}

	clearRoom()
	{
		this._clearRoom();
	}

	addTimeLeftText()
	{
		this._addTimeLeftText();
	}

	removeTimeLeftText()
	{
		this._removeTimeLeftText();
	}

	get screen()
	{
		return this._fScreen_spr;
	}

	set screen(l_spr)
	{
		this._fScreen_spr = l_spr;
	}

	get container()
	{
		return this._fContainer_spr;
	}

	set container(l_spr)
	{
		this._fContainer_spr = l_spr;
	}

	addRoomGradient()
	{
		this._addRoomGradient();
	}

	removeRoomGradient()
	{
		this._removeRoomGradient();
	}

	constructor()
	{
		super();

		this._graphicsBack = this.addChild(new PIXI.Graphics());
		this._graphicsBack.beginFill(0xb0aeaf).drawRect(-480, -270, 960, 540).endFill(); //-960 / 2, -540 / 2, 960, 540

		this._fContainer_spr = this.addChild(new Sprite);
		this.backContainer = this._fContainer_spr.addChild(new GameFieldBackContainer);

		this._fWaitScreen_spr = null;

		this._fScreen_spr = null;
		this._screenGradient = null;
	}

	__init()
	{
		super.__init();
	}

	_showBlur()
	{
		let blurFilter = new PIXI.filters.BlurFilter();
		blurFilter.blur = 2;

		this.container.filters = [blurFilter];
	}

	_hideBlur()
	{
		this.container.filters = null;
	}

	_showWaitScreen()
	{
		if (this._fWaitScreen_spr)
		{
			return;
		}

		this._fWaitScreen_spr = this.addChild(APP.library.getSprite('level_ui/wait'));
		this._fWaitScreen_spr.position.set(0, 2);
		this._fWaitScreen_spr.zIndex = Z_INDEXES.WAIT_SCREEN;

		let lBack_spr = this._fWaitScreen_spr.addChild(APP.library.getSprite('preloader/loading_back'));

		let lCaption_cta = this._fWaitScreen_spr.addChild(I18.generateNewCTranslatableAsset('TAWaitScreenGameInProgressCaption'));
		lCaption_cta.position.set(0, 17);

		this._fWaitScreen_spr.spinner = this.addChild(new PreloadingSpinner(2100, 110));
		this._fWaitScreen_spr.spinner.position.y = -55;
		this._fWaitScreen_spr.spinner.startAnimation();

		this.container.filterArea = new PIXI.Rectangle(-2, -2, 964, 844);
		this.container.interactiveChildren = false;
	}

	_removeWaitScreen()
	{
		if (this._fWaitScreen_spr)
		{
			if (this._fWaitScreen_spr.spinner)
			{
				this._fWaitScreen_spr.spinner.destroy();
			}
			this._fWaitScreen_spr.destroy();
			this._fWaitScreen_spr = null;

			this.container.filters = null;
			this.container.interactiveChildren = true;
		}
	}

	_shakeTheGround(aShakingType_str = "", aOptResetExistingShaking_bl = false)
	{
		let sequence;
		let container = this.container;

		if (aOptResetExistingShaking_bl)
		{
			Sequence.destroy(Sequence.findByTarget(container));
		}

		switch (aShakingType_str)
		{
			case "bossAppearing":
				sequence = [];
				for (let i = 0; i < 18; i++)
				{
					sequence.push({ tweens: [{ prop: 'x', to: (Utils.random(-35, 35) / 10) }, { prop: 'y', to: (Utils.random(-35, 35) / 10) }], duration: 2 * FRAME_RATE, ease: Easing.sine.easeInOut });
				}
				sequence.push(
					{
						tweens:
							[
								{ prop: 'scale.x', to: 1.05 },
								{ prop: 'scale.y', to: 1.05 }
							],
						duration: 3 * FRAME_RATE,
						ease: Easing.sine.easeIn
					},
					{
						tweens:
							[
								{ prop: 'scale.x', to: 1 },
								{ prop: 'scale.y', to: 1 }
							],
						duration: 3 * FRAME_RATE,
						ease: Easing.sine.easeOut
					}
				);
				for (let i = 0; i < 25; i++)
				{
					sequence.push({ tweens: [{ prop: 'x', to: (Utils.random(-35, 35) / 10) }, { prop: 'y', to: (Utils.random(-35, 35) / 10) }], duration: 2 * FRAME_RATE, ease: Easing.sine.easeInOut });
				}
				break;
			case "bossShining":
				sequence = [];
				for (let i = 0; i < 50; i++)
				{
					sequence.push({ tweens: [{ prop: 'x', to: (Utils.random(-35, 35) / 10) }, { prop: 'y', to: (Utils.random(-35, 35) / 10) }], duration: 100, ease: Easing.sine.easeOut });
				}
				break;
			case "bossExplosion":
				sequence = [];
				for (let i = 0; i < 3; i++)
				{
					sequence.push({ tweens: [{ prop: 'x', to: Utils.random(-12, 12) }, { prop: 'y', to: Utils.random(-7, 15) }], duration: 50, ease: Easing.sine.easeOut });
				}
				for (let i = 0; i < 3; i++)
				{
					sequence.push({ tweens: [{ prop: 'x', to: Utils.random(-10, 10) }, { prop: 'y', to: Utils.random(-7, 10) }], duration: 50, ease: Easing.sine.easeOut });
				}
				for (let i = 0; i < 3; i++)
				{
					sequence.push({ tweens: [{ prop: 'x', to: Utils.random(-5, 5) }, { prop: 'y', to: Utils.random(-5, 5) }], duration: 50, ease: Easing.sine.easeOut });
				}
				sequence.push({ tweens: [{ prop: "x", to: 0 }, { prop: "y", to: 0 }], duration: 50, ease: Easing.sine.easeOut });
				break;
			case "bigWinEnd":
				sequence = [];
				for (let i = 0; i < 5; i++)
				{
					sequence.push({ tweens: [{ prop: 'x', to: (Utils.random(-5, 5)) }, { prop: 'y', to: (Utils.random(-5, 5)) }], duration: 30, ease: Easing.sine.easeOut });
				}
				sequence.push({ tweens: [{ prop: "x", to: 0 }, { prop: "y", to: 0 }], duration: 50, ease: Easing.sine.easeOut });
				break;

			case "capsule":
				sequence = [];
				for (let i = 0; i < 5; i++)
				{
					sequence.push({ tweens: [{ prop: 'x', to: (Utils.random(-5, 5)) }, { prop: 'y', to: (Utils.random(-5, 5)) }], duration: 30, ease: Easing.sine.easeOut });
				}
				sequence.push({ tweens: [{ prop: "x", to: 0 }, { prop: "y", to: 0 }], duration: 50, ease: Easing.sine.easeOut });
				break;
			case "bomb":
				sequence = [];
				for (let i = 0; i < 4; i++)
				{
					sequence.push({ tweens: [{ prop: 'x', to: Utils.random(-15, 15) }, { prop: 'y', to: Utils.random(-10, 10) }], duration: 1 * FRAME_RATE, ease: Easing.sine.easeInOut });
				}
				sequence.push({ tweens: [{ prop: 'x', to: 0 }, { prop: 'y', to: 0 }], duration: 2 * FRAME_RATE, ease: Easing.sine.easeInOut });
				sequence.push({ tweens: [], duration: 10 * FRAME_RATE, ease: Easing.sine.easeInOut });
				sequence.push({ tweens: [{ prop: 'x', to: 10 }, { prop: 'y', to: 6 }], duration: 1 * FRAME_RATE, ease: Easing.sine.easeInOut });
				sequence.push({ tweens: [{ prop: 'x', to: 0 }, { prop: 'y', to: 0 }], duration: 1 * FRAME_RATE, ease: Easing.sine.easeInOut });
				sequence.push({ tweens: [], duration: 4 * FRAME_RATE, ease: Easing.sine.easeInOut });
				sequence.push({ tweens: [{ prop: 'x', to: 10 }, { prop: 'y', to: 6 }], duration: 1 * FRAME_RATE, ease: Easing.sine.easeInOut });
				sequence.push({ tweens: [{ prop: 'x', to: 0 }, { prop: 'y', to: 0 }], duration: 1 * FRAME_RATE, ease: Easing.sine.easeInOut });
				sequence.push({ tweens: [], duration: 6 * FRAME_RATE, ease: Easing.sine.easeInOut });
				sequence.push({ tweens: [{ prop: 'x', to: 10 }, { prop: 'y', to: 6 }], duration: 1 * FRAME_RATE, ease: Easing.sine.easeInOut });
				sequence.push({ tweens: [{ prop: 'x', to: 0 }, { prop: 'y', to: 0 }], duration: 1 * FRAME_RATE, ease: Easing.sine.easeInOut });
				sequence.push({ tweens: [], duration: 2 * FRAME_RATE, ease: Easing.sine.easeInOut });

				for (let i = 0; i < 10; i++)
				{
					sequence.push({ tweens: [{ prop: 'y', to: Utils.random(-2, 2) }], duration: 1 * FRAME_RATE, ease: Easing.sine.easeInOut });
				}
				sequence.push({ tweens: [{ prop: 'y', to: 0 }], duration: 1 * FRAME_RATE, ease: Easing.sine.easeInOut });
				sequence.push({ tweens: [], duration: 41 * FRAME_RATE, ease: Easing.sine.easeInOut });

				for (let i = 0; i < 16; i++)
				{
					sequence.push({ tweens: [{ prop: 'x', to: Utils.random(-15, 15) }, { prop: 'y', to: Utils.random(-10, 10) }], duration: 1 * FRAME_RATE, ease: Easing.sine.easeInOut });
				}
				sequence.push({ tweens: [{ prop: 'x', to: 0 }, { prop: 'y', to: 0 }], duration: 3 * FRAME_RATE, ease: Easing.sine.easeInOut });

				let lScale_seq = [
					{ tweens: [{ prop: 'scale.x', to: 1.02 }, { prop: 'scale.y', to: 1.02 }], duration: 1 * FRAME_RATE, ease: Easing.sine.easeInOut },
					{ tweens: [{ prop: 'scale.x', to: 1 }, { prop: 'scale.y', to: 1 }], duration: 4 * FRAME_RATE, ease: Easing.sine.easeInOut },
					{ tweens: [], duration: 10 * FRAME_RATE, ease: Easing.sine.easeInOut },
					{ tweens: [{ prop: 'scale.x', to: 1.02 }, { prop: 'scale.y', to: 1.02 }], duration: 1 * FRAME_RATE, ease: Easing.sine.easeInOut },
					{ tweens: [{ prop: 'scale.x', to: 1 }, { prop: 'scale.y', to: 1 }], duration: 1 * FRAME_RATE, ease: Easing.sine.easeInOut },
					{ tweens: [], duration: 4 * FRAME_RATE, ease: Easing.sine.easeInOut },
					{ tweens: [{ prop: 'scale.x', to: 1.02 }, { prop: 'scale.y', to: 1.02 }], duration: 1 * FRAME_RATE, ease: Easing.sine.easeInOut },
					{ tweens: [{ prop: 'scale.x', to: 1 }, { prop: 'scale.y', to: 1 }], duration: 1 * FRAME_RATE, ease: Easing.sine.easeInOut },
					{ tweens: [], duration: 6 * FRAME_RATE, ease: Easing.sine.easeInOut },
					{ tweens: [{ prop: 'scale.x', to: 1.02 }, { prop: 'scale.y', to: 1.02 }], duration: 1 * FRAME_RATE, ease: Easing.sine.easeInOut },
					{ tweens: [{ prop: 'scale.x', to: 1 }, { prop: 'scale.y', to: 1 }], duration: 1 * FRAME_RATE, ease: Easing.sine.easeInOut },
					{ tweens: [], duration: 2 * FRAME_RATE, ease: Easing.sine.easeInOut },
				]
				for (let i = 0; i < 10; i++)
				{
					lScale_seq.push({ tweens: [{ prop: 'scale.x', to: 1 + 0.01 * Utils.random(1, 3) }, { prop: 'scale.y', to: 1 + 0.01 * Utils.random(0, 2) }], duration: 1 * FRAME_RATE, ease: Easing.sine.easeInOut });
				}
				lScale_seq.push({ tweens: [{ prop: 'scale.x', to: 1 }, { prop: 'scale.y', to: 1 }], duration: 2 * FRAME_RATE, ease: Easing.sine.easeInOut });
				lScale_seq.push({ tweens: [], duration: 41 * FRAME_RATE, ease: Easing.sine.easeInOut });
				for (let i = 0; i < 16; i++)
				{
					lScale_seq.push({ tweens: [{ prop: 'scale.x', to: 1 + 0.01 * Utils.random(1, 4) }, { prop: 'scale.y', to: 1 + 0.01 * Utils.random(0, 3) }], duration: 1 * FRAME_RATE, ease: Easing.sine.easeInOut });
				}
				lScale_seq.push({ tweens: [{ prop: 'scale.x', to: 1 }, { prop: 'scale.y', to: 1 }], duration: 3 * FRAME_RATE, ease: Easing.sine.easeInOut });
				Sequence.start(container, lScale_seq);
				break;
			default:
				sequence = [
					{ tweens: [{ prop: "y", to: 5 }], duration: 30, ease: Easing.sine.easeOut },
					{ tweens: [{ prop: "y", to: 3 }], duration: 20, ease: Easing.sine.easeOut },
					{ tweens: [{ prop: "y", to: 7 }], duration: 50, ease: Easing.sine.easeOut },
					{ tweens: [{ prop: "y", to: 0 }], duration: 25, ease: Easing.sine.easeOut },
				];

				if (this.playersContainer)
				{
					let oy = 0; //initial playersContainer position
					let playersContainerRevSeq = [
						{ tweens: [{ prop: "y", to: oy - 5 }], duration: 30, ease: Easing.sine.easeOut },
						{ tweens: [{ prop: "y", to: oy - 3 }], duration: 20, ease: Easing.sine.easeOut },
						{ tweens: [{ prop: "y", to: oy - 7 }], duration: 50, ease: Easing.sine.easeOut },
						{ tweens: [{ prop: "y", to: oy }], duration: 25, ease: Easing.sine.easeOut },
					];
					Sequence.start(this.playersContainer, playersContainerRevSeq);
				}

				if (this.spot)
				{
					let oy = this.spot && this.spot.initialPosition.y;
					let spotContainerRevSeq = [
						{ tweens: [{ prop: "y", to: oy - 5 }], duration: 30, ease: Easing.sine.easeOut },
						{ tweens: [{ prop: "y", to: oy - 3 }], duration: 20, ease: Easing.sine.easeOut },
						{ tweens: [{ prop: "y", to: oy - 7 }], duration: 50, ease: Easing.sine.easeOut },
						{ tweens: [{ prop: "y", to: oy }], duration: 25, ease: Easing.sine.easeOut },
					];
					Sequence.start(this.spot, spotContainerRevSeq);
				}
				break;
		}

		if (sequence && sequence.length && container)
		{
			Sequence.start(container, sequence);
		}
	}

	_clearRoom()
	{
		Sequence.destroy(Sequence.findByTarget(this.container));
		this.container.x = 0;
		this.container.y = 0;
	}

	_addTimeLeftText()
	{
		if (APP.gameScreen.transitionViewController.info.isFeatureActive)
		{
			return;
		}

		if (!this._fWaitingCaption_spr)
		{
			this._fWaitingCaption_spr = this.addChild(APP.library.getSprite('preloader/loading_back'));
			this._fWaitingCaption_spr.zIndex = Z_INDEXES.WAITING_CAPTION;

			let lCaption_cta = this._fWaitingCaption_spr.addChild(I18.generateNewCTranslatableAsset('TAWaitingForNewRoundCaption'));
			lCaption_cta.position.set(0, 17);

			this._fWaitingCaption_spr.spinner = this._fWaitingCaption_spr.addChild(new PreloadingSpinner(2100, 110));
			this._fWaitingCaption_spr.spinner.position.y = -55;
			this._fWaitingCaption_spr.spinner.startAnimation();
		}
	}

	_removeTimeLeftText()
	{
		if (this._fWaitingCaption_spr)
		{
			this._fWaitingCaption_spr.spinner && this._fWaitingCaption_spr.spinner.destroy();

			this._fWaitingCaption_spr.destroy();
			this._fWaitingCaption_spr = null;
		}
	}

	_addRoomGradient()
	{
		if (!this._screenGradient)
		{
			let gradient = this.screen.addChild(APP.library.getSprite('gradient'));
			gradient.scale.x = 1.026; // to avoid gaps when ground shaking
			gradient.position.set(480, 525);
			gradient.zIndex = Z_INDEXES.GRADIENT;
			this._screenGradient = gradient;
		}
	}

	_removeRoomGradient()
	{
		this._screenGradient && this._screenGradient.destroy();
		this._screenGradient = null;
	}

	destroy()
	{
		super.destroy();
	}
}

export default GameFieldView