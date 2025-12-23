import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { AtlasSprite } from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import * as Easing from '../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import CommonEffectsManager from '../../CommonEffectsManager';
import Timer from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';

const Z_INDEXES = {
	ELECTRIC_TRENDIS: 		200 - 40,
	WHITE_CIRCLES:			200 - 88,
	BACK_DIE_SMOKE:			200 - 115,
	FRONT_DIE_SMOKE: 		200 - 111,
	FRONT_DIE_SMOKE_GREY: 	200 - 122,
	ARC: 					200 - 51,
	FIRE_FLARE: 			200 - 108
}

class RailgunFireEffect extends Sprite {

	static get EVENT_ON_ANIMATION_END() { return 'animationend'};

	constructor()
	{
		super();

		RailgunFireEffect.initTextures();

		this._fElectricTrendis_sprt = null;
		this._fFireFlare_sprt = null;

		this.once('added', (e) => {this._onAdded();});
	}

	_onAdded()
	{
		this._showEffect();
	}

	_showEffect()
	{
		this._createFireFlare();
		let seq = [
			{
				tweens: [],
				duration: 1*2*16.7,
				onfinish: () => {
					this._createElectricTrendis();
					this._createArc();
				}
			},
			{
				tweens: [],
				duration: 1*2*16.7,
				onfinish: () => {
					this._createWhiteCircles();
					if(APP.profilingController.info.isVfxDynamicProfileValueMediumOrGreater)
					{
						this._createDieSmokes();
					}
					else
					{
						let l_t = new Timer(()=>this._onAnimationEnd(), 11*2*16.7);
					}
				}
			}
		];
		Sequence.start(this, seq);
	}

	_createElectricTrendis()
	{
		let lElectricTrendis_sprt = this.addChild(new Sprite());
		lElectricTrendis_sprt.zIndex = Z_INDEXES.ELECTRIC_TRENDIS;
		lElectricTrendis_sprt.textures = RailgunFireEffect.textures.electricTrendis;
		lElectricTrendis_sprt.anchor.set(156/284, 178/275);
		lElectricTrendis_sprt.scale.set(2);
		lElectricTrendis_sprt.alpha = 0;
		lElectricTrendis_sprt.fadeTo(1, 4*2*16.7);
		lElectricTrendis_sprt.position.y = -50;

		lElectricTrendis_sprt.on('animationend', () => {
			lElectricTrendis_sprt.destroy();
		});
		lElectricTrendis_sprt.play();

		this._fElectricTrendis_sprt = lElectricTrendis_sprt;
	}

	_createWhiteCircles()
	{
		let lWhiteCirclesContainer_sprt = this.addChild(new Sprite());
		lWhiteCirclesContainer_sprt.position.y = -50;
		lWhiteCirclesContainer_sprt.zIndex = Z_INDEXES.WHITE_CIRCLES;

		for (let i=0; i<3; i++)
		{
			let lScale_num = 1.3 - (i * 0.06);
			let lPositionY_num = -30 * i;
			let lWhiteCircle_sprt = APP.library.getSpriteFromAtlas('weapons/Railgun/white_circle');
			lWhiteCircle_sprt.blendMode = PIXI.BLEND_MODES.ADD;
			lWhiteCircle_sprt.scale.set(lScale_num);
			lWhiteCircle_sprt.position.y = lPositionY_num;
			lWhiteCirclesContainer_sprt.addChild(lWhiteCircle_sprt);
			lWhiteCircle_sprt.scaleTo(lScale_num * 0.8, 14*2*16.7);
		}

		lWhiteCirclesContainer_sprt.moveTo(0, lWhiteCirclesContainer_sprt.position.y - 500, 14*2*16.7, Easing.sine.easeInOut);
		lWhiteCirclesContainer_sprt.fadeTo(0, 14*2*16.7, Easing.sine.easeInOut, () => {
			lWhiteCirclesContainer_sprt.destroy();
		});
	}

	_createArc()
	{
		let lArc_sprt = this.addChild(APP.library.getSpriteFromAtlas('weapons/Railgun/arc'));
		lArc_sprt.position.y = -50;
		lArc_sprt.zIndex = Z_INDEXES.ARC;
		lArc_sprt.anchor.set(0.5, 1);
		lArc_sprt.moveTo(0, lArc_sprt.position.y - 30, 11*2*16.7, Easing.sine.easeInOut, () => {
			lArc_sprt.destroy();
		});
	}

	_createFireFlare()
	{
		let lFireFlare_sprt = this.addChild(APP.library.getSpriteFromAtlas('weapons/Railgun/FireFlare_SCREEN'));
		lFireFlare_sprt.zIndex = Z_INDEXES.FIRE_FLARE;
		lFireFlare_sprt.position.y = -50;
		lFireFlare_sprt.anchor.set(0.5, 1);
		lFireFlare_sprt.blendMode = PIXI.BLEND_MODES.SCREEN;
		lFireFlare_sprt.alpha = 0;
		lFireFlare_sprt.scale.set(0);

		let seq = [
			{ 
				tweens: [
					{ prop: 'scale.x', to: 1 },
					{ prop: 'scale.y', to: 1 },
					{ prop: 'alpha', to: 1 }
				],
				duration: 3*2*16.7
			},
			{
				tweens: [],
				duration: 3*2*16.7
			},
			{
				tweens: [
					{ prop: 'scale.x', to: 0 },
					{ prop: 'scale.y', to: 0 }
				],
				duration: 8*2*16.7,
				onfinish: () => {
					lFireFlare_sprt.destroy();
				}
			}
		];
		
		Sequence.start(lFireFlare_sprt, seq);
		this._fFireFlare_sprt = lFireFlare_sprt;
	}

	_createDieSmokes()
	{
		let backSmoke = this.addChild(new Sprite);
		backSmoke.zIndex = Z_INDEXES.BACK_DIE_SMOKE
		backSmoke.textures = CommonEffectsManager.getDieSmokeUnmultTextures();
		backSmoke.anchor.set(0.57, 0.81);
		backSmoke.scale.set(2 * 0.4, -2 * 0.4);
		backSmoke.position.y = 35;
		backSmoke.on('animationend', () => {
			backSmoke.destroy();
		});
		backSmoke.play();

		let frontSmoke = this.addChild(new Sprite);
		frontSmoke.zIndex = Z_INDEXES.FRONT_DIE_SMOKE;
		frontSmoke.textures = CommonEffectsManager.getDieSmokeUnmultTextures();
		frontSmoke.anchor.set(0.57, 0.81);
		frontSmoke.position.y = -20;
		frontSmoke.scale.set(2*0.21, 2*1.01);
		frontSmoke.on('animationend', () => {
			frontSmoke.destroy();
		});
		frontSmoke.play();

		let frontSmokeGrey = this.addChild(new Sprite);
		frontSmokeGrey.zIndex = Z_INDEXES.FRONT_DIE_SMOKE_GREY;
		frontSmokeGrey.textures = CommonEffectsManager.getDieSmokeUnmultTextures();
		frontSmokeGrey.tint = 0x000000;
		frontSmokeGrey.anchor.set(0.57, 0.81);
		frontSmokeGrey.position.y = -20;
		frontSmokeGrey.scale.set(2*0.82);
		frontSmokeGrey.alpha = 0.2;
		frontSmokeGrey.on('animationend', () => {
			frontSmokeGrey.destroy();
			this._onAnimationEnd();	
		});
		frontSmokeGrey.play();
	}

	_onAnimationEnd()
	{
		this.emit(RailgunFireEffect.EVENT_ON_ANIMATION_END);
		this.destroy();
	}

	destroy()
	{
		this._fElectricTrendis_sprt = null;

		Sequence.destroy(Sequence.findByTarget(this));
		Sequence.destroy(Sequence.findByTarget(this._fFireFlare_sprt));

		this._fFireFlare_sprt = null;

		super.destroy();
	}

}

const ElectricTrendisConfig = {
  "frames": {
	"electric_trendis_04.png": {
	  "frame": {
		"x": 0,
		"y": 0,
		"w": 202,
		"h": 206
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 47,
		"y": 37,
		"w": 202,
		"h": 206
	  },
	  "sourceSize": {
		"w": 284,
		"h": 275
	  }
	},
	"electric_trendis_03.png": {
	  "frame": {
		"x": 0,
		"y": 206,
		"w": 205,
		"h": 200
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 42,
		"y": 40,
		"w": 205,
		"h": 200
	  },
	  "sourceSize": {
		"w": 284,
		"h": 275
	  }
	},
	"electric_trendis_05.png": {
	  "frame": {
		"x": 202,
		"y": 0,
		"w": 192,
		"h": 200
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 61,
		"y": 43,
		"w": 192,
		"h": 200
	  },
	  "sourceSize": {
		"w": 284,
		"h": 275
	  }
	},
	"electric_trendis_12.png": {
	  "frame": {
		"x": 0,
		"y": 406,
		"w": 94,
		"h": 95
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 123,
		"y": 87,
		"w": 94,
		"h": 95
	  },
	  "sourceSize": {
		"w": 284,
		"h": 275
	  }
	},
	"electric_trendis_02.png": {
	  "frame": {
		"x": 205,
		"y": 200,
		"w": 210,
		"h": 195
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 36,
		"y": 43,
		"w": 210,
		"h": 195
	  },
	  "sourceSize": {
		"w": 284,
		"h": 275
	  }
	},
	"electric_trendis_06.png": {
	  "frame": {
		"x": 394,
		"y": 0,
		"w": 188,
		"h": 195
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 65,
		"y": 43,
		"w": 188,
		"h": 195
	  },
	  "sourceSize": {
		"w": 284,
		"h": 275
	  }
	},
	"electric_trendis_11.png": {
	  "frame": {
		"x": 205,
		"y": 395,
		"w": 110,
		"h": 110
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 115,
		"y": 88,
		"w": 110,
		"h": 110
	  },
	  "sourceSize": {
		"w": 284,
		"h": 275
	  }
	},
	"electric_trendis_07.png": {
	  "frame": {
		"x": 415,
		"y": 195,
		"w": 191,
		"h": 188
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 63,
		"y": 44,
		"w": 191,
		"h": 188
	  },
	  "sourceSize": {
		"w": 284,
		"h": 275
	  }
	},
	"electric_trendis_00.png": {
	  "frame": {
		"x": 415,
		"y": 383,
		"w": 121,
		"h": 123
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 78,
		"y": 78,
		"w": 121,
		"h": 123
	  },
	  "sourceSize": {
		"w": 284,
		"h": 275
	  }
	},
	"electric_trendis_08.png": {
	  "frame": {
		"x": 582,
		"y": 0,
		"w": 183,
		"h": 182
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 68,
		"y": 44,
		"w": 183,
		"h": 182
	  },
	  "sourceSize": {
		"w": 284,
		"h": 275
	  }
	},
	"electric_trendis_13.png": {
	  "frame": {
		"x": 94,
		"y": 406,
		"w": 74,
		"h": 76
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 128,
		"y": 96,
		"w": 74,
		"h": 76
	  },
	  "sourceSize": {
		"w": 284,
		"h": 275
	  }
	},
	"electric_trendis_01.png": {
	  "frame": {
		"x": 606,
		"y": 182,
		"w": 178,
		"h": 173
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 54,
		"y": 56,
		"w": 178,
		"h": 173
	  },
	  "sourceSize": {
		"w": 284,
		"h": 275
	  }
	},
	"electric_trendis_10.png": {
	  "frame": {
		"x": 606,
		"y": 355,
		"w": 136,
		"h": 145
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 94,
		"y": 65,
		"w": 136,
		"h": 145
	  },
	  "sourceSize": {
		"w": 284,
		"h": 275
	  }
	},
	"electric_trendis_09.png": {
	  "frame": {
		"x": 765,
		"y": 0,
		"w": 163,
		"h": 164
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 82,
		"y": 54,
		"w": 163,
		"h": 164
	  },
	  "sourceSize": {
		"w": 284,
		"h": 275
	  }
	}
  },
  "meta": {
	"app": "http://free-tex-packer.com/",
	"version": "0.3.3",
	"image": "electric_trendis.png",
	"format": "RGBA8888",
	"size": {
	  "w": 1024,
	  "h": 512
	},
	"scale": 2
  }
}

RailgunFireEffect.textures = {
	electricTrendis: null
};


RailgunFireEffect.setTexture = function(name, imageNames, configs, path) {
	if(!RailgunFireEffect.textures[name]){
		RailgunFireEffect.textures[name] = [];

		if(!Array.isArray(imageNames)) imageNames = [imageNames];
		if(!Array.isArray(configs)) configs = [configs];

		let assets = [];
		imageNames.forEach(function(item){assets.push(APP.library.getAsset(item))});

		RailgunFireEffect.textures[name] = AtlasSprite.getFrames(assets, configs, path);
		RailgunFireEffect.textures[name].sort(function(a, b){if(a._atlasName > b._atlasName) return 1; else return -1});
	}
};

RailgunFireEffect.initTextures = function() {

	let imageNames  = ['weapons/Railgun/electric_trendis'],
		configs   = [ElectricTrendisConfig];
	RailgunFireEffect.setTexture('electricTrendis', imageNames, configs, '');
}


export default RailgunFireEffect;