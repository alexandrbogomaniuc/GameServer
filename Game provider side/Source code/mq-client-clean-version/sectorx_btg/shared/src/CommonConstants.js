import { WEAPONS as COMMON_WEAPONS } from '../../../common/PIXI/src/dgphoenix/gunified/model/weapons/GUSWeaponsInfo';

export const BASE_FRAME_RATE = 16.7;
export const FRAME_RATE = 2*16.7;
export const MONEY_WHEEL_ENABLED = false;

export const TOURNAMENT_STATES = {
	READY: "READY",
	ACTIVE:	"STARTED",
	FINISHED:	"FINISHED",
	CANCELLED:	"CANCELLED"
};

//GAMEPLAY DIALOGS IDS...
let gameplayDialogIdCounter = 0;
export const DIALOG_ID_BATTLEGROUND_COUNT_DOWN				= gameplayDialogIdCounter++;
export const DIALOG_ID_CAF_PRIVATE_ROUND_COUNT_DOWN			= gameplayDialogIdCounter++;
export const GAMEPLAY_DIALOGS_IDS_COUNT						= gameplayDialogIdCounter;
//DIALOGS IDS...
let dialogIdCounter = 0;

export const DIALOG_ID_NETWORK_ERROR 						= dialogIdCounter++; //0
export const DIALOG_ID_GAME_NETWORK_ERROR 					= dialogIdCounter++; //1
export const DIALOG_ID_CRITICAL_ERROR 						= dialogIdCounter++; //2
export const DIALOG_ID_GAME_CRITICAL_ERROR 					= dialogIdCounter++; //3
export const DIALOG_ID_RECONNECT 							= dialogIdCounter++; //4
export const DIALOG_ID_GAME_RECONNECT 						= dialogIdCounter++; //5
export const DIALOG_ID_GAME_ROOM_REOPEN 					= dialogIdCounter++; //6
export const DIALOG_ID_ROOM_NOT_FOUND 						= dialogIdCounter++; //7
export const DIALOG_ID_GAME_NEM 							= dialogIdCounter++; //8 	//not enough money
export const DIALOG_ID_REDIRECTION 							= dialogIdCounter++; //9
export const DIALOG_ID_RETURN_TO_GAME 						= dialogIdCounter++; //10
export const DIALOG_ID_FORCE_SIT_OUT						= dialogIdCounter++; //11
export const DIALOG_ID_MID_ROUND_COMPENSATE_SW 				= dialogIdCounter++; //12
export const DIALOG_ID_MID_ROUND_EXIT 						= dialogIdCounter++; //13
export const DIALOG_ID_GAME_BUY_AMMO_FAILED	 				= dialogIdCounter++; //14
export const DIALOG_ID_WEBGL_CONTEXT_LOST					= dialogIdCounter++; //15
export const DIALOG_ID_RUNTIME_ERROR 						= dialogIdCounter++; //16
export const DIALOG_ID_BONUS 								= dialogIdCounter++; //17
export const DIALOG_ID_FRB									= dialogIdCounter++; //18
export const DIALOG_ID_TOURNAMENT_STATE						= dialogIdCounter++; //19
export const DIALOG_ID_GAME_REBUY							= dialogIdCounter++; //20
export const DIALOG_ID_GAME_NEM_FOR_ROOM					= dialogIdCounter++; //21
export const DIALOG_ID_LOBBY_REBUY							= dialogIdCounter++; //22
export const DIALOG_ID_LOBBY_NEM							= dialogIdCounter++; //23
export const DIALOG_ID_LOBBY_REBUY_FAILED					= dialogIdCounter++; //24
export const DIALOG_ID_GAME_SW_PURCHASE_LIMIT_EXCEEDED		= dialogIdCounter++; //25
export const DIALOG_ID_ROUND_TRANSITION_SW_COMPENSATION		= dialogIdCounter++; //26

export const DIALOG_ID_INSUFFICIENT_FUNDS					= dialogIdCounter++; //27
export const DIALOG_ID_BATTLEGROUND_NOT_ENOUGH_PLAYERS		= dialogIdCounter++; //28
export const DIALOG_ID_BATTLEGROUND_BUY_IN_CONFIRMATION		= dialogIdCounter++; //29
export const DIALOG_ID_BATTLEGROUND_RULES					= dialogIdCounter++; //30
export const DIALOG_ID_NO_WEAPONS_FIRED						= dialogIdCounter++; //31
export const DIALOG_ID_BATTLEGROUND_CONTINUE_READING		= dialogIdCounter++; //32

export const DIALOG_ID_PENDING_OPERATION_FAILED				= dialogIdCounter++; //33
export const DIALOG_ID_ROUND_ALREADY_FINISHED				= dialogIdCounter++; //35
export const DIALOG_ID_PLEASE_WAIT							= dialogIdCounter++; //36
export const DIALOG_ID_WAIT_PENDING_OPERATION				= dialogIdCounter++; //37

export const DIALOG_ID_SERVER_REBOOT						= dialogIdCounter++; //37
export const DIALOG_ID_GAME_SERVER_REBOOT					= dialogIdCounter++; //38

export const DIALOG_ID_ROOM_MOVED_ERROR_REQUESTS_LIMIT_REACHED = dialogIdCounter++; //39
export const DIALOG_ID_CAF_PLAYER_KICKED 					= dialogIdCounter++; //40

export const DIALOG_ID_BATTLEGROUND_CAF_ROOM_MANAGER		= dialogIdCounter++; //41
export const DIALOG_ID_CAF_ROOM_WAS_DEACTIVATED 			= dialogIdCounter++; //42
export const DIALOG_ID_BATTLEGROUND_BUY_IN_CONFIRMATION_CAF = dialogIdCounter++; //43


export const DIALOGS_IDS_COUNT								= dialogIdCounter;
//...DIALOGS IDS

export const BATTLEGROUND_STAKE_MULTIPLIER = 100;

export const WEAPONS = {
	DEFAULT:					COMMON_WEAPONS.DEFAULT,
	HIGH_LEVEL: 				COMMON_WEAPONS.HIGH_LEVEL
};

export const GAME_ROUND_STATE = {
	WAIT: 		"WAIT",
	PLAY: 		"PLAY",
	QUALIFY: 	"QUALIFY",
	CLOSED: 	"CLOSED"
};

export const RICOCHET_WEAPONS = [WEAPONS.DEFAULT, WEAPONS.HIGH_LEVEL];



export const INDICATORS_CONSTANT_VALUES =
{
	MAX_SHOTS_PER_POWERUP: 20
};

export const COOP_FIRE_FX_ALPHA = 0.3;

export const ENEMIES =
{
	Rocky:						'Rocky',
	Pointy:						'Pointy',
	Spiky:						'Spiky',
	Trex:						'Trex',
	Krang:						'Krang',
	Kang:						'Kang',
	OneEye:						'OneEye',
	PinkFlyer:					'PinkFlyer',
	YellowAlien:				'YellowAlien',
	SmallFlyer:					'SmallFlyer',
	JumperBlue:					'JumperBlue',
	JumperGreen:				'JumperGreen',
	JumperWhite:				'JumperWhite',
	GreenHopper:				'GreenHopper',
	FlyerMutalisk:				'FlyerMutalisk',
	Slug:						'Slug',
	Jellyfish:					'Jellyfish',
	Mflyer:						'Mflyer',
	RedHeadFlyer:				'RedFeadFlyer',
	EyeFlyerGreen:				'EyeFlyerGreen',
	EyeFlyerPurple:				'EyeFlyerPurple',
	EyeFlyerRed:				'EyeFlyerRed',
	EyeFlyerYellow:				'EyeFlyerYellow',
	Bioraptor:					'Bioraptor',
	Froggy:						'Froggy',
	Crawler:					'Crawler',
	MothyBlue:					'MothyBlue',
	MothyRed:					'MothyRed',
	MothyWhite:					'MothyWhite',
	MothyYellow:				'MothyYellow',
	Crawler:					'Crawler',
	Flyer:						'Flyer',
	Money:						'Money',
	GiantTrex: 					'GiantTrex',
	GiantPinkFlyer:				'GiantPinkFlyer',

	LaserCapsule:				'LaserCapsule',
	KillerCapsule:				'KillerCapsule',
	LightningCapsule:			'LightningCapsule',
	GoldCapsule:				'GoldCapsule',
	BulletCapsule:				'BulletCapsule',
	BombCapsule:				'BombCapsule',
	FreezeCapsule:				'FreezeCapsule',

	FireBoss:					'FireBoss',
	LightningBoss: 				'LightningBoss',
	Earth:						'EarthBoss',
	IceBoss:					'IceBoss',
};

//changing types DO NOT forget to change all_enemies_avatars and AllEnemiesAvatars.js
export const ENEMY_TYPES =
{
	BOSS:				100,
	EYE_FLAER_GREEN:	0,
	EYE_FLAER_RED:		1,
	EYE_FLAER_PERPLE:	2,
	EYE_FLAER_YELLOW:	3,
	JELLYFISH:			4,
	MFLYER:				5,
	JUMPER_GREEN:		6,
	JUMPER_BLUE:		7,
	JUMPER_WHITE:		8,
	SLUG:				9,
	ONE_EYE:			10,
	POINTY:				11,
	SMALL_FLYER:		12,
	YELLOW_ALIEN:		13,
	GREEN_HOPPER:		14,
	RED_HEAD_FLYER:		15,
	MOTHI_BLUE:			16,
	MOTHI_RED:			17,
	MOTHI_WHITE:		18,
	MOTHI_YELLOW:		19,
	FLYER_MUTALISK:		20,
	KANG:				21,	
	PINK_FLYER:			22,
	FROGGY:				23,
	CRAWLER:			24,
	BIORAPTOR:			25,
	SPIKY:				26,
	FLYER:				27,
	KRANG:				28,
	ROCKY:				29,
	TREX:				30,	
	GOLD_CAPSULE:		51,
	FREEZE_CAPSULE:		52,
	KILLER_CAPSULE:		53,
	BOMB_CAPSULE:		54,
	BULLET_CAPSULE:		55,
	LIGHTNING_CAPSULE:	56,
	LASER_CAPSULE:		57,
	MONEY:				71,
	GIANT_PINK_FLYER:	72,
	GIANT_TREX:			73,
};

export const JUMPING_ENEMY_TYPES = [
	ENEMY_TYPES.JUMPER_BLUE,
	ENEMY_TYPES.JUMPER_GREEN,
	ENEMY_TYPES.JUMPER_WHITE,
	ENEMY_TYPES.GREEN_HOPPER,
	ENEMY_TYPES.FROGGY,
];

export const FLYING_ENEMY_TYPES = [
	ENEMY_TYPES.EYE_FLAER_GREEN,
	ENEMY_TYPES.EYE_FLAER_RED,
	ENEMY_TYPES.EYE_FLAER_PERPLE,
	ENEMY_TYPES.EYE_FLAER_YELLOW,
	ENEMY_TYPES.JELLYFISH,
	ENEMY_TYPES.MFLYER,
	ENEMY_TYPES.POINTY,
	ENEMY_TYPES.SMALL_FLYER,
	ENEMY_TYPES.RED_HEAD_FLYER,
	ENEMY_TYPES.FLYER_MUTALISK,
	ENEMY_TYPES.PINK_FLYER,
	ENEMY_TYPES.BIORAPTOR,
	ENEMY_TYPES.FLYER,
	ENEMY_TYPES.KRANG,
	ENEMY_TYPES.ROCKY,
	ENEMY_TYPES.GOLD_CAPSULE,
	ENEMY_TYPES.FREEZE_CAPSULE,
	ENEMY_TYPES.KILLER_CAPSULE,
	ENEMY_TYPES.BOMB_CAPSULE,
	ENEMY_TYPES.BULLET_CAPSULE,
	ENEMY_TYPES.LIGHTNING_CAPSULE,
	ENEMY_TYPES.LASER_CAPSULE,
	ENEMY_TYPES.MONEY,
	ENEMY_TYPES.GIANT_PINK_FLYER
];

export const ENEMY_BOSS_SKINS =
{
	EARTH: 		1,
	FIRE: 		2,
	ICE:		3,
	LIGHTNING: 	4	
};

export const BACKGROUND_SOUNDS_FADING_TIME = 1000;

export const IS_SPECIAL_WEAPON_SHOT_PAID = false;

export function isBossEnemy(aEnemyTypeId)
{
	return aEnemyTypeId === ENEMY_TYPES.BOSS;
}

export function isJumpingEnemy(aEnemyTypeId_num)
{
	return JUMPING_ENEMY_TYPES.includes(aEnemyTypeId_num)
}

export function isFlyingEnemy(aEnemyTypeId_num)
{
	return FLYING_ENEMY_TYPES.includes(aEnemyTypeId_num)
}

export const DISABLE_TIP_AUTOFIRE = 0;