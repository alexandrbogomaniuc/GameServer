import GUSLobbyTutorialView from '../../../../../../../common/PIXI/src/dgphoenix/gunified/view/uis/tutorial/GUSLobbyTutorialView';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';

class TutorialView extends GUSLobbyTutorialView
{
	constructor()
	{
		super();
	}

	__prepareLines(aData_obj)
	{
		if (!aData_obj)
		{
			return null;
		}

		if(!this._fSpot_spr)
		{
			this._fSpot_spr = this._fBackground_g.addChild(APP.library.getSprite("tutorial/spot_example"));
			this._fSpot_spr.position.set(this._fBGWidth_num/2, this._fBGHeight_num/2);
			this._fSpot_spr.scale.set(1.3);
		}
		this._clearHints();

		let lHints_obj_arr = [];

		let lSpotBounds_obj = this._fSpot_spr.getBounds();
		let lXAndWidth_num = lSpotBounds_obj.x + lSpotBounds_obj.width;
		let lXAndHalfWidth_num = lSpotBounds_obj.x + lSpotBounds_obj.width/2;
		let lYAndHalfheight_num = lSpotBounds_obj.y + lSpotBounds_obj.height/2;
		
		//AIMING...
		let lHint_obj = {
			textAssetName: 'TATutorialAiming',
			textPosition: 
			{
				x: lXAndHalfWidth_num + 50,
				y: lSpotBounds_obj.y - 25
			},
			points: [
				{ x: lXAndHalfWidth_num, y: lSpotBounds_obj.y+30, dot: true, resolution: 4},
				{ x: lXAndHalfWidth_num, y: lSpotBounds_obj.y-20, dot: false, resolution: 4},
				{ x: lXAndHalfWidth_num + 100, y: lSpotBounds_obj.y-20, dot: false, resolution: 4}
			]
		};

		lHints_obj_arr.push(lHint_obj);
		//...AIMING

		//INCREASE BET LEVEL...
		lHint_obj = {
			textAssetName: 'TATutorialIncreaseBetLevel',
			textPosition: 
			{
				x: lXAndWidth_num - 76,
				y: lYAndHalfheight_num - 50
			},
			points: [
				{ x: lXAndWidth_num - 76, y: lYAndHalfheight_num + 14, dot: true},
				{ x: lXAndWidth_num - 76, y: lYAndHalfheight_num - 45, dot: false},
				{ x: lXAndWidth_num + 100, y: lYAndHalfheight_num - 45, dot: false},
			]
		};

		lHints_obj_arr.push(lHint_obj);
		//...INCREASE BET LEVEL

		//LOWER BET LEVEL...
		lHint_obj = {
			textAssetName: 'TATutorialLowerBetLevel',
			textPosition: 
			{
				x: lSpotBounds_obj.x + 76 + (APP.isMobile ? -19 : 0 ),
				y: lYAndHalfheight_num - 50
			},
			points: [
				{ x: lSpotBounds_obj.x + 76, y: lYAndHalfheight_num + 14, dot: true},
				{ x: lSpotBounds_obj.x + 76, y: lYAndHalfheight_num - 45, dot: false},
				{ x: lSpotBounds_obj.x - 83, y: lYAndHalfheight_num - 45, dot: false},
			]
		};

		lHints_obj_arr.push(lHint_obj);
		//...LOWER BET LEVEL

		let lRealSpotBounds_obj = aData_obj.mainSpot;
		let lPositionFixX_num = lRealSpotBounds_obj.x + 93;
		let lInitSpotPositionY_num = aData_obj.isSpotAtBottom ? lRealSpotBounds_obj.y + lRealSpotBounds_obj.height - 50 : lRealSpotBounds_obj.y + 50;
		//YOUR LOCATION...
		lHint_obj = {
			textAssetName: 'TATutorialYourLocation',
			textPosition: 
			{
				x: lPositionFixX_num - 62 + (APP.isMobile ? -1 : 0 ),
				y: lInitSpotPositionY_num - (aData_obj.isSpotAtBottom ? 50 : -70)
			},
			points: [
				{ x: lPositionFixX_num, y: lInitSpotPositionY_num, dot: true},
				{ x: lPositionFixX_num, y: lInitSpotPositionY_num - 50 * (aData_obj.isSpotAtBottom ? 1 : -1) , dot: false},
				{ x: lPositionFixX_num + lRealSpotBounds_obj.width*1/3 + 3, y: lInitSpotPositionY_num - 50 * (aData_obj.isSpotAtBottom ? 1 : -1), dot: false},
				{ x: lPositionFixX_num - lRealSpotBounds_obj.width*1/3 - 3, y: lInitSpotPositionY_num - 50 * (aData_obj.isSpotAtBottom ? 1 : -1), dot: false},
				{ x: lPositionFixX_num, y: lInitSpotPositionY_num - 50 * (aData_obj.isSpotAtBottom ? 1 : -1), dot: false},
			]
		};

		lHints_obj_arr.push(lHint_obj);
		//...YOUR LOCATION

		//WEAPON SETTINGS...
		let lSettingsPosition_obj = {
			x: APP.isMobile ?  this._fBGWidth_num - 50 :  this._fBGWidth_num - 165,
			y: this._fBGHeight_num - 15 
		};

		lHint_obj = {
			textAssetName: APP.isMobile ? 'TATutorialSettings' : 'TATutorialWeaponSettings',
			textPosition: 
			{
				x: lSettingsPosition_obj.x - 180,
				y: lSettingsPosition_obj.y - 5
			},
			points: [
				{ x: lSettingsPosition_obj.x, y: lSettingsPosition_obj.y, dot: true},
				{ x: lSettingsPosition_obj.x - 180, y: lSettingsPosition_obj.y, dot: false}
			]
		};

		if(APP.isAutoFireMode || APP.isMobile)lHints_obj_arr.push(lHint_obj);
		//...WEAPON SETTINGS
		
		//NICKNAME...
		let lNicknamePosition_obj = {
			x: this._fBGWidth_num/2 - 130,
			y: this._fBGHeight_num/2 + 60
		};

		lHint_obj = {
			textAssetName: 'TATutorialYourName',
			textPosition: 
			{
				x: lNicknamePosition_obj.x - 150,
				y: lNicknamePosition_obj.y - 5
			},
			points: [
				{ x: lNicknamePosition_obj.x, y: lNicknamePosition_obj.y, dot: true},
				{ x: lNicknamePosition_obj.x - 150, y: lNicknamePosition_obj.y, dot: false}
			]
		};

		lHints_obj_arr.push(lHint_obj);
		//...NICKNAME

		//COST PER SHOT...
		let CostPosition_obj = {
			x: this._fBGWidth_num/2 + 130,
			y: this._fBGHeight_num/2 + 60
		};

		lHint_obj = {
			textAssetName: 'TATutorialCostPerShot',
			textPosition: 
			{
				x: CostPosition_obj.x + 35 + (APP.isMobile ? -5 : 0 ),
				y: CostPosition_obj.y - 5
			},
			points: [
				{ x: CostPosition_obj.x, y: CostPosition_obj.y, dot: true},
				{ x: CostPosition_obj.x + 160, y: CostPosition_obj.y, dot: false}
			]
		};

		lHints_obj_arr.push(lHint_obj);
		//...COST PER SHOT

		let lAutoTargetBounds_obj = aData_obj.autoTargetSwitcher;
		let lAutotargetXAndHalfWidth_num = lAutoTargetBounds_obj.x + lAutoTargetBounds_obj.width/2;
		let lAutotargetYAndHalfHeight_num = lAutoTargetBounds_obj.y + lAutoTargetBounds_obj.height/2;
		//AUTOTARGET...
		lHint_obj = {
			textAssetName: 'TATutorialLockOntoEnemy',
			textPosition: 
			{
				x: lAutotargetXAndHalfWidth_num - 80,
				y: lAutotargetYAndHalfHeight_num - 53
			},
			points: [
				{ x: lAutotargetXAndHalfWidth_num, y: lAutotargetYAndHalfHeight_num + 5, dot: true},
				{ x: lAutotargetXAndHalfWidth_num, y: lAutotargetYAndHalfHeight_num - 50, dot: false},
				{ x: lAutotargetXAndHalfWidth_num - 85, y: lAutotargetYAndHalfHeight_num - 50, dot: false},
				{ x: lAutotargetXAndHalfWidth_num + 85, y: lAutotargetYAndHalfHeight_num - 50, dot: false},
				{ x: lAutotargetXAndHalfWidth_num, y: lAutotargetYAndHalfHeight_num - 50, dot: false}
			]
		};

		if (APP.isMobile)
		{
			lHints_obj_arr.push(lHint_obj);
		}
		//...AUTOTARGET

		return lHints_obj_arr;
	}

	

	get __showAgainCaptionAssetId()
	{
		return "TATutorialDoNotShowTutorialAgain";
	}

	destroy()
	{
		super.destroy();
	}
}
export default TutorialView;