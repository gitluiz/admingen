<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://www.criosites.com.br/
 * @since      1.0.0
 *
 * @package    Admingen
 * @subpackage Admingen/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Admingen
 * @subpackage Admingen/admin
 * @author     Luiz <luizantoniocardosocosta@gmail.com>
 */
class Admingen_Admin {

    /**
     * The ID of this plugin.
     *
     * @since    1.0.0
     * @access   private
     * @var      string    $plugin_name    The ID of this plugin.
     */
    private $plugin_name;

    /**
     * The version of this plugin.
     *
     * @since    1.0.0
     * @access   private
     * @var      string    $version    The current version of this plugin.
     */
    private $version;
    private $adminGenConfig;
    private $crudPadrao;

    /**
     * Initialize the class and set its properties.
     *
     * @since    1.0.0
     * @param      string    $plugin_name       The name of this plugin.
     * @param      string    $version    The version of this plugin.
     */
    public function __construct($plugin_name, $version) {

        $this->plugin_name = $plugin_name;
        $this->version = $version;
        $this->adminGenConfig = new AdminGenConfig();
        $this->crudPadrao = new CrudPadrao();
    }

    public function enqueue_styles() {
        $this->add_cssFiles();
    }

    public function enqueue_scripts() {
        $this->add_jsFiles();
    }

    public function add_jsFiles() {
        $jsFiles = $this->adminGenConfig->config_js();
        $this->adminGenConfig->jsDefault($this->plugin_name, $this->version);
        foreach ($jsFiles as $js) {
            $jsFile = $this->plugin_name . "_" . str_replace('/', '_', str_replace('.', '_', $js));
            wp_enqueue_script($jsFile, LACC_ADMINGEN_APP . $js, array(), $this->version, true);
        }
    }

    public function add_cssFiles() {
        $cssFiles = $this->adminGenConfig->config_css();
        foreach ($cssFiles as $css) {
            $cssFile = $this->plugin_name . "_" . str_replace('/', '_', str_replace('.', '_', $css));
            wp_enqueue_style($cssFile, LACC_ADMINGEN_APP . $css, array(), $this->version, 'all');
        }
    }

    public function add_ajax() {
        $funcs = array();
        foreach ($funcs as $nam) {
            $function = str_replace('-', '_', $nam);
            $ajaxName = 'wp_ajax_' . $function;
            add_action($ajaxName, array($this, $function));
        }
        $this->crudPadrao->add_ajax('admin');
    }

    public function lacc_menus() {
        add_menu_page("AdminGen",
                "Administração",
                "manage_options",
                "lacc-menus",
                array($this, 'load_admin'),
                "dashicons-forms");
    }

    public function load_admin() {
        include_once LACC_ADMINGEN_DIR . '/app/main.php';
    }

    public function save_json() {
        try {
            $data = json_encode($_POST['json']);
            $this->save_data_json_file($data);
            echo $data;
        } catch (Exception $exc) {
            echo FALSE;
        }
        die();
    }

    public function save_data_json_file($data) {
        $fp = fopen(LACC_ADMINGEN_DIR . 'includes/info_data.json', 'w');
        fwrite($fp, $data);
        fclose($fp);
    }

}
