import {SERVER_MESSAGES} from '../../../common/PIXI/src/dgphoenix/unified/model/interaction/server/WebSocketInteractionInfo';

class GameServerMessageValidator
{
	validateUnusedFields(messageData)
	{
		let unusedFields = [];
		let unusedMessageFields = [];
		let messageClass = messageData.class;

		switch (messageClass)
		{
			case SERVER_MESSAGES.GET_ROOM_INFO_RESPONSE:
				unusedFields = ["weapons", "bossNumberShots", "enemies", "ammoValues", "enemiesModes"];
				break;
			case SERVER_MESSAGES.FULL_GAME_INFO:
				unusedFields = ["mines", "bossNumberShots", "immortalBoss", "seatGems", "gemPrizes"];
				break;
			case SERVER_MESSAGES.SIT_IN_RESPONSE:
				unusedFields = ["weapons", "weaponLootBoxPrices", "level"];
				break;
			case SERVER_MESSAGES.SIT_OUT_RESPONSE:
				unusedFields = ["surplusHvBonus"];
				break;
			case SERVER_MESSAGES.MISS:
				unusedFields = ["bossNumberShots"];
				break;
			case SERVER_MESSAGES.HIT:
				unusedFields = [
					"gems", "newFreeShots", "newFreeShotsSeatId", "instanceKill",
					"chMult", "enemiesInstantKilled", "mineId", "rage", "effects",
					"enemiesWithUpdatedMode", "bossNumberShots"
				];
				break;
			case SERVER_MESSAGES.ROUND_RESULT:
				unusedFields = ["unusedBulletsCount", "totalBuyInMoney", "moneyWheelCompleted", "moneyWheelPayouts"];
				break;
			case SERVER_MESSAGES.UPDATE_TRAJECTORIES:
				unusedFields = ["animationId"];
				break;
		}

		for (let key in messageData)
		{
			if (unusedFields.indexOf(key) != -1)
			{
				unusedMessageFields.push(key);
			}
		}

		if (unusedMessageFields.length > 0) messageData.unusedFields = unusedMessageFields;

		return messageData;
	}
}

export default GameServerMessageValidator;