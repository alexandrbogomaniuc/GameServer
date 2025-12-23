import SimpleUIView from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/SimpleUIView';
import { APP } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import { Sequence } from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/animation';
import CommonEffectsManager from '../../../../main/CommonEffectsManager';
import Sprite from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display/Sprite';
import { AtlasSprite } from '../../../../../../../common/PIXI/src/dgphoenix/unified/view/base/display';
import { Utils } from '../../../../../../../common/PIXI/src/dgphoenix/unified/model/Utils';
import GameSoundsController from '../../../../controller/sounds/GameSoundsController';
import SimpleSoundController from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/sounds/SimpleSoundController';
import Timer from '../../../../../../../common/PIXI/src/dgphoenix/unified/controller/time/Timer';

const SMOKES = [
			{type: 0, 	zIndex: 1, 		scaleX: 1, 		scaleY: 0.5, 	position: {x: 753,		y: 630},	anchor: {x: 0.57, y: 0.81}, startFrame: 3, angle: -7},
			{type: 1, 	zIndex: 8, 		scaleX: 1, 		scaleY: 1, 		position: {x: 740, 		y: 588}, 	anchor: {x: 0.5, y: 0.3}},
			{type: 1, 	zIndex: 9, 		scaleX: 2*0.6, 	scaleY: 2*0.48, position: {x: 744.5, 	y:600}, 	tint: 0x000000, alpha: 0.7},
			{type: 1, 	zIndex: 10, 	scaleX: 2*0.6, 	scaleY: 2*0.48, position: {x: 744.5, 	y:600}, 	tint: 0x000000, alpha: 0.7},
			{type: 1, 	zIndex: 11, 	scaleX: 2*0.6, 	scaleY: 2*0.48, position: {x: 744.5, 	y:600}, 	tint: 0x000000, alpha: 0.7},
			{type: 1, 	zIndex: 12, 	scaleX: 2*0.4, 	scaleY: 2*0.32, position: {x: 753, 		y:600}, 	tint: 0x000000, alpha: 0.7},
			{type: 1, 	zIndex: 13, 	scaleX: 2*0.4, 	scaleY: 2*0.32, position: {x: 753, 		y:603}, 	tint: 0x000000, alpha: 0.7},
			{type: 1, 	zIndex: 58, 	scaleX: 2*0.2, 	scaleY: 2*0.56, position: {x: 747.5, 	y:610}, 	tint: 0x7b603a, anchor: {x: 0.5, y: 0.8}},
			{type: 1, 	zIndex: 59, 	scaleX: 2*0.2, 	scaleY: 2*0.46, position: {x: 739, 		y:580}, 	tint: 0x7b603a,	angle: -30},
			{type: 1, 	zIndex: 60, 	scaleX: 2*0.2, 	scaleY: 2*0.36, position: {x: 764, 		y:580}, 	tint: 0x7b603a, angle: 30},
			{type: 1, 	zIndex: 69, 	scaleX: 2*0.2, 	scaleY: 2*0.16, position: {x: 748, 		y:610}, 	tint: 0x000000, alpha: 0.7},
			{type: 1, 	zIndex: 70, 	scaleX: 2*0.2, 	scaleY: 2*0.16, position: {x: 753, 		y:610}, 	tint: 0x000000, alpha: 0.7},
			{type: 1, 	zIndex: 71, 	scaleX: 2*0.46, scaleY: 2*0.46, position: {x: 749, 		y:602}, 	anchor: {x: 0.5, y: 0.3}}
		]

class MineView extends SimpleUIView {

	static get EVENT_ON_DETONATED() { return 'EVENT_ON_DETONATED'};

	constructor()
	{
		super();

		this._fMineTossed_sprt = null;
		this._fMineBlinker_sprt = null;
		this._fBeepSound_snd = null;
		this._fBeepSoundTimer_tmr = null;

	}

	i_addToScreen({x, y})
	{
		this._addToScreen({x: x, y: y});
	}

	i_animateAppearing()
	{
		this._animateAppearing();
	}

	i_detonate()
	{
		this._detonate();
	}

	//PRIVATE...
	_createView()
	{
		let mine = APP.library.getSprite('weapons/MineLauncher/mine_tossed');
		mine.anchor.set(22/42, 36/46);
		this.addChild(mine);

		this._mainContainer.container.addChild(this);

		this._fMineTossed_sprt = mine;
	}

	_addToScreen({x, y})
	{
		this._createView();
		this.position.set(x, y);
		this.zIndex = this.y;// this._mainContainer.zIndex;
		this._startBlinking();
	}

	_animateAppearing()
	{
		if (!APP.profilingController.info.isVfxDynamicProfileValueMediumOrGreater) return;

		let lSmokes_sprt = this.addChild(new Sprite());
		lSmokes_sprt.zIndex = 3;

		for (let lSmokeParams_obj of SMOKES)
		{
			let lSmoke_sprt = this._createSmoke(lSmokeParams_obj);
			lSmokes_sprt.addChild(lSmoke_sprt);
		}

		lSmokes_sprt.position.set(-751.5+3, -620+2);
	}

	_createSmoke(aSmokeParams_obj)
	{
		let lSmoke_sprt = new Sprite();

		let textures;
		switch (aSmokeParams_obj.type)
		{
			case 0:
				textures = CommonEffectsManager.getDieSmokeUnmultTextures();
				break;
			case 1:
				textures = MineView.getMineGroundSmokeTextures();
				break;
			default:
				throw new Error('MineView :: _createSmoke >> no smoke textures for type ' + aSmokeParams_obj);
		}
		lSmoke_sprt.textures = textures;

		lSmoke_sprt.scale.set(aSmokeParams_obj.scaleX, aSmokeParams_obj.scaleY);
		lSmoke_sprt.position.set(aSmokeParams_obj.position.x, aSmokeParams_obj.position.y);
		if (aSmokeParams_obj.angle !== undefined)
		{
			lSmoke_sprt.rotation = Utils.gradToRad(aSmokeParams_obj.angle);
		}
		if (aSmokeParams_obj.anchor !== undefined)
		{
			lSmoke_sprt.anchor.set(aSmokeParams_obj.anchor.x, aSmokeParams_obj.anchor.y);
		}
		lSmoke_sprt.alpha = aSmokeParams_obj.alpha || 1;

		lSmoke_sprt.zIndex = 100 - aSmokeParams_obj.zIndex;

		if (aSmokeParams_obj.tint !== undefined)
		{
			lSmoke_sprt.tint = aSmokeParams_obj.tint;
		}	

		lSmoke_sprt.once('animationend', (e) => {
			e.target.destroy();
		});
		lSmoke_sprt.gotoAndPlay(aSmokeParams_obj.startFrame || 1);

		return lSmoke_sprt;
	}

	_startBlinking()
	{
		this._blink(8*2*16.7 + Math.random() * 200);
	}

	_blink(aDuration_int)
	{
		this._blinker.alpha = 0;

		let sequence = [
			{ 
				tweens: [{prop: "alpha", to: 1}],
				duration: aDuration_int
			},
			{
				tweens: [{prop: "alpha", to: 0}],
				duration: aDuration_int,
				onfinish: (e) => {
					this._blink(Math.max(aDuration_int*0.9, 1*2*16.7));
				}
			}
		];
		Sequence.start(this._blinker, sequence);
	}

	get _blinker()
	{
		return this._fMineBlinker_sprt || (this._fMineBlinker_sprt = this._initBlinker());
	}

	_initBlinker()
	{
		let lBlinker_sprt = APP.library.getSprite('weapons/MineLauncher/mine_red_blink')
		lBlinker_sprt.zIndex = 2;
		this.addChild(lBlinker_sprt);
		lBlinker_sprt.position.set(0, -12);
		lBlinker_sprt.alpha = 0;
		lBlinker_sprt.blendMode = PIXI.BLEND_MODES.ADD;
		return lBlinker_sprt;
	}

	
	get _mainContainer ()
	{
		return APP.currentWindow.gameField.minesContainer;
	}

	_detonate()
	{
		let lMasterPlayerMine_bl = this.uiInfo.isMaster;
		let lVolume_num = lMasterPlayerMine_bl ? 1 : GameSoundsController.OPPONENT_WEAPON_VOLUME;
		this._fBeepSound_snd = APP.soundsController.play('Mine_Launcher_trigger_beeps_pitched_up', false, lVolume_num, !lMasterPlayerMine_bl);
		if (this._fBeepSound_snd)
		{
			let lSoundDuration_num = this._fBeepSound_snd.i_getInfo().i_getSoundDescriptor().i_getLength() + 100;
			this._fBeepSoundTimer_tmr = new Timer(this._onBeepSoundTimerCompleted.bind(this), lSoundDuration_num);
			this._fBeepSound_snd.once(SimpleSoundController.i_EVENT_SOUND_PLAYING_COMPLETED, this._onBeepSoundCompleted, this);
			this._fBeepSound_snd.once(SimpleSoundController.i_EVENT_SOUND_DESTROYING, this._onBeepSoundDestroying, this);
		}
		else
		{
			//this is IE and sounds are not allowed
			this._onBeepSoundCompleted();
		}
	}

	_clearBeepSoundTimer()
	{
		this._fBeepSoundTimer_tmr && this._fBeepSoundTimer_tmr.destructor();
		this._fBeepSoundTimer_tmr = null;
	}

	_clearBeepSound()
	{
		if (this._fBeepSound_snd)
		{
			this._fBeepSound_snd.off(SimpleSoundController.i_EVENT_SOUND_PLAYING_COMPLETED, this._onBeepSoundCompleted, this, true);
			this._fBeepSound_snd.off(SimpleSoundController.i_EVENT_SOUND_DESTROYING, this._onBeepSoundDestroying, this, true);
			this._fBeepSound_snd.i_destroy();
			this._fBeepSound_snd = null;
		}
	}

	_onBeepSoundTimerCompleted()
	{
		this._clearBeepSound();
		this._onBeepCompleted();
	}

	_onBeepSoundCompleted(aEvent_obj)
	{
		this._clearBeepSoundTimer();
		this._fBeepSound_snd = null;
		this._onBeepCompleted();
	}

	_onBeepSoundDestroying(aEvent_obj)
	{
		this._fBeepSound_snd = null;
	}

	_onBeepCompleted()
	{
		this.emit(MineView.EVENT_ON_DETONATED);
		this.destroy();
	}
	//...PRIVATE

	destroy()
	{
		Sequence.destroy(Sequence.findByTarget(this._fMineBlinker_sprt));

		this._fMineTossed_sprt = null;
		this._fMineBlinker_sprt = null;

		this._clearBeepSound();
		this._clearBeepSoundTimer();

		super.destroy();
	}

}

const MineGroundSmokeUnmultConfig =
{
	"frames": {
		"mine_groundsmoke_unmult_08.png": {
			"frame": {
				"x": 2,
				"y": 2,
				"w": 185,
				"h": 112
			},
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": {
				"x": 1,
				"y": 13,
				"w": 185,
				"h": 112
			},
			"sourceSize": {
				"w": 194,
				"h": 132
			},
			"pivot": {
				"x": 0.5,
				"y": 0.5
			}
		},
		"mine_groundsmoke_unmult_09.png": {
			"frame": {
				"x": 2,
				"y": 118,
				"w": 185,
				"h": 113
			},
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": {
				"x": 2,
				"y": 12,
				"w": 185,
				"h": 113
			},
			"sourceSize": {
				"w": 194,
				"h": 132
			},
			"pivot": {
				"x": 0.5,
				"y": 0.5
			}
		},
		"mine_groundsmoke_unmult_11.png": {
			"frame": {
				"x": 191,
				"y": 2,
				"w": 183,
				"h": 109
			},
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": {
				"x": 6,
				"y": 12,
				"w": 183,
				"h": 109
			},
			"sourceSize": {
				"w": 194,
				"h": 132
			},
			"pivot": {
				"x": 0.5,
				"y": 0.5
			}
		},
		"mine_groundsmoke_unmult_10.png": {
			"frame": {
				"x": 2,
				"y": 235,
				"w": 182,
				"h": 109
			},
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": {
				"x": 3,
				"y": 16,
				"w": 182,
				"h": 109
			},
			"sourceSize": {
				"w": 194,
				"h": 132
			},
			"pivot": {
				"x": 0.5,
				"y": 0.5
			}
		},
		"mine_groundsmoke_unmult_07.png": {
			"frame": {
				"x": 191,
				"y": 115,
				"w": 179,
				"h": 104
			},
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": {
				"x": 2,
				"y": 21,
				"w": 179,
				"h": 104
			},
			"sourceSize": {
				"w": 194,
				"h": 132
			},
			"pivot": {
				"x": 0.5,
				"y": 0.5
			}
		},
		"mine_groundsmoke_unmult_06.png": {
			"frame": {
				"x": 374,
				"y": 115,
				"w": 177,
				"h": 101
			},
			"rotated": true,
			"trimmed": true,
			"spriteSourceSize": {
				"x": 1,
				"y": 24,
				"w": 177,
				"h": 101
			},
			"sourceSize": {
				"w": 194,
				"h": 132
			},
			"pivot": {
				"x": 0.5,
				"y": 0.5
			}
		},
		"mine_groundsmoke_unmult_05.png": {
			"frame": {
				"x": 2,
				"y": 348,
				"w": 176,
				"h": 92
			},
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": {
				"x": 1,
				"y": 32,
				"w": 176,
				"h": 92
			},
			"sourceSize": {
				"w": 194,
				"h": 132
			},
			"pivot": {
				"x": 0.5,
				"y": 0.5
			}
		},
		"mine_groundsmoke_unmult_04.png": {
			"frame": {
				"x": 188,
				"y": 296,
				"w": 176,
				"h": 88
			},
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": {
				"x": 0,
				"y": 36,
				"w": 176,
				"h": 88
			},
			"sourceSize": {
				"w": 194,
				"h": 132
			},
			"pivot": {
				"x": 0.5,
				"y": 0.5
			}
		},
		"mine_groundsmoke_unmult_03.png": {
			"frame": {
				"x": 368,
				"y": 296,
				"w": 176,
				"h": 80
			},
			"rotated": true,
			"trimmed": true,
			"spriteSourceSize": {
				"x": 1,
				"y": 41,
				"w": 176,
				"h": 80
			},
			"sourceSize": {
				"w": 194,
				"h": 132
			},
			"pivot": {
				"x": 0.5,
				"y": 0.5
			}
		},
		"mine_groundsmoke_unmult_02.png": {
			"frame": {
				"x": 182,
				"y": 388,
				"w": 173,
				"h": 74
			},
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": {
				"x": 1,
				"y": 47,
				"w": 173,
				"h": 74
			},
			"sourceSize": {
				"w": 194,
				"h": 132
			},
			"pivot": {
				"x": 0.5,
				"y": 0.5
			}
		},
		"mine_groundsmoke_unmult_01.png": {
			"frame": {
				"x": 191,
				"y": 223,
				"w": 143,
				"h": 59
			},
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": {
				"x": 17,
				"y": 56,
				"w": 143,
				"h": 59
			},
			"sourceSize": {
				"w": 194,
				"h": 132
			},
			"pivot": {
				"x": 0.5,
				"y": 0.5
			}
		}
	},
	"meta": {
		"app": "http://free-tex-packer.com",
		"version": "0.5.0",
		"image": "mine_groundsmoke_unmult.png",
		"format": "RGBA8888",
		"size": {
			"w": 512,
			"h": 512
		},
		"scale": 2
	}
};

MineView.textures = {
	mineGroundSmoke: null
}

MineView.setTexture = function(name, imageNames, configs, path) {
	if(!MineView.textures[name]){
		MineView.textures[name] = [];

		if(!Array.isArray(imageNames)) imageNames = [imageNames];
		if(!Array.isArray(configs)) configs = [configs];

		let assets = [];
		imageNames.forEach(function(item){assets.push(APP.library.getAsset(item))});

		MineView.textures[name] = AtlasSprite.getFrames(assets, configs, path);
		MineView.textures[name].sort(function(a, b){if(a._atlasName > b._atlasName) return 1; else return -1});
	}
};

MineView.initTextures = function(){

	let imageNames 	= ['weapons/MineLauncher/mine_groundsmoke_unmult'],
		configs 	= [MineGroundSmokeUnmultConfig];
		MineView.setTexture('mineGroundSmoke', imageNames, configs, '');
}


MineView.getMineGroundSmokeTextures = function()
{
	MineView.initTextures();
	return MineView.textures.mineGroundSmoke;
}

export default MineView;