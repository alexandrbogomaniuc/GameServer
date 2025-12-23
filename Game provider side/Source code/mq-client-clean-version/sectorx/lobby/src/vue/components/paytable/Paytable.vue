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
										bgAssetName='paytable/point_on'
									/>
				</div>
				<div class="circle" id='page_2'>
					<BasePagePoint
										@click='goToPage(2)'
										id='page_2'
										bgAssetName='paytable/point_off'
									/>
				</div>
				<div class="circle" id='page_3'>
					<BasePagePoint
										@click='goToPage(3)'
										id='page_3'
										bgAssetName='paytable/point_off'
									/>
				</div>
				<div class="circle" id='page_4'>
					<BasePagePoint
										@click='goToPage(4)'
										id='page_4'
										bgAssetName='paytable/point_off'
									/>
				</div>
				<div class="circle" id='page_5'>
					<BasePagePoint
										@click='goToPage(5)'
										id='page_5'
										bgAssetName='paytable/point_off'
									/>
				</div>
				<div class="circle" id='page_6'>
					<BasePagePoint
										@click='goToPage(6)'
										id='page_6'
										bgAssetName='paytable/point_off'
									/>
				</div>
				<div class="circle" id='page_7'>
					<BasePagePoint
										@click='goToPage(7)'
										id='page_7'
										bgAssetName='paytable/point_off'
									/>
				</div>
				<div class="circle" id='page_8'>
					<BasePagePoint
										@click='goToPage(8)'
										id='page_8'
										bgAssetName='paytable/point_off'
									/>
				</div>
				<div class="circle" id='page_9'>
					<BasePagePoint
										@click='goToPage(9)'
										id='page_9'
										bgAssetName='paytable/point_off'
									/>
				</div>
				<div class="circle" id='page_10'>
					<BasePagePoint
										@click='goToPage(10)'
										id='page_10'
										bgAssetName='paytable/point_off'
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
	import GUSLobbyBattlegroundController from '../../../../../../common/PIXI/src/dgphoenix/gunified/controller/custom/battleground/GUSLobbyBattlegroundController';


	const PAYTABLE_WIDTH = 922;
	const PAYTABLE_HEIGHT = 467;

	const TOTAL_PAGES = 10;
	
	const ENEMY_ID = [
		ENEMY_TYPES.EYE_FLAER_GREEN,
		ENEMY_TYPES.EYE_FLAER_RED,
		ENEMY_TYPES.EYE_FLAER_PERPLE,
		ENEMY_TYPES.EYE_FLAER_YELLOW,
		ENEMY_TYPES.JELLYFISH,
		ENEMY_TYPES.MFLYER,
		ENEMY_TYPES.JUMPER_GREEN,
		ENEMY_TYPES.JUMPER_BLUE,
		ENEMY_TYPES.JUMPER_WHITE,
		ENEMY_TYPES.SLUG,
		ENEMY_TYPES.ONE_EYE,
		ENEMY_TYPES.POINTY,
		ENEMY_TYPES.SMALL_FLYER,
		ENEMY_TYPES.YELLOW_ALIEN,
		ENEMY_TYPES.GREEN_HOPPER,
		ENEMY_TYPES.RED_HEAD_FLYER,
		ENEMY_TYPES.MOTHI_BLUE,
		ENEMY_TYPES.MOTHI_RED,
		ENEMY_TYPES.MOTHI_WHITE,
		ENEMY_TYPES.MOTHI_YELLOW,
		ENEMY_TYPES.FLYER_MUTALISK,
		ENEMY_TYPES.KANG,	
		ENEMY_TYPES.PINK_FLYER,
		ENEMY_TYPES.FROGGY,
		ENEMY_TYPES.CRAWLER,
		ENEMY_TYPES.BIORAPTOR,
		ENEMY_TYPES.SPIKY,
		ENEMY_TYPES.FLYER,
		ENEMY_TYPES.KRANG,
		ENEMY_TYPES.ROCKY,
		ENEMY_TYPES.TREX,
		ENEMY_TYPES.MONEY,
		ENEMY_TYPES.GIANT_PINK_FLYER,
		ENEMY_TYPES.GIANT_TREX,
		ENEMY_TYPES.BOSS
	];

	const SPECIAL_WEAPON_ID = [
		WEAPONS.MINELAUNCHER,
		WEAPONS.INSTAKILL,
		WEAPONS.RICOCHET,
		WEAPONS.FLAMETHROWER,
		WEAPONS.CRYOGUN,
		WEAPONS.ARTILLERYSTRIKE
	];

	const GEM_COUNT = 4;

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

				APP.battlegroundController.on(GUSLobbyBattlegroundController.EVENT_BATTLEGROUND_TIME_TO_START_UPDATED, this._activateTimer, this);

				this.updatePagesIndicator();

				this.$refs.timerText.style.visibility = "hidden";
				this.$refs.timer.style.visibility = "hidden";
			},

			updatePagesIndicator()
			{
				let lCirclesList_arr = this.$refs.sliderDots.querySelectorAll('div.circle');
				for (let lCircle_htmlel of lCirclesList_arr)
				{
					lCircle_htmlel.lastChild.__vue__.bgAssetName = 'paytable/point_off';

					let lCircleId_str = lCircle_htmlel.getAttribute('id');

					if(this.currentPage == Number(lCircleId_str.split('_')[1]))
					{
						lCircle_htmlel.lastChild.__vue__.bgAssetName = 'paytable/point_on';
					}
				}

				this.$refs.paytableContent.updateContent(this.currentPage);
			},

			_activateTimer()
			{
				if(APP.isBattlegroundGame && (APP.battlegroundController.info.getTimeToStartInMillis() > 0))
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
				this.$emit('close');
			},

			handlePrewButtonClick()
			{
				this.currentPage--;
				if(this.currentPage < 1)
				{
					this.currentPage = TOTAL_PAGES
				}
				this.updatePagesIndicator();
			},

			handleNextButtonClick()
			{
				this.currentPage++;
				if(this.currentPage > TOTAL_PAGES)
				{
					this.currentPage = 1;
				}
				this.updatePagesIndicator();
			},

			goToPage(aPageId_int)
			{
				this.currentPage = aPageId_int;
				this.updatePagesIndicator();
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
			enemyPayouts: {
				get() {
					if (!this.paytableData) return [];
					let lResultPayouts_arr_arr = [];
					let lEnemyPayouts_obj_obj = this.paytableData.enemyPayouts;
					for (let i = 0; i < lEnemyPayouts_obj_obj.length; i++)
					{
						if (ENEMY_ID.indexOf(lEnemyPayouts_obj_obj[i].idEnemy) == -1)
						{
							continue;
						}
						let lEnemyPayoutsByWeapons_obj = [];

						//[Y]TODO...
						try
						{
							lEnemyPayoutsByWeapons_obj = lEnemyPayouts_obj_obj[i]
						}
						catch (e)
						{
							APP.logger.i_pushError(`Paytable. ${JSON.stringify(e.stack)}.`);
							console.warn(e);
							lEnemyPayoutsByWeapons_obj = [];
						}
						//...[Y]TODO

						lResultPayouts_arr_arr.push(lEnemyPayoutsByWeapons_obj);
						if (!lEnemyPayoutsByWeapons_obj) console.log(i, lEnemyPayoutsByWeapons_obj);
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
				return TOTAL_PAGES;
			}
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