import SimpleUIView from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/SimpleUIView';
import Crosshairs from '../../../main/Crosshairs';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Enemy from '../../../main/enemies/Enemy';

class TargetingView extends SimpleUIView {

	static get EVENT_ON_TARGET_VIEW_DESTROYED()	{return 'EVENT_ON_TARGET_VIEW_DESTROYED'};

	constructor()
	{
		super();
		this._fCrosshairs_c = null;
		this._fTargetEnemy_enm = null;
	}

	addToContainerIfRequired(targetingContainerInfo)
	{
		if (this.parent || !targetingContainerInfo || !targetingContainerInfo.container)
		{
			return;
		}

		targetingContainerInfo.container.addChild(this);
		this.zIndex = targetingContainerInfo.zIndex;
	}

	updateTarget(aTargetEnemy_enm)
	{	
		this._stopListeningTarget();
		this._fTargetEnemy_enm = aTargetEnemy_enm;	
		if (this._fTargetEnemy_enm)
		{			
			this._startListeningTarget();
		}
		else
		{	
			this._hideCrosshairs();
		}
	}

	_startListeningTarget()
	{
		this._fTargetEnemy_enm.on(Enemy.EVENT_ON_ENEMY_START_DYING, this._onTargetEnemyStartDying, this);
		this._fTargetEnemy_enm.on(Enemy.EVENT_ON_ENEMY_VIEW_REMOVING, this._onTargetEnemyViewRemoving, this);
		
		APP.on("tick", this._tickFunc, this);
	}

	_stopListeningTarget(e)
	{
		this._fTargetEnemy_enm && this._fTargetEnemy_enm.off(Enemy.EVENT_ON_ENEMY_START_DYING, this._onTargetEnemyStartDying, this);
		this._fTargetEnemy_enm && this._fTargetEnemy_enm.off(Enemy.EVENT_ON_ENEMY_VIEW_REMOVING, this._onTargetEnemyViewRemoving, this);
		
		APP.off("tick", this._tickFunc, this);
	}

	_onTargetEnemyStartDying(e)
	{
		this._resetTarget();
	}

	_onTargetEnemyViewRemoving(e)
	{
		this._resetTarget();
	}

	_resetTarget()
	{
		this.updateTarget(null);
		this.emit(TargetingView.EVENT_ON_TARGET_VIEW_DESTROYED);
	}

	_tickFunc(e)
	{
		if (this._fTargetEnemy_enm && this._fTargetEnemy_enm.parent)
		{
			let lEnemyPos_pt = this._fTargetEnemy_enm.getCenterPosition();
			let lCrosshairsOffsetPosition_pt = this._fTargetEnemy_enm.crosshairsOffsetPosition;
			this.crosshairs.position.set(lEnemyPos_pt.x + lCrosshairsOffsetPosition_pt.x, lEnemyPos_pt.y + lCrosshairsOffsetPosition_pt.y);
			this._showCrosshairs();
		}
		else
		{
			this._resetTarget();
		}
	}

	_hideCrosshairs()
	{
		this.crosshairs.visible = false;
	}

	_showCrosshairs()
	{
		this.crosshairs.visible = true;
	}

	get crosshairs()
	{
		return this._fCrosshairs_c || this._initCrosshairs();
	}

	_initCrosshairs()
	{
		return (this._fCrosshairs_c = this.addChild(new Crosshairs()));
	}	

	destroy()
	{
		console.log("[TargetingView] destroy");
		APP.off("tick", this._tickFunc, this);
		
		this._fCrosshairs_c && this._fCrosshairs_c.destroy();
		this._fCrosshairs_c = null;

		this._fTargetEnemy_enm = null;

		super.destroy();

	}
}

export default TargetingView
