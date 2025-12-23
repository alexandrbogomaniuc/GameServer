import SimpleUIController from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/uis/base/SimpleUIController';
import ArtilleryStrikeInfo from '../../../../model/uis/weapons/artillerystrike/ArtilleryStrikeInfo';
import ArtilleryStrikeView from '../../../../view/uis/weapons/artillerystrike/ArtilleryStrikeView';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import ShotResultsUtil from '../../../../main/ShotResultsUtil';
import { Utils } from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import GameSoundsController from '../../../sounds/GameSoundsController';
import SimpleSoundController from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/sounds/SimpleSoundController';

class ArtilleryStrikeController extends SimpleUIController {

	static get EVENT_ON_MAIN_STRIKE_ANIMATION_COMPLETED() 			{ return 'EVENT_ON_MAIN_STRIKE_ANIMATION_COMPLETED'; }
	static get EVENT_ON_ALL_MAIN_MISSILES_HIT() 					{ return 'EVENT_ON_ALL_MAIN_MISSILES_HIT'; }
	static get EVENT_ON_FULL_ANIMATION_COMPLETED() 					{ return ArtilleryStrikeView.EVENT_ON_FULL_ANIMATION_COMPLETED; }
	static get EVENT_ON_STRIKE_MISSILE_HIT() 						{ return ArtilleryStrikeView.EVENT_ON_STRIKE_MISSILE_HIT; }
	static get EVENT_ON_ARTILLERY_GRENADE_LANDED() 					{ return ArtilleryStrikeView.EVENT_ON_ARTILLERY_GRENADE_LANDED; }

	constructor(data, callback)
	{
		super(new ArtilleryStrikeInfo(data), new ArtilleryStrikeView());

		this._fShotCallback_func = callback;

		this._gameScreen = null;
	}

	__init()
	{
		super.__init();

		this._gameScreen = APP.currentWindow;

		this._fMapsController_msc = APP.currentWindow.mapsController;
		this._fMapsInfo_msi = this._fMapsController_msc.info;

		this._fHitMissilesCounter_int = 0;
		this._fArtilleryStrikesFlyingSound_snd = null;

		this._startFire();
	}

	__initViewLevel()
	{
		super.__initViewLevel();

		this.view.once(ArtilleryStrikeView.EVENT_ON_ARTILLERY_GRENADE_LANDED, this._onArtilleryGrenadeLanded, this);
		this.view.once(ArtilleryStrikeView.EVENT_ON_TIME_TO_START_ARTILLERY_STRIKES, this._onTimeToStartArtilleryStrikes, this);
		this.view.once(ArtilleryStrikeView.EVENT_ON_ALL_MISSILES_COMPLETED, this._onAllMissilesCompleted, this);
		this.view.once(ArtilleryStrikeView.EVENT_ON_FULL_ANIMATION_COMPLETED, this._onFullAnimationCompleted, this);
		this.view.on(ArtilleryStrikeView.EVENT_ON_STRIKE_MISSILE_HIT, this._onSomeStrikeMissileHit, this);
	}

	_startFire()
	{
		let startPos = this._gameScreen.gameField.getGunPosition(this.info.seatId);
		let endPos = new PIXI.Point(this.info.origX, this.info.origY);
		let middlePos = null;

		if (this.info.rid !== -1)
		{
			//my shot
			let targetEnemyId = this.info.requestEnemyId;
			let enemyPos = this._gameScreen.gameField.getEnemyPosition(targetEnemyId, true /*foot position*/);

			let mapZonePoints = this._fMapsInfo_msi.currentMapWalkingZone;
			let mapZonePolygon = mapZonePoints ? new PIXI.Polygon(mapZonePoints) : null;

			if (mapZonePolygon && !Utils.isPointInsidePolygon(endPos, mapZonePolygon))
			{
				middlePos = new PIXI.Point(endPos.x, endPos.y);
				endPos = enemyPos;
			}
		}
		else
		{
			//opponent's shot
			let targetEnemyId = ShotResultsUtil.getFirstNonFakeEnemy(this.info.shotData);
			let lastPos = this._gameScreen.gameField.getEnemyPosition(targetEnemyId, true /*foot position*/);

			if (lastPos)
			{
				endPos = lastPos;
			}
		}

		this.view.i_throwArtilleryGrenade(startPos, endPos, middlePos);
	}

	_onArtilleryGrenadeLanded(aEvent_obj)
	{
		this.emit(ArtilleryStrikeController.EVENT_ON_ARTILLERY_GRENADE_LANDED);
		if (this.info.rid !== -1)
		{
			this.emit(ArtilleryStrikeController.EVENT_ON_MAIN_STRIKE_ANIMATION_COMPLETED);
		}
		this._playSmokeSound();
	}

	_onSomeStrikeMissileHit(aEvent_obj)
	{
		let isFirst = ++this._fHitMissilesCounter_int === 1;
		let lEvent_obj = Object.assign({isFirst: isFirst}, aEvent_obj);

		if (isFirst)
		{
			APP.gameScreen.gameField.shakeTheGround("artillery");
		}

		this.emit(ArtilleryStrikeController.EVENT_ON_STRIKE_MISSILE_HIT, lEvent_obj);
	}

	//SOUNDS...
	_playSmokeSound()
	{
		this._playSound('bomb_smoking');
	}

	_playArtilleryStrikesFlyingSound()
	{
		let lArtilleryStrikesFlyingSound_snd = this._fArtilleryStrikesFlyingSound_snd = this._playSound('artillery_strikes_flying');
		lArtilleryStrikesFlyingSound_snd && lArtilleryStrikesFlyingSound_snd.once(SimpleSoundController.i_EVENT_SOUND_DESTROYING, this._onArtilleryStrikesFlyingSoundDestroying, this);
	}

	_onArtilleryStrikesFlyingSoundDestroying(aEvent_obj)
	{
		this._fArtilleryStrikesFlyingSound_snd = null;
	}

	_destroyArtilleryStrikesFlyingSound()
	{
		if (this._fArtilleryStrikesFlyingSound_snd)
		{
			this._fArtilleryStrikesFlyingSound_snd.off(SimpleSoundController.i_EVENT_SOUND_DESTROYING, this._onArtilleryStrikesFlyingSoundDestroying, this, true);
			this._fArtilleryStrikesFlyingSound_snd.i_destroy();
			this._fArtilleryStrikesFlyingSound_snd = null;
		}
	}

	_playSound(aSoundName_str)
	{
		let lIsMainPlayerShot_bl = this.info.rid >= 0;
		let lVolume_num = lIsMainPlayerShot_bl ? GameSoundsController.MAIN_PLAYER_VOLUME : GameSoundsController.OPPONENT_WEAPON_VOLUME;
		return APP.soundsController.play(aSoundName_str, false, lVolume_num, !lIsMainPlayerShot_bl);
	}
	//...SOUNDS

	_onTimeToStartArtilleryStrikes(aEvent_obj)
	{
		let lAffectedEnemies_obj_arr = ShotResultsUtil.excludeFakeEnemies(this.info.affectedEnemies);

		//[27.06.2019] We discussed it with Lana, and actually it should only be 4 shots like it is currently.
		//In the config each shot has a chance to hit up to 3 targets (and the 2nd, 3rd, and 4th shots are progressively weaker). 4 * 3 = 12

		//sort by damage descending
		lAffectedEnemies_obj_arr = lAffectedEnemies_obj_arr.sort((a, b) => {return b.data.damage - a.data.damage});

		let lAffectedEnemiesIds_int_arr = lAffectedEnemies_obj_arr.map(function(obj) {
			return obj.enemyId;
		});

		//reduce the number of explosion down to 4 maximum...
		lAffectedEnemiesIds_int_arr = lAffectedEnemiesIds_int_arr.splice(0, 4);
		// if not enough affected enemies - duplicate the first one
		while (lAffectedEnemiesIds_int_arr.length < 4)
		{
			lAffectedEnemiesIds_int_arr.push(lAffectedEnemiesIds_int_arr[0]); // duplicate first affected enemy
		}
		//...reduce the number of explosion down to 4 maximum

		this.view.i_startArtilleryMissiles(lAffectedEnemiesIds_int_arr);
		this._playArtilleryStrikesFlyingSound();
	}

	_onAllMissilesCompleted()
	{
		//stop sound of flying
		this._destroyArtilleryStrikesFlyingSound();
		if (this.info.rid !== -1)
		{
			this.emit(ArtilleryStrikeController.EVENT_ON_ALL_MAIN_MISSILES_HIT);
		}
		this._fShotCallback_func.call(null);
	}

	_onFullAnimationCompleted()
	{
		this.emit(ArtilleryStrikeController.EVENT_ON_FULL_ANIMATION_COMPLETED);
	}

	destroy()
	{
		this.removeAllListeners();
		this._destroyArtilleryStrikesFlyingSound();

		super.destroy();
	}
}

export default ArtilleryStrikeController;