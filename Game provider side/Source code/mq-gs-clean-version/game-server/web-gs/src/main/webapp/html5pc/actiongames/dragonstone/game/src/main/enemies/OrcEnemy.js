import Enemy,{ DIRECTION, STATE_RAGE, STATE_STAY, STATE_WALK, SPINE_SCALE } from "./Enemy";
import RageEnemy from './RageEnemy';
import Sequence from '../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';

class OrcEnemy extends RageEnemy 
{
	constructor(params, aGameField_gf)
	{
		super(params);
		this._fGameField_gf = aGameField_gf;
	}

	//override...
	getImageName()
	{
		return 'enemies/orc/Orc';
	}

	//override...
	getSpineSpeed()
	{
		let lBaseSpeed_num = 0.0284;
		switch (this.direction)
		{
			case DIRECTION.RIGHT_UP: 	lBaseSpeed_num = 0.0283;		break;
			case DIRECTION.LEFT_DOWN:	lBaseSpeed_num = 0.0284;		break;
			case DIRECTION.RIGHT_DOWN:	lBaseSpeed_num = 0.0283;		break;
			case DIRECTION.LEFT_UP:		lBaseSpeed_num = 0.0285;		break;
		}
		
		let lSpineSpeed_num = (this.state == STATE_RAGE) ? 1 : (this.currentTrajectorySpeed*lBaseSpeed_num/(SPINE_SCALE*this.getScaleCoefficient())).toFixed(2);

		if (this.isTurnState)
		{
			lSpineSpeed_num = 2;
		}

		return lSpineSpeed_num;
	}

	//override...
	get _customSpineTransitionsDescr()
	{
		return [
					{from: "<PREFIX>walk", to: "<PREFIX>walk", duration: 0.1},
					{from: "<PREFIX>walk", to: "<PREFIX>hit", duration: 0.1},
					{from: "<PREFIX>hit", to: "<PREFIX>walk", duration: 0.05}
				];
	}

	//override...
	_getHitRectWidth()
	{
		return 102;
	}

	//override...
	_getHitRectHeight()
	{
		return 136;
	}

	//override...
	changeShadowPosition()
	{
		let pos = { x: 0, y: 0 }, scale = 1.53, alpha = 0.75;
		switch (this.direction)
		{
			case DIRECTION.LEFT_DOWN:	pos = {x: 0, y : 4};	break;
			case DIRECTION.LEFT_UP:		pos = {x: 0, y :-8.5};	break;
			case DIRECTION.RIGHT_DOWN:	pos = {x: 12.5, y :0};	break;
			case DIRECTION.RIGHT_UP:	pos = {x: 12.5, y :-12.5};	break;
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
			case DIRECTION.LEFT_DOWN:	pos = {x: -12, y :-42};	break;
			case DIRECTION.LEFT_UP:		pos = {x: -12, y :-68};	break;
			case DIRECTION.RIGHT_DOWN:	pos = {x: 12, y :-59};	break;
			case DIRECTION.RIGHT_UP:	pos = {x: 21, y :-63};	break;
		}
		return pos;
	}

	//override
	getRageAnimation()
	{
		if (this._isRageInitialPartInProgress)
		{
			return this.direction.substr(3) + '_hit';
		}
		return this.direction.substr(3) + '_stomp';
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
				center.x -= 51;
				center.y += 17;
				break;
			case DIRECTION.RIGHT_DOWN:
				center.x += 42;
				center.y += 17;
				break;
			case DIRECTION.RIGHT_UP:
				center.x += 42;
				center.y -= 17;
				break;
			case DIRECTION.LEFT_UP:
				center.x -= 51;
				center.y -= 25;
				break;
			default:
				center.x -= 42;
				center.y += 17;
				break;
		}
		return center;
	}

	//override
	getAOEAwaitingTime()
	{
		return 36+20;
	}

	destroy()
	{
		super.destroy();
		this._isRageInitialPartInProgress = undefined;
	}

	//override
	__onSpawn()
	{
		this._fGameField_gf.onSomeEnemySpawnSoundRequired(this.typeId);
	}

	//override
	_updateSpineAnimation()
	{
		this._isRageInitialPartInProgress = true;

		this.emit(Enemy.EVENT_ON_ENEMY_PAUSE_WALKING, {enemyId: this.id});

		this.changeTextures(STATE_RAGE);

		this.spineView.view.state.tracks[0].onComplete = (e) => {
			this._isRageInitialPartInProgress = false;

			this.spineView.clearStateListeners();
			this.spineView.view.state.tracks[0].onComplete = null;
			this._fTintTimer_t && this._fTintTimer_t.destructor();
			Sequence.destroy(Sequence.findByTarget(this.spineView));
			this.changeTextures(STATE_RAGE);

			this.spineView.view.state.tracks[0].onComplete = (e) => {
				this.spineView.clearStateListeners();
				this.spineView.view.state.tracks[0].onComplete = null;

				this._fIsRageAnimationInProgress_bl = false;
				this._fTintTimer_t && this._fTintTimer_t.destructor();
				Sequence.destroy(Sequence.findByTarget(this.spineView));
				this.changeTextures(STATE_STAY);
				this.emit(Enemy.EVENT_ON_ENEMY_RESUME_WALKING, {enemyId: this.id});
			}

			this._startTintAnimation();
		};
	}
}

export default OrcEnemy;