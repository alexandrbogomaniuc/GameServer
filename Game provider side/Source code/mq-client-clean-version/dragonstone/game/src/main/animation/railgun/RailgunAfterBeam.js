import WeaponBeam from '../WeaponBeam';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import Enemy from '../../enemies/Enemy';

const MINIMUM_LENGTH = 600;

class RailgunAfterBeam extends WeaponBeam {

	static get EVENT_ON_TARGET_ACHIEVED() 		{ return WeaponBeam.EVENT_ON_TARGET_ACHIEVED }
	static get EVENT_ON_ANIMATION_COMPLETED() 	{ return WeaponBeam.EVENT_ON_ANIMATION_COMPLETED }	

	constructor(aTargetEnemy_enm)
	{
		super(null);

		this._fTargetEnemy_enm = aTargetEnemy_enm;
		this._fScaleableBase_sprt = null;
		this._fStreak_sprt = null;

		this._fScaleableBase_sprt = this.addChild(new Sprite);
		this._fScaleableBase_sprt.pivot.set(0, 0);
	}

	get _baseBeamLength()
	{
		return 310;
	}

	get _minimumBeamLength()
	{
		return 10;
	}

	i_shoot(aStartPoint_pt, aRotation_num)
	{
		this.rotation = aRotation_num;
		let lEndPoint_pt = this._calcEndPoint(aStartPoint_pt);

		super.i_shoot(aStartPoint_pt, lEndPoint_pt);
	}

	//override
	__shoot(aStartPoint_pt, aEndPoint_pt)
	{
		super.__shoot(aStartPoint_pt, aEndPoint_pt);

		if (this._fTargetEnemy_enm)
		{
			//this._startFollowingEnemy();
		}

		let lStreak_sprt = APP.library.getSpriteFromAtlas('weapons/Railgun/Streak_ADD');
		lStreak_sprt.anchor.set(665/721, 41/90);
		lStreak_sprt.blendMode = PIXI.BLEND_MODES.ADD;
		this._fScaleableBase_sprt.addChild(lStreak_sprt);
		lStreak_sprt.scale.x = 0;
		lStreak_sprt.scale.y = 0.5;

		let seq = [
			{
				tweens: [
					{ prop: 'scale.x', to: -1 }
				],
				duration: 2*2*16.7
			},
			{
				tweens: [
				],
				duration: 1*2*16.7,
				onfinish: () => {
					lStreak_sprt.anchor.x = 44/721;
					lStreak_sprt.position.x = (665 - 44)/2;
					this._onTargetAchieved();
				}
			},
			{
				tweens: [
					{ prop: 'scale.x', to: 0}
				],
				duration: 2*2*16.7,
				onfinish: ()=> {
					this._onAnimationCompleted();
				}
			}
		];

		Sequence.start(lStreak_sprt, seq);
		this._fStreak_sprt = lStreak_sprt;	
	}

	_startFollowingEnemy()
	{
		this._fTargetEnemy_enm.on(Enemy.EVENT_ON_ENEMY_DESTROY, this._stopFollowingEnemy, this);
		APP.on('tick', this._onTick, this);
	}

	_stopFollowingEnemy()
	{
		this._fTargetEnemy_enm && this._fTargetEnemy_enm.off(Enemy.EVENT_ON_ENEMY_DESTROY, this._stopFollowingEnemy, this);
		APP.off('tick', this._onTick, this);
	}

	_onTick(e)
	{
		if (!this._fTargetEnemy_enm || !this._fTargetEnemy_enm.parent)
		{
			this._stopFollowingEnemy();
			return;
		}
		this.startPoint = this._fTargetEnemy_enm.getCenterPosition();
		this.endPoint = this._calcEndPoint(this.startPoint);
	}

	_calcEndPoint(aStartPoint_pt)
	{
		let dist = MINIMUM_LENGTH;
		let rot = this.rotation;
		let x = aStartPoint_pt.x + dist*Math.cos(rot);
		let y = aStartPoint_pt.y + dist*Math.sin(rot);
		return new PIXI.Point(x, y);
	}

	_onTargetAchieved()
	{
		this.emit(RailgunAfterBeam.EVENT_ON_TARGET_ACHIEVED);
	}

	_onAnimationCompleted()
	{
		this._stopFollowingEnemy();
		this.emit(RailgunAfterBeam.EVENT_ON_ANIMATION_COMPLETED);
		this.destroy();
	}

	//override
	_updateScale()
	{
		this._fScaleableBase_sprt.scale.x = this._beamLength / this._baseBeamLength;
	}

	//override
	_updatePosition()
	{
		super._updatePosition();
		this.zIndex = this.y;
	}

	destroy()
	{
		Sequence.destroy(Sequence.findByTarget(this._fStreak_sprt));
		this._fStreak_sprt && this._fStreak_sprt.destroy();

		if (this._fTargetEnemy_enm)
		{
			this._fTargetEnemy_enm.off(Enemy.EVENT_ON_ENEMY_DESTROY, this._stopFollowingEnemy, this);
		}
		this._fTargetEnemy_enm = null;

		APP.off('tick', this._onTick, this);

		this.removeAllListeners();

		super.destroy();
	}
}

export default RailgunAfterBeam;