import SimpleUIView from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/SimpleUIView';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import RailgunBeam from '../../../../main/animation/railgun/RailgunBeam';
import RailgunAfterBeam from '../../../../main/animation/railgun/RailgunAfterBeam';
import RailgunHitEffect from '../../../../main/animation/railgun/RailgunHitEffect';

class RailgunsView extends SimpleUIView {

	static get EVENT_ON_BEAM_ANIMATION_COMPLETED() 		 	{ return RailgunBeam.EVENT_ON_ANIMATION_COMPLETED; }
	static get EVENT_ON_BEAM_BASIC_ANIMATION_COMPLETED() 	{ return RailgunBeam.EVENT_ON_BASIC_ANIMATION_COMPLETED; }
	static get EVENT_ON_BEAM_ROTATION_UPDATED() 			{ return RailgunBeam.EVENT_ON_ROTATION_UPDATED; }

	static get EVENT_ON_HIT_EFFECT_STARTED() 				{ return "EVENT_ON_HIT_EFFECT_STARTED"; }
	static get EVENT_ON_HIT_EFFECT_COMPLETED() 				{ return "EVENT_ON_HIT_EFFECT_COMPLETED"; }
	

	constructor()
	{
		super();
		this._fBeams_rb_arr = [];
		this._fAfterBeams_rab_arr = [];
		this._fHitEffects_rhe_arr = [];
	}

	get _mainContainer ()
	{
		return APP.currentWindow.gameField.railgunEffectContainer;
	}

	//PUBLIC...
	i_init()
	{
		this._createView();
	}

	i_showFire(data, aStartPos_pt, aEndPos_pt, callback)
	{
		this._showFire(data, aStartPos_pt, aEndPos_pt, callback);
	}

	i_clearAll()
	{
		for (let lBeam_rb of this._fBeams_rb_arr)
		{
			lBeam_rb.destroy();
		}
		for (let lAfterBeam_rab of this._fAfterBeams_rab_arr)
		{
			lAfterBeam_rab.destroy();
		}
		for (let lHitEffect_rhe of this._fHitEffects_rhe_arr)
		{
			lHitEffect_rhe.destroy();
		}

		this._fBeams_rb_arr = [];
		this._fAfterBeams_rab_arr = [];
		this._fHitEffects_rhe_arr = [];
	}
	//...PUBLIC

	//PRIVATE...
	_createView()
	{
		this._mainContainer.container.addChild(this);
		this.zIndex = this._mainContainer.zIndex;
	}

	_showFire(data, aStartPos_pt, aEndPos_pt, callback)
	{
		//create beam
		let lBeam_rb = new RailgunBeam(data, callback);
		if (data.rid == -1)
		{
			lBeam_rb.alpha = 0.3;
		}

		lBeam_rb.on(RailgunBeam.EVENT_ON_ANIMATION_COMPLETED, this._onBeamAnimationCompleted, this);
		lBeam_rb.on(RailgunBeam.EVENT_ON_BASIC_ANIMATION_COMPLETED, this._onBeamBasicAnimationCompleted, this);
		lBeam_rb.on(RailgunBeam.EVENT_ON_TARGET_ACHIEVED, this._onBeamTargetAchieved, this);
		lBeam_rb.on(RailgunBeam.EVENT_ON_ROTATION_UPDATED, this.emit, this);
		lBeam_rb.i_shoot(aStartPos_pt, aEndPos_pt);
		this.addChild(lBeam_rb);

		this._fBeams_rb_arr.push(lBeam_rb);
	}

	_onBeamTargetAchieved(aEvent_obj)
	{
		let lBeam_rb = aEvent_obj.target;
		let lTargetEnemy_enm = lBeam_rb.targetEnemy;
		let lStartPos_pt = lBeam_rb.endPoint;
		let lRotation_num = lBeam_rb.rotation;
		let lAlpha_num = lBeam_rb.alpha;
		//create AfterBeam
		this._createAfterBeam(lTargetEnemy_enm, lStartPos_pt, lRotation_num, lAlpha_num);

		//show hit
		this._showHitEffect(lStartPos_pt, lAlpha_num);
		
	}

	_onBeamAnimationCompleted(aEvent_obj)
	{
		let lBeam_rb = aEvent_obj.target;
		let lIndex_int = this._fBeams_rb_arr.indexOf(lBeam_rb);
		if (~lIndex_int)
		{
			this._fBeams_rb_arr.splice(lIndex_int, 1);
			lBeam_rb.destroy();
		}
	}

	_onBeamBasicAnimationCompleted(aEvent_obj)
	{
		let lBeam_rb = aEvent_obj.target;
		this.emit(RailgunsView.EVENT_ON_BEAM_BASIC_ANIMATION_COMPLETED, {shotData: lBeam_rb.shotData});
	}

	_onAfterBeamAnimationCompleted(aEvent_obj)
	{
		let lAfterBeam_rab = aEvent_obj.target;
		let lIndex_int = this._fAfterBeams_rab_arr.indexOf(lAfterBeam_rab);
		if (~lIndex_int)
		{
			this._fAfterBeams_rab_arr.splice(lIndex_int, 1);
			lAfterBeam_rab.destroy();
		}
	}

	_createAfterBeam(aTargetEnemy_enm, aStartPos_pt, aRotation_num, aAlpha_num)
	{
		let lAfterBeam_rab = new RailgunAfterBeam(aTargetEnemy_enm);
		lAfterBeam_rab.alpha = aAlpha_num;
		lAfterBeam_rab.on(RailgunBeam.EVENT_ON_ANIMATION_COMPLETED, this._onAfterBeamAnimationCompleted, this);

		lAfterBeam_rab.i_shoot(aStartPos_pt, aRotation_num);
		this._mainContainer.container.addChild(lAfterBeam_rab);

		this._fAfterBeams_rab_arr.push(lAfterBeam_rab);
	}

	_showHitEffect(aPos_pt, aAlpha_num)
	{
		let lHitEffect_rhe = new RailgunHitEffect();
		lHitEffect_rhe.alpha = aAlpha_num;
		lHitEffect_rhe.position.set(aPos_pt.x, aPos_pt.y);
		lHitEffect_rhe.once(RailgunHitEffect.EVENT_ON_ANIMATION_END, this._onHitEffectAnimationEnd, this);
		this.addChild(lHitEffect_rhe);
		this._fHitEffects_rhe_arr.push(lHitEffect_rhe);

		this.emit(RailgunsView.EVENT_ON_HIT_EFFECT_STARTED);
	}

	_onHitEffectAnimationEnd(aEvent_obj)
	{
		let lHitEffect_rhe = aEvent_obj.target;
		let lIndex_int = this._fHitEffects_rhe_arr.indexOf(lHitEffect_rhe);
		if (~lIndex_int)
		{
			this._fHitEffects_rhe_arr.splice(lIndex_int, 1);
			lHitEffect_rhe.destroy();
		}

		this.emit(RailgunsView.EVENT_ON_HIT_EFFECT_COMPLETED);
	}
	//...PRIVATE
}

export default RailgunsView;