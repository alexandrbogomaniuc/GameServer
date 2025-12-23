import WizardEnemy from './WizardEnemy';
import BlueWizardTeleportFx from '../../view/uis/enemies/wizard/BlueWizardTeleportFx';

class BlueWizardEnemy extends WizardEnemy
{
	constructor(params)
	{
		super(params);
	}

	//override
	getImageName()
	{
		return 'enemies/wizards/blue/Monk_Demon';
	}

	//override
	_getWizardTeleportFx()
	{
		return new BlueWizardTeleportFx();
	}

	destroy(purely)
	{
		super.destroy(purely);
	}
}

export default BlueWizardEnemy;