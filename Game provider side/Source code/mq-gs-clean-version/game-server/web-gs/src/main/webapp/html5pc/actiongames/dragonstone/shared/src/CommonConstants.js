export const BASE_FRAME_RATE = 16.7;
export const FRAME_RATE = 2*16.7;

export const DEFAULT_WEAPON_NAME = "Pistol";
export const MINI_SLOT_ENABLED = false;


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

//GAMEPLAY DIALOGS IDS...
let gameplayDialogIdCounter = 0;
export const DIALOG_ID_BATTLEGROUND_COUNT_DOWN				= gameplayDialogIdCounter++;
export const DIALOG_ID_CAF_PRIVATE_ROUND_COUNT_DOWN			= gameplayDialogIdCounter++;
export const GAMEPLAY_DIALOGS_IDS_COUNT						= gameplayDialogIdCounter;
//...GAMEPLAY DIALOGS IDS

export const BATTLEGROUND_STAKE_MULTIPLIER = 100;

export const TOURNAMENT_STATES = {
	READY: "READY",
	ACTIVE:	"STARTED",
	FINISHED:	"FINISHED",
	CANCELLED:	"CANCELLED"
};

export const WEAPONS = {
	DEFAULT:			-1,
	INSTAKILL:			4,
	RAILGUN:			6,
	ARTILLERYSTRIKE:	7,
	FLAMETHROWER:		9,
	CRYOGUN:			10,
	PLASMAGUN:			4,
	HIGH_LEVEL: 		16
};

export const RICOCHET_WEAPONS = [WEAPONS.DEFAULT, WEAPONS.HIGH_LEVEL];

export const INDICATORS_CONSTANT_VALUES =
{
	DRAGONSTONE_FRAGMENTS_COUNT:	8,
	SPECIAL_WEAPONS_MAX_TARGETS_COUNTS:
	[
		9, //railgun
		15,//plasma rifle
		16,//cryogun
		16,//flamethrower
		26 //artillery strike
	],
	SLOTS_SPINS_COUNT: 3,
	SLOTS_WIN_MULTIPLIERS:
	[
		10,
		20,
		50,
		80,
		100
	],
	MAX_SHOTS_PER_POWERUP: 20
};

export const GAME_ROUND_STATE = {
	WAIT: 		"WAIT",
	PLAY: 		"PLAY",
	QUALIFY: 	"QUALIFY",
	CLOSED: 	"CLOSED"
};

export const ENEMIES =
{
	BrownSpider:				'BrownSpider',
	BlackSpider:				'BlackSpider',
	RatBrown: 					'RatBrown',
	RatBlack:					'RatBlack',
	Bat:						'Bat',
	Raven:						'Raven',
	Skeleton1:					'Skeleton',
	RedImp:						'RedImp',
	GreenImp:					'GreenImp',
	SkeletonWithGoldenShield:	'SkeletonShield',
	Goblin:						'Goblin',
	HobGoblin:					'HobGoblin',
	DuplicatedGoblin:			'DuplicatedGoblin',
	Gargoyle:					'Gargoyle',
	Orc:						'Orc',
	EmptyArmorSilver:			'EmptyArmorSilver',
	EmptyArmorBlue:				'EmptyArmorBlue',
	EmptyArmorGold:				'EmptyArmorGold',
	WizardRed:					'RedWizard',
	WizardBlue:					'BlueWizard',
	WizardPurple:				'PurpleWizard',
	Ogre:						'Ogre',
	DarkKnight:					'DarkKnight',
	Cerberus:					'Cerberus',
	SpecterSpirit:				'SpecterSpirit',
	SpecterFire:				'SpecterFire',
	SpecterLightning:			'SpecterLightning',
	Dragon:						'Dragon'
};

export const IMPACT_SUPPORT_ENEMIES = [
	ENEMIES.BrownSpider,
	ENEMIES.Goblin,
	ENEMIES.HobGoblin,
	ENEMIES.DuplicatedGoblin,
	ENEMIES.Gargoyle,
	ENEMIES.WizardRed,
	ENEMIES.WizardBlue,
	ENEMIES.WizardPurple,
	ENEMIES.Cerberus,
	ENEMIES.Ogre,
	ENEMIES.Raven,
	ENEMIES.Skeleton1,
	ENEMIES.SkeletonWithGoldenShield,
	ENEMIES.EmptyArmorSilver,
	ENEMIES.EmptyArmorBlue,
	ENEMIES.EmptyArmorGold
]

export const ENEMY_TYPES =
{
	BROWN_SPIDER:					0,
	BLACK_SPIDER:					1,
	BROWN_RAT: 						2,
	BLACK_RAT:						3,
	BAT:							4,
	RAVEN:							5,
	SKELETON_1:						6,
	RED_IMP:						7,
	GREEN_IMP:						8,
	SKELETON_WITH_GOLDEN_SHIELD:	9,
	GOBLIN:							10,
	HOBGOBLIN:						11,
	DUPLICATED_GOBLIN:				12,
	GARGOYLE:						13,
	ORC:							14,
	EMPTY_ARMOR_SILVER:				15,
	EMPTY_ARMOR_BLUE:				16,
	EMPTY_ARMOR_GOLD:				17,
	RED_WIZARD:						18,
	BLUE_WIZARD:					19,
	PURPLE_WIZARD:					20,
	OGRE:							21,
	DARK_KNIGHT:					22,
	CERBERUS:						23,
	SPIRIT_SPECTER:					24,
	FIRE_SPECTER:					25,
	LIGHTNING_SPECTER:				26,
	BOSS:							27
};

export const ENEMIES_EFFECTS_LIST = {
	LIGHTNING: "LIGHTNING",
	FIRE: "FIRE",
	RAGE: "RAGE",
};

export const BACKGROUND_SOUNDS_FADING_TIME = 1000;

export const IS_SPECIAL_WEAPON_SHOT_PAID = false;

export function isBossEnemy(aEnemyTypeId)
{
	return aEnemyTypeId === ENEMY_TYPES.BOSS;
}

export function isRageSupportEnemy(aEnemyTypeId)
{
	return aEnemyTypeId === ENEMY_TYPES.OGRE;
}

export const DISABLE_TIP_AUTOFIRE = 0;