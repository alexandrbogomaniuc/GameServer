import Gun from '../Gun';
import Sprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import GameSoundsController from '../../../controller/sounds/GameSoundsController';
import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import AtlasSprite from '../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/AtlasSprite';
import * as Easing from '../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
import EternalCryogunSmoke from '../cryogun/EternalCryogunSmoke';
import Sequence from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation/Sequence';
import Timer from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';
import SimpleSoundController from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/sounds/SimpleSoundController';

const SMOKES_PARAMS = [
						{ x: 10, y: 52 }, { x: 36, y: 52 },
						{ x: 10, y: 72 }, { x: 36, y: 72 },
						{ x: 10, y: 92 }, { x: 36, y: 92 }
					];

class Railgun extends Gun {

	constructor(aIsMaster_bl)
	{
		super();

		Railgun.initTextures();

		this._fIsMaster_bl = aIsMaster_bl;
		this._fReloadTimer_tmr = null;
		this._fFadeOutTimer_tmr = null;
		this._fReloadCover_sprt = null;
		this._fEternalSmokes_eps_arr = null;
		this._createView();

		this.idle();
	}

	//override
	reset()
	{
		super.reset();
		
		if (this.isIdleState)
		{
			return;
		}

		this._destroySmokes();
		this._clearReloadEffect();
		
		this.idle();
	}

	_createView()
	{
		let lRailgun_sprt = this.addChild(APP.library.getSpriteFromAtlas('weapons/Railgun/railgun'));
	}

	//override
	_initIdleState()
	{
		if (this._fReloadCover_sprt)
		{
			this._fadeOutReloadEffect();
		}
	}

	//override
	_initReloadState()
	{
		if (this._fReloadCover_sprt !== null)
		{
			this._clearReloadEffect();
		}

		this._fReloadTimer_tmr = new Timer(this._onReloadCompleted.bind(this), 2*2*16.7);
		this._fFadeOutTimer_tmr = new Timer(this._fadeOutReloadEffect.bind(this), 7*2*16.7);

		if (APP.profilingController.info.isVfxDynamicProfileValueMediumOrGreater)
		{
			this._fReloadCover_sprt = this.addChild(new Sprite);

			let lGlow_sprt = this._fReloadCover_sprt.addChild(APP.library.getSprite('weapons/Railgun/railgun_glow'));
			lGlow_sprt.position.set(0, -10);
			lGlow_sprt.blendMode = PIXI.BLEND_MODES.ADD;
			let lGlowBounds_obj = lGlow_sprt.getLocalBounds();


			let lMask_gr = new PIXI.Graphics();
			lMask_gr.beginFill(0xff0000);
			lMask_gr.drawRect(0, 0, lGlowBounds_obj.width, lGlowBounds_obj.height);
			lMask_gr.endFill();

			let lMask_sprt = this._fReloadCover_sprt.addChild(new Sprite);
			lMask_sprt.addChild(lMask_gr);
			lMask_sprt.position.set(lGlow_sprt.position.x, lGlow_sprt.position.y + lGlowBounds_obj.height/2);
			lMask_sprt.pivot.set(lGlowBounds_obj.width/2, lGlowBounds_obj.height);

			lMask_sprt.scale.y = 0;
			lMask_sprt.scaleYTo(1, 2*6*2*16.7, Easing.sine.easeInOut);

			lGlow_sprt.mask = lMask_gr;

			let lElectricArcs_sprt = this._fReloadCover_sprt.addChild(new Sprite());
			lElectricArcs_sprt.textures = Railgun.textures.electricArcs;
			lElectricArcs_sprt.blendMode = PIXI.BLEND_MODES.ADD;
			lElectricArcs_sprt.counter = 0;
			lElectricArcs_sprt.on('animationend', (e) => {
				if (++lElectricArcs_sprt.counter === 1)
				{
					lElectricArcs_sprt.destroy();
				}
			});
			lElectricArcs_sprt.play();

			this._fEternalSmokes_eps_arr = [];

			let n = SMOKES_PARAMS.length;
			for (let i= (n-1); i>=0; i--)
			{
				this._createAnotherSmoke(i);
			}
		}
	}

	_createAnotherSmoke(aIndex_int)
	{
		let lSmokeParam_obj = SMOKES_PARAMS[aIndex_int];
		let smoke = new EternalCryogunSmoke(true, 'add');
		smoke.position.set((lSmokeParam_obj.x - 23)/2, (lSmokeParam_obj.y - 110)/2);
		smoke.scale.set(0.227);

		this._fEternalSmokes_eps_arr.push(this._fReloadCover_sprt.addChild(smoke));
		smoke.alpha = 0;
		let seq = [
			{
				tweens: [],
				duration: aIndex_int * 200
			},
			{
				tweens: [
					{ prop: 'alpha', to: '1'}
				],
				duration: 200
			}
		];
		Sequence.start(smoke, seq);
	}

	_clearReloadEffect()
	{
		this._fReloadTimer_tmr && this._fReloadTimer_tmr.destructor();
		this._fReloadTimer_tmr = null;
		this._fFadeOutTimer_tmr && this._fFadeOutTimer_tmr.destructor();
		this._fFadeOutTimer_tmr = null;
		this._fReloadCover_sprt && this._fReloadCover_sprt.destroy();
		this._fReloadCover_sprt = null;
	}

	_fadeOutReloadEffect()
	{
		if (this._fReloadCover_sprt)
		{
			this._fReloadCover_sprt.fadeTo(0, 7*2*16.7, null, () => {
				this._clearReloadEffect();
			});
		}
	}

	_onReloadCompleted()
	{
		this.emit(Gun.EVENT_ON_RELOADED);
		this.shot();
	}

	//override
	_initShotState()
	{
		if (this._fReloadCover_sprt)
		{
			this._fadeOutReloadEffect();
		}
	}

	_destroySmokes()
	{
		while (this._fEternalSmokes_eps_arr && this._fEternalSmokes_eps_arr.length > 0)
		{
			let lSmoke_eps = this._fEternalSmokes_eps_arr.pop();
			Sequence.destroy(Sequence.findByTarget(lSmoke_eps));
			lSmoke_eps.destroy();
		}
		this._fEternalSmokes_eps_arr = null;
	}

	destroy()
	{
		this._destroySmokes();
		this._clearReloadEffect();
		
		super.destroy();
	}
}

const ElectricArcsConfig = {
  "frames": {
	"electric_arcs_07.png": {
	  "frame": {
		"x": 1,
		"y": 1,
		"w": 41,
		"h": 123
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 0,
		"y": 1,
		"w": 41,
		"h": 123
	  },
	  "sourceSize": {
		"w": 57,
		"h": 140
	  },
	  "pivot": {
		"x": 0.5,
		"y": 0.5
	  }
	},
	"electric_arcs_08.png": {
	  "frame": {
		"x": 1,
		"y": 126,
		"w": 40,
		"h": 123
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 0,
		"y": 1,
		"w": 40,
		"h": 123
	  },
	  "sourceSize": {
		"w": 57,
		"h": 140
	  },
	  "pivot": {
		"x": 0.5,
		"y": 0.5
	  }
	},
	"electric_arcs_09.png": {
	  "frame": {
		"x": 44,
		"y": 1,
		"w": 40,
		"h": 123
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 0,
		"y": 1,
		"w": 40,
		"h": 123
	  },
	  "sourceSize": {
		"w": 57,
		"h": 140
	  },
	  "pivot": {
		"x": 0.5,
		"y": 0.5
	  }
	},
	"electric_arcs_12.png": {
	  "frame": {
		"x": 43,
		"y": 126,
		"w": 56,
		"h": 60
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 0,
		"y": 0,
		"w": 56,
		"h": 60
	  },
	  "sourceSize": {
		"w": 57,
		"h": 140
	  },
	  "pivot": {
		"x": 0.5,
		"y": 0.5
	  }
	},
	"electric_arcs_13.png": {
	  "frame": {
		"x": 43,
		"y": 188,
		"w": 56,
		"h": 60
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 0,
		"y": 0,
		"w": 56,
		"h": 60
	  },
	  "sourceSize": {
		"w": 57,
		"h": 140
	  },
	  "pivot": {
		"x": 0.5,
		"y": 0.5
	  }
	},
	"electric_arcs_14.png": {
	  "frame": {
		"x": 86,
		"y": 1,
		"w": 56,
		"h": 60
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 0,
		"y": 0,
		"w": 56,
		"h": 60
	  },
	  "sourceSize": {
		"w": 57,
		"h": 140
	  },
	  "pivot": {
		"x": 0.5,
		"y": 0.5
	  }
	},
	"electric_arcs_15.png": {
	  "frame": {
		"x": 86,
		"y": 63,
		"w": 55,
		"h": 60
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 0,
		"y": 0,
		"w": 55,
		"h": 60
	  },
	  "sourceSize": {
		"w": 57,
		"h": 140
	  },
	  "pivot": {
		"x": 0.5,
		"y": 0.5
	  }
	},
	"electric_arcs_10.png": {
	  "frame": {
		"x": 144,
		"y": 1,
		"w": 56,
		"h": 59
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 0,
		"y": 1,
		"w": 56,
		"h": 59
	  },
	  "sourceSize": {
		"w": 57,
		"h": 140
	  },
	  "pivot": {
		"x": 0.5,
		"y": 0.5
	  }
	},
	"electric_arcs_16.png": {
	  "frame": {
		"x": 101,
		"y": 125,
		"w": 55,
		"h": 60
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 0,
		"y": 0,
		"w": 55,
		"h": 60
	  },
	  "sourceSize": {
		"w": 57,
		"h": 140
	  },
	  "pivot": {
		"x": 0.5,
		"y": 0.5
	  }
	},
	"electric_arcs_17.png": {
	  "frame": {
		"x": 101,
		"y": 187,
		"w": 54,
		"h": 60
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 0,
		"y": 0,
		"w": 54,
		"h": 60
	  },
	  "sourceSize": {
		"w": 57,
		"h": 140
	  },
	  "pivot": {
		"x": 0.5,
		"y": 0.5
	  }
	},
	"electric_arcs_11.png": {
	  "frame": {
		"x": 143,
		"y": 63,
		"w": 56,
		"h": 59
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 0,
		"y": 1,
		"w": 56,
		"h": 59
	  },
	  "sourceSize": {
		"w": 57,
		"h": 140
	  },
	  "pivot": {
		"x": 0.5,
		"y": 0.5
	  }
	},
	"electric_arcs_03.png": {
	  "frame": {
		"x": 202,
		"y": 1,
		"w": 27,
		"h": 27
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 14,
		"y": 113,
		"w": 27,
		"h": 27
	  },
	  "sourceSize": {
		"w": 57,
		"h": 140
	  },
	  "pivot": {
		"x": 0.5,
		"y": 0.5
	  }
	},
	"electric_arcs_19.png": {
	  "frame": {
		"x": 157,
		"y": 187,
		"w": 25,
		"h": 53
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 30,
		"y": 3,
		"w": 25,
		"h": 53
	  },
	  "sourceSize": {
		"w": 57,
		"h": 140
	  },
	  "pivot": {
		"x": 0.5,
		"y": 0.5
	  }
	},
	"electric_arcs_04.png": {
	  "frame": {
		"x": 201,
		"y": 62,
		"w": 27,
		"h": 38
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 14,
		"y": 102,
		"w": 27,
		"h": 38
	  },
	  "sourceSize": {
		"w": 57,
		"h": 140
	  },
	  "pivot": {
		"x": 0.5,
		"y": 0.5
	  }
	},
	"electric_arcs_01.png": {
	  "frame": {
		"x": 158,
		"y": 124,
		"w": 26,
		"h": 22
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 14,
		"y": 118,
		"w": 26,
		"h": 22
	  },
	  "sourceSize": {
		"w": 57,
		"h": 140
	  },
	  "pivot": {
		"x": 0.5,
		"y": 0.5
	  }
	},
	"electric_arcs_06.png": {
	  "frame": {
		"x": 202,
		"y": 30,
		"w": 27,
		"h": 21
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 14,
		"y": 103,
		"w": 27,
		"h": 21
	  },
	  "sourceSize": {
		"w": 57,
		"h": 140
	  },
	  "pivot": {
		"x": 0.5,
		"y": 0.5
	  }
	},
	"electric_arcs_00.png": {
	  "frame": {
		"x": 158,
		"y": 148,
		"w": 26,
		"h": 21
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 14,
		"y": 118,
		"w": 26,
		"h": 21
	  },
	  "sourceSize": {
		"w": 57,
		"h": 140
	  },
	  "pivot": {
		"x": 0.5,
		"y": 0.5
	  }
	},
	"electric_arcs_02.png": {
	  "frame": {
		"x": 230,
		"y": 53,
		"w": 26,
		"h": 21
	  },
	  "rotated": true,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 14,
		"y": 119,
		"w": 26,
		"h": 21
	  },
	  "sourceSize": {
		"w": 57,
		"h": 140
	  },
	  "pivot": {
		"x": 0.5,
		"y": 0.5
	  }
	},
	"electric_arcs_05.png": {
	  "frame": {
		"x": 201,
		"y": 102,
		"w": 27,
		"h": 37
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 14,
		"y": 103,
		"w": 27,
		"h": 37
	  },
	  "sourceSize": {
		"w": 57,
		"h": 140
	  },
	  "pivot": {
		"x": 0.5,
		"y": 0.5
	  }
	},
	"electric_arcs_18.png": {
	  "frame": {
		"x": 184,
		"y": 171,
		"w": 24,
		"h": 52
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 30,
		"y": 3,
		"w": 24,
		"h": 52
	  },
	  "sourceSize": {
		"w": 57,
		"h": 140
	  },
	  "pivot": {
		"x": 0.5,
		"y": 0.5
	  }
	},
	"electric_arcs_20.png": {
	  "frame": {
		"x": 230,
		"y": 81,
		"w": 25,
		"h": 52
	  },
	  "rotated": false,
	  "trimmed": true,
	  "spriteSourceSize": {
		"x": 30,
		"y": 3,
		"w": 25,
		"h": 52
	  },
	  "sourceSize": {
		"w": 57,
		"h": 140
	  },
	  "pivot": {
		"x": 0.5,
		"y": 0.5
	  }
	}
  },
  "meta": {
	"app": "http://free-tex-packer.com/",
	"version": "0.3.3",
	"image": "electric_arcs.jpg",
	"format": "RGB888",
	"size": {
	  "w": 256,
	  "h": 256
	},
	"scale": 2
  }
}

Railgun.textures = {
	electricArcs: null
}

Railgun.setTexture = function(name, imageNames, configs, path) {
	if(!Railgun.textures[name]){
		Railgun.textures[name] = [];

		if(!Array.isArray(imageNames)) imageNames = [imageNames];
		if(!Array.isArray(configs)) configs = [configs];

		let assets = [];
		imageNames.forEach(function(item){assets.push(APP.library.getAsset(item))});

		Railgun.textures[name] = AtlasSprite.getFrames(assets, configs, path);
		Railgun.textures[name].sort(function(a, b){if(a._atlasName > b._atlasName) return 1; else return -1});
	}
};

Railgun.initTextures = function() {
	let imageNames 	= ['weapons/Railgun/electric_arcs'],
		configs 	= [ElectricArcsConfig];
	Railgun.setTexture('electricArcs', imageNames, configs, '');
}

export default Railgun;