
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import SimpleUIController from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/uis/base/SimpleUIController';
import GunRotateInfo from '../../../model/uis/fire/GunRotateInfo';
import KeyboardControlProxy from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/interaction/keyboard/KeyboardControlProxy';
import { Utils } from "../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils";

const TURRET_TURN_UNIT = 0.047; // rad (~ 3 grad)
const HALF_PI = Math.PI / 2;

class GunRotateController extends SimpleUIController {

	static get EVENT_ON_STOP_UPDATE_CURSOR_POSITION() { return 'onStopUpdateCursorPosition'};
	static get EVENT_ON_SET_SPECIFIC_CURSOR_POSITION() { return 'onSetSpecificCursorPosition'};
	

	constructor() {
		super(new GunRotateInfo());

		this._gameScreen = null;
		this._gameField = null;

		this._fTargetingController_tc = null;
		this._fTargetingInfo_tc = null;

		this.turretRotationTime = 0;
		this._fChooseWeaponsScreenActive_bln = null;
		this._fTickListening_bln = null;
	}

	i_onChooseWeaponsStateChanged(aVal_bln)
	{
		this._fChooseWeaponsScreenActive_bln = aVal_bln;
	}

	i_onRoomPaused()
	{
		this._stopListeningTick();
	}

	get spot()
	{
		return this._gameField.spot;
	}

	get seatId()
	{
		return APP.playerController.info.seatId;
	}

	
	i_rotatePlayerGun(seatId, x, y)
	{
		if (seatId == this.seatId)
		{
			return this.rotateGun(x, y);
		}

		let player = this._gameField.getPlayerBySeatId(seatId);

		if (!player || !player.weaponSpotView)
		{
			return null;
		}

		let weaponSpotView = player.weaponSpotView;
		let gunX = weaponSpotView.localToGlobal().x;
		let gunY = weaponSpotView.localToGlobal().y;
		let angle = Math.atan2(y - gunY, x - gunX) + HALF_PI;//(x - gunX)/(y - gunY);

		if (!player.spot.isBottom)
		{
			angle += Math.PI;
		}

		weaponSpotView.rotation = angle;

		return angle;
	}

	init()
	{
		this._gameScreen = APP.currentWindow;
		this._gameField = this._gameScreen.gameFieldController;

		this._fTargetingController_tc = this._gameScreen.targetingController;
		this._fTargetingInfo_tc = this._fTargetingController_tc.info;

		APP.keyboardControlProxy.on(KeyboardControlProxy.i_EVENT_BUTTON_CLICKED, this._onKeyboardButtonClicked, this);
		APP.keyboardControlProxy.on(KeyboardControlProxy.i_EVENT_BUTTON_SPACE_UP, this._onKeyboardButtonSpaceUp, this);
	}

	_onKeyboardButtonClicked(event)
	{
		this._chooseKeyboardAction(event.code);
	}

	_chooseKeyboardAction(code)
	{
		switch (code)
		{
			case "ArrowLeft":
			case "KeyA":
				if (!APP.keyboardControlProxy.isLeftDown)
				{
					this.turretRotationTime = 0;
					this._startListeningTick();
				}
			break;
			case "ArrowRight":
			case "KeyD":
				if (!APP.keyboardControlProxy.isRightDown)
				{
					this.turretRotationTime = 0;
					this._startListeningTick();
				}
			break;
		}
	}

	_startListeningTick()
	{
		if (!this._fTickListening_bln)
		{
			APP.ticker.on("tick", this.tickTurretRotation, this);
			this._fTickListening_bln = true;
		}
	}

	_onKeyboardButtonSpaceUp(event)
	{
		switch (event.code)
		{
			case "ArrowLeft":
			case "KeyA":
				if (!APP.keyboardControlProxy.isRightDown)
				{
					this._stopListeningTick();
				}	
			break;
			case "ArrowRight":
			case "KeyD":
				if (!APP.keyboardControlProxy.isLeftDown)
				{
					this._stopListeningTick();
				}
			break;
		}
	}

	_stopListeningTick()
	{
		if (this._fTickListening_bln)
		{
			APP.ticker.off("tick", this.tickTurretRotation, this);
			this._fTickListening_bln = false;
		}
	}

	//GUN ROTATE...
	get _turretRotationTimeout()
	{
		return 10;
	}

	rotateGun(x, y)
	{
		if (!this.spot) return;
		if (!this.spot.weaponSpotView) return;
		if (this.spot.rotationBlocked) return;
		

		let weaponSpotView = this.spot.weaponSpotView;
		let gunX = weaponSpotView.localToGlobal().x;
		let gunY = weaponSpotView.localToGlobal().y;
		let angle = Math.atan2(y - gunY, x - gunX) + HALF_PI; //(x - gunX)/(y - gunY);

		if (!this.spot.isBottom)
		{
			angle += Math.PI;
		}

		this.spot.weaponSpotView.rotation = angle;
		return angle;
	}
	
	tryRotateGun(e)
	{
		if (	!this.spot ||
				this._fTargetingInfo_tc.isActive ||
				this._fChooseWeaponsScreenActive_bln ||
				this._gameField.roundResultActive 
		)
		{
			return false;
		}

		var x = e.data.global.x;
	
		var y = e.data.global.y;



		let lKeyBoardRotation = e.data.isKeyboardRotation ? e.data.isKeyboardRotation : false;

		let lAPPSize_obj = APP.config.size;
		const margin  = 10;
		
		if(x>lAPPSize_obj.width -margin){
			x = lAPPSize_obj.width - margin;
		}

		if(x<margin){
			x = margin;
		}

		if(y>lAPPSize_obj.height - margin){
			y= lAPPSize_obj.height - margin;
		}

		if(y<margin){
			y= margin;
		}

		let A = this.spot.isBottom ? new PIXI.Point(0, lAPPSize_obj.height) : new PIXI.Point(0, 0); //left corner
		let B = this.spot.isBottom ? new PIXI.Point(lAPPSize_obj.width, lAPPSize_obj.height) : new PIXI.Point(lAPPSize_obj.width, 0); //right corner
		let C = APP.gameScreen.fireController.getGunPosition(this.seatId); //spot point
		let D = new PIXI.Point(x, y); //cursor point
        let isRotationLimit = this._f(B,C,A,D) && this._f(C,A,B,D);

		if (isRotationLimit)
		{
			if (x > C.x && !lKeyBoardRotation)
			{
				this.rotateGun(B.x, B.y);
				APP.gameScreen.fireController.lastPointerPos = B;
			}
			else if (!lKeyBoardRotation)
			{
				this.rotateGun(A.x, A.y);
				APP.gameScreen.fireController.lastPointerPos = A;
			}
		}

		APP.gameScreen.fireController.lastPointerPos = D;
		
		this.rotateGun(x, y);

		return true;
	}


	_g(a, b, d)
	{
		return (d.x - a.x) * (b.y - a.y) - (d.y - a.y) * (b.x - a.x);
	}

	_f(a, b, c, d)
	{
		return this._g(a, b, c) * this._g(a, b, d) >= 0;
	}

	tickTurretRotation(e)
	{
		let isLeftDown = APP.keyboardControlProxy.isLeftDown;
		let isRightDown = APP.keyboardControlProxy.isRightDown;

		if (isLeftDown || isRightDown)
		{
			let timeout = this._turretRotationTimeout;
			this.turretRotationTime += e.delta;

			if (this.turretRotationTime >= timeout)
			{
				this.turretRotationTime = 0;

				if (isRightDown)
				{
					this._tryRotateTurretRight();
				}
				if (isLeftDown)
				{
					this._tryRotateTurretLeft();
				}
			}
		}
	}

	_tryRotateTurretLeft()
	{
		this._tryRotateTurretOnAngle(1);
	}

	_tryRotateTurretRight()
	{
		this._tryRotateTurretOnAngle(-1);
	}

	_tryRotateTurretOnAngle(aDirect_num)
	{
		if (this.seatId === null || this.seatId === undefined) return;
		if (!APP.gameScreen.cursorController.isCursorRendering) return;

		let lSitPositionIds_arr = APP.currentWindow.gameFieldController.sitPositionIds;
		let seatPosition = lSitPositionIds_arr[this.seatId];
		if (seatPosition > 2) aDirect_num *= -1;

		let gunPos = APP.gameScreen.fireController.getGunPosition(this.seatId);
		let lastPointerPos = APP.gameScreen.fireController.lastPointerPos;

		let angle = Utils.getAngle(gunPos, lastPointerPos);
		let dist = Utils.getDistance(gunPos, lastPointerPos);
		let distMax = 680;
		let coef = 1 - dist / distMax;
		if (coef > 1) coef = 1;
		if (coef < 0.3) coef = 0.3;
		let stepAngle = coef * TURRET_TURN_UNIT;

		let newAngle = (angle + aDirect_num * stepAngle - HALF_PI);
		let newPosition = {x: gunPos.x + Math.cos(newAngle)*dist, y: gunPos.y - Math.sin(newAngle)*dist};

		let e = {data: {global: newPosition, isKeyboardRotation: true}};
		let isRotated = this.tryRotateGun(e);

		if (isRotated)
		{
			this.emit(GunRotateController.EVENT_ON_STOP_UPDATE_CURSOR_POSITION);
			this.emit(GunRotateController.EVENT_ON_SET_SPECIFIC_CURSOR_POSITION, {pos: newPosition});
		}
	}
	//...GUN ROTATE

	destroy()
	{
		super.destroy();

		this._stopListeningTick();
		this._fTickListening_bln = null;

		this._gameScreen = null;
		this._gameField = null;

		this._fTargetingController_tc = null;
		this._fTargetingInfo_tc = null;

		this.turretRotationTime = null;
		this._fChooseWeaponsScreenActive_bln = null;
	}	
}
export default GunRotateController
