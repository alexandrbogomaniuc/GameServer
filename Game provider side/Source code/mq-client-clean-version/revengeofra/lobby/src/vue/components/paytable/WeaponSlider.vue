<template>
	<div>
		<div class='slider_btn' id='prewBtnContainer'>
			<BaseButton
									@click='handlePrewButtonClick'
									id='prewBtn'
									bgAssetName='paytable/pages/enemies/weapon_slider/arrow_btn'
								/>
		</div>
		<div id="back" ref='back'>
			<div id="weapons" ref='weapons'>
			</div>
		</div>
		<div id="weaponsNames" ref='weaponsNames'>
		</div>
		<div class='slider_btn' id='nextBtnContainer'>
			<BaseButton
									style="transform: scaleX(-1)"
									@click='handleNextButtonClick'
									id='nextBtn'
									bgAssetName='paytable/pages/enemies/weapon_slider/arrow_btn'
								/>
		</div>
	</div>
</template>

<script type="text/javascript">

	import I18 from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/translations/I18';
	import { APP } from '../../../../../../common/PIXI/src/dgphoenix/unified/controller/main/globals';
	import VueApplicationController from '../../VueApplicationController';
	import BaseImage from './../base/BaseImage.vue';
	import BaseTextField from './../base/BaseTextField.vue';
	import Vue from 'vue';
	import { WEAPONS } from '../../../../../shared/src/CommonConstants';

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
		name: 'weapon_slider',

		data() {
			return {
				currentWeaponID: undefined,
				currentStake: undefined,
				weapons_arr: [],
				weaponsNames_arr: [],
				weaponsNames_arr_span: []
			}
		},

		methods: {
			init()
			{
				this._addBack();
				this._addWeapons();
				this._updateIndicator();
			},

			updateIndicator(aCurrentWeaponId_int, aCurrentStake_int)
			{
				if(this.currentWeaponID == aCurrentWeaponId_int && this.currentStake == aCurrentStake_int) return;
				this.currentWeaponID = aCurrentWeaponId_int;

				this.currentStake = aCurrentStake_int;
				this._updateIndicator();
			},

			_updateIndicator()
			{				
				let wID = this.currentWeaponID === -1 ? 0: this.currentWeaponID;

				for (let i = 0; i < this.weapons_arr.length; i++)
				{
					if(this.weapons_arr[i].id == wID)
					{
						Object.assign(this.weapons_arr[i].style, {
							"opacity": "1",
							});
					}
					else
					{
						Object.assign(this.weapons_arr[i].style, {
							"opacity": "0",
							});
					}
				}

				for (let i = 0; i < this.weaponsNames_arr.length; i++)
				{
					this.weaponsNames_arr_span[i].updateMessage();

					if(this.weaponsNames_arr[i].id == wID)
					{
						Object.assign(this.weaponsNames_arr[i].style, {
							"opacity": "1",
							});
					}
					else
					{
						Object.assign(this.weaponsNames_arr[i].style, {
							"opacity": "0",
							});
					}
				}

				this.$emit('weaponIndicatorUpdated', this.currentWeaponID);
			},

			_addBack()
			{
				let lBeckAssetSpr = this._generateImage("paytable/pages/enemies/weapon_slider/back");

				this.$refs.back.appendChild(lBeckAssetSpr);
			},

			updateTexts()
			{
				for (let i = 0; i < this.weaponsNames_arr.length; i++)
				{
					this.weaponsNames_arr_span[i].updateMessage();
				}
			},

			_addWeapons()
			{
				for (let i = 0; i < WEAPONS_ARRAY.length; i++)
				{
					let wID = WEAPONS_ARRAY[i].number;
					let lWeaponConfig_obj = this._getWeaponConfig(wID);

					let lWeapon = this._generateImage(lWeaponConfig_obj.src);
					lWeapon.id = wID;
					this.$refs.weapons.appendChild(lWeapon);
					this.weapons_arr.push(lWeapon);

					Object.assign(lWeapon.style, {
							"position": "absolute",
							//"transform": "rotate(45deg)",
							"margin-left": lWeaponConfig_obj.left + "px",
							"margin-top": lWeaponConfig_obj.top + "px",
							});

					let lWeapon_span = this._generateText(lWeaponConfig_obj.ctaAssetID);
					this.weaponsNames_arr_span.push(lWeapon_span);
					let lWeaponName = lWeapon_span.$el;
					lWeaponName.id = wID;
					this.$refs.weaponsNames.appendChild(lWeaponName);
					this.weaponsNames_arr.push(lWeaponName);

					lWeapon_span.updateMessage();

					Object.assign(lWeaponName.style, {
							"transform": "translate(-50%, -50%)",
							"position": "absolute",
							});
				}
			},

			_generateText(aTranslatableAssetId_str)
			{
				let baseTextFieldInstance = new this.baseTextFieldClass({
					propsData: { translatableAssetId:  aTranslatableAssetId_str}
				});
				baseTextFieldInstance.$mount();

				return baseTextFieldInstance;
			},

			_generateImage(assetName)
			{
				let baseImageInstance = new this.baseImageClass({
					propsData: { assetName:  assetName}
				});
				baseImageInstance.$mount();
				return baseImageInstance.$el;
			},

			_getWeaponConfig(aWeaponId_num)
			{
				switch(aWeaponId_num)
				{
					case 0:	return {src: "paytable/pages/enemies/weapon_slider/weapons/turret_1", top: -21, left: 3, ctaAssetID: "TAPaytableEnemiesWeaponsTurret"};
					case 1:	return {src: "paytable/pages/enemies/weapon_slider/weapons/turret_2", top: -37, left: 1, ctaAssetID: "TAPaytableEnemiesWeaponsTurret"};
					case 2:	return {src: "paytable/pages/enemies/weapon_slider/weapons/turret_3", top: -43, left: 2, ctaAssetID: "TAPaytableEnemiesWeaponsTurret"};
					case 3:	return {src: "paytable/pages/enemies/weapon_slider/weapons/turret_4", top: -48, left: 0, ctaAssetID: "TAPaytableEnemiesWeaponsTurret"};
					case 4:	return {src: "paytable/pages/enemies/weapon_slider/weapons/turret_5", top: -58, left: -2, ctaAssetID: "TAPaytableEnemiesWeaponsTurret"};
					case 5:	return {src: "paytable/pages/enemies/weapon_slider/weapons/mine_laucher", top: -20, left: -31, ctaAssetID: "TAPaytableEnemiesWeaponsMineLauncher"};
					case 6:	return {src: "paytable/pages/enemies/weapon_slider/weapons/gun_off", top: -28, left: 12, ctaAssetID: "TAPaytableEnemiesWeaponsPlasmaRifle"};
					case 7:	return {src: "paytable/pages/enemies/weapon_slider/weapons/flamethrower", top: -40, left: 8, ctaAssetID: "TAPaytableEnemiesWeaponsFlamethrower"};
					case 8:	return {src: "paytable/pages/enemies/weapon_slider/weapons/cryogun", top: -45, left: 6, ctaAssetID: "TAPaytableEnemiesWeaponsCryogun"};
					case 9:	return {src: "paytable/pages/enemies/weapon_slider/weapons/artillery_grenade", top: 1, left: 18, ctaAssetID: "TAPaytableEnemiesWeaponsArtilleryStrike"};
				}
			},

			handlePrewButtonClick()
			{
				this.currentWeaponID--;
				if(this.currentWeaponID < 0)
				{
					this.currentWeaponID = WEAPONS_ARRAY.length - 1;
				}
				this._updateIndicator(this.currentWeaponID);
			},

			handleNextButtonClick()
			{
				this.currentWeaponID++;
				
				if(this.currentWeaponID > WEAPONS_ARRAY.length - 1)
				{
					this.currentWeaponID = 0;
				}
				this._updateIndicator(this.currentWeaponID);
			},
		},

		mounted() {
			this.init();
		},

		computed: {
			baseImageClass: function() {
				return Vue.extend(BaseImage);
			},
			baseTextFieldClass: function() {
				return Vue.extend(BaseTextField);
			},
		},

		created() {
		},
	}
</script>

<style scoped>
	#back {
		position: absolute;
		width: 100%;
		height: 100%;
	}

	#weapons {
		position: absolute;
		width: 100%;
		height: 100%;
	}

	#weaponsNames {
		position: absolute;
		width: 100%;
		height: 100%;
		margin-left: 28px;
		margin-top: 82px;
		text-align: center;
		font-family: "fnt_nm_barlow_bold";
		font-size: 11px;
	}

	.slider_btn {
		position: absolute;
		margin-top: 20px;
		width: 30px;
		z-index: 1;
	}

	#prewBtnContainer {
		margin-left: -28px;
	}

	#nextBtnContainer {
		margin-left: 60px;
	}

	#special_enemies_weapon_slider #prewBtnContainer {
		margin-top: 20px;
	}

	#special_enemies_weapon_slider #nextBtnContainer {
		margin-top: 20px;
	}

	#special_enemies_weapon_slider #weaponsNames {	
		margin-left: 28.5px;
		margin-top: 81.5px;
		text-align: center;
		font-family: "fnt_nm_barlow_bold";
		font-size: 11px;
	}
</style>