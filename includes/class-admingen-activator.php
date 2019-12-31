<?php

/**
 * Fired during plugin activation
 *
 * @link       https://www.criosites.com.br/
 * @since      1.0.0
 *
 * @package    Admingen
 * @subpackage Admingen/includes
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 * @package    Admingen
 * @subpackage Admingen/includes
 * @author     Luiz <luizantoniocardosocosta@gmail.com>
 */
class Admingen_Activator {

    /**
     * Short Description. (use period)
     *
     * Long Description.
     *
     * @since    1.0.0
     */
    public static function activate() {
        $start = new StartApp();
        $start->createDataBase();
    }

}
