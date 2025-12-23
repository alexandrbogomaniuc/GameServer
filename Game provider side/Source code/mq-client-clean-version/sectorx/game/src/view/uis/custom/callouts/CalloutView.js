import SimpleUIView from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/SimpleUIView';
import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import I18 from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
import { FRAME_RATE } from '../../../../../../shared/src/CommonConstants';
import * as Easing from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';

const INDENT_X = 100;

class CalloutView extends SimpleUIView
{
	static get EVENT_ON_PRESENTATION_ENDED () 	{ return "onPresentationEnded"; }
	static get EVENT_ON_CALLOUT_HIDDEN () 		{ return "onCalloutHidden"; }

	i_interruptAnimations()
	{
		this._fBaseContainer_spr && this._fBaseContainer_spr.removeTweens();
		this._fSweep_sprt && this._fSweep_sprt.removeTweens();
	}

	startCallout()
	{
		this._showCallout();
	}

	stopCallout()
	{
		this._hideCallout();
	}

	get panelHeight()
	{
		return this._fPanelHeight_num;
	}

	constructor()
	{
		super();

		this.__fLightSweepAnimationDuration_num = 90*FRAME_RATE;

		this._fBaseContainer_spr = null;
		this._fPanelContainer_spr = null;
		this._fMessageContainer_spr = null;
		this._fFXContainer_spr = null;

		this._fFirstCapstion_cta = null;
		this._fSecondCapstion_cta = null;

		this._fStartSweepX_num = -90;
		this._fEndSweepX_num = 120;
		this._fMaskX_num = 5;
		this._fMaskY_num = -10;

		this._fPanelHeight_num = null;

		this._initCalloutView();

		this.visible = false;
	}

	setCaption(aFirstCaptionId_str, aSecondCaptionId_str)
	{
		this._setCaption(aFirstCaptionId_str, aSecondCaptionId_str);
	}

	setCaptionScale(captionScale = 0.8)
	{
		this._setCaptionScale(captionScale);
	}

	setMaskPosition(maskX = 50, maskY = -10)
	{
		this._setMaskPosition(maskX, maskY);
	}

	setSweepBounds(leftBound = -75, rightBound = 120)
	{
		this._setSweepBounds(leftBound, rightBound);
	}

	_initCalloutView()
	{
		this._addContainers();
		this._addCalloutBase();
		this._initLightSweep();
	}

	_addContainers()
	{
		let baseContainer = this._fBaseContainer_spr = this.addChild(new Sprite());
		baseContainer.position.set(-INDENT_X, 100);
		
		let panelContainer = this._fPanelContainer_spr = this.addChild(new Sprite());
		panelContainer.zIndex = 1;
		this._fBaseContainer_spr.addChild(panelContainer);

		let messageContainer = this._fMessageContainer_spr = this.addChild(new Sprite());
		messageContainer.zIndex = 2;
		this._fBaseContainer_spr.addChild(messageContainer);

		let fXContainer = this._fFXContainer_spr = this.addChild(new Sprite());
		fXContainer.zIndex = 3;
		this._fBaseContainer_spr.addChild(fXContainer);
	}

	_addCalloutBase()
	{
		let lPanel_spr = this._fPanelContainer_spr.addChild(APP.library.getSprite("callouts/callout_panel"));
		this._fPanelHeight_num = lPanel_spr.height;
		lPanel_spr.position.set(23, 28);
	}

	//MESSAGE...
	_setCaption(aFirstCaptionId_str, aSecondCaptionId_str)
	{
		if (
			this._fFirstCapstion_cta &&
			this._fSecondCapstion_cta &&
			this._fFirstCapstion_cta.descriptor.assetId === aFirstCaptionId_str &&
			this._fSecondCapstion_cta.descriptor.assetId === aSecondCaptionId_str
		)
		{
			return;
		}

		if (this._fSweep_sprt)
		{
			this._fSweep_sprt.destroy();
			this._fSweep_sprt = null;
		}

		this._fMessageContainer_spr.destroyChildren();

		this._fFirstCapstion_cta = this._fMessageContainer_spr.addChild(I18.generateNewCTranslatableAsset(aFirstCaptionId_str));
		this._fFirstCapstion_cta.position.set(this._fMaskX_num, 1);
		this._fFirstCapstion_cta.scale.set(0.9);

		this._fSecondCapstion_cta = this._fMessageContainer_spr.addChild(I18.generateNewCTranslatableAsset(aSecondCaptionId_str));
		this._fSecondCapstion_cta.position.set(this._fMaskX_num, 1);
		this._fSecondCapstion_cta.scale.set(0.9);
	}

	_setCaptionScale(aScale_num)
	{
		this._fMessageContainer_spr.scale.set(aScale_num)
	}
	//...MESSAGE

	//ANIMATION...
	get _profilingInfo()
	{
		return APP.profilingController.info;
	}
	
	_showCallout()
	{
		this._fBaseContainer_spr.removeTweens();
		this._fBaseContainer_spr.show();
		this._fBaseContainer_spr.moveXTo(INDENT_X, 300, Easing.linear.easeIn, this._startLightSweepAnimation.bind(this));
	}

	_onShowTimerCompleted()
	{
		this._resetLightSweepVisibility();
		this.emit(CalloutView.EVENT_ON_PRESENTATION_ENDED);
	}

	_hideCallout()
	{
		this._fBaseContainer_spr.removeTweens();
		this._fBaseContainer_spr.moveXTo(-INDENT_X, 300, Easing.linear.easeIn, this._onCalloutAnimationCompleted.bind(this));
	}

	_resetLightSweepVisibility()
	{
		if (!this._fSweep_sprt)
		{
			this._initLightSweep();
		}

		this._fSweep_sprt.hide();
		this._fSweep_sprt.position.set(this._fStartSweepX_num, 50);
	}

	_onCalloutAnimationCompleted()
	{
		this._fBaseContainer_spr.hide();
		this._resetLightSweepVisibility();
		this.emit(CalloutView.EVENT_ON_CALLOUT_HIDDEN);
	}

	_initLightSweep()
	{
		if (this._profilingInfo.isVfxProfileValueMediumOrGreater && !this._fSweep_sprt)
		{
			this._fSweep_sprt = this._fFXContainer_spr.addChild(APP.library.getSprite("light_sweep"));
			this._fSweep_sprt.scale.set(0.5);
			this._fSweep_sprt.alpha = 0.8;
			this._fSweep_sprt.blendMode = PIXI.BLEND_MODES.ADD;

			var lBounds_obj = this._fMessageContainer_spr.getBounds();
			var l_txtr = PIXI.RenderTexture.create({ width: lBounds_obj.width, height:  lBounds_obj.height});
			this._fMessageContainer_spr.position.set(75, 0);
			APP.stage.renderer.render(this._fMessageContainer_spr, { renderTexture: l_txtr });					// renders just right part of _fMessageContainer_spr, idk how to fix that
			this._fMessageContainer_spr.position.set(0, 0);

			let lMask_sprt = new PIXI.Sprite(l_txtr);
			this._fSweep_sprt.mask = lMask_sprt;
			lMask_sprt.position.set(-75, 0);
			this._fFXContainer_spr.addChild(lMask_sprt);
		}
		else
		{
			this._fSweep_sprt = this._fFXContainer_spr.addChild(new Sprite());
		}

		this._resetLightSweepVisibility();
	}

	_startLightSweepAnimation()
	{
		if (!this._fSweep_sprt)
		{
			this._initLightSweep();
		}

		this._fSweep_sprt.show();
		this._fSweep_sprt.moveXTo(this._fEndSweepX_num, this.__fLightSweepAnimationDuration_num, null, this._onShowTimerCompleted.bind(this));
	}

	_setSweepBounds(firstCaptionId, secondCaptionId)
	{
		this._fStartSweepX_num = firstCaptionId;
		this._fEndSweepX_num = secondCaptionId;
	}

	_setMaskPosition(maskX, maskY)
	{
		this._fMaskX_num = maskX;
		this._fMaskY_num = maskY;
	}
	//...ANIMATION

	destroy()
	{
		this._fBaseContainer_spr && this._fBaseContainer_spr.destroy();
		this._fBaseContainer_spr = null;

		this._fSweep_sprt && this._fSweep_sprt.destroy();
		this._fSweep_sprt = null;

		this._fPanelContainer_spr = null;

		this._fFirstCapstion_cta = null;
		this._fSecondCapstion_cta = null;
		this._fMessageContainer_spr && this._fMessageContainer_spr.destroy();
		this._fMessageContainer_spr = null;
		this._fFXContainer_spr = null;

		super.destroy();
	}
}

export default CalloutView;