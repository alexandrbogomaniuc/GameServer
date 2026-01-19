import WeaponBeam from "../WeaponBeam";
import { Utils } from '../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import ShotResultsUtil from '../../ShotResultsUtil';
import Enemy from '../../enemies/Enemy';
import AtlasSprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import RailgunFireEffect from './RailgunFireEffect';

class RailgunBeam extends WeaponBeam {

	static get EVENT_ON_TARGET_ACHIEVED() 			{ return WeaponBeam.EVENT_ON_TARGET_ACHIEVED; }
	static get EVENT_ON_ANIMATION_COMPLETED() 		{ return WeaponBeam.EVENT_ON_ANIMATION_COMPLETED; }
	static get EVENT_ON_BASIC_ANIMATION_COMPLETED()	{ return 'EVENT_ON_BASIC_ANIMATION_COMPLETED'; }
	static get EVENT_ON_ROTATION_UPDATED() 			{ return 'EVENT_ON_ROTATION_UPDATED'; }

	constructor(aShotData_obj, callback)
	{
		super(aShotData_obj);

		this._fTargetAchievingCallback_func = callback;
		this._fScaleableBase_sprt = null;
		this._fStreak_sprt = null;
		this._fElectricArc_sprt = null;
		this._fElectricArcMask_sprt = null;
		this._fHitBoomGlued_sprt = null;
		this._fFireEffect_rfe = null;
		this._fTargetEnemy_enm = null;

		this._fScaleableBase_sprt = this.addChild(new Sprite);
		this._fScaleableBase_sprt.pivot.set(0, 0);
		this._fTargetRandomOffset = new PIXI.Point(0, 0);

		RailgunBeam.initTextures();
	}

	get _baseBeamLength()
	{
		return 310;
	}

	get _minimumBeamLength()
	{
		return 10;
	}

	get targetEnemy()
	{
		return this._fTargetEnemy_enm;
	}

	//override
	__shoot(aStartPoint_pt, aEndPoint_pt)
	{
		super.__shoot(aStartPoint_pt, aEndPoint_pt);

		let lFirstNonFakeEnemyId_int = this.shotData.requestEnemyId || ShotResultsUtil.getFirstNonFakeEnemy(this.shotData);
		this._fTargetEnemy_enm = APP.currentWindow.gameField.getExistEnemy(lFirstNonFakeEnemyId_int);
		if (this._fTargetEnemy_enm)
		{
			let hitRect = this._fTargetEnemy_enm.getHitRectangle();
			let currentFootPoint = this._fTargetEnemy_enm.getCurrentFootPointPosition();
			let dx = currentFootPoint.x + hitRect.width - Utils.random(0, hitRect.width * 2, true);
			let dy = hitRect.height - Utils.random(0, hitRect.height * 2, true);
			this._fTargetRandomOffset = {x: dx, y: dy};
			this._startFollowingEnemy();
		}

		let lStreak_sprt = APP.library.getSpriteFromAtlas('weapons/Railgun/Streak_ADD');
		lStreak_sprt.anchor.set(665/721, 41/90);
		lStreak_sprt.blendMode = PIXI.BLEND_MODES.ADD;
		this._fScaleableBase_sprt.addChild(lStreak_sprt);
		lStreak_sprt.scale.x = 0;
		lStreak_sprt.scale.y = 0.5;

		let seq = [
			{
				tweens: [],
				duration: 1*2*16.7
			},
			{
				tweens: [
					{ prop: 'scale.x', to: -1 }
				],
				duration: 2*2*16.7
			},
			{
				tweens: [
				],
				duration: 1*2*16.7,
				onfinish: () => {
					lStreak_sprt.anchor.x = 44/721;
					lStreak_sprt.position.x = (665 - 44)/2;
					this._onTargetAchieved();
				}
			},
			{
				tweens: [
					{ prop: 'scale.x', to: 0}
				],
				duration: 2*2*16.7,
				onfinish: ()=> {
					lStreak_sprt.destroy();
				}
			}
		];

		Sequence.start(lStreak_sprt, seq);
		this._fStreak_sprt = lStreak_sprt;

		this._createElectricArc();

		this._createHitBoom();

		this._createGunFireEffect();
		
	}

	_createGunFireEffect()
	{
		let lFireEffect_rfe = new RailgunFireEffect();
		lFireEffect_rfe.rotation = Math.PI/2;
		lFireEffect_rfe.on(RailgunFireEffect.EVENT_ON_ANIMATION_END, () => {
			lFireEffect_rfe.destroy();
		});

		this._fFireEffect_rfe = lFireEffect_rfe;
		this.addChildAt(lFireEffect_rfe, 0);
	}

	_createElectricArc()
	{
		let lCurrentScaleX_num = Math.max(this._fScaleableBase_sprt.scale.x, 0.5);

		let lElectricArc_sprt = APP.library.getSpriteFromAtlas('weapons/Railgun/ElectricArc_LIGHTEN');
		lElectricArc_sprt.anchor.set(33/751, 79/151);
		lElectricArc_sprt.scale.set(0.36 * 2 * lCurrentScaleX_num , 0.4 * 2 * lCurrentScaleX_num);
		lElectricArc_sprt.position.set(33 * lCurrentScaleX_num, 0);
		let lElectricArcBounds_obj = lElectricArc_sprt.getBounds();
		this._fElectricArc_sprt = this.addChild(lElectricArc_sprt);

		let lMask_sprt = APP.library.getSpriteFromAtlas('weapons/Railgun/round_mask');
		let lMaskLocalBounds_obj = lMask_sprt.getLocalBounds();
		lMask_sprt.anchor.set(0, 0.5);
		lMask_sprt.position.set(40, 0);
		lMask_sprt.scale.set(0, 1 * lCurrentScaleX_num);

		let lFinalScaleX_num = lCurrentScaleX_num* (lElectricArcBounds_obj.width)/lMaskLocalBounds_obj.width;

		let lMaskSequence_seq = [
			{
				tweens: [
					{ prop: 'scale.x', to: lFinalScaleX_num }
				],
				duration: 8*2*16.7,
				onfinish: () => {
					lMask_sprt.anchor.x = 1;
					lMask_sprt.position.x = lMask_sprt.position.x + lMaskLocalBounds_obj.width * lFinalScaleX_num;
				}
			},
			{
				tweens: [
					{ prop: 'scale.x', to: 0 }
				],
				duration: 8*2*16.7,
				onfinish: () => {
					//this._onAnimationCompleted();

				}
			}
		];

		lElectricArc_sprt.mask = lMask_sprt;
		this._fElectricArcMask_sprt = this.addChild(lMask_sprt);
		Sequence.start(lMask_sprt, lMaskSequence_seq);
	}

	_createHitBoom()
	{
		let lCurrentScaleX_num = Math.max(this._fScaleableBase_sprt.scale.x * 0.8, 0.5);

		let lHitBoomGlued_sprt = new Sprite();
		lHitBoomGlued_sprt.textures = RailgunBeam.textures.hitBoomGlued;
		lHitBoomGlued_sprt.scale.set(2 * lCurrentScaleX_num);
		lHitBoomGlued_sprt.rotation = Math.PI/2;
		lHitBoomGlued_sprt.anchor.set(73/103, 452/491);

		let seq = [
			{
				tweens: [],
				duration: 7*2*16.7,
				onfinish: () => {
					//this.addChild(lHitBoomGlued_sprt);
					lHitBoomGlued_sprt.on('animationend', () => {
						lHitBoomGlued_sprt.destroy();
						this._onAnimationCompleted();
					})
					lHitBoomGlued_sprt.play();
				}
			},
			{
				tweens: [
					{ prop: 'x', to: 30, duration: 15*2*16.7 },
					{ prop: 'scale.y', to: 2*lHitBoomGlued_sprt.scale.y, duration: 26*2*16.7 }
				],
				duration: 6*2*16.7
			},
			{
				tweens: [
					{ prop: 'alpha', to: 0}
				],
				duration: 20*2*16.7,
				onfinish: () => {
					this._onAnimationCompleted();
				}
			}
		]

		Sequence.start(lHitBoomGlued_sprt, seq);
		this._fHitBoomGlued_sprt = lHitBoomGlued_sprt;
	}

	_startFollowingEnemy()
	{
		this._fTargetEnemy_enm.on(Enemy.EVENT_ON_ENEMY_DESTROY, this._stopFollowingEnemy, this);
		APP.on('tick', this._onTick, this);
	}

	_stopFollowingEnemy()
	{
		this._fTargetEnemy_enm && this._fTargetEnemy_enm.off(Enemy.EVENT_ON_ENEMY_DESTROY, this._stopFollowingEnemy, this);
		APP.off('tick', this._onTick, this);
	}

	_onTick(e)
	{
		if (!this._fTargetEnemy_enm || !this._fTargetEnemy_enm.parent)
		{
			this._stopFollowingEnemy();
			return;
		}
		let lEndPoint_pt = this._fTargetEnemy_enm.getCenterPosition();
		lEndPoint_pt.x += this._fTargetRandomOffset.x;
		lEndPoint_pt.y += this._fTargetRandomOffset.y;
		this.endPoint = lEndPoint_pt;
	}

	_onTargetAchieved()
	{
		this._stopFollowingEnemy();
		let angle = Math.PI - this.rotation;
		this._fTargetAchievingCallback_func && this._fTargetAchievingCallback_func.call(null, this.endPoint, angle);
		this.emit(RailgunBeam.EVENT_ON_TARGET_ACHIEVED);

		this._onBasicAnimationCompleted();
	}

	_onBasicAnimationCompleted()
	{
		this.emit(RailgunBeam.EVENT_ON_BASIC_ANIMATION_COMPLETED);
	}

	_onAnimationCompleted()
	{
		this.emit(RailgunBeam.EVENT_ON_ANIMATION_COMPLETED);
		this.destroy();
	}

	//override
	_updateScale()
	{
		let lScaleX_num = this._beamLength / this._baseBeamLength;
		this._fScaleableBase_sprt.scale.x = lScaleX_num;
	}

	//override
	_updateRotation()
	{
		super._updateRotation();
		this.emit(RailgunBeam.EVENT_ON_ROTATION_UPDATED, {endPoint: this.endPoint, seatId: this.shotData.seatId});
	}

	destroy()
	{
		this._fTargetAchievingCallback_func = null;

		Sequence.destroy(Sequence.findByTarget(this._fStreak_sprt));
		this._fStreak_sprt && this._fStreak_sprt.destroy();
		this._fStreak_sprt = null;

		Sequence.destroy(Sequence.findByTarget(this._fElectricArcMask_sprt));
		this._fElectricArcMask_sprt && this._fElectricArcMask_sprt.destroy();
		this._fElectricArcMask_sprt = null;

		Sequence.destroy(Sequence.findByTarget(this._fHitBoomGlued_sprt));
		this._fHitBoomGlued_sprt && this._fHitBoomGlued_sprt.destroy();
		this._fHitBoomGlued_sprt = null;

		Sequence.destroy(Sequence.findByTarget(this._fFireEffect_rfe));
		this._fFireEffect_rfe && this._fFireEffect_rfe.destroy();
		this._fFireEffect_rfe = null;

		if (this._fTargetEnemy_enm)
		{
			this._fTargetEnemy_enm.off(Enemy.EVENT_ON_ENEMY_DESTROY, this._stopFollowingEnemy, this);
		}
		this._fTargetEnemy_enm = null;

		APP.off('tick', this._onTick, this);

		this.removeAllListeners();

		super.destroy();
	}

}

const HitBoomGluedConfig = {
  "frames": {
	"hitboom_glued_00.png": {
	  "frame": {
		"x": 0,
		"y": 0,
		"w": 29,
		"h": 150
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 15,
		"y": 80,
		"w": 29,
		"h": 150
	  },
	  "sourceSize": {
		"w": 52,
		"h": 246
	  }
	},
	"hitboom_glued_01.png": {
	  "frame": {
		"x": 0,
		"y": 150,
		"w": 32,
		"h": 161
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 14,
		"y": 70,
		"w": 32,
		"h": 161
	  },
	  "sourceSize": {
		"w": 52,
		"h": 246
	  }
	},
	"hitboom_glued_02.png": {
	  "frame": {
		"x": 0,
		"y": 311,
		"w": 33,
		"h": 168
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 13,
		"y": 64,
		"w": 33,
		"h": 168
	  },
	  "sourceSize": {
		"w": 52,
		"h": 246
	  }
	},
	"hitboom_glued_03.png": {
	  "frame": {
		"x": 0,
		"y": 479,
		"w": 33,
		"h": 173
	  },
	  "rotated": true,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 12,
		"y": 59,
		"w": 33,
		"h": 173
	  },
	  "sourceSize": {
		"w": 52,
		"h": 246
	  }
	},
	"hitboom_glued_04.png": {
	  "frame": {
		"x": 29,
		"y": 0,
		"w": 34,
		"h": 183
	  },
	  "rotated": true,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 12,
		"y": 50,
		"w": 34,
		"h": 183
	  },
	  "sourceSize": {
		"w": 52,
		"h": 246
	  }
	},
	"hitboom_glued_05.png": {
	  "frame": {
		"x": 29,
		"y": 34,
		"w": 36,
		"h": 188
	  },
	  "rotated": true,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 11,
		"y": 46,
		"w": 36,
		"h": 188
	  },
	  "sourceSize": {
		"w": 52,
		"h": 246
	  }
	},
	"hitboom_glued_06.png": {
	  "frame": {
		"x": 29,
		"y": 70,
		"w": 36,
		"h": 194
	  },
	  "rotated": true,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 10,
		"y": 42,
		"w": 36,
		"h": 194
	  },
	  "sourceSize": {
		"w": 52,
		"h": 246
	  }
	},
	"hitboom_glued_07.png": {
	  "frame": {
		"x": 32,
		"y": 106,
		"w": 37,
		"h": 202
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 9,
		"y": 36,
		"w": 37,
		"h": 202
	  },
	  "sourceSize": {
		"w": 52,
		"h": 246
	  }
	},
	"hitboom_glued_08.png": {
	  "frame": {
		"x": 217,
		"y": 0,
		"w": 37,
		"h": 209
	  },
	  "rotated": true,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 9,
		"y": 31,
		"w": 37,
		"h": 209
	  },
	  "sourceSize": {
		"w": 52,
		"h": 246
	  }
	},
	"hitboom_glued_09.png": {
	  "frame": {
		"x": 426,
		"y": 0,
		"w": 39,
		"h": 214
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 8,
		"y": 28,
		"w": 39,
		"h": 214
	  },
	  "sourceSize": {
		"w": 52,
		"h": 246
	  }
	},
	"hitboom_glued_10.png": {
	  "frame": {
		"x": 465,
		"y": 0,
		"w": 41,
		"h": 219
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 6,
		"y": 25,
		"w": 41,
		"h": 219
	  },
	  "sourceSize": {
		"w": 52,
		"h": 246
	  }
	},
	"hitboom_glued_11.png": {
	  "frame": {
		"x": 173,
		"y": 106,
		"w": 41,
		"h": 221
	  },
	  "rotated": true,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 6,
		"y": 25,
		"w": 41,
		"h": 221
	  },
	  "sourceSize": {
		"w": 52,
		"h": 246
	  }
	},
	"hitboom_glued_12.png": {
	  "frame": {
		"x": 173,
		"y": 147,
		"w": 44,
		"h": 224
	  },
	  "rotated": true,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 5,
		"y": 22,
		"w": 44,
		"h": 224
	  },
	  "sourceSize": {
		"w": 52,
		"h": 246
	  }
	},
	"hitboom_glued_13.png": {
	  "frame": {
		"x": 173,
		"y": 191,
		"w": 44,
		"h": 230
	  },
	  "rotated": true,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 4,
		"y": 16,
		"w": 44,
		"h": 230
	  },
	  "sourceSize": {
		"w": 52,
		"h": 246
	  }
	},
	"hitboom_glued_14.png": {
	  "frame": {
		"x": 403,
		"y": 214,
		"w": 45,
		"h": 224
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 4,
		"y": 18,
		"w": 45,
		"h": 224
	  },
	  "sourceSize": {
		"w": 52,
		"h": 246
	  }
	},
	"hitboom_glued_15.png": {
	  "frame": {
		"x": 173,
		"y": 235,
		"w": 46,
		"h": 214
	  },
	  "rotated": true,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 4,
		"y": 20,
		"w": 46,
		"h": 214
	  },
	  "sourceSize": {
		"w": 52,
		"h": 246
	  }
	},
	"hitboom_glued_16.png": {
	  "frame": {
		"x": 173,
		"y": 281,
		"w": 45,
		"h": 212
	  },
	  "rotated": true,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 4,
		"y": 23,
		"w": 45,
		"h": 212
	  },
	  "sourceSize": {
		"w": 52,
		"h": 246
	  }
	},
	"hitboom_glued_17.png": {
	  "frame": {
		"x": 173,
		"y": 326,
		"w": 44,
		"h": 215
	  },
	  "rotated": true,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 5,
		"y": 22,
		"w": 44,
		"h": 215
	  },
	  "sourceSize": {
		"w": 52,
		"h": 246
	  }
	},
	"hitboom_glued_18.png": {
	  "frame": {
		"x": 173,
		"y": 370,
		"w": 45,
		"h": 224
	  },
	  "rotated": true,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 4,
		"y": 15,
		"w": 45,
		"h": 224
	  },
	  "sourceSize": {
		"w": 52,
		"h": 246
	  }
	},
	"hitboom_glued_19.png": {
	  "frame": {
		"x": 173,
		"y": 415,
		"w": 44,
		"h": 218
	  },
	  "rotated": true,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 4,
		"y": 20,
		"w": 44,
		"h": 218
	  },
	  "sourceSize": {
		"w": 52,
		"h": 246
	  }
	},
	"hitboom_glued_20.png": {
	  "frame": {
		"x": 173,
		"y": 459,
		"w": 44,
		"h": 220
	  },
	  "rotated": true,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 5,
		"y": 17,
		"w": 44,
		"h": 220
	  },
	  "sourceSize": {
		"w": 52,
		"h": 246
	  }
	},
	"hitboom_glued_21.png": {
	  "frame": {
		"x": 448,
		"y": 219,
		"w": 44,
		"h": 226
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 5,
		"y": 15,
		"w": 44,
		"h": 226
	  },
	  "sourceSize": {
		"w": 52,
		"h": 246
	  }
	},
	"hitboom_glued_22.png": {
	  "frame": {
		"x": 223,
		"y": 37,
		"w": 45,
		"h": 203
	  },
	  "rotated": true,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 5,
		"y": 22,
		"w": 45,
		"h": 203
	  },
	  "sourceSize": {
		"w": 52,
		"h": 246
	  }
	},
	"hitboom_glued_23.png": {
	  "frame": {
		"x": 69,
		"y": 106,
		"w": 43,
		"h": 200
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 5,
		"y": 18,
		"w": 43,
		"h": 200
	  },
	  "sourceSize": {
		"w": 52,
		"h": 246
	  }
	},
	"hitboom_glued_24.png": {
	  "frame": {
		"x": 112,
		"y": 106,
		"w": 40,
		"h": 180
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 8,
		"y": 21,
		"w": 40,
		"h": 180
	  },
	  "sourceSize": {
		"w": 52,
		"h": 246
	  }
	},
	"hitboom_glued_25.png": {
	  "frame": {
		"x": 33,
		"y": 308,
		"w": 41,
		"h": 160
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 7,
		"y": 24,
		"w": 41,
		"h": 160
	  },
	  "sourceSize": {
		"w": 52,
		"h": 246
	  }
	},
	"hitboom_glued_26.png": {
	  "frame": {
		"x": 74,
		"y": 306,
		"w": 35,
		"h": 153
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 13,
		"y": 25,
		"w": 35,
		"h": 153
	  },
	  "sourceSize": {
		"w": 52,
		"h": 246
	  }
	},
	"hitboom_glued_27.png": {
	  "frame": {
		"x": 109,
		"y": 306,
		"w": 31,
		"h": 152
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 16,
		"y": 26,
		"w": 31,
		"h": 152
	  },
	  "sourceSize": {
		"w": 52,
		"h": 246
	  }
	},
	"hitboom_glued_28.png": {
	  "frame": {
		"x": 140,
		"y": 306,
		"w": 32,
		"h": 96
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 15,
		"y": 37,
		"w": 32,
		"h": 96
	  },
	  "sourceSize": {
		"w": 52,
		"h": 246
	  }
	},
	"hitboom_glued_29.png": {
	  "frame": {
		"x": 397,
		"y": 82,
		"w": 28,
		"h": 91
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 19,
		"y": 39,
		"w": 28,
		"h": 91
	  },
	  "sourceSize": {
		"w": 52,
		"h": 246
	  }
	},
	"hitboom_glued_30.png": {
	  "frame": {
		"x": 140,
		"y": 402,
		"w": 12,
		"h": 77
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 31,
		"y": 49,
		"w": 12,
		"h": 77
	  },
	  "sourceSize": {
		"w": 52,
		"h": 246
	  }
	},
	"hitboom_glued_31.png": {
	  "frame": {
		"x": 32,
		"y": 308,
		"w": 1,
		"h": 1
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 32,
		"y": 124,
		"w": 1,
		"h": 1
	  },
	  "sourceSize": {
		"w": 52,
		"h": 246
	  }
	}
  },
  "meta": {
	"app": "http://free-tex-packer.com/",
	"version": "0.3.3",
	"image": "hitboom_glued.png",
	"format": "RGBA8888",
	"size": {
	  "w": 512,
	  "h": 512
	},
	"scale": 2
  }
}

RailgunBeam.textures = {
	hitBoomGlued: null	
};


RailgunBeam.setTexture = function(name, imageNames, configs, path) {
	if(!RailgunBeam.textures[name]){
		RailgunBeam.textures[name] = [];

		if(!Array.isArray(imageNames)) imageNames = [imageNames];
		if(!Array.isArray(configs)) configs = [configs];

		let assets = [];
		imageNames.forEach(function(item){assets.push(APP.library.getAsset(item))});

		RailgunBeam.textures[name] = AtlasSprite.getFrames(assets, configs, path);
		RailgunBeam.textures[name].sort(function(a, b){if(a._atlasName > b._atlasName) return 1; else return -1});
	}
};

RailgunBeam.initTextures = function() {

	let imageNames  = ['weapons/Railgun/hitboom_glued'],
		configs   = [HitBoomGluedConfig];
	RailgunBeam.setTexture('hitBoomGlued', imageNames, configs, '');
}

export default RailgunBeam;

