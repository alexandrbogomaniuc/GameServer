import {COLLIDER_COMPONENT_TYPES} from './ColliderInfo';

var TURRET_1 = 
[ 
	{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 0, centerY: -5, radius: 10},
	{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 0, centerY: 0, radius: 10},
	{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 0, centerY: 5, radius: 10}
]

var TURRET_2 = 
[ 
	{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 0, centerY: -7, radius: 12},
	{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 0, centerY: 0, radius: 12},
	{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 0, centerY: 7, radius: 12}
]

var TURRET_3 = 
[ 
	{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 0, centerY: -10, radius: 12},
	{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 0, centerY: 0, radius: 12},
	{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 0, centerY: 10, radius: 12}
]

var TURRET_4 = 
[ 
	{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 0, centerY: -15, radius: 15},
	{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 0, centerY: 0, radius: 15},
	{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 0, centerY: 15, radius: 15}
]

var TURRET_5 = 
[ 
	{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 0, centerY: -18, radius: 18},
	{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 0, centerY: 0, radius: 18},
	{type: COLLIDER_COMPONENT_TYPES.CIRCLE, centerX: 0, centerY: 18, radius: 18}
]

function getTurretColliderDescriptor(aTurretType_int)
{
	switch (aTurretType_int)
	{
		case 5:
			return TURRET_5;
			break;
		case 4:
			return TURRET_4;
			break;
		case 3:
			return TURRET_3;
			break;
		case 2:
			return TURRET_2;
			break;
		case 1:
		default:
			return TURRET_1;
			break;
	}

	return null;
}

export {getTurretColliderDescriptor}