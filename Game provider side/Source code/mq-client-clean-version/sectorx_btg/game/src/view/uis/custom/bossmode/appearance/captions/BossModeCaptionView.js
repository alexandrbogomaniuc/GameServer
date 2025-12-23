import Sprite from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import Sequence from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { FRAME_RATE } from '../../../../../../../../shared/src/CommonConstants';
import { Utils } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import { APP } from '../../../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';

class BossModeCaptionView extends Sprite
{
	static get EVENT_ON_CAPTION_BECAME_VISIBLE()				{return "onBossCaptionBecameVisible";}
	static get EVENT_ON_ALL_ANIMATIONS_COMPLETED()				{return "onBossCaptionAnimationCompleted";}

	/**
	 * Starts to play animation.
	 * @public
	 */
	i_playAnimation()
	{
		this.__playAnimation();
	}

	//INIT...
	constructor()
	{
		super();

		this.__fBackgroundContainer_sprt = null;
		this.__fCaptionContainer_sprt = null;
		this.__fCaption_sprt = null;
		this.__fAnimationsCount_num = 0;

		this.__initContainers();
	}

	/**
	 * Creates all containers.
	 * @protected
	 * @virtual
	 */
	__initContainers()
	{
		this.__fBackgroundContainer_sprt = this.addChild(new Sprite());
		this.__fCaptionContainer_sprt = this.addChild(new Sprite());
	}

	//...INIT

	/**
	 * @protected
	 * @virtual
	 */
	__playAnimation()
	{
		this.__startCaptionAnimation();
	}

	/**
	 * @abstract
	 * @protected
	 */
	__getTranslatableImageCaptionAsset()
	{
		// abstract
	}

	/**
	 * @protected
	 * @virtual
	 */
	__getTranslatableAddCaptionAsset()
	{
		// nothing to return
	}

	/**
	 * Calls view destroy.
	 * @protected
	 * @virtual
	 */
	__onCaptionAnimationCompleted()
	{
		this.emit(BossModeCaptionView.EVENT_ON_ALL_ANIMATIONS_COMPLETED);
		this.destroy();
	}

	/**
	 * @protected
	 * @virtual
	 */
	__startCaptionAnimation()
	{
		this.__fCaption_sprt = this.__fCaptionContainer_sprt.addChild(this.__getTranslatableImageCaptionAsset());
		this.__fCaptionContainer_sprt.scale.set(0);

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this.__startCaptionFiltersAnimations();
		}

		let lScaleSeq_arr = [
			{ tweens:[{prop:"scale.x", to: 0.62}, {prop:"scale.y", to: 0.62}], duration: 5*FRAME_RATE, onfinish: this.__onCaptionBecameVisible.bind(this) },
			{ tweens:[{prop:"scale.x", to: 0.58}, {prop:"scale.y", to: 0.58}], duration: 17*FRAME_RATE },
			{ tweens:[], duration: 50*FRAME_RATE },
			{ tweens:[{prop:"scale.x", to: 0.60}, {prop:"scale.y", to: 0.6}], duration: 7*FRAME_RATE, onfinish: this.__onCaptionDisappearanceStarted.bind(this) },
			{ tweens:[{prop:"scale.x", to: 0}, {prop:"scale.y", to: 0}], duration: 4*FRAME_RATE, onfinish: this.__decreaseAnimationsCount.bind(this) }
		];

		let lRotationSeq_arr = [
			{ tweens:[{prop:"rotation", to: -0.008726646259971648}], duration: 2*FRAME_RATE }, // Utils.gradToRad(-0.5)
			{ tweens:[{prop:"rotation", to: 0.005235987755982988}], duration: 2*FRAME_RATE }, // Utils.gradToRad(0.3)
			{ tweens:[{prop:"rotation", to: -0.010471975511965976}], duration: 2.5*FRAME_RATE }, // Utils.gradToRad(-0.6)
			{ tweens:[{prop:"rotation", to: 0.005235987755982988}], duration: 2*FRAME_RATE }, // Utils.gradToRad(0.3)
			{ tweens:[{prop:"rotation", to: 0.005235987755982988}], duration: 2*FRAME_RATE }, // Utils.gradToRad(0.3)
			{ tweens:[{prop:"rotation", to: 0}], duration: 3*FRAME_RATE, onfinish: this.__decreaseAnimationsCount.bind(this) } //Utils.gradToRad(0)
		];

		Sequence.start(this.__fCaptionContainer_sprt, lScaleSeq_arr);
		Sequence.start(this.__fCaptionContainer_sprt, lRotationSeq_arr, 4*FRAME_RATE);
		this.__fAnimationsCount_num += 2;
	}

	/**
	 * @protected
	 * @virtual
	 */
	__startCaptionFiltersAnimations()
	{
		// nothing to do
	}

	/**
	 * Decreases the animations counter and tries to complete the whole animation.
	 * @protected
	 * @virtual
	 */
	__decreaseAnimationsCount()
	{
		this.__fAnimationsCount_num--;

		if (this.__fAnimationsCount_num === 0)
		{
			this.__onCaptionAnimationCompleted();
		}
	}

	/**
	 * @protected
	 * @virtual
	 */
	__onCaptionDisappearanceStarted()
	{
		// nothing to do
	}

	/**
	 * @protected
	 */
	__onCaptionBecameVisible()
	{
		this.emit(BossModeCaptionView.EVENT_ON_CAPTION_BECAME_VISIBLE);
	}

	destroy()
	{
		if (this.__fCaption_sprt)
		{
			Sequence.destroy(Sequence.findByTarget(this.__fCaption_sprt));
			this.__fCaption_sprt.destroy();
		}
		this.__fCaption_sprt = null;

		this.__fBackgroundContainer_sprt && this.__fBackgroundContainer_sprt.destroy();
		this.__fBackgroundContainer_sprt = null;

		if (this.__fCaptionContainer_sprt)
		{
			Sequence.destroy(Sequence.findByTarget(this.__fCaptionContainer_sprt));
			this.__fCaptionContainer_sprt.destroy();
		}
		this.__fCaptionContainer_sprt = null;

		super.destroy();
	}
}

export default BossModeCaptionView;