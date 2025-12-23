import WizardEnemy from './WizardEnemy';
import PurpleWizardTeleportFx from '../../view/uis/enemies/wizard/PurpleWizardTeleportFx';

class PurpleWizardEnemy extends WizardEnemy
{
	constructor(params)
	{
		super(params);
	}

	//override
	getImageName()
	{
		return 'enemies/wizards/purple/Monk_Demon';
	}

	//override
	_getWizardTeleportFx()
	{
		return new PurpleWizardTeleportFx();
	}

	destroy(purely)
	{
		super.destroy(purely);
	}
}

export default PurpleWizardEnemy;