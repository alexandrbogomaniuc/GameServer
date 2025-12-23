import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import AtlasSprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import AtlasConfig from '../../../config/AtlasConfig';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { FRAME_RATE } from '../../../../../shared/src/CommonConstants';
import ProfilingInfo from '../../../../../../common/PIXI/src/dgphoenix/unified/model/profiling/ProfilingInfo';
import * as Easing from '../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import { Utils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';

const BULLETS_INFO = [
	{
		startPostion: { x: 0, y: 0 },
		finshPosition: { x: -1210, y: 1071 },
		rotation: -0.8377580409572781, //Utils.gradToRad(-48)
		duration: 24
	},
	{
		startPostion: { x: -48, y: -33 },
		finshPosition: { x: -1161, y: 526 },
		rotation: 0,
		duration: 26
	},
	{
		startPostion: { x: 41, y: -45 },
		finshPosition: { x: 1223, y: -400 },
		rotation: 2.8797932657906435, //Utils.gradToRad(165)
		duration: 21
	},
	{
		startPostion: { x: -10, y: -45 },
		finshPosition: { x: 1518, y: 367 },
		rotation: -2.722713633111154, //Utils.gradToRad(-156)
		duration: 23
	},
	{
		startPostion: { x: -7, y: -97 },
		finshPosition: { x: 188, y: -1171 },
		rotation: 1.7976891295541593, //Utils.gradToRad(103)
		duration: 24
	},
	{
		startPostion: { x: 20, y: 20 },
		finshPosition: { x: 366, y: 1485 },
		rotation: -1.6929693744344996, //Utils.gradToRad(-97)
		duration: 24
	},
	{
		startPostion: { x: -28, y: -13 },
		finshPosition: { x: -1241, y: -97 },
		rotation: 0,
		duration: 26
	},
	{
		startPostion: { x: 61, y: -25 },
		finshPosition: { x: 1039, y: 984 },
		rotation: -2.286381320112572, //Utils.gradToRad(-131)
		duration: 21
	},
	{
		startPostion: { x: 10, y: -25 },
		finshPosition: { x: 1078, y: -933 },
		rotation: 2.548180707911721, //Utils.gradToRad(146)
		duration: 23
	},
	{
		startPostion: { x: 12, y: -77 },
		finshPosition: { x: -503, y: -927 },
		rotation: 0.9424777960769379, //Utils.gradToRad(54)
		duration: 24
	},
];

class BulletsExploasionAnimation extends Sprite
{
	static get EVENT_ON_ANIMATION_END() { return "eventOnAnimationEnd"; }

	startAnimation()
	{
		this._startAnimation();
	}

	constructor()
	{
		super();

		this._fBullets_spr_arr = [];
	}

	_startAnimation()
	{
		BULLETS_INFO.forEach((aInfo_obj) =>
		{
			const lBullet_spr = this.addChild(APP.library.getSprite("enemies/bullet_capsule/small_bullet"));
			lBullet_spr.rotation = aInfo_obj.rotation;
			lBullet_spr.position = aInfo_obj.startPostion;
			this._fBullets_spr_arr.push(lBullet_spr);

			const lSequencePosition_arr = [
				{
					tweens: [{ prop: 'position.x', to: aInfo_obj.finshPosition.x }, { prop: 'position.y', to: aInfo_obj.finshPosition.y }], duration: aInfo_obj.duration * FRAME_RATE, ease: Easing.cubic.easeInOut, onfinish: () =>
					{
						const lIndex_int = this._fBullets_spr_arr.indexOf(lBullet_spr);
						if (~lIndex_int)
						{
							this._fBullets_spr_arr.splice(lIndex_int, 1);
						}
						Sequence.destroy(Sequence.findByTarget(lBullet_spr));
						lBullet_spr.destroy();

						if (this._fBullets_spr_arr.length == 0)
						{
							this.emit(BulletsExploasionAnimation.EVENT_ON_ANIMATION_END);
						}
					}
				}
			];
			Sequence.start(lBullet_spr, lSequencePosition_arr);
		});
	}

	_interapt()
	{
		this._fBullets_spr_arr && this._fBullets_spr_arr.forEach(aBullet_spr =>
		{
			Sequence.destroy(Sequence.findByTarget(aBullet_spr));
			aBullet_spr = null;
		});

		this._fBullets_spr_arr = null;
	}

	destroy()
	{
		this._interapt();

		super.destroy();

		this._fBullets_spr_arr = null;
	}
}

export default BulletsExploasionAnimation;