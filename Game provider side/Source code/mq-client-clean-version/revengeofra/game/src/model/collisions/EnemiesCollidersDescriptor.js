import Enemy from '../../main/enemies/Enemy';
import EightWayEnemy from '../../main/enemies/EightWayEnemy';
import HorusEnemy from '../../main/enemies/HorusEnemy';
import {DIRECTION} from '../../main/enemies/Enemy';
import {COLLIDER_COMPONENT_TYPES} from './ColliderInfo';
import {ENEMIES} from '../../../../shared/src/CommonConstants';

const SMALL_SCARAB = 
{
	[DIRECTION.LEFT_UP]: 	[ {type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 0, centerY: -6, radius: 17} ],
	[DIRECTION.LEFT_DOWN]: 	[ {type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 0, centerY: -6, radius: 17} ],
	[DIRECTION.RIGHT_UP]: 	[ {type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 0, centerY: -6, radius: 17} ],
	[DIRECTION.RIGHT_DOWN]: [ {type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 0, centerY: -6, radius: 17} ],
	[DIRECTION.DOWN]: 		[ {type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 0, centerY: -6, radius: 17} ],
	[DIRECTION.RIGHT]: 		[ {type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 0, centerY: -6, radius: 17} ],
	[DIRECTION.UP]: 		[ {type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 0, centerY: -6, radius: 17} ],
	[DIRECTION.LEFT]: 		[ {type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 0, centerY: -6, radius: 17} ]
}

const BIG_SCARAB = 
{
	[DIRECTION.LEFT_UP]: 	[ {type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 0, centerY: -8, radius: 22} ],
	[DIRECTION.LEFT_DOWN]: 	[ {type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 0, centerY: -8, radius: 22} ],
	[DIRECTION.RIGHT_UP]: 	[ {type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 0, centerY: -8, radius: 22} ],
	[DIRECTION.RIGHT_DOWN]: [ {type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 0, centerY: -8, radius: 22} ],
	[DIRECTION.DOWN]: 		[ {type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 0, centerY: -8, radius: 22} ],
	[DIRECTION.RIGHT]: 		[ {type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 0, centerY: -8, radius: 22} ],
	[DIRECTION.UP]: 		[ {type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 0, centerY: -8, radius: 22} ],
	[DIRECTION.LEFT]: 		[ {type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 0, centerY: -8, radius: 22} ]
}

const WRAPPED = 
{
	[DIRECTION.LEFT_UP]: 	[ {type: COLLIDER_COMPONENT_TYPES.RECT, centerX: -5, centerY: -40, width: 40, height: 70}, {type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -11, centerY: -77, radius: 12} ],
	[DIRECTION.LEFT_DOWN]: 	[ {type: COLLIDER_COMPONENT_TYPES.RECT, centerX: -5, centerY: -40, width: 40, height: 70}, {type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -10, centerY: -75, radius: 12} ],
	[DIRECTION.RIGHT_UP]: 	[ {type: COLLIDER_COMPONENT_TYPES.RECT, centerX: 0, centerY: -40, width: 40, height: 70}, {type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 4, centerY: -75, radius: 12} ],
	[DIRECTION.RIGHT_DOWN]: [ {type: COLLIDER_COMPONENT_TYPES.RECT, centerX: 0, centerY: -40, width: 40, height: 70}, {type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 4, centerY: -75, radius: 12} ]
}

const WARRIOR = 
{
	[DIRECTION.LEFT_UP]: 	[ 
								{type: COLLIDER_COMPONENT_TYPES.RECT, centerX: -3, centerY: -60, width: 55, height: 96}, 
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -14, centerY: -120, radius: 13}, 
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -3, centerY: -105, radius: 13},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -20, centerY: -65, radius: 35}
							],
	[DIRECTION.LEFT_DOWN]: 	[ 
								{type: COLLIDER_COMPONENT_TYPES.RECT, centerX: -10, centerY: -48, width: 55, height: 96}, 
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -22, centerY: -102, radius: 13},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 0, centerY: -60, radius: 30}
							],
	[DIRECTION.RIGHT_UP]: 	[ 
								{type: COLLIDER_COMPONENT_TYPES.RECT, centerX: 0, centerY: -60, width: 55, height: 96}, 
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 10, centerY: -118, radius: 13},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 14, centerY: -82, radius: 25}
							],
	[DIRECTION.RIGHT_DOWN]: [ 
								{type: COLLIDER_COMPONENT_TYPES.RECT, centerX: 10, centerY: -60, width: 55, height: 96},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 22, centerY: -118, radius: 13},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 20, centerY: -50, radius: 30}
							]
}

const PHARAOH_RED = 
{
	[DIRECTION.LEFT_UP]: 	[ 
								{type: COLLIDER_COMPONENT_TYPES.RECT, centerX: -8, centerY: -42, width: 40, height: 74},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -14, centerY: -87, radius: 12}
							],
	[DIRECTION.LEFT_DOWN]: 	[ 
								{type: COLLIDER_COMPONENT_TYPES.RECT, centerX: -12, centerY: -40, width: 40, height: 74},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -18, centerY: -82, radius: 12},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -20, centerY: -35, radius: 20}
							],
	[DIRECTION.RIGHT_UP]: 	[ 
								{type: COLLIDER_COMPONENT_TYPES.RECT, centerX: 10, centerY: -42, width: 40, height: 74},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 14, centerY: -89, radius: 12},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 23, centerY: -30, radius: 20}
							],
	[DIRECTION.RIGHT_DOWN]: [ 
								{type: COLLIDER_COMPONENT_TYPES.RECT, centerX: 10, centerY: -42, width: 40, height: 74},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 14, centerY: -84, radius: 12}
							]
}

const PHARAOH_GREEN = 
{
	[DIRECTION.LEFT_UP]: 	[
								{type: COLLIDER_COMPONENT_TYPES.RECT, centerX: -9, centerY: -46, width: 44, height: 81},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -15, centerY: -95, radius: 13}
							],
	[DIRECTION.LEFT_DOWN]: 	[ 
								{type: COLLIDER_COMPONENT_TYPES.RECT, centerX: -13, centerY: -44, width: 44, height: 81},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -20, centerY: -90, radius: 13},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -22, centerY: -38, radius: 22}
							],
	[DIRECTION.RIGHT_UP]: 	[ 
								{type: COLLIDER_COMPONENT_TYPES.RECT, centerX: 11, centerY: -46, width: 44, height: 81},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 15, centerY: -98, radius: 13},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 25, centerY: -33, radius: 22}
							],
	[DIRECTION.RIGHT_DOWN]: [ 
								{type: COLLIDER_COMPONENT_TYPES.RECT, centerX: 11, centerY: -46, width: 44, height: 81},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 15, centerY: -92, radius: 13}
							]
}

const BOMB_ENEMY = 
{
	[DIRECTION.LEFT_UP]: 	[
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -9, centerY: -46, radius: 26},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -9, centerY: -65, radius: 26},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -9, centerY: -30, radius: 26},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -19, centerY: -98, radius: 15}
							],
	[DIRECTION.LEFT_DOWN]: 	[ 
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -19, centerY: -93, radius: 15},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -13, centerY: -75, radius: 23},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -13, centerY: -65, radius: 23},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -13, centerY: -46, radius: 23},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -13, centerY: -28, radius: 23},								
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -22, centerY: -38, radius: 22}
							],
	[DIRECTION.RIGHT_UP]: 	[ 
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 11, centerY: -66, radius: 26},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 11, centerY: -46, radius: 26},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 11, centerY: -24, radius: 26},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 15, centerY: -98, radius: 15},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 25, centerY: -33, radius: 22}
							],
	[DIRECTION.RIGHT_DOWN]: [ 
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 12, centerY: -66, radius: 26},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 12, centerY: -47, radius: 26},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 12, centerY: -26, radius: 26},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 15, centerY: -92, radius: 15}
							]
}

const LOCUST = 
{
	[DIRECTION.LEFT_UP]: 	[
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -15, centerY: -10, radius: 15},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 0, centerY: 0, radius: 15},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 15, centerY: 7, radius: 15}
							],
	[DIRECTION.LEFT_DOWN]: 	[ 
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -15, centerY: 10, radius: 15},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 0, centerY: 0, radius: 15},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 15, centerY: -7, radius: 15}
							],
	[DIRECTION.RIGHT_UP]: 	[ 
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -15, centerY: 7, radius: 15},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 0, centerY: 0, radius: 15},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 15, centerY: -7, radius: 15}
							],
	[DIRECTION.RIGHT_DOWN]: [ 
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -15, centerY: -10, radius: 15},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 0, centerY: 0, radius: 15},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 15, centerY: 7, radius: 15}
							]
}

const LOCUST_TEAL = 
{
	[DIRECTION.LEFT_UP]: 	[
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -10, centerY: -6, radius: 15},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 10, centerY: 5, radius: 15}
							],
	[DIRECTION.LEFT_DOWN]: 	[ 
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -10, centerY: 6, radius: 15},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 10, centerY: -5, radius: 15}
							],
	[DIRECTION.RIGHT_UP]: 	[ 
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -10, centerY: 6, radius: 15},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 10, centerY: -6, radius: 15}
							],
	[DIRECTION.RIGHT_DOWN]: [ 
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -10, centerY: -6, radius: 15},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 10, centerY: 5, radius: 15}
							]
}

const SCORPION = 
{
	[DIRECTION.LEFT_UP]: 	[
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -12, centerY: -12, radius: 34},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 3, centerY: -53, radius: 20},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -6, centerY: -70, radius: 20},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -42, centerY: -10, radius: 20},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -70, centerY: -17, radius: 10}
							],
	[DIRECTION.LEFT_DOWN]: 	[ 
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 0, centerY: 0, radius: 34},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 15, centerY: -43, radius: 20},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 6, centerY: -60, radius: 20},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -30, centerY: 0, radius: 20},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -55, centerY: 0, radius: 10}
							],
	[DIRECTION.RIGHT_UP]: 	[ 
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 12, centerY: -12, radius: 34},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -3, centerY: -53, radius: 20},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 6, centerY: -70, radius: 20},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 42, centerY: -10, radius: 20},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 70, centerY: -17, radius: 10}
							],
	[DIRECTION.RIGHT_DOWN]: [ 
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 0, centerY: 0, radius: 34},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -15, centerY: -43, radius: 20},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -6, centerY: -60, radius: 20},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 30, centerY: 0, radius: 20},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 55, centerY: 0, radius: 10}
							]
}

const BRAWLER_BERSERK = 
{
	[DIRECTION.LEFT_UP]: 	[
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -12, centerY: -40, radius: 28},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -18, centerY: -60, radius: 28},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -18, centerY: -95, radius: 28},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -40, centerY: -110, radius: 17}
							],
	[DIRECTION.LEFT_DOWN]: 	[ 
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 5, centerY: -45, radius: 30},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -28, centerY: -65, radius: 28},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -10, centerY: -95, radius: 28},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -50, centerY: -90, radius: 17}
							],
	[DIRECTION.RIGHT_UP]: 	[ 
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 12, centerY: -40, radius: 28},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 18, centerY: -60, radius: 28},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 18, centerY: -95, radius: 28},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 40, centerY: -110, radius: 17}
							],
	[DIRECTION.RIGHT_DOWN]: [ 
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -5, centerY: -30, radius: 30},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 28, centerY: -60, radius: 28},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 10, centerY: -82, radius: 28},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 45, centerY: -87, radius: 17}
							]
}

const HORUS = 
{
	[DIRECTION.LEFT_DOWN]: 	[ 
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -25, centerY: -60, radius: 30},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -15, centerY: -85, radius: 30},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -20, centerY: -130, radius: 20},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 25, centerY: -110, radius: 35},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -55, centerY: -120, radius: 30},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 6, centerY: -30, radius: 20},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 8, centerY: -5, radius: 10},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 8, centerY: 10, radius: 10}								
							],
	[DIRECTION.RIGHT_DOWN]: [ 
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -20, centerY: -115, radius: 35},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 20, centerY: -130, radius: 25},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 15, centerY: -90, radius: 35},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 20, centerY: -60, radius: 30},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 8, centerY: -35, radius: 20},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 5, centerY: -15, radius: 10},
								{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 5, centerY: 0, radius: 10}
							]
}

const ANUBIS = 
{
	"normal":
	{
		[DIRECTION.LEFT_UP]: 	[ {type: COLLIDER_COMPONENT_TYPES.RECT, centerX: -19, centerY: -120, width: 87, height: 220}, {type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -25, centerY: -237, radius: 30} ],
		[DIRECTION.LEFT_DOWN]: 	[ {type: COLLIDER_COMPONENT_TYPES.RECT, centerX: -10, centerY: -120, width: 87, height: 220}, {type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -20, centerY: -237, radius: 30} ],
		[DIRECTION.RIGHT_UP]: 	[ {type: COLLIDER_COMPONENT_TYPES.RECT, centerX: 5, centerY: -112, width: 87, height: 231}, {type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 24, centerY: -237, radius: 30} ],
		[DIRECTION.RIGHT_DOWN]: [ {type: COLLIDER_COMPONENT_TYPES.RECT, centerX: 10, centerY: -130, width: 87, height: 200}, {type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 15, centerY: -234, radius: 30} ]
	},
	"weak":
	{
		[DIRECTION.LEFT_UP]: 	[ {type: COLLIDER_COMPONENT_TYPES.RECT, centerX: -20, centerY: -110, width: 87, height: 165}, {type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -45, centerY: -190, radius: 25} ],
		[DIRECTION.LEFT_DOWN]: 	[ {type: COLLIDER_COMPONENT_TYPES.RECT, centerX: -10, centerY: -110, width: 87, height: 165}, {type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 15, centerY: -190, radius: 25}, {type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -35, centerY: -190, radius: 25} ],
		[DIRECTION.RIGHT_UP]: 	[ {type: COLLIDER_COMPONENT_TYPES.RECT, centerX: 10, centerY: -110, width: 87, height: 165}, {type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 35, centerY: -190, radius: 30}, {type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -5, centerY: -190, radius: 30} ],
		[DIRECTION.RIGHT_DOWN]: [ {type: COLLIDER_COMPONENT_TYPES.RECT, centerX: 10, centerY: -115, width: 87, height: 165}, {type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 35, centerY: -200, radius: 30} ]
	}	
}

const OSIRIS = 
{
	"normal":
	{
		[DIRECTION.LEFT_UP]: 	[ {type: COLLIDER_COMPONENT_TYPES.RECT, centerX: -35, centerY: -160, width: 87, height: 280} ],
		[DIRECTION.LEFT_DOWN]: 	[ {type: COLLIDER_COMPONENT_TYPES.RECT, centerX: -10, centerY: -150, width: 100, height: 240} ],
		[DIRECTION.RIGHT_UP]: 	[ {type: COLLIDER_COMPONENT_TYPES.RECT, centerX: 10, centerY: -150, width: 87, height: 260} ],
		[DIRECTION.RIGHT_DOWN]: [ {type: COLLIDER_COMPONENT_TYPES.RECT, centerX: 5, centerY: -150, width: 100, height: 260} ]
	},
	"weak":
	{
		[DIRECTION.LEFT_UP]: 	[ {type: COLLIDER_COMPONENT_TYPES.RECT, centerX: -55, centerY: -130, width: 87, height: 230}, {type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -80, centerY: -240, radius: 30} ],
		[DIRECTION.LEFT_DOWN]: 	[ {type: COLLIDER_COMPONENT_TYPES.RECT, centerX: -25, centerY: -100, width: 87, height: 220}, {type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: -60, centerY: -210, radius: 30} ],
		[DIRECTION.RIGHT_UP]: 	[ {type: COLLIDER_COMPONENT_TYPES.RECT, centerX: 20, centerY: -130, width: 87, height: 230}, {type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 25, centerY: -240, radius: 30} ],
		[DIRECTION.RIGHT_DOWN]: [ {type: COLLIDER_COMPONENT_TYPES.RECT, centerX: 20, centerY: -100, width: 87, height: 200}, {type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 50, centerY: -205, radius: 35} ]
	}	
}

const THOTH = 
{
	"normal":
	{
		[DIRECTION.LEFT_UP]: 	[ {type: COLLIDER_COMPONENT_TYPES.RECT, centerX: -18, centerY: -150, width: 87, height: 240} ],
		[DIRECTION.LEFT_DOWN]: 	[ {type: COLLIDER_COMPONENT_TYPES.RECT, centerX: -10, centerY: -100, width: 100, height: 220} ],
		[DIRECTION.RIGHT_UP]: 	[ {type: COLLIDER_COMPONENT_TYPES.RECT, centerX: 30, centerY: -140, width: 87, height: 240} ],
		[DIRECTION.RIGHT_DOWN]: [ {type: COLLIDER_COMPONENT_TYPES.RECT, centerX: 10, centerY: -110, width: 100, height: 200} ]
	},
	"weak":
	{
		[DIRECTION.LEFT_UP]: 	[ {type: COLLIDER_COMPONENT_TYPES.RECT, centerX: -55, centerY: -120, width: 90, height: 190} ],
		[DIRECTION.LEFT_DOWN]: 	[ {type: COLLIDER_COMPONENT_TYPES.RECT, centerX: -20, centerY: -75, width: 100, height: 180} ],
		[DIRECTION.RIGHT_UP]: 	[ {type: COLLIDER_COMPONENT_TYPES.RECT, centerX: 47, centerY: -110, width: 92, height: 200} ],
		[DIRECTION.RIGHT_DOWN]: [ {type: COLLIDER_COMPONENT_TYPES.RECT, centerX: 35, centerY: -80, width: 90, height: 190} ]
	}	
}

function getEnemyColliderDescriptor(aEnemyName, aEnemyAngle, aIsWeakState_bl)
{
	let lDirection = getEnemyDirection(aEnemyName, aEnemyAngle);
	switch (aEnemyName)
	{
		case ENEMIES.ScarabGreen:
		case ENEMIES.ScarabBrown:
			lDirection = EightWayEnemy.getDirection(aEnemyAngle);
			return SMALL_SCARAB[lDirection];
			break;

		case ENEMIES.ScarabGold:
		case ENEMIES.ScarabRuby:
		case ENEMIES.ScarabDiamond:
			return BIG_SCARAB[lDirection];
			break;
		case ENEMIES.WrappedYellow:
		case ENEMIES.WrappedBlack:
		case ENEMIES.WrappedWhite:
			return WRAPPED[lDirection];
			break;
		case ENEMIES.MummyWarrior:
		case ENEMIES.MummyWarriorGreen:
		case ENEMIES.WeaponCarrier:
			return WARRIOR[lDirection];
			break;
		case ENEMIES.MummyGodRed:
			return PHARAOH_RED[lDirection];
			break;
		case ENEMIES.MummyGodGreen:
			return PHARAOH_GREEN[lDirection];
			break;
		case ENEMIES.BombEnemy:
			return BOMB_ENEMY[lDirection];
			break;
		case ENEMIES.Locust:
			return LOCUST[lDirection];
			break;
		case ENEMIES.LocustTeal:
			return LOCUST_TEAL[lDirection];
			break;
		case ENEMIES.Scorpion:
			return SCORPION[lDirection];
			break;
		case ENEMIES.BrawlerBerserk:
			return BRAWLER_BERSERK[lDirection];
			break;
		case ENEMIES.Horus:
			return HORUS[lDirection];
			break;
		case ENEMIES.Anubis:
			return ANUBIS[aIsWeakState_bl ? "weak" : "normal"][lDirection];
			break;
		case ENEMIES.Osiris:
			return OSIRIS[aIsWeakState_bl ? "weak" : "normal"][lDirection];
			break;
		case ENEMIES.Thoth:
			return THOTH[aIsWeakState_bl ? "weak" : "normal"][lDirection];
			break;
	}

	return null;
}

function getEnemyDirection(aEnemyName, aEnemyAngle)
{
	switch (aEnemyName)
	{
		case ENEMIES.ScarabGreen:
		case ENEMIES.ScarabBrown:
		case ENEMIES.ScarabGold:
		case ENEMIES.ScarabRuby:
		case ENEMIES.ScarabDiamond:
			return EightWayEnemy.getDirection(aEnemyAngle);
			break;
		case ENEMIES.Horus:
			return HorusEnemy.getDirection(aEnemyAngle);
			break;
		default:
			return Enemy.getDirection(aEnemyAngle);
			break;
	}

	return Enemy.getDirection(aEnemyAngle);
}

export { COLLIDER_COMPONENT_TYPES, getEnemyColliderDescriptor };