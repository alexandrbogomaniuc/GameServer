import SimpleUIInfo from '../../../../../../../../common/PIXI/src/dgphoenix/unified/model/uis/SimpleUIInfo';
import PlayerCollectionScreenInfo from './PlayerCollectionScreenInfo';

class PlayerCustomCollectionScreenInfo extends SimpleUIInfo
{
	constructor(collectionId)
	{
		super();

		this._verifyCollectionId(collectionId);

		this._collectionId = collectionId;
	}

	get collectionId()
	{
		return this._collectionId;
	}

	_verifyCollectionId(collectionId)
	{
		if (collectionId === undefined)
		{
			throw new Error(`Collection id not provided: ${collectionId}`);
		}

		let collectionIdSupported = false;
		for (var prop in PlayerCollectionScreenInfo.SCREENS)
		{
			if (PlayerCollectionScreenInfo.SCREENS[prop] === collectionId)
			{
				collectionIdSupported = true;
			}
		}

		if (!collectionIdSupported)
		{
			throw new Error(`Unsupported collection id: ${collectionId}`);
		}
	}

	destroy()
	{
		this._collectionId = undefined;

		super.destroy();
	}

}

export default PlayerCustomCollectionScreenInfo