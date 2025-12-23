import Vue from 'vue';
import GUSLobbyVueApplicationController from '../../../../common/PIXI/src/dgphoenix/gunified/controller/vue/GUSLobbyVueApplicationController';
import { APP } from '../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
import Screen from './components/screen/Screen.vue';
import BaseImage from './components/base/BaseImage.vue';
import BaseButton from './components/base/BaseButton.vue';
import BasePagePoint from './components/base/BasePagePoint.vue';
import Paytable from './components/paytable/Paytable.vue';
import BaseTextField from './components/base/BaseTextField.vue';
import PaytableContent from './components/paytable/PaytableContent.vue';
import PaytableContentBattleground from './components/paytable/PaytableContentBattleground.vue';
import PrintableRulesButton from './components/paytable/PrintableRulesButton.vue';
import LobbyApp from '../LobbyAPP';

class VueApplicationController extends GUSLobbyVueApplicationController
{
	constructor()
	{
		super();
		APP.on(LobbyApp.EVENT_ON_OBSERVER_MODE_ACTIVATED, this._hidePaytableIfNeeded, this);

    }

    _hidePaytableIfNeeded()
    {
        if(this._isShown)
        {
            this._onPaytableCloseButtonClicked(null);
        };
    }

	addDOMScreen()
	{
		Vue.component('Screen', Screen);
		Vue.component('Paytable', Paytable);
		Vue.component('BaseImage', BaseImage);
		Vue.component('BaseButton', BaseButton);
		Vue.component('BasePagePoint', BasePagePoint);
		Vue.component('BaseTextField', BaseTextField);

		if (APP.isBattlegroundGame)
		{
			Vue.component('PaytableContent', PaytableContentBattleground);
		}
		else
		{
			Vue.component('PaytableContent', PaytableContent);
		}
		
		//Vue.component('PrintableRulesButton', PrintableRulesButton);		

		this._fVm_v = new Vue({
			render: h => h(Screen),
			methods: {},
			mounted() {}
		});

		var container = APP.layout.vueScreenNode;

		this._fVm_v.$mount();
		container.appendChild(this._fVm_v.$el);

		Object.assign(container.style, {overflow: "hidden"});

		this._fVm_v.$on('paytable-close-button-click', this._onPaytableCloseButtonClicked.bind(this));
		this._fVm_v.$on('paytable-printable-rules-click', this._onPaytablePrintableRulesButtonClicked.bind(this));
	}

	_onPaytableScreenShow(event)
	{	
		super._onPaytableScreenShow(event);
		this._isShown = true;
	}

	_onPaytableScreenHide(event)
	{
		super._onPaytableScreenHide(event);
		this._isShown = false;
	}

}

export default VueApplicationController;