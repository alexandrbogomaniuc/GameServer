export const BASE_FRAME_RATE = 16.7;
export const FRAME_RATE = 2*16.7;

export const DEFAULT_WEAPON_NAME = "Pistol";

export const TOURNAMENT_STATES = {
	READY: "READY",
	ACTIVE:	"STARTED",
	FINISHED:	"FINISHED",
	CANCELLED:	"CANCELLED"
};

export const WEAPONS = {
	DEFAULT:			-1,
	INSTAKILL:			4,
	MINELAUNCHER:		5,
	ARTILLERYSTRIKE:	7,
	FLAMETHROWER:		9,
	CRYOGUN:			10
};

export const ENEMIES =
{
	ScarabGreen:			'ScarabGreen',		// Scarab Hatchling
	ScarabBrown:			'ScarabBrown',		// Shadow Scarab
	ScarabGold:				'ScarabGold',		// Golden Scarab
	ScarabRuby:				'ScarabRuby',		// Ruby Scarab
	ScarabDiamond:			'ScarabDiamond',	// Bewjelled Scarab
	WrappedYellow:			'WrappedYellow',	// Wrapped Minion
	WrappedBlack:			'WrappedBlack',		// Wrapped Shadowguard
	WrappedWhite:			'WrappedWhite',		// Wrapped Spiritguard
	MummyWarrior:			'MummyWarrior',		// Tahawy Warrior
	MummyWarriorGreen:		'MummyWarriorGreen',	// Tahawy Warrior Green
	MummyGodRed:			'MummyGodRed',		// Crimson Bataanta
	MummyGodGreen:			'MummyGodGreen',	// Emerald Bataanta
	WeaponCarrier:			'WeaponCarrier',	// Infernal Forgemaster
	Locust:					'Locust',			// Devouring Locust
	Scorpion:				'GiantScorpion',	// Giant Scorpion
	BombEnemy:				'BombEnemy',
	Horus:					'Horus',
	LocustTeal:				'LocustTeal',
	BrawlerBerserk: 		'BrawlerBerserk',

	Anubis:					'Anubis',
	Osiris:					'Osiris',
	Thoth:					'Thoth'
};

export const ENEMY_TYPES =
{
	SCARAB_GREEN:			0,
	SCARAB_BROWN:			1,
	SCARAB_GOLD:			2,
	SCARAB_RUBY:			3,
	SCARAB_DIAMOND:			4,
	LOCUST:					5,
	SCORPION:				6,
	MUMMY_WRAPPED_YELLOW:	7,
	MUMMY_WRAPPED_BLACK:	8,
	MUMMY_WRAPPED_WHITE:	9,
	MUMMY_WARRIOR:			10,
	MUMMY_GOD_RED:			11,
	MUMMY_GOD_GREEN:		12,
	BOMB_ENEMY:				13,
	MUMMY_WARRIOR_GREEN:	14,
	HORUS:					15,
	LOCUST_TEAL:			16,
	BRAWLER_BERSERK: 		17,
	WEAPON_CARRIER:			20,
	BOSS:					21
};

export const ENEMY_BOSS_SKINS =
{
	ANUBIS:		1,
	OSIRIS:		2,
	THOTH:		3
}

export const BACKGROUND_SOUNDS_FADING_TIME = 1000;

export const IS_SPECIAL_WEAPON_SHOT_PAID = false;

export function isBossEnemy(aEnemyTypeId)
{
	return aEnemyTypeId === ENEMY_TYPES.BOSS;
}

export const DISABLE_TIP_AUTOFIRE = 3;