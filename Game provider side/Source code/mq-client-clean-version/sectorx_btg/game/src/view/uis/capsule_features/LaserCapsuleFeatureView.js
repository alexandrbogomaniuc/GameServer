import SimpleUIView from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/SimpleUIView';
import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import * as Easing from '../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../shared/src/CommonConstants';
import { BulgePinchFilter } from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Filters';
import { Utils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';

class LaserCapsuleFeatureView extends SimpleUIView
{
	static get EVENT_ON_LASERNET_SFX()	{ return "onLaserNetSound"; }
	
	addToContainerIfRequired(aAwardingContainerInfo_obj)
	{
		this._addToContainerIfRequired(aAwardingContainerInfo_obj);
	}

	startFieldAnimation(aCapsuleId_num)
	{
		this._startFieldAnimation(aCapsuleId_num);
	}

	startAnimation(aStartPostion_obj,aCapsuleId_num)
	{
		this._startAnimation(aStartPostion_obj,aCapsuleId_num);
	}

	interrupt()
	{
		this._interrupt();
	}

	get laserFieldAnimationInfo()
	{
		return APP.gameScreen.gameFieldController.laserFieldAnimationInfo;
	}

	constructor()
	{
		super();

		this._fFieldAnimationContainer_spr = null;
		this._fRedCover_spr_arr = {};
		this._fBlackCover_spr_arr = {};
		this._fMainAnimationContainer_spr_arr = {};
		this._fScaleContainer_spr_arr = {};
		this._fScaleContainerMask_spr_arr = {};
		this._fWiggleContainer_spr_arr = {};
		this._fBulgePinchPositionX_num = null;
		this._fTopLaserNet_spr_arr = {};
		this._fBulgePinchFilter_f = null;
	}

	__init()
	{
		super.__init();
	}

	_addToContainerIfRequired(aAwardingContainerInfo_obj)
	{
		if (this.parent)
		{
			return;
		}

		aAwardingContainerInfo_obj.container.addChild(this);
		this.zIndex = aAwardingContainerInfo_obj.zIndex;
	}

	_startFieldAnimation(aCapsuleId_num)
	{
		let lCapsuleId_num = aCapsuleId_num;
		this._fFieldAnimationContainer_spr = this.laserFieldAnimationInfo.container.addChild(new Sprite());
		this._fFieldAnimationContainer_spr.position.set(480, 270); //960 / 2, 540 / 2
		this._fFieldAnimationContainer_spr.zIndex = this.laserFieldAnimationInfo.zIndex;

		let lBlackCover_spr = this._fBlackCover_spr_arr[lCapsuleId_num] = this._fFieldAnimationContainer_spr.addChild(new PIXI.Graphics());
		this._fBlackCover_spr_arr[lCapsuleId_num].beginFill(0x000000).drawRect(-480, -270, 960, 540).endFill(); //-960 / 2, -540 / 2,
		this._fBlackCover_spr_arr[lCapsuleId_num].alpha = 0;
		let lBlackCoverAlphaSeq_arr = [
			{ tweens: [], duration: 3 * FRAME_RATE },
			{ tweens: [{ prop: "alpha", to: 0.4 }], duration: 22 * FRAME_RATE },
			{ tweens: [{ prop: "alpha", to: 0.4 }], duration: 86 * FRAME_RATE },
			{ tweens: [{ prop: "alpha", to: 0 }], duration: 22 * FRAME_RATE, onfinish: () => {
				lBlackCover_spr && Sequence.destroy(Sequence.findByTarget(lBlackCover_spr));
				this._fBlackCover_spr_arr[lCapsuleId_num] && delete this._fBlackCover_spr_arr[lCapsuleId_num];
				lBlackCover_spr = null;

				this._tryToFinishFieldAnimation(lCapsuleId_num, 1);
			}}
		];
		Sequence.start(this._fBlackCover_spr_arr[lCapsuleId_num], lBlackCoverAlphaSeq_arr);

		let lRedCover_spr = this._fRedCover_spr_arr[lCapsuleId_num] = this._fFieldAnimationContainer_spr.addChild(APP.library.getSpriteFromAtlas('common/red_screen_round_cover'));
		this._fRedCover_spr_arr[lCapsuleId_num].scale.set(2);
		this._fRedCover_spr_arr[lCapsuleId_num].alpha = 0;
		let lRedCoverAlphaSeq_arr = [
			{ tweens: [], duration: 6 * FRAME_RATE },
			{ tweens: [{ prop: "alpha", to: 0.25 }], duration: 36 * FRAME_RATE },
			{ tweens: [{ prop: "alpha", to: 0.25 }], duration: 60 * FRAME_RATE },
			{ tweens: [{ prop: "alpha", to: 0 }], duration: 36 * FRAME_RATE, onfinish: () => {
				lRedCover_spr && Sequence.destroy(Sequence.findByTarget(lRedCover_spr));
				this._fRedCover_spr_arr[lCapsuleId_num] && delete this._fRedCover_spr_arr[lCapsuleId_num];
				lRedCover_spr = null;

				this._tryToFinishFieldAnimation(lCapsuleId_num, 2);
			}}
		];
		Sequence.start(this._fRedCover_spr_arr[lCapsuleId_num], lRedCoverAlphaSeq_arr);
	}

	_startAnimation(aStartPostion_obj, aCapsuleId_num)
	{
		if (aCapsuleId_num == undefined)
		{
			console.error("Capsule id is not defined.");
			return;
		}

		this._fMainAnimationContainer_spr_arr[aCapsuleId_num] = this.addChild(new Sprite());
		this._fMainAnimationContainer_spr_arr[aCapsuleId_num].position = aStartPostion_obj;

		this._fScaleContainer_spr_arr[aCapsuleId_num] = this._fMainAnimationContainer_spr_arr[aCapsuleId_num].addChild(new Sprite());
		this._fScaleContainerMask_spr_arr[aCapsuleId_num] = this._fMainAnimationContainer_spr_arr[aCapsuleId_num].addChild(APP.library.getSprite('enemies/laser_capsule/mask'));
		this._fScaleContainerMask_spr_arr[aCapsuleId_num].scale.set(0);
		this._fScaleContainer_spr_arr[aCapsuleId_num].mask = this._fScaleContainerMask_spr_arr[aCapsuleId_num];
		this._fScaleContainer_spr_arr[aCapsuleId_num].scale.set(0.36, 0.28);
		this._scaleLaserNet(aCapsuleId_num);
		this._scaleLaserNetMask(aCapsuleId_num);

		this._fWiggleContainer_spr_arr[aCapsuleId_num] = this._fScaleContainer_spr_arr[aCapsuleId_num].addChild(new Sprite());

		let lBottomLaserNet_spr = this._fWiggleContainer_spr_arr[aCapsuleId_num].addChild(APP.library.getSprite('enemies/laser_capsule/laser_net'));
		lBottomLaserNet_spr.alpha = 0.2;
		lBottomLaserNet_spr.scale.set(2);

		this.emit(LaserCapsuleFeatureView.EVENT_ON_LASERNET_SFX);

		if (APP.profilingController.info.isVfxProfileValueMediumOrGreater)
		{
			this._wiggleLaserNetScale(aCapsuleId_num);
			this._fBulgePinchFilter_f = new BulgePinchFilter();
			this._fBulgePinchFilter_f.resolution = APP.stage.renderer.resolution;
			this._fBulgePinchPositionX_num = -0.03;
			this._fBulgePinchFilter_f.uniforms.center = [this._fBulgePinchPositionX_num, 0.57];
			this._fBulgePinchFilter_f.uniforms.radius = 560;
			this._fBulgePinchFilter_f.uniforms.strength = 0.07;
			this._fWiggleContainer_spr_arr[aCapsuleId_num].filters = this._fWiggleContainer_spr_arr[aCapsuleId_num].filters || [];
			let lAlphaFilter = new PIXI.filters.AlphaFilter();
			lAlphaFilter.resolution = APP.stage.renderer.resolution;
			this._fWiggleContainer_spr_arr[aCapsuleId_num].filters = this._fWiggleContainer_spr_arr[aCapsuleId_num].filters.concat([this._fBulgePinchFilter_f, lAlphaFilter]);

			let lFilterPos_seq = [
				{tweens: [{prop: '_fBulgePinchPositionX_num', to: 1.21, onchange: () => {
					this._fBulgePinchFilter_f.uniforms.center = [this._fBulgePinchPositionX_num, 0.57];
				}}],	duration: 135*FRAME_RATE},
			];
			Sequence.start(this, lFilterPos_seq);

			this._fTopLaserNet_spr_arr[aCapsuleId_num] = this._fWiggleContainer_spr_arr[aCapsuleId_num].addChild(APP.library.getSprite('enemies/laser_capsule/laser_net'));
			this._fTopLaserNet_spr_arr[aCapsuleId_num].alpha = 0;
			this._fTopLaserNet_spr_arr[aCapsuleId_num].blendMode = PIXI.BLEND_MODES.ADD;
			this._fTopLaserNet_spr_arr[aCapsuleId_num].scale.set(2);
			this._wiggleLaserNetAlpha(aCapsuleId_num);
		}
	}

	_wiggleLaserNetAlpha(aCapsuleId_num)
	{
		if (this._fTopLaserNet_spr_arr[aCapsuleId_num])
		{
			Sequence.destroy(Sequence.findByTarget(this._fTopLaserNet_spr_arr[aCapsuleId_num]));
			let l_seq = [
				{
					tweens: [
						{ prop: 'alpha', to: Number((Utils.random(0, 80) / 100).toFixed(2))},
					],
					duration: 0.857143 * FRAME_RATE, //60 / 70
					onfinish: () =>
					{
						this._wiggleLaserNetAlpha(aCapsuleId_num);
					}
				}
			];

			Sequence.start(this._fTopLaserNet_spr_arr[aCapsuleId_num], l_seq);
		}
	}

	_scaleLaserNetMask(aCapsuleId_num)
	{
		if (this._fScaleContainerMask_spr_arr[aCapsuleId_num])
		{
			let lScaleContainerScaleSeq_arr = [
				{ tweens: [{ prop: 'scale.x', to: 0.66 }, { prop: 'scale.y', to: 0.48 }], duration: 6 * FRAME_RATE },
				{ tweens: [{ prop: 'scale.x', to: 9.72 }, { prop: 'scale.y', to: 9.72 }], duration: 55 * FRAME_RATE, ease: Easing.quartic.easeOut }
			];
			Sequence.start(this._fScaleContainerMask_spr_arr[aCapsuleId_num], lScaleContainerScaleSeq_arr);
		}
	}

	_scaleLaserNet(aCapsuleId_num)
	{
		if (this._fScaleContainer_spr_arr[aCapsuleId_num])
		{
			let lScaleContainerScaleSeq_arr = [
				{ tweens: [{ prop: 'scale.x', to: 2.52 }, { prop: 'scale.y', to: 2 }], duration: 16 * FRAME_RATE },
				{ tweens: [{ prop: 'scale.x', to: 2.48 }, { prop: 'scale.y', to: 1.96 }], duration: 23 * FRAME_RATE },
				{ tweens: [{ prop: 'scale.x', to: 2.48 }, { prop: 'scale.y', to: 1.96 }], duration: 44 * FRAME_RATE },
				{ tweens: [{ prop: 'scale.x', to: 2.68 }, { prop: 'scale.y', to: 2.12 }], duration: 5 * FRAME_RATE, ease: Easing.back.easeIn },
				{ tweens: [{ prop: 'scale.x', to: 0 }, { prop: 'scale.y', to: 0 }], duration: 13 * FRAME_RATE, ease: Easing.back.easeIn },
			];
			Sequence.start(this._fScaleContainer_spr_arr[aCapsuleId_num], lScaleContainerScaleSeq_arr);
		}
	}

	_wiggleLaserNetScale(aCapsuleId_num)
	{
		if (this._fWiggleContainer_spr_arr[aCapsuleId_num])
		{
			Sequence.destroy(Sequence.findByTarget(this._fWiggleContainer_spr_arr[aCapsuleId_num]));
			let l_seq = [
				{
					tweens: [
						{ prop: 'scale.x', to: Utils.getRandomWiggledValue(1, 0.05)},
						{ prop: 'scale.y', to: Utils.getRandomWiggledValue(1, 0.05)}
					],
					duration: 30 * FRAME_RATE,
					onfinish: () =>
					{
						this._wiggleLaserNetScale();
					}
				}
			];

			Sequence.start(this._fWiggleContainer_spr_arr[aCapsuleId_num], l_seq);
		}
	}

	_tryToFinishFieldAnimation(aCapsuleId_num)
	{
		if (!this._fRedCover_spr_arr[aCapsuleId_num] && !this._fBlackCover_spr_arr[aCapsuleId_num])
		{
			this._interrupt(aCapsuleId_num);
		}
	}

	_interrupt(aCapsuleId_num)
	{
		if (this._fBlackCover_spr_arr[aCapsuleId_num])
		{
			Sequence.destroy(Sequence.findByTarget(this._fBlackCover_spr_arr[aCapsuleId_num]));
			this._fBlackCover_spr_arr[aCapsuleId_num].destroy();
			delete this._fBlackCover_spr_arr[aCapsuleId_num];
		}

		if (this._fRedCover_spr_arr[aCapsuleId_num])
		{
			Sequence.destroy(Sequence.findByTarget(this._fRedCover_spr_arr[aCapsuleId_num]));
			this._fRedCover_spr_arr[aCapsuleId_num].destroy();
			delete this._fRedCover_spr_arr[aCapsuleId_num];
		}

		if (this._fMainAnimationContainer_spr_arr[aCapsuleId_num])
		{
			this._fMainAnimationContainer_spr_arr[aCapsuleId_num].destroy();
			delete this._fMainAnimationContainer_spr_arr[aCapsuleId_num];
		}

		if (this._fScaleContainer_spr_arr[aCapsuleId_num])
		{
			Sequence.destroy(Sequence.findByTarget(this._fScaleContainer_spr_arr[aCapsuleId_num]));
			this._fScaleContainer_spr_arr[aCapsuleId_num].destroy();
			delete this._fScaleContainer_spr_arr[aCapsuleId_num];
		}

		if (this._fScaleContainerMask_spr_arr[aCapsuleId_num])
		{
			Sequence.destroy(Sequence.findByTarget(this._fScaleContainerMask_spr_arr[aCapsuleId_num]));
			this._fScaleContainerMask_spr_arr[aCapsuleId_num].destroy();
			delete this._fScaleContainerMask_spr_arr[aCapsuleId_num];
		}

		if (this._fWiggleContainer_spr_arr[aCapsuleId_num])
		{
			Sequence.destroy(Sequence.findByTarget(this._fWiggleContainer_spr_arr[aCapsuleId_num]));
			this._fWiggleContainer_spr_arr[aCapsuleId_num].destroy();
			delete this._fWiggleContainer_spr_arr[aCapsuleId_num];
		}

		if (this._fTopLaserNet_spr_arr[aCapsuleId_num])
		{
			Sequence.destroy(Sequence.findByTarget(this._fTopLaserNet_spr_arr[aCapsuleId_num]));
			this._fTopLaserNet_spr_arr[aCapsuleId_num].destroy();
			delete this._fTopLaserNet_spr_arr[aCapsuleId_num];
		}

		this._fBulgePinchPositionX_num = null;
		
		if (
			Object.keys(this._fBlackCover_spr_arr).length == 0 
			&& Object.keys(this._fRedCover_spr_arr).length == 0 
			&& Object.keys(this._fTopLaserNet_spr_arr).length == 0
		)
		{
			APP.gameScreen.gameFieldController.laserFieldAnimationInfo.container && APP.gameScreen.gameFieldController.laserFieldAnimationInfo.container.removeChild(this._fFieldAnimationContainer_spr);
			this._fFieldAnimationContainer_spr = null;
			Sequence.destroy(Sequence.findByTarget(this));
			this._fBulgePinchFilter_f = null;
		}
	}

	clear()
	{
		for (var key in this._fBlackCover_spr_arr)
		{
			this._fBlackCover_spr_arr[key] && Sequence.destroy(Sequence.findByTarget(this._fBlackCover_spr_arr[key]));
			this._fBlackCover_spr_arr[key] && this._fBlackCover_spr_arr[key].destroy();
			this._fBlackCover_spr_arr[key] = null;
		}
		this._fBlackCover_spr_arr = {};

		for (var key in this._fRedCover_spr_arr)
		{
			this._fRedCover_spr_arr[key] && Sequence.destroy(Sequence.findByTarget(this._fRedCover_spr_arr[key]));
			this._fRedCover_spr_arr[key] && this._fRedCover_spr_arr[key].destroy();
			this._fRedCover_spr_arr[key] = null;
		}
		this._fRedCover_spr_arr = {};

		for (var key in this._fMainAnimationContainer_spr_arr)
		{
			this._fMainAnimationContainer_spr_arr[key] && Sequence.destroy(Sequence.findByTarget(this._fMainAnimationContainer_spr_arr[key]));
			this._fMainAnimationContainer_spr_arr[key] && this._fMainAnimationContainer_spr_arr[key].destroy();
			this._fMainAnimationContainer_spr_arr[key] = null;
		}
		this._fMainAnimationContainer_spr_arr = {};

		for (var key in this._fScaleContainer_spr_arr)
		{
			this._fScaleContainer_spr_arr[key] && Sequence.destroy(Sequence.findByTarget(this._fScaleContainer_spr_arr[key]));
			this._fScaleContainer_spr_arr[key] && this._fScaleContainer_spr_arr[key].destroy();
			this._fScaleContainer_spr_arr[key] = null;
		}
		this._fScaleContainer_spr_arr = {};

		for (var key in this._fScaleContainerMask_spr_arr)
		{
			this._fScaleContainerMask_spr_arr[key] && Sequence.destroy(Sequence.findByTarget(this._fScaleContainerMask_spr_arr[key]));
			this._fScaleContainerMask_spr_arr[key] && this._fScaleContainerMask_spr_arr[key].destroy();
			this._fScaleContainerMask_spr_arr[key] = null;
		}
		this._fScaleContainerMask_spr_arr = {};

		for (var key in this._fWiggleContainer_spr_arr)
		{
			this._fWiggleContainer_spr_arr[key] && Sequence.destroy(Sequence.findByTarget(this._fWiggleContainer_spr_arr[key]));
			this._fWiggleContainer_spr_arr[key] && this._fWiggleContainer_spr_arr[key].destroy();
			this._fWiggleContainer_spr_arr[key] = null;
		}
		this._fWiggleContainer_spr_arr = {};

		for (var key in this._fTopLaserNet_spr_arr)
		{
			this._fTopLaserNet_spr_arr[key] && Sequence.destroy(Sequence.findByTarget(this._fTopLaserNet_spr_arr[key]));
			this._fTopLaserNet_spr_arr[key] && this._fTopLaserNet_spr_arr[key].destroy();
			this._fTopLaserNet_spr_arr[key] = null;
		}
		this._fTopLaserNet_spr_arr = {};


		APP.gameScreen.gameFieldController.laserFieldAnimationInfo.container && APP.gameScreen.gameFieldController.laserFieldAnimationInfo.container.removeChild(this._fFieldAnimationContainer_spr);
		this._fFieldAnimationContainer_spr = null;
		Sequence.destroy(Sequence.findByTarget(this));
		this._fBulgePinchFilter_f = null;
		this._fBulgePinchPositionX_num = null;
	}

	destroy()
	{
		this._interrupt();

		super.destroy();

		this._fFieldAnimationContainer_spr = null;
		this._fRedCover_spr_arr = null;
		this._fBlackCover_spr_arr = null;
		this._fMainAnimationContainer_spr_arr = null;
		this._fScaleContainer_spr_arr = null
		this._fScaleContainerMask_spr_arr = null;
		this._fWiggleContainer_spr_arr = null;
		this._fBulgePinchFilter_f = null;
		this._fBulgePinchPositionX_num = null;
		this._fTopLaserNet_spr_arr = null;
	}
}

export default LaserCapsuleFeatureView;