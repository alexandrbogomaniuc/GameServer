import Enemy from './Enemy';
import SpineEnemy from "./SpineEnemy";
import { STATE_WALK, STATE_STAY } from './Enemy';
import Sequence from '../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { ENEMIES, FRAME_RATE } from '../../../../shared/src/CommonConstants';
import FormationShockwaveAnimation from '../animation/formation/FormationShockwaveAnimation';
import FormationDeathAnimation from '../animation/formation/FormationDeathAnimation';
import FormationHighlightAnimation from '../animation/formation/FormationHighlightAnimation';
import FormationMisteryAnimation from '../animation/formation/FormationMisteryAnimation';
import Timer from "../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer";
import { Utils } from '../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import { Sprite } from '../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';

const MONEY_SCALE = Enemy.getEnemyDefaultScaleCoef(ENEMIES.Money);

const CRACK_PARAM = [
	{asset: "1", x: 54,    y: -72.5, xg: 55,    yg: -74}, //124 / 2 - 8, y: -157 / 2 + 6, xg: 126 / 2 - 8, xy: -160 / 2 + 6
	{asset: "2", x: -45,   y: 56.5,  xg: -47.5, yg: 57}, //-74 / 2 - 8, y: 101.5 / 2 + 6, xg: -79.5 / 2 - 8, xy: 102.5 / 2 + 6
	{asset: "3", x: 18,    y: 28,    xg: 14.5,  yg: 31}, //52.5 / 2 - 8, y: 44.5 / 2 + 6, xg: 45 / 2 - 8, xy: 50.5 / 2 + 6
	{asset: "4", x: -60.5, y: -54.5, xg: -60.5, yg: -55}, //-105 / 2 - 8, y: -121.5 / 2 + 6, xg: -105 / 2 - 8, xy: -122 / 2 + 6
	{asset: "final", x: -0.5, y: -5.5, xg: - 0.5, yg: -8} //15 / 2 - 8, y: -23.5 / 2 + 6, xg: 15 / 2 - 8, xy: -28 / 2 + 6
];

const MAX_CIRCULAR_ENEMY_COUNT = 22;
const QUARTER_CIRCULAR_ENEMY_COUNT = 5;

const CRACK_GLOW_PARAM_ANIM = [
	{x: 46,    y: -60,  anim: true, count: 3 * QUARTER_CIRCULAR_ENEMY_COUNT},
	{x: -50,   y: 64,   anim: true, count: 2 * QUARTER_CIRCULAR_ENEMY_COUNT},
	{x: 48.3,  y: 98.1, anim: true, count: QUARTER_CIRCULAR_ENEMY_COUNT},
	{x: 0,     y: 0,    anim: true, count: 0}, 
	{x: 0,     y: 0,    anim: true, count: 0}
];

export const SHIELD_DESTROY_ANIMATION_SPEED = 1.35;

class Money extends SpineEnemy
{
	static get EVENT_ON_ENEMY_START_DYING ()	{ return Enemy.EVENT_ON_ENEMY_START_DYING }

	constructor(params)
	{
		super(params);
	}

	hitDome(param)
	{
		if (param)
		{
			this._playHitHighlightAnimation();
			this._enemyShockwaveAnimation(param);
		}
	}

	updateCircularEnemyCount(aCount_num, aLastHand_bl)
	{
		this._updateCrackState(aCount_num, aLastHand_bl);
	}

	changeSpineView(type)
	{
		super.changeSpineView(type);
		
		let lOffset_obj = this._getOffset();
		let lX_num = lOffset_obj.x;
		let lY_num = lOffset_obj.y;
		this.spineView.position.set(lX_num, lY_num + 90);
	}

	updateOffsets()
	{
		super.updateOffsets()

		let lOffset_obj = this._getOffset();
		let lX_num = lOffset_obj.x;
		let lY_num = lOffset_obj.y;

		this.container.lockContainer && this.container.lockContainer.position.set(lX_num - 8, lY_num + 20);
	}

	_playHitHighlightAnimation(aTime_num)
	{
		if (this.isEnemyUnlocked)
		{
			super._playHitHighlightAnimation(aTime_num);
			return;
		}
		let lHitHighlightAnimation_fha = this._fTopContainer_sprt.addChild(new FormationHighlightAnimation());
		this._fHitHighlightAnimation_fha_arr.push(lHitHighlightAnimation_fha);
		lHitHighlightAnimation_fha.on(FormationHighlightAnimation.EVENT_ON_ANIMATION_ENDED, this._onFormationHighlightAnimationCompleted, this);
		lHitHighlightAnimation_fha.i_startAnimation();

		this._startDomWiggle();
	}

	_onFormationHighlightAnimationCompleted(e)
	{
		let lHitHighlightAnimation_fha = e.target;
		const lIndex_int = this._fHitHighlightAnimation_fha_arr.indexOf(lHitHighlightAnimation_fha);
		if (~lIndex_int)
		{
			this._fHitHighlightAnimation_fha_arr.splice(lIndex_int, 1);
		}
		lHitHighlightAnimation_fha && lHitHighlightAnimation_fha.destroy();
	}

	_startDomWiggle()
	{
		let l_seq = [
			{tweens: [{ prop: 'x', to: Utils.getRandomWiggledValue(0, 3)}, { prop: 'y', to: Utils.getRandomWiggledValue(0, 3)}], duration: 1 * FRAME_RATE},
			{tweens: [{ prop: 'x', to: Utils.getRandomWiggledValue(0, 3)}, { prop: 'y', to: Utils.getRandomWiggledValue(0, 3)}], duration: 1 * FRAME_RATE},
			{tweens: [{ prop: 'x', to: Utils.getRandomWiggledValue(0, 3)}, { prop: 'y', to: Utils.getRandomWiggledValue(0, 3)}], duration: 1 * FRAME_RATE},
			{
				tweens: [{ prop: 'x', to: Utils.getRandomWiggledValue(0, 3)}, { prop: 'y', to: Utils.getRandomWiggledValue(0, 3)}], duration: 1 * FRAME_RATE,
				onfinish: () =>
				{
					this._completeDomWiggle();
				}
			}
		]

		Sequence.start(this._fTopContainer_sprt, l_seq);
	}

	_completeDomWiggle()
	{
		this._fTopContainer_sprt.position.set(0, 0);
	}

	get isEnemyLockedForTarget()
	{
		return !this.isEnemyUnlocked;
	}

	get circularEnemyCount_num ()
	{
		return this._fCircularEnemyCount_num;
	}
	
	setEnemyUnlocked(aValue_bl)
	{
		this.isEnemyUnlocked = aValue_bl;
	}

	_initView()
	{
		this.isEnemyUnlocked = true;
		super._initView();

		this.container.scale.set(MONEY_SCALE + 0.1, MONEY_SCALE + 0.1);
		this.container.lockContainer= null;

		this._fCrack_spr_arr = [];
		this._fCrackGlow_spr_arr = [];
		this._fCrackTwoGlow_spr_arr = [];
		this._fCrackVisible_arr = [];
		this._fHitHighlightAnimation_fha_arr = [];

		this._fShockwaveAnimation_fsa_arr = [];
		this._fHitHighlightAnimation_fha_arr = [];

		this._fFormationMisteryAnimation_fma = null;
		this._fFormationMisteryTimer_t = null;
		this._fStartHiddenMoneyTimer_t = null;
		this._fIsDeathAnimationProgressCount_num = null;
		this._fLight2_spr = null;
		this._fFormationDeathAnimation_fda = null;
		this._fBottomRing_spr = null;
		this._fGlowRing_spr = null;

		this._fUnlockAnimationTimer_t = null;
	}

	__initTopFXContainer()
	{
		super.__initTopFXContainer();
		this._fTopContainer_sprt.scale.set(MONEY_SCALE, MONEY_SCALE);
		this.topCrackContainer = this._fTopContainer_sprt.addChild(new Sprite);

		this._fBottomRingContainer_spr = this._fTopContainer_sprt.addChild(new Sprite);
		this._fGlowRingContainer_spr = this._fTopContainer_sprt.addChild(new Sprite);
		this._fTopRingContainer_spr = this._fTopContainer_sprt.addChild(new Sprite);
	}

	get bottomRing()
	{
		return this._fBottomRing_spr || this._initBottomRing();
	}

	_initBottomRing()
	{
		
		this._fBottomRing_spr = this._fBottomRingContainer_spr.addChild(APP.library.getSprite("enemies/money/ring_bottom"));		
		return this._fBottomRing_spr
	}

	get glowRing()
	{
		return this._fGlowRing_spr || this._initGlowRing();
	}

	_initGlowRing()
	{
		this._fGlowRing_spr = this._fGlowRingContainer_spr.addChild(APP.library.getSprite("enemies/money/ring_glow"));
		this._fGlowRing_spr.alpha = 0;
		this._fGlowRing_spr.scale.set(2.202, 2.202);
		this._fGlowRing_spr.blendMode = PIXI.BLEND_MODES.ADD;
		return this._fGlowRing_spr
	}

	_initRingView()
	{
		this._initBottomRing();

		this._initGlowRing();

		this._fTopRing_spr = this._fTopContainer_sprt.addChild(APP.library.getSprite("enemies/money/ring_top"));

		for (let i = 0; i < CRACK_PARAM.length; i++)
		{
			this._fCrack_spr_arr[i] = this.topCrackContainer.addChild(APP.library.getSprite("enemies/money/crack_"+CRACK_PARAM[i].asset));
			this._fCrack_spr_arr[i].position.set(CRACK_PARAM[i].x, CRACK_PARAM[i].y);
			this._fCrack_spr_arr[i].alpha = 0;

			this._fCrackGlow_spr_arr[i] = this.topCrackContainer.addChild(APP.library.getSprite("enemies/money/crack_"+CRACK_PARAM[i].asset+"_glow"));
			this._fCrackGlow_spr_arr[i].position.set(CRACK_PARAM[i].xg, CRACK_PARAM[i].yg);
			this._fCrackGlow_spr_arr[i].alpha = 0;

			this._fCrackTwoGlow_spr_arr[i] = this.topCrackContainer.addChild(APP.library.getSprite("enemies/money/crack_"+CRACK_PARAM[i].asset+"_glow"));
			this._fCrackTwoGlow_spr_arr[i].position.set(CRACK_PARAM[i].xg, CRACK_PARAM[i].yg);
			this._fCrackTwoGlow_spr_arr[i].alpha = 0;
			this._fCrackTwoGlow_spr_arr[i].blendMode = PIXI.BLEND_MODES.ADD;

			this._fCrackVisible_arr[i] = false;
		}

		this._fCircularEnemyCount_num = MAX_CIRCULAR_ENEMY_COUNT;
	}

	lockMainEnemy()
	{
		this.container.lockContainer = this.container.addChild(new Sprite());
		this.container.lockContainer.scale.set(0.22, 0.22) 
		this._fLockContainer_sw = this.container.lockContainer.addChild(this._generateLockSpineView());
		this.container.lockContainer.spineView.view.state.timeScale = 1;
		this.container.lockContainer.spineView.setAnimationByName(0, "unlock", false);
		this.container.lockContainer.zIndex = 10;
	}

	_generateLockSpineView()
	{
		let lSpineView = this.container.lockContainer.spineView = APP.spineLibrary.getSprite('enemies/money/lock_vfx/lock_vfx');
		this.container.lockContainer.spineView.setAnimationsDefaultMixDuration(0);
		lSpineView.anchor.set(0.5, 0.5)

		return lSpineView;
	}

	_updateCrackState(aCircularEnemyCount_num, aLastHand_bl)
	{
		if (
			aCircularEnemyCount_num == undefined ||
			aCircularEnemyCount_num == null || 
			!aLastHand_bl && aCircularEnemyCount_num >= this._fCircularEnemyCount_num
		)
		{
			return;
		}

		if (aCircularEnemyCount_num > 0 && aLastHand_bl && !this.container.lockContainer)
		{
			this._initRingView();
			this.lockMainEnemy();
			this.setStay();
		}

		this._fCircularEnemyCount_num = aCircularEnemyCount_num;
		let lStateChange_bl = false;

		for (let i = 0; i < this._fCrackVisible_arr.length; i++)
		{
			if (this._fCrackVisible_arr[i] && !aLastHand_bl)
			{
				continue;
			}
			else
			{
				if (this._fCircularEnemyCount_num <= CRACK_GLOW_PARAM_ANIM[i].count)
				{
					this._fCrackVisible_arr[i] = true;
					this._startCrackIntro(i, aLastHand_bl);
					lStateChange_bl = true;
				}
				else if (aLastHand_bl)
				{
					this._fCrackVisible_arr[i] = false;
					this._fCrack_spr_arr[i].alpha = 0;
					this._fCrackGlow_spr_arr[i].alpha = 0;
					this._fCrackTwoGlow_spr_arr[i].alpha = 0;
				}
			}
		}

		if (lStateChange_bl || this._fCircularEnemyCount_num > 0)
		{
			this._glowHitAnimation();
			this._startDomWiggle();
		}

		this.isEnemyUnlocked = this._fCircularEnemyCount_num == 0;
		//TODO: Start Destroy Shield
		if(this._fCircularEnemyCount_num <= 0 && !aLastHand_bl)
		{
			this._playShieldAndLockDestroyAnimation();
		}
	}

	_startCrackIntro(i, aLastHand_bl = false)
	{
		let lCrack_spr = this._fCrack_spr_arr[i];
		lCrack_spr.alpha = 1;

		if (aLastHand_bl)
		{
			return;
		}

		let lCrackGlow_spr = this._fCrackGlow_spr_arr[i];
		lCrackGlow_spr.alpha = 0;

		let l_seq = [
			{tweens: [{prop: 'alpha', to: 1}], duration: 3 * FRAME_RATE},
			{tweens: [{prop: 'alpha', to: 0}], duration: 61 * FRAME_RATE}
		];
		Sequence.start(lCrackGlow_spr, l_seq);

		if (CRACK_GLOW_PARAM_ANIM[i].anim)
		{
			let lCrackTwoGlow_spr = this._fCrackTwoGlow_spr_arr[i];
			lCrackTwoGlow_spr.position.set(CRACK_PARAM[i].xg, CRACK_PARAM[i].yg);
			lCrackTwoGlow_spr.alpha = 0.78;
			l_seq = [
				{tweens: [
					{prop: 'x', to: CRACK_PARAM[i].xg + CRACK_GLOW_PARAM_ANIM[i].x}, 
					{prop: 'y', to: CRACK_PARAM[i].yg + CRACK_GLOW_PARAM_ANIM[i].y}, 
					{prop: 'alpha', to: 0}
				], duration: 14 * FRAME_RATE}
			];
			Sequence.start(lCrackTwoGlow_spr, l_seq);
		}
		
	}

	_glowHitAnimation()
	{
		Sequence.destroy(Sequence.findByTarget(this.glowRing));

		this.glowRing.alpha = 1;

		let l_seq = [
			{tweens: [ {prop: 'alpha', to: 0}], duration: 38 * FRAME_RATE}
		]

		Sequence.start(this.glowRing, l_seq);
	}

	_enemyShockwaveAnimation(param)
	{
		let lShockwaveAnimation_fsa = new FormationShockwaveAnimation();
		let lShockwaveAnimationContainer_spr = APP.gameScreen.gameFieldController.moneyEnemyShockwaveContainer.container.addChild(lShockwaveAnimation_fsa);
		lShockwaveAnimationContainer_spr.zIndex = APP.gameScreen.gameFieldController.moneyEnemyShockwaveContainer.zIndex;

		lShockwaveAnimation_fsa.on(FormationShockwaveAnimation.EVENT_ON_ANIMATION_ENDED, this._onEnemyShockwaveAnimationCompleted, this);
		this._fShockwaveAnimation_fsa_arr.push(lShockwaveAnimation_fsa);

		lShockwaveAnimation_fsa.scale.set(0.6998, 0.6998); //1.296 * 0.54, 1.296 * 0.54
		let angle = Utils.getAngle({x: this.x, y: this.y}, {x: param.x, y: param.y});
		lShockwaveAnimation_fsa.rotation = - angle;
		lShockwaveAnimation_fsa.position.set(this.x + Math.sin(angle) * (param.radius - 20), this.y + Math.cos(angle) * (param.radius - 20));

		lShockwaveAnimation_fsa.i_startAnimation();
	}

	_onEnemyShockwaveAnimationCompleted(e)
	{
		let lShockwaveAnimation_fsa = e.target;
		const lIndex_int = this._fShockwaveAnimation_fsa_arr.indexOf(lShockwaveAnimation_fsa);
		if (~lIndex_int)
		{
			this._fShockwaveAnimation_fsa_arr.splice(lIndex_int, 1);
		}
		lShockwaveAnimation_fsa && lShockwaveAnimation_fsa.destroy();
	}

	__getBodyBounds()
	{
		if (this.isEnemyUnlocked)
		{
			return this.container.getBounds();
		}

		return this.bottomRing.getBounds();
	}

	__getPositionFreezeOffsetX()
	{
		if (this.isEnemyUnlocked)
		{
			return super.__getPositionFreezeOffsetX();
		}
		return -30;
	}

	__getBodyRotation()
	{
		return 0;
	}

	__getPositionFreezeOffsetY()
	{
		return 100;
	}

	__getBodyZIndex()
	{
		if (this.isEnemyUnlocked)
		{
			return this.container.zIndex;
		}
		return this.bottomRing.zIndex;
	}

	__getSpineViewForMask()
	{
		if (this.isEnemyUnlocked)
		{
			return super.__getSpineViewForMask();
		}

		return this.bottomRing;
	}

	playHitHighlightAnimation(aTime_num)
	{
		super.playHitHighlightAnimation(aTime_num);
	}

	onPointerRightClick(x, y)
	{
		return super.onPointerRightClick(x, y);
	}

	isCollision(aX_num, aY_num)
	{
		if (this.isEnemyUnlocked)
		{
			return super.isCollision(aX_num, aY_num);
		}
		if(
			!this.container.visible ||
			!this.bottomRing ||
			!this.bottomRing._bounds
		)
		{
			return false;
		}

		let lViewBounds_obj = this.__getBodyBounds();
		let lBoundsLeftX_num = lViewBounds_obj.left;
		let lBoundsRightX_num = lViewBounds_obj.right;
		let lBoundsTopY_num = lViewBounds_obj.top;
		let lBoundsBottomY_num = lViewBounds_obj.bottom;

		if(
			Math.abs(lBoundsLeftX_num) === Infinity ||
			Math.abs(lBoundsRightX_num) === -Infinity ||
			Math.abs(lBoundsTopY_num) === Infinity ||
			Math.abs(lBoundsBottomY_num) === -Infinity
			)
		{
			this._fIsUndetectableSpineBodyBounds_bl = true;
		}
		//...BODY BOUNDS

		//CHECK IF POINT INSIDE SPINE RECTANGLE BOUNDS...
		if(
			!this._fIsUndetectableSpineBodyBounds_bl &&
			!lViewBounds_obj.contains(aX_num, aY_num)
		)
		{
			return false; //not even close, no collision
		}
		//...CHECK IF POINT INSIDE SPINE RECTANGLE BOUNDS

		//CHECK ELIIPSE INSIDE SPINE RECTANGLE BOUNDS IF ONLY SIMPLE CHECK IS REQUIRED...
		if(this.__isSimpleCollisionEnemy())
		{
			let lW_num = (lBoundsRightX_num - lBoundsLeftX_num) / 2;
			let lH_num = (lBoundsBottomY_num - lBoundsTopY_num) / 2;
			return (
					this._isPointInsideEllipse(
						aX_num,
						aY_num,
						lBoundsLeftX_num + lW_num,
						lBoundsTopY_num + lH_num,
						lW_num,
						lH_num)
					);
		}
		//...CHECK ELIIPSE INSIDE SPINE RECTANGLE BOUNDS IF ONLY SIMPLE CHECK IS REQUIRED

	}

	isTargetable()
	{
		if(this.life === 0)
		{
			return false;
		}

		if(this._fDeathAnimationInProgress_bl)
		{
			return false;
		}

		let lEnemyPos_pt = this.getCenterPosition();
		let lPossibleCenter_pt = this._getPositionConsideringScreenEdges(lEnemyPos_pt);

		//is out of screen
		return Utils.isPointInsideRect(new PIXI.Rectangle(this.crosshairPaddingXLeft, this.crosshairPaddingYBottom, APP.config.size.width - this.crosshairPaddingXRight, APP.config.size.height - this.crosshairPaddingYTop), lPossibleCenter_pt);
	}

	changeView()
	{
		//override
	}

	get _isSupportRotateInMotion()
	{
		return false;
	}

	get _isSupportDirectionChange()
	{
		return false;
	}

	//override
	get isCritter()
	{
		return true;
	}

	_startSpinePlaying()
	{
		//override
		if (this.isEnemyUnlocked)
		{
			super._startSpinePlaying();
		}
	}

	//override
	_calculateAnimationLoop()
	{
		let animationLoop = true;

		return animationLoop;
	}

	// override
	getSpineSpeed()
	{
		let lSpeed_num = 1;
		return lSpeed_num
	}

	//override
	_calculateAnimationName()
	{
		let animationName = this.getWalkAnimationName();
		return animationName;
	}

	// override
	_calculateSpineSpriteNameSuffix()
	{
		return '';
	}

	__freeze(aIsAnimated_bl=true)
	{
		super.__freeze(aIsAnimated_bl);
	}

	//override
	__resumeSpineAnimationAfterUnfreeze()
	{
		if (this.isEnemyUnlocked)
		{
			super.__resumeSpineAnimationAfterUnfreeze();
		}
	}

	//override
	_getHitRectWidth()
	{
		return 230;
	}

	//override
	_getHitRectHeight()
	{
		return 230;
	}

	getCurrentFootPointPosition()
	{
		return this.position;
	}

	//override
	__isSimpleCollisionEnemy()
	{
		if (this.isEnemyUnlocked)
		{
			return false;
		}
		return true;
	}

	getHitRectangle()
	{
		let rect = new PIXI.Rectangle();
		rect.width = this.isBoss ? 20 : 10;
		rect.height = Math.abs(this.getCurrentFootPointPosition().y) / (this.isBoss ? 1.2 : 2);
		return rect;
	}

	setDeath(aIsInstantKill_bl = false, aPlayerWin_obj = null)
	{
		super.setDeath(aIsInstantKill_bl, aPlayerWin_obj);
		this.emit(Enemy.EVENT_ON_DEATH_COIN_AWARD);
	}

	_playShieldAndLockDestroyAnimation()
	{
		this._fIsDeathAnimationProgressCount_num = 0;

		this._playDeathWiggle();
		this._playGlowDeathAnimation();
		this._playDeathCrackGlowAnimation();
		this._playFormationDeathFXAnimation();
		this._playMisteryAnimation();
		this._playMoneyVisibleAnimation();
		this._playLight2Animation();
		this._playUnlockAnimation();
	}

	_playDeathWiggle()
	{
		let l_seq = [
			{tweens: [], duration: 5 * FRAME_RATE},
			{tweens: [{prop: 'x', to: 3.8}], duration: 4 * FRAME_RATE},
			{tweens: [{prop: 'x', to: 1.4}, {prop: 'y', to: -7.5}], duration: 5 * FRAME_RATE / SHIELD_DESTROY_ANIMATION_SPEED},
			{tweens: [{prop: 'x', to: 0},   {prop: 'y', to: 0}], duration: 5 * FRAME_RATE / SHIELD_DESTROY_ANIMATION_SPEED},
			{tweens: [{prop: 'x', to: -40}, {prop: 'y', to: -15}], duration: 4 * FRAME_RATE / SHIELD_DESTROY_ANIMATION_SPEED},
			{tweens: [{prop: 'x', to: 0},  {prop: 'y', to: 0}], duration: 5 * FRAME_RATE / SHIELD_DESTROY_ANIMATION_SPEED},
			{tweens: [{prop: 'x', to: -5}, {prop: 'y', to: -31}], duration: 5 * FRAME_RATE / SHIELD_DESTROY_ANIMATION_SPEED},
			{tweens: [{prop: 'x', to: 18},  {prop: 'y', to: 9}], duration: 5 * FRAME_RATE / SHIELD_DESTROY_ANIMATION_SPEED},
			{tweens: [{prop: 'x', to: 0},  {prop: 'y', to: 0}], duration: 8 * FRAME_RATE / SHIELD_DESTROY_ANIMATION_SPEED},
			{tweens: [{prop: 'x', to: -30}, {prop: 'y', to: 14}], duration: 5 * FRAME_RATE / SHIELD_DESTROY_ANIMATION_SPEED},
			{tweens: [{prop: 'x', to: 0},  {prop: 'y', to: 0}], duration: 6 * FRAME_RATE / SHIELD_DESTROY_ANIMATION_SPEED},
			{tweens: [{prop: 'x', to: 31},  {prop: 'y', to: -30}], duration: 3 * FRAME_RATE / SHIELD_DESTROY_ANIMATION_SPEED},
			{tweens: [{prop: 'x', to: 0},  {prop: 'y', to: 0}], duration: 5 * FRAME_RATE / SHIELD_DESTROY_ANIMATION_SPEED},
			{tweens: [{prop: 'x', to: 4},   {prop: 'y', to: 14}], duration: 2 * FRAME_RATE / SHIELD_DESTROY_ANIMATION_SPEED},
			{tweens: [{prop: 'x', to: -7}, {prop: 'y', to: 4}], duration: 2 * FRAME_RATE / SHIELD_DESTROY_ANIMATION_SPEED},
			{tweens: [{prop: 'x', to: -11}, {prop: 'y', to: 11}], duration: 3 * FRAME_RATE / SHIELD_DESTROY_ANIMATION_SPEED},
			{tweens: [{prop: 'x', to: 10},  {prop: 'y', to: 11}], duration: 2 * FRAME_RATE / SHIELD_DESTROY_ANIMATION_SPEED},
			{tweens: [{prop: 'x', to: 0}, {prop: 'y', to: 0}], duration: 7 * FRAME_RATE / SHIELD_DESTROY_ANIMATION_SPEED,
				onfinish: () => {
					this._fIsDeathAnimationProgressCount_num--;
					this._completeDeathAnimationSuspicision();
				}}];

		this._fIsDeathAnimationProgressCount_num++;
		this._fIsDeathAnimationProgressCount_num++;
		Sequence.start(this.container, l_seq);
		Sequence.start(this._fTopContainer_sprt, l_seq);
	}

	_playFormationDeathFXAnimation()
	{
		let lFormationDeathAnimation_fda =  this._fFormationDeathAnimation_fda = this._fTopContainer_sprt.addChild(new FormationDeathAnimation({x: this.x, y: this.y}));
		lFormationDeathAnimation_fda.on(FormationDeathAnimation.EVENT_ON_ANIMATION_ENDED, this._onDeathFXAnimationCompleted, this);
		this._fIsDeathAnimationProgressCount_num++;
		lFormationDeathAnimation_fda.i_startAnimation();
	}

	_onDeathFXAnimationCompleted()
	{
		this._fFormationDeathAnimation_fda && this._fFormationDeathAnimation_fda.destroy();
		this._fIsDeathAnimationProgressCount_num--;

		if (this.__fIsFrozen_bl)
		{
			if (!this.isStayState)
			{
				this.setStay();
			}
		}
		else
		{
			this.setWalk();
			this.spineView && this.spineView.play();
		}
		
		this.setEnemyUnlocked(true);

		this._completeDeathAnimationSuspicision();
	}

	_playUnlockAnimation()
	{
		this._fUnlockAnimationTimer_t = new Timer(() =>
		{
			this._fUnlockAnimationTimer_t && this._fUnlockAnimationTimer_t.destructor();
			this.container.lockContainer.spineView.play();
		}, 90 * FRAME_RATE / SHIELD_DESTROY_ANIMATION_SPEED);
	}

	_playGlowDeathAnimation()
	{
		if (!APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			return;
		}

		Sequence.destroy(Sequence.findByTarget(this.glowRing));

		this.glowRing.alpha = 0;

		let l_seq = [
			{tweens: [], duration: 39 * FRAME_RATE / SHIELD_DESTROY_ANIMATION_SPEED},
			{tweens: [{prop: 'alpha', to: 0.8}], duration: 40 * FRAME_RATE / SHIELD_DESTROY_ANIMATION_SPEED,
				onfinish: () => {
					this._fIsDeathAnimationProgressCount_num--;
					this._completeDeathAnimationSuspicision();
				}}];

		this._fIsDeathAnimationProgressCount_num++;
		Sequence.start(this.glowRing, l_seq);
	}

	_playDeathCrackGlowAnimation()
	{
		let lCrackGlow0_spr = this._fCrackGlow_spr_arr[0];
		lCrackGlow0_spr.alpha = 0;

		let l_seq = [
			{tweens: [], duration: 29 * FRAME_RATE / SHIELD_DESTROY_ANIMATION_SPEED},
			{tweens: [{prop: 'alpha', to: 0.7}], duration: 52 * FRAME_RATE / SHIELD_DESTROY_ANIMATION_SPEED,
				onfinish: () => {
					this._fIsDeathAnimationProgressCount_num--;
					this._completeDeathAnimationSuspicision();
				}}];
		this._fIsDeathAnimationProgressCount_num++;
		Sequence.start(lCrackGlow0_spr, l_seq);

		let lCrackGlow1_spr = this._fCrackGlow_spr_arr[1];
		lCrackGlow1_spr.alpha = 0;

		l_seq = [
			{tweens: [], duration: 25 * FRAME_RATE / SHIELD_DESTROY_ANIMATION_SPEED},
			{tweens: [{prop: 'alpha', to: 0.7}], duration: 56 * FRAME_RATE / SHIELD_DESTROY_ANIMATION_SPEED,
				onfinish: () => {
					this._fIsDeathAnimationProgressCount_num--;
					this._completeDeathAnimationSuspicision();
				}}];
		this._fIsDeathAnimationProgressCount_num++;
		Sequence.start(lCrackGlow1_spr, l_seq);

		let lCrackGlow2_spr = this._fCrackGlow_spr_arr[2];
		lCrackGlow2_spr.alpha = 0;

		l_seq = [
			{tweens: [], duration: 18 * FRAME_RATE / SHIELD_DESTROY_ANIMATION_SPEED},
			{tweens: [{prop: 'alpha', to: 0.7}], duration: 59 * FRAME_RATE / SHIELD_DESTROY_ANIMATION_SPEED,
				onfinish: () => {
					this._fIsDeathAnimationProgressCount_num--;
					this._completeDeathAnimationSuspicision();
				}}];
		this._fIsDeathAnimationProgressCount_num++;
		Sequence.start(lCrackGlow2_spr, l_seq);

		let lCrackGlow3_spr = this._fCrackGlow_spr_arr[3];
		lCrackGlow3_spr.alpha = 0;

		l_seq = [
			{tweens: [{prop: 'alpha', to: 1}], duration: 2 * FRAME_RATE / SHIELD_DESTROY_ANIMATION_SPEED},
			{tweens: [{prop: 'alpha', to: 0.27}], duration: 25 * FRAME_RATE / SHIELD_DESTROY_ANIMATION_SPEED},
			{tweens: [{prop: 'alpha', to: 0.7}], duration: 48 * FRAME_RATE / SHIELD_DESTROY_ANIMATION_SPEED,
				onfinish: () => {
					this._fIsDeathAnimationProgressCount_num--;
					this._completeDeathAnimationSuspicision();
				}}];
		this._fIsDeathAnimationProgressCount_num++;
		Sequence.start(lCrackGlow3_spr, l_seq);

		let lCrackGlow4_spr = this._fCrackGlow_spr_arr[4];
		lCrackGlow4_spr.alpha = 0;

		l_seq = [
			{tweens: [{prop: 'alpha', to: 1}], duration: 2 * FRAME_RATE / SHIELD_DESTROY_ANIMATION_SPEED},
			{tweens: [{prop: 'alpha', to: 0.27}], duration: 25 * FRAME_RATE / SHIELD_DESTROY_ANIMATION_SPEED},
			{tweens: [{prop: 'alpha', to: 0.7}], duration: 54 * FRAME_RATE / SHIELD_DESTROY_ANIMATION_SPEED,
				onfinish: () => {
					this._fIsDeathAnimationProgressCount_num--;
					this._completeDeathAnimationSuspicision();
				}}];
		this._fIsDeathAnimationProgressCount_num++;
		Sequence.start(lCrackGlow4_spr, l_seq);
	}

	_playMisteryAnimation()
	{
		this._fIsDeathAnimationProgressCount_num++;
		this._fFormationMisteryTimer_t = new Timer(() =>
		{
			this._fFormationMisteryTimer_t && this._fFormationMisteryTimer_t.destructor();
			let lFireSmokeAnimation_ffsa =  this._fFormationMisteryAnimation_fma = this._fTopContainer_sprt.addChild(new FormationMisteryAnimation());
			lFireSmokeAnimation_ffsa.on(FormationMisteryAnimation.EVENT_ON_ANIMATION_ENDED, this._onFormationMisteryAnimationCompleted, this);
			lFireSmokeAnimation_ffsa.scale.set(1.5725, 1.5725); //0.85 * 1.85, 0.85 * 1.85
			lFireSmokeAnimation_ffsa.i_startAnimation();
		}, 77 * FRAME_RATE / SHIELD_DESTROY_ANIMATION_SPEED);
	}

	_onFormationMisteryAnimationCompleted()
	{
		this._fFormationMisteryAnimation_fma && this._fFormationMisteryAnimation_fma.destroy();
		this._fIsDeathAnimationProgressCount_num--;
		this._completeDeathAnimationSuspicision();
	}
	
	_playMoneyVisibleAnimation()
	{
		this._fIsDeathAnimationProgressCount_num++;
		this._fStartHiddenMoneyTimer_t = new Timer(() =>
		{
			this._fStartHiddenMoneyTimer_t && this._fStartHiddenMoneyTimer_t.destructor();
			this.bottomRing.alpha = 0;
			this.glowRing.alpha = 0;
			this._fTopRing_spr.alpha = 0;
			this.topCrackContainer.alpha = 0;
			this._fIsDeathAnimationProgressCount_num--;
			this._completeDeathAnimationSuspicision();
		}, 89 * FRAME_RATE / SHIELD_DESTROY_ANIMATION_SPEED); //89
	}

	_playLight2Animation()
	{
		if (!APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			return;
		}

		let lLight2_spr = this._fLight2_spr = this.addChild(APP.library.getSprite("enemies/money/death/fx_light_2"));
		lLight2_spr.alpha = 0;
		lLight2_spr.scale.set(2.9, 2.9);
		lLight2_spr.position.set(- 173, -170);
		lLight2_spr.blendMode = PIXI.BLEND_MODES.ADD;

		let l_seq = [
			{tweens: [], duration: 47 * FRAME_RATE / SHIELD_DESTROY_ANIMATION_SPEED},
			{tweens: [{prop: 'alpha', to: 0.1}], duration: 31 * FRAME_RATE / SHIELD_DESTROY_ANIMATION_SPEED},
			{tweens: [{prop: 'alpha', to: 0.7}], duration: 4 * FRAME_RATE / SHIELD_DESTROY_ANIMATION_SPEED},
			{tweens: [{prop: 'alpha', to: 0}], duration: 32 * FRAME_RATE / SHIELD_DESTROY_ANIMATION_SPEED,
				onfinish: () => {
					lLight2_spr && lLight2_spr.destroy();
					this._fIsDeathAnimationProgressCount_num--;
					this._completeDeathAnimationSuspicision();
				}}];
		this._fIsAnimationProgressCount_num++;
		Sequence.start(lLight2_spr, l_seq);
	}

	_completeDeathAnimationSuspicision()
	{
		if (this._fIsDeathAnimationProgressCount_num <= 0)
		{
			this._destroyAnimations();
		}
	}

	get __maxCrosshairDeviationOnEnemyX() //maximum deviation in X position of the cursor on the body of the enemy
	{
		return 50;
	}

	get __maxCrosshairDeviationOnEnemyY() //maximum deviation in Y position of the cursor on the body of the enemy
	{
		return 50;
	}

	_destroyAnimations()
	{
		this.bottomRing.alpha = 0;

		for (let i = 0; i < this._fCrack_spr_arr.length; i++)
		{
			Sequence.destroy(Sequence.findByTarget(this._fCrack_spr_arr[i]));
			this._fCrack_spr_arr[i] && this._fCrack_spr_arr[i].destroy();
			this._fCrack_spr_arr[i] = null;

			Sequence.destroy(Sequence.findByTarget(this._fCrackGlow_spr_arr[i]));
			this._fCrackGlow_spr_arr[i] && this._fCrackGlow_spr_arr[i].destroy();
			this._fCrackGlow_spr_arr[i] = null;

			Sequence.destroy(Sequence.findByTarget(this._fCrackTwoGlow_spr_arr[i]));
			this._fCrackTwoGlow_spr_arr[i] && this._fCrackTwoGlow_spr_arr[i].destroy();
			this._fCrackTwoGlow_spr_arr[i] = null;
		}

		for (let i = 0; i < this._fHitHighlightAnimation_fha_arr.length; i++)
		{
			this._fHitHighlightAnimation_fha_arr[i] && this._fHitHighlightAnimation_fha_arr[i].destroy();
			this._fHitHighlightAnimation_fha_arr[i] = null;
		}
		this._fHitHighlightAnimation_fha_arr = [];

		for (let i = 0; i < this._fShockwaveAnimation_fsa_arr.length; i++)
		{
			this._fShockwaveAnimation_fsa_arr[i] && this._fShockwaveAnimation_fsa_arr[i].destroy();
			this._fShockwaveAnimation_fsa_arr[i] = null;
		}
		this._fShockwaveAnimation_fsa_arr = [];

		Sequence.destroy(Sequence.findByTarget(this._fLight2_spr));
		this._fLight2_spr && this._fLight2_spr.destroy();
		this._fLight2_spr = null;
		
		Sequence.destroy(Sequence.findByTarget(this._fGlowRing_spr));
		this._fGlowRing_spr && this._fGlowRing_spr.destroy();
		this._fGlowRing_spr = null;

		this._fFormationMisteryTimer_t && this._fFormationMisteryTimer_t.destructor();
		this._fFormationMisteryTimer_t = null;

		this._fFormationMisteryAnimation_fma && this._fFormationMisteryAnimation_fma.destroy();
		this._fFormationMisteryAnimation_fma = null;

		this._fFormationDeathAnimation_fda && this._fFormationDeathAnimation_fda.destroy();
		this._fFormationDeathAnimation_fda = null;

		this._fStartHiddenMoneyTimer_t && this._fStartHiddenMoneyTimer_t.destructor();
		this._fStartHiddenMoneyTimer_t = null;
	}

	destroy(purely = false)
	{
		this.container.lockContainer && Sequence.destroy(Sequence.findByTarget(this.container.lockContainer));

		this._destroyAnimations();

		this._fUnlockAnimationTimer_t && this._fUnlockAnimationTimer_t.destructor();
		this._fUnlockAnimationTimer_t = null;

		if (this.shadow)
		{
			Sequence.destroy(Sequence.findByTarget(this.shadow));
			this.shadow.view && Sequence.destroy(Sequence.findByTarget(this.shadow.view));
			this.shadow && this.shadow.destroy();
			this.shadow = null;
		}

		Sequence.destroy(Sequence.findByTarget(this._fTopContainer_sprt));
		this._fTopContainer_sprt && this._fTopContainer_sprt.destroy();
		this._fTopContainer_sprt = null;

		Sequence.destroy(Sequence.findByTarget(this.container));
		this.container && this.container.destroy();
		this.container = null;

		super.destroy(purely);
	}
}

export default Money;