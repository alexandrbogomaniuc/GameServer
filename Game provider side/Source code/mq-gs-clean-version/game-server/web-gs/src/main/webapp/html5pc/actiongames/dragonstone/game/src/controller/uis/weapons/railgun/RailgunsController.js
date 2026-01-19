import SimpleUIController from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/uis/base/SimpleUIController';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import RailgunsInfo from '../../../../model/uis/weapons/railgun/RailgunsInfo';
import RailgunsView from '../../../../view/uis/weapons/railgun/RailgunsView';
import GameScreen from '../../../../main/GameScreen';
import GameField from '../../../../main/GameField';
import { WEAPONS } from '../../../../../../shared/src/CommonConstants';
import ShotResultsUtil from '../../../../main/ShotResultsUtil';

class RailgunsController extends SimpleUIController {

	static get EVENT_ON_BEAM_TARGET_ACHIEVED() 				 		{ return RailgunsView.EVENT_ON_BEAM_TARGET_ACHIEVED }
	static get EVENT_ON_MAIN_SPOT_BEAM_BASIC_ANIMATION_COMPLETED() 	{ return 'EVENT_ON_MAIN_SPOT_BEAM_BASIC_ANIMATION_COMPLETED';}
	static get EVENT_ON_BEAM_ROTATION_UPDATED() 					{ return RailgunsView.EVENT_ON_BEAM_ROTATION_UPDATED; }
	static get EVENT_ON_HIT_EFFECT_STARTED() 						{ return RailgunsView.EVENT_ON_HIT_EFFECT_STARTED; }
	static get EVENT_ON_HIT_EFFECT_COMPLETED() 						{ return RailgunsView.EVENT_ON_HIT_EFFECT_COMPLETED; }
	

	constructor()
	{
		super(new RailgunsInfo(), new RailgunsView());

		this._gameScreen = null;
	}

	__init()
	{
		super.__init();

		this._gameScreen = APP.currentWindow;

		this._gameScreen.once(GameScreen.EVENT_ON_READY, this._onGameScreenReady, this);

		this._gameScreen.on(GameScreen.EVENT_ON_ROOM_UNPAUSED, this._onRoomUnpaused, this);
		this._gameScreen.on(GameScreen.EVENT_ON_ROOM_PAUSED, this._onRoomPaused, this);
		this._gameScreen.on(GameScreen.EVENT_ON_ROOM_FIELD_CLEARED, this._onRoomFieldCleared, this);
	}

	__initViewLevel()
	{
		super.__initViewLevel();
		this.view.on(RailgunsView.EVENT_ON_BEAM_BASIC_ANIMATION_COMPLETED, this._onSomeBeamBasicAnimationCompleted, this);
		this.view.on(RailgunsView.EVENT_ON_BEAM_ROTATION_UPDATED, this.emit, this);
		this.view.on(RailgunsView.EVENT_ON_HIT_EFFECT_STARTED, this.emit, this);
		this.view.on(RailgunsView.EVENT_ON_HIT_EFFECT_COMPLETED, this.emit, this);
	}

	_onGameScreenReady(aEvent_obj)
	{
		this._gameScreen.gameField.on(GameField.EVENT_ON_GAME_FIELD_SCREEN_CREATED, this._onGameFieldScreenCreated, this);
		this._gameScreen.gameField.on(GameField.EVENT_SHOW_FIRE, this._onTimeToShowFire, this);
	}

	_onGameFieldScreenCreated(aEvent_obj)
	{
		this.view.i_init();
	}

	_onRoomPaused(aEvent_obj)
	{
		this._clearAll();
	}

	_onRoomUnpaused(aEvent_obj)
	{

	}

	_onRoomFieldCleared()
	{
		this._clearAll();
	}

	_onTimeToShowFire(aEvent_obj)
	{
		let data = aEvent_obj.data;
		let callback = aEvent_obj.callback;

		if (data.usedSpecialWeapon === WEAPONS.RAILGUN)
		{
			this._showFire(data, callback);
		}
	}

	_onSomeBeamBasicAnimationCompleted(aEvent_obj)
	{
		let lShotData_obj = aEvent_obj.shotData;
		if (lShotData_obj.rid !== -1)
		{
			this.emit(RailgunsController.EVENT_ON_MAIN_SPOT_BEAM_BASIC_ANIMATION_COMPLETED);
		}	
	}

	_showFire(data, callback)
	{
		let lStartPos_pt = this._gameScreen.gameField.getGunPosition(data.seatId);

		let lFirstNonFakeEnemyId_int = data.requestEnemyId || ShotResultsUtil.getFirstNonFakeEnemy(data); // in current implementation all Railgun's damage goes to one enemy
		let lEndPos_pt = this._gameScreen.gameField.getEnemyPosition(lFirstNonFakeEnemyId_int);
		if (!lEndPos_pt)
		{
			callback(null, 0);
			return;
		}
		let lTargetEnemy_enm = this._gameScreen.gameField.getExistEnemy(lFirstNonFakeEnemyId_int);

		this.view.i_showFire(data, lStartPos_pt, lEndPos_pt, callback);
	}

	_clearAll()
	{
		this.info.i_clearAll();
		this.view.i_clearAll();	
	}
}

export default RailgunsController;