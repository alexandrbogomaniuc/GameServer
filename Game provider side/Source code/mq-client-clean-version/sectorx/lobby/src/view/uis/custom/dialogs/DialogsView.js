import GUSLobbyDialogsView from '../../../../../../../common/PIXI/src/dgphoenix/gunified/view/uis/dialogs/GUSLobbyDialogsView';

class DialogsView extends GUSLobbyDialogsView
{
	constructor()
	{
		super();
	}

	destroy()
	{
		super.destroy();
	}

	get __midRoundExitBackAssetName()
	{
		return "dialogs/back";
	}

	get __forceSitOutBackAssetName()
	{
		return "dialogs/force_sit_out/back";
	}
}

export default DialogsView;