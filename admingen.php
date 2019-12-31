<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://www.criosites.com.br/
 * @since             1.0.0
 * @package           Admingen
 *
 * @wordpress-plugin
 * Plugin Name:       Admin Gen
 * Plugin URI:        https://www.criosites.com.br/
 * Description:       This is a short description of what the plugin does. It's displayed in the WordPress admin area.
 * Version:           1.0.0
 * Author:            Luiz e Anderson
 * Author URI:        https://www.criosites.com.br/
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       admingen
 * Domain Path:       /languages
 */
// If this file is called directly, abort.

if (!defined('WPINC')) {
    die;
}
if (!defined("LACC_ADMINGEN_DIR")) {
    define("LACC_ADMINGEN_DIR", plugin_dir_path(__FILE__));
}

if (!defined("LACC_ADMINGEN_URI")) {
    define("LACC_ADMINGEN_URI", plugins_url() . "/admingen/");
}

if (!defined("LACC_ADMINGEN_APP")) {
    define("LACC_ADMINGEN_APP", plugins_url() . "/admingen/app/");
}

if (!defined("LACC_ADMINGEN_APPINCLUDE")) {
    define("LACC_ADMINGEN_APPINCLUDE", plugins_url() . "/admingen/app/includes");
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define('ADMINGEN_VERSION', '1.0.0');

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-admingen-activator.php
 */
function activate_admingen() {
    require_once plugin_dir_path(__FILE__) . 'includes/class-admingen-activator.php';
    Admingen_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-admingen-deactivator.php
 */
function deactivate_admingen() {
    require_once plugin_dir_path(__FILE__) . 'includes/class-admingen-deactivator.php';
    Admingen_Deactivator::deactivate();
}

register_activation_hook(__FILE__, 'activate_admingen');
register_deactivation_hook(__FILE__, 'deactivate_admingen');

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path(__FILE__) . 'includes/class-admingen.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_admingen() {

    $plugin = new Admingen();
    $plugin->run();
}

function wp_body_classes($classes) {
    $classes[] = '" ng-app="admGenApp"';
    return $classes;
}

add_filter('body_class', 'wp_body_classes', 999);
run_admingen();
