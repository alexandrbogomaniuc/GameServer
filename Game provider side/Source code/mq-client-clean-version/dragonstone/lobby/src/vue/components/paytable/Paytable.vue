<template>
	<div class='paytable_frame' :style='{width: PAYTABLE_WIDTH + "px", height: PAYTABLE_HEIGHT + "px"}'>
		<div class='paytable_content_container'>
			<PaytableContent
				ref='paytableContent'
				:enemyPayouts='enemyPayouts'
				:weaponCostMultiplier='weaponCostMultiplier'
				:maxShotsOnScreen='maxShotsOnScreen'
			/>
		</div>
		<div class='row top_row'>
			<div style="width: 3%">
				<div class='vertical_centered'>
					<p id='icon'>?</p>
				</div>
			</div>

			<div style="width: 6%">
				<div class='vertical_centered help'>
					<BaseTextField translatableAssetId='TAPaytableTitle'/>
				</div>
			</div>

			<div style="width: 13%" ref="timerText">
				<div class='vertical_centered timerText'>
					<BaseTextField translatableAssetId='TAPaytableTimer' id='timerText'/>
				</div>
			</div>

			<div style="width: 28%" ref="timer">
				<div class='vertical_centered timer'>
					<p id='timer'>{{timeLeft}}</p>
				</div>
			</div>

			<div style="width: 46%; text-align: right;">
				<div class='vertical_centered'>
					<PrintableRulesButton 	id='printableRulesButton'
											@click='handlePrintableRulesButtonClick'
					/>
				</div>
			</div>

			<div style="width: 4%">
				<div class='vertical_centered' style="text-align: right;">
					<BaseButton
									@click='handleCloseButtonClick'
									id='closeButton'
									bgAssetName='paytable/exit_btn'
								/>
				</div>
			</div>
		</div>
		<div class='row bottom_centered'>
			<div class='slider_btn' align="left">
				<BaseButton
										@click='handlePrewButtonClick'
										id='prewBtn'
										bgAssetName='paytable/slider_pre_btn'
									/>
			</div>
			<div class='slider_dots' ref="sliderDots" align="center">
				<div class="circle" id='page_1'>
					<BasePagePoint
										@click='goToPage(1)'
										id='page_1'
										:bgAssetName="`paytable/point_${currentPage == 1 ? 'on' : 'off'}`"
									/>
				</div>
				<div class="circle" id='page_2'>
					<BasePagePoint
										@click='goToPage(2)'
										id='page_2'
										:bgAssetName="`paytable/point_${currentPage == 2 ? 'on' : 'off'}`"
									/>
				</div>
				<div class="circle" id='page_3'>
					<BasePagePoint
										@click='goToPage(3)'
										id='page_3'
										:bgAssetName="`paytable/point_${currentPage == 3 ? 'on' : 'off'}`"
									/>
				</div>
				<div class="circle" id='page_4'>
					<BasePagePoint
										@click='goToPage(4)'
										id='page_4'
										:bgAssetName="`paytable/point_${currentPage == 4 ? 'on' : 'off'}`"
									/>
				</div>
				<div class="circle" id='page_5'>
					<BasePagePoint
										@click='goToPage(5)'
										id='page_5'
										:bgAssetName="`paytable/point_${currentPage == 5 ? 'on' : 'off'}`"
									/>
				</div>
				<div class="circle" id='page_6'>
					<BasePagePoint
										@click='goToPage(6)'
										id='page_6'
										:bgAssetName="`paytable/point_${currentPage == 6 ? 'on' : 'off'}`"
									/>
				</div>
				<div class="circle" id='page_7'>
					<BasePagePoint
										@click='goToPage(7)'
										id='page_7'
										:bgAssetName="`paytable/point_${currentPage == 7 ? 'on' : 'off'}`"
									/>
				</div>
				<div class="circle" id='page_8'>
					<BasePagePoint
										@click='goToPage(8)'
										id='page_8'
										:bgAssetName="`paytable/point_${currentPage == 8 ? 'on' : 'off'}`"
									/>
				</div>
				<div class="circle" id='page_9'>
					<BasePagePoint
										@click='goToPage(9)'
										id='page_9'
										:bgAssetName="`paytable/point_${currentPage == 9 ? 'on' : 'off'}`"
									/>
				</div>
				<div class="circle" id='page_10'>
					<BasePagePoint
										@click='goToPage(10)'
										id='page_10'
										:bgAssetName="`paytable/point_${currentPage == 10 ? 'on' : 'off'}`"
									/>
				</div>
			</div>
			<div class='slider_btn' align="right">
				<BaseButton
										@click='handleNextButtonClick'
										id='nextBtn'
										bgAssetName='paytable/slider_next_btn'
									/>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">

	import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
	import PaytableScreenController from '../../../controller/uis/custom/secondary/paytable/PaytableScreenController';
	import I18 from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
	import {ENEMY_TYPES, WEAPONS} from '../../../../../shared/src/CommonConstants';
	import PlayerCollectionScreenController from '../../../controller/uis/custom/secondary/player_collection/PlayerCollectionScreenController';
	import * as Easing from '../../../../../../common/PIXI/src/dgphoenix/unified/model/display/animation/easing';
	import BattlegroundController from '../../../controller/custom/battleground/BattlegroundController';

	const PAYTABLE_WIDTH = 922;
	const PAYTABLE_HEIGHT = 467;

	const ENEMY_ID = [
		ENEMY_TYPES.BROWN_SPIDER,
		ENEMY_TYPES.BLACK_SPIDER,
		ENEMY_TYPES.BROWN_RAT,
		ENEMY_TYPES.BLACK_RAT,
		ENEMY_TYPES.BAT,
		ENEMY_TYPES.RAVEN,
		ENEMY_TYPES.SKELETON_1,
		ENEMY_TYPES.RED_IMP,
		ENEMY_TYPES.GREEN_IMP,
		ENEMY_TYPES.SKELETON_WITH_GOLDEN_SHIELD,
		ENEMY_TYPES.GOBLIN,
		ENEMY_TYPES.HOBGOBLIN,
		ENEMY_TYPES.DUPLICATED_GOBLIN,
		ENEMY_TYPES.GARGOYLE,
		ENEMY_TYPES.ORC,
		ENEMY_TYPES.EMPTY_ARMOR_SILVER,
		ENEMY_TYPES.EMPTY_ARMOR_BLUE,
		ENEMY_TYPES.EMPTY_ARMOR_GOLD,
		ENEMY_TYPES.RED_WIZARD,
		ENEMY_TYPES.BLUE_WIZARD,
		ENEMY_TYPES.PURPLE_WIZARD,
		ENEMY_TYPES.OGRE,
		ENEMY_TYPES.DARK_KNIGHT,
		ENEMY_TYPES.CERBERUS,
		ENEMY_TYPES.SPIRIT_SPECTER,
		ENEMY_TYPES.FIRE_SPECTER,
		ENEMY_TYPES.LIGHTNING_SPECTER,
		ENEMY_TYPES.BOSS
	];

	const SPECIAL_WEAPON_ID = [
		WEAPONS.MINELAUNCHER,
		WEAPONS.INSTAKILL,
		WEAPONS.RAILGUN,
		WEAPONS.FLAMETHROWER,
		WEAPONS.CRYOGUN,
		WEAPONS.ARTILLERYSTRIKE
	];

	export default {
		name: 'paytable',

		data() {
			return {
				paytableData: null,
				currentPage: 1,
				timeLeft: '--:--',
				interval: null,
			}
		},

		methods: {
			init() {
				if (APP.secondaryScreenController.paytableScreenController.paytableData)
				{
					this._onPaytableDataReady();
				}
				else
				{
					APP.secondaryScreenController.paytableScreenController.once(PaytableScreenController.EVENT_ON_PAYTABLE_DATA_READY, this._onPaytableDataReady, this);
				}

				APP.secondaryScreenController.paytableScreenController.on(PaytableScreenController.EVENT_ON_WEAPON_PAID_MULTIPLIER_UPDATED, this._onWeaponPaidMultiplierUpdated, this);
				APP.secondaryScreenController.paytableScreenController.on(PaytableScreenController.EVENT_ON_SCREEN_SHOW, this._activateTimer, this);

				APP.battlegroundController.on(BattlegroundController.EVENT_BATTLEGROUND_TIME_TO_START_UPDATED, this._activateTimer, this);

				this.updatePaytableContent();

				this.$refs.timerText.style.visibility = "hidden";
				this.$refs.timer.style.visibility = "hidden";
			},

			updatePaytableContent()
			{
				this.$refs.paytableContent.updateContent(this.currentPage);
			},

			_activateTimer()
			{
				if(APP.battlegroundController.isSecondaryScreenTimerRequired()
				&& APP.secondaryScreenController.paytableScreenController._isScreenShown)
				{
					clearInterval(this.interval);

					this.$refs.timerText.style.visibility = "visible";
					this.$refs.timer.style.visibility = "visible";

					let lBattleGroundController_bgc = APP.battlegroundController.info;

					this.timeLeft = lBattleGroundController_bgc.getFormattedTimeToStart(false);

					this.interval = setInterval(this._tick.bind(this), 100);
				}
			},

			_tick()
			{
				if(APP.battlegroundController.info.isConfirmBuyinDialogRequired)
				{
					clearInterval(this.interval);

					this.$refs.timerText.style.visibility = "hidden";
					this.$refs.timer.style.visibility = "hidden";
				}
				else
				{
					let l_bc = APP.battlegroundController;
					let l_bi = l_bc.info;
					this.timeLeft = l_bc.getFormattedTimeToStart(false);

					if (
						l_bi.getTimeToStartInMillis() <= 0
					)
					{
						clearInterval(this.interval);

						this.$refs.timerText.style.visibility = "hidden";
						this.$refs.timer.style.visibility = "hidden";
						this.$emit('close');
					}
				}
			},

			_onPaytableDataReady(event)
			{
				this.initData();
			},

			_onWeaponPaidMultiplierUpdated(e)
			{
				let lWeaponPaid_arr = this.getPrepareWeaponPaidMultiplier(e.weaponPaidMultiplier.value);
				this.$refs.paytableContent.updateWeaponPaidMultiplier(lWeaponPaid_arr);
			},

			initData() {
				this.paytableData = APP.secondaryScreenController.paytableScreenController.paytableData;
			},

			handleCloseButtonClick() {
				clearInterval(this.interval);

				this.$refs.timerText.style.visibility = "hidden";
				this.$refs.timer.style.visibility = "hidden";

				this.$emit('close');
			},


			handlePrewButtonClick()
			{
				this.currentPage--;
				if(this.currentPage < 1)
				{
					this.currentPage = this.TOTAL_PAGES
				}
				this.updatePaytableContent();
			},

			handleNextButtonClick()
			{
				this.currentPage++;
				if(this.currentPage > this.TOTAL_PAGES)
				{
					this.currentPage = 1;
				}
				this.updatePaytableContent();
			},

			goToPage(aPageId_int)
			{
				this.currentPage = aPageId_int;
				this.updatePaytableContent();
			},

			handlePrintableRulesButtonClick() {
				this.$emit('printable-rules-click');
			},

			_getHPByEnemyID(aEnemyId_int)
			{
				return this.paytableData.healthByLevels[aEnemyId_int];;
			},

			_getPayoutByEnemyID(aEnemyId_int)
			{
				let lResult_obj = {minPayout: 0, maxPayout: 0};
				if (!this.paytableData) return lResult_obj;

				for (let i = 0; i < this.paytableData.enemyPayouts.length; i++)
				{
					if(this.paytableData.enemyPayouts[i].idEnemy == aEnemyId_int)
					{
						return this.paytableData.enemyPayouts[i].prize;
					}
				}

				return lResult_obj;
			},

			getPrepareWeaponPaidMultiplier(aWeaponData_obj)
			{
				let lWeaponPaid_obj_arr = aWeaponData_obj;
				let lResultweaponPainMultiplier_str_arr = [];

				for (let i=0; i < SPECIAL_WEAPON_ID.length; i++)
					{
						let lWeaponId_int = SPECIAL_WEAPON_ID[i];
						let lWeapon_obj = {};

						for(let i=0; i < lWeaponPaid_obj_arr.length; i++)
						{
							if(lWeaponPaid_obj_arr[i].id == lWeaponId_int)
							{
								//[Y]TODO...
								try
								{
									lWeapon_obj = lWeaponPaid_obj_arr[i];
								}
								catch (e)
								{
									APP.logger.i_pushError(`Paytable. ${JSON.stringify(e.stack)}.`);
									console.warn(e);
									lWeapon_obj = {costMultiplier: 0};
								}
								//...[Y]TODO
							}
						}

						let lPaid_num = lWeapon_obj.costMultiplier;

						let lAssetDescriptor_tad = I18.getTranslatableAssetDescriptor("TAPaytableSpecialWeaponCostLabel");
						let l_str = lAssetDescriptor_tad.textDescriptor.content.text;
						let lPaid_str = l_str.replace("/VALUE/", lPaid_num);

						lResultweaponPainMultiplier_str_arr.push(lPaid_str);
					}

					return lResultweaponPainMultiplier_str_arr;
			}
		},

		mounted() {
			this.init();
		},

		computed: {
			playerCollectionScreenController: {
				get() {
					return APP.secondaryScreenController.playerCollectionScreenController;
				}
			},
			enemyPayouts: {
				get() {
					if (!this.paytableData) return [];
					let lResultPayouts_arr_arr = [];
					let lEnemyPayouts_obj_obj = this.paytableData.enemyPayouts;
					for (let i = 0; i < ENEMY_ID.length; i++)
					{
						let lEnemyId_int = ENEMY_ID[i]
						let lEnemyPayoutsByWeapons_obj = [];

						//[Y]TODO...
						try
						{
							lEnemyPayoutsByWeapons_obj = lEnemyPayouts_obj_obj[lEnemyId_int]
						}
						catch (e)
						{
							APP.logger.i_pushError(`Paytable. ${JSON.stringify(e.stack)}.`);
							console.warn(e);
							lEnemyPayoutsByWeapons_obj = [];
						}
						//...[Y]TODO

						lResultPayouts_arr_arr[lEnemyId_int] = lEnemyPayoutsByWeapons_obj;
					}

					return lResultPayouts_arr_arr;
				}
			},
			weaponCostMultiplier: {
				get() {
					if (!this.paytableData || APP.isBattlegroundGame) return [];

					let lWeaponPaid_obj_arr = this.paytableData.weaponPaidMultiplier;

					return this.getPrepareWeaponPaidMultiplier(lWeaponPaid_obj_arr);
				}
			},

			maxShotsOnScreen: {
				get() {
					if (!this.paytableData) return 0;

					return this.paytableData.maxBulletsLimitOnMap;
				}
			},
			PAYTABLE_WIDTH: function() {
				return PAYTABLE_WIDTH;
			},
			PAYTABLE_HEIGHT: function() {
				return PAYTABLE_HEIGHT;
			},
			TOTAL_PAGES: function() {
				if(APP.isBattlegroundGame){
					return 10;
				}
				return 11;
			},
			isBTGMode: {
				get(){
					if(APP.isBattlegroundGame)
					{
						return true;
					}
					return false;
				}
			},
		}
	}
</script>

<style>
</style>

<style scoped>
	* {
		-webkit-transform-origin: top left;
		-ms-transform-origin: top left;
		transform-origin: top left;
		position: relative;
		font-family: "fnt_nm_barlow";
	}

	.paytable_frame {
		color: 				#ffffff;
		background-color: 	rgba(0, 0, 0, 0.75);
		border-radius: 		5px;
		top:				6%;
		left: 				2%;
		display: 			inline-block;
	}

	.top_row {
		height: 61px;
		padding-right: 30px;
		padding-left: 30px;
	}

	.row {
		width: 100%;
		display: flex;
		flex-wrap: nowrap;
		position: relative;
	}

	.vertical_centered {
		top: 50%;
		transform: translate(0, -50%);
		position: absolute;
		width: 100%;
	}

	.slider_btn {
		width: 25%;
	}

	.slider_dots {
		width: 50%;
	}

	.bottom_centered {
		top: 94%;
		transform: translate(0, -50%);
		position: absolute;
		width: 100%;
		padding-right: 30px;
		padding-left: 30px;
	}

	.paytable_content_container {
		position: relative;
	}

	.circle {
		display: inline-block;
		margin: 3px;
	}

	#icon {
		font-size: 26px;
		font-family: "fnt_nm_barlow";
	}

</style>