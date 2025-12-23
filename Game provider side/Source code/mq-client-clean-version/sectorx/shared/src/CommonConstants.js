import { WEAPONS as COMMON_WEAPONS } from '../../../common/PIXI/src/dgphoenix/gunified/model/weapons/GUSWeaponsInfo';

export const BASE_FRAME_RATE = 16.7;
export const FRAME_RATE = 2*16.7;

export const BATTLEGROUND_STAKE_MULTIPLIER = 100;
export const MONEY_WHEEL_ENABLED = false;

export const WEAPONS = {
	DEFAULT:					COMMON_WEAPONS.DEFAULT,
};


export const RICOCHET_WEAPONS = [WEAPONS.DEFAULT];

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