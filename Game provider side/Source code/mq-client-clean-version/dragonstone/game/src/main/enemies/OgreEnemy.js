import Enemy, { DIRECTION, STATE_IMPACT, STATE_RAGE } from "./Enemy";
import RageEnemy from './RageEnemy';
import { APP } from '../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import BigEnemyDeathFxAnimation from "../animation/death/BigEnemyDeathFxAnimation";
import { Sequence } from "../../../../../common/PIXI/src/dgphoenix/unified/controller/animation";
import DeathFxAnimation from "../animation/death/DeathFxAnimation";
import OgreDeathFxAnimation from "../animation/death/OgreDeathFxAnimation";
import { BulgePinchFilter } from '../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Filters';
import { Utils } from "../../../../../common/PIXI/src/dgphoenix/unified/model/Utils";

class OgreEnemy extends RageEnemy 
{
	static get EVENT_OGRE_CALLOUT_CREATED()			{return "EVENT_OGRE_CALLOUT_CREATED";}
	static get EVENT_OGRE_START_RAGE()				{return "EVENT_OGRE_START_RAGE";}

	constructor(params, aGameField_gf)
	{
		super(params);
		this._fGameField_gf = aGameField_gf;
		this._fIsCalloutAwaiting_bl = true;
		this._fIsRageStage_bl = this.energy !== this.fullEnergy;

		this.on(RageEnemy.EVENT_START_RAGE, this._startRageSound, this)
		
		if (this._fIsRageStage_bl)
		{
			this._startTintAnimation();
		}
	}

	_startRageSound()
	{
		this.emit(OgreEnemy.EVENT_OGRE_START_RAGE);
	}
	//override
	__generateIgnoreCollisionsBodyPartsNames()
	{
		return [
			"cub",
			"Club",
			"cup"
			];
	}

	//override...
	getImageName()
	{
		return 'enemies/ogre/Ogre';
	}

	setImpact()
	{
		if (this._fEnergy_num !== this._fFullEnergy_num && !this._fIsRageStage_bl)
		{
			this.startRageAnimation();
			this._startTintAnimation();
		}
		super.setImpact();
	}

	//override...
	getSpineSpeed()
	{
		let lSpeed_num = 0.195;
		let lTrajectorySpeed = this.currentTrajectorySpeed;

		let lSpineSpeed_num = lSpeed_num * lTrajectorySpeed / 1.2;

		if (this.isImpactState)
		{
			lSpineSpeed_num *= 1.2;
		}

		if (this.state == STATE_RAGE)
		{
			lSpineSpeed_num = 1;
		}
		
		return lSpineSpeed_num;
	}

	//override
	get isBodyOutOfScreen()
	{
		let lCurrentGlobalFootPointPos = this.getCurrentGlobalFootPointPosition();
		const lX_Offset_num = 200;
		const lY_Offset_num = 165;

		if (!this.prevTurnPoint || !this.nextTurnPoint) 
		{
			return true;
		}

		if (	(	this.prevTurnPoint.x < this.nextTurnPoint.x 
					&& (lCurrentGlobalFootPointPos.x + lX_Offset_num) >= 0 
					&& (this.prevTurnPoint.y < this.nextTurnPoint.y && (lCurrentGlobalFootPointPos.y + lY_Offset_num) >= 0
						|| this.prevTurnPoint.y > this.nextTurnPoint.y && (lCurrentGlobalFootPointPos.y - lY_Offset_num) <= 540 + lY_Offset_num
						)
				)
				|| 
				(	this.prevTurnPoint.x > this.nextTurnPoint.x 
					&& (lCurrentGlobalFootPointPos.x - lX_Offset_num) <= 960
					&& (this.prevTurnPoint.y < this.nextTurnPoint.y && (lCurrentGlobalFootPointPos.y + lY_Offset_num) >= 0
						|| this.prevTurnPoint.y > this.nextTurnPoint.y && (lCurrentGlobalFootPointPos.y - lY_Offset_num) <= 540 + lY_Offset_num
						)
				)
			)
		{
			return false;
		}

		return true;
	}

	//override
	tick()
	{
		super.tick();

		if (this._fIsCalloutAwaiting_bl)
		{
			if(!this.isBodyOutOfScreen)
			{
				this._fIsCalloutAwaiting_bl = false;
				this.emit(OgreEnemy.EVENT_OGRE_CALLOUT_CREATED);
			}
		}
	}

	// override
	_generateDeathFxAnimation()
	{
		return new OgreDeathFxAnimation();
	}

	//override...
	_getHitRectWidth()
	{
		return 151;
	}

	//override...
	_getHitRectHeight()
	{
		return 216;
	}
	
	//override...
	changeShadowPosition()
	{
		let pos = { x: 0, y: 0 }, scale = 2.35, alpha = 1;
		switch (this.direction)
		{
			case DIRECTION.LEFT_DOWN:	pos = {x: 10.5, y : 1.8};	break;
			case DIRECTION.LEFT_UP:		pos = {x: 0, y :-10.5};	break;
			case DIRECTION.RIGHT_DOWN:	pos = {x: 15.6, y :0};	break;
			case DIRECTION.RIGHT_UP:	pos = {x: 15.6, y :-10.5};	break;
		}

		this.shadow.position.set(pos.x, pos.y);
		this.shadow.scale.set(scale);
		this.shadow.alpha = alpha;
	}

	//override...
	getLocalCenterOffset()
	{
		let pos = {x: 0, y: 0};
		switch (this.direction)
		{
			case DIRECTION.LEFT_DOWN:	pos = {x: -10.5, y :-75};	break;
			case DIRECTION.LEFT_UP:		pos = {x: -10.5, y :-75};	break;
			case DIRECTION.RIGHT_DOWN:	pos = {x: 0, y :-75};	break;
			case DIRECTION.RIGHT_UP:	pos = {x: 0, y :-75};	break;
		}
		return pos;
	}

	getRageAnimation()
	{
		return this.direction.substr(3) + '_angry';
	}

	//override
	getAOECenter()
	{
		let center = {
			x: this.position.x,
			y: this.position.y
		};
		
		switch(this.direction)
		{
			case DIRECTION.LEFT_DOWN:
				center.x -= 205;
				center.y += 54;
				break;
			case DIRECTION.RIGHT_DOWN:
				center.x += 108;
				center.y += 108;
				break;
			case DIRECTION.RIGHT_UP:
				center.x += 237;
				center.y -= 108;
				break;
			case DIRECTION.LEFT_UP:
				center.x -= 216;
				center.y -= 129;
				break;
			default:
				center.x -= 216;
				center.y += 108;
				break;
		}
		return center;
	}

	//override
	_updateSpineAnimation()
	{
		this._pauseWalking();
		this.changeTextures(STATE_RAGE);
		this._fRageDirection_str = this.direction;

		let lRageAnimationTrack_obj = this.spineView.view.state.tracks[0];
		let lAOETimeProportion_num = 0.6;
		this.spineView.on("update", (e) => {
			if (lRageAnimationTrack_obj.trackTime >= lAOETimeProportion_num * lRageAnimationTrack_obj.animationEnd)
			{
				this.spineView.off("update");
				this._createAOEonGameField();
			}
		});

		lRageAnimationTrack_obj.onComplete = (e) => {
			this.setWalk();
			this._resumeWalking();

			this.spineView.clearStateListeners();
			this.spineView.view.state.tracks[0].onComplete = null;

			this._fIsRageAnimationInProgress_bl = false;
			this._fRageDirection_str = undefined;
			Sequence.destroy(Sequence.findByTarget(this.spineView));
		};
	}

	setDeath(aIsInstantKill_bl = false, aPlayerWin_obj = null)
	{
		if (this._fIsRageAnimationInProgress_bl)
		{
			this.on(Enemy.EVENT_ON_ENEMY_RESUME_WALKING, ()=>{
				super.setDeath(aIsInstantKill_bl, aPlayerWin_obj);
			});
		}
		else
		{
			super.setDeath(aIsInstantKill_bl, aPlayerWin_obj);
		}
	}

	//override
	setDeathFramesAnimation(aIsInstantKill_bl = false)
	{
		this._deathInProgress = true;

		
		this._fTintTimer_t && this._fTintTimer_t.destructor(); // reset blinking during the rage stage
		this._fTintTimer_t = null;

		this.deathFxAnimation = this.container.addChild(this._generateDeathFxAnimation());
		this.deathFxAnimation.position.set(0, -this._getHitRectHeight()/2);
		this.deathFxAnimation.scale.set(this._deathFxScale);
		this.deathFxAnimation.gameFieldPosition = APP.gameScreen.gameField.getEnemyPosition(this.id, true);
		this.deathFxAnimation.additionalZIndex = this.zIndex + 1; //+1 because his weapon must be over the sand

		this.deathFxAnimation.once(DeathFxAnimation.EVENT_ANIMATION_COMPLETED, (e) => {
			this.onDeathFxAnimationCompleted();
		});
		
		this.deathFxAnimation.zIndex = 20;

		if (aIsInstantKill_bl)
		{
			if (this.spineView)
			{
				this.spineView.destroy();
				this.spineView = null;
				this._fCurSpineName_str = undefined;
			}
			this.deathFxAnimation.i_startOutroAnimation();
		}
		else
		{
			this.spineView.stop();
			this._startTriggeringAnimation(BigEnemyDeathFxAnimation.TRIGGERING_DURATION);
			this.deathFxAnimation.on(BigEnemyDeathFxAnimation.ON_ENEMY_MUST_BE_HIDDEN, this._hideEnemy.bind(this));
			this.deathFxAnimation.i_startAnimation();
		}

		let lEnemyPosition_pt = this.getGlobalPosition();
		lEnemyPosition_pt.x += this.getCurrentFootPointPosition().x;
		lEnemyPosition_pt.y += this.getCurrentFootPointPosition().y;
		APP.soundsController.play('mq_dragonstone_ogre_death');
		this.emit(Enemy.EVENT_ON_DEATH_ANIMATION_STARTED, {position: lEnemyPosition_pt, angle: this.angle});
	}

	_hideEnemy()
	{
		this.shadow.addTween('alpha', 0, BigEnemyDeathFxAnimation.HIDIING_DURATION).play();
		this.spineView.addTween('alpha', 0, BigEnemyDeathFxAnimation.HIDIING_DURATION, null, this._validatezIndexOnDeath.bind(this)).play();
		this.emit(Enemy.EVENT_ON_ENEMY_IS_HIDDEN);
	}

	_startTriggeringAnimation(aDuration_num)
	{
		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			let lPos_obj = this._getBlowingFilterPosition();
			let lBlowFilter_bpf = new BulgePinchFilter({x: lPos_obj.x, y: lPos_obj.y}, 200, 0);
			this.container.filters = [lBlowFilter_bpf];
			let lBlowing_seq = [
				{	tweens: [{prop: 'uniforms.strength', to: 0.4}],
					duration: aDuration_num, 
					onfinish: ()=>{
						if (this.container)
						{
							this.container.filters = null;
						}
						Sequence.destroy(Sequence.findByTarget(lBlowFilter_bpf));
					}
				}
			];
			Sequence.start(lBlowFilter_bpf, lBlowing_seq);
		}

		this._hitHighlightInProgress = true;
		this._hitHighlightFilterIntensity.intensity.value = 0;
		let lHighlight_seq = [{tweens: [{prop: "intensity.value", to: 0.1}], duration: aDuration_num}];
		Sequence.start(this._hitHighlightFilterIntensity, lHighlight_seq);

		let lTriggering_seq = [
			{ tweens: [{ prop: 'position.x', to: 2 }, { prop: 'position.y', to: -1 }] },
			{ tweens: [{ prop: 'position.x', to: 0 }, { prop: 'position.y', to: 1 }] },
			{ tweens: [{ prop: 'position.x', to: -2 }, { prop: 'position.y', to: -2 }] },
			{ tweens: [{ prop: 'position.x', to: -3 }, { prop: 'position.y', to: 1 }] },
			{ tweens: [{ prop: 'position.x', to: -4 }, { prop: 'position.y', to: 5 }] },
			{ tweens: [{ prop: 'position.x', to: 3 }, { prop: 'position.y', to: -3 }] },
			{ tweens: [{ prop: 'position.x', to: 0 }, { prop: 'position.y', to: 1 }] },
			{ tweens: [{ prop: 'position.x', to: -4 }, { prop: 'position.y', to: 5 }] },
			{ tweens: [{ prop: 'position.x', to: -5 }, { prop: 'position.y', to: 6 }] },
			{ tweens: [{ prop: 'position.x', to: 5 }, { prop: 'position.y', to: -3 }] },
			{ tweens: [{ prop: 'position.x', to: 0 }, { prop: 'position.y', to: 1 }] },
			{ tweens: [{ prop: 'position.x', to: -7 }, { prop: 'position.y', to: -2 }] },
			{ tweens: [{ prop: 'position.x', to: 10 }, { prop: 'position.y', to: -5 }] },
			{ tweens: [{ prop: 'position.x', to: -2 }, { prop: 'position.y', to: 4 }] },
			{ tweens: [{ prop: 'position.x', to: -10 }, { prop: 'position.y', to: 8 }] },
			{ tweens: [{ prop: 'position.x', to: 3 }, { prop: 'position.y', to: -4 }], 
				onfinish: ()=>
				{
					this.spineView && Sequence.destroy(Sequence.findByTarget(this.spineView));
				}
			}
		];

		let lTweensAmount_num = lTriggering_seq.length;
		for (let i = 0; i < lTweensAmount_num; i++)
		{
			lTriggering_seq[i].duration = aDuration_num/lTweensAmount_num;
		}

		Sequence.start(this.spineView, lTriggering_seq);
	}

	_getBlowingFilterPosition()
	{
		let lPos_obj;

		switch (this.direction)
		{			
			case DIRECTION.LEFT_UP:
				lPos_obj = {x: 0.5, y: 0.5};
				break;
			case DIRECTION.LEFT_DOWN:
				lPos_obj = {x: 0.6, y: 0.4};
				break;
			case DIRECTION.RIGHT_UP:
				lPos_obj = {x: 0.5, y: 0.4};
				break;
			case DIRECTION.RIGHT_DOWN:
				lPos_obj = {x: 0.5, y: 0.5};
				break;
			default:
				lPos_obj = {x: 0.5, y: 0.5};
				break;
		}

		return lPos_obj;
	}

	getAOEAwaitingTime()
	{
		return 28;
	}

	destroy()
	{
		let lFilters_arr = this.container.filters;
		if (lFilters_arr && lFilters_arr.length)
		{
			for (let i=0; i<lFilters_arr.length; i++)
			{
				Sequence.destroy(Sequence.findByTarget(lFilters_arr[i]));
			}
		}

		this.spineView && Sequence.destroy(Sequence.findByTarget(this.spineView));
		this._fHitHighlightFilterIntensity && Sequence.destroy(Sequence.findByTarget(this._fHitHighlightFilterIntensity));

		super.destroy();

		this._fIsCalloutAwaiting_bl = null;
		this._fIsRageStage_bl = null;
		this._fGameField_gf = null;
	}

	//override
	__onSpawn()
	{
		this._fGameField_gf.onSomeEnemySpawnSoundRequired(this.typeId);
	}
}

export default OgreEnemy;