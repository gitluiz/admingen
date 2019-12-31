<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of AdminGenConfig
 *
 * @author luiz
 */
class AdminGenConfig {

    private $custom_js = array();
    private $custom_css = array();

    /**
     *
     * @var type array
     */
    private $default_js = array(
        //'js/jquery/jquery-1.12.4.min.js',
        //'js/jquery/jquery-ui.min.js',
        'js/jquery/jquery.uploadifive.min.js',
        'js/jquery.blockUI.js',
        'js/bootstrap.bundle.min.js',
        'js/lightbox.min.js',
        'js/angular-1.7.8/angular.min.js',
        'js/angular-1.7.8/angular-resource.min.js',
        'js/angular-1.7.8/angular-sanitize.min.js',
        'js/angular-1.7.8/i18n/angular-locale_pt-br.js',
        'js/angular-1.7.8/i18n/angular-locale_pt-br.js',
        'main.js'
    );

    /**
     *
     * @var type array
     */
    private $default_css = array(
        'css/fontawesome-free-5.10.0-web/css/all.min.css',
        'css/uploadify.css',
        'css/jquery-ui.min.css',
        'css/bootstrap.min.css',
        'css/jquery.fileupload-ui.css',
        'css/lightbox.min.css',
        'css/main.css'
    );

    public function __construct() {
        
    }

    public function config_js() {
        return array_merge($this->default_js, $this->custom_js);
    }

    public function config_css() {
        return array_merge($this->default_css, $this->custom_css);
    }

    public function jsDefault($plugin_name, $version) {
        $translation = array(
            'path_plugin' => LACC_ADMINGEN_APP,
            'admin_url' => admin_url(),
            'site_url' => site_url());
        wp_register_script('adminGenMain',  LACC_ADMINGEN_APP . 'js/mainLib.js');
        wp_localize_script('adminGenMain', 'admingen', $translation);
        wp_enqueue_script('adminGenMain', '', $translation, $version, true);
    }

}
