import WizardEnemy from './WizardEnemy';
import RedWizardTeleportFx from '../../view/uis/enemies/wizard/RedWizardTeleportFx';

class RedWizardEnemy extends WizardEnemy
{
	constructor(params)
	{
		super(params);
	}

	//override
	getImageName()
	{
		return 'enemies/wizards/red/Monk_Demon';
	}

	//override
	_getWizardTeleportFx()
	{
		return new RedWizardTeleportFx();
	}

	destroy(purely)
	{
		super.destroy(purely);
	}
}

export default RedWizardEnemy;