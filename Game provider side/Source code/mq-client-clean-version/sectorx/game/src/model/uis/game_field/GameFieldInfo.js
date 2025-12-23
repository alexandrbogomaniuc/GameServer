import SimpleUIInfo from '../../../../../../common/PIXI/src/dgphoenix/unified/model/uis/SimpleUIInfo';

const PLAYERS_POSITIONS = {
	"DESKTOP": [
		{ x: 112, y: 493, direct: 0, masterOffset: { x: 36, y: 2 } },
		{ x: 447.5, y: 493, direct: 0, masterOffset: { x: 36, y: 2 } }, //x: 461.5 - 14,
		{ x: 783, y: 493, direct: 0, masterOffset: { x: 36, y: 2 } }, //x: 811 - 28
		{ x: 112, y: 64, direct: 1, masterOffset: { x: 36, y: -14 } }, //y: 48 + 16   y: 10 - 24 
		{ x: 447.5, y: 64, direct: 1, masterOffset: { x: 36, y: -14 } }, //x: 461.5 - 14, y: 48 + 16,  y: 10 - 24
		{ x: 783, y: 64, direct: 1, masterOffset: { x: 36, y: -14 } } //x: 811 - 28, y: 48 + 16  y: 10 - 24
	],
	"MOBILE": [
		{ x: 112, y: 470, direct: 0, masterOffset: { x: 36, y: 2 } },
		{ x: 447.5, y: 470, direct: 0, masterOffset: { x: 36, y: 2 } }, //x: 461.5 - 14,
		{ x: 783, y: 470, direct: 0, masterOffset: { x: 36, y: 2 } }, //x: 811 - 28
		{ x: 112, y: 64, direct: 1, masterOffset: { x: 36, y: -14 } }, //y: 48 + 16   y: 10 - 24
		{ x: 447.5, y: 64, direct: 1, masterOffset: { x: 36, y: -14 } }, //x: 461.5 - 14, y: 48 + 16   y: 10 - 24
		{ x: 783, y: 64, direct: 1, masterOffset: { x: 36, y: -14 } } //x: 811 - 28, y: 48 + 16   y: 10 - 24
	]
}

const MAX_PLAYER_IN_ROOM = 6;

export const SEATS_POSITION_IDS = {
	0: 1,
	1: 4,
	2: 2,
	3: 5,
	4: 3,
	5: 0
}

class GameFieldInfo extends SimpleUIInfo
{
	constructor()
	{
		super();
	}

	get playersPositions()
	{
		return PLAYERS_POSITIONS;
	}

	get maxPlayerInRoom()
	{
		return MAX_PLAYER_IN_ROOM;
	}

	get sitPositionIds()
	{
		return SEATS_POSITION_IDS;
	}

	destroy()
	{
		super.destroy();
	}
}

export default GameFieldInfo;