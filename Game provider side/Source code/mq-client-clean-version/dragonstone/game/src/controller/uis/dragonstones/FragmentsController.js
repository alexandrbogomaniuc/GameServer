import SimpleController from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/base/SimpleController';
import FragmentsInfo from '../../../model/uis/dragonstones/FragmentsInfo';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import GameScreen from '../../../main/GameScreen';
import GameField from '../../../main/GameField';
import { Z_INDEXES } from '../../../main/GameField';
import FragmentItem from '../../../view/uis/dragonstones/FragmentItem';
import { Utils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import GameWebSocketInteractionController from '../../../controller/interaction/server/GameWebSocketInteractionController';
import { SCENE_WIDTH, SCENE_HEIGHT } from '../../../config/Constants';
import FragmentsPanelController from './FragmentsPanelController';

class FragmentsController extends SimpleController
{
	static get EVENT_ON_ALL_FRAGMENTS_AWARDS_COMPLETED()		{return 'EVENT_ON_ALL_FRAGMENTS_AWARDS_COMPLETED';}
	static get EVENT_ON_FRAGMENTS_AWARD_INTERRUPTED()			{return 'EVENT_ON_FRAGMENTS_AWARD_INTERRUPTED';}
	static get ON_FRAGMENT_APPEARING_STARTED()					{return FragmentItem.ON_FRAGMENT_APPEARING_STARTED;}
	static get ON_FRAGMENT_APPEARED()							{return FragmentItem.ON_FRAGMENT_APPEARED;}
	static get ON_FRAGMENT_LANDING_STARTED()					{return FragmentItem.ON_FRAGMENT_LANDING_STARTED;}
	static get ON_FRAGMENT_LANDED()								{return FragmentItem.ON_FRAGMENT_LANDED;}


	get isAwardingInProgress()
	{
		return (this._fPendingFragments_obj_arr && this._fPendingFragments_obj_arr.length > 0)
				|| (this._fActiveAwards_arr && this._fActiveAwards_arr.length > 0);
	}

	get pendingFragments()
	{
		return this._fPendingFragments_obj_arr;
	}

	get pendingFragmentsAmount()
	{
		return this._fPendingFragments_obj_arr && this._fPendingFragments_obj_arr.length || 0;
	}

	get activeAwardsAmount()
	{
		return this._fActiveAwards_arr && this._fActiveAwards_arr.length || 0;
	}

	initPanel(fragmentsPanelController)
	{
	}

	constructor()
	{
		super(new FragmentsInfo());

		this._fPendingFragments_obj_arr = [];
		this._fActiveAwards_arr = [];
		this._fStartPosition_num = null;
	}

	__initControlLevel()
	{
		super.__initControlLevel();

		this._gameScreen = APP.gameScreen;
		//this._gameScreen.once(GameScreen.EVENT_ON_READY, this._onGameScreenReady, this);
		this._gameScreen.on(GameScreen.EVENT_ON_ROOM_FIELD_CLEARED, this._onRoomFieldCleared, this);
		this._gameScreen.on(GameScreen.EVENT_ON_SHOT_RESPONSE_OCCURED, this._onServerShotResponse, this); // priority should be higher then in GameScreen
		this._gameScreen.on(GameScreen.EVENT_ON_BATTLEGROUND_ROUND_RESULT_MESSAGE, this._destroyedFragments, this);

		let wsInteractionController = APP.webSocketInteractionController;
		wsInteractionController.on(GameWebSocketInteractionController.EVENT_ON_SERVER_CONNECTION_CLOSED, this._onGameServerConnectionClosed, this);

		this._gameField = this._gameScreen.gameField;
		this._gameField.on(GameField.EVENT_ON_ENEMY_HIT_ANIMATION, this._onEnemyHitOrMissAnimation, this);
		this._gameField.on(GameField.EVENT_ON_ENEMY_MISS_ANIMATION, this._onEnemyHitOrMissAnimation, this);
	}

	_destroyedFragments()
	{
		this._interruptAwards();
	}

	_onRoomFieldCleared()
	{
		this._interruptAwards();
	}

	_onGameServerConnectionClosed(event)
	{
		if (event.wasClean)
		{
			return;
		}

		this._interruptAwards();
	}

	_onServerShotResponse(event)
	{
		let lShotResponseInfo_sri = event.info;

		this._addPendingFragmentsIfRequired(lShotResponseInfo_sri.data);
	}

	_isNewFragment(aFragmentId)
	{
		this._fActiveAwards_arr.forEach(lActiveFragment => {
			if(lActiveFragment.fragmentId == aFragmentId)
			{
				return false;
			}
		});
		return true;
	}

	_addPendingFragmentsIfRequired(aShotResponseData)
	{
		if (this._gameScreen.isPaused)
		{
			return;
		}

		let lShotResponseData = aShotResponseData;
		let lEnemyId_num = lShotResponseData.enemy ? lShotResponseData.enemy.id : lShotResponseData.enemyId;

		if (lShotResponseData.fragments && !!lShotResponseData.fragments.length)
		{
			for (let i=0; i<lShotResponseData.fragments.length; i++)
			{
				let lCurFragnemtId_num = lShotResponseData.fragments[i];
				if (lCurFragnemtId_num > 0 && this._isNewFragment(lCurFragnemtId_num))
				{
					this._addPendingFragment(lCurFragnemtId_num, lEnemyId_num, lShotResponseData.rid);
				}
			}
		}
		else if (lShotResponseData.fragmentId !== undefined && lShotResponseData.fragmentId > 0 && this._isNewFragment(lShotResponseData.fragmentId))
		{
			this._addPendingFragment(lShotResponseData.fragmentId, lEnemyId_num, lShotResponseData.rid);
		}
	}

	_addPendingFragment(fragmentId, enemyId, rid)
	{
		let lFragment = {
			id: fragmentId,
			enemyId: enemyId,
			rid: rid
		};

		this._fPendingFragments_obj_arr.push(lFragment);
	}

	_onEnemyHitOrMissAnimation(aEvent_obj)
	{
		const data = aEvent_obj.data;

		let lFragmentIdsToShow_arr = [];

		let lEnemyData = data;
		let lEnemyFragments = lEnemyData.fragments || [];


		if (!lEnemyFragments.length)
		{
			if (lEnemyData.fragmentId !== undefined  && lEnemyData.fragmentId > 0)
			{
				lEnemyFragments.push(lEnemyData.fragmentId);
			}
		}

		if (lEnemyFragments.length > 0)
		{
			let lEnemyId_num = lEnemyData.enemy ? lEnemyData.enemy.id : lEnemyData.enemyId;
			lFragmentIdsToShow_arr.push({enemyId: lEnemyId_num, fragments: lEnemyFragments});
		}

		if (lFragmentIdsToShow_arr.length > 0)
		{
			for (let enemyFragments of lFragmentIdsToShow_arr)
			{
				/*console debug...
				console.log('lEnemyData',lEnemyData.x, lEnemyData.y)
				console.log('lEnemyID', enemyFragments.enemyId)
				...console debug*/

				this._fStartPosition_num = new PIXI.Point(0,0)

				if (lEnemyData.x === 0 && lEnemyData.y === 0)
				{
					this._fStartPosition_num.x = SCENE_WIDTH/2;
					this._fStartPosition_num.y = SCENE_HEIGHT/2;
				}
				else
				{

					this._fStartPosition_num.x = lEnemyData.x;
					this._fStartPosition_num.y = lEnemyData.y;
				}				

				this._showFragments(enemyFragments.fragments, enemyFragments.enemyId, data.rid);
			}
		}

	}

	_showFragments(aFragmentIdsToShow_arr, aEnemyId_num, rid)
	{
		for (let i=0; i<aFragmentIdsToShow_arr.length; i++)
		{
			if(this.isAwardingInProgress)
			{
				let lCurFragmentId_num = aFragmentIdsToShow_arr[i];

				let lPendingFragment = this._removePendingFragment(lCurFragmentId_num, aEnemyId_num, rid);

				if (!lPendingFragment)
				{
					throw new Error(`Unexpected fragment to show, fragmentId: ${lCurFragmentId_num}, enemyId: ${aEnemyId_num}, rid: ${rid}.`);
				}

				this._showFragmentAward(lCurFragmentId_num, aEnemyId_num);
			}
		}
	}

	_showFragmentAward(aCurFragmentId_num, aEnemyId_num)
	{
		let lFragmentItem = new FragmentItem(aCurFragmentId_num);
		this._fActiveAwards_arr.push(lFragmentItem);

		this._fragmentsContainer.addChild(lFragmentItem);
		lFragmentItem.zIndex = Z_INDEXES.AWARDED_FRAGMENT;

		let lStartPos = this._fStartPosition_num;

		lFragmentItem.position.set(lStartPos.x, lStartPos.y);

		let lAppearGlobalPosition_p = this._generateAppearPosition(lStartPos);
		let lFinalGlobalPosition_p = this._generateFinalPosition(aCurFragmentId_num);

		lFragmentItem.once(FragmentItem.ON_FRAGMENT_APPEARING_STARTED, this.emit, this);
		lFragmentItem.once(FragmentItem.ON_FRAGMENT_APPEARED, this.emit, this);
		lFragmentItem.once(FragmentItem.ON_FRAGMENT_LANDING_STARTED, this.emit, this);
		lFragmentItem.once(FragmentItem.ON_FRAGMENT_LANDED, this.emit, this);
		lFragmentItem.once(FragmentItem.ON_FRAGMENT_ANIMATION_COMPLETED, this._onFragmentAnimationCompleted, this);

		lFragmentItem.allowLanding();
		lFragmentItem.startAnimation(lAppearGlobalPosition_p, lFinalGlobalPosition_p);
	}

	_onFragmentAnimationCompleted(event)
	{
		let lFragmentItem = event.target;

		this._removeActiveAward(lFragmentItem);
	}

	_removeActiveAward(aFragmentItem)
	{
		let lFragmentIndex = this._fActiveAwards_arr.indexOf(aFragmentItem);
		if (lFragmentIndex >= 0)
		{
			this._fActiveAwards_arr.splice(lFragmentIndex, 1);
		}

		if (this._fPendingFragments_obj_arr.length == 0 && this._fActiveAwards_arr.length == 0)
		{
			this.emit(FragmentsController.EVENT_ON_ALL_FRAGMENTS_AWARDS_COMPLETED);
		}

		aFragmentItem.destroy();
	}

	/*_generateFragmentStartPosition(aEnemyId_num)
	{
		let lStartPosition = new PIXI.Point(0, 0);
		let gf = this._gameField;

		if (aEnemyId_num !== undefined)
		{
			let enemyView = gf.getExistEnemy(aEnemyId_num) || gf.getDeadEnemy(aEnemyId_num);

			if (enemyView)
			{
				lStartPosition.x = enemyView.position.x;
				lStartPosition.y = enemyView.position.y;
			}
			else
			{
				let lEnemyLastPos = gf.getEnemyLastPosition(aEnemyId_num);
				if (lEnemyLastPos)
				{
					lStartPosition.x = lEnemyLastPos.x;
					lStartPosition.y = lEnemyLastPos.y;
				}
			}
		}

		return lStartPosition;
	}*/

	_generateAppearPosition(aStartPos)
	{
		let lAppearX_num = aStartPos.x-75;
		let lDirX = Math.random() > 0.5 ? 1 : -1;
		lAppearX_num += lDirX*Utils.random(0, 30, false);

		if (lAppearX_num < 30)
		{
			lAppearX_num += 30-lAppearX_num;
		}
		else if (lAppearX_num > 930)
		{
			lAppearX_num += lAppearX_num-930;
		}

		let lAppearY_num = aStartPos.y - 100;
		let lDirY = Math.random() > 0.5 ? 1 : -1;
		lAppearY_num += lDirY*Utils.random(0, 30, false);

		if (lAppearY_num < 40)
		{
			lAppearY_num += 40-lAppearY_num;
		}
		else if (lAppearY_num > 510)
		{
			lAppearY_num += lAppearY_num-510;
		}

		return new PIXI.Point(lAppearX_num, lAppearY_num);
	}

	_generateFinalPosition(aCurFragmentId_num)
	{
		return this._gameField.fragmentsPanelController.getFragmentLandingGlobalPosition(aCurFragmentId_num);
	}

	_removePendingFragment(fragmentId, aEnemyId_num, rid)
	{
		for (let i=0; i<this._fPendingFragments_obj_arr.length; i++)
		{
			let lCurFragment = this._fPendingFragments_obj_arr[i];
			if (lCurFragment.id == fragmentId && lCurFragment.enemyId == aEnemyId_num && lCurFragment.rid == rid)
			{
				this._fPendingFragments_obj_arr.splice(i, 1);
				return lCurFragment;
			}
		}

		return null;
	}

	get _fragmentsContainer()
	{
		return this._gameField.fragmentsAwardContainer;
	}

	_interruptAwards()
	{
		let lInterruptedFragments_int_arr = [];

		while (this._fPendingFragments_obj_arr.length)
		{
			let pendingFragment = this._fPendingFragments_obj_arr[0];
			if (pendingFragment)
			{
				lInterruptedFragments_int_arr.push(pendingFragment.id);
			}
			this._fPendingFragments_obj_arr.splice(0, 1);
		}

		while (this._fActiveAwards_arr.length)
		{
			let activeFragment = this._fActiveAwards_arr[0];
			if (activeFragment)
			{
				lInterruptedFragments_int_arr.push(activeFragment.fragmentId);

				activeFragment.destroy();
			}
			this._fActiveAwards_arr.splice(0, 1);
		}

		this.emit(FragmentsController.EVENT_ON_FRAGMENTS_AWARD_INTERRUPTED, {interruptedFragments: lInterruptedFragments_int_arr});
	}
}

export default FragmentsController;