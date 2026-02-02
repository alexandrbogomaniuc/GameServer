import I18 from '../../controller/translations/I18';
import { APP } from '../../controller/main/globals';

/**
 * Provides relative pathes to different types of resources.
 * @class
 */
class ContentPathURLsProvider {
	static get _URL_PLACEHOLDER_ROOT_RESOURCES_PATH() { return "[root_resources_path]" };
	static get _URL_PLACEHOLDER_CURRENT_TRANSLATIONS_PATH() { return "[current_translations_path]" };
	static get _URL_PLACEHOLDER_CURRENT_TRANSLATIONS_IMGS_PATH() { return "[current_translations_images_path]" };
	static get _URL_PLACEHOLDER_CURRENT_TRANSLATIONS_SPRITES_CONFIGS_PATH() { return "[current_translations_sprites_configs_path]" };

	static get _URL_PLACEHOLDER_COMMON_ROOT_RESOURCES_PATH() { return "[cmn_root_resources_path]" };
	static get _URL_PLACEHOLDER_COMMON_CURRENT_TRANSLATIONS_PATH() { return "[cmn_current_translations_path]" };
	static get _URL_PLACEHOLDER_COMMON_CURRENT_TRANSLATIONS_IMGS_PATH() { return "[cmn_current_translations_images_path]" };

	static get _DEFAULT_ROOT_RESOURCES_PARH() { return "assets" };


	constructor() {
		this._rootResourcesPath = ContentPathURLsProvider._DEFAULT_ROOT_RESOURCES_PARH;
	}

	/** Path to application assets root folder. */
	get rootResourcesPath() {
		// FIX: Use absolute path if common path is available (handles separated server ports)
		if (typeof window !== 'undefined' && window.gameConfig && window.gameConfig.commonPathForActionGames) {
			let common = window.gameConfig.commonPathForActionGames;
			// Strip trailing slash if present
			if (common.endsWith('/')) common = common.slice(0, -1);
			// Check if we are using the standard structure (ending in 'common')
			if (common.endsWith("common")) {
				let base = common.substring(0, common.lastIndexOf("common"));

				// FIX: Ensure we point to Port 80 (Static) not 8081 (Game Server)
				// If the base URL contains :8081, remove it or replace with empty port
				if (base.indexOf(":8081") > -1) {
					base = base.replace(":8081", "");
					console.log("[ContentPath] Stripped Port 8081 from base path to force Static Server usage.");
				}

				// Append current game folder. We assume 'dragonstone' as this is the Dragonstone project.
				let absPath = base + "dragonstone/game/assets";
				console.log("[ContentPath] Resolved Absolute Root Resources Path:", absPath);
				return absPath;
			}
		}
		console.log("[ContentPath] Using Relative Root Resources Path:", this._rootResourcesPath);
		return this._rootResourcesPath;
	}

	/** Path to common assets root folder. */
	get commonRootResourcesPath() {
		return APP.commonAssetsController.info.commonAssetsFolderPath + ContentPathURLsProvider._DEFAULT_ROOT_RESOURCES_PARH;
	}

	/** Path to application image assets folder. */
	get assetsPath() {
		return this.rootResourcesPath + "/images"
	}

	/** Path to application translation assets folder. */
	get rootTranslationsPath() {
		return this.rootResourcesPath + "/translations"
	}

	/** Path to common translation assets folder. */
	get commonTranslationsPath() {
		return this.commonRootResourcesPath + "/translations"
	}

	/** Path to application translation assets (for current locale) folder. */
	get currentLocaleTranslationsPath() {
		return this.rootTranslationsPath + '/' + I18.currentLocale;
	}

	/** Path to common translation assets (for current locale) folder. */
	get commonCurrentLocaleTranslationsPath() {
		return this.commonTranslationsPath + '/' + I18.currentLocale;
	}

	/** Path to application sound assets folder. */
	get soundsPath() {
		return this.rootResourcesPath + "/sounds"
	}

	/** Path to application spine assets folder. */
	get spinePath() {
		return this.rootResourcesPath + "/spine"
	}

	/** Path to application non localized fonts folder. */
	get notLocalizedFontsPath() {
		return this.rootResourcesPath + "/fonts"
	}

	/**
	 * Replaces templates with actual path parts.
	 * @param {string} a_str - Source path.
	 * @returns {string}
	 */
	resolvePathPlaceholders(a_str) {
		var lRet_str = a_str;
		if (lRet_str.indexOf(ContentPathURLsProvider._URL_PLACEHOLDER_ROOT_RESOURCES_PATH) >= 0) {
			lRet_str = lRet_str.replace(ContentPathURLsProvider._URL_PLACEHOLDER_ROOT_RESOURCES_PATH, this.rootResourcesPath + "/");
		}

		if (lRet_str.indexOf(ContentPathURLsProvider._URL_PLACEHOLDER_COMMON_ROOT_RESOURCES_PATH) >= 0) {
			lRet_str = lRet_str.replace(ContentPathURLsProvider._URL_PLACEHOLDER_COMMON_ROOT_RESOURCES_PATH, this.commonRootResourcesPath + "/");
		}

		if (lRet_str.indexOf(ContentPathURLsProvider._URL_PLACEHOLDER_CURRENT_TRANSLATIONS_PATH) >= 0) {
			lRet_str = lRet_str.replace(ContentPathURLsProvider._URL_PLACEHOLDER_CURRENT_TRANSLATIONS_PATH, this.currentLocaleTranslationsPath + "/");
		}

		if (lRet_str.indexOf(ContentPathURLsProvider._URL_PLACEHOLDER_COMMON_CURRENT_TRANSLATIONS_PATH) >= 0) {
			lRet_str = lRet_str.replace(ContentPathURLsProvider._URL_PLACEHOLDER_COMMON_CURRENT_TRANSLATIONS_PATH, this.commonCurrentLocaleTranslationsPath + "/");
		}

		if (lRet_str.indexOf(ContentPathURLsProvider._URL_PLACEHOLDER_CURRENT_TRANSLATIONS_IMGS_PATH) >= 0) {
			let translationImgsPath = this.currentLocaleTranslationsPath + '/images/' + APP.library.scale + "/";
			lRet_str = lRet_str.replace(ContentPathURLsProvider._URL_PLACEHOLDER_CURRENT_TRANSLATIONS_IMGS_PATH, translationImgsPath);
		}

		if (lRet_str.indexOf(ContentPathURLsProvider._URL_PLACEHOLDER_COMMON_CURRENT_TRANSLATIONS_IMGS_PATH) >= 0) {
			let translationImgsPath = this.commonCurrentLocaleTranslationsPath + '/images/' + APP.library.scale + "/";
			lRet_str = lRet_str.replace(ContentPathURLsProvider._URL_PLACEHOLDER_COMMON_CURRENT_TRANSLATIONS_IMGS_PATH, translationImgsPath);
		}

		if (lRet_str.indexOf(ContentPathURLsProvider._URL_PLACEHOLDER_CURRENT_TRANSLATIONS_SPRITES_CONFIGS_PATH) >= 0) {
			let translationSpritesConfigsPath = this.currentLocaleTranslationsPath + '/sprites_jsons';
			lRet_str = lRet_str.replace(ContentPathURLsProvider._URL_PLACEHOLDER_CURRENT_TRANSLATIONS_SPRITES_CONFIGS_PATH, translationSpritesConfigsPath);
		}

		return lRet_str;
	}
}

export default ContentPathURLsProvider