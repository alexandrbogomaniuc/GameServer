import VueApplicationController from '../../../../../../../branches/wrathofra_vue_integrated/wrathofra/lobby/src/vue/VueApplicationController';

<template>
	<span v-html='contentHtml' ref='mainContainer' id='mainContainer'>
	</span>
</template>

<script type="text/javascript">

	import I18 from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
	import BaseImage from './../base/BaseImage.vue';
	import Vue from 'vue';
	import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
	import VueApplicationController from '../../VueApplicationController';
	import NumberValueFormat from '../../../../../../common/PIXI/src/dgphoenix/unified/view/custom/values/NumberValueFormat';
	import { WEAPONS, ENEMY_TYPES } from '../../../../../shared/src/CommonConstants';
	import WeaponSlider from './WeaponSlider.vue';

	const DEFAULT_WEAPON_ID = WEAPONS.DEFAULT;
	const PAYOUT_MULTIPLAER = 1; //серверная константа, актуальна для всех комнат, лубая вылата расчитывается так (HP которое было нанесено врагу за выстрел) * PAYOUT_MULTIPLAER


	const PAGES = {
		1: "how_to_play",
		2: "enemie_hp_and_victory",
		3: "enemies",
		4: "special_enemies",
		5: "unstable_avatar",
		6: "legendary_bosses",
		7: "weapons",
		8: "special_weapons",
		9: "money_wheel",
		10: "kills", 
		11: "controls_1",
		12: "controls_2"
	}

	const WEAPONS_ARRAY = [
		{number: 0, weaponID: WEAPONS.DEFAULT}, //turret 1
		{number: 1, weaponID: WEAPONS.DEFAULT}, //turret 2
		{number: 2, weaponID: WEAPONS.DEFAULT}, //turret 3
		{number: 3, weaponID: WEAPONS.DEFAULT}, //turret 4
		{number: 4, weaponID: WEAPONS.DEFAULT}, //turret 5
		{number: 5, weaponID: WEAPONS.MINELAUNCHER}, 
		{number: 6, weaponID: WEAPONS.INSTAKILL}, 
		{number: 7, weaponID: WEAPONS.FLAMETHROWER}, 
		{number: 8, weaponID: WEAPONS.CRYOGUN}, 
		{number: 9, weaponID: WEAPONS.ARTILLERYSTRIKE}, 
	]

	export default {

		name: "paytable-content",

		props: {
			enemyPayouts: {
				type: Array,
				default: function() {
					return null;
				}
			},
			enemyHP: {
				type: Array,
				default: function() {
					return null;
				}
			},
			bossHP: {
				type: Array,
				default: function() {
					return ['0', '0', '0'];
				}
			},
			weaponCostMultiplier: {
				type: Array,
				default: function() {
					return ['0', '0', '0', '0', '0'];
				}
			},
			maxShotsOnScreen: {
				type: Number,
				default: 0
			}
		},

		data() {
			return {
				_fEnemyWeaponSliderInstance: null,
				_fSpecialWeaponSliderInstance: null
			}
		},

		methods: {
			init() {
				APP.vueApplicationController.once(VueApplicationController.EVENT_TIME_TO_SHOW_VUE_LAYER, this._onFirstTimeToShowVueLayer, this);
				APP.vueApplicationController.on(VueApplicationController.EVENT_TIME_TO_SHOW_VUE_LAYER, this._onValidetePayouts, this);
			},

			_onFirstTimeToShowVueLayer(event) 
			{
				this.$nextTick(function() 
				{
					//optimization...
					this.$refs.mainContainer.display = 'none';
					//...optimization
					this.instantiateSlots();
					//optimization...
					this.$refs.mainContainer.display = 'block';
					//...optimization

					this._validateDisableAoutofireMode();
					this._initEnemyWeaponSlider();
					this._initSpecialWeaponSlider();
					this._initLegendaryBossesWeaponSlider();

					APP.vueApplicationController.on(VueApplicationController.EVENT_TIME_TO_SHOW_VUE_LAYER, this._onSubsequentTimeToShowVueLayer, this);
				})
			},

			_onSubsequentTimeToShowVueLayer(event)
			{
				this.$nextTick(function() 
				{
					//optimization...
					this.$refs.mainContainer.display = 'none';
					//...optimization
					this._validateGameModeContent();
					//optimization...
					this.$refs.mainContainer.display = 'block';
					//...optimization
				})
			},

			_validateDisableAoutofireMode()
			{
				if (!APP.playerController.info.isDisableAutofiring)
				{
					let lSpanList_arr = this.$refs.mainContainer.querySelectorAll('span[id=enebleAutofire]');
					for (let lSpan_htmlel of lSpanList_arr)
					{
						lSpan_htmlel.style.display = 'none';
					}

					let lSetting_el = this.$refs.mainContainer.querySelectorAll('div[id=setting]')[0];
					lSetting_el.style['margin-top'] = '13px';
				}
				else
				{
					let lSpanList_arr = this.$refs.mainContainer.querySelectorAll('span[id=disableAutofire]');
					for (let lSpan_htmlel of lSpanList_arr)
					{
						lSpan_htmlel.style.display = 'none';
					}

					let lSetting_el = this.$refs.mainContainer.querySelectorAll('div[id=setting]')[0];
					lSetting_el.style['margin-top'] = '40px';
					lSetting_el.style['margin-left'] = '-678px';
				}
			},

			_onValidetePayouts()
			{
				this._updateStakeEnemyIndicators();
				this._updateStakeSpecialEnemyIndicators();
				this._updateStakeLegendaryBossesIndicators();
				this._updateWeaponIndicators();
			},

			_initEnemyWeaponSlider()
			{
				this._fEnemyWeaponSliderInstance = new this.weaponSliderClass();
				this._fEnemyWeaponSliderInstance.$mount();
				let lSpan_htmlel = this.$refs.mainContainer.querySelector('div[id=enemy_weapon_slider]');

				this._fEnemyWeaponSliderInstance.$on("weaponIndicatorUpdated", this._weaponEnemyIndicatorUpdatedHandler);
				lSpan_htmlel.appendChild(this._fEnemyWeaponSliderInstance.$el);

				this._updateWeaponIndicators();
			},

			_initSpecialWeaponSlider()
			{
				this._fSpecialWeaponSliderInstance = new this.weaponSliderClass();
				this._fSpecialWeaponSliderInstance.$mount();
				let lSpan_htmlel = this.$refs.mainContainer.querySelector('div[id=special_enemies_weapon_slider]');
				this._fSpecialWeaponSliderInstance.$on("weaponIndicatorUpdated", this._weaponSpecialEnemyIndicatorUpdatedHandler);
				lSpan_htmlel.appendChild(this._fSpecialWeaponSliderInstance.$el);

				this._updateWeaponIndicators();
			},
			
			_initLegendaryBossesWeaponSlider()
			{
				this._fLegendaryBossesWeaponSliderInstance = new this.weaponSliderClass();
				this._fLegendaryBossesWeaponSliderInstance.$mount();
				let lSpan_htmlel = this.$refs.mainContainer.querySelector('div[id=legendary_bosses_weapon_slider]');
				this._fLegendaryBossesWeaponSliderInstance.$on("weaponIndicatorUpdated", this._weaponLegendaryBossesIndicatorUpdatedHandler);
				lSpan_htmlel.appendChild(this._fLegendaryBossesWeaponSliderInstance.$el);

				this._updateWeaponIndicators();
			},

			_weaponEnemyIndicatorUpdatedHandler(aWeaponId_int)
			{
				this._weaponIndicatorUpdated(aWeaponId_int);
				this._validateEnemyBetLevelIndicatorValue(aWeaponId_int);
			},

			_weaponSpecialEnemyIndicatorUpdatedHandler(aWeaponId_int)
			{
				this._weaponIndicatorUpdated(aWeaponId_int);
				this._validateSpecialEnemyBetLevelIndicatorValue(aWeaponId_int);
			},

			_weaponLegendaryBossesIndicatorUpdatedHandler(aWeaponId_int)
			{
				this._weaponIndicatorUpdated(aWeaponId_int);
				this._validateLegendaryBossesBetLevelIndicatorValue(aWeaponId_int);
			},

			_weaponIndicatorUpdated(aWeaponId_int)
			{
				this._updateWeaponIndicators(aWeaponId_int);

				let lSpan_htmlel_arr = this.$refs.mainContainer.querySelectorAll('span[class=enemy_payout]');

				for (let i = 0; i < lSpan_htmlel_arr.length; i++)
				{
					let lEnemyId_int = lSpan_htmlel_arr[i].id;
					this._insertPayout(lSpan_htmlel_arr[i], lEnemyId_int, aWeaponId_int, this._fCurrentStake_int);

					if (lSpan_htmlel_arr[i].id == 17)
					{
						Object.assign(lSpan_htmlel_arr[i].style, {"margin-top": "14px"});
					}
				}
			},

			_updateWeaponIndicators(aCurrentWeaponId_int = this._getCurrentWeaponId())
			{
				let lCurrentStake_int = this._getCurrentStake();

				this._fEnemyWeaponSliderInstance && this._fEnemyWeaponSliderInstance.updateIndicator(aCurrentWeaponId_int, lCurrentStake_int);
				this._fSpecialWeaponSliderInstance && this._fSpecialWeaponSliderInstance.updateIndicator(aCurrentWeaponId_int, lCurrentStake_int);
				this._fLegendaryBossesWeaponSliderInstance && this._fLegendaryBossesWeaponSliderInstance.updateIndicator(aCurrentWeaponId_int, lCurrentStake_int);
				
			},

			_updateStakeEnemyIndicators()
			{
				let lStakeText_str = NumberValueFormat.formatMoney(this._getCurrentStake());
				let lCurrencySymbol_str = "\u200E"+(APP.playerController.info.currencySymbol || "") + "\u200E";
				lCurrencySymbol_str && (lStakeText_str = lCurrencySymbol_str + lStakeText_str);

				let lSpan_htmlel_arr = this.$refs.mainContainer.querySelectorAll('span[id=stake_indicator_text]');
				for (let i = 0; i < lSpan_htmlel_arr.length; i++)
				{
					lSpan_htmlel_arr[i] && (lSpan_htmlel_arr[i].innerText = lStakeText_str);
				}
			},

			_updateStakeSpecialEnemyIndicators()
			{
				let lStakeText_str = NumberValueFormat.formatMoney(this._getCurrentStake());
				let lCurrencySymbol_str = "\u200E"+(APP.playerController.info.currencySymbol || "") + "\u200E";
				lCurrencySymbol_str && (lStakeText_str = lCurrencySymbol_str + lStakeText_str);

				let lSpan_htmlel_arr = this.$refs.mainContainer.querySelectorAll('span[id=stake_lb_indicator_text]');
				for (let i = 0; i < lSpan_htmlel_arr.length; i++)
				{
					lSpan_htmlel_arr[i] && (lSpan_htmlel_arr[i].innerText = lStakeText_str);
				}
			},

			_updateStakeLegendaryBossesIndicators()
			{
				let lStakeText_str = NumberValueFormat.formatMoney(this._getCurrentStake());
				let lCurrencySymbol_str = "\u200E"+(APP.playerController.info.currencySymbol || "") + "\u200E";
				lCurrencySymbol_str && (lStakeText_str = lCurrencySymbol_str + lStakeText_str);

				let lSpan_htmlel_arr = this.$refs.mainContainer.querySelectorAll('span[id=stake_se_indicator_text]');
				for (let i = 0; i < lSpan_htmlel_arr.length; i++)
				{
					lSpan_htmlel_arr[i] && (lSpan_htmlel_arr[i].innerText = lStakeText_str);
				}
			},

			_validateEnemyBetLevelIndicatorValue(aWeaponId_int)
			{
				let level = this._getBetLevelByWeaponId(aWeaponId_int)

				let lSpan_htmlel_el = this.$refs.mainContainer.querySelectorAll('span[id=stake_bet_level_value]')[0];
				lSpan_htmlel_el.innerText = level;
			},

			_validateSpecialEnemyBetLevelIndicatorValue(aWeaponId_int)
			{
				let level = this._getBetLevelByWeaponId(aWeaponId_int)

				let lSpan_htmlel_el = this.$refs.mainContainer.querySelectorAll('span[id=stake_se_bet_level_value]')[0];
				lSpan_htmlel_el.innerText = level;
			},

			_validateLegendaryBossesBetLevelIndicatorValue(aWeaponId_int)
			{
				let level = this._getBetLevelByWeaponId(aWeaponId_int)

				let lSpan_htmlel_el = this.$refs.mainContainer.querySelectorAll('span[id=stake_lb_bet_level_value]')[0];
				lSpan_htmlel_el.innerText = level;
			},

			_getCurrentStake()
			{
				let lCurrentStake_int = undefined;

				if (APP.lobbyStateController.info.lobbyScreenVisible)
				{
					lCurrentStake_int = this._getMinStake();
				}
				else
				{
					let lPlayerInfo = APP.playerController.info;
					lCurrentStake_int = lPlayerInfo.currentStake || lPlayerInfo.enterRoomStake;
				}

				this._fCurrentStake_int = lCurrentStake_int;

				return lCurrentStake_int;
			},

			_getMinStake()
			{
				let lCurrentStakes_int_arr = APP.playerController.info.stakes;
				return lCurrentStakes_int_arr && lCurrentStakes_int_arr[0];
			},

			_getCurrentWeaponId()
			{
				let lCurrentWeaponId_int = undefined;

				if (APP.lobbyStateController.info.lobbyScreenVisible)
				{
					lCurrentWeaponId_int = 0;
				}
				else
				{
					lCurrentWeaponId_int = APP.playerController.info.weaponId;
				}

				if (lCurrentWeaponId_int == undefined)
				{
					lCurrentWeaponId_int = 0;
				}

				return lCurrentWeaponId_int;
			},

			_insertPayout(aTargetSpan_htmlel, aEnemyId_int, aWeaponId_int, aCurrentStake_int)
			{

				let lResultString_str = "";
				let lPayout_obj = this._getEnemyPayoutInfoByIdAndWeaponId(aEnemyId_int, aWeaponId_int);

				try
				{
					let lMin_str = ("\u200E" + (APP.playerController.info.currencySymbol || "") + "\u200E" || "") + NumberValueFormat.formatMoney(Math.floor(aCurrentStake_int * lPayout_obj.minPayout * lPayout_obj.betLevel * PAYOUT_MULTIPLAER));
					let lMax_str = ("\u200E" + (APP.playerController.info.currencySymbol || "") + "\u200E" || "") + NumberValueFormat.formatMoney(Math.floor(aCurrentStake_int * lPayout_obj.maxPayout * lPayout_obj.betLevel * PAYOUT_MULTIPLAER));
					lResultString_str = lMin_str + " - " + lMax_str;
				}
				catch(e)
				{
					console.log("Can not find payout for paytable enemyID: " + aEnemyId_int + " WeaponId: " + aWeaponId_int);
					console.warn(e);
					lResultString_str = "0";
				}

				let lPayoutMaxTextWidth_num = 90;
				let lOriginWidth_num = aTargetSpan_htmlel.offsetWidth;
				if (aEnemyId_int < 17 || aEnemyId_int > 20)
				{
					if(aTargetSpan_htmlel.offsetWidth > lPayoutMaxTextWidth_num)
					{
						console.log(lOriginWidth_num);
						let lScale_num = (lPayoutMaxTextWidth_num * 100) / aTargetSpan_htmlel.offsetWidth / 100;
						let lLeftOffset_num = -lOriginWidth_num * (1 - lScale_num) / 2;

						Object.assign(aTargetSpan_htmlel.style, {
									"transform": "scaleX(" + lScale_num + ") translateX-50%)",
									"-ms-transform": "scaleX(" + lScale_num + ") translateX(-50%)",
									"-webkit-transform": "scaleX(" + lScale_num + ") translateX(-50%)",
									"margin-left": lLeftOffset_num +"px"
								});
					}
					else
					{
						Object.assign(aTargetSpan_htmlel.style, {
									"transform": "scaleX(1) translateX-50%)",
									"-ms-transform": "scaleX(1) translateX(-50%)",
									"-webkit-transform": "scaleX(1) translateX(-50%)",
									"margin-left": "0px"
								});
					}
				}
				
				aTargetSpan_htmlel.innerText = lResultString_str;
			},

			_getEnemyPayoutInfoByIdAndWeaponId(aEnemyId_int, aWeaponId_int)
			{
				let lLastEnemyPayout_obj = this.enemyPayouts[this.enemyPayouts.length-1];
				let lBossesPayouts = [];
				
				lBossesPayouts.push(lLastEnemyPayout_obj); //BOSS #1

				//BOSS #2...
				let lBoss2_obj = lLastEnemyPayout_obj;
				lBossesPayouts.push(lBoss2_obj);
				//...BOSS #2

				//BOSS #3...
				let lBoss3_obj = lLastEnemyPayout_obj;
				lBossesPayouts.push(lBoss3_obj);
				//...BOSS #3

				let lResultPayout_obj = {minPayout: 0, maxPayout: 0, betLevel: 1};

				let lEnemyPayout_obj = {};
				let lBossesIds_str_arr =
				[
					"" + (ENEMY_TYPES.BOSS - 3),
					"" + (ENEMY_TYPES.BOSS - 2),	// BOSS ID IN CONSTANTS = 21
					"" + (ENEMY_TYPES.BOSS - 1),	// BOSS ID IN REQUEST = 18
				];
				let lBossIndex_int = lBossesIds_str_arr.indexOf(aEnemyId_int);

				//BOSS PAYOUT CASE...
				if(lBossIndex_int !== -1)
				{
					lEnemyPayout_obj = lBossesPayouts[lBossIndex_int];
				}
				//...BOSS PAYOUT CASE

				else

				//REGULAR ENEMY PAYOUT CASE...
				{
					lEnemyPayout_obj = this.enemyPayouts[aEnemyId_int];
				}
				//...REGULAR ENEMY PAYOUT CASE
				
				let wID = WEAPONS_ARRAY[aWeaponId_int].weaponID;

				let lEnemyPayoutByWeapon_obj = lEnemyPayout_obj[wID];
				lEnemyPayoutByWeapon_obj.betLevel = this._getBetLevelByWeaponId(aWeaponId_int);

				if (lEnemyPayoutByWeapon_obj.minPayout && lEnemyPayoutByWeapon_obj.maxPayout)
				{
					lResultPayout_obj = lEnemyPayoutByWeapon_obj
				}	
				
				return lResultPayout_obj;
			},

			_getBetLevelByWeaponId(aWeaponId_int)
			{				
				let level = 1;

				switch(aWeaponId_int)
				{
					case 0: 
							level = APP.playerController.info.possibleBetLevels[0];
							break;
					case 1: 
							level = APP.playerController.info.possibleBetLevels[1];
							break;
					case 2: 
							level = APP.playerController.info.possibleBetLevels[2];
							break;
					case 3: 
							level = APP.playerController.info.possibleBetLevels[3];
							break;
					case 4: 
							level = APP.playerController.info.possibleBetLevels[4];
							break;
					default:
							if (APP.layout.isGamesLayoutVisible)
							{
								level = APP.playerController.info.betLevel;
							}
							else
							{
								level = 1;
							}
							break;
				}

				return level;
			},

			instantiateSlots() 
			{
				//insert independent images...
				let lSpanImagesList_arr = this.$refs.mainContainer.querySelectorAll('span[type=img][src]');
				for (let lSpanImage_htmlel of lSpanImagesList_arr)
				{
					let lImageAssetName_str = lSpanImage_htmlel.getAttribute('src');
					lSpanImage_htmlel.appendChild(this.generateImage(lImageAssetName_str));
				}
				//...insert independent images

				//insert translated images...
				let lSpanTranslatableImagesList_arr = this.$refs.mainContainer.querySelectorAll('span[type=img][translatable=true]');
				for (let lSpanTranslatableImage_htmlel of lSpanTranslatableImagesList_arr)
				{
					let lTranslatableAssetId_str = lSpanTranslatableImage_htmlel.id;
					lSpanTranslatableImage_htmlel.appendChild(this.generateImage(lTranslatableAssetId_str));
				}
				//...insert translated images


				//ENEMY_HP...
				if (this.enemyHP && this.enemyHP.length > 0)
				{
					for (let i=0; i<this.enemyHP.length; i++)
					{
						for (let j=0; j<this.enemyHP[i].length; j++)
						{
							let lSpanId_str = "#HP_ENEMY_" + i;
							this.insertValue(lSpanId_str, this.enemyHP[i][j]);
						}
					}
				}
				//...ENEMY_HP

				//BOSS_HP...
				if (this.bossHP && this.bossHP.length > 0)
				{
					let k = this.bossHP.length-1;
					for (let i=0; i < this.bossHP.length; i++)
					{
						let lSpanId_str = "#BOSS_HP_" + i;
						this.insertValue(lSpanId_str, this.bossHP[k - i]);
					}
				}
				//...BOSS_HP

				//WEAPON PAID MULTIPLIER...
				if (this.weaponCostMultiplier && this.weaponCostMultiplier.length > 0)
				{
					for (let i=0; i < this.weaponCostMultiplier.length; i++)
					{
						let lSpanId_str = "#WEAPON_PAID_" + i;
						this.insertValue(lSpanId_str, this.weaponCostMultiplier[i]);
					}
				}
				//...WEAPON PAID MULTIPLIER

				this.insertValue("#MAX_SHOTS_COUNT", this.maxShotsOnScreen);

				this._validateContesntAndStyleSupport();
			},

			_validateContesntAndStyleSupport()
			{
				let lSpan_htmlel_arr = this.$refs.mainContainer.querySelectorAll('span[id=gradient]');
				for (let i = 0; i < lSpan_htmlel_arr.length; i++)
				{
					this.applyGradientStyle(lSpan_htmlel_arr[i].style);
				}
				
				if(!this.supportsCSS('mix-blend-mode', 'screen'))
				{
					let lSpan_htmlel_arr = this.$refs.mainContainer.querySelectorAll('div[id=fx]');

					for (let i = 0; i < lSpan_htmlel_arr.length; i++)
					{
						Object.assign(lSpan_htmlel_arr[i].style, {
							"opacity": "0",
							});
					}
				}

				this._validateGameModeContent();
			},

			_validateGameModeContent()
			{
				let lIsKeepSWModeActive_bl = APP.isKeepSWModeActive;
				let lSpan_htmlel_arr = this.$refs.mainContainer.querySelectorAll('span[class=weapon_indicator]');

				for (let i = 0; i < lSpan_htmlel_arr.length; i++)
				{
					Object.assign(lSpan_htmlel_arr[i].style, {
						"opacity": lIsKeepSWModeActive_bl ? "1" : "0",
						});
				}

				let lIsSWCompensationAllowed_bl = !(APP.FRBController.info.isActivated
													|| APP.lobbyBonusController.info.isActivated 
													|| APP.tournamentModeController.info.isTournamentMode);

				let lHideSWInfoSelector_str = lIsSWCompensationAllowed_bl ? 'span[id=sw_info_lose]' : 'span[id=sw_info_cash_prize]';
				let lHideSpan_htmlel_arr = this.$refs.mainContainer.querySelectorAll(lHideSWInfoSelector_str);

				for (let i = 0; i < lHideSpan_htmlel_arr.length; i++)
				{
					Object.assign(lHideSpan_htmlel_arr[i].style, {
						"display": "none"
					});
				}

				let lShowSWInfoSelector_str = !lIsSWCompensationAllowed_bl ? 'span[id=sw_info_lose]' : 'span[id=sw_info_cash_prize]';
				let lShowSpan_htmlel_arr = this.$refs.mainContainer.querySelectorAll(lShowSWInfoSelector_str);

				for (let i = 0; i < lShowSpan_htmlel_arr.length; i++)
				{
					Object.assign(lShowSpan_htmlel_arr[i].style, {
						"display": "block"
					});
				}

				lSpan_htmlel_arr = this.$refs.mainContainer.querySelectorAll('span[id=sw_info_hide_when_frb]');

				for (let i = 0; i < lSpan_htmlel_arr.length; i++)
				{
					Object.assign(lSpan_htmlel_arr[i].style, {
						"display": APP.FRBController.info.isActivated ? "none" : "block"
						});
				}

			},

			applyGradientStyle(targetStyle)
			{
				let lIsBackgroundClipSupported_bl = this.supportsCSS('-webkit-background-clip', 'text');
				let bg_gradient_url_str = "url("+APP.library.getAsset("paytable/header_gradient").bitmap.src+")";

				if (lIsBackgroundClipSupported_bl)
				{
					Object.assign(targetStyle, {
						"backgroundImage": bg_gradient_url_str,
						"backgroundSize": "100% 100%",
						"webkitBackgroundClip": "text",
						"backgroundClip": "text",
						"webkitTextFillColor": "transparent"
						});
				}
				else
				{
					Object.assign(targetStyle, {
						"background": "transparent",
						"color": "#ffb908",
						"webkitBackgroundClip": "none",
						"backgroundClip": "none",
						"webkitTextFillColor": "#ffb908"
						});
				}
			},

			insertValue(aSpanId_str, aValue_num)
			{
				let lSpan_htmlel = this.$refs.mainContainer.querySelector(aSpanId_str);
				lSpan_htmlel && (lSpan_htmlel.innerText = aValue_num);
				//check for text scaling
			},

			generateImage(assetName)
			{
				let baseImageInstance = new this.baseImageClass({
					propsData: { assetName:  assetName}
				});
				baseImageInstance.$mount();
				return baseImageInstance.$el;
			},

			updateContent(page)
			{
				let lPagesList_arr = this.$refs.mainContainer.querySelectorAll('div[class=page]');
				for (let lPage_htmlel of lPagesList_arr)
				{
					if(lPage_htmlel.getAttribute('id') == this._getPageId(page))
					{
						Object.assign(lPage_htmlel.style, {
							"display": "block"
						});
					}
					else
					{
						Object.assign(lPage_htmlel.style, {
							"display": "none"
						});
					}
				}

				if(this._getPageId(page) == "enemies" || this._getPageId(page) == "special_enemies")
				{
					this._fEnemyWeaponSliderInstance.updateTexts();
					this._fSpecialWeaponSliderInstance.updateTexts();

					this._weaponEnemyIndicatorUpdatedHandler(this._fEnemyWeaponSliderInstance.currentWeaponID)			
					this._weaponSpecialEnemyIndicatorUpdatedHandler(this._fSpecialWeaponSliderInstance.currentWeaponID)
				}
			},

			_getPageId(aPageNumber)
			{
				if(PAGES[aPageNumber] == "controls_1" && APP.isMobile)
					return "mobile_controls_1";
				return PAGES[aPageNumber];
			},

			supportsCSS(property, value)
			{
				try
				{
					var element = document.createElement('span');
					if (element.style[property] !== undefined)
					{
						element.style[property] = value;
					}
					else
					{
						return false;
					}
					return element.style[property] === value;
				} 
				catch (e)
				{
					return false;
				}
			}
		},

		computed: {
			contentHtml: function () {
				return '<style>' + I18.mobilePaytableStylesheet + '</style>' + I18.mobilePaytableContent;
			},
			baseImageClass: function() {
				return Vue.extend(BaseImage);
			},
			weaponSliderClass: function() {
				return Vue.extend(WeaponSlider);
			},
		},

		mounted() {
			this.init();
		}
	}
</script>

<style scoped >
	#mainContainer {
		width: 100%;
		margin: 0 auto;
		position: absolute;
	}
</style>